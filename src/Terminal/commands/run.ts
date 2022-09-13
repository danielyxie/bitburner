import { Terminal } from "../../Terminal";
import { BaseServer } from "../../Server/BaseServer";
import { isScriptFilename } from "../../Script/isScriptFilename";
import { runScript } from "./runScript";
import { runProgram } from "./runProgram";

export function run(args: (string | number | boolean)[], server: BaseServer): void {
  // Run a program or a script
  if (args.length < 1) {
    Terminal.error("Incorrect number of arguments. Usage: run [program/script] [-t] [num threads] [arg1] [arg2]...");
  } else {
    const executableName = args[0] + "";

    // Check if its a script or just a program/executable
    if (isScriptFilename(executableName)) {
      runScript(args, server);
    } else if (executableName.endsWith(".cct")) {
      Terminal.runContract(executableName);
    } else {
      runProgram(args, server);
    }
  }
}
