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

export interface FactionWorkInfo extends GenericWorkInfo {
  factionName: string;
  jobDescription: string;
  jobType: PlayerFactionWorkType;

  start: (workManager: WorkManager, faction: Faction, workType: PlayerFactionWorkType) => void;
}

export interface CompanyWorkInfo extends GenericWorkInfo {
  companyName: string;

  start: (workManager: WorkManager, company: string) => void;
}

export interface CompanyPartTimeWorkInfo extends GenericWorkInfo {
  companyName: string;

  start: (workManager: WorkManager, company: string) => void;
}

export interface CreateProgramWorkInfo extends GenericWorkInfo {
  programName: string;
  requiredLevel: number;

  timeWorked: number;

  start: (workManager: WorkManager, program: string, time: number, requiredLevel: number) => void;
}

export interface StudyClassWorkInfo extends GenericWorkInfo {
  className: ClassType;

  start: (workManager: WorkManager, costMult: number, expMult: number, className: string) => void;
}

export interface CrimeWorkInfo extends GenericWorkInfo {
  crimeType: CrimeType;
  singularity: boolean;

  start: (
    workManager: WorkManager,
    router: IRouter,
    crimeType: CrimeType,
    exp: {
      hack: number;
      str: number;
      def: number;
      dex: number;
      agi: number;
      cha: number;
    },
    money: number,
    time: number,
    workerscript: WorkerScript | null,
  ) => void;
}

export interface GraftAugmentationWorkInfo extends GenericWorkInfo {
  augmentation: string;

  timeWorked: number;

  start: (workManager: WorkManager, augmentation: string, time: number) => void;
}
