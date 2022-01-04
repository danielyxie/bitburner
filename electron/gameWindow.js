/* eslint-disable @typescript-eslint/no-var-requires */
const { app, BrowserWindow } = require("electron");
const log = require("electron-log");
const utils = require("./utils");
const achievements = require("./achievements");
const menu = require("./menu");
const api = require("./api-server");

const debug = process.argv.includes("--debug");

async function createWindow(killall) {
  const setStopProcessHandler = global.app_handlers.stopProcess
  const window = new BrowserWindow({
    show: false,
    backgroundThrottling: false,
    backgroundColor: "#000000",
  });

  window.removeMenu();
  window.maximize();
  noScripts = killall ? { query: { noScripts: killall } } : {};
  window.loadFile("index.html", noScripts);
  window.show();
  if (debug) window.webContents.openDevTools();

  window.webContents.on("new-window", function (e, url) {
    // make sure local urls stay in electron perimeter
    if (url.substr(0, "file://".length) === "file://") {
      return;
    }

    // and open every other protocols on the browser
    e.preventDefault();
    utils.openExternal(url);
  });
  window.webContents.backgroundThrottling = false;

  achievements.enableAchievementsInterval(window);
  utils.attachUnresponsiveAppHandler(window);

  try {
    await api.initialize(window);
  } catch (error) {
    log.error(error);
    utils.showErrorBox('Error starting http server', error);
  }

  menu.refreshMenu(window);
  setStopProcessHandler(app, window, true);

  return window;
}

module.exports = {
  createWindow,
}
