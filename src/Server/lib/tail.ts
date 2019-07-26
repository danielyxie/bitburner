
import * as path from "path";
import { BaseServer } from "../BaseServer";
import { Script} from "../../Script/Script";
import { RunningScript} from "../../Script/RunningScript";

import { logBoxCreate } from "../../../utils/LogBox";

export function tail(server: BaseServer, term: any, out:Function, err:Function, args: string[], options:any={target:undefined, logBox:false, args:[], PID:false}) {
    const HELP_MESSAGE: string = "Usage: tail <--help> <-p --pid=PID> <-l --log-box> SCRIPT SCRIPTARGS...";
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
            case "-l":
            case "--log-box": {
                options.logBox = true;
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
    if ( options.logBox )
        logBoxCreate(target);
    else {
        out(target.logs);
    }
}
