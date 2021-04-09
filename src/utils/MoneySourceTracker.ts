/**
 * This is an object that is used to keep track of where all of the player's
 * money is coming from (or going to)
 */
import { Generic_fromJSON, Generic_toJSON, Reviver } from "../../utils/JSONReviver";

export class MoneySourceTracker {
    // Initiatizes a MoneySourceTracker object from a JSON save state.
    static fromJSON(value: any): MoneySourceTracker {
        return Generic_fromJSON(MoneySourceTracker, value.data);
    }

    bladeburner: number = 0;
    codingcontract: number = 0;
    corporation: number = 0;
    crime: number = 0;
    gang: number = 0;
    hacking: number = 0;
    hacknetnode: number = 0;
    hospitalization: number = 0;
    infiltration: number = 0;
    stock: number = 0;
    total: number = 0;
    work: number = 0;
    casino: number = 0;

    [key: string]: number | Function;

    constructor() {}

    // Record money earned
    record(amt: number, source: string): void {
        const sanitizedSource = source.toLowerCase();
        if (typeof this[sanitizedSource] !== "number") {
            console.warn(`MoneySourceTracker.record() called with invalid source: ${source}`);
            return;
        }

        (<number> this[sanitizedSource]) += amt;
        this.total += amt;
    }

    // Reset the money tracker by setting all stats to 0
    reset(): void {
        for (const prop in this) {
            if (typeof this[prop] === "number") {
                this[prop] = 0;
            }
        }
    }

    // Serialize the current object to a JSON save state.
    toJSON(): any {
        return Generic_toJSON("MoneySourceTracker", this);
    }
}

Reviver.constructors.MoneySourceTracker = MoneySourceTracker;
