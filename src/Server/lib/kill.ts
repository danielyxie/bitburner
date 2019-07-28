import { BaseServer } from "../BaseServer";
import { killWorkerScript } from "../../Netscript/killWorkerScript";
import { Script} from "../../Script/Script";
import { RunningScript} from "../../Script/RunningScript";
import {registerExecutable, ManualEntry, fetchUsage} from "./sys";

export function kill(server:BaseServer, term:any, out:Function, err:Function, args:string[], options:any={}){
    const HELP_MESSAGE: string = fetchUsage("kill") as string;
    const INVALID_PATH_ERROR: string = "Invalid path";
    const NO_PATHS_PROVIDED: string = "No target provided";
    const INCORRECT_PATH: string = "Incorrect path provided ";
    const cwd: string = term.currDir;
    let data:string[] = [];
    while (args.length > 0) {
        if(options.PID) break;
        const arg = args.shift() as string;
        switch (arg) {
            case "-h":
            case "--help":
                out(HELP_MESSAGE);
                return;
            case "-p":
            case "--pid": {
                if (args.length > 0) { options.PID = parseInt(args.shift() as string); }
                else { throw HELP_MESSAGE; }
                break;
            }
            default:
                data.push(arg);
                break;
        }
    }
    let target:RunningScript|undefined;
    if(options.PID){
        target = server.getRunningScriptByPID(options.PID);
    }else{
        if( data.length==0) {
            err(NO_PATHS_PROVIDED);
            return;
        };

        let targetName = data.shift() as string;
        let targetArgs = data;
        target = server.getRunningScript(targetName, targetArgs);
    }
    if (!target) {
        err("No such script is running.");
        return;
    }
    killWorkerScript(target.pid);
    out(`Killing (PID=${target.pid}) ${target.filename} ${JSON.stringify(target.args)}`);

}


const MANUAL = new ManualEntry(
`kill - kill the specified script`,
`kill RUNNINGSCRIPT [ARGS]...
kill -p|--pid PID`,
`kill the specified RUNNINGSCRIPT. Each argument must be separated by a space.
Remember that a running script is uniquely identified by both its name and the
arguments that were used to run it. So, if a script was ran with the following
arguments:

    run foo.script 10 50000

Then in order to kill its process with 'kill' the same arguments must be used:

    kill foo.script 10 50000

--help
    display this help and exit

-p, --pid=PID
    uses the PID to identify the process
`)

registerExecutable("kill", kill, MANUAL);
