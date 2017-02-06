/* Functions to handle Purchase of Servers */
purchaseServer = function(ram, cost) {
    //Check if player has enough money
    if (cost > Player.money) {
        dialogBoxCreate("You don't have enough money to purchase this server!");
        return;
    }
    
    
    var newServ = new Server();
    var hostname = document.getElementById("purchase-server-box-input").value;
    if (hostname == "") {
        dialogBoxCreate("You must enter a hostname for your new server!");
        return;
    }
    
    newServ.init(createRandomIp(), hostname, "", true, false, true, true, ram);
    
    AddToAllServers(newServ);
    Player.purchasedServers.push(newServ);
    
    Player.money -= cost; 
    
    dialogBoxCreate("Server successfully purchased with hostname " + hostname);
}