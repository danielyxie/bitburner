import { ITerminal } from "../ITerminal";
import { IEngine } from "../../IEngine";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";
import { killWorkerScript } from "../../Netscript/killWorkerScript";

export function kill(
  terminal: ITerminal,
  engine: IEngine,
  player: IPlayer,
  server: BaseServer,
  args: (string | number)[],
): void {
  try {
    if (args.length < 1) {
      terminal.error("Incorrect usage of kill command. Usage: kill [scriptname] [arg1] [arg2]...");
      return;
    }

    // Kill by PID
    if (typeof args[0] === "number") {
      const pid = args[0];
      const res = killWorkerScript(pid);
      if (res) {
        terminal.print(`Killing script with PID ${pid}`);
      } else {
        terminal.print(`Failed to kill script with PID ${pid}. No such script exists`);
      }

      return;
    }

    const scriptName = terminal.getFilepath(args[0]);
    const runningScript = server.getRunningScript(scriptName, args.slice(1));
    if (runningScript == null) {
      terminal.error("No such script is running. Nothing to kill");
      return;
    }
    killWorkerScript(runningScript, server.ip, false);
    terminal.print(`Killing ${scriptName}`);
  } catch (e) {
    terminal.error(e + "");
  }
}
