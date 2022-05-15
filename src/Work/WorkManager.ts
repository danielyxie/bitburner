import { AugmentationNames } from "../Augmentation/data/AugmentationNames";
import { CONSTANTS } from "../Constants";
import { IPlayer } from "../PersonObjects/IPlayer";
import { Generic_fromJSON, Generic_toJSON } from "../utils/JSONReviver";
import { baseCompanyPartTimeWorkInfo } from "./data/CompanyPartTimeWorkInfo";
import { baseCompanyWorkInfo } from "./data/CompanyWorkInfo";
import { baseCreateProgramWorkInfo } from "./data/CreateProgramWorkInfo";
import { baseFactionWorkInfo } from "./data/FactionWorkInfo";
import { baseGraftAugmentationWorkInfo } from "./data/GraftAugmentationWorkInfo";
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
import { use } from "../ui/Context";

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
  // studyClass: StudyClassWorkInfo;
  // crime: CrimeWorkInfo;
  graftAugmentation: GraftAugmentationWorkInfo;
}

export class WorkManager {
  readonly player: IPlayer;

  workType: WorkType;
  timeWorked: number;
  timeToCompletion: number;

  gains: WorkGains;
  rates: WorkRates;

  info: WorkInfo;

  constructor() {
    this.player = use.Player();

    this.workType = WorkType.None;
    this.timeWorked = 0;
    this.timeToCompletion = 0;

    this.gains = {
      hackExp: 0,
      strExp: 0,
      defExp: 0,
      dexExp: 0,
      agiExp: 0,
      chaExp: 0,

      money: 0,
      rep: 0,
    };
    this.rates = {
      hackExp: 0,
      strExp: 0,
      defExp: 0,
      dexExp: 0,
      agiExp: 0,
      chaExp: 0,

      money: 0,
      moneyLoss: 0,
      rep: 0,
    };

    this.info = {
      faction: baseFactionWorkInfo,
      company: baseCompanyWorkInfo,
      companyPartTime: baseCompanyPartTimeWorkInfo,
      createProgram: baseCreateProgramWorkInfo,
      graftAugmentation: baseGraftAugmentationWorkInfo,
    };
  }

  reset(): void {
    this.player.isWorking = false;

    Object.assign(this, {
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
      },
    });
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
      rates: this.gains,

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

        // studyClass: <StudyClassWorkInfo>{},
        // crime: <CrimeWorkInfo>{},

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
    return Object.assign(baseObject, {
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

        // studyClass: <StudyClassWorkInfo>{},
        // crime: <CrimeWorkInfo>{},

        graftAugmentation: <GraftAugmentationWorkInfo>{
          start: baseGraftAugmentationWorkInfo.start,
          process: baseGraftAugmentationWorkInfo.process,
          finish: baseGraftAugmentationWorkInfo.finish,
        },
      },
    });
  }
}
