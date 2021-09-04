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

export function TorButton(props: IProps): React.ReactElement {
    const setRerender = useState(false)[1];
    function rerender(): void {
        setRerender(old => !old);
    }

    const btnStyle = { display: "block" };

    function buy(): void {
        purchaseTorRouter(props.p);
        rerender();
    }

    if(props.p.hasTorRouter()) {
        return (<StdButtonPurchased
            style={btnStyle}
            text={"TOR Router - Purchased"}
        />);
    }

    return (<StdButton
        disabled={!props.p.canAfford(CONSTANTS.TorRouterCost)}
        onClick={buy}
        style={btnStyle}
        text={<>Purchase TOR router - <Money money={CONSTANTS.TorRouterCost} player={props.p} /></>}
    />);
}
