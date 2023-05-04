const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let win = null;

function createWindow(params) {
  win = new BrowserWindow({
    width: 600,
    height: 500,
    // titleBarStyle: "hiddenInset",
    resizable: false,
    frame: false,
    transparent: true,
    webPreferences: {
      sandbox: false,
      preload: path.join(__dirname, "../preload/index.js"),
    },
  });
  win.setIgnoreMouseEvents(true);
  win.loadFile(path.join(__dirname, "../renderer/index.html"));
  ipcMain.on("set-ignore-mouse-events", (event, ...args) => {
    console.log(...args, ":set-ignore-mouse-events");
    BrowserWindow.fromWebContents(event.sender).setIgnoreMouseEvents(...args);
  });

  win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();
});
