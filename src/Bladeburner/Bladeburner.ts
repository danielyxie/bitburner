/*
    Here we have a bunch of functions converted to typescript, eventually they
    will go back into a Bladeburner class.
*/
import { IBladeburner } from "./IBladeburner";
import { IActionIdentifier } from "./IActionIdentifier";
import { ActionIdentifier } from "./ActionIdentifier";
import { ActionTypes } from "./data/ActionTypes";
import { BlackOperations } from "./BlackOperations";
import { BlackOperation } from "./BlackOperation";
import { Operation } from "./Operation";
import { Contract } from "./Contract";
import { GeneralActions } from "./GeneralActions";
import { formatNumber } from "../../utils/StringHelperFunctions";
import { Skills } from "./Skills";
import { Skill } from "./Skill";
import { City } from "./City";
import { IAction } from "./IAction";
import { IPlayer } from "../PersonObjects/IPlayer";
import { ConsoleHelpText } from "./data/Help";
import { exceptionAlert } from "../../utils/helpers/exceptionAlert";
import { getRandomInt } from "../../utils/helpers/getRandomInt";
import { BladeburnerConstants } from "./data/Constants";
import { numeralWrapper } from "../ui/numeralFormat";
import { BitNodeMultipliers } from "../BitNode/BitNodeMultipliers";
import { addOffset } from "../../utils/helpers/addOffset";
import { Faction } from "../Faction/Faction";
import { Factions, factionExists } from "../Faction/Factions";
import { calculateHospitalizationCost } from "../Hospital/Hospital";
import { hackWorldDaemon, redPillFlag } from "../RedPill";
import { dialogBoxCreate } from "../../utils/DialogBox";
import { Settings } from "../Settings/Settings";
import { Augmentations } from "../Augmentation/Augmentations";
import { AugmentationNames } from "../Augmentation/data/AugmentationNames";
import { getTimestamp } from "../../utils/helpers/getTimestamp";
import { joinFaction } from "../Faction/FactionHelpers";
import { WorkerScript } from "../Netscript/WorkerScript";

export function getActionIdFromTypeAndName(bladeburner: IBladeburner, type: string = "", name: string = ""): IActionIdentifier | null {
    if (type === "" || name === "") {return null;}
    const action = new ActionIdentifier();
    const convertedType = type.toLowerCase().trim();
    const convertedName = name.toLowerCase().trim();
    switch (convertedType) {
        case "contract":
        case "contracts":
        case "contr":
            action.type = ActionTypes["Contract"];
            if (bladeburner.contracts.hasOwnProperty(name)) {
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
            if (bladeburner.operations.hasOwnProperty(name)) {
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

    return null;
}

export function executeStartConsoleCommand(bladeburner: IBladeburner, player: IPlayer, args: string[]): void {
    if (args.length !== 3) {
        bladeburner.postToConsole("Invalid usage of 'start' console command: start [type] [name]");
        bladeburner.postToConsole("Use 'help start' for more info");
        return;
    }
    const name = args[2];
    switch (args[1].toLowerCase()) {
        case "general":
        case "gen":
            if (GeneralActions[name] != null) {
                bladeburner.action.type = ActionTypes[name];
                bladeburner.action.name = name;
                startAction(bladeburner,player, bladeburner.action);
            } else {
                bladeburner.postToConsole("Invalid action name specified: " + args[2]);
            }
            break;
        case "contract":
        case "contracts":
            if (bladeburner.contracts[name] != null) {
                bladeburner.action.type = ActionTypes.Contract;
                bladeburner.action.name = name;
                startAction(bladeburner,player, bladeburner.action);
            } else {
                bladeburner.postToConsole("Invalid contract name specified: " + args[2]);
            }
            break;
        case "ops":
        case "op":
        case "operations":
        case "operation":
            if (bladeburner.operations[name] != null) {
                bladeburner.action.type = ActionTypes.Operation;
                bladeburner.action.name = name;
                startAction(bladeburner,player, bladeburner.action);
            } else {
                bladeburner.postToConsole("Invalid Operation name specified: " + args[2]);
            }
            break;
        case "blackops":
        case "blackop":
        case "black operations":
        case "black operation":
            if (BlackOperations[name] != null) {
                bladeburner.action.type = ActionTypes.BlackOperation;
                bladeburner.action.name = name;
                startAction(bladeburner,player, bladeburner.action);
            } else {
                bladeburner.postToConsole("Invalid BlackOp name specified: " + args[2]);
            }
            break;
        default:
            bladeburner.postToConsole("Invalid action/event type specified: " + args[1]);
            bladeburner.postToConsole("Examples of valid action/event identifiers are: [general, contract, op, blackop]");
            break;
    }
}

export function executeSkillConsoleCommand(bladeburner: IBladeburner, args: string[]): void {
    switch (args.length) {
        case 1:
            // Display Skill Help Command
            bladeburner.postToConsole("Invalid usage of 'skill' console command: skill [action] [name]");
            bladeburner.postToConsole("Use 'help skill' for more info");
            break;
        case 2:
            if (args[1].toLowerCase() === "list") {
                // List all skills and their level
                bladeburner.postToConsole("Skills: ");
                const skillNames = Object.keys(Skills);
                for(let i = 0; i < skillNames.length; ++i) {
                    let skill = Skills[skillNames[i]];
                    let level = 0;
                    if (bladeburner.skills[skill.name] != null) {level = bladeburner.skills[skill.name];}
                    bladeburner.postToConsole(skill.name + ": Level " + formatNumber(level, 0));
                }
                bladeburner.postToConsole(" ");
                bladeburner.postToConsole("Effects: ");
                const multKeys = Object.keys(bladeburner.skillMultipliers);
                for (let i = 0; i < multKeys.length; ++i) {
                    let mult = bladeburner.skillMultipliers[multKeys[i]];
                    if (mult && mult !== 1) {
                        mult = formatNumber(mult, 3);
                        switch(multKeys[i]) {
                            case "successChanceAll":
                                bladeburner.postToConsole("Total Success Chance: x" + mult);
                                break;
                            case "successChanceStealth":
                                bladeburner.postToConsole("Stealth Success Chance: x" + mult);
                                break;
                            case "successChanceKill":
                                bladeburner.postToConsole("Retirement Success Chance: x" + mult);
                                break;
                            case "successChanceContract":
                                bladeburner.postToConsole("Contract Success Chance: x" + mult);
                                break;
                            case "successChanceOperation":
                                bladeburner.postToConsole("Operation Success Chance: x" + mult);
                                break;
                            case "successChanceEstimate":
                                bladeburner.postToConsole("Synthoid Data Estimate: x" + mult);
                                break;
                            case "actionTime":
                                bladeburner.postToConsole("Action Time: x" + mult);
                                break;
                            case "effHack":
                                bladeburner.postToConsole("Hacking Skill: x" + mult);
                                break;
                            case "effStr":
                                bladeburner.postToConsole("Strength: x" + mult);
                                break;
                            case "effDef":
                                bladeburner.postToConsole("Defense: x" + mult);
                                break;
                            case "effDex":
                                bladeburner.postToConsole("Dexterity: x" + mult);
                                break;
                            case "effAgi":
                                bladeburner.postToConsole("Agility: x" + mult);
                                break;
                            case "effCha":
                                bladeburner.postToConsole("Charisma: x" + mult);
                                break;
                            case "effInt":
                                bladeburner.postToConsole("Intelligence: x" + mult);
                                break;
                            case "stamina":
                                bladeburner.postToConsole("Stamina: x" + mult);
                                break;
                            default:
                                console.warn(`Unrecognized SkillMult Key: ${multKeys[i]}`);
                                break;
                        }
                    }
                }
            } else {
                bladeburner.postToConsole("Invalid usage of 'skill' console command: skill [action] [name]");
                bladeburner.postToConsole("Use 'help skill' for more info");
            }
            break;
        case 3:
            const skillName = args[2];
            const skill = Skills[skillName];
            if (skill == null || !(skill instanceof Skill)) {
                bladeburner.postToConsole("Invalid skill name (Note that it is case-sensitive): " + skillName);
            }
            if (args[1].toLowerCase() === "list") {
                let level = 0;
                if (bladeburner.skills[skill.name] !== undefined) {
                    level = bladeburner.skills[skill.name];
                }
                bladeburner.postToConsole(skill.name + ": Level " + formatNumber(level));
            } else if (args[1].toLowerCase() === "level") {
                let currentLevel = 0;
                if (bladeburner.skills[skillName] && !isNaN(bladeburner.skills[skillName])) {
                    currentLevel = bladeburner.skills[skillName];
                }
                const pointCost = skill.calculateCost(currentLevel);
                if (bladeburner.skillPoints >= pointCost) {
                    bladeburner.skillPoints -= pointCost;
                    bladeburner.upgradeSkill(skill);
                    bladeburner.log(skill.name + " upgraded to Level " + bladeburner.skills[skillName]);
                } else {
                    bladeburner.postToConsole("You do not have enough Skill Points to upgrade bladeburner. You need " + formatNumber(pointCost, 0));
                }

            } else {
                bladeburner.postToConsole("Invalid usage of 'skill' console command: skill [action] [name]");
                bladeburner.postToConsole("Use 'help skill' for more info");
            }
            break;
        default:
            bladeburner.postToConsole("Invalid usage of 'skill' console command: skill [action] [name]");
            bladeburner.postToConsole("Use 'help skill' for more info");
            break;
    }
}


export function executeLogConsoleCommand(bladeburner: IBladeburner, args: string[]): void {
    if (args.length < 3) {
        bladeburner.postToConsole("Invalid usage of log command: log [enable/disable] [action/event]");
        bladeburner.postToConsole("Use 'help log' for more details and examples");
        return;
    }

    let flag = true;
    if (args[1].toLowerCase().includes("d")) {flag = false;} // d for disable

    switch (args[2].toLowerCase()) {
        case "general":
        case "gen":
            bladeburner.logging.general = flag;
            bladeburner.log("Logging " + (flag ? "enabled" : "disabled") + " for general actions");
            break;
        case "contract":
        case "contracts":
            bladeburner.logging.contracts = flag;
            bladeburner.log("Logging " + (flag ? "enabled" : "disabled") + " for Contracts");
            break;
        case "ops":
        case "op":
        case "operations":
        case "operation":
            bladeburner.logging.ops = flag;
            bladeburner.log("Logging " + (flag ? "enabled" : "disabled") + " for Operations");
            break;
        case "blackops":
        case "blackop":
        case "black operations":
        case "black operation":
            bladeburner.logging.blackops = flag;
            bladeburner.log("Logging " + (flag ? "enabled" : "disabled") + " for BlackOps");
            break;
        case "event":
        case "events":
            bladeburner.logging.events = flag;
            bladeburner.log("Logging " + (flag ? "enabled" : "disabled") + " for events");
            break;
        case "all":
            bladeburner.logging.general = flag;
            bladeburner.logging.contracts = flag;
            bladeburner.logging.ops = flag;
            bladeburner.logging.blackops = flag;
            bladeburner.logging.events = flag;
            bladeburner.log("Logging " + (flag ? "enabled" : "disabled") + " for everything");
            break;
        default:
            bladeburner.postToConsole("Invalid action/event type specified: " + args[2]);
            bladeburner.postToConsole("Examples of valid action/event identifiers are: [general, contracts, ops, blackops, events]");
            break;
    }
}

export function executeHelpConsoleCommand(bladeburner: IBladeburner, args: string[]): void {
    if (args.length === 1) {
      for(const line of ConsoleHelpText.helpList){
        bladeburner.postToConsole(line);
      }
    } else {
        for (let i = 1; i < args.length; ++i) {
            if(!(args[i] in ConsoleHelpText)) continue;
            const helpText = ConsoleHelpText[args[i]];
            for(const line of helpText){
                bladeburner.postToConsole(line);
            }
        }
    }
}

export function executeAutomateConsoleCommand(bladeburner: IBladeburner, args: string[]): void {
    if (args.length !== 2 && args.length !== 4) {
        bladeburner.postToConsole("Invalid use of 'automate' command: automate [var] [val] [hi/low]. Use 'help automate' for more info");
        return;
    }

    // Enable/Disable
    if (args.length === 2) {
        const flag = args[1];
        if (flag.toLowerCase() === "status") {
            bladeburner.postToConsole("Automation: " + (bladeburner.automateEnabled ? "enabled" : "disabled"));
            if (bladeburner.automateEnabled) {
                bladeburner.postToConsole("When your stamina drops to " + formatNumber(bladeburner.automateThreshLow, 0) +
                                   ", you will automatically switch to " + bladeburner.automateActionLow.name +
                                   ". When your stamina recovers to " +
                                   formatNumber(bladeburner.automateThreshHigh, 0) + ", you will automatically " +
                                   "switch to " + bladeburner.automateActionHigh.name + ".");
            }

        } else if (flag.toLowerCase().includes("en")) {
            if (!(bladeburner.automateActionLow instanceof ActionIdentifier) ||
                !(bladeburner.automateActionHigh instanceof ActionIdentifier)) {
                return bladeburner.log("Failed to enable automation. Actions were not set");
            }
            bladeburner.automateEnabled = true;
            bladeburner.log("Bladeburner automation enabled");
        } else if (flag.toLowerCase().includes("d")) {
            bladeburner.automateEnabled = false;
            bladeburner.log("Bladeburner automation disabled");
        } else {
            bladeburner.log("Invalid argument for 'automate' console command: " + args[1]);
        }
        return;
    }

    // Set variables
    if (args.length === 4) {
        const variable = args[1];
        const val = args[2];

        let highLow = false; // True for high, false for low
        if (args[3].toLowerCase().includes("hi")) {highLow = true;}

        switch (variable) {
            case "general":
            case "gen":
                if (GeneralActions[val] != null) {
                    const action = new ActionIdentifier({
                        type:ActionTypes[val], name:val,
                    });
                    if (highLow) {
                        bladeburner.automateActionHigh = action;
                    } else {
                        bladeburner.automateActionLow = action;
                    }
                    bladeburner.log("Automate (" + (highLow ? "HIGH" : "LOW") + ") action set to " + val);
                } else {
                    bladeburner.postToConsole("Invalid action name specified: " + val);
                }
                break;
            case "contract":
            case "contracts":
                if (bladeburner.contracts[val] != null) {
                    const action = new ActionIdentifier({
                        type:ActionTypes.Contract, name:val,
                    });
                    if (highLow) {
                        bladeburner.automateActionHigh = action;
                    } else {
                        bladeburner.automateActionLow = action;
                    }
                    bladeburner.log("Automate (" + (highLow ? "HIGH" : "LOW") + ") action set to " + val);
                } else {
                    bladeburner.postToConsole("Invalid contract name specified: " + val);
                }
                break;
            case "ops":
            case "op":
            case "operations":
            case "operation":
                if (bladeburner.operations[val] != null) {
                    const action = new ActionIdentifier({
                        type:ActionTypes.Operation, name:val,
                    });
                    if (highLow) {
                        bladeburner.automateActionHigh = action;
                    } else {
                        bladeburner.automateActionLow = action;
                    }
                    bladeburner.log("Automate (" + (highLow ? "HIGH" : "LOW") + ") action set to " + val);
                } else {
                    bladeburner.postToConsole("Invalid Operation name specified: " + val);
                }
                break;
            case "stamina":
                if (isNaN(parseFloat(val))) {
                    bladeburner.postToConsole("Invalid value specified for stamina threshold (must be numeric): " + val);
                } else {
                    if (highLow) {
                        bladeburner.automateThreshHigh = Number(val);
                    } else {
                        bladeburner.automateThreshLow = Number(val);
                    }
                    bladeburner.log("Automate (" + (highLow ? "HIGH" : "LOW") + ") stamina threshold set to " + val);
                }
                break;
            default:
                break;
        }

        return;
    }
}

export function parseCommandArguments(command: string): string[] {
    /**
     * Returns an array with command and its arguments in each index.
     * e.g. skill "blade's intuition" foo returns [skill, blade's intuition, foo]
     * The input to the fn will be trimmed and will have all whitespace replaced w/ a single space
     */
    const args = [];
    let start = 0;
    let i = 0;
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

export function executeConsoleCommand(bladeburner: IBladeburner, player: IPlayer, command: string) {
    command = command.trim();
    command = command.replace(/\s\s+/g, ' '); // Replace all whitespace w/ a single space

    const args = parseCommandArguments(command);
    if (args.length <= 0) return; // Log an error?

    switch(args[0].toLowerCase()) {
        case "automate":
            executeAutomateConsoleCommand(bladeburner, args);
            break;
        case "clear":
        case "cls":
            clearConsole(bladeburner);
            break;
        case "help":
            executeHelpConsoleCommand(bladeburner, args);
            break;
        case "log":
            executeLogConsoleCommand(bladeburner, args);
            break;
        case "skill":
            executeSkillConsoleCommand(bladeburner, args);
            break;
        case "start":
            executeStartConsoleCommand(bladeburner, player, args);
            break;
        case "stop":
            resetAction(bladeburner);
            break;
        default:
            bladeburner.postToConsole("Invalid console command");
            break;
    }
}

// Handles a potential series of commands (comm1; comm2; comm3;)
export function executeConsoleCommands(bladeburner: IBladeburner, player: IPlayer, commands: string): void {
    try {
        // Console History
        if (bladeburner.consoleHistory[bladeburner.consoleHistory.length-1] != commands) {
            bladeburner.consoleHistory.push(commands);
            if (bladeburner.consoleHistory.length > 50) {
                bladeburner.consoleHistory.splice(0, 1);
            }
        }

        const arrayOfCommands = commands.split(";");
        for (let i = 0; i < arrayOfCommands.length; ++i) {
            executeConsoleCommand(bladeburner, player, arrayOfCommands[i]);
        }
    } catch(e) {
        exceptionAlert(e);
    }
}

export function clearConsole(bladeburner: IBladeburner): void {
    bladeburner.consoleLogs.length = 0;
}

export function triggerMigration(bladeburner: IBladeburner, sourceCityName: string): void {
    let destCityName = BladeburnerConstants.CityNames[getRandomInt(0, 5)];
    while (destCityName === sourceCityName) {
        destCityName = BladeburnerConstants.CityNames[getRandomInt(0, 5)];
    }
    const destCity    = bladeburner.cities[destCityName];
    const sourceCity  = bladeburner.cities[sourceCityName];
    if (destCity == null || sourceCity == null) {
        throw new Error("Failed to find City with name: " + destCityName);
    }
    const rand = Math.random();
    let percentage = getRandomInt(3, 15) / 100;

    if (rand < 0.05 && sourceCity.comms > 0) { // 5% chance for community migration
        percentage *= getRandomInt(2, 4); // Migration increases population change
        --sourceCity.comms;
        ++destCity.comms;
    }
    const count = Math.round(sourceCity.pop * percentage);
    sourceCity.pop -= count;
    destCity.pop += count;
}

export function triggerPotentialMigration(bladeburner: IBladeburner, sourceCityName: string, chance: number): void {
    if (chance == null || isNaN(chance)) {
        console.error("Invalid 'chance' parameter passed into Bladeburner.triggerPotentialMigration()");
    }
    if (chance > 1) {chance /= 100;}
    if (Math.random() < chance) {triggerMigration(bladeburner, sourceCityName);}
}

export function randomEvent(bladeburner: IBladeburner): void {
    const chance = Math.random();

    // Choose random source/destination city for events
    const sourceCityName = BladeburnerConstants.CityNames[getRandomInt(0, 5)];
    const sourceCity = bladeburner.cities[sourceCityName];
    if (!(sourceCity instanceof City)) {
        throw new Error("sourceCity was not a City object in Bladeburner.randomEvent()");
    }

    let destCityName = BladeburnerConstants.CityNames[getRandomInt(0, 5)];
    while (destCityName === sourceCityName) {
        destCityName = BladeburnerConstants.CityNames[getRandomInt(0, 5)];
    }
    const destCity = bladeburner.cities[destCityName];

    if (!(sourceCity instanceof City) || !(destCity instanceof City)) {
        throw new Error("sourceCity/destCity was not a City object in Bladeburner.randomEvent()");
    }

    if (chance <= 0.05) {
        // New Synthoid Community, 5%
        ++sourceCity.comms;
        const percentage = getRandomInt(10, 20) / 100;
        const count = Math.round(sourceCity.pop * percentage);
        sourceCity.pop += count;
        if (bladeburner.logging.events) {
            bladeburner.log("Intelligence indicates that a new Synthoid community was formed in a city");
        }
    } else if (chance <= 0.1) {
        // Synthoid Community Migration, 5%
        if (sourceCity.comms <= 0) {
            // If no comms in source city, then instead trigger a new Synthoid community event
            ++sourceCity.comms;
            const percentage = getRandomInt(10, 20) / 100;
            const count = Math.round(sourceCity.pop * percentage);
            sourceCity.pop += count;
            if (bladeburner.logging.events) {
                bladeburner.log("Intelligence indicates that a new Synthoid community was formed in a city");
            }
        } else {
            --sourceCity.comms;
            ++destCity.comms;

            // Change pop
            const percentage = getRandomInt(10, 20) / 100;
            const count = Math.round(sourceCity.pop * percentage);
            sourceCity.pop -= count;
            destCity.pop += count;

            if (bladeburner.logging.events) {
                bladeburner.log("Intelligence indicates that a Synthoid community migrated from " + sourceCityName + " to some other city");
            }
        }
    } else if  (chance <= 0.3) {
        // New Synthoids (non community), 20%
        const percentage = getRandomInt(8, 24) / 100;
        const count = Math.round(sourceCity.pop * percentage);
        sourceCity.pop += count;
        if (bladeburner.logging.events) {
            bladeburner.log("Intelligence indicates that the Synthoid population of " + sourceCityName + " just changed significantly");
        }
    } else if (chance <= 0.5) {
        // Synthoid migration (non community) 20%
        triggerMigration(bladeburner, sourceCityName);
        if (bladeburner.logging.events) {
            bladeburner.log("Intelligence indicates that a large number of Synthoids migrated from " + sourceCityName + " to some other city");
        }
    } else if (chance <= 0.7) {
        // Synthoid Riots (+chaos), 20%
        sourceCity.chaos += 1;
        sourceCity.chaos *= (1 + getRandomInt(5, 20) / 100);
        if (bladeburner.logging.events) {
            bladeburner.log("Tensions between Synthoids and humans lead to riots in " + sourceCityName + "! Chaos increased");
        }
    } else if (chance <= 0.9) {
        // Less Synthoids, 20%
        const percentage = getRandomInt(8, 20) / 100;
        const count = Math.round(sourceCity.pop * percentage);
        sourceCity.pop -= count;
        if (bladeburner.logging.events) {
            bladeburner.log("Intelligence indicates that the Synthoid population of " + sourceCityName + " just changed significantly");
        }
    }
    // 10% chance of nothing happening
}


/**
 * Process stat gains from Contracts, Operations, and Black Operations
 * @param action(Action obj) - Derived action class
 * @param success(bool) - Whether action was successful
 */
export function gainActionStats(bladeburner: IBladeburner, player: IPlayer, action: IAction, success: boolean): void {
    const difficulty = action.getDifficulty();

    /**
     * Gain multiplier based on difficulty. If it changes then the
     * same variable calculated in completeAction() needs to change too
     */
    const difficultyMult = Math.pow(difficulty, BladeburnerConstants.DiffMultExponentialFactor) + difficulty / BladeburnerConstants.DiffMultLinearFactor;

    const time = bladeburner.actionTimeToComplete;
    const successMult = success ? 1 : 0.5;

    const unweightedGain = time * BladeburnerConstants.BaseStatGain * successMult * difficultyMult;
    const unweightedIntGain = time * BladeburnerConstants.BaseIntGain * successMult * difficultyMult;
    const skillMult = bladeburner.skillMultipliers.expGain;
    player.gainHackingExp(unweightedGain    * action.weights.hack * player.hacking_exp_mult * skillMult);
    player.gainStrengthExp(unweightedGain   * action.weights.str  * player.strength_exp_mult * skillMult);
    player.gainDefenseExp(unweightedGain    * action.weights.def  * player.defense_exp_mult * skillMult);
    player.gainDexterityExp(unweightedGain  * action.weights.dex  * player.dexterity_exp_mult * skillMult);
    player.gainAgilityExp(unweightedGain    * action.weights.agi  * player.agility_exp_mult * skillMult);
    player.gainCharismaExp(unweightedGain   * action.weights.cha  * player.charisma_exp_mult * skillMult);
    let intExp = unweightedIntGain * action.weights.int * skillMult;
    if (intExp > 1) {
        intExp = Math.pow(intExp, 0.8);
    }
    player.gainIntelligenceExp(intExp);
}

export function getDiplomacyEffectiveness(bladeburner: IBladeburner, player: IPlayer): number {
    // Returns a decimal by which the city's chaos level should be multiplied (e.g. 0.98)
    const CharismaLinearFactor = 1e3;
    const CharismaExponentialFactor = 0.045;

    const charismaEff = Math.pow(player.charisma, CharismaExponentialFactor) + player.charisma / CharismaLinearFactor;
    return (100 - charismaEff) / 100;
}

export function getRecruitmentSuccessChance(bladeburner: IBladeburner, player: IPlayer): number {
    return Math.pow(player.charisma, 0.45) / (bladeburner.teamSize + 1);
}

export function getRecruitmentTime(bladeburner: IBladeburner, player: IPlayer): number {
    const effCharisma = player.charisma * bladeburner.skillMultipliers.effCha;
    const charismaFactor = Math.pow(effCharisma, 0.81) + effCharisma / 90;
    return Math.max(10, Math.round(BladeburnerConstants.BaseRecruitmentTimeNeeded - charismaFactor));
}

export function resetSkillMultipliers(bladeburner: IBladeburner): void {
    bladeburner.skillMultipliers = {
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

export function updateSkillMultipliers(bladeburner: IBladeburner): void {
    resetSkillMultipliers(bladeburner);
    for (const skillName in bladeburner.skills) {
        if (bladeburner.skills.hasOwnProperty(skillName)) {
            const skill = Skills[skillName];
            if (skill == null) {
                throw new Error("Could not find Skill Object for: " + skillName);
            }
            const level = bladeburner.skills[skillName];
            if (level == null || level <= 0) {continue;} //Not upgraded

            const multiplierNames = Object.keys(bladeburner.skillMultipliers);
            for (let i = 0; i < multiplierNames.length; ++i) {
                const multiplierName = multiplierNames[i];
                if (skill.getMultiplier(multiplierName) != null && !isNaN(skill.getMultiplier(multiplierName))) {
                    const value = skill.getMultiplier(multiplierName) * level;
                    let multiplierValue = 1 + (value / 100);
                    if (multiplierName === "actionTime") {
                        multiplierValue = 1 - (value / 100);
                    }
                    bladeburner.skillMultipliers[multiplierName] *= multiplierValue;
                }
            }
        }
    }
}


// Sets the player to the "IDLE" action
export function resetAction(bladeburner: IBladeburner): void {
    bladeburner.action = new ActionIdentifier({type:ActionTypes.Idle});
}

export function completeOperation(bladeburner: IBladeburner, success: boolean): void {
    if (bladeburner.action.type !== ActionTypes.Operation) {
        throw new Error("completeOperation() called even though current action is not an Operation");
    }
    const action = getActionObject(bladeburner, bladeburner.action);
    if (action == null) {
        throw new Error("Failed to get Contract/Operation Object for: " + bladeburner.action.name);
    }

    // Calculate team losses
    const teamCount = action.teamCount;
    if (teamCount >= 1) {
        let max;
        if (success) {
            max = Math.ceil(teamCount/2);
        } else {
            max = Math.floor(teamCount)
        }
        const losses = getRandomInt(0, max);
        bladeburner.teamSize -= losses;
        bladeburner.teamLost += losses;
        if (bladeburner.logging.ops && losses > 0) {
            bladeburner.log("Lost " + formatNumber(losses, 0) + " team members during this " + action.name);
        }
    }

    const city = bladeburner.getCurrentCity();
    switch (action.name) {
        case "Investigation":
            if (success) {
                city.improvePopulationEstimateByPercentage(0.4 * bladeburner.skillMultipliers.successChanceEstimate);
                if (Math.random() < (0.02 * bladeburner.skillMultipliers.successChanceEstimate)) {
                    city.improveCommunityEstimate(1);
                }
            } else {
                triggerPotentialMigration(bladeburner, bladeburner.city, 0.1);
            }
            break;
        case "Undercover Operation":
            if (success) {
                city.improvePopulationEstimateByPercentage(0.8 * bladeburner.skillMultipliers.successChanceEstimate);
                if (Math.random() < (0.02 * bladeburner.skillMultipliers.successChanceEstimate)) {
                    city.improveCommunityEstimate(1);
                }
            } else {
                triggerPotentialMigration(bladeburner, bladeburner.city, 0.15);
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
                const change = getRandomInt(-10, -5) / 10;
                city.changePopulationByPercentage(change, {nonZero:true, changeEstEqually:false});
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
                city.changePopulationByCount(-1, {estChange:-1, estOffset: 0});
            }
            city.changeChaosByPercentage(getRandomInt(-5, 5));
            break;
        default:
            throw new Error("Invalid Action name in completeOperation: " + bladeburner.action.name);
    }
}

export function getActionObject(bladeburner: IBladeburner, actionId: IActionIdentifier): IAction | null {
    /**
     * Given an ActionIdentifier object, returns the corresponding
     * GeneralAction, Contract, Operation, or BlackOperation object
     */
    switch (actionId.type) {
        case ActionTypes["Contract"]:
            return bladeburner.contracts[actionId.name];
        case ActionTypes["Operation"]:
            return bladeburner.operations[actionId.name];
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

export function completeContract(bladeburner: IBladeburner, success: boolean): void {
    if (bladeburner.action.type !== ActionTypes.Contract) {
        throw new Error("completeContract() called even though current action is not a Contract");
    }
    var city = bladeburner.getCurrentCity();
    if (success) {
        switch (bladeburner.action.name) {
            case "Tracking":
                // Increase estimate accuracy by a relatively small amount
                city.improvePopulationEstimateByCount(getRandomInt(100, 1e3));
                break;
            case "Bounty Hunter":
                city.changePopulationByCount(-1, {estChange:-1, estOffset: 0});
                city.changeChaosByCount(0.02);
                break;
            case "Retirement":
                city.changePopulationByCount(-1, {estChange:-1, estOffset: 0});
                city.changeChaosByCount(0.04);
                break;
            default:
                throw new Error("Invalid Action name in completeContract: " + bladeburner.action.name);
        }
    }
}

export function completeAction(bladeburner: IBladeburner, player: IPlayer): void {
    switch (bladeburner.action.type) {
        case ActionTypes["Contract"]:
        case ActionTypes["Operation"]: {
            try {
                const isOperation = (bladeburner.action.type === ActionTypes["Operation"]);
                const action = getActionObject(bladeburner, bladeburner.action);
                if (action == null) {
                    throw new Error("Failed to get Contract/Operation Object for: " + bladeburner.action.name);
                }
                const difficulty = action.getDifficulty();
                const difficultyMultiplier = Math.pow(difficulty, BladeburnerConstants.DiffMultExponentialFactor) + difficulty / BladeburnerConstants.DiffMultLinearFactor;
                const rewardMultiplier = Math.pow(action.rewardFac, action.level-1);

                // Stamina loss is based on difficulty
                bladeburner.stamina -= (BladeburnerConstants.BaseStaminaLoss * difficultyMultiplier);
                if (bladeburner.stamina < 0) {bladeburner.stamina = 0;}

                // Process Contract/Operation success/failure
                if (action.attempt(bladeburner)) {
                    gainActionStats(bladeburner, player, action, true);
                    ++action.successes;
                    --action.count;

                    // Earn money for contracts
                    let moneyGain = 0;
                    if (!isOperation) {
                        moneyGain = BladeburnerConstants.ContractBaseMoneyGain * rewardMultiplier * bladeburner.skillMultipliers.money;
                        player.gainMoney(moneyGain);
                        player.recordMoneySource(moneyGain, "bladeburner");
                    }

                    if (isOperation) {
                        action.setMaxLevel(BladeburnerConstants.OperationSuccessesPerLevel);
                    } else {
                        action.setMaxLevel(BladeburnerConstants.ContractSuccessesPerLevel);
                    }
                    if (action.rankGain) {
                        const gain = addOffset(action.rankGain * rewardMultiplier * BitNodeMultipliers.BladeburnerRank, 10);
                        changeRank(bladeburner, player, gain);
                        if (isOperation && bladeburner.logging.ops) {
                            bladeburner.log(action.name + " successfully completed! Gained " + formatNumber(gain, 3) + " rank");
                        } else if (!isOperation && bladeburner.logging.contracts) {
                            bladeburner.log(action.name + " contract successfully completed! Gained " + formatNumber(gain, 3) + " rank and " + numeralWrapper.formatMoney(moneyGain));
                        }
                    }
                    isOperation ? completeOperation(bladeburner, true) : completeContract(bladeburner, true);
                } else {
                    gainActionStats(bladeburner, player, action, false);
                    ++action.failures;
                    let loss = 0, damage = 0;
                    if (action.rankLoss) {
                        loss = addOffset(action.rankLoss * rewardMultiplier, 10);
                        changeRank(bladeburner, player, -1 * loss);
                    }
                    if (action.hpLoss) {
                        damage = action.hpLoss * difficultyMultiplier;
                        damage = Math.ceil(addOffset(damage, 10));
                        bladeburner.hpLost += damage;
                        const cost = calculateHospitalizationCost(player, damage);
                        if (player.takeDamage(damage)) {
                            ++bladeburner.numHosp;
                            bladeburner.moneyLost += cost;
                        }
                    }
                    let logLossText = "";
                    if (loss > 0)   {logLossText += "Lost " + formatNumber(loss, 3) + " rank. ";}
                    if (damage > 0) {logLossText += "Took " + formatNumber(damage, 0) + " damage.";}
                    if (isOperation && bladeburner.logging.ops) {
                        bladeburner.log(action.name + " failed! " + logLossText);
                    } else if (!isOperation && bladeburner.logging.contracts) {
                        bladeburner.log(action.name + " contract failed! " + logLossText);
                    }
                    isOperation ? completeOperation(bladeburner, false) : completeContract(bladeburner, false);
                }
                if (action.autoLevel) {action.level = action.maxLevel;} // Autolevel
                startAction(bladeburner,player, bladeburner.action); // Repeat action
            } catch(e) {
                exceptionAlert(e);
            }
            break;
        }
        case ActionTypes["BlackOp"]:
        case ActionTypes["BlackOperation"]: {
            try {
                const action = getActionObject(bladeburner, bladeburner.action);
                if (action == null || !(action instanceof BlackOperation)) {
                    throw new Error("Failed to get BlackOperation Object for: " + bladeburner.action.name);
                }
                const difficulty = action.getDifficulty();
                const difficultyMultiplier = Math.pow(difficulty, BladeburnerConstants.DiffMultExponentialFactor) + difficulty / BladeburnerConstants.DiffMultLinearFactor;

                // Stamina loss is based on difficulty
                bladeburner.stamina -= (BladeburnerConstants.BaseStaminaLoss * difficultyMultiplier);
                if (bladeburner.stamina < 0) {bladeburner.stamina = 0;}

                // Team loss variables
                const teamCount = action.teamCount;
                let teamLossMax;

                if (action.attempt(bladeburner)) {
                    gainActionStats(bladeburner, player, action, true);
                    action.count = 0;
                    bladeburner.blackops[action.name] = true;
                    let rankGain = 0;
                    if (action.rankGain) {
                        rankGain = addOffset(action.rankGain * BitNodeMultipliers.BladeburnerRank, 10);
                        changeRank(bladeburner, player, rankGain);
                    }
                    teamLossMax = Math.ceil(teamCount/2);

                    // Operation Daedalus
                    if (action.name === "Operation Daedalus") {
                        resetAction(bladeburner);
                        return hackWorldDaemon(player.bitNodeN);
                    }

                    if (bladeburner.logging.blackops) {
                        bladeburner.log(action.name + " successful! Gained " + formatNumber(rankGain, 1) + " rank");
                    }
                } else {
                    gainActionStats(bladeburner, player, action, false);
                    let rankLoss = 0;
                    let damage = 0;
                    if (action.rankLoss) {
                        rankLoss = addOffset(action.rankLoss, 10);
                        changeRank(bladeburner, player, -1 * rankLoss);
                    }
                    if (action.hpLoss) {
                        damage = action.hpLoss * difficultyMultiplier;
                        damage = Math.ceil(addOffset(damage, 10));
                        const cost = calculateHospitalizationCost(player, damage);
                        if (player.takeDamage(damage)) {
                            ++bladeburner.numHosp;
                            bladeburner.moneyLost += cost;
                        }
                    }
                    teamLossMax = Math.floor(teamCount);

                    if (bladeburner.logging.blackops) {
                        bladeburner.log(action.name + " failed! Lost " + formatNumber(rankLoss, 1) + " rank and took " + formatNumber(damage, 0) + " damage");
                    }
                }

                resetAction(bladeburner); // Stop regardless of success or fail

                // Calculate team lossses
                if (teamCount >= 1) {
                    const losses = getRandomInt(1, teamLossMax);
                    bladeburner.teamSize -= losses;
                    bladeburner.teamLost += losses;
                    if (bladeburner.logging.blackops) {
                        bladeburner.log("You lost " + formatNumber(losses, 0) + " team members during " + action.name);
                    }
                }
            } catch(e) {
                exceptionAlert(e);
            }
            break;
        }
        case ActionTypes["Training"]: {
            bladeburner.stamina -= (0.5 * BladeburnerConstants.BaseStaminaLoss);
            const strExpGain = 30 * player.strength_exp_mult,
                defExpGain = 30 * player.defense_exp_mult,
                dexExpGain = 30 * player.dexterity_exp_mult,
                agiExpGain = 30 * player.agility_exp_mult,
                staminaGain = 0.04 * bladeburner.skillMultipliers.stamina;
            player.gainStrengthExp(strExpGain);
            player.gainDefenseExp(defExpGain);
            player.gainDexterityExp(dexExpGain);
            player.gainAgilityExp(agiExpGain);
            bladeburner.staminaBonus += (staminaGain);
            if (bladeburner.logging.general) {
                bladeburner.log("Training completed. Gained: " +
                         formatNumber(strExpGain, 1) + " str exp, " +
                         formatNumber(defExpGain, 1) + " def exp, " +
                         formatNumber(dexExpGain, 1) + " dex exp, " +
                         formatNumber(agiExpGain, 1) + " agi exp, " +
                         formatNumber(staminaGain, 3) + " max stamina");
            }
            startAction(bladeburner,player, bladeburner.action); // Repeat action
            break;
        }
        case ActionTypes["FieldAnalysis"]:
        case ActionTypes["Field Analysis"]: {
            // Does not use stamina. Effectiveness depends on hacking, int, and cha
            let eff = 0.04 * Math.pow(player.hacking_skill, 0.3) +
                      0.04 * Math.pow(player.intelligence, 0.9) +
                      0.02 * Math.pow(player.charisma, 0.3);
            eff *= player.bladeburner_analysis_mult;
            if (isNaN(eff) || eff < 0) {
                throw new Error("Field Analysis Effectiveness calculated to be NaN or negative");
            }
            const hackingExpGain  = 20 * player.hacking_exp_mult,
                charismaExpGain = 20 * player.charisma_exp_mult;
            player.gainHackingExp(hackingExpGain);
            player.gainIntelligenceExp(BladeburnerConstants.BaseIntGain);
            player.gainCharismaExp(charismaExpGain);
            changeRank(bladeburner, player, 0.1 * BitNodeMultipliers.BladeburnerRank);
            bladeburner.getCurrentCity().improvePopulationEstimateByPercentage(eff * bladeburner.skillMultipliers.successChanceEstimate);
            if (bladeburner.logging.general) {
                bladeburner.log("Field analysis completed. Gained 0.1 rank, " + formatNumber(hackingExpGain, 1) + " hacking exp, and " + formatNumber(charismaExpGain, 1) + " charisma exp");
            }
            startAction(bladeburner,player, bladeburner.action); // Repeat action
            break;
        }
        case ActionTypes["Recruitment"]: {
            const successChance = getRecruitmentSuccessChance(bladeburner, player);
            if (Math.random() < successChance) {
                const expGain = 2 * BladeburnerConstants.BaseStatGain * bladeburner.actionTimeToComplete;
                player.gainCharismaExp(expGain);
                ++bladeburner.teamSize;
                if (bladeburner.logging.general) {
                    bladeburner.log("Successfully recruited a team member! Gained " + formatNumber(expGain, 1) + " charisma exp");
                }
            } else {
                const expGain = BladeburnerConstants.BaseStatGain * bladeburner.actionTimeToComplete;
                player.gainCharismaExp(expGain);
                if (bladeburner.logging.general) {
                    bladeburner.log("Failed to recruit a team member. Gained " + formatNumber(expGain, 1) + " charisma exp");
                }
            }
            startAction(bladeburner,player, bladeburner.action); // Repeat action
            break;
        }
        case ActionTypes["Diplomacy"]: {
            let eff = getDiplomacyEffectiveness(bladeburner, player);
            bladeburner.getCurrentCity().chaos *= eff;
            if (bladeburner.getCurrentCity().chaos < 0) { bladeburner.getCurrentCity().chaos = 0; }
            if (bladeburner.logging.general) {
                bladeburner.log(`Diplomacy completed. Chaos levels in the current city fell by ${numeralWrapper.formatPercentage(1 - eff)}`);
            }
            startAction(bladeburner,player, bladeburner.action); // Repeat Action
            break;
        }
        case ActionTypes["Hyperbolic Regeneration Chamber"]: {
            player.regenerateHp(BladeburnerConstants.HrcHpGain);

            const staminaGain = bladeburner.maxStamina * (BladeburnerConstants.HrcStaminaGain / 100);
            bladeburner.stamina = Math.min(bladeburner.maxStamina, bladeburner.stamina + staminaGain);
            startAction(bladeburner,player, bladeburner.action);
            if (bladeburner.logging.general) {
                bladeburner.log(`Rested in Hyperbolic Regeneration Chamber. Restored ${BladeburnerConstants.HrcHpGain} HP and gained ${numeralWrapper.formatStamina(staminaGain)} stamina`);
            }
            break;
        }
        default:
            console.error(`Bladeburner.completeAction() called for invalid action: ${bladeburner.action.type}`);
            break;
    }
}

export function changeRank(bladeburner: IBladeburner, player: IPlayer, change: number): void {
    if (isNaN(change)) {throw new Error("NaN passed into Bladeburner.changeRank()");}
    bladeburner.rank += change;
    if (bladeburner.rank < 0) {bladeburner.rank = 0;}
    bladeburner.maxRank = Math.max(bladeburner.rank, bladeburner.maxRank);

    var bladeburnersFactionName = "Bladeburners";
    if (factionExists(bladeburnersFactionName)) {
        var bladeburnerFac = Factions[bladeburnersFactionName];
        if (!(bladeburnerFac instanceof Faction)) {
            throw new Error("Could not properly get Bladeburner Faction object in Bladeburner UI Overview Faction button");
        }
        if (bladeburnerFac.isMember) {
            var favorBonus = 1 + (bladeburnerFac.favor / 100);
            bladeburnerFac.playerReputation += (BladeburnerConstants.RankToFactionRepFactor * change * player.faction_rep_mult * favorBonus);
        }
    }

    // Gain skill points
    var rankNeededForSp = (bladeburner.totalSkillPoints+1) * BladeburnerConstants.RanksPerSkillPoint;
    if (bladeburner.maxRank >= rankNeededForSp) {
        // Calculate how many skill points to gain
        var gainedSkillPoints = Math.floor((bladeburner.maxRank - rankNeededForSp) / BladeburnerConstants.RanksPerSkillPoint + 1);
        bladeburner.skillPoints += gainedSkillPoints;
        bladeburner.totalSkillPoints += gainedSkillPoints;
    }
}

export function processAction(bladeburner: IBladeburner, player: IPlayer, seconds: number): void {
    if (bladeburner.action.type === ActionTypes["Idle"]) return;
    if (bladeburner.actionTimeToComplete <= 0) {
        throw new Error(`Invalid actionTimeToComplete value: ${bladeburner.actionTimeToComplete}, type; ${bladeburner.action.type}`);
    }
    if (!(bladeburner.action instanceof ActionIdentifier)) {
        throw new Error("Bladeburner.action is not an ActionIdentifier Object");
    }

    // If the previous action went past its completion time, add to the next action
    // This is not added inmediatly in case the automation changes the action
    bladeburner.actionTimeCurrent += seconds + bladeburner.actionTimeOverflow;
    bladeburner.actionTimeOverflow = 0;
    if (bladeburner.actionTimeCurrent >= bladeburner.actionTimeToComplete) {
        bladeburner.actionTimeOverflow = bladeburner.actionTimeCurrent - bladeburner.actionTimeToComplete;
        return completeAction(bladeburner, player);
    }
}

export function startAction(bladeburner: IBladeburner, player: IPlayer, actionId: IActionIdentifier): void {
    if (actionId == null) return;
    bladeburner.action = actionId;
    bladeburner.actionTimeCurrent = 0;
    switch (actionId.type) {
        case ActionTypes["Idle"]:
            bladeburner.actionTimeToComplete = 0;
            break;
        case ActionTypes["Contract"]:
            try {
                const action = getActionObject(bladeburner, actionId);
                if (action == null) {
                    throw new Error("Failed to get Contract Object for: " + actionId.name);
                }
                if (action.count < 1) {return resetAction(bladeburner);}
                bladeburner.actionTimeToComplete = action.getActionTime(bladeburner);
            } catch(e) {
                exceptionAlert(e);
            }
            break;
        case ActionTypes["Operation"]: {
            try {
                const action = getActionObject(bladeburner, actionId);
                if (action == null) {
                    throw new Error ("Failed to get Operation Object for: " + actionId.name);
                }
                if (action.count < 1) {return resetAction(bladeburner);}
                if (actionId.name === "Raid" && bladeburner.getCurrentCity().commsEst === 0) {return resetAction(bladeburner);}
                bladeburner.actionTimeToComplete = action.getActionTime(bladeburner);
            } catch(e) {
                exceptionAlert(e);
            }
            break;
        }
        case ActionTypes["BlackOp"]:
        case ActionTypes["BlackOperation"]: {
            try {
                // Safety measure - don't repeat BlackOps that are already done
                if (bladeburner.blackops[actionId.name] != null) {
                    resetAction(bladeburner);
                    bladeburner.log("Error: Tried to start a Black Operation that had already been completed");
                    break;
                }

                const action = getActionObject(bladeburner, actionId);
                if (action == null) {
                    throw new Error("Failed to get BlackOperation object for: " + actionId.name);
                }
                bladeburner.actionTimeToComplete = action.getActionTime(bladeburner);
            } catch(e) {
                exceptionAlert(e);
            }
            break;
        }
        case ActionTypes["Recruitment"]:
            bladeburner.actionTimeToComplete = getRecruitmentTime(bladeburner, player);
            break;
        case ActionTypes["Training"]:
        case ActionTypes["FieldAnalysis"]:
        case ActionTypes["Field Analysis"]:
            bladeburner.actionTimeToComplete = 30;
            break;
        case ActionTypes["Diplomacy"]:
        case ActionTypes["Hyperbolic Regeneration Chamber"]:
            bladeburner.actionTimeToComplete = 60;
            break;
        default:
            throw new Error("Invalid Action Type in startAction(Bladeburner,player, ): " + actionId.type);
            break;
    }
}

export function calculateStaminaPenalty(bladeburner: IBladeburner): number {
    return Math.min(1, bladeburner.stamina / (0.5 * bladeburner.maxStamina));
}

export function calculateStaminaGainPerSecond(bladeburner: IBladeburner, player: IPlayer): number {
    const effAgility = player.agility * bladeburner.skillMultipliers.effAgi;
    const maxStaminaBonus = bladeburner.maxStamina / BladeburnerConstants.MaxStaminaToGainFactor;
    const gain = (BladeburnerConstants.StaminaGainPerSecond + maxStaminaBonus) * Math.pow(effAgility, 0.17);
    return gain * (bladeburner.skillMultipliers.stamina * player.bladeburner_stamina_gain_mult);
}

export function calculateMaxStamina(bladeburner: IBladeburner, player: IPlayer) {
    const effAgility = player.agility * bladeburner.skillMultipliers.effAgi;
    let maxStamina = (Math.pow(effAgility, 0.8) + bladeburner.staminaBonus) *
      bladeburner.skillMultipliers.stamina *
      player.bladeburner_max_stamina_mult;
    if (bladeburner.maxStamina !== maxStamina) {
      const oldMax = bladeburner.maxStamina;
      bladeburner.maxStamina = maxStamina;
      bladeburner.stamina = bladeburner.maxStamina * bladeburner.stamina / oldMax;
    }
    if (isNaN(maxStamina)) {throw new Error("Max Stamina calculated to be NaN in Bladeburner.calculateMaxStamina()");}
}

export function create(bladeburner: IBladeburner): void {
    bladeburner.contracts["Tracking"] = new Contract({
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
    bladeburner.contracts["Bounty Hunter"] = new Contract({
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
    bladeburner.contracts["Retirement"] = new Contract({
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

    bladeburner.operations["Investigation"] = new Operation({
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
    bladeburner.operations["Undercover Operation"] = new Operation({
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
    bladeburner.operations["Sting Operation"] = new Operation({
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
    bladeburner.operations["Raid"] = new Operation({
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
    bladeburner.operations["Stealth Retirement Operation"] = new Operation({
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
    bladeburner.operations["Assassination"] = new Operation({
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

export function process(bladeburner: IBladeburner, player: IPlayer): void {
    // Edge case condition...if Operation Daedalus is complete trigger the BitNode
    if (redPillFlag === false && bladeburner.blackops.hasOwnProperty("Operation Daedalus")) {
        return hackWorldDaemon(player.bitNodeN);
    }

    // If the Player starts doing some other actions, set action to idle and alert
    if (Augmentations[AugmentationNames.BladesSimulacrum].owned === false && player.isWorking) {
        if (bladeburner.action.type !== ActionTypes["Idle"]) {
            let msg = "Your Bladeburner action was cancelled because you started doing something else.";
            if (bladeburner.automateEnabled) {
                msg += `<br><br>Your automation was disabled as well. You will have to re-enable it through the Bladeburner console`
                bladeburner.automateEnabled = false;
            }
            if (!Settings.SuppressBladeburnerPopup) {
                dialogBoxCreate(msg);
            }
        }
        resetAction(bladeburner);
    }

    // If the Player has no Stamina, set action to idle
    if (bladeburner.stamina <= 0) {
        bladeburner.log("Your Bladeburner action was cancelled because your stamina hit 0");
        resetAction(bladeburner);
    }

    // A 'tick' for this mechanic is one second (= 5 game cycles)
    if (bladeburner.storedCycles >= BladeburnerConstants.CyclesPerSecond) {
        let seconds = Math.floor(bladeburner.storedCycles / BladeburnerConstants.CyclesPerSecond);
        seconds = Math.min(seconds, 5); // Max of 5 'ticks'
        bladeburner.storedCycles -= seconds * BladeburnerConstants.CyclesPerSecond;

        // Stamina
        calculateMaxStamina(bladeburner, player);
        bladeburner.stamina += (calculateStaminaGainPerSecond(bladeburner, player) * seconds);
        bladeburner.stamina = Math.min(bladeburner.maxStamina, bladeburner.stamina);

        // Count increase for contracts/operations
        for (const contract of (Object.values(bladeburner.contracts) as Contract[])) {
            contract.count += (seconds * contract.countGrowth/BladeburnerConstants.ActionCountGrowthPeriod);
        }
        for (const op of (Object.values(bladeburner.operations) as Operation[])) {
            op.count += (seconds * op.countGrowth/BladeburnerConstants.ActionCountGrowthPeriod);
        }

        // Chaos goes down very slowly
        for (const cityName of BladeburnerConstants.CityNames) {
            const city = bladeburner.cities[cityName];
            if (!(city instanceof City)) {throw new Error("Invalid City object when processing passive chaos reduction in Bladeburner.process");}
            city.chaos -= (0.0001 * seconds);
            city.chaos = Math.max(0, city.chaos);
        }

        // Random Events
        bladeburner.randomEventCounter -= seconds;
        if (bladeburner.randomEventCounter <= 0) {
            randomEvent(bladeburner);
            // Add instead of setting because we might have gone over the required time for the event
            bladeburner.randomEventCounter += getRandomInt(240, 600);
        }

        processAction(bladeburner, player, seconds);

        // Automation
        if (bladeburner.automateEnabled) {
            // Note: Do NOT set bladeburner.action = bladeburner.automateActionHigh/Low since it creates a reference
            if (bladeburner.stamina <= bladeburner.automateThreshLow) {
                if (bladeburner.action.name !== bladeburner.automateActionLow.name || bladeburner.action.type !== bladeburner.automateActionLow.type) {
                    bladeburner.action = new ActionIdentifier({type: bladeburner.automateActionLow.type, name: bladeburner.automateActionLow.name});
                    startAction(bladeburner, player, bladeburner.action);
                }
            } else if (bladeburner.stamina >= bladeburner.automateThreshHigh) {
                if (bladeburner.action.name !== bladeburner.automateActionHigh.name || bladeburner.action.type !== bladeburner.automateActionHigh.type) {
                    bladeburner.action = new ActionIdentifier({type: bladeburner.automateActionHigh.type, name: bladeburner.automateActionHigh.name});
                    startAction(bladeburner, player, bladeburner.action);
                }
            }
        }
    }
}








export function prestige(bladeburner: IBladeburner): void {
    resetAction(bladeburner);
    const bladeburnerFac = Factions["Bladeburners"];
    if (bladeburner.rank >= BladeburnerConstants.RankNeededForFaction) {
        joinFaction(bladeburnerFac);
    }
}

export function storeCycles(bladeburner: IBladeburner, numCycles: number = 1): void {
    bladeburner.storedCycles += numCycles;
}

export function getCurrentCity(bladeburner: IBladeburner): City {
    const city = bladeburner.cities[bladeburner.city];
    if (!(city instanceof City)) {
        throw new Error("Bladeburner.getCurrentCity() did not properly return a City object");
    }
    return city;
}

export function upgradeSkill(bladeburner: IBladeburner, skill: Skill) {
    // This does NOT handle deduction of skill points
    const skillName = skill.name;
    if (bladeburner.skills[skillName]) {
        ++bladeburner.skills[skillName];
    } else {
        bladeburner.skills[skillName] = 1;
    }
    if (isNaN(bladeburner.skills[skillName]) || bladeburner.skills[skillName] < 0) {
        throw new Error("Level of Skill " + skillName + " is invalid: " + bladeburner.skills[skillName]);
    }
    updateSkillMultipliers(bladeburner);
}

// Bladeburner Console Window
export function postToConsole(bladeburner: IBladeburner, input: string, saveToLogs: boolean = true) {
    const MaxConsoleEntries = 100;
    if (saveToLogs) {
        bladeburner.consoleLogs.push(input);
        if (bladeburner.consoleLogs.length > MaxConsoleEntries) {
            bladeburner.consoleLogs.shift();
        }
    }
}

export function log(bladeburner: IBladeburner, input: string) {
    // Adds a timestamp and then just calls postToConsole
    bladeburner.postToConsole(`[${getTimestamp()}] ${input}`);
}

////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// Netscript Fns /////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
export function getTypeAndNameFromActionId(bladeburner: IBladeburner, actionId: IActionIdentifier) {
    const res = {type: '', name: ''};
    const types = Object.keys(ActionTypes);
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
export function getContractNamesNetscriptFn(bladeburner: IBladeburner) {
    return Object.keys(bladeburner.contracts);
}
export function getOperationNamesNetscriptFn(bladeburner: IBladeburner) {
    return Object.keys(bladeburner.operations);
}
export function getBlackOpNamesNetscriptFn(bladeburner: IBladeburner) {
    return Object.keys(BlackOperations);
}
export function getGeneralActionNamesNetscriptFn(bladeburner: IBladeburner) {
    return Object.keys(GeneralActions);
}
export function getSkillNamesNetscriptFn(bladeburner: IBladeburner) {
    return Object.keys(Skills);
}
export function startActionNetscriptFn(bladeburner: IBladeburner, player: IPlayer, type: string, name: string, workerScript: WorkerScript) {
  const errorLogText = `Invalid action: type='${type}' name='${name}'`;
    const actionId = getActionIdFromTypeAndName(bladeburner, type, name);
    if (actionId == null) {
        workerScript.log("bladeburner.startAction", errorLogText);
        return false;
    }

    // Special logic for Black Ops
    if (actionId.type === ActionTypes["BlackOp"]) {
        // Can't start a BlackOp if you don't have the required rank
        const action = getActionObject(bladeburner, actionId);
        if(action == null) throw new Error('Action not found ${actionId.type}, ${actionId.name}');
        if(!(action instanceof BlackOperation)) throw new Error(`Action should be BlackOperation but isn't`);
        const blackOp = (action as BlackOperation);
        if (action.reqdRank > bladeburner.rank) {
            workerScript.log("bladeburner.startAction", `Insufficient rank to start Black Op '${actionId.name}'.`);
            return false;
        }

        // Can't start a BlackOp if its already been done
        if (bladeburner.blackops[actionId.name] != null) {
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

        if (i > 0 && bladeburner.blackops[blackops[i-1]] == null) {
            workerScript.log("bladeburner.startAction", `Preceding Black Op must be completed before starting '${actionId.name}'.`);
            return false;
        }
    }

    try {
        startAction(bladeburner, player, actionId);
        workerScript.log("bladeburner.startAction", `Starting bladeburner action with type '${type}' and name ${name}"`);
        return true;
    } catch(e) {
        resetAction(bladeburner);
        workerScript.log("bladeburner.startAction", errorLogText);
        return false;
    }
}
export function getActionTimeNetscriptFn(bladeburner: IBladeburner, player: IPlayer, type: string, name: string, workerScript: WorkerScript) {
  const errorLogText = `Invalid action: type='${type}' name='${name}'`
    const actionId = getActionIdFromTypeAndName(bladeburner, type, name);
    if (actionId == null) {
        workerScript.log("bladeburner.getActionTime", errorLogText);
        return -1;
    }

    const actionObj = getActionObject(bladeburner, actionId);
    if (actionObj == null) {
        workerScript.log("bladeburner.getActionTime", errorLogText);
        return -1;
    }

    switch (actionId.type) {
        case ActionTypes["Contract"]:
        case ActionTypes["Operation"]:
        case ActionTypes["BlackOp"]:
        case ActionTypes["BlackOperation"]:
            return actionObj.getActionTime(bladeburner);
        case ActionTypes["Training"]:
        case ActionTypes["Field Analysis"]:
        case ActionTypes["FieldAnalysis"]:
            return 30;
        case ActionTypes["Recruitment"]:
            return getRecruitmentTime(bladeburner, player);
        case ActionTypes["Diplomacy"]:
        case ActionTypes["Hyperbolic Regeneration Chamber"]:
            return 60;
        default:
            workerScript.log("bladeburner.getActionTime", errorLogText);
            return -1;
    }
}
export function getActionEstimatedSuccessChanceNetscriptFn(bladeburner: IBladeburner, player: IPlayer, type: string, name: string, workerScript: WorkerScript) {
    const errorLogText = `Invalid action: type='${type}' name='${name}'`
    const actionId = getActionIdFromTypeAndName(bladeburner, type, name);
    if (actionId == null) {
        workerScript.log("bladeburner.getActionEstimatedSuccessChance", errorLogText);
        return -1;
    }

    const actionObj = getActionObject(bladeburner, actionId);
    if (actionObj == null) {
        workerScript.log("bladeburner.getActionEstimatedSuccessChance", errorLogText);
        return -1;
    }

    switch (actionId.type) {
        case ActionTypes["Contract"]:
        case ActionTypes["Operation"]:
        case ActionTypes["BlackOp"]:
        case ActionTypes["BlackOperation"]:
            return actionObj.getSuccessChance(bladeburner, {est:true});
        case ActionTypes["Training"]:
        case ActionTypes["Field Analysis"]:
        case ActionTypes["FieldAnalysis"]:
            return 1;
        case ActionTypes["Recruitment"]:
            return getRecruitmentSuccessChance(bladeburner, player);
        default:
            workerScript.log("bladeburner.getActionEstimatedSuccessChance", errorLogText);
            return -1;
    }
}
export function getActionCountRemainingNetscriptFn(bladeburner: IBladeburner, type: string, name: string, workerScript: WorkerScript) {
    const errorLogText = `Invalid action: type='${type}' name='${name}'`;
    const actionId = getActionIdFromTypeAndName(bladeburner, type, name);
    if (actionId == null) {
        workerScript.log("bladeburner.getActionCountRemaining", errorLogText);
        return -1;
    }

    const actionObj = getActionObject(bladeburner, actionId);
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
            if (bladeburner.blackops[name] != null) {
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
export function getSkillLevelNetscriptFn(bladeburner: IBladeburner, skillName: string, workerScript: WorkerScript) {
    if (skillName === "" || !Skills.hasOwnProperty(skillName)) {
        workerScript.log("bladeburner.getSkillLevel", `Invalid skill: '${skillName}'`);
        return -1;
    }

    if (bladeburner.skills[skillName] == null) {
        return 0;
    } else {
        return bladeburner.skills[skillName];
    }
}
export function getSkillUpgradeCostNetscriptFn(bladeburner: IBladeburner, skillName: string, workerScript: WorkerScript) {
    if (skillName === "" || !Skills.hasOwnProperty(skillName)) {
        workerScript.log("bladeburner.getSkillUpgradeCost", `Invalid skill: '${skillName}'`);
        return -1;
    }

    const skill = Skills[skillName];
    if (bladeburner.skills[skillName] == null) {
        return skill.calculateCost(0);
    } else {
        return skill.calculateCost(bladeburner.skills[skillName]);
    }
}
export function upgradeSkillNetscriptFn(bladeburner: IBladeburner, skillName: string, workerScript: WorkerScript) {
    const errorLogText = `Invalid skill: '${skillName}'`;
    if (!Skills.hasOwnProperty(skillName)) {
        workerScript.log("bladeburner.upgradeSkill", errorLogText);
        return false;
    }

    const skill = Skills[skillName];
    let currentLevel = 0;
    if (bladeburner.skills[skillName] && !isNaN(bladeburner.skills[skillName])) {
        currentLevel = bladeburner.skills[skillName];
    }
    const cost = skill.calculateCost(currentLevel);

    if(skill.maxLvl && currentLevel >= skill.maxLvl) {
      workerScript.log("bladeburner.upgradeSkill", `Skill '${skillName}' is already maxed.`);
      return false;
    }

    if (bladeburner.skillPoints < cost) {
        workerScript.log("bladeburner.upgradeSkill", `You do not have enough skill points to upgrade ${skillName} (You have ${bladeburner.skillPoints}, you need ${cost})`);
        return false;
    }

    bladeburner.skillPoints -= cost;
    bladeburner.upgradeSkill(skill);
    workerScript.log("bladeburner.upgradeSkill", `'${skillName}' upgraded to level ${bladeburner.skills[skillName]}`);
    return true;
}
export function getTeamSizeNetscriptFn(bladeburner: IBladeburner, type: string, name: string, workerScript: WorkerScript): number {
    if (type === "" && name === "") {
        return bladeburner.teamSize;
    }

    const errorLogText = `Invalid action: type='${type}' name='${name}'`;
    const actionId = getActionIdFromTypeAndName(bladeburner, type, name);
    if (actionId == null) {
        workerScript.log("bladeburner.getTeamSize", errorLogText);
        return -1;
    }

    const actionObj = getActionObject(bladeburner, actionId);
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
export function setTeamSizeNetscriptFn(bladeburner: IBladeburner, type: string, name: string, size: number, workerScript: WorkerScript): number {
    const errorLogText = `Invalid action: type='${type}' name='${name}'`;
    const actionId = getActionIdFromTypeAndName(bladeburner, type, name);
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

    const actionObj = getActionObject(bladeburner, actionId);
    if (actionObj == null) {
        workerScript.log("bladeburner.setTeamSize", errorLogText);
        return -1;
    }

    let sanitizedSize = Math.round(size);
    if (isNaN(sanitizedSize) || sanitizedSize < 0) {
        workerScript.log("bladeburner.setTeamSize", `Invalid size: ${size}`);
        return -1;
    }
    if (bladeburner.teamSize < sanitizedSize) {sanitizedSize = bladeburner.teamSize;}
    actionObj.teamCount = sanitizedSize;
    workerScript.log("bladeburner.setTeamSize", `Team size for '${name}' set to ${sanitizedSize}.`);
    return sanitizedSize;
}
export function joinBladeburnerFactionNetscriptFn(bladeburner: IBladeburner, workerScript: WorkerScript): boolean {
    var bladeburnerFac = Factions["Bladeburners"];
    if (bladeburnerFac.isMember) {
        return true;
    } else if (bladeburner.rank >= BladeburnerConstants.RankNeededForFaction) {
        joinFaction(bladeburnerFac);
        workerScript.log("bladeburner.joinBladeburnerFaction", "Joined Bladeburners faction.");
        return true;
    } else {
        workerScript.log("bladeburner.joinBladeburnerFaction", `You do not have the required rank (${bladeburner.rank}/${BladeburnerConstants.RankNeededForFaction}).`);
        return false;
    }
}
