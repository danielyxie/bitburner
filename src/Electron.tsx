import { Player } from "./Player";
import { Router } from "./ui/GameRoot";
import { isScriptFilename } from "./Script/isScriptFilename";
import { Script } from "./Script/Script";
import { removeLeadingSlash } from "./Terminal/DirectoryHelpers";
import { Terminal } from "./Terminal";
import { SnackbarEvents } from "./ui/React/Snackbar";
import { IMap } from "./types";
import { GetServer } from "./Server/AllServers";
import { ImportPlayerData, SaveData, saveObject } from "./SaveObject";
import { Settings } from "./Settings/Settings";
import { exportScripts } from "./Terminal/commands/download";
import { CONSTANTS } from "./Constants";
import { hash } from "./hash/hash";

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
  (document as any).saveFile = function (filename: string, code: string): string {
    filename = filename.replace(/\/\/+/g, "/");
    filename = removeLeadingSlash(filename);
    if (filename.includes("/")) {
      filename = "/" + removeLeadingSlash(filename);
    }
    code = Buffer.from(code, "base64").toString();
    const home = GetServer("home");
    if (home === null) return "'home' server not found.";
    if (isScriptFilename(filename)) {
      //If the current script already exists on the server, overwrite it
      for (let i = 0; i < home.scripts.length; i++) {
        if (filename == home.scripts[i].filename) {
          home.scripts[i].saveScript(Player, filename, code, "home", home.scripts);
          return "written";
        }
      }

      //If the current script does NOT exist, create a new one
      const script = new Script();
      script.saveScript(Player, filename, code, "home", home.scripts);
      home.scripts.push(script);
      return "written";
    }

    return "not a script file";
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
    toast: (message: string, type: "info" | "success" | "warning" | "error", duration = 2000) =>
      SnackbarEvents.emit(message, type, duration),
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
        SnackbarEvents.emit("Could not export game.", "error", 2000);
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
        SnackbarEvents.emit("Could not save game.", "error", 2000);
      });
  });
  bridge.receive("trigger-game-export", () => {
    try {
      (window as any).appSaveFns.triggerGameExport();
    } catch (error) {
      console.log(error);
      SnackbarEvents.emit("Could not export game.", "error", 2000);
    }
  });
  bridge.receive("trigger-scripts-export", () => {
    try {
      (window as any).appSaveFns.triggerScriptsExport();
    } catch (error) {
      console.log(error);
      SnackbarEvents.emit("Could not export scripts.", "error", 2000);
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
