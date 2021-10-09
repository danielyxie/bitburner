/**
 * Stops an actively-running script (represented by a WorkerScript object)
 * and removes it from the global pool of active scripts.
 */
import { WorkerScript } from "./WorkerScript";
import { workerScripts } from "./WorkerScripts";
import { WorkerScriptStartStopEventEmitter } from "./WorkerScriptStartStopEventEmitter";

import { RunningScript } from "../Script/RunningScript";
import { GetServer } from "../Server/AllServers";

import { compareArrays } from "../utils/helpers/compareArrays";
import { roundToTwo } from "../utils/helpers/roundToTwo";

export function killWorkerScript(runningScriptObj: RunningScript, hostname: string, rerenderUi?: boolean): boolean;
export function killWorkerScript(workerScript: WorkerScript): boolean;
export function killWorkerScript(pid: number): boolean;
export function killWorkerScript(
  script: RunningScript | WorkerScript | number,
  hostname?: string,
  rerenderUi?: boolean,
): boolean {
  if (rerenderUi == null || typeof rerenderUi !== "boolean") {
    rerenderUi = true;
  }

  if (script instanceof WorkerScript) {
    stopAndCleanUpWorkerScript(script);

    return true;
  } else if (script instanceof RunningScript && typeof hostname === "string") {
    // Try to kill by PID
    const res = killWorkerScriptByPid(script.pid, rerenderUi);
    if (res) {
      return res;
    }

    // If for some reason that doesn't work, we'll try the old way
    for (const ws of workerScripts.values()) {
      if (ws.name == script.filename && ws.hostname == hostname && compareArrays(ws.args, script.args)) {
        stopAndCleanUpWorkerScript(ws, rerenderUi);

        return true;
      }
    }

    return false;
  } else if (typeof script === "number") {
    return killWorkerScriptByPid(script, rerenderUi);
  } else {
    console.error(`killWorkerScript() called with invalid argument:`);
    console.error(script);
    return false;
  }
}

function killWorkerScriptByPid(pid: number, rerenderUi = true): boolean {
  const ws = workerScripts.get(pid);
  if (ws instanceof WorkerScript) {
    stopAndCleanUpWorkerScript(ws, rerenderUi);

    return true;
  }

  return false;
}

function stopAndCleanUpWorkerScript(workerScript: WorkerScript, rerenderUi = true): void {
  workerScript.env.stopFlag = true;
  killNetscriptDelay(workerScript);
  removeWorkerScript(workerScript, rerenderUi);
}

/**
 * Helper function that removes the script being killed from the global pool.
 * Also handles other cleanup-time operations
 *
 * @param {WorkerScript | number} - Identifier for WorkerScript. Either the object itself, or
 *                                  its index in the global workerScripts array
 */
function removeWorkerScript(workerScript: WorkerScript, rerenderUi = true): void {
  if (workerScript instanceof WorkerScript) {
    const ip = workerScript.hostname;
    const name = workerScript.name;

    // Get the server on which the script runs
    const server = GetServer(ip);
    if (server == null) {
      console.error(`Could not find server on which this script is running: ${ip}`);
      return;
    }

    // Delete the RunningScript object from that server
    for (let i = 0; i < server.runningScripts.length; ++i) {
      const runningScript = server.runningScripts[i];
      if (runningScript.filename === name && compareArrays(runningScript.args, workerScript.args)) {
        server.runningScripts.splice(i, 1);
        break;
      }
    }

    // Recalculate ram used on that server
    server.ramUsed = 0;
    for (const rs of server.runningScripts) server.ramUsed += rs.ramUsage;

    // Delete script from global pool (workerScripts)
    const res = workerScripts.delete(workerScript.pid);
    if (!res) {
      console.warn(`removeWorkerScript() called with WorkerScript that wasn't in the global map:`);
      console.warn(workerScript);
    }

    if (rerenderUi) {
      WorkerScriptStartStopEventEmitter.emit();
    }
  } else {
    console.error(`Invalid argument passed into removeWorkerScript():`);
    console.error(workerScript);
    return;
  }
}

/**
 * Helper function that interrupts a script's delay if it is in the middle of a
 * timed, blocked operation (like hack(), sleep(), etc.). This allows scripts to
 * be killed immediately even if they're in the middle of one of those long operations
 */
function killNetscriptDelay(workerScript: WorkerScript): void {
  if (workerScript instanceof WorkerScript) {
    if (workerScript.delay) {
      clearTimeout(workerScript.delay);
      if (workerScript.delayResolve) {
        workerScript.delayResolve();
      }
    }
  }
}
