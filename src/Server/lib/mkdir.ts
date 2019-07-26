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
export function mkdir(server: BaseServer, term: any, args: string[], path: string | undefined= undefined, recursive: boolean= false) {
    const TOO_MANY_ARGUMENTS_ERROR: string = "Too many arguments";
    const HELP_MESSAGE: string = "Incorrect usage of mkdir command. Usage: mkdir <-r> [target dir]";

    const cwd: string = term.currDir;
    let error: string;

    while (args.length > 0) {
        const arg = args.shift();
        switch (arg) {
            case "-h":
                throw HELP_MESSAGE;
            case "-r":
                recursive = true;
                break;
            default:
                if (!path) { path = arg; } else { throw TOO_MANY_ARGUMENTS_ERROR + HELP_MESSAGE; }
                break;
        }
    }
    if (!path) { throw HELP_MESSAGE; } else {
        server.fs.mkdirSync(path, { recursive });
        console.log(`mkdir: directory ${path} created!`);
        return 1;
    }
}
