/**
 * Functions used to determine whether the target can be hacked (or grown/weakened).
 * Meant to be used for Netscript implementation
 *
 * The returned status object's message should be used for logging in Netscript
 */
import { IReturnStatus } from "../types";

import { HacknetServer }    from "../Hacknet/HacknetServer";
import { IPlayer }          from "../PersonObjects/IPlayer";
import { Server }           from "../Server/Server";

function baseCheck(server: Server | HacknetServer, fnName: string): IReturnStatus {
    if (server instanceof HacknetServer) {
        return {
            res: false,
            msg: `Cannot ${fnName} ${server.hostname} server because it is a Hacknet Node`
        }
    }

    if (server.hasAdminRights === false) {
        return {
            res: false,
            msg: `Cannot ${fnName} ${server.hostname} server because you do not have root access`,
        }
    }

    return { res: true }
}

export function netscriptCanHack(server: Server | HacknetServer, p: IPlayer): IReturnStatus {
    const initialCheck = baseCheck(server, "hack");
    if (!initialCheck.res) { return initialCheck; }

    let s = <Server>server;

    if (s.requiredHackingSkill > p.hacking_skill) {
        return {
            res: false,
            msg: `Cannot hack ${server.hostname} server because your hacking skill is not high enough`,
        }
    }

    return { res: true }
}

export function netscriptCanGrow(server: Server | HacknetServer): IReturnStatus {
    return baseCheck(server, "grow");
}

export function netscriptCanWeaken(server: Server | HacknetServer): IReturnStatus {
    return baseCheck(server, "weaken");
}
