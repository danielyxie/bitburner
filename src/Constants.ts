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
  VersionString: "2.2.0",
  VersionNumber: 28,

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

  Donations: 41,

  LatestUpdate: `
  v2.2.0 - Jan 2 2023 Development Reboot

  Dev notes
  * The previous main developer, hydroflame, is stepping back from this project for the foreseeable future.
    To facilitate this, we've moved the repo to a new location at https://github.com/bitburner-official/bitburner-src
  * Sorry for the large number of API breaks in this version. To ease the pain here, attempting to use any of the
    removed functions will provide an error guiding you to the new replacement function to use instead.

  BREAKING API CHANGES:
  *  (ns2 only) ns functions use the 'this' value from ns: if you move the function to its own variable off of ns, it
     needs to be bound to ns. e.g.:
       const tprint1 = ns.tprint; // This doesn't work and will error out when calling tprint1();
       const tprint = ns.tprint.bind(ns); // This works because the 'this' value is preserved.
     The internal changes that make this necessary led to very large performance gains for running many scripts at once.
  *  ns.getPlayer no longer provides properties tor, inBladeburner, or hasCorporation. This information can be looked
     up using standlone functions: ns.hasTorRouter(), ns.bladeburner.inBladeburner(), ns.corporation.hasCorporation().
  *  Removed many functions, with replacement ways to get the same info.
     getServerRam: use getServerMaxRam and getServerUsedRam instead.
     corporation.assignJob: use setAutoJobAssignment instead.
     corporation.getEmployee: No longer available (employees are not individual objects).
     corporation.getExpandCityCost: use ns.corporation.getConstants().officeInitialCost
     corporation.getExpandIndustryCost: use getIndustryData instead.
     corporation.getIndustryTypes: use ns.corporation.getConstants().industryNames
     corporation.getMaterialNames: use ns.corporation.getConstants().materialNames
     corporation.getPurchaseWarehouseCost: use ns.corporation.getConstants().warehouseInitialCost
     corporation.getResearchNames: use ns.corporation.getConstants().researchNames
     corporation.getUnlockables: use ns.corporation.getConstants().unlockNames
     corporation.getUpgradeNames: use ns.corporation.getConstants().upgradeNames
     formulas.work.classGains: split into universityGains and gymGains
     singularity.getAugmentationCost: use getAugmentationPrice and getAugmentationRepReq instead
     sleeve.getSleeveStats: use getSleeve instead
     sleeve.getInformation: use getSleeve instead
  *  An error dialog will inform the player of the above API changes if the player tries to use one of the
     removed functions above.
  *  enums.toast was renamed ToastVariant to provide consistency with internal code.
  *  codingcontract.attempt always returns a string (empty string for a failed attempt). This may break player code
     if a direct boolean comparison (e.g. 'attemptResult === true') was being made. The string can be used directly as
     the conditional, because empty string evaluates to false as a boolean.
  *  corporation.getCorporation().divisions now returns an array of division names, instead of division objects. Use
     corporation.getDivision(name) to get the division info object.

  DEVELOPMENT
  *  Development repo moved to https://github.com/bitburner-official/bitburner-src
  *  Dev version available on web at https://bitburner-official.github.io/bitburner-src/
  *  Development is active again for non-bugfix.
  *  A bunch of fixes and setup related to moving to a new repo (@hydroflame)

  TUTORIAL
  *  Removed NS1/NS2 selection. Tutorial now only references .js files (NS1 is essentially deprecated) (@Mughur)
  *  Fix Ram Text (by @jaculler)

  NETSCRIPT
  *  Added ns.pid property to access a script's PID without a function call. (@jeek)
  *  Much faster API wrapping on script launch. (@d0sboots) To support this, ns functions need to keep their "this"
     value from their parent object.
  *  Expose more enums for player use under ns.enums (@Snarling)
  *  tFormat: Fix display for negative time
  *  ns.getPlayer: removed tor, inBladeburner, and hasCorporation properties
  *  Added ns.hasTorRouter() function.
  -- CODING CONTRACT
     *  ns.codingcontract.attempt always returns a string. (@Snarling)
  -- CORPORATION
     *  Removed ns.corporation.getEmployee and ns.corporation.assignJob, due to employees no longer being objects.
     *  Added ns.corporation.hasCorporation();
     *  Reworked how ram costs are applied for corporation.
  -- FORMULAS
     *  ns.formulas.work.classGains removed, replaced with ns.formulas.work.universityGains and
        ns.formulas.work.gymGains (@Snarling)
     *  Add ns.formulas.work.companyGains function (@AlexeyKozhemiakin)
  -- PORTS
     *  added portHandle.nextWrite() (@LJNeon)
     *  Make ns.writePort synchronous (@Snarling)
  -- SLEEVE
     *  ns.sleeve.getSleeve added. getPlayer and getSleeve can both be used for formulas. (@Snarling)
     *  getSleeve also includes storedCycles (i.e. bonusTime) (@zerbosh)
  -- STOCK
     *  ns.stock.getOrganization added for getting org from stock symbol (@SamuraiNinjaGuy)

  SCRIPTS
  *  Fixed bug where zombie scripts could be created after a soft reset (@Snarling)
  *  Scripts now have a maximum ram cost of 1024GB per thread.

  SCRIPT LOGS
  *  Add ctrl-a support for selecting all text in tail window (@Snarling)

  CORPORATION
  *  Remove corp employees as objects (by @Kelenius)
  *  API access is provided automatically if the player is in BN3. (@zerbosh)
  *  Happiness/Energy/Morale trend down even for productive corps (by @Snarling)
  *  Typo fixes in modals to sell materials and products (by @quacksouls)
  *  Reworked MP formula validation to prevent possible save corruption on invalid entry (by @Snarling)
  *  Internal reorganization of Industry data (by @Snarling)
  *  Added check to material buy amount (by @G4mingJon4s)
  *  Check there is room to make a new product before opening popup. (by @G4mingJon4s)
  *  Fix typos in research descriptions (by @quacksouls)

  SLEEVE
  *  Fixed inconsistencies in how sleeve work rewards are handled. (by @Snarling)
  *  Fix bug that prevented selecting some crimes from UI. (by @Snarling)
  *  Internally shock starts at 100 and lowers to 0. Previously this was backwards.

  STOCKMARKET
  *  Fix broken initializer when manually buying WSE access (by @Snarling)

  TERMINAL
  *  Added changelog command to re-display the changelog dialog.
  *  Connect command will connect to player owned servers from anywhere. (by @Snarling)

  UI
  *  Improve UI performance of sidebar and character overview using memoization (@d0sboots)
  *  Other UI additions / improvements (@Mughur, @d0sboots, probably others)
  *  Fixed spacing of text in Trade for reputation button after Infiltration (by @PyroGenesis)
  *  Fix spacing on ANSI background escape codes (by @Snarling)
  *  Fix several instances where newlines were not being displayed properly (by @quacksouls)
  *  SoftResetButton.tsx Tooltip changed to make more sense (by @rai68)
  *  GANG: Fix Gang UI to correctly report the bonus time multiplier as 25x (by @TheMas3212)
  *  Change formatting for skill levels to use localeStr (@G4mingJon4s)

  DOC
  *  Fix incorrect examples for grow (by @quacksouls)
  *  Updated limitMaterialProduction() and limitProductProduction() documentation to mention removing limits. (by @PyroGenesis)
  *  Add ns documentation for possible sleeve tasks (by @Snarling)
  *  Update documentation for workForFaction and workForCompany (by @quacksouls)
  *  Improve CCT documentation for HammingCodes (by @quacksouls)
  *  cleanup in doc of Netscript functions (by @quacksouls)
  *  Various other doc fixes (by @quacksouls)
  *  Update documentation for ns.args (by @Snarling)
  *  De-uglify ns.print examples (by @LJNeon)

  STATS
  *  Fix logic for increasing HP based on defense skill levels (by @mattgarretson)
  *  Fix a bug where HP could be something other than max after a bitnode reset.

  INFILTRATION
  *  Fix SlashGame scaling. (by @Snarling)
  
  GANG
  * When starting a gang, any in progress work with that faction will end. (@G4mingJon4s) 

  MISC
  *  Remove google analytics (@hydroflame)
  *  Some error handling streamlining (by @Snarling)
  *  fix: check both ts and js source now (by @Tanimodori)
  *  chore: sync version in package-lock.json (by @Tanimodori)
  *  Better safety when loading game for multiple save corruption issues (by @Snarling)
  *  Nerf Noodle bar

  `,
};
