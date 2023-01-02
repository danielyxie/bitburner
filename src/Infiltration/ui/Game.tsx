import { Button, Container, Paper, Typography } from "@mui/material";
import React, { useState } from "react";
import { AugmentationNames } from "../../Augmentation/data/AugmentationNames";
import { use } from "../../ui/Context";
import { BackwardGame } from "./BackwardGame";
import { BracketGame } from "./BracketGame";
import { BribeGame } from "./BribeGame";
import { CheatCodeGame } from "./CheatCodeGame";
import { Countdown } from "./Countdown";
import { Cyberpunk2077Game } from "./Cyberpunk2077Game";
import { MinesweeperGame } from "./MinesweeperGame";
import { SlashGame } from "./SlashGame";
import { Victory } from "./Victory";
import { WireCuttingGame } from "./WireCuttingGame";

interface IProps {
  StartingDifficulty: number;
  Difficulty: number;
  Reward: number;
  MaxLevel: number;
}

enum Stage {
  Countdown = 0,
  Minigame,
  Result,
  Sell,
}

const minigames = [
  SlashGame,
  BracketGame,
  BackwardGame,
  BribeGame,
  CheatCodeGame,
  Cyberpunk2077Game,
  MinesweeperGame,
  WireCuttingGame,
];

export function Game(props: IProps): React.ReactElement {
  const player = use.Player();
  const router = use.Router();
  const [level, setLevel] = useState(1);
  const [stage, setStage] = useState(Stage.Countdown);
  const [results, setResults] = useState("");
  const [gameIds, setGameIds] = useState({
    lastGames: [-1, -1],
    id: Math.floor(Math.random() * minigames.length),
  });

  function nextGameId(): number {
    let id = gameIds.lastGames[0];
    const ids = [gameIds.lastGames[0], gameIds.lastGames[1], gameIds.id];
    while (ids.includes(id)) {
      id = Math.floor(Math.random() * minigames.length);
    }
    return id;
  }

  function setupNextGame(): void {
    setGameIds({
      lastGames: [gameIds.lastGames[1], gameIds.id],
      id: nextGameId(),
    });
  }

  function success(): void {
    pushResult(true);
    if (level === props.MaxLevel) {
      setStage(Stage.Sell);
    } else {
      setStage(Stage.Countdown);
      setLevel(level + 1);
    }
    setupNextGame();
  }

  function pushResult(win: boolean): void {
    setResults((old) => {
      let next = old;
      next += win ? "✓" : "✗";
      if (next.length > 15) next = next.slice(1);
      return next;
    });
  }

  function failure(options?: { automated: boolean }): void {
    setStage(Stage.Countdown);
    pushResult(false);
    // Kill the player immediately if they use automation, so
    // it's clear they're not meant to
    const damage = options?.automated
      ? player.hp.current
      : props.StartingDifficulty * 3 * (player.hasAugmentation(AugmentationNames.WKSharmonizer, true) ? 0.5 : 1);
    if (player.takeDamage(damage)) {
      router.toCity();
      return;
    }
    setupNextGame();
  }

  function cancel(): void {
    router.toCity();
    return;
  }

  let stageComponent: React.ReactNode;
  switch (stage) {
    case Stage.Countdown:
      stageComponent = <Countdown onFinish={() => setStage(Stage.Minigame)} />;
      break;
    case Stage.Minigame: {
      const MiniGame = minigames[gameIds.id];
      stageComponent = <MiniGame onSuccess={success} onFailure={failure} difficulty={props.Difficulty + level / 50} />;
      break;
    }
    case Stage.Sell:
      stageComponent = (
        <Victory
          StartingDifficulty={props.StartingDifficulty}
          Difficulty={props.Difficulty}
          Reward={props.Reward}
          MaxLevel={props.MaxLevel}
        />
      );
      break;
  }

  function Progress(): React.ReactElement {
    return (
      <Typography variant="h4">
        <span style={{ color: "gray" }}>{results.slice(0, results.length - 1)}</span>
        {results[results.length - 1]}
      </Typography>
    );
  }

  return (
    <Container>
      <Paper sx={{ p: 1, mb: 1, display: "grid", justifyItems: "center", gap: 1 }}>
        {stage !== Stage.Sell && (
          <Button sx={{ width: "100%" }} onClick={cancel}>
            Cancel Infiltration
          </Button>
        )}
        <Typography variant="h5">
          Level {level} / {props.MaxLevel}
        </Typography>
        <Progress />
      </Paper>

      {stageComponent}
    </Container>
  );
}
