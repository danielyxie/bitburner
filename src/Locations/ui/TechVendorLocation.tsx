/**
 * React Subcomponent for displaying a location's UI, when that location is a tech vendor
 *
 * This subcomponent renders all of the buttons for purchasing things from tech vendors
 */
import * as React from "react";

import { Location }                     from "../Location";
import { createPurchaseServerPopup,
         createUpgradeHomeCoresPopup,
         createUpgradeHomeRamPopup,
         purchaseTorRouter }            from "../LocationsHelpers";

import { CONSTANTS }                    from "../../Constants";
import { IPlayer }                      from "../../PersonObjects/IPlayer";
import { getPurchaseServerCost }        from "../../Server/ServerPurchases";

import { numeralWrapper }               from "../../ui/numeralFormat";
import { StdButtonPurchased }           from "../../ui/React/StdButtonPurchased";
import { StdButton }                    from "../../ui/React/StdButton";

type IProps = {
    loc: Location;
    p: IPlayer;
}

export class TechVendorLocation extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            torPurchased: props.p.hasTorRouter(),
        }

        this.createUpgradeHomeCoresPopup = this.createUpgradeHomeCoresPopup.bind(this);
        this.createUpgradeHomeRamPopup = this.createUpgradeHomeRamPopup.bind(this);
        this.purchaseTorRouter = this.purchaseTorRouter.bind(this);
    }

    createUpgradeHomeCoresPopup() {
        createUpgradeHomeCoresPopup(this.props.p);
    }

    createUpgradeHomeRamPopup() {
        createUpgradeHomeRamPopup(this.props.p);
    }

    purchaseTorRouter() {
        purchaseTorRouter(this.props.p);
    }

    render() {
        const loc: Location = this.props.loc;

        const purchaseServerButtons: React.ReactNode[] = [];
        for (let i = loc.techVendorMinRam; i <= loc.techVendorMaxRam; i *= 2) {
            const cost = getPurchaseServerCost(i);
            purchaseServerButtons.push(
                <StdButton
                    key={i}
                    onClick={() => createPurchaseServerPopup(i, this.props.p)}
                    text={`Purchase ${i}GB Server - ${numeralWrapper.formatMoney(cost)}`}
                />
            )
        }

        return (
            <div>
                {purchaseServerButtons}
                {
                    this.state.torPurchased ? (
                        <StdButtonPurchased
                            text={"TOR Router - Purchased"}
                        />
                    ) : (
                        <StdButton
                            onClick={this.purchaseTorRouter}
                            text={`Purchase TOR Router - ${numeralWrapper.formatMoney(CONSTANTS.TorRouterCost)}`}
                        />
                    )

                }
                <StdButton
                    onClick={this.createUpgradeHomeRamPopup}
                    text={`Purchase additional RAM for Home computer`}
                />
                <StdButton
                    onClick={this.createUpgradeHomeCoresPopup}
                    text={`Purchase additional Core for Home computer`}
                />
            </div>
        )
    }
}
