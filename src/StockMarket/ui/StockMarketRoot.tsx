/**
 * Root React component for the Stock Market UI
 */
import React, { useEffect, useState } from "react";

import type { IPlayer } from "../../PersonObjects/IPlayer";
import type { EventEmitter } from "../../utils/EventEmitter";
import type { OrderTypes } from "../data/OrderTypes";
import type { PositionTypes } from "../data/PositionTypes";
import type { IStockMarket } from "../IStockMarket";
import type { Stock } from "../Stock";

import { InfoAndPurchases } from "./InfoAndPurchases";
import { StockTickers } from "./StockTickers";

type txFn = (stock: Stock, shares: number) => boolean;
type placeOrderFn = (
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
