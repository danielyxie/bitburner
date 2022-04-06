import { ITerminal } from "../ITerminal";
import { IRouter } from "../../ui/Router";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";
import { Apr1Events } from "../../ui/Apr1";

export function apr1(
  terminal: ITerminal,
  router: IRouter,
  player: IPlayer,
  server: BaseServer,
  commandArray: (string | number | boolean)[],
): void {
  Apr1Events.emit();
}
