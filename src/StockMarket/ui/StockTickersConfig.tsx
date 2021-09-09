/**
 * React component for the tickers configuration section of the Stock Market UI.
 * This config lets you change the way stock tickers are displayed (watchlist,
 * all/portoflio mode, etc)
 */
import * as React from "react";

import { StdButton } from "../../ui/React/StdButton";

export enum TickerDisplayMode {
  AllStocks,
  Portfolio,
}

type IProps = {
  changeDisplayMode: () => void;
  changeWatchlistFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
  collapseAllTickers: () => void;
  expandAllTickers: () => void;
  tickerDisplayMode: TickerDisplayMode;
};

export class StockTickersConfig extends React.Component<IProps, any> {
  constructor(props: IProps) {
    super(props);
  }

  renderDisplayModeButton(): React.ReactNode {
    let txt = "";
    let tooltip = "";
    if (this.props.tickerDisplayMode === TickerDisplayMode.Portfolio) {
      txt = "Switch to 'All Stocks' Mode";
      tooltip = "Displays all stocks on the WSE";
    } else {
      txt = "Switch to 'Portfolio' Mode";
      tooltip = "Displays only the stocks for which you have shares or orders";
    }

    return <StdButton onClick={this.props.changeDisplayMode} text={txt} tooltip={tooltip} />;
  }

  render(): React.ReactNode {
    return (
      <div>
        {this.renderDisplayModeButton()}
        <StdButton onClick={this.props.expandAllTickers} text="Expand Tickers" />
        <StdButton onClick={this.props.collapseAllTickers} text="Collapse Tickers" />

        <input
          className="text-input"
          id="stock-market-watchlist-filter"
          onChange={this.props.changeWatchlistFilter}
          placeholder="Filter Stocks by symbol (comma-separated list)"
          type="text"
        />
      </div>
    );
  }
}
