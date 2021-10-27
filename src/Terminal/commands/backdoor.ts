import { ITerminal } from "../ITerminal";
import { IRouter } from "../../ui/Router";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";
import { Server } from "../../Server/Server";
import { HacknetServer } from "../../Hacknet/HacknetServer";

export function backdoor(
  terminal: ITerminal,
  router: IRouter,
  player: IPlayer,
  server: BaseServer,
  args: (string | number)[],
): void {
  if (args.length !== 0) {
    terminal.error("Incorrect usage of backdoor command. Usage: backdoor");
    return;
  }

  if (!(server instanceof Server)) {
    terminal.error("Can only backdoor normal servers");
  }

  const normalServer = server as Server;

  if (normalServer.purchasedByPlayer) {
    terminal.error(
      "Cannot use backdoor on your own machines! You are currently connected to your home PC or one of your purchased servers",
    );
  } else if (!normalServer.hasAdminRights) {
    terminal.error("You do not have admin rights for this machine! Cannot backdoor");
  } else if (normalServer.requiredHackingSkill > player.hacking_skill) {
    terminal.error(
      "Your hacking skill is not high enough to use backdoor on this machine. Try analyzing the machine to determine the required hacking skill",
    );
  } else if (normalServer instanceof HacknetServer) {
    terminal.error("Cannot use backdoor on this type of Server");
  } else {
    terminal.startBackdoor(player);
  }
}
