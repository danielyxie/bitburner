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
import { ConsoleHelpText } from "./Bladeburner/data/Help";
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

import { SkillElem } from "./Bladeburner/ui/SkillElem";
import { SkillList } from "./Bladeburner/ui/SkillList";
import { BlackOpElem } from "./Bladeburner/ui/BlackOpElem";
import { BlackOpList } from "./Bladeburner/ui/BlackOpList";
import { OperationElem } from "./Bladeburner/ui/OperationElem";
import { OperationList } from "./Bladeburner/ui/OperationList";
import { ContractElem } from "./Bladeburner/ui/ContractElem";
import { ContractList } from "./Bladeburner/ui/ContractList";
import { GeneralActionElem } from "./Bladeburner/ui/GeneralActionElem";
import { GeneralActionList } from "./Bladeburner/ui/GeneralActionList";
import { GeneralActionPage } from "./Bladeburner/ui/GeneralActionPage";
import { ContractPage } from "./Bladeburner/ui/ContractPage";
import { OperationPage } from "./Bladeburner/ui/OperationPage";
import { BlackOpPage } from "./Bladeburner/ui/BlackOpPage";
import { SkillPage } from "./Bladeburner/ui/SkillPage";
import { Stats } from "./Bladeburner/ui/Stats";

import { StatsTable } from "./ui/React/StatsTable";
import { CopyableText } from "./ui/React/CopyableText";
import { Money } from "./ui/React/Money";
import React from "react";
import ReactDOM from "react-dom";

const stealthIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 166 132"  style="fill:#adff2f;"><g><path d="M132.658-0.18l-24.321,24.321c-7.915-2.71-16.342-4.392-25.087-4.392c-45.84,0-83,46-83,46   s14.1,17.44,35.635,30.844L12.32,120.158l12.021,12.021L144.68,11.841L132.658-0.18z M52.033,80.445   c-2.104-4.458-3.283-9.438-3.283-14.695c0-19.054,15.446-34.5,34.5-34.5c5.258,0,10.237,1.179,14.695,3.284L52.033,80.445z"/><path d="M134.865,37.656l-18.482,18.482c0.884,3.052,1.367,6.275,1.367,9.612c0,19.055-15.446,34.5-34.5,34.5   c-3.337,0-6.56-0.483-9.611-1.367l-10.124,10.124c6.326,1.725,12.934,2.743,19.735,2.743c45.84,0,83-46,83-46   S153.987,50.575,134.865,37.656z"/></g></svg>&nbsp;`
const killIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="-22 0 511 511.99561" style="fill:#adff2f;"><path d="m.496094 466.242188 39.902344-39.902344 45.753906 45.753906-39.898438 39.902344zm0 0"/><path d="m468.421875 89.832031-1.675781-89.832031-300.265625 300.265625 45.753906 45.753906zm0 0"/><path d="m95.210938 316.785156 16.84375 16.847656h.003906l83.65625 83.65625 22.753906-22.753906-100.503906-100.503906zm0 0"/><path d="m101.445312 365.300781-39.902343 39.902344 45.753906 45.753906 39.902344-39.902343-39.90625-39.902344zm0 0"/></svg>`

// DOM related variables
const ActiveActionCssClass = "bladeburner-active-action";

// Console related stuff
let consoleHistoryIndex = 0;

// Keypresses for Console
$(document).keydown(function(event) {
    if (routing.isOn(Page.Bladeburner)) {
        if (!(Player.bladeburner instanceof Bladeburner)) { return; }
        let consoleHistory = Player.bladeburner.consoleHistory;

        if (event.keyCode === KEY.ENTER) {
            event.preventDefault();
            var command = DomElems.consoleInput.value;
            if (command.length > 0) {
                Player.bladeburner.postToConsole("> " + command);
                Player.bladeburner.resetConsoleInput();
                Player.bladeburner.executeConsoleCommands(command);
            }
        }

        if (event.keyCode === KEY.UPARROW) {
            if (DomElems.consoleInput == null) {return;}
            var i = consoleHistoryIndex;
            var len = consoleHistory.length;

            if (len === 0) {return;}
            if (i < 0 || i > len) {
                consoleHistoryIndex = len;
            }

            if (i !== 0) {
                --consoleHistoryIndex;
            }

            var prevCommand = consoleHistory[consoleHistoryIndex];
            DomElems.consoleInput.value = prevCommand;
            setTimeoutRef(function(){DomElems.consoleInput.selectionStart = DomElems.consoleInput.selectionEnd = 10000; }, 0);
        }

        if (event.keyCode === KEY.DOWNARROW) {
            if (DomElems.consoleInput == null) {return;}
            var i = consoleHistoryIndex;
            var len = consoleHistory.length;

            if (len == 0) {return;}
            if (i < 0 || i > len) {
                consoleHistoryIndex = len;
            }

            // Latest command, put nothing
            if (i == len || i == len-1) {
                consoleHistoryIndex = len;
                DomElems.consoleInput.value = "";
            } else {
                ++consoleHistoryIndex;
                var prevCommand = consoleHistory[consoleHistoryIndex];
                DomElems.consoleInput.value = prevCommand;
            }
        }
    }
});

function ActionIdentifier(params={}) {
    if (params.name) {this.name = params.name;}
    if (params.type) {this.type = params.type;}
}

ActionIdentifier.prototype.toJSON = function() {
    return Generic_toJSON("ActionIdentifier", this);
}

ActionIdentifier.fromJSON = function(value) {
    return Generic_fromJSON(ActionIdentifier, value.data);
}

Reviver.constructors.ActionIdentifier = ActionIdentifier;

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
    this.consoleLogs = [];

    // Initialization
    this.initializeDomElementRefs();
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
            this.randomEvent();
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

        if (routing.isOn(Page.Bladeburner)) {
            this.updateContent();
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
            this.actionTimeToComplete = this.getRecruitmentTime();
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
                    this.gainActionStats(action, true);
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
                    this.gainActionStats(action, false);
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
                    this.gainActionStats(action, true);
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

                    if (routing.isOn(Page.Bladeburner)) {
                        this.createActionAndSkillsContent();
                    }

                    if (this.logging.blackops) {
                        this.log(action.name + " successful! Gained " + formatNumber(rankGain, 1) + " rank");
                    }
                } else {
                    this.gainActionStats(action, false);
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
            var successChance = this.getRecruitmentSuccessChance();
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
            var eff = this.getDiplomacyEffectiveness();
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
                this.triggerPotentialMigration(this.city, 0.1);
            }
            break;
        case "Undercover Operation":
            if (success) {
                city.improvePopulationEstimateByPercentage(0.8 * this.skillMultipliers.successChanceEstimate);
                if (Math.random() < (0.02 * this.skillMultipliers.successChanceEstimate)) {
                    city.improveCommunityEstimate(1);
                }
            } else {
                this.triggerPotentialMigration(this.city, 0.15);
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

Bladeburner.prototype.getRecruitmentTime = function() {
    var effCharisma = Player.charisma * this.skillMultipliers.effCha;
    var charismaFactor = Math.pow(effCharisma, 0.81) + effCharisma / 90;
    return Math.max(10, Math.round(BladeburnerConstants.BaseRecruitmentTimeNeeded - charismaFactor));
}

Bladeburner.prototype.getRecruitmentSuccessChance = function() {
    return Math.pow(Player.charisma, 0.45) / (this.teamSize + 1);
}

Bladeburner.prototype.getDiplomacyEffectiveness = function() {
    // Returns a decimal by which the city's chaos level should be multiplied (e.g. 0.98)
    const CharismaLinearFactor = 1e3;
    const CharismaExponentialFactor = 0.045;

    const charismaEff = Math.pow(Player.charisma, CharismaExponentialFactor) + Player.charisma / CharismaLinearFactor;
    return (100 - charismaEff) / 100;
}

/**
 * Process stat gains from Contracts, Operations, and Black Operations
 * @param action(Action obj) - Derived action class
 * @param success(bool) - Whether action was successful
 */
Bladeburner.prototype.gainActionStats = function(action, success) {
    var difficulty = action.getDifficulty();

    /**
     * Gain multiplier based on difficulty. If this changes then the
     * same variable calculated in completeAction() needs to change too
     */
    var difficultyMult = Math.pow(difficulty, BladeburnerConstants.DiffMultExponentialFactor) + difficulty / BladeburnerConstants.DiffMultLinearFactor;

    var time = this.actionTimeToComplete;
    var successMult = success ? 1 : 0.5;

    var unweightedGain = time * BladeburnerConstants.BaseStatGain * successMult * difficultyMult;
    var unweightedIntGain = time * BladeburnerConstants.BaseIntGain * successMult * difficultyMult;
    const skillMult = this.skillMultipliers.expGain;
    Player.gainHackingExp(unweightedGain    * action.weights.hack * Player.hacking_exp_mult * skillMult);
    Player.gainStrengthExp(unweightedGain   * action.weights.str  * Player.strength_exp_mult * skillMult);
    Player.gainDefenseExp(unweightedGain    * action.weights.def  * Player.defense_exp_mult * skillMult);
    Player.gainDexterityExp(unweightedGain  * action.weights.dex  * Player.dexterity_exp_mult * skillMult);
    Player.gainAgilityExp(unweightedGain    * action.weights.agi  * Player.agility_exp_mult * skillMult);
    Player.gainCharismaExp(unweightedGain   * action.weights.cha  * Player.charisma_exp_mult * skillMult);
    let intExp = unweightedIntGain * action.weights.int * skillMult;
    if (intExp > 1) {
        intExp = Math.pow(intExp, 0.8);
    }
    Player.gainIntelligenceExp(intExp);
}

Bladeburner.prototype.randomEvent = function() {
    var chance = Math.random();

    // Choose random source/destination city for events
    var sourceCityName = BladeburnerConstants.CityNames[getRandomInt(0, 5)];
    var sourceCity = this.cities[sourceCityName];
    if (!(sourceCity instanceof City)) {
        throw new Error("sourceCity was not a City object in Bladeburner.randomEvent()");
    }

    var destCityName = BladeburnerConstants.CityNames[getRandomInt(0, 5)];
    while (destCityName === sourceCityName) {
        destCityName = BladeburnerConstants.CityNames[getRandomInt(0, 5)];
    }
    var destCity = this.cities[destCityName];

    if (!(sourceCity instanceof City) || !(destCity instanceof City)) {
        throw new Error("sourceCity/destCity was not a City object in Bladeburner.randomEvent()");
    }

    if (chance <= 0.05) {
        // New Synthoid Community, 5%
        ++sourceCity.comms;
        var percentage = getRandomInt(10, 20) / 100;
        var count = Math.round(sourceCity.pop * percentage);
        sourceCity.pop += count;
        if (this.logging.events) {
            this.log("Intelligence indicates that a new Synthoid community was formed in a city");
        }
    } else if (chance <= 0.1) {
        // Synthoid Community Migration, 5%
        if (sourceCity.comms <= 0) {
            // If no comms in source city, then instead trigger a new Synthoid community event
            ++sourceCity.comms;
            var percentage = getRandomInt(10, 20) / 100;
            var count = Math.round(sourceCity.pop * percentage);
            sourceCity.pop += count;
            if (this.logging.events) {
                this.log("Intelligence indicates that a new Synthoid community was formed in a city");
            }
        } else {
            --sourceCity.comms;
            ++destCity.comms;

            // Change pop
            var percentage = getRandomInt(10, 20) / 100;
            var count = Math.round(sourceCity.pop * percentage);
            sourceCity.pop -= count;
            destCity.pop += count;

            if (this.logging.events) {
                this.log("Intelligence indicates that a Synthoid community migrated from " + sourceCityName + " to some other city");
            }
        }
    } else if  (chance <= 0.3) {
        // New Synthoids (non community), 20%
        var percentage = getRandomInt(8, 24) / 100;
        var count = Math.round(sourceCity.pop * percentage);
        sourceCity.pop += count;
        if (this.logging.events) {
            this.log("Intelligence indicates that the Synthoid population of " + sourceCityName + " just changed significantly");
        }
    } else if (chance <= 0.5) {
        // Synthoid migration (non community) 20%
        this.triggerMigration(sourceCityName);
        if (this.logging.events) {
            this.log("Intelligence indicates that a large number of Synthoids migrated from " + sourceCityName + " to some other city");
        }
    } else if (chance <= 0.7) {
        // Synthoid Riots (+chaos), 20%
        sourceCity.chaos += 1;
        sourceCity.chaos *= (1 + getRandomInt(5, 20) / 100);
        if (this.logging.events) {
            this.log("Tensions between Synthoids and humans lead to riots in " + sourceCityName + "! Chaos increased");
        }
    } else if (chance <= 0.9) {
        // Less Synthoids, 20%
        var percentage = getRandomInt(8, 20) / 100;
        var count = Math.round(sourceCity.pop * percentage);
        sourceCity.pop -= count;
        if (this.logging.events) {
            this.log("Intelligence indicates that the Synthoid population of " + sourceCityName + " just changed significantly");
        }
    }
    // 10% chance of nothing happening
}

Bladeburner.prototype.triggerPotentialMigration = function(sourceCityName, chance) {
    if (chance == null || isNaN(chance)) {
        console.error("Invalid 'chance' parameter passed into Bladeburner.triggerPotentialMigration()");
    }
    if (chance > 1) {chance /= 100;}
    if (Math.random() < chance) {this.triggerMigration(sourceCityName);}
}

Bladeburner.prototype.triggerMigration = function(sourceCityName) {
    var destCityName = BladeburnerConstants.CityNames[getRandomInt(0, 5)];
    while (destCityName === sourceCityName) {
        destCityName = BladeburnerConstants.CityNames[getRandomInt(0, 5)];
    }
    var destCity    = this.cities[destCityName];
    var sourceCity  = this.cities[sourceCityName];
    if (destCity == null || sourceCity == null) {
        throw new Error("Failed to find City with name: " + destCityName);
    }
    var rand = Math.random(), percentage = getRandomInt(3, 15) / 100;

    if (rand < 0.05 && sourceCity.comms > 0) { // 5% chance for community migration
        percentage *= getRandomInt(2, 4); // Migration increases population change
        --sourceCity.comms;
        ++destCity.comms;
    }
    var count = Math.round(sourceCity.pop * percentage);
    sourceCity.pop -= count;
    destCity.pop += count;
}

let DomElems = {};

Bladeburner.prototype.initializeDomElementRefs = function() {
    DomElems = {
        bladeburnerDiv:     null,

        // Main Divs
        overviewConsoleParentDiv:  null,

        overviewDiv:        null, // Overview of stats that stays fixed on left
        actionAndSkillsDiv: null, // Panel for different sections (contracts, ops, skills)
        currentTab:         null, // Contracts, Operations, Black Ops, Skills

        consoleDiv:         null,
        consoleTable:       null,
        consoleInputRow:    null, // tr
        consoleInputCell:   null, // td
        consoleInputHeader: null, // "> "
        consoleInput:       null, // Actual input element

        // Overview Content
        overviewRank:               null,
        overviewStamina:            null,
        overviewStaminaHelpTip:     null,
        overviewGen1:               null, // Stamina Penalty, Team, Hospitalized stats, current city
        overviewEstPop:             null,
        overviewEstPopHelpTip:      null,
        overviewEstComms:           null,
        overviewChaos:              null,
        overviewSkillPoints:        null,
        overviewBonusTime:          null,
        overviewAugMults:           null,

        // Actions and Skills Content
        actionsAndSkillsDesc:   null,
        actionsAndSkillsList:   null, // ul element of all UI elements in this panel
        generalActions:     {},
        contracts:          {},
        operations:         {},
        blackops:           {},
        skills:             {},
        skillPointsDisplay: null,
    };
}

Bladeburner.prototype.createContent = function() {
    DomElems.bladeburnerDiv = createElement("div", {
        id:"bladeburner-container", position:"fixed", class:"generic-menupage-container",
    });

    // Parent Div for Overview and Console
    DomElems.overviewConsoleParentDiv = createElement("div", {
        height:"60%", display:"block", position:"relative",
    });

    // Overview and Action/Skill pane
    DomElems.overviewDiv = createElement("div", {
        width:"30%", display:"inline-block", border:"1px solid white",
    });

    DomElems.actionAndSkillsDiv = createElement("div", {
        width:"70%", display:"block",
        border:"1px solid white", margin:"6px", padding:"6px",
    });

    DomElems.currentTab = "general";

    this.createOverviewContent();
    this.createActionAndSkillsContent();

    // Console
    DomElems.consoleDiv          = createElement("div", {
        class:"bladeburner-console-div",
        clickListener:() => {
            if (DomElems.consoleInput instanceof Element) {
                DomElems.consoleInput.focus();
            }
            return false;
        },
    });
    DomElems.consoleTable        = createElement("table", {class:"bladeburner-console-table"});
    DomElems.consoleInputRow     = createElement("tr", {class:"bladeburner-console-input-row", id:"bladeburner-console-input-row"});
    DomElems.consoleInputCell    = createElement("td", {class:"bladeburner-console-input-cell"});
    DomElems.consoleInputHeader  = createElement("pre", {innerText:"> "});
    DomElems.consoleInput        = createElement("input", {
        type:"text", class:"bladeburner-console-input", tabIndex:1,
        onfocus:() => {DomElems.consoleInput.value = DomElems.consoleInput.value},
    });

    DomElems.consoleInputCell.appendChild(DomElems.consoleInputHeader);
    DomElems.consoleInputCell.appendChild(DomElems.consoleInput);
    DomElems.consoleInputRow.appendChild(DomElems.consoleInputCell);
    DomElems.consoleTable.appendChild(DomElems.consoleInputRow);
    DomElems.consoleDiv.appendChild(DomElems.consoleTable);

    DomElems.overviewConsoleParentDiv.appendChild(DomElems.overviewDiv);
    DomElems.overviewConsoleParentDiv.appendChild(DomElems.consoleDiv);
    DomElems.bladeburnerDiv.appendChild(DomElems.overviewConsoleParentDiv);
    DomElems.bladeburnerDiv.appendChild(DomElems.actionAndSkillsDiv);


    // legend
    const legend = createElement("div")
    legend.innerHTML = `<span class="text">${stealthIcon}= This action requires stealth, ${killIcon} = This action involves retirement</span>`
    DomElems.bladeburnerDiv.appendChild(legend);

    document.getElementById("entire-game-container").appendChild(DomElems.bladeburnerDiv);

    if (this.consoleLogs.length === 0) {
        this.postToConsole("Bladeburner Console BETA");
        this.postToConsole("Type 'help' to see console commands");
    } else {
        for (let i = 0; i < this.consoleLogs.length; ++i) {
            this.postToConsole(this.consoleLogs[i], false);
        }
    }

    DomElems.consoleInput.focus();
}

Bladeburner.prototype.clearContent = function() {
    if (DomElems.bladeburnerDiv instanceof Element) {
        removeChildrenFromElement(DomElems.bladeburnerDiv);
        removeElement(DomElems.bladeburnerDiv);
    }
    clearObject(DomElems);
    this.initializeDomElementRefs();
}

Bladeburner.prototype.createOverviewContent = function() {
    if (DomElems.overviewDiv == null) {
        throw new Error("Bladeburner.createOverviewContent() called with DomElems.overviewDiv = null");
    }

    DomElems.overviewRank = createElement("p", {
        innerText:"Rank: ",
        display:"inline-block",
        tooltip:"Your rank within the Bladeburner division",
    });

    DomElems.overviewStamina = createElement("p", {
        display:"inline-block",
    });

    DomElems.overviewStaminaHelpTip = createElement("div", {
        class:"help-tip",
        innerText:"?",
        clickListener: () => {
            dialogBoxCreate("Performing actions will use up your stamina.<br><br>" +
                            "Your max stamina is determined primarily by your agility stat.<br><br>" +
                            "Your stamina gain rate is determined by both your agility and your " +
                            "max stamina. Higher max stamina leads to a higher gain rate.<br><br>" +
                            "Once your " +
                            "stamina falls below 50% of its max value, it begins to negatively " +
                            "affect the success rate of your contracts/operations. This penalty " +
                            "is shown in the overview panel. If the penalty is 15%, then this means " +
                            "your success rate would be multipled by 85% (100 - 15).<br><br>" +
                            "Your max stamina and stamina gain rate can also be increased by " +
                            "training, or through skills and Augmentation upgrades.");
        },
    });

    DomElems.overviewGen1 = createElement("p", {
        display:"block",
    });

    DomElems.overviewEstPop = createElement("p", {
        innerText:"Est. Synthoid Population: ",
        display:"inline-block",
        tooltip:"This is your Bladeburner division's estimate of how many Synthoids exist " +
                "in your current city.",
    });

    DomElems.overviewEstPopHelpTip = createElement("div", {
        innerText:"?", class:"help-tip",
        clickListener:() => {
            dialogBoxCreate("The success rate of your contracts/operations depends on " +
                            "the population of Synthoids in your current city. " +
                            "The success rate that is shown to you is only an estimate, " +
                            "and it is based on your Synthoid population estimate.<br><br>" +
                            "Therefore, it is important that this Synthoid population estimate " +
                            "is accurate so that you have a better idea of your " +
                            "success rate for contracts/operations. Certain " +
                            "actions will increase the accuracy of your population " +
                            "estimate.<br><br>" +
                            "The Synthoid populations of cities can change due to your " +
                            "actions or random events. If random events occur, they will " +
                            "be logged in the Bladeburner Console.");
        },
    });

    DomElems.overviewEstComms = createElement("p", {
        innerText:"Est. Synthoid Communities: ",
        display:"inline-block",
        tooltip:"This is your Bladeburner divison's estimate of how many Synthoid " +
                "communities exist in your current city.",
    });

    DomElems.overviewChaos = createElement("p", {
        innerText:"City Chaos: ",
        display:"inline-block",
        tooltip:"The city's chaos level due to tensions and conflicts between humans and Synthoids. " +
                "Having too high of a chaos level can make contracts and operations harder.",
    });

    DomElems.overviewBonusTime = createElement("p", {
      innerText: "Bonus time: ",
      display: "inline-block",
      tooltip: "You gain bonus time while offline or when the game is inactive (e.g. when the tab is throttled by browser). " +
               "Bonus time makes the Bladeburner mechanic progress faster, up to 5x the normal speed.",
    });
    DomElems.overviewSkillPoints = createElement("p", {display:"block"});


    DomElems.overviewAugMults = createElement("div", {display:"block"});


    DomElems.overviewDiv.appendChild(DomElems.overviewRank);
    appendLineBreaks(DomElems.overviewDiv, 1);
    DomElems.overviewDiv.appendChild(DomElems.overviewStamina);
    DomElems.overviewDiv.appendChild(DomElems.overviewStaminaHelpTip);
    DomElems.overviewDiv.appendChild(DomElems.overviewGen1);
    DomElems.overviewDiv.appendChild(DomElems.overviewEstPop);
    DomElems.overviewDiv.appendChild(DomElems.overviewEstPopHelpTip);
    appendLineBreaks(DomElems.overviewDiv, 1);
    DomElems.overviewDiv.appendChild(DomElems.overviewEstComms);
    appendLineBreaks(DomElems.overviewDiv, 1);
    DomElems.overviewDiv.appendChild(DomElems.overviewChaos);
    appendLineBreaks(DomElems.overviewDiv, 2);
    DomElems.overviewDiv.appendChild(DomElems.overviewBonusTime);
    DomElems.overviewDiv.appendChild(DomElems.overviewSkillPoints);
    appendLineBreaks(DomElems.overviewDiv, 1);
    DomElems.overviewDiv.appendChild(DomElems.overviewAugMults);

    // Travel to new city button
    appendLineBreaks(DomElems.overviewDiv, 1);
    DomElems.overviewDiv.appendChild(createElement("a", {
        innerHTML:"Travel", class:"a-link-button", display:"inline-block",
        clickListener:() => {
            var popupId = "bladeburner-travel-popup-cancel-btn";
            var popupArguments = [];
            popupArguments.push(createElement("a", { // Cancel Button
                innerText:"Cancel", class:"a-link-button",
                clickListener:() => {
                    removeElementById(popupId); return false;
                },
            }))
            popupArguments.push(createElement("p", { // Info Text
                innerText:"Travel to a different city for your Bladeburner " +
                          "activities. This does not cost any money. The city you are " +
                          "in for your Bladeburner duties does not affect " +
                          "your location in the game otherwise",
            }));
            for (var i = 0; i < BladeburnerConstants.CityNames.length; ++i) {
            (function(inst, i) {
                popupArguments.push(createElement("div", {
                    /**
                     * Reusing this css class...it adds a border and makes it
                     * so that background color changes when you hover
                     */
                    class:"cmpy-mgmt-find-employee-option",
                    innerText:BladeburnerConstants.CityNames[i],
                    clickListener:() => {
                        inst.city = BladeburnerConstants.CityNames[i];
                        removeElementById(popupId);
                        inst.updateOverviewContent();
                        return false;
                    },
                }));
            })(this, i);
            }
            createPopup(popupId, popupArguments);
        },
    }));

    // Faction button
    const bladeburnersFactionName = "Bladeburners";
    if (factionExists(bladeburnersFactionName)) {
        var bladeburnerFac = Factions[bladeburnersFactionName];
        if (!(bladeburnerFac instanceof Faction)) {
            throw new Error("Could not properly get Bladeburner Faction object in Bladeburner UI Overview Faction button");
        }
        DomElems.overviewDiv.appendChild(createElement("a", {
            innerText:"Faction", class:"a-link-button", display:"inline-block",
            tooltip:"Apply to the Bladeburner Faction, or go to the faction page if you are already a member",
            clickListener:() => {
                if (bladeburnerFac.isMember) {
                    Engine.loadFactionContent();
                    displayFactionContent(bladeburnersFactionName);
                } else {
                    if (this.rank >= BladeburnerConstants.RankNeededForFaction) {
                        joinFaction(bladeburnerFac);
                        dialogBoxCreate("Congratulations! You were accepted into the Bladeburners faction");
                        removeChildrenFromElement(DomElems.overviewDiv);
                        this.createOverviewContent();
                    } else {
                        dialogBoxCreate("You need a rank of 25 to join the Bladeburners Faction!")
                    }
                }
                return false;
            },
        }));
    }

    DomElems.overviewDiv.appendChild(createElement("br"));
    DomElems.overviewDiv.appendChild(createElement("br"));

    this.updateOverviewContent();
}

Bladeburner.prototype.createActionAndSkillsContent = function() {
    if (DomElems.currentTab == null) {DomElems.currentTab = "general";}

    removeChildrenFromElement(DomElems.actionAndSkillsDiv);
    clearObject(DomElems.generalActions);
    clearObject(DomElems.contracts);
    clearObject(DomElems.operations);
    clearObject(DomElems.blackops);
    clearObject(DomElems.skills);

    //Navigation buttons
    var currTab = DomElems.currentTab.toLowerCase();
    var buttons = ["General", "Contracts", "Operations", "BlackOps", "Skills"];
    for (var i = 0; i < buttons.length; ++i) {
        (function(buttons, i, inst, currTab) {

            DomElems.actionAndSkillsDiv.appendChild(createElement("a", {
                innerText:buttons[i],
                class:currTab === buttons[i].toLowerCase() ? "bladeburner-nav-button-inactive" : "bladeburner-nav-button",
                clickListener:() => {
                    DomElems.currentTab = buttons[i].toLowerCase();
                    inst.createActionAndSkillsContent();
                    return false;
                },
            }));
        }) (buttons, i, this, currTab);
    }

    // General info/description for each action
    DomElems.actionsAndSkillsDesc = createElement("p", {
        display:"block", margin:"4px", padding:"4px",
    });

    // List for actions/skills
    removeChildrenFromElement(DomElems.actionsAndSkillsList);
    DomElems.actionsAndSkillsList = createElement("ul");

    switch(currTab) {
        case "general":
            ReactDOM.unmountComponentAtNode(DomElems.actionsAndSkillsDesc);
            ReactDOM.render(<GeneralActionPage bladeburner={this} />, DomElems.actionsAndSkillsDesc);
            break;
        case "contracts":
            ReactDOM.unmountComponentAtNode(DomElems.actionsAndSkillsDesc);
            ReactDOM.render(<ContractPage bladeburner={this} />, DomElems.actionsAndSkillsDesc);
            break;
        case "operations":
            ReactDOM.unmountComponentAtNode(DomElems.actionsAndSkillsDesc);
            ReactDOM.render(<OperationPage bladeburner={this} />, DomElems.actionsAndSkillsDesc);
            break;
        case "blackops":
            ReactDOM.unmountComponentAtNode(DomElems.actionsAndSkillsDesc);
            ReactDOM.render(<BlackOpPage bladeburner={this} />, DomElems.actionsAndSkillsDesc);
            break;
        case "skills":
            ReactDOM.unmountComponentAtNode(DomElems.actionsAndSkillsDesc);
            ReactDOM.render(<SkillPage bladeburner={this} />, DomElems.actionsAndSkillsDesc);
            break;
        default:
            throw new Error("Invalid value for DomElems.currentTab in Bladeburner.createActionAndSkillsContent");
    }
    this.updateContent();

    DomElems.actionAndSkillsDiv.appendChild(DomElems.actionsAndSkillsDesc);
    DomElems.actionAndSkillsDiv.appendChild(DomElems.actionsAndSkillsList);
}

Bladeburner.prototype.updateContent = function() {
    this.updateOverviewContent();
}

Bladeburner.prototype.updateOverviewContent = function() {
    if (!routing.isOn(Page.Bladeburner)) return;
    ReactDOM.render(<Stats bladeburner={this} player={Player} />, DomElems.overviewDiv);
}

////////////////////////////////////////////////////////////////////////////////
///////////////////////////////HYDRO END OF UI//////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// Bladeburner Console Window
Bladeburner.prototype.postToConsole = function(input, saveToLogs=true) {
    const MaxConsoleEntries = 100;
    if (saveToLogs === true) {
        this.consoleLogs.push(input);
        if (this.consoleLogs.length > MaxConsoleEntries) {
            this.consoleLogs.shift();
        }
    }

    if (input == null || DomElems.consoleDiv == null) {return;}
    $("#bladeburner-console-input-row").before('<tr><td class="bladeburner-console-line" style="color: var(--my-font-color); white-space:pre-wrap;">' + input + '</td></tr>');

    if (DomElems.consoleTable.childNodes.length > MaxConsoleEntries) {
        DomElems.consoleTable.removeChild(DomElems.consoleTable.firstChild);
    }

	this.updateConsoleScroll();
}

Bladeburner.prototype.updateConsoleScroll = function() {
    DomElems.consoleDiv.scrollTop = DomElems.consoleDiv.scrollHeight;
}

Bladeburner.prototype.resetConsoleInput = function() {
    DomElems.consoleInput.value = "";
}

Bladeburner.prototype.clearConsole = function() {
    while (DomElems.consoleTable.childNodes.length > 1) {
        DomElems.consoleTable.removeChild(DomElems.consoleTable.firstChild);
    }

    this.consoleLogs.length = 0;
}

Bladeburner.prototype.log = function(input) {
    // Adds a timestamp and then just calls postToConsole
    this.postToConsole(`[${getTimestamp()}] ${input}`);
}

// Handles a potential series of commands (comm1; comm2; comm3;)
Bladeburner.prototype.executeConsoleCommands = function(commands) {
    try {
        // Console History
        if (this.consoleHistory[this.consoleHistory.length-1] != commands) {
            this.consoleHistory.push(commands);
            if (this.consoleHistory.length > 50) {
                this.consoleHistory.splice(0, 1);
            }
        }
        consoleHistoryIndex = this.consoleHistory.length;

        const arrayOfCommands = commands.split(";");
        for (let i = 0; i < arrayOfCommands.length; ++i) {
            this.executeConsoleCommand(arrayOfCommands[i]);
        }
    } catch(e) {
        exceptionAlert(e);
    }
}

// Execute a single console command
Bladeburner.prototype.executeConsoleCommand = function(command) {
    command = command.trim();
    command = command.replace(/\s\s+/g, ' '); // Replace all whitespace w/ a single space

    var args = this.parseCommandArguments(command);
    if (args.length <= 0) {return;} // Log an error?

    switch(args[0].toLowerCase()) {
        case "automate":
            this.executeAutomateConsoleCommand(args);
            break;
        case "clear":
        case "cls":
            this.clearConsole();
            break;
        case "help":
            this.executeHelpConsoleCommand(args);
            break;
        case "log":
            this.executeLogConsoleCommand(args);
            break;
        case "skill":
            this.executeSkillConsoleCommand(args);
            break;
        case "start":
            this.executeStartConsoleCommand(args);
            break;
        case "stop":
            this.resetAction();
            break;
        default:
            this.postToConsole("Invalid console command");
            break;
    }
}

Bladeburner.prototype.parseCommandArguments = function(command) {
    /**
     * Returns an array with command and its arguments in each index.
     * e.g. skill "blade's intuition" foo returns [skill, blade's intuition, foo]
     * The input to this fn will be trimmed and will have all whitespace replaced w/ a single space
     */
    const args = [];
    let start = 0, i = 0;
    while (i < command.length) {
        const c = command.charAt(i);
        if (c === '"') { // Double quotes
            const endQuote = command.indexOf('"', i+1);
            if (endQuote !== -1 && (endQuote === command.length-1 || command.charAt(endQuote+1) === " ")) {
                args.push(command.substr(i+1, (endQuote - i - 1)));
                if (endQuote === command.length-1) {
                    start = i = endQuote+1;
                } else {
                    start = i = endQuote+2; // Skip the space
                }
                continue;
            }
        } else if (c === "'") { // Single quotes, same thing as above
            const endQuote = command.indexOf("'", i+1);
            if (endQuote !== -1 && (endQuote === command.length-1 || command.charAt(endQuote+1) === " ")) {
                args.push(command.substr(i+1, (endQuote - i - 1)));
                if (endQuote === command.length-1) {
                    start = i = endQuote+1;
                } else {
                    start = i = endQuote+2; // Skip the space
                }
                continue;
            }
        } else if (c === " ") {
            args.push(command.substr(start, i-start));
            start = i+1;
        }
        ++i;
    }
    if (start !== i) {args.push(command.substr(start, i-start));}
    return args;
}

Bladeburner.prototype.executeAutomateConsoleCommand = function(args) {
    if (args.length !== 2 && args.length !== 4) {
        this.postToConsole("Invalid use of 'automate' command: automate [var] [val] [hi/low]. Use 'help automate' for more info");
        return;
    }

    // Enable/Disable
    if (args.length === 2) {
        var flag = args[1];
        if (flag.toLowerCase() === "status") {
            this.postToConsole("Automation: " + (this.automateEnabled ? "enabled" : "disabled"));
            if (this.automateEnabled) {
                this.postToConsole("When your stamina drops to " + formatNumber(this.automateThreshLow, 0) +
                                   ", you will automatically switch to " + this.automateActionLow.name +
                                   ". When your stamina recovers to " +
                                   formatNumber(this.automateThreshHigh, 0) + ", you will automatically " +
                                   "switch to " + this.automateActionHigh.name + ".");
            }

        } else if (flag.toLowerCase().includes("en")) {
            if (!(this.automateActionLow instanceof ActionIdentifier) ||
                !(this.automateActionHigh instanceof ActionIdentifier)) {
                return this.log("Failed to enable automation. Actions were not set");
            }
            this.automateEnabled = true;
            this.log("Bladeburner automation enabled");
        } else if (flag.toLowerCase().includes("d")) {
            this.automateEnabled = false;
            this.log("Bladeburner automation disabled");
        } else {
            this.log("Invalid argument for 'automate' console command: " + args[1]);
        }
        return;
    }

    // Set variables
    if (args.length === 4) {
        var variable = args[1], val = args[2];

        var highLow = false; // True for high, false for low
        if (args[3].toLowerCase().includes("hi")) {highLow = true;}

        switch (variable) {
            case "general":
            case "gen":
                if (GeneralActions[val] != null) {
                    var action = new ActionIdentifier({
                        type:ActionTypes[val], name:val,
                    });
                    if (highLow) {
                        this.automateActionHigh = action;
                    } else {
                        this.automateActionLow = action;
                    }
                    this.log("Automate (" + (highLow ? "HIGH" : "LOW") + ") action set to " + val);
                } else {
                    this.postToConsole("Invalid action name specified: " + val);
                }
                break;
            case "contract":
            case "contracts":
                if (this.contracts[val] != null) {
                    var action = new ActionIdentifier({
                        type:ActionTypes.Contract, name:val,
                    });
                    if (highLow) {
                        this.automateActionHigh = action;
                    } else {
                        this.automateActionLow = action;
                    }
                    this.log("Automate (" + (highLow ? "HIGH" : "LOW") + ") action set to " + val);
                } else {
                    this.postToConsole("Invalid contract name specified: " + val);
                }
                break;
            case "ops":
            case "op":
            case "operations":
            case "operation":
                if (this.operations[val] != null) {
                    var action = new ActionIdentifier({
                        type:ActionTypes.Operation, name:val,
                    });
                    if (highLow) {
                        this.automateActionHigh = action;
                    } else {
                        this.automateActionLow = action;
                    }
                    this.log("Automate (" + (highLow ? "HIGH" : "LOW") + ") action set to " + val);
                } else {
                    this.postToConsole("Invalid Operation name specified: " + val);
                }
                break;
            case "stamina":
                if (isNaN(val)) {
                    this.postToConsole("Invalid value specified for stamina threshold (must be numeric): " + val);
                } else {
                    if (highLow) {
                        this.automateThreshHigh = Number(val);
                    } else {
                        this.automateThreshLow = Number(val);
                    }
                    this.log("Automate (" + (highLow ? "HIGH" : "LOW") + ") stamina threshold set to " + val);
                }
                break;
            default:
                break;
        }

        return;
    }
}

Bladeburner.prototype.executeHelpConsoleCommand = function(args) {
    if (args.length === 1) {
      for(const line of ConsoleHelpText.helpList){
        this.postToConsole(line);
      }
    } else {
        for (var i = 1; i < args.length; ++i) {
            const helpText = ConsoleHelpText[args[i]];
            for(const line of helpText){
                this.postToConsole(line);
            }
        }
    }
}

Bladeburner.prototype.executeLogConsoleCommand = function(args) {
    if (args.length < 3) {
        this.postToConsole("Invalid usage of log command: log [enable/disable] [action/event]");
        this.postToConsole("Use 'help log' for more details and examples");
        return;
    }

    var flag = true;
    if (args[1].toLowerCase().includes("d")) {flag = false;} // d for disable

    switch (args[2].toLowerCase()) {
        case "general":
        case "gen":
            this.logging.general = flag;
            this.log("Logging " + (flag ? "enabled" : "disabled") + " for general actions");
            break;
        case "contract":
        case "contracts":
            this.logging.contracts = flag;
            this.log("Logging " + (flag ? "enabled" : "disabled") + " for Contracts");
            break;
        case "ops":
        case "op":
        case "operations":
        case "operation":
            this.logging.ops = flag;
            this.log("Logging " + (flag ? "enabled" : "disabled") + " for Operations");
            break;
        case "blackops":
        case "blackop":
        case "black operations":
        case "black operation":
            this.logging.blackops = flag;
            this.log("Logging " + (flag ? "enabled" : "disabled") + " for BlackOps");
            break;
        case "event":
        case "events":
            this.logging.events = flag;
            this.log("Logging " + (flag ? "enabled" : "disabled") + " for events");
            break;
        case "all":
            this.logging.general = flag;
            this.logging.contracts = flag;
            this.logging.ops = flag;
            this.logging.blackops = flag;
            this.logging.events = flag;
            this.log("Logging " + (flag ? "enabled" : "disabled") + " for everything");
            break;
        default:
            this.postToConsole("Invalid action/event type specified: " + args[2]);
            this.postToConsole("Examples of valid action/event identifiers are: [general, contracts, ops, blackops, events]");
            break;
    }
}

Bladeburner.prototype.executeSkillConsoleCommand = function(args) {
    switch (args.length) {
        case 1:
            // Display Skill Help Command
            this.postToConsole("Invalid usage of 'skill' console command: skill [action] [name]");
            this.postToConsole("Use 'help skill' for more info");
            break;
        case 2:
            if (args[1].toLowerCase() === "list") {
                // List all skills and their level
                this.postToConsole("Skills: ");
                var skillNames = Object.keys(Skills);
                for(var i = 0; i < skillNames.length; ++i) {
                    var skill = Skills[skillNames[i]];
                    var level = 0;
                    if (this.skills[skill.name] != null) {level = this.skills[skill.name];}
                    this.postToConsole(skill.name + ": Level " + formatNumber(level, 0));
                }
                this.postToConsole(" ");
                this.postToConsole("Effects: ");
                var multKeys = Object.keys(this.skillMultipliers);
                for (var i = 0; i < multKeys.length; ++i) {
                    var mult = this.skillMultipliers[multKeys[i]];
                    if (mult && mult !== 1) {
                        mult = formatNumber(mult, 3);
                        switch(multKeys[i]) {
                            case "successChanceAll":
                                this.postToConsole("Total Success Chance: x" + mult);
                                break;
                            case "successChanceStealth":
                                this.postToConsole("Stealth Success Chance: x" + mult);
                                break;
                            case "successChanceKill":
                                this.postToConsole("Retirement Success Chance: x" + mult);
                                break;
                            case "successChanceContract":
                                this.postToConsole("Contract Success Chance: x" + mult);
                                break;
                            case "successChanceOperation":
                                this.postToConsole("Operation Success Chance: x" + mult);
                                break;
                            case "successChanceEstimate":
                                this.postToConsole("Synthoid Data Estimate: x" + mult);
                                break;
                            case "actionTime":
                                this.postToConsole("Action Time: x" + mult);
                                break;
                            case "effHack":
                                this.postToConsole("Hacking Skill: x" + mult);
                                break;
                            case "effStr":
                                this.postToConsole("Strength: x" + mult);
                                break;
                            case "effDef":
                                this.postToConsole("Defense: x" + mult);
                                break;
                            case "effDex":
                                this.postToConsole("Dexterity: x" + mult);
                                break;
                            case "effAgi":
                                this.postToConsole("Agility: x" + mult);
                                break;
                            case "effCha":
                                this.postToConsole("Charisma: x" + mult);
                                break;
                            case "effInt":
                                this.postToConsole("Intelligence: x" + mult);
                                break;
                            case "stamina":
                                this.postToConsole("Stamina: x" + mult);
                                break;
                            default:
                                console.warn(`Unrecognized SkillMult Key: ${multKeys[i]}`);
                                break;
                        }
                    }
                }
            } else {
                this.postToConsole("Invalid usage of 'skill' console command: skill [action] [name]");
                this.postToConsole("Use 'help skill' for more info");
            }
            break;
        case 3:
            var skillName = args[2];
            var skill = Skills[skillName];
            if (skill == null || !(skill instanceof Skill)) {
                return this.postToConsole("Invalid skill name (Note that this is case-sensitive): " + skillName);
            }
            if (args[1].toLowerCase() === "list") {
                let level = 0;
                if (this.skills[skill.name] !== undefined) {
                    level = this.skills[skill.name];
                }
                this.postToConsole(skill.name + ": Level " + formatNumber(level), 0);
            } else if (args[1].toLowerCase() === "level") {
                var currentLevel = 0;
                if (this.skills[skillName] && !isNaN(this.skills[skillName])) {
                    currentLevel = this.skills[skillName];
                }
                var pointCost = skill.calculateCost(currentLevel);
                if (this.skillPoints >= pointCost) {
                    this.skillPoints -= pointCost;
                    this.upgradeSkill(skill);
                    this.log(skill.name + " upgraded to Level " + this.skills[skillName]);
                    this.createActionAndSkillsContent();
                } else {
                    this.postToConsole("You do not have enough Skill Points to upgrade this. You need " + formatNumber(pointCost, 0));
                }

            } else {
                this.postToConsole("Invalid usage of 'skill' console command: skill [action] [name]");
                this.postToConsole("Use 'help skill' for more info");
            }
            break;
        default:
            this.postToConsole("Invalid usage of 'skill' console command: skill [action] [name]");
            this.postToConsole("Use 'help skill' for more info");
            break;
    }
}

Bladeburner.prototype.executeStartConsoleCommand = function(args) {
    if (args.length !== 3) {
        this.postToConsole("Invalid usage of 'start' console command: start [type] [name]");
        this.postToConsole("Use 'help start' for more info");
        return;
    }
    var name = args[2];
    switch (args[1].toLowerCase()) {
        case "general":
        case "gen":
            if (GeneralActions[name] != null) {
                this.action.type = ActionTypes[name];
                this.action.name = name;
                this.startAction(this.action);
            } else {
                this.postToConsole("Invalid action name specified: " + args[2]);
            }
            break;
        case "contract":
        case "contracts":
            if (this.contracts[name] != null) {
                this.action.type = ActionTypes.Contract;
                this.action.name = name;
                this.startAction(this.action);
            } else {
                this.postToConsole("Invalid contract name specified: " + args[2]);
            }
            break;
        case "ops":
        case "op":
        case "operations":
        case "operation":
            if (this.operations[name] != null) {
                this.action.type = ActionTypes.Operation;
                this.action.name = name;
                this.startAction(this.action);
            } else {
                this.postToConsole("Invalid Operation name specified: " + args[2]);
            }
            break;
        case "blackops":
        case "blackop":
        case "black operations":
        case "black operation":
            if (BlackOperations[name] != null) {
                this.action.type = ActionTypes.BlackOperation;
                this.action.name = name;
                this.startAction(this.action);
            } else {
                this.postToConsole("Invalid BlackOp name specified: " + args[2]);
            }
            break;
        default:
            this.postToConsole("Invalid action/event type specified: " + args[1]);
            this.postToConsole("Examples of valid action/event identifiers are: [general, contract, op, blackop]");
            break;
    }
}

Bladeburner.prototype.getActionIdFromTypeAndName = function(type="", name="") {
    if (type === "" || name === "") {return null;}
    var action = new ActionIdentifier();
    var convertedType = type.toLowerCase().trim();
    var convertedName = name.toLowerCase().trim();
    switch (convertedType) {
        case "contract":
        case "contracts":
        case "contr":
            action.type = ActionTypes["Contract"];
            if (this.contracts.hasOwnProperty(name)) {
                action.name = name;
                return action;
            } else {
                return null;
            }
            break;
        case "operation":
        case "operations":
        case "op":
        case "ops":
            action.type = ActionTypes["Operation"];
            if (this.operations.hasOwnProperty(name)) {
                action.name = name;
                return action;
            } else {
                return null;
            }
            break;
        case "blackoperation":
        case "black operation":
        case "black operations":
        case "black op":
        case "black ops":
        case "blackop":
        case "blackops":
            action.type = ActionTypes["BlackOp"];
            if (BlackOperations.hasOwnProperty(name)) {
                action.name = name;
                return action;
            } else {
                return null;
            }
            break;
        case "general":
        case "general action":
        case "gen":
            break;
        default:
            return null;
    }

    if (convertedType.startsWith("gen")) {
        switch (convertedName) {
            case "training":
                action.type = ActionTypes["Training"];
                action.name = "Training";
                break;
            case "recruitment":
            case "recruit":
                action.type = ActionTypes["Recruitment"];
                action.name = "Recruitment";
                break;
            case "field analysis":
            case "fieldanalysis":
                action.type = ActionTypes["Field Analysis"];
                action.name = "Field Analysis";
                break;
            case "diplomacy":
                action.type = ActionTypes["Diplomacy"];
                action.name = "Diplomacy";
                break;
            case "hyperbolic regeneration chamber":
                action.type = ActionTypes["Hyperbolic Regeneration Chamber"];
                action.name = "Hyperbolic Regeneration Chamber";
                break;
            default:
                return null;
        }
        return action;
    }
}

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
    const actionId = this.getActionIdFromTypeAndName(type, name);
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
    const actionId = this.getActionIdFromTypeAndName(type, name);
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
            return this.getRecruitmentTime();
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
    const actionId = this.getActionIdFromTypeAndName(type, name);
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
            return this.getRecruitmentSuccessChance();
        default:
            workerScript.log("bladeburner.getActionEstimatedSuccessChance", errorLogText);
            return -1;
    }
}

Bladeburner.prototype.getActionCountRemainingNetscriptFn = function(type, name, workerScript) {
    const errorLogText = `Invalid action: type='${type}' name='${name}'`;
    const actionId = this.getActionIdFromTypeAndName(type, name);
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
    if (routing.isOn(Page.Bladeburner) && DomElems.currentTab.toLowerCase() === "skills") {
        this.createActionAndSkillsContent();
    }
    workerScript.log("bladeburner.upgradeSkill", `'${skillName}' upgraded to level ${this.skills[skillName]}`);
    return true;
}

Bladeburner.prototype.getTeamSizeNetscriptFn = function(type, name, workerScript) {
    if (type === "" && name === "") {
        return this.teamSize;
    }

    const errorLogText = `Invalid action: type='${type}' name='${name}'`;
    const actionId = this.getActionIdFromTypeAndName(type, name);
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
    const actionId = this.getActionIdFromTypeAndName(type, name);
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
        if (routing.isOn(Page.Bladeburner)) {
            removeChildrenFromElement(DomElems.overviewDiv);
            this.createOverviewContent();
        }
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
