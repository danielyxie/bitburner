import { BaseServer } from "../../Server/BaseServer";
import { Gang } from "../../Gang";

export function hasGang(server: BaseServer, term: any, out:Function, err:Function, args: string[], options:any={}) {
    out(term.getPlayer().gang instanceof Gang);
}

import { registerExecutable, ManualEntry } from "../../Server/lib/sys";

const MANUAL = new ManualEntry(
`hasGang - Returns whether you currently have a Gang or not.`,
`hasGang`,
`Returns whether you currently have a Gang or not.`);

registerExecutable("hasGang", hasGang, MANUAL, true, "gang");
