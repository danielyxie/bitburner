import { WorkerScript } from "../../Netscript/WorkerScript";
import { IRouter } from "../../ui/Router";
import { CrimeWorkInfo } from "../WorkInfo";
import { WorkManager } from "../WorkManager";
import { CrimeType } from "../WorkType";

export const baseCrimeWorkInfo: CrimeWorkInfo = {
  crimeType: CrimeType.None,
  singularity: false,
  start: function (workManager: WorkManager, { router, crimeType, exp, money, time, workerScript }): void {
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
