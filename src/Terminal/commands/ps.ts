import { ITerminal } from "../ITerminal";
import { IRouter } from "../../ui/Router";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";
import * as libarg from "arg";

export function ps(
  terminal: ITerminal,
  router: IRouter,
  player: IPlayer,
  server: BaseServer,
  args: (string | number | boolean)[],
): void {
  let flags;
  try {
    flags = libarg(
      {
        "--grep": String,
        "-g": "--grep",
      },
      { argv: args },
    );
  } catch (e) {
    // catch passing only -g / --grep with no string to use as the search
    terminal.error("Incorrect usage of ps command. Usage: ps [-g, --grep pattern]");
    return;
  }
  const pattern = flags["--grep"];
  if (pattern) {
    const re = new RegExp(pattern.toString());
    const matching = server.runningScripts.filter((x) => re.test(x.filename));
    for (let i = 0; i < matching.length; i++) {
      const rsObj = matching[i];
      let res = `(PID - ${rsObj.pid}) ${rsObj.filename}`;
      for (let j = 0; j < rsObj.args.length; ++j) {
        res += " " + rsObj.args[j].toString();
      }
      terminal.print(res);
    }
  }
  if (args.length === 0) {
    for (let i = 0; i < server.runningScripts.length; i++) {
      const rsObj = server.runningScripts[i];
      let res = `(PID - ${rsObj.pid}) ${rsObj.filename}`;
      for (let j = 0; j < rsObj.args.length; ++j) {
        res += " " + rsObj.args[j].toString();
      }
      terminal.print(res);
    }
  }
}
