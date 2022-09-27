import { Terminal } from "../../Terminal";
import { BaseServer } from "../../Server/BaseServer";
import { killWorkerScript } from "../../Netscript/killWorkerScript";

export function kill(args: (string | number | boolean)[], server: BaseServer): void {
  try {
    if (args.length < 1) {
      Terminal.error("Incorrect usage of kill command. Usage: kill [scriptname] [arg1] [arg2]...");
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
        Terminal.print(`Killing script with PID ${pid}`);
      } else {
        Terminal.error(`Failed to kill script with PID ${pid}. No such script is running`);
      }

      return;
    }

    const scriptName = Terminal.getFilepath(args[0]);
    const runningScript = server.getRunningScript(scriptName, args.slice(1));
    if (runningScript == null) {
      Terminal.error("No such script is running. Nothing to kill");
      return;
    }
    killWorkerScript({ runningScript: runningScript, hostname: server.hostname });
    Terminal.print(`Killing ${scriptName}`);
  } catch (e) {
    Terminal.error(e + "");
  }
}
