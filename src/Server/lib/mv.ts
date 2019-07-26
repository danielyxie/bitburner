import * as path from "path";
import { post, postError } from "../../ui/postToTerminal";
import { BaseServer } from "../BaseServer";
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
export function mv(server: BaseServer, term: any, args: string[], srcs?: string[], dest?: string, overwriteStrategy?: OverwriteStrategy, backup?: VersioningStrategy, verbose?: boolean, suffix?: string, recursive?: boolean, targetDir?: string) {
    // see mv man page: https://linux.die.net/man/1/mv
    const TOO_MANY_ARGUMENTS_ERROR: string = "Too many arguments";
    const INVALID_PATH_ERROR: string = "Invalid path";
    const NO_PATHS_PROVIDED: string = "No paths provided";
    const NO_SOURCES_PROVIDED: string = "No sources provided";
    const INCORRECT_PATH: string = "Incorrect path provided ";
    const SOURCE_IS_RUNNING: string = " is used by another process, cannot be moved.";
    const HELP_MESSAGE: string = "Usage: mv <-f --force> <-u --update> <-v --verbose> <-n --no-clobber> <--help> <-S --suffix suffix> <-b --backup numbered,simple,existing,none> <-t --target-directory targetDir> <-r --recursive> source... dest";
    const cwd: string = term.currDir;

    // default values
    if (!dest) { dest = ""; }
    if (!srcs) { srcs = []; }
    if (!verbose) { verbose = false; }
    if (!recursive) { recursive = false; }
    if (!suffix) { suffix = "~"; }
    if (!backup) { backup = VersioningStrategy.EXISTING; }
    if (!targetDir) { targetDir = ""; }
    if (!overwriteStrategy) { overwriteStrategy = OverwriteStrategy.NO_CLOBBER; }

    try {
        while (args.length > 0) {
            const arg = args.shift();
            switch (arg) {
                case "-h":
                case "--help":
                    post(HELP_MESSAGE);
                    return;
                case "-f":
                case "--force": {
                    overwriteStrategy = OverwriteStrategy.FORCE;
                    break;
                }
                case "-v":
                case "--verbose": {
                    verbose = true;
                    break;
                }
                case "-n":
                case "--no-clobber": {
                    overwriteStrategy = OverwriteStrategy.NO_CLOBBER;
                    break;
                }
                case "-u":
                case "--update": {
                    overwriteStrategy = OverwriteStrategy.UPDATE;
                    break;
                }
                case "-r":
                case "--recursive": {
                    recursive = true;
                    break;
                }
                case "-S":
                case "--suffix": {
                    if (args.length > 0) { suffix = args.shift() as string; } else { throw HELP_MESSAGE; }
                    break;
                }
                case "-t":
                case "--target_directory": {
                    if (args.length > 0) { targetDir = args.shift() as string; } else { throw HELP_MESSAGE; }
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
                            backup = VersioningStrategy.NONE;
                            break;
                        case "numbered":
                            backup = VersioningStrategy.NUMBERED;
                            break;
                        case "existing":
                            backup = VersioningStrategy.EXISTING;
                            break;
                        case "simple":
                            backup = VersioningStrategy.SIMPLE;
                            break;
                        default:
                            postError(`${value} is not a valid versionning option.`);
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

        dest = term.getFilepath(srcs.pop());
        // adding the target directory
        dest = path.resolve(dest + "/" + targetDir) + "/";

        const processed = new Set<string>();
        processed.add(dest);
        // this way we cannot copy a folder into itself.
        // ex: copy all the content of /src/ into /src/test/ will not copy the content of /src/test/ as src/test/test/, only /src/ content.
        while (srcs.length > 0) {
            let src = term.getFilepath(srcs.pop());
            if (processed.has(src)) { continue; }
            processed.add(src);
            if (!server.exists(src)) {
                postError(`${src} doesn't exists.`);
            } else if (server.isDir(src)) {// if its a directory we copy all of its content recursively.
                src = src + ((src.endsWith("/")) ? "" : "/");
                for (const element of server.readdir(src, true)) {
                    if (element.isDirectory()) {
                        if (recursive) {
                            srcs.push(src + element.name + "/");
                        }
                    } else if (element.isFile()) {
                        srcs.push(src + element.name);
                    }
                }
            } else { // it's a file, we copy it.

                let destFilename = path.resolve(dest + src);

                // is it running?
                if (server.isRunning(src)) {
                    postError(src + SOURCE_IS_RUNNING);
                    return;
                }
                let fileSuffix = suffix;
                // would it overwrite something?
                if (server.exists(destFilename)) { // if so we first determine the versionning suffix.
                    let version: number = 1;
                    // here we verify the versioning naming scheme of the new file to be replaced.
                    switch (backup) {
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
                    switch (overwriteStrategy) {
                        case OverwriteStrategy.INTERACTIVE: {
                            // TODO needs a way to get user input from the terminal.
                            postError("Interactive strategy is not implemented yet.");
                            return;
                        }
                        case OverwriteStrategy.NO_CLOBBER: {
                            if (verbose) { post(`A file named ${destFilename} already exists.`); }
                            continue;
                        }
                        case OverwriteStrategy.UPDATE: {
                            // TODO needs a way to determine the date of each file.
                            postError("Update strategy is not implemented yet.");
                            return;
                        }
                        case OverwriteStrategy.FORCE: {
                            if (verbose) { post(`Overwriting ${destFilename}`); }
                            break;
                        }
                    }
                }

                server.moveFile(src, destFilename, {recursive:true, verbose:verbose});
                // => is there a directory with this name? if so fail
                // => is it a file? If so depending on the overwriting strategy:
                // FORCE > overwrite
                // INTERACTIVE > TODO asks the user for permission, currently impossible due to having no access to user input from a running program.
                // NO_CLUBBER > do not copy if a file exists with the same name.
                // UPDATE > copy only if the copied file is more recent.
            }
        }
        return ;
    } catch (e) {postError(e); }
}

export enum OverwriteStrategy {
    FORCE = 1, // overwrite
    INTERACTIVE, // asks the user for permission, currently impossible due to having no access to user input from a running program.
    NO_CLOBBER, // do not copy if a file exists with the same name.
    UPDATE, // copy only if the copied file is more recent. TIMING TO DO, check stats with fs.access or something like that, theres a modified date system integrated with fs.
}

export enum VersioningStrategy {
    NONE = 1,
    EXISTING,
    NUMBERED,
    SIMPLE,
}
