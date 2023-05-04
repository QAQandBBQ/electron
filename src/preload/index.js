const { ipcRenderer } = require("electron");

document.addEventListener("DOMContentLoaded", () => {
  const close = document.querySelector("#close");
  const pack = document.querySelector("#pack");
  const change = document.querySelector("#change");
  close.onclick = function () {
    ipcRenderer.invoke("closeWindow");
  };
  // 最小化 - 全屏时，最小化不会生效
  pack.onclick = function () {
    ipcRenderer.invoke("minimize");
  };
  // 全屏
  change.onclick = function () {
    console.log("最大化/还原");
    ipcRenderer.invoke("maximize");
  };
});
