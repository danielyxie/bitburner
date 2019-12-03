import { BaseServer } from "../BaseServer";
export enum OverwriteStrategy {
    FORCE = 1, // overwrite
    INTERACTIVE, // asks the user for permission, currently impossible due to having no access to user input from a running program.
    NO_CLOBBER, // do not copy if a file exists with the same name.
    UPDATE, // copy only if the copied file is more recent. TIMING TO DO, check stats with fs.access or something like that, theres a modified date system integrated with fs.
}


export function acceptOverwrite(server:BaseServer, out:Function, err:Function, destFilename:string, options:any):boolean{
    if (server.exists(destFilename)) { // this is called if no versioning control is applied or another backup already exists in SIMPLE backup mode.
        // here we either continue to modify the file, or we skip the file altogether.
        switch (options.strategy) {
            case OverwriteStrategy.INTERACTIVE: {
                // TODO needs a way to get user input from the terminal.
                err("Interactive strategy is not implemented yet.");
                return false;
            }
            case OverwriteStrategy.NO_CLOBBER: {
                if (options.verbose) { out(`A file named ${destFilename} already exists.`); }
                return false;
            }
            case OverwriteStrategy.UPDATE: {
                // TODO needs a way to determine the date of each file.
                err("Update strategy is not implemented yet.");
                return false;
            }
            case OverwriteStrategy.FORCE: {
                if (options.verbose) { out(`Overwriting ${destFilename}`); }
                break;
            }
        }
    }
    return true;
}
