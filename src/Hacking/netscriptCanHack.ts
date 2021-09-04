/**
 * Functions used to determine whether the target can be hacked (or grown/weakened).
 * Meant to be used for Netscript implementation
 *
 * The returned status object's message should be used for logging in Netscript
 */
import { IReturnStatus } from "../types";

import { IPlayer } from "../PersonObjects/IPlayer";
import { Server } from "../Server/Server";

function baseCheck(server: Server, fnName: string): IReturnStatus {
  const hostname = server.hostname;

  if (!("requiredHackingSkill" in server)) {
    return {
      res: false,
      msg: `Cannot ${fnName} ${hostname} server because it is a Hacknet Node`,
    };
  }

  if (server.hasAdminRights === false) {
    return {
      res: false,
      msg: `Cannot ${fnName} ${hostname} server because you do not have root access`,
    };
  }

  return { res: true };
}

export function netscriptCanHack(server: Server, p: IPlayer): IReturnStatus {
  const initialCheck = baseCheck(server, "hack");
  if (!initialCheck.res) {
    return initialCheck;
  }

  const s = server;
  if (s.requiredHackingSkill > p.hacking_skill) {
    return {
      res: false,
      msg: `Cannot hack ${server.hostname} server because your hacking skill is not high enough`,
    };
  }

  return { res: true };
}

export function netscriptCanGrow(server: Server): IReturnStatus {
  return baseCheck(server, "grow");
}

export function netscriptCanWeaken(server: Server): IReturnStatus {
  return baseCheck(server, "weaken");
}
