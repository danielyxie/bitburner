/**
 * React Component for a single stock ticker in the Stock Market UI
 */
import React, { useState } from "react";

import { StockTickerHeaderText } from "./StockTickerHeaderText";
import { StockTickerOrderList } from "./StockTickerOrderList";
import { StockTickerPositionText } from "./StockTickerPositionText";
import { StockTickerTxButton } from "./StockTickerTxButton";
import { PlaceOrderModal } from "./PlaceOrderModal";

import { Order } from "../Order";
import { Stock } from "../Stock";
import { getBuyTransactionCost, getSellTransactionGain, calculateBuyMaxAmount } from "../StockMarketHelpers";
import { OrderTypes } from "../data/OrderTypes";
import { PositionTypes } from "../data/PositionTypes";

import { IPlayer } from "../../PersonObjects/IPlayer";
import { SourceFileFlags } from "../../SourceFile/SourceFileFlags";
import { numeralWrapper } from "../../ui/numeralFormat";
import { Money } from "../../ui/React/Money";

import { dialogBoxCreate } from "../../ui/React/DialogBox";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Collapse from "@mui/material/Collapse";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ExpandLess from "@mui/icons-material/ExpandLess";

enum SelectorOrderType {
  Market = "Market Order",
  Limit = "Limit Order",
  Stop = "Stop Order",
}

export type txFn = (stock: Stock, shares: number) => boolean;
export type placeOrderFn = (
  stock: Stock,
  shares: number,
  price: number,
  ordType: OrderTypes,
  posType: PositionTypes,
) => boolean;

type IProps = {
  buyStockLong: txFn;
  buyStockShort: txFn;
  cancelOrder: (params: any) => void;
  orders: Order[];
  p: IPlayer;
  placeOrder: placeOrderFn;
  rerenderAllTickers: () => void;
  sellStockLong: txFn;
  sellStockShort: txFn;
  stock: Stock;
};

export function StockTicker(props: IProps): React.ReactElement {
  const [orderType, setOrderType] = useState(SelectorOrderType.Market);
  const [position, setPosition] = useState(PositionTypes.Long);
  const [qty, setQty] = useState("");
  const [open, setOpen] = useState(false);
  const [tickerOpen, setTicketOpen] = useState(false);

  const [modalProps, setModalProps] = useState<{
    text: string;
    placeText: string;
    place: (n: number) => boolean;
  }>({
    text: "",
    placeText: "",
    place: (n: number) => false,
  });

  function getBuyTransactionCostContent(): JSX.Element | null {
    const stock = props.stock;
    const qty: number = getQuantity();
    if (isNaN(qty)) {
      return null;
    }

    const cost = getBuyTransactionCost(stock, qty, position);
    if (cost == null) {
      return null;
    }

    return (
      <>
        Purchasing {numeralWrapper.formatShares(qty)} shares ({position === PositionTypes.Long ? "Long" : "Short"}
        ) will cost <Money money={cost} />.
      </>
    );
  }

  function getQuantity(): number {
    return Math.round(parseFloat(qty));
  }

  function getSellTransactionCostContent(): JSX.Element | null {
    const stock = props.stock;
    const qty: number = getQuantity();
    if (isNaN(qty)) {
      return null;
    }

    if (position === PositionTypes.Long) {
      if (qty > stock.playerShares) {
        return <>You do not have this many shares in the Long position</>;
      }
    } else {
      if (qty > stock.playerShortShares) {
        return <>You do not have this many shares in the Short position</>;
      }
    }

    const cost = getSellTransactionGain(stock, qty, position);
    if (cost == null) {
      return null;
    }

    return (
      <>
        Selling {numeralWrapper.formatShares(qty)} shares ({position === PositionTypes.Long ? "Long" : "Short"}) will
        result in a gain of <Money money={cost} />.
      </>
    );
  }

  function handleBuyButtonClick(): void {
    const shares = getQuantity();
    if (isNaN(shares)) {
      dialogBoxCreate(`Invalid input for quantity (number of shares): ${qty}`);
      return;
    }

    switch (orderType) {
      case SelectorOrderType.Market: {
        if (position === PositionTypes.Short) {
          props.buyStockShort(props.stock, shares);
        } else {
          props.buyStockLong(props.stock, shares);
        }
        props.rerenderAllTickers();
        break;
      }
      case SelectorOrderType.Limit: {
        setOpen(true);
        setModalProps({
          text: "Enter the price for your Limit Order",
          placeText: "Place Buy Limit Order",
          place: (price: number) => props.placeOrder(props.stock, shares, price, OrderTypes.LimitBuy, position),
        });
        break;
      }
      case SelectorOrderType.Stop: {
        setOpen(true);
        setModalProps({
          text: "Enter the price for your Stop Order",
          placeText: "Place Buy Stop Order",
          place: (price: number) => props.placeOrder(props.stock, shares, price, OrderTypes.StopBuy, position),
        });
        break;
      }
      default:
        break;
    }
  }

  function handleBuyMaxButtonClick(): void {
    const playerMoney: number = props.p.money.toNumber();

    const stock = props.stock;
    let maxShares = calculateBuyMaxAmount(stock, position, playerMoney);
    maxShares = Math.min(maxShares, Math.round(stock.maxShares - stock.playerShares - stock.playerShortShares));

    switch (orderType) {
      case SelectorOrderType.Market: {
        if (position === PositionTypes.Short) {
          props.buyStockShort(stock, maxShares);
        } else {
          props.buyStockLong(stock, maxShares);
        }
        props.rerenderAllTickers();
        break;
      }
      default: {
        dialogBoxCreate(`ERROR: 'Buy Max' only works for Market Orders`);
        break;
      }
    }
  }

  function handleOrderTypeChange(e: SelectChangeEvent<string>): void {
    const val = e.target.value;

    // The select value returns a string. Afaik TypeScript doesnt make it easy
    // to convert that string back to an enum type so we'll just do this for now
    switch (val) {
      case SelectorOrderType.Limit:
        setOrderType(SelectorOrderType.Limit);
        break;
      case SelectorOrderType.Stop:
        setOrderType(SelectorOrderType.Stop);
        break;
      case SelectorOrderType.Market:
      default:
        setOrderType(SelectorOrderType.Market);
    }
  }

  function handlePositionTypeChange(e: SelectChangeEvent<string>): void {
    const val = e.target.value;

    if (val === PositionTypes.Short) {
      setPosition(PositionTypes.Short);
    } else {
      setPosition(PositionTypes.Long);
    }
  }

  function handleQuantityChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setQty(e.target.value);
  }

  function handleSellButtonClick(): void {
    const shares = getQuantity();
    if (isNaN(shares)) {
      dialogBoxCreate(`Invalid input for quantity (number of shares): ${qty}`);
      return;
    }

    switch (orderType) {
      case SelectorOrderType.Market: {
        if (position === PositionTypes.Short) {
          props.sellStockShort(props.stock, shares);
        } else {
          props.sellStockLong(props.stock, shares);
        }
        props.rerenderAllTickers();
        break;
      }
      case SelectorOrderType.Limit: {
        setOpen(true);
        setModalProps({
          text: "Enter the price for your Limit Order",
          placeText: "Place Sell Limit Order",
          place: (price: number) => props.placeOrder(props.stock, shares, price, OrderTypes.LimitSell, position),
        });
        break;
      }
      case SelectorOrderType.Stop: {
        setOpen(true);
        setModalProps({
          text: "Enter the price for your Stop Order",
          placeText: "Place Sell Stop Order",
          place: (price: number) => props.placeOrder(props.stock, shares, price, OrderTypes.StopSell, position),
        });
        break;
      }
      default:
        break;
    }
  }

  function handleSellAllButtonClick(): void {
    const stock = props.stock;

    switch (orderType) {
      case SelectorOrderType.Market: {
        if (position === PositionTypes.Short) {
          props.sellStockShort(stock, stock.playerShortShares);
        } else {
          props.sellStockLong(stock, stock.playerShares);
        }
        props.rerenderAllTickers();
        break;
      }
      default: {
        dialogBoxCreate(`ERROR: 'Sell All' only works for Market Orders`);
        break;
      }
    }
  }

  // Whether the player has access to orders besides market orders (limit/stop)
  function hasOrderAccess(): boolean {
    return props.p.bitNodeN === 8 || SourceFileFlags[8] >= 3;
  }

  // Whether the player has access to shorting stocks
  function hasShortAccess(): boolean {
    return props.p.bitNodeN === 8 || SourceFileFlags[8] >= 2;
  }

  return (
    <Box component={Paper}>
      <ListItemButton onClick={() => setTicketOpen((old) => !old)}>
        <ListItemText primary={<StockTickerHeaderText p={props.p} stock={props.stock} />} />
        {tickerOpen ? <ExpandLess color="primary" /> : <ExpandMore color="primary" />}
      </ListItemButton>
      <Collapse in={tickerOpen} unmountOnExit>
        <Box sx={{ mx: 4 }}>
          <Box display="flex" alignItems="center">
            <TextField onChange={handleQuantityChange} placeholder="Quantity (Shares)" value={qty} />
            <Select onChange={handlePositionTypeChange} value={position}>
              <MenuItem value={PositionTypes.Long}>Long</MenuItem>
              {hasShortAccess() && <MenuItem value={PositionTypes.Short}>Short</MenuItem>}
            </Select>
            <Select onChange={handleOrderTypeChange} value={orderType}>
              <MenuItem value={SelectorOrderType.Market}>{SelectorOrderType.Market}</MenuItem>
              {hasOrderAccess() && <MenuItem value={SelectorOrderType.Limit}>{SelectorOrderType.Limit}</MenuItem>}
              {hasOrderAccess() && <MenuItem value={SelectorOrderType.Stop}>{SelectorOrderType.Stop}</MenuItem>}
            </Select>

            <StockTickerTxButton onClick={handleBuyButtonClick} text={"Buy"} tooltip={getBuyTransactionCostContent()} />
            <StockTickerTxButton
              onClick={handleSellButtonClick}
              text={"Sell"}
              tooltip={getSellTransactionCostContent()}
            />
            <StockTickerTxButton onClick={handleBuyMaxButtonClick} text={"Buy MAX"} />
            <StockTickerTxButton onClick={handleSellAllButtonClick} text={"Sell ALL"} />
          </Box>
          <StockTickerPositionText p={props.p} stock={props.stock} />
          <StockTickerOrderList cancelOrder={props.cancelOrder} orders={props.orders} p={props.p} stock={props.stock} />

          <PlaceOrderModal
            text={modalProps.text}
            placeText={modalProps.placeText}
            place={modalProps.place}
            open={open}
            onClose={() => setOpen(false)}
          />
        </Box>
      </Collapse>
    </Box>
  );
}
