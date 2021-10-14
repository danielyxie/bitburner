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

export interface INetscriptFormulas {
  basic: {
    calculateSkill(exp: any, mult?: any): any;
    calculateExp(skill: any, mult?: any): any;
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

export function NetscriptFormulas(
  player: IPlayer,
  workerScript: WorkerScript,
  helper: INetscriptHelper,
): INetscriptFormulas {
  const checkFormulasAccess = function (func: any, n: any): void {
    if (
      (player.sourceFileLvl(5) < 1 && player.bitNodeN !== 5) ||
      (player.sourceFileLvl(n) < 1 && player.bitNodeN !== n)
    ) {
      let extra = "";
      if (n !== 5) {
        extra = ` and Source-File ${n}-1`;
      }
      throw helper.makeRuntimeErrorMsg(`formulas.${func}`, `Requires Source-File 5-1${extra} to run.`);
    }
  };
  return {
    basic: {
      calculateSkill: function (exp: any, mult: any = 1): any {
        checkFormulasAccess("basic.calculateSkill", 5);
        return calculateSkill(exp, mult);
      },
      calculateExp: function (skill: any, mult: any = 1): any {
        checkFormulasAccess("basic.calculateExp", 5);
        return calculateExp(skill, mult);
      },
      hackChance: function (server: any, player: any): any {
        checkFormulasAccess("basic.hackChance", 5);
        return calculateHackingChance(server, player);
      },
      hackExp: function (server: any, player: any): any {
        checkFormulasAccess("basic.hackExp", 5);
        return calculateHackingExpGain(server, player);
      },
      hackPercent: function (server: any, player: any): any {
        checkFormulasAccess("basic.hackPercent", 5);
        return calculatePercentMoneyHacked(server, player);
      },
      growPercent: function (server: any, threads: any, player: any, cores: any = 1): any {
        checkFormulasAccess("basic.growPercent", 5);
        return calculateServerGrowth(server, threads, player, cores);
      },
      hackTime: function (server: any, player: any): any {
        checkFormulasAccess("basic.hackTime", 5);
        return calculateHackingTime(server, player);
      },
      growTime: function (server: any, player: any): any {
        checkFormulasAccess("basic.growTime", 5);
        return calculateGrowTime(server, player);
      },
      weakenTime: function (server: any, player: any): any {
        checkFormulasAccess("basic.weakenTime", 5);
        return calculateWeakenTime(server, player);
      },
    },
    hacknetNodes: {
      moneyGainRate: function (level: any, ram: any, cores: any, mult: any = 1): any {
        checkFormulasAccess("hacknetNodes.moneyGainRate", 5);
        return calculateMoneyGainRate(level, ram, cores, mult);
      },
      levelUpgradeCost: function (startingLevel: any, extraLevels: any = 1, costMult: any = 1): any {
        checkFormulasAccess("hacknetNodes.levelUpgradeCost", 5);
        return calculateLevelUpgradeCost(startingLevel, extraLevels, costMult);
      },
      ramUpgradeCost: function (startingRam: any, extraLevels: any = 1, costMult: any = 1): any {
        checkFormulasAccess("hacknetNodes.ramUpgradeCost", 5);
        return calculateRamUpgradeCost(startingRam, extraLevels, costMult);
      },
      coreUpgradeCost: function (startingCore: any, extraCores: any = 1, costMult: any = 1): any {
        checkFormulasAccess("hacknetNodes.coreUpgradeCost", 5);
        return calculateCoreUpgradeCost(startingCore, extraCores, costMult);
      },
      hacknetNodeCost: function (n: any, mult: any): any {
        checkFormulasAccess("hacknetNodes.hacknetNodeCost", 5);
        return calculateNodeCost(n, mult);
      },
      constants: function (): any {
        checkFormulasAccess("hacknetNodes.constants", 5);
        return Object.assign({}, HacknetNodeConstants);
      },
    },
    hacknetServers: {
      hashGainRate: function (level: any, ramUsed: any, maxRam: any, cores: any, mult: any = 1): any {
        checkFormulasAccess("hacknetServers.hashGainRate", 9);
        return HScalculateHashGainRate(level, ramUsed, maxRam, cores, mult);
      },
      levelUpgradeCost: function (startingLevel: any, extraLevels: any = 1, costMult: any = 1): any {
        checkFormulasAccess("hacknetServers.levelUpgradeCost", 9);
        return HScalculateLevelUpgradeCost(startingLevel, extraLevels, costMult);
      },
      ramUpgradeCost: function (startingRam: any, extraLevels: any = 1, costMult: any = 1): any {
        checkFormulasAccess("hacknetServers.ramUpgradeCost", 9);
        return HScalculateRamUpgradeCost(startingRam, extraLevels, costMult);
      },
      coreUpgradeCost: function (startingCore: any, extraCores: any = 1, costMult: any = 1): any {
        checkFormulasAccess("hacknetServers.coreUpgradeCost", 9);
        return HScalculateCoreUpgradeCost(startingCore, extraCores, costMult);
      },
      cacheUpgradeCost: function (startingCache: any, extraCache: any = 1): any {
        checkFormulasAccess("hacknetServers.cacheUpgradeCost", 9);
        return HScalculateCacheUpgradeCost(startingCache, extraCache);
      },
      hashUpgradeCost: function (upgName: any, level: any): any {
        checkFormulasAccess("hacknetServers.hashUpgradeCost", 9);
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
        checkFormulasAccess("hacknetServers.hacknetServerCost", 9);
        return HScalculateServerCost(n, mult);
      },
      constants: function (): any {
        checkFormulasAccess("hacknetServers.constants", 9);
        return Object.assign({}, HacknetServerConstants);
      },
    },
  };
}
