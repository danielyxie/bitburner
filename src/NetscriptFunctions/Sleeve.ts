import { INetscriptHelper } from "./INetscriptHelper";
import { IPlayer } from "../PersonObjects/IPlayer";
import { getRamCost } from "../Netscript/RamCostGenerator";
import { FactionWorkType } from "../Faction/FactionWorkTypeEnum";
import { SourceFileFlags } from "../SourceFile/SourceFileFlags";
import { SleeveTaskType } from "../PersonObjects/Sleeve/SleeveTaskTypesEnum";
import { WorkerScript } from "../Netscript/WorkerScript";
import { findSleevePurchasableAugs } from "../PersonObjects/Sleeve/SleeveHelpers";
import { Augmentations } from "../Augmentation/Augmentations";
import { CityName } from "../Locations/data/CityNames";
import { findCrime } from "../Crime/CrimeHelpers";

import { Sleeve as ISleeve } from "../ScriptEditor/NetscriptDefinitions";

export function NetscriptSleeve(player: IPlayer, workerScript: WorkerScript, helper: INetscriptHelper): ISleeve {
  const checkSleeveAPIAccess = function (func: any): void {
    if (player.bitNodeN !== 10 && !SourceFileFlags[10]) {
      throw helper.makeRuntimeErrorMsg(
        `sleeve.${func}`,
        "You do not currently have access to the Sleeve API. This is either because you are not in BitNode-10 or because you do not have Source-File 10",
      );
    }
  };

  const checkSleeveNumber = function (func: any, sleeveNumber: any): void {
    if (sleeveNumber >= player.sleeves.length || sleeveNumber < 0) {
      const msg = `Invalid sleeve number: ${sleeveNumber}`;
      workerScript.log(func, () => msg);
      throw helper.makeRuntimeErrorMsg(`sleeve.${func}`, msg);
    }
  };

  return {
    getNumSleeves: function (): number {
      helper.updateDynamicRam("getNumSleeves", getRamCost(player, "sleeve", "getNumSleeves"));
      checkSleeveAPIAccess("getNumSleeves");
      return player.sleeves.length;
    },
    setToShockRecovery: function (asleeveNumber: any = 0): boolean {
      const sleeveNumber = helper.number("setToShockRecovery", "sleeveNumber", asleeveNumber);
      helper.updateDynamicRam("setToShockRecovery", getRamCost(player, "sleeve", "setToShockRecovery"));
      checkSleeveAPIAccess("setToShockRecovery");
      checkSleeveNumber("setToShockRecovery", sleeveNumber);
      return player.sleeves[sleeveNumber].shockRecovery(player);
    },
    setToSynchronize: function (asleeveNumber: any = 0): boolean {
      const sleeveNumber = helper.number("setToSynchronize", "sleeveNumber", asleeveNumber);
      helper.updateDynamicRam("setToSynchronize", getRamCost(player, "sleeve", "setToSynchronize"));
      checkSleeveAPIAccess("setToSynchronize");
      checkSleeveNumber("setToSynchronize", sleeveNumber);
      return player.sleeves[sleeveNumber].synchronize(player);
    },
    setToCommitCrime: function (asleeveNumber: any = 0, aCrimeRoughName: any = ""): boolean {
      const sleeveNumber = helper.number("setToCommitCrime", "sleeveNumber", asleeveNumber);
      const crimeRoughName = helper.string("setToCommitCrime", "crimeName", aCrimeRoughName);
      helper.updateDynamicRam("setToCommitCrime", getRamCost(player, "sleeve", "setToCommitCrime"));
      checkSleeveAPIAccess("setToCommitCrime");
      checkSleeveNumber("setToCommitCrime", sleeveNumber);
      const crime = findCrime(crimeRoughName);
      if (crime === null) {
        return false;
      }
      return player.sleeves[sleeveNumber].commitCrime(player, crime.name);
    },
    setToUniversityCourse: function (asleeveNumber: any = 0, auniversityName: any = "", aclassName: any = ""): boolean {
      const sleeveNumber = helper.number("setToUniversityCourse", "sleeveNumber", asleeveNumber);
      const universityName = helper.string("setToUniversityCourse", "universityName", auniversityName);
      const className = helper.string("setToUniversityCourse", "className", aclassName);
      helper.updateDynamicRam("setToUniversityCourse", getRamCost(player, "sleeve", "setToUniversityCourse"));
      checkSleeveAPIAccess("setToUniversityCourse");
      checkSleeveNumber("setToUniversityCourse", sleeveNumber);
      return player.sleeves[sleeveNumber].takeUniversityCourse(player, universityName, className);
    },
    travel: function (asleeveNumber: any = 0, acityName: any = ""): boolean {
      const sleeveNumber = helper.number("travel", "sleeveNumber", asleeveNumber);
      const cityName = helper.string("setToUniversityCourse", "cityName", acityName);
      helper.updateDynamicRam("travel", getRamCost(player, "sleeve", "travel"));
      checkSleeveAPIAccess("travel");
      checkSleeveNumber("travel", sleeveNumber);
      return player.sleeves[sleeveNumber].travel(player, cityName as CityName);
    },
    setToCompanyWork: function (asleeveNumber: any = 0, acompanyName: any = ""): boolean {
      const sleeveNumber = helper.number("setToCompanyWork", "sleeveNumber", asleeveNumber);
      const companyName = helper.string("setToUniversityCourse", "companyName", acompanyName);
      helper.updateDynamicRam("setToCompanyWork", getRamCost(player, "sleeve", "setToCompanyWork"));
      checkSleeveAPIAccess("setToCompanyWork");
      checkSleeveNumber("setToCompanyWork", sleeveNumber);

      // Cannot work at the same company that another sleeve is working at
      for (let i = 0; i < player.sleeves.length; ++i) {
        if (i === sleeveNumber) {
          continue;
        }
        const other = player.sleeves[i];
        if (other.currentTask === SleeveTaskType.Company && other.currentTaskLocation === companyName) {
          throw helper.makeRuntimeErrorMsg(
            "sleeve.setToFactionWork",
            `Sleeve ${sleeveNumber} cannot work for company ${companyName} because Sleeve ${i} is already working for them.`,
          );
        }
      }

      return player.sleeves[sleeveNumber].workForCompany(player, companyName);
    },
    setToFactionWork: function (asleeveNumber: any = 0, afactionName: any = "", aworkType: any = ""): boolean {
      const sleeveNumber = helper.number("setToFactionWork", "sleeveNumber", asleeveNumber);
      const factionName = helper.string("setToUniversityCourse", "factionName", afactionName);
      const workType = helper.string("setToUniversityCourse", "workType", aworkType);
      helper.updateDynamicRam("setToFactionWork", getRamCost(player, "sleeve", "setToFactionWork"));
      checkSleeveAPIAccess("setToFactionWork");
      checkSleeveNumber("setToFactionWork", sleeveNumber);

      // Cannot work at the same faction that another sleeve is working at
      for (let i = 0; i < player.sleeves.length; ++i) {
        if (i === sleeveNumber) {
          continue;
        }
        const other = player.sleeves[i];
        if (other.currentTask === SleeveTaskType.Faction && other.currentTaskLocation === factionName) {
          throw helper.makeRuntimeErrorMsg(
            "sleeve.setToFactionWork",
            `Sleeve ${sleeveNumber} cannot work for faction ${factionName} because Sleeve ${i} is already working for them.`,
          );
        }
      }

      return player.sleeves[sleeveNumber].workForFaction(player, factionName, workType);
    },
    setToGymWorkout: function (asleeveNumber: any = 0, agymName: any = "", astat: any = ""): boolean {
      const sleeveNumber = helper.number("setToGymWorkout", "sleeveNumber", asleeveNumber);
      const gymName = helper.string("setToUniversityCourse", "gymName", agymName);
      const stat = helper.string("setToUniversityCourse", "stat", astat);
      helper.updateDynamicRam("setToGymWorkout", getRamCost(player, "sleeve", "setToGymWorkout"));
      checkSleeveAPIAccess("setToGymWorkout");
      checkSleeveNumber("setToGymWorkout", sleeveNumber);

      return player.sleeves[sleeveNumber].workoutAtGym(player, gymName, stat);
    },
    getSleeveStats: function (asleeveNumber: any = 0): {
      shock: number;
      sync: number;
      hacking: number;
      strength: number;
      defense: number;
      dexterity: number;
      agility: number;
      charisma: number;
    } {
      const sleeveNumber = helper.number("getSleeveStats", "sleeveNumber", asleeveNumber);
      helper.updateDynamicRam("getSleeveStats", getRamCost(player, "sleeve", "getSleeveStats"));
      checkSleeveAPIAccess("getSleeveStats");
      checkSleeveNumber("getSleeveStats", sleeveNumber);

      const sl = player.sleeves[sleeveNumber];
      return {
        shock: 100 - sl.shock,
        sync: sl.sync,
        hacking: sl.hacking,
        strength: sl.strength,
        defense: sl.defense,
        dexterity: sl.dexterity,
        agility: sl.agility,
        charisma: sl.charisma,
      };
    },
    getTask: function (asleeveNumber: any = 0): {
      task: string;
      crime: string;
      location: string;
      gymStatType: string;
      factionWorkType: string;
    } {
      const sleeveNumber = helper.number("getTask", "sleeveNumber", asleeveNumber);
      helper.updateDynamicRam("getTask", getRamCost(player, "sleeve", "getTask"));
      checkSleeveAPIAccess("getTask");
      checkSleeveNumber("getTask", sleeveNumber);

      const sl = player.sleeves[sleeveNumber];
      return {
        task: SleeveTaskType[sl.currentTask],
        crime: sl.crimeType,
        location: sl.currentTaskLocation,
        gymStatType: sl.gymStatType,
        factionWorkType: FactionWorkType[sl.factionWorkType],
      };
    },
    getInformation: function (asleeveNumber: any = 0): any {
      const sleeveNumber = helper.number("getInformation", "sleeveNumber", asleeveNumber);
      helper.updateDynamicRam("getInformation", getRamCost(player, "sleeve", "getInformation"));
      checkSleeveAPIAccess("getInformation");
      checkSleeveNumber("getInformation", sleeveNumber);

      const sl = player.sleeves[sleeveNumber];
      return {
        city: sl.city,
        hp: sl.hp,
        jobs: Object.keys(player.jobs), // technically sleeves have the same jobs as the player.
        jobTitle: Object.values(player.jobs),
        maxHp: sl.max_hp,

        mult: {
          agility: sl.agility_mult,
          agilityExp: sl.agility_exp_mult,
          charisma: sl.charisma_mult,
          charismaExp: sl.charisma_exp_mult,
          companyRep: sl.company_rep_mult,
          crimeMoney: sl.crime_money_mult,
          crimeSuccess: sl.crime_success_mult,
          defense: sl.defense_mult,
          defenseExp: sl.defense_exp_mult,
          dexterity: sl.dexterity_mult,
          dexterityExp: sl.dexterity_exp_mult,
          factionRep: sl.faction_rep_mult,
          hacking: sl.hacking_mult,
          hackingExp: sl.hacking_exp_mult,
          strength: sl.strength_mult,
          strengthExp: sl.strength_exp_mult,
          workMoney: sl.work_money_mult,
        },

        timeWorked: sl.currentTaskTime,
        earningsForSleeves: {
          workHackExpGain: sl.earningsForSleeves.hack,
          workStrExpGain: sl.earningsForSleeves.str,
          workDefExpGain: sl.earningsForSleeves.def,
          workDexExpGain: sl.earningsForSleeves.dex,
          workAgiExpGain: sl.earningsForSleeves.agi,
          workChaExpGain: sl.earningsForSleeves.cha,
          workMoneyGain: sl.earningsForSleeves.money,
        },
        earningsForPlayer: {
          workHackExpGain: sl.earningsForPlayer.hack,
          workStrExpGain: sl.earningsForPlayer.str,
          workDefExpGain: sl.earningsForPlayer.def,
          workDexExpGain: sl.earningsForPlayer.dex,
          workAgiExpGain: sl.earningsForPlayer.agi,
          workChaExpGain: sl.earningsForPlayer.cha,
          workMoneyGain: sl.earningsForPlayer.money,
        },
        earningsForTask: {
          workHackExpGain: sl.earningsForTask.hack,
          workStrExpGain: sl.earningsForTask.str,
          workDefExpGain: sl.earningsForTask.def,
          workDexExpGain: sl.earningsForTask.dex,
          workAgiExpGain: sl.earningsForTask.agi,
          workChaExpGain: sl.earningsForTask.cha,
          workMoneyGain: sl.earningsForTask.money,
        },
        workRepGain: sl.getRepGain(player),
      };
    },
    getSleeveAugmentations: function (asleeveNumber: any = 0): string[] {
      const sleeveNumber = helper.number("getSleeveAugmentations", "sleeveNumber", asleeveNumber);
      helper.updateDynamicRam("getSleeveAugmentations", getRamCost(player, "sleeve", "getSleeveAugmentations"));
      checkSleeveAPIAccess("getSleeveAugmentations");
      checkSleeveNumber("getSleeveAugmentations", sleeveNumber);

      const augs = [];
      for (let i = 0; i < player.sleeves[sleeveNumber].augmentations.length; i++) {
        augs.push(player.sleeves[sleeveNumber].augmentations[i].name);
      }
      return augs;
    },
    getSleevePurchasableAugs: function (asleeveNumber: any = 0): {
      name: string;
      cost: number;
    }[] {
      const sleeveNumber = helper.number("getSleevePurchasableAugs", "sleeveNumber", asleeveNumber);
      helper.updateDynamicRam("getSleevePurchasableAugs", getRamCost(player, "sleeve", "getSleevePurchasableAugs"));
      checkSleeveAPIAccess("getSleevePurchasableAugs");
      checkSleeveNumber("getSleevePurchasableAugs", sleeveNumber);

      const purchasableAugs = findSleevePurchasableAugs(player.sleeves[sleeveNumber], player);
      const augs = [];
      for (let i = 0; i < purchasableAugs.length; i++) {
        const aug = purchasableAugs[i];
        augs.push({
          name: aug.name,
          cost: aug.startingCost,
        });
      }

      return augs;
    },
    purchaseSleeveAug: function (asleeveNumber: any = 0, aaugName: any = ""): boolean {
      const sleeveNumber = helper.number("purchaseSleeveAug", "sleeveNumber", asleeveNumber);
      const augName = helper.string("purchaseSleeveAug", "augName", aaugName);
      helper.updateDynamicRam("purchaseSleeveAug", getRamCost(player, "sleeve", "purchaseSleeveAug"));
      checkSleeveAPIAccess("purchaseSleeveAug");
      checkSleeveNumber("purchaseSleeveAug", sleeveNumber);

      if (player.sleeves[sleeveNumber].shock){
        throw helper.makeRuntimeErrorMsg("sleeve.purchaseSleeveAug", `Sleeve shock too high: Sleeve ${sleeveNumber}`);
      }

      const aug = Augmentations[augName];
      if (!aug) {
        throw helper.makeRuntimeErrorMsg("sleeve.purchaseSleeveAug", `Invalid aug: ${augName}`);
      }

      return player.sleeves[sleeveNumber].tryBuyAugmentation(player, aug);
    },
  };
}
