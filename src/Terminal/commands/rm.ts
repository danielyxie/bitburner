import { ITerminal } from "../ITerminal";
import { IEngine } from "../../IEngine";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";
import { IReturnStatus } from "../../types";

export function rm(
  terminal: ITerminal,
  engine: IEngine,
  player: IPlayer,
  server: BaseServer,
  args: (string | number)[],
): void {
  if (args.length !== 1) {
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
