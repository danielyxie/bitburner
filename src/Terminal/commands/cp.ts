import { ITerminal } from "../ITerminal";
import { IRouter } from "../../ui/Router";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";
import { isScriptFilename } from "../../Script/isScriptFilename";
import { getDestinationFilepath, areFilesEqual } from "../DirectoryHelpers";

export function cp(
  terminal: ITerminal,
  router: IRouter,
  player: IPlayer,
  server: BaseServer,
  args: (string | number | boolean)[],
): void {
  try {
    if (args.length !== 2) {
      terminal.error("Incorrect usage of cp command. Usage: cp [src] [dst]");
      return;
    }
    // Convert a relative path source file to the absolute path.
    const src = terminal.getFilepath(args[0] + "");
    if (src === null) {
      terminal.error("src cannot be a directory");
      return;
    }

    // Get the destination based on the source file and the current directory
    const t_dst = getDestinationFilepath(args[1] + "", src, terminal.cwd());
    if (t_dst === null) {
      terminal.error("error parsing dst file");
      return;
    }

    // Convert a relative path destination file to the absolute path.
    const dst = terminal.getFilepath(t_dst);
    if (areFilesEqual(src, dst)) {
      terminal.error("src and dst cannot be the same");
      return;
    }
    const srcExt = src.slice(src.lastIndexOf("."));
    const dstExt = dst.slice(dst.lastIndexOf("."));
    if (srcExt !== dstExt) {
      terminal.error("src and dst must have the same extension.");
      return;
    }
    const filename = terminal.getFilepath(src);
    if (!isScriptFilename(filename) && !filename.endsWith(".txt")) {
      terminal.error("cp only works for scripts and .txt files");
      return;
    }

    // Scp for txt files
    if (filename.endsWith(".txt")) {
      let txtFile = null;
      for (let i = 0; i < server.textFiles.length; ++i) {
        if (server.textFiles[i].fn === filename) {
          txtFile = server.textFiles[i];
          break;
        }
      }

      if (txtFile === null) {
        return terminal.error("No such file exists!");
      }

      const tRes = server.writeToTextFile(dst, txtFile.text);
      if (!tRes.success) {
        terminal.error("cp failed");
        return;
      }
      if (tRes.overwritten) {
        terminal.print(`WARNING: ${dst} already exists and will be overwriten`);
        terminal.print(`${dst} overwritten`);
        return;
      }
      terminal.print(`${dst} copied`);
      return;
    }

    // Get the current script
    let sourceScript = null;
    for (let i = 0; i < server.scripts.length; ++i) {
      if (filename == server.scripts[i].filename) {
        sourceScript = server.scripts[i];
        break;
      }
    }
    if (sourceScript == null) {
      terminal.error("cp failed. No such script exists");
      return;
    }

    const sRes = server.writeToScriptFile(dst, sourceScript.code);
    if (!sRes.success) {
      terminal.error(`cp failed`);
      return;
    }
    if (sRes.overwritten) {
      terminal.print(`WARNING: ${dst} already exists and will be overwritten`);
      terminal.print(`${dst} overwritten`);
      return;
    }
    terminal.print(`${dst} copied`);
  } catch (e) {
    terminal.error(e + "");
  }
}
