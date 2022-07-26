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
  VersionString: "2.0.0",
  VersionNumber: 21,

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

  Donations: 22,

  LatestUpdate: `
v2.0.0 - 2022-07-19 Work rework
-------------------------------

  API break rewards

  * Everyone is awarded 10 NFG.
  * All work in progress program is auto completed.
  * All work in progress crafting is auto completed without adding entropy.

  Work (Create program / Work for faction / Studying / etc ...)

  * Working has been rebuilt from the grounds up. The motivation for that change is that all
    different types of work all required different cached variables on the main Player object.
    This caused a lot of bugs and crashes. It's been reworked in such a way as to prevent bugs
    and make it nearly trivial to add new kinds of work. However, since this caused a few API break
    I've decided to mark this version following semver protocols and call it 2.0.0
  * Crime can be unfocused and auto loops, no more spam clicking.
  * All work type give their reward immediately. No need to stop work to bank rewards like reputation.
  * Faction and Company work no longer have a time limit.
  * Company work no longer reduces rep gain by half for quitting early.
  * Company faction require 400k rep to join (from 200k)
  * Backdooring company server reduces faction requirement to 300k.
  * All work generally no longer keep track of cumulative gains like exp and reputation since it's applied instantly.
  * getPlayer returns way less fields but does return the new 'currentWork' field.

  API breaks

  * workForCompany argument 'companyName' is now not-optional
  * commitCrime now has 'focus' optional parameter
  * using getScriptIncome to get total income has been separated to getTotalScriptIncome.
  * using getScriptExpGain to get total income has been separated to getTotalScriptExpGain.
  * scp has it's 2 last argument reversed, the signature is now (files, destination, optional_source)
  * ns.connect and other singularity function are no longer available at the top level.
    They were already hidden from documentation but now they're gone.
  * stock.buy and stock.sell were renamed to stock.buyStock and stock.sellStock because 'buy' and 'sell'
    are very common tokens.
  * corporation.bribe no longer allows to give shares as bribe.

  Multipliers

  * The main player object was also plagues with a million fields all called '*_mult'. Representing the different multipliers
  * These have been refactored in a field called 'mults'.

  Misc. 

  * Nerf noodle bar, obviously.

`,
};
