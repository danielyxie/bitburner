/**
 * Class representing a script file.
 *
 * This does NOT represent a script that is actively running and
 * being evaluated. See RunningScript for that
 */
import { calculateRamUsage } from "./RamCalculations";
import { ScriptUrl } from "./ScriptUrl";

import { Generic_fromJSON, Generic_toJSON, Reviver } from "../utils/JSONReviver";
import { roundToTwo } from "../utils/helpers/roundToTwo";

let globalModuleSequenceNumber = 0;

export class Script {
  // Code for this script
  code = "";

  // Filename for the script file
  filename = "";

  // url of the script if any, only for NS2.
  url = "";

  // The dynamic module generated for this script when it is run.
  // This is only applicable for NetscriptJS
  module: any = "";

  // The timestamp when when the script was last updated.
  moduleSequenceNumber: number;

  // Only used with NS2 scripts; the list of dependency script filenames. This is constructed
  // whenever the script is first evaluated, and therefore may be out of date if the script
  // has been updated since it was last run.
  dependencies: ScriptUrl[] = [];

  // Amount of RAM this Script requres to run
  ramUsage = 0;

  // hostname of server that this script is on.
  server = "";

  constructor(fn = "", code = "", server = "", otherScripts: Script[] = []) {
    this.filename = fn;
    this.code = code;
    this.ramUsage = 0;
    this.server = server; // hostname of server this script is on
    this.module = "";
    this.moduleSequenceNumber = ++globalModuleSequenceNumber;
    if (this.code !== "") {
      this.updateRamUsage(otherScripts);
    }
  }

  /**
   * Download the script as a file
   */
  download(): void {
    const filename = this.filename;
    const file = new Blob([this.code], { type: "text/plain" });
    const navigator = window.navigator as any;
    if (navigator.msSaveOrOpenBlob) {
      // IE10+
      navigator.msSaveOrOpenBlob(file, filename);
    } else {
      // Others
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
  }

  /**
   * Marks this script as having been updated. It will be recompiled next time something tries
   * to exec it.
   */
  markUpdated(): void {
    this.module = "";
    this.moduleSequenceNumber = ++globalModuleSequenceNumber;
  }

  /**
   * Save a script from the script editor
   * @param {string} code - The new contents of the script
   * @param {Script[]} otherScripts - Other scripts on the server. Used to process imports
   */
  saveScript(filename: string, code: string, hostname: string, otherScripts: Script[]): void {
    // Update code and filename
    this.code = code.replace(/^\s+|\s+$/g, "");

    this.filename = filename;
    this.server = hostname;
    this.updateRamUsage(otherScripts);
    this.markUpdated();
  }

  /**
   * Calculates and updates the script's RAM usage based on its code
   * @param {Script[]} otherScripts - Other scripts on the server. Used to process imports
   */
  async updateRamUsage(otherScripts: Script[]): Promise<void> {
    const res = await calculateRamUsage(this.code, otherScripts);
    if (res > 0) {
      this.ramUsage = roundToTwo(res);
    }
    this.markUpdated();
  }

  imports(): string[] {
    return [];
  }

  // Serialize the current object to a JSON save state
  toJSON(): any {
    return Generic_toJSON("Script", this);
  }

  // Initializes a Script Object from a JSON save state
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static fromJSON(value: any): Script {
    return Generic_fromJSON(Script, value.data);
  }
}

Reviver.constructors.Script = Script;
