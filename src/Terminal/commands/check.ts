import { ITerminal } from "../ITerminal";
import { IRouter } from "../../ui/Router";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";
import { findRunningScript } from "../../Script/ScriptHelpers";
import { isScriptFilename } from "../../Script/isScriptFilename";

export function check(
  terminal: ITerminal,
  router: IRouter,
  player: IPlayer,
  server: BaseServer,
  args: (string | number)[],
): void {
  if (args.length < 1) {
    terminal.error("Incorrect number of arguments. Usage: check [script] [arg1] [arg2]...");
  } else {
    const scriptName = terminal.getFilepath(args[0] + "");
    // Can only tail script files
    if (!isScriptFilename(scriptName)) {
      terminal.error("tail can only be called on .script files (filename must end with .script)");
      return;
    }

    // Check that the script exists on this machine
    const runningScript = findRunningScript(scriptName, args.slice(1), server);
    if (runningScript == null) {
      terminal.error("No such script exists");
      return;
    }
    runningScript.displayLog();
  }
}
