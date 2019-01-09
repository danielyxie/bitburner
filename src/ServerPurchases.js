import {CONSTANTS}                              from "./Constants";
import {Player}                                 from "./Player";
import {Server, AllServers, AddToAllServers}    from "./Server";
import {dialogBoxCreate}                        from "../utils/DialogBox";
import {createRandomIp}                         from "../utils/IPAddress";
import {yesNoTxtInpBoxGetInput}                 from "../utils/YesNoBox";


/* Functions to handle any server-related purchasing:
 *  Purchasing new servers
 *  Purchasing more RAM for home computer
 */
function purchaseServer(ram, cost) {
    //Check if player has enough money
    if (Player.money.lt(cost)) {
        dialogBoxCreate("You don't have enough money to purchase this server!");
        return;
    }

    //Maximum server limit
    if (Player.purchasedServers.length >= CONSTANTS.PurchasedServerLimit) {
        dialogBoxCreate("You have reached the maximum limit of " + CONSTANTS.PurchasedServerLimit + " servers. " +
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
    Player.purchasedServers.push(newServ.ip);

    //Connect new server to home computer
    var homeComputer = Player.getHomeComputer();
    homeComputer.serversOnNetwork.push(newServ.ip);
    newServ.serversOnNetwork.push(homeComputer.ip);

    Player.loseMoney(cost);

    dialogBoxCreate("Server successfully purchased with hostname " + hostname);
}


function purchaseRamForHomeComputer(cost) {
    if (Player.money.lt(cost)) {
        dialogBoxCreate("You do not have enough money to purchase additional RAM for your home computer");
        return;
    }

    const homeComputer = Player.getHomeComputer();
    if (homeComputer.maxRam >= CONSTANTS.HomeComputerMaxRam) {
        dialogBoxCreate(`You cannot upgrade your home computer RAM because it is at its maximum possible value`);
        return;
    }


    homeComputer.maxRam *= 2;
    Player.loseMoney(cost);

    dialogBoxCreate("Purchased additional RAM for home computer! It now has " + homeComputer.maxRam + "GB of RAM.");
}

export {purchaseServer, purchaseRamForHomeComputer};
