/* eslint-disable @typescript-eslint/no-var-requires */
const { app, BrowserWindow } = require("electron");
const log = require("electron-log");
const utils = require("./utils");
const achievements = require("./achievements");
const menu = require("./menu");
const api = require("./api-server");
const cp = require("child_process");
const path = require("path");
const fs = require("fs");
const { windowTracker } = require("./windowTracker");
const { fileURLToPath } = require("url");

const debug = process.argv.includes("--debug");

async function createWindow(killall) {
  const setStopProcessHandler = global.app_handlers.stopProcess;

  let icon;
  if (process.platform == "linux") {
    icon = path.join(__dirname, "icon.png");
  }

  const tracker = windowTracker("main");
  const window = new BrowserWindow({
    icon,
    show: false,
    backgroundThrottling: false,
    backgroundColor: "#000000",
    title: "Bitburner",
    x: tracker.state.x,
    y: tracker.state.y,
    width: tracker.state.width,
    height: tracker.state.height,
    minWidth: 600,
    minHeight: 400,
    webPreferences: {
      nativeWindowOpen: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  setTimeout(() => tracker.track(window), 1000);
  if (tracker.state.isMaximized) window.maximize();

  window.removeMenu();
  noScripts = killall ? { query: { noScripts: killall } } : {};
  window.loadFile("index.html", noScripts);
  window.show();
  if (debug) window.webContents.openDevTools();

  window.webContents.on("new-window", async function (e, url) {
    // Let's make sure sure we have a proper url
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch (_) {
      // This is an invalid url, let's just do nothing
      log.warn(`Invalid url found: ${url}`);
      e.preventDefault();
      return;
    }

    // make sure local urls stay in electron perimeter
    if (url.substr(0, "file://".length) === "file://") {
      const requestedPath = fileURLToPath(url);
      const appPath = path.parse(app.getAppPath());
      const filePath = path.parse(requestedPath);
      const isChild = filePath.dir.startsWith(appPath.dir);

      // eslint-disable-next-line no-sync
      const fileExists = fs.existsSync(requestedPath);

      if (!isChild) {
        // If we're not relative to our app's path let's abort
        log.warn(
          `Requested path ${filePath.dir}${path.sep}${filePath.base} is not relative to the app: ${appPath.dir}${path.sep}${appPath.base}`,
        );
        e.preventDefault();
      } else if (!fileExists) {
        // If the file does not exist let's abort
        log.warn(`Requested path ${filePath.dir}${path.sep}${filePath.base} does not exist`);
        e.preventDefault();
      }

      return;
    }

    if (process.platform === "win32") {
      // If we have parameters in the URL, explorer.exe won't register the URL and will open the file explorer instead.
      let urlToOpen = parsedUrl.toString();
      if (parsedUrl.search) {
        log.log(`Cannot open a path with parameters: ${parsedUrl.search}`);
        urlToOpen = urlToOpen.replace(parsedUrl.search, "");
        // It would be possible to launch an URL with parameter using this, but it would mess up the process again...
        // const escapedUri = parsedUrl.href.replace('&', '^&');
        // cp.spawn("cmd.exe", ["/c", "start", escapedUri], { detached: true, stdio: "ignore" });
      }

      cp.spawn("explorer", [urlToOpen], { detached: true, stdio: "ignore" });
    } else {
      // and open every other protocols on the browser
      utils.openExternal(url);
    }
    e.preventDefault();
  });
  window.webContents.backgroundThrottling = false;

  achievements.enableAchievementsInterval(window);
  utils.attachUnresponsiveAppHandler(window);
  utils.setZoomFactor(window);

  try {
    await api.initialize(window);
  } catch (error) {
    log.error(error);
    utils.showErrorBox("Error starting http server", error);
  }

  menu.refreshMenu(window);
  setStopProcessHandler(app, window, true);

  return window;
}

module.exports = {
  createWindow,
};
