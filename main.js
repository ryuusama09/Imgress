const path = require("path");
const { app, BrowserWindow } = require("electron");
function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: "Reverse Image Search Engine",
    width: 500,
    height: 600,
  });

  mainWindow.loadFile(path.join(__dirname, "./renderer/index.html"));
}

app.whenReady().then(() => {
  createMainWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});
