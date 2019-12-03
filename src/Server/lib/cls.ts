import { BaseServer } from "../BaseServer";
import {clear} from "./clear";
export function cls(server: BaseServer, term: any, out:Function, err:Function, args: string[], options:any={}){
    clear(server, term, out, err, args, options);
}


import {registerExecutable, ManualEntry} from "./sys";

const MANUAL = new ManualEntry(
`cls - clears the standard output`,
`cls`,
`Clears the standard output. Note that this does not delete
the user's command history, so using the up and down arrow
keys is still valid. Also note that this is permanent.

See also: clear`)
registerExecutable("cls", cls, MANUAL);
