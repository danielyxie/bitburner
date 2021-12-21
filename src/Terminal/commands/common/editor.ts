import { ITerminal } from "../../ITerminal";
import { IRouter, ScriptEditorRouteOptions } from "../../../ui/Router";
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

function isNs2(filename: string): boolean {
  return filename.endsWith(".ns") || filename.endsWith(".js");
}

const newNs2Template = `/** @param {NS} ns **/
export async function main(ns) {
    
}`;

export function commonEditor(
  command: string,
  { terminal, router, player, server, args }: EditorParameters,
  scriptEditorRouteOptions?: ScriptEditorRouteOptions,
): void {
  if (args.length < 1) {
    terminal.error(`Incorrect usage of ${command} command. Usage: ${command} [scriptname]`);
    return;
  }

  try {
    const files = args.map((arg) => {
      const filename = `${arg}`;

      if (isScriptFilename(filename)) {
        const filepath = terminal.getFilepath(filename);
        const script = terminal.getScript(player, filename);
        const fileIsNs2 = isNs2(filename);
        const code = script !== null ? script.code : fileIsNs2 ? newNs2Template : "";

        if (code === newNs2Template) {
          CursorPositions.saveCursor(filename, {
            row: 3,
            column: 5,
          });
        }

        return [filepath, code];
      }

      if (filename.endsWith(".txt")) {
        const filepath = terminal.getFilepath(filename);
        const txt = terminal.getTextFile(player, filename);
        return [filepath, txt == null ? "" : txt.text];
      }

      throw new Error(`Invalid file. Only scripts (.script, .ns, .js), or text files (.txt) can be edited with ${command}`);
    });

    router.toScriptEditor(Object.fromEntries(files), scriptEditorRouteOptions);
  } catch (e) {
    terminal.error(`${e}`);
  }
}
