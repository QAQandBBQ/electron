const { ipcRenderer, contextBridge } = require("electron");

// 设置window全局变量
contextBridge.exposeInMainWorld("preload", {
  // 点击弹出弹窗
  popupMenu: () => {
    console.log("popupMenu");
    const callbackMap = {
      bold: () => {
        console.log("ipcRender bold");
      },
      color: () => {
        console.log("ipcRender color");
      },
    };
    ipcRenderer.invoke("installMenuPopup", 12);
  },
});

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector("#btn");
  ipcRenderer.on("bold", () => {
    btn.style["font-weight"] = "bold";
  });
  ipcRenderer.on("color", () => {
    btn.style["color"] = "red";
  });
});
