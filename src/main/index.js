const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow;

app.whenReady().then(() => {
  createWindow();

  ipcMain.handle("setTitle", setTitle);
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 800,
    webPreferences: {
      webSecurity: false,
      webviewTag: true,
      preload: path.join(__dirname, "../preload/index.js"),
    },
  });
  mainWindow.loadURL("http://127.0.0.1:8080/");
  // mainWindow.loadFile(path.join(__dirname, './index.html'))
  mainWindow.webContents.openDevTools({ mode: "bottom" });
}

function setTitle(event, title) {
  console.log(title, "title");
  if (mainWindow && title) {
    mainWindow.setTitle(title);
  }
}
