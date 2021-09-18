import React, { useState } from "react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Select, { SelectChangeEvent } from "@mui/material/Select";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { AugmentationNames } from "../../Augmentation/data/AugmentationNames";
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
    for (const i in AugmentationNames) {
      const augName = AugmentationNames[i];
      props.player.queueAugmentation(augName);
    }
  }

  function clearAugs(): void {
    props.player.augmentations = [];
  }

  return (
    <Accordion TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <h2>Augmentations</h2>
      </AccordionSummary>
      <AccordionDetails>
        <table>
          <tbody>
            <tr>
              <td>
                <span className="text">Aug:</span>
              </td>
              <td>
                <Select
                  id="dev-augs-dropdown"
                  className="dropdown"
                  onChange={setAugmentationDropdown}
                  value={augmentation}
                  startAdornment={
                    <>
                      <IconButton color="primary" onClick={queueAllAugs} size="large">
                        <ReplyAllIcon />
                      </IconButton>
                      <IconButton color="primary" onClick={queueAug} size="large">
                        <ReplyIcon />
                      </IconButton>
                    </>
                  }
                  endAdornment={
                    <>
                      <IconButton color="primary" onClick={clearAugs} size="large">
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
