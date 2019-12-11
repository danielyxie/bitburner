import { BaseServer } from "../BaseServer";
import { registerExecutable, ManualEntry, fetchUsage, fetchExecutable } from "./sys";
import { startWorkerScript } from "../../NetscriptWorker";
import { RunningScript } from "../../Script/RunningScript";
import{ Script } from "../../Script/Script";
import { findRunningScript } from "../../Script/ScriptHelpers";
import { Player } from "../../Player";
import * as path from 'path';

export async function run(server:BaseServer, term:any, out:Function, err:Function, args:string[], options:any={}){
    //TODO change the Player as any to Player, but this requires registering various
    // functions like getContractReward and such as part of the Player type definition, couldn't get
    // it to register the functions. so I disabled the checking with any for those calls.
    const cwd: string = term.currDir;
    let player: any;
    if (!options.Player) {
        player = Player;
    } else {
        player = options.Player; // testing.
    }

    if (args.length < 1) {
        err("You must specify an executable.");
    } else {
        // [executableName, ...args] -> executableName, [...args]
        let executableName = args.shift() as string;

        if (executableName.endsWith(".exe")){
            let executable = fetchExecutable(executableName) // the owning check is already included here.
            if (executable) {
                executable(server, term, out, err, args);
                return;
            } else {
                err(`${executableName} not found`)
                return;
            }
        }

        // Secret Music player!
        if (executableName === "musicplayer") {
            out('<iframe src="https://open.spotify.com/embed/user/danielyxie/playlist/1ORnnL6YNvXOracUaUV2kh" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>', false);
            return;
        }

        // If we're not running a .exe, we have to search using the full path
        executableName = term.getFilepath(executableName);

        if (server.exists(executableName)){ //is it a script? (search is in O(1))
            return _runScript(server, term, out, err, executableName, args).catch((e)=>{err(e)});
        } else if (executableName.endsWith(".cct")){
            return _runContract(server, term, out, err, executableName).catch((e)=>{err(e)});
        }

        err(`${executableName} not found`)
        return;
    }
}

import { CodingContractResult } from "../../CodingContracts";

async function _runContract(server:BaseServer, term:any, out:Function, err:Function, contractName:string){
    // There's already an opened contract
    if (term.contractOpen) {
        err("There's already a Coding Contract in Progress");
        return;
    }

    const serv = server;
    const contract = serv.getContract(contractName);
    if (contract == null) {
        err("No such contract");
        return;
    }

    term.contractOpen = true;

    let res = await contract.prompt();

    switch (res) {
        case CodingContractResult.Success:
            var reward = (Player as any).gainCodingContractReward(contract.reward, contract.getDifficulty());
            out(`Contract SUCCESS - ${reward}`);
            serv.removeContract(contract);
            break;
        case CodingContractResult.Failure:
            ++contract.tries;
            if (contract.tries >= contract.getMaxNumTries()) {
                out("Contract <p style='color:red;display:inline'>FAILED</p> - Contract is now self-destructing");
                serv.removeContract(contract);
            } else {
                out(`Contract <p style='color:red;display:inline'>FAILED</p> - ${contract.getMaxNumTries() - contract.tries} tries remaining`);
            }
            break;
        case CodingContractResult.Cancelled:
        default:
            err("Contract cancelled");
            break;
    }
    term.contractOpen = false;

}

async function _runScript(server:BaseServer, term:any, out:Function, err:Function, scriptName:string, args:string[]){
    let numThreads = 1;
    const Scriptargs:string[] = [];

    if (args.length > 1) {
        if (args.length >= 3 && args[1] == "-t") {
            numThreads = Math.round(parseFloat(args[2]));
            if (isNaN(numThreads) || numThreads < 1) {
                err("Invalid number of threads specified. Number of threads must be greater than 0");
                return;
            }
            for (let i = 3; i < args.length; ++i) {
                Scriptargs.push(args[i]);
            }
        } else {
            for (let i = 1; i < args.length; ++i) {
                Scriptargs.push(args[i])
            }
        }
    }

    // Check if this script is already running
    if (findRunningScript(scriptName, Scriptargs, server) != null) {
        err("This script is already running. Cannot run multiple instances");
        return;
    }
    if(!server.hasAdminRights) {
        err(`Need root access to run script`);
        return;
    }
    if(!server.exists(scriptName)) {
        err(`No such script`);
        return;
    }
    if(!server.isExecutable(scriptName)) {
        err(`Not an executable`);
        return;
    }
    let script = server.scriptsMap[scriptName];
    if(!script){ // if the file has not been analyzed yet (created by another file? or update ongoing, or invalid syntax?)
        script = new Script(scriptName, server.ip);
        server.scriptsMap[scriptName] = script;
    }

    await script.updateRamUsage();
    if( isNaN(script.ramUsage) ){
        //inccorect syntax or something like that
        err(`RAM usage calculation impossible, check ${scriptName} for any syntax errors.`);
        return;
    }
    let ramUsage = script.ramUsage * numThreads;
    let ramAvailable = server.maxRam - server.ramUsed;
    if(ramUsage > ramAvailable){
        err(`This machine does not have enough RAM to run this script with ${numThreads} threads. Script requires ${ramUsage} GB of RAM`);
        return;
    }
    // Able to run script
    var runningScriptObj = new RunningScript(script, Scriptargs);
    runningScriptObj.threads = numThreads;
    if (startWorkerScript(runningScriptObj, server)) {
        out(`Running script ${script.filename} with ${numThreads} thread(s) and args: ${JSON.stringify(args)}.`);
    } else {
        err(`Failed to start script`);
    }
}

const MANUAL = new ManualEntry(
`run - execute an executable`,
`run SCRIPTFILE [-t=THREADS] [ARGS]...`,
`Execute an executable.

The '[-t]', '[num threads]', and '[args...]' arguments
are only valid when running a script. The '-t' flag is
used to indicate that the script should be run with the
specified number of threads. If the flag is omitted,
then the script will be run with a single thread by default.

If the '-t' flag is used, then it MUST come immediately after
the script name, and the [num threads] argument MUST come
immediately afterwards.

[ARGS]... represents a variable number of arguments that will
be passed into the script. See the documentation about script
arguments. Each specified argument must be separated by a
space.`)

registerExecutable("run", run, MANUAL);
