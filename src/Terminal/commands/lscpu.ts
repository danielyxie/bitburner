import { Terminal } from "../../Terminal";
import { BaseServer } from "../../Server/BaseServer";

export function lscpu(_args: (string | number | boolean)[], server: BaseServer): void {
  Terminal.print(server.cpuCores + " Core(s)");
}
