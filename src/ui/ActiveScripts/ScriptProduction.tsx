/**
 * React Component for displaying the total production and production rate
 * of scripts on the 'Active Scripts' UI page
 */
import * as React from "react";

import { numeralWrapper } from "../numeralFormat";

import { WorkerScript } from "../../Netscript/WorkerScript";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { Money } from "../React/Money";

type IProps = {
    p: IPlayer;
    workerScripts: Map<number, WorkerScript>;
}

export function ScriptProduction(props: IProps): React.ReactElement {
    const prodRateSinceLastAug = props.p.scriptProdSinceLastAug / (props.p.playtimeSinceLastAug / 1000);

    let onlineProduction = 0;
    for (const ws of props.workerScripts.values()) {
        onlineProduction += (ws.scriptRef.onlineMoneyMade / ws.scriptRef.onlineRunningTime);
    }

    return (
        <p id="active-scripts-total-prod">
            Total online production of Active scripts:&nbsp;
            <span className="money-gold">
                <span id="active-scripts-total-production-active">
                    {Money(onlineProduction)}
                </span> / sec
            </span><br />

            Total online production since last Aug installation:&nbsp;
            <span id="active-scripts-total-prod-aug-total" className="money-gold">
                {Money(props.p.scriptProdSinceLastAug)}
            </span>

            &nbsp;(<span className="money-gold">
                <span id="active-scripts-total-prod-aug-avg" className="money-gold">
                    {Money(prodRateSinceLastAug)}
                </span> / sec
            </span>)
        </p>
    )
}
