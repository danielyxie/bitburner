import { ClassType, PlayerFactionWorkType, CrimeType } from "./WorkType";

type WorkGains = {
  hackExp?: number;
  strExp?: number;
  defExp?: number;
  dexExp?: number;
  agiExp?: number;
  chaExp?: number;

  money?: number;
  rep?: number;
};

type WorkRates = {
  hackExp?: number;
  strExp?: number;
  defExp?: number;
  dexExp?: number;
  agiExp?: number;
  chaExp?: number;

  money?: number;
  rep?: number;
};

export interface FactionWorkInfo {
  faction: string;
  jobDescription: string;
  jobType: PlayerFactionWorkType;

  gains: WorkGains;
  rates: WorkRates;
}

export interface CompanyWorkInfo {
  company: string;

  gains: WorkGains;
  rates: WorkRates;
}

export interface CompanyPartTimeWorkInfo {
  company: string;

  gains: WorkGains;
  rates: WorkRates;
}

export interface CreateProgramWorkInfo {
  programName: string;
  requiredLevel: number;
}

export interface StudyClassWorkInfo {
  class: ClassType;

  gains: WorkGains;
  rates: WorkRates;
}

export interface CrimeWorkInfo {
  crimeType: CrimeType;

  gains: WorkGains;
}

export interface GraftAugmentationWorkInfo {
  augmentation: string;
}
