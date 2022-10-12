import { Player } from "../Player";
import { Exploit } from "../Exploits/Exploit";
import * as bcrypt from "bcryptjs";
import { Apr1Events as devMenu } from "../ui/Apr1";
import { InternalAPI, NetscriptContext } from "../Netscript/APIWrapper";
import { helpers } from "../Netscript/NetscriptHelpers";

export interface INetscriptExtra {
  heart: {
    break(): number;
  };
  openDevMenu(): void;
  exploit(): void;
  bypass(doc: Document): void;
  alterReality(): void;
  rainbow(guess: string): void;
}

export function NetscriptExtra(): InternalAPI<INetscriptExtra> {
  return {
    heart: {
      // Easter egg function
      break: () => () => {
        return Player.karma;
      },
    },
    openDevMenu: () => () => {
      devMenu.emit();
    },
    exploit: () => () => {
      Player.giveExploit(Exploit.UndocumentedFunctionCall);
    },
    bypass: (ctx: NetscriptContext) => (doc: unknown) => {
      // reset both fields first
      type temporary = { completely_unused_field: unknown };
      const d = doc as temporary;
      d.completely_unused_field = undefined;
      const real_document = document as unknown as temporary;
      real_document.completely_unused_field = undefined;
      // set one to true and check that it affected the other.
      real_document.completely_unused_field = true;
      if (d.completely_unused_field && ctx.workerScript.ramUsage === 1.6) {
        Player.giveExploit(Exploit.Bypass);
      }
      d.completely_unused_field = undefined;
      real_document.completely_unused_field = undefined;
    },
    alterReality: () => (): void => {
      // We need to trick webpack into not optimizing a variable that is guaranteed to be false (and doesn't use prototypes)
      let x = false;
      const recur = function (depth: number): void {
        if (depth === 0) return;
        x = !x;
        recur(depth - 1);
      };
      recur(2);
      console.warn("I am sure that this variable is false.");
      if (x !== false) {
        console.warn("Reality has been altered!");
        Player.giveExploit(Exploit.RealityAlteration);
      }
    },
    rainbow: (ctx: NetscriptContext) => (guess: unknown) => {
      function tryGuess(): boolean {
        // eslint-disable-next-line no-sync
        const verified = bcrypt.compareSync(
          helpers.string(ctx, "guess", guess),
          "$2a$10$aertxDEkgor8baVtQDZsLuMwwGYmkRM/ohcA6FjmmzIHQeTCsrCcO",
        );
        if (verified) {
          Player.giveExploit(Exploit.INeedARainbow);
          return true;
        }
        return false;
      }
      return tryGuess();
    },
  };
}
