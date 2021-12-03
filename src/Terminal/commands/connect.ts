import { ITerminal } from "../ITerminal";
import { IRouter } from "../../ui/Router";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";
import { getServerOnNetwork } from "../../Server/ServerHelpers";

export function connect(
  terminal: ITerminal,
  router: IRouter,
  player: IPlayer,
  server: BaseServer,
  args: (string | number | boolean)[],
): void {
  // Disconnect from current server in terminal and connect to new one
  if (args.length !== 1) {
    terminal.error("Incorrect usage of connect command. Usage: connect [ip/hostname]");
    return;
  }

  const hostname = args[0] + "";

  for (let i = 0; i < server.serversOnNetwork.length; i++) {
    const other = getServerOnNetwork(server, i);
    if (other === null) throw new Error(`Server on network should not be null`);
    if (other.hostname == hostname) {
      terminal.connectToServer(player, hostname);
      return;
    }
  }

  terminal.error("Host not found");
}
