// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const sdk = require("@zesty-io/sdk");
const fs = require("fs");
const path = require("path");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */

var instanceZuid = null;
var token = null;
var zestySDK = null;
var basePath = "";
const folders = [
  "/webengine",
  "/webengine/views",
  "/webengine/styles",
  "/webengine/scripts",
];

function makeDir(dir) {
  if (fs.existsSync(dir)) return;
  fs.mkdirSync(dir);
}

function makeFolders(folders) {
  folders.forEach((folder) => makeDir(basePath + folder));
}

function makeFileSync(type, filename, content) {
  var file = basePath;
  if (type === "view") file += `${folders[1]}/${filename}`;
  if (type === "style") file += `${folders[2]}/${filename}`;
  if (type === "script") file += `${folders[3]}/${filename}`;
  if (!fs.existsSync(file)) {
    makeDir(path.dirname(file));
    fs.writeFileSync(file, content);
  }
}

async function syncInstanceView() {
  const views = await zestySDK.instance.getViews();
  views.data.forEach((view) =>
    makeFileSync("view", view.fileName + ".html", view.code || "")
  );
}

async function syncInstanceStyles() {
  const stylesheets = await zestySDK.instance.getStylesheets();
  stylesheets.data.forEach((stylesheet) =>
    makeFileSync("style", stylesheet.fileName, stylesheet.code)
  );
}

async function syncInstanceScipts() {}

async function activate(context) {
  try {
    basePath = vscode.workspace.workspaceFolders[0].uri.fsPath;
    const data = fs.readFileSync(`${basePath}/zesty.json`, {
      encoding: "utf8",
    });
    const zestyConfig = JSON.parse(data);
    instanceZuid = zestyConfig.instance_zuid;
    token = zestyConfig.token;
    zestySDK = new sdk(instanceZuid, token);
    await makeFolders(folders);
    await syncInstanceView();
    await syncInstanceStyles();
    await syncInstanceScipts();
  } catch (e) {
    vscode.window.showInformationMessage(e.message);
  }
  let disposable = vscode.commands.registerCommand(
    "test-extension.run",
    function () {
      vscode.window.showInformationMessage("Extension is now running!");
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
