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
                <button>Test1</button>
                <button>Test2</button>
            </nav>

            <section class="svg-view">
                ${file.getText()}
            </section>

            <script src="${scriptUri}"></script>`
        );
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
