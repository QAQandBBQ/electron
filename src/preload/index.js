const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("preload", {
  setTitle: (title) => {
    ipcRenderer.invoke("setTitle", title);
    console.log(title, "**setTitle**");
  },
  save: (content) => {
    ipcRenderer.invoke("saveFile", content);
    console.log(content, "==content==");
  },
});
