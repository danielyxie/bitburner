import { Player } from "@player";
import { StaticAugmentations } from "../Augmentation/StaticAugmentations";
import { CityName } from "../Locations/data/CityNames";
import { findCrime } from "../Crime/CrimeHelpers";
import { Augmentation } from "../Augmentation/Augmentation";

import { Sleeve } from "../ScriptEditor/NetscriptDefinitions";
import { checkEnum } from "../utils/helpers/enum";
import { InternalAPI, NetscriptContext } from "../Netscript/APIWrapper";
import { isSleeveBladeburnerWork } from "../PersonObjects/Sleeve/Work/SleeveBladeburnerWork";
import { isSleeveFactionWork } from "../PersonObjects/Sleeve/Work/SleeveFactionWork";
import { isSleeveCompanyWork } from "../PersonObjects/Sleeve/Work/SleeveCompanyWork";
import { helpers } from "../Netscript/NetscriptHelpers";
import { cloneDeep } from "lodash";

export function NetscriptSleeve(): InternalAPI<Sleeve> {
  const checkSleeveAPIAccess = function (ctx: NetscriptContext) {
    if (Player.bitNodeN !== 10 && !Player.sourceFileLvl(10)) {
      throw helpers.makeRuntimeErrorMsg(
        ctx,
        "You do not currently have access to the Sleeve API. This is either because you are not in BitNode-10 or because you do not have Source-File 10",
      );
    }
  };

  const checkSleeveNumber = function (ctx: NetscriptContext, sleeveNumber: number) {
    if (sleeveNumber >= Player.sleeves.length || sleeveNumber < 0) {
      const msg = `Invalid sleeve number: ${sleeveNumber}`;
      helpers.log(ctx, () => msg);
      throw helpers.makeRuntimeErrorMsg(ctx, msg);
    }
  };

  return {
    getNumSleeves: (ctx) => () => {
      checkSleeveAPIAccess(ctx);
      return Player.sleeves.length;
    },
    setToShockRecovery: (ctx) => (_sleeveNumber) => {
      const sleeveNumber = helpers.number(ctx, "sleeveNumber", _sleeveNumber);
      checkSleeveAPIAccess(ctx);
      checkSleeveNumber(ctx, sleeveNumber);
      return Player.sleeves[sleeveNumber].shockRecovery();
    },
    setToSynchronize: (ctx) => (_sleeveNumber) => {
      const sleeveNumber = helpers.number(ctx, "sleeveNumber", _sleeveNumber);
      checkSleeveAPIAccess(ctx);
      checkSleeveNumber(ctx, sleeveNumber);
      return Player.sleeves[sleeveNumber].synchronize();
    },
    setToCommitCrime: (ctx) => (_sleeveNumber, _crimeType) => {
      const sleeveNumber = helpers.number(ctx, "sleeveNumber", _sleeveNumber);
      const crimeType = helpers.string(ctx, "crimeType", _crimeType);
      checkSleeveAPIAccess(ctx);
      checkSleeveNumber(ctx, sleeveNumber);
      const crime = findCrime(crimeType);
      if (crime == null) return false;
      return Player.sleeves[sleeveNumber].commitCrime(crime.type);
    },
    setToUniversityCourse: (ctx) => (_sleeveNumber, _universityName, _className) => {
      const sleeveNumber = helpers.number(ctx, "sleeveNumber", _sleeveNumber);
      const universityName = helpers.string(ctx, "universityName", _universityName);
      const className = helpers.string(ctx, "className", _className);
      checkSleeveAPIAccess(ctx);
      checkSleeveNumber(ctx, sleeveNumber);
      return Player.sleeves[sleeveNumber].takeUniversityCourse(universityName, className);
    },
    travel: (ctx) => (_sleeveNumber, _cityName) => {
      const sleeveNumber = helpers.number(ctx, "sleeveNumber", _sleeveNumber);
      const cityName = helpers.string(ctx, "cityName", _cityName);
      checkSleeveAPIAccess(ctx);
      checkSleeveNumber(ctx, sleeveNumber);
      if (checkEnum(CityName, cityName)) {
        return Player.sleeves[sleeveNumber].travel(cityName);
      } else {
        throw helpers.makeRuntimeErrorMsg(ctx, `Invalid city name: '${cityName}'.`);
      }
    },
    setToCompanyWork: (ctx) => (_sleeveNumber, acompanyName) => {
      const sleeveNumber = helpers.number(ctx, "sleeveNumber", _sleeveNumber);
      const companyName = helpers.string(ctx, "companyName", acompanyName);
      checkSleeveAPIAccess(ctx);
      checkSleeveNumber(ctx, sleeveNumber);

      // Cannot work at the same company that another sleeve is working at
      for (let i = 0; i < Player.sleeves.length; ++i) {
        if (i === sleeveNumber) {
          continue;
        }
        const other = Player.sleeves[i];
        if (isSleeveCompanyWork(other.currentWork) && other.currentWork.companyName === companyName) {
          throw helpers.makeRuntimeErrorMsg(
            ctx,
            `Sleeve ${sleeveNumber} cannot work for company ${companyName} because Sleeve ${i} is already working for them.`,
          );
        }
      }

      return Player.sleeves[sleeveNumber].workForCompany(companyName);
    },
    setToFactionWork: (ctx) => (_sleeveNumber, _factionName, _workType) => {
      const sleeveNumber = helpers.number(ctx, "sleeveNumber", _sleeveNumber);
      const factionName = helpers.string(ctx, "factionName", _factionName);
      const workType = helpers.string(ctx, "workType", _workType);
      checkSleeveAPIAccess(ctx);
      checkSleeveNumber(ctx, sleeveNumber);

      // Cannot work at the same faction that another sleeve is working at
      for (let i = 0; i < Player.sleeves.length; ++i) {
        if (i === sleeveNumber) {
          continue;
        }
        const other = Player.sleeves[i];
        if (isSleeveFactionWork(other.currentWork) && other.currentWork.factionName === factionName) {
          throw helpers.makeRuntimeErrorMsg(
            ctx,
            `Sleeve ${sleeveNumber} cannot work for faction ${factionName} because Sleeve ${i} is already working for them.`,
          );
        }
      }

      if (Player.gang && Player.gang.facName == factionName) {
        throw helpers.makeRuntimeErrorMsg(
          ctx,
          `Sleeve ${sleeveNumber} cannot work for faction ${factionName} because you have started a gang with them.`,
        );
      }

      return Player.sleeves[sleeveNumber].workForFaction(factionName, workType);
    },
    setToGymWorkout: (ctx) => (_sleeveNumber, _gymName, _stat) => {
      const sleeveNumber = helpers.number(ctx, "sleeveNumber", _sleeveNumber);
      const gymName = helpers.string(ctx, "gymName", _gymName);
      const stat = helpers.string(ctx, "stat", _stat);
      checkSleeveAPIAccess(ctx);
      checkSleeveNumber(ctx, sleeveNumber);

      return Player.sleeves[sleeveNumber].workoutAtGym(gymName, stat);
    },
    getTask: (ctx) => (_sleeveNumber) => {
      const sleeveNumber = helpers.number(ctx, "sleeveNumber", _sleeveNumber);
      checkSleeveAPIAccess(ctx);
      checkSleeveNumber(ctx, sleeveNumber);

      const sl = Player.sleeves[sleeveNumber];
      if (sl.currentWork === null) return null;
      return sl.currentWork.APICopy();
    },
    getSleeve: (ctx) => (_sleeveNumber) => {
      const sleeveNumber = helpers.number(ctx, "sleeveNumber", _sleeveNumber);
      checkSleeveAPIAccess(ctx);
      checkSleeveNumber(ctx, sleeveNumber);

      const sl = Player.sleeves[sleeveNumber];

      const data = {
        hp: cloneDeep(sl.hp),
        skills: cloneDeep(sl.skills),
        exp: cloneDeep(sl.exp),
        mults: cloneDeep(sl.mults),
        city: sl.city,
        shock: sl.shock,
        sync: sl.sync,
        memory: sl.memory,
      };

      return data;
    },
    getSleeveAugmentations: (ctx) => (_sleeveNumber) => {
      const sleeveNumber = helpers.number(ctx, "sleeveNumber", _sleeveNumber);
      checkSleeveAPIAccess(ctx);
      checkSleeveNumber(ctx, sleeveNumber);

      const augs = [];
      for (let i = 0; i < Player.sleeves[sleeveNumber].augmentations.length; i++) {
        augs.push(Player.sleeves[sleeveNumber].augmentations[i].name);
      }
      return augs;
    },
    getSleevePurchasableAugs: (ctx) => (_sleeveNumber) => {
      const sleeveNumber = helpers.number(ctx, "sleeveNumber", _sleeveNumber);
      checkSleeveAPIAccess(ctx);
      checkSleeveNumber(ctx, sleeveNumber);

      const purchasableAugs = Player.sleeves[sleeveNumber].findPurchasableAugs();
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
    purchaseSleeveAug: (ctx) => (_sleeveNumber, _augName) => {
      const sleeveNumber = helpers.number(ctx, "sleeveNumber", _sleeveNumber);
      const augName = helpers.string(ctx, "augName", _augName);
      checkSleeveAPIAccess(ctx);
      checkSleeveNumber(ctx, sleeveNumber);

      if (Player.sleeves[sleeveNumber].shock > 0) {
        throw helpers.makeRuntimeErrorMsg(ctx, `Sleeve shock too high: Sleeve ${sleeveNumber}`);
      }

      const aug = StaticAugmentations[augName];
      if (!aug) {
        throw helpers.makeRuntimeErrorMsg(ctx, `Invalid aug: ${augName}`);
      }

      return Player.sleeves[sleeveNumber].tryBuyAugmentation(aug);
    },
    getSleeveAugmentationPrice: (ctx) => (_augName) => {
      checkSleeveAPIAccess(ctx);
      const augName = helpers.string(ctx, "augName", _augName);
      const aug: Augmentation = StaticAugmentations[augName];
      return aug.baseCost;
    },
    getSleeveAugmentationRepReq: (ctx) => (_augName) => {
      checkSleeveAPIAccess(ctx);
      const augName = helpers.string(ctx, "augName", _augName);
      const aug: Augmentation = StaticAugmentations[augName];
      return aug.getCost().repCost;
    },
    setToBladeburnerAction: (ctx) => (_sleeveNumber, _action, _contract?) => {
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
        for (let i = 0; i < Player.sleeves.length; ++i) {
          if (i === sleeveNumber) {
            continue;
          }
          const other = Player.sleeves[i];
          if (isSleeveBladeburnerWork(other.currentWork) && other.currentWork.actionName === contract) {
            throw helpers.makeRuntimeErrorMsg(
              ctx,
              `Sleeve ${sleeveNumber} cannot take on contracts because Sleeve ${i} is already performing that action.`,
            );
          }
        }
      }

      return Player.sleeves[sleeveNumber].bladeburner(action, contract);
    },
  };
}
