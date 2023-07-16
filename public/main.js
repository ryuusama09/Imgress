const { app, BrowserWindow } = require("electron");
require("@electron/remote/main").initialize();
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 800,
    webPreferences: {
      enableRemoteModule: true,
    },
  });
  win.loadURL("http://localhost:3000");
};

app.on("ready", createWindow);
