import React, { useState, useEffect } from "react";

import { IPlayer } from "../PersonObjects/IPlayer";
import { Money } from "../ui/React/Money";
import { WHRNG } from "./RNG";
import { win, reachedLimit } from "./Game";
import { trusted } from "./utils";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

type IProps = {
  p: IPlayer;
};

type IState = {
  index: number[];
  locks: number[];
  investment: number;
  canPlay: boolean;
  status: string | JSX.Element;
};

// statically shuffled array of symbols.
const symbols = [
  "D",
  "C",
  "$",
  "?",
  "♥",
  "A",
  "C",
  "B",
  "C",
  "E",
  "B",
  "E",
  "C",
  "*",
  "D",
  "♥",
  "B",
  "A",
  "A",
  "A",
  "C",
  "A",
  "D",
  "B",
  "E",
  "?",
  "D",
  "*",
  "@",
  "♥",
  "B",
  "E",
  "?",
];

function getPayout(s: string, n: number): number {
  switch (s) {
    case "$":
      return [20, 200, 1000][n];
    case "@":
      return [8, 80, 400][n];
    case "♥":
    case "?":
      return [6, 20, 150][n];
    case "D":
    case "E":
      return [1, 8, 30][n];
    default:
      return [1, 5, 20][n];
  }
}

const payLines = [
  // lines
  [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
  ],
  [
    [1, 0],
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4],
  ],
  [
    [2, 0],
    [2, 1],
    [2, 2],
    [2, 3],
    [2, 4],
  ],

  // Vs
  [
    [2, 0],
    [1, 1],
    [0, 2],
    [1, 3],
    [2, 4],
  ],
  [
    [0, 0],
    [1, 1],
    [2, 2],
    [1, 3],
    [0, 4],
  ],

  // rest
  [
    [0, 0],
    [1, 1],
    [1, 2],
    [1, 3],
    [0, 4],
  ],
  [
    [2, 0],
    [1, 1],
    [1, 2],
    [1, 3],
    [2, 4],
  ],
  [
    [1, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 4],
  ],
  [
    [1, 0],
    [2, 1],
    [2, 2],
    [2, 3],
    [1, 4],
  ],
];

const minPlay = 0;
const maxPlay = 1e6;

export function SlotMachine(props: IProps): React.ReactElement {
  const [rng] = useState(new WHRNG(props.p.totalPlaytime));
  const [index, setIndex] = useState<number[]>([0, 0, 0, 0, 0]);
  const [locks, setLocks] = useState<number[]>([0, 0, 0, 0, 0]);
  const [investment, setInvestment] = useState(1000);
  const [canPlay, setCanPlay] = useState(true);
  const [status, setStatus] = useState<string | JSX.Element>("waiting");

  useEffect(() => {
    const i = window.setInterval(step, 50);
    return () => clearInterval(i);
  });

  function step(): void {
    let stoppedOne = false;
    const copy = index.slice();
    for (const i in copy) {
      if (copy[i] === locks[i] && !stoppedOne) continue;
      copy[i] = (copy[i] + 1) % symbols.length;
      stoppedOne = true;
    }

    setIndex(copy);

    if (stoppedOne && copy.every((e, i) => e === locks[i])) {
      checkWinnings();
    }
  }

  function getTable(): string[][] {
    return [
      [
        symbols[(index[0] + symbols.length - 1) % symbols.length],
        symbols[(index[1] + symbols.length - 1) % symbols.length],
        symbols[(index[2] + symbols.length - 1) % symbols.length],
        symbols[(index[3] + symbols.length - 1) % symbols.length],
        symbols[(index[4] + symbols.length - 1) % symbols.length],
      ],
      [symbols[index[0]], symbols[index[1]], symbols[index[2]], symbols[index[3]], symbols[index[4]]],
      [
        symbols[(index[0] + 1) % symbols.length],
        symbols[(index[1] + 1) % symbols.length],
        symbols[(index[2] + 1) % symbols.length],
        symbols[(index[3] + 1) % symbols.length],
        symbols[(index[4] + 1) % symbols.length],
      ],
    ];
  }

  function play(): void {
    if (reachedLimit(props.p)) return;
    setStatus("playing");
    win(props.p, -investment);
    if (!canPlay) return;
    unlock();
    setTimeout(lock, rng.random() * 2000 + 1000);
  }

  function lock(): void {
    setLocks([
      Math.floor(rng.random() * symbols.length),
      Math.floor(rng.random() * symbols.length),
      Math.floor(rng.random() * symbols.length),
      Math.floor(rng.random() * symbols.length),
      Math.floor(rng.random() * symbols.length),
    ]);
  }

  function checkWinnings(): void {
    const t = getTable();
    const getPaylineData = function (payline: number[][]): string[] {
      const data = [];
      for (const point of payline) {
        data.push(t[point[0]][point[1]]);
      }
      return data;
    };

    const countSequence = function (data: string[]): number {
      let count = 1;
      for (let i = 1; i < data.length; i++) {
        if (data[i] !== data[i - 1]) break;
        count++;
      }

      return count;
    };

    let gains = -investment;
    for (const payline of payLines) {
      const data = getPaylineData(payline);
      const count = countSequence(data);
      if (count < 3) continue;
      const payout = getPayout(data[0], count - 3);
      gains += investment * payout;
      win(props.p, investment * payout);
    }

    setStatus(
      <>
        {gains > 0 ? "gained" : "lost"} <Money money={Math.abs(gains)} />
      </>,
    );
    setCanPlay(true);
    if (reachedLimit(props.p)) return;
  }

  function unlock(): void {
    setLocks([-1, -1, -1, -1, -1]);
    setCanPlay(false);
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

  const t = getTable();
  // prettier-ignore
  return (
      <>
<Typography sx={{ lineHeight: "1em", whiteSpace: "pre" }}>+———————————————————————+</Typography>
<Typography sx={{ lineHeight: "1em", whiteSpace: "pre" }}>| | {t[0][0]} | {t[0][1]} | {t[0][2]} | {t[0][3]} | {t[0][4]} | |</Typography>
<Typography sx={{ lineHeight: "1em", whiteSpace: "pre" }}>| |   |   |   |   |   | |</Typography>
<Typography sx={{ lineHeight: "1em", whiteSpace: "pre" }}>| | {symbols[index[0]]} | {symbols[index[1]]} | {symbols[index[2]]} | {symbols[index[3]]} | {symbols[index[4]]} | |</Typography>
<Typography sx={{ lineHeight: "1em", whiteSpace: "pre" }}>| |   |   |   |   |   | |</Typography>
<Typography sx={{ lineHeight: "1em", whiteSpace: "pre" }}>| | {symbols[(index[0]+1)%symbols.length]} | {symbols[(index[1]+1)%symbols.length]} | {symbols[(index[2]+1)%symbols.length]} | {symbols[(index[3]+1)%symbols.length]} | {symbols[(index[4]+1)%symbols.length]} | |</Typography>
<Typography sx={{ lineHeight: "1em", whiteSpace: "pre" }}>+———————————————————————+</Typography>
        <TextField
          type="number"
          onChange={updateInvestment}
          placeholder={"Amount to play"}
          disabled={!canPlay}
          InputProps={{endAdornment:(<Button
            onClick={trusted(play)}
            disabled={!canPlay}
          >Spin!</Button>)}}
        />
        
        <Typography variant="h4">{status}</Typography>
        <Typography>Pay lines</Typography>

<Typography sx={{ lineHeight: "1em", whiteSpace: "pre" }}>-----   ·····   ·····</Typography>
<Typography sx={{ lineHeight: "1em", whiteSpace: "pre" }}>·····   -----   ·····</Typography>
<Typography sx={{ lineHeight: "1em", whiteSpace: "pre" }}>·····   ·····   -----</Typography>
<br />

<Typography sx={{ lineHeight: "1em", whiteSpace: "pre" }}>··^··   \···/   \···/</Typography>
<Typography sx={{ lineHeight: "1em", whiteSpace: "pre" }}>·/·\·   ·\·/·   ·---·</Typography>
<Typography sx={{ lineHeight: "1em", whiteSpace: "pre" }}>/···\   ··v··   ·····</Typography>
<br />

<Typography sx={{ lineHeight: "1em", whiteSpace: "pre" }}>·····   ·---·   ·····</Typography>
<Typography sx={{ lineHeight: "1em", whiteSpace: "pre" }}>·---·   /···\   \···/</Typography>
<Typography sx={{ lineHeight: "1em", whiteSpace: "pre" }}>/···\   ·····   ·---·</Typography>
        </>
    );
}

// https://felgo.com/doc/how-to-make-a-slot-game-tutorial/
