import { KEY } from "../utils/helpers/keyCodes";
import { substituteAliases } from "../Alias";
// Helper function to parse individual arguments into number/boolean/string as appropriate
function parseArg(arg: string): string | number | boolean {
  // Handles all numbers including hexadecimal, octal, and binary representations, returning NaN on an unparseable string
  const asNumber = Number(arg);
  if (!isNaN(asNumber)) {
    return asNumber;
  }

  if (arg === 'true' || arg === 'false') {
    return arg === 'true';
  }

  // Strip quotation marks from strings that begin/end with the same mark
  return arg.replace(/^"(.*?)"$/g, '$1').replace(/^'(.*?)'$/g, '$1');
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

  // Track depth of quoted strings, e.g.: "the're 'going away' rather 'quickly \"and awkwardly\"'" should be parsed as a single string
  const quotes: string[] = [];

  let arg = '';
  while (idx < command.length) {
    const c = command.charAt(idx);

    // If the current character is a backslash, add the next character verbatim to the argument
    if (c === '\\') {
      arg += command.charAt(++idx);
    // If the current character is a single- or double-quote mark, add it to the current argument.
    } else if (c === KEY.DOUBLE_QUOTE || c === KEY.QUOTE) {
      arg += c;
      const quote = quotes[quotes.length - 1];
      const prev = command.charAt(idx - 1);
      const next = command.charAt(idx + 1);
      // If the previous character is a space or an equal sign this is a valid start to a new string.
      // If we're already in a quoted string, push onto the stack of string starts to track depth.
      if (
        c !== quote &&
        (
          prev === KEY.SPACE ||
          prev === KEY.EQUAL ||
          (c === KEY.DOUBLE_QUOTE && prev === KEY.QUOTE) ||
          (c === KEY.QUOTE && prev === KEY.DOUBLE_QUOTE)
        )
      ) {
        quotes.push(c);
      // If the next character is a space and the current character is the same as the previously used
      // quotation mark, this is a valid end to a string. Pop off the depth tracker.
      } else if (
        c === quote &&
        (
          next === KEY.SPACE ||
          (c === KEY.DOUBLE_QUOTE && next === KEY.QUOTE) ||
          (c === KEY.QUOTE && next === KEY.DOUBLE_QUOTE)
        )
      ) {
        quotes.pop();
      }
    // If the current character is a space and we are not inside a string, parse the current argument
    // and start a new one
    } else if (c === KEY.SPACE && quotes.length === 0) {
      args.push(parseArg(arg));

      arg = '';
    } else {
      // Add the current character to the current argument
      arg += c;
    }

    idx++;
  }

  // Add the last arg (if any)
  if (arg !== '') {
    args.push(parseArg(arg));
  }

  return args;
}
