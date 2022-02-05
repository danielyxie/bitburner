/**
 * Class representing a script file.
 *
 * This does NOT represent a script that is actively running and
 * being evaluated. See RunningScript for that
 */
import FileInterface from "../APIServer/FileInterface";
import { calculateRamUsage, RamUsageEntry } from "./RamCalculations";
import { ScriptUrl } from "./ScriptUrl";

import { Generic_fromJSON, Generic_toJSON, Reviver } from "../utils/JSONReviver";
import { roundToTwo } from "../utils/helpers/roundToTwo";
import { computeHash } from "../utils/helpers/computeHash";
import { ImportCache } from "../utils/ImportCache";
import { IPlayer } from "../PersonObjects/IPlayer";

let globalModuleSequenceNumber = 0;

interface ScriptReference { filename: string; server: string }

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
  dependents: ScriptReference[] = [];

  // Amount of RAM this Script requres to run
  ramUsage = 0;
  ramUsageEntries?: RamUsageEntry[];

  // hostname of server that this script is on.
  server = "";

  // sha256 hash of the code in the Script. Do not access directly.
  _hash = "";

  constructor(player: IPlayer | null = null, fn = "", code = "", server = "", otherScripts: Script[] = []) {
    this.filename = fn;
    this.code = code;
    this.ramUsage = 0;
    this.server = server; // hostname of server this script is on
    this.module = "";
    this.moduleSequenceNumber = ++globalModuleSequenceNumber;
    this._hash = "";
    if (this.code !== "" && player !== null) {
      this.updateRamUsage(player, otherScripts);
      this.rehash();
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
    this.rehash();
  }

  /**
   * Force update of the computed hash based on the source code.
   */
  rehash(): void {
    const oldHash = this._hash;
    this._hash = computeHash(this.code);
    if (oldHash !== this._hash) {
      ImportCache.remove(oldHash);
    }
  }

  /**
   * If the hash is not computed, computes the hash. Otherwise return the computed hash.
   * @returns the computed hash of the script
   */
  hash(): string {
    if (!this._hash) this.rehash();
    return this._hash;
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
      const [dependentScript] = otherScripts.filter(s => s.filename === dependent.filename && s.server == dependent.server);
      if (dependentScript !== null) dependentScript.markUpdated();
    }
    // Pass reference since this script may not exist on the server yet
    FileInterface.pushToEditor(this);
  }

  /**
   * Calculates and updates the script's RAM usage based on its code
   * @param {Script[]} otherScripts - Other scripts on the server. Used to process imports
   */
  async updateRamUsage(player: IPlayer, otherScripts: Script[]): Promise<void> {
    const res = await calculateRamUsage(player, this.code, otherScripts);
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
  toJSON(): any {
    return Generic_toJSON("Script", this);
  }

  // Initializes a Script Object from a JSON save state
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static fromJSON(value: any): Script {
    const s = Generic_fromJSON(Script, value.data);
    // Force the url to blank from the save data. Urls are not valid outside the current browser page load.
    s.url = "";
    // Rehash the code to ensure that hash is set properly.
    s.rehash();
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
