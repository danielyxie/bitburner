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

  const updateRam = (funcName: string): void =>
    helper.updateDynamicRam(funcName, getRamCost(player, "bladeburner", funcName));

  return {
    getContractNames: function (): string[] {
      updateRam("getContractNames");
      checkBladeburnerAccess("getContractNames");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.getContractNamesNetscriptFn();
    },
    getOperationNames: function (): string[] {
      updateRam("getOperationNames");
      checkBladeburnerAccess("getOperationNames");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.getOperationNamesNetscriptFn();
    },
    getBlackOpNames: function (): string[] {
      updateRam("getBlackOpNames");
      checkBladeburnerAccess("getBlackOpNames");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.getBlackOpNamesNetscriptFn();
    },
    getBlackOpRank: function (_blackOpName: unknown): number {
      updateRam("getBlackOpRank");
      const blackOpName = helper.string("getBlackOpRank", "blackOpName", _blackOpName);
      checkBladeburnerAccess("getBlackOpRank");
      const action: any = getBladeburnerActionObject("getBlackOpRank", "blackops", blackOpName);
      return action.reqdRank;
    },
    getGeneralActionNames: function (): string[] {
      updateRam("getGeneralActionNames");
      checkBladeburnerAccess("getGeneralActionNames");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.getGeneralActionNamesNetscriptFn();
    },
    getSkillNames: function (): string[] {
      updateRam("getSkillNames");
      checkBladeburnerAccess("getSkillNames");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.getSkillNamesNetscriptFn();
    },
    startAction: function (_type: unknown, _name: unknown): boolean {
      updateRam("startAction");
      const type = helper.string("startAction", "type", _type);
      const name = helper.string("startAction", "name", _name);
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
      updateRam("stopBladeburnerAction");
      checkBladeburnerAccess("stopBladeburnerAction");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.resetAction();
    },
    getCurrentAction: function (): BladeburnerCurAction {
      updateRam("getCurrentAction");
      checkBladeburnerAccess("getCurrentAction");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.getTypeAndNameFromActionId(bladeburner.action);
    },
    getActionTime: function (_type: unknown, _name: unknown): number {
      updateRam("getActionTime");
      const type = helper.string("getActionTime", "type", _type);
      const name = helper.string("getActionTime", "name", _name);
      checkBladeburnerAccess("getActionTime");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      try {
        return bladeburner.getActionTimeNetscriptFn(player, type, name, workerScript);
      } catch (e: any) {
        throw helper.makeRuntimeErrorMsg("bladeburner.getActionTime", e);
      }
    },
    getActionEstimatedSuccessChance: function (_type: unknown, _name: unknown): [number, number] {
      updateRam("getActionEstimatedSuccessChance");
      const type = helper.string("getActionEstimatedSuccessChance", "type", _type);
      const name = helper.string("getActionEstimatedSuccessChance", "name", _name);
      checkBladeburnerAccess("getActionEstimatedSuccessChance");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      try {
        return bladeburner.getActionEstimatedSuccessChanceNetscriptFn(player, type, name, workerScript);
      } catch (e: any) {
        throw helper.makeRuntimeErrorMsg("bladeburner.getActionEstimatedSuccessChance", e);
      }
    },
    getActionRepGain: function (_type: unknown, _name: unknown, _level: unknown): number {
      updateRam("getActionRepGain");
      const type = helper.string("getActionRepGain", "type", _type);
      const name = helper.string("getActionRepGain", "name", _name);
      const level = helper.number("getActionRepGain", "level", _level);
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
      updateRam("getActionCountRemaining");
      const type = helper.string("getActionCountRemaining", "type", _type);
      const name = helper.string("getActionCountRemaining", "name", _name);
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
      updateRam("getActionMaxLevel");
      const type = helper.string("getActionMaxLevel", "type", _type);
      const name = helper.string("getActionMaxLevel", "name", _name);
      checkBladeburnerAccess("getActionMaxLevel");
      const action = getBladeburnerActionObject("getActionMaxLevel", type, name);
      return action.maxLevel;
    },
    getActionCurrentLevel: function (_type: unknown, _name: unknown): number {
      updateRam("getActionCurrentLevel");
      const type = helper.string("getActionCurrentLevel", "type", _type);
      const name = helper.string("getActionCurrentLevel", "name", _name);
      checkBladeburnerAccess("getActionCurrentLevel");
      const action = getBladeburnerActionObject("getActionCurrentLevel", type, name);
      return action.level;
    },
    getActionAutolevel: function (_type: unknown, _name: unknown): boolean {
      updateRam("getActionAutolevel");
      const type = helper.string("getActionAutolevel", "type", _type);
      const name = helper.string("getActionAutolevel", "name", _name);
      checkBladeburnerAccess("getActionAutolevel");
      const action = getBladeburnerActionObject("getActionCurrentLevel", type, name);
      return action.autoLevel;
    },
    setActionAutolevel: function (_type: unknown, _name: unknown, _autoLevel: unknown = true): void {
      updateRam("setActionAutolevel");
      const type = helper.string("setActionAutolevel", "type", _type);
      const name = helper.string("setActionAutolevel", "name", _name);
      const autoLevel = helper.boolean(_autoLevel);
      checkBladeburnerAccess("setActionAutolevel");
      const action = getBladeburnerActionObject("setActionAutolevel", type, name);
      action.autoLevel = autoLevel;
    },
    setActionLevel: function (_type: unknown, _name: unknown, _level: unknown = 1): void {
      updateRam("setActionLevel");
      const type = helper.string("setActionLevel", "type", _type);
      const name = helper.string("setActionLevel", "name", _name);
      const level = helper.number("setActionLevel", "level", _level);
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
      updateRam("getRank");
      checkBladeburnerAccess("getRank");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.rank;
    },
    getSkillPoints: function (): number {
      updateRam("getSkillPoints");
      checkBladeburnerAccess("getSkillPoints");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.skillPoints;
    },
    getSkillLevel: function (_skillName: unknown): number {
      updateRam("getSkillLevel");
      const skillName = helper.string("getSkillLevel", "skillName", _skillName);
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
      updateRam("getSkillUpgradeCost");
      const skillName = helper.string("getSkillUpgradeCost", "skillName", _skillName);
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
      updateRam("upgradeSkill");
      const skillName = helper.string("upgradeSkill", "skillName", _skillName);
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
      updateRam("getTeamSize");
      const type = helper.string("getTeamSize", "type", _type);
      const name = helper.string("getTeamSize", "name", _name);
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
      updateRam("setTeamSize");
      const type = helper.string("setTeamSize", "type", _type);
      const name = helper.string("setTeamSize", "name", _name);
      const size = helper.number("setTeamSize", "size", _size);
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
      updateRam("getCityEstimatedPopulation");
      const cityName = helper.string("getCityEstimatedPopulation", "cityName", _cityName);
      checkBladeburnerAccess("getCityEstimatedPopulation");
      checkBladeburnerCity("getCityEstimatedPopulation", cityName);
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.cities[cityName].popEst;
    },
    getCityCommunities: function (_cityName: unknown): number {
      updateRam("getCityCommunities");
      const cityName = helper.string("getCityCommunities", "cityName", _cityName);
      checkBladeburnerAccess("getCityCommunities");
      checkBladeburnerCity("getCityCommunities", cityName);
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.cities[cityName].comms;
    },
    getCityChaos: function (_cityName: unknown): number {
      updateRam("getCityChaos");
      const cityName = helper.string("getCityChaos", "cityName", _cityName);
      checkBladeburnerAccess("getCityChaos");
      checkBladeburnerCity("getCityChaos", cityName);
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.cities[cityName].chaos;
    },
    getCity: function (): string {
      updateRam("getCity");
      checkBladeburnerAccess("getCityChaos");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.city;
    },
    switchCity: function (_cityName: unknown): boolean {
      updateRam("switchCity");
      const cityName = helper.string("switchCity", "cityName", _cityName);
      checkBladeburnerAccess("switchCity");
      checkBladeburnerCity("switchCity", cityName);
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      bladeburner.city = cityName;
      return true;
    },
    getStamina: function (): [number, number] {
      updateRam("getStamina");
      checkBladeburnerAccess("getStamina");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return [bladeburner.stamina, bladeburner.maxStamina];
    },
    joinBladeburnerFaction: function (): boolean {
      updateRam("joinBladeburnerFaction");
      checkBladeburnerAccess("joinBladeburnerFaction", true);
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.joinBladeburnerFactionNetscriptFn(workerScript);
    },
    joinBladeburnerDivision: function (): boolean {
      updateRam("joinBladeburnerDivision");
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
      updateRam("getBonusTime");
      checkBladeburnerAccess("getBonusTime");
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return Math.round(bladeburner.storedCycles / 5) * 1000;
    },
  };
}
