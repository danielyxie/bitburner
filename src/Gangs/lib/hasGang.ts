import { Gang } from "../../Gang";
import { BaseServer } from "../../Server/BaseServer";
import { ManualEntry, registerExecutable } from "../../Server/lib/sys";

export function hasGang(server: BaseServer, term: any, out: Function, err: Function, args: string[], options: any = {}) {
    out(term.getPlayer().gang instanceof Gang);
}

const MANUAL = new ManualEntry(
    `hasGang - Returns whether you currently have a Gang or not.`,
    `hasGang`,
    `Returns whether you currently have a Gang or not.`);

registerExecutable("hasGang", hasGang, MANUAL, true, "gang");
