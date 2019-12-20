import { BaseServer } from "../BaseServer";
import { ManualEntry, registerExecutable } from "./sys";

export function DeepscanV2(server:BaseServer, term:any, out:Function, err:Function, args:string[], options:any={}){
    out("This executable cannot be run. See: help DeepscanV2.exe");
}

const MANUAL = new ManualEntry(
    `DeepscanV2.exe - enables 'scan-analyze' with a depth up to 10`,
    ``,
    `Enables 'scan-analyze' with a depth up to 10.

Require the DeepscanV2.exe program available for purchase in
some shady n3tw0rk5 or, with a sufficent hacking level,
available for creation.`);

registerExecutable("DeepscanV2.exe", DeepscanV2, MANUAL, true, "system", "DeepscanV2");

