import { HacknetServer } from "../../Hacknet/HacknetServer";
import { post, postError } from "../../ui/postToTerminal";
import { getServer } from "../AllServers";
import { BaseServer } from "../BaseServer";
import { Server } from "../Server";
import { CLIErrorType } from "./CLIErrorType";
import { ReturnCode } from "./ReturnCode";

export function SQLInject(server: BaseServer, term: any, args: string[], target: string | undefined= undefined): ReturnCode {
    const HELP_MESSAGE: string = "Incorrect usage of SQLInject command. Usage: SQLInject [target ip/hostname]";

    while (args.length > 0) {
        const arg = args.shift();
        switch (arg) {
            case "-h":
                post(HELP_MESSAGE);
                return ReturnCode.FAILURE;
            default:
                if (!target) { target = arg; } else {
                    postError(CLIErrorType.TOO_MANY_ARGUMENTS_ERROR);
                    post(HELP_MESSAGE);
                    return ReturnCode.FAILURE;
                }
                break;
        }
    }
    if (!target) { throw HELP_MESSAGE; }
    const targetServer: Server | HacknetServer = getServer(target);
    if (!targetServer) { throw new Error(`${target} does not exists!`); }
    if (targetServer instanceof Server) {
        if (targetServer.sqlPortOpen) {
            post("SQL Port (1433) is already open!");
            return ReturnCode.SUCCESS;
        }

        targetServer.sqlPortOpen = true;
        post("Opened SQL Port (1433)!");
        targetServer.openPortCount++;
        return ReturnCode.SUCCESS;
    } else {
        throw new Error(`${target} is not hackable!`);
    }
}
