import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { IMinigameProps } from "./IMinigameProps";
import { KeyHandler } from "./KeyHandler";
import { GameTimer } from "./GameTimer";
import { interpolate } from "./Difficulty";
import { getArrow } from "../utils";
import Typography from "@mui/material/Typography";

interface Difficulty {
  [key: string]: number;
  timer: number;
  width: number;
  height: number;
  mines: number;
}

const difficulties: {
  Trivial: Difficulty;
  Normal: Difficulty;
  Hard: Difficulty;
  Impossible: Difficulty;
} = {
  Trivial: { timer: 15000, width: 3, height: 3, mines: 4 },
  Normal: { timer: 15000, width: 4, height: 4, mines: 7 },
  Hard: { timer: 15000, width: 5, height: 5, mines: 11 },
  Impossible: { timer: 15000, width: 6, height: 6, mines: 15 },
};

export function MinesweeperGame(props: IMinigameProps): React.ReactElement {
  const difficulty: Difficulty = { timer: 0, width: 0, height: 0, mines: 0 };
  interpolate(difficulties, props.difficulty, difficulty);
  const timer = difficulty.timer;
  const [minefield] = useState(generateMinefield(difficulty));
  const [answer, setAnswer] = useState(generateEmptyField(difficulty));
  const [pos, setPos] = useState([0, 0]);
  const [memoryPhase, setMemoryPhase] = useState(true);

  function press(this: Document, event: KeyboardEvent): void {
    event.preventDefault();
    if (memoryPhase) return;
    const move = [0, 0];
    const arrow = getArrow(event);
    switch (arrow) {
      case "↑":
        move[1]--;
        break;
      case "←":
        move[0]--;
        break;
      case "↓":
        move[1]++;
        break;
      case "→":
        move[0]++;
        break;
    }
    const next = [pos[0] + move[0], pos[1] + move[1]];
    next[0] = (next[0] + minefield[0].length) % minefield[0].length;
    next[1] = (next[1] + minefield.length) % minefield.length;
    setPos(next);

    if (event.keyCode == 32) {
      if (!minefield[pos[1]][pos[0]]) {
        props.onFailure();
        return;
      }
      setAnswer((old) => {
        old[pos[1]][pos[0]] = true;
        if (fieldEquals(minefield, old)) props.onSuccess();
        return old;
      });
    }
  }

  useEffect(() => {
    const id = setTimeout(() => setMemoryPhase(false), 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <Grid container spacing={3}>
      <GameTimer millis={timer} onExpire={props.onFailure} />
      <Grid item xs={12}>
        <Typography variant="h4">{memoryPhase ? "Remember all the mines!" : "Mark all the mines!"}</Typography>
        {minefield.map((line, y) => (
          <div key={y}>
            <Typography>
              {line.map((cell, x) => {
                if (memoryPhase) {
                  if (minefield[y][x]) return <span key={x}>[?]&nbsp;</span>;
                  return <span key={x}>[&nbsp;]&nbsp;</span>;
                } else {
                  if (x == pos[0] && y == pos[1]) return <span key={x}>[X]&nbsp;</span>;
                  if (answer[y][x]) return <span key={x}>[.]&nbsp;</span>;
                  return <span key={x}>[&nbsp;]&nbsp;</span>;
                }
              })}
            </Typography>
            <br />
          </div>
        ))}
        <KeyHandler onKeyDown={press} onFailure={props.onFailure} />
      </Grid>
    </Grid>
  );
}

function fieldEquals(a: boolean[][], b: boolean[][]): boolean {
  function count(field: boolean[][]): number {
    return field.flat().reduce((a, b) => a + (b ? 1 : 0), 0);
  }
  return count(a) === count(b);
}

function generateEmptyField(difficulty: Difficulty): boolean[][] {
  const field = [];
  for (let i = 0; i < difficulty.height; i++) {
    field.push(new Array(Math.round(difficulty.width)).fill(false));
  }
  return field;
}

function generateMinefield(difficulty: Difficulty): boolean[][] {
  const field = generateEmptyField(difficulty);
  for (let i = 0; i < difficulty.mines; i++) {
    const x = Math.floor(Math.random() * field.length);
    const y = Math.floor(Math.random() * field[0].length);
    if (field[x][y]) {
      i--;
      continue;
    }
    field[x][y] = true;
  }
  return field;
}
