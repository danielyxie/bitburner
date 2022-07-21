import { NS } from "../ScriptEditor/NetscriptDefinitions";

/**
 * The environment in which a script runs. The environment holds
 * Netscript functions and arguments for that script.
 */
export class Environment {
  /**
   * Whether or not the script that uses this Environment should stop running
   */
  stopFlag = false;

  /**
   * Environment variables (currently only Netscript functions)
   */
  vars: NS | null = null;
}
