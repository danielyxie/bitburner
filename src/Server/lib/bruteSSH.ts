import {ReturnCode} from "./ReturnCode";
import {Server} from "../Server";

export function bruteSSH (out:Function, server:Server):ReturnCode{
    if (server.sshPortOpen) {
        out("SSH Port (22) is already open!");
        return ReturnCode.SUCCESS;
    }

    server.sshPortOpen = true;
    out("Opened SSH Port(22)!")
    server.openPortCount++;
    return ReturnCode.SUCCESS;
}