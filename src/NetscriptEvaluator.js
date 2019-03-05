import { BitNodeMultipliers }               from "./BitNode/BitNodeMultipliers";
import { CONSTANTS }                        from "./Constants";
import { Player }                           from "./Player";
import { Environment }                      from "./NetscriptEnvironment";
import { WorkerScript, addWorkerScript}     from "./NetscriptWorker";
import { Server }                           from "./Server/Server";
import { getServer }                        from "./Server/ServerHelpers";
import { Settings }                         from "./Settings/Settings";
import { RunningScript }                    from "./Script/RunningScript";
import { Script }                           from "./Script/Script";
import { findRunningScript }                from "./Script/ScriptHelpers";

import { setTimeoutRef }                    from "./utils/SetTimeoutRef";

import {parse, Node}                        from "../utils/acorn";
import {arrayToString}                      from "../utils/helpers/arrayToString";
import {isValidIPAddress}                   from "../utils/helpers/isValidIPAddress";
import {isString}                           from "../utils/helpers/isString";

export function evaluateImport(exp, workerScript, checkingRam=false) {
    //When its checking RAM, it exports an array of nodes for each imported function
    var ramCheckRes = [];

    var env = workerScript.env;
    if (env.stopFlag) {
        if (checkingRam) {return ramCheckRes;}
        return Promise.reject(workerScript);
    }

    //Get source script and name of all functions to import
    var scriptName = exp.source.value;
    var namespace, namespaceObj, allFns = false, fnNames = [];
    if  (exp.specifiers.length === 1 && exp.specifiers[0].type === "ImportNamespaceSpecifier") {
        allFns = true;
        namespace = exp.specifiers[0].local.name;
    } else {
        for (var i = 0; i < exp.specifiers.length; ++i) {
            fnNames.push(exp.specifiers[i].local.name);
        }
    }

    //Get the code
    var server = getServer(workerScript.serverIp), code = "";
    if (server == null) {
        if (checkingRam) {return ramCheckRes;}
        return Promise.reject(makeRuntimeRejectMsg(workerScript, "Failed to identify server. This is a bug please report to dev", exp));
    }
    for (var i = 0; i < server.scripts.length; ++i) {
        if (server.scripts[i].filename === scriptName) {
            code = server.scripts[i].code;
            break;
        }
    }
    if (code === "") {
        if (checkingRam) {return ramCheckRes;}
        return Promise.reject(makeRuntimeRejectMsg(workerScript, "Could not find script " + scriptName + " to import", exp));
    }

    //Create the AST
    try {
        var ast = parse(code, {sourceType:"module"});
    } catch(e) {
        console.log("Failed to parse import script");
        if (checkingRam) {return ramCheckRes;}
        return Promise.reject(makeRuntimeRejectMsg(workerScript, "Failed to import functions from " + scriptName +
                                                                 " This is most likely due to a syntax error in the imported script", exp));
    }

    if (allFns) {
        //A namespace is implemented as a JS obj
        env.set(namespace, {});
        namespaceObj = env.get(namespace);
    }

    //Search through the AST for all imported functions
    var queue = [ast];
    while (queue.length != 0) {
        var node = queue.shift();
        switch (node.type) {
            case "BlockStatement":
            case "Program":
                for (var i = 0; i < node.body.length; ++i) {
                    if (node.body[i] instanceof Node) {
                        queue.push(node.body[i]);
                    }
                }
                break;
            case "FunctionDeclaration":
                if (node.id && node.id.name) {
                    if (allFns) {
                        //Import all functions under this namespace
                        if (checkingRam) {
                            ramCheckRes.push(node);
                        } else {
                            namespaceObj[node.id.name] = node;
                        }
                    } else {
                        //Only import specified functions
                        if (fnNames.includes(node.id.name)) {
                            if (checkingRam) {
                                ramCheckRes.push(node);
                            } else {
                                env.set(node.id.name, node);
                            }

                        }
                    }
                } else {
                    if (checkingRam) {return ramCheckRes;}
                    return Promise.reject(makeRuntimeRejectMsg(workerScript, "Invalid function declaration in imported script " + scriptName, exp));
                }
                break;
            default:
                break;
        }

        for (var prop in node) {
            if (node.hasOwnProperty(prop)) {
                if (node[prop] instanceof Node) {
                    queue.push(node[prop]);
                }
            }
        }
    }
    if (!checkingRam) {workerScript.scriptRef.log("Imported functions from " + scriptName);}
    if (checkingRam) {return ramCheckRes;}
    return Promise.resolve(true);
}

export function killNetscriptDelay(workerScript) {
    if (workerScript instanceof WorkerScript) {
        if (workerScript.delay) {
            clearTimeout(workerScript.delay);
            workerScript.delayResolve();
        }
    }
}

export function netscriptDelay(time, workerScript) {
    return new Promise(function(resolve, reject) {
       workerScript.delay = setTimeoutRef(() => {
           workerScript.delay = null;
           resolve();
       }, time);
       workerScript.delayResolve = resolve;
   });
}

export function makeRuntimeRejectMsg(workerScript, msg, exp=null) {
    var lineNum = "";
    if (exp != null) {
        var num = getErrorLineNumber(exp, workerScript);
        lineNum = " (Line " + num + ")"
    }
    return "|"+workerScript.serverIp+"|"+workerScript.name+"|" + msg + lineNum;
}

//Run a script from inside a script using run() command
export function runScriptFromScript(server, scriptname, args, workerScript, threads=1) {
    //Check if the script is already running
    var runningScriptObj = findRunningScript(scriptname, args, server);
    if (runningScriptObj != null) {
        workerScript.scriptRef.log(scriptname + " is already running on " + server.hostname);
        return Promise.resolve(false);
    }

    //'null/undefined' arguments are not allowed
    for (var i = 0; i < args.length; ++i) {
        if (args[i] == null) {
            workerScript.scriptRef.log("ERROR: Cannot execute a script with null/undefined as an argument");
            return Promise.resolve(false);
        }
    }

    //Check if the script exists and if it does run it
    for (var i = 0; i < server.scripts.length; ++i) {
        if (server.scripts[i].filename == scriptname) {
            //Check for admin rights and that there is enough RAM availble to run
            var script = server.scripts[i];
            var ramUsage = script.ramUsage;
            threads = Math.round(Number(threads)); //Convert to number and round
            if (threads === 0) { return Promise.resolve(false); }
            ramUsage = ramUsage * threads;
            var ramAvailable = server.maxRam - server.ramUsed;

            if (server.hasAdminRights == false) {
                workerScript.scriptRef.log("Cannot run script " + scriptname + " on " + server.hostname + " because you do not have root access!");
                return Promise.resolve(false);
            } else if (ramUsage > ramAvailable){
                workerScript.scriptRef.log("Cannot run script " + scriptname + "(t=" + threads + ") on " + server.hostname + " because there is not enough available RAM!");
                return Promise.resolve(false);
            } else {
                //Able to run script
                if(workerScript.disableLogs.ALL == null && workerScript.disableLogs.exec == null && workerScript.disableLogs.run == null && workerScript.disableLogs.spawn == null) {
                    workerScript.scriptRef.log("Running script: " + scriptname + " on " + server.hostname + " with " + threads + " threads and args: " + arrayToString(args) + ". May take a few seconds to start up...");
                }
                var runningScriptObj = new RunningScript(script, args);
                runningScriptObj.threads = threads;
                server.runningScripts.push(runningScriptObj);    //Push onto runningScripts
                addWorkerScript(runningScriptObj, server);
                return Promise.resolve(true);
            }
        }
    }
    workerScript.scriptRef.log("Could not find script " + scriptname + " on " + server.hostname);
    return Promise.resolve(false);
}

export function getErrorLineNumber(exp, workerScript) {
    var code = workerScript.scriptRef.codeCode();

    //Split code up to the start of the node
    try {
        code = code.substring(0, exp.start);
        return (code.match(/\n/g) || []).length + 1;
    } catch(e) {
        return -1;
    }
}

export function isScriptErrorMessage(msg) {
    if (!isString(msg)) {return false;}
    let splitMsg = msg.split("|");
    if (splitMsg.length != 4){
        return false;
    }
    var ip = splitMsg[1];
    if (!isValidIPAddress(ip)) {
        return false;
    }
    return true;
}
