import { BaseServer } from "../BaseServer";
import {registerExecutable, ManualEntry, fetchUsage} from "./sys";
import { Player } from "../../Player";
import {getServer} from "../AllServers";
import {Server} from "../Server";

export function connect(server:BaseServer, term:any, out:Function, err:Function, args:string[], options:any={}){
    if(options.autolink){
        // this is a scan-analyze click. we instantly connect to the server.
        server.isConnectedTo = false;
        server = getServer(args[0]) as Server;
        Player.currentServer = server.ip;
        server.isConnectedTo = true;
        out(`Connected to ${args[0]}`);
        term.currDir = "/";
        term.reset();
        return;
    }

    for (let address of args){
        let found = false;
        for (let i = 0; i < server.serversOnNetwork.length; i++) {
            let connectedServer = getServer(server.serversOnNetwork[i])
            if (address == "home" || connectedServer.ip == address || connectedServer.hostname == address) {
                found = true;
                server.isConnectedTo = false;
                server = getServer(address) as Server;
                Player.currentServer = server.ip;
                server.isConnectedTo = true;
                out(`Connected to ${address}`);
                term.currDir = "/";
                term.reset();
                break;
            }
        }
        if(!found){
            err(`${address} out of reach`)
        }
    }
}

const MANUAL = new ManualEntry(
`connect - connects to a remote server`,
`connect SERVER...`,
`Connect to the remote server SERVER.

The hostname or IP address of the remote server must be given
as the argument to this command. Note that only servers that
are immediately adjacent to the current server in the network
can be connected to. To see which servers can be connected to,
use the 'scan' command.

Giving multiple SERVER addresses will chain the connect commands.`)

registerExecutable("connect", connect, MANUAL);
