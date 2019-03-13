// React components for the levelable upgrade buttons on the overview panel
import React from "react";
import { BaseReactComponent } from "./BaseReactComponent";

import { numeralWrapper } from "../../ui/numeralFormat";
import { dialogBoxCreate } from "../../../utils/DialogBox";

export class LevelableUpgrade extends BaseReactComponent {
    render() {
        const data = this.props.upgradeData;
        const level = this.props.upgradeLevel;

        const baseCost = data[1];
        const priceMult = data[2];
        const cost = baseCost * Math.pow(priceMult, level);

        const text = `${data[4]} - ${numeralWrapper.formatMoney(cost)}`
        const tooltip = data[5];
        const onClick = () => {
            if (this.corp().funds.lt(cost)) {
                dialogBoxCreate("Insufficient funds");
            } else {
                this.corp().upgrade(data);
                //this.corp().displayCorporationOverviewContent();
            }
        }

        return (
            <div className={"cmpy-mgmt-upgrade-div tooltip"} style={{"width" : "45%"}} onClick={onClick}>
                {text}
                <span className={"tooltiptext"}>{tooltip}</span>
            </div>
        )
    }
}
