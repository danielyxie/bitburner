import { INetscriptHelper } from "./INetscriptHelper";
import { WorkerScript } from "../Netscript/WorkerScript";
import { IPlayer } from "../PersonObjects/IPlayer";
import { calculateServerGrowth } from "../Server/formulas/grow";
import {
  calculateMoneyGainRate,
  calculateLevelUpgradeCost,
  calculateRamUpgradeCost,
  calculateCoreUpgradeCost,
  calculateNodeCost,
} from "../Hacknet/formulas/HacknetNodes";
import {
  calculateHashGainRate as HScalculateHashGainRate,
  calculateLevelUpgradeCost as HScalculateLevelUpgradeCost,
  calculateRamUpgradeCost as HScalculateRamUpgradeCost,
  calculateCoreUpgradeCost as HScalculateCoreUpgradeCost,
  calculateCacheUpgradeCost as HScalculateCacheUpgradeCost,
  calculateServerCost as HScalculateServerCost,
} from "../Hacknet/formulas/HacknetServers";
import { HacknetNodeConstants, HacknetServerConstants } from "../Hacknet/data/Constants";
import { calculateSkill, calculateExp } from "../PersonObjects/formulas/skill";
import {
  calculateHackingChance,
  calculateHackingExpGain,
  calculatePercentMoneyHacked,
  calculateHackingTime,
  calculateGrowTime,
  calculateWeakenTime,
} from "../Hacking";
import { Programs } from "../Programs/Programs";
import { Formulas as IFormulas } from "../ScriptEditor/NetscriptDefinitions";
import {
  calculateRespectGain,
  calculateWantedLevelGain,
  calculateMoneyGain,
  calculateWantedPenalty,
} from "../Gang/formulas/formulas";

export interface INetscriptFormulas {
  skills: {
    calculateSkill(exp: any, mult?: any): any;
    calculateExp(skill: any, mult?: any): any;
  };
  hacking: {
    hackChance(server: any, player: any): any;
    hackExp(server: any, player: any): any;
    hackPercent(server: any, player: any): any;
    growPercent(server: any, threads: any, player: any, cores?: any): any;
    hackTime(server: any, player: any): any;
    growTime(server: any, player: any): any;
    weakenTime(server: any, player: any): any;
  };
  hacknetNodes: {
    moneyGainRate(level: any, ram: any, cores: any, mult?: any): any;
    levelUpgradeCost(startingLevel: any, extraLevels?: any, costMult?: any): any;
    ramUpgradeCost(startingRam: any, extraLevels?: any, costMult?: any): any;
    coreUpgradeCost(startingCore: any, extraCores?: any, costMult?: any): any;
    hacknetNodeCost(n: any, mult: any): any;
    constants(): any;
  };
  hacknetServers: {
    hashGainRate(level: any, ramUsed: any, maxRam: any, cores: any, mult?: any): any;
    levelUpgradeCost(startingLevel: any, extraLevels?: any, costMult?: any): any;
    ramUpgradeCost(startingRam: any, extraLevels?: any, costMult?: any): any;
    coreUpgradeCost(startingCore: any, extraCores?: any, costMult?: any): any;
    cacheUpgradeCost(startingCache: any, extraCache?: any): any;
    hashUpgradeCost(upgName: any, level: any): any;
    hacknetServerCost(n: any, mult: any): any;
    constants(): any;
  };
}

export function NetscriptFormulas(player: IPlayer, workerScript: WorkerScript, helper: INetscriptHelper): IFormulas {
  const checkFormulasAccess = function (func: string): void {
    if (!player.hasProgram(Programs.Formulas.name)) {
      throw helper.makeRuntimeErrorMsg(`formulas.${func}`, `Requires Formulas.exe to run.`);
    }
  };
  return {
    skills: {
      calculateSkill: function (exp: any, mult: any = 1): any {
        checkFormulasAccess("basic.calculateSkill");
        return calculateSkill(exp, mult);
      },
      calculateExp: function (skill: any, mult: any = 1): any {
        checkFormulasAccess("basic.calculateExp");
        return calculateExp(skill, mult);
      },
    },
    hacking: {
      hackChance: function (server: any, player: any): any {
        checkFormulasAccess("basic.hackChance");
        return calculateHackingChance(server, player);
      },
      hackExp: function (server: any, player: any): any {
        checkFormulasAccess("basic.hackExp");
        return calculateHackingExpGain(server, player);
      },
      hackPercent: function (server: any, player: any): any {
        checkFormulasAccess("basic.hackPercent");
        return calculatePercentMoneyHacked(server, player);
      },
      growPercent: function (server: any, threads: any, player: any, cores: any = 1): any {
        checkFormulasAccess("basic.growPercent");
        return calculateServerGrowth(server, threads, player, cores);
      },
      hackTime: function (server: any, player: any): any {
        checkFormulasAccess("basic.hackTime");
        return calculateHackingTime(server, player) * 1000;
      },
      growTime: function (server: any, player: any): any {
        checkFormulasAccess("basic.growTime");
        return calculateGrowTime(server, player) * 1000;
      },
      weakenTime: function (server: any, player: any): any {
        checkFormulasAccess("basic.weakenTime");
        return calculateWeakenTime(server, player) * 1000;
      },
    },
    hacknetNodes: {
      moneyGainRate: function (level: any, ram: any, cores: any, mult: any = 1): any {
        checkFormulasAccess("hacknetNodes.moneyGainRate");
        return calculateMoneyGainRate(level, ram, cores, mult);
      },
      levelUpgradeCost: function (startingLevel: any, extraLevels: any = 1, costMult: any = 1): any {
        checkFormulasAccess("hacknetNodes.levelUpgradeCost");
        return calculateLevelUpgradeCost(startingLevel, extraLevels, costMult);
      },
      ramUpgradeCost: function (startingRam: any, extraLevels: any = 1, costMult: any = 1): any {
        checkFormulasAccess("hacknetNodes.ramUpgradeCost");
        return calculateRamUpgradeCost(startingRam, extraLevels, costMult);
      },
      coreUpgradeCost: function (startingCore: any, extraCores: any = 1, costMult: any = 1): any {
        checkFormulasAccess("hacknetNodes.coreUpgradeCost");
        return calculateCoreUpgradeCost(startingCore, extraCores, costMult);
      },
      hacknetNodeCost: function (n: any, mult: any): any {
        checkFormulasAccess("hacknetNodes.hacknetNodeCost");
        return calculateNodeCost(n, mult);
      },
      constants: function (): any {
        checkFormulasAccess("hacknetNodes.constants");
        return Object.assign({}, HacknetNodeConstants);
      },
    },
    hacknetServers: {
      hashGainRate: function (level: any, ramUsed: any, maxRam: any, cores: any, mult: any = 1): any {
        checkFormulasAccess("hacknetServers.hashGainRate");
        return HScalculateHashGainRate(level, ramUsed, maxRam, cores, mult);
      },
      levelUpgradeCost: function (startingLevel: any, extraLevels: any = 1, costMult: any = 1): any {
        checkFormulasAccess("hacknetServers.levelUpgradeCost");
        return HScalculateLevelUpgradeCost(startingLevel, extraLevels, costMult);
      },
      ramUpgradeCost: function (startingRam: any, extraLevels: any = 1, costMult: any = 1): any {
        checkFormulasAccess("hacknetServers.ramUpgradeCost");
        return HScalculateRamUpgradeCost(startingRam, extraLevels, costMult);
      },
      coreUpgradeCost: function (startingCore: any, extraCores: any = 1, costMult: any = 1): any {
        checkFormulasAccess("hacknetServers.coreUpgradeCost");
        return HScalculateCoreUpgradeCost(startingCore, extraCores, costMult);
      },
      cacheUpgradeCost: function (startingCache: any, extraCache: any = 1): any {
        checkFormulasAccess("hacknetServers.cacheUpgradeCost");
        return HScalculateCacheUpgradeCost(startingCache, extraCache);
      },
      hashUpgradeCost: function (upgName: any, level: any): any {
        checkFormulasAccess("hacknetServers.hashUpgradeCost");
        const upg = player.hashManager.getUpgrade(upgName);
        if (!upg) {
          throw helper.makeRuntimeErrorMsg(
            "formulas.hacknetServers.calculateHashUpgradeCost",
            `Invalid Hash Upgrade: ${upgName}`,
          );
        }
        return upg.getCost(level);
      },
      hacknetServerCost: function (n: any, mult: any): any {
        checkFormulasAccess("hacknetServers.hacknetServerCost");
        return HScalculateServerCost(n, mult);
      },
      constants: function (): any {
        checkFormulasAccess("hacknetServers.constants");
        return Object.assign({}, HacknetServerConstants);
      },
    },
    gang: {
      calculateWantedPenalty(gang: any): number {
        return calculateWantedPenalty(gang);
      },
      calculateRespectGain: function (gang: any, member: any, task: any): number {
        return calculateRespectGain(gang, member, task);
      },
      calculateWantedLevelGain: function (gang: any, member: any, task: any): number {
        return calculateWantedLevelGain(gang, member, task);
      },
      calculateMoneyGain: function (gang: any, member: any, task: any): number {
        return calculateMoneyGain(gang, member, task);
      },
    },
  };
}
