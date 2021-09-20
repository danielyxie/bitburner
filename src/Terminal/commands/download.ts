import { ITerminal } from "../ITerminal";
import { IRouter } from "../../ui/Router";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";
import { isScriptFilename } from "../../Script/ScriptHelpersTS";
import FileSaver from "file-saver";
import JSZip from "jszip";

export function download(
  terminal: ITerminal,
  router: IRouter,
  player: IPlayer,
  server: BaseServer,
  args: (string | number)[],
): void {
  try {
    if (args.length !== 1) {
      terminal.error("Incorrect usage of download command. Usage: download [script/text file]");
      return;
    }
    const fn = args[0] + "";
    if (fn === "*" || fn === "*.script" || fn === "*.txt") {
      // Download all scripts as a zip
      const zip = new JSZip();
      if (fn === "*" || fn === "*.script") {
        for (let i = 0; i < server.scripts.length; ++i) {
          const file = new Blob([server.scripts[i].code], {
            type: "text/plain",
          });
          zip.file(server.scripts[i].filename + ".js", file);
        }
      }
      if (fn === "*" || fn === "*.txt") {
        for (let i = 0; i < server.textFiles.length; ++i) {
          const file = new Blob([server.textFiles[i].text], {
            type: "text/plain",
          });
          zip.file(server.textFiles[i].fn, file);
        }
      }

      let zipFn = "";
      switch (fn) {
        case "*.script":
          zipFn = "bitburnerScripts.zip";
          break;
        case "*.txt":
          zipFn = "bitburnerTexts.zip";
          break;
        default:
          zipFn = "bitburnerFiles.zip";
          break;
      }

      zip.generateAsync({ type: "blob" }).then((content: any) => FileSaver.saveAs(content, zipFn));
      return;
    } else if (isScriptFilename(fn)) {
      // Download a single script
      const script = terminal.getScript(player, fn);
      if (script != null) {
        return script.download();
      }
    } else if (fn.endsWith(".txt")) {
      // Download a single text file
      const txt = terminal.getTextFile(player, fn);
      if (txt != null) {
        return txt.download();
      }
    } else {
      terminal.error(`Cannot download this filetype`);
      return;
    }
    terminal.error(`${fn} does not exist`);
    return;
  } catch (e) {
    terminal.error(e + "");
    return;
  }
}
