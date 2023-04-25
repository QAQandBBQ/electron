const os = require("os");
const fs = require("fs");
const path = require("path");
const { contextBridge, ipcRenderer } = require("electron");
const platform = os.platform();
const release = os.release();

/**
 * 在低版本的 Electron 版本中（例如 Electron 5.0）是没有 invoke 和 handle 方法的，请用 send 和 reply 方法来实现这两个 API。
 */
let a = 1;
ipcRenderer.myInvoke = (key, ...invokeArgs) => {
  return new Promise((resolve, reject) => {
    ipcRenderer.resolve = resolve;
    // 首次需要先监听reply回来的数据，第二次不用监听
    if (!ipcRenderer.flag) {
      ipcRenderer.on(`${key}_reply`, (event, ...arg) => {
        console.log(...arg, a, "reply - 17");
        ipcRenderer.resolve(...arg);
      });
      ipcRenderer.flag = true;
    }
    a++;
    // 直接发送信息
    ipcRenderer.send(key, ...invokeArgs);
  });
};

// send reply ---> 先监听异步回复消息，然后在send消息，再主进程reply消息时此处会响应
ipcRenderer.on("async-reply", (event, arg) => {
  console.log("异步消息:", arg);
});

// 有一点需要特别注意的是：preload.js 脚本注入的时机非常之早，执行该脚本的时候，index.html 还没有开始解析，
console.log("preload index.js");

// 注入一个全局方法 是的html中也能使用
// onblur 会有命名冲突检测 cannot bind an API on top of an existing property on the window object
// contextBridge.exposeInMainWorld("onblur", {
contextBridge.exposeInMainWorld("myAPI", {
  ok: (num) => {
    console.log("myAPI:ok  ", num);
  },
  saveFileToPath,
  setTheme: (theme) => {
    // ipcRenderer.invoke("setTheme", theme, "第二个参数").then((val) => {
    //   console.log(val, "invoke reply");
    // });
    ipcRenderer.myInvoke("setTheme", theme, "第二个参数").then((val) => {
      console.log(val, "myInvoke reply");
    });
  },
  send: ipcRenderer.send,
  on: ipcRenderer.on,
  sendMsg: (type) => {
    // ipcRenderer.send("isDarkMode", "hello a");
    // ipcRenderer.on("isDarkMode", (event, ...arg) => {
    //   console.log("send reply", ...arg);
    // });
    //异步消息
    // ipcRenderer.send("isDarkMode", "发个异步消息");

    console.log(type);
  },
});

/**
 * 根据文件path和content，生成对应的文件
 */
function saveFileToPath(filePath, content) {
  console.log({ filePath, content });
  if (!fs.existsSync(filePath)) {
    const desktopDir = path.join(os.homedir(), "Desktop");
    console.log(desktopDir, "desktopDir");
    filePath = path.join(desktopDir, "new-file.txt");
    console.log(`Path does not exist. Saving file to ${path}`);
  }

  // 将文件写入到指定路径文件中
  fs.writeFileSync(filePath, content, "utf-8");

  console.log(`File saved to ${path}`);
}

// 所以不能立即操作 DOM，需要在 DOMContentLoaded 事件之后再操作：
// document.addEventListener("DOMContentLoaded", () => {
//   console.log("platform", platform);
//   console.log("release", release);
//   document.querySelector("#platform").append(platform);
//   document.querySelector("#release").append(release);
// });

// window.fromPreload = "something fromPreload";
