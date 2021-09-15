import { ITerminal } from "../ITerminal";
import { IEngine } from "../../IEngine";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";
import { numeralWrapper } from "../../ui/numeralFormat";

export function mem(
  terminal: ITerminal,
  engine: IEngine,
  player: IPlayer,
  server: BaseServer,
  args: (string | number)[],
): void {
  try {
    if (args.length !== 1 && args.length !== 3) {
      terminal.error("Incorrect usage of mem command. usage: mem [scriptname] [-t] [number threads]");
      return;
    }

    const scriptName = args[0] + "";
    let numThreads = 1;
    if (args.length === 3 && args[1] === "-t") {
      numThreads = Math.round(parseInt(args[2] + ""));
      if (isNaN(numThreads) || numThreads < 1) {
        terminal.error("Invalid number of threads specified. Number of threads must be greater than 1");
        return;
      }
    }

    const script = terminal.getScript(player, scriptName);
    if (script == null) {
      terminal.error("No such script exists!");
      return;
    }

    const ramUsage = script.ramUsage * numThreads;

    terminal.print(
      `This script requires ${numeralWrapper.formatRAM(ramUsage)} of RAM to run for ${numThreads} thread(s)`,
    );
  } catch (e) {
    terminal.error(e + "");
  }
}
