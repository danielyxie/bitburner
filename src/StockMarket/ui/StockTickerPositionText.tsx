/**
 * React Component for the text on a stock ticker that display's information
 * about the player's position in that stock
 */
import * as React from "react";

import { Stock } from "../Stock";

import { IPlayer } from "../../PersonObjects/IPlayer";
import { numeralWrapper } from "../../ui/numeralFormat";
import { Money } from "../../ui/React/Money";
import { SourceFileFlags } from "../../SourceFile/SourceFileFlags";

type IProps = {
  p: IPlayer;
  stock: Stock;
};

const blockStyleMarkup = {
  display: "block",
};

export class StockTickerPositionText extends React.Component<IProps, any> {
  renderLongPosition(): React.ReactElement {
    const stock = this.props.stock;

    // Caculate total returns
    const totalCost = stock.playerShares * stock.playerAvgPx;
    const gains =
      (stock.getBidPrice() - stock.playerAvgPx) * stock.playerShares;
    let percentageGains = gains / totalCost;
    if (isNaN(percentageGains)) {
      percentageGains = 0;
    }

    return (
      <div>
        <h3 className={"tooltip"}>
          Long Position:
          <span className={"tooltiptext"}>
            Shares in the long position will increase in value if the price of
            the corresponding stock increases
          </span>
        </h3>
        <br />
        <p>Shares: {numeralWrapper.formatShares(stock.playerShares)}</p>
        <br />
        <p>
          Average Price: <Money money={stock.playerAvgPx} /> (Total Cost:{" "}
          <Money money={totalCost} />
        </p>
        <br />
        <p>
          Profit: <Money money={gains} /> (
          {numeralWrapper.formatPercentage(percentageGains)})
        </p>
        <br />
      </div>
    );
  }

  renderShortPosition(): React.ReactElement | null {
    const stock = this.props.stock;

    // Caculate total returns
    const totalCost = stock.playerShortShares * stock.playerAvgShortPx;
    const gains =
      (stock.playerAvgShortPx - stock.getAskPrice()) * stock.playerShortShares;
    let percentageGains = gains / totalCost;
    if (isNaN(percentageGains)) {
      percentageGains = 0;
    }

    if (this.props.p.bitNodeN === 8 || SourceFileFlags[8] >= 2) {
      return (
        <div>
          <h3 className={"tooltip"}>
            Short Position:
            <span className={"tooltiptext"}>
              Shares in the short position will increase in value if the price
              of the corresponding stock decreases
            </span>
          </h3>
          <br />
          <p>Shares: {numeralWrapper.formatShares(stock.playerShortShares)}</p>
          <br />
          <p>
            Average Price: <Money money={stock.playerAvgShortPx} /> (Total Cost:{" "}
            <Money money={totalCost} />)
          </p>
          <br />
          <p>
            Profit: <Money money={gains} /> (
            {numeralWrapper.formatPercentage(percentageGains)})
          </p>
          <br />
        </div>
      );
    } else {
      return null;
    }
  }

  render(): React.ReactNode {
    const stock = this.props.stock;

    return (
      <div className={"stock-market-position-text"}>
        <p style={blockStyleMarkup}>
          Max Shares: {numeralWrapper.formatShares(stock.maxShares)}
        </p>
        <p className={"tooltip"}>
          Ask Price: <Money money={stock.getAskPrice()} />
          <span className={"tooltiptext"}>
            See Investopedia for details on what this is
          </span>
        </p>
        <br />
        <p className={"tooltip"}>
          Bid Price: <Money money={stock.getBidPrice()} />
          <span className={"tooltiptext"}>
            See Investopedia for details on what this is
          </span>
        </p>
        {this.renderLongPosition()}
        {this.renderShortPosition()}
      </div>
    );
  }
}
