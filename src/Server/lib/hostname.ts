import { BaseServer } from "../BaseServer";
import {registerExecutable, ManualEntry, fetchUsage} from "./sys";

export function hostname(server:BaseServer, term:any, out:Function, err:Function, args:string[], options:any={}){
    out(server.hostname + " Core(s)");
}

const MANUAL = new ManualEntry(
`hostname - prints the current server's hostname`,
`hostname`,
`Prints the current server's hostname.`)

registerExecutable("hostname", hostname, MANUAL);
