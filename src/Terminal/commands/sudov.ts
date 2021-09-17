import { ITerminal } from "../ITerminal";
import { IRouter } from "../../ui/Router";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";

export function sudov(
  terminal: ITerminal,
  router: IRouter,
  player: IPlayer,
  server: BaseServer,
  args: (string | number)[],
): void {
  if (args.length !== 0) {
    terminal.error("Incorrect number of arguments. Usage: sudov");
    return;
  }

  if (server.hasAdminRights) {
    terminal.print("You have ROOT access to this machine");
  } else {
    terminal.print("You do NOT have root access to this machine");
  }
}
