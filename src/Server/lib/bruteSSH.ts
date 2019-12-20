import { HacknetServer } from "../../Hacknet/HacknetServer";
import { getServer } from "../AllServers";
import { BaseServer } from "../BaseServer";
import { Server } from "../Server";
import { ManualEntry, registerExecutable } from "./sys";

export function bruteSSH(server:BaseServer, term:any, out:Function, err:Function, args:string[], options:any={}){
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
        if (targetServer.sshPortOpen) {
            out("SSH Port (22) is already open!");
            return ;
        }

        targetServer.sshPortOpen = true;
        out("Opened SSH Port(22)!");
        targetServer.openPortCount++;
        return ;
    } else {
        err(`${target} is not hackable!`);
    }
}

const MANUAL = new ManualEntry(
    `bruteSSH.exe - open a port using a SSH brute force attack`,
    `bruteSSH.exe [SERVER]`,
    `Open a port on SERVER using a SSH brute force attack.

Require the bruteSSH.exe program available for purchase in
some shady n3tw0rk5 or, with a sufficent hacking level,
available for creation.`);

registerExecutable("bruteSSH.exe", bruteSSH, MANUAL, true, "system", "bruteSSH");
