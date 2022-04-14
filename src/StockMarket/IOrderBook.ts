import type { Order } from "./Order";

export interface IOrderBook {
  [key: string]: Order[];
}
