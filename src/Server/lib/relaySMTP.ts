import {ReturnCode} from "./ReturnCode";
import {Server} from "../Server";

export function bruteSSH (out:Function, server:Server):ReturnCode{
    if (server.smtpPortOpen) {
        out("SMTP Port (25) is already open!");
        return ReturnCode.SUCCESS;
    }

    server.smtpPortOpen = true;
    out("Opened SMTP Port (25)!");
    server.openPortCount++;        
    return ReturnCode.SUCCESS;
}