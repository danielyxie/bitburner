/**
 * React component for displaying a single order in a stock's order book
 */
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { numeralWrapper } from "../../ui/numeralFormat";
import { Money } from "../../ui/React/Money";
import { PositionTypes } from "../data/PositionTypes";
import type { Order } from "../Order";

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
