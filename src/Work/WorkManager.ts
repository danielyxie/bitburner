import { cloneDeep, merge } from "lodash";
import { PropertyOf } from "../types";
import { AugmentationNames } from "../Augmentation/data/AugmentationNames";
import { CONSTANTS } from "../Constants";
import { IPlayer } from "../PersonObjects/IPlayer";
import { Generic_fromJSON, Generic_toJSON, Reviver } from "../utils/JSONReviver";
import {
  baseCompanyWorkInfo,
  baseCreateProgramWorkInfo,
  baseCrimeWorkInfo,
  baseFactionWorkInfo,
  baseGraftAugmentationWorkInfo,
  baseStudyClassWorkInfo,
} from "./data";
import {
  CompanyWorkInfo,
  CreateProgramWorkInfo,
  CrimeWorkInfo,
  FactionWorkInfo,
  GraftAugmentationWorkInfo,
  StudyClassWorkInfo,
} from "./WorkInfo";
import { WorkType } from "./WorkType";
import { PlayerWork as NetscriptPlayerWork } from "../ScriptEditor/NetscriptDefinitions";

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
  createProgram: CreateProgramWorkInfo;
  studyClass: StudyClassWorkInfo;
  crime: CrimeWorkInfo;
  graftAugmentation: GraftAugmentationWorkInfo;
}

const workTypeToInfoKey: { [workType in Exclude<WorkType, WorkType.None>]: keyof WorkInfo } = {
  [WorkType.Company]: "company",
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

  toPlayerSafe(): NetscriptPlayerWork {
    const copy = cloneDeep(this);

    return {
      workType: copy.workType,
      timeWorked: copy.timeWorked,
      timeToCompletion: copy.timeToCompletion,

      gains: copy.gains,
      rates: copy.rates,

      faction: {
        factionName: copy.info.faction.factionName,
        jobDescription: copy.info.faction.jobDescription,
      },
      company: {
        name: copy.info.company.companyName,
      },
      createProgram: {
        programName: copy.info.createProgram.programName,
        requiredLevel: copy.info.createProgram.requiredLevel,
      },
      studyClass: {
        className: copy.info.studyClass.className,
      },
      crime: {
        crimeType: copy.info.crime.crimeType,
      },
      graftAugmentation: {
        augmentation: copy.info.graftAugmentation.augmentation,
      },

      costMult: copy.costMult,
      expMult: copy.expMult,
    };
  }

  toJSON(): any {
    const copy = cloneDeep(this);
    // Do this so we don't cause a recursive mess
    copy.player = <IPlayer>{};
    return Generic_toJSON("WorkManager", copy);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static fromJSON(value: any): WorkManager {
    const baseObject = Generic_fromJSON(WorkManager, value.data);
    // Automatically add all functions from the WorkInfo objects to the WorkManager
    merge(baseObject, {
      info: <WorkInfo>(<unknown>Object.fromEntries(
        Object.entries(defaultManagerData.info).map(([workType, baseWorkInfo]: [string, PropertyOf<WorkInfo>]) => [
          // Outer object uses the work type as key
          workType,
          // And generates missing object from the functions on the base type
          <PropertyOf<WorkInfo>>(<unknown>Object.fromEntries(
            Object.entries(baseWorkInfo).filter(
              // Filter the base work info's entries such that only functions are returned
              // This gets us the non-serializable data back onto the object

              ([, baseWorkTypeInfoProperty]: [string, PropertyOf<PropertyOf<WorkInfo>>]) =>
                typeof baseWorkTypeInfoProperty === "function",
            ),
          )),
        ]),
      )),
    });
    return baseObject;
  }
}

Reviver.constructors.WorkManager = WorkManager;
