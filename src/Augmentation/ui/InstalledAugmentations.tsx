/**
 * React Component for displaying all of the player's installed Augmentations and
 * Source-Files.
 *
 * It also contains 'configuration' buttons that allow you to change how the
 * Augs/SF's are displayed
 */
import React, { useState } from "react";

import { AugmentationAccordion } from "../../ui/React/AugmentationAccordion";
import { Augmentations } from "../Augmentations";
import { AugmentationNames } from "../data/AugmentationNames";

import { Settings } from "../../Settings/Settings";
import { use } from "../../ui/Context";
import { OwnedAugmentationsOrderSetting } from "../../Settings/SettingEnums";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import List from "@mui/material/List";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Box, Paper, ListItemButton, ListItemText, Typography, Collapse } from "@mui/material";
import { CONSTANTS } from "../../Constants";
import { formatNumber } from "../../utils/StringHelperFunctions";

export function InstalledAugmentations(): React.ReactElement {
  const setRerender = useState(true)[1];
  const player = use.Player();

  const sourceAugs = player.augmentations.slice();

  if (Settings.OwnedAugmentationsOrder === OwnedAugmentationsOrderSetting.Alphabetically) {
    sourceAugs.sort((aug1, aug2) => {
      return aug1.name.localeCompare(aug2.name);
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
        {player.entropy > 0 &&
          (() => {
            const [open, setOpen] = useState(false);

            return (
              <Box component={Paper}>
                <ListItemButton onClick={() => setOpen((old) => !old)}>
                  <ListItemText
                    primary={
                      <Typography color={Settings.theme.hp} style={{ whiteSpace: "pre-wrap" }}>
                        Entropy virus - Level {player.entropy}
                      </Typography>
                    }
                  />
                  {open ? (
                    <ExpandLess sx={{ color: Settings.theme.hp }} />
                  ) : (
                    <ExpandMore sx={{ color: Settings.theme.hp }} />
                  )}
                </ListItemButton>
                <Collapse in={open} unmountOnExit>
                  <Box m={4}>
                    <Typography color={Settings.theme.hp}>
                      <b>All multipliers decreased by:</b>{" "}
                      {formatNumber((1 - CONSTANTS.EntropyEffect ** player.entropy) * 100, 3)}% (multiplicative)
                    </Typography>
                  </Box>
                </Collapse>
              </Box>
            );
          })()}

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
