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

export interface Work {
  type: WorkType;
  // focused?: boolean;
  timeWorked: number;
  timeToCompletion: number;

  info:
    | CompanyPartTimeWorkInfo
    | CompanyWorkInfo
    | CreateProgramWorkInfo
    | CrimeWorkInfo
    | FactionWorkInfo
    | GraftAugmentationWorkInfo
    | StudyClassWorkInfo
    | null;

  gains: WorkGains;
  rates: WorkRates;
}
