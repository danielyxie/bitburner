/**
 * React Component for displaying the total production and production rate
 * of scripts on the 'Active Scripts' UI page
 */
import * as React from "react";

import { numeralWrapper } from "../numeralFormat";

import { WorkerScript } from "../../Netscript/WorkerScript";
import { IPlayer } from "../../PersonObjects/IPlayer";

type IProps = {
    p: IPlayer;
    workerScripts: WorkerScript[];
}

export function ScriptProduction(props: IProps): React.ReactElement {
    const prodRateSinceLastAug = props.p.scriptProdSinceLastAug / (props.p.playtimeSinceLastAug / 1000);

    let onlineProduction = 0;
    for (const ws of props.workerScripts) {
        onlineProduction += (ws.scriptRef.onlineMoneyMade / ws.scriptRef.onlineRunningTime);
    }

    return (
        <p id="active-scripts-total-prod">
            Total online production of Active scripts:
            <span className="money-gold">
                <span id="active-scripts-total-production-active">
                    {numeralWrapper.formatMoney(onlineProduction)}
                </span> / sec
            </span><br />

            Total online production since last Aug installation:
            <span id="active-scripts-total-prod-aug-total" className="money-gold">
                {numeralWrapper.formatMoney(props.p.scriptProdSinceLastAug)}
            </span>
            
            (<span className="money-gold">
                <span id="active-scripts-total-prod-aug-avg" className="money-gold">
                    {numeralWrapper.formatMoney(prodRateSinceLastAug)}
                </span> / sec
            </span>)
        </p>
    )
}
