import { RunningScript } from "src/Script/RunningScript";
import { Settings } from "../Settings/Settings";
import { WorkerScript } from "./WorkerScript";

export const recentScripts: RecentScript[] = [];

export function AddRecentScript(workerScript: WorkerScript): void {
  if (recentScripts.find((r) => r.runningScript.pid === workerScript.pid)) return;

  const killedTime = new Date();
  recentScripts.unshift({
    timeOfDeath: killedTime,
    runningScript: workerScript.scriptRef,
  });

  while (recentScripts.length > Settings.MaxRecentScriptsCapacity) {
    recentScripts.pop();
  }
}

export interface RecentScript {
  timeOfDeath: Date;
  runningScript: RunningScript;
}
