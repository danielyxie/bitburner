/* Pop up Purchase Ram for Home Computer Pop-up Box */
function purchaseRamForHomeBoxInit() {
    var cancelButton = document.getElementById("purchase-ram-for-home-box-cancel");
    
    //Close Dialog box
    cancelButton.addEventListener("click", function() {
        purchaseRamForHomeBoxClose();
        return false;
    });
};

document.addEventListener("DOMContentLoaded", purchaseRamForHomeBoxInit, false);

purchaseRamForHomeBoxClose = function() {
    var purchaseRamForHomeBox = document.getElementById("purchase-ram-for-home-box-container");
    purchaseRamForHomeBox.style.display = "none";
}

purchaseRamForHomeBoxOpen = function() {
    var purchaseRamForHomeBox = document.getElementById("purchase-ram-for-home-box-container");
    purchaseRamForHomeBox.style.display = "block";
}

purchaseRamForHomeBoxSetText = function(txt) {
    var textElem = document.getElementById("purchase-ram-for-home-box-text");
    textElem.innerHTML = txt;
}

//ram argument is in GB
purchaseRamForHomeBoxCreate = function() {
    //Calculate how many times ram has been upgraded (doubled)
    var currentRam = Player.getHomeComputer().maxRam;
    var newRam = currentRam * 2;
    var numUpgrades = Math.log2(currentRam);
    
    //Calculate cost
    //Have cost increase by some percentage each time RAM has been upgraded
    var cost = currentRam * CONSTANTS.BaseCostFor1GBOfRamHome;
    var mult = Math.pow(1.55, numUpgrades);
    cost = cost * mult;
    
    purchaseRamForHomeBoxSetText("Would you like to purchase additional RAM for your home computer? <br><br>" + 
                                 "This will upgrade your RAM from " + currentRam + "GB to " + newRam + "GB. <br><br>" + 
                                 "This will cost $" + formatNumber(cost, 2));
    
    purchaseRamForHomeBoxOpen();
    
    //Clear old event listeners from Confirm button
    var newConfirmButton = clearEventListeners("purchase-ram-for-home-box-confirm");
    newConfirmButton.addEventListener("click", function() {
        purchaseRamForHomeBoxClose();
        purchaseRamForHomeComputer(cost);
        return false;
    }); 
}