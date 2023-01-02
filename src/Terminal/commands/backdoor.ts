import { Terminal } from "../../Terminal";
import { Player } from "@player";
import { BaseServer } from "../../Server/BaseServer";
import { Server } from "../../Server/Server";
import { HacknetServer } from "../../Hacknet/HacknetServer";

export function backdoor(args: (string | number | boolean)[], server: BaseServer): void {
  if (args.length !== 0) {
    Terminal.error("Incorrect usage of backdoor command. Usage: backdoor");
    return;
  }

  if (!(server instanceof Server)) {
    Terminal.error("Can only backdoor normal servers");
  }

  const normalServer = server as Server;

  if (normalServer.purchasedByPlayer) {
    Terminal.error(
      "Cannot use backdoor on your own machines! You are currently connected to your home PC or one of your purchased servers",
    );
  } else if (!normalServer.hasAdminRights) {
    Terminal.error("You do not have admin rights for this machine! Cannot backdoor");
  } else if (normalServer.requiredHackingSkill > Player.skills.hacking) {
    Terminal.error(
      "Your hacking skill is not high enough to use backdoor on this machine. Try analyzing the machine to determine the required hacking skill",
    );
  } else if (normalServer instanceof HacknetServer) {
    Terminal.error("Cannot use backdoor on this type of Server");
  } else {
    Terminal.startBackdoor();
  }
}
