import { ITerminal } from "../ITerminal";
import { IRouter } from "../../ui/Router";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";

export function home(
  terminal: ITerminal,
  router: IRouter,
  player: IPlayer,
  server: BaseServer,
  args: (string | number)[],
): void {
  if (args.length !== 0) {
    terminal.error("Incorrect usage of home command. Usage: home");
    return;
  }
  player.getCurrentServer().isConnectedTo = false;
  player.currentServer = player.getHomeComputer().ip;
  player.getCurrentServer().isConnectedTo = true;
  terminal.print("Connected to home");
  terminal.setcwd("/");
}
