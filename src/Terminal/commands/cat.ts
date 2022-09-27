import { Terminal } from "../../Terminal";
import { BaseServer } from "../../Server/BaseServer";
import { MessageFilenames, showMessage } from "../../Message/MessageHelpers";
import { showLiterature } from "../../Literature/LiteratureHelpers";
import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { checkEnum } from "../../utils/helpers/checkEnum";

export function cat(args: (string | number | boolean)[], server: BaseServer): void {
  if (args.length !== 1) {
    Terminal.error("Incorrect usage of cat command. Usage: cat [file]");
    return;
  }
  const relative_filename = args[0] + "";
  const filename = Terminal.getFilepath(relative_filename);
  if (
    !filename.endsWith(".msg") &&
    !filename.endsWith(".lit") &&
    !filename.endsWith(".txt") &&
    !filename.endsWith(".script") &&
    !filename.endsWith(".js")
  ) {
    Terminal.error(
      "Only .msg, .txt, .lit, .script and .js files are viewable with cat (filename must end with .msg, .txt, .lit, .script or .js)",
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
        if (!checkEnum(MessageFilenames, file)) return;
        showMessage(file);
        return;
      }
    }
  } else if (filename.endsWith(".txt")) {
    const txt = Terminal.getTextFile(relative_filename);
    if (txt != null) {
      txt.show();
      return;
    }
  } else if (filename.endsWith(".script") || filename.endsWith(".js")) {
    const script = Terminal.getScript(relative_filename);
    if (script != null) {
      dialogBoxCreate(`${script.filename}<br /><br />${script.code}`);
      return;
    }
  }

  Terminal.error(`No such file ${filename}`);
}
