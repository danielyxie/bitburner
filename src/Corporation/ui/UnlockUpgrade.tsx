// React Components for the Unlock upgrade buttons on the overview page
import React from "react";

import { numeralWrapper } from "../../ui/numeralFormat";
import { dialogBoxCreate } from "../../../utils/DialogBox";
import { CorporationUnlockUpgrade } from "../data/CorporationUnlockUpgrades";
import { ICorporation } from "../ICorporation";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { UnlockUpgrade as UU } from "../Actions";
import { Money } from "../../ui/React/Money";

interface IProps {
  upgradeData: CorporationUnlockUpgrade;
  corp: ICorporation;
  player: IPlayer;
}

export function UnlockUpgrade(props: IProps): React.ReactElement {
  const data = props.upgradeData;
  const text = (
    <>
      {data[2]} - <Money money={data[1]} />
    </>
  );
  const tooltip = data[3];
  function onClick(): void {
    try {
      UU(props.corp, props.upgradeData);
    } catch (err) {
      dialogBoxCreate(err + "");
    }
    props.corp.rerender(props.player);
  }

  return (
    <div
      className={"cmpy-mgmt-upgrade-div tooltip"}
      style={{ width: "45%" }}
      onClick={onClick}
    >
      {text}
      <span className={"tooltiptext"}>{tooltip}</span>
    </div>
  );
}
