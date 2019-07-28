import { BaseServer } from "../BaseServer";
export function clear(server: BaseServer, term: any, out:Function, err:Function, args: string[], options:any={}){
    term.clearOutput();
}


import {registerExecutable, ManualEntry} from "./sys";

const MANUAL = new ManualEntry(
`clear - clears the standard output`,
`clear`,
`Clears the standard output. Note that this does not delete
the user's command history, so using the up and down arrow
keys is still valid. Also note that this is permanent.

See also: cls`)
registerExecutable("clear", clear, MANUAL);
