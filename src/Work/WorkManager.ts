import { cloneDeep, merge } from "lodash";
import { PropertyOf } from "src/types";
import { AugmentationNames } from "../Augmentation/data/AugmentationNames";
import { CONSTANTS } from "../Constants";
import { IPlayer } from "../PersonObjects/IPlayer";
import { Generic_fromJSON, Generic_toJSON, Reviver } from "../utils/JSONReviver";
import {
  baseCompanyPartTimeWorkInfo,
  baseCompanyWorkInfo,
  baseCreateProgramWorkInfo,
  baseCrimeWorkInfo,
  baseFactionWorkInfo,
  baseGraftAugmentationWorkInfo,
  baseStudyClassWorkInfo,
} from "./data";
import {
  CompanyPartTimeWorkInfo,
  CompanyWorkInfo,
  CreateProgramWorkInfo,
  CrimeWorkInfo,
  FactionWorkInfo,
  GenericWorkInfo,
  GraftAugmentationWorkInfo,
  StudyClassWorkInfo,
} from "./WorkInfo";
import { WorkType } from "./WorkType";

export type WorkGains = {
  hackExp: number;
  strExp: number;
  defExp: number;
  dexExp: number;
  agiExp: number;
  chaExp: number;

  money: number;
  rep: number;
};

export type WorkRates = WorkGains & { moneyLoss: number };

export interface WorkInfo {
  faction: FactionWorkInfo;
  company: CompanyWorkInfo;
  companyPartTime: CompanyPartTimeWorkInfo;
  createProgram: CreateProgramWorkInfo;
  studyClass: StudyClassWorkInfo;
  crime: CrimeWorkInfo;
  graftAugmentation: GraftAugmentationWorkInfo;
}

const workTypeToInfoKey: { [workType in Exclude<WorkType, WorkType.None>]: keyof WorkInfo } = {
  [WorkType.Company]: "company",
  [WorkType.CompanyPartTime]: "companyPartTime",
  [WorkType.Faction]: "faction",
  [WorkType.CreateProgram]: "createProgram",
  [WorkType.StudyClass]: "studyClass",
  [WorkType.Crime]: "crime",
  [WorkType.GraftAugmentation]: "graftAugmentation",
};

// Base for both manager init and reset
// Is deep cloned every time it's used to prevent
// default data from being overwritten by reference
const defaultManagerData = {
  workType: WorkType.None,
  timeWorked: 0,
  timeToCompletion: 0,

  gains: <WorkGains>{
    hackExp: 0,
    strExp: 0,
    defExp: 0,
    dexExp: 0,
    agiExp: 0,
    chaExp: 0,

    money: 0,
    rep: 0,
  },

  rates: <WorkRates>{
    hackExp: 0,
    strExp: 0,
    defExp: 0,
    dexExp: 0,
    agiExp: 0,
    chaExp: 0,

    money: 0,
    moneyLoss: 0,
    rep: 0,
  },

  info: <WorkInfo>{
    faction: baseFactionWorkInfo,
    company: baseCompanyWorkInfo,
    companyPartTime: baseCompanyPartTimeWorkInfo,
    createProgram: baseCreateProgramWorkInfo,
    graftAugmentation: baseGraftAugmentationWorkInfo,
    studyClass: baseStudyClassWorkInfo,
    crime: baseCrimeWorkInfo,
  },

  costMult: 1,
  expMult: 1,
};

export class WorkManager {
  player: IPlayer;

  workType!: WorkType;
  timeWorked!: number;
  timeToCompletion!: number;

  gains!: WorkGains;
  rates!: WorkRates;

  info!: WorkInfo;

  costMult!: number;
  expMult!: number;

  constructor(player?: IPlayer) {
    // This is okay because when the player object is loaded, it
    // assigns itself as the work manager's player property, so
    // it will exist even if not provided explicitly
    this.player = player as IPlayer;

    Object.assign(this, cloneDeep(defaultManagerData));
  }

  // https://github.com/Microsoft/TypeScript/issues/30581 :/
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  start(workType: Exclude<WorkType, WorkType.None>, params: any): void {
    this.reset();
    this.player.isWorking = true;

    const info = this.info[workTypeToInfoKey[workType]];
    if (info) {
      this.workType = workType;
      info.start(this, params);
      return;
    }
    throw new Error("Tried to start working with an unknown WorkType. This is a bug!");
  }

  process(numCycles = 1): boolean | undefined {
    if (this.workType === WorkType.None) {
      throw new Error("Tried to process work whilst not working. This is a bug!");
    }

    const info = this.info[workTypeToInfoKey[this.workType]];
    if (info) {
      return info.process(this, numCycles);
    }
    throw new Error("Tried to process an unknown WorkType. This is a bug!");
  }

  finish(options: { singularity?: boolean; cancelled: boolean }): string | undefined {
    if (this.workType === WorkType.None) {
      throw new Error("Tried to process work whilst not working. This is a bug!");
    }

    let ret: string | null = null;

    const info = this.info[workTypeToInfoKey[this.workType]];
    if (info) {
      ret = info.finish(this, options);
    }

    this.reset();
    if (ret === null) {
      throw new Error("Tried to finish an unknown WorkType. This is a bug!");
    } else {
      return ret;
    }
  }

  reset(): void {
    this.player.isWorking = false;

    Object.assign(this, cloneDeep(defaultManagerData));
  }

  processWorkEarnings(numCycles: number): void {
    let focusBonus = 1;
    if (!this.player.hasAugmentation(AugmentationNames.NeuroreceptorManager)) {
      focusBonus = this.player.focus ? 1 : CONSTANTS.BaseFocusBonus;
    }

    const hackExpGain = focusBonus * this.rates.hackExp * numCycles,
      strExpGain = focusBonus * this.rates.strExp * numCycles,
      defExpGain = focusBonus * this.rates.defExp * numCycles,
      dexExpGain = focusBonus * this.rates.dexExp * numCycles,
      agiExpGain = focusBonus * this.rates.agiExp * numCycles,
      chaExpGain = focusBonus * this.rates.chaExp * numCycles,
      moneyGain = (this.rates.money - this.rates.moneyLoss) * numCycles;

    this.player.gainHackingExp(hackExpGain);
    this.player.gainStrengthExp(strExpGain);
    this.player.gainDefenseExp(defExpGain);
    this.player.gainDexterityExp(dexExpGain);
    this.player.gainAgilityExp(agiExpGain);
    this.player.gainCharismaExp(chaExpGain);
    this.player.gainMoney(moneyGain, this.workType === WorkType.StudyClass ? "class" : "work");

    Object.assign(this.gains, <WorkGains>{
      hackExp: this.gains.hackExp + hackExpGain,
      strExp: this.gains.strExp + strExpGain,
      defExp: this.gains.defExp + defExpGain,
      dexExp: this.gains.dexExp + dexExpGain,
      agiExp: this.gains.agiExp + agiExpGain,
      chaExp: this.gains.chaExp + chaExpGain,
      money: this.gains.money + focusBonus * (this.rates.money * numCycles - this.rates.moneyLoss * numCycles),
      rep: this.gains.rep + focusBonus * this.rates.rep * numCycles,
    });
  }

  toJSON(): any {
    const cleanedObject = {
      workType: this.workType,
      timeWorked: this.timeWorked,
      timeToCompletion: this.timeToCompletion,

      gains: this.gains,
      rates: this.rates,

      // Generate the info JSON automatically
      info: <WorkInfo>(<unknown>Object.fromEntries(
        Object.entries(defaultManagerData.info).map(([workType, workTypeInfo]: [string, PropertyOf<WorkInfo>]) => [
          // Outer object uses the work type as a key
          workType,
          // And generates an object accordingly
          <PropertyOf<WorkInfo>>(<unknown>Object.fromEntries(
            Object.entries(workTypeInfo).filter(
              // Filter the live object's entries such that functions are removed
              // This way, we only get serializable data to save in JSON
              ([, workTypeInfoProperty]: [string, PropertyOf<PropertyOf<WorkInfo>>]) => {
                return typeof workTypeInfoProperty !== "function";
              },
            ),
          )),
        ]),
      )),
    };

    return Generic_toJSON("WorkManager", cleanedObject);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static fromJSON(value: any): WorkManager {
    const baseObject = Generic_fromJSON(WorkManager, value.data);
    // Add the functions from the base work types to the manager
    merge(baseObject, {
      info: <WorkInfo>(<unknown>Object.fromEntries(
        Object.keys(defaultManagerData.info).map((k) => [
          k,
          {
            start: defaultManagerData.info[<keyof WorkInfo>k].start,
            process: defaultManagerData.info[<keyof WorkInfo>k].process,
            finish: defaultManagerData.info[<keyof WorkInfo>k].finish,
          },
        ]),
      )),
    });
    return baseObject;
  }
}

Reviver.constructors.WorkManager = WorkManager;
