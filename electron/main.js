/* eslint-disable no-process-exit */
/* eslint-disable @typescript-eslint/no-var-requires */
const { app, BrowserWindow, Menu, shell, dialog, clipboard } = require("electron");
const log = require('electron-log');
const greenworks = require("./greenworks");
const api = require("./api-server");

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

const debug = false;
let win = null;

const getMenu = (win) => Menu.buildFromTemplate([
  {
    label: "Edit",
    submenu: [
      { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
      { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
      { type: "separator" },
      { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
      { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
      { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
      { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" },
    ],
  },
  {
    label: "Reloads",
    submenu: [
      {
        label: "Reload",
        accelerator: "f5",
        click: () => {
          win.loadFile("index.html");
        },
      },
      {
        label: "Reload & Kill All Scripts",
        click: () => reloadAndKill(win)
      },
    ],
  },
  {
    label: "Fullscreen",
    submenu: [
      {
        label: "Toggle",
        accelerator: "f9",
        click: (() => {
          let full = false;
          return () => {
            full = !full;
            win.setFullScreen(full);
          };
        })(),
      },
    ],
  },
  {
    label: "API Server",
    submenu: [
      {
        label: api.isListening() ? 'Disable Server' : 'Enable Server',
        click: (async () => {
          await api.toggleServer();
          Menu.setApplicationMenu(getMenu());
        })
      },
      {
        label: api.isAutostart() ? 'Disable Autostart' : 'Enable Autostart',
        click: (async () => {
          api.toggleAutostart();
          Menu.setApplicationMenu(getMenu());
        })
      },
      {
        label: 'Copy Auth Token',
        click: (async () => {
          const token = api.getAuthenticationToken();
          log.log('Wrote authentication token to clipboard');
          clipboard.writeText(token);
        })
      },
    ]
  },
  {
    label: "Debug",
    submenu: [
      {
        label: "Activate",
        click: () => win.webContents.openDevTools(),
      },
    ],
  },
]);

const reloadAndKill = (win, killScripts = true) => {
  log.info('Reloading & Killing all scripts...');
  setStopProcessHandler(app, win, false);
  if (win.achievementsIntervalID) clearInterval(win.achievementsIntervalID);
  win.webContents.forcefullyCrashRenderer();
  win.on('closed', () => {
    // Wait for window to be closed before opening the new one to prevent race conditions
    log.debug('Opening new window');
    const newWindow = createWindow(killScripts);
    api.initialize(newWindow, () => Menu.setApplicationMenu(getMenu(win)));
    setStopProcessHandler(app, newWindow, true);
  })
  win.close();
};


function createWindow(killall) {
  win = new BrowserWindow({
    show: false,
    backgroundThrottling: false,
    backgroundColor: "#000000",
  });

  win.removeMenu();
  win.maximize();
  noScripts = killall ? { query: { noScripts: killall } } : {};
  win.loadFile("index.html", noScripts);
  win.show();
  if (debug) win.webContents.openDevTools();

  win.webContents.on("new-window", function (e, url) {
    // make sure local urls stay in electron perimeter
    if (url.substr(0, "file://".length) === "file://") {
      return;
    }

    // and open every other protocols on the browser
    e.preventDefault();
    shell.openExternal(url);
  });
  win.webContents.backgroundThrottling = false;

  // This is backward but the game fills in an array called `document.achievements` and we retrieve it from
  // here. Hey if it works it works.
  const achievements = greenworks.getAchievementNames();
  const intervalID = setInterval(async () => {
    try {
      const achs = await win.webContents.executeJavaScript("document.achievements");
      for (const ach of achs) {
        if (!achievements.includes(ach)) continue;
        greenworks.activateAchievement(ach, () => undefined);
      }
    } catch (error) {
      // The interval properly did not properly get cleared after a window kill
      log.warn('Clearing achievements timer');
      clearInterval(intervalID);
      return;
    }
  }, 1000);
  win.achievementsIntervalID = intervalID;


  const promptForReload = () => {
    win.off('unresponsive', promptForReload);
    dialog.showMessageBox({
      type: 'error',
      title: 'Bitburner > Application Unresponsive',
      message: 'The application is unresponsive, possibly due to an infinite loop in your scripts.',
      detail:' Did you forget a ns.sleep(x)?\n\n' +
        'The application will be restarted for you, do you want to kill all running scripts?',
      buttons: ['Restart', 'Cancel'],
      defaultId: 0,
      checkboxLabel: 'Kill all running scripts',
      checkboxChecked: true,
      noLink: true,
    }).then(({response, checkboxChecked}) => {
      if (response === 0) {
        reloadAndKill(win, checkboxChecked);
      } else {
        win.on('unresponsive', promptForReload)
      }
    });
  }
  win.on('unresponsive', promptForReload);

  // // Create the Application's main menu
  // Menu.setApplicationMenu(getMenu());

  return win;
}

function setStopProcessHandler(app, window, enabled) {
  const closingWindowHandler = async (e) => {
    // We need to prevent the default closing event to add custom logic
    e.preventDefault();

    // First we clear the achievement timer
    if (window.achievementsIntervalID) {
      clearInterval(window.achievementsIntervalID);
    }

    api.disable();

    // We'll try to execute javascript on the page to see if we're stuck
    let canRunJS = false;
    win.webContents.executeJavaScript('window.stop(); document.close()', true)
      .then(() => canRunJS = true);
    setTimeout(() => {
      // Wait a few milliseconds to prevent a race condition before loading the exit screen
      win.webContents.stop();
      win.loadFile("exit.html")
    }, 20);

    // Wait 200ms, if the promise has not yet resolved, let's crash the process since we're possibly in a stuck scenario
    setTimeout(() => {
      if (!canRunJS) {
        // We're stuck, let's crash the process
        log.warn('Forcefully crashing the renderer process');
        win.webContents.forcefullyCrashRenderer();
      }

      log.debug('Destroying the window');
      win.destroy();
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

app.whenReady().then(async () => {
  log.info('Application is ready!');
  const win = createWindow(process.argv.includes("--no-scripts"));
  await api.initialize(win, () => Menu.setApplicationMenu(getMenu(win)));
  setStopProcessHandler(app, win, true);
});
