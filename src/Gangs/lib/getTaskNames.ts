import { GangMemberTasks } from "../../Gang";
import { BaseServer } from "../../Server/BaseServer";
import { ManualEntry, registerExecutable } from "../../Server/lib/sys";
import { throwIfNoGang } from "./throwIfNoGang";

export function getTaskNames(server: BaseServer, term: any, out: Function, err: Function, args: string[], options: any = {}) {
    throwIfNoGang(server, term, err);
    for (const task of Object.keys(GangMemberTasks)) {
        out(task);
    }
    return true;
}

const MANUAL = new ManualEntry(
    `getTaskNames - Outputs the name of every available task.`,
    `getTaskNames`,
    `Outputs the name of every available task.`);

registerExecutable("getTaskNames", getTaskNames, MANUAL, true, "gang");
