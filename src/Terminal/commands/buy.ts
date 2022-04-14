import { buyAllDarkwebItems, buyDarkwebItem, listAllDarkwebItems } from "../../DarkWeb/DarkWeb";
import type { IPlayer } from "../../PersonObjects/IPlayer";
import { GetServer } from "../../Server/AllServers";
import type { BaseServer } from "../../Server/BaseServer";
import { SpecialServers } from "../../Server/data/SpecialServers";
import type { IRouter } from "../../ui/Router";
import type { ITerminal } from "../ITerminal";

export function buy(
  terminal: ITerminal,
  router: IRouter,
  player: IPlayer,
  server: BaseServer,
  args: (string | number | boolean)[],
): void {
  if (!GetServer(SpecialServers.DarkWeb)) {
    terminal.error(
      "You need to be able to connect to the Dark Web to use the buy command. (Maybe there's a TOR router you can buy somewhere)",
    );
    return;
  }
  if (args.length != 1) {
    terminal.print("Incorrect number of arguments. Usage: ");
    terminal.print("buy -l");
    terminal.print("buy -a");
    terminal.print("buy [item name]");
    return;
  }
  const arg = args[0] + "";
  if (arg == "-l" || arg == "-1" || arg == "--list") {
    listAllDarkwebItems();
  } else if (arg == "-a" || arg == "--all") {
    buyAllDarkwebItems();
  } else {
    buyDarkwebItem(arg);
  }
}
