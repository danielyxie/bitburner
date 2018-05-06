import {Augmentations, applyAugmentation,
        AugmentationNames,
        PlayerOwnedAugmentation}                from "./Augmentations.js";
import {BitNodes, BitNode, BitNodeMultipliers}  from "./BitNode.js";
import {Company, Companies, getNextCompanyPosition,
        getJobRequirementText, CompanyPosition,
        CompanyPositions}                       from "./Company.js";
import {CONSTANTS}                              from "./Constants.js";
import {Corporation}                            from "./CompanyManagement.js";
import {Programs}                               from "./CreateProgram.js";
import {determineCrimeSuccess}                  from "./Crimes.js";
import {Engine}                                 from "./engine.js";
import {Factions, Faction,
        displayFactionContent}                  from "./Faction.js";
import {Gang, resetGangs}                       from "./Gang.js";
import {Locations}                              from "./Location.js";
import {hasBn11SF, hasWallStreetSF,hasAISF}     from "./NetscriptFunctions.js";
import {AllServers, Server, AddToAllServers}    from "./Server.js";
import {SpecialServerIps, SpecialServerNames}   from "./SpecialServerIps.js";
import {SourceFiles, applySourceFile}           from "./SourceFile.js";

import Decimal                                  from '../utils/decimal.js';
import {dialogBoxCreate}                        from "../utils/DialogBox.js";
import {clearEventListeners}                    from "../utils/HelperFunctions.js";
import {createRandomIp}                         from "../utils/IPAddress.js";
import {Reviver, Generic_toJSON,
        Generic_fromJSON}                       from "../utils/JSONReviver.js";
import numeral                                  from "../utils/numeral.min.js";
import {formatNumber,
        convertTimeMsToTimeElapsedString}       from "../utils/StringHelperFunctions.js";

function PlayerObject() {
    //Skills and stats
    this.hacking_skill  = 1;

    //Combat stats
    this.hp             = 10;
    this.max_hp         = 10;
    this.strength       = 1;      //Damage dealt
    this.defense        = 1;      //Damage received
    this.dexterity      = 1;      //Accuracy
    this.agility        = 1;      //Dodge %

    //Labor stats
    this.charisma       = 1;

    //Special stats
    this.intelligence   = 0;

    //Hacking multipliers
    this.hacking_chance_mult    = 1;
    this.hacking_speed_mult     = 1;
    this.hacking_money_mult     = 1;
    this.hacking_grow_mult      = 1;

    //Experience and multipliers
    this.hacking_exp     = 0;
    this.strength_exp    = 0;
    this.defense_exp     = 0;
    this.dexterity_exp   = 0;
    this.agility_exp     = 0;
    this.charisma_exp    = 0;
    this.intelligence_exp= 0;

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
    this.money           = new Decimal(1000);
    this.total_money     = new Decimal(0);   //Total money ever earned in this "simulation"
    this.lifetime_money  = new Decimal(0);   //Total money ever earned

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
    this.purchasedServers       = []; //IP Addresses of purchased servers
    this.hacknetNodes           = [];
    this.totalHacknetNodeProduction = 0;

    //Factions
    this.factions = [];             //Names of all factions player has joined
    this.factionInvitations = [];   //Outstanding faction invitations

    //Augmentations
    this.queuedAugmentations = [];
    this.augmentations = [];

    this.sourceFiles = [];

    //Crime statistics
    this.numPeopleKilled = 0;
    this.karma = 0;

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
    this.createProgramReqLvl = 0;

    this.className = "";

    this.crimeType = "";

    this.timeWorked = 0;    //in ms
    this.timeWorkedCreateProgram = 0;
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

    //Gang
    this.gang = 0;

    //Corporation
    this.corporation = 0;

    //Bladeburner
    this.bladeburner = 0;
    this.bladeburner_max_stamina_mult               = 1;
    this.bladeburner_stamina_gain_mult              = 1;
    this.bladeburner_analysis_mult                  = 1; //Field Analysis Only
    this.bladeburner_success_chance_mult            = 1;

    //bitnode
    this.bitNodeN = 1;

    //Flags for determining whether certain "thresholds" have been achieved
    this.firstFacInvRecvd = false;
    this.firstAugPurchased = false;
    this.firstJobRecvd = false;
    this.firstTimeTraveled = false;
    this.firstProgramAvailable = false;

	//Used to store the last update time.
	this.lastUpdate = 0;
    this.totalPlaytime = 0;
    this.playtimeSinceLastAug = 0;

    //Production since last Augmentation installation
    this.scriptProdSinceLastAug = 0;
    this.stockProdSinceLastAug = 0;
    this.crimeProdSinceLastAug = 0;
    this.jobProdSinceLastAug = 0;
};

PlayerObject.prototype.init = function() {
    /* Initialize Player's home computer */
    var t_homeComp = new Server(createRandomIp(), "home", "Home PC", true, true, true, 8);
    this.homeComputer = t_homeComp.ip;
    this.currentServer = t_homeComp.ip;
    AddToAllServers(t_homeComp);

    this.getHomeComputer().programs.push(Programs.NukeProgram);
}

PlayerObject.prototype.prestigeAugmentation = function() {
    var homeComp = this.getHomeComputer();
    this.currentServer = homeComp.ip;
    this.homeComputer = homeComp.ip;

    this.numPeopleKilled = 0;
    this.karma = 0;

    //Reset stats
    this.hacking_skill = 1;

    this.strength = 1;
    this.defense = 1;
    this.dexterity = 1;
    this.agility = 1;

    this.charisma = 1;

    this.hacking_exp = 0;
    this.strength_exp = 0;
    this.defense_exp = 0;
    this.dexterity_exp = 0;
    this.agility_exp = 0;
    this.charisma_exp = 0;

    this.money = new Decimal(1000);

    this.city = Locations.Sector12;
    this.location = "";

    this.companyName = "";
    this.companyPosition = "";

    this.purchasedServers = [];

    this.factions = [];
    this.factionInvitations = [];

    this.queuedAugmentations = [];

    this.startAction = false;
    this.actionTime = 0;

    this.isWorking = false;
    this.currentWorkFactionName = "";
    this.currentWorkFactionDescription = "";
    this.createProgramName = "";
    this.className = "";
    this.crimeType = "";

    this.workHackExpGainRate = 0;
    this.workStrExpGainRate = 0;
    this.workDefExpGainRate = 0;
    this.workDexExpGainRate = 0;
    this.workAgiExpGainRate = 0;
    this.workChaExpGainRate = 0;
    this.workRepGainRate = 0;
    this.workMoneyGainRate = 0;

    this.workHackExpGained = 0;
    this.workStrExpGained = 0;
    this.workDefExpGained = 0;
    this.workDexExpGained = 0;
    this.workAgiExpGained = 0;
    this.workChaExpGained = 0;
    this.workRepGained = 0;
    this.workMoneyGained = 0;

    this.timeWorked = 0;

    this.lastUpdate = new Date().getTime();

    this.playtimeSinceLastAug = 0;
    this.scriptProdSinceLastAug = 0;

    this.hacknetNodes.length = 0;
    this.totalHacknetNodeProduction = 0;

    this.bladeburner = 0;
}

PlayerObject.prototype.prestigeSourceFile = function() {
    var homeComp = this.getHomeComputer();
    this.currentServer = homeComp.ip;
    this.homeComputer = homeComp.ip;

    this.numPeopleKilled = 0;
    this.karma = 0;

    //Reset stats
    this.hacking_skill = 1;

    this.strength = 1;
    this.defense = 1;
    this.dexterity = 1;
    this.agility = 1;

    this.charisma = 1;

    this.hacking_exp = 0;
    this.strength_exp = 0;
    this.defense_exp = 0;
    this.dexterity_exp = 0;
    this.agility_exp = 0;
    this.charisma_exp = 0;

    this.money = new Decimal(1000);

    this.city = Locations.Sector12;
    this.location = "";

    this.companyName = "";
    this.companyPosition = "";

    this.purchasedServers = [];

    this.factions = [];
    this.factionInvitations = [];

    this.queuedAugmentations = [];
    this.augmentations = [];

    this.startAction = false;
    this.actionTime = 0;

    this.isWorking = false;
    this.currentWorkFactionName = "";
    this.currentWorkFactionDescription = "";
    this.createProgramName = "";
    this.className = "";
    this.crimeType = "";

    this.workHackExpGainRate = 0;
    this.workStrExpGainRate = 0;
    this.workDefExpGainRate = 0;
    this.workDexExpGainRate = 0;
    this.workAgiExpGainRate = 0;
    this.workChaExpGainRate = 0;
    this.workRepGainRate = 0;
    this.workMoneyGainRate = 0;

    this.workHackExpGained = 0;
    this.workStrExpGained = 0;
    this.workDefExpGained = 0;
    this.workDexExpGained = 0;
    this.workAgiExpGained = 0;
    this.workChaExpGained = 0;
    this.workRepGained = 0;
    this.workMoneyGained = 0;

    this.timeWorked = 0;

    this.lastUpdate = new Date().getTime();

    this.hacknetNodes.length = 0;
    this.totalHacknetNodeProduction = 0;

    //Gang
    this.gang = null;
    resetGangs();

    //Reset Stock market
    this.hasWseAccount = false;
    this.hasTixApiAccess = false;

    //BitNode 3: Corporatocracy
    if (this.bitNodeN === 3) {this.money = new Decimal(150e9);}
    this.corporation = 0;

    //Reset Bladeburner
    this.bladeburner = 0;

    //BitNode 8: Ghost of Wall Street
    if (this.bitNodeN === 8) {this.money = new Decimal(100000000);}
    if (this.bitNodeN === 8 || hasWallStreetSF) {
        this.hasWseAccount = true;
        this.hasTixApiAccess = true;
    }

    this.playtimeSinceLastAug = 0;
    this.scriptProdSinceLastAug = 0;
}

PlayerObject.prototype.getCurrentServer = function() {
    return AllServers[this.currentServer];
}

PlayerObject.prototype.getHomeComputer = function() {
    return AllServers[this.homeComputer];
}

//Calculates skill level based on experience. The same formula will be used for every skill
PlayerObject.prototype.calculateSkill = function(exp) {
    return Math.max(Math.floor(32 * Math.log(exp + 534.5) - 200), 1);
}

PlayerObject.prototype.updateSkillLevels = function() {
	this.hacking_skill = Math.max(1, Math.floor(this.calculateSkill(this.hacking_exp) * this.hacking_mult * BitNodeMultipliers.HackingLevelMultiplier));
	this.strength      = Math.floor(this.calculateSkill(this.strength_exp) * this.strength_mult);
    this.defense       = Math.floor(this.calculateSkill(this.defense_exp) * this.defense_mult);
    this.dexterity     = Math.floor(this.calculateSkill(this.dexterity_exp) * this.dexterity_mult);
    this.agility       = Math.floor(this.calculateSkill(this.agility_exp) * this.agility_mult);
    this.charisma      = Math.floor(this.calculateSkill(this.charisma_exp) * this.charisma_mult);

    if (this.intelligence > 0) {
        this.intelligence = Math.floor(this.calculateSkill(this.intelligence_exp));
    } else {
        this.intelligence = 0;
    }

    var ratio = this.hp / this.max_hp;
    this.max_hp         = Math.floor(10 + this.defense / 10);
    Player.hp = Math.round(this.max_hp * ratio);
}

PlayerObject.prototype.resetMultipliers = function() {
    this.hacking_chance_mult    = 1;
    this.hacking_speed_mult     = 1;
    this.hacking_money_mult     = 1;
    this.hacking_grow_mult      = 1;

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

    this.crime_money_mult       = 1;
    this.crime_success_mult     = 1;

    this.hacknet_node_money_mult            = 1;
    this.hacknet_node_purchase_cost_mult    = 1;
    this.hacknet_node_ram_cost_mult         = 1;
    this.hacknet_node_core_cost_mult        = 1;
    this.hacknet_node_level_cost_mult       = 1;

    this.work_money_mult = 1;

    this.bladeburner_max_stamina_mult               = 1;
    this.bladeburner_stamina_gain_mult              = 1;
    this.bladeburner_analysis_mult                  = 1;
    this.bladeburner_success_chance_mult            = 1;
}

//Calculates the chance of hacking a server
//The formula is:
//  (2 * hacking_chance_multiplier * hacking_skill - requiredLevel)      100 - difficulty
//  -----------------------------------------------------------  *  -----------------
//        (2 * hacking_chance_multiplier * hacking_skill)                      100
PlayerObject.prototype.calculateHackingChance = function() {
    var difficultyMult = (100 - this.getCurrentServer().hackDifficulty) / 100;
    var skillMult = (1.75 * this.hacking_skill) + (0.2 * this.intelligence);
    var skillChance = (skillMult - this.getCurrentServer().requiredHackingSkill) / skillMult;
    var chance = skillChance * difficultyMult * this.hacking_chance_mult;
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
    var skillFactor = (2.5 * difficultyMult + 200) / (this.hacking_skill + 100 + (0.1 * this.intelligence));
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
    var percentMoneyHacked = difficultyMult * skillMult * this.hacking_money_mult / 240;
    console.log("Percent money hacked calculated to be: " + percentMoneyHacked);
    if (percentMoneyHacked < 0) {return 0;}
    if (percentMoneyHacked > 1) {return 1;}
    return percentMoneyHacked * BitNodeMultipliers.ManualHackMoney;
}

//Returns how much EXP the player gains on a successful hack
//The formula is:
//  difficulty * requiredLevel * hacking_multiplier
PlayerObject.prototype.calculateExpGain = function() {
    var s = this.getCurrentServer();
    if (s.baseDifficulty == null) {
        s.baseDifficulty = s.hackDifficulty;
    }
    return (s.baseDifficulty * this.hacking_exp_mult * 0.3 + 3) * BitNodeMultipliers.HackExpGain;
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

PlayerObject.prototype.setMoney = function(money) {
    if (isNaN(money)) {
        console.log("ERR: NaN passed into Player.setMoney()"); return;
    }
    this.money = money;
}

PlayerObject.prototype.gainMoney = function(money) {
    if (isNaN(money)) {
        console.log("ERR: NaN passed into Player.gainMoney()"); return;
    }
	this.money = this.money.plus(money);
	this.total_money = this.total_money.plus(money);
	this.lifetime_money = this.lifetime_money.plus(money);
}

PlayerObject.prototype.loseMoney = function(money) {
    if (isNaN(money)) {
        console.log("ERR: NaN passed into Player.loseMoney()"); return;
    }
    this.money = this.money.minus(money);
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

PlayerObject.prototype.gainIntelligenceExp = function(exp) {
    if (isNaN(exp)) {
        console.log("ERROR: NaN passed into Player.gainIntelligenceExp()"); return;
    }
    if (hasAISF || this.intelligence > 0) {
        this.intelligence_exp += exp;
    } else {
        console.log("Not gaining intelligence experience bc it hasn't been unlocked yet");
    }
}

//Given a string expression like "str" or "strength", returns the given stat
PlayerObject.prototype.queryStatFromString = function(str) {
    var tempStr = str.toLowerCase();
    if (tempStr.includes("hack"))   {return Player.hacking_skill;}
    if (tempStr.includes("str"))    {return Player.strength;}
    if (tempStr.includes("def"))    {return Player.defense;}
    if (tempStr.includes("dex"))    {return Player.dexterity;}
    if (tempStr.includes("agi"))    {return Player.agility;}
    if (tempStr.includes("cha"))    {return Player.charisma;}
    if (tempStr.includes("int"))    {return Player.intelligence;}
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
    this.timeWorkedCreateProgram = 0;

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
PlayerObject.prototype.finishWork = function(cancelled, sing=false) {
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
        txt = "You worked a full shift of 8 hours! <br><br> " + txt;
    }
    if (!sing) {dialogBoxCreate(txt);}

    var mainMenu = document.getElementById("mainmenu-container");
    mainMenu.style.visibility = "visible";
    this.isWorking = false;
    Engine.loadLocationContent();

    if (sing) {
        var res =  "You worked a short shift of " + convertTimeMsToTimeElapsedString(this.timeWorked) + " and " +
               "earned $" + formatNumber(this.workMoneyGained, 2) + ", " +
               formatNumber(this.workRepGained, 4) + " reputation, " +
               formatNumber(this.workHackExpGained, 4) + " hacking exp, " +
               formatNumber(this.workStrExpGained, 4) + " strength exp, " +
               formatNumber(this.workDefExpGained, 4) + " defense exp, " +
               formatNumber(this.workDexExpGained, 4) + " dexterity exp, " +
               formatNumber(this.workAgiExpGained, 4) + " agility exp, and " +
               formatNumber(this.workChaExpGained, 4) + " charisma exp.";
        this.resetWorkStatus();
        return res;
    }
    this.resetWorkStatus();
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

    var comp = Companies[this.companyName], companyRep = "0";
    if (comp == null || !(comp instanceof Company)) {
        console.log("ERROR: Could not find Company: " + this.companyName);
    } else {
        companyRep = comp.playerReputation;
    }

    var txt = document.getElementById("work-in-progress-text");
    txt.innerHTML = "You are currently working as a " + this.companyPosition.positionName +
                    " at " + this.companyName + " (Current Company Reputation: " +
                    formatNumber(companyRep, 0) + ")<br><br>" +
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

PlayerObject.prototype.finishWorkPartTime = function(sing=false) {
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
    if (!sing) {dialogBoxCreate(txt);}

    var mainMenu = document.getElementById("mainmenu-container");
    mainMenu.style.visibility = "visible";
    this.isWorking = false;
    Engine.loadLocationContent();
    if (sing) {
        var res =  "You worked for " + convertTimeMsToTimeElapsedString(this.timeWorked) + " and " +
               "earned a total of " +
               "$" + formatNumber(this.workMoneyGained, 2) + ", " +
                formatNumber(this.workRepGained, 4) + " reputation, " +
                formatNumber(this.workHackExpGained, 4) + " hacking exp, " +
                formatNumber(this.workStrExpGained, 4) + " strength exp, " +
                formatNumber(this.workDefExpGained, 4) + " defense exp, " +
                formatNumber(this.workDexExpGained, 4) + " dexterity exp, " +
                formatNumber(this.workAgiExpGained, 4) + " agility exp, and " +
                formatNumber(this.workChaExpGained, 4) + " charisma exp";
        this.resetWorkStatus();
        return res;
    }
    this.resetWorkStatus();
}

/* Working for Faction */
PlayerObject.prototype.finishFactionWork = function(cancelled, sing=false) {
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
    if (!sing) {dialogBoxCreate(txt);}

    var mainMenu = document.getElementById("mainmenu-container");
    mainMenu.style.visibility = "visible";

    this.isWorking = false;

    Engine.loadFactionContent();
    displayFactionContent(faction.name);
    if (sing) {
        var res="You worked for your faction " + faction.name + " for a total of " + convertTimeMsToTimeElapsedString(this.timeWorked) + ". " +
               "You earned " +
                formatNumber(this.workRepGained, 4) + " rep, " +
                formatNumber(this.workHackExpGained, 4) + " hacking exp, " +
                formatNumber(this.workStrExpGained, 4) + " str exp, " +
                formatNumber(this.workDefExpGained, 4) + " def exp, " +
                formatNumber(this.workDexExpGained, 4) + " dex exp, " +
                formatNumber(this.workAgiExpGained, 4) + " agi exp, and " +
                formatNumber(this.workChaExpGained, 4) + " cha exp.";
        this.resetWorkStatus();
        return res;
    }
    this.resetWorkStatus();
}

PlayerObject.prototype.startFactionWork = function(faction) {
    //Update reputation gain rate to account for faction favor
    var favorMult = 1 + (faction.favor / 100);
    if (isNaN(favorMult)) {favorMult = 1;}
    this.workRepGainRate *= favorMult;
    this.workRepGainRate *= BitNodeMultipliers.FactionWorkRepGain;

    this.isWorking = true;
    this.workType = CONSTANTS.WorkTypeFaction;
    this.currentWorkFactionName = faction.name;

    this.timeNeededToCompleteWork = CONSTANTS.MillisecondsPer20Hours;

    var cancelButton = clearEventListeners("work-in-progress-cancel-button");
    cancelButton.innerHTML = "Stop Faction Work";
    cancelButton.addEventListener("click", function() {
        Player.finishFactionWork(true);
        return false;
    });

    //Display Work In Progress Screen
    Engine.loadWorkInProgressContent();
}

PlayerObject.prototype.startFactionHackWork = function(faction) {
    this.resetWorkStatus();

    this.workHackExpGainRate = .15 * this.hacking_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
    this.workRepGainRate = this.workRepGainRate = (this.hacking_skill + this.intelligence) / CONSTANTS.MaxSkillLevel * this.faction_rep_mult;

    this.factionWorkType = CONSTANTS.FactionWorkHacking;
    this.currentWorkFactionDescription = "carrying out hacking contracts";

    this.startFactionWork(faction);
}

PlayerObject.prototype.startFactionFieldWork = function(faction) {
    this.resetWorkStatus();

    this.workHackExpGainRate    = .1 * this.hacking_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
    this.workStrExpGainRate     = .1 * this.strength_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
    this.workDefExpGainRate     = .1 * this.defense_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
    this.workDexExpGainRate     = .1 * this.dexterity_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
    this.workAgiExpGainRate     = .1 * this.agility_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
    this.workChaExpGainRate     = .1 * this.charisma_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
    this.workRepGainRate        = this.getFactionFieldWorkRepGain();

    this.factionWorkType = CONSTANTS.FactionWorkField;
    this.currentWorkFactionDescription = "carrying out field missions"

    this.startFactionWork(faction);
}

PlayerObject.prototype.startFactionSecurityWork = function(faction) {
    this.resetWorkStatus();

    this.workHackExpGainRate    = 0.05 * this.hacking_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
    this.workStrExpGainRate     = 0.15 * this.strength_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
    this.workDefExpGainRate     = 0.15 * this.defense_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
    this.workDexExpGainRate     = 0.15 * this.dexterity_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
    this.workAgiExpGainRate     = 0.15 * this.agility_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
    this.workChaExpGainRate     = 0.00 * this.charisma_exp_mult * BitNodeMultipliers.FactionWorkExpGain;
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
            this.workRepGainRate = (this.hacking_skill + this.intelligence) / CONSTANTS.MaxSkillLevel * this.faction_rep_mult;
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
    this.workRepGainRate *= BitNodeMultipliers.FactionWorkRepGain;

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
        this.timeWorked = CONSTANTS.MillisecondsPer20Hours;
        this.workHackExpGained = this.workHackExpGainRate * maxCycles;
        this.workStrExpGained  = this.workStrExpGainRate * maxCycles;
        this.workDefExpGained  = this.workDefExpGainRate * maxCycles;
        this.workDexExpGained  = this.workDexExpGainRate * maxCycles;
        this.workAgiExpGained  = this.workAgiExpGainRate * maxCycles;
        this.workChaExpGained  = this.workChaExpGainRate * maxCycles;
        this.workRepGained     = this.workRepGainRate * maxCycles;
        this.workMoneyGained   = this.workMoneyGainRate * maxCycles;
        this.finishFactionWork(false);
    }

    var txt = document.getElementById("work-in-progress-text");
    txt.innerHTML = "You are currently " + this.currentWorkFactionDescription + " for your faction " + faction.name +
                    " (Current Faction Reputation: " + formatNumber(faction.playerReputation, 0) + "). " +
                    "You have been doing this for " + convertTimeMsToTimeElapsedString(this.timeWorked) + "<br><br>" +
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
    var bn11Mult = 1;
    var company = Companies[this.companyName];
    if (hasBn11SF) {
        bn11Mult = 1 + (company.favor / 100);
    }
    return this.companyPosition.baseSalary * company.salaryMultiplier *
           this.work_money_mult * BitNodeMultipliers.CompanyWorkMoney * bn11Mult;
}

//Hack exp gained per game cycle
PlayerObject.prototype.getWorkHackExpGain = function() {
    var company = Companies[this.companyName];
    return this.companyPosition.hackingExpGain * company.expMultiplier *
           this.hacking_exp_mult * BitNodeMultipliers.CompanyWorkExpGain;
}

//Str exp gained per game cycle
PlayerObject.prototype.getWorkStrExpGain = function() {
    var company = Companies[this.companyName];
    return this.companyPosition.strengthExpGain * company.expMultiplier *
           this.strength_exp_mult * BitNodeMultipliers.CompanyWorkExpGain;
}

//Def exp gained per game cycle
PlayerObject.prototype.getWorkDefExpGain = function() {
    var company = Companies[this.companyName];
    return this.companyPosition.defenseExpGain * company.expMultiplier *
           this.defense_exp_mult * BitNodeMultipliers.CompanyWorkExpGain;
}

//Dex exp gained per game cycle
PlayerObject.prototype.getWorkDexExpGain = function() {
    var company = Companies[this.companyName];
    return this.companyPosition.dexterityExpGain * company.expMultiplier *
           this.dexterity_exp_mult * BitNodeMultipliers.CompanyWorkExpGain;
}

//Agi exp gained per game cycle
PlayerObject.prototype.getWorkAgiExpGain = function() {
    var company = Companies[this.companyName];
    return this.companyPosition.agilityExpGain * company.expMultiplier *
           this.agility_exp_mult * BitNodeMultipliers.CompanyWorkExpGain;
}

//Charisma exp gained per game cycle
PlayerObject.prototype.getWorkChaExpGain = function() {
    var company = Companies[this.companyName];
    return this.companyPosition.charismaExpGain * company.expMultiplier *
           this.charisma_exp_mult * BitNodeMultipliers.CompanyWorkExpGain;
}

//Reputation gained per game cycle
PlayerObject.prototype.getWorkRepGain = function() {
    var company = Companies[this.companyName];
    var jobPerformance = this.companyPosition.calculateJobPerformance(this.hacking_skill, this.strength,
                                                                      this.defense, this.dexterity,
                                                                      this.agility, this.charisma);

    //Intelligence provides a flat bonus to job performance
    jobPerformance += (this.intelligence / CONSTANTS.MaxSkillLevel);

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
                   this.agility        / CONSTANTS.MaxSkillLevel) / 4.5;
    return t * this.faction_rep_mult;
}

PlayerObject.prototype.getFactionFieldWorkRepGain = function() {
    var t = 0.9 * (this.hacking_skill  / CONSTANTS.MaxSkillLevel +
                   this.strength       / CONSTANTS.MaxSkillLevel +
                   this.defense        / CONSTANTS.MaxSkillLevel +
                   this.dexterity      / CONSTANTS.MaxSkillLevel +
                   this.agility        / CONSTANTS.MaxSkillLevel +
                   this.charisma       / CONSTANTS.MaxSkillLevel +
                   this.intelligence   / CONSTANTS.MaxSkillLevel) / 5.5;
    return t * this.faction_rep_mult;
}

/* Creating a Program */
PlayerObject.prototype.startCreateProgramWork = function(programName, time, reqLevel) {
    this.resetWorkStatus();
    this.isWorking = true;
    this.workType = CONSTANTS.WorkTypeCreateProgram;

    //Time needed to complete work affected by hacking skill (linearly based on
    //ratio of (your skill - required level) to MAX skill)
    //var timeMultiplier = (CONSTANTS.MaxSkillLevel - (this.hacking_skill - reqLevel)) / CONSTANTS.MaxSkillLevel;
    //if (timeMultiplier > 1) {timeMultiplier = 1;}
    //if (timeMultiplier < 0.01) {timeMultiplier = 0.01;}
    this.createProgramReqLvl = reqLevel;

    this.timeNeededToCompleteWork = time;
    //Check for incomplete program
    for (var i = 0; i < this.getHomeComputer().programs.length; ++i) {
        var programFile = this.getHomeComputer().programs[i];
        if (programFile.startsWith(programName) && programFile.endsWith("%-INC")) {
            var res = programFile.split("-");
            if (res.length != 3) {break;}
            var percComplete = Number(res[1].slice(0, -1));
            if (isNaN(percComplete) || percComplete < 0 || percComplete >= 100) {break;}
            this.timeWorkedCreateProgram = percComplete / 100 * this.timeNeededToCompleteWork;
            this.getHomeComputer().programs.splice(i, 1);
        }
    }

    this.createProgramName = programName;

    var cancelButton = clearEventListeners("work-in-progress-cancel-button");
    cancelButton.innerHTML = "Cancel work on creating program";
    cancelButton.addEventListener("click", function() {
        Player.finishCreateProgramWork(true);
        return false;
    });

    //Display Work In Progress Screen
    Engine.loadWorkInProgressContent();
}

PlayerObject.prototype.createProgramWork = function(numCycles) {
    //Higher hacking skill will allow you to create programs faster
    var reqLvl = this.createProgramReqLvl;
    var skillMult = (this.hacking_skill / reqLvl); //This should always be greater than 1;
    skillMult = 1 + ((skillMult - 1) / 5); //The divider constant can be adjusted as necessary

    //Skill multiplier directly applied to "time worked"
    this.timeWorked += (Engine._idleSpeed * numCycles);
    this.timeWorkedCreateProgram += (Engine._idleSpeed * numCycles * skillMult);
    var programName = this.createProgramName;

    if (this.timeWorkedCreateProgram >= this.timeNeededToCompleteWork) {
        this.finishCreateProgramWork(false);
    }

    var txt = document.getElementById("work-in-progress-text");
    txt.innerHTML = "You are currently working on coding " + programName + ".<br><br> " +
                    "You have been working for " + convertTimeMsToTimeElapsedString(this.timeWorked) + "<br><br>" +
                    "The program is " + (this.timeWorkedCreateProgram / this.timeNeededToCompleteWork * 100).toFixed(2) + "% complete. <br>" +
                    "If you cancel, your work will be saved and you can come back to complete the program later.";
}

PlayerObject.prototype.finishCreateProgramWork = function(cancelled, sing=false) {
    var programName = this.createProgramName;
    if (cancelled === false) {
        dialogBoxCreate("You've finished creating " + programName + "!<br>" +
                        "The new program can be found on your home computer.");

        this.getHomeComputer().programs.push(programName);
    } else {
        var perc = Math.floor(this.timeWorkedCreateProgram / this.timeNeededToCompleteWork * 100).toString();
        var incompleteName = programName + "-" + perc + "%-INC";
        this.getHomeComputer().programs.push(incompleteName);
    }

    if (!cancelled) {
        this.gainIntelligenceExp(this.createProgramReqLvl / CONSTANTS.IntelligenceProgramBaseExpGain);
    }

    var mainMenu = document.getElementById("mainmenu-container");
    mainMenu.style.visibility = "visible";

    this.isWorking = false;

    Engine.loadTerminalContent();
    this.resetWorkStatus();
}

/* Studying/Taking Classes */
PlayerObject.prototype.startClass = function(costMult, expMult, className) {
    this.resetWorkStatus();
    this.isWorking = true;
    this.workType = CONSTANTS.WorkTypeStudyClass;

    this.className = className;

    var gameCPS = 1000 / Engine._idleSpeed;

    //Base exp gains per second
    var baseStudyComputerScienceExp = 0.5;
    var baseDataStructuresExp       = 1;
    var baseNetworksExp             = 2;
    var baseAlgorithmsExp           = 4;
    var baseManagementExp           = 2;
    var baseLeadershipExp           = 4;
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
            throw new Error("ERR: Invalid/unrecognized class name");
            return;
    }

    this.workMoneyLossRate      = cost;
    this.workHackExpGainRate    = hackExp * this.hacking_exp_mult * BitNodeMultipliers.ClassGymExpGain;
    this.workStrExpGainRate     = strExp * this.strength_exp_mult * BitNodeMultipliers.ClassGymExpGain;;
    this.workDefExpGainRate     = defExp * this.defense_exp_mult * BitNodeMultipliers.ClassGymExpGain;;
    this.workDexExpGainRate     = dexExp * this.dexterity_exp_mult * BitNodeMultipliers.ClassGymExpGain;;
    this.workAgiExpGainRate     = agiExp * this.agility_exp_mult * BitNodeMultipliers.ClassGymExpGain;;
    this.workChaExpGainRate     = chaExp * this.charisma_exp_mult * BitNodeMultipliers.ClassGymExpGain;;

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
                    formatNumber(this.workStrExpGained, 4) + " (" + formatNumber(this.workStrExpGainRate * cyclesPerSec, 4) + " / sec) strength exp <br>" +
                    formatNumber(this.workDefExpGained, 4) + " (" + formatNumber(this.workDefExpGainRate * cyclesPerSec, 4) + " / sec) defense exp <br>" +
                    formatNumber(this.workDexExpGained, 4) + " (" + formatNumber(this.workDexExpGainRate * cyclesPerSec, 4) + " / sec) dexterity exp <br>" +
                    formatNumber(this.workAgiExpGained, 4) + " (" + formatNumber(this.workAgiExpGainRate * cyclesPerSec, 4) + " / sec) agility exp <br>" +
                    formatNumber(this.workChaExpGained, 4) + " (" + formatNumber(this.workChaExpGainRate * cyclesPerSec, 4) + " / sec) charisma exp <br>" +
                    "You may cancel at any time";
}

//The 'sing' argument defines whether or not this function was called
//through a Singularity Netscript function
PlayerObject.prototype.finishClass = function(sing=false) {
    this.gainWorkExp();
    this.gainIntelligenceExp(CONSTANTS.IntelligenceClassBaseExpGain * Math.round(this.timeWorked / 1000));

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
    if (!sing) {dialogBoxCreate(txt);}

    var mainMenu = document.getElementById("mainmenu-container");
    mainMenu.style.visibility = "visible";

    this.isWorking = false;

    Engine.loadLocationContent();
    if (sing) {
        var res="After " + this.className + " for " + convertTimeMsToTimeElapsedString(this.timeWorked) + ", " +
              "you spent a total of $" + formatNumber(this.workMoneyGained * -1, 2) + ". " +
              "You earned a total of: " +
              formatNumber(this.workHackExpGained, 3) + " hacking exp, " +
              formatNumber(this.workStrExpGained, 3) + " strength exp, " +
              formatNumber(this.workDefExpGained, 3) + " defense exp, " +
              formatNumber(this.workDexExpGained, 3) + " dexterity exp, " +
              formatNumber(this.workAgiExpGained, 3) + " agility exp, and " +
              formatNumber(this.workChaExpGained, 3) + " charisma exp";
        this.resetWorkStatus();
        return res;
    }
    this.resetWorkStatus();
}

//The EXP and $ gains are hardcoded. Time is in ms
PlayerObject.prototype.startCrime = function(hackExp, strExp, defExp, dexExp, agiExp, chaExp, money, time, singParams=null) {
    this.resetWorkStatus();
    this.isWorking = true;
    this.workType = CONSTANTS.WorkTypeCrime;

    if (singParams && singParams.workerscript) {
        this.committingCrimeThruSingFn = true;
        this.singFnCrimeWorkerScript = singParams.workerscript;
    }

    this.workHackExpGained  = hackExp * this.hacking_exp_mult * BitNodeMultipliers.CrimeExpGain;
    this.workStrExpGained   = strExp * this.strength_exp_mult * BitNodeMultipliers.CrimeExpGain;
    this.workDefExpGained   = defExp * this.defense_exp_mult * BitNodeMultipliers.CrimeExpGain;
    this.workDexExpGained   = dexExp * this.dexterity_exp_mult * BitNodeMultipliers.CrimeExpGain;
    this.workAgiExpGained   = agiExp * this.agility_exp_mult * BitNodeMultipliers.CrimeExpGain;
    this.workChaExpGained   = chaExp * this.charisma_exp_mult * BitNodeMultipliers.CrimeExpGain;
    this.workMoneyGained    = money * this.crime_money_mult * BitNodeMultipliers.CrimeMoney;

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

    if (this.timeWorked >= this.timeNeededToCompleteWork) {this.finishCrime(false); return;}

    var percent = Math.round(this.timeWorked / this.timeNeededToCompleteWork * 100);
    var numBars = Math.round(percent / 5);
    if (numBars < 0) {numBars = 0;}
    if (numBars > 20) {numBars = 20;}
    var progressBar = "[" + Array(numBars+1).join("|") + Array(20 - numBars + 1).join(" ") + "]";

    var txt = document.getElementById("work-in-progress-text");
    txt.innerHTML = "You are attempting to " + this.crimeType + ".<br>" +
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
                    break;
                case CONSTANTS.CrimeRobStore:
                    this.karma -= 0.5;
                    this.gainIntelligenceExp(0.25 * CONSTANTS.IntelligenceCrimeBaseExpGain);
                    break;
                case CONSTANTS.CrimeMug:
                    this.karma -= 0.25;
                    break;
                case CONSTANTS.CrimeLarceny:
                    this.karma -= 1.5;
                    this.gainIntelligenceExp(0.5 * CONSTANTS.IntelligenceCrimeBaseExpGain);
                    break;
                case CONSTANTS.CrimeDrugs:
                    this.karma -= 0.5;
                    break;
                case CONSTANTS.CrimeBondForgery:
                    this.karma -= 0.1;
                    this.gainIntelligenceExp(2 * CONSTANTS.IntelligenceCrimeBaseExpGain);
                    break;
                case CONSTANTS.CrimeTraffickArms:
                    this.karma -= 1;
                    break;
                case CONSTANTS.CrimeHomicide:
                    ++this.numPeopleKilled;
                    this.karma -= 3;
                    break;
                case CONSTANTS.CrimeGrandTheftAuto:
                    this.karma -= 5;
                    this.gainIntelligenceExp(CONSTANTS.IntelligenceCrimeBaseExpGain);
                    break;
                case CONSTANTS.CrimeKidnap:
                    this.karma -= 6;
                    this.gainIntelligenceExp(2 * CONSTANTS.IntelligenceCrimeBaseExpGain);
                    break;
                case CONSTANTS.CrimeAssassination:
                    ++this.numPeopleKilled;
                    this.karma -= 10;
                    this.gainIntelligenceExp(5 * CONSTANTS.IntelligenceCrimeBaseExpGain);
                    break;
                case CONSTANTS.CrimeHeist:
                    this.karma -= 15;
                    this.gainIntelligenceExp(10 * CONSTANTS.IntelligenceCrimeBaseExpGain);
                    break;
                default:
                    console.log(this.crimeType);
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
            if (this.committingCrimeThruSingFn) {
                if(this.singFnCrimeWorkerScript.disableLogs.ALL == null && this.singFnCrimeWorkerScript.disableLogs.commitCrime == null) {
                    this.singFnCrimeWorkerScript.scriptRef.log("Crime successful! Gained " +
                                                               numeral(this.workMoneyGained).format("$0.000a") + ", " +
                                                               formatNumber(this.workHackExpGained, 3) + " hack exp, " +
                                                               formatNumber(this.workStrExpGained, 3) + " str exp, " +
                                                               formatNumber(this.workDefExpGained, 3) + " def exp, " +
                                                               formatNumber(this.workDexExpGained, 3) + " dex exp, " +
                                                               formatNumber(this.workAgiExpGained, 3) + " agi exp, " +
                                                               formatNumber(this.workChaExpGained, 3) + " cha exp.");
                }
            } else {
                dialogBoxCreate("Crime successful! <br><br>" +
                                "You gained:<br>"+
                                "$" + formatNumber(this.workMoneyGained, 2) + "<br>" +
                                formatNumber(this.workHackExpGained, 4) + " hacking experience <br>" +
                                formatNumber(this.workStrExpGained, 4) + " strength experience<br>" +
                                formatNumber(this.workDefExpGained, 4) + " defense experience<br>" +
                                formatNumber(this.workDexExpGained, 4) + " dexterity experience<br>" +
                                formatNumber(this.workAgiExpGained, 4) + " agility experience<br>" +
                                formatNumber(this.workChaExpGained, 4) + " charisma experience");
            }

        } else {
            //Exp halved on failure
            this.workHackExpGained  /= 2;
            this.workStrExpGained   /= 2;
            this.workDefExpGained   /= 2;
            this.workDexExpGained   /= 2;
            this.workAgiExpGained   /= 2;
            this.workChaExpGained   /= 2;
            if (this.committingCrimeThruSingFn) {
                if(this.singFnCrimeWorkerScript.disableLogs.ALL == null && this.singFnCrimeWorkerScript.disableLogs.commitCrime == null) {
                    this.singFnCrimeWorkerScript.scriptRef.log("Crime failed! Gained " +
                                                               formatNumber(this.workHackExpGained, 3) + " hack exp, " +
                                                               formatNumber(this.workStrExpGained, 3) + " str exp, " +
                                                               formatNumber(this.workDefExpGained, 3) + " def exp, " +
                                                               formatNumber(this.workDexExpGained, 3) + " dex exp, " +
                                                               formatNumber(this.workAgiExpGained, 3) + " agi exp, " +
                                                               formatNumber(this.workChaExpGained, 3) + " cha exp.");
                }
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
        }

        this.gainWorkExp();
    }
    this.committingCrimeThruSingFn = false;
    this.singFnCrimeWorkerScript = null;
    var mainMenu = document.getElementById("mainmenu-container");
    mainMenu.style.visibility = "visible";
    this.isWorking = false;
    this.resetWorkStatus();
    Engine.loadLocationContent();
}

//Cancels the player's current "work" assignment and gives the proper rewards
//Used only for Singularity functions, so no popups are created
PlayerObject.prototype.singularityStopWork = function() {
    if (!this.isWorking) {return "";}
    var res; //Earnings text for work
    switch (this.workType) {
        case CONSTANTS.WorkTypeStudyClass:
            res =  this.finishClass(true);
            break;
        case CONSTANTS.WorkTypeCompany:
            res = this.finishWork(true, true);
            break;
        case CONSTANTS.WorkTypeCompanyPartTime:
            res = this.finishWorkPartTime(true);
            break;
        case CONSTANTS.WorkTypeFaction:
            res = this.finishFactionWork(true, true);
            break;
        case CONSTANTS.WorkTypeCreateProgram:
            res = this.finishCreateProgramWork(true, true);
            break;
        case CONSTANTS.WorkTypeCrime:
            res = this.finishCrime(true);
            break;
        default:
            console.log("ERROR: Unrecognized work type");
            return "";
    }
    return res;
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
    this.loseMoney(this.max_hp * CONSTANTS.HospitalCostPerHp);
    this.hp = this.max_hp;
}

/********* Company job application **********/
//Determines the job that the Player should get (if any) at the current company
//The 'sing' argument designates whether or not this is being called from
//the applyToCompany() Netscript Singularity function
PlayerObject.prototype.applyForJob = function(entryPosType, sing=false) {
    var currCompany = "";
    if (this.companyName != "") {
        currCompany = Companies[this.companyName];
    }
    var currPositionName = "";
    if (this.companyPosition != "") {
        currPositionName = this.companyPosition.positionName;
    }
	var company = Companies[this.location]; //Company being applied to
    if (sing && !(company instanceof Company)) {
        return "ERROR: Invalid company name: " + this.location + ". applyToCompany() failed";
    }

    var pos = entryPosType;

    if (!this.isQualified(company, pos)) {
        var reqText = getJobRequirementText(company, pos);
        if (sing) {return false;}
        dialogBoxCreate("Unforunately, you do not qualify for this position<br>" + reqText);
        return;
    }

    while (true) {
        if (Engine.Debug) {console.log("Determining qualification for next Company Position");}
        var newPos = getNextCompanyPosition(pos);
        if (newPos == null) {break;}

        //Check if this company has this position
        if (company.hasPosition(newPos)) {
            if (!this.isQualified(company, newPos)) {
                //If player not qualified for next job, break loop so player will be given current job
                break;
            }
            pos = newPos;
        } else {
            break;
        }
    }

    //Check if the determined job is the same as the player's current job
    if (currCompany != "") {
        if (currCompany.companyName == company.companyName &&
            pos.positionName == currPositionName) {
            var nextPos = getNextCompanyPosition(pos);
            if (nextPos == null) {
                if (sing) {return false;}
                dialogBoxCreate("You are already at the highest position for your field! No promotion available");
            } else if (company.hasPosition(nextPos)) {
                if (sing) {return false;}
                var reqText = getJobRequirementText(company, nextPos);
                dialogBoxCreate("Unfortunately, you do not qualify for a promotion<br>" + reqText);
            } else {
                if (sing) {return false;}
                dialogBoxCreate("You are already at the highest position for your field! No promotion available");
            }
            return; //Same job, do nothing
        }
    }


    //Lose reputation from a Company if you are leaving it for another job
    var leaveCompany = false;
    var oldCompanyName = "";
    if (currCompany != "") {
        if (currCompany.companyName != company.companyName) {
            leaveCompany = true;
            oldCompanyName = currCompany.companyName;
            company.playerReputation -= 1000;
            if (company.playerReputation < 0) {company.playerReputation = 0;}
        }
    }

    this.companyName = company.companyName;
    this.companyPosition = pos;

    if (this.firstJobRecvd === false) {
        this.firstJobRecvd = true;
        document.getElementById("job-tab").style.display = "list-item";
        document.getElementById("world-menu-header").click();
        document.getElementById("world-menu-header").click();
    }

    if (leaveCompany) {
        if (sing) {return true;}
        dialogBoxCreate("Congratulations! You were offered a new job at " + this.companyName + " as a " +
                        pos.positionName + "!<br>" +
                        "You lost 1000 reputation at your old company " + oldCompanyName + " because you left.");
    } else {
        if (sing) {return true;}
        dialogBoxCreate("Congratulations! You were offered a new job at " + this.companyName + " as a " + pos.positionName + "!");
    }

    Engine.loadLocationContent();
}

//Returns your next position at a company given the field (software, business, etc.)
PlayerObject.prototype.getNextCompanyPosition = function(company, entryPosType) {
    var currCompany = null;
    if (this.companyName != "") {
        currCompany = Companies[this.companyName];
    }

    //Not employed at this company, so return the entry position
    if (currCompany == null || (currCompany.companyName != company.companyName)) {
        return entryPosType;
    }

    //If the entry pos type and the player's current position have the same type,
    //return the player's "nextCompanyPosition". Otherwise return the entryposType
    //Employed at this company, so just return the next position if it exists.
    if ((this.companyPosition.isSoftwareJob() && entryPosType.isSoftwareJob()) ||
        (this.companyPosition.isITJob() && entryPosType.isITJob()) ||
        (this.companyPosition.isBusinessJob() && entryPosType.isBusinessJob()) ||
        (this.companyPosition.isSecurityEngineerJob() && entryPosType.isSecurityEngineerJob()) ||
        (this.companyPosition.isNetworkEngineerJob() && entryPosType.isNetworkEngineerJob()) ||
        (this.companyPosition.isSecurityJob() && entryPosType.isSecurityJob()) ||
        (this.companyPosition.isAgentJob() && entryPosType.isAgentJob()) ||
        (this.companyPosition.isSoftwareConsultantJob() && entryPosType.isSoftwareConsultantJob()) ||
        (this.companyPosition.isBusinessConsultantJob() && entryPosType.isBusinessConsultantJob()) ||
        (this.companyPosition.isPartTimeJob() && entryPosType.isPartTimeJob())) {
        return getNextCompanyPosition(this.companyPosition);
    }


    return entryPosType;
}

PlayerObject.prototype.applyForSoftwareJob = function(sing=false) {
    return this.applyForJob(CompanyPositions.SoftwareIntern, sing);
}

PlayerObject.prototype.applyForSoftwareConsultantJob = function(sing=false) {
    return this.applyForJob(CompanyPositions.SoftwareConsultant, sing);
}

PlayerObject.prototype.applyForItJob = function(sing=false) {
	return this.applyForJob(CompanyPositions.ITIntern, sing);
}

PlayerObject.prototype.applyForSecurityEngineerJob = function(sing=false) {
    var company = Companies[this.location]; //Company being applied to
    if (this.isQualified(company, CompanyPositions.SecurityEngineer)) {
        return this.applyForJob(CompanyPositions.SecurityEngineer, sing);
    } else {
        if (sing) {return false;}
        dialogBoxCreate("Unforunately, you do not qualify for this position");
    }
}

PlayerObject.prototype.applyForNetworkEngineerJob = function(sing=false) {
	var company = Companies[this.location]; //Company being applied to
    if (this.isQualified(company, CompanyPositions.NetworkEngineer)) {
        return this.applyForJob(CompanyPositions.NetworkEngineer, sing);
    } else {
        if (sing) {return false;}
        dialogBoxCreate("Unforunately, you do not qualify for this position");
    }
}

PlayerObject.prototype.applyForBusinessJob = function(sing=false) {
	return this.applyForJob(CompanyPositions.BusinessIntern, sing);
}

PlayerObject.prototype.applyForBusinessConsultantJob = function(sing=false) {
    return this.applyForJob(CompanyPositions.BusinessConsultant, sing);
}

PlayerObject.prototype.applyForSecurityJob = function(sing=false) {
    //TODO If case for POlice departments
	return this.applyForJob(CompanyPositions.SecurityGuard, sing);
}

PlayerObject.prototype.applyForAgentJob = function(sing=false) {
	var company = Companies[this.location]; //Company being applied to
    if (this.isQualified(company, CompanyPositions.FieldAgent)) {
        return this.applyForJob(CompanyPositions.FieldAgent, sing);
    } else {
        if (sing) {return false;}
        dialogBoxCreate("Unforunately, you do not qualify for this position");
    }
}

PlayerObject.prototype.applyForEmployeeJob = function(sing=false) {
	var company = Companies[this.location]; //Company being applied to
    if (this.isQualified(company, CompanyPositions.Employee)) {
        if (this.firstJobRecvd === false) {
            this.firstJobRecvd = true;
            document.getElementById("job-tab").style.display = "list-item";
            document.getElementById("world-menu-header").click();
            document.getElementById("world-menu-header").click();
        }
        this.companyName = company.companyName;
        this.companyPosition = CompanyPositions.Employee;
        if (sing) {return true;}
        dialogBoxCreate("Congratulations, you are now employed at " + this.companyName);
        Engine.loadLocationContent();
    } else {
        if (sing) {return false;}
        dialogBoxCreate("Unforunately, you do not qualify for this position");
    }
}

PlayerObject.prototype.applyForPartTimeEmployeeJob = function(sing=false) {
	var company = Companies[this.location]; //Company being applied to
    if (this.isQualified(company, CompanyPositions.PartTimeEmployee)) {
        if (this.firstJobRecvd === false) {
            this.firstJobRecvd = true;
            document.getElementById("job-tab").style.display = "list-item";
            document.getElementById("world-menu-header").click();
            document.getElementById("world-menu-header").click();
        }
        this.companyName = company.companyName;
        this.companyPosition = CompanyPositions.PartTimeEmployee;
        if (sing) {return true;}
        dialogBoxCreate("Congratulations, you are now employed part-time at " + this.companyName);
        Engine.loadLocationContent();
    } else {
        if (sing) {return false;}
        dialogBoxCreate("Unforunately, you do not qualify for this position");
    }
}

PlayerObject.prototype.applyForWaiterJob = function(sing=false) {
	var company = Companies[this.location]; //Company being applied to
    if (this.isQualified(company, CompanyPositions.Waiter)) {
        if (this.firstJobRecvd === false) {
            this.firstJobRecvd = true;
            document.getElementById("job-tab").style.display = "list-item";
            document.getElementById("world-menu-header").click();
            document.getElementById("world-menu-header").click();
        }
        this.companyName = company.companyName;
        this.companyPosition = CompanyPositions.Waiter;
        if (sing) {return true;}
        dialogBoxCreate("Congratulations, you are now employed as a waiter at " + this.companyName);
        Engine.loadLocationContent();
    } else {
        if (sing) {return false;}
        dialogBoxCreate("Unforunately, you do not qualify for this position");
    }
}

PlayerObject.prototype.applyForPartTimeWaiterJob = function(sing=false) {
	var company = Companies[this.location]; //Company being applied to
    if (this.isQualified(company, CompanyPositions.PartTimeWaiter)) {
        if (this.firstJobRecvd === false) {
            this.firstJobRecvd = true;
            document.getElementById("job-tab").style.display = "list-item";
            document.getElementById("world-menu-header").click();
            document.getElementById("world-menu-header").click();
        }
        this.companyName = company.companyName;
        this.companyPosition = CompanyPositions.PartTimeWaiter;
        if (sing) {return true;}
        dialogBoxCreate("Congratulations, you are now employed as a part-time waiter at " + this.companyName);
        Engine.loadLocationContent();
    } else {
        if (sing) {return false;}
        dialogBoxCreate("Unforunately, you do not qualify for this position");
    }
}

//Checks if the Player is qualified for a certain position
PlayerObject.prototype.isQualified = function(company, position) {
	var offset = company.jobStatReqOffset;
    var reqHacking = position.requiredHacking > 0       ? position.requiredHacking+offset   : 0;
    var reqStrength = position.requiredStrength > 0     ? position.requiredStrength+offset  : 0;
    var reqDefense = position.requiredDefense > 0       ? position.requiredDefense+offset   : 0;
    var reqDexterity = position.requiredDexterity > 0   ? position.requiredDexterity+offset : 0;
    var reqAgility = position.requiredDexterity > 0     ? position.requiredDexterity+offset : 0;
    var reqCharisma = position.requiredCharisma > 0     ? position.requiredCharisma+offset  : 0;

	if (this.hacking_skill >= reqHacking &&
		this.strength 	   >= reqStrength &&
        this.defense       >= reqDefense &&
        this.dexterity     >= reqDexterity &&
        this.agility       >= reqAgility &&
        this.charisma      >= reqCharisma &&
        company.playerReputation >= position.requiredReputation) {
            return true;
    }
    return false;
}

/********** Reapplying Augmentations and Source File ***********/
PlayerObject.prototype.reapplyAllAugmentations = function(resetMultipliers=true) {
    console.log("Re-applying augmentations");
    if (resetMultipliers) {
        this.resetMultipliers();
    }

    for (let i = 0; i < this.augmentations.length; ++i) {
        //Compatibility with new version
        if (this.augmentations[i].name === "HacknetNode NIC Architecture Neural-Upload") {
            this.augmentations[i].name = "Hacknet Node NIC Architecture Neural-Upload";
        }

        var augName = this.augmentations[i].name;
        var aug = Augmentations[augName];
        if (aug == null) {
            console.log("WARNING: Invalid augmentation name");
            continue;
        }
        aug.owned = true;
        if (aug.name == AugmentationNames.NeuroFluxGovernor) {
            for (let j = 0; j < aug.level; ++j) {
                applyAugmentation(this.augmentations[i], true);
            }
            continue;
        }
        applyAugmentation(this.augmentations[i], true);
    }
}

PlayerObject.prototype.reapplyAllSourceFiles = function() {
    console.log("Re-applying source files");
    //Will always be called after reapplyAllAugmentations() so multipliers do not have to be reset
    //this.resetMultipliers();

    for (let i = 0; i < this.sourceFiles.length; ++i) {
        var srcFileKey = "SourceFile" + this.sourceFiles[i].n;
        var sourceFileObject = SourceFiles[srcFileKey];
        if (sourceFileObject == null) {
            console.log("ERROR: Invalid source file number: " + this.sourceFiles[i].n);
            continue;
        }
        applySourceFile(this.sourceFiles[i]);
    }
}

/*************** Check for Faction Invitations *************/
//This function sets the requirements to join a Faction. It checks whether the Player meets
//those requirements and will return an array of all factions that the Player should
//receive an invitation to
PlayerObject.prototype.checkForFactionInvitations = function() {
    let invitedFactions = []; //Array which will hold all Factions th eplayer should be invited to

    var numAugmentations = this.augmentations.length;

    var company = Companies[this.companyName];
    var companyRep = 0;
    if (company != null) {
        companyRep = company.playerReputation;
    }

    //Illuminati
    var illuminatiFac = Factions["Illuminati"];
    if (!illuminatiFac.isBanned && !illuminatiFac.isMember && !illuminatiFac.alreadyInvited &&
        numAugmentations >= 30 &&
        this.money.gte(150000000000) &&
        this.hacking_skill >= 1500 &&
        this.strength >= 1200 && this.defense >= 1200 &&
        this.dexterity >= 1200 && this.agility >= 1200) {
        invitedFactions.push(illuminatiFac);
    }

    //Daedalus
    var daedalusFac = Factions["Daedalus"];
    if (!daedalusFac.isBanned && !daedalusFac.isMember && !daedalusFac.alreadyInvited &&
        numAugmentations >= 30 &&
        this.money.gte(100000000000) &&
        (this.hacking_skill >= 2500 ||
            (this.strength >= 1500 && this.defense >= 1500 &&
             this.dexterity >= 1500 && this.agility >= 1500))) {
        invitedFactions.push(daedalusFac);
    }

    //The Covenant
    var covenantFac = Factions["The Covenant"];
    if (!covenantFac.isBanned && !covenantFac.isMember && !covenantFac.alreadyInvited &&
        numAugmentations >= 30 &&
        this.money.gte(75000000000) &&
        this.hacking_skill >= 850 &&
        this.strength >= 850 &&
        this.defense >= 850 &&
        this.dexterity >= 850 &&
        this.agility >= 850) {
        invitedFactions.push(covenantFac);
    }

    //ECorp
    var ecorpFac = Factions["ECorp"];
    if (!ecorpFac.isBanned && !ecorpFac.isMember && !ecorpFac.alreadyInvited &&
        this.companyName == Locations.AevumECorp && companyRep >= CONSTANTS.CorpFactionRepRequirement) {
        invitedFactions.push(ecorpFac);
    }

    //MegaCorp
    var megacorpFac = Factions["MegaCorp"];
    if (!megacorpFac.isBanned && !megacorpFac.isMember && !megacorpFac.alreadyInvited &&
        this.companyName == Locations.Sector12MegaCorp && companyRep >= CONSTANTS.CorpFactionRepRequirement) {
        invitedFactions.push(megacorpFac);
    }

    //Bachman & Associates
    var bachmanandassociatesFac = Factions["Bachman & Associates"];
    if (!bachmanandassociatesFac.isBanned && !bachmanandassociatesFac.isMember &&
        !bachmanandassociatesFac.alreadyInvited &&
        this.companyName == Locations.AevumBachmanAndAssociates && companyRep >= CONSTANTS.CorpFactionRepRequirement) {
        invitedFactions.push(bachmanandassociatesFac);
    }

    //Blade Industries
    var bladeindustriesFac = Factions["Blade Industries"];
    if (!bladeindustriesFac.isBanned && !bladeindustriesFac.isMember && !bladeindustriesFac.alreadyInvited &&
        this.companyName == Locations.Sector12BladeIndustries && companyRep >= CONSTANTS.CorpFactionRepRequirement) {
        invitedFactions.push(bladeindustriesFac);
    }

    //NWO
    var nwoFac = Factions["NWO"];
    if (!nwoFac.isBanned && !nwoFac.isMember && !nwoFac.alreadyInvited &&
        this.companyName == Locations.VolhavenNWO && companyRep >= CONSTANTS.CorpFactionRepRequirement) {
        invitedFactions.push(nwoFac);
    }

    //Clarke Incorporated
    var clarkeincorporatedFac = Factions["Clarke Incorporated"];
    if (!clarkeincorporatedFac.isBanned && !clarkeincorporatedFac.isMember && !clarkeincorporatedFac.alreadyInvited &&
        this.companyName == Locations.AevumClarkeIncorporated && companyRep >= CONSTANTS.CorpFactionRepRequirement) {
        invitedFactions.push(clarkeincorporatedFac);
    }

    //OmniTek Incorporated
    var omnitekincorporatedFac = Factions["OmniTek Incorporated"];
    if (!omnitekincorporatedFac.isBanned && !omnitekincorporatedFac.isMember && !omnitekincorporatedFac.alreadyInvited &&
        this.companyName == Locations.VolhavenOmniTekIncorporated && companyRep >= CONSTANTS.CorpFactionRepRequirement) {
        invitedFactions.push(omnitekincorporatedFac);
    }

    //Four Sigma
    var foursigmaFac = Factions["Four Sigma"];
    if (!foursigmaFac.isBanned && !foursigmaFac.isMember && !foursigmaFac.alreadyInvited &&
        this.companyName == Locations.Sector12FourSigma && companyRep >= CONSTANTS.CorpFactionRepRequirement) {
        invitedFactions.push(foursigmaFac);
    }

    //KuaiGong International
    var kuaigonginternationalFac = Factions["KuaiGong International"];
    if (!kuaigonginternationalFac.isBanned && !kuaigonginternationalFac.isMember &&
        !kuaigonginternationalFac.alreadyInvited &&
        this.companyName == Locations.ChongqingKuaiGongInternational && companyRep >= CONSTANTS.CorpFactionRepRequirement) {
        invitedFactions.push(kuaigonginternationalFac);
    }

    //Fulcrum Secret Technologies - If u've unlocked fulcrum secret technolgoies server and have a high rep with the company
    var fulcrumsecrettechonologiesFac = Factions["Fulcrum Secret Technologies"];
    var fulcrumSecretServer = AllServers[SpecialServerIps[SpecialServerNames.FulcrumSecretTechnologies]];
    if (fulcrumSecretServer == null) {
        console.log("ERROR: Could not find Fulcrum Secret Technologies Server");
    } else {
        if (!fulcrumsecrettechonologiesFac.isBanned && !fulcrumsecrettechonologiesFac.isMember &&
            !fulcrumsecrettechonologiesFac.alreadyInvited &&
            fulcrumSecretServer.manuallyHacked &&
            this.companyName == Locations.AevumFulcrumTechnologies && companyRep >= 250000) {
            invitedFactions.push(fulcrumsecrettechonologiesFac);
        }
    }

    //BitRunners
    var bitrunnersFac = Factions["BitRunners"];
    var homeComp = this.getHomeComputer();
    var bitrunnersServer = AllServers[SpecialServerIps[SpecialServerNames.BitRunnersServer]];
    if (bitrunnersServer == null) {
        console.log("ERROR: Could not find BitRunners Server");
    } else if (!bitrunnersFac.isBanned && !bitrunnersFac.isMember && bitrunnersServer.manuallyHacked &&
               !bitrunnersFac.alreadyInvited && this.hacking_skill >= 500 && homeComp.maxRam >= 128) {
        invitedFactions.push(bitrunnersFac);
    }

    //The Black Hand
    var theblackhandFac = Factions["The Black Hand"];
    var blackhandServer = AllServers[SpecialServerIps[SpecialServerNames.TheBlackHandServer]];
    if (blackhandServer == null) {
        console.log("ERROR: Could not find The Black Hand Server");
    } else if (!theblackhandFac.isBanned && !theblackhandFac.isMember && blackhandServer.manuallyHacked &&
               !theblackhandFac.alreadyInvited && this.hacking_skill >= 350 && homeComp.maxRam >= 64) {
        invitedFactions.push(theblackhandFac);
    }

    //NiteSec
    var nitesecFac = Factions["NiteSec"];
    var nitesecServer = AllServers[SpecialServerIps[SpecialServerNames.NiteSecServer]];
    if (nitesecServer == null) {
        console.log("ERROR: Could not find NiteSec Server");
    } else if (!nitesecFac.isBanned && !nitesecFac.isMember && nitesecServer.manuallyHacked &&
               !nitesecFac.alreadyInvited && this.hacking_skill >= 200 && homeComp.maxRam >= 32) {
        invitedFactions.push(nitesecFac);
    }

    //Chongqing
    var chongqingFac = Factions["Chongqing"];
    if (!chongqingFac.isBanned && !chongqingFac.isMember && !chongqingFac.alreadyInvited &&
        this.money.gte(20000000) && this.city == Locations.Chongqing) {
        invitedFactions.push(chongqingFac);
    }

    //Sector-12
    var sector12Fac = Factions["Sector-12"];
    if (!sector12Fac.isBanned && !sector12Fac.isMember && !sector12Fac.alreadyInvited &&
        this.money.gte(15000000) && this.city == Locations.Sector12) {
        invitedFactions.push(sector12Fac);
    }

    //New Tokyo
    var newtokyoFac = Factions["New Tokyo"];
    if (!newtokyoFac.isBanned && !newtokyoFac.isMember && !newtokyoFac.alreadyInvited &&
        this.money.gte(20000000) && this.city == Locations.NewTokyo) {
        invitedFactions.push(newtokyoFac);
    }

    //Aevum
    var aevumFac = Factions["Aevum"];
    if (!aevumFac.isBanned && !aevumFac.isMember  && !aevumFac.alreadyInvited &&
        this.money.gte(40000000) && this.city == Locations.Aevum) {
        invitedFactions.push(aevumFac);
    }

    //Ishima
    var ishimaFac = Factions["Ishima"];
    if (!ishimaFac.isBanned && !ishimaFac.isMember && !ishimaFac.alreadyInvited &&
        this.money.gte(30000000) && this.city == Locations.Ishima) {
        invitedFactions.push(ishimaFac);
    }

    //Volhaven
    var volhavenFac = Factions["Volhaven"];
    if (!volhavenFac.isBanned && !volhavenFac.isMember && !volhavenFac.alreadyInvited &&
        this.money.gte(50000000) && this.city == Locations.Volhaven) {
        invitedFactions.push(volhavenFac);
    }

    //Speakers for the Dead
    var speakersforthedeadFac = Factions["Speakers for the Dead"];
    if (!speakersforthedeadFac.isBanned && !speakersforthedeadFac.isMember && !speakersforthedeadFac.alreadyInvited &&
        this.hacking_skill >= 100 && this.strength >= 300 && this.defense >= 300 &&
        this.dexterity >= 300 && this.agility >= 300 && this.numPeopleKilled >= 30 &&
        this.karma <= -45 && this.companyName != Locations.Sector12CIA &&
        this.companyName != Locations.Sector12NSA) {
        invitedFactions.push(speakersforthedeadFac);
    }

    //The Dark Army
    var thedarkarmyFac = Factions["The Dark Army"];
    if (!thedarkarmyFac.isBanned && !thedarkarmyFac.isMember && !thedarkarmyFac.alreadyInvited &&
        this.hacking_skill >= 300 && this.strength >= 300 && this.defense >= 300 &&
        this.dexterity >= 300 && this.agility >= 300 && this.city == Locations.Chongqing &&
        this.numPeopleKilled >= 5 && this.karma <= -45 && this.companyName != Locations.Sector12CIA &&
        this.companyName != Locations.Sector12NSA) {
        invitedFactions.push(thedarkarmyFac);
    }

    //The Syndicate
    var thesyndicateFac = Factions["The Syndicate"];
    if (!thesyndicateFac.isBanned && !thesyndicateFac.isMember && !thesyndicateFac.alreadyInvited &&
        this.hacking_skill >= 200 && this.strength >= 200 && this.defense >= 200 &&
        this.dexterity >= 200 && this.agility >= 200 &&
        (this.city == Locations.Aevum || this.city == Locations.Sector12) &&
        this.money.gte(10000000) && this.karma <= -90 &&
        this.companyName != Locations.Sector12CIA && this.companyName != Locations.Sector12NSA) {
        invitedFactions.push(thesyndicateFac);
    }

    //Silhouette
    var silhouetteFac = Factions["Silhouette"];
    if (!silhouetteFac.isBanned && !silhouetteFac.isMember && !silhouetteFac.alreadyInvited &&
        (this.companyPosition.positionName == CompanyPositions.CTO.positionName ||
         this.companyPosition.positionName == CompanyPositions.CFO.positionName ||
         this.companyPosition.positionName == CompanyPositions.CEO.positionName) &&
         this.money.gte(15000000) && this.karma <= -22) {
        invitedFactions.push(silhouetteFac);
    }

    //Tetrads
    var tetradsFac = Factions["Tetrads"];
    if (!tetradsFac.isBanned && !tetradsFac.isMember && !tetradsFac.alreadyInvited &&
        (this.city == Locations.Chongqing || this.city == Locations.NewTokyo ||
        this.city == Locations.Ishima) && this.strength >= 75 && this.defense >= 75 &&
        this.dexterity >= 75 && this.agility >= 75 && this.karma <= -18) {
        invitedFactions.push(tetradsFac);
    }

    //SlumSnakes
    var slumsnakesFac = Factions["Slum Snakes"];
    if (!slumsnakesFac.isBanned && !slumsnakesFac.isMember && !slumsnakesFac.alreadyInvited &&
        this.strength >= 30 && this.defense >= 30 && this.dexterity >= 30 &&
        this.agility >= 30 && this.karma <= -9 && this.money.gte(1000000)) {
        invitedFactions.push(slumsnakesFac);
    }

    //Netburners
    var netburnersFac = Factions["Netburners"];
    var totalHacknetRam = 0;
    var totalHacknetCores = 0;
    var totalHacknetLevels = 0;
    for (var i = 0; i < this.hacknetNodes.length; ++i) {
        totalHacknetLevels += this.hacknetNodes[i].level;
        totalHacknetRam += this.hacknetNodes[i].ram;
        totalHacknetCores += this.hacknetNodes[i].cores;
    }
    if (!netburnersFac.isBanned && !netburnersFac.isMember && !netburnersFac.alreadyInvited &&
        this.hacking_skill >= 80 && totalHacknetRam >= 8 &&
        totalHacknetCores >= 4 && totalHacknetLevels >= 100) {
        invitedFactions.push(netburnersFac);
    }

    //Tian Di Hui
    var tiandihuiFac = Factions["Tian Di Hui"];
    if (!tiandihuiFac.isBanned &&  !tiandihuiFac.isMember && !tiandihuiFac.alreadyInvited &&
        this.money.gte(1000000) && this.hacking_skill >= 50 &&
        (this.city == Locations.Chongqing || this.city == Locations.NewTokyo ||
         this.city == Locations.Ishima)) {
        invitedFactions.push(tiandihuiFac);
    }

    //CyberSec
    var cybersecFac = Factions["CyberSec"];
    var cybersecServer = AllServers[SpecialServerIps[SpecialServerNames.CyberSecServer]];
    if (cybersecServer == null) {
        console.log("ERROR: Could not find CyberSec Server");
    } else if (!cybersecFac.isBanned && !cybersecFac.isMember && cybersecServer.manuallyHacked &&
               !cybersecFac.alreadyInvited && this.hacking_skill >= 50) {
        invitedFactions.push(cybersecFac);
    }

    return invitedFactions;
}


/*************** Gang ****************/
//Returns true if Player is in a gang and false otherwise
PlayerObject.prototype.inGang = function() {
    if (this.gang == null || this.gang == undefined) {return false;}
    return (this.gang instanceof Gang);
}

PlayerObject.prototype.startGang = function(factionName, hacking) {
    this.gang = new Gang(factionName, hacking);
}

/************* BitNodes **************/
PlayerObject.prototype.setBitNodeNumber = function(n) {
    this.bitNodeN = n;
}

/* Functions for saving and loading the Player data */
function loadPlayer(saveString) {
    Player  = JSON.parse(saveString, Reviver);

    //Parse Decimal.js objects
    Player.money = new Decimal(Player.money);
    Player.total_money = new Decimal(Player.total_money);
    Player.lifetime_money = new Decimal(Player.lifetime_money);

    if (Player.corporation instanceof Corporation) {
        Player.corporation.funds = new Decimal(Player.corporation.funds);
        Player.corporation.revenue = new Decimal(Player.corporation.revenue);
        Player.corporation.expenses = new Decimal(Player.corporation.expenses);

        for (var i = 0; i < Player.corporation.divisions.length; ++i) {
            var ind = Player.corporation.divisions[i];
            ind.lastCycleRevenue = new Decimal(ind.lastCycleRevenue);
            ind.lastCycleExpenses = new Decimal(ind.lastCycleExpenses);
            ind.thisCycleRevenue = new Decimal(ind.thisCycleRevenue);
            ind.thisCycleExpenses = new Decimal(ind.thisCycleExpenses);
        }
    }
}

PlayerObject.prototype.toJSON = function() {
    return Generic_toJSON("PlayerObject", this);
}

PlayerObject.fromJSON = function(value) {
    return Generic_fromJSON(PlayerObject, value.data);
}

Reviver.constructors.PlayerObject = PlayerObject;

let Player = new PlayerObject();
export {Player, loadPlayer};
