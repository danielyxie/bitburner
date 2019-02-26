/**
 * Module for handling the UI for purchasing Sleeve Augmentations
 * This UI is a popup, not a full page
 */
import { Sleeve } from "./Sleeve";

import { IPlayer } from "../IPlayer";

import { Augmentation } from "../../Augmentation/Augmentation";
import { Augmentations } from "../../Augmentation/Augmentations";

import { Faction } from "../../Faction/Faction";
import { Factions } from "../../Faction/Factions";

import { numeralWrapper } from "../../ui/numeralFormat";

import { dialogBoxCreate } from "../../../utils/DialogBox";

import { clearEventListeners } from "../../../utils/uiHelpers/clearEventListeners";
import { createElement } from "../../../utils/uiHelpers/createElement";
import { createPopup } from "../../../utils/uiHelpers/createPopup";
import { createPopupCloseButton } from "../../../utils/uiHelpers/createPopupCloseButton";
import { getSelectValue } from "../../../utils/uiHelpers/getSelectData";
import { removeChildrenFromElement } from "../../../utils/uiHelpers/removeChildrenFromElement";
import { removeElement } from "../../../utils/uiHelpers/removeElement";
import { removeElementById } from "../../../utils/uiHelpers/removeElementById";

export function createSleevePurchaseAugsPopup(sleeve: Sleeve, p: IPlayer) {
    // You can only purchase Augmentations that are actually available from
    // your factions. I.e. you must be in a faction that has the Augmentation
    // and you must also have enough rep in that faction in order to purchase it.
    const availableAugs: Augmentation[] = [];

    for (const facName of p.factions) {
        const fac: Faction | null = Factions[facName];
        if (fac == null) { continue; }

        for (const augName of fac.augmentations) {
            const aug: Augmentation | null = Augmentations[augName];

            if (fac.playerReputation > aug.baseRepRequirement && !availableAugs.includes(aug)) {
                availableAugs.push(aug);
            }
        }
    }


    // General info about buying Augmentations
    const info = createElement("p", {
        innerHTML:
        [
            `You can purchase Augmentations for your Duplicate Sleeves. These Augmentations`,
            `have the same effect as they would for you. You can only purchase Augmentations`,
            `that you have unlocked through Factions.<br><br>`,
            `When purchasing an Augmentation for a Duplicate Sleeve, they are immediately`,
            `installed. This means that the Duplicate Sleeve will immediately lose all of`,
            `its stat experience.`
        ].join(" "),
    });

    const popupId = "purchase-sleeve-augs-popup";
    const popupElems: HTMLElement[] = [info];

    for (const aug of availableAugs) {
        const div = createElement("div", {
            class: "cmpy-mgmt-upgrade-div", // We'll reuse this CSS class
        });

        div.appendChild(createElement("p", {
            innerHTML:
            [
                `<h2>${aug.name}</h2><br>`,
                `Cost: ${numeralWrapper.formatMoney(aug.baseCost)}<br><br>`,
                `${aug.info}`
            ].join(" "),
            clickListener: () => {
                if (p.canAfford(aug.baseCost)) {
                    p.loseMoney(aug.baseCost);
                    sleeve.installAugmentation(aug);
                    dialogBoxCreate(`Installed ${aug.name} on Duplicate Sleeve!`, false)
                } else {
                    dialogBoxCreate(`You cannot afford ${aug.name}`, false);
                }
            }
        }));

        popupElems.push(div);
    }

    createPopup(popupId, popupElems);
}
