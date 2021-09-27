/**
 * React Component for the button that is used to purchase new Hacknet Nodes
 */
import React from "react";

import { hasHacknetServers, hasMaxNumberHacknetServers } from "../HacknetHelpers";
import { Player } from "../../Player";
import { Money } from "../../ui/React/Money";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

interface IProps {
  multiplier: number | string;
  onClick: () => void;
  cost: number;
}

export function PurchaseButton(props: IProps): React.ReactElement {
  const cost = props.cost;
  let className = Player.canAfford(cost) ? "std-button" : "std-button-disabled";
  let text;
  let style = {};
  if (hasHacknetServers(Player)) {
    if (hasMaxNumberHacknetServers(Player)) {
      className = "std-button-disabled";
      text = <>Hacknet Server limit reached</>;
      style = { color: "red" };
    } else {
      text = (
        <>
          Purchase Hacknet Server -&nbsp;
          <Money money={cost} player={Player} />
        </>
      );
    }
  } else {
    text = (
      <>
        Purchase Hacknet Node -&nbsp;
        <Money money={cost} player={Player} />
      </>
    );
  }

  return <Button onClick={props.onClick}>{text}</Button>;
}
