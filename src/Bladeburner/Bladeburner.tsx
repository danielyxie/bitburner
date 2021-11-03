import { Reviver, Generic_toJSON, Generic_fromJSON } from "../utils/JSONReviver";
import { IBladeburner } from "./IBladeburner";
import { IActionIdentifier } from "./IActionIdentifier";
import { ActionIdentifier } from "./ActionIdentifier";
import { ActionTypes } from "./data/ActionTypes";
import { Growths } from "./data/Growths";
import { BlackOperations } from "./BlackOperations";
import { BlackOperation } from "./BlackOperation";
import { Operation } from "./Operation";
import { Contract } from "./Contract";
import { GeneralActions } from "./GeneralActions";
import { formatNumber } from "../utils/StringHelperFunctions";
import { Skills } from "./Skills";
import { Skill } from "./Skill";
import { City } from "./City";
import { IAction } from "./IAction";
import { IPlayer } from "../PersonObjects/IPlayer";
import { IRouter, Page } from "../ui/Router";
import { ConsoleHelpText } from "./data/Help";
import { exceptionAlert } from "../utils/helpers/exceptionAlert";
import { getRandomInt } from "../utils/helpers/getRandomInt";
import { BladeburnerConstants } from "./data/Constants";
import { numeralWrapper } from "../ui/numeralFormat";
import { BitNodeMultipliers } from "../BitNode/BitNodeMultipliers";
import { addOffset } from "../utils/helpers/addOffset";
import { Faction } from "../Faction/Faction";
import { Factions, factionExists } from "../Faction/Factions";
import { calculateHospitalizationCost } from "../Hospital/Hospital";
import { dialogBoxCreate } from "../ui/React/DialogBox";
import { Settings } from "../Settings/Settings";
import { Augmentations } from "../Augmentation/Augmentations";
import { AugmentationNames } from "../Augmentation/data/AugmentationNames";
import { getTimestamp } from "../utils/helpers/getTimestamp";
import { joinFaction } from "../Faction/FactionHelpers";
import { WorkerScript } from "../Netscript/WorkerScript";

export class Bladeburner implements IBladeburner {
  numHosp = 0;
  moneyLost = 0;
  rank = 0;
  maxRank = 0;

  skillPoints = 0;
  totalSkillPoints = 0;

  teamSize = 0;
  teamLost = 0;
  hpLost = 0;

  storedCycles = 0;

  randomEventCounter: number = getRandomInt(240, 600);

  actionTimeToComplete = 0;
  actionTimeCurrent = 0;
  actionTimeOverflow = 0;

  action: IActionIdentifier = new ActionIdentifier({
    type: ActionTypes["Idle"],
  });

  cities: any = {};
  city: string = BladeburnerConstants.CityNames[2];
  skills: any = {};
  skillMultipliers: any = {};
  staminaBonus = 0;
  maxStamina = 0;
  stamina = 0;
  contracts: any = {};
  operations: any = {};
  blackops: any = {};
  logging: any = {
    general: true,
    contracts: true,
    ops: true,
    blackops: true,
    events: true,
  };
  automateEnabled = false;
  automateActionHigh: IActionIdentifier = new ActionIdentifier({
    type: ActionTypes["Idle"],
  });
  automateThreshHigh = 0;
  automateActionLow: IActionIdentifier = new ActionIdentifier({
    type: ActionTypes["Idle"],
  });
  automateThreshLow = 0;
  consoleHistory: string[] = [];
  consoleLogs: string[] = ["Bladeburner Console", "Type 'help' to see console commands"];

  constructor(player?: IPlayer) {
    for (let i = 0; i < BladeburnerConstants.CityNames.length; ++i) {
      this.cities[BladeburnerConstants.CityNames[i]] = new City(BladeburnerConstants.CityNames[i]);
    }

    this.updateSkillMultipliers(); // Calls resetSkillMultipliers()

    // Max Stamina is based on stats and Bladeburner-specific bonuses
    if (player) this.calculateMaxStamina(player);
    this.stamina = this.maxStamina;
    this.create();
  }

  getCurrentCity(): City {
    const city = this.cities[this.city];
    if (!(city instanceof City)) {
      throw new Error("Bladeburner.getCurrentCity() did not properly return a City object");
    }
    return city;
  }

  calculateStaminaPenalty(): number {
    return Math.min(1, this.stamina / (0.5 * this.maxStamina));
  }

  startAction(player: IPlayer, actionId: IActionIdentifier): void {
    if (actionId == null) return;
    this.action = actionId;
    this.actionTimeCurrent = 0;
    switch (actionId.type) {
      case ActionTypes["Idle"]:
        this.actionTimeToComplete = 0;
        break;
      case ActionTypes["Contract"]:
        try {
          const action = this.getActionObject(actionId);
          if (action == null) {
            throw new Error("Failed to get Contract Object for: " + actionId.name);
          }
          if (action.count < 1) {
            return this.resetAction();
          }
          this.actionTimeToComplete = action.getActionTime(this);
        } catch (e: any) {
          exceptionAlert(e);
        }
        break;
      case ActionTypes["Operation"]: {
        try {
          const action = this.getActionObject(actionId);
          if (action == null) {
            throw new Error("Failed to get Operation Object for: " + actionId.name);
          }
          if (action.count < 1) {
            return this.resetAction();
          }
          if (actionId.name === "Raid" && this.getCurrentCity().comms === 0) {
            return this.resetAction();
          }
          this.actionTimeToComplete = action.getActionTime(this);
        } catch (e: any) {
          exceptionAlert(e);
        }
        break;
      }
      case ActionTypes["BlackOp"]:
      case ActionTypes["BlackOperation"]: {
        try {
          // Safety measure - don't repeat BlackOps that are already done
          if (this.blackops[actionId.name] != null) {
            this.resetAction();
            this.log("Error: Tried to start a Black Operation that had already been completed");
            break;
          }

          const action = this.getActionObject(actionId);
          if (action == null) {
            throw new Error("Failed to get BlackOperation object for: " + actionId.name);
          }
          this.actionTimeToComplete = action.getActionTime(this);
        } catch (e: any) {
          exceptionAlert(e);
        }
        break;
      }
      case ActionTypes["Recruitment"]:
        this.actionTimeToComplete = this.getRecruitmentTime(player);
        break;
      case ActionTypes["Training"]:
      case ActionTypes["FieldAnalysis"]:
      case ActionTypes["Field Analysis"]:
        this.actionTimeToComplete = 30;
        break;
      case ActionTypes["Diplomacy"]:
      case ActionTypes["Hyperbolic Regeneration Chamber"]:
      case ActionTypes["Incite Violence"]:
        this.actionTimeToComplete = 60;
        break;
      default:
        throw new Error("Invalid Action Type in startAction(Bladeburner,player, ): " + actionId.type);
        break;
    }
  }

  upgradeSkill(skill: Skill): void {
    // This does NOT handle deduction of skill points
    const skillName = skill.name;
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

  executeConsoleCommands(player: IPlayer, commands: string): void {
    try {
      // Console History
      if (this.consoleHistory[this.consoleHistory.length - 1] != commands) {
        this.consoleHistory.push(commands);
        if (this.consoleHistory.length > 50) {
          this.consoleHistory.splice(0, 1);
        }
      }

      const arrayOfCommands = commands.split(";");
      for (let i = 0; i < arrayOfCommands.length; ++i) {
        this.executeConsoleCommand(player, arrayOfCommands[i]);
      }
    } catch (e: any) {
      exceptionAlert(e);
    }
  }

  postToConsole(input: string, saveToLogs = true): void {
    const MaxConsoleEntries = 100;
    if (saveToLogs) {
      this.consoleLogs.push(input);
      if (this.consoleLogs.length > MaxConsoleEntries) {
        this.consoleLogs.shift();
      }
    }
  }

  log(input: string): void {
    // Adds a timestamp and then just calls postToConsole
    this.postToConsole(`[${getTimestamp()}] ${input}`);
  }

  resetAction(): void {
    this.action = new ActionIdentifier({ type: ActionTypes.Idle });
  }

  clearConsole(): void {
    this.consoleLogs.length = 0;
  }

  prestige(): void {
    this.resetAction();
    const bladeburnerFac = Factions["Bladeburners"];
    if (this.rank >= BladeburnerConstants.RankNeededForFaction) {
      joinFaction(bladeburnerFac);
    }
  }

  storeCycles(numCycles = 0): void {
    this.storedCycles += numCycles;
  }

  // working on
  getActionIdFromTypeAndName(type = "", name = ""): IActionIdentifier | null {
    if (type === "" || name === "") {
      return null;
    }
    const action = new ActionIdentifier();
    const convertedType = type.toLowerCase().trim();
    const convertedName = name.toLowerCase().trim();
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
        case "incite violence":
          action.type = ActionTypes["Incite Violence"];
          action.name = "Incite Violence";
          break;
        default:
          return null;
      }
      return action;
    }

    return null;
  }

  executeStartConsoleCommand(player: IPlayer, args: string[]): void {
    if (args.length !== 3) {
      this.postToConsole("Invalid usage of 'start' console command: start [type] [name]");
      this.postToConsole("Use 'help start' for more info");
      return;
    }
    const name = args[2];
    switch (args[1].toLowerCase()) {
      case "general":
      case "gen":
        if (GeneralActions[name] != null) {
          this.action.type = ActionTypes[name];
          this.action.name = name;
          this.startAction(player, this.action);
        } else {
          this.postToConsole("Invalid action name specified: " + args[2]);
        }
        break;
      case "contract":
      case "contracts":
        if (this.contracts[name] != null) {
          this.action.type = ActionTypes.Contract;
          this.action.name = name;
          this.startAction(player, this.action);
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
          this.startAction(player, this.action);
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
          this.startAction(player, this.action);
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

  executeSkillConsoleCommand(args: string[]): void {
    switch (args.length) {
      case 1: {
        // Display Skill Help Command
        this.postToConsole("Invalid usage of 'skill' console command: skill [action] [name]");
        this.postToConsole("Use 'help skill' for more info");
        break;
      }
      case 2: {
        if (args[1].toLowerCase() === "list") {
          // List all skills and their level
          this.postToConsole("Skills: ");
          const skillNames = Object.keys(Skills);
          for (let i = 0; i < skillNames.length; ++i) {
            const skill = Skills[skillNames[i]];
            let level = 0;
            if (this.skills[skill.name] != null) {
              level = this.skills[skill.name];
            }
            this.postToConsole(skill.name + ": Level " + formatNumber(level, 0));
          }
          this.postToConsole(" ");
          this.postToConsole("Effects: ");
          const multKeys = Object.keys(this.skillMultipliers);
          for (let i = 0; i < multKeys.length; ++i) {
            let mult = this.skillMultipliers[multKeys[i]];
            if (mult && mult !== 1) {
              mult = formatNumber(mult, 3);
              switch (multKeys[i]) {
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
      }
      case 3: {
        const skillName = args[2];
        const skill = Skills[skillName];
        if (skill == null || !(skill instanceof Skill)) {
          this.postToConsole("Invalid skill name (Note that it is case-sensitive): " + skillName);
        }
        if (args[1].toLowerCase() === "list") {
          let level = 0;
          if (this.skills[skill.name] !== undefined) {
            level = this.skills[skill.name];
          }
          this.postToConsole(skill.name + ": Level " + formatNumber(level));
        } else if (args[1].toLowerCase() === "level") {
          let currentLevel = 0;
          if (this.skills[skillName] && !isNaN(this.skills[skillName])) {
            currentLevel = this.skills[skillName];
          }
          const pointCost = skill.calculateCost(currentLevel);
          if (this.skillPoints >= pointCost) {
            this.skillPoints -= pointCost;
            this.upgradeSkill(skill);
            this.log(skill.name + " upgraded to Level " + this.skills[skillName]);
          } else {
            this.postToConsole(
              "You do not have enough Skill Points to upgrade this. You need " + formatNumber(pointCost, 0),
            );
          }
        } else {
          this.postToConsole("Invalid usage of 'skill' console command: skill [action] [name]");
          this.postToConsole("Use 'help skill' for more info");
        }
        break;
      }
      default: {
        this.postToConsole("Invalid usage of 'skill' console command: skill [action] [name]");
        this.postToConsole("Use 'help skill' for more info");
        break;
      }
    }
  }

  executeLogConsoleCommand(args: string[]): void {
    if (args.length < 3) {
      this.postToConsole("Invalid usage of log command: log [enable/disable] [action/event]");
      this.postToConsole("Use 'help log' for more details and examples");
      return;
    }

    let flag = true;
    if (args[1].toLowerCase().includes("d")) {
      flag = false;
    } // d for disable

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
        this.postToConsole(
          "Examples of valid action/event identifiers are: [general, contracts, ops, blackops, events]",
        );
        break;
    }
  }

  executeHelpConsoleCommand(args: string[]): void {
    if (args.length === 1) {
      for (const line of ConsoleHelpText.helpList) {
        this.postToConsole(line);
      }
    } else {
      for (let i = 1; i < args.length; ++i) {
        if (!(args[i] in ConsoleHelpText)) continue;
        const helpText = ConsoleHelpText[args[i]];
        for (const line of helpText) {
          this.postToConsole(line);
        }
      }
    }
  }

  executeAutomateConsoleCommand(args: string[]): void {
    if (args.length !== 2 && args.length !== 4) {
      this.postToConsole(
        "Invalid use of 'automate' command: automate [var] [val] [hi/low]. Use 'help automate' for more info",
      );
      return;
    }

    // Enable/Disable
    if (args.length === 2) {
      const flag = args[1];
      if (flag.toLowerCase() === "status") {
        this.postToConsole("Automation: " + (this.automateEnabled ? "enabled" : "disabled"));
        this.postToConsole(
          "When your stamina drops to " +
            formatNumber(this.automateThreshLow, 0) +
            ", you will automatically switch to " +
            this.automateActionLow.name +
            ". When your stamina recovers to " +
            formatNumber(this.automateThreshHigh, 0) +
            ", you will automatically " +
            "switch to " +
            this.automateActionHigh.name +
            ".",
        );
      } else if (flag.toLowerCase().includes("en")) {
        if (
          !(this.automateActionLow instanceof ActionIdentifier) ||
          !(this.automateActionHigh instanceof ActionIdentifier)
        ) {
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
      const variable = args[1];
      const val = args[2];

      let highLow = false; // True for high, false for low
      if (args[3].toLowerCase().includes("hi")) {
        highLow = true;
      }

      switch (variable) {
        case "general":
        case "gen":
          if (GeneralActions[val] != null) {
            const action = new ActionIdentifier({
              type: ActionTypes[val],
              name: val,
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
            const action = new ActionIdentifier({
              type: ActionTypes.Contract,
              name: val,
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
            const action = new ActionIdentifier({
              type: ActionTypes.Operation,
              name: val,
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
          if (isNaN(parseFloat(val))) {
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

  parseCommandArguments(command: string): string[] {
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
      if (c === '"') {
        // Double quotes
        const endQuote = command.indexOf('"', i + 1);
        if (endQuote !== -1 && (endQuote === command.length - 1 || command.charAt(endQuote + 1) === " ")) {
          args.push(command.substr(i + 1, endQuote - i - 1));
          if (endQuote === command.length - 1) {
            start = i = endQuote + 1;
          } else {
            start = i = endQuote + 2; // Skip the space
          }
          continue;
        }
      } else if (c === "'") {
        // Single quotes, same thing as above
        const endQuote = command.indexOf("'", i + 1);
        if (endQuote !== -1 && (endQuote === command.length - 1 || command.charAt(endQuote + 1) === " ")) {
          args.push(command.substr(i + 1, endQuote - i - 1));
          if (endQuote === command.length - 1) {
            start = i = endQuote + 1;
          } else {
            start = i = endQuote + 2; // Skip the space
          }
          continue;
        }
      } else if (c === " ") {
        args.push(command.substr(start, i - start));
        start = i + 1;
      }
      ++i;
    }
    if (start !== i) {
      args.push(command.substr(start, i - start));
    }
    return args;
  }

  executeConsoleCommand(player: IPlayer, command: string): void {
    command = command.trim();
    command = command.replace(/\s\s+/g, " "); // Replace all whitespace w/ a single space

    const args = this.parseCommandArguments(command);
    if (args.length <= 0) return; // Log an error?

    switch (args[0].toLowerCase()) {
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
        this.executeStartConsoleCommand(player, args);
        break;
      case "stop":
        this.resetAction();
        break;
      default:
        this.postToConsole("Invalid console command");
        break;
    }
  }

  triggerMigration(sourceCityName: string): void {
    let destCityName = BladeburnerConstants.CityNames[getRandomInt(0, 5)];
    while (destCityName === sourceCityName) {
      destCityName = BladeburnerConstants.CityNames[getRandomInt(0, 5)];
    }
    const destCity = this.cities[destCityName];
    const sourceCity = this.cities[sourceCityName];
    if (destCity == null || sourceCity == null) {
      throw new Error("Failed to find City with name: " + destCityName);
    }
    const rand = Math.random();
    let percentage = getRandomInt(3, 15) / 100;

    if (rand < 0.05 && sourceCity.comms > 0) {
      // 5% chance for community migration
      percentage *= getRandomInt(2, 4); // Migration increases population change
      --sourceCity.comms;
      ++destCity.comms;
    }
    const count = Math.round(sourceCity.pop * percentage);
    sourceCity.pop -= count;
    destCity.pop += count;
  }

  triggerPotentialMigration(sourceCityName: string, chance: number): void {
    if (chance == null || isNaN(chance)) {
      console.error("Invalid 'chance' parameter passed into Bladeburner.triggerPotentialMigration()");
    }
    if (chance > 1) {
      chance /= 100;
    }
    if (Math.random() < chance) {
      this.triggerMigration(sourceCityName);
    }
  }

  randomEvent(): void {
    const chance = Math.random();

    // Choose random source/destination city for events
    const sourceCityName = BladeburnerConstants.CityNames[getRandomInt(0, 5)];
    const sourceCity = this.cities[sourceCityName];
    if (!(sourceCity instanceof City)) {
      throw new Error("sourceCity was not a City object in Bladeburner.randomEvent()");
    }

    let destCityName = BladeburnerConstants.CityNames[getRandomInt(0, 5)];
    while (destCityName === sourceCityName) {
      destCityName = BladeburnerConstants.CityNames[getRandomInt(0, 5)];
    }
    const destCity = this.cities[destCityName];

    if (!(sourceCity instanceof City) || !(destCity instanceof City)) {
      throw new Error("sourceCity/destCity was not a City object in Bladeburner.randomEvent()");
    }

    if (chance <= 0.05) {
      // New Synthoid Community, 5%
      ++sourceCity.comms;
      const percentage = getRandomInt(10, 20) / 100;
      const count = Math.round(sourceCity.pop * percentage);
      sourceCity.pop += count;
      if (this.logging.events) {
        this.log("Intelligence indicates that a new Synthoid community was formed in a city");
      }
    } else if (chance <= 0.1) {
      // Synthoid Community Migration, 5%
      if (sourceCity.comms <= 0) {
        // If no comms in source city, then instead trigger a new Synthoid community event
        ++sourceCity.comms;
        const percentage = getRandomInt(10, 20) / 100;
        const count = Math.round(sourceCity.pop * percentage);
        sourceCity.pop += count;
        if (this.logging.events) {
          this.log("Intelligence indicates that a new Synthoid community was formed in a city");
        }
      } else {
        --sourceCity.comms;
        ++destCity.comms;

        // Change pop
        const percentage = getRandomInt(10, 20) / 100;
        const count = Math.round(sourceCity.pop * percentage);
        sourceCity.pop -= count;
        destCity.pop += count;

        if (this.logging.events) {
          this.log(
            "Intelligence indicates that a Synthoid community migrated from " + sourceCityName + " to some other city",
          );
        }
      }
    } else if (chance <= 0.3) {
      // New Synthoids (non community), 20%
      const percentage = getRandomInt(8, 24) / 100;
      const count = Math.round(sourceCity.pop * percentage);
      sourceCity.pop += count;
      if (this.logging.events) {
        this.log(
          "Intelligence indicates that the Synthoid population of " + sourceCityName + " just changed significantly",
        );
      }
    } else if (chance <= 0.5) {
      // Synthoid migration (non community) 20%
      this.triggerMigration(sourceCityName);
      if (this.logging.events) {
        this.log(
          "Intelligence indicates that a large number of Synthoids migrated from " +
            sourceCityName +
            " to some other city",
        );
      }
    } else if (chance <= 0.7) {
      // Synthoid Riots (+chaos), 20%
      sourceCity.chaos += 1;
      sourceCity.chaos *= 1 + getRandomInt(5, 20) / 100;
      if (this.logging.events) {
        this.log("Tensions between Synthoids and humans lead to riots in " + sourceCityName + "! Chaos increased");
      }
    } else if (chance <= 0.9) {
      // Less Synthoids, 20%
      const percentage = getRandomInt(8, 20) / 100;
      const count = Math.round(sourceCity.pop * percentage);
      sourceCity.pop -= count;
      if (this.logging.events) {
        this.log(
          "Intelligence indicates that the Synthoid population of " + sourceCityName + " just changed significantly",
        );
      }
    }
    // 10% chance of nothing happening
  }

  /**
   * Process stat gains from Contracts, Operations, and Black Operations
   * @param action(Action obj) - Derived action class
   * @param success(bool) - Whether action was successful
   */
  gainActionStats(player: IPlayer, action: IAction, success: boolean): void {
    const difficulty = action.getDifficulty();

    /**
     * Gain multiplier based on difficulty. If it changes then the
     * same variable calculated in completeAction() needs to change too
     */
    const difficultyMult =
      Math.pow(difficulty, BladeburnerConstants.DiffMultExponentialFactor) +
      difficulty / BladeburnerConstants.DiffMultLinearFactor;

    const time = this.actionTimeToComplete;
    const successMult = success ? 1 : 0.5;

    const unweightedGain = time * BladeburnerConstants.BaseStatGain * successMult * difficultyMult;
    const unweightedIntGain = time * BladeburnerConstants.BaseIntGain * successMult * difficultyMult;
    const skillMult = this.skillMultipliers.expGain;
    player.gainHackingExp(unweightedGain * action.weights.hack * player.hacking_exp_mult * skillMult);
    player.gainStrengthExp(unweightedGain * action.weights.str * player.strength_exp_mult * skillMult);
    player.gainDefenseExp(unweightedGain * action.weights.def * player.defense_exp_mult * skillMult);
    player.gainDexterityExp(unweightedGain * action.weights.dex * player.dexterity_exp_mult * skillMult);
    player.gainAgilityExp(unweightedGain * action.weights.agi * player.agility_exp_mult * skillMult);
    player.gainCharismaExp(unweightedGain * action.weights.cha * player.charisma_exp_mult * skillMult);
    let intExp = unweightedIntGain * action.weights.int * skillMult;
    if (intExp > 1) {
      intExp = Math.pow(intExp, 0.8);
    }
    player.gainIntelligenceExp(intExp);
  }

  getDiplomacyEffectiveness(player: IPlayer): number {
    // Returns a decimal by which the city's chaos level should be multiplied (e.g. 0.98)
    const CharismaLinearFactor = 1e3;
    const CharismaExponentialFactor = 0.045;

    const charismaEff = Math.pow(player.charisma, CharismaExponentialFactor) + player.charisma / CharismaLinearFactor;
    return (100 - charismaEff) / 100;
  }

  getRecruitmentSuccessChance(player: IPlayer): number {
    return Math.pow(player.charisma, 0.45) / (this.teamSize + 1);
  }

  getRecruitmentTime(player: IPlayer): number {
    const effCharisma = player.charisma * this.skillMultipliers.effCha;
    const charismaFactor = Math.pow(effCharisma, 0.81) + effCharisma / 90;
    return Math.max(10, Math.round(BladeburnerConstants.BaseRecruitmentTimeNeeded - charismaFactor));
  }

  resetSkillMultipliers(): void {
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

  updateSkillMultipliers(): void {
    this.resetSkillMultipliers();
    for (const skillName in this.skills) {
      if (this.skills.hasOwnProperty(skillName)) {
        const skill = Skills[skillName];
        if (skill == null) {
          throw new Error("Could not find Skill Object for: " + skillName);
        }
        const level = this.skills[skillName];
        if (level == null || level <= 0) {
          continue;
        } //Not upgraded

        const multiplierNames = Object.keys(this.skillMultipliers);
        for (let i = 0; i < multiplierNames.length; ++i) {
          const multiplierName = multiplierNames[i];
          if (skill.getMultiplier(multiplierName) != null && !isNaN(skill.getMultiplier(multiplierName))) {
            const value = skill.getMultiplier(multiplierName) * level;
            let multiplierValue = 1 + value / 100;
            if (multiplierName === "actionTime") {
              multiplierValue = 1 - value / 100;
            }
            this.skillMultipliers[multiplierName] *= multiplierValue;
          }
        }
      }
    }
  }

  completeOperation(success: boolean): void {
    if (this.action.type !== ActionTypes.Operation) {
      throw new Error("completeOperation() called even though current action is not an Operation");
    }
    const action = this.getActionObject(this.action);
    if (action == null) {
      throw new Error("Failed to get Contract/Operation Object for: " + this.action.name);
    }

    // Calculate team losses
    const teamCount = action.teamCount;
    if (teamCount >= 1) {
      let max;
      if (success) {
        max = Math.ceil(teamCount / 2);
      } else {
        max = Math.floor(teamCount);
      }
      const losses = getRandomInt(0, max);
      this.teamSize -= losses;
      this.teamLost += losses;
      if (this.logging.ops && losses > 0) {
        this.log("Lost " + formatNumber(losses, 0) + " team members during this " + action.name);
      }
    }

    const city = this.getCurrentCity();
    switch (action.name) {
      case "Investigation":
        if (success) {
          city.improvePopulationEstimateByPercentage(0.4 * this.skillMultipliers.successChanceEstimate);
        } else {
          this.triggerPotentialMigration(this.city, 0.1);
        }
        break;
      case "Undercover Operation":
        if (success) {
          city.improvePopulationEstimateByPercentage(0.8 * this.skillMultipliers.successChanceEstimate);
        } else {
          this.triggerPotentialMigration(this.city, 0.15);
        }
        break;
      case "Sting Operation":
        if (success) {
          city.changePopulationByPercentage(-0.1, {
            changeEstEqually: true,
            nonZero: true,
          });
        }
        city.changeChaosByCount(0.1);
        break;
      case "Raid":
        if (success) {
          city.changePopulationByPercentage(-1, {
            changeEstEqually: true,
            nonZero: true,
          });
          --city.comms;
        } else {
          const change = getRandomInt(-10, -5) / 10;
          city.changePopulationByPercentage(change, {
            nonZero: true,
            changeEstEqually: false,
          });
        }
        city.changeChaosByPercentage(getRandomInt(1, 5));
        break;
      case "Stealth Retirement Operation":
        if (success) {
          city.changePopulationByPercentage(-0.5, {
            changeEstEqually: true,
            nonZero: true,
          });
        }
        city.changeChaosByPercentage(getRandomInt(-3, -1));
        break;
      case "Assassination":
        if (success) {
          city.changePopulationByCount(-1, { estChange: -1, estOffset: 0 });
        }
        city.changeChaosByPercentage(getRandomInt(-5, 5));
        break;
      default:
        throw new Error("Invalid Action name in completeOperation: " + this.action.name);
    }
  }

  getActionObject(actionId: IActionIdentifier): IAction | null {
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
      case ActionTypes["Incite Violence"]:
        return GeneralActions["Incite Violence"];
      default:
        return null;
    }
  }

  completeContract(success: boolean): void {
    if (this.action.type !== ActionTypes.Contract) {
      throw new Error("completeContract() called even though current action is not a Contract");
    }
    const city = this.getCurrentCity();
    if (success) {
      switch (this.action.name) {
        case "Tracking":
          // Increase estimate accuracy by a relatively small amount
          city.improvePopulationEstimateByCount(getRandomInt(100, 1e3));
          break;
        case "Bounty Hunter":
          city.changePopulationByCount(-1, { estChange: -1, estOffset: 0 });
          city.changeChaosByCount(0.02);
          break;
        case "Retirement":
          city.changePopulationByCount(-1, { estChange: -1, estOffset: 0 });
          city.changeChaosByCount(0.04);
          break;
        default:
          throw new Error("Invalid Action name in completeContract: " + this.action.name);
      }
    }
  }

  completeAction(router: IRouter, player: IPlayer): void {
    switch (this.action.type) {
      case ActionTypes["Contract"]:
      case ActionTypes["Operation"]: {
        try {
          const isOperation = this.action.type === ActionTypes["Operation"];
          const action = this.getActionObject(this.action);
          if (action == null) {
            throw new Error("Failed to get Contract/Operation Object for: " + this.action.name);
          }
          const difficulty = action.getDifficulty();
          const difficultyMultiplier =
            Math.pow(difficulty, BladeburnerConstants.DiffMultExponentialFactor) +
            difficulty / BladeburnerConstants.DiffMultLinearFactor;
          const rewardMultiplier = Math.pow(action.rewardFac, action.level - 1);

          // Stamina loss is based on difficulty
          this.stamina -= BladeburnerConstants.BaseStaminaLoss * difficultyMultiplier;
          if (this.stamina < 0) {
            this.stamina = 0;
          }

          // Process Contract/Operation success/failure
          if (action.attempt(this)) {
            this.gainActionStats(player, action, true);
            ++action.successes;
            --action.count;

            // Earn money for contracts
            let moneyGain = 0;
            if (!isOperation) {
              moneyGain = BladeburnerConstants.ContractBaseMoneyGain * rewardMultiplier * this.skillMultipliers.money;
              player.gainMoney(moneyGain, "bladeburner");
            }

            if (isOperation) {
              action.setMaxLevel(BladeburnerConstants.OperationSuccessesPerLevel);
            } else {
              action.setMaxLevel(BladeburnerConstants.ContractSuccessesPerLevel);
            }
            if (action.rankGain) {
              const gain = addOffset(action.rankGain * rewardMultiplier * BitNodeMultipliers.BladeburnerRank, 10);
              this.changeRank(player, gain);
              if (isOperation && this.logging.ops) {
                this.log(action.name + " successfully completed! Gained " + formatNumber(gain, 3) + " rank");
              } else if (!isOperation && this.logging.contracts) {
                this.log(
                  action.name +
                    " contract successfully completed! Gained " +
                    formatNumber(gain, 3) +
                    " rank and " +
                    numeralWrapper.formatMoney(moneyGain),
                );
              }
            }
            isOperation ? this.completeOperation(true) : this.completeContract(true);
          } else {
            this.gainActionStats(player, action, false);
            ++action.failures;
            let loss = 0,
              damage = 0;
            if (action.rankLoss) {
              loss = addOffset(action.rankLoss * rewardMultiplier, 10);
              this.changeRank(player, -1 * loss);
            }
            if (action.hpLoss) {
              damage = action.hpLoss * difficultyMultiplier;
              damage = Math.ceil(addOffset(damage, 10));
              this.hpLost += damage;
              const cost = calculateHospitalizationCost(player, damage);
              if (player.takeDamage(damage)) {
                ++this.numHosp;
                this.moneyLost += cost;
              }
            }
            let logLossText = "";
            if (loss > 0) {
              logLossText += "Lost " + formatNumber(loss, 3) + " rank. ";
            }
            if (damage > 0) {
              logLossText += "Took " + formatNumber(damage, 0) + " damage.";
            }
            if (isOperation && this.logging.ops) {
              this.log(action.name + " failed! " + logLossText);
            } else if (!isOperation && this.logging.contracts) {
              this.log(action.name + " contract failed! " + logLossText);
            }
            isOperation ? this.completeOperation(false) : this.completeContract(false);
          }
          if (action.autoLevel) {
            action.level = action.maxLevel;
          } // Autolevel
          this.startAction(player, this.action); // Repeat action
        } catch (e: any) {
          exceptionAlert(e);
        }
        break;
      }
      case ActionTypes["BlackOp"]:
      case ActionTypes["BlackOperation"]: {
        try {
          const action = this.getActionObject(this.action);
          if (action == null || !(action instanceof BlackOperation)) {
            throw new Error("Failed to get BlackOperation Object for: " + this.action.name);
          }
          const difficulty = action.getDifficulty();
          const difficultyMultiplier =
            Math.pow(difficulty, BladeburnerConstants.DiffMultExponentialFactor) +
            difficulty / BladeburnerConstants.DiffMultLinearFactor;

          // Stamina loss is based on difficulty
          this.stamina -= BladeburnerConstants.BaseStaminaLoss * difficultyMultiplier;
          if (this.stamina < 0) {
            this.stamina = 0;
          }

          // Team loss variables
          const teamCount = action.teamCount;
          let teamLossMax;

          if (action.attempt(this)) {
            this.gainActionStats(player, action, true);
            action.count = 0;
            this.blackops[action.name] = true;
            let rankGain = 0;
            if (action.rankGain) {
              rankGain = addOffset(action.rankGain * BitNodeMultipliers.BladeburnerRank, 10);
              this.changeRank(player, rankGain);
            }
            teamLossMax = Math.ceil(teamCount / 2);

            // Operation Daedalus
            if (action.name === "Operation Daedalus") {
              this.resetAction();
              return router.toBitVerse(false, false);
            }

            if (this.logging.blackops) {
              this.log(action.name + " successful! Gained " + formatNumber(rankGain, 1) + " rank");
            }
          } else {
            this.gainActionStats(player, action, false);
            let rankLoss = 0;
            let damage = 0;
            if (action.rankLoss) {
              rankLoss = addOffset(action.rankLoss, 10);
              this.changeRank(player, -1 * rankLoss);
            }
            if (action.hpLoss) {
              damage = action.hpLoss * difficultyMultiplier;
              damage = Math.ceil(addOffset(damage, 10));
              const cost = calculateHospitalizationCost(player, damage);
              if (player.takeDamage(damage)) {
                ++this.numHosp;
                this.moneyLost += cost;
              }
            }
            teamLossMax = Math.floor(teamCount);

            if (this.logging.blackops) {
              this.log(
                action.name +
                  " failed! Lost " +
                  formatNumber(rankLoss, 1) +
                  " rank and took " +
                  formatNumber(damage, 0) +
                  " damage",
              );
            }
          }

          this.resetAction(); // Stop regardless of success or fail

          // Calculate team lossses
          if (teamCount >= 1) {
            const losses = getRandomInt(1, teamLossMax);
            this.teamSize -= losses;
            this.teamLost += losses;
            if (this.logging.blackops) {
              this.log("You lost " + formatNumber(losses, 0) + " team members during " + action.name);
            }
          }
        } catch (e: any) {
          exceptionAlert(e);
        }
        break;
      }
      case ActionTypes["Training"]: {
        this.stamina -= 0.5 * BladeburnerConstants.BaseStaminaLoss;
        const strExpGain = 30 * player.strength_exp_mult,
          defExpGain = 30 * player.defense_exp_mult,
          dexExpGain = 30 * player.dexterity_exp_mult,
          agiExpGain = 30 * player.agility_exp_mult,
          staminaGain = 0.04 * this.skillMultipliers.stamina;
        player.gainStrengthExp(strExpGain);
        player.gainDefenseExp(defExpGain);
        player.gainDexterityExp(dexExpGain);
        player.gainAgilityExp(agiExpGain);
        this.staminaBonus += staminaGain;
        if (this.logging.general) {
          this.log(
            "Training completed. Gained: " +
              formatNumber(strExpGain, 1) +
              " str exp, " +
              formatNumber(defExpGain, 1) +
              " def exp, " +
              formatNumber(dexExpGain, 1) +
              " dex exp, " +
              formatNumber(agiExpGain, 1) +
              " agi exp, " +
              formatNumber(staminaGain, 3) +
              " max stamina",
          );
        }
        this.startAction(player, this.action); // Repeat action
        break;
      }
      case ActionTypes["FieldAnalysis"]:
      case ActionTypes["Field Analysis"]: {
        // Does not use stamina. Effectiveness depends on hacking, int, and cha
        let eff =
          0.04 * Math.pow(player.hacking_skill, 0.3) +
          0.04 * Math.pow(player.intelligence, 0.9) +
          0.02 * Math.pow(player.charisma, 0.3);
        eff *= player.bladeburner_analysis_mult;
        if (isNaN(eff) || eff < 0) {
          throw new Error("Field Analysis Effectiveness calculated to be NaN or negative");
        }
        const hackingExpGain = 20 * player.hacking_exp_mult,
          charismaExpGain = 20 * player.charisma_exp_mult;
        player.gainHackingExp(hackingExpGain);
        player.gainIntelligenceExp(BladeburnerConstants.BaseIntGain);
        player.gainCharismaExp(charismaExpGain);
        this.changeRank(player, 0.1 * BitNodeMultipliers.BladeburnerRank);
        this.getCurrentCity().improvePopulationEstimateByPercentage(eff * this.skillMultipliers.successChanceEstimate);
        if (this.logging.general) {
          this.log(
            "Field analysis completed. Gained 0.1 rank, " +
              formatNumber(hackingExpGain, 1) +
              " hacking exp, and " +
              formatNumber(charismaExpGain, 1) +
              " charisma exp",
          );
        }
        this.startAction(player, this.action); // Repeat action
        break;
      }
      case ActionTypes["Recruitment"]: {
        const successChance = this.getRecruitmentSuccessChance(player);
        if (Math.random() < successChance) {
          const expGain = 2 * BladeburnerConstants.BaseStatGain * this.actionTimeToComplete;
          player.gainCharismaExp(expGain);
          ++this.teamSize;
          if (this.logging.general) {
            this.log("Successfully recruited a team member! Gained " + formatNumber(expGain, 1) + " charisma exp");
          }
        } else {
          const expGain = BladeburnerConstants.BaseStatGain * this.actionTimeToComplete;
          player.gainCharismaExp(expGain);
          if (this.logging.general) {
            this.log("Failed to recruit a team member. Gained " + formatNumber(expGain, 1) + " charisma exp");
          }
        }
        this.startAction(player, this.action); // Repeat action
        break;
      }
      case ActionTypes["Diplomacy"]: {
        const eff = this.getDiplomacyEffectiveness(player);
        this.getCurrentCity().chaos *= eff;
        if (this.getCurrentCity().chaos < 0) {
          this.getCurrentCity().chaos = 0;
        }
        if (this.logging.general) {
          this.log(
            `Diplomacy completed. Chaos levels in the current city fell by ${numeralWrapper.formatPercentage(1 - eff)}`,
          );
        }
        this.startAction(player, this.action); // Repeat Action
        break;
      }
      case ActionTypes["Hyperbolic Regeneration Chamber"]: {
        player.regenerateHp(BladeburnerConstants.HrcHpGain);

        const staminaGain = this.maxStamina * (BladeburnerConstants.HrcStaminaGain / 100);
        this.stamina = Math.min(this.maxStamina, this.stamina + staminaGain);
        this.startAction(player, this.action);
        if (this.logging.general) {
          this.log(
            `Rested in Hyperbolic Regeneration Chamber. Restored ${
              BladeburnerConstants.HrcHpGain
            } HP and gained ${numeralWrapper.formatStamina(staminaGain)} stamina`,
          );
        }
        break;
      }
      case ActionTypes["Incite Violence"]: {
        for (const contract of Object.keys(this.contracts)) {
          const growthF = Growths[contract];
          if (!growthF) throw new Error("trying to generate count for action that doesn't exist? " + contract);
          this.contracts[contract].count += (60 * 3 * growthF()) / BladeburnerConstants.ActionCountGrowthPeriod;
        }
        for (const operation of Object.keys(this.operations)) {
          const growthF = Growths[operation];
          if (!growthF) throw new Error("trying to generate count for action that doesn't exist? " + operation);
          this.operations[operation].count += (60 * 3 * growthF()) / BladeburnerConstants.ActionCountGrowthPeriod;
        }
        if (this.logging.general) {
          this.log(`Incited violence in the synthoid communities.`);
        }
        for (const cityName of Object.keys(this.cities)) {
          const city = this.cities[cityName];
          city.chaos += 10;
          city.chaos += city.chaos / (Math.log(city.chaos) / Math.log(10));
        }

        this.startAction(player, this.action);
        break;
      }
      default:
        console.error(`Bladeburner.completeAction() called for invalid action: ${this.action.type}`);
        break;
    }
  }

  changeRank(player: IPlayer, change: number): void {
    if (isNaN(change)) {
      throw new Error("NaN passed into Bladeburner.changeRank()");
    }
    this.rank += change;
    if (this.rank < 0) {
      this.rank = 0;
    }
    this.maxRank = Math.max(this.rank, this.maxRank);

    const bladeburnersFactionName = "Bladeburners";
    if (factionExists(bladeburnersFactionName)) {
      const bladeburnerFac = Factions[bladeburnersFactionName];
      if (!(bladeburnerFac instanceof Faction)) {
        throw new Error("Could not properly get Bladeburner Faction object in Bladeburner UI Overview Faction button");
      }
      if (bladeburnerFac.isMember) {
        const favorBonus = 1 + bladeburnerFac.favor / 100;
        bladeburnerFac.playerReputation +=
          BladeburnerConstants.RankToFactionRepFactor * change * player.faction_rep_mult * favorBonus;
      }
    }

    // Gain skill points
    const rankNeededForSp = (this.totalSkillPoints + 1) * BladeburnerConstants.RanksPerSkillPoint;
    if (this.maxRank >= rankNeededForSp) {
      // Calculate how many skill points to gain
      const gainedSkillPoints = Math.floor(
        (this.maxRank - rankNeededForSp) / BladeburnerConstants.RanksPerSkillPoint + 1,
      );
      this.skillPoints += gainedSkillPoints;
      this.totalSkillPoints += gainedSkillPoints;
    }
  }

  processAction(router: IRouter, player: IPlayer, seconds: number): void {
    if (this.action.type === ActionTypes["Idle"]) return;
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
      return this.completeAction(router, player);
    }
  }

  calculateStaminaGainPerSecond(player: IPlayer): number {
    const effAgility = player.agility * this.skillMultipliers.effAgi;
    const maxStaminaBonus = this.maxStamina / BladeburnerConstants.MaxStaminaToGainFactor;
    const gain = (BladeburnerConstants.StaminaGainPerSecond + maxStaminaBonus) * Math.pow(effAgility, 0.17);
    return gain * (this.skillMultipliers.stamina * player.bladeburner_stamina_gain_mult);
  }

  calculateMaxStamina(player: IPlayer): void {
    const effAgility = player.agility * this.skillMultipliers.effAgi;
    const maxStamina =
      (Math.pow(effAgility, 0.8) + this.staminaBonus) *
      this.skillMultipliers.stamina *
      player.bladeburner_max_stamina_mult;
    if (this.maxStamina !== maxStamina) {
      const oldMax = this.maxStamina;
      this.maxStamina = maxStamina;
      this.stamina = (this.maxStamina * this.stamina) / oldMax;
    }
    if (isNaN(maxStamina)) {
      throw new Error("Max Stamina calculated to be NaN in Bladeburner.calculateMaxStamina()");
    }
  }

  create(): void {
    this.contracts["Tracking"] = new Contract({
      name: "Tracking",
      baseDifficulty: 125,
      difficultyFac: 1.02,
      rewardFac: 1.041,
      rankGain: 0.3,
      hpLoss: 0.5,
      count: getRandomInt(25, 150),
      weights: {
        hack: 0,
        str: 0.05,
        def: 0.05,
        dex: 0.35,
        agi: 0.35,
        cha: 0.1,
        int: 0.05,
      },
      decays: {
        hack: 0,
        str: 0.91,
        def: 0.91,
        dex: 0.91,
        agi: 0.91,
        cha: 0.9,
        int: 1,
      },
      isStealth: true,
    });
    this.contracts["Bounty Hunter"] = new Contract({
      name: "Bounty Hunter",
      baseDifficulty: 250,
      difficultyFac: 1.04,
      rewardFac: 1.085,
      rankGain: 0.9,
      hpLoss: 1,
      count: getRandomInt(5, 150),
      weights: {
        hack: 0,
        str: 0.15,
        def: 0.15,
        dex: 0.25,
        agi: 0.25,
        cha: 0.1,
        int: 0.1,
      },
      decays: {
        hack: 0,
        str: 0.91,
        def: 0.91,
        dex: 0.91,
        agi: 0.91,
        cha: 0.8,
        int: 0.9,
      },
      isKill: true,
    });
    this.contracts["Retirement"] = new Contract({
      name: "Retirement",
      baseDifficulty: 200,
      difficultyFac: 1.03,
      rewardFac: 1.065,
      rankGain: 0.6,
      hpLoss: 1,
      count: getRandomInt(5, 150),
      weights: {
        hack: 0,
        str: 0.2,
        def: 0.2,
        dex: 0.2,
        agi: 0.2,
        cha: 0.1,
        int: 0.1,
      },
      decays: {
        hack: 0,
        str: 0.91,
        def: 0.91,
        dex: 0.91,
        agi: 0.91,
        cha: 0.8,
        int: 0.9,
      },
      isKill: true,
    });

    this.operations["Investigation"] = new Operation({
      name: "Investigation",
      baseDifficulty: 400,
      difficultyFac: 1.03,
      rewardFac: 1.07,
      reqdRank: 25,
      rankGain: 2.2,
      rankLoss: 0.2,
      count: getRandomInt(1, 100),
      weights: {
        hack: 0.25,
        str: 0.05,
        def: 0.05,
        dex: 0.2,
        agi: 0.1,
        cha: 0.25,
        int: 0.1,
      },
      decays: {
        hack: 0.85,
        str: 0.9,
        def: 0.9,
        dex: 0.9,
        agi: 0.9,
        cha: 0.7,
        int: 0.9,
      },
      isStealth: true,
    });
    this.operations["Undercover Operation"] = new Operation({
      name: "Undercover Operation",
      baseDifficulty: 500,
      difficultyFac: 1.04,
      rewardFac: 1.09,
      reqdRank: 100,
      rankGain: 4.4,
      rankLoss: 0.4,
      hpLoss: 2,
      count: getRandomInt(1, 100),
      weights: {
        hack: 0.2,
        str: 0.05,
        def: 0.05,
        dex: 0.2,
        agi: 0.2,
        cha: 0.2,
        int: 0.1,
      },
      decays: {
        hack: 0.8,
        str: 0.9,
        def: 0.9,
        dex: 0.9,
        agi: 0.9,
        cha: 0.7,
        int: 0.9,
      },
      isStealth: true,
    });
    this.operations["Sting Operation"] = new Operation({
      name: "Sting Operation",
      baseDifficulty: 650,
      difficultyFac: 1.04,
      rewardFac: 1.095,
      reqdRank: 500,
      rankGain: 5.5,
      rankLoss: 0.5,
      hpLoss: 2.5,
      count: getRandomInt(1, 150),
      weights: {
        hack: 0.25,
        str: 0.05,
        def: 0.05,
        dex: 0.25,
        agi: 0.1,
        cha: 0.2,
        int: 0.1,
      },
      decays: {
        hack: 0.8,
        str: 0.85,
        def: 0.85,
        dex: 0.85,
        agi: 0.85,
        cha: 0.7,
        int: 0.9,
      },
      isStealth: true,
    });
    this.operations["Raid"] = new Operation({
      name: "Raid",
      baseDifficulty: 800,
      difficultyFac: 1.045,
      rewardFac: 1.1,
      reqdRank: 3000,
      rankGain: 55,
      rankLoss: 2.5,
      hpLoss: 50,
      count: getRandomInt(1, 150),
      weights: {
        hack: 0.1,
        str: 0.2,
        def: 0.2,
        dex: 0.2,
        agi: 0.2,
        cha: 0,
        int: 0.1,
      },
      decays: {
        hack: 0.7,
        str: 0.8,
        def: 0.8,
        dex: 0.8,
        agi: 0.8,
        cha: 0,
        int: 0.9,
      },
      isKill: true,
    });
    this.operations["Stealth Retirement Operation"] = new Operation({
      name: "Stealth Retirement Operation",
      baseDifficulty: 1000,
      difficultyFac: 1.05,
      rewardFac: 1.11,
      reqdRank: 20e3,
      rankGain: 22,
      rankLoss: 2,
      hpLoss: 10,
      count: getRandomInt(1, 150),
      weights: {
        hack: 0.1,
        str: 0.1,
        def: 0.1,
        dex: 0.3,
        agi: 0.3,
        cha: 0,
        int: 0.1,
      },
      decays: {
        hack: 0.7,
        str: 0.8,
        def: 0.8,
        dex: 0.8,
        agi: 0.8,
        cha: 0,
        int: 0.9,
      },
      isStealth: true,
      isKill: true,
    });
    this.operations["Assassination"] = new Operation({
      name: "Assassination",
      baseDifficulty: 1500,
      difficultyFac: 1.06,
      rewardFac: 1.14,
      reqdRank: 50e3,
      rankGain: 44,
      rankLoss: 4,
      hpLoss: 5,
      count: getRandomInt(1, 150),
      weights: {
        hack: 0.1,
        str: 0.1,
        def: 0.1,
        dex: 0.3,
        agi: 0.3,
        cha: 0,
        int: 0.1,
      },
      decays: {
        hack: 0.6,
        str: 0.8,
        def: 0.8,
        dex: 0.8,
        agi: 0.8,
        cha: 0,
        int: 0.8,
      },
      isStealth: true,
      isKill: true,
    });
  }

  process(router: IRouter, player: IPlayer): void {
    // Edge case condition...if Operation Daedalus is complete trigger the BitNode
    if (router.page() !== Page.BitVerse && this.blackops.hasOwnProperty("Operation Daedalus")) {
      return router.toBitVerse(false, false);
    }

    // If the Player starts doing some other actions, set action to idle and alert
    if (Augmentations[AugmentationNames.BladesSimulacrum].owned === false && player.isWorking) {
      if (this.action.type !== ActionTypes["Idle"]) {
        let msg = "Your Bladeburner action was cancelled because you started doing something else.";
        if (this.automateEnabled) {
          msg += `<br /><br />Your automation was disabled as well. You will have to re-enable it through the Bladeburner console`;
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
      let seconds = Math.floor(this.storedCycles / BladeburnerConstants.CyclesPerSecond);
      seconds = Math.min(seconds, 5); // Max of 5 'ticks'
      this.storedCycles -= seconds * BladeburnerConstants.CyclesPerSecond;

      // Stamina
      this.calculateMaxStamina(player);
      this.stamina += this.calculateStaminaGainPerSecond(player) * seconds;
      this.stamina = Math.min(this.maxStamina, this.stamina);

      // Count increase for contracts/operations
      for (const contract of Object.values(this.contracts) as Contract[]) {
        const growthF = Growths[contract.name];
        if (growthF === undefined) throw new Error(`growth formula for action '${contract.name}' is undefined`);
        contract.count += (seconds * growthF()) / BladeburnerConstants.ActionCountGrowthPeriod;
      }
      for (const op of Object.values(this.operations) as Operation[]) {
        const growthF = Growths[op.name];
        if (growthF === undefined) throw new Error(`growth formula for action '${op.name}' is undefined`);
        if (growthF !== undefined) {
          op.count += (seconds * growthF()) / BladeburnerConstants.ActionCountGrowthPeriod;
        }
      }

      // Chaos goes down very slowly
      for (const cityName of BladeburnerConstants.CityNames) {
        const city = this.cities[cityName];
        if (!(city instanceof City)) {
          throw new Error("Invalid City object when processing passive chaos reduction in Bladeburner.process");
        }
        city.chaos -= 0.0001 * seconds;
        city.chaos = Math.max(0, city.chaos);
      }

      // Random Events
      this.randomEventCounter -= seconds;
      if (this.randomEventCounter <= 0) {
        this.randomEvent();
        // Add instead of setting because we might have gone over the required time for the event
        this.randomEventCounter += getRandomInt(240, 600);
      }

      this.processAction(router, player, seconds);

      // Automation
      if (this.automateEnabled) {
        // Note: Do NOT set this.action = this.automateActionHigh/Low since it creates a reference
        if (this.stamina <= this.automateThreshLow) {
          if (this.action.name !== this.automateActionLow.name || this.action.type !== this.automateActionLow.type) {
            this.action = new ActionIdentifier({
              type: this.automateActionLow.type,
              name: this.automateActionLow.name,
            });
            this.startAction(player, this.action);
          }
        } else if (this.stamina >= this.automateThreshHigh) {
          if (this.action.name !== this.automateActionHigh.name || this.action.type !== this.automateActionHigh.type) {
            this.action = new ActionIdentifier({
              type: this.automateActionHigh.type,
              name: this.automateActionHigh.name,
            });
            this.startAction(player, this.action);
          }
        }
      }
    }
  }

  getTypeAndNameFromActionId(actionId: IActionIdentifier): {
    type: string;
    name: string;
  } {
    const res = { type: "", name: "" };
    const types = Object.keys(ActionTypes);
    for (let i = 0; i < types.length; ++i) {
      if (actionId.type === ActionTypes[types[i]]) {
        res.type = types[i];
        break;
      }
    }
    const gen = [
      "Training",
      "Recruitment",
      "FieldAnalysis",
      "Field Analysis",
      "Diplomacy",
      "Hyperbolic Regeneration Chamber",
      "Incite Violence",
    ];
    if (gen.includes(res.type)) {
      res.type = "General";
    }

    if (res.type == null) {
      res.type = "Idle";
    }

    res.name = actionId.name != null ? actionId.name : "Idle";
    return res;
  }

  getContractNamesNetscriptFn(): string[] {
    return Object.keys(this.contracts);
  }

  getOperationNamesNetscriptFn(): string[] {
    return Object.keys(this.operations);
  }

  getBlackOpNamesNetscriptFn(): string[] {
    return Object.keys(BlackOperations);
  }

  getGeneralActionNamesNetscriptFn(): string[] {
    return Object.keys(GeneralActions);
  }

  getSkillNamesNetscriptFn(): string[] {
    return Object.keys(Skills);
  }

  startActionNetscriptFn(player: IPlayer, type: string, name: string, workerScript: WorkerScript): boolean {
    const errorLogText = `Invalid action: type='${type}' name='${name}'`;
    const actionId = this.getActionIdFromTypeAndName(type, name);
    if (actionId == null) {
      workerScript.log("bladeburner.startAction", errorLogText);
      return false;
    }

    // Special logic for Black Ops
    if (actionId.type === ActionTypes["BlackOp"]) {
      // Can't start a BlackOp if you don't have the required rank
      const action = this.getActionObject(actionId);
      if (action == null) throw new Error(`Action not found ${actionId.type}, ${actionId.name}`);
      if (!(action instanceof BlackOperation)) throw new Error(`Action should be BlackOperation but isn't`);
      //const blackOp = (action as BlackOperation);
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
      const blackops = [];
      for (const nm in BlackOperations) {
        if (BlackOperations.hasOwnProperty(nm)) {
          blackops.push(nm);
        }
      }
      blackops.sort(function (a, b) {
        return BlackOperations[a].reqdRank - BlackOperations[b].reqdRank; // Sort black ops in intended order
      });

      const i = blackops.indexOf(actionId.name);
      if (i === -1) {
        workerScript.log("bladeburner.startAction", `Invalid Black Op: '${name}'`);
        return false;
      }

      if (i > 0 && this.blackops[blackops[i - 1]] == null) {
        workerScript.log(
          "bladeburner.startAction",
          `Preceding Black Op must be completed before starting '${actionId.name}'.`,
        );
        return false;
      }
    }

    try {
      this.startAction(player, actionId);
      workerScript.log("bladeburner.startAction", `Starting bladeburner action with type '${type}' and name ${name}"`);
      return true;
    } catch (e: any) {
      this.resetAction();
      workerScript.log("bladeburner.startAction", errorLogText);
      return false;
    }
  }

  getActionTimeNetscriptFn(player: IPlayer, type: string, name: string, workerScript: WorkerScript): number {
    const errorLogText = `Invalid action: type='${type}' name='${name}'`;
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
        return actionObj.getActionTime(this) * 1000;
      case ActionTypes["Training"]:
      case ActionTypes["Field Analysis"]:
      case ActionTypes["FieldAnalysis"]:
        return 30000;
      case ActionTypes["Recruitment"]:
        return this.getRecruitmentTime(player) * 1000;
      case ActionTypes["Diplomacy"]:
      case ActionTypes["Hyperbolic Regeneration Chamber"]:
      case ActionTypes["Incite Violence"]:
        return 60000;
      default:
        workerScript.log("bladeburner.getActionTime", errorLogText);
        return -1;
    }
  }

  getActionEstimatedSuccessChanceNetscriptFn(
    player: IPlayer,
    type: string,
    name: string,
    workerScript: WorkerScript,
  ): number[] {
    const errorLogText = `Invalid action: type='${type}' name='${name}'`;
    const actionId = this.getActionIdFromTypeAndName(type, name);
    if (actionId == null) {
      workerScript.log("bladeburner.getActionEstimatedSuccessChance", errorLogText);
      return [-1, -1];
    }

    const actionObj = this.getActionObject(actionId);
    if (actionObj == null) {
      workerScript.log("bladeburner.getActionEstimatedSuccessChance", errorLogText);
      return [-1, -1];
    }

    switch (actionId.type) {
      case ActionTypes["Contract"]:
      case ActionTypes["Operation"]:
      case ActionTypes["BlackOp"]:
      case ActionTypes["BlackOperation"]:
        return actionObj.getEstSuccessChance(this);
      case ActionTypes["Training"]:
      case ActionTypes["Field Analysis"]:
      case ActionTypes["FieldAnalysis"]:
      case ActionTypes["Diplomacy"]:
      case ActionTypes["Hyperbolic Regeneration Chamber"]:
      case ActionTypes["Incite Violence"]:
        return [1, 1];
      case ActionTypes["Recruitment"]: {
        const recChance = this.getRecruitmentSuccessChance(player);
        return [recChance, recChance];
      }
      default:
        workerScript.log("bladeburner.getActionEstimatedSuccessChance", errorLogText);
        return [-1, -1];
    }
  }

  getActionCountRemainingNetscriptFn(type: string, name: string, workerScript: WorkerScript): number {
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
        return Math.floor(actionObj.count);
      case ActionTypes["BlackOp"]:
      case ActionTypes["BlackOperation"]:
        if (this.blackops[name] != null) {
          return 0;
        } else {
          return 1;
        }
      case ActionTypes["Training"]:
      case ActionTypes["Recruitment"]:
      case ActionTypes["Field Analysis"]:
      case ActionTypes["FieldAnalysis"]:
      case ActionTypes["Diplomacy"]:
      case ActionTypes["Hyperbolic Regeneration Chamber"]:
      case ActionTypes["Incite Violence"]:
        return Infinity;
      default:
        workerScript.log("bladeburner.getActionCountRemaining", errorLogText);
        return -1;
    }
  }

  getSkillLevelNetscriptFn(skillName: string, workerScript: WorkerScript): number {
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

  getSkillUpgradeCostNetscriptFn(skillName: string, workerScript: WorkerScript): number {
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

  upgradeSkillNetscriptFn(skillName: string, workerScript: WorkerScript): boolean {
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

    if (skill.maxLvl && currentLevel >= skill.maxLvl) {
      workerScript.log("bladeburner.upgradeSkill", `Skill '${skillName}' is already maxed.`);
      return false;
    }

    if (this.skillPoints < cost) {
      workerScript.log(
        "bladeburner.upgradeSkill",
        `You do not have enough skill points to upgrade ${skillName} (You have ${this.skillPoints}, you need ${cost})`,
      );
      return false;
    }

    this.skillPoints -= cost;
    this.upgradeSkill(skill);
    workerScript.log("bladeburner.upgradeSkill", `'${skillName}' upgraded to level ${this.skills[skillName]}`);
    return true;
  }

  getTeamSizeNetscriptFn(type: string, name: string, workerScript: WorkerScript): number {
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

    if (
      actionId.type === ActionTypes["Operation"] ||
      actionId.type === ActionTypes["BlackOp"] ||
      actionId.type === ActionTypes["BlackOperation"]
    ) {
      return actionObj.teamCount;
    } else {
      return 0;
    }
  }

  setTeamSizeNetscriptFn(type: string, name: string, size: number, workerScript: WorkerScript): number {
    const errorLogText = `Invalid action: type='${type}' name='${name}'`;
    const actionId = this.getActionIdFromTypeAndName(type, name);
    if (actionId == null) {
      workerScript.log("bladeburner.setTeamSize", errorLogText);
      return -1;
    }

    if (
      actionId.type !== ActionTypes["Operation"] &&
      actionId.type !== ActionTypes["BlackOp"] &&
      actionId.type !== ActionTypes["BlackOperation"]
    ) {
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
    if (this.teamSize < sanitizedSize) {
      sanitizedSize = this.teamSize;
    }
    actionObj.teamCount = sanitizedSize;
    workerScript.log("bladeburner.setTeamSize", `Team size for '${name}' set to ${sanitizedSize}.`);
    return sanitizedSize;
  }

  joinBladeburnerFactionNetscriptFn(workerScript: WorkerScript): boolean {
    const bladeburnerFac = Factions["Bladeburners"];
    if (bladeburnerFac.isMember) {
      return true;
    } else if (this.rank >= BladeburnerConstants.RankNeededForFaction) {
      joinFaction(bladeburnerFac);
      workerScript.log("bladeburner.joinBladeburnerFaction", "Joined Bladeburners faction.");
      return true;
    } else {
      workerScript.log(
        "bladeburner.joinBladeburnerFaction",
        `You do not have the required rank (${this.rank}/${BladeburnerConstants.RankNeededForFaction}).`,
      );
      return false;
    }
  }

  /**
   * Serialize the current object to a JSON save state.
   */
  toJSON(): any {
    return Generic_toJSON("Bladeburner", this);
  }

  /**
   * Initiatizes a Bladeburner object from a JSON save state.
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static fromJSON(value: any): Bladeburner {
    return Generic_fromJSON(Bladeburner, value.data);
  }
}

Reviver.constructors.Bladeburner = Bladeburner;
