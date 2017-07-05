//Netburner Player class
function PlayerObject() {
    //Skills and stats
    this.hacking_skill   = 1;
                     
    //Fighting
    this.hp              = 10;
    this.max_hp          = 10;
    this.strength        = 1;      //Damage dealt
    this.defense         = 1;      //Damage received
    this.dexterity       = 1;      //Accuracy
    this.agility         = 1;      //Dodge %
    
    //Labor stats
    this.charisma        = 1;
	//Intelligence, perhaps?
    
    //Hacking multipliers
    this.hacking_chance_mult    = 1;  //Increase through ascensions/augmentations
    this.hacking_speed_mult     = 1;  //Decrease through ascensions/augmentations
    this.hacking_money_mult     = 1;  //Increase through ascensions/augmentations. Can't go above 1
    this.hacking_grow_mult      = 1;
    
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
    this.total_money     = 0;   //Total money ever earned in this "simulation"
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
    this.currentServer          = ""; //IP address of Server currently being accessed through terminal
    this.discoveredServers      = []; //IP addresses of secret servers not in the network that you have discovered
    this.purchasedServers       = [];
    this.hacknetNodes           = [];
    this.totalHacknetNodeProduction = 0; 
    
    //Factions
    this.factions = []; //Names of all factions player has joined
    
    //Augmentations
    this.queuedAugmentations = []; //Purchased but not installed, names only
    this.augmentations = []; //Names of all installed augmentations
    
    //Crime statistics (Total refers to this 'simulation'. Lifetime is forever)
    this.karma = 0;
    this.numTimesShoplifted             = 0;
    this.numTimesShopliftedTotal        = 0;
    this.numTimesShopliftedLifetime     = 0;
    this.numPeopleMugged                = 0;
    this.numPeopleMuggedTotal           = 0;
    this.numPeopleMuggedLifetime        = 0;
    this.numTimesDealtDrugs             = 0;
    this.numTimesDealtDrugsTotal        = 0;
    this.numTimesDealtDrugsLifetime     = 0;
    this.numTimesTraffickArms           = 0;
    this.numTimesTraffickArmsTotal      = 0;
    this.numTimesTraffickArmsLifetime  = 0;
    this.numPeopleKilled                = 0;
    this.numPeopleKilledTotal           = 0;
    this.numPeopleKilledLifetime        = 0;
    this.numTimesGrandTheftAuto         = 0;
    this.numTimesGrandTheftAutoTotal    = 0;
    this.numTimesGrandTheftAutoLifetime = 0;
    this.numTimesKidnapped              = 0;
    this.numTimesKidnappedTotal         = 0;
    this.numTimesKidnappedLifetime      = 0;
    this.numTimesHeist                  = 0;
    this.numTimesHeistTotal             = 0;
    this.numTimesHeistLifetime          = 0;
    
    this.crime_money_mult               = 1;
    this.crime_success_mult             = 1;
    
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
    
    this.crimeType = "";
    
    this.timeWorked = 0;    //in ms
    this.timeNeededToCompleteWork = 0;
    
    this.work_money_mult = 1;
    
    //Hacknet Node multipliers
    this.hacknet_node_money_mult            = 1;
    this.hacknet_node_purchase_cost_mult    = 1;
    this.hacknet_node_ram_cost_mult         = 1;
    this.hacknet_node_core_cost_mult        = 1;
    this.hacknet_node_level_cost_mult       = 1;
    
    //Stock Market
    this.hasWseAccount      = false;
    this.hasTixApiAccess    = false;
	
	//Used to store the last update time. 
	this.lastUpdate = 0;
    this.totalPlaytime = 0;
    this.playtimeSinceLastAug = 0;
};

PlayerObject.prototype.init = function() {
    /* Initialize Player's home computer */
    var t_homeComp = new Server();
    t_homeComp.init(createRandomIp(), "home", "Home PC", true, true, true, true, 8);
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
	this.hacking_skill = Math.floor(this.calculateSkill(this.hacking_exp) * this.hacking_mult);
	this.strength      = Math.floor(this.calculateSkill(this.strength_exp) * this.strength_mult);
    this.defense       = Math.floor(this.calculateSkill(this.defense_exp) * this.defense_mult);
    this.dexterity     = Math.floor(this.calculateSkill(this.dexterity_exp) * this.dexterity_mult);
    this.agility       = Math.floor(this.calculateSkill(this.agility_exp) * this.agility_mult);
    this.charisma      = Math.floor(this.calculateSkill(this.charisma_exp) * this.charisma_mult);
    
    var ratio = this.hp / this.max_hp;
    this.max_hp         = Math.floor(10 + this.defense / 10);
    Player.hp = Math.round(this.max_hp * ratio);
}

//Calculates the chance of hacking a server
//The formula is:
//  (2 * hacking_chance_multiplier * hacking_skill - requiredLevel)      100 - difficulty       
//  -----------------------------------------------------------  *  -----------------
//        (2 * hacking_chance_multiplier * hacking_skill)                      100
PlayerObject.prototype.calculateHackingChance = function() {
    var difficultyMult = (100 - this.getCurrentServer().hackDifficulty) / 100;
    var skillMult = (2 * this.hacking_chance_mult * this.hacking_skill);
    var skillChance = (skillMult - this.getCurrentServer().requiredHackingSkill) / skillMult;
    var chance = skillChance * difficultyMult;
    if (chance > 1) {return 1;}
    if (chance < 0) {return 0;} 
    return chance;
}

//Calculate the time it takes to hack a server in seconds. Returns the time
//The formula is:
// (2.5 * requiredLevel * difficulty + 200)          
//  -----------------------------------  *  hacking_speed_multiplier
//        hacking_skill + 100                           
PlayerObject.prototype.calculateHackingTime = function() {
    var difficultyMult = this.getCurrentServer().requiredHackingSkill * this.getCurrentServer().hackDifficulty;
    var skillFactor = (2.5 * difficultyMult + 200) / (this.hacking_skill + 100);
    return 5 * skillFactor / this.hacking_speed_mult;
}

//Calculates the PERCENTAGE of a server's money that the player will hack from the server if successful
//The formula is:
//  (hacking_skill - (requiredLevel-1))      100 - difficulty       
//  --------------------------------------* -----------------------  *  hacking_money_multiplier
//         hacking_skill                        100
PlayerObject.prototype.calculatePercentMoneyHacked = function() {
    var difficultyMult = (100 - this.getCurrentServer().hackDifficulty) / 100;
    var skillMult = (this.hacking_skill - (this.getCurrentServer().requiredHackingSkill - 1)) / this.hacking_skill;
    var percentMoneyHacked = difficultyMult * skillMult * this.hacking_money_mult / 225;
    console.log("Percent money hacked calculated to be: " + percentMoneyHacked);
    if (percentMoneyHacked < 0) {return 0;}
    if (percentMoneyHacked > 1) {return 1;}
    return percentMoneyHacked;
}

//Returns how much EXP the player gains on a successful hack
//The formula is:
//  difficulty * requiredLevel * hacking_multiplier
PlayerObject.prototype.calculateExpGain = function() {
    var s = this.getCurrentServer();
    if (s.baseDifficulty == null) {
        s.baseDifficulty = s.hackDifficulty;
    }
    return (s.baseDifficulty * this.hacking_exp_mult * 0.4 + 2);
}

//Hack/Analyze a server. Return the amount of time the hack will take. This lets the Terminal object know how long to disable itself for
//This assumes that the server being hacked is not purchased by the player, that the player's hacking skill is greater than the
//required hacking skill and that the player has admin rights.
PlayerObject.prototype.hack = function() {
    this.actionTime = this.calculateHackingTime();
    console.log("Hacking time: " + this.actionTime);
    this.startAction = true; //Set the startAction flag so the engine starts the hacking process
}

PlayerObject.prototype.analyze = function() {
    this.actionTime = 1;
    this.startAction = true;
}

PlayerObject.prototype.hasProgram = function(programName) {
    var home = Player.getHomeComputer();
    for (var i = 0; i < home.programs.length; ++i) {
        if (programName.toLowerCase() == home.programs[i].toLowerCase()) {return true;}
    }
    return false;
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

/******* Working functions *******/
PlayerObject.prototype.resetWorkStatus = function() {
    this.workHackExpGainRate    = 0;
    this.workStrExpGainRate     = 0;
    this.workDefExpGainRate     = 0;
    this.workDexExpGainRate     = 0;
    this.workAgiExpGainRate     = 0;
    this.workChaExpGainRate     = 0;
    this.workRepGainRate        = 0;
    this.workMoneyGainRate      = 0;
    
    this.workHackExpGained  = 0;
    this.workStrExpGained   = 0;
    this.workDefExpGained   = 0;
    this.workDexExpGained   = 0;
    this.workAgiExpGained   = 0;
    this.workChaExpGained   = 0;
    this.workRepGained      = 0;
    this.workMoneyGained    = 0;
    
    this.timeWorked = 0;
    
    this.currentWorkFactionName = "";
    this.currentWorkFactionDescription = "";
    this.createProgramName = "";
    this.className = "";
    
    document.getElementById("work-in-progress-text").innerHTML = "";
}

PlayerObject.prototype.gainWorkExp = function() {
    this.gainHackingExp(this.workHackExpGained);
    this.gainStrengthExp(this.workStrExpGained);
    this.gainDefenseExp(this.workDefExpGained);
    this.gainDexterityExp(this.workDexExpGained);
    this.gainAgilityExp(this.workAgiExpGained);
    this.gainCharismaExp(this.workChaExpGained);
}

/* Working for Company */
PlayerObject.prototype.finishWork = function(cancelled) {
    //Since the work was cancelled early, player only gains half of what they've earned so far
    if (cancelled) {
        this.workRepGained /= 2;
    }

    this.gainWorkExp();
    
    var company = Companies[this.companyName];
    company.playerReputation += (this.workRepGained);
    
    this.gainMoney(this.workMoneyGained);
    
    this.updateSkillLevels();
    
    var txt = "You earned a total of: <br>" + 
              "$" + formatNumber(this.workMoneyGained, 2) + "<br>" + 
              formatNumber(this.workRepGained, 4) + " reputation for the company <br>" + 
              formatNumber(this.workHackExpGained, 4) + " hacking exp <br>" + 
              formatNumber(this.workStrExpGained, 4) + " strength exp <br>" + 
              formatNumber(this.workDefExpGained, 4) + " defense exp <br>" +
              formatNumber(this.workDexExpGained, 4) + " dexterity exp <br>" + 
              formatNumber(this.workAgiExpGained, 4) + " agility exp <br>" + 
              formatNumber(this.workChaExpGained, 4) + " charisma exp<br>";
              
    if (cancelled) {
        txt = "You worked a short shift of " + convertTimeMsToTimeElapsedString(this.timeWorked) + " <br><br> " +
              "Since you cancelled your work early, you only gained half of the reputation you earned. <br><br>" + txt;  
    } else {
        txt = "You worked a full shift of 8 hours! <br><br> " +
              "You earned a total of: <br>" + txt;
    }
    dialogBoxCreate(txt);
    
    var mainMenu = document.getElementById("mainmenu-container");
    mainMenu.style.visibility = "visible";
    this.isWorking = false;
    Engine.loadTerminalContent();
}

PlayerObject.prototype.startWork = function() {
    this.resetWorkStatus();
    this.isWorking = true;
    this.workType = CONSTANTS.WorkTypeCompany;
    
    this.workHackExpGainRate    = this.getWorkHackExpGain();
    this.workStrExpGainRate     = this.getWorkStrExpGain();
    this.workDefExpGainRate     = this.getWorkDefExpGain();
    this.workDexExpGainRate     = this.getWorkDexExpGain();
    this.workAgiExpGainRate     = this.getWorkAgiExpGain();
    this.workChaExpGainRate     = this.getWorkChaExpGain();
    this.workRepGainRate        = this.getWorkRepGain();
    this.workMoneyGainRate      = this.getWorkMoneyGain();
    
    this.timeNeededToCompleteWork = CONSTANTS.MillisecondsPer8Hours;
    
    //Remove all old event listeners from Cancel button
    var newCancelButton = clearEventListeners("work-in-progress-cancel-button");
    newCancelButton.innerHTML = "Cancel Work";
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
        return;
    }
    
    var txt = document.getElementById("work-in-progress-text");
    txt.innerHTML = "You are currently working as a " + this.companyPosition.positionName + 
                    " at " + Player.companyName + "<br><br>" + 
                    "You have been working for " + convertTimeMsToTimeElapsedString(this.timeWorked) + "<br><br>" +
                    "You have earned: <br><br>" + 
                    "$" + formatNumber(this.workMoneyGained, 2) + " ($" + formatNumber(this.workMoneyGainRate * cyclesPerSec, 2) + " / sec) <br><br>" + 
                    formatNumber(this.workRepGained, 4) + " (" + formatNumber(this.workRepGainRate * cyclesPerSec, 4) + " / sec) reputation for this company <br><br>" + 
                    formatNumber(this.workHackExpGained, 4) + " (" + formatNumber(this.workHackExpGainRate * cyclesPerSec, 4) + " / sec) hacking exp <br><br>" + 
                    formatNumber(this.workStrExpGained, 4) + " (" + formatNumber(this.workStrExpGainRate * cyclesPerSec, 4) + " / sec) strength exp <br>" + 
                    formatNumber(this.workDefExpGained, 4) + " (" + formatNumber(this.workDefExpGainRate * cyclesPerSec, 4) + " / sec) defense exp <br>" + 
                    formatNumber(this.workDexExpGained, 4) + " (" + formatNumber(this.workDexExpGainRate * cyclesPerSec, 4) + " / sec) dexterity exp <br>" + 
                    formatNumber(this.workAgiExpGained, 4) + " (" + formatNumber(this.workAgiExpGainRate * cyclesPerSec, 4) + " / sec) agility exp <br><br> " +
                    formatNumber(this.workChaExpGained, 4) + " (" + formatNumber(this.workChaExpGainRate * cyclesPerSec, 4) + " / sec) charisma exp <br><br>" + 
                    "You will automatically finish after working for 8 hours. You can cancel earlier if you wish, " + 
                    "but you will only gain half of the reputation you've earned so far."
                    
}

PlayerObject.prototype.startWorkPartTime = function() {
    this.resetWorkStatus();
    this.isWorking = true;
    this.workType = CONSTANTS.WorkTypeCompanyPartTime;
    
    this.workHackExpGainRate    = this.getWorkHackExpGain();
    this.workStrExpGainRate     = this.getWorkStrExpGain();
    this.workDefExpGainRate     = this.getWorkDefExpGain();
    this.workDexExpGainRate     = this.getWorkDexExpGain();
    this.workAgiExpGainRate     = this.getWorkAgiExpGain();
    this.workChaExpGainRate     = this.getWorkChaExpGain();
    this.workRepGainRate        = this.getWorkRepGain();
    this.workMoneyGainRate      = this.getWorkMoneyGain();
    
    this.timeNeededToCompleteWork = CONSTANTS.MillisecondsPer8Hours;
    
    var newCancelButton = clearEventListeners("work-in-progress-cancel-button");
    newCancelButton.innerHTML = "Stop Working";
    newCancelButton.addEventListener("click", function() {
        Player.finishWorkPartTime();
        return false;
    });
    
    //Display Work In Progress Screen
    Engine.loadWorkInProgressContent();
}

PlayerObject.prototype.workPartTime = function(numCycles) {
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
        this.finishWorkPartTime();
        return;
    }
    
    var txt = document.getElementById("work-in-progress-text");
    txt.innerHTML = "You are currently working as a " + this.companyPosition.positionName + 
                    " at " + Player.companyName + "<br><br>" + 
                    "You have been working for " + convertTimeMsToTimeElapsedString(this.timeWorked) + "<br><br>" +
                    "You have earned: <br><br>" + 
                    "$" + formatNumber(this.workMoneyGained, 2) + " ($" + formatNumber(this.workMoneyGainRate * cyclesPerSec, 2) + " / sec) <br><br>" + 
                    formatNumber(this.workRepGained, 4) + " (" + formatNumber(this.workRepGainRate * cyclesPerSec, 4) + " / sec) reputation for this company <br><br>" + 
                    formatNumber(this.workHackExpGained, 4) + " (" + formatNumber(this.workHackExpGainRate * cyclesPerSec, 4) + " / sec) hacking exp <br><br>" + 
                    formatNumber(this.workStrExpGained, 4) + " (" + formatNumber(this.workStrExpGainRate * cyclesPerSec, 4) + " / sec) strength exp <br>" + 
                    formatNumber(this.workDefExpGained, 4) + " (" + formatNumber(this.workDefExpGainRate * cyclesPerSec, 4) + " / sec) defense exp <br>" + 
                    formatNumber(this.workDexExpGained, 4) + " (" + formatNumber(this.workDexExpGainRate * cyclesPerSec, 4) + " / sec) dexterity exp <br>" + 
                    formatNumber(this.workAgiExpGained, 4) + " (" + formatNumber(this.workAgiExpGainRate * cyclesPerSec, 4) + " / sec) agility exp <br><br> " +
                    formatNumber(this.workChaExpGained, 4) + " (" + formatNumber(this.workChaExpGainRate * cyclesPerSec, 4) + " / sec) charisma exp <br><br>" + 
                    "You will automatically finish after working for 8 hours. You can cancel earlier if you wish, <br>" + 
                    "and there will be no penalty because this is a part-time job.";
                    
}

PlayerObject.prototype.finishWorkPartTime = function() {
    this.gainWorkExp();
    
    var company = Companies[this.companyName];
    company.playerReputation += (this.workRepGained);
    
    this.gainMoney(this.workMoneyGained);
    
    this.updateSkillLevels();
    
    var txt = "You earned a total of: <br>" + 
              "$" + formatNumber(this.workMoneyGained, 2) + "<br>" + 
              formatNumber(this.workRepGained, 4) + " reputation for the company <br>" + 
              formatNumber(this.workHackExpGained, 4) + " hacking exp <br>" + 
              formatNumber(this.workStrExpGained, 4) + " strength exp <br>" + 
              formatNumber(this.workDefExpGained, 4) + " defense exp <br>" +
              formatNumber(this.workDexExpGained, 4) + " dexterity exp <br>" + 
              formatNumber(this.workAgiExpGained, 4) + " agility exp <br>" + 
              formatNumber(this.workChaExpGained, 4) + " charisma exp<br>";
    txt = "You worked for " + convertTimeMsToTimeElapsedString(this.timeWorked) + "<br><br> " + txt;
    dialogBoxCreate(txt);
    
    var mainMenu = document.getElementById("mainmenu-container");
    mainMenu.style.visibility = "visible";
    this.isWorking = false;
    Engine.loadTerminalContent();
}

/* Working for Faction */
PlayerObject.prototype.finishFactionWork = function(cancelled, faction) {
    this.gainWorkExp();
    
    var faction = Factions[this.currentWorkFactionName];
    faction.playerReputation += (this.workRepGained);
    
    this.gainMoney(this.workMoneyGained);
    
    this.updateSkillLevels();
    
    var txt = "You worked for your faction " + faction.name + " for a total of " + convertTimeMsToTimeElapsedString(this.timeWorked) + " <br><br> " +
              "You earned a total of: <br>" + 
              "$" + formatNumber(this.workMoneyGained, 2) + "<br>" + 
              formatNumber(this.workRepGained, 4) + " reputation for the faction <br>" + 
              formatNumber(this.workHackExpGained, 4) + " hacking exp <br>" + 
              formatNumber(this.workStrExpGained, 4) + " strength exp <br>" + 
              formatNumber(this.workDefExpGained, 4) + " defense exp <br>" +
              formatNumber(this.workDexExpGained, 4) + " dexterity exp <br>" + 
              formatNumber(this.workAgiExpGained, 4) + " agility exp <br>" + 
              formatNumber(this.workChaExpGained, 4) + " charisma exp<br>";
    dialogBoxCreate(txt);
    
    var mainMenu = document.getElementById("mainmenu-container");
    mainMenu.style.visibility = "visible";
        
    this.isWorking = false;
    
    Engine.loadTerminalContent();
}

PlayerObject.prototype.startFactionWork = function(faction) {
    //Update reputation gain rate to account for faction favor
    var favorMult = 1 + (faction.favor / 100);
    if (isNaN(favorMult)) {favorMult = 1;}
    this.workRepGainRate *= favorMult;
    
    this.isWorking = true;
    this.workType = CONSTANTS.WorkTypeFaction;
    this.currentWorkFactionName = faction.name;
    
    this.timeNeededToCompleteWork = CONSTANTS.MillisecondsPer20Hours;
    
    var cancelButton = clearEventListeners("work-in-progress-cancel-button");  
    cancelButton.innerHTML = "Stop Faction Work";
    cancelButton.addEventListener("click", function() {
        Player.finishFactionWork(true, faction);
        return false;
    });
    
    //Display Work In Progress Screen
    Engine.loadWorkInProgressContent();
}

PlayerObject.prototype.startFactionHackWork = function(faction) {
    this.resetWorkStatus();
    
    this.workHackExpGainRate    = .15 * this.hacking_exp_mult;
    this.workRepGainRate = 0.9 * this.hacking_skill / CONSTANTS.MaxSkillLevel * this.faction_rep_mult;
    
    this.factionWorkType = CONSTANTS.FactionWorkHacking;
    this.currentWorkFactionDescription = "carrying out hacking contracts";
   
    this.startFactionWork(faction);
}

PlayerObject.prototype.startFactionFieldWork = function(faction) {
    this.resetWorkStatus();
    
    this.workHackExpGainRate    = .1 * this.hacking_exp_mult;
    this.workStrExpGainRate     = .1 * this.strength_exp_mult;
    this.workDefExpGainRate     = .1 * this.defense_exp_mult;
    this.workDexExpGainRate     = .1 * this.dexterity_exp_mult;
    this.workAgiExpGainRate     = .1 * this.agility_exp_mult;
    this.workChaExpGainRate     = .1 * this.charisma_exp_mult;
    this.workRepGainRate        = this.getFactionFieldWorkRepGain();
    
    this.factionWorkType = CONSTANTS.FactionWorkField;
    this.currentWorkFactionDescription = "carrying out field missions"
   
    this.startFactionWork(faction);
}

PlayerObject.prototype.startFactionSecurityWork = function(faction) {
    this.resetWorkStatus();

    this.workHackExpGainRate    = 0.05 * this.hacking_exp_mult;
    this.workStrExpGainRate     = 0.15 * this.strength_exp_mult;
    this.workDefExpGainRate     = 0.15 * this.defense_exp_mult;
    this.workDexExpGainRate     = 0.15 * this.dexterity_exp_mult;
    this.workAgiExpGainRate     = 0.15 * this.agility_exp_mult;
    this.workChaExpGainRate     = 0.00 * this.charisma_exp_mult;
    this.workRepGainRate        = this.getFactionSecurityWorkRepGain();
    
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
    
    //Update reputation gain rate to account for faction favor
    var favorMult = 1 + (faction.favor / 100);
    if (isNaN(favorMult)) {favorMult = 1;}
    this.workRepGainRate *= favorMult;
    
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
                    "  You have been doing this for " + convertTimeMsToTimeElapsedString(this.timeWorked) + "<br><br>" +
                    "You have earned: <br><br>" + 
                    "$" + formatNumber(this.workMoneyGained, 2) + " (" + formatNumber(this.workMoneyGainRate * cyclesPerSec, 2) + " / sec) <br><br>" + 
                    formatNumber(this.workRepGained, 4) + " (" + formatNumber(this.workRepGainRate * cyclesPerSec, 4) + " / sec) reputation for this faction <br><br>" + 
                    formatNumber(this.workHackExpGained, 4) + " (" + formatNumber(this.workHackExpGainRate * cyclesPerSec, 4) + " / sec) hacking exp <br><br>" + 
                    formatNumber(this.workStrExpGained, 4) + " (" + formatNumber(this.workStrExpGainRate * cyclesPerSec, 4) + " / sec) strength exp <br>" + 
                    formatNumber(this.workDefExpGained, 4) + " (" + formatNumber(this.workDefExpGainRate * cyclesPerSec, 4) + " / sec) defense exp <br>" + 
                    formatNumber(this.workDexExpGained, 4) + " (" + formatNumber(this.workDexExpGainRate * cyclesPerSec, 4) + " / sec) dexterity exp <br>" + 
                    formatNumber(this.workAgiExpGained, 4) + " (" + formatNumber(this.workAgiExpGainRate * cyclesPerSec, 4) + " / sec) agility exp <br><br> " +
                    formatNumber(this.workChaExpGained, 4) + " (" + formatNumber(this.workChaExpGainRate * cyclesPerSec, 4) + " / sec) charisma exp <br><br>" + 
                    
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
    var company = Companies[this.companyName];
    var jobPerformance = this.companyPosition.calculateJobPerformance(this.hacking_skill, this.strength,
                                                                      this.defense, this.dexterity,
                                                                      this.agility, this.charisma);    
    //Update reputation gain rate to account for company favor
    var favorMult = 1 + (company.favor / 100);
    if (isNaN(favorMult)) {favorMult = 1;}
    return jobPerformance * this.company_rep_mult * favorMult;                                                                    
}

PlayerObject.prototype.getFactionSecurityWorkRepGain = function() {
    var t = 0.9 * (this.hacking_skill  / CONSTANTS.MaxSkillLevel + 
                   this.strength       / CONSTANTS.MaxSkillLevel + 
                   this.defense        / CONSTANTS.MaxSkillLevel + 
                   this.dexterity      / CONSTANTS.MaxSkillLevel + 
                   this.agility        / CONSTANTS.MaxSkillLevel) / 5;
    return t * this.faction_rep_mult;
}

PlayerObject.prototype.getFactionFieldWorkRepGain = function() {
    var t = 0.9 * (this.hacking_skill  / CONSTANTS.MaxSkillLevel + 
                   this.strength       / CONSTANTS.MaxSkillLevel + 
                   this.defense        / CONSTANTS.MaxSkillLevel + 
                   this.dexterity      / CONSTANTS.MaxSkillLevel + 
                   this.agility        / CONSTANTS.MaxSkillLevel + 
                   this.charisma       / CONSTANTS.MaxSkillLevel) / 6;
    return t * this.faction_rep_mult;
}

/* Creating a Program */
PlayerObject.prototype.startCreateProgramWork = function(programName, time, reqLevel) {
    this.resetWorkStatus();
    this.isWorking = true;
    this.workType = CONSTANTS.WorkTypeCreateProgram;
    
    //Time needed to complete work affected by hacking skill (linearly based on
    //ratio of (your skill - required level) to MAX skill)
    var timeMultiplier = (CONSTANTS.MaxSkillLevel - (this.hacking_skill - reqLevel)) / CONSTANTS.MaxSkillLevel;
    if (timeMultiplier > 1) {timeMultiplier = 1;}
    if (timeMultiplier < 0.01) {timeMultiplier = 0.01;}
    
    this.timeNeededToCompleteWork = timeMultiplier * time;
    //Check for incomplete program
    for (var i = 0; i < Player.getHomeComputer().programs.length; ++i) {
        var programFile = Player.getHomeComputer().programs[i];
        if (programFile.startsWith(programName) && programFile.endsWith("%-INC")) {
            var res = programFile.split("-");
            if (res.length != 3) {break;}
            var percComplete = Number(res[1].slice(0, -1));
            if (isNaN(percComplete) || percComplete < 0 || percComplete >= 100) {break;}
            this.timeWorked = percComplete / 100 * this.timeNeededToCompleteWork;
            Player.getHomeComputer().programs.splice(i, 1);
        }
    }
    
    this.createProgramName = programName;
    
    var cancelButton = clearEventListeners("work-in-progress-cancel-button");
    cancelButton.innerHTML = "Cancel work on creating program";
    cancelButton.addEventListener("click", function() {
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
                    "If you cancel, your work will be saved and you can come back to complete the program later.";  
}

PlayerObject.prototype.finishCreateProgramWork = function(cancelled, programName) {
    if (cancelled == false) {
        dialogBoxCreate("You've finished creating " + programName + "!<br>" + 
                        "The new program can be found on your home computer.");
    
        Player.getHomeComputer().programs.push(programName);
    } else {
        var perc = Math.floor(this.timeWorked / this.timeNeededToCompleteWork * 100).toString();
        var incompleteName = programName + "-" + perc + "%-INC";
        Player.getHomeComputer().programs.push(incompleteName);
    }
    
    var mainMenu = document.getElementById("mainmenu-container");
    mainMenu.style.visibility = "visible";
        
    Player.isWorking = false;
    
    Engine.loadTerminalContent();
}

/* Studying/Taking Classes */
PlayerObject.prototype.startClass = function(costMult, expMult, className) {
    this.resetWorkStatus();
    this.isWorking = true;
    this.workType = CONSTANTS.WorkTypeStudyClass;
    
    this.className = className;
    
    var gameCPS = 1000 / Engine._idleSpeed;
    
    //Base exp gains per second
    var baseStudyComputerScienceExp = 0.25;
    var baseDataStructuresExp       = 0.5;
    var baseNetworksExp             = 1;
    var baseAlgorithmsExp           = 2;
    var baseManagementExp           = 1;
    var baseLeadershipExp           = 2;
    var baseGymExp                  = 1;
    
    //Find cost and exp gain per game cycle
    var cost = 0;
    var hackExp = 0, strExp = 0, defExp = 0, dexExp = 0, agiExp = 0, chaExp = 0;
    switch (className) {
        case CONSTANTS.ClassStudyComputerScience:
            hackExp = baseStudyComputerScienceExp * expMult / gameCPS;
            break;
        case CONSTANTS.ClassDataStructures:
            cost = CONSTANTS.ClassDataStructuresBaseCost * costMult / gameCPS;
            hackExp = baseDataStructuresExp * expMult / gameCPS;
            break;
        case CONSTANTS.ClassNetworks:
            cost = CONSTANTS.ClassNetworksBaseCost * costMult / gameCPS; 
            hackExp = baseNetworksExp * expMult / gameCPS;
            break;
        case CONSTANTS.ClassAlgorithms:
            cost = CONSTANTS.ClassAlgorithmsBaseCost * costMult / gameCPS;
            hackExp = baseAlgorithmsExp * expMult / gameCPS;
            break;
        case CONSTANTS.ClassManagement:
            cost = CONSTANTS.ClassManagementBaseCost * costMult / gameCPS;
            chaExp = baseManagementExp * expMult / gameCPS;
            break;
        case CONSTANTS.ClassLeadership:
            cost = CONSTANTS.ClassLeadershipBaseCost * costMult / gameCPS;
            chaExp = baseLeadershipExp * expMult / gameCPS;
            break;
        case CONSTANTS.ClassGymStrength:
            cost = CONSTANTS.ClassGymBaseCost * costMult / gameCPS;
            strExp = baseGymExp * expMult / gameCPS;
            break;
        case CONSTANTS.ClassGymDefense:
            cost = CONSTANTS.ClassGymBaseCost * costMult / gameCPS;
            defExp = baseGymExp * expMult / gameCPS;
            break;
        case CONSTANTS.ClassGymDexterity:
            cost = CONSTANTS.ClassGymBaseCost * costMult / gameCPS;
            dexExp = baseGymExp * expMult / gameCPS;
            break;
        case CONSTANTS.ClassGymAgility:
            cost = CONSTANTS.ClassGymBaseCost * costMult / gameCPS;
            agiExp = baseGymExp * expMult / gameCPS;
            break;
        default:
            throw new Error("ERR: Invalid/unregocnized class name");
            return;
    }
    
    this.workMoneyLossRate      = cost;
    this.workHackExpGainRate    = hackExp * this.hacking_exp_mult;
    this.workStrExpGainRate     = strExp * this.strength_exp_mult;
    this.workDefExpGainRate     = defExp * this.defense_exp_mult;
    this.workDexExpGainRate     = dexExp * this.dexterity_exp_mult;
    this.workAgiExpGainRate     = agiExp * this.agility_exp_mult;
    this.workChaExpGainRate     = chaExp * this.charisma_exp_mult;
    
    var cancelButton = clearEventListeners("work-in-progress-cancel-button");
    if (className == CONSTANTS.ClassGymStrength || 
        className == CONSTANTS.ClassGymDefense || 
        className == CONSTANTS.ClassGymDexterity || 
        className == CONSTANTS.ClassGymAgility) {
        cancelButton.innerHTML = "Stop training at gym";
    } else {
        cancelButton.innerHTML = "Stop taking course";
    }
    cancelButton.addEventListener("click", function() {
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
        
    var txt = document.getElementById("work-in-progress-text");
    txt.innerHTML = "You have been " + className + " for " + convertTimeMsToTimeElapsedString(this.timeWorked) + "<br><br>" +
                    "This has cost you: <br>" + 
                    "$" + formatNumber(this.workMoneyGained, 2) + " ($" + formatNumber(this.workMoneyLossRate * cyclesPerSec, 2) + " / sec) <br><br>" + 
                    "You have gained: <br>" + 
                    formatNumber(this.workHackExpGained, 4) + " (" + formatNumber(this.workHackExpGainRate * cyclesPerSec, 4) + " / sec) hacking exp <br>" + 
                    formatNumber(this.workDefExpGained, 4) + " (" + formatNumber(this.workDefExpGainRate * cyclesPerSec, 4) + " / sec) defense exp <br>" + 
                    formatNumber(this.workStrExpGained, 4) + " (" + formatNumber(this.workStrExpGainRate * cyclesPerSec, 4) + " / sec) strength exp <br>" + 
                    formatNumber(this.workDexExpGained, 4) + " (" + formatNumber(this.workDexExpGainRate * cyclesPerSec, 4) + " / sec) dexterity exp <br>" + 
                    formatNumber(this.workAgiExpGained, 4) + " (" + formatNumber(this.workAgiExpGainRate * cyclesPerSec, 4) + " / sec) agility exp <br>" +
                    formatNumber(this.workChaExpGained, 4) + " (" + formatNumber(this.workChaExpGainRate * cyclesPerSec, 4) + " / sec) charisma exp <br>" + 
                    "You may cancel at any time";       
}

PlayerObject.prototype.finishClass = function() {
    this.gainWorkExp();
    
    if (this.workMoneyGained > 0) {
        throw new Error("ERR: Somehow gained money while taking class");
    }
    this.loseMoney(this.workMoneyGained * -1);
    
    this.updateSkillLevels();
    var txt = "After " + this.className + " for " + convertTimeMsToTimeElapsedString(this.timeWorked) + ", <br>" +
              "you spent a total of $" + formatNumber(this.workMoneyGained * -1, 2) + ". <br><br>" + 
              "You earned a total of: <br>" + 
              formatNumber(this.workHackExpGained, 4) + " hacking exp <br>" + 
              formatNumber(this.workStrExpGained, 4) + " strength exp <br>" + 
              formatNumber(this.workDefExpGained, 4) + " defense exp <br>" +
              formatNumber(this.workDexExpGained, 4) + " dexterity exp <br>" + 
              formatNumber(this.workAgiExpGained, 4) + " agility exp <br>" + 
              formatNumber(this.workChaExpGained, 4) + " charisma exp<br>";

    dialogBoxCreate(txt);
    
    var mainMenu = document.getElementById("mainmenu-container");
    mainMenu.style.visibility = "visible";
        
    this.isWorking = false;
    
    Engine.loadLocationContent();
}

//The EXP and $ gains are hardcoded. Time is in ms
PlayerObject.prototype.startCrime = function(hackExp, strExp, defExp, dexExp, agiExp, chaExp, money, time) {
    this.resetWorkStatus();
    this.isWorking = true;
    this.workType = CONSTANTS.WorkTypeCrime;
    
    this.workHackExpGained  = hackExp * this.hacking_exp_mult;
    this.workStrExpGained   = strExp * this.strength_exp_mult;
    this.workDefExpGained   = defExp * this.defense_exp_mult;
    this.workDexExpGained   = dexExp * this.dexterity_exp_mult;
    this.workAgiExpGained   = agiExp * this.agility_exp_mult;
    this.workChaExpGained   = chaExp * this.charisma_exp_mult;
    this.workMoneyGained    = money * this.crime_money_mult;
    
    this.timeNeededToCompleteWork = time;
    
    //Remove all old event listeners from Cancel button
    var newCancelButton = clearEventListeners("work-in-progress-cancel-button")
    newCancelButton.innerHTML = "Cancel crime"
    newCancelButton.addEventListener("click", function() {
        Player.finishCrime(true);
        return false;
    });
    
    //Display Work In Progress Screen
    Engine.loadWorkInProgressContent();
}

PlayerObject.prototype.commitCrime = function (numCycles) {
    this.timeWorked += Engine._idleSpeed * numCycles;
    
    if (this.timeWorked >= this.timeNeededToCompleteWork) {Player.finishCrime(false); return;}
    
    var percent = Math.round(Player.timeWorked / Player.timeNeededToCompleteWork * 100);
    var numBars = Math.round(percent / 5);
    if (numBars < 0) {numBars = 0;}
    if (numBars > 20) {numBars = 20;}
    var progressBar = "[" + Array(numBars+1).join("|") + Array(20 - numBars + 1).join(" ") + "]";
    
    var txt = document.getElementById("work-in-progress-text");
    txt.innerHTML = "You are attempting to " + Player.crimeType + ".<br>" + 
                    "Time remaining: " + convertTimeMsToTimeElapsedString(this.timeNeededToCompleteWork - this.timeWorked) + "<br>" + 
                    progressBar.replace( / /g, "&nbsp;" );
}

PlayerObject.prototype.finishCrime = function(cancelled) {
    //Determine crime success/failure
    if (!cancelled) {
        var statusText = ""; //TODO, unique message for each crime when you succeed
        if (determineCrimeSuccess(this.crimeType, this.workMoneyGained)) {
            //Handle Karma and crime statistics
            switch(this.crimeType) {
                case CONSTANTS.CrimeShoplift:
                    this.karma -= 0.1;
                    ++this.numTimesShoplifted;
                    break;
                case CONSTANTS.CrimeMug:
                    this.karma -= 0.25;
                    ++this.numPeopleMugged;
                    break;
                case CONSTANTS.CrimeDrugs:
                    ++this.numTimesDealtDrugs;
                    this.karma -= 0.5; 
                    break;
                case CONSTANTS.CrimeTraffickArms:
                    ++this.numTimesTraffickArms;
                    this.karma -= 1;
                    break;
                case CONSTANTS.CrimeHomicide:
                    ++this.numPeopleKilled;
                    this.karma -= 3;
                    break;
                case CONSTANTS.CrimeGrandTheftAuto:
                    ++this.numTimesGrandTheftAuto;
                    this.karma -= 5;
                    break;
                case CONSTANTS.CrimeKidnap:
                    ++this.numTimesKidnapped;
                    this.karma -= 6;
                    break;
                case CONSTANTS.CrimeAssassination:
                    ++this.numPeopleKilled;
                    this.karma -= 10;
                    break;
                case CONSTANTS.CrimeHeist:
                    ++this.numTimesHeist;
                    this.karma -= 15;
                    break;
                default:
                    dialogBoxCreate("ERR: Unrecognized crime type. This is probably a bug please contact the developer");
                    return;
            }
        
            //On a crime success, gain 2x exp
            this.workHackExpGained  *= 2;
            this.workStrExpGained   *= 2;
            this.workDefExpGained   *= 2;
            this.workDexExpGained   *= 2;
            this.workAgiExpGained   *= 2;
            this.workChaExpGained   *= 2;
        
            dialogBoxCreate("Crime successful! <br><br>" + 
                            "You gained:<br>"+ 
                            "$" + formatNumber(this.workMoneyGained, 2) + "<br>" + 
                            formatNumber(this.workHackExpGained, 4) + " hacking experience <br>" + 
                            formatNumber(this.workStrExpGained, 4) + " strength experience<br>" + 
                            formatNumber(this.workDefExpGained, 4) + " defense experience<br>" + 
                            formatNumber(this.workDexExpGained, 4) + " dexterity experience<br>" + 
                            formatNumber(this.workAgiExpGained, 4) + " agility experience<br>" + 
                            formatNumber(this.workChaExpGained, 4) + " charisma experience");
        } else {
            dialogBoxCreate("Crime failed! <br><br>" + 
                    "You gained:<br>"+ 
                    formatNumber(this.workHackExpGained, 4) + " hacking experience <br>" + 
                    formatNumber(this.workStrExpGained, 4) + " strength experience<br>" + 
                    formatNumber(this.workDefExpGained, 4) + " defense experience<br>" + 
                    formatNumber(this.workDexExpGained, 4) + " dexterity experience<br>" + 
                    formatNumber(this.workAgiExpGained, 4) + " agility experience<br>" + 
                    formatNumber(this.workChaExpGained, 4) + " charisma experience");
        }
        
        this.gainWorkExp();
    }
    
    
    
    var mainMenu = document.getElementById("mainmenu-container");
    mainMenu.style.visibility = "visible";
    this.isWorking = false;
    Engine.loadLocationContent();
}


//Returns true if hospitalized, false otherwise
PlayerObject.prototype.takeDamage = function(amt) {
    this.hp -= amt;
    if (this.hp <= 0) {
        this.hospitalize();
        return true;
    } else {
        return false;
    }
}

PlayerObject.prototype.hospitalize = function() {
    dialogBoxCreate("You were in critical condition! You were taken to the hospital where " + 
                    "luckily they were able to save your life. You were charged $" + 
                    formatNumber(this.max_hp * CONSTANTS.HospitalCostPerHp, 2));
    Player.loseMoney(this.max_hp * CONSTANTS.HospitalCostPerHp);
    this.hp = this.max_hp;
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

    
    
