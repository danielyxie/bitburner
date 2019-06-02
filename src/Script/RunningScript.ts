/**
 * Class representing a Script instance that is actively running.
 * A Script can have multiple active instances
 */
import { Script } from "./Script";
import { FconfSettings } from "../Fconf/FconfSettings";
import { Settings } from "../Settings/Settings";
import { IMap } from "../types";
import { post } from "../ui/postToTerminal";

import {
    Generic_fromJSON,
    Generic_toJSON,
    Reviver
} from "../../utils/JSONReviver";
import { getTimestamp } from "../../utils/helpers/getTimestamp";

export class RunningScript {
    // Initializes a RunningScript Object from a JSON save state
    static fromJSON(value: any): RunningScript {
        return Generic_fromJSON(RunningScript, value.data);
    }

    // Script arguments
    args: any[] = [];

    // Map of [key: server ip] -> Hacking data. Used for offline progress calculations.
    // Hacking data format: [MoneyStolen, NumTimesHacked, NumTimesGrown, NumTimesWeaken]
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
        this.server     = script.server;
        this.ramUsage   = script.ramUsage;
    }

    log(txt: string): void {
        if (this.logs.length > Settings.MaxLogCapacity) {
            this.logs.shift();
        }

        let logEntry = txt;
        if (FconfSettings.ENABLE_TIMESTAMPS) {
            logEntry = "[" + getTimestamp() + "] " + logEntry;
        }

        this.logs.push(logEntry);
        this.logUpd = true;
    }

    displayLog(): void {
        for (var i = 0; i < this.logs.length; ++i) {
            post(this.logs[i]);
        }
    }

    clearLog(): void {
        this.logs.length = 0;
    }

    // Update the moneyStolen and numTimesHack maps when hacking
    recordHack(serverIp: string, moneyGained: number, n: number=1) {
        if (this.dataMap[serverIp] == null || this.dataMap[serverIp].constructor !== Array) {
            this.dataMap[serverIp] = [0, 0, 0, 0];
        }
        this.dataMap[serverIp][0] += moneyGained;
        this.dataMap[serverIp][1] += n;
    }

    // Update the grow map when calling grow()
    recordGrow(serverIp: string, n: number=1) {
        if (this.dataMap[serverIp] == null || this.dataMap[serverIp].constructor !== Array) {
            this.dataMap[serverIp] = [0, 0, 0, 0];
        }
        this.dataMap[serverIp][2] += n;
    }

    // Update the weaken map when calling weaken() {
    recordWeaken(serverIp: string, n: number=1) {
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
