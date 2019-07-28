import * as path from "path";
import { BaseServer } from "../BaseServer";

import {
    parseAliasDeclaration,
    printAliases,
    removeAlias,
} from "../../Alias";

export function alias(server: BaseServer, term: any, out:Function, err:Function, args: string[], options:any={global:false, print:false}) {

    const HELP_MESSAGE: string = "Usage: alias <-g --global> <--help> <-p --print> [name=value]";
    let newAliases: string[] = [];
    while (args.length > 0) {
        const arg = args.shift() as string;
        switch (arg) {
            case "-h":
            case "--help":
                out(HELP_MESSAGE);
                return;
            case "-g":
            case "--global": {
                options.global = true;
                break;
            }
            case "-p":
            case "--print": {
                options.print = true;
                break;
            }
            default:
                newAliases.push(arg as string);
                break;
        }
    }
    if (newAliases.length == 0) { options.print = true; }

    for(let keyValuePair of newAliases){
        if(!parseAliasDeclaration(keyValuePair, options.global)){
            err(`${keyValuePair} is not a valid argument.`);
        }
    }
    if(options.print){
        out(printAliases());
    }
}
import {registerExecutable, ManualEntry} from "./sys";

const MANUAL = new ManualEntry(
`alias - Define or display aliases.`,
`alias [-p] [name[=value] ... ]`,
`Define or display aliases.

Without arguments, 'alias' prints the list of aliases in the reusable
form 'alias NAME=VALUE' on standard output.

Otherwise, an alias is defined for each NAME whose VALUE is given.
A trailing space in VALUE causes the next word to be checked for
alias substitution when the alias is expanded.

Options:
    -p	Print all defined aliases in a reusable format
`)
registerExecutable("alias", alias, MANUAL);
