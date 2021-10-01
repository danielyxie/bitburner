/**
 * React Subcomponent for displaying a location's UI, when that location is a gym
 *
 * This subcomponent renders all of the buttons for training at the gym
 */
import React, { useState } from "react";
import Button from "@mui/material/Button";
import { Blackjack } from "../../Casino/Blackjack";
import { CoinFlip } from "../../Casino/CoinFlip";
import { Roulette } from "../../Casino/Roulette";
import { SlotMachine } from "../../Casino/SlotMachine";
import { IPlayer } from "../../PersonObjects/IPlayer";

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

type IState = {
  game: GameType;
};

export function CasinoLocation(props: IProps): React.ReactElement {
  const [game, setGame] = useState(GameType.None);

  function updateGame(game: GameType): void {
    setGame(game);
  }

  return (
    <>
      {game === GameType.None && (
        <>
          <Button onClick={() => updateGame(GameType.Coin)}>Play coin flip</Button>
          <br />
          <Button onClick={() => updateGame(GameType.Slots)}>Play slots</Button>
          <br />
          <Button onClick={() => updateGame(GameType.Roulette)}>Play roulette</Button>
          <br />
          <Button onClick={() => updateGame(GameType.Blackjack)}>Play blackjack</Button>
        </>
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
