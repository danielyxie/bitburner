import {BaseServer} from "../../Server/BaseServer";
import {ManualEntry, registerExecutable} from "../../Server/lib/sys";

export function hasGangAPI(server: BaseServer, term: any, out: Function, err: Function, args: string[], options: any = {}) {
    out((term.getPlayer().bitNodeN === 2 || term.getPlayer().sourceFiles.some((a: any) => {
        return a.n === 2
    })))
}

const MANUAL = new ManualEntry(
    `hasGangAPI - Returns whether the Gang API is available or not.`,
    `hasGangAPI`,
    `Returns whether the Gang API is available or not.`);

registerExecutable("hasGangAPI", hasGangAPI, MANUAL, true, "gang");
