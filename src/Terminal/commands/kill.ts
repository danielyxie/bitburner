import { killWorkerScript } from "../../Netscript/killWorkerScript";
import type { IPlayer } from "../../PersonObjects/IPlayer";
import type { BaseServer } from "../../Server/BaseServer";
import type { IRouter } from "../../ui/Router";
import type { ITerminal } from "../ITerminal";

export function kill(
  terminal: ITerminal,
  router: IRouter,
  player: IPlayer,
  server: BaseServer,
  args: (string | number | boolean)[],
): void {
  try {
    if (args.length < 1) {
      terminal.error("Incorrect usage of kill command. Usage: kill [scriptname] [arg1] [arg2]...");
      return;
    }
    if (typeof args[0] === "boolean") {
      return;
    }

    // Kill by PID
    if (typeof args[0] === "number") {
      const pid = args[0];
      const res = killWorkerScript(pid);
      if (res) {
        terminal.print(`Killing script with PID ${pid}`);
      } else {
        terminal.error(`Failed to kill script with PID ${pid}. No such script is running`);
      }

      return;
    }

    const scriptName = terminal.getFilepath(args[0]);
    const runningScript = server.getRunningScript(scriptName, args.slice(1));
    if (runningScript == null) {
      terminal.error("No such script is running. Nothing to kill");
      return;
    }
    killWorkerScript(runningScript, server.hostname, false);
    terminal.print(`Killing ${scriptName}`);
  } catch (e) {
    terminal.error(e + "");
  }
}
