/**
 * Global pool of all active scripts (scripts that are currently running)
 */
import { WorkerScript } from "./WorkerScript";

export const workerScripts: Map<number, WorkerScript> = new Map();
