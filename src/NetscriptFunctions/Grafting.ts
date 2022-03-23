import { CityName } from "../Locations/data/CityNames";
import { Augmentations } from "../Augmentation/Augmentations";
import { getRamCost } from "../Netscript/RamCostGenerator";
import { WorkerScript } from "../Netscript/WorkerScript";
import { CraftableAugmentation } from "../PersonObjects/Grafting/CraftableAugmentation";
import { getAvailableAugs } from "../PersonObjects/Grafting/ui/GraftingRoot";
import { IPlayer } from "../PersonObjects/IPlayer";
import { Grafting as IGrafting } from "../ScriptEditor/NetscriptDefinitions";
import { SourceFileFlags } from "../SourceFile/SourceFileFlags";
import { Router } from "../ui/GameRoot";
import { INetscriptHelper } from "./INetscriptHelper";

export function NetscriptGrafting(player: IPlayer, workerScript: WorkerScript, helper: INetscriptHelper): IGrafting {
  const checkGraftingAPIAccess = (func: any): void => {
    if (player.bitNodeN !== 10 && !SourceFileFlags[10]) {
      throw helper.makeRuntimeErrorMsg(
        `grafting.${func}`,
        "You do not currently have access to the Grafting API. This is either because you are not in BitNode 10 or because you do not have Source-File 10",
      );
    }
  };

  return {
    getAugmentationCraftPrice: (augName: string): number => {
      helper.updateDynamicRam("getAugmentationCraftPrice", getRamCost(player, "grafting", "getAugmentationCraftPrice"));
      checkGraftingAPIAccess("getAugmentationCraftPrice");
      if (!Augmentations.hasOwnProperty(augName)) {
        throw helper.makeRuntimeErrorMsg("grafting.getAugmentationCraftPrice", `Invalid aug: ${augName}`);
      }
      const craftableAug = new CraftableAugmentation(Augmentations[augName]);
      return craftableAug.cost;
    },

    getAugmentationCraftTime: (augName: string): number => {
      helper.updateDynamicRam("getAugmentationCraftTime", getRamCost(player, "grafting", "getAugmentationCraftTime"));
      checkGraftingAPIAccess("getAugmentationCraftTime");
      if (!Augmentations.hasOwnProperty(augName)) {
        throw helper.makeRuntimeErrorMsg("grafting.getAugmentationCraftTime", `Invalid aug: ${augName}`);
      }
      const craftableAug = new CraftableAugmentation(Augmentations[augName]);
      return craftableAug.time;
    },

    craftAugmentation: (augName: string, focus = true): boolean => {
      helper.updateDynamicRam("craftAugmentation", getRamCost(player, "grafting", "craftAugmentation"));
      checkGraftingAPIAccess("craftAugmentation");
      if (player.city !== CityName.NewTokyo) {
        throw helper.makeRuntimeErrorMsg(
          "grafting.craftAugmentation",
          "You must be in New Tokyo to begin crafting an Augmentation.",
        );
      }
      if (!getAvailableAugs(player).includes(augName)) {
        workerScript.log("grafting.craftAugmentation", () => `Invalid aug: ${augName}`);
        return false;
      }

      const wasFocusing = player.focus;
      if (player.isWorking) {
        const txt = player.singularityStopWork();
        workerScript.log("craftAugmentation", () => txt);
      }

      const craftableAug = new CraftableAugmentation(Augmentations[augName]);
      if (player.money < craftableAug.cost) {
        workerScript.log("grafting.craftAugmentation", () => `You don't have enough money to craft ${augName}`);
      }

      player.loseMoney(craftableAug.cost, "augmentations");
      player.startCraftAugmentationWork(augName, craftableAug.time);

      if (focus) {
        player.startFocusing();
        Router.toWork();
      } else if (wasFocusing) {
        player.stopFocusing();
        Router.toTerminal();
      }

      workerScript.log("grafting.craftAugmentation", () => `Began crafting Augmentation ${augName}.`);
      return true;
    },
  };
}
