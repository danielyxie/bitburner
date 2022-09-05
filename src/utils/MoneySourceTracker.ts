/**
 * This is an object that is used to keep track of where all of the player's
 * money is coming from (or going to)
 */
import { Generic_fromJSON, Generic_toJSON, Reviver, IReviverValue } from "./JSONReviver";

export class MoneySourceTracker {
  income: MoneySourceTrackerRecord = new MoneySourceTrackerRecord();
  expenses: MoneySourceTrackerRecord = new MoneySourceTrackerRecord();

  // Record money earned or spent
  record(amt: number, source: string): void {
    const sanitizedSource = source.toLowerCase();
    if (typeof this.income[sanitizedSource] !== "number") {
      console.warn(`MoneySourceTracker.record() called with invalid source: ${source}`);
      return;
    }

    if (amt > 0) {
      this.income[sanitizedSource] += amt;
      this.income.total += amt;
    } else {
      this.expenses[sanitizedSource] -= amt;
      this.expenses.total -= amt;
    }
  }

  trySanitizeSource(source: string): string {
    const sanitizedSource = source.toLowerCase();
    if (typeof this.income[sanitizedSource] !== "number") {
      console.warn(`One of MoneySourceTracker functions called with invalid source: ${source}`);
      return "";
    }
    return sanitizedSource;
  }

  // Returns true if there's any income or expenses from this source
  hasAnythingFrom(source: string): boolean {
    const sanitizedSource = this.trySanitizeSource(source);
    if (sanitizedSource === "") return false;
    return this.income[sanitizedSource] > 0 || this.expenses[sanitizedSource] > 0;
  }

  // Returns income for the source
  getIncome(source: string): number {
    const sanitizedSource = this.trySanitizeSource(source);
    if (sanitizedSource === "") return 0;
    return this.income[sanitizedSource];
  }

  // Returns expenses for the source; it's a positive number
  getExpenses(source: string): number {
    const sanitizedSource = this.trySanitizeSource(source);
    if (sanitizedSource === "") return 0;
    return this.expenses[sanitizedSource];
  }

  // Returns [income - expenses] for the source
  getTotal(source: string): number {
    const sanitizedSource = this.trySanitizeSource(source);
    if (sanitizedSource === "") return 0;
    return this.income[sanitizedSource] - this.expenses[sanitizedSource];
  }

  // Reset the money tracker by setting all stats to 0
  reset(): void {
    this.income = new MoneySourceTrackerRecord();
    this.expenses = new MoneySourceTrackerRecord();
  }

  // Serialize the current object to a JSON save state.
  toJSON(): IReviverValue {
    return Generic_toJSON("MoneySourceTracker", this);
  }

  // Initiatizes a MoneySourceTracker object from a JSON save state.
  static fromJSON(value: IReviverValue): MoneySourceTracker {
    if (value.data.hasOwnProperty("hacking")) {
      // Conversion from pre-split version
      const ret = new MoneySourceTracker();
      for (const name in value.data) {
        if (name == "hacknet_expenses") {
          ret.expenses["hacknet"] = -value.data[name];
        } else if (value.data[name] > 0) {
          ret.income[name] = value.data[name];
        } else if (value.data[name] < 0) {
          ret.expenses[name] = -value.data[name];
        }
      }
      return ret;
    }
    return Generic_fromJSON(MoneySourceTracker, value.data);
  }
}

class MoneySourceTrackerRecord {
  [key: string]: number;
  starting = 0;
  bladeburner = 0;
  casino = 0;
  class = 0;
  codingcontract = 0;
  corporation = 0;
  crime = 0;
  gang = 0;
  hacking = 0;
  hacknet = 0;
  hospitalization = 0;
  infiltration = 0;
  sleeves = 0;
  stock = 0;
  total = 0;
  work = 0;
  servers = 0;
  other = 0;
  augmentations = 0;
}

Reviver.constructors.MoneySourceTracker = MoneySourceTracker;
