import React, { useState } from "react";

import { Location }                     from "../Location";
import { createPurchaseServerPopup,
         createUpgradeHomeCoresPopup,
         purchaseTorRouter }            from "../LocationsHelpers";

import { CONSTANTS }                    from "../../Constants";
import { IPlayer }                      from "../../PersonObjects/IPlayer";
import { purchaseRamForHomeComputer }   from "../../Server/ServerPurchases";

import { StdButtonPurchased }           from "../../ui/React/StdButtonPurchased";
import { StdButton }                    from "../../ui/React/StdButton";
import { Money }                        from "../../ui/React/Money";

type IProps = {
    p: IPlayer;
}

export function CoresButton(props: IProps): React.ReactElement {
    const setRerender = useState(false)[1];
    function rerender(): void {
        setRerender(old => !old);
    }

    const btnStyle = { display: "block" };

    const homeComputer = props.p.getHomeComputer();
    const maxCores = homeComputer.cpuCores >= 8;
    if(maxCores) {
        return (<StdButtonPurchased
            style={btnStyle}
            text={"Upgrade 'home' cores - MAX"}
        />);
    }

    const allCosts = [
        0,
        10e9,
        250e9,
        5e12,
        100e12,
        1e15,
        20e15,
        200e15,
    ];
    const cost: number = allCosts[homeComputer.cpuCores];


    function buy(): void {
        if(maxCores) return;
        if (!props.p.canAfford(cost)) return;
        props.p.loseMoney(cost);
        homeComputer.cpuCores++;
        rerender();
    }

    return (<StdButton
        disabled={!props.p.canAfford(cost)}
        onClick={buy}
        style={btnStyle}
        text={<>Upgrade 'home' cores ({homeComputer.cpuCores} -&gt; {homeComputer.cpuCores+1}) - {Money(cost)}</>}
    />);
}
