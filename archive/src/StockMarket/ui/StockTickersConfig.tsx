/**
 * React component for the tickers configuration section of the Stock Market UI.
 * This config lets you change the way stock tickers are displayed (watchlist,
 * all/portoflio mode, etc)
 */
import * as React from "react";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

export enum TickerDisplayMode {
  AllStocks,
  Portfolio,
}

type IProps = {
  changeDisplayMode: () => void;
  changeWatchlistFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
  tickerDisplayMode: TickerDisplayMode;
};

function DisplayModeButton(props: IProps): React.ReactElement {
  let txt = "";
  let tooltip = "";
  if (props.tickerDisplayMode === TickerDisplayMode.Portfolio) {
    txt = "Switch to 'All Stocks' Mode";
    tooltip = "Displays all stocks on the WSE";
  } else {
    txt = "Switch to 'Portfolio' Mode";
    tooltip = "Displays only the stocks for which you have shares or orders";
  }

  return (
    <Tooltip title={<Typography>{tooltip}</Typography>}>
      <Button onClick={props.changeDisplayMode}>{txt}</Button>
    </Tooltip>
  );
}

export function StockTickersConfig(props: IProps): React.ReactElement {
  return (
    <>
      <DisplayModeButton {...props} />
      <br />
      <TextField
        sx={{ width: "100%" }}
        onChange={props.changeWatchlistFilter}
        placeholder="Filter Stocks by symbol (comma-separated list)"
        type="text"
      />
    </>
  );
}
