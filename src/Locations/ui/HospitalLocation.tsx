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

import { dialogBoxCreate }          from "../../../utils/DialogBox";

type IProps = {
    p: IPlayer;
}

export class HospitalLocation extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);

        this.getCost = this.getCost.bind(this);
        this.getHealed = this.getHealed.bind(this);
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

        dialogBoxCreate(`You were healed to full health! The hospital billed you for ${numeralWrapper.formatMoney(cost)}`);
    }

    render() {
        const cost = this.getCost();

        return (
            <AutoupdatingStdButton
                onClick={this.getHealed}
                text={`Get treatment for wounds - ${numeralWrapper.formatMoney(cost)}`}
            />
        )
    }
}
