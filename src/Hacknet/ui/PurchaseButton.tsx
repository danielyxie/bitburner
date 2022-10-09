import React from "react";

import { hasHacknetServers, hasMaxNumberHacknetServers } from "../HacknetHelpers";
import { Player } from "@player";
import { Money } from "../../ui/React/Money";

import Button from "@mui/material/Button";

interface IProps {
  multiplier: number | string;
  onClick: () => void;
  cost: number;
}

/** React Component for the button that is used to purchase new Hacknet Nodes */
export function PurchaseButton(props: IProps): React.ReactElement {
  const cost = props.cost;
  let text;
  if (hasHacknetServers()) {
    if (hasMaxNumberHacknetServers()) {
      text = <>Hacknet Server limit reached</>;
    } else {
      text = (
        <>
          Purchase Hacknet Server -&nbsp;
          <Money money={cost} forPurchase={true} />
        </>
      );
    }
  } else {
    text = (
      <>
        Purchase Hacknet Node -&nbsp;
        <Money money={cost} forPurchase={true} />
      </>
    );
  }

  return (
    <Button disabled={!Player.canAfford(cost)} onClick={props.onClick}>
      {text}
    </Button>
  );
}
