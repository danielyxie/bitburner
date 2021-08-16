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
    resetSkillMultipliers,
    updateSkillMultipliers,
    resetAction,
    getActionObject,
    completeOperation,
    completeContract,
    completeAction,
    processAction,
    startAction,
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
    updateSkillMultipliers(this); // Calls resetSkillMultipliers()

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
    resetAction(this);
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
        resetAction(this);
    }

    // If the Player has no Stamina, set action to idle
    if (this.stamina <= 0) {
        this.log("Your Bladeburner action was cancelled because your stamina hit 0");
        resetAction(this);
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

        processAction(this, Player, seconds);

        // Automation
        if (this.automateEnabled) {
            // Note: Do NOT set this.action = this.automateActionHigh/Low since it creates a reference
            if (this.stamina <= this.automateThreshLow) {
                if (this.action.name !== this.automateActionLow.name || this.action.type !== this.automateActionLow.type) {
                    this.action = new ActionIdentifier({type: this.automateActionLow.type, name: this.automateActionLow.name});
                    startAction(this, Player, this.action);
                }
            } else if (this.stamina >= this.automateThreshHigh) {
                if (this.action.name !== this.automateActionHigh.name || this.action.type !== this.automateActionHigh.type) {
                    this.action = new ActionIdentifier({type: this.automateActionHigh.type, name: this.automateActionHigh.name});
                    startAction(this, Player, this.action);
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

Bladeburner.prototype.getCurrentCity = function() {
    var city = this.cities[this.city];
    if (!(city instanceof City)) {
        throw new Error("Bladeburner.getCurrentCity() did not properly return a City object");
    }
    return city;
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
    updateSkillMultipliers(this);
}

// Sets the player to the "IDLE" action
Bladeburner.prototype.resetAction = function() {
    this.action = new ActionIdentifier({type:ActionTypes.Idle});
}

////////////////////////////////////////////////////////////////////////////////
//////////////////////////// Unconvertable for now /////////////////////////////
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
//////////////////////////////// Netscript Fns /////////////////////////////////
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
        let action = getActionObject(this, actionId);
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
        startAction(this, Player, actionId);
        workerScript.log("bladeburner.startAction", `Starting bladeburner action with type '${type}' and name ${name}"`);
        return true;
    } catch(e) {
        resetAction(this);
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

    const actionObj = getActionObject(this, actionId);
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

    const actionObj = getActionObject(this, actionId);
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

    const actionObj = getActionObject(this, actionId);
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

    const actionObj = getActionObject(this, actionId);
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

    const actionObj = getActionObject(this, actionId);
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
