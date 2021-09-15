import { ITerminal } from "../ITerminal";
import { IEngine } from "../../IEngine";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";

export function sudov(
  terminal: ITerminal,
  engine: IEngine,
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
