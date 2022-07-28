/**
 * Sleeves are bodies that contain the player's cloned consciousness.
 * The player can use these bodies to perform different tasks synchronously.
 *
 * Each sleeve is its own individual, meaning it has its own stats/exp
 *
 * Sleeves are unlocked in BitNode-10.
 */
import { SleeveTaskType } from "./SleeveTaskTypesEnum";

import { IPlayer } from "../IPlayer";
import { Person } from "../Person";
import { ITaskTracker, createTaskTracker } from "../ITaskTracker";

import { Augmentation } from "../../Augmentation/Augmentation";

import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";

import { Crime } from "../../Crime/Crime";
import { Crimes } from "../../Crime/Crimes";

import { Companies } from "../../Company/Companies";
import { Company } from "../../Company/Company";
import { CompanyPosition } from "../../Company/CompanyPosition";
import { CompanyPositions } from "../../Company/CompanyPositions";

import { CONSTANTS } from "../../Constants";

import { Faction } from "../../Faction/Faction";
import { Factions } from "../../Faction/Factions";

import { CityName } from "../../Locations/data/CityNames";
import { LocationName } from "../../Locations/data/LocationNames";

import { Generic_fromJSON, Generic_toJSON, IReviverValue, Reviver } from "../../utils/JSONReviver";
import { BladeburnerConstants } from "../../Bladeburner/data/Constants";
import { numeralWrapper } from "../../ui/numeralFormat";
import { capitalizeFirstLetter, capitalizeEachWord } from "../../utils/StringHelperFunctions";
import { FactionWorkType } from "../../Work/data/FactionWorkType";
import { Work } from "./Work/Work";
import { SleeveClassWork } from "./Work/SleeveClassWork";
import { ClassType } from "../../Work/ClassWork";
import { SleeveSynchroWork } from "./Work/SleeveSynchroWork";
import { SleeveRecoveryWork } from "./Work/SleeveRecoveryWork";
import { SleeveFactionWork } from "./Work/SleeveFactionWork";
import { SleeveCompanyWork } from "./Work/SleeveCompanyWork";
import { SleeveBladeburnerGeneralWork } from "./Work/SleeveBladeburnerGeneralActionWork";
import { SleeveInfiltrateWork } from "./Work/SleeveInfiltrateWork";

export class Sleeve extends Person {
  currentWork: Work | null = null;
  /**
   * Stores the name of the class that the player is currently taking
   */
  className = "";

  /**
   * Stores the type of crime the sleeve is currently attempting
   * Must match the name of a Crime object
   */
  crimeType = "";

  /**
   * Enum value for current task
   */
  currentTask: SleeveTaskType = SleeveTaskType.Idle;

  /**
   * Contains details about the sleeve's current task. The info stored
   * in this depends on the task type
   *
   * Faction/Company Work: Name of Faction/Company
   * Crime: Money earned if successful
   * Class/Gym: Name of university/gym
   * Bladeburner: success chance
   */
  currentTaskLocation = "";

  /**
   * Maximum amount of time (in milliseconds) that can  be spent on current task.
   */
  currentTaskMaxTime = 0;

  /**
   * Milliseconds spent on current task
   */
  currentTaskTime = 0;

  /**
   * Keeps track of experience earned for other sleeves
   */
  earningsForSleeves: ITaskTracker = createTaskTracker();

  /**
   * Keeps track of experience + money earned for player
   */
  earningsForPlayer: ITaskTracker = createTaskTracker();

  /**
   * Keeps track of experienced earned in the current task/action
   */
  earningsForTask: ITaskTracker = createTaskTracker();

  /**
   * Keeps track of what type of work sleeve is doing for faction, if applicable
   */
  factionWorkType: FactionWorkType = FactionWorkType.HACKING;

  /**
   * Records experience gain rate for the current task
   */
  gainRatesForTask: ITaskTracker = createTaskTracker();

  /**
   * String that stores what stat the sleeve is training at the gym
   */
  gymStatType = "";

  /**
   * String that stores what stat the sleeve is training at the gym
   */
  bbAction = "";

  /**
   * String that stores what stat the sleeve is training at the gym
   */
  bbContract = "";

  /**
   * Clone retains 'memory' synchronization (and maybe exp?) upon prestige/installing Augs
   */
  memory = 1;

  /**
   * Sleeve shock. Number between 0 and 100
   * Trauma/shock that comes with being in a sleeve. Experience earned
   * is multipled by shock%. This gets applied before synchronization
   *
   * Reputation earned is also multiplied by shock%
   */
  shock = 1;

  /**
   * Stored number of game "loop" cycles
   */
  storedCycles = 0;

  /**
   * Synchronization. Number between 0 and 100
   * When experience is earned  by sleeve, both the player and the sleeve get
   * sync% of the experience earned. Other sleeves get sync^2% of exp
   */
  sync = 1;

  constructor(p: IPlayer | null = null) {
    super();
    if (p != null) {
      this.shockRecovery(p);
    }
  }

  shockBonus(): number {
    return this.shock / 100;
  }
  syncBonus(): number {
    return this.sync / 100;
  }

  /**
   * Commit crimes
   */
  commitCrime(p: IPlayer, crimeKey: string): boolean {
    const crime: Crime | null = Crimes[crimeKey] || Object.values(Crimes).find((crime) => crime.name === crimeKey);
    if (!crime) {
      return false;
    }

    if (this.currentTask !== SleeveTaskType.Idle) {
      this.finishTask(p);
    } else {
      this.resetTaskStatus(p);
    }

    this.gainRatesForTask.hack = crime.hacking_exp * this.mults.hacking_exp * BitNodeMultipliers.CrimeExpGain;
    this.gainRatesForTask.str = crime.strength_exp * this.mults.strength_exp * BitNodeMultipliers.CrimeExpGain;
    this.gainRatesForTask.def = crime.defense_exp * this.mults.defense_exp * BitNodeMultipliers.CrimeExpGain;
    this.gainRatesForTask.dex = crime.dexterity_exp * this.mults.dexterity_exp * BitNodeMultipliers.CrimeExpGain;
    this.gainRatesForTask.agi = crime.agility_exp * this.mults.agility_exp * BitNodeMultipliers.CrimeExpGain;
    this.gainRatesForTask.cha = crime.charisma_exp * this.mults.charisma_exp * BitNodeMultipliers.CrimeExpGain;
    this.gainRatesForTask.int = crime.intelligence_exp;
    this.gainRatesForTask.money = crime.money * this.mults.crime_money * BitNodeMultipliers.CrimeMoney;

    this.currentTaskLocation = String(this.gainRatesForTask.money);

    this.crimeType = crime.name;
    this.currentTaskMaxTime = crime.time;
    this.currentTask = SleeveTaskType.Crime;
    return true;
  }

  /**
   * Called to stop the current task
   */
  finishTask(p: IPlayer): void {
    this.currentWork = null;
    if (this.currentTask === SleeveTaskType.Crime) {
      // For crimes, all experience and money is gained at the end
      if (this.currentTaskTime >= this.currentTaskMaxTime) {
        const crime: Crime | undefined = Object.values(Crimes).find((crime) => crime.name === this.crimeType);
        if (!crime) {
          console.error(`Invalid data stored in sleeve.crimeType: ${this.crimeType}`);
          this.resetTaskStatus(p);
          return;
        }
        if (Math.random() < crime.successRate(this)) {
          // Success
          const successGainRates: ITaskTracker = createTaskTracker();

          const keysForIteration: (keyof ITaskTracker)[] = Object.keys(successGainRates) as (keyof ITaskTracker)[];
          for (let i = 0; i < keysForIteration.length; ++i) {
            const key = keysForIteration[i];
            successGainRates[key] = this.gainRatesForTask[key] * 2;
          }
          this.gainExperience(p, successGainRates);
          this.gainMoney(p, this.gainRatesForTask);

          p.karma -= crime.karma * (this.sync / 100);
        } else {
          this.gainExperience(p, this.gainRatesForTask);
        }

        // Do not reset task to IDLE
        this.currentTaskTime = 0;
        return;
      }
    } else if (this.currentTask === SleeveTaskType.Bladeburner) {
      if (this.currentTaskMaxTime === 0) {
        this.currentTaskTime = 0;
        return;
      }
      // For bladeburner, all experience and money is gained at the end
      const bb = p.bladeburner;
      if (bb === null) {
        const errorLogText = `bladeburner is null`;
        console.error(`Function: sleeves.finishTask; Message: '${errorLogText}'`);
        this.resetTaskStatus(p);
        return;
      }

      if (this.currentTaskTime >= this.currentTaskMaxTime) {
        if (this.bbAction === "Infiltrate synthoids") {
          bb.infiltrateSynthoidCommunities(p);
          this.currentTaskTime = 0;
          return;
        }
        let type: string;
        let name: string;
        if (this.bbAction === "Take on contracts") {
          type = "Contracts";
          name = this.bbContract;
        } else {
          type = "General";
          name = this.bbAction;
        }

        const actionIdent = bb.getActionIdFromTypeAndName(type, name);
        if (actionIdent === null) {
          const errorLogText = `Invalid action: type='${type}' name='${name}'`;
          console.error(`Function: sleeves.finishTask; Message: '${errorLogText}'`);
          this.resetTaskStatus(p);
          return;
        }

        const action = bb.getActionObject(actionIdent);
        if ((action?.count ?? 0) > 0) {
          const bbRetValue = bb.completeAction(p, this, actionIdent, false);
          if (bbRetValue) {
            this.gainExperience(p, bbRetValue);
            this.gainMoney(p, bbRetValue);

            // Do not reset task to IDLE
            this.currentTaskTime = 0;
            return;
          }
        }
      }
    }

    this.resetTaskStatus(p);

    return;
  }

  /**
   * Earn experience for any stats (supports multiple)
   * This function also handles experience propogating to Player and other sleeves
   */
  gainExperience(p: IPlayer, exp: ITaskTracker, numCycles = 1, fromOtherSleeve = false): ITaskTracker {
    // If the experience is coming from another sleeve, it is not multiplied by anything.
    // Also the player does not earn anything
    if (fromOtherSleeve) {
      if (exp.hack > 0) {
        this.exp.hacking += exp.hack;
      }

      if (exp.str > 0) {
        this.exp.strength += exp.str;
      }

      if (exp.def > 0) {
        this.exp.defense += exp.def;
      }

      if (exp.dex > 0) {
        this.exp.dexterity += exp.dex;
      }

      if (exp.agi > 0) {
        this.exp.agility += exp.agi;
      }

      if (exp.cha > 0) {
        this.exp.charisma += exp.cha;
      }

      return createTaskTracker();
    }

    // Experience is first multiplied by shock. Then 'synchronization'
    // is accounted for

    const multFac = (this.shock / 100) * (this.sync / 100) * numCycles;
    const pHackExp = exp.hack * multFac;
    const pStrExp = exp.str * multFac;
    const pDefExp = exp.def * multFac;
    const pDexExp = exp.dex * multFac;
    const pAgiExp = exp.agi * multFac;
    const pChaExp = exp.cha * multFac;
    const pIntExp = exp.int * multFac;

    // Experience is gained by both this sleeve and player
    if (pHackExp > 0) {
      this.gainHackingExp(pHackExp);
      p.gainHackingExp(pHackExp);
      this.earningsForPlayer.hack += pHackExp;
      this.earningsForTask.hack += pHackExp;
    }

    if (pStrExp > 0) {
      this.gainStrengthExp(pStrExp);
      p.gainStrengthExp(pStrExp);
      this.earningsForPlayer.str += pStrExp;
      this.earningsForTask.str += pStrExp;
    }

    if (pDefExp > 0) {
      this.gainDefenseExp(pDefExp);
      p.gainDefenseExp(pDefExp);
      this.earningsForPlayer.def += pDefExp;
      this.earningsForTask.def += pDefExp;
    }

    if (pDexExp > 0) {
      this.gainDexterityExp(pDexExp);
      p.gainDexterityExp(pDexExp);
      this.earningsForPlayer.dex += pDexExp;
      this.earningsForTask.dex += pDexExp;
    }

    if (pAgiExp > 0) {
      this.gainAgilityExp(pAgiExp);
      p.gainAgilityExp(pAgiExp);
      this.earningsForPlayer.agi += pAgiExp;
      this.earningsForTask.agi += pAgiExp;
    }

    if (pChaExp > 0) {
      this.gainCharismaExp(pChaExp);
      p.gainCharismaExp(pChaExp);
      this.earningsForPlayer.cha += pChaExp;
      this.earningsForTask.cha += pChaExp;
    }

    if (pIntExp > 0) {
      this.gainIntelligenceExp(pIntExp);
      p.gainIntelligenceExp(pIntExp);
    }

    // Record earnings for other sleeves
    this.earningsForSleeves.hack += pHackExp * (this.sync / 100);
    this.earningsForSleeves.str += pStrExp * (this.sync / 100);
    this.earningsForSleeves.def += pDefExp * (this.sync / 100);
    this.earningsForSleeves.dex += pDexExp * (this.sync / 100);
    this.earningsForSleeves.agi += pAgiExp * (this.sync / 100);
    this.earningsForSleeves.cha += pChaExp * (this.sync / 100);

    // Return the experience to be gained by other sleeves
    return {
      hack: pHackExp * (this.sync / 100),
      str: pStrExp * (this.sync / 100),
      def: pDefExp * (this.sync / 100),
      dex: pDexExp * (this.sync / 100),
      agi: pAgiExp * (this.sync / 100),
      cha: pChaExp * (this.sync / 100),
      int: pIntExp * (this.sync / 100),
      money: exp.money,
    };
  }

  /**
   * Earn money for player
   */
  gainMoney(p: IPlayer, task: ITaskTracker, numCycles = 1): void {
    const gain: number = task.money * numCycles;
    this.earningsForTask.money += gain;
    this.earningsForPlayer.money += gain;
    p.gainMoney(gain, "sleeves");
  }

  /**
   * Returns the cost of upgrading this sleeve's memory by a certain amount
   */
  getMemoryUpgradeCost(n: number): number {
    const amt = Math.round(n);
    if (amt < 0) {
      return 0;
    }

    if (this.memory + amt > 100) {
      return this.getMemoryUpgradeCost(100 - this.memory);
    }

    const mult = 1.02;
    const baseCost = 1e12;
    let currCost = 0;
    let currMemory = this.memory - 1;
    for (let i = 0; i < n; ++i) {
      currCost += Math.pow(mult, currMemory);
      ++currMemory;
    }

    return currCost * baseCost;
  }

  /**
   * Gets reputation gain for the current task
   * Only applicable when working for company or faction
   */
  getRepGain(p: IPlayer): number {
    if (this.currentTask === SleeveTaskType.Company) {
      const companyName: string = this.currentTaskLocation;
      const company: Company | null = Companies[companyName];
      if (company == null) {
        console.error(`Invalid company found when trying to calculate rep gain: ${companyName}`);
        return 0;
      }

      const companyPosition: CompanyPosition | null = CompanyPositions[p.jobs[companyName]];
      if (companyPosition == null) {
        console.error(`Invalid company position name found when trying to calculate rep gain: ${p.jobs[companyName]}`);
        return 0;
      }

      const jobPerformance: number = companyPosition.calculateJobPerformance(
        this.skills.hacking,
        this.skills.strength,
        this.skills.defense,
        this.skills.dexterity,
        this.skills.agility,
        this.skills.charisma,
      );
      const favorMult = 1 + company.favor / 100;

      return jobPerformance * this.mults.company_rep * favorMult;
    } else {
      return 0;
    }
  }

  installAugmentation(aug: Augmentation): void {
    this.exp.hacking = 0;
    this.exp.strength = 0;
    this.exp.defense = 0;
    this.exp.dexterity = 0;
    this.exp.agility = 0;
    this.exp.charisma = 0;
    this.applyAugmentation(aug);
    this.augmentations.push({ name: aug.name, level: 1 });
    this.updateStatLevels();
  }

  /**
   * Called on every sleeve for a Source File Prestige
   */
  prestige(p: IPlayer): void {
    // Reset exp
    this.exp.hacking = 0;
    this.exp.strength = 0;
    this.exp.defense = 0;
    this.exp.dexterity = 0;
    this.exp.agility = 0;
    this.exp.charisma = 0;

    // Reset task-related stuff
    this.resetTaskStatus(p);
    this.earningsForSleeves = createTaskTracker();
    this.earningsForPlayer = createTaskTracker();
    this.shockRecovery(p);

    // Reset augs and multipliers
    this.augmentations = [];
    this.resetMultipliers();

    // Reset Location

    this.city = CityName.Sector12;

    // Reset sleeve-related stats
    this.shock = 1;
    this.storedCycles = 0;
    this.sync = Math.max(this.memory, 1);
  }

  /**
   * Process loop
   * Returns an object containing the amount of experience that should be
   * transferred to all other sleeves
   */
  process(p: IPlayer, numCycles = 1): void {
    // Only process once every second (5 cycles)
    const CyclesPerSecond = 1000 / CONSTANTS.MilliPerCycle;
    this.storedCycles += numCycles;
    if (this.storedCycles < CyclesPerSecond) return;

    let cyclesUsed = this.storedCycles;
    cyclesUsed = Math.min(cyclesUsed, 15);
    if (this.currentWork) {
      this.currentWork.process(p, this, cyclesUsed);
      this.storedCycles -= cyclesUsed;
      return;
    }

    let time = cyclesUsed * CONSTANTS.MilliPerCycle;
    if (this.currentTaskMaxTime !== 0 && this.currentTaskTime + time > this.currentTaskMaxTime) {
      time = this.currentTaskMaxTime - this.currentTaskTime;
      cyclesUsed = Math.floor(time / CONSTANTS.MilliPerCycle);

      if (time < 0 || cyclesUsed < 0) {
        console.warn(`Sleeve.process() calculated negative cycle usage`);
        time = 0;
        cyclesUsed = 0;
      }
    }

    this.currentTaskTime += time;

    // Shock gradually goes towards 100
    this.shock = Math.min(100, this.shock + 0.0001 * cyclesUsed);

    switch (this.currentTask) {
      case SleeveTaskType.Company: {
        this.gainExperience(p, this.gainRatesForTask, cyclesUsed);
        this.gainMoney(p, this.gainRatesForTask, cyclesUsed);

        const company: Company = Companies[this.currentTaskLocation];
        if (!(company instanceof Company)) {
          console.error(`Invalid company for Sleeve task: ${this.currentTaskLocation}`);
          break;
        }

        company.playerReputation += this.getRepGain(p) * cyclesUsed;
        break;
      }
    }

    if (this.currentTaskMaxTime !== 0 && this.currentTaskTime >= this.currentTaskMaxTime) {
      if (this.currentTask === SleeveTaskType.Crime || this.currentTask === SleeveTaskType.Bladeburner) {
        this.finishTask(p);
      } else {
        this.finishTask(p);
      }
    }

    this.updateStatLevels();

    this.storedCycles -= cyclesUsed;

    return;
  }

  /**
   * Resets all parameters used to keep information about the current task
   */
  resetTaskStatus(p: IPlayer): void {
    this.currentWork = null;
    if (this.bbAction == "Support main sleeve") {
      p.bladeburner?.sleeveSupport(false);
    }
    this.earningsForTask = createTaskTracker();
    this.gainRatesForTask = createTaskTracker();
    this.currentTask = SleeveTaskType.Idle;
    this.currentTaskTime = 0;
    this.currentTaskMaxTime = 0;
    this.factionWorkType = FactionWorkType.HACKING;
    this.crimeType = "";
    this.currentTaskLocation = "";
    this.gymStatType = "";
    this.className = "";
    this.bbAction = "";
    this.bbContract = "------";
  }

  shockRecovery(p: IPlayer): boolean {
    if (this.currentTask !== SleeveTaskType.Idle || this.currentWork === null) {
      this.finishTask(p);
    } else {
      this.resetTaskStatus(p);
    }
    this.currentWork = new SleeveRecoveryWork();
    return true;
  }

  synchronize(p: IPlayer): boolean {
    if (this.currentTask !== SleeveTaskType.Idle || this.currentWork !== null) {
      this.finishTask(p);
    } else {
      this.resetTaskStatus(p);
    }
    this.currentWork = new SleeveSynchroWork();
    return true;
  }

  /**
   * Take a course at a university
   */
  takeUniversityCourse(p: IPlayer, universityName: string, className: string): boolean {
    if (this.currentTask !== SleeveTaskType.Idle || this.currentWork) {
      this.finishTask(p);
    } else {
      this.resetTaskStatus(p);
    }

    // Set exp/money multipliers based on which university.
    // Also check that the sleeve is in the right city
    let loc: LocationName | undefined;
    switch (universityName.toLowerCase()) {
      case LocationName.AevumSummitUniversity.toLowerCase(): {
        if (this.city !== CityName.Aevum) return false;
        loc = LocationName.AevumSummitUniversity;
        break;
      }
      case LocationName.Sector12RothmanUniversity.toLowerCase(): {
        if (this.city !== CityName.Sector12) return false;
        loc = LocationName.Sector12RothmanUniversity;
        break;
      }
      case LocationName.VolhavenZBInstituteOfTechnology.toLowerCase(): {
        if (this.city !== CityName.Volhaven) return false;
        loc = LocationName.VolhavenZBInstituteOfTechnology;
        break;
      }
    }
    if (!loc) return false;

    // Set experience/money gains based on class
    let classType: ClassType | undefined;
    switch (className.toLowerCase()) {
      case "study computer science":
        classType = ClassType.StudyComputerScience;
        break;
      case "data structures":
        classType = ClassType.DataStructures;
        break;
      case "networks":
        classType = ClassType.Networks;
        break;
      case "algorithms":
        classType = ClassType.Algorithms;
        break;
      case "management":
        classType = ClassType.Management;
        break;
      case "leadership":
        classType = ClassType.Leadership;
        break;
    }
    if (!classType) return false;

    this.currentWork = new SleeveClassWork({
      classType: classType,
      location: loc,
    });
    return true;
  }

  /**
   * Travel to another City. Costs money from player
   */
  travel(p: IPlayer, newCity: CityName): boolean {
    p.loseMoney(CONSTANTS.TravelCost, "sleeves");
    this.city = newCity;

    return true;
  }

  tryBuyAugmentation(p: IPlayer, aug: Augmentation): boolean {
    if (!p.canAfford(aug.baseCost)) {
      return false;
    }

    // Verify that this sleeve does not already have that augmentation.
    if (this.augmentations.some((a) => a.name === aug.name)) {
      return false;
    }

    p.loseMoney(aug.baseCost, "sleeves");
    this.installAugmentation(aug);
    return true;
  }

  upgradeMemory(n: number): void {
    if (n < 0) {
      console.warn(`Sleeve.upgradeMemory() called with negative value: ${n}`);
      return;
    }

    this.memory = Math.min(100, Math.round(this.memory + n));
  }

  /**
   * Start work for one of the player's companies
   * Returns boolean indicating success
   */
  workForCompany(p: IPlayer, companyName: string): boolean {
    if (!(Companies[companyName] instanceof Company) || p.jobs[companyName] == null) {
      return false;
    }

    if (this.currentTask !== SleeveTaskType.Idle || this.currentWork !== null) {
      this.finishTask(p);
    } else {
      this.resetTaskStatus(p);
    }

    const company: Company | null = Companies[companyName];
    const companyPosition: CompanyPosition | null = CompanyPositions[p.jobs[companyName]];
    if (company == null) return false;
    if (companyPosition == null) return false;

    this.currentWork = new SleeveCompanyWork({ companyName: companyName });

    return true;
  }

  /**
   * Start work for one of the player's factions
   * Returns boolean indicating success
   */
  workForFaction(p: IPlayer, factionName: string, workType: string): boolean {
    const faction = Factions[factionName];
    if (factionName === "" || !faction || !(faction instanceof Faction) || !p.factions.includes(factionName)) {
      return false;
    }

    if (this.currentTask !== SleeveTaskType.Idle || this.currentWork === null) {
      this.finishTask(p);
    } else {
      this.resetTaskStatus(p);
    }

    const factionInfo = faction.getInfo();

    // Set type of work (hacking/field/security), and the experience gains
    const sanitizedWorkType = workType.toLowerCase();
    let factionWorkType: FactionWorkType;
    if (sanitizedWorkType.includes("hack")) {
      if (!factionInfo.offerHackingWork) return false;
      factionWorkType = FactionWorkType.HACKING;
    } else if (sanitizedWorkType.includes("field")) {
      if (!factionInfo.offerFieldWork) return false;
      factionWorkType = FactionWorkType.FIELD;
    } else if (sanitizedWorkType.includes("security")) {
      if (!factionInfo.offerSecurityWork) return false;
      factionWorkType = FactionWorkType.SECURITY;
    } else {
      return false;
    }

    this.currentWork = new SleeveFactionWork({
      factionWorkType: factionWorkType,
      factionName: faction.name,
    });

    return true;
  }

  /**
   * Begin a gym workout task
   */
  workoutAtGym(p: IPlayer, gymName: string, stat: string): boolean {
    if (this.currentTask !== SleeveTaskType.Idle || this.currentWork) {
      this.finishTask(p);
    } else {
      this.resetTaskStatus(p);
    }

    // Set exp/money multipliers based on which university.
    // Also check that the sleeve is in the right city
    let loc: LocationName | undefined;
    switch (gymName.toLowerCase()) {
      case LocationName.AevumCrushFitnessGym.toLowerCase(): {
        if (this.city != CityName.Aevum) return false;
        loc = LocationName.AevumCrushFitnessGym;
        break;
      }
      case LocationName.AevumSnapFitnessGym.toLowerCase(): {
        if (this.city != CityName.Aevum) return false;
        loc = LocationName.AevumSnapFitnessGym;
        break;
      }
      case LocationName.Sector12IronGym.toLowerCase(): {
        if (this.city != CityName.Sector12) return false;
        loc = LocationName.Sector12IronGym;
        break;
      }
      case LocationName.Sector12PowerhouseGym.toLowerCase(): {
        if (this.city != CityName.Sector12) return false;
        loc = LocationName.Sector12PowerhouseGym;
        break;
      }
      case LocationName.VolhavenMilleniumFitnessGym.toLowerCase(): {
        if (this.city != CityName.Volhaven) return false;
        loc = LocationName.VolhavenMilleniumFitnessGym;
        break;
      }
    }
    if (!loc) return false;

    // Set experience/money gains based on class
    const sanitizedStat: string = stat.toLowerCase();

    // set stat to a default value.
    let classType: ClassType | undefined;
    if (sanitizedStat.includes("str")) {
      classType = ClassType.GymStrength;
    }
    if (sanitizedStat.includes("def")) {
      classType = ClassType.GymDefense;
    }
    if (sanitizedStat.includes("dex")) {
      classType = ClassType.GymDexterity;
    }
    if (sanitizedStat.includes("agi")) {
      classType = ClassType.GymAgility;
    }
    // if stat is still equals its default value, then validation has failed.
    if (!classType) return false;

    this.currentWork = new SleeveClassWork({
      classType: classType,
      location: loc,
    });

    return true;
  }

  /**
   * Begin a bladeburner task
   */
  bladeburner(p: IPlayer, action: string, contract: string): boolean {
    if (this.currentTask !== SleeveTaskType.Idle || this.currentWork === null) {
      this.finishTask(p);
    } else {
      this.resetTaskStatus(p);
    }

    this.gainRatesForTask.hack = 0;
    this.gainRatesForTask.str = 0;
    this.gainRatesForTask.def = 0;
    this.gainRatesForTask.dex = 0;
    this.gainRatesForTask.agi = 0;
    this.gainRatesForTask.cha = 0;
    this.gainRatesForTask.money = 0;
    this.currentTaskLocation = "";

    let time = 0;

    this.bbContract = "------";
    switch (action) {
      case "Field analysis":
        // time = this.getBladeburnerActionTime(p, "General", action);
        // this.gainRatesForTask.hack = 20 * this.mults.hacking_exp;
        // this.gainRatesForTask.cha = 20 * this.mults.charisma_exp;
        this.currentWork = new SleeveBladeburnerGeneralWork("Field analysis");
        return true;
      case "Recruitment":
        // time = this.getBladeburnerActionTime(p, "General", action);
        // this.gainRatesForTask.cha =
        //   2 * BladeburnerConstants.BaseStatGain * (p.bladeburner?.getRecruitmentTime(this) ?? 0) * 1000;
        // this.currentTaskLocation = `(Success Rate: ${numeralWrapper.formatPercentage(
        //   this.recruitmentSuccessChance(p),
        // )})`;
        this.currentWork = new SleeveBladeburnerGeneralWork("Recruitment");
        break;
      case "Diplomacy":
        // time = this.getBladeburnerActionTime(p, "General", action);
        this.currentWork = new SleeveBladeburnerGeneralWork("Diplomacy");
        break;
      case "Infiltrate synthoids":
        this.currentWork = new SleeveInfiltrateWork();
        break;
      case "Support main sleeve":
        p.bladeburner?.sleeveSupport(true);
        time = 0;
        break;
      case "Take on contracts":
        time = this.getBladeburnerActionTime(p, "Contracts", contract);
        this.contractGainRates(p, "Contracts", contract);
        this.currentTaskLocation = this.contractSuccessChance(p, "Contracts", contract);
        this.bbContract = capitalizeEachWord(contract.toLowerCase());
        break;
    }

    this.bbAction = capitalizeFirstLetter(action.toLowerCase());
    this.currentTaskMaxTime = time;
    this.currentTask = SleeveTaskType.Bladeburner;
    return true;
  }

  recruitmentSuccessChance(p: IPlayer): number {
    return Math.max(0, Math.min(1, p.bladeburner?.getRecruitmentSuccessChance(this) ?? 0));
  }

  contractSuccessChance(p: IPlayer, type: string, name: string): string {
    const bb = p.bladeburner;
    if (bb === null) {
      const errorLogText = `bladeburner is null`;
      console.error(`Function: sleeves.contractSuccessChance; Message: '${errorLogText}'`);
      return "0%";
    }
    const chances = bb.getActionEstimatedSuccessChanceNetscriptFn(this, type, name);
    if (typeof chances === "string") {
      console.error(`Function: sleeves.contractSuccessChance; Message: '${chances}'`);
      return "0%";
    }
    if (chances[0] >= 1) {
      return "100%";
    } else {
      return `${numeralWrapper.formatPercentage(chances[0])} - ${numeralWrapper.formatPercentage(chances[1])}`;
    }
  }

  contractGainRates(p: IPlayer, type: string, name: string): void {
    const bb = p.bladeburner;
    if (bb === null) {
      const errorLogText = `bladeburner is null`;
      console.error(`Function: sleeves.contractGainRates; Message: '${errorLogText}'`);
      return;
    }
    const actionIdent = bb.getActionIdFromTypeAndName(type, name);
    if (actionIdent === null) {
      const errorLogText = `Invalid action: type='${type}' name='${name}'`;
      console.error(`Function: sleeves.contractGainRates; Message: '${errorLogText}'`);
      this.resetTaskStatus(p);
      return;
    }
    const action = bb.getActionObject(actionIdent);
    if (action === null) {
      const errorLogText = `Invalid action: type='${type}' name='${name}'`;
      console.error(`Function: sleeves.contractGainRates; Message: '${errorLogText}'`);
      this.resetTaskStatus(p);
      return;
    }
    const retValue = bb.getActionStats(action, true);
    this.gainRatesForTask.hack = retValue.hack;
    this.gainRatesForTask.str = retValue.str;
    this.gainRatesForTask.def = retValue.def;
    this.gainRatesForTask.dex = retValue.dex;
    this.gainRatesForTask.agi = retValue.agi;
    this.gainRatesForTask.cha = retValue.cha;
    const rewardMultiplier = Math.pow(action.rewardFac, action.level - 1);
    this.gainRatesForTask.money =
      BladeburnerConstants.ContractBaseMoneyGain * rewardMultiplier * bb.skillMultipliers.money;
  }

  getBladeburnerActionTime(p: IPlayer, type: string, name: string): number {
    //Maybe find workerscript and use original
    const bb = p.bladeburner;
    if (bb === null) {
      const errorLogText = `bladeburner is null`;
      console.error(`Function: sleeves.getBladeburnerActionTime; Message: '${errorLogText}'`);
      return -1;
    }

    const time = bb.getActionTimeNetscriptFn(this, type, name);
    if (typeof time === "string") {
      const errorLogText = `Invalid action: type='${type}' name='${name}'`;
      console.error(`Function: sleeves.getBladeburnerActionTime; Message: '${errorLogText}'`);
      return -1;
    } else {
      return time;
    }
  }

  takeDamage(amt: number): boolean {
    if (typeof amt !== "number") {
      console.warn(`Player.takeDamage() called without a numeric argument: ${amt}`);
      return false;
    }

    this.hp.current -= amt;
    if (this.hp.current <= 0) {
      this.shock = Math.min(1, this.shock - 0.5);
      this.hp.current = this.hp.max;
      return true;
    } else {
      return false;
    }
  }

  whoAmI(): string {
    return "Sleeve";
  }

  /**
   * Serialize the current object to a JSON save state.
   */
  toJSON(): IReviverValue {
    return Generic_toJSON("Sleeve", this);
  }

  /**
   * Initiatizes a Sleeve object from a JSON save state.
   */
  static fromJSON(value: IReviverValue): Sleeve {
    return Generic_fromJSON(Sleeve, value.data);
  }
}

Reviver.constructors.Sleeve = Sleeve;
