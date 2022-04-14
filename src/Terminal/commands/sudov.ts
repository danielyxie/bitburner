import type { IPlayer } from "../../PersonObjects/IPlayer";
import type { BaseServer } from "../../Server/BaseServer";
import type { IRouter } from "../../ui/Router";
import type { ITerminal } from "../ITerminal";

export function sudov(
  terminal: ITerminal,
  router: IRouter,
  player: IPlayer,
  server: BaseServer,
  args: (string | number | boolean)[],
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
