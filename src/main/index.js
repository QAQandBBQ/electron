const { app, BrowserWindow } = require("electron");
const path = require("path");

let mainWindow = null;

function createWindow() {
  const options = {
    width: 800,
    height: 600,
  };
  mainWindow = new BrowserWindow(options);
  mainWindow.loadURL(
    "https://www.w3schools.com/html/tryit.asp?filename=tryhtml_iframe_height_width"
  );
  // mainWindow.loadFile(path.resolve(__dirname, "../renderer/index.html"));

  mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();
});
