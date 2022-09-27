import { Terminal } from "../../Terminal";
import { BaseServer } from "../../Server/BaseServer";

export function sudov(args: (string | number | boolean)[], server: BaseServer): void {
  if (args.length !== 0) {
    Terminal.error("Incorrect number of arguments. Usage: sudov");
    return;
  }

  if (server.hasAdminRights) {
    Terminal.print("You have ROOT access to this machine");
  } else {
    Terminal.print("You do NOT have root access to this machine");
  }
}
