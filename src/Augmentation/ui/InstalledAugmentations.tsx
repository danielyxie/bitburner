/**
 * React Component for displaying all of the player's installed Augmentations and
 * Source-Files.
 *
 * It also contains 'configuration' buttons that allow you to change how the
 * Augs/SF's are displayed
 */
import { Box, ListItemButton, Paper, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Tooltip from "@mui/material/Tooltip";
import React, { useState } from "react";
import { OwnedAugmentationsOrderSetting } from "../../Settings/SettingEnums";
import { Settings } from "../../Settings/Settings";
import { use } from "../../ui/Context";
import { StaticAugmentations } from "../StaticAugmentations";
import { AugmentationNames } from "../data/AugmentationNames";

export function InstalledAugmentations(): React.ReactElement {
  const setRerender = useState(true)[1];
  const player = use.Player();
  const sourceAugs = player.augmentations.slice().filter((aug) => aug.name !== AugmentationNames.NeuroFluxGovernor);

  const [selectedAug, setSelectedAug] = useState(sourceAugs[0]);

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
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ p: 1 }}>
        <Typography variant="h5">Installed Augmentations</Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          <Tooltip title={"Sorts the Augmentations alphabetically in numeral order"}>
            <Button sx={{ width: "100%" }} onClick={sortInOrder}>
              Sort in Order
            </Button>
          </Tooltip>
          <Tooltip title={"Sorts the Augmentations based on when you acquired them (same as default)"}>
            <Button sx={{ width: "100%" }} onClick={sortByAcquirementTime}>
              Sort by Time of Acquirement
            </Button>
          </Tooltip>
        </Box>
      </Paper>
      {sourceAugs.length > 0 ? (
        <Paper sx={{ display: "grid", gridTemplateColumns: "1fr 3fr" }}>
          <Box>
            <List sx={{ height: 400, overflowY: "scroll", borderRight: `1px solid ${Settings.theme.welllight}` }}>
              {sourceAugs.map((k, i) => (
                <ListItemButton key={i + 1} onClick={() => setSelectedAug(k)} selected={selectedAug === k}>
                  <Typography>{k.name}</Typography>
                </ListItemButton>
              ))}
            </List>
          </Box>
          <Box sx={{ m: 1 }}>
            <Typography variant="h6" sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
              {selectedAug.name}
            </Typography>
            <Typography sx={{ maxHeight: 350, overflowY: "scroll" }}>
              {(() => {
                const aug = StaticAugmentations[selectedAug.name];

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
          </Box>
        </Paper>
      ) : (
        <Paper sx={{ p: 1 }}>
          <Typography>No Augmentations have been installed yet</Typography>
        </Paper>
      )}
    </Box>
  );
}
