/**
 * Location and traveling-related helper functions.
 * Mostly used for UI
 */
import { CONSTANTS } from "../Constants";

import { CityName } from "./data/CityNames";

import { IPlayer } from "../PersonObjects/IPlayer";
import {
    AddToAllServers,
    createUniqueRandomIp,
} from "../Server/AllServers";
import { safetlyCreateUniqueServer } from "../Server/ServerHelpers";
import {
    getPurchaseServerCost,
    purchaseRamForHomeComputer,
    purchaseServer,
} from "../Server/ServerPurchases";
import { SpecialServerIps } from "../Server/SpecialServerIps";
import { Settings } from "../Settings/Settings";

import { numeralWrapper } from "../ui/numeralFormat";
import { Money } from "../ui/React/Money";

import { dialogBoxCreate } from "../../utils/DialogBox";
import {
    yesNoBoxGetYesButton,
    yesNoBoxGetNoButton,
    yesNoBoxClose,
    yesNoBoxCreate,
    yesNoTxtInpBoxGetYesButton,
    yesNoTxtInpBoxGetNoButton,
    yesNoTxtInpBoxClose,
    yesNoTxtInpBoxCreate,
} from "../../utils/YesNoBox";

import { createElement } from "../../utils/uiHelpers/createElement";
import { createPopup } from "../../utils/uiHelpers/createPopup";
import { createPopupCloseButton } from "../../utils/uiHelpers/createPopupCloseButton";
import { removeElementById } from "../../utils/uiHelpers/removeElementById";
import * as React from "react";

/**
 * Create a pop-up box that lets the player confirm traveling to a different city.
 * If settings are configured to suppress this popup, just instantly travel.
 * The actual "Travel" implementation is implemented in the UI, and is passed in
 * as an argument.
 * @param {CityName} destination - City that the player is traveling to
 * @param {Function} travelFn - Function that changes the player's state for traveling
 */
type TravelFunction = (to: CityName) => void;
export function createTravelPopup(destination: CityName, travelFn: TravelFunction): void {
    const cost: number = CONSTANTS.TravelCost;

    if (Settings.SuppressTravelConfirmation) {
        travelFn(destination);
        return;
    }

    const yesBtn = yesNoBoxGetYesButton();
    const noBtn = yesNoBoxGetNoButton();
    if (yesBtn == null || noBtn == null) {
        console.warn(`Could not find YesNo pop-up box buttons`);
        return;
    }

    yesBtn.innerHTML = "Yes";
    yesBtn.addEventListener("click", () => {
        yesNoBoxClose();
        travelFn(destination);
        return false;
    });

    noBtn.innerHTML = "No";
    noBtn.addEventListener("click", () => {
        yesNoBoxClose();
        return false;
    });

    yesNoBoxCreate(<span>Would you like to travel to {destination}? The trip will
        cost {Money(cost)}.</span>);
}

/**
 * Create a pop-up box that lets the player purchase a server.
 * @param {number} ram - Amount of RAM (GB) on server
 * @param {IPlayer} p - Player object
 */
export function createPurchaseServerPopup(ram: number, p: IPlayer): void {
    const cost = getPurchaseServerCost(ram);
    if (cost === Infinity) {
        dialogBoxCreate("Something went wrong when trying to purchase this server. Please contact developer.");
        return;
    }

    const yesBtn = yesNoTxtInpBoxGetYesButton();
    const noBtn = yesNoTxtInpBoxGetNoButton();
    if (yesBtn == null || noBtn == null) { return; }
    yesBtn.innerHTML = "Purchase Server";
    noBtn.innerHTML = "Cancel";
    yesBtn.addEventListener("click", function() {
        purchaseServer(ram, p);
        yesNoTxtInpBoxClose();
    });
    noBtn.addEventListener("click", function() {
        yesNoTxtInpBoxClose();
    });

    yesNoTxtInpBoxCreate(<>Would you like to purchase a new server with {numeralWrapper.formatRAM(ram)} of RAM for {Money(cost)}?
        <br /><br />Please enter the server hostname below:<br />
    </>);
}

/**
 * Create a popup that lets the player start a Corporation
 * @param {IPlayer} p - Player object
 */
export function createStartCorporationPopup(p: IPlayer): void {
    if (!p.canAccessCorporation() || p.hasCorporation()) { return; }

    const popupId = "create-corporation-popup";
    const txt = createElement("p", {
        innerHTML: "Would you like to start a corporation? This will require $150b for registration " +
                   "and initial funding. This $150b can either be self-funded, or you can obtain " +
                   "the seed money from the government in exchange for 500 million shares<br><br>" +
                   "If you would like to start one, please enter a name for your corporation below:",
    });

    const nameInput = createElement("input", {
        class: 'text-input',
        placeholder: "Corporation Name",
    }) as HTMLInputElement;

    const selfFundedButton = createElement("button", {
        class: "popup-box-button",
        innerText: "Self-Fund",
        clickListener: () => {
            if (!p.canAfford(150e9)) {
                dialogBoxCreate("You don't have enough money to create a corporation! You need $150b.");
                return false;
            }

            const companyName = nameInput.value;
            if (companyName == null || companyName == "") {
                dialogBoxCreate("Invalid company name!");
                return false;
            }

            p.startCorporation(companyName);
            p.loseMoney(150e9);

            const worldHeader = document.getElementById("world-menu-header");
            if (worldHeader instanceof HTMLElement) {
                worldHeader.click(); worldHeader.click();
            }
            dialogBoxCreate("Congratulations! You just self-funded your own corporation. You can visit " +
                            "and manage your company in the City.");
            removeElementById(popupId);
            return false;
        },
    });

    const seedMoneyButton = createElement("button", {
        class: "popup-box-button",
        innerText: "Use Seed Money",
        clickListener: () => {
            const companyName = nameInput.value;
            if (companyName == null || companyName == "") {
                dialogBoxCreate("Invalid company name!");
                return false;
            }

            p.startCorporation(companyName, 500e6);

            const worldHeader = document.getElementById("world-menu-header");
            if (worldHeader instanceof HTMLElement) {
                worldHeader.click(); worldHeader.click();
            }
            dialogBoxCreate(
                "Congratulations! You just started your own corporation with government seed money. " +
                "You can visit and manage your company in the City.",
            );
            removeElementById(popupId);
            return false;
        },
    })

    const cancelBtn = createPopupCloseButton(popupId, { class: "popup-box-button" });

    createPopup(popupId, [txt, nameInput, cancelBtn, selfFundedButton, seedMoneyButton]);
    nameInput.focus();
}

/**
 * Create a popup that lets the player upgrade the cores on his/her home computer
 * @param {IPlayer} p - Player object
 */
export function createUpgradeHomeCoresPopup(p: IPlayer): void {
    const currentCores = p.getHomeComputer().cpuCores;
    if (currentCores >= 8) {
        dialogBoxCreate(<>
            You have the maximum amount of CPU cores on your home computer.
        </>);
        return;
    }

    // Cost of purchasing another cost is found by indexing this array with number of current cores
    const allCosts = [
        0,
        10e9,
        250e9,
        5e12,
        100e12,
        1e15,
        20e15,
        200e15,
    ];
    const cost: number = allCosts[currentCores];

    const yesBtn = yesNoBoxGetYesButton();
    const noBtn = yesNoBoxGetNoButton();
    if (yesBtn == null || noBtn == null) { return; }

    yesBtn.innerHTML = "Purchase";
    yesBtn.addEventListener("click", ()=>{
        if (!p.canAfford(cost)) {
            dialogBoxCreate("You do not have enough money to purchase an additional CPU Core for your home computer!");
        } else {
            p.loseMoney(cost);
            p.getHomeComputer().cpuCores++;
            dialogBoxCreate(
                "You purchased an additional CPU Core for your home computer! It now has " +
                p.getHomeComputer().cpuCores +  " cores.",
            );
        }
        yesNoBoxClose();
    });

    noBtn.innerHTML = "Cancel";
    noBtn.addEventListener("click", ()=>{
        yesNoBoxClose();
    });

    yesNoBoxCreate(<>Would you like to purchase an additional CPU Core for your home computer? Each CPU Core 
lets you start with an additional Core Node in Hacking Missions.<br /><br />
Purchasing an additional core (for a total of {p.getHomeComputer().cpuCores + 1}) will 
cost {Money(cost)}</>);
}

/**
 * Create a popup that lets the player upgrade the RAM on his/her home computer
 * @param {IPlayer} p - Player object
 */
export function createUpgradeHomeRamPopup(p: IPlayer): void {
    const cost: number = p.getUpgradeHomeRamCost();
    const ram: number = p.getHomeComputer().maxRam;

    const yesBtn = yesNoBoxGetYesButton();
    const noBtn = yesNoBoxGetNoButton();
    if (yesBtn == null || noBtn == null) { return; }

    const homeComputer = p.getHomeComputer();
    if (homeComputer.maxRam >= CONSTANTS.HomeComputerMaxRam) {
        dialogBoxCreate(<>
            You have the maximum amount of RAM on your home computer.
        </>);
        return;
    }

    yesBtn.innerText = "Purchase";
    yesBtn.addEventListener("click", ()=>{
        purchaseRamForHomeComputer(cost, p);
        yesNoBoxClose();
    });

    noBtn.innerText = "Cancel";
    noBtn.addEventListener("click", ()=>{
        yesNoBoxClose();
    });

    yesNoBoxCreate(<>
        Would you like to purchase additional RAM for your home computer? <br /><br />
        This will upgrade your RAM from {numeralWrapper.formatRAM(ram)} to {numeralWrapper.formatRAM(ram*2)}. <br /><br />
        This will cost {Money(cost)}
    </>);
}


/**
 * Attempt to purchase a TOR router
 * @param {IPlayer} p - Player object
 */
export function purchaseTorRouter(p: IPlayer): void {
    if (p.hasTorRouter()) {
        dialogBoxCreate(`You already have a TOR Router!`);
        return;
    }
    if (!p.canAfford(CONSTANTS.TorRouterCost)) {
        dialogBoxCreate("You cannot afford to purchase the TOR router!");
        return;
    }
    p.loseMoney(CONSTANTS.TorRouterCost);

    const darkweb = safetlyCreateUniqueServer({
        ip: createUniqueRandomIp(), hostname:"darkweb", organizationName:"",
        isConnectedTo:false, adminRights:false, purchasedByPlayer:false, maxRam:1,
    });
    AddToAllServers(darkweb);
    SpecialServerIps.addIp("Darkweb Server", darkweb.ip);

    p.getHomeComputer().serversOnNetwork.push(darkweb.ip);
    darkweb.serversOnNetwork.push(p.getHomeComputer().ip);
    dialogBoxCreate(
        "You have purchased a TOR router!<br>" +
        "You now have access to the dark web from your home computer.<br>" +
        "Use the scan/scan-analyze commands to search for the dark web connection.",
    );
}
