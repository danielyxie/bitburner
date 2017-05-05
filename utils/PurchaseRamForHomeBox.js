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
    //Base cost of RAM is 50k per 1GB...but lets  have this increase by 10% for every time
    //the RAM has been upgraded
    var cost = currentRam * CONSTANTS.BaseCostFor1GBOfRam;
    var mult = Math.pow(1.1, numUpgrades);
    cost = cost * mult;
    
    purchaseRamForHomeBoxSetText("Would you like to purchase additional RAM for your home computer? <br><br>" + 
                                 "This will upgrade your RAM from " + currentRam + "GB to " + newRam + "GB. <br><br>" + 
                                 "This will cost $" + cost);
    
    purchaseRamForHomeBoxOpen();
    
    //Clear old event listeners from Confirm button
    var confirmButton = document.getElementById("purchase-ram-for-home-box-confirm");
    var newConfirmButton = confirmButton.cloneNode(true);
    confirmButton.parentNode.replaceChild(newConfirmButton, confirmButton);
    newConfirmButton.addEventListener("click", function() {
        purchaseRamForHomeBoxClose();
        purchaseRamForHomeComputer(cost);
        return false;
    }); 
}