/**
 * React Subcomponent for displaying a location's UI, when that location is a gym
 *
 * This subcomponent renders all of the buttons for training at the gym
 */
import * as React from "react";

import { IPlayer }          from "../PersonObjects/IPlayer";
import { StdButton }        from "../ui/React/StdButton";
import { BadRNG }           from "./RNG";

type IProps = {
    p: IPlayer;
}

type IState = {
    investment: number;
    result: any;
}

const maxPlay = 10e3;

export class CoinFlip extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

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
        const v = BadRNG.random();
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