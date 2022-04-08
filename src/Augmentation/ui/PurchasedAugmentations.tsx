/**
 * React component for displaying all of the player's purchased (but not installed)
 * Augmentations on the Augmentations UI.
 */
import * as React from "react";

import { Augmentations } from "../Augmentations";
import { AugmentationNames } from "../data/AugmentationNames";
import { Player } from "../../Player";

import { List, Paper, ListItemText, ListItem, Tooltip, Typography } from "@mui/material";

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
    let displayName = ownedAug.name;

    if (ownedAug.name === AugmentationNames.NeuroFluxGovernor && i !== nfgIndex) continue;
    const aug = Augmentations[ownedAug.name];

    let level = null;
    if (ownedAug.name === AugmentationNames.NeuroFluxGovernor) {
      level = ownedAug.level;
      displayName += ` - Level ${level}`;
    }

    augs.push(
      <Tooltip
        title={
          <Typography>
            {(() => {
              const info = typeof aug.info === "string" ? <span>{aug.info}</span> : aug.info;
              const tooltip = (
                <>
                  {info}
                  <br />
                  <br />
                  {aug.stats}
                </>
              );
              return tooltip;
            })()}
          </Typography>
        }
        enterNextDelay={1000}
        key={displayName}
      >
        <ListItem sx={{ py: 0 }}>
          <ListItemText primary={displayName} />
        </ListItem>
      </Tooltip>,
    );
  }

  return (
    <Paper sx={{ p: 1, maxHeight: 400, overflowY: "scroll" }}>
      <List sx={{ height: 400, overflowY: "scroll" }} disablePadding>
        {augs}
      </List>
    </Paper>
  );
}
