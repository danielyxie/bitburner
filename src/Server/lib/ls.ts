import * as path from "path";
import { BaseServer } from "../BaseServer";
import { detectFileType, FileType } from "./FileType";
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
export function ls(server: BaseServer, term: any, out:Function, err:Function, args: string[], options:any={ depth:2}): string {
    const TOO_MANY_ARGUMENTS_ERROR: string = "Too many arguments";
    const INVALID_PATH_ERROR: string = "Invalid path";
    const HELP_MESSAGE: string = "Incorrect usage of ls command. Usage: ls <--depth -d> number <--limit -l> number <targetDir>";
    let error: string;
    const cwd: string = term.currDir;
    let roots: string[] = [];
    while (args.length > 0) {
        const arg = args.shift() as string;
        switch (arg) {
            case "-h":
            case "--help":
                throw HELP_MESSAGE;
            case "-d":
            case "--depth":
                if (args.length > 0) { options.depth = parseInt(args.shift() as string); }
                else { throw HELP_MESSAGE; }
                break;
            default:
                roots.push(arg);
                break;
        }
    }
    if (roots.length==0) { roots = [cwd]; }
    const toBeProcessed: TreeNode[] = [];
    var treeRoots:TreeNode[] = []
    const processed: Set<string> = new Set<string>();
    for(let root of roots){
        let targetDir:any = path.resolve(cwd, root);
        if (!targetDir) { err(INVALID_PATH_ERROR); }
        else{
            out(`'${targetDir}' registered as root!`);

            const rootNode = new TreeNode(targetDir, FileType.DIRECTORY);
            toBeProcessed.push(rootNode);
            treeRoots.push(rootNode);
        }
    }


    while (toBeProcessed.length > 0) {
        const node: TreeNode = toBeProcessed.shift() as TreeNode;
        processed.add(node.path + node.name);
        const dirContent = server.readdir(node.path + node.name, {withFileTypes:true});
        if (!dirContent) { return `An error occured when parsing the content of the ${node.name} directory.`; }
        for (let c = 0; c < dirContent.length; c++) {
            const fileInfo = dirContent[c];
            if (processed.has(node.path +node.name+ fileInfo.name)) {
                continue;
            }else{
                const filetype = detectFileType(fileInfo);
                if (filetype == FileType.FILE || filetype == FileType.DIRECTORY) {
                    const childrenNode = new TreeNode(fileInfo.name, filetype);
                    node.addChild(childrenNode);
                    if (fileInfo.isDirectory() && node.depth < options.depth) {
                        toBeProcessed.push(childrenNode);
                    }
                }
            }
        }
    }
    treeRoots.sort( function (a:TreeNode, b:TreeNode):number { return ((a.name < b.name)?-1:((a.name > b.name)?1: 0));} );
    return treeRoots.map((root)=>{return root.toString(true);}).join("\n");
}

const SCOPE: string     = "│  ";
const BRANCH: string    = "├──";
const LAST: string      = "└──";

class TreeNode {
    name: string = "";
    path: string = "";
    fileType: string = "";
    childrens: TreeNode[] = [];
    depth: number = 0;
    constructor(name: string, fileType: string) {
        this.name = name;
        this.fileType = fileType;
        this.childrens = [];
    }
    toString(isLast = false): string {
        const localResults: string[] = [];

        localResults.push([this.path, this.name, (this.fileType == FileType.DIRECTORY && this.name != "/") ? "/" : ""].join(""));
        if (this.childrens.length > 0) {
            this.childrens.sort( function (a:TreeNode, b:TreeNode):number { return ((a.name < b.name)?-1:((a.name > b.name)?1: 0));} );
            for (let i = 0; i < this.childrens.length; i++) {
                localResults.push(this.childrens[i].toString(i == (this.childrens.length - 1)));
            }
        }
        console.log(`node ${this.path+this.name} => ${localResults.join("\n")}`);
        return localResults.join("\n");
    }
    addChild(node: TreeNode,treeMerge=false) {
        node.depth = this.depth + 1;
        if(treeMerge){
            node.path = this.path+this.name;
            node.name = node.name.replace(this.path+this.name, "");
        }else{
            node.path = this.path + this.name + ((this.name.endsWith("/")) ? "" : "/");
        }
        this.childrens.push(node);
    }
}
