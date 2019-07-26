
import * as path from "path";
import { BaseServer } from "../BaseServer";
import {OverwriteStrategy} from "./OverwriteStrategy";
import {VersioningStrategy} from "./VersioningStrategy";
import { getServer } from "../AllServers";

export function scp(server: BaseServer, term: any, out:Function, err:Function, args: string[], options:any={recursive:false, verbose:false, targetAsDirectory:true, targetDir:undefined, backup:VersioningStrategy.EXISTING, overwriteStrategy:OverwriteStrategy.NO_CLOBBER, suffix:"~", to:undefined, destServer:undefined}) {
    const HELP_MESSAGE: string = "Usage: scp <-f --force> <-u --update> <-v --verbose> <-n --no-clobber> <--help> <-S --suffix suffix> <-b --backup numbered,simple,existing,none> <-t --target-directory=DIRECTORY> <-r --recursive> <-T --no-target-directory> --to=SERVER SOURCE... DEST";
    const TOO_MANY_ARGUMENTS_ERROR: string = "Too many arguments";
    const INVALID_PATH_ERROR: string = "Invalid path";
    const NO_PATHS_PROVIDED: string = "No paths provided";
    const NO_SOURCES_PROVIDED: string = "No sources provided";
    const INCORRECT_PATH: string = "Incorrect path provided ";
    const SOURCE_IS_RUNNING: string = " is used by another process, cannot be moved.";
    const cwd: string = term.currDir;
    let error: string;
    let dest:string = "";
    let srcs: string[] = [];
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
            case "--to": {
                if (args.length > 0) { options.to = args.shift() as string; } else { throw HELP_MESSAGE; }
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
            case "-S":
            case "--suffix": {
                if (args.length > 0) { options.suffix = args.shift() as string; } else { throw HELP_MESSAGE; }
                break;
            }
            case "-t":
            case "--target-directory": {
                if (args.length > 0) { options.targetDir = args.shift() as string; } else { throw HELP_MESSAGE; }
                break;
            }
            case "-T":
            case "--no-target-directory": {
                options.targetAsDirectory = false;
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
                    srcs.push(arg as string);
                    break;
        }
    }
    if (srcs.length == 0) { throw NO_PATHS_PROVIDED; }
    if (!options.targetDir && srcs.length == 1) { throw NO_SOURCES_PROVIDED; }
    if(!options.targetDir){
        dest = term.getFilepath(srcs.pop())
    }else{
        dest = term.getFilepath(options.targetDir);
    }
    if(!options.targetAsDirectory && (srcs.length > 1 || server.isDir(srcs[0]))) {
        throw "Cannot copy multiple files into a single filename.";
    }
    if (!options.to){
        throw "You must provide a target server using the --to SERVER argument";
    }
    if(!options.destServer){ // check for testing purposes when testing without the game being loaded.
        options.destServer = getServer(options.to);
    }

    if(!options.destServer){ // this one is the real null check though.
        throw `Unknown server ${options.to}`;
    }
    if(options.destServer.exists(dest)){
        if(options.destServer.isDir(dest) && !options.targetAsDirectory) {err(`${dest} already exists as a directory. `)}
        else if(!options.destServer.isDir(dest) && options.targetAsDirectory) {err(`${dest} already exists as a file. `)}
    }
    dest = path.resolve(dest) + ((options.targetAsDirectory)?"/":"");
    const processed = new Set<string>();
    processed.add(dest);
    // this way we cannot copy a folder into itself.
    // ex: copy all the content of /src/ into /src/test/ will not copy the content of /src/test/ as src/test/test/, only /src/ content.
    while (srcs.length > 0) {
        let src = term.getFilepath(srcs.pop());
        if (src === dest) { err(`Cannot copy ${src} on itself. Skipping it.`); continue; }
        if (processed.has(src)) { continue; }
        processed.add(src);
        if (!server.exists(src)) {
            err(`${src} doesn't exist.`);
        } else if (server.isDir(src)) {// if its a directory we copy all of its content recursively.
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
            let destFilename = "";
            if(options.targetAsDirectory) destFilename = path.resolve(dest + src);
            else destFilename = path.resolve(dest);
            // is it running?
            if (server.isRunning(src)) {
                err(src + SOURCE_IS_RUNNING);
                return;
            }
            let fileSuffix = options.suffix;
            // would it overwrite something?
            if (options.destServer.exists(destFilename)) { // if so we first determine the versionning suffix.
                let version: number = 1;
                // here we verify the versioning naming scheme of the new file to be replaced.
                switch (options.backup) {
                    case VersioningStrategy.NONE:
                        fileSuffix = "";
                        break;
                    case VersioningStrategy.SIMPLE:
                        break;
                    case VersioningStrategy.NUMBERED:
                        while (options.destServer.exists(destFilename + fileSuffix + version)) { version ++; }// find the first available version number.
                        fileSuffix += version;
                        break;
                    case VersioningStrategy.EXISTING:
                        while (options.destServer.exists(destFilename + fileSuffix + version)) { version ++; }
                        if (version > 1) { fileSuffix = version.toString(); }// if it is numbered, the version will be > 1, else it's a simple versionning mode.
                        break;
                }
                destFilename += fileSuffix;
            }
            if (options.destServer.exists(destFilename)) { // this is called if no versioning control is applied or another backup already exists in SIMPLE backup mode.
                // here we either continue to modify the file, or we skip the file altogether.
                switch (options.overwriteStrategy) {
                    case OverwriteStrategy.INTERACTIVE: {
                        // TODO needs a way to get user input from the terminal.
                        err("Interactive strategy is not implemented yet.");
                        return;
                    }
                    case OverwriteStrategy.NO_CLOBBER: {
                        if (options.verbose) { out(`A file named ${destFilename} already exists.`); }
                        continue;
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

            options.destServer.writeFile(destFilename, server.readFile(src), options);
            out(`'${src}' -> '${destFilename}'`);
            // => is there a directory with this name? if so fail
            // => is it a file? If so depending on the overwriting strategy:
            // FORCE > overwrite
            // INTERACTIVE > TODO asks the user for permission, currently impossible due to having no access to user input from a running program.
            // NO_CLUBBER > do not copy if a file exists with the same name.
            // UPDATE > copy only if the copied file is more recent.
        }
    }
    return ;
}

