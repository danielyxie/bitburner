import { HacknetServer } from "../../Hacknet/HacknetServer";
import { getServer } from "../AllServers";
import { BaseServer } from "../BaseServer";
import { Server } from "../Server";
import { ManualEntry, registerExecutable } from "./sys";

export function FTPCrack(server:BaseServer, term:any, out:Function, err:Function, args:string[], options:any={}){
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
        if (targetServer.ftpPortOpen) {
            out("FTP Port (21) is already open!");
            return ;
        }

        targetServer.ftpPortOpen = true;
        out("Opened FTP Port (21)!");
        targetServer.openPortCount++;
        return ;
    } else {
        err(`${target} is not hackable!`);
    }
}

const MANUAL = new ManualEntry(
    `FTPCrack.exe - open a port using a FTP crack attack`,
    `FTPCrack.exe [SERVER]`,
    `Open a port on SERVER using a FTP crack attack.

Require the FTPCrack.exe program available for purchase in
some shady n3tw0rk5 or, with a sufficent hacking level,
available for creation.`);

registerExecutable("FTPCrack.exe", FTPCrack, MANUAL, true, "system", "FTPCrack");
