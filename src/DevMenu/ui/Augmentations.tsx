import React, { useState } from "react";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import Select from "@material-ui/core/Select";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { AugmentationNames } from "../../Augmentation/data/AugmentationNames";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import ReplyAllIcon from "@material-ui/icons/ReplyAll";
import ReplyIcon from "@material-ui/icons/Reply";
import ClearIcon from "@material-ui/icons/Clear";

interface IProps {
  player: IPlayer;
}

export function Augmentations(props: IProps): React.ReactElement {
  const [augmentation, setAugmentation] = useState("Augmented Targeting I");

  function setAugmentationDropdown(event: React.ChangeEvent<{ value: unknown }>): void {
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
    <Accordion>
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
                      <IconButton color="primary" onClick={queueAllAugs}>
                        <ReplyAllIcon />
                      </IconButton>
                      <IconButton color="primary" onClick={queueAug}>
                        <ReplyIcon />
                      </IconButton>
                    </>
                  }
                  endAdornment={
                    <>
                      <IconButton color="primary" onClick={clearAugs}>
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
