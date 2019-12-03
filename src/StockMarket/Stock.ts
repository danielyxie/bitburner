import { getRandomInt } from "../../utils/helpers/getRandomInt";
import {
    Generic_fromJSON,
    Generic_toJSON,
    Reviver,
} from "../../utils/JSONReviver";
import { IMinMaxRange } from "../types";

export const StockForecastInfluenceLimit = 5;

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
};

// Helper function that convert a IMinMaxRange to a number
function toNumber(n: number | IMinMaxRange): number {
    let value: number;
    switch (typeof n) {
        case "number": {
            return n as number;
        }
        case "object": {
            const range = n as IMinMaxRange;
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
     * Forecast of outlook magnitude. Essentially a second-order forecast.
     * Unlike 'otlkMag', this number is on an absolute scale from 0-100 (rather than 0-50)
     */
    otlkMagForecast: number;

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
     * How many shares need to be transacted in order to trigger a price movement
     */
    readonly shareTxForMovement: number;

    /**
     * How many share transactions remaining until a price movement occurs
     * (separately tracked for upward and downward movements)
     */
    shareTxUntilMovement: number;

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
        this.otlkMagForecast            = this.getAbsoluteForecast();
        this.cap                        = getRandomInt(this.price * 1e3, this.price * 25e3);
        this.spreadPerc                 = toNumber(p.spreadPerc);
        this.shareTxForMovement         = toNumber(p.shareTxForMovement);
        this.shareTxUntilMovement       = this.shareTxForMovement;

        // Total shares is determined by market cap, and is rounded to nearest 100k
        const totalSharesUnrounded: number = (p.marketCap / this.price);
        this.totalShares = Math.round(totalSharesUnrounded / 1e5) * 1e5;

        // Max Shares (Outstanding shares) is a percentage of total shares
        const outstandingSharePercentage: number = 0.2;
        this.maxShares = Math.round((this.totalShares * outstandingSharePercentage) / 1e5) * 1e5;
    }

    /**
     * Safely set the stock's second-order forecast to a new value
     */
    changeForecastForecast(newff: number): void {
        this.otlkMagForecast = newff;
        if (this.otlkMagForecast > 100) {
            this.otlkMagForecast = 100;
        } else if (this.otlkMagForecast < 0) {
            this.otlkMagForecast = 0;
        }
    }

    /**
     * Set the stock to a new price. Also updates the stock's previous price tracker
     */
    changePrice(newPrice: number): void {
        this.lastPrice = this.price;
        this.price = newPrice;
    }

    /**
     * Change the stock's forecast during a stock market 'tick'.
     * The way a stock's forecast changes depends on various internal properties,
     * but is ultimately determined by RNG
     */
    cycleForecast(changeAmt: number= 0.1): void {
        const increaseChance = this.getForecastIncreaseChance();

        if (Math.random() < increaseChance) {
            // Forecast increases
            if (this.b) {
                this.otlkMag += changeAmt;
            } else {
                this.otlkMag -= changeAmt;
            }
        } else {
            // Forecast decreases
            if (this.b) {
                this.otlkMag -= changeAmt;
            } else {
                this.otlkMag += changeAmt;
            }
        }

        this.otlkMag = Math.min(this.otlkMag, 50);
        if (this.otlkMag < 0) {
            this.otlkMag *= -1;
            this.b = !this.b;
        }
    }

    /**
     * Change's the stock's second-order forecast during a stock market 'tick'.
     * The change for the second-order forecast to increase is 50/50
     */
    cycleForecastForecast(changeAmt: number= 0.1): void {
        if (Math.random() < 0.5) {
            this.changeForecastForecast(this.otlkMagForecast + changeAmt);
        } else {
            this.changeForecastForecast(this.otlkMagForecast - changeAmt);
        }
    }

    /**
     * "Flip" the stock's second-order forecast. This can occur during a
     * stock market "cycle" (determined by RNG). It is used to simulate
     * RL stock market cycles and introduce volatility
     */
    flipForecastForecast(): void {
        const diff = this.otlkMagForecast - 50;
        this.otlkMagForecast = 50 + (-1 * diff);
    }

    /**
     * Returns the stock's absolute forecast, which is a number between 0-100
     */
    getAbsoluteForecast(): number {
        return this.b ? 50 + this.otlkMag : 50 - this.otlkMag;
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
     * Returns the chance (0-1 decimal) that a stock has of having its forecast increase
     */
    getForecastIncreaseChance(): number {
        const diff = this.otlkMagForecast - this.getAbsoluteForecast();

        return (50 + Math.min(Math.max(diff, -45), 45)) / 100;
    }

    /**
     * Changes a stock's forecast. This is used when the stock is influenced
     * by a transaction. The stock's forecast always goes towards 50, but the
     * movement is capped by a certain threshold/limit
     */
    influenceForecast(change: number): void {
        if (this.otlkMag > StockForecastInfluenceLimit) {
            this.otlkMag = Math.max(StockForecastInfluenceLimit, this.otlkMag - change);
        }
    }

    /**
     * Changes a stock's second-order forecast. This is used when the stock is
     * influenced by a transaction. The stock's second-order forecast always
     * goes towards 50.
     */
    influenceForecastForecast(change: number): void {
        if (this.otlkMagForecast > 50) {
            this.otlkMagForecast -= change;
            this.otlkMagForecast = Math.max(50, this.otlkMagForecast);
        } else if (this.otlkMagForecast < 50) {
            this.otlkMagForecast += change;
            this.otlkMagForecast = Math.min(50, this.otlkMagForecast);
        }
    }

    /**
     * Serialize the Stock to a JSON save state.
     */
    toJSON(): any {
        return Generic_toJSON("Stock", this);
    }
}

Reviver.constructors.Stock = Stock;
