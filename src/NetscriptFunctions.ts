import $ from "jquery";
import { vsprintf, sprintf } from "sprintf-js";
import { WorkerScriptStartStopEventEmitter } from "./Netscript/WorkerScriptStartStopEventEmitter";
import { BitNodeMultipliers, IBitNodeMultipliers } from "./BitNode/BitNodeMultipliers";
import { CONSTANTS } from "./Constants";
import {
  calculateHackingChance,
  calculateHackingExpGain,
  calculatePercentMoneyHacked,
  calculateHackingTime,
  calculateGrowTime,
  calculateWeakenTime,
} from "./Hacking";
import { netscriptCanGrow, netscriptCanWeaken } from "./Hacking/netscriptCanHack";
import { Terminal } from "./Terminal";
import { Player } from "@player";
import { Programs } from "./Programs/Programs";
import { Script } from "./Script/Script";
import { isScriptFilename } from "./Script/isScriptFilename";
import { PromptEvent } from "./ui/React/PromptManager";
import { GetServer, DeleteServer, AddToAllServers, createUniqueRandomIp } from "./Server/AllServers";
import {
  getServerOnNetwork,
  numCycleForGrowth,
  numCycleForGrowthCorrected,
  processSingleServerGrowth,
  safelyCreateUniqueServer,
} from "./Server/ServerHelpers";
import {
  getPurchasedServerUpgradeCost,
  getPurchaseServerCost,
  getPurchaseServerLimit,
  getPurchaseServerMaxRam,
  renamePurchasedServer,
  upgradePurchasedServer,
} from "./Server/ServerPurchases";
import { Server } from "./Server/Server";
import { influenceStockThroughServerGrow } from "./StockMarket/PlayerInfluencing";
import { isValidFilePath, removeLeadingSlash } from "./Terminal/DirectoryHelpers";
import { TextFile, getTextFile, createTextFile } from "./TextFile";
import { runScriptFromScript } from "./NetscriptWorker";
import { killWorkerScript } from "./Netscript/killWorkerScript";
import { workerScripts } from "./Netscript/WorkerScripts";
import { WorkerScript } from "./Netscript/WorkerScript";
import { helpers, assertObjectType } from "./Netscript/NetscriptHelpers";
import { numeralWrapper } from "./ui/numeralFormat";
import { convertTimeMsToTimeElapsedString, formatNumber } from "./utils/StringHelperFunctions";
import { LogBoxEvents, LogBoxCloserEvents, LogBoxPositionEvents, LogBoxSizeEvents } from "./ui/React/LogBoxManager";
import { arrayToString } from "./utils/helpers/arrayToString";
import { isString } from "./utils/helpers/isString";
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
import { NS, RecentScript, BasicHGWOptions, ProcessInfo, NSEnums } from "./ScriptEditor/NetscriptDefinitions";
import { NetscriptSingularity } from "./NetscriptFunctions/Singularity";

import { dialogBoxCreate } from "./ui/React/DialogBox";
import { SnackbarEvents, ToastVariant } from "./ui/React/Snackbar";
import { checkEnum } from "./utils/helpers/enum";

import { Flags } from "./NetscriptFunctions/Flags";
import { calculateIntelligenceBonus } from "./PersonObjects/formulas/intelligence";
import { CalculateShareMult, StartSharing } from "./NetworkShare/Share";
import { recentScripts } from "./Netscript/RecentScripts";
import { ExternalAPI, InternalAPI, StampedLayer, wrapAPILayer } from "./Netscript/APIWrapper";
import { INetscriptExtra } from "./NetscriptFunctions/Extra";
import { ScriptDeath } from "./Netscript/ScriptDeath";
import { getBitNodeMultipliers } from "./BitNode/BitNode";
import { assert, arrayAssert, stringAssert, objectAssert } from "./utils/helpers/typeAssertion";
import { CompanyPosName, CrimeType, GymType, LocationName, UniversityClassType } from "./utils/enums";
import { cloneDeep } from "lodash";
import { FactionWorkType } from "./utils/enums";

export const enums: NSEnums = {
  toast: ToastVariant,
  CrimeType,
  FactionWorkType,
  GymType,
  UniversityClassType,
  CompanyPosName,
  LocationName,
};

export type NSFull = Readonly<Omit<NS & INetscriptExtra, "pid" | "args">>;

export const ns: InternalAPI<NSFull> = {
  enums,
  singularity: NetscriptSingularity(),
  gang: NetscriptGang(),
  bladeburner: NetscriptBladeburner(),
  codingcontract: NetscriptCodingContract(),
  sleeve: NetscriptSleeve(),
  corporation: NetscriptCorporation(),
  stanek: NetscriptStanek(),
  infiltration: NetscriptInfiltration(),
  ui: NetscriptUserInterface(),
  formulas: NetscriptFormulas(),
  stock: NetscriptStockMarket(),
  grafting: NetscriptGrafting(),
  hacknet: NetscriptHacknet(),
  sprintf: () => sprintf,
  vsprintf: () => vsprintf,
  scan: (ctx) => (_hostname) => {
    const hostname = _hostname ? helpers.string(ctx, "hostname", _hostname) : ctx.workerScript.hostname;
    const server = helpers.getServer(ctx, hostname);
    const out: string[] = [];
    for (let i = 0; i < server.serversOnNetwork.length; i++) {
      const s = getServerOnNetwork(server, i);
      if (s === null) continue;
      const entry = s.hostname;
      if (entry === null) continue;
      out.push(entry);
    }
    helpers.log(ctx, () => `returned ${server.serversOnNetwork.length} connections for ${server.hostname}`);
    return out;
  },
  hasTorRouter: () => () => Player.hasTorRouter(),
  hack:
    (ctx) =>
    (_hostname, opts = {}) => {
      const hostname = helpers.string(ctx, "hostname", _hostname);
      // Todo: better type safety rework for functions using assertObjectType, then remove function.
      const optsValidator: BasicHGWOptions = {};
      assertObjectType(ctx, "opts", opts, optsValidator);
      return helpers.hack(ctx, hostname, false, { threads: opts.threads, stock: opts.stock });
    },
  hackAnalyzeThreads: (ctx) => (_hostname, _hackAmount) => {
    const hostname = helpers.string(ctx, "hostname", _hostname);
    const hackAmount = helpers.number(ctx, "hackAmount", _hackAmount);

    // Check argument validity
    const server = helpers.getServer(ctx, hostname);
    if (!(server instanceof Server)) {
      helpers.log(ctx, () => "Cannot be executed on this server.");
      return -1;
    }
    if (isNaN(hackAmount)) {
      throw helpers.makeRuntimeErrorMsg(
        ctx,
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
  hackAnalyze: (ctx) => (_hostname) => {
    const hostname = helpers.string(ctx, "hostname", _hostname);

    const server = helpers.getServer(ctx, hostname);
    if (!(server instanceof Server)) {
      helpers.log(ctx, () => "Cannot be executed on this server.");
      return 0;
    }

    return calculatePercentMoneyHacked(server, Player);
  },
  hackAnalyzeSecurity: (ctx) => (_threads, _hostname?) => {
    let threads = helpers.number(ctx, "threads", _threads);
    if (_hostname) {
      const hostname = helpers.string(ctx, "hostname", _hostname);
      const server = helpers.getServer(ctx, hostname);
      if (!(server instanceof Server)) {
        helpers.log(ctx, () => "Cannot be executed on this server.");
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
  hackAnalyzeChance: (ctx) => (_hostname) => {
    const hostname = helpers.string(ctx, "hostname", _hostname);

    const server = helpers.getServer(ctx, hostname);
    if (!(server instanceof Server)) {
      helpers.log(ctx, () => "Cannot be executed on this server.");
      return 0;
    }

    return calculateHackingChance(server, Player);
  },
  sleep:
    (ctx) =>
    (_time = 0) => {
      const time = helpers.number(ctx, "time", _time);
      helpers.log(ctx, () => `Sleeping for ${time} milliseconds`);
      return helpers.netscriptDelay(ctx, time).then(function () {
        return Promise.resolve(true);
      });
    },
  asleep:
    (ctx) =>
    (_time = 0) => {
      const time = helpers.number(ctx, "time", _time);
      helpers.log(ctx, () => `Sleeping for ${time} milliseconds`);
      return new Promise((resolve) => setTimeout(() => resolve(true), time));
    },
  grow:
    (ctx) =>
    (_hostname, opts = {}) => {
      const hostname = helpers.string(ctx, "hostname", _hostname);
      const optsValidator: BasicHGWOptions = {};
      assertObjectType(ctx, "opts", opts, optsValidator);
      const requestedThreads =
        opts.threads === undefined
          ? ctx.workerScript.scriptRef.threads
          : helpers.number(ctx, "opts.threads", opts.threads);
      const threads = helpers.resolveNetscriptRequestedThreads(ctx, requestedThreads);

      const server = helpers.getServer(ctx, hostname);
      if (!(server instanceof Server)) {
        helpers.log(ctx, () => "Cannot be executed on this server.");
        return Promise.resolve(0);
      }

      const host = GetServer(ctx.workerScript.hostname);
      if (host === null) {
        throw new Error("Workerscript host is null");
      }

      // No root access or skill level too low
      const canHack = netscriptCanGrow(server);
      if (!canHack.res) {
        throw helpers.makeRuntimeErrorMsg(ctx, canHack.msg || "");
      }

      const growTime = calculateGrowTime(server, Player);
      helpers.log(
        ctx,
        () =>
          `Executing on '${server.hostname}' in ${convertTimeMsToTimeElapsedString(
            growTime * 1000,
            true,
          )} (t=${numeralWrapper.formatThreads(threads)}).`,
      );
      return helpers.netscriptDelay(ctx, growTime * 1000).then(function () {
        const moneyBefore = server.moneyAvailable <= 0 ? 1 : server.moneyAvailable;
        processSingleServerGrowth(server, threads, host.cpuCores);
        const moneyAfter = server.moneyAvailable;
        ctx.workerScript.scriptRef.recordGrow(server.hostname, threads);
        const expGain = calculateHackingExpGain(server, Player) * threads;
        const logGrowPercent = moneyAfter / moneyBefore - 1;
        helpers.log(
          ctx,
          () =>
            `Available money on '${server.hostname}' grown by ${numeralWrapper.formatPercentage(
              logGrowPercent,
              6,
            )}. Gained ${numeralWrapper.formatExp(expGain)} hacking exp (t=${numeralWrapper.formatThreads(threads)}).`,
        );
        ctx.workerScript.scriptRef.onlineExpGained += expGain;
        Player.gainHackingExp(expGain);
        if (opts.stock) {
          influenceStockThroughServerGrow(server, moneyAfter - moneyBefore);
        }
        return Promise.resolve(moneyAfter / moneyBefore);
      });
    },
  growthAnalyze:
    (ctx) =>
    (_hostname, _growth, _cores = 1) => {
      const hostname = helpers.string(ctx, "hostname", _hostname);
      const growth = helpers.number(ctx, "growth", _growth);
      const cores = helpers.number(ctx, "cores", _cores);

      // Check argument validity
      const server = helpers.getServer(ctx, hostname);
      if (!(server instanceof Server)) {
        helpers.log(ctx, () => "Cannot be executed on this server.");
        return 0;
      }
      if (typeof growth !== "number" || isNaN(growth) || growth < 1 || !isFinite(growth)) {
        throw helpers.makeRuntimeErrorMsg(ctx, `Invalid argument: growth must be numeric and >= 1, is ${growth}.`);
      }

      return numCycleForGrowth(server, Number(growth), cores);
    },
  growthAnalyzeSecurity:
    (ctx) =>
    (_threads, _hostname?, _cores = 1) => {
      let threads = helpers.number(ctx, "threads", _threads);
      if (_hostname) {
        const cores = helpers.number(ctx, "cores", _cores);
        const hostname = helpers.string(ctx, "hostname", _hostname);
        const server = helpers.getServer(ctx, hostname);

        if (!(server instanceof Server)) {
          helpers.log(ctx, () => "Cannot be executed on this server.");
          return 0;
        }

        const maxThreadsNeeded = Math.ceil(
          numCycleForGrowthCorrected(server, server.moneyMax, server.moneyAvailable, cores),
        );

        threads = Math.min(threads, maxThreadsNeeded);
      }

      return 2 * CONSTANTS.ServerFortifyAmount * threads;
    },
  weaken:
    (ctx) =>
    async (_hostname, opts = {}) => {
      const hostname = helpers.string(ctx, "hostname", _hostname);
      const optsValidator: BasicHGWOptions = {};
      assertObjectType(ctx, "opts", opts, optsValidator);
      const requestedThreads =
        opts.threads === undefined
          ? ctx.workerScript.scriptRef.threads
          : helpers.number(ctx, "opts.threads", opts.threads);
      const threads = helpers.resolveNetscriptRequestedThreads(ctx, requestedThreads);

      const server = helpers.getServer(ctx, hostname);
      if (!(server instanceof Server)) {
        helpers.log(ctx, () => "Cannot be executed on this server.");
        return Promise.resolve(0);
      }

      // No root access or skill level too low
      const canHack = netscriptCanWeaken(server);
      if (!canHack.res) {
        throw helpers.makeRuntimeErrorMsg(ctx, canHack.msg || "");
      }

      const weakenTime = calculateWeakenTime(server, Player);
      helpers.log(
        ctx,
        () =>
          `Executing on '${server.hostname}' in ${convertTimeMsToTimeElapsedString(
            weakenTime * 1000,
            true,
          )} (t=${numeralWrapper.formatThreads(threads)})`,
      );
      return helpers.netscriptDelay(ctx, weakenTime * 1000).then(function () {
        const host = GetServer(ctx.workerScript.hostname);
        if (host === null) {
          helpers.log(ctx, () => "Server is null, did it die?");
          return Promise.resolve(0);
        }
        const coreBonus = 1 + (host.cpuCores - 1) / 16;
        server.weaken(CONSTANTS.ServerWeakenAmount * threads * coreBonus);
        ctx.workerScript.scriptRef.recordWeaken(server.hostname, threads);
        const expGain = calculateHackingExpGain(server, Player) * threads;
        helpers.log(
          ctx,
          () =>
            `'${server.hostname}' security level weakened to ${
              server.hackDifficulty
            }. Gained ${numeralWrapper.formatExp(expGain)} hacking exp (t=${numeralWrapper.formatThreads(threads)})`,
        );
        ctx.workerScript.scriptRef.onlineExpGained += expGain;
        Player.gainHackingExp(expGain);
        return Promise.resolve(CONSTANTS.ServerWeakenAmount * threads * coreBonus);
      });
    },
  weakenAnalyze:
    (ctx) =>
    (_threads, _cores = 1) => {
      const threads = helpers.number(ctx, "threads", _threads);
      const cores = helpers.number(ctx, "cores", _cores);
      const coreBonus = 1 + (cores - 1) / 16;
      return CONSTANTS.ServerWeakenAmount * threads * coreBonus * BitNodeMultipliers.ServerWeakenRate;
    },
  share: (ctx) => () => {
    helpers.log(ctx, () => "Sharing this computer.");
    const end = StartSharing(
      ctx.workerScript.scriptRef.threads * calculateIntelligenceBonus(Player.skills.intelligence, 2),
    );
    return helpers.netscriptDelay(ctx, 10000).finally(function () {
      helpers.log(ctx, () => "Finished sharing this computer.");
      end();
    });
  },
  getSharePower: () => () => {
    return CalculateShareMult();
  },
  print:
    (ctx) =>
    (...args) => {
      if (args.length === 0) {
        throw helpers.makeRuntimeErrorMsg(ctx, "Takes at least 1 argument.");
      }
      ctx.workerScript.print(helpers.argsToString(args));
    },
  printf:
    (ctx) =>
    (_format, ...args) => {
      const format = helpers.string(ctx, "format", _format);
      if (typeof format !== "string") {
        throw helpers.makeRuntimeErrorMsg(ctx, "First argument must be string for the format.");
      }
      ctx.workerScript.print(vsprintf(format, args));
    },
  tprint:
    (ctx) =>
    (...args) => {
      if (args.length === 0) {
        throw helpers.makeRuntimeErrorMsg(ctx, "Takes at least 1 argument.");
      }
      const str = helpers.argsToString(args);
      if (str.startsWith("ERROR") || str.startsWith("FAIL")) {
        Terminal.error(`${ctx.workerScript.scriptRef.filename}: ${str}`);
        return;
      }
      if (str.startsWith("SUCCESS")) {
        Terminal.success(`${ctx.workerScript.scriptRef.filename}: ${str}`);
        return;
      }
      if (str.startsWith("WARN")) {
        Terminal.warn(`${ctx.workerScript.scriptRef.filename}: ${str}`);
        return;
      }
      if (str.startsWith("INFO")) {
        Terminal.info(`${ctx.workerScript.scriptRef.filename}: ${str}`);
        return;
      }
      Terminal.print(`${ctx.workerScript.scriptRef.filename}: ${str}`);
    },
  tprintf:
    (ctx) =>
    (_format, ...args) => {
      const format = helpers.string(ctx, "format", _format);
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
  clearLog: (ctx) => () => {
    ctx.workerScript.scriptRef.clearLog();
  },
  disableLog: (ctx) => (_fn) => {
    const fn = helpers.string(ctx, "fn", _fn);
    if (fn === "ALL") {
      for (const fn of Object.keys(possibleLogs)) {
        ctx.workerScript.disableLogs[fn] = true;
      }
      helpers.log(ctx, () => `Disabled logging for all functions`);
    } else if (possibleLogs[fn] === undefined) {
      throw helpers.makeRuntimeErrorMsg(ctx, `Invalid argument: ${fn}.`);
    } else {
      ctx.workerScript.disableLogs[fn] = true;
      helpers.log(ctx, () => `Disabled logging for ${fn}`);
    }
  },
  enableLog: (ctx) => (_fn) => {
    const fn = helpers.string(ctx, "fn", _fn);
    if (fn === "ALL") {
      for (const fn of Object.keys(possibleLogs)) {
        delete ctx.workerScript.disableLogs[fn];
      }
      helpers.log(ctx, () => `Enabled logging for all functions`);
    } else if (possibleLogs[fn] === undefined) {
      throw helpers.makeRuntimeErrorMsg(ctx, `Invalid argument: ${fn}.`);
    }
    delete ctx.workerScript.disableLogs[fn];
    helpers.log(ctx, () => `Enabled logging for ${fn}`);
  },
  isLogEnabled: (ctx) => (_fn) => {
    const fn = helpers.string(ctx, "fn", _fn);
    if (possibleLogs[fn] === undefined) {
      throw helpers.makeRuntimeErrorMsg(ctx, `Invalid argument: ${fn}.`);
    }
    return !ctx.workerScript.disableLogs[fn];
  },
  getScriptLogs:
    (ctx) =>
    (scriptID, hostname, ...scriptArgs) => {
      const ident = helpers.scriptIdentifier(ctx, scriptID, hostname, scriptArgs);
      const runningScriptObj = helpers.getRunningScript(ctx, ident);
      if (runningScriptObj == null) {
        helpers.log(ctx, () => helpers.getCannotFindRunningScriptErrorMessage(ident));
        return [] as string[];
      }

      return runningScriptObj.logs.slice();
    },
  tail:
    (ctx) =>
    (scriptID, hostname, ...scriptArgs) => {
      const ident = helpers.scriptIdentifier(ctx, scriptID, hostname, scriptArgs);
      const runningScriptObj = helpers.getRunningScript(ctx, ident);
      if (runningScriptObj == null) {
        helpers.log(ctx, () => helpers.getCannotFindRunningScriptErrorMessage(ident));
        return;
      }

      LogBoxEvents.emit(runningScriptObj);
    },
  moveTail:
    (ctx) =>
    (_x, _y, _pid = ctx.workerScript.scriptRef.pid) => {
      const x = helpers.number(ctx, "x", _x);
      const y = helpers.number(ctx, "y", _y);
      const pid = helpers.number(ctx, "pid", _pid);
      LogBoxPositionEvents.emit({ pid, data: { x, y } });
    },
  resizeTail:
    (ctx) =>
    (_w, _h, _pid = ctx.workerScript.scriptRef.pid) => {
      const w = helpers.number(ctx, "w", _w);
      const h = helpers.number(ctx, "h", _h);
      const pid = helpers.number(ctx, "pid", _pid);
      LogBoxSizeEvents.emit({ pid, data: { w, h } });
    },
  closeTail:
    (ctx) =>
    (_pid = ctx.workerScript.scriptRef.pid) => {
      const pid = helpers.number(ctx, "pid", _pid);
      //Emit an event to tell the game to close the tail window if it exists
      LogBoxCloserEvents.emit(pid);
    },
  nuke: (ctx) => (_hostname) => {
    const hostname = helpers.string(ctx, "hostname", _hostname);

    const server = helpers.getServer(ctx, hostname);
    if (!(server instanceof Server)) {
      helpers.log(ctx, () => "Cannot be executed on this server.");
      return false;
    }
    if (server.hasAdminRights) {
      helpers.log(ctx, () => `Already have root access to '${server.hostname}'.`);
      return true;
    }
    if (!Player.hasProgram(Programs.NukeProgram.name)) {
      throw helpers.makeRuntimeErrorMsg(ctx, "You do not have the NUKE.exe virus!");
    }
    if (server.openPortCount < server.numOpenPortsRequired) {
      throw helpers.makeRuntimeErrorMsg(ctx, "Not enough ports opened to use NUKE.exe virus.");
    }
    server.hasAdminRights = true;
    helpers.log(ctx, () => `Executed NUKE.exe virus on '${server.hostname}' to gain root access.`);
    return true;
  },
  brutessh: (ctx) => (_hostname) => {
    const hostname = helpers.string(ctx, "hostname", _hostname);
    const server = helpers.getServer(ctx, hostname);
    if (!(server instanceof Server)) {
      helpers.log(ctx, () => "Cannot be executed on this server.");
      return false;
    }
    if (!Player.hasProgram(Programs.BruteSSHProgram.name)) {
      throw helpers.makeRuntimeErrorMsg(ctx, "You do not have the BruteSSH.exe program!");
    }
    if (!server.sshPortOpen) {
      helpers.log(ctx, () => `Executed BruteSSH.exe on '${server.hostname}' to open SSH port (22).`);
      server.sshPortOpen = true;
      ++server.openPortCount;
    } else {
      helpers.log(ctx, () => `SSH Port (22) already opened on '${server.hostname}'.`);
    }
    return true;
  },
  ftpcrack: (ctx) => (_hostname) => {
    const hostname = helpers.string(ctx, "hostname", _hostname);
    const server = helpers.getServer(ctx, hostname);
    if (!(server instanceof Server)) {
      helpers.log(ctx, () => "Cannot be executed on this server.");
      return false;
    }
    if (!Player.hasProgram(Programs.FTPCrackProgram.name)) {
      throw helpers.makeRuntimeErrorMsg(ctx, "You do not have the FTPCrack.exe program!");
    }
    if (!server.ftpPortOpen) {
      helpers.log(ctx, () => `Executed FTPCrack.exe on '${server.hostname}' to open FTP port (21).`);
      server.ftpPortOpen = true;
      ++server.openPortCount;
    } else {
      helpers.log(ctx, () => `FTP Port (21) already opened on '${server.hostname}'.`);
    }
    return true;
  },
  relaysmtp: (ctx) => (_hostname) => {
    const hostname = helpers.string(ctx, "hostname", _hostname);
    const server = helpers.getServer(ctx, hostname);
    if (!(server instanceof Server)) {
      helpers.log(ctx, () => "Cannot be executed on this server.");
      return false;
    }
    if (!Player.hasProgram(Programs.RelaySMTPProgram.name)) {
      throw helpers.makeRuntimeErrorMsg(ctx, "You do not have the relaySMTP.exe program!");
    }
    if (!server.smtpPortOpen) {
      helpers.log(ctx, () => `Executed relaySMTP.exe on '${server.hostname}' to open SMTP port (25).`);
      server.smtpPortOpen = true;
      ++server.openPortCount;
    } else {
      helpers.log(ctx, () => `SMTP Port (25) already opened on '${server.hostname}'.`);
    }
    return true;
  },
  httpworm: (ctx) => (_hostname) => {
    const hostname = helpers.string(ctx, "hostname", _hostname);
    const server = helpers.getServer(ctx, hostname);
    if (!(server instanceof Server)) {
      helpers.log(ctx, () => "Cannot be executed on this server.");
      return false;
    }
    if (!Player.hasProgram(Programs.HTTPWormProgram.name)) {
      throw helpers.makeRuntimeErrorMsg(ctx, "You do not have the HTTPWorm.exe program!");
    }
    if (!server.httpPortOpen) {
      helpers.log(ctx, () => `Executed HTTPWorm.exe on '${server.hostname}' to open HTTP port (80).`);
      server.httpPortOpen = true;
      ++server.openPortCount;
    } else {
      helpers.log(ctx, () => `HTTP Port (80) already opened on '${server.hostname}'.`);
    }
    return true;
  },
  sqlinject: (ctx) => (_hostname) => {
    const hostname = helpers.string(ctx, "hostname", _hostname);
    const server = helpers.getServer(ctx, hostname);
    if (!(server instanceof Server)) {
      helpers.log(ctx, () => "Cannot be executed on this server.");
      return false;
    }
    if (!Player.hasProgram(Programs.SQLInjectProgram.name)) {
      throw helpers.makeRuntimeErrorMsg(ctx, "You do not have the SQLInject.exe program!");
    }
    if (!server.sqlPortOpen) {
      helpers.log(ctx, () => `Executed SQLInject.exe on '${server.hostname}' to open SQL port (1433).`);
      server.sqlPortOpen = true;
      ++server.openPortCount;
    } else {
      helpers.log(ctx, () => `SQL Port (1433) already opened on '${server.hostname}'.`);
    }
    return true;
  },
  run:
    (ctx) =>
    (_scriptname, _threads = 1, ..._args) => {
      const scriptname = helpers.string(ctx, "scriptname", _scriptname);
      const threads = helpers.number(ctx, "threads", _threads);
      const args = helpers.scriptArgs(ctx, _args);
      if (isNaN(threads) || threads <= 0) {
        throw helpers.makeRuntimeErrorMsg(ctx, `Invalid thread count. Must be numeric and > 0, is ${threads}`);
      }
      const scriptServer = GetServer(ctx.workerScript.hostname);
      if (scriptServer == null) {
        throw helpers.makeRuntimeErrorMsg(ctx, "Could not find server. This is a bug. Report to dev.");
      }

      return runScriptFromScript("run", scriptServer, scriptname, args, ctx.workerScript, threads);
    },
  exec:
    (ctx) =>
    (_scriptname, _hostname, _threads = 1, ..._args) => {
      const scriptname = helpers.string(ctx, "scriptname", _scriptname);
      const hostname = helpers.string(ctx, "hostname", _hostname);
      const threads = helpers.number(ctx, "threads", _threads);
      const args = helpers.scriptArgs(ctx, _args);
      if (isNaN(threads) || threads <= 0) {
        throw helpers.makeRuntimeErrorMsg(ctx, `Invalid thread count. Must be numeric and > 0, is ${threads}`);
      }
      const server = helpers.getServer(ctx, hostname);
      return runScriptFromScript("exec", server, scriptname, args, ctx.workerScript, threads);
    },
  spawn:
    (ctx) =>
    (_scriptname, _threads = 1, ..._args) => {
      const scriptname = helpers.string(ctx, "scriptname", _scriptname);
      const threads = helpers.number(ctx, "threads", _threads);
      const args = helpers.scriptArgs(ctx, _args);
      if (!scriptname || !threads) {
        throw helpers.makeRuntimeErrorMsg(ctx, "Usage: spawn(scriptname, threads)");
      }

      const spawnDelay = 10;
      setTimeout(() => {
        if (isNaN(threads) || threads <= 0) {
          throw helpers.makeRuntimeErrorMsg(ctx, `Invalid thread count. Must be numeric and > 0, is ${threads}`);
        }
        const scriptServer = GetServer(ctx.workerScript.hostname);
        if (scriptServer == null) {
          throw helpers.makeRuntimeErrorMsg(ctx, "Could not find server. This is a bug. Report to dev");
        }

        return runScriptFromScript("spawn", scriptServer, scriptname, args, ctx.workerScript, threads);
      }, spawnDelay * 1e3);

      helpers.log(ctx, () => `Will execute '${scriptname}' in ${spawnDelay} seconds`);

      if (killWorkerScript(ctx.workerScript)) {
        helpers.log(ctx, () => "Exiting...");
      }
    },
  kill:
    (ctx) =>
    (scriptID, hostname?, ...scriptArgs) => {
      const ident = helpers.scriptIdentifier(ctx, scriptID, hostname, scriptArgs);
      let res;
      const killByPid = typeof ident === "number";
      if (killByPid) {
        // Kill by pid
        res = killWorkerScript(ident);
      } else {
        // Kill by filename/hostname
        if (scriptID === undefined || hostname === undefined) {
          throw helpers.makeRuntimeErrorMsg(ctx, "Usage: kill(scriptname, server, [arg1], [arg2]...)");
        }

        const server = helpers.getServer(ctx, ident.hostname);
        const runningScriptObj = helpers.getRunningScriptByArgs(ctx, ident.scriptname, ident.hostname, ident.args);
        if (runningScriptObj == null) {
          helpers.log(ctx, () => helpers.getCannotFindRunningScriptErrorMessage(ident));
          return false;
        }

        res = killWorkerScript({ runningScript: runningScriptObj, hostname: server.hostname });
      }

      if (res) {
        if (killByPid) {
          helpers.log(ctx, () => `Killing script with PID ${ident}`);
        } else {
          helpers.log(ctx, () => `Killing '${scriptID}' on '${hostname}' with args: ${arrayToString(scriptArgs)}.`);
        }
        return true;
      } else {
        if (killByPid) {
          helpers.log(ctx, () => `No script with PID ${ident}`);
        } else {
          helpers.log(
            ctx,
            () => `No such script '${scriptID}' on '${hostname}' with args: ${arrayToString(scriptArgs)}`,
          );
        }
        return false;
      }
    },
  killall:
    (ctx) =>
    (_hostname = ctx.workerScript.hostname, _safetyguard = true) => {
      const hostname = helpers.string(ctx, "hostname", _hostname);
      const safetyguard = !!_safetyguard;
      const server = helpers.getServer(ctx, hostname);

      let scriptsKilled = 0;

      for (let i = server.runningScripts.length - 1; i >= 0; --i) {
        if (safetyguard === true && server.runningScripts[i].pid == ctx.workerScript.pid) continue;
        killWorkerScript({ runningScript: server.runningScripts[i], hostname: server.hostname });
        ++scriptsKilled;
      }
      WorkerScriptStartStopEventEmitter.emit();
      helpers.log(
        ctx,
        () => `Killing all scripts on '${server.hostname}'. May take a few minutes for the scripts to die.`,
      );

      return scriptsKilled > 0;
    },
  exit: (ctx) => () => {
    helpers.log(ctx, () => "Exiting...");
    killWorkerScript(ctx.workerScript);
    throw new ScriptDeath(ctx.workerScript);
  },
  scp:
    (ctx) =>
    (_files, _destination, _source = ctx.workerScript.hostname) => {
      const destination = helpers.string(ctx, "destination", _destination);
      const source = helpers.string(ctx, "source", _source);
      const destServer = helpers.getServer(ctx, destination);
      const sourceServ = helpers.getServer(ctx, source);
      const files = Array.isArray(_files) ? _files : [_files];

      //First loop through filenames to find all errors before moving anything.
      for (const file of files) {
        // Not a string
        if (typeof file !== "string")
          throw helpers.makeRuntimeErrorMsg(ctx, "files should be a string or an array of strings.");

        // Invalid file name
        if (!isValidFilePath(file)) throw helpers.makeRuntimeErrorMsg(ctx, `Invalid filename: '${file}'`);

        // Invalid file type
        if (!file.endsWith(".lit") && !isScriptFilename(file) && !file.endsWith(".txt")) {
          throw helpers.makeRuntimeErrorMsg(ctx, "Only works for scripts, .lit and .txt files.");
        }
      }

      let noFailures = true;
      //ts detects files as any[] here even though we would have thrown in the above loop if it wasn't string[]
      for (const file of files as string[]) {
        // Scp for lit files
        if (file.endsWith(".lit")) {
          const sourceMessage = sourceServ.messages.find((message) => message === file);
          if (!sourceMessage) {
            helpers.log(ctx, () => `File '${file}' does not exist.`);
            noFailures = false;
            continue;
          }

          const destMessage = destServer.messages.find((message) => message === file);
          if (destMessage) {
            helpers.log(ctx, () => `File '${file}' was already on '${destServer?.hostname}'.`);
            continue;
          }

          destServer.messages.push(file);
          helpers.log(ctx, () => `File '${file}' copied over to '${destServer?.hostname}'.`);
          continue;
        }

        // Scp for text files
        if (file.endsWith(".txt")) {
          const sourceTextFile = sourceServ.textFiles.find((textFile) => textFile.fn === file);
          if (!sourceTextFile) {
            helpers.log(ctx, () => `File '${file}' does not exist.`);
            noFailures = false;
            continue;
          }

          const destTextFile = destServer.textFiles.find((textFile) => textFile.fn === file);
          if (destTextFile) {
            destTextFile.text = sourceTextFile.text;
            helpers.log(ctx, () => `File '${file}' overwritten on '${destServer?.hostname}'.`);
            continue;
          }

          const newFile = new TextFile(sourceTextFile.fn, sourceTextFile.text);
          destServer.textFiles.push(newFile);
          helpers.log(ctx, () => `File '${file}' copied over to '${destServer?.hostname}'.`);
          continue;
        }

        // Scp for script files
        const sourceScript = sourceServ.scripts.find((script) => script.filename === file);
        if (!sourceScript) {
          helpers.log(ctx, () => `File '${file}' does not exist.`);
          noFailures = false;
          continue;
        }

        // Overwrite script if it already exists
        const destScript = destServer.scripts.find((script) => script.filename === file);
        if (destScript) {
          if (destScript.code === sourceScript.code) {
            helpers.log(ctx, () => `Identical file '${file}' was already on '${destServer?.hostname}'`);
            continue;
          }
          destScript.code = sourceScript.code;
          destScript.ramUsage = sourceScript.ramUsage;
          destScript.markUpdated();
          helpers.log(ctx, () => `WARNING: File '${file}' overwritten on '${destServer?.hostname}'`);
          continue;
        }

        // Create new script if it does not already exist
        const newScript = new Script(file);
        newScript.code = sourceScript.code;
        newScript.ramUsage = sourceScript.ramUsage;
        newScript.server = destServer.hostname;
        destServer.scripts.push(newScript);
        helpers.log(ctx, () => `File '${file}' copied over to '${destServer?.hostname}'.`);
        newScript.updateRamUsage(destServer.scripts);
      }

      return noFailures;
    },
  ls:
    (ctx) =>
    (_hostname, _grep = ""): string[] => {
      const hostname = helpers.string(ctx, "hostname", _hostname);
      const grep = helpers.string(ctx, "grep", _grep);

      const server = helpers.getServer(ctx, hostname);

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
  getRecentScripts: () => (): RecentScript[] => {
    return recentScripts.map((rs) => ({
      timeOfDeath: rs.timeOfDeath,
      ...helpers.createPublicRunningScript(rs.runningScript),
    }));
  },
  ps:
    (ctx) =>
    (_hostname = ctx.workerScript.hostname) => {
      const hostname = helpers.string(ctx, "hostname", _hostname);
      const server = helpers.getServer(ctx, hostname);
      const processes: ProcessInfo[] = [];
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
  hasRootAccess: (ctx) => (_hostname) => {
    const hostname = helpers.string(ctx, "hostname", _hostname);
    const server = helpers.getServer(ctx, hostname);
    return server.hasAdminRights;
  },
  getHostname: (ctx) => () => ctx.workerScript.hostname,
  getHackingLevel: (ctx) => () => {
    Player.updateSkillLevels();
    helpers.log(ctx, () => `returned ${Player.skills.hacking}`);
    return Player.skills.hacking;
  },
  getHackingMultipliers: () => () => {
    return {
      chance: Player.mults.hacking_chance,
      speed: Player.mults.hacking_speed,
      money: Player.mults.hacking_money,
      growth: Player.mults.hacking_grow,
    };
  },
  getHacknetMultipliers: () => () => {
    return {
      production: Player.mults.hacknet_node_money,
      purchaseCost: Player.mults.hacknet_node_purchase_cost,
      ramCost: Player.mults.hacknet_node_ram_cost,
      coreCost: Player.mults.hacknet_node_core_cost,
      levelCost: Player.mults.hacknet_node_level_cost,
    };
  },
  getBitNodeMultipliers:
    (ctx) =>
    (_n = Player.bitNodeN, _lvl = Player.sourceFileLvl(Player.bitNodeN) + 1): IBitNodeMultipliers => {
      if (Player.sourceFileLvl(5) <= 0 && Player.bitNodeN !== 5)
        throw helpers.makeRuntimeErrorMsg(ctx, "Requires Source-File 5 to run.");
      const n = Math.round(helpers.number(ctx, "n", _n));
      const lvl = Math.round(helpers.number(ctx, "lvl", _lvl));
      if (n < 1 || n > 13) throw new Error("n must be between 1 and 13");
      if (lvl < 1) throw new Error("lvl must be >= 1");

      return Object.assign({}, getBitNodeMultipliers(n, lvl));
    },
  getServer:
    (ctx) =>
    (_hostname = ctx.workerScript.hostname) => {
      const hostname = helpers.string(ctx, "hostname", _hostname);
      const server = helpers.getServer(ctx, hostname);
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
  getServerMoneyAvailable: (ctx) => (_hostname) => {
    const hostname = helpers.string(ctx, "hostname", _hostname);
    const server = helpers.getServer(ctx, hostname);
    if (!(server instanceof Server)) {
      helpers.log(ctx, () => "Cannot be executed on this server.");
      return 0;
    }
    if (helpers.failOnHacknetServer(ctx, server)) {
      return 0;
    }
    if (server.hostname == "home") {
      // Return player's money
      helpers.log(ctx, () => `returned player's money: ${numeralWrapper.formatMoney(Player.money)}`);
      return Player.money;
    }
    helpers.log(ctx, () => `returned ${numeralWrapper.formatMoney(server.moneyAvailable)} for '${server.hostname}'`);
    return server.moneyAvailable;
  },
  getServerSecurityLevel: (ctx) => (_hostname) => {
    const hostname = helpers.string(ctx, "hostname", _hostname);
    const server = helpers.getServer(ctx, hostname);
    if (!(server instanceof Server)) {
      helpers.log(ctx, () => "Cannot be executed on this server.");
      return 1;
    }
    if (helpers.failOnHacknetServer(ctx, server)) {
      return 1;
    }
    helpers.log(
      ctx,
      () => `returned ${numeralWrapper.formatServerSecurity(server.hackDifficulty)} for '${server.hostname}'`,
    );
    return server.hackDifficulty;
  },
  getServerBaseSecurityLevel: (ctx) => (_hostname) => {
    const hostname = helpers.string(ctx, "hostname", _hostname);
    helpers.log(ctx, () => `getServerBaseSecurityLevel is deprecated because it's not useful.`);
    const server = helpers.getServer(ctx, hostname);
    if (!(server instanceof Server)) {
      helpers.log(ctx, () => "Cannot be executed on this server.");
      return 1;
    }
    if (helpers.failOnHacknetServer(ctx, server)) {
      return 1;
    }
    helpers.log(
      ctx,
      () => `returned ${numeralWrapper.formatServerSecurity(server.baseDifficulty)} for '${server.hostname}'`,
    );
    return server.baseDifficulty;
  },
  getServerMinSecurityLevel: (ctx) => (_hostname) => {
    const hostname = helpers.string(ctx, "hostname", _hostname);
    const server = helpers.getServer(ctx, hostname);
    if (!(server instanceof Server)) {
      helpers.log(ctx, () => "Cannot be executed on this server.");
      return 1;
    }
    if (helpers.failOnHacknetServer(ctx, server)) {
      return 1;
    }
    helpers.log(
      ctx,
      () => `returned ${numeralWrapper.formatServerSecurity(server.minDifficulty)} for ${server.hostname}`,
    );
    return server.minDifficulty;
  },
  getServerRequiredHackingLevel: (ctx) => (_hostname) => {
    const hostname = helpers.string(ctx, "hostname", _hostname);
    const server = helpers.getServer(ctx, hostname);
    if (!(server instanceof Server)) {
      helpers.log(ctx, () => "Cannot be executed on this server.");
      return 1;
    }
    if (helpers.failOnHacknetServer(ctx, server)) {
      return 1;
    }
    helpers.log(ctx, () => `returned ${formatNumber(server.requiredHackingSkill, 0)} for '${server.hostname}'`);
    return server.requiredHackingSkill;
  },
  getServerMaxMoney: (ctx) => (_hostname) => {
    const hostname = helpers.string(ctx, "hostname", _hostname);
    const server = helpers.getServer(ctx, hostname);
    if (!(server instanceof Server)) {
      helpers.log(ctx, () => "Cannot be executed on this server.");
      return 0;
    }
    if (helpers.failOnHacknetServer(ctx, server)) {
      return 0;
    }
    helpers.log(ctx, () => `returned ${numeralWrapper.formatMoney(server.moneyMax)} for '${server.hostname}'`);
    return server.moneyMax;
  },
  getServerGrowth: (ctx) => (_hostname) => {
    const hostname = helpers.string(ctx, "hostname", _hostname);
    const server = helpers.getServer(ctx, hostname);
    if (!(server instanceof Server)) {
      helpers.log(ctx, () => "Cannot be executed on this server.");
      return 1;
    }
    if (helpers.failOnHacknetServer(ctx, server)) {
      return 1;
    }
    helpers.log(ctx, () => `returned ${server.serverGrowth} for '${server.hostname}'`);
    return server.serverGrowth;
  },
  getServerNumPortsRequired: (ctx) => (_hostname) => {
    const hostname = helpers.string(ctx, "hostname", _hostname);
    const server = helpers.getServer(ctx, hostname);
    if (!(server instanceof Server)) {
      helpers.log(ctx, () => "Cannot be executed on this server.");
      return 5;
    }
    if (helpers.failOnHacknetServer(ctx, server)) {
      return 5;
    }
    helpers.log(ctx, () => `returned ${server.numOpenPortsRequired} for '${server.hostname}'`);
    return server.numOpenPortsRequired;
  },
  getServerRam:
    (ctx) =>
    (_hostname): [number, number] => {
      const hostname = helpers.string(ctx, "hostname", _hostname);
      helpers.log(ctx, () => `getServerRam is deprecated in favor of getServerMaxRam / getServerUsedRam`);
      const server = helpers.getServer(ctx, hostname);
      helpers.log(
        ctx,
        () => `returned [${numeralWrapper.formatRAM(server.maxRam)}, ${numeralWrapper.formatRAM(server.ramUsed)}]`,
      );
      return [server.maxRam, server.ramUsed];
    },
  getServerMaxRam: (ctx) => (_hostname) => {
    const hostname = helpers.string(ctx, "hostname", _hostname);
    const server = helpers.getServer(ctx, hostname);
    helpers.log(ctx, () => `returned ${numeralWrapper.formatRAM(server.maxRam)}`);
    return server.maxRam;
  },
  getServerUsedRam: (ctx) => (_hostname) => {
    const hostname = helpers.string(ctx, "hostname", _hostname);
    const server = helpers.getServer(ctx, hostname);
    helpers.log(ctx, () => `returned ${numeralWrapper.formatRAM(server.ramUsed)}`);
    return server.ramUsed;
  },
  serverExists: (ctx) => (_hostname) => {
    const hostname = helpers.string(ctx, "hostname", _hostname);
    return GetServer(hostname) !== null;
  },
  fileExists:
    (ctx) =>
    (_filename, _hostname = ctx.workerScript.hostname) => {
      const filename = helpers.string(ctx, "filename", _filename);
      const hostname = helpers.string(ctx, "hostname", _hostname);
      const server = helpers.getServer(ctx, hostname);
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
      const contract = server.contracts.find((c) => c.fn.toLowerCase() === filename.toLowerCase());
      if (contract) return true;
      const txtFile = getTextFile(filename, server);
      return txtFile != null;
    },
  isRunning:
    (ctx) =>
    (fn, hostname, ...scriptArgs) => {
      const ident = helpers.scriptIdentifier(ctx, fn, hostname, scriptArgs);
      return helpers.getRunningScript(ctx, ident) !== null;
    },
  getPurchasedServerLimit: () => () => {
    return getPurchaseServerLimit();
  },
  getPurchasedServerMaxRam: () => () => {
    return getPurchaseServerMaxRam();
  },
  getPurchasedServerCost: (ctx) => (_ram) => {
    const ram = helpers.number(ctx, "ram", _ram);

    const cost = getPurchaseServerCost(ram);
    if (cost === Infinity) {
      helpers.log(ctx, () => `Invalid argument: ram='${ram}'`);
      return Infinity;
    }

    return cost;
  },
  purchaseServer: (ctx) => (_name, _ram) => {
    const name = helpers.string(ctx, "name", _name);
    const ram = helpers.number(ctx, "ram", _ram);
    let hostnameStr = String(name);
    hostnameStr = hostnameStr.replace(/\s+/g, "");
    if (hostnameStr == "") {
      helpers.log(ctx, () => `Invalid argument: hostname='${hostnameStr}'`);
      return "";
    }

    if (Player.purchasedServers.length >= getPurchaseServerLimit()) {
      helpers.log(
        ctx,
        () =>
          `You have reached the maximum limit of ${getPurchaseServerLimit()} servers. You cannot purchase any more.`,
      );
      return "";
    }

    const cost = getPurchaseServerCost(ram);
    if (cost === Infinity) {
      if (ram > getPurchaseServerMaxRam()) {
        helpers.log(ctx, () => `Invalid argument: ram='${ram}' must not be greater than getPurchaseServerMaxRam`);
      } else {
        helpers.log(ctx, () => `Invalid argument: ram='${ram}' must be a positive power of 2`);
      }

      return "";
    }

    if (Player.money < cost) {
      helpers.log(ctx, () => `Not enough money to purchase server. Need ${numeralWrapper.formatMoney(cost)}`);
      return "";
    }
    const newServ = safelyCreateUniqueServer({
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
    helpers.log(
      ctx,
      () => `Purchased new server with hostname '${newServ.hostname}' for ${numeralWrapper.formatMoney(cost)}`,
    );
    return newServ.hostname;
  },

  getPurchasedServerUpgradeCost: (ctx) => (_hostname, _ram) => {
    const hostname = helpers.string(ctx, "hostname", _hostname);
    const ram = helpers.number(ctx, "ram", _ram);
    try {
      return getPurchasedServerUpgradeCost(hostname, ram);
    } catch (err) {
      helpers.log(ctx, () => String(err));
      return -1;
    }
  },
  upgradePurchasedServer: (ctx) => (_hostname, _ram) => {
    const hostname = helpers.string(ctx, "hostname", _hostname);
    const ram = helpers.number(ctx, "ram", _ram);
    try {
      upgradePurchasedServer(hostname, ram);
      return true;
    } catch (err) {
      helpers.log(ctx, () => String(err));
      return false;
    }
  },
  renamePurchasedServer: (ctx) => (_hostname, _newName) => {
    const hostname = helpers.string(ctx, "hostname", _hostname);
    const newName = helpers.string(ctx, "newName", _newName);
    try {
      renamePurchasedServer(hostname, newName);
      return true;
    } catch (err) {
      helpers.log(ctx, () => String(err));
      return false;
    }
    return false;
  },

  deleteServer: (ctx) => (_name) => {
    const name = helpers.string(ctx, "name", _name);
    let hostnameStr = String(name);
    hostnameStr = hostnameStr.replace(/\s\s+/g, "");
    const server = GetServer(hostnameStr);
    if (!(server instanceof Server)) {
      helpers.log(ctx, () => `Invalid argument: hostname='${hostnameStr}'`);
      return false;
    }

    if (!server.purchasedByPlayer || server.hostname === "home") {
      helpers.log(ctx, () => "Cannot delete non-purchased server.");
      return false;
    }

    const hostname = server.hostname;

    // Can't delete server you're currently connected to
    if (server.isConnectedTo) {
      helpers.log(ctx, () => "You are currently connected to the server you are trying to delete.");
      return false;
    }

    // A server cannot delete itself
    if (hostname === ctx.workerScript.hostname) {
      helpers.log(ctx, () => "Cannot delete the server this script is running on.");
      return false;
    }

    // Delete all scripts running on server
    if (server.runningScripts.length > 0) {
      helpers.log(ctx, () => `Cannot delete server '${hostname}' because it still has scripts running.`);
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
      helpers.log(
        ctx,
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
        helpers.log(ctx, () => `Deleted server '${hostnameStr}`);
        return true;
      }
    }
    // Wasn't found on home computer
    helpers.log(ctx, () => `Could not find server ${hostname} as a purchased server. This is a bug. Report to dev.`);
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
    (ctx) =>
    (_port, data): string | number | null => {
      const port = helpers.number(ctx, "port", _port);
      if (typeof data !== "string" && typeof data !== "number") {
        throw helpers.makeRuntimeErrorMsg(
          ctx,
          `Trying to write invalid data to a port: only strings and numbers are valid.`,
        );
      }
      const iport = helpers.getValidPort(ctx, port);
      return iport.write(data);
    },
  write:
    (ctx) =>
    (_filename, _data = "", _mode = "a") => {
      let fn = helpers.string(ctx, "handle", _filename);
      const data = helpers.string(ctx, "data", _data);
      const mode = helpers.string(ctx, "mode", _mode);
      if (!isValidFilePath(fn)) throw helpers.makeRuntimeErrorMsg(ctx, `Invalid filepath: ${fn}`);

      if (fn.lastIndexOf("/") === 0) fn = removeLeadingSlash(fn);

      const server = helpers.getServer(ctx, ctx.workerScript.hostname);

      if (isScriptFilename(fn)) {
        // Write to script
        let script = ctx.workerScript.getScriptOnServer(fn, server);
        if (script == null) {
          // Create a new script
          script = new Script(fn, String(data), server.hostname, server.scripts);
          server.scripts.push(script);
          return script.updateRamUsage(server.scripts);
        }
        mode === "w" ? (script.code = String(data)) : (script.code += data);
        return script.updateRamUsage(server.scripts);
      } else {
        // Write to text file
        if (!fn.endsWith(".txt")) throw helpers.makeRuntimeErrorMsg(ctx, `Invalid filename: ${fn}`);
        const txtFile = getTextFile(fn, server);
        if (txtFile == null) {
          createTextFile(fn, String(data), server);
          return;
        }
        if (mode === "w") {
          txtFile.write(String(data));
        } else {
          txtFile.append(String(data));
        }
      }
      return;
    },
  tryWritePort:
    (ctx) =>
    (_port, data = "") => {
      const port = helpers.number(ctx, "port", _port);
      if (typeof data !== "string" && typeof data !== "number") {
        throw helpers.makeRuntimeErrorMsg(
          ctx,
          `Trying to write invalid data to a port: only strings and numbers are valid.`,
        );
      }
      const iport = helpers.getValidPort(ctx, port);
      return iport.tryWrite(data);
    },
  readPort: (ctx) => (_port) => {
    const port = helpers.number(ctx, "port", _port);
    // Read from port
    const iport = helpers.getValidPort(ctx, port);
    const x = iport.read();
    return x;
  },
  read: (ctx) => (_filename) => {
    const fn = helpers.string(ctx, "filename", _filename);
    const server = GetServer(ctx.workerScript.hostname);
    if (server == null) {
      throw helpers.makeRuntimeErrorMsg(ctx, "Error getting Server. This is a bug. Report to dev.");
    }
    if (isScriptFilename(fn)) {
      // Read from script
      const script = ctx.workerScript.getScriptOnServer(fn, server);
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
  },
  peek: (ctx) => (_port) => {
    const port = helpers.number(ctx, "port", _port);
    const iport = helpers.getValidPort(ctx, port);
    const x = iport.peek();
    return x;
  },
  clear: (ctx) => (_file) => {
    const file = helpers.string(ctx, "file", _file);
    if (isString(file)) {
      // Clear text file
      const fn = file;
      const server = GetServer(ctx.workerScript.hostname);
      if (server == null) {
        throw helpers.makeRuntimeErrorMsg(ctx, "Error getting Server. This is a bug. Report to dev.");
      }
      const txtFile = getTextFile(fn, server);
      if (txtFile != null) {
        txtFile.write("");
      }
    } else {
      throw helpers.makeRuntimeErrorMsg(ctx, `Invalid argument: ${file}`);
    }
  },
  clearPort: (ctx) => (_port) => {
    const port = helpers.number(ctx, "port", _port);
    // Clear port
    const iport = helpers.getValidPort(ctx, port);
    iport.clear();
  },
  getPortHandle: (ctx) => (_port) => {
    const port = helpers.number(ctx, "port", _port);
    const iport = helpers.getValidPort(ctx, port);
    return iport;
  },
  rm:
    (ctx) =>
    (_fn, _hostname = ctx.workerScript.hostname) => {
      const fn = helpers.string(ctx, "fn", _fn);
      const hostname = helpers.string(ctx, "hostname", _hostname);
      const s = helpers.getServer(ctx, hostname);

      const status = s.removeFile(fn);
      if (!status.res) {
        helpers.log(ctx, () => status.msg + "");
      }

      return status.res;
    },
  scriptRunning: (ctx) => (_scriptname, _hostname) => {
    const scriptname = helpers.string(ctx, "scriptname", _scriptname);
    const hostname = helpers.string(ctx, "hostname", _hostname);
    const server = helpers.getServer(ctx, hostname);
    for (let i = 0; i < server.runningScripts.length; ++i) {
      if (server.runningScripts[i].filename == scriptname) {
        return true;
      }
    }
    return false;
  },
  scriptKill: (ctx) => (_scriptname, _hostname) => {
    const scriptname = helpers.string(ctx, "scriptname", _scriptname);
    const hostname = helpers.string(ctx, "hostname", _hostname);
    const server = helpers.getServer(ctx, hostname);
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
  getScriptName: (ctx) => () => {
    return ctx.workerScript.name;
  },
  getScriptRam:
    (ctx) =>
    (_scriptname, _hostname = ctx.workerScript.hostname) => {
      const scriptname = helpers.string(ctx, "scriptname", _scriptname);
      const hostname = helpers.string(ctx, "hostname", _hostname);
      const server = helpers.getServer(ctx, hostname);
      for (let i = 0; i < server.scripts.length; ++i) {
        if (server.scripts[i].filename == scriptname) {
          return server.scripts[i].ramUsage;
        }
      }
      return 0;
    },
  getRunningScript:
    (ctx) =>
    (fn, hostname, ...args) => {
      const ident = helpers.scriptIdentifier(ctx, fn, hostname, args);
      const runningScript = helpers.getRunningScript(ctx, ident);
      if (runningScript === null) return null;
      return helpers.createPublicRunningScript(runningScript);
    },
  getHackTime:
    (ctx) =>
    (_hostname = ctx.workerScript.hostname) => {
      const hostname = helpers.string(ctx, "hostname", _hostname);
      const server = helpers.getServer(ctx, hostname);
      if (!(server instanceof Server)) {
        helpers.log(ctx, () => "invalid for this kind of server");
        return Infinity;
      }
      if (helpers.failOnHacknetServer(ctx, server)) {
        return Infinity;
      }

      return calculateHackingTime(server, Player) * 1000;
    },
  getGrowTime:
    (ctx) =>
    (_hostname = ctx.workerScript.hostname) => {
      const hostname = helpers.string(ctx, "hostname", _hostname);
      const server = helpers.getServer(ctx, hostname);
      if (!(server instanceof Server)) {
        helpers.log(ctx, () => "invalid for this kind of server");
        return Infinity;
      }
      if (helpers.failOnHacknetServer(ctx, server)) {
        return Infinity;
      }

      return calculateGrowTime(server, Player) * 1000;
    },
  getWeakenTime:
    (ctx) =>
    (_hostname = ctx.workerScript.hostname) => {
      const hostname = helpers.string(ctx, "hostname", _hostname);
      const server = helpers.getServer(ctx, hostname);
      if (!(server instanceof Server)) {
        helpers.log(ctx, () => "invalid for this kind of server");
        return Infinity;
      }
      if (helpers.failOnHacknetServer(ctx, server)) {
        return Infinity;
      }

      return calculateWeakenTime(server, Player) * 1000;
    },
  getTotalScriptIncome: () => () => {
    // First element is total income of all currently running scripts
    let total = 0;
    for (const script of workerScripts.values()) {
      total += script.scriptRef.onlineMoneyMade / script.scriptRef.onlineRunningTime;
    }

    return [total, Player.scriptProdSinceLastAug / (Player.playtimeSinceLastAug / 1000)];
  },
  getScriptIncome:
    (ctx) =>
    (fn, hostname, ...args) => {
      const ident = helpers.scriptIdentifier(ctx, fn, hostname, args);
      const runningScript = helpers.getRunningScript(ctx, ident);
      if (runningScript == null) {
        helpers.log(ctx, () => helpers.getCannotFindRunningScriptErrorMessage(ident));
        return -1;
      }
      return runningScript.onlineMoneyMade / runningScript.onlineRunningTime;
    },
  getTotalScriptExpGain: () => () => {
    let total = 0;
    for (const ws of workerScripts.values()) {
      total += ws.scriptRef.onlineExpGained / ws.scriptRef.onlineRunningTime;
    }
    return total;
  },
  getScriptExpGain:
    (ctx) =>
    (fn, hostname, ...args) => {
      const ident = helpers.scriptIdentifier(ctx, fn, hostname, args);
      const runningScript = helpers.getRunningScript(ctx, ident);
      if (runningScript == null) {
        helpers.log(ctx, () => helpers.getCannotFindRunningScriptErrorMessage(ident));
        return -1;
      }
      return runningScript.onlineExpGained / runningScript.onlineRunningTime;
    },
  nFormat: (ctx) => (_n, _format) => {
    const n = helpers.number(ctx, "n", _n);
    const format = helpers.string(ctx, "format", _format);
    if (isNaN(n)) {
      return "";
    }

    return numeralWrapper.format(n, format);
  },
  tFormat: (ctx) => (_milliseconds, _milliPrecision) => {
    const milliseconds = helpers.number(ctx, "milliseconds", _milliseconds);
    const milliPrecision = !!_milliPrecision;
    return convertTimeMsToTimeElapsedString(milliseconds, milliPrecision);
  },
  getTimeSinceLastAug: () => () => {
    return Player.playtimeSinceLastAug;
  },
  alert: (ctx) => (_message) => {
    const message = helpers.string(ctx, "message", _message);
    dialogBoxCreate(message, true);
  },
  toast:
    (ctx) =>
    (_message, _variant = ToastVariant.SUCCESS, _duration = 2000) => {
      const message = helpers.string(ctx, "message", _message);
      const variant = helpers.string(ctx, "variant", _variant);
      const duration = _duration === null ? null : helpers.number(ctx, "duration", _duration);
      if (!checkEnum(ToastVariant, variant))
        throw new Error(`variant must be one of ${Object.values(ToastVariant).join(", ")}`);
      SnackbarEvents.emit(message, variant as ToastVariant, duration);
    },
  prompt: (ctx) => (_txt, _options) => {
    const options: { type?: string; choices?: string[] } = {};
    _options ??= options;
    const txt = helpers.string(ctx, "txt", _txt);
    assert(_options, objectAssert, (type) =>
      helpers.makeRuntimeErrorMsg(ctx, `Invalid type for options: ${type}. Should be object.`, "TYPE"),
    );
    if (_options.type !== undefined) {
      assert(_options.type, stringAssert, (type) =>
        helpers.makeRuntimeErrorMsg(ctx, `Invalid type for options.type: ${type}. Should be string.`, "TYPE"),
      );
      options.type = _options.type;
      const validTypes = ["boolean", "text", "select"];
      if (!["boolean", "text", "select"].includes(options.type)) {
        throw helpers.makeRuntimeErrorMsg(
          ctx,
          `Invalid value for options.type: ${options.type}. Must be one of ${validTypes.join(", ")}.`,
        );
      }
      if (options.type === "select") {
        assert(_options.choices, arrayAssert, (type) =>
          helpers.makeRuntimeErrorMsg(
            ctx,
            `Invalid type for options.choices: ${type}. If options.type is "select", options.choices must be an array.`,
            "TYPE",
          ),
        );
        options.choices = _options.choices.map((choice, i) => helpers.string(ctx, `options.choices[${i}]`, choice));
      }
    }
    return new Promise(function (resolve) {
      PromptEvent.emit({
        txt: txt,
        options,
        resolve: resolve,
      });
    });
  },
  wget: (ctx) => async (_url, _target, _hostname) => {
    const url = helpers.string(ctx, "url", _url);
    const target = helpers.string(ctx, "target", _target);
    const hostname = _hostname ? helpers.string(ctx, "hostname", _hostname) : ctx.workerScript.hostname;
    if (!isScriptFilename(target) && !target.endsWith(".txt")) {
      helpers.log(ctx, () => `Invalid target file: '${target}'. Must be a script or text file.`);
      return Promise.resolve(false);
    }
    const s = helpers.getServer(ctx, hostname);
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
            helpers.log(ctx, () => "Failed.");
            return resolve(false);
          }
          if (res.overwritten) {
            helpers.log(ctx, () => `Successfully retrieved content and overwrote '${target}' on '${hostname}'`);
            return resolve(true);
          }
          helpers.log(ctx, () => `Successfully retrieved content to new file '${target}' on '${hostname}'`);
          return resolve(true);
        },
        "text",
      ).fail(function (e) {
        helpers.log(ctx, () => JSON.stringify(e));
        return resolve(false);
      });
    });
  },
  getFavorToDonate: () => () => {
    return Math.floor(CONSTANTS.BaseFavorToDonate * BitNodeMultipliers.RepToDonateToFaction);
  },
  getPlayer: () => () => {
    const data = {
      hp: cloneDeep(Player.hp),
      skills: cloneDeep(Player.skills),
      exp: cloneDeep(Player.exp),
      mults: cloneDeep(Player.mults),
      numPeopleKilled: Player.numPeopleKilled,
      money: Player.money,
      city: Player.city,
      location: Player.location,
      bitNodeN: Player.bitNodeN,
      totalPlaytime: Player.totalPlaytime,
      playtimeSinceLastAug: Player.playtimeSinceLastAug,
      playtimeSinceLastBitnode: Player.playtimeSinceLastBitnode,
      jobs: cloneDeep(Player.jobs),
      factions: Player.factions.slice(),
      entropy: Player.entropy,
    };
    return data;
  },
  getMoneySources: () => () => ({
    sinceInstall: Object.assign({}, Player.moneySourceA),
    sinceStart: Object.assign({}, Player.moneySourceB),
  }),
  atExit: (ctx) => (f) => {
    if (typeof f !== "function") {
      throw helpers.makeRuntimeErrorMsg(ctx, "argument should be function");
    }
    ctx.workerScript.atExit = () => {
      f();
    }; // Wrap the user function to prevent WorkerScript leaking as 'this'
  },
  mv: (ctx) => (_host, _source, _destination) => {
    const host = helpers.string(ctx, "host", _host);
    const source = helpers.string(ctx, "source", _source);
    const destination = helpers.string(ctx, "destination", _destination);

    if (!isValidFilePath(source)) throw helpers.makeRuntimeErrorMsg(ctx, `Invalid filename: '${source}'`);
    if (!isValidFilePath(destination)) throw helpers.makeRuntimeErrorMsg(ctx, `Invalid filename: '${destination}'`);

    const source_is_txt = source.endsWith(".txt");
    const dest_is_txt = destination.endsWith(".txt");

    if (!isScriptFilename(source) && !source_is_txt)
      throw helpers.makeRuntimeErrorMsg(ctx, `'mv' can only be used on scripts and text files (.txt)`);
    if (source_is_txt != dest_is_txt)
      throw helpers.makeRuntimeErrorMsg(ctx, `Source and destination files must have the same type`);

    if (source === destination) {
      return;
    }

    const destServer = helpers.getServer(ctx, host);

    if (!source_is_txt && destServer.isRunning(source))
      throw helpers.makeRuntimeErrorMsg(ctx, `Cannot use 'mv' on a script that is running`);

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

    if (source_file == null) throw helpers.makeRuntimeErrorMsg(ctx, `Source file ${source} does not exist`);

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
  flags: Flags,
  ...NetscriptExtra(),
};

// add undocumented functions
export const wrappedNS = wrapAPILayer({} as ExternalAPI<NSFull>, ns, []);

// Figure out once which layers of ns have functions on them and will need to be stamped with a private workerscript field for API access
const layerLocations: string[][] = [];
function populateLayers(nsLayer: ExternalAPI<unknown>, currentLayers: string[] = []) {
  for (const [k, v] of Object.entries(nsLayer)) {
    if (typeof v === "object" && k !== "enums") {
      if (Object.values(v as object).some((member) => typeof member === "function"))
        layerLocations.push([...currentLayers, k]);
      populateLayers(v as ExternalAPI<unknown>, [...currentLayers, k]);
    }
  }
}
populateLayers(wrappedNS);

export function NetscriptFunctions(ws: WorkerScript): ExternalAPI<NSFull> {
  //todo: better typing instead of relying on an any
  const instance = new StampedLayer(ws, wrappedNS) as any;
  for (const layerLocation of layerLocations) {
    const key = layerLocation.pop() as string;
    const obj = layerLocation.reduce((prev, curr) => prev[curr], instance);
    layerLocation.push(key);
    obj[key] = new StampedLayer(ws, obj[key]);
  }
  instance.args = ws.args.slice();
  instance.pid = ws.pid;
  return instance;
}

const possibleLogs = Object.fromEntries([...getFunctionNames(ns, "")].map((a) => [a, true]));
/** Provides an array of all function names on a nested object */
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
