import { ClassType, PlayerFactionWorkType, CrimeType } from "./WorkType";

export interface FactionWorkInfo {
  faction: string;
  jobDescription: string;
  jobType: PlayerFactionWorkType;
}

export interface CompanyWorkInfo {
  company: string;
}

export interface CompanyPartTimeWorkInfo {
  company: string;
}

export interface CreateProgramWorkInfo {
  programName: string;
  requiredLevel: number;

  timeWorked: number;
}

export interface StudyClassWorkInfo {
  class: ClassType;
}

export interface CrimeWorkInfo {
  crimeType: CrimeType;
}

export interface GraftAugmentationWorkInfo {
  augmentation: string;

  timeWorked: number;
}
