import { IMinMaxRange } from "../types";
import {
    Generic_fromJSON,
    Generic_toJSON,
    Reviver
} from "../../utils/JSONReviver";
import { getRandomInt } from "../../utils/helpers/getRandomInt";

export interface IConstructorParams {
    b: boolean;
    initPrice: number | IMinMaxRange;
    marketCap: number;
    mv: number | IMinMaxRange;
    name: string;
    otlkMag: number;
    spreadPerc: number | IMinMaxRange;
    shareTxForMovement: number | IMinMaxRange;
    symbol: string;
}

const defaultConstructorParams: IConstructorParams = {
    b: true,
    initPrice: 10e3,
    marketCap: 1e12,
    mv: 1,
    name: "",
    otlkMag: 0,
    spreadPerc: 0,
    shareTxForMovement: 1e6,
    symbol: "",
}

// Helper function that convert a IMinMaxRange to a number
function toNumber(n: number | IMinMaxRange): number {
    let value: number;
    switch (typeof n) {
        case "number": {
            return <number>n;
        }
        case "object": {
            const range = <IMinMaxRange>n;
            value = getRandomInt(range.min, range.max);
            break;
        }
        default:
            throw Error(`Do not know how to convert the type '${typeof n}' to a number`);
    }

    if (typeof n === "object" && typeof n.divisor === "number") {
        return value / n.divisor;
    }

    return value;
}

/**
 * Represents the valuation of a company in the World Stock Exchange.
 */
export class Stock {
    /**
     * Initializes a Stock from a JSON save state
     */
    static fromJSON(value: any): Stock {
        return Generic_fromJSON(Stock, value.data);
    }

    /**
     * Bear or bull (more likely to go up or down, based on otlkMag)
     */
    b: boolean;

    /**
     * Maximum price of a stock (per share)
     */
    readonly cap: number;

    /**
     * Stocks previous share price
     */
    lastPrice: number;

    /**
     * Maximum number of shares that player can own (both long and short combined)
     */
    readonly maxShares: number;

    /**
     * Maximum volatility
     */
    readonly mv: number;

    /**
     * Name of the company that the stock is for
     */
    readonly name: string;

    /**
     * Outlook magnitude. Represents the stock's forecast and likelihood
     * of increasing/decreasing (based on whether its in bear or bull mode)
     */
    otlkMag: number;

    /**
     * Average price of stocks that the player owns in the LONG position
     */
    playerAvgPx: number;

    /**
     * Average price of stocks that the player owns in the SHORT position
     */
    playerAvgShortPx: number;

    /**
     * Number of shares the player owns in the LONG position
     */
    playerShares: number;

    /**
     * Number of shares the player owns in the SHORT position
     */
    playerShortShares: number;

    /**
     * Stock's share price
     */
    price: number;

    /**
     * Percentage by which the stock's price changes for a transaction-induced
     * price movement.
     */
    readonly priceMovementPerc: number;

    /**
     * How many shares need to be transacted in order to trigger a price movement
     */
    readonly shareTxForMovement: number;

    /**
     * How many share transactions remaining until a price movement occurs
     * (separately tracked for upward and downward movements)
     */
    shareTxUntilMovementDown: number;
    shareTxUntilMovementUp: number;

    /**
     * Spread percentage. The bid/ask prices for this stock are N% above or below
     * the "real price" to emulate spread.
     */
    readonly spreadPerc: number;

    /**
     * The stock's ticker symbol
     */
    readonly symbol: string;

    /**
     * Total number of shares of this stock
     * This is different than maxShares, as this is like authorized stock while
     * maxShares is outstanding stock.
     */
    readonly totalShares: number;

    constructor(p: IConstructorParams = defaultConstructorParams) {
        this.name                       = p.name;
        this.symbol                     = p.symbol;
        this.price                      = toNumber(p.initPrice);
        this.lastPrice                  = this.price;
        this.playerShares               = 0;
        this.playerAvgPx                = 0;
        this.playerShortShares          = 0;
        this.playerAvgShortPx           = 0;
        this.mv                         = toNumber(p.mv);
        this.b                          = p.b;
        this.otlkMag                    = p.otlkMag;
        this.cap                        = getRandomInt(this.price * 1e3, this.price * 25e3);
        this.spreadPerc                 = toNumber(p.spreadPerc);
        this.priceMovementPerc          = this.spreadPerc / (getRandomInt(10, 30) / 10);
        this.shareTxForMovement         = toNumber(p.shareTxForMovement);
        this.shareTxUntilMovementDown   = this.shareTxForMovement;
        this.shareTxUntilMovementUp     = this.shareTxForMovement;

        // Total shares is determined by market cap, and is rounded to nearest 100k
        let totalSharesUnrounded: number = (p.marketCap / this.price);
        this.totalShares = Math.round(totalSharesUnrounded / 1e5) * 1e5;

        // Max Shares (Outstanding shares) is a percentage of total shares
        const outstandingSharePercentage: number = 0.2;
        this.maxShares = Math.round((this.totalShares * outstandingSharePercentage) / 1e5) * 1e5;
    }

    changePrice(newPrice: number): void {
        this.lastPrice = this.price;
        this.price = newPrice;
    }

    /**
     * Return the price at which YOUR stock is bought (market ask price). Accounts for spread
     */
    getAskPrice(): number {
        return this.price * (1 + (this.spreadPerc / 100));
    }

    /**
     * Return the price at which YOUR stock is sold (market bid price). Accounts for spread
     */
    getBidPrice(): number {
        return this.price * (1 - (this.spreadPerc / 100));
    }

    /**
     * Serialize the Stock to a JSON save state.
     */
    toJSON(): any {
        return Generic_toJSON("Stock", this);
    }
}

Reviver.constructors.Stock = Stock;
