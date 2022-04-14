import { INetscriptHelper } from "./INetscriptHelper";
import { WorkerScript } from "../Netscript/WorkerScript";
import { IPlayer } from "../PersonObjects/IPlayer";
import { Bladeburner } from "../Bladeburner/Bladeburner";
import { getRamCost } from "../Netscript/RamCostGenerator";
import { BitNodeMultipliers } from "../BitNode/BitNodeMultipliers";
import { Bladeburner as INetscriptBladeburner, BladeburnerCurAction } from "../ScriptEditor/NetscriptDefinitions";
import { IAction } from "src/Bladeburner/IAction";

export function NetscriptBladeburner(
  player: IPlayer,
  workerScript: WorkerScript,
  helper: INetscriptHelper,
): INetscriptBladeburner {
  const checkBladeburnerAccess = function (func: string, skipjoined = false): void {
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

  const checkBladeburnerCity = function (func: string, city: string): void {
    const bladeburner = player.bladeburner;
    if (bladeburner === null) throw new Error("Must have joined bladeburner");
    if (!bladeburner.cities.hasOwnProperty(city)) {
      throw helper.makeRuntimeErrorMsg(`bladeburner.${func}`, `Invalid city: ${city}`);
    }
  };

  const getBladeburnerActionObject = function (func: string, type: string, name: string): IAction {
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
      helper.updateDynamicRam("getContractNames", getRamCost(player, "bladeburner", "getContractNames"));
      checkBladeburnerAccess("getContractNames");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.getContractNamesNetscriptFn();
    },
    getOperationNames: function (): string[] {
      helper.updateDynamicRam("getOperationNames", getRamCost(player, "bladeburner", "getOperationNames"));
      checkBladeburnerAccess("getOperationNames");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.getOperationNamesNetscriptFn();
    },
    getBlackOpNames: function (): string[] {
      helper.updateDynamicRam("getBlackOpNames", getRamCost(player, "bladeburner", "getBlackOpNames"));
      checkBladeburnerAccess("getBlackOpNames");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.getBlackOpNamesNetscriptFn();
    },
    getBlackOpRank: function (_blackOpName: unknown): number {
      const blackOpName = helper.string("getBlackOpRank", "blackOpName", _blackOpName);
      helper.updateDynamicRam("getBlackOpRank", getRamCost(player, "bladeburner", "getBlackOpRank"));
      checkBladeburnerAccess("getBlackOpRank");
      const action: any = getBladeburnerActionObject("getBlackOpRank", "blackops", blackOpName);
      return action.reqdRank;
    },
    getGeneralActionNames: function (): string[] {
      helper.updateDynamicRam("getGeneralActionNames", getRamCost(player, "bladeburner", "getGeneralActionNames"));
      checkBladeburnerAccess("getGeneralActionNames");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.getGeneralActionNamesNetscriptFn();
    },
    getSkillNames: function (): string[] {
      helper.updateDynamicRam("getSkillNames", getRamCost(player, "bladeburner", "getSkillNames"));
      checkBladeburnerAccess("getSkillNames");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.getSkillNamesNetscriptFn();
    },
    startAction: function (_type: unknown, _name: unknown): boolean {
      const type = helper.string("startAction", "type", _type);
      const name = helper.string("startAction", "name", _name);
      helper.updateDynamicRam("startAction", getRamCost(player, "bladeburner", "startAction"));
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
      helper.updateDynamicRam("stopBladeburnerAction", getRamCost(player, "bladeburner", "stopBladeburnerAction"));
      checkBladeburnerAccess("stopBladeburnerAction");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.resetAction();
    },
    getCurrentAction: function (): BladeburnerCurAction {
      helper.updateDynamicRam("getCurrentAction", getRamCost(player, "bladeburner", "getCurrentAction"));
      checkBladeburnerAccess("getCurrentAction");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.getTypeAndNameFromActionId(bladeburner.action);
    },
    getActionTime: function (_type: unknown, _name: unknown): number {
      const type = helper.string("getActionTime", "type", _type);
      const name = helper.string("getActionTime", "name", _name);
      helper.updateDynamicRam("getActionTime", getRamCost(player, "bladeburner", "getActionTime"));
      checkBladeburnerAccess("getActionTime");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      try {
        let time = bladeburner.getActionTimeNetscriptFn(player, type, name);
        if(typeof time === 'string'){
          const errorLogText = `Invalid action: type='${type}' name='${name}'`;
          workerScript.log("bladeburner.getActionTime", () => errorLogText);
          return -1;
        } else {
          return time;
        }
      } catch (e: any) {
        throw helper.makeRuntimeErrorMsg("bladeburner.getActionTime", e);
      }
    },
    getActionEstimatedSuccessChance: function (_type: unknown, _name: unknown): [number, number] {
      const type = helper.string("getActionEstimatedSuccessChance", "type", _type);
      const name = helper.string("getActionEstimatedSuccessChance", "name", _name);
      helper.updateDynamicRam(
        "getActionEstimatedSuccessChance",
        getRamCost(player, "bladeburner", "getActionEstimatedSuccessChance"),
      );
      checkBladeburnerAccess("getActionEstimatedSuccessChance");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      try {
        let chance = bladeburner.getActionEstimatedSuccessChanceNetscriptFn(player, type, name);
        if(typeof chance === 'string'){
          const errorLogText = `Invalid action: type='${type}' name='${name}'`;
          workerScript.log("bladeburner.getActionTime", () => errorLogText);
          return [-1, -1];
        } else {
          return chance;
        }
      } catch (e: any) {
        throw helper.makeRuntimeErrorMsg("bladeburner.getActionEstimatedSuccessChance", e);
      }
    },
    getActionRepGain: function (_type: unknown, _name: unknown, _level: unknown): number {
      const type = helper.string("getActionRepGain", "type", _type);
      const name = helper.string("getActionRepGain", "name", _name);
      const level = helper.number("getActionRepGain", "level", _level);
      helper.updateDynamicRam("getActionRepGain", getRamCost(player, "bladeburner", "getActionRepGain"));
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
    getActionCountRemaining: function (_type: unknown, _name: unknown): number {
      const type = helper.string("getActionCountRemaining", "type", _type);
      const name = helper.string("getActionCountRemaining", "name", _name);
      helper.updateDynamicRam("getActionCountRemaining", getRamCost(player, "bladeburner", "getActionCountRemaining"));
      checkBladeburnerAccess("getActionCountRemaining");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      try {
        return bladeburner.getActionCountRemainingNetscriptFn(type, name, workerScript);
      } catch (e: any) {
        throw helper.makeRuntimeErrorMsg("bladeburner.getActionCountRemaining", e);
      }
    },
    getActionMaxLevel: function (_type: unknown, _name: unknown): number {
      const type = helper.string("getActionMaxLevel", "type", _type);
      const name = helper.string("getActionMaxLevel", "name", _name);
      helper.updateDynamicRam("getActionMaxLevel", getRamCost(player, "bladeburner", "getActionMaxLevel"));
      checkBladeburnerAccess("getActionMaxLevel");
      const action = getBladeburnerActionObject("getActionMaxLevel", type, name);
      return action.maxLevel;
    },
    getActionCurrentLevel: function (_type: unknown, _name: unknown): number {
      const type = helper.string("getActionCurrentLevel", "type", _type);
      const name = helper.string("getActionCurrentLevel", "name", _name);
      helper.updateDynamicRam("getActionCurrentLevel", getRamCost(player, "bladeburner", "getActionCurrentLevel"));
      checkBladeburnerAccess("getActionCurrentLevel");
      const action = getBladeburnerActionObject("getActionCurrentLevel", type, name);
      return action.level;
    },
    getActionAutolevel: function (_type: unknown, _name: unknown): boolean {
      const type = helper.string("getActionAutolevel", "type", _type);
      const name = helper.string("getActionAutolevel", "name", _name);
      helper.updateDynamicRam("getActionAutolevel", getRamCost(player, "bladeburner", "getActionAutolevel"));
      checkBladeburnerAccess("getActionAutolevel");
      const action = getBladeburnerActionObject("getActionCurrentLevel", type, name);
      return action.autoLevel;
    },
    setActionAutolevel: function (_type: unknown, _name: unknown, _autoLevel: unknown = true): void {
      const type = helper.string("setActionAutolevel", "type", _type);
      const name = helper.string("setActionAutolevel", "name", _name);
      const autoLevel = helper.boolean(_autoLevel);
      helper.updateDynamicRam("setActionAutolevel", getRamCost(player, "bladeburner", "setActionAutolevel"));
      checkBladeburnerAccess("setActionAutolevel");
      const action = getBladeburnerActionObject("setActionAutolevel", type, name);
      action.autoLevel = autoLevel;
    },
    setActionLevel: function (_type: unknown, _name: unknown, _level: unknown = 1): void {
      const type = helper.string("setActionLevel", "type", _type);
      const name = helper.string("setActionLevel", "name", _name);
      const level = helper.number("setActionLevel", "level", _level);
      helper.updateDynamicRam("setActionLevel", getRamCost(player, "bladeburner", "setActionLevel"));
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
      helper.updateDynamicRam("getRank", getRamCost(player, "bladeburner", "getRank"));
      checkBladeburnerAccess("getRank");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.rank;
    },
    getSkillPoints: function (): number {
      helper.updateDynamicRam("getSkillPoints", getRamCost(player, "bladeburner", "getSkillPoints"));
      checkBladeburnerAccess("getSkillPoints");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.skillPoints;
    },
    getSkillLevel: function (_skillName: unknown): number {
      const skillName = helper.string("getSkillLevel", "skillName", _skillName);
      helper.updateDynamicRam("getSkillLevel", getRamCost(player, "bladeburner", "getSkillLevel"));
      checkBladeburnerAccess("getSkillLevel");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      try {
        return bladeburner.getSkillLevelNetscriptFn(skillName, workerScript);
      } catch (e: any) {
        throw helper.makeRuntimeErrorMsg("bladeburner.getSkillLevel", e);
      }
    },
    getSkillUpgradeCost: function (_skillName: unknown): number {
      const skillName = helper.string("getSkillUpgradeCost", "skillName", _skillName);
      helper.updateDynamicRam("getSkillUpgradeCost", getRamCost(player, "bladeburner", "getSkillUpgradeCost"));
      checkBladeburnerAccess("getSkillUpgradeCost");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      try {
        return bladeburner.getSkillUpgradeCostNetscriptFn(skillName, workerScript);
      } catch (e: any) {
        throw helper.makeRuntimeErrorMsg("bladeburner.getSkillUpgradeCost", e);
      }
    },
    upgradeSkill: function (_skillName: unknown): boolean {
      const skillName = helper.string("upgradeSkill", "skillName", _skillName);
      helper.updateDynamicRam("upgradeSkill", getRamCost(player, "bladeburner", "upgradeSkill"));
      checkBladeburnerAccess("upgradeSkill");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      try {
        return bladeburner.upgradeSkillNetscriptFn(skillName, workerScript);
      } catch (e: any) {
        throw helper.makeRuntimeErrorMsg("bladeburner.upgradeSkill", e);
      }
    },
    getTeamSize: function (_type: unknown, _name: unknown): number {
      const type = helper.string("getTeamSize", "type", _type);
      const name = helper.string("getTeamSize", "name", _name);
      helper.updateDynamicRam("getTeamSize", getRamCost(player, "bladeburner", "getTeamSize"));
      checkBladeburnerAccess("getTeamSize");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      try {
        return bladeburner.getTeamSizeNetscriptFn(type, name, workerScript);
      } catch (e: any) {
        throw helper.makeRuntimeErrorMsg("bladeburner.getTeamSize", e);
      }
    },
    setTeamSize: function (_type: unknown, _name: unknown, _size: unknown): number {
      const type = helper.string("setTeamSize", "type", _type);
      const name = helper.string("setTeamSize", "name", _name);
      const size = helper.number("setTeamSize", "size", _size);
      helper.updateDynamicRam("setTeamSize", getRamCost(player, "bladeburner", "setTeamSize"));
      checkBladeburnerAccess("setTeamSize");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      try {
        return bladeburner.setTeamSizeNetscriptFn(type, name, size, workerScript);
      } catch (e: any) {
        throw helper.makeRuntimeErrorMsg("bladeburner.setTeamSize", e);
      }
    },
    getCityEstimatedPopulation: function (_cityName: unknown): number {
      const cityName = helper.string("getCityEstimatedPopulation", "cityName", _cityName);
      helper.updateDynamicRam(
        "getCityEstimatedPopulation",
        getRamCost(player, "bladeburner", "getCityEstimatedPopulation"),
      );
      checkBladeburnerAccess("getCityEstimatedPopulation");
      checkBladeburnerCity("getCityEstimatedPopulation", cityName);
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.cities[cityName].popEst;
    },
    getCityCommunities: function (_cityName: unknown): number {
      const cityName = helper.string("getCityCommunities", "cityName", _cityName);
      helper.updateDynamicRam("getCityCommunities", getRamCost(player, "bladeburner", "getCityCommunities"));
      checkBladeburnerAccess("getCityCommunities");
      checkBladeburnerCity("getCityCommunities", cityName);
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.cities[cityName].comms;
    },
    getCityChaos: function (_cityName: unknown): number {
      const cityName = helper.string("getCityChaos", "cityName", _cityName);
      helper.updateDynamicRam("getCityChaos", getRamCost(player, "bladeburner", "getCityChaos"));
      checkBladeburnerAccess("getCityChaos");
      checkBladeburnerCity("getCityChaos", cityName);
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.cities[cityName].chaos;
    },
    getCity: function (): string {
      helper.updateDynamicRam("getCity", getRamCost(player, "bladeburner", "getCity"));
      checkBladeburnerAccess("getCityChaos");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.city;
    },
    switchCity: function (_cityName: unknown): boolean {
      const cityName = helper.string("switchCity", "cityName", _cityName);
      helper.updateDynamicRam("switchCity", getRamCost(player, "bladeburner", "switchCity"));
      checkBladeburnerAccess("switchCity");
      checkBladeburnerCity("switchCity", cityName);
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      bladeburner.city = cityName;
      return true;
    },
    getStamina: function (): [number, number] {
      helper.updateDynamicRam("getStamina", getRamCost(player, "bladeburner", "getStamina"));
      checkBladeburnerAccess("getStamina");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return [bladeburner.stamina, bladeburner.maxStamina];
    },
    joinBladeburnerFaction: function (): boolean {
      helper.updateDynamicRam("joinBladeburnerFaction", getRamCost(player, "bladeburner", "joinBladeburnerFaction"));
      checkBladeburnerAccess("joinBladeburnerFaction", true);
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.joinBladeburnerFactionNetscriptFn(workerScript);
    },
    joinBladeburnerDivision: function (): boolean {
      helper.updateDynamicRam("joinBladeburnerDivision", getRamCost(player, "bladeburner", "joinBladeburnerDivision"));
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
          workerScript.log("joinBladeburnerDivision", () => "You have been accepted into the Bladeburner division");

          return true;
        } else {
          workerScript.log(
            "joinBladeburnerDivision",
            () => "You do not meet the requirements for joining the Bladeburner division",
          );
          return false;
        }
      }
      return false;
    },
    getBonusTime: function (): number {
      helper.updateDynamicRam("getBonusTime", getRamCost(player, "bladeburner", "getBonusTime"));
      checkBladeburnerAccess("getBonusTime");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return Math.round(bladeburner.storedCycles / 5) * 1000;
    },
  };
}
