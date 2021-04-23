/**
 * This is an object that is used to keep track of where all of the player's
 * money is coming from (or going to)
 */
import { Generic_fromJSON, Generic_toJSON, Reviver } from "../../utils/JSONReviver";

export class MoneySourceTracker {
    [key: string]: number | Function;
    
    bladeburner = 0;
    casino = 0;
    class = 0;
    codingcontract = 0;
    corporation = 0;
    crime = 0;
    gang = 0;
    hacking = 0;
    hacknetnode = 0;
    hospitalization = 0;
    infiltration = 0;
    stock = 0;
    total = 0;
    work = 0;

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

    // Initiatizes a MoneySourceTracker object from a JSON save state.
    static fromJSON(value: any): MoneySourceTracker {
        return Generic_fromJSON(MoneySourceTracker, value.data);
    }
}

Reviver.constructors.MoneySourceTracker = MoneySourceTracker;
