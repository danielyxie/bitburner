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

export interface Work {
  type: WorkType;
  focused: boolean;
  timeWorked: number;
  timeToCompletion: number;

  info:
    | CompanyPartTimeWorkInfo
    | CompanyWorkInfo
    | CreateProgramWorkInfo
    | CrimeWorkInfo
    | FactionWorkInfo
    | GraftAugmentationWorkInfo
    | StudyClassWorkInfo;
}
