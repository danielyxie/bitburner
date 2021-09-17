import { ITerminal } from "../ITerminal";
import { IRouter } from "../../ui/Router";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";
import { logBoxCreate } from "../../../utils/LogBox";
import { findRunningScriptByPid } from "../../Script/ScriptHelpers";
import { compareArrays } from "../../../utils/helpers/compareArrays";
import { isScriptFilename } from "../../Script/ScriptHelpersTS";

export function tail(
  terminal: ITerminal,
  router: IRouter,
  player: IPlayer,
  server: BaseServer,
  commandArray: (string | number)[],
): void {
  try {
    if (commandArray.length < 1) {
      terminal.error("Incorrect number of arguments. Usage: tail [script] [arg1] [arg2]...");
    } else if (typeof commandArray[0] === "string") {
      const scriptName = terminal.getFilepath(commandArray[0]);
      if (!isScriptFilename(scriptName)) {
        terminal.error("tail can only be called on .script, .ns, .js files, or by pid");
        return;
      }

      // Get script arguments
      const args = [];
      for (let i = 1; i < commandArray.length; ++i) {
        args.push(commandArray[i]);
      }

      // go over all the running scripts. If there's a perfect
      // match, use it!
      for (let i = 0; i < server.runningScripts.length; ++i) {
        if (server.runningScripts[i].filename === scriptName && compareArrays(server.runningScripts[i].args, args)) {
          logBoxCreate(server.runningScripts[i]);
          return;
        }
      }

      // Find all scripts that are potential candidates.
      const candidates = [];
      for (let i = 0; i < server.runningScripts.length; ++i) {
        // only scripts that have more arguments (equal arguments is already caught)
        if (server.runningScripts[i].args.length < args.length) continue;
        // make a smaller copy of the args.
        const args2 = server.runningScripts[i].args.slice(0, args.length);
        if (server.runningScripts[i].filename === scriptName && compareArrays(args2, args)) {
          candidates.push(server.runningScripts[i]);
        }
      }

      // If there's only 1 possible choice, use that.
      if (candidates.length === 1) {
        logBoxCreate(candidates[0]);
        return;
      }

      // otherwise lists all possible conflicting choices.
      if (candidates.length > 1) {
        terminal.error("Found several potential candidates:");
        for (const candidate of candidates) terminal.error(`${candidate.filename} ${candidate.args.join(" ")}`);
        terminal.error("Script arguments need to be specified.");
        return;
      }

      // if there's no candidate then we just don't know.
      terminal.error("No such script exists.");
    } else {
      const runningScript = findRunningScriptByPid(commandArray[0], server);
      if (runningScript == null) {
        terminal.error("No such script exists");
        return;
      }
      logBoxCreate(runningScript);
    }
  } catch (e) {
    terminal.error(e + "");
  }
}
