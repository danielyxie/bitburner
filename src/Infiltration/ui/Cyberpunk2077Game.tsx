import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import { IMinigameProps } from "./IMinigameProps";
import { KeyHandler } from "./KeyHandler";
import { GameTimer } from "./GameTimer";
import { interpolate } from "./Difficulty";
import { getArrow } from "../utils";

interface Difficulty {
  [key: string]: number;
  timer: number;
  width: number;
  height: number;
  symbols: number;
}

const difficulties: {
  Trivial: Difficulty;
  Normal: Difficulty;
  Hard: Difficulty;
  Impossible: Difficulty;
} = {
  Trivial: { timer: 12500, width: 3, height: 3, symbols: 6 },
  Normal: { timer: 15000, width: 4, height: 4, symbols: 7 },
  Hard: { timer: 12500, width: 5, height: 5, symbols: 8 },
  Impossible: { timer: 10000, width: 6, height: 6, symbols: 9 },
};

export function Cyberpunk2077Game(props: IMinigameProps): React.ReactElement {
  const difficulty: Difficulty = { timer: 0, width: 0, height: 0, symbols: 0 };
  interpolate(difficulties, props.difficulty, difficulty);
  const timer = difficulty.timer;
  const [grid] = useState(generatePuzzle(difficulty));
  const [answer] = useState(generateAnswer(grid, difficulty));
  const [index, setIndex] = useState(0);
  const [pos, setPos] = useState([0, 0]);

  function press(event: React.KeyboardEvent<HTMLElement>): void {
    event.preventDefault();
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
    next[0] = (next[0] + grid[0].length) % grid[0].length;
    next[1] = (next[1] + grid.length) % grid.length;
    setPos(next);

    if (event.keyCode == 32) {
      const selected = grid[pos[1]][pos[0]];
      const expected = answer[index];
      if (selected !== expected) {
        props.onFailure();
        return;
      }
      setIndex(index + 1);
      if (answer.length === index + 1) props.onSuccess();
    }
  }

  const fontSize = "2em";
  return (
    <Grid container spacing={3}>
      <GameTimer millis={timer} onExpire={props.onFailure} />
      <Grid item xs={12}>
        <h1 className={"noselect"}>Match the symbols!</h1>
        <h2 style={{ fontSize: fontSize }}>
          Targets:{" "}
          {answer.map((a, i) => {
            if (i == index)
              return (
                <span key={`${i}`} style={{ fontSize: "1em", color: "blue" }}>
                  {a}&nbsp;
                </span>
              );
            return (
              <span key={`${i}`} style={{ fontSize: "1em" }}>
                {a}&nbsp;
              </span>
            );
          })}
        </h2>
        <br />
        {grid.map((line, y) => (
          <div key={y}>
            <pre>
              {line.map((cell, x) => {
                if (x == pos[0] && y == pos[1])
                  return (
                    <span key={`${x}${y}`} style={{ fontSize: fontSize, color: "blue" }}>
                      {cell}&nbsp;
                    </span>
                  );
                return (
                  <span key={`${x}${y}`} style={{ fontSize: fontSize }}>
                    {cell}&nbsp;
                  </span>
                );
              })}
            </pre>
            <br />
          </div>
        ))}
        <KeyHandler onKeyDown={press} onFailure={props.onFailure} />
      </Grid>
    </Grid>
  );
}

function generateAnswer(grid: string[][], difficulty: Difficulty): string[] {
  const answer = [];
  for (let i = 0; i < Math.round(difficulty.symbols); i++) {
    answer.push(grid[Math.floor(Math.random() * grid.length)][Math.floor(Math.random() * grid[0].length)]);
  }
  return answer;
}

function randChar(): string {
  return "ABCDEF0123456789"[Math.floor(Math.random() * 16)];
}

function generatePuzzle(difficulty: Difficulty): string[][] {
  const puzzle = [];
  for (let i = 0; i < Math.round(difficulty.height); i++) {
    const line = [];
    for (let j = 0; j < Math.round(difficulty.width); j++) {
      line.push(randChar() + randChar());
    }
    puzzle.push(line);
  }
  return puzzle;
}
