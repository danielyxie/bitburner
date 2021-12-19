import { ITerminal } from "../ITerminal";
import { IRouter } from "../../ui/Router";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";
import { Programs } from "../../Programs/Programs";

export function runProgram(
  terminal: ITerminal,
  router: IRouter,
  player: IPlayer,
  server: BaseServer,
  args: (string | number | boolean)[],
): void {
  if (args.length < 1) {
    return;
  }

  // Check if you have the program on your computer. If you do, execute it, otherwise
  // display an error message
  const programName = args[0] + "";

  if (!player.hasProgram(programName)) {
    terminal.error(
      `No such (exe, script, js, ns, or cct) file! (Only programs that exist on your home computer or scripts on ${
        player.getCurrentServer().hostname
      } can be run)`,
    );
    return;
  }

  if (args.length < 1) {
    return;
  }

  for (const program of Object.values(Programs)) {
    if (program.name.toLocaleLowerCase() === programName.toLocaleLowerCase()) {
      program.run(
        router,
        terminal,
        player,
        server,
        args.slice(1).map((arg) => arg + ""),
      );
      return;
    }
  }

  terminal.error("Invalid executable. Cannot be run");
}
