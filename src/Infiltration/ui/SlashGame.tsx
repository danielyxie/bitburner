import React, { useState, useEffect } from "react";
import { IMinigameProps } from "./IMinigameProps";
import { KeyHandler } from "./KeyHandler";
import { GameTimer } from "./GameTimer";
import { interpolate } from "./Difficulty";
import { KEY } from "../../utils/helpers/keyCodes";
import { Player } from "../../Player";
import { AugmentationNames } from "../../Augmentation/data/AugmentationNames";
import { Paper, Typography, Box } from "@mui/material";

interface Difficulty {
  [key: string]: number;
  window: number;
}

const difficulties: {
  Trivial: Difficulty;
  Normal: Difficulty;
  Hard: Difficulty;
  Impossible: Difficulty;
} = {
  Trivial: { window: 600 },
  Normal: { window: 325 },
  Hard: { window: 250 },
  Impossible: { window: 150 },
};

export function SlashGame(props: IMinigameProps): React.ReactElement {
  const difficulty: Difficulty = { window: 0 };
  interpolate(difficulties, props.difficulty, difficulty);
  const [phase, setPhase] = useState(0);

  function press(this: Document, event: KeyboardEvent): void {
    event.preventDefault();
    if (event.key !== KEY.SPACE) return;
    if (phase !== 2) {
      props.onFailure();
    } else {
      props.onSuccess();
    }
  }
  const hasAugment = Player.hasAugmentation(AugmentationNames.MightOfAres, true);
  const phaseZeroTime = Math.random() * 3250 + 1500 - (250 + difficulty.window);
  const phaseOneTime = 250;
  const timeUntilAttacking = phaseZeroTime + phaseOneTime;

  useEffect(() => {
    let id = window.setTimeout(() => {
      setPhase(1);
      id = window.setTimeout(() => {
        setPhase(2);
        id = window.setTimeout(() => setPhase(0), difficulty.window);
      }, phaseOneTime);
    }, phaseZeroTime);
    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <>
      <GameTimer millis={5000} onExpire={props.onFailure} />
      <Paper sx={{ display: "grid", justifyItems: "center" }}>
        <Typography variant="h4">Slash when his guard is down!</Typography>

        {hasAugment ? (
          <Box sx={{ my: 1 }}>
            <Typography variant="h5">Guard will drop in...</Typography>
            <GameTimer millis={timeUntilAttacking} onExpire={props.onFailure} noPaper />
          </Box>
        ) : (
          <></>
        )}

        {phase === 0 && <Typography variant="h4">Guarding ...</Typography>}
        {phase === 1 && <Typography variant="h4">Preparing?</Typography>}
        {phase === 2 && <Typography variant="h4">ATTACKING!</Typography>}
        <KeyHandler onKeyDown={press} onFailure={props.onFailure} />
      </Paper>
    </>
  );
}
