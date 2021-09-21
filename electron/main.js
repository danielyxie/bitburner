const { app, BrowserWindow, Menu, globalShortcut, shell } = require("electron");

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
  // win.webContents.openDevTools();
  globalShortcut.register("f5", function () {
    win.loadFile("index.html");
  });
  globalShortcut.register("f8", function () {
    win.loadFile("index.html", { query: { noScripts: "true" } });
  });

  win.webContents.on("new-window", function (e, url) {
    // make sure local urls stay in electron perimeter
    if ("file://" === url.substr(0, "file://".length)) {
      return;
    }

    // and open every other protocols on the browser
    e.preventDefault();
    shell.openExternal(url);
  });
}

app.whenReady().then(() => {
  createWindow();
});
