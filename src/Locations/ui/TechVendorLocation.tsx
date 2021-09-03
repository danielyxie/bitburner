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

import { StdButtonPurchased }           from "../../ui/React/StdButtonPurchased";
import { StdButton }                    from "../../ui/React/StdButton";
import { Money }                        from "../../ui/React/Money";

type IProps = {
    loc: Location;
    p: IPlayer;
}

export class TechVendorLocation extends React.Component<IProps, any> {
    /**
     * Stores button styling that sets them all to block display
     */
    btnStyle: any;

    constructor(props: IProps) {
        super(props);

        this.btnStyle = { display: "block" };

        this.state = {
            torPurchased: props.p.hasTorRouter(),
        }

        this.createUpgradeHomeCoresPopup = this.createUpgradeHomeCoresPopup.bind(this);
        this.createUpgradeHomeRamPopup = this.createUpgradeHomeRamPopup.bind(this);
        this.purchaseTorRouter = this.purchaseTorRouter.bind(this);
    }

    createUpgradeHomeCoresPopup(): void {
        createUpgradeHomeCoresPopup(this.props.p);
    }

    createUpgradeHomeRamPopup(): void {
        createUpgradeHomeRamPopup(this.props.p);
    }

    purchaseTorRouter(): void {
        purchaseTorRouter(this.props.p);
        this.setState({
            torPurchased: this.props.p.hasTorRouter(),
        });
    }

    render(): React.ReactNode {
        const loc: Location = this.props.loc;

        const purchaseServerButtons: React.ReactNode[] = [];
        for (let i = loc.techVendorMinRam; i <= loc.techVendorMaxRam; i *= 2) {
            const cost = getPurchaseServerCost(i);
            purchaseServerButtons.push(
                <StdButton
                    key={i}
                    onClick={() => createPurchaseServerPopup(i, this.props.p)}
                    style={this.btnStyle}
                    text={<>Purchase {i}GB Server - {Money(cost)}</>}
                />,
            )
        }

        return (
            <div>
                {purchaseServerButtons}
                <br />
                <p><i>"You can order bigger servers via scripts. We don't take custom order in person."</i></p>
                <br />
                {
                    this.state.torPurchased ? (
                        <StdButtonPurchased
                        style={this.btnStyle}
                            text={"TOR Router - Purchased"}
                        />
                    ) : (
                        <StdButton
                            onClick={this.purchaseTorRouter}
                            style={this.btnStyle}
                            text={<>Purchase TOR Router - {Money(CONSTANTS.TorRouterCost)}</>}
                        />
                    )

                }
                <StdButton
                    onClick={this.createUpgradeHomeRamPopup}
                    style={this.btnStyle}
                    text={`Purchase additional RAM for Home computer`}
                />
                <StdButton
                    onClick={this.createUpgradeHomeCoresPopup}
                    style={this.btnStyle}
                    text={`Purchase additional Core for Home computer`}
                />
            </div>
        )
    }
}
