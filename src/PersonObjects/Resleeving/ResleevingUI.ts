/**
 * Module for handling the Re-sleeving UI
 */
import { Resleeve } from "./Resleeve";
import { generateResleeves,
         purchaseResleeve } from "./Resleeving";

import { IPlayer } from "../IPlayer";

import { IMap } from "../../types";

import { Augmentation } from "../../Augmentation/Augmentation";
import { Augmentations } from "../../Augmentation/Augmentations";

import { numeralWrapper } from "../../ui/numeralFormat";
import { Page,
         routing } from "../../ui/navigationTracking";

import { dialogBoxCreate } from "../../../utils/DialogBox";

import { exceptionAlert } from "../../../utils/helpers/exceptionAlert";

import { createElement } from "../../../utils/uiHelpers/createElement";
import { createOptionElement } from "../../../utils/uiHelpers/createOptionElement";
import { getSelectValue } from "../../../utils/uiHelpers/getSelectData";
import { removeChildrenFromElement } from "../../../utils/uiHelpers/removeChildrenFromElement";
import { removeElement } from "../../../utils/uiHelpers/removeElement";
import { removeElementById } from "../../../utils/uiHelpers/removeElementById";

interface IResleeveUIElems {
    container:          HTMLElement | null;
    statsPanel:         HTMLElement | null;
    stats:              HTMLElement | null;
    multipliersButton:  HTMLElement | null;
    augPanel:           HTMLElement | null;
    augSelector:        HTMLSelectElement | null;
    augDescription:     HTMLElement | null;
    costPanel:          HTMLElement | null;
    costText:           HTMLElement | null;
    buyButton:          HTMLElement | null;
}

interface IPageUIElems {
    container:      HTMLElement | null;
    info:           HTMLElement | null;
    resleeveList:   HTMLElement | null;
    resleeves:      IResleeveUIElems[] | null;
}

const UIElems: IPageUIElems = {
    container: null,
    info: null,
    resleeveList: null,
    resleeves: null,
}

let playerRef: IPlayer | null;

export function createResleevesPage(p: IPlayer) {
    if (!routing.isOn(Page.Resleeves)) { return; }

    try {
        playerRef = p;

        UIElems.container = createElement("div", {
            class: "generic-menupage-container",
            id: "resleeves-container",
            position: "fixed",
        });

        UIElems.info = createElement("p", {
            display: "inline-block",
            innerText: "TOODOOO",
        });

        UIElems.resleeveList = createElement("ul");
        UIElems.resleeves = [];

        if (p.resleeves.length === 0) {
            p.resleeves = generateResleeves();
        }

        for (const resleeve of p.resleeves) {
            const resleeveUi = createResleeveUi(resleeve);
            UIElems.resleeveList.appendChild(resleeveUi.container!);
            UIElems.resleeves.push(resleeveUi);
        }

        UIElems.container.appendChild(UIElems.info);
        UIElems.container.appendChild(UIElems.resleeveList);

        document.getElementById("entire-game-container")!.appendChild(UIElems.container);
    } catch(e) {
        exceptionAlert(e);
    }
}

export function clearResleevesPage() {
    removeElement(UIElems.container);
    for (const prop in UIElems) {
        (<any>UIElems)[prop] = null;
    }

    playerRef = null;
}

function createResleeveUi(resleeve: Resleeve): IResleeveUIElems {
    const elems: IResleeveUIElems = {
        container: null,
        statsPanel: null,
        stats: null,
        multipliersButton: null,
        augPanel: null,
        augSelector: null,
        augDescription: null,
        costPanel: null,
        costText: null,
        buyButton: null,
    };

    if (!routing.isOn(Page.Resleeves)) { return elems; }

    elems.container = createElement("div", {
        class: "resleeve-container",
        display: "block",
    });

    elems.statsPanel = createElement("div", { class: "resleeve-panel" });
    elems.stats = createElement("p", { class: "resleeve-stats-text" });
    elems.multipliersButton = createElement("button", {
        class: "std-button",
        innerText: "Multipliers",
        clickListener: () => {
            dialogBoxCreate(
                [
                    "<h2><u>Total Multipliers:</u></h2>",
                    `Hacking Level multiplier: ${numeralWrapper.formatPercentage(resleeve.hacking_mult)}`,
                    `Hacking Experience multiplier: ${numeralWrapper.formatPercentage(resleeve.hacking_exp_mult)}`,
                    `Strength Level multiplier: ${numeralWrapper.formatPercentage(resleeve.strength_mult)}`,
                    `Strength Experience multiplier: ${numeralWrapper.formatPercentage(resleeve.strength_exp_mult)}`,
                    `Defense Level multiplier: ${numeralWrapper.formatPercentage(resleeve.defense_mult)}`,
                    `Defense Experience multiplier: ${numeralWrapper.formatPercentage(resleeve.defense_exp_mult)}`,
                    `Dexterity Level multiplier: ${numeralWrapper.formatPercentage(resleeve.dexterity_mult)}`,
                    `Dexterity Experience multiplier: ${numeralWrapper.formatPercentage(resleeve.dexterity_exp_mult)}`,
                    `Agility Level multiplier: ${numeralWrapper.formatPercentage(resleeve.agility_mult)}`,
                    `Agility Experience multiplier: ${numeralWrapper.formatPercentage(resleeve.agility_exp_mult)}`,
                    `Charisma Level multiplier: ${numeralWrapper.formatPercentage(resleeve.charisma_mult)}`,
                    `Charisma Experience multiplier: ${numeralWrapper.formatPercentage(resleeve.charisma_exp_mult)}`,
                    `Hacking Chance multiplier: ${numeralWrapper.formatPercentage(resleeve.hacking_chance_mult)}`,
                    `Hacking Speed multiplier: ${numeralWrapper.formatPercentage(resleeve.hacking_speed_mult)}`,
                    `Hacking Money multiplier: ${numeralWrapper.formatPercentage(resleeve.hacking_money_mult)}`,
                    `Hacking Growth multiplier: ${numeralWrapper.formatPercentage(resleeve.hacking_grow_mult)}`,
                    `Salary multiplier: ${numeralWrapper.formatPercentage(resleeve.work_money_mult)}`,
                    `Company Reputation Gain multiplier: ${numeralWrapper.formatPercentage(resleeve.company_rep_mult)}`,
                    `Faction Reputation Gain multiplier: ${numeralWrapper.formatPercentage(resleeve.faction_rep_mult)}`,
                    `Crime Money multiplier: ${numeralWrapper.formatPercentage(resleeve.crime_money_mult)}`,
                    `Crime Success multiplier: ${numeralWrapper.formatPercentage(resleeve.crime_success_mult)}`,
                ].join("<br>"), false
            )
        }
    });

    elems.augPanel = createElement("div", { class: "resleeve-panel" });
    elems.augSelector = createElement("select") as HTMLSelectElement;
    for (let i = 0; i < resleeve.augmentations.length; ++i) {
        elems.augSelector.add(createOptionElement(resleeve.augmentations[i].name));
    };
    elems.augSelector.addEventListener("change", () => {
        updateAugDescription(elems);
    });
    elems.augDescription = createElement("p");

    elems.costPanel = createElement("div", { class: "resleeve-panel" });
    elems.costText = createElement("p", {
        innerText: `It costs ${numeralWrapper.formatMoney(resleeve.getCost())} ` +
                   `to purchase this Sleeve.`,
    });
    elems.buyButton = createElement("button", {
        class: "std-button",
        innerText: "Purchase",
        clickListener: () => {
            purchaseResleeve(resleeve, playerRef!);
        }
    });

    return elems;
}

function updateAugDescription(elems: IResleeveUIElems) {
    const augName: string = getSelectValue(elems.augSelector);
    const aug: Augmentation | null = Augmentations[augName];
    if (aug == null) {
        console.warn(`Could not find Augmentation with name ${augName}`);
        return;
    }

    elems.augDescription.innerHTML = aug!.info;
}
