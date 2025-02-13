import * as vscode from 'vscode';

class DisposableArray<T extends vscode.Disposable> implements vscode.Disposable {
    arr: Array<T> = [];

    dispose() {
        this.arr.forEach(d => d.dispose());
    }
}

export default DisposableArray;
