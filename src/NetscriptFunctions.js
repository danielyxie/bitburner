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
import { AllGangs } from "./Gang";
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
import { HacknetServer } from "./Hacknet/HacknetServer";
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
    unknownBladeburnerActionErrorMessage,
    unknownBladeburnerExceptionMessage,
    checkBladeburnerAccess
} from "./NetscriptBladeburner";
import * as nsGang from "./NetscriptGang";
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

import { Page, routing } from "./ui/navigationTracking";
import { numeralWrapper } from "./ui/numeralFormat";
import { post } from "./ui/postToTerminal";
import { setTimeoutRef } from "./utils/SetTimeoutRef";
import { is2DArray } from "./utils/helpers/is2DArray";

import { dialogBoxCreate } from "../utils/DialogBox";
import { isPowerOfTwo } from "../utils/helpers/isPowerOfTwo";
import { arrayToString } from "../utils/helpers/arrayToString";
import { formatNumber, isHTML } from "../utils/StringHelperFunctions";
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
     * @param {string} Hostname or IP of the server
     * @param {string} callingFnName - Name of calling function. For logging purposes
     * @returns {Server} The specified Server
     */
    const safeGetServer = function(ip, callingFnName="") {
        var server = getServer(ip);
        if (server == null) {
            workerScript.log(`ERROR: Invalid IP or hostname passed into ${callingFnName}()`);
            throw makeRuntimeRejectMsg(workerScript, `Invalid IP or hostname passed into ${callingFnName}() function`);
        }
        return server;
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
            workerScript.log(`ERROR: ${callingFn}() failed because it does not work on Hacknet Servers`);
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

    const getCodingContract = function(fn, ip) {
        var server = safeGetServer(ip, "getCodingContract");
        return server.getContract(fn);
    }

    return {
        hacknet : {
            numNodes : function() {
                return Player.hacknetNodes.length;
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
                    name:               node.name,
                    level:              node.level,
                    ram:                hasUpgraded ? node.maxRam : node.ram,
                    cores:              node.cores,
                    production:         hasUpgraded ? node.hashRate : node.moneyGainRatePerSecond,
                    timeOnline:         node.onlineTimeSeconds,
                    totalProduction:    hasUpgraded ? node.totalHashesGenerated : node.totalMoneyGenerated,
                };

                if (hasUpgraded) {
                    res.cache = node.cache;
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
                throw makeRuntimeRejectMsg(workerScript, 'Invalid IP or hostname passed into scan() command');
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
            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.scan == null) {
                workerScript.scriptRef.log('scan() returned ' + server.serversOnNetwork.length + ' connections for ' + server.hostname);
            }
            return out;
        },
        hack : function(ip, { threads: requestedThreads, stock } = {}){
            updateDynamicRam("hack", getRamCost("hack"));
            if (ip === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "Hack() call has incorrect number of arguments. Takes 1 argument");
            }
            const threads = resolveNetscriptRequestedThreads(workerScript, "hack", requestedThreads);
            const server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("hack() error. Invalid IP or hostname passed in: " + ip + ". Stopping...");
                throw makeRuntimeRejectMsg(workerScript, "hack() error. Invalid IP or hostname passed in: " + ip + ". Stopping...");
            }

            // Calculate the hacking time
            var hackingTime = calculateHackingTime(server); // This is in seconds

            // No root access or skill level too low
            const canHack = netscriptCanHack(server, Player);
            if (!canHack.res) {
                workerScript.scriptRef.log(`ERROR: ${canHack.msg}`);
                throw makeRuntimeRejectMsg(workerScript, canHack.msg);
            }

            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.hack == null) {
                workerScript.scriptRef.log("Attempting to hack " + ip + " in " + hackingTime.toFixed(3) + " seconds (t=" + threads + ")");
            }

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
                    if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.hack == null) {
                        workerScript.scriptRef.log("Script SUCCESSFULLY hacked " + server.hostname + " for $" + formatNumber(moneyGained, 2) + " and " + formatNumber(expGainedOnSuccess, 4) +  " exp (t=" + threads + ")");
                    }
                    server.fortify(CONSTANTS.ServerFortifyAmount * Math.min(threads, maxThreadNeeded));
                    if (stock) {
                        influenceStockThroughServerHack(server, moneyGained);
                    }
                    return Promise.resolve(moneyGained);
                } else {
                    // Player only gains 25% exp for failure?
                    Player.gainHackingExp(expGainedOnFailure);
                    workerScript.scriptRef.onlineExpGained += expGainedOnFailure;
                    if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.hack == null) {
                        workerScript.scriptRef.log("Script FAILED to hack " + server.hostname + ". Gained " + formatNumber(expGainedOnFailure, 4) + " exp (t=" + threads + ")");
                    }
                    return Promise.resolve(0);
                }
            });
        },
        hackAnalyzeThreads : function(ip, hackAmount) {
            updateDynamicRam("hackAnalyzeThreads", getRamCost("hackAnalyzeThreads"));

            // Check argument validity
            const server = safeGetServer(ip, 'hackAnalyzeThreads');
            if (isNaN(hackAmount)) {
                throw makeRuntimeRejectMsg(workerScript, `Invalid growth argument passed into hackAnalyzeThreads: ${hackAmount}. Must be numeric`);
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
                throw makeRuntimeRejectMsg(workerScript, "sleep() call has incorrect number of arguments. Takes 1 argument");
            }
            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.sleep == null) {
                workerScript.scriptRef.log("Sleeping for " + time + " milliseconds");
            }
            return netscriptDelay(time, workerScript).then(function() {
                return Promise.resolve(true);
            });
        },
        grow : function(ip, { threads: requestedThreads, stock } = {}){
            updateDynamicRam("grow", getRamCost("grow"));
            const threads = resolveNetscriptRequestedThreads(workerScript, "grow", requestedThreads);
            if (ip === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "grow() call has incorrect number of arguments. Takes 1 argument");
            }
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("Cannot grow(). Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "Cannot grow(). Invalid IP or hostname passed in: " + ip);
            }

            // No root access or skill level too low
            const canHack = netscriptCanGrow(server);
            if (!canHack.res) {
                workerScript.scriptRef.log(`ERROR: ${canHack.msg}`);
                throw makeRuntimeRejectMsg(workerScript, canHack.msg);
            }

            var growTime = calculateGrowTime(server);
            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.grow == null) {
                workerScript.scriptRef.log("Executing grow() on server " + server.hostname + " in " + formatNumber(growTime, 3) + " seconds (t=" + threads + ")");
            }
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
                if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.grow == null) {
                    workerScript.scriptRef.log("Available money on " + server.hostname + " grown by " +
                                                formatNumber((moneyAfter/moneyBefore)*100 - 100, 6) + "%. Gained " +
                                                formatNumber(expGain, 4) + " hacking exp (t=" + threads +")");
                }
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
            if (isNaN(growth)) {
                throw makeRuntimeRejectMsg(workerScript, `Invalid growth argument passed into growthAnalyze: ${growth}. Must be numeric`);
            }

            return numCycleForGrowth(server, Number(growth), Player);
        },
        weaken : function(ip, { threads: requestedThreads } = {}) {
            updateDynamicRam("weaken", getRamCost("weaken"));
            var threads = resolveNetscriptRequestedThreads(workerScript, "weaken", requestedThreads)
            if (ip === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "weaken() call has incorrect number of arguments. Takes 1 argument");
            }
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("Cannot weaken(). Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "Cannot weaken(). Invalid IP or hostname passed in: " + ip);
            }

            // No root access or skill level too low
            const canHack = netscriptCanWeaken(server);
            if (!canHack.res) {
                workerScript.scriptRef.log(`ERROR: ${canHack.msg}`);
                throw makeRuntimeRejectMsg(workerScript, canHack.msg);
            }

            var weakenTime = calculateWeakenTime(server);
            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.weaken == null) {
                workerScript.scriptRef.log("Executing weaken() on server " + server.hostname + " in " +
                                           formatNumber(weakenTime, 3) + " seconds (t=" + threads + ")");
            }
            return netscriptDelay(weakenTime * 1000, workerScript).then(function() {
                if (workerScript.env.stopFlag) {return Promise.reject(workerScript);}
                server.weaken(CONSTANTS.ServerWeakenAmount * threads);
                workerScript.scriptRef.recordWeaken(server.ip, threads);
                var expGain = calculateHackingExpGain(server) * threads;
                if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.weaken == null) {
                    workerScript.scriptRef.log("Server security level on " + server.hostname + " weakened to " + server.hackDifficulty +
                                               ". Gained " + formatNumber(expGain, 4) + " hacking exp (t=" + threads + ")");
                }
                workerScript.scriptRef.onlineExpGained += expGain;
                Player.gainHackingExp(expGain);
                return Promise.resolve(CONSTANTS.ServerWeakenAmount * threads);
            });
        },
        print: function(args){
            if (args === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "print() call has incorrect number of arguments. Takes 1 argument");
            }
            workerScript.scriptRef.log(args.toString());
        },
        tprint: function(args) {
            if (args === undefined || args == null) {
                throw makeRuntimeRejectMsg(workerScript, "tprint() call has incorrect number of arguments. Takes 1 argument");
            }
            var x = args.toString();
            post(workerScript.scriptRef.filename + ": " + args.toString());
        },
        clearLog: function() {
            workerScript.scriptRef.clearLog();
        },
        disableLog: function(fn) {
            if (possibleLogs[fn]===undefined) {
                throw makeRuntimeRejectMsg(workerScript, "Invalid argument to disableLog: "+fn);
            }
            workerScript.disableLogs[fn] = true;
            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.disableLog == null) {
                workerScript.scriptRef.log("Disabled logging for " + fn);
            }
        },
        enableLog: function(fn) {
            if (possibleLogs[fn]===undefined) {
                throw makeRuntimeRejectMsg(workerScript, "Invalid argument to enableLog: "+fn);
            }
            delete workerScript.disableLogs[fn];
            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.enableLog == null) {
                workerScript.scriptRef.log("Enabled logging for " + fn);
            }
        },
        isLogEnabled : function(fn) {
            if (possibleLogs[fn] === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "Invalid argument to isLogEnabled: " + fn);
            }
            return workerScript.disableLogs[fn] ? false : true;
        },
        getScriptLogs: function(fn, ip) {
            if (fn != null && typeof fn === 'string') {
                // Get Logs of another script
                if (ip == null) { ip = workerScript.serverIp; }
                const server = getServer(ip);
                if (server == null) {
                    workerScript.log(`getScriptLogs() failed. Invalid IP or hostname passed in: ${ip}`);
                    throw makeRuntimeRejectMsg(workerScript, `getScriptLogs() failed. Invalid IP or hostname passed in: ${ip}`);
                }

                let argsForTarget = [];
                for (let i = 2; i < arguments.length; ++i) {
                    argsForTarget.push(arguments[i]);
                }
                const runningScriptObj = findRunningScript(fn, argsForTarget, server);
                if (runningScriptObj == null) {
                    workerScript.scriptRef.log(`getScriptLogs() failed. No such script ${fn} on ${server.hostname} with args: ${arrayToString(argsForTarget)}`);
                    return "";
                }
                return runningScriptObj.logs.slice();
            }

            return workerScript.scriptRef.logs.slice();
        },
        nuke: function(ip){
            updateDynamicRam("nuke", getRamCost("nuke"));
            if (ip === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "Program call has incorrect number of arguments. Takes 1 argument");
            }
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("Cannot call nuke(). Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "Cannot call nuke(). Invalid IP or hostname passed in: " + ip);
            }
            if (!Player.hasProgram(Programs.NukeProgram.name)) {
                throw makeRuntimeRejectMsg(workerScript, "You do not have the NUKE.exe virus!");
            }
            if (server.openPortCount < server.numOpenPortsRequired) {
                throw makeRuntimeRejectMsg(workerScript, "Not enough ports opened to use NUKE.exe virus");
            }
            if (server.hasAdminRights) {
                if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.nuke == null) {
                    workerScript.scriptRef.log("Already have root access to " + server.hostname);
                }
            } else {
                server.hasAdminRights = true;
                if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.nuke == null) {
                    workerScript.scriptRef.log("Executed NUKE.exe virus on " + server.hostname + " to gain root access");
                }
            }
            return true;
        },
        brutessh: function(ip){
            updateDynamicRam("brutessh", getRamCost("brutessh"));
            if (ip === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "Program call has incorrect number of arguments. Takes 1 argument");
            }
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("Cannot call brutessh(). Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "Cannot call brutessh(). Invalid IP or hostname passed in: " + ip);
            }
            if (!Player.hasProgram(Programs.BruteSSHProgram.name)) {
                workerScript.scriptRef.log("You do not have the BruteSSH.exe program!");
                throw makeRuntimeRejectMsg(workerScript, "You do not have the BruteSSH.exe program!");
            }
            if (!server.sshPortOpen) {
                if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.brutessh == null) {
                    workerScript.scriptRef.log("Executed BruteSSH.exe on " + server.hostname + " to open SSH port (22)");
                }
                server.sshPortOpen = true;
                ++server.openPortCount;
            } else {
                if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.brutessh == null) {
                    workerScript.scriptRef.log("SSH Port (22) already opened on " + server.hostname);
                }
            }
            return true;
        },
        ftpcrack: function(ip) {
            updateDynamicRam("ftpcrack", getRamCost("ftpcrack"));
            if (ip === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "Program call has incorrect number of arguments. Takes 1 argument");
            }
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("Cannot call ftpcrack(). Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "Cannot call ftpcrack(). Invalid IP or hostname passed in: " + ip);
            }
            if (!Player.hasProgram(Programs.FTPCrackProgram.name)) {
                throw makeRuntimeRejectMsg(workerScript, "You do not have the FTPCrack.exe program!");
            }
            if (!server.ftpPortOpen) {
                if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.ftpcrack == null) {
                    workerScript.scriptRef.log("Executed FTPCrack.exe on " + server.hostname + " to open FTP port (21)");
                }
                server.ftpPortOpen = true;
                ++server.openPortCount;
            } else {
                if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.ftpcrack == null) {
                    workerScript.scriptRef.log("FTP Port (21) already opened on " + server.hostname);
                }
            }
            return true;
        },
        relaysmtp: function(ip) {
            updateDynamicRam("relaysmtp", getRamCost("relaysmtp"));
            if (ip === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "Program call has incorrect number of arguments. Takes 1 argument");
            }
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("Cannot call relaysmtp(). Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "Cannot call relaysmtp(). Invalid IP or hostname passed in: " + ip);
            }
            if (!Player.hasProgram(Programs.RelaySMTPProgram.name)) {
                throw makeRuntimeRejectMsg(workerScript, "You do not have the relaySMTP.exe program!");
            }
            if (!server.smtpPortOpen) {
                if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.relaysmtp == null) {
                    workerScript.scriptRef.log("Executed relaySMTP.exe on " + server.hostname + " to open SMTP port (25)");
                }
                server.smtpPortOpen = true;
                ++server.openPortCount;
            } else {
                if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.relaysmtp == null) {
                    workerScript.scriptRef.log("SMTP Port (25) already opened on " + server.hostname);
                }
            }
            return true;
        },
        httpworm: function(ip) {
            updateDynamicRam("httpworm", getRamCost("httpworm"));
            if (ip === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "Program call has incorrect number of arguments. Takes 1 argument");
            }
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("Cannot call httpworm(). Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "Cannot call httpworm(). Invalid IP or hostname passed in: " + ip);
            }
            if (!Player.hasProgram(Programs.HTTPWormProgram.name)) {
                throw makeRuntimeRejectMsg(workerScript, "You do not have the HTTPWorm.exe program!");
            }
            if (!server.httpPortOpen) {
                if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.httpworm == null) {
                    workerScript.scriptRef.log("Executed HTTPWorm.exe on " + server.hostname + " to open HTTP port (80)");
                }
                server.httpPortOpen = true;
                ++server.openPortCount;
            } else {
                if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.httpworm == null) {
                    workerScript.scriptRef.log("HTTP Port (80) already opened on " + server.hostname);
                }
            }
            return true;
        },
        sqlinject: function(ip) {
            updateDynamicRam("sqlinject", getRamCost("sqlinject"));
            if (ip === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "Program call has incorrect number of arguments. Takes 1 argument");
            }
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("Cannot call sqlinject(). Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "Cannot call sqlinject(). Invalid IP or hostname passed in: " + ip);
            }
            if (!Player.hasProgram(Programs.SQLInjectProgram.name)) {
                throw makeRuntimeRejectMsg(workerScript, "You do not have the SQLInject.exe program!");
            }
            if (!server.sqlPortOpen) {
                if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.sqlinject == null) {
                    workerScript.scriptRef.log("Executed SQLInject.exe on " + server.hostname + " to open SQL port (1433)");
                }
                server.sqlPortOpen = true;
                ++server.openPortCount;
            } else {
                if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.sqlinject == null) {
                    workerScript.scriptRef.log("SQL Port (1433) already opened on " + server.hostname);
                }
            }
            return true;
        },
        run: function(scriptname,threads = 1) {
            updateDynamicRam("run", getRamCost("run"));
            if (scriptname === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "run() call has incorrect number of arguments. Usage: run(scriptname, [numThreads], [arg1], [arg2]...)");
            }
            if (isNaN(threads) || threads <= 0) {
                throw makeRuntimeRejectMsg(workerScript, "Invalid argument for thread count passed into run(). Must be numeric and greater than 0");
            }
            var argsForNewScript = [];
            for (var i = 2; i < arguments.length; ++i) {
                argsForNewScript.push(arguments[i]);
            }
            var scriptServer = getServer(workerScript.serverIp);
            if (scriptServer == null) {
                throw makeRuntimeRejectMsg(workerScript, "Could not find server. This is a bug in the game. Report to game dev");
            }

            return runScriptFromScript(scriptServer, scriptname, argsForNewScript, workerScript, threads);
        },
        exec: function(scriptname, ip, threads = 1) {
            updateDynamicRam("exec", getRamCost("exec"));
            if (scriptname === undefined || ip === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "exec() call has incorrect number of arguments. Usage: exec(scriptname, server, [numThreads], [arg1], [arg2]...)");
            }
            if (isNaN(threads) || threads <= 0) {
                throw makeRuntimeRejectMsg(workerScript, "Invalid argument for thread count passed into exec(). Must be numeric and greater than 0");
            }
            var argsForNewScript = [];
            for (var i = 3; i < arguments.length; ++i) {
                argsForNewScript.push(arguments[i]);
            }
            var server = getServer(ip);
            if (server == null) {
                throw makeRuntimeRejectMsg(workerScript, "Invalid hostname/ip passed into exec() command: " + ip);
            }
            return runScriptFromScript(server, scriptname, argsForNewScript, workerScript, threads);
        },
        spawn: function(scriptname, threads) {
            updateDynamicRam("spawn", getRamCost("spawn"));
            if (scriptname == null || threads == null) {
                throw makeRuntimeRejectMsg(workerScript, "Invalid scriptname or numThreads argument passed to spawn()");
            }
            setTimeoutRef(() => {
                if (scriptname === undefined) {
                    throw makeRuntimeRejectMsg(workerScript, "spawn() call has incorrect number of arguments. Usage: spawn(scriptname, numThreads, [arg1], [arg2]...)");
                }
                if (isNaN(threads) || threads <= 0) {
                    throw makeRuntimeRejectMsg(workerScript, "Invalid argument for thread count passed into run(). Must be numeric and greater than 0");
                }
                var argsForNewScript = [];
                for (var i = 2; i < arguments.length; ++i) {
                    argsForNewScript.push(arguments[i]);
                }
                var scriptServer = getServer(workerScript.serverIp);
                if (scriptServer == null) {
                    throw makeRuntimeRejectMsg(workerScript, "Could not find server. This is a bug in the game. Report to game dev");
                }

                return runScriptFromScript(scriptServer, scriptname, argsForNewScript, workerScript, threads);
            }, 20e3);
            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.spawn == null) {
                workerScript.scriptRef.log("spawn() will execute " + scriptname + " in 20 seconds");
            }
            NetscriptFunctions(workerScript).exit();
        },
        kill: function(filename, ip) {
            updateDynamicRam("kill", getRamCost("kill"));
            if (filename === undefined || ip === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "kill() call has incorrect number of arguments. Usage: kill(scriptname, server, [arg1], [arg2]...)");
            }
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("kill() failed. Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "kill() failed. Invalid IP or hostname passed in: " + ip);
            }
            var argsForKillTarget = [];
            for (var i = 2; i < arguments.length; ++i) {
                argsForKillTarget.push(arguments[i]);
            }
            var runningScriptObj = findRunningScript(filename, argsForKillTarget, server);
            if (runningScriptObj == null) {
                workerScript.scriptRef.log("kill() failed. No such script "+ filename + " on " + server.hostname + " with args: " + arrayToString(argsForKillTarget));
                return false;
            }
            var res = killWorkerScript(runningScriptObj, server.ip);
            if (res) {
                if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.kill == null) {
                    workerScript.scriptRef.log("Killing " + filename + " on " + server.hostname + " with args: " + arrayToString(argsForKillTarget) +  ". May take up to a few minutes for the scripts to die...");
                }
                return true;
            } else {
                if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.kill == null) {
                    workerScript.scriptRef.log("kill() failed. No such script "+ filename + " on " + server.hostname + " with args: " + arrayToString(argsForKillTarget));
                }
                return false;
            }
        },
        killall: function(ip=workerScript.serverIp) {
            updateDynamicRam("killall", getRamCost("killall"));
            if (ip === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "killall() call has incorrect number of arguments. Takes 1 argument");
            }
            const server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("killall() failed. Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "killall() failed. Invalid IP or hostname passed in: " + ip);
            }
            const scriptsRunning = (server.runningScripts.length > 0);
            for (let i = server.runningScripts.length-1; i >= 0; --i) {
                killWorkerScript(server.runningScripts[i], server.ip, false);
            }
            WorkerScriptStartStopEventEmitter.emitEvent();
            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.killall == null) {
                workerScript.scriptRef.log("killall(): Killing all scripts on " + server.hostname + ". May take a few minutes for the scripts to die");
            }

            return scriptsRunning;
        },
        exit : function() {
            var server = getServer(workerScript.serverIp);
            if (server == null) {
                throw makeRuntimeRejectMsg(workerScript, "Error getting Server for this script in exit(). This is a bug please contact game dev");
            }
            if (killWorkerScript(workerScript.scriptRef, server.ip)) {
                workerScript.scriptRef.log("Exiting...");
            } else {
                workerScript.scriptRef.log("Exit failed(). This is a bug please contact game developer");
            }
        },
        scp: function(scriptname, ip1, ip2) {
            updateDynamicRam("scp", getRamCost("scp"));
            if (arguments.length !== 2 && arguments.length !== 3) {
                throw makeRuntimeRejectMsg(workerScript, "ERROR: scp() call has incorrect number of arguments. Takes 2 or 3 arguments");
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
                throw makeRuntimeRejectMsg(workerScript, `Error: scp() failed due to invalid filename: ${scriptname}`);
            }

            // Invalid file name
            if (!scriptname.endsWith(".lit") && !isScriptFilename(scriptname) && !scriptname.endsWith("txt")) {
                throw makeRuntimeRejectMsg(workerScript, "ERROR: scp() does not work with this file type. It only works for .script, .lit, and .txt files");
            }

            var destServer, currServ;

            if (ip2 != null) { // 3 Argument version: scriptname, source, destination
                if (scriptname === undefined || ip1 === undefined || ip2 === undefined) {
                    throw makeRuntimeRejectMsg(workerScript, "ERROR: scp() call has incorrect number of arguments. Takes 2 or 3 arguments");
                }
                destServer = getServer(ip2);
                if (destServer == null) {
                    throw makeRuntimeRejectMsg(workerScript, `ERROR: Invalid hostname/ip passed into scp() command: ${ip2}`);
                }

                currServ = getServer(ip1);
                if (currServ == null) {
                    throw makeRuntimeRejectMsg(workerScript, `ERROR: Invalid hostname/ip passed into scp() command: ${ip1}`);
                }
            } else if (ip1 != null) { // 2 Argument version: scriptname, destination
                if (scriptname === undefined || ip1 === undefined) {
                    throw makeRuntimeRejectMsg(workerScript, "ERROR: scp() call has incorrect number of arguments. Takes 2 or 3 arguments");
                }
                destServer = getServer(ip1);
                if (destServer == null) {
                    throw makeRuntimeRejectMsg(workerScript, `ERROR: Invalid hostname/ip passed into scp() command: ${ip1}`);
                }

                currServ = getServer(workerScript.serverIp);
                if (currServ == null) {
                    throw makeRuntimeRejectMsg(workerScript, "Could not find server ip for this script. This is a bug please contact game developer");
                }
            } else {
                throw makeRuntimeRejectMsg(workerScript, "ERROR: scp() call has incorrect number of arguments. Takes 2 or 3 arguments");
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
                    workerScript.scriptRef.log(scriptname + " does not exist. scp() failed");
                    return false;
                }

                for (var i = 0; i < destServer.messages.length; ++i) {
                    if (destServer.messages[i] === scriptname) {
                        if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.scp == null) {
                            workerScript.scriptRef.log(scriptname + " copied over to " + destServer.hostname);
                        }
                        return true; // Already exists
                    }
                }
                destServer.messages.push(scriptname);
                if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.scp == null) {
                    workerScript.scriptRef.log(scriptname + " copied over to " + destServer.hostname);
                }
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
                    workerScript.scriptRef.log(scriptname + " does not exist. scp() failed");
                    return false;
                }

                for (var i = 0; i < destServer.textFiles.length; ++i) {
                    if (destServer.textFiles[i].fn === scriptname) {
                        // Overwrite
                        destServer.textFiles[i].text = txtFile.text;
                        if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.scp == null) {
                            workerScript.scriptRef.log(scriptname + " copied over to " + destServer.hostname);
                        }
                        return true;
                    }
                }
                var newFile = new TextFile(txtFile.fn, txtFile.text);
                destServer.textFiles.push(newFile);
                if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.scp == null) {
                    workerScript.scriptRef.log(scriptname + " copied over to " + destServer.hostname);
                }
                return true;
            }

            // Scp for script files
            var sourceScript = null;
            for (var i = 0; i < currServ.scripts.length; ++i) {
                if (scriptname == currServ.scripts[i].filename) {
                    sourceScript = currServ.scripts[i];
                    break;
                }
            }
            if (sourceScript == null) {
                workerScript.scriptRef.log(scriptname + " does not exist. scp() failed");
                return false;
            }

            // Overwrite script if it already exists
            for (var i = 0; i < destServer.scripts.length; ++i) {
                if (scriptname == destServer.scripts[i].filename) {
                    if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.scp == null) {
                        workerScript.scriptRef.log("WARNING: " + scriptname + " already exists on " + destServer.hostname + " and it will be overwritten.");
                        workerScript.scriptRef.log(scriptname + " overwritten on " + destServer.hostname);
                    }
                    var oldScript = destServer.scripts[i];
                    oldScript.code = sourceScript.code;
                    oldScript.ramUsage = sourceScript.ramUsage;
                    oldScript.markUpdated();
                    return true;
                }
            }

            // Create new script if it does not already exist
            var newScript = new Script(scriptname);
            newScript.code = sourceScript.code;
            newScript.ramUsage = sourceScript.ramUsage;
            newScript.server = destServer.ip;
            destServer.scripts.push(newScript);
            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.scp == null) {
                workerScript.scriptRef.log(scriptname + " copied over to " + destServer.hostname);
            }
            return true;
        },
        ls: function(ip, grep) {
            updateDynamicRam("ls", getRamCost("ls"));
            if (ip === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "ls() failed because of invalid arguments. Usage: ls(ip/hostname, [grep filter])");
            }
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("ls() failed. Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "ls() failed. Invalid IP or hostname passed in: " + ip);
            }

            // Get the grep filter, if one exists
            var filter = false;
            if (arguments.length >= 2) {
                filter = grep.toString();
            }

            var allFiles = [];
            for (var i = 0; i < server.programs.length; i++) {
                if (filter) {
                    if (server.programs[i].includes(filter)) {
                        allFiles.push(server.programs[i]);
                    }
                } else {
                    allFiles.push(server.programs[i]);
                }
            }
            for (var i = 0; i < server.scripts.length; i++) {
                if (filter) {
                    if (server.scripts[i].filename.includes(filter)) {
                        allFiles.push(server.scripts[i].filename);
                    }
                } else {
                    allFiles.push(server.scripts[i].filename);
                }

            }
            for (var i = 0; i < server.messages.length; i++) {
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
                workerScript.scriptRef.log("ps() failed. Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "ps() failed. Invalid IP or hostname passed in: " + ip);
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
                throw makeRuntimeRejectMsg(workerScript, "hasRootAccess() call has incorrect number of arguments. Takes 1 argument");
            }
            var server = getServer(ip);
            if (server == null){
                workerScript.scriptRef.log("hasRootAccess() failed. Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "hasRootAccess() failed. Invalid IP or hostname passed in: " + ip);
            }
            return server.hasAdminRights;
        },
        getIp: function() {
            updateDynamicRam("getIp", getRamCost("getIp"));
            var scriptServer = getServer(workerScript.serverIp);
            if (scriptServer == null) {
                throw makeRuntimeRejectMsg(workerScript, "Could not find server. This is a bug in the game. Report to game dev");
            }
            return scriptServer.ip;
        },
        getHostname: function() {
            updateDynamicRam("getHostname", getRamCost("getHostname"));
            var scriptServer = getServer(workerScript.serverIp);
            if (scriptServer == null) {
                throw makeRuntimeRejectMsg(workerScript, "Could not find server. This is a bug in the game. Report to game dev");
            }
            return scriptServer.hostname;
        },
        getHackingLevel: function() {
            updateDynamicRam("getHackingLevel", getRamCost("getHackingLevel"));
            Player.updateSkillLevels();
            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.getHackingLevel == null) {
                workerScript.scriptRef.log("getHackingLevel() returned " + Player.hacking_skill);
            }
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
                throw makeRuntimeRejectMsg(workerScript, "Cannot run getBitNodeMultipliers(). It requires Source-File 5 to run.");
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
                if (workerScript.shouldLog("getServerMoneyAvailable")) {
                    workerScript.log("getServerMoneyAvailable('home') returned player's money: $" + formatNumber(Player.money.toNumber(), 2));
                }
                return Player.money.toNumber();
            }
            if (workerScript.shouldLog("getServerMoneyAvailable")) {
                workerScript.log("getServerMoneyAvailable() returned " + formatNumber(server.moneyAvailable, 2) + " for " + server.hostname);
            }
            return server.moneyAvailable;
        },
        getServerSecurityLevel: function(ip) {
            updateDynamicRam("getServerSecurityLevel", getRamCost("getServerSecurityLevel"));
            const server = safeGetServer(ip, "getServerSecurityLevel");
            if (failOnHacknetServer(server, "getServerSecurityLevel")) { return 1; }
            if (workerScript.shouldLog("getServerSecurityLevel")) {
                workerScript.log("getServerSecurityLevel() returned " + formatNumber(server.hackDifficulty, 3) + " for " + server.hostname);
            }
            return server.hackDifficulty;
        },
        getServerBaseSecurityLevel: function(ip) {
            updateDynamicRam("getServerBaseSecurityLevel", getRamCost("getServerBaseSecurityLevel"));
            const server = safeGetServer(ip, "getServerBaseSecurityLevel");
            if (failOnHacknetServer(server, "getServerBaseSecurityLevel")) { return 1; }
            if (workerScript.shouldLog("getServerBaseSecurityLevel")) {
                workerScript.log("getServerBaseSecurityLevel() returned " + formatNumber(server.baseDifficulty, 3) + " for " + server.hostname);
            }
            return server.baseDifficulty;
        },
        getServerMinSecurityLevel: function(ip) {
            updateDynamicRam("getServerMinSecurityLevel", getRamCost("getServerMinSecurityLevel"));
            const server = safeGetServer(ip, "getServerMinSecurityLevel");
            if (failOnHacknetServer(server, "getServerMinSecurityLevel")) { return 1; }
            if (workerScript.shouldLog("getServerMinSecurityLevel")) {
                workerScript.log("getServerMinSecurityLevel() returned " + formatNumber(server.minDifficulty, 3) + " for " + server.hostname);
            }
            return server.minDifficulty;
        },
        getServerRequiredHackingLevel: function(ip) {
            updateDynamicRam("getServerRequiredHackingLevel", getRamCost("getServerRequiredHackingLevel"));
            const server = safeGetServer(ip, "getServerRequiredHackingLevel");
            if (failOnHacknetServer(server, "getServerRequiredHackingLevel")) { return 1; }
            if (workerScript.shouldLog("getServerRequiredHackingLevel")) {
                workerScript.log("getServerRequiredHackingLevel returned " + formatNumber(server.requiredHackingSkill, 0) + " for " + server.hostname);
            }
            return server.requiredHackingSkill;
        },
        getServerMaxMoney: function(ip) {
            updateDynamicRam("getServerMaxMoney", getRamCost("getServerMaxMoney"));
            const server = safeGetServer(ip, "getServerMaxMoney");
            if (failOnHacknetServer(server, "getServerMaxMoney")) { return 0; }
            if (workerScript.shouldLog("getServerMaxMoney")) {
                workerScript.log("getServerMaxMoney() returned " + formatNumber(server.moneyMax, 0) + " for " + server.hostname);
            }
            return server.moneyMax;
        },
        getServerGrowth: function(ip) {
            updateDynamicRam("getServerGrowth", getRamCost("getServerGrowth"));
            const server = safeGetServer(ip, "getServerGrowth");
            if (failOnHacknetServer(server, "getServerGrowth")) { return 1; }
            if (workerScript.shouldLog("getServerGrowth")) {
                workerScript.log("getServerGrowth() returned " + formatNumber(server.serverGrowth, 0) + " for " + server.hostname);
            }
            return server.serverGrowth;
        },
        getServerNumPortsRequired: function(ip) {
            updateDynamicRam("getServerNumPortsRequired", getRamCost("getServerNumPortsRequired"));
            const server = safeGetServer(ip, "getServerNumPortsRequired");
            if (failOnHacknetServer(server, "getServerNumPortsRequired")) { return 5; }
            if (workerScript.shouldLog("getServerNumPortsRequired")) {
                workerScript.log("getServerNumPortsRequired() returned " + formatNumber(server.numOpenPortsRequired, 0) + " for " + server.hostname);
            }
            return server.numOpenPortsRequired;
        },
        getServerRam: function(ip) {
            updateDynamicRam("getServerRam", getRamCost("getServerRam"));
            const server = safeGetServer(ip, "getServerRam");
            if (workerScript.shouldLog("getServerRam")) {
                workerScript.log("getServerRam() returned [" + formatNumber(server.maxRam, 2) + "GB, " + formatNumber(server.ramUsed, 2) + "GB]");
            }
            return [server.maxRam, server.ramUsed];
        },
        serverExists: function(ip) {
            updateDynamicRam("serverExists", getRamCost("serverExists"));
            return (getServer(ip) !== null);
        },
        fileExists: function(filename,ip=workerScript.serverIp) {
            updateDynamicRam("fileExists", getRamCost("fileExists"));
            if (filename === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "fileExists() call has incorrect number of arguments. Usage: fileExists(scriptname, [server])");
            }
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("fileExists() failed. Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "fileExists() failed. Invalid IP or hostname passed in: " + ip);
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
                throw makeRuntimeRejectMsg(workerScript, "isRunning() call has incorrect number of arguments. Usage: isRunning(scriptname, server, [arg1], [arg2]...)");
            }
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("isRunning() failed. Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "isRunning() failed. Invalid IP or hostname passed in: " + ip);
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
                throw makeRuntimeRejectMsg(workerScript, "Invalid stock symbol passed into getStockPosition()");
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
                    throw makeRuntimeRejectMsg(workerScript, "ERROR: Cannot use shortStock(). You must either be in BitNode-8 or you must have Level 2 of Source-File 8");
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
                    throw makeRuntimeRejectMsg(workerScript, "ERROR: Cannot use sellShort(). You must either be in BitNode-8 or you must have Level 2 of Source-File 8");
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
                    throw makeRuntimeRejectMsg(workerScript, "ERROR: Cannot use placeOrder(). You must either be in BitNode-8 or have Level 3 of Source-File 8");
                }
            }
            const stock = getStockFromSymbol(symbol, "placeOrder");

            var orderType, orderPos;
            type = type.toLowerCase();
            if (type.includes("limit") && type.includes("buy")) {
                orderType = OrderTypes.LimitBuy;
            } else if (type.includes("limit") && type.includes("sell")) {
                orderType = OrderTypes.LimitSell;
            } else if (type.includes("stop") && type.includes("buy")) {
                orderType = OrderTypes.StopBuy;
            } else if (type.includes("stop") && type.includes("sell")) {
                orderType = OrderTypes.StopSell;
            } else {
                throw makeRuntimeRejectMsg(workerScript, "ERROR: Invalid Order Type passed into placeOrder()");
            }

            pos = pos.toLowerCase();
            if (pos.includes("l")) {
                orderPos = PositionTypes.Long;
            } else if (pos.includes('s')) {
                orderPos = PositionTypes.Short;
            } else {
                throw makeRuntimeRejectMsg(workerScript, "ERROR: Invalid Position Type passed into placeOrder()");
            }

            return placeOrder(stock, shares, price, orderType, orderPos, workerScript);
        },
        cancelOrder: function(symbol, shares, price, type, pos) {
            updateDynamicRam("cancelOrder", getRamCost("cancelOrder"));
            checkTixApiAccess("cancelOrder");
            if (Player.bitNodeN !== 8) {
                if (SourceFileFlags[8] <= 2) {
                    throw makeRuntimeRejectMsg(workerScript, "ERROR: Cannot use cancelOrder(). You must either be in BitNode-8 or have Level 3 of Source-File 8");
                }
            }
            const stock = getStockFrom(symbol, "cancelOrder");
            if (isNaN(shares) || isNaN(price)) {
                throw makeRuntimeRejectMsg(workerScript, "ERROR: Invalid shares or price argument passed into cancelOrder(). Must be numeric");
            }
            var orderType, orderPos;
            type = type.toLowerCase();
            if (type.includes("limit") && type.includes("buy")) {
                orderType = OrderTypes.LimitBuy;
            } else if (type.includes("limit") && type.includes("sell")) {
                orderType = OrderTypes.LimitSell;
            } else if (type.includes("stop") && type.includes("buy")) {
                orderType = OrderTypes.StopBuy;
            } else if (type.includes("stop") && type.includes("sell")) {
                orderType = OrderTypes.StopSell;
            } else {
                throw makeRuntimeRejectMsg(workerScript, "ERROR: Invalid Order Type passed into placeOrder()");
            }

            pos = pos.toLowerCase();
            if (pos.includes("l")) {
                orderPos = PositionTypes.Long;
            } else if (pos.includes('s')) {
                orderPos = PositionTypes.Short;
            } else {
                throw makeRuntimeRejectMsg(workerScript, "ERROR: Invalid Position Type passed into placeOrder()");
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
                    throw makeRuntimeRejectMsg(workerScript, "ERROR: Cannot use getOrders(). You must either be in BitNode-8 or have Level 3 of Source-File 8");
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
                throw makeRuntimeRejectMsg(workerScript, "You don't have 4S Market Data TIX API Access! Cannot use getStockVolatility()");
            }
            const stock = getStockFromSymbol(symbol, "getStockVolatility");

            return stock.mv / 100; // Convert from percentage to decimal
        },
        getStockForecast: function(symbol) {
            updateDynamicRam("getStockForecast", getRamCost("getStockForecast"));
            if (!Player.has4SDataTixApi) {
                throw makeRuntimeRejectMsg(workerScript, "You don't have 4S Market Data TIX API Access! Cannot use getStockForecast()");
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
                if (workerScript.shouldLog("purchase4SMarketData")) {
                    workerScript.log("Already purchased 4S Market Data");
                }
                return true;
            }

            if (Player.money.lt(getStockMarket4SDataCost())) {
                if (workerScript.shouldLog("purchase4SMarketData")) {
                    workerScript.log("Failed to purchase 4S Market Data - Not enough money");
                }
                return false;
            }

            Player.has4SData = true;
            Player.loseMoney(getStockMarket4SDataCost());
            if (workerScript.shouldLog("purchase4SMarketData")) {
                workerScript.log("Purchased 4S Market Data");
            }
            displayStockMarketContent();
            return true;
        },
        purchase4SMarketDataTixApi : function() {
            updateDynamicRam("purchase4SMarketDataTixApi", getRamCost("purchase4SMarketDataTixApi"));
            checkTixApiAccess("purchase4SMarketDataTixApi");

            if (Player.has4SDataTixApi) {
                if (workerScript.shouldLog("purchase4SMarketDataTixApi")) {
                    workerScript.log("Already purchased 4S Market Data TIX API");
                }
                return true;
            }

            if (Player.money.lt(getStockMarket4STixApiCost())) {
                if (workerScript.shouldLog("purchase4SMarketDataTixApi")) {
                    workerScript.log("Failed to purchase 4S Market Data TIX API - Not enough money");
                }
                return false;
            }

            Player.has4SDataTixApi = true;
            Player.loseMoney(getStockMarket4STixApiCost());
            if (workerScript.shouldLog("purchase4SMarketDataTixApi")) {
                workerScript.log("Purchased 4S Market Data TIX API");
            }
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
                workerScript.scriptRef.log("ERROR: 'getPurchasedServerCost()' failed due to an invalid 'ram' argument");
                return Infinity;
            }

            return cost;
        },
        purchaseServer: function(hostname, ram) {
            updateDynamicRam("purchaseServer", getRamCost("purchaseServer"));
            var hostnameStr = String(hostname);
            hostnameStr = hostnameStr.replace(/\s+/g, '');
            if (hostnameStr == "") {
                workerScript.log("ERROR: Passed empty string for hostname argument of purchaseServer()");
                return "";
            }

            if (Player.purchasedServers.length >= getPurchaseServerLimit()) {
                workerScript.log(`ERROR: You have reached the maximum limit of ${getPurchaseServerLimit()} servers. You cannot purchase any more.`);
                return "";
            }

            const cost = getPurchaseServerCost(ram);
            if (cost === Infinity) {
                workerScript.log("ERROR: 'purchaseServer()' failed due to an invalid 'ram' argument");
                return Infinity;
            }

            if (Player.money.lt(cost)) {
                workerScript.log("ERROR: Not enough money to purchase server. Need $" + formatNumber(cost, 2));
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
            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.purchaseServer == null) {
                workerScript.scriptRef.log("Purchased new server with hostname " + newServ.hostname + " for $" + formatNumber(cost, 2));
            }
            return newServ.hostname;
        },
        deleteServer: function(hostname) {
            updateDynamicRam("deleteServer", getRamCost("deleteServer"));
            var hostnameStr = String(hostname);
            hostnameStr = hostnameStr.replace(/\s\s+/g, '');
            var server = GetServerByHostname(hostnameStr);
            if (server == null) {
                workerScript.scriptRef.log("ERROR: Could not find server with hostname " + hostnameStr + ". deleteServer() failed");
                return false;
            }

            if (!server.purchasedByPlayer || server.hostname === "home") {
                workerScript.scriptRef.log("ERROR: Server " + server.hostname + " is not a purchased server. " +
                                           "Cannot be deleted. deleteServer() failed");
                return false;
            }

            var ip = server.ip;

            // Can't delete server you're currently connected to
            if (server.isConnectedTo) {
                workerScript.scriptRef.log("ERROR: deleteServer() failed because you are currently connected to the server you are trying to delete");
                return false;
            }

            // A server cannot delete itself
            if (ip === workerScript.serverIp) {
                workerScript.scriptRef.log("ERROR: Cannot call deleteServer() on self. deleteServer() failed");
                return false;
            }

            // Delete all scripts running on server
            if (server.runningScripts.length > 0) {
                workerScript.scriptRef.log("ERROR: Cannot delete server " + server.hostname + " because it still has scripts running.");
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
                workerScript.scriptRef.log("ERROR: Could not identify server " + server.hostname +
                                           "as a purchased server. This is likely a bug please contact game dev");
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
                    if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.deleteServer == null) {
                        workerScript.scriptRef.log("Deleted server " + hostnameStr);
                    }
                    return true;
                }
            }
            // Wasn't found on home computer
            workerScript.scriptRef.log("ERROR: Could not find server " + server.hostname +
                                       "as a purchased server. This is likely a bug please contact game dev");
            return false;
        },
        getPurchasedServers: function(hostname=true) {
            updateDynamicRam("getPurchasedServers", getRamCost("getPurchasedServers"));
            var res = [];
            Player.purchasedServers.forEach(function(ip) {
                if (hostname) {
                    var server = getServer(ip);
                    if (server == null) {
                        throw makeRuntimeRejectMsg(workerScript, "ERROR: Could not find server in getPurchasedServers(). This is a bug please report to game dev");
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
                    throw makeRuntimeRejectMsg(workerScript, "ERROR: Trying to write to invalid port: " + port + ". Only ports 1-" + CONSTANTS.NumNetscriptPorts + " are valid.");
                }
                var port = NetscriptPorts[port-1];
                if (port == null || !(port instanceof NetscriptPort)) {
                    throw makeRuntimeRejectMsg(workerScript, "Could not find port: " + port + ". This is a bug contact the game developer");
                }
                return port.write(data);
            } else if (isString(port)) { // Write to script or text file
                const fn = port;
                if (!isValidFilePath(fn)) {
                    throw makeRuntimeRejectMsg(workerScript, `write() failed due to invalid filepath: ${fn}`);
                }

                const server = workerScript.getServer();
                if (server == null) {
                    throw makeRuntimeRejectMsg(workerScript, "Error getting Server for this script in write(). This is a bug please contact game dev");
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
                throw makeRuntimeRejectMsg(workerScript, "Invalid argument passed in for write: " + port);
            }
        },
        tryWrite: function(port, data="") {
            updateDynamicRam("tryWrite", getRamCost("tryWrite"));
            if (!isNaN(port)) {
                port = Math.round(port);
                if (port < 1 || port > CONSTANTS.NumNetscriptPorts) {
                    throw makeRuntimeRejectMsg(workerScript, "ERROR: tryWrite() called on invalid port: " + port + ". Only ports 1-" + CONSTANTS.NumNetscriptPorts + " are valid.");
                }
                var port = NetscriptPorts[port-1];
                if (port == null || !(port instanceof NetscriptPort)) {
                    throw makeRuntimeRejectMsg(workerScript, "Could not find port: " + port + ". This is a bug contact the game developer");
                }
                return port.tryWrite(data);
            } else {
                throw makeRuntimeRejectMsg(workerScript, "Invalid argument passed in for tryWrite: " + port);
            }
        },
        read: function(port) {
            updateDynamicRam("read", getRamCost("read"));
            if (!isNaN(port)) { // Read from port
                // Port 1-10
                port = Math.round(port);
                if (port < 1 || port > CONSTANTS.NumNetscriptPorts) {
                    throw makeRuntimeRejectMsg(workerScript, "ERROR: Trying to read from invalid port: " + port + ". Only ports 1-" + CONSTANTS.NumNetscriptPorts + " are valid.");
                }
                var port = NetscriptPorts[port-1];
                if (port == null || !(port instanceof NetscriptPort)) {
                    throw makeRuntimeRejectMsg(workerScript, "ERROR: Could not find port: " + port + ". This is a bug contact the game developer");
                }
                return port.read();
            } else if (isString(port)) { // Read from script or text file
                let fn = port;
                let server = getServer(workerScript.serverIp);
                if (server == null) {
                    throw makeRuntimeRejectMsg(workerScript, "Error getting Server for this script in read(). This is a bug please contact game dev");
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
                throw makeRuntimeRejectMsg(workerScript, "Invalid argument passed in for read(): " + port);
            }
        },
        peek: function(port) {
            updateDynamicRam("peek", getRamCost("peek"));
            if (isNaN(port)) {
                throw makeRuntimeRejectMsg(workerScript, "ERROR: peek() called with invalid argument. Must be a port number between 1 and " + CONSTANTS.NumNetscriptPorts);
            }
            port = Math.round(port);
            if (port < 1 || port > CONSTANTS.NumNetscriptPorts) {
                throw makeRuntimeRejectMsg(workerScript, "ERROR: peek() called with invalid argument. Must be a port number between 1 and " + CONSTANTS.NumNetscriptPorts);
            }
            var port = NetscriptPorts[port-1];
            if (port == null || !(port instanceof NetscriptPort)) {
                throw makeRuntimeRejectMsg(workerScript, "ERROR: Could not find port: " + port + ". This is a bug contact the game developer");
            }
            return port.peek();
        },
        clear: function(port) {
            updateDynamicRam("clear", getRamCost("clear"));
            if (!isNaN(port)) { // Clear port
                port = Math.round(port);
                if (port < 1 || port > CONSTANTS.NumNetscriptPorts) {
                    throw makeRuntimeRejectMsg(workerScript, "ERROR: Trying to clear invalid port: " + port + ". Only ports 1-" + CONSTANTS.NumNetscriptPorts + " are valid");
                }
                var port = NetscriptPorts[port-1];
                if (port == null || !(port instanceof NetscriptPort)) {
                    throw makeRuntimeRejectMsg(workerScript, "ERROR: Could not find port: " + port + ". This is a bug contact the game developer");
                }
                return port.clear();
            } else if (isString(port)) { // Clear text file
                var fn = port;
                var server = getServer(workerScript.serverIp);
                if (server == null) {
                    throw makeRuntimeRejectMsg(workerScript, "Error getting Server for this script in clear(). This is a bug please contact game dev");
                }
                var txtFile = getTextFile(fn, server);
                if (txtFile != null) {
                    txtFile.write("");
                }
            } else {
                throw makeRuntimeRejectMsg(workerScript, "Invalid argument passed in for clear(): " + port);
            }
            return 0;
        },
        getPortHandle: function(port) {
            updateDynamicRam("getPortHandle", getRamCost("getPortHandle"));
            if (isNaN(port)) {
                throw makeRuntimeRejectMsg(workerScript, "ERROR: Invalid argument passed into getPortHandle(). Must be an integer between 1 and " + CONSTANTS.NumNetscriptPorts);
            }
            port = Math.round(port);
            if (port < 1 || port > CONSTANTS.NumNetscriptPorts) {
                throw makeRuntimeRejectMsg(workerScript, "ERROR: getPortHandle() called with invalid port number: " + port + ". Only ports 1-" + CONSTANTS.NumNetscriptPorts + " are valid");
            }
            var port = NetscriptPorts[port-1];
            if (port == null || !(port instanceof NetscriptPort)) {
                throw makeRuntimeRejectMsg(workerScript, "ERROR: Could not find port: " + port + ". This is a bug contact the game developer");
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
                workerScript.log(status.msg);
            }

            return status.res;
        },
        scriptRunning: function(scriptname, ip) {
            updateDynamicRam("scriptRunning", getRamCost("scriptRunning"));
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("scriptRunning() failed. Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "scriptRunning() failed. Invalid IP or hostname passed in: " + ip);
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
                workerScript.scriptRef.log("scriptKill() failed. Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "scriptKill() failed. Invalid IP or hostname passed in: " + ip);
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
                workerScript.scriptRef.log("getScriptRam() failed. Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "getScriptRam() failed. Invalid IP or hostname passed in: " + ip);
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
                    workerScript.scriptRef.log("getScriptIncome() failed. Invalid IP or hostnamed passed in: " + ip);
                    throw makeRuntimeRejectMsg(workerScript, "getScriptIncome() failed. Invalid IP or hostnamed passed in: " + ip);
                }
                var argsForScript = [];
                for (var i = 2; i < arguments.length; ++i) {
                    argsForScript.push(arguments[i]);
                }
                var runningScriptObj = findRunningScript(scriptname, argsForScript, server);
                if (runningScriptObj == null) {
                    workerScript.scriptRef.log("getScriptIncome() failed. No such script "+ scriptname + " on " + server.hostname + " with args: " + arrayToString(argsForScript));
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
                    workerScript.scriptRef.log("getScriptExpGain() failed. Invalid IP or hostnamed passed in: " + ip);
                    throw makeRuntimeRejectMsg(workerScript, "getScriptExpGain() failed. Invalid IP or hostnamed passed in: " + ip);
                }
                var argsForScript = [];
                for (var i = 2; i < arguments.length; ++i) {
                    argsForScript.push(arguments[i]);
                }
                var runningScriptObj = findRunningScript(scriptname, argsForScript, server);
                if (runningScriptObj == null) {
                    workerScript.scriptRef.log("getScriptExpGain() failed. No such script "+ scriptname + " on " + server.hostname + " with args: " + arrayToString(argsForScript));
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
                workerScript.log(`ERROR: wget() failed because of an invalid target file: ${target}. Target file must be a script or text file`);
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
                        workerScript.log("ERROR: wget() failed");
                        return resolve(false);
                    }
                    if (res.overwritten) {
                         workerScript.log(`wget() successfully retrieved content and overwrote ${target} on ${ip}`);
                         return resolve(true);
                    }
                    workerScript.log(`wget successfully retrieved content to new file ${target} on ${ip}`);
                    return resolve(true);
                }, 'text').fail(function(e) {
                    workerScript.log(`ERROR: wget() failed: ${JSON.stringify(e)}`);
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
            if (Player.bitNodeN !== 4) {
                if (SourceFileFlags[4] <= 0) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run universityCourse(). It is a Singularity Function and requires SourceFile-4 (level 1) to run.");
                    return false;
                }
            }
            if (inMission) {
                workerScript.scriptRef.log("ERROR: universityCourse() failed because you are in the middle of a mission.");
                return;
            }
            if (Player.isWorking) {
                var txt = Player.singularityStopWork();
                if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.universityCourse == null) {
                    workerScript.scriptRef.log(txt);
                }
            }

            var costMult, expMult;
            switch(universityName.toLowerCase()) {
                case LocationName.AevumSummitUniversity.toLowerCase():
                    if (Player.city != CityName.Aevum) {
                        workerScript.scriptRef.log("ERROR: You cannot study at Summit University because you are not in Aevum. universityCourse() failed");
                        return false;
                    }
                    Player.gotoLocation(LocationName.AevumSummitUniversity);
                    costMult = 4;
                    expMult = 3;
                    break;
                case LocationName.Sector12RothmanUniversity.toLowerCase():
                    if (Player.city != CityName.Sector12) {
                        workerScript.scriptRef.log("ERROR: You cannot study at Rothman University because you are not in Sector-12. universityCourse() failed");
                        return false;
                    }
                    Player.location = LocationName.Sector12RothmanUniversity;
                    costMult = 3;
                    expMult = 2;
                    break;
                case LocationName.VolhavenZBInstituteOfTechnology.toLowerCase():
                    if (Player.city != CityName.Volhaven) {
                        workerScript.scriptRef.log("ERROR: You cannot study at ZB Institute of Technology because you are not in Volhaven. universityCourse() failed");
                        return false;
                    }
                    Player.location = LocationName.VolhavenZBInstituteOfTechnology;
                    costMult = 5;
                    expMult = 4;
                    break;
                default:
                    workerScript.scriptRef.log("Invalid university name: " + universityName + ". universityCourse() failed");
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
                    workerScript.scriptRef.log("Invalid class name: " + className + ". universityCourse() failed");
                    return false;
            }
            Player.startClass(costMult, expMult, task);
            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.universityCourse == null) {
                workerScript.scriptRef.log("Started " + task + " at " + universityName);
            }
            return true;
        },

        gymWorkout: function(gymName, stat) {
            updateDynamicRam("gymWorkout", getRamCost("gymWorkout"));
            if (Player.bitNodeN !== 4) {
                if (SourceFileFlags[4] <= 0) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run gymWorkout(). It is a Singularity Function and requires SourceFile-4 (level 1) to run.");
                    return false;
                }
            }
            if (inMission) {
                workerScript.scriptRef.log("ERROR: gymWorkout() failed because you are in the middle of a mission.");
                return;
            }
            if (Player.isWorking) {
                var txt = Player.singularityStopWork();
                if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.gymWorkout == null) {
                    workerScript.scriptRef.log(txt);
                }
            }
            var costMult, expMult;
            switch(gymName.toLowerCase()) {
                case LocationName.AevumCrushFitnessGym.toLowerCase():
                    if (Player.city != CityName.Aevum) {
                        workerScript.scriptRef.log("ERROR: You cannot workout at Crush Fitness because you are not in Aevum. gymWorkout() failed");
                        return false;
                    }
                    Player.location = LocationName.AevumCrushFitnessGym;
                    costMult = 3;
                    expMult = 2;
                    break;
                case LocationName.AevumSnapFitnessGym.toLowerCase():
                    if (Player.city != CityName.Aevum) {
                        workerScript.scriptRef.log("ERROR: You cannot workout at Snap Fitness because you are not in Aevum. gymWorkout() failed");
                        return false;
                    }
                    Player.location = LocationName.AevumSnapFitnessGym;
                    costMult = 10;
                    expMult = 5;
                    break;
                case LocationName.Sector12IronGym.toLowerCase():
                    if (Player.city != CityName.Sector12) {
                        workerScript.scriptRef.log("ERROR: You cannot workout at Iron Gym because you are not in Sector-12. gymWorkout() failed");
                        return false;
                    }
                    Player.location = LocationName.Sector12IronGym;
                    costMult = 1;
                    expMult = 1;
                    break;
                case LocationName.Sector12PowerhouseGym.toLowerCase():
                    if (Player.city != CityName.Sector12) {
                        workerScript.scriptRef.log("ERROR: You cannot workout at Powerhouse Gym because you are not in Sector-12. gymWorkout() failed");
                        return false;
                    }
                    Player.location = LocationName.Sector12PowerhouseGym;
                    costMult = 20;
                    expMult = 10;
                    break;
                case LocationName.VolhavenMilleniumFitnessGym.toLowerCase():
                    if (Player.city != CityName.Volhaven) {
                        workerScript.scriptRef.log("ERROR: You cannot workout at Millenium Fitness Gym because you are not in Volhaven. gymWorkout() failed");
                        return false;
                    }
                    Player.location = LocationName.VolhavenMilleniumFitnessGym;
                    costMult = 7;
                    expMult = 4;
                    break;
                default:
                    workerScript.scriptRef.log("Invalid gym name: " + gymName + ". gymWorkout() failed");
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
                    workerScript.scriptRef.log("Invalid stat: " + stat + ". gymWorkout() failed");
                    return false;
            }
            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.gymWorkout == null) {
                workerScript.scriptRef.log("Started training " + stat + " at " + gymName);
            }
            return true;
        },

        travelToCity: function(cityname) {
            updateDynamicRam("travelToCity", getRamCost("travelToCity"));
            if (Player.bitNodeN !== 4) {
                if (SourceFileFlags[4] <= 0) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run travelToCity(). It is a Singularity Function and requires SourceFile-4 (level 1) to run.");
                    return false;
                }
            }

            switch(cityname) {
                case CityName.Aevum:
                case CityName.Chongqing:
                case CityName.Sector12:
                case CityName.NewTokyo:
                case CityName.Ishima:
                case CityName.Volhaven:
                    if(Player.money.lt(CONSTANTS.TravelCost)) {
                        workerScript.scriptRef.log("ERROR: not enough money to travel with travelToCity().");
                        throw makeRuntimeRejectMsg(workerScript, "ERROR: not enough money to travel with travelToCity().");
                    }
                    Player.loseMoney(CONSTANTS.TravelCost);
                    Player.city = cityname;
                    if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.travelToCity == null) {
                        workerScript.scriptRef.log("Traveled to " + cityname);
                    }
                    return true;
                default:
                    workerScript.scriptRef.log("ERROR: Invalid city name passed into travelToCity().");
                    return false;
            }
        },

        purchaseTor: function() {
            updateDynamicRam("purchaseTor", getRamCost("purchaseTor"));
            if (Player.bitNodeN !== 4) {
                if (SourceFileFlags[4] <= 0) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run purchaseTor(). It is a Singularity Function and requires SourceFile-4 (level 1) to run.");
                    return false;
                }
            }

            if (SpecialServerIps["Darkweb Server"] != null) {
                workerScript.scriptRef.log("You already have a TOR router! purchaseTor() failed");
                return false;
            }

            if (Player.money.lt(CONSTANTS.TorRouterCost)) {
                workerScript.scriptRef.log("ERROR: You cannot afford to purchase a Tor router. purchaseTor() failed");
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
            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.purchaseTor == null) {
                workerScript.scriptRef.log("You have purchased a Tor router!");
            }
            return true;
        },
        purchaseProgram: function(programName) {
            updateDynamicRam("purchaseProgram", getRamCost("purchaseProgram"));
            if (Player.bitNodeN !== 4) {
                if (SourceFileFlags[4] <= 0) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run purchaseProgram(). It is a Singularity Function and requires SourceFile-4 (level 1) to run.");
                    return false;
                }
            }

            if (SpecialServerIps["Darkweb Server"] == null) {
                workerScript.scriptRef.log("ERROR: You do not have the TOR router. purchaseProgram() failed.");
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
                workerScript.scriptRef.log("ERROR: Invalid program name passed into purchaseProgram().");
                return false;
            }

            if(Player.money.lt(item.price)) {
                workerScript.scriptRef.log("Not enough money to purchase " + item.program);
                return false;
            }


            if(Player.hasProgram(item.program)) {
                workerScript.scriptRef.log('You already have the '+item.program+' program');
                return true;
            }

            Player.loseMoney(item.price);
            Player.getHomeComputer().programs.push(item.program);
            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.purchaseProgram == null) {
                workerScript.scriptRef.log("You have purchased the "+item.program+" program. The new program can be found on your home computer.");
            }
            return true;
        },
        getStats: function() {
            updateDynamicRam("getStats", getRamCost("getStats"));
            if (Player.bitNodeN !== 4) {
                if (SourceFileFlags[4] <= 0) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run getStats(). It is a Singularity Function and requires SourceFile-4 (level 1) to run.");
                    return {};
                }
            }

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
            if (Player.bitNodeN !== 4) {
                if (SourceFileFlags[4] <= 0) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run getCharacterInformation(). It is a Singularity Function and requires SourceFile-4 (level 1) to run.");
                    return {};
                }
            }

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
            };
        },
        isBusy: function() {
            updateDynamicRam("isBusy", getRamCost("isBusy"));
            if (Player.bitNodeN !== 4) {
                if (SourceFileFlags[4] <= 0) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run isBusy(). It is a Singularity Function and requires SourceFile-4 (level 1) to run.");
                    return;
                }
            }
            return Player.isWorking;
        },
        stopAction: function() {
            updateDynamicRam("stopAction", getRamCost("stopAction"));
            if (Player.bitNodeN !== 4) {
                if (SourceFileFlags[4] <= 0) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run stopAction(). It is a Singularity Function and requires SourceFile-4 (level 1) to run.");
                    return false;
                }
            }
            if (Player.isWorking) {
                var txt = Player.singularityStopWork();
                if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.stopAction == null) {
                    workerScript.scriptRef.log(txt);
                }
                return true;
            }
            return false;
        },
        upgradeHomeRam: function() {
            updateDynamicRam("upgradeHomeRam", getRamCost("upgradeHomeRam"));
            if (Player.bitNodeN !== 4) {
                if (SourceFileFlags[4] <= 1) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run upgradeHomeRam(). It is a Singularity Function and requires SourceFile-4 (level 2) to run.");
                    return false;
                }
            }

            // Check if we're at max RAM
            const homeComputer = Player.getHomeComputer();
            if (homeComputer.maxRam >= CONSTANTS.HomeComputerMaxRam) {
                workerScript.log(`ERROR: upgradeHomeRam() failed because your home computer is at max RAM`);
                return false;
            }

            const cost = Player.getUpgradeHomeRamCost();
            if (Player.money.lt(cost)) {
                workerScript.scriptRef.log("ERROR: upgradeHomeRam() failed because you don't have enough money");
                return false;
            }

            homeComputer.maxRam *= 2;
            Player.loseMoney(cost);

            Player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain);
            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.upgradeHomeRam == null) {
                workerScript.scriptRef.log("Purchased additional RAM for home computer! It now has " + homeComputer.maxRam + "GB of RAM.");
            }
            return true;
        },
        getUpgradeHomeRamCost: function() {
            updateDynamicRam("getUpgradeHomeRamCost", getRamCost("getUpgradeHomeRamCost"));
            if (Player.bitNodeN !== 4) {
                if (SourceFileFlags[4] <= 1) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run getUpgradeHomeRamCost(). It is a Singularity Function and requires SourceFile-4 (level 2) to run.");
                    return false;
                }
            }

            return Player.getUpgradeHomeRamCost();
        },
        workForCompany: function(companyName) {
            updateDynamicRam("workForCompany", getRamCost("workForCompany"));
            if (Player.bitNodeN !== 4) {
                if (SourceFileFlags[4] <= 1) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run workForCompany(). It is a Singularity Function and requires SourceFile-4 (level 2) to run.");
                    return false;
                }
            }

            // Sanitize input
            if (companyName == null) {
                companyName = Player.companyName;
            }

            // Make sure its a valid company
            if (companyName == null || companyName === "" || !(Companies[companyName] instanceof Company)) {
                workerScript.scriptRef.log(`ERROR: workForCompany() failed because of an invalid company specified: ${companyName}`);
                return false;
            }

            // Make sure player is actually employed at the comapny
            if (!Object.keys(Player.jobs).includes(companyName)) {
                workerScript.scriptRef.log(`ERROR: workForCompany() failed because you do not have a job at ${companyName}`);
                return false;
            }

            // Cant work while in a mission
            if (inMission) {
                workerScript.scriptRef.log("ERROR: workForCompany() failed because you are in the middle of a mission.");
                return false;
            }

            // Check to make sure company position data is valid
            const companyPositionName = Player.jobs[companyName];
            const companyPosition = CompanyPositions[companyPositionName];
            if (companyPositionName === "" || !(companyPosition instanceof CompanyPosition)) {
                workerScript.scriptRef.log("ERROR: workForCompany() failed because you do not have a job");
                return false;
            }

            if (Player.isWorking) {
                var txt = Player.singularityStopWork();
                if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.workForCompany == null) {
                    workerScript.scriptRef.log(txt);
                }
            }

            if (companyPosition.isPartTimeJob()) {
                Player.startWorkPartTime(companyName);
            } else {
                Player.startWork(companyName);
            }
            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.workForCompany == null) {
                workerScript.log(`Began working at ${Player.companyName} as a ${companyPositionName}`);
            }
            return true;
        },
        applyToCompany: function(companyName, field) {
            updateDynamicRam("applyToCompany", getRamCost("applyToCompany"));
            if (Player.bitNodeN !== 4) {
                if (SourceFileFlags[4] <= 1) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run applyToCompany(). It is a Singularity Function and requires SourceFile-4 (level 2) to run.");
                    return false;
                }
            }

            if (!companyExists(companyName)) {
                workerScript.scriptRef.log("ERROR: applyToCompany() failed because specified company " + companyName + " does not exist.");
                return false;
            }

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
                    workerScript.scriptRef.log("ERROR: Invalid job passed into applyToCompany: " + field + ". applyToCompany() failed");
                    return false;
            }
            // The Player object's applyForJob function can return string with special error messages
            if (isString(res)) {
                workerScript.scriptRef.log(res);
                return false;
            }
            if (res) {
                if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.applyToCompany == null) {
                    workerScript.log(`You were offered a new job at ${companyName} as a ${Player.jobs[companyName]}`);
                }
            } else {
                if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.applyToCompany == null) {
                    workerScript.log(`You failed to get a new job/promotion at ${companyName} in the ${field} field.`);
                }
            }
            return res;
        },
        getCompanyRep: function(companyName) {
            updateDynamicRam("getCompanyRep", getRamCost("getCompanyRep"));
            if (Player.bitNodeN !== 4) {
                if (SourceFileFlags[4] <= 1) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run getCompanyRep(). It is a Singularity Function and requires SourceFile-4 (level 2) to run.");
                    return false;
                }
            }

            var company = Companies[companyName];
            if (company == null || !(company instanceof Company)) {
                workerScript.scriptRef.log("ERROR: Invalid companyName passed into getCompanyRep(): " + companyName);
                return -1;
            }
            return company.playerReputation;
        },
        getCompanyFavor: function(companyName) {
            updateDynamicRam("getCompanyFavor", getRamCost("getCompanyFavor"));
            if (Player.bitNodeN !== 4) {
                if (SourceFileFlags[4] <= 1) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run getCompanyFavor(). It is a Singularity Function and requires SourceFile-4 (level 2) to run.");
                    return false;
                }
            }

            var company = Companies[companyName];
            if (company == null || !(company instanceof Company)) {
                workerScript.scriptRef.log("ERROR: Invalid companyName passed into getCompanyFavor(): " + companyName);
                return -1;
            }
            return company.favor;
        },
        getCompanyFavorGain: function(companyName) {
            updateDynamicRam("getCompanyFavorGain", getRamCost("getCompanyFavorGain"));
            if (Player.bitNodeN !== 4) {
                if (SourceFileFlags[4] <= 1) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run getCompanyFavorGain(). It is a Singularity Function and requires SourceFile-4 (level 2) to run.");
                    return -1;
                }
            }

            var company = Companies[companyName];
            if (company == null || !(company instanceof Company)) {
                workerScript.scriptRef.log("ERROR: Invalid companyName passed into getCompanyFavorGain(): " + companyName);
                return -1;
            }
            return company.getFavorGain()[0];
        },
        checkFactionInvitations: function() {
            updateDynamicRam("checkFactionInvitations", getRamCost("checkFactionInvitations"));
            if (Player.bitNodeN !== 4) {
                if (SourceFileFlags[4] <= 1) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run checkFactionInvitations(). It is a Singularity Function and requires SourceFile-4 (level 2) to run.");
                    return false;
                }
            }
            // Make a copy of Player.factionInvitations
            return Player.factionInvitations.slice();
        },
        joinFaction: function(name) {
            updateDynamicRam("joinFaction", getRamCost("joinFaction"));
            if (Player.bitNodeN !== 4) {
                if (SourceFileFlags[4] <= 1) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run joinFaction(). It is a Singularity Function and requires SourceFile-4 (level 2) to run.");
                    return false;
                }
            }

            if (!factionExists(name)) {
                workerScript.scriptRef.log("ERROR: Faction specified in joinFaction() does not exist.");
                return false;
            }

            if (!Player.factionInvitations.includes(name)) {
                workerScript.scriptRef.log("ERROR: Cannot join " + name + " Faction because you have not been invited. joinFaction() failed");
                return false;
            }
            var fac = Factions[name];
            joinFaction(fac);

            // Update Faction Invitation list to account for joined + banned factions
            for (var i = 0; i < Player.factionInvitations.length; ++i) {
                if (Player.factionInvitations[i] == name || Factions[Player.factionInvitations[i]].isBanned) {
                    Player.factionInvitations.splice(i, 1);
                    i--;
                }
            }
            Player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain);
            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.joinFaction == null) {
                workerScript.scriptRef.log("Joined the " + name + " faction.");
            }
            return true;
        },
        workForFaction: function(name, type) {
            updateDynamicRam("workForFaction", getRamCost("workForFaction"));
            if (Player.bitNodeN !== 4) {
                if (SourceFileFlags[4] <= 1) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run workForFaction(). It is a Singularity Function and requires SourceFile-4 (level 2) to run.");
                    return false;
                }
            }

            // if the player is in a gang and the target faction is any of the gang faction, fail
            if(Player.inGang() && AllGangs[name] !== undefined) {
                workerScript.scriptRef.log("ERROR: Faction specified in workForFaction() does not offer work at the moment.");
                return;
            }

            if (inMission) {
                workerScript.scriptRef.log("ERROR: workForFaction() failed because you are in the middle of a mission.");
                return;
            }

            if (!factionExists(name)) {
                workerScript.scriptRef.log("ERROR: Faction specified in workForFaction() does not exist.");
                return false;
            }

            if (!Player.factions.includes(name)) {
                workerScript.scriptRef.log("ERROR: workForFaction() failed because you are not a member of " + name);
                return false;
            }

            if (Player.isWorking) {
                var txt = Player.singularityStopWork();
                if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.workForFaction == null) {
                    workerScript.scriptRef.log(txt);
                }
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
                        workerScript.scriptRef.log("ERROR: Cannot carry out hacking contracts for " + fac.name + ". workForFaction() failed");
                        return false;
                    }
                    Player.startFactionHackWork(fac);
                    workerScript.scriptRef.log("Started carrying out hacking contracts for " + fac.name);
                    return true;
                case "field":
                case "fieldwork":
                case "field work":
                    if (!fdWkAvailable.includes(fac.name)) {
                        workerScript.scriptRef.log("ERROR: Cannot carry out field missions for " + fac.name + ". workForFaction() failed");
                        return false;
                    }
                    Player.startFactionFieldWork(fac);
                    workerScript.scriptRef.log("Started carrying out field missions for " + fac.name);
                    return true;
                case "security":
                case "securitywork":
                case "security work":
                    if (!scWkAvailable.includes(fac.name)) {
                        workerScript.scriptRef.log("ERROR: Cannot serve as security detail for " + fac.name + ". workForFaction() failed");
                        return false;
                    }
                    Player.startFactionSecurityWork(fac);
                    workerScript.scriptRef.log("Started serving as security details for " + fac.name);
                    return true;
                default:
                    workerScript.scriptRef.log("ERROR: Invalid work type passed into workForFaction(): " + type);
            }
            return true;
        },
        getFactionRep: function(name) {
            updateDynamicRam("getFactionRep", getRamCost("getFactionRep"));
            if (Player.bitNodeN !== 4) {
                if (SourceFileFlags[4] <= 1) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run getFactionRep(). It is a Singularity Function and requires SourceFile-4 (level 2) to run.");
                    return -1;
                }
            }

            if (!factionExists(name)) {
                workerScript.scriptRef.log("ERROR: Faction specified in getFactionRep() does not exist.");
                return -1;
            }

            return Factions[name].playerReputation;
        },
        getFactionFavor: function(name) {
            updateDynamicRam("getFactionFavor", getRamCost("getFactionFavor"));
            if (Player.bitNodeN !== 4) {
                if (SourceFileFlags[4] <= 1) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run getFactionFavor(). It is a Singularity Function and requires SourceFile-4 (level 2) to run.");
                    return -1;
                }
            }

            if (!factionExists(name)) {
                workerScript.scriptRef.log("ERROR: Faction specified in getFactionFavor() does not exist.");
                return -1;
            }

            return Factions[name].favor;
        },
        getFactionFavorGain: function(name) {
            updateDynamicRam("getFactionFavorGain", getRamCost("getFactionFavorGain"));
            if (Player.bitNodeN !== 4) {
                if (SourceFileFlags[4] <= 1) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run getFactionFavorGain(). It is a Singularity Function and requires SourceFile-4 (level 2) to run.");
                    return -1;
                }
            }

            if (!factionExists(name)) {
                workerScript.scriptRef.log("ERROR: Faction specified in getFactionFavorGain() does not exist.");
                return -1;
            }

            return Factions[name].getFavorGain()[0];
        },
        donateToFaction: function(name, amt) {
            updateDynamicRam("donateToFaction", getRamCost("donateToFaction"));
            if (Player.bitNodeN !== 4) {
                if (SourceFileFlags[4] <= 2) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run donateToFaction(). It is a Singularity Function and requires SourceFile-4 (level 3) to run.");
                    return;
                }
            }

            if (!factionExists(name)) {
                workerScript.log(`ERROR: Faction specified in donateToFaction() does not exist: ${name}`);
                return false;
            }
            if (typeof amt !== 'number' || amt <= 0) {
                workerScript.log(`ERROR: Invalid donation amount specified in donateToFaction(): ${amt}. Must be numeric and positive`);
                return false;
            }
            if (Player.money.lt(amt)) {
                workerScript.log(`ERROR: You do not have enough money to donate $${amt} to ${name}`);
                return false;
            }
            var repNeededToDonate = Math.round(CONSTANTS.BaseFavorToDonate * BitNodeMultipliers.RepToDonateToFaction);
            if (Factions[name].favor < repNeededToDonate) {
                workerScript.log(`ERROR: You do not have enough favor to donate to this faction. Have ${Factions[name].favor}, need ${repNeededToDonate}`);
                return false;
            }
            var repGain = amt / CONSTANTS.DonateMoneyToRepDivisor * Player.faction_rep_mult;
            Factions[name].playerReputation += repGain;
            Player.loseMoney(amt);
            if (workerScript.shouldLog("donateToFaction")) {
                workerScript.log(`$${amt} donated to ${name} for ${repGain} reputation`);
            }
            return true;
        },
        createProgram: function(name) {
            updateDynamicRam("createProgram", getRamCost("createProgram"));
            if (Player.bitNodeN !== 4) {
                if (SourceFileFlags[4] <= 2) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run createProgram(). It is a Singularity Function and requires SourceFile-4 (level 3) to run.");
                    return false;
                }
            }
            if (inMission) {
                workerScript.scriptRef.log("ERROR: createProgram() failed because you are in the middle of a mission.");
                return;
            }
            if (Player.isWorking) {
                var txt = Player.singularityStopWork();
                if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.createProgram == null) {
                    workerScript.scriptRef.log(txt);
                }
            }

            name = name.toLowerCase();

            let p = null;
            for (const key in Programs) {
                if(Programs[key].name.toLowerCase() == name) {
                    p = Programs[key];
                }
            }

            if (p == null) {
                workerScript.scriptRef.log("ERROR: createProgram() failed because the specified program does not exist: " + name);
                return false;
            }

            if (Player.hasProgram(p.name)) {
                workerScript.scriptRef.log('ERROR: createProgram() failed because you already have the ' + p.name + ' program');
                return false;
            }

            if (!p.create.req(Player)) {
                workerScript.scriptRef.log("ERROR: createProgram() failed because hacking level is too low to create " + p.name + " (level " + p.create.level + " req)");
                return false
            }

            Player.startCreateProgramWork(p.name, p.create.time, p.create.level);
            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.createProgram == null) {
                workerScript.scriptRef.log("Began creating program: " + name);
            }
            return true;
        },
        commitCrime: function(crimeRoughName) {
            updateDynamicRam("commitCrime", getRamCost("commitCrime"));
            if (Player.bitNodeN !== 4) {
                if (SourceFileFlags[4] <= 2) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run commitCrime(). It is a Singularity Function and requires SourceFile-4 (level 3) to run.");
                    return;
                }
            }
            if (inMission) {
                workerScript.scriptRef.log("ERROR: commitCrime() failed because you are in the middle of a mission.");
                return;
            }
            if (Player.isWorking) {
                var txt = Player.singularityStopWork();
                if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.commitCrime == null) {
                    workerScript.scriptRef.log(txt);
                }
            }

            // Set Location to slums
            Player.gotoLocation(LocationName.Slums);

            const crime = findCrime(crimeRoughName.toLowerCase());
            if(crime == null) { // couldn't find crime
                throw makeRuntimeRejectMsg(workerScript, "Invalid crime passed into commitCrime(): " + crimeRoughName);
            }
            if(workerScript.disableLogs.ALL == null && workerScript.disableLogs.commitCrime == null) {
                workerScript.scriptRef.log("Attempting to commit crime: "+crime.name+"...");
            }
            return crime.commit(Player, 1, {workerscript: workerScript});
        },
        getCrimeChance: function(crimeRoughName) {
            updateDynamicRam("getCrimeChance", getRamCost("getCrimeChance"));
            if (Player.bitNodeN !== 4) {
                if (SourceFileFlags[4] <= 2) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run getCrimeChance(). It is a Singularity Function and requires SourceFile-4 (level 3) to run.");
                    return;
                }
            }

            const crime = findCrime(crimeRoughName.toLowerCase());
            if(crime == null) {
                throw makeRuntimeRejectMsg(workerScript, "Invalid crime passed into getCrimeChance(): " + crime);
            }

            return crime.successRate(Player);
        },
        getOwnedAugmentations: function(purchased=false) {
            updateDynamicRam("getOwnedAugmentations", getRamCost("getOwnedAugmentations"));
            if (Player.bitNodeN !== 4) {
                if (SourceFileFlags[4] <= 2) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run getOwnedAugmentations(). It is a Singularity Function and requires SourceFile-4 (level 3) to run.");
                    return [];
                }
            }
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
            if (Player.bitNodeN !== 4) {
                if (SourceFileFlags[4] <= 2) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run getOwnedSourceFiles(). It is a Singularity Function and requires SourceFile-4 (level 3) to run.");
                    return [];
                }
            }
            let res = [];
            for (let i = 0; i < Player.sourceFiles.length; ++i) {
                res.push({n: Player.sourceFiles[i].n, lvl: Player.sourceFiles[i].lvl});
            }
            return res;
        },
        getAugmentationsFromFaction: function(facname) {
            updateDynamicRam("getAugmentationsFromFaction", getRamCost("getAugmentationsFromFaction"));
            if (Player.bitNodeN !== 4) {
                if (SourceFileFlags[4] <= 2) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run getAugmentationsFromFaction(). It is a Singularity Function and requires SourceFile-4 (level 3) to run.");
                    return [];
                }
            }

            const fac = Factions[facname];
            if (!(fac instanceof Faction)) {
                workerScript.scriptRef.log("ERROR: getAugmentationsFromFaction() failed. Invalid faction name passed in (this is case-sensitive): " + facname);
                return [];
            }

            // If player has a gang with this faction, return all factions
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

            return fac.augmentations.slice();
        },
        getAugmentationPrereq: function(name) {
            updateDynamicRam("getAugmentationPrereq", getRamCost("getAugmentationPrereq"));
            if (Player.bitNodeN !== 4) {
                if (SourceFileFlags[4] <= 2) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run getAugmentationPrereq(). It is a Singularity Function and requires SourceFile-4 (level 3) to run.");
                    return false;
                }
            }

            if (!augmentationExists(name)) {
                workerScript.scriptRef.log("ERROR: getAugmentationPrereq() failed. Invalid Augmentation name passed in (note: this is case-sensitive): " + name);
                return [];
            }

            var aug = Augmentations[name];
            return aug.prereqs.slice();
        },
        getAugmentationCost: function(name) {
            updateDynamicRam("getAugmentationCost", getRamCost("getAugmentationCost"));
            if (Player.bitNodeN !== 4) {
                if (SourceFileFlags[4] <= 2) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run getAugmentationCost(). It is a Singularity Function and requires SourceFile-4 (level 3) to run.");
                    return false;
                }
            }

            if (!augmentationExists(name)) {
                workerScript.scriptRef.log("ERROR: getAugmentationCost() failed. Invalid Augmentation name passed in (note: this is case-sensitive): " + name);
                return [-1, -1];
            }

            var aug = Augmentations[name];
            return [aug.baseRepRequirement, aug.baseCost];
        },
        purchaseAugmentation: function(faction, name) {
            updateDynamicRam("purchaseAugmentation", getRamCost("purchaseAugmentation"));
            if (Player.bitNodeN !== 4) {
                if (SourceFileFlags[4] <= 2) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run purchaseAugmentation(). It is a Singularity Function and requires SourceFile-4 (level 3) to run.");
                    return false;
                }
            }

            const fac = Factions[faction];
            if (!(fac instanceof Faction)) {
                workerScript.log("ERROR: purchaseAugmentation() failed because of invalid faction name: " + faction);
                return false;
            }

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
                workerScript.log("ERROR: purchaseAugmentation() failed because the faction " + faction + " does not contain the " + name + " augmentation");
                return false;
            }

            const aug = Augmentations[name];
            if (!(aug instanceof Augmentation)) {
                workerScript.log("ERROR: purchaseAugmentation() failed because of invalid augmentation name: " + name);
                return false;
            }

            let isNeuroflux = (aug.name === AugmentationNames.NeuroFluxGovernor);
            if (!isNeuroflux) {
                for (let j = 0; j < Player.queuedAugmentations.length; ++j) {
                    if (Player.queuedAugmentations[j].name === aug.name) {
                        workerScript.log("ERROR: purchaseAugmentation() failed because you already have " + name);
                        return false;
                    }
                }
                for (let j = 0; j < Player.augmentations.length; ++j) {
                    if (Player.augmentations[j].name === aug.name) {
                        workerScript.log("ERROR: purchaseAugmentation() failed because you already have " + name);
                        return false;
                    }
                }
            }

            if (fac.playerReputation < aug.baseRepRequirement) {
                workerScript.log("ERROR: purchaseAugmentation() failed because you do not have enough reputation with " + fac.name);
                return false;
            }

            var res = purchaseAugmentation(aug, fac, true);
            workerScript.log(res);
            if (isString(res) && res.startsWith("You purchased")) {
                Player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain);
                return true;
            } else {
                return false;
            }
        },
        installAugmentations: function(cbScript) {
            updateDynamicRam("installAugmentations", getRamCost("installAugmentations"));
            if (Player.bitNodeN !== 4) {
                if (SourceFileFlags[4] <= 2) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run installAugmentations(). It is a Singularity Function and requires SourceFile-4 (level 3) to run.");
                    return false;
                }
            }

            if (Player.queuedAugmentations.length === 0) {
                workerScript.scriptRef.log("ERROR: installAugmentations() failed because you do not have any Augmentations to be installed");
                return false;
            }
            Player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain);
            workerScript.scriptRef.log("Installing Augmentations. This will cause this script to be killed");
            installAugmentations(cbScript);
            return true;
        },

        // Gang API
        gang: {
            getMemberNames: function() {
                updateDynamicRam("getMemberNames", getRamCost("gang", "getMemberNames"));
                nsGang.checkGangApiAccess(workerScript, "getMemberNames");

                try {
                    const names = [];
                    for (const member of Player.gang.members) {
                        names.push(member.name);
                    }
                    return names;
                } catch(e) {
                    throw makeRuntimeRejectMsg(workerScript, nsGang.unknownGangApiExceptionMessage("getMemberNames", e));
                }
            },
            getGangInformation: function() {
                updateDynamicRam("getGangInformation", getRamCost("gang", "getGangInformation"));
                nsGang.checkGangApiAccess(workerScript, "getGangInformation");

                try {
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
                    }
                } catch(e) {
                    throw makeRuntimeRejectMsg(workerScript, nsGang.unknownGangApiExceptionMessage("getGangInformation", e));
                }
            },
            getOtherGangInformation: function() {
                updateDynamicRam("getOtherGangInformation", getRamCost("gang", "getOtherGangInformation"));
                nsGang.checkGangApiAccess(workerScript, "getOtherGangInformation");

                try {
                    // We have to make a deep copy
                    const cpy = {};
                    for (const gang in AllGangs) {
                        cpy[gang] = Object.assign({}, AllGangs[gang]);
                    }

                    return cpy;
                } catch(e) {
                    throw makeRuntimeRejectMsg(workerScript, nsGang.unknownGangApiExceptionMessage("getOtherGangInformation", e));
                }
            },
            getMemberInformation: function(name) {
                updateDynamicRam("getMemberInformation", getRamCost("gang", "getMemberInformation"));
                nsGang.checkGangApiAccess(workerScript, "getMemberInformation");

                try {
                    for (const member of Player.gang.members) {
                        if (member.name === name) {
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
                        }
                    }

                    workerScript.log(`Invalid argument passed to gang.getMemberInformation(). No gang member could be found with name ${name}`);
                    return {}; // Member could not be found
                } catch(e) {
                    throw makeRuntimeRejectMsg(workerScript, nsGang.unknownGangApiExceptionMessage("getMemberInformation", e));
                }
            },
            canRecruitMember: function() {
                updateDynamicRam("canRecruitMember", getRamCost("gang", "canRecruitMember"));
                nsGang.checkGangApiAccess(workerScript, "canRecruitMember");

                try {
                    return Player.gang.canRecruitMember();
                } catch(e) {
                    throw makeRuntimeRejectMsg(workerScript, nsGang.unknownGangApiExceptionMessage("canRecruitMember", e));
                }
            },
            recruitMember: function(name) {
                updateDynamicRam("recruitMember", getRamCost("gang", "recruitMember"));
                nsGang.checkGangApiAccess(workerScript, "recruitMember");

                try {
                    const res = Player.gang.recruitMember(name);
                    if (workerScript.shouldLog("recruitMember")) {
                        if (res) {
                            workerScript.log(`Successfully recruited Gang Member ${name}`);
                        } else {
                            workerScript.log(`Failed to recruit Gang Member ${name}`);
                        }
                    }

                    return res;
                } catch(e) {
                    throw makeRuntimeRejectMsg(workerScript, nsGang.unknownGangApiExceptionMessage("recruitMember", e));
                }
            },
            getTaskNames: function() {
                updateDynamicRam("getTaskNames", getRamCost("gang", "getTaskNames"));
                nsGang.checkGangApiAccess(workerScript, "getTaskNames");

                try {
                    const tasks = Player.gang.getAllTaskNames();
                    tasks.unshift("Unassigned");
                    return tasks;
                } catch(e) {
                    throw makeRuntimeRejectMsg(workerScript, nsGang.unknownGangApiExceptionMessage("getTaskNames", e));
                }
            },
            setMemberTask: function(memberName, taskName) {
                updateDynamicRam("setMemberTask", getRamCost("gang", "setMemberTask"));
                nsGang.checkGangApiAccess(workerScript, "setMemberTask");

                try {
                    for (const member of Player.gang.members) {
                        if (member.name === memberName) {
                            const res = member.assignToTask(taskName);
                            if (workerScript.shouldLog("setMemberTask")) {
                                if (res) {
                                    workerScript.log(`Successfully assigned Gang Member ${memberName} to ${taskName} task`);
                                } else {
                                    workerScript.log(`Failed to assign Gang Member ${memberName} to ${taskName} task. ${memberName} is now Unassigned`);
                                }
                            }

                            return res;
                        }
                    }

                    workerScript.log(`Invalid argument passed to gang.setMemberTask(). No gang member could be found with name ${memberName}`);
                    return false;
                } catch(e) {
                    throw makeRuntimeRejectMsg(workerScript, nsGang.unknownGangApiExceptionMessage("setMemberTask", e));
                }
            },
            getEquipmentNames: function() {
                updateDynamicRam("getEquipmentNames", getRamCost("gang", "getEquipmentNames"));
                nsGang.checkGangApiAccess(workerScript, "getEquipmentNames");

                try {
                    return Player.gang.getAllUpgradeNames();
                } catch(e) {
                    throw makeRuntimeRejectMsg(workerScript, nsGang.unknownGangApiExceptionMessage("getEquipmentNames", e));
                }
            },
            getEquipmentCost: function(equipName) {
                updateDynamicRam("getEquipmentCost", getRamCost("gang", "getEquipmentCost"));
                nsGang.checkGangApiAccess(workerScript, "getEquipmentCost");

                try {
                    return Player.gang.getUpgradeCost(equipName);
                } catch(e) {
                    throw makeRuntimeRejectMsg(workerScript, nsGang.unknownGangApiExceptionMessage("getEquipmentCost", e));
                }
            },
            getEquipmentType: function(equipName) {
                updateDynamicRam("getEquipmentType", getRamCost("gang", "getEquipmentType"));
                nsGang.checkGangApiAccess(workerScript, "getEquipmentType");

                try {
                    return Player.gang.getUpgradeType(equipName);
                } catch(e) {
                    throw makeRuntimeRejectMsg(workerScript, nsGang.unknownGangApiExceptionMessage("getEquipmentType", e));
                }
            },
            purchaseEquipment: function(memberName, equipName) {
                updateDynamicRam("purchaseEquipment", getRamCost("gang", "purchaseEquipment"));
                nsGang.checkGangApiAccess(workerScript, "purchaseEquipment");

                try {
                    for (const member of Player.gang.members) {
                        if (member.name === memberName) {
                            const res = member.buyUpgrade(equipName, Player, Player.gang);
                            if (workerScript.shouldLog("purchaseEquipment")) {
                                if (res) {
                                    workerScript.log(`Purchased ${equipName} for Gang member ${memberName}`);
                                } else {
                                    workerScript.log(`Failed to purchase ${equipName} for Gang member ${memberName}`);
                                }
                            }

                            return res;
                        }
                    }

                    workerScript.log(`Invalid argument passed to gang.purchaseEquipment(). No gang member could be found with name ${memberName}`);
                    return false;
                } catch(e) {
                    throw makeRuntimeRejectMsg(workerScript, nsGang.unknownGangApiExceptionMessage("purchaseEquipment", e));
                }
            },
            ascendMember: function(name) {
                updateDynamicRam("ascendMember", getRamCost("gang", "ascendMember"));
                nsGang.checkGangApiAccess(workerScript, "ascendMember");

                try {
                    for (const member of Player.gang.members) {
                        if (member.name === name) {
                            return Player.gang.ascendMember(member, workerScript);
                        }
                    }

                    workerScript.log(`Invalid argument passed to gang.ascendMember(). No gang member could be found with name ${name}`);
                    return false;
                } catch(e) {
                    throw makeRuntimeRejectMsg(workerScript, nsGang.unknownGangApiExceptionMessage("ascendMember", e));
                }
            },
            setTerritoryWarfare: function(engage) {
                updateDynamicRam("setTerritoryWarfare", getRamCost("gang", "setTerritoryWarfare"));
                nsGang.checkGangApiAccess(workerScript, "setTerritoryWarfare");

                try {
                    if (engage) {
                        Player.gang.territoryWarfareEngaged = true;
                        if (workerScript.shouldLog("setTerritoryWarfare")) {
                            workerScript.log("Engaging in Gang Territory Warfare");
                        }
                    } else {
                        Player.gang.territoryWarfareEngaged = false;
                        if (workerScript.shouldLog("setTerritoryWarfare")) {
                            workerScript.log("Disengaging in Gang Territory Warfare");
                        }
                    }
                } catch(e) {
                    throw makeRuntimeRejectMsg(workerScript, nsGang.unknownGangApiExceptionMessage("setTerritoryWarfare", e));
                }
            },
            getChanceToWinClash: function(otherGang) {
                updateDynamicRam("getChanceToWinClash", getRamCost("gang", "getChanceToWinClash"));
                nsGang.checkGangApiAccess(workerScript, "getChanceToWinClash");

                try {
                    if (AllGangs[otherGang] == null) {
                        workerScript.log(`Invalid gang specified in gang.getChanceToWinClash() : ${otherGang}`);
                        return 0;
                    }

                    const playerPower = AllGangs[Player.gang.facName].power;
                    const otherPower = AllGangs[otherGang].power;

                    return playerPower / (otherPower + playerPower);
                } catch(e) {
                    throw makeRuntimeRejectMsg(workerScript, nsGang.unknownGangApiExceptionMessage("getChanceToWinClash", e));
                }
            },
            getBonusTime: function() {
                nsGang.checkGangApiAccess(workerScript, "getBonusTime");

                try {
                    return Math.round(Player.gang.storedCycles / 5);
                } catch(e) {
                    throw makeRuntimeRejectMsg(workerScript, nsGang.unknownGangApiExceptionMessage("getBonusTime", e));
                }
            },
        }, // end gang namespace

        // Bladeburner API
        bladeburner: {
            getContractNames: function() {
                updateDynamicRam("getContractNames", getRamCost("bladeburner", "getContractNames"));
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || SourceFileFlags[7] > 0)) {
                    return Player.bladeburner.getContractNamesNetscriptFn();
                }
                throw makeRuntimeRejectMsg(workerScript, "getContractNames() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            getOperationNames: function() {
                updateDynamicRam("getOperationNames", getRamCost("bladeburner", "getOperationNames"));
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || SourceFileFlags[7] > 0)) {
                    return Player.bladeburner.getOperationNamesNetscriptFn();
                }
                throw makeRuntimeRejectMsg(workerScript, "getOperationNames() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            getBlackOpNames: function() {
                updateDynamicRam("getBlackOpNames", getRamCost("bladeburner", "getBlackOpNames"));
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || SourceFileFlags[7] > 0)) {
                    return Player.bladeburner.getBlackOpNamesNetscriptFn();
                }
                throw makeRuntimeRejectMsg(workerScript, "getBlackOpNames() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            getBlackOpRank: function(name="") {
                updateDynamicRam("getBlackOpRank", getRamCost("bladeburner", "getBlackOpRank"));
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || SourceFileFlags[7] > 0)) {
                    const actionId = Player.bladeburner.getActionIdFromTypeAndName('blackops', name)
                    if (!actionId) {
                        return -1;
                    }
                    const actionObj = Player.bladeburner.getActionObject(actionId);
                    if (!actionObj) {
                        return -1;
                    }
                    return actionObj.reqdRank;
                }
                throw makeRuntimeRejectMsg(workerScript, "getBlackOpRank() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            getGeneralActionNames: function() {
                updateDynamicRam("getGeneralActionNames", getRamCost("bladeburner", "getGeneralActionNames"));
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || SourceFileFlags[7] > 0)) {
                    return Player.bladeburner.getGeneralActionNamesNetscriptFn();
                }
                throw makeRuntimeRejectMsg(workerScript, "getGeneralActionNames() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            getSkillNames: function() {
                updateDynamicRam("getSkillNames", getRamCost("bladeburner", "getSkillNames"));
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || SourceFileFlags[7] > 0)) {
                    return Player.bladeburner.getSkillNamesNetscriptFn();
                }
                throw makeRuntimeRejectMsg(workerScript, "getSkillNames() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            startAction: function(type="", name="") {
                updateDynamicRam("startAction", getRamCost("bladeburner", "startAction"));
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || SourceFileFlags[7] > 0)) {
                    try {
                        return Player.bladeburner.startActionNetscriptFn(type, name, workerScript);
                    } catch(e) {
                        throw makeRuntimeRejectMsg(workerScript, "Bladeburner.startAction() failed with exception: " + e);
                    }
                }
                throw makeRuntimeRejectMsg(workerScript, "startAction() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            stopBladeburnerAction: function() {
                updateDynamicRam("stopBladeburnerAction", getRamCost("bladeburner", "stopBladeburnerAction"));
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || SourceFileFlags[7] > 0)) {
                    return Player.bladeburner.resetAction();
                }
                throw makeRuntimeRejectMsg(workerScript, "stopBladeburnerAction() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            getCurrentAction: function() {
                updateDynamicRam("getCurrentAction", getRamCost("bladeburner", "getCurrentAction"));
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || SourceFileFlags[7] > 0)) {
                    return Player.bladeburner.getTypeAndNameFromActionId(Player.bladeburner.action);
                }
                throw makeRuntimeRejectMsg(workerScript, "getCurrentAction() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            getActionTime: function(type="", name="") {
                updateDynamicRam("getActionTime", getRamCost("bladeburner", "getActionTime"));
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || SourceFileFlags[7] > 0)) {
                    try {
                        return Player.bladeburner.getActionTimeNetscriptFn(type, name, workerScript);
                    } catch(e) {
                        throw makeRuntimeRejectMsg(workerScript, "Bladeburner.getActionTime() failed with exception: " + e);
                    }
                }
                throw makeRuntimeRejectMsg(workerScript, "getActionTime() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            getActionEstimatedSuccessChance: function(type="", name="") {
                updateDynamicRam("getActionEstimatedSuccessChance", getRamCost("bladeburner", "getActionEstimatedSuccessChance"));
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || SourceFileFlags[7] > 0)) {
                    try {
                        return Player.bladeburner.getActionEstimatedSuccessChanceNetscriptFn(type, name, workerScript);
                    } catch(e) {
                        throw makeRuntimeRejectMsg(workerScript, "Bladeburner.getActionEstimatedSuccessChance() failed with exception: " + e);
                    }
                }
                throw makeRuntimeRejectMsg(workerScript, "getActionEstimatedSuccessChance() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            getActionRepGain: function(type="", name="", level) {
                updateDynamicRam("getActionRepGain", getRamCost("bladeburner", "getActionRepGain"));
                checkBladeburnerAccess(workerScript, "getActionRepGain");

                try {
                    var errorLogText = unknownBladeburnerActionErrorMessage("getActionAutolevel", type, name);
                    const actionId = Player.bladeburner.getActionIdFromTypeAndName(type, name);
                    if (actionId == null) {
                        workerScript.log(errorLogText);
                        return -1;
                    }
                    const actionObj = Player.bladeburner.getActionObject(actionId);
                    if (actionObj == null) {
                        workerScript.log(errorLogText);
                        return -1;
                    }
                    var rewardMultiplier;
                    if (level == null || isNaN(level)) {
                        rewardMultiplier = Math.pow(actionObj.rewardFac, actionObj.level - 1);
                    } else {
                        rewardMultiplier = Math.pow(actionObj.rewardFac, level - 1);
                    }

                    return actionObj.rankGain * rewardMultiplier * BitNodeMultipliers.BladeburnerRank;
                } catch(err) {
                    throw makeRuntimeRejectMsg(workerScript, unknownBladeburnerExceptionMessage("getActionAutolevel", err));
                }
            },
            getActionCountRemaining: function(type="", name="") {
                updateDynamicRam("getActionCountRemaining", getRamCost("bladeburner", "getActionCountRemaining"));
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || SourceFileFlags[7] > 0)) {
                    try {
                        return Player.bladeburner.getActionCountRemainingNetscriptFn(type, name, workerScript);
                    } catch(e) {
                        throw makeRuntimeRejectMsg(workerScript, "Bladeburner.getActionCountRemaining() failed with exception: " + e);
                    }
                }
                throw makeRuntimeRejectMsg(workerScript, "getActionCountRemaining() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            getActionMaxLevel: function(type="", name="") {
                updateDynamicRam("getActionMaxLevel", getRamCost("bladeburner", "getActionMaxLevel"));
                checkBladeburnerAccess(workerScript, "getActionMaxLevel");

                try {
                    var errorLogText = unknownBladeburnerActionErrorMessage("getActionMaxLevel", type, name);
                    const actionId = Player.bladeburner.getActionIdFromTypeAndName(type, name);
                    if (actionId == null) {
                        workerScript.log(errorLogText);
                        return -1;
                    }
                    const actionObj = Player.bladeburner.getActionObject(actionId);
                    if (actionObj == null) {
                        workerScript.log(errorLogText);
                        return -1;
                    }
                    return actionObj.maxLevel;
                } catch(err) {
                    throw makeRuntimeRejectMsg(workerScript, unknownBladeburnerExceptionMessage("getActionMaxLevel", err));
                }
            },
            getActionCurrentLevel: function(type="", name="") {
                updateDynamicRam("getActionCurrentLevel", getRamCost("bladeburner", "getActionCurrentLevel"));
                checkBladeburnerAccess(workerScript, "getActionCurrentLevel");

                try {
                    var errorLogText = unknownBladeburnerActionErrorMessage("getActionCurrentLevel", type, name);
                    const actionId = Player.bladeburner.getActionIdFromTypeAndName(type, name);
                    if (actionId == null) {
                        workerScript.log(errorLogText);
                        return -1;
                    }
                    const actionObj = Player.bladeburner.getActionObject(actionId);
                    if (actionObj == null) {
                        workerScript.log(errorLogText);
                        return -1;
                    }
                    return actionObj.level;
                } catch(err) {
                    throw makeRuntimeRejectMsg(workerScript, unknownBladeburnerExceptionMessage("getActionCurrentLevel", err));
                }
            },
            getActionAutolevel: function(type="", name="") {
                updateDynamicRam("getActionAutolevel", getRamCost("bladeburner", "getActionAutolevel"));
                checkBladeburnerAccess(workerScript, "getActionAutolevel");

                try {
                    var errorLogText = unknownBladeburnerActionErrorMessage("getActionAutolevel", type, name);
                    const actionId = Player.bladeburner.getActionIdFromTypeAndName(type, name);
                    if (actionId == null) {
                        workerScript.log(errorLogText);
                        return false;
                    }
                    const actionObj = Player.bladeburner.getActionObject(actionId);
                    if (actionObj == null) {
                        workerScript.log(errorLogText);
                        return false;
                    }
                    return actionObj.autoLevel;
                } catch(err) {
                    throw makeRuntimeRejectMsg(workerScript, unknownBladeburnerExceptionMessage("getActionAutolevel", err));
                }
            },
            setActionAutolevel: function(type="", name="", autoLevel=true) {
                updateDynamicRam("setActionAutolevel", getRamCost("bladeburner", "setActionAutolevel"));
                checkBladeburnerAccess(workerScript, "setActionAutolevel");

                try {
                    var errorLogText = unknownBladeburnerActionErrorMessage("setActionAutolevel", type, name);
                    const actionId = Player.bladeburner.getActionIdFromTypeAndName(type, name);
                    if (actionId == null) {
                        workerScript.log(errorLogText);
                        return;
                    }
                    const actionObj = Player.bladeburner.getActionObject(actionId);
                    if (actionObj == null) {
                        workerScript.log(errorLogText);
                        return;
                    }
                    actionObj.autoLevel = autoLevel;
                } catch(err) {
                    throw makeRuntimeRejectMsg(workerScript, unknownBladeburnerExceptionMessage("setActionAutolevel", err));
                }
            },
            setActionLevel: function(type="", name="", level=1) {
                updateDynamicRam("setActionLevel", getRamCost("bladeburner", "setActionLevel"));
                checkBladeburnerAccess(workerScript, "setActionLevel");

                try {
                    var errorLogText = unknownBladeburnerActionErrorMessage("setActionLevel", type, name);
                    const actionId = Player.bladeburner.getActionIdFromTypeAndName(type, name);
                    if (actionId == null) {
                        workerScript.log(errorLogText);
                        return;
                    }
                    const actionObj = Player.bladeburner.getActionObject(actionId);
                    if (actionObj == null) {
                        workerScript.log(errorLogText);
                        return;
                    }
                    if(level > actionObj.maxLevel) {
                        workerScript.log(`ERROR: bladeburner.${setActionLevel}() failed because level exceeds max level for given action.`);
                        return;
                    }
                    if(level < 1) {
                        workerScript.log(`ERROR: bladeburner.${setActionLevel}() failed because level is below 1.`);
                        return;
                    }
                    actionObj.level = level;
                } catch(err) {
                    throw makeRuntimeRejectMsg(workerScript, unknownBladeburnerExceptionMessage("setActionLevel", err));
                }
            },
            getRank: function() {
                updateDynamicRam("getRank", getRamCost("bladeburner", "getRank"));
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || SourceFileFlags[7] > 0)) {
                    return Player.bladeburner.rank;
                }
                throw makeRuntimeRejectMsg(workerScript, "getRank() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            getSkillPoints: function() {
                updateDynamicRam("getSkillPoints", getRamCost("bladeburner", "getSkillPoints"));
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || SourceFileFlags[7] > 0)) {
                    return Player.bladeburner.skillPoints;
                }
                throw makeRuntimeRejectMsg(workerScript, "getSkillPoints() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            getSkillLevel: function(skillName="") {
                updateDynamicRam("getSkillLevel", getRamCost("bladeburner", "getSkillLevel"));
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || SourceFileFlags[7] > 0)) {
                    try {
                        return Player.bladeburner.getSkillLevelNetscriptFn(skillName, workerScript);
                    } catch(e) {
                        throw makeRuntimeRejectMsg(workerScript, "Bladeburner.getSkillLevel() failed with exception: " + e);
                    }
                }
                throw makeRuntimeRejectMsg(workerScript, "getSkillLevel() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            getSkillUpgradeCost: function(skillName="") {
                updateDynamicRam("getSkillUpgradeCost", getRamCost("bladeburner", "getSkillUpgradeCost"));
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || SourceFileFlags[7] > 0)) {
                    try {
                        return Player.bladeburner.getSkillUpgradeCostNetscriptFn(skillName, workerScript);
                    } catch(e) {
                        throw makeRuntimeRejectMsg(workerScript, "Bladeburner.getSkillUpgradeCost() failed with exception: " + e);
                    }
                }
                throw makeRuntimeRejectMsg(workerScript, "getSkillUpgradeCost() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            upgradeSkill: function(skillName) {
                updateDynamicRam("upgradeSkill", getRamCost("bladeburner", "upgradeSkill"));
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || SourceFileFlags[7] > 0)) {
                    try {
                        return Player.bladeburner.upgradeSkillNetscriptFn(skillName, workerScript);
                    } catch(e) {
                        throw makeRuntimeRejectMsg(workerScript, "Bladeburner.upgradeSkill() failed with exception: " + e);
                    }
                }
                throw makeRuntimeRejectMsg(workerScript, "upgradeSkill() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            getTeamSize: function(type="", name="") {
                updateDynamicRam("getTeamSize", getRamCost("bladeburner", "getTeamSize"));
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || SourceFileFlags[7] > 0)) {
                    try {
                        return Player.bladeburner.getTeamSizeNetscriptFn(type, name, workerScript);
                    } catch(e) {
                        throw makeRuntimeRejectMsg(workerScript, "Bladeburner.getTeamSize() failed with exception: " + e);
                    }
                }
                throw makeRuntimeRejectMsg(workerScript, "getTeamSize() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            setTeamSize: function(type="", name="", size) {
                updateDynamicRam("setTeamSize",getRamCost("bladeburner", "setTeamSize"));
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || SourceFileFlags[7] > 0)) {
                    try {
                        return Player.bladeburner.setTeamSizeNetscriptFn(type, name, size, workerScript);
                    } catch(e) {
                        throw makeRuntimeRejectMsg(workerScript, "Bladeburner.setTeamSize() failed with exception: " + e);
                    }
                }
                throw makeRuntimeRejectMsg(workerScript, "setTeamSize() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            getCityEstimatedPopulation: function(cityName) {
                updateDynamicRam("getCityEstimatedPopulation", getRamCost("bladeburner", "getCityEstimatedPopulation"));
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || SourceFileFlags[7] > 0)) {
                    try {
                        return Player.bladeburner.getCityEstimatedPopulationNetscriptFn(cityName, workerScript);
                    } catch(e) {
                        throw makeRuntimeRejectMsg(workerScript, "Bladeburner.getCityEstimatedPopulation() failed with exception: " + e);
                    }
                }
                throw makeRuntimeRejectMsg(workerScript, "getCityEstimatedPopulation() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            getCityEstimatedCommunities: function(cityName) {
                updateDynamicRam("getCityEstimatedCommunities", getRamCost("bladeburner", "getCityEstimatedCommunities"));
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || SourceFileFlags[7] > 0)) {
                    try {
                        return Player.bladeburner.getCityEstimatedCommunitiesNetscriptFn(cityName, workerScript);
                    } catch(e) {
                        throw makeRuntimeRejectMsg(workerScript, "Bladeburner.getCityEstimatedCommunities() failed with exception: " + e);
                    }
                }
                throw makeRuntimeRejectMsg(workerScript, "getCityEstimatedCommunities() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            getCityChaos: function(cityName) {
                updateDynamicRam("getCityChaos", getRamCost("bladeburner", "getCityChaos"));
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || SourceFileFlags[7] > 0)) {
                    try {
                        return Player.bladeburner.getCityChaosNetscriptFn(cityName, workerScript);
                    } catch(e) {
                        throw makeRuntimeRejectMsg(workerScript, "Bladeburner.getCityChaos() failed with exception: " + e);
                    }
                }
                throw makeRuntimeRejectMsg(workerScript, "getCityChaos() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            getCity: function() {
                updateDynamicRam("getCity", getRamCost("bladeburner", "getCity"));
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || SourceFileFlags[7] > 0)) {
                    try {
                        return Player.bladeburner.city;
                    } catch(e) {
                        throw makeRuntimeRejectMsg(workerScript, "Bladeburner.getCity() failed with exception: " + e);
                    }
                }
                throw makeRuntimeRejectMsg(workerScript, "getCity() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            switchCity: function(cityName) {
                updateDynamicRam("switchCity", getRamCost("bladeburner", "switchCity"));
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || SourceFileFlags[7] > 0)) {
                    try {
                        return Player.bladeburner.switchCityNetscriptFn(cityName, workerScript);
                    } catch(e) {
                        throw makeRuntimeRejectMsg(workerScript, "Bladeburner.switchCity() failed with exception: " + e);
                    }
                }
                throw makeRuntimeRejectMsg(workerScript, "switchCity() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            getStamina: function() {
                updateDynamicRam("getStamina", getRamCost("bladeburner", "getStamina"));
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || SourceFileFlags[7] > 0)) {
                    return [Player.bladeburner.stamina, Player.bladeburner.maxStamina];
                }
                throw makeRuntimeRejectMsg(workerScript, "getStamina() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            joinBladeburnerFaction: function() {
                updateDynamicRam("joinBladeburnerFaction", getRamCost("bladeburner", "joinBladeburnerFaction"));
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || SourceFileFlags[7] > 0)) {
                    return Player.bladeburner.joinBladeburnerFactionNetscriptFn(workerScript);
                }
                throw makeRuntimeRejectMsg(workerScript, "joinBladeburnerFaction() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            joinBladeburnerDivision: function() {
                updateDynamicRam("joinBladeburnerDivision", getRamCost("bladeburner", "joinBladeburnerDivision"));
                if ((Player.bitNodeN === 7 || SourceFileFlags[7] > 0)) {
                    if (Player.bitNodeN === 8) { return false; }
                    if (Player.bladeburner instanceof Bladeburner) {
                        return true; // Already member
                    } else if (Player.strength >= 100 && Player.defense >= 100 &&
                               Player.dexterity >= 100 && Player.agility >= 100) {
                        Player.bladeburner = new Bladeburner({new:true});
                        workerScript.log("You have been accepted into the Bladeburner division");

                        const worldHeader = document.getElementById("world-menu-header");
                        if (worldHeader instanceof HTMLElement) {
                            worldHeader.click(); worldHeader.click();
                        }

                        return true;
                    } else {
                        workerScript.log("You do not meet the requirements for joining the Bladeburner division");
                        return false;
                    }
                }
                throw makeRuntimeRejectMsg(workerScript, "joinBladeburnerDivision() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            getBonusTime: function() {
                if ((Player.bitNodeN === 7 || SourceFileFlags[7] > 0)) {
                    return Math.round(Player.bladeburner.storedCycles / 5);
                }
                throw makeRuntimeRejectMsg(workerScript, "getBonusTime() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            }
        }, // End Bladeburner

        // Coding Contract API
        codingcontract: {
            attempt: function(answer, fn, ip=workerScript.serverIp, { returnReward } = {}) {
                updateDynamicRam("attempt", getRamCost("codingcontract", "attempt"));
                const contract = getCodingContract(fn, ip);
                if (contract == null) {
                    workerScript.log(`ERROR: codingcontract.getData() failed because it could find the specified contract ${fn} on server ${ip}`);
                    return false;
                }

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
                    workerScript.log(`Successfully completed Coding Contract ${fn}. Reward: ${reward}`);
                    serv.removeContract(fn);
                    return returnReward ? reward : true;
                } else {
                    ++contract.tries;
                    if (contract.tries >= contract.getMaxNumTries()) {
                        workerScript.log(`Coding Contract ${fn} failed. Contract is now self-destructing`);
                        serv.removeContract(fn);
                    } else {
                        workerScript.log(`Coding Contract ${fn} failed. ${contract.getMaxNumTries() - contract.tries} attempts remaining`);
                    }

                    return returnReward ? "" : false;
                }
            },
            getContractType: function(fn, ip=workerScript.serverIp) {
                updateDynamicRam("getContractType", getRamCost("codingcontract", "getContractType"));
                let contract = getCodingContract(fn, ip);
                if (contract == null) {
                    workerScript.log(`ERROR: codingcontract.getData() failed because it could find the specified contract ${fn} on server ${ip}`);
                    return null;
                }
                return contract.getType();
            },
            getData: function(fn, ip=workerScript.serverIp) {
                updateDynamicRam("getData", getRamCost("codingcontract", "getData"));
                let contract = getCodingContract(fn, ip);
                if (contract == null) {
                    workerScript.log(`ERROR: codingcontract.getData() failed because it could find the specified contract ${fn} on server ${ip}`);
                    return null;
                }
                let data = contract.getData();
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
                var contract = getCodingContract(fn, ip);
                if (contract == null) {
                    workerScript.log(`ERROR: codingcontract.getDescription() failed because it could find the specified contract ${fn} on server ${ip}`);
                    return "";
                }
                return contract.getDescription();
            },
            getNumTriesRemaining: function(fn, ip=workerScript.serverIp) {
                updateDynamicRam("getNumTriesRemaining", getRamCost("codingcontract", "getNumTriesRemaining"));
                var contract = getCodingContract(fn, ip);
                if (contract == null) {
                    workerScript.log(`ERROR: codingcontract.getNumTriesRemaining() failed because it could find the specified contract ${fn} on server ${ip}`);
                    return -1;
                }
                return contract.getMaxNumTries() - contract.tries;
            },
        }, // End coding contracts

        // Duplicate Sleeve API
        sleeve: {
            getNumSleeves: function() {
                if (Player.bitNodeN !== 10 && !SourceFileFlags[10]) {
                    throw makeRuntimeRejectMsg(workerScript, "getNumSleeves() failed because you do not currently have access to the Sleeve API. This is either because you are not in BitNode-10 or because you do not have Source-File 10");
                }
                updateDynamicRam("getNumSleeves", getRamCost("sleeve", "getNumSleeves"));
                return Player.sleeves.length;
            },
            setToShockRecovery: function(sleeveNumber=0) {
                if (Player.bitNodeN !== 10 && !SourceFileFlags[10]) {
                    throw makeRuntimeRejectMsg(workerScript, "setToShockRecovery() failed because you do not currently have access to the Sleeve API. This is either because you are not in BitNode-10 or because you do not have Source-File 10");
                }
                updateDynamicRam("setToShockRecovery", getRamCost("sleeve", "setToShockRecovery"));
                if (sleeveNumber >= Player.sleeves.length || sleeveNumber < 0) {
                    workerScript.log(`ERROR: sleeve.setToShockRecovery(${sleeveNumber}) failed because it is an invalid sleeve number.`);
                    return false;
                }

                return Player.sleeves[sleeveNumber].shockRecovery(Player);
            },
            setToSynchronize: function(sleeveNumber=0) {
                if (Player.bitNodeN !== 10 && !SourceFileFlags[10]) {
                    throw makeRuntimeRejectMsg(workerScript, "setToSynchronize() failed because you do not currently have access to the Sleeve API. This is either because you are not in BitNode-10 or because you do not have Source-File 10");
                }
                updateDynamicRam("setToSynchronize", getRamCost("sleeve", "setToSynchronize"));
                if (sleeveNumber >= Player.sleeves.length || sleeveNumber < 0) {
                    workerScript.log(`ERROR: sleeve.setToSynchronize(${sleeveNumber}) failed because it is an invalid sleeve number.`);
                    return false;
                }

                return Player.sleeves[sleeveNumber].synchronize(Player);
            },
            setToCommitCrime: function(sleeveNumber=0, crimeName="") {
                if (Player.bitNodeN !== 10 && !SourceFileFlags[10]) {
                    throw makeRuntimeRejectMsg(workerScript, "setToCommitCrime() failed because you do not currently have access to the Sleeve API. This is either because you are not in BitNode-10 or because you do not have Source-File 10");
                }
                updateDynamicRam("setToCommitCrime", getRamCost("sleeve", "setToCommitCrime"));
                if (sleeveNumber >= Player.sleeves.length || sleeveNumber < 0) {
                    workerScript.log(`ERROR: sleeve.setToCommitCrime(${sleeveNumber}) failed because it is an invalid sleeve number.`);
                    return false;
                }

                return Player.sleeves[sleeveNumber].commitCrime(Player, crimeName);
            },
            setToUniversityCourse: function(sleeveNumber=0, universityName="", className="") {
                if (Player.bitNodeN !== 10 && !SourceFileFlags[10]) {
                    throw makeRuntimeRejectMsg(workerScript, "setToUniversityCourse() failed because you do not currently have access to the Sleeve API. This is either because you are not in BitNode-10 or because you do not have Source-File 10");
                }
                updateDynamicRam("setToUniversityCourse", getRamCost("sleeve", "setToUniversityCourse"));
                if (sleeveNumber >= Player.sleeves.length || sleeveNumber < 0) {
                    workerScript.log(`ERROR: sleeve.setToUniversityCourse(${sleeveNumber}) failed because it is an invalid sleeve number.`);
                    return false;
                }

                return Player.sleeves[sleeveNumber].takeUniversityCourse(Player, universityName, className);
            },
            travel: function(sleeveNumber=0, cityName="") {
                if (Player.bitNodeN !== 10 && !SourceFileFlags[10]) {
                    throw makeRuntimeRejectMsg(workerScript, "travel() failed because you do not currently have access to the Sleeve API. This is either because you are not in BitNode-10 or because you do not have Source-File 10");
                }
                updateDynamicRam("travel", getRamCost("sleeve", "travel"));
                if (sleeveNumber >= Player.sleeves.length || sleeveNumber < 0) {
                    workerScript.log(`ERROR: sleeve.travel(${sleeveNumber}) failed because it is an invalid sleeve number.`);
                    return false;
                }

                return Player.sleeves[sleeveNumber].travel(Player, cityName);
            },
            setToCompanyWork: function(sleeveNumber=0, companyName="") {
                if (Player.bitNodeN !== 10 && !SourceFileFlags[10]) {
                    throw makeRuntimeRejectMsg(workerScript, "setToCompanyWork() failed because you do not currently have access to the Sleeve API. This is either because you are not in BitNode-10 or because you do not have Source-File 10");
                }
                updateDynamicRam("setToCompanyWork", getRamCost("sleeve", "setToCompanyWork"));
                if (sleeveNumber >= Player.sleeves.length || sleeveNumber < 0) {
                    workerScript.log(`ERROR: sleeve.setToCompanyWork(${sleeveNumber}) failed because it is an invalid sleeve number.`);
                    return false;
                }

                // Cannot work at the same company that another sleeve is working at
                for (let i = 0; i < Player.sleeves.length; ++i) {
                    if (i === sleeveNumber) { continue; }
                    const other = Player.sleeves[i];
                    if (other.currentTask === SleeveTaskType.Company && other.currentTaskLocation === companyName) {
                        workerScript.log(`ERROR: sleeve.setToCompanyWork() failed for Sleeve ${sleeveNumber} because Sleeve ${i} is doing the same task`);
                        return false;
                    }
                }

                return Player.sleeves[sleeveNumber].workForCompany(Player, companyName);
            },
            setToFactionWork: function(sleeveNumber=0, factionName="", workType="") {
                if (Player.bitNodeN !== 10 && !SourceFileFlags[10]) {
                    throw makeRuntimeRejectMsg(workerScript, "setToFactionWork() failed because you do not currently have access to the Sleeve API. This is either because you are not in BitNode-10 or because you do not have Source-File 10");
                }
                updateDynamicRam("setToFactionWork", getRamCost("sleeve", "setToFactionWork"));
                if (sleeveNumber >= Player.sleeves.length || sleeveNumber < 0) {
                    workerScript.log(`ERROR: sleeve.setToFactionWork(${sleeveNumber}) failed because it is an invalid sleeve number.`);
                    return false;
                }

                // Cannot work at the same faction that another sleeve is working at
                for (let i = 0; i < Player.sleeves.length; ++i) {
                    if (i === sleeveNumber) { continue; }
                    const other = Player.sleeves[i];
                    if (other.currentTask === SleeveTaskType.Faction && other.currentTaskLocation === factionName) {
                        workerScript.log(`ERROR: sleeve.setToFactionWork() failed for Sleeve ${sleeveNumber} because Sleeve ${i} is doing the same task`);
                        return false;
                    }
                }

                return Player.sleeves[sleeveNumber].workForFaction(Player, factionName, workType);
            },
            setToGymWorkout: function(sleeveNumber=0, gymName="", stat="") {
                if (Player.bitNodeN !== 10 && !SourceFileFlags[10]) {
                    throw makeRuntimeRejectMsg(workerScript, "setToGymWorkout() failed because you do not currently have access to the Sleeve API. This is either because you are not in BitNode-10 or because you do not have Source-File 10");
                }
                updateDynamicRam("setToGymWorkout", getRamCost("sleeve", "setToGymWorkout"));
                if (sleeveNumber >= Player.sleeves.length || sleeveNumber < 0) {
                    workerScript.log(`ERROR: sleeve.setToGymWorkout(${sleeveNumber}) failed because it is an invalid sleeve number.`);
                    return false;
                }

                return Player.sleeves[sleeveNumber].workoutAtGym(Player, gymName, stat);
            },
            getSleeveStats: function(sleeveNumber=0) {
                if (Player.bitNodeN !== 10 && !SourceFileFlags[10]) {
                    throw makeRuntimeRejectMsg(workerScript, "getStats() failed because you do not currently have access to the Sleeve API. This is either because you are not in BitNode-10 or because you do not have Source-File 10");
                }
                updateDynamicRam("getSleeveStats", getRamCost("sleeve", "getSleeveStats"));
                if (sleeveNumber >= Player.sleeves.length || sleeveNumber < 0) {
                    workerScript.log(`ERROR: sleeve.workoutAtGym(${sleeveNumber}) failed because it is an invalid sleeve number.`);
                    return false;
                }

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
                if (Player.bitNodeN !== 10 && !SourceFileFlags[10]) {
                    throw makeRuntimeRejectMsg(workerScript, "getTask() failed because you do not currently have access to the Sleeve API. This is either because you are not in BitNode-10 or because you do not have Source-File 10");
                }
                updateDynamicRam("getTask", getRamCost("sleeve", "getTask"));
                if (sleeveNumber >= Player.sleeves.length || sleeveNumber < 0) {
                    workerScript.log(`ERROR: sleeve.getTask(${sleeveNumber}) failed because it is an invalid sleeve number.`);
                    return false;
                }

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
                if (Player.bitNodeN !== 10 && !SourceFileFlags[10]) {
                    throw makeRuntimeRejectMsg(workerScript, "getInformation() failed because you do not currently have access to the Sleeve API. This is either because you are not in BitNode-10 or because you do not have Source-File 10");
                }
                updateDynamicRam("getInformation", getRamCost("sleeve", "getInformation"));
                if (sleeveNumber >= Player.sleeves.length || sleeveNumber < 0) {
                    workerScript.log(`ERROR: sleeve.getInformation(${sleeveNumber}) failed because it is an invalid sleeve number.`);
                    return false;
                }

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
                if (Player.bitNodeN !== 10 && !SourceFileFlags[10]) {
                    throw makeRuntimeRejectMsg(workerScript, "getSleeveAugmentations() failed because you do not currently have access to the Sleeve API. This is either because you are not in BitNode-10 or because you do not have Source-File 10");
                }
                updateDynamicRam("getSleeveAugmentations", getRamCost("sleeve", "getSleeveAugmentations"));
                if (sleeveNumber >= Player.sleeves.length || sleeveNumber < 0) {
                    workerScript.log(`ERROR: sleeve.getSleeveAugmentations(${sleeveNumber}) failed because it is an invalid sleeve number.`);
                    return [];
                }

                const augs = [];
                for (let i = 0; i < Player.sleeves[sleeveNumber].augmentations.length; i++) {
                    augs.push(Player.sleeves[sleeveNumber].augmentations[i].name);
                }
                return augs;
            },
            getSleevePurchasableAugs: function(sleeveNumber=0) {
                if (Player.bitNodeN !== 10 && !SourceFileFlags[10]) {
                    throw makeRuntimeRejectMsg(workerScript, "getSleevePurchasableAugs() failed because you do not currently have access to the Sleeve API. This is either because you are not in BitNode-10 or because you do not have Source-File 10");
                }
                updateDynamicRam("getSleevePurchasableAugs", getRamCost("sleeve", "getSleevePurchasableAugs"));
                if (sleeveNumber >= Player.sleeves.length || sleeveNumber < 0) {
                    workerScript.log(`ERROR: sleeve.getSleevePurchasableAugs(${sleeveNumber}) failed because it is an invalid sleeve number.`);
                    return [];
                }

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
                if (Player.bitNodeN !== 10 && !SourceFileFlags[10]) {
                    throw makeRuntimeRejectMsg(workerScript, "purchaseSleeveAug() failed because you do not currently have access to the Sleeve API. This is either because you are not in BitNode-10 or because you do not have Source-File 10");
                }
                updateDynamicRam("purchaseSleeveAug", getRamCost("sleeve", "purchaseSleeveAug"));
                if (sleeveNumber >= Player.sleeves.length || sleeveNumber < 0) {
                    workerScript.log(`ERROR: sleeve.purchaseSleeveAug(${sleeveNumber}) failed because it is an invalid sleeve number.`);
                    return false;
                }

                const aug = Augmentations[augName];
                if (!aug) {
                    workerScript.log(`ERROR: sleeve.purchaseSleeveAug(${sleeveNumber}) failed because ${augName} is not a valid aug.`);
                }

                return Player.sleeves[sleeveNumber].tryBuyAugmentation(Player, aug);
            }
        }, // End sleeve
        heart: {
            // Easter egg function
            break: function() {
                return Player.karma;
            }
        }
    } // End return
} // End NetscriptFunction()

export { NetscriptFunctions };
