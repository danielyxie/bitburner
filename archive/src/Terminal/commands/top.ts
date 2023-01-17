import { ITerminal } from "../ITerminal";
import { IRouter } from "../../ui/Router";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";
import { getRamUsageFromRunningScript } from "../../Script/RunningScriptHelpers";
import { numeralWrapper } from "../../ui/numeralFormat";

export function top(
  terminal: ITerminal,
  router: IRouter,
  player: IPlayer,
  server: BaseServer,
  args: (string | number | boolean)[],
): void {
  if (args.length !== 0) {
    terminal.error("Incorrect usage of top command. Usage: top");
    return;
  }

  // Headers
  const scriptWidth = 40;
  const pidWidth = 10;
  const threadsWidth = 16;

  const scriptTxt = "Script";
  const pidTxt = "PID";
  const threadsTxt = "Threads";
  const ramTxt = "RAM Usage";

  const spacesAfterScriptTxt = " ".repeat(scriptWidth - scriptTxt.length);
  const spacesAfterPidTxt = " ".repeat(pidWidth - pidTxt.length);
  const spacesAfterThreadsTxt = " ".repeat(threadsWidth - threadsTxt.length);

  const headers = `${scriptTxt}${spacesAfterScriptTxt}${pidTxt}${spacesAfterPidTxt}${threadsTxt}${spacesAfterThreadsTxt}${ramTxt}`;

  terminal.print(headers);

  const currRunningScripts = server.runningScripts;
  // Iterate through scripts on current server
  for (let i = 0; i < currRunningScripts.length; i++) {
    const script = currRunningScripts[i];

    // Calculate name padding
    const numSpacesScript = Math.max(0, scriptWidth - script.filename.length);
    const spacesScript = " ".repeat(numSpacesScript);

    // Calculate PID padding
    const numSpacesPid = Math.max(0, pidWidth - (script.pid + "").length);
    const spacesPid = " ".repeat(numSpacesPid);

    // Calculate thread padding
    const numSpacesThread = Math.max(0, threadsWidth - (script.threads + "").length);
    const spacesThread = " ".repeat(numSpacesThread);

    // Calculate and transform RAM usage
    const ramUsage = numeralWrapper.formatRAM(getRamUsageFromRunningScript(script) * script.threads);

    const entry = [script.filename, spacesScript, script.pid, spacesPid, script.threads, spacesThread, ramUsage].join(
      "",
    );
    terminal.print(entry);
  }
}
