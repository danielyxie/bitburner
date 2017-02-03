//Netburner Player class
function PlayerObject() {
    //Skills and stats
    this.hacking_skill   = 1;
                     
    //Fighting
    this.strength        = 1;      //Damage dealt
    this.defense         = 1;      //Damage received
    this.dexterity       = 1;      //Accuracy
    this.agility         = 1;      //Dodge %
    
    //Labor stats
    this.charisma        = 1;
	//Intelligence, perhaps?
    
    //Hacking multipliers
    this.hacking_chance_multiplier   = 2;  //Increase through ascensions/augmentations
    //this.hacking_speed_multiplier  =     5;  //Decrease through ascensions/augmentations
    this.hacking_speed_multiplier    =  1;  //Make it faster for debugging
    this.hacking_money_multiplier    = .001;    //Increase through ascensions/augmentations. Can't go above 1
    
    //Note: "Lifetime" refers to current ascension, "total" refers to the entire game history
    //Accumulative  stats and skills
    this.total_hacking   = 1;
    this.total_strength  = 1;
    this.total_defense   = 1;
    this.total_dexterity = 1;
    this.total_agility   = 1;
    this.total_charisma  = 1;
    this.lifetime_hacking    = 1;
    this.lifetime_strength   = 1;
    this.lifetime_defense    = 1;
    this.lifetime_dexterity  = 1;
    this.lifetime_agility    = 1;
    this.lifetime_charisma   = 1;
    
    //Experience and multipliers
    this.hacking_exp     = 0;
    this.strength_exp    = 0;
    this.defense_exp     = 0;
    this.dexterity_exp   = 0;
    this.agility_exp     = 0;
    this.charisma_exp    = 0;
    
    this.hacking_exp_mult    = 1;
    this.strength_exp_mult   = 1;
    this.defense_exp_mult    = 1;
    this.dexterity_exp_mult  = 1;
    this.agility_exp_mult    = 1;
    this.charisma_exp_mult   = 1;

    this.company_rep_mult    = 1;  //Multiplier for how fast the player gains reputation at a company
    
    //Money
    this.money           = 0;
    this.total_money     = 0;
    this.lifetime_money  = 0;
    
    //IP Address of Starting (home) computer
    this.homeComputer = "";
	
	//Location information
	this.city 			= Locations.Aevum;
	this.location 		= "";
    
    //Company Information
    this.companyName = "";
    this.companyPosition = "";
    
    //Servers
    this.currentServer       = ""; //IP address of Server currently being accessed through terminal
    this.discoveredServers   = [];   //IP addresses of secret servers not in the network that you have discovered
    this.purchasedServers    = [];
    
    //Achievements and achievement progress
    
    //Flag to let the engine know the player is starting a hack
    this.startAction = false;
    this.actionTime = 0;
	
	//Used to store the last update time. 
	this.lastUpdate = new Date().getTime();
};

PlayerObject.prototype.init = function() {
    /* Initialize Player's home computer */
    var t_homeComp = new Server();
    t_homeComp.init(createRandomIp(), "home", "Home PC", true, true, true, true, 1);
    this.homeComputer = t_homeComp.ip;
    this.currentServer = t_homeComp.ip;
    AddToAllServers(t_homeComp);
    
    this.getHomeComputer().programs.push("PortHack.exe");
}    

PlayerObject.prototype.getCurrentServer = function() {
    return AllServers[this.currentServer];
}

PlayerObject.prototype.getHomeComputer = function() {
    return AllServers[this.homeComputer];
}

//Calculates skill level based on experience. The same formula will be used for every skill
//  At the maximum possible exp (MAX_INT = 9007199254740991), the hacking skill will be 1796 TODO REcalculate this
//  Gets to level 1000 hacking skill at (TODO Determine this)
PlayerObject.prototype.calculateSkill = function(exp) {
    return Math.max(Math.floor(7.2 * Math.log(exp + 518.013) - 44), 1);
}

PlayerObject.prototype.updateSkillLevels = function() {
	this.hacking_skill = this.calculateSkill(this.hacking_exp);
	this.strength      = this.calculateSkill(this.strength_exp);
    this.defense       = this.calculateSkill(this.defense_exp);
    this.dexterity     = this.calculateSkill(this.dexterity_exp);
    this.agility       = this.calculateSkill(this.agility_exp);
    this.charisma      = this.calculateSkill(this.charisma_exp);
}

//Calculates the chance of hacking a server
//The formula is:
//  (hacking_chance_multiplier * hacking_skill - requiredLevel)      100 - difficulty       
//  -----------------------------------------------------------  *  -----------------
//        (hacking_chance_multiplier * hacking_skill)                      100
PlayerObject.prototype.calculateHackingChance = function() {
    var difficultyMult = (100 - this.getCurrentServer().hackDifficulty) / 100;
    var skillMult = (this.hacking_chance_multiplier * this.hacking_skill);
    var skillChance = (skillMult - this.getCurrentServer().requiredHackingSkill) / skillMult;
    return (skillChance * difficultyMult);
}

//Calculate the time it takes to hack a server in seconds. Returns the time
//The formula is:
//    (requiredLevel * difficulty)          
//  -------------------------------  *  hacking_speed_multiplier
//        hacking_skill                           
PlayerObject.prototype.calculateHackingTime = function() {
    var difficultyMult = this.getCurrentServer().requiredHackingSkill * this.getCurrentServer().hackDifficulty;
    var skillFactor = difficultyMult / this.hacking_skill;
    return skillFactor * this.hacking_speed_multiplier;
}

//Calculates the PERCENTAGE of a server's money that the player will hack from the server if successful
//The formula is:
//  (hacking_skill - (requiredLevel-1))      100 - difficulty       
//  --------------------------------------* -----------------------  *  hacking_money_multiplier
//         hacking_skill                        100
PlayerObject.prototype.calculatePercentMoneyHacked = function() {
    var difficultyMult = (100 - this.getCurrentServer().hackDifficulty) / 100;
    var skillMult = (this.hacking_skill - (this.getCurrentServer().requiredHackingSkill - 1)) / this.hacking_skill;
    var percentMoneyHacked = difficultyMult * skillMult * this.hacking_money_multiplier;
    console.log("Percent money hacked calculated to be: " + percentMoneyHacked);
    return percentMoneyHacked;
}

//Returns how much EXP the player gains on a successful hack
//The formula is:
//  difficulty * requiredLevel * hacking_multiplier
//
// Note: Keep it at an integer for now,
PlayerObject.prototype.calculateExpGain = function() {
    return Math.round(this.getCurrentServer().hackDifficulty * this.getCurrentServer().requiredHackingSkill * this.hacking_exp_mult);
}

//Hack/Analyze a server. Return the amount of time the hack will take. This lets the Terminal object know how long to disable itself for
//This assumes that the server being hacked is not purchased by the player, that the player's hacking skill is greater than the
//required hacking skill and that the player has admin rights.
PlayerObject.prototype.hack = function() {
    this.actionTime = this.calculateHackingTime();
    console.log("Hacking time: " + this.actionTime);
    //Set the startAction flag so the engine starts the hacking process
    this.startAction = true;
}

PlayerObject.prototype.analyze = function() {
    //TODO Analyze only takes 5 seconds for now..maybe change this in the future?
    this.actionTime = 5;
    this.startAction = true;
}    

PlayerObject.prototype.gainMoney = function(money) {
	this.money += money;
	this.total_money += money;
	this.lifetime_money += money;
}

//Functions for saving and loading the Player data
PlayerObject.prototype.toJSON = function() {
    return Generic_toJSON("PlayerObject", this);
}   

PlayerObject.fromJSON = function(value) {
    return Generic_fromJSON(PlayerObject, value.data);
} 

Reviver.constructors.PlayerObject = PlayerObject;

Player = new PlayerObject();

    
    
