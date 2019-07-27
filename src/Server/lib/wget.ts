import * as path from "path";
import { BaseServer } from "../BaseServer";
import {OverwriteStrategy} from "./OverwriteStrategy";
import {VersioningStrategy} from "./VersioningStrategy";
const fetch = require('node-fetch');

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
                // should be in the format optiona,optionb,optionc
                // where options are :
                //
                // none
                //   never make backups (even if --backup is given)
                // numbered
                //   make numbered backups
                // existing
                //   numbered if numbered backups exist, simple otherwise
                // simple
                //   always make simple backups
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
     // it's a file, we copy it.
    let destFilename = "";
    destFilename = path.resolve(dest);

    let fileSuffix = options.suffix;
    // would it overwrite something?
    if (server.exists(destFilename)) { // if so we first determine the versionning suffix.
        let version: number = 1;
        // here we verify the versioning naming scheme of the new file to be replaced.
        switch (options.backup) {
            case VersioningStrategy.NONE:
                fileSuffix = "";
                break;
            case VersioningStrategy.SIMPLE:
                break;
            case VersioningStrategy.NUMBERED:
                while (server.exists(destFilename + fileSuffix + version)) { version ++; }// find the first available version number.
                fileSuffix += version;
                break;
            case VersioningStrategy.EXISTING:
                while (server.exists(destFilename + fileSuffix + version)) { version ++; }
                if (version > 1) { fileSuffix = version.toString(); }// if it is numbered, the version will be > 1, else it's a simple versionning mode.
                break;
        }
        destFilename += fileSuffix;
    }
    if (server.exists(destFilename)) { // this is called if no versioning control is applied or another backup already exists in SIMPLE backup mode.
        // here we either continue to modify the file, or we skip the file altogether.
        switch (options.overwriteStrategy) {
            case OverwriteStrategy.INTERACTIVE: {
                // TODO needs a way to get user input from the terminal.
                err("Interactive strategy is not implemented yet.");
                return;
            }
            case OverwriteStrategy.NO_CLOBBER: {
                if (options.verbose) { out(`A file named ${destFilename} already exists.`); }
                return;
            }
            case OverwriteStrategy.UPDATE: {
                // TODO needs a way to determine the date of each file.
                err("Update strategy is not implemented yet.");
                return;
            }
            case OverwriteStrategy.FORCE: {
                if (options.verbose) { out(`Overwriting ${destFilename}`); }
                break;
            }
        }
    }
    return fetch(options.from)
        .then((response:any)=>{
            return response.text();
        })
        .then(function(data:string) {
            out(`content: ${data}`);
            server.writeFile(destFilename, data, options);
            out(`'${options.from}' -> '${destFilename}'`);
        })
        .catch(function(e:any) {
            err("wget failed: " + JSON.stringify(e))});

    // => is there a directory with this name? if so fail
    // => is it a file? If so depending on the overwriting strategy:
    // FORCE > overwrite
    // INTERACTIVE > TODO asks the user for permission, currently impossible due to having no access to user input from a running program.
    // NO_CLUBBER > do not copy if a file exists with the same name.
    // UPDATE > copy only if the copied file is more recent.
}
