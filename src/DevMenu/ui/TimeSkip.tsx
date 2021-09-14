import React from "react";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import Button from "@material-ui/core/Button";
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
      saveObject.saveGame(props.engine.indexedDb);
      setTimeout(() => location.reload(), 1000);
    };
  }

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <h2>Sleeves</h2>
      </AccordionSummary>
      <AccordionDetails>
        <Button onClick={timeskip(60 * 1000)}>1 minute</Button>
        <Button onClick={timeskip(60 * 60 * 1000)}>1 hour</Button>
        <Button onClick={timeskip(24 * 60 * 60 * 1000)}>1 day</Button>
      </AccordionDetails>
    </Accordion>
  );
}
