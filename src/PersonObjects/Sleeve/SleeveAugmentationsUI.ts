/**
 * Module for handling the UI for purchasing Sleeve Augmentations
 * This UI is a popup, not a full page
 */
import { Sleeve } from "./Sleeve";
import { findSleevePurchasableAugs } from "./SleeveHelpers";

import { IPlayer } from "../IPlayer";

import { Augmentation } from "../../Augmentation/Augmentation";
import { Augmentations } from "../../Augmentation/Augmentations";

import { numeralWrapper } from "../../ui/numeralFormat";

import { dialogBoxCreate } from "../../../utils/DialogBox";

import { createElement } from "../../../utils/uiHelpers/createElement";
import { createPopup } from "../../../utils/uiHelpers/createPopup";
import { createPopupCloseButton } from "../../../utils/uiHelpers/createPopupCloseButton";
import { removeElementById } from "../../../utils/uiHelpers/removeElementById";

export function createSleevePurchaseAugsPopup(sleeve: Sleeve, p: IPlayer) {
    // Array of all owned Augmentations. Names only
    const ownedAugNames: string[] = sleeve.augmentations.map((e) => e.name);

    // You can only purchase Augmentations that are actually available from
    // your factions. I.e. you must be in a faction that has the Augmentation
    // and you must also have enough rep in that faction in order to purchase it.
    const availableAugs = findSleevePurchasableAugs(sleeve, p);

    // Create popup
    const popupId = "purchase-sleeve-augs-popup";

    // Close popup button
    const closeBtn = createPopupCloseButton(popupId, { innerText: "Cancel" });

    // General info about owned Augmentations
    const ownedAugsInfo = createElement("p", {
        display: "block",
        innerHTML: "Owned Augmentations:",
    });

    const popupElems: HTMLElement[] = [closeBtn, ownedAugsInfo];

    // Show owned augmentations
    // First we'll make a div with a reduced width, so the tooltips don't go off
    // the edge of the popup
    const ownedAugsDiv = createElement("div", { width: "70%" });
    for (const ownedAug of ownedAugNames) {
        const aug: Augmentation | null = Augmentations[ownedAug];
        if (aug == null) {
            console.warn(`Invalid Augmentation: ${ownedAug}`);
            continue;
        }

        ownedAugsDiv.appendChild(createElement("div", {
            class: "gang-owned-upgrade", // Reusing a class from the Gang UI
            innerText: ownedAug,
            tooltip: aug.info,
        }));
    }
    popupElems.push(ownedAugsDiv);

    // General info about buying Augmentations
    const info = createElement("p", {
        innerHTML:
        [
            "You can purchase Augmentations for your Duplicate Sleeves. These Augmentations",
            "have the same effect as they would for you. You can only purchase Augmentations",
            "that you have unlocked through Factions.<br><br>",
            "When purchasing an Augmentation for a Duplicate Sleeve, they are immediately",
            "installed. This means that the Duplicate Sleeve will immediately lose all of",
            "its stat experience.",
        ].join(" "),
    });

    popupElems.push(info);

    for (const aug of availableAugs) {
        const div = createElement("div", {
            class: "cmpy-mgmt-upgrade-div", // We'll reuse this CSS class
        });

        div.appendChild(createElement("p", {
            fontSize: "12px",
            innerHTML:
            [
                `<h2>${aug.name}</h2><br>`,
                `Cost: ${numeralWrapper.formatMoney(aug.startingCost)}<br><br>`,
                `${aug.info}`,
            ].join(" "),
            padding: "2px",
            clickListener: () => {
                if (sleeve.tryBuyAugmentation(p, aug)) {
                    dialogBoxCreate(`Installed ${aug.name} on Duplicate Sleeve!`, false);
                    removeElementById(popupId);
                    createSleevePurchaseAugsPopup(sleeve, p);
                } else {
                    dialogBoxCreate(`You cannot afford ${aug.name}`, false);
                }
            },
        }));

        popupElems.push(div);
    }

    createPopup(popupId, popupElems);
}
