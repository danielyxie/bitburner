import { NetscriptContext } from "./APIWrapper";
import { WorkerScript } from "./WorkerScript";
import { GetServer } from "../Server/AllServers";
import { Player } from "../Player";
import { ScriptDeath } from "./ScriptDeath";
import { isString } from "../utils/helpers/isString";
import { numeralWrapper } from "../ui/numeralFormat";
import { ScriptArg } from "./ScriptArg";
import { CityName } from "../Locations/data/CityNames";
import { BasicHGWOptions } from "src/ScriptEditor/NetscriptDefinitions";
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
import { IPort } from "../NetscriptPort";
import { NetscriptPorts } from "../NetscriptWorker";
import { IPlayer } from "../PersonObjects/IPlayer";
import { FormulaGang } from "../Gang/formulas/formulas";
import { GangMember } from "../Gang/GangMember";
import { GangMemberTask } from "../Gang/GangMemberTask";

//Helpers that are not specific to use in WorkerScripts/NetscriptContexts should be in src/utils/helpers instead

export const helpers = {
  //Type checking, conversion, validation
  string,
  number,
  scriptArgs,
  isScriptErrorMessage,
  //Error checking and generation
  makeRuntimeRejectMsg,
  makeRuntimeErrorMsg,
  resolveNetscriptRequestedThreads,
  //Checking for API access or flags that would prevent a function from running
  checkEnvFlags,
  checkSingularityAccess,
  //Functionality
  netscriptDelay,
  updateDynamicRam,
  city,
  getServer,
  scriptIdentifier,
  hack,
  getValidPort,
  player,
  server,
  gang,
  gangMember,
  gangTask,
  log,
};

export type ScriptIdentifier =  //This was previously in INetscriptHelper.ts, may move to its own file or a generic types file.
  | number
  | {
      scriptname: string;
      hostname: string;
      args: ScriptArg[];
    };

function string(ctx: NetscriptContext, argName: string, v: unknown): string {
  if (typeof v === "string") return v;
  if (typeof v === "number") return v + ""; // cast to string;
  throw makeRuntimeErrorMsg(ctx, `'${argName}' should be a string.`);
}

function number(ctx: NetscriptContext, argName: string, v: unknown): number {
  if (typeof v === "string") {
    const x = parseFloat(v);
    if (!isNaN(x)) return x; // otherwise it wasn't even a string representing a number.
  } else if (typeof v === "number") {
    if (isNaN(v)) throw makeRuntimeErrorMsg(ctx, `'${argName}' is NaN.`);
    return v;
  }
  throw makeRuntimeErrorMsg(ctx, `'${argName}' should be a number.`);
}

function scriptArgs(ctx: NetscriptContext, args: unknown) {
  if (!isScriptArgs(args)) throw makeRuntimeErrorMsg(ctx, "'args' is not an array of script args");
  return args;
}

function isScriptErrorMessage(msg: string): boolean {
  if (!isString(msg)) {
    return false;
  }
  const splitMsg = msg.split("|DELIMITER|");
  return splitMsg.length == 4;
}

function makeRuntimeRejectMsg(workerScript: WorkerScript, msg: string): string {
  for (const scriptUrl of workerScript.scriptRef.dependencies) {
    msg = msg.replace(new RegExp(scriptUrl.url, "g"), scriptUrl.filename);
  }

  return "|DELIMITER|" + workerScript.hostname + "|DELIMITER|" + workerScript.name + "|DELIMITER|" + msg;
}

function makeRuntimeErrorMsg(ctx: NetscriptContext, msg: string): string {
  const errstack = new Error().stack;
  if (errstack === undefined) throw new Error("how did we not throw an error?");
  const stack = errstack.split("\n").slice(1);
  const workerScript = ctx.workerScript;
  const caller = ctx.function;
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
}

function resolveNetscriptRequestedThreads(ctx: NetscriptContext, requestedThreads?: number): number {
  const threads = ctx.workerScript.scriptRef.threads;
  if (!requestedThreads) {
    return isNaN(threads) || threads < 1 ? 1 : threads;
  }
  const requestedThreadsAsInt = requestedThreads | 0;
  if (isNaN(requestedThreads) || requestedThreadsAsInt < 1) {
    throw makeRuntimeRejectMsg(
      ctx.workerScript,
      `Invalid thread count passed to ${ctx.function}: ${requestedThreads}. Threads must be a positive number.`,
    );
  }
  if (requestedThreadsAsInt > threads) {
    throw makeRuntimeRejectMsg(
      ctx.workerScript,
      `Too many threads requested by ${ctx.function}. Requested: ${requestedThreads}. Has: ${threads}.`,
    );
  }
  return requestedThreadsAsInt;
}

function checkSingularityAccess(ctx: NetscriptContext): void {
  if (Player.bitNodeN !== 4 && Player.sourceFileLvl(4) === 0) {
    throw makeRuntimeErrorMsg(
      ctx,
      `This singularity function requires Source-File 4 to run. A power up you obtain later in the game.
      It will be very obvious when and how you can obtain it.`,
    );
  }
}

function checkEnvFlags(ctx: NetscriptContext): void {
  const ws = ctx.workerScript;
  if (ws.env.stopFlag) throw new ScriptDeath(ws);
  if (ws.env.runningFn && ctx.function !== "asleep") {
    ws.errorMessage = makeRuntimeRejectMsg(
      ws,
      `Concurrent calls to Netscript functions are not allowed!
      Did you forget to await hack(), grow(), or some other
      promise-returning function?
      Currently running: ${ws.env.runningFn} tried to run: ${ctx.function}`,
    );
    if (ws.delayReject) ws.delayReject(new ScriptDeath(ws));
    throw new ScriptDeath(ws); //No idea if this is the right thing to throw
  }
}

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

function updateDynamicRam(ctx: NetscriptContext, ramCost: number): void {
  const ws = ctx.workerScript;
  const fnName = ctx.function;
  if (ws.dynamicLoadedFns[fnName]) return;
  ws.dynamicLoadedFns[fnName] = true;

  let threads = ws.scriptRef.threads;
  if (typeof threads !== "number") {
    console.warn(`WorkerScript detected NaN for threadcount for ${ws.name} on ${ws.hostname}`);
    threads = 1;
  }
  ws.dynamicRamUsage += ramCost;
  if (ws.dynamicRamUsage > 1.01 * ws.ramUsage) {
    ws.errorMessage = makeRuntimeRejectMsg(
      ws,
      `Dynamic RAM usage calculated to be greater than initial RAM usage on fn: ${fnName}.
      This is probably because you somehow circumvented the static RAM calculation.

      Threads: ${threads}
      Dynamic RAM Usage: ${numeralWrapper.formatRAM(ws.dynamicRamUsage)}
      Static RAM Usage: ${numeralWrapper.formatRAM(ws.ramUsage)}

      One of these could be the reason:
      * Using eval() to get a reference to a ns function
      &nbsp;&nbsp;const myScan = eval('ns.scan');

      * Using map access to do the same
      &nbsp;&nbsp;const myScan = ns['scan'];

      Sorry :(`,
    );
  }
}

function city(ctx: NetscriptContext, argName: string, v: unknown): CityName {
  if (typeof v !== "string") throw makeRuntimeErrorMsg(ctx, `${argName} should be a city name.`);
  const s = v as CityName;
  if (!Object.values(CityName).includes(s)) throw makeRuntimeErrorMsg(ctx, `${argName} should be a city name.`);
  return s;
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
  throw new Error("not implemented");
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

async function hack(
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
  const canHack = netscriptCanHack(server, Player);
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
      return Promise.resolve(moneyGained);
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
      return Promise.resolve(0);
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
  const iport = NetscriptPorts[port - 1];
  if (iport == null || !(iport instanceof Object)) {
    throw makeRuntimeErrorMsg(ctx, `Could not find port: ${port}. This is a bug. Report to dev.`);
  }
  return iport;
}

function player(ctx: NetscriptContext, p: unknown): IPlayer {
  const fakePlayer = {
    hp: undefined,
    mults: undefined,
    numPeopleKilled: undefined,
    money: undefined,
    city: undefined,
    location: undefined,
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
  if (!roughlyIs(fakePlayer, p)) throw makeRuntimeErrorMsg(ctx, `player should be a Player.`);
  return p as IPlayer;
}

function server(ctx: NetscriptContext, s: unknown): Server {
  if (!roughlyIs(new Server(), s)) throw makeRuntimeErrorMsg(ctx, `server should be a Server.`);
  return s as Server;
}

function roughlyIs(expect: object, actual: unknown): boolean {
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
}

function gang(ctx: NetscriptContext, g: unknown): FormulaGang {
  if (!roughlyIs({ respect: 0, territory: 0, wantedLevel: 0 }, g))
    throw makeRuntimeErrorMsg(ctx, `gang should be a Gang.`);
  return g as FormulaGang;
}

function gangMember(ctx: NetscriptContext, m: unknown): GangMember {
  if (!roughlyIs(new GangMember(), m)) throw makeRuntimeErrorMsg(ctx, `member should be a GangMember.`);
  return m as GangMember;
}

function gangTask(ctx: NetscriptContext, t: unknown): GangMemberTask {
  if (!roughlyIs(new GangMemberTask("", "", false, false, {}), t))
    throw makeRuntimeErrorMsg(ctx, `task should be a GangMemberTask.`);
  return t as GangMemberTask;
}
function log(ctx: NetscriptContext, message: () => string) {
  ctx.workerScript.log(ctx.functionPath, message);
}
