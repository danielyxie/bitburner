import React from "react";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { Button } from "../../ui/React/Button";
import { PlayerOwnedSourceFile } from "../../SourceFile/PlayerOwnedSourceFile";
import { IPlayer } from "../../PersonObjects/IPlayer";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { saveObject } from "../../SaveObject";
import { IEngine } from "../../IEngine";

// Update as additional BitNodes get implemented
const validSFN = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const bigNumber = 1e27;

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
