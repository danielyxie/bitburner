import { WorkerScript } from "../Netscript/WorkerScript";
import { IPlayer } from "../PersonObjects/IPlayer";
import { Exploit } from "../Exploits/Exploit";
import * as bcrypt from "bcryptjs";
import { INetscriptHelper } from "./INetscriptHelper";
import { Apr1Events as devMenu } from "../ui/Apr1";

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

export function NetscriptExtra(player: IPlayer, workerScript: WorkerScript, helper: INetscriptHelper): INetscriptExtra {
  return {
    heart: {
      // Easter egg function
      break: function (): number {
        return player.karma;
      },
    },
    openDevMenu: function (): void {
      devMenu.emit();
    },
    exploit: function (): void {
      player.giveExploit(Exploit.UndocumentedFunctionCall);
    },
    bypass: function (doc: unknown): void {
      // reset both fields first
      const d = doc as any;
      d.completely_unused_field = undefined;
      const real_document: any = document;
      real_document.completely_unused_field = undefined;
      // set one to true and check that it affected the other.
      real_document.completely_unused_field = true;
      if (d.completely_unused_field && workerScript.ramUsage === 1.6) {
        player.giveExploit(Exploit.Bypass);
      }
      d.completely_unused_field = undefined;
      real_document.completely_unused_field = undefined;
    },
    alterReality: function (): void {
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
        player.giveExploit(Exploit.RealityAlteration);
      }
    },
    rainbow: function (guess: unknown): boolean {
      function tryGuess(): boolean {
        // eslint-disable-next-line no-sync
        const verified = bcrypt.compareSync(
          helper.string("rainbow", "guess", guess),
          "$2a$10$aertxDEkgor8baVtQDZsLuMwwGYmkRM/ohcA6FjmmzIHQeTCsrCcO",
        );
        if (verified) {
          player.giveExploit(Exploit.INeedARainbow);
          return true;
        }
        return false;
      }
      return tryGuess();
    },
  };
}
