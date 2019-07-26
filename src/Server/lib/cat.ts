import * as path from "path";
import { BaseServer } from "../BaseServer";

export function cat(server: BaseServer, term: any, out:Function, err:Function, args: string[], options:any={recursive:false, verbose:false}) {

    const HELP_MESSAGE: string = "Usage: cat <-v --verbose> <--help> <-r --recursive> FILE...";
    const INVALID_PATH_ERROR: string = "Invalid path";
    const NO_PATHS_PROVIDED: string = "No paths provided";
    const INCORRECT_PATH: string = "Incorrect path provided ";
    const cwd: string = term.currDir;
    let srcs: string[] = [];
    while (args.length > 0) {
        const arg = args.shift() as string;
        switch (arg) {
            case "-h":
            case "--help":
                out(HELP_MESSAGE);
                return;
            case "-v":
            case "--verbose": {
                options.verbose = true;
                break;
            }
            case "-r":
            case "--recursive": {
                options.recursive = true;
                break;
            }
            default:
                srcs.push(arg as string);
                break;
        }
    }
    if (srcs.length == 0) { throw NO_PATHS_PROVIDED; }

    const processed = new Set<string>();
    // this way we cannot copy a folder into itself.
    // ex: copy all the content of /src/ into /src/test/ will not copy the content of /src/test/ as src/test/test/, only /src/ content.
    while (srcs.length > 0) {
        let src = term.getFilepath(srcs.pop());
        if (processed.has(src)) { continue; }
        processed.add(src);
        if (!server.exists(src)) {
            err(`${src} doesn't exist.`);
        } else if (server.isDir(src)) {// if its a directory we copy all of its content recursively.
            src = src + ((src.endsWith("/")) ? "" : "/");
            for (const element of server.readdir(src, {withFileTypes:true})) {
                if (element.isDirectory()) {
                    if (options.recursive) {
                        srcs.push(src + element.name + "/");
                    }
                } else if (element.isFile()) {
                    srcs.push(src + element.name);
                }
            }
        } else { // it's a file, we print it.
            out(server.readFile(src))
        }
    }
    return ;
}
