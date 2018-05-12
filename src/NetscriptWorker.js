import {addActiveScriptsItem,
        deleteActiveScriptsItem,
        updateActiveScriptsItems}           from "./ActiveScriptsUI.js";
import {CONSTANTS}                          from "./Constants.js";
import {Engine}                             from "./engine.js";
import {Environment}                        from "./NetscriptEnvironment.js";
import {evaluate, isScriptErrorMessage,
        makeRuntimeRejectMsg,
        killNetscriptDelay}                 from "./NetscriptEvaluator.js";
import {executeJSScript}                    from "./NetscriptJSEvaluator.js";
import {NetscriptPort}                      from "./NetscriptPort.js";
import {AllServers}                         from "./Server.js";
import {Settings}                           from "./Settings.js";

import {parse}                              from "../utils/acorn.js";
import {dialogBoxCreate}                    from "../utils/DialogBox.js";
import {compareArrays, printArray}          from "../utils/HelperFunctions.js";

function WorkerScript(runningScriptObj) {
	this.name 			= runningScriptObj.filename;
	this.running 		= false;
	this.serverIp 		= null;
	this.code 			= runningScriptObj.scriptRef.code;
	this.env 			= new Environment(this);
    this.env.set("args", runningScriptObj.args.slice());
	this.output			= "";
	this.ramUsage		= 0;
	this.scriptRef		= runningScriptObj;
    this.errorMessage   = "";
    this.args           = runningScriptObj.args.slice();
    this.delay          = null;
    this.fnWorker       = null; //Workerscript for a function call
    this.checkingRam    = false;
    this.loadedFns      = {}; //Stores names of fns that are "loaded" by this script, thus using RAM
    this.disableLogs    = {}; //Stores names of fns that should have logs disabled
}

//Returns the server on which the workerScript is running
WorkerScript.prototype.getServer = function() {
	return AllServers[this.serverIp];
}

//Array containing all scripts that are running across all servers, to easily run them all
let workerScripts 			= [];

var NetscriptPorts = [];
for (var i = 0; i < CONSTANTS.NumNetscriptPorts; ++i) {
    NetscriptPorts.push(new NetscriptPort());
}

function prestigeWorkerScripts() {
    for (var i = 0; i < workerScripts.length; ++i) {
        deleteActiveScriptsItem(workerScripts[i]);
        workerScripts[i].env.stopFlag = true;
    }
    updateActiveScriptsItems(); //Force UI to update
    workerScripts.length = 0;
}

// JS script promises need a little massaging to have the same guarantees as netscript
// promises. This does said massaging and kicks the script off. It returns a promise
// that resolves or rejects when the corresponding worker script is done.
function startJsScript(workerScript) {
    workerScript.running = true;

    // The name of the currently running netscript function, to prevent concurrent
    // calls to hack, grow, etc.
    let runningFn = null;

    // We need to go through the environment and wrap each function in such a way that it
    // can be called at most once at a time. This will prevent situations where multiple
    // hack promises are outstanding, for example.
    function wrap(propName, f) {
        // This function unfortunately cannot be an async function, because we don't
        // know if the original one was, and there's no way to tell.
        return function (...args) {
            // Wrap every netscript function with a check for the stop flag.
            // This prevents cases where we never stop because we are only calling
            // netscript functions that don't check this.
            // This is not a problem for legacy Netscript because it also checks the
            // stop flag in the evaluator.
            if (workerScript.env.stopFlag) {throw workerScript;}

            if (propName === "sleep") return f(...args);  // OK for multiple simultaneous calls to sleep.

            const msg = "Concurrent calls to Netscript functions not allowed! " +
                        "Did you forget to await hack(), grow(), or some other " +
                        "promise-returning function? (Currently running: %s tried to run: %s)"
            if (runningFn) {
                workerScript.errorMessage = makeRuntimeRejectMsg(workerScript, sprintf(msg, runningFn, propName), null)
                throw workerScript;
            }
            runningFn = propName;
            let result = f(...args);
            if (result && result.finally !== undefined) {
                return result.finally(function () {
                    runningFn = null;
                });
            } else {
                runningFn = null;
                return result;
            }
        }
    };

    for (let prop in workerScript.env.vars) {
        if (typeof workerScript.env.vars[prop] !== "function") continue;
        workerScript.env.vars[prop] = wrap(prop, workerScript.env.vars[prop]);
    }

    // Note: the environment that we pass to the JS script only needs to contain the functions visible
    // to that script, which env.vars does at this point.
    return executeJSScript(workerScript.scriptRef.scriptRef,
                           workerScript.getServer().scripts,
                           workerScript).then(function (mainReturnValue) {
        if (mainReturnValue === undefined) return workerScript;
        return [mainReturnValue, workerScript];
    }).catch(e => {
        if (e instanceof Error) {
            workerScript.errorMessage = makeRuntimeRejectMsg(
                workerScript, e.message + (e.stack && ("\nstack:\n" + e.stack.toString()) || ""));
            throw workerScript;
        } else if (isScriptErrorMessage(e)) {
            workerScript.errorMessage = e;
            throw workerScript;
        }
        throw e; // Don't know what to do with it, let's rethrow.
    });
}

//Loop through workerScripts and run every script that is not currently running
function runScriptsLoop() {
    //Delete any scripts that finished or have been killed. Loop backwards bc removing
    //items fucks up the indexing
    for (var i = workerScripts.length - 1; i >= 0; i--) {
        if (workerScripts[i].running == false && workerScripts[i].env.stopFlag == true) {
            //Delete script from the runningScripts array on its host serverIp
            var ip = workerScripts[i].serverIp;
            var name = workerScripts[i].name;

            //Free RAM
            AllServers[ip].ramUsed -= workerScripts[i].ramUsage;

            //Delete script from Active Scripts
            deleteActiveScriptsItem(workerScripts[i]);

            for (var j = 0; j < AllServers[ip].runningScripts.length; j++) {
                if (AllServers[ip].runningScripts[j].filename == name &&
                    compareArrays(AllServers[ip].runningScripts[j].args, workerScripts[i].args)) {
                    AllServers[ip].runningScripts.splice(j, 1);
                    break;
                }
            }

            //Delete script from workerScripts
            workerScripts.splice(i, 1);
        }
    }

	//Run any scripts that haven't been started
	for (var i = 0; i < workerScripts.length; i++) {
		//If it isn't running, start the script
		if (workerScripts[i].running == false && workerScripts[i].env.stopFlag == false) {
            let p = null;  // p is the script's result promise.
            if (workerScripts[i].name.endsWith(".js")) {
                p = startJsScript(workerScripts[i]);
            } else {
                try {
                    var ast = parse(workerScripts[i].code, {sourceType:"module"});
                    //console.log(ast);
                } catch (e) {
                    console.log("Error parsing script: " + workerScripts[i].name);
                    dialogBoxCreate("Syntax ERROR in " + workerScripts[i].name + ":<br>" +  e);
                    workerScripts[i].env.stopFlag = true;
                    continue;
                }
                workerScripts[i].running = true;
                p = evaluate(ast, workerScripts[i]);
            }

			//Once the code finishes (either resolved or rejected, doesnt matter), set its
			//running status to false
			p.then(function(w) {
				console.log("Stopping script " + w.name + " because it finished running naturally");
				w.running = false;
				w.env.stopFlag = true;
                w.scriptRef.log("Script finished running");
			}).catch(function(w) {
				if (w instanceof Error) {
                    dialogBoxCreate("Script runtime unknown error. This is a bug please contact game developer");
					console.log("ERROR: Evaluating workerscript returns an Error. THIS SHOULDN'T HAPPEN: " + w.toString());
                    return;
                } else if (w.constructor === Array && w.length === 2 && w[0] === "RETURNSTATEMENT") {
                    //Script ends with a return statement
                    console.log("Script returning with value: " + w[1]);
                    //TODO maybe do something with this in the future
                    return;
                } else if (w instanceof WorkerScript) {
                    if (isScriptErrorMessage(w.errorMessage)) {
                        var errorTextArray = w.errorMessage.split("|");
                        if (errorTextArray.length != 4) {
                            console.log("ERROR: Something wrong with Error text in evaluator...");
                            console.log("Error text: " + errorText);
                            return;
                        }
                        var serverIp = errorTextArray[1];
                        var scriptName = errorTextArray[2];
                        var errorMsg = errorTextArray[3];

                        dialogBoxCreate("Script runtime error: <br>Server Ip: " + serverIp +
                                        "<br>Script name: " + scriptName +
                                        "<br>Args:" + printArray(w.args) + "<br>" + errorMsg);
                        w.scriptRef.log("Script crashed with runtime error");
                    } else {
                        w.scriptRef.log("Script killed");
                    }
					w.running = false;
					w.env.stopFlag = true;

				} else if (isScriptErrorMessage(w)) {
                    dialogBoxCreate("Script runtime unknown error. This is a bug please contact game developer");
					console.log("ERROR: Evaluating workerscript returns only error message rather than WorkerScript object. THIS SHOULDN'T HAPPEN: " + w.toString());
                    return;
                } else {
                    dialogBoxCreate("An unknown script died for an unknown reason. This is a bug please contact game dev");
                    console.log(w);
                }
			});
		}
	}

	setTimeout(runScriptsLoop, 6000);
}

//Queues a script to be killed by settings its stop flag to true. Then, the code will reject
//all of its promises recursively, and when it does so it will no longer be running.
//The runScriptsLoop() will then delete the script from worker scripts
function killWorkerScript(runningScriptObj, serverIp) {
	for (var i = 0; i < workerScripts.length; i++) {
		if (workerScripts[i].name == runningScriptObj.filename && workerScripts[i].serverIp == serverIp &&
            compareArrays(workerScripts[i].args, runningScriptObj.args)) {
			workerScripts[i].env.stopFlag = true;
            killNetscriptDelay(workerScripts[i]);
            //Recursively kill all functions
            var curr = workerScripts[i];
            while (curr.fnWorker) {
                curr.fnWorker.env.stopFlag = true;
                killNetscriptDelay(curr.fnWorker);
                curr = curr.fnWorker;
            }
            return true;
		}
	}
    return false;
}

//Queues a script to be run
function addWorkerScript(runningScriptObj, server) {
	var filename = runningScriptObj.filename;

	//Update server's ram usage
    var threads = 1;
    if (runningScriptObj.threads && !isNaN(runningScriptObj.threads)) {
        threads = runningScriptObj.threads;
    } else {
        runningScriptObj.threads = 1;
    }
    var ramUsage = runningScriptObj.scriptRef.ramUsage * threads
                   * Math.pow(CONSTANTS.MultithreadingRAMCost, threads-1);
    var ramAvailable = server.maxRam - server.ramUsed;
    if (ramUsage > ramAvailable) {
        dialogBoxCreate("Not enough RAM to run script " + runningScriptObj.filename + " with args " +
                        printArray(runningScriptObj.args) + ". This likely occurred because you re-loaded " +
                        "the game and the script's RAM usage increased (either because of an update to the game or " +
                        "your changes to the script.)");
        return;
    }
	server.ramUsed += ramUsage;

	//Create the WorkerScript
	var s = new WorkerScript(runningScriptObj);
	s.serverIp 	= server.ip;
	s.ramUsage 	= ramUsage;

	//Add the WorkerScript to the Active Scripts list
	addActiveScriptsItem(s);

	//Add the WorkerScript
	workerScripts.push(s);
	return;
}

//Updates the online running time stat of all running scripts
function updateOnlineScriptTimes(numCycles = 1) {
	var time = (numCycles * Engine._idleSpeed) / 1000; //seconds
	for (var i = 0; i < workerScripts.length; ++i) {
		workerScripts[i].scriptRef.onlineRunningTime += time;
	}
}

export {WorkerScript, workerScripts, NetscriptPorts, runScriptsLoop,
        killWorkerScript, addWorkerScript, updateOnlineScriptTimes,
        prestigeWorkerScripts};
