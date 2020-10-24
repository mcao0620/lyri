const electron = require("electron");
const app = electron.app;
const path = require("path");
const isDev = require("electron-is-dev");
const BrowserWindow = electron.BrowserWindow;

const { fork } = require("child_process");
const ps = fork(`./src/webServer.js`);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    ps.kill("SIGINT");
    app.quit();
  }
});

ps.on("exit", function (code, signal) {
  console.log(
    "child process exited with " + `code ${code} and signal ${signal}`
  );
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
