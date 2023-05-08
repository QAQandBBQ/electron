const { app, BrowserWindow, ipcMain, Menu, Tray } = require("electron");
const path = require("path");
const { tpl, ownTpl, trayMenu } = require("../config/menu.js");
const fs = require("fs");

let win = null;

function createWindow(params) {
  win = new BrowserWindow({
    width: 600,
    height: 500,
    // frame: false,
    webPreferences: {
      sandbox: false,
      preload: path.join(__dirname, "../preload/index.js"),
    },
  });

  win.loadFile(path.join(__dirname, "../renderer/index.html"));

  win.webContents.openDevTools();
  let newTpl = [...tpl];
  if (process.platform === "darwin") {
    newTpl.unshift({ label: "" });
  }
  const menu = Menu.buildFromTemplate(newTpl);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  createWindow();
  onTray();
  // createDockMenu();

  // installMenuPopup();
});

function _popupMenu() {
  const menu = Menu.buildFromTemplate(tpl);
  setTimeout(() => {
    menu.popup({
      callback: () => {
        console.log("menu closed");
      },
    });
  }, 3000);
}

// 托盘操作
function onTray() {
  const tray = new Tray(path.join(__dirname, "icon.png"));
  const contextMenu = Menu.buildFromTemplate(trayMenu);
  tray.setToolTip("This is hary application~");
  tray.setContextMenu(contextMenu);

  // 2s之后，自动弹出托盘菜单
  setTimeout(() => {
    const popUpMenu = Menu.buildFromTemplate(trayMenu.slice(1));
    tray.popUpContextMenu(popUpMenu);
  }, 2000);
  // 托盘事件
  // tray.on("click", () => {
  //   console.log("tray clicked");
  // });
  tray.on("drop-files", (event, files) => {
    const [file] = files || [];
    if (file && win) {
      // const result = fs.readFileSync(file);
      // console.log(result, "==");
      const newWin = new BrowserWindow({
        width: 600,
        height: 500,
      });
      newWin.loadFile(file);
    }
    console.log(files, "tray drop-files");
  });
}

// Dock菜单
function createDockMenu() {
  const menu = Menu.buildFromTemplate(tpl);
  app.dock.setMenu(menu);
}

/**
 * 「点击弹出菜单」
 */
let popMenu = null;
function popupMenu() {
  if (!popMenu) {
    const formatTpl = ownTpl.map((item) => {
      const { key, click } = item;
      return {
        ...item,
        click: () => {
          const fn = {
            bold: () => {
              win.webContents.send("bold");
            },
            color: () => {
              win.webContents.send("color");
            },
          }[key];
          fn && fn();
          click && click();
        },
      };
    });
    popMenu = Menu.buildFromTemplate(formatTpl);
  }
  popMenu.popup();
}

function installMenuPopup() {
  ipcMain.handle("installMenuPopup", (event) => {
    popupMenu();
  });
}
