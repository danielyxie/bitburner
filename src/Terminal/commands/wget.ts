import type { IPlayer } from "../../PersonObjects/IPlayer";
import { isScriptFilename } from "../../Script/isScriptFilename";
import type { BaseServer } from "../../Server/BaseServer";
import type { IRouter } from "../../ui/Router";
import type { ITerminal } from "../ITerminal";

export function wget(
  terminal: ITerminal,
  router: IRouter,
  player: IPlayer,
  server: BaseServer,
  args: (string | number | boolean)[],
): void {
  if (args.length !== 2) {
    terminal.error("Incorrect usage of wget command. Usage: wget [url] [target file]");
    return;
  }

  const url = args[0] + "";
  const target = terminal.getFilepath(args[1] + "");
  if (!isScriptFilename(target) && !target.endsWith(".txt")) {
    return terminal.error(`wget failed: Invalid target file. Target file must be script or text file`);
  }
  $.get(
    url,
    function (data: any) {
      let res;
      if (isScriptFilename(target)) {
        res = server.writeToScriptFile(player, target, data);
      } else {
        res = server.writeToTextFile(target, data);
      }
      if (!res.success) {
        return terminal.error("wget failed");
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
