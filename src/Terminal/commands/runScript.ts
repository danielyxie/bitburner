import { Terminal } from "../../Terminal";
import { BaseServer } from "../../Server/BaseServer";
import { LogBoxEvents } from "../../ui/React/LogBoxManager";
import { startWorkerScript } from "../../NetscriptWorker";
import { RunningScript } from "../../Script/RunningScript";
import { findRunningScript } from "../../Script/ScriptHelpers";
import * as libarg from "arg";
import { numeralWrapper } from "../../ui/numeralFormat";

export function runScript(commandArgs: (string | number | boolean)[], server: BaseServer): void {
  if (commandArgs.length < 1) {
    Terminal.error(
      `Bug encountered with Terminal.runScript(). Command array has a length of less than 1: ${commandArgs}`,
    );
    return;
  }

  const scriptName = Terminal.getFilepath(commandArgs[0] + "");

  const runArgs = { "--tail": Boolean, "-t": Number };
  const flags = libarg(runArgs, {
    permissive: true,
    argv: commandArgs.slice(1),
  });
  const threadFlag = Math.round(parseFloat(flags["-t"]));
  const tailFlag = flags["--tail"] === true;
  if (flags["-t"] !== undefined && (threadFlag < 0 || isNaN(threadFlag))) {
    Terminal.error("Invalid number of threads specified. Number of threads must be greater than 0");
    return;
  }
  const numThreads = !isNaN(threadFlag) && threadFlag > 0 ? threadFlag : 1;
  const args = flags["_"];

  // Check if this script is already running
  if (findRunningScript(scriptName, args, server) != null) {
    Terminal.error(
      "This script is already running with the same args. Cannot run multiple instances with the same args",
    );
    return;
  }

  // Check if the script exists and if it does run it
  for (let i = 0; i < server.scripts.length; i++) {
    if (server.scripts[i].filename !== scriptName) {
      continue;
    }
    // Check for admin rights and that there is enough RAM available to run
    const script = server.scripts[i];
    script.server = server.hostname;
    const ramUsage = script.ramUsage * numThreads;
    const ramAvailable = server.maxRam - server.ramUsed;

    if (!server.hasAdminRights) {
      Terminal.error("Need root access to run script");
      return;
    }

    if (ramUsage > ramAvailable + 0.001) {
      Terminal.error(
        "This machine does not have enough RAM to run this script" +
          (numThreads === 1 ? "" : ` with ${numThreads} threads`) +
          `. Script requires ${numeralWrapper.formatRAM(ramUsage)} of RAM`,
      );
      return;
    }

    // Able to run script
    const runningScript = new RunningScript(script, args);
    runningScript.threads = numThreads;

    const success = startWorkerScript(runningScript, server);
    if (!success) {
      Terminal.error(`Failed to start script`);
      return;
    }

    Terminal.print(
      `Running script with ${numThreads} thread(s), pid ${runningScript.pid} and args: ${JSON.stringify(args)}.`,
    );
    if (tailFlag) {
      LogBoxEvents.emit(runningScript);
    }
    return;
  }

  Terminal.error("No such script");
}
