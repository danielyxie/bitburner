import { ITerminal } from "../ITerminal";
import { IEngine } from "../../IEngine";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";
import { getServerOnNetwork } from "../../Server/ServerHelpers";

export function scan(
  terminal: ITerminal,
  engine: IEngine,
  player: IPlayer,
  server: BaseServer,
  args: (string | number)[],
): void {
  if (args.length !== 0) {
    terminal.error("Incorrect usage of netstat/scan command. Usage: netstat/scan");
    return;
  }

  // Displays available network connections using TCP
  const currServ = player.getCurrentServer();
  const servers = currServ.serversOnNetwork.map((_, i) => {
    const server = getServerOnNetwork(currServ, i);
    if (server === null) throw new Error("Server should not be null");
    return {
      hostname: server.hostname,
      ip: server.ip,
      hasRoot: server.hasAdminRights ? "Y" : "N",
    };
  });
  servers.unshift({
    hostname: "Hostname",
    ip: "IP",
    hasRoot: "Root Access",
  });
  const maxHostname = Math.max(...servers.map((s) => s.hostname.length));
  const maxIP = Math.max(...servers.map((s) => s.ip.length));
  for (const server of servers) {
    if (!server) continue;
    let entry = server.hostname;
    entry += " ".repeat(maxHostname - server.hostname.length + 1);
    entry += server.ip;
    entry += " ".repeat(maxIP - server.ip.length + 1);
    entry += server.hasRoot;
    terminal.print(entry);
  }
}
