import { Terminal } from "../../Terminal";
import { Player } from "@player";
import { Programs } from "../../Programs/Programs";

export function scananalyze(args: (string | number | boolean)[]): void {
  if (args.length === 0) {
    Terminal.executeScanAnalyzeCommand();
  } else {
    // # of args must be 2 or 3
    if (args.length > 2) {
      Terminal.error("Incorrect usage of scan-analyze command. usage: scan-analyze [depth]");
      return;
    }
    let all = false;
    if (args.length === 2 && args[1] === "-a") {
      all = true;
    }

    const depth = parseInt(args[0] + "");

    if (isNaN(depth) || depth < 0) {
      Terminal.error("Incorrect usage of scan-analyze command. depth argument must be positive numeric");
      return;
    }
    if (depth > 3 && !Player.hasProgram(Programs.DeepscanV1.name) && !Player.hasProgram(Programs.DeepscanV2.name)) {
      Terminal.error("You cannot scan-analyze with that high of a depth. Maximum depth is 3");
      return;
    } else if (depth > 5 && !Player.hasProgram(Programs.DeepscanV2.name)) {
      Terminal.error("You cannot scan-analyze with that high of a depth. Maximum depth is 5");
      return;
    } else if (depth > 10) {
      Terminal.error("You cannot scan-analyze with that high of a depth. Maximum depth is 10");
      return;
    }
    Terminal.executeScanAnalyzeCommand(depth, all);
  }
}
