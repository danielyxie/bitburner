import { IOrderBook } from "./IOrderBook";
import { Stock } from "./Stock";

export type IStockMarket = {
  [key: string]: Stock;
} & {
  lastUpdate: number;
  Orders: IOrderBook;
  storedCycles: number;
  ticksUntilCycle: number;
};
