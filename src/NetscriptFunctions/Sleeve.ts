import { IPlayer } from "../PersonObjects/IPlayer";
import { findSleevePurchasableAugs } from "../PersonObjects/Sleeve/SleeveHelpers";
import { StaticAugmentations } from "../Augmentation/StaticAugmentations";
import { CityName } from "../Locations/data/CityNames";
import { findCrime } from "../Crime/CrimeHelpers";
import { Augmentation } from "../Augmentation/Augmentation";

import {
  AugmentPair,
  Sleeve as ISleeve,
  SleeveInformation,
  SleeveSkills,
  SleeveTask,
} from "../ScriptEditor/NetscriptDefinitions";
import { checkEnum } from "../utils/helpers/checkEnum";
import { InternalAPI, NetscriptContext } from "../Netscript/APIWrapper";
import { isSleeveBladeburnerWork } from "../PersonObjects/Sleeve/Work/SleeveBladeburnerWork";
import { isSleeveFactionWork } from "../PersonObjects/Sleeve/Work/SleeveFactionWork";
import { isSleeveCompanyWork } from "../PersonObjects/Sleeve/Work/SleeveCompanyWork";
import { helpers } from "../Netscript/NetscriptHelpers";

export function NetscriptSleeve(player: IPlayer): InternalAPI<ISleeve> {
  const checkSleeveAPIAccess = function (ctx: NetscriptContext): void {
    if (player.bitNodeN !== 10 && !player.sourceFileLvl(10)) {
      throw helpers.makeRuntimeErrorMsg(
        ctx,
        "You do not currently have access to the Sleeve API. This is either because you are not in BitNode-10 or because you do not have Source-File 10",
      );
    }
  };

  const checkSleeveNumber = function (ctx: NetscriptContext, sleeveNumber: number): void {
    if (sleeveNumber >= player.sleeves.length || sleeveNumber < 0) {
      const msg = `Invalid sleeve number: ${sleeveNumber}`;
      ctx.log(() => msg);
      throw helpers.makeRuntimeErrorMsg(ctx, msg);
    }
  };

  const getSleeveStats = function (sleeveNumber: number): SleeveSkills {
    const sl = player.sleeves[sleeveNumber];
    return {
      shock: 100 - sl.shock,
      sync: sl.sync,
      memory: sl.memory,
      hacking: sl.skills.hacking,
      strength: sl.skills.strength,
      defense: sl.skills.defense,
      dexterity: sl.skills.dexterity,
      agility: sl.skills.agility,
      charisma: sl.skills.charisma,
    };
  };

  return {
    getNumSleeves: (ctx: NetscriptContext) => (): number => {
      checkSleeveAPIAccess(ctx);
      return player.sleeves.length;
    },
    setToShockRecovery:
      (ctx: NetscriptContext) =>
      (_sleeveNumber: unknown): boolean => {
        const sleeveNumber = helpers.number(ctx, "sleeveNumber", _sleeveNumber);
        checkSleeveAPIAccess(ctx);
        checkSleeveNumber(ctx, sleeveNumber);
        return player.sleeves[sleeveNumber].shockRecovery(player);
      },
    setToSynchronize:
      (ctx: NetscriptContext) =>
      (_sleeveNumber: unknown): boolean => {
        const sleeveNumber = helpers.number(ctx, "sleeveNumber", _sleeveNumber);
        checkSleeveAPIAccess(ctx);
        checkSleeveNumber(ctx, sleeveNumber);
        return player.sleeves[sleeveNumber].synchronize(player);
      },
    setToCommitCrime:
      (ctx: NetscriptContext) =>
      (_sleeveNumber: unknown, _crimeRoughName: unknown): boolean => {
        const sleeveNumber = helpers.number(ctx, "sleeveNumber", _sleeveNumber);
        const crimeRoughName = helpers.string(ctx, "crimeName", _crimeRoughName);
        checkSleeveAPIAccess(ctx);
        checkSleeveNumber(ctx, sleeveNumber);
        const crime = findCrime(crimeRoughName);
        if (crime === null) {
          return false;
        }
        return player.sleeves[sleeveNumber].commitCrime(player, crime.name);
      },
    setToUniversityCourse:
      (ctx: NetscriptContext) =>
      (_sleeveNumber: unknown, _universityName: unknown, _className: unknown): boolean => {
        const sleeveNumber = helpers.number(ctx, "sleeveNumber", _sleeveNumber);
        const universityName = helpers.string(ctx, "universityName", _universityName);
        const className = helpers.string(ctx, "className", _className);
        checkSleeveAPIAccess(ctx);
        checkSleeveNumber(ctx, sleeveNumber);
        return player.sleeves[sleeveNumber].takeUniversityCourse(player, universityName, className);
      },
    travel:
      (ctx: NetscriptContext) =>
      (_sleeveNumber: unknown, _cityName: unknown): boolean => {
        const sleeveNumber = helpers.number(ctx, "sleeveNumber", _sleeveNumber);
        const cityName = helpers.string(ctx, "cityName", _cityName);
        checkSleeveAPIAccess(ctx);
        checkSleeveNumber(ctx, sleeveNumber);
        if (checkEnum(CityName, cityName)) {
          return player.sleeves[sleeveNumber].travel(player, cityName);
        } else {
          throw helpers.makeRuntimeErrorMsg(ctx, `Invalid city name: '${cityName}'.`);
        }
      },
    setToCompanyWork:
      (ctx: NetscriptContext) =>
      (_sleeveNumber: unknown, acompanyName: unknown): boolean => {
        const sleeveNumber = helpers.number(ctx, "sleeveNumber", _sleeveNumber);
        const companyName = helpers.string(ctx, "companyName", acompanyName);
        checkSleeveAPIAccess(ctx);
        checkSleeveNumber(ctx, sleeveNumber);

        // Cannot work at the same company that another sleeve is working at
        for (let i = 0; i < player.sleeves.length; ++i) {
          if (i === sleeveNumber) {
            continue;
          }
          const other = player.sleeves[i];
          if (isSleeveCompanyWork(other.currentWork) && other.currentWork.companyName === companyName) {
            throw helpers.makeRuntimeErrorMsg(
              ctx,
              `Sleeve ${sleeveNumber} cannot work for company ${companyName} because Sleeve ${i} is already working for them.`,
            );
          }
        }

        return player.sleeves[sleeveNumber].workForCompany(player, companyName);
      },
    setToFactionWork:
      (ctx: NetscriptContext) =>
      (_sleeveNumber: unknown, _factionName: unknown, _workType: unknown): boolean | undefined => {
        const sleeveNumber = helpers.number(ctx, "sleeveNumber", _sleeveNumber);
        const factionName = helpers.string(ctx, "factionName", _factionName);
        const workType = helpers.string(ctx, "workType", _workType);
        checkSleeveAPIAccess(ctx);
        checkSleeveNumber(ctx, sleeveNumber);

        // Cannot work at the same faction that another sleeve is working at
        for (let i = 0; i < player.sleeves.length; ++i) {
          if (i === sleeveNumber) {
            continue;
          }
          const other = player.sleeves[i];
          if (isSleeveFactionWork(other.currentWork) && other.currentWork.factionName === factionName) {
            throw helpers.makeRuntimeErrorMsg(
              ctx,
              `Sleeve ${sleeveNumber} cannot work for faction ${factionName} because Sleeve ${i} is already working for them.`,
            );
          }
        }

        if (player.gang && player.gang.facName == factionName) {
          throw helpers.makeRuntimeErrorMsg(
            ctx,
            `Sleeve ${sleeveNumber} cannot work for faction ${factionName} because you have started a gang with them.`,
          );
        }

        return player.sleeves[sleeveNumber].workForFaction(player, factionName, workType);
      },
    setToGymWorkout:
      (ctx: NetscriptContext) =>
      (_sleeveNumber: unknown, _gymName: unknown, _stat: unknown): boolean => {
        const sleeveNumber = helpers.number(ctx, "sleeveNumber", _sleeveNumber);
        const gymName = helpers.string(ctx, "gymName", _gymName);
        const stat = helpers.string(ctx, "stat", _stat);
        checkSleeveAPIAccess(ctx);
        checkSleeveNumber(ctx, sleeveNumber);

        return player.sleeves[sleeveNumber].workoutAtGym(player, gymName, stat);
      },
    getSleeveStats:
      (ctx: NetscriptContext) =>
      (_sleeveNumber: unknown): SleeveSkills => {
        const sleeveNumber = helpers.number(ctx, "sleeveNumber", _sleeveNumber);
        checkSleeveAPIAccess(ctx);
        checkSleeveNumber(ctx, sleeveNumber);
        return getSleeveStats(sleeveNumber);
      },
    getTask:
      (ctx: NetscriptContext) =>
      (_sleeveNumber: unknown): SleeveTask | null => {
        const sleeveNumber = helpers.number(ctx, "sleeveNumber", _sleeveNumber);
        checkSleeveAPIAccess(ctx);
        checkSleeveNumber(ctx, sleeveNumber);

        const sl = player.sleeves[sleeveNumber];
        if (sl.currentWork === null) return null;
        return sl.currentWork.APICopy();
      },
    getInformation:
      (ctx: NetscriptContext) =>
      (_sleeveNumber: unknown): SleeveInformation => {
        const sleeveNumber = helpers.number(ctx, "sleeveNumber", _sleeveNumber);
        checkSleeveAPIAccess(ctx);
        checkSleeveNumber(ctx, sleeveNumber);

        const sl = player.sleeves[sleeveNumber];
        return {
          tor: false,
          city: sl.city,
          hp: sl.hp,
          jobs: Object.keys(player.jobs), // technically sleeves have the same jobs as the player.
          jobTitle: Object.values(player.jobs),

          mult: {
            agility: sl.mults.agility,
            agilityExp: sl.mults.agility_exp,
            charisma: sl.mults.charisma,
            charismaExp: sl.mults.charisma_exp,
            companyRep: sl.mults.company_rep,
            crimeMoney: sl.mults.crime_money,
            crimeSuccess: sl.mults.crime_success,
            defense: sl.mults.defense,
            defenseExp: sl.mults.defense_exp,
            dexterity: sl.mults.dexterity,
            dexterityExp: sl.mults.dexterity_exp,
            factionRep: sl.mults.faction_rep,
            hacking: sl.mults.hacking,
            hackingExp: sl.mults.hacking_exp,
            strength: sl.mults.strength,
            strengthExp: sl.mults.strength_exp,
            workMoney: sl.mults.work_money,
          },
        };
      },
    getSleeveAugmentations:
      (ctx: NetscriptContext) =>
      (_sleeveNumber: unknown): string[] => {
        const sleeveNumber = helpers.number(ctx, "sleeveNumber", _sleeveNumber);
        checkSleeveAPIAccess(ctx);
        checkSleeveNumber(ctx, sleeveNumber);

        const augs = [];
        for (let i = 0; i < player.sleeves[sleeveNumber].augmentations.length; i++) {
          augs.push(player.sleeves[sleeveNumber].augmentations[i].name);
        }
        return augs;
      },
    getSleevePurchasableAugs:
      (ctx: NetscriptContext) =>
      (_sleeveNumber: unknown): AugmentPair[] => {
        const sleeveNumber = helpers.number(ctx, "sleeveNumber", _sleeveNumber);
        checkSleeveAPIAccess(ctx);
        checkSleeveNumber(ctx, sleeveNumber);

        const purchasableAugs = findSleevePurchasableAugs(player.sleeves[sleeveNumber], player);
        const augs = [];
        for (let i = 0; i < purchasableAugs.length; i++) {
          const aug = purchasableAugs[i];
          augs.push({
            name: aug.name,
            cost: aug.baseCost,
          });
        }

        return augs;
      },
    purchaseSleeveAug:
      (ctx: NetscriptContext) =>
      (_sleeveNumber: unknown, _augName: unknown): boolean => {
        const sleeveNumber = helpers.number(ctx, "sleeveNumber", _sleeveNumber);
        const augName = helpers.string(ctx, "augName", _augName);
        checkSleeveAPIAccess(ctx);
        checkSleeveNumber(ctx, sleeveNumber);

        if (getSleeveStats(sleeveNumber).shock > 0) {
          throw helpers.makeRuntimeErrorMsg(ctx, `Sleeve shock too high: Sleeve ${sleeveNumber}`);
        }

        const aug = StaticAugmentations[augName];
        if (!aug) {
          throw helpers.makeRuntimeErrorMsg(ctx, `Invalid aug: ${augName}`);
        }

        return player.sleeves[sleeveNumber].tryBuyAugmentation(player, aug);
      },
    getSleeveAugmentationPrice:
      (ctx: NetscriptContext) =>
      (_augName: unknown): number => {
        checkSleeveAPIAccess(ctx);
        const augName = helpers.string(ctx, "augName", _augName);
        const aug: Augmentation = StaticAugmentations[augName];
        return aug.baseCost;
      },
    getSleeveAugmentationRepReq:
      (ctx: NetscriptContext) =>
      (_augName: unknown): number => {
        checkSleeveAPIAccess(ctx);
        const augName = helpers.string(ctx, "augName", _augName);
        const aug: Augmentation = StaticAugmentations[augName];
        return aug.getCost(player).repCost;
      },
    setToBladeburnerAction:
      (ctx: NetscriptContext) =>
      (_sleeveNumber: unknown, _action: unknown, _contract?: unknown): boolean => {
        const sleeveNumber = helpers.number(ctx, "sleeveNumber", _sleeveNumber);
        const action = helpers.string(ctx, "action", _action);
        let contract: string;
        if (typeof _contract === "undefined") {
          contract = "------";
        } else {
          contract = helpers.string(ctx, "contract", _contract);
        }
        checkSleeveAPIAccess(ctx);
        checkSleeveNumber(ctx, sleeveNumber);

        // Cannot Take on Contracts if another sleeve is performing that action
        if (action === "Take on contracts") {
          for (let i = 0; i < player.sleeves.length; ++i) {
            if (i === sleeveNumber) {
              continue;
            }
            const other = player.sleeves[i];
            if (isSleeveBladeburnerWork(other.currentWork) && other.currentWork.actionName === contract) {
              throw helpers.makeRuntimeErrorMsg(
                ctx,
                `Sleeve ${sleeveNumber} cannot take on contracts because Sleeve ${i} is already performing that action.`,
              );
            }
          }
        }

        return player.sleeves[sleeveNumber].bladeburner(player, action, contract);
      },
  };
}
