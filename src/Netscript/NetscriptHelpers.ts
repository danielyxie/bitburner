import { NetscriptContext } from "./APIWrapper";
import { WorkerScript } from "./WorkerScript";
import { GetAllServers, GetServer } from "../Server/AllServers";
import { Player } from "@player";
import { ScriptDeath } from "./ScriptDeath";
import { numeralWrapper } from "../ui/numeralFormat";
import { ScriptArg } from "./ScriptArg";
import { CityName } from "../Enums";
import { BasicHGWOptions, RunningScript as IRunningScript, Person as IPerson } from "@nsdefs";
import { Server } from "../Server/Server";
import {
  calculateHackingChance,
  calculateHackingExpGain,
  calculateHackingTime,
  calculatePercentMoneyHacked,
} from "../Hacking";
import { netscriptCanHack } from "../Hacking/netscriptCanHack";
import { convertTimeMsToTimeElapsedString } from "../utils/StringHelperFunctions";
import { BitNodeMultipliers } from "../BitNode/BitNodeMultipliers";
import { CONSTANTS } from "../Constants";
import { influenceStockThroughServerHack } from "../StockMarket/PlayerInfluencing";
import { IPort, NetscriptPort } from "../NetscriptPort";
import { NetscriptPorts } from "../NetscriptWorker";
import { FormulaGang } from "../Gang/formulas/formulas";
import { GangMember } from "../Gang/GangMember";
import { GangMemberTask } from "../Gang/GangMemberTask";
import { RunningScript } from "../Script/RunningScript";
import { toNative } from "../NetscriptFunctions/toNative";
import { ScriptIdentifier } from "./ScriptIdentifier";
import { findRunningScript, findRunningScriptByPid } from "../Script/ScriptHelpers";
import { arrayToString } from "../utils/helpers/arrayToString";
import { HacknetServer } from "../Hacknet/HacknetServer";
import { BaseServer } from "../Server/BaseServer";
import { dialogBoxCreate } from "../ui/React/DialogBox";
import { checkEnum } from "../utils/helpers/enum";
import { RamCostConstants } from "./RamCostGenerator";

export const helpers = {
  string,
  number,
  scriptArgs,
  argsToString,
  makeBasicErrorMsg,
  makeRuntimeErrorMsg,
  resolveNetscriptRequestedThreads,
  checkEnvFlags,
  checkSingularityAccess,
  netscriptDelay,
  updateDynamicRam,
  city,
  getServer,
  scriptIdentifier,
  hack,
  getValidPort,
  person,
  server,
  gang,
  gangMember,
  gangTask,
  log,
  getRunningScript,
  getRunningScriptByArgs,
  getCannotFindRunningScriptErrorMessage,
  createPublicRunningScript,
  failOnHacknetServer,
};

export function assertMember<T extends string>(
  ctx: NetscriptContext,
  obj: Record<string, T> | T[],
  typeName: string,
  argName: string,
  v: unknown,
): asserts v is T {
  assertString(ctx, argName, v);
  if (!checkEnum(obj, v)) throw makeRuntimeErrorMsg(ctx, `${argName}: ${v} is not a valid ${typeName}.`, "TYPE");
}

export function assertString(ctx: NetscriptContext, argName: string, v: unknown): asserts v is string {
  if (typeof v !== "string")
    throw makeRuntimeErrorMsg(ctx, `${argName} expected to be a string. ${debugType(v)}`, "TYPE");
}

/** Will probably remove the below function in favor of a different approach to object type assertion.
 *  This method cannot be used to handle optional properties. */
export function assertObjectType<T extends object>(
  ctx: NetscriptContext,
  name: string,
  obj: unknown,
  desiredObject: T,
): asserts obj is T {
  if (typeof obj !== "object" || obj === null) {
    throw makeRuntimeErrorMsg(
      ctx,
      `Type ${obj === null ? "null" : typeof obj} provided for ${name}. Must be an object.`,
      "TYPE",
    );
  }
  const objHas = Object.prototype.hasOwnProperty.bind(obj);
  for (const [key, val] of Object.entries(desiredObject)) {
    if (!objHas(key)) {
      throw makeRuntimeErrorMsg(
        ctx,
        `Object provided for argument ${name} is missing required property ${key}.`,
        "TYPE",
      );
    }
    const objVal = (obj as Record<string, unknown>)[key];
    if (typeof val !== typeof objVal) {
      throw makeRuntimeErrorMsg(
        ctx,
        `Incorrect type ${typeof objVal} provided for property ${key} on ${name} argument. Should be type ${typeof val}.`,
        "TYPE",
      );
    }
  }
}

const userFriendlyString = (v: unknown): string => {
  const clip = (s: string): string => {
    if (s.length > 15) return s.slice(0, 12) + "...";
    return s;
  };
  if (typeof v === "number") return String(v);
  if (typeof v === "string") {
    if (v === "") return "empty string";
    return `'${clip(v)}'`;
  }
  const json = JSON.stringify(v);
  if (!json) return "???";
  return `'${clip(json)}'`;
};

const debugType = (v: unknown): string => {
  if (v === null) return `Is null.`;
  if (v === undefined) return "Is undefined.";
  if (typeof v === "function") return "Is a function.";
  return `Is of type '${typeof v}', value: ${userFriendlyString(v)}`;
};

/** Convert a provided value v for argument argName to string. If it wasn't originally a string or number, throw. */
function string(ctx: NetscriptContext, argName: string, v: unknown): string {
  if (typeof v === "number") v = v + ""; // cast to string;
  assertString(ctx, argName, v);
  return v;
}

/** Convert provided value v for argument argName to number. Throw if could not convert to a non-NaN number. */
function number(ctx: NetscriptContext, argName: string, v: unknown): number {
  if (typeof v === "string") {
    const x = parseFloat(v);
    if (!isNaN(x)) return x; // otherwise it wasn't even a string representing a number.
  } else if (typeof v === "number") {
    if (isNaN(v)) throw makeRuntimeErrorMsg(ctx, `'${argName}' is NaN.`);
    return v;
  }
  throw makeRuntimeErrorMsg(ctx, `'${argName}' should be a number. ${debugType(v)}`, "TYPE");
}

/** Returns args back if it is a ScriptArg[]. Throws an error if it is not. */
function scriptArgs(ctx: NetscriptContext, args: unknown) {
  if (!isScriptArgs(args)) throw makeRuntimeErrorMsg(ctx, "'args' is not an array of script args", "TYPE");
  return args;
}

/** Convert multiple arguments for tprint or print into a single string. */
function argsToString(args: unknown[]): string {
  let out = "";
  for (let arg of args) {
    if (arg === null) {
      out += "null";
      continue;
    }
    if (arg === undefined) {
      out += "undefined";
      continue;
    }
    arg = toNative(arg);
    out += typeof arg === "object" ? JSON.stringify(arg) : `${arg}`;
  }

  return out;
}

/** Creates an error message string containing hostname, scriptname, and the error message msg */
function makeBasicErrorMsg(ws: WorkerScript | ScriptDeath, msg: string, type = "RUNTIME"): string {
  if (ws instanceof WorkerScript) {
    for (const scriptUrl of ws.scriptRef.dependencies) {
      msg = msg.replace(new RegExp(scriptUrl.url, "g"), scriptUrl.filename);
    }
  }
  return `${type} ERROR\n${ws.name}@${ws.hostname} (PID - ${ws.pid})\n\n${msg}`;
}

/** Creates an error message string with a stack trace. */
function makeRuntimeErrorMsg(ctx: NetscriptContext, msg: string, type = "RUNTIME"): string {
  const errstack = new Error().stack;
  if (errstack === undefined) throw new Error("how did we not throw an error?");
  const stack = errstack.split("\n").slice(1);
  const ws = ctx.workerScript;
  const caller = ctx.functionPath;
  const scripts = ws.getServer().scripts;
  const userstack = [];
  for (const stackline of stack) {
    let filename;
    for (const script of scripts) {
      if (script.filename && stackline.includes(script.filename)) {
        filename = script.filename;
      }
      for (const dependency of script.dependencies) {
        if (stackline.includes(dependency.filename)) {
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

  log(ctx, () => msg);
  let rejectMsg = `${caller}: ${msg}`;
  if (userstack.length !== 0) rejectMsg += `\n\nStack:\n${userstack.join("\n")}`;
  return makeBasicErrorMsg(ws, rejectMsg, type);
}

/** Validate requested number of threads for h/g/w options */
function resolveNetscriptRequestedThreads(ctx: NetscriptContext, requestedThreads?: number): number {
  const threads = ctx.workerScript.scriptRef.threads;
  if (!requestedThreads) {
    return isNaN(threads) || threads < 1 ? 1 : threads;
  }
  const requestedThreadsAsInt = requestedThreads | 0;
  if (isNaN(requestedThreads) || requestedThreadsAsInt < 1) {
    throw makeRuntimeErrorMsg(ctx, `Invalid thread count: ${requestedThreads}. Threads must be a positive number.`);
  }
  if (requestedThreadsAsInt > threads) {
    throw makeRuntimeErrorMsg(
      ctx,
      `Too many threads requested by ${ctx.function}. Requested: ${requestedThreads}. Has: ${threads}.`,
    );
  }
  return requestedThreadsAsInt;
}

/** Validate singularity access by throwing an error if the player does not have access. */
function checkSingularityAccess(ctx: NetscriptContext): void {
  if (Player.bitNodeN !== 4 && Player.sourceFileLvl(4) === 0) {
    throw makeRuntimeErrorMsg(
      ctx,
      `This singularity function requires Source-File 4 to run. A power up you obtain later in the game.
      It will be very obvious when and how you can obtain it.`,
      "API ACCESS",
    );
  }
}

/** Create an error if a script is dead or if concurrent ns function calls are made */
function checkEnvFlags(ctx: NetscriptContext): void {
  const ws = ctx.workerScript;
  if (ws.env.stopFlag) {
    log(ctx, () => "Failed to run due to script being killed.");
    throw new ScriptDeath(ws);
  }
  if (ws.env.runningFn && ctx.function !== "asleep") {
    ws.delayReject?.(new ScriptDeath(ws));
    ws.env.stopFlag = true;
    log(ctx, () => "Failed to run due to failed concurrency check.");
    throw makeRuntimeErrorMsg(
      ctx,
      `Concurrent calls to Netscript functions are not allowed!
      Did you forget to await hack(), grow(), or some other
      promise-returning function?
      Currently running: ${ws.env.runningFn} tried to run: ${ctx.function}`,
      "CONCURRENCY",
    );
  }
}

/** Set a timeout for performing a task, mark the script as busy in the meantime. */
function netscriptDelay(ctx: NetscriptContext, time: number): Promise<void> {
  const ws = ctx.workerScript;
  return new Promise(function (resolve, reject) {
    ws.delay = window.setTimeout(() => {
      ws.delay = null;
      ws.delayReject = undefined;
      ws.env.runningFn = "";
      if (ws.env.stopFlag) reject(new ScriptDeath(ws));
      else resolve();
    }, time);
    ws.delayReject = reject;
    ws.env.runningFn = ctx.function;
  });
}

/** Adds to dynamic ram cost when calling new ns functions from a script */
function updateDynamicRam(ctx: NetscriptContext, ramCost: number): void {
  const ws = ctx.workerScript;
  const fnName = ctx.function;
  if (ws.dynamicLoadedFns[fnName]) return;
  ws.dynamicLoadedFns[fnName] = true;

  let threads = ws.scriptRef.threads;
  if (typeof threads !== "number") {
    console.warn(`WorkerScript detected NaN for thread count for ${ws.name} on ${ws.hostname}`);
    threads = 1;
  }
  ws.dynamicRamUsage = Math.min(ws.dynamicRamUsage + ramCost, RamCostConstants.Max);
  if (ws.dynamicRamUsage > 1.01 * ws.ramUsage) {
    log(ctx, () => "Insufficient static ram available.");
    ws.env.stopFlag = true;
    throw makeRuntimeErrorMsg(
      ctx,
      `Dynamic RAM usage calculated to be greater than initial RAM usage.
      This is probably because you somehow circumvented the static RAM calculation.

      Threads: ${threads}
      Dynamic RAM Usage: ${numeralWrapper.formatRAM(ws.dynamicRamUsage)} per thread
      Static RAM Usage: ${numeralWrapper.formatRAM(ws.ramUsage)} per thread

      One of these could be the reason:
      * Using eval() to get a reference to a ns function
      \u00a0\u00a0const myScan = eval('ns.scan');

      * Using map access to do the same
      \u00a0\u00a0const myScan = ns['scan'];

      Sorry :(`,
      "RAM USAGE",
    );
  }
}

/** Validates the input v as being a CityName. Throws an error if it is not. */
function city(ctx: NetscriptContext, argName: string, v: unknown): CityName {
  if (typeof v !== "string" || !checkEnum(CityName, v))
    throw makeRuntimeErrorMsg(ctx, `${argName} should be a city name.`);
  return v;
}

function scriptIdentifier(
  ctx: NetscriptContext,
  scriptID: unknown,
  _hostname: unknown,
  _args: unknown,
): ScriptIdentifier {
  const ws = ctx.workerScript;
  // Provide the pid for the current script if no identifier provided
  if (scriptID === undefined) return ws.pid;
  if (typeof scriptID === "number") return scriptID;
  if (typeof scriptID === "string") {
    const hostname = _hostname === undefined ? ctx.workerScript.hostname : string(ctx, "hostname", _hostname);
    const args = _args === undefined ? [] : scriptArgs(ctx, _args);
    return {
      scriptname: scriptID,
      hostname,
      args,
    };
  }
  throw makeRuntimeErrorMsg(ctx, "An unknown type of input was provided as a script identifier.", "TYPE");
}

/**
 * Gets the Server for a specific hostname/ip, throwing an error
 * if the server doesn't exist.
 * @param {NetscriptContext} ctx - Context from which getServer is being called. For logging purposes.
 * @param {string} hostname - Hostname of the server
 * @returns {BaseServer} The specified server as a BaseServer
 */
function getServer(ctx: NetscriptContext, hostname: string) {
  const server = GetServer(hostname);
  if (server == null) {
    const str = hostname === "" ? "'' (empty string)" : "'" + hostname + "'";
    throw makeRuntimeErrorMsg(ctx, `Invalid hostname: ${str}`);
  }
  return server;
}

function isScriptArgs(args: unknown): args is ScriptArg[] {
  const isScriptArg = (arg: unknown) => typeof arg === "string" || typeof arg === "number" || typeof arg === "boolean";
  return Array.isArray(args) && args.every(isScriptArg);
}

function hack(
  ctx: NetscriptContext,
  hostname: string,
  manual: boolean,
  { threads: requestedThreads, stock }: BasicHGWOptions = {},
): Promise<number> {
  const ws = ctx.workerScript;
  const threads = helpers.resolveNetscriptRequestedThreads(ctx, requestedThreads);
  const server = getServer(ctx, hostname);
  if (!(server instanceof Server)) {
    throw makeRuntimeErrorMsg(ctx, "Cannot be executed on this server.");
  }

  // Calculate the hacking time
  const hackingTime = calculateHackingTime(server, Player); // This is in seconds

  // No root access or skill level too low
  const canHack = netscriptCanHack(server);
  if (!canHack.res) {
    throw makeRuntimeErrorMsg(ctx, canHack.msg || "");
  }

  log(
    ctx,
    () =>
      `Executing on '${server.hostname}' in ${convertTimeMsToTimeElapsedString(
        hackingTime * 1000,
        true,
      )} (t=${numeralWrapper.formatThreads(threads)})`,
  );

  return helpers.netscriptDelay(ctx, hackingTime * 1000).then(function () {
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
      ws.scriptRef.onlineMoneyMade += moneyGained;
      Player.scriptProdSinceLastAug += moneyGained;
      ws.scriptRef.recordHack(server.hostname, moneyGained, threads);
      Player.gainHackingExp(expGainedOnSuccess);
      if (manual) Player.gainIntelligenceExp(0.005);
      ws.scriptRef.onlineExpGained += expGainedOnSuccess;
      log(
        ctx,
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
      return moneyGained;
    } else {
      // Player only gains 25% exp for failure?
      Player.gainHackingExp(expGainedOnFailure);
      ws.scriptRef.onlineExpGained += expGainedOnFailure;
      log(
        ctx,
        () =>
          `Failed to hack '${server.hostname}'. Gained ${numeralWrapper.formatExp(
            expGainedOnFailure,
          )} exp (t=${numeralWrapper.formatThreads(threads)})`,
      );
      return 0;
    }
  });
}

function getValidPort(ctx: NetscriptContext, port: number): IPort {
  if (isNaN(port)) {
    throw makeRuntimeErrorMsg(
      ctx,
      `Invalid argument. Must be a port number between 1 and ${CONSTANTS.NumNetscriptPorts}, is ${port}`,
    );
  }
  port = Math.round(port);
  if (port < 1 || port > CONSTANTS.NumNetscriptPorts) {
    throw makeRuntimeErrorMsg(
      ctx,
      `Trying to use an invalid port: ${port}. Only ports 1-${CONSTANTS.NumNetscriptPorts} are valid.`,
    );
  }
  let iport = NetscriptPorts.get(port);
  if (!iport) {
    iport = NetscriptPort();
    NetscriptPorts.set(port, iport);
  }
  return iport;
}

function person(ctx: NetscriptContext, p: unknown): IPerson {
  const fakePerson = {
    hp: undefined,
    exp: undefined,
    mults: undefined,
    city: undefined,
  };
  if (!roughlyIs(fakePerson, p)) throw makeRuntimeErrorMsg(ctx, `person should be a Person.`, "TYPE");
  return p as IPerson;
}

function server(ctx: NetscriptContext, s: unknown): Server {
  const fakeServer = {
    cpuCores: undefined,
    ftpPortOpen: undefined,
    hasAdminRights: undefined,
    hostname: undefined,
    httpPortOpen: undefined,
    ip: undefined,
    isConnectedTo: undefined,
    maxRam: undefined,
    organizationName: undefined,
    ramUsed: undefined,
    smtpPortOpen: undefined,
    sqlPortOpen: undefined,
    sshPortOpen: undefined,
    purchasedByPlayer: undefined,
    backdoorInstalled: undefined,
    baseDifficulty: undefined,
    hackDifficulty: undefined,
    minDifficulty: undefined,
    moneyAvailable: undefined,
    moneyMax: undefined,
    numOpenPortsRequired: undefined,
    openPortCount: undefined,
    requiredHackingSkill: undefined,
    serverGrowth: undefined,
  };
  if (!roughlyIs(fakeServer, s)) throw makeRuntimeErrorMsg(ctx, `server should be a Server.`, "TYPE");
  return s as Server;
}

function roughlyIs(expect: object, actual: unknown): boolean {
  if (typeof actual !== "object" || actual == null) return false;

  const expects = Object.keys(expect);
  const actuals = Object.keys(actual);
  for (const expect of expects)
    if (!actuals.includes(expect)) {
      return false;
    }
  return true;
}

function gang(ctx: NetscriptContext, g: unknown): FormulaGang {
  if (!roughlyIs({ respect: 0, territory: 0, wantedLevel: 0 }, g))
    throw makeRuntimeErrorMsg(ctx, `gang should be a Gang.`, "TYPE");
  return g as FormulaGang;
}

function gangMember(ctx: NetscriptContext, m: unknown): GangMember {
  if (!roughlyIs(new GangMember(), m)) throw makeRuntimeErrorMsg(ctx, `member should be a GangMember.`, "TYPE");
  return m as GangMember;
}

function gangTask(ctx: NetscriptContext, t: unknown): GangMemberTask {
  if (!roughlyIs(new GangMemberTask("", "", false, false, { hackWeight: 100 }), t))
    throw makeRuntimeErrorMsg(ctx, `task should be a GangMemberTask.`, "TYPE");
  return t as GangMemberTask;
}

function log(ctx: NetscriptContext, message: () => string) {
  ctx.workerScript.log(ctx.functionPath, message);
}

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
function getRunningScriptByArgs(
  ctx: NetscriptContext,
  fn: string,
  hostname: string,
  scriptArgs: ScriptArg[],
): RunningScript | null {
  if (!Array.isArray(scriptArgs)) {
    throw helpers.makeRuntimeErrorMsg(
      ctx,
      "Invalid scriptArgs argument passed into getRunningScriptByArgs().\n" +
        "This is probably a bug. Please report to game developer",
    );
  }

  if (fn != null && typeof fn === "string") {
    // Get Logs of another script
    if (hostname == null) {
      hostname = ctx.workerScript.hostname;
    }
    const server = helpers.getServer(ctx, hostname);

    return findRunningScript(fn, scriptArgs, server);
  }

  // If no arguments are specified, return the current RunningScript
  return ctx.workerScript.scriptRef;
}

function getRunningScriptByPid(pid: number): RunningScript | null {
  for (const server of GetAllServers()) {
    const runningScript = findRunningScriptByPid(pid, server);
    if (runningScript) return runningScript;
  }
  return null;
}

function getRunningScript(ctx: NetscriptContext, ident: ScriptIdentifier): RunningScript | null {
  if (typeof ident === "number") {
    return getRunningScriptByPid(ident);
  } else {
    return getRunningScriptByArgs(ctx, ident.scriptname, ident.hostname, ident.args);
  }
}

/**
 * Helper function for getting the error log message when the user specifies
 * a nonexistent running script
 * @param {string} fn - Filename of script
 * @param {string} hostname - Hostname/ip of the server on which the script resides
 * @param {any[]} scriptArgs - Running script's arguments
 * @returns {string} Error message to print to logs
 */
function getCannotFindRunningScriptErrorMessage(ident: ScriptIdentifier): string {
  if (typeof ident === "number") return `Cannot find running script with pid: ${ident}`;

  return `Cannot find running script ${ident.scriptname} on server ${ident.hostname} with args: ${arrayToString(
    ident.args,
  )}`;
}

/**
 * Sanitizes a `RunningScript` to remove sensitive information, making it suitable for
 * return through an NS function.
 * @see NS.getRecentScripts
 * @see NS.getRunningScript
 * @param runningScript Existing, internal RunningScript
 * @returns A sanitized, NS-facing copy of the RunningScript
 */
function createPublicRunningScript(runningScript: RunningScript): IRunningScript {
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
}

/**
 * Used to fail a function if the function's target is a Hacknet Server.
 * This is used for functions that should run on normal Servers, but not Hacknet Servers
 * @param {Server} server - Target server
 * @param {string} callingFn - Name of calling function. For logging purposes
 * @returns {boolean} True if the server is a Hacknet Server, false otherwise
 */
function failOnHacknetServer(ctx: NetscriptContext, server: BaseServer): boolean {
  if (server instanceof HacknetServer) {
    log(ctx, () => `Does not work on Hacknet Servers`);
    return true;
  } else {
    return false;
  }
}

/** Generate an error dialog when workerscript is known */
export function handleUnknownError(e: unknown, ws: WorkerScript | ScriptDeath | null = null, initialText = "") {
  if (e instanceof ScriptDeath) {
    //No dialog for an empty ScriptDeath
    if (e.errorMessage === "") return;
    if (!ws) {
      ws = e;
      e = ws.errorMessage;
    }
  }
  if (ws && typeof e === "string") {
    const headerText = makeBasicErrorMsg(ws, "", "");
    if (!e.includes(headerText)) e = makeBasicErrorMsg(ws, e);
  } else if (e instanceof SyntaxError) {
    const msg = `${e.message} (sorry we can't be more helpful)`;
    e = ws ? makeBasicErrorMsg(ws, msg, "SYNTAX") : `SYNTAX ERROR:\n\n${msg}`;
  } else if (e instanceof Error) {
    // Ignore any cancellation errors from Monaco that get here
    if (e.name === "Canceled" && e.message === "Canceled") return;
    const msg = `${e.message}${e.stack ? `\nstack:\n${e.stack.toString()}` : ""}`;
    e = ws ? makeBasicErrorMsg(ws, msg) : `RUNTIME ERROR:\n\n${msg}`;
  }
  if (typeof e !== "string") {
    console.error("Unexpected error:", e);
    const msg = `Unexpected type of error thrown. This error was likely thrown manually within a script.
      Error has been logged to the console.\n\nType of error: ${typeof e}\nValue of error: ${e}`;
    e = ws ? makeBasicErrorMsg(ws, msg, "UNKNOWN") : msg;
  }
  dialogBoxCreate(initialText + e);
}
