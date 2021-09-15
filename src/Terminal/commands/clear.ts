import { ITerminal } from "../ITerminal";
import { IEngine } from "../../IEngine";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";

export function clear(
  terminal: ITerminal,
  engine: IEngine,
  player: IPlayer,
  server: BaseServer,
  args: (string | number)[],
): void {
  if (args.length !== 0) {
    terminal.error("Incorrect usage of clear/cls command. Usage: clear/cls");
    return;
  }
  $("#terminal tr:not(:last)").remove();
}
