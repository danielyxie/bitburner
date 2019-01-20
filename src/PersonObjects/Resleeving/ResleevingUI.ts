/**
 * Module for handling the Re-sleeving UI
 */
import { Resleeve } from "./Resleeve";
import { generateResleeves,
         purchaseResleeve } from "./Resleeving";

import { IPlayer } from "../IPlayer";

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
import { removeElement } from "../../../utils/uiHelpers/removeElement";

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
            innerHTML: "Re-sleeving is the process of digitizing and transferring your consciousness " +
                       "into a new human body, or 'sleeve'. Here at VitaLife, you can purchase new " +
                       "specially-engineered bodies for the re-sleeve process. Many of these bodies " +
                       "even come with genetic and cybernetic Augmentations!<br><br>" +
                       "Re-sleeving will chance your experience for every stat. It will also REMOVE " +
                       "all of your currently-installed Augmentations, and replace " +
                       "them with the ones provided by the purchased sleeve. However, Augmentations that you have " +
                       "purchased but not installed will NOT be removed. If you have purchased an " +
                       "Augmentation and then re-sleeve into a body which already has that Augmentation, " +
                       "it will be removed (since you cannot have duplicate Augmentations).<br><br>" +
                       "NOTE: The stats and multipliers displayed on this page do NOT include your bonuses from " +
                       "Source-File.",
            width: "75%",
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
    if (UIElems.container instanceof HTMLElement) {
        removeElement(UIElems.container);
    }

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

    elems.statsPanel = createElement("div", { class: "resleeve-panel", width: "30%" });
    elems.stats = createElement("p", {
        class: "resleeve-stats-text",
        innerHTML:
            `Hacking: ${numeralWrapper.format(resleeve.hacking_skill, "0,0")} (${numeralWrapper.formatBigNumber(resleeve.hacking_exp)} exp)<br>` +
            `Strength: ${numeralWrapper.format(resleeve.strength, "0,0")} (${numeralWrapper.formatBigNumber(resleeve.strength_exp)} exp)<br>` +
            `Defense: ${numeralWrapper.format(resleeve.defense, "0,0")} (${numeralWrapper.formatBigNumber(resleeve.defense_exp)} exp)<br>` +
            `Dexterity: ${numeralWrapper.format(resleeve.dexterity, "0,0")} (${numeralWrapper.formatBigNumber(resleeve.dexterity_exp)} exp)<br>` +
            `Agility: ${numeralWrapper.format(resleeve.agility, "0,0")} (${numeralWrapper.formatBigNumber(resleeve.agility_exp)} exp)<br>` +
            `Charisma: ${numeralWrapper.format(resleeve.charisma, "0,0")} (${numeralWrapper.formatBigNumber(resleeve.charisma_exp)} exp)`,
    });
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
                    `Hacknet Income multiplier: ${numeralWrapper.formatPercentage(resleeve.hacknet_node_money_mult)}`,
                    `Hacknet Purchase Cost multiplier: ${numeralWrapper.formatPercentage(resleeve.hacknet_node_purchase_cost_mult)}`,
                    `Hacknet Level Upgrade Cost multiplier: ${numeralWrapper.formatPercentage(resleeve.hacknet_node_level_cost_mult)}`,
                    `Hacknet Ram Upgrade Cost multiplier: ${numeralWrapper.formatPercentage(resleeve.hacknet_node_ram_cost_mult)}`,
                    `Hacknet Core Upgrade Cost multiplier: ${numeralWrapper.formatPercentage(resleeve.hacknet_node_core_cost_mult)}`,
                    `Bladeburner Max Stamina multiplier: ${numeralWrapper.formatPercentage(resleeve.bladeburner_max_stamina_mult)}`,
                    `Bladeburner Stamina Gain multiplier: ${numeralWrapper.formatPercentage(resleeve.bladeburner_stamina_gain_mult)}`,
                    `Bladeburner Field Analysis multiplier: ${numeralWrapper.formatPercentage(resleeve.bladeburner_analysis_mult)}`,
                    `Bladeburner Success Chance multiplier: ${numeralWrapper.formatPercentage(resleeve.bladeburner_success_chance_mult)}`
                ].join("<br>"), false
            )
        }
    });
    elems.statsPanel.appendChild(elems.stats);
    elems.statsPanel.appendChild(elems.multipliersButton);

    elems.augPanel = createElement("div", { class: "resleeve-panel", width: "50%" });
    elems.augSelector = createElement("select", { class: "resleeve-aug-selector" }) as HTMLSelectElement;
    elems.augDescription = createElement("p");
    for (let i = 0; i < resleeve.augmentations.length; ++i) {
        elems.augSelector.add(createOptionElement(resleeve.augmentations[i].name));
    };
    elems.augSelector.addEventListener("change", () => {
        updateAugDescription(elems);
    });
    elems.augSelector.dispatchEvent(new Event('change')); // Set inital description by manually triggering change event
    elems.augPanel.appendChild(elems.augSelector);
    elems.augPanel.appendChild(elems.augDescription);

    const cost: number = resleeve.getCost();
    elems.costPanel = createElement("div", { class: "resleeve-panel", width: "20%" });
    elems.costText = createElement("p", {
        innerText: `It costs ${numeralWrapper.formatMoney(cost)} ` +
                   `to purchase this Sleeve.`,
    });
    elems.buyButton = createElement("button", {
        class: "std-button",
        innerText: "Purchase",
        clickListener: () => {
            if (purchaseResleeve(resleeve, playerRef!)) {
                dialogBoxCreate(`You re-sleeved for ${numeralWrapper.formatMoney(cost)}!`, false);
            } else {
                dialogBoxCreate(`You cannot afford to re-sleeve into this body`, false);
            }
        }
    });
    elems.costPanel.appendChild(elems.costText);
    elems.costPanel.appendChild(elems.buyButton);

    elems.container.appendChild(elems.statsPanel);
    elems.container.appendChild(elems.augPanel);
    elems.container.appendChild(elems.costPanel);

    return elems;
}

function updateAugDescription(elems: IResleeveUIElems) {
    const augName: string = getSelectValue(elems.augSelector);
    const aug: Augmentation | null = Augmentations[augName];
    if (aug == null) {
        console.warn(`Could not find Augmentation with name ${augName}`);
        return;
    }

    elems.augDescription!.innerHTML = aug!.info;
}
