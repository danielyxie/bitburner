/**
 * Functions for handling WorkerScripts, which are the underlying mechanism
 * that allows for scripts to run
 */
import { killWorkerScript } from "./Netscript/killWorkerScript";
import { WorkerScript } from "./Netscript/WorkerScript";
import { workerScripts } from "./Netscript/WorkerScripts";
import { WorkerScriptStartStopEventEmitter } from "./Netscript/WorkerScriptStartStopEventEmitter";
import { generateNextPid } from "./Netscript/Pid";

import { CONSTANTS } from "./Constants";
import { Interpreter } from "./ThirdParty/JSInterpreter";
import { isScriptErrorMessage, makeRuntimeRejectMsg } from "./NetscriptEvaluator";
import { NetscriptFunctions } from "./NetscriptFunctions";
import { executeJSScript } from "./NetscriptJSEvaluator";
import { NetscriptPort, IPort } from "./NetscriptPort";
import { RunningScript } from "./Script/RunningScript";
import { getRamUsageFromRunningScript } from "./Script/RunningScriptHelpers";
import { scriptCalculateOfflineProduction } from "./Script/ScriptHelpers";
import { Script } from "./Script/Script";
import { GetAllServers } from "./Server/AllServers";
import { BaseServer } from "./Server/BaseServer";
import { Settings } from "./Settings/Settings";

import { generate } from "escodegen";

import { dialogBoxCreate } from "./ui/React/DialogBox";
import { arrayToString } from "./utils/helpers/arrayToString";
import { roundToTwo } from "./utils/helpers/roundToTwo";
import { isString } from "./utils/helpers/isString";
import { sprintf } from "sprintf-js";

import { parse } from "acorn";
import { simple as walksimple } from "acorn-walk";
import { areFilesEqual } from "./Terminal/DirectoryHelpers";
import { Player } from "./Player";

// Netscript Ports are instantiated here
export const NetscriptPorts: IPort[] = [];
for (let i = 0; i < CONSTANTS.NumNetscriptPorts; ++i) {
  NetscriptPorts.push(NetscriptPort());
}

export function prestigeWorkerScripts(): void {
  for (const ws of workerScripts.values()) {
    ws.env.stopFlag = true;
    killWorkerScript(ws);
  }

  WorkerScriptStartStopEventEmitter.emit();
  workerScripts.clear();
}

// JS script promises need a little massaging to have the same guarantees as netscript
// promises. This does said massaging and kicks the script off. It returns a promise
// that resolves or rejects when the corresponding worker script is done.
function startNetscript2Script(workerScript: WorkerScript): Promise<WorkerScript> {
  workerScript.running = true;

  // The name of the currently running netscript function, to prevent concurrent
  // calls to hack, grow, etc.
  let runningFn: string | null = null;

  // We need to go through the environment and wrap each function in such a way that it
  // can be called at most once at a time. This will prevent situations where multiple
  // hack promises are outstanding, for example.
  function wrap(propName: string, f: (...args: any[]) => Promise<void>): (...args: any[]) => Promise<void> {
    // This function unfortunately cannot be an async function, because we don't
    // know if the original one was, and there's no way to tell.
    return function (...args: any[]) {
      // Wrap every netscript function with a check for the stop flag.
      // This prevents cases where we never stop because we are only calling
      // netscript functions that don't check this.
      // This is not a problem for legacy Netscript because it also checks the
      // stop flag in the evaluator.
      if (workerScript.env.stopFlag) {
        throw workerScript;
      }

      if (propName === "asleep") return f(...args); // OK for multiple simultaneous calls to sleep.

      const msg =
        "Concurrent calls to Netscript functions not allowed! " +
        "Did you forget to await hack(), grow(), or some other " +
        "promise-returning function? (Currently running: %s tried to run: %s)";
      if (runningFn) {
        workerScript.errorMessage = makeRuntimeRejectMsg(workerScript, sprintf(msg, runningFn, propName));
        throw workerScript;
      }
      runningFn = propName;

      // If the function throws an error, clear the runningFn flag first, and then re-throw it
      // This allows people to properly catch errors thrown by NS functions without getting
      // the concurrent call error above
      let result;
      try {
        result = f(...args);
      } catch (e: any) {
        runningFn = null;
        throw e;
      }

      if (result && result.finally !== undefined) {
        return result.finally(function () {
          runningFn = null;
        });
      } else {
        runningFn = null;
        return result;
      }
    };
  }

  for (const prop in workerScript.env.vars) {
    if (typeof workerScript.env.vars[prop] !== "function") continue;
    workerScript.env.vars[prop] = wrap(prop, workerScript.env.vars[prop]);
  }

  // Note: the environment that we pass to the JS script only needs to contain the functions visible
  // to that script, which env.vars does at this point.
  return new Promise<WorkerScript>((resolve, reject) => {
    executeJSScript(workerScript.getServer().scripts, workerScript)
      .then(() => {
        resolve(workerScript);
      })
      .catch((e) => reject(e));
  }).catch((e) => {
    if (e instanceof Error) {
      if (e instanceof SyntaxError) {
        workerScript.errorMessage = makeRuntimeRejectMsg(workerScript, e.message + " (sorry we can't be more helpful)");
      } else {
        workerScript.errorMessage = makeRuntimeRejectMsg(
          workerScript,
          e.message + ((e.stack && "\nstack:\n" + e.stack.toString()) || ""),
        );
      }
      throw workerScript;
    } else if (isScriptErrorMessage(e)) {
      workerScript.errorMessage = e;
      throw workerScript;
    }
    throw e; // Don't know what to do with it, let's rethrow.
  });
}

function startNetscript1Script(workerScript: WorkerScript): Promise<WorkerScript> {
  const code = workerScript.code;
  workerScript.running = true;

  //Process imports
  let codeWithImports, codeLineOffset;
  try {
    const importProcessingRes = processNetscript1Imports(code, workerScript);
    codeWithImports = importProcessingRes.code;
    codeLineOffset = importProcessingRes.lineOffset;
  } catch (e: any) {
    dialogBoxCreate("Error processing Imports in " + workerScript.name + ":<br>" + e);
    workerScript.env.stopFlag = true;
    workerScript.running = false;
    killWorkerScript(workerScript);
    return Promise.resolve(workerScript);
  }

  const interpreterInitialization = function (int: any, scope: any): void {
    //Add the Netscript environment
    const ns = NetscriptFunctions(workerScript);
    for (const name in ns) {
      const entry = ns[name];
      if (typeof entry === "function") {
        //Async functions need to be wrapped. See JS-Interpreter documentation
        if (["hack", "grow", "weaken", "sleep", "prompt", "manualHack", "scp", "write"].includes(name)) {
          const tempWrapper = function (...args: any[]): void {
            const fnArgs = [];

            //All of the Object/array elements are in JSInterpreter format, so
            //we have to convert them back to native format to pass them to these fns
            for (let i = 0; i < args.length - 1; ++i) {
              if (typeof args[i] === "object" || args[i].constructor === Array) {
                fnArgs.push(int.pseudoToNative(args[i]));
              } else {
                fnArgs.push(args[i]);
              }
            }
            const cb = args[args.length - 1];
            const fnPromise = entry(...fnArgs);
            fnPromise
              .then(function (res: any) {
                cb(res);
              })
              .catch(function (err: any) {
                // workerscript is when you cancel a delay
                if (!(err instanceof WorkerScript)) console.error(err);
              });
          };
          int.setProperty(scope, name, int.createAsyncFunction(tempWrapper));
        } else if (
          name === "sprintf" ||
          name === "vsprintf" ||
          name === "scp" ||
          name == "write" ||
          name === "tryWrite" ||
          name === "run" ||
          name === "exec"
        ) {
          const tempWrapper = function (...args: any[]): void {
            const fnArgs = [];

            //All of the Object/array elements are in JSInterpreter format, so
            //we have to convert them back to native format to pass them to these fns
            for (let i = 0; i < args.length; ++i) {
              if (typeof args[i] === "object" || args[i].constructor === Array) {
                fnArgs.push(int.pseudoToNative(args[i]));
              } else {
                fnArgs.push(args[i]);
              }
            }

            return entry(...fnArgs);
          };
          int.setProperty(scope, name, int.createNativeFunction(tempWrapper));
        } else {
          const tempWrapper = function (...args: any[]): any {
            const res = entry(...args);

            if (res == null) {
              return res;
            } else if (res.constructor === Array || res === Object(res)) {
              //Objects and Arrays must be converted to the interpreter's format
              return int.nativeToPseudo(res);
            } else {
              return res;
            }
          };
          int.setProperty(scope, name, int.createNativeFunction(tempWrapper));
        }
      } else {
        //bladeburner, or anything else
        int.setProperty(scope, name, int.nativeToPseudo(entry));
      }
    }

    //Add the arguments
    int.setProperty(scope, "args", int.nativeToPseudo(workerScript.args));
  };

  let interpreter: any;
  try {
    interpreter = new Interpreter(codeWithImports, interpreterInitialization, codeLineOffset);
  } catch (e: any) {
    dialogBoxCreate("Syntax ERROR in " + workerScript.name + ":<br>" + e);
    workerScript.env.stopFlag = true;
    workerScript.running = false;
    killWorkerScript(workerScript);
    return Promise.resolve(workerScript);
  }

  return new Promise(function (resolve, reject) {
    function runInterpreter(): void {
      try {
        if (workerScript.env.stopFlag) {
          return reject(workerScript);
        }

        let more = true;
        let i = 0;
        while (i < 3 && more) {
          more = more && interpreter.step();
          i++;
        }

        if (more) {
          setTimeout(runInterpreter, Settings.CodeInstructionRunTime);
        } else {
          resolve(workerScript);
        }
      } catch (e: any) {
        e = e.toString();
        if (!isScriptErrorMessage(e)) {
          e = makeRuntimeRejectMsg(workerScript, e);
        }
        workerScript.errorMessage = e;
        return reject(workerScript);
      }
    }

    try {
      runInterpreter();
    } catch (e: any) {
      if (isString(e)) {
        workerScript.errorMessage = e;
        return reject(workerScript);
      } else if (e instanceof WorkerScript) {
        return reject(e);
      } else {
        return reject(workerScript);
      }
    }
  });
}

/*  Since the JS Interpreter used for Netscript 1.0 only supports ES5, the keyword
    'import' throws an error. However, since we want to support import funtionality
    we'll implement it ourselves by parsing the Nodes in the AST out.

    @param code - The script's code
    @returns {Object} {
        code: Newly-generated code with imported functions
        lineOffset: Net number of lines of code added/removed due to imported functions
                    Should typically be positive
    }
*/
function processNetscript1Imports(code: string, workerScript: WorkerScript): any {
  //allowReserved prevents 'import' from throwing error in ES5
  const ast: any = parse(code, {
    ecmaVersion: 9,
    allowReserved: true,
    sourceType: "module",
  });

  const server = workerScript.getServer();
  if (server == null) {
    throw new Error("Failed to find underlying Server object for script");
  }

  function getScript(scriptName: string): Script | null {
    for (let i = 0; i < server.scripts.length; ++i) {
      if (server.scripts[i].filename === scriptName) {
        return server.scripts[i];
      }
    }
    return null;
  }

  let generatedCode = ""; // Generated Javascript Code
  let hasImports = false;

  // Walk over the tree and process ImportDeclaration nodes
  walksimple(ast, {
    ImportDeclaration: (node: any) => {
      hasImports = true;
      let scriptName = node.source.value;
      if (scriptName.startsWith("./")) {
        scriptName = scriptName.slice(2);
      }
      const script = getScript(scriptName);
      if (script == null) {
        throw new Error("'Import' failed due to invalid script: " + scriptName);
      }
      const scriptAst = parse(script.code, {
        ecmaVersion: 9,
        allowReserved: true,
        sourceType: "module",
      });

      if (node.specifiers.length === 1 && node.specifiers[0].type === "ImportNamespaceSpecifier") {
        // import * as namespace from script
        const namespace = node.specifiers[0].local.name;
        const fnNames: string[] = []; //Names only
        const fnDeclarations: any[] = []; //FunctionDeclaration Node objects
        walksimple(scriptAst, {
          FunctionDeclaration: (node: any) => {
            fnNames.push(node.id.name);
            fnDeclarations.push(node);
          },
        });

        //Now we have to generate the code that would create the namespace
        generatedCode += "var " + namespace + ";\n" + "(function (namespace) {\n";

        //Add the function declarations
        fnDeclarations.forEach((fn: any) => {
          generatedCode += generate(fn);
          generatedCode += "\n";
        });

        //Add functions to namespace
        fnNames.forEach((fnName) => {
          generatedCode += "namespace." + fnName + " = " + fnName;
          generatedCode += "\n";
        });

        //Finish
        generatedCode += "})(" + namespace + " || " + "(" + namespace + " = {}));\n";
      } else {
        //import {...} from script

        //Get array of all fns to import
        const fnsToImport: string[] = [];
        node.specifiers.forEach((e: any) => {
          fnsToImport.push(e.local.name);
        });

        //Walk through script and get FunctionDeclaration code for all specified fns
        const fnDeclarations: any[] = [];
        walksimple(scriptAst, {
          FunctionDeclaration: (node: any) => {
            if (fnsToImport.includes(node.id.name)) {
              fnDeclarations.push(node);
            }
          },
        });

        //Convert FunctionDeclarations into code
        fnDeclarations.forEach((fn: any) => {
          generatedCode += generate(fn);
          generatedCode += "\n";
        });
      }
    },
  });

  //If there are no imports, just return the original code
  if (!hasImports) {
    return { code: code, lineOffset: 0 };
  }

  //Remove ImportDeclarations from AST. These ImportDeclarations must be in top-level
  let linesRemoved = 0;
  if (ast.type !== "Program" || ast.body == null) {
    throw new Error("Code could not be properly parsed");
  }
  for (let i = ast.body.length - 1; i >= 0; --i) {
    if (ast.body[i].type === "ImportDeclaration") {
      ast.body.splice(i, 1);
      ++linesRemoved;
    }
  }

  //Calculated line offset
  const lineOffset = (generatedCode.match(/\n/g) || []).length - linesRemoved;

  //Convert the AST back into code
  code = generate(ast);

  //Add the imported code and re-generate in ES5 (JS Interpreter for NS1 only supports ES5);
  code = generatedCode + code;

  const res = {
    code: code,
    lineOffset: lineOffset,
  };
  return res;
}

/**
 * Used to start a RunningScript (by creating and starting its
 * corresponding WorkerScript), and add the RunningScript to the server on which
 * it is active
 * @param {RunningScript} runningScriptObj - Script that's being run
 * @param {Server} server - Server on which the script is to be run
 * @returns {number} pid of started script
 */
export function startWorkerScript(runningScript: RunningScript, server: BaseServer, parent?: WorkerScript): number {
  if (createAndAddWorkerScript(runningScript, server, parent)) {
    // Push onto runningScripts.
    // This has to come after createAndAddWorkerScript() because that fn updates RAM usage
    server.runScript(runningScript);

    // Once the WorkerScript is constructed in createAndAddWorkerScript(), the RunningScript
    // object should have a PID assigned to it, so we return that
    return runningScript.pid;
  }

  return 0;
}

/**
 * Given a RunningScript object, constructs its corresponding WorkerScript,
 * adds it to the global 'workerScripts' pool, and begins executing it.
 * @param {RunningScript} runningScriptObj - Script that's being run
 * @param {Server} server - Server on which the script is to be run
 * returns {boolean} indicating whether or not the workerScript was successfully added
 */
function createAndAddWorkerScript(runningScriptObj: RunningScript, server: BaseServer, parent?: WorkerScript): boolean {
  // Update server's ram usage
  let threads = 1;
  if (runningScriptObj.threads && !isNaN(runningScriptObj.threads)) {
    threads = runningScriptObj.threads;
  } else {
    runningScriptObj.threads = 1;
  }
  const oneRamUsage = getRamUsageFromRunningScript(runningScriptObj);
  const ramUsage = roundToTwo(oneRamUsage * threads);
  const ramAvailable = server.maxRam - server.ramUsed;
  if (ramUsage > ramAvailable) {
    dialogBoxCreate(
      `Not enough RAM to run script ${runningScriptObj.filename} with args ` +
        `${arrayToString(runningScriptObj.args)}. This likely occurred because you re-loaded ` +
        `the game and the script's RAM usage increased (either because of an update to the game or ` +
        `your changes to the script.)`,
    );
    return false;
  }

  server.updateRamUsed(roundToTwo(server.ramUsed + ramUsage), Player);

  // Get the pid
  const pid = generateNextPid();
  if (pid === -1) {
    throw new Error(
      `Failed to start script because could not find available PID. This is most ` +
        `because you have too many scripts running.`,
    );
  }

  // Create the WorkerScript. NOTE: WorkerScript ctor will set the underlying
  // RunningScript's PID as well
  const s = new WorkerScript(runningScriptObj, pid, NetscriptFunctions);
  s.ramUsage = oneRamUsage;

  // Add the WorkerScript to the global pool
  workerScripts.set(pid, s);
  WorkerScriptStartStopEventEmitter.emit();

  // Start the script's execution
  let p: Promise<WorkerScript> | null = null; // Script's resulting promise
  if (s.name.endsWith(".js") || s.name.endsWith(".ns")) {
    p = startNetscript2Script(s);
  } else {
    p = startNetscript1Script(s);
    if (!(p instanceof Promise)) {
      return false;
    }
  }

  // Once the code finishes (either resolved or rejected, doesnt matter), set its
  // running status to false
  p.then(function (w: WorkerScript) {
    // On natural death, the earnings are transfered to the parent if it still exists.
    if (parent !== undefined) {
      if (parent.running) {
        parent.scriptRef.onlineExpGained += runningScriptObj.onlineExpGained;
        parent.scriptRef.onlineMoneyMade += runningScriptObj.onlineMoneyMade;
      }
    }

    killWorkerScript(s);
    w.log("", () => "Script finished running");
  }).catch(function (w) {
    if (w instanceof Error) {
      dialogBoxCreate("Script runtime unknown error. This is a bug please contact game developer");
      console.error("Evaluating workerscript returns an Error. THIS SHOULDN'T HAPPEN: " + w.toString());
      return;
    } else if (w instanceof WorkerScript) {
      if (isScriptErrorMessage(w.errorMessage)) {
        const errorTextArray = w.errorMessage.split("|DELIMITER|");
        if (errorTextArray.length != 4) {
          console.error("ERROR: Something wrong with Error text in evaluator...");
          console.error("Error text: " + w.errorMessage);
          return;
        }
        const hostname = errorTextArray[1];
        const scriptName = errorTextArray[2];
        const errorMsg = errorTextArray[3];

        let msg = `RUNTIME ERROR<br>${scriptName}@${hostname}<br>`;
        if (w.args.length > 0) {
          msg += `Args: ${arrayToString(w.args)}<br>`;
        }
        msg += "<br>";
        msg += errorMsg;

        dialogBoxCreate(msg);
        w.log("", () => "Script crashed with runtime error");
      } else {
        w.log("", () => "Script killed");
        return; // Already killed, so stop here
      }
      w.running = false;
      w.env.stopFlag = true;
    } else if (isScriptErrorMessage(w)) {
      dialogBoxCreate("Script runtime unknown error. This is a bug please contact game developer");
      console.error(
        "ERROR: Evaluating workerscript returns only error message rather than WorkerScript object. THIS SHOULDN'T HAPPEN: " +
          w.toString(),
      );
      return;
    } else {
      dialogBoxCreate("An unknown script died for an unknown reason. This is a bug please contact game dev");
      console.error(w);
    }

    killWorkerScript(s);
  });

  return true;
}

/**
 * Updates the online running time stat of all running scripts
 */
export function updateOnlineScriptTimes(numCycles = 1): void {
  const time = (numCycles * CONSTANTS._idleSpeed) / 1000; //seconds
  for (const ws of workerScripts.values()) {
    ws.scriptRef.onlineRunningTime += time;
  }
}

/**
 * Called when the game is loaded. Loads all running scripts (from all servers)
 * into worker scripts so that they will start running
 */
export function loadAllRunningScripts(): void {
  const skipScriptLoad = window.location.href.toLowerCase().indexOf("?noscripts") !== -1;
  if (skipScriptLoad) {
    console.info("Skipping the load of any scripts during startup");
  }
  for (const server of GetAllServers()) {
    // Reset each server's RAM usage to 0
    server.ramUsed = 0;

    // Reset modules on all scripts
    for (let i = 0; i < server.scripts.length; ++i) {
      server.scripts[i].markUpdated();
    }

    if (skipScriptLoad) {
      // Start game with no scripts
      server.runningScripts.length = 0;
    } else {
      for (let j = 0; j < server.runningScripts.length; ++j) {
        createAndAddWorkerScript(server.runningScripts[j], server);

        // Offline production
        scriptCalculateOfflineProduction(server.runningScripts[j]);
      }
    }
  }
}

/**
 * Run a script from inside another script (run(), exec(), spawn(), etc.)
 */
export function runScriptFromScript(
  caller: string,
  server: BaseServer,
  scriptname: string,
  args: any[],
  workerScript: WorkerScript,
  threads = 1,
): number {
  // Sanitize arguments
  if (!(workerScript instanceof WorkerScript)) {
    return 0;
  }

  if (typeof scriptname !== "string" || !Array.isArray(args)) {
    workerScript.log(caller, () => `Invalid arguments: scriptname='${scriptname} args='${args}'`);
    console.error(`runScriptFromScript() failed due to invalid arguments`);
    return 0;
  }

  args.forEach((arg) => {
    if (typeof arg !== "string" && typeof arg !== "number" && typeof arg !== "boolean")
      throw new Error("Only strings, numbers, and booleans can be passed as arguments to otherscripts.");
  });

  // Check if the script is already running
  const runningScriptObj = server.getRunningScript(scriptname, args);
  if (runningScriptObj != null) {
    workerScript.log(caller, () => `'${scriptname}' is already running on '${server.hostname}'`);
    return 0;
  }

  // 'null/undefined' arguments are not allowed
  for (let i = 0; i < args.length; ++i) {
    if (args[i] == null) {
      workerScript.log(caller, () => "Cannot execute a script with null/undefined as an argument");
      return 0;
    }
  }

  // Check if the script exists and if it does run it
  for (let i = 0; i < server.scripts.length; ++i) {
    if (!areFilesEqual(server.scripts[i].filename, scriptname)) continue;
    // Check for admin rights and that there is enough RAM availble to run
    const script = server.scripts[i];
    let ramUsage = script.ramUsage;
    threads = Math.round(Number(threads));
    if (threads === 0) {
      return 0;
    }
    ramUsage = ramUsage * threads;
    const ramAvailable = server.maxRam - server.ramUsed;

    if (server.hasAdminRights == false) {
      workerScript.log(caller, () => `You do not have root access on '${server.hostname}'`);
      return 0;
    } else if (ramUsage > ramAvailable) {
      workerScript.log(
        caller,
        () =>
          `Cannot run script '${scriptname}' (t=${threads}) on '${server.hostname}' because there is not enough available RAM!`,
      );
      return 0;
    } else {
      // Able to run script
      workerScript.log(
        caller,
        () => `'${scriptname}' on '${server.hostname}' with ${threads} threads and args: ${arrayToString(args)}.`,
      );
      const runningScriptObj = new RunningScript(script, args);
      runningScriptObj.threads = threads;

      return startWorkerScript(runningScriptObj, server, workerScript);
    }
    break;
  }

  workerScript.log(caller, () => `Could not find script '${scriptname}' on '${server.hostname}'`);
  return 0;
}
