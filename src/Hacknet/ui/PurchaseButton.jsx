/**
 * React Component for the button that is used to purchase new Hacknet Nodes
 */
import React from "react";

import { hasHacknetServers, hasMaxNumberHacknetServers } from "../HacknetHelpers";
import { Player } from "../../Player";
import { Money } from "../../ui/React/Money";

export function PurchaseButton(props) {
  if (props.multiplier == null || props.onClick == null) {
    throw new Error(`PurchaseButton constructed without required props`);
  }

  const cost = props.cost;
  let className = Player.canAfford(cost) ? "std-button" : "std-button-disabled";
  let text;
  let style = null;
  if (hasHacknetServers()) {
    if (hasMaxNumberHacknetServers()) {
      className = "std-button-disabled";
      text = <>Hacknet Server limit reached</>;
      style = { color: "red" };
    } else {
      text = (
        <>
          Purchase Hacknet Server - <Money money={cost} player={Player} />
        </>
      );
    }
  } else {
    text = (
      <>
        Purchase Hacknet Node - <Money money={cost} player={Player} />
      </>
    );
  }

  return (
    <button className={className} onClick={props.onClick} style={style}>
      {text}
    </button>
  );
}
