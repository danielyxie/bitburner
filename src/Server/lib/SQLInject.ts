import { HacknetServer } from "../../Hacknet/HacknetServer";
import { getServer } from "../AllServers";
import { BaseServer } from "../BaseServer";
import { Server } from "../Server";
import {registerExecutable, ManualEntry, fetchUsage, fetchExecutable} from "./sys";

export function SQLInject(server:BaseServer, term:any, out:Function, err:Function, args:string[], options:any={}) {
    var targetServer: Server | HacknetServer | undefined;
    var target:string;
    if(args.length == 0){
        targetServer = server as Server|HacknetServer;
        target = targetServer.ip;
    }
    else{
        target = args[0];
        targetServer = getServer(target);
    }
    if (!targetServer) { err(`${target} does not exists!`); return;}
    if (targetServer instanceof Server) {
        if (targetServer.sqlPortOpen) {
            out("SQL Port (1433) is already open!");
            return;
        }

        targetServer.sqlPortOpen = true;
        out("Opened SQL Port (1433)!");
        targetServer.openPortCount++;
        return;
    } else {
        err(`${target} is not hackable!`);
    }
}


const MANUAL = new ManualEntry(
`SQLInject.exe - open a port using a SQL injection attack`,
`SQLInject.exe [SERVER]`,
`Open a port on SERVER using a SQL injection attack.

Require the SQLInject.exe program available for purchase in
some shady n3tw0rk5 or, with a sufficent hacking level,
available for creation.`)

registerExecutable("SQLInject.exe", SQLInject, MANUAL, true);
