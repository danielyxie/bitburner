/**
 * Root React component for the Stock Market UI
 */
import * as React from "react";

import { InfoAndPurchases } from "./InfoAndPurchases";
import { StockTickers } from "./StockTickers";

import { IStockMarket } from "../IStockMarket";
import { Stock } from "../Stock";
import { OrderTypes } from "../data/OrderTypes";
import { PositionTypes } from "../data/PositionTypes";

import { IPlayer } from "../../PersonObjects/IPlayer";

type txFn = (stock: Stock, shares: number) => boolean;
export type placeOrderFn = (stock: Stock, shares: number, price: number, ordType: OrderTypes, posType: PositionTypes) => boolean;

type IProps = {
    buyStockLong: txFn;
    buyStockShort: txFn;
    cancelOrder: (params: object) => void;
    initStockMarket: () => void;
    p: IPlayer;
    placeOrder: placeOrderFn;
    sellStockLong: txFn;
    sellStockShort: txFn;
    stockMarket: IStockMarket;
}

type IState = {
    rerenderFlag: boolean;
}

export class StockMarketRoot extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            rerenderFlag: false,
        }

        this.rerender = this.rerender.bind(this);
    }

    rerender(): void {
        this.setState((prevState) => {
            return {
                rerenderFlag: !prevState.rerenderFlag,
            }
        });
    }

    render() {
        return (
            <div>
                <InfoAndPurchases
                    initStockMarket={this.props.initStockMarket}
                    p={this.props.p}
                    rerender={this.rerender}
                />
                {
                    this.props.p.hasWseAccount &&
                    <StockTickers
                        buyStockLong={this.props.buyStockLong}
                        buyStockShort={this.props.buyStockShort}
                        cancelOrder={this.props.cancelOrder}
                        p={this.props.p}
                        placeOrder={this.props.placeOrder}
                        sellStockLong={this.props.sellStockLong}
                        sellStockShort={this.props.sellStockShort}
                        stockMarket={this.props.stockMarket}
                    />
                }
            </div>
        )
    }
}
