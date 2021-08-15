/**
 * Generic Game Constants
 *
 * Constants for specific mechanics or features will NOT be here.
 */
import { IMap } from "./types";

export const CONSTANTS: IMap<any> = {
    Version:                "0.52.3",

    // Speed (in ms) at which the main loop is updated
    _idleSpeed: 200,

    /** Max level for any skill, assuming no multipliers. Determined by max numerical value in javascript for experience
     * and the skill level formula in Player.js. Note that all this means it that when experience hits MAX_INT, then
     * the player will have this level assuming no multipliers. Multipliers can cause skills to go above this.
     */
    MaxSkillLevel:          975,

    // Milliseconds per game cycle
    MilliPerCycle: 200,

    // How much reputation is needed to join a megacorporation's faction
    CorpFactionRepRequirement: 200e3,

    // Base RAM costs
    BaseCostFor1GBOfRamHome: 32000,
    BaseCostFor1GBOfRamServer: 55000, //1 GB of RAM

    // Cost to travel to another city
    TravelCost: 200e3,

    // Faction and Company favor-related things
    BaseFavorToDonate: 150,
    DonateMoneyToRepDivisor: 1e6,
    FactionReputationToFavorBase: 500,
    FactionReputationToFavorMult: 1.02,
    CompanyReputationToFavorBase: 500,
    CompanyReputationToFavorMult: 1.02,

    // NeuroFlux Governor Augmentation cost multiplier
    NeuroFluxGovernorLevelMult: 1.14,

    NumNetscriptPorts: 20,

    // Server-related constants
    HomeComputerMaxRam: 1073741824, // 2 ^ 30
    ServerBaseGrowthRate: 1.03,     // Unadjusted Growth rate
    ServerMaxGrowthRate: 1.0035,    // Maximum possible growth rate (max rate accounting for server security)
    ServerFortifyAmount: 0.002,     // Amount by which server's security increases when its hacked/grown
    ServerWeakenAmount: 0.05,       // Amount by which server's security decreases when weakened

    PurchasedServerLimit: 25,
    PurchasedServerMaxRam: 1048576, // 2^20

    // Augmentation Constants
    MultipleAugMultiplier: 1.9,

    // TOR Router
    TorRouterCost: 200e3,

    // Infiltration
    InfiltrationBribeBaseAmount: 100e3,    //Amount per clearance level
    InfiltrationMoneyValue: 5e3,            //Convert "secret" value to money
    InfiltrationRepValue: 1.4,             //Convert "secret" value to faction reputation
    InfiltrationExpPow: 0.8,

    // Stock market
    WSEAccountCost: 200e6,
    TIXAPICost: 5e9,
    MarketData4SCost: 1e9,
    MarketDataTixApi4SCost: 25e9,
    StockMarketCommission: 100e3,

    // Hospital/Health
    HospitalCostPerHp: 100e3,

    // Intelligence-related constants
    IntelligenceCrimeWeight: 0.025, // Weight for how much int affects crime success rates
    IntelligenceInfiltrationWeight: 0.1, // Weight for how much int affects infiltration success rates
    IntelligenceCrimeBaseExpGain: 0.05,
    IntelligenceProgramBaseExpGain: 2.5, // Program required hack level divided by this to determine int exp gain
    IntelligenceTerminalHackBaseExpGain: 200, // Hacking exp divided by this to determine int exp gain
    IntelligenceSingFnBaseExpGain: 1.5,
    IntelligenceClassBaseExpGain: 0.01,
    IntelligenceHackingMissionBaseExpGain: 3, // Hacking Mission difficulty multiplied by this to get exp gain

    // Hacking Missions
    // TODO Move this into Hacking Mission implementation
    HackingMissionRepToDiffConversion: 10000, // Faction rep is divided by this to get mission difficulty
    HackingMissionRepToRewardConversion: 7, // Faction rep divided byt his to get mission rep reward
    HackingMissionSpamTimeIncrease: 25000, // How much time limit increase is gained when conquering a Spam Node (ms)
    HackingMissionTransferAttackIncrease: 1.05, // Multiplier by which the attack for all Core Nodes is increased when conquering a Transfer Node
    HackingMissionMiscDefenseIncrease: 1.05, // The amount by which every misc node's defense is multiplied when one is conquered
    HackingMissionDifficultyToHacking: 135, // Difficulty is multiplied by this to determine enemy's "hacking" level (to determine effects of scan/attack, etc)
    HackingMissionHowToPlay: "Hacking missions are a minigame that, if won, will reward you with faction reputation.<br><br>" +
                             "In this game you control a set of Nodes and use them to try and defeat an enemy. Your Nodes " +
                             "are colored blue, while the enemy's are red. There are also other nodes on the map colored gray " +
                             "that initially belong to neither you nor the enemy. The goal of the game is " +
                             "to capture all of the enemy's Database nodes within the time limit. " +
                             "If you fail to do this, you will lose.<br><br>" +
                             "Each Node has three stats: Attack, Defense, and HP. There are five different actions that " +
                             "a Node can take:<br><br> " +
                             "Attack - Targets an enemy Node and lowers its HP. The effectiveness is determined by the owner's Attack, the Player's " +
                             "hacking level, and the enemy's defense.<br><br>" +
                             "Scan - Targets an enemy Node and lowers its Defense. The effectiveness is determined by the owner's Attack, the Player's hacking level, and the " +
                             "enemy's defense.<br><br>"  +
                             "Weaken - Targets an enemy Node and lowers its Attack. The effectiveness is determined by the owner's Attack, the Player's hacking level, and the enemy's " +
                             "defense.<br><br>" +
                             "Fortify - Raises the Node's Defense. The effectiveness is determined by your hacking level.<br><br>" +
                             "Overflow - Raises the Node's Attack but lowers its Defense. The effectiveness is determined by your hacking level.<br><br>" +
                             "Note that when determining the effectiveness of the above actions, the TOTAL Attack or Defense of the team is used, not just the " +
                             "Attack/Defense of the individual Node that is performing the action.<br><br>" +
                             "To capture a Node, you must lower its HP down to 0.<br><br>" +
                             "There are six different types of Nodes:<br><br>" +
                             "CPU Core - These are your main Nodes that are used to perform actions. Capable of performing every action<br><br>" +
                             "Firewall - Nodes with high defense. These Nodes can 'Fortify'<br><br>" +
                             "Database - A special type of Node. The player's objective is to conquer all of the enemy's Database Nodes within " +
                             "the time limit. These Nodes cannot perform any actions<br><br>"  +
                             "Spam - Conquering one of these Nodes will slow the enemy's trace, giving the player additional time to complete " +
                             "the mission. These Nodes cannot perform any actions<br><br>" +
                             "Transfer - Conquering one of these nodes will increase the Attack of all of your CPU Cores by a small fixed percentage. " +
                             "These Nodes are capable of performing every action except the 'Attack' action<br><br>" +
                             "Shield - Nodes with high defense. These Nodes can 'Fortify'<br><br>" +
                             "To assign an action to a Node, you must first select one of your Nodes. This can be done by simply clicking on it. Double-clicking " +
                             "a node will select all of your Nodes of the same type (e.g. select all CPU Core Nodes or all Transfer Nodes). Note that only Nodes " +
                             "that can perform actions (CPU Core, Transfer, Shield, Firewall) can be selected. Selected Nodes will be denoted with a white highlight. After selecting a Node or multiple Nodes, " +
                             "select its action using the Action Buttons near the top of the screen. Every action also has a corresponding keyboard " +
                             "shortcut.<br><br>" +
                             "For certain actions such as attacking, scanning, and weakening, the Node performing the action must have a target. To target " +
                             "another node, simply click-and-drag from the 'source' Node to a target. A Node can only have one target, and you can target " +
                             "any Node that is adjacent to one of your Nodes (immediately above, below, or to the side. NOT diagonal). Furthermore, only CPU Cores and Transfer Nodes " +
                             "can target, since they are the only ones that can perform the related actions. To remove a target, you can simply click on the line that represents " +
                             "the connection between one of your Nodes and its target. Alternatively, you can select the 'source' Node and click the 'Drop Connection' button, " +
                             "or press 'd'.<br><br>" +
                             "Other Notes:<br><br>" +
                             "-Whenever a miscellenaous Node (not owned by the player or enemy) is conquered, the defense of all remaining miscellaneous Nodes that " +
                             "are not actively being targeted will increase by a fixed percentage.<br><br>" +
                             "-Whenever a Node is conquered, its stats are significantly reduced<br><br>" +
                             "-Miscellaneous Nodes slowly raise their defense over time<br><br>" +
                             "-Nodes slowly regenerate health over time.",

    // Time-related constants
    MillisecondsPer20Hours: 72000000,
    GameCyclesPer20Hours: 72000000 / 200,

    MillisecondsPer10Hours: 36000000,
    GameCyclesPer10Hours: 36000000 / 200,

    MillisecondsPer8Hours: 28800000,
    GameCyclesPer8Hours: 28800000 / 200,

    MillisecondsPer4Hours: 14400000,
    GameCyclesPer4Hours: 14400000 / 200,

    MillisecondsPer2Hours: 7200000,
    GameCyclesPer2Hours: 7200000 / 200,

    MillisecondsPerHour: 3600000,
    GameCyclesPerHour: 3600000 / 200,

    MillisecondsPerHalfHour: 1800000,
    GameCyclesPerHalfHour: 1800000 / 200,

    MillisecondsPerQuarterHour: 900000,
    GameCyclesPerQuarterHour: 900000 / 200,

    MillisecondsPerFiveMinutes: 300000,
    GameCyclesPerFiveMinutes: 300000 / 200,

    // Player Work & Action
    FactionWorkHacking: "Faction Hacking Work",
    FactionWorkField: "Faction Field Work",
    FactionWorkSecurity: "Faction Security Work",

    WorkTypeCompany: "Working for Company",
    WorkTypeCompanyPartTime: "Working for Company part-time",
    WorkTypeFaction: "Working for Faction",
    WorkTypeCreateProgram: "Working on Create a Program",
    WorkTypeStudyClass: "Studying or Taking a class at university",
    WorkTypeCrime: "Committing a crime",

    ClassStudyComputerScience: "studying Computer Science",
    ClassDataStructures: "taking a Data Structures course",
    ClassNetworks: "taking a Networks course",
    ClassAlgorithms: "taking an Algorithms course",
    ClassManagement: "taking a Management course",
    ClassLeadership: "taking a Leadership course",
    ClassGymStrength: "training your strength at a gym",
    ClassGymDefense: "training your defense at a gym",
    ClassGymDexterity: "training your dexterity at a gym",
    ClassGymAgility: "training your agility at a gym",

    ClassDataStructuresBaseCost: 40,
    ClassNetworksBaseCost: 80,
    ClassAlgorithmsBaseCost: 320,
    ClassManagementBaseCost: 160,
    ClassLeadershipBaseCost: 320,
    ClassGymBaseCost: 120,

    ClassStudyComputerScienceBaseExp: 0.5,
    ClassDataStructuresBaseExp: 1,
    ClassNetworksBaseExp: 2,
    ClassAlgorithmsBaseExp: 4,
    ClassManagementBaseExp: 2,
    ClassLeadershipBaseExp: 4,

    CrimeShoplift: "shoplift",
    CrimeRobStore: "rob a store",
    CrimeMug: "mug someone",
    CrimeLarceny: "commit larceny",
    CrimeDrugs: "deal drugs",
    CrimeBondForgery: "forge corporate bonds",
    CrimeTraffickArms: "traffick illegal arms",
    CrimeHomicide: "commit homicide",
    CrimeGrandTheftAuto: "commit grand theft auto",
    CrimeKidnap: "kidnap someone for ransom",
    CrimeAssassination: "assassinate a high-profile target",
    CrimeHeist: "pull off the ultimate heist",

    // Coding Contract
    // TODO: Move this into Coding contract implementation?
    CodingContractBaseFactionRepGain: 2500,
    CodingContractBaseCompanyRepGain: 4000,
    CodingContractBaseMoneyGain: 75e6,

    // BitNode/Source-File related stuff
    TotalNumBitNodes: 24,

    LatestUpdate: `
    v0.52.3 - 2021-07-15 Gangs were OP (hydroflame)
    -------------------------------------------

    ** Gang **

    * Significant rework. Ascension is now based on exp gained.
    * All upgrades give exp bonuses.
    * Maximum gang members reduced to 12.
    * Respect required to recruit sharply increased.
    * Rewritten in React, the UI should be smoother and less laggy now.

    ** Infiltration **

    * Now isTrusted protected.

    ** Misc. **

    * Many UI element are now "noselect" protected.
    * Fixed an issue where you could join the same faction twice via script and
      UI simultaneously.
    * Factions list screen converted to React.
`,
}