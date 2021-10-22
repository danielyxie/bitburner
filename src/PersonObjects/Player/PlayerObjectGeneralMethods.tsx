import { IPlayer } from "../IPlayer";
import { Augmentations } from "../../Augmentation/Augmentations";
import { applyAugmentation } from "../../Augmentation/AugmentationHelpers";
import { PlayerOwnedAugmentation } from "../../Augmentation/PlayerOwnedAugmentation";
import { AugmentationNames } from "../../Augmentation/data/AugmentationNames";
import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";
import { CodingContractRewardType, ICodingContractReward } from "../../CodingContracts";
import { Company } from "../../Company/Company";
import { Companies } from "../../Company/Companies";
import { getNextCompanyPositionHelper } from "../../Company/GetNextCompanyPosition";
import { getJobRequirementText } from "../../Company/GetJobRequirementText";
import { CompanyPositions } from "../../Company/CompanyPositions";
import { CompanyPosition } from "../../Company/CompanyPosition";
import * as posNames from "../../Company/data/companypositionnames";
import { CONSTANTS } from "../../Constants";
import { Programs } from "../../Programs/Programs";
import { determineCrimeSuccess } from "../../Crime/CrimeHelpers";
import { Crimes } from "../../Crime/Crimes";
import { Exploit } from "../../Exploits/Exploit";
import { Faction } from "../../Faction/Faction";
import { Factions } from "../../Faction/Factions";
import { resetGangs } from "../../Gang/AllGangs";
import { Cities } from "../../Locations/Cities";
import { Locations } from "../../Locations/Locations";
import { CityName } from "../../Locations/data/CityNames";
import { LocationName } from "../../Locations/data/LocationNames";
import { Sleeve } from "../../PersonObjects/Sleeve/Sleeve";
import { calculateSkill as calculateSkillF } from "../formulas/skill";
import { calculateIntelligenceBonus } from "../formulas/intelligence";
import {
  getHackingWorkRepGain,
  getFactionSecurityWorkRepGain,
  getFactionFieldWorkRepGain,
} from "../formulas/reputation";
import { GetServer, AddToAllServers, createUniqueRandomIp } from "../../Server/AllServers";
import { Server } from "../../Server/Server";
import { safetlyCreateUniqueServer } from "../../Server/ServerHelpers";
import { Settings } from "../../Settings/Settings";
import { SpecialServers } from "../../Server/data/SpecialServers";
import { applySourceFile } from "../../SourceFile/applySourceFile";
import { applyExploit } from "../../Exploits/applyExploits";
import { SourceFiles } from "../../SourceFile/SourceFiles";
import { SourceFileFlags } from "../../SourceFile/SourceFileFlags";
import { influenceStockThroughCompanyWork } from "../../StockMarket/PlayerInfluencing";
import { getHospitalizationCost } from "../../Hospital/Hospital";
import { WorkerScript } from "../../Netscript/WorkerScript";
import { HacknetServer } from "../../Hacknet/HacknetServer";

import Decimal from "decimal.js";

import { numeralWrapper } from "../../ui/numeralFormat";
import { IRouter } from "../../ui/Router";
import { MoneySourceTracker } from "../../utils/MoneySourceTracker";
import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { convertTimeMsToTimeElapsedString } from "../../utils/StringHelperFunctions";

import { Reputation } from "../../ui/React/Reputation";
import { Money } from "../../ui/React/Money";

import React from "react";
import { serverMetadata } from "../../Server/data/servers";
import { SnackbarEvents } from "../../ui/React/Snackbar"; 

export function init(this: IPlayer): void {
  /* Initialize Player's home computer */
  const t_homeComp = safetlyCreateUniqueServer({
    adminRights: true,
    hostname: "home",
    ip: createUniqueRandomIp(),
    isConnectedTo: true,
    maxRam: 8,
    organizationName: "Home PC",
    purchasedByPlayer: true,
  });
  this.currentServer = SpecialServers.Home;
  AddToAllServers(t_homeComp);

  this.getHomeComputer().programs.push(Programs.NukeProgram.name);
}

export function prestigeAugmentation(this: IPlayer): void {
  this.currentServer = SpecialServers.Home;

  this.numPeopleKilled = 0;
  this.karma = 0;

  //Reset stats
  this.hacking_skill = 1;

  this.strength = 1;
  this.defense = 1;
  this.dexterity = 1;
  this.agility = 1;

  this.charisma = 1;

  this.hacking_exp = 0;
  this.strength_exp = 0;
  this.defense_exp = 0;
  this.dexterity_exp = 0;
  this.agility_exp = 0;
  this.charisma_exp = 0;

  this.money = new Decimal(1000);

  this.city = CityName.Sector12;
  this.location = LocationName.TravelAgency;

  this.companyName = "";
  this.jobs = {};

  this.purchasedServers = [];

  this.factions = [];
  this.factionInvitations = [];

  this.queuedAugmentations = [];

  this.resleeves = [];

  const numSleeves = Math.min(3, SourceFileFlags[10] + (this.bitNodeN === 10 ? 1 : 0)) + this.sleevesFromCovenant;
  if (this.sleeves.length > numSleeves) this.sleeves.length = numSleeves;
  for (let i = this.sleeves.length; i < numSleeves; i++) {
    this.sleeves.push(new Sleeve(this));
  }

  for (let i = 0; i < this.sleeves.length; ++i) {
    if (this.sleeves[i] instanceof Sleeve) {
      if (this.sleeves[i].shock >= 100) {
        this.sleeves[i].synchronize(this);
      } else {
        this.sleeves[i].shockRecovery(this);
      }
    }
  }

  this.isWorking = false;
  this.currentWorkFactionName = "";
  this.currentWorkFactionDescription = "";
  this.createProgramName = "";
  this.className = "";
  this.crimeType = "";

  this.workHackExpGainRate = 0;
  this.workStrExpGainRate = 0;
  this.workDefExpGainRate = 0;
  this.workDexExpGainRate = 0;
  this.workAgiExpGainRate = 0;
  this.workChaExpGainRate = 0;
  this.workRepGainRate = 0;
  this.workMoneyGainRate = 0;

  this.workHackExpGained = 0;
  this.workStrExpGained = 0;
  this.workDefExpGained = 0;
  this.workDexExpGained = 0;
  this.workAgiExpGained = 0;
  this.workChaExpGained = 0;
  this.workRepGained = 0;
  this.workMoneyGained = 0;

  this.timeWorked = 0;

  this.lastUpdate = new Date().getTime();

  // Statistics Trackers
  this.playtimeSinceLastAug = 0;
  this.scriptProdSinceLastAug = 0;
  this.moneySourceA.reset();

  this.hacknetNodes.length = 0;
  this.hashManager.prestige();

  // Reapply augs, re-calculate skills and reset HP
  this.reapplyAllAugmentations(true);
  this.hp = this.max_hp;
}

export function prestigeSourceFile(this: IPlayer): void {
  this.prestigeAugmentation();
  // Duplicate sleeves are reset to level 1 every Bit Node (but the number of sleeves you have persists)
  for (let i = 0; i < this.sleeves.length; ++i) {
    if (this.sleeves[i] instanceof Sleeve) {
      this.sleeves[i].prestige(this);
    } else {
      this.sleeves[i] = new Sleeve(this);
    }
  }

  if (this.bitNodeN === 10) {
    for (let i = 0; i < this.sleeves.length; i++) {
      this.sleeves[i].shock = Math.max(25, this.sleeves[i].shock);
      this.sleeves[i].sync = Math.max(25, this.sleeves[i].sync);
    }
  }

  this.timeWorked = 0;

  // Gang
  this.gang = null;
  resetGangs();

  // Reset Stock market
  this.hasWseAccount = false;
  this.hasTixApiAccess = false;
  this.has4SData = false;
  this.has4SDataTixApi = false;

  // BitNode 3: Corporatocracy
  this.corporation = null;

  this.moneySourceB.reset();
  this.playtimeSinceLastBitnode = 0;
  this.augmentations = [];
}

export function receiveInvite(this: IPlayer, factionName: string): void {
  if (this.factionInvitations.includes(factionName) || this.factions.includes(factionName)) {
    return;
  }
  this.factionInvitations.push(factionName);
}

//Calculates skill level based on experience. The same formula will be used for every skill
export function calculateSkill(this: IPlayer, exp: number, mult = 1): number {
  return calculateSkillF(exp, mult);
}

export function updateSkillLevels(this: IPlayer): void {
  this.hacking_skill = Math.max(
    1,
    Math.floor(this.calculateSkill(this.hacking_exp, this.hacking_mult * BitNodeMultipliers.HackingLevelMultiplier)),
  );
  this.strength = Math.max(
    1,
    Math.floor(this.calculateSkill(this.strength_exp, this.strength_mult * BitNodeMultipliers.StrengthLevelMultiplier)),
  );
  this.defense = Math.max(
    1,
    Math.floor(this.calculateSkill(this.defense_exp, this.defense_mult * BitNodeMultipliers.DefenseLevelMultiplier)),
  );
  this.dexterity = Math.max(
    1,
    Math.floor(
      this.calculateSkill(this.dexterity_exp, this.dexterity_mult * BitNodeMultipliers.DexterityLevelMultiplier),
    ),
  );
  this.agility = Math.max(
    1,
    Math.floor(this.calculateSkill(this.agility_exp, this.agility_mult * BitNodeMultipliers.AgilityLevelMultiplier)),
  );
  this.charisma = Math.max(
    1,
    Math.floor(this.calculateSkill(this.charisma_exp, this.charisma_mult * BitNodeMultipliers.CharismaLevelMultiplier)),
  );

  if (this.intelligence > 0) {
    this.intelligence = Math.floor(this.calculateSkill(this.intelligence_exp));
  } else {
    this.intelligence = 0;
  }

  const ratio = this.hp / this.max_hp;
  this.max_hp = Math.floor(10 + this.defense / 10);
  this.hp = Math.round(this.max_hp * ratio);
}

export function resetMultipliers(this: IPlayer): void {
  this.hacking_chance_mult = 1;
  this.hacking_speed_mult = 1;
  this.hacking_money_mult = 1;
  this.hacking_grow_mult = 1;

  this.hacking_mult = 1;
  this.strength_mult = 1;
  this.defense_mult = 1;
  this.dexterity_mult = 1;
  this.agility_mult = 1;
  this.charisma_mult = 1;

  this.hacking_exp_mult = 1;
  this.strength_exp_mult = 1;
  this.defense_exp_mult = 1;
  this.dexterity_exp_mult = 1;
  this.agility_exp_mult = 1;
  this.charisma_exp_mult = 1;

  this.company_rep_mult = 1;
  this.faction_rep_mult = 1;

  this.crime_money_mult = 1;
  this.crime_success_mult = 1;

  this.hacknet_node_money_mult = 1;
  this.hacknet_node_purchase_cost_mult = 1;
  this.hacknet_node_ram_cost_mult = 1;
  this.hacknet_node_core_cost_mult = 1;
  this.hacknet_node_level_cost_mult = 1;

  this.work_money_mult = 1;

  this.bladeburner_max_stamina_mult = 1;
  this.bladeburner_stamina_gain_mult = 1;
  this.bladeburner_analysis_mult = 1;
  this.bladeburner_success_chance_mult = 1;
}

export function hasProgram(this: IPlayer, programName: string): boolean {
  const home = this.getHomeComputer();
  if (home == null) {
    return false;
  }

  for (let i = 0; i < home.programs.length; ++i) {
    if (programName.toLowerCase() == home.programs[i].toLowerCase()) {
      return true;
    }
  }
  return false;
}

export function setMoney(this: IPlayer, money: number): void {
  if (isNaN(money)) {
    console.error("NaN passed into Player.setMoney()");
    return;
  }
  this.money = new Decimal(money);
}

export function gainMoney(this: IPlayer, money: number): void {
  if (isNaN(money)) {
    console.error("NaN passed into Player.gainMoney()");
    return;
  }
  this.money = this.money.plus(money);
}

export function loseMoney(this: IPlayer, money: number): void {
  if (isNaN(money)) {
    console.error("NaN passed into Player.loseMoney()");
    return;
  }
  if (this.money.eq(Infinity) && money === Infinity) return;
  this.money = this.money.minus(money);
}

export function canAfford(this: IPlayer, cost: number): boolean {
  if (isNaN(cost)) {
    console.error(`NaN passed into Player.canAfford()`);
    return false;
  }
  return this.money.gte(cost);
}

export function recordMoneySource(this: IPlayer, amt: number, source: string): void {
  if (!(this.moneySourceA instanceof MoneySourceTracker)) {
    console.warn(`Player.moneySourceA was not properly initialized. Resetting`);
    this.moneySourceA = new MoneySourceTracker();
  }
  if (!(this.moneySourceB instanceof MoneySourceTracker)) {
    console.warn(`Player.moneySourceB was not properly initialized. Resetting`);
    this.moneySourceB = new MoneySourceTracker();
  }
  this.moneySourceA.record(amt, source);
  this.moneySourceB.record(amt, source);
}

export function gainHackingExp(this: IPlayer, exp: number): void {
  if (isNaN(exp)) {
    console.error("ERR: NaN passed into Player.gainHackingExp()");
    return;
  }
  this.hacking_exp += exp;
  if (this.hacking_exp < 0) {
    this.hacking_exp = 0;
  }

  this.hacking_skill = calculateSkillF(this.hacking_exp, this.hacking_mult * BitNodeMultipliers.HackingLevelMultiplier);
}

export function gainStrengthExp(this: IPlayer, exp: number): void {
  if (isNaN(exp)) {
    console.error("ERR: NaN passed into Player.gainStrengthExp()");
    return;
  }
  this.strength_exp += exp;
  if (this.strength_exp < 0) {
    this.strength_exp = 0;
  }

  this.strength = calculateSkillF(this.strength_exp, this.strength_mult * BitNodeMultipliers.StrengthLevelMultiplier);
}

export function gainDefenseExp(this: IPlayer, exp: number): void {
  if (isNaN(exp)) {
    console.error("ERR: NaN passed into player.gainDefenseExp()");
    return;
  }
  this.defense_exp += exp;
  if (this.defense_exp < 0) {
    this.defense_exp = 0;
  }

  this.defense = calculateSkillF(this.defense_exp, this.defense_mult * BitNodeMultipliers.DefenseLevelMultiplier);
}

export function gainDexterityExp(this: IPlayer, exp: number): void {
  if (isNaN(exp)) {
    console.error("ERR: NaN passed into Player.gainDexterityExp()");
    return;
  }
  this.dexterity_exp += exp;
  if (this.dexterity_exp < 0) {
    this.dexterity_exp = 0;
  }

  this.dexterity = calculateSkillF(
    this.dexterity_exp,
    this.dexterity_mult * BitNodeMultipliers.DexterityLevelMultiplier,
  );
}

export function gainAgilityExp(this: IPlayer, exp: number): void {
  if (isNaN(exp)) {
    console.error("ERR: NaN passed into Player.gainAgilityExp()");
    return;
  }
  this.agility_exp += exp;
  if (this.agility_exp < 0) {
    this.agility_exp = 0;
  }

  this.agility = calculateSkillF(this.agility_exp, this.agility_mult * BitNodeMultipliers.AgilityLevelMultiplier);
}

export function gainCharismaExp(this: IPlayer, exp: number): void {
  if (isNaN(exp)) {
    console.error("ERR: NaN passed into Player.gainCharismaExp()");
    return;
  }
  this.charisma_exp += exp;
  if (this.charisma_exp < 0) {
    this.charisma_exp = 0;
  }

  this.charisma = calculateSkillF(this.charisma_exp, this.charisma_mult * BitNodeMultipliers.CharismaLevelMultiplier);
}

export function gainIntelligenceExp(this: IPlayer, exp: number): void {
  if (isNaN(exp)) {
    console.error("ERROR: NaN passed into Player.gainIntelligenceExp()");
    return;
  }
  if (SourceFileFlags[5] > 0 || this.intelligence > 0) {
    this.intelligence_exp += exp;
    this.intelligence = Math.floor(this.calculateSkill(this.intelligence_exp));
  }
}

//Given a string expression like "str" or "strength", returns the given stat
export function queryStatFromString(this: IPlayer, str: string): number {
  const tempStr = str.toLowerCase();
  if (tempStr.includes("hack")) {
    return this.hacking_skill;
  }
  if (tempStr.includes("str")) {
    return this.strength;
  }
  if (tempStr.includes("def")) {
    return this.defense;
  }
  if (tempStr.includes("dex")) {
    return this.dexterity;
  }
  if (tempStr.includes("agi")) {
    return this.agility;
  }
  if (tempStr.includes("cha")) {
    return this.charisma;
  }
  if (tempStr.includes("int")) {
    return this.intelligence;
  }
  return 0;
}

/******* Working functions *******/
export function resetWorkStatus(this: IPlayer, generalType?: string, group?: string, workType?: string): void {
  if (this.workType !== CONSTANTS.WorkTypeFaction && generalType === this.workType && group === this.companyName)
    return;
  if (generalType === this.workType && group === this.currentWorkFactionName && workType === this.factionWorkType)
    return;
  if (this.isWorking) this.singularityStopWork();
  this.workHackExpGainRate = 0;
  this.workStrExpGainRate = 0;
  this.workDefExpGainRate = 0;
  this.workDexExpGainRate = 0;
  this.workAgiExpGainRate = 0;
  this.workChaExpGainRate = 0;
  this.workRepGainRate = 0;
  this.workMoneyGainRate = 0;
  this.workMoneyLossRate = 0;

  this.workHackExpGained = 0;
  this.workStrExpGained = 0;
  this.workDefExpGained = 0;
  this.workDexExpGained = 0;
  this.workAgiExpGained = 0;
  this.workChaExpGained = 0;
  this.workRepGained = 0;
  this.workMoneyGained = 0;

  this.timeWorked = 0;
  this.timeWorkedCreateProgram = 0;

  this.currentWorkFactionName = "";
  this.currentWorkFactionDescription = "";
  this.createProgramName = "";
  this.className = "";
  this.workType = "";
}

export function processWorkEarnings(this: IPlayer, numCycles = 1): void {
  let focusBonus = 1;
  if (!this.hasAugmentation(AugmentationNames["NeuroreceptorManager"])) {
    focusBonus = this.focus ? 1 : CONSTANTS.BaseFocusBonus;
  }
  const hackExpGain = focusBonus * this.workHackExpGainRate * numCycles;
  const strExpGain = focusBonus * this.workStrExpGainRate * numCycles;
  const defExpGain = focusBonus * this.workDefExpGainRate * numCycles;
  const dexExpGain = focusBonus * this.workDexExpGainRate * numCycles;
  const agiExpGain = focusBonus * this.workAgiExpGainRate * numCycles;
  const chaExpGain = focusBonus * this.workChaExpGainRate * numCycles;
  const moneyGain = (this.workMoneyGainRate - this.workMoneyLossRate) * numCycles;

  this.gainHackingExp(hackExpGain);
  this.gainStrengthExp(strExpGain);
  this.gainDefenseExp(defExpGain);
  this.gainDexterityExp(dexExpGain);
  this.gainAgilityExp(agiExpGain);
  this.gainCharismaExp(chaExpGain);
  this.gainMoney(moneyGain);
  if (this.className) {
    this.recordMoneySource(moneyGain, "class");
  } else {
    this.recordMoneySource(moneyGain, "work");
  }
  this.workHackExpGained += hackExpGain;
  this.workStrExpGained += strExpGain;
  this.workDefExpGained += defExpGain;
  this.workDexExpGained += dexExpGain;
  this.workAgiExpGained += agiExpGain;
  this.workChaExpGained += chaExpGain;
  this.workRepGained += focusBonus * this.workRepGainRate * numCycles;
  this.workMoneyGained += focusBonus * this.workMoneyGainRate * numCycles;
  this.workMoneyGained -= focusBonus * this.workMoneyLossRate * numCycles;
}

/* Working for Company */
export function startWork(this: IPlayer, router: IRouter, companyName: string): void {
  this.resetWorkStatus(CONSTANTS.WorkTypeCompany, companyName);
  this.isWorking = true;
  this.focus = true;
  this.companyName = companyName;
  this.workType = CONSTANTS.WorkTypeCompany;

  this.workHackExpGainRate = this.getWorkHackExpGain();
  this.workStrExpGainRate = this.getWorkStrExpGain();
  this.workDefExpGainRate = this.getWorkDefExpGain();
  this.workDexExpGainRate = this.getWorkDexExpGain();
  this.workAgiExpGainRate = this.getWorkAgiExpGain();
  this.workChaExpGainRate = this.getWorkChaExpGain();
  this.workRepGainRate = this.getWorkRepGain();
  this.workMoneyGainRate = this.getWorkMoneyGain();

  this.timeNeededToCompleteWork = CONSTANTS.MillisecondsPer8Hours;
  router.toWork();
}

export function process(this: IPlayer, router: IRouter, numCycles = 1): void {
  // Working
  if (this.isWorking) {
    if (this.workType == CONSTANTS.WorkTypeFaction) {
      if (this.workForFaction(numCycles)) {
        router.toFaction();
      }
    } else if (this.workType == CONSTANTS.WorkTypeCreateProgram) {
      if (this.createProgramWork(numCycles)) {
        router.toTerminal();
      }
    } else if (this.workType == CONSTANTS.WorkTypeStudyClass) {
      if (this.takeClass(numCycles)) {
        router.toCity();
      }
    } else if (this.workType == CONSTANTS.WorkTypeCrime) {
      if (this.commitCrime(numCycles)) {
        router.toLocation(Locations[LocationName.Slums]);
      }
    } else if (this.workType == CONSTANTS.WorkTypeCompanyPartTime) {
      if (this.workPartTime(numCycles)) {
        router.toCity();
      }
    } else {
      if (this.work(numCycles)) {
        router.toCity();
      }
    }
  }
}

export function cancelationPenalty(this: IPlayer): number {
  const data = serverMetadata.find((s) => s.specialName === this.companyName);
  if (!data) return 0.5; // Does not have special server.
  const server = GetServer(data.hostname);
  if (server instanceof Server) {
    if (server && server.backdoorInstalled) return 0.75;
  }

  return 0.5;
}

export function work(this: IPlayer, numCycles: number): boolean {
  // Cap the number of cycles being processed to whatever would put you at
  // the work time limit (8 hours)
  let overMax = false;
  if (this.timeWorked + CONSTANTS._idleSpeed * numCycles >= CONSTANTS.MillisecondsPer8Hours) {
    overMax = true;
    numCycles = Math.round((CONSTANTS.MillisecondsPer8Hours - this.timeWorked) / CONSTANTS._idleSpeed);
  }
  this.timeWorked += CONSTANTS._idleSpeed * numCycles;

  this.workRepGainRate = this.getWorkRepGain();
  this.processWorkEarnings(numCycles);

  const comp = Companies[this.companyName];
  influenceStockThroughCompanyWork(comp, this.workRepGainRate, numCycles);

  // If timeWorked == 8 hours, then finish. You can only gain 8 hours worth of exp and money
  if (overMax || this.timeWorked >= CONSTANTS.MillisecondsPer8Hours) {
    this.finishWork(false);
    return true;
  }
  return false;
}

export function finishWork(this: IPlayer, cancelled: boolean, sing = false): string {
  //Since the work was cancelled early, player only gains half of what they've earned so far
  if (cancelled) {
    this.workRepGained *= this.cancelationPenalty();
  }

  const company = Companies[this.companyName];
  company.playerReputation += this.workRepGained;

  this.updateSkillLevels();

  let content = (
    <>
      You earned a total of: <br />
      <Money money={this.workMoneyGained} />
      <br />
      <Reputation reputation={this.workRepGained} /> reputation for the company <br />
      {numeralWrapper.formatExp(this.workHackExpGained)} hacking exp <br />
      {numeralWrapper.formatExp(this.workStrExpGained)} strength exp <br />
      {numeralWrapper.formatExp(this.workDefExpGained)} defense exp <br />
      {numeralWrapper.formatExp(this.workDexExpGained)} dexterity exp <br />
      {numeralWrapper.formatExp(this.workAgiExpGained)} agility exp <br />
      {numeralWrapper.formatExp(this.workChaExpGained)} charisma exp
      <br />
    </>
  );

  if (cancelled) {
    content = (
      <>
        You worked a short shift of {convertTimeMsToTimeElapsedString(this.timeWorked)} <br />
        <br />
        Since you cancelled your work early, you only gained half of the reputation you earned. <br />
        <br />
        {content}
      </>
    );
  } else {
    content = (
      <>
        You worked a full shift of 8 hours! <br />
        <br />
        {content}
      </>
    );
  }
  if (!sing) {
    dialogBoxCreate(content);
  }

  this.isWorking = false;

  this.resetWorkStatus();
  if (sing) {
    const res =
      "You worked a short shift of " +
      convertTimeMsToTimeElapsedString(this.timeWorked) +
      " and " +
      "earned $" +
      numeralWrapper.formatMoney(this.workMoneyGained) +
      ", " +
      numeralWrapper.formatReputation(this.workRepGained) +
      " reputation, " +
      numeralWrapper.formatExp(this.workHackExpGained) +
      " hacking exp, " +
      numeralWrapper.formatExp(this.workStrExpGained) +
      " strength exp, " +
      numeralWrapper.formatExp(this.workDefExpGained) +
      " defense exp, " +
      numeralWrapper.formatExp(this.workDexExpGained) +
      " dexterity exp, " +
      numeralWrapper.formatExp(this.workAgiExpGained) +
      " agility exp, and " +
      numeralWrapper.formatExp(this.workChaExpGained) +
      " charisma exp.";

    return res;
  }

  return "";
}

export function startWorkPartTime(this: IPlayer, router: IRouter, companyName: string): void {
  this.resetWorkStatus(CONSTANTS.WorkTypeCompanyPartTime, companyName);
  this.isWorking = true;
  this.focus = true;
  this.companyName = companyName;
  this.workType = CONSTANTS.WorkTypeCompanyPartTime;

  this.workHackExpGainRate = this.getWorkHackExpGain();
  this.workStrExpGainRate = this.getWorkStrExpGain();
  this.workDefExpGainRate = this.getWorkDefExpGain();
  this.workDexExpGainRate = this.getWorkDexExpGain();
  this.workAgiExpGainRate = this.getWorkAgiExpGain();
  this.workChaExpGainRate = this.getWorkChaExpGain();
  this.workRepGainRate = this.getWorkRepGain();
  this.workMoneyGainRate = this.getWorkMoneyGain();

  this.timeNeededToCompleteWork = CONSTANTS.MillisecondsPer8Hours;
  router.toWork();
}

export function workPartTime(this: IPlayer, numCycles: number): boolean {
  //Cap the number of cycles being processed to whatever would put you at the
  //work time limit (8 hours)
  let overMax = false;
  if (this.timeWorked + CONSTANTS._idleSpeed * numCycles >= CONSTANTS.MillisecondsPer8Hours) {
    overMax = true;
    numCycles = Math.round((CONSTANTS.MillisecondsPer8Hours - this.timeWorked) / CONSTANTS._idleSpeed);
  }
  this.timeWorked += CONSTANTS._idleSpeed * numCycles;

  this.workRepGainRate = this.getWorkRepGain();
  this.processWorkEarnings(numCycles);

  //If timeWorked == 8 hours, then finish. You can only gain 8 hours worth of exp and money
  if (overMax || this.timeWorked >= CONSTANTS.MillisecondsPer8Hours) {
    this.finishWorkPartTime();
    return true;
  }
  return false;
}

export function finishWorkPartTime(this: IPlayer, sing = false): string {
  const company = Companies[this.companyName];
  company.playerReputation += this.workRepGained;

  this.updateSkillLevels();

  const content = (
    <>
      You worked for {convertTimeMsToTimeElapsedString(this.timeWorked)}
      <br />
      <br />
      You earned a total of: <br />
      <Money money={this.workMoneyGained} />
      <br />
      <Reputation reputation={this.workRepGained} /> reputation for the company <br />
      {numeralWrapper.formatExp(this.workHackExpGained)} hacking exp <br />
      {numeralWrapper.formatExp(this.workStrExpGained)} strength exp <br />
      {numeralWrapper.formatExp(this.workDefExpGained)} defense exp <br />
      {numeralWrapper.formatExp(this.workDexExpGained)} dexterity exp <br />
      {numeralWrapper.formatExp(this.workAgiExpGained)} agility exp <br />
      {numeralWrapper.formatExp(this.workChaExpGained)} charisma exp
      <br />
    </>
  );
  if (!sing) {
    dialogBoxCreate(content);
  }

  this.isWorking = false;
  this.resetWorkStatus();

  if (sing) {
    const res =
      "You worked for " +
      convertTimeMsToTimeElapsedString(this.timeWorked) +
      " and " +
      "earned a total of " +
      "$" +
      numeralWrapper.formatMoney(this.workMoneyGained) +
      ", " +
      numeralWrapper.formatReputation(this.workRepGained) +
      " reputation, " +
      numeralWrapper.formatExp(this.workHackExpGained) +
      " hacking exp, " +
      numeralWrapper.formatExp(this.workStrExpGained) +
      " strength exp, " +
      numeralWrapper.formatExp(this.workDefExpGained) +
      " defense exp, " +
      numeralWrapper.formatExp(this.workDexExpGained) +
      " dexterity exp, " +
      numeralWrapper.formatExp(this.workAgiExpGained) +
      " agility exp, and " +
      numeralWrapper.formatExp(this.workChaExpGained) +
      " charisma exp";
    return res;
  }
  return "";
}

export function startFocusing(this: IPlayer): void {
  this.focus = true;
}

export function stopFocusing(this: IPlayer): void {
  this.focus = false;
}

/* Working for Faction */
export function startFactionWork(this: IPlayer, router: IRouter, faction: Faction): void {
  //Update reputation gain rate to account for faction favor
  let favorMult = 1 + faction.favor / 100;
  if (isNaN(favorMult)) {
    favorMult = 1;
  }
  this.workRepGainRate *= favorMult;
  this.workRepGainRate *= BitNodeMultipliers.FactionWorkRepGain;

  this.isWorking = true;
  this.focus = true;
  this.workType = CONSTANTS.WorkTypeFaction;
  this.currentWorkFactionName = faction.name;

  this.timeNeededToCompleteWork = CONSTANTS.MillisecondsPer20Hours;
  router.toWork();
}

export function startFactionHackWork(this: IPlayer, router: IRouter, faction: Faction): void {
  this.resetWorkStatus(CONSTANTS.WorkTypeFaction, faction.name, CONSTANTS.FactionWorkHacking);

  this.workHackExpGainRate = 0.15 * this.hacking_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
  this.workRepGainRate =
    ((this.hacking_skill + this.intelligence) / CONSTANTS.MaxSkillLevel) *
    this.faction_rep_mult *
    this.getIntelligenceBonus(0.5);

  this.factionWorkType = CONSTANTS.FactionWorkHacking;
  this.currentWorkFactionDescription = "carrying out hacking contracts";

  this.startFactionWork(router, faction);
}

export function startFactionFieldWork(this: IPlayer, router: IRouter, faction: Faction): void {
  this.resetWorkStatus(CONSTANTS.WorkTypeFaction, faction.name, CONSTANTS.FactionWorkField);

  this.workHackExpGainRate = 0.1 * this.hacking_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
  this.workStrExpGainRate = 0.1 * this.strength_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
  this.workDefExpGainRate = 0.1 * this.defense_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
  this.workDexExpGainRate = 0.1 * this.dexterity_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
  this.workAgiExpGainRate = 0.1 * this.agility_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
  this.workChaExpGainRate = 0.1 * this.charisma_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
  this.workRepGainRate = getFactionFieldWorkRepGain(this, faction);

  this.factionWorkType = CONSTANTS.FactionWorkField;
  this.currentWorkFactionDescription = "carrying out field missions";

  this.startFactionWork(router, faction);
}

export function startFactionSecurityWork(this: IPlayer, router: IRouter, faction: Faction): void {
  this.resetWorkStatus(CONSTANTS.WorkTypeFaction, faction.name, CONSTANTS.FactionWorkSecurity);

  this.workHackExpGainRate = 0.05 * this.hacking_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
  this.workStrExpGainRate = 0.15 * this.strength_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
  this.workDefExpGainRate = 0.15 * this.defense_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
  this.workDexExpGainRate = 0.15 * this.dexterity_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
  this.workAgiExpGainRate = 0.15 * this.agility_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
  this.workChaExpGainRate = 0.0 * this.charisma_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
  this.workRepGainRate = getFactionSecurityWorkRepGain(this, faction);

  this.factionWorkType = CONSTANTS.FactionWorkSecurity;
  this.currentWorkFactionDescription = "performing security detail";

  this.startFactionWork(router, faction);
}

export function workForFaction(this: IPlayer, numCycles: number): boolean {
  const faction = Factions[this.currentWorkFactionName];

  //Constantly update the rep gain rate
  switch (this.factionWorkType) {
    case CONSTANTS.FactionWorkHacking:
      this.workRepGainRate = getHackingWorkRepGain(this, faction);
      break;
    case CONSTANTS.FactionWorkField:
      this.workRepGainRate = getFactionFieldWorkRepGain(this, faction);
      break;
    case CONSTANTS.FactionWorkSecurity:
      this.workRepGainRate = getFactionSecurityWorkRepGain(this, faction);
      break;
    default:
      break;
  }

  //Cap the number of cycles being processed to whatever would put you at limit (20 hours)
  let overMax = false;
  if (this.timeWorked + CONSTANTS._idleSpeed * numCycles >= CONSTANTS.MillisecondsPer20Hours) {
    overMax = true;
    numCycles = Math.round((CONSTANTS.MillisecondsPer20Hours - this.timeWorked) / CONSTANTS._idleSpeed);
  }
  this.timeWorked += CONSTANTS._idleSpeed * numCycles;

  this.processWorkEarnings(numCycles);

  //If timeWorked == 20 hours, then finish. You can only work for the faction for 20 hours
  if (overMax || this.timeWorked >= CONSTANTS.MillisecondsPer20Hours) {
    this.finishFactionWork(false);
    return true;
  }
  return false;
}

export function finishFactionWork(this: IPlayer, cancelled: boolean, sing = false): string {
  const faction = Factions[this.currentWorkFactionName];
  faction.playerReputation += this.workRepGained;

  this.updateSkillLevels();

  if (!sing) {
    dialogBoxCreate(
      <>
        You worked for your faction {faction.name} for a total of {convertTimeMsToTimeElapsedString(this.timeWorked)}{" "}
        <br />
        <br />
        You earned a total of: <br />
        <Money money={this.workMoneyGained} />
        <br />
        <Reputation reputation={this.workRepGained} /> reputation for the faction <br />
        {numeralWrapper.formatExp(this.workHackExpGained)} hacking exp <br />
        {numeralWrapper.formatExp(this.workStrExpGained)} strength exp <br />
        {numeralWrapper.formatExp(this.workDefExpGained)} defense exp <br />
        {numeralWrapper.formatExp(this.workDexExpGained)} dexterity exp <br />
        {numeralWrapper.formatExp(this.workAgiExpGained)} agility exp <br />
        {numeralWrapper.formatExp(this.workChaExpGained)} charisma exp
        <br />
      </>,
    );
  }

  this.isWorking = false;
  this.resetWorkStatus();
  if (sing) {
    const res =
      "You worked for your faction " +
      faction.name +
      " for a total of " +
      convertTimeMsToTimeElapsedString(this.timeWorked) +
      ". " +
      "You earned " +
      numeralWrapper.formatReputation(this.workRepGained) +
      " rep, " +
      numeralWrapper.formatExp(this.workHackExpGained) +
      " hacking exp, " +
      numeralWrapper.formatExp(this.workStrExpGained) +
      " str exp, " +
      numeralWrapper.formatExp(this.workDefExpGained) +
      " def exp, " +
      numeralWrapper.formatExp(this.workDexExpGained) +
      " dex exp, " +
      numeralWrapper.formatExp(this.workAgiExpGained) +
      " agi exp, and " +
      numeralWrapper.formatExp(this.workChaExpGained) +
      " cha exp.";

    return res;
  }
  return "";
}

//Money gained per game cycle
export function getWorkMoneyGain(this: IPlayer): number {
  // If player has SF-11, calculate salary multiplier from favor
  let bn11Mult = 1;
  const company = Companies[this.companyName];
  if (SourceFileFlags[11] > 0) {
    bn11Mult = 1 + company.favor / 100;
  }

  // Get base salary
  const companyPositionName = this.jobs[this.companyName];
  const companyPosition = CompanyPositions[companyPositionName];
  if (companyPosition == null) {
    console.error(`Could not find CompanyPosition object for ${companyPositionName}. Work salary will be 0`);
    return 0;
  }

  return (
    companyPosition.baseSalary *
    company.salaryMultiplier *
    this.work_money_mult *
    BitNodeMultipliers.CompanyWorkMoney *
    bn11Mult
  );
}

//Hack exp gained per game cycle
export function getWorkHackExpGain(this: IPlayer): number {
  const company = Companies[this.companyName];
  const companyPositionName = this.jobs[this.companyName];
  const companyPosition = CompanyPositions[companyPositionName];
  if (company == null || companyPosition == null) {
    console.error(
      [
        `Could not find Company object for ${this.companyName}`,
        `or CompanyPosition object for ${companyPositionName}.`,
        `Work hack exp gain will be 0`,
      ].join(" "),
    );
    return 0;
  }

  return (
    companyPosition.hackingExpGain *
    company.expMultiplier *
    this.hacking_exp_mult *
    BitNodeMultipliers.CompanyWorkExpGain
  );
}

//Str exp gained per game cycle
export function getWorkStrExpGain(this: IPlayer): number {
  const company = Companies[this.companyName];
  const companyPositionName = this.jobs[this.companyName];
  const companyPosition = CompanyPositions[companyPositionName];
  if (company == null || companyPosition == null) {
    console.error(
      [
        `Could not find Company object for ${this.companyName}`,
        `or CompanyPosition object for ${companyPositionName}.`,
        `Work str exp gain will be 0`,
      ].join(" "),
    );
    return 0;
  }

  return (
    companyPosition.strengthExpGain *
    company.expMultiplier *
    this.strength_exp_mult *
    BitNodeMultipliers.CompanyWorkExpGain
  );
}

//Def exp gained per game cycle
export function getWorkDefExpGain(this: IPlayer): number {
  const company = Companies[this.companyName];
  const companyPositionName = this.jobs[this.companyName];
  const companyPosition = CompanyPositions[companyPositionName];
  if (company == null || companyPosition == null) {
    console.error(
      [
        `Could not find Company object for ${this.companyName}`,
        `or CompanyPosition object for ${companyPositionName}.`,
        `Work def exp gain will be 0`,
      ].join(" "),
    );
    return 0;
  }

  return (
    companyPosition.defenseExpGain *
    company.expMultiplier *
    this.defense_exp_mult *
    BitNodeMultipliers.CompanyWorkExpGain
  );
}

//Dex exp gained per game cycle
export function getWorkDexExpGain(this: IPlayer): number {
  const company = Companies[this.companyName];
  const companyPositionName = this.jobs[this.companyName];
  const companyPosition = CompanyPositions[companyPositionName];
  if (company == null || companyPosition == null) {
    console.error(
      [
        `Could not find Company object for ${this.companyName}`,
        `or CompanyPosition object for ${companyPositionName}.`,
        `Work dex exp gain will be 0`,
      ].join(" "),
    );
    return 0;
  }

  return (
    companyPosition.dexterityExpGain *
    company.expMultiplier *
    this.dexterity_exp_mult *
    BitNodeMultipliers.CompanyWorkExpGain
  );
}

//Agi exp gained per game cycle
export function getWorkAgiExpGain(this: IPlayer): number {
  const company = Companies[this.companyName];
  const companyPositionName = this.jobs[this.companyName];
  const companyPosition = CompanyPositions[companyPositionName];
  if (company == null || companyPosition == null) {
    console.error(
      [
        `Could not find Company object for ${this.companyName}`,
        `or CompanyPosition object for ${companyPositionName}.`,
        `Work agi exp gain will be 0`,
      ].join(" "),
    );
    return 0;
  }

  return (
    companyPosition.agilityExpGain *
    company.expMultiplier *
    this.agility_exp_mult *
    BitNodeMultipliers.CompanyWorkExpGain
  );
}

//Charisma exp gained per game cycle
export function getWorkChaExpGain(this: IPlayer): number {
  const company = Companies[this.companyName];
  const companyPositionName = this.jobs[this.companyName];
  const companyPosition = CompanyPositions[companyPositionName];
  if (company == null || companyPosition == null) {
    console.error(
      [
        `Could not find Company object for ${this.companyName}`,
        `or CompanyPosition object for ${companyPositionName}.`,
        `Work cha exp gain will be 0`,
      ].join(" "),
    );
    return 0;
  }

  return (
    companyPosition.charismaExpGain *
    company.expMultiplier *
    this.charisma_exp_mult *
    BitNodeMultipliers.CompanyWorkExpGain
  );
}

//Reputation gained per game cycle
export function getWorkRepGain(this: IPlayer): number {
  const company = Companies[this.companyName];
  const companyPositionName = this.jobs[this.companyName];
  const companyPosition = CompanyPositions[companyPositionName];
  if (company == null || companyPosition == null) {
    console.error(
      [
        `Could not find Company object for ${this.companyName}`,
        `or CompanyPosition object for ${companyPositionName}.`,
        `Work rep gain will be 0`,
      ].join(" "),
    );
    return 0;
  }

  let jobPerformance = companyPosition.calculateJobPerformance(
    this.hacking_skill,
    this.strength,
    this.defense,
    this.dexterity,
    this.agility,
    this.charisma,
  );

  //Intelligence provides a flat bonus to job performance
  jobPerformance += this.intelligence / CONSTANTS.MaxSkillLevel;

  //Update reputation gain rate to account for company favor
  let favorMult = 1 + company.favor / 100;
  if (isNaN(favorMult)) {
    favorMult = 1;
  }
  return jobPerformance * this.company_rep_mult * favorMult;
}

// export function getFactionSecurityWorkRepGain(this: IPlayer) {
//     var t = 0.9 * (this.hacking_skill  / CONSTANTS.MaxSkillLevel +
//                    this.strength       / CONSTANTS.MaxSkillLevel +
//                    this.defense        / CONSTANTS.MaxSkillLevel +
//                    this.dexterity      / CONSTANTS.MaxSkillLevel +
//                    this.agility        / CONSTANTS.MaxSkillLevel) / 4.5;
//     return t * this.faction_rep_mult;
// }

// export function getFactionFieldWorkRepGain(this: IPlayer) {
//     var t = 0.9 * (this.hacking_skill  / CONSTANTS.MaxSkillLevel +
//                    this.strength       / CONSTANTS.MaxSkillLevel +
//                    this.defense        / CONSTANTS.MaxSkillLevel +
//                    this.dexterity      / CONSTANTS.MaxSkillLevel +
//                    this.agility        / CONSTANTS.MaxSkillLevel +
//                    this.charisma       / CONSTANTS.MaxSkillLevel +
//                    this.intelligence   / CONSTANTS.MaxSkillLevel) / 5.5;
//     return t * this.faction_rep_mult;
// }

/* Creating a Program */
export function startCreateProgramWork(
  this: IPlayer,
  router: IRouter,
  programName: string,
  time: number,
  reqLevel: number,
): void {
  this.resetWorkStatus();
  this.isWorking = true;
  this.focus = true;
  this.workType = CONSTANTS.WorkTypeCreateProgram;

  //Time needed to complete work affected by hacking skill (linearly based on
  //ratio of (your skill - required level) to MAX skill)
  //var timeMultiplier = (CONSTANTS.MaxSkillLevel - (this.hacking_skill - reqLevel)) / CONSTANTS.MaxSkillLevel;
  //if (timeMultiplier > 1) {timeMultiplier = 1;}
  //if (timeMultiplier < 0.01) {timeMultiplier = 0.01;}
  this.createProgramReqLvl = reqLevel;

  this.timeNeededToCompleteWork = time;
  //Check for incomplete program
  for (let i = 0; i < this.getHomeComputer().programs.length; ++i) {
    const programFile = this.getHomeComputer().programs[i];
    if (programFile.startsWith(programName) && programFile.endsWith("%-INC")) {
      const res = programFile.split("-");
      if (res.length != 3) {
        break;
      }
      const percComplete = Number(res[1].slice(0, -1));
      if (isNaN(percComplete) || percComplete < 0 || percComplete >= 100) {
        break;
      }
      this.timeWorkedCreateProgram = (percComplete / 100) * this.timeNeededToCompleteWork;
      this.getHomeComputer().programs.splice(i, 1);
    }
  }

  this.createProgramName = programName;
  router.toWork();
}

export function createProgramWork(this: IPlayer, numCycles: number): boolean {
  //Higher hacking skill will allow you to create programs faster
  const reqLvl = this.createProgramReqLvl;
  let skillMult = (this.hacking_skill / reqLvl) * this.getIntelligenceBonus(3); //This should always be greater than 1;
  skillMult = 1 + (skillMult - 1) / 5; //The divider constant can be adjusted as necessary

  //Skill multiplier directly applied to "time worked"
  this.timeWorked += CONSTANTS._idleSpeed * numCycles;
  this.timeWorkedCreateProgram += CONSTANTS._idleSpeed * numCycles * skillMult;

  if (this.timeWorkedCreateProgram >= this.timeNeededToCompleteWork) {
    this.finishCreateProgramWork(false);
    return true;
  }
  return false;
}

export function finishCreateProgramWork(this: IPlayer, cancelled: boolean): string {
  const programName = this.createProgramName;
  if (cancelled === false) {
    dialogBoxCreate(
      "You've finished creating " + programName + "!<br>" + "The new program can be found on your home computer.",
    );

    this.getHomeComputer().programs.push(programName);
  } else {
    const perc = (Math.floor((this.timeWorkedCreateProgram / this.timeNeededToCompleteWork) * 10000) / 100).toString();
    const incompleteName = programName + "-" + perc + "%-INC";
    this.getHomeComputer().programs.push(incompleteName);
  }

  if (!cancelled) {
    this.gainIntelligenceExp(this.createProgramReqLvl / CONSTANTS.IntelligenceProgramBaseExpGain);
  }

  this.isWorking = false;

  this.resetWorkStatus();
  return "You've finished creating " + programName + "! The new program can be found on your home computer.";
}

/* Studying/Taking Classes */
export function startClass(this: IPlayer, router: IRouter, costMult: number, expMult: number, className: string): void {
  this.resetWorkStatus();
  this.isWorking = true;
  this.focus = true;
  this.workType = CONSTANTS.WorkTypeStudyClass;

  this.className = className;

  const gameCPS = 1000 / CONSTANTS._idleSpeed;

  //Find cost and exp gain per game cycle
  let cost = 0;
  let hackExp = 0,
    strExp = 0,
    defExp = 0,
    dexExp = 0,
    agiExp = 0,
    chaExp = 0;
  const hashManager = this.hashManager;
  switch (className) {
    case CONSTANTS.ClassStudyComputerScience:
      hackExp = ((CONSTANTS.ClassStudyComputerScienceBaseExp * expMult) / gameCPS) * hashManager.getStudyMult();
      break;
    case CONSTANTS.ClassDataStructures:
      cost = (CONSTANTS.ClassDataStructuresBaseCost * costMult) / gameCPS;
      hackExp = ((CONSTANTS.ClassDataStructuresBaseExp * expMult) / gameCPS) * hashManager.getStudyMult();
      break;
    case CONSTANTS.ClassNetworks:
      cost = (CONSTANTS.ClassNetworksBaseCost * costMult) / gameCPS;
      hackExp = ((CONSTANTS.ClassNetworksBaseExp * expMult) / gameCPS) * hashManager.getStudyMult();
      break;
    case CONSTANTS.ClassAlgorithms:
      cost = (CONSTANTS.ClassAlgorithmsBaseCost * costMult) / gameCPS;
      hackExp = ((CONSTANTS.ClassAlgorithmsBaseExp * expMult) / gameCPS) * hashManager.getStudyMult();
      break;
    case CONSTANTS.ClassManagement:
      cost = (CONSTANTS.ClassManagementBaseCost * costMult) / gameCPS;
      chaExp = ((CONSTANTS.ClassManagementBaseExp * expMult) / gameCPS) * hashManager.getStudyMult();
      break;
    case CONSTANTS.ClassLeadership:
      cost = (CONSTANTS.ClassLeadershipBaseCost * costMult) / gameCPS;
      chaExp = ((CONSTANTS.ClassLeadershipBaseExp * expMult) / gameCPS) * hashManager.getStudyMult();
      break;
    case CONSTANTS.ClassGymStrength:
      cost = (CONSTANTS.ClassGymBaseCost * costMult) / gameCPS;
      strExp = (expMult / gameCPS) * hashManager.getTrainingMult();
      break;
    case CONSTANTS.ClassGymDefense:
      cost = (CONSTANTS.ClassGymBaseCost * costMult) / gameCPS;
      defExp = (expMult / gameCPS) * hashManager.getTrainingMult();
      break;
    case CONSTANTS.ClassGymDexterity:
      cost = (CONSTANTS.ClassGymBaseCost * costMult) / gameCPS;
      dexExp = (expMult / gameCPS) * hashManager.getTrainingMult();
      break;
    case CONSTANTS.ClassGymAgility:
      cost = (CONSTANTS.ClassGymBaseCost * costMult) / gameCPS;
      agiExp = (expMult / gameCPS) * hashManager.getTrainingMult();
      break;
    default:
      throw new Error("ERR: Invalid/unrecognized class name");
      return;
  }

  this.workMoneyLossRate = cost;
  this.workHackExpGainRate = hackExp * this.hacking_exp_mult * BitNodeMultipliers.ClassGymExpGain;
  this.workStrExpGainRate = strExp * this.strength_exp_mult * BitNodeMultipliers.ClassGymExpGain;
  this.workDefExpGainRate = defExp * this.defense_exp_mult * BitNodeMultipliers.ClassGymExpGain;
  this.workDexExpGainRate = dexExp * this.dexterity_exp_mult * BitNodeMultipliers.ClassGymExpGain;
  this.workAgiExpGainRate = agiExp * this.agility_exp_mult * BitNodeMultipliers.ClassGymExpGain;
  this.workChaExpGainRate = chaExp * this.charisma_exp_mult * BitNodeMultipliers.ClassGymExpGain;
  router.toWork();
}

export function takeClass(this: IPlayer, numCycles: number): boolean {
  this.timeWorked += CONSTANTS._idleSpeed * numCycles;
  this.processWorkEarnings(numCycles);
  return false;
}

//The 'sing' argument defines whether or not this function was called
//through a Singularity Netscript function
export function finishClass(this: IPlayer, sing = false): string {
  this.gainIntelligenceExp(CONSTANTS.IntelligenceClassBaseExpGain * Math.round(this.timeWorked / 1000));

  if (this.workMoneyGained > 0) {
    throw new Error("ERR: Somehow gained money while taking class");
  }

  this.updateSkillLevels();
  if (!sing) {
    dialogBoxCreate(
      <>
        After {this.className} for {convertTimeMsToTimeElapsedString(this.timeWorked)}, <br />
        you spent a total of <Money money={-this.workMoneyGained} />. <br />
        <br />
        You earned a total of: <br />
        {numeralWrapper.formatExp(this.workHackExpGained)} hacking exp <br />
        {numeralWrapper.formatExp(this.workStrExpGained)} strength exp <br />
        {numeralWrapper.formatExp(this.workDefExpGained)} defense exp <br />
        {numeralWrapper.formatExp(this.workDexExpGained)} dexterity exp <br />
        {numeralWrapper.formatExp(this.workAgiExpGained)} agility exp <br />
        {numeralWrapper.formatExp(this.workChaExpGained)} charisma exp
        <br />
      </>,
    );
  }

  this.isWorking = false;

  if (sing) {
    const res =
      "After " +
      this.className +
      " for " +
      convertTimeMsToTimeElapsedString(this.timeWorked) +
      ", " +
      "you spent a total of " +
      numeralWrapper.formatMoney(this.workMoneyGained * -1) +
      ". " +
      "You earned a total of: " +
      numeralWrapper.formatExp(this.workHackExpGained) +
      " hacking exp, " +
      numeralWrapper.formatExp(this.workStrExpGained) +
      " strength exp, " +
      numeralWrapper.formatExp(this.workDefExpGained) +
      " defense exp, " +
      numeralWrapper.formatExp(this.workDexExpGained) +
      " dexterity exp, " +
      numeralWrapper.formatExp(this.workAgiExpGained) +
      " agility exp, and " +
      numeralWrapper.formatExp(this.workChaExpGained) +
      " charisma exp";
    this.resetWorkStatus();
    return res;
  }
  this.resetWorkStatus();
  return "";
}

//The EXP and $ gains are hardcoded. Time is in ms
export function startCrime(
  this: IPlayer,
  router: IRouter,
  crimeType: string,
  hackExp: number,
  strExp: number,
  defExp: number,
  dexExp: number,
  agiExp: number,
  chaExp: number,
  money: number,
  time: number,
  workerscript: WorkerScript | null = null,
): void {
  this.crimeType = crimeType;

  this.resetWorkStatus();
  this.isWorking = true;
  this.focus = true;
  this.workType = CONSTANTS.WorkTypeCrime;

  if (workerscript !== null) {
    this.committingCrimeThruSingFn = true;
    this.singFnCrimeWorkerScript = workerscript;
  }

  this.workHackExpGained = hackExp * this.hacking_exp_mult * BitNodeMultipliers.CrimeExpGain;
  this.workStrExpGained = strExp * this.strength_exp_mult * BitNodeMultipliers.CrimeExpGain;
  this.workDefExpGained = defExp * this.defense_exp_mult * BitNodeMultipliers.CrimeExpGain;
  this.workDexExpGained = dexExp * this.dexterity_exp_mult * BitNodeMultipliers.CrimeExpGain;
  this.workAgiExpGained = agiExp * this.agility_exp_mult * BitNodeMultipliers.CrimeExpGain;
  this.workChaExpGained = chaExp * this.charisma_exp_mult * BitNodeMultipliers.CrimeExpGain;
  this.workMoneyGained = money * this.crime_money_mult * BitNodeMultipliers.CrimeMoney;

  this.timeNeededToCompleteWork = time;
  router.toWork();
}

export function commitCrime(this: IPlayer, numCycles: number): boolean {
  this.timeWorked += CONSTANTS._idleSpeed * numCycles;

  if (this.timeWorked >= this.timeNeededToCompleteWork) {
    this.finishCrime(false);
    return true;
  }
  return false;
}

export function finishCrime(this: IPlayer, cancelled: boolean): string {
  //Determine crime success/failure
  if (!cancelled) {
    if (determineCrimeSuccess(this, this.crimeType)) {
      //Handle Karma and crime statistics
      let crime = null;
      for (const i in Crimes) {
        if (Crimes[i].type == this.crimeType) {
          crime = Crimes[i];
          break;
        }
      }
      if (crime == null) {
        dialogBoxCreate(
          `ERR: Unrecognized crime type (${this.crimeType}). This is probably a bug please contact the developer`,
        );
        return "";
      }
      this.gainMoney(this.workMoneyGained);
      this.recordMoneySource(this.workMoneyGained, "crime");
      this.karma -= crime.karma;
      this.numPeopleKilled += crime.kills;
      if (crime.intelligence_exp > 0) {
        this.gainIntelligenceExp(crime.intelligence_exp);
      }

      //On a crime success, gain 2x exp
      this.workHackExpGained *= 2;
      this.workStrExpGained *= 2;
      this.workDefExpGained *= 2;
      this.workDexExpGained *= 2;
      this.workAgiExpGained *= 2;
      this.workChaExpGained *= 2;
      const ws = this.singFnCrimeWorkerScript;
      if (this.committingCrimeThruSingFn && ws !== null) {
        if (ws.disableLogs.ALL == null && ws.disableLogs.commitCrime == null) {
          ws.scriptRef.log(
            "Crime successful! Gained " +
              numeralWrapper.formatMoney(this.workMoneyGained) +
              ", " +
              numeralWrapper.formatExp(this.workHackExpGained) +
              " hack exp, " +
              numeralWrapper.formatExp(this.workStrExpGained) +
              " str exp, " +
              numeralWrapper.formatExp(this.workDefExpGained) +
              " def exp, " +
              numeralWrapper.formatExp(this.workDexExpGained) +
              " dex exp, " +
              numeralWrapper.formatExp(this.workAgiExpGained) +
              " agi exp, " +
              numeralWrapper.formatExp(this.workChaExpGained) +
              " cha exp.",
          );
        }
      } else {
        dialogBoxCreate(
          <>
            Crime successful!
            <br />
            <br />
            You gained:
            <br />
            <Money money={this.workMoneyGained} />
            <br />
            {numeralWrapper.formatExp(this.workHackExpGained)} hacking experience <br />
            {numeralWrapper.formatExp(this.workStrExpGained)} strength experience
            <br />
            {numeralWrapper.formatExp(this.workDefExpGained)} defense experience
            <br />
            {numeralWrapper.formatExp(this.workDexExpGained)} dexterity experience
            <br />
            {numeralWrapper.formatExp(this.workAgiExpGained)} agility experience
            <br />
            {numeralWrapper.formatExp(this.workChaExpGained)} charisma experience
          </>,
        );
      }
    } else {
      //Exp halved on failure
      this.workHackExpGained /= 2;
      this.workStrExpGained /= 2;
      this.workDefExpGained /= 2;
      this.workDexExpGained /= 2;
      this.workAgiExpGained /= 2;
      this.workChaExpGained /= 2;
      const ws = this.singFnCrimeWorkerScript;
      if (this.committingCrimeThruSingFn && ws !== null) {
        if (ws.disableLogs.ALL == null && ws.disableLogs.commitCrime == null) {
          ws.scriptRef.log(
            "Crime failed! Gained " +
              numeralWrapper.formatExp(this.workHackExpGained) +
              " hack exp, " +
              numeralWrapper.formatExp(this.workStrExpGained) +
              " str exp, " +
              numeralWrapper.formatExp(this.workDefExpGained) +
              " def exp, " +
              numeralWrapper.formatExp(this.workDexExpGained) +
              " dex exp, " +
              numeralWrapper.formatExp(this.workAgiExpGained) +
              " agi exp, " +
              numeralWrapper.formatExp(this.workChaExpGained) +
              " cha exp.",
          );
        }
      } else {
        dialogBoxCreate(
          <>
            Crime failed!
            <br />
            <br />
            You gained:
            <br />
            {numeralWrapper.formatExp(this.workHackExpGained)} hacking experience <br />
            {numeralWrapper.formatExp(this.workStrExpGained)} strength experience
            <br />
            {numeralWrapper.formatExp(this.workDefExpGained)} defense experience
            <br />
            {numeralWrapper.formatExp(this.workDexExpGained)} dexterity experience
            <br />
            {numeralWrapper.formatExp(this.workAgiExpGained)} agility experience
            <br />
            {numeralWrapper.formatExp(this.workChaExpGained)} charisma experience
          </>,
        );
      }
    }

    this.gainHackingExp(this.workHackExpGained);
    this.gainStrengthExp(this.workStrExpGained);
    this.gainDefenseExp(this.workDefExpGained);
    this.gainDexterityExp(this.workDexExpGained);
    this.gainAgilityExp(this.workAgiExpGained);
    this.gainCharismaExp(this.workChaExpGained);
  }
  this.committingCrimeThruSingFn = false;
  this.singFnCrimeWorkerScript = null;
  this.isWorking = false;
  this.crimeType = "";
  this.resetWorkStatus();
  return "";
}

//Cancels the player's current "work" assignment and gives the proper rewards
//Used only for Singularity functions, so no popups are created
export function singularityStopWork(this: IPlayer): string {
  if (!this.isWorking) {
    return "";
  }
  let res = ""; //Earnings text for work
  switch (this.workType) {
    case CONSTANTS.WorkTypeStudyClass:
      res = this.finishClass(true);
      break;
    case CONSTANTS.WorkTypeCompany:
      res = this.finishWork(true, true);
      break;
    case CONSTANTS.WorkTypeCompanyPartTime:
      res = this.finishWorkPartTime(true);
      break;
    case CONSTANTS.WorkTypeFaction:
      res = this.finishFactionWork(true, true);
      break;
    case CONSTANTS.WorkTypeCreateProgram:
      res = this.finishCreateProgramWork(true);
      break;
    case CONSTANTS.WorkTypeCrime:
      res = this.finishCrime(true);
      break;
    default:
      console.error(`Unrecognized work type (${this.workType})`);
      return "";
  }
  return res;
}

// Returns true if hospitalized, false otherwise
export function takeDamage(this: IPlayer, amt: number): boolean {
  if (typeof amt !== "number") {
    console.warn(`Player.takeDamage() called without a numeric argument: ${amt}`);
    return false;
  }

  this.hp -= amt;
  if (this.hp <= 0) {
    this.hospitalize();
    return true;
  } else {
    return false;
  }
}

export function regenerateHp(this: IPlayer, amt: number): void {
  if (typeof amt !== "number") {
    console.warn(`Player.regenerateHp() called without a numeric argument: ${amt}`);
    return;
  }
  this.hp += amt;
  if (this.hp > this.max_hp) {
    this.hp = this.max_hp;
  }
}

export function hospitalize(this: IPlayer): number {
  const cost = getHospitalizationCost(this);
  if (Settings.SuppressHospitalizationPopup === false) {
 SnackbarEvents.emit(`You've been Hospitalized for ${numeralWrapper.formatMoney(cost)}`, "warning");
  }

  this.loseMoney(cost);
  this.recordMoneySource(-1 * cost, "hospitalization");
  this.hp = this.max_hp;
  return cost;
}

/********* Company job application **********/
//Determines the job that the Player should get (if any) at the current company
//The 'sing' argument designates whether or not this is being called from
//the applyToCompany() Netscript Singularity function
export function applyForJob(this: IPlayer, entryPosType: CompanyPosition, sing = false): boolean {
  // Get current company and job
  let currCompany = null;
  if (this.companyName !== "") {
    currCompany = Companies[this.companyName];
  }
  const currPositionName = this.jobs[this.companyName];

  // Get company that's being applied to
  const company = Companies[this.location]; //Company being applied to
  if (!(company instanceof Company)) {
    console.error(`Could not find company that matches the location: ${this.location}. Player.applyToCompany() failed`);
    return false;
  }

  let pos = entryPosType;

  if (!this.isQualified(company, pos)) {
    const reqText = getJobRequirementText(company, pos);
    if (!sing) {
      dialogBoxCreate("Unforunately, you do not qualify for this position<br>" + reqText);
    }
    return false;
  }

  while (true) {
    const newPos = getNextCompanyPositionHelper(pos);
    if (newPos == null) {
      break;
    }

    //Check if this company has this position
    if (company.hasPosition(newPos)) {
      if (!this.isQualified(company, newPos)) {
        //If player not qualified for next job, break loop so player will be given current job
        break;
      }
      pos = newPos;
    } else {
      break;
    }
  }

  //Check if the determined job is the same as the player's current job
  if (currCompany != null) {
    if (currCompany.name == company.name && pos.name == currPositionName) {
      const nextPos = getNextCompanyPositionHelper(pos);
      if (nextPos == null) {
        if (!sing) {
          dialogBoxCreate("You are already at the highest position for your field! No promotion available");
        }
        return false;
      } else if (company.hasPosition(nextPos)) {
        if (!sing) {
          const reqText = getJobRequirementText(company, nextPos);
          dialogBoxCreate("Unfortunately, you do not qualify for a promotion<br>" + reqText);
        }
        return false;
      } else {
        if (!sing) {
          dialogBoxCreate("You are already at the highest position for your field! No promotion available");
        }
        return false;
      }
      return false; //Same job, do nothing
    }
  }

  this.jobs[company.name] = pos.name;
  this.companyName = this.location;

  if (!sing) {
    dialogBoxCreate("Congratulations! You were offered a new job at " + this.companyName + " as a " + pos.name + "!");
  }
  return true;
}

//Returns your next position at a company given the field (software, business, etc.)
export function getNextCompanyPosition(
  this: IPlayer,
  company: Company,
  entryPosType: CompanyPosition,
): CompanyPosition | null {
  let currCompany = null;
  if (this.companyName !== "") {
    currCompany = Companies[this.companyName];
  }

  //Not employed at this company, so return the entry position
  if (currCompany == null || currCompany.name != company.name) {
    return entryPosType;
  }

  //If the entry pos type and the player's current position have the same type,
  //return the player's "nextCompanyPosition". Otherwise return the entryposType
  //Employed at this company, so just return the next position if it exists.
  const currentPositionName = this.jobs[this.companyName];
  const currentPosition = CompanyPositions[currentPositionName];
  if (
    (currentPosition.isSoftwareJob() && entryPosType.isSoftwareJob()) ||
    (currentPosition.isITJob() && entryPosType.isITJob()) ||
    (currentPosition.isBusinessJob() && entryPosType.isBusinessJob()) ||
    (currentPosition.isSecurityEngineerJob() && entryPosType.isSecurityEngineerJob()) ||
    (currentPosition.isNetworkEngineerJob() && entryPosType.isNetworkEngineerJob()) ||
    (currentPosition.isSecurityJob() && entryPosType.isSecurityJob()) ||
    (currentPosition.isAgentJob() && entryPosType.isAgentJob()) ||
    (currentPosition.isSoftwareConsultantJob() && entryPosType.isSoftwareConsultantJob()) ||
    (currentPosition.isBusinessConsultantJob() && entryPosType.isBusinessConsultantJob()) ||
    (currentPosition.isPartTimeJob() && entryPosType.isPartTimeJob())
  ) {
    return getNextCompanyPositionHelper(currentPosition);
  }

  return entryPosType;
}

export function quitJob(this: IPlayer, company: string): void {
  this.isWorking = false;
  this.companyName = "";
  delete this.jobs[company];
}

export function applyForSoftwareJob(this: IPlayer, sing = false): boolean {
  return this.applyForJob(CompanyPositions[posNames.SoftwareCompanyPositions[0]], sing);
}

export function applyForSoftwareConsultantJob(this: IPlayer, sing = false): boolean {
  return this.applyForJob(CompanyPositions[posNames.SoftwareConsultantCompanyPositions[0]], sing);
}

export function applyForItJob(this: IPlayer, sing = false): boolean {
  return this.applyForJob(CompanyPositions[posNames.ITCompanyPositions[0]], sing);
}

export function applyForSecurityEngineerJob(this: IPlayer, sing = false): boolean {
  const company = Companies[this.location]; //Company being applied to
  if (this.isQualified(company, CompanyPositions[posNames.SecurityEngineerCompanyPositions[0]])) {
    return this.applyForJob(CompanyPositions[posNames.SecurityEngineerCompanyPositions[0]], sing);
  } else {
    if (!sing) {
      dialogBoxCreate("Unforunately, you do not qualify for this position");
    }
    return false;
  }
}

export function applyForNetworkEngineerJob(this: IPlayer, sing = false): boolean {
  const company = Companies[this.location]; //Company being applied to
  if (this.isQualified(company, CompanyPositions[posNames.NetworkEngineerCompanyPositions[0]])) {
    const pos = CompanyPositions[posNames.NetworkEngineerCompanyPositions[0]];
    return this.applyForJob(pos, sing);
  } else {
    if (!sing) {
      dialogBoxCreate("Unforunately, you do not qualify for this position");
    }
    return false;
  }
}

export function applyForBusinessJob(this: IPlayer, sing = false): boolean {
  return this.applyForJob(CompanyPositions[posNames.BusinessCompanyPositions[0]], sing);
}

export function applyForBusinessConsultantJob(this: IPlayer, sing = false): boolean {
  return this.applyForJob(CompanyPositions[posNames.BusinessConsultantCompanyPositions[0]], sing);
}

export function applyForSecurityJob(this: IPlayer, sing = false): boolean {
  // TODO Police Jobs
  // Indexing starts at 2 because 0 is for police officer
  return this.applyForJob(CompanyPositions[posNames.SecurityCompanyPositions[2]], sing);
}

export function applyForAgentJob(this: IPlayer, sing = false): boolean {
  const company = Companies[this.location]; //Company being applied to
  if (this.isQualified(company, CompanyPositions[posNames.AgentCompanyPositions[0]])) {
    const pos = CompanyPositions[posNames.AgentCompanyPositions[0]];
    return this.applyForJob(pos, sing);
  } else {
    if (!sing) {
      dialogBoxCreate("Unforunately, you do not qualify for this position");
    }
    return false;
  }
}

export function applyForEmployeeJob(this: IPlayer, sing = false): boolean {
  const company = Companies[this.location]; //Company being applied to
  if (this.isQualified(company, CompanyPositions[posNames.MiscCompanyPositions[1]])) {
    this.companyName = company.name;
    this.jobs[company.name] = posNames.MiscCompanyPositions[1];
    if (!sing) {
      dialogBoxCreate("Congratulations, you are now employed at " + this.companyName);
    }

    return true;
  } else {
    if (!sing) {
      dialogBoxCreate("Unforunately, you do not qualify for this position");
    }

    return false;
  }
}

export function applyForPartTimeEmployeeJob(this: IPlayer, sing = false): boolean {
  const company = Companies[this.location]; //Company being applied to
  if (this.isQualified(company, CompanyPositions[posNames.PartTimeCompanyPositions[1]])) {
    this.jobs[company.name] = posNames.PartTimeCompanyPositions[1];
    if (!sing) {
      dialogBoxCreate("Congratulations, you are now employed part-time at " + this.companyName);
    }

    return true;
  } else {
    if (!sing) {
      dialogBoxCreate("Unforunately, you do not qualify for this position");
    }

    return false;
  }
}

export function applyForWaiterJob(this: IPlayer, sing = false): boolean {
  const company = Companies[this.location]; //Company being applied to
  if (this.isQualified(company, CompanyPositions[posNames.MiscCompanyPositions[0]])) {
    this.companyName = company.name;
    this.jobs[company.name] = posNames.MiscCompanyPositions[0];
    if (!sing) {
      dialogBoxCreate("Congratulations, you are now employed as a waiter at " + this.companyName);
    }
    return true;
  } else {
    if (!sing) {
      dialogBoxCreate("Unforunately, you do not qualify for this position");
    }
    return false;
  }
}

export function applyForPartTimeWaiterJob(this: IPlayer, sing = false): boolean {
  const company = Companies[this.location]; //Company being applied to
  if (this.isQualified(company, CompanyPositions[posNames.PartTimeCompanyPositions[0]])) {
    this.companyName = company.name;
    this.jobs[company.name] = posNames.PartTimeCompanyPositions[0];
    if (!sing) {
      dialogBoxCreate("Congratulations, you are now employed as a part-time waiter at " + this.companyName);
    }
    return true;
  } else {
    if (!sing) {
      dialogBoxCreate("Unforunately, you do not qualify for this position");
    }
    return false;
  }
}

//Checks if the Player is qualified for a certain position
export function isQualified(this: IPlayer, company: Company, position: CompanyPosition): boolean {
  const offset = company.jobStatReqOffset;
  const reqHacking = position.requiredHacking > 0 ? position.requiredHacking + offset : 0;
  const reqStrength = position.requiredStrength > 0 ? position.requiredStrength + offset : 0;
  const reqDefense = position.requiredDefense > 0 ? position.requiredDefense + offset : 0;
  const reqDexterity = position.requiredDexterity > 0 ? position.requiredDexterity + offset : 0;
  const reqAgility = position.requiredDexterity > 0 ? position.requiredDexterity + offset : 0;
  const reqCharisma = position.requiredCharisma > 0 ? position.requiredCharisma + offset : 0;

  if (
    this.hacking_skill >= reqHacking &&
    this.strength >= reqStrength &&
    this.defense >= reqDefense &&
    this.dexterity >= reqDexterity &&
    this.agility >= reqAgility &&
    this.charisma >= reqCharisma &&
    company.playerReputation >= position.requiredReputation
  ) {
    return true;
  }
  return false;
}

/********** Reapplying Augmentations and Source File ***********/
export function reapplyAllAugmentations(this: IPlayer, resetMultipliers = true): void {
  if (resetMultipliers) {
    this.resetMultipliers();
  }

  for (let i = 0; i < this.augmentations.length; ++i) {
    //Compatibility with new version
    if (this.augmentations[i].name === "HacknetNode NIC Architecture Neural-Upload") {
      this.augmentations[i].name = "Hacknet Node NIC Architecture Neural-Upload";
    }

    const augName = this.augmentations[i].name;
    const aug = Augmentations[augName];
    if (aug == null) {
      console.warn(`Invalid augmentation name in Player.reapplyAllAugmentations(). Aug ${augName} will be skipped`);
      continue;
    }
    aug.owned = true;
    if (aug.name == AugmentationNames.NeuroFluxGovernor) {
      for (let j = 0; j < aug.level; ++j) {
        applyAugmentation(this.augmentations[i], true);
      }
      continue;
    }
    applyAugmentation(this.augmentations[i], true);
  }

  this.updateSkillLevels();
}

export function reapplyAllSourceFiles(this: IPlayer): void {
  //Will always be called after reapplyAllAugmentations() so multipliers do not have to be reset
  //this.resetMultipliers();

  for (let i = 0; i < this.sourceFiles.length; ++i) {
    const srcFileKey = "SourceFile" + this.sourceFiles[i].n;
    const sourceFileObject = SourceFiles[srcFileKey];
    if (sourceFileObject == null) {
      console.error(`Invalid source file number: ${this.sourceFiles[i].n}`);
      continue;
    }
    applySourceFile(this.sourceFiles[i]);
  }
  applyExploit();
}

/*************** Check for Faction Invitations *************/
//This function sets the requirements to join a Faction. It checks whether the Player meets
//those requirements and will return an array of all factions that the Player should
//receive an invitation to
export function checkForFactionInvitations(this: IPlayer): Faction[] {
  const invitedFactions: Faction[] = []; //Array which will hold all Factions the player should be invited to

  const numAugmentations = this.augmentations.length;

  const allCompanies = Object.keys(this.jobs);
  const allPositions = Object.values(this.jobs);

  // Given a company name, safely returns the reputation (returns 0 if invalid company is specified)
  function getCompanyRep(companyName: string): number {
    const company = Companies[companyName];
    if (company == null) {
      return 0;
    } else {
      return company.playerReputation;
    }
  }

  // Helper function that returns a boolean indicating whether the Player meets
  // the requirements for the specified company. There are two requirements:
  //      1. High enough reputation
  //      2. Player is employed at the company
  function checkMegacorpRequirements(companyName: string, repNeeded = CONSTANTS.CorpFactionRepRequirement): boolean {
    return allCompanies.includes(companyName) && getCompanyRep(companyName) > repNeeded;
  }

  //Illuminati
  const illuminatiFac = Factions["Illuminati"];
  if (
    !illuminatiFac.isBanned &&
    !illuminatiFac.isMember &&
    !illuminatiFac.alreadyInvited &&
    numAugmentations >= 30 &&
    this.money.gte(150000000000) &&
    this.hacking_skill >= 1500 &&
    this.strength >= 1200 &&
    this.defense >= 1200 &&
    this.dexterity >= 1200 &&
    this.agility >= 1200
  ) {
    invitedFactions.push(illuminatiFac);
  }

  //Daedalus
  const daedalusFac = Factions["Daedalus"];
  if (
    !daedalusFac.isBanned &&
    !daedalusFac.isMember &&
    !daedalusFac.alreadyInvited &&
    numAugmentations >= Math.round(30 * BitNodeMultipliers.DaedalusAugsRequirement) &&
    this.money.gte(100000000000) &&
    (this.hacking_skill >= 2500 ||
      (this.strength >= 1500 && this.defense >= 1500 && this.dexterity >= 1500 && this.agility >= 1500))
  ) {
    invitedFactions.push(daedalusFac);
  }

  //The Covenant
  const covenantFac = Factions["The Covenant"];
  if (
    !covenantFac.isBanned &&
    !covenantFac.isMember &&
    !covenantFac.alreadyInvited &&
    numAugmentations >= 20 &&
    this.money.gte(75000000000) &&
    this.hacking_skill >= 850 &&
    this.strength >= 850 &&
    this.defense >= 850 &&
    this.dexterity >= 850 &&
    this.agility >= 850
  ) {
    invitedFactions.push(covenantFac);
  }

  //ECorp
  const ecorpFac = Factions["ECorp"];
  if (
    !ecorpFac.isBanned &&
    !ecorpFac.isMember &&
    !ecorpFac.alreadyInvited &&
    checkMegacorpRequirements(LocationName.AevumECorp)
  ) {
    invitedFactions.push(ecorpFac);
  }

  //MegaCorp
  const megacorpFac = Factions["MegaCorp"];
  if (
    !megacorpFac.isBanned &&
    !megacorpFac.isMember &&
    !megacorpFac.alreadyInvited &&
    checkMegacorpRequirements(LocationName.Sector12MegaCorp)
  ) {
    invitedFactions.push(megacorpFac);
  }

  //Bachman & Associates
  const bachmanandassociatesFac = Factions["Bachman & Associates"];
  if (
    !bachmanandassociatesFac.isBanned &&
    !bachmanandassociatesFac.isMember &&
    !bachmanandassociatesFac.alreadyInvited &&
    checkMegacorpRequirements(LocationName.AevumBachmanAndAssociates)
  ) {
    invitedFactions.push(bachmanandassociatesFac);
  }

  //Blade Industries
  const bladeindustriesFac = Factions["Blade Industries"];
  if (
    !bladeindustriesFac.isBanned &&
    !bladeindustriesFac.isMember &&
    !bladeindustriesFac.alreadyInvited &&
    checkMegacorpRequirements(LocationName.Sector12BladeIndustries)
  ) {
    invitedFactions.push(bladeindustriesFac);
  }

  //NWO
  const nwoFac = Factions["NWO"];
  if (
    !nwoFac.isBanned &&
    !nwoFac.isMember &&
    !nwoFac.alreadyInvited &&
    checkMegacorpRequirements(LocationName.VolhavenNWO)
  ) {
    invitedFactions.push(nwoFac);
  }

  //Clarke Incorporated
  const clarkeincorporatedFac = Factions["Clarke Incorporated"];
  if (
    !clarkeincorporatedFac.isBanned &&
    !clarkeincorporatedFac.isMember &&
    !clarkeincorporatedFac.alreadyInvited &&
    checkMegacorpRequirements(LocationName.AevumClarkeIncorporated)
  ) {
    invitedFactions.push(clarkeincorporatedFac);
  }

  //OmniTek Incorporated
  const omnitekincorporatedFac = Factions["OmniTek Incorporated"];
  if (
    !omnitekincorporatedFac.isBanned &&
    !omnitekincorporatedFac.isMember &&
    !omnitekincorporatedFac.alreadyInvited &&
    checkMegacorpRequirements(LocationName.VolhavenOmniTekIncorporated)
  ) {
    invitedFactions.push(omnitekincorporatedFac);
  }

  //Four Sigma
  const foursigmaFac = Factions["Four Sigma"];
  if (
    !foursigmaFac.isBanned &&
    !foursigmaFac.isMember &&
    !foursigmaFac.alreadyInvited &&
    checkMegacorpRequirements(LocationName.Sector12FourSigma)
  ) {
    invitedFactions.push(foursigmaFac);
  }

  //KuaiGong International
  const kuaigonginternationalFac = Factions["KuaiGong International"];
  if (
    !kuaigonginternationalFac.isBanned &&
    !kuaigonginternationalFac.isMember &&
    !kuaigonginternationalFac.alreadyInvited &&
    checkMegacorpRequirements(LocationName.ChongqingKuaiGongInternational)
  ) {
    invitedFactions.push(kuaigonginternationalFac);
  }

  //Fulcrum Secret Technologies - If u've unlocked fulcrum secret technolgoies server and have a high rep with the company
  const fulcrumsecrettechonologiesFac = Factions["Fulcrum Secret Technologies"];
  const fulcrumSecretServer = GetServer(SpecialServers.FulcrumSecretTechnologies);
  if (!(fulcrumSecretServer instanceof Server)) throw new Error("Fulcrum Secret Technologies should be normal server");
  if (fulcrumSecretServer == null) {
    console.error("Could not find Fulcrum Secret Technologies Server");
  } else {
    if (
      !fulcrumsecrettechonologiesFac.isBanned &&
      !fulcrumsecrettechonologiesFac.isMember &&
      !fulcrumsecrettechonologiesFac.alreadyInvited &&
      fulcrumSecretServer.backdoorInstalled &&
      checkMegacorpRequirements(LocationName.AevumFulcrumTechnologies, 250e3)
    ) {
      invitedFactions.push(fulcrumsecrettechonologiesFac);
    }
  }

  //BitRunners
  const bitrunnersFac = Factions["BitRunners"];
  const bitrunnersServer = GetServer(SpecialServers.BitRunnersServer);
  if (!(bitrunnersServer instanceof Server)) throw new Error("BitRunners should be normal server");
  if (bitrunnersServer == null) {
    console.error("Could not find BitRunners Server");
  } else if (
    !bitrunnersFac.isBanned &&
    !bitrunnersFac.isMember &&
    bitrunnersServer.backdoorInstalled &&
    !bitrunnersFac.alreadyInvited
  ) {
    invitedFactions.push(bitrunnersFac);
  }

  //The Black Hand

  const theblackhandFac = Factions["The Black Hand"];
  const blackhandServer = GetServer(SpecialServers.TheBlackHandServer);
  if (!(blackhandServer instanceof Server)) throw new Error("TheBlackHand should be normal server");
  if (blackhandServer == null) {
    console.error("Could not find The Black Hand Server");
  } else if (
    !theblackhandFac.isBanned &&
    !theblackhandFac.isMember &&
    blackhandServer.backdoorInstalled &&
    !theblackhandFac.alreadyInvited
  ) {
    invitedFactions.push(theblackhandFac);
  }

  //NiteSec
  const nitesecFac = Factions["NiteSec"];
  const nitesecServer = GetServer(SpecialServers.NiteSecServer);
  if (!(nitesecServer instanceof Server)) throw new Error("NiteSec should be normal server");
  if (nitesecServer == null) {
    console.error("Could not find NiteSec Server");
  } else if (
    !nitesecFac.isBanned &&
    !nitesecFac.isMember &&
    nitesecServer.backdoorInstalled &&
    !nitesecFac.alreadyInvited
  ) {
    invitedFactions.push(nitesecFac);
  }

  //Chongqing
  const chongqingFac = Factions["Chongqing"];
  if (
    !chongqingFac.isBanned &&
    !chongqingFac.isMember &&
    !chongqingFac.alreadyInvited &&
    this.money.gte(20000000) &&
    this.city == CityName.Chongqing
  ) {
    invitedFactions.push(chongqingFac);
  }

  //Sector-12
  const sector12Fac = Factions["Sector-12"];
  if (
    !sector12Fac.isBanned &&
    !sector12Fac.isMember &&
    !sector12Fac.alreadyInvited &&
    this.money.gte(15000000) &&
    this.city == CityName.Sector12
  ) {
    invitedFactions.push(sector12Fac);
  }

  //New Tokyo
  const newtokyoFac = Factions["New Tokyo"];
  if (
    !newtokyoFac.isBanned &&
    !newtokyoFac.isMember &&
    !newtokyoFac.alreadyInvited &&
    this.money.gte(20000000) &&
    this.city == CityName.NewTokyo
  ) {
    invitedFactions.push(newtokyoFac);
  }

  //Aevum
  const aevumFac = Factions["Aevum"];
  if (
    !aevumFac.isBanned &&
    !aevumFac.isMember &&
    !aevumFac.alreadyInvited &&
    this.money.gte(40000000) &&
    this.city == CityName.Aevum
  ) {
    invitedFactions.push(aevumFac);
  }

  //Ishima
  const ishimaFac = Factions["Ishima"];
  if (
    !ishimaFac.isBanned &&
    !ishimaFac.isMember &&
    !ishimaFac.alreadyInvited &&
    this.money.gte(30000000) &&
    this.city == CityName.Ishima
  ) {
    invitedFactions.push(ishimaFac);
  }

  //Volhaven
  const volhavenFac = Factions["Volhaven"];
  if (
    !volhavenFac.isBanned &&
    !volhavenFac.isMember &&
    !volhavenFac.alreadyInvited &&
    this.money.gte(50000000) &&
    this.city == CityName.Volhaven
  ) {
    invitedFactions.push(volhavenFac);
  }

  //Speakers for the Dead
  const speakersforthedeadFac = Factions["Speakers for the Dead"];
  if (
    !speakersforthedeadFac.isBanned &&
    !speakersforthedeadFac.isMember &&
    !speakersforthedeadFac.alreadyInvited &&
    this.hacking_skill >= 100 &&
    this.strength >= 300 &&
    this.defense >= 300 &&
    this.dexterity >= 300 &&
    this.agility >= 300 &&
    this.numPeopleKilled >= 30 &&
    this.karma <= -45 &&
    !allCompanies.includes(LocationName.Sector12CIA) &&
    !allCompanies.includes(LocationName.Sector12NSA)
  ) {
    invitedFactions.push(speakersforthedeadFac);
  }

  //The Dark Army
  const thedarkarmyFac = Factions["The Dark Army"];
  if (
    !thedarkarmyFac.isBanned &&
    !thedarkarmyFac.isMember &&
    !thedarkarmyFac.alreadyInvited &&
    this.hacking_skill >= 300 &&
    this.strength >= 300 &&
    this.defense >= 300 &&
    this.dexterity >= 300 &&
    this.agility >= 300 &&
    this.city == CityName.Chongqing &&
    this.numPeopleKilled >= 5 &&
    this.karma <= -45 &&
    !allCompanies.includes(LocationName.Sector12CIA) &&
    !allCompanies.includes(LocationName.Sector12NSA)
  ) {
    invitedFactions.push(thedarkarmyFac);
  }

  //The Syndicate
  const thesyndicateFac = Factions["The Syndicate"];
  if (
    !thesyndicateFac.isBanned &&
    !thesyndicateFac.isMember &&
    !thesyndicateFac.alreadyInvited &&
    this.hacking_skill >= 200 &&
    this.strength >= 200 &&
    this.defense >= 200 &&
    this.dexterity >= 200 &&
    this.agility >= 200 &&
    (this.city == CityName.Aevum || this.city == CityName.Sector12) &&
    this.money.gte(10000000) &&
    this.karma <= -90 &&
    !allCompanies.includes(LocationName.Sector12CIA) &&
    !allCompanies.includes(LocationName.Sector12NSA)
  ) {
    invitedFactions.push(thesyndicateFac);
  }

  //Silhouette
  const silhouetteFac = Factions["Silhouette"];
  if (
    !silhouetteFac.isBanned &&
    !silhouetteFac.isMember &&
    !silhouetteFac.alreadyInvited &&
    (allPositions.includes("Chief Technology Officer") ||
      allPositions.includes("Chief Financial Officer") ||
      allPositions.includes("Chief Executive Officer")) &&
    this.money.gte(15000000) &&
    this.karma <= -22
  ) {
    invitedFactions.push(silhouetteFac);
  }

  //Tetrads
  const tetradsFac = Factions["Tetrads"];
  if (
    !tetradsFac.isBanned &&
    !tetradsFac.isMember &&
    !tetradsFac.alreadyInvited &&
    (this.city == CityName.Chongqing || this.city == CityName.NewTokyo || this.city == CityName.Ishima) &&
    this.strength >= 75 &&
    this.defense >= 75 &&
    this.dexterity >= 75 &&
    this.agility >= 75 &&
    this.karma <= -18
  ) {
    invitedFactions.push(tetradsFac);
  }

  //SlumSnakes
  const slumsnakesFac = Factions["Slum Snakes"];
  if (
    !slumsnakesFac.isBanned &&
    !slumsnakesFac.isMember &&
    !slumsnakesFac.alreadyInvited &&
    this.strength >= 30 &&
    this.defense >= 30 &&
    this.dexterity >= 30 &&
    this.agility >= 30 &&
    this.karma <= -9 &&
    this.money.gte(1000000)
  ) {
    invitedFactions.push(slumsnakesFac);
  }

  //Netburners
  const netburnersFac = Factions["Netburners"];
  let totalHacknetRam = 0;
  let totalHacknetCores = 0;
  let totalHacknetLevels = 0;
  for (let i = 0; i < this.hacknetNodes.length; ++i) {
    const v = this.hacknetNodes[i];
    if (typeof v === "string") {
      const hserver = GetServer(v);
      if (hserver === null || !(hserver instanceof HacknetServer))
        throw new Error("player hacknet server was not HacknetServer");
      totalHacknetLevels += hserver.level;
      totalHacknetRam += hserver.maxRam;
      totalHacknetCores += hserver.cores;
    } else {
      totalHacknetLevels += v.level;
      totalHacknetRam += v.ram;
      totalHacknetCores += v.cores;
    }
  }
  if (
    !netburnersFac.isBanned &&
    !netburnersFac.isMember &&
    !netburnersFac.alreadyInvited &&
    this.hacking_skill >= 80 &&
    totalHacknetRam >= 8 &&
    totalHacknetCores >= 4 &&
    totalHacknetLevels >= 100
  ) {
    invitedFactions.push(netburnersFac);
  }

  //Tian Di Hui
  const tiandihuiFac = Factions["Tian Di Hui"];
  if (
    !tiandihuiFac.isBanned &&
    !tiandihuiFac.isMember &&
    !tiandihuiFac.alreadyInvited &&
    this.money.gte(1000000) &&
    this.hacking_skill >= 50 &&
    (this.city == CityName.Chongqing || this.city == CityName.NewTokyo || this.city == CityName.Ishima)
  ) {
    invitedFactions.push(tiandihuiFac);
  }

  //CyberSec
  const cybersecFac = Factions["CyberSec"];
  const cybersecServer = GetServer(SpecialServers.CyberSecServer);
  if (!(cybersecServer instanceof Server)) throw new Error("cybersec should be normal server");
  if (cybersecServer == null) {
    console.error("Could not find CyberSec Server");
  } else if (
    !cybersecFac.isBanned &&
    !cybersecFac.isMember &&
    cybersecServer.backdoorInstalled &&
    !cybersecFac.alreadyInvited
  ) {
    invitedFactions.push(cybersecFac);
  }

  return invitedFactions;
}

/************* BitNodes **************/
export function setBitNodeNumber(this: IPlayer, n: number): void {
  this.bitNodeN = n;
}

export function queueAugmentation(this: IPlayer, name: string): void {
  for (const i in this.queuedAugmentations) {
    if (this.queuedAugmentations[i].name == name) {
      console.warn(`tried to queue ${name} twice, this may be a bug`);
      return;
    }
  }

  for (const i in this.augmentations) {
    if (this.augmentations[i].name == name) {
      console.warn(`tried to queue ${name} twice, this may be a bug`);
      return;
    }
  }

  this.queuedAugmentations.push(new PlayerOwnedAugmentation(name));
}

/************* Coding Contracts **************/
export function gainCodingContractReward(this: IPlayer, reward: ICodingContractReward, difficulty = 1): string {
  if (reward == null || reward.type == null || reward == null) {
    return `No reward for this contract`;
  }

  /* eslint-disable no-case-declarations */
  switch (reward.type) {
    case CodingContractRewardType.FactionReputation:
      if (reward.name == null || !(Factions[reward.name] instanceof Faction)) {
        // If no/invalid faction was designated, just give rewards to all factions
        reward.type = CodingContractRewardType.FactionReputationAll;
        return this.gainCodingContractReward(reward);
      }
      const repGain = CONSTANTS.CodingContractBaseFactionRepGain * difficulty;
      Factions[reward.name].playerReputation += repGain;
      return `Gained ${repGain} faction reputation for ${reward.name}`;
    case CodingContractRewardType.FactionReputationAll:
      const totalGain = CONSTANTS.CodingContractBaseFactionRepGain * difficulty;

      // Ignore Bladeburners and other special factions for this calculation
      const specialFactions = ["Bladeburners"];
      const factions = this.factions.slice().filter((f) => {
        return !specialFactions.includes(f);
      });

      // If the player was only part of the special factions, we'll just give money
      if (factions.length == 0) {
        reward.type = CodingContractRewardType.Money;
        return this.gainCodingContractReward(reward, difficulty);
      }

      const gainPerFaction = Math.floor(totalGain / factions.length);
      for (const facName of factions) {
        if (!(Factions[facName] instanceof Faction)) {
          continue;
        }
        Factions[facName].playerReputation += gainPerFaction;
      }
      return `Gained ${gainPerFaction} reputation for each of the following factions: ${factions.toString()}`;
      break;
    case CodingContractRewardType.CompanyReputation: {
      if (reward.name == null || !(Companies[reward.name] instanceof Company)) {
        //If no/invalid company was designated, just give rewards to all factions
        reward.type = CodingContractRewardType.FactionReputationAll;
        return this.gainCodingContractReward(reward);
      }
      const repGain = CONSTANTS.CodingContractBaseCompanyRepGain * difficulty;
      Companies[reward.name].playerReputation += repGain;
      return `Gained ${repGain} company reputation for ${reward.name}`;
    }
    case CodingContractRewardType.Money:
    default: {
      const moneyGain = CONSTANTS.CodingContractBaseMoneyGain * difficulty * BitNodeMultipliers.CodingContractMoney;
      this.gainMoney(moneyGain);
      this.recordMoneySource(moneyGain, "codingcontract");
      return `Gained ${numeralWrapper.formatMoney(moneyGain)}`;
    }
  }
  /* eslint-enable no-case-declarations */
}

export function travel(this: IPlayer, to: CityName): boolean {
  if (Cities[to] == null) {
    console.warn(`Player.travel() called with invalid city: ${to}`);
    return false;
  }
  this.city = to;

  return true;
}

export function gotoLocation(this: IPlayer, to: LocationName): boolean {
  if (Locations[to] == null) {
    console.warn(`Player.gotoLocation() called with invalid location: ${to}`);
    return false;
  }
  this.location = to;

  return true;
}

export function canAccessResleeving(this: IPlayer): boolean {
  return this.bitNodeN === 10 || SourceFileFlags[10] > 0;
}

export function giveExploit(this: IPlayer, exploit: Exploit): void {
  if (!this.exploits.includes(exploit)) {
    this.exploits.push(exploit);
  }
}

export function getIntelligenceBonus(this: IPlayer, weight: number): number {
  return calculateIntelligenceBonus(this.intelligence, weight);
}

export function getCasinoWinnings(this: IPlayer): number {
  return this.moneySourceA.casino;
}

export function getMult(this: IPlayer, name: string): number {
  if (!this.hasOwnProperty(name)) return 1;
  return (this as any)[name];
}

export function setMult(this: IPlayer, name: string, mult: number): void {
  if (!this.hasOwnProperty(name)) return;
  (this as any)[name] = mult;
}

export function canAccessCotMG(this: IPlayer): boolean {
  return this.bitNodeN === 13 || SourceFileFlags[13] > 0;
}

export function sourceFileLvl(this: IPlayer, n: number): number {
  const sf = this.sourceFiles.find((sf) => sf.n === n);
  if (!sf) return 0;
  return sf.lvl;
}
