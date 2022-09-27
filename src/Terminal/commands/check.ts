import { Terminal } from "../../Terminal";
import { BaseServer } from "../../Server/BaseServer";
import { findRunningScript } from "../../Script/ScriptHelpers";
import { isScriptFilename, validScriptExtensions } from "../../Script/isScriptFilename";

export function check(args: (string | number | boolean)[], server: BaseServer): void {
  if (args.length < 1) {
    Terminal.error(`Incorrect number of arguments. Usage: check [script] [arg1] [arg2]...`);
  } else {
    const scriptName = Terminal.getFilepath(args[0] + "");
    // Can only tail script files
    if (!isScriptFilename(scriptName)) {
      Terminal.error(
        `'check' can only be called on scripts files (filename must end with ${validScriptExtensions.join(", ")})`,
      );
      return;
    }

    // Check that the script is running on this machine
    const runningScript = findRunningScript(scriptName, args.slice(1), server);
    if (runningScript == null) {
      Terminal.error(`No script named ${scriptName} is running on the server`);
      return;
    }
    runningScript.displayLog();
  }
}
