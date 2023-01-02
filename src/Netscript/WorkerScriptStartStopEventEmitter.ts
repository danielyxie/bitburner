import { EventEmitter } from "../utils/EventEmitter";

/** Event emitter that triggers when scripts are started/stopped */
export const WorkerScriptStartStopEventEmitter = new EventEmitter<[]>();
