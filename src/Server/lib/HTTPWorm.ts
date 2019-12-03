import { HacknetServer } from "../../Hacknet/HacknetServer";
import { getServer } from "../AllServers";
import { BaseServer } from "../BaseServer";
import { Server } from "../Server";
import {registerExecutable, ManualEntry, fetchUsage, fetchExecutable} from "./sys";

export function HTTPWorm(server:BaseServer, term:any, out:Function, err:Function, args:string[], options:any={}){
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
        if (targetServer.httpPortOpen) {
            out("HTTP Port (80) is already open!");
            return ;
        }

        targetServer.httpPortOpen = true;
        out("Opened HTTP Port (80)!");
        targetServer.openPortCount++;
        return ;
    } else {
       err(`${target} is not hackable!`);
    }
}

const MANUAL = new ManualEntry(
`HTTPWorm.exe - open a port using a worm attack`,
`HTTPWorm.exe [SERVER]`,
`Open a port on SERVER using a worm attack.

Require the HTTPWorm.exe program available for purchase in
some shady n3tw0rk5 or, with a sufficent hacking level,
available for creation.`)

registerExecutable("HTTPWorm.exe", HTTPWorm, MANUAL, true);
