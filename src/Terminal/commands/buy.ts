import { Terminal } from "../../Terminal";
import { Player } from "@player";
import { listAllDarkwebItems, buyAllDarkwebItems, buyDarkwebItem } from "../../DarkWeb/DarkWeb";

export function buy(args: (string | number | boolean)[]): void {
  if (!Player.hasTorRouter()) {
    Terminal.error(
      "You need to be able to connect to the Dark Web to use the buy command. (Maybe there's a TOR router you can buy somewhere)",
    );
    return;
  }
  if (args.length != 1) {
    Terminal.print("Incorrect number of arguments. Usage: ");
    Terminal.print("buy -l");
    Terminal.print("buy -a");
    Terminal.print("buy [item name]");
    return;
  }
  const arg = args[0] + "";
  if (arg == "-l" || arg == "-1" || arg == "--list") listAllDarkwebItems();
  else if (arg == "-a" || arg == "--all") buyAllDarkwebItems();
  else buyDarkwebItem(arg);
}
