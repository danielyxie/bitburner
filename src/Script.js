var ace = require('brace');
require('brace/mode/javascript');
require('brace/mode/netscript');
require('brace/theme/chaos');
require('brace/theme/chrome');
require('brace/theme/monokai');
require('brace/theme/solarized_dark');
require('brace/theme/solarized_light');
require('brace/theme/terminal');
require('brace/theme/twilight');
require('brace/theme/xcode');
require("brace/keybinding/vim");
require("brace/keybinding/emacs");
require("brace/ext/language_tools");

import {CONSTANTS}                              from "./Constants.js";
import {Engine}                                 from "./engine.js";
import {iTutorialSteps, iTutorialNextStep,
        iTutorialIsRunning, currITutorialStep}  from "./InteractiveTutorial.js";
import {NetscriptFunctions}                     from "./NetscriptFunctions.js";
import {addWorkerScript, killWorkerScript,
        WorkerScript}                           from "./NetscriptWorker.js";
import {Player}                                 from "./Player.js";
import {AllServers, processSingleServerGrowth}  from "./Server.js";
import {Settings}                               from "./Settings.js";
import {post}                                   from "./Terminal.js";

import {parse, Node}                            from "../utils/acorn.js";
import {dialogBoxCreate}                        from "../utils/DialogBox.js";
import {Reviver, Generic_toJSON,
        Generic_fromJSON}                       from "../utils/JSONReviver.js";
import {compareArrays, createElement}           from "../utils/HelperFunctions.js";
import {formatNumber, numOccurrences,
        numNetscriptOperators}                  from "../utils/StringHelperFunctions.js";

var keybindings = {
    ace: null,
    vim: "ace/keyboard/vim",
    emacs: "ace/keyboard/emacs",
};

var scriptEditorRamCheck = null, scriptEditorRamText = null;
function scriptEditorInit() {
    //Create buttons at the bottom of script editor
    var wrapper = document.getElementById("script-editor-buttons-wrapper");
    if (wrapper == null) {
        console.log("Error finding 'script-editor-buttons-wrapper'");
        return;
    }
    var closeButton = createElement("a", {
        class:"a-link-button", display:"inline-block",
        innerText:"Save & Close (Ctrl + b)",
        clickListener:()=>{
            saveAndCloseScriptEditor();
            return false;
        }
    });

    scriptEditorRamText = createElement("p", {
        display:"inline-block", margin:"10px", id:"script-editor-status-text"
    });

    var checkboxLabel = createElement("label", {
        for:"script-editor-ram-check", margin:"4px", marginTop: "8px",
        innerText:"Dynamic RAM Usage Checker", color:"white",
        tooltip:"Enable/Disable the dynamic RAM Usage display. You may " +
                "want to disable it for very long scripts because there may be " +
                "performance issues"
    });

    scriptEditorRamCheck = createElement("input", {
        type:"checkbox", name:"script-editor-ram-check", id:"script-editor-ram-check",
        margin:"4px", marginTop: "8px",
    });
    scriptEditorRamCheck.checked = true;

    var documentationButton = createElement("a", {
        display:"inline-block", class:"a-link-button", innerText:"Netscript Documentation",
        href:"https://bitburner.wikia.com/wiki/Netscript",
        target:"_blank"
    });

    wrapper.appendChild(closeButton);
    wrapper.appendChild(scriptEditorRamText);
    wrapper.appendChild(scriptEditorRamCheck);
    wrapper.appendChild(checkboxLabel);
    wrapper.appendChild(documentationButton);

    //Initialize ACE Script editor
    var editor = ace.edit('javascript-editor');
    editor.getSession().setMode('ace/mode/netscript');
    editor.setTheme('ace/theme/monokai');
    document.getElementById('javascript-editor').style.fontSize='16px';
    editor.setOption("showPrintMargin", false);

    /* Script editor options */
    //Theme
    var themeDropdown = document.getElementById("script-editor-option-theme");
    themeDropdown.selectedIndex = 2;
    themeDropdown.onchange = function() {
        var val = themeDropdown.value;
        var themePath = "ace/theme/" + val.toLowerCase();
        editor.setTheme(themePath);
    };

    //Keybinding
    var keybindingDropdown = document.getElementById("script-editor-option-keybinding");
    keybindingDropdown.onchange = function() {
        var val = keybindingDropdown.value;
        editor.setKeyboardHandler(keybindings[val.toLowerCase()]);
    };

    //Highlight Active line
    var highlightActiveChkBox = document.getElementById("script-editor-option-highlightactiveline");
    highlightActiveChkBox.onchange = function() {
        editor.setHighlightActiveLine(highlightActiveChkBox.checked);
    };

    //Show Invisibles
    var showInvisiblesChkBox = document.getElementById("script-editor-option-showinvisibles");
    showInvisiblesChkBox.onchange = function() {
        editor.setShowInvisibles(showInvisiblesChkBox.checked);
    };

    //Use Soft Tab
    var softTabChkBox = document.getElementById("script-editor-option-usesofttab");
    softTabChkBox.onchange = function() {
        editor.getSession().setUseSoftTabs(softTabChkBox.checked);
    };

    //Configure some of the VIM keybindings
    ace.config.loadModule('ace/keyboard/vim', function(module) {
        var VimApi = module.CodeMirror.Vim;
        VimApi.defineEx('write', 'w', function(cm, input) {
            saveAndCloseScriptEditor();
        });
        VimApi.defineEx('quit', 'q', function(cm, input) {
            Engine.loadTerminalContent();
        });
        VimApi.defineEx('xwritequit', 'x', function(cm, input) {
            saveAndCloseScriptEditor();
        });
        VimApi.defineEx('wqwritequit', 'wq', function(cm, input) {
            saveAndCloseScriptEditor();
        });
    });

    //Function autocompleter
    editor.setOption("enableBasicAutocompletion", true);
    var autocompleter = {
        getCompletions: function(editor, session, pos, prefix, callback) {
            if (prefix.length === 0) {callback(null, []); return;}
            var words = [];
            var fns = NetscriptFunctions(null);
            for (var name in fns) {
                if (fns.hasOwnProperty(name)) {
                    words.push({
                                name: name,
                                value: name,
                               });
                }
            }
            callback(null, words);
        },
    }
    editor.completers = [autocompleter];
}
document.addEventListener("DOMContentLoaded", scriptEditorInit, false);

//Updates RAM usage in script
function updateScriptEditorContent() {
    if (scriptEditorRamCheck == null || !scriptEditorRamCheck.checked) {
        scriptEditorRamText.innerText = "N/A";
        return;
    }
    var editor = ace.edit('javascript-editor');
    var code = editor.getValue();
    var codeCopy = code.repeat(1);
    var ramUsage = calculateRamUsage(codeCopy);
    if (ramUsage !== -1) {
        scriptEditorRamText.innerText = "RAM: " + formatNumber(ramUsage, 2).toString() + "GB";
    }
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
        var editor = ace.edit('javascript-editor');
        var code = editor.getValue();
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
        var editor = ace.edit('javascript-editor');
        var code = editor.getValue();
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
    var res = calculateRamUsage(codeCopy);
    if (res !== -1) {
        this.ramUsage = res;
    }
}

function calculateRamUsage(codeCopy) {
    //Create a temporary/mock WorkerScript and an AST from the code
    var workerScript = new WorkerScript({
        filename:"foo",
        scriptRef: {code:""},
        args:[]
    });
    workerScript.checkingRam = true; //Netscript functions will return RAM usage

    try {
        var ast = parse(codeCopy);
    } catch(e) {
        console.log("returning -1 bc parsing error: " + e.toString());
        return -1;
    }

    //Search through AST, scanning for any 'Identifier' nodes for functions, or While/For/If nodes
    var queue = [], ramUsage = 1.4;
    var whileUsed = false, forUsed = false, ifUsed = false;
    queue.push(ast);
    while (queue.length != 0) {
        var exp = queue.shift();
        switch (exp.type) {
            case "BlockStatement":
            case "Program":
                for (var i = 0; i < exp.body.length; ++i) {
                    if (exp.body[i] instanceof Node) {
                        queue.push(exp.body[i]);
                    }
                }
                break;
            case "WhileStatement":
                if (!whileUsed) {
                    ramUsage += CONSTANTS.ScriptWhileRamCost;
                    whileUsed = true;
                }
                break;
            case "ForStatement":
                if (!forUsed) {
                    ramUsage += CONSTANTS.ScriptForRamCost;
                    forUsed = true;
                }
                break;
            case "IfStatement":
                if (!ifUsed) {
                    ramUsage += CONSTANTS.ScriptIfRamCost;
                    ifUsed = true;
                }
                break;
            case "Identifier":
                if (exp.name in workerScript.env.vars) {
                    var func = workerScript.env.get(exp.name);
                    if (typeof func === "function") {
                        try {
                            var res = func.apply(null, []);
                            if (!isNaN(res)) {ramUsage += res;}
                        } catch(e) {
                            console.log("ERROR applying function: " + e);
                        }
                    }
                }
                break;
            default:
                break;
        }

        for (var prop in exp) {
            if (exp.hasOwnProperty(prop)) {
                if (exp[prop] instanceof Node) {
                    queue.push(exp[prop]);
                }
            }
        }
    }
    return ramUsage;
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
    this.logUpd     = false;

	//Stats to display on the Scripts menu, and used to determine offline progress
	this.offlineRunningTime  	= 0.01;	//Seconds
	this.offlineMoneyMade 		= 0;
	this.offlineExpGained 		= 0;
	this.onlineRunningTime 		= 0.01;	//Seconds
	this.onlineMoneyMade 		= 0;
	this.onlineExpGained 		= 0;

    this.threads                = 1;

    //[MoneyStolen, NumTimesHacked, NumTimesGrown, NumTimesWeaken]
    this.dataMap                = new AllServersMap([0, 0, 0, 0], true);
}

RunningScript.prototype.log = function(txt) {
    if (this.logs.length > Settings.MaxLogCapacity) {
        //Delete first element and add new log entry to the end.
        //TODO Eventually it might be better to replace this with circular array
        //to improve performance
        this.logs.shift();
    }
    this.logs.push(txt);
    this.logUpd = true;
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
        this.dataMap = new AllServersMap([0, 0, 0, 0], true);
    }
    this.dataMap[serverIp][0] += moneyGained;
    this.dataMap[serverIp][1] += n;
}

//Update the grow map when calling grow()
RunningScript.prototype.recordGrow = function(serverIp, n=1) {
    if (this.dataMap == null) {
        //[MoneyStolen, NumTimesHacked, NumTimesGrown, NumTimesWeaken]
        this.dataMap = new AllServersMap([0, 0, 0, 0], true);
    }
    this.dataMap[serverIp][2] += n;
}

//Update the weaken map when calling weaken() {
RunningScript.prototype.recordWeaken = function(serverIp, n=1) {
    if (this.dataMap == null) {
        //[MoneyStolen, NumTimesHacked, NumTimesGrown, NumTimesWeaken]
        this.dataMap = new AllServersMap([0, 0, 0, 0], true);
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
function AllServersMap(arr=false, filterOwned=false) {
    for (var ip in AllServers) {
        if (AllServers.hasOwnProperty(ip)) {
            if (filterOwned && (AllServers[ip].purchasedByPlayer || AllServers[ip].hostname === "home")) {
                continue;
            }
            if (arr) {
                this[ip] = [0, 0, 0, 0];
            } else {
                this[ip] = 0;
            }
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
