import { removeAlias } from "../../Alias";
import type { IPlayer } from "../../PersonObjects/IPlayer";
import type { BaseServer } from "../../Server/BaseServer";
import type { IRouter } from "../../ui/Router";
import type { ITerminal } from "../ITerminal";

export function unalias(
  terminal: ITerminal,
  router: IRouter,
  player: IPlayer,
  server: BaseServer,
  args: (string | number | boolean)[],
): void {
  if (args.length !== 1) {
    terminal.error("Incorrect usage of unalias name. Usage: unalias [alias]");
    return;
  } else if (removeAlias(args[0] + "")) {
    terminal.print(`Removed alias ${args[0]}`);
  } else {
    terminal.error(`No such alias exists: ${args[0]}`);
  }
}
