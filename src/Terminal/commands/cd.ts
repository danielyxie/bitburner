import { ITerminal } from "../ITerminal";
import { IRouter } from "../../ui/Router";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";

import { evaluateDirectoryPath, removeTrailingSlash } from "../DirectoryHelpers";

export function cd(
  terminal: ITerminal,
  router: IRouter,
  player: IPlayer,
  server: BaseServer,
  args: (string | number)[],
): void {
  if (args.length > 1) {
    terminal.error("Incorrect number of arguments. Usage: cd [dir]");
  } else {
    let dir = args.length === 1 ? args[0] + "" : "/";

    let evaledDir: string | null = "";
    if (dir === "/") {
      evaledDir = "/";
    } else {
      // Ignore trailing slashes
      dir = removeTrailingSlash(dir);

      evaledDir = evaluateDirectoryPath(dir, terminal.cwd());
      if (evaledDir === null || evaledDir === "") {
        terminal.error("Invalid path. Failed to change directories");
        return;
      }

      const server = player.getCurrentServer();
      if (
        !server.scripts.some((script) => script.filename.startsWith(evaledDir + "")) &&
        !server.textFiles.some((file) => file.fn.startsWith(evaledDir + ""))
      ) {
        terminal.error("Invalid path. Failed to change directories");
        return;
      }
    }

    terminal.setcwd(evaledDir);
  }
}
