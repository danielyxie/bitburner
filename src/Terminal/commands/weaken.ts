import { Terminal } from "../../Terminal";
import { Player } from "../../Player";
import { BaseServer } from "../../Server/BaseServer";
import { Server } from "../../Server/Server";

export function weaken(args: (string | number | boolean)[], server: BaseServer): void {
  if (args.length !== 0) {
    Terminal.error("Incorrect usage of weaken command. Usage: weaken");
    return;
  }

  if (!(server instanceof Server)) {
    Terminal.error(
      "Cannot weaken your own machines! You are currently connected to your home PC or one of your purchased servers",
    );
  }
  const normalServer = server as Server;
  // Hack the current PC (usually for money)
  // You can't weaken your home pc or servers you purchased
  if (normalServer.purchasedByPlayer) {
    Terminal.error(
      "Cannot weaken your own machines! You are currently connected to your home PC or one of your purchased servers",
    );
    return;
  }
  if (!normalServer.hasAdminRights) {
    Terminal.error("You do not have admin rights for this machine! Cannot weaken");
    return;
  }
  if (normalServer.requiredHackingSkill > Player.skills.hacking) {
    Terminal.error(
      "Your hacking skill is not high enough to attempt hacking this machine. Try analyzing the machine to determine the required hacking skill",
    );
    return;
  }
  Terminal.startWeaken();
}
