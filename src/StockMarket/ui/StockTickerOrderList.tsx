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

export class StockTickerOrderList extends React.Component<IProps, any> {
  render(): React.ReactNode {
    const orders: React.ReactElement[] = [];
    for (let i = 0; i < this.props.orders.length; ++i) {
      const o = this.props.orders[i];
      orders.push(
        <StockTickerOrder
          cancelOrder={this.props.cancelOrder}
          order={o}
          key={i}
        />,
      );
    }

    return <ul className={"stock-market-order-list"}>{orders}</ul>;
  }
}
