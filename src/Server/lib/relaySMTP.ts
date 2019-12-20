import { HacknetServer } from "../../Hacknet/HacknetServer";
import { getServer } from "../AllServers";
import { BaseServer } from "../BaseServer";
import { Server } from "../Server";
import { ManualEntry, registerExecutable } from "./sys";

export function relaySMTP(server:BaseServer, term:any, out:Function, err:Function, args:string[], options:any={}){
    var targetServer: Server | HacknetServer | undefined;
    var target:string;
    if(args.length == 0){
        targetServer = server as Server | HacknetServer;
        target = targetServer.ip;
    }
    else{
        target = args[0];
        targetServer = getServer(target);
    }
    if (!targetServer) { err(`${target} does not exists!`); return;}
    if (targetServer instanceof Server) {

        if (targetServer.smtpPortOpen) {
            out("SMTP Port (25) is already open!");
            return ;
        }

        targetServer.smtpPortOpen = true;
        out("Opened SMTP Port (25)!");
        targetServer.openPortCount++;
        return ;
    } else {
        err(`${target} is not hackable!`);
    }
}

const MANUAL = new ManualEntry(
    `relaySMTP.exe - open a port using a spam attack`,
    `relaySMTP.exe [SERVER]`,
    `Open a port on SERVER using a SMTP relay to spam SERVER.

Require the SQLInject.exe program available for purchase in
some shady n3tw0rk5 or, with a sufficent hacking level,
available for creation.`);

registerExecutable("relaySMTP.exe", relaySMTP, MANUAL, true, "system", "relaySMTP");
