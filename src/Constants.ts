/**
 * Generic Game Constants
 *
 * Constants for specific mechanics or features will NOT be here.
 */
export const CONSTANTS: {
  VersionString: string;
  VersionNumber: number;
  _idleSpeed: number;
  MaxSkillLevel: number;
  MilliPerCycle: number;
  CorpFactionRepRequirement: number;
  BaseFocusBonus: number;
  BaseCostFor1GBOfRamHome: number;
  BaseCostFor1GBOfRamServer: number;
  TravelCost: number;
  BaseFavorToDonate: number;
  DonateMoneyToRepDivisor: number;
  FactionReputationToFavorBase: number;
  FactionReputationToFavorMult: number;
  CompanyReputationToFavorBase: number;
  CompanyReputationToFavorMult: number;
  NeuroFluxGovernorLevelMult: number;
  NumNetscriptPorts: number;
  HomeComputerMaxRam: number;
  ServerBaseGrowthRate: number;
  ServerMaxGrowthRate: number;
  ServerFortifyAmount: number;
  ServerWeakenAmount: number;
  PurchasedServerLimit: number;
  PurchasedServerMaxRam: number;
  MultipleAugMultiplier: number;
  TorRouterCost: number;
  WSEAccountCost: number;
  TIXAPICost: number;
  MarketData4SCost: number;
  MarketDataTixApi4SCost: number;
  StockMarketCommission: number;
  HospitalCostPerHp: number;
  IntelligenceCrimeWeight: number;
  IntelligenceInfiltrationWeight: number;
  IntelligenceCrimeBaseExpGain: number;
  IntelligenceProgramBaseExpGain: number;
  IntelligenceGraftBaseExpGain: number;
  IntelligenceTerminalHackBaseExpGain: number;
  IntelligenceSingFnBaseExpGain: number;
  IntelligenceClassBaseExpGain: number;
  MillisecondsPer20Hours: number;
  GameCyclesPer20Hours: number;
  MillisecondsPer10Hours: number;
  GameCyclesPer10Hours: number;
  MillisecondsPer8Hours: number;
  GameCyclesPer8Hours: number;
  MillisecondsPer4Hours: number;
  GameCyclesPer4Hours: number;
  MillisecondsPer2Hours: number;
  GameCyclesPer2Hours: number;
  MillisecondsPerHour: number;
  GameCyclesPerHour: number;
  MillisecondsPerHalfHour: number;
  GameCyclesPerHalfHour: number;
  MillisecondsPerQuarterHour: number;
  GameCyclesPerQuarterHour: number;
  MillisecondsPerFiveMinutes: number;
  GameCyclesPerFiveMinutes: number;
  FactionWorkHacking: string;
  FactionWorkField: string;
  FactionWorkSecurity: string;
  WorkTypeCompany: string;
  WorkTypeCompanyPartTime: string;
  WorkTypeFaction: string;
  WorkTypeCreateProgram: string;
  WorkTypeStudyClass: string;
  WorkTypeCrime: string;
  WorkTypeGraftAugmentation: string;
  ClassStudyComputerScience: string;
  ClassDataStructures: string;
  ClassNetworks: string;
  ClassAlgorithms: string;
  ClassManagement: string;
  ClassLeadership: string;
  ClassGymStrength: string;
  ClassGymDefense: string;
  ClassGymDexterity: string;
  ClassGymAgility: string;
  ClassDataStructuresBaseCost: number;
  ClassNetworksBaseCost: number;
  ClassAlgorithmsBaseCost: number;
  ClassManagementBaseCost: number;
  ClassLeadershipBaseCost: number;
  ClassGymBaseCost: number;
  ClassStudyComputerScienceBaseExp: number;
  ClassDataStructuresBaseExp: number;
  ClassNetworksBaseExp: number;
  ClassAlgorithmsBaseExp: number;
  ClassManagementBaseExp: number;
  ClassLeadershipBaseExp: number;
  CrimeShoplift: string;
  CrimeRobStore: string;
  CrimeMug: string;
  CrimeLarceny: string;
  CrimeDrugs: string;
  CrimeBondForgery: string;
  CrimeTraffickArms: string;
  CrimeHomicide: string;
  CrimeGrandTheftAuto: string;
  CrimeKidnap: string;
  CrimeAssassination: string;
  CrimeHeist: string;
  CodingContractBaseFactionRepGain: number;
  CodingContractBaseCompanyRepGain: number;
  CodingContractBaseMoneyGain: number;
  AugmentationGraftingCostMult: number;
  AugmentationGraftingTimeBase: number;
  EntropyEffect: number;
  TotalNumBitNodes: number;
  LatestUpdate: string;
} = {
  VersionString: "1.6.0",
  VersionNumber: 12,

  // Speed (in ms) at which the main loop is updated
  _idleSpeed: 200,

  /** Max level for any skill, assuming no multipliers. Determined by max numerical value in javascript for experience
   * and the skill level formula in Player.js. Note that all this means it that when experience hits MAX_INT, then
   * the player will have this level assuming no multipliers. Multipliers can cause skills to go above this.
   */
  MaxSkillLevel: 975,

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
  ServerBaseGrowthRate: 1.03, // Unadjusted Growth rate
  ServerMaxGrowthRate: 1.0035, // Maximum possible growth rate (max rate accounting for server security)
  ServerFortifyAmount: 0.002, // Amount by which server's security increases when its hacked/grown
  ServerWeakenAmount: 0.05, // Amount by which server's security decreases when weakened

  PurchasedServerLimit: 25,
  PurchasedServerMaxRam: 1048576, // 2^20

  // Augmentation Constants
  MultipleAugMultiplier: 1.9,

  // TOR Router
  TorRouterCost: 200e3,

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
  IntelligenceProgramBaseExpGain: 0.1, // Program required hack level divided by this to determine int exp gain
  IntelligenceGraftBaseExpGain: 0.05,
  IntelligenceTerminalHackBaseExpGain: 200, // Hacking exp divided by this to determine int exp gain
  IntelligenceSingFnBaseExpGain: 1.5,
  IntelligenceClassBaseExpGain: 0.01,

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
  BaseFocusBonus: 0.8,
  FactionWorkHacking: "Faction Hacking Work",
  FactionWorkField: "Faction Field Work",
  FactionWorkSecurity: "Faction Security Work",

  WorkTypeCompany: "Working for Company",
  WorkTypeCompanyPartTime: "Working for Company part-time",
  WorkTypeFaction: "Working for Faction",
  WorkTypeCreateProgram: "Working on Create a Program",
  WorkTypeStudyClass: "Studying or Taking a class at university",
  WorkTypeCrime: "Committing a crime",
  WorkTypeGraftAugmentation: "Grafting an Augmentation",

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

  // Augmentation crafting multipliers
  AugmentationGraftingCostMult: 3,
  AugmentationGraftingTimeBase: 3600000,

  // Value raised to the number of entropy stacks, then multiplied to player multipliers
  EntropyEffect: 0.98,

  // BitNode/Source-File related stuff
  TotalNumBitNodes: 24,

  LatestUpdate: `
  v1.6.0 - 2022-03-29 Grafting
  ----------------------------

  ** Vitalife secret lab **

  * A new mechanic called Augmentation Grafting has been added. Resleeving has been removed.
  * Credit to @nikfolas for his incredible work.

  ** Stanek **

  * BREAKING: Many functions in the stanek API were renamed in order to avoid name collision with things like Map.prototype.get

  ** UI **

  * Major update to Sleeve, Gang UI, and Create Program (@nikfolas)
  * re-add pre tags to support slash n in prompt (@jacktose)
  * Tabelize linked output of 'ls' (@Master-Guy)
  * Add the ability to filter open scripts (@phyzical)
  * Add minHeight to editor tabs (@nickofolas)
  * Properly expand gang equipment cards to fill entire screen (@nickofolas)
  * Add shortcut to Faction augmentations page from FactionsRoot (@nickofolas)
  * Fix extra space on editor tabs (@nickofolas)
  * Present offline message as list (@DSteve595)
  * add box showing remaining augments per faction (@jjayeon)
  * Add tab switching support to vim mode (@JParisFerrer)
  * Show current task on gang management screen (@zeddrak)
  * Fix for ui of gang members current task when set via api (@phyzical)
  * Don't hide irrelevant materials if their stock is not empty and hide irrelevant divisions from Export (@SagePtr)
  * Fix regex to enable alpha transparency hex codes (8 digits) (@surdaft)

  ** API **

  * Added dark web functions to ns api
  * BREAKING: purchaseTor() should returns true if player already has Tor. (@DavidGrinberg, @waffleattack)
  * Implement getBonusTime in Corporation API (@t-wolfeadam)
  * Added functions to purchase TIX and WSI (@incubusnb)
  * purchaseSleeveAug checks shock value (@incubusnb)
  * Fix bug with hacknet api
  * Fix spendHashes bug
  * Added 0 cost of asleep() (@Master-Guy)
  * Fix some misleading corporation errors (@TheRealMaxion)
  * expose the inBladeburner on the player object (@phyzical)
  * added ram charge for stanek width and height (@phyzical)
  * Fix sufficient player money check to buy back shares. (@ChrissiQ)
  * Fix Static Ram Circumventing for some NS functions (@CrafterKolyan)
  * added CorporationSoftCap to NetscriptDefinitions (@phyzical)
  * Added definition of autocomplete() 'data' argument. (@tigercat2000)
  * Adding support for text/select options in Prompt command (@PhilipArmstead)
  * Added the ability to exportGame via api (@phyzical)

  ** Arcade **

  * Added an arcade to New Tokyo where you can play a 4 year old version of bitburner.

  ** Misc. **

  * Add a warning triggered while auto-saves are off. (@MartinFournier)
  * Log info for field analysis now displays actual rank gained. (@ApamNapat)
  * Removed BladeburnerSkillCost from skill point cost description. (@ApamNapat)
  * Fix handling for UpArrow in bladeburner console. (@dowinter)
  * Add GitHub action to check PRs for generated files. (@MartinFournier)
  * Cap Staneks gift at 25x25 to prevent crashes. (@waffleattack)
  * Remove old & unused files from repository. (@MartinFournier)
  * Factions on the factions screens are sorted by story progress / type. (@phyzical)
  * Fix log manager not picking up new runs of scripts. (@phyzical)
  * Added prettier to cicd.
  * UI improvements (@phyzical)
  * Documentation / Typos (@nanogyth, @Master-Guy, @incubusnb, @ApamNapat, @phyzical, @SagePtr)
  * Give player code a copy of Division.upgrades instead of the live object (@Ornedan)
  * Fix bug with small town achievement.
  * Fix bug with purchaseSleeveAug (@phyzical)
  * Check before unlocking corp upgrade (@gianfun)
  * General codebase improvements. (@phyzical, @Master-Guy, @ApamNapat)
  * Waiting on promises in NS1 no longer freezes the script. (@Master-Guy)
  * Fix bug with missing ramcost for tFormat (@TheMas3212)
  * Fix crash with new prompt
  * Quick fix to prevent division by 0 in terminal (@Master-Guy)
  * removed ip references (@phyzical, @Master-Guy)
  * Terminal now supports 'ls -l'
  * Fix negative number formatting (@Master-Guy)
  * Fix unique ip generation (@InDieTasten)
  * remove terminal command theme from docs (@phyzical)
  * Fix 'Augmentations Left' with gang factions (@nickofolas)
  * Attempt to fix 'bladeburner.process()' early routing issue (@MartinFournier)
  * work in progress augment fix (@phyzical)
  * Fixes missing space in Smart Supply (@TheRealMaxion)
  * Change license to Apache 2 with Commons Clause
  * updated regex sanitization (@mbrannen)
  * Sleeve fix for when faction isnt found (@phyzical)
  * Fix editor "close" naming (@phyzical)
  * Fix bug with sleeves where some factions would be listed as workable. (@phyzical)
  * Fix research tree of product industries post-prestige (@pd)
  * Added a check for exisiting industry type before expanding (@phyzical)
  * fix hackAnalyzeThreads returning infinity (@chrisrabe)
  * Make growthAnalyze more accurate (@dwRchyngqxs)
  * Add 'Zoom -> Reset Zoom' command to Steam (@smolgumball)
  * Add hasOwnProperty check to GetServer (@SagePtr)
  * Speed up employee productivity calculation (@pd)
  * Field Work and Security Work benefit from 'share' (@SagePtr)
  * Nerf noodle bar.
`,
};
