/**
 * Event emitter that triggers when scripts are started/stopped
 */
import { EventEmitter } from "../utils/EventEmitter";

export const WorkerScriptStartStopEventEmitter = new EventEmitter();
