import React, { useState } from "react";

import { purchaseHashUpgrade } from "../HacknetHelpers";
import { HashManager } from "../HashManager";
import { HashUpgrade } from "../HashUpgrade";

import { IPlayer } from "../../PersonObjects/IPlayer";

import { ServerDropdown, ServerType } from "../../ui/React/ServerDropdown";

import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { CopyableText } from "../../ui/React/CopyableText";
import { Hashes } from "../../ui/React/Hashes";

import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { SelectChangeEvent } from "@mui/material/Select";

interface IProps {
  player: IPlayer;
  hashManager: HashManager;
  upg: HashUpgrade;
  rerender: () => void;
}

export function HacknetUpgradeElem(props: IProps): React.ReactElement {
  const [selectedServer, setSelectedServer] = useState("ecorp");
  function changeTargetServer(event: SelectChangeEvent<string>): void {
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

  // We'll reuse a Bladeburner css class
  return (
    <Paper sx={{ p: 1 }}>
      <Typography>
        <CopyableText value={upg.name} />
      </Typography>
      <Typography>
        Cost: {Hashes(cost)}, Bought: {level} times
      </Typography>

      <Typography>{upg.desc}</Typography>
      <Button onClick={purchase} disabled={!canPurchase}>
        Purchase
      </Button>
      {level > 0 && effect && <Typography>{effect}</Typography>}
      {upg.hasTargetServer && (
        <ServerDropdown value={selectedServer} serverType={ServerType.Foreign} onChange={changeTargetServer} />
      )}
    </Paper>
  );
}
