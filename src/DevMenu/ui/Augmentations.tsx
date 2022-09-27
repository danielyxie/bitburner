import { Clear, ExpandMore, Reply, ReplyAll } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { AugmentationNames } from "../../Augmentation/data/AugmentationNames";
import { Player } from "../../Player";

export function Augmentations(): React.ReactElement {
  const [augmentation, setAugmentation] = useState("Augmented Targeting I");

  function setAugmentationDropdown(event: SelectChangeEvent<string>): void {
    setAugmentation(event.target.value);
  }
  function queueAug(): void {
    Player.queueAugmentation(augmentation);
  }

  function queueAllAugs(): void {
    for (const augName of Object.values(AugmentationNames)) {
      Player.queueAugmentation(augName);
    }
  }

  function clearAugs(): void {
    Player.augmentations = [];
  }

  function clearQueuedAugs(): void {
    Player.queuedAugmentations = [];
  }

  return (
    <Accordion TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>Augmentations</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Select
          onChange={setAugmentationDropdown}
          value={augmentation}
          startAdornment={
            <>
              <IconButton onClick={queueAllAugs} size="large">
                <ReplyAll />
              </IconButton>
              <IconButton onClick={queueAug} size="large">
                <Reply />
              </IconButton>
            </>
          }
          endAdornment={
            <>
              <IconButton onClick={clearAugs} size="large">
                <Clear />
              </IconButton>
            </>
          }
        >
          {Object.values(AugmentationNames).map((aug) => (
            <MenuItem key={aug} value={aug}>
              {aug}
            </MenuItem>
          ))}
        </Select>
        <Button sx={{ display: "block" }} onClick={clearQueuedAugs}>
          Clear Queued Augmentations
        </Button>
      </AccordionDetails>
    </Accordion>
  );
}
