/**
 * React Subcomponent for displaying a location's UI, when that location is a gym
 *
 * This subcomponent renders all of the buttons for training at the gym
 */
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";

import type { IPlayer } from "../PersonObjects/IPlayer";

import { reachedLimit, win } from "./Game";
import { BadRNG } from "./RNG";
import { trusted } from "./utils";

type IProps = {
  p: IPlayer;
};

const minPlay = 0;
const maxPlay = 10e3;

export function CoinFlip(props: IProps): React.ReactElement {
  const [investment, setInvestment] = useState(1000);
  const [result, setResult] = useState(<span> </span>);
  const [status, setStatus] = useState("");
  const [playLock, setPlayLock] = useState(false);

  function updateInvestment(e: React.ChangeEvent<HTMLInputElement>): void {
    let investment: number = parseInt(e.currentTarget.value);
    if (isNaN(investment)) {
      investment = minPlay;
    }
    if (investment > maxPlay) {
      investment = maxPlay;
    }
    if (investment < minPlay) {
      investment = minPlay;
    }
    setInvestment(investment);
  }

  function play(guess: string): void {
    if (reachedLimit(props.p)) return;
    const v = BadRNG.random();
    let letter: string;
    if (v < 0.5) {
      letter = "H";
    } else {
      letter = "T";
    }
    const correct: boolean = guess === letter;

    setResult(
      <Box display="flex">
        <Typography sx={{ lineHeight: "1em", whiteSpace: "pre" }} color={correct ? "primary" : "error"}>
          {letter}
        </Typography>
      </Box>,
    );
    setStatus(correct ? " win!" : "lose!");
    setPlayLock(true);

    setTimeout(() => setPlayLock(false), 250);
    if (correct) {
      win(props.p, investment);
    } else {
      win(props.p, -investment);
    }
    if (reachedLimit(props.p)) return;
  }

  return (
    <>
      <Typography>Result:</Typography> {result}
      <Box display="flex" alignItems="center">
        <TextField
          type="number"
          onChange={updateInvestment}
          InputProps={{
            endAdornment: (
              <>
                <Button onClick={trusted(() => play("H"))} disabled={playLock}>
                  Head!
                </Button>
                <Button onClick={trusted(() => play("T"))} disabled={playLock}>
                  Tail!
                </Button>
              </>
            ),
          }}
        />
      </Box>
      <Typography variant="h3">{status}</Typography>
    </>
  );
}
