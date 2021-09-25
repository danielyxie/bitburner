/**
 * React Subcomponent for displaying a location's UI, when that location is a gym
 *
 * This subcomponent renders all of the buttons for training at the gym
 */
import * as React from "react";
import Button from "@mui/material/Button";
import { Blackjack } from "../../Casino/Blackjack";
import { CoinFlip } from "../../Casino/CoinFlip";
import { Roulette } from "../../Casino/Roulette";
import { SlotMachine } from "../../Casino/SlotMachine";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { StdButton } from "../../ui/React/StdButton";

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

export class CasinoLocation extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      game: GameType.None,
    };

    this.updateGame = this.updateGame.bind(this);
  }

  updateGame(game: GameType): void {
    this.setState({
      game,
    });
  }

  renderGames(): React.ReactNode {
    return (
      <>
        <Button onClick={() => this.updateGame(GameType.Coin)}>Play coin flip</Button>
        <br />
        <Button onClick={() => this.updateGame(GameType.Slots)}>Play slots</Button>
        <br />
        <Button onClick={() => this.updateGame(GameType.Roulette)}>Play roulette</Button>
        <br />
        <Button onClick={() => this.updateGame(GameType.Blackjack)}>Play blackjack</Button>
      </>
    );
  }

  renderGame(): React.ReactNode {
    let elem = null;
    switch (this.state.game) {
      case GameType.Coin:
        elem = <CoinFlip p={this.props.p} />;
        break;
      case GameType.Slots:
        elem = <SlotMachine p={this.props.p} />;
        break;
      case GameType.Roulette:
        elem = <Roulette p={this.props.p} />;
        break;
      case GameType.Blackjack:
        elem = <Blackjack p={this.props.p} />;
        break;
      case GameType.None:
        break;
      default:
        throw new Error(`MissingCaseException: ${this.state.game}`);
    }

    return (
      <>
        <StdButton onClick={() => this.updateGame(GameType.None)} text={"Stop playing"} />
        {elem}
      </>
    );
  }

  render(): React.ReactNode {
    if (this.state.game === GameType.None) {
      return this.renderGames();
    } else {
      return this.renderGame();
    }
  }
}
