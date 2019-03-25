/**
 * React Component for the Multiplier buttons on the Hacknet page.
 * These buttons let the player control how many Nodes/Upgrades they're
 * purchasing when using the UI (x1, x5, x10, MAX)
 */
import React from "react";

import { PurchaseMultipliers } from "./Root";

function MultiplierButton(props) {
    return (
        <button className={props.className} onClick={props.onClick}>{props.text}</button>
    )
}

export function MultiplierButtons(props) {
    if (props.purchaseMultiplier == null) {
        throw new Error(`MultiplierButtons constructed without required props`);
    }

    const mults = ["x1", "x5", "x10", "MAX"];
    const onClicks = props.onClicks;
    const buttons = [];
    for (let i = 0; i < mults.length; ++i) {
        const mult = mults[i];
        const btnProps = {
            className: props.purchaseMultiplier === PurchaseMultipliers[mult] ? "std-button-disabled" : "std-button",
            key: mult,
            onClick: onClicks[i],
            text: mult,
        }

        buttons.push(<MultiplierButton {...btnProps} />)
    }

    return (
        <span id={"hacknet-nodes-multipliers"}>
            {buttons}
        </span>
    )
}
