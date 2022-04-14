import type { IPlayer } from "../../PersonObjects/IPlayer";
import type { BaseServer } from "../../Server/BaseServer";
import type { IRouter } from "../../ui/Router";
import type { ITerminal } from "../ITerminal";

export function expr(
  terminal: ITerminal,
  router: IRouter,
  player: IPlayer,
  server: BaseServer,
  args: (string | number | boolean)[],
): void {
  if (args.length === 0) {
    terminal.error("Incorrect usage of expr command. Usage: expr [math expression]");
    return;
  }
  const expr = args.join("");

  // Sanitize the math expression
  const sanitizedExpr = expr.replace(/s+/g, "").replace(/[^-()\d/*+.%]/g, "");
  let result;
  try {
    result = eval(sanitizedExpr);
  } catch (e) {
    terminal.error(`Could not evaluate expression: ${sanitizedExpr}`);
    return;
  }
  terminal.print(result);
}
