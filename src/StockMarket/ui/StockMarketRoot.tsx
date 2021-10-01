/**
 * Root React component for the Stock Market UI
 */
import React, { useState, useEffect } from "react";

import { InfoAndPurchases } from "./InfoAndPurchases";
import { StockTickers } from "./StockTickers";

import { IStockMarket } from "../IStockMarket";
import { Stock } from "../Stock";
import { OrderTypes } from "../data/OrderTypes";
import { PositionTypes } from "../data/PositionTypes";

import { IPlayer } from "../../PersonObjects/IPlayer";
import { EventEmitter } from "../../utils/EventEmitter";

type txFn = (stock: Stock, shares: number) => boolean;
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
  eventEmitterForReset?: EventEmitter<[]>;
  initStockMarket: () => void;
  p: IPlayer;
  placeOrder: placeOrderFn;
  sellStockLong: txFn;
  sellStockShort: txFn;
  stockMarket: IStockMarket;
};

export function StockMarketRoot(props: IProps): React.ReactElement {
  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((old) => !old);
  }

  useEffect(() => {
    const id = setInterval(rerender, 200);
    return () => clearInterval(id);
  }, []);
  return (
    <>
      <InfoAndPurchases initStockMarket={props.initStockMarket} p={props.p} rerender={rerender} />
      {props.p.hasWseAccount && (
        <StockTickers
          buyStockLong={props.buyStockLong}
          buyStockShort={props.buyStockShort}
          cancelOrder={props.cancelOrder}
          eventEmitterForReset={props.eventEmitterForReset}
          p={props.p}
          placeOrder={props.placeOrder}
          sellStockLong={props.sellStockLong}
          sellStockShort={props.sellStockShort}
          stockMarket={props.stockMarket}
        />
      )}
    </>
  );
}
