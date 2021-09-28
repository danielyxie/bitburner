// React Components for the Unlock upgrade buttons on the overview page
import React from "react";

import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { CorporationUnlockUpgrade } from "../data/CorporationUnlockUpgrades";
import { useCorporation } from "./Context";
import { UnlockUpgrade as UU } from "../Actions";
import { MoneyCost } from "./MoneyCost";

interface IProps {
  upgradeData: CorporationUnlockUpgrade;
  rerender: () => void;
}

export function UnlockUpgrade(props: IProps): React.ReactElement {
  const corp = useCorporation();
  const data = props.upgradeData;
  const text = (
    <>
      {data[2]} - <MoneyCost money={data[1]} corp={corp} />
    </>
  );
  const tooltip = data[3];
  function onClick(): void {
    if (corp.funds.lt(data[1])) return;
    try {
      UU(corp, props.upgradeData);
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
