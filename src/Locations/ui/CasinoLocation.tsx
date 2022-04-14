/**
 * React Subcomponent for displaying a location's UI, when that location is a gym
 *
 * This subcomponent renders all of the buttons for training at the gym
 */
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import React, { useState } from "react";

import { Blackjack, DECK_COUNT } from "../../Casino/Blackjack";
import { CoinFlip } from "../../Casino/CoinFlip";
import { Roulette } from "../../Casino/Roulette";
import { SlotMachine } from "../../Casino/SlotMachine";
import type { IPlayer } from "../../PersonObjects/IPlayer";

enum GameType {
  None = "none",
  Coin = "coin",
  Slots = "slots",
  Roulette = "roulette",
  Blackjack = "blackjack",
}

type IProps = {
  p: IPlayer;
};

export function CasinoLocation(props: IProps): React.ReactElement {
  const [game, setGame] = useState(GameType.None);

  function updateGame(game: GameType): void {
    setGame(game);
  }

  return (
    <>
      {game === GameType.None && (
        <Box sx={{ display: "grid", width: "fit-content" }}>
          <Button onClick={() => updateGame(GameType.Coin)}>Play coin flip</Button>
          <Button onClick={() => updateGame(GameType.Slots)}>Play slots</Button>
          <Button onClick={() => updateGame(GameType.Roulette)}>Play roulette</Button>
          <Button onClick={() => updateGame(GameType.Blackjack)}>Play blackjack ({DECK_COUNT} decks)</Button>
        </Box>
      )}
      {game !== GameType.None && (
        <>
          <Button onClick={() => updateGame(GameType.None)}>Stop playing</Button>
          {game === GameType.Coin && <CoinFlip p={props.p} />}
          {game === GameType.Slots && <SlotMachine p={props.p} />}
          {game === GameType.Roulette && <Roulette p={props.p} />}
          {game === GameType.Blackjack && <Blackjack p={props.p} />}
        </>
      )}
    </>
  );
}
