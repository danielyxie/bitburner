import { vsprintf, sprintf } from "sprintf-js";
import * as libarg from "arg";

import { getRamCost } from "./Netscript/RamCostGenerator";
import { WorkerScriptStartStopEventEmitter } from "./Netscript/WorkerScriptStartStopEventEmitter";

import { Augmentations } from "./Augmentation/Augmentations";
import { augmentationExists, installAugmentations } from "./Augmentation/AugmentationHelpers";
import { prestigeAugmentation } from "./Prestige";
import { AugmentationNames } from "./Augmentation/data/AugmentationNames";
import { BitNodeMultipliers } from "./BitNode/BitNodeMultipliers";
import { findCrime } from "./Crime/CrimeHelpers";
import { Bladeburner } from "./Bladeburner/Bladeburner";
import { Company } from "./Company/Company";
import { Companies } from "./Company/Companies";
import { CompanyPosition } from "./Company/CompanyPosition";
import { CompanyPositions } from "./Company/CompanyPositions";
import { CONSTANTS } from "./Constants";
import { DarkWebItems } from "./DarkWeb/DarkWebItems";
import {
  NewIndustry,
  NewCity,
  UnlockUpgrade,
  LevelUpgrade,
  IssueDividends,
  SellMaterial,
  SellProduct,
  SetSmartSupply,
  BuyMaterial,
  AssignJob,
  UpgradeOfficeSize,
  ThrowParty,
  PurchaseWarehouse,
  UpgradeWarehouse,
  BuyCoffee,
  HireAdVert,
  MakeProduct,
  Research,
  ExportMaterial,
  CancelExportMaterial,
  SetMaterialMarketTA1,
  SetMaterialMarketTA2,
  SetProductMarketTA1,
  SetProductMarketTA2,
} from "./Corporation/Actions";
import { CorporationUnlockUpgrades } from "./Corporation/data/CorporationUnlockUpgrades";
import { CorporationUpgrades } from "./Corporation/data/CorporationUpgrades";
import {
  calculateHackingChance,
  calculateHackingExpGain,
  calculatePercentMoneyHacked,
  calculateHackingTime,
  calculateGrowTime,
  calculateWeakenTime,
} from "./Hacking";
import { calculateServerGrowth } from "./Server/formulas/grow";
import { AllGangs } from "./Gang/AllGangs";
import { Factions, factionExists } from "./Faction/Factions";
import { joinFaction, purchaseAugmentation } from "./Faction/FactionHelpers";
import { netscriptCanGrow, netscriptCanHack, netscriptCanWeaken } from "./Hacking/netscriptCanHack";

import {
  calculateMoneyGainRate,
  calculateLevelUpgradeCost,
  calculateRamUpgradeCost,
  calculateCoreUpgradeCost,
  calculateNodeCost,
} from "./Hacknet/formulas/HacknetNodes";
import {
  calculateHashGainRate as HScalculateHashGainRate,
  calculateLevelUpgradeCost as HScalculateLevelUpgradeCost,
  calculateRamUpgradeCost as HScalculateRamUpgradeCost,
  calculateCoreUpgradeCost as HScalculateCoreUpgradeCost,
  calculateCacheUpgradeCost as HScalculateCacheUpgradeCost,
  calculateServerCost as HScalculateServerCost,
} from "./Hacknet/formulas/HacknetServers";
import { HacknetNodeConstants, HacknetServerConstants } from "./Hacknet/data/Constants";
import { HacknetServer } from "./Hacknet/HacknetServer";
import { CityName } from "./Locations/data/CityNames";
import { LocationName } from "./Locations/data/LocationNames";
import { Terminal } from "./Terminal";
import { calculateSkill, calculateExp } from "./PersonObjects/formulas/skill";

import { Message } from "./Message/Message";
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
import { buyStock, sellStock, shortStock, sellShort } from "./StockMarket/BuyingAndSelling";
import { influenceStockThroughServerHack, influenceStockThroughServerGrow } from "./StockMarket/PlayerInfluencing";
import { StockMarket, SymbolToStockMap, placeOrder, cancelOrder } from "./StockMarket/StockMarket";
import { getBuyTransactionCost, getSellTransactionGain } from "./StockMarket/StockMarketHelpers";
import { OrderTypes } from "./StockMarket/data/OrderTypes";
import { PositionTypes } from "./StockMarket/data/PositionTypes";
import { StockSymbols } from "./StockMarket/data/StockSymbols";
import { getStockMarket4SDataCost, getStockMarket4STixApiCost } from "./StockMarket/StockMarketCosts";
import { isValidFilePath, removeLeadingSlash } from "./Terminal/DirectoryHelpers";
import { TextFile, getTextFile, createTextFile } from "./TextFile";

import { NetscriptPorts, runScriptFromScript, startWorkerScript } from "./NetscriptWorker";
import { killWorkerScript } from "./Netscript/killWorkerScript";
import { workerScripts } from "./Netscript/WorkerScripts";
import { WorkerScript } from "./Netscript/WorkerScript";
import { makeRuntimeRejectMsg, netscriptDelay, resolveNetscriptRequestedThreads } from "./NetscriptEvaluator";
import { Interpreter } from "./ThirdParty/JSInterpreter";
import { Router } from "./ui/GameRoot";

import { numeralWrapper } from "./ui/numeralFormat";
import { is2DArray } from "./utils/helpers/is2DArray";
import { convertTimeMsToTimeElapsedString } from "./utils/StringHelperFunctions";
import { SpecialServers } from "./Server/data/SpecialServers";

import { LogBoxEvents } from "./ui/React/LogBoxManager";
import { arrayToString } from "./utils/helpers/arrayToString";
import { isString } from "./utils/helpers/isString";

import { OfficeSpace } from "./Corporation/OfficeSpace";
import { Employee } from "./Corporation/Employee";
import { Product } from "./Corporation/Product";
import { Material } from "./Corporation/Material";
import { Warehouse } from "./Corporation/Warehouse";
import { IIndustry } from "./Corporation/IIndustry";

import { Faction } from "./Faction/Faction";
import { Augmentation } from "./Augmentation/Augmentation";
import { Page } from "./ui/Router";

import { CodingContract } from "./CodingContracts";
import { Stock } from "./StockMarket/Stock";
import { BaseServer } from "./Server/BaseServer";
import { INetscriptGang, NetscriptGang } from "./NetscriptFunctions/Gang";
import { INetscriptSleeve, NetscriptSleeve } from "./NetscriptFunctions/Sleeve";
import { INetscriptExtra, NetscriptExtra } from "./NetscriptFunctions/Extra";
import { INetscriptHacknet, NetscriptHacknet } from "./NetscriptFunctions/Hacknet";
import { dialogBoxCreate } from "./ui/React/DialogBox";
import { SnackbarEvents } from "./ui/React/Snackbar";

const defaultInterpreter = new Interpreter("", () => undefined);

// the acorn interpreter has a bug where it doesn't convert arrays correctly.
// so we have to more or less copy it here.
function toNative(pseudoObj: any): any {
  if (pseudoObj == null) return null;
  if (
    !pseudoObj.hasOwnProperty("properties") ||
    !pseudoObj.hasOwnProperty("getter") ||
    !pseudoObj.hasOwnProperty("setter") ||
    !pseudoObj.hasOwnProperty("proto")
  ) {
    return pseudoObj; // it wasn't a pseudo object anyway.
  }

  let nativeObj: any;
  if (pseudoObj.hasOwnProperty("class") && pseudoObj.class === "Array") {
    nativeObj = [];
    const length = defaultInterpreter.getProperty(pseudoObj, "length");
    for (let i = 0; i < length; i++) {
      if (defaultInterpreter.hasProperty(pseudoObj, i)) {
        nativeObj[i] = toNative(defaultInterpreter.getProperty(pseudoObj, i));
      }
    }
  } else {
    // Object.
    nativeObj = {};
    for (const key in pseudoObj.properties) {
      const val = pseudoObj.properties[key];
      nativeObj[key] = toNative(val);
    }
  }
  return nativeObj;
}

interface NS extends INetscriptExtra {
  [key: string]: any;
  hacknet: INetscriptHacknet;
  gang: INetscriptGang;
  sleeve: INetscriptSleeve;
}

function NetscriptFunctions(workerScript: WorkerScript): NS {
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

    workerScript.dynamicRamUsage += ramCost * threads;
    if (workerScript.dynamicRamUsage > 1.01 * workerScript.ramUsage) {
      throw makeRuntimeRejectMsg(
        workerScript,
        `Dynamic RAM usage calculated to be greater than initial RAM usage on fn: ${fnName}.
        This is probably because you somehow circumvented the static RAM calculation.

        Dynamic RAM Usage: ${numeralWrapper.formatRAM(workerScript.dynamicRamUsage)}
        Static RAM Usage: ${numeralWrapper.formatRAM(workerScript.ramUsage)}

        One of these could be the reason:
        * Using eval() to get a reference to a ns function
        &nbsp;&nbsp;const scan = eval('ns.scan');

        * Using map access to do the same
        &nbsp;&nbsp;const scan = ns['scan'];

        * Saving script in the improper order.
        &nbsp;&nbsp;Increase the cost of an imported script, save it, then run the
        &nbsp;&nbsp;parent. To fix this just re-open & save every script in order
        &nbsp;&nbsp;from most imported to least imported (parent script).

        Sorry :(`,
      );
    }
  };

  /**
   * Gets the Server for a specific hostname/ip, throwing an error
   * if the server doesn't exist.
   * @param {string} ip - Hostname or IP of the server
   * @param {string} callingFnName - Name of calling function. For logging purposes
   * @returns {Server} The specified Server
   */
  const safeGetServer = function (ip: any, callingFnName: any = ""): BaseServer {
    const server = GetServer(ip);
    if (server == null) {
      throw makeRuntimeErrorMsg(callingFnName, `Invalid IP/hostname: ${ip}`);
    }
    return server;
  };

  /**
   * Searches for and returns the RunningScript object for the specified script.
   * If the 'fn' argument is not specified, this returns the current RunningScript.
   * @param {string} fn - Filename of script
   * @param {string} ip - Hostname/ip of the server on which the script resides
   * @param {any[]} scriptArgs - Running script's arguments
   * @returns {RunningScript}
   *      Running script identified by the parameters, or null if no such script
   *      exists, or the current running script if the first argument 'fn'
   *      is not specified.
   */
  const getRunningScript = function (fn: any, ip: any, callingFnName: any, scriptArgs: any): RunningScript | null {
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
      if (ip == null) {
        ip = workerScript.hostname;
      }
      const server = safeGetServer(ip, callingFnName);

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
   * @param {string} ip - Hostname/ip of the server on which the script resides
   * @param {any[]} scriptArgs - Running script's arguments
   * @returns {string} Error message to print to logs
   */
  const getCannotFindRunningScriptErrorMessage = function (fn: any, ip: any, scriptArgs: any): string {
    if (!Array.isArray(scriptArgs)) {
      scriptArgs = [];
    }

    return `Cannot find running script ${fn} on server ${ip} with args: ${arrayToString(scriptArgs)}`;
  };

  /**
   * Checks if the player has TIX API access. Throws an error if the player does not
   */
  const checkTixApiAccess = function (callingFn: any = ""): void {
    if (!Player.hasWseAccount) {
      throw makeRuntimeErrorMsg(callingFn, `You don't have WSE Access! Cannot use ${callingFn}()`);
    }
    if (!Player.hasTixApiAccess) {
      throw makeRuntimeErrorMsg(callingFn, `You don't have TIX API Access! Cannot use ${callingFn}()`);
    }
  };

  /**
   * Gets a stock, given its symbol. Throws an error if the symbol is invalid
   * @param {string} symbol - Stock's symbol
   * @returns {Stock} stock object
   */
  const getStockFromSymbol = function (symbol: any, callingFn: any = ""): Stock {
    const stock = SymbolToStockMap[symbol];
    if (stock == null) {
      throw makeRuntimeErrorMsg(callingFn, `Invalid stock symbol: '${symbol}'`);
    }

    return stock;
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

  const checkFormulasAccess = function (func: any, n: any): void {
    if ((SourceFileFlags[5] < 1 && Player.bitNodeN !== 5) || (SourceFileFlags[n] < 1 && Player.bitNodeN !== n)) {
      let extra = "";
      if (n !== 5) {
        extra = ` and Source-File ${n}-1`;
      }
      throw makeRuntimeErrorMsg(`formulas.${func}`, `Requires Source-File 5-1${extra} to run.`);
    }
  };

  const checkSingularityAccess = function (func: any, n: any): void {
    if (Player.bitNodeN !== 4) {
      if (SourceFileFlags[4] < n) {
        throw makeRuntimeErrorMsg(func, `This singularity function requires Source-File 4-${n} to run.`);
      }
    }
  };

  const checkBladeburnerAccess = function (func: any, skipjoined: any = false): void {
    const bladeburner = Player.bladeburner;
    if (bladeburner === null) throw new Error("Must have joined bladeburner");
    const apiAccess =
      Player.bitNodeN === 7 ||
      Player.sourceFiles.some((a) => {
        return a.n === 7;
      });
    if (!apiAccess) {
      const apiDenied = `You do not currently have access to the Bladeburner API. You must either be in BitNode-7 or have Source-File 7.`;
      throw makeRuntimeErrorMsg(`bladeburner.${func}`, apiDenied);
    }
    if (!skipjoined) {
      const bladeburnerAccess = bladeburner instanceof Bladeburner;
      if (!bladeburnerAccess) {
        const bladeburnerDenied = `You must be a member of the Bladeburner division to use this API.`;
        throw makeRuntimeErrorMsg(`bladeburner.${func}`, bladeburnerDenied);
      }
    }
  };

  const checkBladeburnerCity = function (func: any, city: any): void {
    const bladeburner = Player.bladeburner;
    if (bladeburner === null) throw new Error("Must have joined bladeburner");
    if (!bladeburner.cities.hasOwnProperty(city)) {
      throw makeRuntimeErrorMsg(`bladeburner.${func}`, `Invalid city: ${city}`);
    }
  };

  const getCodingContract = function (func: any, ip: any, fn: any): CodingContract {
    const server = safeGetServer(ip, func);
    const contract = server.getContract(fn);
    if (contract == null) {
      throw makeRuntimeErrorMsg(`codingcontract.${func}`, `Cannot find contract '${fn}' on server '${ip}'`);
    }

    return contract;
  };

  const getBladeburnerActionObject = function (func: any, type: any, name: any): any {
    const bladeburner = Player.bladeburner;
    if (bladeburner === null) throw new Error("Must have joined bladeburner");
    const actionId = bladeburner.getActionIdFromTypeAndName(type, name);
    if (!actionId) {
      throw makeRuntimeErrorMsg(`bladeburner.${func}`, `Invalid action type='${type}', name='${name}'`);
    }
    const actionObj = bladeburner.getActionObject(actionId);
    if (!actionObj) {
      throw makeRuntimeErrorMsg(`bladeburner.${func}`, `Invalid action type='${type}', name='${name}'`);
    }

    return actionObj;
  };

  const getCompany = function (func: any, name: any): Company {
    const company = Companies[name];
    if (company == null || !(company instanceof Company)) {
      throw makeRuntimeErrorMsg(func, `Invalid company name: '${name}'`);
    }
    return company;
  };

  const getFaction = function (func: any, name: any): Faction {
    if (!factionExists(name)) {
      throw makeRuntimeErrorMsg(func, `Invalid faction name: '${name}`);
    }

    return Factions[name];
  };

  const getAugmentation = function (func: any, name: any): Augmentation {
    if (!augmentationExists(name)) {
      throw makeRuntimeErrorMsg(func, `Invalid augmentation: '${name}'`);
    }

    return Augmentations[name];
  };

  function getDivision(divisionName: any): IIndustry {
    const corporation = Player.corporation;
    if (corporation === null) throw new Error("cannot be called without a corporation");
    const division = corporation.divisions.find((div) => div.name === divisionName);
    if (division === undefined) throw new Error(`No division named '${divisionName}'`);
    return division;
  }

  function getOffice(divisionName: any, cityName: any): OfficeSpace {
    const division = getDivision(divisionName);
    if (!(cityName in division.offices)) throw new Error(`Invalid city name '${cityName}'`);
    const office = division.offices[cityName];
    if (office === 0) throw new Error(`${division.name} has not expanded to '${cityName}'`);
    return office;
  }

  function getWarehouse(divisionName: any, cityName: any): Warehouse {
    const division = getDivision(divisionName);
    if (!(cityName in division.warehouses)) throw new Error(`Invalid city name '${cityName}'`);
    const warehouse = division.warehouses[cityName];
    if (warehouse === 0) throw new Error(`${division.name} has not expanded to '${cityName}'`);
    return warehouse;
  }

  function getMaterial(divisionName: any, cityName: any, materialName: any): Material {
    const warehouse = getWarehouse(divisionName, cityName);
    const material = warehouse.materials[materialName];
    if (material === undefined) throw new Error(`Invalid material name: '${materialName}'`);
    return material;
  }

  function getProduct(divisionName: any, productName: any): Product {
    const division = getDivision(divisionName);
    const product = division.products[productName];
    if (product === undefined) throw new Error(`Invalid product name: '${productName}'`);
    return product;
  }

  function getEmployee(divisionName: any, cityName: any, employeeName: any): Employee {
    const office = getOffice(divisionName, cityName);
    const employee = office.employees.find((e) => e.name === employeeName);
    if (employee === undefined) throw new Error(`Invalid employee name: '${employeeName}'`);
    return employee;
  }

  const runAfterReset = function (cbScript = null): void {
    //Run a script after reset
    if (cbScript && isString(cbScript)) {
      const home = Player.getHomeComputer();
      for (const script of home.scripts) {
        if (script.filename === cbScript) {
          const ramUsage = script.ramUsage;
          const ramAvailable = home.maxRam - home.ramUsed;
          if (ramUsage > ramAvailable) {
            return; // Not enough RAM
          }
          const runningScriptObj = new RunningScript(script, []); // No args
          runningScriptObj.threads = 1; // Only 1 thread
          startWorkerScript(runningScriptObj, home);
        }
      }
    }
  };

  const hack = function (ip: any, manual: any, { threads: requestedThreads, stock }: any = {}): Promise<number> {
    if (ip === undefined) {
      throw makeRuntimeErrorMsg("hack", "Takes 1 argument.");
    }
    const threads = resolveNetscriptRequestedThreads(workerScript, "hack", requestedThreads);
    const server = GetServer(ip);
    if (!(server instanceof Server)) {
      throw makeRuntimeErrorMsg("hack", `Invalid IP/hostname: ${ip}.`);
    }

    if (server == null) {
      throw makeRuntimeErrorMsg("hack", `Invalid IP/hostname: ${ip}.`);
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
      `Executing ${ip} in ${convertTimeMsToTimeElapsedString(
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

        Player.gainMoney(moneyGained);
        workerScript.scriptRef.onlineMoneyMade += moneyGained;
        Player.scriptProdSinceLastAug += moneyGained;
        Player.recordMoneySource(moneyGained, "hacking");
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
      if (typeof arg === "object") {
        out += JSON.stringify(arg);
        continue;
      }
      out += `${arg}`;
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
  };

  const gang = NetscriptGang(Player, workerScript, helper);
  const sleeve = NetscriptSleeve(Player, workerScript, helper);
  const extra = NetscriptExtra(Player, workerScript);
  const hacknet = NetscriptHacknet(Player, workerScript, helper);

  const functions = {
    hacknet: hacknet,
    sprintf: sprintf,
    vsprintf: vsprintf,
    scan: function (ip: any = workerScript.hostname): any {
      updateDynamicRam("scan", getRamCost("scan"));
      const server = GetServer(ip);
      if (server == null) {
        throw makeRuntimeErrorMsg("scan", `Invalid IP/hostname: ${ip}.`);
      }
      const out = [];
      for (let i = 0; i < server.serversOnNetwork.length; i++) {
        const s = getServerOnNetwork(server, i);
        if (s === null) continue;
        const entry = s.hostname;
        if (entry == null) {
          continue;
        }
        out.push(entry);
      }
      workerScript.log("scan", `returned ${server.serversOnNetwork.length} connections for ${server.hostname}`);
      return out;
    },
    hack: function (ip: any, { threads: requestedThreads, stock }: any = {}): any {
      updateDynamicRam("hack", getRamCost("hack"));
      return hack(ip, false, { threads: requestedThreads, stock: stock });
    },
    hackAnalyzeThreads: function (ip: any, hackAmount: any): any {
      updateDynamicRam("hackAnalyzeThreads", getRamCost("hackAnalyzeThreads"));

      // Check argument validity
      const server = safeGetServer(ip, "hackAnalyzeThreads");
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
    hackAnalyzePercent: function (ip: any): any {
      updateDynamicRam("hackAnalyzePercent", getRamCost("hackAnalyzePercent"));

      const server = safeGetServer(ip, "hackAnalyzePercent");
      if (!(server instanceof Server)) {
        workerScript.log("hackAnalyzePercent", "Cannot be executed on this server.");
        return false;
      }

      return calculatePercentMoneyHacked(server, Player) * 100;
    },
    hackChance: function (ip: any): any {
      updateDynamicRam("hackChance", getRamCost("hackChance"));

      const server = safeGetServer(ip, "hackChance");
      if (!(server instanceof Server)) {
        workerScript.log("hackChance", "Cannot be executed on this server.");
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
    grow: function (ip: any, { threads: requestedThreads, stock }: any = {}): any {
      updateDynamicRam("grow", getRamCost("grow"));
      const threads = resolveNetscriptRequestedThreads(workerScript, "grow", requestedThreads);
      if (ip === undefined) {
        throw makeRuntimeErrorMsg("grow", "Takes 1 argument.");
      }
      const server = GetServer(ip);
      if (!(server instanceof Server)) {
        workerScript.log("grow", "Cannot be executed on this server.");
        return false;
      }
      if (server == null) {
        throw makeRuntimeErrorMsg("grow", `Invalid IP/hostname: ${ip}.`);
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
    growthAnalyze: function (ip: any, growth: any, cores: any = 1): any {
      updateDynamicRam("growthAnalyze", getRamCost("growthAnalyze"));

      // Check argument validity
      const server = safeGetServer(ip, "growthAnalyze");
      if (!(server instanceof Server)) {
        workerScript.log("growthAnalyze", "Cannot be executed on this server.");
        return false;
      }
      if (typeof growth !== "number" || isNaN(growth) || growth < 1 || !isFinite(growth)) {
        throw makeRuntimeErrorMsg("growthAnalyze", `Invalid argument: growth must be numeric and >= 1, is ${growth}.`);
      }

      return numCycleForGrowth(server, Number(growth), Player, cores);
    },
    weaken: function (ip: any, { threads: requestedThreads }: any = {}): any {
      updateDynamicRam("weaken", getRamCost("weaken"));
      const threads = resolveNetscriptRequestedThreads(workerScript, "weaken", requestedThreads);
      if (ip === undefined) {
        throw makeRuntimeErrorMsg("weaken", "Takes 1 argument.");
      }
      const server = GetServer(ip);
      if (!(server instanceof Server)) {
        workerScript.log("weaken", "Cannot be executed on this server.");
        return false;
      }
      if (server == null) {
        throw makeRuntimeErrorMsg("weaken", `Invalid IP/hostname: ${ip}`);
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
        return Promise.resolve(CONSTANTS.ServerWeakenAmount * threads);
      });
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
    getScriptLogs: function (fn: any, ip: any, ...scriptArgs: any): any {
      const runningScriptObj = getRunningScript(fn, ip, "getScriptLogs", scriptArgs);
      if (runningScriptObj == null) {
        workerScript.log("getScriptLogs", getCannotFindRunningScriptErrorMessage(fn, ip, scriptArgs));
        return "";
      }

      return runningScriptObj.logs.slice();
    },
    tail: function (fn: any, ip: any = workerScript.hostname, ...scriptArgs: any): any {
      let runningScriptObj;
      if (arguments.length === 0) {
        runningScriptObj = workerScript.scriptRef;
      } else if (typeof fn === "number") {
        runningScriptObj = getRunningScriptByPid(fn, "tail");
      } else {
        runningScriptObj = getRunningScript(fn, ip, "tail", scriptArgs);
      }
      if (runningScriptObj == null) {
        workerScript.log("tail", getCannotFindRunningScriptErrorMessage(fn, ip, scriptArgs));
        return;
      }

      LogBoxEvents.emit(runningScriptObj);
    },
    nuke: function (ip: any): any {
      updateDynamicRam("nuke", getRamCost("nuke"));
      if (ip === undefined) {
        throw makeRuntimeErrorMsg("nuke", "Takes 1 argument.");
      }
      const server = GetServer(ip);
      if (!(server instanceof Server)) {
        workerScript.log("nuke", "Cannot be executed on this server.");
        return false;
      }
      if (server == null) {
        throw makeRuntimeErrorMsg("nuke", `Invalid IP/hostname: ${ip}.`);
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
    brutessh: function (ip: any): any {
      updateDynamicRam("brutessh", getRamCost("brutessh"));
      if (ip === undefined) {
        throw makeRuntimeErrorMsg("brutessh", "Takes 1 argument.");
      }
      const server = GetServer(ip);
      if (!(server instanceof Server)) {
        workerScript.log("brutessh", "Cannot be executed on this server.");
        return false;
      }
      if (server == null) {
        throw makeRuntimeErrorMsg("brutessh", `Invalid IP/hostname: ${ip}.`);
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
    ftpcrack: function (ip: any): any {
      updateDynamicRam("ftpcrack", getRamCost("ftpcrack"));
      if (ip === undefined) {
        throw makeRuntimeErrorMsg("ftpcrack", "Takes 1 argument.");
      }
      const server = GetServer(ip);
      if (!(server instanceof Server)) {
        workerScript.log("ftpcrack", "Cannot be executed on this server.");
        return false;
      }
      if (server == null) {
        throw makeRuntimeErrorMsg("ftpcrack", `Invalid IP/hostname: ${ip}.`);
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
    relaysmtp: function (ip: any): any {
      updateDynamicRam("relaysmtp", getRamCost("relaysmtp"));
      if (ip === undefined) {
        throw makeRuntimeErrorMsg("relaysmtp", "Takes 1 argument.");
      }
      const server = GetServer(ip);
      if (!(server instanceof Server)) {
        workerScript.log("relaysmtp", "Cannot be executed on this server.");
        return false;
      }
      if (server == null) {
        throw makeRuntimeErrorMsg("relaysmtp", `Invalid IP/hostname: ${ip}.`);
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
    httpworm: function (ip: any): any {
      updateDynamicRam("httpworm", getRamCost("httpworm"));
      if (ip === undefined) {
        throw makeRuntimeErrorMsg("httpworm", "Takes 1 argument");
      }
      const server = GetServer(ip);
      if (!(server instanceof Server)) {
        workerScript.log("httpworm", "Cannot be executed on this server.");
        return false;
      }
      if (server == null) {
        throw makeRuntimeErrorMsg("httpworm", `Invalid IP/hostname: ${ip}`);
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
    sqlinject: function (ip: any): any {
      updateDynamicRam("sqlinject", getRamCost("sqlinject"));
      if (ip === undefined) {
        throw makeRuntimeErrorMsg("sqlinject", "Takes 1 argument.");
      }
      const server = GetServer(ip);
      if (!(server instanceof Server)) {
        workerScript.log("sqlinject", "Cannot be executed on this server.");
        return false;
      }
      if (server == null) {
        throw makeRuntimeErrorMsg("sqlinject", `Invalid IP/hostname: ${ip}`);
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
    exec: function (scriptname: any, ip: any, threads: any = 1, ...args: any[]): any {
      updateDynamicRam("exec", getRamCost("exec"));
      if (scriptname === undefined || ip === undefined) {
        throw makeRuntimeErrorMsg("exec", "Usage: exec(scriptname, server, [numThreads], [arg1], [arg2]...)");
      }
      if (isNaN(threads) || threads <= 0) {
        throw makeRuntimeErrorMsg("exec", `Invalid thread count. Must be numeric and > 0, is ${threads}`);
      }
      const server = GetServer(ip);
      if (server == null) {
        throw makeRuntimeErrorMsg("exec", `Invalid IP/hostname: ${ip}`);
      }
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
    kill: function (filename: any, ip: any, ...scriptArgs: any): any {
      updateDynamicRam("kill", getRamCost("kill"));

      let res;
      const killByPid = typeof filename === "number";
      if (killByPid) {
        // Kill by pid
        res = killWorkerScript(filename);
      } else {
        // Kill by filename/ip
        if (filename === undefined || ip === undefined) {
          throw makeRuntimeErrorMsg("kill", "Usage: kill(scriptname, server, [arg1], [arg2]...)");
        }

        const server = safeGetServer(ip);
        const runningScriptObj = getRunningScript(filename, ip, "kill", scriptArgs);
        if (runningScriptObj == null) {
          workerScript.log("kill", getCannotFindRunningScriptErrorMessage(filename, ip, scriptArgs));
          return false;
        }

        res = killWorkerScript(runningScriptObj, server.hostname);
      }

      if (res) {
        if (killByPid) {
          workerScript.log("kill", `Killing script with PID ${filename}`);
        } else {
          workerScript.log("kill", `Killing '${filename}' on '${ip}' with args: ${arrayToString(scriptArgs)}.`);
        }
        return true;
      } else {
        if (killByPid) {
          workerScript.log("kill", `No script with PID ${filename}`);
        } else {
          workerScript.log("kill", `No such script '${filename}' on '${ip}' with args: ${arrayToString(scriptArgs)}`);
        }
        return false;
      }
    },
    killall: function (ip: any = workerScript.hostname): any {
      updateDynamicRam("killall", getRamCost("killall"));
      if (ip === undefined) {
        throw makeRuntimeErrorMsg("killall", "Takes 1 argument");
      }
      const server = GetServer(ip);
      if (server == null) {
        throw makeRuntimeErrorMsg("killall", `Invalid IP/hostname: ${ip}`);
      }
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
    scp: function (scriptname: any, ip1: any, ip2: any): any {
      updateDynamicRam("scp", getRamCost("scp"));
      if (arguments.length !== 2 && arguments.length !== 3) {
        throw makeRuntimeErrorMsg("scp", "Takes 2 or 3 arguments");
      }
      if (scriptname && scriptname.constructor === Array) {
        // Recursively call scp on all elements of array
        let res = false;
        scriptname.forEach(function (script) {
          if (NetscriptFunctions(workerScript).scp(script, ip1, ip2)) {
            res = true;
          }
        });
        return res;
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

      if (ip2 != null) {
        // 3 Argument version: scriptname, source, destination
        if (scriptname === undefined || ip1 === undefined || ip2 === undefined) {
          throw makeRuntimeErrorMsg("scp", "Takes 2 or 3 arguments");
        }
        destServer = GetServer(ip2);
        if (destServer == null) {
          throw makeRuntimeErrorMsg("scp", `Invalid IP/hostname: ${ip2}`);
        }

        currServ = GetServer(ip1);
        if (currServ == null) {
          throw makeRuntimeErrorMsg("scp", `Invalid IP/hostname: ${ip1}`);
        }
      } else if (ip1 != null) {
        // 2 Argument version: scriptname, destination
        if (scriptname === undefined || ip1 === undefined) {
          throw makeRuntimeErrorMsg("scp", "Takes 2 or 3 arguments");
        }
        destServer = GetServer(ip1);
        if (destServer == null) {
          throw makeRuntimeErrorMsg("scp", `Invalid IP/hostname: ${ip1}`);
        }

        currServ = GetServer(workerScript.hostname);
        if (currServ == null) {
          throw makeRuntimeErrorMsg("scp", "Could not find server ip for this script. This is a bug. Report to dev.");
        }
      } else {
        throw makeRuntimeErrorMsg("scp", "Takes 2 or 3 arguments");
      }

      // Scp for lit files
      if (scriptname.endsWith(".lit")) {
        let found = false;
        for (let i = 0; i < currServ.messages.length; ++i) {
          if (!(currServ.messages[i] instanceof Message) && currServ.messages[i] == scriptname) {
            found = true;
            break;
          }
        }

        if (!found) {
          workerScript.log("scp", `File '${scriptname}' does not exist.`);
          return false;
        }

        for (let i = 0; i < destServer.messages.length; ++i) {
          if (destServer.messages[i] === scriptname) {
            workerScript.log("scp", `File '${scriptname}' copied over to '${destServer.hostname}'.`);
            return true; // Already exists
          }
        }
        destServer.messages.push(scriptname);
        workerScript.log("scp", `File '${scriptname}' copied over to '${destServer.hostname}'.`);
        return true;
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
          return false;
        }

        for (let i = 0; i < destServer.textFiles.length; ++i) {
          if (destServer.textFiles[i].fn === scriptname) {
            // Overwrite
            destServer.textFiles[i].text = txtFile.text;
            workerScript.log("scp", `File '${scriptname}' copied over to '${destServer.hostname}'.`);
            return true;
          }
        }
        const newFile = new TextFile(txtFile.fn, txtFile.text);
        destServer.textFiles.push(newFile);
        workerScript.log("scp", `File '${scriptname}' copied over to '${destServer.hostname}'.`);
        return true;
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
        return false;
      }

      // Overwrite script if it already exists
      for (let i = 0; i < destServer.scripts.length; ++i) {
        if (scriptname == destServer.scripts[i].filename) {
          workerScript.log("scp", `WARNING: File '${scriptname}' overwritten on '${destServer.hostname}'`);
          const oldScript = destServer.scripts[i];
          // If it's the exact same file don't actually perform the
          // copy to avoid recompiling uselessly. Players tend to scp
          // liberally.
          if (oldScript.code === sourceScript.code) return true;
          oldScript.code = sourceScript.code;
          oldScript.ramUsage = sourceScript.ramUsage;
          oldScript.markUpdated();
          return true;
        }
      }

      // Create new script if it does not already exist
      const newScript = new Script(scriptname);
      newScript.code = sourceScript.code;
      newScript.ramUsage = sourceScript.ramUsage;
      newScript.server = destServer.hostname;
      destServer.scripts.push(newScript);
      workerScript.log("scp", `File '${scriptname}' copied over to '${destServer.hostname}'.`);
      return true;
    },
    ls: function (ip: any, grep: any): any {
      updateDynamicRam("ls", getRamCost("ls"));
      if (ip === undefined) {
        throw makeRuntimeErrorMsg("ls", "Usage: ls(ip/hostname, [grep filter])");
      }
      const server = GetServer(ip);
      if (server == null) {
        throw makeRuntimeErrorMsg("ls", `Invalid IP/hostname: ${ip}`);
      }

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
          if (msg instanceof Message) {
            if (msg.filename.includes(filter)) {
              allFiles.push(msg.filename);
            }
          } else if (msg.includes(filter)) {
            allFiles.push(msg);
          }
        } else {
          const msg = server.messages[i];
          if (msg instanceof Message) {
            allFiles.push(msg.filename);
          } else {
            allFiles.push(msg);
          }
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
    ps: function (ip: any = workerScript.hostname): any {
      updateDynamicRam("ps", getRamCost("ps"));
      const server = GetServer(ip);
      if (server == null) {
        throw makeRuntimeErrorMsg("ps", `Invalid IP/hostname: ${ip}`);
      }
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
    hasRootAccess: function (ip: any): any {
      updateDynamicRam("hasRootAccess", getRamCost("hasRootAccess"));
      if (ip === undefined) {
        throw makeRuntimeErrorMsg("hasRootAccess", "Takes 1 argument");
      }
      const server = GetServer(ip);
      if (server == null) {
        throw makeRuntimeErrorMsg("hasRootAccess", `Invalid IP/hostname: ${ip}`);
      }
      return server.hasAdminRights;
    },
    getIp: function (): any {
      updateDynamicRam("getIp", getRamCost("getIp"));
      const scriptServer = GetServer(workerScript.hostname);
      if (scriptServer == null) {
        throw makeRuntimeErrorMsg("getIp", "Could not find server. This is a bug. Report to dev.");
      }
      return scriptServer.hostname;
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
    getServer: function (ip: any): any {
      updateDynamicRam("getServer", getRamCost("getServer"));
      const server = safeGetServer(ip, "getServer");
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
    getServerMoneyAvailable: function (ip: any): any {
      updateDynamicRam("getServerMoneyAvailable", getRamCost("getServerMoneyAvailable"));
      const server = safeGetServer(ip, "getServerMoneyAvailable");
      if (!(server instanceof Server)) {
        workerScript.log("getServerNumPortsRequired", "Cannot be executed on this server.");
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
    getServerSecurityLevel: function (ip: any): any {
      updateDynamicRam("getServerSecurityLevel", getRamCost("getServerSecurityLevel"));
      const server = safeGetServer(ip, "getServerSecurityLevel");
      if (!(server instanceof Server)) {
        workerScript.log("getServerNumPortsRequired", "Cannot be executed on this server.");
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
    getServerBaseSecurityLevel: function (ip: any): any {
      updateDynamicRam("getServerBaseSecurityLevel", getRamCost("getServerBaseSecurityLevel"));
      const server = safeGetServer(ip, "getServerBaseSecurityLevel");
      if (!(server instanceof Server)) {
        workerScript.log("getServerNumPortsRequired", "Cannot be executed on this server.");
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
    getServerMinSecurityLevel: function (ip: any): any {
      updateDynamicRam("getServerMinSecurityLevel", getRamCost("getServerMinSecurityLevel"));
      const server = safeGetServer(ip, "getServerMinSecurityLevel");
      if (!(server instanceof Server)) {
        workerScript.log("getServerNumPortsRequired", "Cannot be executed on this server.");
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
    getServerRequiredHackingLevel: function (ip: any): any {
      updateDynamicRam("getServerRequiredHackingLevel", getRamCost("getServerRequiredHackingLevel"));
      const server = safeGetServer(ip, "getServerRequiredHackingLevel");
      if (!(server instanceof Server)) {
        workerScript.log("getServerNumPortsRequired", "Cannot be executed on this server.");
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
    getServerMaxMoney: function (ip: any): any {
      updateDynamicRam("getServerMaxMoney", getRamCost("getServerMaxMoney"));
      const server = safeGetServer(ip, "getServerMaxMoney");
      if (!(server instanceof Server)) {
        workerScript.log("getServerNumPortsRequired", "Cannot be executed on this server.");
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
    getServerGrowth: function (ip: any): any {
      updateDynamicRam("getServerGrowth", getRamCost("getServerGrowth"));
      const server = safeGetServer(ip, "getServerGrowth");
      if (!(server instanceof Server)) {
        workerScript.log("getServerNumPortsRequired", "Cannot be executed on this server.");
        return 1;
      }
      if (failOnHacknetServer(server, "getServerGrowth")) {
        return 1;
      }
      workerScript.log("getServerGrowth", `returned ${server.serverGrowth} for '${server.hostname}'`);
      return server.serverGrowth;
    },
    getServerNumPortsRequired: function (ip: any): any {
      updateDynamicRam("getServerNumPortsRequired", getRamCost("getServerNumPortsRequired"));
      const server = safeGetServer(ip, "getServerNumPortsRequired");
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
    getServerRam: function (ip: any): any {
      updateDynamicRam("getServerRam", getRamCost("getServerRam"));
      const server = safeGetServer(ip, "getServerRam");
      workerScript.log(
        "getServerRam",
        `returned [${numeralWrapper.formatRAM(server.maxRam)}, ${numeralWrapper.formatRAM(server.ramUsed)}]`,
      );
      return [server.maxRam, server.ramUsed];
    },
    getServerMaxRam: function (ip: any): any {
      updateDynamicRam("getServerMaxRam", getRamCost("getServerMaxRam"));
      const server = safeGetServer(ip, "getServerMaxRam");
      workerScript.log("getServerMaxRam", `returned ${numeralWrapper.formatRAM(server.maxRam)}`);
      return server.maxRam;
    },
    getServerUsedRam: function (ip: any): any {
      updateDynamicRam("getServerUsedRam", getRamCost("getServerUsedRam"));
      const server = safeGetServer(ip, "getServerUsedRam");
      workerScript.log("getServerUsedRam", `returned ${numeralWrapper.formatRAM(server.ramUsed)}`);
      return server.ramUsed;
    },
    serverExists: function (ip: any): any {
      updateDynamicRam("serverExists", getRamCost("serverExists"));
      return GetServer(ip) !== null;
    },
    fileExists: function (filename: any, ip: any = workerScript.hostname): any {
      updateDynamicRam("fileExists", getRamCost("fileExists"));
      if (filename === undefined) {
        throw makeRuntimeErrorMsg("fileExists", "Usage: fileExists(scriptname, [server])");
      }
      const server = GetServer(ip);
      if (server == null) {
        throw makeRuntimeErrorMsg("fileExists", `Invalid IP/hostname: ${ip}`);
      }
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
        if (!(server.messages[i] instanceof Message) && filename.toLowerCase() === server.messages[i]) {
          return true;
        }
      }
      const txtFile = getTextFile(filename, server);
      if (txtFile != null) {
        return true;
      }
      return false;
    },
    isRunning: function (fn: any, ip: any = workerScript.hostname, ...scriptArgs: any): any {
      updateDynamicRam("isRunning", getRamCost("isRunning"));
      if (fn === undefined || ip === undefined) {
        throw makeRuntimeErrorMsg("isRunning", "Usage: isRunning(scriptname, server, [arg1], [arg2]...)");
      }
      if (typeof fn === "number") {
        return getRunningScriptByPid(fn, "isRunning") != null;
      } else {
        return getRunningScript(fn, ip, "isRunning", scriptArgs) != null;
      }
    },
    getStockSymbols: function (): any {
      updateDynamicRam("getStockSymbols", getRamCost("getStockSymbols"));
      checkTixApiAccess("getStockSymbols");
      return Object.values(StockSymbols);
    },
    getStockPrice: function (symbol: any): any {
      updateDynamicRam("getStockPrice", getRamCost("getStockPrice"));
      checkTixApiAccess("getStockPrice");
      const stock = getStockFromSymbol(symbol, "getStockPrice");

      return stock.price;
    },
    getStockAskPrice: function (symbol: any): any {
      updateDynamicRam("getStockAskPrice", getRamCost("getStockAskPrice"));
      checkTixApiAccess("getStockAskPrice");
      const stock = getStockFromSymbol(symbol, "getStockAskPrice");

      return stock.getAskPrice();
    },
    getStockBidPrice: function (symbol: any): any {
      updateDynamicRam("getStockBidPrice", getRamCost("getStockBidPrice"));
      checkTixApiAccess("getStockBidPrice");
      const stock = getStockFromSymbol(symbol, "getStockBidPrice");

      return stock.getBidPrice();
    },
    getStockPosition: function (symbol: any): any {
      updateDynamicRam("getStockPosition", getRamCost("getStockPosition"));
      checkTixApiAccess("getStockPosition");
      const stock = SymbolToStockMap[symbol];
      if (stock == null) {
        throw makeRuntimeErrorMsg("getStockPosition", `Invalid stock symbol: ${symbol}`);
      }
      return [stock.playerShares, stock.playerAvgPx, stock.playerShortShares, stock.playerAvgShortPx];
    },
    getStockMaxShares: function (symbol: any): any {
      updateDynamicRam("getStockMaxShares", getRamCost("getStockMaxShares"));
      checkTixApiAccess("getStockMaxShares");
      const stock = getStockFromSymbol(symbol, "getStockMaxShares");

      return stock.maxShares;
    },
    getStockPurchaseCost: function (symbol: any, shares: any, posType: any): any {
      updateDynamicRam("getStockPurchaseCost", getRamCost("getStockPurchaseCost"));
      checkTixApiAccess("getStockPurchaseCost");
      const stock = getStockFromSymbol(symbol, "getStockPurchaseCost");
      shares = Math.round(shares);

      let pos;
      const sanitizedPosType = posType.toLowerCase();
      if (sanitizedPosType.includes("l")) {
        pos = PositionTypes.Long;
      } else if (sanitizedPosType.includes("s")) {
        pos = PositionTypes.Short;
      } else {
        return Infinity;
      }

      const res = getBuyTransactionCost(stock, shares, pos);
      if (res == null) {
        return Infinity;
      }

      return res;
    },
    getStockSaleGain: function (symbol: any, shares: any, posType: any): any {
      updateDynamicRam("getStockSaleGain", getRamCost("getStockSaleGain"));
      checkTixApiAccess("getStockSaleGain");
      const stock = getStockFromSymbol(symbol, "getStockSaleGain");
      shares = Math.round(shares);

      let pos;
      const sanitizedPosType = posType.toLowerCase();
      if (sanitizedPosType.includes("l")) {
        pos = PositionTypes.Long;
      } else if (sanitizedPosType.includes("s")) {
        pos = PositionTypes.Short;
      } else {
        return 0;
      }

      const res = getSellTransactionGain(stock, shares, pos);
      if (res == null) {
        return 0;
      }

      return res;
    },
    buyStock: function (symbol: any, shares: any): any {
      updateDynamicRam("buyStock", getRamCost("buyStock"));
      checkTixApiAccess("buyStock");
      const stock = getStockFromSymbol(symbol, "buyStock");
      const res = buyStock(stock, shares, workerScript, {});
      return res ? stock.price : 0;
    },
    sellStock: function (symbol: any, shares: any): any {
      updateDynamicRam("sellStock", getRamCost("sellStock"));
      checkTixApiAccess("sellStock");
      const stock = getStockFromSymbol(symbol, "sellStock");
      const res = sellStock(stock, shares, workerScript, {});

      return res ? stock.price : 0;
    },
    shortStock: function (symbol: any, shares: any): any {
      updateDynamicRam("shortStock", getRamCost("shortStock"));
      checkTixApiAccess("shortStock");
      if (Player.bitNodeN !== 8) {
        if (SourceFileFlags[8] <= 1) {
          throw makeRuntimeErrorMsg(
            "shortStock",
            "You must either be in BitNode-8 or you must have Source-File 8 Level 2.",
          );
        }
      }
      const stock = getStockFromSymbol(symbol, "shortStock");
      const res = shortStock(stock, shares, workerScript, {});

      return res ? stock.price : 0;
    },
    sellShort: function (symbol: any, shares: any): any {
      updateDynamicRam("sellShort", getRamCost("sellShort"));
      checkTixApiAccess("sellShort");
      if (Player.bitNodeN !== 8) {
        if (SourceFileFlags[8] <= 1) {
          throw makeRuntimeErrorMsg(
            "sellShort",
            "You must either be in BitNode-8 or you must have Source-File 8 Level 2.",
          );
        }
      }
      const stock = getStockFromSymbol(symbol, "sellShort");
      const res = sellShort(stock, shares, workerScript, {});

      return res ? stock.price : 0;
    },
    placeOrder: function (symbol: any, shares: any, price: any, type: any, pos: any): any {
      updateDynamicRam("placeOrder", getRamCost("placeOrder"));
      checkTixApiAccess("placeOrder");
      if (Player.bitNodeN !== 8) {
        if (SourceFileFlags[8] <= 2) {
          throw makeRuntimeErrorMsg(
            "placeOrder",
            "You must either be in BitNode-8 or you must have Source-File 8 Level 3.",
          );
        }
      }
      const stock = getStockFromSymbol(symbol, "placeOrder");

      let orderType;
      let orderPos;
      const ltype = type.toLowerCase();
      if (ltype.includes("limit") && ltype.includes("buy")) {
        orderType = OrderTypes.LimitBuy;
      } else if (ltype.includes("limit") && ltype.includes("sell")) {
        orderType = OrderTypes.LimitSell;
      } else if (ltype.includes("stop") && ltype.includes("buy")) {
        orderType = OrderTypes.StopBuy;
      } else if (ltype.includes("stop") && ltype.includes("sell")) {
        orderType = OrderTypes.StopSell;
      } else {
        throw makeRuntimeErrorMsg("placeOrder", `Invalid order type: ${type}`);
      }

      const lpos = pos.toLowerCase();
      if (lpos.includes("l")) {
        orderPos = PositionTypes.Long;
      } else if (lpos.includes("s")) {
        orderPos = PositionTypes.Short;
      } else {
        throw makeRuntimeErrorMsg("placeOrder", `Invalid position type: ${pos}`);
      }

      return placeOrder(stock, shares, price, orderType, orderPos, workerScript);
    },
    cancelOrder: function (symbol: any, shares: any, price: any, type: any, pos: any): any {
      updateDynamicRam("cancelOrder", getRamCost("cancelOrder"));
      checkTixApiAccess("cancelOrder");
      if (Player.bitNodeN !== 8) {
        if (SourceFileFlags[8] <= 2) {
          throw makeRuntimeErrorMsg(
            "cancelOrder",
            "You must either be in BitNode-8 or you must have Source-File 8 Level 3.",
          );
        }
      }
      const stock = getStockFromSymbol(symbol, "cancelOrder");
      if (isNaN(shares) || isNaN(price)) {
        throw makeRuntimeErrorMsg(
          "cancelOrder",
          `Invalid shares or price. Must be numeric. shares=${shares}, price=${price}`,
        );
      }
      let orderType;
      let orderPos;
      const ltype = type.toLowerCase();
      if (ltype.includes("limit") && ltype.includes("buy")) {
        orderType = OrderTypes.LimitBuy;
      } else if (ltype.includes("limit") && ltype.includes("sell")) {
        orderType = OrderTypes.LimitSell;
      } else if (ltype.includes("stop") && ltype.includes("buy")) {
        orderType = OrderTypes.StopBuy;
      } else if (ltype.includes("stop") && ltype.includes("sell")) {
        orderType = OrderTypes.StopSell;
      } else {
        throw makeRuntimeErrorMsg("cancelOrder", `Invalid order type: ${type}`);
      }

      const lpos = pos.toLowerCase();
      if (lpos.includes("l")) {
        orderPos = PositionTypes.Long;
      } else if (lpos.includes("s")) {
        orderPos = PositionTypes.Short;
      } else {
        throw makeRuntimeErrorMsg("cancelOrder", `Invalid position type: ${pos}`);
      }
      const params = {
        stock: stock,
        shares: shares,
        price: price,
        type: orderType,
        pos: orderPos,
      };
      return cancelOrder(params, workerScript);
    },
    getOrders: function (): any {
      updateDynamicRam("getOrders", getRamCost("getOrders"));
      checkTixApiAccess("getOrders");
      if (Player.bitNodeN !== 8) {
        if (SourceFileFlags[8] <= 2) {
          throw makeRuntimeErrorMsg("getOrders", "You must either be in BitNode-8 or have Source-File 8 Level 3.");
        }
      }

      const orders: any = {};

      const stockMarketOrders = StockMarket["Orders"];
      for (const symbol in stockMarketOrders) {
        const orderBook = stockMarketOrders[symbol];
        if (orderBook.constructor === Array && orderBook.length > 0) {
          orders[symbol] = [];
          for (let i = 0; i < orderBook.length; ++i) {
            orders[symbol].push({
              shares: orderBook[i].shares,
              price: orderBook[i].price,
              type: orderBook[i].type,
              position: orderBook[i].pos,
            });
          }
        }
      }

      return orders;
    },
    getStockVolatility: function (symbol: any): any {
      updateDynamicRam("getStockVolatility", getRamCost("getStockVolatility"));
      if (!Player.has4SDataTixApi) {
        throw makeRuntimeErrorMsg("getStockVolatility", "You don't have 4S Market Data TIX API Access!");
      }
      const stock = getStockFromSymbol(symbol, "getStockVolatility");

      return stock.mv / 100; // Convert from percentage to decimal
    },
    getStockForecast: function (symbol: any): any {
      updateDynamicRam("getStockForecast", getRamCost("getStockForecast"));
      if (!Player.has4SDataTixApi) {
        throw makeRuntimeErrorMsg("getStockForecast", "You don't have 4S Market Data TIX API Access!");
      }
      const stock = getStockFromSymbol(symbol, "getStockForecast");

      let forecast = 50;
      stock.b ? (forecast += stock.otlkMag) : (forecast -= stock.otlkMag);
      return forecast / 100; // Convert from percentage to decimal
    },
    purchase4SMarketData: function () {
      updateDynamicRam("purchase4SMarketData", getRamCost("purchase4SMarketData"));
      checkTixApiAccess("purchase4SMarketData");

      if (Player.has4SData) {
        workerScript.log("purchase4SMarketData", "Already purchased 4S Market Data.");
        return true;
      }

      if (Player.money.lt(getStockMarket4SDataCost())) {
        workerScript.log("purchase4SMarketData", "Not enough money to purchase 4S Market Data.");
        return false;
      }

      Player.has4SData = true;
      Player.loseMoney(getStockMarket4SDataCost());
      workerScript.log("purchase4SMarketData", "Purchased 4S Market Data");
      return true;
    },
    purchase4SMarketDataTixApi: function () {
      updateDynamicRam("purchase4SMarketDataTixApi", getRamCost("purchase4SMarketDataTixApi"));
      checkTixApiAccess("purchase4SMarketDataTixApi");

      if (Player.has4SDataTixApi) {
        workerScript.log("purchase4SMarketDataTixApi", "Already purchased 4S Market Data TIX API");
        return true;
      }

      if (Player.money.lt(getStockMarket4STixApiCost())) {
        workerScript.log("purchase4SMarketDataTixApi", "Not enough money to purchase 4S Market Data TIX API");
        return false;
      }

      Player.has4SDataTixApi = true;
      Player.loseMoney(getStockMarket4STixApiCost());
      workerScript.log("purchase4SMarketDataTixApi", "Purchased 4S Market Data TIX API");
      return true;
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
    purchaseServer: function (hostname: any, ram: any): any {
      updateDynamicRam("purchaseServer", getRamCost("purchaseServer"));
      let hostnameStr = String(hostname);
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
      Player.loseMoney(cost);
      workerScript.log(
        "purchaseServer",
        `Purchased new server with hostname '${newServ.hostname}' for ${numeralWrapper.formatMoney(cost)}`,
      );
      return newServ.hostname;
    },
    deleteServer: function (hostname: any): any {
      updateDynamicRam("deleteServer", getRamCost("deleteServer"));
      let hostnameStr = String(hostname);
      hostnameStr = hostnameStr.replace(/\s\s+/g, "");
      const server = GetServer(hostnameStr);
      if (!(server instanceof Server)) {
        workerScript.log("deleteServer", `Invalid argument: hostname='${hostnameStr}'`);
        return false;
      }
      if (server == null) {
        workerScript.log("deleteServer", `Invalid argument: hostname='${hostnameStr}'`);
        return false;
      }

      if (!server.purchasedByPlayer || server.hostname === "home") {
        workerScript.log("deleteServer", "Cannot delete non-purchased server.");
        return false;
      }

      const ip = server.hostname;

      // Can't delete server you're currently connected to
      if (server.isConnectedTo) {
        workerScript.log("deleteServer", "You are currently connected to the server you are trying to delete.");
        return false;
      }

      // A server cannot delete itself
      if (ip === workerScript.hostname) {
        workerScript.log("deleteServer", "Cannot delete the server this script is running on.");
        return false;
      }

      // Delete all scripts running on server
      if (server.runningScripts.length > 0) {
        workerScript.log(
          "deleteServer",
          `Cannot delete server '${server.hostname}' because it still has scripts running.`,
        );
        return false;
      }

      // Delete from player's purchasedServers array
      let found = false;
      for (let i = 0; i < Player.purchasedServers.length; ++i) {
        if (ip == Player.purchasedServers[i]) {
          found = true;
          Player.purchasedServers.splice(i, 1);
          break;
        }
      }

      if (!found) {
        workerScript.log(
          "deleteServer",
          `Could not identify server ${server.hostname} as a purchased server. This is a bug. Report to dev.`,
        );
        return false;
      }

      // Delete from all servers
      DeleteServer(ip);

      // Delete from home computer
      found = false;
      const homeComputer = Player.getHomeComputer();
      for (let i = 0; i < homeComputer.serversOnNetwork.length; ++i) {
        if (ip == homeComputer.serversOnNetwork[i]) {
          homeComputer.serversOnNetwork.splice(i, 1);
          workerScript.log("deleteServer", `Deleted server '${hostnameStr}`);
          return true;
        }
      }
      // Wasn't found on home computer
      workerScript.log(
        "deleteServer",
        `Could not find server ${server.hostname} as a purchased server. This is a bug. Report to dev.`,
      );
      return false;
    },
    getPurchasedServers: function (hostname: any = true): any {
      updateDynamicRam("getPurchasedServers", getRamCost("getPurchasedServers"));
      const res: string[] = [];
      Player.purchasedServers.forEach(function (ip) {
        if (hostname) {
          const server = GetServer(ip);
          if (server == null) {
            throw makeRuntimeErrorMsg("getPurchasedServers", "Could not find server. This is a bug. Report to dev.");
          }
          res.push(server.hostname);
        } else {
          res.push(ip);
        }
      });
      return res;
    },
    write: function (port: any, data: any = "", mode: any = "a"): any {
      updateDynamicRam("write", getRamCost("write"));
      if (!isNaN(port)) {
        // Write to port
        // Port 1-10
        port = Math.round(port);
        if (port < 1 || port > CONSTANTS.NumNetscriptPorts) {
          throw makeRuntimeErrorMsg(
            "write",
            `Trying to write to invalid port: ${port}. Only ports 1-${CONSTANTS.NumNetscriptPorts} are valid.`,
          );
        }
        const iport = NetscriptPorts[port - 1];
        if (iport == null || !(iport instanceof Object)) {
          throw makeRuntimeErrorMsg("write", `Could not find port: ${port}. This is a bug. Report to dev.`);
        }
        return iport.write(data);
      } else if (isString(port)) {
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
        return iport.tryWrite(data);
      } else {
        throw makeRuntimeErrorMsg("tryWrite", `Invalid argument: ${port}`);
      }
    },
    read: function (port: any): any {
      updateDynamicRam("read", getRamCost("read"));
      if (!isNaN(port)) {
        // Read from port
        // Port 1-10
        port = Math.round(port);
        if (port < 1 || port > CONSTANTS.NumNetscriptPorts) {
          throw makeRuntimeErrorMsg(
            "read",
            `Invalid port: ${port}. Only ports 1-${CONSTANTS.NumNetscriptPorts} are valid.`,
          );
        }
        const iport = NetscriptPorts[port - 1];
        if (iport == null || !(iport instanceof Object)) {
          throw makeRuntimeErrorMsg("read", `Could not find port: ${port}. This is a bug. Report to dev.`);
        }
        const x = iport.read();
        console.log(x);
        return x;
      } else if (isString(port)) {
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
      console.log(x);
      return x;
    },
    clear: function (port: any): any {
      updateDynamicRam("clear", getRamCost("clear"));
      if (!isNaN(port)) {
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
      } else if (isString(port)) {
        // Clear text file
        const fn = port;
        const server = GetServer(workerScript.hostname);
        if (server == null) {
          throw makeRuntimeErrorMsg("clear", "Error getting Server. This is a bug. Report to dev.");
        }
        const txtFile = getTextFile(fn, server);
        if (txtFile != null) {
          txtFile.write("");
        }
      } else {
        throw makeRuntimeErrorMsg("clear", `Invalid argument: ${port}`);
      }
      return 0;
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
    rm: function (fn: any, ip: any): any {
      updateDynamicRam("rm", getRamCost("rm"));

      if (ip == null || ip === "") {
        ip = workerScript.hostname;
      }
      const s = safeGetServer(ip, "rm");

      const status = s.removeFile(fn);
      if (!status.res) {
        workerScript.log("rm", status.msg + "");
      }

      return status.res;
    },
    scriptRunning: function (scriptname: any, ip: any): any {
      updateDynamicRam("scriptRunning", getRamCost("scriptRunning"));
      const server = GetServer(ip);
      if (server == null) {
        throw makeRuntimeErrorMsg("scriptRunning", `Invalid IP/hostname: ${ip}`);
      }
      for (let i = 0; i < server.runningScripts.length; ++i) {
        if (server.runningScripts[i].filename == scriptname) {
          return true;
        }
      }
      return false;
    },
    scriptKill: function (scriptname: any, ip: any): any {
      updateDynamicRam("scriptKill", getRamCost("scriptKill"));
      const server = GetServer(ip);
      if (server == null) {
        throw makeRuntimeErrorMsg("scriptKill", `Invalid IP/hostname: ${ip}`);
      }
      let suc = false;
      for (let i = 0; i < server.runningScripts.length; ++i) {
        if (server.runningScripts[i].filename == scriptname) {
          killWorkerScript(server.runningScripts[i], server.hostname);
          suc = true;
        }
      }
      return suc;
    },
    getScriptName: function (): any {
      return workerScript.name;
    },
    getScriptRam: function (scriptname: any, ip: any = workerScript.hostname): any {
      updateDynamicRam("getScriptRam", getRamCost("getScriptRam"));
      const server = GetServer(ip);
      if (server == null) {
        throw makeRuntimeErrorMsg("getScriptRam", `Invalid IP/hostname: ${ip}`);
      }
      for (let i = 0; i < server.scripts.length; ++i) {
        if (server.scripts[i].filename == scriptname) {
          return server.scripts[i].ramUsage;
        }
      }
      return 0;
    },
    getRunningScript: function (fn: any, ip: any, ...args: any[]): any {
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
        runningScript = getRunningScript(fn, ip, "getRunningScript", scriptArgs);
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
    getHackTime: function (ip: any): any {
      updateDynamicRam("getHackTime", getRamCost("getHackTime"));
      const server = safeGetServer(ip, "getHackTime");
      if (!(server instanceof Server)) {
        workerScript.log("getHackTime", "invalid for this kind of server");
        return Infinity;
      }
      if (failOnHacknetServer(server, "getHackTime")) {
        return Infinity;
      }

      return calculateHackingTime(server, Player); // Returns seconds
    },
    getGrowTime: function (ip: any): any {
      updateDynamicRam("getGrowTime", getRamCost("getGrowTime"));
      const server = safeGetServer(ip, "getGrowTime");
      if (!(server instanceof Server)) {
        workerScript.log("getGrowTime", "invalid for this kind of server");
        return Infinity;
      }
      if (failOnHacknetServer(server, "getGrowTime")) {
        return Infinity;
      }

      return calculateGrowTime(server, Player); // Returns seconds
    },
    getWeakenTime: function (ip: any): any {
      updateDynamicRam("getWeakenTime", getRamCost("getWeakenTime"));
      const server = safeGetServer(ip, "getWeakenTime");
      if (!(server instanceof Server)) {
        workerScript.log("getWeakenTime", "invalid for this kind of server");
        return Infinity;
      }
      if (failOnHacknetServer(server, "getWeakenTime")) {
        return Infinity;
      }

      return calculateWeakenTime(server, Player); // Returns seconds
    },
    getScriptIncome: function (scriptname: any, ip: any, ...args: any[]): any {
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
        const server = GetServer(ip);
        if (server == null) {
          throw makeRuntimeErrorMsg("getScriptIncome", `Invalid IP/hostnamed: ${ip}`);
        }
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
    getScriptExpGain: function (scriptname: any, ip: any, ...args: any[]): any {
      updateDynamicRam("getScriptExpGain", getRamCost("getScriptExpGain"));
      if (arguments.length === 0) {
        let total = 0;
        for (const ws of workerScripts.values()) {
          total += ws.scriptRef.onlineExpGained / ws.scriptRef.onlineRunningTime;
        }
        return total;
      } else {
        // Get income for a particular script
        const server = GetServer(ip);
        if (server == null) {
          throw makeRuntimeErrorMsg("getScriptExpGain", `Invalid IP/hostnamed: ${ip}`);
        }
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
    wget: async function (url: any, target: any, ip: any = workerScript.hostname): Promise<boolean> {
      if (!isScriptFilename(target) && !target.endsWith(".txt")) {
        workerScript.log("wget", `Invalid target file: '${target}'. Must be a script or text file.`);
        return Promise.resolve(false);
      }
      const s = safeGetServer(ip, "wget");
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
              workerScript.log("wget", `Successfully retrieved content and overwrote '${target}' on '${ip}'`);
              return resolve(true);
            }
            workerScript.log("wget", `Successfully retrieved content to new file '${target}' on '${ip}'`);
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

    /* Singularity Functions */
    universityCourse: function (universityName: any, className: any): any {
      updateDynamicRam("universityCourse", getRamCost("universityCourse"));
      checkSingularityAccess("universityCourse", 1);
      if (Player.isWorking) {
        const txt = Player.singularityStopWork();
        workerScript.log("universityCourse", txt);
      }

      let costMult, expMult;
      switch (universityName.toLowerCase()) {
        case LocationName.AevumSummitUniversity.toLowerCase():
          if (Player.city != CityName.Aevum) {
            workerScript.log(
              "universityCourse",
              "You cannot study at 'Summit University' because you are not in 'Aevum'.",
            );
            return false;
          }
          Player.gotoLocation(LocationName.AevumSummitUniversity);
          costMult = 4;
          expMult = 3;
          break;
        case LocationName.Sector12RothmanUniversity.toLowerCase():
          if (Player.city != CityName.Sector12) {
            workerScript.log(
              "universityCourse",
              "You cannot study at 'Rothman University' because you are not in 'Sector-12'.",
            );
            return false;
          }
          Player.location = LocationName.Sector12RothmanUniversity;
          costMult = 3;
          expMult = 2;
          break;
        case LocationName.VolhavenZBInstituteOfTechnology.toLowerCase():
          if (Player.city != CityName.Volhaven) {
            workerScript.log(
              "universityCourse",
              "You cannot study at 'ZB Institute of Technology' because you are not in 'Volhaven'.",
            );
            return false;
          }
          Player.location = LocationName.VolhavenZBInstituteOfTechnology;
          costMult = 5;
          expMult = 4;
          break;
        default:
          workerScript.log("universityCourse", `Invalid university name: '${universityName}'.`);
          return false;
      }

      let task;
      switch (className.toLowerCase()) {
        case "Study Computer Science".toLowerCase():
          task = CONSTANTS.ClassStudyComputerScience;
          break;
        case "Data Structures".toLowerCase():
          task = CONSTANTS.ClassDataStructures;
          break;
        case "Networks".toLowerCase():
          task = CONSTANTS.ClassNetworks;
          break;
        case "Algorithms".toLowerCase():
          task = CONSTANTS.ClassAlgorithms;
          break;
        case "Management".toLowerCase():
          task = CONSTANTS.ClassManagement;
          break;
        case "Leadership".toLowerCase():
          task = CONSTANTS.ClassLeadership;
          break;
        default:
          workerScript.log("universityCourse", `Invalid class name: ${className}.`);
          return false;
      }
      Player.startClass(Router, costMult, expMult, task);
      workerScript.log("universityCourse", `Started ${task} at ${universityName}`);
      return true;
    },

    gymWorkout: function (gymName: any, stat: any): any {
      updateDynamicRam("gymWorkout", getRamCost("gymWorkout"));
      checkSingularityAccess("gymWorkout", 1);
      if (Player.isWorking) {
        const txt = Player.singularityStopWork();
        workerScript.log("gymWorkout", txt);
      }
      let costMult, expMult;
      switch (gymName.toLowerCase()) {
        case LocationName.AevumCrushFitnessGym.toLowerCase():
          if (Player.city != CityName.Aevum) {
            workerScript.log("gymWorkout", "You cannot workout at 'Crush Fitness' because you are not in 'Aevum'.");
            return false;
          }
          Player.location = LocationName.AevumCrushFitnessGym;
          costMult = 3;
          expMult = 2;
          break;
        case LocationName.AevumSnapFitnessGym.toLowerCase():
          if (Player.city != CityName.Aevum) {
            workerScript.log("gymWorkout", "You cannot workout at 'Snap Fitness' because you are not in 'Aevum'.");
            return false;
          }
          Player.location = LocationName.AevumSnapFitnessGym;
          costMult = 10;
          expMult = 5;
          break;
        case LocationName.Sector12IronGym.toLowerCase():
          if (Player.city != CityName.Sector12) {
            workerScript.log("gymWorkout", "You cannot workout at 'Iron Gym' because you are not in 'Sector-12'.");
            return false;
          }
          Player.location = LocationName.Sector12IronGym;
          costMult = 1;
          expMult = 1;
          break;
        case LocationName.Sector12PowerhouseGym.toLowerCase():
          if (Player.city != CityName.Sector12) {
            workerScript.log(
              "gymWorkout",
              "You cannot workout at 'Powerhouse Gym' because you are not in 'Sector-12'.",
            );
            return false;
          }
          Player.location = LocationName.Sector12PowerhouseGym;
          costMult = 20;
          expMult = 10;
          break;
        case LocationName.VolhavenMilleniumFitnessGym.toLowerCase():
          if (Player.city != CityName.Volhaven) {
            workerScript.log(
              "gymWorkout",
              "You cannot workout at 'Millenium Fitness Gym' because you are not in 'Volhaven'.",
            );
            return false;
          }
          Player.location = LocationName.VolhavenMilleniumFitnessGym;
          costMult = 7;
          expMult = 4;
          break;
        default:
          workerScript.log("gymWorkout", `Invalid gym name: ${gymName}. gymWorkout() failed`);
          return false;
      }

      switch (stat.toLowerCase()) {
        case "strength".toLowerCase():
        case "str".toLowerCase():
          Player.startClass(Router, costMult, expMult, CONSTANTS.ClassGymStrength);
          break;
        case "defense".toLowerCase():
        case "def".toLowerCase():
          Player.startClass(Router, costMult, expMult, CONSTANTS.ClassGymDefense);
          break;
        case "dexterity".toLowerCase():
        case "dex".toLowerCase():
          Player.startClass(Router, costMult, expMult, CONSTANTS.ClassGymDexterity);
          break;
        case "agility".toLowerCase():
        case "agi".toLowerCase():
          Player.startClass(Router, costMult, expMult, CONSTANTS.ClassGymAgility);
          break;
        default:
          workerScript.log("gymWorkout", `Invalid stat: ${stat}.`);
          return false;
      }
      workerScript.log("gymWorkout", `Started training ${stat} at ${gymName}`);
      return true;
    },

    travelToCity: function (cityname: any): any {
      updateDynamicRam("travelToCity", getRamCost("travelToCity"));
      checkSingularityAccess("travelToCity", 1);

      switch (cityname) {
        case CityName.Aevum:
        case CityName.Chongqing:
        case CityName.Sector12:
        case CityName.NewTokyo:
        case CityName.Ishima:
        case CityName.Volhaven:
          if (Player.money.lt(CONSTANTS.TravelCost)) {
            throw makeRuntimeErrorMsg("travelToCity", "Not enough money to travel.");
          }
          Player.loseMoney(CONSTANTS.TravelCost);
          Player.city = cityname;
          workerScript.log("travelToCity", `Traveled to ${cityname}`);
          return true;
        default:
          workerScript.log("travelToCity", `Invalid city name: '${cityname}'.`);
          return false;
      }
    },

    purchaseTor: function (): any {
      updateDynamicRam("purchaseTor", getRamCost("purchaseTor"));
      checkSingularityAccess("purchaseTor", 1);

      if (Player.hasTorRouter()) {
        workerScript.log("purchaseTor", "You already have a TOR router!");
        return false;
      }

      if (Player.money.lt(CONSTANTS.TorRouterCost)) {
        workerScript.log("purchaseTor", "You cannot afford to purchase a Tor router.");
        return false;
      }
      Player.loseMoney(CONSTANTS.TorRouterCost);

      const darkweb = safetlyCreateUniqueServer({
        ip: createUniqueRandomIp(),
        hostname: "darkweb",
        organizationName: "",
        isConnectedTo: false,
        adminRights: false,
        purchasedByPlayer: false,
        maxRam: 1,
      });
      AddToAllServers(darkweb);

      Player.getHomeComputer().serversOnNetwork.push(darkweb.hostname);
      darkweb.serversOnNetwork.push(Player.getHomeComputer().hostname);
      Player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain);
      workerScript.log("purchaseTor", "You have purchased a Tor router!");
      return true;
    },
    purchaseProgram: function (programName: any): any {
      updateDynamicRam("purchaseProgram", getRamCost("purchaseProgram"));
      checkSingularityAccess("purchaseProgram", 1);

      if (!Player.hasTorRouter()) {
        workerScript.log("purchaseProgram", "You do not have the TOR router.");
        return false;
      }

      programName = programName.toLowerCase();

      let item = null;
      for (const key in DarkWebItems) {
        const i = DarkWebItems[key];
        if (i.program.toLowerCase() == programName) {
          item = i;
        }
      }

      if (item == null) {
        workerScript.log("purchaseProgram", `Invalid program name: '${programName}.`);
        return false;
      }

      if (Player.money.lt(item.price)) {
        workerScript.log(
          "purchaseProgram",
          `Not enough money to purchase '${item.program}'. Need ${numeralWrapper.formatMoney(item.price)}`,
        );
        return false;
      }

      if (Player.hasProgram(item.program)) {
        workerScript.log("purchaseProgram", `You already have the '${item.program}' program`);
        return true;
      }

      Player.loseMoney(item.price);
      Player.getHomeComputer().programs.push(item.program);
      workerScript.log(
        "purchaseProgram",
        `You have purchased the '${item.program}' program. The new program can be found on your home computer.`,
      );
      return true;
    },
    getCurrentServer: function (): any {
      updateDynamicRam("getCurrentServer", getRamCost("getCurrentServer"));
      checkSingularityAccess("getCurrentServer", 1);
      return Player.getCurrentServer().hostname;
    },
    connect: function (hostname: any): any {
      updateDynamicRam("connect", getRamCost("connect"));
      checkSingularityAccess("connect", 1);
      if (!hostname) {
        throw makeRuntimeErrorMsg("connect", `Invalid hostname: '${hostname}'`);
      }

      const target = GetServer(hostname);
      if (target == null) {
        throw makeRuntimeErrorMsg("connect", `Invalid hostname: '${hostname}'`);
        return;
      }

      if (hostname === "home") {
        Player.getCurrentServer().isConnectedTo = false;
        Player.currentServer = Player.getHomeComputer().hostname;
        Player.getCurrentServer().isConnectedTo = true;
        Terminal.setcwd("/");
        return true;
      }

      const server = Player.getCurrentServer();
      for (let i = 0; i < server.serversOnNetwork.length; i++) {
        const other = getServerOnNetwork(server, i);
        if (other === null) continue;
        if (other.hostname == hostname) {
          Player.getCurrentServer().isConnectedTo = false;
          Player.currentServer = target.hostname;
          Player.getCurrentServer().isConnectedTo = true;
          Terminal.setcwd("/");
          return true;
        }
      }

      return false;
    },
    manualHack: function (): any {
      updateDynamicRam("manualHack", getRamCost("manualHack"));
      checkSingularityAccess("manualHack", 1);
      const server = Player.getCurrentServer();
      return hack(server.hostname, true);
    },
    installBackdoor: function (): any {
      updateDynamicRam("installBackdoor", getRamCost("installBackdoor"));
      checkSingularityAccess("installBackdoor", 1);
      const baseserver = Player.getCurrentServer();
      if (!(baseserver instanceof Server)) {
        workerScript.log("installBackdoor", "cannot backdoor this kind of server");
        return Promise.resolve();
      }
      const server = baseserver as Server;
      const installTime = (calculateHackingTime(server, Player) / 4) * 1000;

      // No root access or skill level too low
      const canHack = netscriptCanHack(server, Player);
      if (!canHack.res) {
        throw makeRuntimeErrorMsg("installBackdoor", canHack.msg || "");
      }

      workerScript.log(
        "installBackdoor",
        `Installing backdoor on '${server.hostname}' in ${convertTimeMsToTimeElapsedString(installTime, true)}`,
      );

      return netscriptDelay(installTime, workerScript).then(function () {
        if (workerScript.env.stopFlag) {
          return Promise.reject(workerScript);
        }
        workerScript.log("installBackdoor", `Successfully installed backdoor on '${server.hostname}'`);

        server.backdoorInstalled = true;

        if (SpecialServers.WorldDaemon === server.hostname) {
          Router.toBitVerse(false, false);
        }
        return Promise.resolve();
      });
    },
    getStats: function (): any {
      updateDynamicRam("getStats", getRamCost("getStats"));
      checkSingularityAccess("getStats", 1);
      workerScript.log("getStats", `getStats is deprecated, please use getPlayer`);

      return {
        hacking: Player.hacking_skill,
        strength: Player.strength,
        defense: Player.defense,
        dexterity: Player.dexterity,
        agility: Player.agility,
        charisma: Player.charisma,
        intelligence: Player.intelligence,
      };
    },
    getCharacterInformation: function (): any {
      updateDynamicRam("getCharacterInformation", getRamCost("getCharacterInformation"));
      checkSingularityAccess("getCharacterInformation", 1);
      workerScript.log("getCharacterInformation", `getCharacterInformation is deprecated, please use getPlayer`);

      return {
        bitnode: Player.bitNodeN,
        city: Player.city,
        factions: Player.factions.slice(),
        hp: Player.hp,
        jobs: Object.keys(Player.jobs),
        jobTitles: Object.values(Player.jobs),
        maxHp: Player.max_hp,
        mult: {
          agility: Player.agility_mult,
          agilityExp: Player.agility_exp_mult,
          companyRep: Player.company_rep_mult,
          crimeMoney: Player.crime_money_mult,
          crimeSuccess: Player.crime_success_mult,
          defense: Player.defense_mult,
          defenseExp: Player.defense_exp_mult,
          dexterity: Player.dexterity_mult,
          dexterityExp: Player.dexterity_exp_mult,
          factionRep: Player.faction_rep_mult,
          hacking: Player.hacking_mult,
          hackingExp: Player.hacking_exp_mult,
          strength: Player.strength_mult,
          strengthExp: Player.strength_exp_mult,
          workMoney: Player.work_money_mult,
        },
        timeWorked: Player.timeWorked,
        tor: Player.hasTorRouter(),
        workHackExpGain: Player.workHackExpGained,
        workStrExpGain: Player.workStrExpGained,
        workDefExpGain: Player.workDefExpGained,
        workDexExpGain: Player.workDexExpGained,
        workAgiExpGain: Player.workAgiExpGained,
        workChaExpGain: Player.workChaExpGained,
        workRepGain: Player.workRepGained,
        workMoneyGain: Player.workMoneyGained,
        hackingExp: Player.hacking_exp,
        strengthExp: Player.strength_exp,
        defenseExp: Player.defense_exp,
        dexterityExp: Player.dexterity_exp,
        agilityExp: Player.agility_exp,
        charismaExp: Player.charisma_exp,
      };
    },
    getPlayer: function (): any {
      updateDynamicRam("getPlayer", getRamCost("getPlayer"));

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
    hospitalize: function (): any {
      updateDynamicRam("hospitalize", getRamCost("hospitalize"));
      checkSingularityAccess("hospitalize", 1);
      if (Player.isWorking || Router.page() === Page.Infiltration || Router.page() === Page.BitVerse) {
        workerScript.log("hospitalize", "Cannot go to the hospital because the player is busy.");
        return;
      }
      return Player.hospitalize();
    },
    isBusy: function (): any {
      updateDynamicRam("isBusy", getRamCost("isBusy"));
      checkSingularityAccess("isBusy", 1);
      return Player.isWorking || Router.page() === Page.Infiltration || Router.page() === Page.BitVerse;
    },
    stopAction: function (): any {
      updateDynamicRam("stopAction", getRamCost("stopAction"));
      checkSingularityAccess("stopAction", 1);
      if (Player.isWorking) {
        Router.toTerminal();
        const txt = Player.singularityStopWork();
        workerScript.log("stopAction", txt);
        return true;
      }
      return false;
    },
	 upgradeHomeCores: function (): any {
      updateDynamicRam("upgradeHomeCores", getRamCost("upgradeHomeCores"));
      checkSingularityAccess("upgradeHomeCores", 2);

      // Check if we're at max CORES
      const homeComputer = Player.getHomeComputer();
      if (homeComputer.cpuCores >=8) {
        workerScript.log("upgradeHomeCores", `Your home computer is at max cores.`);
        return false;
      }

      const cost = Player.getUpgradeHomeCoresCost();
      if (Player.money.lt(cost)) {
        workerScript.log("upgradeHomeCores", `You don't have enough money. Need ${numeralWrapper.formatMoney(cost)}`);
        return false;
      }

      homeComputer.cpuCores +=1;
      Player.loseMoney(cost);

      Player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain);
      workerScript.log(
        "upgradeHomeCores",
        `Purchased an additional core for home computer! It now has ${(homeComputer.cpuCores)} cores.`,);
      return true;
    },
    getUpgradeHomeCoresCost: function (): any {
      updateDynamicRam("getUpgradeHomeCoresCost", getRamCost("getUpgradeHomeCoresCost"));
      checkSingularityAccess("getUpgradeHomeCoresCost", 2);

      return Player.getUpgradeHomeCoresCost();
    },
    upgradeHomeRam: function (): any {
      updateDynamicRam("upgradeHomeRam", getRamCost("upgradeHomeRam"));
      checkSingularityAccess("upgradeHomeRam", 2);

      // Check if we're at max RAM
      const homeComputer = Player.getHomeComputer();
      if (homeComputer.maxRam >= CONSTANTS.HomeComputerMaxRam) {
        workerScript.log("upgradeHomeRam", `Your home computer is at max RAM.`);
        return false;
      }

      const cost = Player.getUpgradeHomeRamCost();
      if (Player.money.lt(cost)) {
        workerScript.log("upgradeHomeRam", `You don't have enough money. Need ${numeralWrapper.formatMoney(cost)}`);
        return false;
      }

      homeComputer.maxRam *= 2;
      Player.loseMoney(cost);

      Player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain);
      workerScript.log(
        "upgradeHomeRam",
        `Purchased additional RAM for home computer! It now has ${numeralWrapper.formatRAM(
          homeComputer.maxRam,
        )} of RAM.`,
      );
      return true;
    },
    getUpgradeHomeRamCost: function (): any {
      updateDynamicRam("getUpgradeHomeRamCost", getRamCost("getUpgradeHomeRamCost"));
      checkSingularityAccess("getUpgradeHomeRamCost", 2);

      return Player.getUpgradeHomeRamCost();
    },
    workForCompany: function (companyName: any): any {
      updateDynamicRam("workForCompany", getRamCost("workForCompany"));
      checkSingularityAccess("workForCompany", 2);

      // Sanitize input
      if (companyName == null) {
        companyName = Player.companyName;
      }

      // Make sure its a valid company
      if (companyName == null || companyName === "" || !(Companies[companyName] instanceof Company)) {
        workerScript.log("workForCompany", `Invalid company: '${companyName}'`);
        return false;
      }

      // Make sure player is actually employed at the comapny
      if (!Object.keys(Player.jobs).includes(companyName)) {
        workerScript.log("workForCompany", `You do not have a job at '${companyName}'`);
        return false;
      }

      // Check to make sure company position data is valid
      const companyPositionName = Player.jobs[companyName];
      const companyPosition = CompanyPositions[companyPositionName];
      if (companyPositionName === "" || !(companyPosition instanceof CompanyPosition)) {
        workerScript.log("workForCompany", "You do not have a job");
        return false;
      }

      if (Player.isWorking) {
        const txt = Player.singularityStopWork();
        workerScript.log("workForCompany", txt);
      }

      if (companyPosition.isPartTimeJob()) {
        Player.startWorkPartTime(Router, companyName);
      } else {
        Player.startWork(Router, companyName);
      }
      workerScript.log("workForCompany", `Began working at '${Player.companyName}' as a '${companyPositionName}'`);
      return true;
    },
    applyToCompany: function (companyName: any, field: any): any {
      updateDynamicRam("applyToCompany", getRamCost("applyToCompany"));
      checkSingularityAccess("applyToCompany", 2);
      getCompany("applyToCompany", companyName);

      Player.location = companyName;
      let res;
      switch (field.toLowerCase()) {
        case "software":
          res = Player.applyForSoftwareJob(true);
          break;
        case "software consultant":
          res = Player.applyForSoftwareConsultantJob(true);
          break;
        case "it":
          res = Player.applyForItJob(true);
          break;
        case "security engineer":
          res = Player.applyForSecurityEngineerJob(true);
          break;
        case "network engineer":
          res = Player.applyForNetworkEngineerJob(true);
          break;
        case "business":
          res = Player.applyForBusinessJob(true);
          break;
        case "business consultant":
          res = Player.applyForBusinessConsultantJob(true);
          break;
        case "security":
          res = Player.applyForSecurityJob(true);
          break;
        case "agent":
          res = Player.applyForAgentJob(true);
          break;
        case "employee":
          res = Player.applyForEmployeeJob(true);
          break;
        case "part-time employee":
          res = Player.applyForPartTimeEmployeeJob(true);
          break;
        case "waiter":
          res = Player.applyForWaiterJob(true);
          break;
        case "part-time waiter":
          res = Player.applyForPartTimeWaiterJob(true);
          break;
        default:
          workerScript.log("applyToCompany", `Invalid job: '${field}'.`);
          return false;
      }
      // TODO https://github.com/danielyxie/bitburner/issues/1378
      // The Player object's applyForJob function can return string with special error messages
      // if (isString(res)) {
      //   workerScript.log("applyToCompany", res);
      //   return false;
      // }
      if (res) {
        workerScript.log(
          "applyToCompany",
          `You were offered a new job at '${companyName}' as a '${Player.jobs[companyName]}'`,
        );
      } else {
        workerScript.log(
          "applyToCompany",
          `You failed to get a new job/promotion at '${companyName}' in the '${field}' field.`,
        );
      }
      return res;
    },
    getCompanyRep: function (companyName: any): any {
      updateDynamicRam("getCompanyRep", getRamCost("getCompanyRep"));
      checkSingularityAccess("getCompanyRep", 2);
      const company = getCompany("getCompanyRep", companyName);
      return company.playerReputation;
    },
    getCompanyFavor: function (companyName: any): any {
      updateDynamicRam("getCompanyFavor", getRamCost("getCompanyFavor"));
      checkSingularityAccess("getCompanyFavor", 2);
      const company = getCompany("getCompanyFavor", companyName);
      return company.favor;
    },
    getCompanyFavorGain: function (companyName: any): any {
      updateDynamicRam("getCompanyFavorGain", getRamCost("getCompanyFavorGain"));
      checkSingularityAccess("getCompanyFavorGain", 2);
      const company = getCompany("getCompanyFavorGain", companyName);
      return company.getFavorGain()[0];
    },
    checkFactionInvitations: function (): any {
      updateDynamicRam("checkFactionInvitations", getRamCost("checkFactionInvitations"));
      checkSingularityAccess("checkFactionInvitations", 2);
      // Make a copy of Player.factionInvitations
      return Player.factionInvitations.slice();
    },
    joinFaction: function (name: any): any {
      updateDynamicRam("joinFaction", getRamCost("joinFaction"));
      checkSingularityAccess("joinFaction", 2);
      getFaction("joinFaction", name);

      if (!Player.factionInvitations.includes(name)) {
        workerScript.log("joinFaction", `You have not been invited by faction '${name}'`);
        return false;
      }
      const fac = Factions[name];
      joinFaction(fac);

      // Update Faction Invitation list to account for joined + banned factions
      for (let i = 0; i < Player.factionInvitations.length; ++i) {
        if (Player.factionInvitations[i] == name || Factions[Player.factionInvitations[i]].isBanned) {
          Player.factionInvitations.splice(i, 1);
          i--;
        }
      }
      Player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain);
      workerScript.log("joinFaction", `Joined the '${name}' faction.`);
      return true;
    },
    workForFaction: function (name: any, type: any): any {
      updateDynamicRam("workForFaction", getRamCost("workForFaction"));
      checkSingularityAccess("workForFaction", 2);
      getFaction("workForFaction", name);

      // if the player is in a gang and the target faction is any of the gang faction, fail
      if (Player.inGang() && AllGangs[name] !== undefined) {
        workerScript.log("workForFaction", `Faction '${name}' does not offer work at the moment.`);
        return;
      }

      if (!Player.factions.includes(name)) {
        workerScript.log("workForFaction", `You are not a member of '${name}'`);
        return false;
      }

      if (Player.isWorking) {
        const txt = Player.singularityStopWork();
        workerScript.log("workForFaction", txt);
      }

      const fac = Factions[name];
      // Arrays listing factions that allow each time of work
      const hackAvailable = [
        "Illuminati",
        "Daedalus",
        "The Covenant",
        "ECorp",
        "MegaCorp",
        "Bachman & Associates",
        "Blade Industries",
        "NWO",
        "Clarke Incorporated",
        "OmniTek Incorporated",
        "Four Sigma",
        "KuaiGong International",
        "Fulcrum Secret Technologies",
        "BitRunners",
        "The Black Hand",
        "NiteSec",
        "Chongqing",
        "Sector-12",
        "New Tokyo",
        "Aevum",
        "Ishima",
        "Volhaven",
        "Speakers for the Dead",
        "The Dark Army",
        "The Syndicate",
        "Silhouette",
        "Netburners",
        "Tian Di Hui",
        "CyberSec",
      ];
      const fdWkAvailable = [
        "Illuminati",
        "Daedalus",
        "The Covenant",
        "ECorp",
        "MegaCorp",
        "Bachman & Associates",
        "Blade Industries",
        "NWO",
        "Clarke Incorporated",
        "OmniTek Incorporated",
        "Four Sigma",
        "KuaiGong International",
        "The Black Hand",
        "Chongqing",
        "Sector-12",
        "New Tokyo",
        "Aevum",
        "Ishima",
        "Volhaven",
        "Speakers for the Dead",
        "The Dark Army",
        "The Syndicate",
        "Silhouette",
        "Tetrads",
        "Slum Snakes",
      ];
      const scWkAvailable = [
        "ECorp",
        "MegaCorp",
        "Bachman & Associates",
        "Blade Industries",
        "NWO",
        "Clarke Incorporated",
        "OmniTek Incorporated",
        "Four Sigma",
        "KuaiGong International",
        "Fulcrum Secret Technologies",
        "Chongqing",
        "Sector-12",
        "New Tokyo",
        "Aevum",
        "Ishima",
        "Volhaven",
        "Speakers for the Dead",
        "The Syndicate",
        "Tetrads",
        "Slum Snakes",
        "Tian Di Hui",
      ];

      switch (type.toLowerCase()) {
        case "hacking":
        case "hacking contracts":
        case "hackingcontracts":
          if (!hackAvailable.includes(fac.name)) {
            workerScript.log("workForFaction", `Faction '${fac.name}' do not need help with hacking contracts.`);
            return false;
          }
          Player.startFactionHackWork(Router, fac);
          workerScript.log("workForFaction", `Started carrying out hacking contracts for '${fac.name}'`);
          return true;
        case "field":
        case "fieldwork":
        case "field work":
          if (!fdWkAvailable.includes(fac.name)) {
            workerScript.log("workForFaction", `Faction '${fac.name}' do not need help with field missions.`);
            return false;
          }
          Player.startFactionFieldWork(Router, fac);
          workerScript.log("workForFaction", `Started carrying out field missions for '${fac.name}'`);
          return true;
        case "security":
        case "securitywork":
        case "security work":
          if (!scWkAvailable.includes(fac.name)) {
            workerScript.log("workForFaction", `Faction '${fac.name}' do not need help with security work.`);
            return false;
          }
          Player.startFactionSecurityWork(Router, fac);
          workerScript.log("workForFaction", `Started carrying out security work for '${fac.name}'`);
          return true;
        default:
          workerScript.log("workForFaction", `Invalid work type: '${type}`);
      }
      return true;
    },
    getFactionRep: function (name: any): any {
      updateDynamicRam("getFactionRep", getRamCost("getFactionRep"));
      checkSingularityAccess("getFactionRep", 2);
      const faction = getFaction("getFactionRep", name);
      return faction.playerReputation;
    },
    getFactionFavor: function (name: any): any {
      updateDynamicRam("getFactionFavor", getRamCost("getFactionFavor"));
      checkSingularityAccess("getFactionFavor", 2);
      const faction = getFaction("getFactionFavor", name);
      return faction.favor;
    },
    getFactionFavorGain: function (name: any): any {
      updateDynamicRam("getFactionFavorGain", getRamCost("getFactionFavorGain"));
      checkSingularityAccess("getFactionFavorGain", 2);
      const faction = getFaction("getFactionFavorGain", name);
      return faction.getFavorGain()[0];
    },
    donateToFaction: function (name: any, amt: any): any {
      updateDynamicRam("donateToFaction", getRamCost("donateToFaction"));
      checkSingularityAccess("donateToFaction", 3);
      const faction = getFaction("donateToFaction", name);

      if (typeof amt !== "number" || amt <= 0) {
        workerScript.log("donateToFaction", `Invalid donation amount: '${amt}'.`);
        return false;
      }
      if (Player.money.lt(amt)) {
        workerScript.log(
          "donateToFaction",
          `You do not have enough money to donate ${numeralWrapper.formatMoney(amt)} to '${name}'`,
        );
        return false;
      }
      const repNeededToDonate = Math.round(CONSTANTS.BaseFavorToDonate * BitNodeMultipliers.RepToDonateToFaction);
      if (faction.favor < repNeededToDonate) {
        workerScript.log(
          "donateToFaction",
          `You do not have enough favor to donate to this faction. Have ${faction.favor}, need ${repNeededToDonate}`,
        );
        return false;
      }
      const repGain = (amt / CONSTANTS.DonateMoneyToRepDivisor) * Player.faction_rep_mult;
      faction.playerReputation += repGain;
      Player.loseMoney(amt);
      workerScript.log(
        "donateToFaction",
        `${numeralWrapper.formatMoney(amt)} donated to '${name}' for ${numeralWrapper.formatReputation(
          repGain,
        )} reputation`,
      );
      return true;
    },
    createProgram: function (name: any): any {
      updateDynamicRam("createProgram", getRamCost("createProgram"));
      checkSingularityAccess("createProgram", 3);

      if (Player.isWorking) {
        const txt = Player.singularityStopWork();
        workerScript.log("createProgram", txt);
      }

      name = name.toLowerCase();

      let p = null;
      for (const key in Programs) {
        if (Programs[key].name.toLowerCase() == name) {
          p = Programs[key];
        }
      }

      if (p == null) {
        workerScript.log("createProgram", `The specified program does not exist: '${name}`);
        return false;
      }

      if (Player.hasProgram(p.name)) {
        workerScript.log("createProgram", `You already have the '${p.name}' program`);
        return false;
      }

      const create = p.create;
      if (create === null) {
        workerScript.log("createProgram", `You cannot create the '${p.name}' program`);
        return false;
      }

      if (!create.req(Player)) {
        workerScript.log("createProgram", `Hacking level is too low to create '${p.name}' (level ${create.level} req)`);
        return false;
      }

      Player.startCreateProgramWork(Router, p.name, create.time, create.level);
      workerScript.log("createProgram", `Began creating program: '${name}'`);
      return true;
    },
    commitCrime: function (crimeRoughName: any): any {
      updateDynamicRam("commitCrime", getRamCost("commitCrime"));
      checkSingularityAccess("commitCrime", 3);

      if (Player.isWorking) {
        const txt = Player.singularityStopWork();
        workerScript.log("commitCrime", txt);
      }

      // Set Location to slums
      Player.gotoLocation(LocationName.Slums);

      const crime = findCrime(crimeRoughName.toLowerCase());
      if (crime == null) {
        // couldn't find crime
        throw makeRuntimeErrorMsg("commitCrime", `Invalid crime: '${crimeRoughName}'`);
      }
      workerScript.log("commitCrime", `Attempting to commit ${crime.name}...`);
      return crime.commit(Router, Player, 1, workerScript);
    },
    getCrimeChance: function (crimeRoughName: any): any {
      updateDynamicRam("getCrimeChance", getRamCost("getCrimeChance"));
      checkSingularityAccess("getCrimeChance", 3);

      const crime = findCrime(crimeRoughName.toLowerCase());
      if (crime == null) {
        throw makeRuntimeErrorMsg("getCrimeChance", `Invalid crime: ${crimeRoughName}`);
      }

      return crime.successRate(Player);
    },
    getCrimeStats: function (crimeRoughName: any): any {
      updateDynamicRam("getCrimeStats", getRamCost("getCrimeStats"));
      checkSingularityAccess("getCrimeStats", 3);

      const crime = findCrime(crimeRoughName.toLowerCase());
      if (crime == null) {
        throw makeRuntimeErrorMsg("getCrimeStats", `Invalid crime: ${crimeRoughName}`);
      }

      return Object.assign({}, crime);
    },
    getOwnedAugmentations: function (purchased: any = false): any {
      updateDynamicRam("getOwnedAugmentations", getRamCost("getOwnedAugmentations"));
      checkSingularityAccess("getOwnedAugmentations", 3);
      const res = [];
      for (let i = 0; i < Player.augmentations.length; ++i) {
        res.push(Player.augmentations[i].name);
      }
      if (purchased) {
        for (let i = 0; i < Player.queuedAugmentations.length; ++i) {
          res.push(Player.queuedAugmentations[i].name);
        }
      }
      return res;
    },
    getOwnedSourceFiles: function (): any {
      updateDynamicRam("getOwnedSourceFiles", getRamCost("getOwnedSourceFiles"));
      checkSingularityAccess("getOwnedSourceFiles", 3);
      const res = [];
      for (let i = 0; i < Player.sourceFiles.length; ++i) {
        res.push({
          n: Player.sourceFiles[i].n,
          lvl: Player.sourceFiles[i].lvl,
        });
      }
      return res;
    },
    getAugmentationsFromFaction: function (facname: any): any {
      updateDynamicRam("getAugmentationsFromFaction", getRamCost("getAugmentationsFromFaction"));
      checkSingularityAccess("getAugmentationsFromFaction", 3);
      const faction = getFaction("getAugmentationsFromFaction", facname);

      // If player has a gang with this faction, return all augmentations.
      if (Player.hasGangWith(facname)) {
        const res = [];
        for (const augName in Augmentations) {
          const aug = Augmentations[augName];
          if (!aug.isSpecial) {
            res.push(augName);
          }
        }

        return res;
      }

      return faction.augmentations.slice();
    },
    getAugmentationCost: function (name: any): any {
      updateDynamicRam("getAugmentationCost", getRamCost("getAugmentationCost"));
      checkSingularityAccess("getAugmentationCost", 3);
      const aug = getAugmentation("getAugmentationCost", name);
      return [aug.baseRepRequirement, aug.baseCost];
    },
    getAugmentationPrereq: function (name: any): any {
      updateDynamicRam("getAugmentationPrereq", getRamCost("getAugmentationPrereq"));
      checkSingularityAccess("getAugmentationPrereq", 3);
      const aug = getAugmentation("getAugmentationPrereq", name);
      return aug.prereqs.slice();
    },
    getAugmentationPrice: function (name: any): any {
      updateDynamicRam("getAugmentationPrice", getRamCost("getAugmentationPrice"));
      checkSingularityAccess("getAugmentationPrice", 3);
      const aug = getAugmentation("getAugmentationPrice", name);
      return aug.baseCost;
    },
    getAugmentationRepReq: function (name: any): any {
      updateDynamicRam("getAugmentationRepReq", getRamCost("getAugmentationRepReq"));
      checkSingularityAccess("getAugmentationRepReq", 3);
      const aug = getAugmentation("getAugmentationRepReq", name);
      return aug.baseRepRequirement;
    },
    getAugmentationStats: function (name: any): any {
      updateDynamicRam("getAugmentationStats", getRamCost("getAugmentationStats"));
      checkSingularityAccess("getAugmentationStats", 3);
      const aug = getAugmentation("getAugmentationStats", name);
      return Object.assign({}, aug.mults);
    },
    purchaseAugmentation: function (faction: any, name: any): any {
      updateDynamicRam("purchaseAugmentation", getRamCost("purchaseAugmentation"));
      checkSingularityAccess("purchaseAugmentation", 3);
      const fac = getFaction("purchaseAugmentation", faction);
      const aug = getAugmentation("purchaseAugmentation", name);

      let augs = [];
      if (Player.hasGangWith(faction)) {
        for (const augName in Augmentations) {
          const tempAug = Augmentations[augName];
          if (!tempAug.isSpecial) {
            augs.push(augName);
          }
        }
      } else {
        augs = fac.augmentations;
      }

      if (!augs.includes(name)) {
        workerScript.log("purchaseAugmentation", `Faction '${faction}' does not have the '${name}' augmentation.`);
        return false;
      }

      const isNeuroflux = aug.name === AugmentationNames.NeuroFluxGovernor;
      if (!isNeuroflux) {
        for (let j = 0; j < Player.queuedAugmentations.length; ++j) {
          if (Player.queuedAugmentations[j].name === aug.name) {
            workerScript.log("purchaseAugmentation", `You already have the '${name}' augmentation.`);
            return false;
          }
        }
        for (let j = 0; j < Player.augmentations.length; ++j) {
          if (Player.augmentations[j].name === aug.name) {
            workerScript.log("purchaseAugmentation", `You already have the '${name}' augmentation.`);
            return false;
          }
        }
      }

      if (fac.playerReputation < aug.baseRepRequirement) {
        workerScript.log("purchaseAugmentation", `You do not have enough reputation with '${fac.name}'.`);
        return false;
      }

      const res = purchaseAugmentation(aug, fac, true);
      workerScript.log("purchaseAugmentation", res);
      if (isString(res) && res.startsWith("You purchased")) {
        Player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain);
        return true;
      } else {
        return false;
      }
    },
    softReset: function (cbScript: any): any {
      updateDynamicRam("softReset", getRamCost("softReset"));
      checkSingularityAccess("softReset", 3);

      workerScript.log("softReset", "Soft resetting. This will cause this script to be killed");
      setTimeout(() => {
        prestigeAugmentation();
        runAfterReset(cbScript);
      }, 0);

      // Prevent workerScript from "finishing execution naturally"
      workerScript.running = false;
      killWorkerScript(workerScript);
    },
    installAugmentations: function (cbScript: any): any {
      updateDynamicRam("installAugmentations", getRamCost("installAugmentations"));
      checkSingularityAccess("installAugmentations", 3);

      if (Player.queuedAugmentations.length === 0) {
        workerScript.log("installAugmentations", "You do not have any Augmentations to be installed.");
        return false;
      }
      Player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain);
      workerScript.log("installAugmentations", "Installing Augmentations. This will cause this script to be killed");
      setTimeout(() => {
        installAugmentations();
        runAfterReset(cbScript);
      }, 0);

      workerScript.running = false; // Prevent workerScript from "finishing execution naturally"
      killWorkerScript(workerScript);
    },

    // Gang API
    gang: gang,

    // Bladeburner API
    bladeburner: {
      getContractNames: function (): any {
        updateDynamicRam("getContractNames", getRamCost("bladeburner", "getContractNames"));
        checkBladeburnerAccess("getContractNames");
        const bladeburner = Player.bladeburner;
        if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
        return bladeburner.getContractNamesNetscriptFn();
      },
      getOperationNames: function (): any {
        updateDynamicRam("getOperationNames", getRamCost("bladeburner", "getOperationNames"));
        checkBladeburnerAccess("getOperationNames");
        const bladeburner = Player.bladeburner;
        if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
        return bladeburner.getOperationNamesNetscriptFn();
      },
      getBlackOpNames: function (): any {
        updateDynamicRam("getBlackOpNames", getRamCost("bladeburner", "getBlackOpNames"));
        checkBladeburnerAccess("getBlackOpNames");
        const bladeburner = Player.bladeburner;
        if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
        return bladeburner.getBlackOpNamesNetscriptFn();
      },
      getBlackOpRank: function (name: any = ""): any {
        updateDynamicRam("getBlackOpRank", getRamCost("bladeburner", "getBlackOpRank"));
        checkBladeburnerAccess("getBlackOpRank");
        const action: any = getBladeburnerActionObject("getBlackOpRank", "blackops", name);
        return action.reqdRank;
      },
      getGeneralActionNames: function (): any {
        updateDynamicRam("getGeneralActionNames", getRamCost("bladeburner", "getGeneralActionNames"));
        checkBladeburnerAccess("getGeneralActionNames");
        const bladeburner = Player.bladeburner;
        if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
        return bladeburner.getGeneralActionNamesNetscriptFn();
      },
      getSkillNames: function (): any {
        updateDynamicRam("getSkillNames", getRamCost("bladeburner", "getSkillNames"));
        checkBladeburnerAccess("getSkillNames");
        const bladeburner = Player.bladeburner;
        if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
        return bladeburner.getSkillNamesNetscriptFn();
      },
      startAction: function (type: any = "", name: any = ""): any {
        updateDynamicRam("startAction", getRamCost("bladeburner", "startAction"));
        checkBladeburnerAccess("startAction");
        const bladeburner = Player.bladeburner;
        if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
        try {
          return bladeburner.startActionNetscriptFn(Player, type, name, workerScript);
        } catch (e: any) {
          throw makeRuntimeErrorMsg("bladeburner.startAction", e);
        }
      },
      stopBladeburnerAction: function (): any {
        updateDynamicRam("stopBladeburnerAction", getRamCost("bladeburner", "stopBladeburnerAction"));
        checkBladeburnerAccess("stopBladeburnerAction");
        const bladeburner = Player.bladeburner;
        if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
        return bladeburner.resetAction();
      },
      getCurrentAction: function (): any {
        updateDynamicRam("getCurrentAction", getRamCost("bladeburner", "getCurrentAction"));
        checkBladeburnerAccess("getCurrentAction");
        const bladeburner = Player.bladeburner;
        if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
        return bladeburner.getTypeAndNameFromActionId(bladeburner.action);
      },
      getActionTime: function (type: any = "", name: any = ""): any {
        updateDynamicRam("getActionTime", getRamCost("bladeburner", "getActionTime"));
        checkBladeburnerAccess("getActionTime");
        const bladeburner = Player.bladeburner;
        if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
        try {
          return bladeburner.getActionTimeNetscriptFn(Player, type, name, workerScript);
        } catch (e: any) {
          throw makeRuntimeErrorMsg("bladeburner.getActionTime", e);
        }
      },
      getActionEstimatedSuccessChance: function (type: any = "", name: any = ""): any {
        updateDynamicRam(
          "getActionEstimatedSuccessChance",
          getRamCost("bladeburner", "getActionEstimatedSuccessChance"),
        );
        checkBladeburnerAccess("getActionEstimatedSuccessChance");
        const bladeburner = Player.bladeburner;
        if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
        try {
          return bladeburner.getActionEstimatedSuccessChanceNetscriptFn(Player, type, name, workerScript);
        } catch (e: any) {
          throw makeRuntimeErrorMsg("bladeburner.getActionEstimatedSuccessChance", e);
        }
      },
      getActionRepGain: function (type: any = "", name: any = "", level: any): any {
        updateDynamicRam("getActionRepGain", getRamCost("bladeburner", "getActionRepGain"));
        checkBladeburnerAccess("getActionRepGain");
        const action = getBladeburnerActionObject("getActionRepGain", type, name);
        let rewardMultiplier;
        if (level == null || isNaN(level)) {
          rewardMultiplier = Math.pow(action.rewardFac, action.level - 1);
        } else {
          rewardMultiplier = Math.pow(action.rewardFac, level - 1);
        }

        return action.rankGain * rewardMultiplier * BitNodeMultipliers.BladeburnerRank;
      },
      getActionCountRemaining: function (type: any = "", name: any = ""): any {
        updateDynamicRam("getActionCountRemaining", getRamCost("bladeburner", "getActionCountRemaining"));
        checkBladeburnerAccess("getActionCountRemaining");
        const bladeburner = Player.bladeburner;
        if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
        try {
          return bladeburner.getActionCountRemainingNetscriptFn(type, name, workerScript);
        } catch (e: any) {
          throw makeRuntimeErrorMsg("bladeburner.getActionCountRemaining", e);
        }
      },
      getActionMaxLevel: function (type: any = "", name: any = ""): any {
        updateDynamicRam("getActionMaxLevel", getRamCost("bladeburner", "getActionMaxLevel"));
        checkBladeburnerAccess("getActionMaxLevel");
        const action = getBladeburnerActionObject("getActionMaxLevel", type, name);
        return action.maxLevel;
      },
      getActionCurrentLevel: function (type: any = "", name: any = ""): any {
        updateDynamicRam("getActionCurrentLevel", getRamCost("bladeburner", "getActionCurrentLevel"));
        checkBladeburnerAccess("getActionCurrentLevel");
        const action = getBladeburnerActionObject("getActionCurrentLevel", type, name);
        return action.level;
      },
      getActionAutolevel: function (type: any = "", name: any = ""): any {
        updateDynamicRam("getActionAutolevel", getRamCost("bladeburner", "getActionAutolevel"));
        checkBladeburnerAccess("getActionAutolevel");
        const action = getBladeburnerActionObject("getActionCurrentLevel", type, name);
        return action.autoLevel;
      },
      setActionAutolevel: function (type: any = "", name: any = "", autoLevel: any = true): any {
        updateDynamicRam("setActionAutolevel", getRamCost("bladeburner", "setActionAutolevel"));
        checkBladeburnerAccess("setActionAutolevel");
        const action = getBladeburnerActionObject("setActionAutolevel", type, name);
        action.autoLevel = autoLevel;
      },
      setActionLevel: function (type: any = "", name: any = "", level: any = 1): any {
        updateDynamicRam("setActionLevel", getRamCost("bladeburner", "setActionLevel"));
        checkBladeburnerAccess("setActionLevel");
        const action = getBladeburnerActionObject("setActionLevel", type, name);
        if (level < 1 || level > action.maxLevel) {
          throw makeRuntimeErrorMsg(
            "bladeburner.setActionLevel",
            `Level must be between 1 and ${action.maxLevel}, is ${level}`,
          );
        }
        action.level = level;
      },
      getRank: function (): any {
        updateDynamicRam("getRank", getRamCost("bladeburner", "getRank"));
        checkBladeburnerAccess("getRank");
        const bladeburner = Player.bladeburner;
        if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
        return bladeburner.rank;
      },
      getSkillPoints: function (): any {
        updateDynamicRam("getSkillPoints", getRamCost("bladeburner", "getSkillPoints"));
        checkBladeburnerAccess("getSkillPoints");
        const bladeburner = Player.bladeburner;
        if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
        return bladeburner.skillPoints;
      },
      getSkillLevel: function (skillName: any = ""): any {
        updateDynamicRam("getSkillLevel", getRamCost("bladeburner", "getSkillLevel"));
        checkBladeburnerAccess("getSkillLevel");
        const bladeburner = Player.bladeburner;
        if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
        try {
          return bladeburner.getSkillLevelNetscriptFn(skillName, workerScript);
        } catch (e: any) {
          throw makeRuntimeErrorMsg("bladeburner.getSkillLevel", e);
        }
      },
      getSkillUpgradeCost: function (skillName: any = ""): any {
        updateDynamicRam("getSkillUpgradeCost", getRamCost("bladeburner", "getSkillUpgradeCost"));
        checkBladeburnerAccess("getSkillUpgradeCost");
        const bladeburner = Player.bladeburner;
        if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
        try {
          return bladeburner.getSkillUpgradeCostNetscriptFn(skillName, workerScript);
        } catch (e: any) {
          throw makeRuntimeErrorMsg("bladeburner.getSkillUpgradeCost", e);
        }
      },
      upgradeSkill: function (skillName: any): any {
        updateDynamicRam("upgradeSkill", getRamCost("bladeburner", "upgradeSkill"));
        checkBladeburnerAccess("upgradeSkill");
        const bladeburner = Player.bladeburner;
        if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
        try {
          return bladeburner.upgradeSkillNetscriptFn(skillName, workerScript);
        } catch (e: any) {
          throw makeRuntimeErrorMsg("bladeburner.upgradeSkill", e);
        }
      },
      getTeamSize: function (type: any = "", name: any = ""): any {
        updateDynamicRam("getTeamSize", getRamCost("bladeburner", "getTeamSize"));
        checkBladeburnerAccess("getTeamSize");
        const bladeburner = Player.bladeburner;
        if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
        try {
          return bladeburner.getTeamSizeNetscriptFn(type, name, workerScript);
        } catch (e: any) {
          throw makeRuntimeErrorMsg("bladeburner.getTeamSize", e);
        }
      },
      setTeamSize: function (type: any = "", name: any = "", size: any): any {
        updateDynamicRam("setTeamSize", getRamCost("bladeburner", "setTeamSize"));
        checkBladeburnerAccess("setTeamSize");
        const bladeburner = Player.bladeburner;
        if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
        try {
          return bladeburner.setTeamSizeNetscriptFn(type, name, size, workerScript);
        } catch (e: any) {
          throw makeRuntimeErrorMsg("bladeburner.setTeamSize", e);
        }
      },
      getCityEstimatedPopulation: function (cityName: any): any {
        updateDynamicRam("getCityEstimatedPopulation", getRamCost("bladeburner", "getCityEstimatedPopulation"));
        checkBladeburnerAccess("getCityEstimatedPopulation");
        checkBladeburnerCity("getCityEstimatedPopulation", cityName);
        const bladeburner = Player.bladeburner;
        if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
        return bladeburner.cities[cityName].popEst;
      },
      getCityEstimatedCommunities: function (cityName: any): any {
        updateDynamicRam("getCityEstimatedCommunities", getRamCost("bladeburner", "getCityEstimatedCommunities"));
        checkBladeburnerAccess("getCityEstimatedCommunities");
        checkBladeburnerCity("getCityEstimatedCommunities", cityName);
        const bladeburner = Player.bladeburner;
        if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
        return bladeburner.cities[cityName].commsEst;
      },
      getCityChaos: function (cityName: any): any {
        updateDynamicRam("getCityChaos", getRamCost("bladeburner", "getCityChaos"));
        checkBladeburnerAccess("getCityChaos");
        checkBladeburnerCity("getCityChaos", cityName);
        const bladeburner = Player.bladeburner;
        if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
        return bladeburner.cities[cityName].chaos;
      },
      getCity: function (): any {
        updateDynamicRam("getCity", getRamCost("bladeburner", "getCity"));
        checkBladeburnerAccess("getCityChaos");
        const bladeburner = Player.bladeburner;
        if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
        return bladeburner.city;
      },
      switchCity: function (cityName: any): any {
        updateDynamicRam("switchCity", getRamCost("bladeburner", "switchCity"));
        checkBladeburnerAccess("switchCity");
        checkBladeburnerCity("switchCity", cityName);
        const bladeburner = Player.bladeburner;
        if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
        return (bladeburner.city = cityName);
      },
      getStamina: function (): any {
        updateDynamicRam("getStamina", getRamCost("bladeburner", "getStamina"));
        checkBladeburnerAccess("getStamina");
        const bladeburner = Player.bladeburner;
        if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
        return [bladeburner.stamina, bladeburner.maxStamina];
      },
      joinBladeburnerFaction: function (): any {
        updateDynamicRam("joinBladeburnerFaction", getRamCost("bladeburner", "joinBladeburnerFaction"));
        checkBladeburnerAccess("joinBladeburnerFaction", true);
        const bladeburner = Player.bladeburner;
        if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
        return bladeburner.joinBladeburnerFactionNetscriptFn(workerScript);
      },
      joinBladeburnerDivision: function (): any {
        updateDynamicRam("joinBladeburnerDivision", getRamCost("bladeburner", "joinBladeburnerDivision"));
        if (Player.bitNodeN === 7 || SourceFileFlags[7] > 0) {
          if (Player.bitNodeN === 8) {
            return false;
          }
          if (Player.bladeburner instanceof Bladeburner) {
            return true; // Already member
          } else if (
            Player.strength >= 100 &&
            Player.defense >= 100 &&
            Player.dexterity >= 100 &&
            Player.agility >= 100
          ) {
            Player.bladeburner = new Bladeburner(Player);
            workerScript.log("joinBladeburnerDivision", "You have been accepted into the Bladeburner division");

            return true;
          } else {
            workerScript.log(
              "joinBladeburnerDivision",
              "You do not meet the requirements for joining the Bladeburner division",
            );
            return false;
          }
        }
      },
      getBonusTime: function (): any {
        updateDynamicRam("getBonusTime", getRamCost("bladeburner", "getBonusTime"));
        checkBladeburnerAccess("getBonusTime");
        const bladeburner = Player.bladeburner;
        if (bladeburner === null) throw new Error("Should not be called without Bladeburner");
        return Math.round(bladeburner.storedCycles / 5);
      },
    }, // End Bladeburner

    // Hi, if you're reading this you're a bit nosy.
    // There's a corporation API but it's very imbalanced right now.
    // It's here so players can test with if they want.
    corporation: {
      expandIndustry: function (industryName: any, divisionName: any): any {
        const corporation = Player.corporation;
        if (corporation === null) throw new Error("Should not be called without a corporation");
        NewIndustry(corporation, industryName, divisionName);
      },
      expandCity: function (divisionName: any, cityName: any): any {
        const division = getDivision(divisionName);
        const corporation = Player.corporation;
        if (corporation === null) throw new Error("Should not be called without a corporation");
        NewCity(corporation, division, cityName);
      },
      unlockUpgrade: function (upgradeName: any): any {
        const upgrade = Object.values(CorporationUnlockUpgrades).find((upgrade) => upgrade[2] === upgradeName);
        if (upgrade === undefined) throw new Error(`No upgrade named '${upgradeName}'`);
        const corporation = Player.corporation;
        if (corporation === null) throw new Error("Should not be called without a corporation");
        UnlockUpgrade(corporation, upgrade);
      },
      levelUpgrade: function (upgradeName: any): any {
        const upgrade = Object.values(CorporationUpgrades).find((upgrade) => upgrade[4] === upgradeName);
        if (upgrade === undefined) throw new Error(`No upgrade named '${upgradeName}'`);
        const corporation = Player.corporation;
        if (corporation === null) throw new Error("Should not be called without a corporation");
        LevelUpgrade(corporation, upgrade);
      },
      issueDividends: function (percent: any): any {
        const corporation = Player.corporation;
        if (corporation === null) throw new Error("Should not be called without a corporation");
        IssueDividends(corporation, percent);
      },
      sellMaterial: function (divisionName: any, cityName: any, materialName: any, amt: any, price: any): any {
        const material = getMaterial(divisionName, cityName, materialName);
        SellMaterial(material, amt, price);
      },
      sellProduct: function (divisionName: any, cityName: any, productName: any, amt: any, price: any, all: any): any {
        const product = getProduct(divisionName, productName);
        SellProduct(product, cityName, amt, price, all);
      },
      discontinueProduct: function (divisionName: any, productName: any): any {
        getDivision(divisionName).discontinueProduct(getProduct(divisionName, productName));
      },
      setSmartSupply: function (divisionName: any, cityName: any, enabled: any): any {
        const warehouse = getWarehouse(divisionName, cityName);
        SetSmartSupply(warehouse, enabled);
      },
      // setSmartSupplyUseLeftovers: function (): any {},
      buyMaterial: function (divisionName: any, cityName: any, materialName: any, amt: any): any {
        const material = getMaterial(divisionName, cityName, materialName);
        BuyMaterial(material, amt);
      },
      employees: function (divisionName: any, cityName: any): any {
        const office = getOffice(divisionName, cityName);
        return office.employees.map((e) => Object.assign({}, e));
      },
      assignJob: function (divisionName: any, cityName: any, employeeName: any, job: any): any {
        const employee = getEmployee(divisionName, cityName, employeeName);
        AssignJob(employee, job);
      },
      hireEmployee: function (divisionName: any, cityName: any): any {
        const office = getOffice(divisionName, cityName);
        office.hireRandomEmployee();
      },
      upgradeOfficeSize: function (divisionName: any, cityName: any, size: any): any {
        const office = getOffice(divisionName, cityName);
        const corporation = Player.corporation;
        if (corporation === null) throw new Error("Should not be called without a corporation");
        UpgradeOfficeSize(corporation, office, size);
      },
      throwParty: function (divisionName: any, cityName: any, costPerEmployee: any): any {
        const office = getOffice(divisionName, cityName);
        const corporation = Player.corporation;
        if (corporation === null) throw new Error("Should not be called without a corporation");
        ThrowParty(corporation, office, costPerEmployee);
      },
      purchaseWarehouse: function (divisionName: any, cityName: any): any {
        const corporation = Player.corporation;
        if (corporation === null) throw new Error("Should not be called without a corporation");
        PurchaseWarehouse(corporation, getDivision(divisionName), cityName);
      },
      upgradeWarehouse: function (divisionName: any, cityName: any): any {
        const corporation = Player.corporation;
        if (corporation === null) throw new Error("Should not be called without a corporation");
        UpgradeWarehouse(corporation, getDivision(divisionName), getWarehouse(divisionName, cityName));
      },
      buyCoffee: function (divisionName: any, cityName: any): any {
        const corporation = Player.corporation;
        if (corporation === null) throw new Error("Should not be called without a corporation");
        BuyCoffee(corporation, getDivision(divisionName), getOffice(divisionName, cityName));
      },
      hireAdVert: function (divisionName: any): any {
        const corporation = Player.corporation;
        if (corporation === null) throw new Error("Should not be called without a corporation");
        HireAdVert(corporation, getDivision(divisionName), getOffice(divisionName, "Sector-12"));
      },
      makeProduct: function (
        divisionName: any,
        cityName: any,
        productName: any,
        designInvest: any,
        marketingInvest: any,
      ): any {
        const corporation = Player.corporation;
        if (corporation === null) throw new Error("Should not be called without a corporation");
        MakeProduct(corporation, getDivision(divisionName), cityName, productName, designInvest, marketingInvest);
      },
      research: function (divisionName: any, researchName: any): any {
        Research(getDivision(divisionName), researchName);
      },
      exportMaterial: function (
        sourceDivision: any,
        sourceCity: any,
        targetDivision: any,
        targetCity: any,
        materialName: any,
        amt: any,
      ): any {
        ExportMaterial(targetDivision, targetCity, getMaterial(sourceDivision, sourceCity, materialName), amt + "");
      },
      cancelExportMaterial: function (
        sourceDivision: any,
        sourceCity: any,
        targetDivision: any,
        targetCity: any,
        materialName: any,
        amt: any,
      ): any {
        CancelExportMaterial(
          targetDivision,
          targetCity,
          getMaterial(sourceDivision, sourceCity, materialName),
          amt + "",
        );
      },
      setMaterialMarketTA1: function (divisionName: any, cityName: any, materialName: any, on: any): any {
        SetMaterialMarketTA1(getMaterial(divisionName, cityName, materialName), on);
      },
      setMaterialMarketTA2: function (divisionName: any, cityName: any, materialName: any, on: any) {
        SetMaterialMarketTA2(getMaterial(divisionName, cityName, materialName), on);
      },
      setProductMarketTA1: function (divisionName: any, productName: any, on: any): any {
        SetProductMarketTA1(getProduct(divisionName, productName), on);
      },
      setProductMarketTA2: function (divisionName: any, productName: any, on: any) {
        SetProductMarketTA2(getProduct(divisionName, productName), on);
      },
      // If you modify these objects you will affect them for real, it's not
      // copies.
      getDivision: function (divisionName: any): any {
        return getDivision(divisionName);
      },
      getOffice: function (divisionName: any, cityName: any): any {
        return getOffice(divisionName, cityName);
      },
      getWarehouse: function (divisionName: any, cityName: any): any {
        return getWarehouse(divisionName, cityName);
      },
      getMaterial: function (divisionName: any, cityName: any, materialName: any): any {
        return getMaterial(divisionName, cityName, materialName);
      },
      getProduct: function (divisionName: any, productName: any): any {
        return getProduct(divisionName, productName);
      },
      getEmployee: function (divisionName: any, cityName: any, employeeName: any): any {
        return getEmployee(divisionName, cityName, employeeName);
      },
    }, // End Corporation API

    // Coding Contract API
    codingcontract: {
      attempt: function (answer: any, fn: any, ip: any = workerScript.hostname, { returnReward }: any = {}): any {
        updateDynamicRam("attempt", getRamCost("codingcontract", "attempt"));
        const contract = getCodingContract("attempt", ip, fn);

        // Convert answer to string. If the answer is a 2D array, then we have to
        // manually add brackets for the inner arrays
        if (is2DArray(answer)) {
          const answerComponents = [];
          for (let i = 0; i < answer.length; ++i) {
            answerComponents.push(["[", answer[i].toString(), "]"].join(""));
          }

          answer = answerComponents.join(",");
        } else {
          answer = String(answer);
        }

        const creward = contract.reward;
        if (creward === null) throw new Error("Somehow solved a contract that didn't have a reward");

        const serv = safeGetServer(ip, "codingcontract.attempt");
        if (contract.isSolution(answer)) {
          const reward = Player.gainCodingContractReward(creward, contract.getDifficulty());
          workerScript.log("attempt", `Successfully completed Coding Contract '${fn}'. Reward: ${reward}`);
          serv.removeContract(fn);
          return returnReward ? reward : true;
        } else {
          ++contract.tries;
          if (contract.tries >= contract.getMaxNumTries()) {
            workerScript.log("attempt", `Coding Contract attempt '${fn}' failed. Contract is now self-destructing`);
            serv.removeContract(fn);
          } else {
            workerScript.log(
              "attempt",
              `Coding Contract attempt '${fn}' failed. ${
                contract.getMaxNumTries() - contract.tries
              } attempts remaining.`,
            );
          }

          return returnReward ? "" : false;
        }
      },
      getContractType: function (fn: any, ip: any = workerScript.hostname): any {
        updateDynamicRam("getContractType", getRamCost("codingcontract", "getContractType"));
        const contract = getCodingContract("getContractType", ip, fn);
        return contract.getType();
      },
      getData: function (fn: any, ip: any = workerScript.hostname): any {
        updateDynamicRam("getData", getRamCost("codingcontract", "getData"));
        const contract = getCodingContract("getData", ip, fn);
        const data = contract.getData();
        if (data.constructor === Array) {
          // For two dimensional arrays, we have to copy the internal arrays using
          // slice() as well. As of right now, no contract has arrays that have
          // more than two dimensions
          const copy = data.slice();
          for (let i = 0; i < copy.length; ++i) {
            if (data[i].constructor === Array) {
              copy[i] = data[i].slice();
            }
          }

          return copy;
        } else {
          return data;
        }
      },
      getDescription: function (fn: any, ip: any = workerScript.hostname): any {
        updateDynamicRam("getDescription", getRamCost("codingcontract", "getDescription"));
        const contract = getCodingContract("getDescription", ip, fn);
        return contract.getDescription();
      },
      getNumTriesRemaining: function (fn: any, ip: any = workerScript.hostname): any {
        updateDynamicRam("getNumTriesRemaining", getRamCost("codingcontract", "getNumTriesRemaining"));
        const contract = getCodingContract("getNumTriesRemaining", ip, fn);
        return contract.getMaxNumTries() - contract.tries;
      },
    }, // End coding contracts

    sleeve: sleeve,
    formulas: {
      basic: {
        calculateSkill: function (exp: any, mult: any = 1): any {
          checkFormulasAccess("basic.calculateSkill", 5);
          return calculateSkill(exp, mult);
        },
        calculateExp: function (skill: any, mult: any = 1): any {
          checkFormulasAccess("basic.calculateExp", 5);
          return calculateExp(skill, mult);
        },
        hackChance: function (server: any, player: any): any {
          checkFormulasAccess("basic.hackChance", 5);
          return calculateHackingChance(server, player);
        },
        hackExp: function (server: any, player: any): any {
          checkFormulasAccess("basic.hackExp", 5);
          return calculateHackingExpGain(server, player);
        },
        hackPercent: function (server: any, player: any): any {
          checkFormulasAccess("basic.hackPercent", 5);
          return calculatePercentMoneyHacked(server, player);
        },
        growPercent: function (server: any, threads: any, player: any, cores: any = 1): any {
          checkFormulasAccess("basic.growPercent", 5);
          return calculateServerGrowth(server, threads, player, cores);
        },
        hackTime: function (server: any, player: any): any {
          checkFormulasAccess("basic.hackTime", 5);
          return calculateHackingTime(server, player);
        },
        growTime: function (server: any, player: any): any {
          checkFormulasAccess("basic.growTime", 5);
          return calculateGrowTime(server, player);
        },
        weakenTime: function (server: any, player: any): any {
          checkFormulasAccess("basic.weakenTime", 5);
          return calculateWeakenTime(server, player);
        },
      },
      hacknetNodes: {
        moneyGainRate: function (level: any, ram: any, cores: any, mult: any = 1): any {
          checkFormulasAccess("hacknetNodes.moneyGainRate", 5);
          return calculateMoneyGainRate(level, ram, cores, mult);
        },
        levelUpgradeCost: function (startingLevel: any, extraLevels: any = 1, costMult: any = 1): any {
          checkFormulasAccess("hacknetNodes.levelUpgradeCost", 5);
          return calculateLevelUpgradeCost(startingLevel, extraLevels, costMult);
        },
        ramUpgradeCost: function (startingRam: any, extraLevels: any = 1, costMult: any = 1): any {
          checkFormulasAccess("hacknetNodes.ramUpgradeCost", 5);
          return calculateRamUpgradeCost(startingRam, extraLevels, costMult);
        },
        coreUpgradeCost: function (startingCore: any, extraCores: any = 1, costMult: any = 1): any {
          checkFormulasAccess("hacknetNodes.coreUpgradeCost", 5);
          return calculateCoreUpgradeCost(startingCore, extraCores, costMult);
        },
        hacknetNodeCost: function (n: any, mult: any): any {
          checkFormulasAccess("hacknetNodes.hacknetNodeCost", 5);
          return calculateNodeCost(n, mult);
        },
        constants: function (): any {
          checkFormulasAccess("hacknetNodes.constants", 5);
          return Object.assign({}, HacknetNodeConstants);
        },
      },
      hacknetServers: {
        hashGainRate: function (level: any, ramUsed: any, maxRam: any, cores: any, mult: any = 1): any {
          checkFormulasAccess("hacknetServers.hashGainRate", 9);
          return HScalculateHashGainRate(level, ramUsed, maxRam, cores, mult);
        },
        levelUpgradeCost: function (startingLevel: any, extraLevels: any = 1, costMult: any = 1): any {
          checkFormulasAccess("hacknetServers.levelUpgradeCost", 9);
          return HScalculateLevelUpgradeCost(startingLevel, extraLevels, costMult);
        },
        ramUpgradeCost: function (startingRam: any, extraLevels: any = 1, costMult: any = 1): any {
          checkFormulasAccess("hacknetServers.ramUpgradeCost", 9);
          return HScalculateRamUpgradeCost(startingRam, extraLevels, costMult);
        },
        coreUpgradeCost: function (startingCore: any, extraCores: any = 1, costMult: any = 1): any {
          checkFormulasAccess("hacknetServers.coreUpgradeCost", 9);
          return HScalculateCoreUpgradeCost(startingCore, extraCores, costMult);
        },
        cacheUpgradeCost: function (startingCache: any, extraCache: any = 1): any {
          checkFormulasAccess("hacknetServers.cacheUpgradeCost", 9);
          return HScalculateCacheUpgradeCost(startingCache, extraCache);
        },
        hashUpgradeCost: function (upgName: any, level: any): any {
          checkFormulasAccess("hacknetServers.hashUpgradeCost", 9);
          const upg = Player.hashManager.getUpgrade(upgName);
          if (!upg) {
            throw makeRuntimeErrorMsg(
              "formulas.hacknetServers.calculateHashUpgradeCost",
              `Invalid Hash Upgrade: ${upgName}`,
            );
          }
          return upg.getCost(level);
        },
        hacknetServerCost: function (n: any, mult: any): any {
          checkFormulasAccess("hacknetServers.hacknetServerCost", 9);
          return HScalculateServerCost(n, mult);
        },
        constants: function (): any {
          checkFormulasAccess("hacknetServers.constants", 9);
          return Object.assign({}, HacknetServerConstants);
        },
      },
    }, // end formulas
    flags: function (data: any): any {
      data = toNative(data);
      // We always want the help flag.
      const args: {
        [key: string]: any;
      } = {};

      for (const d of data) {
        let t: any = String;
        if (typeof d[1] === "number") {
          t = Number;
        } else if (typeof d[1] === "boolean") {
          t = Boolean;
        } else if (Array.isArray(d[1])) {
          t = [String];
        }
        const numDashes = d[0].length > 1 ? 2 : 1;
        args["-".repeat(numDashes) + d[0]] = t;
      }
      const ret = libarg(args, { argv: workerScript.args });
      for (const d of data) {
        if (!ret.hasOwnProperty("--" + d[0]) || !ret.hasOwnProperty("-" + d[0])) ret[d[0]] = d[1];
      }
      for (const key of Object.keys(ret)) {
        if (!key.startsWith("-")) continue;
        const value = ret[key];
        delete ret[key];
        const numDashes = key.length === 2 ? 1 : 2;
        ret[key.slice(numDashes)] = value;
      }
      return ret;
    },
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

  const possibleLogs = Object.fromEntries([...getFunctionNames(functions, "")].map((a) => [a, true]));

  return functions;
} // End NetscriptFunction()

export { NetscriptFunctions };
