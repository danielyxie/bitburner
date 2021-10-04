import React, { useState, useEffect } from "react";

import { IPlayer } from "../PersonObjects/IPlayer";
import { Money } from "../ui/React/Money";
import { win, reachedLimit } from "./Game";
import { WHRNG } from "./RNG";
import { trusted } from "./utils";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

type IProps = {
  p: IPlayer;
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

export function Roulette(props: IProps): React.ReactElement {
  const [rng] = useState(new WHRNG(new Date().getTime()));
  const [investment, setInvestment] = useState(1000);
  const [canPlay, setCanPlay] = useState(true);
  const [status, setStatus] = useState<string | JSX.Element>("waiting");
  const [n, setN] = useState(0);
  const [lock, setLock] = useState(true);
  const [strategy, setStrategy] = useState<Strategy>({
    payout: 0,
    match: (): boolean => {
      return false;
    },
  });

  useEffect(() => {
    const i = window.setInterval(step, 50);
    return () => clearInterval(i);
  });

  function step(): void {
    if (!lock) {
      setN(Math.floor(Math.random() * 37));
    }
  }

  function updateInvestment(e: React.ChangeEvent<HTMLInputElement>): void {
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
    setInvestment(investment);
  }

  function currentNumber(): string {
    if (n === 0) return "0";
    const color = isRed(n) ? "R" : "B";
    return `${n}${color}`;
  }

  function play(s: Strategy): void {
    if (reachedLimit(props.p)) return;

    setCanPlay(false);
    setLock(false);
    setStatus("playing");
    setStrategy(s);

    setTimeout(() => {
      let n = Math.floor(rng.random() * 37);
      let status = <></>;
      let gain = 0;
      let playerWin = strategy.match(n);
      // oh yeah, the house straight up cheats. Try finding the seed now!
      if (playerWin && Math.random() > 0.9) {
        playerWin = false;
        while (strategy.match(n)) {
          n = (n + 1) % 36;
        }
      }
      if (playerWin) {
        gain = investment * strategy.payout;
        status = (
          <>
            won <Money money={gain} />
          </>
        );
      } else {
        gain = -investment;
        status = (
          <>
            lost <Money money={-gain} />
          </>
        );
      }
      win(props.p, gain);

      setCanPlay(true);
      setLock(true);
      setStatus(status);
      setN(n);

      reachedLimit(props.p);
    }, 1600);
  }

  return (
    <>
      <Typography variant="h4">{currentNumber()}</Typography>
      <TextField type="number" onChange={updateInvestment} placeholder={"Amount to play"} disabled={!canPlay} />
      <Typography variant="h4">{status}</Typography>
      <table>
        <tbody>
          <tr>
            <td>
              <Button disabled={!canPlay} onClick={trusted(() => play(Single(3)))}>
                3
              </Button>
            </td>
            <td>
              <Button disabled={!canPlay} onClick={trusted(() => play(Single(6)))}>
                6
              </Button>
            </td>
            <td>
              <Button disabled={!canPlay} onClick={trusted(() => play(Single(9)))}>
                9
              </Button>
            </td>
            <td>
              <Button disabled={!canPlay} onClick={trusted(() => play(Single(12)))}>
                12
              </Button>
            </td>
            <td>
              <Button disabled={!canPlay} onClick={trusted(() => play(Single(15)))}>
                15
              </Button>
            </td>
            <td>
              <Button disabled={!canPlay} onClick={trusted(() => play(Single(18)))}>
                18
              </Button>
            </td>
            <td>
              <Button disabled={!canPlay} onClick={trusted(() => play(Single(21)))}>
                21
              </Button>
            </td>
            <td>
              <Button disabled={!canPlay} onClick={trusted(() => play(Single(24)))}>
                24
              </Button>
            </td>
            <td>
              <Button disabled={!canPlay} onClick={trusted(() => play(Single(27)))}>
                27
              </Button>
            </td>
            <td>
              <Button disabled={!canPlay} onClick={trusted(() => play(Single(30)))}>
                30
              </Button>
            </td>
            <td>
              <Button disabled={!canPlay} onClick={trusted(() => play(Single(33)))}>
                33
              </Button>
            </td>
            <td>
              <Button disabled={!canPlay} onClick={trusted(() => play(Single(36)))}>
                36
              </Button>
            </td>
          </tr>
          <tr>
            <td>
              <Button disabled={!canPlay} onClick={trusted(() => play(Single(2)))}>
                2
              </Button>
            </td>
            <td>
              <Button disabled={!canPlay} onClick={trusted(() => play(Single(5)))}>
                5
              </Button>
            </td>
            <td>
              <Button disabled={!canPlay} onClick={trusted(() => play(Single(8)))}>
                8
              </Button>
            </td>
            <td>
              <Button disabled={!canPlay} onClick={trusted(() => play(Single(11)))}>
                11
              </Button>
            </td>
            <td>
              <Button disabled={!canPlay} onClick={trusted(() => play(Single(14)))}>
                14
              </Button>
            </td>
            <td>
              <Button disabled={!canPlay} onClick={trusted(() => play(Single(17)))}>
                17
              </Button>
            </td>
            <td>
              <Button disabled={!canPlay} onClick={trusted(() => play(Single(20)))}>
                20
              </Button>
            </td>
            <td>
              <Button disabled={!canPlay} onClick={trusted(() => play(Single(23)))}>
                23
              </Button>
            </td>
            <td>
              <Button disabled={!canPlay} onClick={trusted(() => play(Single(26)))}>
                26
              </Button>
            </td>
            <td>
              <Button disabled={!canPlay} onClick={trusted(() => play(Single(29)))}>
                29
              </Button>
            </td>
            <td>
              <Button disabled={!canPlay} onClick={trusted(() => play(Single(32)))}>
                32
              </Button>
            </td>
            <td>
              <Button disabled={!canPlay} onClick={trusted(() => play(Single(35)))}>
                35
              </Button>
            </td>
          </tr>
          <tr>
            <td>
              <Button disabled={!canPlay} onClick={trusted(() => play(Single(1)))}>
                1
              </Button>
            </td>
            <td>
              <Button disabled={!canPlay} onClick={trusted(() => play(Single(4)))}>
                4
              </Button>
            </td>
            <td>
              <Button disabled={!canPlay} onClick={trusted(() => play(Single(7)))}>
                7
              </Button>
            </td>
            <td>
              <Button disabled={!canPlay} onClick={trusted(() => play(Single(10)))}>
                10
              </Button>
            </td>
            <td>
              <Button disabled={!canPlay} onClick={trusted(() => play(Single(13)))}>
                13
              </Button>
            </td>
            <td>
              <Button disabled={!canPlay} onClick={trusted(() => play(Single(16)))}>
                16
              </Button>
            </td>
            <td>
              <Button disabled={!canPlay} onClick={trusted(() => play(Single(19)))}>
                19
              </Button>
            </td>
            <td>
              <Button disabled={!canPlay} onClick={trusted(() => play(Single(22)))}>
                22
              </Button>
            </td>
            <td>
              <Button disabled={!canPlay} onClick={trusted(() => play(Single(25)))}>
                25
              </Button>
            </td>
            <td>
              <Button disabled={!canPlay} onClick={trusted(() => play(Single(28)))}>
                28
              </Button>
            </td>
            <td>
              <Button disabled={!canPlay} onClick={trusted(() => play(Single(31)))}>
                31
              </Button>
            </td>
            <td>
              <Button disabled={!canPlay} onClick={trusted(() => play(Single(34)))}>
                34
              </Button>
            </td>
          </tr>
          <tr>
            <td colSpan={4}>
              <Button disabled={!canPlay} onClick={trusted(() => play(strategies.Third1))}>
                1 to 12
              </Button>
            </td>
            <td colSpan={4}>
              <Button disabled={!canPlay} onClick={trusted(() => play(strategies.Third2))}>
                13 to 24
              </Button>
            </td>
            <td colSpan={4}>
              <Button disabled={!canPlay} onClick={trusted(() => play(strategies.Third3))}>
                25 to 36
              </Button>
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <Button disabled={!canPlay} onClick={trusted(() => play(strategies.Red))}>
                Red
              </Button>
            </td>
            <td colSpan={2}>
              <Button disabled={!canPlay} onClick={trusted(() => play(strategies.Black))}>
                Black
              </Button>
            </td>
            <td colSpan={2}>
              <Button disabled={!canPlay} onClick={trusted(() => play(strategies.Odd))}>
                Odd
              </Button>
            </td>
            <td colSpan={2}>
              <Button disabled={!canPlay} onClick={trusted(() => play(strategies.Even))}>
                Even
              </Button>
            </td>
            <td colSpan={2}>
              <Button disabled={!canPlay} onClick={trusted(() => play(strategies.High))}>
                High
              </Button>
            </td>
            <td colSpan={2}>
              <Button disabled={!canPlay} onClick={trusted(() => play(strategies.Low))}>
                Low
              </Button>
            </td>
          </tr>
          <tr>
            <td>
              <Button disabled={!canPlay} onClick={trusted(() => play(Single(0)))}>
                0
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
