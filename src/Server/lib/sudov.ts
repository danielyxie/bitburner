import { BaseServer } from "../BaseServer";

export function sudov(server: BaseServer, term: any, out:Function, err:Function, args: string[], options:any={}){
    out(`You${(server.hasAdminRights)?" ":" DO NOT "}have root access to this machine.`)
}


import {registerExecutable, ManualEntry} from "./sys";

const MANUAL = new ManualEntry(
`sudov - prints your access level to the local server`,
`sudov`,
`Prints your access level to the local server.`)
registerExecutable("sudov", sudov, MANUAL);
