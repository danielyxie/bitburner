/**
 * React Component for displaying a single Source-File as an accordion.
 *
 * The header of the accordion contains the Source-Files's name and level,
 * and the accordion's panel contains the Source-File's description.
 */
import React, { useState } from "react";

import { SourceFile } from "../../SourceFile/SourceFile";

import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Collapse from "@mui/material/Collapse";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ExpandLess from "@mui/icons-material/ExpandLess";

type IProps = {
  level: number;
  sf: SourceFile;
};

export function SourceFileAccordion(props: IProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  const maxLevel = props.sf.n === 12 ? "∞" : "3";

  return (
    <Box component={Paper}>
      <ListItemButton onClick={() => setOpen((old) => !old)}>
        <ListItemText
          primary={
            <Typography style={{ whiteSpace: "pre-wrap" }}>
              {props.sf.name}
              <br />
              {`Level ${props.level} / ${maxLevel}`}
            </Typography>
          }
        />
        {open ? <ExpandLess color="primary" /> : <ExpandMore color="primary" />}
      </ListItemButton>
      <Collapse in={open} unmountOnExit>
        <Box m={4}>
          <Typography>{props.sf.info}</Typography>
        </Box>
      </Collapse>
    </Box>
  );
}
