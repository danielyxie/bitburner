import { ITerminal } from "../ITerminal";
import { IRouter } from "../../ui/Router";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";
import { isScriptFilename } from "../../Script/isScriptFilename";

export function wget(
  terminal: ITerminal,
  router: IRouter,
  player: IPlayer,
  server: BaseServer,
  args: (string | number)[],
): void {
  if (args.length !== 2) {
    terminal.error("Incorrect usage of wget command. Usage: wget [url] [target file]");
    return;
  }

  const url = args[0] + "";
  const target = terminal.getFilepath(args[1] + "");
  if (!isScriptFilename(target) && !target.endsWith(".txt")) {
    return terminal.print(`wget failed: Invalid target file. Target file must be script or text file`);
  }
  $.get(
    url,
    function (data: any) {
      let res;
      if (isScriptFilename(target)) {
        res = server.writeToScriptFile(target, data);
      } else {
        res = server.writeToTextFile(target, data);
      }
      if (!res.success) {
        return terminal.print("wget failed");
      }
      if (res.overwritten) {
        return terminal.print(`wget successfully retrieved content and overwrote ${target}`);
      }
      return terminal.print(`wget successfully retrieved content to new file ${target}`);
    },
    "text",
  ).fail(function (e) {
    return terminal.error("wget failed: " + JSON.stringify(e));
  });
}
