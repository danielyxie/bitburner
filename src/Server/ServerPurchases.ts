/**
 * Implements functions for purchasing servers or purchasing more RAM for
 * the home computer
 */
import { BitNodeMultipliers }               from "../BitNode/BitNodeMultipliers";
import { CONSTANTS }                        from "../Constants";
import { IPlayer }                          from "../PersonObjects/IPlayer";
import { AddToAllServers }                  from "../Server/AllServers";
import { Server }                           from "../Server/Server";
import { dialogBoxCreate }                  from "../../utils/DialogBox";
import { createRandomIp }                   from "../../utils/IPAddress";
import { yesNoTxtInpBoxGetInput }           from "../../utils/YesNoBox";
import { isPowerOfTwo }                     from "../../utils/helpers/isPowerOfTwo";

// Returns the cost of purchasing a server with the given RAM
// Returns Infinity for invalid 'ram' arguments
/**
 * @param ram Amount of RAM on purchased server (GB)
 * @returns Cost of purchasing the given server. Returns infinity for invalid arguments
 */
export function getPurchaseServerCost(ram: number) {
    const sanitizedRam = Math.round(ram);
    if (isNaN(sanitizedRam) || !isPowerOfTwo(sanitizedRam)) {
        return Infinity;
    }

    if (sanitizedRam > getPurchaseServerMaxRam()) {
        return Infinity;
    }

    return sanitizedRam * CONSTANTS.BaseCostFor1GBOfRamServer * BitNodeMultipliers.PurchasedServerCost;
}

export function getPurchaseServerLimit() {
    return Math.round(CONSTANTS.PurchasedServerLimit * BitNodeMultipliers.PurchasedServerLimit);
}

export function getPurchaseServerMaxRam() {
    const ram = Math.round(CONSTANTS.PurchasedServerMaxRam * BitNodeMultipliers.PurchasedServerMaxRam);

    // Round this to the nearest power of 2
    return 1 << 31 - Math.clz32(ram);
}

// Manually purchase a server (NOT through Netscript)
export function purchaseServer(ram: number, p: IPlayer) {
    const cost = getPurchaseServerCost(ram);

    //Check if player has enough money
    if (!p.canAfford(cost)) {
        dialogBoxCreate("You don't have enough money to purchase this server!", false);
        return;
    }

    //Maximum server limit
    if (p.purchasedServers.length >= getPurchaseServerLimit()) {
        dialogBoxCreate("You have reached the maximum limit of " + getPurchaseServerLimit() + " servers. " +
                        "You cannot purchase any more. You can " +
                        "delete some of your purchased servers using the deleteServer() Netscript function in a script");
        return;
    }

    var hostname = yesNoTxtInpBoxGetInput();
    if (hostname == "") {
        dialogBoxCreate("You must enter a hostname for your new server!");
        return;
    }

    //Create server
    var newServ = new Server({
        ip:createRandomIp(), hostname:hostname, organizationName:"",
        isConnectedTo:false, adminRights:true, purchasedByPlayer:true, maxRam:ram
    });
    AddToAllServers(newServ);

    //Add to Player's purchasedServers array
    p.purchasedServers.push(newServ.ip);

    //Connect new server to home computer
    var homeComputer = p.getHomeComputer();
    homeComputer.serversOnNetwork.push(newServ.ip);
    newServ.serversOnNetwork.push(homeComputer.ip);

    p.loseMoney(cost);

    dialogBoxCreate("Server successfully purchased with hostname " + hostname);
}

// Manually upgrade RAM on home computer (NOT through Netscript)
export function purchaseRamForHomeComputer(cost: number, p: IPlayer) {
    if (!p.canAfford(cost)) {
        dialogBoxCreate("You do not have enough money to purchase additional RAM for your home computer");
        return;
    }

    const homeComputer = p.getHomeComputer();
    if (homeComputer.maxRam >= CONSTANTS.HomeComputerMaxRam) {
        dialogBoxCreate(`You cannot upgrade your home computer RAM because it is at its maximum possible value`);
        return;
    }


    homeComputer.maxRam *= 2;
    p.loseMoney(cost);

    dialogBoxCreate("Purchased additional RAM for home computer! It now has " + homeComputer.maxRam + "GB of RAM.");
}
