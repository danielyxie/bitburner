import {ReturnCode} from "./ReturnCode";
import {Server} from "../Server";
export function nuke(out:Function, targetServer:Server):ReturnCode{
    const HAS_ADMIN_RIGHTS = "You already have root access to this computer. There is no reason to run NUKE.exe";
    if (targetServer.hasAdminRights) {
        out(HAS_ADMIN_RIGHTS)
        return ReturnCode.SUCCESS;
    }
    // TODO: let the script post by themselves or return their message and let the terminal output the result?
    // Letting the terminal deal with the script result could allow using pipes.

    const NUKE_SUCCESSFUL = `NUKE successful! Gained root access to ${targetServer.hostname}`;
    if (targetServer.openPortCount >= targetServer.numOpenPortsRequired) {
        targetServer.hasAdminRights = true;
        out(NUKE_SUCCESSFUL);
        // TODO: Make this take time rather than be instant
        return ReturnCode.SUCCESS;
    }
    return ReturnCode.FAILURE;
}