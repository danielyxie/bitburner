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
export function ls(server: BaseServer, term: any, out: Function, err: Function, args: string[], options: any={ depth: 0 }) {
    const TOO_MANY_ARGUMENTS_ERROR: string = "Too many arguments";
    const INVALID_PATH_ERROR: string = "Invalid path";
    const USAGE_MESSAGE: string = "Usage: ls <--depth -d> number <--limit -l> number <targetDir>";
    const INCORRECT_USAGE_MESSAGE = `Incorrect usage of ls command. ${USAGE_MESSAGE}`;
    let error: string;
    const cwd: string = term.currDir;
    let roots: string[] = [];
    let patterns: string[] = [];
    while (args.length > 0) {
        const arg = args.shift() as string;
        switch (arg) {
            case "-h":
            case "--help":
                out(USAGE_MESSAGE);
                return;
            case "-d":
            case "--depth":
                if (args.length > 0) {
                    options.depth = parseInt(args.shift() as string);
                } else {
                    out(INCORRECT_USAGE_MESSAGE);
                    return;
                }
                break;
            default:
                roots.push(arg);
                break;
        }
    }
    if (roots.length === 0) { roots = [cwd]; }
    const toBeProcessed: TreeNode[] = [];
    var treeRoots: TreeNode[] = [];
    const processed: Set<string> = new Set<string>();
    for (let root of roots){
        let targetDir: any = path.resolve(cwd, root);
        if (!targetDir) { patterns.push(root); }
        else{
            if(server.isDir(root)){
                const rootNode = new TreeNode(targetDir, FileType.DIRECTORY);
                toBeProcessed.push(rootNode);
                treeRoots.push(rootNode);
            }
            else{
                patterns.push(root);
            }
        }
    }
    // if everything was patterns
    if (treeRoots.length==0){
        // we add the cwd to it
        const rootNode = new TreeNode(cwd, FileType.DIRECTORY);
        toBeProcessed.push(rootNode);
        treeRoots.push(rootNode);
    };
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
                    if (fileInfo.isDirectory() && (node.depth < options.depth || options.depth < 0)) {
                        toBeProcessed.push(childrenNode);
                    }
                }
            }
        }
    }

    treeRoots
        .sort( function (a:TreeNode, b:TreeNode):number {
            return ((a.name < b.name)?-1:((a.name > b.name)?1: 0));
        });

    const results: string[] = [];
    treeRoots.forEach((root: TreeNode)=>{
        const paths: string[] = root.toStringArray(true, patterns);

        // 'paths' currently contains the full filepaths, so we should remove
        // the current filepath from each element.
        const currFilepath: string = term.getCurrentDirectory();
        for (let i: number = 0; i < paths.length; ++i) {
            if (paths[i].startsWith(currFilepath)) {
                paths[i] = paths[i].replace(currFilepath, "");
            }
        }

        results.push(...paths);
    });
    results.map((path: string) => {
        if (path.endsWith("/")) {
            out(path, "#0000EE"); // Blue for directories
        } else {
            out(path);
        }
    });
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

    toStringArray(isLast=false, patterns: string[]): string[] {
        const localResults: string[] = [];
        let path = this.getFullName();
        if (patterns.length === 0 || (patterns.length > 0 && micromatch.isMatch(path, patterns))) {
            localResults.push(path);
        }

        if (this.childrens.length > 0) {
            this.childrens.sort( function (a:TreeNode, b:TreeNode):number { return ((a.name < b.name)?-1:((a.name > b.name)?1: 0));} );
            for (let i:number = 0; i < this.childrens.length; i++) {
                localResults.push(...this.childrens[i].toStringArray(i == (this.childrens.length - 1), patterns));
            }
        }
        return localResults;
    }

    addChild(node: TreeNode, treeMerge: boolean = false) {
        node.depth = this.depth + 1;
        if (treeMerge) {
            node.path = this.path+this.name;
            node.name = node.name.replace(this.path+this.name, "");
        } else {
            node.path = this.path + this.name + ((this.name.endsWith("/")) ? "" : "/");
        }
        this.childrens.push(node);
    }

    getFullName() {
        return [this.path, this.name, (this.fileType === FileType.DIRECTORY && this.name != "/") ? "/" : ""].join("")
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

-d, --depth=DEPTH
    limits the pattern matching to DEPTH subdirectories.

--help
    display this help and exit
`)
registerExecutable("ls", ls, MANUAL);
