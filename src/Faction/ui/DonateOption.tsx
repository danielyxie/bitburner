/**
 * React component for a donate option on the Faction UI
 */
import * as React from "react";

import { CONSTANTS } from "../../Constants";
import { Faction } from "../../Faction/Faction";
import { IPlayer } from "../../PersonObjects/IPlayer";

import { numeralWrapper } from "../../ui/numeralFormat";

import { StdButton } from "../../ui/React/StdButton";

import { dialogBoxCreate } from "../../../utils/DialogBox";

type IProps = {
    faction: Faction;
    p: IPlayer;
    rerender: () => void;
}

type IState = {
    donateAmt: number;
    statusTxt: string;
}

const inputStyleMarkup = {
    margin: "5px",
}

export class DonateOption extends React.Component<IProps, IState> {
    // Style markup for block elements. Stored as property
    blockStyle: object = { display: "block" };

    constructor(props: IProps) {
        super(props);

        this.state = {
            donateAmt: 0,
            statusTxt: "",
        }

        this.calculateRepGain = this.calculateRepGain.bind(this);
        this.donate = this.donate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    // Returns rep gain for the current donation amount
    calculateRepGain(): number {
        return this.state.donateAmt / CONSTANTS.DonateMoneyToRepDivisor * this.props.p.faction_rep_mult;
    }

    donate(): void  {
        const fac = this.props.faction;
        const amt = this.state.donateAmt;
        if (isNaN(amt) || amt <= 0) {
            dialogBoxCreate(`Invalid amount entered!`);
        } else if (!this.props.p.canAfford(amt)) {
            dialogBoxCreate(`You cannot afford to donate this much money!`);
        } else {
            this.props.p.loseMoney(amt);
            const repGain = this.calculateRepGain();
            this.props.faction.playerReputation += repGain;
            dialogBoxCreate(`You just donated ${numeralWrapper.formatMoney(amt)} to ${fac.name} to gain ` +
                            `${numeralWrapper.format(repGain, "0,0.000")} reputation`);
            this.props.rerender();
        }
    }

    handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const amt = parseFloat(e.target.value);

        if (isNaN(amt)) {
            this.setState({
                donateAmt: 0,
                statusTxt: "Invalid donate amount entered!",
            });
        } else {
            const repGain = this.calculateRepGain();
            this.setState({
                donateAmt: amt,
                statusTxt: `This donation will result in ${numeralWrapper.format(repGain, "0,0.000")} reputation gain`,
            })
        }
    }

    render() {
        return (
            <div className={"faction-work-div"}>
                <div className={"faction-work-div-wrapper"}>
                    <input onChange={this.handleChange} placeholder={"Donation amount"} style={inputStyleMarkup} />
                    <StdButton
                        onClick={this.donate}
                        text={"Donate Money"}
                    />
                    <p style={this.blockStyle}>{this.state.statusTxt}</p>
                </div>
            </div>
        )
    }
}
