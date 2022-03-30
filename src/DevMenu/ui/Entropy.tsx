import React from "react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Typography from "@mui/material/Typography";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { Adjuster } from "./Adjuster";
import { IEngine } from "../../IEngine";

// Update as additional BitNodes get implemented

interface IProps {
  player: IPlayer;
  engine: IEngine;
}

export function Entropy(props: IProps): React.ReactElement {
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
            props.player.entropy += num;
            props.player.applyEntropy(props.player.entropy);
          }}
          subtract={(num) => {
            props.player.entropy -= num;
            props.player.applyEntropy(props.player.entropy);
          }}
          tons={() => {
            props.player.entropy += 1e12;
            props.player.applyEntropy(props.player.entropy);
          }}
          reset={() => {
            props.player.entropy = 0;
            props.player.applyEntropy(props.player.entropy);
          }}
        />
      </AccordionDetails>
    </Accordion>
  );
}
