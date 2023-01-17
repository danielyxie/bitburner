/**
 * React Component for the text on a stock ticker's header. This text displays
 * general information on the stock such as the name, symbol, price, and
 * 4S Market Data
 */
import * as React from "react";

import { Stock } from "../Stock";
import { TickerHeaderFormatData } from "../data/TickerHeaderFormatData";

import { IPlayer } from "../../PersonObjects/IPlayer";
import { Settings } from "../../Settings/Settings";
import { numeralWrapper } from "../../ui/numeralFormat";
import Typography from "@mui/material/Typography";

type IProps = {
  p: IPlayer;
  stock: Stock;
};

const localesWithLongPriceFormat = ["cs", "lv", "pl", "ru"];

export function StockTickerHeaderText(props: IProps): React.ReactElement {
  const stock = props.stock;

  const stockPriceFormat = numeralWrapper.formatMoney(stock.price);
  const spacesAllottedForStockPrice = localesWithLongPriceFormat.includes(Settings.Locale) ? 15 : 12;
  const spacesAfterStockName = " ".repeat(
    1 +
      TickerHeaderFormatData.longestName -
      stock.name.length +
      (TickerHeaderFormatData.longestSymbol - stock.symbol.length),
  );
  const spacesBeforePrice = " ".repeat(spacesAllottedForStockPrice - stockPriceFormat.length);

  let hdrText = `${stock.name}${spacesAfterStockName}${stock.symbol} -${spacesBeforePrice}${stockPriceFormat}`;
  if (props.p.has4SData) {
    hdrText += ` - Volatility: ${numeralWrapper.formatPercentage(stock.mv / 100)} - Price Forecast: `;
    let plusOrMinus = stock.b; // True for "+", false for "-"
    if (stock.otlkMag < 0) {
      plusOrMinus = !plusOrMinus;
    }
    hdrText += (plusOrMinus ? "+" : "-").repeat(Math.floor(Math.abs(stock.otlkMag) / 10) + 1);

    // Debugging:
    // hdrText += ` - ${stock.getAbsoluteForecast()} / ${stock.otlkMagForecast}`;
  }

  let color = "primary";
  if (stock.lastPrice === stock.price) {
    color = "secondary";
  } else if (stock.lastPrice > stock.price) {
    color = "error";
  }

  return (
    <Typography style={{ whiteSpace: "pre" }} color={color}>
      {hdrText}
    </Typography>
  );
}
