import { Terminal } from "../../Terminal";
import { parseAliasDeclaration, printAliases } from "../../Alias";

export function alias(args: (string | number | boolean)[]): void {
  if (args.length === 0) {
    printAliases();
    return;
  }
  if (args.length === 1) {
    if (parseAliasDeclaration(args[0] + "")) {
      Terminal.print(`Set alias ${args[0]}`);
      return;
    }
  }
  if (args.length === 2) {
    if (args[0] === "-g") {
      if (parseAliasDeclaration(args[1] + "", true)) {
        Terminal.print(`Set global alias ${args[1]}`);
        return;
      }
    }
  }
  Terminal.error('Incorrect usage of alias command. Usage: alias [-g] [aliasname="value"]');
}
