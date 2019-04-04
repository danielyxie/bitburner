/**
 * Location and traveling-related helper functions.
 * Mostly used for UI
 */
import { CONSTANTS }                        from "../Constants";

import { CityName }                         from "./data/CityNames";

import { IPlayer }                          from "../PersonObjects/IPlayer";
import { AllServers,
         AddToAllServers }                  from "../Server/AllServers";
import { Server }                           from "../Server/Server";
import { getPurchaseServerCost,
         purchaseRamForHomeComputer,
         purchaseServer }                   from "../Server/ServerPurchases";
import { SpecialServerIps }                 from "../Server/SpecialServerIps";
import { Settings }                         from "../Settings/Settings";

import { numeralWrapper }                   from "../ui/numeralFormat";

import { dialogBoxCreate }                  from "../../utils/DialogBox";
import { createRandomIp }                   from "../../utils/IPAddress";
import { yesNoBoxGetYesButton,
         yesNoBoxGetNoButton,
         yesNoBoxClose,
         yesNoBoxCreate,
         yesNoTxtInpBoxGetYesButton,
         yesNoTxtInpBoxGetNoButton,
         yesNoTxtInpBoxClose,
         yesNoTxtInpBoxCreate }             from "../../utils/YesNoBox";

import { createElement }                    from "../../utils/uiHelpers/createElement";
import { createPopup }                      from "../../utils/uiHelpers/createPopup";
import { createPopupCloseButton }           from "../../utils/uiHelpers/createPopupCloseButton";
import { removeElementById }                from "../../utils/uiHelpers/removeElementById";

/**
 * Create a pop-up box that lets the player confirm traveling to a different city
 * If settings are configured to suppress this popup, just instantly travel
 * The actual "Travel" implementation is implemented in the UI, and is passed in
 * as an argument
 */
type TravelFunction = (to: CityName) => void;
export function createTravelPopup(destination: CityName, travelFn: TravelFunction) {
    const cost = CONSTANTS.TravelCost;

    if (Settings.SuppressTravelConfirmation) {
        travelFn(destination);
        return;
    }

    const yesBtn = yesNoBoxGetYesButton();
    const noBtn = yesNoBoxGetNoButton();
    if (yesBtn == null || noBtn == null) {
        console.warn(`Could nto find YesNo pop-up box buttons`);
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

    yesNoBoxCreate(`Would you like to travel to ${destination}? The trip will ` +
                   `cost ${numeralWrapper.formatMoney(cost)}`);
}

/**
 * Create a pop-up box that lets the player purchase a server.
 * @param ram - Amount of RAM (GB) on server
 * @param p - Player object
 */
export function createPurchaseServerPopup(ram: number, p: IPlayer) {
    const cost = getPurchaseServerCost(ram);
    if (cost === Infinity) {
        dialogBoxCreate("Something went wrong when trying to purchase this server. Please contact developer");
        return;
    }

    var yesBtn = yesNoTxtInpBoxGetYesButton();
    var noBtn = yesNoTxtInpBoxGetNoButton();
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

    yesNoTxtInpBoxCreate("Would you like to purchase a new server with " + ram +
                         "GB of RAM for $" + numeralWrapper.formatMoney(cost) + "?<br><br>" +
                         "Please enter the server hostname below:<br>");
}

/**
 * Create a popup that lets the player start a Corporation
 */
export function createStartCorporationPopup(p: IPlayer) {
    if (!p.canAccessCorporation() || p.hasCorporation) { return; }

    const popupId = "create-corporation-popup";
    const txt = createElement("p", {
        innerHTML: "Would you like to start a corporation? This will require $150b for registration " +
                   "and initial funding. This $150b can either be self-funded, or you can obtain " +
                   "the seed money from the government in exchange for 500 million shares<br><br>" +
                   "If you would like to start one, please enter a name for your corporation below:",
    });

    const nameInput = createElement("input", {
        placeholder: "Corporation Name",
    }) as HTMLInputElement;

    const selfFundedButton = createElement("button", {
        class: "popup-box-button",
        innerText: "Self-Fund",
        clickListener: () => {
            if (!p.canAfford(150e9)) {
                dialogBoxCreate("You don't have enough money to create a corporation! You need $150b");
                return false;
            }
            p.loseMoney(150e9);

            const companyName = nameInput.value;
            if (companyName == null || companyName == "") {
                dialogBoxCreate("Invalid company name!");
                return false;
            }

            p.startCorporation(companyName);

            const worldHeader = document.getElementById("world-menu-header");
            if (worldHeader instanceof HTMLElement) {
                worldHeader.click(); worldHeader.click();
            }
            dialogBoxCreate("Congratulations! You just self-funded your own corporation. You can visit " +
                            "and manage your company in the City");
            removeElementById(popupId);
            return false;
        }
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
            dialogBoxCreate("Congratulations! You just started your own corporation with government seed money. " +
                            "You can visit and manage your company in the City");
            removeElementById(popupId);
            return false;
        }
    })

    const cancelBtn = createPopupCloseButton(popupId, { class: "popup-box-button" });

    createPopup(popupId, [txt, nameInput, cancelBtn, selfFundedButton, seedMoneyButton]);
    nameInput.focus();
}

/**
 * Create a popup that lets the player upgrade the cores on his/her home computer
 * @param p - Player object
 */
export function createUpgradeHomeCoresPopup(p: IPlayer) {
    const currentCores = p.getHomeComputer().cpuCores;
    if (currentCores >= 8) { return; } // Max of 8 cores

    //Cost of purchasing another cost is found by indexing this array with number of current cores
    const allCosts = [0,
                      10e9,     // 1->2 Cores - 10 bn
                      250e9,    // 2->3 Cores - 250 bn
                      5e12,     // 3->4 Cores - 5 trillion
                      100e12,   // 4->5 Cores - 100 trillion
                      1e15,     // 5->6 Cores - 1 quadrillion
                      20e15,    // 6->7 Cores - 20 quadrillion
                      200e15];  // 7->8 Cores - 200 quadrillion
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
            dialogBoxCreate("You purchased an additional CPU Core for your home computer! It now has " +
                            p.getHomeComputer().cpuCores +  " cores.");
        }
        yesNoBoxClose();
    });

    noBtn.innerHTML = "Cancel";
    noBtn.addEventListener("click", ()=>{
        yesNoBoxClose();
    });

    yesNoBoxCreate("Would you like to purchase an additional CPU Core for your home computer? Each CPU Core " +
                   "lets you start with an additional Core Node in Hacking Missions.<br><br>" +
                   "Purchasing an additional core (for a total of " + (p.getHomeComputer().cpuCores + 1) + ") will " +
                   "cost " + numeralWrapper.formatMoney(cost));
}

/**
 * Create a popup that lets the player upgrade the RAM on his/her home computer
 * @param p - Player object
 */
export function createUpgradeHomeRamPopup(p: IPlayer) {
    const cost: number = p.getUpgradeHomeRamCost();
    const ram: number = p.getHomeComputer().maxRam;

    const yesBtn = yesNoBoxGetYesButton();
    const noBtn = yesNoBoxGetNoButton();
    if (yesBtn == null || noBtn == null) { return; }

    yesBtn.innerText = "Purchase";
    yesBtn.addEventListener("click", ()=>{
        purchaseRamForHomeComputer(cost, p);
        yesNoBoxClose();
    });

    noBtn.innerText = "Cancel";
    noBtn.addEventListener("click", ()=>{
        yesNoBoxClose();
    });

    yesNoBoxCreate("Would you like to purchase additional RAM for your home computer? <br><br>" +
                   "This will upgrade your RAM from " + ram + "GB to " + ram*2 + "GB. <br><br>" +
                   "This will cost " + numeralWrapper.format(cost, '$0.000a'));
}


/**
 * Attempt to purchase a TOR router
 * @param p - Player object
 */
export function purchaseTorRouter(p: IPlayer) {
    if (!p.canAfford(CONSTANTS.TorRouterCost)) {
        dialogBoxCreate("You cannot afford to purchase the Tor router");
        return;
    }
    p.loseMoney(CONSTANTS.TorRouterCost);

    const darkweb = new Server({
        ip: createRandomIp(), hostname:"darkweb", organizationName:"",
        isConnectedTo:false, adminRights:false, purchasedByPlayer:false, maxRam:1
    });
    AddToAllServers(darkweb);
    SpecialServerIps.addIp("Darkweb Server", darkweb.ip);

    p.getHomeComputer().serversOnNetwork.push(darkweb.ip);
    darkweb.serversOnNetwork.push(p.getHomeComputer().ip);
    dialogBoxCreate("You have purchased a Tor router!<br>" +
                    "You now have access to the dark web from your home computer<br>" +
                    "Use the scan/scan-analyze commands to search for the dark web connection.");
}
