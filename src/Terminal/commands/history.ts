import { ITerminal } from "../ITerminal";
import { IRouter } from "../../ui/Router";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";

export function history(
  terminal: ITerminal,
  router: IRouter,
  player: IPlayer,
  server: BaseServer,
  args: (string | number | boolean)[],
): void {
  if (args.length === 0) {
    terminal.commandHistory.forEach((command, index) => {
      terminal.print(`${index.toString().padStart(2)} ${command}`);
    });
    return;
  }
  const arg = args[0] + "";
  if (arg === "-c" || arg === "--clear") {
    player.terminalCommandHistory = [];
    terminal.commandHistory = [];
    terminal.commandHistoryIndex = 1;
  } else {
    terminal.error("Incorrect usage of history command. usage: history [-c]");
  }
}
