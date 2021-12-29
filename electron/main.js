/* eslint-disable no-process-exit */
/* eslint-disable @typescript-eslint/no-var-requires */
const { app } = require("electron");
const log = require("electron-log");
const greenworks = require("./greenworks");
const api = require("./api-server");
const gameWindow = require("./gameWindow");
const achievements = require("./achievements");
const utils = require("./utils");

log.catchErrors();
log.info(`Started app: ${JSON.stringify(process.argv)}`);

process.on('uncaughtException', function () {
  // The exception will already have been logged by electron-log
  process.exit(1);
});

if (greenworks.init()) {
  log.info("Steam API has been initialized.");
} else {
  log.warn("Steam API has failed to initialize.");
}

function setStopProcessHandler(app, window, enabled) {
  const closingWindowHandler = async (e) => {
    // We need to prevent the default closing event to add custom logic
    e.preventDefault();

    // First we clear the achievement timer
    achievements.disableAchievementsInterval(window);

    // Shutdown the http server
    api.disable();

    // We'll try to execute javascript on the page to see if we're stuck
    let canRunJS = false;
    window.webContents.executeJavaScript('window.stop(); document.close()', true)
      .then(() => canRunJS = true);
    setTimeout(() => {
      // Wait a few milliseconds to prevent a race condition before loading the exit screen
      window.webContents.stop();
      window.loadFile("exit.html")
    }, 20);

    // Wait 200ms, if the promise has not yet resolved, let's crash the process since we're possibly in a stuck scenario
    setTimeout(() => {
      if (!canRunJS) {
        // We're stuck, let's crash the process
        log.warn('Forcefully crashing the renderer process');
        gameWindow.webContents.forcefullyCrashRenderer();
      }

      log.debug('Destroying the window');
      window.destroy();
    }, 200);
  }

  const clearWindowHandler = () => {
    window = null;
  };

  const stopProcessHandler = () => {
    log.info('Quitting the app...');
    app.isQuiting = true;
    app.quit();
    process.exit(0);
  };

  if (enabled) {
    log.debug('Adding closing handlers');
    window.on("closed", clearWindowHandler);
    window.on("close", closingWindowHandler)
    app.on("window-all-closed", stopProcessHandler);
  } else {
    log.debug('Removing closing handlers');
    window.removeListener("closed", clearWindowHandler);
    window.removeListener("close", closingWindowHandler);
    app.removeListener("window-all-closed", stopProcessHandler);
  }
}

function startWindow(noScript) {
  gameWindow.createWindow(noScript);
}

utils.initialize(setStopProcessHandler, startWindow);

app.whenReady().then(async () => {
  log.info('Application is ready!');
  utils.initialize(setStopProcessHandler, startWindow);
  startWindow(process.argv.includes("--no-scripts"))
});
