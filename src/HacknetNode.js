/* HacknetNode.js */
function hacknetNodesInit() {
    var mult1x = document.getElementById("hacknet-nodes-1x-multiplier");
    mult1x.addEventListener("click", function() {
        hacknetNodePurchaseMultiplier = 1;
        updateHacknetNodesMultiplierButtons();
        updateHacknetNodesContent();
        return false;
    });
    var mult5x = document.getElementById("hacknet-nodes-5x-multiplier");
    mult5x.addEventListener("click", function() {
        hacknetNodePurchaseMultiplier = 5;
        updateHacknetNodesMultiplierButtons();
        updateHacknetNodesContent();
        return false;
    });
    var mult10x = document.getElementById("hacknet-nodes-10x-multiplier");
    mult10x.addEventListener("click", function() {
        hacknetNodePurchaseMultiplier = 10;
        updateHacknetNodesMultiplierButtons();
        updateHacknetNodesContent();
        return false; 
    });
    var multMax = document.getElementById("hacknet-nodes-max-multiplier");
    multMax.addEventListener("click", function() {
        hacknetNodePurchaseMultiplier = 0;
        updateHacknetNodesMultiplierButtons();
        updateHacknetNodesContent();
        return false;
    });
}
document.addEventListener("DOMContentLoaded", hacknetNodesInit, false);

function HacknetNode(name) {
    this.level      = 1;
    this.ram        = 1; //GB
    this.numCores   = 1; 
    
    this.name       = name;
    
    this.totalMoneyGenerated    = 0;
    this.onlineTimeSeconds      = 0;
    
    this.moneyGainRatePerSecond = 0;
}

HacknetNode.prototype.updateMoneyGainRate = function() {
    //How much extra $/s is gained per level
    var gainPerLevel = CONSTANTS.HacknetNodeMoneyGainPerLevel;
    
    this.moneyGainRatePerSecond = (this.level * gainPerLevel) * 
                                  Math.pow(1.04, this.ram-1) * 
                                  ((this.numCores + 3) / 4) * Player.hacknet_node_money_mult;
    if (isNaN(this.moneyGainRatePerSecond)) {
        this.moneyGainRatePerSecond = 0;
        dialogBoxCreate("Error in calculating Hacknet Node production. Please report to game developer");
    }
    
    updateTotalHacknetProduction();
}

HacknetNode.prototype.calculateLevelUpgradeCost = function(levels=1) {
    if (levels < 1) {return 0;}
    var mult = CONSTANTS.HacknetNodeUpgradeLevelMult;
    var totalMultiplier = 0; //Summed 
    var currLevel = this.level;
    for (var i = 0; i < levels; ++i) {
        totalMultiplier += Math.pow(mult, currLevel); 
        ++currLevel;
    }
    return CONSTANTS.BaseCostForHacknetNode / 2 * totalMultiplier * Player.hacknet_node_level_cost_mult;
}

HacknetNode.prototype.purchaseLevelUpgrade = function(levels=1) {
    var cost = this.calculateLevelUpgradeCost(levels);
    if (isNaN(cost)) {return false;}
    if (cost > Player.money) {return false;}
    Player.loseMoney(cost);
    if (this.level + levels >= CONSTANTS.HacknetNodeMaxLevel) {
        this.level = CONSTANTS.HacknetNodeMaxLevel;
        this.updateMoneyGainRate();
        return true;
    }
    this.level += levels;
    this.updateMoneyGainRate();
    return true;
}

HacknetNode.prototype.calculateRamUpgradeCost = function() {
    var numUpgrades = Math.log2(this.ram);
    
    //Calculate cost
    //Base cost of RAM is 50k per 1GB, increased by some multiplier for each time RAM is upgraded
    var baseCost = this.ram * CONSTANTS.BaseCostFor1GBOfRamHacknetNode;
    var mult = Math.pow(CONSTANTS.HacknetNodeUpgradeRamMult, numUpgrades);
    return baseCost * mult * Player.hacknet_node_ram_cost_mult;
}

HacknetNode.prototype.purchaseRamUpgrade = function() {
    var cost = this.calculateRamUpgradeCost();
    if (isNaN(cost)) {return false;}
    if (cost > Player.money) {return false;}
    if (this.ram >= CONSTANTS.HacknetNodeMaxRam) {return false;}
    Player.loseMoney(cost);
    this.ram *= 2; //Ram is always doubled
    this.updateMoneyGainRate();
    return true;
}

HacknetNode.prototype.calculateCoreUpgradeCost = function() {
    var coreBaseCost = CONSTANTS.BaseCostForHacknetNodeCore;
    var mult = CONSTANTS.HacknetNodeUpgradeCoreMult;
    return coreBaseCost * Math.pow(mult, this.numCores-1) * Player.hacknet_node_core_cost_mult;
}

HacknetNode.prototype.purchaseCoreUpgrade = function() {
    var cost = this.calculateCoreUpgradeCost();
    if (isNaN(cost)) {return false;}
    if (cost > Player.money) {return false;}
    if (this.numCores >= CONSTANTS.HacknetNodeMaxCores) {return false;}
    Player.loseMoney(cost);
    ++this.numCores;
    this.updateMoneyGainRate();
    return true;
}

/* Saving and loading HackNets */
HacknetNode.prototype.toJSON = function() {
    return Generic_toJSON("HacknetNode", this);
}

HacknetNode.fromJSON = function(value) {
    return Generic_fromJSON(HacknetNode, value.data);
}

Reviver.constructors.HacknetNode = HacknetNode;


purchaseHacknet = function() {
    /* INTERACTIVE TUTORIAL */
    if (iTutorialIsRunning) {
        if (currITutorialStep == iTutorialSteps.HacknetNodesIntroduction) {
            iTutorialNextStep();
        } else {
            return;
        }
    }
    
    /* END INTERACTIVE TUTORIAL */
    
    var cost = getCostOfNextHacknetNode();
    if (isNaN(cost)) {throw new Error("Cost is NaN"); return;}
    if (cost > Player.money) {
        dialogBoxCreate("You cannot afford to purchase a Hacknet Node!");
        return;
    }
        
    //Auto generate a name for the node for now...TODO
    var numOwned = Player.hacknetNodes.length;
    var name = "hacknet-node-" + numOwned;
    var node = new HacknetNode(name);
    node.updateMoneyGainRate();
    
    Player.loseMoney(cost);
    Player.hacknetNodes.push(node);
    
    displayHacknetNodesContent();
    updateTotalHacknetProduction();
}

//Calculates the total production from all HacknetNodes 
updateTotalHacknetProduction = function() {
    var total = 0;
    for (var i = 0; i < Player.hacknetNodes.length; ++i) {
        total += Player.hacknetNodes[i].moneyGainRatePerSecond;
    }
    Player.totalHacknetNodeProduction = total;
}

getCostOfNextHacknetNode = function() {
    //Cost increases exponentially based on how many you own
    var numOwned = Player.hacknetNodes.length;
    var mult = CONSTANTS.HacknetNodePurchaseNextMult;
    return CONSTANTS.BaseCostForHacknetNode * Math.pow(mult, numOwned) * Player.hacknet_node_purchase_cost_mult;
}

var hacknetNodePurchaseMultiplier = 1;
updateHacknetNodesMultiplierButtons = function() {
    var mult1x = document.getElementById("hacknet-nodes-1x-multiplier");
    var mult5x = document.getElementById("hacknet-nodes-5x-multiplier");
    var mult10x = document.getElementById("hacknet-nodes-10x-multiplier");
    var multMax = document.getElementById("hacknet-nodes-max-multiplier");
    mult1x.setAttribute("class", "a-link-button");
    mult5x.setAttribute("class", "a-link-button");
    mult10x.setAttribute("class", "a-link-button");
    multMax.setAttribute("class", "a-link-button");
    if (Player.hacknetNodes.length == 0) {
        mult1x.setAttribute("class", "a-link-button-inactive");
        mult5x.setAttribute("class", "a-link-button-inactive");
        mult10x.setAttribute("class", "a-link-button-inactive");
        multMax.setAttribute("class", "a-link-button-inactive");
    } else if (hacknetNodePurchaseMultiplier == 1) {
        mult1x.setAttribute("class", "a-link-button-inactive");
    } else if (hacknetNodePurchaseMultiplier == 5) {
        mult5x.setAttribute("class", "a-link-button-inactive");
    } else if (hacknetNodePurchaseMultiplier == 10) {
        mult10x.setAttribute("class", "a-link-button-inactive");
    } else {
        multMax.setAttribute("class", "a-link-button-inactive");
    }
}

//Calculate the maximum number of times the Player can afford to upgrade
//a Hacknet Node's level"
getMaxNumberLevelUpgrades = function(nodeObj) {
    if (nodeObj.calculateLevelUpgradeCost(1) > Player.money) {return 0;}
    var min = 1;
    var max = CONSTANTS.HacknetNodeMaxLevel-1;
    var levelsToMax = CONSTANTS.HacknetNodeMaxLevel - nodeObj.level;
    
    while (min <= max) {
        var curr = (min + max) / 2 | 0;
        if (curr != CONSTANTS.HacknetNodeMaxLevel && 
            nodeObj.calculateLevelUpgradeCost(curr) < Player.money &&
            nodeObj.calculateLevelUpgradeCost(curr+1) > Player.money) {
            return Math.min(levelsToMax, curr);
        } else if (nodeObj.calculateLevelUpgradeCost(curr) > Player.money) {
            max = curr - 1;
        } else if (nodeObj.calculateLevelUpgradeCost(curr) < Player.money) {
            min = curr + 1;
        } else {
            return Math.min(levelsToMax, curr);
        }
    }
}

//Creates Hacknet Node DOM elements when the page is opened
displayHacknetNodesContent = function() {
    //Update Hacknet Nodes button
    var newPurchaseButton = clearEventListeners("hacknet-nodes-purchase-button");
    
    newPurchaseButton.addEventListener("click", function() {
        purchaseHacknet();
        return false;
    });
    
    //Handle Purchase multiplier buttons
    updateHacknetNodesMultiplierButtons();
    
    //Remove all old hacknet Node DOM elements
    var hacknetNodesList = document.getElementById("hacknet-nodes-list");
        while (hacknetNodesList.firstChild) {
        hacknetNodesList.removeChild(hacknetNodesList.firstChild);
    }
    
    //Then re-create them
    for (var i = 0; i < Player.hacknetNodes.length; ++i) {
        createHacknetNodeDomElement(Player.hacknetNodes[i]);
    }
    updateHacknetNodesContent();
}

//Update information on all Hacknet Node DOM elements
updateHacknetNodesContent = function() {
    //Set purchase button to inactive if not enough money, and update its price display
    var cost = getCostOfNextHacknetNode();
    var purchaseButton = document.getElementById("hacknet-nodes-purchase-button");
    purchaseButton.innerHTML = "Purchase Hacknet Node - $" + formatNumber(cost, 2);
    if (cost > Player.money) {
        purchaseButton.setAttribute("class", "a-link-button-inactive");
    } else {
        purchaseButton.setAttribute("class", "a-link-button");
    }
    
    //Update player's money
    var moneyElem = document.getElementById("hacknet-nodes-money");
    moneyElem.innerHTML = "Money: $" + formatNumber(Player.money, 2) + "<br>" + 
                          "Total production from all Hacknet Nodes: $" + formatNumber(Player.totalHacknetNodeProduction, 2) + " / second";
    
    //Update information in each owned hacknet node
    for (var i = 0; i < Player.hacknetNodes.length; ++i) {
        updateHacknetNodeDomElement(Player.hacknetNodes[i]);
    }
}

//Creates a single Hacknet Node DOM element
createHacknetNodeDomElement = function(nodeObj) {
    var nodeName = nodeObj.name;
        
    var listItem = document.createElement("li");
    listItem.setAttribute("class", "hacknet-node");
    
    var span = document.createElement("span");
    span.style.display = "inline";
    
    var buttonDiv = document.createElement("div");
    buttonDiv.setAttribute("class", "hacknet-node-button-div");
    
    //Text
    var txt = document.createElement("p");
    //txt.setAttribute("id", "hacknet-node-text-" + nodeName);
    txt.id = "hacknet-node-text-" + nodeName;
    
    //Upgrade buttons
    var upgradeLevelButton = document.createElement("a");
    var upgradeRamButton = document.createElement("a");
    var upgradeCoreButton = document.createElement("a");
   
    //upgradeLevelButton.setAttribute("id", "hacknet-node-upgrade-level-" + nodeName);
    upgradeLevelButton.id = "hacknet-node-upgrade-level-" + nodeName;
    upgradeLevelButton.setAttribute("class", "a-link-button-inactive");
    upgradeLevelButton.addEventListener("click", function() {
        var numUpgrades = hacknetNodePurchaseMultiplier;
        if (hacknetNodePurchaseMultiplier == 0) {
            numUpgrades = getMaxNumberLevelUpgrades(nodeObj);
        }
        nodeObj.purchaseLevelUpgrade(numUpgrades);
        updateHacknetNodesContent();
        return false;
    });
    //upgradeRamButton.setAttribute("id", "hacknet-node-upgrade-ram-" + nodeName);
    upgradeRamButton.id = "hacknet-node-upgrade-ram-" + nodeName;
    upgradeRamButton.setAttribute("class", "a-link-button-inactive");
    upgradeRamButton.addEventListener("click", function() {
        nodeObj.purchaseRamUpgrade();
        updateHacknetNodesContent();
        return false;
    });
    //upgradeCoreButton.setAttribute("id", "hacknet-node-upgrade-core-" + nodeName);
    upgradeCoreButton.id = "hacknet-node-upgrade-core-" + nodeName;
    upgradeCoreButton.setAttribute("class", "a-link-button-inactive");
    upgradeCoreButton.addEventListener("click", function() {
        nodeObj.purchaseCoreUpgrade();
        updateHacknetNodesContent();
        return false;
    });
       
    //Put all the components together in the li element
    span.appendChild(txt);
    buttonDiv.appendChild(upgradeLevelButton);
    buttonDiv.appendChild(upgradeRamButton);
    buttonDiv.appendChild(upgradeCoreButton);
    span.appendChild(buttonDiv);
    listItem.appendChild(span);
    
    document.getElementById("hacknet-nodes-list").appendChild(listItem);
    
    //Set the text and stuff inside the DOM element
    updateHacknetNodeDomElement(nodeObj);
}

//Updates information on a single hacknet node DOM element
updateHacknetNodeDomElement = function(nodeObj) {
    var nodeName = nodeObj.name;
    var txt = document.getElementById("hacknet-node-text-" + nodeName);
    if (txt == null) {throw new Error("Cannot find text element");}
    txt.innerHTML = "Node name:  " + nodeName + "<br>" +
                    "Production: $" + formatNumber(nodeObj.totalMoneyGenerated, 2) + 
                                 " ($" + formatNumber(nodeObj.moneyGainRatePerSecond, 2) + " / second) <br>" + 
                    "Level:      " + nodeObj.level + "<br>" + 
                    "RAM:        " + nodeObj.ram + "GB<br>" + 
                    "Cores:      " + nodeObj.numCores;
                    
    //Upgrade level
    var upgradeLevelButton = document.getElementById("hacknet-node-upgrade-level-" + nodeName);
    if (upgradeLevelButton == null) {throw new Error("Cannot find upgrade level button element");}
    if (nodeObj.level >= CONSTANTS.HacknetNodeMaxLevel) {
        upgradeLevelButton.innerHTML = "MAX LEVEL";
        upgradeLevelButton.setAttribute("class", "a-link-button-inactive");
    } else {
        var multiplier = 0;
        if (hacknetNodePurchaseMultiplier == 0) {
            //Max
            multiplier = getMaxNumberLevelUpgrades(nodeObj);
        } else {
            multiplier = hacknetNodePurchaseMultiplier;
        }
        
        var upgradeLevelCost = nodeObj.calculateLevelUpgradeCost(multiplier);
        upgradeLevelButton.innerHTML = "Upgrade Hacknet Node Level x" + multiplier +
                                       " - $" + formatNumber(upgradeLevelCost, 2);
        if (upgradeLevelCost > Player.money ) {
            upgradeLevelButton.setAttribute("class", "a-link-button-inactive");
        } else {
            upgradeLevelButton.setAttribute("class", "a-link-button");
        }
    }
    
    //Upgrade RAM
    var upgradeRamButton = document.getElementById("hacknet-node-upgrade-ram-" + nodeName);
    if (upgradeRamButton == null) {throw new Error("Cannot find upgrade ram button element");}
    if (nodeObj.ram >= CONSTANTS.HacknetNodeMaxRam) {
        upgradeRamButton.innerHTML = "MAX RAM";
        upgradeRamButton.setAttribute("class", "a-link-button-inactive");
    } else {
        var upgradeRamCost = nodeObj.calculateRamUpgradeCost();
        upgradeRamButton.innerHTML = "Upgrade Hacknet Node RAM -$" + formatNumber(upgradeRamCost, 2);
        if (upgradeRamCost > Player.money) {
            upgradeRamButton.setAttribute("class", "a-link-button-inactive");
        } else {
            upgradeRamButton.setAttribute("class", "a-link-button");
        }
    }
    
    //Upgrade Cores
    var upgradeCoreButton = document.getElementById("hacknet-node-upgrade-core-" + nodeName);
    if (upgradeCoreButton == null) {throw new Error("Cannot find upgrade cores button element");}
    if (nodeObj.numCores >= CONSTANTS.HacknetNodeMaxCores) {
        upgradeCoreButton.innerHTML = "MAX CORES";
        upgradeCoreButton.setAttribute("class", "a-link-button-inactive");
    } else {
        var upgradeCoreCost = nodeObj.calculateCoreUpgradeCost();
        upgradeCoreButton.innerHTML = "Purchase additional CPU Core - $" + formatNumber(upgradeCoreCost, 2);
        if (upgradeCoreCost > Player.money) {
            upgradeCoreButton.setAttribute("class", "a-link-button-inactive");
        } else {
            upgradeCoreButton.setAttribute("class", "a-link-button");
        }
    }
}

processAllHacknetNodeEarnings = function(numCycles) {
    var total = 0;
    for (var i = 0; i < Player.hacknetNodes.length; ++i) {
        total += processSingleHacknetNodeEarnings(numCycles, Player.hacknetNodes[i]);
    }
    return total;
}

processSingleHacknetNodeEarnings = function(numCycles, nodeObj) {
    var cyclesPerSecond = 1000 / Engine._idleSpeed;
    var earningPerCycle = nodeObj.moneyGainRatePerSecond / cyclesPerSecond;
    if (isNaN(earningPerCycle)) {throw new Error("Calculated Earnings is not a number");}
    var totalEarnings = numCycles * earningPerCycle;
    nodeObj.totalMoneyGenerated += totalEarnings;
    nodeObj.onlineTimeSeconds += (numCycles * (Engine._idleSpeed / 1000));
    Player.gainMoney(totalEarnings);
    return totalEarnings;
}

getHacknetNode = function(name) {
    for (var i = 0; i < Player.hacknetNodes.length; ++i) {
        if (Player.hacknetNodes[i].name == name) {
            return Player.hacknetNodes[i];
        }
    }
    return null;
}