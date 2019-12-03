import { BaseServer } from "../BaseServer";
import { killWorkerScript } from "../../Netscript/killWorkerScript";
import { RunningScript} from "../../Script/RunningScript";
import {registerExecutable, ManualEntry, fetchUsage} from "./sys";
import { WorkerScriptStartStopEventEmitter } from "../../Netscript/WorkerScriptStartStopEventEmitter";

export function killall(server:BaseServer, term:any, out:Function, err:Function, args:string[], options:any={}){
    for(let i = server.runningScripts.length - 1; i >= 0; i--){
        out(`Killing (PID=${server.runningScripts[i].pid}) ${server.runningScripts[i].filename} ${JSON.stringify(server.runningScripts[i].args)}`);
        if(options.testing) server.stopScript(server.runningScripts[i]);
        else killWorkerScript(server.runningScripts[i].pid);

    }
    WorkerScriptStartStopEventEmitter.emitEvent();
}

const MANUAL = new ManualEntry(
`killall - kill all the current running scripts`,
`killall`,
`Kills all scripts on the current server. Note that
after the 'kill' command is issued for a script, it
may take a while for the script to actually stop running.

This will happen if the script is in the middle of a
command such as grow() or weaken() that takes time to
execute. The script will not be stopped/killed until after
that time has elapsed.`)

registerExecutable("killall", killall, MANUAL);
