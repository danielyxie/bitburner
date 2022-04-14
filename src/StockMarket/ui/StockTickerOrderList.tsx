/**
 * React component for displaying a stock's order list in the Stock Market UI.
 * This component resides in the stock ticker
 */
import * as React from "react";

import type { IPlayer } from "../../PersonObjects/IPlayer";
import type { Order } from "../Order";
import type { Stock } from "../Stock";

import { StockTickerOrder } from "./StockTickerOrder";

type IProps = {
  cancelOrder: (params: any) => void;
  orders: Order[];
  p: IPlayer;
  stock: Stock;
};

export function StockTickerOrderList(props: IProps): React.ReactElement {
  const orders: React.ReactElement[] = [];
  for (let i = 0; i < props.orders.length; ++i) {
    const o = props.orders[i];
    orders.push(<StockTickerOrder cancelOrder={props.cancelOrder} order={o} key={i} />);
  }

  return <>{orders}</>;
}
