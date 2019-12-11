import { HacknetServer } from "../../Hacknet/HacknetServer";
import { getServer } from "../AllServers";
import { BaseServer } from "../BaseServer";
import { Server } from "../Server";
import {registerExecutable, ManualEntry} from "./sys";

export function nuke(server:BaseServer, term:any, out:Function, err:Function, args:string[], options:any={}){
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
        if (targetServer.hasAdminRights) {

            out("You already have root access to this computer.");
            return;
        }
        // TODO: let the script post by themselves or return their message and let the terminal output the result?
        // Letting the terminal deal with the script result could allow using pipes.
        if (targetServer.openPortCount >= targetServer.numOpenPortsRequired) {

            targetServer.hasAdminRights = true;
            out(`Gained root access to ${targetServer.hostname}!`);
            // TODO: Make this take time rather than be instant
            return ;
        }
        return ;
    } else {
        err(`${target} is not hackable!`);
    }
}

const MANUAL = new ManualEntry(
`NUKE.exe - KABOOM`,
`NUKE.exe [SERVER]`,
`KABOOM.

Requires the NUKE.exe program. This is an executable program and is executed
using the run command ('run NUKE.exe'). The program grants root access to
a server if enough ports have been opened.`);

registerExecutable("NUKE.exe", nuke, MANUAL, true);
