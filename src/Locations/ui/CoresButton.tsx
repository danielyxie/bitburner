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
import { MathComponent } from 'mathjax-react';

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

    const cost = 1e9*Math.pow(7.5, homeComputer.cpuCores);

    function buy(): void {
        if(maxCores) return;
        if (!props.p.canAfford(cost)) return;
        props.p.loseMoney(cost);
        homeComputer.cpuCores++;
        rerender();
    }
//tooltip={<MathComponent tex={String.raw`cost = `} />}
    return (<StdButton
        disabled={!props.p.canAfford(cost)}
        onClick={buy}
        style={btnStyle}
        text={<>Upgrade 'home' cores ({homeComputer.cpuCores} -&gt; {homeComputer.cpuCores+1}) - <Money money={cost} player={props.p} /></>}

    />);
}
