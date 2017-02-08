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
	this.city 			= Locations.Sector12;
	this.location 		= "";
    
    //Company Information
    this.companyName = "";      //Name of Company, equivalent to an object from Locations
    this.companyPosition = "";  //CompanyPosition object
    
    //Servers
    this.currentServer       = ""; //IP address of Server currently being accessed through terminal
    this.discoveredServers   = []; //IP addresses of secret servers not in the network that you have discovered
    this.purchasedServers    = [];
    
    //Achievements and achievement progress
    
    //Flag to let the engine know the player is starting an action
    //  Current actions: hack, analyze
    this.startAction = false;
    this.actionTime = 0;
    
    //Flags/variables for working
    this.isWorking = false;
    
    this.workHackExpGainRate = 0;
    this.workStrExpGainRate = 0;
    this.workDefExpGainRate = 0;
    this.workDexExpGainRate = 0;
    this.workAgiExpGainRate = 0;
    this.workRepGainRate = 0;
    this.workMoneyGainRate = 0;
    
    this.workHackExpGained = 0;
    this.workStrExpGained = 0;
    this.workDefExpGained = 0;
    this.workDexExpGained = 0;
    this.workAgiExpGained = 0;
    this.workRepGained = 0;
    this.workMoneyGained = 0;
    
    this.timeWorked = 0;    //in ms
    
    this.work_money_mult = 1;
	
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
    //TODO Account for total and lifetime stats for achievements and stuff
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

/* Working */
PlayerObject.prototype.finishWork = function(cancelled) {
    //Since the work was cancelled early, player only gains half of what they've earned so far
    var cancMult = 1;
    if (cancelled) {
        cancMult = 2;
    }
    this.hacking_exp    += Math.round(this.workHackExpGained / cancMult);
    this.strength_exp   += Math.round(this.workStrExpGained / cancMult);
    this.defense_exp    += Math.round(this.workDefExpGained / cancMult);
    this.dexterity_exp  += Math.round(this.workDexExpGained / cancMult);
    this.agility_exp    += Math.round(this.workAgiExpGained / cancMult);
    
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
              (this.workAgiExpGained / cancMult).toFixed(3) + " agility exp <br>";
              
    } else {
        txt = "You worked a full shirt of 8 hours! <br><br> " +
              "You earned a total of: <br>" + 
              "$" + (this.workMoneyGained / cancMult) + "<br>" + 
              (this.workRepGained / cancMult) + " reputation for the company <br>" + 
              (this.workHackExpGained / cancMult) + " hacking exp <br>" + 
              (this.workStrExpGained / cancMult) + " strength exp <br>" + 
              (this.workDefExpGained / cancMult) + " defense exp <br>" +
              (this.workDexExpGained / cancMult) + " dexterity exp <br>" + 
              (this.workAgiExpGained / cancMult) + " agility exp <br>";
    }
    dialogBoxCreate(txt);
    
    var mainMenu = document.getElementById("mainmenu-container");
    mainMenu.style.visibility = "visible";
        
    Engine.loadTerminalContent();
}

PlayerObject.prototype.startWork = function() {
    this.isWorking = true;
    
    this.workHackExpGainRate    = this.getWorkHackExpGain();
    this.workStrExpGainRate     = this.getWorkStrExpGain();
    this.workDefExpGainRate     = this.getWorkDefExpGain();
    this.workDexExpGainRate     = this.getWorkDexExpGain();
    this.workAgiExpGainRate     = this.getWorkAgiExpGain();
    this.workRepGainRate        = this.getWorkRepGain();
    this.workMoneyGainRate      = this.getWorkMoneyGain();
    
    this.workHackExpGained = 0;
    this.workStrExpGained = 0;
    this.workDefExpGained = 0;
    this.workDexExpGained = 0;
    this.workAgiExpGained = 0;
    this.workRepGained = 0;
    this.workMoneyGained = 0;
    
    this.timeWorked = 0;
    
    var cancelButton = document.getElementById("work-in-progress-cancel-button");
    cancelButton.addEventListener("click", function() {
        Player.finishWork(true);
    });
    
    //Display Work In Progress Screen
    Engine.loadWorkInProgressContent();
}
    
PlayerObject.prototype.work = function(numCycles) {
    this.workHackExpGained  += this.workHackExpGainRate * numCycles;
    this.workStrExpGained   += this.workStrExpGainRate * numCycles;
    this.workDefExpGained   += this.workDefExpGainRate * numCycles;
    this.workDexExpGained   += this.workDexExpGainRate * numCycles;
    this.workAgiExpGained   += this.workAgiExpGainRate * numCycles;
    this.workRepGained      += this.workRepGainRate * numCycles;
    this.workMoneyGained    += this.workMoneyGainRate * numCycles;
    
    var cyclesPerSec = 1000 / Engine._idleSpeed;
    
    this.timeWorked += Engine._idleSpeed * numCycles;
    
    //TODO If timeWorked == 8 hours, then finish 
    if (this.timeWorked >= 28800000) {
        this.finishWork(false);
    }
    
    var txt = document.getElementById("work-in-progress-text");
    txt.innerHTML = "You are currently working as a " + this.companyPosition.positionName + 
                    " at " + Player.companyName + "<br><br>" + 
                    "You have been working for " + convertTimeMsToTimeElapsedString(this.timeWorked) + "<br><br>" +
                    "You have earned: <br><br>" + 
                    "$" + this.workMoneyGained + " (" + (this.workMoneyGainRate * cyclesPerSec).toFixed(2) + " / sec) <br><br>" + 
                    this.workRepGained.toFixed(3) + " (" + (this.workRepGainRate * cyclesPerSec).toFixed(3) + " / sec) reputation for this company <br>" + 
                    this.workHackExpGained.toFixed(3) + " (" + (this.workHackExpGainRate * cyclesPerSec).toFixed(3) + " / sec) hacking exp <br>" + 
                    this.workStrExpGained.toFixed(3) + " (" + (this.workStrExpGainRate * cyclesPerSec).toFixed(3) + " / sec) strength exp <br>" + 
                    this.workDefExpGained.toFixed(3) + " (" + (this.workDefExpGainRate * cyclesPerSec).toFixed(3) + " / sec) defense exp <br>" + 
                    this.workDexExpGained.toFixed(3) + " (" + (this.workDexExpGainRate * cyclesPerSec).toFixed(3) + " / sec) dexterity exp <br>" + 
                    this.workAgiExpGained.toFixed(3) + " (" + (this.workAgiExpGainRate * cyclesPerSec).toFixed(3) + " / sec) agility exp <br><br> " +
                    
                    "You will automatically finish after working for 8 hours. You can cancel earlier if you wish, <br>" + 
                    "but you will only gain half of the experience, money, and reputation you've earned so far."
                    
}

//Money gained per game cycle
PlayerObject.prototype.getWorkMoneyGain = function() {
    var company = Companies[this.companyName];
    return this.companyPosition.baseSalary * company.salaryMultiplier * this.work_money_mult;
}

//Hack exp gained per game cycle
PlayerObject.prototype.getWorkHackExpGain = function() {
    var company = Companies[this.companyName];
    if (Engine.Debug) {
        console.log(company.companyName);
    }
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

//Reputation gained per game cycle
PlayerObject.prototype.getWorkRepGain = function() {
    return this.companyPosition.calculateJobPerformance(this.hacking_skill, this.strength,
                                                        this.defense, this.dexterity,
                                                        this.agility, this.charisma);
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

    
    
