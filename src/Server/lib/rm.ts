import { BaseServer } from "../BaseServer";
import { detectFileType } from "./FileType";
/**
 * This function allows removing files and folders alike, recursively or not.
 *
 * @export
 * @param {BaseServer} server The server on which we want to build the file tree.
 * @param {*} term The Terminal used by the player from which to get the current working directory and interact with the output.
 * @param {string[]} args The command args used by the Player in the terminal
 * @param {(string|undefined)} [targetPath=undefined] The path of the file or directory to remove.
 * @param {boolean} [recursive=false] If 'true' and the target is a folder, this option will recursively suppress every file and subsequent folder before suppressing the target.
 * @returns
 */
export function rm(server: BaseServer, term: any, out:Function, err:Function, args: string[], options:any={targetPath:undefined, recursive:false}) {
    const TOO_MANY_ARGUMENTS_ERROR: string = "Too many arguments";
    const INVALID_PATH_ERROR: string = "Invalid path";
    const HELP_MESSAGE: string = "Incorrect usage of rm command. Usage: rm <-rf> [target]";
    let error: string;
    const cwd: string = term.currDir;
    let paths:string[] = [];
    while (args.length > 0) {
        const arg = args.shift();
        switch (arg) {
            case "-h":
            case "--help":
                throw HELP_MESSAGE;
            case "-r":
            case "--recursive":
                    options.recursive = true;
                break;
            default:
                paths.push(arg as string);
                break;
        }
    }
    if (paths.length==0) { throw HELP_MESSAGE; } else {
        for(let targetPath of paths){
            let evaluatedPath = term.getFilepath(targetPath);
            if (!evaluatedPath) { throw INVALID_PATH_ERROR; } else {
                remove(server, term, out, err, evaluatedPath, options);
                return 1;
            }
        }
    }
}

function removeFile(server: BaseServer, term: any, out:Function, err:Function, targetPath: string, options: any) {
    if (!server.exists(targetPath)) {
        throw  `${targetPath} doesn't exists`;
    } else if (server.isRunning(targetPath)) {
        throw "Cannot delete a script that is currently running!";
    } else {
        out(`Removing ${targetPath}`); server.fs.unlinkSync(targetPath);
        if(options.verbose) out(`Removed '${targetPath}'`)
    }
}

function remove(server: BaseServer, term: any, out:Function, err:Function,  targetPath: string, options: any) {

    try {
        if (!options.recursive) { // if the recursive option is not activated, the directory is not scanned
            return server.fs.rmdirSync(targetPath);
        }
    } catch (e1) {
        try {
            // this is called if the path is a file.
            return removeFile(server, term, out, err, targetPath, options);
        } catch (e2) {
            //this happens if the path is not a file, nor a directory.
            throw e2;
        }
    }
    if (server.isDir(targetPath)) targetPath += (targetPath.endsWith("/"))? "": "/";
    // we scan the wanted directory before anything else.
    const dirContent = server.readdir(targetPath, {withFileTypes: true});

    for (let i = 0; i < dirContent.length; i++) {
        const object = dirContent[i];
        if (object.isDirectory()) {
            remove(server, term, out, err,  targetPath + object.name, options);
        } else if (object.isFile()) {
            removeFile(server, term, out, err,  targetPath + object.name, options);
        } else {
            throw new Error(`ERRTYPE: Type unimplemented, cannot remove ${JSON.stringify(targetPath + object.name)} : ${detectFileType(object)}`);
        }
    }
    server.fs.rmdirSync(targetPath);
    if(options.verbose) out(`'${targetPath}' -> '/dev/null'`)
}
import {registerExecutable, ManualEntry} from "./sys";
const MANUAL = new ManualEntry(
`rm - concatenate files and print on the standard output `,
`rm [OPTIONS] FILES...
rm -r DIRECTORY`,
`Removes all specified files from the current server.

Removing files is PERMANENT and CANNOT BE UNDONE.

WARNING: using the command 'rm -r /' is STRONGLY ADVISED AGAINST.

-r, --recursive
    Remove every subfolders of a directory recursively. Use with caution

--help
    display this help and exit
`)
registerExecutable("rm", rm, MANUAL);
