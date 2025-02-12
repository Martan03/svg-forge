import * as vscode from 'vscode';

export class SvgEditor {
    public static readonly viewType = 'svg-forge.editor';

    public static show(context: vscode.ExtensionContext) {
        const file = vscode.window.activeTextEditor?.document;
        if (file === undefined) {
            vscode.window.showErrorMessage("No active document.");
            return;
        }

        if (!file.fileName.endsWith(".svg")) {
            vscode.window.showErrorMessage("Active document is not SVG file.");
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            SvgEditor.viewType,
            "SVG Editor",
            vscode.ViewColumn.Beside,
            { enableScripts: true }
        );

        panel.webview.html = SvgEditor.svgGui(
            panel.webview,
            context.extensionUri,
            file,
        );

        const fileUri = file.uri;
        const fileChangeDisposable =
            vscode.workspace.onDidSaveTextDocument(saved => {
                if (saved.uri.toString() === fileUri.toString()) {
                    SvgEditor.reload(panel, context.extensionUri, file);
                }
            }
        );
        context.subscriptions.push(fileChangeDisposable);
    }

    private static svgGui(
        webview: vscode.Webview,
        extensionUri: vscode.Uri,
        file: vscode.TextDocument,
    ) {
        const styleUri = webview.asWebviewUri(
            vscode.Uri.joinPath(extensionUri, 'media', 'style.css')
        );
        const scriptUri = webview.asWebviewUri(
            vscode.Uri.joinPath(extensionUri, 'media', 'script.js')
        );

        return SvgEditor.htmlSkeleton(
            `<link href="${styleUri}" rel="stylesheet" />`,
            `<nav class="menu">
                <button onclick="setBg(null)">T</button>
                <button class="theme dark" onclick="setBg('dark')"></button>
                <button class="theme light" onclick="setBg('light')"></button>
            </nav>

            <section class="svg-view">
                <div class="svg-wrapper">
                    ${file.getText()}
                </div>
            </section>

            <script src="${scriptUri}"></script>`
        );
    }

    private static reload(
        panel: vscode.WebviewPanel,
        extUri: vscode.Uri,
        file: vscode.TextDocument
    ) {
        panel.webview.html = SvgEditor.svgGui(panel.webview, extUri, file);
    }

    private static htmlSkeleton(head: string, content: string): string {
        return `<!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0"
                    >
                    <title>svg-forge</title>
                    ${head}
                </head>
                <body style="display:block; width: 100vw; height: 100vh; padding: 0; margin: 0; overflow: hidden">
                    ${content}
                </body>
            </html>`;
    }
}
