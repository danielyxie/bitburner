import * as path from "path";
import { BaseServer } from "../BaseServer";

import {OverwriteStrategy, acceptOverwrite} from "./OverwriteStrategy";
import {VersioningStrategy, getVersionCheck} from "./VersioningStrategy";
/**
 *This function builds a string representation of the file tree from the target directory on the specified server and outputs it as a graphical tree.
 *
 * @export
 * @param {BaseServer} server The server on which we want to build the file tree.
 * @param {*} term The Terminal used by the player from which to get the current working directory and interact with the output.
 * @param {string[]} args The command args used by the Player in the terminal
 * @param {(string|undefined)} [targetDir=undefined] The root directory of the tree.
 * @param {number} [depth=2] The depth of folders to visit. Default is 2.
 * @param {number} [nodeLimit=50] The limit of files to parse, in order to avoid problems with large repositories. Set to -1 to disable.
 * @returns {string} The String representation of the file tree in a graphical manner.
 */
export function mv(server: BaseServer, term: any, out:Function, err:Function, args: string[], options:any={recursive:true, verbose:false, targetAsDirectory:true, targetDir:undefined, backup:VersioningStrategy.EXISTING, overwriteStrategy:OverwriteStrategy.NO_CLOBBER, suffix:"~"}) {
    // see mv man page: https://linux.die.net/man/1/mv
    const TOO_MANY_ARGUMENTS_ERROR: string = "Too many arguments";
    const INVALID_PATH_ERROR: string = "Invalid path";
    const NO_PATHS_PROVIDED: string = "No paths provided";
    const NO_SOURCES_PROVIDED: string = "No sources provided";
    const INCORRECT_PATH: string = "Incorrect path provided ";
    const SOURCE_IS_RUNNING: string = " is used by another process, cannot be moved.";
    const HELP_MESSAGE: string = "Usage: mv <-f --force> <-u --update> <-v --verbose> <-n --no-clobber> <--help> <-S --suffix suffix> <-b --backup numbered,simple,existing,none> <-t --target-directory=DIRECTORY> <-r --recursive> source... dest";
    const cwd: string = term.currDir;

    // default values
    let dest:string = "";
    let srcs:string[] = [];

    while (args.length > 0) {
        const arg = args.shift();
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
                        err(`${value} is not a valid versionning option.`);
                        throw new Error(`${value} is not a valid versionning option.`);
                }
                break;
            }
            default:
                    srcs.push(arg as string);
                    break;
        }
    }
    if (srcs.length == 0) { throw NO_PATHS_PROVIDED; }
    if (srcs.length == 1) { throw NO_SOURCES_PROVIDED; }
    if(!options.targetDir){
        dest = term.getFilepath(srcs.pop())
    }else{
        dest = term.getFilepath(options.targetDir);
    }
    if(!options.targetAsDirectory && (srcs.length > 1 || server.isDir(srcs[0]))) {
        throw "Cannot copy multiple files into a single filename.";
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

            let destFilename = "";
            if(options.targetAsDirectory) destFilename = path.resolve(dest + src);
            else destFilename = path.resolve(dest);

            // is it running?
            if (server.isRunning(src)) {
                err(src + SOURCE_IS_RUNNING);
                return;
            }
            destFilename = getVersionCheck(server, out, err, destFilename, options)
            if (acceptOverwrite(server, out, err, destFilename, options)){
                server.moveFile(src, destFilename, {recursive:true, verbose:options.verbose});
            }
        }
    }
}
