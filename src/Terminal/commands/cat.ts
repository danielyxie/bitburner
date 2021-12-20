import { ITerminal } from "../ITerminal";
import { IRouter } from "../../ui/Router";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";
import { showMessage } from "../../Message/MessageHelpers";
import { showLiterature } from "../../Literature/LiteratureHelpers";
import { dialogBoxCreate } from "../../ui/React/DialogBox";

export function cat(
  terminal: ITerminal,
  router: IRouter,
  player: IPlayer,
  server: BaseServer,
  args: (string | number | boolean)[],
): void {
  if (args.length !== 1) {
    terminal.error("Incorrect usage of cat command. Usage: cat [file]");
    return;
  }
  const relative_filename = args[0] + "";
  const filename = terminal.getFilepath(relative_filename);
  if (!filename.endsWith(".msg") && !filename.endsWith(".lit") && !filename.endsWith(".txt") && !filename.endsWith(".script") && !filename.endsWith(".js") && !filename.endsWith(".ns")) {
    terminal.error(
      "Only .msg, .txt, .lit, .script, .js, and .ns files are viewable with cat (filename must end with .msg, .txt, .lit, .script, .js, or .ns)",
    );
    return;
  }

  if (filename.endsWith(".msg") || filename.endsWith(".lit")) {
    for (let i = 0; i < server.messages.length; ++i) {
      if (filename.endsWith(".lit") && server.messages[i] === filename) {
        const file = server.messages[i];
        if (file.endsWith(".msg")) throw new Error(".lit file should not be a .msg");
        showLiterature(file);
        return;
      } else if (filename.endsWith(".msg")) {
        const file = server.messages[i];
        if (file !== filename) continue;
        showMessage(file);
        return;
      }
    }
  } else if (filename.endsWith(".txt")) {
    const txt = terminal.getTextFile(player, relative_filename);
    if (txt != null) {
      txt.show();
      return;
    }
  } else if (filename.endsWith(".script") || filename.endsWith(".js") || filename.endsWith(".ns")) {
    const script = terminal.getScript(player, relative_filename);
    if (script != null) {
      dialogBoxCreate(`${script.filename}<br /><br />${script.code}`);
      return;
    }
  }

  terminal.error(`No such file ${filename}`);
}
