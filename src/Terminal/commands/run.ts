import type { IPlayer } from "../../PersonObjects/IPlayer";
import { isScriptFilename } from "../../Script/isScriptFilename";
import type { BaseServer } from "../../Server/BaseServer";
import type { IRouter } from "../../ui/Router";
import type { ITerminal } from "../ITerminal";

import { runProgram } from "./runProgram";
import { runScript } from "./runScript";

export function run(
  terminal: ITerminal,
  router: IRouter,
  player: IPlayer,
  server: BaseServer,
  args: (string | number | boolean)[],
): void {
  // Run a program or a script
  if (args.length < 1) {
    terminal.error("Incorrect number of arguments. Usage: run [program/script] [-t] [num threads] [arg1] [arg2]...");
  } else {
    const executableName = args[0] + "";

    // Check if its a script or just a program/executable
    if (isScriptFilename(executableName)) {
      runScript(terminal, router, player, server, args);
    } else if (executableName.endsWith(".cct")) {
      terminal.runContract(player, executableName);
    } else {
      runProgram(terminal, router, player, server, args);
    }
  }
}
