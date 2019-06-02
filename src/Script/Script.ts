/**
 * Class representing a script file.
 *
 * This does NOT represent a script that is actively running and
 * being evaluated. See RunningScript for that
 */
import { calculateRamUsage } from "./RamCalculations";
import { Page, routing } from "../ui/navigationTracking";

import { setTimeoutRef } from "../utils/SetTimeoutRef";
import {
    Generic_fromJSON,
    Generic_toJSON,
    Reviver
} from "../../utils/JSONReviver";
import { roundToTwo } from "../../utils/helpers/roundToTwo";

export class Script {
    // Initializes a Script Object from a JSON save state
    static fromJSON(value: any): Script {
        return Generic_fromJSON(Script, value.data);
    }

    // Code for this script
    code: string = "";

    // Filename for the script file
    filename: string = "";

    // The dynamic module generated for this script when it is run.
    // This is only applicable for NetscriptJS
    module: any = "";

    // Amount of RAM this Script requres to run
    ramUsage: number = 0;

    // IP of server that this script is on.
	server: string = "";

    constructor(fn: string="", code: string="", server: string="", otherScripts: Script[]=[]) {
    	this.filename 	= fn;
        this.code       = code;
        this.ramUsage   = 0;
    	this.server 	= server; // IP of server this script is on
        this.module     = "";
        if (this.code !== "") { this.updateRamUsage(otherScripts); }
    };

    /**
     * Download the script as a file
     */
    download(): void {
        const filename = this.filename + ".js";
        const file = new Blob([this.code], {type: 'text/plain'});
        if (window.navigator.msSaveOrOpenBlob) {// IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        } else { // Others
            var a = document.createElement("a"),
                    url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeoutRef(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
    }

    /**
     * Marks this script as having been updated. It will be recompiled next time something tries
     * to exec it.
     */
    markUpdated() {
        this.module = "";
    }

    /**
     * Save a script from the script editor
     * @param {string} code - The new contents of the script
     * @param {Script[]} otherScripts - Other scripts on the server. Used to process imports
     */
    saveScript(code: string, serverIp: string, otherScripts: Script[]): void {
    	if (routing.isOn(Page.ScriptEditor)) {
    		// Update code and filename
    		this.code = code.replace(/^\s+|\s+$/g, '');

            const filenameElem: HTMLInputElement | null = document.getElementById("script-editor-filename") as HTMLInputElement;
            if (filenameElem == null) {
                console.error(`Failed to get Script filename DOM element`);
                return;
            }
    		this.filename = filenameElem!.value;
    		this.server = serverIp;
    		this.updateRamUsage(otherScripts);
            this.markUpdated();
    	}
    }

    /**
     * Calculates and updates the script's RAM usage based on its code
     * @param {Script[]} otherScripts - Other scripts on the server. Used to process imports
     */
    async updateRamUsage(otherScripts: Script[]) {
        var res = await calculateRamUsage(this.code, otherScripts);
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
