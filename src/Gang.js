/* Gang.js */
$(document).keydown(function(event) {
    if (Engine.currentPage == Engine.Page.Gang && !yesNoBoxOpen) {
        if (event.keyCode === 49) {
            if(document.getElementById("gang-territory-subpage").style.display === "block") {
                document.getElementById("gang-management-subpage-button").click();
            }
        } else if (event.keyCode === 50) {
            if (document.getElementById("gang-management-subpage").style.display === "block") {
                document.getElementById("gang-territory-subpage-button").click();
            }
        }
    }
});

GangNames = ["Slum Snakes", "Tetrads", "The Syndicate", "The Dark Army", "Speakers for the Dead",
             "NiteSec", "The Black Hand"];
GangLocations = [Locations.Aevum, Locations.Chongqing, Locations.Sector12, Locations.NewTokyo,
                 Locations.Ishima, Locations.Volhaven];
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

//Power is an estimate of a gang's ability to gain/defend territory
gangStoredPowerCycles = 0;
function processAllGangPowerGains(numCycles=1) {
    if (!Player.inGang()) {return;}
    gangStoredPowerCycles += numCycles;
    if (gangStoredPowerCycles < 150) {return;}
    var playerGangName = Player.gang.facName;
    for (var name in AllGangs) {
        if (AllGangs.hasOwnProperty(name)) {
            if (name == playerGangName) {
                AllGangs[name].power = Player.gang.calculatePower();
            } else {
                var gain = Math.random() * 0.005; //TODO Adjust as necessary
                AllGangs[name].power += (gain * numCycles);
            }
        }
    }

    gangStoredPowerCycles -= 150;
}

gangStoredTerritoryCycles = 0;
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
            AllGangs[GangNames[i]].territory += 0.0001;
            AllGangs[GangNames[other]].territory-= 0.0001;
        } else {
            AllGangs[GangNames[i]].territory -= 0.0001;
            AllGangs[GangNames[other]].territory += 0.0001;
        }
    }

    gangStoredTerritoryCycles -= CONSTANTS.GangTerritoryUpdateTimer;
}

//Returns true if Player is in a gang and false otherwise
PlayerObject.prototype.inGang = function() {
    if (this.gang == null || this.gang == undefined) {return false;}
    return (this.gang instanceof Gang);
}

/*  faction - Name of corresponding faction
    hacking - Boolean indicating whether its a hacking gang or not
 */
function Gang(facName, hacking=false) {
    this.facName    = facName;
    this.members    = [];  //Array of GangMembers
    this.wanted     = 1;
    this.respect    = 1;

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
        this.wanted += (wantedLevelGains * this.storedCycles);
        if (this.wanted < 1) {this.wanted = 1;}
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

Gang.prototype.calculatePower = function() {
    var memberTotal = 0;
    for (var i = 0; i < this.members.length; ++i) {
        if (this.members[i].task instanceof GangMemberTask &&
            this.members[i].task.name == "Territory Warfare") {
            memberTotal += this.members[i].calculatePower();
        }
    }
    return (memberTotal);
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
    this.task   = null; //GangMemberTask object
    this.city   = Player.city;

    //Name of upgrade only
    this.weaponUpgrade = null;
    this.armorUpgrade = null;
    this.vehicleUpgrade = null;
    this.hackingUpgrade = null;

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
        console.log("ERROR: Invalid task " + taskName);
        this.task = null;
    }
}

//Gains are per cycle
GangMember.prototype.calculateRespectGain = function() {
    var task = this.task;
    if (task === null || !(task instanceof GangMemberTask) || task.baseRespect === 0) {return 0;}
    var statWeight =    (task.hackWeight/100) * this.hack +
                        (task.strWeight/100) * this.str +
                        (task.defWeight/100) * this.def +
                        (task.dexWeight/100) * this.dex +
                        (task.agiWeight/100) * this.agi +
                        (task.chaWeight/100) * this.cha;
    statWeight -= (3.5 * task.difficulty);
    if (statWeight <= 0) {return 0;}
    var territoryMult = AllGangs[Player.gang.facName].territory;
    var respectMult = (Player.gang.respect) / (Player.gang.respect + Player.gang.wanted);
    return 12 * task.baseRespect * statWeight * territoryMult * respectMult;
}

GangMember.prototype.calculateWantedLevelGain = function() {
    var task = this.task;
    if (task === null || !(task instanceof GangMemberTask) || task.baseWanted === 0) {return 0;}
    var statWeight =    (task.hackWeight/100) * this.hack +
                        (task.strWeight/100) * this.str +
                        (task.defWeight/100) * this.def +
                        (task.dexWeight/100) * this.dex +
                        (task.agiWeight/100) * this.agi +
                        (task.chaWeight/100) * this.cha;
    statWeight -= (3.5 * task.difficulty);
    if (statWeight <= 0) {return 0;}
    var territoryMult = AllGangs[Player.gang.facName].territory;
    if (task.baseWanted < 0) {
        return task.baseWanted * statWeight * territoryMult;
    } else {
        return 5 * task.baseWanted / (3 * statWeight * territoryMult);
    }
}

GangMember.prototype.calculateMoneyGain = function() {
    var task = this.task;
    if (task === null || !(task instanceof GangMemberTask) || task.baseMoney === 0) {return 0;}
    var statWeight =    (task.hackWeight/100) * this.hack +
                        (task.strWeight/100) * this.str +
                        (task.defWeight/100) * this.def +
                        (task.dexWeight/100) * this.dex +
                        (task.agiWeight/100) * this.agi +
                        (task.chaWeight/100) * this.cha;
    statWeight -= (3.5 * task.difficulty);
    if (statWeight <= 0) {return 0;}
    var territoryMult = AllGangs[Player.gang.facName].territory;
    var respectMult = (Player.gang.respect) / (Player.gang.respect + Player.gang.wanted);
    return 5 * task.baseMoney * statWeight * territoryMult * respectMult;
}

GangMember.prototype.gainExperience = function(numCycles=1) {
    var task = this.task;
    if (task === null || !(task instanceof GangMemberTask)) {return;}
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
GangMemberTasks = {
    "Ransomware" :              new GangMemberTask(
                                        "Ransomware",
                                        "Assign this gang member to create and distribute ransomware<br><br>" +
                                        "Earns money - Slightly increases respect - Slightly increases wanted level",
                                        {baseRespect: 0.00008, baseWanted: 0.00001, baseMoney: 1,
                                         hackWeight: 100, difficulty: 1}),
    "Phishing" :                new GangMemberTask(
                                        "Phishing",
                                        "Assign this gang member to attempt phishing scams and attacks<br><br>" +
                                        "Earns money - Slightly increases respect - Slightly increases wanted level",
                                        {baseRespect: 0.0001, baseWanted: 0.001, baseMoney: 2.5,
                                         hackWeight: 85, chaWeight: 15, difficulty: 3}),
    "Identity Theft" :          new GangMemberTask(
                                        "Identity Theft",
                                        "Assign this gang member to attempt identity theft<br><br>" +
                                        "Earns money - Increases respect - Increases wanted level",
                                        {baseRespect: 0.0003, baseWanted: 0.01, baseMoney: 6,
                                         hackWeight: 80, chaWeight: 20, difficulty: 4}),
    "DDoS Attacks" :            new GangMemberTask(
                                        "DDoS Attacks",
                                        "Assign this gang member to carry out DDoS attacks<br><br>" +
                                        "Increases respect - Increases wanted level",
                                        {baseRespect: 0.0007, baseWanted: 0.05,
                                         hackWeight: 100, difficulty: 7}),
    "Plant Virus" :             new GangMemberTask(
                                        "Plant Virus",
                                        "Assign this gang member to create and distribute malicious viruses<br><br>" +
                                        "Increases respect - Increases wanted level",
                                        {baseRespect: 0.001, baseWanted: 0.05,
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
                                        {baseRespect: 0.002, baseWanted:0.2, baseMoney: 40,
                                         hackWeight: 75, chaWeight: 25, difficulty: 20}),
    "Cyberterrorism" :          new GangMemberTask(
                                        "Cyberterrorism",
                                        "Assign this gang member to commit acts of cyberterrorism<br><br>" +
                                        "Greatly increases respect - Greatly increases wanted level",
                                        {baseRespect: 0.01, baseWanted: 0.5,
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
                                        {baseRespect: 0.0001, baseWanted: 0.001, baseMoney: 4,
                                         agiWeight: 20, dexWeight: 20, chaWeight: 60, difficulty: 3}),
    "Run a Con" :               new GangMemberTask(
                                        "Run a Con",
                                        "Assign this gang member to run cons<br><br>" +
                                        "Earns money - Increases respect - Increases wanted level",
                                        {baseRespect: 0.0005, baseWanted: 0.01, baseMoney: 10,
                                         strWeight: 5, defWeight: 5, agiWeight: 25, dexWeight: 25, chaWeight: 40, difficulty: 10}),
    "Armed Robbery" :           new GangMemberTask(
                                        "Armed Robbery",
                                        "Assign this gang member to commit armed robbery on stores, banks and armored cars<br><br>" +
                                        "Earns money - Increases respect - Increases wanted level",
                                        {baseRespect: 0.0003, baseWanted: 0.05, baseMoney: 25,
                                         hackWeight: 20, strWeight: 15, defWeight: 15, agiWeight: 10, dexWeight: 20, chaWeight: 20,
                                         difficulty: 17}),
    "Traffick Illegal Arms" :   new GangMemberTask(
                                        "Traffick Illegal Arms",
                                        "Assign this gang member to traffick illegal arms<br><br>" +
                                        "Earns money - Increases respect - Increases wanted level",
                                        {baseRespect: 0.001, baseWanted: 0.1, baseMoney: 40,
                                         hackWeight: 15, strWeight: 20, defWeight: 20, dexWeight: 20, chaWeight: 75,
                                         difficulty: 25}),
    "Threaten & Blackmail" :    new GangMemberTask(
                                        "Threaten & Blackmail",
                                        "Assign this gang member to threaten and black mail high-profile targets<br><br>" +
                                        "Earns money - Slightly increases respect - Slightly increases wanted level",
                                        {baseRespect: 0.0001, baseWanted: 0.05, baseMoney: 15,
                                         hackWeight: 25, strWeight: 25, dexWeight: 25, chaWeight: 25, difficulty: 28}),
    "Terrorism" :               new GangMemberTask(
                                        "Terrorism",
                                        "Assign this gang member to commit acts of terrorism<br><br>" +
                                        "Greatly increases respect - Greatly increases wanted level",
                                        {baseRespect: 0.01, baseWanted: 1,
                                         hackWeight: 20, strWeight: 20, defWeight: 20,dexWeight: 20, chaWeight: 20,
                                         difficulty: 33}),
    "Vigilante Justice" :       new GangMemberTask(
                                        "Vigilante Justice",
                                        "Assign this gang member to be a vigilante and protect the city from criminals<br><br>" +
                                        "Decreases wanted level",
                                        {baseWanted: -0.001,
                                         hackWeight: 20, strWeight: 20, defWeight: 20, dexWeight: 20, agiWeight:20,
                                         difficulty: 1}),
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
}


function GangMemberUpgrade(name, desc) {
    this.name = name;
    this.desc = desc;
}

//Passes in a GangMember object
GangMemberUpgrade.prototype.apply = function(member) {
    switch(this.name) {
        case "Baseball Bat":
            member.str *= 1.1;
            member.def *= 1.1;
            break;
        case "Katana":
            member.str *= 1.15;
            member.def *= 1.15;
            member.dex *= 1.15;
            break;
        case "Glock 18C":
            member.str *= 1.2;
            member.def *= 1.2;
            member.dex *= 1.2;
            member.agi *= 1.2;
            break;
        case "P90":
            member.str *= 1.4;
            member.def *= 1.4;
            member.agi *= 1.2;
            break;
        case "Steyr AUG":
            member.str *= 1.6;
            member.def *= 1.6;
            break;
        case "AK-47":
            member.str *= 1.8;
            member.def *= 1.8;
            break;
        case "M15A10 Assault Rifle":
            member.str *= 1.9;
            member.def *= 1.9;
            break;
        case "AWM Sniper Rifle":
            member.str *= 1.8;
            member.dex *= 1.8;
            member.agi *= 1.8;
            break;
        case "Bulletproof Vest":
            member.def *= 1.15;
            break;
        case "Full Body Armor":
            member.def *= 1.3;
            break;
        case "Liquid Body Armor":
            member.def *= 1.5;
            member.agi *= 1.5;
            break;
        case "Graphene Plating Armor":
            member.def *= 2;
            break;
        case "Ford Flex V20":
            member.agi *= 1.2;
            member.cha *= 1.2;
            break;
        case "ATX1070 Superbike":
            member.agi *= 1.4;
            member.cha *+ 1.4;
            break;
        case "Mercedes-Benz S9001":
            member.agi *= 1.6;
            member.cha *= 1.6;
            break;
        case "White Ferrari":
            member.agi *= 1.8;
            member.cha *= 1.8;
            break;
        case "NUKE Rootkit":
            member.hack *= 1.2;
            break;
        case "Soulstealer Rootkit":
            member.hack *= 1.3;
            break;
        case "Demon Rootkit":
            member.hack *= 1.3;
            break;
        default:
            console.log("ERROR: Could not find this upgrade: " + this.name);
            break;
    }
}

GangMemberUpgrades = {
    "Baseball Bat" : new GangMemberUpgrade("Baseball Bat",
                            "Increases strength and defense by 10%"),
    "Katana" :       new GangMemberUpgrade("Katana",
                            "Increases strength, defense, and dexterity by 15%"),
    "Glock 18C" :    new GangMemberUpgrade("Glock 18C",
                            "Increases strength, defense, dexterity, and agility by 20%"),
    "P90" :          new GangMemberUpgrade("P90C",
                            "Increases strength and defense by 40%. Increases agility by 20%"),
    "Steyr AUG" :    new GangMemberUpgrade("Steyr AUG",
                            "Increases strength and defense by 60%"),
    "AK-47" :        new GangMemberUpgrade("AK-47",
                            "Increases strength and defense by 80%"),
    "M15A10 Assault Rifle" :    new GangMemberUpgrade("M15A10 Assault Rifle",
                                        "Increases strength and defense by 90%"),
    "AWM Sniper Rifle" :        new GangMemberUpgrade("AWM Sniper Rifle",
                                        "Increases strength, dexterity, and agility by 80%"),
    "Bulletproof Vest" :        new GangMemberUpgrade("Bulletproof Vest",
                                        "Increases defense by 15%"),
    "Full Body Armor" :         new GangMemberUpgrade("Full Body Armor",
                                        "Increases defense by 30%"),
    "Liquid Body Armor" :       new GangMemberUpgrade("Liquid Body Armor",
                                        "Increases defense and agility by 50%"),
    "Graphene Plating Armor" :  new GangMemberUpgrade("Graphene Plating Armor",
                                        "Increases defense by 100%"),
    "Ford Flex V20" :           new GangMemberUpgrade("Ford Flex V20",
                                        "Increases agility and charisma by 20%"),
    "ATX1070 Superbike" :       new GangMemberUpgrade("ATX1070 Superbike",
                                        "Increases agility and charisma by 40%"),
    "Mercedes-Benz S9001" :     new GangMemberUpgrade("Mercedes-Benz S9001",
                                        "Increases agility and charisma by 60%"),
    "White Ferrari" :           new GangMemberUpgrade("White Ferrari",
                                        "Increases agility and charisma by 80%"),
    "NUKE Rootkit" :            new GangMemberUpgrade("NUKE Rootkit",
                                        "Increases hacking by 20%"),
    "Soulstealer Rootkit" :     new GangMemberUpgrade("Soulstealer Rootkit",
                                        "Increases hacking by 30%"),
    "Demon Rootkit" :           new GangMemberUpgrade("Demon Rootkit",
                                        "Increases hacking by 50%"),
}

var gangContentCreated = false;
function displayGangContent() {
    if (!gangContentCreated) {
        gangContentCreated = true;

        //Create gang container
        var container = document.createElement("div");
        document.getElementById("entire-game-container").appendChild(container);
        container.setAttribute("id", "gang-container");
        container.setAttribute("class", "generic-menupage-container");

        //Get variables
        var facName = Player.gang.facName;
        var members = Player.gang.members;
        var wanted = Player.gang.wanted;
        var respect = Player.gang.respect;

        //Buttons to switch between panels
        var managementButton = document.createElement("a");
        managementButton.setAttribute("id", "gang-management-subpage-button");
        managementButton.innerHTML = "Gang Management (1)";
        managementButton.setAttribute("class", "a-link-button-inactive");
        managementButton.style.display = "inline-block";
        var territoryButton = document.createElement("a");
        territoryButton.setAttribute("id", "gang-territory-subpage-button");
        territoryButton.innerHTML = "Gang Territory (2)";
        territoryButton.setAttribute("class", "a-link-button");
        territoryButton.style.display = "inline-block";

        managementButton.addEventListener("click", function() {
            document.getElementById("gang-management-subpage").style.display = "block";
            document.getElementById("gang-territory-subpage").style.display = "none";
            managementButton.classList.toggle("a-link-button-inactive");
            managementButton.classList.toggle("a-link-button");
            territoryButton.classList.toggle("a-link-button-inactive");
            territoryButton.classList.toggle("a-link-button");
            updateGangContent();
            return false;
        });

        territoryButton.addEventListener("click", function() {
            document.getElementById("gang-management-subpage").style.display = "none";
            document.getElementById("gang-territory-subpage").style.display = "block";
            managementButton.classList.toggle("a-link-button-inactive");
            managementButton.classList.toggle("a-link-button");
            territoryButton.classList.toggle("a-link-button-inactive");
            territoryButton.classList.toggle("a-link-button");
            updateGangContent();
            return false;
        });

        container.appendChild(managementButton);
        container.appendChild(territoryButton);

        //Subpage for managing gang members
        var managementSubpage = document.createElement("div");
        container.appendChild(managementSubpage);
        managementSubpage.style.display = "block";
        managementSubpage.setAttribute("id", "gang-management-subpage");
        var infoText = document.createElement("p");
        managementSubpage.appendChild(infoText);
        infoText.setAttribute("id", "gang-info");
        infoText.style.width = "70%";

        var recruitGangMemberBtn = document.createElement("a");
        managementSubpage.appendChild(recruitGangMemberBtn);
        recruitGangMemberBtn.setAttribute("id", "gang-management-recruit-member-btn");
        recruitGangMemberBtn.setAttribute("class", "a-link-button-inactive");
        recruitGangMemberBtn.innerHTML = "Recruit Gang Member";
        recruitGangMemberBtn.style.display = "inline-block";
        recruitGangMemberBtn.style.margin = "10px";
        recruitGangMemberBtn.addEventListener("click", () => {
            var yesBtn = yesNoTxtInpBoxGetYesButton(), noBtn = yesNoTxtInpBoxGetNoButton();
            yesBtn.innerHTML = "Recruit Gang Member";
            noBtn.innerHTML = "Cancel";
            yesBtn.addEventListener("click", ()=>{
                var name = yesNoTxtInpBoxGetInput();
                if (name == "") {
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
        });

        //Text for how much reputation is required for recruiting next memberList
        var recruitRequirementText = document.createElement("p");
        managementSubpage.appendChild(recruitRequirementText);
        recruitRequirementText.setAttribute("id", "gang-recruit-requirement-text");
        recruitRequirementText.style.color = "red";

        var memberList = document.createElement("ul");
        managementSubpage.appendChild(memberList);
        memberList.setAttribute("id", "gang-member-list");
        for (var i = 0; i < members.length; ++i) {
            createGangMemberDisplayElement(members[i]);
        }
        setGangMemberClickHandlers(); //Set buttons to toggle the gang member info panels

        //Subpage for seeing gang territory information
        var territorySubpage = document.createElement("div");
        container.appendChild(territorySubpage);
        territorySubpage.setAttribute("id", "gang-territory-subpage");
        territorySubpage.style.display = "none";

        //Info text for territory page
        var territoryInfoText = document.createElement("p");
        territorySubpage.appendChild(territoryInfoText);
        territoryInfoText.innerHTML =
            "This page shows how much territory your Gang controls. This statistic is listed as a percentage, " +
            "which represents how much of the total territory you control.<br><br>" +
            "Territory gain and loss is processed automatically and is updated every ~30 seconds. Your chances " +
            "to gain and lose territory depend on your Gang's power, which is listed in the display below. " +
            "Your gang's power is determined by the stats of all Gang members you have assigned to the " +
            "'Territory Warfare' task. Gang members that are not assigned to this task do not contribute to " +
            "your Gang's power.<br><br>" +
            "The amount of territory you have affects all aspects of your Gang members' production, including " +
            "money, respect, and wanted level. It is very beneficial to have high territory control.<br><br>"
        territoryInfoText.style.width = "70%";


        var territoryBorder = document.createElement("fieldset");
        territoryBorder.style.width = "50%";
        territoryBorder.style.display = "inline-block";

        var territoryP = document.createElement("p");
        territoryP.setAttribute("id", "gang-territory-info");

        territoryBorder.appendChild(territoryP);


        territorySubpage.appendChild(territoryBorder);
    }
    document.getElementById("gang-container").style.visibility = "visible";
    updateGangContent();
}

function updateGangContent() {
    if (!gangContentCreated || !Player.inGang()) {return;}

    if(document.getElementById("gang-territory-subpage").style.display === "block") {
        //Update territory information
        var elem = document.getElementById("gang-territory-info");
        elem.innerHTML = "";
        for (var gangname in AllGangs) {
            if (AllGangs.hasOwnProperty(gangname)) {
                var gangInfo = AllGangs[gangname];
                if (gangname == Player.gang.facName) {
                    elem.innerHTML += ("<b>" + gangname + "</b><br>(Power: " + formatNumber(gangInfo.power, 6) + "): " +
                                       formatNumber(100*gangInfo.territory, 2) + "%<br><br>");
                } else {
                    elem.innerHTML += (gangname + "<br>(Power: " + formatNumber(gangInfo.power, 6) + "): " +
                                       formatNumber(100*gangInfo.territory, 2) + "%<br><br>");
                }
            }
        }
    } else {
        //Update information for overall gang
        var gangInfo = document.getElementById("gang-info");
        if (gangInfo) {
            var faction = Factions[Player.gang.facName];
            var rep;
            if (!(faction instanceof Faction)) {
                rep = "ERROR";
            } else {
                rep = faction.playerReputation;
            }
            gangInfo.innerHTML =
                "<p>This page is used to manage your gang members and get an overview of your gang's stats. <br><br>" +
                "If a gang member is not earning much money or respect, the task that you have assigned to that member " +
                "might be too difficult. Consider training that member's stats or choosing an easier task. The tasks closer to the " +
                "top of the dropdown list are generally easier. Alternatively, the gang member's low production might be due to the " +
                "fact that your wanted level is too high. Consider assigning a few members to the 'Vigilante Justice' or 'Ethical Hacking' " +
                "tasks to lower your wanted level. <br><br>" +
                "Installing Augmentations does NOT reset your progress with your Gang. Furthermore, after installing Augmentations, you will " +
                "automatically be a member of whatever Faction you created your gain with.<br><br>" +
                "<p class='tooltip'>Respect: <span class='tooltiptext'>Represents the amount of respect " +
                "your gang has from other gangs and criminal organizations. Your respect affects the amount of money " +
                "your gang members will earn, and also determines how much reputation you are earning with your gang's " +
                "correpsonding Faction.</span></p><p>" + formatNumber(Player.gang.respect, 6) + " (" + formatNumber(5*Player.gang.respectGainRate, 6) + " / sec)</p><br>" +
                "<p class='tooltip'>Wanted Level: <span class='tooltiptext'>Represents how much the gang is wanted by law " +
                "enforcement. The higher your gang's wanted level, the harder it will be for your gang members to make " +
                "money and earn respect. Note that the minimum respect value is 1." +
                "</span></p><p>" + formatNumber(Player.gang.wanted, 6) + " (" + formatNumber(5*Player.gang.wantedGainRate, 6) + " / sec)<br><br>" +
                "Money gain rate: $" + formatNumber(5*Player.gang.moneyGainRate, 2) + " / sec<br><br>" +
                "Faction reputation: " + formatNumber(rep, 3) + "</p>";
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
        if (faction === null) {
            dialogBoxCreate("Could not find your gang's faction. This is probably a bug please report to dev");
            return;
        }
        var btn = document.getElementById("gang-management-recruit-member-btn");
        if (numMembers >= CONSTANTS.MaximumGangMembers) {
            btn.className = "a-link-button-inactive";
            document.getElementById("gang-recruit-requirement-text").style.display = "block";
            document.getElementById("gang-recruit-requirement-text").innerHTML =
                "You have reached the maximum amount of gang members";
        } else if (faction.playerReputation >= repCost) {
            btn.className = "a-link-button";
            document.getElementById("gang-recruit-requirement-text").style.display = "none";
        } else {
            btn.className = "a-link-button-inactive";
            document.getElementById("gang-recruit-requirement-text").style.display = "block";
            document.getElementById("gang-recruit-requirement-text").innerHTML =
                formatNumber(repCost, 2) + " Faction reputation needed to recruit next member";
        }

        //Update information for each gang member
        for (var i = 0; i < Player.gang.members.length; ++i) {
            updateGangMemberDisplayElement(Player.gang.members[i]);
        }
    }
}

function setGangMemberClickHandlers() {
    //Server panel click handlers
    var gangMemberHdrs = document.getElementsByClassName("gang-member-header");
    if (gangMemberHdrs == null) {
        console.log("ERROR: Could not find Active Scripts server panels");
        return;
    }
    for (i = 0; i < gangMemberHdrs.length; ++i) {
        gangMemberHdrs[i].onclick = function() {
            this.classList.toggle("active");

            var panel = this.nextElementSibling;
            if (panel.style.display === "block") {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
            }
        }
    }
}

//Takes in a GangMember object
function createGangMemberDisplayElement(memberObj) {
    if (!gangContentCreated || !Player.inGang()) {return;}
    var name = memberObj.name;

    var li = document.createElement("li");

    var hdr = document.createElement("button");
    hdr.setAttribute("class", "gang-member-header");
    hdr.setAttribute("id", name + "-gang-member-hdr");
    hdr.innerHTML = name;

    //Div for entire panel
    var gangMemberDiv = document.createElement("div");
    gangMemberDiv.setAttribute("class", "gang-member-panel");

    //Gang member content divided into 3 panels:
    //Stats Panel
    var statsDiv = document.createElement("div");
    statsDiv.setAttribute("id", name + "gang-member-stats");
    statsDiv.setAttribute("class", "gang-member-info-div");
    var statsP = document.createElement("p");
    statsP.setAttribute("id", name + "gang-member-stats-text");
    statsP.style.display = "inline";
    statsDiv.appendChild(statsP);

    //Panel for Selecting task and show respect/wanted gain
    var taskDiv = document.createElement("div");
    taskDiv.setAttribute("id", name + "gang-member-task");
    taskDiv.setAttribute("class", "gang-member-info-div");
    var taskSelector = document.createElement("select");
    taskSelector.style.color = "white";
    taskSelector.setAttribute("id", name + "gang-member-task-selector");
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
        for (i = 0; i < tasks.length; ++i) {
            if (taskName == tasks[i]) {
                taskIndex = i;
                break;
            }
        }
        taskSelector.selectedIndex = taskIndex;
    }

    var gainInfo = document.createElement("p"); //Wanted, respect, reputation, and money gain
    gainInfo.setAttribute("id", name + "gang-member-gain-info");
    taskDiv.appendChild(taskSelector);
    taskDiv.appendChild(gainInfo);

    //Panel for Description of task
    var taskDescDiv = document.createElement("div");
    taskDescDiv.setAttribute("id", name + "gang-member-task-desc");
    taskDescDiv.setAttribute("class", "gang-member-info-div");

    var taskDescP = document.createElement("p");
    taskDescP.setAttribute("id", name + "gang-member-task-description");
    taskDescP.style.display = "inline";
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

    li.appendChild(hdr);
    li.appendChild(gangMemberDiv);

    document.getElementById("gang-member-list").appendChild(li);
    setGangMemberTaskDescription(memberObj, taskName); //Initialize description
    setGangMemberClickHandlers(); //Reset click handlers
    updateGangMemberDisplayElement(memberObj);
}

function updateGangMemberDisplayElement(memberObj) {
    if (!gangContentCreated || !Player.inGang()) {return;}
    var name = memberObj.name;

    //TODO Add upgrade information
    var stats = document.getElementById(name + "gang-member-stats-text");
    if (stats) {
        stats.innerHTML =
            "Hacking: " + formatNumber(memberObj.hack, 0) + " (" + formatNumber(memberObj.hack_exp, 3) + " exp)<br>" +
            "Strength: " + formatNumber(memberObj.str, 0) + " (" + formatNumber(memberObj.str_exp, 3) + " exp)<br>" +
            "Defense: " + formatNumber(memberObj.def, 0) + " (" + formatNumber(memberObj.def_exp, 3) + " exp)<br>" +
            "Dexterity: " + formatNumber(memberObj.dex, 0) + " (" + formatNumber(memberObj.dex_exp, 3) + " exp)<br>" +
            "Agility: " + formatNumber(memberObj.agi, 0) + " (" + formatNumber(memberObj.agi_exp, 3) + " exp)<br>" +
            "Charisma: " + formatNumber(memberObj.cha, 0) + " (" + formatNumber(memberObj.cha_exp, 3) + " exp)<br>";
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
