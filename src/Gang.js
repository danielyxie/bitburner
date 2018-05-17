import {CONSTANTS}                              from "./Constants.js";
import {Engine}                                 from "./engine.js";
import {Faction, Factions,
        displayFactionContent}                  from "./Faction.js";
import {Player}                                 from "./Player.js";
import {dialogBoxCreate}                        from "../utils/DialogBox.js";
import {Reviver, Generic_toJSON,
        Generic_fromJSON}                       from "../utils/JSONReviver.js";
import {getRandomInt, createElement,
        removeChildrenFromElement,
        createAccordionElement, createPopup,
        removeElementById, removeElement}       from "../utils/HelperFunctions.js";
import  numeral                                 from "../utils/numeral.min.js";
import {formatNumber}                           from "../utils/StringHelperFunctions.js";
import {yesNoBoxCreate, yesNoTxtInpBoxCreate,
        yesNoBoxGetYesButton, yesNoBoxGetNoButton,
        yesNoTxtInpBoxGetYesButton, yesNoTxtInpBoxGetNoButton,
        yesNoTxtInpBoxGetInput, yesNoBoxClose,
        yesNoTxtInpBoxClose, yesNoBoxOpen}      from "../utils/YesNoBox.js";

/* Gang.js */
//Switch between territory and management screen with 1 and 2
$(document).keydown(function(event) {
    if (Engine.currentPage == Engine.Page.Gang && !yesNoBoxOpen) {
        if (gangMemberFilter != null && gangMemberFilter === document.activeElement) {return;}
        if (event.keyCode === 49) {
            if(gangTerritorySubpage.style.display === "block") {
                managementButton.click();
            }
        } else if (event.keyCode === 50) {
            if (gangManagementSubpage.style.display === "block") {
                territoryButton.click();
            }
        }
    }
});

//Delete upgrade box when clicking outside
$(document).mousedown(function(event) {
    var boxId = "gang-member-upgrade-popup-box";
    var contentId = "gang-member-upgrade-popup-box-content";
    if (gangMemberUpgradeBoxOpened) {
        if ( $(event.target).closest("#" + contentId).get(0) == null ) {
            //Delete the box
            removeElement(gangMemberUpgradeBox);
            gangMemberUpgradeBox = null;
            gangMemberUpgradeBoxContent = null;
            gangMemberUpgradeBoxOpened = false;
            gangMemberUpgradeBoxElements = null;
        }
    }
});

let GangNames = ["Slum Snakes", "Tetrads", "The Syndicate", "The Dark Army", "Speakers for the Dead",
             "NiteSec", "The Black Hand"];
let AllGangs = {
    "Slum Snakes" : {
        power: 1,
        territory: 1/7,
    },
    "Tetrads" : {
        power: 1,
        territory: 1/7,
    },
    "The Syndicate" : {
        power: 1,
        territory: 1/7,
    },
    "The Dark Army" : {
        power: 1,
        territory: 1/7,
    },
    "Speakers for the Dead" : {
        power: 1,
        territory: 1/7,
    },
    "NiteSec" : {
        power: 1,
        territory: 1/7,
    },
    "The Black Hand" : {
        power: 1,
        territory: 1/7,
    },
}

function resetGangs() {
    AllGangs = {
        "Slum Snakes" : {
            power: 1,
            territory: 1/7,
        },
        "Tetrads" : {
            power: 1,
            territory: 1/7,
        },
        "The Syndicate" : {
            power: 1,
            territory: 1/7,
        },
        "The Dark Army" : {
            power: 1,
            territory: 1/7,
        },
        "Speakers for the Dead" : {
            power: 1,
            territory: 1/7,
        },
        "NiteSec" : {
            power: 1,
            territory: 1/7,
        },
        "The Black Hand" : {
            power: 1,
            territory: 1/7,
        },
    }
}

function loadAllGangs(saveString) {
    AllGangs = JSON.parse(saveString, Reviver);
}

//Power is an estimate of a gang's ability to gain/defend territory
let gangStoredPowerCycles = 0;
function processAllGangPowerGains(numCycles=1) {
    if (!Player.inGang()) {return;}
    gangStoredPowerCycles += numCycles;
    if (gangStoredPowerCycles < 150) {return;}
    var playerGangName = Player.gang.facName;
    for (var name in AllGangs) {
        if (AllGangs.hasOwnProperty(name)) {
            if (name == playerGangName) {
                AllGangs[name].power += Player.gang.calculatePower();
            } else {
                var gain = Math.random() * 0.02; //TODO Adjust as necessary
                AllGangs[name].power += (gain);
            }
        }
    }

    gangStoredPowerCycles -= 150;
}

let gangStoredTerritoryCycles = 0;
function processAllGangTerritory(numCycles=1) {
    if (!Player.inGang()) {return;}
    gangStoredTerritoryCycles += numCycles;
    if (gangStoredTerritoryCycles < CONSTANTS.GangTerritoryUpdateTimer) {return;}

    for (var i = 0; i < GangNames.length; ++i) {
        var other = getRandomInt(0, GangNames.length-1);
        while(other == i) {
            other = getRandomInt(0, GangNames.length-1);
        }
        var thisPwr = AllGangs[GangNames[i]].power;
        var otherPwr = AllGangs[GangNames[other]].power;
        var thisChance = thisPwr / (thisPwr + otherPwr);

        if (Math.random() < thisChance) {
            if (AllGangs[GangNames[other]].territory <= 0) {
                return;
            }
            AllGangs[GangNames[i]].territory += 0.0001;
            AllGangs[GangNames[other]].territory -= 0.0001;
        } else {
            if (AllGangs[GangNames[i]].territory <= 0) {
                return;
            }
            AllGangs[GangNames[i]].territory -= 0.0001;
            AllGangs[GangNames[other]].territory += 0.0001;
        }
    }

    gangStoredTerritoryCycles -= CONSTANTS.GangTerritoryUpdateTimer;
}

/*  faction - Name of corresponding faction
    hacking - Boolean indicating whether its a hacking gang or not
 */
function Gang(facName, hacking=false) {
    this.facName    = facName;
    this.members    = [];  //Array of GangMembers
    this.wanted     = 1;
    this.respect    = 1;
    this.power      = 0;

    this.isHackingGang = hacking;

    this.respectGainRate = 0;
    this.wantedGainRate = 0;
    this.moneyGainRate = 0;

    //When processing gains, this stores the number of cycles until some
    //limit is reached, and then calculates and applies the gains only at that limit
    this.storedCycles   = 0;
}

Gang.prototype.process = function(numCycles=1) {
    this.processGains(numCycles);
    this.processExperienceGains(numCycles);
    processAllGangPowerGains(numCycles);
    processAllGangTerritory(numCycles);
}

Gang.prototype.processGains = function(numCycles=1) {
    this.storedCycles += numCycles;
    if (isNaN(this.storedCycles)) {
        console.log("ERROR: Gang's storedCylces is NaN");
        this.storedCycles = 0;
    }
    if (this.storedCycles < 25) {return;} //Only process every 5 seconds at least

    //Get gains per cycle
    var moneyGains = 0, respectGains = 0, wantedLevelGains = 0;
    for (var i = 0; i < this.members.length; ++i) {
        respectGains += (this.members[i].calculateRespectGain());
        wantedLevelGains += (this.members[i].calculateWantedLevelGain());
        moneyGains += (this.members[i].calculateMoneyGain());
    }
    this.respectGainRate = respectGains;
    this.wantedGainRate = wantedLevelGains;
    this.moneyGainRate = moneyGains;

    if (!isNaN(respectGains)) {
        var gain = respectGains * this.storedCycles;
        this.respect += (gain);
        //Faction reputation gains is respect gain divided by some constant
        var fac = Factions[this.facName];
        if (!(fac instanceof Faction)) {
            dialogBoxCreate("ERROR: Could not get Faction associates with your gang. This is a bug, please report to game dev");
        } else {
            var favorMult = 1 + (fac.favor / 100);
            fac.playerReputation += ((Player.faction_rep_mult * gain * favorMult) / CONSTANTS.GangRespectToReputationRatio);
        }

    } else {
        console.log("ERROR: respectGains is NaN");
    }
    if (!isNaN(wantedLevelGains)) {
        if (this.wanted === 1 && wantedLevelGains < 0) {
            //Do nothing
        } else {
            this.wanted += (wantedLevelGains * this.storedCycles);
            if (this.wanted < 1) {this.wanted = 1;}
        }
    } else {
        console.log("ERROR: wantedLevelGains is NaN");
    }
    if (!isNaN(moneyGains)) {
        Player.gainMoney(moneyGains * this.storedCycles);
    } else {
        console.log("ERROR: respectGains is NaN");
    }

    this.storedCycles = 0;
}

Gang.prototype.processExperienceGains = function(numCycles=1) {
    for (var i = 0; i < this.members.length; ++i) {
        this.members[i].gainExperience(numCycles);
        this.members[i].updateSkillLevels();
    }
}

//Calculates power GAIN, which is added onto the Gang's existing power
Gang.prototype.calculatePower = function() {
    var memberTotal = 0;
    for (var i = 0; i < this.members.length; ++i) {
        if (this.members[i].task instanceof GangMemberTask &&
            this.members[i].task.name == "Territory Warfare") {
            memberTotal += this.members[i].calculatePower();
        }
    }
    return (0.0005 * memberTotal);
}

Gang.prototype.autoAssignMemberToTask = function(taskName) {
    for (var i = 0; i < this.members.length; ++i) {
        if (this.members[i].task.name === taskName) {
            this.members[i].assignToTask(taskName);
            return true;
        }
    }
    return false;
}

Gang.prototype.autoUnassignMemberFromTask = function(taskName) {
    for (var i = 0; i < this.members.length; ++i) {
        if (this.members[i].task.name === taskName) {
            this.members[i].unassignFromTask();
            return true;
        }
    }
    return false;
}

Gang.prototype.toJSON = function() {
	return Generic_toJSON("Gang", this);
}

Gang.fromJSON = function(value) {
	return Generic_fromJSON(Gang, value.data);
}

Reviver.constructors.Gang = Gang;

/*** Gang Member object ***/
function GangMember(name) {
    this.name   = name;
    this.task   = GangMemberTasks["Unassigned"]; //GangMemberTask object
    this.city   = Player.city;

    this.hack   = 1;
    this.str    = 1;
    this.def    = 1;
    this.dex    = 1;
    this.agi    = 1;
    this.cha    = 1;

    this.hack_exp   = 0;
    this.str_exp    = 0;
    this.def_exp    = 0;
    this.dex_exp    = 0;
    this.agi_exp    = 0;
    this.cha_exp    = 0;

    this.hack_mult  = 1;
    this.str_mult   = 1;
    this.def_mult   = 1;
    this.dex_mult   = 1;
    this.agi_mult   = 1;
    this.cha_mult   = 1;

    this.upgrades = []; //Names of upgrades
}

//Same formula for Player
GangMember.prototype.calculateSkill = function(exp) {
    return Math.max(Math.floor(32 * Math.log(exp + 534.5) - 200), 1);
}

GangMember.prototype.updateSkillLevels = function() {
    this.hack   = Math.floor(this.calculateSkill(this.hack_exp) * this.hack_mult);
    this.str    = Math.floor(this.calculateSkill(this.str_exp) * this.str_mult);
    this.def    = Math.floor(this.calculateSkill(this.def_exp) * this.def_mult);
    this.dex    = Math.floor(this.calculateSkill(this.dex_exp) * this.dex_mult);
    this.agi    = Math.floor(this.calculateSkill(this.agi_exp) * this.agi_mult);
    this.cha    = Math.floor(this.calculateSkill(this.cha_exp) * this.cha_mult);
}

GangMember.prototype.calculatePower = function() {
    return (this.hack + this.str + this.def +
            this.dex + this.agi + this.cha) / 100;
}

GangMember.prototype.assignToTask = function(taskName) {
    if (GangMemberTasks.hasOwnProperty(taskName)) {
        this.task = GangMemberTasks[taskName];
    } else {
        this.task = GangMemberTasks["Unassigned"];
    }
}

GangMember.prototype.unassignFromTask = function() {
    if (GangMemberTasks.hasOwnProperty("Unassigned")) {
        this.task = GangMemberTasks["Unassigned"];
    } else {
        console.log("ERROR: Can't find Unassigned Gang member task");
        this.task = null;
    }
}

//Gains are per cycle
GangMember.prototype.calculateRespectGain = function() {
    var task = this.task;
    if (task == null || !(task instanceof GangMemberTask) || task.baseRespect === 0) {return 0;}
    var statWeight =    (task.hackWeight/100) * this.hack +
                        (task.strWeight/100) * this.str +
                        (task.defWeight/100) * this.def +
                        (task.dexWeight/100) * this.dex +
                        (task.agiWeight/100) * this.agi +
                        (task.chaWeight/100) * this.cha;
    statWeight -= (3.5 * task.difficulty);
    if (statWeight <= 0) {return 0;}
    var territoryMult = AllGangs[Player.gang.facName].territory;
    if (territoryMult <= 0) {return 0;}
    var respectMult = (Player.gang.respect) / (Player.gang.respect + Player.gang.wanted);
    return 12 * task.baseRespect * statWeight * territoryMult * respectMult;
}

GangMember.prototype.calculateWantedLevelGain = function() {
    var task = this.task;
    if (task == null || !(task instanceof GangMemberTask) || task.baseWanted === 0) {return 0;}
    var statWeight =    (task.hackWeight/100) * this.hack +
                        (task.strWeight/100) * this.str +
                        (task.defWeight/100) * this.def +
                        (task.dexWeight/100) * this.dex +
                        (task.agiWeight/100) * this.agi +
                        (task.chaWeight/100) * this.cha;
    statWeight -= (3.5 * task.difficulty);
    if (statWeight <= 0) {return 0;}
    var territoryMult = AllGangs[Player.gang.facName].territory;
    if (territoryMult <= 0) {return 0;}
    if (task.baseWanted < 0) {
        return task.baseWanted * statWeight * territoryMult;
    } else {
        return 6 * task.baseWanted / (3 * statWeight * territoryMult);
    }
}

GangMember.prototype.calculateMoneyGain = function() {
    var task = this.task;
    if (task == null || !(task instanceof GangMemberTask) || task.baseMoney === 0) {return 0;}
    var statWeight =    (task.hackWeight/100) * this.hack +
                        (task.strWeight/100) * this.str +
                        (task.defWeight/100) * this.def +
                        (task.dexWeight/100) * this.dex +
                        (task.agiWeight/100) * this.agi +
                        (task.chaWeight/100) * this.cha;
    statWeight -= (3.5 * task.difficulty);
    if (statWeight <= 0) {return 0;}
    var territoryMult = AllGangs[Player.gang.facName].territory;
    if (territoryMult <= 0) {return 0;}
    var respectMult = (Player.gang.respect) / (Player.gang.respect + Player.gang.wanted);
    return 5 * task.baseMoney * statWeight * territoryMult * respectMult;
}

GangMember.prototype.gainExperience = function(numCycles=1) {
    var task = this.task;
    if (task == null || !(task instanceof GangMemberTask)) {return;}
    this.hack_exp   += (task.hackWeight / 1500) * task.difficulty * numCycles;
    this.str_exp    += (task.strWeight / 1500) * task.difficulty * numCycles;
    this.def_exp    += (task.defWeight / 1500) * task.difficulty * numCycles;
    this.dex_exp    += (task.dexWeight / 1500) * task.difficulty * numCycles;
    this.agi_exp    += (task.agiWeight / 1500) * task.difficulty * numCycles;
    this.cha_exp    += (task.chaWeight / 1500) * task.difficulty * numCycles;
}

GangMember.prototype.toJSON = function() {
	return Generic_toJSON("GangMember", this);
}

GangMember.fromJSON = function(value) {
	return Generic_fromJSON(GangMember, value.data);
}

Reviver.constructors.GangMember = GangMember;

//Defines tasks that Gang Members can work on
function GangMemberTask(name="", desc="",
                        params={baseRespect: 0, baseWanted: 0, baseMoney: 0,
                                hackWeight: 0, strWeight: 0, defWeight: 0,
                                dexWeight: 0, agiWeight: 0, chaWeight: 0,
                                difficulty: 0}) {
    this.name = name;
    this.desc = desc;

    this.baseRespect    = params.baseRespect ? params.baseRespect   : 0;
    this.baseWanted     = params.baseWanted  ? params.baseWanted    : 0;
    this.baseMoney      = params.baseMoney   ? params.baseMoney     : 0;

    //Weights must add up to 100
    this.hackWeight     = params.hackWeight ? params.hackWeight : 0;
    this.strWeight      = params.strWeight  ? params.strWeight  : 0;
    this.defWeight      = params.defWeight  ? params.defWeight  : 0;
    this.dexWeight      = params.dexWeight  ? params.dexWeight  : 0;
    this.agiWeight      = params.agiWeight  ? params.agiWeight  : 0;
    this.chaWeight      = params.chaWeight  ? params.chaWeight  : 0;

    //1 - 100
    this.difficulty     = params.difficulty ? params.difficulty : 1;
}

GangMemberTask.prototype.toJSON = function() {
	return Generic_toJSON("GangMemberTask", this);
}

GangMemberTask.fromJSON = function(value) {
	return Generic_fromJSON(GangMemberTask, value.data);
}

Reviver.constructors.GangMemberTask = GangMemberTask;

//TODO Human trafficking and an equivalent hacking crime
let GangMemberTasks = {
    "Unassigned" :              new GangMemberTask(
                                        "Unassigned",
                                        "This gang member is currently idle"),
    "Ransomware" :              new GangMemberTask(
                                        "Ransomware",
                                        "Assign this gang member to create and distribute ransomware<br><br>" +
                                        "Earns money - Slightly increases respect - Slightly increases wanted level",
                                        {baseRespect: 0.00005, baseWanted: 0.00001, baseMoney: 1,
                                         hackWeight: 100, difficulty: 1}),
    "Phishing" :                new GangMemberTask(
                                        "Phishing",
                                        "Assign this gang member to attempt phishing scams and attacks<br><br>" +
                                        "Earns money - Slightly increases respect - Slightly increases wanted level",
                                        {baseRespect: 0.00008, baseWanted: 0.001, baseMoney: 2.5,
                                         hackWeight: 85, chaWeight: 15, difficulty: 3}),
    "Identity Theft" :          new GangMemberTask(
                                        "Identity Theft",
                                        "Assign this gang member to attempt identity theft<br><br>" +
                                        "Earns money - Increases respect - Increases wanted level",
                                        {baseRespect: 0.0001, baseWanted: 0.01, baseMoney: 6,
                                         hackWeight: 80, chaWeight: 20, difficulty: 4}),
    "DDoS Attacks" :            new GangMemberTask(
                                        "DDoS Attacks",
                                        "Assign this gang member to carry out DDoS attacks<br><br>" +
                                        "Increases respect - Increases wanted level",
                                        {baseRespect: 0.0004, baseWanted: 0.05,
                                         hackWeight: 100, difficulty: 7}),
    "Plant Virus" :             new GangMemberTask(
                                        "Plant Virus",
                                        "Assign this gang member to create and distribute malicious viruses<br><br>" +
                                        "Increases respect - Increases wanted level",
                                        {baseRespect: 0.0006, baseWanted: 0.05,
                                         hackWeight: 100, difficulty: 10}),
    "Fraud & Counterfeiting" :  new GangMemberTask(
                                        "Fraud & Counterfeiting",
                                        "Assign this gang member to commit financial fraud and digital counterfeiting<br><br>" +
                                        "Earns money - Slightly increases respect - Slightly increases wanted level",
                                        {baseRespect: 0.0005, baseWanted: 0.1, baseMoney: 15,
                                         hackWeight: 80, chaWeight: 20, difficulty: 17}),
    "Money Laundering" :        new GangMemberTask(
                                        "Money Laundering",
                                        "Assign this gang member to launder money<br><br>" +
                                        "Earns money - Increases respect - Increases wanted level",
                                        {baseRespect: 0.0006, baseWanted:0.2, baseMoney: 40,
                                         hackWeight: 75, chaWeight: 25, difficulty: 20}),
    "Cyberterrorism" :          new GangMemberTask(
                                        "Cyberterrorism",
                                        "Assign this gang member to commit acts of cyberterrorism<br><br>" +
                                        "Greatly increases respect - Greatly increases wanted level",
                                        {baseRespect: 0.001, baseWanted: 0.5,
                                         hackWeight: 80, chaWeight: 20, difficulty: 33}),
    "Ethical Hacking" :         new GangMemberTask(
                                        "Ethical Hacking",
                                        "Assign this gang member to be an ethical hacker for corporations<br><br>" +
                                        "Earns money - Lowers wanted level",
                                        {baseWanted: -0.001, baseMoney: 1,
                                         hackWeight: 90, chaWeight: 10, difficulty: 1}),
    "Mug People" :              new GangMemberTask(
                                        "Mug People",
                                        "Assign this gang member to mug random people on the streets<br><br>" +
                                        "Earns money - Slightly increases respect - Very slightly increases wanted level",
                                         {baseRespect: 0.00005, baseWanted: 0.00001, baseMoney: 1,
                                          strWeight: 25, defWeight: 25, dexWeight: 25, agiWeight: 10, chaWeight: 15, difficulty: 1}),
    "Deal Drugs" :              new GangMemberTask(
                                        "Deal Drugs",
                                        "Assign this gang member to sell drugs.<br><br>" +
                                        "Earns money - Slightly increases respect - Slightly increases wanted level",
                                        {baseRespect: 0.00008, baseWanted: 0.001, baseMoney: 4,
                                         agiWeight: 20, dexWeight: 20, chaWeight: 60, difficulty: 3}),
    "Run a Con" :               new GangMemberTask(
                                        "Run a Con",
                                        "Assign this gang member to run cons<br><br>" +
                                        "Earns money - Increases respect - Increases wanted level",
                                        {baseRespect: 0.00015, baseWanted: 0.01, baseMoney: 10,
                                         strWeight: 5, defWeight: 5, agiWeight: 25, dexWeight: 25, chaWeight: 40, difficulty: 10}),
    "Armed Robbery" :           new GangMemberTask(
                                        "Armed Robbery",
                                        "Assign this gang member to commit armed robbery on stores, banks and armored cars<br><br>" +
                                        "Earns money - Increases respect - Increases wanted level",
                                        {baseRespect: 0.00015, baseWanted: 0.05, baseMoney: 25,
                                         hackWeight: 20, strWeight: 15, defWeight: 15, agiWeight: 10, dexWeight: 20, chaWeight: 20,
                                         difficulty: 17}),
    "Traffick Illegal Arms" :   new GangMemberTask(
                                        "Traffick Illegal Arms",
                                        "Assign this gang member to traffick illegal arms<br><br>" +
                                        "Earns money - Increases respect - Increases wanted level",
                                        {baseRespect: 0.0003, baseWanted: 0.1, baseMoney: 40,
                                         hackWeight: 15, strWeight: 20, defWeight: 20, dexWeight: 20, chaWeight: 75,
                                         difficulty: 25}),
    "Threaten & Blackmail" :    new GangMemberTask(
                                        "Threaten & Blackmail",
                                        "Assign this gang member to threaten and black mail high-profile targets<br><br>" +
                                        "Earns money - Slightly increases respect - Slightly increases wanted level",
                                        {baseRespect: 0.0002, baseWanted: 0.05, baseMoney: 15,
                                         hackWeight: 25, strWeight: 25, dexWeight: 25, chaWeight: 25, difficulty: 28}),
    "Terrorism" :               new GangMemberTask(
                                        "Terrorism",
                                        "Assign this gang member to commit acts of terrorism<br><br>" +
                                        "Greatly increases respect - Greatly increases wanted level",
                                        {baseRespect: 0.001, baseWanted: 1,
                                         hackWeight: 20, strWeight: 20, defWeight: 20,dexWeight: 20, chaWeight: 20,
                                         difficulty: 33}),
    "Vigilante Justice" :       new GangMemberTask(
                                        "Vigilante Justice",
                                        "Assign this gang member to be a vigilante and protect the city from criminals<br><br>" +
                                        "Decreases wanted level",
                                        {baseWanted: -0.001,
                                         hackWeight: 20, strWeight: 20, defWeight: 20, dexWeight: 20, agiWeight:20,
                                         difficulty: 1}),
    "Clone Trafficking":	new GangMemberTask(
	    				"Traffic Clones",
	    				"Assign this gang member to traffick clones for various black market purposes, such as organ farming",
	    				"Greatly increases respect - Increases wanted level",
	    				{baseRespect: 0.001, baseWanted:0.75, baseMoney:25,
					 hackWeight: 12, dexWeight: 58, chaWeight: 30, difficulty: 37}),
    "Traffick Intelligences":	new GangMemberTask(
	    				"Traffic AI Cores",
	    				"Assign this gang member to steal AI prototypes from companies and distribute them on the black market",
	    				"Greatly increases respect - Increases wanted level",
	    				{baseRespect: 0.001, baseWanted:0.75, baseMoney:35,
					 hackWeight: 90, chaWeight: 10, difficulty: 39}),
    "Train Combat" :            new GangMemberTask(
                                        "Train Combat",
                                        "Assign this gang member to increase their combat stats (str, def, dex, agi)",
                                        {strWeight: 25, defWeight: 25, dexWeight: 25, agiWeight: 25, difficulty: 5}),
    "Train Hacking" :           new GangMemberTask(
                                        "Train Hacking",
                                        "Assign this gang member to train their hacking skills",
                                        {hackWeight: 100, difficulty: 8}),
    "Territory Warfare" :       new GangMemberTask(
                                        "Territory Warfare",
                                        "Assign this gang member to engage in territorial warfare with other gangs. " +
                                        "Members assigned to this task will help increase your gang's territory " +
                                        "and will defend your territory from being taken.",
                                        {hackWeight: 15, strWeight: 20, defWeight: 20, dexWeight: 20, agiWeight: 20,
                                         chaWeight: 5, difficulty: 3}),
   /** "Protection Services":	new GangMemberTask(
	    				"Strongarm Civilians",
	    				"Assign this gang member to extort civilians for their money",
	    				"Territory causes a SIGNIFICANT increase in money gained. Very little respect, high wanted level.\nHaving to few gang members greatly decreases effectiveness.",
						var popEase = AllGangs[Player.gang.facName].territory - (3*Player.gang.members.length);
						if(AllGangs[Player.gang.facName].territory - Player.gang.members.length <= 0){
							popEase = 1;
						}extortMult = 1 + Math.pow(popEase, 1.5);
						if(extortMult > 40){
							extortMult = 40;
						}
	    				{baseRespect: 0.0001, baseWanted:1,baseMoney:10*extortMult;
						hackWeight: 5, strWeight: 20, defWeight: 20, dexWeight:15, agiWeight:10, chaWeight: 30, difficulty: 5 * extortMult},
				*/
}


function GangMemberUpgrade(name="", desc="", cost=0, type="w") {
    this.name = name;
    this.desc = desc;
    this.cost = cost;
    this.type = type; //w, a, v, r
}

//Passes in a GangMember object
GangMemberUpgrade.prototype.apply = function(member) {
    switch(this.name) {
        case "Baseball Bat":
            member.str_mult *= 1.05;
            member.def_mult *= 1.05;
            break;
        case "Katana":
            member.str_mult *= 1.1;
            member.def_mult *= 1.1;
            member.dex_mult *= 1.1;
            break;
        case "Glock 18C":
            member.str_mult *= 1.15;
            member.def_mult *= 1.15;
            member.dex_mult *= 1.15;
            member.agi_mult *= 1.15;
            break;
        case "P90C":
            member.str_mult *= 1.2;
            member.def_mult *= 1.2;
            member.agi_mult *= 1.1;
            break;
        case "Steyr AUG":
            member.str_mult *= 1.25;
            member.def_mult *= 1.25;
            break;
        case "AK-47":
            member.str_mult *= 1.5;
            member.def_mult *= 1.5;
            break;
        case "M15A10 Assault Rifle":
            member.str_mult *= 1.6;
            member.def_mult *= 1.6;
            break;
        case "AWM Sniper Rifle":
            member.str_mult *= 1.5;
            member.dex_mult *= 1.5;
            member.agi_mult *= 1.5;
            break;
        case "Bulletproof Vest":
            member.def_mult *= 1.05;
            break;
        case "Full Body Armor":
            member.def_mult *= 1.1;
            break;
        case "Liquid Body Armor":
            member.def_mult *= 1.25;
            member.agi_mult *= 1.25;
            break;
        case "Graphene Plating Armor":
            member.def_mult *= 1.5;
            break;
        case "Ford Flex V20":
            member.agi_mult *= 1.1;
            member.cha_mult *= 1.1;
            break;
        case "ATX1070 Superbike":
            member.agi_mult *= 1.15;
            member.cha_mult *= 1.15;
            break;
        case "Mercedes-Benz S9001":
            member.agi_mult *= 1.2;
            member.cha_mult *= 1.2;
            break;
        case "White Ferrari":
            member.agi_mult *= 1.25;
            member.cha_mult *= 1.25;
            break;
        case "NUKE Rootkit":
            member.hack_mult *= 1.1;
            break;
        case "Soulstealer Rootkit":
            member.hack_mult *= 1.2;
            break;
        case "Demon Rootkit":
            member.hack_mult *= 1.3;
            break;
        default:
            console.log("ERROR: Could not find this upgrade: " + this.name);
            break;
    }
}

GangMemberUpgrade.prototype.toJSON = function() {
	return Generic_toJSON("GangMemberUpgrade", this);
}

GangMemberUpgrade.fromJSON = function(value) {
	return Generic_fromJSON(GangMemberUpgrade, value.data);
}

Reviver.constructors.GangMemberUpgrade = GangMemberUpgrade;

let GangMemberUpgrades = {
    "Baseball Bat" : new GangMemberUpgrade("Baseball Bat",
                            "Increases strength and defense by 5%", 1e6, "w"),
    "Katana" :       new GangMemberUpgrade("Katana",
                            "Increases strength, defense, and dexterity by 10%", 12e6, "w"),
    "Glock 18C" :    new GangMemberUpgrade("Glock 18C",
                            "Increases strength, defense, dexterity, and agility by 15%", 25e6, "w"),
    "P90C" :          new GangMemberUpgrade("P90C",
                            "Increases strength and defense by 20%. Increases agility by 10%", 50e6, "w"),
    "Steyr AUG" :    new GangMemberUpgrade("Steyr AUG",
                            "Increases strength and defense by 25%", 60e6, "w"),
    "AK-47" :        new GangMemberUpgrade("AK-47",
                            "Increases strength and defense by 50%", 100e6, "w"),
    "M15A10 Assault Rifle" :    new GangMemberUpgrade("M15A10 Assault Rifle",
                                        "Increases strength and defense by 60%", 150e6, "w"),
    "AWM Sniper Rifle" :        new GangMemberUpgrade("AWM Sniper Rifle",
                                        "Increases strength, dexterity, and agility by 50%", 225e6, "w"),
    "Bulletproof Vest" :        new GangMemberUpgrade("Bulletproof Vest",
                                        "Increases defense by 5%", 2e6, "a"),
    "Full Body Armor" :         new GangMemberUpgrade("Full Body Armor",
                                        "Increases defense by 10%", 5e6, "a"),
    "Liquid Body Armor" :       new GangMemberUpgrade("Liquid Body Armor",
                                        "Increases defense and agility by 25%", 25e6, "a"),
    "Graphene Plating Armor" :  new GangMemberUpgrade("Graphene Plating Armor",
                                        "Increases defense by 50%", 40e6, "a"),
    "Ford Flex V20" :           new GangMemberUpgrade("Ford Flex V20",
                                        "Increases agility and charisma by 10%", 3e6, "v"),
    "ATX1070 Superbike" :       new GangMemberUpgrade("ATX1070 Superbike",
                                        "Increases agility and charisma by 15%", 9e6, "v"),
    "Mercedes-Benz S9001" :     new GangMemberUpgrade("Mercedes-Benz S9001",
                                        "Increases agility and charisma by 20%", 18e6, "v"),
    "White Ferrari" :           new GangMemberUpgrade("White Ferrari",
                                        "Increases agility and charisma by 25%", 30e6, "v"),
    "NUKE Rootkit" :            new GangMemberUpgrade("NUKE Rootkit",
                                        "Increases hacking by 10%", 5e6, "r"),
    "Soulstealer Rootkit" :     new GangMemberUpgrade("Soulstealer Rootkit",
                                        "Increases hacking by 20%", 15e6, "r"),
    "Demon Rootkit" :           new GangMemberUpgrade("Demon Rootkit",
                                        "Increases hacking by 30%", 50e6, "r"),
}

//Create a pop-up box that lets player purchase upgrades
let gangMemberUpgradeBoxOpened = false;
function createGangMemberUpgradeBox(initialFilter="") {
    var boxId = "gang-member-upgrade-popup-box";
    if (gangMemberUpgradeBoxOpened) {
        //Already opened, refreshing
        if (gangMemberUpgradeBoxElements == null || gangMemberUpgradeBox == null || gangMemberUpgradeBoxContent == null) {
            console.log("ERROR: Refreshing Gang member upgrade box throws error because required elements are null");
            return;
        }

        for (var i = 1; i < gangMemberUpgradeBoxElements.length; ++i) {
            removeElement(gangMemberUpgradeBoxElements[i]);
        }
        gangMemberUpgradeBoxElements = [gangMemberUpgradeBoxFilter];

        var filter = gangMemberUpgradeBoxFilter.value.toString();
        for (var i = 0; i < Player.gang.members.length; ++i) {
            if (Player.gang.members[i].name.indexOf(filter) > -1 || Player.gang.members[i].task.name.indexOf(filter) > -1) {
                var newPanel = createGangMemberUpgradePanel(Player.gang.members[i]);
                gangMemberUpgradeBoxContent.appendChild(newPanel);
                gangMemberUpgradeBoxElements.push(newPanel);
            }
        }
    } else {
        //New popup
        gangMemberUpgradeBoxFilter = createElement("input", {
            type:"text", placeholder:"Filter gang members",
            value:initialFilter,
            onkeyup:()=>{
                var filterValue = gangMemberUpgradeBoxFilter.value.toString();
                createGangMemberUpgradeBox(filterValue);
            }
        });

        gangMemberUpgradeBoxElements = [gangMemberUpgradeBoxFilter];

        var filter = gangMemberUpgradeBoxFilter.value.toString();
        for (var i = 0; i < Player.gang.members.length; ++i) {
            if (Player.gang.members[i].name.indexOf(filter) > -1 || Player.gang.members[i].task.name.indexOf(filter) > -1) {
                gangMemberUpgradeBoxElements.push(createGangMemberUpgradePanel(Player.gang.members[i]));
            }
        }

        gangMemberUpgradeBox = createPopup(boxId, gangMemberUpgradeBoxElements);
        gangMemberUpgradeBoxContent = document.getElementById(boxId + "-content");
        gangMemberUpgradeBoxOpened = true;
    }
}

//Create upgrade panels for each individual Gang Member
function createGangMemberUpgradePanel(memberObj) {
    var container = createElement("div", {
        border:"1px solid white",
    });

    var header = createElement("h1", {
        innerText:memberObj.name + " (" + memberObj.task.name + ")"
    });
    container.appendChild(header);

    var text = createElement("pre", {
        fontSize:"14px", display: "inline-block", width:"20%",
        innerText:
            "Hack: " + memberObj.hack + " (x" + formatNumber(memberObj.hack_mult, 2) + ")\n" +
            "Str:  " + memberObj.str  + " (x" + formatNumber(memberObj.str_mult, 2) + ")\n" +
            "Def:  " + memberObj.def  + " (x" + formatNumber(memberObj.def_mult, 2) + ")\n" +
            "Dex:  " + memberObj.dex  + " (x" + formatNumber(memberObj.dex_mult, 2) + ")\n" +
            "Agi:  " + memberObj.agi  + " (x" + formatNumber(memberObj.agi_mult, 2) + ")\n" +
            "Cha:  " + memberObj.cha  + " (x" + formatNumber(memberObj.cha_mult, 2) + ")\n",
    });

    //Already purchased upgrades
    var ownedUpgradesElements = [];
    for (var i = 0; i < memberObj.upgrades.length; ++i) {
        var upg = GangMemberUpgrades[memberObj.upgrades[i]];
        if (upg == null) {
            console.log("ERR: Could not find this upgrade: " + memberObj.upgrades[i]);
            continue;
        }
        var e = createElement("div", {
            border:"1px solid white", innerText:memberObj.upgrades[i],
            margin:"1px", padding:"1px", tooltip:upg.desc, fontSize:"12px",
        });
        ownedUpgradesElements.push(e);
    }
    var ownedUpgrades = createElement("div", {
        display:"inline-block", marginLeft:"6px", width:"75%", innerText:"Purchased Upgrades:",
    });
    for (var i = 0; i < ownedUpgradesElements.length; ++i) {
        ownedUpgrades.appendChild(ownedUpgradesElements[i]);
    }
    container.appendChild(text);
    container.appendChild(ownedUpgrades);
    container.appendChild(createElement("br", {}));

    //Upgrade buttons. Only show upgrades that can be afforded
    var weaponUpgrades = [], armorUpgrades = [], vehicleUpgrades = [], rootkitUpgrades = [];
    for (var upgName in GangMemberUpgrades) {
        if (GangMemberUpgrades.hasOwnProperty(upgName)) {
            var upg = GangMemberUpgrades[upgName];
            if (Player.money.lt(upg.cost) || memberObj.upgrades.includes(upgName)) {continue;}
            switch (upg.type) {
                case "w":
                    weaponUpgrades.push(upg);
                    break;
                case "a":
                    armorUpgrades.push(upg);
                    break;
                case "v":
                    vehicleUpgrades.push(upg);
                    break;
                case "r":
                    rootkitUpgrades.push(upg);
                    break;
                default:
                    console.log("ERROR: Invalid Gang Member Upgrade Type: " + upg.type);
            }
        }
    }

    var weaponDiv   = createElement("div", {width:"20%", display:"inline-block",});
    var armorDiv    = createElement("div", {width:"20%", display:"inline-block",});
    var vehicleDiv  = createElement("div", {width:"20%", display:"inline-block",});
    var rootkitDiv  = createElement("div", {width:"20%", display:"inline-block",});
    var upgrades = [weaponUpgrades, armorUpgrades, vehicleUpgrades, rootkitUpgrades];
    var divs = [weaponDiv, armorDiv, vehicleDiv, rootkitDiv];

    for (var i = 0; i < upgrades.length; ++i) {
        var upgradeArray = upgrades[i];
        var div = divs[i];
        for (var j = 0; j < upgradeArray.length; ++j) {
            var upg = upgradeArray[j];
            (function (upg, div, memberObj) {
                div.appendChild(createElement("a", {
                    innerText:upg.name + " - " + numeral(upg.cost).format("$0.000a"),
                    class:"a-link-button", margin:"2px",  padding:"2px", display:"block",
                    fontSize:"12px",
                    tooltip:upg.desc,
                    clickListener:()=>{
                        if (Player.money.lt(upg.cost)) {return false;}
                        Player.loseMoney(upg.cost);
                        memberObj.upgrades.push(upg.name);
                        upg.apply(memberObj);
                        var initFilterValue = gangMemberUpgradeBoxFilter.value.toString();
                        createGangMemberUpgradeBox(initFilterValue);
                        return false;
                    }
                }));
            })(upg, div, memberObj);
        }
    }

    container.appendChild(weaponDiv);
    container.appendChild(armorDiv);
    container.appendChild(vehicleDiv);
    container.appendChild(rootkitDiv);
    return container;
}

//Gang DOM elements
let gangContentCreated = false,
    gangContainer = null, managementButton = null, territoryButton = null;

//Subpages
let gangManagementSubpage = null, gangTerritorySubpage = null;

//Gang Management Elements
let gangDesc = null, gangInfo = null,
    gangRecruitMemberButton = null, gangRecruitRequirementText = null,
    gangExpandAllButton = null, gangCollapseAllButton, gangMemberFilter = null,
    gangManageEquipmentButton = null,
    gangMemberList = null;

//Gang Equipment Upgrade Elements
let gangMemberUpgradeBox = null, gangMemberUpgradeBoxContent = null,
    gangMemberUpgradeBoxFilter = null, gangMemberUpgradeBoxElements = null;


//Gang Territory Elements
let gangTerritoryDescText = null, gangTerritoryInfoText = null;

function displayGangContent() {
    if (!gangContentCreated || gangContainer == null) {
        gangContentCreated = true;

        //Create gang container
        gangContainer = createElement("div", {
            id:"gang-container", class:"generic-menupage-container",
        });

        //Get variables
        var facName = Player.gang.facName,
            members = Player.gang.members,
            wanted = Player.gang.wanted,
            respect = Player.gang.respect;

        //Back button
        gangContainer.appendChild(createElement("a", {
            class:"a-link-button", display:"inline-block", innerText:"Back",
            clickListener:()=>{
                Engine.loadFactionContent();
                displayFactionContent(facName);
                return false;
            }
        }));

        //Buttons to switch between panels
        managementButton = createElement("a", {
            id:"gang-management-subpage-button", class:"a-link-button-inactive",
            display:"inline-block", innerHTML: "Gang Management (1)",
            clickListener:()=>{
                gangManagementSubpage.style.display = "block";
                gangTerritorySubpage.style.display = "none";
                managementButton.classList.toggle("a-link-button-inactive");
                managementButton.classList.toggle("a-link-button");
                territoryButton.classList.toggle("a-link-button-inactive");
                territoryButton.classList.toggle("a-link-button");
                updateGangContent();
                return false;
            }
        })
        territoryButton = createElement("a", {
            id:"gang-territory-subpage-button", class:"a-link-button",
            display:"inline-block", innerHTML:"Gang Territory (2)",
            clickListener:()=>{
                gangManagementSubpage.style.display = "none";
                gangTerritorySubpage.style.display = "block";
                managementButton.classList.toggle("a-link-button-inactive");
                managementButton.classList.toggle("a-link-button");
                territoryButton.classList.toggle("a-link-button-inactive");
                territoryButton.classList.toggle("a-link-button");
                updateGangContent();
                return false;
            }
        });
        gangContainer.appendChild(managementButton);
        gangContainer.appendChild(territoryButton);

        //Subpage for managing gang members
        gangManagementSubpage = createElement("div", {
            display:"block", id:"gang-management-subpage",
        });

        var lowerWantedTask = "";
        if (Player.gang.isHackingGang) {
            lowerWantedTask = "Ethical Hacking";
        } else {
            lowerWantedTask = "Vigilante Justice";
        }
        gangDesc = createElement("p", {width:"70%",
            innerHTML:
            "This page is used to manage your gang members and get an overview of your  " +
            "gang's stats.<br><br>" +
            "If a gang member is not earning much money or respect, the task that you " +
            "have assigned to that member might be too difficult. Consider training that " +
            "member's stats or choosing an easier task. The tasks closer to the " +
            "top of the dropdown list are generally easier. Alternatively, the gang member's " +
            "low production might be due to the fact that your wanted level is too high. " +
            "Consider assigning a few members to the '" + lowerWantedTask + "' " +
            "task to lower your wanted level. <br><br>" +
            "Installing Augmentations does NOT reset your progress with your Gang. " +
            "Furthermore, after installing Augmentations, you will " +
            "automatically be a member of whatever Faction you created your gang with.<br><br>"
        });
        gangManagementSubpage.appendChild(gangDesc);

        gangInfo = createElement("p", {id:"gang-info", width:"70%"});
        gangManagementSubpage.appendChild(gangInfo);

        gangRecruitMemberButton = createElement("a", {
            id:"gang-management-recruit-member-btn", class:"a-link-button-inactive",
            innerHTML:"Recruit Gang Member", display:"inline-block", margin:"10px",
            clickListener:()=>{
                var yesBtn = yesNoTxtInpBoxGetYesButton(), noBtn = yesNoTxtInpBoxGetNoButton();
                yesBtn.innerHTML = "Recruit Gang Member";
                noBtn.innerHTML = "Cancel";
                yesBtn.addEventListener("click", ()=>{
                    var name = yesNoTxtInpBoxGetInput();
                    if (name === "") {
                        dialogBoxCreate("You must enter a name for your Gang member!");
                    } else {
                        for (var i = 0; i < Player.gang.members.length; ++i) {
                            if (name == Player.gang.members[i].name) {
                                dialogBoxCreate("You already have a gang member with this name!");
                                return false;
                            }
                        }
                        var member = new GangMember(name);
                        Player.gang.members.push(member);
                        createGangMemberDisplayElement(member);
                        updateGangContent();
                    }
                    yesNoTxtInpBoxClose();
                });
                noBtn.addEventListener("click", ()=>{
                    yesNoTxtInpBoxClose();
                });
                yesNoTxtInpBoxCreate("Please enter a name for your new Gang member:");
                return false;
            }
        });
        gangManagementSubpage.appendChild(gangRecruitMemberButton);

        //Text for how much reputation is required for recruiting next memberList
        gangRecruitRequirementText = createElement("p", {color:"red", id:"gang-recruit-requirement-text"});
        gangManagementSubpage.appendChild(gangRecruitRequirementText);

        //Gang Member List management buttons (Expand/Collapse All, select a single member)
        gangManagementSubpage.appendChild(createElement("br", {}));
        gangExpandAllButton = createElement("a", {
            class:"a-link-button", display:"inline-block",
            innerHTML:"Expand All",
            clickListener:()=>{
                var allHeaders = gangManagementSubpage.getElementsByClassName("accordion-header");
                for (var i = 0; i < allHeaders.length; ++i) {
                    var hdr = allHeaders[i];
                    if (!hdr.classList.contains("active")) {
                        hdr.click();
                    }
                }
                return false;
            }
        });
        gangCollapseAllButton = createElement("a", {
            class:"a-link-button", display:"inline-block",
            innerHTML:"Collapse All",
            clickListener:()=>{
                var allHeaders = gangManagementSubpage.getElementsByClassName("accordion-header");
                for (var i = 0; i < allHeaders.length; ++i) {
                    var hdr = allHeaders[i];
                    if (hdr.classList.contains("active")) {
                        hdr.click();
                    }
                }
                return false;
            }
        });
        gangMemberFilter = createElement("input", {
            type:"text", placeholder:"Filter gang members", margin:"5px", padding:"5px",
            onkeyup:()=>{
                displayGangMemberList();
            }
        });
        gangManageEquipmentButton = createElement("a", {
            class:"a-link-button", display:"inline-block",
            innerHTML:"Manage Equipment",
            clickListener:()=>{
                createGangMemberUpgradeBox();
            }
        });
        gangManagementSubpage.appendChild(gangExpandAllButton);
        gangManagementSubpage.appendChild(gangCollapseAllButton);
        gangManagementSubpage.appendChild(gangMemberFilter);
        gangManagementSubpage.appendChild(gangManageEquipmentButton);

        //Gang Member list
        gangMemberList = createElement("ul", {id:"gang-member-list"});
        displayGangMemberList();
        gangManagementSubpage.appendChild(gangMemberList);

        //Subpage for seeing gang territory information
        gangTerritorySubpage = createElement("div", {
            id:"gang-territory-subpage", display:"none"
        });

        //Info text for territory page
        gangTerritoryDescText = createElement("p", {
            width:"70%",
            innerHTML:"This page shows how much territory your Gang controls. This statistic is listed as a percentage, " +
            "which represents how much of the total territory you control.<br><br>" +
            "Territory gain and loss is processed automatically and is updated every ~30 seconds. Your chances " +
            "to gain and lose territory depend on your Gang's power, which is listed in the display below. " +
            "Your gang's power is determined by the stats of all Gang members you have assigned to the " +
            "'Territory Warfare' task. Gang members that are not assigned to this task do not contribute to " +
            "your Gang's power.<br><br>" +
            "The amount of territory you have affects all aspects of your Gang members' production, including " +
            "money, respect, and wanted level. It is very beneficial to have high territory control.<br><br>"
        });
        gangTerritorySubpage.appendChild(gangTerritoryDescText);

        var territoryBorder = createElement("fieldset", {width:"50%", display:"inline-block"});

        gangTerritoryInfoText = createElement("p", {id:"gang-territory-info"});

        territoryBorder.appendChild(gangTerritoryInfoText);
        gangTerritorySubpage.appendChild(territoryBorder);

        gangContainer.appendChild(gangTerritorySubpage);
        gangContainer.appendChild(gangManagementSubpage);
        document.getElementById("entire-game-container").appendChild(gangContainer);
    }
    gangContainer.style.display = "block";
    updateGangContent();
}

function displayGangMemberList() {
    removeChildrenFromElement(gangMemberList);
    var members = Player.gang.members;
    var filter = gangMemberFilter.value.toString();
    for (var i = 0; i < members.length; ++i) {
        if (members[i].name.indexOf(filter) > -1 || members[i].task.name.indexOf(filter) > -1) {
            createGangMemberDisplayElement(members[i]);
        }
    }
    //setGangMemberClickHandlers(); //Set buttons to toggle the gang member info panels
}

function updateGangContent() {
    if (!gangContentCreated || !Player.inGang()) {return;}

    if(gangTerritorySubpage.style.display === "block") {
        //Update territory information
        gangTerritoryInfoText.innerHTML = "";
        for (var gangname in AllGangs) {
            if (AllGangs.hasOwnProperty(gangname)) {
                var gangTerritoryInfo = AllGangs[gangname];
                let territory = gangTerritoryInfo.territory*100;

                //Fix some rounding issues graphically
                let displayNumber;
                if (territory <= 0) {
                    displayNumber = formatNumber(0, 2);
                } else if (territory >= 100) {
                    displayNumber = formatNumber(100, 2);
                } else {
                    displayNumber = formatNumber(territory, 2);
                }

                if (gangname == Player.gang.facName) {
                    gangTerritoryInfoText.innerHTML += ("<b>" + gangname + "</b><br>(Power: " + formatNumber(gangTerritoryInfo.power, 6) + "): " +
                                       displayNumber + "%<br><br>");
                } else {
                    gangTerritoryInfoText.innerHTML += (gangname + "<br>(Power: " + formatNumber(gangTerritoryInfo.power, 6) + "): " +
                                       displayNumber + "%<br><br>");
                }
            }
        }
    } else {
        //Update information for overall gang
        if (gangInfo instanceof Element) {
            var faction = Factions[Player.gang.facName];
            var rep;
            if (!(faction instanceof Faction)) {
                rep = "ERROR";
            } else {
                rep = faction.playerReputation;
            }
            removeChildrenFromElement(gangInfo);
            gangInfo.appendChild(createElement("p", {   //Respect
                display:"inline-block",
                innerText:"Respect: " + formatNumber(Player.gang.respect, 6) +
                          " (" + formatNumber(5*Player.gang.respectGainRate, 6) + " / sec)",
                tooltip:"Represents the amount of respect your gang has from other gangs and criminal " +
                        "organizations. Your respect affects the amount of money " +
                        "your gang members will earn, and also determines how much " +
                        "reputation you are earning with your gang's corresponding Faction."
            }));
            gangInfo.appendChild(createElement("br", {}));

            gangInfo.appendChild(createElement("p", {   //Wanted level
                display:"inline-block",
                innerText:"Wanted Level: " + formatNumber(Player.gang.wanted, 6) +
                          " (" + formatNumber(5*Player.gang.wantedGainRate, 6) + " / sec)",
                tooltip:"Represents how much the gang is wanted by law enforcement. The higher " +
                        "your gang's wanted level, the harder it will be for your gang members " +
                        "to make money and earn respect. Note that the minimum wanted level is 1."
            }));
            gangInfo.appendChild(createElement("br", {}));

            var wantedPenalty = (Player.gang.respect) / (Player.gang.respect + Player.gang.wanted);
            wantedPenalty = (1 - wantedPenalty) * 100;
            gangInfo.appendChild(createElement("p", {   //Wanted Level multiplier
                display:"inline-block",
                innerText:"Wanted Level Penalty: -" + formatNumber(wantedPenalty, 2) + "%",
                tooltip:"Penalty for respect and money gain rates due to Wanted Level"
            }));
            gangInfo.appendChild(createElement("br", {}));

            gangInfo.appendChild(createElement("p", {   //Money gain rate
                display:"inline-block",
                innerText:"Money gain rate: $" + formatNumber(5*Player.gang.moneyGainRate, 2) +
                          " / sec",
            }));
            gangInfo.appendChild(createElement("br", {}));

            //Fix some rounding issues graphically
            var territoryMult = AllGangs[Player.gang.facName].territory * 100;
            let displayNumber;
            if (territoryMult <= 0) {
                displayNumber = formatNumber(0, 2);
            } else if (territoryMult >= 100) {
                displayNumber = formatNumber(100, 2);
            } else {
                displayNumber = formatNumber(territoryMult, 2);
            }
            gangInfo.appendChild(createElement("p", {  //Territory multiplier
                display:"inline-block",
                innerText:"Territory: " + formatNumber(displayNumber, 3) + "%",
                tooltip:"The percentage of total territory your Gang controls"
            }));
            gangInfo.appendChild(createElement("br", {}));

            gangInfo.appendChild(createElement("p", {  //Faction reputation
                display:"inline-block",
                innerText:"Faction reputation: " + formatNumber(rep, 3)
            }));
            gangInfo.appendChild(createElement("br", {}));
        } else {
            console.log("ERROR: gang-info DOM element DNE");
        }

        //Toggle the 'Recruit member button' if valid
        var numMembers = Player.gang.members.length;
        var repCost = 0;
        if (numMembers > 0) {
            var repCost = Math.pow(CONSTANTS.GangRecruitCostMultiplier, numMembers);
        }
        var faction = Factions[Player.gang.facName];
        if (faction == null) {
            dialogBoxCreate("Could not find your gang's faction. This is probably a bug please report to dev");
            return;
        }
        var btn = gangRecruitMemberButton;
        if (numMembers >= CONSTANTS.MaximumGangMembers) {
            btn.className = "a-link-button-inactive";
            gangRecruitRequirementText.style.display = "block";
            gangRecruitRequirementText.innerHTML =
                "You have reached the maximum amount of gang members";
        } else if (faction.playerReputation >= repCost) {
            btn.className = "a-link-button";
            gangRecruitRequirementText.style.display = "none";
        } else {
            btn.className = "a-link-button-inactive";
            gangRecruitRequirementText.style.display = "block";
            gangRecruitRequirementText.innerHTML =
                formatNumber(repCost, 2) + " Faction reputation needed to recruit next member";
        }

        //Update information for each gang member
        for (var i = 0; i < Player.gang.members.length; ++i) {
            updateGangMemberDisplayElement(Player.gang.members[i]);
        }
    }
}

//Takes in a GangMember object
function createGangMemberDisplayElement(memberObj) {
    if (!gangContentCreated || !Player.inGang()) {return;}
    var name = memberObj.name;

    var accordion = createAccordionElement({
        id:name + "gang-member",
        hdrText:name,
    });
    var li = accordion[0];
    var hdr = accordion[1];
    var gangMemberDiv = accordion[2];

    //Gang member content divided into 3 panels:
    //Stats Panel
    var statsDiv = createElement("div", {
        id: name + "gang-member-stats", class: "gang-member-info-div",
        width:"30%", display:"inline"
    });
    var statsP = createElement("p", {
        id:name + "gang-member-stats-text", display:"inline"
    });

    statsDiv.appendChild(statsP);
    //statsDiv.appendChild(upgradeButton);

    //Panel for Selecting task and show respect/wanted gain
    var taskDiv = createElement("div", {
        id: name + "gang-member-task", class:"gang-member-info-div",
        width:"30%", display:"inline"
    });
    var taskSelector = createElement("select", {
        color:"white", backgroundColor:"black",
        id:name + "gang-member-task-selector"
    });

    var tasks = null;
    if (Player.gang.isHackingGang) {
        tasks = ["---", "Ransomware", "Phishing", "Identity Theft", "DDoS Attacks",
                 "Plant Virus", "Fraud & Counterfeiting","Money Laundering",
                 "Cyberterrorism", "Ethical Hacking", "Train Combat",
                 "Train Hacking", "Territory Warfare"];
    } else {
        tasks = ["---", "Mug People", "Deal Drugs", "Run a Con", "Armed Robbery",
                 "Traffick Illegal Arms", "Threaten & Blackmail",
                 "Terrorism", "Vigilante Justice", "Train Combat",
                 "Train Hacking", "Territory Warfare"];
    }
    for (var i = 0; i < tasks.length; ++i) {
        var option = document.createElement("option");
        option.text = tasks[i];
        taskSelector.add(option);
    }
    taskSelector.addEventListener("change", function() {
        var task = taskSelector.options[taskSelector.selectedIndex].text;
        memberObj.assignToTask(task);
        setGangMemberTaskDescription(memberObj, task);
        updateGangContent();
    });
    //Set initial task in selector element
    if (memberObj.task instanceof GangMemberTask) {
        var taskName = memberObj.task.name;
        var taskIndex = 0;
        for (let i = 0; i < tasks.length; ++i) {
            if (taskName == tasks[i]) {
                taskIndex = i;
                break;
            }
        }
        taskSelector.selectedIndex = taskIndex;
    }

    var gainInfo = createElement("p", {id:name + "gang-member-gain-info"});
    taskDiv.appendChild(taskSelector);
    taskDiv.appendChild(gainInfo);

    //Panel for Description of task
    var taskDescDiv = createElement("div", {
        id:name + "gang-member-task-desc", class:"gang-member-info-div",
        width:"30%", display:"inline"
    });

    var taskDescP = createElement("p", {id: name + "gang-member-task-description", display:"inline"});
    taskDescDiv.appendChild(taskDescP);

    statsDiv.style.width = "30%";
    taskDiv.style.width = "30%";
    taskDescDiv.style.width = "30%";
    statsDiv.style.display = "inline";
    taskDiv.style.display = "inline";
    taskDescDiv.style.display = "inline";
    gangMemberDiv.appendChild(statsDiv);
    gangMemberDiv.appendChild(taskDiv);
    gangMemberDiv.appendChild(taskDescDiv);

    gangMemberList.appendChild(li);
    setGangMemberTaskDescription(memberObj, taskName); //Initialize description
    updateGangMemberDisplayElement(memberObj);
}

function updateGangMemberDisplayElement(memberObj) {
    if (!gangContentCreated || !Player.inGang()) {return;}
    var name = memberObj.name;

    //TODO Add upgrade information
    var stats = document.getElementById(name + "gang-member-stats-text");
    if (stats) {
        stats.innerHTML =
            "Hacking: " + formatNumber(memberObj.hack, 0) + " (" + numeral(memberObj.hack_exp).format('(0.00a)') + " exp)<br>" +
            "Strength: " + formatNumber(memberObj.str, 0) + " (" + numeral(memberObj.str_exp).format('(0.00a)') + " exp)<br>" +
            "Defense: " + formatNumber(memberObj.def, 0) + " (" + numeral(memberObj.def_exp).format('(0.00a)') + " exp)<br>" +
            "Dexterity: " + formatNumber(memberObj.dex, 0) + " (" + numeral(memberObj.dex_exp).format('(0.00a)') + " exp)<br>" +
            "Agility: " + formatNumber(memberObj.agi, 0) + " (" + numeral(memberObj.agi_exp).format('(0.00a)') + " exp)<br>" +
            "Charisma: " + formatNumber(memberObj.cha, 0) + " (" + numeral(memberObj.cha_exp).format('(0.00a)') + " exp)<br>";
    }

    var gainInfo = document.getElementById(name + "gang-member-gain-info");
    if (gainInfo) {
        gainInfo.innerHTML =
            "Money: $" + formatNumber(5*memberObj.calculateMoneyGain(), 2) + " / sec<br>" +
            "Respect: " + formatNumber(5*memberObj.calculateRespectGain(), 6) + " / sec<br>" +
            "Wanted Level: " + formatNumber(5*memberObj.calculateWantedLevelGain(), 6) + " / sec<br>";
    }
}

function setGangMemberTaskDescription(memberObj, taskName) {
    var name = memberObj.name;
    var taskDesc = document.getElementById(name + "gang-member-task-description");
    if (taskDesc) {
        var task = GangMemberTasks[taskName];
        if (task == null) {return;}
        var desc = task.desc;
        taskDesc.innerHTML = desc;
    }
}

function deleteGangDisplayContent() {
    if (gangContainer != null) {removeElementById(gangContainer.id);}

    gangContentCreated = false;
    gangContainer = null;
    managementButton = null;
    territoryButton = null;

    //Subpages
    gangManagementSubpage = null;
    gangTerritorySubpage = null;

    //Gang Management Elements
    gangDesc = null;
    gangInfo = null;
    gangRecruitMemberButton = null;
    gangRecruitRequirementText = null;
    gangExpandAllButton = null;
    gangCollapseAllButton = null;
    gangMemberFilter = null;
    gangManageEquipmentButton = null;
    gangMemberList = null;

    //Gang Equipment Upgrade Elements
    gangMemberUpgradeBox = null;
    gangMemberUpgradeBoxContent = null;
    gangMemberUpgradeBoxFilter = null;
    gangMemberUpgradeBoxElements = null;
}

export {Gang, displayGangContent, updateGangContent, loadAllGangs, AllGangs,
        resetGangs, deleteGangDisplayContent};
