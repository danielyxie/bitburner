import { Faction } from "../Faction/Faction";
import { WorkerScript } from "../Netscript/WorkerScript";
import { IPlayer } from "../PersonObjects/IPlayer";
import { IRouter } from "../ui/Router";
import { WorkManager } from "./WorkManager";
import { ClassType, CrimeType, PlayerFactionWorkType } from "./WorkType";

export interface GenericWorkInfo {
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
  partTime: boolean;
};

export interface CompanyWorkInfo extends GenericWorkInfo {
  companyName: string;
  partTime: boolean;

  getMoneyGain: (player: IPlayer) => number;
  getRepGain: (player: IPlayer) => number;
  getHackExpGain: (player: IPlayer) => number;
  getStrExpGain: (player: IPlayer) => number;
  getDefExpGain: (player: IPlayer) => number;
  getDexExpGain: (player: IPlayer) => number;
  getAgiExpGain: (player: IPlayer) => number;
  getChaExpGain: (player: IPlayer) => number;

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
  className: ClassType;
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
  workerScript: WorkerScript | null;

  start: (workManager: WorkManager, params: StartCrimeParams) => void;
}

// Grafting

export type StartGraftingParams = {
  augmentation: string;
  throughAPI?: boolean;
  time: number;
};

export interface GraftAugmentationWorkInfo extends GenericWorkInfo {
  augmentation: string;
  throughAPI: boolean;

  timeWorked: number;

  start: (workManager: WorkManager, params: StartGraftingParams) => void;
}
