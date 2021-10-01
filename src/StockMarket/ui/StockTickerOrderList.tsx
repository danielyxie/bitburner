/**
 * React component for displaying a stock's order list in the Stock Market UI.
 * This component resides in the stock ticker
 */
import * as React from "react";

import { StockTickerOrder } from "./StockTickerOrder";

import { Order } from "../Order";
import { Stock } from "../Stock";

import { IPlayer } from "../../PersonObjects/IPlayer";

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
