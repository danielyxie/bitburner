import React from "react";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";

import { IPlayer } from "../../PersonObjects/IPlayer";

import { Money } from "../../ui/React/Money";
import { MathJax, MathJaxContext } from "better-react-mathjax";

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

  const cost = props.p.getUpgradeHomeCoresCost();

  function buy(): void {
    if (maxCores) return;
    if (!props.p.canAfford(cost)) return;
    props.p.loseMoney(cost);
    homeComputer.cpuCores++;
    props.rerender();
  }

  return (
    <Tooltip
      title={
        <MathJaxContext>
          <MathJax>{`\\(\\large{cost = 10^9 \\cdot 7.5 ^{\\text{cores}}}\\)`}</MathJax>
        </MathJaxContext>
      }
    >
      <span>
        <Button disabled={!props.p.canAfford(cost)} onClick={buy}>
          Upgrade 'home' cores ({homeComputer.cpuCores} -&gt; {homeComputer.cpuCores + 1}) -&nbsp;
          <Money money={cost} player={props.p} />
        </Button>
      </span>
    </Tooltip>
  );
}
