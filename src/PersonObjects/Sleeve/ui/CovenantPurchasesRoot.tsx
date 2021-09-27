/**
 * Root React component for the popup that lets player purchase Duplicate
 * Sleeves and Sleeve-related upgrades from The Covenant
 */
import React, { useState } from "react";

import { CovenantSleeveMemoryUpgrade } from "./CovenantSleeveMemoryUpgrade";

import { Sleeve } from "../Sleeve";
import { BaseCostPerSleeve, MaxSleevesFromCovenant } from "../SleeveCovenantPurchases";

import { Money } from "../../../ui/React/Money";
import { Modal } from "../../../ui/React/Modal";
import { use } from "../../../ui/Context";

import { dialogBoxCreate } from "../../../ui/React/DialogBox";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

interface IProps {
  open: boolean;
  onClose: () => void;
}

export function CovenantPurchasesRoot(props: IProps): React.ReactElement {
  const player = use.Player();
  const [update, setUpdate] = useState(0);

  /**
   * Get the cost to purchase a new Duplicate Sleeve
   */
  function purchaseCost(): number {
    return (player.sleevesFromCovenant + 1) * BaseCostPerSleeve;
  }

  /**
   * Force a rerender by just changing an arbitrary state value
   */
  function rerender(): void {
    setUpdate(update + 1);
  }

  // Purchasing a new Duplicate Sleeve
  let purchaseDisabled = false;
  if (!player.canAfford(purchaseCost())) {
    purchaseDisabled = true;
  }
  if (player.sleevesFromCovenant >= MaxSleevesFromCovenant) {
    purchaseDisabled = true;
  }

  function purchaseOnClick(): void {
    if (player.sleevesFromCovenant >= MaxSleevesFromCovenant) return;

    if (player.canAfford(purchaseCost())) {
      player.loseMoney(purchaseCost());
      player.sleevesFromCovenant += 1;
      player.sleeves.push(new Sleeve(player));
      rerender();
    } else {
      dialogBoxCreate(`You cannot afford to purchase a Duplicate Sleeve`, false);
    }
  }

  // Purchasing Upgrades for Sleeves
  const upgradePanels = [];
  for (let i = 0; i < player.sleeves.length; ++i) {
    const sleeve = player.sleeves[i];
    upgradePanels.push(<CovenantSleeveMemoryUpgrade index={i} p={player} rerender={rerender} sleeve={sleeve} />);
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <>
        {player.sleevesFromCovenant < MaxSleevesFromCovenant && (
          <>
            <Typography>
              Purchase an additional Sleeves. These Duplicate Sleeves are permanent (they persist through BitNodes). You
              can purchase a total of {MaxSleevesFromCovenant} from The Covenant.
            </Typography>
            <Button disabled={purchaseDisabled} onClick={purchaseOnClick}>
              Purchase -&nbsp;
              <Money money={purchaseCost()} player={player} />
            </Button>
          </>
        )}
        <br />
        <br />
        <Typography>You can also purchase upgrades for your Sleeves. These upgrades are also permanent.</Typography>
        {upgradePanels}
      </>
    </Modal>
  );
}
