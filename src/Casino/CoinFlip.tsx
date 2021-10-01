/**
 * React Subcomponent for displaying a location's UI, when that location is a gym
 *
 * This subcomponent renders all of the buttons for training at the gym
 */
import React, { useState } from "react";

import { IPlayer } from "../PersonObjects/IPlayer";
import { BadRNG } from "./RNG";
import { win, reachedLimit } from "./Game";
import { trusted } from "./utils";

import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

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

    setResult(<span className={correct ? "text" : "failure"}>{letter}</span>);
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
      <Typography sx={{ lineHeight: "1em", whiteSpace: "pre" }}>{`+———————+`}</Typography>
      <Typography sx={{ lineHeight: "1em", whiteSpace: "pre" }}>{`| |   | |`}</Typography>
      <Typography sx={{ lineHeight: "1em", whiteSpace: "pre" }}>
        {`| | `}
        {result}
        {` | |`}
      </Typography>
      <Typography sx={{ lineHeight: "1em", whiteSpace: "pre" }}>{`| |   | |`}</Typography>
      <Typography sx={{ lineHeight: "1em", whiteSpace: "pre" }}>{`+———————+`}</Typography>
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
