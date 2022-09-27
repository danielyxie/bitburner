import { Terminal } from "../../Terminal";
import { BaseServer } from "../../Server/BaseServer";
import { IReturnStatus } from "../../types";

export function rm(args: (string | number | boolean)[], server: BaseServer): void {
  if (args.length !== 1) {
    Terminal.error("Incorrect number of arguments. Usage: rm [program/script]");
    return;
  }

  // Check programs
  let delTarget;
  let status: IReturnStatus = {
    res: true,
    msg: "",
  };
  try {
    delTarget = Terminal.getFilepath(args[0] + "");
    status = server.removeFile(delTarget);
  } catch (err) {
    status = {
      res: false,
      msg: "No such file exists",
    };
  }

  if (!status.res && status.msg) {
    Terminal.error(status.msg);
  }
}
