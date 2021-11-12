import { ITerminal } from "../ITerminal";
import { IRouter } from "../../ui/Router";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";
import { isScriptFilename } from "../../Script/isScriptFilename";
import { CursorPositions } from "../../ScriptEditor/CursorPositions";

export function nano(
  terminal: ITerminal,
  router: IRouter,
  player: IPlayer,
  server: BaseServer,
  args: (string | number)[],
): void {
  if (args.length !== 1) {
    terminal.error("Incorrect usage of nano command. Usage: nano [scriptname]");
    return;
  }

  try {
    const filename = args[0] + "";
    if (isScriptFilename(filename)) {
      const filepath = terminal.getFilepath(filename);
      const script = terminal.getScript(player, filename);
      if (script == null) {
        let code = "";
        if (filename.endsWith(".ns") || filename.endsWith(".js")) {
          code = `/** @param {NS} ns **/
export async function main(ns) {
    
}`;
        }
        CursorPositions.saveCursor(filename, {
          row: 3,
          column: 5,
        });
        router.toScriptEditor(filepath, code);
      } else {
        router.toScriptEditor(filepath, script.code);
      }
    } else if (filename.endsWith(".txt")) {
      const filepath = terminal.getFilepath(filename);
      const txt = terminal.getTextFile(player, filename);
      if (txt == null) {
        router.toScriptEditor(filepath);
      } else {
        router.toScriptEditor(filepath, txt.text);
      }
    } else {
      terminal.error(
        "Invalid file. Only scripts (.script, .ns, .js), text files (.txt), or .fconf can be edited with nano",
      );
      return;
    }
  } catch (e) {
    terminal.error(e + "");
  }
}
