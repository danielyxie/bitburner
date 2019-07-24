import { BaseServer } from "../BaseServer";
import { evaluateDirectoryPath } from "../../Terminal/DirectoryHelpers";
import { Terminal } from "../../Terminal";
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
export function rm(server: BaseServer, term: any, args: string[], targetPath:string|undefined=undefined, recursive:boolean=false, force:boolean=false) {
    const TOO_MANY_ARGUMENTS_ERROR: string = "Too many arguments";
    const INVALID_PATH_ERROR: string = "Invalid path";
    const HELP_MESSAGE: string = "Incorrect usage of rm command. Usage: rm <-rf> [target]";
    let error: string;
    let cwd:string = term.currDir;
    while (args.length > 0) {
        const arg = args.shift();
        switch (arg) {
            case "-h":
                throw HELP_MESSAGE;
            case "-r":
                recursive = true;
                break;
            case "-f":
                force = true;
                break;
            default:
                if (!targetPath) { targetPath = arg; } else { throw TOO_MANY_ARGUMENTS_ERROR + HELP_MESSAGE; }
                break;
        }
    }
    if (!targetPath) { throw HELP_MESSAGE; } else {
        targetPath = evaluateDirectoryPath(server, targetPath, cwd);
        if (!targetPath) { throw INVALID_PATH_ERROR; } else {
            console.log(`rm: passed path = ${targetPath}; recursive=${recursive}; f=${force}`);
            remove(server, cwd, targetPath, { force, recursive });
            console.log(`rm: directory ${targetPath} removed!`);
            return 1;
        }
    }
}

function removeFile(server: BaseServer, cwd: string, targetPath: string, options: any) {
    if (!options.force) { // if the force option is not activated, the suppressed files will be copied into the bin. Else, we erase it directly.
        server.copyFile(targetPath, "/~trash/" + targetPath, true);
    }
    server.fs.unlinkSync(targetPath);
}

function remove(server: BaseServer, cwd: string,  targetPath: string, options: any) {

    try {
        if (!options.recursive) { // if the recursive option is not activated, the directory is not scanned
            return server.fs.rmdirSync(targetPath);
        }
    } catch (e1) {
        try {
            return removeFile(server, cwd, targetPath, options);
        } catch (e2) {
            throw e2;
        }
    }

    // we scan the wanted directory before anything else.
    const dirContent = server.fs.readdirSync(targetPath, {withFileTypes: true}) ;
    for (let i = 0; i < dirContent.length; i++) {
        const object = dirContent[i];
        if (object.isDirectory()) {
            remove(server, cwd, targetPath + object.name, options);
        } else if (object.isFile()) {
            removeFile(server, cwd, targetPath + object.name, options);
             } else {
            throw new Error(`ERRTYPE: Type unimplemented, cannot remove ${JSON.stringify(targetPath + object.name)} : ${detectFileType(object)}`);
             }
    }
    console.log(`Removing directory ${JSON.stringify(targetPath)}`);
    server.fs.rmdirSync(targetPath);

}
