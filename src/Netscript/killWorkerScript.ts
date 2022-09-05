/**
 * Stops an actively-running script (represented by a WorkerScript object)
 * and removes it from the global pool of active scripts.
 */
import { ScriptDeath } from "./ScriptDeath";
import { WorkerScript } from "./WorkerScript";
import { workerScripts } from "./WorkerScripts";
import { WorkerScriptStartStopEventEmitter } from "./WorkerScriptStartStopEventEmitter";

import { RunningScript } from "../Script/RunningScript";
import { GetServer } from "../Server/AllServers";

import { AddRecentScript } from "./RecentScripts";
import { ITutorial } from "../InteractiveTutorial";
import { AlertEvents } from "../ui/React/AlertManager";
import { handleUnknownError } from "./NetscriptHelpers";

export type killScriptParams = WorkerScript | number | { runningScript: RunningScript; hostname: string };

export function killWorkerScript(params: killScriptParams): boolean {
  console.log(ITutorial.isRunning);
  if (ITutorial.isRunning) {
    AlertEvents.emit("Processes cannot be killed during the tutorial.");
    return false;
  }
  if (params instanceof WorkerScript) {
    stopAndCleanUpWorkerScript(params);

    return true;
  } else if (typeof params === "number") {
    return killWorkerScriptByPid(params);
  } else {
    // Try to kill by PID
    const res = killWorkerScriptByPid(params.runningScript.pid);
    if (res) {
      return res;
    }

    // If for some reason that doesn't work, we'll try the old way
    for (const ws of workerScripts.values()) {
      if (ws.scriptRef === params.runningScript) {
        stopAndCleanUpWorkerScript(ws);
        return true;
      }
    }

    return false;
  }
}

function killWorkerScriptByPid(pid: number): boolean {
  const ws = workerScripts.get(pid);
  if (ws instanceof WorkerScript) {
    stopAndCleanUpWorkerScript(ws);
    return true;
  }

  return false;
}

function stopAndCleanUpWorkerScript(ws: WorkerScript): void {
  //Clean up any ongoing netscriptDelay
  if (ws.delay) clearTimeout(ws.delay);
  ws.delayReject?.(new ScriptDeath(ws));

  if (typeof ws.atExit === "function") {
    try {
      ws.env.stopFlag = false;
      ws.atExit();
    } catch (e: unknown) {
      handleUnknownError(e, ws, "Error running atExit function.\n\n");
    }
    ws.atExit = undefined;
  }
  ws.env.stopFlag = true;
  removeWorkerScript(ws);
}

/**
 * Helper function that removes the script being killed from the global pool.
 * Also handles other cleanup-time operations
 *
 * @param {WorkerScript} - Identifier for WorkerScript. Either the object itself, or
 *                                  its index in the global workerScripts array
 */
function removeWorkerScript(workerScript: WorkerScript): void {
  const ip = workerScript.hostname;

  // Get the server on which the script runs
  const server = GetServer(ip);
  if (server == null) {
    console.error(`Could not find server on which this script is running: ${ip}`);
    return;
  }

  // Delete the RunningScript object from that server
  for (let i = 0; i < server.runningScripts.length; ++i) {
    const runningScript = server.runningScripts[i];
    if (runningScript === workerScript.scriptRef) {
      server.runningScripts.splice(i, 1);
      break;
    }
  }

  // Recalculate ram used on that server

  server.updateRamUsed(0);
  for (const rs of server.runningScripts) server.updateRamUsed(server.ramUsed + rs.ramUsage * rs.threads);

  // Delete script from global pool (workerScripts)
  workerScripts.delete(workerScript.pid);
  // const res = workerScripts.delete(workerScript.pid);
  // if (!res) {
  //   console.warn(`removeWorkerScript() called with WorkerScript that wasn't in the global map:`);
  //   console.warn(workerScript);
  // }
  AddRecentScript(workerScript);

  WorkerScriptStartStopEventEmitter.emit();
}
