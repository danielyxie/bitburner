/*
    Here we have a bunch of functions converted to typescript, eventually they
    will go back into a Bladeburner class.
*/
import { IBladeburner } from "./IBladeburner";
import { IActionIdentifier } from "./IActionIdentifier";
import { ActionIdentifier } from "./ActionIdentifier";
import { ActionTypes } from "./data/ActionTypes";
import { BlackOperations } from "./BlackOperations";
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

export function executeStartConsoleCommand(bladeburner: IBladeburner, args: string[]): void {
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
                bladeburner.startAction(bladeburner.action);
            } else {
                bladeburner.postToConsole("Invalid action name specified: " + args[2]);
            }
            break;
        case "contract":
        case "contracts":
            if (bladeburner.contracts[name] != null) {
                bladeburner.action.type = ActionTypes.Contract;
                bladeburner.action.name = name;
                bladeburner.startAction(bladeburner.action);
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
                bladeburner.startAction(bladeburner.action);
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
                bladeburner.startAction(bladeburner.action);
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

export function executeConsoleCommand(bladeburner: IBladeburner, command: string) {
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
            executeStartConsoleCommand(bladeburner, args);
            break;
        case "stop":
            bladeburner.resetAction();
            break;
        default:
            bladeburner.postToConsole("Invalid console command");
            break;
    }
}

// Handles a potential series of commands (comm1; comm2; comm3;)
export function executeConsoleCommands(bladeburner: IBladeburner, commands: string): void {
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
            executeConsoleCommand(bladeburner, arrayOfCommands[i]);
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
