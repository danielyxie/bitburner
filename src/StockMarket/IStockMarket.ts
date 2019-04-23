import { IOrderBook } from "./IOrderBook";
import { Stock } from "./Stock";

export type IStockMarket = {
    [key: string]: Stock;
} & {
    lastUpdate: number;
    storedCycles: number;
    Orders: IOrderBook;
}
