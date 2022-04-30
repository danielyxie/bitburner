import { Close, Flag, Report } from "@mui/icons-material";
import { Box, Paper, Typography } from "@mui/material";
import { uniqueId } from "lodash";
import React, { useEffect, useState } from "react";
import { AugmentationNames } from "../../Augmentation/data/AugmentationNames";
import { Player } from "../../Player";
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
  const hasAugment = Player.hasAugmentation(AugmentationNames.HuntOfArtemis, true);
  function press(this: Document, event: KeyboardEvent): void {
    event.preventDefault();
    if (memoryPhase) return;
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
    next[0] = (next[0] + minefield[0].length) % minefield[0].length;
    next[1] = (next[1] + minefield.length) % minefield.length;
    setPos(next);

    if (event.key == KEY.SPACE) {
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

  const flatGrid: { flagged?: boolean; current?: boolean; marked?: boolean }[] = [];

  minefield.map((line, y) =>
    line.map((cell, x) => {
      if (memoryPhase) {
        flatGrid.push({ flagged: Boolean(minefield[y][x]) });
        return;
      } else if (x === pos[0] && y === pos[1]) {
        flatGrid.push({ current: true });
      } else if (answer[y][x]) {
        flatGrid.push({ marked: true });
      } else if (hasAugment && minefield[y][x]) {
        flatGrid.push({ flagged: true });
      } else {
        flatGrid.push({});
      }
    }),
  );

  return (
    <>
      <GameTimer millis={timer} onExpire={props.onFailure} />
      <Paper sx={{ display: "grid", justifyItems: "center", pb: 1 }}>
        <Typography variant="h4">{memoryPhase ? "Remember all the mines!" : "Mark all the mines!"}</Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.round(difficulty.width)}, 1fr)`,
            gridTemplateRows: `repeat(${Math.round(difficulty.height)}, 1fr)`,
            gap: 1,
          }}
        >
          {flatGrid.map((item) => {
            const color = item.current
              ? Settings.theme.infolight
              : item.marked
              ? Settings.theme.warning
              : Settings.theme.error;
            return (
              <Typography
                key={`${item}${uniqueId()}`}
                sx={{
                  color: color,
                  border: `2px solid ${item.current ? Settings.theme.infolight : Settings.theme.primary}`,
                  height: "32px",
                  width: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {item.current ? <Close /> : item.flagged ? <Report /> : item.marked ? <Flag /> : <></>}
              </Typography>
            );
          })}
        </Box>
        <KeyHandler onKeyDown={press} onFailure={props.onFailure} />
      </Paper>
    </>
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
