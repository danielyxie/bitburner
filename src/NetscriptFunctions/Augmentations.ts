import { INetscriptHelper } from "./INetscriptHelper";
import { WorkerScript } from "../Netscript/WorkerScript";
import { IPlayer } from "../PersonObjects/IPlayer";
import { purchaseAugmentation } from "../Faction/FactionHelpers";
import { startWorkerScript } from "../NetscriptWorker";
import { Augmentation } from "../Augmentation/Augmentation";
import { Augmentations } from "../Augmentation/Augmentations";
import { augmentationExists, installAugmentations } from "../Augmentation/AugmentationHelpers";
import { prestigeAugmentation } from "../Prestige";
import { AugmentationNames } from "../Augmentation/data/AugmentationNames";
import { killWorkerScript } from "../Netscript/killWorkerScript";
import { CONSTANTS } from "../Constants";
import { isString } from "../utils/helpers/isString";
import { getRamCost } from "../Netscript/RamCostGenerator";
import { RunningScript } from "../Script/RunningScript";

export interface INetscriptAugmentations {
  getOwnedAugmentations(purchased?: any): any;
  getOwnedSourceFiles(): any;
  getAugmentationsFromFaction(facname: any): any;
  getAugmentationCost(name: any): any;
  getAugmentationPrereq(name: any): any;
  getAugmentationPrice(name: any): any;
  getAugmentationRepReq(name: any): any;
  getAugmentationStats(name: any): any;
  purchaseAugmentation(faction: any, name: any): any;
  softReset(cbScript: any): any;
  installAugmentations(cbScript: any): any;
}

export function NetscriptAugmentations(
  player: IPlayer,
  workerScript: WorkerScript,
  helper: INetscriptHelper,
): INetscriptAugmentations {
  const getAugmentation = function (func: any, name: any): Augmentation {
    if (!augmentationExists(name)) {
      throw helper.makeRuntimeErrorMsg(func, `Invalid augmentation: '${name}'`);
    }

    return Augmentations[name];
  };
  const runAfterReset = function (cbScript = null): void {
    //Run a script after reset
    if (cbScript && isString(cbScript)) {
      const home = player.getHomeComputer();
      for (const script of home.scripts) {
        if (script.filename === cbScript) {
          const ramUsage = script.ramUsage;
          const ramAvailable = home.maxRam - home.ramUsed;
          if (ramUsage > ramAvailable) {
            return; // Not enough RAM
          }
          const runningScriptObj = new RunningScript(script, []); // No args
          runningScriptObj.threads = 1; // Only 1 thread
          startWorkerScript(runningScriptObj, home);
        }
      }
    }
  };
  return {
    getOwnedAugmentations: function (purchased: any = false): any {
      helper.updateDynamicRam("getOwnedAugmentations", getRamCost("getOwnedAugmentations"));
      helper.checkSingularityAccess("getOwnedAugmentations", 3);
      const res = [];
      for (let i = 0; i < player.augmentations.length; ++i) {
        res.push(player.augmentations[i].name);
      }
      if (purchased) {
        for (let i = 0; i < player.queuedAugmentations.length; ++i) {
          res.push(player.queuedAugmentations[i].name);
        }
      }
      return res;
    },
    getOwnedSourceFiles: function (): any {
      helper.updateDynamicRam("getOwnedSourceFiles", getRamCost("getOwnedSourceFiles"));
      helper.checkSingularityAccess("getOwnedSourceFiles", 3);
      const res = [];
      for (let i = 0; i < player.sourceFiles.length; ++i) {
        res.push({
          n: player.sourceFiles[i].n,
          lvl: player.sourceFiles[i].lvl,
        });
      }
      return res;
    },
    getAugmentationsFromFaction: function (facname: any): any {
      helper.updateDynamicRam("getAugmentationsFromFaction", getRamCost("getAugmentationsFromFaction"));
      helper.checkSingularityAccess("getAugmentationsFromFaction", 3);
      const faction = helper.getFaction("getAugmentationsFromFaction", facname);

      // If player has a gang with this faction, return all augmentations.
      if (player.hasGangWith(facname)) {
        const res = [];
        for (const augName in Augmentations) {
          const aug = Augmentations[augName];
          if (!aug.isSpecial) {
            res.push(augName);
          }
        }

        return res;
      }

      return faction.augmentations.slice();
    },
    getAugmentationCost: function (name: any): any {
      helper.updateDynamicRam("getAugmentationCost", getRamCost("getAugmentationCost"));
      helper.checkSingularityAccess("getAugmentationCost", 3);
      const aug = getAugmentation("getAugmentationCost", name);
      return [aug.baseRepRequirement, aug.baseCost];
    },
    getAugmentationPrereq: function (name: any): any {
      helper.updateDynamicRam("getAugmentationPrereq", getRamCost("getAugmentationPrereq"));
      helper.checkSingularityAccess("getAugmentationPrereq", 3);
      const aug = getAugmentation("getAugmentationPrereq", name);
      return aug.prereqs.slice();
    },
    getAugmentationPrice: function (name: any): any {
      helper.updateDynamicRam("getAugmentationPrice", getRamCost("getAugmentationPrice"));
      helper.checkSingularityAccess("getAugmentationPrice", 3);
      const aug = getAugmentation("getAugmentationPrice", name);
      return aug.baseCost;
    },
    getAugmentationRepReq: function (name: any): any {
      helper.updateDynamicRam("getAugmentationRepReq", getRamCost("getAugmentationRepReq"));
      helper.checkSingularityAccess("getAugmentationRepReq", 3);
      const aug = getAugmentation("getAugmentationRepReq", name);
      return aug.baseRepRequirement;
    },
    getAugmentationStats: function (name: any): any {
      helper.updateDynamicRam("getAugmentationStats", getRamCost("getAugmentationStats"));
      helper.checkSingularityAccess("getAugmentationStats", 3);
      const aug = getAugmentation("getAugmentationStats", name);
      return Object.assign({}, aug.mults);
    },
    purchaseAugmentation: function (faction: any, name: any): any {
      helper.updateDynamicRam("purchaseAugmentation", getRamCost("purchaseAugmentation"));
      helper.checkSingularityAccess("purchaseAugmentation", 3);
      const fac = helper.getFaction("purchaseAugmentation", faction);
      const aug = getAugmentation("purchaseAugmentation", name);

      let augs = [];
      if (player.hasGangWith(faction)) {
        for (const augName in Augmentations) {
          const tempAug = Augmentations[augName];
          if (!tempAug.isSpecial) {
            augs.push(augName);
          }
        }
      } else {
        augs = fac.augmentations;
      }

      if (!augs.includes(name)) {
        workerScript.log("purchaseAugmentation", `Faction '${faction}' does not have the '${name}' augmentation.`);
        return false;
      }

      const isNeuroflux = aug.name === AugmentationNames.NeuroFluxGovernor;
      if (!isNeuroflux) {
        for (let j = 0; j < player.queuedAugmentations.length; ++j) {
          if (player.queuedAugmentations[j].name === aug.name) {
            workerScript.log("purchaseAugmentation", `You already have the '${name}' augmentation.`);
            return false;
          }
        }
        for (let j = 0; j < player.augmentations.length; ++j) {
          if (player.augmentations[j].name === aug.name) {
            workerScript.log("purchaseAugmentation", `You already have the '${name}' augmentation.`);
            return false;
          }
        }
      }

      if (fac.playerReputation < aug.baseRepRequirement) {
        workerScript.log("purchaseAugmentation", `You do not have enough reputation with '${fac.name}'.`);
        return false;
      }

      const res = purchaseAugmentation(aug, fac, true);
      workerScript.log("purchaseAugmentation", res);
      if (isString(res) && res.startsWith("You purchased")) {
        player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain);
        return true;
      } else {
        return false;
      }
    },
    softReset: function (cbScript: any): any {
      helper.updateDynamicRam("softReset", getRamCost("softReset"));
      helper.checkSingularityAccess("softReset", 3);

      workerScript.log("softReset", "Soft resetting. This will cause this script to be killed");
      setTimeout(() => {
        prestigeAugmentation();
        runAfterReset(cbScript);
      }, 0);

      // Prevent workerScript from "finishing execution naturally"
      workerScript.running = false;
      killWorkerScript(workerScript);
    },
    installAugmentations: function (cbScript: any): any {
      helper.updateDynamicRam("installAugmentations", getRamCost("installAugmentations"));
      helper.checkSingularityAccess("installAugmentations", 3);

      if (player.queuedAugmentations.length === 0) {
        workerScript.log("installAugmentations", "You do not have any Augmentations to be installed.");
        return false;
      }
      player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain);
      workerScript.log("installAugmentations", "Installing Augmentations. This will cause this script to be killed");
      setTimeout(() => {
        installAugmentations();
        runAfterReset(cbScript);
      }, 0);

      workerScript.running = false; // Prevent workerScript from "finishing execution naturally"
      killWorkerScript(workerScript);
    },
  };
}
