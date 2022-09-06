import { Terminal } from "../../Terminal";
import { removeAlias } from "../../Alias";

export function unalias(
  args: (string | number | boolean)[],
): void {
  if (args.length !== 1) {
    Terminal.error("Incorrect usage of unalias name. Usage: unalias [alias]");
    return;
  } else if (removeAlias(args[0] + "")) {
    Terminal.print(`Removed alias ${args[0]}`);
  } else {
    Terminal.error(`No such alias exists: ${args[0]}`);
  }
}
