/* HacknetNode.js */
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
    
    //Each CPU core doubles the speed. Every 1GB of ram adds 20% increase
    this.moneyGainRatePerSecond = (this.level * gainPerLevel) * 
                                  Math.pow(1.2, this.ram-1) * 
                                  this.numCores * Player.hacknet_node_money_mult;
    if (isNaN(this.moneyGainRatePerSecond)) {
        throw new Error("Money gain rate calculated for Hacknet Node is NaN");
    }
    
    updateTotalHacknetProduction();
}

HacknetNode.prototype.calculateLevelUpgradeCost = function() {
    //Upgrade cost = Base cost * multiplier ^ level
    var mult = CONSTANTS.HacknetNodeUpgradeLevelMult;
    return CONSTANTS.BaseCostForHacknetNode / 2 * Math.pow(mult, this.level) * Player.hacknet_node_level_cost_mult;
}

HacknetNode.prototype.purchaseLevelUpgrade = function() {
    var cost = this.calculateLevelUpgradeCost();
    if (isNaN(cost)) {throw new Error("Cost is NaN"); return;}
    if (cost > Player.money) {return;}
    Player.loseMoney(cost);
    ++this.level;
    this.updateMoneyGainRate();
}

HacknetNode.prototype.calculateRamUpgradeCost = function() {
    var numUpgrades = Math.log2(this.ram);
    
    //Calculate cost
    //Base cost of RAM is 50k per 1GB...but lets  have this increase by 10% for every time
    //the RAM has been upgraded
    var cost = this.ram * CONSTANTS.BaseCostFor1GBOfRamHacknetNode;
    var mult = Math.pow(CONSTANTS.HacknetNodeUpgradeRamMult, numUpgrades);
    return cost * mult * Player.hacknet_node_ram_cost_mult;
}

HacknetNode.prototype.purchaseRamUpgrade = function() {
    var cost = this.calculateRamUpgradeCost();
    if (isNaN(cost)) {throw new Error("Cost is NaN"); return;}
    if (cost > Player.money) {return;}
    Player.loseMoney(cost);
    this.ram *= 2; //Ram is always doubled
    this.updateMoneyGainRate();
}

HacknetNode.prototype.calculateCoreUpgradeCost = function() {
    var coreBaseCost = CONSTANTS.BaseCostForHacknetNodeCore;
    var mult = CONSTANTS.HacknetNodeUpgradeCoreMult;
    return coreBaseCost * Math.pow(mult, this.numCores-1) * Player.hacknet_node_core_cost_mult;
}

HacknetNode.prototype.purchaseCoreUpgrade = function() {
    var cost = this.calculateCoreUpgradeCost();
    if (isNaN(cost)) {throw new Error("Cost is NaN"); return;}
    if (cost > Player.money) {return;}
    Player.loseMoney(cost);
    ++this.numCores;
    this.updateMoneyGainRate();
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

//Creates Hacknet Node DOM elements when the page is opened
displayHacknetNodesContent = function() {
    //Update Hacknet Nodes button
    var newPurchaseButton = clearEventListeners("hacknet-nodes-purchase-button");
    
    newPurchaseButton.addEventListener("click", function() {
        purchaseHacknet();
        return false;
    });
    
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
                          "Total production from all Hacknet Nodes: $" + formatNumber(Player.totalHacknetNodeProduction, 2);
    
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
        nodeObj.purchaseLevelUpgrade();
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
                    
    var upgradeLevelButton = document.getElementById("hacknet-node-upgrade-level-" + nodeName);
    if (upgradeLevelButton == null) {throw new Error("Cannot find upgrade level button element");}
    var upgradeLevelCost = nodeObj.calculateLevelUpgradeCost();
    upgradeLevelButton.innerHTML = "Upgrade Hacknet Node Level - $" + formatNumber(upgradeLevelCost, 2);
    if (upgradeLevelCost > Player.money) {
        upgradeLevelButton.setAttribute("class", "a-link-button-inactive");
    } else {
        upgradeLevelButton.setAttribute("class", "a-link-button");
    }
    
    var upgradeRamButton = document.getElementById("hacknet-node-upgrade-ram-" + nodeName);
    if (upgradeRamButton == null) {throw new Error("Cannot find upgrade ram button element");}
    var upgradeRamCost = nodeObj.calculateRamUpgradeCost();
    upgradeRamButton.innerHTML = "Upgrade Hacknet Node RAM -$" + formatNumber(upgradeRamCost, 2);
    if (upgradeRamCost > Player.money) {
        upgradeRamButton.setAttribute("class", "a-link-button-inactive");
    } else {
        upgradeRamButton.setAttribute("class", "a-link-button");
    }
    
    var upgradeCoreButton = document.getElementById("hacknet-node-upgrade-core-" + nodeName);
    if (upgradeCoreButton == null) {throw new Error("Cannot find upgrade cores button element");}
    var upgradeCoreCost = nodeObj.calculateCoreUpgradeCost();
    upgradeCoreButton.innerHTML = "Purchase additional CPU Core - $" + formatNumber(upgradeCoreCost, 2);
    if (upgradeCoreCost > Player.money) {
        upgradeCoreButton.setAttribute("class", "a-link-button-inactive");
    } else {
        upgradeCoreButton.setAttribute("class", "a-link-button");
    }
}

processAllHacknetNodeEarnings = function(numCycles) {
    for (var i = 0; i < Player.hacknetNodes.length; ++i) {
        processSingleHacknetNodeEarnings(numCycles, Player.hacknetNodes[i]);
    }
}

processSingleHacknetNodeEarnings = function(numCycles, nodeObj) {
    var cyclesPerSecond = 1000 / Engine._idleSpeed;
    var earningPerCycle = nodeObj.moneyGainRatePerSecond / cyclesPerSecond;
    if (isNaN(earningPerCycle)) {throw new Error("Calculated Earnings is not a number");}
    var totalEarnings = numCycles * earningPerCycle;
    nodeObj.totalMoneyGenerated += totalEarnings;
    nodeObj.onlineTimeSeconds += (numCycles * (Engine._idleSpeed / 1000));
    Player.gainMoney(totalEarnings);
}