/**
 * React component for displaying a single order in a stock's order book
 */
import * as React from "react";

import { Order } from "../Order";
import { PositionTypes } from "../data/PositionTypes";

import { numeralWrapper } from "../../ui/numeralFormat";
import { Money } from "../../ui/React/Money";

type IProps = {
  cancelOrder: (params: any) => void;
  order: Order;
};

export class StockTickerOrder extends React.Component<IProps, any> {
  constructor(props: IProps) {
    super(props);

    this.handleCancelOrderClick = this.handleCancelOrderClick.bind(this);
  }

  handleCancelOrderClick(): void {
    this.props.cancelOrder({ order: this.props.order });
  }

  render(): React.ReactNode {
    const order = this.props.order;

    const posTxt =
      order.pos === PositionTypes.Long ? "Long Position" : "Short Position";
    const txt = (
      <>
        {order.type} - {posTxt} - {numeralWrapper.formatShares(order.shares)} @{" "}
        <Money money={order.price} />
      </>
    );

    return (
      <li>
        {txt}
        <button
          className={"std-button stock-market-order-cancel-btn"}
          onClick={this.handleCancelOrderClick}
        >
          Cancel Order
        </button>
      </li>
    );
  }
}
