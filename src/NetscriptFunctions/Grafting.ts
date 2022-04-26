import { StaticAugmentations } from "../Augmentation/StaticAugmentations";
import { hasAugmentationPrereqs } from "../Faction/FactionHelpers";
import { CityName } from "../Locations/data/CityNames";
import { getRamCost } from "../Netscript/RamCostGenerator";
import { WorkerScript } from "../Netscript/WorkerScript";
import { GraftableAugmentation } from "../PersonObjects/Grafting/GraftableAugmentation";
import { getGraftingAvailableAugs, calculateGraftingTimeWithBonus } from "../PersonObjects/Grafting/GraftingHelpers";
import { IPlayer } from "../PersonObjects/IPlayer";
import { Grafting as IGrafting } from "../ScriptEditor/NetscriptDefinitions";
import { Router } from "../ui/GameRoot";
import { INetscriptHelper } from "./INetscriptHelper";

export function NetscriptGrafting(player: IPlayer, workerScript: WorkerScript, helper: INetscriptHelper): IGrafting {
  const checkGraftingAPIAccess = (func: string): void => {
    if (!player.canAccessGrafting()) {
      throw helper.makeRuntimeErrorMsg(
        `grafting.${func}`,
        "You do not currently have access to the Grafting API. This is either because you are not in BitNode 10 or because you do not have Source-File 10",
      );
    }
  };

  const updateRam = (funcName: string): void =>
    helper.updateDynamicRam(funcName, getRamCost(player, "grafting", funcName));

  return {
    getAugmentationGraftPrice: (_augName: unknown): number => {
      updateRam("getAugmentationGraftPrice");
      const augName = helper.string("getAugmentationGraftPrice", "augName", _augName);
      checkGraftingAPIAccess("getAugmentationGraftPrice");
      if (!getGraftingAvailableAugs(player).includes(augName) || !StaticAugmentations.hasOwnProperty(augName)) {
        throw helper.makeRuntimeErrorMsg("grafting.getAugmentationGraftPrice", `Invalid aug: ${augName}`);
      }
      const graftableAug = new GraftableAugmentation(StaticAugmentations[augName]);
      return graftableAug.cost;
    },

    getAugmentationGraftTime: (_augName: string): number => {
      updateRam("getAugmentationGraftTime");
      const augName = helper.string("getAugmentationGraftTime", "augName", _augName);
      checkGraftingAPIAccess("getAugmentationGraftTime");
      if (!getGraftingAvailableAugs(player).includes(augName) || !StaticAugmentations.hasOwnProperty(augName)) {
        throw helper.makeRuntimeErrorMsg("grafting.getAugmentationGraftTime", `Invalid aug: ${augName}`);
      }
      const graftableAug = new GraftableAugmentation(StaticAugmentations[augName]);
      return calculateGraftingTimeWithBonus(player, graftableAug);
    },

    getGraftableAugmentations: (): string[] => {
      updateRam("getGraftableAugmentations");
      checkGraftingAPIAccess("getGraftableAugmentations");
      const graftableAugs = getGraftingAvailableAugs(player);
      return graftableAugs;
    },

    graftAugmentation: (_augName: string, _focus: unknown = true): boolean => {
      updateRam("graftAugmentation");
      const augName = helper.string("graftAugmentation", "augName", _augName);
      const focus = helper.boolean(_focus);
      checkGraftingAPIAccess("graftAugmentation");
      if (player.city !== CityName.NewTokyo) {
        throw helper.makeRuntimeErrorMsg(
          "grafting.graftAugmentation",
          "You must be in New Tokyo to begin grafting an Augmentation.",
        );
      }
      if (!getGraftingAvailableAugs(player).includes(augName) || !StaticAugmentations.hasOwnProperty(augName)) {
        workerScript.log("grafting.graftAugmentation", () => `Invalid aug: ${augName}`);
        return false;
      }

      const wasFocusing = player.focus;
      if (player.isWorking) {
        const txt = player.singularityStopWork();
        workerScript.log("graftAugmentation", () => txt);
      }

      const craftableAug = new GraftableAugmentation(StaticAugmentations[augName]);
      if (player.money < craftableAug.cost) {
        workerScript.log("grafting.graftAugmentation", () => `You don't have enough money to craft ${augName}`);
        return false;
      }

      if (!hasAugmentationPrereqs(craftableAug.augmentation)) {
        workerScript.log("grafting.graftAugmentation", () => `You don't have the pre-requisites for ${augName}`);
        return false;
      }

      player.loseMoney(craftableAug.cost, "augmentations");
      player.startGraftAugmentationWork(augName, craftableAug.time);

      if (focus) {
        player.startFocusing();
        Router.toWork();
      } else if (wasFocusing) {
        player.stopFocusing();
        Router.toTerminal();
      }

      workerScript.log("grafting.graftAugmentation", () => `Began grafting Augmentation ${augName}.`);
      return true;
    },
  };
}
