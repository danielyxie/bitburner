import { defaultMultipliers } from "./BitNode";

/**
 * Bitnode multipliers influence the difficulty of different aspects of the game.
 * Each Bitnode has a different theme/strategy to achieving the end goal, so these multipliers will can help drive the
 * player toward the intended strategy. Unless they really want to play the long, slow game of waiting...
 */
export interface IBitNodeMultipliers {
  /**
   * Influences how quickly the player's agility level (not exp) scales
   */
  AgilityLevelMultiplier: number;

  /**
   * Influences the base cost to purchase an augmentation.
   */
  AugmentationMoneyCost: number;

  /**
   * Influences the base rep the player must have with a faction to purchase an augmentation.
   */
  AugmentationRepCost: number;

  /**
   * Influences how quickly the player can gain rank within Bladeburner.
   */
  BladeburnerRank: number;

  /**
   * Influences the cost of skill levels from Bladeburner.
   */
  BladeburnerSkillCost: number;

  /**
   * Influences how quickly the player's charisma level (not exp) scales
   */
  CharismaLevelMultiplier: number;

  /**
   * Influences the experience gained for each ability when a player completes a class.
   */
  ClassGymExpGain: number;

  /**
   * Influences the amount of money gained from completing Coding Contracts
   **/
  CodingContractMoney: number;

  /**
   * Influences the experience gained for each ability when the player completes working their job.
   */
  CompanyWorkExpGain: number;

  /**
   * Influences how much money the player earns when completing working their job.
   */
  CompanyWorkMoney: number;

  /**
   * Influences the valuation of corporations created by the player.
   */
  CorporationValuation: number;

  /**
   * Influences the base experience gained for each ability when the player commits a crime.
   */
  CrimeExpGain: number;

  /**
   * Influences the base money gained when the player commits a crime.
   */
  CrimeMoney: number;

  /**
   * Influences how many Augmentations you need in order to get invited to the Daedalus faction
   */
  DaedalusAugsRequirement: number;

  /**
   * Influences how quickly the player's defense level (not exp) scales
   */
  DefenseLevelMultiplier: number;

  /**
   * Influences how quickly the player's dexterity level (not exp) scales
   */
  DexterityLevelMultiplier: number;

  /**
   * Influences how much rep the player gains in each faction simply by being a member.
   */
  FactionPassiveRepGain: number;

  /**
   * Influences the experience gained for each ability when the player completes work for a Faction.
   */
  FactionWorkExpGain: number;

  /**
   * Influences how much rep the player gains when performing work for a faction.
   */
  FactionWorkRepGain: number;

  /**
   * Influences how much it costs to unlock the stock market's 4S Market Data API
   */
  FourSigmaMarketDataApiCost: number;

  /**
   * Influences how much it costs to unlock the stock market's 4S Market Data (NOT API)
   */
  FourSigmaMarketDataCost: number;

  /**
   * Reduces gangs earning.
   */
  GangSoftcap: number;

  /**
   * Percentage of unique augs that the gang has.
   */
  GangUniqueAugs: number;

  /**
   * Influences the experienced gained when hacking a server.
   */
  HackExpGain: number;

  /**
   * Influences how quickly the player's hacking level (not experience) scales
   */
  HackingLevelMultiplier: number;

  /**
   * Influences how much money is produced by Hacknet Nodes.
   * Influeces the hash rate of Hacknet Servers (unlocked in BitNode-9)
   */
  HacknetNodeMoney: number;

  /**
   * Influences how much money it costs to upgrade your home computer's RAM
   */
  HomeComputerRamCost: number;

  /**
   * Influences how much money is gained when the player infiltrates a company.
   */
  InfiltrationMoney: number;

  /**
   * Influences how much rep the player can gain from factions when selling stolen documents and secrets
   */
  InfiltrationRep: number;

  /**
   * Influences how much money can be stolen from a server when the player performs a hack against it through
   * the Terminal.
   */
  ManualHackMoney: number;

  /**
   * Influence how much it costs to purchase a server
   */
  PurchasedServerCost: number;

  /**
   * Influence how much it costs to purchase a server
   */
  PurchasedServerSoftcap: number;

  /**
   * Influences the maximum number of purchased servers you can have
   */
  PurchasedServerLimit: number;

  /**
   * Influences the maximum allowed RAM for a purchased server
   */
  PurchasedServerMaxRam: number;
  /**
   * Influences the minimum favor the player must have with a faction before they can donate to gain rep.
   */
  RepToDonateToFaction: number;

  /**
   * Influences how much money can be stolen from a server when a script performs a hack against it.
   */
  ScriptHackMoney: number;

  /**
   * The amount of money actually gained when script hack a server. This is
   * different than the above because you can reduce the amount of money but
   * not gain that same amount.
   */
  ScriptHackMoneyGain: number;

  /**
   * Influences the growth percentage per cycle against a server.
   */
  ServerGrowthRate: number;

  /**
   * Influences the maxmimum money that a server can grow to.
   */
  ServerMaxMoney: number;

  /**
   * Influences the initial money that a server starts with.
   */
  ServerStartingMoney: number;

  /**
   * Influences the initial security level (hackDifficulty) of a server.
   */
  ServerStartingSecurity: number;

  /**
   * Influences the weaken amount per invocation against a server.
   */
  ServerWeakenRate: number;

  /**
   * Influences how quickly the player's strength level (not exp) scales
   */
  StrengthLevelMultiplier: number;

  /**
   * Influences the power of the gift.
   */
  StaneksGiftPowerMultiplier: number;

  /**
   * Influences the size of the gift.
   */
  StaneksGiftExtraSize: number;

  /**
   * Influences the hacking skill required to backdoor the world daemon.
   */
  WorldDaemonDifficulty: number;

  /**
   * Influences corporation dividends.
   */
  CorporationSoftCap: number;

  // Index signature
  [key: string]: number;
}

/**
 * The multipliers that are influenced by current Bitnode progression.
 */
// tslint:disable-next-line:variable-name
export const BitNodeMultipliers = defaultMultipliers;
