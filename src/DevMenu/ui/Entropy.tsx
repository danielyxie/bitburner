import React from "react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Typography from "@mui/material/Typography";
import { Player } from "../../Player";
import { Adjuster } from "./Adjuster";

// Update as additional BitNodes get implemented

export function Entropy(): React.ReactElement {
  return (
    <Accordion TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Entropy</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Adjuster
          label="Set entropy"
          placeholder="entropy"
          add={(num) => {
            Player.entropy += num;
            Player.applyEntropy(Player.entropy);
          }}
          subtract={(num) => {
            Player.entropy -= num;
            Player.applyEntropy(Player.entropy);
          }}
          tons={() => {
            Player.entropy += 1e12;
            Player.applyEntropy(Player.entropy);
          }}
          reset={() => {
            Player.entropy = 0;
            Player.applyEntropy(Player.entropy);
          }}
        />
      </AccordionDetails>
    </Accordion>
  );
}
