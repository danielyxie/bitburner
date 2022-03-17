import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import { toString } from "lodash";
import React from "react";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";
import { evaluateDirectoryPath, getFirstParentDirectory, isValidDirectoryPath } from "../DirectoryHelpers";
import { IRouter } from "../../ui/Router";
import { ITerminal } from "../ITerminal";
import * as libarg from "arg"

export function ls(
  terminal: ITerminal,
  router: IRouter,
  player: IPlayer,
  server: BaseServer,
  args: (string | number | boolean)[],
): void {
  let flags;
  try {
    flags = libarg({
      '-l': Boolean,
      '--grep': String,
      '-g': '--grep',
    },
      { argv: args }
    )
  } catch (e) {
    // catch passing only -g / --grep with no string to use as the search
    incorrectUsage()
    return;
  }
  const filter = flags['--grep']

  const numArgs = args.length;
  function incorrectUsage(): void {
    terminal.error("Incorrect usage of ls command. Usage: ls [dir] [-l] [-g, --grep pattern]");
  }

  if (numArgs > 4) {
    return incorrectUsage();
  }

  // Directory path
  let prefix = terminal.cwd();
  if (!prefix.endsWith("/")) {
    prefix += "/";
  }

  // If first arg doesn't contain a - it must be the file/folder
  const dir = (args[0] && typeof args[0] == "string" && !args[0].startsWith("-")) ? args[0] : ""
  const newPath = evaluateDirectoryPath(dir + "", terminal.cwd());
  prefix = newPath || "";
  if (!prefix.endsWith("/")) {
    prefix += "/";
  }
  if (!isValidDirectoryPath(prefix)) {
    return incorrectUsage();
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
  for (const msgOrLit of s.messages) handleFn(msgOrLit, allMessages);

  // Sort the files/folders alphabetically then print each
  allPrograms.sort();
  allScripts.sort();
  allTextFiles.sort();
  allContracts.sort();
  allMessages.sort();
  folders.sort();

  interface ClickableScriptRowProps {
    row: string;
    prefix: string;
    hostname: string;
  }

  function ClickableScriptRow({ row, prefix, hostname }: ClickableScriptRowProps): React.ReactElement {
    const classes = makeStyles((theme: Theme) =>
      createStyles({
        scriptLinksWrap: {
          display: "inline-flex",
          color: theme.palette.warning.main,
        },
        scriptLink: {
          cursor: "pointer",
          textDecorationLine: "underline",
          paddingRight: "1.15em",
          "&:last-child": { padding: 0 },
        },
      }),
    )();

    const rowSplit = row
      .split(" ")
      .map((x) => x.trim())
      .filter((x) => !!x);

    function onScriptLinkClick(filename: string): void {
      if (player.getCurrentServer().hostname !== hostname) {
        return terminal.error(`File is not on this server, connect to ${hostname} and try again`);
      }
      if (filename.startsWith("/")) filename = filename.slice(1);
      const filepath = terminal.getFilepath(`${prefix}${filename}`);
      const code = toString(terminal.getScript(player, filepath)?.code);
      router.toScriptEditor({ [filepath]: code });
    }

    return (
      <span className={classes.scriptLinksWrap}>
        {rowSplit.map((rowItem) => (
          <span key={rowItem} className={classes.scriptLink} onClick={() => onScriptLinkClick(rowItem)}>
            {rowItem}
          </span>
        ))}
      </span>
    );
  }

  function postSegments(segments: string[], flags: any, style?: any, linked?: boolean): void {
    const maxLength = Math.max(...segments.map((s) => s.length)) + 1;
    const filesPerRow = flags["-l"] === true ? 1 : Math.ceil(80 / maxLength);
    for (let i = 0; i < segments.length; i++) {
      let row = "";
      for (let col = 0; col < filesPerRow; col++) {
        if (!(i < segments.length)) break;
        row += segments[i];
        row += " ".repeat(maxLength * (col + 1) - row.length);
        i++;
      }
      i--;
      if (!style) {
        terminal.print(row);
      } else if (linked) {
          terminal.printRaw(<ClickableScriptRow row={row} prefix={prefix} hostname={server.hostname} />);
        } else {
          terminal.printRaw(<span style={style}>{row}</span>);
        }
    }
  }

  const groups = [
    { segments: folders, style: { color: "cyan" } },
    { segments: allMessages },
    { segments: allTextFiles },
    { segments: allPrograms },
    { segments: allContracts },
    { segments: allScripts, style: { color: "yellow", fontStyle: "bold" }, linked: true },
  ].filter((g) => g.segments.length > 0);
  for (let i = 0; i < groups.length; i++) {
    postSegments(groups[i].segments, flags, groups[i].style, groups[i].linked);
  }
}
