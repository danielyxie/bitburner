var sprintf = require('sprintf-js').sprintf,
    vsprintf = require('sprintf-js').vsprintf

import {updateActiveScriptsItems}                   from "./ActiveScriptsUI.js";
import {Augmentations, Augmentation,
        augmentationExists, installAugmentations,
        AugmentationNames}                          from "./Augmentations.js";
import {BitNodeMultipliers}                         from "./BitNode.js";
import {commitShopliftCrime, commitRobStoreCrime, commitMugCrime,
        commitLarcenyCrime, commitDealDrugsCrime, commitBondForgeryCrime,
        commitTraffickArmsCrime,
        commitHomicideCrime, commitGrandTheftAutoCrime, commitKidnapCrime,
        commitAssassinationCrime, commitHeistCrime, determineCrimeSuccess,
        determineCrimeChanceShoplift, determineCrimeChanceRobStore,
        determineCrimeChanceMug, determineCrimeChanceLarceny,
        determineCrimeChanceDealDrugs, determineCrimeChanceBondForgery,
        determineCrimeChanceTraffickArms,
        determineCrimeChanceHomicide, determineCrimeChanceGrandTheftAuto,
        determineCrimeChanceKidnap, determineCrimeChanceAssassination,
        determineCrimeChanceHeist}                  from "./Crimes.js";
import {Companies, Company, CompanyPosition,
        CompanyPositions, companyExists}            from "./Company.js";
import {CONSTANTS}                                  from "./Constants.js";
import {Programs}                                   from "./CreateProgram.js";
import {parseDarkwebItemPrice, DarkWebItems}        from "./DarkWeb.js";
import {Engine}                                     from "./engine.js";
import {Factions, Faction, joinFaction,
        factionExists, purchaseAugmentation}        from "./Faction.js";
import {getCostOfNextHacknetNode,
        purchaseHacknet}                            from "./HacknetNode.js";
import {Locations}                                  from "./Location.js";
import {Message, Messages}                          from "./Message.js";
import {inMission}                                  from "./Missions.js";
import {Player}                                     from "./Player.js";
import {Script, findRunningScript, RunningScript,
        isScriptFilename}                           from "./Script.js";
import {Server, getServer, AddToAllServers,
        AllServers, processSingleServerGrowth,
        GetServerByHostname}                        from "./Server.js";
import {Settings}                                   from "./Settings.js";
import {SpecialServerIps}                           from "./SpecialServerIps.js";
import {StockMarket, StockSymbols, SymbolToStockMap, initStockSymbols,
        initStockMarket, initSymbolToStockMap, stockMarketCycle, buyStock,
        sellStock, updateStockPrices, displayStockMarketContent,
        updateStockTicker, updateStockPlayerPosition,
        Stock, shortStock, sellShort, OrderTypes,
        PositionTypes, placeOrder, cancelOrder}     from "./StockMarket.js";
import {post}                                       from "./Terminal.js";
import {TextFile, getTextFile, createTextFile}      from "./TextFile.js";

import {WorkerScript, workerScripts,
        killWorkerScript, NetscriptPorts}           from "./NetscriptWorker.js";
import {makeRuntimeRejectMsg, netscriptDelay, runScriptFromScript,
        scriptCalculateHackingChance, scriptCalculateHackingTime,
        scriptCalculateExpGain, scriptCalculatePercentMoneyHacked,
        scriptCalculateGrowTime, scriptCalculateWeakenTime} from "./NetscriptEvaluator.js";
import {Environment}                                from "./NetscriptEnvironment.js";
import {NetscriptPort}                              from "./NetscriptPort.js";

import Decimal                                      from '../utils/decimal.js';
import {dialogBoxCreate}                            from "../utils/DialogBox.js";
import {printArray, powerOfTwo}                     from "../utils/HelperFunctions.js";
import {createRandomIp}                             from "../utils/IPAddress.js";
import {formatNumber, isString, isHTML}             from "../utils/StringHelperFunctions.js";
import {yesNoBoxClose, yesNoBoxGetYesButton,
        yesNoBoxGetNoButton, yesNoBoxCreate,
        yesNoBoxOpen}                               from "../utils/YesNoBox.js";

var hasCorporationSF=false,     //Source-File 3
    hasSingularitySF=false,     //Source-File 4
    hasAISF=false,              //Source-File 5
    hasBladeburnerSF=false,     //Source-File 6
    hasWallStreetSF=false,      //Source-File 8
    hasBn11SF=false;            //Source-File 11



var singularitySFLvl=1, wallStreetSFLvl=1;

//Used to check and set flags for every Source File, despite the name of the function
function initSingularitySFFlags() {
    for (var i = 0; i < Player.sourceFiles.length; ++i) {
        if (Player.sourceFiles[i].n === 3) {
            hasCorporationSF = true;
        }
        if (Player.sourceFiles[i].n === 4) {
            hasSingularitySF = true;
            singularitySFLvl = Player.sourceFiles[i].lvl;
        }
        if (Player.sourceFiles[i].n === 5) {
            hasAISF = true;
        }
        if (Player.sourceFiles[i].n === 6) {
            hasBladeburnerSF = true;
        }
        if (Player.sourceFiles[i].n === 8) {
            hasWallStreetSF = true;
            wallStreetSFLvl = Player.sourceFiles[i].lvl;
        }
        if (Player.sourceFiles[i].n === 11) {
            hasBn11SF = true;
        }
    }
}

function NetscriptFunctions(workerScript) {
    return {
        Math : Math,
        Date : Date,
        Number : Number,
        hacknetnodes : Player.hacknetNodes,
        sprintf : sprintf,
        vsprintf: vsprintf,
        scan : function(ip=workerScript.serverIp, hostnames=true){
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.scan) {
                    return 0;
                } else {
                    workerScript.loadedFns.scan = true;
                    return CONSTANTS.ScriptScanRamCost;
                }
            }
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
                if (workerScript.loadedFns.hack) {
                    return 0;
                } else {
                    workerScript.loadedFns.hack = true;
                    return CONSTANTS.ScriptHackRamCost;
                }
            }
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
            var hackingTime = scriptCalculateHackingTime(server); //This is in seconds

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
            return netscriptDelay(hackingTime* 1000, workerScript).then(function() {
                if (workerScript.env.stopFlag) {return Promise.reject(workerScript);}
                var hackChance = scriptCalculateHackingChance(server);
                var rand = Math.random();
                var expGainedOnSuccess = scriptCalculateExpGain(server) * threads;
                var expGainedOnFailure = (expGainedOnSuccess / 4);
                if (rand < hackChance) {	//Success!
                    var moneyGained = scriptCalculatePercentMoneyHacked(server);
                    moneyGained = Math.floor(server.moneyAvailable * moneyGained) * threads;

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
                    server.fortify(CONSTANTS.ServerFortifyAmount * threads);
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
                if (workerScript.loadedFns.grow) {
                    return 0;
                } else {
                    workerScript.loadedFns.grow = true;
                    return CONSTANTS.ScriptGrowRamCost;
                }
            }
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

            var growTime = scriptCalculateGrowTime(server);
            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.grow == null) {
                workerScript.scriptRef.log("Executing grow() on server " + server.hostname + " in " + formatNumber(growTime/1000, 3) + " seconds (t=" + threads + ")");
            }
            return netscriptDelay(growTime, workerScript).then(function() {
                if (workerScript.env.stopFlag) {return Promise.reject(workerScript);}
                server.moneyAvailable += (1 * threads); //It can be grown even if it has no money
                var growthPercentage = processSingleServerGrowth(server, 450 * threads);
                workerScript.scriptRef.recordGrow(server.ip, threads);
                var expGain = scriptCalculateExpGain(server) * threads;
                if (growthPercentage == 1) {
                    expGain = 0;
                }
                if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.grow == null) {
                    workerScript.scriptRef.log("Available money on " + server.hostname + " grown by " +
                                                formatNumber(growthPercentage*100 - 100, 6) + "%. Gained " +
                                                formatNumber(expGain, 4) + " hacking exp (t=" + threads +")");
                }
                workerScript.scriptRef.onlineExpGained += expGain;
                Player.gainHackingExp(expGain);
                return Promise.resolve(growthPercentage);
            });
        },
        weaken : function(ip){
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.weaken) {
                    return 0;
                } else {
                    workerScript.loadedFns.weaken = true;
                    return CONSTANTS.ScriptWeakenRamCost;
                }
            }
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

            var weakenTime = scriptCalculateWeakenTime(server);
            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.weaken == null) {
                workerScript.scriptRef.log("Executing weaken() on server " + server.hostname + " in " +
                                           formatNumber(weakenTime/1000, 3) + " seconds (t=" + threads + ")");
            }
            return netscriptDelay(weakenTime, workerScript).then(function() {
                if (workerScript.env.stopFlag) {return Promise.reject(workerScript);}
                server.weaken(CONSTANTS.ServerWeakenAmount * threads);
                workerScript.scriptRef.recordWeaken(server.ip, threads);
                var expGain = scriptCalculateExpGain(server) * threads;
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
            if (isHTML(x)) {
                Player.takeDamage(1);
                dialogBoxCreate("You suddenly feel a sharp shooting pain through your body as an angry voice in your head exclaims: <br><br>" +
                                "DON'T USE TPRINT() TO OUTPUT HTML ELEMENTS TO YOUR TERMINAL!!!!<br><br>" +
                                "(You lost 1 HP)");
                return;
            }
            post(workerScript.scriptRef.filename + ": " + args.toString());
        },
        clearLog : function() {
            if (workerScript.checkingRam) {return 0;}
            workerScript.scriptRef.clearLog();
        },
        disableLog : function(fn) {
            if (workerScript.checkingRam) {return 0;}
            workerScript.disableLogs[fn] = true;
            workerScript.scriptRef.log("Disabled logging for " + fn);
        },
        enableLog : function(fn) {
            if (workerScript.checkingRam) {return 0;}
            delete workerScript.disableLogs[fn];
            workerScript.scriptRef.log("Enabled logging for " + fn);
        },
        nuke : function(ip){
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.nuke) {
                    return 0;
                } else {
                    workerScript.loadedFns.nuke = true;
                    return CONSTANTS.ScriptPortProgramRamCost;
                }
            }
            if (ip === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "Program call has incorrect number of arguments. Takes 1 argument");
            }
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("Cannot call nuke(). Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "Cannot call nuke(). Invalid IP or hostname passed in: " + ip);
            }
            if (!Player.hasProgram(Programs.NukeProgram)) {
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
                if (workerScript.loadedFns.brutessh) {
                    return 0;
                } else {
                    workerScript.loadedFns.brutessh = true;
                    return CONSTANTS.ScriptPortProgramRamCost;
                }
            }
            if (ip === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "Program call has incorrect number of arguments. Takes 1 argument");
            }
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("Cannot call brutessh(). Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "Cannot call brutessh(). Invalid IP or hostname passed in: " + ip);
            }
            if (!Player.hasProgram(Programs.BruteSSHProgram)) {
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
                if (workerScript.loadedFns.ftpcrack) {
                    return 0;
                } else {
                    workerScript.loadedFns.ftpcrack = true;
                    return CONSTANTS.ScriptPortProgramRamCost;
                }
            }
            if (ip === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "Program call has incorrect number of arguments. Takes 1 argument");
            }
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("Cannot call ftpcrack(). Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "Cannot call ftpcrack(). Invalid IP or hostname passed in: " + ip);
            }
            if (!Player.hasProgram(Programs.FTPCrackProgram)) {
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
                if (workerScript.loadedFns.relaysmtp) {
                    return 0;
                } else {
                    workerScript.loadedFns.relaysmtp = true;
                    return CONSTANTS.ScriptPortProgramRamCost;
                }
            }
            if (ip === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "Program call has incorrect number of arguments. Takes 1 argument");
            }
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("Cannot call relaysmtp(). Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "Cannot call relaysmtp(). Invalid IP or hostname passed in: " + ip);
            }
            if (!Player.hasProgram(Programs.RelaySMTPProgram)) {
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
                if (workerScript.loadedFns.httpworm) {
                    return 0;
                } else {
                    workerScript.loadedFns.httpworm = true;
                    return CONSTANTS.ScriptPortProgramRamCost;
                }
            }
            if (ip === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "Program call has incorrect number of arguments. Takes 1 argument");
            }
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("Cannot call httpworm(). Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "Cannot call httpworm(). Invalid IP or hostname passed in: " + ip);
            }
            if (!Player.hasProgram(Programs.HTTPWormProgram)) {
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
                if (workerScript.loadedFns.sqlinject) {
                    return 0;
                } else {
                    workerScript.loadedFns.sqlinject = true;
                    return CONSTANTS.ScriptPortProgramRamCost;
                }
            }
            if (ip === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "Program call has incorrect number of arguments. Takes 1 argument");
            }
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("Cannot call sqlinject(). Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "Cannot call sqlinject(). Invalid IP or hostname passed in: " + ip);
            }
            if (!Player.hasProgram(Programs.SQLInjectProgram)) {
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
                if (workerScript.loadedFns.run) {
                    return 0;
                } else {
                    workerScript.loadedFns.run = true;
                    return CONSTANTS.ScriptRunRamCost;
                }
            }
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
                if (workerScript.loadedFns.exec) {
                    return 0;
                } else {
                    workerScript.loadedFns.exec = true;
                    return CONSTANTS.ScriptExecRamCost;
                }
            }
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
                if (workerScript.loadedFns.spawn) {
                    return 0;
                } else {
                    workerScript.loadedFns.spawn = true;
                    return CONSTANTS.ScriptSpawnRamCost;
                }
            }
            if (scriptname == null || threads == null) {
                throw makeRuntimeRejectMsg(workerScript, "Invalid scriptname or numThreads argument passed to spawn()");
            }
            setTimeout(()=>{
                NetscriptFunctions(workerScript).run.apply(this, arguments);
            }, 20000);
            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.spawn == null) {
                workerScript.scriptRef.log("spawn() will execute " + scriptname + " in 20 seconds");
            }
            NetscriptFunctions(workerScript).exit();
        },
        kill : function(filename,ip) {
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.kill) {
                    return 0;
                } else {
                    workerScript.loadedFns.kill = true;
                    return CONSTANTS.ScriptKillRamCost;
                }
            }

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
                workerScript.scriptRef.log("kill() failed. No such script "+ filename + " on " + server.hostname + " with args: " + printArray(argsForKillTarget));
                return false;
            }
            var res = killWorkerScript(runningScriptObj, server.ip);
            if (res) {
                if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.kill == null) {
                    workerScript.scriptRef.log("Killing " + filename + " on " + server.hostname + " with args: " + printArray(argsForKillTarget) +  ". May take up to a few minutes for the scripts to die...");
                }
                return true;
            } else {
                if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.kill == null) {
                    workerScript.scriptRef.log("kill() failed. No such script "+ filename + " on " + server.hostname + " with args: " + printArray(argsForKillTarget));
                }
                return false;
            }
        },
        killall : function(ip=workerScript.serverIp){
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.killall) {
                    return 0;
                } else {
                    workerScript.loadedFns.killall = true;
                    return CONSTANTS.ScriptKillRamCost;
                }
            }

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
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.exit) {
                    return 0;
                } else {
                    workerScript.loadedFns.exit = true;
                    return CONSTANTS.ScriptKillRamCost;
                }
            }
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
                if (workerScript.loadedFns.scp) {
                    return 0;
                } else {
                    workerScript.loadedFns.scp = true;
                    return CONSTANTS.ScriptScpRamCost;
                }
            }
            if (arguments.length !== 2 && arguments.length !== 3) {
                throw makeRuntimeRejectMsg(workerScript, "Error: scp() call has incorrect number of arguments. Takes 2 or 3 arguments");
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
                throw makeRuntimeRejectMsg(workerScript, "Error: scp() does not work with this file type. It only works for .script, .lit, and .txt files");
            }

            var destServer, currServ;

            if (arguments.length === 3) {   //scriptname, source, destination
                if (scriptname === undefined || ip1 === undefined || ip2 === undefined) {
                    throw makeRuntimeRejectMsg(workerScript, "Error: scp() call has incorrect number of arguments. Takes 2 or 3 arguments");
                }
                destServer = getServer(ip2);
                if (destServer == null) {
                    throw makeRuntimeRejectMsg(workerScript, "Error: Invalid hostname/ip passed into scp() command: " + ip);
                }

                currServ = getServer(ip1);
                if (currServ == null) {
                    throw makeRuntimeRejectMsg(workerScript, "Could not find server ip for this script. This is a bug please contact game developer");
                }
            } else if (arguments.length === 2) {    //scriptname, destination
                if (scriptname === undefined || ip1 === undefined) {
                    throw makeRuntimeRejectMsg(workerScript, "Error: scp() call has incorrect number of arguments. Takes 2 or 3 arguments");
                }
                destServer = getServer(ip1);
                if (destServer == null) {
                    throw makeRuntimeRejectMsg(workerScript, "Error: Invalid hostname/ip passed into scp() command: " + ip);
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
                if (workerScript.loadedFns.ls) {
                    return 0;
                } else {
                    workerScript.loadedFns.ls = true;
                    return CONSTANTS.ScriptScanRamCost;
                }
            }
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

            //Sort the files alphabetically then print each
            allFiles.sort();
            return allFiles;
        },
        hasRootAccess : function(ip) {
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.hasRootAccess) {
                    return 0;
                } else {
                    workerScript.loadedFns.hasRootAccess = true;
                    return CONSTANTS.ScriptHasRootAccessRamCost;
                }
            }
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
                if (workerScript.loadedFns.getIp) {
                    return 0;
                } else {
                    workerScript.loadedFns.getIp = true;
                    return CONSTANTS.ScriptGetHostnameRamCost;
                }
            }
            var scriptServer = getServer(workerScript.serverIp);
            if (scriptServer == null) {
                throw makeRuntimeRejectMsg(workerScript, "Could not find server. This is a bug in the game. Report to game dev");
            }
            return scriptServer.ip;
        },
        getHostname : function(){
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.getHostname) {
                    return 0;
                } else {
                    workerScript.loadedFns.getHostname = true;
                    return CONSTANTS.ScriptGetHostnameRamCost;
                }
            }
            var scriptServer = getServer(workerScript.serverIp);
            if (scriptServer == null) {
                throw makeRuntimeRejectMsg(workerScript, "Could not find server. This is a bug in the game. Report to game dev");
            }
            return scriptServer.hostname;
        },
        getHackingLevel : function(){
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.getHackingLevel) {
                    return 0;
                } else {
                    workerScript.loadedFns.getHackingLevel = true;
                    return CONSTANTS.ScriptGetHackingLevelRamCost;
                }
            }
            Player.updateSkillLevels();
            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.getHackingLevel == null) {
                workerScript.scriptRef.log("getHackingLevel() returned " + Player.hacking_skill);
            }
            return Player.hacking_skill;
        },
        getHackingMultipliers : function() {
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.getHackingMultipliers) {
                    return 0;
                } else {
                    workerScript.loadedFns.getHackingMultipliers = true;
                    return CONSTANTS.ScriptGetMultipliersRamCost;
                }
            }
            return {
                chance: Player.hacking_chance_mult,
                speed: Player.hacking_speed_mult,
                money: Player.hacking_money_mult,
                growth: Player.hacking_grow_mult,
            };
        },
        getBitNodeMultipliers: function() {
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.getBitNodeMultipliers) {
                    return 0;
                } else {
                    workerScript.loadedFns.getBitNodeMultipliers = true;
                    return CONSTANTS.ScriptGetMultipliersRamCost;
                }
            }
            if (!hasAISF) {
                throw makeRuntimeRejectMsg(workerScript, "Cannot run getBitNodeMultipliers(). It requires Source-File 5 to run.");
            }
            return BitNodeMultipliers;
        },
        getServerMoneyAvailable : function(ip){
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.getServerMoneyAvailable) {
                    return 0;
                } else {
                    workerScript.loadedFns.getServerMoneyAvailable = true;
                    return CONSTANTS.ScriptGetServerRamCost;
                }
            }
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
                if (workerScript.loadedFns.getServerSecurityLevel) {
                    return 0;
                } else {
                    workerScript.loadedFns.getServerSecurityLevel = true;
                    return CONSTANTS.ScriptGetServerRamCost;
                }
            }
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
                if (workerScript.loadedFns.getServerBaseSecurityLevel) {
                    return 0;
                } else {
                    workerScript.loadedFns.getServerBaseSecurityLevel = true;
                    return CONSTANTS.ScriptGetServerRamCost;
                }
            }
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
                if (workerScript.loadedFns.getServerMinSecurityLevel) {
                    return 0;
                } else {
                    workerScript.loadedFns.getServerMinSecurityLevel = true;
                    return CONSTANTS.ScriptGetServerRamCost;
                }
            }
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
                if (workerScript.loadedFns.getServerRequiredHackingLevel) {
                    return 0;
                } else {
                    workerScript.loadedFns.getServerRequiredHackingLevel = true;
                    return CONSTANTS.ScriptGetServerRamCost;
                }
            }
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
                if (workerScript.loadedFns.getServerMaxMoney) {
                    return 0;
                } else {
                    workerScript.loadedFns.getServerMaxMoney = true;
                    return CONSTANTS.ScriptGetServerRamCost;
                }
            }
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
                if (workerScript.loadedFns.getServerGrowth) {
                    return 0;
                } else {
                    workerScript.loadedFns.getServerGrowth = true;
                    return CONSTANTS.ScriptGetServerRamCost;
                }
            }
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
                if (workerScript.loadedFns.getServerNumPortsRequired) {
                    return 0;
                } else {
                    workerScript.loadedFns.getServerNumPortsRequired = true;
                    return CONSTANTS.ScriptGetServerRamCost;
                }
            }
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
                if (workerScript.loadedFns.getServerRam) {
                    return 0;
                } else {
                    workerScript.loadedFns.getServerRam = true;
                    return CONSTANTS.ScriptGetServerRamCost;
                }
            }
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
                if (workerScript.loadedFns.serverExists) {
                    return 0;
                } else {
                    workerScript.loadedFns.serverExists = true;
                    return CONSTANTS.ScriptGetServerRamCost;
                }
            }
            return (getServer(ip) !== null);
        },
        fileExists : function(filename,ip=workerScript.serverIp) {
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.fileExists) {
                    return 0;
                } else {
                    workerScript.loadedFns.fileExists = true;
                    return CONSTANTS.ScriptFileExistsRamCost;
                }
            }
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
                if (workerScript.loadedFns.isRunning) {
                    return 0;
                } else {
                    workerScript.loadedFns.isRunning = true;
                    return CONSTANTS.ScriptIsRunningRamCost;
                }
            }
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
        getNextHacknetNodeCost : function() {
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.getNextHacknetNodeCost) {
                    return 0;
                } else {
                    workerScript.loadedFns.getNextHacknetNodeCost = true;
                    return CONSTANTS.ScriptPurchaseHacknetRamCost;
                }
            }
            return getCostOfNextHacknetNode();
        },

        purchaseHacknetNode : function() {
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.purchaseHacknetNode) {
                    return 0;
                } else {
                    workerScript.loadedFns.purchaseHacknetNode = true;
                    return CONSTANTS.ScriptPurchaseHacknetRamCost;
                }
            }
            return purchaseHacknet();
        },
        getStockPrice : function(symbol) {
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.getStockPrice) {
                    return 0;
                } else {
                    workerScript.loadedFns.getStockPrice = true;
                    return CONSTANTS.ScriptGetStockRamCost;
                }
            }
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
                if (workerScript.loadedFns.getStockPosition) {
                    return 0;
                } else {
                    workerScript.loadedFns.getStockPosition = true;
                    return CONSTANTS.ScriptGetStockRamCost;
                }
            }
            if (!Player.hasTixApiAccess) {
                throw makeRuntimeRejectMsg(workerScript, "You don't have TIX API Access! Cannot use getStockPosition()");
            }
            var stock = SymbolToStockMap[symbol];
            if (stock == null) {
                throw makeRuntimeRejectMsg(workerScript, "Invalid stock symbol passed into getStockPrice()");
            }
            return [stock.playerShares, stock.playerAvgPx, stock.playerShortShares, stock.playerAvgShortPx];
        },
        buyStock : function(symbol, shares) {
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.buyStock) {
                    return 0;
                } else {
                    workerScript.loadedFns.buyStock = true;
                    return CONSTANTS.ScriptBuySellStockRamCost;
                }
            }
            if (!Player.hasTixApiAccess) {
                throw makeRuntimeRejectMsg(workerScript, "You don't have TIX API Access! Cannot use buyStock()");
            }
            var stock = SymbolToStockMap[symbol];
            if (stock == null) {
                throw makeRuntimeRejectMsg(workerScript, "Invalid stock symbol passed into buyStock()");
            }
            if (shares < 0 || isNaN(shares)) {
                workerScript.scriptRef.log("Error: Invalid 'shares' argument passed to buyStock()");
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
            if (Engine.currentPage == Engine.Page.StockMarket) {
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
                if (workerScript.loadedFns.sellStock) {
                    return 0;
                } else {
                    workerScript.loadedFns.sellStock = true;
                    return CONSTANTS.ScriptBuySellStockRamCost;
                }
            }
            if (!Player.hasTixApiAccess) {
                throw makeRuntimeRejectMsg(workerScript, "You don't have TIX API Access! Cannot use sellStock()");
            }
            var stock = SymbolToStockMap[symbol];
            if (stock == null) {
                throw makeRuntimeRejectMsg(workerScript, "Invalid stock symbol passed into sellStock()");
            }
            if (shares < 0 || isNaN(shares)) {
                workerScript.scriptRef.log("Error: Invalid 'shares' argument passed to sellStock()");
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
            if (Engine.currentPage == Engine.Page.StockMarket) {
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
                if (workerScript.loadedFns.shortStock) {
                    return 0;
                } else {
                    workerScript.loadedFns.shortStock = true;
                    return CONSTANTS.ScriptBuySellStockRamCost;
                }
            }
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
                if (workerScript.loadedFns.sellShort) {
                    return 0;
                } else {
                    workerScript.loadedFns.sellShort = true;
                    return CONSTANTS.ScriptBuySellStockRamCost;
                }
            }
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
                if (workerScript.loadedFns.placeOrder) {
                    return 0;
                } else {
                    workerScript.loadedFns.placeOrder = true;
                    return CONSTANTS.ScriptBuySellStockRamCost;
                }
            }
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
                if (workerScript.loadedFns.cancelOrder) {
                    return 0;
                } else {
                    workerScript.loadedFns.cancelOrder = true;
                    return CONSTANTS.ScriptBuySellStockRamCost;
                }
            }
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
        purchaseServer : function(hostname, ram) {
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.purchaseServer) {
                    return 0;
                } else {
                    workerScript.loadedFns.purchaseServer = true;
                    return CONSTANTS.ScriptPurchaseServerRamCost;
                }
            }
            var hostnameStr = String(hostname);
            hostnameStr = hostnameStr.replace(/\s+/g, '');
            if (hostnameStr == "") {
                workerScript.scriptRef.log("Error: Passed empty string for hostname argument of purchaseServer()");
                return "";
            }

            if (Player.purchasedServers.length >= CONSTANTS.PurchasedServerLimit) {
                workerScript.scriptRef.log("Error: You have reached the maximum limit of " + CONSTANTS.PurchasedServerLimit +
                                           " servers. You cannot purchase any more.");
                return "";
            }

            ram = Math.round(ram);
            if (isNaN(ram) || !powerOfTwo(ram)) {
                workerScript.scriptRef.log("Error: Invalid ram argument passed to purchaseServer(). Must be numeric and a power of 2");
                return "";
            }

            var cost = ram * CONSTANTS.BaseCostFor1GBOfRamServer;
            if (Player.money.lt(cost)) {
                workerScript.scriptRef.log("Error: Not enough money to purchase server. Need $" + formatNumber(cost, 2));
                return "";
            }
            var newServ = new Server(createRandomIp(), hostnameStr, "", false, true, true, ram);
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
                if (workerScript.loadedFns.deleteServer) {
                    return 0;
                } else {
                    workerScript.loadedFns.deleteServer = true;
                    return CONSTANTS.ScriptPurchaseServerRamCost;
                }
            }
            var hostnameStr = String(hostname);
            hostnameStr = hostnameStr.replace(/\s\s+/g, '');
            var server = GetServerByHostname(hostnameStr);
            if (server == null) {
                workerScript.scriptRef.log("Error: Could not find server with hostname " + hostnameStr + ". deleteServer() failed");
                return false;
            }

            if (!server.purchasedByPlayer || server.hostname == "home") {
                workerScript.scriptRef.log("Error: Server " + server.hostname + " is not a purchased server. " +
                                           "Cannot be deleted. deleteServer failed");
                return false;
            }

            var ip = server.ip;

            //A server cannot delete itself
            if (ip == workerScript.serverIp) {
                workerScript.scriptRef.log("Error: Cannot call deleteServer() on self. Function failed");
                return false;
            }

            //Delete all scripts running on server
            if (server.runningScripts.length > 0) {
                workerScript.scriptRef.log("Error: Cannot delete server " + server.hostname + " because it still has scripts running.");
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
                workerScript.scriptRef.log("Error: Could not identify server " + server.hostname +
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
            workerScript.scriptRef.log("Error: Could not find server " + server.hostname +
                                       "as a purchased server. This is likely a bug please contact game dev");
            return false;
        },
        getPurchasedServers : function(hostname=true) {
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.getPurchasedServers) {
                    return 0;
                } else {
                    workerScript.loadedFns.getPurchasedServers = true;
                    return CONSTANTS.ScriptPurchaseServerRamCost;
                }
            }
            var res = [];
            Player.purchasedServers.forEach(function(ip) {
                if (hostname) {
                    var server = getServer(ip);
                    if (server == null) {
                        throw makeRuntimeRejectMsg(workerScript, "ERR: Could not find server in getPurchasedServers(). This is a bug please report to game dev");
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
                if (workerScript.loadedFns.write) {
                    return 0;
                } else {
                    workerScript.loadedFns.write = true;
                    return CONSTANTS.ScriptReadWriteRamCost;
                }
            }
            if (!isNaN(port)) { //Write to port
                //Port 1-10
                port = Math.round(port);
                if (port < 1 || port > CONSTANTS.NumNetscriptPorts) {
                    throw makeRuntimeRejectMsg(workerScript, "ERR: Trying to write to invalid port: " + port + ". Only ports 1-" + CONSTANTS.NumNetscriptPorts + " are valid.");
                }
                var port = NetscriptPorts[port-1];
                if (port == null || !(port instanceof NetscriptPort)) {
                    throw makeRuntimeRejectMsg(workerScript, "Could not find port: " + port + ". This is a bug contact the game developer");
                }
                return port.write(data);
            } else if (isString(port)) { //Write to text file
                var fn = port;
                var server = getServer(workerScript.serverIp);
                if (server == null) {
                    throw makeRuntimeRejectMsg(workerScript, "Error getting Server for this script in write(). This is a bug please contact game dev");
                }
                var txtFile = getTextFile(fn, server);
                if (txtFile == null) {
                    txtFile = createTextFile(fn, data, server);
                    return true;
                }
                if (mode === "w") {
                    txtFile.write(data);
                } else {
                    txtFile.append(data);
                }
                return true;
            } else {
                throw makeRuntimeRejectMsg(workerScript, "Invalid argument passed in for write: " + port);
            }
        },
        read : function(port) {
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.read) {
                    return 0;
                } else {
                    workerScript.loadedFns.read = true;
                    return CONSTANTS.ScriptReadWriteRamCost;
                }
            }
            if (!isNaN(port)) { //Read from port
                //Port 1-10
                port = Math.round(port);
                if (port < 1 || port > CONSTANTS.NumNetscriptPorts) {
                    throw makeRuntimeRejectMsg(workerScript, "ERR: Trying to read from invalid port: " + port + ". Only ports 1-" + CONSTANTS.NumNetscriptPorts + " are valid.");
                }
                var port = NetscriptPorts[port-1];
                if (port == null || !(port instanceof NetscriptPort)) {
                    throw makeRuntimeRejectMsg(workerScript, "ERR: Could not find port: " + port + ". This is a bug contact the game developer");
                }
                return port.read();
            } else if (isString(port)) { //Read from text file
                var fn = port;
                var server = getServer(workerScript.serverIp);
                if (server == null) {
                    throw makeRuntimeRejectMsg(workerScript, "Error getting Server for this script in read(). This is a bug please contact game dev");
                }
                var txtFile = getTextFile(fn, server);
                if (txtFile !== null) {
                    return txtFile.text;
                } else {
                    return "";
                }
            } else {
                throw makeRuntimeRejectMsg(workerScript, "Invalid argument passed in for read(): " + port);
            }
        },
        peek : function(port) {
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.peek) {
                    return 0;
                } else {
                    workerScript.loadedFns.peek = true;
                    return CONSTANTS.ScriptReadWriteRamCost;
                }
            }
            if (isNaN(port)) {
                throw makeRuntimeRejectMsg(workerScript, "ERR: peek() called with invalid argument. Must be a port number between 1 and " + CONSTANTS.NumNetscriptPorts);
            }
            port = Math.round(port);
            if (port < 1 || port > CONSTANTS.NumNetscriptPorts) {
                throw makeRuntimeRejectMsg(workerScript, "ERR: peek() called with invalid argument. Must be a port number between 1 and " + CONSTANTS.NumNetscriptPorts);
            }
            var port = NetscriptPorts[port-1];
            if (port == null || !(port instanceof NetscriptPort)) {
                throw makeRuntimeRejectMsg(workerScript, "ERR: Could not find port: " + port + ". This is a bug contact the game developer");
            }
            return port.peek();
        },
        clear : function(port) {
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.clear) {
                    return 0;
                } else {
                    workerScript.loadedFns.clear = true;
                    return CONSTANTS.ScriptReadWriteRamCost;
                }
            }
            if (!isNaN(port)) { //Clear port
                port = Math.round(port);
                if (port < 1 || port > CONSTANTS.NumNetscriptPorts) {
                    throw makeRuntimeRejectMsg(workerScript, "ERR: Trying to clear invalid port: " + port + ". Only ports 1-" + CONSTANTS.NumNetscriptPorts + " are valid");
                }
                var port = NetscriptPorts[port-1];
                if (port == null || !(port instanceof NetscriptPort)) {
                    throw makeRuntimeRejectMsg(workerScript, "ERR: Could not find port: " + port + ". This is a bug contact the game developer");
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
                if (workerScript.loadedFns.getPortHandle) {
                    return 0;
                } else {
                    workerScript.loadedFns.getPortHandle = true;
                    return CONSTANTS.ScriptReadWriteRamCost * 10;
                }
            }
            if (isNaN(port)) {
                throw makeRuntimeRejectMsg(workerScript, "ERR: Invalid argument passed into getPortHandle(). Must be an integer between 1 and " + CONSTANTS.NumNetscriptPorts);
            }
            port = Math.round(port);
            if (port < 1 || port > CONSTANTS.NumNetscriptPorts) {
                throw makeRuntimeRejectMsg(workerScript, "ERR: getPortHandle() called with invalid port number: " + port + ". Only ports 1-" + CONSTANTS.NumNetscriptPorts + " are valid");
            }
            var port = NetscriptPorts[port-1];
            if (port == null || !(port instanceof NetscriptPort)) {
                throw makeRuntimeRejectMsg(workerScript, "ERR: Could not find port: " + port + ". This is a bug contact the game developer");
            }
            return port;
        },
        rm : function(fn) {
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.rm) {
                    return 0;
                } else {
                    workerScript.loadedFns.rm = true;
                    return CONSTANTS.ScriptReadWriteRamCost;
                }
            }
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
            }
            return false;
        },
        scriptRunning : function(scriptname, ip) {
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.scriptRunning) {
                    return 0;
                } else {
                    workerScript.loadedFns.scriptRunning = true;
                    return CONSTANTS.ScriptArbScriptRamCost;
                }
            }
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
                if (workerScript.loadedFns.scriptKill) {
                    return 0;
                } else {
                    workerScript.loadedFns.scriptKill = true;
                    return CONSTANTS.ScriptArbScriptRamCost;
                }
            }
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
        getScriptRam : function (scriptname, ip) {
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.getScriptRam) {
                    return 0;
                } else {
                    workerScript.loadedFns.getScriptRam = true;
                    return CONSTANTS.ScriptGetScriptRamCost;
                }
            }
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
        getHackTime : function(ip) {
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.getHackTime) {
                    return 0;
                } else {
                    workerScript.loadedFns.getHackTime = true;
                    return CONSTANTS.ScriptGetHackTimeRamCost;
                }
            }
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("getHackTime() failed. Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "getHackTime() failed. Invalid IP or hostname passed in: " + ip);
            }
            return scriptCalculateHackingTime(server); //Returns seconds
        },
        getGrowTime : function(ip) {
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.getGrowTime) {
                    return 0;
                } else {
                    workerScript.loadedFns.getGrowTime = true;
                    return CONSTANTS.ScriptGetHackTimeRamCost;
                }
            }
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("getGrowTime() failed. Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "getGrowTime() failed. Invalid IP or hostname passed in: " + ip);
            }
            return scriptCalculateGrowTime(server) / 1000; //Returns seconds
        },
        getWeakenTime : function(ip) {
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.getWeakenTime) {
                    return 0;
                } else {
                    workerScript.loadedFns.getWeakenTime = true;
                    return CONSTANTS.ScriptGetHackTimeRamCost;
                }
            }
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("getWeakenTime() failed. Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "getWeakenTime() failed. Invalid IP or hostname passed in: " + ip);
            }
            return scriptCalculateWeakenTime(server) / 1000; //Returns seconds
        },
        getScriptIncome : function(scriptname, ip) {
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.getScriptIncome) {
                    return 0;
                } else {
                    workerScript.loadedFns.getScriptIncome = true;
                    return CONSTANTS.ScriptGetScriptRamCost;
                }
            }
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
                    workerScript.scriptRef.log("getScriptIncome() failed. No such script "+ scriptname + " on " + server.hostname + " with args: " + printArray(argsForScript));
                    return -1;
                }
                return runningScriptObj.onlineMoneyMade / runningScriptObj.onlineRunningTime;
            }
        },
        getScriptExpGain : function(scriptname, ip) {
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.getScriptExpGain) {
                    return 0;
                } else {
                    workerScript.loadedFns.getScriptExpGain = true;
                    return CONSTANTS.ScriptGetScriptRamCost;
                }
            }
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
                    workerScript.scriptRef.log("getScriptExpGain() failed. No such script "+ scriptname + " on " + server.hostname + " with args: " + printArray(argsForScript));
                    return -1;
                }
                return runningScriptObj.onlineExpGained / runningScriptObj.onlineRunningTime;
            }
        },
        getTimeSinceLastAug : function() {
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.getTimeSinceLastAug) {
                    return 0;
                } else {
                    workerScript.loadedFns.getTimeSinceLastAug = true;
                    return CONSTANTS.ScriptGetHackTimeRamCost;
                }
            }
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

        /* Singularity Functions */
        universityCourse : function(universityName, className) {
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.universityCourse) {
                    return 0;
                } else {
                    workerScript.loadedFns.universityCourse = true;
                    var ramCost = CONSTANTS.ScriptSingularityFn1RamCost;
                    if (Player.bitNodeN !== 4) {ramCost *= 8;}
                    return ramCost;
                }
            }
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
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.gymWorkout) {
                    return 0;
                } else {
                    workerScript.loadedFns.gymWorkout = true;
                    var ramCost = CONSTANTS.ScriptSingularityFn1RamCost;
                    if (Player.bitNodeN !== 4) {ramCost *= 8;}
                    return ramCost;
                }
            }
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
                    costMult = 2;
                    expMult = 1.5;
                    break;
                case Locations.AevumSnapFitnessGym.toLowerCase():
                    if (Player.city != Locations.Aevum) {
                        workerScript.scriptRef.log("ERROR: You cannot workout at Snap Fitness because you are not in Aevum. gymWorkout() failed");
                        return false;
                    }
                    Player.location = Locations.AevumSnapFitnessGym;
                    costMult = 6;
                    expMult = 4;
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
                    costMult = 10;
                    expMult = 7.5;
                    break;
                case Locations.VolhavenMilleniumFitnessGym:
                    if (Player.city != Locations.Volhaven) {
                        workerScript.scriptRef.log("ERROR: You cannot workout at Millenium Fitness Gym because you are not in Volhaven. gymWorkout() failed");
                        return false;
                    }
                    Player.location = Locations.VolhavenMilleniumFitnessGym;
                    costMult = 3;
                    expMult = 2.5;
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
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.travelToCity) {
                    return 0;
                } else {
                    workerScript.loadedFns.travelToCity = true;
                    var ramCost = CONSTANTS.ScriptSingularityFn1RamCost / 2;
                    if (Player.bitNodeN !== 4) {ramCost *= 8;}
                    return ramCost;
                }
            }
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
                    Player.loseMoney(200000);
                    Player.city = cityname;
                    Player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain);
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
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.purchaseTor) {
                    return 0;
                } else {
                    workerScript.loadedFns.purchaseTor = true;
                    var ramCost = CONSTANTS.ScriptSingularityFn1RamCost;
                    if (Player.bitNodeN !== 4) {ramCost *= 8;}
                    return ramCost;
                }
            }
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

            var darkweb = new Server(createRandomIp(), "darkweb", "", false, false, false, 1);
            AddToAllServers(darkweb);
            SpecialServerIps.addIp("Darkweb Server", darkweb.ip);

            document.getElementById("location-purchase-tor").setAttribute("class", "a-link-button-inactive");

            Player.getHomeComputer().serversOnNetwork.push(darkweb.ip);
            darkweb.serversOnNetwork.push(Player.getHomeComputer().ip);
            Player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain);
            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.purchaseTor == null) {
                workerScript.scriptRef.log("You have purchased a Tor router!");
            }
            return true;
        },
        purchaseProgram(programName) {
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.purchaseProgram) {
                    return 0;
                } else {
                    workerScript.loadedFns.purchaseProgram = true;
                    var ramCost = CONSTANTS.ScriptSingularityFn1RamCost;
                    if (Player.bitNodeN !== 4) {ramCost *= 8;}
                    return ramCost;
                }
            }
            if (Player.bitNodeN != 4) {
                if (!(hasSingularitySF && singularitySFLvl >= 1)) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run purchaseProgram(). It is a Singularity Function and requires SourceFile-4 (level 1) to run.");
                    return false;
                }
            }

            if (SpecialServerIps["Darkweb Server"] == null) {
                workerScript.scriptRef.log("ERROR: You do not have  TOR router. purchaseProgram() failed.");
                return false;
            }

            switch(programName.toLowerCase()) {
                case Programs.BruteSSHProgram.toLowerCase():
                    var price = parseDarkwebItemPrice(DarkWebItems.BruteSSHProgram);
                    if (price > 0 && Player.money.gt(price)) {
                        Player.loseMoney(price);
                        Player.getHomeComputer().programs.push(Programs.BruteSSHProgram);
                        if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.purchaseProgram == null) {
                            workerScript.scriptRef.log("You have purchased the BruteSSH.exe program. The new program can be found on your home computer.");
                        }
                    } else {
                        workerScript.scriptRef.log("Not enough money to purchase " + programName);
                        return false;
                    }
                    return true;
                case Programs.FTPCrackProgram.toLowerCase():
                    var price = parseDarkwebItemPrice(DarkWebItems.FTPCrackProgram);
                    if (price > 0 && Player.money.gt(price)) {
                        Player.loseMoney(price);
                        Player.getHomeComputer().programs.push(Programs.FTPCrackProgram);
                        if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.purchaseProgram == null) {
                            workerScript.scriptRef.log("You have purchased the FTPCrack.exe program. The new program can be found on your home computer.");
                        }
                    } else {
                        workerScript.scriptRef.log("Not enough money to purchase " + programName);
                        return false;
                    }
                    return true;
                case Programs.RelaySMTPProgram.toLowerCase():
                    var price = parseDarkwebItemPrice(DarkWebItems.RelaySMTPProgram);
                    if (price > 0 && Player.money.gt(price)) {
                        Player.loseMoney(price);
                        Player.getHomeComputer().programs.push(Programs.RelaySMTPProgram);
                        if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.purchaseProgram == null) {
                            workerScript.scriptRef.log("You have purchased the relaySMTP.exe program. The new program can be found on your home computer.");
                        }
                    } else {
                        workerScript.scriptRef.log("Not enough money to purchase " + programName);
                        return false;
                    }
                    return true;
                case Programs.HTTPWormProgram.toLowerCase():
                    var price = parseDarkwebItemPrice(DarkWebItems.HTTPWormProgram);
                    if (price > 0 && Player.money.gt(price)) {
                        Player.loseMoney(price);
                        Player.getHomeComputer().programs.push(Programs.HTTPWormProgram);
                        if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.purchaseProgram == null) {
                            workerScript.scriptRef.log("You have purchased the HTTPWorm.exe program. The new program can be found on your home computer.");
                        }
                    } else {
                        workerScript.scriptRef.log("Not enough money to purchase " + programName);
                        return false;
                    }
                    return true;
                case Programs.SQLInjectProgram.toLowerCase():
                    var price = parseDarkwebItemPrice(DarkWebItems.SQLInjectProgram);
                    if (price > 0 && Player.money.gt(price)) {
                        Player.loseMoney(price);
                        Player.getHomeComputer().programs.push(Programs.SQLInjectProgram);
                        if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.purchaseProgram == null) {
                            workerScript.scriptRef.log("You have purchased the SQLInject.exe program. The new program can be found on your home computer.");
                        }
                    } else {
                        workerScript.scriptRef.log("Not enough money to purchase " + programName);
                        return false;
                    }
                    return true;
                case Programs.DeepscanV1.toLowerCase():
                    var price = parseDarkwebItemPrice(DarkWebItems.DeepScanV1Program);
                    if (price > 0 && Player.money.gt(price)) {
                        Player.loseMoney(price);
                        Player.getHomeComputer().programs.push(Programs.DeepscanV1);
                        if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.purchaseProgram == null) {
                            workerScript.scriptRef.log("You have purchased the DeepscanV1.exe program. The new program can be found on your home computer.");
                        }
                    } else {
                        workerScript.scriptRef.log("Not enough money to purchase " + programName);
                        return false;
                    }
                    return true;
                case Programs.DeepscanV2.toLowerCase():
                    var price = parseDarkwebItemPrice(DarkWebItems.DeepScanV2Program);
                    if (price > 0 && Player.money.gt(price)) {
                        Player.loseMoney(price);
                        Player.getHomeComputer().programs.push(Programs.DeepscanV2);
                        if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.purchaseProgram == null) {
                            workerScript.scriptRef.log("You have purchased the DeepscanV2.exe program. The new program can be found on your home computer.");
                        }
                    } else {
                        workerScript.scriptRef.log("Not enough money to purchase " + programName);
                        return false;
                    }
                    return true;
                default:
                    workerScript.scriptRef.log("ERROR: Invalid program passed into purchaseProgram().");
                    return false;
            }
            return true;
        },
        getStats : function() {
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.getStats) {
                    return 0;
                } else {
                    workerScript.loadedFns.getStats = true;
                    var ramCost = CONSTANTS.ScriptSingularityFn1RamCost / 4;
                    if (Player.bitNodeN !== 4) {ramCost *= 8;}
                    return ramCost;
                }
            }
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
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.getCharacterInformation) {
                    return 0;
                } else {
                    workerScript.loadedFns.getCharacterInformation = true;
                    var ramCost = CONSTANTS.ScriptSingularityFn1RamCost / 4;
                    if (Player.bitNodeN !== 4) {ramCost *= 8;}
                    return ramCost;
                }
            }

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
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.isBusy) {
                    return 0;
                } else {
                    workerScript.loadedFns.isBusy = true;
                    var ramCost = CONSTANTS.ScriptSingularityFn1RamCost / 4;
                    if (Player.bitNodeN !== 4) {ramCost *= 8;}
                    return ramCost;
                }
            }
            if (Player.bitNodeN != 4) {
                if (!(hasSingularitySF && singularitySFLvl >= 1)) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run isBusy(). It is a Singularity Function and requires SourceFile-4 (level 1) to run.");
                    return;
                }
            }
            return Player.isWorking;
        },
        stopAction : function() {
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.stopAction) {
                    return 0;
                } else {
                    workerScript.loadedFns.stopAction = true;
                    var ramCost = CONSTANTS.ScriptSingularityFn1RamCost / 2;
                    if (Player.bitNodeN !== 4) {ramCost *= 8;}
                    return ramCost;
                }
            }
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
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.upgradeHomeRam) {
                    return 0;
                } else {
                    workerScript.loadedFns.upgradeHomeRam = true;
                    var ramCost = CONSTANTS.ScriptSingularityFn2RamCost;
                    if (Player.bitNodeN !== 4) {ramCost *= 8;}
                    return ramCost;
                }
            }
            if (Player.bitNodeN != 4) {
                if (!(hasSingularitySF && singularitySFLvl >= 2)) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run upgradeHomeRam(). It is a Singularity Function and requires SourceFile-4 (level 2) to run.");
                    return false;
                }
            }

            //Calculate how many times ram has been upgraded (doubled)
            var currentRam = Player.getHomeComputer().maxRam;
            var numUpgrades = Math.log2(currentRam);

            //Calculate cost
            //Have cost increase by some percentage each time RAM has been upgraded
            var cost = currentRam * CONSTANTS.BaseCostFor1GBOfRamHome;
            var mult = Math.pow(1.55, numUpgrades);
            cost = cost * mult;

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
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.getUpgradeHomeRamCost) {
                    return 0;
                } else {
                    workerScript.loadedFns.getUpgradeHomeRamCost = true;
                    var ramCost = CONSTANTS.ScriptSingularityFn2RamCost / 2;
                    if (Player.bitNodeN !== 4) {ramCost *= 8;}
                    return ramCost;
                }
            }
            if (Player.bitNodeN != 4) {
                if (!(hasSingularitySF && singularitySFLvl >= 2)) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run getUpgradeHomeRamCost(). It is a Singularity Function and requires SourceFile-4 (level 2) to run.");
                    return false;
                }
            }

            //Calculate how many times ram has been upgraded (doubled)
            var currentRam = Player.getHomeComputer().maxRam;
            var numUpgrades = Math.log2(currentRam);

            //Calculate cost
            //Have cost increase by some percentage each time RAM has been upgraded
            var cost = currentRam * CONSTANTS.BaseCostFor1GBOfRamHome;
            var mult = Math.pow(1.55, numUpgrades);
            return cost * mult;
        },
        workForCompany : function() {
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.workForCompany) {
                    return 0;
                } else {
                    workerScript.loadedFns.workForCompany = true;
                    var ramCost = CONSTANTS.ScriptSingularityFn2RamCost;
                    if (Player.bitNodeN !== 4) {ramCost *= 8;}
                    return ramCost;
                }
            }
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
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.applyToCompany) {
                    return 0;
                } else {
                    workerScript.loadedFns.applyToCompany = true;
                    var ramCost = CONSTANTS.ScriptSingularityFn2RamCost;
                    if (Player.bitNodeN !== 4) {ramCost *= 8;}
                    return ramCost;
                }
            }
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
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.getCompanyRep) {
                    return 0;
                } else {
                    workerScript.loadedFns.getCompanyRep = true;
                    var ramCost = CONSTANTS.ScriptSingularityFn2RamCost / 4;
                    if (Player.bitNodeN !== 4) {ramCost *= 8;}
                    return ramCost;
                }
            }
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
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.getCompanyFavor) {
                    return 0;
                } else {
                    workerScript.loadedFns.getCompanyFavor = true;
                    var ramCost = CONSTANTS.ScriptSingularityFn2RamCost / 4;
                    if (Player.bitNodeN !== 4) {ramCost *= 8;}
                    return ramCost;
                }
            }
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
        checkFactionInvitations : function() {
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.checkFactionInvitations) {
                    return 0;
                } else {
                    workerScript.loadedFns.checkFactionInvitations = true;
                    var ramCost = CONSTANTS.ScriptSingularityFn2RamCost;
                    if (Player.bitNodeN !== 4) {ramCost *= 8;}
                    return ramCost;
                }
            }
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
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.joinFaction) {
                    return 0;
                } else {
                    workerScript.loadedFns.joinFaction = true;
                    var ramCost = CONSTANTS.ScriptSingularityFn2RamCost;
                    if (Player.bitNodeN !== 4) {ramCost *= 8;}
                    return ramCost;
                }
            }
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

            var index = Player.factionInvitations.indexOf(name);
            if (index === -1) {
                //Redundant and should never happen...
                workerScript.scriptRef.log("ERROR: Cannot join " + name + " Faction because you have not been invited. joinFaction() failed");
                return false;
            }
            Player.factionInvitations.splice(index, 1);
            var fac = Factions[name];
            joinFaction(fac);
            Player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain);
            if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.joinFaction == null) {
                workerScript.scriptRef.log("Joined the " + name + " faction.");
            }
            return true;
        },
        workForFaction : function(name, type) {
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.workForFaction) {
                    return 0;
                } else {
                    workerScript.loadedFns.workForFaction = true;
                    var ramCost = CONSTANTS.ScriptSingularityFn2RamCost;
                    if (Player.bitNodeN !== 4) {ramCost *= 8;}
                    return ramCost;
                }
            }
            if (Player.bitNodeN != 4) {
                if (!(hasSingularitySF && singularitySFLvl >= 2)) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run workForFaction(). It is a Singularity Function and requires SourceFile-4 (level 2) to run.");
                    return false;
                }
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
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.getFactionRep) {
                    return 0;
                } else {
                    workerScript.loadedFns.getFactionRep = true;
                    var ramCost = CONSTANTS.ScriptSingularityFn2RamCost / 4;
                    if (Player.bitNodeN !== 4) {ramCost *= 8;}
                    return ramCost;
                }
            }
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
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.getFactionFavor) {
                    return 0;
                } else {
                    workerScript.loadedFns.getFactionFavor = true;
                    var ramCost = CONSTANTS.ScriptSingularityFn2RamCost / 4;
                    if (Player.bitNodeN !== 4) {ramCost *= 8;}
                    return ramCost;
                }
            }
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
        createProgram : function(name) {
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.createProgram) {
                    return 0;
                } else {
                    workerScript.loadedFns.createProgram = true;
                    var ramCost = CONSTANTS.ScriptSingularityFn3RamCost;
                    if (Player.bitNodeN !== 4) {ramCost *= 8;}
                    return ramCost;
                }
            }
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

            switch(name.toLowerCase()) {
                case Programs.NukeProgram.toLowerCase():
                    Player.startCreateProgramWork(Programs.NukeProgram, CONSTANTS.MillisecondsPerFiveMinutes, 1);
                    break;
                case Programs.BruteSSHProgram.toLowerCase():
                    if (Player.hacking_skill < 50) {
                        workerScript.scriptRef.log("ERROR: createProgram() failed because hacking level is too low to create BruteSSH (level 50 req)");
                        return false;
                    }
                    Player.startCreateProgramWork(Programs.BruteSSHProgram, CONSTANTS.MillisecondsPerFiveMinutes * 2, 50);
                    break;
                case Programs.FTPCrackProgram.toLowerCase():
                    if (Player.hacking_skill < 100) {
                        workerScript.scriptRef.log("ERROR: createProgram() failed because hacking level is too low to create FTPCrack (level 100 req)");
                        return false;
                    }
                    Player.startCreateProgramWork(Programs.FTPCrackProgram, CONSTANTS.MillisecondsPerHalfHour, 100);
                    break;
                case Programs.RelaySMTPProgram.toLowerCase():
                    if (Player.hacking_skill < 250) {
                        workerScript.scriptRef.log("ERROR: createProgram() failed because hacking level is too low to create relaySMTP (level 250 req)");
                        return false;
                    }
                    Player.startCreateProgramWork(Programs.RelaySMTPProgram, CONSTANTS.MillisecondsPer2Hours, 250);
                    break;
                case Programs.HTTPWormProgram.toLowerCase():
                    if (Player.hacking_skill < 500) {
                        workerScript.scriptRef.log("ERROR: createProgram() failed because hacking level is too low to create HTTPWorm (level 500 req)");
                        return false;
                    }
                    Player.startCreateProgramWork(Programs.HTTPWormProgram, CONSTANTS.MillisecondsPer4Hours, 500);
                    break;
                case Programs.SQLInjectProgram.toLowerCase():
                    if (Player.hacking_skill < 750) {
                        workerScript.scriptRef.log("ERROR: createProgram() failed because hacking level is too low to create SQLInject (level 750 req)");
                        return false;
                    }
                    Player.startCreateProgramWork(Programs.SQLInjectProgram, CONSTANTS.MillisecondsPer8Hours, 750);
                    break;
                case Programs.DeepscanV1.toLowerCase():
                    if (Player.hacking_skill < 75) {
                        workerScript.scriptRef.log("ERROR: createProgram() failed because hacking level is too low to create DeepscanV1 (level 75 req)");
                        return false;
                    }
                    Player.startCreateProgramWork(Programs.DeepscanV1, CONSTANTS.MillisecondsPerQuarterHour, 75);
                    break;
                case Programs.DeepscanV2.toLowerCase():
                    if (Player.hacking_skill < 400) {
                        workerScript.scriptRef.log("ERROR: createProgram() failed because hacking level is too low to create DeepscanV2 (level 400 req)");
                        return false;
                    }
                    Player.startCreateProgramWork(Programs.DeepscanV2, CONSTANTS.MillisecondsPer2Hours, 400);
                    break;
                case Programs.ServerProfiler.toLowerCase():
                    if (Player.hacking_skill < 75) {
                        workerScript.scriptRef.log("ERROR: createProgram() failed because hacking level is too low to create ServerProfiler (level 75 req)");
                        return false;
                    }
                    Player.startCreateProgramWork(Programs.ServerProfiler, CONSTANTS.MillisecondsPerHalfHour, 75);
                    break;
                case Programs.AutoLink.toLowerCase():
                    if (Player.hacking_skill < 25) {
                        workerScript.scriptRef.log("ERROR: createProgram() failed because hacking level is too low to create AutoLink (level 25 req)");
                        return false;
                    }
                    Player.startCreateProgramWork(Programs.AutoLink, CONSTANTS.MillisecondsPerQuarterHour, 25);
                    break;
                default:
                    workerScript.scriptRef.log("ERROR: createProgram() failed because the specified program does not exist: " + name);
                    return false;
            }
            workerScript.scriptRef.log("Began creating program: " + name);
            return true;
        },
        commitCrime : function(crime) {
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.commitCrime) {
                    return 0;
                } else {
                    workerScript.loadedFns.commitCrime = true;
                    var ramCost = CONSTANTS.ScriptSingularityFn3RamCost;
                    if (Player.bitNodeN !== 4) {ramCost *= 8;}
                    return ramCost;
                }
            }
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

            crime = crime.toLowerCase();
            if (crime.includes("shoplift")) {
                workerScript.scriptRef.log("Attempting to shoplift...");
                return commitShopliftCrime(CONSTANTS.CrimeSingFnDivider, {workerscript: workerScript});
            } else if (crime.includes("rob") && crime.includes("store")) {
                workerScript.scriptRef.log("Attempting to rob a store...");
                return commitRobStoreCrime(CONSTANTS.CrimeSingFnDivider, {workerscript: workerScript});
            } else if (crime.includes("mug")) {
                workerScript.scriptRef.log("Attempting to mug someone...");
                return commitMugCrime(CONSTANTS.CrimeSingFnDivider, {workerscript: workerScript});
            } else if (crime.includes("larceny")) {
                workerScript.scriptRef.log("Attempting to commit larceny...");
                return commitLarcenyCrime(CONSTANTS.CrimeSingFnDivider, {workerscript: workerScript});
            } else if (crime.includes("drugs")) {
                workerScript.scriptRef.log("Attempting to deal drugs...");
                return commitDealDrugsCrime(CONSTANTS.CrimeSingFnDivider, {workerscript: workerScript});
            } else if (crime.includes("bond") && crime.includes("forge")) {
                workerScript.scriptRef.log("Attempting to forge corporate bonds...");
                return commitBondForgeryCrime(CONSTANTS.CrimeSingFnDivider, {workerscript: workerScript});
            } else if (crime.includes("traffick") && crime.includes("arms")) {
                workerScript.scriptRef.log("Attempting to traffick illegal arms...");
                return commitTraffickArmsCrime(CONSTANTS.CrimeSingFnDivider, {workerscript: workerScript});
            } else if (crime.includes("homicide")) {
                workerScript.scriptRef.log("Attempting to commit homicide...");
                return commitHomicideCrime(CONSTANTS.CrimeSingFnDivider, {workerscript: workerScript});
            } else if (crime.includes("grand") && crime.includes("auto")) {
                workerScript.scriptRef.log("Attempting to commit grand theft auto...");
                return commitGrandTheftAutoCrime(CONSTANTS.CrimeSingFnDivider, {workerscript: workerScript});
            } else if (crime.includes("kidnap")) {
                workerScript.scriptRef.log("Attempting to kidnap and ransom a high-profile target...");
                return commitKidnapCrime(CONSTANTS.CrimeSingFnDivider, {workerscript: workerScript});
            } else if (crime.includes("assassinate")) {
                workerScript.scriptRef.log("Attempting to assassinate a high-profile target...");
                return commitAssassinationCrime(CONSTANTS.CrimeSingFnDivider, {workerscript: workerScript})
            } else if (crime.includes("heist")) {
                workerScript.scriptRef.log("Attempting to pull off a heist...");
                return commitHeistCrime(CONSTANTS.CrimeSingFnDivider, {workerscript: workerScript});
            } else {
                throw makeRuntimeRejectMsg(workerScript, "Invalid crime passed into commitCrime(): " + crime);
            }
        },
        getCrimeChance : function(crime) {
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.getCrimeChance) {
                    return 0;
                } else {
                    workerScript.loadedFns.getCrimeChance = true;
                    var ramCost = CONSTANTS.ScriptSingularityFn3RamCost;
                    if (Player.bitNodeN !== 4) {ramCost *= 8;}
                    return ramCost;
                }
            }
            if (Player.bitNodeN != 4) {
                if (!(hasSingularitySF && singularitySFLvl >= 3)) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run getCrimeChance(). It is a Singularity Function and requires SourceFile-4 (level 3) to run.");
                    return;
                }
            }

            crime = crime.toLowerCase();
            if (crime.includes("shoplift")) {
                return determineCrimeChanceShoplift();
            } else if (crime.includes("rob") && crime.includes("store")) {
                return determineCrimeChanceRobStore();
            } else if (crime.includes("mug")) {
                return determineCrimeChanceMug();
            } else if (crime.includes("larceny")) {
                return determineCrimeChanceLarceny();
            } else if (crime.includes("drugs")) {
                return determineCrimeChanceDealDrugs();
            } else if (crime.includes("bond") && crime.includes("forge")) {
                return determineCrimeChanceBondForgery();
            } else if (crime.includes("traffick") && crime.includes("arms")) {
                return determineCrimeChanceTraffickArms();
            } else if (crime.includes("homicide")) {
                return determineCrimeChanceHomicide();
            } else if (crime.includes("grand") && crime.includes("auto")) {
                return determineCrimeChanceGrandTheftAuto();
            } else if (crime.includes("kidnap")) {
                return determineCrimeChanceKidnap();
            } else if (crime.includes("assassinate")) {
                return determineCrimeChanceAssassination();
            } else if (crime.includes("heist")) {
                return determineCrimeChanceHeist();
            } else {
                throw makeRuntimeRejectMsg(workerScript, "Invalid crime passed into getCrimeChance(): " + crime);
            }
        },
        getOwnedAugmentations : function(purchased=false) {
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.getOwnedAugmentations) {
                    return 0;
                } else {
                    workerScript.loadedFns.getOwnedAugmentations = true;
                    var ramCost = CONSTANTS.ScriptSingularityFn3RamCost;
                    if (Player.bitNodeN !== 4) {ramCost *= 8;}
                    return ramCost;
                }
            }
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
        getAugmentationsFromFaction : function(facname) {
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.getAugmentationsFromFaction) {
                    return 0;
                } else {
                    workerScript.loadedFns.getAugmentationsFromFaction = true;
                    var ramCost = CONSTANTS.ScriptSingularityFn3RamCost;
                    if (Player.bitNodeN !== 4) {ramCost *= 8;}
                    return ramCost;
                }
            }
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
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.getAugmentationCost) {
                    return 0;
                } else {
                    workerScript.loadedFns.getAugmentationCost = true;
                    var ramCost = CONSTANTS.ScriptSingularityFn3RamCost;
                    if (Player.bitNodeN !== 4) {ramCost *= 8;}
                    return ramCost;
                }
            }
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
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.purchaseAugmentation) {
                    return 0;
                } else {
                    workerScript.loadedFns.purchaseAugmentation = true;
                    var ramCost = CONSTANTS.ScriptSingularityFn3RamCost;
                    if (Player.bitNodeN !== 4) {ramCost *= 8;}
                    return ramCost;
                }
            }
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
            if (workerScript.checkingRam) {
                if (workerScript.loadedFns.installAugmentations) {
                    return 0;
                } else {
                    workerScript.loadedFns.installAugmentations = true;
                    var ramCost = CONSTANTS.ScriptSingularityFn3RamCost;
                    if (Player.bitNodeN !== 4) {ramCost *= 8;}
                    return ramCost;
                }
            }
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
        }
    }
}

export {NetscriptFunctions, initSingularitySFFlags, hasSingularitySF, hasBn11SF,
        hasWallStreetSF, wallStreetSFLvl, hasCorporationSF, hasAISF, hasBladeburnerSF};
