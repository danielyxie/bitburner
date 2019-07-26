import { HacknetServer } from "../../Hacknet/HacknetServer";
import { post, postError } from "../../ui/postToTerminal";
import { getServer } from "../AllServers";
import { BaseServer } from "../BaseServer";
import { Server } from "../Server";
import { CLIErrorType } from "./CLIErrorType";
import { ReturnCode } from "./ReturnCode";

export function nuke(server: BaseServer, term: any, args: string[], target: string | undefined= undefined): ReturnCode {
    const HELP_MESSAGE: string = "Incorrect usage of nuke command. Usage: nuke [target ip/hostname]";

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
        const HAS_ADMIN_RIGHTS = "You already have root access to this computer. There is no reason to run NUKE.exe";
        if (targetServer.hasAdminRights) {
            post(HAS_ADMIN_RIGHTS);
            return ReturnCode.SUCCESS;
        }
        // TODO: let the script post by themselves or return their message and let the terminal output the result?
        // Letting the terminal deal with the script result could allow using pipes.

        const NUKE_SUCCESSFUL = `NUKE successful! Gained root access to ${targetServer.hostname}`;
        if (targetServer.openPortCount >= targetServer.numOpenPortsRequired) {
            targetServer.hasAdminRights = true;
            post(NUKE_SUCCESSFUL);
            // TODO: Make this take time rather than be instant
            return ReturnCode.SUCCESS;
        }
        return ReturnCode.FAILURE;
    } else {
        throw new Error(`${target} is not hackable!`);
    }
}
