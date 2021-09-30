/**
 * React component for the Stock Market UI. This component displays
 * general information about the stock market, buttons for the various purchases,
 * and a link to the documentation (Investopedia)
 */
import React, { useState } from "react";

import { getStockMarket4SDataCost, getStockMarket4STixApiCost } from "../StockMarketCosts";

import { CONSTANTS } from "../../Constants";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { Money } from "../../ui/React/Money";

import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import HelpIcon from "@mui/icons-material/Help";
import CheckIcon from "@mui/icons-material/Check";
import { StaticModal } from "../../ui/React/StaticModal";

type IProps = {
  initStockMarket: () => void;
  p: IPlayer;
  rerender: () => void;
};

function Purchase4SMarketDataTixApiAccessButton(props: IProps): React.ReactElement {
  function purchase4SMarketDataTixApiAccess(): void {
    if (props.p.has4SDataTixApi) {
      return;
    }
    if (!props.p.canAfford(getStockMarket4STixApiCost())) {
      return;
    }
    props.p.has4SDataTixApi = true;
    props.p.loseMoney(getStockMarket4STixApiCost());
    props.rerender();
  }

  if (props.p.has4SDataTixApi) {
    return (
      <Typography>
        Market Data TIX API Access <CheckIcon />
      </Typography>
    );
  } else {
    const cost = getStockMarket4STixApiCost();
    return (
      <Tooltip
        title={
          !props.p.hasTixApiAccess ? (
            <Typography>Requires TIX API Access</Typography>
          ) : (
            <Typography>Let you access 4S Market Data through Netscript</Typography>
          )
        }
      >
        <span>
          <Button
            disabled={!props.p.hasTixApiAccess || !props.p.canAfford(cost)}
            onClick={purchase4SMarketDataTixApiAccess}
          >
            Buy 4S Market Data TIX API Access -&nbsp;
            <Money money={cost} player={props.p} />
          </Button>
        </span>
      </Tooltip>
    );
  }
}

function PurchaseWseAccountButton(props: IProps): React.ReactElement {
  if (props.p.hasWseAccount) {
    return (
      <Typography>
        WSE Account <CheckIcon />
      </Typography>
    );
  }
  function purchaseWseAccount(): void {
    if (props.p.hasWseAccount) {
      return;
    }
    if (!props.p.canAfford(CONSTANTS.WSEAccountCost)) {
      return;
    }
    props.p.hasWseAccount = true;
    props.initStockMarket();
    props.p.loseMoney(CONSTANTS.WSEAccountCost);
    props.rerender();
  }

  const cost = CONSTANTS.WSEAccountCost;
  return (
    <>
      <Typography>To begin trading, you must first purchase an account:</Typography>
      <Button disabled={!props.p.canAfford(cost)} onClick={purchaseWseAccount}>
        Buy WSE Account -&nbsp;
        <Money money={cost} player={props.p} />
      </Button>
    </>
  );
}

function PurchaseTixApiAccessButton(props: IProps): React.ReactElement {
  function purchaseTixApiAccess(): void {
    if (props.p.hasTixApiAccess) {
      return;
    }
    if (!props.p.canAfford(CONSTANTS.TIXAPICost)) {
      return;
    }
    props.p.hasTixApiAccess = true;
    props.p.loseMoney(CONSTANTS.TIXAPICost);
    props.rerender();
  }

  if (props.p.hasTixApiAccess) {
    return (
      <Typography>
        TIX API Access <CheckIcon />
      </Typography>
    );
  } else {
    const cost = CONSTANTS.TIXAPICost;
    return (
      <Button disabled={!props.p.canAfford(cost) || !props.p.hasWseAccount} onClick={purchaseTixApiAccess}>
        Buy Trade Information eXchange (TIX) API Access -&nbsp;
        <Money money={cost} player={props.p} />
      </Button>
    );
  }
}

function Purchase4SMarketDataButton(props: IProps): React.ReactElement {
  function purchase4SMarketData(): void {
    if (props.p.has4SData) {
      return;
    }
    if (!props.p.canAfford(getStockMarket4SDataCost())) {
      return;
    }
    props.p.has4SData = true;
    props.p.loseMoney(getStockMarket4SDataCost());
    props.rerender();
  }
  if (props.p.has4SData) {
    return (
      <Typography>
        4S Market Data Access <CheckIcon />
      </Typography>
    );
  } else {
    const cost = getStockMarket4SDataCost();
    return (
      <Tooltip
        title={<Typography>Lets you view additional pricing and volatility information about stocks</Typography>}
      >
        <span>
          <Button disabled={!props.p.canAfford(cost) || !props.p.hasWseAccount} onClick={purchase4SMarketData}>
            Buy 4S Market Data Access -&nbsp;
            <Money money={cost} player={props.p} />
          </Button>
        </span>
      </Tooltip>
    );
  }
}

export function InfoAndPurchases(props: IProps): React.ReactElement {
  const [helpOpen, setHelpOpen] = useState(false);
  const documentationLink = "https://bitburner.readthedocs.io/en/latest/basicgameplay/stockmarket.html";
  return (
    <>
      <Typography>Welcome to the World Stock Exchange (WSE)!</Typography>
      <Link href={documentationLink} target={"_blank"}>
        Investopedia
      </Link>
      <br />
      <PurchaseWseAccountButton {...props} />

      <Typography variant="h5" color="primary">
        Trade Information eXchange (TIX) API
      </Typography>
      <Typography>
        TIX, short for Trade Information eXchange, is the communications protocol used by the WSE. Purchasing access to
        the TIX API lets you write code to create your own algorithmic/automated trading strategies.
      </Typography>
      <PurchaseTixApiAccessButton {...props} />
      <Typography variant="h5" color="primary">
        Four Sigma (4S) Market Data Feed
      </Typography>
      <Typography>
        Four Sigma's (4S) Market Data Feed provides information about stocks that will help your trading strategies.
        <IconButton onClick={() => setHelpOpen(true)}>
          <HelpIcon />
        </IconButton>
      </Typography>
      <Purchase4SMarketDataTixApiAccessButton {...props} />
      <Purchase4SMarketDataButton {...props} />
      <Typography>
        Commission Fees: Every transaction you make has a{" "}
        <Money money={CONSTANTS.StockMarketCommission} player={props.p} /> commission fee.
      </Typography>
      <br />
      <Typography>
        WARNING: When you reset after installing Augmentations, the Stock Market is reset. You will retain your WSE
        Account, access to the TIX API, and 4S Market Data access. However, all of your stock positions are lost, so
        make sure to sell your stocks before installing Augmentations!
      </Typography>
      <StaticModal open={helpOpen} onClose={() => setHelpOpen(false)}>
        <Typography>
          Access to the 4S Market Data feed will display two additional pieces of information about each stock: Price
          Forecast & Volatility
          <br />
          <br />
          Price Forecast indicates the probability the stock has of increasing or decreasing. A '+' forecast means the
          stock has a higher chance of increasing than decreasing, and a '-' means the opposite. The number of '+/-'
          symbols is used to illustrate the magnitude of these probabilities. For example, '+++' means that the stock
          has a significantly higher chance of increasing than decreasing, while '+' means that the stock only has a
          slightly higher chance of increasing than decreasing.
          <br />
          <br />
          Volatility represents the maximum percentage by which a stock's price can change every tick (a tick occurs
          every few seconds while the game is running).
          <br />
          <br />A stock's price forecast can change over time. This is also affected by volatility. The more volatile a
          stock is, the more its price forecast will change.
        </Typography>
      </StaticModal>
    </>
  );
}
