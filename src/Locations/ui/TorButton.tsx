import React, { useState } from "react";

import { purchaseTorRouter } from "../LocationsHelpers";

import { CONSTANTS } from "../../Constants";
import { IPlayer } from "../../PersonObjects/IPlayer";

import { StdButtonPurchased } from "../../ui/React/StdButtonPurchased";
import { StdButton } from "../../ui/React/StdButton";
import { Money } from "../../ui/React/Money";

type IProps = {
  p: IPlayer;
  rerender: () => void;
};

export function TorButton(props: IProps): React.ReactElement {
  const btnStyle = { display: "block" };

  function buy(): void {
    purchaseTorRouter(props.p);
    props.rerender();
  }

  if (props.p.hasTorRouter()) {
    return (
      <StdButtonPurchased style={btnStyle} text={"TOR Router - Purchased"} />
    );
  }

  return (
    <StdButton
      disabled={!props.p.canAfford(CONSTANTS.TorRouterCost)}
      onClick={buy}
      style={btnStyle}
      text={
        <>
          Purchase TOR router -{" "}
          <Money money={CONSTANTS.TorRouterCost} player={props.p} />
        </>
      }
    />
  );
}
