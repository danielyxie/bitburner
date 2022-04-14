import type { IPlayer } from "../../PersonObjects/IPlayer";
import type { IRouter } from "../../ui/Router";
import type { ITerminal } from "../ITerminal";

export function lscpu(terminal: ITerminal, router: IRouter, player: IPlayer): void {
  terminal.print(player.getCurrentServer().cpuCores + " Core(s)");
}
