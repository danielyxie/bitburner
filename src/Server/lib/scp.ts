
import * as path from "path";
import { BaseServer } from "../BaseServer";
import {OverwriteStrategy, acceptOverwrite} from "./OverwriteStrategy";
import {VersioningStrategy, getVersionCheck} from "./VersioningStrategy";
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
                        return;
                }
                break;
            }
            default:
                    srcs.push(arg as string);
                    break;
        }
    }
    if (srcs.length == 0) { err( NO_PATHS_PROVIDED);return; }
    if (!options.targetDir && srcs.length == 1) { err(NO_SOURCES_PROVIDED);return; }
    if(!options.targetDir){
        dest = path.resolve(cwd+"/"+(srcs.pop()))
    }else{
        dest = path.resolve(cwd+"/"+options.targetDir);
    }
    if(!options.targetAsDirectory && (srcs.length > 1 || server.isDir(srcs[0]))) {
        err( "Cannot copy multiple files into a single filename.");
        return;
    }
    if (!options.to){
        err( "You must provide a target server using the --to SERVER argument");return;
    }
    if(!options.destServer){ // check for testing purposes when testing without the game being loaded.
        options.destServer = getServer(options.to);
    }

    if(!options.destServer){ // this one is the real null check though.
        err(`Unknown server ${options.to}`);return;
    }
    if(options.destServer.exists(dest)){
        if(options.destServer.isDir(dest) && !options.targetAsDirectory) {err(`${dest} already exists as a directory. `); return;}
        else if(!options.destServer.isDir(dest) && options.targetAsDirectory) {err(`${dest} already exists as a file. `); return;}
    }
    dest = path.resolve(dest) + ((options.targetAsDirectory)?"/":"");
    const processed = new Set<string>();
    if(server.isDir(dest)) processed.add(dest);
    // this way we cannot copy a folder into itself.
    // ex: copy all the content of /src/ into /src/test/ will not copy the content of /src/test/ as src/test/test/, only /src/ content.
    while (srcs.length > 0) {
        let src = path.resolve(cwd+"/"+srcs.pop());
        if (src === dest && options.destServer.ip == server.ip) { err(`Cannot copy ${src} on itself. Skipping it.`); continue; }
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

            destFilename = getVersionCheck(options.destServer, out, err, destFilename, options)
            if (acceptOverwrite(options.destServer, out, err, destFilename, options)){
                options.destServer.writeFile(destFilename, server.readFile(src), options);
            }
        }
    }
}

import {registerExecutable, ManualEntry} from "./sys";
const MANUAL = new ManualEntry(
`scp - copies the specified files to the target server.`,
`scp [OPTION]... --to=SERVER FILE... `,
`Copies the specified files from the current server to the target server SERVER.

--to=SERVER
    The hostname or IP of the target server.

-b, --backup[=CONTROL]
    make a backup of each existing destination file

-f, --force
    if an existing destination file cannot be opened, remove it
    and try again (this option is ignored when the -n option is
    also used)

-n, --no-clobber
    do not overwrite an existing file (overrides a previous -i
    option)

-r, --recursive
    copy directories recursively

-S, --suffix=SUFFIX
    override the usual backup suffix

-t, --target-directory=DIRECTORY
    copy all SOURCE arguments into DIRECTORY

-T, --no-target-directory
    treat DEST as a normal file

-v, --verbose
    explain what is being done

--help display this help and exit

The backup suffix is '~', unless set with --suffix or
SIMPLE_BACKUP_SUFFIX.  The version control method may be selected via
the --backup option or through the VERSION_CONTROL environment
variable.  Here are the values:

none
    never make backups (even if --backup is given)

numbered
    make numbered backups

existing
    numbered if numbered backups exist, simple otherwise

simple
    always make simple backups`)
registerExecutable("scp", scp, MANUAL);
