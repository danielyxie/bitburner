/**
 * React Component for the Multiplier buttons on the Hacknet page.
 * These buttons let the player control how many Nodes/Upgrades they're
 * purchasing when using the UI (x1, x5, x10, MAX)
 */
import React from "react";

import { PurchaseMultipliers } from "../data/Constants";
import Button from "@mui/material/Button";

interface IMultiplierProps {
  disabled: boolean;
  onClick: () => void;
  text: string;
}

function MultiplierButton(props: IMultiplierProps): React.ReactElement {
  return (
    <Button disabled={props.disabled} onClick={props.onClick}>
      {props.text}
    </Button>
  );
}

interface IProps {
  purchaseMultiplier: number | string;
  onClicks: (() => void)[];
}

export function MultiplierButtons(props: IProps): React.ReactElement {
  if (props.purchaseMultiplier == null) {
    throw new Error(`MultiplierButtons constructed without required props`);
  }

  const mults = ["x1", "x5", "x10", "MAX"];
  const onClicks = props.onClicks;
  const buttons = [];
  for (let i = 0; i < mults.length; ++i) {
    const mult = mults[i];
    const btnProps = {
      disabled: props.purchaseMultiplier === PurchaseMultipliers[mult],
      onClick: onClicks[i],
      text: mult,
    };

    buttons.push(<MultiplierButton key={mult} {...btnProps} />);
  }

  return <>{buttons}</>;
}
