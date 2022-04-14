import type { IPlayer } from "../../PersonObjects/IPlayer";
import { isScriptFilename, validScriptExtensions } from "../../Script/isScriptFilename";
import { findRunningScript } from "../../Script/ScriptHelpers";
import type { BaseServer } from "../../Server/BaseServer";
import type { IRouter } from "../../ui/Router";
import type { ITerminal } from "../ITerminal";

export function check(
  terminal: ITerminal,
  router: IRouter,
  player: IPlayer,
  server: BaseServer,
  args: (string | number | boolean)[],
): void {
  if (args.length < 1) {
    terminal.error(`Incorrect number of arguments. Usage: check [script] [arg1] [arg2]...`);
  } else {
    const scriptName = terminal.getFilepath(args[0] + "");
    // Can only tail script files
    if (!isScriptFilename(scriptName)) {
      terminal.error(
        `'check' can only be called on scripts files (filename must end with ${validScriptExtensions.join(", ")})`,
      );
      return;
    }

    // Check that the script is running on this machine
    const runningScript = findRunningScript(scriptName, args.slice(1), server);
    if (runningScript == null) {
      terminal.error(`No script named ${scriptName} is running on the server`);
      return;
    }
    runningScript.displayLog();
  }
}
