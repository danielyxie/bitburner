/**
 * Class representing a Script instance that is actively running.
 * A Script can have multiple active instances
 */
import { Script } from "./Script";
import { Settings } from "../Settings/Settings";
import { IMap } from "../types";
import { Terminal } from "../Terminal";

import { Generic_fromJSON, Generic_toJSON, Reviver } from "../utils/JSONReviver";
import { formatTime } from "../utils/helpers/formatTime";

export class RunningScript {
  // Script arguments
  args: any[] = [];

  // Map of [key: hostname] -> Hacking data. Used for offline progress calculations.
  // Hacking data format: [MoneyStolen, NumTimesHacked, NumTimesGrown, NumTimesWeaken]
  dataMap: IMap<number[]> = {};

  // Script filename
  filename = "";

  // This script's logs. An array of log entries
  logs: string[] = [];

  // Flag indicating whether the logs have been updated since
  // the last time the UI was updated
  logUpd = false;

  // Total amount of hacking experience earned from this script when offline
  offlineExpGained = 0;

  // Total amount of money made by this script when offline
  offlineMoneyMade = 0;

  // Number of seconds that the script has been running offline
  offlineRunningTime = 0.01;

  // Total amount of hacking experience earned from this script when online
  onlineExpGained = 0;

  // Total amount of money made by this script when online
  onlineMoneyMade = 0;

  // Number of seconds that this script has been running online
  onlineRunningTime = 0.01;

  // Process ID. Must be an integer and equals the PID of corresponding WorkerScript
  pid = -1;

  // How much RAM this script uses for ONE thread
  ramUsage = 0;

  // hostname of the server on which this script is running
  server = "";

  // Number of threads that this script is running with
  threads = 1;

  constructor(script: Script | null = null, args: any[] = []) {
    if (script == null) {
      return;
    }
    this.filename = script.filename;
    this.args = args;
    this.server = script.server;
    this.ramUsage = script.ramUsage;
  }

  log(txt: string): void {
    if (this.logs.length > Settings.MaxLogCapacity) {
      this.logs.shift();
    }

    let logEntry = txt;
    if (Settings.TimestampsFormat) {
      logEntry = "[" + formatTime(Settings.TimestampsFormat) + "] " + logEntry;
    }

    this.logs.push(logEntry);
    this.logUpd = true;
  }

  displayLog(): void {
    for (let i = 0; i < this.logs.length; ++i) {
      Terminal.print(this.logs[i]);
    }
  }

  clearLog(): void {
    this.logs.length = 0;
  }

  // Update the moneyStolen and numTimesHack maps when hacking
  recordHack(hostname: string, moneyGained: number, n = 1): void {
    if (this.dataMap[hostname] == null || this.dataMap[hostname].constructor !== Array) {
      this.dataMap[hostname] = [0, 0, 0, 0];
    }
    this.dataMap[hostname][0] += moneyGained;
    this.dataMap[hostname][1] += n;
  }

  // Update the grow map when calling grow()
  recordGrow(hostname: string, n = 1): void {
    if (this.dataMap[hostname] == null || this.dataMap[hostname].constructor !== Array) {
      this.dataMap[hostname] = [0, 0, 0, 0];
    }
    this.dataMap[hostname][2] += n;
  }

  // Update the weaken map when calling weaken() {
  recordWeaken(hostname: string, n = 1): void {
    if (this.dataMap[hostname] == null || this.dataMap[hostname].constructor !== Array) {
      this.dataMap[hostname] = [0, 0, 0, 0];
    }
    this.dataMap[hostname][3] += n;
  }

  // Serialize the current object to a JSON save state
  toJSON(): any {
    return Generic_toJSON("RunningScript", this);
  }

  // Initializes a RunningScript Object from a JSON save state
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static fromJSON(value: any): RunningScript {
    return Generic_fromJSON(RunningScript, value.data);
  }
}

Reviver.constructors.RunningScript = RunningScript;
