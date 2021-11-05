import { vsprintf, sprintf } from "sprintf-js";

import { getRamCost } from "./Netscript/RamCostGenerator";
import { WorkerScriptStartStopEventEmitter } from "./Netscript/WorkerScriptStartStopEventEmitter";

import { BitNodeMultipliers } from "./BitNode/BitNodeMultipliers";

import { CONSTANTS } from "./Constants";

import {
  calculateHackingChance,
  calculateHackingExpGain,
  calculatePercentMoneyHacked,
  calculateHackingTime,
  calculateGrowTime,
  calculateWeakenTime,
} from "./Hacking";

import { netscriptCanGrow, netscriptCanHack, netscriptCanWeaken } from "./Hacking/netscriptCanHack";

import { HacknetServer } from "./Hacknet/HacknetServer";

import { Terminal } from "./Terminal";

import { Player } from "./Player";
import { Programs } from "./Programs/Programs";
import { Script } from "./Script/Script";
import { findRunningScript, findRunningScriptByPid } from "./Script/ScriptHelpers";
import { isScriptFilename } from "./Script/isScriptFilename";
import { PromptEvent } from "./ui/React/PromptManager";

import { GetServer, GetAllServers, DeleteServer, AddToAllServers, createUniqueRandomIp } from "./Server/AllServers";
import { RunningScript } from "./Script/RunningScript";
import {
  getServerOnNetwork,
  numCycleForGrowth,
  processSingleServerGrowth,
  safetlyCreateUniqueServer,
} from "./Server/ServerHelpers";
import { getPurchaseServerCost, getPurchaseServerLimit, getPurchaseServerMaxRam } from "./Server/ServerPurchases";
import { Server } from "./Server/Server";
import { SourceFileFlags } from "./SourceFile/SourceFileFlags";
import { influenceStockThroughServerHack, influenceStockThroughServerGrow } from "./StockMarket/PlayerInfluencing";

import { isValidFilePath, removeLeadingSlash } from "./Terminal/DirectoryHelpers";
import { TextFile, getTextFile, createTextFile } from "./TextFile";

import { NetscriptPorts, runScriptFromScript } from "./NetscriptWorker";
import { killWorkerScript } from "./Netscript/killWorkerScript";
import { workerScripts } from "./Netscript/WorkerScripts";
import { WorkerScript } from "./Netscript/WorkerScript";
import { makeRuntimeRejectMsg, netscriptDelay, resolveNetscriptRequestedThreads } from "./NetscriptEvaluator";

import { numeralWrapper } from "./ui/numeralFormat";
import { convertTimeMsToTimeElapsedString } from "./utils/StringHelperFunctions";

import { LogBoxEvents } from "./ui/React/LogBoxManager";
import { arrayToString } from "./utils/helpers/arrayToString";
import { isString } from "./utils/helpers/isString";

import { BaseServer } from "./Server/BaseServer";
import { NetscriptGang } from "./NetscriptFunctions/Gang";
import { NetscriptSleeve } from "./NetscriptFunctions/Sleeve";
import { NetscriptExtra } from "./NetscriptFunctions/Extra";
import { NetscriptHacknet } from "./NetscriptFunctions/Hacknet";
import { NS as INS } from "./ScriptEditor/NetscriptDefinitions";
import { NetscriptBladeburner } from "./NetscriptFunctions/Bladeburner";
import { NetscriptCodingContract } from "./NetscriptFunctions/CodingContract";
import { NetscriptCorporation } from "./NetscriptFunctions/Corporation";
import { NetscriptFormulas } from "./NetscriptFunctions/Formulas";
import { NetscriptSingularity } from "./NetscriptFunctions/Singularity";
import { NetscriptStockMarket } from "./NetscriptFunctions/StockMarket";

import { toNative } from "./NetscriptFunctions/toNative";

import { dialogBoxCreate } from "./ui/React/DialogBox";
import { SnackbarEvents } from "./ui/React/Snackbar";

import { Flags } from "./NetscriptFunctions/Flags";

interface NS extends INS {
  [key: string]: any;
}

export function NetscriptFunctions(workerScript: WorkerScript): NS {
  const updateDynamicRam = function (fnName: string, ramCost: number): void {
    if (workerScript.dynamicLoadedFns[fnName]) {
      return;
    }
    workerScript.dynamicLoadedFns[fnName] = true;

    let threads = workerScript.scriptRef.threads;
    if (typeof threads !== "number") {
      console.warn(`WorkerScript detected NaN for threadcount for ${workerScript.name} on ${workerScript.hostname}`);
      threads = 1;
    }

    workerScript.dynamicRamUsage += ramCost;
    if (workerScript.dynamicRamUsage > 1.01 * workerScript.ramUsage) {
      throw makeRuntimeRejectMsg(
        workerScript,
        `Dynamic RAM usage calculated to be greater than initial RAM usage on fn: ${fnName}.
        This is probably because you somehow circumvented the static RAM calculation.

        Threads: ${threads}
        Dynamic RAM Usage: ${numeralWrapper.formatRAM(workerScript.dynamicRamUsage)}
        Static RAM Usage: ${numeralWrapper.formatRAM(workerScript.ramUsage)}

        One of these could be the reason:
        * Using eval() to get a reference to a ns function
        &nbsp;&nbsp;const myScan = eval('ns.scan');

        * Using map access to do the same
        &nbsp;&nbsp;const myScan = ns['scan'];

        Sorry :(`,
      );
    }
  };

  /**
   * Gets the Server for a specific hostname/ip, throwing an error
   * if the server doesn't exist.
   * @param {string} hostname - Hostname or IP of the server
   * @param {string} callingFnName - Name of calling function. For logging purposes
   * @returns {BaseServer} The specified server as a BaseServer
   */
  const safeGetServer = function (hostname: string, callingFnName: string): BaseServer {
    const server = GetServer(hostname);
    if (server == null) {
      throw makeRuntimeErrorMsg(callingFnName, `Invalid hostname or IP: ${hostname}`);
    }
    return server;
  };

  /**
   * Searches for and returns the RunningScript object for the specified script.
   * If the 'fn' argument is not specified, this returns the current RunningScript.
   * @param {string} fn - Filename of script
   * @param {string} hostname - Hostname/ip of the server on which the script resides
   * @param {any[]} scriptArgs - Running script's arguments
   * @returns {RunningScript}
   *      Running script identified by the parameters, or null if no such script
   *      exists, or the current running script if the first argument 'fn'
   *      is not specified.
   */
  const getRunningScript = function (
    fn: any,
    hostname: any,
    callingFnName: any,
    scriptArgs: any,
  ): RunningScript | null {
    if (typeof callingFnName !== "string" || callingFnName === "") {
      callingFnName = "getRunningScript";
    }

    if (!Array.isArray(scriptArgs)) {
      throw makeRuntimeRejectMsg(
        workerScript,
        `Invalid scriptArgs argument passed into getRunningScript() from ${callingFnName}(). ` +
          `This is probably a bug. Please report to game developer`,
      );
    }

    if (fn != null && typeof fn === "string") {
      // Get Logs of another script
      if (hostname == null) {
        hostname = workerScript.hostname;
      }
      const server = safeGetServer(hostname, callingFnName);

      return findRunningScript(fn, scriptArgs, server);
    }

    // If no arguments are specified, return the current RunningScript
    return workerScript.scriptRef;
  };

  const getRunningScriptByPid = function (pid: any, callingFnName: any): RunningScript | null {
    if (typeof callingFnName !== "string" || callingFnName === "") {
      callingFnName = "getRunningScriptgetRunningScriptByPid";
    }

    for (const server of GetAllServers()) {
      const runningScript = findRunningScriptByPid(pid, server);
      if (runningScript) return runningScript;
    }
    return null;
  };

  /**
   * Helper function for getting the error log message when the user specifies
   * a nonexistent running script
   * @param {string} fn - Filename of script
   * @param {string} hostname - Hostname/ip of the server on which the script resides
   * @param {any[]} scriptArgs - Running script's arguments
   * @returns {string} Error message to print to logs
   */
  const getCannotFindRunningScriptErrorMessage = function (fn: any, hostname: any, scriptArgs: any): string {
    if (!Array.isArray(scriptArgs)) {
      scriptArgs = [];
    }

    return `Cannot find running script ${fn} on server ${hostname} with args: ${arrayToString(scriptArgs)}`;
  };

  /**
   * Used to fail a function if the function's target is a Hacknet Server.
   * This is used for functions that should run on normal Servers, but not Hacknet Servers
   * @param {Server} server - Target server
   * @param {string} callingFn - Name of calling function. For logging purposes
   * @returns {boolean} True if the server is a Hacknet Server, false otherwise
   */
  const failOnHacknetServer = function (server: any, callingFn: any = ""): boolean {
    if (server instanceof HacknetServer) {
      workerScript.log(callingFn, `Does not work on Hacknet Servers`);
      return true;
    } else {
      return false;
    }
  };

  const makeRuntimeErrorMsg = function (caller: string, msg: string): string {
    const errstack = new Error().stack;
    if (errstack === undefined) throw new Error("how did we not throw an error?");
    const stack = errstack.split("\n").slice(1);
    const scripts = workerScript.getServer().scripts;
    const userstack = [];
    for (const stackline of stack) {
      let filename;
      for (const script of scripts) {
        if (script.url && stackline.includes(script.url)) {
          filename = script.filename;
        }
        for (const dependency of script.dependencies) {
          if (stackline.includes(dependency.url)) {
            filename = dependency.filename;
          }
        }
      }
      if (!filename) continue;

      interface ILine {
        line: string;
        func: string;
      }

      function parseChromeStackline(line: string): ILine | null {
        const lineRe = /.*:(\d+):\d+.*/;
        const funcRe = /.*at (.+) \(.*/;

        const lineMatch = line.match(lineRe);
        const funcMatch = line.match(funcRe);
        if (lineMatch && funcMatch) {
          return { line: lineMatch[1], func: funcMatch[1] };
        }
        return null;
      }
      let call = { line: "-1", func: "unknown" };
      const chromeCall = parseChromeStackline(stackline);
      if (chromeCall) {
        call = chromeCall;
      }

      function parseFirefoxStackline(line: string): ILine | null {
        const lineRe = /.*:(\d+):\d+$/;
        const lineMatch = line.match(lineRe);

        const lio = line.lastIndexOf("@");

        if (lineMatch && lio !== -1) {
          return { line: lineMatch[1], func: line.slice(0, lio) };
        }
        return null;
      }

      const firefoxCall = parseFirefoxStackline(stackline);
      if (firefoxCall) {
        call = firefoxCall;
      }

      userstack.push(`${filename}:L${call.line}@${call.func}`);
    }

    workerScript.log(caller, msg);
    let rejectMsg = `${caller}: ${msg}`;
    if (userstack.length !== 0) rejectMsg += `<br><br>Stack:<br>${userstack.join("<br>")}`;
    return makeRuntimeRejectMsg(workerScript, rejectMsg);
  };

  const checkSingularityAccess = function (func: any, n: any): void {
    if (Player.bitNodeN !== 4) {
      if (SourceFileFlags[4] < n) {
        throw makeRuntimeErrorMsg(func, `This singularity function requires Source-File 4-${n} to run.`);
      }
    }
  };

  const hack = function (hostname: any, manual: any, { threads: requestedThreads, stock }: any = {}): Promise<number> {
    if (hostname === undefined) {
      throw makeRuntimeErrorMsg("hack", "Takes 1 argument.");
    }
    const threads = resolveNetscriptRequestedThreads(workerScript, "hack", requestedThreads);
    const server = safeGetServer(hostname, "hack");
    if (!(server instanceof Server)) {
      throw makeRuntimeErrorMsg("hack", "Cannot be executed on this server.");
    }

    // Calculate the hacking time
    const hackingTime = calculateHackingTime(server, Player); // This is in seconds

    // No root access or skill level too low
    const canHack = netscriptCanHack(server, Player);
    if (!canHack.res) {
      throw makeRuntimeErrorMsg("hack", canHack.msg || "");
    }

    workerScript.log(
      "hack",
      `Executing ${hostname} in ${convertTimeMsToTimeElapsedString(
        hackingTime * 1000,
        true,
      )} (t=${numeralWrapper.formatThreads(threads)})`,
    );

    return netscriptDelay(hackingTime * 1000, workerScript).then(function () {
      if (workerScript.env.stopFlag) {
        return Promise.reject(workerScript);
      }
      const hackChance = calculateHackingChance(server, Player);
      const rand = Math.random();
      let expGainedOnSuccess = calculateHackingExpGain(server, Player) * threads;
      const expGainedOnFailure = expGainedOnSuccess / 4;
      if (rand < hackChance) {
        // Success!
        const percentHacked = calculatePercentMoneyHacked(server, Player);
        let maxThreadNeeded = Math.ceil((1 / percentHacked) * (server.moneyAvailable / server.moneyMax));
        if (isNaN(maxThreadNeeded)) {
          // Server has a 'max money' of 0 (probably). We'll set this to an arbitrarily large value
          maxThreadNeeded = 1e6;
        }

        let moneyDrained = Math.floor(server.moneyAvailable * percentHacked) * threads;

        // Over-the-top safety checks
        if (moneyDrained <= 0) {
          moneyDrained = 0;
          expGainedOnSuccess = expGainedOnFailure;
        }
        if (moneyDrained > server.moneyAvailable) {
          moneyDrained = server.moneyAvailable;
        }
        server.moneyAvailable -= moneyDrained;
        if (server.moneyAvailable < 0) {
          server.moneyAvailable = 0;
        }

        const moneyGained = moneyDrained * BitNodeMultipliers.ScriptHackMoneyGain;

        Player.gainMoney(moneyGained, "hacking");
        workerScript.scriptRef.onlineMoneyMade += moneyGained;
        Player.scriptProdSinceLastAug += moneyGained;
        workerScript.scriptRef.recordHack(server.hostname, moneyGained, threads);
        Player.gainHackingExp(expGainedOnSuccess);
        workerScript.scriptRef.onlineExpGained += expGainedOnSuccess;
        workerScript.log(
          "hack",
          `Successfully hacked '${server.hostname}' for ${numeralWrapper.formatMoney(
            moneyGained,
          )} and ${numeralWrapper.formatExp(expGainedOnSuccess)} exp (t=${numeralWrapper.formatThreads(threads)})`,
        );
        server.fortify(CONSTANTS.ServerFortifyAmount * Math.min(threads, maxThreadNeeded));
        if (stock) {
          influenceStockThroughServerHack(server, moneyGained);
        }
        if (manual) {
          server.backdoorInstalled = true;
        }
        return Promise.resolve(moneyGained);
      } else {
        // Player only gains 25% exp for failure?
        Player.gainHackingExp(expGainedOnFailure);
        workerScript.scriptRef.onlineExpGained += expGainedOnFailure;
        workerScript.log(
          "hack",
          `Failed to hack '${server.hostname}'. Gained ${numeralWrapper.formatExp(
            expGainedOnFailure,
          )} exp (t=${numeralWrapper.formatThreads(threads)})`,
        );
        return Promise.resolve(0);
      }
    });
  };

  const argsToString = function (args: any[]): string {
    let out = "";
    for (let arg of args) {
      arg = toNative(arg);
      out += typeof arg === "object" ? JSON.stringify(arg) : `${arg}`;
    }

    return out;
  };

  const helper = {
    updateDynamicRam: updateDynamicRam,
    makeRuntimeErrorMsg: makeRuntimeErrorMsg,
    string: (funcName: string, argName: string, v: any): string => {
      if (typeof v === "string") return v;
      if (typeof v === "number") return v + ""; // cast to string;
      throw makeRuntimeErrorMsg(funcName, `${argName} should be a string`);
    },
    number: (funcName: string, argName: string, v: any): number => {
      if (typeof v === "number") return v;
      if (!isNaN(v) && !isNaN(parseFloat(v))) return parseFloat(v);
      throw makeRuntimeErrorMsg(funcName, `${argName} should be a number`);
    },
    boolean: (v: any): boolean => {
      return !!v; // Just convert it to boolean.
    },
    getServer: safeGetServer,
    checkSingularityAccess: checkSingularityAccess,
    hack: hack,
  };

  const gang = NetscriptGang(Player, workerScript, helper);
  const sleeve = NetscriptSleeve(Player, workerScript, helper);
  const extra = NetscriptExtra(Player, workerScript);
  const hacknet = NetscriptHacknet(Player, workerScript, helper);
  const bladeburner = NetscriptBladeburner(Player, workerScript, helper);
  const codingcontract = NetscriptCodingContract(Player, workerScript, helper);
  const corporation = NetscriptCorporation(Player, workerScript, helper);
  const formulas = NetscriptFormulas(Player, workerScript, helper);
  const singularity = NetscriptSingularity(Player, workerScript, helper);
  const stockmarket = NetscriptStockMarket(Player, workerScript, helper);

  const base: INS = {
    ...singularity,

    gang: gang,
    bladeburner: bladeburner,
    codingcontract: codingcontract,
    sleeve: sleeve,

    formulas: formulas,
    stock: stockmarket,
    args: workerScript.args,
    hacknet: hacknet,
    sprintf: sprintf,
    vsprintf: vsprintf,
    scan: function (hostname: any = workerScript.hostname): any {
      updateDynamicRam("scan", getRamCost("scan"));
      const server = safeGetServer(hostname, "scan");
      const out = [];
      for (let i = 0; i < server.serversOnNetwork.length; i++) {
        const s = getServerOnNetwork(server, i);
        if (s === null) continue;
        const entry = s.hostname;
        if (entry === null) continue;
        out.push(entry);
      }
      workerScript.log("scan", `returned ${server.serversOnNetwork.length} connections for ${server.hostname}`);
      return out;
    },
    hack: function (hostname: any, { threads: requestedThreads, stock }: any = {}): any {
      updateDynamicRam("hack", getRamCost("hack"));
      return hack(hostname, false, { threads: requestedThreads, stock: stock });
    },
    hackAnalyzeThreads: function (hostname: any, hackAmount: any): any {
      updateDynamicRam("hackAnalyzeThreads", getRamCost("hackAnalyzeThreads"));

      // Check argument validity
      const server = safeGetServer(hostname, "hackAnalyzeThreads");
      if (!(server instanceof Server)) {
        workerScript.log("hackAnalyzeThreads", "Cannot be executed on this server.");
        return -1;
      }
      if (isNaN(hackAmount)) {
        throw makeRuntimeErrorMsg(
          "hackAnalyzeThreads",
          `Invalid growth argument passed into hackAnalyzeThreads: ${hackAmount}. Must be numeric.`,
        );
      }

      if (hackAmount < 0 || hackAmount > server.moneyAvailable) {
        return -1;
      }

      const percentHacked = calculatePercentMoneyHacked(server, Player);

      return hackAmount / Math.floor(server.moneyAvailable * percentHacked);
    },
    hackAnalyze: function (hostname: any): any {
      updateDynamicRam("hackAnalyze", getRamCost("hackAnalyze"));

      const server = safeGetServer(hostname, "hackAnalyze");
      if (!(server instanceof Server)) {
        workerScript.log("hackAnalyze", "Cannot be executed on this server.");
        return false;
      }

      return calculatePercentMoneyHacked(server, Player);
    },
    hackAnalyzeSecurity: function (threads: any): number {
      return CONSTANTS.ServerFortifyAmount * threads;
    },
    hackAnalyzeChance: function (hostname: any): any {
      updateDynamicRam("hackAnalyzeChance", getRamCost("hackAnalyzeChance"));

      const server = safeGetServer(hostname, "hackAnalyzeChance");
      if (!(server instanceof Server)) {
        workerScript.log("hackAnalyzeChance", "Cannot be executed on this server.");
        return false;
      }

      return calculateHackingChance(server, Player);
    },
    sleep: function (time: any): any {
      if (time === undefined) {
        throw makeRuntimeErrorMsg("sleep", "Takes 1 argument.");
      }
      workerScript.log("sleep", `Sleeping for ${time} milliseconds`);
      return netscriptDelay(time, workerScript).then(function () {
        return Promise.resolve(true);
      });
    },
    asleep: function (time: any): any {
      if (time === undefined) {
        throw makeRuntimeErrorMsg("asleep", "Takes 1 argument.");
      }
      workerScript.log("asleep", `Sleeping for ${time} milliseconds`);
      return netscriptDelay(time, workerScript).then(function () {
        return Promise.resolve(true);
      });
    },
    grow: function (hostname: any, { threads: requestedThreads, stock }: any = {}): any {
      updateDynamicRam("grow", getRamCost("grow"));
      const threads = resolveNetscriptRequestedThreads(workerScript, "grow", requestedThreads);
      if (hostname === undefined) {
        throw makeRuntimeErrorMsg("grow", "Takes 1 argument.");
      }
      const server = safeGetServer(hostname, "grow");
      if (!(server instanceof Server)) {
        workerScript.log("grow", "Cannot be executed on this server.");
        return false;
      }

      const host = GetServer(workerScript.hostname);
      if (host === null) {
        throw new Error("Workerscript host is null");
      }

      // No root access or skill level too low
      const canHack = netscriptCanGrow(server);
      if (!canHack.res) {
        throw makeRuntimeErrorMsg("grow", canHack.msg || "");
      }

      const growTime = calculateGrowTime(server, Player);
      workerScript.log(
        "grow",
        `Executing on '${server.hostname}' in ${convertTimeMsToTimeElapsedString(
          growTime * 1000,
          true,
        )} (t=${numeralWrapper.formatThreads(threads)}).`,
      );
      return netscriptDelay(growTime * 1000, workerScript).then(function () {
        if (workerScript.env.stopFlag) {
          return Promise.reject(workerScript);
        }
        const moneyBefore = server.moneyAvailable <= 0 ? 1 : server.moneyAvailable;
        processSingleServerGrowth(server, threads, Player, host.cpuCores);
        const moneyAfter = server.moneyAvailable;
        workerScript.scriptRef.recordGrow(server.hostname, threads);
        const expGain = calculateHackingExpGain(server, Player) * threads;
        const logGrowPercent = moneyAfter / moneyBefore - 1;
        workerScript.log(
          "grow",
          `Available money on '${server.hostname}' grown by ${numeralWrapper.formatPercentage(
            logGrowPercent,
            6,
          )}. Gained ${numeralWrapper.formatExp(expGain)} hacking exp (t=${numeralWrapper.formatThreads(threads)}).`,
        );
        workerScript.scriptRef.onlineExpGained += expGain;
        Player.gainHackingExp(expGain);
        if (stock) {
          influenceStockThroughServerGrow(server, moneyAfter - moneyBefore);
        }
        return Promise.resolve(moneyAfter / moneyBefore);
      });
    },
    growthAnalyze: function (hostname: any, growth: any, cores: any = 1): any {
      updateDynamicRam("growthAnalyze", getRamCost("growthAnalyze"));

      // Check argument validity
      const server = safeGetServer(hostname, "growthAnalyze");
      if (!(server instanceof Server)) {
        workerScript.log("growthAnalyze", "Cannot be executed on this server.");
        return false;
      }
      if (typeof growth !== "number" || isNaN(growth) || growth < 1 || !isFinite(growth)) {
        throw makeRuntimeErrorMsg("growthAnalyze", `Invalid argument: growth must be numeric and >= 1, is ${growth}.`);
      }

      return numCycleForGrowth(server, Number(growth), Player, cores);
    },
    growthAnalyzeSecurity: function (threads: any): number {
      return 2 * CONSTANTS.ServerFortifyAmount * threads;
    },
    weaken: function (hostname: any, { threads: requestedThreads }: any = {}): any {
      updateDynamicRam("weaken", getRamCost("weaken"));
      const threads = resolveNetscriptRequestedThreads(workerScript, "weaken", requestedThreads);
      if (hostname === undefined) {
        throw makeRuntimeErrorMsg("weaken", "Takes 1 argument.");
      }
      const server = safeGetServer(hostname, "weaken");
      if (!(server instanceof Server)) {
        workerScript.log("weaken", "Cannot be executed on this server.");
        return false;
      }

      // No root access or skill level too low
      const canHack = netscriptCanWeaken(server);
      if (!canHack.res) {
        throw makeRuntimeErrorMsg("weaken", canHack.msg || "");
      }

      const weakenTime = calculateWeakenTime(server, Player);
      workerScript.log(
        "weaken",
        `Executing on '${server.hostname}' in ${convertTimeMsToTimeElapsedString(
          weakenTime * 1000,
          true,
        )} (t=${numeralWrapper.formatThreads(threads)})`,
      );
      return netscriptDelay(weakenTime * 1000, workerScript).then(function () {
        if (workerScript.env.stopFlag) return Promise.reject(workerScript);
        const host = GetServer(workerScript.hostname);
        if (host === null) {
          workerScript.log("weaken", "Server is null, did it die?");
          return Promise.resolve(0);
        }
        const coreBonus = 1 + (host.cpuCores - 1) / 16;
        server.weaken(CONSTANTS.ServerWeakenAmount * threads * coreBonus);
        workerScript.scriptRef.recordWeaken(server.hostname, threads);
        const expGain = calculateHackingExpGain(server, Player) * threads;
        workerScript.log(
          "weaken",
          `'${server.hostname}' security level weakened to ${server.hackDifficulty}. Gained ${numeralWrapper.formatExp(
            expGain,
          )} hacking exp (t=${numeralWrapper.formatThreads(threads)})`,
        );
        workerScript.scriptRef.onlineExpGained += expGain;
        Player.gainHackingExp(expGain);
        return Promise.resolve(CONSTANTS.ServerWeakenAmount * threads * coreBonus);
      });
    },
    weakenAnalyze: function (threads: any, cores: any = 1): number {
      const coreBonus = 1 + (cores - 1) / 16;
      return CONSTANTS.ServerWeakenAmount * threads * coreBonus;
    },
    print: function (...args: any[]): void {
      if (args.length === 0) {
        throw makeRuntimeErrorMsg("print", "Takes at least 1 argument.");
      }
      workerScript.print(argsToString(args));
    },
    tprint: function (...args: any[]): void {
      if (args.length === 0) {
        throw makeRuntimeErrorMsg("tprint", "Takes at least 1 argument.");
      }
      Terminal.print(`${workerScript.scriptRef.filename}: ${argsToString(args)}`);
    },
    tprintf: function (format: any, ...args: any): any {
      Terminal.print(vsprintf(format, args));
    },
    clearLog: function (): any {
      workerScript.scriptRef.clearLog();
    },
    disableLog: function (fn: any): any {
      if (fn === "ALL") {
        for (fn in possibleLogs) {
          workerScript.disableLogs[fn] = true;
        }
        workerScript.log("disableLog", `Disabled logging for all functions`);
      } else if (possibleLogs[fn] === undefined) {
        throw makeRuntimeErrorMsg("disableLog", `Invalid argument: ${fn}.`);
      } else {
        workerScript.disableLogs[fn] = true;
        workerScript.log("disableLog", `Disabled logging for ${fn}`);
      }
    },
    enableLog: function (fn: any): any {
      if (possibleLogs[fn] === undefined) {
        throw makeRuntimeErrorMsg("enableLog", `Invalid argument: ${fn}.`);
      }
      delete workerScript.disableLogs[fn];
      workerScript.log("enableLog", `Enabled logging for ${fn}`);
    },
    isLogEnabled: function (fn: any): any {
      if (possibleLogs[fn] === undefined) {
        throw makeRuntimeErrorMsg("isLogEnabled", `Invalid argument: ${fn}.`);
      }
      return workerScript.disableLogs[fn] ? false : true;
    },
    getScriptLogs: function (fn: any, hostname: any, ...scriptArgs: any): any {
      const runningScriptObj = getRunningScript(fn, hostname, "getScriptLogs", scriptArgs);
      if (runningScriptObj == null) {
        workerScript.log("getScriptLogs", getCannotFindRunningScriptErrorMessage(fn, hostname, scriptArgs));
        return "";
      }

      return runningScriptObj.logs.slice();
    },
    tail: function (fn: any, hostname: any = workerScript.hostname, ...scriptArgs: any): any {
      let runningScriptObj;
      if (arguments.length === 0) {
        runningScriptObj = workerScript.scriptRef;
      } else if (typeof fn === "number") {
        runningScriptObj = getRunningScriptByPid(fn, "tail");
      } else {
        runningScriptObj = getRunningScript(fn, hostname, "tail", scriptArgs);
      }
      if (runningScriptObj == null) {
        workerScript.log("tail", getCannotFindRunningScriptErrorMessage(fn, hostname, scriptArgs));
        return;
      }

      LogBoxEvents.emit(runningScriptObj);
    },
    nuke: function (hostname: any): boolean {
      updateDynamicRam("nuke", getRamCost("nuke"));
      if (hostname === undefined) {
        throw makeRuntimeErrorMsg("nuke", "Takes 1 argument.");
      }
      const server = safeGetServer(hostname, "nuke");
      if (!(server instanceof Server)) {
        workerScript.log("nuke", "Cannot be executed on this server.");
        return false;
      }
      if (!Player.hasProgram(Programs.NukeProgram.name)) {
        throw makeRuntimeErrorMsg("nuke", "You do not have the NUKE.exe virus!");
      }
      if (server.openPortCount < server.numOpenPortsRequired) {
        throw makeRuntimeErrorMsg("nuke", "Not enough ports opened to use NUKE.exe virus.");
      }
      if (server.hasAdminRights) {
        workerScript.log("nuke", `Already have root access to '${server.hostname}'.`);
      } else {
        server.hasAdminRights = true;
        workerScript.log("nuke", `Executed NUKE.exe virus on '${server.hostname}' to gain root access.`);
      }
      return true;
    },
    brutessh: function (hostname: any): boolean {
      updateDynamicRam("brutessh", getRamCost("brutessh"));
      if (hostname === undefined) {
        throw makeRuntimeErrorMsg("brutessh", "Takes 1 argument.");
      }
      const server = safeGetServer(hostname, "brutessh");
      if (!(server instanceof Server)) {
        workerScript.log("brutessh", "Cannot be executed on this server.");
        return false;
      }
      if (!Player.hasProgram(Programs.BruteSSHProgram.name)) {
        throw makeRuntimeErrorMsg("brutessh", "You do not have the BruteSSH.exe program!");
      }
      if (!server.sshPortOpen) {
        workerScript.log("brutessh", `Executed BruteSSH.exe on '${server.hostname}' to open SSH port (22).`);
        server.sshPortOpen = true;
        ++server.openPortCount;
      } else {
        workerScript.log("brutessh", `SSH Port (22) already opened on '${server.hostname}'.`);
      }
      return true;
    },
    ftpcrack: function (hostname: any): boolean {
      updateDynamicRam("ftpcrack", getRamCost("ftpcrack"));
      if (hostname === undefined) {
        throw makeRuntimeErrorMsg("ftpcrack", "Takes 1 argument.");
      }
      const server = safeGetServer(hostname, "ftpcrack");
      if (!(server instanceof Server)) {
        workerScript.log("ftpcrack", "Cannot be executed on this server.");
        return false;
      }
      if (!Player.hasProgram(Programs.FTPCrackProgram.name)) {
        throw makeRuntimeErrorMsg("ftpcrack", "You do not have the FTPCrack.exe program!");
      }
      if (!server.ftpPortOpen) {
        workerScript.log("ftpcrack", `Executed FTPCrack.exe on '${server.hostname}' to open FTP port (21).`);
        server.ftpPortOpen = true;
        ++server.openPortCount;
      } else {
        workerScript.log("ftpcrack", `FTP Port (21) already opened on '${server.hostname}'.`);
      }
      return true;
    },
    relaysmtp: function (hostname: any): boolean {
      updateDynamicRam("relaysmtp", getRamCost("relaysmtp"));
      if (hostname === undefined) {
        throw makeRuntimeErrorMsg("relaysmtp", "Takes 1 argument.");
      }
      const server = safeGetServer(hostname, "relaysmtp");
      if (!(server instanceof Server)) {
        workerScript.log("relaysmtp", "Cannot be executed on this server.");
        return false;
      }
      if (!Player.hasProgram(Programs.RelaySMTPProgram.name)) {
        throw makeRuntimeErrorMsg("relaysmtp", "You do not have the relaySMTP.exe program!");
      }
      if (!server.smtpPortOpen) {
        workerScript.log("relaysmtp", `Executed relaySMTP.exe on '${server.hostname}' to open SMTP port (25).`);
        server.smtpPortOpen = true;
        ++server.openPortCount;
      } else {
        workerScript.log("relaysmtp", `SMTP Port (25) already opened on '${server.hostname}'.`);
      }
      return true;
    },
    httpworm: function (hostname: any): boolean {
      updateDynamicRam("httpworm", getRamCost("httpworm"));
      if (hostname === undefined) {
        throw makeRuntimeErrorMsg("httpworm", "Takes 1 argument");
      }
      const server = safeGetServer(hostname, "httpworm");
      if (!(server instanceof Server)) {
        workerScript.log("httpworm", "Cannot be executed on this server.");
        return false;
      }
      if (!Player.hasProgram(Programs.HTTPWormProgram.name)) {
        throw makeRuntimeErrorMsg("httpworm", "You do not have the HTTPWorm.exe program!");
      }
      if (!server.httpPortOpen) {
        workerScript.log("httpworm", `Executed HTTPWorm.exe on '${server.hostname}' to open HTTP port (80).`);
        server.httpPortOpen = true;
        ++server.openPortCount;
      } else {
        workerScript.log("httpworm", `HTTP Port (80) already opened on '${server.hostname}'.`);
      }
      return true;
    },
    sqlinject: function (hostname: any): boolean {
      updateDynamicRam("sqlinject", getRamCost("sqlinject"));
      if (hostname === undefined) {
        throw makeRuntimeErrorMsg("sqlinject", "Takes 1 argument.");
      }
      const server = safeGetServer(hostname, "sqlinject");
      if (!(server instanceof Server)) {
        workerScript.log("sqlinject", "Cannot be executed on this server.");
        return false;
      }
      if (!Player.hasProgram(Programs.SQLInjectProgram.name)) {
        throw makeRuntimeErrorMsg("sqlinject", "You do not have the SQLInject.exe program!");
      }
      if (!server.sqlPortOpen) {
        workerScript.log("sqlinject", `Executed SQLInject.exe on '${server.hostname}' to open SQL port (1433).`);
        server.sqlPortOpen = true;
        ++server.openPortCount;
      } else {
        workerScript.log("sqlinject", `SQL Port (1433) already opened on '${server.hostname}'.`);
      }
      return true;
    },
    run: function (scriptname: any, threads: any = 1, ...args: any[]): any {
      updateDynamicRam("run", getRamCost("run"));
      if (scriptname === undefined) {
        throw makeRuntimeErrorMsg("run", "Usage: run(scriptname, [numThreads], [arg1], [arg2]...)");
      }
      if (isNaN(threads) || threads <= 0) {
        throw makeRuntimeErrorMsg("run", `Invalid thread count. Must be numeric and > 0, is ${threads}`);
      }
      const scriptServer = GetServer(workerScript.hostname);
      if (scriptServer == null) {
        throw makeRuntimeErrorMsg("run", "Could not find server. This is a bug. Report to dev.");
      }

      return runScriptFromScript("run", scriptServer, scriptname, args, workerScript, threads);
    },
    exec: function (scriptname: any, hostname: any, threads: any = 1, ...args: any[]): any {
      updateDynamicRam("exec", getRamCost("exec"));
      if (scriptname === undefined || hostname === undefined) {
        throw makeRuntimeErrorMsg("exec", "Usage: exec(scriptname, server, [numThreads], [arg1], [arg2]...)");
      }
      if (isNaN(threads) || threads <= 0) {
        throw makeRuntimeErrorMsg("exec", `Invalid thread count. Must be numeric and > 0, is ${threads}`);
      }
      const server = safeGetServer(hostname, "exec");
      return runScriptFromScript("exec", server, scriptname, args, workerScript, threads);
    },
    spawn: function (scriptname: any, threads: any, ...args: any[]): any {
      updateDynamicRam("spawn", getRamCost("spawn"));
      if (!scriptname || !threads) {
        throw makeRuntimeErrorMsg("spawn", "Usage: spawn(scriptname, threads)");
      }

      const spawnDelay = 10;
      setTimeout(() => {
        if (isNaN(threads) || threads <= 0) {
          throw makeRuntimeErrorMsg("spawn", `Invalid thread count. Must be numeric and > 0, is ${threads}`);
        }
        const scriptServer = GetServer(workerScript.hostname);
        if (scriptServer == null) {
          throw makeRuntimeErrorMsg("spawn", "Could not find server. This is a bug. Report to dev");
        }

        return runScriptFromScript("spawn", scriptServer, scriptname, args, workerScript, threads);
      }, spawnDelay * 1e3);

      workerScript.log("spawn", `Will execute '${scriptname}' in ${spawnDelay} seconds`);

      workerScript.running = false; // Prevent workerScript from "finishing execution naturally"
      if (killWorkerScript(workerScript)) {
        workerScript.log("spawn", "Exiting...");
      }
    },
    kill: function (filename: any, hostname: any, ...scriptArgs: any): any {
      updateDynamicRam("kill", getRamCost("kill"));

      let res;
      const killByPid = typeof filename === "number";
      if (killByPid) {
        // Kill by pid
        res = killWorkerScript(filename);
      } else {
        // Kill by filename/hostname
        if (filename === undefined || hostname === undefined) {
          throw makeRuntimeErrorMsg("kill", "Usage: kill(scriptname, server, [arg1], [arg2]...)");
        }

        const server = safeGetServer(hostname, "kill");
        const runningScriptObj = getRunningScript(filename, hostname, "kill", scriptArgs);
        if (runningScriptObj == null) {
          workerScript.log("kill", getCannotFindRunningScriptErrorMessage(filename, hostname, scriptArgs));
          return false;
        }

        res = killWorkerScript(runningScriptObj, server.hostname);
      }

      if (res) {
        if (killByPid) {
          workerScript.log("kill", `Killing script with PID ${filename}`);
        } else {
          workerScript.log("kill", `Killing '${filename}' on '${hostname}' with args: ${arrayToString(scriptArgs)}.`);
        }
        return true;
      } else {
        if (killByPid) {
          workerScript.log("kill", `No script with PID ${filename}`);
        } else {
          workerScript.log(
            "kill",
            `No such script '${filename}' on '${hostname}' with args: ${arrayToString(scriptArgs)}`,
          );
        }
        return false;
      }
    },
    killall: function (hostname: any = workerScript.hostname): any {
      updateDynamicRam("killall", getRamCost("killall"));
      if (hostname === undefined) {
        throw makeRuntimeErrorMsg("killall", "Takes 1 argument");
      }
      const server = safeGetServer(hostname, "killall");
      const scriptsRunning = server.runningScripts.length > 0;
      for (let i = server.runningScripts.length - 1; i >= 0; --i) {
        killWorkerScript(server.runningScripts[i], server.hostname, false);
      }
      WorkerScriptStartStopEventEmitter.emit();
      workerScript.log(
        "killall",
        `Killing all scripts on '${server.hostname}'. May take a few minutes for the scripts to die.`,
      );

      return scriptsRunning;
    },
    exit: function (): any {
      workerScript.running = false; // Prevent workerScript from "finishing execution naturally"
      if (killWorkerScript(workerScript)) {
        workerScript.log("exit", "Exiting...");
      } else {
        workerScript.log("exit", "Failed. This is a bug. Report to dev.");
      }
    },
    scp: async function (scriptname: any, hostname1: any, hostname2: any): Promise<boolean> {
      updateDynamicRam("scp", getRamCost("scp"));
      if (arguments.length !== 2 && arguments.length !== 3) {
        throw makeRuntimeErrorMsg("scp", "Takes 2 or 3 arguments");
      }
      if (scriptname && scriptname.constructor === Array) {
        // Recursively call scp on all elements of array
        let res = false;
        await scriptname.forEach(async function (script) {
          if (await NetscriptFunctions(workerScript).scp(script, hostname1, hostname2)) {
            res = true;
          }
        });
        return Promise.resolve(res);
      }

      // Invalid file type
      if (!isValidFilePath(scriptname)) {
        throw makeRuntimeErrorMsg("scp", `Invalid filename: '${scriptname}'`);
      }

      // Invalid file name
      if (!scriptname.endsWith(".lit") && !isScriptFilename(scriptname) && !scriptname.endsWith("txt")) {
        throw makeRuntimeErrorMsg("scp", "Only works for .script, .lit, and .txt files");
      }

      let destServer, currServ;

      if (hostname2 != null) {
        // 3 Argument version: scriptname, source, destination
        if (scriptname === undefined || hostname1 === undefined || hostname2 === undefined) {
          throw makeRuntimeErrorMsg("scp", "Takes 2 or 3 arguments");
        }
        destServer = safeGetServer(hostname2, "scp");
        currServ = safeGetServer(hostname1, "scp");
      } else if (hostname1 != null) {
        // 2 Argument version: scriptname, destination
        if (scriptname === undefined || hostname1 === undefined) {
          throw makeRuntimeErrorMsg("scp", "Takes 2 or 3 arguments");
        }
        destServer = safeGetServer(hostname1, "scp");
        currServ = GetServer(workerScript.hostname);
        if (currServ == null) {
          throw makeRuntimeErrorMsg(
            "scp",
            "Could not find server hostname for this script. This is a bug. Report to dev.",
          );
        }
      } else {
        throw makeRuntimeErrorMsg("scp", "Takes 2 or 3 arguments");
      }

      // Scp for lit files
      if (scriptname.endsWith(".lit")) {
        let found = false;
        for (let i = 0; i < currServ.messages.length; ++i) {
          if (currServ.messages[i] == scriptname) {
            found = true;
            break;
          }
        }

        if (!found) {
          workerScript.log("scp", `File '${scriptname}' does not exist.`);
          return Promise.resolve(false);
        }

        for (let i = 0; i < destServer.messages.length; ++i) {
          if (destServer.messages[i] === scriptname) {
            workerScript.log("scp", `File '${scriptname}' copied over to '${destServer.hostname}'.`);
            return Promise.resolve(true); // Already exists
          }
        }
        destServer.messages.push(scriptname);
        workerScript.log("scp", `File '${scriptname}' copied over to '${destServer.hostname}'.`);
        return Promise.resolve(true);
      }

      // Scp for text files
      if (scriptname.endsWith(".txt")) {
        let txtFile;
        for (let i = 0; i < currServ.textFiles.length; ++i) {
          if (currServ.textFiles[i].fn === scriptname) {
            txtFile = currServ.textFiles[i];
            break;
          }
        }
        if (txtFile === undefined) {
          workerScript.log("scp", `File '${scriptname}' does not exist.`);
          return Promise.resolve(false);
        }

        for (let i = 0; i < destServer.textFiles.length; ++i) {
          if (destServer.textFiles[i].fn === scriptname) {
            // Overwrite
            destServer.textFiles[i].text = txtFile.text;
            workerScript.log("scp", `File '${scriptname}' copied over to '${destServer.hostname}'.`);
            return Promise.resolve(true);
          }
        }
        const newFile = new TextFile(txtFile.fn, txtFile.text);
        destServer.textFiles.push(newFile);
        workerScript.log("scp", `File '${scriptname}' copied over to '${destServer.hostname}'.`);
        return Promise.resolve(true);
      }

      // Scp for script files
      let sourceScript = null;
      for (let i = 0; i < currServ.scripts.length; ++i) {
        if (scriptname == currServ.scripts[i].filename) {
          sourceScript = currServ.scripts[i];
          break;
        }
      }
      if (sourceScript == null) {
        workerScript.log("scp", `File '${scriptname}' does not exist.`);
        return Promise.resolve(false);
      }

      // Overwrite script if it already exists
      for (let i = 0; i < destServer.scripts.length; ++i) {
        if (scriptname == destServer.scripts[i].filename) {
          workerScript.log("scp", `WARNING: File '${scriptname}' overwritten on '${destServer.hostname}'`);
          const oldScript = destServer.scripts[i];
          // If it's the exact same file don't actually perform the
          // copy to avoid recompiling uselessly. Players tend to scp
          // liberally.
          if (oldScript.code === sourceScript.code) return Promise.resolve(true);
          oldScript.code = sourceScript.code;
          oldScript.ramUsage = sourceScript.ramUsage;
          oldScript.markUpdated();
          return Promise.resolve(true);
        }
      }

      // Create new script if it does not already exist
      const newScript = new Script(scriptname);
      newScript.code = sourceScript.code;
      newScript.ramUsage = sourceScript.ramUsage;
      newScript.server = destServer.hostname;
      destServer.scripts.push(newScript);
      workerScript.log("scp", `File '${scriptname}' copied over to '${destServer.hostname}'.`);
      return Promise.resolve(true);
    },
    ls: function (hostname: any, grep: any): any {
      updateDynamicRam("ls", getRamCost("ls"));
      if (hostname === undefined) {
        throw makeRuntimeErrorMsg("ls", "Usage: ls(hostname/ip, [grep filter])");
      }
      const server = safeGetServer(hostname, "ls");

      // Get the grep filter, if one exists
      let filter = "";
      if (arguments.length >= 2) {
        filter = grep.toString();
      }

      const allFiles = [];
      for (let i = 0; i < server.programs.length; i++) {
        if (filter) {
          if (server.programs[i].includes(filter)) {
            allFiles.push(server.programs[i]);
          }
        } else {
          allFiles.push(server.programs[i]);
        }
      }
      for (let i = 0; i < server.scripts.length; i++) {
        if (filter) {
          if (server.scripts[i].filename.includes(filter)) {
            allFiles.push(server.scripts[i].filename);
          }
        } else {
          allFiles.push(server.scripts[i].filename);
        }
      }
      for (let i = 0; i < server.messages.length; i++) {
        if (filter) {
          const msg = server.messages[i];
          if (msg.includes(filter)) {
            allFiles.push(msg);
          }
        } else {
          allFiles.push(server.messages[i]);
        }
      }

      for (let i = 0; i < server.textFiles.length; i++) {
        if (filter) {
          if (server.textFiles[i].fn.includes(filter)) {
            allFiles.push(server.textFiles[i].fn);
          }
        } else {
          allFiles.push(server.textFiles[i].fn);
        }
      }

      for (let i = 0; i < server.contracts.length; ++i) {
        if (filter) {
          if (server.contracts[i].fn.includes(filter)) {
            allFiles.push(server.contracts[i].fn);
          }
        } else {
          allFiles.push(server.contracts[i].fn);
        }
      }

      // Sort the files alphabetically then print each
      allFiles.sort();
      return allFiles;
    },
    ps: function (hostname: any = workerScript.hostname): any {
      updateDynamicRam("ps", getRamCost("ps"));
      const server = safeGetServer(hostname, "ps");
      const processes = [];
      for (const i in server.runningScripts) {
        const script = server.runningScripts[i];
        processes.push({
          filename: script.filename,
          threads: script.threads,
          args: script.args.slice(),
          pid: script.pid,
        });
      }
      return processes;
    },
    hasRootAccess: function (hostname: any): any {
      updateDynamicRam("hasRootAccess", getRamCost("hasRootAccess"));
      if (hostname === undefined) {
        throw makeRuntimeErrorMsg("hasRootAccess", "Takes 1 argument");
      }
      const server = safeGetServer(hostname, "hasRootAccess");
      return server.hasAdminRights;
    },
    getHostname: function (): any {
      updateDynamicRam("getHostname", getRamCost("getHostname"));
      const scriptServer = GetServer(workerScript.hostname);
      if (scriptServer == null) {
        throw makeRuntimeErrorMsg("getHostname", "Could not find server. This is a bug. Report to dev.");
      }
      return scriptServer.hostname;
    },
    getHackingLevel: function (): any {
      updateDynamicRam("getHackingLevel", getRamCost("getHackingLevel"));
      Player.updateSkillLevels();
      workerScript.log("getHackingLevel", `returned ${Player.hacking_skill}`);
      return Player.hacking_skill;
    },
    getHackingMultipliers: function (): any {
      updateDynamicRam("getHackingMultipliers", getRamCost("getHackingMultipliers"));
      return {
        chance: Player.hacking_chance_mult,
        speed: Player.hacking_speed_mult,
        money: Player.hacking_money_mult,
        growth: Player.hacking_grow_mult,
      };
    },
    getHacknetMultipliers: function (): any {
      updateDynamicRam("getHacknetMultipliers", getRamCost("getHacknetMultipliers"));
      return {
        production: Player.hacknet_node_money_mult,
        purchaseCost: Player.hacknet_node_purchase_cost_mult,
        ramCost: Player.hacknet_node_ram_cost_mult,
        coreCost: Player.hacknet_node_core_cost_mult,
        levelCost: Player.hacknet_node_level_cost_mult,
      };
    },
    getBitNodeMultipliers: function (): any {
      updateDynamicRam("getBitNodeMultipliers", getRamCost("getBitNodeMultipliers"));
      if (SourceFileFlags[5] <= 0 && Player.bitNodeN !== 5) {
        throw makeRuntimeErrorMsg("getBitNodeMultipliers", "Requires Source-File 5 to run.");
      }
      const copy = Object.assign({}, BitNodeMultipliers);
      return copy;
    },
    getServer: function (hostname: any = workerScript.hostname): any {
      updateDynamicRam("getServer", getRamCost("getServer"));
      const server = safeGetServer(hostname, "getServer");
      const copy = Object.assign({}, server);
      // These fields should be hidden.
      copy.contracts = [];
      copy.messages = [];
      copy.runningScripts = [];
      copy.scripts = [];
      copy.textFiles = [];
      copy.programs = [];
      copy.serversOnNetwork = [];
      return copy;
    },
    getServerMoneyAvailable: function (hostname: any): any {
      updateDynamicRam("getServerMoneyAvailable", getRamCost("getServerMoneyAvailable"));
      const server = safeGetServer(hostname, "getServerMoneyAvailable");
      if (!(server instanceof Server)) {
        workerScript.log("getServerMoneyAvailable", "Cannot be executed on this server.");
        return 0;
      }
      if (failOnHacknetServer(server, "getServerMoneyAvailable")) {
        return 0;
      }
      if (server.hostname == "home") {
        // Return player's money
        workerScript.log(
          "getServerMoneyAvailable",
          `returned player's money: ${numeralWrapper.formatMoney(Player.money.toNumber())}`,
        );
        return Player.money.toNumber();
      }
      workerScript.log(
        "getServerMoneyAvailable",
        `returned ${numeralWrapper.formatMoney(server.moneyAvailable)} for '${server.hostname}'`,
      );
      return server.moneyAvailable;
    },
    getServerSecurityLevel: function (hostname: any): any {
      updateDynamicRam("getServerSecurityLevel", getRamCost("getServerSecurityLevel"));
      const server = safeGetServer(hostname, "getServerSecurityLevel");
      if (!(server instanceof Server)) {
        workerScript.log("getServerSecurityLevel", "Cannot be executed on this server.");
        return 1;
      }
      if (failOnHacknetServer(server, "getServerSecurityLevel")) {
        return 1;
      }
      workerScript.log(
        "getServerSecurityLevel",
        `returned ${numeralWrapper.formatServerSecurity(server.hackDifficulty)} for '${server.hostname}'`,
      );
      return server.hackDifficulty;
    },
    getServerBaseSecurityLevel: function (hostname: any): any {
      updateDynamicRam("getServerBaseSecurityLevel", getRamCost("getServerBaseSecurityLevel"));
      workerScript.log(
        "getServerBaseSecurityLevel",
        `getServerBaseSecurityLevel is deprecated because it's not useful.`,
      );
      const server = safeGetServer(hostname, "getServerBaseSecurityLevel");
      if (!(server instanceof Server)) {
        workerScript.log("getServerBaseSecurityLevel", "Cannot be executed on this server.");
        return 1;
      }
      if (failOnHacknetServer(server, "getServerBaseSecurityLevel")) {
        return 1;
      }
      workerScript.log(
        "getServerBaseSecurityLevel",
        `returned ${numeralWrapper.formatServerSecurity(server.baseDifficulty)} for '${server.hostname}'`,
      );
      return server.baseDifficulty;
    },
    getServerMinSecurityLevel: function (hostname: any): any {
      updateDynamicRam("getServerMinSecurityLevel", getRamCost("getServerMinSecurityLevel"));
      const server = safeGetServer(hostname, "getServerMinSecurityLevel");
      if (!(server instanceof Server)) {
        workerScript.log("getServerMinSecurityLevel", "Cannot be executed on this server.");
        return 1;
      }
      if (failOnHacknetServer(server, "getServerMinSecurityLevel")) {
        return 1;
      }
      workerScript.log(
        "getServerMinSecurityLevel",
        `returned ${numeralWrapper.formatServerSecurity(server.minDifficulty)} for ${server.hostname}`,
      );
      return server.minDifficulty;
    },
    getServerRequiredHackingLevel: function (hostname: any): any {
      updateDynamicRam("getServerRequiredHackingLevel", getRamCost("getServerRequiredHackingLevel"));
      const server = safeGetServer(hostname, "getServerRequiredHackingLevel");
      if (!(server instanceof Server)) {
        workerScript.log("getServerRequiredHackingLevel", "Cannot be executed on this server.");
        return 1;
      }
      if (failOnHacknetServer(server, "getServerRequiredHackingLevel")) {
        return 1;
      }
      workerScript.log(
        "getServerRequiredHackingLevel",
        `returned ${numeralWrapper.formatSkill(server.requiredHackingSkill)} for '${server.hostname}'`,
      );
      return server.requiredHackingSkill;
    },
    getServerMaxMoney: function (hostname: any): any {
      updateDynamicRam("getServerMaxMoney", getRamCost("getServerMaxMoney"));
      const server = safeGetServer(hostname, "getServerMaxMoney");
      if (!(server instanceof Server)) {
        workerScript.log("getServerMaxMoney", "Cannot be executed on this server.");
        return 0;
      }
      if (failOnHacknetServer(server, "getServerMaxMoney")) {
        return 0;
      }
      workerScript.log(
        "getServerMaxMoney",
        `returned ${numeralWrapper.formatMoney(server.moneyMax)} for '${server.hostname}'`,
      );
      return server.moneyMax;
    },
    getServerGrowth: function (hostname: any): any {
      updateDynamicRam("getServerGrowth", getRamCost("getServerGrowth"));
      const server = safeGetServer(hostname, "getServerGrowth");
      if (!(server instanceof Server)) {
        workerScript.log("getServerGrowth", "Cannot be executed on this server.");
        return 1;
      }
      if (failOnHacknetServer(server, "getServerGrowth")) {
        return 1;
      }
      workerScript.log("getServerGrowth", `returned ${server.serverGrowth} for '${server.hostname}'`);
      return server.serverGrowth;
    },
    getServerNumPortsRequired: function (hostname: any): any {
      updateDynamicRam("getServerNumPortsRequired", getRamCost("getServerNumPortsRequired"));
      const server = safeGetServer(hostname, "getServerNumPortsRequired");
      if (!(server instanceof Server)) {
        workerScript.log("getServerNumPortsRequired", "Cannot be executed on this server.");
        return 5;
      }
      if (failOnHacknetServer(server, "getServerNumPortsRequired")) {
        return 5;
      }
      workerScript.log("getServerNumPortsRequired", `returned ${server.numOpenPortsRequired} for '${server.hostname}'`);
      return server.numOpenPortsRequired;
    },
    getServerRam: function (hostname: any): any {
      updateDynamicRam("getServerRam", getRamCost("getServerRam"));
      workerScript.log("getServerRam", `getServerRam is deprecated in favor of getServerMaxRam / getServerUsedRam`);
      const server = safeGetServer(hostname, "getServerRam");
      workerScript.log(
        "getServerRam",
        `returned [${numeralWrapper.formatRAM(server.maxRam)}, ${numeralWrapper.formatRAM(server.ramUsed)}]`,
      );
      return [server.maxRam, server.ramUsed];
    },
    getServerMaxRam: function (hostname: any): any {
      updateDynamicRam("getServerMaxRam", getRamCost("getServerMaxRam"));
      const server = safeGetServer(hostname, "getServerMaxRam");
      workerScript.log("getServerMaxRam", `returned ${numeralWrapper.formatRAM(server.maxRam)}`);
      return server.maxRam;
    },
    getServerUsedRam: function (hostname: any): any {
      updateDynamicRam("getServerUsedRam", getRamCost("getServerUsedRam"));
      const server = safeGetServer(hostname, "getServerUsedRam");
      workerScript.log("getServerUsedRam", `returned ${numeralWrapper.formatRAM(server.ramUsed)}`);
      return server.ramUsed;
    },
    serverExists: function (hostname: any): any {
      updateDynamicRam("serverExists", getRamCost("serverExists"));
      return GetServer(hostname) !== null;
    },
    fileExists: function (filename: any, hostname: any = workerScript.hostname): any {
      updateDynamicRam("fileExists", getRamCost("fileExists"));
      if (filename === undefined) {
        throw makeRuntimeErrorMsg("fileExists", "Usage: fileExists(scriptname, [server])");
      }
      const server = safeGetServer(hostname, "fileExists");
      for (let i = 0; i < server.scripts.length; ++i) {
        if (filename == server.scripts[i].filename) {
          return true;
        }
      }
      for (let i = 0; i < server.programs.length; ++i) {
        if (filename.toLowerCase() == server.programs[i].toLowerCase()) {
          return true;
        }
      }
      for (let i = 0; i < server.messages.length; ++i) {
        if (filename.toLowerCase() === server.messages[i]) {
          return true;
        }
      }
      const txtFile = getTextFile(filename, server);
      if (txtFile != null) {
        return true;
      }
      return false;
    },
    isRunning: function (fn: any, hostname: any = workerScript.hostname, ...scriptArgs: any): any {
      updateDynamicRam("isRunning", getRamCost("isRunning"));
      if (fn === undefined || hostname === undefined) {
        throw makeRuntimeErrorMsg("isRunning", "Usage: isRunning(scriptname, server, [arg1], [arg2]...)");
      }
      if (typeof fn === "number") {
        return getRunningScriptByPid(fn, "isRunning") != null;
      } else {
        return getRunningScript(fn, hostname, "isRunning", scriptArgs) != null;
      }
    },
    getPurchasedServerLimit: function (): any {
      updateDynamicRam("getPurchasedServerLimit", getRamCost("getPurchasedServerLimit"));

      return getPurchaseServerLimit();
    },
    getPurchasedServerMaxRam: function (): any {
      updateDynamicRam("getPurchasedServerMaxRam", getRamCost("getPurchasedServerMaxRam"));

      return getPurchaseServerMaxRam();
    },
    getPurchasedServerCost: function (ram: any): any {
      updateDynamicRam("getPurchasedServerCost", getRamCost("getPurchasedServerCost"));

      const cost = getPurchaseServerCost(ram);
      if (cost === Infinity) {
        workerScript.log("getPurchasedServerCost", `Invalid argument: ram='${ram}'`);
        return Infinity;
      }

      return cost;
    },
    purchaseServer: function (name: any, ram: any): any {
      updateDynamicRam("purchaseServer", getRamCost("purchaseServer"));
      let hostnameStr = String(name);
      hostnameStr = hostnameStr.replace(/\s+/g, "");
      if (hostnameStr == "") {
        workerScript.log("purchaseServer", `Invalid argument: hostname='${hostnameStr}'`);
        return "";
      }

      if (Player.purchasedServers.length >= getPurchaseServerLimit()) {
        workerScript.log(
          "purchaseServer",
          `You have reached the maximum limit of ${getPurchaseServerLimit()} servers. You cannot purchase any more.`,
        );
        return "";
      }

      const cost = getPurchaseServerCost(ram);
      if (cost === Infinity) {
        workerScript.log("purchaseServer", `Invalid argument: ram='${ram}'`);
        return "";
      }

      if (Player.money.lt(cost)) {
        workerScript.log(
          "purchaseServer",
          `Not enough money to purchase server. Need ${numeralWrapper.formatMoney(cost)}`,
        );
        return "";
      }
      const newServ = safetlyCreateUniqueServer({
        ip: createUniqueRandomIp(),
        hostname: hostnameStr,
        organizationName: "",
        isConnectedTo: false,
        adminRights: true,
        purchasedByPlayer: true,
        maxRam: ram,
      });
      AddToAllServers(newServ);

      Player.purchasedServers.push(newServ.hostname);
      const homeComputer = Player.getHomeComputer();
      homeComputer.serversOnNetwork.push(newServ.hostname);
      newServ.serversOnNetwork.push(homeComputer.hostname);
      Player.loseMoney(cost, "servers");
      workerScript.log(
        "purchaseServer",
        `Purchased new server with hostname '${newServ.hostname}' for ${numeralWrapper.formatMoney(cost)}`,
      );
      return newServ.hostname;
    },
    deleteServer: function (name: any): any {
      updateDynamicRam("deleteServer", getRamCost("deleteServer"));
      let hostnameStr = String(name);
      hostnameStr = hostnameStr.replace(/\s\s+/g, "");
      const server = GetServer(hostnameStr);
      if (!(server instanceof Server)) {
        workerScript.log("deleteServer", `Invalid argument: hostname='${hostnameStr}'`);
        return false;
      }

      if (!server.purchasedByPlayer || server.hostname === "home") {
        workerScript.log("deleteServer", "Cannot delete non-purchased server.");
        return false;
      }

      const hostname = server.hostname;

      // Can't delete server you're currently connected to
      if (server.isConnectedTo) {
        workerScript.log("deleteServer", "You are currently connected to the server you are trying to delete.");
        return false;
      }

      // A server cannot delete itself
      if (hostname === workerScript.hostname) {
        workerScript.log("deleteServer", "Cannot delete the server this script is running on.");
        return false;
      }

      // Delete all scripts running on server
      if (server.runningScripts.length > 0) {
        workerScript.log("deleteServer", `Cannot delete server '${hostname}' because it still has scripts running.`);
        return false;
      }

      // Delete from player's purchasedServers array
      let found = false;
      for (let i = 0; i < Player.purchasedServers.length; ++i) {
        if (hostname == Player.purchasedServers[i]) {
          found = true;
          Player.purchasedServers.splice(i, 1);
          break;
        }
      }

      if (!found) {
        workerScript.log(
          "deleteServer",
          `Could not identify server ${hostname} as a purchased server. This is a bug. Report to dev.`,
        );
        return false;
      }

      // Delete from all servers
      DeleteServer(hostname);

      // Delete from home computer
      found = false;
      const homeComputer = Player.getHomeComputer();
      for (let i = 0; i < homeComputer.serversOnNetwork.length; ++i) {
        if (hostname == homeComputer.serversOnNetwork[i]) {
          homeComputer.serversOnNetwork.splice(i, 1);
          workerScript.log("deleteServer", `Deleted server '${hostnameStr}`);
          return true;
        }
      }
      // Wasn't found on home computer
      workerScript.log(
        "deleteServer",
        `Could not find server ${hostname} as a purchased server. This is a bug. Report to dev.`,
      );
      return false;
    },
    getPurchasedServers: function (): any {
      updateDynamicRam("getPurchasedServers", getRamCost("getPurchasedServers"));
      const res: string[] = [];
      Player.purchasedServers.forEach(function (hostname) {
        res.push(hostname);
      });
      return res;
    },
    writePort: function (port: any, data: any = ""): any {
      // Write to port
      // Port 1-10
      port = Math.round(port);
      if (port < 1 || port > CONSTANTS.NumNetscriptPorts) {
        throw makeRuntimeErrorMsg(
          "writePort",
          `Trying to write to invalid port: ${port}. Only ports 1-${CONSTANTS.NumNetscriptPorts} are valid.`,
        );
      }
      const iport = NetscriptPorts[port - 1];
      if (iport == null || !(iport instanceof Object)) {
        throw makeRuntimeErrorMsg("writePort", `Could not find port: ${port}. This is a bug. Report to dev.`);
      }
      return Promise.resolve(iport.write(data));
    },
    write: function (port: any, data: any = "", mode: any = "a"): any {
      updateDynamicRam("write", getRamCost("write"));
      if (isString(port)) {
        // Write to script or text file
        let fn = port;
        if (!isValidFilePath(fn)) {
          throw makeRuntimeErrorMsg("write", `Invalid filepath: ${fn}`);
        }

        if (fn.lastIndexOf("/") === 0) {
          fn = removeLeadingSlash(fn);
        }

        // Coerce 'data' to be a string
        try {
          data = String(data);
        } catch (e: any) {
          throw makeRuntimeErrorMsg("write", `Invalid data (${e}). Data being written must be convertible to a string`);
        }

        const server = workerScript.getServer();
        if (server == null) {
          throw makeRuntimeErrorMsg("write", "Error getting Server. This is a bug. Report to dev.");
        }
        if (isScriptFilename(fn)) {
          // Write to script
          let script = workerScript.getScriptOnServer(fn, server);
          if (script == null) {
            // Create a new script
            script = new Script(fn, data, server.hostname, server.scripts);
            server.scripts.push(script);
            return script.updateRamUsage(server.scripts);
          }
          mode === "w" ? (script.code = data) : (script.code += data);
          return script.updateRamUsage(server.scripts);
        } else {
          // Write to text file
          const txtFile = getTextFile(fn, server);
          if (txtFile == null) {
            createTextFile(fn, data, server);
            return Promise.resolve();
          }
          if (mode === "w") {
            txtFile.write(data);
          } else {
            txtFile.append(data);
          }
        }
        return Promise.resolve();
      } else {
        throw makeRuntimeErrorMsg("write", `Invalid argument: ${port}`);
      }
    },
    tryWrite: function (port: any, data: any = ""): any {
      updateDynamicRam("tryWrite", getRamCost("tryWrite"));
      if (!isNaN(port)) {
        port = Math.round(port);
        if (port < 1 || port > CONSTANTS.NumNetscriptPorts) {
          throw makeRuntimeErrorMsg(
            "tryWrite",
            `Invalid port: ${port}. Only ports 1-${CONSTANTS.NumNetscriptPorts} are valid.`,
          );
        }
        const iport = NetscriptPorts[port - 1];
        if (iport == null || !(iport instanceof Object)) {
          throw makeRuntimeErrorMsg("tryWrite", `Could not find port: ${port}. This is a bug. Report to dev.`);
        }
        return Promise.resolve(iport.tryWrite(data));
      } else {
        throw makeRuntimeErrorMsg("tryWrite", `Invalid argument: ${port}`);
      }
    },
    readPort: function (port: any): any {
      // Read from port
      // Port 1-10
      port = Math.round(port);
      if (port < 1 || port > CONSTANTS.NumNetscriptPorts) {
        throw makeRuntimeErrorMsg(
          "readPort",
          `Invalid port: ${port}. Only ports 1-${CONSTANTS.NumNetscriptPorts} are valid.`,
        );
      }
      const iport = NetscriptPorts[port - 1];
      if (iport == null || !(iport instanceof Object)) {
        throw makeRuntimeErrorMsg("readPort", `Could not find port: ${port}. This is a bug. Report to dev.`);
      }
      const x = iport.read();
      return x;
    },
    read: function (port: any): any {
      updateDynamicRam("read", getRamCost("read"));
      if (isString(port)) {
        // Read from script or text file
        const fn = port;
        const server = GetServer(workerScript.hostname);
        if (server == null) {
          throw makeRuntimeErrorMsg("read", "Error getting Server. This is a bug. Report to dev.");
        }
        if (isScriptFilename(fn)) {
          // Read from script
          const script = workerScript.getScriptOnServer(fn, server);
          if (script == null) {
            return "";
          }
          return script.code;
        } else {
          // Read from text file
          const txtFile = getTextFile(fn, server);
          if (txtFile !== null) {
            return txtFile.text;
          } else {
            return "";
          }
        }
      } else {
        throw makeRuntimeErrorMsg("read", `Invalid argument: ${port}`);
      }
    },
    peek: function (port: any): any {
      updateDynamicRam("peek", getRamCost("peek"));
      if (isNaN(port)) {
        throw makeRuntimeErrorMsg(
          "peek",
          `Invalid argument. Must be a port number between 1 and ${CONSTANTS.NumNetscriptPorts}, is ${port}`,
        );
      }
      port = Math.round(port);
      if (port < 1 || port > CONSTANTS.NumNetscriptPorts) {
        throw makeRuntimeErrorMsg(
          "peek",
          `Invalid argument. Must be a port number between 1 and ${CONSTANTS.NumNetscriptPorts}, is ${port}`,
        );
      }
      const iport = NetscriptPorts[port - 1];
      if (iport == null || !(iport instanceof Object)) {
        throw makeRuntimeErrorMsg("peek", `Could not find port: ${port}. This is a bug. Report to dev.`);
      }
      const x = iport.peek();
      return x;
    },
    clear: function (file: any): any {
      updateDynamicRam("clear", getRamCost("clear"));
      if (isString(file)) {
        // Clear text file
        const fn = file;
        const server = GetServer(workerScript.hostname);
        if (server == null) {
          throw makeRuntimeErrorMsg("clear", "Error getting Server. This is a bug. Report to dev.");
        }
        const txtFile = getTextFile(fn, server);
        if (txtFile != null) {
          txtFile.write("");
        }
      } else {
        throw makeRuntimeErrorMsg("clear", `Invalid argument: ${file}`);
      }
      return 0;
    },
    clearPort: function (port: any): any {
      // Clear port
      port = Math.round(port);
      if (port < 1 || port > CONSTANTS.NumNetscriptPorts) {
        throw makeRuntimeErrorMsg(
          "clear",
          `Trying to clear invalid port: ${port}. Only ports 1-${CONSTANTS.NumNetscriptPorts} are valid`,
        );
      }
      const iport = NetscriptPorts[port - 1];
      if (iport == null || !(iport instanceof Object)) {
        throw makeRuntimeErrorMsg("clear", `Could not find port: ${port}. This is a bug. Report to dev.`);
      }
      return iport.clear();
    },
    getPortHandle: function (port: any): any {
      updateDynamicRam("getPortHandle", getRamCost("getPortHandle"));
      if (isNaN(port)) {
        throw makeRuntimeErrorMsg(
          "getPortHandle",
          `Invalid port: ${port} Must be an integer between 1 and ${CONSTANTS.NumNetscriptPorts}.`,
        );
      }
      port = Math.round(port);
      if (port < 1 || port > CONSTANTS.NumNetscriptPorts) {
        throw makeRuntimeErrorMsg(
          "getPortHandle",
          `Invalid port: ${port}. Only ports 1-${CONSTANTS.NumNetscriptPorts} are valid.`,
        );
      }
      const iport = NetscriptPorts[port - 1];
      if (iport == null || !(iport instanceof Object)) {
        throw makeRuntimeErrorMsg("getPortHandle", `Could not find port: ${port}. This is a bug. Report to dev.`);
      }
      return iport;
    },
    rm: function (fn: any, hostname: any): any {
      updateDynamicRam("rm", getRamCost("rm"));

      if (hostname == null || hostname === "") {
        hostname = workerScript.hostname;
      }
      const s = safeGetServer(hostname, "rm");

      const status = s.removeFile(fn);
      if (!status.res) {
        workerScript.log("rm", status.msg + "");
      }

      return status.res;
    },
    scriptRunning: function (scriptname: any, hostname: any): any {
      updateDynamicRam("scriptRunning", getRamCost("scriptRunning"));
      const server = safeGetServer(hostname, "scriptRunning");
      for (let i = 0; i < server.runningScripts.length; ++i) {
        if (server.runningScripts[i].filename == scriptname) {
          return true;
        }
      }
      return false;
    },
    scriptKill: function (scriptname: any, hostname: any): any {
      updateDynamicRam("scriptKill", getRamCost("scriptKill"));
      const server = safeGetServer(hostname, "scriptKill");
      let suc = false;
      for (let i = 0; i < server.runningScripts.length; i++) {
        if (server.runningScripts[i].filename == scriptname) {
          killWorkerScript(server.runningScripts[i], server.hostname);
          suc = true;
          i--;
        }
      }
      return suc;
    },
    getScriptName: function (): any {
      return workerScript.name;
    },
    getScriptRam: function (scriptname: any, hostname: any = workerScript.hostname): any {
      updateDynamicRam("getScriptRam", getRamCost("getScriptRam"));
      const server = safeGetServer(hostname, "getScriptRam");
      for (let i = 0; i < server.scripts.length; ++i) {
        if (server.scripts[i].filename == scriptname) {
          return server.scripts[i].ramUsage;
        }
      }
      return 0;
    },
    getRunningScript: function (fn: any, hostname: any, ...args: any[]): any {
      updateDynamicRam("getRunningScript", getRamCost("getRunningScript"));

      let runningScript;
      if (args.length === 0) {
        runningScript = workerScript.scriptRef;
      } else if (typeof fn === "number") {
        runningScript = getRunningScriptByPid(fn, "getRunningScript");
      } else {
        const scriptArgs = [];
        for (let i = 2; i < args.length; ++i) {
          scriptArgs.push(args[i]);
        }
        runningScript = getRunningScript(fn, hostname, "getRunningScript", scriptArgs);
      }
      if (runningScript === null) return null;
      return {
        args: runningScript.args.slice(),
        filename: runningScript.filename,
        logs: runningScript.logs.slice(),
        offlineExpGained: runningScript.offlineExpGained,
        offlineMoneyMade: runningScript.offlineMoneyMade,
        offlineRunningTime: runningScript.offlineRunningTime,
        onlineExpGained: runningScript.onlineExpGained,
        onlineMoneyMade: runningScript.onlineMoneyMade,
        onlineRunningTime: runningScript.onlineRunningTime,
        pid: runningScript.pid,
        ramUsage: runningScript.ramUsage,
        server: runningScript.server,
        threads: runningScript.threads,
      };
    },
    getHackTime: function (hostname: any): any {
      updateDynamicRam("getHackTime", getRamCost("getHackTime"));
      const server = safeGetServer(hostname, "getHackTime");
      if (!(server instanceof Server)) {
        workerScript.log("getHackTime", "invalid for this kind of server");
        return Infinity;
      }
      if (failOnHacknetServer(server, "getHackTime")) {
        return Infinity;
      }

      return calculateHackingTime(server, Player) * 1000;
    },
    getGrowTime: function (hostname: any): any {
      updateDynamicRam("getGrowTime", getRamCost("getGrowTime"));
      const server = safeGetServer(hostname, "getGrowTime");
      if (!(server instanceof Server)) {
        workerScript.log("getGrowTime", "invalid for this kind of server");
        return Infinity;
      }
      if (failOnHacknetServer(server, "getGrowTime")) {
        return Infinity;
      }

      return calculateGrowTime(server, Player) * 1000;
    },
    getWeakenTime: function (hostname: any): any {
      updateDynamicRam("getWeakenTime", getRamCost("getWeakenTime"));
      const server = safeGetServer(hostname, "getWeakenTime");
      if (!(server instanceof Server)) {
        workerScript.log("getWeakenTime", "invalid for this kind of server");
        return Infinity;
      }
      if (failOnHacknetServer(server, "getWeakenTime")) {
        return Infinity;
      }

      return calculateWeakenTime(server, Player) * 1000;
    },
    getScriptIncome: function (scriptname: any, hostname: any, ...args: any[]): any {
      updateDynamicRam("getScriptIncome", getRamCost("getScriptIncome"));
      if (arguments.length === 0) {
        const res = [];

        // First element is total income of all currently running scripts
        let total = 0;
        for (const script of workerScripts.values()) {
          total += script.scriptRef.onlineMoneyMade / script.scriptRef.onlineRunningTime;
        }
        res.push(total);

        // Second element is total income you've earned from scripts since you installed Augs
        res.push(Player.scriptProdSinceLastAug / (Player.playtimeSinceLastAug / 1000));
        return res;
      } else {
        // Get income for a particular script
        const server = safeGetServer(hostname, "getScriptIncome");
        const runningScriptObj = findRunningScript(scriptname, args, server);
        if (runningScriptObj == null) {
          workerScript.log(
            "getScriptIncome",
            `No such script '${scriptname}' on '${server.hostname}' with args: ${arrayToString(args)}`,
          );
          return -1;
        }
        return runningScriptObj.onlineMoneyMade / runningScriptObj.onlineRunningTime;
      }
    },
    getScriptExpGain: function (scriptname: any, hostname: any, ...args: any[]): any {
      updateDynamicRam("getScriptExpGain", getRamCost("getScriptExpGain"));
      if (arguments.length === 0) {
        let total = 0;
        for (const ws of workerScripts.values()) {
          total += ws.scriptRef.onlineExpGained / ws.scriptRef.onlineRunningTime;
        }
        return total;
      } else {
        // Get income for a particular script
        const server = safeGetServer(hostname, "getScriptExpGain");
        const runningScriptObj = findRunningScript(scriptname, args, server);
        if (runningScriptObj == null) {
          workerScript.log(
            "getScriptExpGain",
            `No such script '${scriptname}' on '${server.hostname}' with args: ${arrayToString(args)}`,
          );
          return -1;
        }
        return runningScriptObj.onlineExpGained / runningScriptObj.onlineRunningTime;
      }
    },
    nFormat: function (n: any, format: any): any {
      if (isNaN(n) || isNaN(parseFloat(n)) || typeof format !== "string") {
        return "";
      }

      return numeralWrapper.format(parseFloat(n), format);
    },
    tFormat: function (milliseconds: any, milliPrecision: any = false): any {
      return convertTimeMsToTimeElapsedString(milliseconds, milliPrecision);
    },
    getTimeSinceLastAug: function (): any {
      updateDynamicRam("getTimeSinceLastAug", getRamCost("getTimeSinceLastAug"));
      return Player.playtimeSinceLastAug;
    },
    alert: function (message: any): void {
      dialogBoxCreate(message);
    },
    toast: function (message: any, variant: any = "success"): void {
      if (!["success", "info", "warning", "error"].includes(variant))
        throw new Error(`variant must be one of "success", "info", "warning", or "error"`);
      SnackbarEvents.emit(message, variant);
    },
    prompt: function (txt: any): any {
      if (!isString(txt)) {
        txt = JSON.stringify(txt);
      }

      return new Promise(function (resolve) {
        PromptEvent.emit({
          txt: txt,
          resolve: resolve,
        });
      });
    },
    wget: async function (url: any, target: any, hostname: any = workerScript.hostname): Promise<boolean> {
      if (!isScriptFilename(target) && !target.endsWith(".txt")) {
        workerScript.log("wget", `Invalid target file: '${target}'. Must be a script or text file.`);
        return Promise.resolve(false);
      }
      const s = safeGetServer(hostname, "wget");
      return new Promise(function (resolve) {
        $.get(
          url,
          function (data) {
            let res;
            if (isScriptFilename(target)) {
              res = s.writeToScriptFile(target, data);
            } else {
              res = s.writeToTextFile(target, data);
            }
            if (!res.success) {
              workerScript.log("wget", "Failed.");
              return resolve(false);
            }
            if (res.overwritten) {
              workerScript.log("wget", `Successfully retrieved content and overwrote '${target}' on '${hostname}'`);
              return resolve(true);
            }
            workerScript.log("wget", `Successfully retrieved content to new file '${target}' on '${hostname}'`);
            return resolve(true);
          },
          "text",
        ).fail(function (e) {
          workerScript.log("wget", JSON.stringify(e));
          return resolve(false);
        });
      });
    },
    getFavorToDonate: function (): any {
      updateDynamicRam("getFavorToDonate", getRamCost("getFavorToDonate"));
      return Math.floor(CONSTANTS.BaseFavorToDonate * BitNodeMultipliers.RepToDonateToFaction);
    },

    getPlayer: function (): any {
      helper.updateDynamicRam("getPlayer", getRamCost("getPlayer"));

      const data = {
        hacking_skill: Player.hacking_skill,
        hp: Player.hp,
        max_hp: Player.max_hp,
        strength: Player.strength,
        defense: Player.defense,
        dexterity: Player.dexterity,
        agility: Player.agility,
        charisma: Player.charisma,
        intelligence: Player.intelligence,
        hacking_chance_mult: Player.hacking_chance_mult,
        hacking_speed_mult: Player.hacking_speed_mult,
        hacking_money_mult: Player.hacking_money_mult,
        hacking_grow_mult: Player.hacking_grow_mult,
        hacking_exp: Player.hacking_exp,
        strength_exp: Player.strength_exp,
        defense_exp: Player.defense_exp,
        dexterity_exp: Player.dexterity_exp,
        agility_exp: Player.agility_exp,
        charisma_exp: Player.charisma_exp,
        hacking_mult: Player.hacking_mult,
        strength_mult: Player.strength_mult,
        defense_mult: Player.defense_mult,
        dexterity_mult: Player.dexterity_mult,
        agility_mult: Player.agility_mult,
        charisma_mult: Player.charisma_mult,
        hacking_exp_mult: Player.hacking_exp_mult,
        strength_exp_mult: Player.strength_exp_mult,
        defense_exp_mult: Player.defense_exp_mult,
        dexterity_exp_mult: Player.dexterity_exp_mult,
        agility_exp_mult: Player.agility_exp_mult,
        charisma_exp_mult: Player.charisma_exp_mult,
        company_rep_mult: Player.company_rep_mult,
        faction_rep_mult: Player.faction_rep_mult,
        numPeopleKilled: Player.numPeopleKilled,
        money: Player.money.toNumber(),
        city: Player.city,
        location: Player.location,
        companyName: Player.companyName,
        crime_money_mult: Player.crime_money_mult,
        crime_success_mult: Player.crime_success_mult,
        isWorking: Player.isWorking,
        workType: Player.workType,
        currentWorkFactionName: Player.currentWorkFactionName,
        currentWorkFactionDescription: Player.currentWorkFactionDescription,
        workHackExpGainRate: Player.workHackExpGainRate,
        workStrExpGainRate: Player.workStrExpGainRate,
        workDefExpGainRate: Player.workDefExpGainRate,
        workDexExpGainRate: Player.workDexExpGainRate,
        workAgiExpGainRate: Player.workAgiExpGainRate,
        workChaExpGainRate: Player.workChaExpGainRate,
        workRepGainRate: Player.workRepGainRate,
        workMoneyGainRate: Player.workMoneyGainRate,
        workMoneyLossRate: Player.workMoneyLossRate,
        workHackExpGained: Player.workHackExpGained,
        workStrExpGained: Player.workStrExpGained,
        workDefExpGained: Player.workDefExpGained,
        workDexExpGained: Player.workDexExpGained,
        workAgiExpGained: Player.workAgiExpGained,
        workChaExpGained: Player.workChaExpGained,
        workRepGained: Player.workRepGained,
        workMoneyGained: Player.workMoneyGained,
        createProgramName: Player.createProgramName,
        createProgramReqLvl: Player.createProgramReqLvl,
        className: Player.className,
        crimeType: Player.crimeType,
        work_money_mult: Player.work_money_mult,
        hacknet_node_money_mult: Player.hacknet_node_money_mult,
        hacknet_node_purchase_cost_mult: Player.hacknet_node_purchase_cost_mult,
        hacknet_node_ram_cost_mult: Player.hacknet_node_ram_cost_mult,
        hacknet_node_core_cost_mult: Player.hacknet_node_core_cost_mult,
        hacknet_node_level_cost_mult: Player.hacknet_node_level_cost_mult,
        hasWseAccount: Player.hasWseAccount,
        hasTixApiAccess: Player.hasTixApiAccess,
        has4SData: Player.has4SData,
        has4SDataTixApi: Player.has4SDataTixApi,
        bladeburner_max_stamina_mult: Player.bladeburner_max_stamina_mult,
        bladeburner_stamina_gain_mult: Player.bladeburner_stamina_gain_mult,
        bladeburner_analysis_mult: Player.bladeburner_analysis_mult,
        bladeburner_success_chance_mult: Player.bladeburner_success_chance_mult,
        bitNodeN: Player.bitNodeN,
        totalPlaytime: Player.totalPlaytime,
        playtimeSinceLastAug: Player.playtimeSinceLastAug,
        playtimeSinceLastBitnode: Player.playtimeSinceLastBitnode,
        jobs: {},
        factions: Player.factions.slice(),
        tor: Player.hasTorRouter(),
      };
      Object.assign(data.jobs, Player.jobs);
      return data;
    },

    atExit: function (f: any): void {
      if (typeof f !== "function") {
        throw makeRuntimeErrorMsg("atExit", "argument should be function");
      }
      workerScript.atExit = f;
    },
    flags: Flags(workerScript.args),
  };

  // add undocumented functions
  const ns = {
    ...base,
    corporation: corporation,
    ...extra,
  };
  function getFunctionNames(obj: NS, prefix: string): string[] {
    const functionNames: string[] = [];
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value == "function") {
        functionNames.push(prefix + key);
      } else if (typeof value == "object") {
        functionNames.push(...getFunctionNames(value, key + "."));
      }
    }
    return functionNames;
  }

  const possibleLogs = Object.fromEntries([...getFunctionNames(ns, "")].map((a) => [a, true]));

  return ns;
}
