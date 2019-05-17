/**
 * Stops an actively-running script (represented by a WorkerScript object)
 * and removes it from the global pool of active scripts.
 */
import { WorkerScript } from "./WorkerScript";
import { workerScripts } from "./WorkerScripts";

import { RunningScript } from "../Script/RunningScript";
import { AllServers } from "../Server/AllServers";

import { compareArrays } from "../../utils/helpers/compareArrays";
import { roundToTwo } from "../../utils/helpers/roundToTwo";

export function killWorkerScript(runningScriptObj: RunningScript, serverIp: string): boolean;
export function killWorkerScript(workerScript: WorkerScript): boolean;
export function killWorkerScript(script: RunningScript | WorkerScript, serverIp?: string): boolean {
    if (script instanceof WorkerScript) {
        script.env.stopFlag = true;
        killNetscriptDelay(script);
        removeWorkerScript(script);

        return true;
    } else if (script instanceof RunningScript && typeof serverIp === "string") {
        for (let i = 0; i < workerScripts.length; i++) {
    		if (workerScripts[i].name == script.filename && workerScripts[i].serverIp == serverIp &&
                compareArrays(workerScripts[i].args, script.args)) {
    			workerScripts[i].env.stopFlag = true;
                killNetscriptDelay(workerScripts[i]);
                removeWorkerScript(workerScripts[i]);

                return true;
    		}
    	}

        return false;
    } else {
        console.error(`killWorkerScript() called with invalid argument:`);
        console.error(script);
        return false;
    }
}

/**
 * Helper function that removes the script being killed from the global pool.
 * Also handles other cleanup-time operations
 *
 * @param {WorkerScript | number} - Identifier for WorkerScript. Either the object itself, or
 *                                  its index in the global workerScripts array
 */
function removeWorkerScript(id: WorkerScript | number): void {
    // Get a reference to the WorkerScript and its index in the global pool
    let workerScript: WorkerScript;
    let index: number | null = null;

    if (typeof id === "number") {
        if (id < 0 || id >= workerScripts.length) {
            console.error(`Too high of an index passed into removeWorkerScript(): ${id}`);
            return;
        }

        workerScript = workerScripts[id];
        index = id;
    } else if (id instanceof WorkerScript) {
        workerScript = id;
        for (let i = 0; i < workerScripts.length; ++i) {
            if (workerScripts[i] == id) {
                index = i;
                break;
            }
        }

        if (index == null) {
            console.error(`Could not find WorkerScript in global pool:`);
            console.error(workerScript);
        }
    } else {
        console.error(`Invalid argument passed into removeWorkerScript(): ${id}`);
        return;
    }

    const ip = workerScript.serverIp;
    const name = workerScript.name;

    // Get the server on which the script runs
    const server = AllServers[ip];
    if (server == null) {
        console.error(`Could not find server on which this script is running: ${ip}`);
        return;
    }

    // Recalculate ram used on that server
    server.ramUsed = roundToTwo(server.ramUsed - workerScript.ramUsage);
    if (server.ramUsed < 0) {
        console.warn(`Server RAM usage went negative (if it's due to floating pt imprecision, it's okay): ${server.ramUsed}`);
        server.ramUsed = 0;
    }

    // Delete the RunningScript object from that server
    for (let i = 0; i < server.runningScripts.length; ++i) {
        const runningScript = server.runningScripts[i];
        if (runningScript.filename === name && compareArrays(runningScript.args, workerScript.args)) {
            server.runningScripts.splice(i, 1);
            break;
        }
    }

    // Delete script from global pool (workerScripts)
    workerScripts.splice(<number>index, 1);
}

/**
 * Helper function that interrupts a script's delay if it is in the middle of a
 * timed, blocked operation (like hack(), sleep(), etc.). This allows scripts to
 * be killed immediately even if they're in the middle of one of those long operations
 */
function killNetscriptDelay(workerScript: WorkerScript) {
    if (workerScript instanceof WorkerScript) {
        if (workerScript.delay) {
            clearTimeout(workerScript.delay);
            if (workerScript.delayResolve) {
                workerScript.delayResolve();
            }
        }
    }
}
