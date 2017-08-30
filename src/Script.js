import {CONSTANTS}                              from "./Constants.js";
import {Engine}                                 from "./engine.js";
import {iTutorialSteps, iTutorialNextStep,
        iTutorialIsRunning, currITutorialStep}  from "./InteractiveTutorial.js";
import {addWorkerScript, killWorkerScript}      from "./NetscriptWorker.js";
import {Player}                                 from "./Player.js";
import {AllServers, processSingleServerGrowth}  from "./Server.js";
import {Settings}                               from "./Settings.js";

import {dialogBoxCreate}                        from "../utils/DialogBox.js";
import {Reviver, Generic_toJSON,
        Generic_fromJSON}                       from "../utils/JSONReviver.js";
import {compareArrays}                          from "../utils/HelperFunctions.js";
import {formatNumber, numOccurrences,
        numNetscriptOperators}                  from "../utils/StringHelperFunctions.js";

function scriptEditorInit() {
    //Initialize save and close button
    var closeButton = document.getElementById("script-editor-save-and-close-button");

    closeButton.addEventListener("click", function() {
        saveAndCloseScriptEditor();
        return false;
    });

    //Allow tabs (four spaces) in all textareas
    var textareas = document.getElementsByTagName('textarea');
    var count = textareas.length;
    for(var i=0;i<count;i++){
        textareas[i].onkeydown = function(e){
            if(e.keyCode==9 || e.which==9){
                e.preventDefault();
                var start = this.selectionStart;
                var end = this.selectionEnd;

                //Set textarea value to: text before caret + four spaces + text after caret
                let spaces = "    ";
                this.value = this.value.substring(0, start) + spaces + this.value.substring(end);

                //Put caret at after the four spaces
                this.selectionStart = this.selectionEnd = start + spaces.length;
            }
        }
    }
};
document.addEventListener("DOMContentLoaded", scriptEditorInit, false);

//Updates line number and RAM usage in script
function updateScriptEditorContent() {
    var txt = $("#script-editor-text")[0];
    var lineNum = txt.value.substr(0, txt.selectionStart).split("\n").length;

    var code = document.getElementById("script-editor-text").value;
    var codeCopy = code.repeat(1);
    var ramUsage = calculateRamUsage(codeCopy);
    document.getElementById("script-editor-status-text").innerText =
        "Line Number: " + lineNum + ", RAM: " + formatNumber(ramUsage, 2).toString() + "GB";
}

//Define key commands in script editor (ctrl o to save + close, etc.)
$(document).keydown(function(e) {
	if (Engine.currentPage == Engine.Page.ScriptEditor) {
		//Ctrl + b
        if (e.keyCode == 66 && e.ctrlKey) {
            e.preventDefault();
			saveAndCloseScriptEditor();
        }
	}
});

function saveAndCloseScriptEditor() {
    var filename = document.getElementById("script-editor-filename").value;
    if (iTutorialIsRunning && currITutorialStep == iTutorialSteps.TerminalTypeScript) {
        if (filename != "foodnstuff") {
            dialogBoxCreate("Leave the script name as 'foodnstuff'!");
            return;
        }
        var code = document.getElementById("script-editor-text").value;
        code = code.replace(/\s/g, "");
        if (code.indexOf("while(true){hack('foodnstuff');}") == -1) {
            dialogBoxCreate("Please copy and paste the code from the tutorial!");
            return;
        }
        iTutorialNextStep();
    }

    if (filename == "") {
        dialogBoxCreate("You must specify a filename!");
        return;
    }

    if (checkValidFilename(filename) == false) {
        dialogBoxCreate("Script filename can contain only alphanumerics, hyphens, and underscores");
        return;
    }

    filename += ".script";

    //If the current script already exists on the server, overwrite it
    for (var i = 0; i < Player.getCurrentServer().scripts.length; i++) {
        if (filename == Player.getCurrentServer().scripts[i].filename) {
            Player.getCurrentServer().scripts[i].saveScript();
            Engine.loadTerminalContent();
            return;
        }
    }

    //If the current script does NOT exist, create a new one
    var script = new Script();
    script.saveScript();
    Player.getCurrentServer().scripts.push(script);
    Engine.loadTerminalContent();
}

//Checks that the string contains only valid characters for a filename, which are alphanumeric,
// underscores and hyphens
function checkValidFilename(filename) {
	var regex = /^[a-zA-Z0-9_-]+$/;

	if (filename.match(regex)) {
		return true;
	}
	return false;
}

function Script() {
	this.filename 	= "";
    this.code       = "";
    this.ramUsage   = 0;
	this.server 	= "";	//IP of server this script is on
};

//Get the script data from the Script Editor and save it to the object
Script.prototype.saveScript = function() {
	if (Engine.currentPage == Engine.Page.ScriptEditor) {
		//Update code and filename
		var code = document.getElementById("script-editor-text").value;
		this.code = code.replace(/^\s+|\s+$/g, '');

		var filename = document.getElementById("script-editor-filename").value + ".script";
		this.filename = filename;

		//Server
		this.server = Player.currentServer;

		//Calculate/update ram usage, execution time, etc.
		this.updateRamUsage();
	}
}

//Updates how much RAM the script uses when it is running.
Script.prototype.updateRamUsage = function() {
    var codeCopy = this.code.repeat(1);
    this.ramUsage = calculateRamUsage(codeCopy);
    console.log("ram usage: " + this.ramUsage);
    if (isNaN(this.ramUsage)) {
        dialogBoxCreate("ERROR in calculating ram usage. This is a bug, please report to game develoepr");
    }
}

function calculateRamUsage(codeCopy) {
    codeCopy = codeCopy.replace(/\s/g,''); //Remove all whitespace
    var baseRam = 1.4;
    var whileCount = numOccurrences(codeCopy, "while(");
    var forCount = numOccurrences(codeCopy, "for(");
    var ifCount = numOccurrences(codeCopy, "if(");
    var hackCount = numOccurrences(codeCopy, "hack(");
    var growCount = numOccurrences(codeCopy, "grow(");
    var weakenCount = numOccurrences(codeCopy, "weaken(");
    var scanCount = numOccurrences(codeCopy, "scan(");
    var nukeCount = numOccurrences(codeCopy, "nuke(");
    var brutesshCount = numOccurrences(codeCopy, "brutessh(");
    var ftpcrackCount = numOccurrences(codeCopy, "ftpcrack(");
    var relaysmtpCount = numOccurrences(codeCopy, "relaysmtp(");
    var httpwormCount = numOccurrences(codeCopy, "httpworm(");
    var sqlinjectCount = numOccurrences(codeCopy, "sqlinject(");
    var runCount = numOccurrences(codeCopy, "run(");
    var execCount = numOccurrences(codeCopy, "exec(");
    var killCount = numOccurrences(codeCopy, "kill(") + numOccurrences(codeCopy, "killall(");
    var scpCount = numOccurrences(codeCopy, "scp(");
    var hasRootAccessCount = numOccurrences(codeCopy, "hasRootAccess(");
    var getHostnameCount = numOccurrences(codeCopy, "getHostname(");
    var getHackingLevelCount = numOccurrences(codeCopy, "getHackingLevel(");
    var getServerCount = numOccurrences(codeCopy, "getServerMoneyAvailable(") +
                         numOccurrences(codeCopy, "getServerMaxMoney(") +
                         numOccurrences(codeCopy, "getServerSecurityLevel(") +
                         numOccurrences(codeCopy, "getServerBaseSecurityLevel(") +
                         numOccurrences(codeCopy, "getServerGrowth(") +
                         numOccurrences(codeCopy, "getServerRequiredHackingLevel(") +
                         numOccurrences(codeCopy, "getServerNumPortsRequired(") +
                         numOccurrences(codeCopy, "getServerRam(");
    var fileExistsCount = numOccurrences(codeCopy, "fileExists(");
    var isRunningCount = numOccurrences(codeCopy, "isRunning(");
    var numOperators = numNetscriptOperators(codeCopy);
    var purchaseHacknetCount = numOccurrences(codeCopy, "purchaseHacknetNode(");
    var hacknetnodesArrayCount = numOccurrences(codeCopy, "hacknetnodes[");
    var hnUpgLevelCount = numOccurrences(codeCopy, ".upgradeLevel(");
    var hnUpgRamCount = numOccurrences(codeCopy, ".upgradeRam()");
    var hnUpgCoreCount = numOccurrences(codeCopy, ".upgradeCore()");
    var scriptGetStockCount = numOccurrences(codeCopy, "getStockPrice(") +
                              numOccurrences(codeCopy, "getStockPosition(");
    var scriptBuySellStockCount = numOccurrences(codeCopy, "buyStock(") +
                                  numOccurrences(codeCopy, "sellStock(");
    var scriptPurchaseServerCount = numOccurrences(codeCopy, "purchaseServer(") +
                                    numOccurrences(codeCopy, "deleteServer(");
    var scriptRoundCount = numOccurrences(codeCopy, "round(");
    var scriptWriteCount = numOccurrences(codeCopy, "write(");
    var scriptReadCount = numOccurrences(codeCopy, "read(");
    var arbScriptCount = numOccurrences(codeCopy, "scriptRunning(") +
                         numOccurrences(codeCopy, "scriptKill(");
    var getScriptCount = numOccurrences(codeCopy, "getScriptRam(");
    var getHackTimeCount = numOccurrences(codeCopy, "getHackTime(") +
                           numOccurrences(codeCopy, "getGrowTime(") +
                           numOccurrences(codeCopy, "getWeakenTime(");
    var singFn1Count = numOccurrences(codeCopy, "universityCourse(") +
                       numOccurrences(codeCopy, "gymWorkout(") +
                       numOccurrences(codeCopy, "travelToCity(") +
                       numOccurrences(codeCopy, "purchaseTor(") +
                       numOccurrences(codeCopy, "purchaseProgram(");
    var singFn2Count = numOccurrences(codeCopy, "upgradeHomeRam(") +
                       numOccurrences(codeCopy, "getUpgradeHomeRamCost(") +
                       numOccurrences(codeCopy, "workForCompany(") +
                       numOccurrences(codeCopy, "applyToCompany(") +
                       numOccurrences(codeCopy, "getCompanyRep(") +
                       numOccurrences(codeCopy, "checkFactionInvitations(") +
                       numOccurrences(codeCopy, "joinFaction(") +
                       numOccurrences(codeCopy, "workForFaction(") +
                       numOccurrences(codeCopy, "getFactionRep(");
    var singFn3Count = numOccurrences(codeCopy, "createProgram(") +
                       numOccurrences(codeCopy, "getAugmentationCost(") +
                       numOccurrences(codeCopy, "purchaseAugmentation(") +
                       numOccurrences(codeCopy, "installAugmentations(");

    if (Player.bitNodeN != 4) {
        singFn1Count *= 10;
        singFn2Count *= 10;
        singFn3Count *= 10;
    }

    return baseRam +
        ((whileCount * CONSTANTS.ScriptWhileRamCost) +
        (forCount * CONSTANTS.ScriptForRamCost) +
        (ifCount * CONSTANTS.ScriptIfRamCost) +
        (hackCount * CONSTANTS.ScriptHackRamCost) +
        (growCount * CONSTANTS.ScriptGrowRamCost) +
        (weakenCount * CONSTANTS.ScriptWeakenRamCost) +
        (scanCount * CONSTANTS.ScriptScanRamCost) +
        (nukeCount * CONSTANTS.ScriptNukeRamCost) +
        (brutesshCount * CONSTANTS.ScriptBrutesshRamCost) +
        (ftpcrackCount * CONSTANTS.ScriptFtpcrackRamCost) +
        (relaysmtpCount * CONSTANTS.ScriptRelaysmtpRamCost) +
        (httpwormCount * CONSTANTS.ScriptHttpwormRamCost) +
        (sqlinjectCount * CONSTANTS.ScriptSqlinjectRamCost) +
        (runCount * CONSTANTS.ScriptRunRamCost) +
        (execCount * CONSTANTS.ScriptExecRamCost) +
        (killCount * CONSTANTS.ScriptKillRamCost) +
        (scpCount * CONSTANTS.ScriptScpRamCost) +
        (hasRootAccessCount * CONSTANTS.ScriptHasRootAccessRamCost) +
        (getHostnameCount * CONSTANTS.ScriptGetHostnameRamCost) +
        (getHackingLevelCount * CONSTANTS.ScriptGetHackingLevelRamCost) +
        (getServerCount * CONSTANTS.ScriptGetServerCost) +
        (fileExistsCount * CONSTANTS.ScriptFileExistsRamCost) +
        (isRunningCount * CONSTANTS.ScriptIsRunningRamCost) +
        (numOperators * CONSTANTS.ScriptOperatorRamCost) +
        (purchaseHacknetCount * CONSTANTS.ScriptPurchaseHacknetRamCost) +
        (hacknetnodesArrayCount * CONSTANTS.ScriptHacknetNodesRamCost) +
        (hnUpgLevelCount * CONSTANTS.ScriptHNUpgLevelRamCost) +
        (hnUpgRamCount * CONSTANTS.ScriptHNUpgRamRamCost) +
        (hnUpgCoreCount * CONSTANTS.ScriptHNUpgCoreRamCost) +
        (scriptGetStockCount * CONSTANTS.ScriptGetStockRamCost) +
        (scriptBuySellStockCount * CONSTANTS.ScriptBuySellStockRamCost) +
        (scriptPurchaseServerCount * CONSTANTS.ScriptPurchaseServerRamCost) +
        (scriptRoundCount * CONSTANTS.ScriptRoundRamCost) +
        (scriptWriteCount * CONSTANTS.ScriptReadWriteRamCost) +
        (scriptReadCount * CONSTANTS.ScriptReadWriteRamCost) +
        (arbScriptCount * CONSTANTS.ScriptArbScriptRamCost) +
        (getScriptCount * CONSTANTS.ScriptGetScriptRamCost) +
        (getHackTimeCount * CONSTANTS.ScriptGetHackTimeRamCost) +
        (singFn1Count * CONSTANTS.ScriptSingularityFn1RamCost) +
        (singFn2Count * CONSTANTS.ScriptSingularityFn2RamCost) +
        (singFn3Count * CONSTANTS.ScriptSingularityFn3RamCost));
}

Script.prototype.toJSON = function() {
    return Generic_toJSON("Script", this);
}


Script.fromJSON = function(value) {
    return Generic_fromJSON(Script, value.data);
}

Reviver.constructors.Script = Script;

//Called when the game is loaded. Loads all running scripts (from all servers)
//into worker scripts so that they will start running
function loadAllRunningScripts() {
	var count = 0;
    var total = 0;
	for (var property in AllServers) {
		if (AllServers.hasOwnProperty(property)) {
			var server = AllServers[property];

			//Reset each server's RAM usage to 0
			server.ramUsed = 0;

			for (var j = 0; j < server.runningScripts.length; ++j) {
				count++;
				addWorkerScript(server.runningScripts[j], server);

				//Offline production
				total += scriptCalculateOfflineProduction(server.runningScripts[j]);
			}
		}
	}
    return total;
	console.log("Loaded " + count.toString() + " running scripts");
}

function scriptCalculateOfflineProduction(runningScriptObj) {
	//The Player object stores the last update time from when we were online
	var thisUpdate = new Date().getTime();
	var lastUpdate = Player.lastUpdate;
	var timePassed = (thisUpdate - lastUpdate) / 1000;	//Seconds
	console.log("Offline for " + timePassed + " seconds");

	//Calculate the "confidence" rating of the script's true production. This is based
	//entirely off of time. We will arbitrarily say that if a script has been running for
	//4 hours (14400 sec) then we are completely confident in its ability
	var confidence = (runningScriptObj.onlineRunningTime) / 14400;
	if (confidence >= 1) {confidence = 1;}

    //Data map: [MoneyStolen, NumTimesHacked, NumTimesGrown, NumTimesWeaken]

    //Grow
    for (var ip in runningScriptObj.dataMap) {
        if (runningScriptObj.dataMap.hasOwnProperty(ip)) {
            if (runningScriptObj.dataMap[ip][2] == 0 || runningScriptObj.dataMap[ip][2] == null) {continue;}
            var serv = AllServers[ip];
            if (serv == null) {continue;}
            var timesGrown = Math.round(0.5 * runningScriptObj.dataMap[ip][2] / runningScriptObj.onlineRunningTime * timePassed);
            console.log(runningScriptObj.filename + " called grow() on " + serv.hostname + " " + timesGrown + " times while offline");
            runningScriptObj.log("Called grow() on " + serv.hostname + " " + timesGrown + " times while offline");
            var growth = processSingleServerGrowth(serv, timesGrown * 450);
            runningScriptObj.log(serv.hostname + " grown by " + formatNumber(growth * 100 - 100, 6) + "% from grow() calls made while offline");
        }
    }

    var totalOfflineProduction = 0;
    for (var ip in runningScriptObj.dataMap) {
        if (runningScriptObj.dataMap.hasOwnProperty(ip)) {
            if (runningScriptObj.dataMap[ip][0] == 0 || runningScriptObj.dataMap[ip][0] == null) {continue;}
            var serv = AllServers[ip];
            if (serv == null) {continue;}
            var production = 0.5 * runningScriptObj.dataMap[ip][0] / runningScriptObj.onlineRunningTime * timePassed;
            production *= confidence;
            if (production > serv.moneyAvailable) {
                production = serv.moneyAvailable;
            }
            totalOfflineProduction += production;
            Player.gainMoney(production);
            console.log(runningScriptObj.filename + " generated $" + production + " while offline by hacking " + serv.hostname);
            runningScriptObj.log(runningScriptObj.filename + " generated $" + production + " while offline by hacking " + serv.hostname);
            serv.moneyAvailable -= production;
            if (serv.moneyAvailable < 0) {serv.moneyAvailable = 0;}
            if (isNaN(serv.moneyAvailable)) {serv.moneyAvailable = 0;}
        }
    }

    //Offline EXP gain
	//A script's offline production will always be at most half of its online production.
	var expGain = 0.5 * (runningScriptObj.onlineExpGained / runningScriptObj.onlineRunningTime) * timePassed;
	expGain *= confidence;

	Player.gainHackingExp(expGain);

	//Update script stats
	runningScriptObj.offlineMoneyMade += totalOfflineProduction;
	runningScriptObj.offlineRunningTime += timePassed;
	runningScriptObj.offlineExpGained += expGain;

    //Fortify a server's security based on how many times it was hacked
    for (var ip in runningScriptObj.dataMap) {
        if (runningScriptObj.dataMap.hasOwnProperty(ip)) {
            if (runningScriptObj.dataMap[ip][1] == 0 || runningScriptObj.dataMap[ip][1] == null) {continue;}
            var serv = AllServers[ip];
            if (serv == null) {continue;}
            var timesHacked = Math.round(0.5 * runningScriptObj.dataMap[ip][1] / runningScriptObj.onlineRunningTime * timePassed);
            console.log(runningScriptObj.filename + " hacked " + serv.hostname + " " + timesHacked + " times while offline");
            runningScriptObj.log("Hacked " + serv.hostname + " " + timesHacked + " times while offline");
            serv.fortify(CONSTANTS.ServerFortifyAmount * timesHacked);
        }
    }

    //Weaken
    for (var ip in runningScriptObj.dataMap) {
        if (runningScriptObj.dataMap.hasOwnProperty(ip)) {
            if (runningScriptObj.dataMap[ip][3] == 0 || runningScriptObj.dataMap[ip][3] == null) {continue;}
            var serv = AllServers[ip];
            if (serv == null) {continue;}
            var timesWeakened = Math.round(0.5 * runningScriptObj.dataMap[ip][3] / runningScriptObj.onlineRunningTime * timePassed);
            console.log(runningScriptObj.filename + " called weaken() on " + serv.hostname + " " + timesWeakened + " times while offline");
            runningScriptObj.log("Called weaken() on " + serv.hostname + " " + timesWeakened + " times while offline");
            serv.weaken(CONSTANTS.ServerWeakenAmount * timesWeakened);
        }
    }

    return totalOfflineProduction;
}

//Returns a RunningScript object matching the filename and arguments on the
//designated server, and false otherwise
function findRunningScript(filename, args, server) {
    for (var i = 0; i < server.runningScripts.length; ++i) {
        if (server.runningScripts[i].filename == filename &&
            compareArrays(server.runningScripts[i].args, args)) {
            return server.runningScripts[i];
        }
    }
    return null;
}

function RunningScript(script, args) {
    if (script == null || script == undefined) {return;}
    this.filename   = script.filename;
    this.args       = args;
    this.scriptRef  = script;
    this.server     = script.server;    //IP Address only

    this.logs       = [];   //Script logging. Array of strings, with each element being a log entry

	//Stats to display on the Scripts menu, and used to determine offline progress
	this.offlineRunningTime  	= 0.01;	//Seconds
	this.offlineMoneyMade 		= 0;
	this.offlineExpGained 		= 0;
	this.onlineRunningTime 		= 0.01;	//Seconds
	this.onlineMoneyMade 		= 0;
	this.onlineExpGained 		= 0;

    this.threads                = 1;

    //[MoneyStolen, NumTimesHacked, NumTimesGrown, NumTimesWeaken]
    this.dataMap                = new AllServersMap([0, 0, 0, 0]);
}

RunningScript.prototype.reset = function() {
    this.scriptRef.updateRamUsage();

    this.offlineRunningTime  	= 0.01;	//Seconds
	this.offlineMoneyMade 		= 0;
	this.offlineExpGained 		= 0;
	this.onlineRunningTime 		= 0.01;	//Seconds
	this.onlineMoneyMade 		= 0;
	this.onlineExpGained 		= 0;
    this.logs = [];
}

RunningScript.prototype.log = function(txt) {
    if (this.logs.length > Settings.MaxLogCapacity) {
        //Delete first element and add new log entry to the end.
        //TODO Eventually it might be better to replace this with circular array
        //to improve performance
        this.logs.shift();
    }
    this.logs.push(txt);
}

RunningScript.prototype.displayLog = function() {
    for (var i = 0; i < this.logs.length; ++i) {
        post(this.logs[i]);
    }
}

RunningScript.prototype.clearLog = function() {
    this.logs.length = 0;
}

//Update the moneyStolen and numTimesHack maps when hacking
RunningScript.prototype.recordHack = function(serverIp, moneyGained, n=1) {
    if (this.dataMap == null) {
        //[MoneyStolen, NumTimesHacked, NumTimesGrown, NumTimesWeaken]
        this.dataMap = new AllServersMap([0, 0, 0, 0]);
    }
    this.dataMap[serverIp][0] += moneyGained;
    this.dataMap[serverIp][1] += n;
}

//Update the grow map when calling grow()
RunningScript.prototype.recordGrow = function(serverIp, n=1) {
    if (this.dataMap == null) {
        //[MoneyStolen, NumTimesHacked, NumTimesGrown, NumTimesWeaken]
        this.dataMap = new AllServersMap([0, 0, 0, 0]);
    }
    this.dataMap[serverIp][2] += n;
}

//Update the weaken map when calling weaken() {
RunningScript.prototype.recordWeaken = function(serverIp, n=1) {
    if (this.dataMap == null) {
        //[MoneyStolen, NumTimesHacked, NumTimesGrown, NumTimesWeaken]
        this.dataMap = new AllServersMap([0, 0, 0, 0]);
    }
    this.dataMap[serverIp][3] += n;
}

RunningScript.prototype.toJSON = function() {
    return Generic_toJSON("RunningScript", this);
}


RunningScript.fromJSON = function(value) {
    return Generic_fromJSON(RunningScript, value.data);
}

Reviver.constructors.RunningScript = RunningScript;

//Creates an object that creates a map/dictionary with the IP of each existing server as
//a key. Initializes every key with a specified value that can either by a number or an array
function AllServersMap(arr=false) {
    for (var ip in AllServers) {
        if (AllServers.hasOwnProperty(ip)) {
            if (arr) {
                this[ip] = [0, 0, 0, 0];
            } else {
                this[ip] = 0;
            }
        }
    }
}

AllServersMap.prototype.reset = function() {
    for (var ip in this) {
        if (this.hasOwnProperty(ip)) {
            this[ip] = 0;
        }
    }
}

AllServersMap.prototype.printConsole = function() {
    for (var ip in this) {
        if (this.hasOwnProperty(ip)) {
            var serv = AllServers[ip];
            if (serv == null) {
                console.log("Warning null server encountered with ip: " + ip);
                continue;
            }
        }
    }
}

AllServersMap.prototype.toJSON = function() {
    return Generic_toJSON("AllServersMap", this);
}


AllServersMap.fromJSON = function(value) {
    return Generic_fromJSON(AllServersMap, value.data);
}

Reviver.constructors.AllServersMap = AllServersMap;

export {updateScriptEditorContent, loadAllRunningScripts, findRunningScript,
        RunningScript, Script, AllServersMap};
