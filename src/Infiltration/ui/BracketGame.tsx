import { Paper, Typography } from "@mui/material";
import React, { useState } from "react";
import { AugmentationNames } from "../../Augmentation/data/AugmentationNames";
import { Player } from "../../Player";
import { KEY } from "../../utils/helpers/keyCodes";
import { random } from "../utils";
import { BlinkingCursor } from "./BlinkingCursor";
import { interpolate } from "./Difficulty";
import { GameTimer } from "./GameTimer";
import { IMinigameProps } from "./IMinigameProps";
import { KeyHandler } from "./KeyHandler";

interface Difficulty {
  [key: string]: number;
  timer: number;
  min: number;
  max: number;
}

const difficulties: {
  Trivial: Difficulty;
  Normal: Difficulty;
  Hard: Difficulty;
  Impossible: Difficulty;
} = {
  Trivial: { timer: 8000, min: 2, max: 3 },
  Normal: { timer: 6000, min: 4, max: 5 },
  Hard: { timer: 4000, min: 4, max: 6 },
  Impossible: { timer: 2500, min: 7, max: 7 },
};

function generateLeftSide(difficulty: Difficulty): string {
  let str = "";
  const options = [KEY.OPEN_BRACKET, KEY.LESS_THAN, KEY.OPEN_PARENTHESIS, KEY.OPEN_BRACE];
  if (Player.hasAugmentation(AugmentationNames.WisdomOfAthena, true)) {
    options.splice(0, 1);
  }
  const length = random(difficulty.min, difficulty.max);
  for (let i = 0; i < length; i++) {
    str += options[Math.floor(Math.random() * options.length)];
  }

  return str;
}

function getChar(event: KeyboardEvent): string {
  if (event.key === KEY.CLOSE_PARENTHESIS) return KEY.CLOSE_PARENTHESIS;
  if (event.key === KEY.CLOSE_BRACKET) return KEY.CLOSE_BRACKET;
  if (event.key === KEY.CLOSE_BRACE) return KEY.CLOSE_BRACE;
  if (event.key === KEY.GREATER_THAN) return KEY.GREATER_THAN;
  return "";
}

function match(left: string, right: string): boolean {
  return (
    (left === KEY.OPEN_BRACKET && right === KEY.CLOSE_BRACKET) ||
    (left === KEY.LESS_THAN && right === KEY.GREATER_THAN) ||
    (left === KEY.OPEN_PARENTHESIS && right === KEY.CLOSE_PARENTHESIS) ||
    (left === KEY.OPEN_BRACE && right === KEY.CLOSE_BRACE)
  );
}

export function BracketGame(props: IMinigameProps): React.ReactElement {
  const difficulty: Difficulty = { timer: 0, min: 0, max: 0 };
  interpolate(difficulties, props.difficulty, difficulty);
  const timer = difficulty.timer;
  const [right, setRight] = useState("");
  const [left] = useState(generateLeftSide(difficulty));

  function press(this: Document, event: KeyboardEvent): void {
    event.preventDefault();
    const char = getChar(event);
    if (!char) return;
    if (!match(left[left.length - right.length - 1], char)) {
      props.onFailure();
      return;
    }
    if (left.length === right.length + 1) {
      props.onSuccess();
      return;
    }
    setRight(right + char);
  }

  return (
    <>
      <GameTimer millis={timer} onExpire={props.onFailure} />
      <Paper sx={{ display: "grid", justifyItems: "center" }}>
        <Typography variant="h4">Close the brackets</Typography>
        <Typography style={{ fontSize: "5em" }}>
          {`${left}${right}`}
          <BlinkingCursor />
        </Typography>
        <KeyHandler onKeyDown={press} onFailure={props.onFailure} />
      </Paper>
    </>
  );
}
