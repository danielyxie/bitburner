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
  CodingContractBaseFactionRepGain: number;
  CodingContractBaseCompanyRepGain: number;
  CodingContractBaseMoneyGain: number;
  AugmentationGraftingCostMult: number;
  AugmentationGraftingTimeBase: number;
  SoACostMult: number;
  SoARepMult: number;
  EntropyEffect: number;
  TotalNumBitNodes: number;
  InfiniteLoopLimit: number;
  Donations: number; // number of blood/plasma/palette donation the dev have verified., boosts NFG
  LatestUpdate: string;
} = {
  VersionString: "2.1.0",
  VersionNumber: 26,

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
  CorpFactionRepRequirement: 400e3,

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

  NumNetscriptPorts: Number.MAX_SAFE_INTEGER,

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

  // Coding Contract
  // TODO: Move this into Coding contract implementation?
  CodingContractBaseFactionRepGain: 2500,
  CodingContractBaseCompanyRepGain: 4000,
  CodingContractBaseMoneyGain: 75e6,

  // Augmentation grafting multipliers
  AugmentationGraftingCostMult: 3,
  AugmentationGraftingTimeBase: 3600000,

  // SoA mults
  SoACostMult: 7,
  SoARepMult: 1.3,

  // Value raised to the number of entropy stacks, then multiplied to player multipliers
  EntropyEffect: 0.98,

  // BitNode/Source-File related stuff
  TotalNumBitNodes: 24,

  InfiniteLoopLimit: 2000,

  Donations: 30,

  LatestUpdate: `
  v2.1.0 - 2022-09-23 Remote File API
  -----------------------------------
  
    Dev notes
    * The most important change about this update is the introduction of the remote file api.
      With this we also deprecate the HTTP file api and the visual studio extension. Those things
      were made during the rush of Steam and aren't well thought out. This new process works with
      both the web and Steam version of the game and every text editor. Moving forward we also
      won't be doing much, if any, upgrades to the in-game editor. We think it's good enough for
      now and if you need more we recommend you hook up your favorite external editor.
    * Added functions to resize, move, and close tail windows
    * Added a new Augmentation, Z.O.Ë., which allows Sleeves to benefit from Stanek.
  
    API
    *  Remove incorrectly placed 's' in ns.tFormat() (by @LJNeon)
    *  More ports (previously max 20, now practically unlimited) (by @Hoekstraa)
    *  Corp functions now return copy of constant arrays instead of the original (by @Mughur)
    *  All the player sub-objects need to be copied for 'getPlayer'. (by @MageKing17)
    *  add corp get<constant> functions, UI (by @Mughur)
    *  FIX #3860 destroyW0r1dD43m0n now properly gives achievements and FIX #3890 favor now properly syncs across pages and the Donate achievement is now given correctly (by @Aerophia)
  
    CONTRIBUTIONS
    *  Modify PR template (by @Hoekstraa)
  
    CCT
    *  inconsistent probability for generation between online and offline (by @quacksouls)
  
    DOC
    *  Some typo fixes in Netscript functions (by @quacksouls)
    *  Fix #4033 Why use Coding Contract API  (by @quacksouls)
    *  typo fix in description of Caesar cipher (by @quacksouls)
    *  FIX DOCS TYPO IN terminal.rst (by @BugiDev)
    *  Update bitburner.sleeve.settobladeburneraction.md (by @borisflagell)
  
    CORPORATION
    *  FIX #3880, #3876, #3322 and #3138 Bunch of corporation fixes (by @Mughur)
    *  Gave investors some economics classes (by @Mughur)
    *  Limit shareholder priority on newly issued shares (by @Undeemiss)
  
    UI
    *  FIX #2962 Add a setting to display middle time unit in Time Elapsed String (by @hydroflame)
    *  FIX #4106 Fix incorrect experience display in Crime UI. (by @SilverNexus)
    *  Bitnode stats now show if BB/Corporation are disabled (by @Kelenius)
    *  Removed three empty lines from BB status screen (by @Kelenius)
    *  Add missing space to BN7 description (by @hex7cd)
    *  Improvements to crime work UI (by @Kelenius)
    *  FIX #3975, #3882 Script Editor more responsive on resize, and fix dirty file indicator (by @Snarling)
  
    API FIX
    *  getCrimeStats use bitnode multipliers in the output of crime stats (by @phyzical)
  
    SLEEVES
    *  FIX #3819 Allow using the regeneration chamber with sleeves to heal them. (by @coderanger)
    *  FIX #4063 fix crash when player tries to assign more than 3 sleeves to Bladeburner contracts (by @Snarling)
    *  FIX #4051 Sleeves no longer crash when player quits company sleeve was working (by @Snarling)
  
    API BACKUP
    *  add singularity function for exporting game save back (by @phyzical)
  
    CORPORATION API
    *  FIX #3655 Expose exports from Material (by @Rasmoh)
  
    SCRIPTS
    *  FIX #4081 Rerunning a script from tail window recalculates ram usage (by @Snarling)
    *  FIX #3962 The correct script will be closed even if the player modifies args (v2.0) (by @Snarling)
  
    DOCUMENTATION
    *  Fixed Argument order for scp() (by @njalooo)
  
    CORP API
    *  Fix up param order for limitProductProduction to match docs (by @phyzical)
  
    NETSCRIPT
    *  FIX #2376 ns.exit now exits immediately (by @Snarling)
    *  FIX #4055 Fix dynamic ram check (by @Snarling)
    *  FIX #4037 ns1 wraps deeper layers correctly. (by @Snarling)
    *  FIX #3963 Prevent bladeburner.setActionLevel from setting invalid action levels (by @MPJ-K)
    *  Typo fixes in CodingContract, Hacknet, Singularity APIs (by @quacksouls)
    *  Fix a typo in doc of Singularity.travelToCity() (by @quacksouls)
    *  Update netscript definition file for scp, write, read, and flags (by @Snarling)
    *  Correct missing ! for boolean coercion in Corporation.createCorporation().  (by @Risenafis)
    *  Normalized Stock API logging (by @Snarling)
    *  fix #3992 allow null duration in toast ns function (by @RollerKnobster)
    *  Correct missing '!' for boolean coercion in 'singularity.workForCompany()'. (by @MageKing17)
    *  ns.scp and ns.write are now synchronous + fix exec race condition (by @Snarling)
    *  FIX #2931 atExit now allows synchronous ns functions (by @Snarling)
    *  Improve real life CPU and memory performance of scripts. (by @Snarling)
  
    INFILTRATION
    *  Corrected ns formula for infiltration rewards (by @ezylot)
  
    RFA
    *  NetscriptDefinitions retains export strings (by @Hoekstraa)
    *  Fix type of RFAMessages with non-String results (by @Hoekstraa)
    *  New Remote File API addition for transmitting files to the game (by @Hoekstraa)
  
    SLEEVE
    *  FIX #4022, #4024, #4025, #3998 (by @Mughur)
  
    DOCS, UI
    *  update docs a bit more, amending some BN and SF texts (by @Mughur)
  
    GANG
    *  Added weight to GangMemberTask construction call (by @ezylot)
  
    Coding Contracts
    *  Don't stringify answer if already a string (by @alainbryden)
  
    TERMINAL
    *  Fix ansi display bugs (by @Snarling)
  
    SCRIPT EDITOR
    *  Debounce updateRAM calls. (by @Snarling)
  
    WORK
    *  Add singularity check for finishing company work (by @Snarling)
  
    DOCS
    *  Correct documentation for 'run()' with 0 threads. (by @MageKing17)
    *  Some doc updates (by @Mughur)
  
    FILES
    *  FIX #3979 Allow characters & and ' in filenames (by @Snarling)
  
    CORP FIX
    *  dont take research points for something already researched via api (by @phyzical)
  
    FIX
    *  Prompt Add user friendly message to avoid throwing recovery screen for invalid choices (by @phyzical)
  
    TUTORIAL
    *  Fix #3965 Corrected tutorial text (by @mihilt)
  
    CONTRACTS
    *  FIX #3755 change input handling for contract attempts (by @Snarling)
  
    HOTFIX
    *  Fix infil definitions.d.ts (by @phyzical)
  
    MISC
    *  crime gains, sleeve gang augs and faq (by @Mughur)
    *  FIX #3649 Preventing server starting security level from going above 100 (by @Shiiyu)
    *  Adds Shadows of Anarchy (by @Lagicrus)
    * Added intormation about hacking managers to hacking algorithms page (by @Kelenius)
    * Fix Jest CI Error (by @geggleto)
    *  multiple hasAugmentation checks didn't check if the augment was installed (by @Mughur)
    * Fix for #2442 and #2795. (by @G4mingJon4s)
    *  Adds info regarding augments and focus (by @Lagicrus)
    * Removed console.log line (by @dhosborne)
    * Update some doc (by @hydroflame)
    *  Sleeve crime gain bitnode multiplier fix (by @Mughur)
    * trying to fix int problems (by @hydroflame)
    * Fix broken ns filesnames (by @hydroflame)
    * new formula functions (by @hydroflame)
    * v2.0.0 (by @hydroflame)
    *  test fixes/md updates (by @phyzical)
    * Remove "based" from positive adjectives in infil (by @faangbait)
    * minor fix in instance calculation (by @hydroflame)
    * fix dynamic ram miscalc not triggering (by @hydroflame)
    * Refactor game options into separate components (by @hydroflame)
    * fix documentation for remote api (by @hydroflame)
    * fix settings unfocusing on every key stroke (by @hydroflame)
    * fix some stuff with the timestamp settings (by @hydroflame)
    * fix some stuff with the timestamp settings (by @hydroflame)
    * Fix unique key problem with ascii elements (by @hydroflame)
    * Improve wrong arg user message and add ui.windowSize (by @hydroflame)
    * fix stack trace missing in some errors (by @hydroflame)
    * Fix scp and write in ns1 (by @hydroflame)
    * Did some changes of the remote api and added documentation (by @hydroflame)
    * Add dummy function to generate a mock server or player for formulas stuff (by @hydroflame)
    * fix compile error (by @hydroflame)
    * regen doc (by @hydroflame)
    * rm console log (by @hydroflame)
    * regen doc (by @hydroflame)
    * Added more info about blood program, change some aug descriptions (by @hydroflame)
    * use triple equal (by @hydroflame)
    * Minor improvements to Netscript Port loading and unloading (by @hydroflame)
    * Fix hostname generation being weird about dash 0 added (by @hydroflame)
    * upgrade version number. (by @hydroflame)
    * Nerf Noodle bar 
  
`,
};
