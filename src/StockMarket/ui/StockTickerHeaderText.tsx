/**
 * React Component for the text on a stock ticker's header. This text displays
 * general information on the stock such as the name, symbol, price, and
 * 4S Market Data
 */
import * as React from "react";

import { Stock } from "../Stock";
import { TickerHeaderFormatData } from "../data/TickerHeaderFormatData";

import { IPlayer } from "../../PersonObjects/IPlayer";
import { numeralWrapper } from "../../ui/numeralFormat";

type IProps = {
    p: IPlayer;
    stock: Stock;
}

export function StockTickerHeaderText(props: IProps): React.ReactElement {
    const stock = props.stock;

    const stockPriceFormat = numeralWrapper.formatMoney(stock.price);

    let hdrText = `${stock.name}${" ".repeat(1 + TickerHeaderFormatData.longestName - stock.name.length + (TickerHeaderFormatData.longestSymbol - stock.symbol.length))}${stock.symbol} -${" ".repeat(10 - stockPriceFormat.length)}${stockPriceFormat}`;
    if (props.p.has4SData) {
        hdrText += ` - Volatility: ${numeralWrapper.format(stock.mv, '0,0.00')}% - Price Forecast: `;
        let plusOrMinus = stock.b; // True for "+", false for "-"
        if (stock.otlkMag < 0) { plusOrMinus = !plusOrMinus }
        hdrText += (plusOrMinus ? "+" : "-").repeat(Math.floor(Math.abs(stock.otlkMag) / 10) + 1);
    }

    let styleMarkup = {
        color: "#66ff33"
    };
    if (stock.lastPrice === stock.price) {
        styleMarkup.color = "white";
    } else if (stock.lastPrice > stock.price) {
        styleMarkup.color = "red";
    }

    return <pre style={styleMarkup}>{hdrText}</pre>;
}
