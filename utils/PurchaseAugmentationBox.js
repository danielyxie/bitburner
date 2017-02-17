/* Pop up Purchase Augmentation Box */
function purchaseAugmentationBoxInit() {
    if (Engine.Debug) {
        console.log("Purchase Augmentation Box Initialized");
    }
    var cancelButton = document.getElementById("purchase-augmentation-box-cancel");
    
    //Close Dialog box
    cancelButton.addEventListener("click", function() {
        purchaseAugmentationBoxClose();
        return false;
    });
};

document.addEventListener("DOMContentLoaded", purchaseAugmentationBoxInit, false);

purchaseAugmentationBoxClose = function() {
    var purchaseAugmentationBox = document.getElementById("purchase-augmentation-box-container");
    purchaseAugmentationBox.style.display = "none";
}

purchaseAugmentationBoxOpen = function() {
    var purchaseAugmentationBox = document.getElementById("purchase-augmentation-box-container");
    purchaseAugmentationBox.style.display = "block";
}

purchaseAugmentationBoxSetText = function(txt) {
    var purchaseAugmentationBox = document.getElementById("purchase-augmentation-box-text");
    purchaseAugmentationBox.innerHTML = txt;
}

//ram argument is in GB
purchaseAugmentationBoxCreate = function(aug, fac) {
    purchaseAugmentationBoxSetText("Would you like to purchase the " + aug.name + " Augmentation for $" + 
                                   (aug.baseCost * fac.augmentationPriceMult)  + "?");
    
    //Clear old event listeners from Confirm button
    var confirmButton = document.getElementById("purchase-augmentation-box-confirm");
    var newConfirmButton = confirmButton.cloneNode(true);
    confirmButton.parentNode.replaceChild(newConfirmButton, confirmButton);
    
    newConfirmButton.addEventListener("click", function() {
        if (Player.money >= (aug.baseCost * fac.augmentationPriceMult)) {
            applyAugmentation(aug, fac);
            //TODO Make this text better
            dialogBoxCreate("You slowly drift to sleep as " + fac.name + "'s scientists put you under <br>" +
                            " in order to install the " + aug.name + " Augmentation. <br>br>" +
                            "You wake up in your home...you feel different...");

            //TODO RESSETTTT FOR PRESTIGE
        } else {
            dialogBoxCreate("You don't have enough money to purchase this Augmentation!");
        }
        purchaseAugmentationBoxClose();
        
        return false;
    });
    
    purchaseAugmentationBoxOpen();
}