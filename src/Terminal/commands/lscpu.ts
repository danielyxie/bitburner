import { ITerminal } from "../ITerminal";
import { IRouter } from "../../ui/Router";
import { IPlayer } from "../../PersonObjects/IPlayer";

export function lscpu(terminal: ITerminal, router: IRouter, player: IPlayer): void {
  terminal.print(player.getCurrentServer().cpuCores + " Core(s)");
}
