import { BaseServer } from "../BaseServer";
import * as path from 'path';

export function cd(server: BaseServer, term: any, out:Function, err:Function, args: string[], options:any={}){
    if (args.length < 1) {
        return;
    }

    let dir = path.resolve(term.currDir+"/"+args[0]);


    // Ignore trailing slashes
    if (!server.exists(dir)) {
        err(`${dir} doesn't exists.`);
        return;
    }


    term.currDir = dir;

    // Reset input to update current directory on UI
    term.resetTerminalInput();
}


import {registerExecutable, ManualEntry} from "./sys";

const MANUAL = new ManualEntry(
`cd - prints details and statistics about the current server.`,
`cd DIRECTORY`,
`Change the curent working directory to the specified directory. The directory DIRECTORY must exist.`)
registerExecutable("cd", cd, MANUAL);
