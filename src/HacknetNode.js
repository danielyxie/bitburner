/* HacknetNode.js */
function HacknetNode(name) {
    this.level      = 1;
    this.ram        = 0; //GB
    this.numCores   = 1; 
    
    this.name       = name;
    
    this.totalMoneyGenerated    = 0;
    this.onlineTimeSeconds      = 0;
    
    this.moneyGainRatePerSecond = 0;
}

HacknetNode.prototype.updateMoneyGainRate = function() {
    //How much extra $/s is gained per level
    var gainPerLevel = 0.25;
    
    //Each CPU core doubles the speed. Every 1GB of ram adds 10% increase
    this.moneyGainRatePerSecond = (this.level * gainPerLevel) * Math.pow(1.1, ram) * this.numCores;
}

HacknetNode.prototype.calculateLevelUpgradeCost = function() {
    //Upgrade cost = Base cost * multiplier ^ level
    var baseCost = 10000;
    var mult = 1.08;
    return baseCost * Math.pow(mult, this.level);
}

HacknetNode.prototype.purchaseLevelUpgrade = function() {
    var cost = this.calculateLevelUpgradeCost();
    if (cost > Player.money) {return;}
    Player.loseMoney(cost);
    ++this.level;
}

HacknetNode.prototype.calculateRamUpgradeCost = function() {
    var numUpgrades = Math.log2(this.ram);
    
    //Calculate cost
    //Base cost of RAM is 50k per 1GB...but lets  have this increase by 10% for every time
    //the RAM has been upgraded
    var cost = currentRam * CONSTANTS.BaseCostFor1GBOfRam;
    var mult = Math.pow(1.1, numUpgrades);
    return cost * mult;
}

HacknetNode.prototype.purchaseRamUpgrade = function() {
    var cost = this.calculateRamUpgradeCost();
    if (cost > Player.money) {return;}
    Player.loseMoney(cost);
    this.ram *= 2; //Ram is always doubled
}

HacknetNode.prototype.calculateCoreUpgradeCost = function() {
    var coreBaseCost = 1000000;
    var mult = 1.5;
    return coreBaseCost * Math.pow(mult, this.numCores);
}

HacknetNode.prototype.purchaseCoreUpgrade = function() {
    var cost = this.calculateCoreUpgradeCost();
    if (cost > Player.money) {return;}
    Player.loseMoney(cost);
    ++this.numCores;
}

/* Saving and loading HackNets */
HacknetNode.prototype.toJSON = function() {
    return Generic_toJSON("HacknetNode", this);
}

HacknetNode.fromJSON = function(value) {
    return Generic_fromJSON(HacknetNode, value.data);
}

createHacknetNodeDomElement = function(nodeObj) {
    var nodeName = nodeObj.name;
    
    var list = document.getElementById("hacknet-nodes-list");
    
    var listItem = document.createElement("li");
    item.setAttribute("class", "hacknet-node");
    
    var span = document.createElement("span");
    span.style.display = "inline-block";
    
    //Text
    var txt = document.createElement("p");
    txt.setAttribute("id", "hacknet-node-text-" + nodeName);
    txt.innerHTML = "Node name: " + nodeName + "<br>"
                    "Production: " + nodeObj.totalMoneyGenerated + 
                                 " ($" + nodeObj.moneyGainRatePerSecond + ") <br>" + 
                    "Level: " + nodeObj.level + "<br>" + 
                    "RAM: " + nodeObj.ram + "GB<br>" + 
                    "Cores: " + nodeObj.numCores;
    
    //Upgrade buttons
    var upgradeLevelButton = document.createElement("a");
    var upgradeRamButton = document.createElement("a");
    var upgradeCoreButton = document.createElement("a");
   
    upgradeLevelButton.setAttribute("id", "hacknet-node-upgrade-level-" + nodeName);
    upgradeLevelButton.setAttribute("class", "a-link-button-inactive");
    upgradeRamButton.setAttribute("id", "hacknet-node-upgrade-ram-" + nodeName);
    upgradeRamButton.setAttribute("class", "a-link-button-inactive");
    upgradeCoreButton.setAttribute("id", "hacknet-node-upgrade-core-" + nodeName);
    upgradeCoreButton.setAttribute("class", "a-link-button-inactive");
   
    upgradeLevelButton.innerHTML = "Upgrade Hacknet Node Level";
    upgradeRamButton.innerHTML = "Upgrade Hacknet Node RAM";
    upgradeCoreButton.innerHTML = "Purchase additional CPU Core for Hacknet Node";
    
    updateHacknetNodeDomElement(item, nodeObj);
    
    list.appendChild(item);
}

updateHacknetNodeDomElement = function(li, nodeObj) {
    var nodeName = nodeObj.name;
}

Reviver.constructors.HacknetNode = HacknetNode;

purchaseHacknet = function() {
    
}
