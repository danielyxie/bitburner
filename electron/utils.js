/* eslint-disable @typescript-eslint/no-var-requires */
const { app, dialog, shell } = require("electron");
const log = require("electron-log");

const achievements = require("./achievements");
const api = require("./api-server");

const Config = require("electron-config");
const config = new Config();

function reloadAndKill(window, killScripts) {
  const setStopProcessHandler = global.app_handlers.stopProcess;
  const createWindowHandler = global.app_handlers.createWindow;

  log.info("Reloading & Killing all scripts...");
  setStopProcessHandler(app, window, false);

  achievements.disableAchievementsInterval(window);
  api.disable();

  window.webContents.forcefullyCrashRenderer();
  window.on("closed", () => {
    // Wait for window to be closed before opening the new one to prevent race conditions
    log.debug("Opening new window");
    createWindowHandler(killScripts);
  });

  window.close();
}

function promptForReload(window) {
  detachUnresponsiveAppHandler(window);
  dialog
    .showMessageBox({
      type: "error",
      title: "Bitburner > Application Unresponsive",
      message: "The application is unresponsive, possibly due to an infinite loop in your scripts.",
      detail:
        " Did you forget a ns.sleep(x)?\n\n" +
        "The application will be restarted for you, do you want to kill all running scripts?",
      buttons: ["Restart", "Cancel"],
      defaultId: 0,
      checkboxLabel: "Kill all running scripts",
      checkboxChecked: true,
      noLink: true,
    })
    .then(({ response, checkboxChecked }) => {
      if (response === 0) {
        reloadAndKill(window, checkboxChecked);
      } else {
        attachUnresponsiveAppHandler(window);
      }
    });
}

function attachUnresponsiveAppHandler(window) {
  window.unresponsiveHandler = () => promptForReload(window);
  window.on("unresponsive", window.unresponsiveHandler);
}

function detachUnresponsiveAppHandler(window) {
  window.off("unresponsive", window.unresponsiveHandler);
}

function showErrorBox(title, error) {
  dialog.showErrorBox(title, `${error.name}\n\n${error.message}`);
}

function exportSaveFromIndexedDb() {
  return new Promise((resolve) => {
    const dbRequest = indexedDB.open("bitburnerSave");
    dbRequest.onsuccess = () => {
      const db = dbRequest.result;
      const transaction = db.transaction(["savestring"], "readonly");
      const store = transaction.objectStore("savestring");
      const request = store.get("save");
      request.onsuccess = () => {
        const file = new Blob([request.result], { type: "text/plain" });
        const a = document.createElement("a");
        const url = URL.createObjectURL(file);
        a.href = url;
        a.download = "save.json";
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          resolve();
        }, 0);
      };
    };
  });
}

async function exportSave(window) {
  await window.webContents.executeJavaScript(`${exportSaveFromIndexedDb.toString()}; exportSaveFromIndexedDb();`, true);
}

async function writeTerminal(window, message, type = null) {
  await window.webContents.executeJavaScript(`window.appNotifier.terminal("${message}", "${type}");`, true);
}

async function writeToast(window, message, type = "info", duration = 2000) {
  await window.webContents.executeJavaScript(`window.appNotifier.toast("${message}", "${type}", ${duration});`, true);
}

function openExternal(url) {
  shell.openExternal(url);
  global.app_playerOpenedExternalLink = true;
}

function getZoomFactor() {
  const configZoom = config.get("zoom", 1);
  return configZoom;
}

function setZoomFactor(window, zoom = null) {
  if (zoom === null) {
    zoom = 1;
  } else {
    config.set("zoom", zoom);
  }
  window.webContents.setZoomFactor(zoom);
}

module.exports = {
  reloadAndKill,
  showErrorBox,
  exportSave,
  attachUnresponsiveAppHandler,
  detachUnresponsiveAppHandler,
  openExternal,
  writeTerminal,
  writeToast,
  getZoomFactor,
  setZoomFactor,
};
