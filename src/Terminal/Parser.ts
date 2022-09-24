import { KEY } from "../utils/helpers/keyCodes";
import { substituteAliases } from "../Alias";
// Helper function to parse individual arguments into number/boolean/string as appropriate
function parseArg(arg: string): string | number | boolean {
  // Handles all numbers including hexadecimal, octal, and binary representations, returning NaN on an unparsable string
  const asNumber = Number(arg);
  if (!isNaN(asNumber)) {
    return asNumber;
  }

  if (arg === "true" || arg === "false") {
    return arg === "true";
  }

  return arg;
}

export function ParseCommands(commands: string): string[] {
  // Sanitize input
  commands = commands.trim();
  // Replace all extra whitespace in command with a single space
  commands = commands.replace(/\s\s+/g, " ");

  const match = commands.match(/(?:'[^']*'|"[^"]*"|[^;"])*/g);
  if (!match) return [];
  // Split commands and execute sequentially
  const allCommands = match
    .map(substituteAliases)
    .map((c) => c.match(/(?:'[^']*'|"[^"]*"|[^;"])*/g))
    .flat();

  const out: string[] = [];
  for (const c of allCommands) {
    if (c === null) continue;
    if (c.match(/^\s*$/)) {
      continue;
    } // Don't run commands that only have whitespace
    out.push(c.trim());
  }
  return out;
}

export function ParseCommand(command: string): (string | number | boolean)[] {
  let idx = 0;
  const args = [];

  let lastQuote = "";

  let arg = "";
  while (idx < command.length) {
    const c = command.charAt(idx);

    // If the current character is a backslash, add the next character verbatim to the argument
    if (c === "\\") {
      arg += command.charAt(++idx);
      // If the current character is a single- or double-quote mark, add it to the current argument.
    } else if (c === KEY.DOUBLE_QUOTE || c === KEY.QUOTE) {
      // If we're currently in a quoted string argument and this quote mark is the same as the beginning,
      // the string is done
      if (lastQuote !== "" && c === lastQuote) {
        lastQuote = "";
        // Otherwise if we're not in a string argument, we've begun one
      } else if (lastQuote === "") {
        lastQuote = c;
        // Otherwise if we're in a string argument, add the current character to it
      } else {
        arg += c;
      }
      // If the current character is a space and we are not inside a string, parse the current argument
      // and start a new one
    } else if (c === KEY.SPACE && lastQuote === "") {
      args.push(parseArg(arg));

      arg = "";
    } else {
      // Add the current character to the current argument
      arg += c;
    }

    idx++;
  }

  // Add the last arg (if any)
  if (arg !== "") {
    args.push(parseArg(arg));
  }

  return args;
}
