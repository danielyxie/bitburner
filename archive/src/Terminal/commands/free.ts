import { ITerminal } from "../ITerminal";
import { IRouter } from "../../ui/Router";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";
import { numeralWrapper } from "../../ui/numeralFormat";

export function free(
  terminal: ITerminal,
  router: IRouter,
  player: IPlayer,
  server: BaseServer,
  args: (string | number | boolean)[],
): void {
  if (args.length !== 0) {
    terminal.error("Incorrect usage of free command. Usage: free");
    return;
  }
  const ram = numeralWrapper.formatRAM(player.getCurrentServer().maxRam);
  const used = numeralWrapper.formatRAM(player.getCurrentServer().ramUsed);
  const avail = numeralWrapper.formatRAM(player.getCurrentServer().maxRam - player.getCurrentServer().ramUsed);
  const maxLength = Math.max(ram.length, Math.max(used.length, avail.length));
  const usedPercent = numeralWrapper.formatPercentage(
    player.getCurrentServer().ramUsed / player.getCurrentServer().maxRam,
  );

  terminal.print(`Total:     ${" ".repeat(maxLength - ram.length)}${ram}`);
  terminal.print(`Used:      ${" ".repeat(maxLength - used.length)}${used} (${usedPercent})`);
  terminal.print(`Available: ${" ".repeat(maxLength - avail.length)}${avail}`);
}
