import { BaseServer } from "../BaseServer";
import {registerExecutable, ManualEntry, fetchUsage, fetchExecutable} from "./sys";

export function DeepscanV1(server:BaseServer, term:any, out:Function, err:Function, args:string[], options:any={}){
    out("This executable cannot be run. See: help DeepscanV1.exe");
}
const MANUAL = new ManualEntry(
`DeepscanV1.exe - enables 'scan-analyze' with a depth up to 5`,
``,
`Enables 'scan-analyze' with a depth up to 5.

Require the DeepscanV1.exe program available for purchase in
some shady n3tw0rk5 or, with a sufficent hacking level,
available for creation.`)

registerExecutable("DeepscanV1.exe", DeepscanV1, MANUAL, true);

