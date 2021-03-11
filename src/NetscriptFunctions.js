const sprintf = require("sprintf-js").sprintf;
const vsprintf = require("sprintf-js").vsprintf;

import { getRamCost } from "./Netscript/RamCostGenerator";
import { WorkerScriptStartStopEventEmitter } from "./Netscript/WorkerScriptStartStopEventEmitter";

import { Augmentation } from "./Augmentation/Augmentation";
import { Augmentations } from "./Augmentation/Augmentations";
import {
    augmentationExists,
    installAugmentations
} from "./Augmentation/AugmentationHelpers";
import { prestigeAugmentation } from "./Prestige";
import { AugmentationNames } from "./Augmentation/data/AugmentationNames";
import { BitNodeMultipliers } from "./BitNode/BitNodeMultipliers";
import { findCrime } from "./Crime/CrimeHelpers";
import { Bladeburner } from "./Bladeburner";
import { Company } from "./Company/Company";
import { Companies, companyExists } from "./Company/Companies";
import { CompanyPosition } from "./Company/CompanyPosition";
import { CompanyPositions } from "./Company/CompanyPositions";
import { CONSTANTS } from "./Constants";
import { DarkWebItems } from "./DarkWeb/DarkWebItems";
import {
    calculateHackingChance,
    calculateHackingExpGain,
    calculatePercentMoneyHacked,
    calculateHackingTime,
    calculateGrowTime,
    calculateWeakenTime
} from "./Hacking";
import {
    AllGangs,
    GangMemberUpgrades,
    GangMemberTasks
} from "./Gang";
import { Faction } from "./Faction/Faction";
import { Factions, factionExists } from "./Faction/Factions";
import { joinFaction, purchaseAugmentation } from "./Faction/FactionHelpers";
import { FactionWorkType } from "./Faction/FactionWorkTypeEnum";
import {
    netscriptCanGrow,
    netscriptCanHack,
    netscriptCanWeaken
} from "./Hacking/netscriptCanHack";

import {
    getCostOfNextHacknetNode,
    getCostOfNextHacknetServer,
    hasHacknetServers,
    purchaseHacknet,
    purchaseLevelUpgrade,
    purchaseRamUpgrade,
    purchaseCoreUpgrade,
    purchaseCacheUpgrade,
    purchaseHashUpgrade,
    updateHashManagerCapacity,
} from "./Hacknet/HacknetHelpers";
import { HacknetServer, MaxNumberHacknetServers } from "./Hacknet/HacknetServer";
import { CityName } from "./Locations/data/CityNames";
import { LocationName } from "./Locations/data/LocationNames";

import { Message } from "./Message/Message";
import { Messages } from "./Message/MessageHelpers";
import { inMission } from "./Missions";
import { Player } from "./Player";
import { Programs } from "./Programs/Programs";
import { Script } from "./Script/Script";
import { findRunningScript } from "./Script/ScriptHelpers";
import { isScriptFilename } from "./Script/ScriptHelpersTS";
import { _getScriptUrls } from "./NetscriptJSEvaluator";
import {
    AllServers,
    AddToAllServers,
    createUniqueRandomIp,
} from "./Server/AllServers";
import { Server } from "./Server/Server";
import {
    GetServerByHostname,
    getServer,
    getServerOnNetwork,
    numCycleForGrowth,
    processSingleServerGrowth,
    safetlyCreateUniqueServer,
} from "./Server/ServerHelpers";
import {
    getPurchaseServerCost,
    getPurchaseServerLimit,
    getPurchaseServerMaxRam
} from "./Server/ServerPurchases";
import { Settings } from "./Settings/Settings";
import { SpecialServerIps } from "./Server/SpecialServerIps";
import { SourceFileFlags } from "./SourceFile/SourceFileFlags";
import {
    buyStock,
    sellStock,
    shortStock,
    sellShort,
} from "./StockMarket/BuyingAndSelling";
import {
    influenceStockThroughServerHack,
    influenceStockThroughServerGrow,
} from "./StockMarket/PlayerInfluencing";
import { Stock } from "./StockMarket/Stock";
import {
    StockMarket,
    SymbolToStockMap,
    placeOrder,
    cancelOrder,
    displayStockMarketContent,
} from "./StockMarket/StockMarket";
import {
    getBuyTransactionCost,
    getSellTransactionGain,
} from "./StockMarket/StockMarketHelpers";
import { OrderTypes } from "./StockMarket/data/OrderTypes";
import { PositionTypes } from "./StockMarket/data/PositionTypes";
import { StockSymbols } from "./StockMarket/data/StockSymbols";
import {
    getStockMarket4SDataCost,
    getStockMarket4STixApiCost
} from "./StockMarket/StockMarketCosts";
import { isValidFilePath } from "./Terminal/DirectoryHelpers";
import { TextFile, getTextFile, createTextFile } from "./TextFile";

import {
    unknownBladeburnerActionErrorMessage
} from"./NetscriptBladeburner";
import * as nsGang from "./NetscriptGang";
import { Gang } from "./Gang";
import {
    NetscriptPorts,
    runScriptFromScript,
} from "./NetscriptWorker";
import { killWorkerScript } from "./Netscript/killWorkerScript";
import { workerScripts } from "./Netscript/WorkerScripts";
import {
    makeRuntimeRejectMsg,
    netscriptDelay,
    resolveNetscriptRequestedThreads,
} from "./NetscriptEvaluator";
import { NetscriptPort } from "./NetscriptPort";
import { SleeveTaskType } from "./PersonObjects/Sleeve/SleeveTaskTypesEnum";
import { findSleevePurchasableAugs } from "./PersonObjects/Sleeve/SleeveHelpers";
import { Exploit } from './Exploits/Exploit.ts';

import { Page, routing } from "./ui/navigationTracking";
import { numeralWrapper } from "./ui/numeralFormat";
import { post } from "./ui/postToTerminal";
import { setTimeoutRef } from "./utils/SetTimeoutRef";
import { is2DArray } from "./utils/helpers/is2DArray";

import { dialogBoxCreate } from "../utils/DialogBox";
import { formatNumber, isHTML } from "../utils/StringHelperFunctions";
import { logBoxCreate } from "../utils/LogBox";
import { arrayToString } from "../utils/helpers/arrayToString";
import { isPowerOfTwo } from "../utils/helpers/isPowerOfTwo";
import { isString } from "../utils/helpers/isString";

import { createElement } from "../utils/uiHelpers/createElement";
import { createPopup } from "../utils/uiHelpers/createPopup";
import { removeElementById } from "../utils/uiHelpers/removeElementById";

const possibleLogs = {
    ALL: true,
    scan: true,
    hack: true,
    sleep: true,
    disableLog: true,
    enableLog: true,
    grow: true,
    weaken: true,
    nuke: true,
    brutessh: true,
    ftpcrack: true,
    relaysmtp: true,
    httpworm: true,
    sqlinject: true,
    run:true,
    exec:true,
    spawn: true,
    kill: true,
    killall: true,
    scp: true,
    getHackingLevel: true,
    getServerMoneyAvailable: true,
    getServerSecurityLevel: true,
    getServerBaseSecurityLevel: true,
    getServerMinSecurityLevel: true,
    getServerRequiredHackingLevel: true,
    getServerMaxMoney: true,
    getServerGrowth: true,
    getServerNumPortsRequired: true,
    getServerRam: true,

    // TIX API
    buyStock: true,
    sellStock: true,
    shortStock: true,
    sellShort: true,
    purchase4SMarketData: true,
    purchase4SMarketDataTixApi: true,

    // Singularity Functions
    purchaseServer: true,
    deleteServer: true,
    universityCourse: true,
    gymWorkout: true,
    travelToCity: true,
    purchaseTor: true,
    purchaseProgram: true,
    stopAction: true,
    upgradeHomeRam: true,
    workForCompany: true,
    applyToCompany: true,
    joinFaction: true,
    workForFaction: true,
    donateToFaction: true,
    createProgram: true,
    commitCrime: true,

    // Bladeburner API
    startAction: true,
    upgradeSkill: true,
    setTeamSize: true,
    joinBladeburnerFaction: true,

    // Gang API
    recruitMember: true,
    setMemberTask: true,
    purchaseEquipment: true,
    setTerritoryWarfare: true,
}

function NetscriptFunctions(workerScript) {
    const updateDynamicRam = function(fnName, ramCost) {
        if (workerScript.dynamicLoadedFns[fnName]) { return; }
        workerScript.dynamicLoadedFns[fnName] = true;

        let threads = workerScript.scriptRef.threads;
        if (typeof threads !== 'number') {
            console.warn(`WorkerScript detected NaN for threadcount for ${workerScript.name} on ${workerScript.serverIp}`);
            threads = 1;
        }

        workerScript.dynamicRamUsage += (ramCost * threads);
        if (workerScript.dynamicRamUsage > 1.01 * workerScript.ramUsage) {
            throw makeRuntimeRejectMsg(workerScript,
                                       "Dynamic RAM usage calculated to be greater than initial RAM usage on fn: " + fnName +
                                       ". This is probably because you somehow circumvented the static RAM "  +
                                       "calculation.<br><br>Please don't do that :(<br><br>" +
                                       "Dynamic RAM Usage: " + workerScript.dynamicRamUsage + "<br>" +
                                       "Static RAM Usage: " + workerScript.ramUsage);
        }
    };

    /**
     * Gets the Server for a specific hostname/ip, throwing an error
     * if the server doesn't exist.
     * @param {string} ip - Hostname or IP of the server
     * @param {string} callingFnName - Name of calling function. For logging purposes
     * @returns {Server} The specified Server
     */
    const safeGetServer = function(ip, callingFnName="") {
        var server = getServer(ip);
        if (server == null) {
            throw makeRuntimeErrorMsg(callingFnName, `Invalid IP/hostname: ${ip}`);
        }
        return server;
    }

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
    const getRunningScript = function(fn, ip, callingFnName, scriptArgs) {
        // Sanitize arguments
        if (typeof callingFnName !== "string" || callingFnName === "") {
            callingFnName = "getRunningScript";
        }

        if (!Array.isArray(scriptArgs)) {
            throw makeRuntimeRejectMsg(
                workerScript,
                `Invalid scriptArgs argument passed into getRunningScript() from ${callingFnName}(). ` +
                `This is probably a bug. Please report to game developer`
            );
        }

        if (fn != null && typeof fn === "string") {
            // Get Logs of another script
            if (ip == null) { ip = workerScript.serverIp; }
            const server = safeGetServer(ip, callingFnName);

            return findRunningScript(fn, scriptArgs, server);
        }

        // If no arguments are specified, return the current RunningScript
        return workerScript.scriptRef;
    }

    /**
     * Helper function for getting the error log message when the user specifies
     * a nonexistent running script
     * @param {string} fn - Filename of script
     * @param {string} ip - Hostname/ip of the server on which the script resides
     * @param {any[]} scriptArgs - Running script's arguments
     * @returns {string} Error message to print to logs
     */
    const getCannotFindRunningScriptErrorMessage = function(fn, ip, scriptArgs) {
        if (!Array.isArray(scriptArgs)) {
            scriptArgs = [];
        }

        return `Cannot find running script ${fn} on server ${ip} with args: ${arrayToString(scriptArgs)}`;
    }

    /**
     * Checks if the player has TIX API access. Throws an error if the player does not
     */
    const checkTixApiAccess = function(callingFn="") {
        if (!Player.hasWseAccount) {
            throw makeRuntimeRejectMsg(workerScript, `You don't have WSE Access! Cannot use ${callingFn}()`);
        }
        if (!Player.hasTixApiAccess) {
            throw makeRuntimeRejectMsg(workerScript, `You don't have TIX API Access! Cannot use ${callingFn}()`);
        }
    }

    /**
     * Gets a stock, given its symbol. Throws an error if the symbol is invalid
     * @param {string} symbol - Stock's symbol
     * @returns {Stock} stock object
     */
    const getStockFromSymbol = function(symbol, callingFn="") {
        const stock = SymbolToStockMap[symbol];
        if (stock == null) {
            throw makeRuntimeRejectMsg(workerScript, `Invalid stock symbol passed into ${callingFn}()`);
        }

        return stock;
    }

    /**
     * Used to fail a function if the function's target is a Hacknet Server.
     * This is used for functions that should run on normal Servers, but not Hacknet Servers
     * @param {Server} server - Target server
     * @param {string} callingFn - Name of calling function. For logging purposes
     * @returns {boolean} True if the server is a Hacknet Server, false otherwise
     */
    const failOnHacknetServer = function(server, callingFn="") {
        if (server instanceof HacknetServer) {
            workerScript.log(callingFn, `Does not work on Hacknet Servers`);
            return true;
        } else {
            return false;
        }
    }

    // Utility function to get Hacknet Node object
    const getHacknetNode = function(i) {
        if (isNaN(i)) {
            throw makeRuntimeRejectMsg(workerScript, "Invalid index specified for Hacknet Node: " + i);
        }
        if (i < 0 || i >= Player.hacknetNodes.length) {
            throw makeRuntimeRejectMsg(workerScript, "Index specified for Hacknet Node is out-of-bounds: " + i);
        }

        if (hasHacknetServers()) {
            const hserver = AllServers[Player.hacknetNodes[i]];
            if (hserver == null) {
                throw makeRuntimeRejectMsg(workerScript, `Could not get Hacknet Server for index ${i}. This is probably a bug, please report to game dev`);
            }

            return hserver;
        } else {
            return Player.hacknetNodes[i];
        }
    };

    const makeRuntimeErrorMsg = function(caller, msg) {
        const stack = (new Error()).stack.split('\n').slice(1);
        const scripts = workerScript.getServer().scripts;
        let userstack = [];
        for(const stackline of stack) {
            let filename;
            for(const script of scripts) {
                if (script.url && stackline.includes(script.url)) {
                    filename = script.filename;
                }
                for (const dependency of script.dependencies) {
                    if (stackline.includes(dependency.url)) {
                        filename = dependency.filename;
                    }
                }
            }
            if(!filename) continue

            const lineRe = /.*:(\d+):\d+.*/;
            const lineMatch = stackline.match(lineRe);


            const funcRe = /.*at (.+) \(.*/;
            const funcMatch = stackline.match(funcRe);
            let func = funcMatch[1];
            if(func.includes('.')) func = func.split('.')[1];

            userstack.push(`${filename}:L${lineMatch[1]}@${func}`);
        }

        workerScript.log(caller, msg);
        const rejectMsg = `${caller}: ${msg}<br><br>Stack:<br>${userstack.join('<br>')}`
        return makeRuntimeRejectMsg(workerScript, rejectMsg);
    }

    const checkSingularityAccess = function(func, n) {
        if (Player.bitNodeN !== 4) {
            if (SourceFileFlags[4] < n) {
                throw makeRuntimeErrorMsg(func, `This singularity function requires Source-File 4-${n} to run.`);
            }
        }
    }

    const checkBladeburnerAccess = function(func) {
        const accessDenied = `You do not ` +
                             "currently have access to the Bladeburner API. To access the Bladeburner API " +
                             "you must be employed at the Bladeburner division, AND you must either be in " +
                             "BitNode-7 or have Source-File 7.";
        const hasAccess = Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || Player.sourceFiles.some(a=>{return a.n === 7}));
        if(!hasAccess) {
            throw makeRuntimeErrorMsg(`bladeburner.${func}`, accessDenied);
        }
    }

    const checkBladeburnerCity = function(func, city) {
        if (!Player.bladeburner.cities.hasOwnProperty(city)) {
            throw makeRuntimeErrorMsg(`bladeburner.${func}`, `Invalid city: ${city}`);
        }
    }

    const checkSleeveAPIAccess = function(func) {
        if (Player.bitNodeN !== 10 && !SourceFileFlags[10]) {
            throw makeRuntimeErrorMsg(`sleeve.${func}`, "You do not currently have access to the Sleeve API. This is either because you are not in BitNode-10 or because you do not have Source-File 10");
        }
    }

    const checkSleeveNumber = function(func, sleeveNumber) {
        if (sleeveNumber >= Player.sleeves.length || sleeveNumber < 0) {
            const msg = `Invalid sleeve number: ${sleeveNumber}`;
            workerScript.log(func, msg);
            throw makeRuntimeErrorMsg(`sleeve.${func}`, msg);
        }
    }

    const getCodingContract = function(func, ip, fn) {
        const server = safeGetServer(ip, func);
        const contract = server.getContract(fn);
        if (contract == null) {
            throw makeRuntimeErrorMsg(`codingcontract.${func}`, `Cannot find contract '${fn}' on server '${ip}'`)
        }

        return contract;
    }

    const checkGangApiAccess = function(func) {
        const hasAccess = Player.gang instanceof Gang;
        if (!hasAccess) {
            throw makeRuntimeErrorMsg(`gang.${func}`, `You do not currently have a Gang`);
        }
    }

    const getGangMember = function(func, name) {
        for (const member of Player.gang.members)
                    if (member.name === name) 
                        return member;
        throw makeRuntimeErrorMsg(`gang.${func}`, `Invalid gang member: '${name}'`)
    }

    const getGangTask = function(func, name) {
        const task = GangMemberTasks[taskName];
        if (!task) {
            throw makeRuntimeErrorMsg(`gang.${func}`, `Invalid task: '${taskName}'`);
        }

        return task;
    }

    const getBladeburnerActionObject = function(func, type, name) {
        const actionId = Player.bladeburner.getActionIdFromTypeAndName(type, name)
        if (!actionId) {
            throw makeRuntimeErrorMsg(`bladeburner.${func}`, `Invalid action type='${type}', name='${name}'`);
        }
        const actionObj = Player.bladeburner.getActionObject(actionId);
        if (!actionObj) {
            throw makeRuntimeErrorMsg(`bladeburner.${func}`, `Invalid action type='${type}', name='${name}'`);
        }

        return actionObj;
    }

    const getCompany = function(func, name) {
        const company = Companies[name];
        if (company == null || !(company instanceof Company)) {
            throw makeRuntimeErrorMsg(func, `Invalid company name: '${name}'`)
        }
        return company;
    }

    const getFaction = function(func, name) {
        if (!factionExists(name)) {
            throw makeRuntimeErrorMsg(func, `Invalid faction name: '${name}`)
        }

        return Factions[name];
    }

    const getAugmentation = function(func, name) {
        if (!augmentationExists(name)) {
            throw makeRuntimeErrorMsg(func, `Invalid augmentation: '${name}'`);
        }

        return Augmentations[name];
    }

    return {
        hacknet : {
            numNodes : function() {
                return Player.hacknetNodes.length;
            },
            maxNumNodes : function() {
                return MaxNumberHacknetServers;
            },
            purchaseNode : function() {
                return purchaseHacknet();
            },
            getPurchaseNodeCost : function() {
                if (hasHacknetServers()) {
                    return getCostOfNextHacknetServer();
                } else {
                    return getCostOfNextHacknetNode();
                }
            },
            getNodeStats : function(i) {
                const node = getHacknetNode(i);
                const hasUpgraded = hasHacknetServers();
                const res = {
                    name:               hasUpgraded ? node.hostname : node.name,
                    level:              node.level,
                    ram:                hasUpgraded ? node.maxRam : node.ram,
                    cores:              node.cores,
                    production:         hasUpgraded ? node.hashRate : node.moneyGainRatePerSecond,
                    timeOnline:         node.onlineTimeSeconds,
                    totalProduction:    hasUpgraded ? node.totalHashesGenerated : node.totalMoneyGenerated,
                };

                if (hasUpgraded) {
                    res.cache = node.cache;
                    res.hashCapacity = node.hashCapacity;
                }

                return res;
            },
            upgradeLevel : function(i, n) {
                const node = getHacknetNode(i);
                return purchaseLevelUpgrade(node, n);
            },
            upgradeRam : function(i, n) {
                const node = getHacknetNode(i);
                return purchaseRamUpgrade(node, n);
            },
            upgradeCore : function(i, n) {
                const node = getHacknetNode(i);
                return purchaseCoreUpgrade(node, n);
            },
            upgradeCache : function(i, n) {
                if (!hasHacknetServers()) { return false; }
                const node = getHacknetNode(i);
                const res = purchaseCacheUpgrade(node, n);
                if (res) {
                    updateHashManagerCapacity();
                }
                return res;
            },
            getLevelUpgradeCost : function(i, n) {
                const node = getHacknetNode(i);
                return node.calculateLevelUpgradeCost(n, Player.hacknet_node_level_cost_mult);
            },
            getRamUpgradeCost : function(i, n) {
                const node = getHacknetNode(i);
                return node.calculateRamUpgradeCost(n, Player.hacknet_node_ram_cost_mult);
            },
            getCoreUpgradeCost : function(i, n) {
                const node = getHacknetNode(i);
                return node.calculateCoreUpgradeCost(n, Player.hacknet_node_core_cost_mult);
            },
            getCacheUpgradeCost : function(i, n) {
                if (!hasHacknetServers()) { return Infinity; }
                const node = getHacknetNode(i);
                return node.calculateCacheUpgradeCost(n);
            },
            numHashes : function() {
                if (!hasHacknetServers()) { return 0; }
                return Player.hashManager.hashes;
            },
            hashCost : function(upgName) {
                if (!hasHacknetServers()) { return Infinity; }

                return Player.hashManager.getUpgradeCost(upgName);
            },
            spendHashes : function(upgName, upgTarget) {
                if (!hasHacknetServers()) { return false; }
                return purchaseHashUpgrade(upgName, upgTarget);
            }
        },
        sprintf : sprintf,
        vsprintf: vsprintf,
        scan : function(ip=workerScript.serverIp, hostnames=true) {
            updateDynamicRam("scan", getRamCost("scan"));
            var server = getServer(ip);
            if (server == null) {
                throw makeRuntimeErrorMsg('scan', `Invalid IP/hostname: ${ip}.`);
            }
            var out = [];
            for (var i = 0; i < server.serversOnNetwork.length; i++) {
                var entry;
                if (hostnames) {
                    entry = getServerOnNetwork(server, i).hostname;
                } else {
                    entry = getServerOnNetwork(server, i).ip;
                }
                if (entry == null) {
                    continue;
                }
                out.push(entry);
            }
            workerScript.log("scan", `returned ${server.serversOnNetwork.length} connections for ${server.hostname}`);
            return out;
        },
        hack : function(ip, { threads: requestedThreads, stock } = {}){
            updateDynamicRam("hack", getRamCost("hack"));
            if (ip === undefined) {
                throw makeRuntimeErrorMsg("hack", "Takes 1 argument.");
            }
            const threads = resolveNetscriptRequestedThreads(workerScript, "hack", requestedThreads);
            const server = getServer(ip);
            if (server == null) {
                throw makeRuntimeErrorMsg("hack", `Invalid IP/hostname: ${ip}.`);
            }

            // Calculate the hacking time
            var hackingTime = calculateHackingTime(server); // This is in seconds

            // No root access or skill level too low
            const canHack = netscriptCanHack(server, Player);
            if (!canHack.res) {
                throw makeRuntimeErrorMsg('hack', canHack.msg);
            }

            workerScript.log("hack", `Executing ${ip} in ${hackingTime.toFixed(3)} seconds (t=${threads})`);

            return netscriptDelay(hackingTime * 1000, workerScript).then(function() {
                if (workerScript.env.stopFlag) {return Promise.reject(workerScript);}
                var hackChance = calculateHackingChance(server);
                var rand = Math.random();
                var expGainedOnSuccess = calculateHackingExpGain(server) * threads;
                var expGainedOnFailure = (expGainedOnSuccess / 4);
                if (rand < hackChance) { // Success!
                    const percentHacked = calculatePercentMoneyHacked(server);
                    let maxThreadNeeded = Math.ceil(1/percentHacked*(server.moneyAvailable/server.moneyMax));
                    if (isNaN(maxThreadNeeded)) {
                        // Server has a 'max money' of 0 (probably). We'll set this to an arbitrarily large value
                        maxThreadNeeded = 1e6;
                    }

                    let moneyGained = Math.floor(server.moneyAvailable * percentHacked) * threads;

                    // Over-the-top safety checks
                    if (moneyGained <= 0) {
                        moneyGained = 0;
                        expGainedOnSuccess = expGainedOnFailure;
                    }
                    if (moneyGained > server.moneyAvailable) {moneyGained = server.moneyAvailable;}
                    server.moneyAvailable -= moneyGained;
                    if (server.moneyAvailable < 0) {server.moneyAvailable = 0;}

                    Player.gainMoney(moneyGained);
                    workerScript.scriptRef.onlineMoneyMade += moneyGained;
                    Player.scriptProdSinceLastAug += moneyGained;
                    Player.recordMoneySource(moneyGained, "hacking");
                    workerScript.scriptRef.recordHack(server.ip, moneyGained, threads);
                    Player.gainHackingExp(expGainedOnSuccess);
                    workerScript.scriptRef.onlineExpGained += expGainedOnSuccess;
                    workerScript.log("hack", `Successfully hacked '${server.hostname}' for ${numeralWrapper.format(moneyGained, '$0.000a')} and ${numeralWrapper.format(expGainedOnSuccess, '0.000a')} exp (t=${threads})`);
                    server.fortify(CONSTANTS.ServerFortifyAmount * Math.min(threads, maxThreadNeeded));
                    if (stock) {
                        influenceStockThroughServerHack(server, moneyGained);
                    }
                    return Promise.resolve(moneyGained);
                } else {
                    // Player only gains 25% exp for failure?
                    Player.gainHackingExp(expGainedOnFailure);
                    workerScript.scriptRef.onlineExpGained += expGainedOnFailure;
                    workerScript.log("hack", `Failed to hack '${server.hostname}'. Gained ${numeralWrapper.format(expGainedOnFailure, '0.000a')} exp (t=${threads})`);
                    return Promise.resolve(0);
                }
            });
        },
        hackAnalyzeThreads : function(ip, hackAmount) {
            updateDynamicRam("hackAnalyzeThreads", getRamCost("hackAnalyzeThreads"));

            // Check argument validity
            const server = safeGetServer(ip, 'hackAnalyzeThreads');
            if (isNaN(hackAmount)) {
                throw makeRuntimeErrorMsg(workerScript, `Invalid growth argument passed into hackAnalyzeThreads: ${hackAmount}. Must be numeric.`);
            }

            if (hackAmount < 0 || hackAmount > server.moneyAvailable) {
                return -1;
            }

            const percentHacked = calculatePercentMoneyHacked(server);

            return hackAmount / Math.floor(server.moneyAvailable * percentHacked);
        },
        hackAnalyzePercent : function(ip) {
            updateDynamicRam("hackAnalyzePercent", getRamCost("hackAnalyzePercent"));

            const server = safeGetServer(ip, 'hackAnalyzePercent');

            return calculatePercentMoneyHacked(server) * 100;
        },
        hackChance : function(ip) {
            updateDynamicRam("hackChance", getRamCost("hackChance"));

            const server = safeGetServer(ip, 'hackChance');

            return calculateHackingChance(server);
        },
        sleep : function(time){
            if (time === undefined) {
                throw makeRuntimeErrorMsg("sleep", "Takes 1 argument.");
            }
            workerScript.log("sleep", `Sleeping for ${time} milliseconds`);
            return netscriptDelay(time, workerScript).then(function() {
                return Promise.resolve(true);
            });
        },
        grow : function(ip, { threads: requestedThreads, stock } = {}){
            updateDynamicRam("grow", getRamCost("grow"));
            const threads = resolveNetscriptRequestedThreads(workerScript, "grow", requestedThreads);
            if (ip === undefined) {
                throw makeRuntimeErrorMsg("grow", "Takes 1 argument.");
            }
            var server = getServer(ip);
            if (server == null) {
                throw makeRuntimeErrorMsg("grow", `Invalid IP/hostname: ${ip}.`);
            }

            // No root access or skill level too low
            const canHack = netscriptCanGrow(server);
            if (!canHack.res) {
                throw makeRuntimeErrorMsg("grow", canHack.msg);
            }

            var growTime = calculateGrowTime(server);
            workerScript.log("grow", `Executing on '${server.hostname}' in ${formatNumber(growTime, 3)} seconds (t=${threads}).`);
            return netscriptDelay(growTime * 1000, workerScript).then(function() {
                if (workerScript.env.stopFlag) {return Promise.reject(workerScript);}
                const moneyBefore = server.moneyAvailable <= 0 ? 1 : server.moneyAvailable;
                server.moneyAvailable += (1 * threads); // It can be grown even if it has no money
                var growthPercentage = processSingleServerGrowth(server, 450 * threads, Player);
                const moneyAfter = server.moneyAvailable;
                workerScript.scriptRef.recordGrow(server.ip, threads);
                var expGain = calculateHackingExpGain(server) * threads;
                if (growthPercentage == 1) {
                    expGain = 0;
                }
                const logGrowPercent = (moneyAfter/moneyBefore)*100 - 100;
                workerScript.log("grow", `Available money on '${server.hostname}' grown by ${formatNumber(logGrowPercent, 6)}%. Gained ${numeralWrapper.format(expGain, '0.000a')} hacking exp (t=${threads}).`);
                workerScript.scriptRef.onlineExpGained += expGain;
                Player.gainHackingExp(expGain);
                if (stock) {
                    influenceStockThroughServerGrow(server, moneyAfter - moneyBefore);
                }
                return Promise.resolve(moneyAfter/moneyBefore);
            });
        },
        growthAnalyze : function(ip, growth) {
            updateDynamicRam("growthAnalyze", getRamCost("growthAnalyze"));

            // Check argument validity
            const server = safeGetServer(ip, 'growthAnalyze');
            if (typeof growth !== "number" || isNaN(growth) || growth < 1) {
                throw makeRuntimeErrorMsg("growthAnalyze", `Invalid argument: growth must be numeric and >= 1, is ${growth}.`);
            }

            return numCycleForGrowth(server, Number(growth), Player);
        },
        weaken : function(ip, { threads: requestedThreads } = {}) {
            updateDynamicRam("weaken", getRamCost("weaken"));
            var threads = resolveNetscriptRequestedThreads(workerScript, "weaken", requestedThreads)
            if (ip === undefined) {
                throw makeRuntimeErrorMsg("weaken", "Takes 1 argument.");
            }
            var server = getServer(ip);
            if (server == null) {
                throw makeRuntimeErrorMsg("weaken", `Invalid IP/hostname: ${ip}`);
            }

            // No root access or skill level too low
            const canHack = netscriptCanWeaken(server);
            if (!canHack.res) {
                throw makeRuntimeErrorMsg("weaken", canHack.msg);
            }

            var weakenTime = calculateWeakenTime(server);
            workerScript.log("weaken", `Executing on '${server.hostname}' in ${formatNumber(weakenTime, 3)} seconds (t=${threads})`);
            return netscriptDelay(weakenTime * 1000, workerScript).then(function() {
                if (workerScript.env.stopFlag) {return Promise.reject(workerScript);}
                server.weaken(CONSTANTS.ServerWeakenAmount * threads);
                workerScript.scriptRef.recordWeaken(server.ip, threads);
                var expGain = calculateHackingExpGain(server) * threads;
                workerScript.log("weaken", `'${server.hostname}' security level weakened to ${server.hackDifficulty}. Gained ${numeralWrapper.format(expGain, '0.000a')} hacking exp (t=${threads})`);
                workerScript.scriptRef.onlineExpGained += expGain;
                Player.gainHackingExp(expGain);
                return Promise.resolve(CONSTANTS.ServerWeakenAmount * threads);
            });
        },
        print: function(args){
            if (args === undefined) {
                throw makeRuntimeErrorMsg("print", "Takes 1 argument.");
            }
            workerScript.print("print", args.toString());
        },
        tprint: function(args) {
            if (args === undefined || args == null) {
                throw makeRuntimeErrorMsg("tprint", "Takes 1 argument.");
            }
            var x = args.toString();
            post(`${workerScript.scriptRef.filename}: ${args.toString()}`);
        },
        clearLog: function() {
            workerScript.scriptRef.clearLog();
        },
        disableLog: function(fn) {
            if (possibleLogs[fn]===undefined) {
                throw makeRuntimeErrorMsg("disableLog", `Invalid argument: ${fn}.`);
            }
            workerScript.disableLogs[fn] = true;
            workerScript.log("disableLog", `Disabled logging for ${fn}`);
        },
        enableLog: function(fn) {
            if (possibleLogs[fn]===undefined) {
                throw makeRuntimeErrorMsg("enableLog", `Invalid argument: ${fn}.`);
            }
            delete workerScript.disableLogs[fn];
            workerScript.log("enableLog", `Enabled logging for ${fn}`);
        },
        isLogEnabled : function(fn) {
            if (possibleLogs[fn] === undefined) {
                throw makeRuntimeErrorMsg("isLogEnabled", `Invalid argument: ${fn}.`);
            }
            return workerScript.disableLogs[fn] ? false : true;
        },
        getScriptLogs: function(fn, ip, ...scriptArgs) {
            const runningScriptObj = getRunningScript(fn, ip, "getScriptLogs", scriptArgs);
            if (runningScriptObj == null) {
                workerScript.log("getScriptLogs", getCannotFindRunningScriptErrorMessage(fn, ip, scriptArgs));
                return "";
            }

            return runningScriptObj.logs.slice();
        },
        tail: function(fn, ip, ...scriptArgs) {
            const runningScriptObj = getRunningScript(fn, ip, "tail", scriptArgs);
            if (runningScriptObj == null) {
                workerScript.log("tail", getCannotFindRunningScriptErrorMessage(fn, ip, scriptArgs));
                return;
            }

            logBoxCreate(runningScriptObj);
        },
        nuke: function(ip){
            updateDynamicRam("nuke", getRamCost("nuke"));
            if (ip === undefined) {
                throw makeRuntimeErrorMsg("nuke", "Takes 1 argument.");
            }
            var server = getServer(ip);
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
        brutessh: function(ip){
            updateDynamicRam("brutessh", getRamCost("brutessh"));
            if (ip === undefined) {
                throw makeRuntimeErrorMsg("brutessh", "Takes 1 argument.");
            }
            var server = getServer(ip);
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
        ftpcrack: function(ip) {
            updateDynamicRam("ftpcrack", getRamCost("ftpcrack"));
            if (ip === undefined) {
                throw makeRuntimeErrorMsg("ftpcrack", "Takes 1 argument.");
            }
            var server = getServer(ip);
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
        relaysmtp: function(ip) {
            updateDynamicRam("relaysmtp", getRamCost("relaysmtp"));
            if (ip === undefined) {
                throw makeRuntimeErrorMsg("relaysmtp", "Takes 1 argument.");
            }
            var server = getServer(ip);
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
        httpworm: function(ip) {
            updateDynamicRam("httpworm", getRamCost("httpworm"));
            if (ip === undefined) {
                throw makeRuntimeErrorMsg("httpworm", "Takes 1 argument");
            }
            var server = getServer(ip);
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
        sqlinject: function(ip) {
            updateDynamicRam("sqlinject", getRamCost("sqlinject"));
            if (ip === undefined) {
                throw makeRuntimeErrorMsg("sqlinject", "Takes 1 argument.");
            }
            var server = getServer(ip);
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
        run: function(scriptname, threads=1) {
            updateDynamicRam("run", getRamCost("run"));
            if (scriptname === undefined) {
                throw makeRuntimeErrorMsg("run", "Usage: run(scriptname, [numThreads], [arg1], [arg2]...)");
            }
            if (isNaN(threads) || threads <= 0) {
                throw makeRuntimeErrorMsg("run", `Invalid thread count. Must be numeric and > 0, is ${thread}`);
            }
            var argsForNewScript = [];
            for (var i = 2; i < arguments.length; ++i) {
                argsForNewScript.push(arguments[i]);
            }
            var scriptServer = getServer(workerScript.serverIp);
            if (scriptServer == null) {
                throw makeRuntimeErrorMsg("run", "Could not find server. This is a bug. Report to dev.");
            }

            return runScriptFromScript("run", scriptServer, scriptname, argsForNewScript, workerScript, threads);
        },
        exec: function(scriptname, ip, threads = 1) {
            updateDynamicRam("exec", getRamCost("exec"));
            if (scriptname === undefined || ip === undefined) {
                throw makeRuntimeErrorMsg("exec", "Usage: exec(scriptname, server, [numThreads], [arg1], [arg2]...)");
            }
            if (isNaN(threads) || threads <= 0) {
                throw makeRuntimeErrorMsg("exec", `Invalid thread count. Must be numeric and > 0, is ${threads}`);
            }
            var argsForNewScript = [];
            for (var i = 3; i < arguments.length; ++i) {
                argsForNewScript.push(arguments[i]);
            }
            var server = getServer(ip);
            if (server == null) {
                throw makeRuntimeErrorMsg("exec", `Invalid IP/hostname: ${ip}`);
            }
            return runScriptFromScript("exec", server, scriptname, argsForNewScript, workerScript, threads);
        },
        spawn: function(scriptname, threads) {
            updateDynamicRam("spawn", getRamCost("spawn"));
            if (!scriptname || !threads) {
                throw makeRuntimeErrorMsg("spawn", "Usage: spawn(scriptname, threads)");
            }

            const spawnDelay = 10;
            setTimeoutRef(() => {
                if (isNaN(threads) || threads <= 0) {
                    throw makeRuntimeErrorMsg("spawn", `Invalid thread count. Must be numeric and > 0, is ${threads}`);
                }
                var argsForNewScript = [];
                for (var i = 2; i < arguments.length; ++i) {
                    argsForNewScript.push(arguments[i]);
                }
                var scriptServer = getServer(workerScript.serverIp);
                if (scriptServer == null) {
                    throw makeRuntimeErrorMsg("spawn", "Could not find server. This is a bug. Report to dev");
                }

                return runScriptFromScript("spawn", scriptServer, scriptname, argsForNewScript, workerScript, threads);
            }, spawnDelay * 1e3);

            workerScript.log("spawn", `Will execute '${scriptname}' in ${spawnDelay} seconds`);

            workerScript.running = false; // Prevent workerScript from "finishing execution naturally"
            if (killWorkerScript(workerScript)) {
                workerScript.log("spawn", "Exiting...");
            }
        },
        kill: function(filename, ip, ...scriptArgs) {
            updateDynamicRam("kill", getRamCost("kill"));

            let res;
            const killByPid = (typeof filename === "number");
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

                res = killWorkerScript(runningScriptObj, server.ip);
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
        killall: function(ip=workerScript.serverIp) {
            updateDynamicRam("killall", getRamCost("killall"));
            if (ip === undefined) {
                throw makeRuntimeErrorMsg("killall", "Takes 1 argument");
            }
            const server = getServer(ip);
            if (server == null) {
                throw makeRuntimeErrorMsg("killall", `Invalid IP/hostname: ${ip}`);
            }
            const scriptsRunning = (server.runningScripts.length > 0);
            for (let i = server.runningScripts.length-1; i >= 0; --i) {
                killWorkerScript(server.runningScripts[i], server.ip, false);
            }
            WorkerScriptStartStopEventEmitter.emitEvent();
            workerScript.log("killall", `Killing all scripts on '${server.hostname}'. May take a few minutes for the scripts to die.`);

            return scriptsRunning;
        },
        exit : function() {
            workerScript.running = false; // Prevent workerScript from "finishing execution naturally"
            if (killWorkerScript(workerScript)) {
                workerScript.log("exit", "Exiting...");
            } else {
                workerScript.log("exit", "Failed. This is a bug. Report to dev.");
            }
        },
        scp: function(scriptname, ip1, ip2) {
            updateDynamicRam("scp", getRamCost("scp"));
            if (arguments.length !== 2 && arguments.length !== 3) {
                throw makeRuntimeErrorMsg("scp", "Takes 2 or 3 arguments");
            }
            if (scriptname && scriptname.constructor === Array) {
                // Recursively call scp on all elements of array
                var res = false;
                scriptname.forEach(function(script) {
                    if (NetscriptFunctions(workerScript).scp(script, ip1, ip2)) {
                        res = true;
                    };
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

            var destServer, currServ;

            if (ip2 != null) { // 3 Argument version: scriptname, source, destination
                if (scriptname === undefined || ip1 === undefined || ip2 === undefined) {
                    throw makeRuntimeErrorMsg("scp", "Takes 2 or 3 arguments");
                }
                destServer = getServer(ip2);
                if (destServer == null) {
                    throw makeRuntimeErrorMsg("scp", `Invalid IP/hostname: ${ip2}`);
                }

                currServ = getServer(ip1);
                if (currServ == null) {
                    throw makeRuntimeErrorMsg("scp", `Invalid IP/hostname: ${ip1}`);
                }
            } else if (ip1 != null) { // 2 Argument version: scriptname, destination
                if (scriptname === undefined || ip1 === undefined) {
                    throw makeRuntimeErrorMsg("scp", "Takes 2 or 3 arguments");
                }
                destServer = getServer(ip1);
                if (destServer == null) {
                    throw makeRuntimeErrorMsg("scp", `Invalid IP/hostname: ${ip1}`);
                }

                currServ = getServer(workerScript.serverIp);
                if (currServ == null) {
                    throw makeRuntimeErrorMsg("scp", "Could not find server ip for this script. This is a bug. Report to dev.");
                }
            } else {
                throw makeRuntimeErrorMsg("scp", "Takes 2 or 3 arguments");
            }

            // Scp for lit files
            if (scriptname.endsWith(".lit")) {
                var found = false;
                for (var i = 0; i < currServ.messages.length; ++i) {
                    if (!(currServ.messages[i] instanceof Message) && currServ.messages[i] == scriptname) {
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    workerScript.log("scp", `File '${scriptname}' does not exist.`);
                    return false;
                }

                for (var i = 0; i < destServer.messages.length; ++i) {
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
                var found = false, txtFile;
                for (var i = 0; i < currServ.textFiles.length; ++i) {
                    if (currServ.textFiles[i].fn === scriptname) {
                        found = true;
                        txtFile = currServ.textFiles[i];
                        break;
                    }
                }

                if (!found) {
                    workerScript.log("scp", `File '${scriptname}' does not exist.`);
                    return false;
                }

                for (var i = 0; i < destServer.textFiles.length; ++i) {
                    if (destServer.textFiles[i].fn === scriptname) {
                        // Overwrite
                        destServer.textFiles[i].text = txtFile.text;
                        workerScript.log("scp", `File '${scriptname}' copied over to '${destServer.hostname}'.`);
                        return true;
                    }
                }
                var newFile = new TextFile(txtFile.fn, txtFile.text);
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
            newScript.server = destServer.ip;
            destServer.scripts.push(newScript);
            workerScript.log("scp", `File '${scriptname}' copied over to '${destServer.hostname}'.`);
            return true;
        },
        ls: function(ip, grep) {
            updateDynamicRam("ls", getRamCost("ls"));
            if (ip === undefined) {
                throw makeRuntimeErrorMsg("ls", "Usage: ls(ip/hostname, [grep filter])");
            }
            const server = getServer(ip);
            if (server == null) {
                throw makeRuntimeErrorMsg("ls", `Invalid IP/hostname: ${ip}`);
            }

            // Get the grep filter, if one exists
            let filter = false;
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
                    if (server.messages[i] instanceof Message) {
                        if (server.messages[i].filename.includes(filter)) {
                            allFiles.push(server.messages[i].filename);
                        }
                    } else if (server.messages[i].includes(filter)) {
                        allFiles.push(server.messages[i]);
                    }
                } else {
                    if (server.messages[i] instanceof Message) {
                        allFiles.push(server.messages[i].filename);
                    } else {
                        allFiles.push(server.messages[i]);
                    }
                }
            }

            for (var i = 0; i < server.textFiles.length; i++) {
                if (filter) {
                    if (server.textFiles[i].fn.includes(filter)) {
                        allFiles.push(server.textFiles[i].fn);
                    }
                } else {
                    allFiles.push(server.textFiles[i].fn);
                }
            }

            for (var i = 0; i < server.contracts.length; ++i) {
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
        ps: function(ip=workerScript.serverIp) {
            updateDynamicRam("ps", getRamCost("ps"));
            var server = getServer(ip);
            if (server == null){
                throw makeRuntimeErrorMsg("ps", `Invalid IP/hostname: ${ip}`);
            }
            const processes = [];
            for (const i in server.runningScripts) {
                const script = server.runningScripts[i];
                processes.push({filename:script.filename, threads: script.threads, args: script.args.slice()})
            }
            return processes;
        },
        hasRootAccess: function(ip) {
            updateDynamicRam("hasRootAccess", getRamCost("hasRootAccess"));
            if (ip===undefined){
                throw makeRuntimeErrorMsg("hasRootAccess", "Takes 1 argument");
            }
            var server = getServer(ip);
            if (server == null){
                throw makeRuntimeErrorMsg("hasRootAccess", `Invalid IP/hostname: ${ip}`);
            }
            return server.hasAdminRights;
        },
        getIp: function() {
            updateDynamicRam("getIp", getRamCost("getIp"));
            var scriptServer = getServer(workerScript.serverIp);
            if (scriptServer == null) {
                throw makeRuntimeErrorMsg("getIp", "Could not find server. This is a bug. Report to dev.");
            }
            return scriptServer.ip;
        },
        getHostname: function() {
            updateDynamicRam("getHostname", getRamCost("getHostname"));
            var scriptServer = getServer(workerScript.serverIp);
            if (scriptServer == null) {
                throw makeRuntimeErrorMsg(workerScript, "Could not find server. This is a bug. Report to dev.");
            }
            return scriptServer.hostname;
        },
        getHackingLevel: function() {
            updateDynamicRam("getHackingLevel", getRamCost("getHackingLevel"));
            Player.updateSkillLevels();
            workerScript.log("getHackingLevel", `returned ${Player.hacking_skill}`);
            return Player.hacking_skill;
        },
        getHackingMultipliers: function() {
            updateDynamicRam("getHackingMultipliers", getRamCost("getHackingMultipliers"));
            return {
                chance: Player.hacking_chance_mult,
                speed: Player.hacking_speed_mult,
                money: Player.hacking_money_mult,
                growth: Player.hacking_grow_mult,
            };
        },
        getHacknetMultipliers: function() {
            updateDynamicRam("getHacknetMultipliers", getRamCost("getHacknetMultipliers"));
            return {
                production: Player.hacknet_node_money_mult,
                purchaseCost: Player.hacknet_node_purchase_cost_mult,
                ramCost: Player.hacknet_node_ram_cost_mult,
                coreCost: Player.hacknet_node_core_cost_mult,
                levelCost: Player.hacknet_node_level_cost_mult,
            };
        },
        getBitNodeMultipliers: function() {
            updateDynamicRam("getBitNodeMultipliers", getRamCost("getBitNodeMultipliers"));
            if (SourceFileFlags[5] <= 0) {
                throw makeRuntimeErrorMsg("getBitNodeMultipliers", "Requires Source-File 5 to run.");
            }
            let copy = Object.assign({}, BitNodeMultipliers);
            return copy;
        },
        getServerMoneyAvailable: function(ip) {
            updateDynamicRam("getServerMoneyAvailable", getRamCost("getServerMoneyAvailable"));
            const server = safeGetServer(ip, "getServerMoneyAvailable");
            if (failOnHacknetServer(server, "getServerMoneyAvailable")) { return 0; }
            if (server.hostname == "home") {
                // Return player's money
                workerScript.log("getServerMoneyAvailable", `returned player's money: ${numeralWrapper.format(Player.money.toNumber(), '$0.000a')}`);
                return Player.money.toNumber();
            }
            workerScript.log("getServerMoneyAvailable", `returned ${numeralWrapper.format(server.moneyAvailable, '$0.000a')} for '${server.hostname}`);
            return server.moneyAvailable;
        },
        getServerSecurityLevel: function(ip) {
            updateDynamicRam("getServerSecurityLevel", getRamCost("getServerSecurityLevel"));
            const server = safeGetServer(ip, "getServerSecurityLevel");
            if (failOnHacknetServer(server, "getServerSecurityLevel")) { return 1; }
            workerScript.log("getServerSecurityLevel", `returned ${formatNumber(server.hackDifficulty, 3)} for '${server.hostname}'`);
            return server.hackDifficulty;
        },
        getServerBaseSecurityLevel: function(ip) {
            updateDynamicRam("getServerBaseSecurityLevel", getRamCost("getServerBaseSecurityLevel"));
            const server = safeGetServer(ip, "getServerBaseSecurityLevel");
            if (failOnHacknetServer(server, "getServerBaseSecurityLevel")) { return 1; }
            workerScript.log("getServerBaseSecurityLevel", `returned ${formatNumber(server.baseDifficulty, 3)} for '${server.hostname}'`);
            return server.baseDifficulty;
        },
        getServerMinSecurityLevel: function(ip) {
            updateDynamicRam("getServerMinSecurityLevel", getRamCost("getServerMinSecurityLevel"));
            const server = safeGetServer(ip, "getServerMinSecurityLevel");
            if (failOnHacknetServer(server, "getServerMinSecurityLevel")) { return 1; }
            workerScript.log("getServerMinSecurityLevel", `returned ${formatNumber(server.minDifficulty, 3)} for ${server.hostname}`);
            return server.minDifficulty;
        },
        getServerRequiredHackingLevel: function(ip) {
            updateDynamicRam("getServerRequiredHackingLevel", getRamCost("getServerRequiredHackingLevel"));
            const server = safeGetServer(ip, "getServerRequiredHackingLevel");
            if (failOnHacknetServer(server, "getServerRequiredHackingLevel")) { return 1; }
            workerScript.log("getServerRequiredHackingLevel", `returned ${formatNumber(server.requiredHackingSkill, 0)} for '${server.hostname}'`);
            return server.requiredHackingSkill;
        },
        getServerMaxMoney: function(ip) {
            updateDynamicRam("getServerMaxMoney", getRamCost("getServerMaxMoney"));
            const server = safeGetServer(ip, "getServerMaxMoney");
            if (failOnHacknetServer(server, "getServerMaxMoney")) { return 0; }
            workerScript.log("getServerMaxMoney", `returned ${numeralWrapper.format(server.moneyMax, '$0.000a')} for '${server.hostname}'`);
            return server.moneyMax;
        },
        getServerGrowth: function(ip) {
            updateDynamicRam("getServerGrowth", getRamCost("getServerGrowth"));
            const server = safeGetServer(ip, "getServerGrowth");
            if (failOnHacknetServer(server, "getServerGrowth")) { return 1; }
            workerScript.log("getServerGrowth", `returned ${formatNumber(server.serverGrowth, 0)} for '${server.hostname}'`);
            return server.serverGrowth;
        },
        getServerNumPortsRequired: function(ip) {
            updateDynamicRam("getServerNumPortsRequired", getRamCost("getServerNumPortsRequired"));
            const server = safeGetServer(ip, "getServerNumPortsRequired");
            if (failOnHacknetServer(server, "getServerNumPortsRequired")) { return 5; }
            workerScript.log("getServerNumPortsRequired", `returned ${formatNumber(server.numOpenPortsRequired, 0)} for '${server.hostname}'`);
            return server.numOpenPortsRequired;
        },
        getServerRam: function(ip) {
            updateDynamicRam("getServerRam", getRamCost("getServerRam"));
            const server = safeGetServer(ip, "getServerRam");
            workerScript.log("getServerRam", `returned [${formatNumber(server.maxRam, 2)}GB, ${formatNumber(server.ramUsed, 2)}GB]`);
            return [server.maxRam, server.ramUsed];
        },
        serverExists: function(ip) {
            updateDynamicRam("serverExists", getRamCost("serverExists"));
            return (getServer(ip) !== null);
        },
        fileExists: function(filename,ip=workerScript.serverIp) {
            updateDynamicRam("fileExists", getRamCost("fileExists"));
            if (filename === undefined) {
                throw makeRuntimeErrorMsg("fileExists", "Usage: fileExists(scriptname, [server])");
            }
            var server = getServer(ip);
            if (server == null) {
                throw makeRuntimeErrorMsg("fileExists", `Invalid IP/hostname: ${ip}`);
            }
            for (var i = 0; i < server.scripts.length; ++i) {
                if (filename == server.scripts[i].filename) {
                    return true;
                }
            }
            for (var i = 0; i < server.programs.length; ++i) {
                if (filename.toLowerCase() == server.programs[i].toLowerCase()) {
                    return true;
                }
            }
            for (var i = 0; i < server.messages.length; ++i) {
                if (!(server.messages[i] instanceof Message) &&
                    filename.toLowerCase() === server.messages[i]) {
                    return true;
                }
            }
            var txtFile = getTextFile(filename, server);
            if (txtFile != null) {
              return true;
            }
            return false;
        },
        isRunning: function(filename,ip) {
            updateDynamicRam("isRunning", getRamCost("isRunning"));
            if (filename === undefined || ip === undefined) {
                throw makeRuntimeErrorMsg("isRunning", "Usage: isRunning(scriptname, server, [arg1], [arg2]...)");
            }
            var server = getServer(ip);
            if (server == null) {
                throw makeRuntimeErrorMsg("isRunning", `Invalid IP/hostname: ${ip}`);
            }
            var argsForTargetScript = [];
            for (var i = 2; i < arguments.length; ++i) {
                argsForTargetScript.push(arguments[i]);
            }
            return (findRunningScript(filename, argsForTargetScript, server) != null);
        },
        getStockSymbols: function() {
            updateDynamicRam("getStockSymbols", getRamCost("getStockSymbols"));
            checkTixApiAccess("getStockSymbols");
            return Object.values(StockSymbols);
        },
        getStockPrice: function(symbol) {
            updateDynamicRam("getStockPrice", getRamCost("getStockPrice"));
            checkTixApiAccess("getStockPrice");
            const stock = getStockFromSymbol(symbol, "getStockPrice");

            return stock.price;
        },
        getStockAskPrice: function(symbol) {
            updateDynamicRam("getStockAskPrice", getRamCost("getStockAskPrice"));
            checkTixApiAccess("getStockAskPrice");
            const stock = getStockFromSymbol(symbol, "getStockAskPrice");

            return stock.getAskPrice();
        },
        getStockBidPrice: function(symbol) {
            updateDynamicRam("getStockBidPrice", getRamCost("getStockBidPrice"));
            checkTixApiAccess("getStockBidPrice");
            const stock = getStockFromSymbol(symbol, "getStockBidPrice");

            return stock.getBidPrice();
        },
        getStockPosition: function(symbol) {
            updateDynamicRam("getStockPosition", getRamCost("getStockPosition"));
            checkTixApiAccess("getStockPosition");
            var stock = SymbolToStockMap[symbol];
            if (stock == null) {
                throw makeRuntimeErrorMsg("getStockPosition", `Invalid stock symbol: ${symbol}`);
            }
            return [stock.playerShares, stock.playerAvgPx, stock.playerShortShares, stock.playerAvgShortPx];
        },
        getStockMaxShares: function(symbol) {
            updateDynamicRam("getStockMaxShares", getRamCost("getStockMaxShares"));
            checkTixApiAccess("getStockMaxShares");
            const stock = getStockFromSymbol(symbol, "getStockMaxShares");

            return stock.maxShares;
        },
        getStockPurchaseCost: function(symbol, shares, posType) {
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
            if (res == null) { return Infinity; }

            return res;
        },
        getStockSaleGain: function(symbol, shares, posType) {
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
            if (res == null) { return 0; }

             return res;
        },
        buyStock: function(symbol, shares) {
            updateDynamicRam("buyStock", getRamCost("buyStock"));
            checkTixApiAccess("buyStock");
            const stock = getStockFromSymbol(symbol, "buyStock");
            const res = buyStock(stock, shares, workerScript, { rerenderFn: displayStockMarketContent });

            return res ? stock.price : 0;
        },
        sellStock: function(symbol, shares) {
            updateDynamicRam("sellStock", getRamCost("sellStock"));
            checkTixApiAccess("sellStock");
            const stock = getStockFromSymbol(symbol, "sellStock");
            const res = sellStock(stock, shares, workerScript, { rerenderFn: displayStockMarketContent });

            return res ? stock.price : 0;
        },
        shortStock: function(symbol, shares) {
            updateDynamicRam("shortStock", getRamCost("shortStock"));
            checkTixApiAccess("shortStock");
            if (Player.bitNodeN !== 8) {
                if (SourceFileFlags[8] <= 1) {
                    throw makeRuntimeErrorMsg(shortStock, "You must either be in BitNode-8 or you must have Source-File 8 Level 2.");
                }
            }
            const stock = getStockFromSymbol(symbol, "shortStock");
            const res = shortStock(stock, shares, workerScript, { rerenderFn: displayStockMarketContent });

            return res ? stock.price : 0;
        },
        sellShort: function(symbol, shares) {
            updateDynamicRam("sellShort", getRamCost("sellShort"));
            checkTixApiAccess("sellShort");
            if (Player.bitNodeN !== 8) {
                if (SourceFileFlags[8] <= 1) {
                    throw makeRuntimeErrorMsg("sellShort", "You must either be in BitNode-8 or you must have Source-File 8 Level 2.");
                }
            }
            const stock = getStockFromSymbol(symbol, "sellShort");
            const res = sellShort(stock, shares, workerScript, { rerenderFn: displayStockMarketContent });

            return res ? stock.price : 0;
        },
        placeOrder: function(symbol, shares, price, type, pos) {
            updateDynamicRam("placeOrder", getRamCost("placeOrder"));
            checkTixApiAccess("placeOrder");
            if (Player.bitNodeN !== 8) {
                if (SourceFileFlags[8] <= 2) {
                    throw makeRuntimeErrorMsg("placeOrder", "You must either be in BitNode-8 or you must have Source-File 8 Level 3.");
                }
            }
            const stock = getStockFromSymbol(symbol, "placeOrder");

            let orderType, orderPos;
            ltype = type.toLowerCase();
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

            lpos = pos.toLowerCase();
            if (lpos.includes("l")) {
                orderPos = PositionTypes.Long;
            } else if (lpos.includes('s')) {
                orderPos = PositionTypes.Short;
            } else {
                throw makeRuntimeErrorMsg("placeOrder", `Invalid position type: ${pos}`);
            }

            return placeOrder(stock, shares, price, orderType, orderPos, workerScript);
        },
        cancelOrder: function(symbol, shares, price, type, pos) {
            updateDynamicRam("cancelOrder", getRamCost("cancelOrder"));
            checkTixApiAccess("cancelOrder");
            if (Player.bitNodeN !== 8) {
                if (SourceFileFlags[8] <= 2) {
                    throw makeRuntimeErrorMsg("cancelOrder", "You must either be in BitNode-8 or you must have Source-File 8 Level 3.");
                }
            }
            const stock = getStockFrom(symbol, "cancelOrder");
            if (isNaN(shares) || isNaN(price)) {
                throw makeRuntimeErrorMsg("cancelOrder", `Invalid shares or price. Must be numeric. shares=${shares}, price=${price}`);
            }
            var orderType, orderPos;
            ltype = type.toLowerCase();
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

            lpos = pos.toLowerCase();
            if (lpos.includes("l")) {
                orderPos = PositionTypes.Long;
            } else if (lpos.includes('s')) {
                orderPos = PositionTypes.Short;
            } else {
                throw makeRuntimeErrorMsg("cancelOrder", `Invalid position type: ${pos}`);
            }
            var params = {
                stock: stock,
                shares: shares,
                price: price,
                type: orderType,
                pos: orderPos
            };
            return cancelOrder(params, workerScript);
        },
        getOrders: function() {
            updateDynamicRam("getOrders", getRamCost("getOrders"));
            checkTixApiAccess("getOrders");
            if (Player.bitNodeN !== 8) {
                if (SourceFileFlags[8] <= 2) {
                    throw makeRuntimeErrorMsg(workerScript, "You must either be in BitNode-8 or have Source-File 8 Level 3.");
                }
            }

            const orders = {};

            const stockMarketOrders = StockMarket["Orders"];
            for (let symbol in stockMarketOrders) {
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
        getStockVolatility: function(symbol) {
            updateDynamicRam("getStockVolatility", getRamCost("getStockVolatility"));
            if (!Player.has4SDataTixApi) {
                throw makeRuntimeErrorMsg("getStockVolatility", "You don't have 4S Market Data TIX API Access!");
            }
            const stock = getStockFromSymbol(symbol, "getStockVolatility");

            return stock.mv / 100; // Convert from percentage to decimal
        },
        getStockForecast: function(symbol) {
            updateDynamicRam("getStockForecast", getRamCost("getStockForecast"));
            if (!Player.has4SDataTixApi) {
                throw makeRuntimeErrorMsg("getStockForecast", "You don't have 4S Market Data TIX API Access!");
            }
            const stock = getStockFromSymbol(symbol, "getStockForecast");

            var forecast = 50;
            stock.b ? forecast += stock.otlkMag : forecast -= stock.otlkMag;
            return forecast / 100; // Convert from percentage to decimal
        },
        purchase4SMarketData: function() {
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
            displayStockMarketContent();
            return true;
        },
        purchase4SMarketDataTixApi : function() {
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
            displayStockMarketContent();
            return true;
        },
        getPurchasedServerLimit : function() {
            updateDynamicRam("getPurchasedServerLimit", getRamCost("getPurchasedServerLimit"));

            return getPurchaseServerLimit();
        },
        getPurchasedServerMaxRam: function() {
            updateDynamicRam("getPurchasedServerMaxRam", getRamCost("getPurchasedServerMaxRam"));

            return getPurchaseServerMaxRam();
        },
        getPurchasedServerCost: function(ram) {
            updateDynamicRam("getPurchasedServerCost", getRamCost("getPurchasedServerCost"));

            const cost = getPurchaseServerCost(ram);
            if (cost === Infinity) {
                workerScript.log("getPurchasedServerCost", `Invalid argument: ram='${ram}'`);
                return Infinity;
            }

            return cost;
        },
        purchaseServer: function(hostname, ram) {
            updateDynamicRam("purchaseServer", getRamCost("purchaseServer"));
            var hostnameStr = String(hostname);
            hostnameStr = hostnameStr.replace(/\s+/g, '');
            if (hostnameStr == "") {
                workerScript.log("purchaseServer", `Invalid argument: hostname='${hostnameStr}'`);
                return "";
            }

            if (Player.purchasedServers.length >= getPurchaseServerLimit()) {
                workerScript.log("purchaseServer", `You have reached the maximum limit of ${getPurchaseServerLimit()} servers. You cannot purchase any more.`);
                return "";
            }

            const cost = getPurchaseServerCost(ram);
            if (cost === Infinity) {
                workerScript.log("purchaseServer", `Invalid argument: ram='${ram}'`);
                return Infinity;
            }

            if (Player.money.lt(cost)) {
                workerScript.log("purchaseServer", `Not enough money to purchase server. Need ${numeralWrapper.format(cost, '$0.000a')}`);
                return "";
            }
            var newServ = safetlyCreateUniqueServer({
                ip: createUniqueRandomIp(),
                hostname: hostnameStr,
                organizationName: "",
                isConnectedTo: false,
                adminRights: true,
                purchasedByPlayer: true,
                maxRam: ram,
            });
            AddToAllServers(newServ);

            Player.purchasedServers.push(newServ.ip);
            var homeComputer = Player.getHomeComputer();
            homeComputer.serversOnNetwork.push(newServ.ip);
            newServ.serversOnNetwork.push(homeComputer.ip);
            Player.loseMoney(cost);
            workerScript.log("purchaseServer", `Purchased new server with hostname '${newServ.hostname}' for ${numeralWrapper.format(cost, '$0.000a')}`);
            return newServ.hostname;
        },
        deleteServer: function(hostname) {
            updateDynamicRam("deleteServer", getRamCost("deleteServer"));
            var hostnameStr = String(hostname);
            hostnameStr = hostnameStr.replace(/\s\s+/g, '');
            var server = GetServerByHostname(hostnameStr);
            if (server == null) {
                workerScript.log("deleteServer", `Invalid argument: hostname='${hostnameStr}'`);
                return false;
            }

            if (!server.purchasedByPlayer || server.hostname === "home") {
                workerScript.log("deleteServer", "Cannot delete non-purchased server.");
                return false;
            }

            var ip = server.ip;

            // Can't delete server you're currently connected to
            if (server.isConnectedTo) {
                workerScript.log("deleteServer", "You are currently connected to the server you are trying to delete.");
                return false;
            }

            // A server cannot delete itself
            if (ip === workerScript.serverIp) {
                workerScript.log("deleteServer", "Cannot delete the server this script is running on.");
                return false;
            }

            // Delete all scripts running on server
            if (server.runningScripts.length > 0) {
                workerScript.log("deleteServer", `Cannot delete server '${server.hostname}' because it still has scripts running.`);
                return false;
            }

            // Delete from player's purchasedServers array
            var found = false;
            for (var i = 0; i < Player.purchasedServers.length; ++i) {
                if (ip == Player.purchasedServers[i]) {
                    found = true;
                    Player.purchasedServers.splice(i, 1);
                    break;
                }
            }

            if (!found) {
                workerScript.log("deleteServer", `Could not identify server ${server.hostname} as a purchased server. This is a bug. Report to dev.`);
                return false;
            }

            // Delete from all servers
            delete AllServers[ip];

            // Delete from home computer
            found = false;
            var homeComputer = Player.getHomeComputer();
            for (var i = 0; i < homeComputer.serversOnNetwork.length; ++i) {
                if (ip == homeComputer.serversOnNetwork[i]) {
                    homeComputer.serversOnNetwork.splice(i, 1);
                    workerScript.log("deleteServer", `Deleted server '${hostnameStr}`);
                    return true;
                }
            }
            // Wasn't found on home computer
            workerScript.log("deleteServer", `Could not find server ${server.hostname} as a purchased server. This is a bug. Report to dev.`);
            return false;
        },
        getPurchasedServers: function(hostname=true) {
            updateDynamicRam("getPurchasedServers", getRamCost("getPurchasedServers"));
            var res = [];
            Player.purchasedServers.forEach(function(ip) {
                if (hostname) {
                    var server = getServer(ip);
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
        write: function(port, data="", mode="a") {
            updateDynamicRam("write", getRamCost("write"));
            if (!isNaN(port)) { // Write to port
                // Port 1-10
                port = Math.round(port);
                if (port < 1 || port > CONSTANTS.NumNetscriptPorts) {
                    throw makeRuntimeErrorMsg("write", `Trying to write to invalid port: ${port}. Only ports 1-${CONSTANTS.NumNetscriptPorts} are valid.`);
                }
                var port = NetscriptPorts[port-1];
                if (port == null || !(port instanceof NetscriptPort)) {
                    throw makeRuntimeErrorMsg("write", `Could not find port: ${port}. This is a bug. Report to dev.`);
                }
                return port.write(data);
            } else if (isString(port)) { // Write to script or text file
                const fn = port;
                if (!isValidFilePath(fn)) {
                    throw makeRuntimeErrorMsg("write", `Invalid filepath: ${fn}`);
                }

                // Coerce 'data' to be a string
                try {
                    data = String(data);
                } catch (e) {
                    throw makeRuntimeErrorMsg("write", `Invalid data (${e}). Data being written must be convertible to a string`);
                }

                const server = workerScript.getServer();
                if (server == null) {
                    throw makeRuntimeErrorMsg("write", "Error getting Server. This is a bug. Report to dev.");
                }
                if (isScriptFilename(fn)) {
                    // Write to script
                    let script = workerScript.getScriptOnServer(fn);
                    if (script == null) {
                        // Create a new script
                        script = new Script(fn, data, server.ip, server.scripts);
                        server.scripts.push(script);
                        return true;
                    }
                    mode === "w" ? script.code = data : script.code += data;
                    script.updateRamUsage(server.scripts);
                    script.markUpdated();
                } else {
                    // Write to text file
                    let txtFile = getTextFile(fn, server);
                    if (txtFile == null) {
                        txtFile = createTextFile(fn, data, server);
                        return true;
                    }
                    if (mode === "w") {
                        txtFile.write(data);
                    } else {
                        txtFile.append(data);
                    }
                }
                return true;
            } else {
                throw makeRuntimeErrorMsg("write", `Invalid argument: ${port}`);
            }
        },
        tryWrite: function(port, data="") {
            updateDynamicRam("tryWrite", getRamCost("tryWrite"));
            if (!isNaN(port)) {
                port = Math.round(port);
                if (port < 1 || port > CONSTANTS.NumNetscriptPorts) {
                    throw makeRuntimeErrorMsg("tryWrite", `Invalid port: ${port}. Only ports 1-${CONSTANTS.NumNetscriptPorts} are valid.`);
                }
                var port = NetscriptPorts[port-1];
                if (port == null || !(port instanceof NetscriptPort)) {
                    throw makeRuntimeErrorMsg("tryWrite", `Could not find port: ${port}. This is a bug. Report to dev.`);
                }
                return port.tryWrite(data);
            } else {
                throw makeRuntimeErrorMsg("tryWrite", `Invalid argument: ${port}`);
            }
        },
        read: function(port) {
            updateDynamicRam("read", getRamCost("read"));
            if (!isNaN(port)) { // Read from port
                // Port 1-10
                port = Math.round(port);
                if (port < 1 || port > CONSTANTS.NumNetscriptPorts) {
                    throw makeRuntimeErrorMsg("read", `Invalid port: ${port}. Only ports 1-${CONSTANTS.NumNetscriptPorts} are valid.`);
                }
                var port = NetscriptPorts[port-1];
                if (port == null || !(port instanceof NetscriptPort)) {
                    throw makeRuntimeErrorMsg("read", `Could not find port: ${port}. This is a bug. Report to dev.`);
                }
                return port.read();
            } else if (isString(port)) { // Read from script or text file
                let fn = port;
                let server = getServer(workerScript.serverIp);
                if (server == null) {
                    throw makeRuntimeErrorMsg("read", "Error getting Server. This is a bug. Report to dev.");
                }
                if (isScriptFilename(fn)) {
                    // Read from script
                    let script = workerScript.getScriptOnServer(fn);
                    if (script == null) {
                        return "";
                    }
                    return script.code;
                } else {
                    // Read from text file
                    let txtFile = getTextFile(fn, server);
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
        peek: function(port) {
            updateDynamicRam("peek", getRamCost("peek"));
            if (isNaN(port)) {
                throw makeRuntimeErrorMsg("peek", `Invalid argument. Must be a port number between 1 and ${CONSTANTS.NumNetscriptPorts}, is ${port}`);
            }
            port = Math.round(port);
            if (port < 1 || port > CONSTANTS.NumNetscriptPorts) {
                throw makeRuntimeErrorMsg("peek", `Invalid argument. Must be a port number between 1 and ${CONSTANTS.NumNetscriptPorts}, is ${port}`);
            }
            var port = NetscriptPorts[port-1];
            if (port == null || !(port instanceof NetscriptPort)) {
                throw makeRuntimeErrorMsg("peek", `Could not find port: ${port}. This is a bug. Report to dev.`);
            }
            return port.peek();
        },
        clear: function(port) {
            updateDynamicRam("clear", getRamCost("clear"));
            if (!isNaN(port)) { // Clear port
                port = Math.round(port);
                if (port < 1 || port > CONSTANTS.NumNetscriptPorts) {
                    throw makeRuntimeErrorMsg("clear", `Trying to clear invalid port: ${port}. Only ports 1-${CONSTANTS.NumNetscriptPorts} are valid`);
                }
                var port = NetscriptPorts[port-1];
                if (port == null || !(port instanceof NetscriptPort)) {
                    throw makeRuntimeErrorMsg("clear", `Could not find port: ${port}. This is a bug. Report to dev.`);
                }
                return port.clear();
            } else if (isString(port)) { // Clear text file
                var fn = port;
                var server = getServer(workerScript.serverIp);
                if (server == null) {
                    throw makeRuntimeErrorMsg("clear", "Error getting Server. This is a bug. Report to dev.");
                }
                var txtFile = getTextFile(fn, server);
                if (txtFile != null) {
                    txtFile.write("");
                }
            } else {
                throw makeRuntimeErrorMsg("clear", `Invalid argument: ${port}`);
            }
            return 0;
        },
        getPortHandle: function(port) {
            updateDynamicRam("getPortHandle", getRamCost("getPortHandle"));
            if (isNaN(port)) {
                throw makeRuntimeErrorMsg("getPortHandle", `Invalid port: ${port} Must be an integer between 1 and ${CONSTANTS.NumNetscriptPorts}.`);
            }
            port = Math.round(port);
            if (port < 1 || port > CONSTANTS.NumNetscriptPorts) {
                throw makeRuntimeErrorMsg("getPortHandle", `Invalid port: ${port}. Only ports 1-${CONSTANTS.NumNetscriptPorts} are valid.`);
            }
            var port = NetscriptPorts[port-1];
            if (port == null || !(port instanceof NetscriptPort)) {
                throw makeRuntimeErrorMsg("getPortHandle", `Could not find port: ${port}. This is a bug. Report to dev.`);
            }
            return port;
        },
        rm: function(fn, ip) {
            updateDynamicRam("rm", getRamCost("rm"));

            if (ip == null || ip === "") {
                ip = workerScript.serverIp;
            }
            const s = safeGetServer(ip, "rm");

            const status = s.removeFile(fn);
            if (!status.res) {
                workerScript.log("rm", status.msg);
            }

            return status.res;
        },
        scriptRunning: function(scriptname, ip) {
            updateDynamicRam("scriptRunning", getRamCost("scriptRunning"));
            var server = getServer(ip);
            if (server == null) {
                throw makeRuntimeErrorMsg("scriptRunning", `Invalid IP/hostname: ${ip}`);
            }
            for (var i = 0; i < server.runningScripts.length; ++i) {
                if (server.runningScripts[i].filename == scriptname) {
                    return true;
                }
            }
            return false;
        },
        scriptKill: function(scriptname, ip) {
            updateDynamicRam("scriptKill", getRamCost("scriptKill"));
            var server = getServer(ip);
            if (server == null) {
                throw makeRuntimeErrorMsg("scriptKill", `Invalid IP/hostname: ${ip}`);
            }
            var suc = false;
            for (var i = 0; i < server.runningScripts.length; ++i) {
                if (server.runningScripts[i].filename == scriptname) {
                    killWorkerScript(server.runningScripts[i], server.ip);
                    suc = true;
                }
            }
            return suc;
        },
        getScriptName: function() {
            return workerScript.name;
        },
        getScriptRam: function(scriptname, ip=workerScript.serverIp) {
            updateDynamicRam("getScriptRam", getRamCost("getScriptRam"));
            var server = getServer(ip);
            if (server == null) {
                throw makeRuntimeErrorMsg("getScriptRam", `Invalid IP/hostname: ${ip}`);
            }
            for (var i = 0; i < server.scripts.length; ++i) {
                if (server.scripts[i].filename == scriptname) {
                    return server.scripts[i].ramUsage;
                }
            }
            return 0;
        },
        getHackTime: function(ip, hack, int) {
            updateDynamicRam("getHackTime", getRamCost("getHackTime"));
            const server = safeGetServer(ip, "getHackTime");
            if (failOnHacknetServer(server, "getHackTime")) { return Infinity; }

            return calculateHackingTime(server, hack, int); // Returns seconds
        },
        getGrowTime: function(ip, hack, int) {
            updateDynamicRam("getGrowTime", getRamCost("getGrowTime"));
            const server = safeGetServer(ip, "getGrowTime");
            if (failOnHacknetServer(server, "getGrowTime")) { return Infinity; }

            return calculateGrowTime(server, hack, int); // Returns seconds
        },
        getWeakenTime: function(ip, hack, int) {
            updateDynamicRam("getWeakenTime", getRamCost("getWeakenTime"));
            const server = safeGetServer(ip, "getWeakenTime");
            if (failOnHacknetServer(server, "getWeakenTime")) { return Infinity; }

            return calculateWeakenTime(server, hack, int); // Returns seconds
        },
        getScriptIncome: function(scriptname, ip) {
            updateDynamicRam("getScriptIncome", getRamCost("getScriptIncome"));
            if (arguments.length === 0) {
                var res = [];

                // First element is total income of all currently running scripts
                let total = 0;
                for (const script of workerScripts.values()) {
                    total += (script.scriptRef.onlineMoneyMade / script.scriptRef.onlineRunningTime);
                }
                res.push(total);

                // Second element is total income you've earned from scripts since you installed Augs
                res.push(Player.scriptProdSinceLastAug / (Player.playtimeSinceLastAug / 1000));
                return res;
            } else {
                // Get income for a particular script
                var server = getServer(ip);
                if (server == null) {
                    throw makeRuntimeErrorMsg("getScriptIncome", `Invalid IP/hostnamed: ${ip}`);
                }
                var argsForScript = [];
                for (var i = 2; i < arguments.length; ++i) {
                    argsForScript.push(arguments[i]);
                }
                var runningScriptObj = findRunningScript(scriptname, argsForScript, server);
                if (runningScriptObj == null) {
                    workerScript.log("getScriptIncome", `No such script '${scriptname}' on '${server.hostname}' with args: ${arrayToString(argsForScript)}`);
                    return -1;
                }
                return runningScriptObj.onlineMoneyMade / runningScriptObj.onlineRunningTime;
            }
        },
        getScriptExpGain: function(scriptname, ip) {
            updateDynamicRam("getScriptExpGain", getRamCost("getScriptExpGain"));
            if (arguments.length === 0) {
                var total = 0;
                for (const ws of workerScripts.values()) {
                    total += (ws.scriptRef.onlineExpGained / ws.scriptRef.onlineRunningTime);
                }
                return total;
            } else {
                // Get income for a particular script
                var server = getServer(ip);
                if (server == null) {
                    throw makeRuntimeErrorMsg("getScriptExpGain", `Invalid IP/hostnamed: ${ip}`);
                }
                var argsForScript = [];
                for (var i = 2; i < arguments.length; ++i) {
                    argsForScript.push(arguments[i]);
                }
                var runningScriptObj = findRunningScript(scriptname, argsForScript, server);
                if (runningScriptObj == null) {
                    workerScript.log("getScriptExpGain", `No such script '${scriptname}' on '${server.hostname}' with args: ${arrayToString(argsForScript)}`);
                    return -1;
                }
                return runningScriptObj.onlineExpGained / runningScriptObj.onlineRunningTime;
            }
        },
        nFormat: function(n, format) {
            if (isNaN(n) || isNaN(parseFloat(n)) || typeof format !== "string") {
                return "";
            }

            return numeralWrapper.format(parseFloat(n), format);
        },
        getTimeSinceLastAug: function() {
            updateDynamicRam("getTimeSinceLastAug", getRamCost("getTimeSinceLastAug"));
            return Player.playtimeSinceLastAug;
        },
        prompt : function(txt) {
            if (!isString(txt)) {txt = String(txt);}

            // The id for this popup will consist of the first 20 characters of the prompt string..
            // Thats hopefully good enough to be unique
            const popupId = `prompt-popup-${txt.slice(0, 20)}`;
            const textElement = createElement("p", { innerHTML: txt });

            return new Promise(function(resolve, reject) {
                const yesBtn = createElement("button", {
                    class: "popup-box-button",
                    innerText: "Yes",
                    clickListener: () => {
                        removeElementById(popupId);
                        resolve(true);
                    },
                });

                const noBtn = createElement("button", {
                    class: "popup-box-button",
                    innerText: "No",
                    clickListener: () => {
                        removeElementById(popupId);
                        resolve(false);
                    },
                });

                createPopup(popupId, [textElement, yesBtn, noBtn]);
            });
        },
        wget: async function(url, target, ip=workerScript.serverIp) {
            if (!isScriptFilename(target) && !target.endsWith(".txt")) {
                workerScript.log("wget", `Invalid target file: '${target}'. Must be a script or text file.`);
                return Promise.resolve(false);
            }
            var s = safeGetServer(ip, "wget");
            return new Promise(function(resolve, reject) {
                $.get(url, function(data) {
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
                }, 'text').fail(function(e) {
                    workerScript.log("wget", JSON.stringify(e));
                    return resolve(false)
                });
            });
        },
        getFavorToDonate: function() {
            updateDynamicRam("getFavorToDonate", getRamCost("getFavorToDonate"));
            return Math.floor(CONSTANTS.BaseFavorToDonate * BitNodeMultipliers.RepToDonateToFaction);
        },

        /* Singularity Functions */
        universityCourse: function(universityName, className) {
            updateDynamicRam("universityCourse", getRamCost("universityCourse"));
            checkSingularityAccess("universityCourse", 1);
            if (inMission) {
                workerScript.log("universityCourse", "You are in the middle of a mission.");
                return;
            }
            if (Player.isWorking) {
                var txt = Player.singularityStopWork();
                workerScript.log("universityCourse", txt);
            }

            var costMult, expMult;
            switch(universityName.toLowerCase()) {
                case LocationName.AevumSummitUniversity.toLowerCase():
                    if (Player.city != CityName.Aevum) {
                        workerScript.log("universityCourse", "You cannot study at 'Summit University' because you are not in 'Aevum'.");
                        return false;
                    }
                    Player.gotoLocation(LocationName.AevumSummitUniversity);
                    costMult = 4;
                    expMult = 3;
                    break;
                case LocationName.Sector12RothmanUniversity.toLowerCase():
                    if (Player.city != CityName.Sector12) {
                        workerScript.log("universityCourse", "You cannot study at 'Rothman University' because you are not in 'Sector-12'.");
                        return false;
                    }
                    Player.location = LocationName.Sector12RothmanUniversity;
                    costMult = 3;
                    expMult = 2;
                    break;
                case LocationName.VolhavenZBInstituteOfTechnology.toLowerCase():
                    if (Player.city != CityName.Volhaven) {
                        workerScript.log("universityCourse", "You cannot study at 'ZB Institute of Technology' because you are not in 'Volhaven'.");
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

            var task;
            switch(className.toLowerCase()) {
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
            Player.startClass(costMult, expMult, task);
            workerScript.log("universityCourse", `Started ${task} at ${universityName}`);
            return true;
        },

        gymWorkout: function(gymName, stat) {
            updateDynamicRam("gymWorkout", getRamCost("gymWorkout"));
            checkSingularityAccess("gymWorkout", 1);
            if (inMission) {
                workerScript.log("gymWorkout", "You are in the middle of a mission.");
                return;
            }
            if (Player.isWorking) {
                var txt = Player.singularityStopWork();
                workerScript.log("gymWorkout", txt);
            }
            var costMult, expMult;
            switch(gymName.toLowerCase()) {
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
                        workerScript.log("gymWorkout", "You cannot workout at 'Powerhouse Gym' because you are not in 'Sector-12'.");
                        return false;
                    }
                    Player.location = LocationName.Sector12PowerhouseGym;
                    costMult = 20;
                    expMult = 10;
                    break;
                case LocationName.VolhavenMilleniumFitnessGym.toLowerCase():
                    if (Player.city != CityName.Volhaven) {
                        workerScript.log("gymWorkout", "You cannot workout at 'Millenium Fitness Gym' because you are not in 'Volhaven'.");
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

            switch(stat.toLowerCase()) {
                case "strength".toLowerCase():
                case "str".toLowerCase():
                    Player.startClass(costMult, expMult, CONSTANTS.ClassGymStrength);
                    break;
                case "defense".toLowerCase():
                case "def".toLowerCase():
                    Player.startClass(costMult, expMult, CONSTANTS.ClassGymDefense);
                    break;
                case "dexterity".toLowerCase():
                case "dex".toLowerCase():
                    Player.startClass(costMult, expMult, CONSTANTS.ClassGymDexterity);
                    break;
                case "agility".toLowerCase():
                case "agi".toLowerCase():
                    Player.startClass(costMult, expMult, CONSTANTS.ClassGymAgility);
                    break;
                default:
                    workerScript.log("gymWorkout", `Invalid stat: ${stat}.`);
                    return false;
            }
            workerScript.log("gymWorkout", `Started training ${stat} at ${gymName}`);
            return true;
        },

        travelToCity: function(cityname) {
            updateDynamicRam("travelToCity", getRamCost("travelToCity"));
            checkSingularityAccess("travelToCity", 1);

            switch(cityname) {
                case CityName.Aevum:
                case CityName.Chongqing:
                case CityName.Sector12:
                case CityName.NewTokyo:
                case CityName.Ishima:
                case CityName.Volhaven:
                    if(Player.money.lt(CONSTANTS.TravelCost)) {
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

        purchaseTor: function() {
            updateDynamicRam("purchaseTor", getRamCost("purchaseTor"));
            checkSingularityAccess("purchaseTor", 1);

            if (SpecialServerIps["Darkweb Server"] != null) {
                workerScript.log("purchaseTor", "You already have a TOR router!");
                return false;
            }

            if (Player.money.lt(CONSTANTS.TorRouterCost)) {
                workerScript.log("purchaseTor", "You cannot afford to purchase a Tor router.");
                return false;
            }
            Player.loseMoney(CONSTANTS.TorRouterCost);

            var darkweb = safetlyCreateUniqueServer({
                ip: createUniqueRandomIp(), hostname:"darkweb", organizationName:"",
                isConnectedTo:false, adminRights:false, purchasedByPlayer:false, maxRam:1
            });
            AddToAllServers(darkweb);
            SpecialServerIps.addIp("Darkweb Server", darkweb.ip);

            Player.getHomeComputer().serversOnNetwork.push(darkweb.ip);
            darkweb.serversOnNetwork.push(Player.getHomeComputer().ip);
            Player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain);
            workerScript.log("purchaseTor", "You have purchased a Tor router!");
            return true;
        },
        purchaseProgram: function(programName) {
            updateDynamicRam("purchaseProgram", getRamCost("purchaseProgram"));
            checkSingularityAccess("purchaseProgram", 1);

            if (SpecialServerIps["Darkweb Server"] == null) {
                workerScript.log("purchaseProgram", "You do not have the TOR router.");
                return false;
            }

            programName = programName.toLowerCase();

            let item = null;
            for(const key in DarkWebItems) {
                const i = DarkWebItems[key];
                if(i.program.toLowerCase() == programName) {
                    item = i;
                }
            }

            if(item == null) {
                workerScript.log("purchaseProgram", `Invalid program name: '${programName}.`);
                return false;
            }

            if(Player.money.lt(item.price)) {
                workerScript.log("purchaseProgram", `Not enough money to purchase '${item.program}'. Need ${numeralWrapper.format(item.price, '$0.000a')}`);
                return false;
            }


            if(Player.hasProgram(item.program)) {
                workerScript.log("purchaseProgram", `You already have the '${item.program}' program`);
                return true;
            }

            Player.loseMoney(item.price);
            Player.getHomeComputer().programs.push(item.program);
            workerScript.log("purchaseProgram", `You have purchased the '${item.program}' program. The new program can be found on your home computer.`);
            return true;
        },
        getStats: function() {
            updateDynamicRam("getStats", getRamCost("getStats"));
            checkSingularityAccess("getStats", 1);

            return {
                hacking:        Player.hacking_skill,
                strength:       Player.strength,
                defense:        Player.defense,
                dexterity:      Player.dexterity,
                agility:        Player.agility,
                charisma:       Player.charisma,
                intelligence:   Player.intelligence
            }
        },
        getCharacterInformation: function() {
            updateDynamicRam("getCharacterInformation", getRamCost("getCharacterInformation"));
            checkSingularityAccess("getCharacterInformation", 1);

            return {
                bitnode:            Player.bitNodeN,
                city:               Player.city,
                factions:           Player.factions.slice(),
                hp:                 Player.hp,
                jobs:               Object.keys(Player.jobs),
                jobTitles:          Object.values(Player.jobs),
                maxHp:              Player.max_hp,
                mult: {
                    agility:        Player.agility_mult,
                    agilityExp:     Player.agility_exp_mult,
                    companyRep:     Player.company_rep_mult,
                    crimeMoney:     Player.crime_money_mult,
                    crimeSuccess:   Player.crime_success_mult,
                    defense:        Player.defense_mult,
                    defenseExp:     Player.defense_exp_mult,
                    dexterity:      Player.dexterity_mult,
                    dexterityExp:   Player.dexterity_exp_mult,
                    factionRep:     Player.faction_rep_mult,
                    hacking:        Player.hacking_mult,
                    hackingExp:     Player.hacking_exp_mult,
                    strength:       Player.strength_mult,
                    strengthExp:    Player.strength_exp_mult,
                    workMoney:      Player.work_money_mult,
                },
                timeWorked:         Player.timeWorked,
                tor:                SpecialServerIps.hasOwnProperty("Darkweb Server"),
                workHackExpGain:    Player.workHackExpGained,
                workStrExpGain:     Player.workStrExpGained,
                workDefExpGain:     Player.workDefExpGained,
                workDexExpGain:     Player.workDexExpGained,
                workAgiExpGain:     Player.workAgiExpGained,
                workChaExpGain:     Player.workChaExpGained,
                workRepGain:        Player.workRepGained,
                workMoneyGain:      Player.workMoneyGained,
                hackingExp:         Player.hacking_exp,
                strengthExp:        Player.strength_exp,
                defenseExp:         Player.defense_exp,
                dexterityExp:       Player.dexterity_exp,
                agilityExp:         Player.agility_exp,
                charismaExp:        Player.charisma_exp,
            };
        },
        isBusy: function() {
            updateDynamicRam("isBusy", getRamCost("isBusy"));
            checkSingularityAccess("isBusy", 1);
            return Player.isWorking || inMission;
        },
        stopAction: function() {
            updateDynamicRam("stopAction", getRamCost("stopAction"));
            checkSingularityAccess("stopAction", 1);
            if (Player.isWorking) {
                var txt = Player.singularityStopWork();
                workerScript.log("stopAction", txt);
                return true;
            }
            return false;
        },
        upgradeHomeRam: function() {
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
                workerScript.log("upgradeHomeRam", `You don't have enough money. Need ${numeralWrapper.format(cost, '$0.000a')}`);
                return false;
            }

            homeComputer.maxRam *= 2;
            Player.loseMoney(cost);

            Player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain);
            workerScript.log("upgradeHomeRam", `Purchased additional RAM for home computer! It now has ${homeComputer.maxRam}GB of RAM.`);
            return true;
        },
        getUpgradeHomeRamCost: function() {
            updateDynamicRam("getUpgradeHomeRamCost", getRamCost("getUpgradeHomeRamCost"));
            checkSingularityAccess("getUpgradeHomeRamCost", 2);

            return Player.getUpgradeHomeRamCost();
        },
        workForCompany: function(companyName) {
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

            // Cant work while in a mission
            if (inMission) {
                workerScript.log("workForCompany", "You are in the middle of a mission.");
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
                var txt = Player.singularityStopWork();
                workerScript.log("workForCompany", txt);
            }

            if (companyPosition.isPartTimeJob()) {
                Player.startWorkPartTime(companyName);
            } else {
                Player.startWork(companyName);
            }
            workerScript.log("workForCompany", `Began working at '${Player.companyName}' as a '${companyPositionName}'`);
            return true;
        },
        applyToCompany: function(companyName, field) {
            updateDynamicRam("applyToCompany", getRamCost("applyToCompany"));
            checkSingularityAccess("applyToCompany", 2);
            getCompany("applyToCompany", companyName);

            Player.location = companyName;
            var res;
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
            // The Player object's applyForJob function can return string with special error messages
            if (isString(res)) {
                workerScript.log("applyToCompany", res);
                return false;
            }
            if (res) {
                workerScript.log("applyToCompany", `You were offered a new job at '${companyName}' as a '${Player.jobs[companyName]}'`);
            } else {
                workerScript.log("applyToCompany", `You failed to get a new job/promotion at '${companyName}' in the '${field}' field.`);
            }
            return res;
        },
        getCompanyRep: function(companyName) {
            updateDynamicRam("getCompanyRep", getRamCost("getCompanyRep"));
            checkSingularityAccess("getCompanyRep", 2);
            const company = getCompany("getCompanyRep", companyName);
            return company.playerReputation;
        },
        getCompanyFavor: function(companyName) {
            updateDynamicRam("getCompanyFavor", getRamCost("getCompanyFavor"));
            checkSingularityAccess("getCompanyFavor", 2);
            const company = getCompany("getCompanyFavor", companyName);
            return company.favor;
        },
        getCompanyFavorGain: function(companyName) {
            updateDynamicRam("getCompanyFavorGain", getRamCost("getCompanyFavorGain"));
            checkSingularityAccess("getCompanyFavorGain", 2);
            const company = getCompany("getCompanyFavorGain", companyName);
            return company.getFavorGain()[0];
        },
        checkFactionInvitations: function() {
            updateDynamicRam("checkFactionInvitations", getRamCost("checkFactionInvitations"));
            checkSingularityAccess("checkFactionInvitations", 2);
            // Make a copy of Player.factionInvitations
            return Player.factionInvitations.slice();
        },
        joinFaction: function(name) {
            updateDynamicRam("joinFaction", getRamCost("joinFaction"));
            checkSingularityAccess("joinFaction", 2);
            getFaction("workForFaction", name);

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
        workForFaction: function(name, type) {
            updateDynamicRam("workForFaction", getRamCost("workForFaction"));
            checkSingularityAccess("workForFaction", 2);
            getFaction("workForFaction", name);

            // if the player is in a gang and the target faction is any of the gang faction, fail
            if(Player.inGang() && AllGangs[name] !== undefined) {
                workerScript.log("workForFaction", `Faction '${name}' does not offer work at the moment.`);
                return;
            }

            if (inMission) {
                workerScript.log("workForFaction", "You are in the middle of a mission.");
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

            var fac = Factions[name];
            // Arrays listing factions that allow each time of work
            var hackAvailable = ["Illuminati", "Daedalus", "The Covenant", "ECorp", "MegaCorp",
                                 "Bachman & Associates", "Blade Industries", "NWO", "Clarke Incorporated",
                                 "OmniTek Incorporated", "Four Sigma", "KuaiGong International",
                                 "Fulcrum Secret Technologies", "BitRunners", "The Black Hand",
                                 "NiteSec", "Chongqing", "Sector-12", "New Tokyo", "Aevum",
                                 "Ishima", "Volhaven", "Speakers for the Dead", "The Dark Army",
                                 "The Syndicate", "Silhouette", "Netburners", "Tian Di Hui", "CyberSec"];
            var fdWkAvailable = ["Illuminati", "Daedalus", "The Covenant", "ECorp", "MegaCorp",
                                 "Bachman & Associates", "Blade Industries", "NWO", "Clarke Incorporated",
                                 "OmniTek Incorporated", "Four Sigma", "KuaiGong International",
                                 "The Black Hand", "Chongqing", "Sector-12", "New Tokyo", "Aevum",
                                 "Ishima", "Volhaven", "Speakers for the Dead", "The Dark Army",
                                 "The Syndicate", "Silhouette", "Tetrads", "Slum Snakes"];
            var scWkAvailable = ["ECorp", "MegaCorp",
                                 "Bachman & Associates", "Blade Industries", "NWO", "Clarke Incorporated",
                                 "OmniTek Incorporated", "Four Sigma", "KuaiGong International",
                                 "Fulcrum Secret Technologies", "Chongqing", "Sector-12", "New Tokyo", "Aevum",
                                 "Ishima", "Volhaven", "Speakers for the Dead",
                                 "The Syndicate", "Tetrads", "Slum Snakes", "Tian Di Hui"];

            switch (type.toLowerCase()) {
                case "hacking":
                case "hacking contracts":
                case "hackingcontracts":
                    if (!hackAvailable.includes(fac.name)) {
                        workerScript.log("workForFaction", `Faction '${fac.name}' do not need help with hacking contracts.`);
                        return false;
                    }
                    Player.startFactionHackWork(fac);
                    workerScript.log("workForFaction", `Started carrying out hacking contracts for '${fac.name}'`);
                    return true;
                case "field":
                case "fieldwork":
                case "field work":
                    if (!fdWkAvailable.includes(fac.name)) {
                        workerScript.log("workForFaction", `Faction '${fac.name}' do not need help with field missions.`);
                        return false;
                    }
                    Player.startFactionFieldWork(fac);
                    workerScript.log("workForFaction", `Started carrying out field missions for '${fac.name}'`);
                    return true;
                case "security":
                case "securitywork":
                case "security work":
                    if (!scWkAvailable.includes(fac.name)) {
                        workerScript.log("workForFaction", `Faction '${fac.name}' do not need help with security work.`);
                        return false;
                    }
                    Player.startFactionSecurityWork(fac);
                    workerScript.log("workForFaction", `Started carrying out security work for '${fac.name}'`);
                    return true;
                default:
                    workerScript.log("workForFaction", `Invalid work type: '${type}`);
            }
            return true;
        },
        getFactionRep: function(name) {
            updateDynamicRam("getFactionRep", getRamCost("getFactionRep"));
            checkSingularityAccess("getFactionRep", 2);
            const faction = getFaction("getFactionRep", name);
            return faction.playerReputation;
        },
        getFactionFavor: function(name) {
            updateDynamicRam("getFactionFavor", getRamCost("getFactionFavor"));
            checkSingularityAccess("getFactionFavor", 2);
            const faction = getFaction("getFactionFavor", name);
            return faction.favor;
        },
        getFactionFavorGain: function(name) {
            updateDynamicRam("getFactionFavorGain", getRamCost("getFactionFavorGain"));
            checkSingularityAccess("getFactionFavorGain", 2);
            const faction = getFaction("getFactionFavorGain", name);
            return faction.getFavorGain()[0];
        },
        donateToFaction: function(name, amt) {
            updateDynamicRam("donateToFaction", getRamCost("donateToFaction"));
            checkSingularityAccess("donateToFaction", 3);
            const faction = getFaction("donateToFaction", name);

            if (typeof amt !== 'number' || amt <= 0) {
                workerScript.log("donateToFaction", `Invalid donation amount: '${amt}'.`);
                return false;
            }
            if (Player.money.lt(amt)) {
                workerScript.log("donateToFaction", `You do not have enough money to donate ${numeralWrapper.format(amt, '$0.000a')} to '${name}'`);
                return false;
            }
            const repNeededToDonate = Math.round(CONSTANTS.BaseFavorToDonate * BitNodeMultipliers.RepToDonateToFaction);
            if (faction.favor < repNeededToDonate) {
                workerScript.log("donateToFaction", `You do not have enough favor to donate to this faction. Have ${faction.favor}, need ${repNeededToDonate}`);
                return false;
            }
            const repGain = amt / CONSTANTS.DonateMoneyToRepDivisor * Player.faction_rep_mult;
            faction.playerReputation += repGain;
            Player.loseMoney(amt);
            workerScript.log("donateToFaction", `${numeralWrapper.format(amt, '$0.000a')} donated to '${name}' for ${numeralWrapper.format(repGain, '0.000a')} reputation`);
            return true;
        },
        createProgram: function(name) {
            updateDynamicRam("createProgram", getRamCost("createProgram"));
            checkSingularityAccess("createProgram", 3);

            if (inMission) {
                workerScript.log("createProgram", "You are in the middle of a mission.");
                return;
            }
            if (Player.isWorking) {
                var txt = Player.singularityStopWork();
                workerScript.log("createProgram", txt);
            }

            name = name.toLowerCase();

            let p = null;
            for (const key in Programs) {
                if(Programs[key].name.toLowerCase() == name) {
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

            if (!p.create.req(Player)) {
                workerScript.log("createProgram", `Hacking level is too low to create '${p.name}' (level ${p.create.level} req)`);
                return false
            }

            Player.startCreateProgramWork(p.name, p.create.time, p.create.level);
            workerScript.log("createProgram", `Began creating program: '${name}'`);
            return true;
        },
        commitCrime: function(crimeRoughName) {
            updateDynamicRam("commitCrime", getRamCost("commitCrime"));
            checkSingularityAccess("commitCrime", 3);
            if (inMission) {
                workerScript.log("commitCrime", "You are in the middle of a mission.");
                return;
            }
            if (Player.isWorking) {
                const txt = Player.singularityStopWork();
                workerScript.log("commitCrime", txt);
            }

            // Set Location to slums
            Player.gotoLocation(LocationName.Slums);

            const crime = findCrime(crimeRoughName.toLowerCase());
            if(crime == null) { // couldn't find crime
                throw makeRuntimeErrorMsg("commitCrime", `Invalid crime: '${crimeRoughName}'`);
            }
            workerScript.log("commitCrime", `Attempting to commit ${crime.name}...`);
            return crime.commit(Player, 1, {workerscript: workerScript});
        },
        getCrimeChance: function(crimeRoughName) {
            updateDynamicRam("getCrimeChance", getRamCost("getCrimeChance"));
            checkSingularityAccess("getCrimeChance", 3);

            const crime = findCrime(crimeRoughName.toLowerCase());
            if(crime == null) {
                throw makeRuntimeErrorMsg("getCrimeChance", `Invalid crime: ${crimeRoughName}`);
            }

            return crime.successRate(Player);
        },
        getCrimeStats: function(crimeRoughName) {
            updateDynamicRam("getCrimeStats", getRamCost("getCrimeStats"));
            checkSingularityAccess("getCrimeStats", 3);

            const crime = findCrime(crimeRoughName.toLowerCase());
            if(crime == null) {
                throw makeRuntimeErrorMsg("getCrimeStats", `Invalid crime: ${crimeRoughName}`);
            }

            return Object.assign({}, crime);
        },
        getOwnedAugmentations: function(purchased=false) {
            updateDynamicRam("getOwnedAugmentations", getRamCost("getOwnedAugmentations"));
            checkSingularityAccess("getOwnedAugmentations", 3);
            var res = [];
            for (var i = 0; i < Player.augmentations.length; ++i) {
                res.push(Player.augmentations[i].name);
            }
            if (purchased) {
                for (var i = 0; i < Player.queuedAugmentations.length; ++i) {
                    res.push(Player.queuedAugmentations[i].name);
                }
            }
            return res;
        },
        getOwnedSourceFiles: function() {
            updateDynamicRam("getOwnedSourceFiles", getRamCost("getOwnedSourceFiles"));
            checkSingularityAccess("getOwnedSourceFiles", 3);
            let res = [];
            for (let i = 0; i < Player.sourceFiles.length; ++i) {
                res.push({n: Player.sourceFiles[i].n, lvl: Player.sourceFiles[i].lvl});
            }
            return res;
        },
        getAugmentationsFromFaction: function(facname) {
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
        getAugmentationPrereq: function(name) {
            updateDynamicRam("getAugmentationPrereq", getRamCost("getAugmentationPrereq"));
            checkSingularityAccess("getAugmentationPrereq", 3);
            const aug = getAugmentation("getAugmentationPrereq", name);
            return aug.prereqs.slice();
        },
        getAugmentationCost: function(name) {
            updateDynamicRam("getAugmentationCost", getRamCost("getAugmentationCost"));
            checkSingularityAccess("getAugmentationCost", 3);
            const aug = getAugmentation("getAugmentationCost", name);
            return [aug.baseRepRequirement, aug.baseCost];
        },
        getAugmentationStats: function(name) {
            updateDynamicRam("getAugmentationStats", getRamCost("getAugmentationStats"));
            checkSingularityAccess("getAugmentationStats", 3);
            const aug = getAugmentation("getAugmentationStats", name);
            return Object.assign({}, aug.mults);
        },
        purchaseAugmentation: function(faction, name) {
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

            const isNeuroflux = (aug.name === AugmentationNames.NeuroFluxGovernor);
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
        softReset: function(cbScript) {
            updateDynamicRam("softReset", getRamCost("softReset"));
            checkSingularityAccess("softReset", 3);

            workerScript.log("softReset", "Soft resetting. This will cause this script to be killed");
            setTimeoutRef(() => {
                prestigeAugmentation(cbScript);
            }, 0);

            // Prevent workerScript from "finishing execution naturally"
            workerScript.running = false;
            killWorkerScript(workerScript);
        },
        installAugmentations: function(cbScript) {
            updateDynamicRam("installAugmentations", getRamCost("installAugmentations"));
            checkSingularityAccess("installAugmentations", 3);

            if (Player.queuedAugmentations.length === 0) {
                workerScript.log("installAugmentations", "You do not have any Augmentations to be installed.");
                return false;
            }
            Player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain);
            workerScript.log("installAugmentations", "Installing Augmentations. This will cause this script to be killed");
            setTimeoutRef(() => {
                installAugmentations(cbScript);
            }, 0);

            workerScript.running = false; // Prevent workerScript from "finishing execution naturally"
            killWorkerScript(workerScript);
        },

        // Gang API
        gang: {
            getMemberNames: function() {
                updateDynamicRam("getMemberNames", getRamCost("gang", "getMemberNames"));
                checkGangApiAccess("getMemberNames");
                return Player.gang.members.map(member => member.name);
            },
            getGangInformation: function() {
                updateDynamicRam("getGangInformation", getRamCost("gang", "getGangInformation"));
                checkGangApiAccess("getGangInformation");
                return {
                        faction:                    Player.gang.facName,
                        isHacking:                  Player.gang.isHackingGang,
                        moneyGainRate:              Player.gang.moneyGainRate,
                        power:                      Player.gang.getPower(),
                        respect:                    Player.gang.respect,
                        respectGainRate:            Player.gang.respectGainRate,
                        territory:                  Player.gang.getTerritory(),
                        territoryClashChance:       Player.gang.territoryClashChance,
                        territoryWarfareEngaged:    Player.gang.territoryWarfareEngaged,
                        wantedLevel:                Player.gang.wanted,
                        wantedLevelGainRate:        Player.gang.wantedGainRate,
                };
            },
            getOtherGangInformation: function() {
                updateDynamicRam("getOtherGangInformation", getRamCost("gang", "getOtherGangInformation"));
                checkGangApiAccess("getOtherGangInformation");
                const cpy = {};
                for (const gang in AllGangs) {
                    cpy[gang] = Object.assign({}, AllGangs[gang]);
                }

                return cpy;
            },
            getMemberInformation: function(name) {
                updateDynamicRam("getMemberInformation", getRamCost("gang", "getMemberInformation"));
                checkGangApiAccess("getMemberInformation");
                const member = getGangMember("getMemberInformation", name);
                return {
                    agility:                member.agi,
                    agilityEquipMult:       member.agi_mult,
                    agilityAscensionMult:   member.agi_asc_mult,
                    augmentations:          member.augmentations.slice(),
                    charisma:               member.cha,
                    charismaEquipMult:      member.cha_mult,
                    charismaAscensionMult:  member.cha_asc_mult,
                    defense:                member.def,
                    defenseEquipMult:       member.def_mult,
                    defenseAscensionMult:   member.def_asc_mult,
                    dexterity:              member.dex,
                    dexterityEquipMult:     member.dex_mult,
                    dexterityAscensionMult: member.dex_asc_mult,
                    equipment:              member.upgrades.slice(),
                    hacking:                member.hack,
                    hackingEquipMult:       member.hack_mult,
                    hackingAscensionMult:   member.hack_asc_mult,
                    strength:               member.str,
                    strengthEquipMult:      member.str_mult,
                    strengthAscensionMult:  member.str_asc_mult,
                    task:                   member.task,
                }
            },
            canRecruitMember: function() {
                updateDynamicRam("canRecruitMember", getRamCost("gang", "canRecruitMember"));
                checkGangApiAccess("canRecruitMember");
                return Player.gang.canRecruitMember();
            },
            recruitMember: function(name) {
                updateDynamicRam("recruitMember", getRamCost("gang", "recruitMember"));
                checkGangApiAccess("recruitMember");
                const recruited = Player.gang.recruitMember(name);
                if (recruited) {
                    workerScript.log("recruitMember", `Successfully recruited Gang Member '${name}'`);
                } else {
                    workerScript.log("recruitMember", `Failed to recruit Gang Member '${name}'`);
                }

                return recruited;
            },
            getTaskNames: function() {
                updateDynamicRam("getTaskNames", getRamCost("gang", "getTaskNames"));
                checkGangApiAccess("getTaskNames");
                const tasks = Player.gang.getAllTaskNames();
                tasks.unshift("Unassigned");
                return tasks;
            },
            setMemberTask: function(memberName, taskName) {
                updateDynamicRam("setMemberTask", getRamCost("gang", "setMemberTask"));
                checkGangApiAccess("setMemberTask");
                const member = getGangMember("setMemberTask", memberName);
                const success = member.assignToTask(taskName);
                if (success) {
                    workerScript.log("setMemberTask", `Successfully assigned Gang Member '${memberName}' to '${taskName}' task`);
                } else {
                    workerScript.log("setMemberTask", `Failed to assign Gang Member '${memberName}' to '${taskName}' task. '${memberName}' is now Unassigned`);
                }

                return success;
            },
            getTaskStats: function(taskName) {
                updateDynamicRam("getTaskStats", getRamCost("gang", "getTaskStats"));
                checkGangApiAccess("getTaskStats");
                const task = getGangTask("getTaskStats", taskName);
                const copy = Object.assign({}, task);
                copy.territory = Object.assign({}, task.territory)
                return copy;
            },
            getEquipmentNames: function() {
                updateDynamicRam("getEquipmentNames", getRamCost("gang", "getEquipmentNames"));
                checkGangApiAccess("getEquipmentNames");
                return Player.gang.getAllUpgradeNames();
            },
            getEquipmentCost: function(equipName) {
                updateDynamicRam("getEquipmentCost", getRamCost("gang", "getEquipmentCost"));
                checkGangApiAccess("getEquipmentCost");
                return Player.gang.getUpgradeCost(equipName);
            },
            getEquipmentType: function(equipName) {
                updateDynamicRam("getEquipmentType", getRamCost("gang", "getEquipmentType"));
                checkGangApiAccess("getEquipmentType");
                return Player.gang.getUpgradeType(equipName);
            },
            getEquipmentStats: function(equipName) {
                updateDynamicRam("getEquipmentStats", getRamCost("gang", "getEquipmentStats"));
                checkGangApiAccess("getEquipmentStats");
                const equipment = GangMemberUpgrades[equipName];
                if (!equipment) {
                    throw makeRuntimeErrorMsg("getEquipmentStats", `Invalid equipment: ${equipName}`);
                }
                return Object.assign({}, equipment.mults);
            },
            purchaseEquipment: function(memberName, equipName) {
                updateDynamicRam("purchaseEquipment", getRamCost("gang", "purchaseEquipment"));
                checkGangApiAccess("purchaseEquipment");
                const member = getGangMember("purchaseEquipment", memberName);
                const res = member.buyUpgrade(equipName, Player, Player.gang);
                if (res) {
                    workerScript.log("purchaseEquipment", `Purchased '${equipName}' for Gang member '${memberName}'`);
                } else {
                    workerScript.log("purchaseEquipment", `Failed to purchase '${equipName}' for Gang member '${memberName}'`);
                }

                return res;
            },
            ascendMember: function(name) {
                updateDynamicRam("ascendMember", getRamCost("gang", "ascendMember"));
                checkGangApiAccess("ascendMember");
                const member = getGangMember("ascendMember", name);
                return Player.gang.ascendMember(member, workerScript);
            },
            setTerritoryWarfare: function(engage) {
                updateDynamicRam("setTerritoryWarfare", getRamCost("gang", "setTerritoryWarfare"));
                checkGangApiAccess("setTerritoryWarfare");
                if (engage) {
                    Player.gang.territoryWarfareEngaged = true;
                    workerScript.log("setTerritoryWarfare", "Engaging in Gang Territory Warfare");
                } else {
                    Player.gang.territoryWarfareEngaged = false;
                    workerScript.log("setTerritoryWarfare", "Disengaging in Gang Territory Warfare");
                }
            },
            getChanceToWinClash: function(otherGang) {
                updateDynamicRam("getChanceToWinClash", getRamCost("gang", "getChanceToWinClash"));
                checkGangApiAccess("getChanceToWinClash");
                if (AllGangs[otherGang] == null) {
                    throw makeRuntimeErrorMsg(`gang.${getChanceToWinClash}`, `Invalid gang: ${otherGang}`);
                }

                const playerPower = AllGangs[Player.gang.facName].power;
                const otherPower = AllGangs[otherGang].power;

                return playerPower / (otherPower + playerPower);
            },
            getBonusTime: function() {
                updateDynamicRam("getBonusTime", getRamCost("gang", "getBonusTime"));
                checkGangApiAccess("getBonusTime");
                return Math.round(Player.gang.storedCycles / 5);
            },
        }, // end gang namespace

        // Bladeburner API
        bladeburner: {
            getContractNames: function() {
                updateDynamicRam("getContractNames", getRamCost("bladeburner", "getContractNames"));
                checkBladeburnerAccess("getContractNames");
                return Player.bladeburner.getContractNamesNetscriptFn();
            },
            getOperationNames: function() {
                updateDynamicRam("getOperationNames", getRamCost("bladeburner", "getOperationNames"));
                checkBladeburnerAccess("getOperationNames");
                return Player.bladeburner.getOperationNamesNetscriptFn();
            },
            getBlackOpNames: function() {
                updateDynamicRam("getBlackOpNames", getRamCost("bladeburner", "getBlackOpNames"));
                checkBladeburnerAccess("getBlackOpNames");
                return Player.bladeburner.getBlackOpNamesNetscriptFn();
            },
            getBlackOpRank: function(name="") {
                updateDynamicRam("getBlackOpRank", getRamCost("bladeburner", "getBlackOpRank"));
                checkBladeburnerAccess("getBlackOpRank");
                const action = getBladeburnerActionObject("getBlackOpRank", "blackops", name);
                return action.reqdRank;
            },
            getGeneralActionNames: function() {
                updateDynamicRam("getGeneralActionNames", getRamCost("bladeburner", "getGeneralActionNames"));
                checkBladeburnerAccess("getGeneralActionNames");
                return Player.bladeburner.getGeneralActionNamesNetscriptFn();
            },
            getSkillNames: function() {
                updateDynamicRam("getSkillNames", getRamCost("bladeburner", "getSkillNames"));
                checkBladeburnerAccess("getSkillNames");
                return Player.bladeburner.getSkillNamesNetscriptFn();
            },
            startAction: function(type="", name="") {
                updateDynamicRam("startAction", getRamCost("bladeburner", "startAction"));
                checkBladeburnerAccess("startAction");
                try {
                    return Player.bladeburner.startActionNetscriptFn(type, name, workerScript);
                } catch(e) {
                    throw makeRuntimeErrorMsg("bladeburner.startAction", e);
                }
            },
            stopBladeburnerAction: function() {
                updateDynamicRam("stopBladeburnerAction", getRamCost("bladeburner", "stopBladeburnerAction"));
                checkBladeburnerAccess("stopBladeburnerAction");
                return Player.bladeburner.resetAction();
            },
            getCurrentAction: function() {
                updateDynamicRam("getCurrentAction", getRamCost("bladeburner", "getCurrentAction"));
                checkBladeburnerAccess("getCurrentAction");
                return Player.bladeburner.getTypeAndNameFromActionId(Player.bladeburner.action);
            },
            getActionTime: function(type="", name="") {
                updateDynamicRam("getActionTime", getRamCost("bladeburner", "getActionTime"));
                checkBladeburnerAccess("getActionTime");
                try {
                    return Player.bladeburner.getActionTimeNetscriptFn(type, name, workerScript);
                } catch(e) {
                    throw makeRuntimeErrorMsg("bladeburner.getActionTime", e);
                }
            },
            getActionEstimatedSuccessChance: function(type="", name="") {
                updateDynamicRam("getActionEstimatedSuccessChance", getRamCost("bladeburner", "getActionEstimatedSuccessChance"));
                checkBladeburnerAccess("getActionEstimatedSuccessChance");
                try {
                    return Player.bladeburner.getActionEstimatedSuccessChanceNetscriptFn(type, name, workerScript);
                } catch(e) {
                    throw makeRuntimeErrorMsg("bladeburner.getActionEstimatedSuccessChance", e);
                }
            },
            getActionRepGain: function(type="", name="", level) {
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
            getActionCountRemaining: function(type="", name="") {
                updateDynamicRam("getActionCountRemaining", getRamCost("bladeburner", "getActionCountRemaining"));
                checkBladeburnerAccess("getActionCountRemaining");
                try {
                    return Player.bladeburner.getActionCountRemainingNetscriptFn(type, name, workerScript);
                } catch(e) {
                    throw makeRuntimeErrorMsg("bladeburner.getActionCountRemaining", e);
                }
            },
            getActionMaxLevel: function(type="", name="") {
                updateDynamicRam("getActionMaxLevel", getRamCost("bladeburner", "getActionMaxLevel"));
                checkBladeburnerAccess("getActionMaxLevel");
                const action = getBladeburnerActionObject("getActionMaxLevel", type, name);
                return action.maxLevel;
            },
            getActionCurrentLevel: function(type="", name="") {
                updateDynamicRam("getActionCurrentLevel", getRamCost("bladeburner", "getActionCurrentLevel"));
                checkBladeburnerAccess("getActionCurrentLevel");
                const action = getBladeburnerActionObject("getActionCurrentLevel", type, name);
                return action.level;
            },
            getActionAutolevel: function(type="", name="") {
                updateDynamicRam("getActionAutolevel", getRamCost("bladeburner", "getActionAutolevel"));
                checkBladeburnerAccess("getActionAutolevel");
                const action = getBladeburnerActionObject("getActionCurrentLevel", type, name);
                return action.autoLevel;
            },
            setActionAutolevel: function(type="", name="", autoLevel=true) {
                updateDynamicRam("setActionAutolevel", getRamCost("bladeburner", "setActionAutolevel"));
                checkBladeburnerAccess("setActionAutolevel");
                const action = getBladeburnerActionObject("getActionCurrentLevel", type, name);
                action.autoLevel = autoLevel;
            },
            setActionLevel: function(type="", name="", level=1) {
                updateDynamicRam("setActionLevel", getRamCost("bladeburner", "setActionLevel"));
                checkBladeburnerAccess("setActionLevel");
                const action = getBladeburnerActionObject("setActionLevel", type, name);
                if(level < 1 || level > action.maxLevel) {
                    throw makeRuntimeErrorMsg("bladeburner.setActionLevel", `Level must be between 1 and ${action.maxLevel}, is ${level}`)
                }
                actionObj.level = level;
            },
            getRank: function() {
                updateDynamicRam("getRank", getRamCost("bladeburner", "getRank"));
                checkBladeburnerAccess("getRank");
                return Player.bladeburner.rank;
            },
            getSkillPoints: function() {
                updateDynamicRam("getSkillPoints", getRamCost("bladeburner", "getSkillPoints"));
                checkBladeburnerAccess("getSkillPoints");
                return Player.bladeburner.skillPoints;
            },
            getSkillLevel: function(skillName="") {
                updateDynamicRam("getSkillLevel", getRamCost("bladeburner", "getSkillLevel"));
                checkBladeburnerAccess("getSkillLevel");
                try {
                    return Player.bladeburner.getSkillLevelNetscriptFn(skillName, workerScript);
                } catch(e) {
                    throw makeRuntimeErrorMsg("bladeburner.getSkillLevel", e);
                }
            },
            getSkillUpgradeCost: function(skillName="") {
                updateDynamicRam("getSkillUpgradeCost", getRamCost("bladeburner", "getSkillUpgradeCost"));
                checkBladeburnerAccess("getSkillUpgradeCost");
                try {
                    return Player.bladeburner.getSkillUpgradeCostNetscriptFn(skillName, workerScript);
                } catch(e) {
                    throw makeRuntimeErrorMsg("bladeburner.getSkillUpgradeCost", e);
                }
            },
            upgradeSkill: function(skillName) {
                updateDynamicRam("upgradeSkill", getRamCost("bladeburner", "upgradeSkill"));
                checkBladeburnerAccess("upgradeSkill");
                try {
                    return Player.bladeburner.upgradeSkillNetscriptFn(skillName, workerScript);
                } catch(e) {
                    throw makeRuntimeErrorMsg("bladeburner.upgradeSkill", e);
                }
            },
            getTeamSize: function(type="", name="") {
                updateDynamicRam("getTeamSize", getRamCost("bladeburner", "getTeamSize"));
                checkBladeburnerAccess("getTeamSize");
                try {
                    return Player.bladeburner.getTeamSizeNetscriptFn(type, name, workerScript);
                } catch(e) {
                    throw makeRuntimeErrorMsg("bladeburner.getTeamSize", e);
                }
            },
            setTeamSize: function(type="", name="", size) {
                updateDynamicRam("setTeamSize",getRamCost("bladeburner", "setTeamSize"));
                checkBladeburnerAccess("setTeamSize");
                try {
                    return Player.bladeburner.setTeamSizeNetscriptFn(type, name, size, workerScript);
                } catch(e) {
                    throw makeRuntimeErrorMsg("bladeburner.setTeamSize", e);
                }
            },
            getCityEstimatedPopulation: function(cityName) {
                updateDynamicRam("getCityEstimatedPopulation", getRamCost("bladeburner", "getCityEstimatedPopulation"));
                checkBladeburnerAccess("getCityEstimatedPopulation");
                checkBladeburnerCity("getCityEstimatedPopulation", cityName);
                return Player.bladeburner.cities[cityName].popEst;
            },
            getCityEstimatedCommunities: function(cityName) {
                updateDynamicRam("getCityEstimatedCommunities", getRamCost("bladeburner", "getCityEstimatedCommunities"));
                checkBladeburnerAccess("getCityEstimatedCommunities");
                checkBladeburnerCity("getCityEstimatedCommunities", cityName);
                return Player.bladeburner.cities[cityName].commsEst;
            },
            getCityChaos: function(cityName) {
                updateDynamicRam("getCityChaos", getRamCost("bladeburner", "getCityChaos"));
                checkBladeburnerAccess("getCityChaos");
                checkBladeburnerCity("getCityChaos", cityName);
                return Player.bladeburner.cities[cityName].chaos;
            },
            getCity: function() {
                updateDynamicRam("getCity", getRamCost("bladeburner", "getCity"));
                checkBladeburnerAccess("getCityChaos");
                return Player.bladeburner.city;
            },
            switchCity: function(cityName) {
                updateDynamicRam("switchCity", getRamCost("bladeburner", "switchCity"));
                checkBladeburnerAccess("switchCity");
                checkBladeburnerCity("switchCity", cityName);
                return Player.bladeburner.city = cityName;
            },
            getStamina: function() {
                updateDynamicRam("getStamina", getRamCost("bladeburner", "getStamina"));
                checkBladeburnerAccess("getStamina");
                return [Player.bladeburner.stamina, Player.bladeburner.maxStamina];
            },
            joinBladeburnerFaction: function() {
                updateDynamicRam("joinBladeburnerFaction", getRamCost("bladeburner", "joinBladeburnerFaction"));
                checkBladeburnerAccess("joinBladeburnerFaction");
                return Player.bladeburner.joinBladeburnerFactionNetscriptFn(workerScript);
            },
            joinBladeburnerDivision: function() {
                updateDynamicRam("joinBladeburnerDivision", getRamCost("bladeburner", "joinBladeburnerDivision"));
                checkBladeburnerAccess("joinBladeburnerDivision");
                if ((Player.bitNodeN === 7 || SourceFileFlags[7] > 0)) {
                    if (Player.bitNodeN === 8) { return false; }
                    if (Player.bladeburner instanceof Bladeburner) {
                        return true; // Already member
                    } else if (Player.strength >= 100 && Player.defense >= 100 &&
                               Player.dexterity >= 100 && Player.agility >= 100) {
                        Player.bladeburner = new Bladeburner({new:true});
                        workerScript.log("joinBladeburnerDivision", "You have been accepted into the Bladeburner division");

                        const worldHeader = document.getElementById("world-menu-header");
                        if (worldHeader instanceof HTMLElement) {
                            worldHeader.click(); worldHeader.click();
                        }

                        return true;
                    } else {
                        workerScript.log("joinBladeburnerDivision", "You do not meet the requirements for joining the Bladeburner division");
                        return false;
                    }
                }
            },
            getBonusTime: function() {
                updateDynamicRam("getBonusTime", getRamCost("bladeburner", "getBonusTime"));
                checkBladeburnerAccess("getBonusTime");
                return Math.round(Player.bladeburner.storedCycles / 5);
            }
        }, // End Bladeburner

        // Coding Contract API
        codingcontract: {
            attempt: function(answer, fn, ip=workerScript.serverIp, { returnReward } = {}) {
                updateDynamicRam("attempt", getRamCost("codingcontract", "attempt"));
                const contract = getCodingContract("attempt", ip, fn);

                // Convert answer to string. If the answer is a 2D array, then we have to
                // manually add brackets for the inner arrays
                if (is2DArray(answer)) {
                    let answerComponents = [];
                    for (let i = 0; i < answer.length; ++i) {
                        answerComponents.push(["[", answer[i].toString(), "]"].join(""));
                    }

                    answer = answerComponents.join(",");
                } else {
                    answer = String(answer);
                }

                const serv = safeGetServer(ip, "codingcontract.attempt");
                if (contract.isSolution(answer)) {
                    const reward = Player.gainCodingContractReward(contract.reward, contract.getDifficulty());
                    workerScript.log("attempt", `Successfully completed Coding Contract '${fn}'. Reward: ${reward}`);
                    serv.removeContract(fn);
                    return returnReward ? reward : true;
                } else {
                    ++contract.tries;
                    if (contract.tries >= contract.getMaxNumTries()) {
                        workerScript.log("attempt", `Coding Contract attempt '${fn}' failed. Contract is now self-destructing`);
                        serv.removeContract(fn);
                    } else {
                        workerScript.log("attempt", `Coding Contract attempt '${fn}' failed. ${contract.getMaxNumTries() - contract.tries} attempts remaining.`);
                    }

                    return returnReward ? "" : false;
                }
            },
            getContractType: function(fn, ip=workerScript.serverIp) {
                updateDynamicRam("getContractType", getRamCost("codingcontract", "getContractType"));
                const contract = getCodingContract("getContractType", ip, fn);
                return contract.getType();
            },
            getData: function(fn, ip=workerScript.serverIp) {
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
            getDescription: function(fn, ip=workerScript.serverIp) {
                updateDynamicRam("getDescription", getRamCost("codingcontract", "getDescription"));
                const contract = getCodingContract("getDescription", ip, fn);
                return contract.getDescription();
            },
            getNumTriesRemaining: function(fn, ip=workerScript.serverIp) {
                updateDynamicRam("getNumTriesRemaining", getRamCost("codingcontract", "getNumTriesRemaining"));
                const contract = getCodingContract("getNumTriesRemaining", ip, fn);
                return contract.getMaxNumTries() - contract.tries;
            },
        }, // End coding contracts

        // Duplicate Sleeve API
        sleeve: {
            getNumSleeves: function() {
                updateDynamicRam("getNumSleeves", getRamCost("sleeve", "getNumSleeves"));
                checkSleeveAPIAccess("getNumSleeves");
                return Player.sleeves.length;
            },
            setToShockRecovery: function(sleeveNumber=0) {
                updateDynamicRam("setToShockRecovery", getRamCost("sleeve", "setToShockRecovery"));
                checkSleeveAPIAccess("setToShockRecovery");
                checkSleeveNumber("setToShockRecovery", sleeveNumber);
                return Player.sleeves[sleeveNumber].shockRecovery(Player);
            },
            setToSynchronize: function(sleeveNumber=0) {
                updateDynamicRam("setToSynchronize", getRamCost("sleeve", "setToSynchronize"));
                checkSleeveAPIAccess("setToSynchronize");
                checkSleeveNumber("setToSynchronize", sleeveNumber);
                return Player.sleeves[sleeveNumber].synchronize(Player);
            },
            setToCommitCrime: function(sleeveNumber=0, crimeName="") {
                updateDynamicRam("setToCommitCrime", getRamCost("sleeve", "setToCommitCrime"));
                checkSleeveAPIAccess("setToCommitCrime");
                checkSleeveNumber("setToCommitCrime", sleeveNumber);
                return Player.sleeves[sleeveNumber].commitCrime(Player, crimeName);
            },
            setToUniversityCourse: function(sleeveNumber=0, universityName="", className="") {
                updateDynamicRam("setToUniversityCourse", getRamCost("sleeve", "setToUniversityCourse"));
                checkSleeveAPIAccess("setToUniversityCourse");
                checkSleeveNumber("setToUniversityCourse", sleeveNumber);
                return Player.sleeves[sleeveNumber].takeUniversityCourse(Player, universityName, className);
            },
            travel: function(sleeveNumber=0, cityName="") {
                updateDynamicRam("travel", getRamCost("sleeve", "travel"));
                checkSleeveAPIAccess("travel");
                checkSleeveNumber("travel", sleeveNumber);
                return Player.sleeves[sleeveNumber].travel(Player, cityName);
            },
            setToCompanyWork: function(sleeveNumber=0, companyName="") {
                updateDynamicRam("setToCompanyWork", getRamCost("sleeve", "setToCompanyWork"));
                checkSleeveAPIAccess("setToCompanyWork");
                checkSleeveNumber("setToCompanyWork", sleeveNumber);

                // Cannot work at the same company that another sleeve is working at
                for (let i = 0; i < Player.sleeves.length; ++i) {
                    if (i === sleeveNumber) { continue; }
                    const other = Player.sleeves[i];
                    if (other.currentTask === SleeveTaskType.Company && other.currentTaskLocation === companyName) {
                        throw makeRuntimeErrorMsg("sleeve.setToFactionWork", `Sleeve ${sleeveNumber} cannot work for company ${companyName} because Sleeve ${i} is already working for them.`)
                    }
                }

                return Player.sleeves[sleeveNumber].workForCompany(Player, companyName);
            },
            setToFactionWork: function(sleeveNumber=0, factionName="", workType="") {
                updateDynamicRam("setToFactionWork", getRamCost("sleeve", "setToFactionWork"));
                checkSleeveAPIAccess("setToFactionWork");
                checkSleeveNumber("setToFactionWork", sleeveNumber);

                // Cannot work at the same faction that another sleeve is working at
                for (let i = 0; i < Player.sleeves.length; ++i) {
                    if (i === sleeveNumber) { continue; }
                    const other = Player.sleeves[i];
                    if (other.currentTask === SleeveTaskType.Faction && other.currentTaskLocation === factionName) {
                        throw makeRuntimeErrorMsg("sleeve.setToFactionWork", `Sleeve ${sleeveNumber} cannot work for faction ${factionName} because Sleeve ${i} is already working for them.`)
                    }
                }

                return Player.sleeves[sleeveNumber].workForFaction(Player, factionName, workType);
            },
            setToGymWorkout: function(sleeveNumber=0, gymName="", stat="") {
                updateDynamicRam("setToGymWorkout", getRamCost("sleeve", "setToGymWorkout"));
                checkSleeveAPIAccess("setToGymWorkout");
                checkSleeveNumber("setToGymWorkout", sleeveNumber);

                return Player.sleeves[sleeveNumber].workoutAtGym(Player, gymName, stat);
            },
            getSleeveStats: function(sleeveNumber=0) {
                updateDynamicRam("getSleeveStats", getRamCost("sleeve", "getSleeveStats"));
                checkSleeveAPIAccess("getSleeveStats");
                checkSleeveNumber("getSleeveStats", sleeveNumber);

                const sl = Player.sleeves[sleeveNumber];
                return {
                    shock: 100 - sl.shock,
                    sync: sl.sync,
                    hacking_skill: sl.hacking_skill,
                    strength: sl.strength,
                    defense: sl.defense,
                    dexterity: sl.dexterity,
                    agility: sl.agility,
                    charisma: sl.charisma,
                };
            },
            getTask: function(sleeveNumber=0) {
                updateDynamicRam("getTask", getRamCost("sleeve", "getTask"));
                checkSleeveAPIAccess("getTask");
                checkSleeveNumber("getTask", sleeveNumber);

                const sl = Player.sleeves[sleeveNumber];
                return {
                    task:            SleeveTaskType[sl.currentTask],
                    crime:           sl.crimeType,
                    location:        sl.currentTaskLocation,
                    gymStatType:     sl.gymStatType,
                    factionWorkType: FactionWorkType[sl.factionWorkType],
                };
            },
            getInformation: function(sleeveNumber=0) {
                updateDynamicRam("getInformation", getRamCost("sleeve", "getInformation"));
                checkSleeveAPIAccess("getInformation");
                checkSleeveNumber("getInformation", sleeveNumber);

                const sl = Player.sleeves[sleeveNumber];
                return {
                    city:     sl.city,
                    hp:       sl.hp,
                    jobs:     Object.keys(Player.jobs), // technically sleeves have the same jobs as the player.
                    jobTitle: Object.values(Player.jobs),
                    maxHp:    sl.max_hp,
                    tor:      SpecialServerIps.hasOwnProperty("Darkweb Server"), // There's no reason not to give that infomation here as well. Worst case scenario it isn't used.

                    mult: {
                        agility:      sl.agility_mult,
                        agilityExp:   sl.agility_exp_mult,
                        companyRep:   sl.company_rep_mult,
                        crimeMoney:   sl.crime_money_mult,
                        crimeSuccess: sl.crime_success_mult,
                        defense:      sl.defense_mult,
                        defenseExp:   sl.defense_exp_mult,
                        dexterity:    sl.dexterity_mult,
                        dexterityExp: sl.dexterity_exp_mult,
                        factionRep:   sl.faction_rep_mult,
                        hacking:      sl.hacking_mult,
                        hackingExp:   sl.hacking_exp_mult,
                        strength:     sl.strength_mult,
                        strengthExp:  sl.strength_exp_mult,
                        workMoney:    sl.work_money_mult,
                    },

                    timeWorked: sl.currentTaskTime,
                    earningsForSleeves : {
                            workHackExpGain: sl.earningsForSleeves.hack,
                            workStrExpGain:  sl.earningsForSleeves.str,
                            workDefExpGain:  sl.earningsForSleeves.def,
                            workDexExpGain:  sl.earningsForSleeves.dex,
                            workAgiExpGain:  sl.earningsForSleeves.agi,
                            workChaExpGain:  sl.earningsForSleeves.cha,
                            workMoneyGain:   sl.earningsForSleeves.money,
                    },
                    earningsForPlayer : {
                            workHackExpGain: sl.earningsForPlayer.hack,
                            workStrExpGain:  sl.earningsForPlayer.str,
                            workDefExpGain:  sl.earningsForPlayer.def,
                            workDexExpGain:  sl.earningsForPlayer.dex,
                            workAgiExpGain:  sl.earningsForPlayer.agi,
                            workChaExpGain:  sl.earningsForPlayer.cha,
                            workMoneyGain:   sl.earningsForPlayer.money,
                    },
                    earningsForTask : {
                            workHackExpGain: sl.earningsForTask.hack,
                            workStrExpGain:  sl.earningsForTask.str,
                            workDefExpGain:  sl.earningsForTask.def,
                            workDexExpGain:  sl.earningsForTask.dex,
                            workAgiExpGain:  sl.earningsForTask.agi,
                            workChaExpGain:  sl.earningsForTask.cha,
                            workMoneyGain:   sl.earningsForTask.money,
                    },
                    workRepGain:     sl.getRepGain(Player),
                }
            },
            getSleeveAugmentations: function(sleeveNumber=0) {
                updateDynamicRam("getSleeveAugmentations", getRamCost("sleeve", "getSleeveAugmentations"));
                checkSleeveAPIAccess("getSleeveAugmentations");
                checkSleeveNumber("getSleeveAugmentations", sleeveNumber);

                const augs = [];
                for (let i = 0; i < Player.sleeves[sleeveNumber].augmentations.length; i++) {
                    augs.push(Player.sleeves[sleeveNumber].augmentations[i].name);
                }
                return augs;
            },
            getSleevePurchasableAugs: function(sleeveNumber=0) {
                updateDynamicRam("getSleevePurchasableAugs", getRamCost("sleeve", "getSleevePurchasableAugs"));
                checkSleeveAPIAccess("getSleevePurchasableAugs");
                checkSleeveNumber("getSleevePurchasableAugs", sleeveNumber);

                const purchasableAugs = findSleevePurchasableAugs(Player.sleeves[sleeveNumber], Player);
                const augs = [];
                for (let i = 0; i < purchasableAugs.length; i++) {
                    const aug = purchasableAugs[i];
                    augs.push({
                        name: aug.name,
                        cost: aug.startingCost,
                    });
                }

                return augs;
            },
            purchaseSleeveAug: function(sleeveNumber=0, augName="") {
                updateDynamicRam("purchaseSleeveAug", getRamCost("sleeve", "purchaseSleeveAug"));
                checkSleeveAPIAccess("purchaseSleeveAug");
                checkSleeveNumber("purchaseSleeveAug", sleeveNumber);

                const aug = Augmentations[augName];
                if (!aug) {
                    throw makeRuntimeErrorMsg("sleeve.purchaseSleeveAug", `Invalid aug: ${augName}`)
                }

                return Player.sleeves[sleeveNumber].tryBuyAugmentation(Player, aug);
            }
        }, // End sleeve
        heart: {
            // Easter egg function
            break: function() {
                return Player.karma;
            }
        },
        exploit: function() {
            Player.giveExploit(Exploit.UndocumentedFunctionCall);
        }
    } // End return
} // End NetscriptFunction()

export { NetscriptFunctions };
