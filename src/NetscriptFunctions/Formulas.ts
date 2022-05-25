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
  calculateAscensionMult,
  calculateAscensionPointsGain,
} from "../Gang/formulas/formulas";
import { favorToRep as calculateFavorToRep, repToFavor as calculateRepToFavor } from "../Faction/formulas/favor";
import { repFromDonation } from "../Faction/formulas/donation";
import { InternalAPI, NetscriptContext } from "../Netscript/APIWrapper";

export function NetscriptFormulas(player: IPlayer, helper: INetscriptHelper): InternalAPI<IFormulas> {
  const checkFormulasAccess = function (ctx: NetscriptContext): void {
    if (!player.hasProgram(Programs.Formulas.name)) {
      throw helper.makeRuntimeErrorMsg(`formulas.${ctx.function}`, `Requires Formulas.exe to run.`);
    }
  };
  return {
    reputation: {
      calculateFavorToRep:
        (ctx: NetscriptContext) =>
        (_favor: unknown): number => {
          const favor = ctx.helper.number("favor", _favor);
          checkFormulasAccess(ctx);
          return calculateFavorToRep(favor);
        },
      calculateRepToFavor:
        (ctx: NetscriptContext) =>
        (_rep: unknown): number => {
          const rep = ctx.helper.number("rep", _rep);
          checkFormulasAccess(ctx);
          return calculateRepToFavor(rep);
        },
      repFromDonation:
        (ctx: NetscriptContext) =>
        (_amount: unknown, player: any): number => {
          const amount = ctx.helper.number("amount", _amount);
          checkFormulasAccess(ctx);
          return repFromDonation(amount, player);
        },
    },
    skills: {
      calculateSkill:
        (ctx: NetscriptContext) =>
        (_exp: unknown, _mult: unknown = 1): number => {
          const exp = ctx.helper.number("exp", _exp);
          const mult = ctx.helper.number("mult", _mult);
          checkFormulasAccess(ctx);
          return calculateSkill(exp, mult);
        },
      calculateExp:
        (ctx: NetscriptContext) =>
        (_skill: unknown, _mult: unknown = 1): number => {
          const skill = ctx.helper.number("skill", _skill);
          const mult = ctx.helper.number("mult", _mult);
          checkFormulasAccess(ctx);
          return calculateExp(skill, mult);
        },
    },
    hacking: {
      hackChance:
        (ctx: NetscriptContext) =>
        (server: any, player: any): number => {
          checkFormulasAccess(ctx);
          return calculateHackingChance(server, player);
        },
      hackExp:
        (ctx: NetscriptContext) =>
        (server: any, player: any): number => {
          checkFormulasAccess(ctx);
          return calculateHackingExpGain(server, player);
        },
      hackPercent:
        (ctx: NetscriptContext) =>
        (server: any, player: any): number => {
          checkFormulasAccess(ctx);
          return calculatePercentMoneyHacked(server, player);
        },
      growPercent:
        (ctx: NetscriptContext) =>
        (server: any, _threads: unknown, player: any, _cores: unknown = 1): number => {
          const threads = ctx.helper.number("threads", _threads);
          const cores = ctx.helper.number("cores", _cores);
          checkFormulasAccess(ctx);
          return calculateServerGrowth(server, threads, player, cores);
        },
      hackTime:
        (ctx: NetscriptContext) =>
        (server: any, player: any): number => {
          checkFormulasAccess(ctx);
          return calculateHackingTime(server, player) * 1000;
        },
      growTime:
        (ctx: NetscriptContext) =>
        (server: any, player: any): number => {
          checkFormulasAccess(ctx);
          return calculateGrowTime(server, player) * 1000;
        },
      weakenTime:
        (ctx: NetscriptContext) =>
        (server: any, player: any): number => {
          checkFormulasAccess(ctx);
          return calculateWeakenTime(server, player) * 1000;
        },
    },
    hacknetNodes: {
      moneyGainRate:
        (ctx: NetscriptContext) =>
        (_level: unknown, _ram: unknown, _cores: unknown, _mult: unknown = 1): number => {
          const level = ctx.helper.number("level", _level);
          const ram = ctx.helper.number("ram", _ram);
          const cores = ctx.helper.number("cores", _cores);
          const mult = ctx.helper.number("mult", _mult);
          checkFormulasAccess(ctx);
          return calculateMoneyGainRate(level, ram, cores, mult);
        },
      levelUpgradeCost:
        (ctx: NetscriptContext) =>
        (_startingLevel: unknown, _extraLevels: unknown = 1, _costMult: unknown = 1): number => {
          const startingLevel = ctx.helper.number("startingLevel", _startingLevel);
          const extraLevels = ctx.helper.number("extraLevels", _extraLevels);
          const costMult = ctx.helper.number("costMult", _costMult);
          checkFormulasAccess(ctx);
          return calculateLevelUpgradeCost(startingLevel, extraLevels, costMult);
        },
      ramUpgradeCost:
        (ctx: NetscriptContext) =>
        (_startingRam: unknown, _extraLevels: unknown = 1, _costMult: unknown = 1): number => {
          const startingRam = ctx.helper.number("startingRam", _startingRam);
          const extraLevels = ctx.helper.number("extraLevels", _extraLevels);
          const costMult = ctx.helper.number("costMult", _costMult);
          checkFormulasAccess(ctx);
          return calculateRamUpgradeCost(startingRam, extraLevels, costMult);
        },
      coreUpgradeCost:
        (ctx: NetscriptContext) =>
        (_startingCore: unknown, _extraCores: unknown = 1, _costMult: unknown = 1): number => {
          const startingCore = ctx.helper.number("startingCore", _startingCore);
          const extraCores = ctx.helper.number("extraCores", _extraCores);
          const costMult = ctx.helper.number("costMult", _costMult);
          checkFormulasAccess(ctx);
          return calculateCoreUpgradeCost(startingCore, extraCores, costMult);
        },
      hacknetNodeCost:
        (ctx: NetscriptContext) =>
        (_n: unknown, _mult: unknown): number => {
          const n = ctx.helper.number("n", _n);
          const mult = ctx.helper.number("mult", _mult);
          checkFormulasAccess(ctx);
          return calculateNodeCost(n, mult);
        },
      constants: (ctx: NetscriptContext) => (): any => {
        checkFormulasAccess(ctx);
        return Object.assign({}, HacknetNodeConstants);
      },
    },
    hacknetServers: {
      hashGainRate:
        (ctx: NetscriptContext) =>
        (_level: unknown, _ramUsed: unknown, _maxRam: unknown, _cores: unknown, _mult: unknown = 1): number => {
          const level = ctx.helper.number("level", _level);
          const ramUsed = ctx.helper.number("ramUsed", _ramUsed);
          const maxRam = ctx.helper.number("maxRam", _maxRam);
          const cores = ctx.helper.number("cores", _cores);
          const mult = ctx.helper.number("mult", _mult);
          checkFormulasAccess(ctx);
          return HScalculateHashGainRate(level, ramUsed, maxRam, cores, mult);
        },
      levelUpgradeCost:
        (ctx: NetscriptContext) =>
        (_startingLevel: unknown, _extraLevels: unknown = 1, _costMult: unknown = 1): number => {
          const startingLevel = ctx.helper.number("startingLevel", _startingLevel);
          const extraLevels = ctx.helper.number("extraLevels", _extraLevels);
          const costMult = ctx.helper.number("costMult", _costMult);
          checkFormulasAccess(ctx);
          return HScalculateLevelUpgradeCost(startingLevel, extraLevels, costMult);
        },
      ramUpgradeCost:
        (ctx: NetscriptContext) =>
        (_startingRam: unknown, _extraLevels: unknown = 1, _costMult: unknown = 1): number => {
          const startingRam = ctx.helper.number("startingRam", _startingRam);
          const extraLevels = ctx.helper.number("extraLevels", _extraLevels);
          const costMult = ctx.helper.number("costMult", _costMult);
          checkFormulasAccess(ctx);
          return HScalculateRamUpgradeCost(startingRam, extraLevels, costMult);
        },
      coreUpgradeCost:
        (ctx: NetscriptContext) =>
        (_startingCore: unknown, _extraCores: unknown = 1, _costMult: unknown = 1): number => {
          const startingCore = ctx.helper.number("startingCore", _startingCore);
          const extraCores = ctx.helper.number("extraCores", _extraCores);
          const costMult = ctx.helper.number("costMult", _costMult);
          checkFormulasAccess(ctx);
          return HScalculateCoreUpgradeCost(startingCore, extraCores, costMult);
        },
      cacheUpgradeCost:
        (ctx: NetscriptContext) =>
        (_startingCache: unknown, _extraCache: unknown = 1): number => {
          const startingCache = ctx.helper.number("startingCache", _startingCache);
          const extraCache = ctx.helper.number("extraCache", _extraCache);
          checkFormulasAccess(ctx);
          return HScalculateCacheUpgradeCost(startingCache, extraCache);
        },
      hashUpgradeCost:
        (ctx: NetscriptContext) =>
        (_upgName: unknown, _level: unknown): number => {
          const upgName = helper.string("hashUpgradeCost", "upgName", _upgName);
          const level = ctx.helper.number("level", _level);
          checkFormulasAccess(ctx);
          const upg = player.hashManager.getUpgrade(upgName);
          if (!upg) {
            throw helper.makeRuntimeErrorMsg(
              "formulas.hacknetServers.calculateHashUpgradeCost",
              `Invalid Hash Upgrade: ${upgName}`,
            );
          }
          return upg.getCost(level);
        },
      hacknetServerCost:
        (ctx: NetscriptContext) =>
        (_n: unknown, _mult: unknown = 1): number => {
          const n = ctx.helper.number("n", _n);
          const mult = ctx.helper.number("mult", _mult);
          checkFormulasAccess(ctx);
          return HScalculateServerCost(n, mult);
        },
      constants: (ctx: NetscriptContext) => (): any => {
        checkFormulasAccess(ctx);
        return Object.assign({}, HacknetServerConstants);
      },
    },
    gang: {
      wantedPenalty:
        (ctx: NetscriptContext) =>
        (gang: any): number => {
          checkFormulasAccess(ctx);
          return calculateWantedPenalty(gang);
        },
      respectGain:
        (ctx: NetscriptContext) =>
        (gang: any, member: any, task: any): number => {
          checkFormulasAccess(ctx);
          return calculateRespectGain(gang, member, task);
        },
      wantedLevelGain:
        (ctx: NetscriptContext) =>
        (gang: any, member: any, task: any): number => {
          checkFormulasAccess(ctx);
          return calculateWantedLevelGain(gang, member, task);
        },
      moneyGain:
        (ctx: NetscriptContext) =>
        (gang: any, member: any, task: any): number => {
          checkFormulasAccess(ctx);
          return calculateMoneyGain(gang, member, task);
        },
      ascensionPointsGain:
        (ctx: NetscriptContext) =>
        (_exp: unknown): number => {
          const exp = ctx.helper.number("exp", _exp);
          checkFormulasAccess(ctx);
          return calculateAscensionPointsGain(exp);
        },
      ascensionMultiplier:
        (ctx: NetscriptContext) =>
        (_points: unknown): number => {
          const points = ctx.helper.number("points", _points);
          checkFormulasAccess(ctx);
          return calculateAscensionMult(points);
        },
    },
  };
}
