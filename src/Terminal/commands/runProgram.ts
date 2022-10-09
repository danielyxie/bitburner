import { Terminal } from "../../Terminal";
import { Player } from "@player";
import { BaseServer } from "../../Server/BaseServer";
import { Programs } from "../../Programs/Programs";

export function runProgram(args: (string | number | boolean)[], server: BaseServer): void {
  if (args.length < 1) {
    return;
  }

  // Check if you have the program on your computer. If you do, execute it, otherwise
  // display an error message
  const programName = args[0] + "";

  if (!Player.hasProgram(programName)) {
    Terminal.error(
      `No such (exe, script, js, ns, or cct) file! (Only programs that exist on your home computer or scripts on ${server.hostname} can be run)`,
    );
    return;
  }

  if (args.length < 1) {
    return;
  }

  for (const program of Object.values(Programs)) {
    if (program.name.toLocaleLowerCase() === programName.toLocaleLowerCase()) {
      program.run(
        args.slice(1).map((arg) => arg + ""),
        server,
      );
      return;
    }
  }

  Terminal.error("Invalid executable. Cannot be run");
}
