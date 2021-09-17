import { ITerminal } from "../ITerminal";
import { IRouter } from "../../ui/Router";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";
import { Programs } from "../../Programs/Programs";

export function scananalyze(
  terminal: ITerminal,
  router: IRouter,
  player: IPlayer,
  server: BaseServer,
  args: (string | number)[],
): void {
  if (args.length === 0) {
    terminal.executeScanAnalyzeCommand(player, 1);
  } else {
    // # of args must be 2 or 3
    if (args.length > 2) {
      terminal.error("Incorrect usage of scan-analyze command. usage: scan-analyze [depth]");
      return;
    }
    let all = false;
    if (args.length === 2 && args[1] === "-a") {
      all = true;
    }

    const depth = parseInt(args[0] + "");

    if (isNaN(depth) || depth < 0) {
      terminal.error("Incorrect usage of scan-analyze command. depth argument must be positive numeric");
      return;
    }
    if (depth > 3 && !player.hasProgram(Programs.DeepscanV1.name) && !player.hasProgram(Programs.DeepscanV2.name)) {
      terminal.error("You cannot scan-analyze with that high of a depth. Maximum depth is 3");
      return;
    } else if (depth > 5 && !player.hasProgram(Programs.DeepscanV2.name)) {
      terminal.error("You cannot scan-analyze with that high of a depth. Maximum depth is 5");
      return;
    } else if (depth > 10) {
      terminal.error("You cannot scan-analyze with that high of a depth. Maximum depth is 10");
      return;
    }
    terminal.executeScanAnalyzeCommand(player, depth, all);
  }
}
