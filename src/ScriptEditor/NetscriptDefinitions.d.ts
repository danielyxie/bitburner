/**
 * Data representing the internal values of a crime.
 * @public
 */
export interface CrimeStats {
  /** Number representing the difficulty of the crime. Used for success chance calculations */
  difficulty: number;
  /** Amount of karma lost for successfully committing this crime */
  karma: number;
  /** How many people die as a result of this crime */
  kills: number;
  /** How much money is given */
  money: number;
  /** Name of crime */
  name: number;
  /** Milliseconds it takes to attempt the crime */
  time: number;
  /** Description of the crime activity */
  type: string;
  /** hacking level impact on success change of the crime */
  hacking_success_weight: number;
  /** strength level impact on success change of the crime */
  strength_success_weight: number;
  /** defense level impact on success change of the crime */
  defense_success_weight: number;
  /** dexterity level impact on success change of the crime */
  dexterity_success_weight: number;
  /** agility level impact on success change of the crime */
  agility_success_weight: number;
  /** charisma level impact on success change of the crime */
  charisma_success_weight: number;
  /** hacking exp gained from crime */
  hacking_exp: number;
  /** strength exp gained from crime */
  strength_exp: number;
  /** defense exp gained from crime */
  defense_exp: number;
  /** dexterity exp gained from crime */
  dexterity_exp: number;
  /** agility exp gained from crime */
  agility_exp: number;
  /** charisma exp gained from crime */
  charisma_exp: number;
  /** intelligence exp gained from crime */
  intelligence_exp: number;
}

/**
 * Data representing the internal values of an Augmentation.
 * @public
 */
export interface AugmentationStats {
  /** Multipler to hacking skill */
  hacking_mult?: number;
  /** Multipler to strength skill */
  strength_mult?: number;
  /** Multipler to defense skill */
  defense_mult?: number;
  /** Multipler to dexterity skill */
  dexterity_mult?: number;
  /** Multipler to agility skill */
  agility_mult?: number;
  /** Multipler to charisma skill */
  charisma_mult?: number;
  /** Multipler to hacking experience gain rate */
  hacking_exp_mult?: number;
  /** Multipler to strength experience gain rate */
  strength_exp_mult?: number;
  /** Multipler to defense experience gain rate */
  defense_exp_mult?: number;
  /** Multipler to dexterity experience gain rate */
  dexterity_exp_mult?: number;
  /** Multipler to agility experience gain rate */
  agility_exp_mult?: number;
  /** Multipler to charisma experience gain rate */
  charisma_exp_mult?: number;
  /** Multipler to chance of successfully performing a hack */
  hacking_chance_mult?: number;
  /** Multipler to hacking speed */
  hacking_speed_mult?: number;
  /** Multipler to amount of money the player gains from hacking */
  hacking_money_mult?: number;
  /** Multipler to amount of money injected into servers using grow */
  hacking_grow_mult?: number;
  /** Multipler to amount of reputation gained when working */
  company_rep_mult?: number;
  /** Multipler to amount of reputation gained when working */
  faction_rep_mult?: number;
  /** Multipler to amount of money gained from crimes */
  crime_money_mult?: number;
  /** Multipler to crime success rate */
  crime_success_mult?: number;
  /** Multipler to amount of money gained from working */
  work_money_mult?: number;
  /** Multipler to amount of money produced by Hacknet Nodes */
  hacknet_node_money_mult?: number;
  /** Multipler to cost of purchasing a Hacknet Node */
  hacknet_node_purchase_cost_mult?: number;
  /** Multipler to cost of ram for a Hacknet Node */
  hacknet_node_ram_cost_mult?: number;
  /** Multipler to cost of core for a Hacknet Node */
  hacknet_node_core_cost_mult?: number;
  /** Multipler to cost of leveling up a Hacknet Node */
  hacknet_node_level_cost_mult?: number;
  /** Multipler to Bladeburner max stamina */
  bladeburner_max_stamina_mult?: number;
  /** Multipler to Bladeburner stamina gain rate */
  bladeburner_stamina_gain_mult?: number;
  /** Multipler to effectiveness in Bladeburner Field Analysis */
  bladeburner_analysis_mult?: number;
  /** Multipler to success chance in Bladeburner contracts/operations */
  bladeburner_success_chance_mult?: number;
}

/**
 * Options to affect the behavior of {@link NS.hack | hack}, {@link NS.grow | grow}, and {@link NS.weaken | weaken}.
 * @public
 */
export interface BasicHGWOptions {
  /** Number of threads to use for this function. Must be less than or equal to the number of threads the script is running with. */
  threads: number;
  /** Set to true this action will affect the stock market. */
  stock?: boolean;
}

/**
 * Options to affect the behavior of {@link CodingContract} attempt.
 * @public
 */
export interface CodingAttemptOptions {
  /** If truthy, then the function will return a string that states the contract’s reward when it is successfully solved. */
  returnReward: boolean;
}

/**
 * Return value of {@link Sleeve.getSleevePurchasableAugs | getSleevePurchasableAugs}
 * @public
 */
export interface AugmentPair {
  /** augmentation name */
  name: string;
  /** augmentation cost */
  cost: number;
}

/**
 * Value in map of {@link StockOrder}
 * @public
 */
export interface StockOrderObject {
  /** Number of shares */
  shares: number;
  /** Price per share */
  price: number;
  /** Order type */
  type: string;
  /** Order position */
  position: string;
}

/**
 * Return value of {@link TIX.getOrders | getOrders}
 * @public
 */
export interface StockOrder {
  /** Stock Symbol */
  [key: string]: StockOrderObject[];
}

/**
 * A single process on a server.
 * @public
 */
export interface ProcessInfo {
  /** Script name. */
  filename: string;
  /** Number of threads script is running with */
  threads: number;
  /** Script's arguments */
  args: string[];
}

/**
 * Hack related multipliers.
 * @public
 */
export interface HackingMultipliers {
  /** Player's hacking chance multiplier. */
  chance: number;
  /** Player's hacking speed multiplier. */
  speed: number;
  /** Player's hacking money stolen multiplier. */
  money: number;
  /** Player's hacking growth multiplier */
  growth: number;
}

/**
 * Hacknet related multipliers.
 * @public
 */
export interface HacknetMultipliers {
  /** Player's hacknet production multiplier */
  production: number;
  /** Player's hacknet purchase cost multiplier */
  purchaseCost: number;
  /** Player's hacknet ram cost multiplier */
  ramCost: number;
  /** Player's hacknet core cost multiplier */
  coreCost: number;
  /** Player's hacknet level cost multiplier */
  levelCost: number;
}

/**
 * A single server.
 * @public
 */
export interface Server {
  /**
   * How many CPU cores this server has. Maximum of 8.
   * Affects magnitude of grow and weaken.
   */
  cpuCores: number;

  /** Flag indicating whether the FTP port is open */
  ftpPortOpen: boolean;

  /** Flag indicating whether player has admin/root access to this server */
  hasAdminRights: boolean;

  /** Hostname. Must be unique */
  hostname: string;

  /** Flag indicating whether HTTP Port is open */
  httpPortOpen: boolean;

  /** IP Address. Must be unique */
  ip: string;

  /** Flag indicating whether player is curently connected to this server */
  isConnectedTo: boolean;

  /** RAM (GB) available on this server */
  maxRam: number;

  /**
   * Name of company/faction/etc. that this server belongs to.
   * Optional, not applicable to all Servers
   */
  organizationName: string;

  /** RAM (GB) used. i.e. unavailable RAM */
  ramUsed: number;

  /** Flag indicating whether SMTP Port is open */
  smtpPortOpen: boolean;

  /** Flag indicating whether SQL Port is open */
  sqlPortOpen: boolean;

  /** Flag indicating whether the SSH Port is open */
  sshPortOpen: boolean;
}

/**
 * All multipliers affecting the difficulty of the current challenge.
 * @public
 */
export interface BitNodeMultipliers {
  /** Influences how quickly the player's agility level (not exp) scales */
  AgilityLevelMultiplier: number;
  /** Influences the base cost to purchase an augmentation. */
  AugmentationMoneyCost: number;
  /** Influences the base rep the player must have with a faction to purchase an augmentation. */
  AugmentationRepCost: number;
  /** Influences how quickly the player can gain rank within Bladeburner. */
  BladeburnerRank: number;
  /** Influences the cost of skill levels from Bladeburner. */
  BladeburnerSkillCost: number;
  /** Influences how quickly the player's charisma level (not exp) scales */
  CharismaLevelMultiplier: number;
  /** Influences the experience gained for each ability when a player completes a class. */
  ClassGymExpGain: number;
  /** Influences the amount of money gained from completing Coding Contracts */
  CodingContractMoney: number;
  /** Influences the experience gained for each ability when the player completes working their job. */
  CompanyWorkExpGain: number;
  /** Influences how much money the player earns when completing working their job. */
  CompanyWorkMoney: number;
  /** Influences the valuation of corporations created by the player. */
  CorporationValuation: number;
  /** Influences the base experience gained for each ability when the player commits a crime. */
  CrimeExpGain: number;
  /** Influences the base money gained when the player commits a crime. */
  CrimeMoney: number;
  /** Influences how many Augmentations you need in order to get invited to the Daedalus faction */
  DaedalusAugsRequirement: number;
  /** Influences how quickly the player's defense level (not exp) scales */
  DefenseLevelMultiplier: number;
  /** Influences how quickly the player's dexterity level (not exp) scales */
  DexterityLevelMultiplier: number;
  /** Influences how much rep the player gains in each faction simply by being a member. */
  FactionPassiveRepGain: number;
  /** Influences the experience gained for each ability when the player completes work for a Faction. */
  FactionWorkExpGain: number;
  /** Influences how much rep the player gains when performing work for a faction. */
  FactionWorkRepGain: number;
  /** Influences how much it costs to unlock the stock market's 4S Market Data API */
  FourSigmaMarketDataApiCost: number;
  /** Influences how much it costs to unlock the stock market's 4S Market Data (NOT API) */
  FourSigmaMarketDataCost: number;
  /** Influences the experienced gained when hacking a server. */
  HackExpGain: number;
  /** Influences how quickly the player's hacking level (not experience) scales */
  HackingLevelMultiplier: number;
  /** Influences how much money is produced by Hacknet Nodes and the hash rate of Hacknet Servers (unlocked in BitNode-9) */
  HacknetNodeMoney: number;
  /** Influences how much money it costs to upgrade your home computer's RAM */
  HomeComputerRamCost: number;
  /** Influences how much money is gained when the player infiltrates a company. */
  InfiltrationMoney: number;
  /** Influences how much rep the player can gain from factions when selling stolen documents and secrets */
  InfiltrationRep: number;
  /** Influences how much money can be stolen from a server when the player performs a hack against it through the Terminal. */
  ManualHackMoney: number;
  /** Influence how much it costs to purchase a server */
  PurchasedServerCost: number;
  /** Influences the maximum number of purchased servers you can have */
  PurchasedServerLimit: number;
  /** Influences the maximum allowed RAM for a purchased server */
  PurchasedServerMaxRam: number;
  /** Influences the minimum favor the player must have with a faction before they can donate to gain rep. */
  RepToDonateToFaction: number;
  /** Influences how much money can be stolen from a server when a script performs a hack against it. */
  ScriptHackMoney: number;
  /** Influences the growth percentage per cycle against a server. */
  ServerGrowthRate: number;
  /** Influences the maxmimum money that a server can grow to. */
  ServerMaxMoney: number;
  /** Influences the initial money that a server starts with. */
  ServerStartingMoney: number;
  /** Influences the initial security level (hackDifficulty) of a server. */
  ServerStartingSecurity: number;
  /** Influences the weaken amount per invocation against a server. */
  ServerWeakenRate: number;
  /** Influences how quickly the player's strength level (not exp) scales */
  StrengthLevelMultiplier: number;
}

/**
 * Object representing all the values related to a hacknet node.
 * @public
 */
export interface NodeStats {
  /** Node's name */
  name: string;
  /** Node's level */
  level: number;
  /** Node's RAM */
  ram: number;
  /** Node's number of cores */
  cores: number;
  /** Cache level. Only applicable for Hacknet Servers */
  cache: number;
  /** Hash Capacity provided by this Node. Only applicable for Hacknet Servers */
  hashCapacity: number;
  /** Node's production per second */
  production: number;
  /** Number of seconds since Node has been purchased */
  timeOnline: number;
  /** Total number of money Node has produced */
  totalProduction: number;
}

/**
 * Short summary of the players skills.
 * @public
 */
export interface PlayerSkills {
  /** Hacking level */
  hacking: number;
  /** Strength level */
  strength: number;
  /** Defense level */
  defense: number;
  /** Dexterity level */
  dexterity: number;
  /** Agility level */
  agility: number;
  /** Chraisma level */
  charisma: number;
  /** Intelligence level */
  intelligence: number;
}

/**
 * @public
 */
export interface CharacterMult {
  /** Agility stat */
  agility: number;
  /** Agility exp */
  agilityExp: number;
  /** Company reputation */
  companyRep: number;
  /** Money earned from crimes */
  crimeMoney: number;
  /** Crime success chance */
  crimeSuccess: number;
  /** Defense stat */
  defense: number;
  /** Defense exp */
  defenseExp: number;
  /** Dexterity stat */
  dexterity: number;
  /** Dexterity exp */
  dexterityExp: number;
  /** Faction reputation */
  factionRep: number;
  /** Hacking stat */
  hacking: number;
  /** Hacking exp */
  hackingExp: number;
  /** Strength stat */
  strength: number;
  /** Strength exp */
  strengthExp: number;
  /** Money earned from jobs */
  workMoney: number;
}

/**
 * @public
 */
export interface CharacterInfo {
  /** Current BitNode number */
  bitnode: number;
  /** Name of city you are currently in */
  city: string;
  /** Array of factions you are currently a member of */
  factions: string[];
  /** Current health points */
  hp: number;
  /** Array of all companies at which you have jobs */
  company: string[];
  /** Array of job positions for all companies you are employed at. Same order as 'jobs' */
  jobTitle: string[];
  /** Maximum health points */
  maxHp: number;
  /** Boolean indicating whether or not you have a tor router */
  tor: boolean;
  /** Object with many of the player's multipliers from Augmentations/Source Files */
  mult: CharacterMult;
  /** Timed worked in ms */
  timeWorked: number;
  /** Hacking experience earned so far from work */
  workHackExpGain: number;
  /** Str experience earned so far from work */
  workStrExpGain: number;
  /** Def experience earned so far from work */
  workDefExpGain: number;
  /** Dex experience earned so far from work */
  workDexExpGain: number;
  /** Agi experience earned so far from work */
  workAgiExpGain: number;
  /** Cha experience earned so far from work */
  workChaExpGain: number;
  /** Reputation earned so far from work, if applicable */
  workRepGain: number;
  /** Money earned so far from work, if applicable */
  workMoneyGain: number;
}

/**
 * @public
 */
export interface SleeveWorkGains {
  /** hacking exp gained from work */
  workHackExpGain: number;
  /** strength exp gained from work */
  workStrExpGain: number;
  /** defense exp gained from work, */
  workDefExpGain: number;
  /** dexterity exp gained from work */
  workDexExpGain: number;
  /** agility exp gained from work */
  workAgiExpGain: number;
  /** charisma exp gained from work */
  workChaExpGain: number;
  /** money gained from work */
  workMoneyGain: number;
}

/**
 * @public
 */
export interface SourceFileLvl {
  /** The number of the source file */
  n: number;
  /** The level of the source file */
  lvl: number;
}

/**
 * Bladeburner current action.
 * @public
 */
export interface BladeburnerCurAction {
  /** Type of Action */
  type: string;
  /** Name of Action */
  name: string;
}

/**
 * Gang general info.
 * @public
 */
export interface GangGenInfo {
  /** Name of faction that the gang belongs to ("Slum Snakes", etc.) */
  faction: string;
  /** Boolean indicating whether or not its a hacking gang */
  isHacking: boolean;
  /** Money earned per second */
  moneyGainRate: number;
  /** Gang's power for territory warfare */
  power: number;
  /** Gang's respect */
  respect: number;
  /** Respect earned per second */
  respectGainRate: number;
  /** Amount of territory held. Returned in decimal form, not percentage */
  territory: number;
  /** Clash chance. Returned in decimal form, not percentage */
  territoryClashChance: number;
  /** Gang's wanted level */
  wantedLevel: number;
  /** Wanted level gained/lost per second (negative for losses) */
  wantedLevelGainRate: number;
}

/**
 * @public
 */
export interface GangOtherInfoObject {
  /** Gang power */
  power: number;
  /** Gang territory, in decimal form */
  territory: number;
}

/**
 * @public
 */
export interface GangOtherInfo {
  /** Stock Symbol */
  [key: string]: GangOtherInfoObject[];
}

/**
 * Object representing data representing a gang member task.
 * @public
 */
export interface GangTaskStats {
  /** Task name */
  name: string;
  /** Task Description */
  desc: string;
  /** Is a task of a hacking gang */
  isHacking: boolean;
  /** Is a task of a combat gang */
  isCombat: boolean;
  /** Base respect earned */
  baseRespect: number;
  /** Base wanted earned */
  baseWanted: number;
  /** Base money earned */
  baseMoney: number;
  /** Hacking skill impact on task scaling */
  hackWeight: number;
  /** Stength skill impact on task scaling */
  strWeight: number;
  /** Defense skill impact on task scaling */
  defWeight: number;
  /** Dexterity skill impact on task scaling */
  dexWeight: number;
  /** Agility skill impact on task scaling */
  agiWeight: number;
  /** Charisma skill impact on task scaling */
  chaWeight: number;
  /** Number representing the difficulty of the task */
  difficulty: number;
  /** Territory impact on task scaling */
  territory: GangTerritory;
}

/**
 * Object representing data representing a gang member equipment.
 * @public
 */
export interface EquipmentStats {
  /** Strength multiplier */
  str: number;
  /** Defense multiplier */
  def: number;
  /** Dexterity multiplier */
  dex: number;
  /** Agility multiplier */
  agi: number;
  /** Charisma multiplier */
  cha: number;
  /** Hacking multiplier */
  hack: number;
}

/**
 * @public
 */
export interface GangTerritory {
  /** Money gain impact on task scaling */
  money: number;
  /** Respect gain impact on task scaling */
  respect: number;
  /** Wanted gain impact on task scaling */
  wanted: number;
}

/**
 * @public
 */
export interface GangMemberInfo {
  /** Agility stat */
  agility: number;
  /** Agility multiplier from equipment.*/
  agilityEquipMult: number;
  /** Agility multiplier from ascension.*/
  agilityAscensionMult: number;
  /** Array of names of all owned Augmentations */
  augmentations: string[];
  /** Charisma stat */
  charisma: number;
  /** Charisma multiplier from equipment.*/
  charismaEquipMult: number;
  /** Charisma multiplier from ascension.*/
  charismaAscensionMult: number;
  /** Defense stat */
  defense: number;
  /** Defense multiplier from equipment.*/
  defenseEquipMult: number;
  /** Defense multiplier from ascension.*/
  defenseAscensionMult: number;
  /** Dexterity stat */
  dexterity: number;
  /** Dexterity multiplier from equipment.*/
  dexterityEquipMult: number;
  /** Dexterity multiplier from ascension.*/
  dexterityAscensionMult: number;
  /** Array of names of all owned Non-Augmentation Equipment */
  equipment: string[];
  /** Hacking stat */
  hacking: number;
  /** Hacking multiplier from equipment.*/
  hackingEquipMult: number;
  /** Hacking multiplier from ascension.*/
  hackingAscensionMult: number;
  /** Strength stat */
  strength: number;
  /** Strength multiplier from equipment.*/
  strengthEquipMult: number;
  /** Strength multiplier from ascension.*/
  strengthAscensionMult: number;
  /** Name of currently assigned task */
  task: string;
}

/**
 * @public
 */
export interface GangMemberAscension {
  /** Amount of respect lost from ascending */
  respect: number;
  /** Hacking multiplier gained from ascending.*/
  hack: number;
  /** Strength multiplier gained from ascending.*/
  str: number;
  /** Defense multiplier gained from ascending.*/
  def: number;
  /** Dexterity multiplier gained from ascending.*/
  dex: number;
  /** Agility multiplier gained from ascending.*/
  agi: number;
  /** Charisma multiplier gained from ascending.*/
  cha: number;
}

/**
 * Object representing a sleeve stats.
 * @public
 */
export interface SleeveSkills {
  /** current shock of the sleeve [0-100] */
  shock: number;
  /** current sync of the sleeve [0-100] */
  sync: number;
  /** current hacking skill of the sleeve */
  hacking_skill: number;
  /** current strength of the sleeve */
  strength: number;
  /** current defense of the sleeve */
  defense: number;
  /** current dexterity of the sleeve */
  dexterity: number;
  /** current agility of the sleeve */
  agility: number;
  /** current charisma of the sleeve */
  charisma: number;
}

/**
 * Object representing sleeve information.
 * @public
 */
export interface SleeveInformation {
  /** location of the sleeve */
  city: string;
  /** current hp of the sleeve */
  hp: number;
  /** max hp of the sleeve */
  maxHp: number;
  /** jobs available to the sleeve */
  jobs: string[];
  /** job titles available to the sleeve */
  jobTitle: string[];
  /** does this sleeve have access to the tor router */
  tor: boolean;
  /** sleeve multipliers */
  mult: CharacterMult;
  /** time spent on the current task in milliseconds */
  timeWorked: number;
  /** earnings synchronized to other sleeves */
  earningsForSleeves: SleeveWorkGains;
  /** earnings synchronized to the player */
  earningsForPlayer: SleeveWorkGains;
  /** earnings for this sleeve */
  earningsForTask: SleeveWorkGains;
  /** faction or company reputation gained for the current task */
  workRepGain: number;
}

/**
 * Object representing a sleeve current task.
 * @public
 */
export interface SleeveTask {
  /** task type */
  task: string;
  /** crime currently attempting, if any */
  crime: string;
  /** location of the task, if any */
  location: string;
  /** stat being trained at the gym, if any */
  gymStatType: string;
  /** faction work type being performed, if any */
  factionWorkType: string;
}

/**
 * Stock market API
 * @public
 */
export interface TIX {
  /**
   * Returns an array of the symbols of the tradable stocks
   *
   * @remarks RAM cost: 2 GB
   * @returns Array of the symbols of the tradable stocks.
   */
  getSymbols(): string[];

  /**
   * Returns the price of a stock
   *
   * @remarks
   * RAM cost: 2 GB
   * The stock’s price is the average of its bid and ask price.
   *
   * @example
   * ```ts
   * getPrice("FISG");
   * ```
   * @param sym - Stock symbol.
   * @returns The price of a stock.
   */
  getPrice(sym: string): number;

  /**
   * Returns the ask price of that stock.
   * @remarks RAM cost: 2 GB
   *
   * @param sym - Stock symbol.
   * @returns The ask price of a stock.
   */
  getAskPrice(sym: string): number;

  /**
   * Returns the bid price of that stock.
   * @remarks RAM cost: 2 GB
   *
   * @param sym - Stock symbol.
   * @returns The bid price of a stock.
   */
  getBidPrice(sym: string): number;

  /**
   * Returns the player’s position in a stock.
   * @remarks
   * RAM cost: 2 GB
   * Returns an array of four elements that represents the player’s position in a stock.
   *
   * The first element is the returned array is the number of shares the player owns of
   * the stock in the Long position. The second element in the array is the average price
   * of the player’s shares in the Long position.
   *
   * The third element in the array is the number of shares the player owns of the stock
   * in the Short position. The fourth element in the array is the average price of the
   * player’s Short position.
   *
   * All elements in the returned array are numeric.
   *
   * @example
   * ```ts
   * pos = getPosition("ECP");
   * shares      = pos[0];
   * avgPx       = pos[1];
   * sharesShort = pos[2];
   * avgPxShort  = pos[3];
   * ```
   * @param sym - Stock symbol.
   * @returns Array of four elements that represents the player’s position in a stock.
   */
  getPosition(sym: string): [number, number, number, number];

  /**
   * Returns the maximum number of shares of a stock.
   * @remarks
   * RAM cost: 2 GB
   * This is the maximum amount of the stock that can be purchased
   * in both the Long and Short positions combined.
   *
   * @param sym - Stock symbol.
   * @returns Maximum number of shares that the stock has.
   */
  getMaxShares(sym: string): number;

  /**
   * Calculates cost of buying stocks.
   * @remarks
   * RAM cost: 2 GB
   * Calculates and returns how much it would cost to buy a given number of shares of a stock.
   * This takes into account spread, large transactions influencing the price of the stock and commission fees.
   *
   * @param sym - Stock symbol.
   * @param shares - Number of shares to purchase.
   * @param posType - Specifies whether the order is a “Long” or “Short” position.
   * @returns Cost to buy a given number of shares of a stock.
   */
  getPurchaseCost(sym: string, shares: number, posType: string): number;

  /**
   * Calculate profit of setting stocks.
   * @remarks
   * RAM cost: 2 GB
   * Calculates and returns how much you would gain from selling a given number of shares of a stock.
   * This takes into account spread, large transactions influencing the price of the stock and commission fees.
   *
   * @param sym - Stock symbol.
   * @param shares - Number of shares to sell.
   * @param posType - Specifies whether the order is a “Long” or “Short” position.
   * @returns Gain from selling a given number of shares of a stock.
   */
  getSaleGain(sym: string, shares: number, posType: string): number;

  /**
   * Buy stocks.
   * @remarks
   * RAM cost: 2.5 GB
   * Attempts to purchase shares of a stock using a Market Order.
   *
   * If the player does not have enough money to purchase the specified number of shares,
   * then no shares will be purchased. Remember that every transaction on the stock exchange
   * costs a certain commission fee.
   *
   * If this function successfully purchases the shares, it will return the stock price at which
   * each share was purchased. Otherwise, it will return 0.
   *
   * @param sym - Stock symbol.
   * @param shares - Number of shares to purchased. Must be positive. Will be rounded to nearest integer.
   * @returns The stock price at which each share was purchased, otherwise 0 if the shares weren't purchased.
   */
  buy(sym: string, shares: number): number;

  /**
   * Sell stocks.
   * @remarks
   * RAM cost: 2.5 GB
   * Attempts to sell shares of a stock using a Market Order.
   *
   * If the specified number of shares in the function exceeds the amount that the player
   * actually owns, then this function will sell all owned shares. Remember that every
   * transaction on the stock exchange costs a certain commission fee.
   *
   * The net profit made from selling stocks with this function is reflected in the script’s
   * statistics. This net profit is calculated as:
   *
   *    shares * (sell_price - average_price_of_purchased_shares)
   *
   * If the sale is successful, this function will return the stock price at
   * which each share was sold. Otherwise, it will return 0.
   *
   * @param sym - Stock symbol.
   * @param shares - Number of shares to sell. Must be positive. Will be rounded to nearest integer.
   * @returns The stock price at which each share was sold, otherwise 0 if the shares weren't sold.
   */
  sell(sym: string, shares: number): number;

  /**
   * Short stocks.
   * @remarks
   * RAM cost: 2.5 GB
   * Attempts to purchase a short position of a stock using a Market Order.
   *
   * The ability to short a stock is **not** immediately available to the player and
   * must be unlocked later on in the game.
   *
   * If the player does not have enough money to purchase the specified number of shares,
   * then no shares will be purchased. Remember that every transaction on the stock exchange
   * costs a certain commission fee.
   *
   * If the purchase is successful, this function will return the stock price at which each
   * share was purchased. Otherwise, it will return 0.
   *
   * @param sym - Stock symbol.
   * @param shares - Number of shares to short. Must be positive. Will be rounded to nearest integer.
   * @returns The stock price at which each share was purchased, otherwise 0 if the shares weren't purchased.
   */
  short(sym: string, shares: number): number;

  /**
   * Sell short stock.
   * @remarks
   * RAM cost: 2.5 GB
   * Attempts to sell a short position of a stock using a Market Order.
   *
   * The ability to short a stock is **not** immediately available to the player and
   * must be unlocked later on in the game.
   *
   * If the specified number of shares exceeds the amount that the player actually owns,
   * then this function will sell all owned shares. Remember that every transaction on
   * the stock exchange costs a certain commission fee.
   *
   * If the sale is successful, this function will return the stock price at which each
   * share was sold. Otherwise it will return 0.
   *
   * @param sym - Stock symbol.
   * @param shares - Number of shares to sell. Must be positive. Will be rounded to nearest integer.
   * @returns The stock price at which each share was sold, otherwise 0 if the shares weren't sold.
   */
  sellShort(sym: string, shares: number): number;

  /**
   * Place order for stocks.
   * @remarks
   * RAM cost: 2.5 GB
   * Places an order on the stock market. This function only works for Limit and Stop Orders.
   *
   * The ability to place limit and stop orders is **not** immediately available to the player and
   * must be unlocked later on in the game.
   *
   * Returns true if the order is successfully placed, and false otherwise.
   *
   * @param sym - Stock symbol.
   * @param shares - Number of shares for order. Must be positive. Will be rounded to nearest integer.
   * @param price - Execution price for the order.
   * @param type - Type of order.
   * @param pos - Specifies whether the order is a “Long” or “Short” position.
   * @returns True if the order is successfully placed, and false otherwise.
   */
  placeOrder(sym: string, shares: number, price: number, type: string, pos: string): boolean;

  /**
   * Cancel order for stocks.
   * @remarks
   * RAM cost: 2.5 GB
   * Cancels an oustanding Limit or Stop order on the stock market.
   *
   * The ability to use limit and stop orders is **not** immediately available to the player and
   * must be unlocked later on in the game.
   *
   * @param sym - Stock symbol.
   * @param shares - Number of shares for order. Must be positive. Will be rounded to nearest integer.
   * @param price - Execution price for the order.
   * @param type - Type of order.
   * @param pos - Specifies whether the order is a “Long” or “Short” position.
   */
  cancelOrder(sym: string, shares: number, price: number, type: string, pos: string): void;

  /**
   * Returns your order book for the stock market.
   * @remarks
   * RAM cost: 2.5 GB
   * This is an object containing information for all the Limit and Stop Orders you have in the stock market.
   * The object has the following structure:
   *
   * ```ts
   * {
   *  string1: [ // Array of orders for this stock
   *      {
   *          shares: Order quantity
   *          price: Order price
   *          type: Order type
   *          position: Either "L" or "S" for Long or Short position
   *      },
   *      {
   *          ...
   *      },
   *      ...
   *  ],
   *  string2: [ // Array of orders for this stock
   *      ...
   *  ],
   *  ...
   * }
   * ```
   * The “Order type” property can have one of the following four values: "Limit Buy Order", "Limit Sell Order", "Stop Buy Order", "Stop Sell Order".
   * Note that the order book will only contain information for stocks that you actually have orders in.
   *
   * @example
   * ```ts
   * "If you do not have orders in Nova Medical (NVMD), then the returned object will not have a “NVMD” property."
   * {
   *  ECP: [
   *      {
   *          shares: 5,
   *          price: 100,000
   *          type: "Stop Buy Order",
   *          position: "S",
   *      },
   *      {
   *          shares: 25,
   *          price: 125,000
   *          type: "Limit Sell Order",
   *          position: "L",
   *      },
   *  ],
   *  SYSC: [
   *      {
   *          shares: 100,
   *          price: 10,000
   *          type: "Limit Buy Order",
   *          position: "L",
   *      },
   *  ],
   * }
   * ```
   * @returns Object containing information for all the Limit and Stop Orders you have in the stock market.
   */
  getOrders(): StockOrder;

  /**
   * Returns the volatility of the specified stock.
   * @remarks
   * RAM cost: 2.5 GB
   * Volatility represents the maximum percentage by which a stock’s price can change every tick.
   * The volatility is returned as a decimal value, NOT a percentage
   * (e.g. if a stock has a volatility of 3%, then this function will return 0.03, NOT 3).
   *
   * In order to use this function, you must first purchase access to the Four Sigma (4S) Market Data TIX API.
   *
   * @param sym - Stock symbol.
   * @returns Volatility of the specified stock.
   */
  getVolatility(sym: string): number;

  /**
   * Returns the probability that the specified stock’s price will increase (as opposed to decrease) during the next tick.
   * @remarks
   * RAM cost: 2.5 GB
   * The probability is returned as a decimal value, NOT a percentage
   * (e.g. if a stock has a 60% chance of increasing, then this function will return 0.6, NOT 60).
   *
   * In other words, if this function returned 0.30 for a stock, then this means that the stock’s price has a
   * 30% chance of increasing and a 70% chance of decreasing during the next tick.
   *
   * In order to use this function, you must first purchase access to the Four Sigma (4S) Market Data TIX API.
   *
   * @param sym - Stock symbol.
   * @returns Probability that the specified stock’s price will increase (as opposed to decrease) during the next tick.
   */
  getForecast(sym: string): number;

  /**
   * Purchase 4S Market Data Access.
   * @remarks RAM cost: 2.5 GB
   * @returns True if you successfully purchased it or if you already have access, false otherwise.
   */
  purchase4SMarketData(): boolean;

  /**
   * Purchase 4S Market Data TIX API Access.
   * @remarks RAM cost: 2.5 GB
   * @returns True if you successfully purchased it or if you already have access, false otherwise.
   */
  purchase4SMarketDataTixApi(): boolean;
}

/**
 * Singularity API
 * @remarks
 * This API requires Source-File 4 level 1 / 2 / 3 to use.
 * @public
 */
export interface Singularity {
  /**
   * Take university class.
   *
   * @remarks
   * RAM cost: 2 GB
   *
   * Singularity - Level 1
   *
   * This function will automatically set you to start taking a course at a university.
   * If you are already in the middle of some “working” action (such as working at a
   * company, for a faction, or on a program), then running this function will automatically
   * cancel that action and give you your earnings.
   *
   * The cost and experience gains for all of these universities and classes are the same as
   * if you were to manually visit and take these classes.
   *
   * @param universityName - Name of university. You must be in the correct city for whatever university you specify.
   * @param courseName - Name of course.
   * @returns True if actions is successfully started, false otherwise.
   */
  universityCourse(universityName: string, courseName: string): boolean;

  /**
   * Workout at the gym.
   * 
   * @remarks
   * RAM cost: 2 GB
   * 
   * Singularity - Level 1

   * This function will automatically set you to start working out at a gym to train
   * a particular stat. If you are already in the middle of some “working” action
   * (such as working at a company, for a faction, or on a program), then running
   * this function will automatically cancel that action and give you your earnings.
   *
   * The cost and experience gains for all of these gyms are the same as if you were
   * to manually visit these gyms and train
   *
   * @param gymName - Name of gym. You must be in the correct city for whatever gym you specify.
   * @param stat - The stat you want to train.
   * @returns True if actions is successfully started, false otherwise.
   */
  gymWorkout(gymName: string, stat: string): boolean;

  /**
   * Travel to another city.
   * @remarks
   * RAM cost: 2 GB
   *
   * Singularity - Level 1
   *
   * This function allows the player to travel to any city. The cost for using this
   * function is the same as the cost for traveling through the Travel Agency.
   *
   * @param city - City to travel to.
   * @returns True if actions is successful, false otherwise.
   */
  travelToCity(city: string): boolean;

  /**
   * Purchase the TOR router.
   * @remarks
   * RAM cost: 2 GB
   *
   * Singularity - Level 1
   *
   * This function allows you to automatically purchase a TOR router. The cost for
   * purchasing a TOR router using this function is the same as if you were to
   * manually purchase one.
   *
   * @returns True if actions is successful, false otherwise.
   */
  purchaseTor(): boolean;

  /**
   * Purchase a program from the dark web.
   * @remarks
   * RAM cost: 2 GB
   *
   * Singularity - Level 1
   *
   * This function allows you to automatically purchase programs. You MUST have a
   * TOR router in order to use this function. The cost of purchasing programs
   * using this function is the same as if you were purchasing them through the Dark
   * Web using the Terminal buy command.
   *
   * @example
   * ```ts
   * purchaseProgram("brutessh.exe");
   * ```
   * @param programName - Name of program to purchase.
   * @returns True if the specified program is purchased, and false otherwise.
   */
  purchaseProgram(programName: string): boolean;

  /**
   * Check if the player is busy.
   * @remarks
   * RAM cost: 0.5 GB
   *
   * Singularity - Level 1
   *
   * Returns a boolean indicating whether or not the player is currently performing an
   * ‘action’. These actions include working for a company/faction, studying at a univeristy,
   * working out at a gym, creating a program, committing a crime, or carrying out a Hacking Mission.
   *
   * @returns True if the player is currently performing an ‘action’, false otherwise.
   */
  isBusy(): boolean;

  /**
   * Stop the current action.
   * @remarks
   * RAM cost: 1 GB
   *
   * Singularity - Level 1
   *
   * This function is used to end whatever ‘action’ the player is currently performing.
   * The player will receive whatever money/experience/etc. he has earned from that action.
   *
   * The actions that can be stopped with this function are:
   *
   * * Studying at a university
   * * Working for a company/faction
   * * Creating a program
   * * Committing a Crime
   *
   * This function will return true if the player’s action was ended.
   * It will return false if the player was not performing an action when this function was called.
   *
   * @returns True if the player’s action was ended, false if the player was not performing an action.
   */
  stopAction(): boolean;

  /**
   * Upgrade home computer RAM.
   * @remarks
   * RAM cost: 3 GB
   *
   * Singularity - Level 2
   *
   * This function will upgrade amount of RAM on the player’s home computer. The cost is
   * the same as if you were to do it manually.
   *
   * This function will return true if the player’s home computer RAM is successfully upgraded, and false otherwise.
   *
   * @returns True if the player’s home computer RAM is successfully upgraded, and false otherwise.
   */
  upgradeHomeRam(): boolean;

  /**
   * Upgrade home computer cores.
   * @remarks
   * RAM cost: 3 GB
   *
   * Singularity - Level 2
   *
   * This function will upgrade amount of cores on the player’s home computer. The cost is
   * the same as if you were to do it manually.
   *
   * This function will return true if the player’s home computer cores is successfully upgraded, and false otherwise.
   *
   * @returns True if the player’s home computer cores is successfully upgraded, and false otherwise.
   */
  upgradeHomeCores(): boolean;

  /**
   * Get the price of upgrading home RAM.
   * @remarks
   * RAM cost: 1.5 GB
   *
   * Singularity - Level 2
   *
   * Returns the cost of upgrading the player’s home computer RAM.
   *
   * @returns Cost of upgrading the player’s home computer RAM.
   */
  getUpgradeHomeRamCost(): number;

  /**
   * Get the price of upgrading home cores.
   * @remarks
   * RAM cost: 1.5 GB
   *
   * Singularity - Level 2
   *
   * Returns the cost of upgrading the player’s home computer cores.
   *
   * @returns Cost of upgrading the player’s home computer cores.
   */
  getUpgradeHomeCoresCost(): number;

  /**
   * Work for a company.
   * @remarks
   * RAM cost: 3 GB
   *
   * Singularity - Level 2
   *
   * This function will automatically set you to start working at the company
   * at which you are employed. If you are already in the middle of some “working”
   * action (such as working for a faction, training at a gym, or creating a program),
   * then running this function will automatically cancel that action and give you
   * your earnings.
   *
   * This function will return true if the player starts working, and false otherwise.
   *
   * Note that when you are working for a company, you will not actually receive your earnings (reputation, money, experience) until you FINISH the action.
   *
   * @example
   * ```ts
   * //If you only want to work until you get 100,000 company reputation. One small hack to get around this is to continuously restart the action to receive your earnings:
   * while (getCompanyRep(COMPANY HERE) < VALUE) {
   *    workForCompany();
   *    sleep(60000);
   * }
   * //This way, your company reputation will be updated every minute.
   * ```
   * @param companyName - Name of company to work for. Must be an exact match. Optional. If not specified, this argument defaults to the last job that you worked
   * @returns True if the player starts working, and false otherwise.
   */
  workForCompany(companyName?: string): boolean;

  /**
   * Apply for a job at a company.
   * @remarks
   * RAM cost: 3 GB
   *
   * Singularity - Level 2
   *
   * This function will automatically try to apply to the specified company
   * for a position in the specified field. This function can also be used to
   * apply for promotions by specifying the company and field you are already
   * employed at.
   *
   * This function will return true if you successfully get a job/promotion,
   * and false otherwise. Note that if you are trying to use this function to
   * apply for a promotion and you don’t get one, it will return false.
   *
   * @param companyName - Name of company to apply to.
   * @param field - Field to which you want to apply.
   * @returns True if the player successfully get a job/promotion, and false otherwise.
   */
  applyToCompany(companyName: string, field: string): boolean;

  /**
   * Get company reputation.
   * @remarks
   * RAM cost: 1 GB
   *
   * Singularity - Level 2
   *
   * This function will return the amount of reputation you have at the specified company.
   * If the company passed in as an argument is invalid, -1 will be returned.
   *
   * @param companyName - Name of the company.
   * @returns Amount of reputation you have at the specified company.
   */
  getCompanyRep(companyName: string): number;

  /**
   * Get company favor.
   * @remarks
   * RAM cost: 1 GB
   *
   * Singularity - Level 2
   *
   * This function will return the amount of favor you have at the specified company.
   * If the company passed in as an argument is invalid, -1 will be returned.
   *
   * @param companyName - Name of the company.
   * @returns Amount of favor you have at the specified company.
   */
  getCompanyFavor(companyName: string): number;

  /**
   * Get company favor gain.
   * @remarks
   * RAM cost: 0.75 GB
   *
   * Singularity - Level 2
   *
   * This function will return the amount of favor you will gain for the specified
   * company when you reset by installing Augmentations.
   *
   * @param companyName - Name of the company.
   * @returns Amount of favor you gain at the specified company when you reset by installing Augmentations.
   */
  getCompanyFavorGain(companyName: string): number;

  /**
   * List all current faction invitations.
   * @remarks
   * RAM cost: 3 GB
   *
   * Singularity - Level 2
   *
   * Returns an array with the name of all Factions you currently have oustanding invitations from.
   *
   * @returns Array with the name of all Factions you currently have oustanding invitations from.
   */
  checkFactionInvitations(): string[];

  /**
   * Join a faction.
   * @remarks
   * RAM cost: 3 GB
   *
   * Singularity - Level 2
   *
   * This function will automatically accept an invitation from a faction and join it.
   *
   * @param faction - Name of faction to join.
   * @returns True if player joined the faction, and false otherwise.
   */
  joinFaction(faction: string): boolean;

  /**
   * Work for a faction.
   * @remarks
   * RAM cost: 3 GB
   *
   * Singularity - Level 2
   *
   * This function will automatically set you to start working for the specified faction.
   * Obviously, you must be a member of the faction or else this function will fail. If
   * you are already in the middle of some “working” action (such as working for a company,
   * training at a gym, or creating a program), then running this function will automatically
   * cancel that action and give you your earnings.
   *
   * This function will return true if you successfully start working for the specified faction, and false otherwise.
   *
   * Note that when you are working for a faction, you will not actually receive your earnings (reputation, experience) until you FINISH the action.
   *
   * @example
   * ```ts
   * //If you only want to work until you get 100,000 faction reputation. One small hack to get around this is to continuously restart the action to receive your earnings:
   * while (getFactionRep(FACTION NAME) < VALUE) {
   *    workForFaction(FACNAME, WORKTYPE);
   *    sleep(60000);
   * }
   * //This way, your faction reputation will be updated every minute.
   * ```
   * @param faction - Name of faction to work for.
   * @param workType - Type of work to perform for the faction.
   * @returns True if the player starts working, and false otherwise.
   */
  workForFaction(faction: string, workType: string): boolean;

  /**
   * Get faction reputation.
   * @remarks
   * RAM cost: 1 GB
   *
   * Singularity - Level 2
   *
   * This function returns the amount of reputation you have for the specified faction.
   *
   * @param faction - Name of faction to work for.
   * @returns Amount of reputation you have for the specified faction.
   */
  getFactionRep(faction: string): number;

  /**
   * Get faction favor.
   * @remarks
   * RAM cost: 1 GB
   *
   * Singularity - Level 2
   *
   * This function returns the amount of favor you have for the specified faction.
   *
   * @param faction - Name of faction.
   * @returns Amount of favor you have for the specified faction.
   */
  getFactionFavor(faction: string): number;

  /**
   * Get faction favor gain.
   * @remarks
   * RAM cost: 0.75 GB
   *
   * Singularity - Level 2
   *
   * This function returns the amount of favor you will gain for the specified
   * faction when you reset by installing Augmentations.
   *
   * @param faction - Name of faction.
   * @returns Amount of favor you will gain for the specified faction when you reset by installing Augmentations.
   */
  getFactionFavorGain(faction: string): number;

  /**
   * Donate to a faction.
   * @remarks
   * RAM cost: 5 GB
   *
   * Singularity - Level 3
   *
   * Attempts to donate money to the specified faction in exchange for reputation.
   * Returns true if you successfully donate the money, and false otherwise.
   *
   * @param faction - Name of faction to donate to.
   * @param amount - Amount of money to donate.
   * @returns True if the money was donated, and false otherwise.
   */
  donateToFaction(faction: string, amount: number): boolean;

  /**
   * Create a program.
   * @remarks
   * RAM cost: 5 GB
   *
   * Singularity - Level 3
   *
   * This function will automatically set you to start working on creating the
   * specified program. If you are already in the middle of some “working” action
   * (such as working for a company, training at a gym, or taking a course), then
   * running this function will automatically cancel that action and give you your
   * earnings.
   *
   * This function returns true if you successfully start working on the specified program, and false otherwise.
   *
   * Note that creating a program using this function has the same hacking level requirements as it normally would. These level requirements are:
   * * BruteSSH.exe: 50
   * * FTPCrack.exe: 100
   * * relaySMTP.exe: 250
   * * HTTPWorm.exe: 500
   * * SQLInject.exe: 750
   * * DeepscanV1.exe: 75
   * * DeepscanV2.exe: 400
   * * ServerProfiler.exe: 75
   * * AutoLink.exe: 25
   *
   * @example
   * ```ts
   * createProgram(“relaysmtp.exe”);
   * ```
   * @param program - Name of program to create.
   * @returns True if you successfully start working on the specified program, and false otherwise.
   */
  createProgram(program: string): boolean;

  /**
   * Commit a crime.
   * @remarks
   * RAM cost: 5 GB
   *
   * Singularity - Level 3
   *
   * This function is used to automatically attempt to commit crimes.
   * If you are already in the middle of some ‘working’ action (such
   * as working for a company or training at a gym), then running this
   * function will automatically cancel that action and give you your
   * earnings.
   *
   * This function returns the number of seconds it takes to attempt the specified
   * crime (e.g It takes 60 seconds to attempt the ‘Rob Store’ crime, so running
   * `commitCrime('rob store')` will return 60).
   *
   * Warning: I do not recommend using the time returned from this function to try
   * and schedule your crime attempts. Instead, I would use the isBusy Singularity
   * function to check whether you have finished attempting a crime. This is because
   * although the game sets a certain crime to be X amount of seconds, there is no
   * guarantee that your browser will follow that time limit.
   *
   * @param crime - Name of crime to attempt.
   * @returns True if you successfully start working on the specified program, and false otherwise.
   */
  commitCrime(crime: string): number;

  /**
   * Get chance to successfully commit a crime.
   * @remarks
   * RAM cost: 5 GB
   *
   * Singularity - Level 3
   *
   * This function returns your chance of success at commiting the specified crime.
   *
   * @param crime - Name of crime.
   * @returns Chance of success at commiting the specified crime.
   */
  getCrimeChance(crime: string): number;

  /**
   * Get stats related to a crime.
   * @remarks
   * RAM cost: 5 GB
   *
   * Singularity - Level 3
   *
   * Returns the stats of the crime.
   *
   * @param crime - Name of crime. Not case-sensitive
   * @returns The stats of the crime.
   */
  getCrimeStats(crime: string): CrimeStats;

  /**
   * Get a list of owned augmentation.
   * @remarks
   * RAM cost: 5 GB
   *
   * Singularity - Level 3
   *
   * This function returns an array containing the names (as strings) of all Augmentations you have.
   *
   * @param purchased - Specifies whether the returned array should include Augmentations you have purchased but not yet installed. By default, this argument is false which means that the return value will NOT have the purchased Augmentations.
   * @returns Array containing the names (as strings) of all Augmentations you have.
   */
  getOwnedAugmentations(purchased?: boolean): string[];

  /**
   * Get a list of acquired Source-Files.
   * @remarks
   * RAM cost: 5 GB
   *
   * Singularity - Level 3
   *
   * Returns an array of source files
   *
   * @returns Array containing an object with number and level of the source file.
   */
  getOwnedSourceFiles(): SourceFileLvl[];

  /**
   * Get a list of augmentation available from a faction.
   * @remarks
   * RAM cost: 5 GB
   *
   * Singularity - Level 3
   *
   * Returns an array containing the names (as strings) of all Augmentations
   * that are available from the specified faction.
   *
   * @param faction - Name of faction.
   * @returns Array containing the names of all Augmentations.
   */
  getAugmentationsFromFaction(faction: string): string[];

  /**
   * Get the pre-requisite of an augmentation.
   * @remarks
   * RAM cost: 5 GB
   *
   * Singularity - Level 3
   *
   * This function returns an array with the names of the prerequisite Augmentation(s) for the specified Augmentation.
   * If there are no prerequisites, a blank array is returned.
   *
   * @param augName - Name of Augmentation.
   * @returns Array with the names of the prerequisite Augmentation(s) for the specified Augmentation.
   */
  getAugmentationPrereq(augName: string): string[];

  /**
   * @deprecated
   * Get the price and reputation of an augmentation.
   * @remarks
   * RAM cost: 5 GB
   *
   * Singularity - Level 3
   *
   * This function returns an array with two elements that gives the cost for
   * the specified Augmentation. The first element in the returned array is the
   * reputation requirement of the Augmentation, and the second element is the
   * money cost.
   *
   * If an invalid Augmentation name is passed in for the augName argument, this
   * function will return the array [-1, -1].
   *
   * @param augName - Name of Augmentation.
   * @returns Array with first element as a reputation requirement and second element as the money cost.
   */
  getAugmentationCost(augName: string): [number, number];

  /**
   * Get price of an augmentation.
   * @remarks
   * RAM cost: 2.5 GB
   *
   * Singularity - Level 3
   *
   * @param augName - Name of Augmentation.
   * @returns Price of the augmentation.
   */
  getAugmentationPrice(augName: string): number;

  /**
   * Get reputation requirement of an augmentation.
   * @remarks
   * RAM cost: 2.5 GB
   *
   * Singularity - Level 3
   *
   * @param augName - Name of Augmentation.
   * @returns Reputation requirement of the augmentation.
   */
  getAugmentationRepReq(augName: string): number;

  /**
   * Purchase an augmentation
   * @remarks
   * RAM cost: 5 GB
   *
   * Singularity - Level 3
   *
   * This function will try to purchase the specified Augmentation through the given Faction.
   *
   * This function will return true if the Augmentation is successfully purchased, and false otherwise.
   *
   * @param faction - Name of faction to purchase Augmentation from.
   * @param augmentation - Name of Augmentation to purchase.
   * @returns True if the Augmentation is successfully purchased, and false otherwise.
   */
  purchaseAugmentation(faction: string, augmentation: string): boolean;

  /**
   * Get the stats of an augmentation.
   * @remarks
   * RAM cost: 5 GB
   *
   * Singularity - Level 3
   *
   * This function returns augmentation stats.
   *
   * @param name - Name of Augmentation. CASE-SENSITIVE.
   * @returns Augmentation stats.
   */
  getAugmentationStats(name: string): AugmentationStats;

  /**
   * Install your purchased augmentations.
   * @remarks
   * RAM cost: 5 GB
   *
   * Singularity - Level 3
   *
   * This function will automatically install your Augmentations, resetting the game as usual.
   *
   * @param cbScript - This is a script that will automatically be run after Augmentations are installed (after the reset). This script will be run with no arguments and 1 thread. It must be located on your home computer.
   */
  installAugmentations(cbScript?: string): void;

  /**
   * @deprecated
   * Returns an object with the Player’s stats.
   *
   * @remarks
   * RAM cost: 0.5 GB
   *
   * Singularity - Level 1
   *
   * @example
   * ```ts
   * res = getStats();
   * print('My charisma level is: ' + res.charisma);
   * ```
   * @returns Object with the Player’s stats.
   */
  getStats(): PlayerSkills;

  /**
   * @deprecated
   * Returns an object with various information about your character.
   *
   * @remarks
   * RAM cost: 0.5 GB
   *
   * Singularity - Level 1
   *
   * @returns Object with various information about your character.
   */
  getCharacterInformation(): CharacterInfo;

  /**
   * Hospitalize the player.
   * @remarks
   * RAM cost: 0.25 GB
   *
   * Singularity - Level 1
   *
   * @returns The cost of the hospitalization.
   */
  hospitalize(): number;

  /**
   * Soft reset the game.
   * @remarks
   * RAM cost: 5 GB
   *
   * Singularity - Level 3
   *
   * This function will perform a reset even if you don’t have any augmentation installed.
   *
   * @param cbScript - This is a script that will automatically be run after Augmentations are installed (after the reset). This script will be run with no arguments and 1 thread. It must be located on your home computer.
   */
  softReset(cbScript: string): void;

  /**
   * Go to a location.
   * @remarks
   * RAM cost: 5 GB
   *
   * Singularity - Level 3
   *
   * Move the player to a specific location.
   *
   * @param locationName - Name of the location.
   * @returns True if the player was moved there, false otherwise.
   */
  goToLocation(locationName: string): boolean;

  /**
   * Get the current server.
   * @remarks
   * RAM cost: 2 GB
   *
   * Singularity - Level 1
   *
   * @returns Name of the current server.
   */
  getCurrentServer(): string;

  /**
   * Connect to a server.
   * @remarks
   * RAM cost: 2 GB
   *
   * Singularity - Level 1
   *
   * Run the connect HOSTNAME command in the terminal. Can only connect to neighbors.
   *
   * @returns True if the connect command was successful, false otherwise.
   */
  connect(hostname: string): boolean;

  /**
   * Run the hack command in the terminal.
   * @remarks
   * RAM cost: 2 GB
   *
   * Singularity - Level 1
   *
   * @returns Amount of money stolen by manual hacking.
   */
  manualHack(): Promise<number>;

  /**
   * Run the backdoor command in the terminal.
   * @remarks
   * RAM cost: 2 GB
   *
   * Singularity - Level 1
   *
   * @returns True if the installation was successful.
   */
  installBackdoor(): Promise<boolean>;
}

/**
 * Hacknet API
 * @remarks
 * Not all these functions are immediately available.
 * @public
 */
export interface Hacknet {
  /**
   * Get the number of hacknet nodes you own.
   * @remarks
   * RAM cost: 0 GB
   *
   * Returns the number of Hacknet Nodes you own.
   *
   * @returns number of hacknet nodes.
   */
  numNodes(): number;

  /**
   * Get the maximum number of hacknet nodes.
   * @remarks
   * RAM cost: 0 GB
   *
   * @returns maximum number of hacknet nodes.
   */
  maxNumNodes(): number;

  /**
   * Purchase a new hacknet node.
   * @remarks
   * RAM cost: 0 GB
   *
   * Purchases a new Hacknet Node. Returns a number with the index of the
   * Hacknet Node. This index is equivalent to the number at the end of
   * the Hacknet Node’s name (e.g The Hacknet Node named `hacknet-node-4`
   * will have an index of 4).
   *
   * If the player cannot afford to purchase a new Hacknet Node then the function will return -1.
   *
   * @returns The index of the Hacknet Node or if the player cannot afford to purchase a new Hacknet Node the function will return -1.
   */
  purchaseNode(): number;

  /**
   * Get the price of the next hacknet node.
   * @remarks
   * RAM cost: 0 GB
   *
   * Returns the cost of purchasing a new Hacknet Node.
   *
   * @returns Cost of purchasing a new Hacknet Node.
   */
  getPurchaseNodeCost(): number;

  /**
   * Get the stats of a hacknet node.
   * @remarks
   * RAM cost: 0 GB
   *
   * Returns an object containing a variety of stats about the specified Hacknet Node.
   *
   * Note that for Hacknet Nodes, production refers to the amount of money the node generates.
   * For Hacknet Servers (the upgraded version of Hacknet Nodes), production refers to the
   * amount of hashes the node generates.
   *
   * @param index - Index/Identifier of Hacknet Node
   * @returns Object containing a variety of stats about the specified Hacknet Node.
   */
  getNodeStats(index: number): NodeStats;

  /**
   * Upgrade the level of a hacknet node.
   * @remarks
   * RAM cost: 0 GB
   *
   * Tries to upgrade the level of the specified Hacknet Node by n.
   *
   * Returns true if the Hacknet Node’s level is successfully upgraded by n
   * or if it is upgraded by some positive amount and the Node reaches its max level.
   *
   * Returns false otherwise.
   *
   * @param index - Index/Identifier of Hacknet Node.
   * @param n - Number of levels to purchase. Must be positive. Rounded to nearest integer.
   * @returns True if the Hacknet Node’s level is successfully upgraded, false otherwise.
   */
  upgradeLevel(index: number, n: number): boolean;

  /**
   * Upgrade the RAM of a hacknet node.
   * @remarks
   * RAM cost: 0 GB
   *
   * Tries to upgrade the specified Hacknet Node’s RAM n times.
   * Note that each upgrade doubles the Node’s RAM.
   * So this is equivalent to multiplying the Node’s RAM by 2 n.
   *
   * Returns true if the Hacknet Node’s RAM is successfully upgraded n times
   * or if it is upgraded some positive number of times and the Node reaches it max RAM.
   *
   * Returns false otherwise.
   *
   * @param index - Index/Identifier of Hacknet Node.
   * @param n - Number of times to upgrade RAM. Must be positive. Rounded to nearest integer.
   * @returns True if the Hacknet Node’s ram is successfully upgraded, false otherwise.
   */
  upgradeRam(index: number, n: number): boolean;

  /**
   * Upgrade the core of a hacknet node.
   * @remarks
   * RAM cost: 0 GB
   *
   * Tries to purchase n cores for the specified Hacknet Node.
   *
   * Returns true if it successfully purchases n cores for the Hacknet Node
   * or if it purchases some positive amount and the Node reaches its max number of cores.
   *
   * Returns false otherwise.
   *
   * @param index - Index/Identifier of Hacknet Node.
   * @param n - Number of cores to purchase. Must be positive. Rounded to nearest integer.
   * @returns True if the Hacknet Node’s cores are successfully purchased, false otherwise.
   */
  upgradeCore(index: number, n: number): boolean;

  /**
   * Upgrade the cache of a hacknet node.
   * @remarks
   * RAM cost: 0 GB
   *
   * This function is only applicable for Hacknet Servers (the upgraded version of a Hacknet Node).
   *
   * Tries to upgrade the specified Hacknet Server’s cache n times.
   *
   * Returns true if it successfully upgrades the Server’s cache n times,
   * or if it purchases some positive amount and the Server reaches its max cache level.
   *
   * Returns false otherwise.
   *
   * @param index - Index/Identifier of Hacknet Node.
   * @param n - Number of cache levels to purchase. Must be positive. Rounded to nearest integer.
   * @returns True if the Hacknet Node’s cores are successfully purchased, false otherwise.
   */
  upgradeCache(index: number, n: number): boolean;

  /**
   * Calculate the cost of upgrading hacknet node levels.
   * @remarks
   * RAM cost: 0 GB
   *
   * Returns the cost of upgrading the specified Hacknet Node by n levels.
   *
   * If an invalid value for n is provided, then this function returns 0.
   * If the specified Hacknet Node is already at max level, then Infinity is returned.
   *
   * @param index - Index/Identifier of Hacknet Node.
   * @param n - Number of levels to upgrade. Must be positive. Rounded to nearest integer.
   * @returns Cost of upgrading the specified Hacknet Node.
   */
  getLevelUpgradeCost(index: number, n: number): number;

  /**
   * Calculate the cost of upgrading hacknet node RAM.
   * @remarks
   * RAM cost: 0 GB
   *
   * Returns the cost of upgrading the RAM of the specified Hacknet Node n times.
   *
   * If an invalid value for n is provided, then this function returns 0.
   * If the specified Hacknet Node is already at max level, then Infinity is returned.
   *
   * @param index - Index/Identifier of Hacknet Node.
   * @param n - Number of times to upgrade RAM. Must be positive. Rounded to nearest integer.
   * @returns Cost of upgrading the specified Hacknet Node's ram.
   */
  getRamUpgradeCost(index: number, n: number): number;

  /**
   * Calculate the cost of upgrading hacknet node cores.
   * @remarks
   * RAM cost: 0 GB
   *
   * Returns the cost of upgrading the number of cores of the specified Hacknet Node by n.
   *
   * If an invalid value for n is provided, then this function returns 0.
   * If the specified Hacknet Node is already at max level, then Infinity is returned.
   *
   * @param index - Index/Identifier of Hacknet Node.
   * @param n - Number of times to upgrade cores. Must be positive. Rounded to nearest integer.
   * @returns Cost of upgrading the specified Hacknet Node's number of cores.
   */
  getCoreUpgradeCost(index: number, n: number): number;

  /**
   * Calculate the cost of upgrading hacknet node cache.
   * @remarks
   * RAM cost: 0 GB
   *
   * This function is only applicable for Hacknet Servers (the upgraded version of a Hacknet Node).
   *
   * Returns the cost of upgrading the cache level of the specified Hacknet Server by n.
   *
   * If an invalid value for n is provided, then this function returns 0.
   * If the specified Hacknet Node is already at max level, then Infinity is returned.
   *
   * @param index - Index/Identifier of Hacknet Node.
   * @param n - Number of times to upgrade cache. Must be positive. Rounded to nearest integer.
   * @returns Cost of upgrading the specified Hacknet Node's cache.
   */
  getCacheUpgradeCost(index: number, n: number): number;

  /**
   * Get the total number of hashes stored.
   * @remarks
   * RAM cost: 0 GB
   *
   * This function is only applicable for Hacknet Servers (the upgraded version of a Hacknet Node).
   *
   * Returns the number of hashes you have.
   *
   * @returns Number of hashes you have.
   */
  numHashes(): number;

  /**
   * Get the maximum number of hashes you can store.
   * @remarks
   * RAM cost: 0 GB
   *
   * This function is only applicable for Hacknet Servers (the upgraded version of a Hacknet Node).
   *
   * Returns the number of hashes you can store.
   *
   * @returns Number of hashes you can store.
   */
  hashCapacity(): number;

  /**
   * Get the cost of a hash upgrade.
   * @remarks
   * RAM cost: 0 GB
   *
   * This function is only applicable for Hacknet Servers (the upgraded version of a Hacknet Node).
   *
   * Returns the number of hashes required for the specified upgrade. The name of the upgrade must be an exact match.
   *
   * @example
   * ```ts
   * var upgradeName = "Sell for Corporation Funds";
   * if (hacknet.numHashes() > hacknet.hashCost(upgradeName)) {
   *    hacknet.spendHashes(upgName);
   * }
   * ```
   * @param upgName - Name of the upgrade of Hacknet Node.
   * @returns Number of hashes required for the specified upgrade.
   */
  hashCost(upgName: string): number;

  /**
   * Purchase a hash upgrade.
   * @remarks
   * RAM cost: 0 GB
   *
   * This function is only applicable for Hacknet Servers (the upgraded version of a Hacknet Node).
   *
   * Spend the hashes generated by your Hacknet Servers on an upgrade.
   * Returns a boolean value - true if the upgrade is successfully purchased, and false otherwise.
   *
   * The name of the upgrade must be an exact match.
   * The `upgTarget` argument is used for upgrades such as `Reduce Minimum Security`, which applies to a specific server.
   * In this case, the `upgTarget` argument must be the hostname of the server.
   *
   * @example
   * ```ts
   * hacknet.spendHashes("Sell for Corporation Funds");
   * hacknet.spendHashes("Increase Maximum Money", "foodnstuff");
   * ```
   * @param upgName - Name of the upgrade of Hacknet Node.
   * @param upgTarget - Object to which upgrade applies. Required for certain upgrades.
   * @returns True if the upgrade is successfully purchased, and false otherwise..
   */
  spendHashes(upgName: string, upgTarget?: string): boolean;

  /**
   * Get the level of a hash upgrade.
   * @remarks
   * RAM cost: 0 GB
   *
   * This function is only applicable for Hacknet Servers (the upgraded version of a Hacknet Node).
   *
   * @returns Level of the upgrade.
   */
  getHashUpgradeLevel(upgName: string): number;

  /**
   * Get the multipler to study.
   * @remarks
   * RAM cost: 0 GB
   *
   * This function is only applicable for Hacknet Servers (the upgraded version of a Hacknet Node).
   *
   * @returns Multiplier.
   */
  getStudyMult(): number;

  /**
   * Get the multipler to training.
   * @remarks
   * RAM cost: 0 GB
   *
   * This function is only applicable for Hacknet Servers (the upgraded version of a Hacknet Node).
   *
   * @returns Multiplier.
   */
  getTrainingMult(): number;
}

/**
 * Bladeburner API
 * @remarks
 * You have to be employed in the Bladeburner division and be in BitNode-7
 * or have Source-File 7 in order to use this API.
 * @public
 */
export interface Bladeburner {
  /**
   * List all contracts.
   * @remarks
   * RAM cost: 0.4 GB
   *
   * Returns an array of strings containing the names of all Bladeburner contracts.
   *
   * @returns Array of strings containing the names of all Bladeburner contracts.
   */
  getContractNames(): string[];

  /**
   * List all operations.
   * @remarks
   * RAM cost: 0.4 GB
   *
   * Returns an array of strings containing the names of all Bladeburner operations.
   *
   * @returns Array of strings containing the names of all Bladeburner operations.
   */
  getOperationNames(): string[];

  /**
   * List all black ops.
   * @remarks
   * RAM cost: 0.4 GB
   *
   * Returns an array of strings containing the names of all Bladeburner Black Ops.
   *
   * @returns Array of strings containing the names of all Bladeburner Black Ops.
   */
  getBlackOpNames(): string[];

  /**
   * List all general actions.
   * @remarks
   * RAM cost: 0.4 GB
   *
   * Returns an array of strings containing the names of all general Bladeburner actions.
   *
   * @returns Array of strings containing the names of all general Bladeburner actions.
   */
  getGeneralActionNames(): string[];

  /**
   * List all skills.
   * @remarks
   * RAM cost: 0.4 GB
   *
   * Returns an array of strings containing the names of all general Bladeburner skills.
   *
   * @returns Array of strings containing the names of all general Bladeburner skills.
   */
  getSkillNames(): string[];

  /**
   * Start an action.
   * @remarks
   * RAM cost: 4 GB
   *
   * Attempts to start the specified Bladeburner action.
   * Returns true if the action was started successfully, and false otherwise.
   *
   * @param type - Type of action.
   * @param name - Name of action. Must be an exact match
   * @returns True if the action was started successfully, and false otherwise.
   */
  startAction(type: string, name: string): boolean;

  /**
   * Stop current action.
   * @remarks
   * RAM cost: 2 GB
   *
   * Stops the current Bladeburner action.
   *
   */
  stopBladeburnerAction(): void;

  /**
   * Get current action.
   * @remarks
   * RAM cost: 1 GB
   *
   * Returns an object that represents the player’s current Bladeburner action.
   * If the player is not performing an action, the function will return an object with the ‘type’ property set to “Idle”.
   *
   * @returns Object that represents the player’s current Bladeburner action.
   */
  getCurrentAction(): BladeburnerCurAction;

  /**
   * Get the time to complete an action.
   * @remarks
   * RAM cost: 4 GB
   *
   * Returns the number of seconds it takes to complete the specified action
   *
   * @param type - Type of action.
   * @param name - Name of action. Must be an exact match.
   * @returns Number of milliseconds it takes to complete the specified action.
   */
  getActionTime(type: string, name: string): number;

  /**
   * Get estimate success chance of an action.
   * @remarks
   * RAM cost: 4 GB
   *
   * Returns the estimated success chance for the specified action.
   * This chance is returned as a decimal value, NOT a percentage
   * (e.g. if you have an estimated success chance of 80%, then this function will return 0.80, NOT 80).
   *
   * @param type - Type of action.
   * @param name - Name of action. Must be an exact match.
   * @returns Estimated success chance for the specified action.
   */
  getActionEstimatedSuccessChance(type: string, name: string): number;

  /**
   * Get the reputation gain of an action.
   * @remarks
   * RAM cost: 4 GB
   *
   * Returns the average Bladeburner reputation gain for successfully
   * completing the specified action.
   * Note that this value is an ‘average’ and the real reputation gain may vary slightly from this value.
   *
   * @param type - Type of action.
   * @param name - Name of action. Must be an exact match.
   * @param level - Optional action level at which to calculate the gain
   * @returns Average Bladeburner reputation gain for successfully completing the specified action.
   */
  getActionRepGain(type: string, name: string, level: number): number;

  /**
   * Get action count remaining.
   * @remarks
   * RAM cost: 4 GB
   *
   * Returns the remaining count of the specified action.
   *
   * Note that this is meant to be used for Contracts and Operations.
   * This function will return ‘Infinity’ for actions such as Training and Field Analysis.
   * This function will return 1 for BlackOps not yet completed regardless of wether
   * the player has the required rank to attempt the mission or not.
   *
   * @param type - Type of action.
   * @param name - Name of action. Must be an exact match.
   * @returns Remaining count of the specified action.
   */
  getActionCountRemaining(type: string, name: string): number;

  /**
   * Get the maximum level of an action.
   * @remarks
   * RAM cost: 4 GB
   *
   * Returns the maximum level for this action.
   *
   * Returns -1 if an invalid action is specified.
   *
   * @param type - Type of action.
   * @param name - Name of action. Must be an exact match.
   * @returns Maximum level of the specified action.
   */
  getActionMaxLevel(type: string, name: string): number;

  /**
   * Get the current level of an action.
   * @remarks
   * RAM cost: 4 GB
   *
   * Returns the current level of this action.
   *
   * Returns -1 if an invalid action is specified.
   *
   * @param type - Type of action.
   * @param name - Name of action. Must be an exact match.
   * @returns Current level of the specified action.
   */
  getActionCurrentLevel(type: string, name: string): number;

  /**
   * Get wether an action is set to autolevel.
   * @remarks
   * RAM cost: 4 GB
   *
   * Return a boolean indicating whether or not this action is currently set to autolevel.
   *
   * Returns false if an invalid action is specified.
   *
   * @param type - Type of action.
   * @param name - Name of action. Must be an exact match.
   * @returns True if the action is set to autolevel, and false otherwise.
   */
  getActionAutolevel(type: string, name: string): boolean;

  /**
   * Set an action autolevel.
   * @remarks
   * RAM cost: 4 GB
   *
   * Enable/disable autoleveling for the specified action.
   *
   * @param type - Type of action.
   * @param name - Name of action. Must be an exact match.
   * @param autoLevel - Whether or not to autolevel this action
   */
  setActionAutolevel(type: string, name: string, autoLevel: boolean): void;

  /**
   * Set the level of an action.
   * @remarks
   * RAM cost: 4 GB
   *
   * Set the level for the specified action.
   *
   * @param type - Type of action.
   * @param name - Name of action. Must be an exact match.
   * @param level - Level to set this action to.
   */
  setActionLevel(type: string, name: string, level: number): void;

  /**
   * Get player bladeburner rank.
   * @remarks
   * RAM cost: 4 GB
   *
   * Returns the player’s Bladeburner Rank.
   *
   * @returns Player’s Bladeburner Rank.
   */
  getRank(): number;

  /**
   * Get black op required rank.
   * @remarks
   * RAM cost: 2 GB
   *
   * Returns the rank required to complete this BlackOp.
   *
   * Returns -1 if an invalid action is specified.
   *
   * @param name - Name of BlackOp. Must be an exact match.
   * @returns Rank required to complete this BlackOp.
   */
  getBlackOpRank(name: string): number;

  /**
   * Get bladeburner skill points.
   * @remarks
   * RAM cost: 4 GB
   *
   * Returns the number of Bladeburner skill points you have.
   *
   * @returns Number of Bladeburner skill points you have.
   */
  getSkillPoints(): number;

  /**
   * Get skill level.
   * @remarks
   * RAM cost: 4 GB
   *
   * This function returns your level in the specified skill.
   *
   * The function returns -1 if an invalid skill name is passed in.
   *
   * @param skillName - Name of skill. Case-sensitive and must be an exact match
   * @returns Level in the specified skill.
   */
  getSkillLevel(name: string): number;

  /**
   * Get cost to upgrade skill.
   * @remarks
   * RAM cost: 4 GB
   *
   * This function returns the number of skill points needed to upgrade the specified skill.
   *
   * The function returns -1 if an invalid skill name is passed in.
   *
   * @param skillName - Name of skill. Case-sensitive and must be an exact match
   * @returns Number of skill points needed to upgrade the specified skill.
   */
  getSkillUpgradeCost(name: string): number;

  /**
   * Upgrade skill.
   * @remarks
   * RAM cost: 4 GB
   *
   * Attempts to upgrade the specified Bladeburner skill.
   *
   * Returns true if the skill is successfully upgraded, and false otherwise.
   *
   * @param skillName - Name of skill to be upgraded. Case-sensitive and must be an exact match
   * @returns true if the skill is successfully upgraded, and false otherwise.
   */
  upgradeSkill(name: string): boolean;

  /**
   * Get team size.
   * @remarks
   * RAM cost: 4 GB
   *
   * Returns the number of Bladeburner team members you have assigned to the specified action.
   *
   * Setting a team is only applicable for Operations and BlackOps. This function will return 0 for other action types.
   *
   * @param type - Type of action.
   * @param name - Name of action. Must be an exact match.
   * @returns Number of Bladeburner team members that were assigned to the specified action.
   */
  getTeamSize(type: string, name: string): number;

  /**
   * Set team size.
   * @remarks
   * RAM cost: 4 GB
   *
   * Set the team size for the specified Bladeburner action.
   *
   * Returns the team size that was set, or -1 if the function failed.
   *
   * @param type - Type of action.
   * @param name - Name of action. Must be an exact match.
   * @param size - Number of team members to set. Will be converted using Math.round().
   * @returns Number of Bladeburner team members you assigned to the specified action.
   */
  setTeamSize(type: string, name: string, size: number): number;

  /**
   * Get estimated population in city.
   * @remarks
   * RAM cost: 4 GB
   *
   * Returns the estimated number of Synthoids in the specified city,
   * or -1 if an invalid city was specified.
   *
   * @param cityName - Name of city. Case-sensitive
   * @returns Estimated number of Synthoids in the specified city.
   */
  getCityEstimatedPopulation(name: string): number;

  /**
   * Get number of communities in a city.
   * @remarks
   * RAM cost: 4 GB
   *
   * Returns the estimated number of Synthoid communities in the specified city,
   * or -1 if an invalid city was specified.
   *
   * @param cityName - Name of city. Case-sensitive
   * @returns Number of Synthoids communities in the specified city.
   */
  getCityCommunities(name: string): number;

  /**
   * Get chaos of a city.
   * @remarks
   * RAM cost: 4 GB
   *
   * Returns the chaos in the specified city,
   * or -1 if an invalid city was specified.
   *
   * @param cityName - Name of city. Case-sensitive
   * @returns Chaos in the specified city.
   */
  getCityChaos(name: string): number;

  /**
   * Get current city.
   * @remarks
   * RAM cost: 4 GB
   *
   * Returns the city that the player is currently in (for Bladeburner).
   *
   * @returns City that the player is currently in (for Bladeburner).
   */
  getCity(): string;

  /**
   * Travel to another city in bladeburner.
   * @remarks
   * RAM cost: 4 GB
   * Attempts to switch to the specified city (for Bladeburner only).
   *
   * Returns true if successful, and false otherwise
   *
   * @param cityName - Name of city. Case-sensitive
   * @returns true if successful, and false otherwise
   */
  switchCity(name: string): boolean;

  /**
   * Get bladeburner stamina.
   * @remarks
   * RAM cost: 4 GB
   * Returns an array with two elements:
   * * [Current stamina, Max stamina]
   * @example
   * ```ts
   * function getStaminaPercentage() {
   *    let res = bladeburner.getStamina();
   *    return res[0] / res[1];
   * }
   * ```
   * @returns Array containing current stamina and max stamina.
   */
  getStamina(): [number, number];

  /**
   * Join the bladeburner faction.
   * @remarks
   * RAM cost: 4 GB
   * Attempts to join the Bladeburner faction.
   *
   * Returns true if you successfully join the Bladeburner faction, or if you are already a member.
   *
   * Returns false otherwise.
   *
   * @returns True if you successfully join the Bladeburner faction, or if you are already a member, false otherwise.
   */
  joinBladeburnerFaction(): boolean;

  /**
   * Join the bladeburner division.
   * @remarks
   * RAM cost: 4 GB
   *
   * Attempts to join the Bladeburner division.
   *
   * Returns true if you successfully join the Bladeburner division, or if you are already a member.
   *
   * Returns false otherwise.
   *
   * @returns True if you successfully join the Bladeburner division, or if you are already a member, false otherwise.
   */
  joinBladeburnerDivision(): boolean;

  /**
   * Get bladeburner bonus time.
   * @remarks
   * RAM cost: 0 GB
   *
   * Returns the amount of accumulated “bonus time” (seconds) for the Bladeburner mechanic.
   *
   * “Bonus time” is accumulated when the game is offline or if the game is inactive in the browser.
   *
   * “Bonus time” makes the game progress faster, up to 5x the normal speed.
   * For example, if an action takes 30 seconds to complete but you’ve accumulated over
   * 30 seconds in bonus time, then the action will only take 6 seconds in real life to complete.
   *
   * @returns Amount of accumulated “bonus time” (milliseconds) for the Bladeburner mechanic.
   */
  getBonusTime(): number;
}

/**
 * Coding Contact API
 * @public
 */
export interface CodingContract {
  /**
   * Attemps a coding contract.
   * @remarks
   * RAM cost: 10 GB
   *
   * Attempts to solve the Coding Contract with the provided solution.
   *
   * @param answer - Solution for the contract.
   * @param fn - Filename of the contract.
   * @param host - Host of the server containing the contract. Optional. Defaults to current server if not provided.
   * @returns True if the solution was correct, false otherwise.
   */
  attempt(answer: string[] | number, fn: string, host?: string): boolean;

  /**
   * Attemps a coding contract.
   * @remarks
   * RAM cost: 10 GB
   *
   * Attempts to solve the Coding Contract with the provided solution.
   *
   * @param answer - Solution for the contract.
   * @param fn - Filename of the contract.
   * @param host - Host of the server containing the contract. Optional. Defaults to current server if not provided.
   * @param opts - Optional parameters for configuring function behavior.
   * @returns True if the solution was correct, false otherwise. If the returnReward option is configured, then the function will instead return a string. If the contract is successfully solved, the string will contain a description of the contract’s reward. Otherwise, it will be an empty string.
   */
  attempt(answer: string[] | number, fn: string, host?: string, opts?: CodingAttemptOptions): boolean | string;

  /**
   * Get the type of a coding contract.
   * @remarks
   * RAM cost: 5 GB
   *
   * Returns a name describing the type of problem posed by the Coding Contract.
   * (e.g. Find Largest Prime Factor, Total Ways to Sum, etc.)
   *
   * @param fn - Filename of the contract.
   * @param host - Host of the server containing the contract. Optional. Defaults to current server if not provided.
   * @returns Name describing the type of problem posed by the Coding Contract.
   */
  getContractType(fn: string, host?: string): string;

  /**
   * Get the description.
   * @remarks
   * RAM cost: 5 GB
   *
   * Get the full text description for the problem posed by the Coding Contract.
   *
   * @param fn - Filename of the contract.
   * @param host - Host of the server containing the contract. Optional. Defaults to current server if not provided.
   * @returns Contract’s text description.
   */
  getDescription(fn: string, host?: string): string;

  /**
   * Get the input data.
   * @remarks
   * RAM cost: 5 GB
   *
   * Get the data associated with the specific Coding Contract.
   * Note that this is not the same as the contract’s description.
   * This is just the data that the contract wants you to act on in order to solve
   *
   * @param fn - Filename of the contract.
   * @param host - Host of the server containing the contract. Optional. Defaults to current server if not provided.
   * @returns The specified contract’s data;
   */
  getData(fn: string, host?: string): string;

  /**
   * Get the number of attempt remaining.
   * @remarks
   * RAM cost: 2 GB
   *
   * Get the number of tries remaining on the contract before it self-destructs.
   *
   * @param fn - Filename of the contract.
   * @param host - Host of the server containing the contract. Optional. Defaults to current server if not provided.
   * @returns How many attempts are remaining for the contract;
   */
  getNumTriesRemaining(fn: string, host?: string): number;
}

/**
 * Gang API
 * @remarks
 * If you are not in BitNode-2, then you must have Source-File 2 in order to use this API.
 * @public
 */
export interface Gang {
  /**
   * Create a gang.
   * @remarks
   * RAM cost: 1GB
   *
   * Create a gang with the specified faction.
   * @returns True if the gang was created, false otherwise.
   */
  createGang(faction: string): boolean;

  /**
   * Check if you're in a gang.
   * @remarks
   * RAM cost: 1GB
   * @returns True if you're in a gang, false otherwise.
   */
  inGang(): boolean;

  /**
   * List all gang members.
   * @remarks
   * RAM cost: 1 GB
   *
   * Get the names of all Gang members
   *
   * @returns Names of all Gang members.
   */
  getMemberNames(): string[];

  /**
   * Get information about your gang.
   * @remarks
   * RAM cost: 2 GB
   *
   * Get general information about the gang.
   *
   * @returns Object containing general information about the gang.
   */
  getGangInformation(): GangGenInfo;

  /**
   * Get information about the other gangs.
   * @remarks
   * RAM cost: 2 GB
   *
   * Get territory and power information about all gangs.
   *
   * @returns Object containing territory and power information about all gangs.
   */
  getOtherGangInformation(): GangOtherInfo;

  /**
   * Get information about a specific gang member.
   * @remarks
   * RAM cost: 2 GB
   *
   * Get stat and equipment-related information about a Gang Member
   *
   * @param name - Name of member.
   * @returns Object containing stat and equipment-related information about a Gang Member.
   */
  getMemberInformation(name: string): GangMemberInfo;

  /**
   * Check if you can recruit a new gang member.
   * @remarks
   * RAM cost: 1 GB
   *
   * Returns boolean indicating whether a member can currently be recruited
   *
   * @returns True if a member can currently be recruited, false otherwise.
   */
  canRecruitMember(): boolean;

  /**
   * Recruit a new gang member.
   * @remarks
   * RAM cost: 2 GB
   *
   * Attempt to recruit a new gang member.
   *
   * Possible reasons for failure:
   * * Cannot currently recruit a new member
   * * There already exists a member with the specified name
   *
   * @param name - Name of member to recruit.
   * @returns True if the member was successfully recruited, false otherwise.
   */
  recruitMember(name: string): boolean;

  /**
   * List member task names.
   * @remarks
   * RAM cost: 1 GB
   *
   * Get the name of all valid tasks that Gang members can be assigned to.
   *
   * @returns All valid tasks that Gang members can be assigned to.
   */
  getTaskNames(): string[];

  /**
   * Set gang member to task.
   * @remarks
   * RAM cost: 2 GB
   *
   * Attempts to assign the specified Gang Member to the specified task.
   * If an invalid task is specified, the Gang member will be set to idle (“Unassigned”).
   *
   * @param memberName - Name of Gang member to assign.
   * @param taskName - Task to assign.
   * @returns True if the Gang Member was successfully assigned to the task, false otherwise.
   */
  setMemberTask(memberName: string, taskName: string): boolean;

  /**
   * Get stats of a task.
   * @remarks
   * RAM cost: 1 GB
   *
   * Get the stats of a gang task stats. This is typically used to evaluate which action should be executed next.
   *
   * @param name -  Name of the task.
   * @returns Detailed stats of a task.
   */
  getTaskStats(name: string): GangTaskStats;

  /**
   * List equipment names.
   * @remarks
   * RAM cost: 1 GB
   *
   * Get the name of all possible equipment/upgrades you can purchase for your Gang Members.
   * This includes Augmentations.
   *
   * @returns Names of all Equpiment/Augmentations.
   */
  getEquipmentNames(): string[];

  /**
   * Get cost of equipment.
   * @remarks
   * RAM cost: 2 GB
   *
   * Get the amount of money it takes to purchase a piece of Equipment or an Augmentation.
   * If an invalid Equipment/Augmentation is specified, this function will return Infinity.
   *
   * @param equipName - Name of equipment.
   * @returns Cost to purchase the specified Equipment/Augmentation (number). Infinity for invalid arguments
   */
  getEquipmentCost(equipName: string): number;

  /**
   * Get type of an equipment.
   * @remarks
   * RAM cost: 2 GB
   *
   * Get the specified equipment type.
   *
   * @param equipName - Name of equipment.
   * @returns Type of the equipment.
   */
  getEquipmentType(equipName: string): string;

  /**
   * Get stats of an equipment.
   * @remarks
   * RAM cost: 2 GB
   *
   * Get the specified equipment stats.
   *
   * @param equipName - Name of equipment.
   * @returns A dictionary containing the stats of the equipment.
   */
  getEquipmentStats(equipName: string): EquipmentStats;

  /**
   * Purchase an equipment for a gang member.
   * @remarks
   * RAM cost: 4 GB
   *
   * Attempt to purchase the specified Equipment/Augmentation for the specified Gang member.
   *
   * @param memberName - Name of Gang member to purchase the equipment for.
   * @param equipName - Name of Equipment/Augmentation to purchase.
   * @returns True if the equipment was successfully purchased. False otherwise
   */
  purchaseEquipment(memberName: string, equipName: string): boolean;

  /**
   * Ascend a gang member.
   * @remarks
   * RAM cost: 4 GB
   *
   * Ascend the specified Gang Member.
   *
   * @param memberName - Name of member to ascend.
   * @returns Object with info about the ascension results.
   */
  ascendMember(memberName: string): GangMemberAscension;

  /**
   * Enable/Disable territory warfare.
   * @remarks
   * RAM cost: 2 GB
   *
   * Set whether or not the gang should engage in territory warfare
   *
   * @param engage - Whether or not to engage in territory warfare.
   */
  setTerritoryWarfare(engage: boolean): void;

  /**
   * Get chance to win clash with other gang.
   * @remarks
   * RAM cost: 4 GB
   *
   * Returns the chance you have to win a clash with the specified gang. The chance is returned in decimal form, not percentage
   *
   * @param gangName - Target gang
   * @returns Chance you have to win a clash with the specified gang.
   */
  getChanceToWinClash(gangName: string): number;

  /**
   * Get bonus time.
   * @remarks
   * RAM cost: 0 GB
   *
   * Returns the amount of accumulated “bonus time” (seconds) for the Gang mechanic.
   *
   * “Bonus time” is accumulated when the game is offline or if the game is inactive in the browser.
   *
   * “Bonus time” makes the game progress faster, up to 10x the normal speed.
   *
   * @returns Bonus time for the Gang mechanic in milliseconds.
   */
  getBonusTime(): number;
}

/**
 * Sleeve API
 * @remarks
 * If you are not in BitNode-10, then you must have Source-File 10 in order to use this API.
 * @public
 */
export interface Sleeve {
  /**
   * Get the number of sleeves you own.
   * @remarks
   * RAM cost: 4 GB
   *
   * Return the number of duplicate sleeves the player has.
   *
   * @returns number of duplicate sleeves the player has.
   */
  getNumSleeves(): number;

  /**
   * Get the stats of a sleeve.
   * @remarks
   * RAM cost: 4 GB
   *
   * Return a structure containing the stats of the sleeve.
   *
   * @param sleeveNumber - Index of the sleeve to get stats of.
   * @returns Object containing the stats of the sleeve.
   */
  getSleeveStats(sleeveNumber: number): SleeveSkills;

  /**
   * Get information about a sleeve.
   * @remarks
   * RAM cost: 4 GB
   *
   * Return a struct containing tons of information about this sleeve
   *
   * @param sleeveNumber - Index of the sleeve to retrieve information.
   * @returns Object containing tons of information about this sleeve.
   */
  getInformation(sleeveNumber: number): SleeveInformation;

  /**
   * Get task of a sleeve.
   * @remarks
   * RAM cost: 4 GB
   *
   * Return the current task that the sleeve is performing. type is set to “Idle” if the sleeve isn’t doing anything.
   *
   * @param sleeveNumber - Index of the sleeve to retrieve task from.
   * @returns Object containing information the current task that the sleeve is performing.
   */
  getTask(sleeveNumber: number): SleeveTask;

  /**
   * Set a sleeve to shock recovery.
   * @remarks
   * RAM cost: 4 GB
   *
   * Return a boolean indicating whether or not this action was set successfully.
   *
   * @param sleeveNumber - Index of the sleeve to start recovery.
   * @returns True if this action was set successfully, false otherwise.
   */
  setToShockRecovery(sleeveNumber: number): boolean;

  /**
   * Set a sleeve to synchronize.
   * @remarks
   * RAM cost: 4 GB
   *
   * Return a boolean indicating whether or not this action was set successfully.
   *
   * @param sleeveNumber - Index of the sleeve to start synchronizing.
   * @returns True if this action was set successfully, false otherwise.
   */
  setToSynchronize(sleeveNumber: number): boolean;

  /**
   * Set a sleeve to commit crime.
   * @remarks
   * RAM cost: 4 GB
   *
   * Return a boolean indicating whether or not this action was set successfully.
   *
   * Returns false if an invalid action is specified.
   *
   * @param sleeveNumber - Index of the sleeve to start commiting crime.
   * @param name - Name of the crime. Must be an exact match.
   * @returns True if this action was set successfully, false otherwise.
   */
  setToCommitCrime(sleeveNumber: number, name: string): boolean;

  /**
   * Set a sleeve to work for a faction.
   * @remarks
   * RAM cost: 4 GB
   *
   * Return a boolean indicating whether or not the sleeve started working or this faction.
   *
   * @param sleeveNumber - Index of the sleeve to work for the faction.
   * @param factionName - Name of the faction to work for.
   * @param factionWorkType - Name of the action to perform for this faction.
   * @returns True if the sleeve started working on this faction, false otherwise.
   */
  setToFactionWork(sleeveNumber: number, factionName: string, factionWorkType: string): boolean;

  /**
   * Set a sleeve to work for a company.
   * @remarks
   * RAM cost: 4 GB
   *
   * Return a boolean indicating whether or not the sleeve started working or this company.
   *
   * @param sleeveNumber - Index of the sleeve to work for the company.
   * @param companyName - Name of the company to work for.
   * @returns True if the sleeve started working on this company, false otherwise.
   */
  setToCompanyWork(sleeveNumber: number, companyName: string): boolean;

  /**
   * Set a sleeve to take a class at a university.
   * @remarks
   * RAM cost: 4 GB
   *
   * Return a boolean indicating whether or not this action was set successfully.
   *
   * @param sleeveNumber - Index of the sleeve to start taking class.
   * @param university - Name of the university to attend.
   * @param className - Name of the class to follow.
   * @returns True if this action was set successfully, false otherwise.
   */
  setToUniversityCourse(sleeveNumber: number, university: string, className: string): boolean;

  /**
   * Set a sleeve to workout at the gym.
   * @remarks
   * RAM cost: 4 GB
   *
   * Return a boolean indicating whether or not the sleeve started working out.
   *
   * @param sleeveNumber - Index of the sleeve to workout at the gym.
   * @param gymName - Name of the gym.
   * @param stat - Name of the stat to train.
   * @returns True if the sleeve started working out, false otherwise.
   */
  setToGymWorkout(sleeveNumber: number, gymName: string, stat: string): boolean;

  /**
   * Make a sleeve travel to another city.
   * @remarks
   * RAM cost: 4 GB
   *
   * Return a boolean indicating whether or not the sleeve reached destination.
   *
   * @param sleeveNumber - Index of the sleeve to travel.
   * @param cityName - Name of the destination city.
   * @returns True if the sleeve reached destination, false otherwise.
   */
  travel(sleeveNumber: number, cityName: string): boolean;

  /**
   * Get augmentations installed on a sleeve.
   * @remarks
   * RAM cost: 4 GB
   *
   * Return a list of augmentation names that this sleeve has installed.
   *
   * @param sleeveNumber - Index of the sleeve to retrieve augmentations from.
   * @returns List of augmentation names that this sleeve has installed.
   */
  getSleeveAugmentations(sleeveNumber: number): string[];

  /**
   * List purchasable augs for a sleeve.
   * @remarks
   * RAM cost: 4 GB
   *
   * Return a list of augmentations that the player can buy for this sleeve.
   *
   * @param sleeveNumber - Index of the sleeve to retrieve purchasable augmentations from.
   * @returns List of augmentations that the player can buy for this sleeve.
   */
  getSleevePurchasableAugs(sleeveNumber: number): AugmentPair[];

  /**
   * Purchase an aug for a sleeve.
   * @remarks
   * RAM cost: 4 GB
   *
   * Return true if the aug was purchased and installed on the sleeve.
   *
   * @param sleeveNumber - Index of the sleeve to buy an aug for.
   * @param augName - Name of the aug to buy. Must be an exact match.
   * @returns True if the aug was purchased and installed on the sleeve, false otherwise.
   */
  purchaseSleeveAug(sleeveNumber: number, augName: string): boolean;
}

interface SkillsFormulas {
  calculateSkill(exp: number, mult?: number): number;
  calculateExp(skill: number, mult?: number): number;
}

interface HackingFormulas {
  hackChance(server: number, player: number): number;
  hackExp(server: number, player: number): number;
  hackPercent(server: number, player: number): number;
  growPercent(server: number, threads: number, player: number, cores?: number): number;
  hackTime(server: number, player: number): number;
  growTime(server: number, player: number): number;
  weakenTime(server: number, player: number): number;
}

interface HacknetNodesFormulas {
  moneyGainRate(level: number, ram: number, cores: number, mult?: number): number;
  levelUpgradeCost(startingLevel: number, extraLevels?: number, costMult?: number): number;
  ramUpgradeCost(startingRam: number, extraLevels?: number, costMult?: number): number;
  coreUpgradeCost(startingCore: number, extraCores?: number, costMult?: number): number;
  hacknetNodeCost(n: number, mult: number): number;
  constants(): number;
}

interface HacknetServersFormulas {
  hashGainRate(level: number, ramUsed: number, maxRam: number, cores: number, mult?: number): number;
  levelUpgradeCost(startingLevel: number, extraLevels?: number, costMult?: number): number;
  ramUpgradeCost(startingRam: number, extraLevels?: number, costMult?: number): number;
  coreUpgradeCost(startingCore: number, extraCores?: number, costMult?: number): number;
  cacheUpgradeCost(startingCache: number, extraCache?: number): number;
  hashUpgradeCost(upgName: number, level: number): number;
  hacknetServerCost(n: number, mult: number): number;
  constants(): any;
}

export interface Formulas {
  skills: SkillsFormulas;
  hacking: HackingFormulas;
  hacknetNodes: HacknetNodesFormulas;
  hacknetServers: HacknetServersFormulas;
}

/**
 * Collection of all functions passed to scripts
 * @public
 */
export interface NS extends Singularity {
  /**
   * Namespace for hacknet functions.
   * @remarks RAM cost: 4 GB
   */
  readonly hacknet: Hacknet;
  /**
   *
   * Namespace for bladeburner functions.
   * @remarks RAM cost: 0 GB
   */
  readonly bladeburner: Bladeburner;
  /**
   *
   * Namespace for codingcontract functions.
   * @remarks RAM cost: 0 GB
   */
  readonly codingcontract: CodingContract;
  /**
   *
   * Namespace for gang functions.
   * @remarks RAM cost: 0 GB
   */
  readonly gang: Gang;
  /**
   *
   * Namespace for sleeve functions.
   * @remarks RAM cost: 0 GB
   */
  readonly sleeve: Sleeve;
  /**
   *
   * Namespace for stock functions.
   * @remarks
   * RAM cost: 0 GB
   */
  readonly stock: TIX;

  /**
   *
   * Namespace for formulas functions.
   * @remarks
   * RAM cost: 0 GB
   */
  readonly formulas: Formulas;

  /**
   * Arguments passed into the script.
   *
   * @remarks
   * RAM cost: 0 GB
   *
   * Arguments passed into a script can be accessed using a normal
   * array using the [] operator (args[0], args[1], etc…).
   *
   * It is also possible to get the number of arguments that was passed into a script using: 'args.length'
   * WARNING: Do not try to modify the args array. This will break the game.
   */
  readonly args: (string | number)[];

  /**
   * Steal a servers money.
   * @remarks
   * RAM cost: 0.1 GB
   *
   * Function that is used to try and hack servers to steal money and gain hacking experience.
   * The runtime for this command depends on your hacking level and the target server’s
   * security level. In order to hack a server you must first gain root access to that server
   * and also have the required hacking level.
   *
   * A script can hack a server from anywhere. It does not need to be running on the same
   * server to hack that server. For example, you can create a script that hacks the `foodnstuff`
   * server and run that script on any server in the game.
   *
   * A successful `hack()` on a server will raise that server’s security level by 0.002.
   *
   * @example
   * ```ts
   * hack("foodnstuff");
   * hack("foodnstuff", { threads: 5 }); // Only use 5 threads to hack
   * ```
   * @param host - Hostname of the target server to hack.
   * @param opts - Optional parameters for configuring function behavior.
   * @returns The amount of money stolen if the hack is successful, and zero otherwise.
   */
  hack(host: string, opts?: BasicHGWOptions): Promise<number>;

  /**
   * Spoof money in a servers bank account, increasing the amount available.
   * @remarks
   * RAM cost: 0.15 GB
   *
   * Use your hacking skills to increase the amount of money available on a server.
   * The runtime for this command depends on your hacking level and the target server’s
   * security level. When `grow` completes, the money available on a target server will
   * be increased by a certain, fixed percentage. This percentage is determined by the
   * target server’s growth rate (which varies between servers) and security level. Generally,
   * higher-level servers have higher growth rates. The getServerGrowth() function can be used
   * to obtain a server’s growth rate.
   *
   * Like hack, `grow` can be called on any server, regardless of where the script is running.
   * The grow() command requires root access to the target server, but there is no required hacking
   * level to run the command. It also raises the security level of the target server by 0.004.
   *
   * @example
   * ```ts
   * grow("foodnstuff");
   * grow("foodnstuff", { threads: 5 }); // Only use 5 threads to grow
   * ```
   * @param host - Hostname of the target server to grow.
   * @param opts - Optional parameters for configuring function behavior.
   * @returns The number by which the money on the server was multiplied for the growth.
   */
  grow(host: string, opts?: BasicHGWOptions): Promise<number>;

  /**
   * Reduce a server security level.
   * @remarks
   * RAM cost: 0.15 GB
   *
   * Use your hacking skills to attack a server’s security, lowering the server’s security level.
   * The runtime for this command depends on your hacking level and the target server’s security
   * level. This function lowers the security level of the target server by 0.05.
   *
   * Like hack and grow, `weaken` can be called on any server, regardless of
   * where the script is running. This command requires root access to the target server, but
   * there is no required hacking level to run the command.
   *
   * @example
   * ```ts
   * weaken("foodnstuff");
   * weaken("foodnstuff", { threads: 5 }); // Only use 5 threads to weaken
   * ```
   * @param host - Hostname of the target server to weaken.
   * @param opts - Optional parameters for configuring function behavior.
   * @returns The amount by which the target server’s security level was decreased. This is equivalent to 0.05 multiplied by the number of script threads.
   */
  weaken(host: string, opts?: BasicHGWOptions): Promise<number>;

  /**
   * Predict the effect of weaken.
   * @remarks
   * RAM cost: 1 GB
   *
   * Returns the security decrease that would occur if a weaken with this many threads happened.
   *
   * @param threads - Amount of threads that will be used.
   * @param cores - Optional. The number of cores of the server that would run weaken.
   * @returns The security decrease.
   */
  weakenAnalyze(threads: number, cores?: number): number;

  /**
   * Predict the effect of hack.
   * @remarks
   * RAM cost: 1 GB
   *
   * This function returns the number of script threads you need when running the hack command
   * to steal the specified amount of money from the target server.
   * If hackAmount is less than zero or greater than the amount of money available on the server,
   * then this function returns -1.
   *
   * Warning: The value returned by this function isn’t necessarily a whole number.
   *
   * @example
   * ```ts
   * //For example, let’s say the foodnstuff server has $10m and you run:
   * hackAnalyzeThreads("foodnstuff", 1e6);
   * //If this function returns 50, this means that if your next hack call is run on a script with 50 threads, it will steal $1m from the foodnstuff server.
   * ```
   * @param host - Hostname of the target server to analyze.
   * @param hackAmount - Amount of money you want to hack from the server.
   * @returns The number of threads needed to hack the server for hackAmount money.
   */
  hackAnalyzeThreads(host: string, hackAmount: number): number;

  /**
   * Get the percent of money stolen with a single thread.
   * @remarks
   * RAM cost: 1 GB
   *
   * Returns the percentage of the specified server’s money you will steal with a single hack.
   * This value is returned in percentage form, not decimal
   * (Netscript functions typically return in decimal form, but not this one).
   *
   * @example
   * ```ts
   * //For example, assume the following returns 1:
   * hackAnalyzePercent("foodnstuff");
   * //This means that if hack the foodnstuff server, then you will steal 1% of its total money. If you hack using N threads, then you will steal N% of its total money.
   * ```
   * @param host - Hostname of the target server.
   * @returns The percentage of money you will steal from the target server with a single hack.
   */
  hackAnalyzePercent(host: string): number;

  /**
   * Get the security increase for a number of thread.
   * @remarks
   * RAM cost: 1 GB
   *
   * Returns the security increase that would occur if a hack with this many threads happened.
   *
   * @param threads - Amount of threads that will be used.
   * @returns The security increase.
   */
  hackAnalyzeSecurity(threads: number): number;

  /**
   * Get the chance of successfully hacking a server.
   * @remarks
   * RAM cost: 1 GB
   *
   * Returns the chance you have of successfully hacking the specified server.
   *
   * This returned value is in decimal form, not percentage.
   *
   * @param host - Hostname of the target server.
   * @returns The chance you have of successfully hacking the target server.
   */
  hackChance(host: string): number;

  /**
   * Calculate the number of grow thread needed to grow a server by a certain multiplier.
   * @remarks
   * RAM cost: 1 GB
   *
   * This function returns the number of “growths” needed in order to increase
   * the amount of money available on the specified server by the specified amount.
   * The specified amount is multiplicative and is in decimal form, not percentage.
   *
   * Warning: The value returned by this function isn’t necessarily a whole number.
   *
   * @example
   * ```ts
   * //For example, if you want to determine how many grow calls you need to double the amount of money on foodnstuff, you would use:
   * growthAnalyze("foodnstuff", 2);
   * //If this returns 100, then this means you need to call grow 100 times in order to double the money (or once with 100 threads).
   * ```
   * @param host - Hostname of the target server.
   * @param growthAmount - Multiplicative factor by which the server is grown. Decimal form..
   * @returns The amount of grow calls needed to grow the specified server by the specified amount
   */
  growthAnalyze(host: string, growthAmount: number): number;

  /**
   * Calculate the security increase for a number of thread.
   * @remarks
   * RAM cost: 1 GB
   *
   * Returns the security increase that would occur if a grow with this many threads happened.
   *
   * @param threads - Amount of threads that will be used.
   * @returns The security increase.
   */
  growthAnalyzeSecurity(threads: number): number;

  /**
   * Suspends the script for n milliseconds.
   * @remarks
   * RAM cost: 0 GB
   *
   * @param millis - Number of milliseconds to sleep.
   * @returns
   */
  sleep(millis: number): Promise<void>;

  /**
   * Prints a value or a variable to the script’s logs.
   * @remarks
   * RAM cost: 0 GB
   *
   * @param msg - Value to be printed.
   */
  print(msg: any): void;

  /**
   * Prints a value or a variable to the Terminal.
   * @remarks
   * RAM cost: 0 GB
   *
   * @param msg - Value to be printed.
   */
  tprint(msg: any): void;

  /**
   * Clears the script’s logs.
   * @remarks
   * RAM cost: 0 GB
   */
  clearLog(): void;

  /**
   * Disables logging for the given function.
   * @remarks
   * RAM cost: 0 GB
   *
   * Logging can be disabled for all functions by passing `ALL` as the argument.
   *
   * Note that this does not completely remove all logging functionality.
   * This only stops a function from logging when the function is successful.
   * If the function fails, it will still log the reason for failure.
   *
   * Notable functions that cannot have their logs disabled: run,
   * exec, exit.
   *
   * @param fn - Name of function for which to disable logging.
   */
  disableLog(fn: string): void;

  /**
   * Enable logging for a certain function.
   * @remarks
   * RAM cost: 0 GB
   *
   * Re-enables logging for the given function. If `ALL` is passed into this
   * function as an argument, then it will revert the effects of disableLog(`ALL`).
   *
   * @param fn - Name of function for which to enable logging.
   */
  enableLog(fn: string): void;

  /**
   * Checks the status of the logging for the given function.
   * @remarks
   * RAM cost: 0 GB
   *
   * @param fn - Name of function to check.
   * @returns Returns a boolean indicating whether or not logging is enabled for that function (or `ALL`)
   */
  isLogEnabled(fn: string): boolean;

  /**
   * Get all the logs of a script.
   * @remarks
   * RAM cost: 0 GB
   *
   * Returns a script’s logs. The logs are returned as an array, where each line is an element in the array.
   * The most recently logged line is at the end of the array.
   * Note that there is a maximum number of lines that a script stores in its logs. This is configurable in the game’s options.
   * If the function is called with no arguments, it will return the current script’s logs.
   *
   * Otherwise, the fn, hostname/ip, and args… arguments can be used to get the logs from another script.
   * Remember that scripts are uniquely identified by both their names and arguments.
   *
   * @example
   * ```ts
   * //Get logs from foo.script on the current server that was run with no args
   * getScriptLogs("foo.script");
   * ```
   * @example
   * ```ts
   * //Open logs from foo.script on the foodnstuff server that was run with no args
   * getScriptLogs("foo.script", "foodnstuff");
   * ```
   * @example
   * ```ts
   * //Open logs from foo.script on the foodnstuff server that was run with the arguments [1, "test"]
   * getScriptLogs("foo.script", "foodnstuff", 1, "test");
   * ```
   * @param fn - Optional. Filename of script to get logs from.
   * @param host - Optional. Hostname of the server that the script is on.
   * @param args - Arguments to identify which scripts to get logs for.
   * @returns Returns an string array, where each line is an element in the array. The most recently logged line is at the end of the array.
   */
  getScriptLogs(fn?: string, host?: string, ...args: any[]): string[];

  /**
   * Open the tail window of a script.
   * @remarks
   * RAM cost: 0 GB
   *
   * Opens a script’s logs. This is functionally the same as the tail Terminal command.
   *
   * If the function is called with no arguments, it will open the current script’s logs.
   *
   * Otherwise, the fn, hostname/ip, and args… arguments can be used to get the logs from another script.
   * Remember that scripts are uniquely identified by both their names and arguments.
   *
   * @example
   * ```ts
   * //Open logs from foo.script on the current server that was run with no args
   * tail("foo.script");
   * ```
   * @example
   * ```ts
   * //Get logs from foo.script on the foodnstuff server that was run with no args
   * tail("foo.script", "foodnstuff");
   * ```
   * @example
   * ```ts
   * //Get logs from foo.script on the foodnstuff server that was run with the arguments [1, "test"]
   * tail("foo.script", "foodnstuff", 1, "test");
   * ```
   * @param fn - Optional. Filename of the script being tailed. If omitted, the current script is tailed.
   * @param host - Optional. Hostname of the script being tailed. Defaults to the server this script is running on. If args are specified, this is not optional.
   * @param args - Arguments for the script being tailed.
   */
  tail(fn?: string, host?: string, ...args: any[]): void;

  /**
   * Get the list servers connected to a server.
   * @remarks
   * RAM cost: 0.2 GB
   *
   * Returns an array containing the hostnames or IPs of all servers that are one
   * node way from the specified target server. The hostnames/IPs in the returned
   * array are strings.
   *
   * @param host - Hostname of the server to scan.
   * @param hostnames - Optional boolean specifying whether the function should output hostnames (if true) or IP addresses (if false).
   * @returns Returns an string of hostnames or IP.
   */
  scan(host: string, hostnames?: boolean): string[];

  /**
   * Runs NUKE.exe on a server.
   * @remarks
   * RAM cost: 0.05 GB
   *
   * Runs the NUKE.exe program on the target server. NUKE.exe must exist on your home computer.
   *
   * @example
   * ```ts
   * nuke("foodnstuff");
   * ```
   * @param host - Hostname of the target server.
   */
  nuke(host: string): void;

  /**
   * Runs BruteSSH.exe on a server.
   * @remarks
   * RAM cost: 0.05 GB
   *
   * Runs the BruteSSH.exe program on the target server. BruteSSH.exe must exist on your home computer.
   *
   * @example
   * ```ts
   * brutessh("foodnstuff");
   * ```
   * @param host - Hostname of the target server.
   */
  brutessh(host: string): void;

  /**
   * Runs FTPCrack.exe on a server.
   * @remarks
   * RAM cost: 0.05 GB
   *
   * Runs the FTPCrack.exe program on the target server. FTPCrack.exe must exist on your home computer.
   *
   * @example
   * ```ts
   * ftpcrack("foodnstuff");
   * ```
   * @param host - Hostname of the target server.
   */
  ftpcrack(host: string): void;

  /**
   * Runs relaySMTP.exe on a server.
   * @remarks
   * RAM cost: 0.05 GB
   *
   * Runs the relaySMTP.exe program on the target server. relaySMTP.exe must exist on your home computer.
   *
   * @example
   * ```ts
   * relaysmtp("foodnstuff");
   * ```
   * @param host - Hostname of the target server.
   */
  relaysmtp(host: string): void;

  /**
   * Runs HTTPWorm.exe on a server.
   * @remarks
   * RAM cost: 0.05 GB
   *
   * Runs the HTTPWorm.exe program on the target server. HTTPWorm.exe must exist on your home computer.
   *
   * @example
   * ```ts
   * httpworm("foodnstuff");
   * ```
   * @param host - Hostname of the target server.
   */
  httpworm(host: string): void;

  /**
   * Runs SQLInject.exe on a server.
   * @remarks
   * RAM cost: 0.05 GB
   *
   * Runs the SQLInject.exe program on the target server. SQLInject.exe must exist on your home computer.
   *
   * @example
   * ```ts
   * sqlinject("foodnstuff");
   * ```
   * @remarks RAM cost: 0.05 GB
   * @param host - Hostname of the target server.
   */
  sqlinject(host: string): void;

  /**
   * Start another script on the current server.
   * @remarks
   * RAM cost: 1 GB
   *
   * Run a script as a separate process. This function can only be used to run scripts located on the
   * current server (the server running the script that calls this function). Requires a significant
   * amount of RAM to run this command.
   *
   * If the script was successfully started, then this functions returns the PID of that script.
   * Otherwise, it returns 0.
   *
   * PID stands for Process ID. The PID is a unique identifier for each script.
   * The PID will always be a positive integer.
   *
   * Running this function with a numThreads argument of 0 will return 0 without running the script.
   * However, running this function with a negative numThreads argument will cause a runtime error.
   *
   * @example
   * ```ts
   * //The simplest way to use the run command is to call it with just the script name. The following example will run ‘foo.script’ single-threaded with no arguments:
   * run("foo.script");
   * ```
   * @example
   * ```ts
   * //The following example will run ‘foo.script’ but with 5 threads instead of single-threaded:
   * run("foo.script", 5);
   * ```
   * @example
   * ```ts
   * //This next example will run ‘foo.script’ single-threaded, and will pass the string ‘foodnstuff’ into the script as an argument:
   * run("foo.script", 1, 'foodnstuff');
   * ```
   * @param script - Filename of script to run.
   * @param numThreads - Optional thread count for new script. Set to 1 by default. Will be rounded to nearest integer.
   * @param args - Additional arguments to pass into the new script that is being run. Note that if any arguments are being passed into the new script, then the second argument numThreads must be filled in with a value.
   * @returns Returns the PID of a successfully started script, and 0 otherwise.
   */
  run(script: string, numThreads?: number, ...args: string[]): number;

  /**
   * Start another script on any server.
   * @remarks
   * RAM cost: 1.3 GB
   *
   * Run a script as a separate process on a specified server. This is similar to the run function
   * except that it can be used to run a script on any server, instead of just the current server.
   *
   * If the script was successfully started, then this functions returns the PID of that script.
   * Otherwise, it returns 0.
   *
   * PID stands for Process ID. The PID is a unique identifier for each script.
   * The PID will always be a positive integer.
   *
   * Running this function with a numThreads argument of 0 will return 0 without running the script.
   * However, running this function with a negative numThreads argument will cause a runtime error.
   *
   * @example
   * ```ts
   * //The simplest way to use the exec command is to call it with just the script name and the target server. The following example will try to run generic-hack.script on the foodnstuff server:
   * exec("generic-hack.script", "foodnstuff");
   * ```
   * @example
   * ```ts
   * //The following example will try to run the script generic-hack.script on the joesguns server with 10 threads:
   * exec("generic-hack.script", "joesguns", 10);
   * ```
   * @example
   * ```ts
   * //This last example will try to run the script foo.script on the foodnstuff server with 5 threads. It will also pass the number 1 and the string “test” in as arguments to the script:
   * exec("foo.script", "foodnstuff", 5, 1, "test");
   * ```
   * @param script - Filename of script to execute.
   * @param host - Hostname of the `target server` on which to execute the script.
   * @param numThreads - Optional thread count for new script. Set to 1 by default. Will be rounded to nearest integer.
   * @param args - Additional arguments to pass into the new script that is being run. Note that if any arguments are being passed into the new script, then the third argument numThreads must be filled in with a value.
   * @returns Returns the PID of a successfully started script, and 0 otherwise.
   */
  exec(script: string, host: string, numThreads?: number, ...args: string[]): number;

  /**
   * Terminate current script and start another in 10s.
   * @remarks
   * RAM cost: 2 GB
   *
   * Terminates the current script, and then after a delay of about 10 seconds it will execute the
   * newly-specified script. The purpose of this function is to execute a new script without being
   * constrained by the RAM usage of the current one. This function can only be used to run scripts
   * on the local server.
   *
   * Because this function immediately terminates the script, it does not have a return value.
   *
   * @example
   * ```ts
   * //The following example will execute the script ‘foo.script’ with 10 threads and the arguments ‘foodnstuff’ and 90:
   * spawn('foo.script', 10, 'foodnstuff', 90);
   * ```
   * @param script - Filename of script to execute.
   * @param numThreads - Number of threads to spawn new script with. Will be rounded to nearest integer.
   * @param args - Additional arguments to pass into the new script that is being run.
   */
  spawn(script: string, numThreads?: number, ...args: string[]): void;

  /**
   * Terminate another script.
   * @remarks
   * RAM cost: 0.5 GB
   *
   * Kills the script on the target server specified by the script’s name and arguments.
   * Remember that scripts are uniquely identified by both their name and arguments.
   * For example, if `foo.script` is run with the argument 1, then this is not the same as
   * `foo.script` run with the argument 2, even though they have the same code.
   *
   * @example
   * ```ts
   * //The following example will try to kill a script named foo.script on the foodnstuff server that was ran with no arguments:
   * kill("foo.script", "foodnstuff");
   * ```
   * @example
   * ```ts
   * //The following will try to kill a script named foo.script on the current server that was ran with no arguments:
   * kill("foo.script", getHostname());
   * ```
   * @example
   * ```ts
   * //The following will try to kill a script named foo.script on the current server that was ran with the arguments 1 and “foodnstuff”:
   * kill("foo.script", getHostname(), 1, "foodnstuff");
   * ```
   * @param script - Filename of the script to kill
   * @param host - Hostname of the server on which to kill the script.
   * @param args - Arguments to identify which script to kill.
   * @returns True if the script is successfully killed, and false otherwise.
   */
  kill(script: string, host: string, ...args: string[]): boolean;

  /**
   * Terminate another script.
   * @remarks
   * RAM cost: 0.5 GB
   *
   * Kills the script with the specified PID.
   * Killing a script by its PID will typically have better performance,
   * especially if you have many scripts running.
   * If this function successfully kills the specified script, then it will return true.
   * Otherwise, it will return false.
   *
   * @example
   * ```ts
   * if (kill(10)) {
   *     print("Killed script with PID 10!");
   * }
   * ```
   * @param scriptPid - PID of the script to kill
   * @returns True if the script is successfully killed, and false otherwise.
   */
  kill(scriptPid: number): boolean;

  /**
   * Terminate all scripts on a server.
   * @remarks
   * RAM cost: 0.5 GB
   *
   * Kills all running scripts on the specified server. This function returns true
   * if any scripts were killed, and false otherwise. In other words, it will return
   * true if there are any scripts running on the target server.
   *
   * @param host - IP or hostname of the server on which to kill all scripts.
   * @returns True if any scripts were killed, and false otherwise.
   */
  killall(host: string): boolean;

  /**
   * Terminates the current script immediately.
   * @remarks
   * RAM cost: 0 GB
   */
  exit(): void;

  /**
   * Copy file between servers.
   * @remarks
   * RAM cost: 0.6 GB
   *
   * Copies a script or literature (.lit) file(s) to another server. The files argument can be either a string
   * specifying a single file to copy, or an array of strings specifying multiple files to copy.
   *
   * @example
   * ```ts
   * //Copies hack-template.script from the current server to foodnstuff:
   * scp("hack-template.script", "foodnstuff");
   * ```
   * @param files - Filename or an array of filenames of script/literature files to copy.
   * @param destination - Host of the destination server, which is the server to which the file will be copied.
   * @returns True if the script/literature file is successfully copied over and false otherwise. If the files argument is an array then this function will return true if at least one of the files in the array is successfully copied.
   */
  scp(files: string[], destination: string): boolean;

  /**
   * Copy file between servers.
   * @remarks
   * RAM cost: 0.6 GB
   *
   * Copies a script or literature (.lit) file(s) to another server. The files argument can be either a string
   * specifying a single file to copy, or an array of strings specifying multiple files to copy.
   *
   * @example
   * ```ts
   * //Copies foo.lit from the helios server to the home computer:
   * scp("foo.lit", "helios", "home");
   * ```
   * @example
   * ```ts
   * //Tries to copy three files from rothman-uni to home computer:
   * files = ["foo1.lit", "foo2.script", "foo3.script"];
   * scp(files, "rothman-uni", "home");
   * ```
   * @param files - Filename or an array of filenames of script/literature files to copy.
   * @param source - Host of the source server, which is the server from which the file will be copied. This argument is optional and if it’s omitted the source will be the current server.
   * @param destination - Host of the destination server, which is the server to which the file will be copied.
   * @returns True if the script/literature file is successfully copied over and false otherwise. If the files argument is an array then this function will return true if at least one of the files in the array is successfully copied.
   */
  scp(
    files: string[],
    source: string,
    // tslint:disable-next-line:unified-signatures
    destination: string,
  ): boolean;

  /**
   * List files on a server.
   * @remarks
   * RAM cost: 0.2 GB
   *
   * Returns an array with the filenames of all files on the specified server
   * (as strings). The returned array is sorted in alphabetic order.
   *
   * @param host - Host of the target server.
   * @param grep - A substring to search for in the filename.
   * @returns Array with the filenames of all files on the specified server.
   */
  ls(host: string, grep?: string): string[];

  /**
   * List running scripts on a server.
   * @remarks
   * RAM cost: 0.2 GB
   *
   * Returns an array with general information about all scripts running on the specified target server.
   *
   * @example
   * ```ts
   * //(using NetscriptJS (Netscript 2.0))
   * export async function main(ns) {
   *    const ps = ns.ps("home");
   *    for (let i = 0; i < ps.length; ++i) {
   *        ns.tprint(ps[i].filename + ' ' + ps[i].threads);
   *        ns.tprint(ps[i].args);
   *    }
   * }
   * ```
   * @param host - Host address of the target server. If not specified, it will be the current server’s IP by default.
   * @returns Array with general information about all scripts running on the specified target server.
   */
  ps(host?: string): ProcessInfo[];

  /**
   * Check if your have root access on a server.
   * @remarks
   * RAM cost: 0.05 GB
   *
   * Returns a boolean indicating whether or not the player has root access to the specified target server.
   *
   * @example
   * ```ts
   * if (hasRootAccess("foodnstuff") == false) {
   *    nuke("foodnstuff");
   * }
   * ```
   * @param host - Host of the target server
   * @returns True if player has root access to the specified target server, and false otherwise.
   */
  hasRootAccess(host: string): boolean;

  /**
   * Returns a string with the hostname of the server that the script is running on.
   *
   * @remarks
   * RAM cost: 0.05 GB
   * @returns Hostname of the server that the script is on.
   */
  getHostname(): string;

  /**
   * Returns the player’s current hacking level.
   *
   * @remarks
   * RAM cost: 0.05 GB
   * @returns Player’s current hacking level
   */
  getHackingLevel(): number;

  /**
   * Get hacking related multipliers.
   * @remarks
   * RAM cost: 4 GB
   *
   * Returns an object containing the Player’s hacking related multipliers.
   * These multipliers are returned in fractional forms, not percentages
   * (e.g. 1.5 instead of 150%).
   *
   * @example
   * ```ts
   * //Example of how this can be used:
   * mults = getHackingMultipliers();
   * print(mults.chance);
   * print(mults.growth);
   * ```
   * @returns Object containing the Player’s hacking related multipliers.
   */
  getHackingMultipliers(): HackingMultipliers;

  /**
   * Get hacknet related multipliers.
   * @remarks
   * RAM cost: 4 GB
   *
   * Returns an object containing the Player’s hacknet related multipliers.
   * These multipliers are returned in fractional forms, not percentages
   * (e.g. 1.5 instead of 150%).
   *
   * @example
   * ```ts
   * //Example of how this can be used:
   * mults = getHacknetMultipliers();
   * print(mults.production);
   * print(mults.purchaseCost);
   * ```
   * @returns Object containing the Player’s hacknet related multipliers.
   */
  getHacknetMultipliers(): HacknetMultipliers;

  /**
   * Returns a server object for the given server. Defaults to the running script's server if host is not specified.
   *
   * @remarks
   * RAM cost: 2 GB
   * @param host - Optional. Hostname for the requested server object.
   * @returns The requested server object.
   */
  getServer(host?: string): Server;

  /**
   * Get money available on a server.
   * @remarks
   * RAM cost: 0.1 GB
   *
   * Returns the amount of money available on a server.
   * Running this function on the home computer will return the player’s money.
   *
   * @example
   * ```ts
   * getServerMoneyAvailable("foodnstuff");
   * getServerMoneyAvailable("home"); //Returns player's money
   * ```
   * @param host - Host of target server
   * @returns Amount of money available on the server.
   */
  getServerMoneyAvailable(host: string): number;

  /**
   * Get maximum money available on a server.
   * @remarks
   * RAM cost: 0.1 GB
   *
   * Returns the maximum amount of money that can be available on a server.
   *
   * @param host - Host of target server.
   * @returns Maximum amount of money available on the server.
   */
  getServerMaxMoney(host: string): number;

  /**
   * Get a server growth parameter.
   * @remarks
   * RAM cost: 0.1 GB
   *
   * Returns the server’s instrinsic “growth parameter”. This growth
   * parameter is a number between 1 and 100 that represents how
   * quickly the server’s money grows. This parameter affects the
   * percentage by which the server’s money is increased when using the
   * grow function. A higher growth parameter will result in a
   * higher percentage increase from grow.
   *
   * @param host - Host of target server.
   * @returns Parameter that affects the percentage by which the server’s money is increased when using the grow function.
   */
  getServerGrowth(host: string): number;

  /**
   * Get server security level.
   * @remarks
   * RAM cost: 0.1 GB
   *
   * Returns the security level of the target server. A server’s security
   * level is denoted by a number, typically between 1 and 100
   * (but it can go above 100).
   *
   * @param host - Host of target server.
   * @returns Security level of the target server.
   */
  getServerSecurityLevel(host: string): number;

  /**
   * Returns the minimum security level of the target server.
   *
   * @remarks RAM cost: 0.1 GB
   * @param host - Host of target server.
   * @returns Minimum security level of the target server.
   */
  getServerMinSecurityLevel(host: string): number;

  /**
   * Returns the required hacking level of the target server.
   *
   * @remarks RAM cost: 0.1 GB
   * @param host - Host of target server.
   * @returns The required hacking level of the target server.
   */
  getServerRequiredHackingLevel(host: string): number;

  /**
   * Returns the number of open ports required to successfully run NUKE.exe on the specified server.
   *
   * @remarks RAM cost: 0.1 GB
   * @param host - Host of target server.
   * @returns The number of open ports required to successfully run NUKE.exe on the specified server.
   */
  getServerNumPortsRequired(host: string): number;

  /**
   * Returns a boolean denoting whether or not the specified server exists.
   *
   * @remarks RAM cost: 0.1 GB
   * @param host - Host of target server.
   * @returns True if specified server exists, and false otherwise.
   */
  serverExists(host: string): boolean;

  /**
   * Check if a file exists.
   * @remarks
   * RAM cost: 0.1 GB
   *
   * Returns a boolean indicating whether the specified file exists on the target server.
   * The filename for scripts is case-sensitive, but for other types of files it is not.
   * For example, fileExists(“brutessh.exe”) will work fine, even though the actual program
   * is named 'BruteSSH.exe'.
   *
   * If the hostname/ip argument is omitted, then the function will search through the current
   * server (the server running the script that calls this function) for the file.
   *
   * @example
   * ```ts
   * //The function call will return true if the script named foo.script exists on the foodnstuff server, and false otherwise.
   * fileExists("foo.script", "foodnstuff");
   * ```
   * @example
   * ```ts
   * //The function call will return true if the current server contains the FTPCrack.exe program, and false otherwise.
   * fileExists("ftpcrack.exe");
   * ```
   * @param filename - Filename of file to check.
   * @param host - Host of target server. This is optional. If it is not specified then the function will use the current server as the target server.
   * @returns True if specified file exists, and false otherwise.
   */
  fileExists(filename: string, host?: string): boolean;

  /**
   * Check if a script is running.
   * @remarks
   * RAM cost: 0.1 GB
   *
   * Returns a boolean indicating whether the specified script is running on the target server.
   * Remember that a script is uniquely identified by both its name and its arguments.
   *
   * @example
   * ```ts
   * //The function call will return true if there is a script named foo.script with no arguments running on the foodnstuff server, and false otherwise:
   * isRunning("foo.script", "foodnstuff");
   * ```
   * @example
   * ```ts
   * //The function call will return true if there is a script named foo.script with no arguments running on the current server, and false otherwise:
   * isRunning("foo.script", getHostname());
   * ```
   * @example
   * ```ts
   * //The function call will return true if there is a script named foo.script running with the arguments 1, 5, and “test” (in that order) on the joesguns server, and false otherwise:
   * isRunning("foo.script", "joesguns", 1, 5, "test");
   * ```
   * @param script - Filename of script to check. This is case-sensitive.
   * @param host - Host of target server.
   * @param args - Arguments to specify/identify which scripts to search for.
   * @returns True if specified script is running on the target server, and false otherwise.
   */
  isRunning(script: string, host: string, ...args: string[]): boolean;

  /**
   * Get cost of purchasing a server.
   * @remarks
   * RAM cost: 0.25 GB
   *
   * Returns the cost to purchase a server with the specified amount of ram.
   *
   * @example
   * ```ts
   * for (i = 1; i <= 20; i++) {
   *     tprint(i + " -- " + getPurchasedServerCost(Math.pow(2, i)));
   * }
   * ```
   * @param ram - Amount of RAM of a potential purchased server. Must be a power of 2 (2, 4, 8, 16, etc.). Maximum value of 1048576 (2^20).
   * @returns The cost to purchase a server with the specified amount of ram.
   */
  getPurchasedServerCost(ram: number): number;

  /**
   * Purchase a server.
   * @remarks
   * 2.25 GB
   *
   * Purchased a server with the specified hostname and amount of RAM.
   *
   * The hostname argument can be any data type, but it will be converted to a string
   * and have whitespace removed. Anything that resolves to an empty string will cause
   * the function to fail. If there is already a server with the specified hostname,
   * then the function will automatically append a number at the end of the hostname
   * argument value until it finds a unique hostname. For example, if the script calls
   * `purchaseServer(“foo”, 4)` but a server named “foo” already exists, the it will
   * automatically change the hostname to `foo-0`. If there is already a server with the
   * hostname `foo-0`, then it will change the hostname to `foo-1`, and so on.
   *
   * Note that there is a maximum limit to the amount of servers you can purchase.
   *
   * Returns the hostname of the newly purchased server as a string. If the function
   * fails to purchase a server, then it will return an empty string. The function will
   * fail if the arguments passed in are invalid, if the player does not have enough
   * money to purchase the specified server, or if the player has exceeded the maximum
   * amount of servers.
   *
   * @example
   * ```ts
   * ram = 64;
   * hn = "pserv-";
   * for (i = 0; i < 5; ++i) {
   *    purchaseServer(hn + i, ram);
   * }
   * ```
   * @param hostname - Host of the purchased server.
   * @param ram - Amount of RAM of the purchased server. Must be a power of 2 (2, 4, 8, 16, etc.). Maximum value of 1048576 (2^20).
   * @returns The hostname of the newly purchased server.
   */
  purchaseServer(hostname: string, ram: number): string;

  /**
   * Delete a purchased server.
   * @remarks
   * 2.25 GB
   *
   * Deletes one of your purchased servers, which is specified by its hostname.
   *
   * The hostname argument can be any data type, but it will be converted to a string.
   * Whitespace is automatically removed from the string. This function will not delete a
   * server that still has scripts running on it.
   *
   * @param host - Host of the server to delete.
   * @returns True if successful, and false otherwise.
   */
  deleteServer(host: string): boolean;

  /**
   * Returns an array with either the hostnames or IPs of all of the servers you have purchased.
   *
   * @remarks 2.25 GB
   * @param hostnameMode - Optional. Defaults to true. Returns hostnames if true, and IPs if false.
   * @returns Returns an array with either the hostnames or IPs of all of the servers you have purchased.
   */
  getPurchasedServers(hostnameMode?: boolean): string[];

  /**
   * Returns the maximum number of servers you can purchase.
   *
   * @remarks RAM cost: 0.05 GB
   * @returns Returns the maximum number of servers you can purchase.
   */
  getPurchasedServerLimit(): number;

  /**
   * Returns the maximum RAM that a purchased server can have.
   *
   * @remarks RAM cost: 0.05 GB
   * @returns Returns the maximum RAM that a purchased server can have.
   */
  getPurchasedServerMaxRam(): number;

  /**
   * Write data to a file.
   * @remarks
   * RAM cost: 1 GB
   *
   * This function can be used to either write data to a port or to a text file (.txt).
   *
   * If the first argument is a number between 1 and 20, then it specifies a port and this
   * function will write data to that port. The third argument, mode, is not used when writing
   * to a port.
   *
   * If the first argument is a string, then it specifies the name of a text file (.txt) and
   * this function will write data to that text file. If the specified text file does not exist,
   * then it will be created. The third argument mode, defines how the data will be written to
   * the text file. If *mode is set to “w”, then the data is written in “write” mode which means
   * that it will overwrite all existing data on the text file. If mode is set to any other value
   * then the data will be written in “append” mode which means that the data will be added at the
   * end of the text file.
   *
   * @param handle - Port or text file that will be written to.
   * @param data - Data to write.
   * @param mode - Defines the write mode. Only valid when writing to text files.
   */
  write(handle: string | number, data?: string[] | number, mode?: "w" | "a"): void;

  /**
   * Attempt to write to a port.
   * @remarks
   * RAM cost: 1 GB
   *
   * Attempts to write data to the specified Netscript Port.
   * If the port is full, the data will not be written.
   * Otherwise, the data will be written normally.
   *
   * @param port - Port or text file that will be written to.
   * @param data - Data to write.
   * @returns True if the data is successfully written to the port, and false otherwise.
   */
  tryWrite(port: number, data: string[] | number): boolean;

  /**
   * Read content of a file.
   * @remarks
   * RAM cost: 1 GB
   *
   * This function is used to read data from a port or from a text file (.txt).
   *
   * If the argument port/fn is a number between 1 and 20, then it specifies a
   * port and it will read data from that port. A port is a serialized queue.
   * This function will remove the first element from that queue and return it.
   * If the queue is empty, then the string “NULL PORT DATA” will be returned.
   *
   * If the argument port/fn is a string, then it specifies the name of a text
   * file (.txt) and this function will return the data in the specified text
   * file. If the text file does not exist, an empty string will be returned.
   *
   * @param handle - Port or text file to read from.
   * @returns Data in the specified text file or port.
   */
  read(handle: string | number): string | number | object;

  /**
   * Get a copy of the data from a port without popping it.
   * @remarks
   * RAM cost: 1 GB
   *
   * This function is used to peek at the data from a port. It returns the
   * first element in the specified port without removing that element. If
   * the port is empty, the string “NULL PORT DATA” will be returned.
   *
   * @param port - Port to peek. Must be an integer between 1 and 20.
   * @returns Data in the specified port.
   */
  peek(port: number): string | number | object;

  /**
   * Clear data from a port.
   * @remarks
   * RAM cost: 0 GB
   *
   * This function is used to clear data in a Netscript Ports or a text file.
   *
   * If the port/fn argument is a number between 1 and 20, then it specifies a
   * port and will clear it (deleting all data from the underlying queue).
   *
   * If the port/fn argument is a string, then it specifies the name of a
   * text file (.txt) and will delete all data from that text file.
   *
   * @param handle - Port or text file to clear.
   */
  clear(handle: string | number): void;

  /**
   * Get all data on a port.
   * @remarks
   * RAM cost: 0 GB
   *
   * Get a handle to a Netscript Port.
   *
   * WARNING: Port Handles only work in NetscriptJS (Netscript 2.0). They will not work in Netscript 1.0.
   *
   * @see https://bitburner.readthedocs.io/en/latest/netscript/netscriptmisc.html#netscript-ports
   * @param port - Port number. Must be an integer between 1 and 20.
   * @returns Data in the specified port.
   */
  getPortHandle(port: number): any[];

  /**
   * Delete a file.
   * @remarks
   * RAM cost: 1 GB
   *
   * Removes the specified file from the current server. This function works for every file
   * type except message (.msg) files.
   *
   * @param name - Filename of file to remove. Must include the extension.
   * @param host - Host Address of the server on which to delete the file. Optional. Defaults to current server.
   * @returns True if it successfully deletes the file, and false otherwise.
   */
  rm(name: string, host?: string): boolean;

  /**
   * Check if any script with a filename is running.
   * @remarks
   * RAM cost: 1 GB
   *
   * Returns a boolean indicating whether any instance of the specified script is running
   * on the target server, regardless of its arguments.
   *
   * This is different than the isRunning function because it does not try to
   * identify a specific instance of a running script by its arguments.
   *
   * @example
   * ```ts
   * //The function call will return true if there is any script named foo.script running on the foodnstuff server, and false otherwise:
   * scriptRunning("foo.script", "foodnstuff");
   * ```
   * @example
   * ```ts
   * //The function call will return true if there is any script named “foo.script” running on the current server, and false otherwise:
   * scriptRunning("foo.script", getHostname());
   * ```
   * @param script - Filename of script to check. This is case-sensitive.
   * @param host - Host of target server.
   * @returns True if the specified script is running, and false otherwise.
   */
  scriptRunning(script: string, host: string): boolean;

  /**
   * Kill all scripts with a filename.
   * @remarks
   * RAM cost: 1 GB
   *
   * Kills all scripts with the specified filename on the target server specified by hostname,
   * regardless of arguments.
   *
   * @param script - Filename of script to kill. This is case-sensitive.
   * @param host - Host of target server.
   * @returns true if one or more scripts were successfully killed, and false if none were.
   */
  scriptKill(script: string, host: string): boolean;

  /**
   * Returns the current script name.
   *
   * @remarks RAM cost: 0 GB
   * @returns Current script name.
   */
  getScriptName(): string;

  /**
   * Get the ram cost of a script.
   * @remarks
   * RAM cost: 0.1 GB
   *
   * Returns the amount of RAM required to run the specified script on the target server.
   * Returns 0 if the script does not exist.
   *
   * @param script - Filename of script. This is case-sensitive.
   * @param host - Host of target server the script is located on. This is optional, If it is not specified then the function will se the current server as the target server.
   * @returns Amount of RAM required to run the specified script on the target server, and 0 if the script does not exist.
   */
  getScriptRam(script: string, host?: string): number;

  /**
   * Get the execution time of a hack() call.
   * @remarks
   * RAM cost: 0.05 GB
   *
   * Returns the amount of time in milliseconds it takes to execute the hack Netscript function on the target server.
   * The function takes in an optional hackLvl parameter that can be specified to see what the hack time would be at different hacking levels.
   *
   * @param host - Host of target server.
   * @param hackLvl - Optional hacking level for the calculation. Defaults to player’s current hacking level.
   * @param intLvl - Optional intelligence level for the calculation. Defaults to player’s current intelligence level. (Intelligence is unlocked after obtaining Source-File 5).
   * @returns Returns the amount of time in milliseconds it takes to execute the hack Netscript function. Returns Infinity if called on a Hacknet Server.
   */
  getHackTime(host: string): number;

  /**
   * Get the execution time of a grow() call.
   * @remarks
   * RAM cost: 0.05 GB
   *
   * Returns the amount of time in seconds it takes to execute the grow Netscript function on the target server.
   * The function takes in an optional hackLvl parameter that can be specified to see what the grow time would be at different hacking levels.
   *
   * @param host - Host of target server.
   * @param hackLvl - Optional hacking level for the calculation. Defaults to player’s current hacking level.
   * @param intLvl - Optional intelligence level for the calculation. Defaults to player’s current intelligence level. (Intelligence is unlocked after obtaining Source-File 5).
   * @returns Returns the amount of time in seconds it takes to execute the grow Netscript function. Returns Infinity if called on a Hacknet Server.
   */
  getGrowTime(host: string): number;

  /**
   * Get the execution time of a weaken() call.
   * @remarks
   * RAM cost: 0.05 GB
   *
   * Returns the amount of time in seconds it takes to execute the weaken() Netscript function on the target server.
   * The function takes in an optional hackLvl parameter that can be specified to see what the weaken time would be at different hacking levels.
   *
   * @param host - Host of target server.
   * @param hackLvl - Optional hacking level for the calculation. Defaults to player’s current hacking level.
   * @param intLvl - Optional intelligence level for the calculation. Defaults to player’s current intelligence level. (Intelligence is unlocked after obtaining Source-File 5).
   * @returns Returns the amount of time in seconds it takes to execute the grow Netscript function. Returns Infinity if called on a Hacknet Server.
   */
  getWeakenTime(host: string): number;

  /**
   * Get the income of a script.
   * @remarks
   * RAM cost: 0.1 GB
   *
   * Returns the amount of income the specified script generates while online
   * (when the game is open, does not apply for offline income). Remember that
   * a script is uniquely identified by both its name and its arguments. So for
   * example if you ran a script with the arguments “foodnstuff” and “5” then
   * in order to use this function to get that script’s income you must specify
   * those same arguments in the same order in this function call.
   *
   * This function can also be called with no arguments.
   * If called with no arguments, then this function will return an array of two values.
   * The first value is the total income (dollar / second) of all of your active scripts
   * (scripts that are currently running on any server).
   * The second value is the total income (dollar / second) that you’ve earned from scripts
   * since you last installed Augmentations.
   *
   * @param script - Filename of script.
   * @param host - Server on which script is running.
   * @param args - Arguments that the script is running with.
   * @returns Amount of income the specified script generates while online.
   */
  getScriptIncome(script: string, host: string, ...args: string[]): number | [number, number];

  /**
   * Get the exp gain of a script.
   * @remarks
   * RAM cost: 0.1 GB
   *
   * Returns the amount of hacking experience the specified script generates while online
   * (when the game is open, does not apply for offline experience gains). Remember that a
   * script is uniquely identified by both its name and its arguments.
   *
   * This function can also return the total experience gain rate of all of your active
   * scripts by running the function with no arguments.
   *
   * @param script - Filename of script.
   * @param host - Server on which script is running.
   * @param args - Arguments that the script is running with.
   * @returns Amount of hacking experience the specified script generates while online.
   */
  getScriptExpGain(script: string, host: string, ...args: string[]): number;

  /**
   * Returns the amount of time in milliseconds that have passed since you last installed Augmentations.
   *
   * @remarks RAM cost: 0.05 GB
   * @returns Time in milliseconds that have passed since you last installed Augmentations.
   */
  getTimeSinceLastAug(): number;

  /**
   * Format a string.
   *
   * @remarks
   * RAM cost: 0 GB
   *
   * see: https://github.com/alexei/sprintf.js
   * @param format - String to format.
   * @param args - Formating arguments.
   * @returns Formated text.
   */
  sprintf(format: string, ...args: string[]): string;

  /**
   * Format a string with an array of arguments.
   * @remarks
   * RAM cost: 0 GB
   *
   * see: https://github.com/alexei/sprintf.js
   * @param format - String to format.
   * @param args - Formating arguments.
   * @returns Formated text.
   */
  vsprintf(format: string, args: string[]): string;

  /**
   * Format a number
   * @remarks
   * RAM cost: 0 GB
   *
   * Converts a number into a string with the specified formatter.
   * This uses the numeraljs library, so the formatters must be compatible with that.
   * This is the same function that the game itself uses to display numbers.
   *
   * see: http://numeraljs.com/
   * @param n - Number to format.
   * @param format - Formatter.
   * @returns Formated number.
   */
  nFormat(n: number, format: string): number;

  /**
   * Prompt the player with a Yes/No modal.
   * @remarks
   * RAM cost: 0 GB
   *
   * Prompts the player with a dialog box with two options: “Yes” and “No”.
   * This function will return true if the player click “Yes” and false if
   * the player clicks “No”. The script’s execution is halted until the player
   * selects one of the options.
   *
   * @param txt - Text to appear in the prompt dialog box.
   * @returns True if the player click “Yes” and false if the player clicks “No”.
   */
  prompt(txt: string): Promise<boolean>;

  /**
   * Download a file from the internet.
   * @remarks
   * RAM cost: 0 GB
   *
   * Retrieves data from a URL and downloads it to a file on the specified server.
   * The data can only be downloaded to a script (.script, .ns, .js) or a text file (.txt).
   * If the file already exists, it will be overwritten by this command.
   * Note that it will not be possible to download data from many websites because they
   * do not allow cross-origin resource sharing (CORS).
   *
   * IMPORTANT: This is an asynchronous function that returns a Promise.
   * The Promise’s resolved value will be a boolean indicating whether or not the data was
   * successfully retrieved from the URL. Because the function is async and returns a Promise,
   * it is recommended you use wget in NetscriptJS (Netscript 2.0).
   *
   * In NetscriptJS, you must preface any call to wget with the await keyword (like you would hack or sleep).
   * wget will still work in Netscript 1.0, but the functions execution will not be synchronous
   * (i.e. it may not execute when you expect/want it to).
   * Furthermore, since Promises are not supported in ES5,
   * you will not be able to process the returned value of wget in Netscript 1.0.
   *
   * @example
   * ```ts
   * wget("https://raw.githubusercontent.com/danielyxie/bitburner/master/README.md", "game_readme.txt");
   * ```
   * @param url - URL to pull data from.
   * @param target - Filename to write data to. Must be script or text file.
   * @param host - Optional hostname/ip of server for target file.
   * @returns True if the data was successfully retrieved from the URL, false otherwise.
   */
  wget(url: string, target: string, host?: string): Promise<boolean>;

  /**
   * Returns the amount of Faction favor required to be able to donate to a faction.
   *
   * @remarks RAM cost: 0.1 GB
   * @returns Amount of Faction favor required to be able to donate to a faction.
   */
  getFavorToDonate(): number;

  /**
   * Get the current Bitnode multipliers.
   * @remarks
   * RAM cost: 4 GB
   *
   * Returns an object containing the current BitNode multipliers.
   * This function requires Source-File 5 in order to run.
   * The multipliers are returned in decimal forms (e.g. 1.5 instead of 150%).
   * The multipliers represent the difference between the current BitNode and
   * the original BitNode (BitNode-1).
   *
   * For example, if the CrimeMoney multiplier has a value of 0.1, then that means
   * that committing crimes in the current BitNode will only give 10% of the money
   * you would have received in BitNode-1.
   *
   * @example
   * ```ts
   * mults = getBitNodeMultipliers();
   * print(mults.ServerMaxMoney);
   * print(mults.HackExpGain);
   * ```
   * @returns Object containing the current BitNode multipliers.
   */
  getBitNodeMultipliers(): BitNodeMultipliers;
}
