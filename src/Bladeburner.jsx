import { Augmentations } from "./Augmentation/Augmentations";
import { AugmentationNames } from "./Augmentation/data/AugmentationNames";
import { BitNodeMultipliers } from "./BitNode/BitNodeMultipliers";
import { Engine } from "./engine";
import { Faction } from "./Faction/Faction";
import { Factions, factionExists } from "./Faction/Factions";
import { joinFaction, displayFactionContent } from "./Faction/FactionHelpers";
import { Player } from "./Player";
import { hackWorldDaemon, redPillFlag } from "./RedPill";
import { calculateHospitalizationCost } from "./Hospital/Hospital";

import { Page, routing } from "./ui/navigationTracking";
import { numeralWrapper } from "./ui/numeralFormat";

import { dialogBoxCreate } from "../utils/DialogBox";
import {
    Reviver,
    Generic_toJSON,
    Generic_fromJSON,
} from "../utils/JSONReviver";
import { setTimeoutRef } from "./utils/SetTimeoutRef";
import {
    formatNumber,
    convertTimeMsToTimeElapsedString,
} from "../utils/StringHelperFunctions";

import { Settings } from "./Settings/Settings";
import { City } from "./Bladeburner/City";
import { BladeburnerConstants } from "./Bladeburner/data/Constants";
import { Skill } from "./Bladeburner/Skill";
import { Skills } from "./Bladeburner/Skills";
import { Operation } from "./Bladeburner/Operation";
import { BlackOperation } from "./Bladeburner/BlackOperation";
import { BlackOperations } from "./Bladeburner/BlackOperations";
import { Contract } from "./Bladeburner/Contract";
import { GeneralActions } from "./Bladeburner/GeneralActions";
import { ActionTypes } from "./Bladeburner/data/ActionTypes";
import { ActionIdentifier } from "./Bladeburner/ActionIdentifier";

import { addOffset } from "../utils/helpers/addOffset";
import { clearObject } from "../utils/helpers/clearObject";
import { createProgressBarText } from "../utils/helpers/createProgressBarText";
import { exceptionAlert } from "../utils/helpers/exceptionAlert";
import { getRandomInt } from "../utils/helpers/getRandomInt";
import { getTimestamp } from "../utils/helpers/getTimestamp";
import { KEY } from "../utils/helpers/keyCodes";

import { removeChildrenFromElement } from "../utils/uiHelpers/removeChildrenFromElement";
import { appendLineBreaks } from "../utils/uiHelpers/appendLineBreaks";
import { createElement } from "../utils/uiHelpers/createElement";
import { createPopup } from "../utils/uiHelpers/createPopup";
import { removeElement } from "../utils/uiHelpers/removeElement";
import { removeElementById } from "../utils/uiHelpers/removeElementById";

import { Stats } from "./Bladeburner/ui/Stats";
import { AllPages } from "./Bladeburner/ui/AllPages";
import { Console } from "./Bladeburner/ui/Console";
import { Root } from "./Bladeburner/ui/Root";

import { StatsTable } from "./ui/React/StatsTable";
import { CopyableText } from "./ui/React/CopyableText";
import { Money } from "./ui/React/Money";
import React from "react";
import ReactDOM from "react-dom";

import {
    getActionIdFromTypeAndName,
    executeStartConsoleCommand,
    executeSkillConsoleCommand,
    executeLogConsoleCommand,
    executeHelpConsoleCommand,
    executeAutomateConsoleCommand,
    parseCommandArguments,
    executeConsoleCommand,
    executeConsoleCommands,
    triggerMigration,
    triggerPotentialMigration,
    randomEvent,
    gainActionStats,
    getDiplomacyEffectiveness,
    getRecruitmentSuccessChance,
    getRecruitmentTime,
} from "./Bladeburner/Bladeburner";

function Bladeburner(params={}) {
    this.numHosp        = 0; // Number of hospitalizations
    this.moneyLost      = 0; // Money lost due to hospitalizations
    this.rank           = 0;
    this.maxRank        = 0; // Used to determine skill points

    this.skillPoints        = 0;
    this.totalSkillPoints   = 0;

    this.teamSize       = 0; // Number of team members
    this.teamLost       = 0; // Number of team members lost

    this.storedCycles   = 0;

    this.randomEventCounter = getRandomInt(240, 600); // 4-10 minutes

    // These times are in seconds
    this.actionTimeToComplete   = 0; // 0 or -1 is an infinite running action (like training)
    this.actionTimeCurrent      = 0;
    this.actionTimeOverflow     = 0;

    // ActionIdentifier Object
    var idleActionType = ActionTypes["Idle"];
    this.action = new ActionIdentifier({type:idleActionType});

    this.cities = {};
    for (var i = 0; i < BladeburnerConstants.CityNames.length; ++i) {
        this.cities[BladeburnerConstants.CityNames[i]] =  new City({name: BladeburnerConstants.CityNames[i]});
    }
    this.city = BladeburnerConstants.CityNames[2]; // Sector-12

    // Map of SkillNames -> level
    this.skills = {};
    this.skillMultipliers = {};
    this.updateSkillMultipliers(); // Calls resetSkillMultipliers()

    // Max Stamina is based on stats and Bladeburner-specific bonuses
    this.staminaBonus   = 0;    // Gained from training
    this.maxStamina     = 0;
    this.calculateMaxStamina();
    this.stamina        = this.maxStamina;

    /**
     * Contracts and Operations objects. These objects have unique
     * properties because they are randomized in each instance and have stats like
     * successes/failures, so they need to be saved/loaded by the game.
     */
    this.contracts = {};
    this.operations = {};

    // Object that contains name of all Black Operations that have been completed
    this.blackops = {};

    // Flags for whether these actions should be logged to console
    this.logging = {
        general:true,
        contracts:true,
        ops:true,
        blackops:true,
        events:true,
    }

    // Simple automation values
    this.automateEnabled = false;
    this.automateActionHigh = 0;
    this.automateThreshHigh = 0; //Stamina Threshold
    this.automateActionLow = 0;
    this.automateThreshLow = 0; //Stamina Threshold

    // Console command history
    this.consoleHistory = [];
    this.consoleLogs = [
        "Bladeburner Console",
        "Type 'help' to see console commands",
    ];

    // Initialization
    if (params.new) {this.create();}
}

Bladeburner.prototype.prestige = function() {
    this.resetAction();
    var bladeburnerFac = Factions["Bladeburners"];
    if (this.rank >= BladeburnerConstants.RankNeededForFaction) {
        joinFaction(bladeburnerFac);
    }
}

Bladeburner.prototype.create = function() {
    this.contracts["Tracking"] = new Contract({
        name:"Tracking",
        desc:"Identify and locate Synthoids. This contract involves reconnaissance " +
             "and information-gathering ONLY. Do NOT engage. Stealth is of the utmost importance.<br><br>" +
             "Successfully completing Tracking contracts will slightly improve your Synthoid population estimate for " +
             "whatever city you are currently in.",
        baseDifficulty:125,difficultyFac:1.02,rewardFac:1.041,
        rankGain:0.3, hpLoss:0.5,
        count:getRandomInt(25, 150), countGrowth:getRandomInt(5, 75)/10,
        weights:{hack:0,str:0.05,def:0.05,dex:0.35,agi:0.35,cha:0.1, int:0.05},
        decays:{hack:0,str:0.91,def:0.91,dex:0.91,agi:0.91,cha:0.9, int:1},
        isStealth:true,
    });
    this.contracts["Bounty Hunter"] = new Contract({
        name:"Bounty Hunter",
        desc:"Hunt down and capture fugitive Synthoids. These Synthoids are wanted alive.<br><br>" +
             "Successfully completing a Bounty Hunter contract will lower the population in your " +
             "current city, and will also increase its chaos level.",
        baseDifficulty:250, difficultyFac:1.04,rewardFac:1.085,
        rankGain:0.9, hpLoss:1,
        count:getRandomInt(5, 150), countGrowth:getRandomInt(5, 75)/10,
        weights:{hack:0,str:0.15,def:0.15,dex:0.25,agi:0.25,cha:0.1, int:0.1},
        decays:{hack:0,str:0.91,def:0.91,dex:0.91,agi:0.91,cha:0.8, int:0.9},
        isKill:true,
    });
    this.contracts["Retirement"] = new Contract({
        name:"Retirement",
        desc:"Hunt down and retire (kill) rogue Synthoids.<br><br>" +
             "Successfully completing a Retirement contract will lower the population in your current " +
             "city, and will also increase its chaos level.",
        baseDifficulty:200, difficultyFac:1.03, rewardFac:1.065,
        rankGain:0.6, hpLoss:1,
        count:getRandomInt(5, 150), countGrowth:getRandomInt(5, 75)/10,
        weights:{hack:0,str:0.2,def:0.2,dex:0.2,agi:0.2,cha:0.1, int:0.1},
        decays:{hack:0,str:0.91,def:0.91,dex:0.91,agi:0.91,cha:0.8, int:0.9},
        isKill:true,
    });

    this.operations["Investigation"] = new Operation({
        name:"Investigation",
        desc:"As a field agent, investigate and identify Synthoid " +
             "populations, movements, and operations.<br><br>Successful " +
             "Investigation ops will increase the accuracy of your " +
             "synthoid data.<br><br>" +
             "You will NOT lose HP from failed Investigation ops.",
        baseDifficulty:400, difficultyFac:1.03,rewardFac:1.07,reqdRank:25,
        rankGain:2.2, rankLoss:0.2,
        count:getRandomInt(1, 100), countGrowth:getRandomInt(10, 40)/10,
        weights:{hack:0.25,str:0.05,def:0.05,dex:0.2,agi:0.1,cha:0.25, int:0.1},
        decays:{hack:0.85,str:0.9,def:0.9,dex:0.9,agi:0.9,cha:0.7, int:0.9},
        isStealth:true,
    });
    this.operations["Undercover Operation"] = new Operation({
        name:"Undercover Operation",
        desc:"Conduct undercover operations to identify hidden " +
             "and underground Synthoid communities and organizations.<br><br>" +
             "Successful Undercover ops will increase the accuracy of your synthoid " +
             "data.",
        baseDifficulty:500, difficultyFac:1.04, rewardFac:1.09, reqdRank:100,
        rankGain:4.4, rankLoss:0.4, hpLoss:2,
        count:getRandomInt(1, 100), countGrowth:getRandomInt(10, 40)/10,
        weights:{hack:0.2,str:0.05,def:0.05,dex:0.2,agi:0.2,cha:0.2, int:0.1},
        decays:{hack:0.8,str:0.9,def:0.9,dex:0.9,agi:0.9,cha:0.7, int:0.9},
        isStealth:true,
    });
    this.operations["Sting Operation"] = new Operation({
        name:"Sting Operation",
        desc:"Conduct a sting operation to bait and capture particularly " +
             "notorious Synthoid criminals.",
        baseDifficulty:650, difficultyFac:1.04, rewardFac:1.095, reqdRank:500,
        rankGain:5.5, rankLoss:0.5, hpLoss:2.5,
        count:getRandomInt(1, 150), countGrowth:getRandomInt(3, 40)/10,
        weights:{hack:0.25,str:0.05,def:0.05,dex:0.25,agi:0.1,cha:0.2, int:0.1},
        decays:{hack:0.8,str:0.85,def:0.85,dex:0.85,agi:0.85,cha:0.7, int:0.9},
        isStealth:true,
    });
    this.operations["Raid"] = new Operation({
        name:"Raid",
        desc:"Lead an assault on a known Synthoid community. Note that " +
             "there must be an existing Synthoid community in your current city " +
             "in order for this Operation to be successful.",
        baseDifficulty:800, difficultyFac:1.045, rewardFac:1.1, reqdRank:3000,
        rankGain:55,rankLoss:2.5,hpLoss:50,
        count:getRandomInt(1, 150), countGrowth:getRandomInt(2, 40)/10,
        weights:{hack:0.1,str:0.2,def:0.2,dex:0.2,agi:0.2,cha:0, int:0.1},
        decays:{hack:0.7,str:0.8,def:0.8,dex:0.8,agi:0.8,cha:0, int:0.9},
        isKill:true,
    });
    this.operations["Stealth Retirement Operation"] = new Operation({
        name:"Stealth Retirement Operation",
        desc:"Lead a covert operation to retire Synthoids. The " +
             "objective is to complete the task without " +
             "drawing any attention. Stealth and discretion are key.",
        baseDifficulty:1000, difficultyFac:1.05, rewardFac:1.11, reqdRank:20e3,
        rankGain:22, rankLoss:2, hpLoss:10,
        count:getRandomInt(1, 150), countGrowth:getRandomInt(1, 20)/10,
        weights:{hack:0.1,str:0.1,def:0.1,dex:0.3,agi:0.3,cha:0, int:0.1},
        decays:{hack:0.7,str:0.8,def:0.8,dex:0.8,agi:0.8,cha:0, int:0.9},
        isStealth:true, isKill:true,
    });
    this.operations["Assassination"] = new Operation({
        name:"Assassination",
        desc:"Assassinate Synthoids that have been identified as " +
             "important, high-profile social and political leaders " +
             "in the Synthoid communities.",
        baseDifficulty:1500, difficultyFac:1.06, rewardFac:1.14, reqdRank:50e3,
        rankGain:44, rankLoss:4, hpLoss:5,
        count:getRandomInt(1, 150), countGrowth:getRandomInt(1, 20)/10,
        weights:{hack:0.1,str:0.1,def:0.1,dex:0.3,agi:0.3,cha:0, int:0.1},
        decays:{hack:0.6,str:0.8,def:0.8,dex:0.8,agi:0.8,cha:0, int:0.8},
        isStealth:true, isKill:true,
    });
}

Bladeburner.prototype.storeCycles = function(numCycles=1) {
    this.storedCycles += numCycles;
}


Bladeburner.prototype.process = function() {
    // Edge case condition...if Operation Daedalus is complete trigger the BitNode
    if (redPillFlag === false && this.blackops.hasOwnProperty("Operation Daedalus")) {
        return hackWorldDaemon(Player.bitNodeN);
    }

    // If the Player starts doing some other actions, set action to idle and alert
    if (Augmentations[AugmentationNames.BladesSimulacrum].owned === false && Player.isWorking) {
        if (this.action.type !== ActionTypes["Idle"]) {
            let msg = "Your Bladeburner action was cancelled because you started doing something else.";
            if (this.automateEnabled) {
                msg += `<br><br>Your automation was disabled as well. You will have to re-enable it through the Bladeburner console`
                this.automateEnabled = false;
            }
            if (!Settings.SuppressBladeburnerPopup) {
                dialogBoxCreate(msg);
            }
        }
        this.resetAction();
    }

    // If the Player has no Stamina, set action to idle
    if (this.stamina <= 0) {
        this.log("Your Bladeburner action was cancelled because your stamina hit 0");
        this.resetAction();
    }

    // A 'tick' for this mechanic is one second (= 5 game cycles)
    if (this.storedCycles >= BladeburnerConstants.CyclesPerSecond) {
        var seconds = Math.floor(this.storedCycles / BladeburnerConstants.CyclesPerSecond);
        seconds = Math.min(seconds, 5); // Max of 5 'ticks'
        this.storedCycles -= seconds * BladeburnerConstants.CyclesPerSecond;

        // Stamina
        this.calculateMaxStamina();
        this.stamina += (this.calculateStaminaGainPerSecond() * seconds);
        this.stamina = Math.min(this.maxStamina, this.stamina);

        // Count increase for contracts/operations
        for (let contract of Object.values(this.contracts)) {
            contract.count += (seconds * contract.countGrowth/BladeburnerConstants.ActionCountGrowthPeriod);
        }
        for (let op of Object.values(this.operations)) {
            op.count += (seconds * op.countGrowth/BladeburnerConstants.ActionCountGrowthPeriod);
        }

        // Chaos goes down very slowly
        for (let cityName of BladeburnerConstants.CityNames) {
            var city = this.cities[cityName];
            if (!(city instanceof City)) {throw new Error("Invalid City object when processing passive chaos reduction in Bladeburner.process");}
            city.chaos -= (0.0001 * seconds);
            city.chaos = Math.max(0, city.chaos);
        }

        // Random Events
        this.randomEventCounter -= seconds;
        if (this.randomEventCounter <= 0) {
            randomEvent(this);
            // Add instead of setting because we might have gone over the required time for the event
            this.randomEventCounter += getRandomInt(240, 600);
        }

        this.processAction(seconds);

        // Automation
        if (this.automateEnabled) {
            // Note: Do NOT set this.action = this.automateActionHigh/Low since it creates a reference
            if (this.stamina <= this.automateThreshLow) {
                if (this.action.name !== this.automateActionLow.name || this.action.type !== this.automateActionLow.type) {
                    this.action = new ActionIdentifier({type: this.automateActionLow.type, name: this.automateActionLow.name});
                    this.startAction(this.action);
                }
            } else if (this.stamina >= this.automateThreshHigh) {
                if (this.action.name !== this.automateActionHigh.name || this.action.type !== this.automateActionHigh.type) {
                    this.action = new ActionIdentifier({type: this.automateActionHigh.type, name: this.automateActionHigh.name});
                    this.startAction(this.action);
                }
            }
        }

    }
}

Bladeburner.prototype.calculateMaxStamina = function() {
    const effAgility = Player.agility * this.skillMultipliers.effAgi;
    let maxStamina = (Math.pow(effAgility, 0.8) + this.staminaBonus) *
      this.skillMultipliers.stamina *
      Player.bladeburner_max_stamina_mult;
    if (this.maxStamina !== maxStamina) {
      const oldMax = this.maxStamina;
      this.maxStamina = maxStamina;
      this.stamina = this.maxStamina * this.stamina / oldMax;
    }
    if (isNaN(maxStamina)) {throw new Error("Max Stamina calculated to be NaN in Bladeburner.calculateMaxStamina()");}
}

Bladeburner.prototype.calculateStaminaGainPerSecond = function() {
    var effAgility = Player.agility * this.skillMultipliers.effAgi;
    var maxStaminaBonus = this.maxStamina / BladeburnerConstants.MaxStaminaToGainFactor;
    var gain = (BladeburnerConstants.StaminaGainPerSecond + maxStaminaBonus) * Math.pow(effAgility, 0.17);
    return gain * (this.skillMultipliers.stamina * Player.bladeburner_stamina_gain_mult);
}

Bladeburner.prototype.calculateStaminaPenalty = function() {
    return Math.min(1, this.stamina / (0.5 * this.maxStamina));
}

Bladeburner.prototype.changeRank = function(change) {
    if (isNaN(change)) {throw new Error("NaN passed into Bladeburner.changeRank()");}
    this.rank += change;
    if (this.rank < 0) {this.rank = 0;}
    this.maxRank = Math.max(this.rank, this.maxRank);

    var bladeburnersFactionName = "Bladeburners";
    if (factionExists(bladeburnersFactionName)) {
        var bladeburnerFac = Factions[bladeburnersFactionName];
        if (!(bladeburnerFac instanceof Faction)) {
            throw new Error("Could not properly get Bladeburner Faction object in Bladeburner UI Overview Faction button");
        }
        if (bladeburnerFac.isMember) {
            var favorBonus = 1 + (bladeburnerFac.favor / 100);
            bladeburnerFac.playerReputation += (BladeburnerConstants.RankToFactionRepFactor * change * Player.faction_rep_mult * favorBonus);
        }
    }

    // Gain skill points
    var rankNeededForSp = (this.totalSkillPoints+1) * BladeburnerConstants.RanksPerSkillPoint;
    if (this.maxRank >= rankNeededForSp) {
        // Calculate how many skill points to gain
        var gainedSkillPoints = Math.floor((this.maxRank - rankNeededForSp) / BladeburnerConstants.RanksPerSkillPoint + 1);
        this.skillPoints += gainedSkillPoints;
        this.totalSkillPoints += gainedSkillPoints;
    }
}

Bladeburner.prototype.getCurrentCity = function() {
    var city = this.cities[this.city];
    if (!(city instanceof City)) {
        throw new Error("Bladeburner.getCurrentCity() did not properly return a City object");
    }
    return city;
}

Bladeburner.prototype.resetSkillMultipliers = function() {
    this.skillMultipliers = {
        successChanceAll: 1,
        successChanceStealth: 1,
        successChanceKill: 1,
        successChanceContract: 1,
        successChanceOperation: 1,
        successChanceEstimate: 1,
        actionTime: 1,
        effHack: 1,
        effStr: 1,
        effDef: 1,
        effDex: 1,
        effAgi: 1,
        effCha: 1,
        effInt: 1,
        stamina: 1,
        money: 1,
        expGain: 1,
    };
}

Bladeburner.prototype.updateSkillMultipliers = function() {
    this.resetSkillMultipliers();
    for (var skillName in this.skills) {
        if (this.skills.hasOwnProperty(skillName)) {
            var skill = Skills[skillName];
            if (skill == null) {
                throw new Error("Could not find Skill Object for: " + skillName);
            }
            var level = this.skills[skillName];
            if (level == null || level <= 0) {continue;} //Not upgraded

            var multiplierNames = Object.keys(this.skillMultipliers);
            for (var i = 0; i < multiplierNames.length; ++i) {
                var multiplierName = multiplierNames[i];
                if (skill[multiplierName] != null && !isNaN(skill[multiplierName])) {
                    var value = skill[multiplierName] * level;
                    var multiplierValue = 1 + (value / 100);
                    if (multiplierName === "actionTime") {
                        multiplierValue = 1 - (value / 100);
                    }
                    this.skillMultipliers[multiplierName] *= multiplierValue;
                }
            }
        }
    }
}

Bladeburner.prototype.upgradeSkill = function(skill) {
    // This does NOT handle deduction of skill points
    var skillName = skill.name;
    if (this.skills[skillName]) {
        ++this.skills[skillName];
    } else {
        this.skills[skillName] = 1;
    }
    if (isNaN(this.skills[skillName]) || this.skills[skillName] < 0) {
        throw new Error("Level of Skill " + skillName + " is invalid: " + this.skills[skillName]);
    }
    this.updateSkillMultipliers();
}

Bladeburner.prototype.getActionObject = function(actionId) {
    /**
     * Given an ActionIdentifier object, returns the corresponding
     * GeneralAction, Contract, Operation, or BlackOperation object
     */
    switch (actionId.type) {
        case ActionTypes["Contract"]:
            return this.contracts[actionId.name];
        case ActionTypes["Operation"]:
            return this.operations[actionId.name];
        case ActionTypes["BlackOp"]:
        case ActionTypes["BlackOperation"]:
            return BlackOperations[actionId.name];
        case ActionTypes["Training"]:
            return GeneralActions["Training"];
        case ActionTypes["Field Analysis"]:
            return GeneralActions["Field Analysis"];
        case ActionTypes["Recruitment"]:
            return GeneralActions["Recruitment"];
        case ActionTypes["Diplomacy"]:
            return GeneralActions["Diplomacy"];
        case ActionTypes["Hyperbolic Regeneration Chamber"]:
            return GeneralActions["Hyperbolic Regeneration Chamber"];
        default:
            return null;
    }
}

// Sets the player to the "IDLE" action
Bladeburner.prototype.resetAction = function() {
    this.action = new ActionIdentifier({type:ActionTypes.Idle});
}

Bladeburner.prototype.startAction = function(actionId) {
    if (actionId == null) {return;}
    this.action = actionId;
    this.actionTimeCurrent = 0;
    switch (actionId.type) {
        case ActionTypes["Idle"]:
            this.actionTimeToComplete = 0;
            break;
        case ActionTypes["Contract"]:
            try {
                var action = this.getActionObject(actionId);
                if (action == null) {
                    throw new Error("Failed to get Contract Object for: " + actionId.name);
                }
                if (action.count < 1) {return this.resetAction();}
                this.actionTimeToComplete = action.getActionTime(this);
            } catch(e) {
                exceptionAlert(e);
            }
            break;
        case ActionTypes["Operation"]:
            try {
                var action = this.getActionObject(actionId);
                if (action == null) {
                    throw new Error ("Failed to get Operation Object for: " + actionId.name);
                }
                if (action.count < 1) {return this.resetAction();}
                if (actionId.name === "Raid" && this.getCurrentCity().commsEst === 0) {return this.resetAction();}
                this.actionTimeToComplete = action.getActionTime(this);
            } catch(e) {
                exceptionAlert(e);
            }
            break;
        case ActionTypes["BlackOp"]:
        case ActionTypes["BlackOperation"]:
            try {
                // Safety measure - don't repeat BlackOps that are already done
                if (this.blackops[actionId.name] != null) {
                    this.resetAction();
                    this.log("Error: Tried to start a Black Operation that had already been completed");
                    break;
                }

                var action = this.getActionObject(actionId);
                if (action == null) {
                    throw new Error("Failed to get BlackOperation object for: " + actionId.name);
                }
                this.actionTimeToComplete = action.getActionTime(this);
            } catch(e) {
                exceptionAlert(e);
            }
            break;
        case ActionTypes["Recruitment"]:
            this.actionTimeToComplete = getRecruitmentTime(this, Player);
            break;
        case ActionTypes["Training"]:
        case ActionTypes["FieldAnalysis"]:
        case ActionTypes["Field Analysis"]:
            this.actionTimeToComplete = 30;
            break;
        case ActionTypes["Diplomacy"]:
        case ActionTypes["Hyperbolic Regeneration Chamber"]:
            this.actionTimeToComplete = 60;
            break;
        default:
            throw new Error("Invalid Action Type in Bladeburner.startAction(): " + actionId.type);
            break;
    }
}

Bladeburner.prototype.processAction = function(seconds) {
    if (this.action.type === ActionTypes["Idle"]) {return;}
    if (this.actionTimeToComplete <= 0) {
        throw new Error(`Invalid actionTimeToComplete value: ${this.actionTimeToComplete}, type; ${this.action.type}`);
    }
    if (!(this.action instanceof ActionIdentifier)) {
        throw new Error("Bladeburner.action is not an ActionIdentifier Object");
    }

    // If the previous action went past its completion time, add to the next action
    // This is not added inmediatly in case the automation changes the action
    this.actionTimeCurrent += seconds + this.actionTimeOverflow;
    this.actionTimeOverflow = 0;
    if (this.actionTimeCurrent >= this.actionTimeToComplete) {
        this.actionTimeOverflow = this.actionTimeCurrent - this.actionTimeToComplete;
        return this.completeAction();
    }
}

Bladeburner.prototype.completeAction = function() {
    switch (this.action.type) {
        case ActionTypes["Contract"]:
        case ActionTypes["Operation"]:
            try {
                var isOperation = (this.action.type === ActionTypes["Operation"]);
                var action = this.getActionObject(this.action);
                if (action == null) {
                    throw new Error("Failed to get Contract/Operation Object for: " + this.action.name);
                }
                var difficulty = action.getDifficulty();
                var difficultyMultiplier = Math.pow(difficulty, BladeburnerConstants.DiffMultExponentialFactor) + difficulty / BladeburnerConstants.DiffMultLinearFactor;
                var rewardMultiplier = Math.pow(action.rewardFac, action.level-1);

                // Stamina loss is based on difficulty
                this.stamina -= (BladeburnerConstants.BaseStaminaLoss * difficultyMultiplier);
                if (this.stamina < 0) {this.stamina = 0;}

                // Process Contract/Operation success/failure
                if (action.attempt(this)) {
                    gainActionStats(this, Player, action, true);
                    ++action.successes;
                    --action.count;

                    // Earn money for contracts
                    var moneyGain = 0;
                    if (!isOperation) {
                        moneyGain = BladeburnerConstants.ContractBaseMoneyGain * rewardMultiplier * this.skillMultipliers.money;
                        Player.gainMoney(moneyGain);
                        Player.recordMoneySource(moneyGain, "bladeburner");
                    }

                    if (isOperation) {
                        action.setMaxLevel(BladeburnerConstants.OperationSuccessesPerLevel);
                    } else {
                        action.setMaxLevel(BladeburnerConstants.ContractSuccessesPerLevel);
                    }
                    if (action.rankGain) {
                        var gain = addOffset(action.rankGain * rewardMultiplier * BitNodeMultipliers.BladeburnerRank, 10);
                        this.changeRank(gain);
                        if (isOperation && this.logging.ops) {
                            this.log(action.name + " successfully completed! Gained " + formatNumber(gain, 3) + " rank");
                        } else if (!isOperation && this.logging.contracts) {
                            this.log(action.name + " contract successfully completed! Gained " + formatNumber(gain, 3) + " rank and " + numeralWrapper.formatMoney(moneyGain));
                        }
                    }
                    isOperation ? this.completeOperation(true) : this.completeContract(true);
                } else {
                    gainActionStats(this, Player, action, false);
                    ++action.failures;
                    var loss = 0, damage = 0;
                    if (action.rankLoss) {
                        loss = addOffset(action.rankLoss * rewardMultiplier, 10);
                        this.changeRank(-1 * loss);
                    }
                    if (action.hpLoss) {
                        damage = action.hpLoss * difficultyMultiplier;
                        damage = Math.ceil(addOffset(damage, 10));
                        this.hpLost += damage;
                        const cost = calculateHospitalizationCost(Player, damage);
                        if (Player.takeDamage(damage)) {
                            ++this.numHosp;
                            this.moneyLost += cost;
                        }
                    }
                    var logLossText = "";
                    if (loss > 0)   {logLossText += "Lost " + formatNumber(loss, 3) + " rank. ";}
                    if (damage > 0) {logLossText += "Took " + formatNumber(damage, 0) + " damage.";}
                    if (isOperation && this.logging.ops) {
                        this.log(action.name + " failed! " + logLossText);
                    } else if (!isOperation && this.logging.contracts) {
                        this.log(action.name + " contract failed! " + logLossText);
                    }
                    isOperation ? this.completeOperation(false) : this.completeContract(false);
                }
                if (action.autoLevel) {action.level = action.maxLevel;} // Autolevel
                this.startAction(this.action); // Repeat action
            } catch(e) {
                exceptionAlert(e);
            }
            break;
        case ActionTypes["BlackOp"]:
        case ActionTypes["BlackOperation"]:
            try {
                var action = this.getActionObject(this.action);
                if (action == null || !(action instanceof BlackOperation)) {
                    throw new Error("Failed to get BlackOperation Object for: " + this.action.name);
                }
                var difficulty = action.getDifficulty();
                var difficultyMultiplier = Math.pow(difficulty, BladeburnerConstants.DiffMultExponentialFactor) + difficulty / BladeburnerConstants.DiffMultLinearFactor;

                // Stamina loss is based on difficulty
                this.stamina -= (BladeburnerConstants.BaseStaminaLoss * difficultyMultiplier);
                if (this.stamina < 0) {this.stamina = 0;}

                // Team loss variables
                var teamCount = action.teamCount, teamLossMax;

                if (action.attempt(this)) {
                    gainActionStats(this, Player, action, true);
                    action.count = 0;
                    this.blackops[action.name] = true;
                    var rankGain = 0;
                    if (action.rankGain) {
                        rankGain = addOffset(action.rankGain * BitNodeMultipliers.BladeburnerRank, 10);
                        this.changeRank(rankGain);
                    }
                    teamLossMax = Math.ceil(teamCount/2);

                    // Operation Daedalus
                    if (action.name === "Operation Daedalus") {
                        this.resetAction();
                        return hackWorldDaemon(Player.bitNodeN);
                    }

                    if (this.logging.blackops) {
                        this.log(action.name + " successful! Gained " + formatNumber(rankGain, 1) + " rank");
                    }
                } else {
                    gainActionStats(this, Player, action, false);
                    var rankLoss = 0, damage = 0;
                    if (action.rankLoss) {
                        rankLoss = addOffset(action.rankLoss, 10);
                        this.changeRank(-1 * rankLoss);
                    }
                    if (action.hpLoss) {
                        damage = action.hpLoss * difficultyMultiplier;
                        damage = Math.ceil(addOffset(damage, 10));
                        const cost = calculateHospitalizationCost(Player, damage);
                        if (Player.takeDamage(damage)) {
                            ++this.numHosp;
                            this.moneyLost += cost;
                        }
                    }
                    teamLossMax = Math.floor(teamCount);

                    if (this.logging.blackops) {
                        this.log(action.name + " failed! Lost " + formatNumber(rankLoss, 1) + " rank and took " + formatNumber(damage, 0) + " damage");
                    }
                }

                this.resetAction(); // Stop regardless of success or fail

                // Calculate team lossses
                if (teamCount >= 1) {
                    var losses = getRandomInt(1, teamLossMax);
                    this.teamSize -= losses;
                    this.teamLost += losses;
                    if (this.logging.blackops) {
                        this.log("You lost " + formatNumber(losses, 0) + " team members during " + action.name);
                    }
                }
            } catch(e) {
                exceptionAlert(e);
            }
            break;
        case ActionTypes["Training"]:
            this.stamina -= (0.5 * BladeburnerConstants.BaseStaminaLoss);
            var strExpGain = 30 * Player.strength_exp_mult,
                defExpGain = 30 * Player.defense_exp_mult,
                dexExpGain = 30 * Player.dexterity_exp_mult,
                agiExpGain = 30 * Player.agility_exp_mult,
                staminaGain = 0.04 * this.skillMultipliers.stamina;
            Player.gainStrengthExp(strExpGain);
            Player.gainDefenseExp(defExpGain);
            Player.gainDexterityExp(dexExpGain);
            Player.gainAgilityExp(agiExpGain);
            this.staminaBonus += (staminaGain);
            if (this.logging.general) {
                this.log("Training completed. Gained: " +
                         formatNumber(strExpGain, 1) + " str exp, " +
                         formatNumber(defExpGain, 1) + " def exp, " +
                         formatNumber(dexExpGain, 1) + " dex exp, " +
                         formatNumber(agiExpGain, 1) + " agi exp, " +
                         formatNumber(staminaGain, 3) + " max stamina");
            }
            this.startAction(this.action); // Repeat action
            break;
        case ActionTypes["FieldAnalysis"]:
        case ActionTypes["Field Analysis"]:
            // Does not use stamina. Effectiveness depends on hacking, int, and cha
            var eff = 0.04 * Math.pow(Player.hacking_skill, 0.3) +
                      0.04 * Math.pow(Player.intelligence, 0.9) +
                      0.02 * Math.pow(Player.charisma, 0.3);
            eff *= Player.bladeburner_analysis_mult;
            if (isNaN(eff) || eff < 0) {
                throw new Error("Field Analysis Effectiveness calculated to be NaN or negative");
            }
            var hackingExpGain  = 20 * Player.hacking_exp_mult,
                charismaExpGain = 20 * Player.charisma_exp_mult;
            Player.gainHackingExp(hackingExpGain);
            Player.gainIntelligenceExp(BladeburnerConstants.BaseIntGain);
            Player.gainCharismaExp(charismaExpGain);
            this.changeRank(0.1 * BitNodeMultipliers.BladeburnerRank);
            this.getCurrentCity().improvePopulationEstimateByPercentage(eff * this.skillMultipliers.successChanceEstimate);
            if (this.logging.general) {
                this.log("Field analysis completed. Gained 0.1 rank, " + formatNumber(hackingExpGain, 1) + " hacking exp, and " + formatNumber(charismaExpGain, 1) + " charisma exp");
            }
            this.startAction(this.action); // Repeat action
            break;
        case ActionTypes["Recruitment"]:
            var successChance = getRecruitmentSuccessChance(this, Player);
            if (Math.random() < successChance) {
                var expGain = 2 * BladeburnerConstants.BaseStatGain * this.actionTimeToComplete;
                Player.gainCharismaExp(expGain);
                ++this.teamSize;
                if (this.logging.general) {
                    this.log("Successfully recruited a team member! Gained " + formatNumber(expGain, 1) + " charisma exp");
                }
            } else {
                var expGain = BladeburnerConstants.BaseStatGain * this.actionTimeToComplete;
                Player.gainCharismaExp(expGain);
                if (this.logging.general) {
                    this.log("Failed to recruit a team member. Gained " + formatNumber(expGain, 1) + " charisma exp");
                }
            }
            this.startAction(this.action); // Repeat action
            break;
        case ActionTypes["Diplomacy"]:
            var eff = getDiplomacyEffectiveness(this, Player);
            this.getCurrentCity().chaos *= eff;
            if (this.getCurrentCity().chaos < 0) { this.getCurrentCity().chaos = 0; }
            if (this.logging.general) {
                this.log(`Diplomacy completed. Chaos levels in the current city fell by ${numeralWrapper.formatPercentage(1 - eff)}`);
            }
            this.startAction(this.action); // Repeat Action
            break;
        case ActionTypes["Hyperbolic Regeneration Chamber"]: {
            Player.regenerateHp(BladeburnerConstants.HrcHpGain);

            const staminaGain = this.maxStamina * (BladeburnerConstants.HrcStaminaGain / 100);
            this.stamina = Math.min(this.maxStamina, this.stamina + staminaGain);
            this.startAction(this.action);
            if (this.logging.general) {
                this.log(`Rested in Hyperbolic Regeneration Chamber. Restored ${BladeburnerConstants.HrcHpGain} HP and gained ${numeralWrapper.formatStamina(staminaGain)} stamina`);
            }
            break;
        }
        default:
            console.error(`Bladeburner.completeAction() called for invalid action: ${this.action.type}`);
            break;
    }
}

Bladeburner.prototype.completeContract = function(success) {
    if (this.action.type !== ActionTypes.Contract) {
        throw new Error("completeContract() called even though current action is not a Contract");
    }
    var city = this.getCurrentCity();
    if (success) {
        switch (this.action.name) {
            case "Tracking":
                // Increase estimate accuracy by a relatively small amount
                city.improvePopulationEstimateByCount(getRandomInt(100, 1e3));
                break;
            case "Bounty Hunter":
                city.changePopulationByCount(-1, {estChange:-1});
                city.changeChaosByCount(0.02);
                break;
            case "Retirement":
                city.changePopulationByCount(-1, {estChange:-1});
                city.changeChaosByCount(0.04);
                break;
            default:
                throw new Error("Invalid Action name in completeContract: " + this.action.name);
        }
    }
}

Bladeburner.prototype.completeOperation = function(success) {
    if (this.action.type !== ActionTypes.Operation) {
        throw new Error("completeOperation() called even though current action is not an Operation");
    }
    var action = this.getActionObject(this.action);
    if (action == null) {
        throw new Error("Failed to get Contract/Operation Object for: " + this.action.name);
    }

    // Calculate team losses
    var teamCount = action.teamCount, max;
    if (teamCount >= 1) {
        if (success) {
            max = Math.ceil(teamCount/2);
        } else {
            max = Math.floor(teamCount)
        }
        var losses = getRandomInt(0, max);
        this.teamSize -= losses;
        this.teamLost += losses;
        if (this.logging.ops && losses > 0) {
            this.log("Lost " + formatNumber(losses, 0) + " team members during this " + action.name);
        }
    }

    var city = this.getCurrentCity();
    switch (action.name) {
        case "Investigation":
            if (success) {
                city.improvePopulationEstimateByPercentage(0.4 * this.skillMultipliers.successChanceEstimate);
                if (Math.random() < (0.02 * this.skillMultipliers.successChanceEstimate)) {
                    city.improveCommunityEstimate(1);
                }
            } else {
                triggerPotentialMigration(this, this.city, 0.1);
            }
            break;
        case "Undercover Operation":
            if (success) {
                city.improvePopulationEstimateByPercentage(0.8 * this.skillMultipliers.successChanceEstimate);
                if (Math.random() < (0.02 * this.skillMultipliers.successChanceEstimate)) {
                    city.improveCommunityEstimate(1);
                }
            } else {
                triggerPotentialMigration(this, this.city, 0.15);
            }
            break;
        case "Sting Operation":
            if (success) {
                city.changePopulationByPercentage(-0.1, {changeEstEqually:true, nonZero:true});
            }
            city.changeChaosByCount(0.1);
            break;
        case "Raid":
            if (success) {
                city.changePopulationByPercentage(-1, {changeEstEqually:true, nonZero:true});
                --city.comms;
                --city.commsEst;
            } else {
                var change = getRandomInt(-10, -5) / 10;
                city.changePopulationByPercentage(change, {nonZero:true});
            }
            city.changeChaosByPercentage(getRandomInt(1, 5));
            break;
        case "Stealth Retirement Operation":
            if (success) {
                city.changePopulationByPercentage(-0.5, {changeEstEqually:true,nonZero:true});
            }
            city.changeChaosByPercentage(getRandomInt(-3, -1));
            break;
        case "Assassination":
            if (success) {
                city.changePopulationByCount(-1, {estChange:-1});
            }
            city.changeChaosByPercentage(getRandomInt(-5, 5));
            break;
        default:
            throw new Error("Invalid Action name in completeOperation: " + this.action.name);
    }
}


////////////////////////////////////////////////////////////////////////////////
/////////////////////////////Unconvertable for now//////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// Bladeburner Console Window
Bladeburner.prototype.postToConsole = function(input, saveToLogs=true) {
    const MaxConsoleEntries = 100;
    if (saveToLogs) {
        this.consoleLogs.push(input);
        if (this.consoleLogs.length > MaxConsoleEntries) {
            this.consoleLogs.shift();
        }
    }
}

Bladeburner.prototype.log = function(input) {
    // Adds a timestamp and then just calls postToConsole
    this.postToConsole(`[${getTimestamp()}] ${input}`);
}

// Handles a potential series of commands (comm1; comm2; comm3;)
Bladeburner.prototype.executeConsoleCommands = function(commands) {
    executeConsoleCommands(this, commands);
}

////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////Netscript Fns//////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

Bladeburner.prototype.getTypeAndNameFromActionId = function(actionId) {
    var res = {};
    let types = Object.keys(ActionTypes);
    for (let i = 0; i < types.length; ++i) {
        if (actionId.type === ActionTypes[types[i]]) {
            res.type = types[i];
            break;
        }
    }
    if (res.type == null) {res.type = "Idle";}

    res.name = actionId.name != null ? actionId.name : "Idle";
    return res;
}

Bladeburner.prototype.getContractNamesNetscriptFn = function() {
    return Object.keys(this.contracts);
}

Bladeburner.prototype.getOperationNamesNetscriptFn = function() {
    return Object.keys(this.operations);
}

Bladeburner.prototype.getBlackOpNamesNetscriptFn = function() {
    return Object.keys(BlackOperations);
}

Bladeburner.prototype.getGeneralActionNamesNetscriptFn = function() {
    return Object.keys(GeneralActions);
}

Bladeburner.prototype.getSkillNamesNetscriptFn = function() {
    return Object.keys(Skills);
}

Bladeburner.prototype.startActionNetscriptFn = function(type, name, workerScript) {
  const errorLogText = `Invalid action: type='${type}' name='${name}'`;
    const actionId = getActionIdFromTypeAndName(this, type, name);
    if (actionId == null) {
        workerScript.log("bladeburner.startAction", errorLogText);
        return false;
    }

    // Special logic for Black Ops
    if (actionId.type === ActionTypes["BlackOp"]) {
        // Can't start a BlackOp if you don't have the required rank
        let action = this.getActionObject(actionId);
        if (action.reqdRank > this.rank) {
            workerScript.log("bladeburner.startAction", `Insufficient rank to start Black Op '${actionId.name}'.`);
            return false;
        }

        // Can't start a BlackOp if its already been done
        if (this.blackops[actionId.name] != null) {
            workerScript.log("bladeburner.startAction", `Black Op ${actionId.name} has already been completed.`);
            return false;
        }

        // Can't start a BlackOp if you haven't done the one before it
        var blackops = [];
        for (const nm in BlackOperations) {
            if (BlackOperations.hasOwnProperty(nm)) {
                blackops.push(nm);
            }
        }
        blackops.sort(function(a, b) {
            return (BlackOperations[a].reqdRank - BlackOperations[b].reqdRank); // Sort black ops in intended order
        });

        let i = blackops.indexOf(actionId.name);
        if (i === -1) {
            workerScript.log("bladeburner.startAction", `Invalid Black Op: '${name}'`);
            return false;
        }

        if (i > 0 && this.blackops[blackops[i-1]] == null) {
            workerScript.log("bladeburner.startAction", `Preceding Black Op must be completed before starting '${actionId.name}'.`);
            return false;
        }
    }

    try {
        this.startAction(actionId);
        workerScript.log("bladeburner.startAction", `Starting bladeburner action with type '${type}' and name ${name}"`);
        return true;
    } catch(e) {
        this.resetAction();
        workerScript.log("bladeburner.startAction", errorLogText);
        return false;
    }
}

Bladeburner.prototype.getActionTimeNetscriptFn = function(type, name, workerScript) {
  const errorLogText = `Invalid action: type='${type}' name='${name}'`
    const actionId = getActionIdFromTypeAndName(this, type, name);
    if (actionId == null) {
        workerScript.log("bladeburner.getActionTime", errorLogText);
        return -1;
    }

    const actionObj = this.getActionObject(actionId);
    if (actionObj == null) {
        workerScript.log("bladeburner.getActionTime", errorLogText);
        return -1;
    }

    switch (actionId.type) {
        case ActionTypes["Contract"]:
        case ActionTypes["Operation"]:
        case ActionTypes["BlackOp"]:
        case ActionTypes["BlackOperation"]:
            return actionObj.getActionTime(this);
        case ActionTypes["Training"]:
        case ActionTypes["Field Analysis"]:
        case ActionTypes["FieldAnalysis"]:
            return 30;
        case ActionTypes["Recruitment"]:
            return getRecruitmentTime(this, Player);
        case ActionTypes["Diplomacy"]:
        case ActionTypes["Hyperbolic Regeneration Chamber"]:
            return 60;
        default:
            workerScript.log("bladeburner.getActionTime", errorLogText);
            return -1;
    }
}

Bladeburner.prototype.getActionEstimatedSuccessChanceNetscriptFn = function(type, name, workerScript) {
    const errorLogText = `Invalid action: type='${type}' name='${name}'`
    const actionId = getActionIdFromTypeAndName(this, type, name);
    if (actionId == null) {
        workerScript.log("bladeburner.getActionEstimatedSuccessChance", errorLogText);
        return -1;
    }

    const actionObj = this.getActionObject(actionId);
    if (actionObj == null) {
        workerScript.log("bladeburner.getActionEstimatedSuccessChance", errorLogText);
        return -1;
    }

    switch (actionId.type) {
        case ActionTypes["Contract"]:
        case ActionTypes["Operation"]:
        case ActionTypes["BlackOp"]:
        case ActionTypes["BlackOperation"]:
            return actionObj.getSuccessChance(this, {est:true});
        case ActionTypes["Training"]:
        case ActionTypes["Field Analysis"]:
        case ActionTypes["FieldAnalysis"]:
            return 1;
        case ActionTypes["Recruitment"]:
            return getRecruitmentSuccessChance(this, Player);
        default:
            workerScript.log("bladeburner.getActionEstimatedSuccessChance", errorLogText);
            return -1;
    }
}

Bladeburner.prototype.getActionCountRemainingNetscriptFn = function(type, name, workerScript) {
    const errorLogText = `Invalid action: type='${type}' name='${name}'`;
    const actionId = getActionIdFromTypeAndName(this, type, name);
    if (actionId == null) {
        workerScript.log("bladeburner.getActionCountRemaining", errorLogText);
        return -1;
    }

    const actionObj = this.getActionObject(actionId);
    if (actionObj == null) {
        workerScript.log("bladeburner.getActionCountRemaining", errorLogText);
        return -1;
    }

    switch (actionId.type) {
        case ActionTypes["Contract"]:
        case ActionTypes["Operation"]:
            return Math.floor( actionObj.count );
        case ActionTypes["BlackOp"]:
        case ActionTypes["BlackOperation"]:
            if (this.blackops[name] != null) {
                return 0;
            } else {
                return 1;
            }
        case ActionTypes["Training"]:
        case ActionTypes["Field Analysis"]:
        case ActionTypes["FieldAnalysis"]:
            return Infinity;
        default:
            workerScript.log("bladeburner.getActionCountRemaining", errorLogText);
            return -1;
    }
}

Bladeburner.prototype.getSkillLevelNetscriptFn = function(skillName, workerScript) {
    if (skillName === "" || !Skills.hasOwnProperty(skillName)) {
        workerScript.log("bladeburner.getSkillLevel", `Invalid skill: '${skillName}'`);
        return -1;
    }

    if (this.skills[skillName] == null) {
        return 0;
    } else {
        return this.skills[skillName];
    }
}

Bladeburner.prototype.getSkillUpgradeCostNetscriptFn = function(skillName, workerScript) {
    if (skillName === "" || !Skills.hasOwnProperty(skillName)) {
        workerScript.log("bladeburner.getSkillUpgradeCost", `Invalid skill: '${skillName}'`);
        return -1;
    }

    const skill = Skills[skillName];
    if (this.skills[skillName] == null) {
        return skill.calculateCost(0);
    } else {
        return skill.calculateCost(this.skills[skillName]);
    }
}

Bladeburner.prototype.upgradeSkillNetscriptFn = function(skillName, workerScript) {
    const errorLogText = `Invalid skill: '${skillName}'`;
    if (!Skills.hasOwnProperty(skillName)) {
        workerScript.log("bladeburner.upgradeSkill", errorLogText);
        return false;
    }

    const skill = Skills[skillName];
    let currentLevel = 0;
    if (this.skills[skillName] && !isNaN(this.skills[skillName])) {
        currentLevel = this.skills[skillName];
    }
    const cost = skill.calculateCost(currentLevel);

    if(skill.maxLvl && currentLevel >= skill.maxLvl) {
      workerScript.log("bladeburner.upgradeSkill", `Skill '${skillName}' is already maxed.`);
      return false;
    }

    if (this.skillPoints < cost) {
        workerScript.log("bladeburner.upgradeSkill", `You do not have enough skill points to upgrade ${skillName} (You have ${this.skillPoints}, you need ${cost})`);
        return false;
    }

    this.skillPoints -= cost;
    this.upgradeSkill(skill);
    workerScript.log("bladeburner.upgradeSkill", `'${skillName}' upgraded to level ${this.skills[skillName]}`);
    return true;
}

Bladeburner.prototype.getTeamSizeNetscriptFn = function(type, name, workerScript) {
    if (type === "" && name === "") {
        return this.teamSize;
    }

    const errorLogText = `Invalid action: type='${type}' name='${name}'`;
    const actionId = getActionIdFromTypeAndName(this, type, name);
    if (actionId == null) {
        workerScript.log("bladeburner.getTeamSize", errorLogText);
        return -1;
    }

    const actionObj = this.getActionObject(actionId);
    if (actionObj == null) {
        workerScript.log("bladeburner.getTeamSize", errorLogText);
        return -1;
    }

    if (actionId.type === ActionTypes["Operation"] ||
        actionId.type === ActionTypes["BlackOp"]   ||
        actionId.type === ActionTypes["BlackOperation"]) {
        return actionObj.teamCount;
    } else {
        return 0;
    }
}

Bladeburner.prototype.setTeamSizeNetscriptFn = function(type, name, size, workerScript) {
    const errorLogText = `Invalid action: type='${type}' name='${name}'`;
    const actionId = getActionIdFromTypeAndName(this, type, name);
    if (actionId == null) {
        workerScript.log("bladeburner.setTeamSize", errorLogText);
        return -1;
    }

    if (actionId.type !== ActionTypes["Operation"] &&
        actionId.type !== ActionTypes["BlackOp"]   &&
        actionId.type !== ActionTypes["BlackOperation"]) {
        workerScript.log("bladeburner.setTeamSize", "Only valid for 'Operations' and 'BlackOps'");
        return -1;
    }

    const actionObj = this.getActionObject(actionId);
    if (actionObj == null) {
        workerScript.log("bladeburner.setTeamSize", errorLogText);
        return -1;
    }

    let sanitizedSize = Math.round(size);
    if (isNaN(sanitizedSize) || sanitizedSize < 0) {
        workerScript.log("bladeburner.setTeamSize", `Invalid size: ${size}`);
        return -1;
    }
    if (this.teamSize < sanitizedSize) {sanitizedSize = this.teamSize;}
    actionObj.teamCount = sanitizedSize;
    workerScript.log("bladeburner.setTeamSize", `Team size for '${name}' set to ${sanitizedSize}.`);
    return sanitizedSize;
}

Bladeburner.prototype.joinBladeburnerFactionNetscriptFn = function(workerScript) {
    var bladeburnerFac = Factions["Bladeburners"];
    if (bladeburnerFac.isMember) {
        return true;
    } else if (this.rank >= BladeburnerConstants.RankNeededForFaction) {
        joinFaction(bladeburnerFac);
        workerScript.log("bladeburner.joinBladeburnerFaction", "Joined Bladeburners faction.");
        return true;
    } else {
        workerScript.log("bladeburner.joinBladeburnerFaction", `You do not have the required rank (${this.rank}/${BladeburnerConstants.RankNeededForFaction}).`);
        return false;
    }
}

Bladeburner.prototype.toJSON = function() {
    return Generic_toJSON("Bladeburner", this);
}
Bladeburner.fromJSON = function(value) {
    return Generic_fromJSON(Bladeburner, value.data);
}
Reviver.constructors.Bladeburner = Bladeburner;

export { Bladeburner };
