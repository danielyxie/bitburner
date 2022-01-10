/* eslint-disable @typescript-eslint/no-var-requires */
const { Menu, clipboard, dialog } = require("electron");
const log = require("electron-log");
const api = require("./api-server");
const utils = require("./utils");

function getMenu(window) {
  return Menu.buildFromTemplate([
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
          click: () => window.loadFile("index.html"),
        },
        {
          label: "Reload & Kill All Scripts",
          click: () => utils.reloadAndKill(window, true),
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
              window.setFullScreen(full);
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
            let success = false;
            try {
              await api.toggleServer();
              success = true;
            } catch (error) {
              log.error(error);
              utils.showErrorBox('Error Toggling Server', error);
            }
            if (success && api.isListening()) {
              utils.writeToast(window, "Started API Server", "success");
            } else if (success && !api.isListening()) {
              utils.writeToast(window, "Stopped API Server", "success");
            } else {
              utils.writeToast(window, 'Error Toggling Server', "error");
            }
            refreshMenu(window);
          })
        },
        {
          label: api.isAutostart() ? 'Disable Autostart' : 'Enable Autostart',
          click: (async () => {
            api.toggleAutostart();
            if (api.isAutostart()) {
              utils.writeToast(window, "Enabled API Server Autostart", "success");
            } else {
              utils.writeToast(window, "Disabled API Server Autostart", "success");
            }
            refreshMenu(window);
          })
        },
        {
          label: 'Copy Auth Token',
          click: (async () => {
            const token = api.getAuthenticationToken();
            log.log('Wrote authentication token to clipboard');
            clipboard.writeText(token);
            utils.writeToast(window, "Copied Authentication Token to Clipboard", "info");
          })
        },
        {
          type: 'separator',
        },
        {
          label: 'Information',
          click: () => {
            dialog.showMessageBox({
              type: 'info',
              title: 'Bitburner > API Server Information',
              message: 'The API Server is used to write script files to your in-game home.',
              detail: 'There is an official Visual Studio Code extension that makes use of that feature.\n\n' +
                'It allows you to write your script file in an external IDE and have them pushed over to the game automatically.\n' +
                'If you want more information, head over to: https://github.com/bitburner-official/bitburner-vscode.',
                buttons: ['Dismiss', 'Open Extension Link (GitHub)'],
                defaultId: 0,
                cancelId: 0,
                noLink: true,
            }).then(({response}) => {
              if (response === 1) {
                utils.openExternal('https://github.com/bitburner-official/bitburner-vscode');
              }
            });
          }
        }
      ]
    },
    {
      label: "Zoom",
      submenu: [
        {
          label: "Zoom In",
          enabled: utils.getZoomFactor() <= 2,
          accelerator: "CommandOrControl+numadd",
          click: () => {
            const currentZoom = utils.getZoomFactor();
            const newZoom = currentZoom + 0.1;
            if (newZoom <= 2.0) {
              utils.setZoomFactor(window, newZoom);
              refreshMenu(window);
            } else {
              log.log('Max zoom out')
              utils.writeToast(window, "Cannot zoom in anymore", "warning");
            }
          },
        },
        {
          label: "Zoom Out",
          enabled: utils.getZoomFactor() >= 0.5,
          accelerator: "CommandOrControl+numsub",
          click: () => {
            const currentZoom = utils.getZoomFactor();
            const newZoom = currentZoom - 0.1;
            if (newZoom >= 0.5) {
              utils.setZoomFactor(window, newZoom);
              refreshMenu(window);
            } else {
              log.log('Max zoom in')
              utils.writeToast(window, "Cannot zoom out anymore", "warning");
            }
          },
        },
      ],
    },
    {
      label: "Debug",
      submenu: [
        {
          label: "Activate",
          click: () => window.webContents.openDevTools(),
        },
      ],
    },
  ]);
}

function refreshMenu(window) {
  Menu.setApplicationMenu(getMenu(window));
}

module.exports = {
  getMenu, refreshMenu,
}
