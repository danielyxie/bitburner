/**
 * Root React component for the Stock Market UI
 */
import React, { useState, useEffect } from "react";

import { InfoAndPurchases } from "./InfoAndPurchases";
import { StockTickers } from "./StockTickers";

import { IStockMarket } from "../IStockMarket";

import { Player } from "../../Player";

type IProps = {
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
      <InfoAndPurchases rerender={rerender} />
      {Player.hasWseAccount && <StockTickers stockMarket={props.stockMarket} />}
    </>
  );
}
