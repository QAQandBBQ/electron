const {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  globalShortcut,
} = require("electron");
const path = require("path");
const fs = require("fs");
const os = require("os");
const localShortcut = require("electron-localshortcut");

let mainWindow;

app.whenReady().then(() => {
  createWindow();
  // createWindow1();

  ipcMain.handle("setTitle", setTitle);
  ipcMain.handle("saveFile", saveFile);
});

let win1, win2;
function createWindow1() {
  win1 = new BrowserWindow({ width: 600, height: 400 });
  win1.loadURL("https://www.baidu.com");
  localShortcut.register(win1, "Ctrl+Shift+K", () => {
    console.log("register local shortcut for win1");
  });

  win2 = new BrowserWindow({ width: 600, height: 400 });
  win2.loadURL("https://www.taobao.com");
  localShortcut.register(win2, "Ctrl+Shift+T", () => {
    console.log("register local shortcut for win2");
  });
}

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

  createGlobalShortcut();
  return;
  setTimeout(() => {
    // 返回 promise，会 resolve 一个对象，包含：
    // canceled: boolean 对话框是否被取消
    // filePaths: string[] 用户选择的文件路径数组
    /**
     * { canceled: true, filePaths: [] } r --- 点击取消
     * { canceled: false, filePaths: [ '/Users/Hary/Documents/交接文档.md' ] } r --- 点击打开
     */
    const options = {
      title: "测试标题", // macOS 不支持title； 可以通过message显示
      message: "测试标题",
      buttonLabel: "自定义按钮",
      filters: [
        // 用于根据后缀对文件类型进行过滤，值是一个数组，数组里面是一个包含 name 和 extension 属性的对象，例如：
        { name: "图片", extensions: ["jpg", "png", "gif"] },
        { name: "视频", extensions: ["mkv", "avi", "mp4"] },
        { name: "自定义文件类型", extensions: ["json"] },
        { name: "任意类型", extensions: ["*"] },
        // 需要注意的是，指定扩展名的时候不包含 .前缀。
      ],
      properties: ["showHiddenFiles"], // showHiddenFiles会展示隐藏文件 例如：.git文件....
    };
    /**
     * dialog
     * - showOpenDialog 选择对话框
     * - showSaveDialog 保存对话框
     * - showMessageBox 消息对话框
     * - showErrorBox 错误对话框
     */
    dialog
      .showOpenDialog(mainWindow, options)
      .then((r) => {
        console.log(r, "r");
      })
      .catch((err) => console.log(err, "err"));
  }, 2000);
}

/**
 * 快捷键
 */
function createGlobalShortcut() {
  // registerGlobalShortcut("Cmd+f");
  localShortcut.register(mainWindow, "Cmd+B", () => {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    } else {
      mainWindow.minimize();
    }
    console.log(
      mainWindow.isMinimized(),
      "*******register local shortcut for win2****************"
    );
  });
  // registerGlobalShortcut("Cmd+A", () => {
  //   if (mainWindow.isMinimized()) {
  //     mainWindow.restore();
  //   } else {
  //     mainWindow.minimize();
  //   }
  //   console.log(
  //     mainWindow.isMinimized(),
  //     "*******register local shortcut for win2****************"
  //   );
  // });
}

function registerGlobalShortcut(shortcut, callback) {
  if (!shortcut) return false;
  let flag = false;
  try {
    flag = globalShortcut.isRegistered(shortcut);
    if (flag) return true;
    flag = globalShortcut.register(shortcut, () => {
      callback && callback()
      console.log("toggle shortcut");
    });
  } catch (e) {
    console.error(e);
  }
  return flag;
}

function setTitle(event, title) {
  console.log(title, "title");
  if (mainWindow && title) {
    mainWindow.setTitle(title);
  }
}

function saveFile(event, content) {
  console.log(content, "**content**");
  if (content && mainWindow) {
    const title = "保存文件";
    const options = {
      title, // macOS 不支持title； 可以通过message显示
      message: title,
      buttonLabel: "自定义-保存文件",
    };
    // { canceled: false, filePaths: [ '/Users/Hary/Documents/交接文档.md' ] } r --- 点击打开
    dialog.showSaveDialog(mainWindow, options).then((res) => {
      const { canceled, filePath } = res || {};
      console.log(res, "res");
      if (canceled) return;
      saveFileToPath(filePath, content);
    });
  }
}

/**
 * 根据文件path和content，生成对应的文件
 */
function saveFileToPath(filePath, content) {
  // if (!fs.existsSync(filePath)) {
  //   const desktopDir = path.join(os.homedir(), "Desktop");
  //   console.log(desktopDir, "desktopDir");
  //   filePath = path.join(desktopDir, "new-file.txt");
  //   console.log(filePath)
  //   console.log(`Path does not exist. Saving file to ${filePath}`);
  // }
  console.log(filePath);

  // 将文件写入到指定路径文件中
  fs.writeFileSync(filePath, content, "utf-8");

  console.log(`File saved to ${filePath}`);
}
