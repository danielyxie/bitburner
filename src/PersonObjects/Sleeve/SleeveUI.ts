/**
 * Module for handling the Sleeve UI
 */
import { Sleeve } from "./Sleeve";
import { SleeveTaskType } from "./SleeveTaskTypesEnum";

import { IMap } from "../../types";

import { Page,
         routing } from "../../ui/navigationTracking";

import { exceptionAlert } from "../../../utils/helpers/exceptionAlert";

import { createElement } from "../../../utils/uiHelpers/createElement";
import { createOptionElement } from "../../../utils/uiHelpers/createOptionElement";
import { removeElement } from "../../../utils/uiHelpers/removeElement";
import { removeElementById } from "../../../utils/uiHelpers/removeElementById";

// Object that keeps track of all DOM elements for the UI for a single Sleeve
interface ISleeveUIElems {
    container:              Element | null,
    statsPanel:             Element | null,
    stats:                  Element | null,
    statsTooltip:           Element | null,
    taskPanel:              Element | null,
    taskSelector:           Element | null,
    taskDetailsSelector:    Element | null,
    taskDescription:        Element | null,
    earningsPanel:          Element | null,
    currentEarningsInfo:    Element | null,
    totalEarningsInfo:      Element | null,
}

// Object that keeps track of all DOM elements for the entire Sleeve UI
interface IPageUIElems {
    container:      Element | null;
    info:           Element | null,
    sleeveList:     Element | null,
    sleeves:        ISleeveUIElems[] | null,
}

const UIElems: IPageUIElems = {
    container: null,
    info: null,
    sleeveList: null,
    sleeves: null,
}

// Interface for Player object
interface IPlayer {
    sleeves: Sleeve[];
}

// Creates the UI for the entire Sleeves page
export function createSleevesPage(p: IPlayer) {
    if (!routing.isOn(Page.Sleeves)) { return; }

    try {
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

        for (const sleeve of p.sleeves) {
            UIElems.sleeves.push(this.createSleeveUi(sleeve, p.sleeves));
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
        UIElems[prop] = null;
    }
}

// Creates the UI for a single Sleeve
// Returns an object containing the DOM elements in the UI (ISleeveUIElems)
function createSleeveUi(sleeve: Sleeve, allSleeves: Sleeve[]) {
    if (!routing.isOn(Page.Sleeves)) { return; }

    const elems: ISleeveUIElems = {
        container:              null,
        statsPanel:             null,
        stats:                  null,
        statsTooltip:           null,
        taskPanel:              null,
        taskSelector:           null,
        taskDetailsSelector:    null,
        taskDescription:        null,
        earningsPanel:          null,
        currentEarningsInfo:    null,
        totalEarningsButton:    null,
    }

    elems.container = createElement("div", {
        class: "sleeve-container",
        display: "block",
    });

    elems.statsPanel = createElement("div", { class: "sleeve-panel" });
    elems.stats = createElement("p", { class: "sleeve-stats-text tooltip" });
    elems.statsTooltip = createElement("span", { class: "tooltiptext" });
    elems.stats.appendChild(elems.statsTooltip);
    elems.statsPanel.appendChild(elems.stats);

    elems.taskPanel = createElement("div", { class: "sleeve-panel" });
    elems.taskSelector = createElement("select");
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
    elems.taskDetailsSelector = createElement("select");
    elems.taskDescription = createElement("p");
    elems.taskPanel.appendChild(elems.taskSelector);
    elems.taskPanel.appendChild(elems.taskDetailsSelector);
    elems.taskPanel.appendChild(elems.taskDescription);

    elems.earningsPanel = createElement("div", { class: "sleeve-panel" });
    elems.currentEarningsInfo = createElement("p");
    elems.totalEarningsButton = createElement("button", { class: "std-button" });

    return elems;
}

// Updates the UI for a single Sleeve
function updateSleeveUi() {
    if (!routing.isOn(Page.Sleeves)) { return; }
}

// Whenever a new task is selected, the "details" selector must update accordingly
function updateSleeveTaskSelector(sleeve: Sleeve, elems: ISleeveUIElems, allSleeves: Sleeve[]) {
    const value: string =
}
