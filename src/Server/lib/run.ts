import { BaseServer } from "../BaseServer";
import {registerExecutable, ManualEntry, fetchUsage, fetchExecutable} from "./sys";
import { startWorkerScript } from "../../NetscriptWorker";
import { RunningScript } from "../../Script/RunningScript";
import{ Script } from "../../Script/Script";
import { findRunningScript } from "../../Script/ScriptHelpers";
import { Player } from "../../Player";


export async function run(server:BaseServer, term:any, out:Function, err:Function, args:string[], options:any={}){
    //TODO change the Player as any to Player, but this requires registering various
    // functions like getContractReward and such as part of the Player type definition, couldn't get
    // it to register the functions. so I disabled the checking with any for those calls.
    if (args.length < 1) {
        err("You must specify an executable.");
    } else {
        // [executableName, ...args] -> executableName, [...args]
        var executableName = args.shift() as string;

        // Secret Music player!
        if (executableName === "musicplayer") {
            out('<iframe src="https://open.spotify.com/embed/user/danielyxie/playlist/1ORnnL6YNvXOracUaUV2kh" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>', false);
            return;
        }

        // Check if its a script or just a program/executable
        if((Player as any).hasProgram(executableName)){
            let executable = fetchExecutable(executableName)
            if(executable) {
                executable(server, term, out, err, args);
                return;
            }
        }
        else if (executableName.endsWith(".cct")){
            await _runContract(server, term, out, err, executableName);
            return;
        }
        else if(server.exists(executableName)){
            _runScript(server, term, out, err, executableName, args);
            return;
        }

        err(`${executableName} not found`)
        return;
    }
}

import {
    CodingContract,
    CodingContractResult,
    CodingContractRewardType
} from "../../CodingContracts";

async function _runContract(server:BaseServer, term:any, out:Function, err:Function, contractName:string){
    // There's already an opened contract
    if (term.contractOpen) {
        return err("ERROR: There's already a Coding Contract in Progress");
    }

    const serv = server;
    const contract = serv.getContract(contractName);
    if (contract == null) {
        return err("ERROR: No such contract");
    }

    term.contractOpen = true;
    const res = await contract.prompt();

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

function _runScript(server:BaseServer, term:any, out:Function, err:Function, scriptName:string, args:string[]){
    let numThreads = 1;
    const Scriptargs = [];

    console.log(`Trying to run script "${scriptName}"`);
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
        err("ERROR: This script is already running. Cannot run multiple instances");
        return;
    }
    console.log(`Has Admin rights? ${server.hasAdminRights}`);
    if(!server.hasAdminRights) {
        err(`ERROR: Need root access to run script`);
        return;
    }
    console.log(`Exists? ${server.exists(scriptName)}`);
    if(!server.exists(scriptName)) {
        err(`ERROR: No such script`);
        return;
    }
    console.log(`is Executable? ${server.isExecutable(scriptName)}`);
    if(!server.isExecutable(scriptName)) {
        err(`ERROR: Not an executable`);
        return;
    }
    let script = server.scriptsMap[scriptName];
    if(!script || isNaN(script.ramUsage)){ // if the file has not been analyzed yet (created by another file? or update ongoing, or invalid syntax?)
        //TODO maybe add a "loading time" for those? where the Ram calculation is ran before running the script, asynchronously.
        err(`ERROR: Script RAM usage not calculated yet! Please open the script with nano first, or try again in a few seconds.`);
        if (!script){
            script = new Script(scriptName, server.ip);
            server.scriptsMap[scriptName] = script;
            script.updateRamUsage();
            script.markUpdated();
        }
        return;
    }
    let ramUsage = script.ramUsage * numThreads;
    let ramAvailable = server.maxRam - server.ramUsed;
    console.log(`RAM needed [t=${numThreads}]${ramUsage} / ${ramAvailable}; enough? ${ramUsage <= ramAvailable}`)
    if(ramUsage > ramAvailable){
        err(`This machine does not have enough RAM to run this script with ${numThreads} threads. Script requires ${ramUsage} GB of RAM`);
        return;
    }
    // Able to run script
    var runningScriptObj = new RunningScript(script, Scriptargs);
    runningScriptObj.threads = numThreads;
    if (startWorkerScript(runningScriptObj, server)) {
        out("Running script with " + numThreads +  " thread(s) and args: " + JSON.stringify(args) + ".");
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
