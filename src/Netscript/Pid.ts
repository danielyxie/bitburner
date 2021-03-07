import { workerScripts } from "./WorkerScripts";

let pidCounter = 1;

/**
 * Find and return the next availble PID for a script
 */
export function generateNextPid(): number {
    let tempCounter = pidCounter;

    // Cap the number of search iterations at some arbitrary value to avoid
    // infinite loops. We'll assume that players wont have 1mil+ running scripts
    let found = false;
    for (let i = 0; i < 1e6;) {
        if (!workerScripts.has(tempCounter + i)) {
            found = true;
            tempCounter = tempCounter + i;
            break;
        }

        if (i === Number.MAX_SAFE_INTEGER - 1) {
            i = 1;
        } else {
            ++i;
        }
    }

    if (found) {
        pidCounter = tempCounter + 1;
        if (pidCounter >= Number.MAX_SAFE_INTEGER) {
            pidCounter = 1;
        }

        return tempCounter;
    } else {
        return -1;
    }
}

export function resetPidCounter(): void {
    pidCounter = 1;
} 