import { IPlayer } from "../IPlayer";
import { PlayerObject } from "./PlayerObject";
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
import { Exploit } from "../../Exploits/Exploit";
import { Faction } from "../../Faction/Faction";
import { Factions } from "../../Faction/Factions";
import { resetGangs } from "../../Gang/AllGangs";
import { Cities } from "../../Locations/Cities";
import { Locations } from "../../Locations/Locations";
import { CityName } from "../../Locations/data/CityNames";
import { LocationName } from "../../Locations/data/LocationNames";
import { Sleeve } from "../Sleeve/Sleeve";
import {
  calculateSkill as calculateSkillF,
  calculateSkillProgress as calculateSkillProgressF,
  ISkillProgress,
} from "../formulas/skill";
import { calculateIntelligenceBonus } from "../formulas/intelligence";
import { GetServer, AddToAllServers, createUniqueRandomIp } from "../../Server/AllServers";
import { Server } from "../../Server/Server";
import { safetlyCreateUniqueServer } from "../../Server/ServerHelpers";

import { SpecialServers } from "../../Server/data/SpecialServers";
import { applySourceFile } from "../../SourceFile/applySourceFile";
import { applyExploit } from "../../Exploits/applyExploits";
import { SourceFiles } from "../../SourceFile/SourceFiles";
import { getHospitalizationCost } from "../../Hospital/Hospital";
import { HacknetServer } from "../../Hacknet/HacknetServer";

import { numeralWrapper } from "../../ui/numeralFormat";
import { MoneySourceTracker } from "../../utils/MoneySourceTracker";
import { dialogBoxCreate } from "../../ui/React/DialogBox";

import { SnackbarEvents, ToastVariant } from "../../ui/React/Snackbar";
import { achievements } from "../../Achievements/Achievements";
import { FactionNames } from "../../Faction/data/FactionNames";
import { ITaskTracker } from "../ITaskTracker";
import { IPerson } from "../IPerson";
import { Player } from "../../Player";

import { isCompanyWork } from "../../Work/CompanyWork";
import { defaultMultipliers } from "../Multipliers";
import { serverMetadata } from "../../Server/data/servers";

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

export function prestigeAugmentation(this: PlayerObject): void {
  this.currentServer = SpecialServers.Home;

  this.numPeopleKilled = 0;

  //Reset stats
  this.hacking = 1;

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

  this.money = 1000 + CONSTANTS.Donations;

  this.city = CityName.Sector12;
  this.location = LocationName.TravelAgency;

  this.jobs = {};

  this.purchasedServers = [];

  this.factions = [];
  this.factionInvitations = [];

  this.queuedAugmentations = [];

  const numSleeves = Math.min(3, this.sourceFileLvl(10) + (this.bitNodeN === 10 ? 1 : 0)) + this.sleevesFromCovenant;
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
  this.entropy = 0;
  this.prestigeAugmentation();
  this.karma = 0;
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
export function calculateSkill(this: IPerson, exp: number, mult = 1): number {
  return calculateSkillF(exp, mult);
}

//Calculates skill level progress based on experience. The same formula will be used for every skill
export function calculateSkillProgress(this: IPlayer, exp: number, mult = 1): ISkillProgress {
  return calculateSkillProgressF(exp, mult);
}

export function updateSkillLevels(this: IPlayer): void {
  this.hacking = Math.max(
    1,
    Math.floor(this.calculateSkill(this.hacking_exp, this.mults.hacking * BitNodeMultipliers.HackingLevelMultiplier)),
  );
  this.strength = Math.max(
    1,
    Math.floor(
      this.calculateSkill(this.strength_exp, this.mults.strength * BitNodeMultipliers.StrengthLevelMultiplier),
    ),
  );
  this.defense = Math.max(
    1,
    Math.floor(this.calculateSkill(this.defense_exp, this.mults.defense * BitNodeMultipliers.DefenseLevelMultiplier)),
  );
  this.dexterity = Math.max(
    1,
    Math.floor(
      this.calculateSkill(this.dexterity_exp, this.mults.dexterity * BitNodeMultipliers.DexterityLevelMultiplier),
    ),
  );
  this.agility = Math.max(
    1,
    Math.floor(this.calculateSkill(this.agility_exp, this.mults.agility * BitNodeMultipliers.AgilityLevelMultiplier)),
  );
  this.charisma = Math.max(
    1,
    Math.floor(
      this.calculateSkill(this.charisma_exp, this.mults.charisma * BitNodeMultipliers.CharismaLevelMultiplier),
    ),
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
  this.mults = defaultMultipliers();
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

export function setMoney(this: PlayerObject, money: number): void {
  if (isNaN(money)) {
    console.error("NaN passed into Player.setMoney()");
    return;
  }
  this.money = money;
}

export function gainMoney(this: PlayerObject, money: number, source: string): void {
  if (isNaN(money)) {
    console.error("NaN passed into Player.gainMoney()");
    return;
  }

  this.money = this.money + money;
  this.recordMoneySource(money, source);
}

export function loseMoney(this: PlayerObject, money: number, source: string): void {
  if (isNaN(money)) {
    console.error("NaN passed into Player.loseMoney()");
    return;
  }
  if (this.money === Infinity && money === Infinity) return;
  this.money = this.money - money;
  this.recordMoneySource(-1 * money, source);
}

export function canAfford(this: IPlayer, cost: number): boolean {
  if (isNaN(cost)) {
    console.error(`NaN passed into Player.canAfford()`);
    return false;
  }
  return this.money >= cost;
}

export function recordMoneySource(this: PlayerObject, amt: number, source: string): void {
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

export function gainHackingExp(this: IPerson, exp: number): void {
  if (isNaN(exp)) {
    console.error("ERR: NaN passed into Player.gainHackingExp()");
    return;
  }
  this.hacking_exp += exp;
  if (this.hacking_exp < 0) {
    this.hacking_exp = 0;
  }

  this.hacking = calculateSkillF(this.hacking_exp, this.mults.hacking * BitNodeMultipliers.HackingLevelMultiplier);
}

export function gainStrengthExp(this: IPerson, exp: number): void {
  if (isNaN(exp)) {
    console.error("ERR: NaN passed into Player.gainStrengthExp()");
    return;
  }
  this.strength_exp += exp;
  if (this.strength_exp < 0) {
    this.strength_exp = 0;
  }

  this.strength = calculateSkillF(this.strength_exp, this.mults.strength * BitNodeMultipliers.StrengthLevelMultiplier);
}

export function gainDefenseExp(this: IPerson, exp: number): void {
  if (isNaN(exp)) {
    console.error("ERR: NaN passed into player.gainDefenseExp()");
    return;
  }
  this.defense_exp += exp;
  if (this.defense_exp < 0) {
    this.defense_exp = 0;
  }

  this.defense = calculateSkillF(this.defense_exp, this.mults.defense * BitNodeMultipliers.DefenseLevelMultiplier);
  const ratio = this.hp / this.max_hp;
  this.max_hp = Math.floor(10 + this.defense / 10);
  this.hp = Math.round(this.max_hp * ratio);
}

export function gainDexterityExp(this: IPerson, exp: number): void {
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
    this.mults.dexterity * BitNodeMultipliers.DexterityLevelMultiplier,
  );
}

export function gainAgilityExp(this: IPerson, exp: number): void {
  if (isNaN(exp)) {
    console.error("ERR: NaN passed into Player.gainAgilityExp()");
    return;
  }
  this.agility_exp += exp;
  if (this.agility_exp < 0) {
    this.agility_exp = 0;
  }

  this.agility = calculateSkillF(this.agility_exp, this.mults.agility * BitNodeMultipliers.AgilityLevelMultiplier);
}

export function gainCharismaExp(this: IPerson, exp: number): void {
  if (isNaN(exp)) {
    console.error("ERR: NaN passed into Player.gainCharismaExp()");
    return;
  }
  this.charisma_exp += exp;
  if (this.charisma_exp < 0) {
    this.charisma_exp = 0;
  }

  this.charisma = calculateSkillF(this.charisma_exp, this.mults.charisma * BitNodeMultipliers.CharismaLevelMultiplier);
}

export function gainIntelligenceExp(this: IPerson, exp: number): void {
  if (isNaN(exp)) {
    console.error("ERROR: NaN passed into Player.gainIntelligenceExp()");
    return;
  }
  if (Player.sourceFileLvl(5) > 0 || this.intelligence > 0) {
    this.intelligence_exp += exp;
    this.intelligence = Math.floor(this.calculateSkill(this.intelligence_exp, 1));
  }
}

export function gainStats(this: IPerson, retValue: ITaskTracker): void {
  this.gainHackingExp(retValue.hack * this.mults.hacking_exp);
  this.gainStrengthExp(retValue.str * this.mults.strength_exp);
  this.gainDefenseExp(retValue.def * this.mults.defense_exp);
  this.gainDexterityExp(retValue.dex * this.mults.dexterity_exp);
  this.gainAgilityExp(retValue.agi * this.mults.agility_exp);
  this.gainCharismaExp(retValue.cha * this.mults.charisma_exp);
  this.gainIntelligenceExp(retValue.int);
}

//Given a string expression like "str" or "strength", returns the given stat
export function queryStatFromString(this: IPlayer, str: string): number {
  const tempStr = str.toLowerCase();
  if (tempStr.includes("hack")) {
    return this.hacking;
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

export function startFocusing(this: IPlayer): void {
  this.focus = true;
}

export function stopFocusing(this: IPlayer): void {
  this.focus = false;
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

export function regenerateHp(this: IPerson, amt: number): void {
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
  SnackbarEvents.emit(`You've been Hospitalized for ${numeralWrapper.formatMoney(cost)}`, ToastVariant.WARNING, 2000);

  this.loseMoney(cost, "hospitalization");
  this.hp = this.max_hp;
  return cost;
}

/********* Company job application **********/
//Determines the job that the Player should get (if any) at the current company
//The 'sing' argument designates whether or not this is being called from
//the applyToCompany() Netscript Singularity function
export function applyForJob(this: IPlayer, entryPosType: CompanyPosition, sing = false): boolean {
  const company = Companies[this.location]; //Company being applied to
  if (!(company instanceof Company)) {
    console.error(`Could not find company that matches the location: ${this.location}. Player.applyToCompany() failed`);
    return false;
  }

  let pos = entryPosType;

  if (!this.isQualified(company, pos)) {
    if (!sing) {
      dialogBoxCreate("Unfortunately, you do not qualify for this position<br>" + getJobRequirementText(company, pos));
    }
    return false;
  }

  if (!company.hasPosition(pos)) {
    console.error(`Company ${company.name} does not have position ${pos}. Player.applyToCompany() failed`);
    return false;
  }

  while (true) {
    const nextPos = getNextCompanyPositionHelper(pos);
    if (nextPos == null) break;
    if (company.hasPosition(nextPos) && this.isQualified(company, nextPos)) {
      pos = nextPos;
    } else break;
  }

  //Check if player already has the assigned job
  if (this.jobs[company.name] === pos.name) {
    if (!sing) {
      const nextPos = getNextCompanyPositionHelper(pos);
      if (nextPos == null || !company.hasPosition(nextPos)) {
        dialogBoxCreate("You are already at the highest position for your field! No promotion available");
      } else {
        const reqText = getJobRequirementText(company, nextPos);
        dialogBoxCreate("Unfortunately, you do not qualify for a promotion<br>" + reqText);
      }
    }
    return false;
  }

  this.jobs[company.name] = pos.name;

  if (!sing) {
    dialogBoxCreate("Congratulations! You were offered a new job at " + company.name + " as a " + pos.name + "!");
  }
  return true;
}

//Returns your next position at a company given the field (software, business, etc.)
export function getNextCompanyPosition(
  this: IPlayer,
  company: Company,
  entryPosType: CompanyPosition,
): CompanyPosition | null {
  const currCompany = Companies[company.name];

  //Not employed at this company, so return the entry position
  if (currCompany == null || currCompany.name != company.name) {
    return entryPosType;
  }

  //If the entry pos type and the player's current position have the same type,
  //return the player's "nextCompanyPosition". Otherwise return the entryposType
  //Employed at this company, so just return the next position if it exists.
  const currentPositionName = this.jobs[company.name];
  if (!currentPositionName) return entryPosType;
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
  if (isCompanyWork(this.currentWork) && this.currentWork.companyName === company) {
    this.finishWork(true);
  }
  delete this.jobs[company];
}

/**
 * Method to see if the player has at least one job assigned to them
 * @param this The player instance
 * @returns Whether the user has at least one job
 */
export function hasJob(this: IPlayer): boolean {
  return Boolean(Object.keys(this.jobs).length);
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
      dialogBoxCreate("Unfortunately, you do not qualify for this position");
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
      dialogBoxCreate("Unfortunately, you do not qualify for this position");
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
      dialogBoxCreate("Unfortunately, you do not qualify for this position");
    }
    return false;
  }
}

export function applyForEmployeeJob(this: IPlayer, sing = false): boolean {
  const company = Companies[this.location]; //Company being applied to
  const position = posNames.MiscCompanyPositions[1];
  // Check if this company has the position
  if (!company.hasPosition(position)) {
    return false;
  }
  if (this.isQualified(company, CompanyPositions[position])) {
    this.jobs[company.name] = position;

    if (!sing) {
      dialogBoxCreate("Congratulations, you are now employed at " + this.location);
    }

    return true;
  } else {
    if (!sing) {
      dialogBoxCreate("Unfortunately, you do not qualify for this position");
    }

    return false;
  }
}

export function applyForPartTimeEmployeeJob(this: IPlayer, sing = false): boolean {
  const company = Companies[this.location]; //Company being applied to
  const position = posNames.PartTimeCompanyPositions[1];
  // Check if this company has the position
  if (!company.hasPosition(position)) {
    return false;
  }
  if (this.isQualified(company, CompanyPositions[position])) {
    this.jobs[company.name] = position;
    if (!sing) {
      dialogBoxCreate("Congratulations, you are now employed part-time at " + this.location);
    }

    return true;
  } else {
    if (!sing) {
      dialogBoxCreate("Unfortunately, you do not qualify for this position");
    }

    return false;
  }
}

export function applyForWaiterJob(this: IPlayer, sing = false): boolean {
  const company = Companies[this.location]; //Company being applied to
  const position = posNames.MiscCompanyPositions[0];
  // Check if this company has the position
  if (!company.hasPosition(position)) {
    return false;
  }
  if (this.isQualified(company, CompanyPositions[position])) {
    this.jobs[company.name] = position;
    if (!sing) {
      dialogBoxCreate("Congratulations, you are now employed as a waiter at " + this.location);
    }
    return true;
  } else {
    if (!sing) {
      dialogBoxCreate("Unfortunately, you do not qualify for this position");
    }
    return false;
  }
}

export function applyForPartTimeWaiterJob(this: IPlayer, sing = false): boolean {
  const company = Companies[this.location]; //Company being applied to
  const position = posNames.PartTimeCompanyPositions[0];
  // Check if this company has the position
  if (!company.hasPosition(position)) {
    return false;
  }
  if (this.isQualified(company, CompanyPositions[position])) {
    this.jobs[company.name] = position;
    if (!sing) {
      dialogBoxCreate("Congratulations, you are now employed as a part-time waiter at " + this.location);
    }
    return true;
  } else {
    if (!sing) {
      dialogBoxCreate("Unfortunately, you do not qualify for this position");
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

  return (
    this.hacking >= reqHacking &&
    this.strength >= reqStrength &&
    this.defense >= reqDefense &&
    this.dexterity >= reqDexterity &&
    this.agility >= reqAgility &&
    this.charisma >= reqCharisma &&
    company.playerReputation >= position.requiredReputation
  );
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

    const playerAug = this.augmentations[i];
    const augName = playerAug.name;

    if (augName == AugmentationNames.NeuroFluxGovernor) {
      for (let j = 0; j < playerAug.level; ++j) {
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
  this.updateSkillLevels();
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
  function checkMegacorpRequirements(companyName: string): boolean {
    const serverMeta = serverMetadata.find((s) => s.specialName === companyName);
    const server = GetServer(serverMeta ? serverMeta.hostname : "");
    const bonus = (server as Server).backdoorInstalled ? -100e3 : 0;
    return (
      allCompanies.includes(companyName) && getCompanyRep(companyName) > CONSTANTS.CorpFactionRepRequirement + bonus
    );
  }

  //Illuminati
  const illuminatiFac = Factions[FactionNames.Illuminati];
  if (
    !illuminatiFac.isBanned &&
    !illuminatiFac.isMember &&
    !illuminatiFac.alreadyInvited &&
    numAugmentations >= 30 &&
    this.money >= 150000000000 &&
    this.hacking >= 1500 &&
    this.strength >= 1200 &&
    this.defense >= 1200 &&
    this.dexterity >= 1200 &&
    this.agility >= 1200
  ) {
    invitedFactions.push(illuminatiFac);
  }

  //Daedalus
  const daedalusFac = Factions[FactionNames.Daedalus];
  if (
    !daedalusFac.isBanned &&
    !daedalusFac.isMember &&
    !daedalusFac.alreadyInvited &&
    numAugmentations >= BitNodeMultipliers.DaedalusAugsRequirement &&
    this.money >= 100000000000 &&
    (this.hacking >= 2500 ||
      (this.strength >= 1500 && this.defense >= 1500 && this.dexterity >= 1500 && this.agility >= 1500))
  ) {
    invitedFactions.push(daedalusFac);
  }

  //The Covenant
  const covenantFac = Factions[FactionNames.TheCovenant];
  if (
    !covenantFac.isBanned &&
    !covenantFac.isMember &&
    !covenantFac.alreadyInvited &&
    numAugmentations >= 20 &&
    this.money >= 75000000000 &&
    this.hacking >= 850 &&
    this.strength >= 850 &&
    this.defense >= 850 &&
    this.dexterity >= 850 &&
    this.agility >= 850
  ) {
    invitedFactions.push(covenantFac);
  }

  //ECorp
  const ecorpFac = Factions[FactionNames.ECorp];
  if (
    !ecorpFac.isBanned &&
    !ecorpFac.isMember &&
    !ecorpFac.alreadyInvited &&
    checkMegacorpRequirements(LocationName.AevumECorp)
  ) {
    invitedFactions.push(ecorpFac);
  }

  //MegaCorp
  const megacorpFac = Factions[FactionNames.MegaCorp];
  if (
    !megacorpFac.isBanned &&
    !megacorpFac.isMember &&
    !megacorpFac.alreadyInvited &&
    checkMegacorpRequirements(LocationName.Sector12MegaCorp)
  ) {
    invitedFactions.push(megacorpFac);
  }

  //Bachman & Associates
  const bachmanandassociatesFac = Factions[FactionNames.BachmanAssociates];
  if (
    !bachmanandassociatesFac.isBanned &&
    !bachmanandassociatesFac.isMember &&
    !bachmanandassociatesFac.alreadyInvited &&
    checkMegacorpRequirements(LocationName.AevumBachmanAndAssociates)
  ) {
    invitedFactions.push(bachmanandassociatesFac);
  }

  //Blade Industries
  const bladeindustriesFac = Factions[FactionNames.BladeIndustries];
  if (
    !bladeindustriesFac.isBanned &&
    !bladeindustriesFac.isMember &&
    !bladeindustriesFac.alreadyInvited &&
    checkMegacorpRequirements(LocationName.Sector12BladeIndustries)
  ) {
    invitedFactions.push(bladeindustriesFac);
  }

  //NWO
  const nwoFac = Factions[FactionNames.NWO];
  if (
    !nwoFac.isBanned &&
    !nwoFac.isMember &&
    !nwoFac.alreadyInvited &&
    checkMegacorpRequirements(LocationName.VolhavenNWO)
  ) {
    invitedFactions.push(nwoFac);
  }

  //Clarke Incorporated
  const clarkeincorporatedFac = Factions[FactionNames.ClarkeIncorporated];
  if (
    !clarkeincorporatedFac.isBanned &&
    !clarkeincorporatedFac.isMember &&
    !clarkeincorporatedFac.alreadyInvited &&
    checkMegacorpRequirements(LocationName.AevumClarkeIncorporated)
  ) {
    invitedFactions.push(clarkeincorporatedFac);
  }

  //OmniTek Incorporated
  const omnitekincorporatedFac = Factions[FactionNames.OmniTekIncorporated];
  if (
    !omnitekincorporatedFac.isBanned &&
    !omnitekincorporatedFac.isMember &&
    !omnitekincorporatedFac.alreadyInvited &&
    checkMegacorpRequirements(LocationName.VolhavenOmniTekIncorporated)
  ) {
    invitedFactions.push(omnitekincorporatedFac);
  }

  //Four Sigma
  const foursigmaFac = Factions[FactionNames.FourSigma];
  if (
    !foursigmaFac.isBanned &&
    !foursigmaFac.isMember &&
    !foursigmaFac.alreadyInvited &&
    checkMegacorpRequirements(LocationName.Sector12FourSigma)
  ) {
    invitedFactions.push(foursigmaFac);
  }

  //KuaiGong International
  const kuaigonginternationalFac = Factions[FactionNames.KuaiGongInternational];
  if (
    !kuaigonginternationalFac.isBanned &&
    !kuaigonginternationalFac.isMember &&
    !kuaigonginternationalFac.alreadyInvited &&
    checkMegacorpRequirements(LocationName.ChongqingKuaiGongInternational)
  ) {
    invitedFactions.push(kuaigonginternationalFac);
  }

  //Fulcrum Secret Technologies - If u've unlocked fulcrum secret technolgoies server and have a high rep with the company
  const fulcrumsecrettechonologiesFac = Factions[FactionNames.FulcrumSecretTechnologies];
  const fulcrumSecretServer = GetServer(SpecialServers.FulcrumSecretTechnologies);
  if (!(fulcrumSecretServer instanceof Server))
    throw new Error(`${FactionNames.FulcrumSecretTechnologies} should be normal server`);
  if (fulcrumSecretServer == null) {
    console.error(`Could not find ${FactionNames.FulcrumSecretTechnologies} Server`);
  } else if (
    !fulcrumsecrettechonologiesFac.isBanned &&
    !fulcrumsecrettechonologiesFac.isMember &&
    !fulcrumsecrettechonologiesFac.alreadyInvited &&
    fulcrumSecretServer.backdoorInstalled &&
    checkMegacorpRequirements(LocationName.AevumFulcrumTechnologies)
  ) {
    invitedFactions.push(fulcrumsecrettechonologiesFac);
  }

  //BitRunners
  const bitrunnersFac = Factions[FactionNames.BitRunners];
  const bitrunnersServer = GetServer(SpecialServers.BitRunnersServer);
  if (!(bitrunnersServer instanceof Server)) throw new Error(`${FactionNames.BitRunners} should be normal server`);
  if (bitrunnersServer == null) {
    console.error(`Could not find ${FactionNames.BitRunners} Server`);
  } else if (
    !bitrunnersFac.isBanned &&
    !bitrunnersFac.isMember &&
    bitrunnersServer.backdoorInstalled &&
    !bitrunnersFac.alreadyInvited
  ) {
    invitedFactions.push(bitrunnersFac);
  }

  //The Black Hand

  const theblackhandFac = Factions[FactionNames.TheBlackHand];
  const blackhandServer = GetServer(SpecialServers.TheBlackHandServer);
  if (!(blackhandServer instanceof Server)) throw new Error(`${FactionNames.TheBlackHand} should be normal server`);
  if (blackhandServer == null) {
    console.error(`Could not find ${FactionNames.TheBlackHand} Server`);
  } else if (
    !theblackhandFac.isBanned &&
    !theblackhandFac.isMember &&
    blackhandServer.backdoorInstalled &&
    !theblackhandFac.alreadyInvited
  ) {
    invitedFactions.push(theblackhandFac);
  }

  //NiteSec
  const nitesecFac = Factions[FactionNames.NiteSec];
  const nitesecServer = GetServer(SpecialServers.NiteSecServer);
  if (!(nitesecServer instanceof Server)) throw new Error(`${FactionNames.NiteSec} should be normal server`);
  if (nitesecServer == null) {
    console.error(`Could not find ${FactionNames.NiteSec} Server`);
  } else if (
    !nitesecFac.isBanned &&
    !nitesecFac.isMember &&
    nitesecServer.backdoorInstalled &&
    !nitesecFac.alreadyInvited
  ) {
    invitedFactions.push(nitesecFac);
  }

  //Chongqing
  const chongqingFac = Factions[FactionNames.Chongqing];
  if (
    !chongqingFac.isBanned &&
    !chongqingFac.isMember &&
    !chongqingFac.alreadyInvited &&
    this.money >= 20000000 &&
    this.city == CityName.Chongqing
  ) {
    invitedFactions.push(chongqingFac);
  }

  //Sector-12
  const sector12Fac = Factions[FactionNames.Sector12];
  if (
    !sector12Fac.isBanned &&
    !sector12Fac.isMember &&
    !sector12Fac.alreadyInvited &&
    this.money >= 15000000 &&
    this.city == CityName.Sector12
  ) {
    invitedFactions.push(sector12Fac);
  }

  //New Tokyo
  const newtokyoFac = Factions[FactionNames.NewTokyo];
  if (
    !newtokyoFac.isBanned &&
    !newtokyoFac.isMember &&
    !newtokyoFac.alreadyInvited &&
    this.money >= 20000000 &&
    this.city == CityName.NewTokyo
  ) {
    invitedFactions.push(newtokyoFac);
  }

  //Aevum
  const aevumFac = Factions[FactionNames.Aevum];
  if (
    !aevumFac.isBanned &&
    !aevumFac.isMember &&
    !aevumFac.alreadyInvited &&
    this.money >= 40000000 &&
    this.city == CityName.Aevum
  ) {
    invitedFactions.push(aevumFac);
  }

  //Ishima
  const ishimaFac = Factions[FactionNames.Ishima];
  if (
    !ishimaFac.isBanned &&
    !ishimaFac.isMember &&
    !ishimaFac.alreadyInvited &&
    this.money >= 30000000 &&
    this.city == CityName.Ishima
  ) {
    invitedFactions.push(ishimaFac);
  }

  //Volhaven
  const volhavenFac = Factions[FactionNames.Volhaven];
  if (
    !volhavenFac.isBanned &&
    !volhavenFac.isMember &&
    !volhavenFac.alreadyInvited &&
    this.money >= 50000000 &&
    this.city == CityName.Volhaven
  ) {
    invitedFactions.push(volhavenFac);
  }

  //Speakers for the Dead
  const speakersforthedeadFac = Factions[FactionNames.SpeakersForTheDead];
  if (
    !speakersforthedeadFac.isBanned &&
    !speakersforthedeadFac.isMember &&
    !speakersforthedeadFac.alreadyInvited &&
    this.hacking >= 100 &&
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
  const thedarkarmyFac = Factions[FactionNames.TheDarkArmy];
  if (
    !thedarkarmyFac.isBanned &&
    !thedarkarmyFac.isMember &&
    !thedarkarmyFac.alreadyInvited &&
    this.hacking >= 300 &&
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
  const thesyndicateFac = Factions[FactionNames.TheSyndicate];
  if (
    !thesyndicateFac.isBanned &&
    !thesyndicateFac.isMember &&
    !thesyndicateFac.alreadyInvited &&
    this.hacking >= 200 &&
    this.strength >= 200 &&
    this.defense >= 200 &&
    this.dexterity >= 200 &&
    this.agility >= 200 &&
    (this.city == CityName.Aevum || this.city == CityName.Sector12) &&
    this.money >= 10000000 &&
    this.karma <= -90 &&
    !allCompanies.includes(LocationName.Sector12CIA) &&
    !allCompanies.includes(LocationName.Sector12NSA)
  ) {
    invitedFactions.push(thesyndicateFac);
  }

  //Silhouette
  const silhouetteFac = Factions[FactionNames.Silhouette];
  if (
    !silhouetteFac.isBanned &&
    !silhouetteFac.isMember &&
    !silhouetteFac.alreadyInvited &&
    (allPositions.includes("Chief Technology Officer") ||
      allPositions.includes("Chief Financial Officer") ||
      allPositions.includes("Chief Executive Officer")) &&
    this.money >= 15000000 &&
    this.karma <= -22
  ) {
    invitedFactions.push(silhouetteFac);
  }

  //Tetrads
  const tetradsFac = Factions[FactionNames.Tetrads];
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
  const slumsnakesFac = Factions[FactionNames.SlumSnakes];
  if (
    !slumsnakesFac.isBanned &&
    !slumsnakesFac.isMember &&
    !slumsnakesFac.alreadyInvited &&
    this.strength >= 30 &&
    this.defense >= 30 &&
    this.dexterity >= 30 &&
    this.agility >= 30 &&
    this.karma <= -9 &&
    this.money >= 1000000
  ) {
    invitedFactions.push(slumsnakesFac);
  }

  //Netburners
  const netburnersFac = Factions[FactionNames.Netburners];
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
    this.hacking >= 80 &&
    totalHacknetRam >= 8 &&
    totalHacknetCores >= 4 &&
    totalHacknetLevels >= 100
  ) {
    invitedFactions.push(netburnersFac);
  }

  //Tian Di Hui
  const tiandihuiFac = Factions[FactionNames.TianDiHui];
  if (
    !tiandihuiFac.isBanned &&
    !tiandihuiFac.isMember &&
    !tiandihuiFac.alreadyInvited &&
    this.money >= 1000000 &&
    this.hacking >= 50 &&
    (this.city == CityName.Chongqing || this.city == CityName.NewTokyo || this.city == CityName.Ishima)
  ) {
    invitedFactions.push(tiandihuiFac);
  }

  //CyberSec
  const cybersecFac = Factions[FactionNames.CyberSec];
  const cybersecServer = GetServer(SpecialServers.CyberSecServer);
  if (!(cybersecServer instanceof Server)) throw new Error(`${FactionNames.CyberSec} should be normal server`);
  if (cybersecServer == null) {
    console.error(`Could not find ${FactionNames.CyberSec} Server`);
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
  for (const aug of this.queuedAugmentations) {
    if (aug.name == name) {
      console.warn(`tried to queue ${name} twice, this may be a bug`);
      return;
    }
  }

  for (const aug of this.augmentations) {
    if (aug.name == name) {
      console.warn(`tried to queue ${name} twice, this may be a bug`);
      return;
    }
  }

  this.queuedAugmentations.push(new PlayerOwnedAugmentation(name));
}

/************* Coding Contracts **************/
export function gainCodingContractReward(this: IPlayer, reward: ICodingContractReward, difficulty = 1): string {
  if (reward == null || reward.type == null) {
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
      const specialFactions = [FactionNames.Bladeburners as string];
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
      this.gainMoney(moneyGain, "codingcontract");
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

export function canAccessGrafting(this: IPlayer): boolean {
  return this.bitNodeN === 10 || this.sourceFileLvl(10) > 0;
}

export function giveExploit(this: IPlayer, exploit: Exploit): void {
  if (!this.exploits.includes(exploit)) {
    this.exploits.push(exploit);
    SnackbarEvents.emit("SF -1 acquired!", ToastVariant.SUCCESS, 2000);
  }
}

export function giveAchievement(this: IPlayer, achievementId: string): void {
  const achievement = achievements[achievementId];
  if (!achievement) return;
  if (!this.achievements.map((a) => a.ID).includes(achievementId)) {
    this.achievements.push({ ID: achievementId, unlockedOn: new Date().getTime() });
    SnackbarEvents.emit(`Unlocked Achievement: "${achievement.Name}"`, ToastVariant.SUCCESS, 2000);
  }
}

export function getIntelligenceBonus(this: IPlayer, weight: number): number {
  return calculateIntelligenceBonus(this.intelligence, weight);
}

export function getCasinoWinnings(this: IPlayer): number {
  return this.moneySourceA.casino;
}

export function canAccessCotMG(this: IPlayer): boolean {
  return this.bitNodeN === 13 || this.sourceFileLvl(13) > 0;
}

export function sourceFileLvl(this: IPlayer, n: number): number {
  const sf = this.sourceFiles.find((sf) => sf.n === n);
  if (!sf) return 0;
  return sf.lvl;
}

export function focusPenalty(this: IPlayer): number {
  let focus = 1;
  if (!this.hasAugmentation(AugmentationNames["NeuroreceptorManager"])) {
    focus = this.focus ? 1 : CONSTANTS.BaseFocusBonus;
  }
  return focus;
}
