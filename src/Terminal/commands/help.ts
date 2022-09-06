import { Terminal } from "../../Terminal";
import { TerminalHelpText, HelpTexts } from "../HelpText";

export function help(args: (string | number | boolean)[]): void {
  if (args.length !== 0 && args.length !== 1) {
    Terminal.error("Incorrect usage of help command. Usage: help");
    return;
  }
  if (args.length === 0) {
    TerminalHelpText.forEach((line) => Terminal.print(line));
  } else {
    const cmd = args[0] + "";
    const txt = HelpTexts[cmd];
    if (txt == null) {
      Terminal.error("No help topics match '" + cmd + "'");
      return;
    }
    txt.forEach((t) => Terminal.print(t));
  }
}
