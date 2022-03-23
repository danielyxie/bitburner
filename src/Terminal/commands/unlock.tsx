import React from "react";
import { ITerminal } from "../ITerminal";
import { IRouter } from "../../ui/Router";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";
import { attemptToUnlockExploitServer } from "../../Server/SecretServer";
import { CorruptableText } from "../../ui/React/CorruptableText";

export function unlock(
  terminal: ITerminal,
  router: IRouter,
  player: IPlayer,
  server: BaseServer,
  args: (string | number | boolean)[],
): void {
  if (args.length !== 1) {
    terminal.error("Incorrect usage of unlock command. Usage: unlock [passphrase]");
    return;
  }

  const passphrase = args[0] + "";

  // We'll try to see if the passphrase works to access the exploit server
  if (attemptToUnlockExploitServer(player, passphrase)) {
    // Great! Let's spam the terminal a bit...
    let n = 0;
    const max = 10;
    terminal.printRaw("=".repeat(20));
    const spam = (): void => {
      n++;
      if (n < 10) {
        terminal.printRaw(
          <span>
            {max - n}
            {" >>> "}
            <CorruptableText content={"0xDEADBEEF "} />
          </span>,
        );
        setTimeout(spam, 200);
      } else {
        terminal.printRaw("=".repeat(20));
        const spamLine = (): React.ReactNode[] =>
          [...Array(4)].map((_, index) => <CorruptableText key={index} content={"|0xDEADBEEF| "} />);
        terminal.printRaw(spamLine());
        terminal.printRaw(spamLine());
        terminal.printRaw(spamLine());
        terminal.printRaw("=".repeat(20));
      }
    };
    spam();
    return;
  }
}
