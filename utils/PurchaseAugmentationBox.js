/* Pop up Purchase Augmentation Box */
function purchaseAugmentationBoxInit() {
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
    console.log("here");
    document.getElementById("purchase-augmentation-box-aug-name").innerHTML = aug.name;
    document.getElementById("purchase-augmentation-box-aug-info").innerHTML = aug.info;
    purchaseAugmentationBoxSetText("Would you like to purchase the " + aug.name + " Augmentation for $" + 
                                   formatNumber(aug.baseCost * fac.augmentationPriceMult, 2)  + "?");
    
    //Clear old event listeners from Confirm button
    var confirmButton = document.getElementById("purchase-augmentation-box-confirm");
    var newConfirmButton = confirmButton.cloneNode(true);
    confirmButton.parentNode.replaceChild(newConfirmButton, confirmButton);
    
    newConfirmButton.addEventListener("click", function() {
        
        //TODO Requirements for specific augmentations (e.g Embedded Netburner Module b4 its upgrades)
        if (aug.name == "Augmented Targeting II") {
            var targeting1 = Augmentations["Augmented Targeting I"];
            if (targeting1 == null) {
                console.log("ERROR: Could not find Augmented Targeting I");
                return;
            }
            if (targeting1.owned == false) {
                dialogBoxCreate("You must first install Augmented Targeting I before you can upgrade it to Augmented Targeting II");
            }
        } else if (aug.name == "Augmented Targeting III") {
            var targeting2 = Augmentations["Augmented Targeting II"];
            if (targeting2 == null) {
                console.log("ERROR: Could not find Augmented Targeting II");
                return;
            }
            if (targeting2.owned == false) {
                dialogBoxCreate("You must first install Augmented Targeting II before you can upgrade it to Augmented Targeting III");
            }   
        } else if (aug.name == "Combat Rib II") {
            var combatRib1 = Augmentations["Combat Rib I"];
            if (combatRib1 == null) {
                console.log("ERROR: Could not find Combat Rib I");
                return;
            }
            if (combatRib1.owned == false) {
                dialogBoxCreate("You must first install Combat Rib I before you can upgrade it to Combat Rib II");
            }
        } else if (aug.name == "Combat Rib III") {
            var combatRib2 = Augmentations["Combat Rib II"];
            if (combatRib2 == null) {
                console.log("ERROR: Could not find Combat Rib II");
                return;
            }
            if (combatRib2.owned == false) {
                dialogBoxCreate("You must first install Combat Rib II before you can upgrade it to Combat Rib III");
            }
        } else if (aug.name == "Graphene Bionic Spine Upgrade") {
            var bionicSpine = Augmentations["Bionic Spine"];
            if (bionicSpine == null) {
                console.log("ERROR: Could not find Bionic Spine");
                return;
            }
            if (bionicSpine.owned == false) {
                dialogBoxCreate("You must first install a Bionic Spine before you can upgrade it to a Graphene Bionic Spine");
            }
        } else if (aug.name == "Graphene Bionic Legs Upgrade") {
            var bionicLegs = Augmentations["Bionic Legs"];
            if (bionicLegs == null) {
                console.log("ERROR: Could not find Bionic Legs");
                return;
            }
            if (bionicLegs.owned == false ) {
                dialogBoxCreate("You must first install Bionic Legs before you can upgrade it to Graphene Bionic Legs");        
            }
        } else if (aug.name == "Embedded Netburner Module Core V2 Upgrade") {
            var coreImplant = Augmentations["Embedded Netburner Module Core Implant"];
            if (coreImplant == null) {
                console.log("ERROR: Could not find ENM Core Implant");
                return;
            }
            if (coreImplant.owned == false) {
                dialogBoxCreate("You must first install Embedded Netburner Module Core Implant before you can upgrade it to V2");
            }
        } else if (aug.name == "Embedded Netburner Module Core V3 Upgrade") {
            var v2Upgrade = Augmentations["Embedded Netburner Module Core V2 Upgrade"];
            if (v2Upgrade == null) {
                console.log("ERROR: Could not find ENM Core V2 upgrade");
                return;
            }
            if (v2Upgrade.owned == false) {
                dialogBoxCreate("You must first install Embedded Netburner Module Core V2 Upgrade before you can upgrade it to V3");
            }
        } else if (aug.name == "Embedded Netburner Module Core Implant" ||
                   aug.name == "Embedded Netburner Module Analyze Engine" ||
                   aug.name == "Embedded Netburner Module Direct Memory Access Upgrade") {
           var enm = Augmentations["Embedded Netburner Module"];
           if (enm == null) {
               console.log("ERROR: Could not find ENM");
               return;
           }
           if (enm.owned == false) {
               dialogBoxCreate("You must first install the Embedded Netburner Module before installing any upgrades to it");
           }
            
        } else if (aug.name == "PC Direct-Neural Interface Optimization Submodule" ||
                   aug.name == "PC Direct-Neural Interface NeuroNet Injector") {
            var pcdni = Augmentations["PC Direct-Neural Interface"];
            if (pcdni == null) {
                console.log("ERROR: Could not find PC Direct Neural Interface");
                return;
            }
            if (pcdni.owned == false) {
                dialogBoxCreate("You must first install the PD Direct-Neural Interface before installing this upgrade");
            }
            
        } else if (Player.money >= (aug.baseCost * fac.augmentationPriceMult)) {
            applyAugmentation(aug, fac);
            //TODO Make this text better
            dialogBoxCreate("You slowly drift to sleep as " + fac.name + "'s scientists put you under " +
                            " in order to install the " + aug.name + " Augmentation. <br><br>" +
                            "You wake up in your home...you feel different...");

            prestigeAugmentation();
        } else {
            dialogBoxCreate("You don't have enough money to purchase this Augmentation!");
        }
        purchaseAugmentationBoxClose();
        
        return false;
    });
    
    purchaseAugmentationBoxOpen();
}