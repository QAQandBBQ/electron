const { session, app, BrowserWindow } = require("electron");

app.whenReady().then(() => {
  createWindow();

  // rewriteUserAgent();
  // cors();
  // forward();
});

let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });

  // mainWindow.loadURL("https://github.com/");
  mainWindow.loadURL("https://sogou.com/");
  // mainWindow.loadURL("http://127.0.0.1:8080/test.html");

  mainWindow.webContents.openDevTools({ mode: "bottom" });

  forwardSouGou()

  // https://dlweb.sogoucdn.com/pcsearch/web/index/images/logo_440x140_31de1d2.png?v=d6bfe569
}

/**
 * 重写 User-Agent
 */
function rewriteUserAgent() {
  const filter = {
    urls: ["https://*.cn.bing.com/*"],
  };

  session.defaultSession.webRequest.onBeforeSendHeaders(
    filter,
    (details, callback) => {
      details.requestHeaders["User-Agent"] = "MyAwesomeAgent";
      console.log(details, "details");
      callback({ requestHeaders: details.requestHeaders });
    }
  );
}

/**
 * 跨域的问题
 */
function cors() {
  const filter = {
    urls: ["http://localhost:*/*"],
  };

  mainWindow.webContents.session.webRequest.onHeadersReceived(
    filter,
    (details, callback) => {
      const { responseHeaders } = details;
      // 允许所有来源访问
      responseHeaders["Access-Control-Allow-Origin"] = ["*"];
      console.log(responseHeaders, "responseHeaders");
      callback({ responseHeaders });
    }
  );
}

/**
 * 请求转发
 */
function forward() {
  const filter = {
    urls: ["http://localhost:3030/*"],
  };
  mainWindow.webContents.session.webRequest.onBeforeRequest(
    filter,
    (details, callback) => {
      callback({ redirectURL: "http://localhost:4000" });
    }
  );
}

function forwardSouGou() {
  const filter = {
    urls: ["https://dlweb.sogoucdn.com/pcsearch/web/index/images/logo_880x280_06c7476.png*"],
  };
  mainWindow.webContents.session.webRequest.onBeforeRequest(
    filter,
    (details, callback) => {
      callback({ redirectURL: "https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png" });
    }
  );
}
