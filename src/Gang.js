/*
gang member upgrades - they should be cheaper as the gang gets more  respect/power
kopelli09/12/2018
Another gang-related idea (and perhaps I'm not seeing it in the code) - gangs can lose power. Seems odd that the player's power can drop by removing members, but the other gangs are forever gaining power...
Grub09/12/2018
Maybe add a % chance of other gangs clashing?
assign gangs a number of gang members and each clash kills a number of gang members based on each one's power
and they lose a proportionate number of members
Also add police clashes
balance point to keep them from running out of control
*/

import {gangMemberTasksMetadata}                from "./data/gangmembertasks";
import {gangMemberUpgradesMetadata}             from "./data/gangmemberupgrades";

import {Engine}                                 from "./engine";
import {Faction, Factions,
        displayFactionContent}                  from "./Faction";
import {Player}                                 from "./Player";
import {numeralWrapper}                         from "./ui/numeralFormat";
import {dialogBoxCreate}                        from "../utils/DialogBox";
import {Reviver, Generic_toJSON,
        Generic_fromJSON}                       from "../utils/JSONReviver";
import {KEY}                                    from "../utils/helpers/keyCodes";
import {createAccordionElement}                 from "../utils/uiHelpers/createAccordionElement";
import {createElement}                          from "../utils/uiHelpers/createElement";
import {createPopup}                            from "../utils/uiHelpers/createPopup";
import {Page, routing}                          from "./ui/navigationTracking";
import {formatNumber}                           from "../utils/StringHelperFunctions";
import {exceptionAlert}                         from "../utils/helpers/exceptionAlert";
import {getRandomInt}                           from "../utils/helpers/getRandomInt";
import {removeChildrenFromElement}              from "../utils/uiHelpers/removeChildrenFromElement";
import {removeElement}                          from "../utils/uiHelpers/removeElement";
import {removeElementById}                      from "../utils/uiHelpers/removeElementById";
import {yesNoBoxCreate, yesNoTxtInpBoxCreate,
        yesNoBoxGetYesButton, yesNoBoxGetNoButton,
        yesNoTxtInpBoxGetYesButton, yesNoTxtInpBoxGetNoButton,
        yesNoTxtInpBoxGetInput, yesNoBoxClose,
        yesNoTxtInpBoxClose, yesNoBoxOpen}      from "../utils/YesNoBox";

// Constants
const GangRespectToReputationRatio = 2; //Respect is divided by this to get rep gain
const MaximumGangMembers = 47;
const GangRecruitCostMultiplier = 2;
const GangTerritoryUpdateTimer = 150;
const AscensionMultiplierRatio = 10 / 100; //Portion upgrade multiplier is kept after ascending

// Switch between territory and management screen with 1 and 2
$(document).keydown(function(event) {
    if (routing.isOn(Page.Gang) && !yesNoBoxOpen) {
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
    if (gangStoredTerritoryCycles < GangTerritoryUpdateTimer) {return;}

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

    gangStoredTerritoryCycles -= GangTerritoryUpdateTimer;
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
    if (this.storedCycles < 25) { return; } //Only process every 5 seconds at least

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

    if (typeof respectGains === "number") {
        var gain = respectGains * this.storedCycles;
        this.respect += (gain);
        // Faction reputation gains is respect gain divided by some constant
        var fac = Factions[this.facName];
        if (!(fac instanceof Faction)) {
            dialogBoxCreate("ERROR: Could not get Faction associates with your gang. This is a bug, please report to game dev");
        } else {
            var favorMult = 1 + (fac.favor / 100);
            fac.playerReputation += ((Player.faction_rep_mult * gain * favorMult) / GangRespectToReputationRatio);
        }

        // Keep track of respect gained per member
        for (let i = 0; i < this.members.length; ++i) {
            this.members[i].recordEarnedRespect(this.storedCycles);
        }
    } else {
        console.warn("respectGains calculated to be NaN");
    }
    if (typeof wantedLevelGains === "number") {
        if (this.wanted === 1 && wantedLevelGains < 0) {
            //Do nothing
        } else {
            const oldWanted = this.wanted;
            let newWanted =  + (wantedLevelGains * this.storedCycles);

            // Prevent overflow
            if (wantedLevelGains <= 0 && newWanted > oldWanted) {
                newWanted = 1;
            }

            this.wanted = newWanted;
            if (this.wanted < 1) {this.wanted = 1;}
        }
    } else {
        console.warn("ERROR: wantedLevelGains is NaN");
    }
    if (typeof moneyGains === "number") {
        Player.gainMoney(moneyGains * this.storedCycles);
    } else {
        console.warn("ERROR: respectGains is NaN");
    }

    this.storedCycles = 0;
}

Gang.prototype.canRecruitMember = function() {
    if (this.members.length >= MaximumGangMembers) { return false; }
    return (this.respect >= this.getRespectNeededToRecruitMember());
}

Gang.prototype.getRespectNeededToRecruitMember = function() {
    // First N gang members are free (can be recruited at 0 respect)
    const numFreeMembers = 3;
    if (this.members.length < numFreeMembers) { return 0; }

    const i = this.members.length - (numFreeMembers - 1);
    return Math.round(0.7 * Math.pow(i, 3) + 0.8 * Math.pow(i, 2));
}

// Money and Respect gains multiplied by this number (< 1)
Gang.prototype.getWantedPenalty = function() {
    return (this.respect) / (this.respect + this.wanted);
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

Gang.prototype.killMember = function(memberObj) {
    // TODO
}

Gang.prototype.ascendMember = function(memberObj) {
    try {
        //Member.ascend() returns the amount of respect to deduct
        this.respect = Math.min(1, this.respect - memberObj.ascend());
    } catch(e) {
        exceptionAlert(e);
    }
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

    this.earnedRespect = 0;

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

    this.hack_asc_mult  = 1;
    this.str_asc_mult   = 1;
    this.def_asc_mult   = 1;
    this.dex_asc_mult   = 1;
    this.agi_asc_mult   = 1;
    this.cha_asc_mult   = 1;

    this.upgrades = [];         //Names of upgrades
    this.augmentations = [];    //Names only
}

//Same formula for Player
GangMember.prototype.calculateSkill = function(exp, mult=1) {
    return Math.max(Math.floor(mult * (32 * Math.log(exp + 534.5) - 200)), 1);
}

GangMember.prototype.updateSkillLevels = function() {
    this.hack   = this.calculateSkill(this.hack_exp, this.hack_mult * this.hack_asc_mult);
    this.str    = this.calculateSkill(this.str_exp, this.str_mult * this.str_asc_mult);
    this.def    = this.calculateSkill(this.def_exp, this.def_mult * this.def_asc_mult);
    this.dex    = this.calculateSkill(this.dex_exp, this.dex_mult * this.dex_asc_mult);
    this.agi    = this.calculateSkill(this.agi_exp, this.agi_mult * this.agi_asc_mult);
    this.cha    = this.calculateSkill(this.cha_exp, this.cha_mult * this.cha_asc_mult);
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
    if (statWeight <= 0) { return 0; }
    var territoryMult = AllGangs[Player.gang.facName].territory;
    if (territoryMult <= 0) { return 0; }
    var respectMult = Player.gang.getWantedPenalty();
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
    var respectMult = Player.gang.getWantedPenalty();
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

GangMember.prototype.recordEarnedRespect = function(numCycles=1) {
    this.earnedRespect += (this.calculateRespectGain() * numCycles);
}

GangMember.prototype.ascend = function() {
    // Calculate ascension bonus to stat multipliers.
    // This is based on the current number of multipliers from Non-Augmentation upgrades
    // + Ascension Bonus = N% of current bonus from Augmentations
    let hack = 1;
    let str = 1;
    let def = 1;
    let dex = 1;
    let agi = 1;
    let cha = 1;
    for (let i = 0; i < this.upgrades.length; ++i) {
        let upg = GangMemberUpgrades[this.upgrades[i]];
        if (upg.mults.hack != null) { hack *= upg.mults.hack; }
        if (upg.mults.str != null)  { str *= upg.mults.str; }
        if (upg.mults.def != null)  { def *= upg.mults.def; }
        if (upg.mults.dex != null)  { dex *= upg.mults.dex; }
        if (upg.mults.agi != null)  { agi *= upg.mults.agi; }
        if (upg.mults.cha != null)  { cha *= upg.mults.cha; }
    }

    // Get just the bonus multiplier part, and then record
    --hack; --str; --def; --dex; --agi; --cha;
    this.hack_asc_mult += (hack * AscensionMultiplierRatio);
    this.str_asc_mult += (str * AscensionMultiplierRatio);
    this.def_asc_mult += (def * AscensionMultiplierRatio);
    this.dex_asc_mult += (dex * AscensionMultiplierRatio);
    this.agi_asc_mult += (agi * AscensionMultiplierRatio);
    this.cha_asc_mult += (cha * AscensionMultiplierRatio);

    // Remove upgrades. Then re-calculate multipliers and stats
    this.upgrades.length = 0;
    this.hack_mult = 1;
    this.str_mult = 1;
    this.def_mult = 1;
    this.dex_mult = 1;
    this.agi_mult = 1;
    this.cha_mult = 1;
    for (let i = 0; i < this.augmentations.length; ++i) {
        let aug = GangMemberUpgrades[this.augmentations[i]];
        aug.apply(this);
    }
    this.updateSkillLevels();

    const respectToDeduct = this.earnedRespect;
    this.earnedRespect = 0;
    return respectToDeduct;
}

GangMember.prototype.toJSON = function() {
	return Generic_toJSON("GangMember", this);
}

GangMember.fromJSON = function(value) {
	return Generic_fromJSON(GangMember, value.data);
}

Reviver.constructors.GangMember = GangMember;

//Defines tasks that Gang Members can work on
function GangMemberTask(name="", desc="", isHacking=false, isCombat=false,
                        params={baseRespect: 0, baseWanted: 0, baseMoney: 0,
                                hackWeight: 0, strWeight: 0, defWeight: 0,
                                dexWeight: 0, agiWeight: 0, chaWeight: 0,
                                difficulty: 0}) {
    this.name = name;
    this.desc = desc;

    // Flags that describe whether this Task is applicable for Hacking/Combat gangs
    this.isHacking = isHacking;
    this.isCombat = isCombat;

    // Base gain rates for respect/wanted/money
    this.baseRespect    = params.baseRespect ? params.baseRespect   : 0;
    this.baseWanted     = params.baseWanted  ? params.baseWanted    : 0;
    this.baseMoney      = params.baseMoney   ? params.baseMoney     : 0;

    // Weighting for the effect that each stat has on the tasks effectiveness.
    // Weights must add up to 100
    this.hackWeight     = params.hackWeight ? params.hackWeight : 0;
    this.strWeight      = params.strWeight  ? params.strWeight  : 0;
    this.defWeight      = params.defWeight  ? params.defWeight  : 0;
    this.dexWeight      = params.dexWeight  ? params.dexWeight  : 0;
    this.agiWeight      = params.agiWeight  ? params.agiWeight  : 0;
    this.chaWeight      = params.chaWeight  ? params.chaWeight  : 0;

    // 1 - 100
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
const GangMemberTasks = {};

function addGangMemberTask(name, desc, isHacking, isCombat, params) {
    GangMemberTasks[name] = new GangMemberTask(name, desc, isHacking, isCombat, params);
}

gangMemberTasksMetadata.forEach((e) => {
    addGangMemberTask(e.name, e.desc, e.isHacking, e.isCombat, e.params);
});

function GangMemberUpgrade(name="", cost=0, type="w", mults={}) {
    this.name = name;
    this.cost = cost;
    this.type = type; //w = weapon, a = armor, v = vehicle, r = rootkit, g = Aug
    this.mults = mults;

    this.createDescription();
}

GangMemberUpgrade.prototype.createDescription = function() {
    const lines = ["Increases:"];
    if (this.mults.str != null) {
        lines.push(`* Strength by ${Math.round((this.mults.str - 1) * 100)}%`);
    }
    if (this.mults.def != null) {
        lines.push(`* Defense by ${Math.round((this.mults.def - 1) * 100)}%`);
    }
    if (this.mults.dex != null) {
        lines.push(`* Dexterity by ${Math.round((this.mults.dex - 1) * 100)}%`);
    }
    if (this.mults.agi != null) {
        lines.push(`* Agility by ${Math.round((this.mults.agi - 1) * 100)}%`);
    }
    if (this.mults.cha != null) {
        lines.push(`* Charisma by ${Math.round((this.mults.cha - 1) * 100)}%`);
    }
    if (this.mults.hack != null) {
        lines.push(`* Hacking by ${Math.round((this.mults.hack - 1) * 100)}%`);
    }
    this.desc = lines.join("\n");
}

//Passes in a GangMember object
GangMemberUpgrade.prototype.apply = function(member) {
    if (this.mults.str != null)     { member.str_mult *= this.mults.str; }
    if (this.mults.def != null)     { member.def_mult *= this.mults.def; }
    if (this.mults.dex != null)     { member.dex_mult *= this.mults.dex; }
    if (this.mults.agi != null)     { member.agi_mult *= this.mults.agi; }
    if (this.mults.cha != null)     { member.cha_mult *= this.mults.cha; }
    if (this.mults.hack != null)    { member.hack_mult *= this.mults.hack; }
    return;
}

GangMemberUpgrade.prototype.toJSON = function() {
	return Generic_toJSON("GangMemberUpgrade", this);
}

GangMemberUpgrade.fromJSON = function(value) {
	return Generic_fromJSON(GangMemberUpgrade, value.data);
}

Reviver.constructors.GangMemberUpgrade = GangMemberUpgrade;

// Initialize Gang Member Upgrades
const GangMemberUpgrades = {}

function addGangMemberUpgrade(name, cost, type, mults) {
    GangMemberUpgrades[name] = new GangMemberUpgrade(name, cost, type, mults);
}

gangMemberUpgradesMetadata.forEach((e) => {
    addGangMemberUpgrade(e.name, e.cost, e.upgType, e.mults);
});

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
    const weaponUpgrades = [];
    const armorUpgrades = [];
    const vehicleUpgrades = [];
    const rootkitUpgrades = [];
    const augUpgrades = [];

    for (let upgName in GangMemberUpgrades) {
        if (GangMemberUpgrades.hasOwnProperty(upgName)) {
            let upg = GangMemberUpgrades[upgName];
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
                case "g":
                    augUpgrades.push(upg);
                default:
                    console.error(`ERROR: Invalid Gang Member Upgrade Type: ${upg.type}`);
            }
        }
    }

    const weaponDiv   = createElement("div", {width: "16%", display: "inline-block"});
    const armorDiv    = createElement("div", {width: "16%", display: "inline-block"});
    const vehicleDiv  = createElement("div", {width: "16%", display: "inline-block"});
    const rootkitDiv  = createElement("div", {width: "16%", display: "inline-block"});
    const augDiv      = createElement("div", {width: "16%", display: "inline-block"});
    const upgrades = [weaponUpgrades, armorUpgrades, vehicleUpgrades, rootkitUpgrades, augUpgrades];
    const divs = [weaponDiv, armorDiv, vehicleDiv, rootkitDiv, augDiv];

    for (let i = 0; i < upgrades.length; ++i) {
        let upgradeArray = upgrades[i];
        let div = divs[i];
        for (let j = 0; j < upgradeArray.length; ++j) {
            let upg = upgradeArray[j];
            (function (upg, div, memberObj) {
                div.appendChild(createElement("a", {
                    innerText:upg.name + " - " + numeralWrapper.format(upg.cost, "$0.000a"),
                    class:"a-link-button", margin:"2px",  padding:"2px", display:"block",
                    fontSize:"11px",
                    tooltip:upg.desc,
                    clickListener:()=>{
                        if (Player.money.lt(upg.cost)) { return false; }
                        Player.loseMoney(upg.cost);
                        if (upg.type === "g") {
                            memberObj.augmentations.push(upg.name);
                        } else {
                            memberObj.upgrades.push(upg.name);
                        }
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
                let popupId = "recruit-gang-member-popup";

                let yesBtn;
                const txt = createElement("p", {
                    innerText:"Please enter a name for your new Gang member:",
                });
                const br = createElement("br");
                const nameInput = createElement("input", {
                    onkeyup: (e) => {
                        if (e.keyCode === KEY.ENTER) { yesBtn.click(); }
                    },
                    placeholder: "Name must be unique",
                    type: "text",
                });
                yesBtn = createElement("a", {
                    class: "a-link-button",
                    clickListener: () => {
                        let name = nameInput.value;

                        // Check for already-existing names
                        let sameNames = Player.gang.members.filter((m) => {
                            return m.name === name;
                        });
                        if (sameNames.length >= 1) {
                            dialogBoxCreate("You already have a gang member with this name!");
                            return false;
                        }

                        if (name === "") {
                            dialogBoxCreate("You must enter a name for your Gang member!");
                        } else {
                            let member = new GangMember(name);
                            Player.gang.members.push(member);
                            createGangMemberDisplayElement(member);
                            updateGangContent();
                            removeElementById(popupId);
                        }
                        return false;
                    },
                    innerText: "Recruit Gang Member",
                });
                const noBtn = createElement("a", {
                    class: "a-link-button",
                    clickListener: () => {
                        removeElementById(popupId);
                        return false;
                    },
                    innerText: "Cancel",
                });
                createPopup(popupId, [txt, br, nameInput, yesBtn, noBtn]);
            }
        });
        gangManagementSubpage.appendChild(gangRecruitMemberButton);

        // Text for how much reputation is required for recruiting next memberList
        gangRecruitRequirementText = createElement("p", {
            color:"red",
            id: "gang-recruit-requirement-text",
            margin: "10px",
        });
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

            var wantedPenalty = Player.gang.getWantedPenalty();
            wantedPenalty = (1 - wantedPenalty) * 100;
            gangInfo.appendChild(createElement("p", {   //Wanted Level multiplier
                display:"inline-block",
                innerText:`Wanted Level Penalty: -${formatNumber(wantedPenalty, 2)}%`,
                tooltip:"Penalty for respect and money gain rates due to Wanted Level"
            }));
            gangInfo.appendChild(createElement("br", {}));

            gangInfo.appendChild(createElement("p", {   //Money gain rate
                display:"inline-block",
                innerText: `Money gain rate: ${numeralWrapper.format(5 * Player.gang.moneyGainRate, "$0.000a")} / sec`,
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
                innerText:`Territory: ${formatNumber(displayNumber, 3)}%`,
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
        const numMembers = Player.gang.members.length;
        const respectCost = Player.gang.getRespectNeededToRecruitMember();

        const btn = gangRecruitMemberButton;
        if (numMembers >= MaximumGangMembers) {
            btn.className = "a-link-button-inactive";
            gangRecruitRequirementText.style.display = "inline-block";
            gangRecruitRequirementText.innerHTML = "You have reached the maximum amount of gang members";
        } else if (Player.gang.canRecruitMember()) {
            btn.className = "a-link-button";
            gangRecruitRequirementText.style.display = "none";
        } else {
            btn.className = "a-link-button-inactive";
            gangRecruitRequirementText.style.display = "inline-block";
            gangRecruitRequirementText.innerHTML = `${formatNumber(respectCost, 2)} respect needed to recruit next member`;
        }

        //Update information for each gang member
        for (let i = 0; i < Player.gang.members.length; ++i) {
            updateGangMemberDisplayElement(Player.gang.members[i]);
        }
    }
}

//Takes in a GangMember object
function createGangMemberDisplayElement(memberObj) {
    if (!gangContentCreated || !Player.inGang()) {return;}
    const name = memberObj.name;

    var accordion = createAccordionElement({
        id: name + "gang-member",
        hdrText: name,
    });
    const li = accordion[0];
    const hdr = accordion[1];
    const gangMemberDiv = accordion[2];

    // Gang member content divided into 3 panels:
    // Panel 1 - Shows member's stats & Ascension stuff
    const statsDiv = createElement("div", {
        class: "gang-member-info-div",
        id: name + "gang-member-stats",
    });
    const statsP = createElement("p", {
        id: name + "gang-member-stats-text", display: "inline"
    });
    const ascendButton = createElement("button", {
        class: "accordion-button",
        innerText: "Ascend",
        clickListener: () => {
            Player.gang.ascendMember(memberObj);
            return false;
        }
    });
    const ascendHelpTip = createElement("div", {
        backgroundColor: "black",
        class: "help-tip",
        clickListener: () => {
            dialogBoxCreate("TODO");
        },
        innerText: "?"
    });

    statsDiv.appendChild(statsP);
    statsDiv.appendChild(ascendButton);
    statsDiv.appendChild(ascendHelpTip);

    // Panel 2 - Task Selection & Info
    const taskDiv = createElement("div", {
        class:"gang-member-info-div",
        id: name + "gang-member-task",
    });
    const taskSelector = createElement("select", {
        id: name + "gang-member-task-selector",
    });

    // Get an array of the name of all tasks that are applicable for this Gang
    let tasks = null;
    const allTasks = Object.keys(GangMemberTasks);
    if (Player.gang.isHackingGang) {
        tasks = allTasks.filter((e) => {
            let task = GangMemberTasks[e];
            if (task == null) { return false; }
            if (e === "Unassigned") { return false; }
            return task.isHacking;
        });
    } else {
        tasks = allTasks.filter((e) => {
            let task = GangMemberTasks[e];
            if (task == null) { return false; }
            if (e === "Unassigned") { return false; }
            return task.isCombat;
        });
    }
    tasks.unshift("---");

    // Create selector for Gang member task
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

    // Set initial task in selector
    if (memberObj.task instanceof GangMemberTask) {
        var taskName = memberObj.task.name;
        var taskIndex = 0;
        for (let i = 0; i < tasks.length; ++i) {
            if (taskName === tasks[i]) {
                taskIndex = i;
                break;
            }
        }
        taskSelector.selectedIndex = taskIndex;
        setGangMemberTaskDescription(memberObj, taskName);
    }

    var gainInfo = createElement("p", {id:name + "gang-member-gain-info"});
    taskDiv.appendChild(taskSelector);
    taskDiv.appendChild(gainInfo);

    //Panel for Description of task
    var taskDescDiv = createElement("div", {
        class:"gang-member-info-div",
        id: name + "gang-member-task-desc",
    });

    var taskDescP = createElement("p", {id: name + "gang-member-task-description", display:"inline"});
    taskDescDiv.appendChild(taskDescP);

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
            "Hacking: " + formatNumber(memberObj.hack, 0) + " (" + numeralWrapper.format(memberObj.hack_exp, '(0.00a)') + " exp)<br>" +
            "Strength: " + formatNumber(memberObj.str, 0) + " (" + numeralWrapper.format(memberObj.str_exp, '(0.00a)') + " exp)<br>" +
            "Defense: " + formatNumber(memberObj.def, 0) + " (" + numeralWrapper.format(memberObj.def_exp, '(0.00a)') + " exp)<br>" +
            "Dexterity: " + formatNumber(memberObj.dex, 0) + " (" + numeralWrapper.format(memberObj.dex_exp, '(0.00a)') + " exp)<br>" +
            "Agility: " + formatNumber(memberObj.agi, 0) + " (" + numeralWrapper.format(memberObj.agi_exp, '(0.00a)') + " exp)<br>" +
            "Charisma: " + formatNumber(memberObj.cha, 0) + " (" + numeralWrapper.format(memberObj.cha_exp, '(0.00a)') + " exp)<br>";
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
        if (task == null) { task = GangMemberTasks["Unassigned"]; }
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
