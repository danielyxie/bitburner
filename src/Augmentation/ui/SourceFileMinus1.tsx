/**
 * React Component for displaying a list of the player's Source-Files
 * on the Augmentations UI
 */
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";

import { Exploit, ExploitName } from "../../Exploits/Exploit";
import { Player } from "../../Player";

export function SourceFileMinus1(): React.ReactElement {
  const [open, setOpen] = useState(false);
  const exploits = Player.exploits;

  if (exploits.length === 0) {
    return <></>;
  }

  return (
    <Box component={Paper}>
      <ListItemButton onClick={() => setOpen((old) => !old)}>
        <ListItemText
          primary={
            <Typography style={{ whiteSpace: "pre-wrap" }}>
              Source-File -1: Exploits in the BitNodes
              <br />
              Level {exploits.length} / {Object.keys(Exploit).length}
            </Typography>
          }
        />
        {open ? <ExpandLess color="primary" /> : <ExpandMore color="primary" />}
      </ListItemButton>
      <Collapse in={open} unmountOnExit>
        <Box m={4}>
          <Typography>
            This Source-File can only be acquired with obscure knowledge of the game, javascript, and the web ecosystem.
          </Typography>
          <Typography>It increases all of the player's multipliers by 0.1%</Typography>
          <br />

          <Typography>You have found the following exploits:</Typography>
          <Box mx={2}>
            {exploits.map((c: Exploit) => (
              <Typography key={c}>* {ExploitName(c)}</Typography>
            ))}
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
}
