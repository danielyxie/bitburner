/**
 * React Subcomponent for displaying a location's UI, when that location is a gym
 *
 * This subcomponent renders all of the buttons for training at the gym
 */
import * as React from "react";

import { IPlayer } from "../PersonObjects/IPlayer";
import { StdButton } from "../ui/React/StdButton";
import { BadRNG } from "./RNG";
import { Game } from "./Game";
import { trusted } from "./utils";

type IProps = {
  p: IPlayer;
};

type IState = {
  investment: number;
  result: any;
  status: string;
  playLock: boolean;
};

const minPlay = 0;
const maxPlay = 10e3;

export class CoinFlip extends Game<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      investment: 1000,
      result: <span> </span>,
      status: "",
      playLock: false,
    };

    this.play = this.play.bind(this);
    this.updateInvestment = this.updateInvestment.bind(this);
  }

  updateInvestment(e: React.FormEvent<HTMLInputElement>): void {
    let investment: number = parseInt(e.currentTarget.value);
    if (isNaN(investment)) {
      investment = minPlay;
    }
    if (investment > maxPlay) {
      investment = maxPlay;
    }
    if (investment < minPlay) {
      investment = minPlay;
    }
    this.setState({ investment: investment });
  }

  play(guess: string): void {
    if (this.reachedLimit(this.props.p)) return;
    const v = BadRNG.random();
    let letter: string;
    if (v < 0.5) {
      letter = "H";
    } else {
      letter = "T";
    }
    const correct: boolean = guess === letter;
    this.setState({
      result: <span className={correct ? "text" : "failure"}>{letter}</span>,
      status: correct ? " win!" : "lose!",
      playLock: true,
    });
    setTimeout(() => this.setState({ playLock: false }), 250);
    if (correct) {
      this.win(this.props.p, this.state.investment);
    } else {
      this.win(this.props.p, -this.state.investment);
    }
    if (this.reachedLimit(this.props.p)) return;
  }

  render(): React.ReactNode {
    return (
      <>
        <pre>{`+———————+`}</pre>
        <pre>{`| |   | |`}</pre>
        <pre>
          {`| | `}
          {this.state.result}
          {` | |`}
        </pre>
        <pre>{`| |   | |`}</pre>
        <pre>{`+———————+`}</pre>
        <span className="text">Play for: </span>
        <input
          type="number"
          className="text-input"
          onChange={this.updateInvestment}
          value={this.state.investment}
        />
        <br />
        <StdButton
          onClick={trusted(() => this.play("H"))}
          text={"Head!"}
          disabled={this.state.playLock}
        />
        <StdButton
          onClick={trusted(() => this.play("T"))}
          text={"Tail!"}
          disabled={this.state.playLock}
        />
        <h1>{this.state.status}</h1>
      </>
    );
  }
}
