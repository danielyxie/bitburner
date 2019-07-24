/**
 * Class representing a script file.
 *
 * This does NOT represent a script that is actively running and
 * being evaluated. See RunningScript for that
 */
import { Page, routing } from "../ui/navigationTracking";
import { calculateRamUsage } from "./RamCalculations";

import { roundToTwo } from "../../utils/helpers/roundToTwo";
import {
    Generic_fromJSON,
    Generic_toJSON,
    Reviver,
} from "../../utils/JSONReviver";
import { setTimeoutRef } from "../utils/SetTimeoutRef";

import { getServer } from "../Server/AllServers";

let globalModuleSequenceNumber: number = 0;

export class Script {
    // Initializes a Script Object from a JSON save state
    static fromJSON(value: any): Script {
        return Generic_fromJSON(Script, value.data);
    }

    // Filename for the script file
    filename: string = "";

    // DEPRECATED: Source code
    code: string = "";

    // The dynamic module generated for this script when it is run.
    // This is only applicable for NetscriptJS
    module: any = "";

    // The timestamp when when the script was last updated.
    moduleSequenceNumber: number;

    // Only used with NS2 scripts; the list of dependency script filenames. This is constructed
    // whenever the script is first evaluated, and therefore may be out of date if the script
    // has been updated since it was last run.
    dependencies: string[] = [];

    // Amount of RAM this Script requres to run
    ramUsage: number = 0;

    // IP of server that this script is on.
	   server: string = "";

    constructor(fn: string= "", server: string= "") {
        this.filename 	= fn;
        // the source code is directly fetched from the server when needed to avoid data duplication in memory.
        this.ramUsage   = 0;
    	   this.server 	= server; // IP of server this script is on
        this.module     = "";
        this.moduleSequenceNumber = ++globalModuleSequenceNumber;

    }

    /**
     * Download the script as a file
     */
    download(): void {
        const filename = this.filename + ".js";
        const file = new Blob([this.getSource()], {type: "text/plain"});
        if (window.navigator.msSaveOrOpenBlob) {// IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        } else { // Others
            const a = document.createElement("a"),
                    url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeoutRef(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            },            0);
        }
    }

    /**
     * Marks this script as having been updated. It will be recompiled next time something tries
     * to exec it.
     */
    markUpdated() {
        this.module = "";
        this.moduleSequenceNumber = ++globalModuleSequenceNumber;
    }

    /**
     * Save a script from the script editor
     * @param {string} code - The new contents of the script
     * @param {string} serverIp - The IP of the server on which the script is supposed to be saved. Used to process imports
     */
    saveScript(code: string, serverIp: string): void {

    	if (routing.isOn(Page.ScriptEditor)) {
    		// Update code and filename

            const filenameElem: HTMLInputElement | null = document.getElementById("script-editor-filename") as HTMLInputElement;
            if (filenameElem == null) {
                console.error("Failed to get Script filename DOM element");
                return;
            }
            this.filename = filenameElem.value;
            this.server = serverIp;
            this.getServer().writeFile(this.filename, code);
    		      this.updateRamUsage();
            this.markUpdated();
    	}
    }

    getServer() {
        if (!getServer(this.server)) { console.error(`Script ${this.filename} server has not been loaded.`); }
        return getServer(this.server);
    }

    getSource() {
        return this.getServer().readFile(this.filename);
    }

    /**
     * Calculates and updates the script's RAM usage based on its code
     */
    async updateRamUsage() {
        const res = await calculateRamUsage(this.filename, this.getSource(), this.getServer());
        if (res > 0) {
            this.ramUsage = roundToTwo(res);
        }
    }

    // Serialize the current object to a JSON save state
    toJSON(): any {
        return Generic_toJSON("Script", this);
    }
}

Reviver.constructors.Script = Script;
