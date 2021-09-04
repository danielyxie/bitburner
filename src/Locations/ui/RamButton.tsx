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

export function RamButton(props: IProps): React.ReactElement {
    const setRerender = useState(false)[1];
    function rerender(): void {
        setRerender(old => !old);
    }

    const btnStyle = { display: "block" };

    const homeComputer = props.p.getHomeComputer();
    if(homeComputer.maxRam >= CONSTANTS.HomeComputerMaxRam) {
        return (<StdButtonPurchased
            style={btnStyle}
            text={"Upgrade 'home' RAM - MAX"}
        />);
    }

    const cost = props.p.getUpgradeHomeRamCost();

    function buy(): void {
        purchaseRamForHomeComputer(props.p);
        rerender();
    }

    return (<StdButton
        disabled={!props.p.canAfford(cost)}
        onClick={buy}
        style={btnStyle}
        text={<>Upgrade 'home' RAM ({homeComputer.maxRam}GB -&gt; {homeComputer.maxRam*2}GB) - <Money money={cost} player={props.p} /></>}
    />);
}
