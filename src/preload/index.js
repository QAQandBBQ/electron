const os = require("os");
const fs = require("fs");
const path = require("path");
const { contextBridge } = require("electron");
const platform = os.platform();
const release = os.release();

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
