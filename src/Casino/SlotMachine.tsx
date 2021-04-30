import * as React from "react";

import { IPlayer }   from "../PersonObjects/IPlayer";
import { StdButton } from "../ui/React/StdButton";
import { Money }     from "../ui/React/Money";
import { WHRNG }     from "./RNG";
import { Game }      from "./Game";
import { trusted }   from "./utils";

type IProps = {
    p: IPlayer;
}

type IState = {
    index: number[];
    locks: number[];
    investment: number;
    canPlay: boolean;
    status: string | JSX.Element;
}

// statically shuffled array of symbols.
const symbols = ["D", "C", "$", "?", "♥", "A", "C", "B", "C", "E", "B", "E", "C",
    "*", "D", "♥", "B", "A", "A", "A", "C", "A", "D", "B", "E", "?", "D", "*",
    "@", "♥", "B", "E", "?"];

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
    [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]],
    [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4]],
    [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4]],

    // Vs
    [[2, 0], [1, 1], [0, 2], [1, 3], [2, 4]],
    [[0, 0], [1, 1], [2, 2], [1, 3], [0, 4]],

    // rest
    [[0, 0], [1, 1], [1, 2], [1, 3], [0, 4]],
    [[2, 0], [1, 1], [1, 2], [1, 3], [2, 4]],
    [[1, 0], [0, 1], [0, 2], [0, 3], [1, 4]],
    [[1, 0], [2, 1], [2, 2], [2, 3], [1, 4]],
];

const minPlay = 0;
const maxPlay = 1e6;

export class SlotMachine extends Game<IProps, IState> {
    rng: WHRNG;
    interval = -1;

    constructor(props: IProps) {
        super(props);
        this.rng = new WHRNG(this.props.p.totalPlaytime);

        this.state = {
            index: [0, 0, 0, 0, 0],
            investment: 1000,
            locks: [0, 0, 0, 0, 0],
            canPlay: true,
            status: 'waiting',
        };

        this.play = this.play.bind(this);
        this.lock = this.lock.bind(this);
        this.unlock = this.unlock.bind(this);
        this.step = this.step.bind(this);
        this.checkWinnings = this.checkWinnings.bind(this);
        this.getTable = this.getTable.bind(this);
        this.updateInvestment = this.updateInvestment.bind(this);
    }

    componentDidMount() {
        this.interval = setInterval(this.step, 50);
    }

    step() {
        let stoppedOne = false;
        const index = this.state.index.slice();
        for(const i in index) {
            if (index[i] === this.state.locks[i] && !stoppedOne) continue;
            index[i] = (index[i] + 1) % symbols.length;
            stoppedOne = true;
        }

        this.setState({index: index});

        if(stoppedOne && index.every((e, i) => e === this.state.locks[i])) {
            this.checkWinnings();
        }
    }

    componentWillUnmount() {
      clearInterval(this.interval);
    }

    getTable(): string[][] {
        return [
            [symbols[(this.state.index[0]+symbols.length-1)%symbols.length], symbols[(this.state.index[1]+symbols.length-1)%symbols.length], symbols[(this.state.index[2]+symbols.length-1)%symbols.length], symbols[(this.state.index[3]+symbols.length-1)%symbols.length], symbols[(this.state.index[4]+symbols.length-1)%symbols.length]],
            [symbols[this.state.index[0]], symbols[this.state.index[1]], symbols[this.state.index[2]], symbols[this.state.index[3]], symbols[this.state.index[4]]],
            [symbols[(this.state.index[0]+1)%symbols.length], symbols[(this.state.index[1]+1)%symbols.length], symbols[(this.state.index[2]+1)%symbols.length], symbols[(this.state.index[3]+1)%symbols.length], symbols[(this.state.index[4]+1)%symbols.length]],
        ];
    }

    play() {
        if(this.reachedLimit(this.props.p)) return;
        this.setState({status: 'playing'});
        this.win(this.props.p, -this.state.investment);
        if(!this.state.canPlay) return;
        this.unlock();
        setTimeout(this.lock, this.rng.random()*2000+1000);
    }

    lock() {
        this.setState({
            locks: [
                Math.floor(this.rng.random()*symbols.length),
                Math.floor(this.rng.random()*symbols.length),
                Math.floor(this.rng.random()*symbols.length),
                Math.floor(this.rng.random()*symbols.length),
                Math.floor(this.rng.random()*symbols.length),
            ],
        })
    }

    checkWinnings() {
        const t = this.getTable();
        const getPaylineData = function(payline: number[][]): string[] {
            const data = [];
            for(const point of payline) {
                data.push(t[point[0]][point[1]]);
            }
            return data;
        }

        const countSequence = function(data: string[]): number {
            let count = 1;
            for(let i = 1; i < data.length; i++) {
                if (data[i]!==data[i-1]) break;
                count++;
            }

            return count;
        }

        let gains = -this.state.investment;
        for (const payline of payLines) {
            const data = getPaylineData(payline);
            const count = countSequence(data);
            if (count < 3) continue;
            const payout = getPayout(data[0], count-3);
            gains += this.state.investment*payout;
            this.win(this.props.p, this.state.investment*payout);
        }

        this.setState({
            status: <>{gains>0?"gained":"lost"} {Money(Math.abs(gains))}</>,
            canPlay: true,
        })
        if(this.reachedLimit(this.props.p)) return;
    }

    unlock() {
        this.setState({
            locks: [-1, -1, -1, -1, -1],
            canPlay: false,
        })
    }

    updateInvestment(e: React.FormEvent<HTMLInputElement>) {
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
        this.setState({investment: investment});
    }

    render() {
        const t = this.getTable();
        return <>
<pre>
+———————————————————————+<br />
| | {t[0][0]} | {t[0][1]} | {t[0][2]} | {t[0][3]} | {t[0][4]} | |<br />
| |   |   |   |   |   | |<br />
| | {symbols[this.state.index[0]]} | {symbols[this.state.index[1]]} | {symbols[this.state.index[2]]} | {symbols[this.state.index[3]]} | {symbols[this.state.index[4]]} | |<br />
| |   |   |   |   |   | |<br />
| | {symbols[(this.state.index[0]+1)%symbols.length]} | {symbols[(this.state.index[1]+1)%symbols.length]} | {symbols[(this.state.index[2]+1)%symbols.length]} | {symbols[(this.state.index[3]+1)%symbols.length]} | {symbols[(this.state.index[4]+1)%symbols.length]} | |<br />
+———————————————————————+<br />
</pre>
        <input type="number" className="text-input" onChange={this.updateInvestment} placeholder={"Amount to play"} value={this.state.investment} disabled={!this.state.canPlay} />
        <StdButton onClick={trusted(this.play)} text={"Spin!"} disabled={!this.state.canPlay} />
<h1>{this.state.status}</h1>
<h2>Pay lines</h2>
<pre>
-----   ·····   ····· <br />
·····   -----   ····· <br />
·····   ·····   ----- <br />
</pre>
<br />

<pre>
··^··   \···/   \···/<br />
·/·\·   ·\·/·   ·---·<br />
/···\   ··v··   ·····<br />
</pre>
<br />

<pre>
·····   ·---·   ·····<br />
·---·   /···\   \···/<br />
/···\   ·····   ·---·<br />
</pre>
        </>
    }
}

// https://felgo.com/doc/how-to-make-a-slot-game-tutorial/