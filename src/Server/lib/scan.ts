import { BaseServer } from "../BaseServer";
import { getServer } from "../AllServers";
export function scan(server: BaseServer, term: any, out:Function, err:Function, args: string[], options:any={}){
    // Displays available network connections using TCP
    out("Hostname             IP                   Root Access");
    for (let i = 0; i < server.serversOnNetwork.length; i++) {
        // Add hostname
        let entryServer = getServer(server.serversOnNetwork[i]);
        if (entryServer == null) { continue; }
        let entry:string = entryServer.hostname;

        // Calculate padding and add IP
        let numSpaces = 21 - entry.length;
        let spaces = Array(numSpaces+1).join(" ");
        entry += spaces;
        entry += entryServer.ip;

        // Calculate padding and add root access info
        let hasRoot;
        if (entryServer.hasAdminRights) {
            hasRoot = 'Y';
        } else {
            hasRoot = 'N';
        }
        numSpaces = 21 - entryServer.ip.length;
        spaces = Array(numSpaces+1).join(" ");
        entry += spaces;
        entry += hasRoot;
        out(entry);
    }
}


import {registerExecutable, ManualEntry} from "./sys";

const MANUAL = new ManualEntry(
`scan - prints all immediately-available network connections`,
`scan`,
`Prints all immediately-available network connections.

This will print a list of all servers that you can currently connect
to using the 'connect' command.`)
registerExecutable("scan", scan, MANUAL);
