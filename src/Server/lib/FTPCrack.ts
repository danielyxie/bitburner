import {ReturnCode} from "./ReturnCode";
import {Server} from "../Server";

export function FTPCrack (out:Function, server:Server):ReturnCode{
    if (server.ftpPortOpen) {
        out("FTP Port (21) is already open!");
        return ReturnCode.SUCCESS;
    }

    server.ftpPortOpen = true;
    out("Opened FTP Port (21)!");
    server.openPortCount++;
    return ReturnCode.SUCCESS;
}