/**
 * Root React component for the popup that lets player purchase Duplicate
 * Sleeves and Sleeve-related upgrades from The Covenant
 */
import React, { useState } from 'react';

import { CovenantSleeveUpgrades }       from "./CovenantSleeveUpgrades";

import { Sleeve }                       from "../Sleeve";
import { BaseCostPerSleeve,
         MaxSleevesFromCovenant,
         PopupId }                      from "../SleeveCovenantPurchases";
import { IPlayer }                      from "../../IPlayer";

import { PopupCloseButton }             from "../../../ui/React/PopupCloseButton";
import { StdButton }                    from "../../../ui/React/StdButton";
import { Money }                        from "../../../ui/React/Money";

import { dialogBoxCreate }              from "../../../../utils/DialogBox";

interface IProps {
    closeFn: () => void;
    p: IPlayer;
}

export function CovenantPurchasesRoot(props: IProps): React.ReactElement {
    const [update, setUpdate] = useState(0);

    /**
     * Get the cost to purchase a new Duplicate Sleeve
     */
    function purchaseCost(): number {
        return (props.p.sleevesFromCovenant + 1) * BaseCostPerSleeve;
    }

    /**
     * Force a rerender by just changing an arbitrary state value
     */
    function rerender(): void {
        setUpdate(update + 1);
    }

    // Purchasing a new Duplicate Sleeve
    let purchaseDisabled = false;
    if (!props.p.canAfford(purchaseCost())) {
        purchaseDisabled = true;
    }
    if (props.p.sleevesFromCovenant >= MaxSleevesFromCovenant) {
        purchaseDisabled = true;
    }

    function purchaseOnClick(): void {
        if (props.p.sleevesFromCovenant >= MaxSleevesFromCovenant) return;
        
        if (props.p.canAfford(purchaseCost())) {
            props.p.loseMoney(purchaseCost());
            props.p.sleevesFromCovenant += 1;
            props.p.sleeves.push(new Sleeve(props.p));
            rerender();
        } else {
            dialogBoxCreate(`You cannot afford to purchase a Duplicate Sleeve`, false);
        }
    }

    // Purchasing Upgrades for Sleeves
    const upgradePanels = [];
    for (let i = 0; i < props.p.sleeves.length; ++i) {
        const sleeve = props.p.sleeves[i];
        upgradePanels.push(
            <CovenantSleeveUpgrades {...props} sleeve={sleeve} index={i} rerender={rerender} key={i} />,
        )
    }

    return (<div>
        <PopupCloseButton popup={PopupId} text={"Close"} />
        <p>
            Would you like to purchase an additional Duplicate Sleeve from The Covenant
            for {Money(purchaseCost())}?
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
    </div>);
}
