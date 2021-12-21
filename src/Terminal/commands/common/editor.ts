import { ITerminal } from "../../ITerminal";
import { IRouter, ScriptEditorRouteOptions} from "../../../ui/Router";
import { IPlayer } from "../../../PersonObjects/IPlayer";
import { BaseServer } from "../../../Server/BaseServer";
import { isScriptFilename } from "../../../Script/isScriptFilename";
import { CursorPositions } from "../../../ScriptEditor/CursorPositions";

interface EditorParameters {
  terminal: ITerminal;
  router: IRouter;
  player: IPlayer;
  server: BaseServer;
  args: (string | number | boolean)[];
}


export function commonEditor(command: string, {
  terminal,
  router,
  player,
  server,
  args,
}: EditorParameters, scriptEditorRouteOptions?: ScriptEditorRouteOptions): void {
  if (args.length !== 1) {
    terminal.error(`Incorrect usage of ${command} command. Usage: ${command} [scriptname]`);
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
        router.toScriptEditor(filepath, code, scriptEditorRouteOptions);
      } else {
        router.toScriptEditor(filepath, script.code, scriptEditorRouteOptions);
      }
    } else if (filename.endsWith(".txt")) {
      const filepath = terminal.getFilepath(filename);
      const txt = terminal.getTextFile(player, filename);
      if (txt == null) {
        router.toScriptEditor(filepath, "", scriptEditorRouteOptions);
      } else {
        router.toScriptEditor(filepath, txt.text, scriptEditorRouteOptions);
      }
    } else {
      terminal.error("Invalid file. Only scripts (.script, .ns, .js), or text files (.txt) can be edited with vim");
      return;
    }
  } catch (e) {
    terminal.error(e + "");
  }
}
