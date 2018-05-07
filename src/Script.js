var ace = require('brace');
require('brace/mode/javascript');
require('../netscript');
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

// Importing this doesn't work for some reason.
const walk = require("acorn/dist/walk");

import {CONSTANTS}                              from "./Constants.js";
import {Engine}                                 from "./engine.js";
import {parseFconfSettings}                     from "./Fconf.js";
import {iTutorialSteps, iTutorialNextStep,
        iTutorialIsRunning, currITutorialStep}  from "./InteractiveTutorial.js";
import {evaluateImport}                         from "./NetscriptEvaluator.js";
import {NetscriptFunctions}                     from "./NetscriptFunctions.js";
import {addWorkerScript, killWorkerScript,
        WorkerScript}                           from "./NetscriptWorker.js";
import {Player}                                 from "./Player.js";
import {AllServers, processSingleServerGrowth}  from "./Server.js";
import {Settings}                               from "./Settings.js";
import {post}                                   from "./Terminal.js";
import {TextFile}                               from "./TextFile.js";

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

function isScriptFilename(f) {
    return f.endsWith(".js") || f.endsWith(".script");
}

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
        href:"https://bitburner.readthedocs.io/en/latest/index.html",
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
    if (Settings.EditorTheme) {
        var initialIndex = 2;
        for (var i = 0; i < themeDropdown.options.length; ++i) {
            if (themeDropdown.options[i].value === Settings.EditorTheme) {
                initialIndex = i;
                break;
            }
        }
        themeDropdown.selectedIndex = initialIndex;
    } else {
        themeDropdown.selectedIndex = 2;
    }

    themeDropdown.onchange = function() {
        var val = themeDropdown.value;
        Settings.EditorTheme = val;
        var themePath = "ace/theme/" + val.toLowerCase();
        editor.setTheme(themePath);
    };
    themeDropdown.onchange();

    //Keybinding
    var keybindingDropdown = document.getElementById("script-editor-option-keybinding");
    if (Settings.EditorKeybinding) {
        var initialIndex = 0;
        for (var i = 0; i < keybindingDropdown.options.length; ++i) {
            if (keybindingDropdown.options[i].value === Settings.EditorKeybinding) {
                initialIndex = i;
                break;
            }
        }
        keybindingDropdown.selectedIndex = initialIndex;
    } else {
        keybindingDropdown.selectedIndex = 0;
    }
    keybindingDropdown.onchange = function() {
        var val = keybindingDropdown.value;
        Settings.EditorKeybinding = val;
        editor.setKeyboardHandler(keybindings[val.toLowerCase()]);
    };
    keybindingDropdown.onchange();

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

    //Jshint Maxerr
    var maxerr = document.getElementById("script-editor-option-maxerr");
    var maxerrLabel = document.getElementById("script-editor-option-maxerror-value-label");
    maxerrLabel.innerHTML = maxerr.value;
    maxerr.onchange = function() {
        editor.getSession().$worker.send("changeOptions", [{maxerr:maxerr.value}]);
        maxerrLabel.innerHTML = maxerr.value;
    }

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

//Updates RAM usage in script
function updateScriptEditorContent() {
    var filename = document.getElementById("script-editor-filename").value;
    if (scriptEditorRamCheck == null || !scriptEditorRamCheck.checked || !isScriptFilename(filename)) {
        scriptEditorRamText.innerText = "N/A";
        return;
    }
    var editor = ace.edit('javascript-editor');
    var code = editor.getValue();
    var codeCopy = code.repeat(1);
    var ramUsage = calculateRamUsage(codeCopy);
    if (ramUsage !== -1) {
        scriptEditorRamText.innerText = "RAM: " + formatNumber(ramUsage, 2).toString() + "GB";
    } else {
        scriptEditorRamText.innerText = "RAM: Syntax Error";
    }
}

//Define key commands in script editor (ctrl o to save + close, etc.)
$(document).keydown(function(e) {
    if (Settings.DisableHotkeys === true) {return;}
	if (Engine.currentPage == Engine.Page.ScriptEditor) {
		//Ctrl + b
        if (e.keyCode == 66 && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
			saveAndCloseScriptEditor();
        }
	}
});

function saveAndCloseScriptEditor() {
    var filename = document.getElementById("script-editor-filename").value;
    var editor = ace.edit('javascript-editor');
    var code = editor.getValue();
    if (iTutorialIsRunning && currITutorialStep == iTutorialSteps.TerminalTypeScript) {
        if (filename != "foodnstuff.script") {
            dialogBoxCreate("Leave the script name as 'foodnstuff'!");
            return;
        }
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

    var s = Player.getCurrentServer();
    if (filename === ".fconf") {
        try {
            parseFconfSettings(code);
        } catch(e) {
            dialogBoxCreate("Invalid .fconf file");
            return;
        }
    } else if (isScriptFilename(filename)) {
        //If the current script already exists on the server, overwrite it
        for (var i = 0; i < s.scripts.length; i++) {
            if (filename == s.scripts[i].filename) {
                s.scripts[i].saveScript();
                Engine.loadTerminalContent();
                return;
            }
        }

        //If the current script does NOT exist, create a new one
        var script = new Script();
        script.saveScript();
        s.scripts.push(script);
    } else if (filename.endsWith(".txt")) {
        for (var i = 0; i < s.textFiles.length; ++i) {
            if (s.textFiles[i].fn === filename) {
                s.textFiles[i].write(code);
                Engine.loadTerminalContent();
                return;
            }
        }
        var textFile = new TextFile(filename, code);
        s.textFiles.push(textFile);
    } else {
        dialogBoxCreate("Invalid filename. Must be either a script (.script) or " +
                        " or text file (.txt)")
        return;
    }
    Engine.loadTerminalContent();
}

//Checks that the string contains only valid characters for a filename, which are alphanumeric,
// underscores, hyphens, and dots
function checkValidFilename(filename) {
	var regex = /^[.a-zA-Z0-9_-]+$/;

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

		var filename = document.getElementById("script-editor-filename").value;
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

// These special strings are used to reference the presence of a given logical
// construct within a user script.
const specialReferenceIF = "__SPECIAL_referenceIf";
const specialReferenceFOR = "__SPECIAL_referenceFor";
const specialReferenceWHILE = "__SPECIAL_referenceWhile";

// The global scope of a script is registered under this key during parsing.
const memCheckGlobalKey = ".__GLOBAL__";

// Calcluates the amount of RAM a script uses. Uses parsing and AST walking only,
// rather than NetscriptEvaluator. This is useful because NetscriptJS code does
// not work under NetscriptEvaluator.
function parseOnlyRamCalculate(server, code, workerScript) {
    try {
        // Maps dependent identifiers to their dependencies.
        //
        // The initial identifier is __SPECIAL_INITIAL_MODULE__.__GLOBAL__.
        // It depends on all the functions declared in the module, all the global scopes
        // of its imports, and any identifiers referenced in this global scope. Each
        // function depends on all the identifiers referenced internally.
        // We walk the dependency graph to calculate RAM usage, given that some identifiers
        // reference Netscript functions which have a RAM cost.
        let dependencyMap = {};

        // Scripts we've parsed.
        const completedParses = new Set();

        // Scripts we've discovered that need to be parsed.
        const parseQueue = [];

        // Parses a chunk of code with a given module name, and updates parseQueue and dependencyMap.
        function parseCode(code, moduleName) {
            const result = parseOnlyCalculateDeps(code, moduleName);
            completedParses.add(moduleName);

            // Add any additional modules to the parse queue;
            for (let i = 0; i < result.additionalModules.length; ++i) {
                if (!completedParses.has(result.additionalModules[i])) {
                    parseQueue.push(result.additionalModules[i]);
                }
            }

            // Splice all the references in.
            dependencyMap = {...dependencyMap, ...result.dependencyMap};
        }

        const initialModule = "__SPECIAL_INITIAL_MODULE__";
        parseCode(code, initialModule);

        while (parseQueue.length > 0) {
            // Get the code from the server.
            const nextModule = parseQueue.shift();

            const script = server.getScript(nextModule);
            if (!script) return -1;  // No such script on the server.

            // Not sure why we always take copies, but let's do that here too.
            parseCode(script.code.repeat(1), nextModule);
        }

        // Finally, walk the reference map and generate a ram cost. The initial set of keys to scan
        // are those that start with __SPECIAL_INITIAL_MODULE__.
        let ram = CONSTANTS.ScriptBaseRamCost;
        const unresolvedRefs = Object.keys(dependencyMap).filter(s => s.startsWith(initialModule));
        const resolvedRefs = new Set();
        while (unresolvedRefs.length > 0) {
            const ref = unresolvedRefs.shift();
            resolvedRefs.add(ref);

            if (ref.endsWith(".*")) {
                // A prefix reference. We need to find all matching identifiers.
                const prefix = ref.slice(0, ref.length - 2);
                for (let ident of Object.keys(dependencyMap).filter(k => k.startsWith(prefix))) {
                    for (let dep of dependencyMap[ident] || []) {
                        if (!resolvedRefs.has(dep)) unresolvedRefs.push(dep);
                    }
                }
            } else {
                // An exact reference. Add all dependencies of this ref.
                for (let dep of dependencyMap[ref] || []) {
                    if (!resolvedRefs.has(dep)) unresolvedRefs.push(dep);
                }
            }

            // Check if this is one of the special keys, and add the appropriate ram cost if so.
            if (ref == specialReferenceIF) ram += CONSTANTS.ScriptIfRamCost;
            if (ref == specialReferenceFOR) ram += CONSTANTS.ScriptForRamCost;
            if (ref == specialReferenceWHILE) ram += CONSTANTS.ScriptWhileRamCost;
            if (ref == "hacknetnodes") ram += CONSTANTS.ScriptHacknetNodesRamCost;

            // Check if this ident is a function in the workerscript env. If it is, then we need to
            // get its RAM cost. We do this by calling it, which works because the running script
            // is in checkingRam mode.
            //
            // TODO it would be simpler to just reference a dictionary.
            try {
                var func = workerScript.env.get(ref);
                if (typeof func === "function") {
                    try {
                        var res = func.apply(null, []);
                        if (typeof res === "number") {
                            ram += res;
                        }
                    } catch(e) {
                        console.log("ERROR applying function: " + e);
                    }
                }
            } catch (error) { continue; }

        }
        return ram;

    } catch (error) {
        console.info("parse or eval error: ", error);
        // This is not unexpected. The user may be editing a script, and it may be in
        // a transitory invalid state.
        return -1;
    }
}

// Parses one script and calculates its ram usage, for the global scope and each function.
// Returns a cost map and a dependencyMap for the module. Returns a reference map to be joined
// onto the main reference map, and a list of modules that need to be parsed.
function parseOnlyCalculateDeps(code, currentModule) {
    const ast = parse(code, {sourceType:"module", ecmaVersion: 8});

    // Everything from the global scope goes in ".". Everything else goes in ".function", where only
    // the outermost layer of functions counts.
    const globalKey = currentModule + memCheckGlobalKey;
    const dependencyMap = {};
    dependencyMap[globalKey] = new Set();

    // If we reference this internal name, we're really referencing that external name.
    // Filled when we import names from other modules.
    let internalToExternal = {};

    var additionalModules = [];

    // References get added pessimistically. They are added for thisModule.name, name, and for
    // any aliases.
    function addRef(key, name) {
        const s = dependencyMap[key] || (dependencyMap[key] = new Set());
        if (name in internalToExternal) {
            s.add(internalToExternal[name]);
        }
        s.add(currentModule + "." + name);
        s.add(name);  // For builtins like hack.
    }

    // If we discover a dependency identifier, state.key is the dependent identifier.
    // walkDeeper is for doing recursive walks of expressions in composites that we handle.
    function commonVisitors() {
        return {
            Identifier: (node, st, walkDeeper) => {
                addRef(st.key, node.name);
            },
            WhileStatement: (node, st, walkDeeper) => {
                addRef(st.key, specialReferenceWHILE);
                node.test && walkDeeper(node.test, st);
                node.body && walkDeeper(node.body, st);
            },
            DoWhileStatement: (node, st, walkDeeper) => {
                addRef(st.key, specialReferenceWHILE);
                node.test && walkDeeper(node.test, st);
                node.body && walkDeeper(node.body, st);
            },
            ForStatement: (node, st, walkDeeper) => {
                addRef(st.key, specialReferenceFOR);
                node.init && walkDeeper(node.init, st);
                node.test && walkDeeper(node.test, st);
                node.update && walkDeeper(node.update, st);
                node.body && walkDeeper(node.body, st);
            },
            IfStatement: (node, st, walkDeeper) => {
                addRef(st.key, specialReferenceIF);
                node.test && walkDeeper(node.test, st);
                node.consequent && walkDeeper(node.consequent, st);
                node.alternate && walkDeeper(node.alternate, st);
            },
        }
    }

    walk.recursive(ast, {key: globalKey}, {
        ImportDeclaration: (node, st, walkDeeper) => {
            const importModuleName = node.source.value;
            additionalModules.push(importModuleName);

            // This module's global scope refers to that module's global scope, no matter how we
            // import it.
            dependencyMap[st.key].add(importModuleName + memCheckGlobalKey);

            for (let i = 0; i < node.specifiers.length; ++i) {
                const spec = node.specifiers[i];
                if (spec.imported !== undefined && spec.local !== undefined) {
                    // We depend on specific things.
                    internalToExternal[spec.local.name] = importModuleName + "." + spec.imported.name;
                } else {
                    // We depend on everything.
                    dependencyMap[st.key].add(importModuleName + ".*");
                }
            }
        },
        FunctionDeclaration: (node, st, walkDeeper) => {
            // Don't use walkDeeper, because we are changing the visitor set.
            const key = currentModule + "." + node.id.name;
            walk.recursive(node, {key: key}, commonVisitors());
        },
        ...commonVisitors()
    });

    return {dependencyMap: dependencyMap, additionalModules: additionalModules};
}

function calculateRamUsage(codeCopy) {
    //Create a temporary/mock WorkerScript and an AST from the code
    var currServ = Player.getCurrentServer();
    var workerScript = new WorkerScript({
        filename:"foo",
        scriptRef: {code:""},
        args:[]
    });
    workerScript.checkingRam = true; //Netscript functions will return RAM usage
    workerScript.serverIp = currServ.ip;

    try {
        return parseOnlyRamCalculate(currServ, codeCopy, workerScript);
	} catch (e) {
        console.log("Failed to parse ram using new method. Falling back.", e);
	}

    // Try the old way.

    try {
        var ast = parse(codeCopy, {sourceType:"module"});
    } catch(e) {
        return -1;
    }

    //Search through AST, scanning for any 'Identifier' nodes for functions, or While/For/If nodes
    var queue = [], ramUsage = 1.4;
    var whileUsed = false, forUsed = false, ifUsed = false;
    queue.push(ast);
    while (queue.length != 0) {
        var exp = queue.shift();
        switch (exp.type) {
            case "ImportDeclaration":
                //Gets an array of all imported functions as AST expressions
                //and pushes them on the queue.
                var res = evaluateImport(exp, workerScript, true);
                for (var i = 0; i < res.length; ++i) {
                    queue.push(res[i]);
                }
                break;
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
                            if (typeof res === "number") {
                                ramUsage += res;
                            }
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

    //Special case: hacknetnodes array
    if (codeCopy.includes("hacknetnodes")) {
        ramUsage += CONSTANTS.ScriptHacknetNodesRamCost;
    }
    return ramUsage;
}

Script.prototype.download = function() {
    var filename = this.filename + ".js";
    var file = new Blob([this.code], {type: 'text/plain'});
    if (window.navigator.msSaveOrOpenBlob) {// IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    } else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
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

AllServersMap.prototype.toJSON = function() {
    return Generic_toJSON("AllServersMap", this);
}


AllServersMap.fromJSON = function(value) {
    return Generic_fromJSON(AllServersMap, value.data);
}

Reviver.constructors.AllServersMap = AllServersMap;

export {updateScriptEditorContent, loadAllRunningScripts, findRunningScript,
        RunningScript, Script, AllServersMap, scriptEditorInit, isScriptFilename};
