const { app, BrowserWindow, ipcMain, Menu, Tray } = require("electron");
const path = require("path");
const { tpl, ownTpl, trayMenu } = require("../config/menu.js");
const fs = require("fs");
const width = 300;
const height = 420;

let win = null;

function createWindow(params) {
  win = new BrowserWindow({
    width,
    height,
    frame: false,
    resizable: false,
    show: false, // 注意这里 BrowserWindow 默认设置为不显示（show: false），只有当用户点击托盘图标的时候，才展示这个窗口。
    movable: false,
    minimizable: false,
    maximizable: false,
    webPreferences: {
      sandbox: false,
      preload: path.join(__dirname, "../preload/index.js"),
    },
  });

  win.loadFile(path.join(__dirname, "../renderer/index.html"));

  win.setVisibleOnAllWorkspaces(true);

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
  trayCounter();
  // createDockMenu();

  // installMenuPopup();
});

/**
 * 托盘-计算器
 */
function trayCounter() {
  const tray = new Tray(path.join(__dirname, "icon.png"));
  // const posi = tray.getBounds();
  // console.log(posi); // { x: 0, y: 900, width: 32, height: 24 }

  tray.on("click", () => {
    const trayBounds = tray.getBounds();
    console.log(trayBounds, "trayBounds");
    win.setPosition(
      trayBounds.x + trayBounds.width / 2 - width / 2,
      trayBounds.y + trayBounds.height / 2 - height / 2
    );
    if (win.isVisible()) {
      win.hide();
    } else {
      win.show();
    }
  });
  // 当窗口失去焦点，自动隐藏
  win.on("blur", () => {
    win.hide();
  });
}

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
