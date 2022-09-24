/**
 * Class representing a script file.
 *
 * This does NOT represent a script that is actively running and
 * being evaluated. See RunningScript for that
 */
import { calculateRamUsage, RamUsageEntry } from "./RamCalculations";
import { ScriptUrl } from "./ScriptUrl";

import { Generic_fromJSON, Generic_toJSON, IReviverValue, Reviver } from "../utils/JSONReviver";
import { roundToTwo } from "../utils/helpers/roundToTwo";
import { IPlayer } from "../PersonObjects/IPlayer";
import { ScriptModule } from "./ScriptModule";

let globalModuleSequenceNumber = 0;

interface ScriptReference {
  filename: string;
  server: string;
}

export class Script {
  // Code for this script
  code = "";

  // Filename for the script file
  filename = "";

  // url of the script if any, only for NS2.
  url = "";

  // The dynamic module generated for this script when it is run.
  // This is only applicable for NetscriptJS
  module: Promise<ScriptModule> | null = null;

  // The timestamp when when the script was last updated.
  moduleSequenceNumber: number;

  // Only used with NS2 scripts; the list of dependency script filenames. This is constructed
  // whenever the script is first evaluated, and therefore may be out of date if the script
  // has been updated since it was last run.
  dependencies: ScriptUrl[] = [];
  dependents: ScriptReference[] = [];

  // Amount of RAM this Script requires to run
  ramUsage = 0;
  ramUsageEntries?: RamUsageEntry[];

  // Used to deconflict multiple simultaneous compilations.
  queueCompile = false;

  // hostname of server that this script is on.
  server = "";

  constructor(player: IPlayer | null = null, fn = "", code = "", server = "", otherScripts: Script[] = []) {
    this.filename = fn;
    this.code = code;
    this.server = server; // hostname of server this script is on
    this.moduleSequenceNumber = ++globalModuleSequenceNumber;
    if (this.code !== "" && player !== null) {
      this.updateRamUsage(player, otherScripts);
    }
  }

  /**
   * Download the script as a file
   */
  download(): void {
    const filename = this.filename;
    const file = new Blob([this.code], { type: "text/plain" });
    const a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }

  /**
   * Marks this script as having been updated. It will be recompiled next time something tries
   * to exec it.
   */
  markUpdated(): void {
    this.module = null;
    this.moduleSequenceNumber = ++globalModuleSequenceNumber;
  }

  /**
   * Save a script from the script editor
   * @param {string} code - The new contents of the script
   * @param {Script[]} otherScripts - Other scripts on the server. Used to process imports
   */
  saveScript(player: IPlayer, filename: string, code: string, hostname: string, otherScripts: Script[]): void {
    // Update code and filename
    this.code = Script.formatCode(code);

    this.filename = filename;
    this.server = hostname;
    this.updateRamUsage(player, otherScripts);
    this.markUpdated();
    for (const dependent of this.dependents) {
      const [dependentScript] = otherScripts.filter(
        (s) => s.filename === dependent.filename && s.server == dependent.server,
      );
      dependentScript?.markUpdated();
    }
  }

  /**
   * Calculates and updates the script's RAM usage based on its code
   * @param {Script[]} otherScripts - Other scripts on the server. Used to process imports
   */
  updateRamUsage(player: IPlayer, otherScripts: Script[]): void {
    const res = calculateRamUsage(player, this.code, otherScripts);
    if (res.cost > 0) {
      this.ramUsage = roundToTwo(res.cost);
      this.ramUsageEntries = res.entries;
    }
    this.markUpdated();
  }

  imports(): string[] {
    return [];
  }

  // Serialize the current object to a JSON save state
  toJSON(): IReviverValue {
    return Generic_toJSON("Script", this);
  }

  // Initializes a Script Object from a JSON save state
  static fromJSON(value: IReviverValue): Script {
    const s = Generic_fromJSON(Script, value.data);
    // Force the url to blank from the save data. Urls are not valid outside the current browser page load.
    s.url = "";
    s.dependents = [];
    return s;
  }

  /**
   * Formats code: Removes the starting & trailing whitespace
   * @param {string} code - The code to format
   * @returns The formatted code
   */
  static formatCode(code: string): string {
    return code.replace(/^\s+|\s+$/g, "");
  }
}

Reviver.constructors.Script = Script;
