import { BaseServer } from "../../Server/BaseServer";
import {GangMemberTasks} from "../../Gang";
import {throwIfNoGang} from "./throwIfNoGang";

export function getTaskNames(server: BaseServer, term: any, out:Function, err:Function, args: string[], options:any={type:false, list:false}) {

    throwIfNoGang(server, term, err);
    for(let task of Object.keys(GangMemberTasks)) out(task);
    return true;
}

import { registerExecutable, ManualEntry } from "../../Server/lib/sys";

const MANUAL = new ManualEntry(
`getTaskNames - Outputs the name of every available task.`,
`getTaskNames`,
`Outputs the name of every available task.`);

registerExecutable("getTaskNames", getTaskNames, MANUAL, true, "gang");
