import { INetscriptHelper } from "./INetscriptHelper";
import { WorkerScript } from "../Netscript/WorkerScript";
import { IPlayer } from "../PersonObjects/IPlayer";
import { getRamCost } from "../Netscript/RamCostGenerator";
import {
  GameInfo,
  IStyleSettings,
  UserInterface as IUserInterface,
  UserInterfaceTheme,
} from "../ScriptEditor/NetscriptDefinitions";
import { Settings } from "../Settings/Settings";
import { ThemeEvents } from "../Themes/ui/Theme";
import { defaultTheme } from "../Themes/Themes";
import { defaultStyles } from "../Themes/Styles";
import { CONSTANTS } from "../Constants";
import { hash } from "../hash/hash";

export function NetscriptUserInterface(
  player: IPlayer,
  workerScript: WorkerScript,
  helper: INetscriptHelper,
): IUserInterface {
  const updateRam = (funcName: string): void => helper.updateDynamicRam(funcName, getRamCost(player, "ui", funcName));
  return {
    getTheme: function (): UserInterfaceTheme {
      updateRam("getTheme");
      return { ...Settings.theme };
    },

    getStyles: function (): IStyleSettings {
      updateRam("getStyles");
      return { ...Settings.styles };
    },

    setTheme: function (newTheme: UserInterfaceTheme): void {
      updateRam("setTheme");
      const hex = /^(#)((?:[A-Fa-f0-9]{2}){3,4}|(?:[A-Fa-f0-9]{3}))$/;
      const currentTheme = { ...Settings.theme };
      const errors: string[] = [];
      for (const key of Object.keys(newTheme)) {
        if (!currentTheme[key]) {
          // Invalid key
          errors.push(`Invalid key "${key}"`);
        } else if (!hex.test(newTheme[key] ?? "")) {
          errors.push(`Invalid color "${key}": ${newTheme[key]}`);
        } else {
          currentTheme[key] = newTheme[key];
        }
      }

      if (errors.length === 0) {
        Object.assign(Settings.theme, currentTheme);
        ThemeEvents.emit();
        workerScript.log("ui.setTheme", () => `Successfully set theme`);
      } else {
        workerScript.log("ui.setTheme", () => `Failed to set theme. Errors: ${errors.join(", ")}`);
      }
    },

    setStyles: function (newStyles: IStyleSettings): void {
      updateRam("setStyles");

      const currentStyles = { ...Settings.styles };
      const errors: string[] = [];
      for (const key of Object.keys(newStyles)) {
        if (!(currentStyles as any)[key]) {
          // Invalid key
          errors.push(`Invalid key "${key}"`);
        } else {
          (currentStyles as any)[key] = (newStyles as any)[key];
        }
      }

      if (errors.length === 0) {
        Object.assign(Settings.styles, currentStyles);
        ThemeEvents.emit();
        workerScript.log("ui.setStyles", () => `Successfully set styles`);
      } else {
        workerScript.log("ui.setStyles", () => `Failed to set styles. Errors: ${errors.join(", ")}`);
      }
    },

    resetTheme: function (): void {
      updateRam("resetTheme");
      Settings.theme = { ...defaultTheme };
      ThemeEvents.emit();
      workerScript.log("ui.resetTheme", () => `Reinitialized theme to default`);
    },

    resetStyles: function (): void {
      updateRam("resetStyles");
      Settings.styles = { ...defaultStyles };
      ThemeEvents.emit();
      workerScript.log("ui.resetStyles", () => `Reinitialized styles to default`);
    },

    getGameInfo: function (): GameInfo {
      updateRam("getGameInfo");
      const version = CONSTANTS.VersionString;
      const commit = hash();
      const platform = navigator.userAgent.toLowerCase().indexOf(" electron/") > -1 ? "Steam" : "Browser";

      const gameInfo = {
        version,
        commit,
        platform,
      };

      return gameInfo;
    },
  };
}
