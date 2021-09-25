/**
 * React Component for displaying all of the player's installed Augmentations and
 * Source-Files.
 *
 * It also contains 'configuration' buttons that allow you to change how the
 * Augs/SF's are displayed
 */
import React, { useState } from "react";

import { AugmentationAccordion } from "../../ui/React/AugmentationAccordion";
import { Augmentations } from "../../Augmentation/Augmentations";
import { AugmentationNames } from "../../Augmentation/data/AugmentationNames";

import { Settings } from "../../Settings/Settings";
import { use } from "../../ui/Context";
import { OwnedAugmentationsOrderSetting } from "../../Settings/SettingEnums";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import List from "@mui/material/List";

export function InstalledAugmentations(): React.ReactElement {
  const setRerender = useState(true)[1];
  const player = use.Player();

  const sourceAugs = player.augmentations.slice();

  if (Settings.OwnedAugmentationsOrder === OwnedAugmentationsOrderSetting.Alphabetically) {
    sourceAugs.sort((aug1, aug2) => {
      return aug1.name <= aug2.name ? -1 : 1;
    });
  }

  function rerender(): void {
    setRerender((old) => !old);
  }

  function sortByAcquirementTime(): void {
    Settings.OwnedAugmentationsOrder = OwnedAugmentationsOrderSetting.AcquirementTime;
    rerender();
  }

  function sortInOrder(): void {
    Settings.OwnedAugmentationsOrder = OwnedAugmentationsOrderSetting.Alphabetically;
    rerender();
  }

  return (
    <>
      <Tooltip title={"Sorts the Augmentations alphabetically in numeral order"}>
        <Button onClick={sortInOrder}>Sort in Order</Button>
      </Tooltip>
      <Tooltip title={"Sorts the Augmentations based on when you acquired them (same as default)"}>
        <Button sx={{ mx: 2 }} onClick={sortByAcquirementTime}>
          Sort by Acquirement Time
        </Button>
      </Tooltip>
      <List dense>
        {sourceAugs.map((e) => {
          const aug = Augmentations[e.name];

          let level = null;
          if (e.name === AugmentationNames.NeuroFluxGovernor) {
            level = e.level;
          }

          return <AugmentationAccordion key={aug.name} aug={aug} level={level} />;
        })}
      </List>
    </>
  );
}
