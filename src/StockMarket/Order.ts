/**
 * Represents a Limit or Buy Order on the stock market. Does not represent
 * a Market Order since those are just executed immediately
 */
import { Stock } from "./Stock";
import { OrderTypes } from "./data/OrderTypes";
import { PositionTypes } from "./data/PositionTypes";

import {
    Generic_fromJSON,
    Generic_toJSON,
    Reviver
} from "../../utils/JSONReviver";

export class Order {
    /**
     * Initializes a Order from a JSON save state
     */
    static fromJSON(value: any): Order {
        return Generic_fromJSON(Order, value.data);
    }

    readonly pos: PositionTypes;
    readonly price: number;
    shares: number;
    readonly stock: Stock;
    readonly type: OrderTypes;

    constructor(stk: Stock = new Stock(), shares: number=0, price: number=0, typ: OrderTypes=OrderTypes.LimitBuy, pos: PositionTypes=PositionTypes.Long) {
        // Validate arguments
        let invalidArgs: boolean = false;
        if (typeof shares !== "number" || typeof price !== "number") {
            invalidArgs = true;
        }
        if (isNaN(shares) || isNaN(price)) {
            invalidArgs = true;
        }
        if (!(stk instanceof Stock)) {
            invalidArgs = true;
        }
        if (invalidArgs) {
            throw new Error(`Invalid constructor paramters for Order`);
        }

        this.stock = stk;
        this.shares = shares;
        this.price = price;
        this.type = typ;
        this.pos = pos;
    }

    /**
     * Serialize the Order to a JSON save state.
     */
    toJSON(): any {
        return Generic_toJSON("Order", this);
    }
}

Reviver.constructors.Order = Order;
