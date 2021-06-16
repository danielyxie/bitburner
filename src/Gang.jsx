/**
 * TODO
 * Add police clashes
 * balance point to keep them from running out of control
*/

import { Engine } from "./engine";
import { Faction } from "./Faction/Faction";
import { Factions } from "./Faction/Factions";

import { numeralWrapper } from "./ui/numeralFormat";

import { dialogBoxCreate } from "../utils/DialogBox";
import {
    Reviver,
    Generic_toJSON,
    Generic_fromJSON,
} from "../utils/JSONReviver";

import { exceptionAlert } from "../utils/helpers/exceptionAlert";
import { getRandomInt } from "../utils/helpers/getRandomInt";

import { createElement } from "../utils/uiHelpers/createElement";
import { removeElement } from "../utils/uiHelpers/removeElement";

import { GangMemberUpgrade } from "./Gang/GangMemberUpgrade";
import { GangMemberUpgrades } from "./Gang/GangMemberUpgrades";
import { GangConstants } from "./Gang/data/Constants";
import { GangMemberTasks } from "./Gang/GangMemberTasks";
import { GangMemberTask } from "./Gang/GangMemberTask";

import { AllGangs } from "./Gang/AllGangs";
import { Root } from "./Gang/ui/Root";
import { GangMember } from "./Gang/GangMember";

import React from "react";
import ReactDOM from "react-dom";

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
    for (let i = 0; i < GangConstants.Names.length; ++i) {
        const others = GangConstants.Names.filter((e) => {
            return e !== GangConstants.Names[i];
        });
        const other = getRandomInt(0, others.length - 1);

        const thisGang = GangConstants.Names[i];
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

function calculateTerritoryGain(winGang, loseGang) {
    const powerBonus = Math.max(1, 1+Math.log(AllGangs[winGang].power/AllGangs[loseGang].power)/Math.log(50));
    const gains = Math.min(AllGangs[loseGang].territory, powerBonus*0.0001*(Math.random()+.5))
    return gains;
}
// Gang UI Dom Elements
const UIElems = {
    gangContentCreated:     false,
    gangContainer:          null,
}

Gang.prototype.displayGangContent = function(player) {
    if (!UIElems.gangContentCreated || UIElems.gangContainer == null) {
        UIElems.gangContentCreated = true;

        // Create gang container
        UIElems.gangContainer = createElement("div", {
            id:"gang-container", class:"generic-menupage-container",
        });

        ReactDOM.render(<Root engine={Engine} gang={this} player={player} />, UIElems.gangContainer);

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
}
