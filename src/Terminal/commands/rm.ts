import { ITerminal } from "../ITerminal";
import { IRouter } from "../../ui/Router";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";
import { IReturnStatus } from "../../types";

export function rm(
  terminal: ITerminal,
  router: IRouter,
  player: IPlayer,
  server: BaseServer,
  args: (string | number | boolean)[],
): void {
  if (args.length < 1) {
    terminal.error("Incorrect number of arguments. Usage: rm [program/script]");
    return;
  }

  // Check programs
  let delTarget;
  let status: IReturnStatus = {
    res: true,
    msg: "",
  };
  try {
    delTarget = terminal.getFilepath(args[0] + "");
    status = server.removeFile(delTarget);

    // Check if we should remove it from both the text and script arrays
    if(args[1] === '-tas') {
      let fileIndex = server.scripts.findIndex(script => script.filename === (args[0] + ""));
      if(fileIndex !== -1) {
        server.scripts.splice(fileIndex, 1);
      }
    }
  } catch (err) {
    status = {
      res: false,
      msg: "No such file exists",
    };
  }

  if (!status.res && status.msg) {
    terminal.error(status.msg);
  }
}
