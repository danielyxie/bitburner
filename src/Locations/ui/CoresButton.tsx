import React from "react";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";

import { IPlayer } from "../../PersonObjects/IPlayer";

import { Money } from "../../ui/React/Money";
import { MathComponent } from "mathjax-react";

type IProps = {
  p: IPlayer;
  rerender: () => void;
};

export function CoresButton(props: IProps): React.ReactElement {
  const homeComputer = props.p.getHomeComputer();
  const maxCores = homeComputer.cpuCores >= 8;
  if (maxCores) {
    return <Button>Upgrade 'home' cores - MAX</Button>;
  }

  const cost = 1e9 * Math.pow(7.5, homeComputer.cpuCores);

  function buy(): void {
    if (maxCores) return;
    if (!props.p.canAfford(cost)) return;
    props.p.loseMoney(cost);
    homeComputer.cpuCores++;
    props.rerender();
  }

  return (
    <Tooltip title={<MathComponent tex={String.raw`\large{cost = 10^9 \times 7.5 ^{\text{cores}}}`} />}>
      <span>
        <Button disabled={!props.p.canAfford(cost)} onClick={buy}>
          Upgrade 'home' cores ({homeComputer.cpuCores} -&gt; {homeComputer.cpuCores + 1}) -&nbsp;
          <Money money={cost} player={props.p} />
        </Button>
      </span>
    </Tooltip>
  );
}
