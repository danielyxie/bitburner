import { ITerminal } from "../ITerminal";
import { IEngine } from "../../IEngine";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";
import { getServerOnNetwork } from "../../Server/ServerHelpers";

export function connect(
  terminal: ITerminal,
  engine: IEngine,
  player: IPlayer,
  server: BaseServer,
  args: (string | number)[],
): void {
  // Disconnect from current server in terminal and connect to new one
  if (args.length !== 1) {
    terminal.error("Incorrect usage of connect command. Usage: connect [ip/hostname]");
    return;
  }

  const ip = args[0] + "";

  for (let i = 0; i < server.serversOnNetwork.length; i++) {
    const other = getServerOnNetwork(server, i);
    if (other === null) throw new Error(`Server on network should not be null`);
    if (other.ip == ip || other.hostname == ip) {
      terminal.connectToServer(player, ip);
      return;
    }
  }

  terminal.error("Host not found");
}
