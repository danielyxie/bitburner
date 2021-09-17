import { ITerminal } from "../ITerminal";
import { IRouter } from "../../ui/Router";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";
import { isScriptFilename } from "../../Script/ScriptHelpersTS";
import { runScript } from "./runScript";
import { runProgram } from "./runProgram";

export function run(
  terminal: ITerminal,
  router: IRouter,
  player: IPlayer,
  server: BaseServer,
  args: (string | number)[],
): void {
  // Run a program or a script
  if (args.length < 1) {
    terminal.error("Incorrect number of arguments. Usage: run [program/script] [-t] [num threads] [arg1] [arg2]...");
  } else {
    const executableName = args[0] + "";

    // Secret Music player!
    // if (executableName === "musicplayer") {
    //   post(
    //     '<iframe src="https://open.spotify.com/embed/user/danielyxie/playlist/1ORnnL6YNvXOracUaUV2kh" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>',
    //     false,
    //   );
    //   return;
    // }

    // Check if its a script or just a program/executable
    if (isScriptFilename(executableName)) {
      runScript(terminal, router, player, server, args);
    } else if (executableName.endsWith(".cct")) {
      terminal.runContract(player, executableName);
    } else {
      runProgram(terminal, router, player, server, args);
    }
  }
}
