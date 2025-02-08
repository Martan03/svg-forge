// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand(
		'svg-forge.editor',
		() => svgEditor(context),
	);

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

function svgEditor(context: vscode.ExtensionContext) {
	vscode.window.showInformationMessage('Hello World from svg-forge!');

	const file = vscode.window.activeTextEditor?.document;
	if (file === undefined) {
		vscode.window.showErrorMessage("No active document");
		return;
	}

	let panel = vscode.window.createWebviewPanel("webview", "Web View", {
		viewColumn: vscode.ViewColumn.Beside,
	})

	panel.webview.html = `${file?.getText()}`;
}
