/**
 * React component for displaying a single order in a stock's order book
 */
import * as React from "react";

import { Order } from "../Order";
import { PositionTypes } from "../data/PositionTypes";

import { numeralWrapper } from "../../ui/numeralFormat";

type IProps = {
    cancelOrder: (params: object) => void;
    order: Order;
}

export class StockTickerOrder extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);

        this.handleCancelOrderClick = this.handleCancelOrderClick.bind(this);
    }

    handleCancelOrderClick() {
        this.props.cancelOrder({ order: this.props.order });
    }

    render() {
        const order = this.props.order;

        const posTxt = order.pos === PositionTypes.Long ? "Long Position" : "Short Position";
        const txt = `${order.type} - ${posTxt} - ${numeralWrapper.formatBigNumber(order.shares)} @ ${numeralWrapper.formatMoney(order.price)}`

        return (
            <li>
                {txt}
                <button className={"std-button stock-market-order-cancel-btn"} onClick={this.handleCancelOrderClick}>
                    Cancel Order
                </button>
            </li>
        )
    }
}
