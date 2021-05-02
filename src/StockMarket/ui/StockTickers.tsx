/**
 * React Component for the Stock Market UI. This is the container for all
 * of the stock tickers. It also contains the configuration for the
 * stock ticker UI (watchlist filter, portfolio vs all mode, etc.)
 */
import * as React from "react";

import { StockTicker } from "./StockTicker";
import { StockTickersConfig, TickerDisplayMode } from "./StockTickersConfig";

import { IStockMarket } from "../IStockMarket";
import { Stock } from "../Stock";
import { OrderTypes } from "../data/OrderTypes";
import { PositionTypes } from "../data/PositionTypes";

import { IPlayer } from "../../PersonObjects/IPlayer";
import { EventEmitter } from "../../utils/EventEmitter";

import { ErrorBoundary } from "../../ui/React/ErrorBoundary";

export type txFn = (stock: Stock, shares: number) => boolean;
export type placeOrderFn = (stock: Stock, shares: number, price: number, ordType: OrderTypes, posType: PositionTypes) => boolean;

type IProps = {
    buyStockLong: txFn;
    buyStockShort: txFn;
    cancelOrder: (params: any) => void;
    eventEmitterForReset?: EventEmitter;
    p: IPlayer;
    placeOrder: placeOrderFn;
    sellStockLong: txFn;
    sellStockShort: txFn;
    stockMarket: IStockMarket;
}

type IState = {
    rerenderFlag: boolean;
    tickerDisplayMode: TickerDisplayMode;
    watchlistFilter: string;
    watchlistSymbols: string[];
}

export class StockTickers extends React.Component<IProps, IState> {
    listRef: React.RefObject<HTMLUListElement>;

    constructor(props: IProps) {
        super(props);

        this.state = {
            rerenderFlag: false,
            tickerDisplayMode: TickerDisplayMode.AllStocks,
            watchlistFilter: "",
            watchlistSymbols: [],
        }

        this.changeDisplayMode = this.changeDisplayMode.bind(this);
        this.changeWatchlistFilter = this.changeWatchlistFilter.bind(this);
        this.collapseAllTickers = this.collapseAllTickers.bind(this);
        this.expandAllTickers = this.expandAllTickers.bind(this);
        this.rerender = this.rerender.bind(this);

        this.listRef = React.createRef();
    }

    changeDisplayMode(): void {
        if (this.state.tickerDisplayMode === TickerDisplayMode.AllStocks) {
            this.setState({
                tickerDisplayMode: TickerDisplayMode.Portfolio,
            });
        } else {
            this.setState({
                tickerDisplayMode: TickerDisplayMode.AllStocks,
            });
        }
    }

    changeWatchlistFilter(e: React.ChangeEvent<HTMLInputElement>): void {
        const watchlist = e.target.value;
        const sanitizedWatchlist = watchlist.replace(/\s/g, '');

        this.setState({
            watchlistFilter: watchlist,
        });

        if (sanitizedWatchlist !== "") {
            this.setState({
                watchlistSymbols: sanitizedWatchlist.split(","),
            });
        } else {
            this.setState({
                watchlistSymbols: [],
            });
        }
    }

    collapseAllTickers(): void {
        const ul = this.listRef.current;
        if (ul == null) { return; }
        const tickers = ul.getElementsByClassName("accordion-header");
        for (let i = 0; i < tickers.length; ++i) {
            const ticker = tickers[i];
            if (!(ticker instanceof HTMLButtonElement)) {
                continue;
            }

            if (ticker.classList.contains("active")) {
                ticker.click();
            }
        }
    }

    expandAllTickers(): void {
        const ul = this.listRef.current;
        if (ul == null) { return; }
        const tickers = ul.getElementsByClassName("accordion-header");
        for (let i = 0; i < tickers.length; ++i) {
            const ticker = tickers[i];
            if (!(ticker instanceof HTMLButtonElement)) {
                continue;
            }

            if (!ticker.classList.contains("active")) {
                ticker.click();
            }
        }
    }

    rerender(): void {
        this.setState((prevState) => {
            return {
                rerenderFlag: !prevState.rerenderFlag,
            }
        });
    }

    render(): React.ReactNode {
        const tickers: React.ReactElement[] = [];
        for (const stockMarketProp in this.props.stockMarket) {
            const val = this.props.stockMarket[stockMarketProp];
            if (val instanceof Stock) {
                // Skip if there's a filter and the stock isnt in that filter
                if (this.state.watchlistSymbols.length > 0 && !this.state.watchlistSymbols.includes(val.symbol)) {
                    continue;
                }

                let orders = this.props.stockMarket.Orders[val.symbol];
                if (orders == null) {
                    orders = [];
                }

                // Skip if we're in portfolio mode and the player doesnt own this or have any active orders
                if (this.state.tickerDisplayMode === TickerDisplayMode.Portfolio) {
                    if (val.playerShares === 0 && val.playerShortShares === 0 && orders.length === 0) {
                        continue;
                    }
                }

                tickers.push(
                    <StockTicker
                        buyStockLong={this.props.buyStockLong}
                        buyStockShort={this.props.buyStockShort}
                        cancelOrder={this.props.cancelOrder}
                        key={val.symbol}
                        orders={orders}
                        p={this.props.p}
                        placeOrder={this.props.placeOrder}
                        rerenderAllTickers={this.rerender}
                        sellStockLong={this.props.sellStockLong}
                        sellStockShort={this.props.sellStockShort}
                        stock={val}
                    />,
                )
            }
        }

        const errorBoundaryProps = {
            eventEmitterForReset: this.props.eventEmitterForReset,
            id: "StockTickersErrorBoundary",
        }

        return (
            <ErrorBoundary {...errorBoundaryProps}>
                <StockTickersConfig
                    changeDisplayMode={this.changeDisplayMode}
                    changeWatchlistFilter={this.changeWatchlistFilter}
                    collapseAllTickers={this.collapseAllTickers}
                    expandAllTickers={this.expandAllTickers}
                    tickerDisplayMode={this.state.tickerDisplayMode}
                />

                <ul id="stock-market-list" ref={this.listRef}>
                    {tickers}
                </ul>
            </ErrorBoundary>
        )
    }
}
