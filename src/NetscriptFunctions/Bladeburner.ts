import { INetscriptHelper } from "./INetscriptHelper";
import { WorkerScript } from "../Netscript/WorkerScript";
import { IPlayer } from "../PersonObjects/IPlayer";
import { Bladeburner } from "../Bladeburner/Bladeburner";
import { getRamCost } from "../Netscript/RamCostGenerator";
import { BitNodeMultipliers } from "../BitNode/BitNodeMultipliers";
import { Bladeburner as INetscriptBladeburner, BladeburnerCurAction } from "../ScriptEditor/NetscriptDefinitions";

export function NetscriptBladeburner(
  player: IPlayer,
  workerScript: WorkerScript,
  helper: INetscriptHelper,
): INetscriptBladeburner {
  const checkBladeburnerAccess = function (func: any, skipjoined: any = false): void {
    const bladeburner = player.bladeburner;
    if (bladeburner === null) throw new Error("Must have joined bladeburner");
    const apiAccess =
      player.bitNodeN === 7 ||
      player.sourceFiles.some((a) => {
        return a.n === 7;
      });
    if (!apiAccess) {
      const apiDenied = `You do not currently have access to the Bladeburner API. You must either be in BitNode-7 or have Source-File 7.`;
      throw helper.makeRuntimeErrorMsg(`bladeburner.${func}`, apiDenied);
    }
    if (!skipjoined) {
      const bladeburnerAccess = bladeburner instanceof Bladeburner;
      if (!bladeburnerAccess) {
        const bladeburnerDenied = `You must be a member of the Bladeburner division to use this API.`;
        throw helper.makeRuntimeErrorMsg(`bladeburner.${func}`, bladeburnerDenied);
      }
    }
  };

  const checkBladeburnerCity = function (func: any, city: any): void {
    const bladeburner = player.bladeburner;
    if (bladeburner === null) throw new Error("Must have joined bladeburner");
    if (!bladeburner.cities.hasOwnProperty(city)) {
      throw helper.makeRuntimeErrorMsg(`bladeburner.${func}`, `Invalid city: ${city}`);
    }
  };

  const getBladeburnerActionObject = function (func: any, type: any, name: any): any {
    const bladeburner = player.bladeburner;
    if (bladeburner === null) throw new Error("Must have joined bladeburner");
    const actionId = bladeburner.getActionIdFromTypeAndName(type, name);
    if (!actionId) {
      throw helper.makeRuntimeErrorMsg(`bladeburner.${func}`, `Invalid action type='${type}', name='${name}'`);
    }
    const actionObj = bladeburner.getActionObject(actionId);
    if (!actionObj) {
      throw helper.makeRuntimeErrorMsg(`bladeburner.${func}`, `Invalid action type='${type}', name='${name}'`);
    }

    return actionObj;
  };

  return {
    getContractNames: function (): string[] {
      helper.updateDynamicRam("getContractNames", getRamCost("bladeburner", "getContractNames"));
      checkBladeburnerAccess("getContractNames");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.getContractNamesNetscriptFn();
    },
    getOperationNames: function (): string[] {
      helper.updateDynamicRam("getOperationNames", getRamCost("bladeburner", "getOperationNames"));
      checkBladeburnerAccess("getOperationNames");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.getOperationNamesNetscriptFn();
    },
    getBlackOpNames: function (): string[] {
      helper.updateDynamicRam("getBlackOpNames", getRamCost("bladeburner", "getBlackOpNames"));
      checkBladeburnerAccess("getBlackOpNames");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.getBlackOpNamesNetscriptFn();
    },
    getBlackOpRank: function (name: any = ""): number {
      helper.updateDynamicRam("getBlackOpRank", getRamCost("bladeburner", "getBlackOpRank"));
      checkBladeburnerAccess("getBlackOpRank");
      const action: any = getBladeburnerActionObject("getBlackOpRank", "blackops", name);
      return action.reqdRank;
    },
    getGeneralActionNames: function (): string[] {
      helper.updateDynamicRam("getGeneralActionNames", getRamCost("bladeburner", "getGeneralActionNames"));
      checkBladeburnerAccess("getGeneralActionNames");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.getGeneralActionNamesNetscriptFn();
    },
    getSkillNames: function (): string[] {
      helper.updateDynamicRam("getSkillNames", getRamCost("bladeburner", "getSkillNames"));
      checkBladeburnerAccess("getSkillNames");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.getSkillNamesNetscriptFn();
    },
    startAction: function (type: any = "", name: any = ""): boolean {
      helper.updateDynamicRam("startAction", getRamCost("bladeburner", "startAction"));
      checkBladeburnerAccess("startAction");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      try {
        return bladeburner.startActionNetscriptFn(player, type, name, workerScript);
      } catch (e: any) {
        throw helper.makeRuntimeErrorMsg("bladeburner.startAction", e);
      }
    },
    stopBladeburnerAction: function (): void {
      helper.updateDynamicRam("stopBladeburnerAction", getRamCost("bladeburner", "stopBladeburnerAction"));
      checkBladeburnerAccess("stopBladeburnerAction");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.resetAction();
    },
    getCurrentAction: function (): BladeburnerCurAction {
      helper.updateDynamicRam("getCurrentAction", getRamCost("bladeburner", "getCurrentAction"));
      checkBladeburnerAccess("getCurrentAction");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.getTypeAndNameFromActionId(bladeburner.action);
    },
    getActionTime: function (type: any = "", name: any = ""): number {
      helper.updateDynamicRam("getActionTime", getRamCost("bladeburner", "getActionTime"));
      checkBladeburnerAccess("getActionTime");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      try {
        return bladeburner.getActionTimeNetscriptFn(player, type, name, workerScript);
      } catch (e: any) {
        throw helper.makeRuntimeErrorMsg("bladeburner.getActionTime", e);
      }
    },
    getActionEstimatedSuccessChance: function (type: any = "", name: any = ""): [number, number] {
      helper.updateDynamicRam(
        "getActionEstimatedSuccessChance",
        getRamCost("bladeburner", "getActionEstimatedSuccessChance"),
      );
      checkBladeburnerAccess("getActionEstimatedSuccessChance");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      try {
        return bladeburner.getActionEstimatedSuccessChanceNetscriptFn(player, type, name, workerScript);
      } catch (e: any) {
        throw helper.makeRuntimeErrorMsg("bladeburner.getActionEstimatedSuccessChance", e);
      }
    },
    getActionRepGain: function (type: any = "", name: any = "", level: any): number {
      helper.updateDynamicRam("getActionRepGain", getRamCost("bladeburner", "getActionRepGain"));
      checkBladeburnerAccess("getActionRepGain");
      const action = getBladeburnerActionObject("getActionRepGain", type, name);
      let rewardMultiplier;
      if (level == null || isNaN(level)) {
        rewardMultiplier = Math.pow(action.rewardFac, action.level - 1);
      } else {
        rewardMultiplier = Math.pow(action.rewardFac, level - 1);
      }

      return action.rankGain * rewardMultiplier * BitNodeMultipliers.BladeburnerRank;
    },
    getActionCountRemaining: function (type: any = "", name: any = ""): number {
      helper.updateDynamicRam("getActionCountRemaining", getRamCost("bladeburner", "getActionCountRemaining"));
      checkBladeburnerAccess("getActionCountRemaining");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      try {
        return bladeburner.getActionCountRemainingNetscriptFn(type, name, workerScript);
      } catch (e: any) {
        throw helper.makeRuntimeErrorMsg("bladeburner.getActionCountRemaining", e);
      }
    },
    getActionMaxLevel: function (type: any = "", name: any = ""): number {
      helper.updateDynamicRam("getActionMaxLevel", getRamCost("bladeburner", "getActionMaxLevel"));
      checkBladeburnerAccess("getActionMaxLevel");
      const action = getBladeburnerActionObject("getActionMaxLevel", type, name);
      return action.maxLevel;
    },
    getActionCurrentLevel: function (type: any = "", name: any = ""): number {
      helper.updateDynamicRam("getActionCurrentLevel", getRamCost("bladeburner", "getActionCurrentLevel"));
      checkBladeburnerAccess("getActionCurrentLevel");
      const action = getBladeburnerActionObject("getActionCurrentLevel", type, name);
      return action.level;
    },
    getActionAutolevel: function (type: any = "", name: any = ""): boolean {
      helper.updateDynamicRam("getActionAutolevel", getRamCost("bladeburner", "getActionAutolevel"));
      checkBladeburnerAccess("getActionAutolevel");
      const action = getBladeburnerActionObject("getActionCurrentLevel", type, name);
      return action.autoLevel;
    },
    setActionAutolevel: function (type: any = "", name: any = "", autoLevel: any = true): void {
      helper.updateDynamicRam("setActionAutolevel", getRamCost("bladeburner", "setActionAutolevel"));
      checkBladeburnerAccess("setActionAutolevel");
      const action = getBladeburnerActionObject("setActionAutolevel", type, name);
      action.autoLevel = autoLevel;
    },
    setActionLevel: function (type: any = "", name: any = "", level: any = 1): void {
      helper.updateDynamicRam("setActionLevel", getRamCost("bladeburner", "setActionLevel"));
      checkBladeburnerAccess("setActionLevel");
      const action = getBladeburnerActionObject("setActionLevel", type, name);
      if (level < 1 || level > action.maxLevel) {
        throw helper.makeRuntimeErrorMsg(
          "bladeburner.setActionLevel",
          `Level must be between 1 and ${action.maxLevel}, is ${level}`,
        );
      }
      action.level = level;
    },
    getRank: function (): number {
      helper.updateDynamicRam("getRank", getRamCost("bladeburner", "getRank"));
      checkBladeburnerAccess("getRank");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.rank;
    },
    getSkillPoints: function (): number {
      helper.updateDynamicRam("getSkillPoints", getRamCost("bladeburner", "getSkillPoints"));
      checkBladeburnerAccess("getSkillPoints");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.skillPoints;
    },
    getSkillLevel: function (skillName: any = ""): number {
      helper.updateDynamicRam("getSkillLevel", getRamCost("bladeburner", "getSkillLevel"));
      checkBladeburnerAccess("getSkillLevel");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      try {
        return bladeburner.getSkillLevelNetscriptFn(skillName, workerScript);
      } catch (e: any) {
        throw helper.makeRuntimeErrorMsg("bladeburner.getSkillLevel", e);
      }
    },
    getSkillUpgradeCost: function (skillName: any = ""): number {
      helper.updateDynamicRam("getSkillUpgradeCost", getRamCost("bladeburner", "getSkillUpgradeCost"));
      checkBladeburnerAccess("getSkillUpgradeCost");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      try {
        return bladeburner.getSkillUpgradeCostNetscriptFn(skillName, workerScript);
      } catch (e: any) {
        throw helper.makeRuntimeErrorMsg("bladeburner.getSkillUpgradeCost", e);
      }
    },
    upgradeSkill: function (skillName: any): boolean {
      helper.updateDynamicRam("upgradeSkill", getRamCost("bladeburner", "upgradeSkill"));
      checkBladeburnerAccess("upgradeSkill");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      try {
        return bladeburner.upgradeSkillNetscriptFn(skillName, workerScript);
      } catch (e: any) {
        throw helper.makeRuntimeErrorMsg("bladeburner.upgradeSkill", e);
      }
    },
    getTeamSize: function (type: any = "", name: any = ""): number {
      helper.updateDynamicRam("getTeamSize", getRamCost("bladeburner", "getTeamSize"));
      checkBladeburnerAccess("getTeamSize");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      try {
        return bladeburner.getTeamSizeNetscriptFn(type, name, workerScript);
      } catch (e: any) {
        throw helper.makeRuntimeErrorMsg("bladeburner.getTeamSize", e);
      }
    },
    setTeamSize: function (type: any = "", name: any = "", size: any): number {
      helper.updateDynamicRam("setTeamSize", getRamCost("bladeburner", "setTeamSize"));
      checkBladeburnerAccess("setTeamSize");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      try {
        return bladeburner.setTeamSizeNetscriptFn(type, name, size, workerScript);
      } catch (e: any) {
        throw helper.makeRuntimeErrorMsg("bladeburner.setTeamSize", e);
      }
    },
    getCityEstimatedPopulation: function (cityName: any): number {
      helper.updateDynamicRam("getCityEstimatedPopulation", getRamCost("bladeburner", "getCityEstimatedPopulation"));
      checkBladeburnerAccess("getCityEstimatedPopulation");
      checkBladeburnerCity("getCityEstimatedPopulation", cityName);
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.cities[cityName].popEst;
    },
    getCityCommunities: function (cityName: any): number {
      helper.updateDynamicRam("getCityCommunities", getRamCost("bladeburner", "getCityCommunities"));
      checkBladeburnerAccess("getCityCommunities");
      checkBladeburnerCity("getCityCommunities", cityName);
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.cities[cityName].comms;
    },
    getCityChaos: function (cityName: any): number {
      helper.updateDynamicRam("getCityChaos", getRamCost("bladeburner", "getCityChaos"));
      checkBladeburnerAccess("getCityChaos");
      checkBladeburnerCity("getCityChaos", cityName);
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.cities[cityName].chaos;
    },
    getCity: function (): string {
      helper.updateDynamicRam("getCity", getRamCost("bladeburner", "getCity"));
      checkBladeburnerAccess("getCityChaos");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.city;
    },
    switchCity: function (cityName: any): boolean {
      helper.updateDynamicRam("switchCity", getRamCost("bladeburner", "switchCity"));
      checkBladeburnerAccess("switchCity");
      checkBladeburnerCity("switchCity", cityName);
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return (bladeburner.city = cityName);
    },
    getStamina: function (): [number, number] {
      helper.updateDynamicRam("getStamina", getRamCost("bladeburner", "getStamina"));
      checkBladeburnerAccess("getStamina");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return [bladeburner.stamina, bladeburner.maxStamina];
    },
    joinBladeburnerFaction: function (): boolean {
      helper.updateDynamicRam("joinBladeburnerFaction", getRamCost("bladeburner", "joinBladeburnerFaction"));
      checkBladeburnerAccess("joinBladeburnerFaction", true);
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.joinBladeburnerFactionNetscriptFn(workerScript);
    },
    joinBladeburnerDivision: function (): boolean {
      helper.updateDynamicRam("joinBladeburnerDivision", getRamCost("bladeburner", "joinBladeburnerDivision"));
      if (player.bitNodeN === 7 || player.sourceFileLvl(7) > 0) {
        if (player.bitNodeN === 8) {
          return false;
        }
        if (player.bladeburner instanceof Bladeburner) {
          return true; // Already member
        } else if (
          player.strength >= 100 &&
          player.defense >= 100 &&
          player.dexterity >= 100 &&
          player.agility >= 100
        ) {
          player.bladeburner = new Bladeburner(player);
          workerScript.log("joinBladeburnerDivision", "You have been accepted into the Bladeburner division");

          return true;
        } else {
          workerScript.log(
            "joinBladeburnerDivision",
            "You do not meet the requirements for joining the Bladeburner division",
          );
          return false;
        }
      }
      return false;
    },
    getBonusTime: function (): number {
      helper.updateDynamicRam("getBonusTime", getRamCost("bladeburner", "getBonusTime"));
      checkBladeburnerAccess("getBonusTime");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return Math.round(bladeburner.storedCycles / 5);
    },
  };
}
