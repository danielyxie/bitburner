// React components for the levelable upgrade buttons on the overview panel
import React from "react";

import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { ICorporation } from "../ICorporation";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { CorporationUpgrade } from "../data/CorporationUpgrades";
import { LevelUpgrade } from "../Actions";
import { MoneyCost } from "./MoneyCost";

interface IProps {
  upgrade: CorporationUpgrade;
  corp: ICorporation;
  player: IPlayer;
  rerender: () => void;
}

export function LevelableUpgrade(props: IProps): React.ReactElement {
  const data = props.upgrade;
  const level = props.corp.upgrades[data[0]];

  const baseCost = data[1];
  const priceMult = data[2];
  const cost = baseCost * Math.pow(priceMult, level);

  const text = (
    <>
      {data[4]} - <MoneyCost money={cost} corp={props.corp} />
    </>
  );
  const tooltip = data[5];
  function onClick(): void {
    if (props.corp.funds.lt(cost)) return;
    try {
      LevelUpgrade(props.corp, props.upgrade);
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
