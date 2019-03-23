import { Augmentations }                            from "./Augmentation/Augmentations";
import { AugmentationNames }                        from "./Augmentation/data/AugmentationNames";
import { BitNodeMultipliers }                       from "./BitNode/BitNodeMultipliers";
import { CONSTANTS }                                from "./Constants";
import { Engine }                                   from "./engine";
import { Faction }                                  from "./Faction/Faction";
import { Factions, factionExists }                  from "./Faction/Factions";
import { joinFaction, displayFactionContent }       from "./Faction/FactionHelpers";
import { Locations }                                from "./Locations";
import { Player }                                   from "./Player";
import { hackWorldDaemon, redPillFlag }             from "./RedPill";
import { numeralWrapper }                           from "./ui/numeralFormat";
import { setTimeoutRef }                            from "./utils/SetTimeoutRef";
import { KEY }                                      from "../utils/helpers/keyCodes";

import { createProgressBarText }                    from "../utils/helpers/createProgressBarText";
import { dialogBoxCreate }                          from "../utils/DialogBox";
import { removeChildrenFromElement }                from "../utils/uiHelpers/removeChildrenFromElement";
import { Reviver, Generic_toJSON,
         Generic_fromJSON }                         from "../utils/JSONReviver";
import { addOffset }                                from "../utils/helpers/addOffset";
import { appendLineBreaks }                         from "../utils/uiHelpers/appendLineBreaks";
import { clearObject }                              from "../utils/helpers/clearObject";
import { createElement }                            from "../utils/uiHelpers/createElement";
import { createPopup }                              from "../utils/uiHelpers/createPopup";
import { Page, routing }                            from "./ui/navigationTracking";
import { exceptionAlert }                           from "../utils/helpers/exceptionAlert";
import { formatNumber }                             from "../utils/StringHelperFunctions";
import { getRandomInt }                             from "../utils/helpers/getRandomInt";
import { getTimestamp }                             from "../utils/helpers/getTimestamp";
import { removeElement }                            from "../utils/uiHelpers/removeElement";
import { removeElementById }                        from "../utils/uiHelpers/removeElementById";

const stealthIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 166 132"  style="fill:#adff2f;"><g><path d="M132.658-0.18l-24.321,24.321c-7.915-2.71-16.342-4.392-25.087-4.392c-45.84,0-83,46-83,46   s14.1,17.44,35.635,30.844L12.32,120.158l12.021,12.021L144.68,11.841L132.658-0.18z M52.033,80.445   c-2.104-4.458-3.283-9.438-3.283-14.695c0-19.054,15.446-34.5,34.5-34.5c5.258,0,10.237,1.179,14.695,3.284L52.033,80.445z"/><path d="M134.865,37.656l-18.482,18.482c0.884,3.052,1.367,6.275,1.367,9.612c0,19.055-15.446,34.5-34.5,34.5   c-3.337,0-6.56-0.483-9.611-1.367l-10.124,10.124c6.326,1.725,12.934,2.743,19.735,2.743c45.84,0,83-46,83-46   S153.987,50.575,134.865,37.656z"/></g></svg>&nbsp;`
const killIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="-22 0 511 511.99561" style="fill:#adff2f;"><path d="m.496094 466.242188 39.902344-39.902344 45.753906 45.753906-39.898438 39.902344zm0 0"/><path d="m468.421875 89.832031-1.675781-89.832031-300.265625 300.265625 45.753906 45.753906zm0 0"/><path d="m95.210938 316.785156 16.84375 16.847656h.003906l83.65625 83.65625 22.753906-22.753906-100.503906-100.503906zm0 0"/><path d="m101.445312 365.300781-39.902343 39.902344 45.753906 45.753906 39.902344-39.902343-39.90625-39.902344zm0 0"/></svg>`

const CityNames = ["Aevum", "Chongqing", "Sector-12", "New Tokyo", "Ishima", "Volhaven"];

const CyclesPerSecond             = 5;   //Game cycle is 200 ms

const StaminaGainPerSecond        = 0.0085;
const BaseStaminaLoss             = 0.285; //Base stamina loss per action. Increased based on difficulty
const MaxStaminaToGainFactor      = 70000; //Max Stamina is divided by this to get bonus stamina gain

const DifficultyToTimeFactor      = 10;  //Action Difficulty divided by this to get base action time

//The difficulty multiplier affects stamina loss and hp loss of an action. Also affects
//experience gain. Its formula is:
//difficulty ^ exponentialFactor + difficulty / linearFactor
const DiffMultExponentialFactor     = 0.28;
const DiffMultLinearFactor          = 650;

// These factors are used to calculate action time.
// They affect how much action time is reduced based on your agility and dexterity
const EffAgiLinearFactor            = 10e3;
const EffDexLinearFactor            = 10e3;
const EffAgiExponentialFactor       = 0.04;
const EffDexExponentialFactor       = 0.035;

const BaseRecruitmentTimeNeeded     = 300; //Base time needed (s) to complete a Recruitment action

const PopulationThreshold           = 1e9; // Population which determines baseline success rate
const PopulationExponent            = 0.7; // Exponent that influences how different populations affect success rate
const ChaosThreshold                = 50; //City chaos level after which it starts making tasks harder

const BaseStatGain                  = 1;     //Base stat gain per second
const BaseIntGain                   = 0.001; //Base intelligence stat gain

const ActionCountGrowthPeriod       = 480; //Time (s) it takes for action count to grow by its specified value

const RankToFactionRepFactor        = 2; //Delta Faction Rep = this * Delta Rank
const RankNeededForFaction          = 25;

const ContractSuccessesPerLevel     = 3; //How many successes you need to level up a contract
const OperationSuccessesPerLevel    = 2.5; //How many successes you need to level up an op

const RanksPerSkillPoint            = 3;  //How many ranks needed to get 1 Skill Point

const ContractBaseMoneyGain         = 250e3; //Base Money Gained per contract

const HrcHpGain         = 2;    // HP gained from Hyperbolic Regeneration Chamber
const HrcStaminaGain    = 0.1; // Stamina gained from Hyperbolic Regeneration Chamber

//DOM related variables
var ActiveActionCssClass        = "bladeburner-active-action";

//Console related stuff
var consoleHistoryIndex = 0;
var consoleHelpText = {
    helpList:"Use 'help [command]' to get more information about a particular Bladeburner console command.<br><br>" +
         "automate [var] [val] [hi/low] Configure simple automation for Bladeburner tasks<br>" +
         "clear/cls                     Clear the console<br>" +
         "help [cmd]                    Display this help text, or help text for a specific command<br>" +
         "log [en/dis] [type]           Enable or disable logging for events and actions<br>" +
         "skill [action] [name]         Level or display info about your Bladeburner skills<br>" +
         "start [type] [name]           Start a Bladeburner action/task<br>"  +
         "stop                          Stops your current Bladeburner action/task<br>",
    automate:"automate [var] [val] [hi/low]<br><br>" +
             "A simple way to automate your Bladeburner actions. This console command can be used " +
             "to automatically start an action when your stamina rises above a certain threshold, and " +
             "automatically switch to another action when your stamina drops below another threshold.<br><br>" +
             "automate status - Check the current status of your automation and get a brief description of what it'll do<br>" +
             "automate en - Enable the automation feature<br>" +
             "automate dis - Disable the automation feature<br><br>" +
             "There are four properties that must be set for this automation to work properly. Here is how to set them:<br><br>" +
             "automate stamina 100 high<br>" +
             "automate contract Tracking high<br>" +
             "automate stamina 50 low<br>" +
             'automate general "Field Analysis" low<br><br>' +
             "Using the four console commands above will set the automation to perform Tracking contracts " +
             "if your stamina is 100 or higher, and then switch to Field Analysis if your stamina drops below " +
             "50. Note that when setting the action, the name of the action is CASE-SENSITIVE. It must " +
             "exactly match whatever the name is in the UI.",
    clear:"clear<br><br>Clears the console",
    cls:"cls<br><br>Clears the console",
    help:"help [command]<br><br>" +
         "Running 'help' with no arguments displays the general help text, which lists all console commands " +
         "and a brief description of what they do. A command can be specified to get more specific help text " +
         "about that particular command. For example:<br><br>" +
         "help automate<br><br>" +
         "will display specific information about using the automate console command",
    log:"log [en/dis] [type]<br><br>" +
        "Enable or disable logging. By default, the results of completing actions such as contracts/operations are logged " +
        "in the console. There are also random events that are logged in the console as well. The five categories of " +
        "things that get logged are:<br><br>" +
        "[general, contracts, ops, blackops, events]<br><br>" +
        "The logging for these categories can be enabled or disabled like so:<br><br>" +
        "log dis contracts - Disables logging that occurs when contracts are completed<br>" +
        "log en contracts - Enables logging that occurs when contracts are completed<br>" +
        "log dis events - Disables logging for Bladeburner random events<br><br>" +
        "Logging can be universally enabled/disabled using the 'all' keyword:<br><br>" +
        "log dis all<br>" +
        "log en all",
    skill:"skill [action] [name]<br><br>" +
          "Level or display information about your skills.<br><br>" +
          "To display information about all of your skills and your multipliers, use:<br><br>" +
          "skill list<br><br>" +
          "To display information about a specific skill, specify the name of the skill afterwards. " +
          "Note that the name of the skill is case-sensitive. Enter it exactly as seen in the UI. If " +
          "the name of the skill has whitespace, enclose the name of the skill in double quotation marks:<br><br>" +
          "skill list Reaper<br>" +
          'skill list "Digital Observer"<br><br>' +
          "This console command can also be used to level up skills:<br><br>" +
          "skill level [skill name]",
    start:"start [type] [name]<br><br>" +
          "Start an action. An action is specified by its type and its name. The " +
          "name is case-sensitive. It must appear exactly as it does in the UI. If " +
          "the name of the action has whitespace, enclose it in double quotation marks. " +
          "Valid action types include:<br><br>" +
          "[general, contract, op, blackop]<br><br>" +
          "Examples:<br><br>" +
          'start contract Tracking<br>' +
          'start op "Undercover Operation"<br>',
    stop:"stop<br><br>" +
         "Stop your current action and go idle",
}

//Keypresses for Console
$(document).keydown(function(event) {
    if (routing.isOn(Page.Bladeburner)) {
        //if (DomElems.consoleInput && !event.ctrlKey && !event.shiftKey && !event.altKey) {
        //    DomElems.consoleInput.focus();
        //}

        if (!(Player.bladeburner instanceof Bladeburner)) {return;}
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

            //Latest command, put nothing
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

function City(params={}) {
    this.name = params.name ? params.name : Locations.Sector12;

    //Synthoid population and estimate
    this.pop    = params.pop ? params.pop : getRandomInt(PopulationThreshold, 1.5 * PopulationThreshold);
    this.popEst = this.pop * (Math.random() + 0.5);

    //Number of Synthoid communities population and estimate
    this.comms          = params.comms  ? params.comms  : getRandomInt(5, 150);
    this.commsEst       = this.comms + getRandomInt(-5, 5);
    if (this.commsEst < 0) {this.commsEst = 0;}
    this.chaos          = 0;
}

City.prototype.improvePopulationEstimateByCount = function(n) {
    if (isNaN(n)) {throw new Error("NaN passeed into City.improvePopulationEstimateByCount()");}
    if (this.popEst < this.pop) {
        this.popEst += n;
        if (this.popEst > this.pop) {this.popEst = this.pop;}
    } else if (this.popEst > this.pop) {
        this.popEst -= n;
        if (this.popEst < this.pop) {this.popEst = this.pop;}
    }
}

//@p is the percentage, not the multiplier. e.g. pass in p = 5 for 5%
City.prototype.improvePopulationEstimateByPercentage = function(p, skillMult=1) {
    p = p*skillMult;
    if (isNaN(p)) {throw new Error("NaN passed into City.improvePopulationEstimateByPercentage()");}
    if (this.popEst < this.pop) {
        ++this.popEst; //In case estimate is 0
        this.popEst *= (1 + (p/100));
        if (this.popEst > this.pop) {this.popEst = this.pop;}
    } else if (this.popEst > this.pop) {
        this.popEst *= (1 - (p/100));
        if (this.popEst < this.pop) {this.popEst = this.pop;}
    }
}

City.prototype.improveCommunityEstimate = function(n=1) {
    if (isNaN(n)) {throw new Error("NaN passed into City.improveCommunityEstimate()");}
    if (this.commsEst < this.comms) {
        this.commsEst += n;
        if (this.commsEst > this.comms) {this.commsEst = this.comms;}
    } else if (this.commsEst > this.comms) {
        this.commsEst -= n;
        if (this.commsEst < this.comms) {this.commsEst = this.comms;}
    }
}

//@params options:
//  estChange(int): How much the estimate should change by
//  estOffset(int): Add offset to estimate (offset by percentage)
City.prototype.changePopulationByCount = function(n, params={}) {
    if (isNaN(n)) {throw new Error("NaN passed into City.changePopulationByCount()");}
    this.pop += n;
    if (params.estChange && !isNaN(params.estChange)) {this.popEst += params.estChange;}
    if (params.estOffset) {
        this.popEst = addOffset(this.popEst, params.estOffset);
    }
    this.popEst = Math.max(this.popEst, 0);
}

//@p is the percentage, not the multiplier. e.g. pass in p = 5 for 5%
//@params options:
//  changeEstEqually(bool) - Change the population estimate by an equal amount
//  nonZero (bool)         - Set to true to ensure that population always changes by at least 1
City.prototype.changePopulationByPercentage = function(p, params={}) {
    if (isNaN(p)) {throw new Error("NaN passed into City.changePopulationByPercentage()");}
    if (p === 0) {return;}
    var change = Math.round(this.pop * (p/100));

    //Population always changes by at least 1
    if (params.nonZero && change === 0) {
        p > 0 ? change = 1 : change = -1;
    }

    this.pop += change;
    if (params.changeEstEqually) {
        this.popEst += change;
        if (this.popEst < 0) {this.popEst = 0;}
    }
    return change;
}

City.prototype.changeChaosByCount = function(n) {
    if (isNaN(n)) {throw new Error("NaN passed into City.changeChaosByCount()");}
    if (n === 0) {return;}
    this.chaos += n;
    if (this.chaos < 0) {this.chaos = 0;}
}

//@p is the percentage, not the multiplier (e.g. pass in p = 5 for 5%)
City.prototype.changeChaosByPercentage = function(p) {
    if (isNaN(p)) {throw new Error("NaN passed into City.chaosChaosByPercentage()");}
    if (p === 0) {return;}
    var change = this.chaos * (p/100);
    this.chaos += change;
    if (this.chaos < 0) {this.chaos = 0;}
}

City.prototype.toJSON = function() {
    return Generic_toJSON("City", this);
}
City.fromJSON = function(value) {
    return Generic_fromJSON(City, value.data);
}
Reviver.constructors.City = City;

function Skill(params={name:"foo", desc:"foo"}) {
    if (params.name) {
        this.name = params.name;
    } else {
        throw new Error("Failed to initialize Bladeburner Skill. No name was specified in ctor");
    }
    if (params.desc) {
        this.desc = params.desc;
    } else {
        throw new Error("Failed to initialize Bladeburner Skills. No desc was specified in ctor");
    }
    this.baseCost       = params.baseCost   ? params.baseCost   : 1; //Cost is in Skill Points
    this.costInc        = params.costInc    ? params.costInc    : 1; //Additive cost increase per level

    if (params.maxLvl) {this.maxLvl = params.maxLvl;}

    //These benefits are additive. So total multiplier will be level (handled externally) times the
    //effects below
    if (params.successChanceAll)            {this.successChanceAll          = params.successChanceAll;}
    if (params.successChanceStealth)        {this.successChanceStealth      = params.successChanceStealth;}
    if (params.successChanceKill)           {this.successChanceKill         = params.successChanceKill;}
    if (params.successChanceContract)       {this.successChanceContract     = params.successChanceContract;}
    if (params.successChanceOperation)      {this.successChanceOperation    = params.successChanceOperation;}

    //This multiplier affects everything that increases synthoid population/community estimate
    //e.g. Field analysis, Investigation Op, Undercover Op
    if (params.successChanceEstimate)       {this.successChanceEstimate     = params.successChanceEstimate;}

    if (params.actionTime)                  {this.actionTime                = params.actionTime;}
    if (params.effHack)                     {this.effHack                   = params.effHack;}
    if (params.effStr)                      {this.effStr                    = params.effStr;}
    if (params.effDef)                      {this.effDef                    = params.effDef;}
    if (params.effDex)                      {this.effDex                    = params.effDex;}
    if (params.effAgi)                      {this.effAgi                    = params.effAgi;}
    if (params.effCha)                      {this.effCha                    = params.effCha;}

    if (params.stamina)                     {this.stamina                   = params.stamina;}
    if (params.money)                       {this.money                     = params.money;}
    if (params.expGain)                     {this.expGain                   = params.expGain;}

    //Equipment
    if (params.weaponAbility)       {this.weaponAbility     = params.weaponAbility;}
    if (params.gunAbility)          {this.gunAbility        = params.gunAbility;}
}

Skill.prototype.calculateCost = function(currentLevel) {
    return Math.floor((this.baseCost + (currentLevel * this.costInc)) * BitNodeMultipliers.BladeburnerSkillCost);
}
var Skills = {};
var SkillNames = {
    BladesIntuition:    "Blade's Intuition",
    Cloak:              "Cloak",
    Marksman:           "Marksman",
    WeaponProficiency:  "Weapon Proficiency",
    ShortCircuit:       "Short-Circuit",
    DigitalObserver:    "Digital Observer",
    Tracer:             "Tracer",
    Overclock:          "Overclock",
    Reaper:             "Reaper",
    EvasiveSystem:      "Evasive System",
    Datamancer:         "Datamancer",
    CybersEdge:         "Cyber's Edge",
    HandsOfMidas:       "Hands of Midas",
    Hyperdrive:         "Hyperdrive",
}

//Base Class for Contracts, Operations, and BlackOps
function Action(params={}) {
    this.name           = params.name       ? params.name       : "";
    this.desc           = params.desc       ? params.desc       : "";

    //Difficulty scales with level
    //Exact formula is not set in stone
    //Initial design: baseDifficulty * (difficultyFac ^ level)?
    //difficulty Fac is slightly greater than 1
    this.level          = 1;
    this.maxLevel       = 1;
    this.autoLevel      = true;
    this.baseDifficulty = params.baseDifficulty ? addOffset(params.baseDifficulty, 10) : 100;
    this.difficultyFac  = params.difficultyFac  ? params.difficultyFac  : 1.01;

    //Rank increase/decrease is affected by this exponent
    this.rewardFac      = params.rewardFac ? params.rewardFac : 1.02;

    this.successes      = 0;
    this.failures       = 0;

    //All of these scale with level/difficulty
    this.rankGain = params.rankGain ? params.rankGain   : 0;
    if (params.rankLoss) {this.rankLoss = params.rankLoss;}
    if (params.hpLoss) {
        this.hpLoss = params.hpLoss;
        this.hpLost = 0;
    }

    //Action Category. Current categories are stealth and kill
    this.isStealth  = params.isStealth ? true : false;
    this.isKill     = params.isKill ? true : false;

    //Number of this contract remaining, and its growth rate
    //Growth rate is an integer and the count will increase by that integer every "cycle"
    this.count          = params.count          ? params.count          : getRandomInt(1e3, 25e3);
    this.countGrowth    = params.countGrowth    ? params.countGrowth    : getRandomInt(1, 5);

    //Weighting of each stat in determining action success rate
    var defaultWeights = {hack:1/7,str:1/7,def:1/7,dex:1/7,agi:1/7,cha:1/7,int:1/7};
    this.weights       = params.weights    ? params.weights    : defaultWeights;

    //Check to make sure weights are summed properly
    var sum = 0;
    for (var weight in this.weights) {
        if (this.weights.hasOwnProperty(weight)) {
            sum += this.weights[weight];
        }
    }
    if (sum - 1 >= 10 * Number.EPSILON) {
        throw new Error("Invalid weights when constructing Action " + this.name +
                        ". The weights should sum up to 1. They sum up to :" + 1);
    }

    //Diminishing returns of stats (stat ^ decay where 0 <= decay <= 1)
    var defaultDecays = {hack:0.9,str:0.9,def:0.9,dex:0.9,agi:0.9,cha:0.9,int:0.9};
    this.decays       = params.decays     ? params.decays     : defaultDecays;
    for (var decay in this.decays) {
        if (this.decays.hasOwnProperty(decay)) {
            if (this.decays[decay] > 1) {
                throw new Error("Invalid decays when constructing " +
                                "Action " + this.name + ". " +
                                "Decay value cannot be greater than 1");
            }
        }
    }
}

Action.prototype.getDifficulty = function() {
    var difficulty = this.baseDifficulty * Math.pow(this.difficultyFac, this.level-1);
    if (isNaN(difficulty)) {throw new Error("Calculated NaN in Action.getDifficulty()");}
    return difficulty;
}

//@inst - Bladeburner Object
//@params - options:
//  est (bool): Get success chance estimate instead of real success chance
Action.prototype.getSuccessChance = function(inst, params={}) {
    if (inst == null) {throw new Error("Invalid Bladeburner instance passed into Action.getSuccessChance");}
    var difficulty = this.getDifficulty();
    var competence = 0;
    for (var stat in this.weights) {
        if (this.weights.hasOwnProperty(stat)) {
            var playerStatLvl = Player.queryStatFromString(stat);
            var key = "eff" + stat.charAt(0).toUpperCase() + stat.slice(1);
            var effMultiplier = inst.skillMultipliers[key];
            if (effMultiplier == null) {
                console.log("ERROR: Failed to find Bladeburner Skill multiplier for: " + stat);
                effMultiplier = 1;
            }
            competence += (this.weights[stat] * Math.pow(effMultiplier*playerStatLvl, this.decays[stat]));
        }
    }
    competence *= inst.calculateStaminaPenalty();

    //For Operations, factor in team members
    if (this instanceof Operation || this instanceof BlackOperation) {
        if (this.teamCount && this.teamCount > 0) {
            this.teamCount = Math.min(this.teamCount, inst.teamSize);
            var teamMultiplier = Math.pow(this.teamCount, 0.05);
            competence *= teamMultiplier;
        }
    }

    //Lower city population results in lower chances
    if (!(this instanceof BlackOperation)) {
        var city = inst.getCurrentCity();
        if (params.est) {
            competence *= Math.pow((city.popEst / PopulationThreshold), PopulationExponent);
        } else {
            competence *= Math.pow((city.pop / PopulationThreshold), PopulationExponent);
        }

        //Too high of a chaos results in lower chances
        if (city.chaos > ChaosThreshold) {
            var diff = 1 + (city.chaos - ChaosThreshold);
            var mult = Math.pow(diff, 0.1);
            difficulty *= mult;
        }

        //For Raid Operations, no communities = fail
        if (this instanceof Operation && this.name === "Raid") {
            if (city.comms <= 0) {return 0;}
        }
    }

    //Factor skill multipliers into success chance
    competence *= inst.skillMultipliers.successChanceAll;
    if (this instanceof Operation || this instanceof BlackOperation) {
        competence *= inst.skillMultipliers.successChanceOperation;
    }
    if (this instanceof Contract) {
        competence *= inst.skillMultipliers.successChanceContract;
    }
    if (this.isStealth) {
        competence *= inst.skillMultipliers.successChanceStealth;
    }
    if (this.isKill) {
        competence *= inst.skillMultipliers.successChanceKill;
    }

    //Augmentation multiplier
    competence *= Player.bladeburner_success_chance_mult;

    if (isNaN(competence)) {throw new Error("Competence calculated as NaN in Action.getSuccessChance()");}
    return Math.min(1, competence / difficulty);
}

//Tests for success. Should be called when an action has completed
//  @inst - Bladeburner Object
Action.prototype.attempt = function(inst) {
    return (Math.random() < this.getSuccessChance(inst));
}

Action.prototype.getActionTime = function(inst) {
    var difficulty = this.getDifficulty();
    var baseTime = difficulty / DifficultyToTimeFactor;
    var skillFac = inst.skillMultipliers.actionTime; //Always < 1

    var effAgility      = Player.agility * inst.skillMultipliers.effAgi;
    var effDexterity    = Player.dexterity * inst.skillMultipliers.effDex;
    var statFac = 0.5 * (Math.pow(effAgility, EffAgiExponentialFactor) +
                         Math.pow(effDexterity, EffDexExponentialFactor) +
                         (effAgility / EffAgiLinearFactor) +
                         (effDexterity / EffDexLinearFactor)); //Always > 1

    baseTime = Math.max(1, baseTime * skillFac / statFac);

    if (this instanceof Contract) {
        return Math.ceil(baseTime);
    } else if (this instanceof Operation) {
        return Math.ceil(baseTime);
    } else if (this instanceof BlackOperation) {
        return Math.ceil(baseTime * 1.5);
    } else {
        throw new Error("Unrecognized Action Type in Action.getActionTime(this). Must be either Contract, Operation, or BlackOperation");
    }
}

Action.prototype.getSuccessesNeededForNextLevel = function(baseSuccessesPerLevel) {
    return Math.ceil((0.5) * (this.maxLevel) * (2 * baseSuccessesPerLevel + (this.maxLevel-1)));
}

Action.prototype.setMaxLevel = function(baseSuccessesPerLevel) {
    if (this.successes >= this.getSuccessesNeededForNextLevel(baseSuccessesPerLevel)) {
        ++this.maxLevel;
    }
}

Action.prototype.toJSON = function() {
    return Generic_toJSON("Action", this);
}
Action.fromJSON = function(value) {
    return Generic_fromJSON(Action, value.data);
}
Reviver.constructors.Action = Action;
var GeneralActions = {}; //Training, Field Analysis, Recruitment, etc.

//Action Identifier
const ActionTypes = Object.freeze({
    "Idle":                             1,
    "Contract":                         2,
    "Operation":                        3,
    "BlackOp":                          4,
    "BlackOperation":                   4,
    "Training":                         5,
    "Recruitment":                      6,
    "FieldAnalysis":                    7,
    "Field Analysis":                   7,
    "Diplomacy":                        8,
    "Hyperbolic Regeneration Chamber":  9,
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

//Contracts
function Contract(params={}) {
    Action.call(this, params);
}
Contract.prototype = Object.create(Action.prototype);
Contract.prototype.toJSON = function() {
    return Generic_toJSON("Contract", this);
}
Contract.fromJSON = function(value) {
    return Generic_fromJSON(Contract, value.data);
}
Reviver.constructors.Contract = Contract;

//Operations
function Operation(params={}) {
    Action.call(this, params);
    this.reqdRank   = params.reqdRank   ? params.reqdRank : 100;
    this.teamCount  = params.teamCount  ? params.teamCount : 0; //# of team members to use
}
Operation.prototype = Object.create(Action.prototype);
Operation.prototype.toJSON = function() {
    return Generic_toJSON("Operation", this);
}
Operation.fromJSON = function(value) {
    return Generic_fromJSON(Operation, value.data);
}
Reviver.constructors.Operation = Operation;

//Black Operations
function BlackOperation(params={}) {
    Operation.call(this, params);

    //Black ops are one time missions
    this.count = 1;
    this.countGrowth = 0;
}
BlackOperation.prototype = Object.create(Action.prototype);
BlackOperation.prototype.toJSON = function() {
    return Generic_toJSON("BlackOperation", this);
}
BlackOperation.fromJSON = function(value) {
    return Generic_fromJSON(BlackOperation, value.data);
}
Reviver.constructors.BlackOperation = BlackOperation;
var BlackOperations = {};

function Bladeburner(params={}) {
    this.numHosp        = 0; //Number of hospitalizations
    this.moneyLost      = 0; //Money lost due to hospitalizations
    this.rank           = 0;
    this.maxRank        = 0; //Used to determine skill points

    this.skillPoints        = 0;
    this.totalSkillPoints   = 0;

    this.teamSize       = 0; //Number of team members
    this.teamLost       = 0; //Number of team members lost

    this.storedCycles   = 0;

    this.randomEventCounter = getRandomInt(240, 600); //4-10 minutes

    //These times are in seconds
    this.actionTimeToComplete   = 0; //0 or -1 is an infinite running action (like training)
    this.actionTimeCurrent      = 0;

    //ActionIdentifier Object
    var idleActionType = ActionTypes["Idle"];
    this.action = new ActionIdentifier({type:idleActionType});

    this.cities = {};
    for (var i = 0; i < CityNames.length; ++i) {
        this.cities[CityNames[i]] =  new City({name:CityNames[i]});
    }
    this.city = Locations.Sector12;

    //Map of SkillNames -> level
    this.skills = {};
    this.skillMultipliers = {};
    this.updateSkillMultipliers(); //Calls resetSkillMultipliers()

    //Max Stamina is based on stats and Bladeburner-specific bonuses
    this.staminaBonus   = 0;    //Gained from training
    this.maxStamina     = 0;
    this.calculateMaxStamina();
    this.stamina        = this.maxStamina;

    //Contracts and Operations objects. These objects have unique
    //properties because they are randomized in each instance and have stats like
    //successes/failures, so they need to be saved/loaded by the game.
    this.contracts = {};
    this.operations = {};

    //Object that contains name of all Black Operations that have been completed
    this.blackops = {};

    //Flags for whether these actions should be logged to console
    this.logging = {
        general:true,
        contracts:true,
        ops:true,
        blackops:true,
        events:true,
    }

    //Simple automation values
    this.automateEnabled = false;
    this.automateActionHigh = 0;
    this.automateThreshHigh = 0; //Stamina Threshold
    this.automateActionLow = 0;
    this.automateThreshLow = 0; //Stamina Threshold

    //Console command history
    this.consoleHistory = [];
    this.consoleLogs = [];

    //Initialization
    initBladeburner();
    this.initializeDomElementRefs();
    if (params.new) {this.create();}
}

Bladeburner.prototype.prestige = function() {
    this.resetAction();
    var bladeburnerFac = Factions["Bladeburners"];
    if (this.rank >= RankNeededForFaction) {
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
        isStealth:true
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
        isKill:true
    });
    this.contracts["Retirement"] = new Contract({
        name:"Retirement",
        desc:"Hunt down and retire (kill) rogue Synthoids.<br><br>" +
             "Successfully copmleting a Retirement contract will lower the population in your current " +
             "city, and will also increase its chaos level.",
        baseDifficulty:200, difficultyFac:1.03, rewardFac:1.065,
        rankGain:0.6, hpLoss:1,
        count:getRandomInt(5, 150), countGrowth:getRandomInt(5, 75)/10,
        weights:{hack:0,str:0.2,def:0.2,dex:0.2,agi:0.2,cha:0.1, int:0.1},
        decays:{hack:0,str:0.91,def:0.91,dex:0.91,agi:0.91,cha:0.8, int:0.9},
        isKill:true
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
        isStealth:true
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
        isStealth:true
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
        isStealth:true
    });
    this.operations["Raid"] = new Operation({
        name:"Raid",
        desc:"Lead an assault on a known Synthoid community. Note that " +
             "there must be an existing Synthoid community in your current city " +
             "in order for this Operation to be successful",
        baseDifficulty:800, difficultyFac:1.045, rewardFac:1.1, reqdRank:3000,
        rankGain:55,rankLoss:2.5,hpLoss:50,
        count:getRandomInt(1, 150), countGrowth:getRandomInt(2, 40)/10,
        weights:{hack:0.1,str:0.2,def:0.2,dex:0.2,agi:0.2,cha:0, int:0.1},
        decays:{hack:0.7,str:0.8,def:0.8,dex:0.8,agi:0.8,cha:0, int:0.9},
        isKill:true
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
        isStealth:true, isKill:true
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
        isStealth:true, isKill:true
    });
}

Bladeburner.prototype.storeCycles = function(numCycles=1) {
    this.storedCycles += numCycles;
}

Bladeburner.prototype.process = function() {
    //Extreme condition...if Operation Daedalus is complete trigger the BitNode
    if (redPillFlag === false && this.blackops.hasOwnProperty("Operation Daedalus")) {
        return hackWorldDaemon(Player.bitNodeN);
    }

    //If the Player starts doing some other actions, set action to idle and alert
    if (Augmentations[AugmentationNames.BladesSimulacrum].owned === false && Player.isWorking) {
        if (this.action.type !== ActionTypes["Idle"]) {
            let msg = "Your Bladeburner action was cancelled because you started doing something else.";
            if (this.automateEnabled) {
                msg += `<br><br>Your automation was disabled as well. You will have to re-enable it through the Bladeburner console`
                this.automateEnabled = false;
            }
            dialogBoxCreate(msg);
        }
        this.resetAction();
    }

    // If the Player has no Stamina, set action to idle
    if (this.stamina <= 0) {
        this.log("Your Bladeburner action was cancelled because your stamina hit 0");
        this.resetAction();
    }

    //A 'tick' for this mechanic is one second (= 5 game cycles)
    if (this.storedCycles >= CyclesPerSecond) {
        var seconds = Math.floor(this.storedCycles / CyclesPerSecond);
        seconds = Math.min(seconds, 5); //Max of 5 'ticks'
        this.storedCycles -= seconds * CyclesPerSecond;

        //Stamina
        this.calculateMaxStamina();
        this.stamina += (this.calculateStaminaGainPerSecond() * seconds);
        this.stamina = Math.min(this.maxStamina, this.stamina);

        //Count increase for contracts/operations
        for (var contractName in this.contracts) {
            if (this.contracts.hasOwnProperty(contractName)) {
                var contract = this.contracts[contractName];
                contract.count += (seconds * contract.countGrowth/ActionCountGrowthPeriod);
            }
        }
        for (var operationName in this.operations) {
            if (this.operations.hasOwnProperty(operationName)) {
                var op = this.operations[operationName];
                op.count += (seconds * op.countGrowth/ActionCountGrowthPeriod);
            }
        }

        //Chaos goes down very slowly
        for (var i = 0; i < CityNames.length; ++i) {
            var city = this.cities[CityNames[i]];
            if (!(city instanceof City)) {throw new Error("Invalid City object when processing passive chaos reduction in Bladeburner.process");}
            city.chaos -= (0.0001 * seconds);
            city.chaos = Math.max(0, city.chaos);
        }

        //Random Events
        this.randomEventCounter -= seconds;
        if (this.randomEventCounter <= 0) {
            this.randomEvent();
            this.randomEventCounter = getRandomInt(240, 600);
        }

        this.processAction(seconds);

        //Automation
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
    var effAgility = Player.agility * this.skillMultipliers.effAgi;
    var maxStamina = (Math.pow(effAgility, 0.8) + this.staminaBonus);
    maxStamina *= this.skillMultipliers.stamina;
    maxStamina *= Player.bladeburner_max_stamina_mult;
    if (isNaN(maxStamina)) {throw new Error("Max Stamina calculated to be NaN in Bladeburner.calculateMaxStamina()");}
    this.maxStamina = maxStamina;
}

Bladeburner.prototype.calculateStaminaGainPerSecond = function() {
    var effAgility = Player.agility * this.skillMultipliers.effAgi;
    var maxStaminaBonus = this.maxStamina / MaxStaminaToGainFactor;
    var gain = (StaminaGainPerSecond + maxStaminaBonus) * Math.pow(effAgility, 0.17);
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
            bladeburnerFac.playerReputation += (RankToFactionRepFactor * change * Player.faction_rep_mult * favorBonus);
        }
    }

    // Gain skill points
    var rankNeededForSp = (this.totalSkillPoints+1) * RanksPerSkillPoint;
    if (this.maxRank >= rankNeededForSp) {
        //Calculate how many skill points to gain
        var gainedSkillPoints = Math.floor((this.maxRank - rankNeededForSp) / RanksPerSkillPoint + 1);
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
        weaponAbility: 1,
        gunAbility: 1,
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
    //This does NOT handle deduction of skill points
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
    //Given an ActionIdentifier object, returns the corresponding
    //GeneralAction, Contract, Operation, or BlackOperation object
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
        default:
            return null;
    }
}

//Sets the player to the "IDLE" action
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
        console.log("action.type: " + this.action.type);
        throw new Error("Invalid actionTimeToComplete value: " + this.actionTimeToComplete);
    }
    if (!(this.action instanceof ActionIdentifier)) {
        throw new Error("Bladeburner.action is not an ActionIdentifier Object");
    }

    this.actionTimeCurrent += seconds;
    if (this.actionTimeCurrent >= this.actionTimeToComplete) {
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
                var difficultyMultiplier = Math.pow(difficulty, DiffMultExponentialFactor) + difficulty / DiffMultLinearFactor;
                var rewardMultiplier = Math.pow(action.rewardFac, action.level-1);

                //Stamina loss is based on difficulty
                this.stamina -= (BaseStaminaLoss * difficultyMultiplier);
                if (this.stamina < 0) {this.stamina = 0;}

                //Process Contract/Operation success/failure
                if (action.attempt(this)) {
                    this.gainActionStats(action, true);
                    ++action.successes;
                    --action.count;

                    //Earn money for contracts
                    var moneyGain = 0;
                    if (!isOperation) {
                        moneyGain = ContractBaseMoneyGain * rewardMultiplier * this.skillMultipliers.money;
                        Player.gainMoney(moneyGain);
                        Player.recordMoneySource(moneyGain, "bladeburner");
                    }

                    if (isOperation) {
                        action.setMaxLevel(OperationSuccessesPerLevel);
                    } else {
                        action.setMaxLevel(ContractSuccessesPerLevel);
                    }
                    if (action.rankGain) {
                        var gain = addOffset(action.rankGain * rewardMultiplier * BitNodeMultipliers.BladeburnerRank, 10);
                        this.changeRank(gain);
                        if (isOperation && this.logging.ops) {
                            this.log(action.name + " successfully completed! Gained " + formatNumber(gain, 3) + " rank");
                        } else if (!isOperation && this.logging.contracts) {
                            this.log(action.name + " contract successfully completed! Gained " + formatNumber(gain, 3) + " rank and " + numeralWrapper.format(moneyGain, "$0.000a"));
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
                        if (Player.takeDamage(damage)) {
                            ++this.numHosp;
                            this.moneyLost += (CONSTANTS.HospitalCostPerHp * Player.max_hp);
                        }
                    }
                    var logLossText = "";
                    if (loss > 0)   {logLossText += "Lost " + formatNumber(loss, 3) + " rank.";}
                    if (damage > 0) {logLossText += "Took " + formatNumber(damage, 0) + " damage.";}
                    if (isOperation && this.logging.ops) {
                        this.log(action.name + " failed! " + logLossText);
                    } else if (!isOperation && this.logging.contracts) {
                        this.log(action.name + " contract failed! " + logLossText);
                    }
                    isOperation ? this.completeOperation(false) : this.completeContract(false);
                }
                if (action.autoLevel) {action.level = action.maxLevel;} //Autolevel
                this.startAction(this.action); //Repeat action
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
                var difficultyMultiplier = Math.pow(difficulty, DiffMultExponentialFactor) + difficulty / DiffMultLinearFactor;

                //Stamina loss is based on difficulty
                this.stamina -= (BaseStaminaLoss * difficultyMultiplier);
                if (this.stamina < 0) {this.stamina = 0;}

                //Team loss variables
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

                    //Operation Daedalus
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
                        if (Player.takeDamage(damage)) {
                            ++this.numHosp;
                            this.moneyLost += (CONSTANTS.HospitalCostPerHp * Player.max_hp);
                        }
                    }
                    teamLossMax = Math.floor(teamCount);

                    if (this.logging.blackops) {
                        this.log(action.name + " failed! Lost " + formatNumber(rankLoss, 1) + " rank and took " + formatNumber(damage, 0) + " damage");
                    }
                }

                this.resetAction(); //Stop regardless of success or fail

                //Calculate team lossses
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
            this.stamina -= (0.5 * BaseStaminaLoss);
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
            this.startAction(this.action); //Repeat action
            break;
        case ActionTypes["FieldAnalysis"]:
        case ActionTypes["Field Analysis"]:
            //Does not use stamina. Effectiveness depends on hacking, int, and cha
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
            Player.gainIntelligenceExp(BaseIntGain);
            Player.gainCharismaExp(charismaExpGain);
            this.changeRank(0.1 * BitNodeMultipliers.BladeburnerRank);
            this.getCurrentCity().improvePopulationEstimateByPercentage(eff * this.skillMultipliers.successChanceEstimate);
            if (this.logging.general) {
                this.log("Field analysis completed. Gained 0.1 rank, " + formatNumber(hackingExpGain, 1) + " hacking exp, and " + formatNumber(charismaExpGain, 1) + " charisma exp");
            }
            this.startAction(this.action); //Repeat action
            break;
        case ActionTypes["Recruitment"]:
            var successChance = this.getRecruitmentSuccessChance();
            if (Math.random() < successChance) {
                var expGain = 2 * BaseStatGain * this.actionTimeToComplete;
                Player.gainCharismaExp(expGain);
                ++this.teamSize;
                if (this.logging.general) {
                    this.log("Successfully recruited a team member! Gained " + formatNumber(expGain, 1) + " charisma exp");
                }
            } else {
                var expGain = BaseStatGain * this.actionTimeToComplete;
                Player.gainCharismaExp(expGain);
                if (this.logging.general) {
                    this.log("Failed to recruit a team member. Gained " + formatNumber(expGain, 1) + " charisma exp");
                }
            }
            this.startAction(this.action); //Repeat action
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
        case ActionTypes["Hyperbolic Regeneration Chamber"]:
            Player.regenerateHp(HrcHpGain);
            this.stamina = Math.min(this.maxStamina, this.stamina + HrcStaminaGain);
            this.startAction(this.action);
            if (this.logging.general) {
                this.log(`Rested in Hyperbolic Regeneration Chamber. Restored ${HrcHpGain} HP and gained ${HrcStaminaGain} stamina`);
            }
            break;
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
                //Increase estimate accuracy by a relatively small amount
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

    //Calculate team losses
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
    return Math.max(10, Math.round(BaseRecruitmentTimeNeeded - charismaFactor));
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

//Process stat gains from Contracts, Operations, and Black Operations
//@action(Action obj) - Derived action class
//@success(bool) - Whether action was successful
Bladeburner.prototype.gainActionStats = function(action, success) {
    var difficulty = action.getDifficulty();

    //Gain multiplier based on difficulty. If this changes then the
    //same variable calculated in completeAction() needs to change too
    var difficultyMult = Math.pow(difficulty, DiffMultExponentialFactor) + difficulty / DiffMultLinearFactor;

    var time = this.actionTimeToComplete;
    var successMult = success ? 1 : 0.5;

    var unweightedGain = time * BaseStatGain * successMult * difficultyMult;
    var unweightedIntGain = time * BaseIntGain * successMult * difficultyMult;
    const skillMult = this.skillMultipliers.expGain;
    Player.gainHackingExp(unweightedGain    * action.weights.hack * Player.hacking_exp_mult * skillMult);
    Player.gainStrengthExp(unweightedGain   * action.weights.str  * Player.strength_exp_mult * skillMult);
    Player.gainDefenseExp(unweightedGain    * action.weights.def  * Player.defense_exp_mult * skillMult);
    Player.gainDexterityExp(unweightedGain  * action.weights.dex  * Player.dexterity_exp_mult * skillMult);
    Player.gainAgilityExp(unweightedGain    * action.weights.agi  * Player.agility_exp_mult * skillMult);
    Player.gainCharismaExp(unweightedGain   * action.weights.cha  * Player.charisma_exp_mult * skillMult);
    Player.gainIntelligenceExp(unweightedIntGain * action.weights.int * skillMult);
}

Bladeburner.prototype.randomEvent = function() {
    var chance = Math.random();

    //Choose random source/destination city for events
    var sourceCityName = CityNames[getRandomInt(0, 5)];
    var sourceCity = this.cities[sourceCityName];
    if (!(sourceCity instanceof City)) {
        throw new Error("sourceCity was not a City object in Bladeburner.randomEvent()");
    }

    var destCityName = CityNames[getRandomInt(0, 5)];
    while (destCityName === sourceCityName) {
        destCityName = CityNames[getRandomInt(0, 5)];
    }
    var destCity = this.cities[destCityName];

    if (!(sourceCity instanceof City) || !(destCity instanceof City)) {
        throw new Error("sourceCity/destCity was not a City object in Bladeburner.randomEvent()");
    }

    if (chance <= 0.05) {
        //New Synthoid Community, 5%
        ++sourceCity.comms;
        var percentage = getRandomInt(10, 20) / 100;
        var count = Math.round(sourceCity.pop * percentage);
        sourceCity.pop += count;
        if (this.logging.events) {
            this.log("Intelligence indicates that a new Synthoid community was formed in a city");
        }
    } else if (chance <= 0.1) {
        //Synthoid Community Migration, 5%
        if (sourceCity.comms <= 0) {
            //If no comms in source city, then instead trigger a new Synthoid community event
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

            //Change pop
            var percentage = getRandomInt(10, 20) / 100;
            var count = Math.round(sourceCity.pop * percentage);
            sourceCity.pop -= count;
            destCity.pop += count;

            if (this.logging.events) {
                this.log("Intelligence indicates that a Synthoid community migrated from " + sourceCityName + " to some other city");
            }
        }
    } else if  (chance <= 0.3) {
        //New Synthoids (non community), 20%
        var percentage = getRandomInt(8, 24) / 100;
        var count = Math.round(sourceCity.pop * percentage);
        sourceCity.pop += count;
        if (this.logging.events) {
            this.log("Intelligence indicates that the Synthoid population of " + sourceCityName + " just changed significantly");
        }
    } else if (chance <= 0.5) {
        //Synthoid migration (non community) 20%
        this.triggerMigration(sourceCityName);
        if (this.logging.events) {
            this.log("Intelligence indicates that a large number of Synthoids migrated from " + sourceCityName + " to some other city");
        }
    } else if (chance <= 0.7) {
        //Synthoid Riots (+chaos), 20%
        sourceCity.chaos += 1;
        sourceCity.chaos *= (1 + getRandomInt(5, 20) / 100);
        if (this.logging.events) {
            this.log("Tensions between Synthoids and humans lead to riots in " + sourceCityName + "! Chaos increased");
        }
    } else if (chance <= 0.9) {
        //Less Synthoids, 20%
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
        console.log("ERROR: Invalid 'chance' parameter passed into Bladeburner.triggerPotentialMigration()");
    }
    if (chance > 1) {chance /= 100;}
    if (Math.random() < chance) {this.triggerMigration(sourceCityName);}
}

Bladeburner.prototype.triggerMigration = function(sourceCityName) {
    var destCityName = CityNames[getRandomInt(0, 5)];
    while (destCityName === sourceCityName) {
        destCityName = CityNames[getRandomInt(0, 5)];
    }
    var destCity    = this.cities[destCityName];
    var sourceCity  = this.cities[sourceCityName];
    if (destCity == null || sourceCity == null) {
        throw new Error("Failed to find City with name: " + destCityName);
    }
    var rand = Math.random(), percentage = getRandomInt(3, 15) / 100;

    if (rand < 0.05 && sourceCity.comms > 0) { //5% chance for community migration
        percentage *= getRandomInt(2, 4); //Migration increases population change
        --sourceCity.comms;
        ++destCity.comms;
    }
    var count = Math.round(sourceCity.pop * percentage);
    sourceCity.pop -= count;
    destCity.pop += count;
}

var DomElems = {};

Bladeburner.prototype.initializeDomElementRefs = function() {
    DomElems = {
        bladeburnerDiv:     null,

        //Main Divs
        overviewConsoleParentDiv:  null,

        overviewDiv:        null, //Overview of stats that stays fixed on left
        actionAndSkillsDiv: null, //Panel for different sections (contracts, ops, skills)
        currentTab:         null, //Contracts, Operations, Black Ops, Skills

        consoleDiv:         null,
        consoleTable:       null,
        consoleInputRow:    null, //tr
        consoleInputCell:   null, //td
        consoleInputHeader: null, //"> "
        consoleInput:       null, //Actual input element

        //Overview Content
        overviewRank:               null,
        overviewStamina:            null,
        overviewStaminaHelpTip:     null,
        overviewGen1:               null, //Stamina Penalty, Team, Hospitalized stats, current city
        overviewEstPop:             null,
        overviewEstPopHelpTip:      null,
        overviewEstComms:           null,
        overviewChaos:              null,
        overviewSkillPoints:        null,
        overviewBonusTime:          null,
        overviewAugSuccessMult:     null,
        overviewAugMaxStaminaMult:  null,
        overviewAugStaminaGainMult: null,
        overviewAugAnalysisMult:    null,

        //Actions and Skills Content
        actionsAndSkillsDesc:   null,
        actionsAndSkillsList:   null, //ul element of all UI elements in this panel
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

    //Parent Div for Overview and Console
    DomElems.overviewConsoleParentDiv = createElement("div", {
        height:"60%", display:"block", position:"relative",
    });

    //Overview and Action/Skill pane
    DomElems.overviewDiv = createElement("div", {
        width:"30%", display:"inline-block", border:"1px solid white",
    });

    DomElems.actionAndSkillsDiv = createElement("div", {
        height:"60%", width:"70%", display:"block",
        border:"1px solid white", margin:"6px", padding:"6px",
    });

    DomElems.currentTab = "general";

    this.createOverviewContent();
    this.createActionAndSkillsContent();

    //Console
    DomElems.consoleDiv          = createElement("div", {
        class:"bladeburner-console-div",
        clickListener:()=>{
            if (DomElems.consoleInput instanceof Element) {
                DomElems.consoleInput.focus();
            }
            return false;
        }
    });
    DomElems.consoleTable        = createElement("table", {class:"bladeburner-console-table"});
    DomElems.consoleInputRow     = createElement("tr", {class:"bladeburner-console-input-row", id:"bladeubrner-console-input-row"});
    DomElems.consoleInputCell    = createElement("td", {class:"bladeburner-console-input-cell"});
    DomElems.consoleInputHeader  = createElement("pre", {innerText:"> "});
    DomElems.consoleInput        = createElement("input", {
        type:"text", class:"bladeburner-console-input", tabIndex:1,
        onfocus:()=>{DomElems.consoleInput.value = DomElems.consoleInput.value}
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
        clickListener: ()=> {
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
                "in your current city."
    });

    DomElems.overviewEstPopHelpTip = createElement("div", {
        innerText:"?", class:"help-tip",
        clickListener:()=>{
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
        }
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
                "Having too high of a chaos level can make contracts and operations harder."
    });

    DomElems.overviewBonusTime = createElement("p", {
      innerText: "Bonus time: ",
      display: "inline-block",
      tooltip: "You gain bonus time while offline or when the game is inactive (e.g. when the tab is throttled by browser). " +
               "Bonus time makes the Bladeburner mechanic progress faster, up to 5x the normal speed."
    });
    DomElems.overviewSkillPoints = createElement("p", {display:"block"});


    DomElems.overviewAugSuccessMult = createElement("p", {display:"block"});
    DomElems.overviewAugMaxStaminaMult = createElement("p", {display:"block"});
    DomElems.overviewAugStaminaGainMult = createElement("p", {display:"block"});
    DomElems.overviewAugAnalysisMult = createElement("p", {display:"block"});


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
    DomElems.overviewDiv.appendChild(DomElems.overviewAugSuccessMult);
    DomElems.overviewDiv.appendChild(DomElems.overviewAugMaxStaminaMult);
    DomElems.overviewDiv.appendChild(DomElems.overviewAugStaminaGainMult);
    DomElems.overviewDiv.appendChild(DomElems.overviewAugAnalysisMult);

    //Travel to new city button
    appendLineBreaks(DomElems.overviewDiv, 1);
    DomElems.overviewDiv.appendChild(createElement("a", {
        innerHTML:"Travel", class:"a-link-button", display:"inline-block",
        clickListener:()=>{
            var popupId = "bladeburner-travel-popup-cancel-btn";
            var popupArguments = [];
            popupArguments.push(createElement("a", { //Cancel Button
                innerText:"Cancel", class:"a-link-button",
                clickListener:()=>{
                    removeElementById(popupId); return false;
                }
            }))
            popupArguments.push(createElement("p", { //Info Text
                innerText:"Travel to a different city for your Bladeburner " +
                          "activities. This does not cost any money. The city you are " +
                          "in for your Bladeburner duties does not affect " +
                          "your location in the game otherwise",
            }));
            for (var i = 0; i < CityNames.length; ++i) {
            (function(inst, i) {
                popupArguments.push(createElement("div", {
                    //Reusing this css class...it adds a border and makes it
                    //so that background color changes when you hover
                    class:"cmpy-mgmt-find-employee-option",
                    innerText:CityNames[i],
                    clickListener:()=>{
                        inst.city = CityNames[i];
                        removeElementById(popupId);
                        inst.updateOverviewContent();
                        return false;
                    }
                }));
            })(this, i);
            }
            createPopup(popupId, popupArguments);
        }
    }));

    //Faction button
    const bladeburnersFactionName = "Bladeburners";
    if (factionExists(bladeburnersFactionName)) {
        var bladeburnerFac = Factions[bladeburnersFactionName];
        if (!(bladeburnerFac instanceof Faction)) {
            throw new Error("Could not properly get Bladeburner Faction object in Bladeburner UI Overview Faction button");
        }
        DomElems.overviewDiv.appendChild(createElement("a", {
            innerText:"Faction", class:"a-link-button", display:"inline-block",
            tooltip:"Apply to the Bladeburner Faction, or go to the faction page if you are already a member",
            clickListener:()=>{
                if (bladeburnerFac.isMember) {
                    Engine.loadFactionContent();
                    displayFactionContent(bladeburnersFactionName);
                } else {
                    if (this.rank >= RankNeededForFaction) {
                        joinFaction(bladeburnerFac);
                        dialogBoxCreate("Congratulations! You were accepted into the Bladeburners faction");
                        removeChildrenFromElement(DomElems.overviewDiv);
                        this.createOverviewContent();
                    } else {
                        dialogBoxCreate("You need a rank of 25 to join the Bladeburners Faction!")
                    }
                }
                return false;
            }
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
                clickListener:()=>{
                    DomElems.currentTab = buttons[i].toLowerCase();
                    inst.createActionAndSkillsContent();
                    return false;
                }
            }));
        }) (buttons, i, this, currTab);
    }

    //General info/description for each action
    DomElems.actionsAndSkillsDesc = createElement("p", {
        display:"block", margin:"4px", padding:"4px"
    });

    //List for actions/skills
    removeChildrenFromElement(DomElems.actionsAndSkillsList);
    DomElems.actionsAndSkillsList = createElement("ul");

    switch(currTab) {
        case "general":
            this.createGeneralActionsContent();
            break;
        case "contracts":
            this.createContractsContent();
            break;
        case "operations":
            this.createOperationsContent();
            break;
        case "blackops":
            this.createBlackOpsContent();
            break;
        case "skills":
            this.createSkillsContent();
            break;
        default:
            throw new Error("Invalid value for DomElems.currentTab in Bladeburner.createActionAndSkillsContent");
    }
    this.updateContent();

    DomElems.actionAndSkillsDiv.appendChild(DomElems.actionsAndSkillsDesc);
    DomElems.actionAndSkillsDiv.appendChild(DomElems.actionsAndSkillsList);
}

Bladeburner.prototype.createGeneralActionsContent = function() {
    if (DomElems.actionsAndSkillsList == null || DomElems.actionsAndSkillsDesc == null) {
        throw new Error("Bladeburner.createGeneralActionsContent called with either " +
                        "DomElems.actionsAndSkillsList or DomElems.actionsAndSkillsDesc = null");
    }

    DomElems.actionsAndSkillsDesc.innerText =
        "These are generic actions that will assist you in your Bladeburner " +
        "duties. They will not affect your Bladeburner rank in any way."

    for (var actionName in GeneralActions) {
        if (GeneralActions.hasOwnProperty(actionName)) {
            DomElems.generalActions[actionName] = createElement("div", {
                class:"bladeburner-action", name:actionName
            });
            DomElems.actionsAndSkillsList.appendChild(DomElems.generalActions[actionName]);
        }
    }
}

Bladeburner.prototype.createContractsContent = function() {
    if (DomElems.actionsAndSkillsList == null || DomElems.actionsAndSkillsDesc == null) {
        throw new Error("Bladeburner.createContractsContent called with either " +
                        "DomElems.actionsAndSkillsList or DomElems.actionsAndSkillsDesc = null");
    }

    DomElems.actionsAndSkillsDesc.innerHTML =
        "Complete contracts in order to increase your Bladeburner rank and earn money. " +
        "Failing a contract will cause you to lose HP, which can lead to hospitalization.<br><br>" +
        "You can unlock higher-level contracts by successfully completing them. " +
        "Higher-level contracts are more difficult, but grant more rank, experience, and money.";

    for (var contractName in this.contracts) {
        if (this.contracts.hasOwnProperty(contractName)) {
            DomElems.contracts[contractName] = createElement("div", {
                class:"bladeburner-action", name:contractName
            });
            DomElems.actionsAndSkillsList.appendChild(DomElems.contracts[contractName]);
        }
    }
}

Bladeburner.prototype.createOperationsContent = function() {
    if (DomElems.actionsAndSkillsList == null || DomElems.actionsAndSkillsDesc == null) {
        throw new Error("Bladeburner.createOperationsContent called with either " +
                        "DomElems.actionsAndSkillsList or DomElems.actionsAndSkillsDesc = null");
    }

    DomElems.actionsAndSkillsDesc.innerHTML =
        "Carry out operations for the Bladeburner division. " +
        "Failing an operation will reduce your Bladeburner rank. It will also " +
        "cause you to lose HP, which can lead to hospitalization. In general, " +
        "operations are harder and more punishing than contracts, " +
        "but are also more rewarding.<br><br>" +
        "Operations can affect the chaos level and Synthoid population of your " +
        "current city. The exact effects vary between different Operations.<br><br>" +
        "For operations, you can use a team. You must first recruit team members. " +
        "Having a larger team will improves your chances of success.<br><br>" +
        "You can unlock higher-level operations by successfully completing them. " +
        "Higher-level operations are more difficult, but grant more rank and experience.";

    for (var operationName in this.operations) {
        if (this.operations.hasOwnProperty(operationName)) {
            DomElems.operations[operationName] = createElement("div", {
                class:"bladeburner-action", name:operationName
            });
            DomElems.actionsAndSkillsList.appendChild(DomElems.operations[operationName]);
        }
    }
}

Bladeburner.prototype.createBlackOpsContent = function() {
    if (DomElems.actionsAndSkillsList == null || DomElems.actionsAndSkillsDesc == null) {
        throw new Error("Bladeburner.createBlackOpsContent called with either " +
                        "DomElems.actionsAndSkillsList or DomElems.actionsAndSkillsDesc = null");
    }

    DomElems.actionsAndSkillsDesc.innerHTML =
        "Black Operations (Black Ops) are special, one-time covert operations. " +
        "Each Black Op must be unlocked successively by completing " +
        "the one before it.<br><br>" +
        "<b>Your ultimate goal to climb through the ranks of Bladeburners is to complete " +
        "all of the Black Ops.</b><br><br>" +
        "Like normal operations, you may use a team for Black Ops. Failing " +
        "a black op will incur heavy HP and rank losses.";

    //Put Black Operations in sequence of required rank
    var blackops = [];
    for (var blackopName in BlackOperations) {
        if (BlackOperations.hasOwnProperty(blackopName)) {
            blackops.push(BlackOperations[blackopName]);
        }
    }
    blackops.sort(function(a, b) {
        return (a.reqdRank - b.reqdRank);
    });

    for (var i = 0; i < blackops.length; ++i) {
        DomElems.blackops[blackops[i].name] = createElement("div", {
            class:"bladeburner-action", name:blackops[i].name
        });
        DomElems.actionsAndSkillsList.appendChild(DomElems.blackops[blackops[i].name]);
        if (this.blackops[[blackops[i].name]] == null) {break;} //Can't be found in completed blackops
    }
}

Bladeburner.prototype.createSkillsContent = function() {
    if (DomElems.actionsAndSkillsList == null || DomElems.actionsAndSkillsDesc == null) {
        throw new Error("Bladeburner.createSkillsContent called with either " +
                        "DomElems.actionsAndSkillsList or DomElems.actionsAndSkillsDesc = null");
    }

    //Display Current multipliers
    DomElems.actionsAndSkillsDesc.innerHTML =
        "You will gain one skill point every " + RanksPerSkillPoint + " ranks.<br><br>" +
        "Note that when upgrading a skill, the benefit for that skill is additive. " +
        "However, the effects of different skills with each other is multiplicative.<br><br>"
    var multKeys = Object.keys(this.skillMultipliers);
    for (var i = 0; i < multKeys.length; ++i) {
        var mult = this.skillMultipliers[multKeys[i]];
        if (mult && mult !== 1) {
            mult = formatNumber(mult, 3);
            switch(multKeys[i]) {
                case "successChanceAll":
                    DomElems.actionsAndSkillsDesc.innerHTML += "Total Success Chance: x" + mult + "<br>";
                    break;
                case "successChanceStealth":
                    DomElems.actionsAndSkillsDesc.innerHTML += "Stealth Success Chance: x" + mult + "<br>";
                    break;
                case "successChanceKill":
                    DomElems.actionsAndSkillsDesc.innerHTML += "Retirement Success Chance: x" + mult + "<br>";
                    break;
                case "successChanceContract":
                    DomElems.actionsAndSkillsDesc.innerHTML += "Contract Success Chance: x" + mult + "<br>";
                    break;
                case "successChanceOperation":
                    DomElems.actionsAndSkillsDesc.innerHTML += "Operation Success Chance: x" + mult + "<br>";
                    break;
                case "successChanceEstimate":
                    DomElems.actionsAndSkillsDesc.innerHTML += "Synthoid Data Estimate: x" + mult + "<br>";
                    break;
                case "actionTime":
                    DomElems.actionsAndSkillsDesc.innerHTML += "Action Time: x" + mult + "<br>";
                    break;
                case "effHack":
                    DomElems.actionsAndSkillsDesc.innerHTML += "Hacking Skill: x" + mult + "<br>";
                    break;
                case "effStr":
                    DomElems.actionsAndSkillsDesc.innerHTML += "Strength: x" + mult + "<br>";
                    break;
                case "effDef":
                    DomElems.actionsAndSkillsDesc.innerHTML += "Defense: x" + mult + "<br>";
                    break;
                case "effDex":
                    DomElems.actionsAndSkillsDesc.innerHTML += "Dexterity: x" + mult + "<br>";
                    break;
                case "effAgi":
                    DomElems.actionsAndSkillsDesc.innerHTML += "Agility: x" + mult + "<br>";
                    break;
                case "effCha":
                    DomElems.actionsAndSkillsDesc.innerHTML += "Charisma: x" + mult + "<br>";
                    break;
                case "effInt":
                    DomElems.actionsAndSkillsDesc.innerHTML += "Intelligence: x" + mult + "<br>";
                    break;
                case "stamina":
                    DomElems.actionsAndSkillsDesc.innerHTML += "Stamina: x" + mult + "<br>";
                    break;
                case "money":
                    DomElems.actionsAndSkillsDesc.innerHTML += "Contract Money: x" + mult + "<br>";
                    break;
                case "expGain":
                    DomElems.actionsAndSkillsDesc.innerHTML += "Exp Gain: x" + mult + "<br>";
                    break;
                case "weaponAbility":
                    //DomElems.actionsAndSkillsDesc.innerHTML +=
                    break;
                case "gunAbility":
                    //DomElems.actionsAndSkillsDesc.innerHTML
                    break;
                default:
                    console.log("Warning: Unrecognized SkillMult Key: " + multKeys[i]);
                    break;
            }
        }
    }

    //Skill Points
    DomElems.skillPointsDisplay = createElement("p", {
        innerHTML:"<br><strong>Skill Points: " + formatNumber(this.skillPoints, 0) + "</strong>"
    });
    DomElems.actionAndSkillsDiv.appendChild(DomElems.skillPointsDisplay);

    //UI Element for each skill
    for (var skillName in Skills) {
        if (Skills.hasOwnProperty(skillName)) {
            DomElems.skills[skillName] = createElement("div", {
                class:"bladeburner-action", name:skillName
            });
            DomElems.actionsAndSkillsList.appendChild(DomElems.skills[skillName]);
        }
    }
}

Bladeburner.prototype.updateContent = function() {
    this.updateOverviewContent();
    this.updateActionAndSkillsContent();
}

Bladeburner.prototype.updateOverviewContent = function() {
    if (!routing.isOn(Page.Bladeburner)) {return;}
    DomElems.overviewRank.childNodes[0].nodeValue = "Rank: " + formatNumber(this.rank, 2);
    DomElems.overviewStamina.innerText = "Stamina: " + formatNumber(this.stamina, 3) + " / " + formatNumber(this.maxStamina, 3);
    DomElems.overviewGen1.innerHTML =
        "Stamina Penalty: " + formatNumber((1-this.calculateStaminaPenalty())*100, 1) + "%<br><br>" +
        "Team Size: "   + formatNumber(this.teamSize, 0)  + "<br>" +
        "Team Members Lost: " + formatNumber(this.teamLost, 0) + "<br><br>" +
        "Num Times Hospitalized: " + this.numHosp + "<br>" +
        "Money Lost From Hospitalizations: " + numeralWrapper.format(this.moneyLost, "$0.000a") + "<br><br>" +
        "Current City: " + this.city + "<br>";

    DomElems.overviewEstPop.childNodes[0].nodeValue = "Est. Synthoid Population: " + numeralWrapper.format(this.getCurrentCity().popEst, "0.000a");
    DomElems.overviewEstComms.childNodes[0].nodeValue = "Est. Synthoid Communities: " + formatNumber(this.getCurrentCity().comms, 0);
    DomElems.overviewChaos.childNodes[0].nodeValue = "City Chaos: " + formatNumber(this.getCurrentCity().chaos);
    DomElems.overviewSkillPoints.innerText = "Skill Points: " + formatNumber(this.skillPoints, 0);
    DomElems.overviewBonusTime.childNodes[0].nodeValue = "Bonus time: " + this.storedCycles/CyclesPerSecond;
    DomElems.overviewAugSuccessMult.innerText = "Aug. Success Chance Mult: " + formatNumber(Player.bladeburner_success_chance_mult*100, 1) + "%";
    DomElems.overviewAugMaxStaminaMult.innerText = "Aug. Max Stamina Mult: " + formatNumber(Player.bladeburner_max_stamina_mult*100, 1) + "%";
    DomElems.overviewAugStaminaGainMult.innerText = "Aug. Stamina Gain Mult: " + formatNumber(Player.bladeburner_stamina_gain_mult*100, 1) + "%";
    DomElems.overviewAugAnalysisMult.innerText = "Aug. Field Analysis Mult: " + formatNumber(Player.bladeburner_analysis_mult*100, 1) + "%";
}

Bladeburner.prototype.updateActionAndSkillsContent = function() {
    if (DomElems.currentTab == null) {DomElems.currentTab = "general";}
    switch(DomElems.currentTab.toLowerCase()) {
        case "general":
            var actionElems = Object.keys(DomElems.generalActions);
            for (var i = 0; i < actionElems.length; ++i) {
                var actionElem = DomElems.generalActions[actionElems[i]];
                var name = actionElem.name;
                var actionObj = GeneralActions[name];
                if (actionObj == null) {
                    throw new Error("Could not find Object " + name + " in Bladeburner.updateActionAndSkillsContent()");
                }
                if (this.action.type === ActionTypes[name]) {
                    actionElem.classList.add(ActiveActionCssClass);
                } else {
                    actionElem.classList.remove(ActiveActionCssClass);
                }
                this.updateGeneralActionsUIElement(actionElem, actionObj);
            }
            break;
        case "contracts":
            var contractElems = Object.keys(DomElems.contracts);
            for (var i = 0; i < contractElems.length; ++i) {
                var contractElem = DomElems.contracts[contractElems[i]];
                var name = contractElem.name;
                if (this.action.type === ActionTypes["Contract"] && name === this.action.name) {
                    contractElem.classList.add(ActiveActionCssClass);
                } else {
                    contractElem.classList.remove(ActiveActionCssClass);
                }
                var contract = this.contracts[name];
                if (contract == null) {
                    throw new Error("Could not find Contract " + name + " in Bladeburner.updateActionAndSkillsContent()");
                }
                this.updateContractsUIElement(contractElem, contract);
            }
            break;
        case "operations":
            var operationElems = Object.keys(DomElems.operations);
            for (var i = 0; i < operationElems.length; ++i) {
                var operationElem = DomElems.operations[operationElems[i]];
                var name = operationElem.name;
                if (this.action.type === ActionTypes["Operation"] && name === this.action.name) {
                    operationElem.classList.add(ActiveActionCssClass);
                } else {
                    operationElem.classList.remove(ActiveActionCssClass);
                }
                var operation = this.operations[name];
                if (operation == null) {
                    throw new Error("Could not find Operation " + name + " in Bladeburner.updateActionAndSkillsContent()");
                }
                this.updateOperationsUIElement(operationElem, operation);
            }
            break;
        case "blackops":
            var blackopsElems = Object.keys(DomElems.blackops);
            for (var i = 0; i < blackopsElems.length; ++i) {
                var blackopElem = DomElems.blackops[blackopsElems[i]];
                var name = blackopElem.name;
                if (this.action.type === ActionTypes["BlackOperation"] && name === this.action.name) {
                    blackopElem.classList.add(ActiveActionCssClass);
                } else {
                    blackopElem.classList.remove(ActiveActionCssClass);
                }
                var blackop = BlackOperations[name];
                if (blackop == null) {
                    throw new Error("Could not find BlackOperation " + name + " in Bladeburner.updateActionAndSkillsContent()");
                }
                this.updateBlackOpsUIElement(blackopElem, blackop);
            }
            break;
        case "skills":
            DomElems.skillPointsDisplay.innerHTML = "<br><strong>Skill Points: " + formatNumber(this.skillPoints, 0) + "</strong>";

            var skillElems = Object.keys(DomElems.skills);
            for (var i = 0; i < skillElems.length; ++i) {
                var skillElem = DomElems.skills[skillElems[i]];
                var name = skillElem.name;
                var skill = Skills[name];
                if (skill == null) {
                    throw new Error("Could not find Skill " + name + " in Bladeburner.updateActionAndSkillsContent()");
                }
                this.updateSkillsUIElement(skillElem, skill);
            }
            break;
        default:
            throw new Error("Invalid value for DomElems.currentTab in Bladeburner.createActionAndSkillsContent");
    }
}

Bladeburner.prototype.updateGeneralActionsUIElement = function(el, action) {
    removeChildrenFromElement(el);
    var isActive = el.classList.contains(ActiveActionCssClass);

    el.appendChild(createElement("h2", { //Header
        innerText:isActive ? action.name + " (IN PROGRESS - " +
                             formatNumber(this.actionTimeCurrent, 0) + " / " +
                             formatNumber(this.actionTimeToComplete, 0) + ")"
                          : action.name,
        display:"inline-block",
    }));

    if (isActive) { //Progress bar if its active
        var progress = this.actionTimeCurrent / this.actionTimeToComplete;
        el.appendChild(createElement("p", {
            display:"block",
            innerText:createProgressBarText({progress:progress})
        }));
    } else {
        //Start button
        el.appendChild(createElement("a", {
            innerText:"Start", class: "a-link-button",
            margin:"3px", padding:"3px",
            clickListener:()=>{
                this.action.type = ActionTypes[action.name];
                this.action.name = action.name;
                this.startAction(this.action);
                this.updateActionAndSkillsContent();
                return false;
            }
        }));
    }

    appendLineBreaks(el, 2);
    el.appendChild(createElement("pre", { //Info
        innerHTML:action.desc, display:"inline-block"
    }));


}

Bladeburner.prototype.updateContractsUIElement = function(el, action) {
    removeChildrenFromElement(el);
    var isActive = el.classList.contains(ActiveActionCssClass);
    var estimatedSuccessChance = action.getSuccessChance(this, {est:true});

    el.appendChild(createElement("h2", { //Header
        innerText:isActive ? action.name + " (IN PROGRESS - " +
                             formatNumber(this.actionTimeCurrent, 0) + " / " +
                             formatNumber(this.actionTimeToComplete, 0) + ")"
                          : action.name,
        display:"inline-block"
    }));

    if (isActive) { //Progress bar if its active
        var progress = this.actionTimeCurrent / this.actionTimeToComplete;
        el.appendChild(createElement("p", {
            display:"block",
            innerText:createProgressBarText({progress:progress})
        }));
    } else { //Start button
        el.appendChild(createElement("a", {
            innerText:"Start", class: "a-link-button",
            padding:"3px", margin:"3px",
            clickListener:()=>{
                this.action.type = ActionTypes.Contract;
                this.action.name = action.name;
                this.startAction(this.action);
                this.updateActionAndSkillsContent();
                return false;
            }
        }));
    }

    //Level and buttons to change level
    var maxLevel = (action.level >= action.maxLevel);
    appendLineBreaks(el, 2);
    el.appendChild(createElement("pre", {
        display:"inline-block",
        innerText:"Level: " + action.level + " / " + action.maxLevel,
        tooltip:action.getSuccessesNeededForNextLevel(ContractSuccessesPerLevel) + " successes " +
                "needed for next level"
    }));
    el.appendChild(createElement("a", {
        class: maxLevel ? "a-link-button-inactive" : "a-link-button", innerHTML:"&uarr;",
        padding:"2px", margin:"2px",
        tooltip: isActive ? "WARNING: changing the level will restart the contract" : "",
        display:"inline",
        clickListener:()=>{
            ++action.level;
            if (isActive) {this.startAction(this.action);} //Restart Action
            this.updateContractsUIElement(el, action);
            return false;
        }
    }));
    el.appendChild(createElement("a", {
        class: (action.level <= 1) ? "a-link-button-inactive" : "a-link-button", innerHTML:"&darr;",
        padding:"2px", margin:"2px",
        tooltip: isActive ? "WARNING: changing the level will restart the contract" : "",
        display:"inline",
        clickListener:()=>{
            --action.level;
            if (isActive) {this.startAction(this.action);} //Restart Action
            this.updateContractsUIElement(el, action);
            return false;
        }
    }));

    var actionTime = action.getActionTime(this);
    appendLineBreaks(el, 2);
    el.appendChild(createElement("pre", { //Info
        display:"inline-block",
        innerHTML:action.desc + "\n\n" +
                  `Estimated success chance: ${formatNumber(estimatedSuccessChance*100, 1)}% ${action.isStealth?stealthIcon:''}${action.isKill?killIcon:''}\n` +
                  
                  "Time Required (s): " + formatNumber(actionTime, 0) + "\n" +
                  "Contracts remaining: " + Math.floor(action.count) + "\n" +
                  "Successes: " + action.successes + "\n" +
                  "Failures: " + action.failures,
    }));

    //Autolevel Checkbox
    el.appendChild(createElement("br"));
    var autolevelCheckboxId = "bladeburner-" + action.name + "-autolevel-checkbox";
    el.appendChild(createElement("label", {
        for:autolevelCheckboxId, innerText:"Autolevel",color:"white",
        tooltip:"Automatically increase contract level when possible"
    }));
    var autolevelCheckbox = createElement("input", {
        type:"checkbox", id:autolevelCheckboxId, margin:"4px",
        checked:action.autoLevel,
        changeListener:()=>{
            action.autoLevel = autolevelCheckbox.checked;
        }
    });
    el.appendChild(autolevelCheckbox);
}

Bladeburner.prototype.updateOperationsUIElement = function(el, action) {
    removeChildrenFromElement(el);
    var isActive = el.classList.contains(ActiveActionCssClass);
    var estimatedSuccessChance = action.getSuccessChance(this, {est:true});
    el.appendChild(createElement("h2", { //Header
        innerText:isActive ? action.name + " (IN PROGRESS - " +
                             formatNumber(this.actionTimeCurrent, 0) + " / " +
                             formatNumber(this.actionTimeToComplete, 0) + ")"
                           : action.name,
        display:"inline-block"
    }));

    if (isActive) { //Progress bar if its active
        var progress = this.actionTimeCurrent / this.actionTimeToComplete;
        el.appendChild(createElement("p", {
            display:"block",
            innerText:createProgressBarText({progress:progress})
        }));
    } else { //Start button and set Team Size button
        el.appendChild(createElement("a", {
            innerText:"Start", class: "a-link-button",
            margin:"3px", padding:"3px",
            clickListener:()=>{
                this.action.type = ActionTypes.Operation;
                this.action.name = action.name;
                this.startAction(this.action);
                this.updateActionAndSkillsContent();
                return false;
            }
        }));
        el.appendChild(createElement("a", {
            innerText:"Set Team Size (Curr Size: " + formatNumber(action.teamCount, 0) + ")", class:"a-link-button",
            margin:"3px", padding:"3px",
            clickListener:()=>{
                var popupId = "bladeburner-operation-set-team-size-popup";
                var txt = createElement("p", {
                    innerText:"Enter the amount of team members you would like to take on these " +
                              "operations. If you do not have the specified number of team members, " +
                              "then as many as possible will be used. Note that team members may " +
                              "be lost during operations."

                });
                var input = createElement("input", {
                    type:"number", placeholder: "Team Members"
                });
                var setBtn = createElement("a", {
                    innerText:"Confirm", class:"a-link-button",
                    clickListener:()=>{
                        var num = Math.round(parseFloat(input.value));
                        if (isNaN(num)) {
                            dialogBoxCreate("Invalid value entered for number of Team Members (must be numeric)")
                        } else {
                            action.teamCount = num;
                            this.updateOperationsUIElement(el, action);
                        }
                        removeElementById(popupId);
                        return false;
                    }
                });
                var cancelBtn = createElement("a", {
                    innerText:"Cancel", class:"a-link-button",
                    clickListener:()=>{
                        removeElementById(popupId);
                        return false;
                    }
                });
                createPopup(popupId, [txt, input, setBtn, cancelBtn]);
            }
        }));
    }

    //Level and buttons to change level
    var maxLevel = (action.level >= action.maxLevel);
    appendLineBreaks(el, 2);
    el.appendChild(createElement("pre", {
        display:"inline-block",
        innerText:"Level: " + action.level + " / " + action.maxLevel,
        tooltip:action.getSuccessesNeededForNextLevel(OperationSuccessesPerLevel) + " successes " +
                "needed for next level"
    }));
    el.appendChild(createElement("a", {
        class: maxLevel ? "a-link-button-inactive" : "a-link-button", innerHTML:"&uarr;",
        padding:"2px", margin:"2px",
        tooltip: isActive ? "WARNING: changing the level will restart the Operation" : "",
        display:"inline",
        clickListener:()=>{
            ++action.level;
            if (isActive) {this.startAction(this.action);} //Restart Action
            this.updateOperationsUIElement(el, action);
            return false;
        }
    }));
    el.appendChild(createElement("a", {
        class: (action.level <= 1) ? "a-link-button-inactive" : "a-link-button", innerHTML:"&darr;",
        padding:"2px", margin:"2px",
        tooltip: isActive ? "WARNING: changing the level will restart the Operation" : "",
        display:"inline",
        clickListener:()=>{
            --action.level;
            if (isActive) {this.startAction(this.action);} //Restart Action
            this.updateOperationsUIElement(el, action);
            return false;
        }
    }));

    //General Info
    var difficulty = action.getDifficulty();
    var actionTime = action.getActionTime(this);
    appendLineBreaks(el, 2);
    el.appendChild(createElement("pre", {
        display:"inline-block",
        innerHTML:action.desc + "\n\n" +
                  `Estimated success chance: ${formatNumber(estimatedSuccessChance*100, 1)}% ${action.isStealth?stealthIcon:''}${action.isKill?killIcon:''}\n` +
                  "Time Required(s): " + formatNumber(actionTime, 0) + "\n" +
                  "Operations remaining: " + Math.floor(action.count) + "\n" +
                  "Successes: " + action.successes + "\n" +
                  "Failures: " + action.failures,
    }));

    //Autolevel Checkbox
    el.appendChild(createElement("br"));
    var autolevelCheckboxId = "bladeburner-" + action.name + "-autolevel-checkbox";
    el.appendChild(createElement("label", {
        for:autolevelCheckboxId, innerText:"Autolevel",color:"white",
        tooltip:"Automatically increase operation level when possible"
    }));
    var autolevelCheckbox = createElement("input", {
        type:"checkbox", id:autolevelCheckboxId, margin:"4px",
        checked:action.autoLevel,
        changeListener:()=>{
            action.autoLevel = autolevelCheckbox.checked;
        }
    });
    el.appendChild(autolevelCheckbox);
}

Bladeburner.prototype.updateBlackOpsUIElement = function(el, action) {
    removeChildrenFromElement(el);
    var isActive = el.classList.contains(ActiveActionCssClass);
    var isCompleted = (this.blackops[action.name] != null);
    var estimatedSuccessChance = action.getSuccessChance(this, {est:true});
    var difficulty = action.getDifficulty();
    var actionTime = action.getActionTime(this);
    var hasReqdRank = this.rank >= action.reqdRank;

    //UI for Completed Black Op
    if (isCompleted) {
        el.appendChild(createElement("h2", {
            innerText:action.name + " (COMPLETED)", display:"block",
        }));
        return;
    }

    el.appendChild(createElement("h2", { //Header
        innerText:isActive ? action.name + " (IN PROGRESS - " +
                             formatNumber(this.actionTimeCurrent, 0) + " / " +
                             formatNumber(this.actionTimeToComplete, 0) + ")"
                          : action.name,
        display:"inline-block",
    }));

    if (isActive) { //Progress bar if its active
        var progress = this.actionTimeCurrent / this.actionTimeToComplete;
        el.appendChild(createElement("p", {
            display:"block",
            innerText:createProgressBarText({progress:progress})
        }));
    } else {
        el.appendChild(createElement("a", { //Start button
            innerText:"Start", margin:"3px", padding:"3px",
            class:hasReqdRank ? "a-link-button" : "a-link-button-inactive",
            clickListener:()=>{
                this.action.type = ActionTypes.BlackOperation;
                this.action.name = action.name;
                this.startAction(this.action);
                this.updateActionAndSkillsContent();
                return false;
            }
        }));
        el.appendChild(createElement("a", { //Set Team Size Button
            innerText:"Set Team Size (Curr Size: " + formatNumber(action.teamCount, 0) + ")", class:"a-link-button",
            margin:"3px", padding:"3px",
            clickListener:()=>{
                var popupId = "bladeburner-operation-set-team-size-popup";
                var txt = createElement("p", {
                    innerText:"Enter the amount of team members you would like to take on this " +
                              "BlackOp. If you do not have the specified number of team members, " +
                              "then as many as possible will be used. Note that team members may " +
                              "be lost during operations."

                });
                var input = createElement("input", {
                    type:"number", placeholder: "Team Members"
                });
                var setBtn = createElement("a", {
                    innerText:"Confirm", class:"a-link-button",
                    clickListener:()=>{
                        var num = Math.round(parseFloat(input.value));
                        if (isNaN(num)) {
                            dialogBoxCreate("Invalid value entered for number of Team Members (must be numeric)")
                        } else {
                            action.teamCount = num;
                            this.updateBlackOpsUIElement(el, action);
                        }
                        removeElementById(popupId);
                        return false;
                    }
                });
                var cancelBtn = createElement("a", {
                    innerText:"Cancel", class:"a-link-button",
                    clickListener:()=>{
                        removeElementById(popupId);
                        return false;
                    }
                });
                createPopup(popupId, [txt, input, setBtn, cancelBtn]);
            }
        }));
    }

    //Info
    appendLineBreaks(el, 2);
    el.appendChild(createElement("p", {
        display:"inline-block",
        innerHTML:"<br>" + action.desc + "<br><br>",
    }));
    el.appendChild(createElement("p", {
        display:"block", color:hasReqdRank ? "white" : "red",
        innerHTML:"Required Rank: " + formatNumber(action.reqdRank, 0) + "<br>"
    }));
    el.appendChild(createElement("p", {
        display:"inline-block",
        innerHTML:`Estimated Success Chance: ${formatNumber(estimatedSuccessChance*100, 1)}% ${action.isStealth?stealthIcon:''}${action.isKill?killIcon:''}\n` +
                  "Time Required(s): " + formatNumber(actionTime, 0),
    }))
}

Bladeburner.prototype.updateSkillsUIElement = function(el, skill) {
    removeChildrenFromElement(el);
    var skillName = skill.name;
    var currentLevel = 0;
    if (this.skills[skillName] && !isNaN(this.skills[skillName])) {
        currentLevel = this.skills[skillName];
    }
    var pointCost = skill.calculateCost(currentLevel);

    el.appendChild(createElement("h2", { //Header
        innerText:skill.name + " (Lvl " + currentLevel + ")", display:"inline-block"
    }));

    var canLevel = this.skillPoints >= pointCost;
    var maxLvl = skill.maxLvl ? currentLevel >= skill.maxLvl : false;
    el.appendChild(createElement("a", { //Level up button
        innerText:"Level", display:"inline-block",
        class: canLevel && !maxLvl ? "a-link-button" : "a-link-button-inactive",
        margin:"3px", padding:"3px",
        clickListener:()=>{
            if (this.skillPoints < pointCost) {return;}
            this.skillPoints -= pointCost;
            this.upgradeSkill(skill);
            this.createActionAndSkillsContent();
            return false;
        }
    }));
    appendLineBreaks(el, 2);
    if (maxLvl) {
        el.appendChild(createElement("p", {
            color:"red", display:"block",
            innerText:"MAX LEVEL"
        }));
    } else {
        el.appendChild(createElement("p", {
            display:"block",
            innerText:"Skill Points required: " + formatNumber(pointCost, 0),
        }));
    }
    el.appendChild(createElement("p", { //Info/Description
        innerHTML:skill.desc, display:"inline-block",
    }));
}

//Bladeburner Console Window
Bladeburner.prototype.postToConsole = function(input, saveToLogs=true) {
    const MaxConsoleEntries = 100;
    if (saveToLogs === true) {
        this.consoleLogs.push(input);
        if (this.consoleLogs.length > MaxConsoleEntries) {
            this.consoleLogs.shift();
        }
    }

    if (input == null || DomElems.consoleDiv == null) {return;}
    $("#bladeubrner-console-input-row").before('<tr><td class="bladeburner-console-line" style="color: var(--my-font-color); white-space:pre-wrap;">' + input + '</td></tr>');

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
    //Adds a timestamp and then just calls postToConsole
    this.postToConsole(`[${getTimestamp()}] ${input}`);
}

//Handles a potential series of commands (comm1; comm2; comm3;)
Bladeburner.prototype.executeConsoleCommands = function(commands) {
    try {
        //Console History
        if (this.consoleHistory[this.consoleHistory.length-1] != commands) {
            this.consoleHistory.push(commands);
            if (this.consoleHistory.length > 50) {
                this.consoleHistory.splice(0, 1);
            }
        }
        consoleHistoryIndex = this.consoleHistory.length;

        var arrayOfCommands = commands.split(";");
        for (var i = 0; i < arrayOfCommands.length; ++i) {
            this.executeConsoleCommand(arrayOfCommands[i]);
        }
    } catch(e) {
        exceptionAlert(e);
    }
}

//A single command
Bladeburner.prototype.executeConsoleCommand = function(command) {
    command = command.trim();
    command = command.replace(/\s\s+/g, ' '); //Replace all whitespace w/ a single space

    var args = this.parseCommandArguments(command);
    if (args.length <= 0) {return;} //Log an error?

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
    //Returns an array with command and its arguments in each index.
    //e.g. skill "blade's intuition" foo returns [skill, blade's intuition, foo]
    //The input to this fn will be trimmed and will have all whitespace replaced w/ a single space
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
                    start = i = endQuote+2; //Skip the space
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
                    start = i = endQuote+2; //Skip the space
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
    console.log("Bladeburner console command parsing returned: " + args);
    return args;
}

Bladeburner.prototype.executeAutomateConsoleCommand = function(args) {
    if (args.length !== 2 && args.length !== 4) {
        this.postToConsole("Invalid use of 'automate' command: automate [var] [val] [hi/low]. Use 'help automate' for more info");
        return;
    }

    //Enable/Disable
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

    //Set variables
    if (args.length === 4) {
        var variable = args[1], val = args[2];

        var highLow = false; //True for high, false for low
        if (args[3].toLowerCase().includes("hi")) {highLow = true;}

        switch (variable) {
            case "general":
            case "gen":
                if (GeneralActions[val] != null) {
                    var action = new ActionIdentifier({
                        type:ActionTypes[val], name:val
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
                        type:ActionTypes.Contract, name:val
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
                        type:ActionTypes.Operation, name:val
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
        this.postToConsole(consoleHelpText.helpList);
    } else {
        for (var i = 1; i < args.length; ++i) {
            var commandText = consoleHelpText[args[i]];
            if (commandText != null) {
                this.postToConsole(commandText);
                this.postToConsole("<br>");
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
    if (args[1].toLowerCase().includes("d")) {flag = false;} //d for disable

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
            //Display Skill Help Command
            this.postToConsole("Invalid usage of 'skill' console command: skill [action] [name]");
            this.postToConsole("Use 'help skill' for more info");
            break;
        case 2:
            if (args[1].toLowerCase() === "list") {
                //List all skills and their level
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
                            case "weaponAbility":
                                //DomElems.actionsAndSkillsDesc.innerHTML +=
                                break;
                            case "gunAbility":
                                //DomElems.actionsAndSkillsDesc.innerHTML
                                break;
                            default:
                                console.log("Warning: Unrecognized SkillMult Key: " + multKeys[i]);
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
                this.postToConsole(skill.name + ": Level " + formatNumber(this.skills[skill.name]), 0);
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
                this.updateActionAndSkillsContent();
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
                this.updateActionAndSkillsContent();
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
                this.updateActionAndSkillsContent();
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
                this.updateActionAndSkillsContent();
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
    var errorLogText = "ERROR: bladeburner.startAction() failed due to an invalid action specified. " +
                       "Type: " + type + ", Name: " + name + ". Note that for contracts and operations, the " +
                       "name of the operation is case-sensitive.";
    var actionId = this.getActionIdFromTypeAndName(type, name);
    if (actionId == null) {
        workerScript.log(errorLogText);
        return false;
    }

    // Special logic for Black Ops
    if (actionId.type === ActionTypes["BlackOp"]) {
        // Can't start a BlackOp if you don't have the required rank
        let action = this.getActionObject(actionId);
        if (action.reqdRank > this.rank) {
            workerScript.log(`Failed to start Black Op ${actionId.name} due to insufficient rank`);
            return false;
        }

        // Can't start a BlackOp if its already been done
        if (this.blackops[actionId.name] != null) {
            workerScript.log(`Failed to start Black Op ${actionId.name} because its already been completed`);
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
            workerScript.log("ERROR: Invalid Black Operation name passed into bladeburner.startAction(). Note that this name is case-sensitive & whitespace-sensitive");
            return false;
        }

        if (i > 0 && this.blackops[blackops[i-1]] == null) {
            workerScript.log(`ERROR: Cannot attempt Black Operation ${actionId.name} because you have not done the preceding one`);
            return false;
        }
    }

    try {
        this.startAction(actionId);
        if (workerScript.shouldLog("startAction")) {
            workerScript.log("Starting bladeburner action with type " + type + " and name " + name);
        }
        return true;
    } catch(e) {
        this.resetAction();
        workerScript.log("ERROR: bladeburner.startAction() failed to start action of type " + type + " due to invalid name: " + name +
                                   "Note that this name is case-sensitive and whitespace-sensitive");
        return false;
    }
}

Bladeburner.prototype.getActionTimeNetscriptFn = function(type, name, workerScript) {
    var errorLogText = "ERROR: bladeburner.getActionTime() failed due to an invalid action specified. " +
                       "Type: " + type + ", Name: " + name + ". Note that for contracts and operations, the " +
                       "name of the operation is case-sensitive.";
    var actionId = this.getActionIdFromTypeAndName(type, name);
    if (actionId == null) {
        workerScript.log(errorLogText);
        return -1;
    }

    var actionObj = this.getActionObject(actionId);
    if (actionObj == null) {
        workerScript.log(errorLogText);
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
        default:
            workerScript.log(errorLogText);
            return -1;
    }
}

Bladeburner.prototype.getActionEstimatedSuccessChanceNetscriptFn = function(type, name, workerScript) {
    var errorLogText = "ERROR: bladeburner.getActionEstimatedSuccessChance() failed due to an invalid action specified. " +
                       "Type: " + type + ", Name: " + name + ". Note that for contracts and operations, the " +
                       "name of the operation is case-sensitive.";
    var actionId = this.getActionIdFromTypeAndName(type, name);
    if (actionId == null) {
        workerScript.log(errorLogText);
        return -1;
    }

    var actionObj = this.getActionObject(actionId);
    if (actionObj == null) {
        workerScript.log(errorLogText);
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
            workerScript.log(errorLogText);
            return -1;
    }
}

Bladeburner.prototype.getActionCountRemainingNetscriptFn = function(type, name, workerScript) {
    var errorLogText = "ERROR: bladeburner.getActionCountRemaining() failed due to an invalid action specified. " +
                       "Type: " + type + ", Name: " + name + ". Note that for contracts and operations, the " +
                       "name of the operation is case-sensitive.";
    var actionId = this.getActionIdFromTypeAndName(type, name);
    if (actionId == null) {
        workerScript.log(errorLogText);
        return -1;
    }

    var actionObj = this.getActionObject(actionId);
    if (actionObj == null) {
        workerScript.log(errorLogText);
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
            workerScript.log(errorLogText);
            return -1;
    }
}

Bladeburner.prototype.getSkillLevelNetscriptFn = function(skillName, workerScript) {
    var errorLogText = "ERROR: bladeburner.getSkillLevel() failed due to an invalid skill specified: " +
                       skillName + ". Note that the name of the skill is case-sensitive";

    if (skillName === "") {
        return -1;
    }

    if (!Skills.hasOwnProperty(skillName)) {
        workerScript.log(errorLogText);
        return -1;
    }

    if (this.skills[skillName] == null) {
        return 0;
    } else {
        return this.skills[skillName];
    }
}

Bladeburner.prototype.getSkillUpgradeCostNetscriptFn = function(skillName, workerScript) {
    var errorLogText = "ERROR: bladeburner.getSkillUpgradeCostNetscriptFn() failed due to an invalid skill specified: " +
                       skillName + ". Note that the name of the skill is case-sensitive";

    if (skillName === "") {
        return -1;
    }

    if (!Skills.hasOwnProperty(skillName)) {
        workerScript.log(errorLogText);
        return -1;
    }

    var skill = Skills[skillName];
    if (this.skills[skillName] == null) {
        return skill.calculateCost(0);
    } else {
        return skill.calculateCost(this.skills[skillName]);
    }
}

Bladeburner.prototype.upgradeSkillNetscriptFn = function(skillName, workerScript) {
    var errorLogText = "ERROR: bladeburner.upgradeSkill() failed due to an invalid skill specified: " +
                       skillName + ". Note that the name of the skill is case-sensitive";
    if (!Skills.hasOwnProperty(skillName)) {
        workerScript.log(errorLogText);
        return false;
    }

    var skill = Skills[skillName];
    var currentLevel = 0;
    if (this.skills[skillName] && !isNaN(this.skills[skillName])) {
        currentLevel = this.skills[skillName];
    }
    var cost = skill.calculateCost(currentLevel);

    if(skill.maxLvl && currentLevel >= skill.maxLvl) {
      if (workerScript.shouldLog("upgradeSkill")) {
        workerScript.log(`bladeburner.upgradeSkill() failed because ${skillName} is already maxed`);
      }
      return false;
    }

    if (this.skillPoints < cost) {
        if (workerScript.shouldLog("upgradeSkill")) {
            workerScript.log("bladeburner.upgradeSkill() failed because you do not have enough " +
                             "skill points to upgrade " + skillName + " (You have " +
                            this.skillPoints + ", you need " + cost + ")");
        }
        return false;
    }

    this.skillPoints -= cost;
    this.upgradeSkill(skill);
    if (routing.isOn(Page.Bladeburner) && DomElems.currentTab.toLowerCase() === "skills") {
        this.createActionAndSkillsContent();
    }
    if (workerScript.shouldLog("upgradeSkill")) {
        workerScript.log(skillName + " successfully upgraded to level " + this.skills[skillName]);
    }
    return true;
}

Bladeburner.prototype.getTeamSizeNetscriptFn = function(type, name, workerScript) {
    if (type === "" && name === "") {
        return this.teamSize;
    }

    var errorLogText = "ERROR: bladeburner.getTeamSize() failed due to an invalid action specified. " +
                       "Type: " + type + ", Name: " + name + ". Note that for contracts and operations, the " +
                       "name of the operation is case-sensitive.";

    var actionId = this.getActionIdFromTypeAndName(type, name);
    if (actionId == null) {
        workerScript.log(errorLogText);
        return -1;
    }

    var actionObj = this.getActionObject(actionId);
    if (actionObj == null) {
        workerScript.log(errorLogText);
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
    var errorLogText = "ERROR: bladeburner.setTeamSize() failed due to an invalid action specified. " +
                       "Type: " + type + ", Name: " + name + ". Note that for contracts and operations, the " +
                       "name of the operation is case-sensitive.";
    var actionId = this.getActionIdFromTypeAndName(type, name);
    if (actionId == null) {
        workerScript.log(errorLogText);
        return -1;
    }

    if (actionId.type !== ActionTypes["Operation"] &&
        actionId.type !== ActionTypes["BlackOp"]   &&
        actionId.type !== ActionTypes["BlackOperation"]) {
        workerScript.log("ERROR: bladeburner.setTeamSize() failed. This function " +
                         "only works for Operations and BlackOps");
        return -1;
    }

    var actionObj = this.getActionObject(actionId);
    if (actionObj == null) {
        workerScript.log(errorLogText);
        return -1;
    }

    var sanitizedSize = Math.round(size);
    if (isNaN(sanitizedSize)) {
        workerScript.log("ERROR: bladeburner.setTeamSize() failed due to an invalid 'size' argument: " + size);
        return -1;
    }
    if (this.teamSize < sanitizedSize) {sanitizedSize = this.teamSize;}
    actionObj.teamCount = sanitizedSize;
    if (workerScript.shouldLog("setTeamSize")) {
        workerScript.log("Team size for " + name + " set to " + sanitizedSize);
    }
    return sanitizedSize;
}

Bladeburner.prototype.getCityEstimatedPopulationNetscriptFn = function(cityName, workerScript) {
    if (!this.cities.hasOwnProperty(cityName)) {
        workerScript.log("ERROR: bladeburner.getCityEstimatedPopulation() failed because the specified " +
                         "city was invalid: " + cityName + ". Note that this city argument is case-sensitive");
        return -1;
    }
    return this.cities[cityName].popEst;
}

Bladeburner.prototype.getCityEstimatedCommunitiesNetscriptFn = function(cityName, workerScript) {
    if (!this.cities.hasOwnProperty(cityName)) {
        workerScript.log("ERROR: bladeburner.getCityEstimatedCommunities() failed because the specified " +
                         "city was invalid: " + cityName + ". Note that this city argument is case-sensitive");
        return -1;
    }
    return this.cities[cityName].commsEst;
}

Bladeburner.prototype.getCityChaosNetscriptFn = function(cityName, workerScript) {
    if (!this.cities.hasOwnProperty(cityName)) {
        workerScript.log("ERROR: bladeburner.getCityChaos() failed because the specified " +
                         "city was invalid: " + cityName + ". Note that this city argument is case-sensitive");
        return -1;
    }
    return this.cities[cityName].chaos;
}

Bladeburner.prototype.switchCityNetscriptFn = function(cityName, workerScript) {
    if (!this.cities.hasOwnProperty(cityName)) {
        workerScript.log("ERROR: bladeburner.switchCity() failed because the specified " +
                         "city was invalid: " + cityName + ". Note that this city argument is case-sensitive");
        return false;
    }
    this.city = cityName;
    return true;
}

Bladeburner.prototype.joinBladeburnerFactionNetscriptFn = function(workerScript) {
    var bladeburnerFac = Factions["Bladeburners"];
    if (bladeburnerFac.isMember) {
        return true;
    } else if (this.rank >= RankNeededForFaction) {
        joinFaction(bladeburnerFac);
        if (workerScript.shouldLog("joinBladeburnerFaction")) {
            workerScript.log("Joined Bladeburners Faction");
        }
        if (routing.isOn(Page.Bladeburner)) {
            removeChildrenFromElement(DomElems.overviewDiv);
            this.createOverviewContent();
        }
        return true;
    } else {
        if (workerScript.shouldLog("joinBladeburnerFaction")) {
            workerScript.log("Failed to join Bladeburners Faction because " +
                             "you do not have the required " + RankNeededForFaction + " rank");
        }
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

//This initialized Bladeburner-related data that is NOT saved/loaded
//      eg: Skill Objects, BLack Operations
//Any data that is saved/loaded should go in Bladeburner object
//      eg: contracts, operations
function initBladeburner() {
    //Skills
    Skills[SkillNames.BladesIntuition] = new Skill({
        name:SkillNames.BladesIntuition,
        desc:"Each level of this skill increases your success chance " +
             "for all Contracts, Operations, and BlackOps by 3%",
        baseCost: 3, costInc: 2.1,
        successChanceAll:3
    });
    Skills[SkillNames.Cloak] = new Skill({
        name:SkillNames.Cloak,
        desc:"Each level of this skill increases your " +
             "success chance in stealth-related Contracts, Operations, and BlackOps by 5.5%",
        baseCost: 2, costInc: 1.1,
        successChanceStealth:5.5
    });

    //TODO Marksman
    //TODO Weapon Proficiency

    Skills[SkillNames.ShortCircuit] = new Skill({
        name:SkillNames.ShortCircuit,
        desc:"Each level of this skill increases your success chance " +
             "in Contracts, Operations, and BlackOps that involve retirement by 5.5%",
        baseCost: 2, costInc: 2.1,
        successChanceKill:5.5
    });
    Skills[SkillNames.DigitalObserver] = new Skill({
        name:SkillNames.DigitalObserver,
        desc:"Each level of this skill increases your success chance in " +
             "all Operations and BlackOps by 4%",
        baseCost: 2, costInc: 2.1,
        successChanceOperation:4
    });
    Skills[SkillNames.Tracer] = new Skill({
        name:SkillNames.Tracer,
        desc:"Each level of this skill increases your success chance in " +
             "all Contracts by 4%",
        baseCost: 2, costInc: 2.1,
        successChanceContract:4
    });
    Skills[SkillNames.Overclock] = new Skill({
        name:SkillNames.Overclock,
        desc:"Each level of this skill decreases the time it takes " +
             "to attempt a Contract, Operation, and BlackOp by 1% (Max Level: 90)",
        baseCost: 3, costInc: 1.4, maxLvl: 90,
        actionTime:1
    });
    Skills[SkillNames.Reaper] = new Skill({
        name: SkillNames.Reaper,
        desc: "Each level of this skill increases your effective combat stats for Bladeburner actions by 2%",
        baseCost: 2, costInc: 2.1,
        effStr: 2, effDef: 2, effDex: 2, effAgi: 2
    });
    Skills[SkillNames.EvasiveSystem] = new Skill({
        name:SkillNames.EvasiveSystem,
        desc:"Each level of this skill increases your effective " +
             "dexterity and agility for Bladeburner actions by 4%",
        baseCost: 2, costInc: 2.1,
        effDex: 4, effAgi: 4
    });
    Skills[SkillNames.Datamancer] = new Skill({
        name:SkillNames.Datamancer,
        desc:"Each level of this skill increases your effectiveness in " +
             "synthoid population analysis and investigation by 5%. " +
             "This affects all actions that can potentially increase " +
            "the accuracy of your synthoid population/community estimates.",
        baseCost:3, costInc:1,
        successChanceEstimate:5
    });
    Skills[SkillNames.CybersEdge] = new Skill({
        name:SkillNames.CybersEdge,
        desc:"Each level of this skill increases your max stamina by 2%",
        baseCost:1, costInc:3,
        stamina:2
    });
    Skills[SkillNames.HandsOfMidas] = new Skill({
        name: SkillNames.HandsOfMidas,
        desc: "Each level of this skill increases the amount of money you receive from Contracts by 10%",
        baseCost: 2, costInc: 2.5,
        money: 10,
    });
    Skills[SkillNames.Hyperdrive] = new Skill({
        name: SkillNames.Hyperdrive,
        desc: "Each level of this skill increases the experience earned from Contracts, Operations, and BlackOps by 10%",
        baseCost: 1, costInc: 2.5,
        expGain: 10,
    });

    //General Actions
    let actionName;
    actionName = "Training";
    GeneralActions[actionName] = new Action({
        name:actionName,
        desc:"Improve your abilities at the Bladeburner unit's specialized training " +
             "center. Doing this gives experience for all combat stats and also " +
             "increases your max stamina."
    });

    actionName = "Field Analysis";
    GeneralActions[actionName] = new Action({
        name:actionName,
        desc:"Mine and analyze Synthoid-related data. This improve the " +
             "Bladeburner's unit intelligence on Synthoid locations and " +
             "activities. Completing this action will improve the accuracy " +
             "of your Synthoid population estimated in the current city.<br><br>" +
             "Does NOT require stamina."
    });

    actionName = "Recruitment";
    GeneralActions[actionName] = new Action({
        name:actionName,
        desc:"Attempt to recruit members for your Bladeburner team. These members " +
             "can help you conduct operations.<br><br>" +
             "Does NOT require stamina."
    });

    actionName = "Diplomacy";
    GeneralActions[actionName] = new Action({
        name: actionName,
        desc: "Improve diplomatic relations with the Synthoid population. " +
              "Completing this action will reduce the Chaos level in your current city.<br><br>" +
              "Does NOT require stamina."
    });

    actionName = "Hyperbolic Regeneration Chamber";
    GeneralActions[actionName] = new Action({
        name: actionName,
        desc: "Enter cryogenic stasis using the Bladeburner division's hi-tech Regeneration Chamber. " +
              "This will slowly heal your wounds and slightly increase your stamina.<br><br>",
    });

    //Black Operations
    BlackOperations["Operation Typhoon"] = new BlackOperation({
        name:"Operation Typhoon",
        desc:"Obadiah Zenyatta is the leader of a RedWater PMC. It has long " +
             "been known among the intelligence community that Zenyatta, along " +
             "with the rest of the PMC, is a Synthoid.<br><br>" +
             "The goal of Operation Typhoon is to find and eliminate " +
             "Zenyatta and RedWater by any means necessary. After the task " +
             "is completed, the actions must be covered up from the general public.",
        baseDifficulty:2000, reqdRank:2.5e3,
        rankGain:50, rankLoss:10, hpLoss:100,
        weights:{hack:0.1,str:0.2,def:0.2,dex:0.2,agi:0.2,cha:0, int:0.1},
        decays:{hack:0.6,str:0.8,def:0.8,dex:0.8,agi:0.8,cha:0, int:0.75},
        isKill:true
    });
    BlackOperations["Operation Zero"] = new BlackOperation({
        name:"Operation Zero",
        desc:"AeroCorp is one of the world's largest defense contractors. " +
             "It's leader, Steve Watataki, is thought to be a supporter of " +
             "Synthoid rights. He must be removed.<br><br>" +
             "The goal of Operation Zero is to covertly infiltrate AeroCorp and " +
             "uncover any incriminating evidence or " +
             "information against Watataki that will cause him to be removed " +
             "from his position at AeroCorp. Incriminating evidence can be " +
             "fabricated as a last resort. Be warned that AeroCorp has some of " +
             "the most advanced security measures in the world.",
        baseDifficulty:2500, reqdRank:5e3,
        rankGain:60, rankLoss:15, hpLoss:50,
        weights:{hack:0.2,str:0.15,def:0.15,dex:0.2,agi:0.2,cha:0, int:0.1},
        decays:{hack:0.6,str:0.8,def:0.8,dex:0.8,agi:0.8,cha:0, int:0.75},
        isStealth:true
    });
    BlackOperations["Operation X"] = new BlackOperation({
        name:"Operation X",
        desc:"We have recently discovered an underground publication " +
             "group called Samizdat. Even though most of their publications " +
             "are nonsensical conspiracy theories, the average human is " +
             "gullible enough to believe them. Many of their works discuss " +
             "Synthoids and pose a threat to society. The publications are spreading " +
             "rapidly in China and other Eastern countries.<br><br>" +
             "Samizdat has done a good job of keeping hidden and anonymous. " +
             "However, we've just received intelligence that their base of " +
             "operations is in Ishima's underground sewer systems. Your task is to " +
             "investigate the sewer systems, and eliminate Samizdat. They must " +
             "never publish anything again.",
        baseDifficulty:3000, reqdRank:7.5e3,
        rankGain:75, rankLoss:15, hpLoss:100,
        weights:{hack:0.1,str:0.2,def:0.2,dex:0.2,agi:0.2,cha:0, int:0.1},
        decays:{hack:0.6,str:0.8,def:0.8,dex:0.8,agi:0.8,cha:0, int:0.75},
        isKill:true
    });
    BlackOperations["Operation Titan"] = new BlackOperation({
        name:"Operation Titan",
        desc:"Several months ago Titan Laboratories' Bioengineering department " +
             "was infiltrated by Synthoids. As far as we know, Titan Laboratories' " +
             "management has no knowledge about this. We don't know what the " +
             "Synthoids are up to, but the research that they could " +
             "be conducting using Titan Laboraties' vast resources is potentially " +
             "very dangerous.<br><br>" +
             "Your goal is to enter and destroy the Bioengineering department's " +
             "facility in Aevum. The task is not just to retire the Synthoids there, but " +
             "also to destroy any information or research at the facility that " +
             "is relevant to the Synthoids and their goals.",
        baseDifficulty:4000, reqdRank:10e3,
        rankGain:100, rankLoss:20, hpLoss:100,
        weights:{hack:0.1,str:0.2,def:0.2,dex:0.2,agi:0.2,cha:0, int:0.1},
        decays:{hack:0.6,str:0.8,def:0.8,dex:0.8,agi:0.8,cha:0, int:0.75},
        isKill:true
    });
    BlackOperations["Operation Ares"] = new BlackOperation({
        name:"Operation Ares",
        desc:"One of our undercover agents, Agent Carter, has informed us of a " +
             "massive weapons deal going down in Dubai between rogue Russian " +
             "militants and a radical Synthoid community. These weapons are next-gen " +
             "plasma and energy weapons. It is critical for the safety of humanity " +
             "that this deal does not happen.<br><br>" +
             "Your task is to intercept the deal. Leave no survivors.",
        baseDifficulty:5000, reqdRank:12.5e3,
        rankGain:125, rankLoss:20, hpLoss:200,
        weights:{hack:0,str:0.25,def:0.25,dex:0.25,agi:0.25,cha:0, int:0},
        decays:{hack:0,str:0.8,def:0.8,dex:0.8,agi:0.8,cha:0, int:0.75},
        isKill:true
    });
    BlackOperations["Operation Archangel"] = new BlackOperation({
        name:"Operation Archangel",
        desc:"Our analysts have discovered that the popular Red Rabbit brothel in " +
             "Amsterdam is run and 'staffed' by MK-VI Synthoids. Intelligence " +
             "suggests that the profit from this brothel is used to fund a large " +
             "black market arms trafficking operation.<br><br>"  +
             "The goal of this operation is to take out the leaders that are running " +
             "the Red Rabbit brothel. Try to limit the number of other casualties, " +
             "but do what you must to complete the mission.",
        baseDifficulty:7500, reqdRank:15e3,
        rankGain:200, rankLoss:20, hpLoss:25,
        weights:{hack:0,str:0.2,def:0.2,dex:0.3,agi:0.3,cha:0, int:0},
        decays:{hack:0,str:0.8,def:0.8,dex:0.8,agi:0.8,cha:0, int:0.75},
        isKill:true,
    });
    BlackOperations["Operation Juggernaut"] = new BlackOperation({
        name:"Operation Juggernaut",
        desc:"The CIA has just encountered a new security threat. A new " +
             "criminal group, lead by a shadowy operative who calls himself " +
             "Juggernaut, has been smuggling drugs and weapons (including " +
             "suspected bioweapons) into Sector-12. We also have reason " +
             "to believe the tried to break into one of Universal Energy's " +
             "facilities in order to cause a city-wide blackout. The CIA " +
             "suspects that Juggernaut is a heavily-augmented Synthoid, and " +
             "have thus enlisted our help.<br><br>" +
             "Your mission is to eradicate Juggernaut and his followers.",
        baseDifficulty:10e3, reqdRank:20e3,
        rankGain:300, rankLoss:40, hpLoss:300,
        weights:{hack:0,str:0.25,def:0.25,dex:0.25,agi:0.25,cha:0, int:0},
        decays:{hack:0,str:0.8,def:0.8,dex:0.8,agi:0.8,cha:0, int:0.75},
        isKill:true,
    });
    BlackOperations["Operation Red Dragon"] = new BlackOperation({
        name:"Operation Red Dragon",
        desc:"The Tetrads criminal organization is suspected of " +
             "reverse-engineering the MK-VI Synthoid design. We believe " +
             "they altered and possibly improved the design and began " +
             "manufacturing their own Synthoid models in order to bolster " +
             "their criminal activities.<br><br>" +
             "Your task is to infiltrate and destroy the Tetrads' base of operations " +
             "in Los Angeles. Intelligence tells us that their base houses " +
             "one of their Synthoid manufacturing units.",
        baseDifficulty:12.5e3, reqdRank:25e3,
        rankGain:500, rankLoss:50, hpLoss:500,
        weights:{hack:0.05,str:0.2,def:0.2,dex:0.25,agi:0.25,cha:0, int:0.05},
        decays:{hack:0.6,str:0.8,def:0.8,dex:0.8,agi:0.8,cha:0, int:0.75},
        isKill:true,
    });
    BlackOperations["Operation K"] = new BlackOperation({
        name:"Operation K",
        desc:"CODE RED SITUATION. Our intelligence tells us that VitaLife " +
             "has discovered a new android cloning technology. This technology " +
             "is supposedly capable of cloning Synthoid, not only physically " +
             "but also their advanced AI modules. We do not believe that " +
             "VitaLife is trying to use this technology illegally or " +
             "maliciously, but if any Synthoids were able to infiltrate the " +
             "corporation and take advantage of this technology then the " +
             "results would be catastrophic.<br><br>" +
             "We do not have the power or jurisdiction to shutdown this down " +
             "through legal or political means, so we must resort to a covert " +
             "operation. Your goal is to destroy this technology and eliminate" +
             "anyone who was involved in its creation.",
        baseDifficulty:15e3, reqdRank:30e3,
        rankGain:750, rankLoss:60, hpLoss:1000,
        weights:{hack:0.05,str:0.2,def:0.2,dex:0.25,agi:0.25,cha:0, int:0.05},
        decays:{hack:0.6,str:0.8,def:0.8,dex:0.8,agi:0.8,cha:0, int:0.75},
        isKill:true
    });
    BlackOperations["Operation Deckard"] = new BlackOperation({
        name:"Operation Deckard",
        desc:"Despite your success in eliminating VitaLife's new android-replicating " +
             "technology in Operation K, we've discovered that a small group of " +
             "MK-VI Synthoids were able to make off with the schematics and design " +
             "of the technology before the Operation. It is almost a certainty that " +
             "these Synthoids are some of the rogue MK-VI ones from the Synthoid Uprising." +
             "The goal of Operation Deckard is to hunt down these Synthoids and retire " +
             "them. I don't need to tell you how critical this mission is.",
        baseDifficulty:20e3, reqdRank:40e3,
        rankGain:1e3, rankLoss:75, hpLoss:200,
        weights:{hack:0,str:0.24,def:0.24,dex:0.24,agi:0.24,cha:0, int:0.04},
        decays:{hack:0,str:0.8,def:0.8,dex:0.8,agi:0.8,cha:0, int:0.75},
        isKill:true,
    });
    BlackOperations["Operation Tyrell"] = new BlackOperation({
        name:"Operation Tyrell",
        desc:"A week ago Blade Industries reported a small break-in at one " +
             "of their Aevum Augmentation storage facitilities. We figured out " +
             "that The Dark Army was behind the heist, and didn't think any more " +
             "of it. However, we've just discovered that several known MK-VI Synthoids " +
             "were part of that break-in group.<br><br>" +
             "We cannot have Synthoids upgrading their already-enhanced abilities " +
             "with Augmentations. Your task is to hunt down the associated Dark Army " +
             "members and eliminate them.",
         baseDifficulty:25e3, reqdRank:50e3,
         rankGain:1.5e3, rankLoss:100, hpLoss:500,
         weights:{hack:0.1,str:0.2,def:0.2,dex:0.2,agi:0.2,cha:0, int:0.1},
         decays:{hack:0.6,str:0.8,def:0.8,dex:0.8,agi:0.8,cha:0, int:0.75},
         isKill:true,
    });
    BlackOperations["Operation Wallace"] = new BlackOperation({
        name:"Operation Wallace",
        desc:"Based on information gathered from Operation Tyrell, we've discovered " +
             "that The Dark Army was well aware that there were Synthoids amongst " +
             "their ranks. Even worse, we believe that The Dark Army is working " +
             "together with other criminal organizations such as The Syndicate and " +
             "that they are planning some sort of large-scale takeover of multiple major " +
             "cities, most notably Aevum. We suspect that Synthoids have infiltrated " +
             "the ranks of these criminal factions and are trying to stage another " +
             "Synthoid uprising.<br><br>" +
             "The best way to deal with this is to prevent it before it even happens. " +
             "The goal of Operation Wallace is to destroy the Dark Army and " +
             "Syndicate factions in Aevum immediately. Leave no survivors.",
         baseDifficulty:30e3, reqdRank:75e3,
         rankGain:2e3, rankLoss:150, hpLoss:1500,
         weights:{hack:0,str:0.24,def:0.24,dex:0.24,agi:0.24,cha:0, int:0.04},
         decays:{hack:0.6,str:0.8,def:0.8,dex:0.8,agi:0.8,cha:0, int:0.75},
         isKill:true
    });
    BlackOperations["Operation Shoulder of Orion"] = new BlackOperation({
        name:"Operation Shoulder of Orion",
        desc:"China's Solaris Space Systems is secretly launching the first " +
             "manned spacecraft in over a decade using Synthoids. We believe " +
             "China is trying to establish the first off-world colonies.<br><br>" +
             "The mission is to prevent this launch without instigating an " +
             "international conflict. When you accept this mission you will be " +
             "officially disavowed by the NSA and the national government until after you " +
             "successfully return. In the event of failure, all of the operation's " +
             "team members must not let themselves be captured alive.",
        baseDifficulty:35e3, reqdRank:100e3,
        rankGain:2.5e3, rankLoss:500, hpLoss:1500,
        weights:{hack:0.1,str:0.2,def:0.2,dex:0.2,agi:0.2,cha:0, int:0.1},
        decays:{hack:0.6,str:0.8,def:0.8,dex:0.8,agi:0.8,cha:0, int:0.75},
        isStealth:true
    });
    BlackOperations["Operation Hyron"] = new BlackOperation({
        name:"Operation Hyron",
        desc:"Our intelligence tells us that Fulcrum Technologies is developing " +
             "a quantum supercomputer using human brains as core " +
             "processors. This supercomputer " +
             "is rumored to be able to store vast amounts of data and " +
             "perform computations unmatched by any other supercomputer on the " +
             "planet. But more importantly, the use of organic human brains " +
             "means that the supercomputer may be able to reason abstractly " +
             "and become self-aware.<br><br>" +
             "I do not need to remind you why sentient-level AIs pose a serious " +
             "thread to all of mankind.<br><br>" +
             "The research for this project is being conducted at one of Fulcrum " +
             "Technologies secret facilities in Aevum, codenamed 'Alpha Ranch'. " +
             "Infiltrate the compound, delete and destroy the work, and then find and kill the " +
             "project lead.",
        baseDifficulty:40e3, reqdRank:125e3,
        rankGain:3e3, rankLoss:1e3, hpLoss:500,
        weights:{hack:0.1,str:0.2,def:0.2,dex:0.2,agi:0.2,cha:0, int:0.1},
        decays:{hack:0.6,str:0.8,def:0.8,dex:0.8,agi:0.8,cha:0, int:0.75},
        isKill:true
    });
    BlackOperations["Operation Morpheus"] = new BlackOperation({
        name:"Operation Morpheus",
        desc:"DreamSense Technologies is an advertising company that uses " +
             "special technology to transmit their ads into the peoples " +
             "dreams and subconcious. They do this using broadcast transmitter " +
             "towers. Based on information from our agents and informants in " +
             "Chonqging, we have reason to believe that one of the broadcast " +
             "towers there has been compromised by Synthoids and is being used " +
             "to spread pro-Synthoid propaganda.<br><br>" +
             "The mission is to destroy this broadcast tower. Speed and " +
             "stealth are of the upmost important for this.",
        baseDifficulty:45e3, reqdRank:150e3,
        rankGain:4e3, rankLoss:1e3, hpLoss:100,
        weights:{hack:0.05,str:0.15,def:0.15,dex:0.3,agi:0.3,cha:0, int:0.05},
        decays:{hack:0.6,str:0.8,def:0.8,dex:0.8,agi:0.8,cha:0, int:0.75},
        isStealth:true
    });
    BlackOperations["Operation Ion Storm"] = new BlackOperation({
        name:"Operation Ion Storm",
        desc:"Our analysts have uncovered a gathering of MK-VI Synthoids " +
             "that have taken up residence in the Sector-12 Slums. We " +
             "don't know if they are rogue Synthoids from the Uprising, " +
             "but we do know that they have been stockpiling " +
             "weapons, money, and other resources. This makes them dangerous.<br><br>" +
             "This is a full-scale assault operation to find and retire all of these " +
             "Synthoids in the Sector-12 Slums.",
        baseDifficulty:50e3, reqdRank:175e3,
        rankGain:5e3, rankLoss:1e3, hpLoss:5000,
        weights:{hack:0,str:0.24,def:0.24,dex:0.24,agi:0.24,cha:0, int:0.04},
        decays:{hack:0.6,str:0.8,def:0.8,dex:0.8,agi:0.8,cha:0, int:0.75},
        isKill:true
    });
    BlackOperations["Operation Annihilus"] = new BlackOperation({
        name:"Operation Annihilus",
        desc:"Our superiors have ordered us to eradicate everything and everyone " +
             "in an underground facility located in Aevum. They tell us " +
             "that the facility houses many dangerous Synthoids and " +
             "belongs to a terrorist organization called " +
             "'The Covenant'. We have no prior intelligence about this " +
             "organization, so you are going in blind.",
        baseDifficulty:55e3, reqdRank:200e3,
        rankGain:7.5e3, rankLoss:1e3, hpLoss:10e3,
        weights:{hack:0,str:0.24,def:0.24,dex:0.24,agi:0.24,cha:0, int:0.04},
        decays:{hack:0.6,str:0.8,def:0.8,dex:0.8,agi:0.8,cha:0, int:0.75},
        isKill:true
    });
    BlackOperations["Operation Ultron"] = new BlackOperation({
        name:"Operation Ultron",
        desc:"OmniTek Incorporated, the original designer and manufacturer of Synthoids, " +
             "has notified us of a malfunction in their AI design. This malfunction, "  +
             "when triggered, causes MK-VI Synthoids to become radicalized and seek out " +
             "the destruction of humanity. They say that this bug affects all MK-VI Synthoids, " +
             "not just the rogue ones from the Uprising.<br><br>" +
             "OmniTek has also told us they they believe someone has triggered this " +
             "malfunction in a large group of MK-VI Synthoids, and that these newly-radicalized Synthoids " +
             "are now amassing in Volhaven to form a terrorist group called Ultron.<br><br>" +
             "Intelligence suggests Ultron is heavily armed and that their members are " +
             "augmented. We believe Ultron is making moves to take control of " +
             "and weaponize DeltaOne's Tactical High-Energy Satellite Laser Array (THESLA).<br><br>" +
             "Your task is to find and destroy Ultron.",
        baseDifficulty:60e3, reqdRank:250e3,
        rankGain:10e3, rankLoss:2e3, hpLoss:10e3,
        weights:{hack:0.1,str:0.2,def:0.2,dex:0.2,agi:0.2,cha:0, int:0.1},
        decays:{hack:0.6,str:0.8,def:0.8,dex:0.8,agi:0.8,cha:0, int:0.75},
        isKill:true
    });
    BlackOperations["Operation Centurion"] = new BlackOperation({
        name:"Operation Centurion",
        desc:"D)@#)($M)C0293c40($*)@#D0JUMP3Rm0C<*@#)*$)#02c94830c(#$*D)<br><br>" +
             "Throughout all of humanity's history, we have relied on " +
             "technology to survive, conquer, and progress. Its advancement became our primary goal. " +
             "And at the peak of human civilization technology turned into " +
             "power. Global, absolute power.<br><br>" +
             "It seems that the universe is not without a sense of irony.<br><br>" +
             "D)@#)($M)C0293c40($*)@#D0JUMP3Rm0C<*@#)*$)#02c94830c(#$*D)",
        baseDifficulty:70e3, reqdRank:300e3,
        rankGain:15e3, rankLoss:5e3, hpLoss:10e3,
        weights:{hack:0.1,str:0.2,def:0.2,dex:0.2,agi:0.2,cha:0, int:0.1},
        decays:{hack:0.6,str:0.8,def:0.8,dex:0.8,agi:0.8,cha:0, int:0.75},
    });
    BlackOperations["Operation Vindictus"] = new BlackOperation({
        name:"Operation Vindictus",
        desc:"D)@#)($M)C0293c40($*)@#D0JUMP3Rm0C<*@#)*$)#02c94830c(#$*D)<br><br>" +
             "The bits are all around us. The daemons that hold the Node " +
             "together can manifest themselves in many different ways.<br><br>" +
             "D)@#)($M)C0293c40($*)@#D0JUMP3Rm0C<*@#)*$)#02c94830c(#$*D)",
        baseDifficulty:75e3, reqdRank:350e3,
        rankGain:20e3, rankLoss:20e3, hpLoss:20e3,
        weights:{hack:0.1,str:0.2,def:0.2,dex:0.2,agi:0.2,cha:0, int:0.1},
        decays:{hack:0.6,str:0.8,def:0.8,dex:0.8,agi:0.8,cha:0, int:0.75},
    });
    BlackOperations["Operation Daedalus"] = new BlackOperation({
        name:"Operation Daedalus",
        desc:"Yesterday we obeyed kings and bent our neck to emperors. " +
             "Today we kneel only to truth.",
        baseDifficulty:80e3, reqdRank:400e3,
        rankGain:40e3, rankLoss:10e3, hpLoss:100e3,
        weights:{hack:0.1,str:0.2,def:0.2,dex:0.2,agi:0.2,cha:0, int:0.1},
        decays:{hack:0.6,str:0.8,def:0.8,dex:0.8,agi:0.8,cha:0, int:0.75},
    });
}

export {Bladeburner};
