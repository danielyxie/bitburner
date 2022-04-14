import { CONSTANTS } from "./Constants";
import { hash } from "./hash/hash";
import { Player } from "./Player";
import { saveObject } from "./SaveObject";
import type { ImportPlayerData, SaveData } from "./SaveObject";
import { GetServer } from "./Server/AllServers";
import { Settings } from "./Settings/Settings";
import { Terminal } from "./Terminal";
import { exportScripts } from "./Terminal/commands/download";
import { removeLeadingSlash } from "./Terminal/DirectoryHelpers";
import type { IMap, IReturnStatus } from "./types";
import { Router } from "./ui/GameRoot";
import { SnackbarEvents, ToastVariant } from "./ui/React/Snackbar";

export function initElectron(): void {
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.indexOf(" electron/") > -1) {
    // Electron-specific code
    (document as any).achievements = [];
    initWebserver();
    initAppNotifier();
    initSaveFunctions();
    initElectronBridge();
  }
}

function initWebserver(): void {
  interface IReturnWebStatus extends IReturnStatus {
    data?: {
      [propName: string]: any;
    };
  }
  function normalizeFileName(filename: string): string {
    filename = filename.replace(/\/\/+/g, "/");
    filename = removeLeadingSlash(filename);
    if (filename.includes("/")) {
      filename = "/" + removeLeadingSlash(filename);
    }
    return filename;
  }

  (document as any).getFiles = function (): IReturnWebStatus {
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

  (document as any).deleteFile = function (filename: string): IReturnWebStatus {
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

  (document as any).saveFile = function (filename: string, code: string): IReturnWebStatus {
    filename = normalizeFileName(filename);

    code = Buffer.from(code, "base64").toString();
    const home = GetServer("home");
    if (home === null) {
      return {
        res: false,
        msg: "Home server does not exist.",
      };
    }
    const { success, overwritten } = home.writeToScriptFile(Player, filename, code);
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

  // Will be consumud by the electron wrapper.
  (window as any).appNotifier = funcs;
}

function initSaveFunctions(): void {
  const funcs = {
    triggerSave: (): Promise<void> => saveObject.saveGame(true),
    triggerGameExport: (): void => {
      try {
        saveObject.exportGame();
      } catch (error) {
        console.log(error);
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

  // Will be consumud by the electron wrapper.
  (window as any).appSaveFns = funcs;
}

function initElectronBridge(): void {
  const bridge = (window as any).electronBridge as any;
  if (!bridge) return;

  bridge.receive("get-save-data-request", () => {
    const data = (window as any).appSaveFns.getSaveData();
    bridge.send("get-save-data-response", data);
  });
  bridge.receive("get-save-info-request", async (save: string) => {
    const data = await (window as any).appSaveFns.getSaveInfo(save);
    bridge.send("get-save-info-response", data);
  });
  bridge.receive("push-save-request", ({ save, automatic = false }: { save: string; automatic: boolean }) => {
    (window as any).appSaveFns.pushSaveData(save, automatic);
  });
  bridge.receive("trigger-save", () => {
    return (window as any).appSaveFns
      .triggerSave()
      .then(() => {
        bridge.send("save-completed");
      })
      .catch((error: any) => {
        console.log(error);
        SnackbarEvents.emit("Could not save game.", ToastVariant.ERROR, 2000);
      });
  });
  bridge.receive("trigger-game-export", () => {
    try {
      (window as any).appSaveFns.triggerGameExport();
    } catch (error) {
      console.log(error);
      SnackbarEvents.emit("Could not export game.", ToastVariant.ERROR, 2000);
    }
  });
  bridge.receive("trigger-scripts-export", () => {
    try {
      (window as any).appSaveFns.triggerScriptsExport();
    } catch (error) {
      console.log(error);
      SnackbarEvents.emit("Could not export scripts.", ToastVariant.ERROR, 2000);
    }
  });
}

export function pushGameSaved(data: SaveData): void {
  const bridge = (window as any).electronBridge as any;
  if (!bridge) return;

  bridge.send("push-game-saved", data);
}

export function pushGameReady(): void {
  const bridge = (window as any).electronBridge as any;
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
  const bridge = (window as any).electronBridge as any;
  if (!bridge) return;

  bridge.send("push-import-result", { wasImported });
  pushDisableRestore();
}

export function pushDisableRestore(): void {
  const bridge = (window as any).electronBridge as any;
  if (!bridge) return;

  bridge.send("push-disable-restore", { duration: 1000 * 60 });
}
