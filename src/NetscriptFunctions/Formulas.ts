import {IMap} from "../types";

import { Player as player } from "../Player";
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
import {
  Formulas as IFormulas,
  HacknetNodeConstants as DefHacknetNodeConstants,
  HacknetServerConstants as DefHacknetServerConstants,
} from "../ScriptEditor/NetscriptDefinitions";
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
import { helpers } from "../Netscript/NetscriptHelpers";
import { WorkStats } from "../Work/WorkStats";
import { calculateCrimeWorkStats } from "../Work/formulas/Crime";
import { Crimes } from "../Crime/Crimes";
import { calculateClassEarnings } from "../Work/formulas/Class";
import { ClassType } from "../Work/ClassWork";
import { LocationName } from "../Locations/data/LocationNames";
import { calculateFactionExp, calculateFactionRep } from "../Work/formulas/Faction";
import { FactionWorkType } from "../Work/data/FactionWorkType";

import { Player as INetscriptPlayer, Server as IServerDef } from "../ScriptEditor/NetscriptDefinitions";
import { defaultMultipliers } from "../PersonObjects/Multipliers";

import { ProductRatingWeights } from "../Corporation/ProductRatingWeights";
import { IndustryMaterialFactors } from "../Corporation/IndustryData";

export function NetscriptFormulas(): InternalAPI<IFormulas> {
  const checkFormulasAccess = function (ctx: NetscriptContext): void {
    if (!player.hasProgram(Programs.Formulas.name)) {
      throw helpers.makeRuntimeErrorMsg(ctx, `Requires Formulas.exe to run.`);
    }
  };
  return {
    mockServer: () => (): IServerDef => ({
      cpuCores: 0,
      ftpPortOpen: false,
      hasAdminRights: false,
      hostname: "",
      httpPortOpen: false,
      ip: "",
      isConnectedTo: false,
      maxRam: 0,
      organizationName: "",
      ramUsed: 0,
      smtpPortOpen: false,
      sqlPortOpen: false,
      sshPortOpen: false,
      purchasedByPlayer: false,
      backdoorInstalled: false,
      baseDifficulty: 0,
      hackDifficulty: 0,
      minDifficulty: 0,
      moneyAvailable: 0,
      moneyMax: 0,
      numOpenPortsRequired: 0,
      openPortCount: 0,
      requiredHackingSkill: 0,
      serverGrowth: 0,
    }),
    mockPlayer: () => (): INetscriptPlayer => ({
      hp: { current: 0, max: 0 },
      skills: {
        hacking: 0,
        strength: 0,
        defense: 0,
        dexterity: 0,
        agility: 0,
        charisma: 0,
        intelligence: 0,
      },
      exp: {
        hacking: 0,
        strength: 0,
        defense: 0,
        dexterity: 0,
        agility: 0,
        charisma: 0,
        intelligence: 0,
      },
      mults: defaultMultipliers(),
      numPeopleKilled: 0,
      money: 0,
      city: "",
      location: "",
      bitNodeN: 0,
      totalPlaytime: 0,
      playtimeSinceLastAug: 0,
      playtimeSinceLastBitnode: 0,
      jobs: {},
      factions: [],
      tor: false,
      hasCorporation: false,
      inBladeburner: false,
      entropy: 0,
    }),
    reputation: {
      calculateFavorToRep:
        (ctx: NetscriptContext) =>
        (_favor: unknown): number => {
          const favor = helpers.number(ctx, "favor", _favor);
          checkFormulasAccess(ctx);
          return calculateFavorToRep(favor);
        },
      calculateRepToFavor:
        (ctx: NetscriptContext) =>
        (_rep: unknown): number => {
          const rep = helpers.number(ctx, "rep", _rep);
          checkFormulasAccess(ctx);
          return calculateRepToFavor(rep);
        },
      repFromDonation:
        (ctx: NetscriptContext) =>
        (_amount: unknown, _player: unknown): number => {
          const amount = helpers.number(ctx, "amount", _amount);
          const player = helpers.player(ctx, _player);
          checkFormulasAccess(ctx);
          return repFromDonation(amount, player);
        },
    },
    skills: {
      calculateSkill:
        (ctx: NetscriptContext) =>
        (_exp: unknown, _mult: unknown = 1): number => {
          const exp = helpers.number(ctx, "exp", _exp);
          const mult = helpers.number(ctx, "mult", _mult);
          checkFormulasAccess(ctx);
          return calculateSkill(exp, mult);
        },
      calculateExp:
        (ctx: NetscriptContext) =>
        (_skill: unknown, _mult: unknown = 1): number => {
          const skill = helpers.number(ctx, "skill", _skill);
          const mult = helpers.number(ctx, "mult", _mult);
          checkFormulasAccess(ctx);
          return calculateExp(skill, mult);
        },
    },
    hacking: {
      hackChance:
        (ctx: NetscriptContext) =>
        (_server: unknown, _player: unknown): number => {
          const server = helpers.server(ctx, _server);
          const player = helpers.player(ctx, _player);
          checkFormulasAccess(ctx);
          return calculateHackingChance(server, player);
        },
      hackExp:
        (ctx: NetscriptContext) =>
        (_server: unknown, _player: unknown): number => {
          const server = helpers.server(ctx, _server);
          const player = helpers.player(ctx, _player);
          checkFormulasAccess(ctx);
          return calculateHackingExpGain(server, player);
        },
      hackPercent:
        (ctx: NetscriptContext) =>
        (_server: unknown, _player: unknown): number => {
          const server = helpers.server(ctx, _server);
          const player = helpers.player(ctx, _player);
          checkFormulasAccess(ctx);
          return calculatePercentMoneyHacked(server, player);
        },
      growPercent:
        (ctx: NetscriptContext) =>
        (_server: unknown, _threads: unknown, _player: unknown, _cores: unknown = 1): number => {
          const server = helpers.server(ctx, _server);
          const player = helpers.player(ctx, _player);
          const threads = helpers.number(ctx, "threads", _threads);
          const cores = helpers.number(ctx, "cores", _cores);
          checkFormulasAccess(ctx);
          return calculateServerGrowth(server, threads, player, cores);
        },
      hackTime:
        (ctx: NetscriptContext) =>
        (_server: unknown, _player: unknown): number => {
          const server = helpers.server(ctx, _server);
          const player = helpers.player(ctx, _player);
          checkFormulasAccess(ctx);
          return calculateHackingTime(server, player) * 1000;
        },
      growTime:
        (ctx: NetscriptContext) =>
        (_server: unknown, _player: unknown): number => {
          const server = helpers.server(ctx, _server);
          const player = helpers.player(ctx, _player);
          checkFormulasAccess(ctx);
          return calculateGrowTime(server, player) * 1000;
        },
      weakenTime:
        (ctx: NetscriptContext) =>
        (_server: unknown, _player: unknown): number => {
          const server = helpers.server(ctx, _server);
          const player = helpers.player(ctx, _player);
          checkFormulasAccess(ctx);
          return calculateWeakenTime(server, player) * 1000;
        },
    },
    hacknetNodes: {
      moneyGainRate:
        (ctx: NetscriptContext) =>
        (_level: unknown, _ram: unknown, _cores: unknown, _mult: unknown = 1): number => {
          const level = helpers.number(ctx, "level", _level);
          const ram = helpers.number(ctx, "ram", _ram);
          const cores = helpers.number(ctx, "cores", _cores);
          const mult = helpers.number(ctx, "mult", _mult);
          checkFormulasAccess(ctx);
          return calculateMoneyGainRate(level, ram, cores, mult);
        },
      levelUpgradeCost:
        (ctx: NetscriptContext) =>
        (_startingLevel: unknown, _extraLevels: unknown = 1, _costMult: unknown = 1): number => {
          const startingLevel = helpers.number(ctx, "startingLevel", _startingLevel);
          const extraLevels = helpers.number(ctx, "extraLevels", _extraLevels);
          const costMult = helpers.number(ctx, "costMult", _costMult);
          checkFormulasAccess(ctx);
          return calculateLevelUpgradeCost(startingLevel, extraLevels, costMult);
        },
      ramUpgradeCost:
        (ctx: NetscriptContext) =>
        (_startingRam: unknown, _extraLevels: unknown = 1, _costMult: unknown = 1): number => {
          const startingRam = helpers.number(ctx, "startingRam", _startingRam);
          const extraLevels = helpers.number(ctx, "extraLevels", _extraLevels);
          const costMult = helpers.number(ctx, "costMult", _costMult);
          checkFormulasAccess(ctx);
          return calculateRamUpgradeCost(startingRam, extraLevels, costMult);
        },
      coreUpgradeCost:
        (ctx: NetscriptContext) =>
        (_startingCore: unknown, _extraCores: unknown = 1, _costMult: unknown = 1): number => {
          const startingCore = helpers.number(ctx, "startingCore", _startingCore);
          const extraCores = helpers.number(ctx, "extraCores", _extraCores);
          const costMult = helpers.number(ctx, "costMult", _costMult);
          checkFormulasAccess(ctx);
          return calculateCoreUpgradeCost(startingCore, extraCores, costMult);
        },
      hacknetNodeCost:
        (ctx: NetscriptContext) =>
        (_n: unknown, _mult: unknown): number => {
          const n = helpers.number(ctx, "n", _n);
          const mult = helpers.number(ctx, "mult", _mult);
          checkFormulasAccess(ctx);
          return calculateNodeCost(n, mult);
        },
      constants: (ctx: NetscriptContext) => (): DefHacknetNodeConstants => {
        checkFormulasAccess(ctx);
        return Object.assign({}, HacknetNodeConstants);
      },
    },
    hacknetServers: {
      hashGainRate:
        (ctx: NetscriptContext) =>
        (_level: unknown, _ramUsed: unknown, _maxRam: unknown, _cores: unknown, _mult: unknown = 1): number => {
          const level = helpers.number(ctx, "level", _level);
          const ramUsed = helpers.number(ctx, "ramUsed", _ramUsed);
          const maxRam = helpers.number(ctx, "maxRam", _maxRam);
          const cores = helpers.number(ctx, "cores", _cores);
          const mult = helpers.number(ctx, "mult", _mult);
          checkFormulasAccess(ctx);
          return HScalculateHashGainRate(level, ramUsed, maxRam, cores, mult);
        },
      levelUpgradeCost:
        (ctx: NetscriptContext) =>
        (_startingLevel: unknown, _extraLevels: unknown = 1, _costMult: unknown = 1): number => {
          const startingLevel = helpers.number(ctx, "startingLevel", _startingLevel);
          const extraLevels = helpers.number(ctx, "extraLevels", _extraLevels);
          const costMult = helpers.number(ctx, "costMult", _costMult);
          checkFormulasAccess(ctx);
          return HScalculateLevelUpgradeCost(startingLevel, extraLevels, costMult);
        },
      ramUpgradeCost:
        (ctx: NetscriptContext) =>
        (_startingRam: unknown, _extraLevels: unknown = 1, _costMult: unknown = 1): number => {
          const startingRam = helpers.number(ctx, "startingRam", _startingRam);
          const extraLevels = helpers.number(ctx, "extraLevels", _extraLevels);
          const costMult = helpers.number(ctx, "costMult", _costMult);
          checkFormulasAccess(ctx);
          return HScalculateRamUpgradeCost(startingRam, extraLevels, costMult);
        },
      coreUpgradeCost:
        (ctx: NetscriptContext) =>
        (_startingCore: unknown, _extraCores: unknown = 1, _costMult: unknown = 1): number => {
          const startingCore = helpers.number(ctx, "startingCore", _startingCore);
          const extraCores = helpers.number(ctx, "extraCores", _extraCores);
          const costMult = helpers.number(ctx, "costMult", _costMult);
          checkFormulasAccess(ctx);
          return HScalculateCoreUpgradeCost(startingCore, extraCores, costMult);
        },
      cacheUpgradeCost:
        (ctx: NetscriptContext) =>
        (_startingCache: unknown, _extraCache: unknown = 1): number => {
          const startingCache = helpers.number(ctx, "startingCache", _startingCache);
          const extraCache = helpers.number(ctx, "extraCache", _extraCache);
          checkFormulasAccess(ctx);
          return HScalculateCacheUpgradeCost(startingCache, extraCache);
        },
      hashUpgradeCost:
        (ctx: NetscriptContext) =>
        (_upgName: unknown, _level: unknown): number => {
          const upgName = helpers.string(ctx, "upgName", _upgName);
          const level = helpers.number(ctx, "level", _level);
          checkFormulasAccess(ctx);
          const upg = player.hashManager.getUpgrade(upgName);
          if (!upg) {
            throw helpers.makeRuntimeErrorMsg(ctx, `Invalid Hash Upgrade: ${upgName}`);
          }
          return upg.getCost(level);
        },
      hacknetServerCost:
        (ctx: NetscriptContext) =>
        (_n: unknown, _mult: unknown = 1): number => {
          const n = helpers.number(ctx, "n", _n);
          const mult = helpers.number(ctx, "mult", _mult);
          checkFormulasAccess(ctx);
          return HScalculateServerCost(n, mult);
        },
      constants: (ctx: NetscriptContext) => (): DefHacknetServerConstants => {
        checkFormulasAccess(ctx);
        return Object.assign({}, HacknetServerConstants);
      },
    },
    gang: {
      wantedPenalty:
        (ctx: NetscriptContext) =>
        (_gang: unknown): number => {
          const gang = helpers.gang(ctx, _gang);
          checkFormulasAccess(ctx);
          return calculateWantedPenalty(gang);
        },
      respectGain:
        (ctx: NetscriptContext) =>
        (_gang: unknown, _member: unknown, _task: unknown): number => {
          const gang = helpers.gang(ctx, _gang);
          const member = helpers.gangMember(ctx, _member);
          const task = helpers.gangTask(ctx, _task);
          checkFormulasAccess(ctx);
          return calculateRespectGain(gang, member, task);
        },
      wantedLevelGain:
        (ctx: NetscriptContext) =>
        (_gang: unknown, _member: unknown, _task: unknown): number => {
          const gang = helpers.gang(ctx, _gang);
          const member = helpers.gangMember(ctx, _member);
          const task = helpers.gangTask(ctx, _task);
          checkFormulasAccess(ctx);
          return calculateWantedLevelGain(gang, member, task);
        },
      moneyGain:
        (ctx: NetscriptContext) =>
        (_gang: unknown, _member: unknown, _task: unknown): number => {
          const gang = helpers.gang(ctx, _gang);
          const member = helpers.gangMember(ctx, _member);
          const task = helpers.gangTask(ctx, _task);
          checkFormulasAccess(ctx);
          return calculateMoneyGain(gang, member, task);
        },
      ascensionPointsGain:
        (ctx: NetscriptContext) =>
        (_exp: unknown): number => {
          const exp = helpers.number(ctx, "exp", _exp);
          checkFormulasAccess(ctx);
          return calculateAscensionPointsGain(exp);
        },
      ascensionMultiplier:
        (ctx: NetscriptContext) =>
        (_points: unknown): number => {
          const points = helpers.number(ctx, "points", _points);
          checkFormulasAccess(ctx);
          return calculateAscensionMult(points);
        },
    },
    work: {
      crimeGains:
        (ctx: NetscriptContext) =>
        (_crimeType: unknown): WorkStats => {
          const crimeType = helpers.string(ctx, "crimeType", _crimeType);
          const crime = Object.values(Crimes).find((c) => String(c.type) === crimeType);
          if (!crime) throw new Error(`Invalid crime type: ${crimeType}`);
          return calculateCrimeWorkStats(crime);
        },
      classGains:
        (ctx: NetscriptContext) =>
        (_person: unknown, _classType: unknown, _locationName: unknown): WorkStats => {
          const person = helpers.player(ctx, _person);
          const classType = helpers.string(ctx, "classType", _classType);
          const locationName = helpers.string(ctx, "locationName", _locationName);
          return calculateClassEarnings(person, classType as ClassType, locationName as LocationName);
        },
      factionGains:
        (ctx: NetscriptContext) =>
        (_player: unknown, _workType: unknown, _favor: unknown): WorkStats => {
          const player = helpers.player(ctx, _player);
          const workType = helpers.string(ctx, "_workType", _workType) as FactionWorkType;
          const favor = helpers.number(ctx, "favor", _favor);
          const exp = calculateFactionExp(player, workType);
          const rep = calculateFactionRep(player, workType, favor);
          exp.reputation = rep;
          return exp;
        },
      // companyGains: (ctx: NetscriptContext) =>_player: unknown (): WorkStats {
      //     const player = helpers.player(ctx, _player);

      // },
    },
    corp: {
      getProductionMultipliers:
        (ctx: NetscriptContext) =>
        (_industryName: string): IMap<any> => {
          checkAccess(ctx, 7);
          const industryName = helpers.string(ctx, "industryName", _industryName);
          if(!IndustryMaterialFactors.hasOwnProperty(industryName)) {
            throw new Error(`Invalid industry: '${industryName}'`);
          }
          const weights = IndustryMaterialFactors[industryName];
          return {
            reFac: weights.reFac,
            sciFac: weights.sciFac,
            robFac: weights.robFac,
            aiFac: weights.aiFac,
            advFac: weights.advFac,
            reqMats: weights.reqMats,
            prodMats: weights.prodMats,
          };
        },
      getProductRatingWeights:
        (ctx: NetscriptContext) =>
        (_industryName: string): IMap<any> => {
          checkAccess(ctx, 7);
          const industryName = helpers.string(ctx, "industryName", _industryName);
          if(!ProductRatingWeights.hasOwnProperty(industryName)) {
            throw new Error(`Invalid industry: '${industryName}'`);
          }
          const weights = ProductRatingWeights[industryName];
          return {
            quality: weights.hasOwnProperty("Quality") ? weights.Quality : 0,
            performance: weights.hasOwnProperty("Performance") ? weights.Performance : 0,
            durability: weights.hasOwnProperty("Durability") ? weights.Durability : 0,
            reliability: weights.hasOwnProperty("Reliability") ? weights.Reliability : 0,
            aesthetics: weights.hasOwnProperty("Aesthetics") ? weights.Aesthetics : 0,
            features: weights.hasOwnProperty("Features") ? weights.Features : 0,
          };
        },
      calculateProductionMultiplier:
        (ctx: NetscriptContext) =>
        (_industryName: string, _realEstate: number, _hardware: number, _robots: number, _aiCores: number): number => {
          checkAccess(ctx, 7);
          const industryName = helpers.string(ctx, "industryName", _industryName);
          const realEstate = helpers.number(ctx, "realEstate", _realEstate);
          const hardware = helpers.number(ctx, "hardware", _hardware);
          const robots = helpers.number(ctx, "robots", _robots);
          const aiCores = helpers.number(ctx, "aiCores", _aiCores);
          if(!IndustryMaterialFactors.hasOwnProperty(industryName)) {
            throw new Error(`Invalid industry: '${industryName}'`);
          }
          const factors = IndustryMaterialFactors[industryName];
          const cityMult =
            Math.pow(0.002 * realEstate + 1, factors.reFac) *
            Math.pow(0.002 * hardware + 1, factors.hwFac) *
            Math.pow(0.002 * robots + 1, factors.robFac) *
            Math.pow(0.002 * aiCores + 1, factors.aiFac);

          return Math.max(Math.pow(cityMult, 0.73), 1);
        },
    }
  };

  function checkAccess(ctx: NetscriptContext, api?: number): void {
    checkFormulasAccess(ctx);
    if (player.corporation === null) throw helpers.makeRuntimeErrorMsg(ctx, "Must own a corporation.");
    if (!api) return;

    if (!player.corporation.unlockUpgrades[api])
      throw helpers.makeRuntimeErrorMsg(ctx, "You do not have access to this API.");
  }
}
