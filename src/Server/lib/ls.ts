import * as path from "path";
import { BaseServer } from "../BaseServer";
import { detectFileType, FileType } from "./FileType";
const micromatch = require('micromatch');

/**
 * This function builds a string representation of the file tree from the target directory on the specified server and outputs it as a list of detailed records.
 *
 * @export
 * @param {BaseServer} server The server on which we want to build the file tree.
 * @param {*} term The Terminal used by the player from which to get the current working directory and interact with the output.
 * @param {string[]} args The command args used by the Player in the terminal
 * @param {(string|undefined)} [targetDir=undefined] The root directory of the tree.
 * @param {number} [depth=2] The depth of folders to visit. Default is 2.
 * @param {number} [nodeLimit=50] The limit of files to parse, in order to avoid problems with large repositories. Set to -1 to disable.
 * @returns {string} The String representation of the file tree in a record manner.
 */
export function ls(server: BaseServer, term: any, out: Function, err: Function, args: string[], options: any={ recursive:false }) {
    const USAGE_MESSAGE: string = "Usage: ls <--depth -d> number <--limit -l> number <targetDir>";
    const cwd: string = term.currDir;
    let roots: string[] = [];
    while (args.length > 0) {
        const arg = args.shift() as string;
        switch (arg) {
            case "-h":
            case "--help":
                out(USAGE_MESSAGE);
                return;
            case "-R":
                options.recursive = true;
                break;
            default:
                roots.push(arg);
                break;
        }
    }
    if (roots.length === 0) { roots = ["."]; }

    const toBeProcessed: Node[] = [];
    const addresses:string[] = Object.keys(server.vol.toJSON());

    for (let i = 0; i<roots.length; i++){
        let root = roots[i];
        let targetDir: any = path.resolve(cwd+((cwd.endsWith("/")) ? "" : "/"), root);
        if (!server.exists(targetDir)) { // pattern, we detect every valid addresses on the filesystem using the pattern
            let valid = addresses.filter((address:string)=>{return micromatch.isMatch(address,[root])});
            valid = valid.sort();
            roots = [...roots.slice(0, i), ...valid, ...roots.slice(i+1, roots.length)]; // remove the pattern from the roots, replace it with all valid adresses in place.
            i--;// restart at i as if the pattern never existed
            //out("pattern detected: "+root+ " replaced with following roots: "+JSON.stringify(valid));
        }
        else{ // not a pattern, actual path
            if(server.isDir(targetDir)){ // is it a directory?
                //out("root "+root+" target "+targetDir)
                let rootNode = new Node(root);
                rootNode.path = targetDir;
                rootNode.fileType = FileType.DIRECTORY;
                rootNode.content = listDirectoryContent(server, rootNode)
                if (options.recursive){
                    roots = [...roots.slice(0, i+1), ...listSubdirectories(server, rootNode), ...roots.slice(i+1, roots.length)]; // insert all subdirectories in place
                }
                toBeProcessed.push(rootNode);
            }
            else if (server.isExecutable(targetDir)){
                out(targetDir)
            }else{
                err("cannot access '"+targetDir+"': No such file or directory")
            }
        }
    }

    let isFirst = true;
    for(let node of toBeProcessed){
        if (node.content.length == 0) continue;
        if (!isFirst){out("")}
        if (isFirst){isFirst = false;}
        if (toBeProcessed.length > 1){
            out(node.name+((node.name.endsWith("/")) ? "" : "/")+":")
        }
        node.content.forEach(element => {
            out(element)
        });
    }
}

function listDirectoryContent(server: BaseServer, node:Node){
    let content: string[] = []
    const dirContent = server.readdir(node.path, {withFileTypes:true});
    for (let c = 0; c < dirContent.length; c++) {
        const fileInfo = dirContent[c];
        const filetype = detectFileType(fileInfo);
        if (filetype == FileType.FILE || filetype == FileType.DIRECTORY) {
            content.push(fileInfo.name + ((filetype == FileType.DIRECTORY) ? "/" : ""));
        }
    }
    content = content.sort();
    return content;
}

function listSubdirectories(server:BaseServer, node:Node){
    let content: string[] = []
    const dirContent = server.readdir(node.path, {withFileTypes:true});
    for (let c = 0; c < dirContent.length; c++) {
        const fileInfo = dirContent[c];
        const filetype = detectFileType(fileInfo);
        if (filetype == FileType.DIRECTORY) {
            content.push(node.name+((node.name.endsWith("/")) ? "" : "/")+fileInfo.name + "/" );
        }
    }
    content = content.sort();
    return content;
}

class Node{
    name:string="";
    path:string="";
    fileType: string = "";
    content:string[]=[];
    constructor(name:string){
        this.name = name;
    }
}


import {registerExecutable, ManualEntry} from "./sys";

const MANUAL = new ManualEntry(
`ls - prints all matching files and directories to the standard output`,
`ls [OPTIONS] DIRECTORY...
ls [OPTIONS]`,
`Prints all matching files and directories on the current server's
directory to the standard output. The files will be displayed in
alphabetical order.

-R
    display files in subdirectories recursively.

--help
    display this help and exit

This command supports glob matching for searching:

ls /*.js                -- Lists all files ending in ".js" in the root directory
ls /scripts/*.js        -- Lists all files ending in ".js" in the /scripts/ directory
ls **/*.js              -- Lists all files ending in ".js" in any directory/subdirectory starting at root
ls /*server*            -- Lists all files that contain the text "server" in the root directory
ls /!(*.js)             -- Lists all files that do NOT end in ".js" in the root directory
`)
registerExecutable("ls", ls, MANUAL);
