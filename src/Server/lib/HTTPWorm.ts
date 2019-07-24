import {ReturnCode} from "./ReturnCode";
import {Server} from "../Server";

export function HTTPWorm (out:Function, server:Server):ReturnCode{
    if (server.httpPortOpen) {
        out("HTTP Port (80) is already open!");
        return ReturnCode.SUCCESS;
    }

    server.httpPortOpen = true;
    out("Opened HTTP Port (80)!");
    server.openPortCount++;
    return ReturnCode.SUCCESS;
}