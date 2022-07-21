import $ from "jquery";
import { vsprintf, sprintf } from "sprintf-js";

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
  numCycleForGrowthCorrected,
  processSingleServerGrowth,
  safetlyCreateUniqueServer,
} from "./Server/ServerHelpers";
import { getPurchaseServerCost, getPurchaseServerLimit, getPurchaseServerMaxRam } from "./Server/ServerPurchases";
import { Server } from "./Server/Server";
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

import { LogBoxEvents, LogBoxCloserEvents } from "./ui/React/LogBoxManager";
import { arrayToString } from "./utils/helpers/arrayToString";
import { isString } from "./utils/helpers/isString";
import { FormulaGang as FormulaGang } from "./Gang/formulas/formulas";

import { BaseServer } from "./Server/BaseServer";
import { NetscriptGang } from "./NetscriptFunctions/Gang";
import { NetscriptSleeve } from "./NetscriptFunctions/Sleeve";
import { NetscriptExtra } from "./NetscriptFunctions/Extra";
import { NetscriptHacknet } from "./NetscriptFunctions/Hacknet";
import { NetscriptStanek } from "./NetscriptFunctions/Stanek";
import { NetscriptInfiltration } from "./NetscriptFunctions/Infiltration";
import { NetscriptUserInterface } from "./NetscriptFunctions/UserInterface";
import { NetscriptBladeburner } from "./NetscriptFunctions/Bladeburner";
import { NetscriptCodingContract } from "./NetscriptFunctions/CodingContract";
import { NetscriptCorporation } from "./NetscriptFunctions/Corporation";
import { NetscriptFormulas } from "./NetscriptFunctions/Formulas";
import { NetscriptStockMarket } from "./NetscriptFunctions/StockMarket";
import { NetscriptGrafting } from "./NetscriptFunctions/Grafting";
import { IPort } from "./NetscriptPort";

import {
  NS as INS,
  Player as INetscriptPlayer,
  Gang as IGang,
  Bladeburner as IBladeburner,
  Stanek as IStanek,
  Infiltration as IInfiltration,
  RunningScript as IRunningScript,
  RecentScript as IRecentScript,
  SourceFileLvl,
  BasicHGWOptions,
  ProcessInfo,
  HackingMultipliers,
  HacknetMultipliers,
  BitNodeMultipliers as IBNMults,
  Server as IServerDef,
  RunningScript as IRunningScriptDef,
  // ToastVariant,
} from "./ScriptEditor/NetscriptDefinitions";
import { NetscriptSingularity } from "./NetscriptFunctions/Singularity";

import { toNative } from "./NetscriptFunctions/toNative";

import { dialogBoxCreate } from "./ui/React/DialogBox";
import { SnackbarEvents, ToastVariant } from "./ui/React/Snackbar";
import { checkEnum } from "./utils/helpers/checkEnum";

import { Flags } from "./NetscriptFunctions/Flags";
import { calculateIntelligenceBonus } from "./PersonObjects/formulas/intelligence";
import { CalculateShareMult, StartSharing } from "./NetworkShare/Share";
import { recentScripts } from "./Netscript/RecentScripts";
import { CityName } from "./Locations/data/CityNames";
import { InternalAPI, NetscriptContext, wrapAPI } from "./Netscript/APIWrapper";
import { INetscriptHelper, ScriptIdentifier } from "./NetscriptFunctions/INetscriptHelper";
import { IPlayer } from "./PersonObjects/IPlayer";
import { GangMember } from "./Gang/GangMember";
import { GangMemberTask } from "./Gang/GangMemberTask";
import { ScriptArg } from "./Netscript/ScriptArg";

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
  const safeGetServer = function (hostname: string, ctx: NetscriptContext): BaseServer {
    const server = GetServer(hostname);
    if (server == null) {
      throw ctx.makeRuntimeErrorMsg(`Invalid hostname: ${hostname}`);
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
  const getRunningScriptByArgs = function (
    ctx: NetscriptContext,
    fn: string,
    hostname: string,
    scriptArgs: ScriptArg[],
  ): RunningScript | null {
    if (!Array.isArray(scriptArgs)) {
      throw makeRuntimeRejectMsg(
        workerScript,
        `Invalid scriptArgs argument passed into getRunningScript() from ${ctx.function}(). ` +
          `This is probably a bug. Please report to game developer`,
      );
    }

    if (fn != null && typeof fn === "string") {
      // Get Logs of another script
      if (hostname == null) {
        hostname = workerScript.hostname;
      }
      const server = safeGetServer(hostname, ctx);

      return findRunningScript(fn, scriptArgs, server);
    }

    // If no arguments are specified, return the current RunningScript
    return workerScript.scriptRef;
  };

  const getRunningScriptByPid = function (pid: number): RunningScript | null {
    for (const server of GetAllServers()) {
      const runningScript = findRunningScriptByPid(pid, server);
      if (runningScript) return runningScript;
    }
    return null;
  };

  const getRunningScript = (ctx: NetscriptContext, ident: ScriptIdentifier): RunningScript | null => {
    if (typeof ident === "number") {
      return getRunningScriptByPid(ident);
    } else {
      return getRunningScriptByArgs(ctx, ident.fn, ident.hostname, ident.args);
    }
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
  const getCannotFindRunningScriptErrorMessage = function (ident: ScriptIdentifier): string {
    if (typeof ident === "number") return `Cannot find running script with pid: ${ident}`;

    return `Cannot find running script ${ident.fn} on server ${ident.hostname} with args: ${arrayToString(ident.args)}`;
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

  const hack = async function (
    ctx: NetscriptContext,
    hostname: string,
    manual: boolean,
    { threads: requestedThreads, stock }: BasicHGWOptions = {},
  ): Promise<number> {
    if (hostname === undefined) {
      throw ctx.makeRuntimeErrorMsg("Takes 1 argument.");
    }
    const threads = resolveNetscriptRequestedThreads(ctx, requestedThreads);
    const server = safeGetServer(hostname, ctx);
    if (!(server instanceof Server)) {
      throw ctx.makeRuntimeErrorMsg("Cannot be executed on this server.");
    }

    // Calculate the hacking time
    const hackingTime = calculateHackingTime(server, Player); // This is in seconds

    // No root access or skill level too low
    const canHack = netscriptCanHack(server, Player);
    if (!canHack.res) {
      throw ctx.makeRuntimeErrorMsg(canHack.msg || "");
    }

    ctx.log(
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

        let moneyGained = moneyDrained * BitNodeMultipliers.ScriptHackMoneyGain;
        if (manual) {
          moneyGained = moneyDrained * BitNodeMultipliers.ManualHackMoney;
        }

        Player.gainMoney(moneyGained, "hacking");
        workerScript.scriptRef.onlineMoneyMade += moneyGained;
        Player.scriptProdSinceLastAug += moneyGained;
        workerScript.scriptRef.recordHack(server.hostname, moneyGained, threads);
        Player.gainHackingExp(expGainedOnSuccess);
        if (manual) Player.gainIntelligenceExp(0.005);
        workerScript.scriptRef.onlineExpGained += expGainedOnSuccess;
        ctx.log(
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
        ctx.log(
          () =>
            `Failed to hack '${server.hostname}'. Gained ${numeralWrapper.formatExp(
              expGainedOnFailure,
            )} exp (t=${numeralWrapper.formatThreads(threads)})`,
        );
        return Promise.resolve(0);
      }
    });
  };

  const argsToString = function (args: unknown[]): string {
    let out = "";
    for (let arg of args) {
      arg = toNative(arg);
      out += typeof arg === "object" ? JSON.stringify(arg) : `${arg}`;
    }

    return out;
  };

  const roughlyIs = (expect: object, actual: unknown): boolean => {
    console.log(expect);
    console.log(actual);

    if (typeof actual !== "object" || actual == null) return false;
    const expects = Object.keys(expect);
    const actuals = Object.keys(actual);
    for (const expect of expects)
      if (!actuals.includes(expect)) {
        console.log(expect);
        return false;
      }
    return true;
  };

  const helperString = (funcName: string, argName: string, v: unknown): string => {
    if (typeof v === "string") return v;
    if (typeof v === "number") return v + ""; // cast to string;
    throw makeRuntimeErrorMsg(funcName, `'${argName}' should be a string.`);
  };
  const helperNumber = (funcName: string, argName: string, v: unknown): number => {
    if (typeof v === "string") {
      const x = parseFloat(v);
      if (!isNaN(x)) return x; // otherwise it wasn't even a string representing a number.
    } else if (typeof v === "number") {
      if (isNaN(v)) throw makeRuntimeErrorMsg(funcName, `'${argName}' is NaN.`);
      return v;
    }
    throw makeRuntimeErrorMsg(funcName, `'${argName}' should be a number.`);
  };

  const isScriptArgs = (_args: unknown): _args is ScriptArg[] =>
    Array.isArray(_args) &&
    _args.every((a) => typeof a === "string" || typeof a === "number" || typeof a === "boolean");

  const helperScriptArgs = (funcName: string, args: unknown): ScriptArg[] => {
    if (!isScriptArgs(args)) throw makeRuntimeErrorMsg(funcName, "'args' is not an array of script args");
    return args as ScriptArg[];
  };

  const helper: INetscriptHelper = {
    updateDynamicRam: updateDynamicRam,
    makeRuntimeErrorMsg: makeRuntimeErrorMsg,
    string: helperString,
    number: helperNumber,
    ustring: (funcName: string, argName: string, v: unknown): string | undefined => {
      if (v === undefined) return undefined;
      return helperString(funcName, argName, v);
    },
    unumber: (funcName: string, argName: string, v: unknown): number | undefined => {
      if (v === undefined) return undefined;
      return helperNumber(funcName, argName, v);
    },
    scriptArgs: helperScriptArgs,
    scriptIdentifier: (funcName: string, _fn: unknown, _hostname: unknown, _args: unknown): ScriptIdentifier => {
      if (_fn === undefined) return workerScript.pid;
      if (typeof _fn === "number") return _fn;
      if (typeof _fn === "string") {
        const hostname = _hostname != undefined ? helperString(funcName, "hostname", _hostname) : workerScript.hostname;
        if (!isScriptArgs(_args)) throw makeRuntimeErrorMsg(funcName, "'args' is not an array of script args");
        return {
          fn: _fn,
          hostname: hostname,
          args: _args,
        };
      }
      throw new Error("not implemented");
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
    player(funcName: string, p: unknown): IPlayer {
      const fakePlayer = {
        hacking: undefined,
        hp: undefined,
        max_hp: undefined,
        strength: undefined,
        defense: undefined,
        dexterity: undefined,
        agility: undefined,
        charisma: undefined,
        intelligence: undefined,
        hacking_exp: undefined,
        strength_exp: undefined,
        defense_exp: undefined,
        dexterity_exp: undefined,
        agility_exp: undefined,
        charisma_exp: undefined,
        hacking_chance_mult: undefined,
        mults: undefined,
        numPeopleKilled: undefined,
        money: undefined,
        city: undefined,
        location: undefined,
        hasWseAccount: undefined,
        hasTixApiAccess: undefined,
        has4SData: undefined,
        has4SDataTixApi: undefined,
        bitNodeN: undefined,
        totalPlaytime: undefined,
        playtimeSinceLastAug: undefined,
        playtimeSinceLastBitnode: undefined,
        jobs: undefined,
        factions: undefined,
        tor: undefined,
        inBladeburner: undefined,
        hasCorporation: undefined,
        entropy: undefined,
      };
      if (!roughlyIs(fakePlayer, p)) throw makeRuntimeErrorMsg(funcName, `player should be a Player.`);
      return p as IPlayer;
    },
    server(funcName: string, s: unknown): Server {
      if (!roughlyIs(new Server(), s)) throw makeRuntimeErrorMsg(funcName, `server should be a Server.`);
      return s as Server;
    },
    gang(funcName: string, g: unknown): FormulaGang {
      if (!roughlyIs({ respect: 0, territory: 0, wantedLevel: 0 }, g))
        throw makeRuntimeErrorMsg(funcName, `gang should be a Gang.`);
      return g as FormulaGang;
    },
    gangMember(funcName: string, m: unknown): GangMember {
      if (!roughlyIs(new GangMember(), m)) throw makeRuntimeErrorMsg(funcName, `member should be a GangMember.`);
      return m as GangMember;
    },
    gangTask(funcName: string, t: unknown): GangMemberTask {
      if (!roughlyIs(new GangMemberTask("", "", false, false, {}), t))
        throw makeRuntimeErrorMsg(funcName, `task should be a GangMemberTask.`);
      return t as GangMemberTask;
    },
  };

  const singularity = NetscriptSingularity(Player, workerScript);
  const base: InternalAPI<INS> = {
    args: workerScript.args as unknown as any,
    enums: {
      toast: ToastVariant,
    } as unknown as any,

    singularity: singularity,
    gang: NetscriptGang(Player, workerScript),
    bladeburner: NetscriptBladeburner(Player, workerScript),
    codingcontract: NetscriptCodingContract(Player, workerScript),
    sleeve: NetscriptSleeve(Player),
    corporation: NetscriptCorporation(Player),
    stanek: NetscriptStanek(Player, workerScript, helper),
    infiltration: NetscriptInfiltration(Player),
    ui: NetscriptUserInterface(),
    formulas: NetscriptFormulas(Player, helper),
    stock: NetscriptStockMarket(Player, workerScript),
    grafting: NetscriptGrafting(Player),
    hacknet: NetscriptHacknet(Player, workerScript),
    sprintf: () => sprintf,
    vsprintf: () => vsprintf,
    scan:
      (ctx: NetscriptContext) =>
      (_hostname: unknown = workerScript.hostname): string[] => {
        const hostname = ctx.helper.string("hostname", _hostname);
        const server = safeGetServer(hostname, ctx);
        const out = [];
        for (let i = 0; i < server.serversOnNetwork.length; i++) {
          const s = getServerOnNetwork(server, i);
          if (s === null) continue;
          const entry = s.hostname;
          if (entry === null) continue;
          out.push(entry);
        }
        ctx.log(() => `returned ${server.serversOnNetwork.length} connections for ${server.hostname}`);
        return out;
      },
    hack:
      (ctx: NetscriptContext) =>
      (_hostname: unknown, { threads: requestedThreads, stock }: BasicHGWOptions = {}): Promise<number> => {
        const hostname = ctx.helper.string("hostname", _hostname);
        return hack(ctx, hostname, false, { threads: requestedThreads, stock: stock });
      },
    hackAnalyzeThreads:
      (ctx: NetscriptContext) =>
      (_hostname: unknown, _hackAmount: unknown): number => {
        const hostname = ctx.helper.string("hostname", _hostname);
        const hackAmount = ctx.helper.number("hackAmount", _hackAmount);

        // Check argument validity
        const server = safeGetServer(hostname, ctx);
        if (!(server instanceof Server)) {
          ctx.log(() => "Cannot be executed on this server.");
          return -1;
        }
        if (isNaN(hackAmount)) {
          throw ctx.makeRuntimeErrorMsg(
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
    hackAnalyze:
      (ctx: NetscriptContext) =>
      (_hostname: unknown): number => {
        const hostname = ctx.helper.string("hostname", _hostname);

        const server = safeGetServer(hostname, ctx);
        if (!(server instanceof Server)) {
          ctx.log(() => "Cannot be executed on this server.");
          return 0;
        }

        return calculatePercentMoneyHacked(server, Player);
      },
    hackAnalyzeSecurity:
      (ctx: NetscriptContext) =>
      (_threads: unknown, _hostname?: unknown): number => {
        let threads = ctx.helper.number("threads", _threads);
        if (_hostname) {
          const hostname = ctx.helper.string("hostname", _hostname);
          const server = safeGetServer(hostname, ctx);
          if (!(server instanceof Server)) {
            ctx.log(() => "Cannot be executed on this server.");
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
    hackAnalyzeChance:
      (ctx: NetscriptContext) =>
      (_hostname: unknown): number => {
        const hostname = ctx.helper.string("hostname", _hostname);

        const server = safeGetServer(hostname, ctx);
        if (!(server instanceof Server)) {
          ctx.log(() => "Cannot be executed on this server.");
          return 0;
        }

        return calculateHackingChance(server, Player);
      },
    sleep:
      (ctx: NetscriptContext) =>
      async (_time: unknown = 0): Promise<true> => {
        const time = ctx.helper.number("time", _time);
        if (time === undefined) {
          throw ctx.makeRuntimeErrorMsg("Takes 1 argument.");
        }
        ctx.log(() => `Sleeping for ${time} milliseconds`);
        return netscriptDelay(time, workerScript).then(function () {
          return Promise.resolve(true);
        });
      },
    asleep: (ctx: NetscriptContext) =>
      function (_time: unknown = 0): Promise<true> {
        const time = ctx.helper.number("time", _time);
        ctx.log(() => `Sleeping for ${time} milliseconds`);
        return new Promise((resolve) => setTimeout(() => resolve(true), time));
      },
    grow:
      (ctx: NetscriptContext) =>
      async (_hostname: unknown, { threads: requestedThreads, stock }: BasicHGWOptions = {}): Promise<number> => {
        const hostname = ctx.helper.string("hostname", _hostname);
        const threads = resolveNetscriptRequestedThreads(ctx, requestedThreads ?? workerScript.scriptRef.threads);

        const server = safeGetServer(hostname, ctx);
        if (!(server instanceof Server)) {
          ctx.log(() => "Cannot be executed on this server.");
          return Promise.resolve(0);
        }

        const host = GetServer(workerScript.hostname);
        if (host === null) {
          throw new Error("Workerscript host is null");
        }

        // No root access or skill level too low
        const canHack = netscriptCanGrow(server);
        if (!canHack.res) {
          throw ctx.makeRuntimeErrorMsg(canHack.msg || "");
        }

        const growTime = calculateGrowTime(server, Player);
        ctx.log(
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
          ctx.log(
            () =>
              `Available money on '${server.hostname}' grown by ${numeralWrapper.formatPercentage(
                logGrowPercent,
                6,
              )}. Gained ${numeralWrapper.formatExp(expGain)} hacking exp (t=${numeralWrapper.formatThreads(
                threads,
              )}).`,
          );
          workerScript.scriptRef.onlineExpGained += expGain;
          Player.gainHackingExp(expGain);
          if (stock) {
            influenceStockThroughServerGrow(server, moneyAfter - moneyBefore);
          }
          return Promise.resolve(moneyAfter / moneyBefore);
        });
      },
    growthAnalyze:
      (ctx: NetscriptContext) =>
      (_hostname: unknown, _growth: unknown, _cores: unknown = 1): number => {
        const hostname = ctx.helper.string("hostname", _hostname);
        const growth = ctx.helper.number("growth", _growth);
        const cores = ctx.helper.number("cores", _cores);

        // Check argument validity
        const server = safeGetServer(hostname, ctx);
        if (!(server instanceof Server)) {
          ctx.log(() => "Cannot be executed on this server.");
          return 0;
        }
        if (typeof growth !== "number" || isNaN(growth) || growth < 1 || !isFinite(growth)) {
          throw ctx.makeRuntimeErrorMsg(`Invalid argument: growth must be numeric and >= 1, is ${growth}.`);
        }

        return numCycleForGrowth(server, Number(growth), Player, cores);
      },
    growthAnalyzeSecurity:
      (ctx: NetscriptContext) =>
      (_threads: unknown, _hostname?: unknown, _cores?: unknown): number => {
        let threads = ctx.helper.number("threads", _threads);
        if (_hostname) {
          const cores = ctx.helper.number("cores", _cores) || 1;
          const hostname = ctx.helper.string("hostname", _hostname);
          const server = safeGetServer(hostname, ctx);

          if (!(server instanceof Server)) {
            ctx.log(() => "Cannot be executed on this server.");
            return 0;
          }

          const maxThreadsNeeded = Math.ceil(
            numCycleForGrowthCorrected(server, server.moneyMax, server.moneyAvailable, Player, cores),
          );

          threads = Math.min(threads, maxThreadsNeeded);
        }

        return 2 * CONSTANTS.ServerFortifyAmount * threads;
      },
    weaken:
      (ctx: NetscriptContext) =>
      async (_hostname: unknown, { threads: requestedThreads }: BasicHGWOptions = {}): Promise<number> => {
        const hostname = ctx.helper.string("hostname", _hostname);
        const threads = resolveNetscriptRequestedThreads(ctx, requestedThreads ?? workerScript.scriptRef.threads);
        if (hostname === undefined) {
          throw ctx.makeRuntimeErrorMsg("Takes 1 argument.");
        }
        const server = safeGetServer(hostname, ctx);
        if (!(server instanceof Server)) {
          ctx.log(() => "Cannot be executed on this server.");
          return Promise.resolve(0);
        }

        // No root access or skill level too low
        const canHack = netscriptCanWeaken(server);
        if (!canHack.res) {
          throw ctx.makeRuntimeErrorMsg(canHack.msg || "");
        }

        const weakenTime = calculateWeakenTime(server, Player);
        ctx.log(
          () =>
            `Executing on '${server.hostname}' in ${convertTimeMsToTimeElapsedString(
              weakenTime * 1000,
              true,
            )} (t=${numeralWrapper.formatThreads(threads)})`,
        );
        return netscriptDelay(weakenTime * 1000, workerScript).then(function () {
          const host = GetServer(workerScript.hostname);
          if (host === null) {
            ctx.log(() => "Server is null, did it die?");
            return Promise.resolve(0);
          }
          const coreBonus = 1 + (host.cpuCores - 1) / 16;
          server.weaken(CONSTANTS.ServerWeakenAmount * threads * coreBonus);
          workerScript.scriptRef.recordWeaken(server.hostname, threads);
          const expGain = calculateHackingExpGain(server, Player) * threads;
          ctx.log(
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
    weakenAnalyze:
      (ctx: NetscriptContext) =>
      (_threads: unknown, _cores: unknown = 1): number => {
        const threads = ctx.helper.number("threads", _threads);
        const cores = ctx.helper.number("cores", _cores);
        const coreBonus = 1 + (cores - 1) / 16;
        return CONSTANTS.ServerWeakenAmount * threads * coreBonus * BitNodeMultipliers.ServerWeakenRate;
      },
    share: (ctx: NetscriptContext) => async (): Promise<void> => {
      ctx.log(() => "Sharing this computer.");
      const end = StartSharing(workerScript.scriptRef.threads * calculateIntelligenceBonus(Player.intelligence, 2));
      return netscriptDelay(10000, workerScript).finally(function () {
        ctx.log(() => "Finished sharing this computer.");
        end();
      });
    },
    getSharePower: () => (): number => {
      return CalculateShareMult();
    },
    print:
      (ctx: NetscriptContext) =>
      (...args: unknown[]): void => {
        if (args.length === 0) {
          throw ctx.makeRuntimeErrorMsg("Takes at least 1 argument.");
        }
        workerScript.print(argsToString(args));
      },
    printf:
      (ctx: NetscriptContext) =>
      (_format: unknown, ...args: unknown[]): void => {
        const format = ctx.helper.string("format", _format);
        if (typeof format !== "string") {
          throw ctx.makeRuntimeErrorMsg("First argument must be string for the format.");
        }
        workerScript.print(vsprintf(format, args));
      },
    tprint:
      (ctx: NetscriptContext) =>
      (...args: unknown[]): void => {
        if (args.length === 0) {
          throw ctx.makeRuntimeErrorMsg("Takes at least 1 argument.");
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
    tprintf:
      (ctx: NetscriptContext) =>
      (_format: unknown, ...args: unknown[]): void => {
        const format = ctx.helper.string("format", _format);
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
    clearLog: () => (): void => {
      workerScript.scriptRef.clearLog();
    },
    disableLog:
      (ctx: NetscriptContext) =>
      (_fn: unknown): void => {
        const fn = ctx.helper.string("fn", _fn);
        if (fn === "ALL") {
          for (const fn of Object.keys(possibleLogs)) {
            workerScript.disableLogs[fn] = true;
          }
          ctx.log(() => `Disabled logging for all functions`);
        } else if (possibleLogs[fn] === undefined) {
          throw ctx.makeRuntimeErrorMsg(`Invalid argument: ${fn}.`);
        } else {
          workerScript.disableLogs[fn] = true;
          ctx.log(() => `Disabled logging for ${fn}`);
        }
      },
    enableLog:
      (ctx: NetscriptContext) =>
      (_fn: unknown): void => {
        const fn = ctx.helper.string("fn", _fn);
        if (fn === "ALL") {
          for (const fn of Object.keys(possibleLogs)) {
            delete workerScript.disableLogs[fn];
          }
          ctx.log(() => `Enabled logging for all functions`);
        } else if (possibleLogs[fn] === undefined) {
          throw ctx.makeRuntimeErrorMsg(`Invalid argument: ${fn}.`);
        }
        delete workerScript.disableLogs[fn];
        ctx.log(() => `Enabled logging for ${fn}`);
      },
    isLogEnabled:
      (ctx: NetscriptContext) =>
      (_fn: unknown): boolean => {
        const fn = ctx.helper.string("fn", _fn);
        if (possibleLogs[fn] === undefined) {
          throw ctx.makeRuntimeErrorMsg(`Invalid argument: ${fn}.`);
        }
        return !workerScript.disableLogs[fn];
      },
    getScriptLogs:
      (ctx: NetscriptContext) =>
      (fn: unknown, hostname: unknown, ...scriptArgs: unknown[]): string[] => {
        const ident = ctx.helper.scriptIdentifier(fn, hostname, scriptArgs);
        const runningScriptObj = getRunningScript(ctx, ident);
        if (runningScriptObj == null) {
          ctx.log(() => getCannotFindRunningScriptErrorMessage(ident));
          return [];
        }

        return runningScriptObj.logs.slice();
      },
    tail:
      (ctx: NetscriptContext) =>
      (fn: unknown, hostname: unknown, ...scriptArgs: unknown[]): void => {
        const ident = ctx.helper.scriptIdentifier(fn, hostname, scriptArgs);
        const runningScriptObj = getRunningScript(ctx, ident);
        if (runningScriptObj == null) {
          ctx.log(() => getCannotFindRunningScriptErrorMessage(ident));
          return;
        }

        LogBoxEvents.emit(runningScriptObj);
      },

    closeTail:
      (ctx: NetscriptContext) =>
      (_pid: unknown = workerScript.scriptRef.pid): void => {
        const pid = ctx.helper.number("pid", _pid);
        //Emit an event to tell the game to close the tail window if it exists
        LogBoxCloserEvents.emit(pid);
      },
    nuke:
      (ctx: NetscriptContext) =>
      (_hostname: unknown): boolean => {
        const hostname = ctx.helper.string("hostname", _hostname);

        const server = safeGetServer(hostname, ctx);
        if (!(server instanceof Server)) {
          ctx.log(() => "Cannot be executed on this server.");
          return false;
        }
        if (server.hasAdminRights) {
          ctx.log(() => `Already have root access to '${server.hostname}'.`);
          return true;
        }
        if (!Player.hasProgram(Programs.NukeProgram.name)) {
          throw ctx.makeRuntimeErrorMsg("You do not have the NUKE.exe virus!");
        }
        if (server.openPortCount < server.numOpenPortsRequired) {
          throw ctx.makeRuntimeErrorMsg("Not enough ports opened to use NUKE.exe virus.");
        }
        server.hasAdminRights = true;
        ctx.log(() => `Executed NUKE.exe virus on '${server.hostname}' to gain root access.`);
        return true;
      },
    brutessh:
      (ctx: NetscriptContext) =>
      (_hostname: unknown): boolean => {
        const hostname = ctx.helper.string("hostname", _hostname);
        const server = safeGetServer(hostname, ctx);
        if (!(server instanceof Server)) {
          ctx.log(() => "Cannot be executed on this server.");
          return false;
        }
        if (!Player.hasProgram(Programs.BruteSSHProgram.name)) {
          throw ctx.makeRuntimeErrorMsg("You do not have the BruteSSH.exe program!");
        }
        if (!server.sshPortOpen) {
          ctx.log(() => `Executed BruteSSH.exe on '${server.hostname}' to open SSH port (22).`);
          server.sshPortOpen = true;
          ++server.openPortCount;
        } else {
          ctx.log(() => `SSH Port (22) already opened on '${server.hostname}'.`);
        }
        return true;
      },
    ftpcrack:
      (ctx: NetscriptContext) =>
      (_hostname: unknown): boolean => {
        const hostname = ctx.helper.string("hostname", _hostname);
        if (hostname === undefined) {
          throw ctx.makeRuntimeErrorMsg("Takes 1 argument.");
        }
        const server = safeGetServer(hostname, ctx);
        if (!(server instanceof Server)) {
          ctx.log(() => "Cannot be executed on this server.");
          return false;
        }
        if (!Player.hasProgram(Programs.FTPCrackProgram.name)) {
          throw ctx.makeRuntimeErrorMsg("You do not have the FTPCrack.exe program!");
        }
        if (!server.ftpPortOpen) {
          ctx.log(() => `Executed FTPCrack.exe on '${server.hostname}' to open FTP port (21).`);
          server.ftpPortOpen = true;
          ++server.openPortCount;
        } else {
          ctx.log(() => `FTP Port (21) already opened on '${server.hostname}'.`);
        }
        return true;
      },
    relaysmtp:
      (ctx: NetscriptContext) =>
      (_hostname: unknown): boolean => {
        const hostname = ctx.helper.string("hostname", _hostname);
        if (hostname === undefined) {
          throw ctx.makeRuntimeErrorMsg("Takes 1 argument.");
        }
        const server = safeGetServer(hostname, ctx);
        if (!(server instanceof Server)) {
          ctx.log(() => "Cannot be executed on this server.");
          return false;
        }
        if (!Player.hasProgram(Programs.RelaySMTPProgram.name)) {
          throw ctx.makeRuntimeErrorMsg("You do not have the relaySMTP.exe program!");
        }
        if (!server.smtpPortOpen) {
          ctx.log(() => `Executed relaySMTP.exe on '${server.hostname}' to open SMTP port (25).`);
          server.smtpPortOpen = true;
          ++server.openPortCount;
        } else {
          ctx.log(() => `SMTP Port (25) already opened on '${server.hostname}'.`);
        }
        return true;
      },
    httpworm:
      (ctx: NetscriptContext) =>
      (_hostname: unknown): boolean => {
        const hostname = ctx.helper.string("hostname", _hostname);
        if (hostname === undefined) {
          throw ctx.makeRuntimeErrorMsg("Takes 1 argument");
        }
        const server = safeGetServer(hostname, ctx);
        if (!(server instanceof Server)) {
          ctx.log(() => "Cannot be executed on this server.");
          return false;
        }
        if (!Player.hasProgram(Programs.HTTPWormProgram.name)) {
          throw ctx.makeRuntimeErrorMsg("You do not have the HTTPWorm.exe program!");
        }
        if (!server.httpPortOpen) {
          ctx.log(() => `Executed HTTPWorm.exe on '${server.hostname}' to open HTTP port (80).`);
          server.httpPortOpen = true;
          ++server.openPortCount;
        } else {
          ctx.log(() => `HTTP Port (80) already opened on '${server.hostname}'.`);
        }
        return true;
      },
    sqlinject:
      (ctx: NetscriptContext) =>
      (_hostname: unknown): boolean => {
        const hostname = ctx.helper.string("hostname", _hostname);
        if (hostname === undefined) {
          throw ctx.makeRuntimeErrorMsg("Takes 1 argument.");
        }
        const server = safeGetServer(hostname, ctx);
        if (!(server instanceof Server)) {
          ctx.log(() => "Cannot be executed on this server.");
          return false;
        }
        if (!Player.hasProgram(Programs.SQLInjectProgram.name)) {
          throw ctx.makeRuntimeErrorMsg("You do not have the SQLInject.exe program!");
        }
        if (!server.sqlPortOpen) {
          ctx.log(() => `Executed SQLInject.exe on '${server.hostname}' to open SQL port (1433).`);
          server.sqlPortOpen = true;
          ++server.openPortCount;
        } else {
          ctx.log(() => `SQL Port (1433) already opened on '${server.hostname}'.`);
        }
        return true;
      },
    run:
      (ctx: NetscriptContext) =>
      (_scriptname: unknown, _threads: unknown = 1, ..._args: unknown[]): number => {
        const scriptname = ctx.helper.string("scriptname", _scriptname);
        const threads = ctx.helper.number("threads", _threads);
        const args = ctx.helper.scriptArgs(_args);
        if (scriptname === undefined) {
          throw ctx.makeRuntimeErrorMsg("Usage: run(scriptname, [numThreads], [arg1], [arg2]...)");
        }
        if (isNaN(threads) || threads <= 0) {
          throw ctx.makeRuntimeErrorMsg(`Invalid thread count. Must be numeric and > 0, is ${threads}`);
        }
        const scriptServer = GetServer(workerScript.hostname);
        if (scriptServer == null) {
          throw ctx.makeRuntimeErrorMsg("Could not find server. This is a bug. Report to dev.");
        }

        return runScriptFromScript(Player, "run", scriptServer, scriptname, args, workerScript, threads);
      },
    exec:
      (ctx: NetscriptContext) =>
      (_scriptname: unknown, _hostname: unknown, _threads: unknown = 1, ..._args: unknown[]): number => {
        const scriptname = ctx.helper.string("scriptname", _scriptname);
        const hostname = ctx.helper.string("hostname", _hostname);
        const threads = ctx.helper.number("threads", _threads);
        const args = ctx.helper.scriptArgs(_args);
        if (scriptname === undefined || hostname === undefined) {
          throw ctx.makeRuntimeErrorMsg("Usage: exec(scriptname, server, [numThreads], [arg1], [arg2]...)");
        }
        if (isNaN(threads) || threads <= 0) {
          throw ctx.makeRuntimeErrorMsg(`Invalid thread count. Must be numeric and > 0, is ${threads}`);
        }
        const server = safeGetServer(hostname, ctx);
        return runScriptFromScript(Player, "exec", server, scriptname, args, workerScript, threads);
      },
    spawn:
      (ctx: NetscriptContext) =>
      (_scriptname: unknown, _threads: unknown = 1, ..._args: unknown[]): void => {
        const scriptname = ctx.helper.string("scriptname", _scriptname);
        const threads = ctx.helper.number("threads", _threads);
        const args = ctx.helper.scriptArgs(_args);
        if (!scriptname || !threads) {
          throw ctx.makeRuntimeErrorMsg("Usage: spawn(scriptname, threads)");
        }

        const spawnDelay = 10;
        setTimeout(() => {
          if (isNaN(threads) || threads <= 0) {
            throw ctx.makeRuntimeErrorMsg(`Invalid thread count. Must be numeric and > 0, is ${threads}`);
          }
          const scriptServer = GetServer(workerScript.hostname);
          if (scriptServer == null) {
            throw ctx.makeRuntimeErrorMsg("Could not find server. This is a bug. Report to dev");
          }

          return runScriptFromScript(Player, "spawn", scriptServer, scriptname, args, workerScript, threads);
        }, spawnDelay * 1e3);

        ctx.log(() => `Will execute '${scriptname}' in ${spawnDelay} seconds`);

        workerScript.running = false; // Prevent workerScript from "finishing execution naturally"
        if (killWorkerScript(workerScript)) {
          ctx.log(() => "Exiting...");
        }
      },
    kill:
      (ctx: NetscriptContext) =>
      (filename: unknown, hostname: unknown, ...scriptArgs: unknown[]): boolean => {
        const ident = ctx.helper.scriptIdentifier(filename, hostname, scriptArgs);
        let res;
        const killByPid = typeof ident === "number";
        if (killByPid) {
          // Kill by pid
          res = killWorkerScript(ident);
        } else {
          // Kill by filename/hostname
          if (filename === undefined || hostname === undefined) {
            throw ctx.makeRuntimeErrorMsg("Usage: kill(scriptname, server, [arg1], [arg2]...)");
          }

          const server = safeGetServer(ident.hostname, ctx);
          const runningScriptObj = getRunningScriptByArgs(ctx, ident.fn, ident.hostname, ident.args);
          if (runningScriptObj == null) {
            ctx.log(() => getCannotFindRunningScriptErrorMessage(ident));
            return false;
          }

          res = killWorkerScript({ runningScript: runningScriptObj, hostname: server.hostname });
        }

        if (res) {
          if (killByPid) {
            ctx.log(() => `Killing script with PID ${ident}`);
          } else {
            ctx.log(() => `Killing '${filename}' on '${hostname}' with args: ${arrayToString(scriptArgs)}.`);
          }
          return true;
        } else {
          if (killByPid) {
            ctx.log(() => `No script with PID ${ident}`);
          } else {
            ctx.log(() => `No such script '${filename}' on '${hostname}' with args: ${arrayToString(scriptArgs)}`);
          }
          return false;
        }
      },
    killall:
      (ctx: NetscriptContext) =>
      (_hostname: unknown = workerScript.hostname, _safetyguard: unknown = true): boolean => {
        const hostname = ctx.helper.string("hostname", _hostname);
        const safetyguard = helper.boolean(_safetyguard);
        if (hostname === undefined) {
          throw ctx.makeRuntimeErrorMsg("Usage: killall(hostname, [safetyguard boolean])");
        }
        const server = safeGetServer(hostname, ctx);

        let scriptsKilled = 0;

        for (let i = server.runningScripts.length - 1; i >= 0; --i) {
          if (safetyguard === true && server.runningScripts[i].pid == workerScript.pid) continue;
          killWorkerScript({ runningScript: server.runningScripts[i], hostname: server.hostname });
          ++scriptsKilled;
        }
        WorkerScriptStartStopEventEmitter.emit();
        ctx.log(() => `Killing all scripts on '${server.hostname}'. May take a few minutes for the scripts to die.`);

        return scriptsKilled > 0;
      },
    exit: (ctx: NetscriptContext) => (): void => {
      workerScript.running = false; // Prevent workerScript from "finishing execution naturally"
      if (killWorkerScript(workerScript)) {
        ctx.log(() => "Exiting...");
      } else {
        ctx.log(() => "Failed. This is a bug. Report to dev.");
      }
    },
    scp:
      (ctx: NetscriptContext) =>
      async (
        _scriptname: unknown,
        _destination: unknown,
        _source: unknown = workerScript.hostname,
      ): Promise<boolean> => {
        const destination = ctx.helper.string("destination", _destination);
        const source = ctx.helper.string("source", _source);
        if (Array.isArray(_scriptname)) {
          // Recursively call scp on all elements of array
          const scripts: string[] = _scriptname;
          if (scripts.length === 0) {
            throw ctx.makeRuntimeErrorMsg("No scripts to copy");
          }
          let res = true;
          await Promise.all(
            scripts.map(async function (script) {
              if (!(await NetscriptFunctions(workerScript).scp(script, destination, source))) {
                res = false;
              }
            }),
          );
          return Promise.resolve(res);
        }

        const scriptName = ctx.helper.string("scriptName", _scriptname);

        // Invalid file type
        if (!isValidFilePath(scriptName)) {
          throw ctx.makeRuntimeErrorMsg(`Invalid filename: '${scriptName}'`);
        }

        // Invalid file name
        if (!scriptName.endsWith(".lit") && !isScriptFilename(scriptName) && !scriptName.endsWith("txt")) {
          throw ctx.makeRuntimeErrorMsg("Only works for scripts, .lit and .txt files");
        }

        const destServer = safeGetServer(destination, ctx);
        const currServ = safeGetServer(source, ctx);

        // Scp for lit files
        if (scriptName.endsWith(".lit")) {
          let found = false;
          for (let i = 0; i < currServ.messages.length; ++i) {
            if (currServ.messages[i] == scriptName) {
              found = true;
              break;
            }
          }

          if (!found) {
            ctx.log(() => `File '${scriptName}' does not exist.`);
            return Promise.resolve(false);
          }

          for (let i = 0; i < destServer.messages.length; ++i) {
            if (destServer.messages[i] === scriptName) {
              ctx.log(() => `File '${scriptName}' copied over to '${destServer?.hostname}'.`);
              return Promise.resolve(true); // Already exists
            }
          }
          destServer.messages.push(scriptName);
          ctx.log(() => `File '${scriptName}' copied over to '${destServer?.hostname}'.`);
          return Promise.resolve(true);
        }

        // Scp for text files
        if (scriptName.endsWith(".txt")) {
          let txtFile;
          for (let i = 0; i < currServ.textFiles.length; ++i) {
            if (currServ.textFiles[i].fn === scriptName) {
              txtFile = currServ.textFiles[i];
              break;
            }
          }
          if (txtFile === undefined) {
            ctx.log(() => `File '${scriptName}' does not exist.`);
            return Promise.resolve(false);
          }

          for (let i = 0; i < destServer.textFiles.length; ++i) {
            if (destServer.textFiles[i].fn === scriptName) {
              // Overwrite
              destServer.textFiles[i].text = txtFile.text;
              ctx.log(() => `File '${scriptName}' copied over to '${destServer?.hostname}'.`);
              return Promise.resolve(true);
            }
          }
          const newFile = new TextFile(txtFile.fn, txtFile.text);
          destServer.textFiles.push(newFile);
          ctx.log(() => `File '${scriptName}' copied over to '${destServer?.hostname}'.`);
          return Promise.resolve(true);
        }

        // Scp for script files
        let sourceScript = null;
        for (let i = 0; i < currServ.scripts.length; ++i) {
          if (scriptName == currServ.scripts[i].filename) {
            sourceScript = currServ.scripts[i];
            break;
          }
        }
        if (sourceScript == null) {
          ctx.log(() => `File '${scriptName}' does not exist.`);
          return Promise.resolve(false);
        }

        // Overwrite script if it already exists
        for (let i = 0; i < destServer.scripts.length; ++i) {
          if (scriptName == destServer.scripts[i].filename) {
            ctx.log(() => `WARNING: File '${scriptName}' overwritten on '${destServer?.hostname}'`);
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
        const newScript = new Script(Player, scriptName);
        newScript.code = sourceScript.code;
        newScript.ramUsage = sourceScript.ramUsage;
        newScript.server = destServer.hostname;
        destServer.scripts.push(newScript);
        ctx.log(() => `File '${scriptName}' copied over to '${destServer?.hostname}'.`);
        return new Promise((resolve) => {
          if (destServer === null) {
            resolve(false);
            return;
          }
          newScript.updateRamUsage(Player, destServer.scripts).then(() => resolve(true));
        });
      },
    ls:
      (ctx: NetscriptContext) =>
      (_hostname: unknown, _grep: unknown = ""): string[] => {
        const hostname = ctx.helper.string("hostname", _hostname);
        const grep = ctx.helper.string("grep", _grep);

        const server = safeGetServer(hostname, ctx);

        // Get the grep filter, if one exists
        let filter = "";
        if (_grep !== undefined) {
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
    getRecentScripts: () => (): IRecentScript[] => {
      return recentScripts.map((rs) => ({
        timeOfDeath: rs.timeOfDeath,
        ...createPublicRunningScript(rs.runningScript),
      }));
    },
    ps:
      (ctx: NetscriptContext) =>
      (_hostname: unknown = workerScript.hostname): ProcessInfo[] => {
        const hostname = ctx.helper.string("hostname", _hostname);
        const server = safeGetServer(hostname, ctx);
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
    hasRootAccess:
      (ctx: NetscriptContext) =>
      (_hostname: unknown): boolean => {
        const hostname = ctx.helper.string("hostname", _hostname);

        const server = safeGetServer(hostname, ctx);
        return server.hasAdminRights;
      },
    getHostname: (ctx: NetscriptContext) => (): string => {
      const scriptServer = GetServer(workerScript.hostname);
      if (scriptServer == null) {
        throw ctx.makeRuntimeErrorMsg("Could not find server. This is a bug. Report to dev.");
      }
      return scriptServer.hostname;
    },
    getHackingLevel: (ctx: NetscriptContext) => (): number => {
      Player.updateSkillLevels();
      ctx.log(() => `returned ${Player.hacking}`);
      return Player.hacking;
    },
    getHackingMultipliers: () => (): HackingMultipliers => {
      return {
        chance: Player.mults.hacking_chance,
        speed: Player.mults.hacking_speed,
        money: Player.mults.hacking_money,
        growth: Player.mults.hacking_grow,
      };
    },
    getHacknetMultipliers: () => (): HacknetMultipliers => {
      return {
        production: Player.mults.hacknet_node_money,
        purchaseCost: Player.mults.hacknet_node_purchase_cost,
        ramCost: Player.mults.hacknet_node_ram_cost,
        coreCost: Player.mults.hacknet_node_core_cost,
        levelCost: Player.mults.hacknet_node_level_cost,
      };
    },
    getBitNodeMultipliers: (ctx: NetscriptContext) => (): IBNMults => {
      if (Player.sourceFileLvl(5) <= 0 && Player.bitNodeN !== 5) {
        throw ctx.makeRuntimeErrorMsg("Requires Source-File 5 to run.");
      }
      const copy = Object.assign({}, BitNodeMultipliers);
      return copy;
    },
    getServer:
      (ctx: NetscriptContext) =>
      (_hostname: unknown = workerScript.hostname): IServerDef => {
        const hostname = ctx.helper.string("hostname", _hostname);
        const server = safeGetServer(hostname, ctx);
        const copy = Object.assign({}, server) as Server;
        // These fields should be hidden.
        copy.contracts = [];
        copy.messages = [];
        copy.runningScripts = [];
        copy.scripts = [];
        copy.textFiles = [];
        copy.programs = [];
        copy.serversOnNetwork = [];
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
    getServerMoneyAvailable:
      (ctx: NetscriptContext) =>
      (_hostname: unknown): number => {
        const hostname = ctx.helper.string("hostname", _hostname);
        const server = safeGetServer(hostname, ctx);
        if (!(server instanceof Server)) {
          ctx.log(() => "Cannot be executed on this server.");
          return 0;
        }
        if (failOnHacknetServer(server, "getServerMoneyAvailable")) {
          return 0;
        }
        if (server.hostname == "home") {
          // Return player's money
          ctx.log(() => `returned player's money: ${numeralWrapper.formatMoney(Player.money)}`);
          return Player.money;
        }
        ctx.log(() => `returned ${numeralWrapper.formatMoney(server.moneyAvailable)} for '${server.hostname}'`);
        return server.moneyAvailable;
      },
    getServerSecurityLevel:
      (ctx: NetscriptContext) =>
      (_hostname: unknown): number => {
        const hostname = ctx.helper.string("hostname", _hostname);
        const server = safeGetServer(hostname, ctx);
        if (!(server instanceof Server)) {
          ctx.log(() => "Cannot be executed on this server.");
          return 1;
        }
        if (failOnHacknetServer(server, "getServerSecurityLevel")) {
          return 1;
        }
        ctx.log(
          () => `returned ${numeralWrapper.formatServerSecurity(server.hackDifficulty)} for '${server.hostname}'`,
        );
        return server.hackDifficulty;
      },
    getServerBaseSecurityLevel:
      (ctx: NetscriptContext) =>
      (_hostname: unknown): number => {
        const hostname = ctx.helper.string("hostname", _hostname);
        ctx.log(() => `getServerBaseSecurityLevel is deprecated because it's not useful.`);
        const server = safeGetServer(hostname, ctx);
        if (!(server instanceof Server)) {
          ctx.log(() => "Cannot be executed on this server.");
          return 1;
        }
        if (failOnHacknetServer(server, "getServerBaseSecurityLevel")) {
          return 1;
        }
        ctx.log(
          () => `returned ${numeralWrapper.formatServerSecurity(server.baseDifficulty)} for '${server.hostname}'`,
        );
        return server.baseDifficulty;
      },
    getServerMinSecurityLevel:
      (ctx: NetscriptContext) =>
      (_hostname: unknown): number => {
        const hostname = ctx.helper.string("hostname", _hostname);
        const server = safeGetServer(hostname, ctx);
        if (!(server instanceof Server)) {
          ctx.log(() => "Cannot be executed on this server.");
          return 1;
        }
        if (failOnHacknetServer(server, "getServerMinSecurityLevel")) {
          return 1;
        }
        ctx.log(() => `returned ${numeralWrapper.formatServerSecurity(server.minDifficulty)} for ${server.hostname}`);
        return server.minDifficulty;
      },
    getServerRequiredHackingLevel:
      (ctx: NetscriptContext) =>
      (_hostname: unknown): number => {
        const hostname = ctx.helper.string("hostname", _hostname);
        const server = safeGetServer(hostname, ctx);
        if (!(server instanceof Server)) {
          ctx.log(() => "Cannot be executed on this server.");
          return 1;
        }
        if (failOnHacknetServer(server, "getServerRequiredHackingLevel")) {
          return 1;
        }
        ctx.log(() => `returned ${numeralWrapper.formatSkill(server.requiredHackingSkill)} for '${server.hostname}'`);
        return server.requiredHackingSkill;
      },
    getServerMaxMoney:
      (ctx: NetscriptContext) =>
      (_hostname: unknown): number => {
        const hostname = ctx.helper.string("hostname", _hostname);
        const server = safeGetServer(hostname, ctx);
        if (!(server instanceof Server)) {
          ctx.log(() => "Cannot be executed on this server.");
          return 0;
        }
        if (failOnHacknetServer(server, "getServerMaxMoney")) {
          return 0;
        }
        ctx.log(() => `returned ${numeralWrapper.formatMoney(server.moneyMax)} for '${server.hostname}'`);
        return server.moneyMax;
      },
    getServerGrowth:
      (ctx: NetscriptContext) =>
      (_hostname: unknown): number => {
        const hostname = ctx.helper.string("hostname", _hostname);
        const server = safeGetServer(hostname, ctx);
        if (!(server instanceof Server)) {
          ctx.log(() => "Cannot be executed on this server.");
          return 1;
        }
        if (failOnHacknetServer(server, "getServerGrowth")) {
          return 1;
        }
        ctx.log(() => `returned ${server.serverGrowth} for '${server.hostname}'`);
        return server.serverGrowth;
      },
    getServerNumPortsRequired:
      (ctx: NetscriptContext) =>
      (_hostname: unknown): number => {
        const hostname = ctx.helper.string("hostname", _hostname);
        const server = safeGetServer(hostname, ctx);
        if (!(server instanceof Server)) {
          ctx.log(() => "Cannot be executed on this server.");
          return 5;
        }
        if (failOnHacknetServer(server, "getServerNumPortsRequired")) {
          return 5;
        }
        ctx.log(() => `returned ${server.numOpenPortsRequired} for '${server.hostname}'`);
        return server.numOpenPortsRequired;
      },
    getServerRam:
      (ctx: NetscriptContext) =>
      (_hostname: unknown): [number, number] => {
        const hostname = ctx.helper.string("hostname", _hostname);
        ctx.log(() => `getServerRam is deprecated in favor of getServerMaxRam / getServerUsedRam`);
        const server = safeGetServer(hostname, ctx);
        ctx.log(
          () => `returned [${numeralWrapper.formatRAM(server.maxRam)}, ${numeralWrapper.formatRAM(server.ramUsed)}]`,
        );
        return [server.maxRam, server.ramUsed];
      },
    getServerMaxRam:
      (ctx: NetscriptContext) =>
      (_hostname: unknown): number => {
        const hostname = ctx.helper.string("hostname", _hostname);
        const server = safeGetServer(hostname, ctx);
        ctx.log(() => `returned ${numeralWrapper.formatRAM(server.maxRam)}`);
        return server.maxRam;
      },
    getServerUsedRam:
      (ctx: NetscriptContext) =>
      (_hostname: unknown): number => {
        const hostname = ctx.helper.string("hostname", _hostname);
        const server = safeGetServer(hostname, ctx);
        ctx.log(() => `returned ${numeralWrapper.formatRAM(server.ramUsed)}`);
        return server.ramUsed;
      },
    serverExists:
      (ctx: NetscriptContext) =>
      (_hostname: unknown): boolean => {
        const hostname = ctx.helper.string("hostname", _hostname);
        return GetServer(hostname) !== null;
      },
    fileExists:
      (ctx: NetscriptContext) =>
      (_filename: unknown, _hostname: unknown = workerScript.hostname): boolean => {
        const filename = ctx.helper.string("filename", _filename);
        const hostname = ctx.helper.string("hostname", _hostname);
        if (filename === undefined) {
          throw ctx.makeRuntimeErrorMsg("Usage: fileExists(scriptname, [server])");
        }
        const server = safeGetServer(hostname, ctx);
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
    isRunning:
      (ctx: NetscriptContext) =>
      (fn: unknown, hostname: unknown, ...scriptArgs: unknown[]): boolean => {
        const ident = ctx.helper.scriptIdentifier(fn, hostname, scriptArgs);
        return getRunningScript(ctx, ident) !== null;
      },
    getPurchasedServerLimit: () => (): number => {
      return getPurchaseServerLimit();
    },
    getPurchasedServerMaxRam: () => (): number => {
      return getPurchaseServerMaxRam();
    },
    getPurchasedServerCost:
      (ctx: NetscriptContext) =>
      (_ram: unknown): number => {
        const ram = ctx.helper.number("ram", _ram);

        const cost = getPurchaseServerCost(ram);
        if (cost === Infinity) {
          ctx.log(() => `Invalid argument: ram='${ram}'`);
          return Infinity;
        }

        return cost;
      },
    purchaseServer:
      (ctx: NetscriptContext) =>
      (_name: unknown, _ram: unknown): string => {
        const name = ctx.helper.string("name", _name);
        const ram = ctx.helper.number("ram", _ram);
        let hostnameStr = String(name);
        hostnameStr = hostnameStr.replace(/\s+/g, "");
        if (hostnameStr == "") {
          ctx.log(() => `Invalid argument: hostname='${hostnameStr}'`);
          return "";
        }

        if (Player.purchasedServers.length >= getPurchaseServerLimit()) {
          ctx.log(
            () =>
              `You have reached the maximum limit of ${getPurchaseServerLimit()} servers. You cannot purchase any more.`,
          );
          return "";
        }

        const cost = getPurchaseServerCost(ram);
        if (cost === Infinity) {
          if (ram > getPurchaseServerMaxRam()) {
            ctx.log(() => `Invalid argument: ram='${ram}' must not be greater than getPurchaseServerMaxRam`);
          } else {
            ctx.log(() => `Invalid argument: ram='${ram}' must be a positive power of 2`);
          }

          return "";
        }

        if (Player.money < cost) {
          ctx.log(() => `Not enough money to purchase server. Need ${numeralWrapper.formatMoney(cost)}`);
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
        ctx.log(
          () => `Purchased new server with hostname '${newServ.hostname}' for ${numeralWrapper.formatMoney(cost)}`,
        );
        return newServ.hostname;
      },
    deleteServer:
      (ctx: NetscriptContext) =>
      (_name: unknown): boolean => {
        const name = ctx.helper.string("name", _name);
        let hostnameStr = String(name);
        hostnameStr = hostnameStr.replace(/\s\s+/g, "");
        const server = GetServer(hostnameStr);
        if (!(server instanceof Server)) {
          ctx.log(() => `Invalid argument: hostname='${hostnameStr}'`);
          return false;
        }

        if (!server.purchasedByPlayer || server.hostname === "home") {
          ctx.log(() => "Cannot delete non-purchased server.");
          return false;
        }

        const hostname = server.hostname;

        // Can't delete server you're currently connected to
        if (server.isConnectedTo) {
          ctx.log(() => "You are currently connected to the server you are trying to delete.");
          return false;
        }

        // A server cannot delete itself
        if (hostname === workerScript.hostname) {
          ctx.log(() => "Cannot delete the server this script is running on.");
          return false;
        }

        // Delete all scripts running on server
        if (server.runningScripts.length > 0) {
          ctx.log(() => `Cannot delete server '${hostname}' because it still has scripts running.`);
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
          ctx.log(() => `Could not identify server ${hostname} as a purchased server. This is a bug. Report to dev.`);
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
            ctx.log(() => `Deleted server '${hostnameStr}`);
            return true;
          }
        }
        // Wasn't found on home computer
        ctx.log(() => `Could not find server ${hostname} as a purchased server. This is a bug. Report to dev.`);
        return false;
      },
    getPurchasedServers: () => (): string[] => {
      const res: string[] = [];
      Player.purchasedServers.forEach(function (hostname) {
        res.push(hostname);
      });
      return res;
    },
    writePort:
      (ctx: NetscriptContext) =>
      (_port: unknown, data: unknown = ""): Promise<any> => {
        const port = ctx.helper.number("port", _port);
        if (typeof data !== "string" && typeof data !== "number") {
          throw ctx.makeRuntimeErrorMsg(`Trying to write invalid data to a port: only strings and numbers are valid.`);
        }
        const iport = helper.getValidPort("writePort", port);
        return Promise.resolve(iport.write(data));
      },
    write:
      (ctx: NetscriptContext) =>
      (_port: unknown, data: unknown = "", _mode: unknown = "a"): Promise<void> => {
        const port = ctx.helper.string("port", _port);
        const mode = ctx.helper.string("mode", _mode);
        if (isString(port)) {
          // Write to script or text file
          let fn = port;
          if (!isValidFilePath(fn)) {
            throw ctx.makeRuntimeErrorMsg(`Invalid filepath: ${fn}`);
          }

          if (fn.lastIndexOf("/") === 0) {
            fn = removeLeadingSlash(fn);
          }

          // Coerce 'data' to be a string
          try {
            data = String(data);
          } catch (e: unknown) {
            throw ctx.makeRuntimeErrorMsg(
              `Invalid data (${String(e)}). Data being written must be convertible to a string`,
            );
          }

          const server = workerScript.getServer();
          if (server == null) {
            throw ctx.makeRuntimeErrorMsg("Error getting Server. This is a bug. Report to dev.");
          }
          if (isScriptFilename(fn)) {
            // Write to script
            let script = workerScript.getScriptOnServer(fn, server);
            if (script == null) {
              // Create a new script
              script = new Script(Player, fn, String(data), server.hostname, server.scripts);
              server.scripts.push(script);
              return script.updateRamUsage(Player, server.scripts);
            }
            mode === "w" ? (script.code = String(data)) : (script.code += data);
            return script.updateRamUsage(Player, server.scripts);
          } else {
            // Write to text file
            const txtFile = getTextFile(fn, server);
            if (txtFile == null) {
              createTextFile(fn, String(data), server);
              return Promise.resolve();
            }
            if (mode === "w") {
              txtFile.write(String(data));
            } else {
              txtFile.append(String(data));
            }
          }
          return Promise.resolve();
        } else {
          throw ctx.makeRuntimeErrorMsg(`Invalid argument: ${port}`);
        }
      },
    tryWritePort:
      (ctx: NetscriptContext) =>
      (_port: unknown, data: unknown = ""): Promise<any> => {
        let port = ctx.helper.number("port", _port);
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
            throw ctx.makeRuntimeErrorMsg(`Could not find port: ${port}. This is a bug. Report to dev.`);
          }
          return Promise.resolve(iport.tryWrite(data));
        } else {
          throw ctx.makeRuntimeErrorMsg(`Invalid argument: ${port}`);
        }
      },
    readPort:
      (ctx: NetscriptContext) =>
      (_port: unknown): unknown => {
        const port = ctx.helper.number("port", _port);
        // Read from port
        const iport = helper.getValidPort("readPort", port);
        const x = iport.read();
        return x;
      },
    read:
      (ctx: NetscriptContext) =>
      (_port: unknown): string => {
        const port = ctx.helper.string("port", _port);
        if (isString(port)) {
          // Read from script or text file
          const fn = port;
          const server = GetServer(workerScript.hostname);
          if (server == null) {
            throw ctx.makeRuntimeErrorMsg("Error getting Server. This is a bug. Report to dev.");
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
          throw ctx.makeRuntimeErrorMsg(`Invalid argument: ${port}`);
        }
      },
    peek:
      (ctx: NetscriptContext) =>
      (_port: unknown): unknown => {
        const port = ctx.helper.number("port", _port);
        const iport = helper.getValidPort("peek", port);
        const x = iport.peek();
        return x;
      },
    clear:
      (ctx: NetscriptContext) =>
      (_file: unknown): void => {
        const file = ctx.helper.string("file", _file);
        if (isString(file)) {
          // Clear text file
          const fn = file;
          const server = GetServer(workerScript.hostname);
          if (server == null) {
            throw ctx.makeRuntimeErrorMsg("Error getting Server. This is a bug. Report to dev.");
          }
          const txtFile = getTextFile(fn, server);
          if (txtFile != null) {
            txtFile.write("");
          }
        } else {
          throw ctx.makeRuntimeErrorMsg(`Invalid argument: ${file}`);
        }
      },
    clearPort:
      (ctx: NetscriptContext) =>
      (_port: unknown): void => {
        const port = ctx.helper.number("port", _port);
        // Clear port
        const iport = helper.getValidPort("clearPort", port);
        iport.clear();
      },
    getPortHandle:
      (ctx: NetscriptContext) =>
      (_port: unknown): IPort => {
        const port = ctx.helper.number("port", _port);
        const iport = helper.getValidPort("getPortHandle", port);
        return iport;
      },
    rm:
      (ctx: NetscriptContext) =>
      (_fn: unknown, _hostname: unknown = workerScript.hostname): boolean => {
        const fn = ctx.helper.string("fn", _fn);
        const hostname = ctx.helper.string("hostname", _hostname);
        const s = safeGetServer(hostname, ctx);

        const status = s.removeFile(fn);
        if (!status.res) {
          ctx.log(() => status.msg + "");
        }

        return status.res;
      },
    scriptRunning:
      (ctx: NetscriptContext) =>
      (_scriptname: unknown, _hostname: unknown): boolean => {
        const scriptname = ctx.helper.string("scriptname", _scriptname);
        const hostname = ctx.helper.string("hostname", _hostname);
        const server = safeGetServer(hostname, ctx);
        for (let i = 0; i < server.runningScripts.length; ++i) {
          if (server.runningScripts[i].filename == scriptname) {
            return true;
          }
        }
        return false;
      },
    scriptKill:
      (ctx: NetscriptContext) =>
      (_scriptname: unknown, _hostname: unknown): boolean => {
        const scriptname = ctx.helper.string("scriptname", _scriptname);
        const hostname = ctx.helper.string("hostname", _hostname);
        const server = safeGetServer(hostname, ctx);
        let suc = false;
        for (let i = 0; i < server.runningScripts.length; i++) {
          if (server.runningScripts[i].filename == scriptname) {
            killWorkerScript({ runningScript: server.runningScripts[i], hostname: server.hostname });
            suc = true;
            i--;
          }
        }
        return suc;
      },
    getScriptName: () => (): string => {
      return workerScript.name;
    },
    getScriptRam:
      (ctx: NetscriptContext) =>
      (_scriptname: unknown, _hostname: unknown = workerScript.hostname): number => {
        const scriptname = ctx.helper.string("scriptname", _scriptname);
        const hostname = ctx.helper.string("hostname", _hostname);
        const server = safeGetServer(hostname, ctx);
        for (let i = 0; i < server.scripts.length; ++i) {
          if (server.scripts[i].filename == scriptname) {
            return server.scripts[i].ramUsage;
          }
        }
        return 0;
      },
    getRunningScript:
      (ctx: NetscriptContext) =>
      (fn: unknown, hostname: unknown, ...args: unknown[]): IRunningScriptDef | null => {
        const ident = ctx.helper.scriptIdentifier(fn, hostname, args);
        const runningScript = getRunningScript(ctx, ident);
        if (runningScript === null) return null;
        return createPublicRunningScript(runningScript);
      },
    getHackTime:
      (ctx: NetscriptContext) =>
      (_hostname: unknown = workerScript.hostname): number => {
        const hostname = ctx.helper.string("hostname", _hostname);
        const server = safeGetServer(hostname, ctx);
        if (!(server instanceof Server)) {
          ctx.log(() => "invalid for this kind of server");
          return Infinity;
        }
        if (failOnHacknetServer(server, "getHackTime")) {
          return Infinity;
        }

        return calculateHackingTime(server, Player) * 1000;
      },
    getGrowTime:
      (ctx: NetscriptContext) =>
      (_hostname: unknown = workerScript.hostname): number => {
        const hostname = ctx.helper.string("hostname", _hostname);
        const server = safeGetServer(hostname, ctx);
        if (!(server instanceof Server)) {
          ctx.log(() => "invalid for this kind of server");
          return Infinity;
        }
        if (failOnHacknetServer(server, "getGrowTime")) {
          return Infinity;
        }

        return calculateGrowTime(server, Player) * 1000;
      },
    getWeakenTime:
      (ctx: NetscriptContext) =>
      (_hostname: unknown = workerScript.hostname): number => {
        const hostname = ctx.helper.string("hostname", _hostname);
        const server = safeGetServer(hostname, ctx);
        if (!(server instanceof Server)) {
          ctx.log(() => "invalid for this kind of server");
          return Infinity;
        }
        if (failOnHacknetServer(server, "getWeakenTime")) {
          return Infinity;
        }

        return calculateWeakenTime(server, Player) * 1000;
      },
    getTotalScriptIncome: () => (): [number, number] => {
      // First element is total income of all currently running scripts
      let total = 0;
      for (const script of workerScripts.values()) {
        total += script.scriptRef.onlineMoneyMade / script.scriptRef.onlineRunningTime;
      }

      return [total, Player.scriptProdSinceLastAug / (Player.playtimeSinceLastAug / 1000)];
    },
    getScriptIncome:
      (ctx: NetscriptContext) =>
      (fn: unknown, hostname: unknown, ...args: unknown[]): number => {
        const ident = ctx.helper.scriptIdentifier(fn, hostname, args);
        const runningScript = getRunningScript(ctx, ident);
        if (runningScript == null) {
          ctx.log(() => getCannotFindRunningScriptErrorMessage(ident));
          return -1;
        }
        return runningScript.onlineMoneyMade / runningScript.onlineRunningTime;
      },
    getTotalScriptExpGain: () => (): number => {
      let total = 0;
      for (const ws of workerScripts.values()) {
        total += ws.scriptRef.onlineExpGained / ws.scriptRef.onlineRunningTime;
      }
      return total;
    },
    getScriptExpGain:
      (ctx: NetscriptContext) =>
      (fn: unknown, hostname: unknown, ...args: unknown[]): number => {
        const ident = ctx.helper.scriptIdentifier(fn, hostname, args);
        const runningScript = getRunningScript(ctx, ident);
        if (runningScript == null) {
          ctx.log(() => getCannotFindRunningScriptErrorMessage(ident));
          return -1;
        }
        return runningScript.onlineExpGained / runningScript.onlineRunningTime;
      },
    nFormat:
      (ctx: NetscriptContext) =>
      (_n: unknown, _format: unknown): string => {
        const n = ctx.helper.number("n", _n);
        const format = ctx.helper.string("format", _format);
        if (isNaN(n)) {
          return "";
        }

        return numeralWrapper.format(n, format);
      },
    tFormat:
      (ctx: NetscriptContext) =>
      (_milliseconds: unknown, _milliPrecision: unknown = false): string => {
        const milliseconds = ctx.helper.number("milliseconds", _milliseconds);
        const milliPrecision = helper.boolean(_milliPrecision);
        return convertTimeMsToTimeElapsedString(milliseconds, milliPrecision);
      },
    getTimeSinceLastAug: () => (): number => {
      return Player.playtimeSinceLastAug;
    },
    alert:
      (ctx: NetscriptContext) =>
      (_message: unknown): void => {
        const message = ctx.helper.string("message", _message);
        dialogBoxCreate(message);
      },
    toast:
      (ctx: NetscriptContext) =>
      (_message: unknown, _variant: unknown = ToastVariant.SUCCESS, _duration: unknown = 2000): void => {
        const message = ctx.helper.string("message", _message);
        const variant = ctx.helper.string("variant", _variant);
        const duration = ctx.helper.number("duration", _duration);
        if (!checkEnum(ToastVariant, variant))
          throw new Error(`variant must be one of ${Object.values(ToastVariant).join(", ")}`);
        SnackbarEvents.emit(message, variant, duration);
      },
    prompt:
      (ctx: NetscriptContext) =>
      (_txt: unknown, options?: { type?: string; options?: string[] }): Promise<boolean | string> => {
        const txt = ctx.helper.string("txt", _txt);

        return new Promise(function (resolve) {
          PromptEvent.emit({
            txt: txt,
            options,
            resolve: resolve,
          });
        });
      },
    wget:
      (ctx: NetscriptContext) =>
      async (_url: unknown, _target: unknown, _hostname: unknown = workerScript.hostname): Promise<boolean> => {
        const url = ctx.helper.string("url", _url);
        const target = ctx.helper.string("target", _target);
        const hostname = ctx.helper.string("hostname", _hostname);
        if (!isScriptFilename(target) && !target.endsWith(".txt")) {
          ctx.log(() => `Invalid target file: '${target}'. Must be a script or text file.`);
          return Promise.resolve(false);
        }
        const s = safeGetServer(hostname, ctx);
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
                ctx.log(() => "Failed.");
                return resolve(false);
              }
              if (res.overwritten) {
                ctx.log(() => `Successfully retrieved content and overwrote '${target}' on '${hostname}'`);
                return resolve(true);
              }
              ctx.log(() => `Successfully retrieved content to new file '${target}' on '${hostname}'`);
              return resolve(true);
            },
            "text",
          ).fail(function (e) {
            ctx.log(() => JSON.stringify(e));
            return resolve(false);
          });
        });
      },
    getFavorToDonate: () => (): number => {
      return Math.floor(CONSTANTS.BaseFavorToDonate * BitNodeMultipliers.RepToDonateToFaction);
    },
    getPlayer: () => (): INetscriptPlayer => {
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
        hacking_exp: Player.hacking_exp,
        strength_exp: Player.strength_exp,
        defense_exp: Player.defense_exp,
        dexterity_exp: Player.dexterity_exp,
        agility_exp: Player.agility_exp,
        charisma_exp: Player.charisma_exp,
        hacking_chance_mult: Player.mults.hacking_chance,
        mults: JSON.parse(JSON.stringify(Player.mults)),
        numPeopleKilled: Player.numPeopleKilled,
        money: Player.money,
        city: Player.city,
        location: Player.location,
        hasWseAccount: Player.hasWseAccount,
        hasTixApiAccess: Player.hasTixApiAccess,
        has4SData: Player.has4SData,
        has4SDataTixApi: Player.has4SDataTixApi,
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
      };
      Object.assign(data.jobs, Player.jobs);
      return data;
    },
    atExit:
      (ctx: NetscriptContext) =>
      (f: unknown): void => {
        if (typeof f !== "function") {
          throw ctx.makeRuntimeErrorMsg("argument should be function");
        }
        workerScript.atExit = () => {
          f();
        }; // Wrap the user function to prevent WorkerScript leaking as 'this'
      },
    mv:
      (ctx: NetscriptContext) =>
      (_host: unknown, _source: unknown, _destination: unknown): void => {
        const host = ctx.helper.string("host", _host);
        const source = ctx.helper.string("source", _source);
        const destination = ctx.helper.string("destination", _destination);

        if (!isValidFilePath(source)) throw ctx.makeRuntimeErrorMsg(`Invalid filename: '${source}'`);
        if (!isValidFilePath(destination)) throw ctx.makeRuntimeErrorMsg(`Invalid filename: '${destination}'`);

        const source_is_txt = source.endsWith(".txt");
        const dest_is_txt = destination.endsWith(".txt");

        if (!isScriptFilename(source) && !source_is_txt)
          throw ctx.makeRuntimeErrorMsg(`'mv' can only be used on scripts and text files (.txt)`);
        if (source_is_txt != dest_is_txt)
          throw ctx.makeRuntimeErrorMsg(`Source and destination files must have the same type`);

        if (source === destination) {
          return;
        }

        // This will throw if the server is not found, we do not need to validate result.
        const destServer: BaseServer | null = safeGetServer(host, ctx);

        if (!source_is_txt && destServer.isRunning(source))
          throw ctx.makeRuntimeErrorMsg(`Cannot use 'mv' on a script that is running`);

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

        if (source_file == null) throw ctx.makeRuntimeErrorMsg(`Source file ${source} does not exist`);

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
    flags: Flags(workerScript.args.map((a) => String(a))),
  };

  // add undocumented functions
  const ns = {
    ...base,
    ...NetscriptExtra(Player),
  };
  function getFunctionNames(obj: object, prefix: string): string[] {
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

  const wrappedNS = wrapAPI(helper, {}, workerScript, ns) as unknown as INS;
  (wrappedNS as any).args = ns.args;
  (wrappedNS as any).enums = ns.enums;
  return wrappedNS;
}
