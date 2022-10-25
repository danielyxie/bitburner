import { Terminal } from "../../Terminal";
import { BaseServer } from "../../Server/BaseServer";
import { getServerOnNetwork } from "../../Server/ServerHelpers";
import { GetServer } from "../../Server/AllServers";

export function connect(args: (string | number | boolean)[], server: BaseServer): void {
  // Disconnect from current server in Terminal and connect to new one
  if (args.length !== 1) {
    Terminal.error("Incorrect usage of connect command. Usage: connect [hostname]");
    return;
  }

  const hostname = args[0] + "";

  for (let i = 0; i < server.serversOnNetwork.length; i++) {
    const other = getServerOnNetwork(server, i);
    if (other === null) throw new Error(`Server on network should not be null`);
    if (other.hostname == hostname) {
      Terminal.connectToServer(hostname);
      return;
    }
  }

  const other = GetServer(hostname);
  if (other !== null) {
    if (other.backdoorInstalled || other.purchasedByPlayer) {
      Terminal.connectToServer(hostname);
      return;
    }
    Terminal.error(
      `Cannot directly connect to ${hostname}. Make sure the server is backdoored or adjacent to your current Server`,
    );
  } else {
    Terminal.error("Host not found");
  }
}
