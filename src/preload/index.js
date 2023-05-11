const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("preload", {
  setTitle: (title) => {
    ipcRenderer.invoke("setTitle", title);
    console.log(title, "**setTitle**");
  },
});
