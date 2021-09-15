import { ITerminal } from "../ITerminal";
import { IEngine } from "../../IEngine";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";

export function ps(
  terminal: ITerminal,
  engine: IEngine,
  player: IPlayer,
  server: BaseServer,
  args: (string | number)[],
): void {
  if (args.length !== 0) {
    terminal.error("Incorrect usage of ps command. Usage: ps");
    return;
  }
  for (let i = 0; i < server.runningScripts.length; i++) {
    const rsObj = server.runningScripts[i];
    let res = `(PID - ${rsObj.pid}) ${rsObj.filename}`;
    for (let j = 0; j < rsObj.args.length; ++j) {
      res += " " + rsObj.args[j].toString();
    }
    terminal.print(res);
  }
}
