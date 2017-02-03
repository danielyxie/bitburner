/* Functions to handle Purchase of Servers */
purchaseServer = function(ram, cost) {
    //TODO Check if player has enough money
    
    
    var newServ = new Server();
    var hostname = document.getElementById("purchase-server-box-input").value;
    newServ.init(createRandomIp(), hostname, "", true, false, true, true, ram);
    
    AddToAllServers(newServ);
    Player.purchasedServers.push(newServ);
    
    //TODO Dialog box saying successfully purchased
}