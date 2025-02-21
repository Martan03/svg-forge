// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { SvgEditor } from './svg_editor';
import DisposableArray from './disposable_array';

let editors: DisposableArray<SvgEditor> = new DisposableArray();

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand(
        'svg-forge.editor',
        () => svgEditor(context)
    );

    context.subscriptions.push(disposable);
    context.subscriptions.push(editors);
}

// This method is called when your extension is deactivated
export function deactivate() {}

function svgEditor(context: vscode.ExtensionContext) {
    const file = vscode.window.activeTextEditor?.document;
	if (file === undefined) {
		vscode.window.showErrorMessage("No active document.");
		return;
	}

	if (!file.fileName.endsWith(".svg")) {
		vscode.window.showErrorMessage("Active document is not SVG file.");
		return;
	}

    let panel = vscode.window.createWebviewPanel(
        SvgEditor.viewType,
        `Preview ${file.fileName.split('/').at(-1)}`,
        vscode.ViewColumn.Beside,
        {
            enableScripts: true,
            retainContextWhenHidden: true,
        }
    );
	let editor = new SvgEditor(panel);

    editor.diss.arr.push(vscode.workspace.onDidSaveTextDocument((e) => {
        if (e.fileName == file.fileName) {
            editor.reload(e);
        }
    }));

    editors.arr.push(editor);

    editor.panel.webview.html = editor.svgGui(context.extensionUri, file);
    editor.panel.onDidDispose(() => {
        editor.dispose();
        let i = editors.arr.indexOf(editor);
        editors.arr.splice(i, 1);
    });

	editor.panel.webview.onDidReceiveMessage((message) => {
		if (message.action === "updateSvg") {
			updateSvgFile(file, message.content);
		}
	});
}

function updateSvgFile(file: vscode.TextDocument, newContent: string) {
    const edit = new vscode.WorkspaceEdit();
    const fullRange = new vscode.Range(
        file.lineAt(0).range.start,
        file.lineAt(file.lineCount - 1).range.end
    );

    edit.replace(file.uri, fullRange, newContent);

    vscode.workspace.applyEdit(edit).then(success => {
        if (success) {
            file.save();
        } else {
            vscode.window.showErrorMessage("Failed to update SVG file.");
        }
    });
}
