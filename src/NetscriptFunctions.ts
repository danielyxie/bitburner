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
import { netscriptCanGrow, netscriptCanWeaken } from "./Hacking/netscriptCanHack";
import { Terminal } from "./Terminal";
import { Player } from "./Player";
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
  safetlyCreateUniqueServer,
} from "./Server/ServerHelpers";
import { getPurchaseServerCost, getPurchaseServerLimit, getPurchaseServerMaxRam } from "./Server/ServerPurchases";
import { Server } from "./Server/Server";
import { influenceStockThroughServerGrow } from "./StockMarket/PlayerInfluencing";
import { isValidFilePath, removeLeadingSlash } from "./Terminal/DirectoryHelpers";
import { TextFile, getTextFile, createTextFile } from "./TextFile";
import { NetscriptPorts, runScriptFromScript } from "./NetscriptWorker";
import { killWorkerScript } from "./Netscript/killWorkerScript";
import { workerScripts } from "./Netscript/WorkerScripts";
import { WorkerScript } from "./Netscript/WorkerScript";
import { helpers } from "./Netscript/NetscriptHelpers";
import { numeralWrapper } from "./ui/numeralFormat";
import { convertTimeMsToTimeElapsedString } from "./utils/StringHelperFunctions";
import { LogBoxEvents, LogBoxCloserEvents } from "./ui/React/LogBoxManager";
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
import { IPort } from "./NetscriptPort";
import {
  NS,
  Player as INetscriptPlayer,
  RecentScript as IRecentScript,
  BasicHGWOptions,
  ProcessInfo,
  HackingMultipliers,
  HacknetMultipliers,
  BitNodeMultipliers as IBNMults,
  Server as IServerDef,
  RunningScript as IRunningScriptDef,
} from "./ScriptEditor/NetscriptDefinitions";
import { NetscriptSingularity } from "./NetscriptFunctions/Singularity";

import { dialogBoxCreate } from "./ui/React/DialogBox";
import { SnackbarEvents, ToastVariant } from "./ui/React/Snackbar";
import { checkEnum } from "./utils/helpers/checkEnum";

import { Flags } from "./NetscriptFunctions/Flags";
import { calculateIntelligenceBonus } from "./PersonObjects/formulas/intelligence";
import { CalculateShareMult, StartSharing } from "./NetworkShare/Share";
import { recentScripts } from "./Netscript/RecentScripts";
import { InternalAPI, NetscriptContext, wrapAPI } from "./Netscript/APIWrapper";
import { INetscriptExtra } from "./NetscriptFunctions/Extra";

export type NSFull = NS & INetscriptExtra;

export function NetscriptFunctions(workerScript: WorkerScript): NSFull {
  return wrapAPI(workerScript, ns, workerScript.args.slice());
}

const base: InternalAPI<NS> = {
  args: [],
  enums: {
    toast: ToastVariant,
  },

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
  scan:
    (ctx: NetscriptContext) =>
    (_hostname: unknown = ctx.workerScript.hostname): string[] => {
      const hostname = helpers.string(ctx, "hostname", _hostname);
      const server = helpers.getServer(ctx, hostname);
      const out = [];
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
  hack:
    (ctx: NetscriptContext) =>
    (_hostname: unknown, { threads: requestedThreads, stock }: BasicHGWOptions = {}): Promise<number> => {
      const hostname = helpers.string(ctx, "hostname", _hostname);
      return helpers.hack(ctx, hostname, false, { threads: requestedThreads, stock: stock });
    },
  hackAnalyzeThreads:
    (ctx: NetscriptContext) =>
    (_hostname: unknown, _hackAmount: unknown): number => {
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
  hackAnalyze:
    (ctx: NetscriptContext) =>
    (_hostname: unknown): number => {
      const hostname = helpers.string(ctx, "hostname", _hostname);

      const server = helpers.getServer(ctx, hostname);
      if (!(server instanceof Server)) {
        helpers.log(ctx, () => "Cannot be executed on this server.");
        return 0;
      }

      return calculatePercentMoneyHacked(server, Player);
    },
  hackAnalyzeSecurity:
    (ctx: NetscriptContext) =>
    (_threads: unknown, _hostname?: unknown): number => {
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
  hackAnalyzeChance:
    (ctx: NetscriptContext) =>
    (_hostname: unknown): number => {
      const hostname = helpers.string(ctx, "hostname", _hostname);

      const server = helpers.getServer(ctx, hostname);
      if (!(server instanceof Server)) {
        helpers.log(ctx, () => "Cannot be executed on this server.");
        return 0;
      }

      return calculateHackingChance(server, Player);
    },
  sleep:
    (ctx: NetscriptContext) =>
    async (_time: unknown = 0): Promise<true> => {
      const time = helpers.number(ctx, "time", _time);
      if (time === undefined) {
        throw helpers.makeRuntimeErrorMsg(ctx, "Takes 1 argument.");
      }
      helpers.log(ctx, () => `Sleeping for ${time} milliseconds`);
      return helpers.netscriptDelay(ctx, time).then(function () {
        return Promise.resolve(true);
      });
    },
  asleep: (ctx: NetscriptContext) =>
    function (_time: unknown = 0): Promise<true> {
      const time = helpers.number(ctx, "time", _time);
      helpers.log(ctx, () => `Sleeping for ${time} milliseconds`);
      return new Promise((resolve) => setTimeout(() => resolve(true), time));
    },
  grow:
    (ctx: NetscriptContext) =>
    async (_hostname: unknown, { threads: requestedThreads, stock }: BasicHGWOptions = {}): Promise<number> => {
      const hostname = helpers.string(ctx, "hostname", _hostname);
      const threads = helpers.resolveNetscriptRequestedThreads(
        ctx,
        requestedThreads ?? ctx.workerScript.scriptRef.threads,
      );

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
        processSingleServerGrowth(server, threads, Player, host.cpuCores);
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
        if (stock) {
          influenceStockThroughServerGrow(server, moneyAfter - moneyBefore);
        }
        return Promise.resolve(moneyAfter / moneyBefore);
      });
    },
  growthAnalyze:
    (ctx: NetscriptContext) =>
    (_hostname: unknown, _growth: unknown, _cores: unknown = 1): number => {
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

      return numCycleForGrowth(server, Number(growth), Player, cores);
    },
  growthAnalyzeSecurity:
    (ctx: NetscriptContext) =>
    (_threads: unknown, _hostname?: unknown, _cores?: unknown): number => {
      let threads = helpers.number(ctx, "threads", _threads);
      if (_hostname) {
        const cores = helpers.number(ctx, "cores", _cores) || 1;
        const hostname = helpers.string(ctx, "hostname", _hostname);
        const server = helpers.getServer(ctx, hostname);

        if (!(server instanceof Server)) {
          helpers.log(ctx, () => "Cannot be executed on this server.");
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
      const hostname = helpers.string(ctx, "hostname", _hostname);
      const threads = helpers.resolveNetscriptRequestedThreads(
        ctx,
        requestedThreads ?? ctx.workerScript.scriptRef.threads,
      );
      if (hostname === undefined) {
        throw helpers.makeRuntimeErrorMsg(ctx, "Takes 1 argument.");
      }
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
    (ctx: NetscriptContext) =>
    (_threads: unknown, _cores: unknown = 1): number => {
      const threads = helpers.number(ctx, "threads", _threads);
      const cores = helpers.number(ctx, "cores", _cores);
      const coreBonus = 1 + (cores - 1) / 16;
      return CONSTANTS.ServerWeakenAmount * threads * coreBonus * BitNodeMultipliers.ServerWeakenRate;
    },
  share: (ctx: NetscriptContext) => async (): Promise<void> => {
    helpers.log(ctx, () => "Sharing this computer.");
    const end = StartSharing(
      ctx.workerScript.scriptRef.threads * calculateIntelligenceBonus(Player.skills.intelligence, 2),
    );
    return helpers.netscriptDelay(ctx, 10000).finally(function () {
      helpers.log(ctx, () => "Finished sharing this computer.");
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
        throw helpers.makeRuntimeErrorMsg(ctx, "Takes at least 1 argument.");
      }
      ctx.workerScript.print(helpers.argsToString(args));
    },
  printf:
    (ctx: NetscriptContext) =>
    (_format: unknown, ...args: unknown[]): void => {
      const format = helpers.string(ctx, "format", _format);
      if (typeof format !== "string") {
        throw helpers.makeRuntimeErrorMsg(ctx, "First argument must be string for the format.");
      }
      ctx.workerScript.print(vsprintf(format, args));
    },
  tprint:
    (ctx: NetscriptContext) =>
    (...args: unknown[]): void => {
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
    (ctx: NetscriptContext) =>
    (_format: unknown, ...args: unknown[]): void => {
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
  clearLog: (ctx: NetscriptContext) => (): void => {
    ctx.workerScript.scriptRef.clearLog();
  },
  disableLog:
    (ctx: NetscriptContext) =>
    (_fn: unknown): void => {
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
  enableLog:
    (ctx: NetscriptContext) =>
    (_fn: unknown): void => {
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
  isLogEnabled:
    (ctx: NetscriptContext) =>
    (_fn: unknown): boolean => {
      const fn = helpers.string(ctx, "fn", _fn);
      if (possibleLogs[fn] === undefined) {
        throw helpers.makeRuntimeErrorMsg(ctx, `Invalid argument: ${fn}.`);
      }
      return !ctx.workerScript.disableLogs[fn];
    },
  getScriptLogs:
    (ctx: NetscriptContext) =>
    (scriptID: unknown, hostname: unknown, ...scriptArgs: unknown[]): string[] => {
      const ident = helpers.scriptIdentifier(ctx, scriptID, hostname, scriptArgs);
      const runningScriptObj = helpers.getRunningScript(ctx, ident);
      if (runningScriptObj == null) {
        helpers.log(ctx, () => helpers.getCannotFindRunningScriptErrorMessage(ident));
        return [];
      }

      return runningScriptObj.logs.slice();
    },
  tail:
    (ctx: NetscriptContext) =>
    (scriptID: unknown, hostname: unknown, ...scriptArgs: unknown[]): void => {
      const ident = helpers.scriptIdentifier(ctx, scriptID, hostname, scriptArgs);
      const runningScriptObj = helpers.getRunningScript(ctx, ident);
      if (runningScriptObj == null) {
        helpers.log(ctx, () => helpers.getCannotFindRunningScriptErrorMessage(ident));
        return;
      }

      LogBoxEvents.emit(runningScriptObj);
    },

  closeTail:
    (ctx: NetscriptContext) =>
    (_pid: unknown = ctx.workerScript.scriptRef.pid): void => {
      const pid = helpers.number(ctx, "pid", _pid);
      //Emit an event to tell the game to close the tail window if it exists
      LogBoxCloserEvents.emit(pid);
    },
  nuke:
    (ctx: NetscriptContext) =>
    (_hostname: unknown): boolean => {
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
  brutessh:
    (ctx: NetscriptContext) =>
    (_hostname: unknown): boolean => {
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
  ftpcrack:
    (ctx: NetscriptContext) =>
    (_hostname: unknown): boolean => {
      const hostname = helpers.string(ctx, "hostname", _hostname);
      if (hostname === undefined) {
        throw helpers.makeRuntimeErrorMsg(ctx, "Takes 1 argument.");
      }
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
  relaysmtp:
    (ctx: NetscriptContext) =>
    (_hostname: unknown): boolean => {
      const hostname = helpers.string(ctx, "hostname", _hostname);
      if (hostname === undefined) {
        throw helpers.makeRuntimeErrorMsg(ctx, "Takes 1 argument.");
      }
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
  httpworm:
    (ctx: NetscriptContext) =>
    (_hostname: unknown): boolean => {
      const hostname = helpers.string(ctx, "hostname", _hostname);
      if (hostname === undefined) {
        throw helpers.makeRuntimeErrorMsg(ctx, "Takes 1 argument");
      }
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
  sqlinject:
    (ctx: NetscriptContext) =>
    (_hostname: unknown): boolean => {
      const hostname = helpers.string(ctx, "hostname", _hostname);
      if (hostname === undefined) {
        throw helpers.makeRuntimeErrorMsg(ctx, "Takes 1 argument.");
      }
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
    (ctx: NetscriptContext) =>
    (_scriptname: unknown, _threads: unknown = 1, ..._args: unknown[]): number => {
      const scriptname = helpers.string(ctx, "scriptname", _scriptname);
      const threads = helpers.number(ctx, "threads", _threads);
      const args = helpers.scriptArgs(ctx, _args);
      if (scriptname === undefined) {
        throw helpers.makeRuntimeErrorMsg(ctx, "Usage: run(scriptname, [numThreads], [arg1], [arg2]...)");
      }
      if (isNaN(threads) || threads <= 0) {
        throw helpers.makeRuntimeErrorMsg(ctx, `Invalid thread count. Must be numeric and > 0, is ${threads}`);
      }
      const scriptServer = GetServer(ctx.workerScript.hostname);
      if (scriptServer == null) {
        throw helpers.makeRuntimeErrorMsg(ctx, "Could not find server. This is a bug. Report to dev.");
      }

      return runScriptFromScript(Player, "run", scriptServer, scriptname, args, ctx.workerScript, threads);
    },
  exec:
    (ctx: NetscriptContext) =>
    (_scriptname: unknown, _hostname: unknown, _threads: unknown = 1, ..._args: unknown[]): number => {
      const scriptname = helpers.string(ctx, "scriptname", _scriptname);
      const hostname = helpers.string(ctx, "hostname", _hostname);
      const threads = helpers.number(ctx, "threads", _threads);
      const args = helpers.scriptArgs(ctx, _args);
      if (scriptname === undefined || hostname === undefined) {
        throw helpers.makeRuntimeErrorMsg(ctx, "Usage: exec(scriptname, server, [numThreads], [arg1], [arg2]...)");
      }
      if (isNaN(threads) || threads <= 0) {
        throw helpers.makeRuntimeErrorMsg(ctx, `Invalid thread count. Must be numeric and > 0, is ${threads}`);
      }
      const server = helpers.getServer(ctx, hostname);
      return runScriptFromScript(Player, "exec", server, scriptname, args, ctx.workerScript, threads);
    },
  spawn:
    (ctx: NetscriptContext) =>
    (_scriptname: unknown, _threads: unknown = 1, ..._args: unknown[]): void => {
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

        return runScriptFromScript(Player, "spawn", scriptServer, scriptname, args, ctx.workerScript, threads);
      }, spawnDelay * 1e3);

      helpers.log(ctx, () => `Will execute '${scriptname}' in ${spawnDelay} seconds`);

      ctx.workerScript.running = false; // Prevent workerScript from "finishing execution naturally"
      if (killWorkerScript(ctx.workerScript)) {
        helpers.log(ctx, () => "Exiting...");
      }
    },
  kill:
    (ctx: NetscriptContext) =>
    (scriptID: unknown, hostname: unknown, ...scriptArgs: unknown[]): boolean => {
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
    (ctx: NetscriptContext) =>
    (_hostname: unknown = ctx.workerScript.hostname, _safetyguard: unknown = true): boolean => {
      const hostname = helpers.string(ctx, "hostname", _hostname);
      const safetyguard = !!_safetyguard;
      if (hostname === undefined) {
        throw helpers.makeRuntimeErrorMsg(ctx, "Usage: killall(hostname, [safetyguard boolean])");
      }
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
  exit: (ctx: NetscriptContext) => (): void => {
    ctx.workerScript.running = false; // Prevent workerScript from "finishing execution naturally"
    if (killWorkerScript(ctx.workerScript)) {
      helpers.log(ctx, () => "Exiting...");
    } else {
      helpers.log(ctx, () => "Failed. This is a bug. Report to dev.");
    }
  },
  scp:
    (ctx: NetscriptContext) =>
    async (
      _scriptname: unknown,
      _destination: unknown,
      _source: unknown = ctx.workerScript.hostname,
    ): Promise<boolean> => {
      const destination = helpers.string(ctx, "destination", _destination);
      const source = helpers.string(ctx, "source", _source);
      if (Array.isArray(_scriptname)) {
        // Recursively call scp on all elements of array
        const scripts: string[] = _scriptname;
        if (scripts.length === 0) {
          throw helpers.makeRuntimeErrorMsg(ctx, "No scripts to copy");
        }
        let res = true;
        await Promise.all(
          scripts.map(async function (script) {
            if (!(await NetscriptFunctions(ctx.workerScript).scp(script, destination, source))) {
              res = false;
            }
          }),
        );
        return Promise.resolve(res);
      }

      const scriptName = helpers.string(ctx, "scriptName", _scriptname);

      // Invalid file type
      if (!isValidFilePath(scriptName)) {
        throw helpers.makeRuntimeErrorMsg(ctx, `Invalid filename: '${scriptName}'`);
      }

      // Invalid file name
      if (!scriptName.endsWith(".lit") && !isScriptFilename(scriptName) && !scriptName.endsWith("txt")) {
        throw helpers.makeRuntimeErrorMsg(ctx, "Only works for scripts, .lit and .txt files");
      }

      const destServer = helpers.getServer(ctx, destination);
      const currServ = helpers.getServer(ctx, source);

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
          helpers.log(ctx, () => `File '${scriptName}' does not exist.`);
          return Promise.resolve(false);
        }

        for (let i = 0; i < destServer.messages.length; ++i) {
          if (destServer.messages[i] === scriptName) {
            helpers.log(ctx, () => `File '${scriptName}' copied over to '${destServer?.hostname}'.`);
            return Promise.resolve(true); // Already exists
          }
        }
        destServer.messages.push(scriptName);
        helpers.log(ctx, () => `File '${scriptName}' copied over to '${destServer?.hostname}'.`);
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
          helpers.log(ctx, () => `File '${scriptName}' does not exist.`);
          return Promise.resolve(false);
        }

        for (let i = 0; i < destServer.textFiles.length; ++i) {
          if (destServer.textFiles[i].fn === scriptName) {
            // Overwrite
            destServer.textFiles[i].text = txtFile.text;
            helpers.log(ctx, () => `File '${scriptName}' copied over to '${destServer?.hostname}'.`);
            return Promise.resolve(true);
          }
        }
        const newFile = new TextFile(txtFile.fn, txtFile.text);
        destServer.textFiles.push(newFile);
        helpers.log(ctx, () => `File '${scriptName}' copied over to '${destServer?.hostname}'.`);
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
        helpers.log(ctx, () => `File '${scriptName}' does not exist.`);
        return Promise.resolve(false);
      }

      // Overwrite script if it already exists
      for (let i = 0; i < destServer.scripts.length; ++i) {
        if (scriptName == destServer.scripts[i].filename) {
          helpers.log(ctx, () => `WARNING: File '${scriptName}' overwritten on '${destServer?.hostname}'`);
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
      helpers.log(ctx, () => `File '${scriptName}' copied over to '${destServer?.hostname}'.`);
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
  getRecentScripts: () => (): IRecentScript[] => {
    return recentScripts.map((rs) => ({
      timeOfDeath: rs.timeOfDeath,
      ...helpers.createPublicRunningScript(rs.runningScript),
    }));
  },
  ps:
    (ctx: NetscriptContext) =>
    (_hostname: unknown = ctx.workerScript.hostname): ProcessInfo[] => {
      const hostname = helpers.string(ctx, "hostname", _hostname);
      const server = helpers.getServer(ctx, hostname);
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
      const hostname = helpers.string(ctx, "hostname", _hostname);

      const server = helpers.getServer(ctx, hostname);
      return server.hasAdminRights;
    },
  getHostname: (ctx: NetscriptContext) => (): string => {
    const scriptServer = GetServer(ctx.workerScript.hostname);
    if (scriptServer == null) {
      throw helpers.makeRuntimeErrorMsg(ctx, "Could not find server. This is a bug. Report to dev.");
    }
    return scriptServer.hostname;
  },
  getHackingLevel: (ctx: NetscriptContext) => (): number => {
    Player.updateSkillLevels();
    helpers.log(ctx, () => `returned ${Player.skills.hacking}`);
    return Player.skills.hacking;
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
      throw helpers.makeRuntimeErrorMsg(ctx, "Requires Source-File 5 to run.");
    }
    const copy = Object.assign({}, BitNodeMultipliers);
    return copy;
  },
  getServer:
    (ctx: NetscriptContext) =>
    (_hostname: unknown = ctx.workerScript.hostname): IServerDef => {
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
  getServerMoneyAvailable:
    (ctx: NetscriptContext) =>
    (_hostname: unknown): number => {
      const hostname = helpers.string(ctx, "hostname", _hostname);
      const server = helpers.getServer(ctx, hostname);
      if (!(server instanceof Server)) {
        helpers.log(ctx, () => "Cannot be executed on this server.");
        return 0;
      }
      if (helpers.failOnHacknetServer(ctx, server, "getServerMoneyAvailable")) {
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
  getServerSecurityLevel:
    (ctx: NetscriptContext) =>
    (_hostname: unknown): number => {
      const hostname = helpers.string(ctx, "hostname", _hostname);
      const server = helpers.getServer(ctx, hostname);
      if (!(server instanceof Server)) {
        helpers.log(ctx, () => "Cannot be executed on this server.");
        return 1;
      }
      if (helpers.failOnHacknetServer(ctx, server, "getServerSecurityLevel")) {
        return 1;
      }
      helpers.log(
        ctx,
        () => `returned ${numeralWrapper.formatServerSecurity(server.hackDifficulty)} for '${server.hostname}'`,
      );
      return server.hackDifficulty;
    },
  getServerBaseSecurityLevel:
    (ctx: NetscriptContext) =>
    (_hostname: unknown): number => {
      const hostname = helpers.string(ctx, "hostname", _hostname);
      helpers.log(ctx, () => `getServerBaseSecurityLevel is deprecated because it's not useful.`);
      const server = helpers.getServer(ctx, hostname);
      if (!(server instanceof Server)) {
        helpers.log(ctx, () => "Cannot be executed on this server.");
        return 1;
      }
      if (helpers.failOnHacknetServer(ctx, server, "getServerBaseSecurityLevel")) {
        return 1;
      }
      helpers.log(
        ctx,
        () => `returned ${numeralWrapper.formatServerSecurity(server.baseDifficulty)} for '${server.hostname}'`,
      );
      return server.baseDifficulty;
    },
  getServerMinSecurityLevel:
    (ctx: NetscriptContext) =>
    (_hostname: unknown): number => {
      const hostname = helpers.string(ctx, "hostname", _hostname);
      const server = helpers.getServer(ctx, hostname);
      if (!(server instanceof Server)) {
        helpers.log(ctx, () => "Cannot be executed on this server.");
        return 1;
      }
      if (helpers.failOnHacknetServer(ctx, server, "getServerMinSecurityLevel")) {
        return 1;
      }
      helpers.log(
        ctx,
        () => `returned ${numeralWrapper.formatServerSecurity(server.minDifficulty)} for ${server.hostname}`,
      );
      return server.minDifficulty;
    },
  getServerRequiredHackingLevel:
    (ctx: NetscriptContext) =>
    (_hostname: unknown): number => {
      const hostname = helpers.string(ctx, "hostname", _hostname);
      const server = helpers.getServer(ctx, hostname);
      if (!(server instanceof Server)) {
        helpers.log(ctx, () => "Cannot be executed on this server.");
        return 1;
      }
      if (helpers.failOnHacknetServer(ctx, server, "getServerRequiredHackingLevel")) {
        return 1;
      }
      helpers.log(
        ctx,
        () => `returned ${numeralWrapper.formatSkill(server.requiredHackingSkill)} for '${server.hostname}'`,
      );
      return server.requiredHackingSkill;
    },
  getServerMaxMoney:
    (ctx: NetscriptContext) =>
    (_hostname: unknown): number => {
      const hostname = helpers.string(ctx, "hostname", _hostname);
      const server = helpers.getServer(ctx, hostname);
      if (!(server instanceof Server)) {
        helpers.log(ctx, () => "Cannot be executed on this server.");
        return 0;
      }
      if (helpers.failOnHacknetServer(ctx, server, "getServerMaxMoney")) {
        return 0;
      }
      helpers.log(ctx, () => `returned ${numeralWrapper.formatMoney(server.moneyMax)} for '${server.hostname}'`);
      return server.moneyMax;
    },
  getServerGrowth:
    (ctx: NetscriptContext) =>
    (_hostname: unknown): number => {
      const hostname = helpers.string(ctx, "hostname", _hostname);
      const server = helpers.getServer(ctx, hostname);
      if (!(server instanceof Server)) {
        helpers.log(ctx, () => "Cannot be executed on this server.");
        return 1;
      }
      if (helpers.failOnHacknetServer(ctx, server, "getServerGrowth")) {
        return 1;
      }
      helpers.log(ctx, () => `returned ${server.serverGrowth} for '${server.hostname}'`);
      return server.serverGrowth;
    },
  getServerNumPortsRequired:
    (ctx: NetscriptContext) =>
    (_hostname: unknown): number => {
      const hostname = helpers.string(ctx, "hostname", _hostname);
      const server = helpers.getServer(ctx, hostname);
      if (!(server instanceof Server)) {
        helpers.log(ctx, () => "Cannot be executed on this server.");
        return 5;
      }
      if (helpers.failOnHacknetServer(ctx, server, "getServerNumPortsRequired")) {
        return 5;
      }
      helpers.log(ctx, () => `returned ${server.numOpenPortsRequired} for '${server.hostname}'`);
      return server.numOpenPortsRequired;
    },
  getServerRam:
    (ctx: NetscriptContext) =>
    (_hostname: unknown): [number, number] => {
      const hostname = helpers.string(ctx, "hostname", _hostname);
      helpers.log(ctx, () => `getServerRam is deprecated in favor of getServerMaxRam / getServerUsedRam`);
      const server = helpers.getServer(ctx, hostname);
      helpers.log(
        ctx,
        () => `returned [${numeralWrapper.formatRAM(server.maxRam)}, ${numeralWrapper.formatRAM(server.ramUsed)}]`,
      );
      return [server.maxRam, server.ramUsed];
    },
  getServerMaxRam:
    (ctx: NetscriptContext) =>
    (_hostname: unknown): number => {
      const hostname = helpers.string(ctx, "hostname", _hostname);
      const server = helpers.getServer(ctx, hostname);
      helpers.log(ctx, () => `returned ${numeralWrapper.formatRAM(server.maxRam)}`);
      return server.maxRam;
    },
  getServerUsedRam:
    (ctx: NetscriptContext) =>
    (_hostname: unknown): number => {
      const hostname = helpers.string(ctx, "hostname", _hostname);
      const server = helpers.getServer(ctx, hostname);
      helpers.log(ctx, () => `returned ${numeralWrapper.formatRAM(server.ramUsed)}`);
      return server.ramUsed;
    },
  serverExists:
    (ctx: NetscriptContext) =>
    (_hostname: unknown): boolean => {
      const hostname = helpers.string(ctx, "hostname", _hostname);
      return GetServer(hostname) !== null;
    },
  fileExists:
    (ctx: NetscriptContext) =>
    (_filename: unknown, _hostname: unknown = ctx.workerScript.hostname): boolean => {
      const filename = helpers.string(ctx, "filename", _filename);
      const hostname = helpers.string(ctx, "hostname", _hostname);
      if (filename === undefined) {
        throw helpers.makeRuntimeErrorMsg(ctx, "Usage: fileExists(scriptname, [server])");
      }
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
      const txtFile = getTextFile(filename, server);
      return txtFile != null;
    },
  isRunning:
    (ctx: NetscriptContext) =>
    (fn: unknown, hostname: unknown, ...scriptArgs: unknown[]): boolean => {
      const ident = helpers.scriptIdentifier(ctx, fn, hostname, scriptArgs);
      return helpers.getRunningScript(ctx, ident) !== null;
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
      const ram = helpers.number(ctx, "ram", _ram);

      const cost = getPurchaseServerCost(ram);
      if (cost === Infinity) {
        helpers.log(ctx, () => `Invalid argument: ram='${ram}'`);
        return Infinity;
      }

      return cost;
    },
  purchaseServer:
    (ctx: NetscriptContext) =>
    (_name: unknown, _ram: unknown): string => {
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
      helpers.log(
        ctx,
        () => `Purchased new server with hostname '${newServ.hostname}' for ${numeralWrapper.formatMoney(cost)}`,
      );
      return newServ.hostname;
    },
  deleteServer:
    (ctx: NetscriptContext) =>
    (_name: unknown): boolean => {
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
    (ctx: NetscriptContext) =>
    (_port: unknown, data: unknown = ""): Promise<any> => {
      const port = helpers.number(ctx, "port", _port);
      if (typeof data !== "string" && typeof data !== "number") {
        throw helpers.makeRuntimeErrorMsg(
          ctx,
          `Trying to write invalid data to a port: only strings and numbers are valid.`,
        );
      }
      const iport = helpers.getValidPort(ctx, port);
      return Promise.resolve(iport.write(data));
    },
  write:
    (ctx: NetscriptContext) =>
    (_port: unknown, data: unknown = "", _mode: unknown = "a"): Promise<void> => {
      const port = helpers.string(ctx, "port", _port);
      const mode = helpers.string(ctx, "mode", _mode);
      if (isString(port)) {
        // Write to script or text file
        let fn = port;
        if (!isValidFilePath(fn)) {
          throw helpers.makeRuntimeErrorMsg(ctx, `Invalid filepath: ${fn}`);
        }

        if (fn.lastIndexOf("/") === 0) {
          fn = removeLeadingSlash(fn);
        }

        // Coerce 'data' to be a string
        try {
          data = String(data);
        } catch (e: unknown) {
          throw helpers.makeRuntimeErrorMsg(
            ctx,
            `Invalid data (${String(e)}). Data being written must be convertible to a string`,
          );
        }

        const server = ctx.workerScript.getServer();
        if (server == null) {
          throw helpers.makeRuntimeErrorMsg(ctx, "Error getting Server. This is a bug. Report to dev.");
        }
        if (isScriptFilename(fn)) {
          // Write to script
          let script = ctx.workerScript.getScriptOnServer(fn, server);
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
        throw helpers.makeRuntimeErrorMsg(ctx, `Invalid argument: ${port}`);
      }
    },
  tryWritePort:
    (ctx: NetscriptContext) =>
    (_port: unknown, data: unknown = ""): Promise<any> => {
      let port = helpers.number(ctx, "port", _port);
      if (typeof data !== "string" && typeof data !== "number") {
        throw helpers.makeRuntimeErrorMsg(
          ctx,
          `Trying to write invalid data to a port: only strings and numbers are valid.`,
        );
      }
      if (!isNaN(port)) {
        port = Math.round(port);
        if (port < 1 || port > CONSTANTS.NumNetscriptPorts) {
          throw helpers.makeRuntimeErrorMsg(
            ctx,
            `Invalid port: ${port}. Only ports 1-${CONSTANTS.NumNetscriptPorts} are valid.`,
          );
        }
        const iport = NetscriptPorts[port - 1];
        if (iport == null || !(iport instanceof Object)) {
          throw helpers.makeRuntimeErrorMsg(ctx, `Could not find port: ${port}. This is a bug. Report to dev.`);
        }
        return Promise.resolve(iport.tryWrite(data));
      } else {
        throw helpers.makeRuntimeErrorMsg(ctx, `Invalid argument: ${port}`);
      }
    },
  readPort:
    (ctx: NetscriptContext) =>
    (_port: unknown): unknown => {
      const port = helpers.number(ctx, "port", _port);
      // Read from port
      const iport = helpers.getValidPort(ctx, port);
      const x = iport.read();
      return x;
    },
  read:
    (ctx: NetscriptContext) =>
    (_port: unknown): string => {
      const port = helpers.string(ctx, "port", _port);
      if (isString(port)) {
        // Read from script or text file
        const fn = port;
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
      } else {
        throw helpers.makeRuntimeErrorMsg(ctx, `Invalid argument: ${port}`);
      }
    },
  peek:
    (ctx: NetscriptContext) =>
    (_port: unknown): unknown => {
      const port = helpers.number(ctx, "port", _port);
      const iport = helpers.getValidPort(ctx, port);
      const x = iport.peek();
      return x;
    },
  clear:
    (ctx: NetscriptContext) =>
    (_file: unknown): void => {
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
  clearPort:
    (ctx: NetscriptContext) =>
    (_port: unknown): void => {
      const port = helpers.number(ctx, "port", _port);
      // Clear port
      const iport = helpers.getValidPort(ctx, port);
      iport.clear();
    },
  getPortHandle:
    (ctx: NetscriptContext) =>
    (_port: unknown): IPort => {
      const port = helpers.number(ctx, "port", _port);
      const iport = helpers.getValidPort(ctx, port);
      return iport;
    },
  rm:
    (ctx: NetscriptContext) =>
    (_fn: unknown, _hostname: unknown = ctx.workerScript.hostname): boolean => {
      const fn = helpers.string(ctx, "fn", _fn);
      const hostname = helpers.string(ctx, "hostname", _hostname);
      const s = helpers.getServer(ctx, hostname);

      const status = s.removeFile(fn);
      if (!status.res) {
        helpers.log(ctx, () => status.msg + "");
      }

      return status.res;
    },
  scriptRunning:
    (ctx: NetscriptContext) =>
    (_scriptname: unknown, _hostname: unknown): boolean => {
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
  scriptKill:
    (ctx: NetscriptContext) =>
    (_scriptname: unknown, _hostname: unknown): boolean => {
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
  getScriptName: (ctx: NetscriptContext) => (): string => {
    return ctx.workerScript.name;
  },
  getScriptRam:
    (ctx: NetscriptContext) =>
    (_scriptname: unknown, _hostname: unknown = ctx.workerScript.hostname): number => {
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
    (ctx: NetscriptContext) =>
    (fn: unknown, hostname: unknown, ...args: unknown[]): IRunningScriptDef | null => {
      const ident = helpers.scriptIdentifier(ctx, fn, hostname, args);
      const runningScript = helpers.getRunningScript(ctx, ident);
      if (runningScript === null) return null;
      return helpers.createPublicRunningScript(runningScript);
    },
  getHackTime:
    (ctx: NetscriptContext) =>
    (_hostname: unknown = ctx.workerScript.hostname): number => {
      const hostname = helpers.string(ctx, "hostname", _hostname);
      const server = helpers.getServer(ctx, hostname);
      if (!(server instanceof Server)) {
        helpers.log(ctx, () => "invalid for this kind of server");
        return Infinity;
      }
      if (helpers.failOnHacknetServer(ctx, server, "getHackTime")) {
        return Infinity;
      }

      return calculateHackingTime(server, Player) * 1000;
    },
  getGrowTime:
    (ctx: NetscriptContext) =>
    (_hostname: unknown = ctx.workerScript.hostname): number => {
      const hostname = helpers.string(ctx, "hostname", _hostname);
      const server = helpers.getServer(ctx, hostname);
      if (!(server instanceof Server)) {
        helpers.log(ctx, () => "invalid for this kind of server");
        return Infinity;
      }
      if (helpers.failOnHacknetServer(ctx, server, "getGrowTime")) {
        return Infinity;
      }

      return calculateGrowTime(server, Player) * 1000;
    },
  getWeakenTime:
    (ctx: NetscriptContext) =>
    (_hostname: unknown = ctx.workerScript.hostname): number => {
      const hostname = helpers.string(ctx, "hostname", _hostname);
      const server = helpers.getServer(ctx, hostname);
      if (!(server instanceof Server)) {
        helpers.log(ctx, () => "invalid for this kind of server");
        return Infinity;
      }
      if (helpers.failOnHacknetServer(ctx, server, "getWeakenTime")) {
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
      const ident = helpers.scriptIdentifier(ctx, fn, hostname, args);
      const runningScript = helpers.getRunningScript(ctx, ident);
      if (runningScript == null) {
        helpers.log(ctx, () => helpers.getCannotFindRunningScriptErrorMessage(ident));
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
      const ident = helpers.scriptIdentifier(ctx, fn, hostname, args);
      const runningScript = helpers.getRunningScript(ctx, ident);
      if (runningScript == null) {
        helpers.log(ctx, () => helpers.getCannotFindRunningScriptErrorMessage(ident));
        return -1;
      }
      return runningScript.onlineExpGained / runningScript.onlineRunningTime;
    },
  nFormat:
    (ctx: NetscriptContext) =>
    (_n: unknown, _format: unknown): string => {
      const n = helpers.number(ctx, "n", _n);
      const format = helpers.string(ctx, "format", _format);
      if (isNaN(n)) {
        return "";
      }

      return numeralWrapper.format(n, format);
    },
  tFormat:
    (ctx: NetscriptContext) =>
    (_milliseconds: unknown, _milliPrecision: unknown = false): string => {
      const milliseconds = helpers.number(ctx, "milliseconds", _milliseconds);
      const milliPrecision = !!_milliPrecision;
      return convertTimeMsToTimeElapsedString(milliseconds, milliPrecision);
    },
  getTimeSinceLastAug: () => (): number => {
    return Player.playtimeSinceLastAug;
  },
  alert:
    (ctx: NetscriptContext) =>
    (_message: unknown): void => {
      const message = helpers.string(ctx, "message", _message);
      dialogBoxCreate(message);
    },
  toast:
    (ctx: NetscriptContext) =>
    (_message: unknown, _variant: unknown = ToastVariant.SUCCESS, _duration: unknown = 2000): void => {
      const message = helpers.string(ctx, "message", _message);
      const variant = helpers.string(ctx, "variant", _variant);
      const duration = _duration === null ? null : helpers.number(ctx, "duration", _duration);
      if (!checkEnum(ToastVariant, variant))
        throw new Error(`variant must be one of ${Object.values(ToastVariant).join(", ")}`);
      SnackbarEvents.emit(message, variant, duration);
    },
  prompt:
    (ctx: NetscriptContext) =>
    (_txt: unknown, options?: { type?: string; options?: string[] }): Promise<boolean | string> => {
      const txt = helpers.string(ctx, "txt", _txt);

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
    async (_url: unknown, _target: unknown, _hostname: unknown = ctx.workerScript.hostname): Promise<boolean> => {
      const url = helpers.string(ctx, "url", _url);
      const target = helpers.string(ctx, "target", _target);
      const hostname = helpers.string(ctx, "hostname", _hostname);
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
              res = s.writeToScriptFile(Player, target, data);
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
  getFavorToDonate: () => (): number => {
    return Math.floor(CONSTANTS.BaseFavorToDonate * BitNodeMultipliers.RepToDonateToFaction);
  },
  getPlayer: () => (): INetscriptPlayer => {
    const data = {
      hp: JSON.parse(JSON.stringify(Player.hp)),
      skills: JSON.parse(JSON.stringify(Player.skills)),
      exp: JSON.parse(JSON.stringify(Player.exp)),
      mults: JSON.parse(JSON.stringify(Player.mults)),
      numPeopleKilled: Player.numPeopleKilled,
      money: Player.money,
      city: Player.city,
      location: Player.location,
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
        throw helpers.makeRuntimeErrorMsg(ctx, "argument should be function");
      }
      ctx.workerScript.atExit = () => {
        f();
      }; // Wrap the user function to prevent WorkerScript leaking as 'this'
    },
  mv:
    (ctx: NetscriptContext) =>
    (_host: unknown, _source: unknown, _destination: unknown): void => {
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
};

// add undocumented functions
const ns = {
  ...base,
  ...NetscriptExtra(),
};

const possibleLogs = Object.fromEntries([...helpers.getFunctionNames(ns, "")].map((a) => [a, true]));
