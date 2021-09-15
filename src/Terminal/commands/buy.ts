import { ITerminal } from "../ITerminal";
import { IEngine } from "../../IEngine";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";
import { listAllDarkwebItems, buyDarkwebItem } from "../../DarkWeb/DarkWeb";
import { SpecialServerIps } from "../../Server/SpecialServerIps";

export function buy(
  terminal: ITerminal,
  engine: IEngine,
  player: IPlayer,
  server: BaseServer,
  args: (string | number)[],
): void {
  if (!SpecialServerIps.hasOwnProperty("Darkweb Server")) {
    terminal.error(
      "You need to be able to connect to the Dark Web to use the buy command. (Maybe there's a TOR router you can buy somewhere)",
    );
    return;
  }
  if (args.length != 1) {
    terminal.print("Incorrect number of arguments. Usage: ");
    terminal.print("buy -l");
    terminal.print("buy [item name]");
    return;
  }
  const arg = args[0] + "";
  if (arg == "-l" || arg == "-1" || arg == "--list") {
    listAllDarkwebItems();
  } else {
    buyDarkwebItem(arg);
  }
}
