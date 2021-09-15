import { ITerminal } from "../ITerminal";
import { IEngine } from "../../IEngine";
import { IPlayer } from "../../PersonObjects/IPlayer";

export function lscpu(terminal: ITerminal, engine: IEngine, player: IPlayer): void {
  terminal.print(player.getCurrentServer().cpuCores + " Core(s)");
}
