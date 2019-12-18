import { BaseServer } from "../../Server/BaseServer";
import {GangMemberTasks} from "../../Gang";
import { hasGang } from "./hasGang";

export function getTaskNames(server: BaseServer, term: any, out:Function, err:Function, args: string[], options:any={type:false, list:false}) {
    let hasGangAlready:boolean = false;
    let hasGangOut = (value:boolean)=>{hasGangAlready=value;};
    hasGang(server, term, hasGangOut, err, [])
    if(!hasGangAlready){
        err(`You dont have a gang`);
        return false;
    }
    for(let task of Object.keys(GangMemberTasks)) out(task);
    return true;
}

import { registerExecutable, ManualEntry } from "../../Server/lib/sys";

const MANUAL = new ManualEntry(
`getTaskNames - Outputs the name of every available task.`,
`getTaskNames`,
`Outputs the name of every available task.`);

registerExecutable("getTaskNames", getTaskNames, MANUAL, true, "gang");
