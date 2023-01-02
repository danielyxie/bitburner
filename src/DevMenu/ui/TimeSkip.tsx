import React from "react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { saveObject } from "../../SaveObject";
import { IEngine } from "../../IEngine";

// Update as additional BitNodes get implemented

interface IProps {
  player: IPlayer;
  engine: IEngine;
}

export function TimeSkip(props: IProps): React.ReactElement {
  function timeskip(time: number) {
    return () => {
      props.player.lastUpdate -= time;
      props.engine._lastUpdate -= time;
      saveObject.saveGame();
      setTimeout(() => location.reload(), 1000);
    };
  }

  return (
    <Accordion TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Time skip</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Button onClick={timeskip(60 * 1000)}>1 minute</Button>
        <Button onClick={timeskip(60 * 60 * 1000)}>1 hour</Button>
        <Button onClick={timeskip(24 * 60 * 60 * 1000)}>1 day</Button>
      </AccordionDetails>
    </Accordion>
  );
}
