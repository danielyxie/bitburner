/**
 * React Subcomponent for displaying a location's UI, when that location is a hospital
 *
 * This subcomponent renders all of the buttons for hospital options
 */
import * as React from "react";

import { CONSTANTS }                from "../../Constants";
import { IPlayer }                  from "../../PersonObjects/IPlayer";

import { numeralWrapper }           from "../../ui/numeralFormat";
import { AutoupdatingStdButton }    from "../../ui/React/AutoupdatingStdButton";
import { Money }                    from "../../ui/React/Money";

import { dialogBoxCreate }          from "../../../utils/DialogBox";

type IProps = {
    p: IPlayer;
}

type IState = {
    currHp: number;
}

export class HospitalLocation extends React.Component<IProps, IState> {
    /**
     * Stores button styling that sets them all to block display
     */
    btnStyle: object;

    constructor(props: IProps) {
        super(props);

        this.btnStyle = { display: "block" };

        this.getCost = this.getCost.bind(this);
        this.getHealed = this.getHealed.bind(this);

        this.state = {
            currHp: this.props.p.hp,
        }
    }

    getCost(): number {
        return (this.props.p.max_hp - this.props.p.hp) * CONSTANTS.HospitalCostPerHp;
    }

    getHealed(e: React.MouseEvent<HTMLElement>): void {
        if (!e.isTrusted) { return; }

        if (this.props.p.hp < 0) { this.props.p.hp = 0; }
        if (this.props.p.hp >= this.props.p.max_hp) { return; }

        const cost = this.getCost();
        this.props.p.loseMoney(cost);
        this.props.p.hp = this.props.p.max_hp;

        // This just forces a re-render to update the cost
        this.setState({
            currHp: this.props.p.hp,
        });

        dialogBoxCreate(<>You were healed to full health! The hospital billed you for {Money(cost)}</>);
    }

    render() {
        const cost = this.getCost();

        return (
            <AutoupdatingStdButton
                onClick={this.getHealed}
                style={this.btnStyle}
                text={<>Get treatment for wounds - {Money(cost)}</>}
            />
        )
    }
}
