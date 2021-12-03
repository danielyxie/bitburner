import { substituteAliases } from "../Alias";
// Helper function that checks if an argument (which is a string) is a valid number
function isNumber(str: string): boolean {
  if (typeof str != "string") {
    return false;
  } // Only process strings
  return !isNaN(str as unknown as number) && !isNaN(parseFloat(str));
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
  // This will be used to keep track of whether we're in a quote. This is for situations
  // like the alias command:
  //      alias run="run NUKE.exe"
  // We want the run="run NUKE.exe" to be parsed as a single command, so this flag
  // will keep track of whether we have a quote in
  let inQuote = ``;

  // Returns an array with the command and its arguments in each index
  // Properly handles quotation marks (e.g. `run foo.script "the sun"` will return [run, foo.script, the sun])
  const args = [];
  let start = 0,
    i = 0;
  let prevChar = ""; // Previous character
  while (i < command.length) {
    let escaped = false; // Check for escaped quotation marks
    if (i >= 1) {
      prevChar = command.charAt(i - 1);
      if (prevChar === "\\") {
        escaped = true;
      }
    }

    const c = command.charAt(i);
    if (c === '"') {
      // Double quotes
      if (!escaped && prevChar === " ") {
        const endQuote = command.indexOf('"', i + 1);
        if (endQuote !== -1 && (endQuote === command.length - 1 || command.charAt(endQuote + 1) === " ")) {
          args.push(command.substr(i + 1, endQuote - i - 1));
          if (endQuote === command.length - 1) {
            start = i = endQuote + 1;
          } else {
            start = i = endQuote + 2; // Skip the space
          }
          continue;
        }
      } else {
        if (inQuote === ``) {
          inQuote = `"`;
        } else if (inQuote === `"`) {
          inQuote = ``;
        }
      }
    } else if (c === "'") {
      // Single quotes, same thing as above
      if (!escaped && prevChar === " ") {
        const endQuote = command.indexOf("'", i + 1);
        if (endQuote !== -1 && (endQuote === command.length - 1 || command.charAt(endQuote + 1) === " ")) {
          args.push(command.substr(i + 1, endQuote - i - 1));
          if (endQuote === command.length - 1) {
            start = i = endQuote + 1;
          } else {
            start = i = endQuote + 2; // Skip the space
          }
          continue;
        }
      } else {
        if (inQuote === ``) {
          inQuote = `'`;
        } else if (inQuote === `'`) {
          inQuote = ``;
        }
      }
    } else if (c === " " && inQuote === ``) {
      const arg = command.substr(start, i - start);

      // If this is a number, convert it from a string to number
      console.log(arg);
      if (isNumber(arg)) {
        args.push(parseFloat(arg));
      } else if (arg === "true") {
        args.push(true);
      } else if (arg === "false") {
        args.push(false);
      } else {
        args.push(arg);
      }

      start = i + 1;
    }
    ++i;
  }

  // Add the last argument
  if (start !== i) {
    const arg = command.substr(start, i - start);

    // If this is a number, convert it from string to number
    console.log(arg);
    if (isNumber(arg)) {
      args.push(parseFloat(arg));
    } else if (arg === "true") {
      args.push(true);
    } else if (arg === "false") {
      args.push(false);
    } else {
      args.push(arg);
    }
  }

  return args;
}
