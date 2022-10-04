import { Terminal } from "../../Terminal";

export function expr(args: (string | number | boolean)[]): void {
  if (args.length === 0) {
    Terminal.error("Incorrect usage of expr command. Usage: expr [math expression]");
    return;
  }
  const expr = args.join("");

  // Sanitize the math expression
  const sanitizedExpr = expr.replace(/s+/g, "").replace(/[^-()\d/*+.%]/g, "");
  let result;
  try {
    result = eval(sanitizedExpr);
  } catch (e) {
    Terminal.error(`Could not evaluate expression: ${sanitizedExpr}`);
    return;
  }
  Terminal.print(result);
}
