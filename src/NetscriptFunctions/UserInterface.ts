import { INetscriptHelper } from "./INetscriptHelper";
import { WorkerScript } from "../Netscript/WorkerScript";
import { IPlayer } from "../PersonObjects/IPlayer";
import { GameInfo, IStyleSettings, UserInterface as IUserInterface, UserInterfaceTheme } from "../ScriptEditor/NetscriptDefinitions";
import { Settings } from "../Settings/Settings";
import { ThemeEvents } from "../ui/React/Theme";
import { defaultTheme } from "../Settings/Themes";
import { defaultStyles } from "../Settings/Styles";
import { CONSTANTS } from "../Constants";
import { hash } from "../hash/hash";

export function NetscriptUserInterface(
  player: IPlayer,
  workerScript: WorkerScript,
  helper: INetscriptHelper,
): IUserInterface {
  return {
    getTheme: function (): UserInterfaceTheme {
      helper.updateDynamicRam("ui.getTheme");
      return { ...Settings.theme };
    },

    getStyles: function (): IStyleSettings {
      helper.updateDynamicRam("ui.getStyles");
      return { ...Settings.styles };
    },

    setTheme: function (newTheme: UserInterfaceTheme): void {
      helper.updateDynamicRam("ui.setTheme");
      const hex = /^(#)((?:[A-Fa-f0-9]{3}){1,2})$/;
      const currentTheme = {...Settings.theme}
      const errors: string[] = [];
      for (const key of Object.keys(newTheme)) {
        if (!currentTheme[key]) {
          // Invalid key
          errors.push(`Invalid key "${key}"`);
        } else if (!hex.test(newTheme[key] ?? '')) {
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
        workerScript.log("ui.setTheme", () => `Failed to set theme. Errors: ${errors.join(', ')}`);
      }
    },

    setStyles: function (newStyles: IStyleSettings): void {
      helper.updateDynamicRam("ui.setStyles");

      const currentStyles = {...Settings.styles}
      const errors: string[] = [];
      for (const key of Object.keys(newStyles)) {
        if (!((currentStyles as any)[key])) {
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
        workerScript.log("ui.setStyles", () => `Failed to set styles. Errors: ${errors.join(', ')}`);
      }
    },

    resetTheme: function (): void {
      helper.updateDynamicRam("ui.resetTheme");
      Settings.theme = { ...defaultTheme };
      ThemeEvents.emit();
      workerScript.log("ui.resetTheme", () => `Reinitialized theme to default`);
    },

    resetStyles: function (): void {
      helper.updateDynamicRam("ui.resetStyles");
      Settings.styles = { ...defaultStyles };
      ThemeEvents.emit();
      workerScript.log("ui.resetStyles", () => `Reinitialized styles to default`);
    },

    getGameInfo: function (): GameInfo {
      helper.updateDynamicRam("ui.getGameInfo");
      const version = CONSTANTS.VersionString;
      const commit = hash();
      const platform = (navigator.userAgent.toLowerCase().indexOf(" electron/") > -1) ? 'Steam' : 'Browser';

      const gameInfo = {
        version, commit, platform,
      }

      return gameInfo;
    }
  }
}
