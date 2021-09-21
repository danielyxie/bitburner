import * as React from "react";

import { IPlayer } from "../PersonObjects/IPlayer";
import { StdButton } from "../ui/React/StdButton";
import { Money } from "../ui/React/Money";
import { Game } from "./Game";
import { WHRNG } from "./RNG";
import { trusted } from "./utils";

type IProps = {
  p: IPlayer;
};

type IState = {
  investment: number;
  canPlay: boolean;
  status: string | JSX.Element;
  n: number;
  lock: boolean;
  strategy: Strategy;
};

const minPlay = 0;
const maxPlay = 1e7;

function isRed(n: number): boolean {
  return [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(n);
}

type Strategy = {
  match: (n: number) => boolean;
  payout: number;
};

const redNumbers: number[] = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

const strategies: {
  Red: Strategy;
  Black: Strategy;
  Odd: Strategy;
  Even: Strategy;
  High: Strategy;
  Low: Strategy;
  Third1: Strategy;
  Third2: Strategy;
  Third3: Strategy;
} = {
  Red: {
    match: (n: number): boolean => {
      if (n === 0) return false;
      return redNumbers.includes(n);
    },
    payout: 1,
  },
  Black: {
    match: (n: number): boolean => {
      return !redNumbers.includes(n);
    },
    payout: 1,
  },
  Odd: {
    match: (n: number): boolean => {
      if (n === 0) return false;
      return n % 2 === 1;
    },
    payout: 1,
  },
  Even: {
    match: (n: number): boolean => {
      if (n === 0) return false;
      return n % 2 === 0;
    },
    payout: 1,
  },
  High: {
    match: (n: number): boolean => {
      if (n === 0) return false;
      return n > 18;
    },
    payout: 1,
  },
  Low: {
    match: (n: number): boolean => {
      if (n === 0) return false;
      return n < 19;
    },
    payout: 1,
  },
  Third1: {
    match: (n: number): boolean => {
      if (n === 0) return false;
      return n <= 12;
    },
    payout: 2,
  },
  Third2: {
    match: (n: number): boolean => {
      if (n === 0) return false;
      return n >= 13 && n <= 24;
    },
    payout: 2,
  },
  Third3: {
    match: (n: number): boolean => {
      if (n === 0) return false;
      return n >= 25;
    },
    payout: 2,
  },
};

function Single(s: number): Strategy {
  return {
    match: (n: number): boolean => {
      return s === n;
    },
    payout: 36,
  };
}

export class Roulette extends Game<IProps, IState> {
  interval = -1;
  rng: WHRNG;

  constructor(props: IProps) {
    super(props);

    this.rng = new WHRNG(new Date().getTime());
    this.state = {
      investment: 1000,
      canPlay: true,
      status: "waiting",
      n: 0,
      lock: true,
      strategy: {
        payout: 0,
        match: (): boolean => {
          return false;
        },
      },
    };

    this.step = this.step.bind(this);
    this.currentNumber = this.currentNumber.bind(this);
    this.updateInvestment = this.updateInvestment.bind(this);
  }

  componentDidMount(): void {
    this.interval = window.setInterval(this.step, 50);
  }

  step(): void {
    if (!this.state.lock) {
      this.setState({ n: Math.floor(Math.random() * 37) });
    }
  }

  componentWillUnmount(): void {
    clearInterval(this.interval);
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

  currentNumber(): string {
    if (this.state.n === 0) return "0";
    const color = isRed(this.state.n) ? "R" : "B";
    return `${this.state.n}${color}`;
  }

  play(s: Strategy): void {
    if (this.reachedLimit(this.props.p)) return;
    this.setState({
      canPlay: false,
      lock: false,
      status: "playing",
      strategy: s,
    });
    setTimeout(() => {
      let n = Math.floor(this.rng.random() * 37);
      let status = <></>;
      let gain = 0;
      let playerWin = this.state.strategy.match(n);
      // oh yeah, the house straight up cheats. Try finding the seed now!
      if (playerWin && Math.random() > 0.9) {
        playerWin = false;
        while (this.state.strategy.match(n)) {
          n = (n + 1) % 36;
        }
      }
      if (playerWin) {
        gain = this.state.investment * this.state.strategy.payout;
        status = (
          <>
            won <Money money={gain} />
          </>
        );
      } else {
        gain = -this.state.investment;
        status = (
          <>
            lost <Money money={-gain} />
          </>
        );
      }
      this.win(this.props.p, gain);
      this.setState({
        canPlay: true,
        lock: true,
        status: status,
        n: n,
      });
      this.reachedLimit(this.props.p);
    }, 1600);
  }

  render(): React.ReactNode {
    return (
      <>
        <h1>{this.currentNumber()}</h1>
        <input
          type="number"
          className="text-input"
          onChange={this.updateInvestment}
          placeholder={"Amount to play"}
          value={this.state.investment}
          disabled={!this.state.canPlay}
        />
        <h1>{this.state.status}</h1>
        <table>
          <tbody>
            <tr>
              <td>
                <StdButton text={"3"} disabled={!this.state.canPlay} onClick={trusted(() => this.play(Single(3)))} />
              </td>
              <td>
                <StdButton text={"6"} disabled={!this.state.canPlay} onClick={trusted(() => this.play(Single(6)))} />
              </td>
              <td>
                <StdButton text={"9"} disabled={!this.state.canPlay} onClick={trusted(() => this.play(Single(9)))} />
              </td>
              <td>
                <StdButton text={"12"} disabled={!this.state.canPlay} onClick={trusted(() => this.play(Single(12)))} />
              </td>
              <td>
                <StdButton text={"15"} disabled={!this.state.canPlay} onClick={trusted(() => this.play(Single(15)))} />
              </td>
              <td>
                <StdButton text={"18"} disabled={!this.state.canPlay} onClick={trusted(() => this.play(Single(18)))} />
              </td>
              <td>
                <StdButton text={"21"} disabled={!this.state.canPlay} onClick={trusted(() => this.play(Single(21)))} />
              </td>
              <td>
                <StdButton text={"24"} disabled={!this.state.canPlay} onClick={trusted(() => this.play(Single(24)))} />
              </td>
              <td>
                <StdButton text={"27"} disabled={!this.state.canPlay} onClick={trusted(() => this.play(Single(27)))} />
              </td>
              <td>
                <StdButton text={"30"} disabled={!this.state.canPlay} onClick={trusted(() => this.play(Single(30)))} />
              </td>
              <td>
                <StdButton text={"33"} disabled={!this.state.canPlay} onClick={trusted(() => this.play(Single(33)))} />
              </td>
              <td>
                <StdButton text={"36"} disabled={!this.state.canPlay} onClick={trusted(() => this.play(Single(36)))} />
              </td>
            </tr>
            <tr>
              <td>
                <StdButton text={"2"} disabled={!this.state.canPlay} onClick={trusted(() => this.play(Single(2)))} />
              </td>
              <td>
                <StdButton text={"5"} disabled={!this.state.canPlay} onClick={trusted(() => this.play(Single(5)))} />
              </td>
              <td>
                <StdButton text={"8"} disabled={!this.state.canPlay} onClick={trusted(() => this.play(Single(8)))} />
              </td>
              <td>
                <StdButton text={"11"} disabled={!this.state.canPlay} onClick={trusted(() => this.play(Single(11)))} />
              </td>
              <td>
                <StdButton text={"14"} disabled={!this.state.canPlay} onClick={trusted(() => this.play(Single(14)))} />
              </td>
              <td>
                <StdButton text={"17"} disabled={!this.state.canPlay} onClick={trusted(() => this.play(Single(17)))} />
              </td>
              <td>
                <StdButton text={"20"} disabled={!this.state.canPlay} onClick={trusted(() => this.play(Single(20)))} />
              </td>
              <td>
                <StdButton text={"23"} disabled={!this.state.canPlay} onClick={trusted(() => this.play(Single(23)))} />
              </td>
              <td>
                <StdButton text={"26"} disabled={!this.state.canPlay} onClick={trusted(() => this.play(Single(26)))} />
              </td>
              <td>
                <StdButton text={"29"} disabled={!this.state.canPlay} onClick={trusted(() => this.play(Single(29)))} />
              </td>
              <td>
                <StdButton text={"32"} disabled={!this.state.canPlay} onClick={trusted(() => this.play(Single(32)))} />
              </td>
              <td>
                <StdButton text={"35"} disabled={!this.state.canPlay} onClick={trusted(() => this.play(Single(35)))} />
              </td>
            </tr>
            <tr>
              <td>
                <StdButton text={"1"} disabled={!this.state.canPlay} onClick={trusted(() => this.play(Single(1)))} />
              </td>
              <td>
                <StdButton text={"4"} disabled={!this.state.canPlay} onClick={trusted(() => this.play(Single(4)))} />
              </td>
              <td>
                <StdButton text={"7"} disabled={!this.state.canPlay} onClick={trusted(() => this.play(Single(7)))} />
              </td>
              <td>
                <StdButton text={"10"} disabled={!this.state.canPlay} onClick={trusted(() => this.play(Single(10)))} />
              </td>
              <td>
                <StdButton text={"13"} disabled={!this.state.canPlay} onClick={trusted(() => this.play(Single(13)))} />
              </td>
              <td>
                <StdButton text={"16"} disabled={!this.state.canPlay} onClick={trusted(() => this.play(Single(16)))} />
              </td>
              <td>
                <StdButton text={"19"} disabled={!this.state.canPlay} onClick={trusted(() => this.play(Single(19)))} />
              </td>
              <td>
                <StdButton text={"22"} disabled={!this.state.canPlay} onClick={trusted(() => this.play(Single(22)))} />
              </td>
              <td>
                <StdButton text={"25"} disabled={!this.state.canPlay} onClick={trusted(() => this.play(Single(25)))} />
              </td>
              <td>
                <StdButton text={"28"} disabled={!this.state.canPlay} onClick={trusted(() => this.play(Single(28)))} />
              </td>
              <td>
                <StdButton text={"31"} disabled={!this.state.canPlay} onClick={trusted(() => this.play(Single(31)))} />
              </td>
              <td>
                <StdButton text={"34"} disabled={!this.state.canPlay} onClick={trusted(() => this.play(Single(34)))} />
              </td>
            </tr>
            <tr>
              <td colSpan={4}>
                <StdButton
                  text={"1 to 12"}
                  disabled={!this.state.canPlay}
                  onClick={trusted(() => this.play(strategies.Third1))}
                />
              </td>
              <td colSpan={4}>
                <StdButton
                  text={"13 to 24"}
                  disabled={!this.state.canPlay}
                  onClick={trusted(() => this.play(strategies.Third2))}
                />
              </td>
              <td colSpan={4}>
                <StdButton
                  text={"25 to 36"}
                  disabled={!this.state.canPlay}
                  onClick={trusted(() => this.play(strategies.Third3))}
                />
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                <StdButton
                  text={"Red"}
                  disabled={!this.state.canPlay}
                  onClick={trusted(() => this.play(strategies.Red))}
                />
              </td>
              <td colSpan={2}>
                <StdButton
                  text={"Black"}
                  disabled={!this.state.canPlay}
                  onClick={trusted(() => this.play(strategies.Black))}
                />
              </td>
              <td colSpan={2}>
                <StdButton
                  text={"Odd"}
                  disabled={!this.state.canPlay}
                  onClick={trusted(() => this.play(strategies.Odd))}
                />
              </td>
              <td colSpan={2}>
                <StdButton
                  text={"Even"}
                  disabled={!this.state.canPlay}
                  onClick={trusted(() => this.play(strategies.Even))}
                />
              </td>
              <td colSpan={2}>
                <StdButton
                  text={"High"}
                  disabled={!this.state.canPlay}
                  onClick={trusted(() => this.play(strategies.High))}
                />
              </td>
              <td colSpan={2}>
                <StdButton
                  text={"Low"}
                  disabled={!this.state.canPlay}
                  onClick={trusted(() => this.play(strategies.Low))}
                />
              </td>
            </tr>
            <tr>
              <td>
                <StdButton text={"0"} disabled={!this.state.canPlay} onClick={trusted(() => this.play(Single(0)))} />
              </td>
            </tr>
          </tbody>
        </table>
      </>
    );
  }
}
