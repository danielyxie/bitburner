import {updateActiveScriptsItems}                   from "./ActiveScriptsUI.js";
import {Augmentations, Augmentation,
        augmentationExists, installAugmentations,
        AugmentationNames}                          from "./Augmentations.js";
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
import {Player}                                     from "./Player.js";
import {Script, findRunningScript, RunningScript}   from "./Script.js";
import {Server, getServer, AddToAllServers,
        AllServers, processSingleServerGrowth,
        GetServerByHostname}                        from "./Server.js";
import {Settings}                                   from "./Settings.js";
import {SpecialServerIps}                           from "./SpecialServerIps.js";
import {StockMarket, StockSymbols, SymbolToStockMap, initStockSymbols,
        initStockMarket, initSymbolToStockMap, stockMarketCycle, buyStock,
        sellStock, updateStockPrices, displayStockMarketContent,
        updateStockTicker, updateStockPlayerPosition,
        Stock}                                      from "./StockMarket.js";
import {post}                                       from "./Terminal.js";

import {WorkerScript, workerScripts,
        killWorkerScript, NetscriptPorts}           from "./NetscriptWorker.js";
import {makeRuntimeRejectMsg, netscriptDelay, runScriptFromScript,
        scriptCalculateHackingChance, scriptCalculateHackingTime,
        scriptCalculateExpGain, scriptCalculatePercentMoneyHacked,
        scriptCalculateGrowTime, scriptCalculateWeakenTime} from "./NetscriptEvaluator.js";
import {Environment}                                from "./NetscriptEnvironment.js";

import Decimal                                      from '../utils/decimal.js';
import {dialogBoxCreate}                            from "../utils/DialogBox.js";
import {printArray, powerOfTwo}                     from "../utils/HelperFunctions.js";
import {createRandomIp}                             from "../utils/IPAddress.js";
import {formatNumber, isString, isHTML}             from "../utils/StringHelperFunctions.js";

var hasSingularitySF = false;
var singularitySFLvl = 1;

function initSingularitySFFlags() {
    for (var i = 0; i < Player.sourceFiles.length; ++i) {
        if (Player.sourceFiles[i].n === 4) {
            hasSingularitySF = true;
            singularitySFLvl = Player.sourceFiles[i].lvl;
        }
    }
}

function NetscriptFunctions(workerScript) {
    return {
        Math : Math,
        hacknetnodes : Player.hacknetNodes,
        scan : function(ip=workerScript.serverIp){
            var server = getServer(ip);
            if (server == null) {
                throw makeRuntimeRejectMsg(workerScript, 'Invalid IP or hostname passed into scan() command');
            }
            var out = [];
            for (var i = 0; i < server.serversOnNetwork.length; i++) {
                var entry = server.getServerOnNetwork(i).hostname;
                if (entry == null) {
                    continue;
                }
                out.push(entry);
            }
            workerScript.scriptRef.log('scan() returned ' + server.serversOnNetwork.length + ' connections for ' + server.hostname);
            return out;
        },
        hack : function(ip){
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

            workerScript.scriptRef.log("Attempting to hack " + ip + " in " + hackingTime.toFixed(3) + " seconds (t=" + threads + ")");
            //console.log("Hacking " + server.hostname + " after " + hackingTime.toString() + " seconds (t=" + threads + ")");
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
                    workerScript.scriptRef.recordHack(server.ip, moneyGained, threads);
                    Player.gainHackingExp(expGainedOnSuccess);
                    workerScript.scriptRef.onlineExpGained += expGainedOnSuccess;
                    //console.log("Script successfully hacked " + server.hostname + " for $" + formatNumber(moneyGained, 2) + " and " + formatNumber(expGainedOnSuccess, 4) +  " exp");
                    workerScript.scriptRef.log("Script SUCCESSFULLY hacked " + server.hostname + " for $" + formatNumber(moneyGained, 2) + " and " + formatNumber(expGainedOnSuccess, 4) +  " exp (t=" + threads + ")");
                    server.fortify(CONSTANTS.ServerFortifyAmount * threads);
                    return Promise.resolve(true);
                } else {
                    //Player only gains 25% exp for failure? TODO Can change this later to balance
                    Player.gainHackingExp(expGainedOnFailure);
                    workerScript.scriptRef.onlineExpGained += expGainedOnFailure;
                    //console.log("Script unsuccessful to hack " + server.hostname + ". Gained " + formatNumber(expGainedOnFailure, 4) + " exp");
                    workerScript.scriptRef.log("Script FAILED to hack " + server.hostname + ". Gained " + formatNumber(expGainedOnFailure, 4) + " exp (t=" + threads + ")");
                    return Promise.resolve(false);
                }
            });
        },
        sleep : function(time,log=true){
            if (time === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "sleep() call has incorrect number of arguments. Takes 1 argument");
            }
            if (log) {
                workerScript.scriptRef.log("Sleeping for " + time + " milliseconds");
            }
            return netscriptDelay(time, workerScript).then(function() {
                return Promise.resolve(true);
            });
        },
        grow : function(ip){
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
            //console.log("Executing grow() on server " + server.hostname + " in " + formatNumber(growTime/1000, 3) + " seconds")
            workerScript.scriptRef.log("Executing grow() on server " + server.hostname + " in " + formatNumber(growTime/1000, 3) + " seconds (t=" + threads + ")");
            return netscriptDelay(growTime, workerScript).then(function() {
                if (workerScript.env.stopFlag) {return Promise.reject(workerScript);}
                server.moneyAvailable += (1 * threads); //It can be grown even if it has no money
                var growthPercentage = processSingleServerGrowth(server, 450 * threads);
                workerScript.scriptRef.recordGrow(server.ip, threads);
                var expGain = scriptCalculateExpGain(server) * threads;
                if (growthPercentage == 1) {
                    expGain = 0;
                }
                workerScript.scriptRef.log("Available money on " + server.hostname + " grown by "
                                           + formatNumber(growthPercentage*100 - 100, 6) + "%. Gained " +
                                           formatNumber(expGain, 4) + " hacking exp (t=" + threads +")");
                workerScript.scriptRef.onlineExpGained += expGain;
                Player.gainHackingExp(expGain);
                return Promise.resolve(growthPercentage);
            });
        },
        weaken : function(ip){
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
            workerScript.scriptRef.log("Executing weaken() on server " + server.hostname + " in " +
                                       formatNumber(weakenTime/1000, 3) + " seconds (t=" + threads + ")");
            return netscriptDelay(weakenTime, workerScript).then(function() {
                if (workerScript.env.stopFlag) {return Promise.reject(workerScript);}
                server.weaken(CONSTANTS.ServerWeakenAmount * threads);
                workerScript.scriptRef.recordWeaken(server.ip, threads);
                var expGain = scriptCalculateExpGain(server) * threads;
                workerScript.scriptRef.log("Server security level on " + server.hostname + " weakened to " + server.hackDifficulty +
                                           ". Gained " + formatNumber(expGain, 4) + " hacking exp (t=" + threads + ")");
                workerScript.scriptRef.onlineExpGained += expGain;
                Player.gainHackingExp(expGain);
                return Promise.resolve(CONSTANTS.ServerWeakenAmount * threads);
            });
        },
        print : function(args){
            if (args === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "print() call has incorrect number of arguments. Takes 1 argument");
            }
            workerScript.scriptRef.log(args.toString());
        },
        tprint : function(args) {
            if (args === undefined || args === null) {
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
            workerScript.scriptRef.clearLog();
        },
        nuke : function(ip){
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
                workerScript.scriptRef.log("Already have root access to " + server.hostname);
            } else {
                server.hasAdminRights = true;
                workerScript.scriptRef.log("Executed NUKE.exe virus on " + server.hostname + " to gain root access");
            }
            return true;
        },
        brutessh : function(ip){
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
                workerScript.scriptRef.log("Executed BruteSSH.exe on " + server.hostname + " to open SSH port (22)");
                server.sshPortOpen = true;
                ++server.openPortCount;
            } else {
                workerScript.scriptRef.log("SSH Port (22) already opened on " + server.hostname);
            }
            return true;
        },
        ftpcrack : function(ip){
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
                workerScript.scriptRef.log("Executed FTPCrack.exe on " + server.hostname + " to open FTP port (21)");
                server.ftpPortOpen = true;
                ++server.openPortCount;
            } else {
                workerScript.scriptRef.log("FTP Port (21) already opened on " + server.hostname);
            }
            return true;
        },
        relaysmtp : function(ip){
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
                workerScript.scriptRef.log("Executed relaySMTP.exe on " + server.hostname + " to open SMTP port (25)");
                server.smtpPortOpen = true;
                ++server.openPortCount;
            } else {
                workerScript.scriptRef.log("SMTP Port (25) already opened on " + server.hostname);
            }
            return true;
        },
        httpworm : function(ip){
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
                workerScript.scriptRef.log("Executed HTTPWorm.exe on " + server.hostname + " to open HTTP port (80)");
                server.httpPortOpen = true;
                ++server.openPortCount;
            } else {
                workerScript.scriptRef.log("HTTP Port (80) already opened on " + server.hostname);
            }
            return true;
        },
        sqlinject : function(ip){
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
                workerScript.scriptRef.log("Executed SQLInject.exe on " + server.hostname + " to open SQL port (1433)");
                server.sqlPortOpen = true;
                ++server.openPortCount;
            } else {
                workerScript.scriptRef.log("SQL Port (1433) already opened on " + server.hostname);
            }
            return true;
        },
        run : function(scriptname,threads = 1){
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
        exec : function(scriptname,ip,threads = 1){
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
        kill : function(filename,ip){
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
                workerScript.scriptRef.log("Killing " + filename + " on " + server.hostname + " with args: " + printArray(argsForKillTarget) +  ". May take up to a few minutes for the scripts to die...");
                return true;
            } else {
                workerScript.scriptRef.log("kill() failed. No such script "+ filename + " on " + server.hostname + " with args: " + printArray(argsForKillTarget));
                return false;
            }
        },
        killall : function(ip){
            if (ip === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "killall() call has incorrect number of arguments. Takes 1 argument");
            }
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("killall() failed. Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "killall() failed. Invalid IP or hostname passed in: " + ip);
            }
            for (var i = server.runningScripts.length-1; i >= 0; --i) {
                killWorkerScript(server.runningScripts[i], server.ip);
            }
            workerScript.scriptRef.log("killall(): Killing all scripts on " + server.hostname + ". May take a few minutes for the scripts to die");
            return true;
        },
        scp : function(scriptname, ip){
            if (scriptname === undefined || ip === undefined || arguments.length != 2) {
                throw makeRuntimeRejectMsg(workerScript, "Error: scp() call has incorrect number of arguments. Takes 2 arguments");
            }
            var destServer = getServer(ip);
            if (destServer == null) {
                throw makeRuntimeRejectMsg(workerScript, "Error: Invalid hostname/ip passed into scp() command: " + ip);
            }
            if (!scriptname.endsWith(".lit") && !scriptname.endsWith(".script")) {
                throw makeRuntimeRejectMsg(workerScript, "Error: scp() only works for .script and .lit files");
            }

            var currServ = getServer(workerScript.serverIp);
            if (currServ == null) {
                throw makeRuntimeRejectMsg(workerScript, "Could not find server ip for this script. This is a bug please contact game developer");
            }

            //Scp for lit files
            if (scriptname.endsWith(".lit")) {
                var found = false;
                for (var i = 0; i < currServ.messages.length; ++i) {
                    if (!(currServ.messages[i] instanceof Message) && currServ.messages[i] == scriptname) {
                        found = true;
                    }
                }

                if (!found) {
                    workerScript.scriptRef.log(scriptname + " does not exist. scp() failed");
                    return false;
                }

                for (var i = 0; i < destServer.messages.length; ++i) {
                    if (destServer.messages[i] === scriptname) {
                        workerScript.scriptRef.log(scriptname + " copied over to " + destServer.hostname);
                        return true; //Already exists
                    }
                }
                destServer.messages.push(scriptname);
                workerScript.scriptRef.log(scriptname + " copied over to " + destServer.hostname);
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
                    workerScript.scriptRef.log("WARNING: " + scriptname + " already exists on " + destServer.hostname + " and it will be overwritten.");
                    workerScript.scriptRef.log(scriptname + " overwritten on " + destServer.hostname);
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
            workerScript.scriptRef.log(scriptname + " copied over to " + destServer.hostname);
            return true;
        },
        ls : function(ip, grep) {
            if (ip === undefined) {
                throw makeRuntimeRejectMsg(workerScript, "ls() failed because of invalid arguments. Usage: ls(ip/hostname, [grep filter])");
            }
            var server = getServer(ip);
            if (server === null) {
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

            //Sort the files alphabetically then print each
            allFiles.sort();
            return allFiles;
        },
        hasRootAccess : function(ip){
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
        getHostname : function(){
            var scriptServer = getServer(workerScript.serverIp);
            if (scriptServer == null) {
                throw makeRuntimeRejectMsg(workerScript, "Could not find server. This is a bug in the game. Report to game dev");
            }
            return scriptServer.hostname;
        },
        getHackingLevel : function(){
            Player.updateSkillLevels();
            workerScript.scriptRef.log("getHackingLevel() returned " + Player.hacking_skill);
            return Player.hacking_skill;
        },
        getServerMoneyAvailable : function(ip){
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("getServerMoneyAvailable() failed. Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "getServerMoneyAvailable() failed. Invalid IP or hostname passed in: " + ip);
            }
            if (server.hostname == "home") {
                //Return player's money
                workerScript.scriptRef.log("getServerMoneyAvailable('home') returned player's money: $" + formatNumber(Player.money.toNumber(), 2));
                return Player.money.toNumber();
            }
            workerScript.scriptRef.log("getServerMoneyAvailable() returned " + formatNumber(server.moneyAvailable, 2) + " for " + server.hostname);
            return server.moneyAvailable;
        },
        getServerSecurityLevel : function(ip){
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("getServerSecurityLevel() failed. Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "getServerSecurityLevel() failed. Invalid IP or hostname passed in: " + ip);
            }
            workerScript.scriptRef.log("getServerSecurityLevel() returned " + formatNumber(server.hackDifficulty, 3) + " for " + server.hostname);
            return server.hackDifficulty;
        },
        getServerBaseSecurityLevel : function(ip){
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("getServerBaseSecurityLevel() failed. Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "getServerBaseSecurityLevel() failed. Invalid IP or hostname passed in: " + ip);
            }
            workerScript.scriptRef.log("getServerBaseSecurityLevel() returned " + formatNumber(server.baseDifficulty, 3) + " for " + server.hostname);
            return server.baseDifficulty;
        },
        getServerRequiredHackingLevel : function(ip){
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("getServerRequiredHackingLevel() failed. Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "getServerRequiredHackingLevel() failed. Invalid IP or hostname passed in: " + ip);
            }
            workerScript.scriptRef.log("getServerRequiredHackingLevel returned " + formatNumber(server.requiredHackingSkill, 0) + " for " + server.hostname);
            return server.requiredHackingSkill;
        },
        getServerMaxMoney : function(ip){
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("getServerMaxMoney() failed. Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "getServerMaxMoney() failed. Invalid IP or hostname passed in: " + ip);
            }
            workerScript.scriptRef.log("getServerMaxMoney() returned " + formatNumber(server.moneyMax, 0) + " for " + server.hostname);
            return server.moneyMax;
        },
        getServerGrowth : function(ip) {
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("getServerGrowth() failed. Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "getServerGrowth() failed. Invalid IP or hostname passed in: " + ip);
            }
            workerScript.scriptRef.log("getServerGrowth() returned " + formatNumber(server.serverGrowth, 0) + " for " + server.hostname);
            return server.serverGrowth;
        },
        getServerNumPortsRequired : function(ip){
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("getServerNumPortsRequired() failed. Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "getServerNumPortsRequired() failed. Invalid IP or hostname passed in: " + ip);
            }
            workerScript.scriptRef.log("getServerNumPortsRequired() returned " + formatNumber(server.numOpenPortsRequired, 0) + " for " + server.hostname);
            return server.numOpenPortsRequired;
        },
        getServerRam : function(ip) {
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("getServerRam() failed. Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "getServerRam() failed. Invalid IP or hostname passed in: " + ip);
            }
            workerScript.scriptRef.log("getServerRam() returned [" + formatNumber(server.maxRam, 2) + "GB, " + formatNumber(server.ramUsed, 2) + "GB]");
            return [server.maxRam, server.ramUsed];
        },
        serverExists : function(ip) {
            return (getServer(ip) !== null);
        },
        fileExists : function(filename,ip=workerScript.serverIp){
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
            return false;
        },
        isRunning : function(filename,ip){
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
        getNextHacknetNodeCost : getCostOfNextHacknetNode,
        purchaseHacknetNode : purchaseHacknet,
        getStockPrice : function(symbol) {
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
            if (!Player.hasTixApiAccess) {
                throw makeRuntimeRejectMsg(workerScript, "You don't have TIX API Access! Cannot use getStockPosition()");
            }
            var stock = SymbolToStockMap[symbol];
            if (stock == null) {
                throw makeRuntimeRejectMsg(workerScript, "Invalid stock symbol passed into getStockPrice()");
            }
            return [stock.playerShares, stock.playerAvgPx];
        },
        buyStock : function(symbol, shares) {
            if (!Player.hasTixApiAccess) {
                throw makeRuntimeRejectMsg(workerScript, "You don't have TIX API Access! Cannot use buyStock()");
            }
            var stock = SymbolToStockMap[symbol];
            if (stock == null) {
                throw makeRuntimeRejectMsg(workerScript, "Invalid stock symbol passed into getStockPrice()");
            }
            if (shares == 0) {return false;}
            if (stock == null || shares < 0 || isNaN(shares)) {
                workerScript.scriptRef.log("Error: Invalid 'shares' argument passed to buyStock()");
                return false;
            }
            shares = Math.round(shares);

            var totalPrice = stock.price * shares;
            if (Player.money.lt(totalPrice + CONSTANTS.StockMarketCommission)) {
                workerScript.scriptRef.log("Not enough money to purchase " + formatNumber(shares, 0) + " shares of " +
                                           symbol + ". Need $" +
                                           formatNumber(totalPrice + CONSTANTS.StockMarketCommission, 2).toString());
                return false;
            }

            var origTotal = stock.playerShares * stock.playerAvgPx;
            Player.loseMoney(totalPrice + CONSTANTS.StockMarketCommission);
            var newTotal = origTotal + totalPrice;
            stock.playerShares += shares;
            stock.playerAvgPx = newTotal / stock.playerShares;
            if (Engine.currentPage == Engine.Page.StockMarket) {
                updateStockPlayerPosition(stock);
            }
            workerScript.scriptRef.log("Bought " + formatNumber(shares, 0) + " shares of " + stock.symbol + " at $" +
                                       formatNumber(stock.price, 2) + " per share");
            return true;
        },
        sellStock : function(symbol, shares) {
            if (!Player.hasTixApiAccess) {
                throw makeRuntimeRejectMsg(workerScript, "You don't have TIX API Access! Cannot use sellStock()");
            }
            var stock = SymbolToStockMap[symbol];
            if (stock == null) {
                throw makeRuntimeRejectMsg(workerScript, "Invalid stock symbol passed into getStockPrice()");
            }
            if (shares == 0) {return false;}
            if (stock == null || shares < 0 || isNaN(shares)) {
                workerScript.scriptRef.log("Error: Invalid 'shares' argument passed to sellStock()");
                return false;
            }
            if (shares > stock.playerShares) {shares = stock.playerShares;}
            if (shares == 0) {return false;}
            var gains = stock.price * shares - CONSTANTS.StockMarketCommission;
            Player.gainMoney(gains);

            //Calculate net profit and add to script stats
            var netProfit = ((stock.price - stock.playerAvgPx) * shares) - CONSTANTS.StockMarketCommission;
            if (isNaN(netProfit)) {netProfit = 0;}
            workerScript.scriptRef.onlineMoneyMade += netProfit;

            stock.playerShares -= shares;
            if (stock.playerShares == 0) {
                stock.playerAvgPx = 0;
            }
            if (Engine.currentPage == Engine.Page.StockMarket) {
                updateStockPlayerPosition(stock);
            }
            workerScript.scriptRef.log("Sold " + formatNumber(shares, 0) + " shares of " + stock.symbol + " at $" +
                                       formatNumber(stock.price, 2) + " per share. Gained " +
                                       "$" + formatNumber(gains, 2));
            return true;
        },
        purchaseServer : function(hostname, ram) {
            var hostnameStr = String(hostname);
            hostnameStr = hostnameStr.replace(/\s\s+/g, '');
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
            workerScript.scriptRef.log("Purchased new server with hostname " + newServ.hostname + " for $" + formatNumber(cost, 2));
            return newServ.hostname;
        },
        deleteServer : function(hostname) {
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
                    workerScript.scriptRef.log("Deleted server " + hostnameStr);
                    return true;
                }
            }
            //Wasn't found on home computer
            workerScript.scriptRef.log("Error: Could not find server " + server.hostname +
                                       "as a purchased server. This is likely a bug please contact game dev");
            return false;
        },
        round : function(n) {
            if (isNaN(n)) {return 0;}
            return Math.round(n);
        },
        write : function(port, data="") {
            if (!isNaN(port)) {
                //Port 1-10
                if (port < 1 || port > 10) {
                    throw makeRuntimeRejectMsg(workerScript, "Trying to write to invalid port: " + port + ". Only ports 1-10 are valid.");
                }
                var portName = "Port" + String(port);
                var port = NetscriptPorts[portName];
                if (port == null) {
                    throw makeRuntimeRejectMsg(workerScript, "Could not find port: " + port + ". This is a bug contact the game developer");
                }
                port.push(data);
                if (port.length > Settings.MaxPortCapacity) {
                    port.shift();
                    return true;
                }
                return false;
            } else {
                throw makeRuntimeRejectMsg(workerScript, "Invalid argument passed in for port: " + port + ". Must be a number between 1 and 10");
            }
        },
        read : function(port) {
            if (!isNaN(port)) {
                //Port 1-10
                if (port < 1 || port > 10) {
                    throw makeRuntimeRejectMsg(workerScript, "Trying to write to invalid port: " + port + ". Only ports 1-10 are valid.");
                }
                var portName = "Port" + String(port);
                var port = NetscriptPorts[portName];
                if (port == null) {
                    throw makeRuntimeRejectMsg(workerScript, "Could not find port: " + port + ". This is a bug contact the game developer");
                }
                if (port.length == 0) {
                    return "NULL PORT DATA";
                } else {
                    return port.shift();
                }
            } else {
                throw makeRuntimeRejectMsg(workerScript, "Invalid argument passed in for port: " + port + ". Must be a number between 1 and 10");
            }
        },
        scriptRunning : function(scriptname, ip) {
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
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("getHackTime() failed. Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "getHackTime() failed. Invalid IP or hostname passed in: " + ip);
            }
            return scriptCalculateHackingTime(server); //Returns seconds
        },
        getGrowTime : function(ip) {
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("getGrowTime() failed. Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "getGrowTime() failed. Invalid IP or hostname passed in: " + ip);
            }
            return scriptCalculateGrowTime(server) / 1000; //Returns seconds
        },
        getWeakenTime : function(ip) {
            var server = getServer(ip);
            if (server == null) {
                workerScript.scriptRef.log("getWeakenTime() failed. Invalid IP or hostname passed in: " + ip);
                throw makeRuntimeRejectMsg(workerScript, "getWeakenTime() failed. Invalid IP or hostname passed in: " + ip);
            }
            return scriptCalculateWeakenTime(server) / 1000; //Returns seconds
        },
        getScriptIncome : function(scriptname, ip) {
            if (arguments.length === 0) {
                //Get total script income
                return updateActiveScriptsItems();
            } else {
                //Get income for a particular script
                var server = getServer(ip);
                if (server === null) {
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
            if (arguments.length === 0) {
                var total = 0;
                for (var i = 0; i < workerScripts.length; ++i) {
                    total += (workerScripts[i].scriptRef.onlineExpGained / workerScripts[i].scriptRef.onlineRunningTime);
                }
                return total;
            } else {
                //Get income for a particular script
                var server = getServer(ip);
                if (server === null) {
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

        /* Singularity Functions */
        universityCourse(universityName, className) {
            if (Player.bitNodeN != 4) {
                if (!(hasSingularitySF && singularitySFLvl >= 1)) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run universityCourse(). It is a Singularity Function and requires SourceFile-4 (level 1) to run.");
                    return false;
                }
            }
            if (Player.isWorking) {
                var txt = Player.singularityStopWork();
                workerScript.scriptRef.log(txt);
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
            workerScript.scriptRef.log("Started " + task + " at " + universityName);
            return true;
        },

        gymWorkout(gymName, stat) {
            if (Player.bitNodeN != 4) {
                if (!(hasSingularitySF && singularitySFLvl >= 1)) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run gymWorkout(). It is a Singularity Function and requires SourceFile-4 (level 1) to run.");
                    return false;
                }
            }
            if (Player.isWorking) {
                var txt = Player.singularityStopWork();
                workerScript.scriptRef.log(txt);
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
            workerScript.scriptRef.log("Started training " + stat + " at " + gymName);
            return true;
        },

        travelToCity(cityname) {
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
                    workerScript.scriptRef.log("Traveled to " + cityname);
                    return true;
                default:
                    workerScript.scriptRef.log("ERROR: Invalid city name passed into travelToCity().");
                    return false;
            }
        },

        purchaseTor() {
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
            workerScript.scriptRef.log("You have purchased a Tor router!");
            return true;
        },
        purchaseProgram(programName) {
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
                        workerScript.scriptRef.log("You have purchased the BruteSSH.exe program. The new program " +
                             "can be found on your home computer.");
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
                        workerScript.scriptRef.log("You have purchased the FTPCrack.exe program. The new program " +
                             "can be found on your home computer.");
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
                        workerScript.scriptRef.log("You have purchased the relaySMTP.exe program. The new program " +
                             "can be found on your home computer.");
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
                        workerScript.scriptRef.log("You have purchased the HTTPWorm.exe program. The new program " +
                             "can be found on your home computer.");
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
                        workerScript.scriptRef.log("You have purchased the SQLInject.exe program. The new program " +
                             "can be found on your home computer.");
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
                        workerScript.scriptRef.log("You have purchased the DeepscanV1.exe program. The new program " +
                             "can be found on your home computer.");
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
                        workerScript.scriptRef.log("You have purchased the DeepscanV2.exe program. The new program " +
                             "can be found on your home computer.");
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
        upgradeHomeRam() {
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

            workerScript.scriptRef.log("Purchased additional RAM for home computer! It now has " + homeComputer.maxRam + "GB of RAM.");
            return true;
        },
        getUpgradeHomeRamCost() {
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
        workForCompany() {
            if (Player.bitNodeN != 4) {
                if (!(hasSingularitySF && singularitySFLvl >= 2)) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run workForCompany(). It is a Singularity Function and requires SourceFile-4 (level 2) to run.");
                    return false;
                }
            }

            if (Player.companyPosition == "" || !(Player.companyPosition instanceof CompanyPosition)) {
                workerScript.scriptRef.log("ERROR: workForCompany() failed because you do not have a job");
                return false;
            }

            if (Player.isWorking) {
                var txt = Player.singularityStopWork();
                workerScript.scriptRef.log(txt);
            }

            if (Player.companyPosition.isPartTimeJob()) {
                Player.startWorkPartTime();
            } else {
                Player.startWork();
            }
            workerScript.scriptRef.log("Began working at " + Player.companyName + " as a " + Player.companyPosition.positionName);
            return true;
        },
        applyToCompany(companyName, field) {
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
                workerScript.scriptRef.log("You were offered a new job at " + companyName + " as a " + Player.companyPosition.positionName);
            } else {
                workerScript.scriptRef.log("You failed to get a new job/promotion at " + companyName + " in the " + field + " field.");
            }
            return res;
        },
        getCompanyRep(companyName) {
            if (Player.bitNodeN != 4) {
                if (!(hasSingularitySF && singularitySFLvl >= 2)) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run getCompanyRep(). It is a Singularity Function and requires SourceFile-4 (level 2) to run.");
                    return false;
                }
            }

            var company = Companies[companyName];
            if (company === null || !(company instanceof Company)) {
                workerScript.scriptRef.log("ERROR: Invalid companyName passed into getCompanyRep(): " + companyName);
                return -1;
            }
            return company.playerReputation;
        },
        checkFactionInvitations() {
            if (Player.bitNodeN != 4) {
                if (!(hasSingularitySF && singularitySFLvl >= 2)) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run checkFactionInvitations(). It is a Singularity Function and requires SourceFile-4 (level 2) to run.");
                    return false;
                }
            }
            //Make a copy of Player.factionInvitations
            return Player.factionInvitations.slice();
        },
        joinFaction(name) {
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
            workerScript.scriptRef.log("Joined the " + name + " faction.");
            return true;
        },
        workForFaction(name, type) {
            if (Player.bitNodeN != 4) {
                if (!(hasSingularitySF && singularitySFLvl >= 2)) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run workForFaction(). It is a Singularity Function and requires SourceFile-4 (level 2) to run.");
                    return false;
                }
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
                workerScript.scriptRef.log(txt);
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
        getFactionRep(name) {
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
        createProgram(name) {
            if (Player.bitNodeN != 4) {
                if (!(hasSingularitySF && singularitySFLvl >= 3)) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run createProgram(). It is a Singularity Function and requires SourceFile-4 (level 3) to run.");
                    return false;
                }
            }

            if (Player.isWorking) {
                var txt = Player.singularityStopWork();
                workerScript.scriptRef.log(txt);
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
        getAugmentationCost(name) {
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
        purchaseAugmentation(faction, name) {
            if (Player.bitNodeN != 4) {
                if (!(hasSingularitySF && singularitySFLvl >= 3)) {
                    throw makeRuntimeRejectMsg(workerScript, "Cannot run purchaseAugmentation(). It is a Singularity Function and requires SourceFile-4 (level 3) to run.");
                    return false;
                }
            }

            var fac = Factions[faction];
            if (fac === null || !(fac instanceof Faction)) {
                workerScript.scriptRef.log("ERROR: purchaseAugmentation() failed because of invalid faction name: " + faction);
                return false;
            }

            if (!fac.augmentations.includes(name)) {
                workerScript.scriptRef.log("ERROR: purchaseAugmentation() failed because the faction " + faction + " does not contain the " + name + " augmentation");
                return false;
            }

            var aug = Augmentations[name];
            if (aug === null || !(aug instanceof Augmentation)) {
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
                return true;
            } else {
                return false;
            }
        },
        installAugmentations() {
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
            workerScript.scriptRef.log("Installing Augmentations. This will cause this script to be killed");
            installAugmentations();
            return true;
        }
    }
}

export {NetscriptFunctions, initSingularitySFFlags, hasSingularitySF};
