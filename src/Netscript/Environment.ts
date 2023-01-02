import { NSFull } from "../NetscriptFunctions";
import { ExternalAPI } from "./APIWrapper";

/**
 * The environment in which a script runs. The environment holds
 * Netscript functions and arguments for that script.
 */
export class Environment {
  /** Whether or not the script that uses this Environment should stop running */
  stopFlag = false;

  /** The currently running function */

  runningFn = "";

  /** Environment variables (currently only Netscript functions) */
  vars: ExternalAPI<NSFull> | null = null;
}
