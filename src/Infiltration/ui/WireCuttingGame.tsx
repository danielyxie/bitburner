import { Box, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { AugmentationNames } from "../../Augmentation/data/AugmentationNames";
import { Player } from "../../Player";
import { Settings } from "../../Settings/Settings";
import { KEY } from "../../utils/helpers/keyCodes";
import { random } from "../utils";
import { interpolate } from "./Difficulty";
import { GameTimer } from "./GameTimer";
import { IMinigameProps } from "./IMinigameProps";
import { KeyHandler } from "./KeyHandler";

interface Difficulty {
  [key: string]: number;
  timer: number;
  wiresmin: number;
  wiresmax: number;
  rules: number;
}

const difficulties: {
  Trivial: Difficulty;
  Normal: Difficulty;
  Hard: Difficulty;
  Impossible: Difficulty;
} = {
  Trivial: { timer: 9000, wiresmin: 4, wiresmax: 4, rules: 2 },
  Normal: { timer: 7000, wiresmin: 6, wiresmax: 6, rules: 2 },
  Hard: { timer: 5000, wiresmin: 8, wiresmax: 8, rules: 3 },
  Impossible: { timer: 4000, wiresmin: 9, wiresmax: 9, rules: 4 },
};

const types = [KEY.PIPE, KEY.DOT, KEY.FORWARD_SLASH, KEY.HYPHEN, "█", KEY.HASH];

const colors = ["red", "#FFC107", "blue", "white"];

const colorNames: any = {
  red: "red",
  "#FFC107": "yellow",
  blue: "blue",
  white: "white",
};

interface Wire {
  tpe: string;
  colors: string[];
}

interface Question {
  toString: () => string;
  shouldCut: (wire: Wire, index: number) => boolean;
}

export function WireCuttingGame(props: IMinigameProps): React.ReactElement {
  const difficulty: Difficulty = {
    timer: 0,
    wiresmin: 0,
    wiresmax: 0,
    rules: 0,
  };
  interpolate(difficulties, props.difficulty, difficulty);
  const timer = difficulty.timer;
  const [wires] = useState(generateWires(difficulty));
  const [cutWires, setCutWires] = useState(new Array(wires.length).fill(false));
  const [questions] = useState(generateQuestion(wires, difficulty));
  const hasAugment = Player.hasAugmentation(AugmentationNames.KnowledgeOfApollo, true);

  function checkWire(wireNum: number): boolean {
    return questions.some((q) => q.shouldCut(wires[wireNum - 1], wireNum - 1));
  }

  useEffect(() => {
    // check if we won
    const wiresToBeCut = [];
    for (let j = 0; j < wires.length; j++) {
      let shouldBeCut = false;
      for (let i = 0; i < questions.length; i++) {
        shouldBeCut = shouldBeCut || questions[i].shouldCut(wires[j], j);
      }
      wiresToBeCut.push(shouldBeCut);
    }
    if (wiresToBeCut.every((b, i) => b === cutWires[i])) {
      props.onSuccess();
    }
  }, [cutWires]);

  function press(this: Document, event: KeyboardEvent): void {
    event.preventDefault();
    const wireNum = parseInt(event.key);

    if (wireNum < 1 || wireNum > wires.length || isNaN(wireNum)) return;
    setCutWires((old) => {
      const next = [...old];
      next[wireNum - 1] = true;
      if (!checkWire(wireNum)) {
        props.onFailure();
      }

      return next;
    });
  }

  return (
    <>
      <GameTimer millis={timer} onExpire={props.onFailure} />
      <Paper sx={{ display: "grid", justifyItems: "center", pb: 1 }}>
        <Typography variant="h4" sx={{ width: "75%", textAlign: "center" }}>
          Cut the wires with the following properties! (keyboard 1 to 9)
        </Typography>
        {questions.map((question, i) => (
          <Typography key={i}>{question.toString()}</Typography>
        ))}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${wires.length}, 1fr)`,
            columnGap: 3,
            justifyItems: "center",
          }}
        >
          {new Array(wires.length).fill(0).map((_, i) => {
            const isCorrectWire = checkWire(i + 1);
            const color = hasAugment && !isCorrectWire ? Settings.theme.disabled : Settings.theme.primary;
            return (
              <Typography key={i} style={{ color: color }}>
                {i + 1}
              </Typography>
            );
          })}
          {new Array(8).fill(0).map((_, i) => (
            <React.Fragment key={i}>
              {wires.map((wire, j) => {
                if ((i === 3 || i === 4) && cutWires[j]) {
                  return <Typography key={j}></Typography>;
                }
                const isCorrectWire = checkWire(j + 1);
                const wireColor =
                  hasAugment && !isCorrectWire ? Settings.theme.disabled : wire.colors[i % wire.colors.length];
                return (
                  <Typography key={j} style={{ color: wireColor }}>
                    |{wire.tpe}|
                  </Typography>
                );
              })}
            </React.Fragment>
          ))}
        </Box>
        <KeyHandler onKeyDown={press} onFailure={props.onFailure} />
      </Paper>
    </>
  );
}

function randomPositionQuestion(wires: Wire[]): Question {
  const index = Math.floor(Math.random() * wires.length);
  return {
    toString: (): string => {
      return `Cut wires number ${index + 1}.`;
    },
    shouldCut: (wire: Wire, i: number): boolean => {
      return index === i;
    },
  };
}

function randomColorQuestion(wires: Wire[]): Question {
  const index = Math.floor(Math.random() * wires.length);
  const cutColor = wires[index].colors[0];
  return {
    toString: (): string => {
      return `Cut all wires colored ${colorNames[cutColor]}.`;
    },
    shouldCut: (wire: Wire): boolean => {
      return wire.colors.includes(cutColor);
    },
  };
}

function generateQuestion(wires: Wire[], difficulty: Difficulty): Question[] {
  const numQuestions = difficulty.rules;
  const questionGenerators = [randomPositionQuestion, randomColorQuestion];
  const questions = [];
  for (let i = 0; i < numQuestions; i++) {
    questions.push(questionGenerators[i % 2](wires));
  }
  return questions;
}

function generateWires(difficulty: Difficulty): Wire[] {
  const wires = [];
  const numWires = random(difficulty.wiresmin, difficulty.wiresmax);
  for (let i = 0; i < numWires; i++) {
    const wireColors = [colors[Math.floor(Math.random() * colors.length)]];
    if (Math.random() < 0.15) {
      wireColors.push(colors[Math.floor(Math.random() * colors.length)]);
    }
    wires.push({
      tpe: types[Math.floor(Math.random() * types.length)],
      colors: wireColors,
    });
  }
  return wires;
}
