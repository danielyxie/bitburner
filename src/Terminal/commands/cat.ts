import { ITerminal } from "../ITerminal";
import { IRouter } from "../../ui/Router";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";
import { showMessage } from "../../Message/MessageHelpers";
import { showLiterature } from "../../Literature/LiteratureHelpers";

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
  const filename = terminal.getFilepath(args[0] + "");
  if (!filename.endsWith(".msg") && !filename.endsWith(".lit") && !filename.endsWith(".txt")) {
    terminal.error(
      "Only .msg, .txt, and .lit files are viewable with cat (filename must end with .msg, .txt, or .lit)",
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
    const txt = terminal.getTextFile(player, "/" + filename);
    if (txt != null) {
      txt.show();
      return;
    }
  }

  terminal.error(`No such file ${filename}`);
}
