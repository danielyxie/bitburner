import { cloneDeep, merge } from "lodash";
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

  gains: {
    hackExp: 0,
    strExp: 0,
    defExp: 0,
    dexExp: 0,
    agiExp: 0,
    chaExp: 0,

    money: 0,
    rep: 0,
  },

  rates: {
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

  info: {
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

      info: {
        faction: <FactionWorkInfo>{
          factionName: this.info.faction.factionName,
          jobDescription: this.info.faction.jobDescription,
          jobType: this.info.faction.jobType,
        },

        company: <CompanyWorkInfo>{ companyName: this.info.company.companyName },

        companyPartTime: <CompanyPartTimeWorkInfo>{ companyName: this.info.companyPartTime.companyName },

        createProgram: <CreateProgramWorkInfo>{
          programName: this.info.createProgram.programName,
          requiredLevel: this.info.createProgram.requiredLevel,
          timeWorked: this.info.createProgram.timeWorked,
        },

        studyClass: <StudyClassWorkInfo>{ className: this.info.studyClass.className },

        crime: <CrimeWorkInfo>{
          crimeType: this.info.crime.crimeType,
          singularity: this.info.crime.singularity,
          workerScript: this.info.crime.workerScript,
        },

        graftAugmentation: <GraftAugmentationWorkInfo>{
          augmentation: this.info.graftAugmentation.augmentation,
          timeWorked: this.info.graftAugmentation.timeWorked,
        },
      },
    };

    return Generic_toJSON("WorkManager", cleanedObject);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static fromJSON(value: any): WorkManager {
    const baseObject = Generic_fromJSON(WorkManager, value.data);
    console.log(baseObject);
    merge(baseObject, {
      info: {
        faction: <FactionWorkInfo>{
          start: baseFactionWorkInfo.start,
          process: baseFactionWorkInfo.process,
          finish: baseFactionWorkInfo.finish,
        },

        company: <CompanyWorkInfo>{
          start: baseCompanyWorkInfo.start,
          process: baseCompanyWorkInfo.process,
          finish: baseCompanyWorkInfo.finish,
        },

        companyPartTime: <CompanyPartTimeWorkInfo>{
          start: baseCompanyPartTimeWorkInfo.start,
          process: baseCompanyPartTimeWorkInfo.process,
          finish: baseCompanyPartTimeWorkInfo.finish,
        },

        createProgram: <CreateProgramWorkInfo>{
          start: baseCreateProgramWorkInfo.start,
          process: baseCreateProgramWorkInfo.process,
          finish: baseCreateProgramWorkInfo.finish,
        },

        studyClass: <StudyClassWorkInfo>{
          start: baseStudyClassWorkInfo.start,
          process: baseStudyClassWorkInfo.process,
          finish: baseStudyClassWorkInfo.finish,
        },

        crime: <CrimeWorkInfo>{
          start: baseCrimeWorkInfo.start,
          process: baseCrimeWorkInfo.process,
          finish: baseCrimeWorkInfo.finish,
        },

        graftAugmentation: <GraftAugmentationWorkInfo>{
          start: baseGraftAugmentationWorkInfo.start,
          process: baseGraftAugmentationWorkInfo.process,
          finish: baseGraftAugmentationWorkInfo.finish,
        },
      },
    });
    return baseObject;
  }
}

Reviver.constructors.WorkManager = WorkManager;
