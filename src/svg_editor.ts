import * as vscode from 'vscode';
import DisposableArray from './disposable_array';

export class SvgEditor implements vscode.Disposable {
    public static readonly viewType = 'svg-forge.editor';

    panel: vscode.WebviewPanel;
    diss: DisposableArray<vscode.Disposable> = new DisposableArray();

    constructor(panel: vscode.WebviewPanel) {
        this.panel = panel;
    }

    dispose() {
        this.diss.dispose();
    }

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
        let editor = new SvgEditor(panel);

        editor.diss.arr.push(vscode.workspace.onDidSaveTextDocument(e => {
            if (e.fileName == file.fileName)
                editor.reload(e);
        }));

        editor.panel.webview.html = editor.svgGui(context.extensionUri, file);
        editor.panel.onDidDispose(() => editor.dispose());

        context.subscriptions.push(editor);
    }

    svgGui(extensionUri: vscode.Uri, file: vscode.TextDocument) {
        const styleUri = this.panel.webview.asWebviewUri(
            vscode.Uri.joinPath(extensionUri, 'media', 'style.css')
        );
        const scriptUri = this.panel.webview.asWebviewUri(
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

    reload(file: vscode.TextDocument) {
        this.panel.webview.postMessage({
            action: "update",
            content: file.getText(),
        });
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
