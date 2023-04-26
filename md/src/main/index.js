const { app, BrowserWindow, nativeTheme, ipcMain } = require("electron");
const path = require("path");

let mainWindow = null;

function createWindow() {
  if (!mainWindow) {
    const options = {
      width: 800,
      height: 600,
      // titleBarStyle: "hiddenInset",
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

app.whenReady().then(() => {
  createWindow();
  // ipcMain.on("isDarkMode", (event, args) => {
  //   event.returnValue = nativeTheme.shouldUseDarkColors;
  // });

  // ipcMain.handle("isDarkMode", (event, ...args) => {
  //   return nativeTheme.shouldUseDarkColors;
  // });
  // handle只允许注册一次 Attempted to register a second handler for 'isDarkMode'
  // ipcMain.handle("isDarkMode", (event, ...args) => {
  //   return nativeTheme.shouldUseDarkColors;
  // });

  // 设置主题色
  // ipcMain.handle("setTheme", (event, theme, ...args) => {
  //   nativeTheme.themeSource = theme;
  //   console.log(theme, ...args, "theme");
  //   return "设置成功";
  // });
});

// 设置自己的myHandle 代替ipcMain自身的handle
ipcMain.myHandle = function (key, callback) {
  ipcMain.on(key, (event, ...args) => {
    let ret = null;
    if (callback) {
      ret = callback(event, ...args);
    }
    event.reply(`${key}_reply`, ret);
  });
};
let a = 1;
ipcMain.myHandle("setTheme", (event, theme, ...args) => {
  nativeTheme.themeSource = theme;
  console.log(theme, ...args, "theme");
  return `设置成功-${++a}`;
});

const theme = nativeTheme.shouldUseDarkColors;

ipcMain.on("isDarkMode", (event, arg) => {
  console.log(`async-message:我接收到了异步消息`, arg);
  event.reply("async-reply", theme);
});
