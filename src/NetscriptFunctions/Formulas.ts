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
import { Formulas as IFormulas, Player as IPlayer, Person as IPerson } from "../ScriptEditor/NetscriptDefinitions";
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
import { calculateCrimeWorkStats } from "../Work/Formulas";
import { Crimes } from "../Crime/Crimes";
import { calculateCompanyWorkStats } from "../Work/Formulas";
import { Companies } from "../Company/Companies";
import { calculateClassEarnings } from "../Work/Formulas";
import { ClassType } from "../Work/ClassWork";
import { LocationName } from "../Locations/data/LocationNames";
import { calculateFactionExp, calculateFactionRep } from "../Work/Formulas";
import { FactionWorkType } from "../Work/data/FactionWorkType";

import { defaultMultipliers } from "../PersonObjects/Multipliers";
import { checkEnum } from "../utils/helpers/checkEnum";
import { CrimeType } from "../utils/WorkType";
import { CompanyPositions } from "../Company/CompanyPositions";

export function NetscriptFormulas(): InternalAPI<IFormulas> {
  const checkFormulasAccess = function (ctx: NetscriptContext): void {
    if (!player.hasProgram(Programs.Formulas.name)) {
      throw helpers.makeRuntimeErrorMsg(ctx, `Requires Formulas.exe to run.`);
    }
  };
  return {
    mockServer: () => () => ({
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
    mockPlayer: () => (): IPlayer => ({
      hp: { current: 0, max: 0 },
      skills: { hacking: 0, strength: 0, defense: 0, dexterity: 0, agility: 0, charisma: 0, intelligence: 0 },
      exp: { hacking: 0, strength: 0, defense: 0, dexterity: 0, agility: 0, charisma: 0, intelligence: 0 },
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
      entropy: 0,
    }),
    mockPerson: () => (): IPerson => ({
      hp: { current: 0, max: 0 },
      skills: { hacking: 0, strength: 0, defense: 0, dexterity: 0, agility: 0, charisma: 0, intelligence: 0 },
      exp: { hacking: 0, strength: 0, defense: 0, dexterity: 0, agility: 0, charisma: 0, intelligence: 0 },
      mults: defaultMultipliers(),
      city: "",
    }),
    reputation: {
      calculateFavorToRep: (ctx) => (_favor) => {
        const favor = helpers.number(ctx, "favor", _favor);
        checkFormulasAccess(ctx);
        return calculateFavorToRep(favor);
      },
      calculateRepToFavor: (ctx) => (_rep) => {
        const rep = helpers.number(ctx, "rep", _rep);
        checkFormulasAccess(ctx);
        return calculateRepToFavor(rep);
      },
      repFromDonation: (ctx) => (_amount, _player) => {
        const amount = helpers.number(ctx, "amount", _amount);
        const person = helpers.person(ctx, _player);
        checkFormulasAccess(ctx);
        return repFromDonation(amount, person);
      },
    },
    skills: {
      calculateSkill:
        (ctx) =>
        (_exp, _mult = 1) => {
          const exp = helpers.number(ctx, "exp", _exp);
          const mult = helpers.number(ctx, "mult", _mult);
          checkFormulasAccess(ctx);
          return calculateSkill(exp, mult);
        },
      calculateExp:
        (ctx) =>
        (_skill, _mult = 1) => {
          const skill = helpers.number(ctx, "skill", _skill);
          const mult = helpers.number(ctx, "mult", _mult);
          checkFormulasAccess(ctx);
          return calculateExp(skill, mult);
        },
    },
    hacking: {
      hackChance: (ctx) => (_server, _player) => {
        const server = helpers.server(ctx, _server);
        const person = helpers.person(ctx, _player);
        checkFormulasAccess(ctx);
        return calculateHackingChance(server, person);
      },
      hackExp: (ctx) => (_server, _player) => {
        const server = helpers.server(ctx, _server);
        const person = helpers.person(ctx, _player);
        checkFormulasAccess(ctx);
        return calculateHackingExpGain(server, person);
      },
      hackPercent: (ctx) => (_server, _player) => {
        const server = helpers.server(ctx, _server);
        const person = helpers.person(ctx, _player);
        checkFormulasAccess(ctx);
        return calculatePercentMoneyHacked(server, person);
      },
      growPercent:
        (ctx) =>
        (_server, _threads, _player, _cores = 1) => {
          const server = helpers.server(ctx, _server);
          const person = helpers.person(ctx, _player);
          const threads = helpers.number(ctx, "threads", _threads);
          const cores = helpers.number(ctx, "cores", _cores);
          checkFormulasAccess(ctx);
          return calculateServerGrowth(server, threads, person, cores);
        },
      hackTime: (ctx) => (_server, _player) => {
        const server = helpers.server(ctx, _server);
        const person = helpers.person(ctx, _player);
        checkFormulasAccess(ctx);
        return calculateHackingTime(server, person) * 1000;
      },
      growTime: (ctx) => (_server, _player) => {
        const server = helpers.server(ctx, _server);
        const person = helpers.person(ctx, _player);
        checkFormulasAccess(ctx);
        return calculateGrowTime(server, person) * 1000;
      },
      weakenTime: (ctx) => (_server, _player) => {
        const server = helpers.server(ctx, _server);
        const person = helpers.person(ctx, _player);
        checkFormulasAccess(ctx);
        return calculateWeakenTime(server, person) * 1000;
      },
    },
    hacknetNodes: {
      moneyGainRate:
        (ctx) =>
        (_level, _ram, _cores, _mult = 1) => {
          const level = helpers.number(ctx, "level", _level);
          const ram = helpers.number(ctx, "ram", _ram);
          const cores = helpers.number(ctx, "cores", _cores);
          const mult = helpers.number(ctx, "mult", _mult);
          checkFormulasAccess(ctx);
          return calculateMoneyGainRate(level, ram, cores, mult);
        },
      levelUpgradeCost:
        (ctx) =>
        (_startingLevel, _extraLevels = 1, _costMult = 1) => {
          const startingLevel = helpers.number(ctx, "startingLevel", _startingLevel);
          const extraLevels = helpers.number(ctx, "extraLevels", _extraLevels);
          const costMult = helpers.number(ctx, "costMult", _costMult);
          checkFormulasAccess(ctx);
          return calculateLevelUpgradeCost(startingLevel, extraLevels, costMult);
        },
      ramUpgradeCost:
        (ctx) =>
        (_startingRam, _extraLevels = 1, _costMult = 1) => {
          const startingRam = helpers.number(ctx, "startingRam", _startingRam);
          const extraLevels = helpers.number(ctx, "extraLevels", _extraLevels);
          const costMult = helpers.number(ctx, "costMult", _costMult);
          checkFormulasAccess(ctx);
          return calculateRamUpgradeCost(startingRam, extraLevels, costMult);
        },
      coreUpgradeCost:
        (ctx) =>
        (_startingCore, _extraCores = 1, _costMult = 1) => {
          const startingCore = helpers.number(ctx, "startingCore", _startingCore);
          const extraCores = helpers.number(ctx, "extraCores", _extraCores);
          const costMult = helpers.number(ctx, "costMult", _costMult);
          checkFormulasAccess(ctx);
          return calculateCoreUpgradeCost(startingCore, extraCores, costMult);
        },
      hacknetNodeCost: (ctx) => (_n, _mult) => {
        const n = helpers.number(ctx, "n", _n);
        const mult = helpers.number(ctx, "mult", _mult);
        checkFormulasAccess(ctx);
        return calculateNodeCost(n, mult);
      },
      constants: (ctx) => () => {
        checkFormulasAccess(ctx);
        return Object.assign({}, HacknetNodeConstants);
      },
    },
    hacknetServers: {
      hashGainRate:
        (ctx) =>
        (_level, _ramUsed, _maxRam, _cores, _mult = 1) => {
          const level = helpers.number(ctx, "level", _level);
          const ramUsed = helpers.number(ctx, "ramUsed", _ramUsed);
          const maxRam = helpers.number(ctx, "maxRam", _maxRam);
          const cores = helpers.number(ctx, "cores", _cores);
          const mult = helpers.number(ctx, "mult", _mult);
          checkFormulasAccess(ctx);
          return HScalculateHashGainRate(level, ramUsed, maxRam, cores, mult);
        },
      levelUpgradeCost:
        (ctx) =>
        (_startingLevel, _extraLevels = 1, _costMult = 1) => {
          const startingLevel = helpers.number(ctx, "startingLevel", _startingLevel);
          const extraLevels = helpers.number(ctx, "extraLevels", _extraLevels);
          const costMult = helpers.number(ctx, "costMult", _costMult);
          checkFormulasAccess(ctx);
          return HScalculateLevelUpgradeCost(startingLevel, extraLevels, costMult);
        },
      ramUpgradeCost:
        (ctx) =>
        (_startingRam, _extraLevels = 1, _costMult = 1) => {
          const startingRam = helpers.number(ctx, "startingRam", _startingRam);
          const extraLevels = helpers.number(ctx, "extraLevels", _extraLevels);
          const costMult = helpers.number(ctx, "costMult", _costMult);
          checkFormulasAccess(ctx);
          return HScalculateRamUpgradeCost(startingRam, extraLevels, costMult);
        },
      coreUpgradeCost:
        (ctx) =>
        (_startingCore, _extraCores = 1, _costMult = 1) => {
          const startingCore = helpers.number(ctx, "startingCore", _startingCore);
          const extraCores = helpers.number(ctx, "extraCores", _extraCores);
          const costMult = helpers.number(ctx, "costMult", _costMult);
          checkFormulasAccess(ctx);
          return HScalculateCoreUpgradeCost(startingCore, extraCores, costMult);
        },
      cacheUpgradeCost:
        (ctx) =>
        (_startingCache, _extraCache = 1) => {
          const startingCache = helpers.number(ctx, "startingCache", _startingCache);
          const extraCache = helpers.number(ctx, "extraCache", _extraCache);
          checkFormulasAccess(ctx);
          return HScalculateCacheUpgradeCost(startingCache, extraCache);
        },
      hashUpgradeCost: (ctx) => (_upgName, _level) => {
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
        (ctx) =>
        (_n, _mult = 1) => {
          const n = helpers.number(ctx, "n", _n);
          const mult = helpers.number(ctx, "mult", _mult);
          checkFormulasAccess(ctx);
          return HScalculateServerCost(n, mult);
        },
      constants: (ctx) => () => {
        checkFormulasAccess(ctx);
        return Object.assign({}, HacknetServerConstants);
      },
    },
    gang: {
      wantedPenalty: (ctx) => (_gang) => {
        const gang = helpers.gang(ctx, _gang);
        checkFormulasAccess(ctx);
        return calculateWantedPenalty(gang);
      },
      respectGain: (ctx) => (_gang, _member, _task) => {
        const gang = helpers.gang(ctx, _gang);
        const member = helpers.gangMember(ctx, _member);
        const task = helpers.gangTask(ctx, _task);
        checkFormulasAccess(ctx);
        return calculateRespectGain(gang, member, task);
      },
      wantedLevelGain: (ctx) => (_gang, _member, _task) => {
        const gang = helpers.gang(ctx, _gang);
        const member = helpers.gangMember(ctx, _member);
        const task = helpers.gangTask(ctx, _task);
        checkFormulasAccess(ctx);
        return calculateWantedLevelGain(gang, member, task);
      },
      moneyGain: (ctx) => (_gang, _member, _task) => {
        const gang = helpers.gang(ctx, _gang);
        const member = helpers.gangMember(ctx, _member);
        const task = helpers.gangTask(ctx, _task);
        checkFormulasAccess(ctx);
        return calculateMoneyGain(gang, member, task);
      },
      ascensionPointsGain: (ctx) => (_exp) => {
        const exp = helpers.number(ctx, "exp", _exp);
        checkFormulasAccess(ctx);
        return calculateAscensionPointsGain(exp);
      },
      ascensionMultiplier: (ctx) => (_points) => {
        const points = helpers.number(ctx, "points", _points);
        checkFormulasAccess(ctx);
        return calculateAscensionMult(points);
      },
    },
    work: {
      crimeSuccessChance: (ctx) => (_person, _crimeType) => {
        const person = helpers.person(ctx, _person);
        const crimeType = helpers.string(ctx, "crimeType", _crimeType);
        if (!checkEnum(CrimeType, crimeType)) throw new Error(`Invalid crime type: ${crimeType}`);
        return Crimes[crimeType].successRate(person);
      },
      crimeGains: (ctx) => (_person, _crimeType) => {
        const person = helpers.person(ctx, _person);
        const crimeType = helpers.string(ctx, "crimeType", _crimeType);
        if (!checkEnum(CrimeType, crimeType)) throw new Error(`Invalid crime type: ${crimeType}`);
        return calculateCrimeWorkStats(person, Crimes[crimeType]);
      },
      classGains: (ctx) => (_person, _classType, _locationName) => {
        const person = helpers.person(ctx, _person);
        const classType = helpers.string(ctx, "classType", _classType);
        const locationName = helpers.string(ctx, "locationName", _locationName);
        return calculateClassEarnings(person, classType as ClassType, locationName as LocationName);
      },
      factionGains: (ctx) => (_player, _workType, _favor) => {
        const player = helpers.person(ctx, _player);
        const workType = helpers.string(ctx, "_workType", _workType) as FactionWorkType;
        const favor = helpers.number(ctx, "favor", _favor);
        const exp = calculateFactionExp(player, workType);
        const rep = calculateFactionRep(player, workType, favor);
        exp.reputation = rep;
        return exp;
      },
      companyGains: (ctx) => (_player, _companyName, _positionName, _favor) => {
        const player = helpers.person(ctx, _player);
        CompanyPositions;
        const positionName = helpers.string(ctx, "_positionName", _positionName);
        const position = Object.values(CompanyPositions).find((c) => c.name === positionName);
        if (!position) throw new Error(`Invalid position name: ${positionName}`);

        const companyName = helpers.string(ctx, "_companyName", _companyName);
        const company = Object.values(Companies).find((c) => c.name === companyName);
        if (!company) throw new Error(`Invalid company name: ${companyName}`);

        const favor = helpers.number(ctx, "favor", _favor);

        return calculateCompanyWorkStats(player, company, position, favor);
      },
    },
  };
}
