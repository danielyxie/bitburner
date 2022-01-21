/* eslint-disable @typescript-eslint/no-var-requires */
const { ipcRenderer, contextBridge } = require('electron')
const log = require("electron-log");

Object.assign(console, log.functions);

contextBridge.exposeInMainWorld(
  "electronBridge", {
    send: (channel, data) => {
      log.log("Send on channel " + channel)
      // whitelist channels
      let validChannels = [
        "get-save-data-response",
        "get-save-info-response",
        "push-game-saved",
        "push-game-ready",
        "push-import-result",
      ];
      if (validChannels.includes(channel)) {
          ipcRenderer.send(channel, data);
      }
    },
    receive: (channel, func) => {
      log.log("Receive on channel " + channel)
      let validChannels = [
        "get-save-data-request",
        "get-save-info-request",
        "push-save-request",
        "trigger-save",
        "trigger-game-export",
        "trigger-scripts-export",
      ];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    }
  }
);
