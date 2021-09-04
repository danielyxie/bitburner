/**
 * React Subcomponent for displaying a location's UI, when that location is a tech vendor
 *
 * This subcomponent renders all of the buttons for purchasing things from tech vendors
 */
import * as React from "react";

import { Location }                     from "../Location";
import { createPurchaseServerPopup,
         createUpgradeHomeCoresPopup,
         purchaseTorRouter }            from "../LocationsHelpers";
import { RamButton }                    from "./RamButton";
import { TorButton }                    from "./TorButton";
import { CoresButton }                  from "./CoresButton";

import { CONSTANTS }                    from "../../Constants";
import { IPlayer }                      from "../../PersonObjects/IPlayer";
import { getPurchaseServerCost }        from "../../Server/ServerPurchases";

import { StdButtonPurchased }           from "../../ui/React/StdButtonPurchased";
import { StdButton }                    from "../../ui/React/StdButton";
import { Money }                        from "../../ui/React/Money";

type IProps = {
    loc: Location;
    p: IPlayer;
}

export function TechVendorLocation(props: IProps): React.ReactElement {
    const btnStyle = { display: "block" };

    const purchaseServerButtons: React.ReactNode[] = [];
    for (let i = props.loc.techVendorMinRam; i <= props.loc.techVendorMaxRam; i *= 2) {
        const cost = getPurchaseServerCost(i);
        purchaseServerButtons.push(
            <StdButton
                key={i}
                onClick={() => createPurchaseServerPopup(i, props.p)}
                style={btnStyle}
                text={<>Purchase {i}GB Server - <Money money={cost} player={props.p} /></>}
            />,
        )
    }

    return (<div>
        {purchaseServerButtons}
        <br />
        <p className="noselect"><i>"You can order bigger servers via scripts. We don't take custom order in person."</i></p>
        <br />
        <TorButton p={props.p} />
        <RamButton p={props.p} />
        <CoresButton p={props.p} />
    </div>);
}
