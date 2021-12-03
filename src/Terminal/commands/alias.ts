import { ITerminal } from "../ITerminal";
import { IRouter } from "../../ui/Router";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";
import { parseAliasDeclaration, printAliases } from "../../Alias";

export function alias(
  terminal: ITerminal,
  router: IRouter,
  player: IPlayer,
  server: BaseServer,
  args: (string | number | boolean)[],
): void {
  if (args.length === 0) {
    printAliases();
    return;
  }
  if (args.length === 1) {
    if (parseAliasDeclaration(args[0] + "")) {
      terminal.print(`Set alias ${args[0]}`);
      return;
    }
  }
  if (args.length === 2) {
    if (args[0] === "-g") {
      if (parseAliasDeclaration(args[1] + "", true)) {
        terminal.print(`Set global alias ${args[1]}`);
        return;
      }
    }
  }
  terminal.error('Incorrect usage of alias command. Usage: alias [-g] [aliasname="value"]');
}
