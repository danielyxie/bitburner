import * as path from "path";
import { BaseServer } from "../BaseServer";
import { Script} from "../../Script/Script";

import { numeralWrapper } from "../../ui/numeralFormat";

export function mem(server: BaseServer, term: any, out:Function, err:Function, args: string[], options:any={threads:1, recursive:false}) {
    const HELP_MESSAGE: string = "Usage: mem <--help> <-t --threads=THREADS> <-r --recursive> SCRIPT...";
    const INVALID_PATH_ERROR: string = "Invalid path";
    const NO_PATHS_PROVIDED: string = "No target provided";
    const INCORRECT_PATH: string = "Incorrect path provided ";
    const cwd: string = term.currDir;
    let srcs:string[] = [];
    while (args.length > 0) {
        const arg = args.shift() as string;
        switch (arg) {
            case "-h":
            case "--help":
                out(HELP_MESSAGE);
                return;
            case "-t":
            case "--threads": {

                if (args.length > 0) { options.threads = Math.round(parseInt(args.shift() as string)); }
                else { throw HELP_MESSAGE; }
                break;
            }
            case "-r":
            case "--recursive": {
                options.recursive = true;
                break;
            }
            default:
                srcs.push(arg);
                break;
        }
    }
    if (srcs.length==0) {
        err(NO_PATHS_PROVIDED);
        return;
    };
    if (isNaN(options.threads)){
        err("Invalid number of threads specified. Number of threads must be greater than 1");
        return;
    };
    const processed = new Set<string>();
    while (srcs.length > 0) {
        let src = term.getFilepath(srcs.pop());
        if (processed.has(src)) { continue; }
        processed.add(src);
        if (!server.exists(src)) { err(`${src} doesn't exists.`);}
        else if (server.isDir(src)) {// if its a directory we copy all of its content recursively.
            src = src + ((src.endsWith("/")) ? "" : "/");
            for (const element of server.readdir(src, {withFileTypes:true})) {
                if (element.isDirectory()) {
                    if (options.recursive) {
                        srcs.push(src + element.name + "/");
                    }
                } else if (element.isFile()) {
                    srcs.push(src + element.name);
                }
            }
        } else { // it's a file, we copy it.
            const script = server.getScript(src);
            if (script == null) {

                if (server.isExecutable(src)){
                    err(`${src} never evaluated yet, starting calculations.. try again in a few seconds.`);
                    new Script(src, server.ip).update();
                }else{
                    err(`${src} is not an executable.`)
                }
                continue;
            }
            const ramUsage = script.ramUsage * options.threads ;
            out(`${src} requires ${numeralWrapper.format(ramUsage, '0.00')} GB of RAM to run for ${options.threads } thread(s)`);
        }
    }
}
import {registerExecutable, ManualEntry} from "./sys";

const MANUAL = new ManualEntry(
`mem - Displays the amount of RAM needed to run the specified script`,
`mem [-t|--threads=THREADS] SCRIPTNAME `,
`Displays the amount of RAM needed to run the specified script with a
single thread.

The command can also be used to print the amount of RAM
needed to run a script with THREADS threads using the '-t' flag.


-t,--threads=THREADS
    calculate the amount of RAM needed for THREADS threads

--help
    display this help and exit
`)
registerExecutable("mem", mem, MANUAL);
