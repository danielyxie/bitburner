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
    calculateStaminaGainPerSecond,
    calculateMaxStamina,
    create,
    prestige,
    storeCycles,
    getCurrentCity,
    upgradeSkill,
    postToConsole,
    log,
    calculateStaminaPenalty,
    getTypeAndNameFromActionId,
    getContractNamesNetscriptFn,
    getOperationNamesNetscriptFn,
    getBlackOpNamesNetscriptFn,
    getGeneralActionNamesNetscriptFn,
    getSkillNamesNetscriptFn,
    startActionNetscriptFn,
    getActionTimeNetscriptFn,
    getActionEstimatedSuccessChanceNetscriptFn,
    getActionCountRemainingNetscriptFn,
    getSkillLevelNetscriptFn,
    getSkillUpgradeCostNetscriptFn,
    upgradeSkillNetscriptFn,
    getTeamSizeNetscriptFn,
    setTeamSizeNetscriptFn,
    joinBladeburnerFactionNetscriptFn,
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
    calculateMaxStamina(this, Player);
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
    if (params.new) create(this);
}

Bladeburner.prototype.prestige = function() { prestige(this); }
Bladeburner.prototype.storeCycles = function(numCycles=1) { storeCycles(this, numCycles); }
Bladeburner.prototype.calculateStaminaPenalty = function() { return calculateStaminaPenalty(this); }
Bladeburner.prototype.getCurrentCity = function() { return getCurrentCity(this); }
Bladeburner.prototype.upgradeSkill = function(skill) { upgradeSkill(this, skill); }
// Bladeburner Console Window
Bladeburner.prototype.postToConsole = function(input, saveToLogs=true) { postToConsole(this, input, saveToLogs); }
Bladeburner.prototype.log = function(input) { log(this, input); }
// Handles a potential series of commands (comm1; comm2; comm3;)
Bladeburner.prototype.executeConsoleCommands = function(commands) { executeConsoleCommands(this, Player, commands); }

////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// Netscript Fns /////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

Bladeburner.prototype.getTypeAndNameFromActionId = function(actionId) { getTypeAndNameFromActionId(this, actionId); }
Bladeburner.prototype.getContractNamesNetscriptFn = function() { getContractNamesNetscriptFn(this); }
Bladeburner.prototype.getOperationNamesNetscriptFn = function() { getOperationNamesNetscriptFn(this); }
Bladeburner.prototype.getBlackOpNamesNetscriptFn = function() { getBlackOpNamesNetscriptFn(this); }
Bladeburner.prototype.getGeneralActionNamesNetscriptFn = function() { getGeneralActionNamesNetscriptFn(this); }
Bladeburner.prototype.getSkillNamesNetscriptFn = function() { getSkillNamesNetscriptFn(this); }
Bladeburner.prototype.startActionNetscriptFn = function(type, name, workerScript) { startActionNetscriptFn(this, Player, type, name, workerScript); }
Bladeburner.prototype.getActionTimeNetscriptFn = function(type, name, workerScript) { getActionTimeNetscriptFn(this, Player, type, name, workerScript); }
Bladeburner.prototype.getActionEstimatedSuccessChanceNetscriptFn = function(type, name, workerScript) { getActionEstimatedSuccessChanceNetscriptFn(this, Player, type, name, workerScript); }
Bladeburner.prototype.getActionCountRemainingNetscriptFn = function(type, name, workerScript) { getActionCountRemainingNetscriptFn(this, Player, type, name, workerScript); }
Bladeburner.prototype.getSkillLevelNetscriptFn = function(skillName, workerScript) { getSkillLevelNetscriptFn(this, skillName, workerScript); }
Bladeburner.prototype.getSkillUpgradeCostNetscriptFn = function(skillName, workerScript) { getSkillUpgradeCostNetscriptFn(this, skillName, workerScript); }
Bladeburner.prototype.upgradeSkillNetscriptFn = function(skillName, workerScript) { upgradeSkillNetscriptFn(this, skillName, workerScript); }
Bladeburner.prototype.getTeamSizeNetscriptFn = function(type, name, workerScript) { getTeamSizeNetscriptFn(this, type, name, workerScript); }
Bladeburner.prototype.setTeamSizeNetscriptFn = function(type, name, size, workerScript) { setTeamSizeNetscriptFn(this, type, name, size, workerScript); }
Bladeburner.prototype.joinBladeburnerFactionNetscriptFn = function(workerScript) { joinBladeburnerFactionNetscriptFn(this, workerScript); }

Bladeburner.prototype.toJSON = function() {
    return Generic_toJSON("Bladeburner", this);
}
Bladeburner.fromJSON = function(value) {
    return Generic_fromJSON(Bladeburner, value.data);
}
Reviver.constructors.Bladeburner = Bladeburner;

export { Bladeburner };
