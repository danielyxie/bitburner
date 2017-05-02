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
    this.hacking_chance_mult   = 2;  //Increase through ascensions/augmentations
    this.hacking_speed_mult  =     5;  //Decrease through ascensions/augmentations
    //this.hacking_speed_mult    =  1;  //Make it faster for debugging
    this.hacking_money_mult    = .001;    //Increase through ascensions/augmentations. Can't go above 1
    
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
    
    this.hacking_mult       = 1;
    this.strength_mult      = 1;
    this.defense_mult       = 1;
    this.dexterity_mult     = 1;
    this.agility_mult       = 1;
    this.charisma_mult      = 1;
    
    this.hacking_exp_mult    = 1;
    this.strength_exp_mult   = 1;
    this.defense_exp_mult    = 1;
    this.dexterity_exp_mult  = 1;
    this.agility_exp_mult    = 1;
    this.charisma_exp_mult   = 1;

    this.company_rep_mult    = 1;
    this.faction_rep_mult    = 1;   
    
    //Money
    this.money           = 1000;
    this.total_money     = 0;   //Total money ever earned
    this.lifetime_money  = 0;   //Total money ever earned
    
    //IP Address of Starting (home) computer
    this.homeComputer = "";
	
	//Location information
	this.city 			= Locations.Sector12;
	this.location 		= "";
    
    //Company Information
    this.companyName = "";      //Name of Company, equivalent to an object from Locations
    this.companyPosition = "";  //CompanyPosition object
    
    //Servers
    this.currentServer       = ""; //IP address of Server currently being accessed through terminal
    this.discoveredServers   = []; //IP addresses of secret servers not in the network that you have discovered
    this.purchasedServers    = [];
    this.hacknetNodes   =   [];
    
    //Factions
    this.factions = []; //Names of all factions player has joined
    
    //Augmentations
    this.augmentations = []; //Names of all installed augmentations
    this.numAugmentations = 0;
    
    //Misc statistics
    this.numPeopleKilled = 0;
    this.numPeopleKilledTotal = 0;
    this.numPeopleKilledLifetime = 0;
    
    //Achievements and achievement progress
    
    //Flag to let the engine know the player is starting an action
    //  Current actions: hack, analyze
    this.startAction = false;
    this.actionTime = 0;
    
    //Flags/variables for working (Company, Faction, Creating Program, Taking Class) 
    this.isWorking = false;
    this.workType = "";
    
    this.currentWorkFactionName = "";
    this.currentWorkFactionDescription = "";
    
    this.workHackExpGainRate = 0;
    this.workStrExpGainRate = 0;
    this.workDefExpGainRate = 0;
    this.workDexExpGainRate = 0;
    this.workAgiExpGainRate = 0;
    this.workChaExpGainRate = 0;
    this.workRepGainRate = 0;
    this.workMoneyGainRate = 0;
    this.workMoneyLossRate = 0;
    
    this.workHackExpGained = 0;
    this.workStrExpGained = 0;
    this.workDefExpGained = 0;
    this.workDexExpGained = 0;
    this.workAgiExpGained = 0;
    this.workChaExpGained = 0;
    this.workRepGained = 0;
    this.workMoneyGained = 0;
    
    this.createProgramName = "";
    
    this.className = "";
    
    this.timeWorked = 0;    //in ms
    this.timeNeededToCompleteWork = 0;
    
    this.work_money_mult = 1;
    
    //Hacknet Node multipliers
    this.hacknet_node_money_mult            = 1;
    this.hacknet_node_purchase_cost_mult    = 1;
    this.hacknet_node_ram_cost_mult         = 1;
    this.hacknet_node_core_cost_mult        = 1;
    this.hacknet_node_level_cost_mult       = 1;
	
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
    
    this.getHomeComputer().programs.push(Programs.NukeProgram);
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
    return Math.max(Math.floor(32 * Math.log(exp + 534.5) - 200), 1);
}

PlayerObject.prototype.updateSkillLevels = function() {
    //TODO Account for total and lifetime stats for achievements and stuff
	this.hacking_skill = Math.floor(this.calculateSkill(this.hacking_exp) * this.hacking_mult);
	this.strength      = Math.floor(this.calculateSkill(this.strength_exp) * this.strength_mult);
    this.defense       = Math.floor(this.calculateSkill(this.defense_exp) * this.defense_mult);
    this.dexterity     = Math.floor(this.calculateSkill(this.dexterity_exp) * this.dexterity_mult);
    this.agility       = Math.floor(this.calculateSkill(this.agility_exp) * this.agility_mult);
    this.charisma      = Math.floor(this.calculateSkill(this.charisma_exp) * this.charisma_mult);
}

//Calculates the chance of hacking a server
//The formula is:
//  (hacking_chance_multiplier * hacking_skill - requiredLevel)      100 - difficulty       
//  -----------------------------------------------------------  *  -----------------
//        (hacking_chance_multiplier * hacking_skill)                      100
PlayerObject.prototype.calculateHackingChance = function() {
    var difficultyMult = (100 - this.getCurrentServer().hackDifficulty) / 100;
    var skillMult = (this.hacking_chance_mult * this.hacking_skill);
    var skillChance = (skillMult - this.getCurrentServer().requiredHackingSkill) / skillMult;
    var chance = skillChance * difficultyMult;
    if (chance < 0) {return 0;} 
    else {return chance;}
}

//Calculate the time it takes to hack a server in seconds. Returns the time
//The formula is:
//    (requiredLevel * difficulty + 500)          
//  -----------------------------------  *  hacking_speed_multiplier
//        hacking_skill + 100                           
PlayerObject.prototype.calculateHackingTime = function() {
    var difficultyMult = this.getCurrentServer().requiredHackingSkill * this.getCurrentServer().hackDifficulty;
    var skillFactor = (2 * difficultyMult + 300) / (this.hacking_skill + 100);
    return skillFactor * this.hacking_speed_mult;
}

//Calculates the PERCENTAGE of a server's money that the player will hack from the server if successful
//The formula is:
//  (hacking_skill - (requiredLevel-1))      100 - difficulty       
//  --------------------------------------* -----------------------  *  hacking_money_multiplier
//         hacking_skill                        100
PlayerObject.prototype.calculatePercentMoneyHacked = function() {
    var difficultyMult = (100 - this.getCurrentServer().hackDifficulty) / 100;
    var skillMult = (this.hacking_skill - (this.getCurrentServer().requiredHackingSkill - 1)) / this.hacking_skill;
    var percentMoneyHacked = difficultyMult * skillMult * this.hacking_money_mult;
    console.log("Percent money hacked calculated to be: " + percentMoneyHacked);
    if (percentMoneyHacked < 0) {return 0;}
    if (percentMoneyHacked > 1) {return 1;}
    return percentMoneyHacked;
}

//Returns how much EXP the player gains on a successful hack
//The formula is:
//  difficulty * requiredLevel * hacking_multiplier
//
// Note: Keep it at an integer for now,
PlayerObject.prototype.calculateExpGain = function() {
    return Math.round(this.getCurrentServer().hackDifficulty * this.hacking_exp_mult);
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
    //TODO Analyze only takes 1 seconds for now..maybe change this in the future?
    this.actionTime = 1;
    this.startAction = true;
}    

PlayerObject.prototype.gainMoney = function(money) {
    if (isNaN(money)) {
        console.log("ERR: NaN passed into Player.gainMoney()"); return;
    }
	this.money += money;
	this.total_money += money;
	this.lifetime_money += money;
}

PlayerObject.prototype.loseMoney = function(money) {
    if (isNaN(money)) {
        console.log("ERR: NaN passed into Player.loseMoney()"); return;
    }
    this.money -= money;
}

PlayerObject.prototype.gainHackingExp = function(exp) {
    if (isNaN(exp)) {
        console.log("ERR: NaN passed into Player.gainHackingExp()"); return;
    }
    this.hacking_exp += exp;
}

PlayerObject.prototype.gainStrengthExp = function(exp) {
    if (isNaN(exp)) {
        console.log("ERR: NaN passed into Player.gainStrengthExp()"); return;
    }
    this.strength_exp += exp;
}

PlayerObject.prototype.gainDefenseExp = function(exp) {
    if (isNaN(exp)) {
        console.log("ERR: NaN passed into player.gainDefenseExp()"); return;
    }
    this.defense_exp += exp;
}

PlayerObject.prototype.gainDexterityExp = function(exp) {
    if (isNaN(exp)) {
        console.log("ERR: NaN passed into Player.gainDexterityExp()"); return;
    }
    this.dexterity_exp += exp;
}

PlayerObject.prototype.gainAgilityExp = function(exp) {
    if (isNaN(exp)) {
        console.log("ERR: NaN passed into Player.gainAgilityExp()"); return;
    }
    this.agility_exp += exp;
}

PlayerObject.prototype.gainCharismaExp = function(exp) {
    if (isNaN(exp)) {
        console.log("ERR: NaN passed into Player.gainCharismaExp()"); return;
    }
    this.charisma_exp += exp;
}

/* Working for Company */
PlayerObject.prototype.finishWork = function(cancelled) {
    //Since the work was cancelled early, player only gains half of what they've earned so far
    var cancMult = 1;
    if (cancelled) {cancMult = 2;}
    
    if (Engine.Debug) {
        console.log("Player finishWork() called with " + this.workMoneyGained / cancMult + " $ gained");
    }
    this.gainHackingExp(this.workHackExpGained / cancMult);
    this.gainStrengthExp(this.workStrExpGained / cancMult);
    this.gainDefenseExp(this.workDefExpGained / cancMult);
    this.gainDexterityExp(this.workDexExpGained / cancMult);
    this.gainAgilityExp(this.workAgiExpGained / cancMult);
    this.gainCharismaExp(this.workChaExpGained / cancMult);
    
    var company = Companies[this.companyName];
    company.playerReputation += (this.workRepGained / cancMult);
    
    this.gainMoney(this.workMoneyGained / cancMult);
    
    this.updateSkillLevels();
    
    var txt = "";
    if (cancelled) {
        txt = "You worked a short shift of " + convertTimeMsToTimeElapsedString(this.timeWorked) + " <br><br> " +
              "Since you cancelled your work early, you only gained half of the experience, money, and reputation you earned. <br><br>" + 
              "You earned a total of: <br>" + 
              "$" + (this.workMoneyGained / cancMult).toFixed(2) + "<br>" + 
              (this.workRepGained / cancMult).toFixed(3) + " reputation for the company <br>" + 
              (this.workHackExpGained / cancMult).toFixed(3) + " hacking exp <br>" + 
              (this.workStrExpGained / cancMult).toFixed(3) + " strength exp <br>" + 
              (this.workDefExpGained / cancMult).toFixed(3) + " defense exp <br>" +
              (this.workDexExpGained / cancMult).toFixed(3) + " dexterity exp <br>" + 
              (this.workAgiExpGained / cancMult).toFixed(3) + " agility exp <br>" + 
              (this.workChaExpGained / cancMult).toFixed(3) + " charisma exp<br>";
              
    } else {
        txt = "You worked a full shift of 8 hours! <br><br> " +
              "You earned a total of: <br>" + 
              "$" + (this.workMoneyGained / cancMult) + "<br>" + 
              (this.workRepGained / cancMult).toFixed(3) + " reputation for the company <br>" + 
              (this.workHackExpGained / cancMult).toFixed(3) + " hacking exp <br>" + 
              (this.workStrExpGained / cancMult).toFixed(3) + " strength exp <br>" + 
              (this.workDefExpGained / cancMult).toFixed(3) + " defense exp <br>" +
              (this.workDexExpGained / cancMult).toFixed(3) + " dexterity exp <br>" + 
              (this.workAgiExpGained / cancMult).toFixed(3) + " agility exp <br>" + 
              (this.workChaExpGained / cancMult).toFixed(3) + " charisma exp <br>";
    }
    dialogBoxCreate(txt);
    
    var mainMenu = document.getElementById("mainmenu-container");
    mainMenu.style.visibility = "visible";
        
    this.isWorking = false;
    
    Engine.loadTerminalContent();
}

PlayerObject.prototype.startWork = function() {
    this.isWorking = true;
    this.workType = CONSTANTS.WorkTypeCompany;
    this.currentWorkFactionName = "";
    this.currentWorkFactionDescription = "";
    this.createProgramName = "";
    
    this.workHackExpGainRate    = this.getWorkHackExpGain();
    this.workStrExpGainRate     = this.getWorkStrExpGain();
    this.workDefExpGainRate     = this.getWorkDefExpGain();
    this.workDexExpGainRate     = this.getWorkDexExpGain();
    this.workAgiExpGainRate     = this.getWorkAgiExpGain();
    this.workChaExpGainRate     = this.getWorkChaExpGain();
    this.workRepGainRate        = this.getWorkRepGain();
    this.workMoneyGainRate      = this.getWorkMoneyGain();
    
    this.workHackExpGained = 0;
    this.workStrExpGained = 0;
    this.workDefExpGained = 0;
    this.workDexExpGained = 0;
    this.workAgiExpGained = 0;
    this.workChaExpGained = 0;
    this.workRepGained = 0;
    this.workMoneyGained = 0;
    
    this.timeWorked = 0;
    this.timeNeededToCompleteWork = CONSTANTS.MillisecondsPer8Hours;
    
    var cancelButton = document.getElementById("work-in-progress-cancel-button");
    
    //Remove all old event listeners from Cancel button
    var newCancelButton = cancelButton.cloneNode(true);
    cancelButton.parentNode.replaceChild(newCancelButton, cancelButton);
    
    newCancelButton.addEventListener("click", function() {
        Player.finishWork(true);
        return false;
    });
    
    //Display Work In Progress Screen
    Engine.loadWorkInProgressContent();
}
    
PlayerObject.prototype.work = function(numCycles) {
    this.workRepGainRate    = this.getWorkRepGain();
    
    this.workHackExpGained  += this.workHackExpGainRate * numCycles;
    this.workStrExpGained   += this.workStrExpGainRate * numCycles;
    this.workDefExpGained   += this.workDefExpGainRate * numCycles;
    this.workDexExpGained   += this.workDexExpGainRate * numCycles;
    this.workAgiExpGained   += this.workAgiExpGainRate * numCycles;
    this.workChaExpGained   += this.workChaExpGainRate * numCycles;
    this.workRepGained      += this.workRepGainRate * numCycles;
    this.workMoneyGained    += this.workMoneyGainRate * numCycles;
    
    var cyclesPerSec = 1000 / Engine._idleSpeed;
    
    this.timeWorked += Engine._idleSpeed * numCycles;
    
    //If timeWorked == 8 hours, then finish. You can only gain 8 hours worth of exp and money
    if (this.timeWorked >= CONSTANTS.MillisecondsPer8Hours) {
        var maxCycles = CONSTANTS.GameCyclesPer8Hours;
        this.workHackExpGained = this.workHackExpGainRate * maxCycles;
        this.workStrExpGained  = this.workStrExpGainRate * maxCycles;
        this.workDefExpGained  = this.workDefExpGainRate * maxCycles;
        this.workDexExpGained  = this.workDexExpGainRate * maxCycles;
        this.workAgiExpGained  = this.workAgiExpGainRate * maxCycles;
        this.workChaExpGained  = this.workChaExpGainRate * maxCycles;
        this.workRepGained     = this.workRepGainRate * maxCycles;
        this.workMoneyGained   = this.workMoneyGainRate * maxCycles;
        this.finishWork(false);
    }
    
    var txt = document.getElementById("work-in-progress-text");
    txt.innerHTML = "You are currently working as a " + this.companyPosition.positionName + 
                    " at " + Player.companyName + "<br><br>" + 
                    "You have been working for " + convertTimeMsToTimeElapsedString(this.timeWorked) + "<br><br>" +
                    "You have earned: <br><br>" + 
                    "$" + this.workMoneyGained.toFixed(2) + " ($" + (this.workMoneyGainRate * cyclesPerSec).toFixed(2) + " / sec) <br><br>" + 
                    this.workRepGained.toFixed(3) + " (" + (this.workRepGainRate * cyclesPerSec).toFixed(3) + " / sec) reputation for this company <br><br>" + 
                    this.workHackExpGained.toFixed(3) + " (" + (this.workHackExpGainRate * cyclesPerSec).toFixed(3) + " / sec) hacking exp <br><br>" + 
                    this.workStrExpGained.toFixed(3) + " (" + (this.workStrExpGainRate * cyclesPerSec).toFixed(3) + " / sec) strength exp <br>" + 
                    this.workDefExpGained.toFixed(3) + " (" + (this.workDefExpGainRate * cyclesPerSec).toFixed(3) + " / sec) defense exp <br>" + 
                    this.workDexExpGained.toFixed(3) + " (" + (this.workDexExpGainRate * cyclesPerSec).toFixed(3) + " / sec) dexterity exp <br>" + 
                    this.workAgiExpGained.toFixed(3) + " (" + (this.workAgiExpGainRate * cyclesPerSec).toFixed(3) + " / sec) agility exp <br><br> " +
                    this.workChaExpGained.toFixed(3) + " (" + (this.workChaExpGainRate * cyclesPerSec).toFixed(3) + " / sec) charisma exp <br><br>" + 
                    
                    
                    "You will automatically finish after working for 8 hours. You can cancel earlier if you wish, <br>" + 
                    "but you will only gain half of the experience, money, and reputation you've earned so far."
                    
}

/* Working for Faction */
PlayerObject.prototype.finishFactionWork = function(cancelled, faction) {
    this.gainHackingExp(this.workHackExpGained);
    this.gainStrengthExp(this.workStrExpGained);
    this.gainDefenseExp(this.workDefExpGained);
    this.gainDexterityExp(this.workDexExpGained);
    this.gainAgilityExp(this.workAgiExpGained);
    this.gainCharismaExp(this.workChaExpGained);
    
    var faction = Factions[this.currentWorkFactionName];
    faction.playerReputation += (this.workRepGained);
    
    this.gainMoney(this.workMoneyGained);
    
    this.updateSkillLevels();
    
    var txt = "You worked for your faction " + faction.name + " for a total of " + convertTimeMsToTimeElapsedString(this.timeWorked) + " <br><br> " +
              "You earned a total of: <br>" + 
              "$" + (this.workMoneyGained).toFixed(2) + "<br>" + 
              (this.workRepGained).toFixed(3) + " reputation for the faction <br>" + 
              (this.workHackExpGained).toFixed(3) + " hacking exp <br>" + 
              (this.workStrExpGained).toFixed(3) + " strength exp <br>" + 
              (this.workDefExpGained).toFixed(3) + " defense exp <br>" +
              (this.workDexExpGained).toFixed(3) + " dexterity exp <br>" + 
              (this.workAgiExpGained).toFixed(3) + " agility exp <br>" + 
              (this.workChaExpGained).toFixed(3) + " charisma exp<br>";
    dialogBoxCreate(txt);
    
    var mainMenu = document.getElementById("mainmenu-container");
    mainMenu.style.visibility = "visible";
        
    this.isWorking = false;
    
    Engine.loadTerminalContent();
}

PlayerObject.prototype.startFactionWork = function(faction) {
    this.isWorking = true;
    this.workType = CONSTANTS.WorkTypeFaction;
    this.currentWorkFactionName = faction.name;
    this.createProgramName = "";
    
    this.workHackExpGained = 0;
    this.workStrExpGained = 0;
    this.workDefExpGained = 0;
    this.workDexExpGained = 0;
    this.workAgiExpGained = 0;
    this.workChaExpGained = 0;
    this.workRepGained = 0;
    this.workMoneyGained = 0;
    
    this.timeWorked = 0;
    this.timeNeededToCompleteWork = CONSTANTS.MillisecondsPer20Hours;
    
    var cancelButton = document.getElementById("work-in-progress-cancel-button");
    
    //Remove all old event listeners from Cancel button
    var newCancelButton = cancelButton.cloneNode(true);
    cancelButton.parentNode.replaceChild(newCancelButton, cancelButton);
    
    newCancelButton.addEventListener("click", function() {
        Player.finishFactionWork(true, faction);
        return false;
    });
    
    //Display Work In Progress Screen
    Engine.loadWorkInProgressContent();
}

PlayerObject.prototype.startFactionHackWork = function(faction) {
    this.workHackExpGainRate    = .02 * this.hacking_exp_mult;
    this.workStrExpGainRate     = 0;
    this.workDefExpGainRate     = 0;
    this.workDexExpGainRate     = 0;
    this.workAgiExpGainRate     = 0;
    this.workChaExpGainRate     = 0;
    this.workRepGainRate        = this.hacking_skill / CONSTANTS.MaxSkillLevel * this.faction_rep_mult;
    this.workMoneyGainRate      = 0;
    
    this.factionWorkType = CONSTANTS.FactionWorkHacking;
    this.currentWorkFactionDescription = "carrying out hacking contracts";
   
    this.startFactionWork(faction);
}

PlayerObject.prototype.startFactionFieldWork = function(faction) {
    this.workHackExpGainRate    = .05 * this.hacking_exp_mult;
    this.workStrExpGainRate     = .05 * this.strength_exp_mult;
    this.workDefExpGainRate     = .05 * this.defense_exp_mult;
    this.workDexExpGainRate     = .05 * this.dexterity_exp_mult;
    this.workAgiExpGainRate     = .05 * this.agility_exp_mult;
    this.workChaExpGainRate     = .05 * this.charisma_exp_mult;
    this.workRepGainRate        = this.getFactionFieldWorkRepGain();
    this.workMoneyGainRate      = 0;
    
    this.factionWorkType = CONSTANTS.factionWorkField;
    this.currentWorkFactionDescription = "carrying out field missions"
   
    this.startFactionWork(faction);
}

PlayerObject.prototype.startFactionSecurityWork = function(faction) {
    this.workHackExpGainRate    = .1 * this.hacking_exp_mult;
    this.workStrExpGainRate     = 0;
    this.workDefExpGainRate     = 0;
    this.workDexExpGainRate     = 0;
    this.workAgiExpGainRate     = 0;
    this.workChaExpGainRate     = 0;
    this.workRepGainRate        = this.getFactionSecurityWorkRepGain();
    this.workMoneyGainRate      = 0;
    
    this.factionWorkType = CONSTANTS.FactionWorkSecurity;
    this.currentWorkFactionDescription = "performing security detail"
   
    this.startFactionWork(faction);
}
    
PlayerObject.prototype.workForFaction = function(numCycles) {
    var faction = Factions[this.currentWorkFactionName];
    
    //Constantly update the rep gain rate
    switch (this.factionWorkType) {
        case CONSTANTS.FactionWorkHacking:
            this.workRepGainRate = this.hacking_skill / CONSTANTS.MaxSkillLevel * this.faction_rep_mult;
            break;
        case CONSTANTS.FactionWorkField:
            this.workRepGainRate = this.getFactionFieldWorkRepGain();
            break;
        case CONSTANTS.FactionWorkSecurity:
            this.workRepGainRate = this.getFactionSecurityWorkRepGain();
            break;
        default:
            break;
    }
    
    this.workHackExpGained  += this.workHackExpGainRate * numCycles;
    this.workStrExpGained   += this.workStrExpGainRate * numCycles;
    this.workDefExpGained   += this.workDefExpGainRate * numCycles;
    this.workDexExpGained   += this.workDexExpGainRate * numCycles;
    this.workAgiExpGained   += this.workAgiExpGainRate * numCycles;
    this.workChaExpGained   += this.workChaExpGainRate * numCycles;
    this.workRepGained      += this.workRepGainRate * numCycles;
    this.workMoneyGained    += this.workMoneyGainRate * numCycles;
    
    var cyclesPerSec = 1000 / Engine._idleSpeed;
    
    this.timeWorked += Engine._idleSpeed * numCycles;
    
    //If timeWorked == 20 hours, then finish. You can only work for the faction for 20 hours
    if (this.timeWorked >= CONSTANTS.MillisecondsPer20Hours) {
        var maxCycles = CONSTANTS.GameCyclesPer20Hours;
        this.workHackExpGained = this.workHackExpGainRate * maxCycles;
        this.workStrExpGained  = this.workStrExpGainRate * maxCycles;
        this.workDefExpGained  = this.workDefExpGainRate * maxCycles;
        this.workDexExpGained  = this.workDexExpGainRate * maxCycles;
        this.workAgiExpGained  = this.workAgiExpGainRate * maxCycles;
        this.workChaExpGained  = this.workChaExpGainRate * maxCycles;
        this.workRepGained     = this.workRepGainRate * maxCycles;
        this.workMoneyGained   = this.workMoneyGainRate * maxCycles;
        this.finishFactionWork(false, faction);
    }
    
    var txt = document.getElementById("work-in-progress-text");
    txt.innerHTML = "You are currently " + this.currentWorkFactionDescription + " for your faction " + faction.name + "." + 
                    "You have been doing this for " + convertTimeMsToTimeElapsedString(this.timeWorked) + "<br><br>" +
                    "You have earned: <br><br>" + 
                    "$" + this.workMoneyGained + " (" + (this.workMoneyGainRate * cyclesPerSec).toFixed(2) + " / sec) <br><br>" + 
                    this.workRepGained.toFixed(3) + " (" + (this.workRepGainRate * cyclesPerSec).toFixed(3) + " / sec) reputation for this faction <br><br>" + 
                    this.workHackExpGained.toFixed(3) + " (" + (this.workHackExpGainRate * cyclesPerSec).toFixed(3) + " / sec) hacking exp <br><br>" + 
                    this.workStrExpGained.toFixed(3) + " (" + (this.workStrExpGainRate * cyclesPerSec).toFixed(3) + " / sec) strength exp <br>" + 
                    this.workDefExpGained.toFixed(3) + " (" + (this.workDefExpGainRate * cyclesPerSec).toFixed(3) + " / sec) defense exp <br>" + 
                    this.workDexExpGained.toFixed(3) + " (" + (this.workDexExpGainRate * cyclesPerSec).toFixed(3) + " / sec) dexterity exp <br>" + 
                    this.workAgiExpGained.toFixed(3) + " (" + (this.workAgiExpGainRate * cyclesPerSec).toFixed(3) + " / sec) agility exp <br><br> " +
                    this.workChaExpGained.toFixed(3) + " (" + (this.workChaExpGainRate * cyclesPerSec).toFixed(3) + " / sec) charisma exp <br><br>" + 
                    
                    "You will automatically finish after working for 20 hours. You can cancel earlier if you wish.<br>" + 
                    "There is no penalty for cancelling earlier.";  
}


//Money gained per game cycle
PlayerObject.prototype.getWorkMoneyGain = function() {
    var company = Companies[this.companyName];
    return this.companyPosition.baseSalary * company.salaryMultiplier * this.work_money_mult;
}

//Hack exp gained per game cycle
PlayerObject.prototype.getWorkHackExpGain = function() {
    var company = Companies[this.companyName];
    return this.companyPosition.hackingExpGain * company.expMultiplier * this.hacking_exp_mult;
}

//Str exp gained per game cycle
PlayerObject.prototype.getWorkStrExpGain = function() {
    var company = Companies[this.companyName];
    return this.companyPosition.strengthExpGain * company.expMultiplier * this.strength_exp_mult;
}

//Def exp gained per game cycle
PlayerObject.prototype.getWorkDefExpGain = function() {
    var company = Companies[this.companyName];
    return this.companyPosition.defenseExpGain * company.expMultiplier * this.defense_exp_mult;
}

//Dex exp gained per game cycle
PlayerObject.prototype.getWorkDexExpGain = function() {
    var company = Companies[this.companyName];
    return this.companyPosition.dexterityExpGain * company.expMultiplier * this.dexterity_exp_mult;
}

//Agi exp gained per game cycle
PlayerObject.prototype.getWorkAgiExpGain = function() {
    var company = Companies[this.companyName];
    return this.companyPosition.agilityExpGain * company.expMultiplier * this.agility_exp_mult;
}

//Charisma exp gained per game cycle
PlayerObject.prototype.getWorkChaExpGain = function() {
    var company = Companies[this.companyName];
    return this.companyPosition.charismaExpGain * company.expMultiplier * this.charisma_exp_mult;
}

//Reputation gained per game cycle
PlayerObject.prototype.getWorkRepGain = function() {
    
    var jobPerformance = this.companyPosition.calculateJobPerformance(this.hacking_skill, this.strength,
                                                                      this.defense, this.dexterity,
                                                                      this.agility, this.charisma);
    return jobPerformance * this.company_rep_mult;                                                                    
}

PlayerObject.prototype.getFactionSecurityWorkRepGain = function() {
    var t = (this.hacking_skill  / CONSTANTS.MaxSkillLevel + 
            this.strength       / CONSTANTS.MaxSkillLevel + 
            this.defense        / CONSTANTS.MaxSkillLevel + 
            this.dexterity      / CONSTANTS.MaxSkillLevel + 
            this.agility        / CONSTANTS.MaxSkillLevel) / 5;
    return t * this.faction_rep_mult;
}

PlayerObject.prototype.getFactionFieldWorkRepGain = function() {
    var t = (this.hacking_skill  / CONSTANTS.MaxSkillLevel + 
            this.strength       / CONSTANTS.MaxSkillLevel + 
            this.defense        / CONSTANTS.MaxSkillLevel + 
            this.dexterity      / CONSTANTS.MaxSkillLevel + 
            this.agility        / CONSTANTS.MaxSkillLevel + 
            this.charisma       / CONSTANTS.MaxSkillLevel) / 6;
    return t * this.faction_rep_mult;
}

/* Creating a Program */
PlayerObject.prototype.startCreateProgramWork = function(programName, time) {
    this.isWorking = true;
    this.workType = CONSTANTS.WorkTypeCreateProgram;
    
    this.timeWorked = 0;
    this.timeNeededToCompleteWork = time;
    
    this.currentWorkFactionName = "";
    this.currentWorkFactionDescription = "";    
    this.createProgramName = programName;
    
    var cancelButton = document.getElementById("work-in-progress-cancel-button");
    
    //Remove all old event listeners from Cancel button
    var newCancelButton = cancelButton.cloneNode(true);
    cancelButton.parentNode.replaceChild(newCancelButton, cancelButton);
    
    newCancelButton.addEventListener("click", function() {
        Player.finishCreateProgramWork(true, programName);
        return false;
    });
    
    //Display Work In Progress Screen
    Engine.loadWorkInProgressContent();
}

PlayerObject.prototype.createProgramWork = function(numCycles) {
    this.timeWorked += Engine._idleSpeed * numCycles;
    var programName = this.createProgramName;
    
    if (this.timeWorked >= this.timeNeededToCompleteWork) {
        this.finishCreateProgramWork(false, programName);
    }
    
    var txt = document.getElementById("work-in-progress-text");
    txt.innerHTML = "You are currently working on coding " + programName + ".<br><br> " + 
                    "You have been working for " + convertTimeMsToTimeElapsedString(this.timeWorked) + "<br><br>" +
                    "The program is " + (this.timeWorked / this.timeNeededToCompleteWork * 100).toFixed(2) + "% complete. <br>" + 
                    "If you cancel, you will lose all of your progress.";  
}

PlayerObject.prototype.finishCreateProgramWork = function(cancelled, programName) {
    if (cancelled == false) {
        dialogBoxCreate("You've finished creating " + programName + "!<br>" + 
                        "The new program can be found on your home computer.");
    
        Player.getHomeComputer().programs.push(programName);
    }
    
    var mainMenu = document.getElementById("mainmenu-container");
    mainMenu.style.visibility = "visible";
        
    Player.isWorking = false;
    
    Engine.loadTerminalContent();
}

/* Studying/Taking Classes */
PlayerObject.prototype.startClass = function(costMult, expMult, className) {
    this.isWorking = true;
    this.workType = CONSTANTS.WorkTypeStudyClass;
    this.timeWorked = 0;
    
    this.className = className;
    
    this.workStrExpGainRate     = 0;
    this.workDefExpGainRate     = 0;
    this.workDexExpGainRate     = 0;
    this.workAgiExpGainRate     = 0;
    this.workRepGainRate        = 0;
    this.workMoneyGainRate      = 0;
    
    this.workHackExpGained = 0;
    this.workStrExpGained = 0;
    this.workDefExpGained = 0;
    this.workDexExpGained = 0;
    this.workAgiExpGained = 0;
    this.workChaExpGained = 0;
    this.workRepGained = 0;
    this.workMoneyGained = 0;
    
    var gameCPS = 1000 / Engine._idleSpeed;
    //Base costs/exp (per second)
    var baseDataStructuresCost = 1;
    var baseNetworksCost = 5;
    var baseAlgorithmsCost = 20;
    var baseManagementCost = 10;
    var baseLeadershipCost = 20;
    
    var baseStudyComputerScienceExp = 0.02;
    var baseDataStructuresExp       = 0.1;
    var baseNetworksExp             = 0.4;
    var baseAlgorithmsExp           = 1.5;
    var baseManagementExp           = 0.8;
    var baseLeadershipExp           = 1.5;
    
    //Find cost and exp gain per game cycle
    var cost = 0; 
    var hackExp = 0;
    var chaExp = 0;
    switch (className) {
        case CONSTANTS.ClassStudyComputerScience:
            hackExp = baseStudyComputerScienceExp * expMult / gameCPS;
            break;
        case CONSTANTS.ClassDataStructures:
            cost = baseDataStructuresCost * costMult / gameCPS;
            hackExp = baseDataStructuresExp * expMult / gameCPS;
            break;
        case CONSTANTS.ClassNetworks:
            cost = baseNetworksCost * costMult / gameCPS; 
            hackExp = baseNetworksExp * expMult / gameCPS;
            break;
        case CONSTANTS.ClassAlgorithms:
            cost = baseAlgorithmsCost * costMult / gameCPS;
            hackExp = baseAlgorithmsExp * expMult / gameCPS;
            break;
        case CONSTANTS.ClassManagement:
            cost = baseManagementCost * costMult / gameCPS;
            chaExp = baseManagementExp * expMult / gameCPS;
            break;
        case CONSTANTS.ClassLeadership:
            cost = baseLeadershipCost * costMult / gameCPS;
            chaExp = baseLeadershipExp * expMult / gameCPS;
            break;
        default:
            throw new Error("ERR: Invalid/unregocnized class name");
            return;
    }
    
    this.workMoneyLossRate      = cost;
    this.workHackExpGainRate    = hackExp * this.hacking_exp_mult;
    this.workChaExpGainRate     = chaExp * this.charisma_exp_mult;
    
    var cancelButton = document.getElementById("work-in-progress-cancel-button");
    
    //Remove all old event listeners from Cancel button
    var newCancelButton = cancelButton.cloneNode(true);
    cancelButton.parentNode.replaceChild(newCancelButton, cancelButton);
    
    newCancelButton.addEventListener("click", function() {
        Player.finishClass();
        return false;
    });
    
    //Display Work In Progress Screen
    Engine.loadWorkInProgressContent();
}

PlayerObject.prototype.takeClass = function(numCycles) {
    this.timeWorked += Engine._idleSpeed * numCycles;
    var className = this.className;
    
    this.workHackExpGained  += this.workHackExpGainRate * numCycles;
    this.workStrExpGained   += this.workStrExpGainRate * numCycles;
    this.workDefExpGained   += this.workDefExpGainRate * numCycles;
    this.workDexExpGained   += this.workDexExpGainRate * numCycles;
    this.workAgiExpGained   += this.workAgiExpGainRate * numCycles;
    this.workChaExpGained   += this.workChaExpGainRate * numCycles;
    this.workRepGained      += this.workRepGainRate * numCycles;
    this.workMoneyGained    += this.workMoneyGainRate * numCycles;
    this.workMoneyGained    -= this.workMoneyLossRate * numCycles;
    
    var cyclesPerSec = 1000 / Engine._idleSpeed;
    
    //TODO Account for running out of money when numCycles is very big
    
    var txt = document.getElementById("work-in-progress-text");
    txt.innerHTML = "You have been " + className + " for " + convertTimeMsToTimeElapsedString(this.timeWorked) + ".<br><br>" +
                    "This has cost you: <br>" + 
                    "$" + this.workMoneyGained.toFixed(2) + " ($" + (this.workMoneyLossRate * cyclesPerSec).toFixed(2) + " / sec) <br><br>" + 
                    "You have gained: <br>" + 
                    this.workHackExpGained.toFixed(3) + " (" + (this.workHackExpGainRate * cyclesPerSec).toFixed(3) + " / sec) hacking exp <br>" + 
                    this.workStrExpGained.toFixed(3) + " (" + (this.workStrExpGainRate * cyclesPerSec).toFixed(3) + " / sec) strength exp <br>" + 
                    this.workDefExpGained.toFixed(3) + " (" + (this.workDefExpGainRate * cyclesPerSec).toFixed(3) + " / sec) defense exp <br>" + 
                    this.workDexExpGained.toFixed(3) + " (" + (this.workDexExpGainRate * cyclesPerSec).toFixed(3) + " / sec) dexterity exp <br>" + 
                    this.workAgiExpGained.toFixed(3) + " (" + (this.workAgiExpGainRate * cyclesPerSec).toFixed(3) + " / sec) agility exp <br>" +
                    this.workChaExpGained.toFixed(3) + " (" + (this.workChaExpGainRate * cyclesPerSec).toFixed(3) + " / sec) charisma exp <br>" + 
                    "You may cancel at any time";
                    
}

PlayerObject.prototype.finishClass = function() {
    this.gainHackingExp(this.workHackExpGained);
    this.gainStrengthExp(this.workStrExpGained);
    this.gainDefenseExp(this.workDefExpGained);
    this.gainDexterityExp(this.workDexExpGained);
    this.gainAgilityExp(this.workAgiExpGained);
    this.gainCharismaExp(this.workChaExpGained);
    
    if (this.workMoneyGained > 0) {
        throw new Error("ERR: Somehow gained money while taking class");
    }
    this.loseMoney(this.workMoneyGained * -1);
    
    this.updateSkillLevels();
    var txt = "After " + this.className + " for " + convertTimeMsToTimeElapsedString(this.timeWorked) + ", <br>" +
              "you spent a total of $" + this.workMoneyGained * -1 + ". <br><br>" + 
              "You earned a total of: <br>" + 
              (this.workHackExpGained).toFixed(3) + " hacking exp <br>" + 
              (this.workStrExpGained).toFixed(3) + " strength exp <br>" + 
              (this.workDefExpGained).toFixed(3) + " defense exp <br>" +
              (this.workDexExpGained).toFixed(3) + " dexterity exp <br>" + 
              (this.workAgiExpGained).toFixed(3) + " agility exp <br>" + 
              (this.workChaExpGained).toFixed(3) + " charisma exp<br>";

    dialogBoxCreate(txt);
    
    var mainMenu = document.getElementById("mainmenu-container");
    mainMenu.style.visibility = "visible";
        
    this.isWorking = false;
    
    Engine.loadTerminalContent();
}

/* Functions for saving and loading the Player data */
PlayerObject.prototype.toJSON = function() {
    return Generic_toJSON("PlayerObject", this);
}

PlayerObject.fromJSON = function(value) {
    return Generic_fromJSON(PlayerObject, value.data);
} 

Reviver.constructors.PlayerObject = PlayerObject;

Player = new PlayerObject();

    
    
