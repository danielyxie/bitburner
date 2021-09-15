import { ITerminal } from "../ITerminal";
import { IEngine } from "../../IEngine";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";
import { Message } from "../../Message/Message";
import { getFirstParentDirectory, isValidDirectoryPath, evaluateDirectoryPath } from "../../Terminal/DirectoryHelpers";

export function ls(
  terminal: ITerminal,
  engine: IEngine,
  player: IPlayer,
  server: BaseServer,
  args: (string | number)[],
): void {
  const numArgs = args.length;
  function incorrectUsage(): void {
    terminal.error("Incorrect usage of ls command. Usage: ls [dir] [| grep pattern]");
  }

  if (numArgs > 5 || numArgs === 3) {
    return incorrectUsage();
  }

  // Grep
  let filter = ""; // Grep

  // Directory path
  let prefix = terminal.cwd();
  if (!prefix.endsWith("/")) {
    prefix += "/";
  }

  // If there are 4+ arguments, then the last 3 must be for grep
  if (numArgs >= 4) {
    if (args[numArgs - 1] !== "grep" || args[numArgs - 2] !== "|") {
      return incorrectUsage();
    }
    filter = args[numArgs] + "";
  }

  // If the second argument is not a pipe, then it must be for listing a directory
  if (numArgs >= 2 && args[0] !== "|") {
    const newPath = evaluateDirectoryPath(args[0] + "", terminal.cwd());
    prefix = newPath ? newPath : "";
    if (prefix != null) {
      if (!prefix.endsWith("/")) {
        prefix += "/";
      }
      if (!isValidDirectoryPath(prefix)) {
        return incorrectUsage();
      }
    }
  }

  // Root directory, which is the same as no 'prefix' at all
  if (prefix === "/") {
    prefix = "";
  }

  // Display all programs and scripts
  const allPrograms: string[] = [];
  const allScripts: string[] = [];
  const allTextFiles: string[] = [];
  const allContracts: string[] = [];
  const allMessages: string[] = [];
  const folders: string[] = [];

  function handleFn(fn: string, dest: string[]): void {
    let parsedFn = fn;
    if (prefix) {
      if (!fn.startsWith(prefix)) {
        return;
      } else {
        parsedFn = fn.slice(prefix.length, fn.length);
      }
    }

    if (filter && !parsedFn.includes(filter)) {
      return;
    }

    // If the fn includes a forward slash, it must be in a subdirectory.
    // Therefore, we only list the "first" directory in its path
    if (parsedFn.includes("/")) {
      const firstParentDir = getFirstParentDirectory(parsedFn);
      if (filter && !firstParentDir.includes(filter)) {
        return;
      }

      if (!folders.includes(firstParentDir)) {
        folders.push(firstParentDir);
      }

      return;
    }

    dest.push(parsedFn);
  }

  // Get all of the programs and scripts on the machine into one temporary array
  const s = player.getCurrentServer();
  for (const program of s.programs) handleFn(program, allPrograms);
  for (const script of s.scripts) handleFn(script.filename, allScripts);
  for (const txt of s.textFiles) handleFn(txt.fn, allTextFiles);
  for (const contract of s.contracts) handleFn(contract.fn, allContracts);
  for (const msgOrLit of s.messages)
    msgOrLit instanceof Message ? handleFn(msgOrLit.filename, allMessages) : handleFn(msgOrLit, allMessages);

  // Sort the files/folders alphabetically then print each
  allPrograms.sort();
  allScripts.sort();
  allTextFiles.sort();
  allContracts.sort();
  allMessages.sort();
  folders.sort();

  function postSegments(segments: string[], config: any): void {
    const maxLength = Math.max(...segments.map((s) => s.length)) + 1;
    const filesPerRow = Math.floor(80 / maxLength);
    for (let i = 0; i < segments.length; i++) {
      let row = "";
      for (let col = 0; col < filesPerRow; col++) {
        if (!(i < segments.length)) break;
        row += segments[i];
        row += " ".repeat(maxLength * (col + 1) - row.length);
        i++;
      }
      i--;
      terminal.print(row, config);
    }
  }

  const config = { color: "#0000FF" };
  const groups = [
    { segments: folders, config: config },
    { segments: allMessages },
    { segments: allTextFiles },
    { segments: allPrograms },
    { segments: allContracts },
    { segments: allScripts },
  ].filter((g) => g.segments.length > 0);
  for (let i = 0; i < groups.length; i++) {
    if (i !== 0) {
      terminal.print("");
      terminal.print("");
    }
    postSegments(groups[i].segments, groups[i].config);
  }
}
