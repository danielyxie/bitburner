// Class representing a Script instance that is actively running.
// A Script can have multiple active instances
import { Script } from "./Script";
import { IMap } from "../types";
import { Generic_fromJSON,
         Generic_toJSON,
         Reviver } from "../../utils/JSONReviver";

export class RunningScript {
    // Initializes a RunningScript Object from a JSON save state
    static fromJSON(value: any): RunningScript {
        return Generic_fromJSON(RunningScript, value.data);
    }

    // Script arguments
    args: any[] = [];

    // Holds a map of servers hacked, where server = key and the value for each
    // server is an array of four numbers. The four numbers represent:
    //  [MoneyStolen, NumTimesHacked, NumTimesGrown, NumTimesWeaken]
    // This data is used for offline progress
    dataMap: IMap<number[]> = {};

    // Script filename
    filename: string = "";

    // This script's logs. An array of log entries
    logs: string[] = [];

    // Flag indicating whether the logs have been updated since
    // the last time the UI was updated
    logUpd: boolean = false;

    // Total amount of hacking experience earned from this script when offline
    offlineExpGained: number = 0;

    // Total amount of money made by this script when offline
    offlineMoneyMade: number = 0;

    // Number of seconds that the script has been running offline
    offlineRunningTime: number = 0.01;

    // Total amount of hacking experience earned from this script when online
    onlineExpGained: number = 0;

    // Total amount of money made by this script when online
    onlineMoneyMade: number = 0;

    // Number of seconds that this script has been running online
    onlineRunningTime: number = 0.01;

    // How much RAM this script uses for ONE thread
    ramUsage: number = 0;

    // IP of the server on which this script is running
    server: string = "";

    // Number of threads that this script is running with
    threads: number = 1;

    constructor(script: Script | null = null, args: any[] = []) {
        if (script == null) { return; }
        this.filename   = script.filename;
        this.args       = args;

        this.server     = script.server;    //IP Address only
        this.ramUsage   = script.ramUsage;
    }

    RunningScript.prototype.getCode = function() {
        const server = AllServers[this.server];
        if (server == null) { return ""; }
        for (let i = 0; i < server.scripts.length; ++i) {
            if (server.scripts[i].filename === this.filename) {
                return server.scripts[i].code;
            }
        }

        return "";
    }

    RunningScript.prototype.getRamUsage = function() {
        if (this.ramUsage != null && this.ramUsage > 0) { return this.ramUsage; } // Use cached value

        const server = AllServers[this.server];
        if (server == null) { return 0; }
        for (let i = 0; i < server.scripts.length; ++i) {
            if (server.scripts[i].filename === this.filename) {
                // Cache the ram usage for the next call
                this.ramUsage = server.scripts[i].ramUsage;
                return this.ramUsage;
            }
        }


        return 0;
    }

    RunningScript.prototype.log = function(txt) {
        if (this.logs.length > Settings.MaxLogCapacity) {
            //Delete first element and add new log entry to the end.
            //TODO Eventually it might be better to replace this with circular array
            //to improve performance
            this.logs.shift();
        }
        let logEntry = txt;
        if (FconfSettings.ENABLE_TIMESTAMPS) {
            logEntry = "[" + getTimestamp() + "] " + logEntry;
        }
        this.logs.push(logEntry);
        this.logUpd = true;
    }

    RunningScript.prototype.displayLog = function() {
        for (var i = 0; i < this.logs.length; ++i) {
            post(this.logs[i]);
        }
    }

    RunningScript.prototype.clearLog = function() {
        this.logs.length = 0;
    }

    //Update the moneyStolen and numTimesHack maps when hacking
    RunningScript.prototype.recordHack = function(serverIp, moneyGained, n=1) {
        if (this.dataMap[serverIp] == null || this.dataMap[serverIp].constructor !== Array) {
            this.dataMap[serverIp] = [0, 0, 0, 0];
        }
        this.dataMap[serverIp][0] += moneyGained;
        this.dataMap[serverIp][1] += n;
    }

    //Update the grow map when calling grow()
    RunningScript.prototype.recordGrow = function(serverIp, n=1) {
        if (this.dataMap[serverIp] == null || this.dataMap[serverIp].constructor !== Array) {
            this.dataMap[serverIp] = [0, 0, 0, 0];
        }
        this.dataMap[serverIp][2] += n;
    }

    //Update the weaken map when calling weaken() {
    RunningScript.prototype.recordWeaken = function(serverIp, n=1) {
        if (this.dataMap[serverIp] == null || this.dataMap[serverIp].constructor !== Array) {
            this.dataMap[serverIp] = [0, 0, 0, 0];
        }
        this.dataMap[serverIp][3] += n;
    }

    // Serialize the current object to a JSON save state
    toJSON(): any {
        return Generic_toJSON("RunningScript", this);
    }
}

Reviver.constructors.RunningScript = RunningScript;
