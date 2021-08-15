/**
 * Module for handling the UI for purchasing Sleeve Augmentations
 * This UI is a popup, not a full page
 */
import { Sleeve } from "./Sleeve";
import { findSleevePurchasableAugs } from "./SleeveHelpers";

import { IPlayer } from "../IPlayer";

import { Augmentation } from "../../Augmentation/Augmentation";
import { Augmentations } from "../../Augmentation/Augmentations";

import { Money } from "../../ui/React/Money";

import { dialogBoxCreate } from "../../../utils/DialogBox";

import { createElement } from "../../../utils/uiHelpers/createElement";
import { createPopup } from "../../../utils/uiHelpers/createPopup";
import { createPopupCloseButton } from "../../../utils/uiHelpers/createPopupCloseButton";
import { removeElementById } from "../../../utils/uiHelpers/removeElementById";

import { renderToStaticMarkup } from "react-dom/server"

export function createSleevePurchaseAugsPopup(sleeve: Sleeve, p: IPlayer): void {
    // Array of all owned Augmentations. Names only
    const ownedAugNames: string[] = sleeve.augmentations.map((e) => {return e.name});

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

        let tooltip = aug.info;
        if(typeof tooltip !== 'string') {
            tooltip = renderToStaticMarkup(tooltip);
        }
        tooltip += "<br /><br />";
        tooltip += renderToStaticMarkup(aug.stats);

        ownedAugsDiv.appendChild(createElement("div", {
            class: "gang-owned-upgrade", // Reusing a class from the Gang UI
            innerText: ownedAug,
            tooltip: tooltip,
        }))
    }
    popupElems.push(ownedAugsDiv);

    // General info about buying Augmentations
    const info = createElement("p", {
        innerHTML:
        [
            `You can purchase Augmentations for your Duplicate Sleeves. These Augmentations`,
            `have the same effect as they would for you. You can only purchase Augmentations`,
            `that you have unlocked through Factions.<br><br>`,
            `When purchasing an Augmentation for a Duplicate Sleeve, they are immediately`,
            `installed. This means that the Duplicate Sleeve will immediately lose all of`,
            `its stat experience.`,
        ].join(" "),
    });

    popupElems.push(info);

    for (const aug of availableAugs) {
        const div = createElement("div", {
            class: "cmpy-mgmt-upgrade-div", // We'll reuse this CSS class
        });

        let info = aug.info;
        if(typeof info !== 'string') {
            info = renderToStaticMarkup(info);
        }
        info += "<br /><br />";
        info += renderToStaticMarkup(aug.stats);

        div.appendChild(createElement("p", {
            fontSize: "12px",
            innerHTML:
            [
                `<h2>${aug.name}</h2><br>`,
                `Cost: ${renderToStaticMarkup(Money(aug.startingCost))}<br><br>`,
                `${info}`,
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
