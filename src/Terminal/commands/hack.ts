import { ITerminal } from "../ITerminal";
import { IRouter } from "../../ui/Router";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";
import { Server } from "../../Server/Server";

export function hack(
  terminal: ITerminal,
  router: IRouter,
  player: IPlayer,
  server: BaseServer,
  args: (string | number | boolean)[],
): void {
  if (args.length !== 0) {
    terminal.error("Incorrect usage of hack command. Usage: hack");
    return;
  }

  if (!(server instanceof Server)) {
    terminal.error(
      "Cannot hack your own machines! You are currently connected to your home PC or one of your purchased servers",
    );
  }
  const normalServer = server as Server;
  // Hack the current PC (usually for money)
  // You can't hack your home pc or servers you purchased
  if (normalServer.purchasedByPlayer) {
    terminal.error(
      "Cannot hack your own machines! You are currently connected to your home PC or one of your purchased servers",
    );
    return;
  }
  if (!normalServer.hasAdminRights) {
    terminal.error("You do not have admin rights for this machine! Cannot hack");
    return;
  }
  if (normalServer.requiredHackingSkill > player.hacking) {
    terminal.error(
      "Your hacking skill is not high enough to attempt hacking this machine. Try analyzing the machine to determine the required hacking skill",
    );
    return;
  }
  terminal.startHack(player);
}
