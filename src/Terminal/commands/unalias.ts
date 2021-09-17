import { ITerminal } from "../ITerminal";
import { IRouter } from "../../ui/Router";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";
import { removeAlias } from "../../Alias";

export function unalias(
  terminal: ITerminal,
  router: IRouter,
  player: IPlayer,
  server: BaseServer,
  args: (string | number)[],
): void {
  if (args.length !== 1) {
    terminal.error("Incorrect usage of unalias name. Usage: unalias [alias]");
    return;
  } else {
    if (removeAlias(args[0] + "")) {
      terminal.print(`Removed alias ${args[0]}`);
    } else {
      terminal.error(`No such alias exists: ${args[0]}`);
    }
  }
}
