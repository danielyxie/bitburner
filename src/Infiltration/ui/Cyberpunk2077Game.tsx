import { Paper, Typography, Box } from "@mui/material";
import React, { useState } from "react";
import { AugmentationNames } from "../../Augmentation/data/AugmentationNames";
import { Player } from "@player";
import { Settings } from "../../Settings/Settings";
import { KEY } from "../../utils/helpers/keyCodes";
import { downArrowSymbol, getArrow, leftArrowSymbol, rightArrowSymbol, upArrowSymbol } from "../utils";
import { interpolate } from "./Difficulty";
import { GameTimer } from "./GameTimer";
import { IMinigameProps } from "./IMinigameProps";
import { KeyHandler } from "./KeyHandler";

interface Difficulty {
  [key: string]: number;
  timer: number;
  width: number;
  height: number;
  symbols: number;
}

interface GridItem {
  content: string;
  color: string;
  selected?: boolean;
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
  const [answers] = useState(generateAnswers(grid, difficulty));
  const [currentAnswerIndex, setCurrentAnswerIndex] = useState(0);
  const [pos, setPos] = useState([0, 0]);

  const hasAugment = Player.hasAugmentation(AugmentationNames.FloodOfPoseidon, true);
  function press(this: Document, event: KeyboardEvent): void {
    event.preventDefault();
    const move = [0, 0];
    const arrow = getArrow(event);
    switch (arrow) {
      case upArrowSymbol:
        move[1]--;
        break;
      case leftArrowSymbol:
        move[0]--;
        break;
      case downArrowSymbol:
        move[1]++;
        break;
      case rightArrowSymbol:
        move[0]++;
        break;
    }
    const next = [pos[0] + move[0], pos[1] + move[1]];
    next[0] = (next[0] + grid[0].length) % grid[0].length;
    next[1] = (next[1] + grid.length) % grid.length;
    setPos(next);

    if (event.key === KEY.SPACE) {
      const selected = grid[pos[1]][pos[0]];
      const expected = answers[currentAnswerIndex];
      if (selected !== expected) {
        props.onFailure();
        return;
      }
      setCurrentAnswerIndex(currentAnswerIndex + 1);
      if (answers.length === currentAnswerIndex + 1) props.onSuccess();
    }
  }

  const flatGrid: GridItem[] = [];
  grid.map((line, y) =>
    line.map((cell, x) => {
      const isCorrectAnswer = cell === answers[currentAnswerIndex];
      const optionColor = hasAugment && !isCorrectAnswer ? Settings.theme.disabled : Settings.theme.primary;

      if (x === pos[0] && y === pos[1]) {
        flatGrid.push({ color: optionColor, content: cell, selected: true });
        return;
      }

      flatGrid.push({ color: optionColor, content: cell });
    }),
  );

  const fontSize = "2em";
  return (
    <>
      <GameTimer millis={timer} onExpire={props.onFailure} />
      <Paper sx={{ display: "grid", justifyItems: "center", pb: 1 }}>
        <Typography variant="h4">Match the symbols!</Typography>
        <Typography variant="h5" color={Settings.theme.primary}>
          Targets:{" "}
          {answers.map((a, i) => {
            if (i == currentAnswerIndex)
              return (
                <span key={`${i}`} style={{ fontSize: "1em", color: Settings.theme.infolight }}>
                  {a}&nbsp;
                </span>
              );
            return (
              <span key={`${i}`} style={{ fontSize: "1em", color: Settings.theme.primary }}>
                {a}&nbsp;
              </span>
            );
          })}
        </Typography>
        <br />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.round(difficulty.width)}, 1fr)`,
            gap: 1,
          }}
        >
          {flatGrid.map((item) => (
            <Typography
              sx={{
                fontSize: fontSize,
                color: item.color,
                border: item.selected ? `2px solid ${Settings.theme.infolight}` : "unset",
                lineHeight: "unset",
                p: item.selected ? "2px" : "4px",
              }}
            >
              {item.content}
            </Typography>
          ))}
        </Box>
        <KeyHandler onKeyDown={press} onFailure={props.onFailure} />
      </Paper>
    </>
  );
}

function generateAnswers(grid: string[][], difficulty: Difficulty): string[] {
  const answers = [];
  for (let i = 0; i < Math.round(difficulty.symbols); i++) {
    answers.push(grid[Math.floor(Math.random() * grid.length)][Math.floor(Math.random() * grid[0].length)]);
  }
  return answers;
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
