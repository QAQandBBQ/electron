const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let win = null;

function createWindow(params) {
  win = new BrowserWindow({
    width: 600,
    height: 500,
    frame: false,
    webPreferences: {
      sandbox: false,
      preload: path.join(__dirname, "../preload/index.js"),
    },
  });

  win.loadFile(path.join(__dirname, "../renderer/index.html"));

  win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  // 关闭程序
  ipcMain.handle("closeWindow", () => {
    console.log("关闭窗口");
    win.close();
  });
  // 最小化窗口
  ipcMain.handle("minimize", () => {
    console.log("最小化窗口");
    win.minimize();
  });
  // 最大化或还原窗口
  ipcMain.handle("maximize", () => {
    console.log("最小化窗口");
    const win = BrowserWindow.getFocusedWindow();
    const isFull = win.isFullScreen();
    console.log("isFull：", isFull);
    win.setFullScreen(!isFull);
  });
});
