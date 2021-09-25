/**
 * React Component for displaying a single Augmentation as an accordion.
 *
 * The header of the accordion contains the Augmentation's name (and level, if
 * applicable), and the accordion's panel contains the Augmentation's description.
 */
import React, { useState } from "react";

import { Augmentation } from "../../Augmentation/Augmentation";
import { AugmentationNames } from "../../Augmentation/data/AugmentationNames";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Collapse from "@mui/material/Collapse";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ExpandLess from "@mui/icons-material/ExpandLess";

type IProps = {
  aug: Augmentation;
  level?: number | string | null;
};

export function AugmentationAccordion(props: IProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  let displayName = props.aug.name;
  if (props.level != null) {
    if (props.aug.name === AugmentationNames.NeuroFluxGovernor) {
      displayName += ` - Level ${props.level}`;
    }
  }

  if (typeof props.aug.info === "string") {
    return (
      <Box component={Paper}>
        <ListItemButton onClick={() => setOpen((old) => !old)}>
          <ListItemText primary={<Typography style={{ whiteSpace: "pre-wrap" }}>{displayName}</Typography>} />
          {open ? <ExpandLess color="primary" /> : <ExpandMore color="primary" />}
        </ListItemButton>
        <Collapse in={open} unmountOnExit>
          <Box m={4}>
            <Typography dangerouslySetInnerHTML={{ __html: props.aug.info }} />
            {props.aug.stats && (
              <>
                <br />
                <br />
                <Typography>{props.aug.stats}</Typography>
              </>
            )}
          </Box>
        </Collapse>
      </Box>
    );
  }

  return (
    <Box component={Paper}>
      <ListItemButton onClick={() => setOpen((old) => !old)}>
        <ListItemText primary={<Typography style={{ whiteSpace: "pre-wrap" }}>{displayName}</Typography>} />
        {open ? <ExpandLess color="primary" /> : <ExpandMore color="primary" />}
      </ListItemButton>
      <Collapse in={open} unmountOnExit>
        <Box m={4}>
          <Typography>
            {props.aug.info}
            {props.aug.stats && (
              <>
                <br />
                <br />
                {props.aug.stats}
              </>
            )}
          </Typography>
        </Box>
      </Collapse>
    </Box>
  );
}
