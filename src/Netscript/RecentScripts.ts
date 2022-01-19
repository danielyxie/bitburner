import { RunningScript } from "src/Script/RunningScript";
import { Settings } from "../Settings/Settings";
import { WorkerScript } from "./WorkerScript";

export const recentScripts: RecentScript[] = [];

export function AddRecentScript(workerScript: WorkerScript): void {
  if (recentScripts.find((r) => r.pid === workerScript.pid)) return;

  const killedTime = new Date();
  recentScripts.unshift({
    filename: workerScript.name,
    args: workerScript.args,
    pid: workerScript.pid,
    timestamp: killedTime,
    timestampEpoch: killedTime.getTime(),
    runningScript: workerScript.scriptRef,
  });

  while (recentScripts.length > Settings.MaxRecentScriptsCapacity) {
    recentScripts.pop();
  }
}

export interface RecentScript {
  filename: string;
  args: string[];
  pid: number;
  timestamp: Date;
  timestampEpoch: number;
  runningScript: RunningScript;
}
