import { StudyClassWorkInfo } from "../WorkInfo";
import { WorkManager } from "../WorkManager";
import { ClassType } from "../WorkType";

export const baseStudyClassWorkInfo: StudyClassWorkInfo = {
  className: ClassType.None,
  start: function (workManager: WorkManager, { costMult, expMult, className }): void {
    throw new Error("Function not implemented.");
  },
  process: function (workManager: WorkManager, numCycles: number): boolean {
    throw new Error("Function not implemented.");
  },
  finish: function (
    workManager: WorkManager,
    options: { singularity?: boolean | undefined; cancelled: boolean },
  ): string {
    throw new Error("Function not implemented.");
  },
};
