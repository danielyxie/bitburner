import React, { useState } from "react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Select, { SelectChangeEvent } from "@mui/material/Select";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { AugmentationNames } from "../../Augmentation/data/AugmentationNames";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import ReplyAllIcon from "@mui/icons-material/ReplyAll";
import ReplyIcon from "@mui/icons-material/Reply";
import ClearIcon from "@mui/icons-material/Clear";

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

  return (
    <Accordion TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Augmentations</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <table>
          <tbody>
            <tr>
              <td>
                <Typography>Aug:</Typography>
              </td>
              <td>
                <Select
                  onChange={setAugmentationDropdown}
                  value={augmentation}
                  startAdornment={
                    <>
                      <IconButton onClick={queueAllAugs} size="large">
                        <ReplyAllIcon />
                      </IconButton>
                      <IconButton onClick={queueAug} size="large">
                        <ReplyIcon />
                      </IconButton>
                    </>
                  }
                  endAdornment={
                    <>
                      <IconButton onClick={clearAugs} size="large">
                        <ClearIcon />
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
              </td>
            </tr>
          </tbody>
        </table>
      </AccordionDetails>
    </Accordion>
  );
}
