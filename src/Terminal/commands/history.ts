import { Terminal } from "../../Terminal";
import { Player } from "../../Player";

export function history(args: (string | number | boolean)[]): void {
  if (args.length === 0) {
    Terminal.commandHistory.forEach((command, index) => {
      Terminal.print(`${index.toString().padStart(2)} ${command}`);
    });
    return;
  }
  const arg = args[0] + "";
  if (arg === "-c" || arg === "--clear") {
    Player.terminalCommandHistory = [];
    Terminal.commandHistory = [];
    Terminal.commandHistoryIndex = 1;
  } else {
    Terminal.error("Incorrect usage of history command. usage: history [-c]");
  }
}
