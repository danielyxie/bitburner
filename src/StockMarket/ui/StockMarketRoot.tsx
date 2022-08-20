/**
 * Root React component for the Stock Market UI
 */
import React, { useState, useEffect } from "react";

import { InfoAndPurchases } from "./InfoAndPurchases";
import { StockTickers } from "./StockTickers";

import { IStockMarket } from "../IStockMarket";

import { IPlayer } from "../../PersonObjects/IPlayer";
import { EventEmitter } from "../../utils/EventEmitter";

type IProps = {
  eventEmitterForReset?: EventEmitter<[]>;
  initStockMarket: () => void;
  p: IPlayer;
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
        <StockTickers eventEmitterForReset={props.eventEmitterForReset} p={props.p} stockMarket={props.stockMarket} />
      )}
    </>
  );
}
