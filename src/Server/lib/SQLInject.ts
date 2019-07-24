import {ReturnCode} from "./ReturnCode";
import {Server} from "../Server";

export function SQLInject (out:Function, server:Server):ReturnCode{
    if (server.sqlPortOpen) {
        out("SQL Port (1433) is already open!");
        return ReturnCode.SUCCESS;
    }

    server.sqlPortOpen = true;
    out("Opened SQL Port (1433)!");
    server.openPortCount++;    
    return ReturnCode.SUCCESS;
}