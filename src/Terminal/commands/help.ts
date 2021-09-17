import { ITerminal } from "../ITerminal";
import { IEngine } from "../../IEngine";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";
import { TerminalHelpText, HelpTexts } from "../HelpText";

export function help(
  terminal: ITerminal,
  engine: IEngine,
  player: IPlayer,
  server: BaseServer,
  args: (string | number)[],
): void {
  if (args.length !== 0 && args.length !== 1) {
    terminal.error("Incorrect usage of help command. Usage: help");
    return;
  }
  if (args.length === 0) {
    TerminalHelpText.forEach((line) => terminal.print(line));
  } else {
    const cmd = args[0];
    const txt = HelpTexts[cmd];
    if (txt == null) {
      terminal.error("No help topics match '" + cmd + "'");
      return;
    }
    txt.forEach((t) => terminal.print(t));
  }
}
