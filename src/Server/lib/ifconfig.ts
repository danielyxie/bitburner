import { BaseServer } from "../BaseServer";
import {registerExecutable, ManualEntry, fetchUsage} from "./sys";

export function ifconfig(server:BaseServer, term:any, out:Function, err:Function, args:string[], options:any={}){
    out(server.ip);
}

const MANUAL = new ManualEntry(
`ifconfig - prints the current server's IP adress`,
`ifconfig`,
`Prints the current server's IP adress.`)

registerExecutable("ifconfig", ifconfig, MANUAL);
