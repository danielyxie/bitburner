import React from "react";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { CONSTANTS } from "../../Constants";
import { Player } from "@player";
import { purchaseRamForHomeComputer } from "../../Server/ServerPurchases";

import { Money } from "../../ui/React/Money";
import { numeralWrapper } from "../../ui/numeralFormat";

import { MathJaxWrapper } from "../../MathJaxWrapper";
import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";

type IProps = {
  rerender: () => void;
};

export function RamButton(props: IProps): React.ReactElement {
  const homeComputer = Player.getHomeComputer();
  if (homeComputer.maxRam >= CONSTANTS.HomeComputerMaxRam) {
    return <Button>Upgrade 'home' RAM - MAX</Button>;
  }

  const cost = Player.getUpgradeHomeRamCost();

  function buy(): void {
    purchaseRamForHomeComputer();
    props.rerender();
  }

  const bnMult = BitNodeMultipliers.HomeComputerRamCost === 1 ? "" : `\\cdot ${BitNodeMultipliers.HomeComputerRamCost}`;

  return (
    <Tooltip
      title={
        <MathJaxWrapper>{`\\(\\large{cost = ram \\cdot 3.2 \\cdot 10^4 \\cdot 1.58^{log_2{(ram)}}} ${bnMult}\\)`}</MathJaxWrapper>
      }
    >
      <span>
        <br />
        <Typography>
          <i>"More RAM means more scripts on 'home'"</i>
        </Typography>
        <br />
        <Button disabled={!Player.canAfford(cost)} onClick={buy}>
          Upgrade 'home' RAM ({numeralWrapper.formatRAM(homeComputer.maxRam)} -&gt;&nbsp;
          {numeralWrapper.formatRAM(homeComputer.maxRam * 2)}) -&nbsp;
          <Money money={cost} forPurchase={true} />
        </Button>
      </span>
    </Tooltip>
  );
}
