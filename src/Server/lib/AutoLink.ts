import { BaseServer } from "../BaseServer";
import { ManualEntry, registerExecutable } from "./sys";

export function AutoLink(server:BaseServer, term:any, out:Function, err:Function, args:string[], options:any={}){
    out("This executable cannot be run. See: help AutoLink.exe");
}

const MANUAL = new ManualEntry(
    `AutoLink.exe - enables direct connect via 'scan-analyze'`,
    ``,
    `Enables direct connect via 'scan-analyze'.

When using 'scan-analyze', click on a server's hostname to
connect to it.

Require the AutoLink.exe program available for purchase in
some shady n3tw0rk5 or, with a sufficent hacking level,
available for creation.`);

registerExecutable("AutoLink.exe", AutoLink, MANUAL, true, "system", "autoLink");

