import React, { useState } from "react";

import { purchaseHashUpgrade } from "../HacknetHelpers";
import { HashManager } from "../HashManager";
import { HashUpgrade } from "../HashUpgrade";

import { IPlayer } from "../../PersonObjects/IPlayer";

import { ServerDropdown, ServerType } from "../../ui/React/ServerDropdown";

import { dialogBoxCreate } from "../../../utils/DialogBox";
import { CopyableText } from "../../ui/React/CopyableText";
import { Hashes } from "../../ui/React/Hashes";

interface IProps {
  player: IPlayer;
  hashManager: HashManager;
  upg: HashUpgrade;
  rerender: () => void;
}

export function HacknetUpgradeElem(props: IProps): React.ReactElement {
  const [selectedServer, setSelectedServer] = useState("ecorp");
  function changeTargetServer(event: React.ChangeEvent<HTMLSelectElement>): void {
    setSelectedServer(event.target.value);
  }

  function purchase(): void {
    const canPurchase = props.hashManager.hashes >= props.hashManager.getUpgradeCost(props.upg.name);
    if (canPurchase) {
      const res = purchaseHashUpgrade(props.player, props.upg.name, selectedServer);
      if (!res) {
        dialogBoxCreate(
          "Failed to purchase upgrade. This may be because you do not have enough hashes, " +
            "or because you do not have access to the feature upgrade affects.",
        );
      }
      props.rerender();
    }
  }

  const hashManager = props.hashManager;
  const upg = props.upg;
  const cost = hashManager.getUpgradeCost(upg.name);
  const level = hashManager.upgrades[upg.name];
  const effect = upg.effectText(level);

  // Purchase button
  const canPurchase = hashManager.hashes >= cost;
  const btnClass = canPurchase ? "std-button" : "std-button-disabled";

  // We'll reuse a Bladeburner css class
  return (
    <div className={"bladeburner-action"}>
      <CopyableText value={upg.name} />
      <p>
        Cost: {Hashes(cost)}, Bought: {level} times
      </p>

      <p>{upg.desc}</p>
      <button className={btnClass} onClick={purchase}>
        Purchase
      </button>
      {level > 0 && effect && <p>{effect}</p>}
      {upg.hasTargetServer && (
        <ServerDropdown serverType={ServerType.Foreign} onChange={changeTargetServer} style={{ margin: "5px" }} />
      )}
    </div>
  );
}
