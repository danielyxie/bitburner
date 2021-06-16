/**
 * TODO
 * Add police clashes
 * balance point to keep them from running out of control
*/

import { gangMemberTasksMetadata } from "./Gang/data/tasks";
import { gangMemberUpgradesMetadata } from "./Gang/data/upgrades";

import { Engine } from "./engine";
import { Faction } from "./Faction/Faction";
import { Factions } from "./Faction/Factions";
import { displayFactionContent } from "./Faction/FactionHelpers";

import { Page, routing } from "./ui/navigationTracking";
import { numeralWrapper } from "./ui/numeralFormat";

import { dialogBoxCreate } from "../utils/DialogBox";
import {
    Reviver,
    Generic_toJSON,
    Generic_fromJSON,
} from "../utils/JSONReviver";
import {
    formatNumber,
    convertTimeMsToTimeElapsedString,
} from "../utils/StringHelperFunctions";

import { exceptionAlert } from "../utils/helpers/exceptionAlert";
import { getRandomInt } from "../utils/helpers/getRandomInt";
import { KEY } from "../utils/helpers/keyCodes";

import { createAccordionElement } from "../utils/uiHelpers/createAccordionElement";
import { createElement } from "../utils/uiHelpers/createElement";
import { createPopup } from "../utils/uiHelpers/createPopup";
import { removeChildrenFromElement } from "../utils/uiHelpers/removeChildrenFromElement";
import { removeElement } from "../utils/uiHelpers/removeElement";
import { removeElementById } from "../utils/uiHelpers/removeElementById";

import { StatsTable } from "./ui/React/StatsTable";
import { Money } from "./ui/React/Money";
import { MoneyRate } from "./ui/React/MoneyRate";
import { Reputation } from "./ui/React/Reputation";

// import { GangMember as GM } from "./Gang/GangMember";
import { GangMemberUpgrade } from "./Gang/GangMemberUpgrade";
import { GangMemberUpgrades } from "./Gang/GangMemberUpgrades";
import { GangConstants } from "./Gang/data/Constants";
import { GangMemberTasks } from "./Gang/GangMemberTasks";
import { GangMemberTask } from "./Gang/GangMemberTask";

import { ManagementSubpage } from "./Gang/ui/ManagementSubpage";
import { TerritorySubpage } from "./Gang/ui/TerritorySubpage";
import { GangStats } from "./Gang/ui/GangStats";
import { AllGangs } from "./Gang/AllGangs";

import React from "react";
import ReactDOM from "react-dom";
import { renderToStaticMarkup } from "react-dom/server"

// Switch between territory and management screen with 1 and 2
$(document).keydown(function(event) {
    if (routing.isOn(Page.Gang) && event.altKey) {
        if (UIElems.gangMemberFilter != null && UIElems.gangMemberFilter === document.activeElement) {return;}
        if (event.keyCode === KEY["1"]) {
            if(UIElems.gangTerritorySubpage.style.display === "block") {
                UIElems.managementButton.click();
            }
        } else if (event.keyCode === KEY["2"]) {
            if (UIElems.gangManagementSubpage.style.display === "block") {
                UIElems.territoryButton.click();
            }
        }
    }
});


const GangNames = [
    "Slum Snakes",
    "Tetrads",
    "The Syndicate",
    "The Dark Army",
    "Speakers for the Dead",
    "NiteSec",
    "The Black Hand",
];

/**
 * @param facName {string} Name of corresponding faction
 * @param hacking {bollean} Whether or not its a hacking gang
 */
export function Gang(facName, hacking=false) {
    this.facName    = facName;
    this.members    = [];
    this.wanted     = 1;
    this.respect    = 1;

    this.isHackingGang = hacking;

    this.respectGainRate = 0;
    this.wantedGainRate = 0;
    this.moneyGainRate = 0;

    // When processing gains, this stores the number of cycles until some
    // limit is reached, and then calculates and applies the gains only at that limit
    this.storedCycles   = 0;

    // Separate variable to keep track of cycles for Territry + Power gang, which
    // happens on a slower "clock" than normal processing
    this.storedTerritoryAndPowerCycles = 0;

    this.territoryClashChance = 0;
    this.territoryWarfareEngaged = false;

    this.notifyMemberDeath = true;
}

Gang.prototype.getPower = function() {
    return AllGangs[this.facName].power;
}

Gang.prototype.getTerritory = function() {
    return AllGangs[this.facName].territory;
}

Gang.prototype.process = function(numCycles=1, player) {
    const CyclesPerSecond = 1000 / Engine._idleSpeed;

    if (isNaN(numCycles)) {
        console.error(`NaN passed into Gang.process(): ${numCycles}`);
    }
    this.storedCycles += numCycles;

    // Only process if there are at least 2 seconds, and at most 5 seconds
    if (this.storedCycles < 2 * CyclesPerSecond) { return; }
    const cycles = Math.min(this.storedCycles, 5 * CyclesPerSecond);

    try {
        this.processGains(cycles, player);
        this.processExperienceGains(cycles);
        this.processTerritoryAndPowerGains(cycles);
        this.storedCycles -= cycles;
    } catch(e) {
        exceptionAlert(`Exception caught when processing Gang: ${e}`);
    }
}

Gang.prototype.processGains = function(numCycles=1, player) {
    // Get gains per cycle
    let moneyGains = 0, respectGains = 0, wantedLevelGains = 0;
    let justice = 0;
    for (let i = 0; i < this.members.length; ++i) {
        respectGains += (this.members[i].calculateRespectGain(this));
        moneyGains += (this.members[i].calculateMoneyGain(this));
        const wantedLevelGain = this.members[i].calculateWantedLevelGain(this);
        wantedLevelGains += wantedLevelGain;
        if(wantedLevelGain < 0) justice++; // this member is lowering wanted.
    }
    this.respectGainRate = respectGains;
    this.wantedGainRate = wantedLevelGains;
    this.moneyGainRate = moneyGains;

    if (typeof respectGains === "number") {
        const gain = respectGains * numCycles;
        this.respect += gain;
        // Faction reputation gains is respect gain divided by some constant
        const fac = Factions[this.facName];
        if (!(fac instanceof Faction)) {
            dialogBoxCreate("ERROR: Could not get Faction associates with your gang. This is a bug, please report to game dev");
        } else {
            let favorMult = 1 + (fac.favor / 100);
            fac.playerReputation += ((player.faction_rep_mult * gain * favorMult) / GangConstants.GangRespectToReputationRatio);
        }

        // Keep track of respect gained per member
        for (let i = 0; i < this.members.length; ++i) {
            this.members[i].recordEarnedRespect(numCycles, this);
        }
    } else {
        console.warn("respectGains calculated to be NaN");
    }
    if (typeof wantedLevelGains === "number") {
        if (this.wanted === 1 && wantedLevelGains < 0) {
            // At minimum wanted, do nothing
        } else {
            const oldWanted = this.wanted;
            let newWanted = oldWanted + (wantedLevelGains * numCycles);
            newWanted = newWanted * (1 - justice * 0.001); // safeguard
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
        player.gainMoney(moneyGains * numCycles);
        player.recordMoneySource(moneyGains * numCycles, "gang");
    } else {
        console.warn("ERROR: respectGains is NaN");
    }
}

function calculateTerritoryGain(winGang, loseGang) {
    const powerBonus = Math.max(1, 1+Math.log(AllGangs[winGang].power/AllGangs[loseGang].power)/Math.log(50));
    const gains = Math.min(AllGangs[loseGang].territory, powerBonus*0.0001*(Math.random()+.5))
    return gains;
}

Gang.prototype.processTerritoryAndPowerGains = function(numCycles=1) {
    this.storedTerritoryAndPowerCycles += numCycles;
    if (this.storedTerritoryAndPowerCycles < GangConstants.CyclesPerTerritoryAndPowerUpdate) { return; }
    this.storedTerritoryAndPowerCycles -= GangConstants.CyclesPerTerritoryAndPowerUpdate;

    // Process power first
    const gangName = this.facName;
    for (const name in AllGangs) {
        if (AllGangs.hasOwnProperty(name)) {
            if (name == gangName) {
                AllGangs[name].power += this.calculatePower();
            } else {
                // All NPC gangs get random power gains
                const gainRoll = Math.random();
                if (gainRoll < 0.5) {
                    // Multiplicative gain (50% chance)
                    // This is capped per cycle, to prevent it from getting out of control
                    const multiplicativeGain = AllGangs[name].power * 0.005;
                    AllGangs[name].power += Math.min(0.85, multiplicativeGain);
                } else {
                    // Additive gain (50% chance)
                    const additiveGain = 0.75 * gainRoll * AllGangs[name].territory;
                    AllGangs[name].power += (additiveGain);
                }
            }
        }
    }

    // Determine if territory should be processed
    if (this.territoryWarfareEngaged) {
        this.territoryClashChance = 1;
    } else if (this.territoryClashChance > 0) {
        // Engagement turned off, but still a positive clash chance. So there's
        // still a chance of clashing but it slowly goes down over time
        this.territoryClashChance = Math.max(0, this.territoryClashChance - 0.01);
    }

    // Then process territory
    for (let i = 0; i < GangNames.length; ++i) {
        const others = GangNames.filter((e) => {
            return e !== GangNames[i];
        });
        const other = getRandomInt(0, others.length - 1);

        const thisGang = GangNames[i];
        const otherGang = others[other];

        // If either of the gangs involved in this clash is the player, determine
        // whether to skip or process it using the clash chance
        if (thisGang === gangName || otherGang === gangName) {
            if (!(Math.random() < this.territoryClashChance)) { continue; }
        }

        const thisPwr = AllGangs[thisGang].power;
        const otherPwr = AllGangs[otherGang].power;
        const thisChance = thisPwr / (thisPwr + otherPwr);


        if (Math.random() < thisChance) {
            if (AllGangs[otherGang].territory <= 0) {
                return;
            }
            const territoryGain = calculateTerritoryGain(thisGang, otherGang);
            AllGangs[thisGang].territory += territoryGain;
            AllGangs[otherGang].territory -= territoryGain;
            if (thisGang === gangName) {
                this.clash(true); // Player won
                AllGangs[otherGang].power *= (1 / 1.01);
            } else if (otherGang === gangName) {
                this.clash(false); // Player lost
            } else {
                AllGangs[otherGang].power *= (1 / 1.01);
            }
        } else {
            if (AllGangs[thisGang].territory <= 0) {
                return;
            }
            const territoryGain = calculateTerritoryGain(otherGang, thisGang);
            AllGangs[thisGang].territory -= territoryGain;
            AllGangs[otherGang].territory += territoryGain;
            if (thisGang === gangName) {
                this.clash(false); // Player lost
            } else if (otherGang === gangName) {
                this.clash(true); // Player won
                AllGangs[thisGang].power *= (1 / 1.01);
            } else {
                AllGangs[thisGang].power *= (1 / 1.01);
            }
        }
    }
}

Gang.prototype.canRecruitMember = function() {
    if (this.members.length >= GangConstants.MaximumGangMembers) { return false; }
    return (this.respect >= this.getRespectNeededToRecruitMember());
}

Gang.prototype.getRespectNeededToRecruitMember = function() {
    // First N gang members are free (can be recruited at 0 respect)
    const numFreeMembers = 3;
    if (this.members.length < numFreeMembers) { return 0; }

    const i = this.members.length - (numFreeMembers - 1);
    return Math.round(0.9 * Math.pow(i, 3) + Math.pow(i, 2));
}

Gang.prototype.recruitMember = function(name) {
    name = String(name);
    if (name === "" || !this.canRecruitMember()) { return false; }

    // Check for already-existing names
    let sameNames = this.members.filter((m) => {
        return m.name === name;
    });
    if (sameNames.length >= 1) { return false; }

    let member = new GangMember(name);
    this.members.push(member);
    return true;
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
        if (GangMemberTasks.hasOwnProperty(this.members[i].task) && this.members[i].task == "Territory Warfare") {
            const gain = this.members[i].calculatePower();
            memberTotal += gain;
        }
    }
    return (0.015 * this.getTerritory() * memberTotal);
}

Gang.prototype.clash = function(won=false) {
    // Determine if a gang member should die
    let baseDeathChance = 0.01;
    if (won) { baseDeathChance /= 2; }

    // If the clash was lost, the player loses a small percentage of power
    if (!won) {
        AllGangs[this.facName].power *= (1 / 1.008);
    }

    // Deaths can only occur during X% of clashes
    if (Math.random() < 0.65) { return; }

    for (let i = this.members.length - 1; i >= 0; --i) {
        const member = this.members[i];

        // Only members assigned to Territory Warfare can die
        if (member.task !== "Territory Warfare") { continue; }

        // Chance to die is decreased based on defense
        const modifiedDeathChance = baseDeathChance / Math.pow(member.def, 0.6);
        if (Math.random() < modifiedDeathChance) {
            this.killMember(member);
        }
    }
}

Gang.prototype.killMember = function(memberObj) {
    // Player loses a percentage of total respect, plus whatever respect that member has earned
    const totalRespect = this.respect;
    const lostRespect = (0.05 * totalRespect) + memberObj.earnedRespect;
    this.respect = Math.max(0, totalRespect - lostRespect);

    for (let i = 0; i < this.members.length; ++i) {
        if (memberObj.name === this.members[i].name) {
            this.members.splice(i, 1);
            break;
        }
    }

    // Notify of death
    if (this.notifyMemberDeath) {
        dialogBoxCreate(`${memberObj.name} was killed in a gang clash! You lost ${lostRespect} respect`);
    }

}

Gang.prototype.ascendMember = function(memberObj, workerScript) {
    try {
        /**
         * res is an object with the following format:
         * {
         *  respect: Amount of respect to deduct
         *  hack/str/def/dex/agi/cha: Ascension multipliers gained for each stat
         * }
         */
        const res = memberObj.ascend();
        this.respect = Math.max(1, this.respect - res.respect);
        if (workerScript == null) {
            dialogBoxCreate([`You ascended ${memberObj.name}!`,
                             "",
                             `Your gang lost ${numeralWrapper.formatRespect(res.respect)} respect`,
                             "",
                             `${memberObj.name} gained the following stat multipliers for ascending:`,
                             `Hacking: ${numeralWrapper.formatPercentage(res.hack, 3)}`,
                             `Strength: ${numeralWrapper.formatPercentage(res.str, 3)}`,
                             `Defense: ${numeralWrapper.formatPercentage(res.def, 3)}`,
                             `Dexterity: ${numeralWrapper.formatPercentage(res.dex, 3)}`,
                             `Agility: ${numeralWrapper.formatPercentage(res.agi, 3)}`,
                             `Charisma: ${numeralWrapper.formatPercentage(res.cha, 3)}`].join("<br>"));
        } else {
            workerScript.log(`Ascended Gang member ${memberObj.name}`);
        }
        return res;
    } catch(e) {
        if (workerScript == null) {
            exceptionAlert(e);
        } else {
            throw e; // Re-throw, will be caught in the Netscript Function
        }
    }
}

// Cost of upgrade gets cheaper as gang increases in respect + power
Gang.prototype.getDiscount = function() {
    const power = this.getPower();
    const respect = this.respect;

    const respectLinearFac = 5e6;
    const powerLinearFac = 1e6;
    const discount = Math.pow(respect, 0.01) + respect / respectLinearFac + Math.pow(power, 0.01) + power / powerLinearFac - 1;
    return Math.max(1, discount);
}

// Returns only valid tasks for this gang. Excludes 'Unassigned'
Gang.prototype.getAllTaskNames = function() {
    let tasks = [];
    const allTasks = Object.keys(GangMemberTasks);
    if (this.isHackingGang) {
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
    return tasks;
}

Gang.prototype.getAllUpgradeNames = function() {
    return Object.keys(GangMemberUpgrades);
}

Gang.prototype.getUpgradeCost = function(upgName) {
    if (GangMemberUpgrades[upgName] == null) { return Infinity; }
    return GangMemberUpgrades[upgName].getCost(this);
}

// Returns a player-friendly string stating the type of the specified upgrade
Gang.prototype.getUpgradeType = function(upgName) {
    const upg = GangMemberUpgrades[upgName];
    if (upg == null) { return ""; }

    switch (upg.type) {
        case "w":
            return "Weapon";
        case "a":
            return "Armor";
        case "v":
            return "Vehicle";
        case "r":
            return "Rootkit";
        case "g":
            return "Augmentation";
        default:
            return "";
    }
}

Gang.prototype.toJSON = function() {
	return Generic_toJSON("Gang", this);
}

Gang.fromJSON = function(value) {
	return Generic_fromJSON(Gang, value.data);
}

Reviver.constructors.Gang = Gang;

function GangMember(name) {
    this.name   = name;
    this.task   = "Unassigned";

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

    this.upgrades = [];         // Names of upgrades
    this.augmentations = [];    // Names of augmentations only
}

// Same skill calculation formula as Player
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
    return (this.hack + this.str + this.def + this.dex + this.agi + this.cha) / 95;
}

GangMember.prototype.assignToTask = function(taskName) {
    if (GangMemberTasks.hasOwnProperty(taskName)) {
        this.task = taskName;
        return true;
    } else {
        this.task = "Unassigned";
        return false;
    }
}

GangMember.prototype.unassignFromTask = function() {
    this.task = "Unassigned";
}

GangMember.prototype.getTask = function() {
    // Backwards compatibility
    if (this.task instanceof GangMemberTask) {
        this.task = this.task.name;
    }

    if (GangMemberTasks.hasOwnProperty(this.task)) {
        return GangMemberTasks[this.task];
    }
    return GangMemberTasks["Unassigned"];
}

// Gains are per cycle
GangMember.prototype.calculateRespectGain = function(gang) {
    const task = this.getTask();
    if (task == null || !(task instanceof GangMemberTask) || task.baseRespect === 0) {return 0;}
    var statWeight =    (task.hackWeight/100) * this.hack +
                        (task.strWeight/100) * this.str +
                        (task.defWeight/100) * this.def +
                        (task.dexWeight/100) * this.dex +
                        (task.agiWeight/100) * this.agi +
                        (task.chaWeight/100) * this.cha;
    statWeight -= (4 * task.difficulty);
    if (statWeight <= 0) { return 0; }
    const territoryMult = Math.pow(AllGangs[gang.facName].territory * 100, task.territory.respect) / 100;
    if (isNaN(territoryMult) || territoryMult <= 0) { return 0; }
    var respectMult = gang.getWantedPenalty();
    return 11 * task.baseRespect * statWeight * territoryMult * respectMult;
}

GangMember.prototype.calculateWantedLevelGain = function(gang) {
    const task = this.getTask();
    if (task == null || !(task instanceof GangMemberTask) || task.baseWanted === 0) { return 0; }
    let statWeight = (task.hackWeight / 100) * this.hack +
                     (task.strWeight / 100) * this.str +
                     (task.defWeight / 100) * this.def +
                     (task.dexWeight / 100) * this.dex +
                     (task.agiWeight / 100) * this.agi +
                     (task.chaWeight / 100) * this.cha;
    statWeight -= (3.5 * task.difficulty);
    if (statWeight <= 0) { return 0; }
    const territoryMult = Math.pow(AllGangs[gang.facName].territory * 100, task.territory.wanted) / 100;
    if (isNaN(territoryMult) || territoryMult <= 0) { return 0; }
    if (task.baseWanted < 0) {
        return 0.4 * task.baseWanted * statWeight * territoryMult;
    } else {
        const calc = 7 * task.baseWanted / (Math.pow(3 * statWeight * territoryMult, 0.8));

        // Put an arbitrary cap on this to prevent wanted level from rising too fast if the
        // denominator is very small. Might want to rethink formula later
        return Math.min(100, calc);
    }
}

GangMember.prototype.calculateMoneyGain = function(gang) {
    const task = this.getTask();
    if (task == null || !(task instanceof GangMemberTask) || task.baseMoney === 0) {return 0;}
    var statWeight =    (task.hackWeight/100) * this.hack +
                        (task.strWeight/100) * this.str +
                        (task.defWeight/100) * this.def +
                        (task.dexWeight/100) * this.dex +
                        (task.agiWeight/100) * this.agi +
                        (task.chaWeight/100) * this.cha;
    statWeight -= (3.2 * task.difficulty);
    if (statWeight <= 0) { return 0; }
    const territoryMult = Math.pow(AllGangs[gang.facName].territory * 100, task.territory.money) / 100;
    if (isNaN(territoryMult) || territoryMult <= 0) { return 0; }
    var respectMult = gang.getWantedPenalty();
    return 5 * task.baseMoney * statWeight * territoryMult * respectMult;
}

GangMember.prototype.gainExperience = function(numCycles=1) {
    const task = this.getTask();
    if (task == null || !(task instanceof GangMemberTask) || task === GangMemberTasks["Unassigned"]) {return;}
    const difficultyMult = Math.pow(task.difficulty, 0.9);
    const difficultyPerCycles = difficultyMult * numCycles;
    const weightDivisor = 1500;
    this.hack_exp   += (task.hackWeight / weightDivisor) * difficultyPerCycles;
    this.str_exp    += (task.strWeight / weightDivisor) * difficultyPerCycles;
    this.def_exp    += (task.defWeight / weightDivisor) * difficultyPerCycles;
    this.dex_exp    += (task.dexWeight / weightDivisor) * difficultyPerCycles;
    this.agi_exp    += (task.agiWeight / weightDivisor) * difficultyPerCycles;
    this.cha_exp    += (task.chaWeight / weightDivisor) * difficultyPerCycles;
}

GangMember.prototype.recordEarnedRespect = function(numCycles=1, gang) {
    this.earnedRespect += (this.calculateRespectGain(gang) * numCycles);
}

GangMember.prototype.ascend = function() {
    const res = this.getAscensionResults();
    const hackAscMult = res.hack;
    const strAscMult =  res.str;
    const defAscMult =  res.def;
    const dexAscMult =  res.dex;
    const agiAscMult =  res.agi;
    const chaAscMult =  res.cha;
    this.hack_asc_mult += hackAscMult;
    this.str_asc_mult += strAscMult;
    this.def_asc_mult += defAscMult;
    this.dex_asc_mult += dexAscMult;
    this.agi_asc_mult += agiAscMult;
    this.cha_asc_mult += chaAscMult;

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

    // Clear exp and recalculate stats
    this.hack_exp = 0;
    this.str_exp = 0;
    this.def_exp = 0;
    this.dex_exp = 0;
    this.agi_exp = 0;
    this.cha_exp = 0;
    this.updateSkillLevels();

    const respectToDeduct = this.earnedRespect;
    this.earnedRespect = 0;
    return {
        respect: respectToDeduct,
        hack: hackAscMult,
        str: strAscMult,
        def: defAscMult,
        dex: dexAscMult,
        agi: agiAscMult,
        cha: chaAscMult,
    };
}

GangMember.prototype.getAscensionEfficiency = function() {
    function formula(mult) {
        return 1/(1+Math.log(mult)/Math.log(20));
    }
    return {
        hack: formula(this.hack_asc_mult),
        str: formula(this.str_asc_mult),
        def: formula(this.def_asc_mult),
        dex: formula(this.dex_asc_mult),
        agi: formula(this.agi_asc_mult),
        cha: formula(this.cha_asc_mult),
    };
}

// Returns the multipliers that would be gained from ascension
GangMember.prototype.getAscensionResults = function() {
    /**
     * Calculate ascension bonus to stat multipliers.
     * This is based on the current number of multipliers from Non-Augmentation upgrades
     * + Ascension Bonus = N% of current bonus from Augmentations
     */
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

    // Subtract 1 because we're only interested in the actual "bonus" part
    const eff = this.getAscensionEfficiency();
    return {
        hack: (Math.max(0, hack - 1) * GangConstants.AscensionMultiplierRatio * eff.hack),
        str:  (Math.max(0, str - 1) * GangConstants.AscensionMultiplierRatio * eff.str),
        def:  (Math.max(0, def - 1) * GangConstants.AscensionMultiplierRatio * eff.def),
        dex:  (Math.max(0, dex - 1) * GangConstants.AscensionMultiplierRatio * eff.dex),
        agi:  (Math.max(0, agi - 1) * GangConstants.AscensionMultiplierRatio * eff.agi),
        cha:  (Math.max(0, cha - 1) * GangConstants.AscensionMultiplierRatio * eff.cha),
    }
}

GangMember.prototype.buyUpgrade = function(upg, player, gang) {
    if (typeof upg === 'string') {
        upg = GangMemberUpgrades[upg];
    }
    if (!(upg instanceof GangMemberUpgrade)) {
        return false;
    }
    // Prevent purchasing of already-owned upgrades
    if (this.augmentations.includes(upg.name) || this.upgrades.includes(upg.name)) {
        return false;
    }

    if (player.money.lt(upg.getCost(gang))) { return false; }
    player.loseMoney(upg.getCost(gang));
    if (upg.type === "g") {
        this.augmentations.push(upg.name);
    } else {
        this.upgrades.push(upg.name);
    }
    upg.apply(this);
    return true;
}

GangMember.prototype.toJSON = function() {
	return Generic_toJSON("GangMember", this);
}

GangMember.fromJSON = function(value) {
	return Generic_fromJSON(GangMember, value.data);
}

Reviver.constructors.GangMember = GangMember;

// Gang UI Dom Elements
const UIElems = {
    // Main elems
    gangContentCreated:     false,
    gangContainer:          null,
    managementButton:       null,
    territoryButton:        null,

    // Subpages
    gangManagementSubpage:  null,
    gangTerritorySubpage:   null,

    // Gang Management Subpage Elements
    gangMemberFilter:           null,
    gangMemberPanels:           {},
}

export function unmount() {
    for(const name of Object.keys(UIElems.gangMemberPanels)) {
        if(!UIElems.gangMemberPanels[name]) continue;
        ReactDOM.unmountComponentAtNode(UIElems.gangMemberPanels[name]);
    }
}

Gang.prototype.displayGangContent = function(player) {
    if (!UIElems.gangContentCreated || UIElems.gangContainer == null) {
        UIElems.gangContentCreated = true;

        // Create gang container
        UIElems.gangContainer = createElement("div", {
            id:"gang-container", class:"generic-menupage-container",
        });

        // Get variables
        var facName = this.facName;

        // Back button
        UIElems.gangContainer.appendChild(createElement("a", {
            class:"a-link-button", display:"inline-block", innerText:"Back",
            clickListener:() => {
                Engine.loadFactionContent();
                displayFactionContent(facName);
                return false;
            },
        }));

        // Buttons to switch between panels
        UIElems.managementButton = createElement("a", {
            id:"gang-management-subpage-button", class:"a-link-button-inactive",
            display:"inline-block", innerHTML: "Gang Management (Alt+1)",
            clickListener:() => {
                UIElems.gangManagementSubpage.style.display = "block";
                UIElems.gangTerritorySubpage.style.display = "none";
                UIElems.managementButton.classList.toggle("a-link-button-inactive");
                UIElems.managementButton.classList.toggle("a-link-button");
                UIElems.territoryButton.classList.toggle("a-link-button-inactive");
                UIElems.territoryButton.classList.toggle("a-link-button");
                return false;
            },
        })
        UIElems.territoryButton = createElement("a", {
            id:"gang-territory-subpage-button", class:"a-link-button",
            display:"inline-block", innerHTML:"Gang Territory (Alt+2)",
            clickListener:() => {
                UIElems.gangManagementSubpage.style.display = "none";
                UIElems.gangTerritorySubpage.style.display = "block";
                UIElems.managementButton.classList.toggle("a-link-button-inactive");
                UIElems.managementButton.classList.toggle("a-link-button");
                UIElems.territoryButton.classList.toggle("a-link-button-inactive");
                UIElems.territoryButton.classList.toggle("a-link-button");
                return false;
            },
        });
        UIElems.gangContainer.appendChild(UIElems.managementButton);
        UIElems.gangContainer.appendChild(UIElems.territoryButton);

        // Subpage for managing gang members
        UIElems.gangManagementSubpage = createElement("div");
        UIElems.gangContainer.appendChild(UIElems.gangManagementSubpage);
        ReactDOM.render(<ManagementSubpage gang={this} player={player} />, UIElems.gangManagementSubpage);

        // Subpage for seeing gang territory information
        UIElems.gangTerritorySubpage = createElement("div", {
            id:"gang-territory-subpage", display:"none",
        });

        ReactDOM.render(<TerritorySubpage gang={this} player={player} />, UIElems.gangTerritorySubpage);

        UIElems.gangContainer.appendChild(UIElems.gangTerritorySubpage);

        document.getElementById("entire-game-container").appendChild(UIElems.gangContainer);
    }
    UIElems.gangContainer.style.display = "block";
}

Gang.prototype.clearUI = function() {
    if (UIElems.gangContainer instanceof Element) { removeElement(UIElems.gangContainer); }

    for (const prop in UIElems) {
        UIElems[prop] = null;
    }

    UIElems.gangContentCreated = false;
    UIElems.gangMemberPanels = {};
}
