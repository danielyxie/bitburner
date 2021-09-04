/**
 * React component for a donate option on the Faction UI
 */
import React, { useState } from "react";

import { CONSTANTS } from "../../Constants";
import { Faction } from "../../Faction/Faction";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { repFromDonation } from "../formulas/donation";

import { Money } from "../../ui/React/Money";
import { Reputation } from "../../ui/React/Reputation";

import { StdButton } from "../../ui/React/StdButton";

import { numeralWrapper } from "../../ui/numeralFormat";

import { dialogBoxCreate } from "../../../utils/DialogBox";
import { MathComponent } from 'mathjax-react';

type IProps = {
    faction: Faction;
    disabled: boolean;
    favorToDonate: number;
    p: IPlayer;
    rerender: () => void;
}


const inputStyleMarkup = {
    margin: "5px",
    height: "26px",
}

const blockStyle = { display: "block" };

export function DonateOption(props: IProps): React.ReactElement {
    const [donateAmt, setDonateAmt] = useState<number | null>(null);
    const digits = (CONSTANTS.DonateMoneyToRepDivisor+'').length-1;

    function canDonate(): boolean {
        if(donateAmt === null) return false;
        if (isNaN(donateAmt) || donateAmt <= 0) return false;
        if(props.p.money.lt(donateAmt)) return false;
        return true;
    }

    function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const amt = numeralWrapper.parseMoney(event.target.value);
        if(event.target.value === "" || isNaN(amt)) setDonateAmt(null);
        else setDonateAmt(amt);
    }

    function donate(): void  {
        const fac = props.faction;
        const amt = donateAmt;
        if(amt === null) return;
        if(!canDonate()) return;
        props.p.loseMoney(amt);
        const repGain = repFromDonation(amt, props.p);
        props.faction.playerReputation += repGain;
        dialogBoxCreate(<>
            You just donated {Money(amt)} to {fac.name} to gain {Reputation(repGain)} reputation.
        </>);
        props.rerender();
    }

    function Status(): React.ReactElement {
        if(donateAmt === null) return (<></>);
        if(!canDonate()) {
            if(props.p.money.lt(donateAmt))
                return (<p>Insufficient funds</p>);
            return (<p>Invalid donate amount entered!</p>);
        }
        return (<p>This donation will result in {Reputation(repFromDonation(donateAmt, props.p))} reputation gain</p>);
    }


    return (<div className={"faction-work-div"}>
        <div className={"faction-work-div-wrapper"}>
            <input
                className="text-input"
                onChange={onChange}
                placeholder={"Donation amount"}
                style={inputStyleMarkup}
                disabled={props.disabled}
            />
            <StdButton
                onClick={donate}
                text={"Donate Money"}
                disabled={props.disabled || !canDonate()}
            />
            <Status />
            {
                props.disabled ?
                    <p>Unlocked at {props.favorToDonate} favor with {props.faction.name}</p> :
                    <div className="text">
                        <MathComponent tex={String.raw`reputation = \frac{\text{donation amount} \times \text{reputation multiplier}}{10^{${digits}}}`} />
                    </div>
            }
        </div>
    </div>);
}
