import { Player } from "./Player";
import { isScriptFilename } from "./Script/isScriptFilename";
import { Script } from "./Script/Script";
import { removeLeadingSlash } from "./Terminal/DirectoryHelpers";
import { Terminal } from "./Terminal";
import { SnackbarEvents } from "./ui/React/Snackbar";
import { IMap } from "./types";
import { GetServer } from "./Server/AllServers";

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
  // @ts-ignore
  window.appNotifier = funcs;
}
