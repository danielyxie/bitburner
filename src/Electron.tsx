import { Player } from "./Player";
import { Router } from "./ui/GameRoot";
import { removeLeadingSlash } from "./Terminal/DirectoryHelpers";
import { Terminal } from "./Terminal";
import { SnackbarEvents, ToastVariant } from "./ui/React/Snackbar";
import { IMap, IReturnStatus } from "./types";
import { GetServer } from "./Server/AllServers";
import { ImportPlayerData, SaveData, saveObject } from "./SaveObject";
import { Settings } from "./Settings/Settings";
import { exportScripts } from "./Terminal/commands/download";
import { CONSTANTS } from "./Constants";
import { hash } from "./hash/hash";

interface IReturnWebStatus extends IReturnStatus {
  data?: Record<string, unknown>;
}

declare global {
  interface Window {
    appNotifier: {
      terminal: (message: string, type?: string) => void;
      toast: (message: string, type: ToastVariant, duration?: number) => void;
    };
    appSaveFns: {
      triggerSave: () => Promise<void>;
      triggerGameExport: () => void;
      triggerScriptsExport: () => void;
      getSaveData: () => { save: string; fileName: string };
      getSaveInfo: (base64save: string) => Promise<ImportPlayerData | undefined>;
      pushSaveData: (base64save: string, automatic?: boolean) => void;
    };
    electronBridge: {
      send: (channel: string, data?: unknown) => void;
      receive: (channel: string, func: (...args: unknown[]) => void) => void;
    };
  }
  interface Document {
    getFiles: () => IReturnWebStatus;
    deleteFile: (filename: string) => IReturnWebStatus;
    saveFile: (filename: string, code: string) => IReturnWebStatus;
  }
}

export function initElectron(): void {
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.indexOf(" electron/") > -1) {
    // Electron-specific code
    document.achievements = [];
    initWebserver();
    initAppNotifier();
    initSaveFunctions();
    initElectronBridge();
  }
}

function initWebserver(): void {
  function normalizeFileName(filename: string): string {
    filename = filename.replace(/\/\/+/g, "/");
    filename = removeLeadingSlash(filename);
    if (filename.includes("/")) {
      filename = "/" + removeLeadingSlash(filename);
    }
    return filename;
  }

  document.getFiles = function (): IReturnWebStatus {
    const home = GetServer("home");
    if (home === null) {
      return {
        res: false,
        msg: "Home server does not exist.",
      };
    }
    return {
      res: true,
      data: {
        files: home.scripts.map((script) => ({
          filename: script.filename,
          code: script.code,
          ramUsage: script.ramUsage,
        })),
      },
    };
  };

  document.deleteFile = function (filename: string): IReturnWebStatus {
    filename = normalizeFileName(filename);
    const home = GetServer("home");
    if (home === null) {
      return {
        res: false,
        msg: "Home server does not exist.",
      };
    }
    return home.removeFile(filename);
  };

  document.saveFile = function (filename: string, code: string): IReturnWebStatus {
    filename = normalizeFileName(filename);

    code = Buffer.from(code, "base64").toString();
    const home = GetServer("home");
    if (home === null) {
      return {
        res: false,
        msg: "Home server does not exist.",
      };
    }
    const { success, overwritten } = home.writeToScriptFile(filename, code);
    let script;
    if (success) {
      script = home.getScript(filename);
    }
    return {
      res: success,
      data: {
        overwritten,
        ramUsage: script?.ramUsage,
      },
    };
  };
}

// Expose certain alert functions to allow the wrapper to sends message to the game
function initAppNotifier(): void {
  const funcs = {
    terminal: (message: string, type?: string) => {
      const typesFn: IMap<(s: string) => void> = {
        info: Terminal.info,
        warn: Terminal.warn,
        error: Terminal.error,
        success: Terminal.success,
      };
      let fn;
      if (type) fn = typesFn[type];
      if (!fn) fn = Terminal.print;
      fn.bind(Terminal)(message);
    },
    toast: (message: string, type: ToastVariant, duration = 2000) => SnackbarEvents.emit(message, type, duration),
  };

  // Will be consumed by the electron wrapper.
  window.appNotifier = funcs;
}

function initSaveFunctions(): void {
  const funcs = {
    triggerSave: (): Promise<void> => saveObject.saveGame(true),
    triggerGameExport: (): void => {
      try {
        saveObject.exportGame();
      } catch (error) {
        console.error(error);
        SnackbarEvents.emit("Could not export game.", ToastVariant.ERROR, 2000);
      }
    },
    triggerScriptsExport: (): void => exportScripts("*", Player.getHomeComputer()),
    getSaveData: (): { save: string; fileName: string } => {
      return {
        save: saveObject.getSaveString(Settings.ExcludeRunningScriptsFromSave),
        fileName: saveObject.getSaveFileName(),
      };
    },
    getSaveInfo: async (base64save: string): Promise<ImportPlayerData | undefined> => {
      try {
        const data = await saveObject.getImportDataFromString(base64save);
        return data.playerData;
      } catch (error) {
        console.error(error);
        return;
      }
    },
    pushSaveData: (base64save: string, automatic = false): void => Router.toImportSave(base64save, automatic),
  };

  // Will be consumed by the electron wrapper.
  window.appSaveFns = funcs;
}

function initElectronBridge(): void {
  const bridge = window.electronBridge;
  if (!bridge) return;

  bridge.receive("get-save-data-request", () => {
    const data = window.appSaveFns.getSaveData();
    bridge.send("get-save-data-response", data);
  });
  bridge.receive("get-save-info-request", async (save: unknown) => {
    if (typeof save !== "string") throw new Error("Error while trying to get save info");
    const data = await window.appSaveFns.getSaveInfo(save);
    bridge.send("get-save-info-response", data);
  });
  bridge.receive("push-save-request", (params: unknown) => {
    if (typeof params !== "object") throw new Error("Error trying to push save request");
    const { save, automatic = false } = params as { save: string; automatic: boolean };
    window.appSaveFns.pushSaveData(save, automatic);
  });
  bridge.receive("trigger-save", () => {
    return window.appSaveFns
      .triggerSave()
      .then(() => {
        bridge.send("save-completed");
      })
      .catch((error: unknown) => {
        console.error(error);
        SnackbarEvents.emit("Could not save game.", ToastVariant.ERROR, 2000);
      });
  });
  bridge.receive("trigger-game-export", () => {
    try {
      window.appSaveFns.triggerGameExport();
    } catch (error) {
      console.error(error);
      SnackbarEvents.emit("Could not export game.", ToastVariant.ERROR, 2000);
    }
  });
  bridge.receive("trigger-scripts-export", () => {
    try {
      window.appSaveFns.triggerScriptsExport();
    } catch (error) {
      console.error(error);
      SnackbarEvents.emit("Could not export scripts.", ToastVariant.ERROR, 2000);
    }
  });
}

export function pushGameSaved(data: SaveData): void {
  const bridge = window.electronBridge;
  if (!bridge) return;

  bridge.send("push-game-saved", data);
}

export function pushGameReady(): void {
  const bridge = window.electronBridge;
  if (!bridge) return;

  // Send basic information to the electron wrapper
  bridge.send("push-game-ready", {
    player: {
      identifier: Player.identifier,
      playtime: Player.totalPlaytime,
      lastSave: Player.lastSave,
    },
    game: {
      version: CONSTANTS.VersionString,
      hash: hash(),
    },
  });
}

export function pushImportResult(wasImported: boolean): void {
  const bridge = window.electronBridge;
  if (!bridge) return;

  bridge.send("push-import-result", { wasImported });
  pushDisableRestore();
}

export function pushDisableRestore(): void {
  const bridge = window.electronBridge;
  if (!bridge) return;

  bridge.send("push-disable-restore", { duration: 1000 * 60 });
}
