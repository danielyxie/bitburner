/**
 * Module for handling the Sleeve UI
 */
import { Sleeve } from "./Sleeve";
import { SleeveTaskType } from "./SleeveTaskTypesEnum";

import { IPlayer } from "../IPlayer";

import { Locations } from "../../Locations";

import { Cities } from "../../Locations/Cities";
import { Crimes } from "../../Crime/Crimes";

import { IMap } from "../../types";

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

// Object that keeps track of all DOM elements for the UI for a single Sleeve
interface ISleeveUIElems {
    container:              HTMLElement | null,
    statsPanel:             HTMLElement | null,
    stats:                  HTMLElement | null,
    moreStatsButton:        HTMLElement | null,
    taskPanel:              HTMLElement | null,
    taskSelector:           HTMLSelectElement | null,
    taskDetailsSelector:    HTMLSelectElement | null,
    taskDetailsSelector2:   HTMLSelectElement | null,
    taskDescription:        HTMLElement | null,
    taskSetButton:          HTMLElement | null,
    earningsPanel:          HTMLElement | null,
    currentEarningsInfo:    HTMLElement | null,
    totalEarningsButton:    HTMLElement | null,
}

// Object that keeps track of all DOM elements for the entire Sleeve UI
interface IPageUIElems {
    container:      HTMLElement | null;
    info:           HTMLElement | null,
    sleeveList:     HTMLElement | null,
    sleeves:        ISleeveUIElems[] | null,
}

const UIElems: IPageUIElems = {
    container: null,
    info: null,
    sleeveList: null,
    sleeves: null,
}

// Creates the UI for the entire Sleeves page
let playerRef: IPlayer | null;
export function createSleevesPage(p: IPlayer) {
    if (!routing.isOn(Page.Sleeves)) { return; }

    try {
        playerRef = p;

        UIElems.container = createElement("div", {
            class: "generic-menupage-container",
            id: "sleeves-container",
            position: "fixed",
        });

        UIElems.info = createElement("p", {
            display: "inline-block",
            innerText: "Sleeves are MK-V Synthoids (synthetic androids) into which your " +
                       "consciousness has copied. In other words, these Synthoids contain " +
                       "a perfect duplicate of your mind.<br><br>" +
                       "Sleeves can be used to perform different tasks synchronously.",
        });

        UIElems.sleeveList = createElement("ul");
        UIElems.sleeves = [];

        // Create UI modules for all Sleeve
        for (const sleeve of p.sleeves) {
            const sleeveUi = createSleeveUi(sleeve, p.sleeves);
            UIElems.sleeveList.appendChild(sleeveUi.container!);
            UIElems.sleeves.push(sleeveUi);
        }

        UIElems.container.appendChild(UIElems.info);
        UIElems.container.appendChild(UIElems.sleeveList);

        document.getElementById("entire-game-container")!.appendChild(UIElems.container);
    } catch(e) {
        exceptionAlert(e);
    }
}

// Updates the UI for the entire Sleeves page
export function updateSleevesPage() {
    if (!routing.isOn(Page.Sleeves)) { return; }
}

export function clearSleevesPage() {
    removeElement(UIElems.container);
    for (const prop in UIElems) {
        (<any>UIElems)[prop] = null;
    }

    playerRef = null;
}

// Creates the UI for a single Sleeve
// Returns an object containing the DOM elements in the UI (ISleeveUIElems)
function createSleeveUi(sleeve: Sleeve, allSleeves: Sleeve[]): ISleeveUIElems {
    const elems: ISleeveUIElems = {
        container:              null,
        statsPanel:             null,
        stats:                  null,
        moreStatsButton:        null,
        taskPanel:              null,
        taskSelector:           null,
        taskDetailsSelector:    null,
        taskDetailsSelector2:   null,
        taskDescription:        null,
        taskSetButton:          null,
        earningsPanel:          null,
        currentEarningsInfo:    null,
        totalEarningsButton:    null,
    }

    if (!routing.isOn(Page.Sleeves)) { return elems; }

    elems.container = createElement("div", {
        class: "sleeve-container",
        display: "block",
    });

    elems.statsPanel = createElement("div", { class: "sleeve-panel" });
    elems.stats = createElement("p", { class: "sleeve-stats-text" });
    elems.moreStatsButton = createElement("button", {
        class: "std-button",
        innerText: "More Stats",
        clickListener: () => {
            dialogBoxCreate(
                [
                    "<h2><u>Stats:</u></h2>",
                    `Hacking: ${sleeve.hacking_skill} (${numeralWrapper.formatBigNumber(sleeve.hacking_exp)} exp)`,
                    `Strength: ${sleeve.strength} (${numeralWrapper.formatBigNumber(sleeve.strength_exp)} exp)`,
                    `Defense: ${sleeve.defense} (${numeralWrapper.formatBigNumber(sleeve.defense_exp)} exp)`,
                    `Dexterity: ${sleeve.dexterity} (${numeralWrapper.formatBigNumber(sleeve.dexterity_exp)} exp)`,
                    `Agility: ${sleeve.agility} (${numeralWrapper.formatBigNumber(sleeve.agility_exp)} exp)`,
                    `Charisma: ${sleeve.charisma} (${numeralWrapper.formatBigNumber(sleeve.charisma_exp)} exp)<br>`,
                    "<h2><u>Multipliers:</u></h2>",
                    `Hacking Level multiplier: ${numeralWrapper.formatPercentage(sleeve.hacking_mult)}`,
                    `Hacking Experience multiplier: ${numeralWrapper.formatPercentage(sleeve.hacking_exp_mult)}`,
                    `Strength Level multiplier: ${numeralWrapper.formatPercentage(sleeve.strength_mult)}`,
                    `Strength Experience multiplier: ${numeralWrapper.formatPercentage(sleeve.strength_exp_mult)}`,
                    `Defense Level multiplier: ${numeralWrapper.formatPercentage(sleeve.defense_mult)}`,
                    `Defense Experience multiplier: ${numeralWrapper.formatPercentage(sleeve.defense_exp_mult)}`,
                    `Dexterity Level multiplier: ${numeralWrapper.formatPercentage(sleeve.dexterity_mult)}`,
                    `Dexterity Experience multiplier: ${numeralWrapper.formatPercentage(sleeve.dexterity_exp_mult)}`,
                    `Agility Level multiplier: ${numeralWrapper.formatPercentage(sleeve.agility_mult)}`,
                    `Agility Experience multiplier: ${numeralWrapper.formatPercentage(sleeve.agility_exp_mult)}`,
                    `Charisma Level multiplier: ${numeralWrapper.formatPercentage(sleeve.charisma_mult)}`,
                    `Charisma Experience multiplier: ${numeralWrapper.formatPercentage(sleeve.charisma_exp_mult)}`,
                    `Faction Reputation Gain multiplier: ${numeralWrapper.formatPercentage(sleeve.faction_rep_mult)}`,
                    `Company Reputation Gain multiplier: ${numeralWrapper.formatPercentage(sleeve.company_rep_mult)}`,
                    `Salary multiplier: ${numeralWrapper.formatPercentage(sleeve.work_money_mult)}`,
                    `Crime Money multiplier: ${numeralWrapper.formatPercentage(sleeve.crime_money_mult)}`,
                    `Crime Success multiplier: ${numeralWrapper.formatPercentage(sleeve.crime_success_mult)}`,
                ].join("<br>"), false
            );
        }
    });
    elems.statsPanel.appendChild(elems.stats);
    elems.statsPanel.appendChild(elems.moreStatsButton);

    elems.taskPanel = createElement("div", { class: "sleeve-panel" });
    elems.taskSelector = createElement("select") as HTMLSelectElement;
    elems.taskSelector.add(createOptionElement("------"));
    elems.taskSelector.add(createOptionElement("Work for Company"));
    elems.taskSelector.add(createOptionElement("Work for Faction"));
    elems.taskSelector.add(createOptionElement("Commit Crime"));
    elems.taskSelector.add(createOptionElement("Take University Course"));
    elems.taskSelector.add(createOptionElement("Workout at Gym"));
    elems.taskSelector.add(createOptionElement("Shock Recovery"));
    elems.taskSelector.add(createOptionElement("Synchronize"));
    elems.taskSelector.addEventListener("change", () => {
        updateSleeveTaskSelector(sleeve, elems, allSleeves);
    });
    // TODO Set initial value for task selector
    elems.taskDetailsSelector = createElement("select") as HTMLSelectElement;
    elems.taskDetailsSelector2 = createElement("select") as HTMLSelectElement;
    elems.taskDescription = createElement("p");
    elems.taskSetButton = createElement("button", {
        class: "std-button",
        innerText: "Set Task",
        clickListener: () => {
            setSleeveTask(sleeve, elems);
        }
    });
    elems.taskPanel.appendChild(elems.taskSelector);
    elems.taskPanel.appendChild(elems.taskDetailsSelector);
    elems.taskPanel.appendChild(elems.taskSetButton);
    elems.taskPanel.appendChild(elems.taskDescription);

    elems.earningsPanel = createElement("div", { class: "sleeve-panel" });
    elems.currentEarningsInfo = createElement("p");
    elems.totalEarningsButton = createElement("button", {
        class: "std-button",
        innerText: "More Earnings Info",
        clickListener: () => {
            dialogBoxCreate(
                [
                    "<h2><u>Total Earnings for Current Task:</u></h2>",
                    `Money: ${numeralWrapper.formatMoney(sleeve.earningsForTask.money)}`,
                    `Hacking Exp: ${numeralWrapper.formatBigNumber(sleeve.earningsForTask.hack)}`,
                    `Strength Exp: ${numeralWrapper.formatBigNumber(sleeve.earningsForTask.str)}`,
                    `Defense Exp: ${numeralWrapper.formatBigNumber(sleeve.earningsForTask.def)}`,
                    `Dexterity Exp: ${numeralWrapper.formatBigNumber(sleeve.earningsForTask.dex)}`,
                    `Agility Exp: ${numeralWrapper.formatBigNumber(sleeve.earningsForTask.agi)}`,
                    `Charisma Exp: ${numeralWrapper.formatBigNumber(sleeve.earningsForTask.cha)}`,
                    "<h2><u>Earnings for Host Consciousness:</u></h2>",
                    `Money: ${numeralWrapper.formatMoney(sleeve.earningsForPlayer.money)}`,
                    `Hacking Exp: ${numeralWrapper.formatBigNumber(sleeve.earningsForPlayer.hack)}`,
                    `Strength Exp: ${numeralWrapper.formatBigNumber(sleeve.earningsForPlayer.str)}`,
                    `Defense Exp: ${numeralWrapper.formatBigNumber(sleeve.earningsForPlayer.def)}`,
                    `Dexterity Exp: ${numeralWrapper.formatBigNumber(sleeve.earningsForPlayer.dex)}`,
                    `Agility Exp: ${numeralWrapper.formatBigNumber(sleeve.earningsForPlayer.agi)}`,
                    `Charisma Exp: ${numeralWrapper.formatBigNumber(sleeve.earningsForPlayer.cha)}`,
                    "<h2><u>Earnings for Other Sleeves:</u></h2>",
                    `Money: ${numeralWrapper.formatMoney(sleeve.earningsForSleeves.money)}`,
                    `Hacking Exp: ${numeralWrapper.formatBigNumber(sleeve.earningsForSleeves.hack)}`,
                    `Strength Exp: ${numeralWrapper.formatBigNumber(sleeve.earningsForSleeves.str)}`,
                    `Defense Exp: ${numeralWrapper.formatBigNumber(sleeve.earningsForSleeves.def)}`,
                    `Dexterity Exp: ${numeralWrapper.formatBigNumber(sleeve.earningsForSleeves.dex)}`,
                    `Agility Exp: ${numeralWrapper.formatBigNumber(sleeve.earningsForSleeves.agi)}`,
                    `Charisma Exp: ${numeralWrapper.formatBigNumber(sleeve.earningsForSleeves.cha)}`,
                ].join("<br>"), false
            );
        }
    });

    return elems;
}

// Updates the UI for a single Sleeve
function updateSleeveUi(sleeve: Sleeve, elems: ISleeveUIElems) {
    if (!routing.isOn(Page.Sleeves)) { return; }

    elems.stats!.innerHTML = [`Hacking: ${numeralWrapper.format(sleeve.hacking_skill, "0,0")}`,
                              `Strength: ${numeralWrapper.format(sleeve.strength, "0,0")}`,
                              `Defense: ${numeralWrapper.format(sleeve.defense, "0,0")}`,
                              `Dexterity: ${numeralWrapper.format(sleeve.dexterity, "0,0")}`,
                              `Agility: ${numeralWrapper.format(sleeve.agility, "0,0")}`,
                              `Charisma: ${numeralWrapper.format(sleeve.charisma, "0,0")}`,
                              `HP: ${numeralWrapper.format(sleeve.hp, "0,0")} / ${numeralWrapper.format(sleeve.max_hp, "0,0")}<br>`,
                              `Shock: ${numeralWrapper.format(100 - sleeve.shock, "0,0")}`,
                              `Synchronization: ${numeralWrapper.format(sleeve.sync, "0,0")}`].join("<br>");

    if (sleeve.currentTask === SleeveTaskType.Crime) {
        elems.currentEarningsInfo!.innerHTML = [
            `Money: ${numeralWrapper.formatMoney(sleeve.gainRatesForTask.money)} if successful`,
            `Hacking Exp: ${numeralWrapper.format(sleeve.gainRatesForTask.hack, "0.00")} (2x if successful)`,
            `Strength Exp: ${numeralWrapper.format(sleeve.gainRatesForTask.str, "0.00")} (2x if successful)`,
            `Defense Exp: ${numeralWrapper.format(sleeve.gainRatesForTask.def, "0.00")} (2x if successful)`,
            `Dexterity Exp: ${numeralWrapper.format(sleeve.gainRatesForTask.dex, "0.00")} (2x if successful)`,
            `Agility Exp: ${numeralWrapper.format(sleeve.gainRatesForTask.agi, "0.00")} (2x if successful)`,
            `Charisma Exp: ${numeralWrapper.format(sleeve.gainRatesForTask.cha, "0.00")} (2x if successful)`
        ].join("<br>");
    } else {
        elems.currentEarningsInfo!.innerHTML = [
            `Money: ${numeralWrapper.formatMoney(sleeve.gainRatesForTask.money)} / s`,
            `Hacking Exp: ${numeralWrapper.format(sleeve.gainRatesForTask.hack, "0.00")} / s`,
            `Strength Exp: ${numeralWrapper.format(sleeve.gainRatesForTask.str, "0.00")} / s`,
            `Defense Exp: ${numeralWrapper.format(sleeve.gainRatesForTask.def, "0.00")} / s`,
            `Dexterity Exp: ${numeralWrapper.format(sleeve.gainRatesForTask.dex, "0.00")} / s`,
            `Agility Exp: ${numeralWrapper.format(sleeve.gainRatesForTask.agi, "0.00")} / s`,
            `Charisma Exp: ${numeralWrapper.format(sleeve.gainRatesForTask.cha, "0.00")} / s`
        ].join("<br>");
    }
}

const factionWorkTypeSelectorOptions: string[] = [
    "Hacking Contracts",
    "Security Work",
    "Field Work"
];

const universitySelectorOptions: string[] = [
    "Study Computer Science",
    "Data Structures",
    "Networks",
    "Algorithms",
    "Management",
    "Leadership"
];

const gymSelectorOptions: string[] = [
    "Train Strength",
    "Train Defense",
    "Train Dexterity",
    "Train Agility"
];

// Whenever a new task is selected, the "details" selector must update accordingly
function updateSleeveTaskSelector(sleeve: Sleeve, elems: ISleeveUIElems, allSleeves: Sleeve[]) {
    if (playerRef == null) {
        throw new Error(`playerRef is null in updateSleeveTaskSelector()`);
    }

    // Array of all companies that other sleeves are working at
    const forbiddenCompanies: string[] = [];
    for (const otherSleeve of allSleeves) {
        if (sleeve === otherSleeve) { continue; }
        if (otherSleeve.currentTask === SleeveTaskType.Company) {
            forbiddenCompanies.push(otherSleeve.currentTaskLocation);
        }
    }

    // Array of all factions that other sleeves are working for
    const forbiddenFactions: string[] = [];
    for (const otherSleeve of allSleeves) {
        if (sleeve === otherSleeve) { continue; }
        if (otherSleeve.currentTask === SleeveTaskType.Faction) {
            forbiddenFactions.push(otherSleeve.currentTaskLocation);
        }
    }

    removeChildrenFromElement(elems.taskDetailsSelector);

    const value: string = getSelectValue(elems.taskSelector);
    switch(value) {
        case "Work for Company":
            const allJobs: string[] = Object.keys(playerRef!.jobs!);
            for (let i = 0; i < allJobs.length; ++i) {
                if (!forbiddenCompanies.includes(allJobs[i])) {
                    elems.taskDetailsSelector!.add(createOptionElement(allJobs[i]));
                }
            }
            break;
        case "Work for Faction":
            for (let i = 0; i < playerRef!.factions!.length; ++i) {
                const fac: string = playerRef!.factions[i]!;
                if (!forbiddenFactions.includes(fac)) {
                    elems.taskDetailsSelector!.add(createOptionElement(fac));
                }
            }
            for (let i = 0; i < factionWorkTypeSelectorOptions.length; ++i) {
                elems.taskDetailsSelector2!.add(createOptionElement(factionWorkTypeSelectorOptions[i]));
            }
            break;
        case "Commit Crime":
            for (const crimeLabel in Crimes) {
                const name: string = Crimes[crimeLabel].name;
                elems.taskDetailsSelector!.add(createOptionElement(name, crimeLabel));
            }
            break;
        case "Take University Course":
            // First selector has class type
            for (let i = 0; i < universitySelectorOptions.length; ++i) {
                elems.taskDetailsSelector!.add(createOptionElement(universitySelectorOptions[i]));
            }

            // Second selector has which university
            switch (sleeve.city) {
                case Cities.Aevum:
                    elems.taskDetailsSelector2!.add(createOptionElement(Locations.AevumSummitUniversity));
                    break;
                case Cities.Sector12:
                    elems.taskDetailsSelector2!.add(createOptionElement(Locations.Sector12RothmanUniversity));
                    break;
                case Cities.Volhaven:
                    elems.taskDetailsSelector2!.add(createOptionElement(Locations.VolhavenZBInstituteOfTechnology));
                    break;
                default:
                    elems.taskDetailsSelector2!.add(createOptionElement("No university available in city!"));
                    break;
            }
            break;
        case "Workout at Gym":
            // First selector has what stat is being trained
            for (let i = 0; i < gymSelectorOptions.length; ++i) {
                elems.taskDetailsSelector!.add(createOptionElement(gymSelectorOptions[i]));
            }

            // Second selector has gym
            switch (sleeve.city) {
                case Cities.Aevum:
                    elems.taskDetailsSelector2!.add(createOptionElement(Locations.AevumCrushFitnessGym));
                    elems.taskDetailsSelector2!.add(createOptionElement(Locations.AevumSnapFitnessGym));
                    break;
                case Cities.Sector12:
                    elems.taskDetailsSelector2!.add(createOptionElement(Locations.Sector12IronGym));
                    elems.taskDetailsSelector2!.add(createOptionElement(Locations.Sector12PowerhouseGym));
                    break;
                case Cities.Volhaven:
                    elems.taskDetailsSelector2!.add(createOptionElement(Locations.VolhavenMilleniumFitnessGym));
                    break;
                default:
                    elems.taskDetailsSelector2!.add(createOptionElement("No gym available in city!"));
                    break;
            }

            break;
        case "Shock Recovery":
            // No options in "Details" selector
            return;
        case "Synchronize":
            // No options in "Details" selector
            return;
        default:
            break;
    }
}

function setSleeveTask(sleeve: Sleeve, elems: ISleeveUIElems): void {
    try {
        if (playerRef == null) {
            throw new Error("playerRef is null in Sleeve UI's setSleeveTask()");
        }

        const taskValue: string = getSelectValue(elems.taskSelector);
        const detailValue: string = getSelectValue(elems.taskDetailsSelector);
        const detailValue2: string = getSelectValue(elems.taskDetailsSelector);

        let res: boolean = false;
        switch(taskValue) {
            case "Work for Company":
                res = sleeve.workForCompany(playerRef!, detailValue);
                if (res) {
                    elems.taskDescription!.innerText = `This sleeve is currently working your ` +
                                                      `job at ${sleeve.currentTaskLocation}.`;
                } else {
                    elems.taskDescription!.innerText = "Failed to assign sleeve to task. Invalid choice(s).";
                }
                break;
            case "Work for Faction":
                res = sleeve.workForFaction(playerRef!, detailValue, detailValue2);
                if (res) {
                    elems.taskDescription!.innerText = `This sleeve is currently doing ${detailValue2} for ` +
                                                      `${sleeve.currentTaskLocation}.`;
                } else {
                    elems.taskDescription!.innerText = "Failed to assign sleeve to task. Invalid choice(s).";
                }
                break;
            case "Commit Crime":
                sleeve.commitCrime(playerRef!, Crimes[detailValue]);
                elems.taskDescription!.innerText = `This sleeve is currently attempting to ` +
                                                  `${Crimes[detailValue]}.`;
                break;
            case "Take University Course":
                res = sleeve.takeUniversityCourse(playerRef!, detailValue2, detailValue);
                break;
            case "Workout at Gym":
                res = sleeve.workoutAtGym(playerRef!, detailValue2, detailValue);
                break;
            case "Shock Recovery":
                sleeve.currentTask = SleeveTaskType.Recovery;
                elems.taskDescription!.innerText = "This sleeve is currently set to focus on shock recovery. This causes " +
                                                  "the Sleeve's shock to decrease at a faster rate.";
                break;
            case "Synchronize":
                sleeve.currentTask = SleeveTaskType.Sync;
                elems.taskDescription!.innerText = "This sleeve is currently set to synchronize with the original consciousness. " +
                                                  "This causes the Sleeve's synchronization to increase."
                break;
            default:
                console.error(`Invalid/Unrecognized taskValue in setSleeveTask(): ${taskValue}`);
        }

        if (routing.isOn(Page.Sleeves)) {
            updateSleevesPage();
        }
    } catch(e) {
        exceptionAlert(e);
    }
}
