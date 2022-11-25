// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const { posix } = require("path");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */

var instanceZuid = null;
var token = null;

async function activate(context) {
  try {
    const basePath = vscode.workspace.workspaceFolders[0].uri;
    const zestyJson = basePath.with({
      path: posix.join(basePath.path, "zesty.json"),
    });
    const readData = await vscode.workspace.fs.readFile(zestyJson);
    const readStr = Buffer.from(readData).toString("utf8");
    const readJson = JSON.parse(readStr);
    instanceZuid = readJson.instance_zuid;
    token = readJson.token;
  } catch (e) {
    vscode.window.showInformationMessage("zesty.json cannot find zesty.json");
  }
  console.log(
    'Congratulations, your extension "test-extension" is now active!'
  );

  let disposable = vscode.commands.registerCommand(
    "test-extension.helloWorld",
    function () {
      vscode.window.showInformationMessage("Hello World from test-extension!");
    }
  );

  context.subscriptions.push(disposable);

  vscode.commands.registerCommand("test-extension.getAllFiels", getAllFiles);
}

// This method is called when your extension is deactivated
function deactivate() {}
async function getAllFiles() {
  vscode.window.showInformationMessage("From All Files");
}

module.exports = {
  activate,
  deactivate,
  getAllFiles,
};
