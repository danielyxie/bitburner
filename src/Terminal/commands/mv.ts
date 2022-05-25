import { ITerminal } from "../ITerminal";
import { IRouter } from "../../ui/Router";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";
import { isScriptFilename } from "../../Script/isScriptFilename";
import { TextFile } from "../../TextFile";
import { Script } from "../../Script/Script";
import { getDestinationFilepath, areFilesEqual } from "../DirectoryHelpers";

export function mv(
  terminal: ITerminal,
  router: IRouter,
  player: IPlayer,
  server: BaseServer,
  args: (string | number | boolean)[],
): void {
  if (args.length !== 2) {
    terminal.error(`Incorrect number of arguments. Usage: mv [src] [dest]`);
    return;
  }

  try {
    const source = args[0] + "";
    const t_dest = args[1] + "";

    if (!isScriptFilename(source) && !source.endsWith(".txt")) {
      terminal.error(`'mv' can only be used on scripts and text files (.txt)`);
      return;
    }

    const srcFile = terminal.getFile(player, source);
    if (srcFile == null) {
      terminal.error(`Source file ${source} does not exist`);
      return;
    }

    const sourcePath = terminal.getFilepath(source);
    // Get the destination based on the source file and the current directory
    const dest = getDestinationFilepath(t_dest, source, terminal.cwd());
    if (dest === null) {
      terminal.error("error parsing dst file");
      return;
    }

    const destFile = terminal.getFile(player, dest);
    const destPath = terminal.getFilepath(dest);
    if (areFilesEqual(sourcePath, destPath)) {
      terminal.error(`Source and destination files are the same file`);
      return;
    }

    // 'mv' command only works on scripts and txt files.
    // Also, you can't convert between different file types
    if (isScriptFilename(source)) {
      const script = srcFile as Script;
      if (!isScriptFilename(destPath)) {
        terminal.error(`Source and destination files must have the same type`);
        return;
      }

      // Command doesnt work if script is running
      if (server.isRunning(sourcePath)) {
        terminal.error(`Cannot use 'mv' on a script that is running`);
        return;
      }

      if (destFile != null) {
        // Already exists, will be overwritten, so we'll delete it

        // Command doesnt work if script is running
        if (server.isRunning(destPath)) {
          terminal.error(`Cannot use 'mv' on a script that is running`);
          return;
        }

        const status = server.removeFile(destPath);
        if (!status.res) {
          terminal.error(`Something went wrong...please contact game dev (probably a bug)`);
          return;
        } else {
          terminal.print("Warning: The destination file was overwritten");
        }
      }

      script.filename = destPath;
    } else if (srcFile instanceof TextFile) {
      const textFile = srcFile as TextFile;
      if (!dest.endsWith(".txt")) {
        terminal.error(`Source and destination files must have the same type`);
        return;
      }

      if (destFile != null) {
        // Already exists, will be overwritten, so we'll delete it
        const status = server.removeFile(destPath);
        if (!status.res) {
          terminal.error(`Something went wrong...please contact game dev (probably a bug)`);
          return;
        } else {
          terminal.print("Warning: The destination file was overwritten");
        }
      }

      textFile.fn = destPath;
    }
  } catch (e) {
    terminal.error(e + "");
  }
}
