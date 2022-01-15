import { ITerminal } from "../ITerminal";
import { IRouter } from "../../ui/Router";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";
import { numeralWrapper } from "../../ui/numeralFormat";
import { Settings } from "../../Settings/Settings";

export function mem(
  terminal: ITerminal,
  router: IRouter,
  player: IPlayer,
  server: BaseServer,
  args: (string | number | boolean)[],
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
      terminal.error("mem failed. No such script exists!");
      return;
    }

    const ramUsage = script.ramUsage * numThreads;

    terminal.print(
      `This script requires ${numeralWrapper.formatRAM(ramUsage)} of RAM to run for ${numThreads} thread(s)`,
    );

    const verboseEntries = script.ramUsageEntries?.sort((a, b) => b.cost - a.cost) ?? [];
    const padding = Settings.UseIEC60027_2 ? 9 : 8;
    for (const entry of verboseEntries) {
      terminal.print(`${numeralWrapper.formatRAM(entry.cost * numThreads).padStart(padding)} | ${entry.name} (${entry.type})`);
    }

    if (ramUsage > 0 && verboseEntries.length === 0) {
      // Let's warn the user that he might need to save his script again to generate the detailed entries
      terminal.warn('You might have to open & save this script to see the detailed RAM usage information.');
    }
  } catch (e) {
    terminal.error(e + "");
  }
}
