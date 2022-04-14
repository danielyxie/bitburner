import { Clear, ExpandMore, Reply, ReplyAll } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import React, { useState } from "react";

import { AugmentationNames } from "../../Augmentation/data/AugmentationNames";
import type { IPlayer } from "../../PersonObjects/IPlayer";

interface IProps {
  player: IPlayer;
}

export function Augmentations(props: IProps): React.ReactElement {
  const [augmentation, setAugmentation] = useState("Augmented Targeting I");

  function setAugmentationDropdown(event: SelectChangeEvent<string>): void {
    setAugmentation(event.target.value as string);
  }
  function queueAug(): void {
    props.player.queueAugmentation(augmentation);
  }

  function queueAllAugs(): void {
    for (const augName of Object.values(AugmentationNames)) {
      props.player.queueAugmentation(augName);
    }
  }

  function clearAugs(): void {
    props.player.augmentations = [];
  }

  function clearQueuedAugs(): void {
    props.player.queuedAugmentations = [];
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
