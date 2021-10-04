/**
 * React component for displaying a single order in a stock's order book
 */
import * as React from "react";

import { Order } from "../Order";
import { PositionTypes } from "../data/PositionTypes";

import { numeralWrapper } from "../../ui/numeralFormat";
import { Money } from "../../ui/React/Money";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

type IProps = {
  cancelOrder: (params: any) => void;
  order: Order;
};

export function StockTickerOrder(props: IProps): React.ReactElement {
  function handleCancelOrderClick(): void {
    props.cancelOrder({ order: props.order });
  }

  const order = props.order;

  const posTxt = order.pos === PositionTypes.Long ? "Long Position" : "Short Position";
  const txt = (
    <>
      {order.type} - {posTxt} - {numeralWrapper.formatShares(order.shares)} @ <Money money={order.price} />
    </>
  );

  return (
    <Box display="flex" alignItems="center">
      <Typography>{txt}</Typography>
      <Button onClick={handleCancelOrderClick}>Cancel Order</Button>
    </Box>
  );
}
