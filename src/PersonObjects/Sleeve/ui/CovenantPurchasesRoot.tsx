/**
 * Root React component for the popup that lets player purchase Duplicate
 * Sleeves and Sleeve-related upgrades from The Covenant
 */
import * as React from "react";

import { CovenantSleeveUpgrades }       from "./CovenantSleeveUpgrades";

import { Sleeve }                       from "../Sleeve";
import { BaseCostPerSleeve,
         MaxSleevesFromCovenant,
         PopupId }                      from "../SleeveCovenantPurchases";
import { IPlayer }                      from "../../IPlayer";

import { numeralWrapper }               from "../../../ui/numeralFormat";

import { PopupCloseButton }             from "../../../ui/React/PopupCloseButton";
import { StdButton }                    from "../../../ui/React/StdButton";
import { Money }                        from "../../../ui/React/Money";

import { dialogBoxCreate }              from "../../../../utils/DialogBox";

interface IProps {
    closeFn: () => void;
    p: IPlayer;
    rerender: () => void;
}

interface IState {
    update: number;
}

export class CovenantPurchasesRoot extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            update: 0,
        }

        this.rerender = this.rerender.bind(this);
    }

    /**
     * Get the cost to purchase a new Duplicate Sleeve
     */
    purchaseCost(): number {
        return (this.props.p.sleevesFromCovenant + 1) * BaseCostPerSleeve;
    }

    /**
     * Force a rerender by just changing an arbitrary state value
     */
    rerender() {
        this.setState((state: IState) => ({
            update: state.update + 1,
        }));
    }

    render() {
        // Purchasing a new Duplicate Sleeve
        let purchaseDisabled = false;
        if (!this.props.p.canAfford(this.purchaseCost())) {
            purchaseDisabled = true;
        }
        if (this.props.p.sleevesFromCovenant >= MaxSleevesFromCovenant) {
            purchaseDisabled = true;
        }
        const purchaseOnClick = () => {
            if (this.props.p.sleevesFromCovenant >= MaxSleevesFromCovenant) { return; }
            
            if (this.props.p.canAfford(this.purchaseCost())) {
                this.props.p.loseMoney(this.purchaseCost());
                this.props.p.sleevesFromCovenant += 1;
                this.props.p.sleeves.push(new Sleeve(this.props.p));
                this.rerender();
            } else {
                dialogBoxCreate(`You cannot afford to purchase a Duplicate Sleeve`, false);
            }
        }

        // Purchasing Upgrades for Sleeves
        const upgradePanels = [];
        for (let i = 0; i < this.props.p.sleeves.length; ++i) {
            const sleeve = this.props.p.sleeves[i];
            upgradePanels.push(
                <CovenantSleeveUpgrades {...this.props} sleeve={sleeve} index={i} rerender={this.rerender} key={i} />
            )
        }

        return (
            <div>
                <PopupCloseButton popup={PopupId} text={"Close"} />
                <p>
                    Would you like to purchase an additional Duplicate Sleeve from The Covenant
                    for {Money(this.purchaseCost())}?
                </p>
                <br />
                <p>
                    These Duplicate Sleeves are permanent (they persist through BitNodes). You can
                    purchase a total of {MaxSleevesFromCovenant} from The Covenant.
                </p>
                <StdButton disabled={purchaseDisabled} onClick={purchaseOnClick} text={"Purchase"} />
                <br /><br />
                <p>
                    Here, you can also purchase upgrades for your Duplicate Sleeves. These upgrades
                    are also permanent, meaning they persist across BitNodes.
                </p>
                {upgradePanels}
            </div>
        )
    }
}
