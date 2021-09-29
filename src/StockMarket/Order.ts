/**
 * Represents a Limit or Buy Order on the stock market. Does not represent
 * a Market Order since those are just executed immediately
 */
import { OrderTypes } from "./data/OrderTypes";
import { PositionTypes } from "./data/PositionTypes";

import { Generic_fromJSON, Generic_toJSON, Reviver } from "../utils/JSONReviver";

export class Order {
  readonly pos: PositionTypes;
  readonly price: number;
  shares: number;
  readonly stockSymbol: string;
  readonly type: OrderTypes;

  constructor(
    stockSymbol = "",
    shares = 0,
    price = 0,
    typ: OrderTypes = OrderTypes.LimitBuy,
    pos: PositionTypes = PositionTypes.Long,
  ) {
    // Validate arguments
    let invalidArgs = false;
    if (typeof shares !== "number" || typeof price !== "number") {
      invalidArgs = true;
    }
    if (isNaN(shares) || isNaN(price)) {
      invalidArgs = true;
    }
    if (typeof stockSymbol !== "string") {
      invalidArgs = true;
    }
    if (invalidArgs) {
      throw new Error(`Invalid constructor paramters for Order`);
    }

    this.stockSymbol = stockSymbol;
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

  /**
   * Initializes a Order from a JSON save state
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static fromJSON(value: any): Order {
    return Generic_fromJSON(Order, value.data);
  }
}

Reviver.constructors.Order = Order;
