import { CityName } from "../Locations/data/CityNames";
import { Augmentations } from "../Augmentation/Augmentations";
import { getRamCost } from "../Netscript/RamCostGenerator";
import { WorkerScript } from "../Netscript/WorkerScript";
import { GraftableAugmentation } from "../PersonObjects/Grafting/GraftableAugmentation";
import { getAvailableAugs } from "../PersonObjects/Grafting/ui/GraftingRoot";
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

  return {
    getAugmentationGraftPrice: (_augName: unknown): number => {
      const augName = helper.string("getAugmentationGraftPrice", "augName", _augName);
      helper.updateDynamicRam("getAugmentationGraftPrice", getRamCost(player, "grafting", "getAugmentationGraftPrice"));
      checkGraftingAPIAccess("getAugmentationGraftPrice");
      if (!Augmentations.hasOwnProperty(augName)) {
        throw helper.makeRuntimeErrorMsg("grafting.getAugmentationGraftPrice", `Invalid aug: ${augName}`);
      }
      const craftableAug = new GraftableAugmentation(Augmentations[augName]);
      return craftableAug.cost;
    },

    getAugmentationGraftTime: (_augName: string): number => {
      const augName = helper.string("getAugmentationGraftTime", "augName", _augName);
      helper.updateDynamicRam("getAugmentationGraftTime", getRamCost(player, "grafting", "getAugmentationGraftTime"));
      checkGraftingAPIAccess("getAugmentationGraftTime");
      if (!Augmentations.hasOwnProperty(augName)) {
        throw helper.makeRuntimeErrorMsg("grafting.getAugmentationGraftTime", `Invalid aug: ${augName}`);
      }
      const craftableAug = new GraftableAugmentation(Augmentations[augName]);
      return craftableAug.time;
    },

    graftAugmentation: (_augName: string, _focus: unknown = true): boolean => {
      const augName = helper.string("graftAugmentation", "augName", _augName);
      const focus = helper.boolean(_focus);
      helper.updateDynamicRam("graftAugmentation", getRamCost(player, "grafting", "graftAugmentation"));
      checkGraftingAPIAccess("graftAugmentation");
      if (player.city !== CityName.NewTokyo) {
        throw helper.makeRuntimeErrorMsg(
          "grafting.graftAugmentation",
          "You must be in New Tokyo to begin crafting an Augmentation.",
        );
      }
      if (!getAvailableAugs(player).includes(augName)) {
        workerScript.log("grafting.graftAugmentation", () => `Invalid aug: ${augName}`);
        return false;
      }

      const wasFocusing = player.focus;
      if (player.isWorking) {
        const txt = player.singularityStopWork();
        workerScript.log("graftAugmentation", () => txt);
      }

      const craftableAug = new GraftableAugmentation(Augmentations[augName]);
      if (player.money < craftableAug.cost) {
        workerScript.log("grafting.graftAugmentation", () => `You don't have enough money to craft ${augName}`);
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

      workerScript.log("grafting.graftAugmentation", () => `Began crafting Augmentation ${augName}.`);
      return true;
    },
  };
}
