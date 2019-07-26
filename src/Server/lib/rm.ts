import { evaluateDirectoryPath } from "../../Terminal/DirectoryHelpers";
import { BaseServer } from "../BaseServer";
import { detectFileType } from "./FileType";
/**
 * This function allows removing files and folders alike, recursively or not. By default, suppressed files are moved into the trash bin (/~trash/) with no safety against overwrites.
 * The force option allows to remove files without keeping a copy, use it at your own risk!
 *
 * @export
 * @param {BaseServer} server The server on which we want to build the file tree.
 * @param {*} term The Terminal used by the player from which to get the current working directory and interact with the output.
 * @param {string[]} args The command args used by the Player in the terminal
 * @param {(string|undefined)} [targetPath=undefined] The path of the file or directory to remove.
 * @param {boolean} [recursive=false] If 'true' and the target is a folder, this option will recursively suppress every file and subsequent folder before suppressing the target.
 * @param {boolean} [force=false] If 'true' this option will destroy the target directly, instead of moving it into the trash bin (/~trash/).
 * @returns
 */
export function rm(server: BaseServer, term: any, out:Function, err:Function, args: string[], options:any={targetPath:undefined, recursive:false, force:false}) {
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
                throw HELP_MESSAGE;
            case "-r":
                    options.recursive = true;
                break;
            case "-f":
                    options.force = true;
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
        if (options.force) {
            out(`Removing ${targetPath}`); server.fs.unlinkSync(targetPath);
            if(options.verbose) out(`'${targetPath}' -> '/dev/null'`)
        }
        else{
            server.moveFile(targetPath, "/~trash/" +  targetPath, {recursive:true});
            if(options.verbose) out(`'${targetPath}' -> '${"/~trash/"+targetPath}'`)
        };
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
