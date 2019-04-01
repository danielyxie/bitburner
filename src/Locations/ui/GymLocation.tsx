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

type IProps = {
    loc: Location;
    p: IPlayer;
}

export class GymLocation extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);

        this.trainStrength = this.trainStrength.bind(this);
        this.trainDefense = this.trainDefense.bind(this);
        this.trainDexterity = this.trainDexterity.bind(this);
        this.trainAgility = this.trainAgility.bind(this);
    }

    train(stat: string) {
        const loc = this.props.loc;
        this.props.p.startClass(loc.costMult, loc.expMult, stat);
    }

    trainStrength() {
        return this.train(CONSTANTS.ClassGymStrength);
    }

    trainDefense() {
        return this.train(CONSTANTS.ClassGymDefense);
    }

    trainDexterity() {
        return this.train(CONSTANTS.ClassGymDexterity);
    }

    trainAgility() {
        return this.train(CONSTANTS.ClassGymAgility);
    }

    render() {
        const costMult: number = this.props.loc.costMult;

        const cost = CONSTANTS.ClassGymBaseCost * costMult;

        return (
            <div>
                <StdButton
                    onClick={this.trainStrength}
                    text={`Train Strength (${numeralWrapper.formatMoney(cost)} / sec)`}
                />
                <StdButton
                    onClick={this.trainDefense}
                    text={`Train Defense (${numeralWrapper.formatMoney(cost)} / sec)`}
                />
                <StdButton
                    onClick={this.trainDexterity}
                    text={`Train Dexterity (${numeralWrapper.formatMoney(cost)} / sec)`}
                />
                <StdButton
                    onClick={this.trainAgility}
                    text={`Train Agility (${numeralWrapper.formatMoney(cost)} / sec)`}
                />
            </div>
        )
    }
}
