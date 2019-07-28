import * as path from "path";
import { BaseServer } from "../BaseServer";
import {OverwriteStrategy, acceptOverwrite} from "./OverwriteStrategy";
import {VersioningStrategy, getVersionCheck} from "./VersioningStrategy";

export function wget(server: BaseServer, term: any, out:Function, err:Function, args: string[], options:any={recursive:false, verbose:false,targetDir:undefined, backup:VersioningStrategy.EXISTING, overwriteStrategy:OverwriteStrategy.NO_CLOBBER, suffix:"~"}) {
    const HELP_MESSAGE: string = "Usage: wget <-f --force> <-u --update> <-n --no-clobber> <--help> <-S --suffix suffix> <-b --backup numbered,simple,existing,none> <-r --recursive> --from URL --to DEST";
    const TOO_MANY_ARGUMENTS_ERROR: string = "Too many arguments";
    const INVALID_PATH_ERROR: string = "Invalid path";
    const NO_PATHS_PROVIDED: string = "No paths provided";
    const NO_SOURCES_PROVIDED: string = "No sources provided";
    const INCORRECT_PATH: string = "Incorrect path provided ";
    const SOURCE_IS_RUNNING: string = " is used by another process, cannot be moved.";
    const cwd: string = term.currDir;
    let error: string;
    let dest:string = "";
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
            case "-f":
            case "--force": {
                options.overwriteStrategy = OverwriteStrategy.FORCE;
                break;
            }
            case "-n":
            case "--no-clobber": {
                options.overwriteStrategy = OverwriteStrategy.NO_CLOBBER;
                break;
            }
            case "-u":
            case "--update": {
                options.overwriteStrategy = OverwriteStrategy.UPDATE;
                break;
            }
            case "-r":
            case "--recursive": {
                options.recursive = true;
                break;
            }
            case "--from": {
                if (args.length > 0) { options.from = args.shift() as string; } else { throw HELP_MESSAGE; }
                break;
            }
            case "-S":
            case "--suffix": {
                if (args.length > 0) { options.suffix = args.shift() as string; } else { throw HELP_MESSAGE; }
                break;
            }
            case "--to": {
                if (args.length > 0) { options.targetDir = args.shift() as string; } else { throw HELP_MESSAGE; }
                break;
            }
            case "-b":
            case "--backup": {
                let value: string;
                if (args.length > 0) { value = args.shift() as string; } else { throw HELP_MESSAGE; }
                switch (value) {
                    case "none":
                        options.backup = VersioningStrategy.NONE;
                        break;
                    case "numbered":
                        options.backup = VersioningStrategy.NUMBERED;
                        break;
                    case "existing":
                        options.backup = VersioningStrategy.EXISTING;
                        break;
                    case "simple":
                        options.backup = VersioningStrategy.SIMPLE;
                        break;
                    default:
                        err(`${value} is not a valid versioning option.`);
                        throw new Error(`${value} is not a valid versioning option.`);
                }
                break;
            }
            default:
                throw HELP_MESSAGE;
        }
    }

    if (!options.from) { throw "You must provide a source URL."; }
    if (!options.targetDir) { throw NO_SOURCES_PROVIDED; }

    dest = term.getFilepath(options.targetDir);

    if(server.exists(dest)){
        if(server.isDir(dest) ) {err(`${dest} already exists as a directory. `)}
    }

    dest = path.resolve(dest);
    dest = getVersionCheck(server, out, err, dest, options)
    if (acceptOverwrite(server, out, err, dest, options)){
        return fetch(options.from)
            .then((response:any)=>{
                return response.text();
            })
            .then(function(data:string) {
                out(`content: ${data}`);
                server.writeFile(dest, data, options);
                out(`'${options.from}' -> '${dest}'`);
            })
            .catch(function(e:any) {
                err("wget failed: " + JSON.stringify(e))});
    }
}
import {registerExecutable, ManualEntry} from "./sys";

const MANUAL = new ManualEntry(
`wget - Retrieves data from a URL and downloads it to a file on the current server.`,
`wget [OPTIONS] --from URL --to FILEPATH`,
`Retrieves data from a URL and downloads it to a file on the current server.
If the file already exists, this command will behave like a mv command.

Note that it will not be possible to download data from many websites because
they do not allow cross-origin resource sharing (CORS).

Example:
    wget https://raw.githubusercontent.com/danielyxie/bitburner/master/README.md game_readme.txt

--from=URL
    the source URL where the file will be downloaded from the internet.

--to=FILEPATH
    the FILEPATH where the data will be downloaded on the local server.

-b, --backup[=CONTROL]
    make a backup of each existing destination file

-f, --force
    if an existing destination file cannot be opened, remove it
    and try again (this option is ignored when the -n option is
    also used)

-n, --no-clobber
    do not overwrite an existing file (overrides a previous -i
    option)

-r, --recursive
    copy directories recursively

-S, --suffix=SUFFIX
    override the usual backup suffix

-t, --target-directory=DIRECTORY
    copy all SOURCE arguments into DIRECTORY

-T, --no-target-directory
    treat DEST as a normal file

-v, --verbose
    explain what is being done

--help display this help and exit

The backup suffix is '~', unless set with --suffix or
SIMPLE_BACKUP_SUFFIX.  The version control method may be selected via
the --backup option or through the VERSION_CONTROL environment
variable.  Here are the values:

none
    never make backups (even if --backup is given)

numbered
    make numbered backups

existing
    numbered if numbered backups exist, simple otherwise

simple
    always make simple backups`)
registerExecutable("wget", wget, MANUAL);
