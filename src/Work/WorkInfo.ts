import { Faction } from "../Faction/Faction";
import { WorkerScript } from "../Netscript/WorkerScript";
import { IRouter } from "../ui/Router";
import { WorkManager } from "./WorkManager";
import { ClassType, CrimeType, PlayerFactionWorkType } from "./WorkType";

interface GenericWorkInfo {
  process: (workManager: WorkManager, numCycles: number) => boolean;
  finish: (
    workManager: WorkManager,
    options: {
      singularity?: boolean;
      cancelled: boolean;
    },
  ) => string;
}

// Faction work

export type StartFactionWorkParams = {
  faction: Faction;
  workType: PlayerFactionWorkType;
};

export interface FactionWorkInfo extends GenericWorkInfo {
  factionName: string;
  jobDescription: string;
  jobType: PlayerFactionWorkType;

  start: (workManager: WorkManager, params: StartFactionWorkParams) => void;
}

// Company work (both full and part time)

export type StartCompanyWorkParams = {
  company: string;
};

export interface CompanyWorkInfo extends GenericWorkInfo {
  companyName: string;

  start: (workManager: WorkManager, params: StartCompanyWorkParams) => void;
}

export interface CompanyPartTimeWorkInfo extends GenericWorkInfo {
  companyName: string;

  start: (workManager: WorkManager, params: StartCompanyWorkParams) => void;
}

// Program creation

export type StartCreateProgramParams = {
  program: string;
  time: number;
  requiredLevel: number;
};

export interface CreateProgramWorkInfo extends GenericWorkInfo {
  programName: string;
  requiredLevel: number;

  timeWorked: number;

  start: (workManager: WorkManager, params: StartCreateProgramParams) => void;
}

// Classes

export type StartStudyClassParams = {
  costMult: number;
  expMult: number;
  className: string;
};

export interface StudyClassWorkInfo extends GenericWorkInfo {
  className: ClassType;

  start: (workManager: WorkManager, params: StartStudyClassParams) => void;
}

// Crime

export type StartCrimeParams = {
  router: IRouter;
  crimeType: CrimeType;
  exp: {
    hack: number;
    str: number;
    def: number;
    dex: number;
    agi: number;
    cha: number;
  };
  money: number;
  time: number;
  workerScript: WorkerScript | null;
};

export interface CrimeWorkInfo extends GenericWorkInfo {
  crimeType: CrimeType;
  singularity: boolean;

  start: (workManager: WorkManager, params: StartCrimeParams) => void;
}

// Grafting

export type StartGraftingParams = {
  augmentation: string;
  time: number;
};

export interface GraftAugmentationWorkInfo extends GenericWorkInfo {
  augmentation: string;

  timeWorked: number;

  start: (workManager: WorkManager, params: StartGraftingParams) => void;
}
