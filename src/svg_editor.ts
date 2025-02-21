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
        const getMediaUri = (...path: string[]) => this.panel.webview.asWebviewUri(
            vscode.Uri.joinPath(extensionUri, 'media', ...path)
        );
        const scriptUri = this.panel.webview.asWebviewUri(
            vscode.Uri.joinPath(extensionUri, 'media', 'script.js')
        );

        return SvgEditor.htmlSkeleton(
            `<link href="${getMediaUri('style.css')}" rel="stylesheet" />`,
            `<nav class="menu">
                <div>
                    <div class="select-wrapper">
                        <div
                            class="select"
                            onclick="scaleOption.classList.toggle('visible')"
                        >
                            <p id="scale-display">100%</p>
                            <img src="${getMediaUri('icons', 'expand.svg')}" />
                        </div>
                        <div class="options">
                            <option value="0.25">25%</option>
                            <option value="0.5">50%</option>
                            <option value="0.75">75%</option>
                            <option value="1">100%</option>
                            <option value="1.25">125%</option>
                            <option value="1.5">150%</option>
                            <option value="1.75">175%</option>
                            <option value="2">200%</option>
                            <option value="3">300%</option>
                            <option value="4">400%</option>
                            <option value="null">Fit screen</option>
                        </div>
                    </div>
                    <button onclick="svgState.center()">
                        <img src="${getMediaUri('icons', 'center.svg')}" />
                    </button>

                    <div class="divider"></div>

                    <button class="theme" onclick="setBg(this)">
                        T
                    </button>
                    <button
                        class="theme dark"
                        onclick="setBg(this)"
                        data-theme="dark"
                    ></button>
                    <button
                        class="theme light"
                        onclick="setBg(this)"
                        data-theme="light"
                    ></button>

                    <div class="divider"></div>

                    <button
                        class="action selected"
                        onclick="setAction(this, Action.CURSOR)"
                    >
                        <img src="${getMediaUri('icons', 'cursor.svg')}" />
                    </button>
                    <button
                        class="action"
                        onclick="setAction(this, Action.ADD_LINE)"
                    >
                        <img src="${getMediaUri('icons', 'line.svg')}" />
                    </button>
                    <button
                        class="action"
                        onclick="setAction(this, Action.ADD_CIRCLE)"
                    >
                        <img src="${getMediaUri('icons', 'circle.svg')}" />
                    </button>
                    <button
                        class="action"
                        onclick="setAction(this, Action.ADD_RECT)"
                    >
                        <img src="${getMediaUri('icons', 'rect.svg')}" />
                    </button>
                </div>
                <div>
                    <p id="mouse-pos"></p>
                </div>
            </nav>

            <section class="svg-view">
                <div class="svg-wrapper">
                    ${file.getText()}
                </div>
            </section>

            <script src="${getMediaUri('script.js')}" type="module"></script>`
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
                    <script>
                        const vscode = acquireVsCodeApi();
                    </script>
                    ${head}
                </head>
                <body style="display:block; width: 100vw; height: 100vh; padding: 0; margin: 0; overflow: hidden">
                    ${content}
                </body>
            </html>`;
    }
}
