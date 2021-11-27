const { app, BrowserWindow, Menu, globalShortcut, shell } = require("electron");
const greenworks = require("./greenworks");

if (greenworks.init()) {
  console.log("Steam API has been initialized.");
  greenworks.activateAchievement("BN1.1", () => undefined);
} else {
  console.log("Steam API has failed to initialize.");
}

const debug = true;

Menu.setApplicationMenu(false);
function createWindow() {
  const win = new BrowserWindow({
    show: false,
    webPreferences: {
      devTools: debug,
    },
  });

  win.removeMenu();
  win.maximize();
  win.loadFile("index.html");
  win.show();
  if (debug) win.webContents.openDevTools();
  globalShortcut.register("f5", function () {
    win.loadFile("index.html");
  });
  globalShortcut.register("f8", function () {
    win.loadFile("index.html", { query: { noScripts: "true" } });
  });

  win.webContents.on("new-window", function (e, url) {
    // make sure local urls stay in electron perimeter
    if (url.substr(0, "file://".length) === "file://") {
      return;
    }

    // and open every other protocols on the browser
    e.preventDefault();
    shell.openExternal(url);
  });

  setInterval(async () => {
    const resp = await win.webContents.executeJavaScript("document.saveString");
    await win.webContents.executeJavaScript(`console.log('${resp}')`);
  }, 1000);
}

app.whenReady().then(() => {
  createWindow();
});
