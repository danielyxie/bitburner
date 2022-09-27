import { Terminal } from "../../Terminal";
import { numeralWrapper } from "../../ui/numeralFormat";
import { Settings } from "../../Settings/Settings";

export function mem(args: (string | number | boolean)[]): void {
  try {
    if (args.length !== 1 && args.length !== 3) {
      Terminal.error("Incorrect usage of mem command. usage: mem [scriptname] [-t] [number threads]");
      return;
    }

    const scriptName = args[0] + "";
    let numThreads = 1;
    if (args.length === 3 && args[1] === "-t") {
      numThreads = Math.round(parseInt(args[2] + ""));
      if (isNaN(numThreads) || numThreads < 1) {
        Terminal.error("Invalid number of threads specified. Number of threads must be greater than 1");
        return;
      }
    }

    const script = Terminal.getScript(scriptName);
    if (script == null) {
      Terminal.error("mem failed. No such script exists!");
      return;
    }

    const ramUsage = script.ramUsage * numThreads;

    Terminal.print(
      `This script requires ${numeralWrapper.formatRAM(ramUsage)} of RAM to run for ${numThreads} thread(s)`,
    );

    const verboseEntries = script.ramUsageEntries?.sort((a, b) => b.cost - a.cost) ?? [];
    const padding = Settings.UseIEC60027_2 ? 9 : 8;
    for (const entry of verboseEntries) {
      Terminal.print(
        `${numeralWrapper.formatRAM(entry.cost * numThreads).padStart(padding)} | ${entry.name} (${entry.type})`,
      );
    }

    if (ramUsage > 0 && verboseEntries.length === 0) {
      // Let's warn the user that he might need to save his script again to generate the detailed entries
      Terminal.warn("You might have to open & save this script to see the detailed RAM usage information.");
    }
  } catch (e) {
    Terminal.error(e + "");
  }
}
