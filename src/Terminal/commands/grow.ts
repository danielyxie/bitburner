import { ITerminal } from "../ITerminal";
import { IRouter } from "../../ui/Router";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";
import { Server } from "../../Server/Server";

export function grow(
  terminal: ITerminal,
  router: IRouter,
  player: IPlayer,
  server: BaseServer,
  args: (string | number)[],
): void {
  if (args.length !== 0) {
    terminal.error("Incorrect usage of grow command. Usage: grow");
    return;
  }

  if (!(server instanceof Server)) {
    terminal.error(
      "Cannot grow your own machines! You are currently connected to your home PC or one of your purchased servers",
    );
  }
  const normalServer = server as Server;
  // Hack the current PC (usually for money)
  // You can't grow your home pc or servers you purchased
  if (normalServer.purchasedByPlayer) {
    terminal.error(
      "Cannot grow your own machines! You are currently connected to your home PC or one of your purchased servers",
    );
    return;
  }
  if (!normalServer.hasAdminRights) {
    terminal.error("You do not have admin rights for this machine! Cannot grow");
    return;
  }
  if (normalServer.requiredHackingSkill > player.hacking) {
    terminal.error(
      "Your hacking skill is not high enough to attempt hacking this machine. Try analyzing the machine to determine the required hacking skill",
    );
    return;
  }
  terminal.startGrow(player);
}
