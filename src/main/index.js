const { app, BrowserWindow } = require("electron");
const path = require("path");

let mainWindow = null;

function createWindow() {
  if (!mainWindow) {
    const options = {
      width: 800,
      height: 600,
      titleBarStyle: "hiddenInset",
      // web端偏好即相关配置
      webPreferences: {
        // nodeIntegration: true, // 再web端开启nodejs环境集成
        contextIsolation: true, // 关闭上下文隔离 默认是开启隔离 preload.js 脚本和 index.html 是否共享相同的 document 和 window 对象
        // 官方不推荐暴力web端的node能力，提供了preload的能力没在preload文件下的js才有node能力
        nodeIntegration: false,
        sandbox: false,
        preload: path.join(__dirname, "../preload/index.js"),
      },
    };
    mainWindow = new BrowserWindow(options);
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));

    mainWindow.webContents.openDevTools();
  } else {
  }
}

app.whenReady().then(createWindow);
