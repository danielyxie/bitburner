import { BaseServer } from "../BaseServer";
/**
 * This command allows to create directories, recursively or not.
 *
 * @export
 * @param {BaseServer} server The server on which we want to build the file tree.
 * @param {*} term The Terminal used by the player from which to get the current working directory and interact with the output.
 * @param {string[]} args The command args used by the Player in the terminal
 * @param {(string|undefined)} [path=undefined] The path of the directory to create.
 * @param {boolean} [recursive=false] If 'true' and the target is in an unexistant directory, this option will recursively create the necessary directories before creating the target directory.
 * @returns
 */
export function mkdir(server: BaseServer, term: any, out:Function, err:Function, args: string[], options:any={ path:undefined, recursive:false, verbose:false}) {
    const TOO_MANY_ARGUMENTS_ERROR: string = "Too many arguments";
    const HELP_MESSAGE: string = "Incorrect usage of mkdir command. Usage: mkdir <-r --recursive> <-v --verbose> DIRECTORY...";

    const cwd: string = term.currDir;
    let error: string;
    let paths: string[] = [];
    while (args.length > 0) {
        const arg = args.shift() as string;
        switch (arg) {
            case "-h":
                throw HELP_MESSAGE;
            case "-r":
            case "--recursive":
                options.recursive = true;
                break;
            case "-v":
            case "--verbose":
                options.verbose = true;
                break;
            default:
                paths.push(arg);
                break;
        }
    }
    if (paths.length==0) { throw HELP_MESSAGE; } else {
        paths.forEach( function (path) {
            try{
                server.fs.mkdirSync(path, { recursive:options.recursive });
                if(options.verbose) out(`${path} created`);
            }catch(e){
                err(e);
            }
        })
        return 1;
    }
}


import {registerExecutable, ManualEntry} from "./sys";

const MANUAL = new ManualEntry(
`mkdir -  mkdir - make directories `,
`mkdir [OPTION]... DIRECTORY... `,
`Create the DIRECTORY(ies), if they do not already exist.

-r, --recursive
    no error if not existing, make parent directories as needed

-v, --verbose
    print a message for each created directory

--help
    display this help and exit
`)
registerExecutable("mkdir", mkdir, MANUAL);
