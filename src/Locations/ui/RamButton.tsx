import React from "react";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";

import { CONSTANTS } from "../../Constants";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { purchaseRamForHomeComputer } from "../../Server/ServerPurchases";

import { Money } from "../../ui/React/Money";
import { numeralWrapper } from "../../ui/numeralFormat";
import { MathJax, MathJaxContext } from "better-react-mathjax";

type IProps = {
  p: IPlayer;
  rerender: () => void;
};

export function RamButton(props: IProps): React.ReactElement {
  const homeComputer = props.p.getHomeComputer();
  if (homeComputer.maxRam >= CONSTANTS.HomeComputerMaxRam) {
    return <Button>Upgrade 'home' RAM - MAX</Button>;
  }

  const cost = props.p.getUpgradeHomeRamCost();

  function buy(): void {
    purchaseRamForHomeComputer(props.p);
    props.rerender();
  }

  return (
    <Tooltip
      title={
        <MathJaxContext>
          <MathJax>{`\\(\\large{cost = 3.2 \\cdot 10^3 \\cdot 1.58^{log_2{(ram)}}}\\)`}</MathJax>
        </MathJaxContext>
      }
    >
      <span>
        <Button disabled={!props.p.canAfford(cost)} onClick={buy}>
          Upgrade 'home' RAM ({numeralWrapper.formatRAM(homeComputer.maxRam)} -&gt;&nbsp;
          {numeralWrapper.formatRAM(homeComputer.maxRam * 2)}) -&nbsp;
          <Money money={cost} player={props.p} />
        </Button>
      </span>
    </Tooltip>
  );
}
