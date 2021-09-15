const { app, BrowserWindow, Menu } = require("electron");
Menu.setApplicationMenu(false);
function createWindow() {
  const win = new BrowserWindow({
    show: false,
    webPreferences: {
      devTools: false,
    },
  });

  win.removeMenu();
  win.maximize();
  win.loadFile("index.html");
  win.show();
}

app.whenReady().then(() => {
  createWindow();
});
