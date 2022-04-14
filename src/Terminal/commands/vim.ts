import { ITerminal } from "../ITerminal";
import { IRouter } from "../../ui/Router";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";

import { commonEditor } from "./common/editor";

export function nvim(
  terminal: ITerminal,
  router: IRouter,
  player: IPlayer,
  server: BaseServer,
  args: (string | number | boolean)[],
): void {
  return commonEditor("nvim", { terminal, router, player, server, args }, { vim: true });
}

export function vi(
  terminal: ITerminal,
  router: IRouter,
  player: IPlayer,
  server: BaseServer,
  args: (string | number | boolean)[],
): void {
  return commonEditor("vi", { terminal, router, player, server, args }, { vim: true });
}

export function vim(
  terminal: ITerminal,
  router: IRouter,
  player: IPlayer,
  server: BaseServer,
  args: (string | number | boolean)[],
): void {
  return commonEditor("vim", { terminal, router, player, server, args }, { vim: true });
}
