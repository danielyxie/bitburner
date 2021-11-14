/**
 * This is an object that is used to keep track of where all of the player's
 * money is coming from (or going to)
 */
import { Generic_fromJSON, Generic_toJSON, Reviver } from "./JSONReviver";

export class MoneySourceTracker {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [key: string]: number | Function;

  bladeburner = 0;
  casino = 0;
  class = 0;
  codingcontract = 0;
  corporation = 0;
  crime = 0;
  gang = 0;
  hacking = 0;
  hacknet = 0;
  hacknet_expenses = 0;
  hospitalization = 0;
  infiltration = 0;
  sleeves = 0;
  stock = 0;
  total = 0;
  work = 0;
  servers = 0;
  other = 0;
  augmentations = 0;

  // Record money earned
  record(amt: number, source: string): void {
    const sanitizedSource = source.toLowerCase();
    if (typeof this[sanitizedSource] !== "number") {
      console.warn(`MoneySourceTracker.record() called with invalid source: ${source}`);
      return;
    }

    (this[sanitizedSource] as number) += amt;
    this.total += amt;
  }

  // Reset the money tracker by setting all stats to 0
  reset(): void {
    for (const prop in this) {
      if (typeof this[prop] === "number") {
        (this[prop] as number) = 0;
      }
    }
  }

  // Serialize the current object to a JSON save state.
  toJSON(): any {
    return Generic_toJSON("MoneySourceTracker", this);
  }

  // Initiatizes a MoneySourceTracker object from a JSON save state.
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static fromJSON(value: any): MoneySourceTracker {
    return Generic_fromJSON(MoneySourceTracker, value.data);
  }
}

Reviver.constructors.MoneySourceTracker = MoneySourceTracker;
