/**
 * Module for handling the Sleeve UI
 */
import { createSleevePurchaseAugsPopup } from "./SleeveAugmentationsUI";
import { Sleeve } from "./Sleeve";
import { SleeveTaskType } from "./SleeveTaskTypesEnum";
import { SleeveFaq } from "./data/SleeveFaq";

import { IPlayer } from "../IPlayer";

import { CONSTANTS } from "../../Constants";

import { Faction } from "../../Faction/Faction";
import { Factions } from "../../Faction/Factions";
import { FactionWorkType } from "../../Faction/FactionWorkTypeEnum";

import { Crime } from "../../Crime/Crime";
import { Crimes } from "../../Crime/Crimes";
import { Cities } from "../../Locations/Cities";
import { CityName } from "../../Locations/data/CityNames";
import { LocationName } from "../../Locations/data/LocationNames";

import { numeralWrapper } from "../../ui/numeralFormat";
import { Page,
         routing } from "../../ui/navigationTracking";

import { dialogBoxCreate } from "../../../utils/DialogBox";

import { createProgressBarText } from "../../../utils/helpers/createProgressBarText";
import { exceptionAlert } from "../../../utils/helpers/exceptionAlert";

import { clearEventListeners } from "../../../utils/uiHelpers/clearEventListeners";
import { createElement } from "../../../utils/uiHelpers/createElement";
import { createOptionElement } from "../../../utils/uiHelpers/createOptionElement";
import { createPopup } from "../../../utils/uiHelpers/createPopup";
import { createPopupCloseButton } from "../../../utils/uiHelpers/createPopupCloseButton";
import { getSelectValue } from "../../../utils/uiHelpers/getSelectData";
import { removeChildrenFromElement } from "../../../utils/uiHelpers/removeChildrenFromElement";
import { removeElement } from "../../../utils/uiHelpers/removeElement";
import { removeElementById } from "../../../utils/uiHelpers/removeElementById";

import { EarningsTableElement } from "./ui/EarningsTableElement";
import { Money } from "../../ui/React/Money";
import { MoneyRate } from "../../ui/React/MoneyRate";
import { ReputationRate } from "../../ui/React/ReputationRate";
import { StatsElement } from "./ui/StatsElement";
import { MoreStatsContent } from "./ui/MoreStatsContent";
import { MoreEarningsContent } from "./ui/MoreEarningsContent";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { renderToStaticMarkup } from "react-dom/server"

// Object that keeps track of all DOM elements for the UI for a single Sleeve
interface ISleeveUIElems {
    container:              HTMLElement | null;
    statsPanel:             HTMLElement | null;
    stats:                  HTMLElement | null;
    moreStatsButton:        HTMLElement | null;
    travelButton:           HTMLElement | null;
    purchaseAugsButton:     HTMLElement | null;
    taskPanel:              HTMLElement | null;
    taskSelector:           HTMLSelectElement | null;
    taskDetailsSelector:    HTMLSelectElement | null;
    taskDetailsSelector2:   HTMLSelectElement | null;
    taskDescription:        HTMLElement | null;
    taskSetButton:          HTMLElement | null;
    taskProgressBar:        HTMLElement | null;
    earningsPanel:          HTMLElement | null;
    currentEarningsInfo:    HTMLElement | null;
    totalEarningsButton:    HTMLElement | null;
}

// Object that keeps track of all DOM elements for the entire Sleeve UI
interface IPageUIElems {
    container:      HTMLElement | null;
    docButton:      HTMLElement | null;
    faqButton:      HTMLElement | null;
    info:           HTMLElement | null;
    sleeveList:     HTMLElement | null;
    sleeves:        ISleeveUIElems[] | null;
}

const UIElems: IPageUIElems = {
    container: null,
    docButton: null,
    faqButton: null,
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
            class: "sleeves-page-info",
            innerHTML: "<h1>Sleeves</h1>Duplicate Sleeves are MK-V Synthoids (synthetic androids) into which your " +
                       "consciousness has been copied. In other words, these Synthoids contain " +
                       "a perfect duplicate of your mind.<br /><br />" +
                       "Sleeves can be used to perform different tasks synchronously.<br /><br />",
        });

        UIElems.faqButton = createElement("button", {
            class: "std-button",
            display: "inline-block",
            innerText: "FAQ",
            clickListener: () => {
                dialogBoxCreate(SleeveFaq, false);
            }
        });

        UIElems.docButton = createElement("a", {
            class: "std-button",
            display: "inline-block",
            href: "https://bitburner.readthedocs.io/en/latest/advancedgameplay/sleeves.html#duplicate-sleeves",
            innerText: "Documentation",
            target: "_blank",
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
        UIElems.container.appendChild(UIElems.faqButton);
        UIElems.container.appendChild(UIElems.docButton);
        UIElems.container.appendChild(UIElems.sleeveList);

        document.getElementById("entire-game-container")!.appendChild(UIElems.container);
    } catch(e) {
        exceptionAlert(e);
    }
}

// Updates the UI for the entire Sleeves page
export function updateSleevesPage() {
    if (!routing.isOn(Page.Sleeves)) { return; }

     try {
         for (let i = 0; i < playerRef!.sleeves.length; ++i) {
            const sleeve: Sleeve = playerRef!.sleeves[i];
            const elems: ISleeveUIElems = UIElems.sleeves![i];
            updateSleeveUi(sleeve!, elems!);
         }
     } catch(e) {
         exceptionAlert(e);
     }
}

export function clearSleevesPage() {
    if (UIElems.container instanceof HTMLElement) {
        removeElement(UIElems.container);
    }

    for (const prop in UIElems) {
        (UIElems as any)[prop] = null;
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
        travelButton:           null,
        purchaseAugsButton:     null,
        taskPanel:              null,
        taskSelector:           null,
        taskDetailsSelector:    null,
        taskDetailsSelector2:   null,
        taskDescription:        null,
        taskSetButton:          null,
        taskProgressBar:        null,
        earningsPanel:          null,
        currentEarningsInfo:    null,
        totalEarningsButton:    null,
    }

    if (!routing.isOn(Page.Sleeves)) { return elems; }

    elems.container = createElement("div", {
        class: "sleeve-container",
        display: "block",
    });

    elems.statsPanel = createElement("div", { class: "sleeve-panel", width: "25%" });
    elems.stats = createElement("div", { class: "sleeve-stats-text" });
    elems.moreStatsButton = createElement("button", {
        class: "std-button",
        innerText: "More Stats",
        clickListener: () => {
            dialogBoxCreate(MoreStatsContent(sleeve));
        }
    });
    elems.travelButton = createElement("button", {
        class: "std-button",
        innerText: "Travel",
        clickListener: () => {
            const popupId: string = "sleeve-travel-popup";
            const popupArguments: HTMLElement[] = [];
            popupArguments.push(createPopupCloseButton(popupId, { class: "std-button" }));
            popupArguments.push(createElement("p", {
                innerHTML: "Have this sleeve travel to a different city. This affects " +
                           "the gyms and universities at which this sleeve can study. " +
                           `Traveling to a different city costs ${renderToStaticMarkup(Money(CONSTANTS.TravelCost))}. ` +
                           "It will also CANCEL the sleeve's current task (setting it to idle)",
            }));
            for (const cityName in Cities) {
                if (sleeve.city === cityName) { continue; }
                (function(sleeve, cityName) {
                    popupArguments.push(createElement("div", {
                        // Reusing this css class. It adds a border and makes it so that
                        // the background color changes when you hover
                        class: "cmpy-mgmt-find-employee-option",
                        innerText: cityName,
                        clickListener: () => {
                            if (!playerRef!.canAfford(CONSTANTS.TravelCost)) {
                                dialogBoxCreate("You cannot afford to have this sleeve travel to another city", false);
                                return false;
                            }
                            sleeve.city = cityName as CityName;
                            playerRef!.loseMoney(CONSTANTS.TravelCost);
                            sleeve.resetTaskStatus();
                            removeElementById(popupId);
                            updateSleeveUi(sleeve, elems);
                            updateSleeveTaskSelector(sleeve, elems, allSleeves);
                            return false;
                        }
                    }));
                })(sleeve, cityName);
            }

            createPopup(popupId, popupArguments);
        }
    });
    elems.purchaseAugsButton = createElement("button", {
        class: "std-button",
        display: "block",
        innerText: "Manage Augmentations",
        clickListener: () => {
            createSleevePurchaseAugsPopup(sleeve, playerRef!);
        }
    });
    elems.statsPanel.appendChild(elems.stats);
    elems.statsPanel.appendChild(elems.moreStatsButton);
    elems.statsPanel.appendChild(elems.travelButton);
    if (sleeve.shock >= 100) {
        // You can only buy augs when shock recovery is 0
        elems.statsPanel.appendChild(elems.purchaseAugsButton);
    }

    elems.taskPanel = createElement("div", { class: "sleeve-panel", width: "40%" });
    elems.taskSelector = createElement("select", { class: "dropdown" }) as HTMLSelectElement;
    elems.taskSelector.add(createOptionElement("------"));
    elems.taskSelector.add(createOptionElement("Work for Company"));
    elems.taskSelector.add(createOptionElement("Work for Faction"));
    elems.taskSelector.add(createOptionElement("Commit Crime"));
    elems.taskSelector.add(createOptionElement("Take University Course"));
    elems.taskSelector.add(createOptionElement("Workout at Gym"));
    elems.taskSelector.add(createOptionElement("Shock Recovery"));
    elems.taskSelector.add(createOptionElement("Synchronize"));
    elems.taskDetailsSelector = createElement("select", { class: "dropdown" }) as HTMLSelectElement;
    elems.taskDetailsSelector2 = createElement("select", { class: "dropdown" }) as HTMLSelectElement;
    elems.taskDescription = createElement("p");
    elems.taskProgressBar = createElement("p");
    elems.taskSelector.addEventListener("change", () => {
        updateSleeveTaskSelector(sleeve, elems, allSleeves);
    });
    elems.taskSelector.selectedIndex = sleeve.currentTask; // Set initial value for Task Selector
    elems.taskSelector.dispatchEvent(new Event('change'));
    updateSleeveTaskDescription(sleeve, elems);
    elems.taskSetButton = createElement("button", {
        class: "std-button",
        innerText: "Set Task",
        clickListener: () => {
            setSleeveTask(sleeve, elems);
        }
    });
    elems.taskPanel.appendChild(elems.taskSelector);
    elems.taskPanel.appendChild(elems.taskDetailsSelector);
    elems.taskPanel.appendChild(elems.taskDetailsSelector2);
    elems.taskPanel.appendChild(elems.taskSetButton);
    elems.taskPanel.appendChild(elems.taskDescription);
    elems.taskPanel.appendChild(elems.taskProgressBar);

    elems.earningsPanel = createElement("div", { class: "sleeve-panel", width: "35%" });
    elems.currentEarningsInfo = createElement("div");
    elems.totalEarningsButton = createElement("button", {
        class: "std-button",
        innerText: "More Earnings Info",
        clickListener: () => {
            dialogBoxCreate(MoreEarningsContent(sleeve));
        }
    });

    elems.earningsPanel.appendChild(elems.currentEarningsInfo);
    elems.earningsPanel.appendChild(elems.totalEarningsButton);

    updateSleeveUi(sleeve, elems);

    elems.container.appendChild(elems.statsPanel);
    elems.container.appendChild(elems.taskPanel);
    elems.container.appendChild(elems.earningsPanel);

    return elems;
}

// Updates the UI for a single Sleeve
function updateSleeveUi(sleeve: Sleeve, elems: ISleeveUIElems) {
    if (!routing.isOn(Page.Sleeves)) { return; }

    ReactDOM.render(StatsElement(sleeve), elems.stats!);

    if (sleeve.currentTask === SleeveTaskType.Crime) {
        const data = [
            [`Money`, Money(parseFloat(sleeve.currentTaskLocation)), `(on success)`],
            [`Hacking Exp`, numeralWrapper.formatExp(sleeve.gainRatesForTask.hack), `(2x on success)`],
            [`Strength Exp`, numeralWrapper.formatExp(sleeve.gainRatesForTask.str), `(2x on success)`],
            [`Defense Exp`, numeralWrapper.formatExp(sleeve.gainRatesForTask.def), `(2x on success)`],
            [`Dexterity Exp`, numeralWrapper.formatExp(sleeve.gainRatesForTask.dex), `(2x on success)`],
            [`Agility Exp`, numeralWrapper.formatExp(sleeve.gainRatesForTask.agi), `(2x on success)`],
            [`Charisma Exp`, numeralWrapper.formatExp(sleeve.gainRatesForTask.cha), `(2x on success)`]
        ];
        ReactDOM.render(EarningsTableElement('Earnings (Pre-Synchronization)', data), elems.currentEarningsInfo!)

        elems.taskProgressBar!.innerText = createProgressBarText({
            progress: sleeve.currentTaskTime / sleeve.currentTaskMaxTime,
            totalTicks: 25,
        });
    } else {
        const data = [
            [`Money:`, MoneyRate(5 * sleeve.gainRatesForTask.money)],
            [`Hacking Exp:`, `${numeralWrapper.formatExp(5 * sleeve.gainRatesForTask.hack)} / s`],
            [`Strength Exp:`, `${numeralWrapper.formatExp(5 * sleeve.gainRatesForTask.str)} / s`],
            [`Defense Exp:`, `${numeralWrapper.formatExp(5 * sleeve.gainRatesForTask.def)} / s`],
            [`Dexterity Exp:`, `${numeralWrapper.formatExp(5 * sleeve.gainRatesForTask.dex)} / s`],
            [`Agility Exp:`, `${numeralWrapper.formatExp(5 * sleeve.gainRatesForTask.agi)} / s`],
            [`Charisma Exp:`, `${numeralWrapper.formatExp(5 * sleeve.gainRatesForTask.cha)} / s`]
        ];
        let repGainText: string = "";
        if (sleeve.currentTask === SleeveTaskType.Company || sleeve.currentTask === SleeveTaskType.Faction) {
            const repGain: number = sleeve.getRepGain(playerRef!);
            data.push([`Reputation:`, ReputationRate(5 * repGain)]);
        }
        ReactDOM.render(EarningsTableElement('Earnings (Pre-Synchronization)', data), elems.currentEarningsInfo!)

        elems.taskProgressBar!.innerText = "";
    }
}

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

    // Reset Selectors
    removeChildrenFromElement(elems.taskDetailsSelector);
    removeChildrenFromElement(elems.taskDetailsSelector2);
    elems.taskDetailsSelector2 = clearEventListeners(elems.taskDetailsSelector2!) as HTMLSelectElement;

    const value: string = getSelectValue(elems.taskSelector);
    switch(value) {
        case "Work for Company":
            let companyCount: number = 0;
            const allJobs: string[] = Object.keys(playerRef!.jobs!);
            for (let i = 0; i < allJobs.length; ++i) {
                if (!forbiddenCompanies.includes(allJobs[i])) {
                    elems.taskDetailsSelector!.add(createOptionElement(allJobs[i]));

                    // Set initial value of the 'Details' selector
                    if (sleeve.currentTaskLocation === allJobs[i]) {
                        elems.taskDetailsSelector!.selectedIndex = companyCount;
                    }

                    ++companyCount;
                }

                elems.taskDetailsSelector2!.add(createOptionElement("------"));
            }
            break;
        case "Work for Faction":
            let factionCount: number = 0;
            for (let i = 0; i < playerRef!.factions!.length; ++i) {
                const fac: string = playerRef!.factions[i]!;
                if (!forbiddenFactions.includes(fac)) {
                    elems.taskDetailsSelector!.add(createOptionElement(fac));

                    // Set initial value of the 'Details' Selector
                    if (sleeve.currentTaskLocation === fac) {
                        elems.taskDetailsSelector!.selectedIndex = factionCount;
                    }

                    ++factionCount;
                }
            }

            // The available faction work types depends on the faction
            elems.taskDetailsSelector!.addEventListener("change", () => {
                const facName = getSelectValue(elems.taskDetailsSelector!);
                const faction: Faction | null = Factions[facName];
                if (faction == null) {
                    console.warn(`Invalid faction name when trying to update Sleeve Task Selector: ${facName}`);
                    return;
                }
                const facInfo = faction.getInfo();
                removeChildrenFromElement(elems.taskDetailsSelector2!);
                let numOptionsAdded = 0;
                if (facInfo.offerHackingWork) {
                    elems.taskDetailsSelector2!.add(createOptionElement("Hacking Contracts"));
                    if (sleeve.factionWorkType === FactionWorkType.Hacking) {
                        elems.taskDetailsSelector2!.selectedIndex = numOptionsAdded;
                    }
                    ++numOptionsAdded;
                }
                if (facInfo.offerFieldWork) {
                    elems.taskDetailsSelector2!.add(createOptionElement("Field Work"));
                    if (sleeve.factionWorkType === FactionWorkType.Field) {
                        elems.taskDetailsSelector2!.selectedIndex = numOptionsAdded;
                    }
                    ++numOptionsAdded;
                }
                if (facInfo.offerSecurityWork) {
                    elems.taskDetailsSelector2!.add(createOptionElement("Security Work"));
                    if (sleeve.factionWorkType === FactionWorkType.Security) {
                        elems.taskDetailsSelector2!.selectedIndex = numOptionsAdded;
                    }
                    ++numOptionsAdded;
                }
            });
            elems.taskDetailsSelector!.dispatchEvent(new Event("change"));
            break;
        case "Commit Crime":
            let i = 0;
            for (const crimeLabel in Crimes) {
                const name: string = Crimes[crimeLabel].name;
                elems.taskDetailsSelector!.add(createOptionElement(name, crimeLabel));

                // Set initial value for crime type
                if (sleeve.crimeType === "") { continue; }
                const crime: Crime | null = Crimes[sleeve.crimeType];
                if (crime == null) { continue; }
                if (name === crime!.name) {
                    elems.taskDetailsSelector!.selectedIndex = i;
                }

                ++i;
            }

            elems.taskDetailsSelector2!.add(createOptionElement("------"));
            break;
        case "Take University Course":
            // First selector has class type
            for (let i = 0; i < universitySelectorOptions.length; ++i) {
                elems.taskDetailsSelector!.add(createOptionElement(universitySelectorOptions[i]));

                // Set initial value
                if (sleeve.className === universitySelectorOptions[i]) {
                    elems.taskDetailsSelector!.selectedIndex = i;
                }
            }

            // Second selector has which university
            switch (sleeve.city) {
                case CityName.Aevum:
                    elems.taskDetailsSelector2!.add(createOptionElement(LocationName.AevumSummitUniversity));
                    break;
                case CityName.Sector12:
                    elems.taskDetailsSelector2!.add(createOptionElement(LocationName.Sector12RothmanUniversity));
                    break;
                case CityName.Volhaven:
                    elems.taskDetailsSelector2!.add(createOptionElement(LocationName.VolhavenZBInstituteOfTechnology));
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

                // Set initial value
                if (sleeve.gymStatType === gymSelectorOptions[i]) {
                    elems.taskDetailsSelector!.selectedIndex = i;
                }
            }

            // Second selector has gym
            // In this switch statement we also set the initial value of the second selector
            switch (sleeve.city) {
                case CityName.Aevum:
                    elems.taskDetailsSelector2!.add(createOptionElement(LocationName.AevumCrushFitnessGym));
                    elems.taskDetailsSelector2!.add(createOptionElement(LocationName.AevumSnapFitnessGym));

                    // Set initial value
                    if (sleeve.currentTaskLocation === LocationName.AevumCrushFitnessGym) {
                        elems.taskDetailsSelector2!.selectedIndex = 0;
                    } else if (sleeve.currentTaskLocation === LocationName.AevumSnapFitnessGym) {
                        elems.taskDetailsSelector2!.selectedIndex = 1;
                    }
                    break;
                case CityName.Sector12:
                    elems.taskDetailsSelector2!.add(createOptionElement(LocationName.Sector12IronGym));
                    elems.taskDetailsSelector2!.add(createOptionElement(LocationName.Sector12PowerhouseGym));

                    // Set initial value
                    if (sleeve.currentTaskLocation === LocationName.Sector12IronGym) {
                        elems.taskDetailsSelector2!.selectedIndex = 0;
                    } else if (sleeve.currentTaskLocation === LocationName.Sector12PowerhouseGym) {
                        elems.taskDetailsSelector2!.selectedIndex = 1;
                    }
                    break;
                case CityName.Volhaven:
                    elems.taskDetailsSelector2!.add(createOptionElement(LocationName.VolhavenMilleniumFitnessGym));
                    break;
                default:
                    elems.taskDetailsSelector2!.add(createOptionElement("No gym available in city!"));
                    break;
            }

            break;
        case "Shock Recovery":
        case "Synchronize":
        case "------":
            // No options in "Details" selector
            elems.taskDetailsSelector!.add(createOptionElement("------"));
            elems.taskDetailsSelector2!.add(createOptionElement("------"));
            return;
        default:
            break;
    }
}

function setSleeveTask(sleeve: Sleeve, elems: ISleeveUIElems): boolean {
    try {
        if (playerRef == null) {
            throw new Error("playerRef is null in Sleeve UI's setSleeveTask()");
        }

        const taskValue: string = getSelectValue(elems.taskSelector);
        const detailValue: string = getSelectValue(elems.taskDetailsSelector);
        const detailValue2: string = getSelectValue(elems.taskDetailsSelector2);

        let res: boolean = false;
        switch(taskValue) {
            case "------":
                elems.taskDescription!.innerText = "This sleeve is currently idle";
                break;
            case "Work for Company":
                res = sleeve.workForCompany(playerRef!, detailValue);
                break;
            case "Work for Faction":
                res = sleeve.workForFaction(playerRef!, detailValue, detailValue2);
                break;
            case "Commit Crime":
                res = sleeve.commitCrime(playerRef!, detailValue);
                break;
            case "Take University Course":
                res = sleeve.takeUniversityCourse(playerRef!, detailValue2, detailValue);
                break;
            case "Workout at Gym":
                res = sleeve.workoutAtGym(playerRef!, detailValue2, detailValue);
                break;
            case "Shock Recovery":
                sleeve.currentTask = SleeveTaskType.Recovery;
                res = sleeve.shockRecovery(playerRef!);
                break;
            case "Synchronize":
                res = sleeve.synchronize(playerRef!);
                break;
            default:
                console.error(`Invalid/Unrecognized taskValue in setSleeveTask(): ${taskValue}`);
        }

        if (res) {
            updateSleeveTaskDescription(sleeve, elems);
        } else {
            switch (taskValue) {
                case "Work for Faction":
                    elems.taskDescription!.innerText = "Failed to assign sleeve to task. This is most likely because the selected faction does not offer the selected work type.";
                    break;
                default:
                    elems.taskDescription!.innerText = "Failed to assign sleeve to task. Invalid choice(s).";
                    break;
            }

        }

        if (routing.isOn(Page.Sleeves)) {
            updateSleevesPage();

            // Update the task selector for all sleeves by triggering a change event
            for (const e of UIElems.sleeves!) {
                e.taskSelector!.dispatchEvent(new Event('change'));
            }
        }

        return res;
    } catch(e) {
        console.error(`Exception caught in setSleeveTask(): ${e}`);
        exceptionAlert(e);
        return false;
    }
}

function updateSleeveTaskDescription(sleeve: Sleeve, elems: ISleeveUIElems): void {
    try {
        if (playerRef == null) {
            throw new Error("playerRef is null in Sleeve UI's setSleeveTask()");
        }

        const taskValue: string = getSelectValue(elems.taskSelector);
        const detailValue: string = getSelectValue(elems.taskDetailsSelector);
        const detailValue2: string = getSelectValue(elems.taskDetailsSelector2);

        switch(taskValue) {
            case "------":
                elems.taskDescription!.innerText = "This sleeve is currently idle";
                break;
            case "Work for Company":
                elems.taskDescription!.innerText = `This sleeve is currently working your job at ${sleeve.currentTaskLocation}.`;
                break;
            case "Work for Faction":
                elems.taskDescription!.innerText = `This sleeve is currently doing ${detailValue2} for ${sleeve.currentTaskLocation}.`;
                break;
            case "Commit Crime":
                elems.taskDescription!.innerText = `This sleeve is currently attempting to ${Crimes[detailValue].type} (Success Rate: ${numeralWrapper.formatPercentage(Crimes[detailValue].successRate(sleeve))}).`;
                break;
            case "Take University Course":
                elems.taskDescription!.innerText = `This sleeve is currently studying/taking a course at ${sleeve.currentTaskLocation}.`;
                break;
            case "Workout at Gym":
                elems.taskDescription!.innerText = `This sleeve is currently working out at ${sleeve.currentTaskLocation}.`;
                break;
            case "Shock Recovery":
                elems.taskDescription!.innerText = "This sleeve is currently set to focus on shock recovery. This causes " +
                                                  "the Sleeve's shock to decrease at a faster rate.";
                break;
            case "Synchronize":
                elems.taskDescription!.innerText = "This sleeve is currently set to synchronize with the original consciousness. " +
                                                  "This causes the Sleeve's synchronization to increase."
                break;
            default:
                console.error(`Invalid/Unrecognized taskValue in updateSleeveTaskDescription(): ${taskValue}`);
        }
    } catch(e) {
        console.error(`Exception caught in updateSleeveTaskDescription(): ${e}`);
        exceptionAlert(e);
    }
}
