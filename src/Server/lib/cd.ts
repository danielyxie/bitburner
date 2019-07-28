import { BaseServer } from "../BaseServer";
import {
    evaluateDirectoryPath,
    removeTrailingSlash
} from "../../Terminal/DirectoryHelpers";

export function cd(server: BaseServer, term: any, out:Function, err:Function, args: string[], options:any={}){
    if (args.length < 1) {
        return;
    } else {
        let dir = args[0];

        let evaledDir;
        if (dir === "/") {
            evaledDir = "/";
        } else {
            // Ignore trailing slashes
            dir = removeTrailingSlash(dir);

            evaledDir = evaluateDirectoryPath(server, dir, term.currDir);
            if (evaledDir == null || evaledDir === "") {
                err(`${dir} doesn't exists.`);
                return;
            }
        }

        term.currDir = evaledDir + ((evaledDir.endsWith("/"))?"":"/");

        // Reset input to update current directory on UI
        term.resetTerminalInput();
    }
}


import {registerExecutable, ManualEntry} from "./sys";

const MANUAL = new ManualEntry(
`cd - prints details and statistics about the current server.`,
`cd DIRECTORY`,
`Change the curent working directory to the specified directory. The directory DIRECTORY must exist.`)
registerExecutable("cd", cd, MANUAL);
