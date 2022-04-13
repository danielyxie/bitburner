/* eslint-disable no-process-exit */
/* eslint-disable @typescript-eslint/no-var-requires */
const { app, dialog, BrowserWindow, ipcMain } = require("electron");
const log = require("electron-log");
const greenworks = require("./greenworks");
const api = require("./api-server");
const gameWindow = require("./gameWindow");
const achievements = require("./achievements");
const utils = require("./utils");
const storage = require("./storage");
const debounce = require("lodash/debounce");
const Config = require("electron-config");
const config = new Config();

log.transports.file.level = config.get("file-log-level", "info");
log.transports.console.level = config.get("console-log-level", "debug");

log.catchErrors();
log.info(`Started app: ${JSON.stringify(process.argv)}`);

process.on("uncaughtException", function () {
  // The exception will already have been logged by electron-log
  process.exit(1);
});

// We want to fail gracefully if we cannot connect to Steam
try {
  if (greenworks && greenworks.init()) {
    log.info("Steam API has been initialized.");
  } else {
    const error = "Steam API has failed to initialize.";
    log.warn(error);
    global.greenworksError = error;
  }
} catch (ex) {
  log.warn(ex.message);
  global.greenworksError = ex.message;
}

let isRestoreDisabled = false;

function setStopProcessHandler(app, window, enabled) {
  const closingWindowHandler = async (e) => {
    // We need to prevent the default closing event to add custom logic
    e.preventDefault();

    // First we clear the achievement timer
    achievements.disableAchievementsInterval(window);

    // Shutdown the http server
    api.disable();

    // Trigger debounced saves right now before closing
    try {
      await saveToDisk.flush();
    } catch (error) {
      log.error(error);
    }
    try {
      await saveToCloud.flush();
    } catch (error) {
      log.error(error);
    }

    // Because of a steam limitation, if the player has launched an external browser,
    // steam will keep displaying the game as "Running" in their UI as long as the browser is up.
    // So we'll alert the player to close their browser.
    if (global.app_playerOpenedExternalLink) {
      await dialog.showMessageBox({
        title: "Bitburner",
        message: "You may have to close your browser to properly exit the game.",
        detail:
          'Steam will keep tracking Bitburner as "Running" if any process started within the game is still running.' +
          " This includes launching an external link, which opens up your browser.",
        type: "warning",
        buttons: ["OK"],
      });
    }
    // We'll try to execute javascript on the page to see if we're stuck
    let canRunJS = false;
    window.webContents.executeJavaScript("window.stop(); document.close()", true).then(() => (canRunJS = true));
    setTimeout(() => {
      // Wait a few milliseconds to prevent a race condition before loading the exit screen
      window.webContents.stop();
      window.loadFile("exit.html");
    }, 20);

    // Wait 200ms, if the promise has not yet resolved, let's crash the process since we're possibly in a stuck scenario
    setTimeout(() => {
      if (!canRunJS) {
        // We're stuck, let's crash the process
        log.warn("Forcefully crashing the renderer process");
        window.webContents.forcefullyCrashRenderer();
      }

      log.debug("Destroying the window");
      window.destroy();
    }, 200);
  };

  const clearWindowHandler = () => {
    window = null;
  };

  const stopProcessHandler = () => {
    log.info("Quitting the app...");
    app.isQuiting = true;
    app.quit();
    process.exit(0);
  };

  const receivedGameReadyHandler = async (event, arg) => {
    if (!window) {
      log.warn("Window was undefined in game info handler");
      return;
    }

    log.debug("Received game information", arg);
    window.gameInfo = { ...arg };
    await storage.prepareSaveFolders(window);

    const restoreNewest = config.get("onload-restore-newest", true);
    if (restoreNewest && !isRestoreDisabled) {
      try {
        await storage.restoreIfNewerExists(window);
      } catch (error) {
        log.error("Could not restore newer file", error);
      }
    }
  };

  const receivedDisableRestoreHandler = async (event, arg) => {
    if (!window) {
      log.warn("Window was undefined in disable import handler");
      return;
    }

    log.debug(`Disabling auto-restore for ${arg.duration}ms.`);
    isRestoreDisabled = true;
    setTimeout(() => {
      isRestoreDisabled = false;
      log.debug("Re-enabling auto-restore");
    }, arg.duration);
  };

  const receivedGameSavedHandler = async (event, arg) => {
    if (!window) {
      log.warn("Window was undefined in game saved handler");
      return;
    }

    const { save, ...other } = arg;
    log.silly("Received game saved info", { ...other, save: `${save.length} bytes` });

    if (storage.isAutosaveEnabled()) {
      saveToDisk(save, arg.fileName);
    }
    if (storage.isCloudEnabled()) {
      const minimumPlaytime = 1000 * 60 * 15;
      const playtime = window.gameInfo.player.playtime;
      log.silly(window.gameInfo);
      if (playtime > minimumPlaytime) {
        saveToCloud(save);
      } else {
        log.debug(`Auto-save to cloud disabled for save game under ${minimumPlaytime}ms (${playtime}ms)`);
      }
    }
  };

  const saveToCloud = debounce(
    async (save) => {
      log.debug("Saving to Steam Cloud ...");
      try {
        const playerId = window.gameInfo.player.identifier;
        await storage.pushGameSaveToSteamCloud(save, playerId);
        log.silly("Saved Game to Steam Cloud");
      } catch (error) {
        log.error(error);
        utils.writeToast(window, "Could not save to Steam Cloud.", "error", 5000);
      }
    },
    config.get("cloud-save-min-time", 1000 * 60 * 15),
    { leading: true },
  );

  const saveToDisk = debounce(
    async (save, fileName) => {
      log.debug("Saving to Disk ...");
      try {
        const file = await storage.saveGameToDisk(window, { save, fileName });
        log.silly(`Saved Game to '${file.replaceAll("\\", "\\\\")}'`);
      } catch (error) {
        log.error(error);
        utils.writeToast(window, "Could not save to disk", "error", 5000);
      }
    },
    config.get("disk-save-min-time", 1000 * 60 * 5),
    { leading: true },
  );

  if (enabled) {
    log.debug("Adding closing handlers");
    ipcMain.on("push-game-ready", receivedGameReadyHandler);
    ipcMain.on("push-game-saved", receivedGameSavedHandler);
    ipcMain.on("push-disable-restore", receivedDisableRestoreHandler);
    window.on("closed", clearWindowHandler);
    window.on("close", closingWindowHandler);
    app.on("window-all-closed", stopProcessHandler);
  } else {
    log.debug("Removing closing handlers");
    ipcMain.removeAllListeners();
    window.removeListener("closed", clearWindowHandler);
    window.removeListener("close", closingWindowHandler);
    app.removeListener("window-all-closed", stopProcessHandler);
  }
}

async function startWindow(noScript) {
  return gameWindow.createWindow(noScript);
}

global.app_handlers = {
  stopProcess: setStopProcessHandler,
  createWindow: startWindow,
};

app.whenReady().then(async () => {
  log.info("Application is ready!");

  if (process.argv.includes("--export-save")) {
    const window = new BrowserWindow({ show: false });
    await window.loadFile("export.html", false);
    window.show();
    setStopProcessHandler(app, window, true);
    await utils.exportSave(window);
  } else {
    const window = await startWindow(process.argv.includes("--no-scripts"));
    if (global.greenworksError) {
      await dialog.showMessageBox(window, {
        title: "Bitburner",
        message: "Could not connect to Steam",
        detail: `${global.greenworksError}\n\nYou won't be able to receive achievements until this is resolved and you restart the game.`,
        type: "warning",
        buttons: ["OK"],
      });
    }
  }
});
