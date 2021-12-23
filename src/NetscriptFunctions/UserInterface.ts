import { INetscriptHelper } from "./INetscriptHelper";
import { WorkerScript } from "../Netscript/WorkerScript";
import { IPlayer } from "../PersonObjects/IPlayer";
import { getRamCost } from "../Netscript/RamCostGenerator";
import { UserInterface as IUserInterface, UserInterfaceTheme } from "../ScriptEditor/NetscriptDefinitions";
import { Settings } from "../Settings/Settings";

export function NetscriptUserInterface(
  player: IPlayer,
  workerScript: WorkerScript,
  helper: INetscriptHelper,
): IUserInterface {
  return {
    getTheme: function (): UserInterfaceTheme {
      helper.updateDynamicRam("getTheme", getRamCost("ui", "getTheme"));
      return {...Settings.theme};
    },
  }
}

