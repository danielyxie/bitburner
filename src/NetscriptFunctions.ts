import $ from "jquery";
import { sprintf, vsprintf } from "sprintf-js";
import { BitNodeMultipliers } from "./BitNode/BitNodeMultipliers";
import { CONSTANTS } from "./Constants";
import {
  calculateGrowTime,
  calculateHackingChance,
  calculateHackingExpGain,
  calculateHackingTime,
  calculatePercentMoneyHacked,
  calculateWeakenTime,
} from "./Hacking";
import { netscriptCanGrow, netscriptCanHack, netscriptCanWeaken } from "./Hacking/netscriptCanHack";
import { HacknetServer } from "./Hacknet/HacknetServer";
import { CityName } from "./Locations/data/CityNames";
import { wrapAPI } from "./Netscript/APIWrapper";
import { killWorkerScript } from "./Netscript/killWorkerScript";
import { getRamCost } from "./Netscript/RamCostGenerator";
import { recentScripts } from "./Netscript/RecentScripts";
import { WorkerScript } from "./Netscript/WorkerScript";
import { workerScripts } from "./Netscript/WorkerScripts";
import { WorkerScriptStartStopEventEmitter } from "./Netscript/WorkerScriptStartStopEventEmitter";
import { makeRuntimeRejectMsg, netscriptDelay, resolveNetscriptRequestedThreads } from "./NetscriptEvaluator";
import { NetscriptBladeburner } from "./NetscriptFunctions/Bladeburner";
import { NetscriptCodingContract } from "./NetscriptFunctions/CodingContract";
import { NetscriptCorporation } from "./NetscriptFunctions/Corporation";
import { NetscriptExtra } from "./NetscriptFunctions/Extra";
import { Flags } from "./NetscriptFunctions/Flags";
import { NetscriptFormulas } from "./NetscriptFunctions/Formulas";
import { NetscriptGang } from "./NetscriptFunctions/Gang";
import { NetscriptGrafting } from "./NetscriptFunctions/Grafting";
import { NetscriptHacknet } from "./NetscriptFunctions/Hacknet";
import { NetscriptInfiltration } from "./NetscriptFunctions/Infiltration";
import { NetscriptSingularity } from "./NetscriptFunctions/Singularity";
import { NetscriptSleeve } from "./NetscriptFunctions/Sleeve";
import { NetscriptStanek } from "./NetscriptFunctions/Stanek";
import { NetscriptStockMarket } from "./NetscriptFunctions/StockMarket";
import { toNative } from "./NetscriptFunctions/toNative";
import { NetscriptUserInterface } from "./NetscriptFunctions/UserInterface";
import { IPort } from "./NetscriptPort";
import { NetscriptPorts, runScriptFromScript } from "./NetscriptWorker";
import { CalculateShareMult, StartSharing } from "./NetworkShare/Share";
import { calculateIntelligenceBonus } from "./PersonObjects/formulas/intelligence";
import { Player } from "./Player";
import { Programs } from "./Programs/Programs";
import { isScriptFilename } from "./Script/isScriptFilename";
import { RunningScript } from "./Script/RunningScript";
import { Script } from "./Script/Script";
import { findRunningScript, findRunningScriptByPid } from "./Script/ScriptHelpers";
import {
  BasicHGWOptions,
  BitNodeMultipliers as IBNMults,
  Bladeburner as IBladeburner,
  Gang as IGang,
  HackingMultipliers,
  HacknetMultipliers,
  Infiltration as IInfiltration,
  NS as INS,
  Player as INetscriptPlayer,
  ProcessInfo,
  RecentScript as IRecentScript,
  RunningScript as IRunningScript,
  RunningScript as IRunningScriptDef,
  Server as IServerDef,
  Singularity as ISingularity,
  SourceFileLvl,
  Stanek as IStanek,
} from "./ScriptEditor/NetscriptDefinitions";
import { AddToAllServers, createUniqueRandomIp, DeleteServer, GetAllServers, GetServer } from "./Server/AllServers";
import { BaseServer } from "./Server/BaseServer";
import { Server } from "./Server/Server";
import {
  getServerOnNetwork,
  numCycleForGrowth,
  numCycleForGrowthCorrected,
  processSingleServerGrowth,
  safetlyCreateUniqueServer,
} from "./Server/ServerHelpers";
import { getPurchaseServerCost, getPurchaseServerLimit, getPurchaseServerMaxRam } from "./Server/ServerPurchases";
import { influenceStockThroughServerGrow, influenceStockThroughServerHack } from "./StockMarket/PlayerInfluencing";
import { Terminal } from "./Terminal";
import { isValidFilePath, removeLeadingSlash } from "./Terminal/DirectoryHelpers";
import { createTextFile, getTextFile, TextFile } from "./TextFile";
import { numeralWrapper } from "./ui/numeralFormat";
import { dialogBoxCreate } from "./ui/React/DialogBox";
import { LogBoxCloserEvents, LogBoxEvents } from "./ui/React/LogBoxManager";
import { PromptEvent } from "./ui/React/PromptManager";
import { SnackbarEvents, ToastVariant } from "./ui/React/Snackbar";
import { arrayToString } from "./utils/helpers/arrayToString";
import { checkEnum } from "./utils/helpers/checkEnum";
import { isString } from "./utils/helpers/isString";
import { convertTimeMsToTimeElapsedString } from "./utils/StringHelperFunctions";

interface NS extends INS {
  [key: string]: any;
  gang: IGang;
  bladeburner: IBladeburner;
  stanek: IStanek;
  infiltration: IInfiltration;
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
      throw makeRuntimeErrorMsg(callingFnName, `Invalid hostname: ${hostname}`);
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
    fn: string,
    hostname: string,
    callingFnName: string,
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

  const getRunningScriptByPid = function (pid: number, callingFnName: string): RunningScript | null {
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
   * Sanitizes a `RunningScript` to remove sensitive information, making it suitable for
   * return through an NS function.
   * @see NS.getRecentScripts
   * @see NS.getRunningScript
   * @param runningScript Existing, internal RunningScript
   * @returns A sanitized, NS-facing copy of the RunningScript
   */
  const createPublicRunningScript = function (runningScript: RunningScript): IRunningScript {
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
  };

  /**
   * Helper function for getting the error log message when the user specifies
   * a nonexistent running script
   * @param {string} fn - Filename of script
   * @param {string} hostname - Hostname/ip of the server on which the script resides
   * @param {any[]} scriptArgs - Running script's arguments
   * @returns {string} Error message to print to logs
   */
  const getCannotFindRunningScriptErrorMessage = function (fn: string, hostname: string, scriptArgs: any): string {
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
  const failOnHacknetServer = function (server: BaseServer, callingFn = ""): boolean {
    if (server instanceof HacknetServer) {
      workerScript.log(callingFn, () => `Does not work on Hacknet Servers`);
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

    workerScript.log(caller, () => msg);
    let rejectMsg = `${caller}: ${msg}`;
    if (userstack.length !== 0) rejectMsg += `<br><br>Stack:<br>${userstack.join("<br>")}`;
    return makeRuntimeRejectMsg(workerScript, rejectMsg);
  };

  const checkSingularityAccess = function (func: string): void {
    if (Player.bitNodeN !== 4) {
      if (Player.sourceFileLvl(4) === 0) {
        throw makeRuntimeErrorMsg(
          func,
          `This singularity function requires Source-File 4 to run. A power up you obtain later in the game. It will be very obvious when and how you can obtain it.`,
        );
      }
    }
  };

  const hack = function (
    hostname: string,
    manual: boolean,
    { threads: requestedThreads, stock }: any = {},
  ): Promise<number> {
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
      () =>
        `Executing on '${server.hostname}' in ${convertTimeMsToTimeElapsedString(
          hackingTime * 1000,
          true,
        )} (t=${numeralWrapper.formatThreads(threads)})`,
    );

    return netscriptDelay(hackingTime * 1000, workerScript).then(function () {
      const hackChance = calculateHackingChance(server, Player);
      const rand = Math.random();
      let expGainedOnSuccess = calculateHackingExpGain(server, Player) * threads;
      const expGainedOnFailure = expGainedOnSuccess / 4;
      if (rand < hackChance) {
        // Success!
        const percentHacked = calculatePercentMoneyHacked(server, Player);
        let maxThreadNeeded = Math.ceil(1 / percentHacked);
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
        if (manual) Player.gainIntelligenceExp(0.005);
        workerScript.scriptRef.onlineExpGained += expGainedOnSuccess;
        workerScript.log(
          "hack",
          () =>
            `Successfully hacked '${server.hostname}' for ${numeralWrapper.formatMoney(
              moneyGained,
            )} and ${numeralWrapper.formatExp(expGainedOnSuccess)} exp (t=${numeralWrapper.formatThreads(threads)})`,
        );
        server.fortify(CONSTANTS.ServerFortifyAmount * Math.min(threads, maxThreadNeeded));
        if (stock) {
          influenceStockThroughServerHack(server, moneyDrained);
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
          () =>
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
    string: (funcName: string, argName: string, v: unknown): string => {
      if (typeof v === "string") return v;
      if (typeof v === "number") return v + ""; // cast to string;
      throw makeRuntimeErrorMsg(funcName, `${argName} should be a string.`);
    },
    number: (funcName: string, argName: string, v: unknown): number => {
      if (typeof v === "string") {
        const x = parseFloat(v);
        if (!isNaN(x)) return x; // otherwise it wasn't even a string representing a number.
      } else if (typeof v === "number") {
        if (isNaN(v)) throw makeRuntimeErrorMsg(funcName, `${argName} is NaN.`);
        return v;
      }
      throw makeRuntimeErrorMsg(funcName, `${argName} should be a number.`);
    },
    boolean: (v: unknown): boolean => {
      return !!v; // Just convert it to boolean.
    },
    city: (funcName: string, argName: string, v: unknown): CityName => {
      if (typeof v !== "string") throw makeRuntimeErrorMsg(funcName, `${argName} should be a city name.`);
      const s = v as CityName;
      if (!Object.values(CityName).includes(s))
        throw makeRuntimeErrorMsg(funcName, `${argName} should be a city name.`);
      return s;
    },
    getServer: safeGetServer,
    checkSingularityAccess: checkSingularityAccess,
    hack: hack,
    getValidPort: (funcName: string, port: number): IPort => {
      if (isNaN(port)) {
        throw makeRuntimeErrorMsg(
          funcName,
          `Invalid argument. Must be a port number between 1 and ${CONSTANTS.NumNetscriptPorts}, is ${port}`,
        );
      }
      port = Math.round(port);
      if (port < 1 || port > CONSTANTS.NumNetscriptPorts) {
        throw makeRuntimeErrorMsg(
          funcName,
          `Trying to use an invalid port: ${port}. Only ports 1-${CONSTANTS.NumNetscriptPorts} are valid.`,
        );
      }
      const iport = NetscriptPorts[port - 1];
      if (iport == null || !(iport instanceof Object)) {
        throw makeRuntimeErrorMsg(funcName, `Could not find port: ${port}. This is a bug. Report to dev.`);
      }
      return iport;
    },
  };

  const gang = NetscriptGang(Player, workerScript, helper);
  const sleeve = NetscriptSleeve(Player, workerScript, helper);
  const extra = NetscriptExtra(Player, workerScript, helper);
  const hacknet = NetscriptHacknet(Player, workerScript, helper);
  const infiltration = wrapAPI(helper, {}, workerScript, NetscriptInfiltration(Player), "infiltration")
    .infiltration as unknown as IInfiltration;
  const stanek = wrapAPI(helper, {}, workerScript, NetscriptStanek(Player, workerScript, helper), "stanek")
    .stanek as unknown as IStanek;
  const bladeburner = NetscriptBladeburner(Player, workerScript, helper);
  const codingcontract = NetscriptCodingContract(Player, workerScript, helper);
  const corporation = NetscriptCorporation(Player, workerScript, helper);
  const formulas = NetscriptFormulas(Player, workerScript, helper);
  const singularity = wrapAPI(helper, {}, workerScript, NetscriptSingularity(Player, workerScript), "singularity")
    .singularity as unknown as ISingularity;
  const stockmarket = NetscriptStockMarket(Player, workerScript, helper);
  const ui = NetscriptUserInterface(Player, workerScript, helper);
  const grafting = NetscriptGrafting(Player, workerScript, helper);

  const base: INS = {
    ...singularity,

    singularity: singularity,
    gang: gang,
    bladeburner: bladeburner,
    codingcontract: codingcontract,
    sleeve: sleeve,
    corporation: corporation,
    stanek: stanek,
    infiltration: infiltration,
    ui: ui,
    formulas: formulas,
    stock: stockmarket,
    grafting: grafting,
    args: workerScript.args,
    hacknet: hacknet,
    sprintf: sprintf,
    vsprintf: vsprintf,
    scan: function (_hostname: unknown = workerScript.hostname): string[] {
      updateDynamicRam("scan", getRamCost(Player, "scan"));
      const hostname = helper.string("scan", "hostname", _hostname);
      const server = safeGetServer(hostname, "scan");
      const out = [];
      for (let i = 0; i < server.serversOnNetwork.length; i++) {
        const s = getServerOnNetwork(server, i);
        if (s === null) continue;
        const entry = s.hostname;
        if (entry === null) continue;
        out.push(entry);
      }
      workerScript.log("scan", () => `returned ${server.serversOnNetwork.length} connections for ${server.hostname}`);
      return out;
    },
    hack: function (_hostname: unknown, { threads: requestedThreads, stock }: BasicHGWOptions = {}): Promise<number> {
      updateDynamicRam("hack", getRamCost(Player, "hack"));
      const hostname = helper.string("hack", "hostname", _hostname);
      return hack(hostname, false, { threads: requestedThreads, stock: stock });
    },
    hackAnalyzeThreads: function (_hostname: unknown, _hackAmount: unknown): number {
      updateDynamicRam("hackAnalyzeThreads", getRamCost(Player, "hackAnalyzeThreads"));
      const hostname = helper.string("hackAnalyzeThreads", "hostname", _hostname);
      const hackAmount = helper.number("hackAnalyzeThreads", "hackAmount", _hackAmount);

      // Check argument validity
      const server = safeGetServer(hostname, "hackAnalyzeThreads");
      if (!(server instanceof Server)) {
        workerScript.log("hackAnalyzeThreads", () => "Cannot be executed on this server.");
        return -1;
      }
      if (isNaN(hackAmount)) {
        throw makeRuntimeErrorMsg(
          "hackAnalyzeThreads",
          `Invalid hackAmount argument passed into hackAnalyzeThreads: ${hackAmount}. Must be numeric.`,
        );
      }

      if (hackAmount < 0 || hackAmount > server.moneyAvailable) {
        return -1;
      } else if (hackAmount === 0) {
        return 0;
      }

      const percentHacked = calculatePercentMoneyHacked(server, Player);

      if (percentHacked === 0 || server.moneyAvailable === 0) {
        return 0; // To prevent returning infinity below
      }

      return hackAmount / Math.floor(server.moneyAvailable * percentHacked);
    },
    hackAnalyze: function (_hostname: unknown): number {
      updateDynamicRam("hackAnalyze", getRamCost(Player, "hackAnalyze"));
      const hostname = helper.string("hackAnalyze", "hostname", _hostname);

      const server = safeGetServer(hostname, "hackAnalyze");
      if (!(server instanceof Server)) {
        workerScript.log("hackAnalyze", () => "Cannot be executed on this server.");
        return 0;
      }

      return calculatePercentMoneyHacked(server, Player);
    },
    hackAnalyzeSecurity: function (_threads: unknown, _hostname?: unknown): number {
      updateDynamicRam("hackAnalyzeSecurity", getRamCost(Player, "hackAnalyzeSecurity"));
      let threads = helper.number("hackAnalyzeSecurity", "threads", _threads);
      if (_hostname) {
        const hostname = helper.string("hackAnalyzeSecurity", "hostname", _hostname);
        const server = safeGetServer(hostname, "hackAnalyze");
        if (!(server instanceof Server)) {
          workerScript.log("hackAnalyzeSecurity", () => "Cannot be executed on this server.");
          return 0;
        }

        const percentHacked = calculatePercentMoneyHacked(server, Player);

        if (percentHacked > 0) {
          // thread count is limited to the maximum number of threads needed
          threads = Math.min(threads, Math.ceil(1 / percentHacked));
        }
      }

      return CONSTANTS.ServerFortifyAmount * threads;
    },
    hackAnalyzeChance: function (_hostname: unknown): number {
      updateDynamicRam("hackAnalyzeChance", getRamCost(Player, "hackAnalyzeChance"));
      const hostname = helper.string("hackAnalyzeChance", "hostname", _hostname);

      const server = safeGetServer(hostname, "hackAnalyzeChance");
      if (!(server instanceof Server)) {
        workerScript.log("hackAnalyzeChance", () => "Cannot be executed on this server.");
        return 0;
      }

      return calculateHackingChance(server, Player);
    },
    sleep: async function (_time: unknown = 0): Promise<true> {
      updateDynamicRam("sleep", getRamCost(Player, "sleep"));
      const time = helper.number("sleep", "time", _time);
      if (time === undefined) {
        throw makeRuntimeErrorMsg("sleep", "Takes 1 argument.");
      }
      workerScript.log("sleep", () => `Sleeping for ${time} milliseconds`);
      return netscriptDelay(time, workerScript).then(function () {
        return Promise.resolve(true);
      });
    },
    asleep: function (_time: unknown = 0): Promise<true> {
      updateDynamicRam("asleep", getRamCost(Player, "asleep"));
      const time = helper.number("asleep", "time", _time);
      if (time === undefined) {
        throw makeRuntimeErrorMsg("asleep", "Takes 1 argument.");
      }
      workerScript.log("asleep", () => `Sleeping for ${time} milliseconds`);
      return new Promise((resolve) => setTimeout(() => resolve(true), time));
    },
    grow: async function (
      _hostname: unknown,
      { threads: requestedThreads, stock }: BasicHGWOptions = {},
    ): Promise<number> {
      updateDynamicRam("grow", getRamCost(Player, "grow"));
      const hostname = helper.string("grow", "hostname", _hostname);
      const threads = resolveNetscriptRequestedThreads(
        workerScript,
        "grow",
        requestedThreads ?? workerScript.scriptRef.threads,
      );
      if (hostname === undefined) {
        throw makeRuntimeErrorMsg("grow", "Takes 1 argument.");
      }
      const server = safeGetServer(hostname, "grow");
      if (!(server instanceof Server)) {
        workerScript.log("grow", () => "Cannot be executed on this server.");
        return Promise.resolve(0);
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
        () =>
          `Executing on '${server.hostname}' in ${convertTimeMsToTimeElapsedString(
            growTime * 1000,
            true,
          )} (t=${numeralWrapper.formatThreads(threads)}).`,
      );
      return netscriptDelay(growTime * 1000, workerScript).then(function () {
        const moneyBefore = server.moneyAvailable <= 0 ? 1 : server.moneyAvailable;
        processSingleServerGrowth(server, threads, Player, host.cpuCores);
        const moneyAfter = server.moneyAvailable;
        workerScript.scriptRef.recordGrow(server.hostname, threads);
        const expGain = calculateHackingExpGain(server, Player) * threads;
        const logGrowPercent = moneyAfter / moneyBefore - 1;
        workerScript.log(
          "grow",
          () =>
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
    growthAnalyze: function (_hostname: unknown, _growth: unknown, _cores: unknown = 1): number {
      updateDynamicRam("growthAnalyze", getRamCost(Player, "growthAnalyze"));
      const hostname = helper.string("growthAnalyze", "hostname", _hostname);
      const growth = helper.number("growthAnalyze", "growth", _growth);
      const cores = helper.number("growthAnalyze", "cores", _cores);

      // Check argument validity
      const server = safeGetServer(hostname, "growthAnalyze");
      if (!(server instanceof Server)) {
        workerScript.log("growthAnalyze", () => "Cannot be executed on this server.");
        return 0;
      }
      if (typeof growth !== "number" || isNaN(growth) || growth < 1 || !isFinite(growth)) {
        throw makeRuntimeErrorMsg("growthAnalyze", `Invalid argument: growth must be numeric and >= 1, is ${growth}.`);
      }

      return numCycleForGrowth(server, Number(growth), Player, cores);
    },
    growthAnalyzeSecurity: function (_threads: unknown, _hostname?: unknown, _cores?: unknown): number {
      updateDynamicRam("growthAnalyzeSecurity", getRamCost(Player, "growthAnalyzeSecurity"));
      let threads = helper.number("growthAnalyzeSecurity", "threads", _threads);
      if (_hostname) {
        const cores = helper.number("growthAnalyzeSecurity", "cores", _cores) || 1;
        const hostname = helper.string("growthAnalyzeSecurity", "hostname", _hostname);
        const server = safeGetServer(hostname, "growthAnalyzeSecurity");

        if (!(server instanceof Server)) {
          workerScript.log("growthAnalyzeSecurity", () => "Cannot be executed on this server.");
          return 0;
        }

        const maxThreadsNeeded = Math.ceil(
          numCycleForGrowthCorrected(server, server.moneyMax, server.moneyAvailable, Player, cores),
        );

        threads = Math.min(threads, maxThreadsNeeded);
      }

      return 2 * CONSTANTS.ServerFortifyAmount * threads;
    },
    weaken: async function (_hostname: unknown, { threads: requestedThreads }: BasicHGWOptions = {}): Promise<number> {
      updateDynamicRam("weaken", getRamCost(Player, "weaken"));
      const hostname = helper.string("weaken", "hostname", _hostname);
      const threads = resolveNetscriptRequestedThreads(
        workerScript,
        "weaken",
        requestedThreads ?? workerScript.scriptRef.threads,
      );
      if (hostname === undefined) {
        throw makeRuntimeErrorMsg("weaken", "Takes 1 argument.");
      }
      const server = safeGetServer(hostname, "weaken");
      if (!(server instanceof Server)) {
        workerScript.log("weaken", () => "Cannot be executed on this server.");
        return Promise.resolve(0);
      }

      // No root access or skill level too low
      const canHack = netscriptCanWeaken(server);
      if (!canHack.res) {
        throw makeRuntimeErrorMsg("weaken", canHack.msg || "");
      }

      const weakenTime = calculateWeakenTime(server, Player);
      workerScript.log(
        "weaken",
        () =>
          `Executing on '${server.hostname}' in ${convertTimeMsToTimeElapsedString(
            weakenTime * 1000,
            true,
          )} (t=${numeralWrapper.formatThreads(threads)})`,
      );
      return netscriptDelay(weakenTime * 1000, workerScript).then(function () {
        const host = GetServer(workerScript.hostname);
        if (host === null) {
          workerScript.log("weaken", () => "Server is null, did it die?");
          return Promise.resolve(0);
        }
        const coreBonus = 1 + (host.cpuCores - 1) / 16;
        server.weaken(CONSTANTS.ServerWeakenAmount * threads * coreBonus);
        workerScript.scriptRef.recordWeaken(server.hostname, threads);
        const expGain = calculateHackingExpGain(server, Player) * threads;
        workerScript.log(
          "weaken",
          () =>
            `'${server.hostname}' security level weakened to ${
              server.hackDifficulty
            }. Gained ${numeralWrapper.formatExp(expGain)} hacking exp (t=${numeralWrapper.formatThreads(threads)})`,
        );
        workerScript.scriptRef.onlineExpGained += expGain;
        Player.gainHackingExp(expGain);
        return Promise.resolve(CONSTANTS.ServerWeakenAmount * threads * coreBonus);
      });
    },
    weakenAnalyze: function (_threads: unknown, _cores: unknown = 1): number {
      updateDynamicRam("weakenAnalyze", getRamCost(Player, "weakenAnalyze"));
      const threads = helper.number("weakenAnalyze", "threads", _threads);
      const cores = helper.number("weakenAnalyze", "cores", _cores);
      const coreBonus = 1 + (cores - 1) / 16;
      return CONSTANTS.ServerWeakenAmount * threads * coreBonus * BitNodeMultipliers.ServerWeakenRate;
    },
    share: async function (): Promise<void> {
      updateDynamicRam("share", getRamCost(Player, "share"));
      workerScript.log("share", () => "Sharing this computer.");
      const end = StartSharing(workerScript.scriptRef.threads * calculateIntelligenceBonus(Player.intelligence, 2));
      return netscriptDelay(10000, workerScript).finally(function () {
        workerScript.log("share", () => "Finished sharing this computer.");
        end();
      });
    },
    getSharePower: function (): number {
      updateDynamicRam("getSharePower", getRamCost(Player, "getSharePower"));
      return CalculateShareMult();
    },
    print: function (...args: any[]): void {
      updateDynamicRam("print", getRamCost(Player, "print"));
      if (args.length === 0) {
        throw makeRuntimeErrorMsg("print", "Takes at least 1 argument.");
      }
      workerScript.print(argsToString(args));
    },
    printf: function (_format: unknown, ...args: any[]): void {
      updateDynamicRam("printf", getRamCost(Player, "printf"));
      const format = helper.string("printf", "format", _format);
      if (typeof format !== "string") {
        throw makeRuntimeErrorMsg("printf", "First argument must be string for the format.");
      }
      workerScript.print(vsprintf(format, args));
    },
    tprint: function (...args: any[]): void {
      updateDynamicRam("tprint", getRamCost(Player, "tprint"));
      if (args.length === 0) {
        throw makeRuntimeErrorMsg("tprint", "Takes at least 1 argument.");
      }
      const str = argsToString(args);
      if (str.startsWith("ERROR") || str.startsWith("FAIL")) {
        Terminal.error(`${workerScript.scriptRef.filename}: ${str}`);
        return;
      }
      if (str.startsWith("SUCCESS")) {
        Terminal.success(`${workerScript.scriptRef.filename}: ${str}`);
        return;
      }
      if (str.startsWith("WARN")) {
        Terminal.warn(`${workerScript.scriptRef.filename}: ${str}`);
        return;
      }
      if (str.startsWith("INFO")) {
        Terminal.info(`${workerScript.scriptRef.filename}: ${str}`);
        return;
      }
      Terminal.print(`${workerScript.scriptRef.filename}: ${str}`);
    },
    tprintf: function (_format: unknown, ...args: any[]): void {
      updateDynamicRam("tprintf", getRamCost(Player, "tprintf"));
      const format = helper.string("printf", "format", _format);
      if (typeof format !== "string") {
        throw makeRuntimeErrorMsg("tprintf", "First argument must be string for the format.");
      }
      const str = vsprintf(format, args);

      if (str.startsWith("ERROR") || str.startsWith("FAIL")) {
        Terminal.error(`${str}`);
        return;
      }
      if (str.startsWith("SUCCESS")) {
        Terminal.success(`${str}`);
        return;
      }
      if (str.startsWith("WARN")) {
        Terminal.warn(`${str}`);
        return;
      }
      if (str.startsWith("INFO")) {
        Terminal.info(`${str}`);
        return;
      }
      Terminal.print(`${str}`);
    },
    clearLog: function (): void {
      updateDynamicRam("clearLog", getRamCost(Player, "clearLog"));
      workerScript.scriptRef.clearLog();
    },
    disableLog: function (_fn: unknown): void {
      updateDynamicRam("disableLog", getRamCost(Player, "disableLog"));
      const fn = helper.string("disableLog", "fn", _fn);
      if (fn === "ALL") {
        for (const fn of Object.keys(possibleLogs)) {
          workerScript.disableLogs[fn] = true;
        }
        workerScript.log("disableLog", () => `Disabled logging for all functions`);
      } else if (possibleLogs[fn] === undefined) {
        throw makeRuntimeErrorMsg("disableLog", `Invalid argument: ${fn}.`);
      } else {
        workerScript.disableLogs[fn] = true;
        workerScript.log("disableLog", () => `Disabled logging for ${fn}`);
      }
    },
    enableLog: function (_fn: unknown): void {
      updateDynamicRam("enableLog", getRamCost(Player, "enableLog"));
      const fn = helper.string("enableLog", "fn", _fn);
      if (fn === "ALL") {
        for (const fn of Object.keys(possibleLogs)) {
          delete workerScript.disableLogs[fn];
        }
        workerScript.log("enableLog", () => `Enabled logging for all functions`);
      } else if (possibleLogs[fn] === undefined) {
        throw makeRuntimeErrorMsg("enableLog", `Invalid argument: ${fn}.`);
      }
      delete workerScript.disableLogs[fn];
      workerScript.log("enableLog", () => `Enabled logging for ${fn}`);
    },
    isLogEnabled: function (_fn: unknown): boolean {
      updateDynamicRam("isLogEnabled", getRamCost(Player, "isLogEnabled"));
      const fn = helper.string("isLogEnabled", "fn", _fn);
      if (possibleLogs[fn] === undefined) {
        throw makeRuntimeErrorMsg("isLogEnabled", `Invalid argument: ${fn}.`);
      }
      return !workerScript.disableLogs[fn];
    },
    getScriptLogs: function (fn: any, hostname: any, ...scriptArgs: any[]): string[] {
      updateDynamicRam("getScriptLogs", getRamCost(Player, "getScriptLogs"));
      const runningScriptObj = getRunningScript(fn, hostname, "getScriptLogs", scriptArgs);
      if (runningScriptObj == null) {
        workerScript.log("getScriptLogs", () => getCannotFindRunningScriptErrorMessage(fn, hostname, scriptArgs));
        return [];
      }

      return runningScriptObj.logs.slice();
    },
    tail: function (fn: any, hostname: any = workerScript.hostname, ...scriptArgs: any[]): void {
      updateDynamicRam("tail", getRamCost(Player, "tail"));
      let runningScriptObj;
      if (arguments.length === 0) {
        runningScriptObj = workerScript.scriptRef;
      } else if (typeof fn === "number") {
        runningScriptObj = getRunningScriptByPid(fn, "tail");
      } else {
        runningScriptObj = getRunningScript(fn, hostname, "tail", scriptArgs);
      }
      if (runningScriptObj == null) {
        workerScript.log("tail", () => getCannotFindRunningScriptErrorMessage(fn, hostname, scriptArgs));
        return;
      }

      LogBoxEvents.emit(runningScriptObj);
    },
    closeTail: function (_pid: unknown = workerScript.scriptRef.pid): void {
      updateDynamicRam("closeTail", getRamCost(Player, "closeTail"));
      const pid = helper.number("closeTail", "pid", _pid);
      //Emit an event to tell the game to close the tail window if it exists
      LogBoxCloserEvents.emit(pid);
    },
    nuke: function (_hostname: unknown): boolean {
      updateDynamicRam("nuke", getRamCost(Player, "nuke"));
      const hostname = helper.string("tail", "hostname", _hostname);
      if (hostname === undefined) {
        throw makeRuntimeErrorMsg("nuke", "Takes 1 argument.");
      }
      const server = safeGetServer(hostname, "nuke");
      if (!(server instanceof Server)) {
        workerScript.log("nuke", () => "Cannot be executed on this server.");
        return false;
      }
      if (server.hasAdminRights) {
        workerScript.log("nuke", () => `Already have root access to '${server.hostname}'.`);
        return true;
      }
      if (!Player.hasProgram(Programs.NukeProgram.name)) {
        throw makeRuntimeErrorMsg("nuke", "You do not have the NUKE.exe virus!");
      }
      if (server.openPortCount < server.numOpenPortsRequired) {
        throw makeRuntimeErrorMsg("nuke", "Not enough ports opened to use NUKE.exe virus.");
      }
      server.hasAdminRights = true;
      workerScript.log("nuke", () => `Executed NUKE.exe virus on '${server.hostname}' to gain root access.`);
      return true;
    },
    brutessh: function (_hostname: unknown): boolean {
      updateDynamicRam("brutessh", getRamCost(Player, "brutessh"));
      const hostname = helper.string("brutessh", "hostname", _hostname);
      if (hostname === undefined) {
        throw makeRuntimeErrorMsg("brutessh", "Takes 1 argument.");
      }
      const server = safeGetServer(hostname, "brutessh");
      if (!(server instanceof Server)) {
        workerScript.log("brutessh", () => "Cannot be executed on this server.");
        return false;
      }
      if (!Player.hasProgram(Programs.BruteSSHProgram.name)) {
        throw makeRuntimeErrorMsg("brutessh", "You do not have the BruteSSH.exe program!");
      }
      if (!server.sshPortOpen) {
        workerScript.log("brutessh", () => `Executed BruteSSH.exe on '${server.hostname}' to open SSH port (22).`);
        server.sshPortOpen = true;
        ++server.openPortCount;
      } else {
        workerScript.log("brutessh", () => `SSH Port (22) already opened on '${server.hostname}'.`);
      }
      return true;
    },
    ftpcrack: function (_hostname: unknown): boolean {
      updateDynamicRam("ftpcrack", getRamCost(Player, "ftpcrack"));
      const hostname = helper.string("ftpcrack", "hostname", _hostname);
      if (hostname === undefined) {
        throw makeRuntimeErrorMsg("ftpcrack", "Takes 1 argument.");
      }
      const server = safeGetServer(hostname, "ftpcrack");
      if (!(server instanceof Server)) {
        workerScript.log("ftpcrack", () => "Cannot be executed on this server.");
        return false;
      }
      if (!Player.hasProgram(Programs.FTPCrackProgram.name)) {
        throw makeRuntimeErrorMsg("ftpcrack", "You do not have the FTPCrack.exe program!");
      }
      if (!server.ftpPortOpen) {
        workerScript.log("ftpcrack", () => `Executed FTPCrack.exe on '${server.hostname}' to open FTP port (21).`);
        server.ftpPortOpen = true;
        ++server.openPortCount;
      } else {
        workerScript.log("ftpcrack", () => `FTP Port (21) already opened on '${server.hostname}'.`);
      }
      return true;
    },
    relaysmtp: function (_hostname: unknown): boolean {
      updateDynamicRam("relaysmtp", getRamCost(Player, "relaysmtp"));
      const hostname = helper.string("relaysmtp", "hostname", _hostname);
      if (hostname === undefined) {
        throw makeRuntimeErrorMsg("relaysmtp", "Takes 1 argument.");
      }
      const server = safeGetServer(hostname, "relaysmtp");
      if (!(server instanceof Server)) {
        workerScript.log("relaysmtp", () => "Cannot be executed on this server.");
        return false;
      }
      if (!Player.hasProgram(Programs.RelaySMTPProgram.name)) {
        throw makeRuntimeErrorMsg("relaysmtp", "You do not have the relaySMTP.exe program!");
      }
      if (!server.smtpPortOpen) {
        workerScript.log("relaysmtp", () => `Executed relaySMTP.exe on '${server.hostname}' to open SMTP port (25).`);
        server.smtpPortOpen = true;
        ++server.openPortCount;
      } else {
        workerScript.log("relaysmtp", () => `SMTP Port (25) already opened on '${server.hostname}'.`);
      }
      return true;
    },
    httpworm: function (_hostname: unknown): boolean {
      updateDynamicRam("httpworm", getRamCost(Player, "httpworm"));
      const hostname = helper.string("httpworm", "hostname", _hostname);
      if (hostname === undefined) {
        throw makeRuntimeErrorMsg("httpworm", "Takes 1 argument");
      }
      const server = safeGetServer(hostname, "httpworm");
      if (!(server instanceof Server)) {
        workerScript.log("httpworm", () => "Cannot be executed on this server.");
        return false;
      }
      if (!Player.hasProgram(Programs.HTTPWormProgram.name)) {
        throw makeRuntimeErrorMsg("httpworm", "You do not have the HTTPWorm.exe program!");
      }
      if (!server.httpPortOpen) {
        workerScript.log("httpworm", () => `Executed HTTPWorm.exe on '${server.hostname}' to open HTTP port (80).`);
        server.httpPortOpen = true;
        ++server.openPortCount;
      } else {
        workerScript.log("httpworm", () => `HTTP Port (80) already opened on '${server.hostname}'.`);
      }
      return true;
    },
    sqlinject: function (_hostname: unknown): boolean {
      updateDynamicRam("sqlinject", getRamCost(Player, "sqlinject"));
      const hostname = helper.string("sqlinject", "hostname", _hostname);
      if (hostname === undefined) {
        throw makeRuntimeErrorMsg("sqlinject", "Takes 1 argument.");
      }
      const server = safeGetServer(hostname, "sqlinject");
      if (!(server instanceof Server)) {
        workerScript.log("sqlinject", () => "Cannot be executed on this server.");
        return false;
      }
      if (!Player.hasProgram(Programs.SQLInjectProgram.name)) {
        throw makeRuntimeErrorMsg("sqlinject", "You do not have the SQLInject.exe program!");
      }
      if (!server.sqlPortOpen) {
        workerScript.log("sqlinject", () => `Executed SQLInject.exe on '${server.hostname}' to open SQL port (1433).`);
        server.sqlPortOpen = true;
        ++server.openPortCount;
      } else {
        workerScript.log("sqlinject", () => `SQL Port (1433) already opened on '${server.hostname}'.`);
      }
      return true;
    },
    run: function (_scriptname: unknown, _threads: unknown = 1, ...args: any[]): number {
      updateDynamicRam("run", getRamCost(Player, "run"));
      const scriptname = helper.string("run", "scriptname", _scriptname);
      const threads = helper.number("run", "threads", _threads);
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

      return runScriptFromScript(Player, "run", scriptServer, scriptname, args, workerScript, threads);
    },
    exec: function (_scriptname: unknown, _hostname: unknown, _threads: unknown = 1, ...args: any[]): number {
      updateDynamicRam("exec", getRamCost(Player, "exec"));
      const scriptname = helper.string("exec", "scriptname", _scriptname);
      const hostname = helper.string("exec", "hostname", _hostname);
      const threads = helper.number("exec", "threads", _threads);
      if (scriptname === undefined || hostname === undefined) {
        throw makeRuntimeErrorMsg("exec", "Usage: exec(scriptname, server, [numThreads], [arg1], [arg2]...)");
      }
      if (isNaN(threads) || threads <= 0) {
        throw makeRuntimeErrorMsg("exec", `Invalid thread count. Must be numeric and > 0, is ${threads}`);
      }
      const server = safeGetServer(hostname, "exec");
      return runScriptFromScript(Player, "exec", server, scriptname, args, workerScript, threads);
    },
    spawn: function (_scriptname: unknown, _threads: unknown = 1, ...args: any[]): void {
      updateDynamicRam("spawn", getRamCost(Player, "spawn"));
      const scriptname = helper.string("spawn", "scriptname", _scriptname);
      const threads = helper.number("spawn", "threads", _threads);
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

        return runScriptFromScript(Player, "spawn", scriptServer, scriptname, args, workerScript, threads);
      }, spawnDelay * 1e3);

      workerScript.log("spawn", () => `Will execute '${scriptname}' in ${spawnDelay} seconds`);

      workerScript.running = false; // Prevent workerScript from "finishing execution naturally"
      if (killWorkerScript(workerScript)) {
        workerScript.log("spawn", () => "Exiting...");
      }
    },
    kill: function (filename: any, hostname?: any, ...scriptArgs: any[]): boolean {
      updateDynamicRam("kill", getRamCost(Player, "kill"));

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
          workerScript.log("kill", () => getCannotFindRunningScriptErrorMessage(filename, hostname, scriptArgs));
          return false;
        }

        res = killWorkerScript(runningScriptObj, server.hostname);
      }

      if (res) {
        if (killByPid) {
          workerScript.log("kill", () => `Killing script with PID ${filename}`);
        } else {
          workerScript.log(
            "kill",
            () => `Killing '${filename}' on '${hostname}' with args: ${arrayToString(scriptArgs)}.`,
          );
        }
        return true;
      } else {
        if (killByPid) {
          workerScript.log("kill", () => `No script with PID ${filename}`);
        } else {
          workerScript.log(
            "kill",
            () => `No such script '${filename}' on '${hostname}' with args: ${arrayToString(scriptArgs)}`,
          );
        }
        return false;
      }
    },
    killall: function (_hostname: unknown = workerScript.hostname, _safetyguard: unknown = true): boolean {
      updateDynamicRam("killall", getRamCost(Player, "killall"));
      const hostname = helper.string("killall", "hostname", _hostname);
      const safetyguard = helper.boolean(_safetyguard);
      if (hostname === undefined) {
        throw makeRuntimeErrorMsg("killall", "Usage: killall(hostname, [safetyguard boolean])");
      }
      const server = safeGetServer(hostname, "killall");

      let scriptsKilled = 0;

      for (let i = server.runningScripts.length - 1; i >= 0; --i) {
        if (safetyguard === true && server.runningScripts[i].pid == workerScript.pid) continue;
        killWorkerScript(server.runningScripts[i], server.hostname, false);
        ++scriptsKilled;
      }
      WorkerScriptStartStopEventEmitter.emit();
      workerScript.log(
        "killall",
        () => `Killing all scripts on '${server.hostname}'. May take a few minutes for the scripts to die.`,
      );

      return scriptsKilled > 0;
    },
    exit: function (): void {
      updateDynamicRam("exit", getRamCost(Player, "exit"));
      workerScript.running = false; // Prevent workerScript from "finishing execution naturally"
      if (killWorkerScript(workerScript)) {
        workerScript.log("exit", () => "Exiting...");
      } else {
        workerScript.log("exit", () => "Failed. This is a bug. Report to dev.");
      }
    },
    scp: async function (scriptname: any, _hostname1: unknown, hostname2?: any): Promise<boolean> {
      updateDynamicRam("scp", getRamCost(Player, "scp"));
      const hostname1 = helper.string("scp", "hostname1", _hostname1);
      if (arguments.length !== 2 && arguments.length !== 3) {
        throw makeRuntimeErrorMsg("scp", "Takes 2 or 3 arguments");
      }
      if (scriptname && scriptname.constructor === Array) {
        // Recursively call scp on all elements of array
        const scripts: Array<string> = scriptname;
        if (scripts.length === 0) {
          throw makeRuntimeErrorMsg("scp", "No scripts to copy");
        }
        let res = true;
        await Promise.all(
          scripts.map(async function (script) {
            if (!(await NetscriptFunctions(workerScript).scp(script, hostname1, hostname2))) {
              res = false;
            }
          }),
        );
        return Promise.resolve(res);
      }

      // Invalid file type
      if (!isValidFilePath(scriptname)) {
        throw makeRuntimeErrorMsg("scp", `Invalid filename: '${scriptname}'`);
      }

      // Invalid file name
      if (!scriptname.endsWith(".lit") && !isScriptFilename(scriptname) && !scriptname.endsWith("txt")) {
        throw makeRuntimeErrorMsg("scp", "Only works for scripts, .lit and .txt files");
      }

      let destServer: BaseServer | null;
      let currServ: BaseServer | null;

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
          workerScript.log("scp", () => `File '${scriptname}' does not exist.`);
          return Promise.resolve(false);
        }

        for (let i = 0; i < destServer.messages.length; ++i) {
          if (destServer.messages[i] === scriptname) {
            workerScript.log("scp", () => `File '${scriptname}' copied over to '${destServer?.hostname}'.`);
            return Promise.resolve(true); // Already exists
          }
        }
        destServer.messages.push(scriptname);
        workerScript.log("scp", () => `File '${scriptname}' copied over to '${destServer?.hostname}'.`);
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
          workerScript.log("scp", () => `File '${scriptname}' does not exist.`);
          return Promise.resolve(false);
        }

        for (let i = 0; i < destServer.textFiles.length; ++i) {
          if (destServer.textFiles[i].fn === scriptname) {
            // Overwrite
            destServer.textFiles[i].text = txtFile.text;
            workerScript.log("scp", () => `File '${scriptname}' copied over to '${destServer?.hostname}'.`);
            return Promise.resolve(true);
          }
        }
        const newFile = new TextFile(txtFile.fn, txtFile.text);
        destServer.textFiles.push(newFile);
        workerScript.log("scp", () => `File '${scriptname}' copied over to '${destServer?.hostname}'.`);
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
        workerScript.log("scp", () => `File '${scriptname}' does not exist.`);
        return Promise.resolve(false);
      }

      // Overwrite script if it already exists
      for (let i = 0; i < destServer.scripts.length; ++i) {
        if (scriptname == destServer.scripts[i].filename) {
          workerScript.log("scp", () => `WARNING: File '${scriptname}' overwritten on '${destServer?.hostname}'`);
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
      const newScript = new Script(Player, scriptname);
      newScript.code = sourceScript.code;
      newScript.ramUsage = sourceScript.ramUsage;
      newScript.server = destServer.hostname;
      destServer.scripts.push(newScript);
      workerScript.log("scp", () => `File '${scriptname}' copied over to '${destServer?.hostname}'.`);
      return new Promise((resolve) => {
        if (destServer === null) {
          resolve(false);
          return;
        }
        newScript.updateRamUsage(Player, destServer.scripts).then(() => resolve(true));
      });
    },
    ls: function (_hostname: unknown, _grep: unknown = ""): string[] {
      updateDynamicRam("ls", getRamCost(Player, "ls"));
      const hostname = helper.string("ls", "hostname", _hostname);
      const grep = helper.string("ls", "grep", _grep);
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
    getRecentScripts: function (): IRecentScript[] {
      updateDynamicRam("getRecentScripts", getRamCost(Player, "getRecentScripts"));
      return recentScripts.map((rs) => ({
        timeOfDeath: rs.timeOfDeath,
        ...createPublicRunningScript(rs.runningScript),
      }));
    },
    ps: function (_hostname: unknown = workerScript.hostname): ProcessInfo[] {
      updateDynamicRam("ps", getRamCost(Player, "ps"));
      const hostname = helper.string("ps", "hostname", _hostname);
      const server = safeGetServer(hostname, "ps");
      const processes = [];
      for (const script of server.runningScripts) {
        processes.push({
          filename: script.filename,
          threads: script.threads,
          args: script.args.slice(),
          pid: script.pid,
        });
      }
      return processes;
    },
    hasRootAccess: function (_hostname: unknown): boolean {
      updateDynamicRam("hasRootAccess", getRamCost(Player, "hasRootAccess"));
      const hostname = helper.string("hasRootAccess", "hostname", _hostname);
      if (hostname === undefined) {
        throw makeRuntimeErrorMsg("hasRootAccess", "Takes 1 argument");
      }
      const server = safeGetServer(hostname, "hasRootAccess");
      return server.hasAdminRights;
    },
    getHostname: function (): string {
      updateDynamicRam("getHostname", getRamCost(Player, "getHostname"));
      const scriptServer = GetServer(workerScript.hostname);
      if (scriptServer == null) {
        throw makeRuntimeErrorMsg("getHostname", "Could not find server. This is a bug. Report to dev.");
      }
      return scriptServer.hostname;
    },
    getHackingLevel: function (): number {
      updateDynamicRam("getHackingLevel", getRamCost(Player, "getHackingLevel"));
      Player.updateSkillLevels();
      workerScript.log("getHackingLevel", () => `returned ${Player.hacking}`);
      return Player.hacking;
    },
    getHackingMultipliers: function (): HackingMultipliers {
      updateDynamicRam("getHackingMultipliers", getRamCost(Player, "getHackingMultipliers"));
      return {
        chance: Player.hacking_chance_mult,
        speed: Player.hacking_speed_mult,
        money: Player.hacking_money_mult,
        growth: Player.hacking_grow_mult,
      };
    },
    getHacknetMultipliers: function (): HacknetMultipliers {
      updateDynamicRam("getHacknetMultipliers", getRamCost(Player, "getHacknetMultipliers"));
      return {
        production: Player.hacknet_node_money_mult,
        purchaseCost: Player.hacknet_node_purchase_cost_mult,
        ramCost: Player.hacknet_node_ram_cost_mult,
        coreCost: Player.hacknet_node_core_cost_mult,
        levelCost: Player.hacknet_node_level_cost_mult,
      };
    },
    getBitNodeMultipliers: function (): IBNMults {
      updateDynamicRam("getBitNodeMultipliers", getRamCost(Player, "getBitNodeMultipliers"));
      if (Player.sourceFileLvl(5) <= 0 && Player.bitNodeN !== 5) {
        throw makeRuntimeErrorMsg("getBitNodeMultipliers", "Requires Source-File 5 to run.");
      }
      const copy = Object.assign({}, BitNodeMultipliers);
      return copy;
    },
    getServer: function (_hostname: unknown = workerScript.hostname): IServerDef {
      updateDynamicRam("getServer", getRamCost(Player, "getServer"));
      const hostname = helper.string("getServer", "hostname", _hostname);
      const server = safeGetServer(hostname, "getServer");
      const copy = Object.assign({}, server) as any;
      // These fields should be hidden.
      copy.contracts = undefined;
      copy.messages = undefined;
      copy.runningScripts = undefined;
      copy.scripts = undefined;
      copy.textFiles = undefined;
      copy.programs = undefined;
      copy.serversOnNetwork = undefined;
      if (!copy.baseDifficulty) copy.baseDifficulty = 0;
      if (!copy.hackDifficulty) copy.hackDifficulty = 0;
      if (!copy.minDifficulty) copy.minDifficulty = 0;
      if (!copy.moneyAvailable) copy.moneyAvailable = 0;
      if (!copy.moneyMax) copy.moneyMax = 0;
      if (!copy.numOpenPortsRequired) copy.numOpenPortsRequired = 0;
      if (!copy.openPortCount) copy.openPortCount = 0;
      if (!copy.requiredHackingSkill) copy.requiredHackingSkill = 0;
      if (!copy.serverGrowth) copy.serverGrowth = 0;
      return copy;
    },
    getServerMoneyAvailable: function (_hostname: unknown): number {
      updateDynamicRam("getServerMoneyAvailable", getRamCost(Player, "getServerMoneyAvailable"));
      const hostname = helper.string("getServerMoneyAvailable", "hostname", _hostname);
      const server = safeGetServer(hostname, "getServerMoneyAvailable");
      if (!(server instanceof Server)) {
        workerScript.log("getServerMoneyAvailable", () => "Cannot be executed on this server.");
        return 0;
      }
      if (failOnHacknetServer(server, "getServerMoneyAvailable")) {
        return 0;
      }
      if (server.hostname == "home") {
        // Return player's money
        workerScript.log(
          "getServerMoneyAvailable",
          () => `returned player's money: ${numeralWrapper.formatMoney(Player.money)}`,
        );
        return Player.money;
      }
      workerScript.log(
        "getServerMoneyAvailable",
        () => `returned ${numeralWrapper.formatMoney(server.moneyAvailable)} for '${server.hostname}'`,
      );
      return server.moneyAvailable;
    },
    getServerSecurityLevel: function (_hostname: unknown): number {
      updateDynamicRam("getServerSecurityLevel", getRamCost(Player, "getServerSecurityLevel"));
      const hostname = helper.string("getServerSecurityLevel", "hostname", _hostname);
      const server = safeGetServer(hostname, "getServerSecurityLevel");
      if (!(server instanceof Server)) {
        workerScript.log("getServerSecurityLevel", () => "Cannot be executed on this server.");
        return 1;
      }
      if (failOnHacknetServer(server, "getServerSecurityLevel")) {
        return 1;
      }
      workerScript.log(
        "getServerSecurityLevel",
        () => `returned ${numeralWrapper.formatServerSecurity(server.hackDifficulty)} for '${server.hostname}'`,
      );
      return server.hackDifficulty;
    },
    getServerBaseSecurityLevel: function (_hostname: unknown): number {
      updateDynamicRam("getServerBaseSecurityLevel", getRamCost(Player, "getServerBaseSecurityLevel"));
      const hostname = helper.string("getServerBaseSecurityLevel", "hostname", _hostname);
      workerScript.log(
        "getServerBaseSecurityLevel",
        () => `getServerBaseSecurityLevel is deprecated because it's not useful.`,
      );
      const server = safeGetServer(hostname, "getServerBaseSecurityLevel");
      if (!(server instanceof Server)) {
        workerScript.log("getServerBaseSecurityLevel", () => "Cannot be executed on this server.");
        return 1;
      }
      if (failOnHacknetServer(server, "getServerBaseSecurityLevel")) {
        return 1;
      }
      workerScript.log(
        "getServerBaseSecurityLevel",
        () => `returned ${numeralWrapper.formatServerSecurity(server.baseDifficulty)} for '${server.hostname}'`,
      );
      return server.baseDifficulty;
    },
    getServerMinSecurityLevel: function (_hostname: unknown): number {
      updateDynamicRam("getServerMinSecurityLevel", getRamCost(Player, "getServerMinSecurityLevel"));
      const hostname = helper.string("getServerMinSecurityLevel", "hostname", _hostname);
      const server = safeGetServer(hostname, "getServerMinSecurityLevel");
      if (!(server instanceof Server)) {
        workerScript.log("getServerMinSecurityLevel", () => "Cannot be executed on this server.");
        return 1;
      }
      if (failOnHacknetServer(server, "getServerMinSecurityLevel")) {
        return 1;
      }
      workerScript.log(
        "getServerMinSecurityLevel",
        () => `returned ${numeralWrapper.formatServerSecurity(server.minDifficulty)} for ${server.hostname}`,
      );
      return server.minDifficulty;
    },
    getServerRequiredHackingLevel: function (_hostname: unknown): number {
      updateDynamicRam("getServerRequiredHackingLevel", getRamCost(Player, "getServerRequiredHackingLevel"));
      const hostname = helper.string("getServerRequiredHackingLevel", "hostname", _hostname);
      const server = safeGetServer(hostname, "getServerRequiredHackingLevel");
      if (!(server instanceof Server)) {
        workerScript.log("getServerRequiredHackingLevel", () => "Cannot be executed on this server.");
        return 1;
      }
      if (failOnHacknetServer(server, "getServerRequiredHackingLevel")) {
        return 1;
      }
      workerScript.log(
        "getServerRequiredHackingLevel",
        () => `returned ${numeralWrapper.formatSkill(server.requiredHackingSkill)} for '${server.hostname}'`,
      );
      return server.requiredHackingSkill;
    },
    getServerMaxMoney: function (_hostname: unknown): number {
      updateDynamicRam("getServerMaxMoney", getRamCost(Player, "getServerMaxMoney"));
      const hostname = helper.string("getServerMaxMoney", "hostname", _hostname);
      const server = safeGetServer(hostname, "getServerMaxMoney");
      if (!(server instanceof Server)) {
        workerScript.log("getServerMaxMoney", () => "Cannot be executed on this server.");
        return 0;
      }
      if (failOnHacknetServer(server, "getServerMaxMoney")) {
        return 0;
      }
      workerScript.log(
        "getServerMaxMoney",
        () => `returned ${numeralWrapper.formatMoney(server.moneyMax)} for '${server.hostname}'`,
      );
      return server.moneyMax;
    },
    getServerGrowth: function (_hostname: unknown): number {
      updateDynamicRam("getServerGrowth", getRamCost(Player, "getServerGrowth"));
      const hostname = helper.string("getServerGrowth", "hostname", _hostname);
      const server = safeGetServer(hostname, "getServerGrowth");
      if (!(server instanceof Server)) {
        workerScript.log("getServerGrowth", () => "Cannot be executed on this server.");
        return 1;
      }
      if (failOnHacknetServer(server, "getServerGrowth")) {
        return 1;
      }
      workerScript.log("getServerGrowth", () => `returned ${server.serverGrowth} for '${server.hostname}'`);
      return server.serverGrowth;
    },
    getServerNumPortsRequired: function (_hostname: unknown): number {
      updateDynamicRam("getServerNumPortsRequired", getRamCost(Player, "getServerNumPortsRequired"));
      const hostname = helper.string("getServerNumPortsRequired", "hostname", _hostname);
      const server = safeGetServer(hostname, "getServerNumPortsRequired");
      if (!(server instanceof Server)) {
        workerScript.log("getServerNumPortsRequired", () => "Cannot be executed on this server.");
        return 5;
      }
      if (failOnHacknetServer(server, "getServerNumPortsRequired")) {
        return 5;
      }
      workerScript.log(
        "getServerNumPortsRequired",
        () => `returned ${server.numOpenPortsRequired} for '${server.hostname}'`,
      );
      return server.numOpenPortsRequired;
    },
    getServerRam: function (_hostname: unknown): [number, number] {
      updateDynamicRam("getServerRam", getRamCost(Player, "getServerRam"));
      const hostname = helper.string("getServerRam", "hostname", _hostname);
      workerScript.log(
        "getServerRam",
        () => `getServerRam is deprecated in favor of getServerMaxRam / getServerUsedRam`,
      );
      const server = safeGetServer(hostname, "getServerRam");
      workerScript.log(
        "getServerRam",
        () => `returned [${numeralWrapper.formatRAM(server.maxRam)}, ${numeralWrapper.formatRAM(server.ramUsed)}]`,
      );
      return [server.maxRam, server.ramUsed];
    },
    getServerMaxRam: function (_hostname: unknown): number {
      updateDynamicRam("getServerMaxRam", getRamCost(Player, "getServerMaxRam"));
      const hostname = helper.string("getServerMaxRam", "hostname", _hostname);
      const server = safeGetServer(hostname, "getServerMaxRam");
      workerScript.log("getServerMaxRam", () => `returned ${numeralWrapper.formatRAM(server.maxRam)}`);
      return server.maxRam;
    },
    getServerUsedRam: function (_hostname: unknown): number {
      updateDynamicRam("getServerUsedRam", getRamCost(Player, "getServerUsedRam"));
      const hostname = helper.string("getServerUsedRam", "hostname", _hostname);
      const server = safeGetServer(hostname, "getServerUsedRam");
      workerScript.log("getServerUsedRam", () => `returned ${numeralWrapper.formatRAM(server.ramUsed)}`);
      return server.ramUsed;
    },
    serverExists: function (_hostname: unknown): boolean {
      updateDynamicRam("serverExists", getRamCost(Player, "serverExists"));
      const hostname = helper.string("serverExists", "hostname", _hostname);
      return GetServer(hostname) !== null;
    },
    fileExists: function (_filename: unknown, _hostname: unknown = workerScript.hostname): boolean {
      updateDynamicRam("fileExists", getRamCost(Player, "fileExists"));
      const filename = helper.string("fileExists", "filename", _filename);
      const hostname = helper.string("fileExists", "hostname", _hostname);
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
        if (filename.toLowerCase() === server.messages[i].toLowerCase()) {
          return true;
        }
      }
      const txtFile = getTextFile(filename, server);
      return txtFile != null;
    },
    isRunning: function (fn: any, hostname: any = workerScript.hostname, ...scriptArgs: any[]): boolean {
      updateDynamicRam("isRunning", getRamCost(Player, "isRunning"));
      if (fn === undefined || hostname === undefined) {
        throw makeRuntimeErrorMsg("isRunning", "Usage: isRunning(scriptname, server, [arg1], [arg2]...)");
      }
      if (typeof fn === "number") {
        return getRunningScriptByPid(fn, "isRunning") != null;
      } else {
        return getRunningScript(fn, hostname, "isRunning", scriptArgs) != null;
      }
    },
    getPurchasedServerLimit: function (): number {
      updateDynamicRam("getPurchasedServerLimit", getRamCost(Player, "getPurchasedServerLimit"));

      return getPurchaseServerLimit();
    },
    getPurchasedServerMaxRam: function (): number {
      updateDynamicRam("getPurchasedServerMaxRam", getRamCost(Player, "getPurchasedServerMaxRam"));

      return getPurchaseServerMaxRam();
    },
    getPurchasedServerCost: function (_ram: unknown): number {
      updateDynamicRam("getPurchasedServerCost", getRamCost(Player, "getPurchasedServerCost"));
      const ram = helper.number("getPurchasedServerCost", "ram", _ram);

      const cost = getPurchaseServerCost(ram);
      if (cost === Infinity) {
        workerScript.log("getPurchasedServerCost", () => `Invalid argument: ram='${ram}'`);
        return Infinity;
      }

      return cost;
    },
    purchaseServer: function (_name: unknown, _ram: unknown): string {
      updateDynamicRam("purchaseServer", getRamCost(Player, "purchaseServer"));
      const name = helper.string("purchaseServer", "name", _name);
      const ram = helper.number("purchaseServer", "ram", _ram);
      if (arguments.length !== 2) throw makeRuntimeErrorMsg("purchaseServer", "Takes 2 arguments");
      let hostnameStr = String(name);
      hostnameStr = hostnameStr.replace(/\s+/g, "");
      if (hostnameStr == "") {
        workerScript.log("purchaseServer", () => `Invalid argument: hostname='${hostnameStr}'`);
        return "";
      }

      if (Player.purchasedServers.length >= getPurchaseServerLimit()) {
        workerScript.log(
          "purchaseServer",
          () =>
            `You have reached the maximum limit of ${getPurchaseServerLimit()} servers. You cannot purchase any more.`,
        );
        return "";
      }

      const cost = getPurchaseServerCost(ram);
      if (cost === Infinity) {
        if (ram > getPurchaseServerMaxRam()) {
          workerScript.log(
            "purchaseServer",
            () => `Invalid argument: ram='${ram}' must not be greater than getPurchaseServerMaxRam`,
          );
        } else {
          workerScript.log("purchaseServer", () => `Invalid argument: ram='${ram}' must be a positive power of 2`);
        }

        return "";
      }

      if (Player.money < cost) {
        workerScript.log(
          "purchaseServer",
          () => `Not enough money to purchase server. Need ${numeralWrapper.formatMoney(cost)}`,
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
        () => `Purchased new server with hostname '${newServ.hostname}' for ${numeralWrapper.formatMoney(cost)}`,
      );
      return newServ.hostname;
    },
    deleteServer: function (_name: unknown): boolean {
      updateDynamicRam("deleteServer", getRamCost(Player, "deleteServer"));
      const name = helper.string("purchaseServer", "name", _name);
      let hostnameStr = String(name);
      hostnameStr = hostnameStr.replace(/\s\s+/g, "");
      const server = GetServer(hostnameStr);
      if (!(server instanceof Server)) {
        workerScript.log("deleteServer", () => `Invalid argument: hostname='${hostnameStr}'`);
        return false;
      }

      if (!server.purchasedByPlayer || server.hostname === "home") {
        workerScript.log("deleteServer", () => "Cannot delete non-purchased server.");
        return false;
      }

      const hostname = server.hostname;

      // Can't delete server you're currently connected to
      if (server.isConnectedTo) {
        workerScript.log("deleteServer", () => "You are currently connected to the server you are trying to delete.");
        return false;
      }

      // A server cannot delete itself
      if (hostname === workerScript.hostname) {
        workerScript.log("deleteServer", () => "Cannot delete the server this script is running on.");
        return false;
      }

      // Delete all scripts running on server
      if (server.runningScripts.length > 0) {
        workerScript.log(
          "deleteServer",
          () => `Cannot delete server '${hostname}' because it still has scripts running.`,
        );
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
          () => `Could not identify server ${hostname} as a purchased server. This is a bug. Report to dev.`,
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
          workerScript.log("deleteServer", () => `Deleted server '${hostnameStr}`);
          return true;
        }
      }
      // Wasn't found on home computer
      workerScript.log(
        "deleteServer",
        () => `Could not find server ${hostname} as a purchased server. This is a bug. Report to dev.`,
      );
      return false;
    },
    getPurchasedServers: function (): string[] {
      updateDynamicRam("getPurchasedServers", getRamCost(Player, "getPurchasedServers"));
      const res: string[] = [];
      Player.purchasedServers.forEach(function (hostname) {
        res.push(hostname);
      });
      return res;
    },
    writePort: function (_port: unknown, data: any = ""): Promise<any> {
      updateDynamicRam("writePort", getRamCost(Player, "writePort"));
      const port = helper.number("writePort", "port", _port);
      if (typeof data !== "string" && typeof data !== "number") {
        throw makeRuntimeErrorMsg(
          "writePort",
          `Trying to write invalid data to a port: only strings and numbers are valid.`,
        );
      }
      const iport = helper.getValidPort("writePort", port);
      return Promise.resolve(iport.write(data));
    },
    write: function (_port: unknown, data: any = "", _mode: unknown = "a"): Promise<void> {
      updateDynamicRam("write", getRamCost(Player, "write"));
      const port = helper.string("write", "port", _port);
      const mode = helper.string("write", "mode", _mode);
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
            script = new Script(Player, fn, data, server.hostname, server.scripts);
            server.scripts.push(script);
            return script.updateRamUsage(Player, server.scripts);
          }
          mode === "w" ? (script.code = data) : (script.code += data);
          return script.updateRamUsage(Player, server.scripts);
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
    tryWritePort: function (_port: unknown, data: any = ""): Promise<any> {
      updateDynamicRam("tryWritePort", getRamCost(Player, "tryWritePort"));
      let port = helper.number("tryWritePort", "port", _port);
      if (typeof data !== "string" && typeof data !== "number") {
        throw makeRuntimeErrorMsg(
          "tryWritePort",
          `Trying to write invalid data to a port: only strings and numbers are valid.`,
        );
      }
      if (!isNaN(port)) {
        port = Math.round(port);
        if (port < 1 || port > CONSTANTS.NumNetscriptPorts) {
          throw makeRuntimeErrorMsg(
            "tryWritePort",
            `Invalid port: ${port}. Only ports 1-${CONSTANTS.NumNetscriptPorts} are valid.`,
          );
        }
        const iport = NetscriptPorts[port - 1];
        if (iport == null || !(iport instanceof Object)) {
          throw makeRuntimeErrorMsg("tryWritePort", `Could not find port: ${port}. This is a bug. Report to dev.`);
        }
        return Promise.resolve(iport.tryWrite(data));
      } else {
        throw makeRuntimeErrorMsg("tryWritePort", `Invalid argument: ${port}`);
      }
    },
    readPort: function (_port: unknown): any {
      updateDynamicRam("readPort", getRamCost(Player, "readPort"));
      const port = helper.number("readPort", "port", _port);
      // Read from port
      const iport = helper.getValidPort("readPort", port);
      const x = iport.read();
      return x;
    },
    read: function (_port: unknown): string {
      updateDynamicRam("read", getRamCost(Player, "read"));
      const port = helper.string("read", "port", _port);
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
    peek: function (_port: unknown): any {
      updateDynamicRam("peek", getRamCost(Player, "peek"));
      const port = helper.number("peek", "port", _port);
      const iport = helper.getValidPort("peek", port);
      const x = iport.peek();
      return x;
    },
    clear: function (_file: unknown): void {
      updateDynamicRam("clear", getRamCost(Player, "clear"));
      const file = helper.string("peek", "file", _file);
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
    },
    clearPort: function (_port: unknown): void {
      updateDynamicRam("clearPort", getRamCost(Player, "clearPort"));
      const port = helper.number("clearPort", "port", _port);
      // Clear port
      const iport = helper.getValidPort("clearPort", port);
      iport.clear();
    },
    getPortHandle: function (_port: unknown): IPort {
      updateDynamicRam("getPortHandle", getRamCost(Player, "getPortHandle"));
      const port = helper.number("getPortHandle", "port", _port);
      const iport = helper.getValidPort("getPortHandle", port);
      return iport;
    },
    rm: function (_fn: unknown, hostname: any): boolean {
      updateDynamicRam("rm", getRamCost(Player, "rm"));
      const fn = helper.string("rm", "fn", _fn);

      if (hostname == null || hostname === "") {
        hostname = workerScript.hostname;
      }
      const s = safeGetServer(hostname, "rm");

      const status = s.removeFile(fn);
      if (!status.res) {
        workerScript.log("rm", () => status.msg + "");
      }

      return status.res;
    },
    scriptRunning: function (_scriptname: unknown, _hostname: unknown): boolean {
      updateDynamicRam("scriptRunning", getRamCost(Player, "scriptRunning"));
      const scriptname = helper.string("scriptRunning", "scriptname", _scriptname);
      const hostname = helper.string("scriptRunning", "hostname", _hostname);
      const server = safeGetServer(hostname, "scriptRunning");
      for (let i = 0; i < server.runningScripts.length; ++i) {
        if (server.runningScripts[i].filename == scriptname) {
          return true;
        }
      }
      return false;
    },
    scriptKill: function (_scriptname: unknown, _hostname: unknown): boolean {
      updateDynamicRam("scriptKill", getRamCost(Player, "scriptKill"));
      const scriptname = helper.string("scriptKill", "scriptname", _scriptname);
      const hostname = helper.string("scriptKill", "hostname", _hostname);
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
    getScriptName: function (): string {
      updateDynamicRam("getScriptName", getRamCost(Player, "getScriptName"));
      return workerScript.name;
    },
    getScriptRam: function (_scriptname: unknown, _hostname: unknown = workerScript.hostname): number {
      updateDynamicRam("getScriptRam", getRamCost(Player, "getScriptRam"));
      const scriptname = helper.string("getScriptRam", "scriptname", _scriptname);
      const hostname = helper.string("getScriptRam", "hostname", _hostname);
      const server = safeGetServer(hostname, "getScriptRam");
      for (let i = 0; i < server.scripts.length; ++i) {
        if (server.scripts[i].filename == scriptname) {
          return server.scripts[i].ramUsage;
        }
      }
      return 0;
    },
    getRunningScript: function (fn: any, hostname: any, ...args: any[]): IRunningScriptDef | null {
      updateDynamicRam("getRunningScript", getRamCost(Player, "getRunningScript"));

      let runningScript;
      if (fn === undefined && hostname === undefined && args.length === 0) {
        runningScript = workerScript.scriptRef;
      } else if (typeof fn === "number") {
        runningScript = getRunningScriptByPid(fn, "getRunningScript");
      } else {
        runningScript = getRunningScript(fn, hostname, "getRunningScript", args);
      }
      if (runningScript === null) return null;
      return createPublicRunningScript(runningScript);
    },
    getHackTime: function (_hostname: unknown = workerScript.hostname): number {
      updateDynamicRam("getHackTime", getRamCost(Player, "getHackTime"));
      const hostname = helper.string("getHackTime", "hostname", _hostname);
      const server = safeGetServer(hostname, "getHackTime");
      if (!(server instanceof Server)) {
        workerScript.log("getHackTime", () => "invalid for this kind of server");
        return Infinity;
      }
      if (failOnHacknetServer(server, "getHackTime")) {
        return Infinity;
      }

      return calculateHackingTime(server, Player) * 1000;
    },
    getGrowTime: function (_hostname: unknown = workerScript.hostname): number {
      updateDynamicRam("getGrowTime", getRamCost(Player, "getGrowTime"));
      const hostname = helper.string("getGrowTime", "hostname", _hostname);
      const server = safeGetServer(hostname, "getGrowTime");
      if (!(server instanceof Server)) {
        workerScript.log("getGrowTime", () => "invalid for this kind of server");
        return Infinity;
      }
      if (failOnHacknetServer(server, "getGrowTime")) {
        return Infinity;
      }

      return calculateGrowTime(server, Player) * 1000;
    },
    getWeakenTime: function (_hostname: unknown = workerScript.hostname): number {
      updateDynamicRam("getWeakenTime", getRamCost(Player, "getWeakenTime"));
      const hostname = helper.string("getWeakenTime", "hostname", _hostname);
      const server = safeGetServer(hostname, "getWeakenTime");
      if (!(server instanceof Server)) {
        workerScript.log("getWeakenTime", () => "invalid for this kind of server");
        return Infinity;
      }
      if (failOnHacknetServer(server, "getWeakenTime")) {
        return Infinity;
      }

      return calculateWeakenTime(server, Player) * 1000;
    },
    getScriptIncome: function (scriptname?: any, hostname?: any, ...args: any[]): any {
      updateDynamicRam("getScriptIncome", getRamCost(Player, "getScriptIncome"));
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
            () => `No such script '${scriptname}' on '${server.hostname}' with args: ${arrayToString(args)}`,
          );
          return -1;
        }
        return runningScriptObj.onlineMoneyMade / runningScriptObj.onlineRunningTime;
      }
    },
    getScriptExpGain: function (scriptname?: any, hostname?: any, ...args: any[]): number {
      updateDynamicRam("getScriptExpGain", getRamCost(Player, "getScriptExpGain"));
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
            () => `No such script '${scriptname}' on '${server.hostname}' with args: ${arrayToString(args)}`,
          );
          return -1;
        }
        return runningScriptObj.onlineExpGained / runningScriptObj.onlineRunningTime;
      }
    },
    nFormat: function (_n: unknown, _format: unknown): string {
      updateDynamicRam("nFormat", getRamCost(Player, "nFormat"));
      const n = helper.number("nFormat", "n", _n);
      const format = helper.string("nFormat", "format", _format);
      if (isNaN(n)) {
        return "";
      }

      return numeralWrapper.format(n, format);
    },
    tFormat: function (_milliseconds: unknown, _milliPrecision: unknown = false): string {
      updateDynamicRam("tFormat", getRamCost(Player, "tFormat"));
      const milliseconds = helper.number("tFormat", "milliseconds", _milliseconds);
      const milliPrecision = helper.boolean(_milliPrecision);
      return convertTimeMsToTimeElapsedString(milliseconds, milliPrecision);
    },
    getTimeSinceLastAug: function (): number {
      updateDynamicRam("getTimeSinceLastAug", getRamCost(Player, "getTimeSinceLastAug"));
      return Player.playtimeSinceLastAug;
    },
    alert: function (_message: unknown): void {
      updateDynamicRam("alert", getRamCost(Player, "alert"));
      const message = helper.string("alert", "message", _message);
      dialogBoxCreate(message);
    },
    toast: function (_message: unknown, _variant: unknown = ToastVariant.SUCCESS, duration: any = 2000): void {
      updateDynamicRam("toast", getRamCost(Player, "toast"));
      const message = helper.string("toast", "message", _message);
      const variant = helper.string("toast", "variant", _variant);
      if (!checkEnum(ToastVariant, variant))
        throw new Error(`variant must be one of ${Object.values(ToastVariant).join(", ")}`);
      SnackbarEvents.emit(message, variant, duration);
    },
    prompt: function (_txt: unknown, options?: { type?: string; options?: string[] }): Promise<boolean | string> {
      updateDynamicRam("prompt", getRamCost(Player, "prompt"));
      const txt = helper.string("toast", "txt", _txt);

      return new Promise(function (resolve) {
        PromptEvent.emit({
          txt: txt,
          options,
          resolve: resolve,
        });
      });
    },
    wget: async function (
      _url: unknown,
      _target: unknown,
      _hostname: unknown = workerScript.hostname,
    ): Promise<boolean> {
      updateDynamicRam("wget", getRamCost(Player, "wget"));
      const url = helper.string("wget", "url", _url);
      const target = helper.string("wget", "target", _target);
      const hostname = helper.string("wget", "hostname", _hostname);
      if (!isScriptFilename(target) && !target.endsWith(".txt")) {
        workerScript.log("wget", () => `Invalid target file: '${target}'. Must be a script or text file.`);
        return Promise.resolve(false);
      }
      const s = safeGetServer(hostname, "wget");
      return new Promise(function (resolve) {
        $.get(
          url,
          function (data) {
            let res;
            if (isScriptFilename(target)) {
              res = s.writeToScriptFile(Player, target, data);
            } else {
              res = s.writeToTextFile(target, data);
            }
            if (!res.success) {
              workerScript.log("wget", () => "Failed.");
              return resolve(false);
            }
            if (res.overwritten) {
              workerScript.log(
                "wget",
                () => `Successfully retrieved content and overwrote '${target}' on '${hostname}'`,
              );
              return resolve(true);
            }
            workerScript.log("wget", () => `Successfully retrieved content to new file '${target}' on '${hostname}'`);
            return resolve(true);
          },
          "text",
        ).fail(function (e) {
          workerScript.log("wget", () => JSON.stringify(e));
          return resolve(false);
        });
      });
    },
    getFavorToDonate: function (): number {
      updateDynamicRam("getFavorToDonate", getRamCost(Player, "getFavorToDonate"));
      return Math.floor(CONSTANTS.BaseFavorToDonate * BitNodeMultipliers.RepToDonateToFaction);
    },
    getOwnedSourceFiles: function (): SourceFileLvl[] {
      updateDynamicRam("getOwnedSourceFiles", getRamCost(Player, "getOwnedSourceFiles"));
      const res: SourceFileLvl[] = [];
      for (let i = 0; i < Player.sourceFiles.length; ++i) {
        res.push({
          n: Player.sourceFiles[i].n,
          lvl: Player.sourceFiles[i].lvl,
        } as SourceFileLvl);
      }
      return res;
    },
    getPlayer: function (): INetscriptPlayer {
      updateDynamicRam("getPlayer", getRamCost(Player, "getPlayer"));

      const managerCopy = Player.workManager.toPlayerSafe();

      const gains = managerCopy.gains,
        rates = managerCopy.rates;

      const data = {
        hacking: Player.hacking,
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
        money: Player.money,
        city: Player.city,
        location: Player.location,
        crime_money_mult: Player.crime_money_mult,
        crime_success_mult: Player.crime_success_mult,
        isWorking: Player.isWorking,

        workType: managerCopy.workType,
        companyName: Player.getCompanyName(),
        currentWorkFactionName: managerCopy.faction.factionName,
        currentWorkFactionDescription: managerCopy.faction.jobDescription,
        workHackExpGainRate: rates.hackExp,
        workStrExpGainRate: rates.strExp,
        workDefExpGainRate: rates.defExp,
        workDexExpGainRate: rates.dexExp,
        workAgiExpGainRate: rates.agiExp,
        workChaExpGainRate: rates.chaExp,
        workRepGainRate: rates.rep,
        workMoneyGainRate: rates.money,
        workMoneyLossRate: rates.moneyLoss,
        workHackExpGained: gains.hackExp,
        workStrExpGained: gains.strExp,
        workDefExpGained: gains.defExp,
        workDexExpGained: gains.dexExp,
        workAgiExpGained: gains.agiExp,
        workChaExpGained: gains.chaExp,
        workRepGained: gains.rep,
        workMoneyGained: gains.money,
        createProgramName: managerCopy.createProgram.programName,
        createProgramReqLvl: managerCopy.createProgram.requiredLevel,
        className: managerCopy.studyClass.className,
        crimeType: managerCopy.crime.crimeType,

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
        inBladeburner: Player.inBladeburner(),
        hasCorporation: Player.hasCorporation(),
        entropy: Player.entropy,

        work: managerCopy,
      };
      Object.assign(data.jobs, Player.jobs);
      return data;
    },
    atExit: function (f: any): void {
      updateDynamicRam("atExit", getRamCost(Player, "atExit"));
      if (typeof f !== "function") {
        throw makeRuntimeErrorMsg("atExit", "argument should be function");
      }
      workerScript.atExit = () => {
        f();
      }; // Wrap the user function to prevent WorkerScript leaking as 'this'
    },
    mv: function (_host: unknown, _source: unknown, _destination: unknown): void {
      updateDynamicRam("mv", getRamCost(Player, "mv"));
      const host = helper.string("mv", "host", _host);
      const source = helper.string("mv", "source", _source);
      const destination = helper.string("mv", "destination", _destination);

      if (!isValidFilePath(source)) throw makeRuntimeErrorMsg("mv", `Invalid filename: '${source}'`);
      if (!isValidFilePath(destination)) throw makeRuntimeErrorMsg("mv", `Invalid filename: '${destination}'`);

      const source_is_txt = source.endsWith(".txt");
      const dest_is_txt = destination.endsWith(".txt");

      if (!isScriptFilename(source) && !source_is_txt)
        throw makeRuntimeErrorMsg("mv", `'mv' can only be used on scripts and text files (.txt)`);
      if (source_is_txt != dest_is_txt)
        throw makeRuntimeErrorMsg("mv", `Source and destination files must have the same type`);

      if (source === destination) {
        return;
      }

      // This will throw if the server is not found, we do not need to validate result.
      const destServer: BaseServer | null = safeGetServer(host, "mv");

      if (!source_is_txt && destServer.isRunning(source))
        throw makeRuntimeErrorMsg("mv", `Cannot use 'mv' on a script that is running`);

      interface File {
        filename: string;
      }

      const files = source_is_txt ? destServer.textFiles : destServer.scripts;
      let source_file: File | null = null;
      let dest_file: File | null = null;

      for (let i = 0; i < files.length; ++i) {
        const file = files[i];
        if (file.filename === source) {
          source_file = file;
        } else if (file.filename === destination) {
          dest_file = file;
        }
      }

      if (source_file == null) throw makeRuntimeErrorMsg("mv", `Source file ${source} does not exist`);

      if (dest_file != null) {
        if (dest_file instanceof TextFile && source_file instanceof TextFile) {
          dest_file.text = source_file.text;
        } else if (dest_file instanceof Script && source_file instanceof Script) {
          dest_file.code = source_file.code;
          dest_file.markUpdated();
        }

        destServer.removeFile(source);
      } else {
        source_file.filename = destination;
        if (source_file instanceof Script) {
          source_file.markUpdated();
        }
      }
    },
    flags: Flags(workerScript.args),
    enums: {
      toast: ToastVariant,
    },
  };

  // add undocumented functions
  const ns = {
    ...base,
    ...extra,
  };
  function getFunctionNames(obj: any, prefix: string): string[] {
    const functionNames: string[] = [];
    for (const [key, value] of Object.entries(obj)) {
      if (key === "args") {
        continue;
      } else if (typeof value == "function") {
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
