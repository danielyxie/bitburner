// React Components for the Unlock upgrade buttons on the overview page
import React from "react";
import { BaseReactComponent } from "./BaseReactComponent";

import { numeralWrapper } from "../../ui/numeralFormat";
import { dialogBoxCreate } from "../../../utils/DialogBox";

export class UnlockUpgrade extends BaseReactComponent {
    render() {
        const data = this.props.upgradeData;
        const text = `${data[2]} - ${numeralWrapper.formatMoney(data[1])}`;
        const tooltip = data[3];
        const onClick = () => {
            if (this.corp().funds.lt(data[1])) {
                dialogBoxCreate("Insufficient funds");
            } else {
                this.corp().unlock(data);
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
