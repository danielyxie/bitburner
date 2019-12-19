import { calculateGrowTime, calculateHackingTime, calculateWeakenTime } from "../../Hacking";
import { HacknetServer } from "../../Hacknet/HacknetServer";
import { numeralWrapper } from "../../ui/numeralFormat";
import { getServer } from "../AllServers";
import { BaseServer } from "../BaseServer";
import { Server } from "../Server";
import { ManualEntry, registerExecutable } from "./sys";

export function ServerProfiler(server:BaseServer, term:any, out:Function, err:Function, args:string[], options:any={}){
    var targetServer: Server | HacknetServer | undefined;
    var target:string;
    if(args.length == 0){
        targetServer = server as Server|HacknetServer;
        target = targetServer.ip;
    } else{
        target = args[0];
        targetServer = getServer(target);
    }
    if (!targetServer) { err(`${target} does not exists!`); return;}
    out(targetServer.hostname + ":");
    out("Server base security level: " + targetServer.baseDifficulty);
    out("Server current security level: " + targetServer.hackDifficulty);
    out("Server growth rate: " + targetServer.serverGrowth);
    out("Netscript hack() execution time: " + numeralWrapper.format(calculateHackingTime(targetServer), '0.0') + "s");
    out("Netscript grow() execution time: " + numeralWrapper.format(calculateGrowTime(targetServer), '0.0') + "s");
    out("Netscript weaken() execution time: " + numeralWrapper.format(calculateWeakenTime(targetServer), '0.0') + "s");
}

const MANUAL = new ManualEntry(
    `ServerProfiler.exe - displays hacking and Netscript-related information about a server`,
    `ServerProfiler.exe [SERVER]`,
    `Displays hacking and Netscript-related information about a server.

Require the ServerProfiler.exe program available for purchase in
some shady n3tw0rk5 or, with a sufficent hacking level,
available for creation.`);

registerExecutable("ServerProfiler.exe", ServerProfiler, MANUAL, true, "system", "ServerProfiler");
