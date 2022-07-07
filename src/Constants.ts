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
  VersionString: "1.7.0",
  VersionNumber: 19,

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

  Donations: 20,

  LatestUpdate: `
  ## [draft] v1.7.0 - 2022-04-13 to 2022-05-20

#### Information

Modifications included between **2022-04-13** and **2022-05-20** 'b5e4d70' to '0fbe4a1').

_[See Pull Requests on GitHub](https://github.com/search?q=user%3Adanielyxie%20repo%3Abitburner%20is%3Apr%20is%3Amerged%20merged%3A%222022-04-13T16%3A32%3A26.000Z..2022-05-20T06%3A08%3A51.000Z%22)_

#### Merged Pull Requests

- [Feature] Monaco Theme Editor (by @nickofolas) #[3438](https://github.com/danielyxie/bitburner/pull/3438)
- [Fix] Dummy Stanek grid width (by @nickofolas) #[3442](https://github.com/danielyxie/bitburner/pull/3442)
- [Fix] Theme browser assets not loading (by @nickofolas) #[3446](https://github.com/danielyxie/bitburner/pull/3446)
- Accept valid JSON arrays in coding contracts (by @Savlik) #[3247](https://github.com/danielyxie/bitburner/pull/3247)
- another dark theme? (by @hydroflame) #[3450](https://github.com/danielyxie/bitburner/pull/3450)
- API: Add repFromDonation() to the Formula API (by @Hoekstraa) #[3461](https://github.com/danielyxie/bitburner/pull/3461)
- API: Add safeguard to ns.killall(), preventing killing itself by default (by @Hoekstraa) #[3607](https://github.com/danielyxie/bitburner/pull/3607)
- API: FIX #2993 sleeve.travel with invalid city names (by @TheMas3212) #[3458](https://github.com/danielyxie/bitburner/pull/3458)
- API: Fix inconsistent return value in 'ns.grafting.getAugmentationGraftTime' (by @nickofolas) #[3539](https://github.com/danielyxie/bitburner/pull/3539)
- API: Fix leak of real Employee object in hireEmployee (by @TheMas3212) #[3483](https://github.com/danielyxie/bitburner/pull/3483)
- API: replace a number of references to workerscript.log with \_ctx.log (by @TheMas3212) #[3470](https://github.com/danielyxie/bitburner/pull/3470)
- API: Terminal screen can now be cleared from within scripts with ns.ui.clearTerminal() (by @Hoekstraa) #[3618](https://github.com/danielyxie/bitburner/pull/3618)
- AUGMENTATIONS: Fix 'isSpecial' filter in helper (Removes NeuroFlux, Stanek's Gift, etc from gangs) (by @nickofolas) #[3565](https://github.com/danielyxie/bitburner/pull/3565)
- AUGMENTATIONS: Fix Augmentation rep req not being properly influenced by BitNode multipliers (by @nickofolas) #[3652](https://github.com/danielyxie/bitburner/pull/3652)
- AUGMENTATIONS: Fix NeuroFlux being applied improperly and migrate broken saves (by @nickofolas) #[3613](https://github.com/danielyxie/bitburner/pull/3613)
- AUGMENTATIONS: Fix reputation check for faction augs (by @nickofolas) #[3609](https://github.com/danielyxie/bitburner/pull/3609)
- AUGMENTATIONS: Tweak a couple small UI elements (by @nickofolas) #[3614](https://github.com/danielyxie/bitburner/pull/3614)
- basic doc no longer hacker themed (by @hydroflame) #[3449](https://github.com/danielyxie/bitburner/pull/3449)
- BITNODE: FIX #3546 BitVerse now shows proper BN level when accessed via flume (by @nickofolas) #[3550](https://github.com/danielyxie/bitburner/pull/3550)
- BLADEBURNER: fixes #3648 : Automate console command capitalisation inconsistent (by @Vic1970) #[3647](https://github.com/danielyxie/bitburner/pull/3647)
- BLADEBURNER: Fix #3594 Blade's Simulacrum worked without being installed (by @Undeemiss) #[3639](https://github.com/danielyxie/bitburner/pull/3639)
- blood (by @hydroflame) #[3495](https://github.com/danielyxie/bitburner/pull/3495)
- BUGFIX: getAugmentationCost response backwards (by @phyzical) #[3617](https://github.com/danielyxie/bitburner/pull/3617)
- BUGFIX: Handle edge case in LZ compression code and fix docs (by @stalefishies) #[3581](https://github.com/danielyxie/bitburner/pull/3581)
- BUGFIX: make bonustime for gang in miliseconds (by @phyzical) #[3578](https://github.com/danielyxie/bitburner/pull/3578)
- BUGFIX: sleeve stale object refence during augmentation (by @phyzical) #[3601](https://github.com/danielyxie/bitburner/pull/3601)
- Bugfix/corp updates (by @phyzical) #[3321](https://github.com/danielyxie/bitburner/pull/3321)
- Bump async from 2.6.3 to 2.6.4 (by @dependabot[bot]) #[3463](https://github.com/danielyxie/bitburner/pull/3463)
- CODINGCONTRACT: Fix #3391 Double contract reward exploit (by @Undeemiss) #[3646](https://github.com/danielyxie/bitburner/pull/3646)
- CODINGCONTRACT: FIX #3484 BREAKING Fixed capitalization in contract name (by @Undeemiss) #[3537](https://github.com/danielyxie/bitburner/pull/3537)
- CODINGCONTRACT: New "Proper 2-Coloring of a Graph" contract (by @Undeemiss) #[3530](https://github.com/danielyxie/bitburner/pull/3530)
- CODINGCONTRACT: Three new compression contracts (by @stalefishies) #[3541](https://github.com/danielyxie/bitburner/pull/3541)
- CODINGCONTRACT: Typo & clarity fixes to description of Encoded Binary to Integer contract (by @ActuallyCurtis) #[3469](https://github.com/danielyxie/bitburner/pull/3469)
- CODINGCONTRACT: Updated description of 2-coloring contract (by @Undeemiss) #[3531](https://github.com/danielyxie/bitburner/pull/3531)
- COMPANY: Fix #3551 Applying for a new job will not change active employer if player is performing company work (by @Snarling) #[3552](https://github.com/danielyxie/bitburner/pull/3552)
- CORPORATIONS: Expose makeProducts on NSDivision interface (by @DavidGrinberg) #[3570](https://github.com/danielyxie/bitburner/pull/3570)
- CORPORATIONS: Expose sales cost on NSMaterial interface (by @DavidGrinberg) #[3574](https://github.com/danielyxie/bitburner/pull/3574)
- Corrected example grids found in Stanek help (by @Undeemiss) #[3441](https://github.com/danielyxie/bitburner/pull/3441)
- Create program action no longer creates duplicates (by @Undeemiss) #[3436](https://github.com/danielyxie/bitburner/pull/3436)
- DOCUMENTATION: Add descriptions for compression contracts (by @stalefishies) #[3559](https://github.com/danielyxie/bitburner/pull/3559)
- DOCUMENTATION: Add new coding contract descriptions (by @stalefishies) #[3542](https://github.com/danielyxie/bitburner/pull/3542)
- DOCUMENTATION: Clarify definition for installAugmentations() (by @PSEUDOSTAGE) #[3560](https://github.com/danielyxie/bitburner/pull/3560)
- DOCUMENTATION: FIX #3516 "cannot" misspelled as "cannnot" (by @Undeemiss) #[3533](https://github.com/danielyxie/bitburner/pull/3533)
- EDITOR: FIX #3502 Editor theme migration crash (by @nickofolas) #[3503](https://github.com/danielyxie/bitburner/pull/3503)
- FEATURE: added logic to allow quitJob to be called from singularity (by @phyzical) #[3577](https://github.com/danielyxie/bitburner/pull/3577)
- fix #3395 donating to special factions possible via singularity (by @TheMas3212) #[3456](https://github.com/danielyxie/bitburner/pull/3456)
- fix b1tflum3 and destroyW0r1dD43m0n singularity functions to check for sf4 (by @TheMas3212) #[3443](https://github.com/danielyxie/bitburner/pull/3443)
- Fix inconsistancy with trying to work for gang factions while running a gang (by @TheMas3212) #[3454](https://github.com/danielyxie/bitburner/pull/3454)
- Fix infiltration rep BN mult calculation (by @trambelus) #[3632](https://github.com/danielyxie/bitburner/pull/3632)
- Fix script editor settings. (by @hydroflame) #[3504](https://github.com/danielyxie/bitburner/pull/3504)
- Fix test/jest/Netscript/DynamicRamCalculation.test.js (by @TheMas3212) #[3455](https://github.com/danielyxie/bitburner/pull/3455)
- GRAFTING: Fix Grafting not being handled in singularity stop work (by @nickofolas) #[3568](https://github.com/danielyxie/bitburner/pull/3568)
- GRAFTING: Implement sorting options (by @nickofolas) #[3654](https://github.com/danielyxie/bitburner/pull/3654)
- INFILTRATION: Added new faction called infiltrators that provide infiltration specific augs. (by @phyzical) #[3241](https://github.com/danielyxie/bitburner/pull/3241)
- INFILTRATION: Fix minigame cycle (by @nickofolas) #[3549](https://github.com/danielyxie/bitburner/pull/3549)
- INFILTRATION: Fix phyzical WKS aug effects being applied before aug is installed (by @nickofolas) #[3555](https://github.com/danielyxie/bitburner/pull/3555)
- INFILTRATION: Fix rep reward being substantially higher than intended (by @nickofolas) #[3562](https://github.com/danielyxie/bitburner/pull/3562)
- INFILTRATION: New faction, Shadows of Anarchy, provides various augs to help infiltrations. (by @hydroflame) #[3543](https://github.com/danielyxie/bitburner/pull/3543)
- INFILTRATION: Update gameplay UI (by @nickofolas) #[3587](https://github.com/danielyxie/bitburner/pull/3587)
- keeping up to date (by @hydroflame) #[3432](https://github.com/danielyxie/bitburner/pull/3432)
- Keeping up to date. (by @hydroflame) #[3561](https://github.com/danielyxie/bitburner/pull/3561)
- Make .lit and .msg files clickable (by @Chris380) #[3453](https://github.com/danielyxie/bitburner/pull/3453)
- MESSAGES: Added the name of NiteSec's server to their .msg (by @Undeemiss) #[3466](https://github.com/danielyxie/bitburner/pull/3466)
- MISC: add better typing to Electron.tsx (by @taralx) #[3540](https://github.com/danielyxie/bitburner/pull/3540)
- MISC: Added NS function closeTail to close tail windows (by @Undeemiss) #[3666](https://github.com/danielyxie/bitburner/pull/3666)
- MISC: Adjust deps to current usage (by @taralx) #[3519](https://github.com/danielyxie/bitburner/pull/3519)
- MISC: Close some GitHub issues that do not need action (by @Undeemiss) #[3640](https://github.com/danielyxie/bitburner/pull/3640)
- MISC: Closing more GitHub issues I missed last time (by @Undeemiss) #[3665](https://github.com/danielyxie/bitburner/pull/3665)
- MISC: Correct BB Skill point achievement name (by @Undeemiss) #[3571](https://github.com/danielyxie/bitburner/pull/3571)
- MISC: Correct typos in getScriptRam docs. (by @nzdjb) #[3590](https://github.com/danielyxie/bitburner/pull/3590)
- MISC: Fix #3125 BREAKING Renamed BN mult CorporationSoftCap to CorporationSoftcap (by @Undeemiss) #[3638](https://github.com/danielyxie/bitburner/pull/3638)
- MISC: FIX #3593 Float errors can no longer prevent full usage of a server's available ram. (by @Snarling) #[3619](https://github.com/danielyxie/bitburner/pull/3619)
- MISC: fix typing conflict between jest and cypress (by @taralx) #[3518](https://github.com/danielyxie/bitburner/pull/3518)
- MISC: fix typing conflict between jest and cypress (by @taralx) #[3644](https://github.com/danielyxie/bitburner/pull/3644)
- MISC: Fixed typo in exceptionAlert.ts (by @Undeemiss) #[3572](https://github.com/danielyxie/bitburner/pull/3572)
- MISC: Fixed typos in game options (by @notacompsciguy) #[3584](https://github.com/danielyxie/bitburner/pull/3584)
- MISC: HammingCodingContracts need rework (by @Hedrauta) #[3479](https://github.com/danielyxie/bitburner/pull/3479)
- MISC: Implemented infinite loop safety net. (by @hydroflame) #[3624](https://github.com/danielyxie/bitburner/pull/3624)
- MISC: make jQuery use explicit (by @taralx) #[3517](https://github.com/danielyxie/bitburner/pull/3517)
- MISC: Make tutorial explain ns1 vs ns2 better (by @hydroflame) #[3586](https://github.com/danielyxie/bitburner/pull/3586)
- MISC: Remove comments that describe nonexistent augs (by @Undeemiss) #[3569](https://github.com/danielyxie/bitburner/pull/3569)
- MISC: update @types/numeral and fix type errors (by @taralx) #[3521](https://github.com/danielyxie/bitburner/pull/3521)
- MISC: Update logic for stats page BitNode level (by @nickofolas) #[3512](https://github.com/danielyxie/bitburner/pull/3512)
- MISC: upgrade to eslint v8 (by @taralx) #[3523](https://github.com/danielyxie/bitburner/pull/3523)
- MISC: Wrap most of the API in the new api wrapper (by @hydroflame) #[3627](https://github.com/danielyxie/bitburner/pull/3627)
- OPTIONS: Fix sliders not sliding correctly (by @nickofolas) #[3642](https://github.com/danielyxie/bitburner/pull/3642)
- REFACTOR: augmentation cost, rep cost and level to be calculated in place (by @phyzical) #[3544](https://github.com/danielyxie/bitburner/pull/3544)
- REFACTOR: augmentation isSpecial adjustments (by @phyzical) #[3564](https://github.com/danielyxie/bitburner/pull/3564)
- Reran npm format and lint to fix formatting (by @Undeemiss) #[3434](https://github.com/danielyxie/bitburner/pull/3434)
- Revert "MISC: fix typing conflict between jest and cypress" (by @hydroflame) #[3608](https://github.com/danielyxie/bitburner/pull/3608)
- Revert "MISC: HammingCodingContracts need rework" (by @hydroflame) #[3500](https://github.com/danielyxie/bitburner/pull/3500)
- revert theme (by @hydroflame) #[3451](https://github.com/danielyxie/bitburner/pull/3451)
- Singularity: Fix #3489 Disable checkTixApiAccess for purchase4SMarketData (by @DavidGrinberg) #[3490](https://github.com/danielyxie/bitburner/pull/3490)
- SLEEVES: Fix issues with Sleeve UI crashing when Sleeve task faction becomes gang faction (by @nickofolas) #[3557](https://github.com/danielyxie/bitburner/pull/3557)
- STANEK: Fix #3196 Charging booster fragments throws an error (by @Undeemiss) #[3637](https://github.com/danielyxie/bitburner/pull/3637)
- STANEK: FIX #3277 Can no longer overlap rotated fragments (by @Undeemiss) #[3460](https://github.com/danielyxie/bitburner/pull/3460)
- STANEK: FIX #3282 Added NS function stanek.acceptGift (by @Undeemiss) #[3513](https://github.com/danielyxie/bitburner/pull/3513)
- STANEK: Properly reapply entropy in Stanek's Gift (by @nickofolas) #[3673](https://github.com/danielyxie/bitburner/pull/3673)
- STANEK: Stanek NS functions correctly throw errors when stanek not installed (by @Undeemiss) #[3660](https://github.com/danielyxie/bitburner/pull/3660)
- Started collecting lore so that additions to it are simpler (by @Undeemiss) #[3465](https://github.com/danielyxie/bitburner/pull/3465)
- TERMINAL: FIX #3492 Allow cd .. even when destination directory is empty (by @Snarling) #[3525](https://github.com/danielyxie/bitburner/pull/3525)
- TERMINAL: FIX #3651 Make directory name regex more flexible (by @Dane-Horn) #[3653](https://github.com/danielyxie/bitburner/pull/3653)
- TOOLING: Add GitHub action to validate PR titles (by @MartinFournier) #[3471](https://github.com/danielyxie/bitburner/pull/3471)
- UI FIX #3485 - Allow bulk purchasing when smart supply is enabled (by @phyzical) #[3486](https://github.com/danielyxie/bitburner/pull/3486)
- UI: Change text color of Augmentations page backup button (by @nickofolas) #[3511](https://github.com/danielyxie/bitburner/pull/3511)
- UI: FIX #1754 Stanek effect summary & slight tweak. (by @borisflagell) #[3622](https://github.com/danielyxie/bitburner/pull/3622)
- UI: FIX #2228,#2958 Fix tab highlights and highlight files not on home. (by @phyzical) #[2989](https://github.com/danielyxie/bitburner/pull/2989)
- UI: FIX #2256 Hacknet server's upgrade tooltip were not handling RAM… (by @borisflagell) #[3532](https://github.com/danielyxie/bitburner/pull/3532)
- UI: FIX #2741 Allow using modifier keys inside the typing infiltration (by @Dane-Horn) #[3634](https://github.com/danielyxie/bitburner/pull/3634)
- UI: FIX #2829 Remove defeated NPC gangs from territory page (by @Dane-Horn) #[3633](https://github.com/danielyxie/bitburner/pull/3633)
- UI: FIX #3313 Streamline the GraftingRoot page by making it rerender. (by @borisflagell) #[3558](https://github.com/danielyxie/bitburner/pull/3558)
- UI: FIX #3341 Enable touch-clicks in react-draggable (by @Snarling) #[3488](https://github.com/danielyxie/bitburner/pull/3488)
- UI: FIX #3415 Tweak Manage Gang button visibility (by @borisflagell) #[3528](https://github.com/danielyxie/bitburner/pull/3528)
- UI: FIX #3457 autocomplete suggestions no longer require hovering terminal input (by @Snarling) #[3493](https://github.com/danielyxie/bitburner/pull/3493)
- UI: FIX #3473 'mv' now says destination script is running instead of returning an error (by @Hoekstraa) #[3474](https://github.com/danielyxie/bitburner/pull/3474)
- UI: FIX #3522 realigned autocomplete popup (by @Snarling) #[3524](https://github.com/danielyxie/bitburner/pull/3524)
- UI: FIX #3592 Sidebar and bash shortcuts now work on MacOS with US-like layouts (by @Hoekstraa) #[3605](https://github.com/danielyxie/bitburner/pull/3605)
- UI: Fix Agility BitNode multiplier not appearing in UI (by @nickofolas) #[3662](https://github.com/danielyxie/bitburner/pull/3662)
- UI: Fix exclusive augs not always showing as purchasable through gangs when they should (by @nickofolas) #[3676](https://github.com/danielyxie/bitburner/pull/3676)
- UI: Fix the achievement covenant icon was not shown (by @Risenafis) #[3510](https://github.com/danielyxie/bitburner/pull/3510)
- UI: Fix z-index of modals overriding everything (by @nickofolas) #[3620](https://github.com/danielyxie/bitburner/pull/3620)
- UI: lightweight description update on "increase maximum money" hash spending option. (by @borisflagell) #[3547](https://github.com/danielyxie/bitburner/pull/3547)
- UI: Minor improvements to log boxes (by @nickofolas) #[3641](https://github.com/danielyxie/bitburner/pull/3641)
- UI: Overhaul GameOptions UI (by @nickofolas) #[3505](https://github.com/danielyxie/bitburner/pull/3505)
- UI: Positioning improved for tail titlebar buttons, and tail window has minimum size constraints. (by @Snarling) #[3548](https://github.com/danielyxie/bitburner/pull/3548)
- UI: Redesign purchasable Augmentations (by @nickofolas) #[3545](https://github.com/danielyxie/bitburner/pull/3545)
- UI: Refactor and redesign WorkInProgress interface (by @nickofolas) #[3611](https://github.com/danielyxie/bitburner/pull/3611)
- UI: Refactors, redesigns, and new section to stats page (by @nickofolas) #[3626](https://github.com/danielyxie/bitburner/pull/3626)
- UI: Sort and color Graft Augmentation list (by @jaype87) #[3616](https://github.com/danielyxie/bitburner/pull/3616)
- UI: Update Factions list interface (by @nickofolas) #[3675](https://github.com/danielyxie/bitburner/pull/3675)
- WORK: FIX #3435 Quitting the active job now sets first remaining job as active (by @Snarling) #[3507](https://github.com/danielyxie/bitburner/pull/3507)
- WORK: Refactor work types to use 'enum's instead of constants (by @nickofolas) #[3612](https://github.com/danielyxie/bitburner/pull/3612)

#### Other Changes

- increase donation counter (by @hydroflame) - [8456410](https://github.com/danielyxie/bitburner/commit/84564100e90c46ae4b816853c2cdea0bc309af4d)
- allbuild commit 7f9e3775 (by @hydroflame) - [791c19c](https://github.com/danielyxie/bitburner/commit/791c19c4fe447c9231bfb423b9fc48114e783b43)
- allbuild commit bcbda22a (by @hydroflame) - [032c440](https://github.com/danielyxie/bitburner/commit/032c440eaeb069eecd720ec2f8e069f705a0c1b4)
- fix documentation for getDarkwebPrograms (by @hydroflame) - [4056956](https://github.com/danielyxie/bitburner/commit/4056956c2ada37946333bdad44cb0b6eb3909bf8)
- support ASNI (by @hydroflame) - [36c7ef1](https://github.com/danielyxie/bitburner/commit/36c7ef1ad7ea8bb69fca23bce5883a3c2e23f1e0)
- allbuild commit 22b6d0d5 (by @hydroflame) - [b46718d](https://github.com/danielyxie/bitburner/commit/b46718d188880ecf716ae045861d81d61e00af4b)
- allbuild commit 36c7ef1a (by @hydroflame) - [d0ebf5e](https://github.com/danielyxie/bitburner/commit/d0ebf5e14e0498cb063fde35d63c9f59f2c01e35)
- Update documentation for employee (by @hydroflame) - [100e81c](https://github.com/danielyxie/bitburner/commit/100e81c8ab4a408f74cc9bd9ffe2b8bad3d03462)
- allbuild commit c799b291 (by @hydroflame) - [f5f5879](https://github.com/danielyxie/bitburner/commit/f5f5879fc380678d978e2b0a29ba7b6f0b4c9ec0)
- ideas (by @hydroflame) - [0121fee](https://github.com/danielyxie/bitburner/commit/0121fee6e4c690d01650d1e68a80ea363bb48bce)
- allbuild commit 0121fee6 (by @hydroflame) - [5c417e9](https://github.com/danielyxie/bitburner/commit/5c417e9b4df236df8bf3e2f8262b7bce87c934df)
- Update codebase for stanek (by @hydroflame) - [c2b4a5b](https://github.com/danielyxie/bitburner/commit/c2b4a5b52a2162d2e49c7317b0a60a349984eb47)
- fix lint (by @hydroflame) - [4cc518f](https://github.com/danielyxie/bitburner/commit/4cc518f37723aafb3168b64cd689408afdb74877)
- Fix (by @hydroflame) - [9af553f](https://github.com/danielyxie/bitburner/commit/9af553f63cb1380795550648b0134b608564fab8)
- Fix stanek leaking classes (by @hydroflame) - [fda3f02](https://github.com/danielyxie/bitburner/commit/fda3f02d73dba27034128c9be5e810a51e475e38)
- fix conflicts (by @hydroflame) - [ca1a2aa](https://github.com/danielyxie/bitburner/commit/ca1a2aad333fa838b6d0e57f89e1cedba086a4a0)
- Nerf noodle bar.

`,
};
