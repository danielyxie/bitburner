import { BaseServer } from "../BaseServer";
import {registerExecutable, ManualEntry, fetchUsage} from "./sys";

export function lscpu(server:BaseServer, term:any, out:Function, err:Function, args:string[], options:any={}){
    out(server.cpuCores + " Core(s)");
}

const MANUAL = new ManualEntry(
`lscpu - prints the number of available CPU Cores`,
`lscpu`,
`Prints the number of available CPU Cores on the local machine.`)

registerExecutable("lscpu", lscpu, MANUAL);
