/**
 * React Component for the Stock Market UI. This is the container for all
 * of the stock tickers. It also contains the configuration for the
 * stock ticker UI (watchlist filter, portfolio vs all mode, etc.)
 */
import React, { useState } from "react";

import { StockTicker } from "./StockTicker";
import { StockTickersConfig, TickerDisplayMode } from "./StockTickersConfig";

import { IStockMarket } from "../IStockMarket";
import { Stock } from "../Stock";

type IProps = {
  stockMarket: IStockMarket;
};

export function StockTickers(props: IProps): React.ReactElement {
  const setRerender = useState(false)[1];
  const [tickerDisplayMode, setTickerDisplayMode] = useState(TickerDisplayMode.AllStocks);
  const [watchlistSymbols, setWatchlistSymbols] = useState<string[]>([]);

  function changeDisplayMode(): void {
    if (tickerDisplayMode === TickerDisplayMode.AllStocks) {
      setTickerDisplayMode(TickerDisplayMode.Portfolio);
    } else {
      setTickerDisplayMode(TickerDisplayMode.AllStocks);
    }
  }

  function changeWatchlistFilter(e: React.ChangeEvent<HTMLInputElement>): void {
    const watchlist = e.target.value;
    const sanitizedWatchlist = watchlist.replace(/\s/g, "");

    if (sanitizedWatchlist !== "") {
      setWatchlistSymbols(sanitizedWatchlist.split(","));
    } else {
      setWatchlistSymbols([]);
    }
  }

  function rerender(): void {
    setRerender((old) => !old);
  }

  const tickers: React.ReactElement[] = [];
  for (const stockMarketProp of Object.keys(props.stockMarket)) {
    const val = props.stockMarket[stockMarketProp];
    if (val instanceof Stock) {
      // Skip if there's a filter and the stock isn't in that filter
      if (watchlistSymbols.length > 0 && !watchlistSymbols.includes(val.symbol)) {
        continue;
      }

      let orders = props.stockMarket.Orders[val.symbol];
      if (orders == null) {
        orders = [];
      }

      // Skip if we're in portfolio mode and the player doesn't own this or have any active orders
      if (tickerDisplayMode === TickerDisplayMode.Portfolio) {
        if (val.playerShares === 0 && val.playerShortShares === 0 && orders.length === 0) {
          continue;
        }
      }

      tickers.push(<StockTicker key={val.symbol} orders={orders} rerenderAllTickers={rerender} stock={val} />);
    }
  }

  return (
    <>
      <StockTickersConfig
        changeDisplayMode={changeDisplayMode}
        changeWatchlistFilter={changeWatchlistFilter}
        tickerDisplayMode={tickerDisplayMode}
      />

      {tickers}
    </>
  );
}
