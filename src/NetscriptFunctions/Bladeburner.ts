import { WorkerScript } from "../Netscript/WorkerScript";
import { IPlayer } from "../PersonObjects/IPlayer";
import { Bladeburner } from "../Bladeburner/Bladeburner";
import { BitNodeMultipliers } from "../BitNode/BitNodeMultipliers";
import { Bladeburner as INetscriptBladeburner, BladeburnerCurAction } from "../ScriptEditor/NetscriptDefinitions";
import { IAction } from "src/Bladeburner/IAction";
import { InternalAPI, NetscriptContext } from "src/Netscript/APIWrapper";

export function NetscriptBladeburner(player: IPlayer, workerScript: WorkerScript): InternalAPI<INetscriptBladeburner> {
  const checkBladeburnerAccess = function (ctx: NetscriptContext, skipjoined = false): void {
    const bladeburner = player.bladeburner;
    if (bladeburner === null) throw new Error("Must have joined bladeburner");
    const apiAccess =
      player.bitNodeN === 7 ||
      player.sourceFiles.some((a) => {
        return a.n === 7;
      });
    if (!apiAccess) {
      const apiDenied = `You do not currently have access to the Bladeburner API. You must either be in BitNode-7 or have Source-File 7.`;
      throw ctx.makeRuntimeErrorMsg(apiDenied);
    }
    if (!skipjoined) {
      const bladeburnerAccess = bladeburner instanceof Bladeburner;
      if (!bladeburnerAccess) {
        const bladeburnerDenied = `You must be a member of the Bladeburner division to use this API.`;
        throw ctx.makeRuntimeErrorMsg(bladeburnerDenied);
      }
    }
  };

  const checkBladeburnerCity = function (ctx: NetscriptContext, city: string): void {
    const bladeburner = player.bladeburner;
    if (bladeburner === null) throw new Error("Must have joined bladeburner");
    if (!bladeburner.cities.hasOwnProperty(city)) {
      throw ctx.makeRuntimeErrorMsg(`Invalid city: ${city}`);
    }
  };

  const getBladeburnerActionObject = function (ctx: NetscriptContext, type: string, name: string): IAction {
    const bladeburner = player.bladeburner;
    if (bladeburner === null) throw new Error("Must have joined bladeburner");
    const actionId = bladeburner.getActionIdFromTypeAndName(type, name);
    if (!actionId) {
      throw ctx.makeRuntimeErrorMsg(`Invalid action type='${type}', name='${name}'`);
    }
    const actionObj = bladeburner.getActionObject(actionId);
    if (!actionObj) {
      throw ctx.makeRuntimeErrorMsg(`Invalid action type='${type}', name='${name}'`);
    }

    return actionObj;
  };

  return {
    getContractNames: (ctx: NetscriptContext) => (): string[] => {
      checkBladeburnerAccess(ctx);
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.getContractNamesNetscriptFn();
    },
    getOperationNames: (ctx: NetscriptContext) => (): string[] => {
      checkBladeburnerAccess(ctx);
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.getOperationNamesNetscriptFn();
    },
    getBlackOpNames: (ctx: NetscriptContext) => (): string[] => {
      checkBladeburnerAccess(ctx);
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.getBlackOpNamesNetscriptFn();
    },
    getBlackOpRank:
      (ctx: NetscriptContext) =>
        (_blackOpName: unknown): number => {
          const blackOpName = ctx.helper.string("blackOpName", _blackOpName);
          checkBladeburnerAccess(ctx);
          const action: any = getBladeburnerActionObject(ctx, "blackops", blackOpName);
          return action.reqdRank;
        },
    getGeneralActionNames: (ctx: NetscriptContext) => (): string[] => {
      checkBladeburnerAccess(ctx);
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.getGeneralActionNamesNetscriptFn();
    },
    getSkillNames: (ctx: NetscriptContext) => (): string[] => {
      checkBladeburnerAccess(ctx);
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.getSkillNamesNetscriptFn();
    },
    startAction:
      (ctx: NetscriptContext) =>
        (_type: unknown, _name: unknown): boolean => {
          const type = ctx.helper.string("type", _type);
          const name = ctx.helper.string("name", _name);
          checkBladeburnerAccess(ctx);
          const bladeburner = player.bladeburner;
          if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
          try {
            return bladeburner.startActionNetscriptFn(player, type, name, workerScript);
          } catch (e: any) {
            throw ctx.makeRuntimeErrorMsg(e);
          }
        },
    stopBladeburnerAction: (ctx: NetscriptContext) => (): void => {
      checkBladeburnerAccess(ctx);
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.resetAction();
    },
    getCurrentAction: (ctx: NetscriptContext) => (): BladeburnerCurAction => {
      checkBladeburnerAccess(ctx);
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.getTypeAndNameFromActionId(bladeburner.action);
    },
    getActionTime:
      (ctx: NetscriptContext) =>
        (_type: unknown, _name: unknown): number => {
          const type = ctx.helper.string("type", _type);
          const name = ctx.helper.string("name", _name);
          checkBladeburnerAccess(ctx);
          const bladeburner = player.bladeburner;
          if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
          try {
            const time = bladeburner.getActionTimeNetscriptFn(player, type, name);
            if (typeof time === "string") {
              const errorLogText = `Invalid action: type='${type}' name='${name}'`;
              ctx.log(() => errorLogText);
              return -1;
            } else {
              return time;
            }
          } catch (e: any) {
            throw ctx.makeRuntimeErrorMsg(e);
          }
        },
    getActionCurrentTime: (ctx: NetscriptContext) => (): number => {
      checkBladeburnerAccess(ctx);
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      try {
        const timecomputed =
          Math.min(bladeburner.actionTimeCurrent + bladeburner.actionTimeOverflow, bladeburner.actionTimeToComplete) *
          1000;
        return timecomputed;
      } catch (e: any) {
        throw ctx.makeRuntimeErrorMsg(e);
      }
    },
    getActionEstimatedSuccessChance:
      (ctx: NetscriptContext) =>
        (_type: unknown, _name: unknown): [number, number] => {
          const type = ctx.helper.string("type", _type);
          const name = ctx.helper.string("name", _name);
          checkBladeburnerAccess(ctx);
          const bladeburner = player.bladeburner;
          if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
          try {
            const chance = bladeburner.getActionEstimatedSuccessChanceNetscriptFn(player, type, name);
            if (typeof chance === "string") {
              const errorLogText = `Invalid action: type='${type}' name='${name}'`;
              ctx.log(() => errorLogText);
              return [-1, -1];
            } else {
              return chance;
            }
          } catch (e: any) {
            throw ctx.makeRuntimeErrorMsg(e);
          }
        },
    getActionRepGain:
      (ctx: NetscriptContext) =>
        (_type: unknown, _name: unknown, _level: unknown): number => {
          const type = ctx.helper.string("type", _type);
          const name = ctx.helper.string("name", _name);
          const level = ctx.helper.number("level", _level);
          checkBladeburnerAccess(ctx);
          const action = getBladeburnerActionObject(ctx, type, name);
          let rewardMultiplier;
          if (level == null || isNaN(level)) {
            rewardMultiplier = Math.pow(action.rewardFac, action.level - 1);
          } else {
            rewardMultiplier = Math.pow(action.rewardFac, level - 1);
          }

          return action.rankGain * rewardMultiplier * BitNodeMultipliers.BladeburnerRank;
        },
    getActionCountRemaining:
      (ctx: NetscriptContext) =>
        (_type: unknown, _name: unknown): number => {
          const type = ctx.helper.string("type", _type);
          const name = ctx.helper.string("name", _name);
          checkBladeburnerAccess(ctx);
          const bladeburner = player.bladeburner;
          if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
          try {
            return bladeburner.getActionCountRemainingNetscriptFn(type, name, workerScript);
          } catch (e: any) {
            throw ctx.makeRuntimeErrorMsg(e);
          }
        },
    getActionMaxLevel:
      (ctx: NetscriptContext) =>
        (_type: unknown, _name: unknown): number => {
          const type = ctx.helper.string("type", _type);
          const name = ctx.helper.string("name", _name);
          checkBladeburnerAccess(ctx);
          const action = getBladeburnerActionObject(ctx, type, name);
          return action.maxLevel;
        },
    getActionCurrentLevel:
      (ctx: NetscriptContext) =>
        (_type: unknown, _name: unknown): number => {
          const type = ctx.helper.string("type", _type);
          const name = ctx.helper.string("name", _name);
          checkBladeburnerAccess(ctx);
          const action = getBladeburnerActionObject(ctx, type, name);
          return action.level;
        },
    getActionAutolevel:
      (ctx: NetscriptContext) =>
        (_type: unknown, _name: unknown): boolean => {
          const type = ctx.helper.string("type", _type);
          const name = ctx.helper.string("name", _name);
          checkBladeburnerAccess(ctx);
          const action = getBladeburnerActionObject(ctx, type, name);
          return action.autoLevel;
        },
    setActionAutolevel:
      (ctx: NetscriptContext) =>
        (_type: unknown, _name: unknown, _autoLevel: unknown = true): void => {
          const type = ctx.helper.string("type", _type);
          const name = ctx.helper.string("name", _name);
          const autoLevel = ctx.helper.boolean(_autoLevel);
          checkBladeburnerAccess(ctx);
          const action = getBladeburnerActionObject(ctx, type, name);
          action.autoLevel = autoLevel;
        },
    setActionLevel:
      (ctx: NetscriptContext) =>
        (_type: unknown, _name: unknown, _level: unknown = 1): void => {
          const type = ctx.helper.string("type", _type);
          const name = ctx.helper.string("name", _name);
          const level = ctx.helper.number("level", _level);
          checkBladeburnerAccess(ctx);
          const action = getBladeburnerActionObject(ctx, type, name);
          if (level < 1 || level > action.maxLevel) {
            ctx.helper.makeRuntimeErrorMsg(`Level must be between 1 and ${action.maxLevel}, is ${level}`);
          }
          action.level = level;
        },
    getRank: (ctx: NetscriptContext) => (): number => {
      checkBladeburnerAccess(ctx);
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.rank;
    },
    getSkillPoints: (ctx: NetscriptContext) => (): number => {
      checkBladeburnerAccess(ctx);
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.skillPoints;
    },
    getSkillLevel:
      (ctx: NetscriptContext) =>
        (_skillName: unknown): number => {
          const skillName = ctx.helper.string("skillName", _skillName);
          checkBladeburnerAccess(ctx);
          const bladeburner = player.bladeburner;
          if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
          try {
            return bladeburner.getSkillLevelNetscriptFn(skillName, workerScript);
          } catch (e: any) {
            throw ctx.makeRuntimeErrorMsg(e);
          }
        },
    getSkillUpgradeCost:
      (ctx: NetscriptContext) =>
        (_skillName: unknown): number => {
          const skillName = ctx.helper.string("skillName", _skillName);
          checkBladeburnerAccess(ctx);
          const bladeburner = player.bladeburner;
          if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
          try {
            return bladeburner.getSkillUpgradeCostNetscriptFn(skillName, workerScript);
          } catch (e: any) {
            throw ctx.makeRuntimeErrorMsg(e);
          }
        },
    upgradeSkill:
      (ctx: NetscriptContext) =>
        (_skillName: unknown, count = 1): number => {
          const skillName = ctx.helper.string("skillName", _skillName);
          checkBladeburnerAccess(ctx);
          const bladeburner = player.bladeburner;
          if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
          try {
            if(bladeburner.upgradeSkillNetscriptFn(skillName, count, workerScript)){
              return count;
            }
            else{
              return 0;
            }
          } catch (e: any) {
            throw ctx.makeRuntimeErrorMsg(e);
          }
        },
    getTeamSize:
      (ctx: NetscriptContext) =>
        (_type: unknown, _name: unknown): number => {
          const type = ctx.helper.string("type", _type);
          const name = ctx.helper.string("name", _name);
          checkBladeburnerAccess(ctx);
          const bladeburner = player.bladeburner;
          if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
          try {
            return bladeburner.getTeamSizeNetscriptFn(type, name, workerScript);
          } catch (e: any) {
            throw ctx.makeRuntimeErrorMsg(e);
          }
        },
    setTeamSize:
      (ctx: NetscriptContext) =>
        (_type: unknown, _name: unknown, _size: unknown): number => {
          const type = ctx.helper.string("type", _type);
          const name = ctx.helper.string("name", _name);
          const size = ctx.helper.number("size", _size);
          checkBladeburnerAccess(ctx);
          const bladeburner = player.bladeburner;
          if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
          try {
            return bladeburner.setTeamSizeNetscriptFn(type, name, size, workerScript);
          } catch (e: any) {
            throw ctx.makeRuntimeErrorMsg(e);
          }
        },
    getCityEstimatedPopulation:
      (ctx: NetscriptContext) =>
        (_cityName: unknown): number => {
          const cityName = ctx.helper.string("cityName", _cityName);
          checkBladeburnerAccess(ctx);
          checkBladeburnerCity(ctx, cityName);
          const bladeburner = player.bladeburner;
          if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
          return bladeburner.cities[cityName].popEst;
        },
    getCityCommunities:
      (ctx: NetscriptContext) =>
        (_cityName: unknown): number => {
          const cityName = ctx.helper.string("cityName", _cityName);
          checkBladeburnerAccess(ctx);
          checkBladeburnerCity(ctx, cityName);
          const bladeburner = player.bladeburner;
          if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
          return bladeburner.cities[cityName].comms;
        },
    getCityChaos:
      (ctx: NetscriptContext) =>
        (_cityName: unknown): number => {
          const cityName = ctx.helper.string("cityName", _cityName);
          checkBladeburnerAccess(ctx);
          checkBladeburnerCity(ctx, cityName);
          const bladeburner = player.bladeburner;
          if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
          return bladeburner.cities[cityName].chaos;
        },
    getCity: (ctx: NetscriptContext) => (): string => {
      checkBladeburnerAccess(ctx);
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.city;
    },
    switchCity:
      (ctx: NetscriptContext) =>
        (_cityName: unknown): boolean => {
          const cityName = ctx.helper.string("cityName", _cityName);
          checkBladeburnerAccess(ctx);
          checkBladeburnerCity(ctx, cityName);
          const bladeburner = player.bladeburner;
          if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
          bladeburner.city = cityName;
          return true;
        },
    getStamina: (ctx: NetscriptContext) => (): [number, number] => {
      checkBladeburnerAccess(ctx);
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return [bladeburner.stamina, bladeburner.maxStamina];
    },
    joinBladeburnerFaction: (ctx: NetscriptContext) => (): boolean => {
      checkBladeburnerAccess(ctx, true);
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return bladeburner.joinBladeburnerFactionNetscriptFn(workerScript);
    },
    joinBladeburnerDivision: (ctx: NetscriptContext) => (): boolean => {
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
          ctx.log(() => "You have been accepted into the Bladeburner division");

          return true;
        } else {
          ctx.log(() => "You do not meet the requirements for joining the Bladeburner division");
          return false;
        }
      }
      return false;
    },
    getBonusTime: (ctx: NetscriptContext) => (): number => {
      checkBladeburnerAccess(ctx);
      const bladeburner = player.bladeburner;
      if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
      return Math.round(bladeburner.storedCycles / 5) * 1000;
    },
  };
}
