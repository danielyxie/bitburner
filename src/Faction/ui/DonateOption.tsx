/**
 * React component for a donate option on the Faction UI
 */
import * as React from "react";

import { CONSTANTS } from "../../Constants";
import { Faction } from "../../Faction/Faction";
import { IPlayer } from "../../PersonObjects/IPlayer";

import { Money } from "../../ui/React/Money";
import { Reputation } from "../../ui/React/Reputation";

import { StdButton } from "../../ui/React/StdButton";

import { numeralWrapper } from "../../ui/numeralFormat";

import { dialogBoxCreate } from "../../../utils/DialogBox";

type IProps = {
    faction: Faction;
    disabled: boolean;
    favorToDonate: number;
    p: IPlayer;
    rerender: () => void;
}

type IState = {
    donateAmt: number;
    status: JSX.Element;
}

const inputStyleMarkup = {
    margin: "5px",
    height: "26px"
}

export class DonateOption extends React.Component<IProps, IState> {
    // Style markup for block elements. Stored as property
    blockStyle: any = { display: "block" };

    constructor(props: IProps) {
        super(props);


        this.state = {
            donateAmt: 0,
            status: props.disabled ? <>Unlocked at {props.favorToDonate} favor with {props.faction.name}</> : <></>,
        }

        this.calculateRepGain = this.calculateRepGain.bind(this);
        this.donate = this.donate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    // Returns rep gain for a given donation amount
    calculateRepGain(amt: number): number {
        return amt / CONSTANTS.DonateMoneyToRepDivisor * this.props.p.faction_rep_mult;
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
            const repGain = this.calculateRepGain(amt);
            this.props.faction.playerReputation += repGain;
            dialogBoxCreate(<>
                You just donated {Money(amt)} to {fac.name} to gain {Reputation(repGain)} reputation
            </>);
            this.props.rerender();
        }
    }

    handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const amt = numeralWrapper.parseMoney(e.target.value);

        if (isNaN(amt)) {
            this.setState({
                donateAmt: 0,
                status: <>Invalid donate amount entered!</>,
            });
        } else {
            const repGain = this.calculateRepGain(amt);
            this.setState({
                donateAmt: amt,
                status: <>This donation will result in {Reputation(repGain)} reputation gain</>,
            });
        }
    }

    render(): React.ReactNode {
        return (
            <div className={"faction-work-div"}>
                <div className={"faction-work-div-wrapper"}>
                    <input
                        className="text-input"
                        onChange={this.handleChange}
                        placeholder={"Donation amount"}
                        style={inputStyleMarkup}
                        disabled={this.props.disabled}
                    />
                    <StdButton
                        onClick={this.donate}
                        text={"Donate Money"}
                        disabled={this.props.disabled}
                    />
                    <p style={this.blockStyle}>{this.state.status}</p>
                </div>
            </div>
        )
    }
}
