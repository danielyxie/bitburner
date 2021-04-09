/**
 * React Subcomponent for displaying a location's UI, when that location is a gym
 *
 * This subcomponent renders all of the buttons for training at the gym
 */
import * as React from "react";

import { IPlayer }          from "../PersonObjects/IPlayer";
import { StdButton }        from "../ui/React/StdButton";
import { WHRNG }           from "./RNG";

type IProps = {
    p: IPlayer;
}

type IState = {
    investment: number;
    result: any;
}

const maxPlay = 10000;

export class Roulette extends React.Component<IProps, IState> {
    rng: WHRNG;

    constructor(props: IProps) {
        super(props);
        console.log(this.props.p.totalPlaytime);
        this.rng = new WHRNG(this.props.p.totalPlaytime);

        this.state = {
            investment: 1000,
            result: <span> </span>,
        };

        this.play = this.play.bind(this);
        this.updateInvestment = this.updateInvestment.bind(this);
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

    play(guess: string) {
        const v = this.rng.random();
        let letter: string;
        if (v < 0.5) {
            letter = 'H';
        } else {
            letter = 'T';
        }
        const correct: boolean = guess===letter;
        this.setState({result: <span className={correct ? "text" : "failure"}>{letter}</span>});
        if (correct) {
            this.props.p.gainMoney(this.state.investment);
        } else {
            this.props.p.loseMoney(this.state.investment);
        }
    }


    render() {
        return <>
<pre>
+———————+<br />
| |   | |<br />
| | {this.state.result} | |<br />
| |   | |<br />
+———————+<br />
</pre>
        <span className="text">Play for: </span><input type="number" className='text-input' onChange={this.updateInvestment} value={this.state.investment} /><br />
        <StdButton onClick={() => this.play('H')} text={"Head!"} />
        <StdButton onClick={() => this.play('T')} text={"Tail!"} />
        </>
    }
}