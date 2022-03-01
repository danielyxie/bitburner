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
  calculateHackLevelForTime,
  calculateGrowTime,
  calculateGrowLevelForTime,
  calculateWeakenTime,
  calculateWeakenLevelForTime
} from "../Hacking";
import { numCycleForGrowth } from "../Server/ServerHelpers";
import { Programs } from "../Programs/Programs";
import { Formulas as IFormulas } from "../ScriptEditor/NetscriptDefinitions";
import {
  calculateRespectGain,
  calculateWantedLevelGain,
  calculateMoneyGain,
  calculateWantedPenalty,
  calculateAscensionMult,
  calculateAscensionPointsGain,
} from "../Gang/formulas/formulas";

export function NetscriptFormulas(player: IPlayer, workerScript: WorkerScript, helper: INetscriptHelper): IFormulas {
  const checkFormulasAccess = function (func: string): void {
    if (!player.hasProgram(Programs.Formulas.name)) {
      throw helper.makeRuntimeErrorMsg(`formulas.${func}`, `Requires Formulas.exe to run.`);
    }
  };
  return {
    skills: {
      calculateSkill: function (_exp: unknown, _mult: unknown = 1): number {
        const exp = helper.number("calculateSkill", "exp", _exp);
        const mult = helper.number("calculateSkill", "mult", _mult);
        checkFormulasAccess("skills.calculateSkill");
        return calculateSkill(exp, mult);
      },
      calculateExp: function (_skill: unknown, _mult: unknown = 1): number {
        const skill = helper.number("calculateExp", "skill", _skill);
        const mult = helper.number("calculateExp", "mult", _mult);
        checkFormulasAccess("skills.calculateExp");
        return calculateExp(skill, mult);
      },
    },
    hacking: {
      hackChance: function (server: any, player: any): number {
        checkFormulasAccess("hacking.hackChance");
        return calculateHackingChance(server, player);
      },
      hackExp: function (server: any, player: any): number {
        checkFormulasAccess("hacking.hackExp");
        return calculateHackingExpGain(server, player);
      },
      hackPercent: function (server: any, player: any, hackOverride?: number): number {
        checkFormulasAccess("hacking.hackPercent");
        return calculatePercentMoneyHacked(server, player, hackOverride);
      },
      growPercent: function (server: any, _threads: unknown, player: any, _cores: unknown = 1): number {
        const threads = helper.number("growPercent", "threads", _threads);
        const cores = helper.number("growPercent", "cores", _cores);
        checkFormulasAccess("hacking.growPercent");
        return calculateServerGrowth(server, threads, player, cores);
      },
      hackTime: function (server: any, player: any, hackOverride?: number): number {
        checkFormulasAccess("hacking.hackTime");
        return calculateHackingTime(server, player, hackOverride) * 1000;
      },
      hackLevelForTime: function (server: any, player: any, ms: number): number {
        checkFormulasAccess("hacking.hackLevelForTime");
        return calculateHackLevelForTime(server, player, ms);
      },
      growTime: function (server: any, player: any, hackOverride?: number): number {
        checkFormulasAccess("hacking.growTime");
        return calculateGrowTime(server, player, hackOverride) * 1000;
      },
			growLevelForTime: function (server: any, player: any, ms: number): number {
        checkFormulasAccess("hacking.growLevelForTime");
        return calculateGrowLevelForTime(server, player, ms);
      },
      weakenTime: function (server: any, player: any, hackOverride?: number): number {
        checkFormulasAccess("hacking.weakenTime");
        return calculateWeakenTime(server, player, hackOverride) * 1000;
      },
			weakenLevelForTime: function (server: any, player: any, ms: number): number {
        checkFormulasAccess("hacking.weakenLevelForTime");
        return calculateWeakenLevelForTime(server, player, ms);
      },
      numCycleForGrowth(server: any, growth: number, player: any, cores = 1): number {
        checkFormulasAccess("hacking.numCycleForGrowth");
        return numCycleForGrowth(server, growth, player, cores);
      },
    },
    hacknetNodes: {
      moneyGainRate: function (_level: unknown, _ram: unknown, _cores: unknown, _mult: unknown = 1): number {
        const level = helper.number("moneyGainRate", "level", _level);
        const ram = helper.number("moneyGainRate", "ram", _ram);
        const cores = helper.number("moneyGainRate", "cores", _cores);
        const mult = helper.number("moneyGainRate", "mult", _mult);
        checkFormulasAccess("hacknetNodes.moneyGainRate");
        return calculateMoneyGainRate(level, ram, cores, mult);
      },
      levelUpgradeCost: function (_startingLevel: unknown, _extraLevels: unknown = 1, _costMult: unknown = 1): number {
        const startingLevel = helper.number("levelUpgradeCost", "startingLevel", _startingLevel);
        const extraLevels = helper.number("levelUpgradeCost", "extraLevels", _extraLevels);
        const costMult = helper.number("levelUpgradeCost", "costMult", _costMult);
        checkFormulasAccess("hacknetNodes.levelUpgradeCost");
        return calculateLevelUpgradeCost(startingLevel, extraLevels, costMult);
      },
      ramUpgradeCost: function (_startingRam: unknown, _extraLevels: unknown = 1, _costMult: unknown = 1): number {
        const startingRam = helper.number("ramUpgradeCost", "startingRam", _startingRam);
        const extraLevels = helper.number("ramUpgradeCost", "extraLevels", _extraLevels);
        const costMult = helper.number("ramUpgradeCost", "costMult", _costMult);
        checkFormulasAccess("hacknetNodes.ramUpgradeCost");
        return calculateRamUpgradeCost(startingRam, extraLevels, costMult);
      },
      coreUpgradeCost: function (_startingCore: unknown, _extraCores: unknown = 1, _costMult: unknown = 1): number {
        const startingCore = helper.number("coreUpgradeCost", "startingCore", _startingCore);
        const extraCores = helper.number("coreUpgradeCost", "extraCores", _extraCores);
        const costMult = helper.number("coreUpgradeCost", "costMult", _costMult);
        checkFormulasAccess("hacknetNodes.coreUpgradeCost");
        return calculateCoreUpgradeCost(startingCore, extraCores, costMult);
      },
      hacknetNodeCost: function (_n: unknown, _mult: unknown): number {
        const n = helper.number("hacknetNodeCost", "n", _n);
        const mult = helper.number("hacknetNodeCost", "mult", _mult);
        checkFormulasAccess("hacknetNodes.hacknetNodeCost");
        return calculateNodeCost(n, mult);
      },
      constants: function (): any {
        checkFormulasAccess("hacknetNodes.constants");
        return Object.assign({}, HacknetNodeConstants);
      },
    },
    hacknetServers: {
      hashGainRate: function (
        _level: unknown,
        _ramUsed: unknown,
        _maxRam: unknown,
        _cores: unknown,
        _mult: unknown = 1,
      ): number {
        const level = helper.number("hashGainRate", "level", _level);
        const ramUsed = helper.number("hashGainRate", "ramUsed", _ramUsed);
        const maxRam = helper.number("hashGainRate", "maxRam", _maxRam);
        const cores = helper.number("hashGainRate", "cores", _cores);
        const mult = helper.number("hashGainRate", "mult", _mult);
        checkFormulasAccess("hacknetServers.hashGainRate");
        return HScalculateHashGainRate(level, ramUsed, maxRam, cores, mult);
      },
      levelUpgradeCost: function (_startingLevel: unknown, _extraLevels: unknown = 1, _costMult: unknown = 1): number {
        const startingLevel = helper.number("levelUpgradeCost", "startingLevel", _startingLevel);
        const extraLevels = helper.number("levelUpgradeCost", "extraLevels", _extraLevels);
        const costMult = helper.number("levelUpgradeCost", "costMult", _costMult);
        checkFormulasAccess("hacknetServers.levelUpgradeCost");
        return HScalculateLevelUpgradeCost(startingLevel, extraLevels, costMult);
      },
      ramUpgradeCost: function (_startingRam: unknown, _extraLevels: unknown = 1, _costMult: unknown = 1): number {
        const startingRam = helper.number("ramUpgradeCost", "startingRam", _startingRam);
        const extraLevels = helper.number("ramUpgradeCost", "extraLevels", _extraLevels);
        const costMult = helper.number("ramUpgradeCost", "costMult", _costMult);
        checkFormulasAccess("hacknetServers.ramUpgradeCost");
        return HScalculateRamUpgradeCost(startingRam, extraLevels, costMult);
      },
      coreUpgradeCost: function (_startingCore: unknown, _extraCores: unknown = 1, _costMult: unknown = 1): number {
        const startingCore = helper.number("coreUpgradeCost", "startingCore", _startingCore);
        const extraCores = helper.number("coreUpgradeCost", "extraCores", _extraCores);
        const costMult = helper.number("coreUpgradeCost", "costMult", _costMult);
        checkFormulasAccess("hacknetServers.coreUpgradeCost");
        return HScalculateCoreUpgradeCost(startingCore, extraCores, costMult);
      },
      cacheUpgradeCost: function (_startingCache: unknown, _extraCache: unknown = 1): number {
        const startingCache = helper.number("cacheUpgradeCost", "startingCache", _startingCache);
        const extraCache = helper.number("cacheUpgradeCost", "extraCache", _extraCache);
        checkFormulasAccess("hacknetServers.cacheUpgradeCost");
        return HScalculateCacheUpgradeCost(startingCache, extraCache);
      },
      hashUpgradeCost: function (_upgName: unknown, _level: unknown): number {
        const upgName = helper.string("hashUpgradeCost", "upgName", _upgName);
        const level = helper.number("hashUpgradeCost", "level", _level);
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
      hacknetServerCost: function (_n: unknown, _mult: unknown = 1): number {
        const n = helper.number("hacknetServerCost", "n", _n);
        const mult = helper.number("hacknetServerCost", "mult", _mult);
        checkFormulasAccess("hacknetServers.hacknetServerCost");
        return HScalculateServerCost(n, mult);
      },
      constants: function (): any {
        checkFormulasAccess("hacknetServers.constants");
        return Object.assign({}, HacknetServerConstants);
      },
    },
    gang: {
      wantedPenalty(gang: any): number {
        checkFormulasAccess("gang.wantedPenalty");
        return calculateWantedPenalty(gang);
      },
      respectGain: function (gang: any, member: any, task: any): number {
        checkFormulasAccess("gang.respectGain");
        return calculateRespectGain(gang, member, task);
      },
      wantedLevelGain: function (gang: any, member: any, task: any): number {
        checkFormulasAccess("gang.wantedLevelGain");
        return calculateWantedLevelGain(gang, member, task);
      },
      moneyGain: function (gang: any, member: any, task: any): number {
        checkFormulasAccess("gang.moneyGain");
        return calculateMoneyGain(gang, member, task);
      },
      ascensionPointsGain: function (_exp: unknown): number {
        const exp = helper.number("ascensionPointsGain", "exp", _exp);
        checkFormulasAccess("gang.ascensionPointsGain");
        return calculateAscensionPointsGain(exp);
      },
      ascensionMultiplier: function (_points: unknown): number {
        const points = helper.number("ascensionMultiplier", "points", _points);
        checkFormulasAccess("gang.ascensionMultiplier");
        return calculateAscensionMult(points);
      },
    },
  };
}
