/**
 * React component for displaying all of the player's purchased (but not installed)
 * Augmentations on the Augmentations UI.
 */
import * as React from "react";

import { Augmentations } from "../../Augmentation/Augmentations";
import { AugmentationNames } from "../../Augmentation/data/AugmentationNames";
import { Player } from "../../Player";

import { AugmentationAccordion } from "../../ui/React/AugmentationAccordion";
import List from "@mui/material/List";

export function PurchasedAugmentations(): React.ReactElement {
  const augs: React.ReactElement[] = [];
  // Only render the last NeuroFlux (there are no findLastIndex btw)
  let nfgIndex = -1;
  for (let i = Player.queuedAugmentations.length - 1; i >= 0; i--) {
    if (Player.queuedAugmentations[i].name === AugmentationNames.NeuroFluxGovernor) {
      nfgIndex = i;
      break;
    }
  }
  for (let i = 0; i < Player.queuedAugmentations.length; i++) {
    const ownedAug = Player.queuedAugmentations[i];
    if (ownedAug.name === AugmentationNames.NeuroFluxGovernor && i !== nfgIndex) continue;
    const aug = Augmentations[ownedAug.name];
    let level = null;
    if (ownedAug.name === AugmentationNames.NeuroFluxGovernor) {
      level = ownedAug.level;
    }
    augs.push(<AugmentationAccordion key={aug.name} aug={aug} level={level} />);
  }

  return <List dense>{augs}</List>;
}
