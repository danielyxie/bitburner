import React from 'react';
import { removePopup } from "../../ui/React/createPopup";
import { numeralWrapper } from "../../ui/numeralFormat";
import { CorporationConstants } from "../data/Constants";

interface IProps {
    corp: any;
    popupId: string;
}

// Create a popup that lets the player manage exports
export function FindInvestorsPopup(props: IProps): React.ReactElement {
    const val = props.corp.determineValuation()
    let percShares = 0;
    let roundMultiplier = 4;
    switch (props.corp.fundingRound) {
        case 0: //Seed
            percShares = 0.10;
            roundMultiplier = 4;
            break;
        case 1: //Series A
            percShares = 0.35;
            roundMultiplier = 3;
            break;
        case 2: //Series B
            percShares = 0.25;
            roundMultiplier = 3;
            break;
        case 3: //Series C
            percShares = 0.20;
            roundMultiplier = 2.5;
            break;
        default:
            return (<></>);
    }
    const funding = val * percShares * roundMultiplier;
    const investShares = Math.floor(CorporationConstants.INITIALSHARES * percShares);
    
    function findInvestors(): void {
        props.corp.fundingRound++;
        props.corp.addFunds(funding);
        props.corp.numShares -= investShares;
        props.corp.rerender();
        removePopup(props.popupId);
    }
    return (<>
        <p>
            An investment firm has offered you {numeralWrapper.formatMoney(funding)} in
            funding in exchange for a {numeralWrapper.format(percShares*100, "0.000a")}%
            stake in the company ({numeralWrapper.format(investShares, '0.000a')} shares).<br /><br />
            Do you accept or reject this offer?<br /><br />
            Hint: Investment firms will offer more money if your corporation is turning a profit
        </p>
        <button onClick={findInvestors} className="std-button">Accept</button>
    </>);
}
