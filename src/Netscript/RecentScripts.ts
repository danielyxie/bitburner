import { RunningScript } from "src/Script/RunningScript";
import { WorkerScript } from "./WorkerScript";
import { Settings } from "../Settings/Settings";

export const recentScripts: RecentScript[] = [];

export function AddRecentScript(workerScript: WorkerScript): void {
  if (recentScripts.find((r) => r.pid === workerScript.pid)) return;
  recentScripts.unshift({
    filename: workerScript.name,
    args: workerScript.args,
    pid: workerScript.pid,
    timestamp: new Date(),

    runningScript: workerScript.scriptRef,
  });
  while (recentScripts.length > Settings.RecentScriptLimit) {
    recentScripts.pop();
  }
}

export interface RecentScript {
  filename: string;
  args: string[];
  pid: number;
  timestamp: Date;
  runningScript: RunningScript;
}
