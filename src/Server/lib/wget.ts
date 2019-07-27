import * as path from "path";
import { BaseServer } from "../BaseServer";
import {OverwriteStrategy, acceptOverwrite} from "./OverwriteStrategy";
import {VersioningStrategy, getVersionCheck} from "./VersioningStrategy";

export function wget(server: BaseServer, term: any, out:Function, err:Function, args: string[], options:any={recursive:false, verbose:false,targetDir:undefined, backup:VersioningStrategy.EXISTING, overwriteStrategy:OverwriteStrategy.NO_CLOBBER, suffix:"~"}) {
    const HELP_MESSAGE: string = "Usage: wget <-f --force> <-u --update> <-n --no-clobber> <--help> <-S --suffix suffix> <-b --backup numbered,simple,existing,none> <-r --recursive> --from URL --to DEST";
    const TOO_MANY_ARGUMENTS_ERROR: string = "Too many arguments";
    const INVALID_PATH_ERROR: string = "Invalid path";
    const NO_PATHS_PROVIDED: string = "No paths provided";
    const NO_SOURCES_PROVIDED: string = "No sources provided";
    const INCORRECT_PATH: string = "Incorrect path provided ";
    const SOURCE_IS_RUNNING: string = " is used by another process, cannot be moved.";
    const cwd: string = term.currDir;
    let error: string;
    let dest:string = "";
    while (args.length > 0) {
        const arg = args.shift() as string;
        switch (arg) {
            case "-h":
            case "--help":
                out(HELP_MESSAGE);
                return;
            case "-v":
            case "--verbose": {
                options.verbose = true;
                break;
            }
            case "-f":
            case "--force": {
                options.overwriteStrategy = OverwriteStrategy.FORCE;
                break;
            }
            case "-n":
            case "--no-clobber": {
                options.overwriteStrategy = OverwriteStrategy.NO_CLOBBER;
                break;
            }
            case "-u":
            case "--update": {
                options.overwriteStrategy = OverwriteStrategy.UPDATE;
                break;
            }
            case "-r":
            case "--recursive": {
                options.recursive = true;
                break;
            }
            case "--from": {
                if (args.length > 0) { options.from = args.shift() as string; } else { throw HELP_MESSAGE; }
                break;
            }
            case "-S":
            case "--suffix": {
                if (args.length > 0) { options.suffix = args.shift() as string; } else { throw HELP_MESSAGE; }
                break;
            }
            case "--to": {
                if (args.length > 0) { options.targetDir = args.shift() as string; } else { throw HELP_MESSAGE; }
                break;
            }
            case "-b":
            case "--backup": {
                let value: string;
                if (args.length > 0) { value = args.shift() as string; } else { throw HELP_MESSAGE; }
                switch (value) {
                    case "none":
                        options.backup = VersioningStrategy.NONE;
                        break;
                    case "numbered":
                        options.backup = VersioningStrategy.NUMBERED;
                        break;
                    case "existing":
                        options.backup = VersioningStrategy.EXISTING;
                        break;
                    case "simple":
                        options.backup = VersioningStrategy.SIMPLE;
                        break;
                    default:
                        err(`${value} is not a valid versioning option.`);
                        throw new Error(`${value} is not a valid versioning option.`);
                }
                break;
            }
            default:
                throw HELP_MESSAGE;
        }
    }

    if (!options.from) { throw "You must provide a source URL."; }
    if (!options.targetDir) { throw NO_SOURCES_PROVIDED; }

    dest = term.getFilepath(options.targetDir);

    if(server.exists(dest)){
        if(server.isDir(dest) ) {err(`${dest} already exists as a directory. `)}
    }

    dest = path.resolve(dest);
    dest = getVersionCheck(server, out, err, dest, options)
    if (acceptOverwrite(server, out, err, dest, options)){
        return fetch(options.from)
            .then((response:any)=>{
                return response.text();
            })
            .then(function(data:string) {
                out(`content: ${data}`);
                server.writeFile(dest, data, options);
                out(`'${options.from}' -> '${dest}'`);
            })
            .catch(function(e:any) {
                err("wget failed: " + JSON.stringify(e))});
    }
}
