import type { IPlayer } from "../../PersonObjects/IPlayer";
import type { BaseServer } from "../../Server/BaseServer";
import type { IRouter } from "../../ui/Router";
import type { ITerminal } from "../ITerminal";

export function home(
  terminal: ITerminal,
  router: IRouter,
  player: IPlayer,
  server: BaseServer,
  args: (string | number | boolean)[],
): void {
  if (args.length !== 0) {
    terminal.error("Incorrect usage of home command. Usage: home");
    return;
  }
  player.getCurrentServer().isConnectedTo = false;
  player.currentServer = player.getHomeComputer().hostname;
  player.getCurrentServer().isConnectedTo = true;
  terminal.print("Connected to home");
  terminal.setcwd("/");
}
