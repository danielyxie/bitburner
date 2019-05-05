/**
 * The worker agent for running a script instance. Each running script instance
 * has its own underlying WorkerScript object.
 *
 * Note that these objects are not saved and re-loaded when the game is refreshed.
 * Instead, whenever the game is opened, WorkerScripts are re-created from
 * RunningScript objects
 */
import { Environment } from "./Environment";
import { RamCostConstants } from "./RamCostGenerator";

import { RunningScript } from "../Script/RunningScript";
import { Script } from "../Script/Script";
import { AllServers } from "../Server/AllServers";
import { BaseServer } from "../Server/BaseServer";
import { IMap } from "../types";

export class WorkerScript {
    /**
     * Script's arguments
     */
    args: any[];

    /**
     * Copy of the script's code
     */
    code: string = "";

    /**
     * Holds the timeoutID (numeric value) for whenever this script is blocked by a
     * timed Netscript function. i.e. Holds the return value of setTimeout()
     */
    delay: number | null = null;

    /**
     * Stores names of all functions that have logging disabled
     */
    disableLogs: IMap<string> = {};

    /**
     * Used for dynamic RAM calculation. Stores names of all functions that have
     * already been checked by this script.
     * TODO: Could probably just combine this with loadedFns?
     */
    dynamicLoadedFns: IMap<string> = {};

    /**
     * Tracks dynamic RAM usage
     */
    dynamicRamUsage: number = RamCostConstants.ScriptBaseRamCost;

    /**
     * Netscript Environment for this script
     */
    env: Environment;

    /**
     * Status message in case of script error. Currently unused I think
     */
    errorMessage: string = "";

    /**
     * Used for static RAM calculation. Stores names of all functions that have
     * already been checked by this script
     */
    loadedFns: IMap<string> = {};

    /**
     * Filename of script
     */
	name: string;

    /**
     * Script's output/return value. Currently not used or implemented
     */
    output: string = "";

    /**
     * Script's RAM usage. Equivalent to underlying script's RAM usage
     */
    ramUsage: number = 0;

    /**
     * Whether or not this workerScript is currently running
     */
    running: boolean = false;

    /**
     * Reference to underlying RunningScript object
     */
    scriptRef: RunningScript;

    /**
     * IP Address on which this script is running
     */
    serverIp: string;

    constructor(runningScriptObj: RunningScript, nsFuncsGenerator?: (ws: WorkerScript) => object) {
        this.name 			= runningScriptObj.filename;
    	this.serverIp 		= runningScriptObj.server;

        // Get the underlying script's code
        const server = AllServers[this.serverIp];
        if (server == null) {
            throw new Error(`WorkerScript constructed with invalid server ip: ${this.serverIp}`);
        }
        let found = false;
        for (let i = 0; i < server.scripts.length; ++i) {
            if (server.scripts[i].filename === this.name) {
                found = true;
                this.code = server.scripts[i].code;
            }
        }
        if (!found) {
            throw new Error(`WorkerScript constructed with invalid script filename: ${this.name}`);
        }

    	this.env 			= new Environment(null);
        if (typeof nsFuncsGenerator === "function") {
            this.env.vars       = nsFuncsGenerator(this);
        }
        this.env.set("args", runningScriptObj.args.slice());

    	this.scriptRef		= runningScriptObj;
        this.args           = runningScriptObj.args.slice();
    }

    /**
     * Returns the Server on which this script is running
     */
    getServer() {
    	return AllServers[this.serverIp];
    }

    /**
     * Returns the Script object for the underlying script.
     * Returns null if it cannot be found (which would be a bug)
     */
    getScript(): Script | null {
        let server = this.getServer();
        for (let i = 0; i < server.scripts.length; ++i) {
            if (server.scripts[i].filename === this.name) {
                return server.scripts[i];
            }
        }

        console.error("Failed to find underlying Script object in WorkerScript.getScript(). This probably means somethings wrong");
        return null;
    }

    /**
     * Returns the script with the specified filename on the specified server,
     * or null if it cannot be found
     */
    getScriptOnServer(fn: string, server: BaseServer): Script | null {
        if (server == null) {
            server = this.getServer();
        }

        for (let i = 0; i < server.scripts.length; ++i) {
            if (server.scripts[i].filename === fn) {
                return server.scripts[i];
            }
        }

        return null;
    }

    shouldLog(fn: string): boolean {
        return (this.disableLogs.ALL == null && this.disableLogs[fn] == null);
    }

    log(txt: string): void {
        this.scriptRef.log(txt);
    }
}
