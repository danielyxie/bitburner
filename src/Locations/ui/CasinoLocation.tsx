/**
 * React Subcomponent for displaying a location's UI, when that location is a gym
 *
 * This subcomponent renders all of the buttons for training at the gym
 */
import * as React from "react";

import { Location }         from "../Location";

import { CONSTANTS }        from "../../Constants";
import { IPlayer }          from "../../PersonObjects/IPlayer";

import { numeralWrapper }   from "../../ui/numeralFormat";
import { StdButton }        from "../../ui/React/StdButton";
import { Money }            from "../../ui/React/Money";
import { SlotMachine }      from "../../Casino/SlotMachine";
import { CoinFlip }         from "../../Casino/CoinFlip";
import { Roulette }         from "../../Casino/Roulette";

type IProps = {
    p: IPlayer;
}

type IState = {
    game: string;
}

export class CasinoLocation extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            game: '',
        }

        this.updateGame = this.updateGame.bind(this);
    }

    updateGame(game: string) {
        this.setState({
            game: game,
        });
    }

    renderGames() {
        return (<>
            <StdButton
                onClick={() => this.updateGame('slots')}
                text={"Play slots"}
            /><br />
            <StdButton
                onClick={() => this.updateGame('coin')}
                text={"Play coin flip"}
            /><br />
            <StdButton
                onClick={() => this.updateGame('roulette')}
                text={"Play roulette"}
            />
        </>)
    }

    renderGame() {
        let elem;
        switch(this.state.game) {
        case 'slots':
            elem = <SlotMachine p={this.props.p} />
            break;
        case 'coin':
            elem = <CoinFlip p={this.props.p} />
            break;
        case 'roulette':
            elem = <Roulette p={this.props.p} />
            break;
        }

        return (<>
            <StdButton onClick={() => this.updateGame('')} text={"Stop playing"} />
            {elem}
        </>)
    }

    render() {
        if(!this.state.game) {
            return this.renderGames();
        } else {
            return this.renderGame();
        }
    }
}