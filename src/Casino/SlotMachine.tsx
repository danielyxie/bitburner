/**
 * React Subcomponent for displaying a location's UI, when that location is a gym
 *
 * This subcomponent renders all of the buttons for training at the gym
 */
import * as React from "react";

import { IPlayer }          from "../PersonObjects/IPlayer";
import { StdButton }        from "../ui/React/StdButton";
import { WHRNG }            from "./RNG";

type IProps = {
    p: IPlayer;
}

type IState = {
    index: number[];
    locks: number[];
    investment: number;
    canPlay: boolean;
}

const symbols = ["C", "♥", "C", "D", "C","!", "?", "@", "$", "*", "7", "*", "?"]

const maxPlay = 100e3;

export class SlotMachine extends React.Component<IProps, IState> {
    rng: WHRNG;
    interval: number = -1;

    constructor(props: IProps) {
        super(props);
        this.rng = new WHRNG(this.props.p.totalPlaytime);

        this.state = {
            index: [0, 0, 0, 0, 0],
            investment: 1000,
            locks: [0, 0, 0, 0, 0],
            canPlay: true,
        };

        this.play = this.play.bind(this);
        this.lock = this.lock.bind(this);
        this.unlock = this.unlock.bind(this);
        this.step = this.step.bind(this);
        this.checkWinnings = this.checkWinnings.bind(this);
        this.updateInvestment = this.updateInvestment.bind(this);
    }

    componentDidMount() {
        this.interval = setInterval(this.step, 100);
    }

    step() {
        let stoppedOne = false;
        const index = this.state.index.slice();
        for(const i in index) {
            if (index[i] === this.state.locks[i] && !stoppedOne) continue;
            index[i] = (index[i] + 1) % symbols.length;
            stoppedOne = true;
        }

        if(stoppedOne && index.every((e, i) => e === this.state.locks[i])) {
            this.checkWinnings();
        }

        this.setState({index: index});
    }

    componentWillUnmount() {
      clearInterval(this.interval);
    }

    play() {
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
            canPlay: true,
        })
    }

    checkWinnings() {

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
            investment = 1000;
        }
        if (investment > maxPlay) {
            investment = maxPlay;
        }
        this.setState({investment: investment});
    }

    render() {
        return <>
<pre>
+———————————————————————+<br />
| | {symbols[(this.state.index[0]+symbols.length-1)%symbols.length]} | {symbols[(this.state.index[1]+symbols.length-1)%symbols.length]} | {symbols[(this.state.index[2]+symbols.length-1)%symbols.length]} | {symbols[(this.state.index[3]+symbols.length-1)%symbols.length]} | {symbols[(this.state.index[4]+symbols.length-1)%symbols.length]} | |<br />
| |   |   |   |   |   | |<br />
| | {symbols[this.state.index[0]]} | {symbols[this.state.index[1]]} | {symbols[this.state.index[2]]} | {symbols[this.state.index[3]]} | {symbols[this.state.index[4]]} | |<br />
| |   |   |   |   |   | |<br />
| | {symbols[(this.state.index[0]+1)%symbols.length]} | {symbols[(this.state.index[1]+1)%symbols.length]} | {symbols[(this.state.index[2]+1)%symbols.length]} | {symbols[(this.state.index[3]+1)%symbols.length]} | {symbols[(this.state.index[4]+1)%symbols.length]} | |<br />
+———————————————————————+<br />
</pre>
        <input type="number" className='text-input' onChange={this.updateInvestment} placeholder={"Amount to play"} value={this.state.investment} disabled={!this.state.canPlay} />
        <StdButton onClick={this.play} text={"Spin!"} />

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