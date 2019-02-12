// Importing this doesn't work for some reason.
const walk = require("acorn/dist/walk");

import {CONSTANTS}                              from "./Constants";
import {Engine}                                 from "./engine";
import {FconfSettings, parseFconfSettings}      from "./Fconf";
import {iTutorialSteps, iTutorialNextStep,
        ITutorial}                              from "./InteractiveTutorial";
import {evaluateImport}                         from "./NetscriptEvaluator";
import {NetscriptFunctions}                     from "./NetscriptFunctions";
import {addWorkerScript, WorkerScript}          from "./NetscriptWorker";
import {Player}                                 from "./Player";
import { AceEditor }                            from "./ScriptEditor/Ace";
import { CodeMirrorEditor }                     from "./ScriptEditor/CodeMirror";
import {AllServers, processSingleServerGrowth}  from "./Server";
import { Settings }                             from "./Settings/Settings";
import { EditorSetting }                        from "./Settings/SettingEnums";
import {post}                                   from "./ui/postToTerminal";
import {TextFile}                               from "./TextFile";
import {parse, Node}                            from "../utils/acorn";
import {Page, routing}                          from "./ui/navigationTracking";
import {numeralWrapper}                         from "./ui/numeralFormat";
import {dialogBoxCreate}                        from "../utils/DialogBox";
import {Reviver, Generic_toJSON,
        Generic_fromJSON}                       from "../utils/JSONReviver";
import {compareArrays}                          from "../utils/helpers/compareArrays";
import {createElement}                          from "../utils/uiHelpers/createElement";
import {getTimestamp}                           from "../utils/helpers/getTimestamp";
import {roundToTwo}                             from "../utils/helpers/roundToTwo";

function isScriptFilename(f) {
    return f.endsWith(".js") || f.endsWith(".script") || f.endsWith(".ns");
}

var scriptEditorRamCheck = null, scriptEditorRamText = null;
function scriptEditorInit() {
    // Wrapper container that holds all the buttons below the script editor
    const wrapper = document.getElementById("script-editor-buttons-wrapper");
    if (wrapper == null) {
        console.error("Could not find 'script-editor-buttons-wrapper'");
        return false;
    }

    // Beautify button
    const beautifyButton = createElement("button", {
        class: "std-button",
        display: "inline-block",
        innerText: "Beautify",
        clickListener:()=>{
            let editor = getCurrentEditor();
            if (editor != null) {
                editor.beautifyScript();
            }
            return false;
        }
    });

    // Text that displays RAM calculation
    scriptEditorRamText = createElement("p", {
        display:"inline-block", margin:"10px", id:"script-editor-status-text"
    });

    // Label for checkbox (defined below)
    const checkboxLabel = createElement("label", {
        for:"script-editor-ram-check", margin:"4px", marginTop: "8px",
        innerText:"Dynamic RAM Usage Checker", color:"white",
        tooltip:"Enable/Disable the dynamic RAM Usage display. You may " +
                "want to disable it for very long scripts because there may be " +
                "performance issues"
    });

    // Checkbox for enabling/disabling dynamic RAM calculation
    scriptEditorRamCheck = createElement("input", {
        type:"checkbox", name:"script-editor-ram-check", id:"script-editor-ram-check",
        margin:"4px", marginTop: "8px",
    });
    scriptEditorRamCheck.checked = true;

    // Link to Netscript documentation
    const documentationButton = createElement("a", {
        class: "std-button",
        display: "inline-block",
        href:"https://bitburner.readthedocs.io/en/latest/index.html",
        innerText:"Netscript Documentation",
        target:"_blank",
    });

    // Save and Close button
    const closeButton = createElement("button", {
        class: "std-button",
        display: "inline-block",
        innerText: "Save & Close (Ctrl/Cmd + b)",
        clickListener:()=>{
            saveAndCloseScriptEditor();
            return false;
        }
    });

    // Add all buttons to the UI
    wrapper.appendChild(beautifyButton);
    wrapper.appendChild(closeButton);
    wrapper.appendChild(scriptEditorRamText);
    wrapper.appendChild(scriptEditorRamCheck);
    wrapper.appendChild(checkboxLabel);
    wrapper.appendChild(documentationButton);

    // Initialize editors
    const initParams = {
        saveAndCloseFn: saveAndCloseScriptEditor,
        quitFn: Engine.loadTerminalContent,
    }

    AceEditor.init(initParams);
    CodeMirrorEditor.init(initParams);

    // Setup the selector for which Editor to use
    const editorSelector = document.getElementById("script-editor-option-editor");
    if (editorSelector == null) {
        console.error(`Could not find DOM Element for editor selector (id=script-editor-option-editor)`);
        return false;
    }

    for (let i = 0; i < editorSelector.options.length; ++i) {
        if (editorSelector.options[i].value === Settings.Editor) {
            editorSelector.selectedIndex = i;
            break;
        }
    }

    editorSelector.onchange = () => {
        const opt = editorSelector.value;
        switch (opt) {
            case EditorSetting.Ace:
                const codeMirrorCode = CodeMirrorEditor.getCode();
                const codeMirrorFn = CodeMirrorEditor.getFilename();
                AceEditor.create();
                CodeMirrorEditor.setInvisible();
                AceEditor.openScript(codeMirrorFn, codeMirrorCode);
                break;
            case EditorSetting.CodeMirror:
                const aceCode = AceEditor.getCode();
                const aceFn = AceEditor.getFilename();
                CodeMirrorEditor.create();
                AceEditor.setInvisible();
                CodeMirrorEditor.openScript(aceFn, aceCode);
                break;
            default:
                console.error(`Unrecognized Editor Setting: ${opt}`);
                return;
        }

        Settings.Editor = opt;
    }

    editorSelector.onchange(); // Trigger the onchange event handler
}

export function getCurrentEditor() {
    switch (Settings.Editor) {
        case EditorSetting.Ace:
            return AceEditor;
        case EditorSetting.CodeMirror:
            return CodeMirrorEditor;
        default:
            console.log(`Invalid Editor Setting: ${Settings.Editor}`);
            throw new Error(`Invalid Editor Setting: ${Settings.Editor}`);
            return null;
    }
}

//Updates RAM usage in script
export async function updateScriptEditorContent() {
    var filename = document.getElementById("script-editor-filename").value;
    if (scriptEditorRamCheck == null || !scriptEditorRamCheck.checked || !isScriptFilename(filename)) {
        scriptEditorRamText.innerText = "N/A";
        return;
    }

    let code;
    try {
        code = getCurrentEditor().getCode();
    } catch(e) {
        scriptEditorRamText.innerText = "RAM: ERROR";
        return;
    }

    var codeCopy = code.repeat(1);
    var ramUsage = await calculateRamUsage(codeCopy);
    if (ramUsage !== -1) {
        scriptEditorRamText.innerText = "RAM: " + numeralWrapper.format(ramUsage, '0.00') + " GB";
    } else {
        scriptEditorRamText.innerText = "RAM: Syntax Error";
    }
}

//Define key commands in script editor (ctrl o to save + close, etc.)
$(document).keydown(function(e) {
    if (Settings.DisableHotkeys === true) {return;}
	if (routing.isOn(Page.ScriptEditor)) {
		//Ctrl + b
        if (e.keyCode == 66 && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
			saveAndCloseScriptEditor();
        }
	}
});

function saveAndCloseScriptEditor() {
    var filename = document.getElementById("script-editor-filename").value;

    let code;
    try {
        code = getCurrentEditor().getCode();
    } catch(e) {
        dialogBoxCreate("Something went wrong when trying to save (getCurrentEditor().getCode()). Please report to game developer with details");
        return;
    }

    if (ITutorial.isRunning && ITutorial.currStep === iTutorialSteps.TerminalTypeScript) {
        //Make sure filename + code properly follow tutorial
        if (filename !== "foodnstuff.script") {
            dialogBoxCreate("Leave the script name as 'foodnstuff'!");
            return;
        }
        code = code.replace(/\s/g, "");
        if (code.indexOf("while(true){hack('foodnstuff');}") == -1) {
            dialogBoxCreate("Please copy and paste the code from the tutorial!");
            return;
        }

        //Save the script
        let s = Player.getCurrentServer();
        for (var i = 0; i < s.scripts.length; i++) {
            if (filename == s.scripts[i].filename) {
                s.scripts[i].saveScript();
                Engine.loadTerminalContent();
                return iTutorialNextStep();
            }
        }

        //If the current script does NOT exist, create a new one
        let script = new Script();
        script.saveScript();
        s.scripts.push(script);

        return iTutorialNextStep();
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
            dialogBoxCreate(`Invalid .fconf file: ${e}`);
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

function Script(fn = "", code = "", server = "") {
	this.filename 	= fn;
    this.code       = code;
    this.ramUsage   = 0;
	this.server 	= server; //IP of server this script is on
    this.module     = "";
    if (this.code !== "") {this.updateRamUsage();}
};

//Get the script data from the Script Editor and save it to the object
Script.prototype.saveScript = function() {
	if (routing.isOn(Page.ScriptEditor)) {
		//Update code and filename
        const code = getCurrentEditor().getCode();
		this.code = code.replace(/^\s+|\s+$/g, '');

		var filename = document.getElementById("script-editor-filename").value;
		this.filename = filename;

		//Server
		this.server = Player.currentServer;

		//Calculate/update ram usage, execution time, etc.
		this.updateRamUsage();

        this.module = "";
	}
}

//Updates how much RAM the script uses when it is running.
Script.prototype.updateRamUsage = async function() {
    var codeCopy = this.code.repeat(1);
    var res = await calculateRamUsage(codeCopy);
    if (res !== -1) {
        this.ramUsage = roundToTwo(res);
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
async function parseOnlyRamCalculate(server, code, workerScript) {
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
            //Spread syntax not supported in edge, use Object.assign instead
            //dependencyMap = {...dependencyMap, ...result.dependencyMap};
            dependencyMap = Object.assign(dependencyMap, result.dependencyMap);
        }

        const initialModule = "__SPECIAL_INITIAL_MODULE__";
        parseCode(code, initialModule);

        while (parseQueue.length > 0) {
            // Get the code from the server.
            const nextModule = parseQueue.shift();

            let code;
            if (nextModule.startsWith("https://") || nextModule.startsWith("http://")) {
                try {
                    const module = await eval('import(nextModule)');
                    code = "";
                    for (const prop in module) {
                        if (typeof module[prop] === 'function') {
                            code += module[prop].toString() + ";\n";
                        }
                    }
                } catch(e) {
                    console.error(`Error dynamically importing module from ${nextModule} for RAM calculations: ${e}`);
                    return -1;
                }
            } else {
                const script = server.getScript(nextModule.startsWith("./") ? nextModule.slice(2) : nextModule);
                if (!script) {
                    console.warn("Invalid script");
                    return -1;  // No such script on the server.
                }
                code = script.code;
            }

            parseCode(code, nextModule);
        }

        // Finally, walk the reference map and generate a ram cost. The initial set of keys to scan
        // are those that start with __SPECIAL_INITIAL_MODULE__.
        let ram = CONSTANTS.ScriptBaseRamCost;
        const unresolvedRefs = Object.keys(dependencyMap).filter(s => s.startsWith(initialModule));
        const resolvedRefs = new Set();
        while (unresolvedRefs.length > 0) {
            const ref = unresolvedRefs.shift();

            // Check if this is one of the special keys, and add the appropriate ram cost if so.
            if (ref === "hacknet" && !resolvedRefs.has("hacknet")) {
                ram += CONSTANTS.ScriptHacknetNodesRamCost;
            }
            if (ref === "document" && !resolvedRefs.has("document")) {
                ram += CONSTANTS.ScriptDomRamCost;
            }
            if (ref === "window" && !resolvedRefs.has("window")) {
                ram += CONSTANTS.ScriptDomRamCost;
            }

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

            // Check if this ident is a function in the workerscript env. If it is, then we need to
            // get its RAM cost. We do this by calling it, which works because the running script
            // is in checkingRam mode.
            //
            // TODO it would be simpler to just reference a dictionary.
            try {
                function applyFuncRam(func) {
                    if (typeof func === "function") {
                        try {
                            let res;
                            if (func.constructor.name === "AsyncFunction") {
                                res = 0; // Async functions will always be 0 RAM
                            } else {
                                res = func.apply(null, []);
                            }
                            if (typeof res === "number") {
                                return res;
                            }
                            return 0;
                        } catch(e) {
                            console.log("ERROR applying function: " + e);
                            return 0;
                        }
                    } else {
                        return 0;
                    }
                }

                //Special logic for namespaces (Bladeburner, CodingCOntract)
                var func;
                if (ref in workerScript.env.vars.bladeburner) {
                    func = workerScript.env.vars.bladeburner[ref];
                } else if (ref in workerScript.env.vars.codingcontract) {
                    func = workerScript.env.vars.codingcontract[ref];
                } else if (ref in workerScript.env.vars.gang) {
                    func = workerScript.env.vars.gang[ref];
                } else {
                    func = workerScript.env.get(ref);
                }
                ram += applyFuncRam(func);
            } catch (error) {continue;}
        }
        return ram;

    } catch (error) {
        // console.info("parse or eval error: ", error);
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

    //A list of identifiers that resolve to "native Javascript code"
    const objectPrototypeProperties = Object.getOwnPropertyNames(Object.prototype);

    // If we discover a dependency identifier, state.key is the dependent identifier.
    // walkDeeper is for doing recursive walks of expressions in composites that we handle.
    function commonVisitors() {
        return {
            Identifier: (node, st, walkDeeper) => {
                if (objectPrototypeProperties.includes(node.name)) {return;}
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
            MemberExpression: (node, st, walkDeeper) => {
                node.object && walkDeeper(node.object, st);
                node.property && walkDeeper(node.property, st);
            },
        }
    }

    //Spread syntax not supported in Edge yet, use Object.assign
    /*
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
    */
    walk.recursive(ast, {key: globalKey}, Object.assign({
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
    }, commonVisitors()));

    return {dependencyMap: dependencyMap, additionalModules: additionalModules};
}

async function calculateRamUsage(codeCopy) {
    //Create a temporary/mock WorkerScript and an AST from the code
    var currServ = Player.getCurrentServer();
    var workerScript = new WorkerScript({
        filename:"foo",
        scriptRef: {code:""},
        args:[],
        getCode: function() { return ""; }
    });
    workerScript.checkingRam = true; //Netscript functions will return RAM usage
    workerScript.serverIp = currServ.ip;

    try {
        return await parseOnlyRamCalculate(currServ, codeCopy, workerScript);
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
    var queue = [], ramUsage = CONSTANTS.ScriptBaseRamCost;
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
    if (codeCopy.includes("hacknet")) {
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
    var total = 0;
    let skipScriptLoad = (window.location.href.toLowerCase().indexOf("?noscripts") !== -1);
    if (skipScriptLoad) { console.info("Skipping the load of any scripts during startup"); }
	for (var property in AllServers) {
		if (AllServers.hasOwnProperty(property)) {
			var server = AllServers[property];

			//Reset each server's RAM usage to 0
			server.ramUsed = 0;

            //Reset modules on all scripts
            for (var i = 0; i < server.scripts.length; ++i) {
                server.scripts[i].module = "";
            }

            if (skipScriptLoad) {
                //Start game with no scripts
                server.runningScripts.length = 0;
            } else {
                for (var j = 0; j < server.runningScripts.length; ++j) {
    				addWorkerScript(server.runningScripts[j], server);

    				//Offline production
    				total += scriptCalculateOfflineProduction(server.runningScripts[j]);
    			}
            }
		}
	}

    return total;
}

function scriptCalculateOfflineProduction(runningScriptObj) {
    console.log("Calculating offline production for: ");
    console.log(runningScriptObj);
    
	//The Player object stores the last update time from when we were online
	var thisUpdate = new Date().getTime();
	var lastUpdate = Player.lastUpdate;
	var timePassed = (thisUpdate - lastUpdate) / 1000;	//Seconds

	//Calculate the "confidence" rating of the script's true production. This is based
	//entirely off of time. We will arbitrarily say that if a script has been running for
	//4 hours (14400 sec) then we are completely confident in its ability
	var confidence = (runningScriptObj.onlineRunningTime) / 14400;
	if (confidence >= 1) {confidence = 1;}

    //Data map: [MoneyStolen, NumTimesHacked, NumTimesGrown, NumTimesWeaken]

    // Grow
    for (var ip in runningScriptObj.dataMap) {
        if (runningScriptObj.dataMap.hasOwnProperty(ip)) {
            if (runningScriptObj.dataMap[ip][2] == 0 || runningScriptObj.dataMap[ip][2] == null) {continue;}
            var serv = AllServers[ip];
            if (serv == null) {continue;}
            var timesGrown = Math.round(0.5 * runningScriptObj.dataMap[ip][2] / runningScriptObj.onlineRunningTime * timePassed);
            console.log(runningScriptObj.filename + " called grow() on " + serv.hostname + " " + timesGrown + " times while offline");
            runningScriptObj.log("Called grow() on " + serv.hostname + " " + timesGrown + " times while offline");
            var growth = processSingleServerGrowth(serv, timesGrown * 450);
            runningScriptObj.log(serv.hostname + " grown by " + numeralWrapper.format(growth * 100 - 100, '0.000000%') + " from grow() calls made while offline");
        }
    }

    // Money from hacking
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

    // Offline EXP gain
	// A script's offline production will always be at most half of its online production.
	var expGain = 0.5 * (runningScriptObj.onlineExpGained / runningScriptObj.onlineRunningTime) * timePassed;
	expGain *= confidence;

	Player.gainHackingExp(expGain);

	// Update script stats
	runningScriptObj.offlineMoneyMade += totalOfflineProduction;
	runningScriptObj.offlineRunningTime += timePassed;
	runningScriptObj.offlineExpGained += expGain;

    // Fortify a server's security based on how many times it was hacked
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

    // Weaken
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
    if (script == null || script == undefined) { return; }
    this.filename   = script.filename;
    this.args       = args;
    this.server     = script.server;    //IP Address only
    this.ramUsage   = script.ramUsage;

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

    // Holds a map of all servers, where server = key and the value for each
    // server is an array of four numbers. The four numbers represent:
    //  [MoneyStolen, NumTimesHacked, NumTimesGrown, NumTimesWeaken]
    // This data is used for offline progress
    this.dataMap                = {};
}

RunningScript.prototype.getCode = function() {
    const server = AllServers[this.server];
    if (server == null) { return ""; }
    for (let i = 0; i < server.scripts.length; ++i) {
        if (server.scripts[i].filename === this.filename) {
            return server.scripts[i].code;
        }
    }

    return "";
}

RunningScript.prototype.getRamUsage = function() {
    if (this.ramUsage != null && this.ramUsage > 0) { return this.ramUsage; } // Use cached value

    const server = AllServers[this.server];
    if (server == null) { return 0; }
    for (let i = 0; i < server.scripts.length; ++i) {
        if (server.scripts[i].filename === this.filename) {
            // Cache the ram usage for the next call
            this.ramUsage = server.scripts[i].ramUsage;
            return this.ramUsage;
        }
    }


    return 0;
}

RunningScript.prototype.log = function(txt) {
    if (this.logs.length > Settings.MaxLogCapacity) {
        //Delete first element and add new log entry to the end.
        //TODO Eventually it might be better to replace this with circular array
        //to improve performance
        this.logs.shift();
    }
    let logEntry = txt;
    if (FconfSettings.ENABLE_TIMESTAMPS) {
        logEntry = "[" + getTimestamp() + "] " + logEntry;
    }
    this.logs.push(logEntry);
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
    if (this.dataMap[serverIp] == null || this.dataMap[serverIp].constructor !== Array) {
        this.dataMap[serverIp] = [0, 0, 0, 0];
    }
    this.dataMap[serverIp][0] += moneyGained;
    this.dataMap[serverIp][1] += n;
}

//Update the grow map when calling grow()
RunningScript.prototype.recordGrow = function(serverIp, n=1) {
    if (this.dataMap[serverIp] == null || this.dataMap[serverIp].constructor !== Array) {
        this.dataMap[serverIp] = [0, 0, 0, 0];
    }
    this.dataMap[serverIp][2] += n;
}

//Update the weaken map when calling weaken() {
RunningScript.prototype.recordWeaken = function(serverIp, n=1) {
    if (this.dataMap[serverIp] == null || this.dataMap[serverIp].constructor !== Array) {
        this.dataMap[serverIp] = [0, 0, 0, 0];
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

export {loadAllRunningScripts, findRunningScript,
        RunningScript, Script, scriptEditorInit, isScriptFilename};
