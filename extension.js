const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.removeUserAgent', function () {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('No file is open');
            return;
        }

        const document = editor.document;
        const filePath = document.fileName;

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                vscode.window.showErrorMessage('Error reading file: ' + err.message);
                return;
            }

            const lines = data.split(/\r?\n/);
            const filteredLines = lines.filter(line => !line.match(/^User-Agent: .+/));

            fs.writeFile(filePath, filteredLines.join('\n'), err => {
                if (err) {
                    vscode.window.showErrorMessage('Error writing file: ' + err.message);
                    return;
                }
                vscode.window.showInformationMessage('User-Agent lines removed');
            });
        });
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
}
