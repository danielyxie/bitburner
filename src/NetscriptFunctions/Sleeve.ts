import { Augmentations } from "../Augmentation/Augmentations";
import { findCrime } from "../Crime/CrimeHelpers";
import { FactionWorkType } from "../Faction/FactionWorkTypeEnum";
import { CityName } from "../Locations/data/CityNames";
import { getRamCost } from "../Netscript/RamCostGenerator";
import type { WorkerScript } from "../Netscript/WorkerScript";
import type { IPlayer } from "../PersonObjects/IPlayer";
import { findSleevePurchasableAugs } from "../PersonObjects/Sleeve/SleeveHelpers";
import { SleeveTaskType } from "../PersonObjects/Sleeve/SleeveTaskTypesEnum";
import type {
  AugmentPair,
  Sleeve as ISleeve,
  SleeveInformation,
  SleeveSkills,
  SleeveTask,
} from "../ScriptEditor/NetscriptDefinitions";
import { checkEnum } from "../utils/helpers/checkEnum";

import type { INetscriptHelper } from "./INetscriptHelper";

export function NetscriptSleeve(player: IPlayer, workerScript: WorkerScript, helper: INetscriptHelper): ISleeve {
  const checkSleeveAPIAccess = function (func: string): void {
    if (player.bitNodeN !== 10 && !player.sourceFileLvl(10)) {
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

  const updateRam = (funcName: string): void =>
    helper.updateDynamicRam(funcName, getRamCost(player, "sleeve", funcName));

  return {
    getNumSleeves: function (): number {
      updateRam("getNumSleeves");
      checkSleeveAPIAccess("getNumSleeves");
      return player.sleeves.length;
    },
    setToShockRecovery: function (_sleeveNumber: unknown): boolean {
      updateRam("setToShockRecovery");
      const sleeveNumber = helper.number("setToShockRecovery", "sleeveNumber", _sleeveNumber);
      checkSleeveAPIAccess("setToShockRecovery");
      checkSleeveNumber("setToShockRecovery", sleeveNumber);
      return player.sleeves[sleeveNumber].shockRecovery(player);
    },
    setToSynchronize: function (_sleeveNumber: unknown): boolean {
      updateRam("setToSynchronize");
      const sleeveNumber = helper.number("setToSynchronize", "sleeveNumber", _sleeveNumber);
      checkSleeveAPIAccess("setToSynchronize");
      checkSleeveNumber("setToSynchronize", sleeveNumber);
      return player.sleeves[sleeveNumber].synchronize(player);
    },
    setToCommitCrime: function (_sleeveNumber: unknown, _crimeRoughName: unknown): boolean {
      updateRam("setToCommitCrime");
      const sleeveNumber = helper.number("setToCommitCrime", "sleeveNumber", _sleeveNumber);
      const crimeRoughName = helper.string("setToCommitCrime", "crimeName", _crimeRoughName);
      checkSleeveAPIAccess("setToCommitCrime");
      checkSleeveNumber("setToCommitCrime", sleeveNumber);
      const crime = findCrime(crimeRoughName);
      if (crime === null) {
        return false;
      }
      return player.sleeves[sleeveNumber].commitCrime(player, crime.name);
    },
    setToUniversityCourse: function (_sleeveNumber: unknown, _universityName: unknown, _className: unknown): boolean {
      updateRam("setToUniversityCourse");
      const sleeveNumber = helper.number("setToUniversityCourse", "sleeveNumber", _sleeveNumber);
      const universityName = helper.string("setToUniversityCourse", "universityName", _universityName);
      const className = helper.string("setToUniversityCourse", "className", _className);
      checkSleeveAPIAccess("setToUniversityCourse");
      checkSleeveNumber("setToUniversityCourse", sleeveNumber);
      return player.sleeves[sleeveNumber].takeUniversityCourse(player, universityName, className);
    },
    travel: function (_sleeveNumber: unknown, _cityName: unknown): boolean {
      updateRam("travel");
      const sleeveNumber = helper.number("travel", "sleeveNumber", _sleeveNumber);
      const cityName = helper.string("travel", "cityName", _cityName);
      checkSleeveAPIAccess("travel");
      checkSleeveNumber("travel", sleeveNumber);
      if (checkEnum(CityName, cityName)) {
        return player.sleeves[sleeveNumber].travel(player, cityName);
      } else {
        throw helper.makeRuntimeErrorMsg("sleeve.setToCompanyWork", `Invalid city name: '${cityName}'.`);
      }
    },
    setToCompanyWork: function (_sleeveNumber: unknown, acompanyName: unknown): boolean {
      updateRam("setToCompanyWork");
      const sleeveNumber = helper.number("setToCompanyWork", "sleeveNumber", _sleeveNumber);
      const companyName = helper.string("setToCompanyWork", "companyName", acompanyName);
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
            "sleeve.setToCompanyWork",
            `Sleeve ${sleeveNumber} cannot work for company ${companyName} because Sleeve ${i} is already working for them.`,
          );
        }
      }

      return player.sleeves[sleeveNumber].workForCompany(player, companyName);
    },
    setToFactionWork: function (
      _sleeveNumber: unknown,
      _factionName: unknown,
      _workType: unknown,
    ): boolean | undefined {
      updateRam("setToFactionWork");
      const sleeveNumber = helper.number("setToFactionWork", "sleeveNumber", _sleeveNumber);
      const factionName = helper.string("setToFactionWork", "factionName", _factionName);
      const workType = helper.string("setToFactionWork", "workType", _workType);
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

      if (player.gang && player.gang.facName == factionName) {
        throw helper.makeRuntimeErrorMsg(
          "sleeve.setToFactionWork",
          `Sleeve ${sleeveNumber} cannot work for faction ${factionName} because you have started a gang with them.`,
        );
      }

      return player.sleeves[sleeveNumber].workForFaction(player, factionName, workType);
    },
    setToGymWorkout: function (_sleeveNumber: unknown, _gymName: unknown, _stat: unknown): boolean {
      updateRam("setToGymWorkout");
      const sleeveNumber = helper.number("setToGymWorkout", "sleeveNumber", _sleeveNumber);
      const gymName = helper.string("setToGymWorkout", "gymName", _gymName);
      const stat = helper.string("setToGymWorkout", "stat", _stat);
      checkSleeveAPIAccess("setToGymWorkout");
      checkSleeveNumber("setToGymWorkout", sleeveNumber);

      return player.sleeves[sleeveNumber].workoutAtGym(player, gymName, stat);
    },
    getSleeveStats: function (_sleeveNumber: unknown): SleeveSkills {
      updateRam("getSleeveStats");
      const sleeveNumber = helper.number("getSleeveStats", "sleeveNumber", _sleeveNumber);
      checkSleeveAPIAccess("getSleeveStats");
      checkSleeveNumber("getSleeveStats", sleeveNumber);
      return getSleeveStats(sleeveNumber);
    },
    getTask: function (_sleeveNumber: unknown): SleeveTask {
      updateRam("getTask");
      const sleeveNumber = helper.number("getTask", "sleeveNumber", _sleeveNumber);
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
      updateRam("getInformation");
      const sleeveNumber = helper.number("getInformation", "sleeveNumber", _sleeveNumber);
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
      updateRam("getSleeveAugmentations");
      const sleeveNumber = helper.number("getSleeveAugmentations", "sleeveNumber", _sleeveNumber);
      checkSleeveAPIAccess("getSleeveAugmentations");
      checkSleeveNumber("getSleeveAugmentations", sleeveNumber);

      const augs = [];
      for (let i = 0; i < player.sleeves[sleeveNumber].augmentations.length; i++) {
        augs.push(player.sleeves[sleeveNumber].augmentations[i].name);
      }
      return augs;
    },
    getSleevePurchasableAugs: function (_sleeveNumber: unknown): AugmentPair[] {
      updateRam("getSleevePurchasableAugs");
      const sleeveNumber = helper.number("getSleevePurchasableAugs", "sleeveNumber", _sleeveNumber);
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
      updateRam("purchaseSleeveAug");
      const sleeveNumber = helper.number("purchaseSleeveAug", "sleeveNumber", _sleeveNumber);
      const augName = helper.string("purchaseSleeveAug", "augName", _augName);
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
