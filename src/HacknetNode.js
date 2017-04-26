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

/* Saving and loading HackNets */
HacknetNode.prototype.toJSON = function() {
    return Generic_toJSON("HacknetNode", this);
}

HacknetNode.fromJSON = function(value) {
    return Generic_fromJSON(HacknetNode, value.data);
}

Reviver.constructors.HacknetNode = HacknetNode;


purchaseHacknet = function() {
    
}