/**
 * Global pool of all active scripts (scripts that are currently running)
 */
import type { WorkerScript } from "./WorkerScript";

export const workerScripts: Map<number, WorkerScript> = new Map();
