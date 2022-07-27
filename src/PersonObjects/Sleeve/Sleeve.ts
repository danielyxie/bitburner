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

export class Sleeve extends Person {
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
   * Keeps track of events/notifications for this sleeve
   */
  logs: string[] = [];

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
  finishTask(p: IPlayer): ITaskTracker {
    let retValue: ITaskTracker = createTaskTracker(); // Amount of exp to be gained by other sleeves

    if (this.currentTask === SleeveTaskType.Crime) {
      // For crimes, all experience and money is gained at the end
      if (this.currentTaskTime >= this.currentTaskMaxTime) {
        const crime: Crime | undefined = Object.values(Crimes).find((crime) => crime.name === this.crimeType);
        if (!crime) {
          console.error(`Invalid data stored in sleeve.crimeType: ${this.crimeType}`);
          this.resetTaskStatus(p);
          return retValue;
        }
        if (Math.random() < crime.successRate(this)) {
          // Success
          const successGainRates: ITaskTracker = createTaskTracker();

          const keysForIteration: (keyof ITaskTracker)[] = Object.keys(successGainRates) as (keyof ITaskTracker)[];
          for (let i = 0; i < keysForIteration.length; ++i) {
            const key = keysForIteration[i];
            successGainRates[key] = this.gainRatesForTask[key] * 2;
          }
          retValue = this.gainExperience(p, successGainRates);
          this.gainMoney(p, this.gainRatesForTask);

          p.karma -= crime.karma * (this.sync / 100);
        } else {
          retValue = this.gainExperience(p, this.gainRatesForTask);
        }

        // Do not reset task to IDLE
        this.currentTaskTime = 0;
        return retValue;
      }
    } else if (this.currentTask === SleeveTaskType.Bladeburner) {
      if (this.currentTaskMaxTime === 0) {
        this.currentTaskTime = 0;
        return retValue;
      }
      // For bladeburner, all experience and money is gained at the end
      const bb = p.bladeburner;
      if (bb === null) {
        const errorLogText = `bladeburner is null`;
        console.error(`Function: sleeves.finishTask; Message: '${errorLogText}'`);
        this.resetTaskStatus(p);
        return retValue;
      }

      if (this.currentTaskTime >= this.currentTaskMaxTime) {
        if (this.bbAction === "Infiltrate synthoids") {
          bb.infiltrateSynthoidCommunities(p);
          this.currentTaskTime = 0;
          return retValue;
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
          return retValue;
        }

        const action = bb.getActionObject(actionIdent);
        if ((action?.count ?? 0) > 0) {
          const bbRetValue = bb.completeAction(p, this, actionIdent, false);
          if (bbRetValue) {
            retValue = this.gainExperience(p, bbRetValue);
            this.gainMoney(p, bbRetValue);

            // Do not reset task to IDLE
            this.currentTaskTime = 0;
            return retValue;
          }
        }
      }
    }

    this.resetTaskStatus(p);

    return retValue;
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
    if (this.currentTask === SleeveTaskType.Faction) {
      let favorMult = 1;
      const fac: Faction | null = Factions[this.currentTaskLocation];
      if (fac != null) {
        favorMult = 1 + fac.favor / 100;
      }

      switch (this.factionWorkType) {
        case FactionWorkType.HACKING:
          return this.getFactionHackingWorkRepGain() * (this.shock / 100) * favorMult;
        case FactionWorkType.FIELD:
          return this.getFactionFieldWorkRepGain() * (this.shock / 100) * favorMult;
        case FactionWorkType.SECURITY:
          return this.getFactionSecurityWorkRepGain() * (this.shock / 100) * favorMult;
        default:
          console.warn(`Invalid Sleeve.factionWorkType property in Sleeve.getRepGain(): ${this.factionWorkType}`);
          return 0;
      }
    } else if (this.currentTask === SleeveTaskType.Company) {
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

  log(entry: string): void {
    const MaxLogSize = 50;
    this.logs.push(entry);
    if (this.logs.length > MaxLogSize) {
      this.logs.shift();
    }
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

    this.logs = [];
  }

  /**
   * Process loop
   * Returns an object containing the amount of experience that should be
   * transferred to all other sleeves
   */
  process(p: IPlayer, numCycles = 1): ITaskTracker | null {
    // Only process once every second (5 cycles)
    const CyclesPerSecond = 1000 / CONSTANTS.MilliPerCycle;
    this.storedCycles += numCycles;
    if (this.storedCycles < CyclesPerSecond) {
      return null;
    }

    let cyclesUsed = this.storedCycles;
    cyclesUsed = Math.min(cyclesUsed, 15);
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

    let retValue: ITaskTracker = createTaskTracker();
    switch (this.currentTask) {
      case SleeveTaskType.Idle:
        break;
      case SleeveTaskType.Class:
      case SleeveTaskType.Gym:
        this.updateTaskGainRates(p);
        retValue = this.gainExperience(p, this.gainRatesForTask, cyclesUsed);
        this.gainMoney(p, this.gainRatesForTask, cyclesUsed);
        break;
      case SleeveTaskType.Faction: {
        retValue = this.gainExperience(p, this.gainRatesForTask, cyclesUsed);
        this.gainMoney(p, this.gainRatesForTask, cyclesUsed);

        // Gain faction reputation
        const fac: Faction = Factions[this.currentTaskLocation];
        if (!(fac instanceof Faction)) {
          console.error(`Invalid faction for Sleeve task: ${this.currentTaskLocation}`);
          break;
        }

        // If the player has a gang with the faction the sleeve is working
        // for, we need to reset the sleeve's task
        if (p.gang) {
          if (fac.name === p.gang.facName) {
            this.resetTaskStatus(p);
          }
        }

        fac.playerReputation += this.getRepGain(p) * cyclesUsed;
        break;
      }
      case SleeveTaskType.Company: {
        retValue = this.gainExperience(p, this.gainRatesForTask, cyclesUsed);
        this.gainMoney(p, this.gainRatesForTask, cyclesUsed);

        const company: Company = Companies[this.currentTaskLocation];
        if (!(company instanceof Company)) {
          console.error(`Invalid company for Sleeve task: ${this.currentTaskLocation}`);
          break;
        }

        company.playerReputation += this.getRepGain(p) * cyclesUsed;
        break;
      }
      case SleeveTaskType.Recovery:
        this.shock = Math.min(100, this.shock + 0.0002 * cyclesUsed);
        if (this.shock >= 100) this.resetTaskStatus(p);
        break;
      case SleeveTaskType.Synchro:
        this.sync = Math.min(100, this.sync + p.getIntelligenceBonus(0.5) * 0.0002 * cyclesUsed);
        if (this.sync >= 100) this.resetTaskStatus(p);
        break;
      default:
        break;
    }

    if (this.currentTaskMaxTime !== 0 && this.currentTaskTime >= this.currentTaskMaxTime) {
      if (this.currentTask === SleeveTaskType.Crime || this.currentTask === SleeveTaskType.Bladeburner) {
        retValue = this.finishTask(p);
      } else {
        this.finishTask(p);
      }
    }

    this.updateStatLevels();

    this.storedCycles -= cyclesUsed;

    return retValue;
  }

  /**
   * Resets all parameters used to keep information about the current task
   */
  resetTaskStatus(p: IPlayer): void {
    if (this.bbAction == "Support main sleeve") {
      p.bladeburner?.sleeveSupport(false);
    }
    if (this.currentTask == SleeveTaskType.Class) {
      const retVal = createTaskTracker();
      retVal.int = CONSTANTS.IntelligenceClassBaseExpGain * Math.round(this.currentTaskTime / 1000);
      const r = this.gainExperience(p, retVal);
      p.sleeves.filter((s) => s != this).forEach((s) => s.gainExperience(p, r, 1, true));
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
    if (this.currentTask !== SleeveTaskType.Idle) {
      this.finishTask(p);
    } else {
      this.resetTaskStatus(p);
    }

    this.currentTask = SleeveTaskType.Recovery;
    return true;
  }

  synchronize(p: IPlayer): boolean {
    if (this.currentTask !== SleeveTaskType.Idle) {
      this.finishTask(p);
    } else {
      this.resetTaskStatus(p);
    }

    this.currentTask = SleeveTaskType.Synchro;
    return true;
  }

  /**
   * Take a course at a university
   */
  takeUniversityCourse(p: IPlayer, universityName: string, className: string): boolean {
    if (this.currentTask !== SleeveTaskType.Idle) {
      this.finishTask(p);
    } else {
      this.resetTaskStatus(p);
    }

    // Set exp/money multipliers based on which university.
    // Also check that the sleeve is in the right city
    let costMult = 1;
    switch (universityName.toLowerCase()) {
      case LocationName.AevumSummitUniversity.toLowerCase():
        if (this.city !== CityName.Aevum) {
          return false;
        }
        this.currentTaskLocation = LocationName.AevumSummitUniversity;
        costMult = 4;
        break;
      case LocationName.Sector12RothmanUniversity.toLowerCase():
        if (this.city !== CityName.Sector12) {
          return false;
        }
        this.currentTaskLocation = LocationName.Sector12RothmanUniversity;
        costMult = 3;
        break;
      case LocationName.VolhavenZBInstituteOfTechnology.toLowerCase():
        if (this.city !== CityName.Volhaven) {
          return false;
        }
        this.currentTaskLocation = LocationName.VolhavenZBInstituteOfTechnology;
        costMult = 5;
        break;
      default:
        return false;
    }

    // Set experience/money gains based on class
    switch (className.toLowerCase()) {
      case "study computer science":
        break;
      case "data structures":
        this.gainRatesForTask.money = -1 * (CONSTANTS.ClassDataStructuresBaseCost * costMult);
        break;
      case "networks":
        this.gainRatesForTask.money = -1 * (CONSTANTS.ClassNetworksBaseCost * costMult);
        break;
      case "algorithms":
        this.gainRatesForTask.money = -1 * (CONSTANTS.ClassAlgorithmsBaseCost * costMult);
        break;
      case "management":
        this.gainRatesForTask.money = -1 * (CONSTANTS.ClassManagementBaseCost * costMult);
        break;
      case "leadership":
        this.gainRatesForTask.money = -1 * (CONSTANTS.ClassLeadershipBaseCost * costMult);
        break;
      default:
        return false;
    }

    this.className = className;
    this.currentTask = SleeveTaskType.Class;
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

  updateTaskGainRates(p: IPlayer): void {
    if (this.currentTask === SleeveTaskType.Class) {
      let expMult = 1;
      switch (this.currentTaskLocation.toLowerCase()) {
        case LocationName.AevumSummitUniversity.toLowerCase():
          expMult = 3;
          break;
        case LocationName.Sector12RothmanUniversity.toLowerCase():
          expMult = 2;
          break;
        case LocationName.VolhavenZBInstituteOfTechnology.toLowerCase():
          expMult = 4;
          break;
        default:
          return;
      }

      const totalExpMult = expMult * p.hashManager.getStudyMult();
      switch (this.className.toLowerCase()) {
        case "study computer science":
          this.gainRatesForTask.hack =
            CONSTANTS.ClassStudyComputerScienceBaseExp * totalExpMult * this.mults.hacking_exp;
          break;
        case "data structures":
          this.gainRatesForTask.hack = CONSTANTS.ClassDataStructuresBaseExp * totalExpMult * this.mults.hacking_exp;
          break;
        case "networks":
          this.gainRatesForTask.hack = CONSTANTS.ClassNetworksBaseExp * totalExpMult * this.mults.hacking_exp;
          break;
        case "algorithms":
          this.gainRatesForTask.hack = CONSTANTS.ClassAlgorithmsBaseExp * totalExpMult * this.mults.hacking_exp;
          break;
        case "management":
          this.gainRatesForTask.cha = CONSTANTS.ClassManagementBaseExp * totalExpMult * this.mults.charisma_exp;
          break;
        case "leadership":
          this.gainRatesForTask.cha = CONSTANTS.ClassLeadershipBaseExp * totalExpMult * this.mults.charisma_exp;
          break;
        default:
          break;
      }

      return;
    }

    if (this.currentTask === SleeveTaskType.Gym) {
      // Get gym exp multiplier
      let expMult = 1;
      switch (this.currentTaskLocation.toLowerCase()) {
        case LocationName.AevumCrushFitnessGym.toLowerCase():
          expMult = 2;
          break;
        case LocationName.AevumSnapFitnessGym.toLowerCase():
          expMult = 5;
          break;
        case LocationName.Sector12IronGym.toLowerCase():
          expMult = 1;
          break;
        case LocationName.Sector12PowerhouseGym.toLowerCase():
          expMult = 10;
          break;
        case LocationName.VolhavenMilleniumFitnessGym.toLowerCase():
          expMult = 4;
          break;
        default:
          return;
      }

      // Set stat gain rate
      const baseGymExp = 1;
      const totalExpMultiplier = p.hashManager.getTrainingMult() * expMult;
      switch (this.gymStatType) {
        case "none": // Note : due to the way Sleeve.workOutAtGym() is currently designed, this should never happend.
          break;
        case "str":
          this.gainRatesForTask.str = baseGymExp * totalExpMultiplier * this.mults.strength_exp;
          break;
        case "def":
          this.gainRatesForTask.def = baseGymExp * totalExpMultiplier * this.mults.defense_exp;
          break;
        case "dex":
          this.gainRatesForTask.dex = baseGymExp * totalExpMultiplier * this.mults.dexterity_exp;
          break;
        case "agi":
          this.gainRatesForTask.agi = baseGymExp * totalExpMultiplier * this.mults.agility_exp;
          break;
      }
      return;
    }

    console.warn(`Sleeve.updateTaskGainRates() called for unexpected task type ${this.currentTask}`);
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

    if (this.currentTask !== SleeveTaskType.Idle) {
      this.finishTask(p);
    } else {
      this.resetTaskStatus(p);
    }

    const company: Company | null = Companies[companyName];
    const companyPosition: CompanyPosition | null = CompanyPositions[p.jobs[companyName]];
    if (company == null) {
      return false;
    }
    if (companyPosition == null) {
      return false;
    }
    this.gainRatesForTask.money =
      companyPosition.baseSalary *
      company.salaryMultiplier *
      this.mults.work_money *
      BitNodeMultipliers.CompanyWorkMoney;
    this.gainRatesForTask.hack =
      companyPosition.hackingExpGain *
      company.expMultiplier *
      this.mults.hacking_exp *
      BitNodeMultipliers.CompanyWorkExpGain;
    this.gainRatesForTask.str =
      companyPosition.strengthExpGain *
      company.expMultiplier *
      this.mults.strength_exp *
      BitNodeMultipliers.CompanyWorkExpGain;
    this.gainRatesForTask.def =
      companyPosition.defenseExpGain *
      company.expMultiplier *
      this.mults.defense_exp *
      BitNodeMultipliers.CompanyWorkExpGain;
    this.gainRatesForTask.dex =
      companyPosition.dexterityExpGain *
      company.expMultiplier *
      this.mults.dexterity_exp *
      BitNodeMultipliers.CompanyWorkExpGain;
    this.gainRatesForTask.agi =
      companyPosition.agilityExpGain *
      company.expMultiplier *
      this.mults.agility_exp *
      BitNodeMultipliers.CompanyWorkExpGain;
    this.gainRatesForTask.cha =
      companyPosition.charismaExpGain *
      company.expMultiplier *
      this.mults.charisma_exp *
      BitNodeMultipliers.CompanyWorkExpGain;

    this.currentTaskLocation = companyName;
    this.currentTask = SleeveTaskType.Company;

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

    if (this.currentTask !== SleeveTaskType.Idle) {
      this.finishTask(p);
    } else {
      this.resetTaskStatus(p);
    }

    const factionInfo = faction.getInfo();

    // Set type of work (hacking/field/security), and the experience gains
    const sanitizedWorkType: string = workType.toLowerCase();
    if (sanitizedWorkType.includes("hack")) {
      if (!factionInfo.offerHackingWork) {
        return false;
      }
      this.factionWorkType = FactionWorkType.HACKING;
      this.gainRatesForTask.hack = 0.15 * this.mults.hacking_exp * BitNodeMultipliers.FactionWorkExpGain;
    } else if (sanitizedWorkType.includes("field")) {
      if (!factionInfo.offerFieldWork) {
        return false;
      }
      this.factionWorkType = FactionWorkType.FIELD;
      this.gainRatesForTask.hack = 0.1 * this.mults.hacking_exp * BitNodeMultipliers.FactionWorkExpGain;
      this.gainRatesForTask.str = 0.1 * this.mults.strength_exp * BitNodeMultipliers.FactionWorkExpGain;
      this.gainRatesForTask.def = 0.1 * this.mults.defense_exp * BitNodeMultipliers.FactionWorkExpGain;
      this.gainRatesForTask.dex = 0.1 * this.mults.dexterity_exp * BitNodeMultipliers.FactionWorkExpGain;
      this.gainRatesForTask.agi = 0.1 * this.mults.agility_exp * BitNodeMultipliers.FactionWorkExpGain;
      this.gainRatesForTask.cha = 0.1 * this.mults.charisma_exp * BitNodeMultipliers.FactionWorkExpGain;
    } else if (sanitizedWorkType.includes("security")) {
      if (!factionInfo.offerSecurityWork) {
        return false;
      }
      this.factionWorkType = FactionWorkType.SECURITY;
      this.gainRatesForTask.hack = 0.1 * this.mults.hacking_exp * BitNodeMultipliers.FactionWorkExpGain;
      this.gainRatesForTask.str = 0.15 * this.mults.strength_exp * BitNodeMultipliers.FactionWorkExpGain;
      this.gainRatesForTask.def = 0.15 * this.mults.defense_exp * BitNodeMultipliers.FactionWorkExpGain;
      this.gainRatesForTask.dex = 0.15 * this.mults.dexterity_exp * BitNodeMultipliers.FactionWorkExpGain;
      this.gainRatesForTask.agi = 0.15 * this.mults.agility_exp * BitNodeMultipliers.FactionWorkExpGain;
    } else {
      return false;
    }

    this.currentTaskLocation = factionName;
    this.currentTask = SleeveTaskType.Faction;

    return true;
  }

  /**
   * Begin a gym workout task
   */
  workoutAtGym(p: IPlayer, gymName: string, stat: string): boolean {
    if (this.currentTask !== SleeveTaskType.Idle) {
      this.finishTask(p);
    } else {
      this.resetTaskStatus(p);
    }

    // Set exp/money multipliers based on which university.
    // Also check that the sleeve is in the right city
    let costMult = 1;
    switch (gymName.toLowerCase()) {
      case LocationName.AevumCrushFitnessGym.toLowerCase():
        if (this.city != CityName.Aevum) {
          return false;
        }
        this.currentTaskLocation = LocationName.AevumCrushFitnessGym;
        costMult = 3;
        break;
      case LocationName.AevumSnapFitnessGym.toLowerCase():
        if (this.city != CityName.Aevum) {
          return false;
        }
        this.currentTaskLocation = LocationName.AevumSnapFitnessGym;
        costMult = 10;
        break;
      case LocationName.Sector12IronGym.toLowerCase():
        if (this.city != CityName.Sector12) {
          return false;
        }
        this.currentTaskLocation = LocationName.Sector12IronGym;
        costMult = 1;
        break;
      case LocationName.Sector12PowerhouseGym.toLowerCase():
        if (this.city != CityName.Sector12) {
          return false;
        }
        this.currentTaskLocation = LocationName.Sector12PowerhouseGym;
        costMult = 20;
        break;
      case LocationName.VolhavenMilleniumFitnessGym.toLowerCase():
        if (this.city != CityName.Volhaven) {
          return false;
        }
        this.currentTaskLocation = LocationName.VolhavenMilleniumFitnessGym;
        costMult = 7;
        break;
      default:
        return false;
    }

    // Set experience/money gains based on class
    const sanitizedStat: string = stat.toLowerCase();

    // set stat to a default value.
    stat = "none";
    if (sanitizedStat.includes("str")) {
      stat = "str";
    }
    if (sanitizedStat.includes("def")) {
      stat = "def";
    }
    if (sanitizedStat.includes("dex")) {
      stat = "dex";
    }
    if (sanitizedStat.includes("agi")) {
      stat = "agi";
    }
    // if stat is still equals its default value, then validation has failed.
    if (stat === "none") {
      return false;
    }

    // Set cost
    this.gainRatesForTask.money = -1 * (CONSTANTS.ClassGymBaseCost * costMult);
    this.gymStatType = stat;
    this.currentTask = SleeveTaskType.Gym;

    return true;
  }

  /**
   * Begin a bladeburner task
   */
  bladeburner(p: IPlayer, action: string, contract: string): boolean {
    if (this.currentTask !== SleeveTaskType.Idle) {
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
        time = this.getBladeburnerActionTime(p, "General", action);
        this.gainRatesForTask.hack = 20 * this.mults.hacking_exp;
        this.gainRatesForTask.cha = 20 * this.mults.charisma_exp;
        break;
      case "Recruitment":
        time = this.getBladeburnerActionTime(p, "General", action);
        this.gainRatesForTask.cha =
          2 * BladeburnerConstants.BaseStatGain * (p.bladeburner?.getRecruitmentTime(this) ?? 0) * 1000;
        this.currentTaskLocation = `(Success Rate: ${numeralWrapper.formatPercentage(
          this.recruitmentSuccessChance(p),
        )})`;
        break;
      case "Diplomacy":
        time = this.getBladeburnerActionTime(p, "General", action);
        break;
      case "Infiltrate synthoids":
        time = 60000;
        this.currentTaskLocation = "This will generate additional contracts and operations";
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
