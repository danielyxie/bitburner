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

import {
  AugmentPair,
  Sleeve as ISleeve,
  SleeveInformation,
  SleeveSkills,
  SleeveTask,
} from "../ScriptEditor/NetscriptDefinitions";

export function NetscriptSleeve(player: IPlayer, workerScript: WorkerScript, helper: INetscriptHelper): ISleeve {
  const checkSleeveAPIAccess = function (func: string): void {
    if (player.bitNodeN !== 10 && !SourceFileFlags[10]) {
      throw helper.makeRuntimeErrorMsg(
        `sleeve.${func}`,
        "You do not currently have access to the Sleeve API. This is either because you are not in BitNode-10 or because you do not have Source-File 10",
      );
    }
  };

  const checkSleeveNumber = function (func: string, sleeveNumber: number): void {
    if (sleeveNumber >= player.sleeves.length || sleeveNumber < 0) {
      const msg = `Invalid sleeve number: ${sleeveNumber}`;
      workerScript.log(func, () => msg);
      throw helper.makeRuntimeErrorMsg(`sleeve.${func}`, msg);
    }
  };

  const getSleeveStats = function (sleeveNumber: number): SleeveSkills {
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
  };

  return {
    getNumSleeves: function (): number {
      helper.updateDynamicRam("getNumSleeves", getRamCost(player, "sleeve", "getNumSleeves"));
      checkSleeveAPIAccess("getNumSleeves");
      return player.sleeves.length;
    },
    setToShockRecovery: function (_sleeveNumber: unknown): boolean {
      const sleeveNumber = helper.number("setToShockRecovery", "sleeveNumber", _sleeveNumber);
      helper.updateDynamicRam("setToShockRecovery", getRamCost(player, "sleeve", "setToShockRecovery"));
      checkSleeveAPIAccess("setToShockRecovery");
      checkSleeveNumber("setToShockRecovery", sleeveNumber);
      return player.sleeves[sleeveNumber].shockRecovery(player);
    },
    setToSynchronize: function (_sleeveNumber: unknown): boolean {
      const sleeveNumber = helper.number("setToSynchronize", "sleeveNumber", _sleeveNumber);
      helper.updateDynamicRam("setToSynchronize", getRamCost(player, "sleeve", "setToSynchronize"));
      checkSleeveAPIAccess("setToSynchronize");
      checkSleeveNumber("setToSynchronize", sleeveNumber);
      return player.sleeves[sleeveNumber].synchronize(player);
    },
    setToCommitCrime: function (_sleeveNumber: unknown, _crimeRoughName: unknown): boolean {
      const sleeveNumber = helper.number("setToCommitCrime", "sleeveNumber", _sleeveNumber);
      const crimeRoughName = helper.string("setToCommitCrime", "crimeName", _crimeRoughName);
      helper.updateDynamicRam("setToCommitCrime", getRamCost(player, "sleeve", "setToCommitCrime"));
      checkSleeveAPIAccess("setToCommitCrime");
      checkSleeveNumber("setToCommitCrime", sleeveNumber);
      const crime = findCrime(crimeRoughName);
      if (crime === null) {
        return false;
      }
      return player.sleeves[sleeveNumber].commitCrime(player, crime.name);
    },
    setToUniversityCourse: function (_sleeveNumber: unknown, _universityName: unknown, _className: unknown): boolean {
      const sleeveNumber = helper.number("setToUniversityCourse", "sleeveNumber", _sleeveNumber);
      const universityName = helper.string("setToUniversityCourse", "universityName", _universityName);
      const className = helper.string("setToUniversityCourse", "className", _className);
      helper.updateDynamicRam("setToUniversityCourse", getRamCost(player, "sleeve", "setToUniversityCourse"));
      checkSleeveAPIAccess("setToUniversityCourse");
      checkSleeveNumber("setToUniversityCourse", sleeveNumber);
      return player.sleeves[sleeveNumber].takeUniversityCourse(player, universityName, className);
    },
    travel: function (_sleeveNumber: unknown, _cityName: unknown): boolean {
      const sleeveNumber = helper.number("travel", "sleeveNumber", _sleeveNumber);
      const cityName = helper.string("setToUniversityCourse", "cityName", _cityName);
      helper.updateDynamicRam("travel", getRamCost(player, "sleeve", "travel"));
      checkSleeveAPIAccess("travel");
      checkSleeveNumber("travel", sleeveNumber);
      return player.sleeves[sleeveNumber].travel(player, cityName as CityName);
    },
    setToCompanyWork: function (_sleeveNumber: unknown, acompanyName: unknown): boolean {
      const sleeveNumber = helper.number("setToCompanyWork", "sleeveNumber", _sleeveNumber);
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
    setToFactionWork: function (_sleeveNumber: unknown, _factionName: unknown, _workType: unknown): boolean {
      const sleeveNumber = helper.number("setToFactionWork", "sleeveNumber", _sleeveNumber);
      const factionName = helper.string("setToUniversityCourse", "factionName", _factionName);
      const workType = helper.string("setToUniversityCourse", "workType", _workType);
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
    setToGymWorkout: function (_sleeveNumber: unknown, _gymName: unknown, _stat: unknown): boolean {
      const sleeveNumber = helper.number("setToGymWorkout", "sleeveNumber", _sleeveNumber);
      const gymName = helper.string("setToUniversityCourse", "gymName", _gymName);
      const stat = helper.string("setToUniversityCourse", "stat", _stat);
      helper.updateDynamicRam("setToGymWorkout", getRamCost(player, "sleeve", "setToGymWorkout"));
      checkSleeveAPIAccess("setToGymWorkout");
      checkSleeveNumber("setToGymWorkout", sleeveNumber);

      return player.sleeves[sleeveNumber].workoutAtGym(player, gymName, stat);
    },
    getSleeveStats: function (_sleeveNumber: unknown): SleeveSkills {
      const sleeveNumber = helper.number("getSleeveStats", "sleeveNumber", _sleeveNumber);
      helper.updateDynamicRam("getSleeveStats", getRamCost(player, "sleeve", "getSleeveStats"));
      checkSleeveAPIAccess("getSleeveStats");
      checkSleeveNumber("getSleeveStats", sleeveNumber);
      return getSleeveStats(sleeveNumber);
    },
    getTask: function (_sleeveNumber: unknown): SleeveTask {
      const sleeveNumber = helper.number("getTask", "sleeveNumber", _sleeveNumber);
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
    getInformation: function (_sleeveNumber: unknown): SleeveInformation {
      const sleeveNumber = helper.number("getInformation", "sleeveNumber", _sleeveNumber);
      helper.updateDynamicRam("getInformation", getRamCost(player, "sleeve", "getInformation"));
      checkSleeveAPIAccess("getInformation");
      checkSleeveNumber("getInformation", sleeveNumber);

      const sl = player.sleeves[sleeveNumber];
      return {
        tor: false,
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
    getSleeveAugmentations: function (_sleeveNumber: unknown): string[] {
      const sleeveNumber = helper.number("getSleeveAugmentations", "sleeveNumber", _sleeveNumber);
      helper.updateDynamicRam("getSleeveAugmentations", getRamCost(player, "sleeve", "getSleeveAugmentations"));
      checkSleeveAPIAccess("getSleeveAugmentations");
      checkSleeveNumber("getSleeveAugmentations", sleeveNumber);

      const augs = [];
      for (let i = 0; i < player.sleeves[sleeveNumber].augmentations.length; i++) {
        augs.push(player.sleeves[sleeveNumber].augmentations[i].name);
      }
      return augs;
    },
    getSleevePurchasableAugs: function (_sleeveNumber: unknown): AugmentPair[] {
      const sleeveNumber = helper.number("getSleevePurchasableAugs", "sleeveNumber", _sleeveNumber);
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
    purchaseSleeveAug: function (_sleeveNumber: unknown, _augName: unknown): boolean {
      const sleeveNumber = helper.number("purchaseSleeveAug", "sleeveNumber", _sleeveNumber);
      const augName = helper.string("purchaseSleeveAug", "augName", _augName);
      helper.updateDynamicRam("purchaseSleeveAug", getRamCost(player, "sleeve", "purchaseSleeveAug"));
      checkSleeveAPIAccess("purchaseSleeveAug");
      checkSleeveNumber("purchaseSleeveAug", sleeveNumber);

      if (getSleeveStats(sleeveNumber).shock > 0) {
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
