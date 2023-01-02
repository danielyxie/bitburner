import React from "react";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { Player } from "@player";

import { Money } from "../../ui/React/Money";
import { MathJaxWrapper } from "../../MathJaxWrapper";

type IProps = {
  rerender: () => void;
};

export function CoresButton(props: IProps): React.ReactElement {
  const homeComputer = Player.getHomeComputer();
  const maxCores = homeComputer.cpuCores >= 8;
  if (maxCores) {
    return <Button>Upgrade 'home' cores - MAX</Button>;
  }

  const cost = Player.getUpgradeHomeCoresCost();

  function buy(): void {
    if (maxCores) return;
    if (!Player.canAfford(cost)) return;
    Player.loseMoney(cost, "servers");
    homeComputer.cpuCores++;
    props.rerender();
  }

  return (
    <Tooltip title={<MathJaxWrapper>{`\\(\\large{cost = 10^9 \\cdot 7.5 ^{\\text{cores}}}\\)`}</MathJaxWrapper>}>
      <span>
        <br />
        <Typography>
          <i>"Cores increase the effectiveness of grow() and weaken() on 'home'"</i>
        </Typography>
        <br />
        <Button disabled={!Player.canAfford(cost)} onClick={buy}>
          Upgrade 'home' cores ({homeComputer.cpuCores} -&gt; {homeComputer.cpuCores + 1}) -&nbsp;
          <Money money={cost} forPurchase={true} />
        </Button>
      </span>
    </Tooltip>
  );
}
