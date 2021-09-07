import React, { useState } from "react";

import { CONSTANTS } from "../../Constants";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { purchaseRamForHomeComputer } from "../../Server/ServerPurchases";

import { StdButtonPurchased } from "../../ui/React/StdButtonPurchased";
import { StdButton } from "../../ui/React/StdButton";
import { Money } from "../../ui/React/Money";
import { MathComponent } from "mathjax-react";

type IProps = {
  p: IPlayer;
  rerender: () => void;
};

export function RamButton(props: IProps): React.ReactElement {
  const btnStyle = { display: "block" };

  const homeComputer = props.p.getHomeComputer();
  if (homeComputer.maxRam >= CONSTANTS.HomeComputerMaxRam) {
    return (
      <StdButtonPurchased style={btnStyle} text={"Upgrade 'home' RAM - MAX"} />
    );
  }

  const cost = props.p.getUpgradeHomeRamCost();

  function buy(): void {
    purchaseRamForHomeComputer(props.p);
    props.rerender();
  }

  return (
    <StdButton
      disabled={!props.p.canAfford(cost)}
      onClick={buy}
      style={btnStyle}
      text={
        <>
          Upgrade 'home' RAM ({homeComputer.maxRam}GB -&gt;{" "}
          {homeComputer.maxRam * 2}GB) - <Money money={cost} player={props.p} />
        </>
      }
      tooltip={
        <MathComponent
          tex={String.raw`\large{cost = 3.2 \times 10^3 \times 1.58^{log_2{(ram)}}}`}
        />
      }
    />
  );
}
