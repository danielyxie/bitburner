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
export function ls(server: BaseServer, term: any, args: string[], targetDir: string | undefined= undefined, depth: number= 2): string {
    const TOO_MANY_ARGUMENTS_ERROR: string = "Too many arguments";
    const INVALID_PATH_ERROR: string = "Invalid path";
    const HELP_MESSAGE: string = "Incorrect usage of ls command. Usage: ls <--depth -d> number <--limit -l> number <targetDir>";
    let error: string;
    const cwd: string = term.currDir;
    depth = 2;
    console.log(`@ ${server.hostname} > ${cwd} ] ls called with the following arguments : ${JSON.stringify(args)}`);
    while (args.length > 0) {
        console.log(`args stack left: ${JSON.stringify(args)}`);
        const arg = args.shift();
        switch (arg) {
            case "-h":
            case "--help":
                throw HELP_MESSAGE;
            case "-d":
            case "--depth":
                console.log(`depth flag detected, args stack left: ${JSON.stringify(args)}`);
                if (args.length > 0) { depth = parseInt(args.shift() as string); }
                else { throw HELP_MESSAGE; }
                break;
            default:
                if (!targetDir) { targetDir = arg; } else { throw TOO_MANY_ARGUMENTS_ERROR + HELP_MESSAGE; }
                break;
        }
    }
    if (!targetDir) { targetDir = cwd; }
    console.log(`Resolving targetDir path from cwd '${cwd}' and targetDir '${targetDir}' => ${path.resolve(cwd, targetDir)}`);
    targetDir = path.resolve(cwd, targetDir);

    if (!targetDir) { throw HELP_MESSAGE; }

    console.log(`Processing the tree of ${targetDir}.`);
    const rootNode = new TreeNode(targetDir, FileType.DIRECTORY);
    const toBeProcessed: TreeNode[] = [rootNode];
    const processed: Set<string> = new Set<string>();

    while (toBeProcessed.length > 0) {
        const node: TreeNode = toBeProcessed.pop() as TreeNode;
        processed.add(node.path + node.name);
        const dirContent = server.readdir(node.path + node.name, true);
        if (!dirContent) { return `An error occured when parsing the content of the ${node.name} directory.`; }
        for (let c = 0; c < dirContent.length; c++) {
            const fileInfo = dirContent[c];
            if (processed.has(fileInfo.name)) { break; } // avoid circular dependencies due to symlinks
            const filetype = detectFileType(fileInfo);
            if (filetype == FileType.FILE || filetype == FileType.DIRECTORY) {
                const childrenNode = new TreeNode(fileInfo.name, detectFileType(fileInfo));
                node.addChild(childrenNode);
                if (fileInfo.isDirectory() && node.depth < depth) {
                    toBeProcessed.push(childrenNode);
                }
            }
        }
    }
    return rootNode.toString(true);
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
            for (let i = 0; i < this.childrens.length; i++) {
                localResults.push(this.childrens[i].toString(i == (this.childrens.length - 1)));
            }
        }
        console.log(`${localResults.join("\n")}`);
        return localResults.join("\n");
    }
    addChild(node: TreeNode) {
        node.depth = this.depth + 1;
        node.path = this.path + this.name + ((this.name.endsWith("/")) ? "" : "/");
        this.childrens.push(node);
    }
}
