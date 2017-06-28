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
    document.getElementById("purchase-augmentation-box-aug-name").innerHTML = aug.name;
    document.getElementById("purchase-augmentation-box-aug-info").innerHTML = aug.info;
    purchaseAugmentationBoxSetText("<br>Would you like to purchase the " + aug.name + " Augmentation for $" + 
                                   formatNumber(aug.baseCost * fac.augmentationPriceMult, 2)  + "?");
    
    //Clear old event listeners from Confirm button
    var newConfirmButton = clearEventListeners("purchase-augmentation-box-confirm");
    
    newConfirmButton.addEventListener("click", function() {
        
        //TODO Requirements for specific augmentations (e.g Embedded Netburner Module b4 its upgrades)
        if (aug.name == AugmentationNames.Targeting2 &&
            Augmentations[AugmentationNames.Targeting1].owned == false) {
            dialogBoxCreate("You must first install Augmented Targeting I before you can upgrade it to Augmented Targeting II");
        } else if (aug.name == AugmentationNames.Targeting3 &&
                   Augmentations[AugmentationNames.Targeting2].owned == false) {
            dialogBoxCreate("You must first install Augmented Targeting II before you can upgrade it to Augmented Targeting III");
        } else if (aug.name == AugmentationNames.CombatRib2 &&
                   Augmentations[AugmentationNames.CombatRib1].owned == false) {
            dialogBoxCreate("You must first install Combat Rib I before you can upgrade it to Combat Rib II");
        } else if (aug.name == AugmentationNames.CombatRib3 && 
                   Augmentations[AugmentationNames.CombatRib2].owned == false) {
            dialogBoxCreate("You must first install Combat Rib II before you can upgrade it to Combat Rib III");
        } else if (aug.name == AugmentationNames.GrapheneBionicSpine && 
                   Augmentations[AugmentationNames.BionicSpine].owned == false) {
            dialogBoxCreate("You must first install a Bionic Spine before you can upgrade it to a Graphene Bionic Spine");
        } else if (aug.name == AugmentationNames.GrapheneBionicLegs && 
                   Augmentations[AugmentationNames.BionicLegs].owned == false) {
            dialogBoxCreate("You must first install Bionic Legs before you can upgrade it to Graphene Bionic Legs");        
        } else if (aug.name == AugmentationNames.ENMCoreV2 && 
                   Augmentations[AugmentationNames.ENMCore].owned == false) {
            dialogBoxCreate("You must first install Embedded Netburner Module Core Implant before you can upgrade it to V2");
        } else if (aug.name == AugmentationNames.ENMCoreV3 &&
                   Augmentations[AugmentationNames.ENMCoreV2].owned == false) {
            dialogBoxCreate("You must first install Embedded Netburner Module Core V2 Upgrade before you can upgrade it to V3");
        } else if ((aug.name == AugmentationNames.ENMCore ||
                   aug.name == AugmentationNames.ENMAnalyzeEngine ||
                   aug.name == AugmentationNames.ENMDMA) && 
                   Augmentations[AugmentationNames.ENM].owned == false) {
           dialogBoxCreate("You must first install the Embedded Netburner Module before installing any upgrades to it");
        } else if ((aug.name ==  AugmentationNames.PCDNIOptimizer ||
                   aug.name ==  AugmentationNames.PCDNINeuralNetwork) && 
                   Augmentations[AugmentationNames.PCDNI].owned == false) {
            dialogBoxCreate("You must first install the Pc Direct-Neural Interface before installing this upgrade");
        } else if (aug.name == AugmentationNames.GrapheneBrachiBlades && 
                   Augmentations[AugmentationNames.BrachiBlades].owned == false) {
            dialogBoxCreate("You must first install the Brachi Blades augmentation before installing this upgrade");
        } else if (aug.name == AugmentationNames.GrapheneBionicArms && 
                   Augmentations[AugmentationNames.BionicArms].owned == false) {
            dialogBoxCreate("You must first install the Bionic Arms augmentation before installing this upgrade");
        } else if (Player.money >= (aug.baseCost * fac.augmentationPriceMult)) {
            var queuedAugmentation = new PlayerOwnedAugmentation(aug.name);
            if (aug.name == AugmentationNames.NeuroFluxGovernor) {
                queuedAugmentation.level = getNextNeurofluxLevel();
            }
            Player.queuedAugmentations.push(queuedAugmentation);
            
            Player.loseMoney((aug.baseCost * fac.augmentationPriceMult));
            dialogBoxCreate("You purchased "  + aug.name + ". It's enhancements will not take " + 
                            "effect until they are installed. To install your augmentations, go to the " + 
                            "'Augmentations' tab on the left-hand navigation menu. Purchasing additional " + 
                            "augmentations will now be more expensive.");
                            
            //If you just purchased Neuroflux Governor, recalculate the cost
            if (aug.name == AugmentationNames.NeuroFluxGovernor) {
                var nextLevel = getNextNeurofluxLevel();
                --nextLevel;
                var mult = Math.pow(CONSTANTS.NeuroFluxGovernorLevelMult, nextLevel);
                aug.setRequirements(500 * mult, 750000 * mult);
                
                for (var i = 0; i < Player.queuedAugmentations.length-1; ++i) {
                    aug.baseCost *= CONSTANTS.MultipleAugMultiplier;
                }
            }
            
            for (var name in Augmentations) {
                if (Augmentations.hasOwnProperty(name)) {
                    Augmentations[name].baseCost *= CONSTANTS.MultipleAugMultiplier;
                }
            }
            
            displayFactionAugmentations(fac.name);
        } else {
            dialogBoxCreate("You don't have enough money to purchase this Augmentation!");
        }
        purchaseAugmentationBoxClose();
        
        return false;
    });
    
    purchaseAugmentationBoxOpen();
}

function getNextNeurofluxLevel() {
    var aug = Augmentations[AugmentationNames.NeuroFluxGovernor];
    if (aug == null) {
        for (var i = 0; i < Player.augmentations.length; ++i) {
            if (Player.augmentations[i].name == AugmentationNames.NeuroFluxGovernor) {
                aug = Player.augmentations[i];
            }
        }
        if (aug == null) {
            console.log("ERROR, Could not find NeuroFlux Governor aug");
            return 1;
        }
    }
    var nextLevel = aug.level + 1;
    for (var i = 0; i < Player.queuedAugmentations.length; ++i) {
        if (Player.queuedAugmentations[i].name == AugmentationNames.NeuroFluxGovernor) {
            ++nextLevel;
        }
    }
    return nextLevel;
}