import { BaseServer } from "../../Server/BaseServer";
import { ManualEntry, registerExecutable } from "../../Server/lib/sys";
import { throwIfNoGang } from "./throwIfNoGang";

export function getMemberNames(server: BaseServer, term: any, out: Function, err: Function, args: string[], options: any = {}) {
    throwIfNoGang(server, term, err);
    for (let name of Object.keys(term.getPlayer().gang.members)) {
        out(name);
    }
    return true;
}

const MANUAL = new ManualEntry(
    `getMemberNames - Outputs the name of each member of your gang.`,
    `getMemberNames`,
    `Outputs the name of each member of your gang.`);

registerExecutable("getMemberNames", getMemberNames, MANUAL, true, "gang");
