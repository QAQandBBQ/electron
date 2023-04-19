const { app, BrowserWindow } = require("electron");
const path = require("path");

let mainWindow;

// 设置协议
const protocol = "juejin";
const scheme = `${protocol}://`;
app.setAsDefaultProtocolClient(protocol);

let urlParams = {};

handleSchemeWakeUp(process.argv);

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  // 如果是多次点击应用程序 需要显示主程序，并放置在最上层
  app.on("second-instance", (event, argv) => {
    mainWindow.restore();
    mainWindow.show();
    handleSchemeWakeUp(argv);
  });
}

app.on("open-url", (event, url) => handleSchemeWakeUp(url));

app.whenReady().then(() => {
  createWindow();
});

function createWindow() {
  const width = parseInt(urlParams.width) || 800;
  const height = parseInt(urlParams.height) || 600;
  if (mainWindow) {
    mainWindow.setSize(width, height);
  } else {
    mainWindow = new BrowserWindow({ width, height });
    mainWindow.loadURL("https://juejin.cn");
    // mainWindow.webContents.openDevTools();
  }
}

// TODO: 分屏的时候没有定位到应用
function handleSchemeWakeUp(argv) {
  // mac 是支持scheme协议的
  const url = [].concat(argv).find((v) => v.startsWith(scheme));
  if (!url) return;

  const searchParams = new URLSearchParams(url.slice(scheme.length));
  urlParams = Object.fromEntries(searchParams.entries());
  console.log(urlParams, searchParams, searchParams.entries(), "searchParams");
  if (app.isReady()) createWindow();
}

// app.whenReady().then(() => {
//   win = new BrowserWindow({
//     width: 800,
//     height: 600,
//     titleBarStyle: "hiddenInset",
//   });
//   win.webContents.openDevTools();
//   win.loadFile(path.join(__dirname, "../renderer/index.html"));
// });
