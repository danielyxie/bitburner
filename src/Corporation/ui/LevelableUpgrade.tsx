// React components for the levelable upgrade buttons on the overview panel
import React from "react";

import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { CorporationUpgrade } from "../data/CorporationUpgrades";
import { LevelUpgrade } from "../Actions";
import { MoneyCost } from "./MoneyCost";
import { use } from "../../ui/Context";
import { useCorporation } from "./Context";

interface IProps {
  upgrade: CorporationUpgrade;
  rerender: () => void;
}

export function LevelableUpgrade(props: IProps): React.ReactElement {
  const player = use.Player();
  const corp = useCorporation();
  const data = props.upgrade;
  const level = corp.upgrades[data[0]];

  const baseCost = data[1];
  const priceMult = data[2];
  const cost = baseCost * Math.pow(priceMult, level);

  const text = (
    <>
      {data[4]} - <MoneyCost money={cost} corp={corp} />
    </>
  );
  const tooltip = data[5];
  function onClick(): void {
    if (corp.funds.lt(cost)) return;
    try {
      LevelUpgrade(corp, props.upgrade);
    } catch (err) {
      dialogBoxCreate(err + "");
    }
    props.rerender();
  }

  return (
    <button className={"cmpy-mgmt-upgrade-div tooltip"} style={{ width: "45%" }} onClick={onClick}>
      {text}
      <span className={"tooltiptext"}>{tooltip}</span>
    </button>
  );
}
