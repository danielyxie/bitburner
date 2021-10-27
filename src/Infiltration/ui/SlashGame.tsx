import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { IMinigameProps } from "./IMinigameProps";
import { KeyHandler } from "./KeyHandler";
import { GameTimer } from "./GameTimer";
import { interpolate } from "./Difficulty";
import Typography from "@mui/material/Typography";

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
    if (event.keyCode !== 32) return;
    if (phase !== 2) {
      props.onFailure();
    } else {
      props.onSuccess();
    }
  }

  useEffect(() => {
    let id = window.setTimeout(() => {
      setPhase(1);
      id = window.setTimeout(() => {
        setPhase(2);
        id = window.setTimeout(() => setPhase(0), difficulty.window);
      }, 250);
    }, Math.random() * 3250 + 1500);
    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <Grid container spacing={3}>
      <GameTimer millis={5000} onExpire={props.onFailure} />
      <Grid item xs={12}>
        <Typography variant="h4">Slash when his guard is down!</Typography>
        {phase === 0 && <Typography variant="h4">Guarding ...</Typography>}
        {phase === 1 && <Typography variant="h4">Preparing?</Typography>}
        {phase === 2 && <Typography variant="h4">ATTACKING!</Typography>}
        <KeyHandler onKeyDown={press} onFailure={props.onFailure} />
      </Grid>
    </Grid>
  );
}
