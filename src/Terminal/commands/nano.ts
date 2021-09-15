import { ITerminal } from "../ITerminal";
import { IEngine } from "../../IEngine";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";
import { isScriptFilename } from "../../Script/ScriptHelpersTS";
import { createFconf } from "../../Fconf/Fconf";

export function nano(
  terminal: ITerminal,
  engine: IEngine,
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
    if (filename === ".fconf") {
      const text = createFconf();
      engine.loadScriptEditorContent(filename, text);
      return;
    } else if (isScriptFilename(filename)) {
      const filepath = terminal.getFilepath(filename);
      const script = terminal.getScript(player, filename);
      if (script == null) {
        let code = "";
        if (filename.endsWith(".ns") || filename.endsWith(".js")) {
          code = `export async function main(ns) {

}`;
        }
        engine.loadScriptEditorContent(filepath, code);
      } else {
        engine.loadScriptEditorContent(filepath, script.code);
      }
    } else if (filename.endsWith(".txt")) {
      const filepath = terminal.getFilepath(filename);
      const txt = terminal.getTextFile(player, filename);
      if (txt == null) {
        engine.loadScriptEditorContent(filepath);
      } else {
        engine.loadScriptEditorContent(filepath, txt.text);
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
