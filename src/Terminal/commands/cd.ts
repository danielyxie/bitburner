import { Terminal } from "../../Terminal";
import { BaseServer } from "../../Server/BaseServer";

import { evaluateDirectoryPath, removeTrailingSlash } from "../DirectoryHelpers";
import { containsFiles } from "../DirectoryServerHelpers";

export function cd(args: (string | number | boolean)[], server: BaseServer): void {
  if (args.length > 1) {
    Terminal.error("Incorrect number of arguments. Usage: cd [dir]");
  } else {
    let dir = args.length === 1 ? args[0] + "" : "/";

    let evaledDir: string | null = "";
    if (dir === "/") {
      evaledDir = "/";
    } else {
      // Ignore trailing slashes
      dir = removeTrailingSlash(dir);

      evaledDir = evaluateDirectoryPath(dir, Terminal.cwd());
      if (evaledDir === null || evaledDir === "") {
        Terminal.error("Invalid path. Failed to change directories");
        return;
      }
      if (Terminal.cwd().length > 1 && dir === "..") {
        Terminal.setcwd(evaledDir);
        return;
      }

      if (!containsFiles(server, evaledDir)) {
        Terminal.error("Invalid path. Failed to change directories");
        return;
      }
    }

    Terminal.setcwd(evaledDir);
  }
}
