import { ITerminal } from "../ITerminal";
import { IRouter } from "../../ui/Router";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";
import { LogBoxEvents } from "../../ui/React/LogBoxManager";
import { startWorkerScript } from "../../NetscriptWorker";
import { RunningScript } from "../../Script/RunningScript";
import { findRunningScript } from "../../Script/ScriptHelpers";
import * as libarg from "arg";

export function runScript(
  terminal: ITerminal,
  router: IRouter,
  player: IPlayer,
  server: BaseServer,
  commandArgs: (string | number)[],
): void {
  if (commandArgs.length < 1) {
    terminal.error(
      `Bug encountered with Terminal.runScript(). Command array has a length of less than 1: ${commandArgs}`,
    );
    return;
  }

  const scriptName = terminal.getFilepath(commandArgs[0] + "");

  const runArgs = { "--tail": Boolean, "-t": Number };
  const flags = libarg(runArgs, {
    permissive: true,
    argv: commandArgs.slice(1),
  });
  const threadFlag = Math.round(parseFloat(flags["-t"]));
  const tailFlag = flags["--tail"] === true;
  if (flags["-t"] !== undefined && (threadFlag < 0 || isNaN(threadFlag))) {
    terminal.error("Invalid number of threads specified. Number of threads must be greater than 0");
    return;
  }
  const numThreads = !isNaN(threadFlag) && threadFlag > 0 ? threadFlag : 1;
  const args = flags["_"];

  // Check if this script is already running
  if (findRunningScript(scriptName, args, server) != null) {
    terminal.print("ERROR: This script is already running. Cannot run multiple instances");
    return;
  }

  // Check if the script exists and if it does run it
  for (let i = 0; i < server.scripts.length; i++) {
    if (server.scripts[i].filename !== scriptName) {
      continue;
    }
    // Check for admin rights and that there is enough RAM availble to run
    const script = server.scripts[i];
    const ramUsage = script.ramUsage * numThreads;
    const ramAvailable = server.maxRam - server.ramUsed;

    if (!server.hasAdminRights) {
      terminal.print("Need root access to run script");
      return;
    }

    if (ramUsage > ramAvailable) {
      terminal.print(
        "This machine does not have enough RAM to run this script with " +
          numThreads +
          " threads. Script requires " +
          ramUsage +
          "GB of RAM",
      );
      return;
    }

    // Able to run script
    const runningScript = new RunningScript(script, args);
    runningScript.threads = numThreads;

    const success = startWorkerScript(runningScript, server);
    if (!success) {
      terminal.error(`Failed to start script`);
      return;
    }

    terminal.print(
      `Running script with ${numThreads} thread(s), pid ${runningScript.pid} and args: ${JSON.stringify(args)}.`,
    );
    if (tailFlag) {
      LogBoxEvents.emit(runningScript);
    }
    return;
  }

  terminal.print("ERROR: No such script");
}
