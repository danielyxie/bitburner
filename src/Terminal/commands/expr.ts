import { ITerminal } from "../ITerminal";
import { IEngine } from "../../IEngine";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";

export function expr(
  terminal: ITerminal,
  engine: IEngine,
  player: IPlayer,
  server: BaseServer,
  args: (string | number)[],
): void {
  if (args.length === 0) {
    terminal.error("Incorrect usage of expr command. Usage: expr [math expression]");
    return;
  }
  const expr = args.join("");

  // Sanitize the math expression
  const sanitizedExpr = expr.replace(/s+/g, "").replace(/[^-()\d/*+.]/g, "");
  let result;
  try {
    result = eval(sanitizedExpr);
  } catch (e) {
    terminal.error(`Could not evaluate expression: ${sanitizedExpr}`);
    return;
  }
  terminal.print(result);
}
