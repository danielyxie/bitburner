import type { WorkerScript } from "./WorkerScript";

/**
 * Script death marker.
 *
 * IMPORTANT: the game engine should not base any of it's decisions on the data
 * carried in a ScriptDeath instance.
 *
 * This is because ScriptDeath instances are thrown through player code when a
 * script is killed. Which grants the player access to the class and the ability
 * to construct new instances with arbitrary data.
 */
export class ScriptDeath {
  /** Process ID number. */
  pid: number;

  /** Filename of the script. */
  name: string;

  /** IP Address on which the script was running */
  hostname: string;

  /** Status message in case of script error. */
  errorMessage = "";

  constructor(ws: WorkerScript) {
    this.pid = ws.pid;
    this.name = ws.name;
    this.hostname = ws.hostname;
    this.errorMessage = ws.errorMessage;

    Object.freeze(this);
  }
}

Object.freeze(ScriptDeath);
Object.freeze(ScriptDeath.prototype);
