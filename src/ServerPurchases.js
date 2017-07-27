/* Functions to handle any server-related purchasing:
 *  Purchasing new servers
 *  Purchasing more RAM for home computer
 */
purchaseServer = function(ram, cost) {
    //Check if player has enough money
    if (cost > Player.money) {
        dialogBoxCreate("You don't have enough money to purchase this server!");
        return;
    }

    //Maximum of 30 servers
    if (Player.purchasedServers.length >= CONSTANTS.PurchasedServerLimit) {
        dialogBoxCreate("You have reached the maximum limit of " + CONSTANTS.PurchasedServerLimit + " servers. " +
                        "You cannot purchase any more. You can " +
                        "delete some of your purchased servers using the deleteServer() Netscript function in a script");
        return;
    }

    var newServ = new Server();
    var hostname = document.getElementById("purchase-server-box-input").value;
    hostname = hostname.replace(/\s\s+/g, '');
    if (hostname == "") {
        dialogBoxCreate("You must enter a hostname for your new server!");
        return;
    }

    //Create server
    newServ.init(createRandomIp(), hostname, "", true, false, true, true, ram);
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


purchaseRamForHomeComputer = function(cost) {
    if (cost > Player.money) {
        dialogBoxCreate("You do not have enough money to purchase additional RAM for your home computer");
        return;
    }

    var homeComputer = Player.getHomeComputer();
    homeComputer.maxRam *= 2;

    Player.loseMoney(cost);

    dialogBoxCreate("Purchased additional RAM for home computer! It now has " + homeComputer.maxRam + "GB of RAM.");
}
