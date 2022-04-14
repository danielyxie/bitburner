import type { IOrderBook } from "./IOrderBook";
import type { Stock } from "./Stock";

export type IStockMarket = {
  [key: string]: Stock;
} & {
  lastUpdate: number;
  Orders: IOrderBook;
  storedCycles: number;
  ticksUntilCycle: number;
};
