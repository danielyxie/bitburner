import React from "react";
import { applyAugmentation } from "../../Augmentation/AugmentationHelpers";
import { AugmentationNames } from "../../Augmentation/data/AugmentationNames";
import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";
import { Companies } from "../../Company/Companies";
import { CompanyPositions } from "../../Company/CompanyPositions";
import { CONSTANTS } from "../../Constants";
import { determineCrimeSuccess } from "../../Crime/CrimeHelpers";
import { Crimes } from "../../Crime/Crimes";
import { Faction } from "../../Faction/Faction";
import { Factions } from "../../Faction/Factions";
import { LocationName } from "../../Locations/data/LocationNames";
import { Locations } from "../../Locations/Locations";
import { WorkerScript } from "../../Netscript/WorkerScript";
import { GetServer } from "../../Server/AllServers";
import { serverMetadata } from "../../Server/data/servers";
import { Server } from "../../Server/Server";
import { influenceStockThroughCompanyWork } from "../../StockMarket/PlayerInfluencing";
import { numeralWrapper } from "../../ui/numeralFormat";
import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { Money } from "../../ui/React/Money";
import { Reputation } from "../../ui/React/Reputation";
import { IRouter } from "../../ui/Router";
import { convertTimeMsToTimeElapsedString } from "../../utils/StringHelperFunctions";
import {
  CreateProgramWorkInfo,
  FactionWorkInfo,
  GraftAugmentationWorkInfo,
  StudyClassWorkInfo,
} from "../../Work/WorkInfo";
import { ClassType, CrimeType, PlayerFactionWorkType, WorkType } from "../../Work/WorkType";
import {
  getFactionFieldWorkRepGain,
  getFactionSecurityWorkRepGain,
  getHackingWorkRepGain,
} from "../formulas/reputation";
import { calculateClassEarnings } from "../formulas/work";
import { graftingIntBonus } from "../Grafting/GraftingHelpers";
import { IPlayer } from "../IPlayer";

/******* Working functions *******/
export function resetWorkStatus(this: IPlayer, generalType?: WorkType, group?: string, workType?: string): void {
  if (this.workType !== WorkType.Faction && generalType === this.workType && group === this.companyName) return;
  if (generalType === this.workType && group === this.currentWorkFactionName && workType === this.factionWorkType)
    return;
  if (this.isWorking) this.singularityStopWork();

  this.workData = {
    type: WorkType.None,
    timeWorked: 0,
    timeToCompletion: 0,
    info: null,
    gains: {
      hackExp: 0,
      strExp: 0,
      defExp: 0,
      dexExp: 0,
      agiExp: 0,
      chaExp: 0,
      rep: 0,
      money: 0,
    },
    rates: {
      hackExp: 0,
      strExp: 0,
      defExp: 0,
      dexExp: 0,
      agiExp: 0,
      chaExp: 0,
      rep: 0,
      money: 0,
      moneyLoss: 0,
    },
  };

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
  this.timeWorkedGraftAugmentation = 0;

  this.currentWorkFactionName = "";
  this.currentWorkFactionDescription = "";
  this.createProgramName = "";
  this.graftAugmentationName = "";
  this.className = ClassType.None;
  this.workType = WorkType.None;
}

export function processWorkEarnings(this: IPlayer, numCycles = 1): void {
  let focusBonus = 1;
  if (!this.hasAugmentation(AugmentationNames["NeuroreceptorManager"])) {
    focusBonus = this.focus ? 1 : CONSTANTS.BaseFocusBonus;
  }

  const rates = this.workData.rates;

  const hackExpGain = focusBonus * rates.hackExp * numCycles;
  const strExpGain = focusBonus * rates.strExp * numCycles;
  const defExpGain = focusBonus * rates.defExp * numCycles;
  const dexExpGain = focusBonus * rates.dexExp * numCycles;
  const agiExpGain = focusBonus * rates.agiExp * numCycles;
  const chaExpGain = focusBonus * rates.chaExp * numCycles;
  const moneyGain = (rates.money - rates.moneyLoss) * numCycles;
  this.gainHackingExp(hackExpGain);
  this.gainStrengthExp(strExpGain);
  this.gainDefenseExp(defExpGain);
  this.gainDexterityExp(dexExpGain);
  this.gainAgilityExp(agiExpGain);
  this.gainCharismaExp(chaExpGain);
  this.gainMoney(moneyGain, this.workData.type === WorkType.StudyClass ? "class" : "work");

  this.workData.gains = {
    hackExp: this.workData.gains.hackExp + hackExpGain,
    strExp: this.workData.gains.strExp + strExpGain,
    defExp: this.workData.gains.defExp + defExpGain,
    dexExp: this.workData.gains.dexExp + dexExpGain,
    agiExp: this.workData.gains.agiExp + agiExpGain,
    chaExp: this.workData.gains.chaExp + chaExpGain,
    money: this.workData.gains.money + focusBonus * (rates.money * numCycles - rates.moneyLoss * numCycles),
    rep: this.workData.gains.rep + focusBonus * this.workRepGainRate * numCycles,
  };
}

/* Working for Company */
export function startWork(this: IPlayer, companyName: string): void {
  this.resetWorkStatus(WorkType.Company, companyName);
  this.isWorking = true;

  this.workData = {
    type: WorkType.Company,
    timeToCompletion: CONSTANTS.MillisecondsPer8Hours,
    timeWorked: 0,

    info: {
      companyName: companyName,
    },

    rates: {
      hackExp: this.getWorkHackExpGain(),
      strExp: this.getWorkStrExpGain(),
      defExp: this.getWorkDefExpGain(),
      dexExp: this.getWorkDexExpGain(),
      agiExp: this.getWorkAgiExpGain(),
      chaExp: this.getWorkChaExpGain(),
      rep: this.getWorkRepGain(),
      money: this.getWorkMoneyGain(),
      moneyLoss: 0,
    },
    gains: this.workData.gains,
  };
}

export function process(this: IPlayer, router: IRouter, numCycles = 1): void {
  // Working
  if (this.isWorking) {
    switch (this.workManager.workType) {
      case WorkType.Faction:
        if (this.workManager.process(numCycles)) {
          router.toFaction(Factions[(this.workData.info as FactionWorkInfo).factionName]);
        }
        break;
      case WorkType.CreateProgram:
        if (this.workManager.process(numCycles)) {
          router.toFaction(Factions[this.currentWorkFactionName]);
        }
        break;
      case WorkType.StudyClass:
        if (this.workManager.process(numCycles)) {
          router.toCity();
        }
        break;
      case WorkType.Crime:
        if (this.workManager.process(numCycles)) {
          router.toLocation(Locations[LocationName.Slums]);
        }
        break;
      case WorkType.CompanyPartTime:
        if (this.workManager.process(numCycles)) {
          router.toCity();
        }
        break;
      case WorkType.GraftAugmentation:
        if (this.workManager.process(numCycles)) {
          router.toGrafting();
        }
        break;
      case WorkType.Company:
        if (this.workManager.process(numCycles)) {
          router.toCity();
        }
        break;
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
  this.workMoneyGainRate = this.getWorkMoneyGain();
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

  const penaltyString = this.cancelationPenalty() === 0.5 ? "half" : "three-quarters";

  const company = Companies[this.companyName];
  company.playerReputation += this.workRepGained;

  this.updateSkillLevels();

  let content = (
    <>
      You earned a total of: <br />
      <Money money={this.workMoneyGained} />
      <br />
      <Reputation reputation={this.workRepGained} /> reputation for the company <br />
      {this.workHackExpGained > 0 && (
        <>
          {numeralWrapper.formatExp(this.workHackExpGained)} hacking exp <br />
        </>
      )}
      {this.workStrExpGained > 0 && (
        <>
          {numeralWrapper.formatExp(this.workStrExpGained)} strength exp <br />
        </>
      )}
      {this.workDefExpGained > 0 && (
        <>
          {numeralWrapper.formatExp(this.workDefExpGained)} defense exp <br />
        </>
      )}
      {this.workDexExpGained > 0 && (
        <>
          {numeralWrapper.formatExp(this.workDexExpGained)} dexterity exp <br />
        </>
      )}
      {this.workAgiExpGained > 0 && (
        <>
          {numeralWrapper.formatExp(this.workAgiExpGained)} agility exp <br />
        </>
      )}
      {this.workChaExpGained > 0 && (
        <>
          {numeralWrapper.formatExp(this.workChaExpGained)} charisma exp <br />
        </>
      )}
      <br />
    </>
  );

  if (cancelled) {
    content = (
      <>
        You worked a short shift of {convertTimeMsToTimeElapsedString(this.timeWorked)} <br />
        <br />
        Since you cancelled your work early, you only gained {penaltyString} of the reputation you earned. <br />
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
  this.focus = false;

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

export function startWorkPartTime(this: IPlayer, companyName: string): void {
  this.resetWorkStatus(WorkType.CompanyPartTime, companyName);
  this.isWorking = true;
  this.companyName = companyName;
  this.workType = WorkType.CompanyPartTime;

  this.workHackExpGainRate = this.getWorkHackExpGain();
  this.workStrExpGainRate = this.getWorkStrExpGain();
  this.workDefExpGainRate = this.getWorkDefExpGain();
  this.workDexExpGainRate = this.getWorkDexExpGain();
  this.workAgiExpGainRate = this.getWorkAgiExpGain();
  this.workChaExpGainRate = this.getWorkChaExpGain();
  this.workRepGainRate = this.getWorkRepGain();
  this.workMoneyGainRate = this.getWorkMoneyGain();

  this.timeNeededToCompleteWork = CONSTANTS.MillisecondsPer8Hours;
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
export function startFactionWork(this: IPlayer, faction: Faction): void {
  //Update reputation gain rate to account for faction favor
  let favorMult = 1 + faction.favor / 100;
  if (isNaN(favorMult)) {
    favorMult = 1;
  }
  this.workRepGainRate *= favorMult;
  this.workRepGainRate *= BitNodeMultipliers.FactionWorkRepGain;

  this.isWorking = true;
  this.workType = WorkType.Faction;
  this.currentWorkFactionName = faction.name;

  this.timeNeededToCompleteWork = CONSTANTS.MillisecondsPer20Hours;
}

export function startFactionHackWork(this: IPlayer, faction: Faction): void {
  this.resetWorkStatus(WorkType.Faction, faction.name, PlayerFactionWorkType.Hacking);

  this.workHackExpGainRate = 0.15 * this.hacking_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
  this.workRepGainRate = getHackingWorkRepGain(this, faction);

  this.factionWorkType = PlayerFactionWorkType.Hacking;
  this.currentWorkFactionDescription = "carrying out hacking contracts";

  this.startFactionWork(faction);
}

export function startFactionFieldWork(this: IPlayer, faction: Faction): void {
  this.resetWorkStatus(WorkType.Faction, faction.name, PlayerFactionWorkType.Field);

  this.workHackExpGainRate = 0.1 * this.hacking_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
  this.workStrExpGainRate = 0.1 * this.strength_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
  this.workDefExpGainRate = 0.1 * this.defense_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
  this.workDexExpGainRate = 0.1 * this.dexterity_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
  this.workAgiExpGainRate = 0.1 * this.agility_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
  this.workChaExpGainRate = 0.1 * this.charisma_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
  this.workRepGainRate = getFactionFieldWorkRepGain(this, faction);

  this.factionWorkType = PlayerFactionWorkType.Field;
  this.currentWorkFactionDescription = "carrying out field missions";

  this.startFactionWork(faction);
}

export function startFactionSecurityWork(this: IPlayer, faction: Faction): void {
  this.resetWorkStatus(WorkType.Faction, faction.name, PlayerFactionWorkType.Security);

  this.workHackExpGainRate = 0.05 * this.hacking_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
  this.workStrExpGainRate = 0.15 * this.strength_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
  this.workDefExpGainRate = 0.15 * this.defense_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
  this.workDexExpGainRate = 0.15 * this.dexterity_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
  this.workAgiExpGainRate = 0.15 * this.agility_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
  this.workChaExpGainRate = 0.0 * this.charisma_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
  this.workRepGainRate = getFactionSecurityWorkRepGain(this, faction);

  this.factionWorkType = PlayerFactionWorkType.Security;
  this.currentWorkFactionDescription = "performing security detail";

  this.startFactionWork(faction);
}

export function workForFaction(this: IPlayer, numCycles: number): boolean {
  const faction = Factions[this.currentWorkFactionName];

  if (!faction) {
    return false;
  }

  //Constantly update the rep gain rate
  switch (this.factionWorkType) {
    case PlayerFactionWorkType.Hacking:
      this.workRepGainRate = getHackingWorkRepGain(this, faction);
      break;
    case PlayerFactionWorkType.Field:
      this.workRepGainRate = getFactionFieldWorkRepGain(this, faction);
      break;
    case PlayerFactionWorkType.Security:
      this.workRepGainRate = getFactionSecurityWorkRepGain(this, faction);
      break;
    default:
      break;
  }
  this.workRepGainRate *= BitNodeMultipliers.FactionWorkRepGain;

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
  if (this.sourceFileLvl(11) > 0) {
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
    this.hacking,
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
//     var t = 0.9 * (this.hacking  / CONSTANTS.MaxSkillLevel +
//                    this.strength       / CONSTANTS.MaxSkillLevel +
//                    this.defense        / CONSTANTS.MaxSkillLevel +
//                    this.dexterity      / CONSTANTS.MaxSkillLevel +
//                    this.agility        / CONSTANTS.MaxSkillLevel) / 4.5;
//     return t * this.faction_rep_mult;
// }

// export function getFactionFieldWorkRepGain(this: IPlayer) {
//     var t = 0.9 * (this.hacking  / CONSTANTS.MaxSkillLevel +
//                    this.strength       / CONSTANTS.MaxSkillLevel +
//                    this.defense        / CONSTANTS.MaxSkillLevel +
//                    this.dexterity      / CONSTANTS.MaxSkillLevel +
//                    this.agility        / CONSTANTS.MaxSkillLevel +
//                    this.charisma       / CONSTANTS.MaxSkillLevel +
//                    this.intelligence   / CONSTANTS.MaxSkillLevel) / 5.5;
//     return t * this.faction_rep_mult;
// }

/* Creating a Program */
export function startCreateProgramWork(this: IPlayer, programName: string, time: number, reqLevel: number): void {
  this.resetWorkStatus();
  this.isWorking = true;
  this.workType = WorkType.CreateProgram;

  //Time needed to complete work affected by hacking skill (linearly based on
  //ratio of (your skill - required level) to MAX skill)
  //var timeMultiplier = (CONSTANTS.MaxSkillLevel - (this.hacking - reqLevel)) / CONSTANTS.MaxSkillLevel;
  //if (timeMultiplier > 1) {timeMultiplier = 1;}
  //if (timeMultiplier < 0.01) {timeMultiplier = 0.01;}

  let timeWorkedCreateProgram = 0;
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
      timeWorkedCreateProgram = (percComplete / 100) * time;
      this.getHomeComputer().programs.splice(i, 1);
    }
  }

  this.workData = {
    type: WorkType.CreateProgram,
    timeToCompletion: time,
    timeWorked: 0,

    info: {
      programName,
      requiredLevel: reqLevel,
      timeWorked: timeWorkedCreateProgram,
    },

    gains: this.workData.gains,
    rates: this.workData.rates,
  };
}

export function createProgramWork(this: IPlayer, numCycles: number): boolean {
  let focusBonus = 1;
  if (!this.hasAugmentation(AugmentationNames["NeuroreceptorManager"])) {
    focusBonus = this.focus ? 1 : CONSTANTS.BaseFocusBonus;
  }

  const workInfo = this.workData.info as CreateProgramWorkInfo;

  //Higher hacking skill will allow you to create programs faster
  const reqLvl = workInfo.requiredLevel;
  let skillMult = (this.hacking / reqLvl) * this.getIntelligenceBonus(3); //This should always be greater than 1;
  skillMult = 1 + (skillMult - 1) / 5; //The divider constant can be adjusted as necessary
  skillMult *= focusBonus;
  //Skill multiplier directly applied to "time worked"
  this.workData.timeWorked += CONSTANTS._idleSpeed * numCycles;
  workInfo.timeWorked += CONSTANTS._idleSpeed * numCycles * skillMult;

  if (workInfo.timeWorked >= this.workData.timeToCompletion) {
    this.finishCreateProgramWork(false);
    return true;
  }
  return false;
}

export function finishCreateProgramWork(this: IPlayer, cancelled: boolean): string {
  const workInfo = this.workData.info as CreateProgramWorkInfo;

  const programName = workInfo.programName;
  if (!cancelled) {
    //Complete case
    this.gainIntelligenceExp((CONSTANTS.IntelligenceProgramBaseExpGain * this.workData.timeWorked) / 1000);
    dialogBoxCreate(`You've finished creating ${programName}!<br>The new program can be found on your home computer.`);

    if (!this.getHomeComputer().programs.includes(programName)) {
      this.getHomeComputer().programs.push(programName);
    }
  } else if (!this.getHomeComputer().programs.includes(programName)) {
    //Incomplete case
    const perc = (Math.floor((workInfo.timeWorked / this.workData.timeToCompletion) * 10000) / 100).toString();
    const incompleteName = programName + "-" + perc + "%-INC";
    this.getHomeComputer().programs.push(incompleteName);
  }

  this.isWorking = false;

  this.resetWorkStatus();
  return "You've finished creating " + programName + "! The new program can be found on your home computer.";
}

export function startGraftAugmentationWork(this: IPlayer, augmentationName: string, time: number): void {
  this.resetWorkStatus();
  this.isWorking = true;
  this.workType = WorkType.GraftAugmentation;

  this.workData = {
    type: WorkType.GraftAugmentation,
    timeToCompletion: time,
    timeWorked: 0,

    info: {
      augmentation: augmentationName,
      timeWorked: 0,
    },

    gains: this.workData.gains,
    rates: this.workData.rates,
  };
}

export function graftAugmentationWork(this: IPlayer, numCycles: number): boolean {
  const workInfo = this.workData.info as GraftAugmentationWorkInfo;

  let focusBonus = 1;
  if (!this.hasAugmentation(AugmentationNames.NeuroreceptorManager)) {
    focusBonus = this.focus ? 1 : CONSTANTS.BaseFocusBonus;
  }

  let skillMult = graftingIntBonus(this);
  skillMult *= focusBonus;

  this.workData.timeWorked += CONSTANTS._idleSpeed * numCycles;
  workInfo.timeWorked += CONSTANTS._idleSpeed * numCycles * skillMult;

  if (workInfo.timeWorked >= this.workData.timeToCompletion) {
    this.finishGraftAugmentationWork(false);
    return true;
  }
  return false;
}

export function finishGraftAugmentationWork(this: IPlayer, cancelled: boolean, singularity = false): string {
  const workInfo = this.workData.info as GraftAugmentationWorkInfo;

  const augName = workInfo.augmentation;
  if (cancelled === false) {
    applyAugmentation({ name: augName, level: 1 });

    if (!this.hasAugmentation(AugmentationNames.CongruityImplant)) {
      this.entropy += 1;
      this.applyEntropy(this.entropy);
    }

    dialogBoxCreate(
      `You've finished grafting ${augName}.<br>The augmentation has been applied to your body` +
        (this.hasAugmentation(AugmentationNames.CongruityImplant) ? "." : ", but you feel a bit off."),
    );
  } else if (cancelled && singularity === false) {
    dialogBoxCreate(`You cancelled the grafting of ${augName}.<br>Your money was not returned to you.`);
  }

  // Intelligence gain
  if (!cancelled) {
    this.gainIntelligenceExp((CONSTANTS.IntelligenceGraftBaseExpGain * this.workData.timeWorked) / 10000);
  }

  this.isWorking = false;
  this.resetWorkStatus();
  return `Grafting of ${augName} has ended.`;
}

/* Studying/Taking Classes */
export function startClass(this: IPlayer, costMult: number, expMult: number, className: ClassType): void {
  this.resetWorkStatus();
  this.isWorking = true;
  this.workType = WorkType.StudyClass;
  this.workCostMult = costMult;
  this.workExpMult = expMult;

  this.workData = {
    type: WorkType.StudyClass,
    timeWorked: 0,
    timeToCompletion: 0,

    info: {
      className: className,
    },
    rates: this.workData.rates,
    gains: this.workData.gains,
  };

  const earnings = calculateClassEarnings(this);

  Object.assign(this.workData.rates, earnings);
}

export function takeClass(this: IPlayer, numCycles: number): boolean {
  this.workData.timeWorked += CONSTANTS._idleSpeed * numCycles;
  const earnings = calculateClassEarnings(this);
  Object.assign(this.workData.rates, earnings);

  this.processWorkEarnings(numCycles);
  return false;
}

//The 'sing' argument defines whether or not this function was called
//through a Singularity Netscript function
export function finishClass(this: IPlayer, sing = false): string {
  const gains = this.workData.gains,
    workInfo = this.workData.info as StudyClassWorkInfo;

  this.gainIntelligenceExp(CONSTANTS.IntelligenceClassBaseExpGain * Math.round(this.workData.timeWorked / 1000));

  if (gains.money > 0) {
    throw new Error("ERR: Somehow gained money while taking class");
  }

  this.updateSkillLevels();
  if (!sing) {
    dialogBoxCreate(
      <>
        After {workInfo.className} for {convertTimeMsToTimeElapsedString(this.workData.timeWorked)}, <br />
        you spent a total of <Money money={-this.workMoneyGained} />. <br />
        <br />
        You earned a total of: <br />
        {numeralWrapper.formatExp(gains.hackExp)} hacking exp <br />
        {numeralWrapper.formatExp(gains.strExp)} strength exp <br />
        {numeralWrapper.formatExp(gains.defExp)} defense exp <br />
        {numeralWrapper.formatExp(gains.dexExp)} dexterity exp <br />
        {numeralWrapper.formatExp(gains.agiExp)} agility exp <br />
        {numeralWrapper.formatExp(gains.chaExp)} charisma exp
        <br />
      </>,
    );
  }

  this.isWorking = false;

  if (sing) {
    const res =
      "After " +
      workInfo.className +
      " for " +
      convertTimeMsToTimeElapsedString(this.workData.timeWorked) +
      ", " +
      "you spent a total of " +
      numeralWrapper.formatMoney(gains.money * -1) +
      ". " +
      "You earned a total of: " +
      numeralWrapper.formatExp(gains.hackExp) +
      " hacking exp, " +
      numeralWrapper.formatExp(gains.strExp) +
      " strength exp, " +
      numeralWrapper.formatExp(gains.defExp) +
      " defense exp, " +
      numeralWrapper.formatExp(gains.dexExp) +
      " dexterity exp, " +
      numeralWrapper.formatExp(gains.agiExp) +
      " agility exp, and " +
      numeralWrapper.formatExp(gains.chaExp) +
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
  crimeType: CrimeType,
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
  this.workType = WorkType.Crime;

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
      for (const i of Object.keys(Crimes)) {
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
      this.gainMoney(this.workMoneyGained, "crime");
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
            "SUCCESS: Crime successful! Gained " +
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
            "FAIL: Crime failed! Gained " +
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
  this.crimeType = CrimeType.None;
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
    case WorkType.StudyClass:
      res = this.finishClass(true);
      break;
    case WorkType.Company:
      res = this.finishWork(true, true);
      break;
    case WorkType.CompanyPartTime:
      res = this.finishWorkPartTime(true);
      break;
    case WorkType.Faction:
      res = this.finishFactionWork(true, true);
      break;
    case WorkType.CreateProgram:
      res = this.finishCreateProgramWork(true);
      break;
    case WorkType.Crime:
      res = this.finishCrime(true);
      break;
    case WorkType.GraftAugmentation:
      res = this.finishGraftAugmentationWork(true, true);
      break;
    default:
      console.error(`Unrecognized work type (${this.workType})`);
      return "";
  }
  return res;
}
