var sprintf = require('sprintf-js').sprintf,
    vsprintf = require('sprintf-js').vsprintf

import {updateActiveScriptsItems}                   from "./ActiveScriptsUI";
import {Augmentations, Augmentation,
        augmentationExists, installAugmentations,
        AugmentationNames}                          from "./Augmentations";
import {BitNodeMultipliers}                         from "./BitNodeMultipliers";
import {determineCrimeSuccess, findCrime}           from "./Crimes";
import {Bladeburner}                                from "./Bladeburner";
import {Companies, Company, CompanyPosition,
        CompanyPositions, companyExists}            from "./Company";
import {CONSTANTS}                                  from "./Constants";
import {Programs}                                   from "./CreateProgram";
import {DarkWebItems}                               from "./DarkWeb";
import {calculateHackingChance,
        calculateHackingExpGain,
        calculatePercentMoneyHacked,
        calculateHackingTime,
        calculateGrowTime,
        calculateWeakenTime}                        from "./Hacking";
import {AllGangs}                                   from "./Gang";
import {Factions, Faction, joinFaction,
        factionExists, purchaseAugmentation}        from "./Faction";
import {getCostOfNextHacknetNode, purchaseHacknet}  from "./HacknetNode";
import {Locations}                                  from "./Locations";
import {Message, Messages}                          from "./Message";
import {inMission}                                  from "./Missions";
import {Player}                                     from "./Player";
import {Script, findRunningScript, RunningScript,
        isScriptFilename}                           from "./Script";
import {Server, getServer, AddToAllServers,
        AllServers, processSingleServerGrowth,
        GetServerByHostname}                        from "./Server";
import {Settings}                                   from "./Settings";
import {SpecialServerIps}                           from "./SpecialServerIps";
import {Stock}                                      from "./Stock";
import {StockMarket, StockSymbols, SymbolToStockMap, initStockSymbols,
        initStockMarket, initSymbolToStockMap, stockMarketCycle, buyStock,
        sellStock, updateStockPrices, displayStockMarketContent,
        updateStockTicker, updateStockPlayerPosition,
        shortStock, sellShort, OrderTypes,
        PositionTypes, placeOrder, cancelOrder}     from "./StockMarket";
import {post}                                       from "./ui/postToTerminal";
import {TextFile, getTextFile, createTextFile}      from "./TextFile";

import {unknownBladeburnerActionErrorMessage,
        unknownBladeburnerExceptionMessage,
        checkBladeburnerAccess}                     from "./NetscriptBladeburner";
import * as nsGang                                  from "./NetscriptGang";
import {WorkerScript, workerScripts,
        killWorkerScript, NetscriptPorts}           from "./NetscriptWorker";
import {makeRuntimeRejectMsg, netscriptDelay,
        runScriptFromScript}                        from "./NetscriptEvaluator";
import {NetscriptPort}                              from "./NetscriptPort";

import Decimal                                      from "decimal.js";
import {Page, routing}                              from "./ui/navigationTracking";
import {dialogBoxCreate}                            from "../utils/DialogBox";
import {isPowerOfTwo}                               from "../utils/helpers/isPowerOfTwo";
import {arrayToString}                              from "../utils/helpers/arrayToString";
import {createRandomIp}                             from "../utils/IPAddress";
import {formatNumber, isHTML}                       from "../utils/StringHelperFunctions";
import {isString}                                   from "../utils/helpers/isString";
import {yesNoBoxClose, yesNoBoxGetYesButton,
        yesNoBoxGetNoButton, yesNoBoxCreate,
        yesNoBoxOpen}                               from "../utils/YesNoBox";

var hasCorporationSF            = false, //Source-File 3
    hasSingularitySF            = false, //Source-File 4
    hasAISF                     = false, //Source-File 5
    hasBladeburnerSF            = false, //Source-File 6
    hasBladeburner2079SF        = false, //Source-File 7
    hasWallStreetSF             = false, //Source-File 8
    hasBn11SF                   = false; //Source-File 11

var singularitySFLvl=1, wallStreetSFLvl=1;

var possibleLogs = {
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
    buyStock: true,
    sellStock: true,
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
    shortStock: true,
    sellShort: true,
    startAction: true,
    upgradeSkill: true,
    setTeamSize: true,
    joinBladeburnerFaction: true,
}

//Used to check and set flags for every Source File, despite the name of the function
function initSingularitySFFlags() {
    for (var i = 0; i < Player.sourceFiles.length; ++i) {
        if (Player.sourceFiles[i].n === 3) {hasCorporationSF        = true;}
        if (Player.sourceFiles[i].n === 4) {
            hasSingularitySF = true;
            singularitySFLvl = Player.sourceFiles[i].lvl;
        }
        if (Player.sourceFiles[i].n === 5) {hasAISF                 = true;}
        if (Player.sourceFiles[i].n === 6) {hasBladeburnerSF        = true;}
        if (Player.sourceFiles[i].n === 7) {hasBladeburner2079SF    = true;}
        if (Player.sourceFiles[i].n === 8) {
            hasWallStreetSF = true;
            wallStreetSFLvl = Player.sourceFiles[i].lvl;
        }
        if (Player.sourceFiles[i].n === 11) {hasBn11SF              = true;}
    }
}

function NetscriptFunctions(workerScript) {
    var updateDynamicRam = function(fnName, ramCost) {
        if (workerScript.dynamicLoadedFns[fnName]) {return;}
        workerScript.dynamicLoadedFns[fnName] = true;
        workerScript.dynamicRamUsage += ramCost;
        if (workerScript.dynamicRamUsage > 1.01 * workerScript.ramUsage) {
            throw makeRuntimeRejectMsg(workerScript,
                                       "Dynamic RAM usage calculated to be greater than initial RAM usage on fn: " + fnName +
                                       ". This is probably because you somehow circumvented the static RAM "  +
                                       "calculation.<br><br>Please don't do that :(<br><br>" +
                                       "Dynamic RAM Usage: " + workerScript.dynamicRamUsage + "<br>" +
                                       "Static RAM Usage: " + workerScript.ramUsage);
        }
    };

    var updateStaticRam = function(fnName, ramCost) {
        if (workerScript.loadedFns[fnName]) {
            return 0;
        } else {
            workerScript.loadedFns[fnName] = true;
            return ramCost;
        }
    };

    /**
     * Gets the Server for a specific hostname/ip, throwing an error
     * if the server doesn't exist.
     * @param {string} Hostname or IP of the server
     * @returns {Server} The specified Server
     */
    var safeGetServer = function(ip, callingFnName="") {
        var server = getServer(ip);
        if (server == null) {
            throw makeRuntimeRejectMsg(workerScript, `Invalid IP or hostname passed into ${callingFnName}() function`);
        }
        return server;
    }

    // Utility function to get Hacknet Node object
    var getHacknetNode = function(i) {
        if (isNaN(i)) {
            throw makeRuntimeRejectMsg(workerScript, "Invalid index specified for Hacknet Node: " + i);
        }
        if (i < 0 || i >= Player.hacknetNodes.length) {
            throw makeRuntimeRejectMsg(workerScript, "Index specified for Hacknet Node is out-of-bounds: " + i);
        }
        return Player.hacknetNodes[i];
    };

    var getCodingContract = function(fn, ip) {
        var server = safeGetServer(ip, "getCodingContract");
        return server.getContract(fn);
    }

    /**
     * @param {number} ram The amount of server RAM to calculate cost of.
     * @exception {Error} If the value passed in is not numeric, out of range, or too large of a value.
     * @returns {number} The cost of
     */
    const getPurchaseServerRamCostGuard = (ram) => {
        const guardedRam = Math.round(ram);
        if (isNaN(guardedRam) || !isPowerOfTwo(guardedRam)) {
            throw Error("failed due to invalid ram argument. Must be numeric and a power of 2");
        }

        if (guardedRam > CONSTANTS.PurchasedServerMaxRam) {
            throw Error("failed because specified RAM was too high. Maximum RAM on a purchased server is " + CONSTANTS.PurchasedServerMaxRam + "GB");
        }

        return guardedRam * CONSTANTS.BaseCostFor1GBOfRamServer;
    };

    return {
        hacknet : {
            numNodes : function() {
                return Player.hacknetNodes.length;
            },
            purchaseNode : function() {
                return purchaseHacknet();
            },
            getPurchaseNodeCost : function() {
                return getCostOfNextHacknetNode();
            },
            getNodeStats : function(i) {
                var node = getHacknetNode(i);
                return {
                    name:               node.name,
                    level:              node.level,
                    ram:                node.ram,
                    cores:              node.cores,
                    production:         node.moneyGainRatePerSecond,
                    timeOnline:         node.onlineTimeSeconds,
                    totalProduction:    node.totalMoneyGenerated,
                };
            },
            upgradeLevel : function(i, n) {
                var node = getHacknetNode(i);
                return node.purchaseLevelUpgrade(n);
            },
            upgradeRam : function(i, n) {
                var node = getHacknetNode(i);
                return node.purchaseRamUpgrade(n);
            },
            upgradeCore : function(i, n) {
                var node = getHacknetNode(i);
                return node.purchaseCoreUpgrade(n);
            },
            getLevelUpgradeCost : function(i, n) {
                var node = getHacknetNode(i);
                return node.calculateLevelUpgradeCost(n);
            },
            getRamUpgradeCost : function(i, n) {
                var node = getHacknetNode(i);
                return node.calculateRamUpgradeCost(n);
            },
            getCoreUpgradeCost : function(i, n) {
                var node = getHacknetNode(i);
                return node.calculateCoreUpgradeCost(n);
            }
        },
        sprintf : sprintf,
        vsprintf: vsprintf,
        scan : function(ip=workerScript.serverIp, hostnames=true){
            if (workerScript.checkingRam) {
                return updateStaticRam("scan", CONSTANTS.ScriptScanRamCost);
            }
            updateDynamicRam("scan", CONSTANTS.ScriptScanRamCost);
            var server = getServer(ip);
            if (server == null) {
                throw makeRuntimeRejectMsg(workerScript, 'Invalid IP or hostname passed into scan() command');
            }
            var out = [];
            for (var i = 0; i < server.serversOnNetwork.length; i++) {
                var entry;
                if (hostnames) {
                    entry = server.getServerOnNetwork(i).hostname;
                } else {
                    entry = server.getServerOnNetwork(i).ip;
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
        hack : function(ip){
            if (workerScript.checkingRam) {
                return updateStaticRam("hack", CONSTANTS.ScriptHackRamCost);
            }
            updateDynamicRam("hack", CONSTANTS.ScriptHackRamCost);
            if (ip === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "Hack() call has incorrect number of arguments. Takes 1 argument");
            }
            var threads = workerScript.scriptRef.threads;
            if (isNaN(threads) || threads < 1) {threads = 1;}
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("hack() error. Invalid IP or hostname passed in: " + ip + ". Stopping...");
                throw makeRuntimeRejectMsg(workerScript, "hack() error. Invalid IP or hostname passed in: " + ip + ". Stopping...");
            }

            //Calculate the hacking time
            var hackingTime = calculateHackingTime(server); //This is in seconds

            //No root access or skill level too low
            if (server.hasAdminRights == false) {
                workerScript.scriptRef.log("Cannot hack this server (" + server.hostname + ") because user does not have root access");
                throw makeRuntimeRejectMsg(workerScript, "Cannot hack this server (" + server.hostname + ") because user does not have root access");
            }

            if (server.requiredHackingSkill > Player.hacking_skill) {
                workerScript.scriptRef.log("Cannot hack this server (" + server.hostname + ") because user's hacking skill is not high enough");
                throw makeRuntimeRejectMsg(workerScript, "Cannot hack this server (" + server.hostname + ") because user's hacking skill is not high enough");
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
                if (rand < hackChance) { //Success!
                    const percentHacked = calculatePercentMoneyHacked(server);
                    let maxThreadNeeded = Math.ceil(1/percentHacked*(server.moneyAvailable/server.moneyMax));
                    if (isNaN(maxThreadNeeded)) {
                        //Server has a 'max money' of 0 (probably).
                        //We'll set this to an arbitrarily large value
                        maxThreadNeeded = 1e6;
                    }

                    let moneyGained = Math.floor(server.moneyAvailable * percentHacked) * threads;

                    //Over-the-top safety checks
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
                    workerScript.scriptRef.recordHack(server.ip, moneyGained, threads);
                    Player.gainHackingExp(expGainedOnSuccess);
                    workerScript.scriptRef.onlineExpGained += expGainedOnSuccess;
                    if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.hack == null) {
                        workerScript.scriptRef.log("Script SUCCESSFULLY hacked " + server.hostname + " for $" + formatNumber(moneyGained, 2) + " and " + formatNumber(expGainedOnSuccess, 4) +  " exp (t=" + threads + ")");
                    }
                    server.fortify(CONSTANTS.ServerFortifyAmount * Math.min(threads, maxThreadNeeded));
                    return Promise.resolve(moneyGained);
                } else {
                    //Player only gains 25% exp for failure?
                    Player.gainHackingExp(expGainedOnFailure);
                    workerScript.scriptRef.onlineExpGained += expGainedOnFailure;
                    if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.hack == null) {
                        workerScript.scriptRef.log("Script FAILED to hack " + server.hostname + ". Gained " + formatNumber(expGainedOnFailure, 4) + " exp (t=" + threads + ")");
                    }
                    return Promise.resolve(0);
                }
            });
        },
        sleep : function(time){
            if (workerScript.checkingRam) {return 0;}
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
        grow : function(ip){
            if (workerScript.checkingRam) {
                return updateStaticRam("grow", CONSTANTS.ScriptGrowRamCost);
            }
            updateDynamicRam("grow", CONSTANTS.ScriptGrowRamCost);
            var threads = workerScript.scriptRef.threads;
            if (isNaN(threads) || threads < 1) {threads = 1;}
            if (ip === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "grow() call has incorrect number of arguments. Takes 1 argument");
            }
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("Cannot grow(). Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "Cannot grow(). Invalid IP or hostname passed in: " + ip);
            }

            //No root access or skill level too low
            if (server.hasAdminRights == false) {
                workerScript.scriptRef.log("Cannot grow this server (" + server.hostname + ") because user does not have root access");
                throw makeRuntimeRejectMsg(workerScript, "Cannot grow this server (" + server.hostname + ") because user does not have root access");
            }

            var growTime = calculateGrowTime(server);
            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.grow == null) {
                workerScript.scriptRef.log("Executing grow() on server " + server.hostname + " in " + formatNumber(growTime, 3) + " seconds (t=" + threads + ")");
            }
            return netscriptDelay(growTime * 1000, workerScript).then(function() {
                if (workerScript.env.stopFlag) {return Promise.reject(workerScript);}
                const moneyBefore = server.moneyAvailable <= 0 ? 1 : server.moneyAvailable;
                server.moneyAvailable += (1 * threads); //It can be grown even if it has no money
                var growthPercentage = processSingleServerGrowth(server, 450 * threads);
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
                return Promise.resolve(moneyAfter/moneyBefore);
            });
        },
        weaken : function(ip){
            if (workerScript.checkingRam) {
                return updateStaticRam("weaken", CONSTANTS.ScriptWeakenRamCost);
            }
            updateDynamicRam("weaken", CONSTANTS.ScriptWeakenRamCost);
            var threads = workerScript.scriptRef.threads;
            if (isNaN(threads) || threads < 1) {threads = 1;}
            if (ip === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "weaken() call has incorrect number of arguments. Takes 1 argument");
            }
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("Cannot weaken(). Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "Cannot weaken(). Invalid IP or hostname passed in: " + ip);
            }

            //No root access or skill level too low
            if (server.hasAdminRights == false) {
                workerScript.scriptRef.log("Cannot weaken this server (" + server.hostname + ") because user does not have root access");
                throw makeRuntimeRejectMsg(workerScript, "Cannot weaken this server (" + server.hostname + ") because user does not have root access");
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
        print : function(args){
            if (workerScript.checkingRam) {return 0;}
            if (args === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "print() call has incorrect number of arguments. Takes 1 argument");
            }
            workerScript.scriptRef.log(args.toString());
        },
        tprint : function(args) {
            if (workerScript.checkingRam) {return 0;}
            if (args === undefined || args == null) {
                throw makeRuntimeRejectMsg(workerScript, "tprint() call has incorrect number of arguments. Takes 1 argument");
            }
            var x = args.toString();
            post(workerScript.scriptRef.filename + ": " + args.toString());
        },
        clearLog : function() {
            if (workerScript.checkingRam) {return 0;}
            workerScript.scriptRef.clearLog();
        },
        disableLog : function(fn) {
            if (workerScript.checkingRam) {return 0;}
            if(possibleLogs[fn]===undefined) {
                throw makeRuntimeRejectMsg(workerScript, "Invalid argument to disableLog: "+fn);
            }
            workerScript.disableLogs[fn] = true;
            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.disableLog == null) {
                workerScript.scriptRef.log("Disabled logging for " + fn);
            }
        },
        enableLog : function(fn) {
            if (workerScript.checkingRam) {return 0;}
            if(possibleLogs[fn]===undefined) {
                throw makeRuntimeRejectMsg(workerScript, "Invalid argument to enableLog: "+fn);
            }
            delete workerScript.disableLogs[fn];
            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.enableLog == null) {
                workerScript.scriptRef.log("Enabled logging for " + fn);
            }
        },
        isLogEnabled : function(fn) {
            if (workerScript.checkingRam) {return 0;}
            if (possibleLogs[fn] === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "Invalid argument to isLogEnabled: " + fn);
            }
            return workerScript.disableLogs[fn] ? false : true;
        },
        getScriptLogs : function() {
            if (workerScript.checkingRam) {return 0;}
            return workerScript.scriptRef.logs.slice();
        },
        nuke : function(ip){
            if (workerScript.checkingRam) {
                return updateStaticRam("nuke", CONSTANTS.ScriptPortProgramRamCost);
            }
            updateDynamicRam("nuke", CONSTANTS.ScriptPortProgramRamCost);
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
        brutessh : function(ip){
            if (workerScript.checkingRam) {
                return updateStaticRam("brutessh", CONSTANTS.ScriptPortProgramRamCost);
            }
            updateDynamicRam("brutessh", CONSTANTS.ScriptPortProgramRamCost);
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
        ftpcrack : function(ip){
            if (workerScript.checkingRam) {
                return updateStaticRam("ftpcrack", CONSTANTS.ScriptPortProgramRamCost);
            }
            updateDynamicRam("ftpcrack", CONSTANTS.ScriptPortProgramRamCost);
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
        relaysmtp : function(ip){
            if (workerScript.checkingRam) {
                return updateStaticRam("relaysmtp", CONSTANTS.ScriptPortProgramRamCost);
            }
            updateDynamicRam("relaysmtp", CONSTANTS.ScriptPortProgramRamCost);
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
        httpworm : function(ip){
            if (workerScript.checkingRam) {
                return updateStaticRam("httpworm", CONSTANTS.ScriptPortProgramRamCost);
            }
            updateDynamicRam("httpworm", CONSTANTS.ScriptPortProgramRamCost);
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
        sqlinject : function(ip){
            if (workerScript.checkingRam) {
                return updateStaticRam("sqlinject", CONSTANTS.ScriptPortProgramRamCost);
            }
            updateDynamicRam("sqlinject", CONSTANTS.ScriptPortProgramRamCost);
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
        run : function(scriptname,threads = 1){
            if (workerScript.checkingRam) {
                return updateStaticRam("run", CONSTANTS.ScriptRunRamCost);
            }
            updateDynamicRam("run", CONSTANTS.ScriptRunRamCost);
            if (scriptname === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "run() call has incorrect number of arguments. Usage: run(scriptname, [numThreads], [arg1], [arg2]...)");
            }
            if (isNaN(threads) || threads < 1) {
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
        exec : function(scriptname,ip,threads = 1) {
            if (workerScript.checkingRam) {
                return updateStaticRam("exec", CONSTANTS.ScriptExecRamCost);
            }
            updateDynamicRam("exec", CONSTANTS.ScriptExecRamCost);
            if (scriptname === undefined || ip === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "exec() call has incorrect number of arguments. Usage: exec(scriptname, server, [numThreads], [arg1], [arg2]...)");
            }
            if (isNaN(threads) || threads < 1) {
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
        spawn : function(scriptname, threads) {
            if (workerScript.checkingRam) {
                return updateStaticRam("spawn", CONSTANTS.ScriptSpawnRamCost);
            }
            updateDynamicRam("spawn", CONSTANTS.ScriptSpawnRamCost);
            if (scriptname == null || threads == null) {
                throw makeRuntimeRejectMsg(workerScript, "Invalid scriptname or numThreads argument passed to spawn()");
            }
            setTimeout(()=>{
                if (scriptname === undefined) {
                    throw makeRuntimeRejectMsg(workerScript, "spawn() call has incorrect number of arguments. Usage: spawn(scriptname, numThreads, [arg1], [arg2]...)");
                }
                if (isNaN(threads) || threads < 1) {
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
            }, 20000);
            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.spawn == null) {
                workerScript.scriptRef.log("spawn() will execute " + scriptname + " in 20 seconds");
            }
            NetscriptFunctions(workerScript).exit();
        },
        kill : function(filename,ip) {
            if (workerScript.checkingRam) {
                return updateStaticRam("kill", CONSTANTS.ScriptKillRamCost);
            }
            updateDynamicRam("kill", CONSTANTS.ScriptKillRamCost);
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
        killall : function(ip=workerScript.serverIp){
            if (workerScript.checkingRam) {
                return updateStaticRam("killall", CONSTANTS.ScriptKillRamCost);
            }
            updateDynamicRam("killall", CONSTANTS.ScriptKillRamCost);
            if (ip === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "killall() call has incorrect number of arguments. Takes 1 argument");
            }
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("killall() failed. Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "killall() failed. Invalid IP or hostname passed in: " + ip);
            }
            var scriptsRunning = (server.runningScripts.length > 0);
            for (var i = server.runningScripts.length-1; i >= 0; --i) {
                killWorkerScript(server.runningScripts[i], server.ip);
            }
            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.killall == null) {
                workerScript.scriptRef.log("killall(): Killing all scripts on " + server.hostname + ". May take a few minutes for the scripts to die");
            }
            return scriptsRunning;
        },
        exit : function() {
            if (workerScript.checkingRam) {return 0;}
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
        scp : function(scriptname, ip1, ip2) {
            if (workerScript.checkingRam) {
                return updateStaticRam("scp", CONSTANTS.ScriptScpRamCost);
            }
            updateDynamicRam("scp", CONSTANTS.ScriptScpRamCost);
            if (arguments.length !== 2 && arguments.length !== 3) {
                throw makeRuntimeRejectMsg(workerScript, "ERROR: scp() call has incorrect number of arguments. Takes 2 or 3 arguments");
            }
            if (scriptname && scriptname.constructor === Array) {
                //Recursively call scp on all elements of array
                var res = false;
                scriptname.forEach(function(script) {
                    if (NetscriptFunctions(workerScript).scp(script, ip1, ip2)) {
                        res = true;
                    };
                });
                return res;
            }
            if (!scriptname.endsWith(".lit") && !isScriptFilename(scriptname) &&
                !scriptname.endsWith("txt")) {
                throw makeRuntimeRejectMsg(workerScript, "ERROR: scp() does not work with this file type. It only works for .script, .lit, and .txt files");
            }

            var destServer, currServ;

            if (arguments.length === 3) {   //scriptname, source, destination
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
            } else if (arguments.length === 2) {    //scriptname, destination
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
            }

            //Scp for lit files
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
                        return true; //Already exists
                    }
                }
                destServer.messages.push(scriptname);
                if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.scp == null) {
                    workerScript.scriptRef.log(scriptname + " copied over to " + destServer.hostname);
                }
                return true;
            }

            //Scp for text files
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
                        //Overwrite
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

            //Scp for script files
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

            //Overwrite script if it already exists
            for (var i = 0; i < destServer.scripts.length; ++i) {
                if (scriptname == destServer.scripts[i].filename) {
                    if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.scp == null) {
                        workerScript.scriptRef.log("WARNING: " + scriptname + " already exists on " + destServer.hostname + " and it will be overwritten.");
                        workerScript.scriptRef.log(scriptname + " overwritten on " + destServer.hostname);
                    }
                    var oldScript = destServer.scripts[i];
                    oldScript.code = sourceScript.code;
                    oldScript.ramUsage = sourceScript.ramUsage;
                    oldScript.module = "";
                    return true;
                }
            }

            //Create new script if it does not already exist
            var newScript = new Script();
            newScript.filename = scriptname;
            newScript.code = sourceScript.code;
            newScript.ramUsage = sourceScript.ramUsage;
            newScript.server = destServer.ip;
            destServer.scripts.push(newScript);
            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.scp == null) {
                workerScript.scriptRef.log(scriptname + " copied over to " + destServer.hostname);
            }
            return true;
        },
        ls : function(ip, grep) {
            if (workerScript.checkingRam) {
                return updateStaticRam("ls", CONSTANTS.ScriptScanRamCost);
            }
            updateDynamicRam("ls", CONSTANTS.ScriptScanRamCost);
            if (ip === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "ls() failed because of invalid arguments. Usage: ls(ip/hostname, [grep filter])");
            }
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("ls() failed. Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "ls() failed. Invalid IP or hostname passed in: " + ip);
            }

            //Get the grep filter, if one exists
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

            //Sort the files alphabetically then print each
            allFiles.sort();
            return allFiles;
        },
        ps : function(ip=workerScript.serverIp) {
            if (workerScript.checkingRam) {
                return updateStaticRam("ps", CONSTANTS.ScriptScanRamCost);
            }
            updateDynamicRam("ps", CONSTANTS.ScriptScanRamCost);
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
        hasRootAccess : function(ip) {
            if (workerScript.checkingRam) {
                return updateStaticRam("hasRootAccess", CONSTANTS.ScriptHasRootAccessRamCost);
            }
            updateDynamicRam("hasRootAccess", CONSTANTS.ScriptHasRootAccessRamCost);
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
        getIp : function() {
            if (workerScript.checkingRam) {
                return updateStaticRam("getIp", CONSTANTS.ScriptGetHostnameRamCost);
            }
            updateDynamicRam("getIp", CONSTANTS.ScriptGetHostnameRamCost);
            var scriptServer = getServer(workerScript.serverIp);
            if (scriptServer == null) {
                throw makeRuntimeRejectMsg(workerScript, "Could not find server. This is a bug in the game. Report to game dev");
            }
            return scriptServer.ip;
        },
        getHostname : function(){
            if (workerScript.checkingRam) {
                return updateStaticRam("getHostname", CONSTANTS.ScriptGetHostnameRamCost);
            }
            updateDynamicRam("getHostname", CONSTANTS.ScriptGetHostnameRamCost);
            var scriptServer = getServer(workerScript.serverIp);
            if (scriptServer == null) {
                throw makeRuntimeRejectMsg(workerScript, "Could not find server. This is a bug in the game. Report to game dev");
            }
            return scriptServer.hostname;
        },
        getHackingLevel : function(){
            if (workerScript.checkingRam) {
                return updateStaticRam("getHackingLevel", CONSTANTS.ScriptGetHackingLevelRamCost);
            }
            updateDynamicRam("getHackingLevel", CONSTANTS.ScriptGetHackingLevelRamCost);
            Player.updateSkillLevels();
            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.getHackingLevel == null) {
                workerScript.scriptRef.log("getHackingLevel() returned " + Player.hacking_skill);
            }
            return Player.hacking_skill;
        },
        getHackingMultipliers : function() {
            if (workerScript.checkingRam) {
                return updateStaticRam("getHackingMultipliers", CONSTANTS.ScriptGetMultipliersRamCost);
            }
            updateDynamicRam("getHackingMultipliers", CONSTANTS.ScriptGetMultipliersRamCost);
            return {
                chance: Player.hacking_chance_mult,
                speed: Player.hacking_speed_mult,
                money: Player.hacking_money_mult,
                growth: Player.hacking_grow_mult,
            };
        },
        getHacknetMultipliers : function() {
            if (workerScript.checkingRam) {
                return updateStaticRam("getHacknetMultipliers", CONSTANTS.ScriptGetMultipliersRamCost);
            }
            updateDynamicRam("getHacknetMultipliers", CONSTANTS.ScriptGetMultipliersRamCost);
            return {
                production: Player.hacknet_node_money_mult,
                purchaseCost: Player.hacknet_node_purchase_cost_mult,
                ramCost: Player.hacknet_node_ram_cost_mult,
                coreCost: Player.hacknet_node_core_cost_mult,
                levelCost: Player.hacknet_node_level_cost_mult,
            };
        },
        getBitNodeMultipliers: function() {
            if (workerScript.checkingRam) {
                return updateStaticRam("getBitNodeMultipliers", CONSTANTS.ScriptGetMultipliersRamCost);
            }
            updateDynamicRam("getBitNodeMultipliers", CONSTANTS.ScriptGetMultipliersRamCost);
            if (!hasAISF) {
                throw makeRuntimeRejectMsg(workerScript, "Cannot run getBitNodeMultipliers(). It requires Source-File 5 to run.");
            }
            let copy = Object.assign({}, BitNodeMultipliers);
            return copy;
        },
        getServerMoneyAvailable : function(ip){
            if (workerScript.checkingRam) {
                return updateStaticRam("getServerMoneyAvailable", CONSTANTS.ScriptGetServerRamCost);
            }
            updateDynamicRam("getServerMoneyAvailable", CONSTANTS.ScriptGetServerRamCost);
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("getServerMoneyAvailable() failed. Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "getServerMoneyAvailable() failed. Invalid IP or hostname passed in: " + ip);
            }
            if (server.hostname == "home") {
                //Return player's money
                if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.getServerMoneyAvailable == null) {
                    workerScript.scriptRef.log("getServerMoneyAvailable('home') returned player's money: $" + formatNumber(Player.money.toNumber(), 2));
                }
                return Player.money.toNumber();
            }
            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.getServerMoneyAvailable == null) {
                workerScript.scriptRef.log("getServerMoneyAvailable() returned " + formatNumber(server.moneyAvailable, 2) + " for " + server.hostname);
            }
            return server.moneyAvailable;
        },
        getServerSecurityLevel : function(ip){
            if (workerScript.checkingRam) {
                return updateStaticRam("getServerSecurityLevel", CONSTANTS.ScriptGetServerRamCost);
            }
            updateDynamicRam("getServerSecurityLevel", CONSTANTS.ScriptGetServerRamCost);
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("getServerSecurityLevel() failed. Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "getServerSecurityLevel() failed. Invalid IP or hostname passed in: " + ip);
            }
            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.getServerSecurityLevel == null) {
                workerScript.scriptRef.log("getServerSecurityLevel() returned " + formatNumber(server.hackDifficulty, 3) + " for " + server.hostname);
            }
            return server.hackDifficulty;
        },
        getServerBaseSecurityLevel : function(ip){
            if (workerScript.checkingRam) {
                return updateStaticRam("getServerBaseSecurityLevel", CONSTANTS.ScriptGetServerRamCost);
            }
            updateDynamicRam("getServerBaseSecurityLevel", CONSTANTS.ScriptGetServerRamCost);
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("getServerBaseSecurityLevel() failed. Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "getServerBaseSecurityLevel() failed. Invalid IP or hostname passed in: " + ip);
            }
            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.getServerBaseSecurityLevel == null) {
                workerScript.scriptRef.log("getServerBaseSecurityLevel() returned " + formatNumber(server.baseDifficulty, 3) + " for " + server.hostname);
            }
            return server.baseDifficulty;
        },
        getServerMinSecurityLevel : function(ip) {
            if (workerScript.checkingRam) {
                return updateStaticRam("getServerMinSecurityLevel", CONSTANTS.ScriptGetServerRamCost);
            }
            updateDynamicRam("getServerMinSecurityLevel", CONSTANTS.ScriptGetServerRamCost);
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("getServerMinSecurityLevel() failed. Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "getServerMinSecurityLevel() failed. Invalid IP or hostname passed in: " + ip);
            }
            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.getServerMinSecurityLevel == null) {
                workerScript.scriptRef.log("getServerMinSecurityLevel() returned " + formatNumber(server.minDifficulty, 3) + " for " + server.hostname);
            }
            return server.minDifficulty;
        },
        getServerRequiredHackingLevel : function(ip) {
            if (workerScript.checkingRam) {
                return updateStaticRam("getServerRequiredHackingLevel", CONSTANTS.ScriptGetServerRamCost);
            }
            updateDynamicRam("getServerRequiredHackingLevel", CONSTANTS.ScriptGetServerRamCost);
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("getServerRequiredHackingLevel() failed. Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "getServerRequiredHackingLevel() failed. Invalid IP or hostname passed in: " + ip);
            }
            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.getServerRequiredHackingLevel == null) {
                workerScript.scriptRef.log("getServerRequiredHackingLevel returned " + formatNumber(server.requiredHackingSkill, 0) + " for " + server.hostname);
            }
            return server.requiredHackingSkill;
        },
        getServerMaxMoney : function(ip){
            if (workerScript.checkingRam) {
                return updateStaticRam("getServerMaxMoney", CONSTANTS.ScriptGetServerRamCost);
            }
            updateDynamicRam("getServerMaxMoney", CONSTANTS.ScriptGetServerRamCost);
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("getServerMaxMoney() failed. Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "getServerMaxMoney() failed. Invalid IP or hostname passed in: " + ip);
            }
            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.getServerMaxMoney == null) {
                workerScript.scriptRef.log("getServerMaxMoney() returned " + formatNumber(server.moneyMax, 0) + " for " + server.hostname);
            }
            return server.moneyMax;
        },
        getServerGrowth : function(ip) {
            if (workerScript.checkingRam) {
                return updateStaticRam("getServerGrowth", CONSTANTS.ScriptGetServerRamCost);
            }
            updateDynamicRam("getServerGrowth", CONSTANTS.ScriptGetServerRamCost);
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("getServerGrowth() failed. Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "getServerGrowth() failed. Invalid IP or hostname passed in: " + ip);
            }
            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.getServerGrowth == null) {
                workerScript.scriptRef.log("getServerGrowth() returned " + formatNumber(server.serverGrowth, 0) + " for " + server.hostname);
            }
            return server.serverGrowth;
        },
        getServerNumPortsRequired : function(ip) {
            if (workerScript.checkingRam) {
                return updateStaticRam("getServerNumPortsRequired", CONSTANTS.ScriptGetServerRamCost);
            }
            updateDynamicRam("getServerNumPortsRequired", CONSTANTS.ScriptGetServerRamCost);
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("getServerNumPortsRequired() failed. Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "getServerNumPortsRequired() failed. Invalid IP or hostname passed in: " + ip);
            }
            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.getServerNumPortsRequired == null) {
                workerScript.scriptRef.log("getServerNumPortsRequired() returned " + formatNumber(server.numOpenPortsRequired, 0) + " for " + server.hostname);
            }
            return server.numOpenPortsRequired;
        },
        getServerRam : function(ip) {
            if (workerScript.checkingRam) {
                return updateStaticRam("getServerRam", CONSTANTS.ScriptGetServerRamCost);
            }
            updateDynamicRam("getServerRam", CONSTANTS.ScriptGetServerRamCost);
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("getServerRam() failed. Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "getServerRam() failed. Invalid IP or hostname passed in: " + ip);
            }
            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.getServerRam == null) {
                workerScript.scriptRef.log("getServerRam() returned [" + formatNumber(server.maxRam, 2) + "GB, " + formatNumber(server.ramUsed, 2) + "GB]");
            }
            return [server.maxRam, server.ramUsed];
        },
        serverExists : function(ip) {
            if (workerScript.checkingRam) {
                return updateStaticRam("serverExists", CONSTANTS.ScriptGetServerRamCost);
            }
            updateDynamicRam("serverExists", CONSTANTS.ScriptGetServerRamCost);
            return (getServer(ip) !== null);
        },
        fileExists : function(filename,ip=workerScript.serverIp) {
            if (workerScript.checkingRam) {
                return updateStaticRam("fileExists", CONSTANTS.ScriptFileExistsRamCost);
            }
            updateDynamicRam("fileExists", CONSTANTS.ScriptFileExistsRamCost);
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
        isRunning : function(filename,ip) {
            if (workerScript.checkingRam) {
                return updateStaticRam("isRunning", CONSTANTS.ScriptIsRunningRamCost);
            }
            updateDynamicRam("isRunning", CONSTANTS.ScriptIsRunningRamCost);
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
        getStockSymbols : function(){
            if (workerScript.checkingRam) {
                return updateStaticRam("getStockSymbols", CONSTANTS.ScriptGetStockRamCost);
            }
            updateDynamicRam("getStockSymbols", CONSTANTS.ScriptGetStockRamCost);
            if (!Player.hasTixApiAccess) {
                throw makeRuntimeRejectMsg(workerScript, "You don't have TIX API Access! Cannot use getStockSymbols()");
            }
            return Object.values(StockSymbols);
        },
        getStockPrice : function(symbol) {
            if (workerScript.checkingRam) {
                return updateStaticRam("getStockPrice", CONSTANTS.ScriptGetStockRamCost);
            }
            updateDynamicRam("getStockPrice", CONSTANTS.ScriptGetStockRamCost);
            if (!Player.hasTixApiAccess) {
                throw makeRuntimeRejectMsg(workerScript, "You don't have TIX API Access! Cannot use getStockPrice()");
            }
            var stock = SymbolToStockMap[symbol];
            if (stock == null) {
                throw makeRuntimeRejectMsg(workerScript, "Invalid stock symbol passed into getStockPrice()");
            }
            return parseFloat(stock.price.toFixed(3));
        },
        getStockPosition : function(symbol) {
            if (workerScript.checkingRam) {
                return updateStaticRam("getStockPosition", CONSTANTS.ScriptGetStockRamCost);
            }
            updateDynamicRam("getStockPosition", CONSTANTS.ScriptGetStockRamCost);
            if (!Player.hasTixApiAccess) {
                throw makeRuntimeRejectMsg(workerScript, "You don't have TIX API Access! Cannot use getStockPosition()");
            }
            var stock = SymbolToStockMap[symbol];
            if (stock == null) {
                throw makeRuntimeRejectMsg(workerScript, "Invalid stock symbol passed into getStockPosition()");
            }
            return [stock.playerShares, stock.playerAvgPx, stock.playerShortShares, stock.playerAvgShortPx];
        },
        buyStock : function(symbol, shares) {
            if (workerScript.checkingRam) {
                return updateStaticRam("buyStock", CONSTANTS.ScriptBuySellStockRamCost);
            }
            updateDynamicRam("buyStock", CONSTANTS.ScriptBuySellStockRamCost);
            if (!Player.hasTixApiAccess) {
                throw makeRuntimeRejectMsg(workerScript, "You don't have TIX API Access! Cannot use buyStock()");
            }
            var stock = SymbolToStockMap[symbol];
            if (stock == null) {
                throw makeRuntimeRejectMsg(workerScript, "Invalid stock symbol passed into buyStock()");
            }
            if (shares < 0 || isNaN(shares)) {
                workerScript.scriptRef.log("ERROR: Invalid 'shares' argument passed to buyStock()");
                return 0;
            }
            shares = Math.round(shares);
            if (shares === 0) {return 0;}

            var totalPrice = stock.price * shares;
            if (Player.money.lt(totalPrice + CONSTANTS.StockMarketCommission)) {
                workerScript.scriptRef.log("Not enough money to purchase " + formatNumber(shares, 0) + " shares of " +
                                           symbol + ". Need $" +
                                           formatNumber(totalPrice + CONSTANTS.StockMarketCommission, 2).toString());
                return 0;
            }

            var origTotal = stock.playerShares * stock.playerAvgPx;
            Player.loseMoney(totalPrice + CONSTANTS.StockMarketCommission);
            var newTotal = origTotal + totalPrice;
            stock.playerShares += shares;
            stock.playerAvgPx = newTotal / stock.playerShares;
            if (routing.isOn(Page.StockMarket)) {
                updateStockPlayerPosition(stock);
            }
            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.buyStock == null) {
                workerScript.scriptRef.log("Bought " + formatNumber(shares, 0) + " shares of " + stock.symbol + " at $" +
                                           formatNumber(stock.price, 2) + " per share");
            }
            return stock.price;
        },
        sellStock : function(symbol, shares) {
            if (workerScript.checkingRam) {
                return updateStaticRam("sellStock", CONSTANTS.ScriptBuySellStockRamCost);
            }
            updateDynamicRam("sellStock", CONSTANTS.ScriptBuySellStockRamCost);
            if (!Player.hasTixApiAccess) {
                throw makeRuntimeRejectMsg(workerScript, "You don't have TIX API Access! Cannot use sellStock()");
            }
            var stock = SymbolToStockMap[symbol];
            if (stock == null) {
                throw makeRuntimeRejectMsg(workerScript, "Invalid stock symbol passed into sellStock()");
            }
            if (shares < 0 || isNaN(shares)) {
                workerScript.scriptRef.log("ERROR: Invalid 'shares' argument passed to sellStock()");
                return 0;
            }
            shares = Math.round(shares);
            if (shares > stock.playerShares) {shares = stock.playerShares;}
            if (shares === 0) {return 0;}
            var gains = stock.price * shares - CONSTANTS.StockMarketCommission;
            Player.gainMoney(gains);

            //Calculate net profit and add to script stats
            var netProfit = ((stock.price - stock.playerAvgPx) * shares) - CONSTANTS.StockMarketCommission;
            if (isNaN(netProfit)) {netProfit = 0;}
            workerScript.scriptRef.onlineMoneyMade += netProfit;
            Player.scriptProdSinceLastAug += netProfit;

            stock.playerShares -= shares;
            if (stock.playerShares == 0) {
                stock.playerAvgPx = 0;
            }
            if (routing.isOn(Page.StockMarket)) {
                updateStockPlayerPosition(stock);
            }
            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.sellStock == null) {
                workerScript.scriptRef.log("Sold " + formatNumber(shares, 0) + " shares of " + stock.symbol + " at $" +
                                           formatNumber(stock.price, 2) + " per share. Gained " +
                                           "$" + formatNumber(gains, 2));
            }
            return stock.price;
        },
        shortStock(symbol, shares) {
            if (workerScript.checkingRam) {
                return updateStaticRam("shortStock", CONSTANTS.ScriptBuySellStockRamCost);
            }
            updateDynamicRam("shortStock", CONSTANTS.ScriptBuySellStockRamCost);
            if (!Player.hasTixApiAccess) {
                throw makeRuntimeRejectMsg(workerScript, "You don't have TIX API Access! Cannot use shortStock()");
            }
            if (Player.bitNodeN !== 8) {
                if (!(hasWallStreetSF && wallStreetSFLvl >= 2)) {
                    throw makeRuntimeRejectMsg(workerScript, "ERROR: Cannot use shortStock(). You must either be in BitNode-8 or you must have Level 2 of Source-File 8");
                }
            }
            var stock = SymbolToStockMap[symbol];
            if (stock == null) {
                throw makeRuntimeRejectMsg(workerScript, "ERROR: Invalid stock symbol passed into shortStock()");
            }
            var res = shortStock(stock, shares, workerScript);
            return res ? stock.price : 0;
        },
        sellShort(symbol, shares) {
            if (workerScript.checkingRam) {
                return updateStaticRam("sellShort", CONSTANTS.ScriptBuySellStockRamCost);
            }
            updateDynamicRam("sellShort", CONSTANTS.ScriptBuySellStockRamCost);
            if (!Player.hasTixApiAccess) {
                throw makeRuntimeRejectMsg(workerScript, "You don't have TIX API Access! Cannot use sellShort()");
            }
            if (Player.bitNodeN !== 8) {
                if (!(hasWallStreetSF && wallStreetSFLvl >= 2)) {
                    throw makeRuntimeRejectMsg(workerScript, "ERROR: Cannot use sellShort(). You must either be in BitNode-8 or you must have Level 2 of Source-File 8");
                }
            }
            var stock = SymbolToStockMap[symbol];
            if (stock == null) {
                throw makeRuntimeRejectMsg(workerScript, "ERROR: Invalid stock symbol passed into sellShort()");
            }
            var res = sellShort(stock, shares, workerScript);
            return res ? stock.price : 0;
        },
        placeOrder(symbol, shares, price, type, pos) {
            if (workerScript.checkingRam) {
                return updateStaticRam("placeOrder", CONSTANTS.ScriptBuySellStockRamCost);
            }
            updateDynamicRam("placeOrder", CONSTANTS.ScriptBuySellStockRamCost);
            if (!Player.hasTixApiAccess) {
                throw makeRuntimeRejectMsg(workerScript, "You don't have TIX API Access! Cannot use placeOrder()");
            }
            if (Player.bitNodeN !== 8) {
                if (!(hasWallStreetSF && wallStreetSFLvl >= 3)) {
                    throw makeRuntimeRejectMsg(workerScript, "ERROR: Cannot use placeOrder(). You must either be in BitNode-8 or have Level 3 of Source-File 8");
                }
            }
            var stock = SymbolToStockMap[symbol];
            if (stock == null) {
                throw makeRuntimeRejectMsg(workerScript, "ERROR: Invalid stock symbol passed into placeOrder()");
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

            return placeOrder(stock, shares, price, orderType, orderPos, workerScript);
        },
        cancelOrder(symbol, shares, price, type, pos) {
            if (workerScript.checkingRam) {
                return updateStaticRam("cancelOrder", CONSTANTS.ScriptBuySellStockRamCost);
            }
            updateDynamicRam("cancelOrder", CONSTANTS.ScriptBuySellStockRamCost);
            if (!Player.hasTixApiAccess) {
                throw makeRuntimeRejectMsg(workerScript, "You don't have TIX API Access! Cannot use cancelOrder()");
            }
            if (Player.bitNodeN !== 8) {
                if (!(hasWallStreetSF && wallStreetSFLvl >= 3)) {
                    throw makeRuntimeRejectMsg(workerScript, "ERROR: Cannot use cancelOrder(). You must either be in BitNode-8 or have Level 3 of Source-File 8");
                }
            }
            var stock = SymbolToStockMap[symbol];
            if (stock == null) {
                throw makeRuntimeRejectMsg(workerScript, "ERROR: Invalid stock symbol passed into cancelOrder()");
            }
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
        getStockVolatility : function(symbol) {
            if (workerScript.checkingRam) {
                return updateStaticRam("getStockVolatility", CONSTANTS.ScriptBuySellStockRamCost);
            }
            updateDynamicRam("getStockVolatility", CONSTANTS.ScriptBuySellStockRamCost);
            if (!Player.has4SDataTixApi) {
                throw makeRuntimeRejectMsg(workerScript, "You don't have 4S Market Data TIX API Access! Cannot use getStockVolatility()");
            }
            var stock = SymbolToStockMap[symbol];
            if (stock == null) {
                throw makeRuntimeRejectMsg(workerScript, "ERROR: Invalid stock symbol passed into getStockVolatility()");
            }
            return stock.mv / 100; //Convert from percentage to decimal
        },
        getStockForecast : function(symbol) {
            if (workerScript.checkingRam) {
                return updateStaticRam("getStockForecast", CONSTANTS.ScriptBuySellStockRamCost);
            }
            updateDynamicRam("getStockForecast", CONSTANTS.ScriptBuySellStockRamCost);
            if (!Player.has4SDataTixApi) {
                throw makeRuntimeRejectMsg(workerScript, "You don't have 4S Market Data TIX API Access! Cannot use getStockForecast()");
            }
            var stock = SymbolToStockMap[symbol];
            if (stock == null) {
                throw makeRuntimeRejectMsg(workerScript, "ERROR: Invalid stock symbol passed into getStockForecast()");
            }
            var forecast = 50;
            stock.b ? forecast += stock.otlkMag : forecast -= stock.otlkMag;
            return forecast / 100; //Convert from percentage to decimal
        },
        getPurchasedServerLimit : function() {
            if (workerScript.checkingRam) {
                return updateStaticRam("getPurchasedServerLimit", CONSTANTS.ScriptGetPurchasedServerLimit);
            }
            updateDynamicRam("getPurchasedServerLimit", CONSTANTS.ScriptGetPurchasedServerLimit);

            return CONSTANTS.PurchasedServerLimit;
        },
        getPurchasedServerMaxRam: function() {
            if (workerScript.checkingRam) {
                return updateStaticRam("getPurchasedServerMaxRam", CONSTANTS.ScriptGetPurchasedServerMaxRam);
            }
            updateDynamicRam("getPurchasedServerMaxRam", CONSTANTS.ScriptGetPurchasedServerMaxRam);

            return CONSTANTS.PurchasedServerMaxRam;
        },
        getPurchasedServerCost: function(ram) {
            if (workerScript.checkingRam) {
                return updateStaticRam("getPurchasedServerCost", CONSTANTS.ScriptGetPurchaseServerRamCost);
            }
            updateDynamicRam("getPurchasedServerCost", CONSTANTS.ScriptGetPurchaseServerRamCost);

            let cost = 0;
            try {
                cost = getPurchaseServerRamCostGuard(ram);
            } catch (e) {
                workerScript.scriptRef.log("ERROR: 'getPurchasedServerCost()' " + e.message);
                return "";
            }

            return cost;
        },
        purchaseServer : function(hostname, ram) {
            if (workerScript.checkingRam) {
                return updateStaticRam("purchaseServer", CONSTANTS.ScriptPurchaseServerRamCost);
            }
            updateDynamicRam("purchaseServer", CONSTANTS.ScriptPurchaseServerRamCost);
            var hostnameStr = String(hostname);
            hostnameStr = hostnameStr.replace(/\s+/g, '');
            if (hostnameStr == "") {
                workerScript.scriptRef.log("ERROR: Passed empty string for hostname argument of purchaseServer()");
                return "";
            }

            if (Player.purchasedServers.length >= CONSTANTS.PurchasedServerLimit) {
                workerScript.scriptRef.log("ERROR: You have reached the maximum limit of " + CONSTANTS.PurchasedServerLimit +
                                           " servers. You cannot purchase any more.");
                return "";
            }

            let cost = 0;
            try {
                cost = getPurchaseServerRamCostGuard(ram);
            } catch (e) {
                workerScript.scriptRef.log("ERROR: 'purchaseServer()' " + e.message);
                return "";
            }

            if (Player.money.lt(cost)) {
                workerScript.scriptRef.log("ERROR: Not enough money to purchase server. Need $" + formatNumber(cost, 2));
                return "";
            }
            var newServ = new Server({
                ip: createRandomIp(),
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
        deleteServer : function(hostname) {
            if (workerScript.checkingRam) {
                return updateStaticRam("deleteServer", CONSTANTS.ScriptPurchaseServerRamCost);
            }
            updateDynamicRam("deleteServer", CONSTANTS.ScriptPurchaseServerRamCost);
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

            //Can't delete server you're currently connected to
            if (server.isConnectedTo) {
                workerScript.scriptRef.log("ERROR: deleteServer() failed because you are currently connected to the server you are trying to delete");
                return false;
            }

            //A server cannot delete itself
            if (ip === workerScript.serverIp) {
                workerScript.scriptRef.log("ERROR: Cannot call deleteServer() on self. deleteServer() failed");
                return false;
            }

            //Delete all scripts running on server
            if (server.runningScripts.length > 0) {
                workerScript.scriptRef.log("ERROR: Cannot delete server " + server.hostname + " because it still has scripts running.");
                return false;
            }

            //Delete from player's purchasedServers array
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

            //Delete from all servers
            delete AllServers[ip];

            //Delete from home computer
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
            //Wasn't found on home computer
            workerScript.scriptRef.log("ERROR: Could not find server " + server.hostname +
                                       "as a purchased server. This is likely a bug please contact game dev");
            return false;
        },
        getPurchasedServers : function(hostname=true) {
            if (workerScript.checkingRam) {
                return updateStaticRam("getPurchasedServers", CONSTANTS.ScriptPurchaseServerRamCost);
            }
            updateDynamicRam("getPurchasedServers", CONSTANTS.ScriptPurchaseServerRamCost);
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
        write : function(port, data="", mode="a") {
            if (workerScript.checkingRam) {
                return updateStaticRam("write", CONSTANTS.ScriptReadWriteRamCost);
            }
            updateDynamicRam("write", CONSTANTS.ScriptReadWriteRamCost);
            if (!isNaN(port)) { //Write to port
                //Port 1-10
                port = Math.round(port);
                if (port < 1 || port > CONSTANTS.NumNetscriptPorts) {
                    throw makeRuntimeRejectMsg(workerScript, "ERROR: Trying to write to invalid port: " + port + ". Only ports 1-" + CONSTANTS.NumNetscriptPorts + " are valid.");
                }
                var port = NetscriptPorts[port-1];
                if (port == null || !(port instanceof NetscriptPort)) {
                    throw makeRuntimeRejectMsg(workerScript, "Could not find port: " + port + ". This is a bug contact the game developer");
                }
                return port.write(data);
            } else if (isString(port)) { //Write to script or text file
                var fn = port;
                var server = workerScript.getServer();
                if (server == null) {
                    throw makeRuntimeRejectMsg(workerScript, "Error getting Server for this script in write(). This is a bug please contact game dev");
                }
                if (isScriptFilename(fn)) {
                    //Write to script
                    let script = workerScript.getScriptOnServer(fn);
                    if (script == null) {
                        //Create a new script
                        script = new Script(fn, data, server.ip);
                        server.scripts.push(script);
                        return true;
                    }
                    mode === "w" ? script.code = data : script.code += data;
                    script.updateRamUsage();
                } else {
                    //Write to text file
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
        tryWrite : function(port, data="") {
            if (workerScript.checkingRam) {
                return updateStaticRam("tryWrite", CONSTANTS.ScriptReadWriteRamCost);
            }
            updateDynamicRam("tryWrite", CONSTANTS.ScriptReadWriteRamCost);
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
        read : function(port) {
            if (workerScript.checkingRam) {
                return updateStaticRam("read", CONSTANTS.ScriptReadWriteRamCost);
            }
            updateDynamicRam("read", CONSTANTS.ScriptReadWriteRamCost);
            if (!isNaN(port)) { //Read from port
                //Port 1-10
                port = Math.round(port);
                if (port < 1 || port > CONSTANTS.NumNetscriptPorts) {
                    throw makeRuntimeRejectMsg(workerScript, "ERROR: Trying to read from invalid port: " + port + ". Only ports 1-" + CONSTANTS.NumNetscriptPorts + " are valid.");
                }
                var port = NetscriptPorts[port-1];
                if (port == null || !(port instanceof NetscriptPort)) {
                    throw makeRuntimeRejectMsg(workerScript, "ERROR: Could not find port: " + port + ". This is a bug contact the game developer");
                }
                return port.read();
            } else if (isString(port)) { //Read from script or text file
                let fn = port;
                let server = getServer(workerScript.serverIp);
                if (server == null) {
                    throw makeRuntimeRejectMsg(workerScript, "Error getting Server for this script in read(). This is a bug please contact game dev");
                }
                if (isScriptFilename(fn)) {
                    //Read from script
                    let script = workerScript.getScriptOnServer(fn);
                    if (script == null) {
                        return "";
                    }
                    return script.code;
                } else {
                    //Read from text file
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
        peek : function(port) {
            if (workerScript.checkingRam) {
                return updateStaticRam("peek", CONSTANTS.ScriptReadWriteRamCost);
            }
            updateDynamicRam("peek", CONSTANTS.ScriptReadWriteRamCost);
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
        clear : function(port) {
            if (workerScript.checkingRam) {
                return updateStaticRam("clear", CONSTANTS.ScriptReadWriteRamCost);
            }
            updateDynamicRam("clear", CONSTANTS.ScriptReadWriteRamCost);
            if (!isNaN(port)) { //Clear port
                port = Math.round(port);
                if (port < 1 || port > CONSTANTS.NumNetscriptPorts) {
                    throw makeRuntimeRejectMsg(workerScript, "ERROR: Trying to clear invalid port: " + port + ". Only ports 1-" + CONSTANTS.NumNetscriptPorts + " are valid");
                }
                var port = NetscriptPorts[port-1];
                if (port == null || !(port instanceof NetscriptPort)) {
                    throw makeRuntimeRejectMsg(workerScript, "ERROR: Could not find port: " + port + ". This is a bug contact the game developer");
                }
                return port.clear();
            } else if (isString(port)) { //Clear text file
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
        getPortHandle : function(port) {
            if (workerScript.checkingRam) {
                return updateStaticRam("getPortHandle", CONSTANTS.ScriptReadWriteRamCost * 10);
            }
            updateDynamicRam("getPortHandle", CONSTANTS.ScriptReadWriteRamCost * 10);
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
        rm : function(fn) {
            if (workerScript.checkingRam) {
                return updateStaticRam("rm", CONSTANTS.ScriptReadWriteRamCost);
            }
            updateDynamicRam("rm", CONSTANTS.ScriptReadWriteRamCost);
            var s = getServer(workerScript.serverIp);
            if (s == null) {
                throw makeRuntimeRejectMsg(workerScript, "Error getting Server for this script in clear(). This is a bug please contact game dev");
            }

            if (fn.includes(".exe")) {
                for (var i = 0; i < s.programs.length; ++i) {
                    if (s.programs[i] === fn) {
                       s.programs.splice(i, 1);
                       return true;
                    }
                }
            } else if (isScriptFilename(fn)) {
                for (var i = 0; i < s.scripts.length; ++i) {
                    if (s.scripts[i].filename === fn) {
                        //Check that the script isnt currently running
                        for (var j = 0; j < s.runningScripts.length; ++j) {
                            if (s.runningScripts[j].filename === fn) {
                                workerScript.scriptRef.log("Cannot delete a script that is currently running!");
                                return false;
                            }
                        }
                        s.scripts.splice(i, 1);
                        return true;
                    }
                }
            } else if (fn.endsWith(".lit")) {
                for (var i = 0; i < s.messages.length; ++i) {
                    var f = s.messages[i];
                    if (!(f instanceof Message) && isString(f) && f === fn) {
                        s.messages.splice(i, 1);
                        return true;
                    }
                }
            } else if (fn.endsWith(".txt")) {
                for (var i = 0; i < s.textFiles.length; ++i) {
                    if (s.textFiles[i].fn === fn) {
                        s.textFiles.splice(i, 1);
                        return true;
                    }
                }
            } else if (fn.endsWith(".cct")) {
                for (var i = 0; i < s.contracts.length; ++i) {
                    if (s.contracts[i].fn === fn) {
                        s.contracts.splice(i, 1);
                        return true;
                    }
                }
            }
            return false;
        },
        scriptRunning : function(scriptname, ip) {
            if (workerScript.checkingRam) {
                return updateStaticRam("scriptRunning", CONSTANTS.ScriptArbScriptRamCost);
            }
            updateDynamicRam("scriptRunning", CONSTANTS.ScriptArbScriptRamCost);
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
        scriptKill : function(scriptname, ip) {
            if (workerScript.checkingRam) {
                return updateStaticRam("scriptKill", CONSTANTS.ScriptArbScriptRamCost);
            }
            updateDynamicRam("scriptKill", CONSTANTS.ScriptArbScriptRamCost);
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
        getScriptName : function() {
            if (workerScript.checkingRam) {return 0;}
            return workerScript.name;
        },
        getScriptRam : function (scriptname, ip=workerScript.serverIp) {
            if (workerScript.checkingRam) {
                return updateStaticRam("getScriptRam", CONSTANTS.ScriptGetScriptRamCost);
            }
            updateDynamicRam("getScriptRam", CONSTANTS.ScriptGetScriptRamCost);
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
        getHackTime : function(ip, hack, int) {
            if (workerScript.checkingRam) {
                return updateStaticRam("getHackTime", CONSTANTS.ScriptGetHackTimeRamCost);
            }
            updateDynamicRam("getHackTime", CONSTANTS.ScriptGetHackTimeRamCost);
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("getHackTime() failed. Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "getHackTime() failed. Invalid IP or hostname passed in: " + ip);
            }
            return calculateHackingTime(server, hack, int); //Returns seconds
        },
        getGrowTime : function(ip, hack, int) {
            if (workerScript.checkingRam) {
                return updateStaticRam("getGrowTime", CONSTANTS.ScriptGetHackTimeRamCost);
            }
            updateDynamicRam("getGrowTime", CONSTANTS.ScriptGetHackTimeRamCost);
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("getGrowTime() failed. Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "getGrowTime() failed. Invalid IP or hostname passed in: " + ip);
            }
            return calculateGrowTime(server, hack, int); //Returns seconds
        },
        getWeakenTime : function(ip, hack, int) {
            if (workerScript.checkingRam) {
                return updateStaticRam("getWeakenTime", CONSTANTS.ScriptGetHackTimeRamCost);
            }
            updateDynamicRam("getWeakenTime", CONSTANTS.ScriptGetHackTimeRamCost);
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("getWeakenTime() failed. Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "getWeakenTime() failed. Invalid IP or hostname passed in: " + ip);
            }
            return calculateWeakenTime(server, hack, int); //Returns seconds
        },
        getScriptIncome : function(scriptname, ip) {
            if (workerScript.checkingRam) {
                return updateStaticRam("getScriptIncome", CONSTANTS.ScriptGetScriptRamCost);
            }
            updateDynamicRam("getScriptIncome", CONSTANTS.ScriptGetScriptRamCost);
            if (arguments.length === 0) {
                //Get total script income
                var res = [];
                res.push(updateActiveScriptsItems());
                res.push(Player.scriptProdSinceLastAug / (Player.playtimeSinceLastAug/1000));
                return res;
            } else {
                //Get income for a particular script
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
        getScriptExpGain : function(scriptname, ip) {
            if (workerScript.checkingRam) {
                return updateStaticRam("getScriptExpGain", CONSTANTS.ScriptGetScriptRamCost);
            }
            updateDynamicRam("getScriptExpGain", CONSTANTS.ScriptGetScriptRamCost);
            if (arguments.length === 0) {
                var total = 0;
                for (var i = 0; i < workerScripts.length; ++i) {
                    total += (workerScripts[i].scriptRef.onlineExpGained / workerScripts[i].scriptRef.onlineRunningTime);
                }
                return total;
            } else {
                //Get income for a particular script
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
        getTimeSinceLastAug : function() {
            if (workerScript.checkingRam) {
                return updateStaticRam("getTimeSinceLastAug", CONSTANTS.ScriptGetHackTimeRamCost);
            }
            updateDynamicRam("getTimeSinceLastAug", CONSTANTS.ScriptGetHackTimeRamCost);
            return Player.playtimeSinceLastAug;
        },
        prompt : function(txt) {
            if (workerScript.checkingRam) {return 0;}
            if (yesNoBoxOpen) {
                workerScript.scriptRef.log("ERROR: confirm() failed because a pop-up dialog box is already open");
                return false;
            }
            if (!isString(txt)) {txt = String(txt);}
            var yesBtn = yesNoBoxGetYesButton(), noBtn = yesNoBoxGetNoButton();
            yesBtn.innerHTML = "Yes";
            noBtn.innerHTML = "No";
            return new Promise(function(resolve, reject) {
                yesBtn.addEventListener("click", ()=>{
                    yesNoBoxClose();
                    resolve(true);
                });
                noBtn.addEventListener("click", ()=>{
                    yesNoBoxClose();
                    resolve(false);
                });
                yesNoBoxCreate(txt);
            });
        },
        wget : async function(url, target, ip=workerScript.serverIp) {
            if (workerScript.checkingRam) { return 0; }
            if (!isScriptFilename(target) && !target.endsWith(".txt")) {
                workerSript.log(`ERROR: wget() failed because of an invalid target file: ${target}. Target file must be a script or text file`);
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
            if (workerScript.checkingRam) {
                return updateStaticRam("getFavorToDonate", CONSTANTS.ScriptGetFavorToDonate);
            }
            updateDynamicRam("getFavorToDonate", CONSTANTS.ScriptGetFavorToDonate);
            return Math.floor(CONSTANTS.BaseFavorToDonate * BitNodeMultipliers.RepToDonateToFaction);
        },

        /* Singularity Functions */
        universityCourse : function(universityName, className) {
            var ramCost = CONSTANTS.ScriptSingularityFn1RamCost;
            if (Player.bitNodeN !== 4) {ramCost *= CONSTANTS.ScriptSingularityFnRamMult;}
            if (workerScript.checkingRam) {
                return updateStaticRam("universityCourse", ramCost);
            }
            updateDynamicRam("universityCourse", ramCost);
            if (Player.bitNodeN != 4) {
                if (!(hasSingularitySF && singularitySFLvl >= 1)) {
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
                case Locations.AevumSummitUniversity.toLowerCase():
                    if (Player.city != Locations.Aevum) {
                        workerScript.scriptRef.log("ERROR: You cannot study at Summit University because you are not in Aevum. universityCourse() failed");
                        return false;
                    }
                    Player.location = Locations.AevumSummitUniversity;
                    costMult = 4;
                    expMult = 3;
                    break;
                case Locations.Sector12RothmanUniversity.toLowerCase():
                    if (Player.city != Locations.Sector12) {
                        workerScript.scriptRef.log("ERROR: You cannot study at Rothman University because you are not in Sector-12. universityCourse() failed");
                        return false;
                    }
                    Player.location = Locations.Sector12RothmanUniversity;
                    costMult = 3;
                    expMult = 2;
                    break;
                case Locations.VolhavenZBInstituteOfTechnology.toLowerCase():
                    if (Player.city != Locations.Volhaven) {
                        workerScript.scriptRef.log("ERROR: You cannot study at ZB Institute of Technology because you are not in Volhaven. universityCourse() failed");
                        return false;
                    }
                    Player.location = Locations.VolhavenZBInstituteOfTechnology;
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

        gymWorkout : function(gymName, stat) {
            var ramCost = CONSTANTS.ScriptSingularityFn1RamCost;
            if (Player.bitNodeN !== 4) {ramCost *= CONSTANTS.ScriptSingularityFnRamMult;}
            if (workerScript.checkingRam) {
                return updateStaticRam("gymWorkout", ramCost);
            }
            updateDynamicRam("gymWorkout", ramCost);
            if (Player.bitNodeN != 4) {
                if (!(hasSingularitySF && singularitySFLvl >= 1)) {
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
                case Locations.AevumCrushFitnessGym.toLowerCase():
                    if (Player.city != Locations.Aevum) {
                        workerScript.scriptRef.log("ERROR: You cannot workout at Crush Fitness because you are not in Aevum. gymWorkout() failed");
                        return false;
                    }
                    Player.location = Locations.AevumCrushFitnessGym;
                    costMult = 3;
                    expMult = 2;
                    break;
                case Locations.AevumSnapFitnessGym.toLowerCase():
                    if (Player.city != Locations.Aevum) {
                        workerScript.scriptRef.log("ERROR: You cannot workout at Snap Fitness because you are not in Aevum. gymWorkout() failed");
                        return false;
                    }
                    Player.location = Locations.AevumSnapFitnessGym;
                    costMult = 10;
                    expMult = 5;
                    break;
                case Locations.Sector12IronGym.toLowerCase():
                    if (Player.city != Locations.Sector12) {
                        workerScript.scriptRef.log("ERROR: You cannot workout at Iron Gym because you are not in Sector-12. gymWorkout() failed");
                        return false;
                    }
                    Player.location = Locations.Sector12IronGym;
                    costMult = 1;
                    expMult = 1;
                    break;
                case Locations.Sector12PowerhouseGym.toLowerCase():
                    if (Player.city != Locations.Sector12) {
                        workerScript.scriptRef.log("ERROR: You cannot workout at Powerhouse Gym because you are not in Sector-12. gymWorkout() failed");
                        return false;
                    }
                    Player.location = Locations.Sector12PowerhouseGym;
                    costMult = 20;
                    expMult = 10;
                    break;
                case Locations.VolhavenMilleniumFitnessGym:
                    if (Player.city != Locations.Volhaven) {
                        workerScript.scriptRef.log("ERROR: You cannot workout at Millenium Fitness Gym because you are not in Volhaven. gymWorkout() failed");
                        return false;
                    }
                    Player.location = Locations.VolhavenMilleniumFitnessGym;
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

        travelToCity(cityname) {
            var ramCost = CONSTANTS.ScriptSingularityFn1RamCost;
            if (Player.bitNodeN !== 4) {ramCost *= CONSTANTS.ScriptSingularityFnRamMult;}
            if (workerScript.checkingRam) {
                return updateStaticRam("travelToCity", ramCost);
            }
            updateDynamicRam("travelToCity", ramCost);
            if (Player.bitNodeN != 4) {
                if (!(hasSingularitySF && singularitySFLvl >= 1)) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run travelToCity(). It is a Singularity Function and requires SourceFile-4 (level 1) to run.");
                    return false;
                }
            }

            switch(cityname) {
                case Locations.Aevum:
                case Locations.Chongqing:
                case Locations.Sector12:
                case Locations.NewTokyo:
                case Locations.Ishima:
                case Locations.Volhaven:
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

        purchaseTor() {
            var ramCost = CONSTANTS.ScriptSingularityFn1RamCost;
            if (Player.bitNodeN !== 4) {ramCost *= CONSTANTS.ScriptSingularityFnRamMult;}
            if (workerScript.checkingRam) {
                return updateStaticRam("purchaseTor", ramCost);
            }
            updateDynamicRam("purchaseTor", ramCost);
            if (Player.bitNodeN != 4) {
                if (!(hasSingularitySF && singularitySFLvl >= 1)) {
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

            var darkweb = new Server({
                ip:createRandomIp(), hostname:"darkweb", organizationName:"",
                isConnectedTo:false, adminRights:false, purchasedByPlayer:false, maxRam:1
            });
            AddToAllServers(darkweb);
            SpecialServerIps.addIp("Darkweb Server", darkweb.ip);

            const purchaseTor = document.getElementById("location-purchase-tor");
            purchaseTor.setAttribute("class", "a-link-button-bought");
            purchaseTor.innerHTML = "TOR Router - Purchased";

            Player.getHomeComputer().serversOnNetwork.push(darkweb.ip);
            darkweb.serversOnNetwork.push(Player.getHomeComputer().ip);
            Player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain);
            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.purchaseTor == null) {
                workerScript.scriptRef.log("You have purchased a Tor router!");
            }
            return true;
        },
        purchaseProgram(programName) {
            var ramCost = CONSTANTS.ScriptSingularityFn1RamCost;
            if (Player.bitNodeN !== 4) {ramCost *= CONSTANTS.ScriptSingularityFnRamMult;}
            if (workerScript.checkingRam) {
                return updateStaticRam("purchaseProgram", ramCost);
            }
            updateDynamicRam("purchaseProgram", ramCost);
            if (Player.bitNodeN != 4) {
                if (!(hasSingularitySF && singularitySFLvl >= 1)) {
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
        getStats : function() {
            var ramCost = CONSTANTS.ScriptSingularityFn1RamCost / 4;
            if (Player.bitNodeN !== 4) {ramCost *= CONSTANTS.ScriptSingularityFnRamMult;}
            if (workerScript.checkingRam) {
                return updateStaticRam("getStats", ramCost);
            }
            updateDynamicRam("getStats", ramCost);
            if (Player.bitNodeN != 4) {
                if (!(hasSingularitySF && singularitySFLvl >= 1)) {
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
        getCharacterInformation : function() {
            var ramCost = CONSTANTS.ScriptSingularityFn1RamCost / 4;
            if (Player.bitNodeN !== 4) {ramCost *= CONSTANTS.ScriptSingularityFnRamMult;}
            if (workerScript.checkingRam) {
                return updateStaticRam("getCharacterInformation", ramCost);
            }
            updateDynamicRam("getCharacterInformation", ramCost);
            if (Player.bitNodeN != 4) {
                if (!(hasSingularitySF && singularitySFLvl >= 1)) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run getCharacterInformation(). It is a Singularity Function and requires SourceFile-4 (level 1) to run.");
                    return {};
                }
            }

            var companyPositionTitle = "";
            if (Player.companyPosition instanceof CompanyPosition) {
                companyPositionTitle = Player.companyPosition.positionName;
            }
            return {
                bitnode:            Player.bitNodeN,
                company:            Player.companyName,
                jobTitle:           companyPositionTitle,
                city:               Player.city,
                factions:           Player.factions.slice(),
                tor:                SpecialServerIps.hasOwnProperty("Darkweb Server"),
                timeWorked:         Player.timeWorked,
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
        isBusy : function() {
            var ramCost = CONSTANTS.ScriptSingularityFn1RamCost / 4;
            if (Player.bitNodeN !== 4) {ramCost *= CONSTANTS.ScriptSingularityFnRamMult;}
            if (workerScript.checkingRam) {
                return updateStaticRam("isBusy", ramCost);
            }
            updateDynamicRam("isBusy", ramCost);
            if (Player.bitNodeN != 4) {
                if (!(hasSingularitySF && singularitySFLvl >= 1)) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run isBusy(). It is a Singularity Function and requires SourceFile-4 (level 1) to run.");
                    return;
                }
            }
            return Player.isWorking;
        },
        stopAction : function() {
            var ramCost = CONSTANTS.ScriptSingularityFn1RamCost / 2;
            if (Player.bitNodeN !== 4) {ramCost *= CONSTANTS.ScriptSingularityFnRamMult;}
            if (workerScript.checkingRam) {
                return updateStaticRam("stopAction", ramCost);
            }
            updateDynamicRam("stopAction", ramCost);
            if (Player.bitNodeN != 4) {
                if (!(hasSingularitySF && singularitySFLvl >= 1)) {
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
        upgradeHomeRam : function() {
            var ramCost = CONSTANTS.ScriptSingularityFn2RamCost;
            if (Player.bitNodeN !== 4) {ramCost *= CONSTANTS.ScriptSingularityFnRamMult;}
            if (workerScript.checkingRam) {
                return updateStaticRam("upgradeHomeRam", ramCost);
            }
            updateDynamicRam("upgradeHomeRam", ramCost);
            if (Player.bitNodeN != 4) {
                if (!(hasSingularitySF && singularitySFLvl >= 2)) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run upgradeHomeRam(). It is a Singularity Function and requires SourceFile-4 (level 2) to run.");
                    return false;
                }
            }

            const cost = Player.getUpgradeHomeRamCost();

            if (Player.money.lt(cost)) {
                workerScript.scriptRef.log("ERROR: upgradeHomeRam() failed because you don't have enough money");
                return false;
            }

            var homeComputer = Player.getHomeComputer();
            homeComputer.maxRam *= 2;

            Player.loseMoney(cost);

            Player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain);
            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.upgradeHomeRam == null) {
                workerScript.scriptRef.log("Purchased additional RAM for home computer! It now has " + homeComputer.maxRam + "GB of RAM.");
            }
            return true;
        },
        getUpgradeHomeRamCost : function() {
            var ramCost = CONSTANTS.ScriptSingularityFn2RamCost / 2;
            if (Player.bitNodeN !== 4) {ramCost *= CONSTANTS.ScriptSingularityFnRamMult;}
            if (workerScript.checkingRam) {
                return updateStaticRam("getUpgradeHomeRamCost", ramCost);
            }
            updateDynamicRam("getUpgradeHomeRamCost", ramCost);
            if (Player.bitNodeN != 4) {
                if (!(hasSingularitySF && singularitySFLvl >= 2)) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run getUpgradeHomeRamCost(). It is a Singularity Function and requires SourceFile-4 (level 2) to run.");
                    return false;
                }
            }

            return Player.getUpgradeHomeRamCost();
        },
        workForCompany : function() {
            var ramCost = CONSTANTS.ScriptSingularityFn2RamCost;
            if (Player.bitNodeN !== 4) {ramCost *= CONSTANTS.ScriptSingularityFnRamMult;}
            if (workerScript.checkingRam) {
                return updateStaticRam("workForCompany", ramCost);
            }
            updateDynamicRam("workForCompany", ramCost);
            if (Player.bitNodeN != 4) {
                if (!(hasSingularitySF && singularitySFLvl >= 2)) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run workForCompany(). It is a Singularity Function and requires SourceFile-4 (level 2) to run.");
                    return false;
                }
            }

            if (inMission) {
                workerScript.scriptRef.log("ERROR: workForCompany() failed because you are in the middle of a mission.");
                return;
            }

            if (Player.companyPosition == "" || !(Player.companyPosition instanceof CompanyPosition)) {
                workerScript.scriptRef.log("ERROR: workForCompany() failed because you do not have a job");
                return false;
            }

            if (Player.isWorking) {
                var txt = Player.singularityStopWork();
                if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.workForCompany == null) {
                    workerScript.scriptRef.log(txt);
                }
            }

            if (Player.companyPosition.isPartTimeJob()) {
                Player.startWorkPartTime();
            } else {
                Player.startWork();
            }
            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.workForCompany == null) {
                workerScript.scriptRef.log("Began working at " + Player.companyName + " as a " + Player.companyPosition.positionName);
            }
            return true;
        },
        applyToCompany : function(companyName, field) {
            var ramCost = CONSTANTS.ScriptSingularityFn2RamCost;
            if (Player.bitNodeN !== 4) {ramCost *= CONSTANTS.ScriptSingularityFnRamMult;}
            if (workerScript.checkingRam) {
                return updateStaticRam("applyToCompany", ramCost);
            }
            updateDynamicRam("applyToCompany", ramCost);
            if (Player.bitNodeN != 4) {
                if (!(hasSingularitySF && singularitySFLvl >= 2)) {
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
            //The Player object's applyForJob function can return string with special error messages
            if (isString(res)) {
                workerScript.scriptRef.log(res);
                return false;
            }
            if (res) {
                if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.applyToCompany == null) {
                    workerScript.scriptRef.log("You were offered a new job at " + companyName + " as a " + Player.companyPosition.positionName);
                }
            } else {
                if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.applyToCompany == null) {
                    workerScript.scriptRef.log("You failed to get a new job/promotion at " + companyName + " in the " + field + " field.");
                }
            }
            return res;
        },
        getCompanyRep : function(companyName) {
            var ramCost = CONSTANTS.ScriptSingularityFn2RamCost / 2;
            if (Player.bitNodeN !== 4) {ramCost *= CONSTANTS.ScriptSingularityFnRamMult;}
            if (workerScript.checkingRam) {
                return updateStaticRam("getCompanyRep", ramCost);
            }
            updateDynamicRam("getCompanyRep", ramCost);
            if (Player.bitNodeN != 4) {
                if (!(hasSingularitySF && singularitySFLvl >= 2)) {
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
        getCompanyFavor : function(companyName) {
            var ramCost = CONSTANTS.ScriptSingularityFn2RamCost / 4;
            if (Player.bitNodeN !== 4) {ramCost *= CONSTANTS.ScriptSingularityFnRamMult;}
            if (workerScript.checkingRam) {
                return updateStaticRam("getCompanyFavor", ramCost);
            }
            updateDynamicRam("getCompanyFavor", ramCost);
            if (Player.bitNodeN != 4) {
                if (!(hasSingularitySF && singularitySFLvl >= 2)) {
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
        getCompanyFavorGain : function(companyName) {
            var ramCost = CONSTANTS.ScriptSingularityFn2RamCost / 4;
            if (Player.bitNodeN !== 4) {ramCost *= CONSTANTS.ScriptSingularityFnRamMult;}
            if (workerScript.checkingRam) {
                return updateStaticRam("getCompanyFavorGain", ramCost);
            }
            updateDynamicRam("getCompanyFavorGain", ramCost);
            if (Player.bitNodeN != 4) {
                if (!(hasSingularitySF && singularitySFLvl >= 2)) {
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
        checkFactionInvitations : function() {
            var ramCost = CONSTANTS.ScriptSingularityFn2RamCost;
            if (Player.bitNodeN !== 4) {ramCost *= CONSTANTS.ScriptSingularityFnRamMult;}
            if (workerScript.checkingRam) {
                return updateStaticRam("checkFactionInvitations", ramCost);
            }
            updateDynamicRam("checkFactionInvitations", ramCost);
            if (Player.bitNodeN != 4) {
                if (!(hasSingularitySF && singularitySFLvl >= 2)) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run checkFactionInvitations(). It is a Singularity Function and requires SourceFile-4 (level 2) to run.");
                    return false;
                }
            }
            //Make a copy of Player.factionInvitations
            return Player.factionInvitations.slice();
        },
        joinFaction : function(name) {
            var ramCost = CONSTANTS.ScriptSingularityFn2RamCost;
            if (Player.bitNodeN !== 4) {ramCost *= CONSTANTS.ScriptSingularityFnRamMult;}
            if (workerScript.checkingRam) {
                return updateStaticRam("joinFaction", ramCost);
            }
            updateDynamicRam("joinFaction", ramCost);
            if (Player.bitNodeN != 4) {
                if (!(hasSingularitySF && singularitySFLvl >= 2)) {
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

            //Update Faction Invitation list to account for joined + banned factions
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
        workForFaction : function(name, type) {
            var ramCost = CONSTANTS.ScriptSingularityFn2RamCost;
            if (Player.bitNodeN !== 4) {ramCost *= CONSTANTS.ScriptSingularityFnRamMult;}
            if (workerScript.checkingRam) {
                return updateStaticRam("workForFaction", ramCost);
            }
            updateDynamicRam("workForFaction", ramCost);
            if (Player.bitNodeN != 4) {
                if (!(hasSingularitySF && singularitySFLvl >= 2)) {
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
            //Arrays listing factions that allow each time of work
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
        getFactionRep : function(name) {
            var ramCost = CONSTANTS.ScriptSingularityFn2RamCost / 4;
            if (Player.bitNodeN !== 4) {ramCost *= CONSTANTS.ScriptSingularityFnRamMult;}
            if (workerScript.checkingRam) {
                return updateStaticRam("getFactionRep", ramCost);
            }
            updateDynamicRam("getFactionRep", ramCost);
            if (Player.bitNodeN != 4) {
                if (!(hasSingularitySF && singularitySFLvl >= 2)) {
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
        getFactionFavor : function(name) {
            var ramCost = CONSTANTS.ScriptSingularityFn2RamCost;
            if (Player.bitNodeN !== 4) {ramCost *= CONSTANTS.ScriptSingularityFnRamMult;}
            if (workerScript.checkingRam) {
                return updateStaticRam("getFactionFavor", ramCost);
            }
            updateDynamicRam("getFactionFavor", ramCost);
            if (Player.bitNodeN != 4) {
                if (!(hasSingularitySF && singularitySFLvl >= 2)) {
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
            var ramCost = CONSTANTS.ScriptSingularityFn2RamCost;
            if (Player.bitNodeN !== 4) {ramCost *= CONSTANTS.ScriptSingularityFnRamMult;}
            if (workerScript.checkingRam) {
                return updateStaticRam("getFactionFavorGain", ramCost);
            }
            updateDynamicRam("getFactionFavorGain", ramCost);
            if (Player.bitNodeN != 4) {
                if (!(hasSingularitySF && singularitySFLvl >= 2)) {
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
        donateToFaction : function(name, amt) {
            var ramCost = CONSTANTS.ScriptSingularityFn3RamCost;
            if (Player.bitNodeN !== 4) {ramCost *= CONSTANTS.ScriptSingularityFnRamMult;}
            if (workerScript.checkingRam) {
                return updateStaticRam("donateToFaction", ramCost);
            }
            updateDynamicRam("donateToFaction", ramCost);
            if (Player.bitNodeN != 4) {
                if (!(hasSingularitySF && singularitySFLvl >= 3)) {
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
        createProgram : function(name) {
            var ramCost = CONSTANTS.ScriptSingularityFn3RamCost;
            if (Player.bitNodeN !== 4) {ramCost *= CONSTANTS.ScriptSingularityFnRamMult;}
            if (workerScript.checkingRam) {
                return updateStaticRam("createProgram", ramCost);
            }
            updateDynamicRam("createProgram", ramCost);
            if (Player.bitNodeN != 4) {
                if (!(hasSingularitySF && singularitySFLvl >= 3)) {
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

            if (!p.create.req()) {
                workerScript.scriptRef.log("ERROR: createProgram() failed because hacking level is too low to create " + p.name + " (level " + p.create.level + " req)");
                return false
            }

            Player.startCreateProgramWork(p.name, p.create.time, p.create.level);
            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.createProgram == null) {
                workerScript.scriptRef.log("Began creating program: " + name);
            }
            return true;
        },
        commitCrime : function(crimeRoughName) {
            var ramCost = CONSTANTS.ScriptSingularityFn3RamCost;
            if (Player.bitNodeN !== 4) {ramCost *= CONSTANTS.ScriptSingularityFnRamMult;}
            if (workerScript.checkingRam) {
                return updateStaticRam("commitCrime", ramCost);
            }
            updateDynamicRam("commitCrime", ramCost);
            if (Player.bitNodeN != 4) {
                if (!(hasSingularitySF && singularitySFLvl >= 3)) {
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

            //Set Location to slums
            switch(Player.city) {
                case Locations.Aevum:
                    Player.location = Locations.AevumSlums;
                    break;
                case Locations.Chongqing:
                    Player.location = Locations.ChongqingSlums;
                    break;
                case Locations.Sector12:
                    Player.location = Locations.Sector12Slums;
                    break;
                case Locations.NewTokyo:
                    Player.location = Locations.NewTokyoSlums;
                    break;
                case Locations.Ishima:
                    Player.location = Locations.IshimaSlums;
                    break;
                case Locations.Volhaven:
                    Player.location = Locations.VolhavenSlums;
                    break;
                default:
                    console.log("Invalid Player.city value");
            }

            const crime = findCrime(crimeRoughName.toLowerCase());
            if(crime == null) { // couldn't find crime
                throw makeRuntimeRejectMsg(workerScript, "Invalid crime passed into commitCrime(): " + crimeRoughName);
            }
            if(workerScript.disableLogs.ALL == null && workerScript.disableLogs.commitCrime == null) {
                workerScript.scriptRef.log("Attempting to commit crime: "+crime.name+"...");
            }
            return crime.commit(1, {workerscript: workerScript});
        },
        getCrimeChance : function(crimeRoughName) {
            var ramCost = CONSTANTS.ScriptSingularityFn3RamCost;
            if (Player.bitNodeN !== 4) {ramCost *= CONSTANTS.ScriptSingularityFnRamMult;}
            if (workerScript.checkingRam) {
                return updateStaticRam("getCrimeChance", ramCost);
            }
            updateDynamicRam("getCrimeChance", ramCost);
            if (Player.bitNodeN != 4) {
                if (!(hasSingularitySF && singularitySFLvl >= 3)) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run getCrimeChance(). It is a Singularity Function and requires SourceFile-4 (level 3) to run.");
                    return;
                }
            }

            const crime = findCrime(crimeRoughName.toLowerCase());
            if(crime == null) {
                throw makeRuntimeRejectMsg(workerScript, "Invalid crime passed into getCrimeChance(): " + crime);
            }

            return crime.successRate();
        },
        getOwnedAugmentations : function(purchased=false) {
            var ramCost = CONSTANTS.ScriptSingularityFn3RamCost;
            if (Player.bitNodeN !== 4) {ramCost *= CONSTANTS.ScriptSingularityFnRamMult;}
            if (workerScript.checkingRam) {
                return updateStaticRam("getOwnedAugmentations", ramCost);
            }
            updateDynamicRam("getOwnedAugmentations", ramCost);
            if (Player.bitNodeN != 4) {
                if (!(hasSingularitySF && singularitySFLvl >= 3)) {
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
        getOwnedSourceFiles : function() {
            let ramCost = CONSTANTS.ScriptSingularityFn3RamCost;
            if (Player.bitNodeN !== 4) {ramCost *= CONSTANTS.ScriptSingularityFnRamMult;}
            if (workerScript.checkingRam) {
                return updateStaticRam("getOwnedSourceFiles", ramCost);
            }
            updateDynamicRam("getOwnedSourceFiles", ramCost);
            if (Player.bitNodeN != 4) {
                if (!(hasSingularitySF && singularitySFLvl >= 3)) {
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
        getAugmentationsFromFaction : function(facname) {
            var ramCost = CONSTANTS.ScriptSingularityFn3RamCost;
            if (Player.bitNodeN !== 4) {ramCost *= CONSTANTS.ScriptSingularityFnRamMult;}
            if (workerScript.checkingRam) {
                return updateStaticRam("getAugmentationsFromFaction", ramCost);
            }
            updateDynamicRam("getAugmentationsFromFaction", ramCost);
            if (Player.bitNodeN != 4) {
                if (!(hasSingularitySF && singularitySFLvl >= 3)) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run getAugmentationsFromFaction(). It is a Singularity Function and requires SourceFile-4 (level 3) to run.");
                    return [];
                }
            }

            if (!factionExists(facname)) {
                workerScript.scriptRef.log("ERROR: getAugmentationsFromFaction() failed. Invalid faction name passed in (this is case-sensitive): " + facname);
                return [];
            }

            var fac = Factions[facname];
            var res = [];
            for (var i = 0; i < fac.augmentations.length; ++i) {
                res.push(fac.augmentations[i]);
            }
            return res;
        },
        getAugmentationCost : function(name) {
            var ramCost = CONSTANTS.ScriptSingularityFn3RamCost;
            if (Player.bitNodeN !== 4) {ramCost *= CONSTANTS.ScriptSingularityFnRamMult;}
            if (workerScript.checkingRam) {
                return updateStaticRam("getAugmentationCost", ramCost);
            }
            updateDynamicRam("getAugmentationCost", ramCost);
            if (Player.bitNodeN != 4) {
                if (!(hasSingularitySF && singularitySFLvl >= 3)) {
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
        purchaseAugmentation : function(faction, name) {
            var ramCost = CONSTANTS.ScriptSingularityFn3RamCost;
            if (Player.bitNodeN !== 4) {ramCost *= CONSTANTS.ScriptSingularityFnRamMult;}
            if (workerScript.checkingRam) {
                return updateStaticRam("purchaseAugmentation", ramCost);
            }
            updateDynamicRam("purchaseAugmentation", ramCost);
            if (Player.bitNodeN != 4) {
                if (!(hasSingularitySF && singularitySFLvl >= 3)) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run purchaseAugmentation(). It is a Singularity Function and requires SourceFile-4 (level 3) to run.");
                    return false;
                }
            }

            var fac = Factions[faction];
            if (fac == null || !(fac instanceof Faction)) {
                workerScript.scriptRef.log("ERROR: purchaseAugmentation() failed because of invalid faction name: " + faction);
                return false;
            }

            if (!fac.augmentations.includes(name)) {
                workerScript.scriptRef.log("ERROR: purchaseAugmentation() failed because the faction " + faction + " does not contain the " + name + " augmentation");
                return false;
            }

            var aug = Augmentations[name];
            if (aug == null || !(aug instanceof Augmentation)) {
                workerScript.scriptRef.log("ERROR: purchaseAugmentation() failed because of invalid augmentation name: " + name);
                return false;
            }

            var isNeuroflux = false;
            if (aug.name === AugmentationNames.NeuroFluxGovernor) {
                isNeuroflux = true;
            }

            if (!isNeuroflux) {
                for (var j = 0; j < Player.queuedAugmentations.length; ++j) {
                    if (Player.queuedAugmentations[j].name === aug.name) {
                        workerScript.scriptRef.log("ERROR: purchaseAugmentation() failed because you already have " + name);
                        return false;
                    }
                }
                for (var j = 0; j < Player.augmentations.length; ++j) {
                    if (Player.augmentations[j].name === aug.name) {
                        workerScript.scriptRef.log("ERROR: purchaseAugmentation() failed because you already have " + name);
                        return false;
                    }
                }
            }

            if (fac.playerReputation < aug.baseRepRequirement) {
                workerScript.scriptRef.log("ERROR: purchaseAugmentation() failed because you do not have enough reputation with " + fac.name);
                return false;
            }

            var res = purchaseAugmentation(aug, fac, true);
            workerScript.scriptRef.log(res);
            if (isString(res) && res.startsWith("You purchased")) {
                Player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain);
                return true;
            } else {
                return false;
            }
        },
        installAugmentations : function(cbScript) {
            var ramCost = CONSTANTS.ScriptSingularityFn3RamCost;
            if (Player.bitNodeN !== 4) {ramCost *= CONSTANTS.ScriptSingularityFnRamMult;}
            if (workerScript.checkingRam) {
                return updateStaticRam("installAugmentations", ramCost);
            }
            updateDynamicRam("installAugmentations", ramCost);
            if (Player.bitNodeN != 4) {
                if (!(hasSingularitySF && singularitySFLvl >= 3)) {
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
        gang : {
            getMemberNames : function() {
                if (workerScript.checkingRam) {
                    return updateStaticRam("getMemberNames", CONSTANTS.ScriptGangApiBaseRamCost / 4);
                }
                updateDynamicRam("getMemberNames", CONSTANTS.ScriptGangApiBaseRamCost / 4);
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
            getGangInformation : function() {
                if (workerScript.checkingRam) {
                    return updateStaticRam("getGangInformation", CONSTANTS.ScriptGangApiBaseRamCost / 2);
                }
                updateDynamicRam("getGangInformation", CONSTANTS.ScriptGangApiBaseRamCost / 2);
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
            getOtherGangInformation : function() {
                if (workerScript.checkingRam) {
                    return updateStaticRam("getOtherGangInformation", CONSTANTS.ScriptGangApiBaseRamCost / 2);
                }
                updateDynamicRam("getOtherGangInformation", CONSTANTS.ScriptGangApiBaseRamCost / 2);
                nsGang.checkGangApiAccess(workerScript, "getOtherGangInformation");

                try {
                    return Object.assign(AllGangs);
                } catch(e) {
                    throw makeRuntimeRejectMsg(workerScript, nsGang.unknownGangApiExceptionMessage("getOtherGangInformation", e));
                }
            },
            getMemberInformation : function(name) {
                if (workerScript.checkingRam) {
                    return updateStaticRam("getMemberInformation", CONSTANTS.ScriptGangApiBaseRamCost / 2);
                }
                updateDynamicRam("getMemberInformation", CONSTANTS.ScriptGangApiBaseRamCost / 2);
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
                                task:                   member.task.name,
                            }
                        }
                    }

                    workerScript.log(`Invalid argument passed to gang.getMemberInformation(). No gang member could be found with name ${name}`);
                    return {}; // Member could not be found
                } catch(e) {
                    throw makeRuntimeRejectMsg(workerScript, nsGang.unknownGangApiExceptionMessage("getMemberInformation", e));
                }
            },
            canRecruitMember : function() {
                if (workerScript.checkingRam) {
                    return updateStaticRam("canRecruitMember", CONSTANTS.ScriptGangApiBaseRamCost / 4);
                }
                updateDynamicRam("canRecruitMember", CONSTANTS.ScriptGangApiBaseRamCost / 4);
                nsGang.checkGangApiAccess(workerScript, "canRecruitMember");

                try {
                    return Player.gang.canRecruitMember();
                } catch(e) {
                    throw makeRuntimeRejectMsg(workerScript, nsGang.unknownGangApiExceptionMessage("canRecruitMember", e));
                }
            },
            recruitMember : function(name) {
                if (workerScript.checkingRam) {
                    return updateStaticRam("recruitMember", CONSTANTS.ScriptGangApiBaseRamCost / 2);
                }
                updateDynamicRam("recruitMember", CONSTANTS.ScriptGangApiBaseRamCost / 2);
                nsGang.checkGangApiAccess(workerScript, "recruitMember");

                try {
                    return Player.gang.recruitMember(name);
                } catch(e) {
                    throw makeRuntimeRejectMsg(workerScript, nsGang.unknownGangApiExceptionMessage("recruitMember", e));
                }
            },
            getTaskNames : function() {
                if (workerScript.checkingRam) {
                    return updateStaticRam("getTaskNames", CONSTANTS.ScriptGangApiBaseRamCost / 4);
                }
                updateDynamicRam("getTaskNames", CONSTANTS.ScriptGangApiBaseRamCost / 4);
                nsGang.checkGangApiAccess(workerScript, "getTaskNames");

                try {
                    const tasks = Player.gang.getAllTaskNames();
                    tasks.unshift("Unassigned");
                    return tasks;
                } catch(e) {
                    throw makeRuntimeRejectMsg(workerScript, nsGang.unknownGangApiExceptionMessage("getTaskNames", e));
                }
            },
            setMemberTask : function(memberName, taskName) {
                if (workerScript.checkingRam) {
                    return updateStaticRam("setMemberTask", CONSTANTS.ScriptGangApiBaseRamCost / 2);
                }
                updateDynamicRam("setMemberTask", CONSTANTS.ScriptGangApiBaseRamCost / 2);
                nsGang.checkGangApiAccess(workerScript, "setMemberTask");

                try {
                    for (const member of Player.gang.members) {
                        if (member.name === memberName) {
                            return member.assignToTask(taskName);
                        }
                    }

                    workerScript.log(`Invalid argument passed to gang.setMemberTask(). No gang member could be found with name ${memberName}`);
                    return false;
                } catch(e) {
                    throw makeRuntimeRejectMsg(workerScript, nsGang.unknownGangApiExceptionMessage("setMemberTask", e));
                }
            },
            getEquipmentNames : function() {
                if (workerScript.checkingRam) {
                    return updateStaticRam("getEquipmentNames", CONSTANTS.ScriptGangApiBaseRamCost / 4);
                }
                updateDynamicRam("getEquipmentNames", CONSTANTS.ScriptGangApiBaseRamCost / 4);
                nsGang.checkGangApiAccess(workerScript, "getEquipmentNames");

                try {
                    return Player.gang.getAllUpgradeNames();
                } catch(e) {
                    throw makeRuntimeRejectMsg(workerScript, nsGang.unknownGangApiExceptionMessage("getEquipmentNames", e));
                }
            },
            getEquipmentCost : function(equipName) {
                if (workerScript.checkingRam) {
                    return updateStaticRam("getEquipmentCost", CONSTANTS.ScriptGangApiBaseRamCost / 2);
                }
                updateDynamicRam("getEquipmentCost", CONSTANTS.ScriptGangApiBaseRamCost / 2);
                nsGang.checkGangApiAccess(workerScript, "getEquipmentCost");

                try {
                    return Player.gang.getUpgradeCost(equipName);
                } catch(e) {
                    throw makeRuntimeRejectMsg(workerScript, nsGang.unknownGangApiExceptionMessage("getEquipmentCost", e));
                }
            },
            purchaseEquipment : function(memberName, equipName) {
                if (workerScript.checkingRam) {
                    return updateStaticRam("purchaseEquipment", CONSTANTS.ScriptGangApiBaseRamCost);
                }
                updateDynamicRam("purchaseEquipment", CONSTANTS.ScriptGangApiBaseRamCost);
                nsGang.checkGangApiAccess(workerScript, "purchaseEquipment");

                try {
                    for (const member in Player.gang.members) {
                        if (member.name === memberName) {
                            return member.buyUpgrade(equipName, Player, Player.gang);
                        }
                    }

                    workerScript.log(`Invalid argument passed to gang.purchaseEquipment(). No gang member could be found with name ${memberName}`);
                    return false;
                } catch(e) {
                    throw makeRuntimeRejectMsg(workerScript, nsGang.unknownGangApiExceptionMessage("purchaseEquipment", e));
                }
            },
            ascendMember : function(name) {
                if (workerScript.checkingRam) {
                    return updateStaticRam("ascendMember", CONSTANTS.ScriptGangApiBaseRamCost);
                }
                updateDynamicRam("ascendMember", CONSTANTS.ScriptGangApiBaseRamCost);
                nsGang.checkGangApiAccess(workerScript, "ascendMember");

                try {
                    for (const member in Player.gang.members) {
                        if (member.name === name) {
                            return Player.gang.ascendMember(member, workerScript);
                        }
                    }

                    workerScript.log(`Invalid argument passed to gang.ascendMember(). No gang member could be found with name ${memberName}`);
                    return false;
                } catch(e) {
                    throw makeRuntimeRejectMsg(workerScript, nsGang.unknownGangApiExceptionMessage("ascendMember", e));
                }
            },
            setTerritoryWarfare : function(engage) {
                if (workerScript.checkingRam) {
                    return updateStaticRam("setTerritoryWarfare", CONSTANTS.ScriptGangApiBaseRamCost / 2);
                }
                updateDynamicRam("setTerritoryWarfare", CONSTANTS.ScriptGangApiBaseRamCost / 2);
                nsGang.checkGangApiAccess(workerScript, "setTerritoryWarfare");

                try {
                    if (engage) {
                        Player.gang.territoryWarfareEngaged = true;
                    } else {
                        Player.gang.territoryWarfareEngaged = false;
                    }
                } catch(e) {
                    throw makeRuntimeRejectMsg(workerScript, nsGang.unknownGangApiExceptionMessage("setTerritoryWarfare", e));
                }
            },
            getBonusTime : function() {
                if (workerScript.checkingRam) { return 0; }
                nsGang.checkGangApiAccess(workerScript, "getBonusTime");

                try {
                    return Math.round(Player.gang.storedCycles / 5);
                } catch(e) {
                    throw makeRuntimeRejectMsg(workerScript, nsGang.unknownGangApiExceptionMessage("getBonusTime", e));
                }
            },
        }, // end gang namespace

        // Bladeburner API
        bladeburner : {
            getContractNames : function() {
                if (workerScript.checkingRam) {
                    return updateStaticRam("getContractNames", CONSTANTS.ScriptBladeburnerApiBaseRamCost / 10);
                }
                updateDynamicRam("getContractNames", CONSTANTS.ScriptBladeburnerApiBaseRamCost / 10);
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || hasBladeburner2079SF)) {
                    return Player.bladeburner.getContractNamesNetscriptFn();
                }
                throw makeRuntimeRejectMsg(workerScript, "getContractNames() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            getOperationNames : function() {
                if (workerScript.checkingRam) {
                    return updateStaticRam("getOperationNames", CONSTANTS.ScriptBladeburnerApiBaseRamCost / 10);
                }
                updateDynamicRam("getOperationNames", CONSTANTS.ScriptBladeburnerApiBaseRamCost / 10);
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || hasBladeburner2079SF)) {
                    return Player.bladeburner.getOperationNamesNetscriptFn();
                }
                throw makeRuntimeRejectMsg(workerScript, "getOperationNames() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            getBlackOpNames : function() {
                if (workerScript.checkingRam) {
                    return updateStaticRam("getBlackOpNames", CONSTANTS.ScriptBladeburnerApiBaseRamCost / 10);
                }
                updateDynamicRam("getBlackOpNames", CONSTANTS.ScriptBladeburnerApiBaseRamCost / 10);
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || hasBladeburner2079SF)) {
                    return Player.bladeburner.getBlackOpNamesNetscriptFn();
                }
                throw makeRuntimeRejectMsg(workerScript, "getBlackOpNames() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            getGeneralActionNames : function() {
                if (workerScript.checkingRam) {
                    return updateStaticRam("getGeneralActionNames", CONSTANTS.ScriptBladeburnerApiBaseRamCost / 10);
                }
                updateDynamicRam("getGeneralActionNames", CONSTANTS.ScriptBladeburnerApiBaseRamCost / 10);
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || hasBladeburner2079SF)) {
                    return Player.bladeburner.getGeneralActionNamesNetscriptFn();
                }
                throw makeRuntimeRejectMsg(workerScript, "getGeneralActionNames() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            getSkillNames : function() {
                if (workerScript.checkingRam) {
                    return updateStaticRam("getSkillNames", CONSTANTS.ScriptBladeburnerApiBaseRamCost / 10);
                }
                updateDynamicRam("getSkillNames", CONSTANTS.ScriptBladeburnerApiBaseRamCost / 10);
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || hasBladeburner2079SF)) {
                    return Player.bladeburner.getSkillNamesNetscriptFn();
                }
                throw makeRuntimeRejectMsg(workerScript, "getSkillNames() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            startAction : function(type="", name="") {
                if (workerScript.checkingRam) {
                    return updateStaticRam("startAction", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
                }
                updateDynamicRam("startAction", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || hasBladeburner2079SF)) {
                    try {
                        return Player.bladeburner.startActionNetscriptFn(type, name, workerScript);
                    } catch(e) {
                        throw makeRuntimeRejectMsg(workerScript, "Bladeburner.startAction() failed with exception: " + e);
                    }
                }
                throw makeRuntimeRejectMsg(workerScript, "startAction() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            stopBladeburnerAction : function() {
                if (workerScript.checkingRam) {
                    return updateStaticRam("stopBladeburnerAction", CONSTANTS.ScriptBladeburnerApiBaseRamCost / 2);
                }
                updateDynamicRam("stopBladeburnerAction", CONSTANTS.ScriptBladeburnerApiBaseRamCost / 2);
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || hasBladeburner2079SF)) {
                    return Player.bladeburner.resetAction();
                }
                throw makeRuntimeRejectMsg(workerScript, "stopBladeburnerAction() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            getCurrentAction : function() {
                if (workerScript.checkingRam) {
                    return updateStaticRam("getCurrentAction", CONSTANTS.ScriptBladeburnerApiBaseRamCost / 4);
                }
                updateDynamicRam("getCurrentAction", CONSTANTS.ScriptBladeburnerApiBaseRamCost / 4);
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || hasBladeburner2079SF)) {
                    return Player.bladeburner.getTypeAndNameFromActionId(Player.bladeburner.action);
                }
                throw makeRuntimeRejectMsg(workerScript, "getCurrentAction() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            getActionTime : function(type="", name="") {
                if (workerScript.checkingRam) {
                    return updateStaticRam("getActionTime", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
                }
                updateDynamicRam("getActionTime", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || hasBladeburner2079SF)) {
                    try {
                        return Player.bladeburner.getActionTimeNetscriptFn(type, name, workerScript);
                    } catch(e) {
                        throw makeRuntimeRejectMsg(workerScript, "Bladeburner.getActionTime() failed with exception: " + e);
                    }
                }
                throw makeRuntimeRejectMsg(workerScript, "getActionTime() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            getActionEstimatedSuccessChance : function(type="", name="") {
                if (workerScript.checkingRam) {
                    return updateStaticRam("getActionEstimatedSuccessChance", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
                }
                updateDynamicRam("getActionEstimatedSuccessChance", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || hasBladeburner2079SF)) {
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
                if (workerScript.checkingRam) {
                    return updateStaticRam("getActionRepGain", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
                }
                updateDynamicRam("getActionRepGain", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
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
            getActionCountRemaining : function(type="", name="") {
                if (workerScript.checkingRam) {
                    return updateStaticRam("getActionCountRemaining", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
                }
                updateDynamicRam("getActionCountRemaining", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || hasBladeburner2079SF)) {
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
                if (workerScript.checkingRam) {
                    return updateStaticRam("getActionMaxLevel", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
                }
                updateDynamicRam("getActionMaxLevel", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
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
                if (workerScript.checkingRam) {
                    return updateStaticRam("getActionCurrentLevel", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
                }
                updateDynamicRam("getActionCurrentLevel", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
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
                if (workerScript.checkingRam) {
                    return updateStaticRam("getActionAutolevel", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
                }
                updateDynamicRam("getActionAutolevel", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
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
                if (workerScript.checkingRam) {
                    return updateStaticRam("setActionAutolevel", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
                }
                updateDynamicRam("setActionAutolevel", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
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
                if (workerScript.checkingRam) {
                    return updateStaticRam("setActionLevel", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
                }
                updateDynamicRam("setActionLevel", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
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
            getRank : function() {
                if (workerScript.checkingRam) {
                    return updateStaticRam("getRank", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
                }
                updateDynamicRam("getRank", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || hasBladeburner2079SF)) {
                    return Player.bladeburner.rank;
                }
                throw makeRuntimeRejectMsg(workerScript, "getRank() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            getSkillPoints : function() {
                if (workerScript.checkingRam) {
                    return updateStaticRam("getSkillPoints", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
                }
                updateDynamicRam("getSkillPoints", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || hasBladeburner2079SF)) {
                    return Player.bladeburner.skillPoints;
                }
                throw makeRuntimeRejectMsg(workerScript, "getSkillPoints() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            getSkillLevel : function(skillName="") {
                if (workerScript.checkingRam) {
                    return updateStaticRam("getSkillLevel", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
                }
                updateDynamicRam("getSkillLevel", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || hasBladeburner2079SF)) {
                    try {
                        return Player.bladeburner.getSkillLevelNetscriptFn(skillName, workerScript);
                    } catch(e) {
                        throw makeRuntimeRejectMsg(workerScript, "Bladeburner.getSkillLevel() failed with exception: " + e);
                    }
                }
                throw makeRuntimeRejectMsg(workerScript, "getSkillLevel() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            getSkillUpgradeCost : function(skillName="") {
                if (workerScript.checkingRam) {
                    return updateStaticRam("getSkillUpgradeCost", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
                }
                updateDynamicRam("getSkillUpgradeCost", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || hasBladeburner2079SF)) {
                    try {
                        return Player.bladeburner.getSkillUpgradeCostNetscriptFn(skillName, workerScript);
                    } catch(e) {
                        throw makeRuntimeRejectMsg(workerScript, "Bladeburner.getSkillUpgradeCost() failed with exception: " + e);
                    }
                }
                throw makeRuntimeRejectMsg(workerScript, "getSkillUpgradeCost() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            upgradeSkill : function(skillName) {
                if (workerScript.checkingRam) {
                    return updateStaticRam("upgradeSkill", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
                }
                updateDynamicRam("upgradeSkill", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || hasBladeburner2079SF)) {
                    try {
                        return Player.bladeburner.upgradeSkillNetscriptFn(skillName, workerScript);
                    } catch(e) {
                        throw makeRuntimeRejectMsg(workerScript, "Bladeburner.upgradeSkill() failed with exception: " + e);
                    }
                }
                throw makeRuntimeRejectMsg(workerScript, "upgradeSkill() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            getTeamSize : function(type="", name="") {
                if (workerScript.checkingRam) {
                    return updateStaticRam("getTeamSize", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
                }
                updateDynamicRam("getTeamSize", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || hasBladeburner2079SF)) {
                    try {
                        return Player.bladeburner.getTeamSizeNetscriptFn(type, name, workerScript);
                    } catch(e) {
                        throw makeRuntimeRejectMsg(workerScript, "Bladeburner.getTeamSize() failed with exception: " + e);
                    }
                }
                throw makeRuntimeRejectMsg(workerScript, "getTeamSize() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            setTeamSize : function(type="", name="", size) {
                if (workerScript.checkingRam) {
                    return updateStaticRam("setTeamSize", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
                }
                updateDynamicRam("setTeamSize", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || hasBladeburner2079SF)) {
                    try {
                        return Player.bladeburner.setTeamSizeNetscriptFn(type, name, size, workerScript);
                    } catch(e) {
                        throw makeRuntimeRejectMsg(workerScript, "Bladeburner.setTeamSize() failed with exception: " + e);
                    }
                }
                throw makeRuntimeRejectMsg(workerScript, "setTeamSize() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            getCityEstimatedPopulation : function(cityName) {
                if (workerScript.checkingRam) {
                    return updateStaticRam("getCityEstimatedPopulation", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
                }
                updateDynamicRam("getCityEstimatedPopulation", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || hasBladeburner2079SF)) {
                    try {
                        return Player.bladeburner.getCityEstimatedPopulationNetscriptFn(cityName, workerScript);
                    } catch(e) {
                        throw makeRuntimeRejectMsg(workerScript, "Bladeburner.getCityEstimatedPopulation() failed with exception: " + e);
                    }
                }
                throw makeRuntimeRejectMsg(workerScript, "getCityEstimatedPopulation() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            getCityEstimatedCommunities : function(cityName) {
                if (workerScript.checkingRam) {
                    return updateStaticRam("getCityEstimatedCommunities", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
                }
                updateDynamicRam("getCityEstimatedCommunities", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || hasBladeburner2079SF)) {
                    try {
                        return Player.bladeburner.getCityEstimatedCommunitiesNetscriptFn(cityName, workerScript);
                    } catch(e) {
                        throw makeRuntimeRejectMsg(workerScript, "Bladeburner.getCityEstimatedCommunities() failed with exception: " + e);
                    }
                }
                throw makeRuntimeRejectMsg(workerScript, "getCityEstimatedCommunities() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            getCityChaos : function(cityName) {
                if (workerScript.checkingRam) {
                    return updateStaticRam("getCityChaos", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
                }
                updateDynamicRam("getCityChaos", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || hasBladeburner2079SF)) {
                    try {
                        return Player.bladeburner.getCityChaosNetscriptFn(cityName, workerScript);
                    } catch(e) {
                        throw makeRuntimeRejectMsg(workerScript, "Bladeburner.getCityChaos() failed with exception: " + e);
                    }
                }
                throw makeRuntimeRejectMsg(workerScript, "getCityChaos() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            getCity : function() {
                if (workerScript.checkingRam) {
                    return updateStaticRam("getCity", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
                }
                updateDynamicRam("getCity", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || hasBladeburner2079SF)) {
                    try {
                        return Player.bladeburner.city;
                    } catch(e) {
                        throw makeRuntimeRejectMsg(workerScript, "Bladeburner.getCity() failed with exception: " + e);
                    }
                }
                throw makeRuntimeRejectMsg(workerScript, "getCity() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            switchCity : function(cityName) {
                if (workerScript.checkingRam) {
                    return updateStaticRam("switchCity", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
                }
                updateDynamicRam("switchCity", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || hasBladeburner2079SF)) {
                    try {
                        return Player.bladeburner.switchCityNetscriptFn(cityName, workerScript);
                    } catch(e) {
                        throw makeRuntimeRejectMsg(workerScript, "Bladeburner.switchCity() failed with exception: " + e);
                    }
                }
                throw makeRuntimeRejectMsg(workerScript, "switchCity() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            getStamina : function() {
                if (workerScript.checkingRam) {
                    return updateStaticRam("getStamina", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
                }
                updateDynamicRam("getStamina", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || hasBladeburner2079SF)) {
                    return [Player.bladeburner.stamina, Player.bladeburner.maxStamina];
                }
                throw makeRuntimeRejectMsg(workerScript, "getStamina() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            joinBladeburnerFaction : function() {
                if (workerScript.checkingRam) {
                    return updateStaticRam("joinBladeburnerFaction", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
                }
                updateDynamicRam("joinBladeburnerFaction", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
                if (Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || hasBladeburner2079SF)) {
                    return Player.bladeburner.joinBladeburnerFactionNetscriptFn(workerScript);
                }
                throw makeRuntimeRejectMsg(workerScript, "joinBladeburnerFaction() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            joinBladeburnerDivision : function() {
                if (workerScript.checkingRam) {
                    return updateStaticRam("joinBladeburnerDivision", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
                }
                updateDynamicRam("joinBladeburnerDivision", CONSTANTS.ScriptBladeburnerApiBaseRamCost);
                if ((Player.bitNodeN === 7 || hasBladeburner2079SF)) {
                    if (Player.bladeburner instanceof Bladeburner) {
                        return true; //Already member
                    } else if (Player.strength >= 100 && Player.defense >= 100 &&
                               Player.dexterity >= 100 && Player.agility >= 100) {
                        Player.bladeburner = new Bladeburner({new:true});
                        workerScript.log("You have been accepted into the Bladeburner division");
                        return true;
                    } else {
                        workerScript.log("You do not meet the requirements for joining the Bladeburner division");
                        return false;
                    }
                }
                throw makeRuntimeRejectMsg(workerScript, "joinBladeburnerDivision() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            },
            getBonusTime : function() {
                if (workerScript.checkingRam) {return 0;}
                if ((Player.bitNodeN === 7 || hasBladeburner2079SF)) {
                    return Math.round(Player.bladeburner.storedCycles / 5);
                }
                throw makeRuntimeRejectMsg(workerScript, "getBonusTime() failed because you do not currently have access to the Bladeburner API. This is either because you are not currently employed " +
                                                         "at the Bladeburner division or because you do not have Source-File 7");
            }
        }, // End Bladeburner
        codingcontract : {
            attempt : function(answer, fn, ip=workerScript.serverIp) {
                if (workerScript.checkingRam) {
                    return updateStaticRam("attempt", CONSTANTS.ScriptCodingContractBaseRamCost);
                }
                updateDynamicRam("attempt", CONSTANTS.ScriptCodingContractBaseRamCost);
                const contract = getCodingContract(fn, ip);
                if (contract == null) {
                    workerScript.log(`ERROR: codingcontract.getData() failed because it could find the specified contract ${fn} on server ${ip}`);
                    return false;
                }
                answer = String(answer);
                const serv = safeGetServer(ip, "codingcontract.attempt()");
                if (contract.isSolution(answer)) {
                    const reward = Player.gainCodingContractReward(contract.reward, contract.getDifficulty());
                    workerScript.log(`Successfully completed Coding Contract ${fn}. Reward: ${reward}`);
                    serv.removeContract(fn);
                    return true;
                } else {
                    ++contract.tries;
                    if (contract.tries >= contract.getMaxNumTries()) {
                        workerScript.log(`Coding Contract ${fn} failed. Contract is now self-destructing`);
                        serv.removeContract(fn);
                    } else {
                        workerScript.log(`Coding Contract ${fn} failed. ${contract.getMaxNumTries() - contract.tries} attempts remaining`);
                    }
                    return false;
                }
            },
            getContractType : function(fn, ip=workerScript.serverIp) {
                if (workerScript.checkingRam) {
                    return updateStaticRam("getContractType", CONSTANTS.ScriptCodingContractBaseRamCost / 2);
                }
                updateDynamicRam("getContractType", CONSTANTS.ScriptCodingContractBaseRamCost / 2);
                let contract = getCodingContract(fn, ip);
                if (contract == null) {
                    workerScript.log(`ERROR: codingcontract.getData() failed because it could find the specified contract ${fn} on server ${ip}`);
                    return null;
                }
                return contract.getType();
            },
            getData : function(fn, ip=workerScript.serverIp) {
                if (workerScript.checkingRam) {
                    return updateStaticRam("getData", CONSTANTS.ScriptCodingContractBaseRamCost / 2);
                }
                updateDynamicRam("getData", CONSTANTS.ScriptCodingContractBaseRamCost / 2);
                let contract = getCodingContract(fn, ip);
                if (contract == null) {
                    workerScript.log(`ERROR: codingcontract.getData() failed because it could find the specified contract ${fn} on server ${ip}`);
                    return null;
                }
                let data = contract.getData();
                if (data.constructor === Array) {
                    // Pass a copy
                    return data.slice();
                } else {
                    return data;
                }
            },
            getDescription : function(fn, ip=workerScript.serverIp) {
                if (workerScript.checkingRam) {
                    return updateStaticRam("getDescription", CONSTANTS.ScriptCodingContractBaseRamCost / 2);
                }
                updateDynamicRam("getDescription", CONSTANTS.ScriptCodingContractBaseRamCost / 2);
                var contract = getCodingContract(fn, ip);
                if (contract == null) {
                    workerScript.log(`ERROR: codingcontract.getDescription() failed because it could find the specified contract ${fn} on server ${ip}`);
                    return "";
                }
                return contract.getDescription();
            },
            getNumTriesRemaining : function(fn, ip=workerScript.serverIp) {
                if (workerScript.checkingRam) {
                    return updateStaticRam("getNumTriesRemaining", CONSTANTS.ScriptCodingContractBaseRamCost / 2);
                }
                updateDynamicRam("getNumTriesRemaining", CONSTANTS.ScriptCodingContractBaseRamCost / 2);
                var contract = getCodingContract(fn, ip);
                if (contract == null) {
                    workerScript.log(`ERROR: codingcontract.getNumTriesRemaining() failed because it could find the specified contract ${fn} on server ${ip}`);
                    return -1;
                }
                return contract.getMaxNumTries() - contract.tries;
            },
        }
    } //End return
} //End NetscriptFunction()

export {NetscriptFunctions, initSingularitySFFlags, hasSingularitySF, hasBn11SF,
        hasWallStreetSF, wallStreetSFLvl, hasCorporationSF, hasAISF, hasBladeburnerSF};
