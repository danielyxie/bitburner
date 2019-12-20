import { BaseServer } from "../../Server/BaseServer";
import { ManualEntry, registerExecutable } from "../../Server/lib/sys";
import { throwIfNoGang } from "./throwIfNoGang";

export function getBonusTime(server: BaseServer, term: any, out: Function, err: Function, args: string[], options: any = {
    type: false,
    list: false
}) {

    throwIfNoGang(server, term, err);
    let result = Math.round(term.getPlayer().gang.storedCycles / 5);
    out(result);
    return true;
}

const MANUAL = new ManualEntry(
    `getBonusTime - Displays the amount of bonus time remaining for your gang.`,
    `getBonusTime`,
    `Displays the amount of bonus time remaining for your gang.`);

registerExecutable("getBonusTime", getBonusTime, MANUAL, true, "gang");
