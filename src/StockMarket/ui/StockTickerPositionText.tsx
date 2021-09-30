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
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";

type IProps = {
  p: IPlayer;
  stock: Stock;
};

function LongPosition(props: IProps): React.ReactElement {
  const stock = props.stock;

  // Caculate total returns
  const totalCost = stock.playerShares * stock.playerAvgPx;
  const gains = (stock.getBidPrice() - stock.playerAvgPx) * stock.playerShares;
  let percentageGains = gains / totalCost;
  if (isNaN(percentageGains)) {
    percentageGains = 0;
  }

  return (
    <>
      <Box display="flex">
        <Tooltip
          title={
            <Typography>
              Shares in the long position will increase in value if the price of the corresponding stock increases
            </Typography>
          }
        >
          <Typography variant="h5" color="primary">
            Long Position:
          </Typography>
        </Tooltip>
      </Box>
      <Typography>Shares: {numeralWrapper.formatShares(stock.playerShares)}</Typography>
      <Typography>
        Average Price: <Money money={stock.playerAvgPx} /> (Total Cost: <Money money={totalCost} />
      </Typography>
      <Typography>
        Profit: <Money money={gains} /> ({numeralWrapper.formatPercentage(percentageGains)})
      </Typography>
    </>
  );
}

function ShortPosition(props: IProps): React.ReactElement {
  const stock = props.stock;

  // Caculate total returns
  const totalCost = stock.playerShortShares * stock.playerAvgShortPx;
  const gains = (stock.playerAvgShortPx - stock.getAskPrice()) * stock.playerShortShares;
  let percentageGains = gains / totalCost;
  if (isNaN(percentageGains)) {
    percentageGains = 0;
  }

  if (props.p.bitNodeN === 8 || SourceFileFlags[8] >= 2) {
    return (
      <>
        <Box display="flex">
          <Tooltip
            title={
              <Typography>
                Shares in the short position will increase in value if the price of the corresponding stock decreases
              </Typography>
            }
          >
            <Typography variant="h5" color="primary">
              Short Position:
            </Typography>
          </Tooltip>
        </Box>

        <Typography>Shares: {numeralWrapper.formatShares(stock.playerShortShares)}</Typography>
        <Typography>
          Average Price: <Money money={stock.playerAvgShortPx} /> (Total Cost: <Money money={totalCost} />)
        </Typography>
        <Typography>
          Profit: <Money money={gains} /> ({numeralWrapper.formatPercentage(percentageGains)})
        </Typography>
      </>
    );
  } else {
    return <></>;
  }
}

export function StockTickerPositionText(props: IProps): React.ReactElement {
  const stock = props.stock;

  return (
    <>
      <Typography>Max Shares: {numeralWrapper.formatShares(stock.maxShares)}</Typography>
      <Typography className={"tooltip"}>
        Ask Price: <Money money={stock.getAskPrice()} />
      </Typography>
      <br />
      <Typography className={"tooltip"}>
        Bid Price: <Money money={stock.getBidPrice()} />
      </Typography>
      <LongPosition {...props} />
      <ShortPosition {...props} />
    </>
  );
}
