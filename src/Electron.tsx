import { Player } from "./Player";
import { removeLeadingSlash } from "./Terminal/DirectoryHelpers";
import { Terminal } from "./Terminal";
import { SnackbarEvents } from "./ui/React/Snackbar";
import { IMap, IReturnStatus } from "./types";
import { GetServer } from "./Server/AllServers";
import { resolve } from "cypress/types/bluebird";

export function initElectron(): void {
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.indexOf(" electron/") > -1) {
    // Electron-specific code
    (document as any).achievements = [];
    initWebserver();
    initAppNotifier();
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
    toast: (message: string, type: "info" | "success" | "warning" | "error", duration = 2000) =>
      SnackbarEvents.emit(message, type, duration),
  };

  // Will be consumud by the electron wrapper.
  // @ts-ignore
  window.appNotifier = funcs;
}
