/* eslint-disable no-duplicate-imports */

declare module "ns" {
  /**
   * Object which identifies a script context. Used to call ns functions.
   * @public
   * @remarks
   * <b>Basic ns2 usage example:</b>
   * ```ts
   * // Basic ns functions are imported from the ns module
   * import {getHostname} from "ns";
   * // Some related functions are gathered under submodules
   * import {getPrice} from "ns/stock";
   *
   * export async function main(ns) {
   *  getHostname(ns);
   *  getPrice(ns);
   *  // Some functions need to be await ed
   *  await hack(ns, 'n00dles');
   * }
   * ```
   * {@link https://bitburner.readthedocs.io/en/latest/netscript/netscriptjs.html| ns2 in-game docs}
   * <hr>
   */
  export class NS {
    private constructor();
  }

  /**
   * Options to affect the behavior of {@link hack}, {@link grow}, and {@link weaken}.
   * @public
   */
  export interface BasicHGWOptions {
    /** Number of threads to use for this function. Must be less than or equal to the number of threads the script is running with. */
    threads?: number;
    /** Set to true this action will affect the stock market. */
    stock?: boolean;
  }

  /**
   * @public
   */
  export type FilenameOrPID = number | string;

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
    /** Process ID */
    pid: number;
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

    /** Flag indicating whether this is a purchased server */
    purchasedByPlayer: boolean;

    /** Flag indicating whether this server has a backdoor installed by a player */
    backdoorInstalled: boolean;

    /**
     * Initial server security level
     * (i.e. security level when the server was created)
     */
    baseDifficulty: number;

    /** Server Security Level */
    hackDifficulty: number;

    /** Minimum server security level that this server can be weakened to */
    minDifficulty: number;

    /** How much money currently resides on the server and can be hacked */
    moneyAvailable: number;

    /** Maximum amount of money that this server can hold */
    moneyMax: number;

    /** Number of open ports required in order to gain admin/root access */
    numOpenPortsRequired: number;

    /** How many ports are currently opened on the server */
    openPortCount: number;

    /** Hacking level required to hack this server */
    requiredHackingSkill: number;

    /**
     * Parameter that affects how effectively this server's money can
     * be increased using the grow() Netscript function
     */
    serverGrowth: number;
  }

  /**
   * @public
   */
  export interface RunningScript {
    args: string[];
    filename: string;
    logs: string[];
    offlineExpGained: number;
    offlineMoneyMade: number;
    offlineRunningTime: number;
    onlineExpGained: number;
    onlineMoneyMade: number;
    onlineRunningTime: number;
    pid: number;
    ramUsage: number;
    server: string;
    threads: number;
  }

  /**
   * Object representing a port. A port is a serialized queue.
   * @public
   */
  export interface NetscriptPort {
    /**
     * Write data to a port.
     * @remarks
     * RAM cost: 0 GB
     *
     * @returns The data popped off the queue if it was full.
     */
    write(value: string | number): null | string | number;

    /**
     * Attempt to write data to the port.
     * @remarks
     * RAM cost: 0 GB
     *
     * @returns True if the data was added to the port, false if the port was full
     */
    tryWrite(value: string | number): boolean;

    /**
     * Shift an element out of the port.
     * @remarks
     * RAM cost: 0 GB
     *
     * This function will remove the first element from the port and return it.
     * If the port is empty, then the string “NULL PORT DATA” will be returned.
     * @returns the data read.
     */
    read(): string | number;

    /**
     * Retrieve the first element from the port without removing it.
     * @remarks
     * RAM cost: 0 GB
     *
     * This function is used to peek at the data from a port. It returns the
     * first element in the specified port without removing that element. If
     * the port is empty, the string “NULL PORT DATA” will be returned.
     * @returns the data read
     */
    peek(): string | number;

    /**
     * Check if the port is full.
     * @remarks
     * RAM cost: 0 GB
     *
     * @returns true if the port is full, otherwise false
     */
    full(): boolean;

    /**
     * Check if the port is empty.
     * @remarks
     * RAM cost: 0 GB
     *
     * @returns true if the port is empty, otherwise false
     */
    empty(): boolean;

    /**
     * Empties all data from the port.
     * @remarks
     * RAM cost: 0 GB
     */
    clear(): void;
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
    /** Influences the respect gain and money gain of your gang. */
    GangSoftcap: number;
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
    /** Influences cost of any purchased server at or above 128GB */
    PurchasedServerSoftCap: number;
    /** Influences the minimum favor the player must have with a faction before they can donate to gain rep. */
    RepToDonateToFaction: number;
    /** Influences how much the money on a server can be reduced when a script performs a hack against it. */
    ScriptHackMoney: number;
    /** Influences how much of the money stolen by a scripted hack will be added to the player's money. */
    ScriptHackMoneyGain: number;
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
    /** Influences the power of the gift */
    StaneksGiftPowerMultiplier: number;
    /** Influences the size of the gift */
    StaneksGiftExtraSize: number;
    /** Influences the hacking skill required to backdoor the world daemon. */
    WorldDaemonDifficulty: number;
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
   * @public
   */
  export interface Player {
    hacking: number;
    hp: number;
    max_hp: number;
    strength: number;
    defense: number;
    dexterity: number;
    agility: number;
    charisma: number;
    intelligence: number;
    hacking_chance_mult: number;
    hacking_speed_mult: number;
    hacking_money_mult: number;
    hacking_grow_mult: number;
    hacking_exp: number;
    strength_exp: number;
    defense_exp: number;
    dexterity_exp: number;
    agility_exp: number;
    charisma_exp: number;
    hacking_mult: number;
    strength_mult: number;
    defense_mult: number;
    dexterity_mult: number;
    agility_mult: number;
    charisma_mult: number;
    hacking_exp_mult: number;
    strength_exp_mult: number;
    defense_exp_mult: number;
    dexterity_exp_mult: number;
    agility_exp_mult: number;
    charisma_exp_mult: number;
    company_rep_mult: number;
    faction_rep_mult: number;
    numPeopleKilled: number;
    money: number;
    city: string;
    location: string;
    companyName: string;
    crime_money_mult: number;
    crime_success_mult: number;
    isWorking: boolean;
    workType: string;
    currentWorkFactionName: string;
    currentWorkFactionDescription: string;
    workHackExpGainRate: number;
    workStrExpGainRate: number;
    workDefExpGainRate: number;
    workDexExpGainRate: number;
    workAgiExpGainRate: number;
    workChaExpGainRate: number;
    workRepGainRate: number;
    workMoneyGainRate: number;
    workMoneyLossRate: number;
    workHackExpGained: number;
    workStrExpGained: number;
    workDefExpGained: number;
    workDexExpGained: number;
    workAgiExpGained: number;
    workChaExpGained: number;
    workRepGained: number;
    workMoneyGained: number;
    createProgramName: string;
    createProgramReqLvl: number;
    className: string;
    crimeType: string;
    work_money_mult: number;
    hacknet_node_money_mult: number;
    hacknet_node_purchase_cost_mult: number;
    hacknet_node_ram_cost_mult: number;
    hacknet_node_core_cost_mult: number;
    hacknet_node_level_cost_mult: number;
    hasWseAccount: boolean;
    hasTixApiAccess: boolean;
    has4SData: boolean;
    has4SDataTixApi: boolean;
    bladeburner_max_stamina_mult: number;
    bladeburner_stamina_gain_mult: number;
    bladeburner_analysis_mult: number;
    bladeburner_success_chance_mult: number;
    bitNodeN: number;
    totalPlaytime: number;
    playtimeSinceLastAug: number;
    playtimeSinceLastBitnode: number;
    jobs: any;
    factions: string[];
    tor: boolean;
    hasCorporation: boolean;
  }

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
   *
   * @param ns - NS instance passed to the main function.
   */
  export function getArgs(ns: NS): (string | number | boolean)[];

  /**
   * Steal a servers money.
   * @remarks
   * RAM cost: 0.1 GB
   *
   * Function that is used to try and hack servers to steal money and gain hacking experience.
   * The runtime for this command depends on your hacking level and the target server’s
   * security level when this function is called. In order to hack a server you must first gain root access to that server
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
   * // NS2:
   * let earnedMoney = await hack(ns, "foodnstuff");
   * earnedMoney += await hack(ns, "foodnstuff", { threads: 5 }); // Only use 5 threads to hack
   * ```
   * @param ns - NS instance passed to the main function.
   * @param host - Hostname of the target server to hack.
   * @param opts - Optional parameters for configuring function behavior.
   * @returns The amount of money stolen if the hack is successful, and zero otherwise.
   */
  export function hack(ns: NS, host: string, opts?: BasicHGWOptions): Promise<number>;

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
   * // NS2:
   * let availableMoney = getServerMoneyAvailable(ns, "foodnstuff");
   * currentMoney *= (1 + await grow(ns, "foodnstuff"));
   * currentMoney *= (1 + await grow(ns, "foodnstuff", { threads: 5 })); // Only use 5 threads to grow
   * ```
   * @param ns - NS instance passed to the main function.
   * @param host - Hostname of the target server to grow.
   * @param opts - Optional parameters for configuring function behavior.
   * @returns The number by which the money on the server was multiplied for the growth.
   */
  export function grow(ns: NS, host: string, opts?: BasicHGWOptions): Promise<number>;

  /**
   * Reduce a server security level.
   * @remarks
   * RAM cost: 0.15 GB
   *
   * Use your hacking skills to attack a server’s security, lowering the server’s security level.
   * The runtime for this command depends on your hacking level and the target server’s security
   * level when this function is called. This function lowers the security level of the target server by 0.05.
   *
   * Like hack and grow, `weaken` can be called on any server, regardless of
   * where the script is running. This command requires root access to the target server, but
   * there is no required hacking level to run the command.
   *
   * @example
   * ```ts
   * // NS2:
   * let currentSecurity = getServerSecurityLevel(ns, "foodnstuff");
   * currentSecurity -= await weaken(ns, "foodnstuff");
   * currentSecurity -= await weaken(ns, "foodnstuff", { threads: 5 }); // Only use 5 threads to weaken
   * ```
   * @param ns - NS instance passed to the main function.
   * @param host - Hostname of the target server to weaken.
   * @param opts - Optional parameters for configuring function behavior.
   * @returns The amount by which the target server’s security level was decreased. This is equivalent to 0.05 multiplied by the number of script threads.
   */
  export function weaken(ns: NS, host: string, opts?: BasicHGWOptions): Promise<number>;

  /**
   * Predict the effect of weaken.
   * @remarks
   * RAM cost: 1 GB
   *
   * Returns the security decrease that would occur if a weaken with this many threads happened.
   *
   * @param ns - NS instance passed to the main function.
   * @param threads - Amount of threads that will be used.
   * @param cores - Optional. The number of cores of the server that would run weaken.
   * @returns The security decrease.
   */
  export function weakenAnalyze(ns: NS, threads: number, cores?: number): number;

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
   * @param ns - NS instance passed to the main function.
   * @param host - Hostname of the target server to analyze.
   * @param hackAmount - Amount of money you want to hack from the server.
   * @returns The number of threads needed to hack the server for hackAmount money.
   */
  export function hackAnalyzeThreads(ns: NS, host: string, hackAmount: number): number;

  /**
   * Get the part of money stolen with a single thread.
   * @remarks
   * RAM cost: 1 GB
   *
   * Returns the part of the specified server’s money you will steal with a single thread hack.
   *
   * @example
   * ```ts
   * // NS2:
   * //For example, assume the following returns 0.01:
   * const hackAmount = hackAnalyze(ns, "foodnstuff");
   * //This means that if hack the foodnstuff server using a single thread, then you will steal 1%, or 0.01 of its total money. If you hack using N threads, then you will steal N*0.01 times its total money.
   * ```
   * @param ns - NS instance passed to the main function.
   * @param host - Hostname of the target server.
   * @returns The part of money you will steal from the target server with a single thread hack.
   */
  export function hackAnalyze(ns: NS, host: string): number;

  /**
   * Get the security increase for a number of thread.
   * @remarks
   * RAM cost: 1 GB
   *
   * Returns the security increase that would occur if a hack with this many threads happened.
   *
   * @param ns - NS instance passed to the main function.
   * @param threads - Amount of threads that will be used.
   * @returns The security increase.
   */
  export function hackAnalyzeSecurity(ns: NS, threads: number): number;

  /**
   * Get the chance of successfully hacking a server.
   * @remarks
   * RAM cost: 1 GB
   *
   * Returns the chance you have of successfully hacking the specified server.
   *
   * This returned value is in decimal form, not percentage.
   *
   * @param ns - NS instance passed to the main function.
   * @param host - Hostname of the target server.
   * @returns The chance you have of successfully hacking the target server.
   */
  export function hackAnalyzeChance(ns: NS, host: string): number;

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
   * // NS2:
   * //For example, if you want to determine how many grow calls you need to double the amount of money on foodnstuff, you would use:
   * const growTimes = growthAnalyze(ns, "foodnstuff", 2);
   * //If this returns 100, then this means you need to call grow 100 times in order to double the money (or once with 100 threads).
   * ```
   * @param ns - NS instance passed to the main function.
   * @param host - Hostname of the target server.
   * @param growthAmount - Multiplicative factor by which the server is grown. Decimal form..
   * @returns The amount of grow calls needed to grow the specified server by the specified amount
   */
  export function growthAnalyze(ns: NS, host: string, growthAmount: number, cores?: number): number;

  /**
   * Calculate the security increase for a number of thread.
   * @remarks
   * RAM cost: 1 GB
   *
   * Returns the security increase that would occur if a grow with this many threads happened.
   *
   * @param ns - NS instance passed to the main function.
   * @param threads - Amount of threads that will be used.
   * @returns The security increase.
   */
  export function growthAnalyzeSecurity(ns: NS, threads: number): number;

  /**
   * Suspends the script for n milliseconds.
   * @remarks
   * RAM cost: 0 GB
   *
   * @param ns - NS instance passed to the main function.
   * @param millis - Number of milliseconds to sleep.
   * @example
   * ```ts
   * // NS2:
   * // This will count from 1 to 10 in your terminal, with one number every 5 seconds
   * for (var i=0; i<10; i++) {
   *   tprint(ns, i + 1);
   *   await sleep(ns, 5000);
   * }
   * ```
   * @returns
   */
  export function sleep(ns: NS, millis: number): Promise<void>;

  /**
   * Suspends the script for n milliseconds. Doesn't block with concurrent calls.
   * @remarks
   * RAM cost: 0 GB
   *
   * @param ns - NS instance passed to the main function.
   * @param millis - Number of milliseconds to sleep.
   * @returns
   */
  export function asleep(ns: NS, millis: number): Promise<void>;

  /**
   * Prints one or move values or variables to the script’s logs.
   * @remarks
   * RAM cost: 0 GB
   *
   * @param ns - NS instance passed to the main function.
   * @param args - Value(s) to be printed.
   */
  export function print(ns: NS, ...args: any[]): void;

  /**
   * Prints one or more values or variables to the Terminal.
   * @remarks
   * RAM cost: 0 GB
   *
   * @param ns - NS instance passed to the main function.
   * @param args - Value(s) to be printed.
   */
  export function tprint(ns: NS, ...args: any[]): void;

  /**
   * Prints a raw value or a variable to the Terminal.
   * @remarks
   * RAM cost: 0 GB
   *
   * @param ns - NS instance passed to the main function.
   * @param format - format of the message
   * @param values - Values to be printed.
   */
  export function tprintf(ns: NS, format: string, ...values: any[]): void;

  /**
   * Clears the script’s logs.
   * @remarks
   * RAM cost: 0 GB
   * @param ns - NS instance passed to the main function.
   */
  export function clearLog(ns: NS): void;

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
   * @param ns - NS instance passed to the main function.
   * @param fn - Name of function for which to disable logging.
   */
  export function disableLog(ns: NS, fn: string): void;

  /**
   * Enable logging for a certain function.
   * @remarks
   * RAM cost: 0 GB
   *
   * Re-enables logging for the given function. If `ALL` is passed into this
   * function as an argument, then it will revert the effects of disableLog(`ALL`).
   *
   * @param ns - NS instance passed to the main function.
   * @param fn - Name of function for which to enable logging.
   */
  export function enableLog(ns: NS, fn: string): void;

  /**
   * Checks the status of the logging for the given function.
   * @remarks
   * RAM cost: 0 GB
   *
   * @param ns - NS instance passed to the main function.
   * @param fn - Name of function to check.
   * @returns Returns a boolean indicating whether or not logging is enabled for that function (or `ALL`)
   */
  export function isLogEnabled(ns: NS, fn: string): boolean;

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
   * // NS2:
   * //Get logs from foo.script on the current server that was run with no args
   * getScriptLogs(ns, "foo.script");
   *
   * //Open logs from foo.script on the foodnstuff server that was run with no args
   * getScriptLogs(ns, "foo.script", "foodnstuff");
   *
   * //Open logs from foo.script on the foodnstuff server that was run with the arguments [1, "test"]
   * getScriptLogs(ns, "foo.script", "foodnstuff", 1, "test");
   * ```
   * @param ns - NS instance passed to the main function.
   * @param fn - Optional. Filename of script to get logs from.
   * @param host - Optional. Hostname of the server that the script is on.
   * @param args - Arguments to identify which scripts to get logs for.
   * @returns Returns an string array, where each line is an element in the array. The most recently logged line is at the end of the array.
   */
  export function getScriptLogs(ns: NS, fn?: string, host?: string, ...args: any[]): string[];

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
   * // NS2:
   * //Open logs from foo.script on the current server that was run with no args
   * tail(ns, "foo.script");
   *
   * //Get logs from foo.script on the foodnstuff server that was run with no args
   * tail(ns, "foo.script", "foodnstuff");
   *
   * //Get logs from foo.script on the foodnstuff server that was run with the arguments [1, "test"]
   * tail(ns, "foo.script", "foodnstuff", 1, "test");
   * ```
   * @param ns - NS instance passed to the main function.
   * @param fn - Optional. Filename or PID of the script being tailed. If omitted, the current script is tailed.
   * @param host - Optional. Hostname of the script being tailed. Defaults to the server this script is running on. If args are specified, this is not optional.
   * @param args - Arguments for the script being tailed.
   */
  export function tail(ns: NS, fn?: FilenameOrPID, host?: string, ...args: any[]): void;

  /**
   * Get the list of servers connected to a server.
   * @remarks
   * RAM cost: 0.2 GB
   *
   * Returns an array containing the hostnames of all servers that are one
   * node way from the specified target server. The hostnames in the returned
   * array are strings.
   *
   * @param ns - NS instance passed to the main function.
   * @param host - Optional, Hostname of the server to scan, default to current server.
   * @returns Returns an string of hostnames.
   */
  export function scan(ns: NS, host?: string): string[];

  /**
   * Runs NUKE.exe on a server.
   * @remarks
   * RAM cost: 0.05 GB
   *
   * Running NUKE.exe on a target server gives you root access which means you can executes scripts on said server. NUKE.exe must exist on your home computer.
   *
   * @example
   * ```ts
   * // NS2:
   * nuke(ns, "foodnstuff");
   * ```
   * @param ns - NS instance passed to the main function.
   * @param host - Hostname of the target server.
   */
  export function nuke(ns: NS, host: string): void;

  /**
   * Runs BruteSSH.exe on a server.
   * @remarks
   * RAM cost: 0.05 GB
   *
   * Runs the BruteSSH.exe program on the target server. BruteSSH.exe must exist on your home computer.
   *
   * @example
   * ```ts
   * // NS2:
   * brutessh(ns, "foodnstuff");
   * ```
   * @param ns - NS instance passed to the main function.
   * @param host - Hostname of the target server.
   */
  export function brutessh(ns: NS, host: string): void;

  /**
   * Runs FTPCrack.exe on a server.
   * @remarks
   * RAM cost: 0.05 GB
   *
   * Runs the FTPCrack.exe program on the target server. FTPCrack.exe must exist on your home computer.
   *
   * @example
   * ```ts
   * // NS2:
   * ftpcrack(ns, "foodnstuff");
   * ```
   * @param ns - NS instance passed to the main function.
   * @param host - Hostname of the target server.
   */
  export function ftpcrack(ns: NS, host: string): void;

  /**
   * Runs relaySMTP.exe on a server.
   * @remarks
   * RAM cost: 0.05 GB
   *
   * Runs the relaySMTP.exe program on the target server. relaySMTP.exe must exist on your home computer.
   *
   * @example
   * ```ts
   * // NS2:
   * relaysmtp(ns, "foodnstuff");
   * ```
   * @param ns - NS instance passed to the main function.
   * @param host - Hostname of the target server.
   */
  export function relaysmtp(ns: NS, host: string): void;

  /**
   * Runs HTTPWorm.exe on a server.
   * @remarks
   * RAM cost: 0.05 GB
   *
   * Runs the HTTPWorm.exe program on the target server. HTTPWorm.exe must exist on your home computer.
   *
   * @example
   * ```ts
   * // NS2:
   * httpworm(ns, "foodnstuff");
   * ```
   * @param ns - NS instance passed to the main function.
   * @param host - Hostname of the target server.
   */
  export function httpworm(ns: NS, host: string): void;

  /**
   * Runs SQLInject.exe on a server.
   * @remarks
   * RAM cost: 0.05 GB
   *
   * Runs the SQLInject.exe program on the target server. SQLInject.exe must exist on your home computer.
   *
   * @example
   * ```ts
   * // NS2:
   * sqlinject(ns, "foodnstuff");
   * ```
   * @remarks RAM cost: 0.05 GB
   * @param ns - NS instance passed to the main function.
   * @param host - Hostname of the target server.
   */
  export function sqlinject(ns: NS, host: string): void;

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
   * // NS2:
   * //The simplest way to use the run command is to call it with just the script name. The following example will run ‘foo.script’ single-threaded with no arguments:
   * run(ns, "foo.script");
   *
   * //The following example will run ‘foo.script’ but with 5 threads instead of single-threaded:
   * run(ns, "foo.script", 5);
   *
   * //This next example will run ‘foo.script’ single-threaded, and will pass the string ‘foodnstuff’ into the script as an argument:
   * run(ns, "foo.script", 1, 'foodnstuff');
   * ```
   * @param ns - NS instance passed to the main function.
   * @param script - Filename of script to run.
   * @param numThreads - Optional thread count for new script. Set to 1 by default. Will be rounded to nearest integer.
   * @param args - Additional arguments to pass into the new script that is being run. Note that if any arguments are being passed into the new script, then the second argument numThreads must be filled in with a value.
   * @returns Returns the PID of a successfully started script, and 0 otherwise.
   */
  export function run(ns: NS, script: string, numThreads?: number, ...args: Array<string | number | boolean>): number;

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
   * * @example
   * ```ts
   * // NS2:
   * //The simplest way to use the exec command is to call it with just the script name and the target server. The following example will try to run generic-hack.script on the foodnstuff server:
   * exec(ns, "generic-hack.script", "foodnstuff");
   *
   * //The following example will try to run the script generic-hack.script on the joesguns server with 10 threads:
   * exec(ns, "generic-hack.script", "joesguns", 10);
   *
   * //This last example will try to run the script foo.script on the foodnstuff server with 5 threads. It will also pass the number 1 and the string “test” in as arguments to the script:
   * exec(ns, "foo.script", "foodnstuff", 5, 1, "test");
   * ```
   * @param ns - NS instance passed to the main function.
   * @param script - Filename of script to execute.
   * @param host - Hostname of the `target server` on which to execute the script.
   * @param numThreads - Optional thread count for new script. Set to 1 by default. Will be rounded to nearest integer.
   * @param args - Additional arguments to pass into the new script that is being run. Note that if any arguments are being passed into the new script, then the third argument numThreads must be filled in with a value.
   * @returns Returns the PID of a successfully started script, and 0 otherwise.
   */
  export function exec(ns: NS, script: string, host: string, numThreads?: number, ...args: Array<string | number | boolean>): number;

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
   * // NS2:
   * //The following example will execute the script ‘foo.script’ with 10 threads and the arguments ‘foodnstuff’ and 90:
   * spawn(ns, 'foo.script', 10, 'foodnstuff', 90);
   * ```
   * @param ns - NS instance passed to the main function.
   * @param script - Filename of script to execute.
   * @param numThreads - Number of threads to spawn new script with. Will be rounded to nearest integer.
   * @param args - Additional arguments to pass into the new script that is being run.
   */
  export function spawn(ns: NS, script: string, numThreads?: number, ...args: string[]): void;

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
   * // NS2:
   * //The following example will try to kill a script named foo.script on the foodnstuff server that was ran with no arguments:
   * kill(ns, "foo.script", "foodnstuff");
   *
   * //The following will try to kill a script named foo.script on the current server that was ran with no arguments:
   * kill(ns, "foo.script", getHostname());
   *
   * //The following will try to kill a script named foo.script on the current server that was ran with the arguments 1 and “foodnstuff”:
   * kill(ns, "foo.script", getHostname(), 1, "foodnstuff");
   * ```
   * @param ns - NS instance passed to the main function.
   * @param script - Filename or pid of the script to kill
   * @param host - Hostname of the server on which to kill the script.
   * @param args - Arguments to identify which script to kill.
   * @returns True if the script is successfully killed, and false otherwise.
   */
  export function kill(ns: NS, script: number): boolean;
  export function kill(ns: NS, script: string, host: string, ...args: string[]): boolean;

  /**
   * Terminate all scripts on a server.
   * @remarks
   * RAM cost: 0.5 GB
   *
   * Kills all running scripts on the specified server. This function returns true
   * if any scripts were killed, and false otherwise. In other words, it will return
   * true if there are any scripts running on the target server.
   * If no host is defined, it will kill all scripts, where the script is running.
   *
   * @param ns - NS instance passed to the main function.
   * @param host - IP or hostname of the server on which to kill all scripts.
   * @returns True if any scripts were killed, and false otherwise.
   */
  export function killall(ns: NS, host?: string): boolean;

  /**
   * Terminates the current script immediately.
   * @remarks
   * RAM cost: 0 GB
   * @param ns - NS instance passed to the main function.
   */
  export function exit(ns: NS): void;

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
   * // NS2:
   * //Copies foo.lit from the helios server to the home computer:
   * await scp(ns, "foo.lit", "helios", "home");
   *
   * //Tries to copy three files from rothman-uni to home computer:
   * files = ["foo1.lit", "foo2.script", "foo3.script"];
   * await scp(ns, files, "rothman-uni", "home");
   * ```
   * @example
   * ```ts
   * //ns2, copies files from home to a target server
   * const server = getArgs(ns)[0];
   * const files = ["hack.js","weaken.js","grow.js"];
   * await scp(ns, files, "home", server);
   * ```
   * @param ns - NS instance passed to the main function.
   * @param files - Filename or an array of filenames of script/literature files to copy.
   * @param source - Host of the source server, which is the server from which the file will be copied. This argument is optional and if it’s omitted the source will be the current server.
   * @param destination - Host of the destination server, which is the server to which the file will be copied.
   * @returns True if the script/literature file is successfully copied over and false otherwise. If the files argument is an array then this function will return true if at least one of the files in the array is successfully copied.
   */
  export function scp(ns: NS, files: string | string[], destination: string): Promise<boolean>;
  export function scp(ns: NS, files: string | string[], source: string, destination: string): Promise<boolean>;

  /**
   * List files on a server.
   * @remarks
   * RAM cost: 0.2 GB
   *
   * Returns an array with the filenames of all files on the specified server
   * (as strings). The returned array is sorted in alphabetic order.
   *
   * @param ns - NS instance passed to the main function.
   * @param host - Host of the target server.
   * @param grep - A substring to search for in the filename.
   * @returns Array with the filenames of all files on the specified server.
   */
  export function ls(ns: NS, host: string, grep?: string): string[];

  /**
   * List running scripts on a server.
   * @remarks
   * RAM cost: 0.2 GB
   *
   * Returns an array with general information about all scripts running on the specified target server.
   *
   * @example
   * ```ts
   * // NS2:
   * const ps = ps(ns, "home");
   * for (script of ps) {
   *     tprint(ns, `${script.filename} ${ps[i].threads}`);
   *     tprint(ns, script.args);
   * }
   * ```
   * @param ns - NS instance passed to the main function.
   * @param host - Host address of the target server. If not specified, it will be the current server’s IP by default.
   * @returns Array with general information about all scripts running on the specified target server.
   */
  export function ps(ns: NS, host?: string): ProcessInfo[];

  /**
   * Check if your have root access on a server.
   * @remarks
   * RAM cost: 0.05 GB
   *
   * Returns a boolean indicating whether or not the player has root access to the specified target server.
   *
   * @example
   * ```ts
   * // NS2:
   * if (hasRootAccess(ns, "foodnstuff") == false) {
   *    nuke(ns, "foodnstuff");
   * }
   * ```
   * @param ns - NS instance passed to the main function.
   * @param host - Host of the target server
   * @returns True if player has root access to the specified target server, and false otherwise.
   */
  export function hasRootAccess(ns: NS, host: string): boolean;

  /**
   * Returns a string with the hostname of the server that the script is running on.
   *
   * @remarks
   * RAM cost: 0.05 GB
   * @param ns - NS instance passed to the main function.
   * @returns Hostname of the server that the script is on.
   */
  export function getHostname(ns: NS): string;

  /**
   * Returns the player’s current hacking level.
   *
   * @remarks
   * RAM cost: 0.05 GB
   * @param ns - NS instance passed to the main function.
   * @returns Player’s current hacking level
   */
  export function getHackingLevel(ns: NS): number;

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
   * // NS2:
   * // Example of how this can be used:
   * const {chance, growth} = getHackingMultipliers(ns);
   * print(ns, chance);
   * print(ns, growth);
   * ```
   * @param ns - NS instance passed to the main function.
   * @returns Object containing the Player’s hacking related multipliers.
   */
  export function getHackingMultipliers(ns: NS): HackingMultipliers;

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
   * // NS2:
   * // Example of how this can be used:
   * const {production, purchaseCost} = getHacknetMultipliers(ns);
   * print(ns, production);
   * print(ns, purchaseCost);
   * ```
   * @param ns - NS instance passed to the main function.
   * @returns Object containing the Player’s hacknet related multipliers.
   */
  export function getHacknetMultipliers(ns: NS): HacknetMultipliers;

  /**
   * Returns a server object for the given server. Defaults to the running script's server if host is not specified.
   *
   * @remarks
   * RAM cost: 2 GB
   * @param ns - NS instance passed to the main function.
   * @param host - Optional. Hostname for the requested server object.
   * @returns The requested server object.
   */
  export function getServer(ns: NS, host?: string): Server;

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
   * // NS2:
   * getServerMoneyAvailable(ns, "foodnstuff");
   * getServerMoneyAvailable(ns, "home"); // Returns player's money
   * ```
   * @param ns - NS instance passed to the main function.
   * @param host - Host of target server
   * @returns Amount of money available on the server.
   */
  export function getServerMoneyAvailable(ns: NS, host: string): number;

  /**
   * Get maximum money available on a server.
   * @remarks
   * RAM cost: 0.1 GB
   *
   * Returns the maximum amount of money that can be available on a server.
   *
   * @param ns - NS instance passed to the main function.
   * @param host - Host of target server.
   * @returns Maximum amount of money available on the server.
   */
  export function getServerMaxMoney(ns: NS, host: string): number;

  /**
   * Get a server growth parameter.
   * @remarks
   * RAM cost: 0.1 GB
   *
   * Returns the server’s intrinsic “growth parameter”. This growth
   * parameter is a number typically between 0 and 100 that represents
   * how quickly the server’s money grows. This parameter affects the
   * percentage by which the server’s money is increased when using the
   * grow function. A higher growth parameter will result in a
   * higher percentage increase from grow.
   *
   * @param ns - NS instance passed to the main function.
   * @param host - Host of target server.
   * @returns Parameter that affects the percentage by which the server’s money is increased when using the grow function.
   */
  export function getServerGrowth(ns: NS, host: string): number;

  /**
   * Get server security level.
   * @remarks
   * RAM cost: 0.1 GB
   *
   * Returns the security level of the target server. A server’s security
   * level is denoted by a number, typically between 1 and 100
   * (but it can go above 100).
   *
   * @param ns - NS instance passed to the main function.
   * @param host - Host of target server.
   * @returns Security level of the target server.
   */
  export function getServerSecurityLevel(ns: NS, host: string): number;

  /**
   * Returns the minimum security level of the target server.
   *
   * @remarks RAM cost: 0.1 GB
   * @param ns - NS instance passed to the main function.
   * @param host - Host of target server.
   * @returns Minimum security level of the target server.
   */
  export function getServerMinSecurityLevel(ns: NS, host: string): number;

  /**
   * @deprecated useless
   * @remarks
   * RAM cost: 0.1 GB
   * Returns the base security level of the target server. This is the security
   * level that the server starts out with. This is different than
   * getServerSecurityLevel because getServerSecurityLevel returns
   * the current security level of a server, which can constantly change due to
   * hack, grow, and weaken, calls on that server.
   * The base security level will stay the same until you reset by
   * installing an Augmentation(s).
   *
   * @param ns - NS instance passed to the main function.
   * @param host - Host of target server.
   * @returns Base security level of the target server.
   */
  export function getServerBaseSecurityLevel(ns: NS, host: string): number;

  /**
   * @deprecated use getServerMaxRam / getServerUsedRam
   * @remarks
   * RAM cost: 0.1 GB
   *
   * Returns an array with two elements that gives information about a server’s memory (RAM).
   * The first element in the array is the amount of RAM that the server has total (in GB).
   * The second element in the array is the amount of RAM that is currently being used on
   * the server (in GB).
   *
   * @example
   * ```ts
   * // NS2:
   * const [totalRam, ramUsed] = getServerRam(ns, "helios");
   * ```
   * @param ns - NS instance passed to the main function.
   * @param host - Host of target server.
   * @returns Array with total and used memory on the specified server, in GB.
   */
  export function getServerRam(ns: NS, host: string): [number, number];

  /**
   * Get the max RAM on a server.
   * @remarks
   * RAM cost: 0.05 GB
   *
   * @param ns - NS instance passed to the main function.
   * @param host - Hostname of the target server.
   * @returns max ram (GB)
   */
  export function getServerMaxRam(ns: NS, host: string): number;
  /**
   * Get the used RAM on a server.
   * @remarks
   * RAM cost: 0.05 GB
   *
   * @param ns - NS instance passed to the main function.
   * @param host - Hostname of the target server.
   * @returns used ram (GB)
   */
  export function getServerUsedRam(ns: NS, host: string): number;

  /**
   * Returns the required hacking level of the target server.
   *
   * @remarks RAM cost: 0.1 GB
   * @param ns - NS instance passed to the main function.
   * @param host - Host of target server.
   * @returns The required hacking level of the target server.
   */
  export function getServerRequiredHackingLevel(ns: NS, host: string): number;

  /**
   * Returns the number of open ports required to successfully run NUKE.exe on the specified server.
   *
   * @remarks RAM cost: 0.1 GB
   * @param ns - NS instance passed to the main function.
   * @param host - Host of target server.
   * @returns The number of open ports required to successfully run NUKE.exe on the specified server.
   */
  export function getServerNumPortsRequired(ns: NS, host: string): number;

  /**
   * Returns a boolean denoting whether or not the specified server exists.
   *
   * @remarks RAM cost: 0.1 GB
   * @param ns - NS instance passed to the main function.
   * @param host - Host of target server.
   * @returns True if specified server exists, and false otherwise.
   */
  export function serverExists(ns: NS, host: string): boolean;

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
   * * @example
   * ```ts
   * // NS2:
   * // The function call will return true if the script named foo.script exists on the foodnstuff server, and false otherwise.
   * fileExists(ns, "foo.script", "foodnstuff");
   *
   * // The function call will return true if the current server contains the FTPCrack.exe program, and false otherwise.
   * fileExists(ns, "ftpcrack.exe");
   * ```
   * @param ns - NS instance passed to the main function.
   * @param filename - Filename of file to check.
   * @param host - Host of target server. This is optional. If it is not specified then the function will use the current server as the target server.
   * @returns True if specified file exists, and false otherwise.
   */
  export function fileExists(ns: NS, filename: string, host?: string): boolean;

  /**
   * Check if a script is running.
   * @remarks
   * RAM cost: 0.1 GB
   *
   * Returns a boolean indicating whether the specified script is running on the target server.
   * If you use a PID instead of a filename, the hostname and args parameters are unnecessary.
   * Remember that a script is uniquely identified by both its name and its arguments.
   *
   * @example
   * ```ts
   * // NS2:
   * //The function call will return true if there is a script named foo.script with no arguments running on the foodnstuff server, and false otherwise:
   * isRunning(ns, "foo.script", "foodnstuff");
   *
   * //The function call will return true if there is a script named foo.script with no arguments running on the current server, and false otherwise:
   * isRunning(ns, "foo.script", getHostname(ns));
   *
   * //The function call will return true if there is a script named foo.script running with the arguments 1, 5, and “test” (in that order) on the joesguns server, and false otherwise:
   * isRunning(ns, "foo.script", "joesguns", 1, 5, "test");
   * ```
   * @param ns - NS instance passed to the main function.
   * @param script - Filename or PID of script to check. This is case-sensitive.
   * @param host - Host of target server.
   * @param args - Arguments to specify/identify which scripts to search for.
   * @returns True if specified script is running on the target server, and false otherwise.
   */
  export function isRunning(ns: NS, script: FilenameOrPID, host: string, ...args: string[]): boolean;

  /**
   * Get general info about a running script.
   * @remarks
   * RAM cost: 0.3 GB
   *
   * Running with no args returns curent script.
   * If you use a PID as the first parameter, the hostname and args parameters are unnecessary.
   *
   * @param ns - NS instance passed to the main function.
   * @param filename - Optional. Filename or PID of the script.
   * @param hostname - Optional. Name of host server the script is running on.
   * @param args  - Arguments to identify the script
   * @returns info about a running script
   */
  export function getRunningScript(ns: NS, filename?: FilenameOrPID, hostname?: string, ...args: (string | number)[]): RunningScript;

  /**
   * Get cost of purchasing a server.
   * @remarks
   * RAM cost: 0.25 GB
   *
   * Returns the cost to purchase a server with the specified amount of ram.
   *
   * @example
   * ```ts
   * // NS2:
   * for (i = 1; i <= 20; i++) {
   *     tprint(ns, i + " -- " + getPurchasedServerCost(ns, Math.pow(2, i)));
   * }
   * ```
   * @param ns - NS instance passed to the main function.
   * @param ram - Amount of RAM of a potential purchased server, in GB. Must be a power of 2 (2, 4, 8, 16, etc.). Maximum value of 1048576 (2^20).
   * @returns The cost to purchase a server with the specified amount of ram.
   */
  export function getPurchasedServerCost(ns: NS, ram: number): number;

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
   * // NS2:
   * const ram = 64;
   * const prefix = "pserv-";
   * for (i = 0; i < 5; ++i) {
   *    purchaseServer(ns, prefix + i, ram);
   * }
   * ```
   * @param ns - NS instance passed to the main function.
   * @param hostname - Host of the purchased server.
   * @param ram - Amount of RAM of the purchased server, in GB. Must be a power of 2 (2, 4, 8, 16, etc.). Maximum value of 1048576 (2^20).
   * @returns The hostname of the newly purchased server.
   */
  export function purchaseServer(ns: NS, hostname: string, ram: number): string;

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
   * @param ns - NS instance passed to the main function.
   * @param host - Host of the server to delete.
   * @returns True if successful, and false otherwise.
   */
  export function deleteServer(ns: NS, host: string): boolean;

  /**
   * Returns an array with the hostnames of all of the servers you have purchased.
   *
   * @remarks 2.25 GB
   * @param ns - NS instance passed to the main function.
   * @returns Returns an array with the hostnames of all of the servers you have purchased.
   */
  export function getPurchasedServers(ns: NS): string[];

  /**
   * Returns the maximum number of servers you can purchase.
   *
   * @remarks RAM cost: 0.05 GB
   * @param ns - NS instance passed to the main function.
   * @returns Returns the maximum number of servers you can purchase.
   */
  export function getPurchasedServerLimit(ns: NS): number;

  /**
   * Returns the maximum RAM that a purchased server can have.
   *
   * @remarks RAM cost: 0.05 GB
   * @param ns - NS instance passed to the main function.
   * @returns Returns the maximum RAM (in GB) that a purchased server can have.
   */
  export function getPurchasedServerMaxRam(ns: NS): number;

  /**
   * Write data to a file.
   * @remarks
   * RAM cost: 0 GB
   *
   * This function can be used to write data to a text file (.txt).
   *
   * This function will write data to that text file. If the specified text file does not exist,
   * then it will be created. The third argument mode, defines how the data will be written to
   * the text file. If *mode is set to “w”, then the data is written in “write” mode which means
   * that it will overwrite all existing data on the text file. If mode is set to any other value
   * then the data will be written in “append” mode which means that the data will be added at the
   * end of the text file.
   *
   * @param ns - NS instance passed to the main function.
   * @param handle - Filename of the text file that will be written to.
   * @param data - Data to write.
   * @param mode - Defines the write mode. Only valid when writing to text files.
   */
  export function write(ns: NS, handle: string, data?: string[] | number | string, mode?: "w" | "a"): Promise<void>;

  /**
   * Attempt to write to a port.
   * @remarks
   * RAM cost: 0 GB
   *
   * Attempts to write data to the specified Netscript Port.
   * If the port is full, the data will not be written.
   * Otherwise, the data will be written normally.
   *
   * @param ns - NS instance passed to the main function.
   * @param port - Port or text file that will be written to.
   * @param data - Data to write.
   * @returns True if the data is successfully written to the port, and false otherwise.
   */
  export function tryWritePort(ns: NS, port: number, data: string[] | number): Promise<boolean>;

  /**
   * Read content of a file.
   * @remarks
   * RAM cost: 0 GB
   *
   * This function is used to read data from a text file (.txt).
   *
   * This function will return the data in the specified text
   * file. If the text file does not exist, an empty string will be returned.
   *
   * @param ns - NS instance passed to the main function.
   * @param handle - Filename to read from.
   * @returns Data in the specified text file.
   */
  export function read(ns: NS, handle: string): any;

  /**
   * Get a copy of the data from a port without popping it.
   * @remarks
   * RAM cost: 0 GB
   *
   * This function is used to peek at the data from a port. It returns the
   * first element in the specified port without removing that element. If
   * the port is empty, the string “NULL PORT DATA” will be returned.
   *
   * @param ns - NS instance passed to the main function.
   * @param port - Port to peek. Must be an integer between 1 and 20.
   * @returns Data in the specified port.
   */
  export function peek(ns: NS, port: number): any;

  /**
   * Clear data from a file.
   * @remarks
   * RAM cost: 0 GB
   *
   * Delete all data from that text file.
   *
   * @param ns - NS instance passed to the main function.
   * @param handle - Text file to clear.
   */
  export function clear(ns: NS, handle: string): void;

  /**
   * Clear data from a port.
   * @remarks
   * RAM cost: 0 GB
   *
   * Deleta all data from the underlying queue.
   *
   * @param ns - NS instance passed to the main function.
   * @param handle - Port to clear.
   */
  export function clearPort(ns: NS, handle: number): void;

  /**
   * Write data to a port.
   * @remarks
   * RAM cost: 0 GB
   *
   * Write data to that netscript port.
   * @param ns - NS instance passed to the main function.
   * @returns The data popped off the queue if it was full.
   */
  export function writePort(ns: NS, port: number, data: string | number): Promise<any>;
  /**
   * Read data from a port.
   * @remarks
   * RAM cost: 0 GB
   *
   * Read data from that port. A port is a serialized queue.
   * This function will remove the first element from that queue and return it.
   * If the queue is empty, then the string “NULL PORT DATA” will be returned.
   * @param ns - NS instance passed to the main function.
   * @returns the data read.
   */
  export function readPort(ns: NS, port: number): any;

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
   * @param ns - NS instance passed to the main function.
   * @param port - Port number. Must be an integer between 1 and 20.
   */
  export function getPortHandle(ns: NS, port: number): NetscriptPort;

  /**
   * Delete a file.
   * @remarks
   * RAM cost: 1 GB
   *
   * Removes the specified file from the current server. This function works for every file
   * type except message (.msg) files.
   *
   * @param ns - NS instance passed to the main function.
   * @param name - Filename of file to remove. Must include the extension.
   * @param host - Host Address of the server on which to delete the file. Optional. Defaults to current server.
   * @returns True if it successfully deletes the file, and false otherwise.
   */
  export function rm(ns: NS, name: string, host?: string): boolean;

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
   * * @example
   * ```ts
   * // NS2:
   * //The function call will return true if there is any script named foo.script running on the foodnstuff server, and false otherwise:
   * scriptRunning(ns, "foo.script", "foodnstuff");
   *
   * //The function call will return true if there is any script named “foo.script” running on the current server, and false otherwise:
   * scriptRunning(ns, "foo.script", getHostname(ns));
   * ```
   * @param ns - NS instance passed to the main function.
   * @param script - Filename of script to check. This is case-sensitive.
   * @param host - Host of target server.
   * @returns True if the specified script is running, and false otherwise.
   */
  export function scriptRunning(ns: NS, script: string, host: string): boolean;

  /**
   * Kill all scripts with a filename.
   * @remarks
   * RAM cost: 1 GB
   *
   * Kills all scripts with the specified filename on the target server specified by hostname,
   * regardless of arguments.
   *
   * @param ns - NS instance passed to the main function.
   * @param script - Filename of script to kill. This is case-sensitive.
   * @param host - Host of target server.
   * @returns true if one or more scripts were successfully killed, and false if none were.
   */
  export function scriptKill(ns: NS, script: string, host: string): boolean;

  /**
   * Returns the current script name.
   *
   * @remarks RAM cost: 0 GB
   * @param ns - NS instance passed to the main function.
   * @returns Current script name.
   */
  export function getScriptName(ns: NS): string;

  /**
   * Get the ram cost of a script.
   * @remarks
   * RAM cost: 0.1 GB
   *
   * Returns the amount of RAM required to run the specified script on the target server.
   * Returns 0 if the script does not exist.
   *
   * @param ns - NS instance passed to the main function.
   * @param script - Filename of script. This is case-sensitive.
   * @param host - Host of target server the script is located on. This is optional, If it is not specified then the function will se the current server as the target server.
   * @returns Amount of RAM (in GB) required to run the specified script on the target server, and 0 if the script does not exist.
   */
  export function getScriptRam(ns: NS, script: string, host?: string): number;

  /**
   * Get the execution time of a hack() call.
   * @remarks
   * RAM cost: 0.05 GB
   * When `hack` completes an amount of money is stolen depending on the player's skills.
   * Returns the amount of time in milliseconds it takes to execute the hack Netscript function on the target server.
   * The function takes in an optional hackLvl parameter that can be specified to see what the hack time would be at different hacking levels.
   * The required time is increased by the security level of the target server and decreased by the player's hacking level.
   *
   * @param ns - NS instance passed to the main function.
   * @param host - Host of target server.
   * @returns Returns the amount of time in milliseconds it takes to execute the hack Netscript function. Returns Infinity if called on a Hacknet Server.
   */
  export function getHackTime(ns: NS, host: string): number;

  /**
   * Get the execution time of a grow() call.
   * @remarks
   * RAM cost: 0.05 GB
   *
   * Returns the amount of time in milliseconds it takes to execute the grow Netscript function on the target server.
   * The function takes in an optional hackLvl parameter that can be specified to see what the grow time would be at different hacking levels.
   * The required time is increased by the security level of the target server and decreased by the player's hacking level.
   *
   * @param ns - NS instance passed to the main function.
   * @param host - Host of target server.
   * @returns Returns the amount of time in milliseconds it takes to execute the grow Netscript function. Returns Infinity if called on a Hacknet Server.
   */
  export function getGrowTime(ns: NS, host: string): number;

  /**
   * Get the execution time of a weaken() call.
   * @remarks
   * RAM cost: 0.05 GB
   *
   * Returns the amount of time in milliseconds it takes to execute the weaken Netscript function on the target server.
   * The function takes in an optional hackLvl parameter that can be specified to see what the weaken time would be at different hacking levels.
   * The required time is increased by the security level of the target server and decreased by the player's hacking level.
   *
   * @param ns - NS instance passed to the main function.
   * @param host - Host of target server.
   * @returns Returns the amount of time in milliseconds it takes to execute the weaken Netscript function. Returns Infinity if called on a Hacknet Server.
   */
  export function getWeakenTime(ns: NS, host: string): number;

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
   * @param ns - NS instance passed to the main function.
   * @param script - Filename of script.
   * @param host - Server on which script is running.
   * @param args - Arguments that the script is running with.
   * @returns Amount of income the specified script generates while online.
   */
  export function getScriptIncome(ns: NS): [number, number];
  export function getScriptIncome(ns: NS, script: string, host: string, ...args: string[]): number;

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
   * @param ns - NS instance passed to the main function.
   * @param script - Filename of script.
   * @param host - Server on which script is running.
   * @param args - Arguments that the script is running with.
   * @returns Amount of hacking experience the specified script generates while online.
   */
  export function getScriptExpGain(ns: NS): number;
  export function getScriptExpGain(ns: NS, script: string, host: string, ...args: string[]): number;

  /**
   * Returns the amount of time in milliseconds that have passed since you last installed Augmentations.
   *
   * @remarks RAM cost: 0.05 GB
   * @param ns - NS instance passed to the main function.
   * @returns Time in milliseconds that have passed since you last installed Augmentations.
   */
  export function getTimeSinceLastAug(ns: NS): number;

  /**
   * Format a string.
   *
   * @remarks
   * RAM cost: 0 GB
   *
   * see: https://github.com/alexei/sprintf.js
   * @param ns - NS instance passed to the main function.
   * @param format - String to format.
   * @param args - Formating arguments.
   * @returns Formated text.
   */
  export function sprintf(ns: NS, format: string, ...args: any[]): string;

  /**
   * Format a string with an array of arguments.
   * @remarks
   * RAM cost: 0 GB
   *
   * see: https://github.com/alexei/sprintf.js
   * @param ns - NS instance passed to the main function.
   * @param format - String to format.
   * @param args - Formating arguments.
   * @returns Formated text.
   */
  export function vsprintf(ns: NS, format: string, args: any[]): string;

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
   * @param ns - NS instance passed to the main function.
   * @param n - Number to format.
   * @param format - Formatter.
   * @returns Formated number.
   */
  export function nFormat(ns: NS, n: number, format: string): string;

  /**
   * Format time to readable string
   * @remarks
   * RAM cost: 0 GB
   *
   * @param ns - NS instance passed to the main function.
   * @param milliseconds - Number of millisecond to format.
   * @param milliPrecision - Format time with subsecond precision, defaults to false.
   * @returns The formatted time.
   */
  export function tFormat(ns: NS, milliseconds: number, milliPrecision?: boolean): string;

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
   * @param ns - NS instance passed to the main function.
   * @param txt - Text to appear in the prompt dialog box.
   * @returns True if the player click “Yes” and false if the player clicks “No”.
   */
  export function prompt(ns: NS, txt: string): Promise<boolean>;

  /**
   * Open up a message box.
   * @param ns - NS instance passed to the main function.
   * @param msg - Message to alert.
   */
  export function alert(ns: NS, msg: any): void;

  /**
   * Queue a toast (bottom-right notification).
   * @param ns - NS instance passed to the main function.
   * @param msg - Message in the toast.
   * @param variant - Type of toast, must be one of success, info, warning, error. Defaults to success.
   * @param duration - Duration of toast in ms. Can also be `null` to create a persistent toast. Defaults to 2000
   */
  export function toast(ns: NS, msg: any, variant?: string, duration?: number | null): void;

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
   * // NS2:
   * await wget(ns, "https://raw.githubusercontent.com/danielyxie/bitburner/master/README.md", "game_readme.txt");
   * ```
   * @param ns - NS instance passed to the main function.
   * @param url - URL to pull data from.
   * @param target - Filename to write data to. Must be script or text file.
   * @param host - Optional hostname/ip of server for target file.
   * @returns True if the data was successfully retrieved from the URL, false otherwise.
   */
  export function wget(ns: NS, url: string, target: string, host?: string): Promise<boolean>;

  /**
   * Returns the amount of Faction favor required to be able to donate to a faction.
   *
   * @remarks RAM cost: 0.1 GB
   * @param ns - NS instance passed to the main function.
   * @returns Amount of Faction favor required to be able to donate to a faction.
   */
  export function getFavorToDonate(ns: NS): number;

  /**
   * Get the current Bitnode multipliers.
   * @remarks
   * RAM cost: 4 GB
   *
   * Returns an object containing the current BitNode multipliers.
   * This function requires you to be in Bitnode 5 or have Source-File 5 in order to run.
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
   * // NS2:
   * const {ServerMaxMoney, HackExpGain} = getBitNodeMultipliers(ns);
   * print(ns, ServerMaxMoney);
   * print(ns, HackExpGain);
   * ```
   * @param ns - NS instance passed to the main function.
   * @returns Object containing the current BitNode multipliers.
   */
  export function getBitNodeMultipliers(ns: NS): BitNodeMultipliers;

  /**
   * Get a list of acquired Source-Files.
   * @remarks
   * RAM cost: 5 GB
   *
   * Returns an array of source files
   *
   * @param ns - NS instance passed to the main function.
   * @returns Array containing an object with number and level of the source file.
   */
  export function getOwnedSourceFiles(ns: NS): SourceFileLvl[];

  /**
   * Get information about the player.
   * @remarks
   * RAM cost: 0.5 GB
   *
   * Returns an object with information on the current player.
   *
   * @param ns - NS instance passed to the main function.
   * @returns Player info
   */
  export function getPlayer(ns: NS): Player;

  /**
   * Add callback function when the script dies
   * @remarks
   * RAM cost: 0 GB
   *
   * NS2 exclusive
   *
   * Add callback to be executed when the script dies.
   * @param ns - NS instance passed to the main function.
   */
  export function atExit(ns: NS, f: () => void): void;

  /**
   * Move a file on the target server.
   * @remarks
   * RAM cost: 0 GB
   *
   * NS2 exclusive
   *
   * Move the source file to the specified destination on the target server.
   *
   * This command only works for scripts and text files (.txt). It cannot, however,  be used
   * to convert from script to text file, or vice versa.
   *
   * This function can also be used to rename files.
   *
   * @param ns - NS instance passed to the main function.
   * @param host - Host of target server.
   * @param source - Filename of the source file.
   * @param destination - Filename of the destination file.
   */
  export function mv(ns: NS, host: string, source: string, destination: string): void;

  /**
   * Parse command line flags.
   * @remarks
   * RAM cost: 0 GB
   *
   * Allows unix like flag parsing.
   * @example
   * ```ts
   * // example.ns
   * export async function main(ns) {
   *   const data = flags(ns, [
   *     ['delay', 0], // a default number means this flag is a number
   *     ['server', 'foodnstuff'], //  a default string means this flag is a string
   *     ['exclude', []], // a default array means this flag is a default array of string
   *     ['help', false], // a default boolean means this flag is a boolean
   *   ]);
   *   tprint(ns, data);
   * }
   *
   * // [home ~/]> run example.ns
   * // {"_":[],"delay":0,"server":"foodnstuff","exclude":[],"help":false}
   * // [home ~/]> run example.ns --delay 3000
   * // {"_":[],"server":"foodnstuff","exclude":[],"help":false,"delay":3000}
   * // [home ~/]> run example.ns --delay 3000 --server harakiri-sushi
   * // {"_":[],"exclude":[],"help":false,"delay":3000,"server":"harakiri-sushi"}
   * // [home ~/]> run example.ns --delay 3000 --server harakiri-sushi hello world
   * // {"_":["hello","world"],"exclude":[],"help":false,"delay":3000,"server":"harakiri-sushi"}
   * // [home ~/]> run example.ns --delay 3000 --server harakiri-sushi hello world --exclude a --exclude b
   * // {"_":["hello","world"],"help":false,"delay":3000,"server":"harakiri-sushi","exclude":["a","b"]}
   * // [home ~/]> run example.ns --help
   * // {"_":[],"delay":0,"server":"foodnstuff","exclude":[],"help":true}
   * ```
   * @param ns - NS instance passed to the main function.
   */
  export function flags(ns: NS, schema: [string, string | number | boolean | string[]][]): any;

  /**
   * Share your computer with your factions.
   * @remarks
   * RAM cost: 2.4 GB
   *
   * Increases your rep gain of hacking contracts while share is called.
   * Scales with thread count.
   * @param ns - NS instance passed to the main function.
   */
  export function share(ns: NS): Promise<void>;

  /**
   * Calculate your share power. Based on all the active share calls.
   * @remarks
   * RAM cost: 0.2 GB
   * @param ns - NS instance passed to the main function.
   */
  export function getSharePower(ns: NS): number;
}

/**
 * Hacknet API
 * @remarks
 * Not all these functions are immediately available.
 * @public
 */
declare module "ns/hacknet" {
  import {NS} from 'ns';

  /**
   * Object representing all the values related to a hacknet node.
   * @public
   */
  export interface NodeStats {
    /** Node's name */
    name: string;
    /** Node's level */
    level: number;
    /** Node's RAM (GB) */
    ram: number;
    /** Node's used RAM (GB) */
    ramUsed: number;
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
   * Get the number of hacknet nodes you own.
   * @remarks
   * RAM cost: 0 GB
   *
   * Returns the number of Hacknet Nodes you own.
   *
   * @param ns - NS instance passed to the main function.
   * @returns number of hacknet nodes.
   */
  export function numNodes(ns: NS): number;

  /**
   * Get the maximum number of hacknet nodes.
   * @remarks
   * RAM cost: 0 GB
   *
   * @param ns - NS instance passed to the main function.
   * @returns maximum number of hacknet nodes.
   */
  export function maxNumNodes(ns: NS): number;

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
   * @param ns - NS instance passed to the main function.
   * @returns The index of the Hacknet Node or if the player cannot afford to purchase a new Hacknet Node the function will return -1.
   */
  export function purchaseNode(ns: NS): number;

  /**
   * Get the price of the next hacknet node.
   * @remarks
   * RAM cost: 0 GB
   *
   * Returns the cost of purchasing a new Hacknet Node.
   *
   * @param ns - NS instance passed to the main function.
   * @returns Cost of purchasing a new Hacknet Node.
   */
  export function getPurchaseNodeCost(ns: NS): number;

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
   * @param ns - NS instance passed to the main function.
   * @param index - Index/Identifier of Hacknet Node
   * @returns Object containing a variety of stats about the specified Hacknet Node.
   */
  export function getNodeStats(ns: NS, index: number): NodeStats;

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
   * @param ns - NS instance passed to the main function.
   * @param index - Index/Identifier of Hacknet Node.
   * @param n - Number of levels to purchase. Must be positive. Rounded to nearest integer.
   * @returns True if the Hacknet Node’s level is successfully upgraded, false otherwise.
   */
  export function upgradeLevel(ns: NS, index: number, n: number): boolean;

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
   * @param ns - NS instance passed to the main function.
   * @param index - Index/Identifier of Hacknet Node.
   * @param n - Number of times to upgrade RAM. Must be positive. Rounded to nearest integer.
   * @returns True if the Hacknet Node’s ram is successfully upgraded, false otherwise.
   */
  export function upgradeRam(ns: NS, index: number, n: number): boolean;

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
   * @param ns - NS instance passed to the main function.
   * @param index - Index/Identifier of Hacknet Node.
   * @param n - Number of cores to purchase. Must be positive. Rounded to nearest integer.
   * @returns True if the Hacknet Node’s cores are successfully purchased, false otherwise.
   */
  export function upgradeCore(ns: NS, index: number, n: number): boolean;

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
   * @param ns - NS instance passed to the main function.
   * @param index - Index/Identifier of Hacknet Node.
   * @param n - Number of cache levels to purchase. Must be positive. Rounded to nearest integer.
   * @returns True if the Hacknet Node’s cores are successfully purchased, false otherwise.
   */
  export function upgradeCache(ns: NS, index: number, n: number): boolean;

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
   * @param ns - NS instance passed to the main function.
   * @param index - Index/Identifier of Hacknet Node.
   * @param n - Number of levels to upgrade. Must be positive. Rounded to nearest integer.
   * @returns Cost of upgrading the specified Hacknet Node.
   */
  export function getLevelUpgradeCost(ns: NS, index: number, n: number): number;

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
   * @param ns - NS instance passed to the main function.
   * @param index - Index/Identifier of Hacknet Node.
   * @param n - Number of times to upgrade RAM. Must be positive. Rounded to nearest integer.
   * @returns Cost of upgrading the specified Hacknet Node's ram.
   */
  export function getRamUpgradeCost(ns: NS, index: number, n: number): number;

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
   * @param ns - NS instance passed to the main function.
   * @param index - Index/Identifier of Hacknet Node.
   * @param n - Number of times to upgrade cores. Must be positive. Rounded to nearest integer.
   * @returns Cost of upgrading the specified Hacknet Node's number of cores.
   */
  export function getCoreUpgradeCost(ns: NS, index: number, n: number): number;

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
   * @param ns - NS instance passed to the main function.
   * @param index - Index/Identifier of Hacknet Node.
   * @param n - Number of times to upgrade cache. Must be positive. Rounded to nearest integer.
   * @returns Cost of upgrading the specified Hacknet Node's cache.
   */
  export function getCacheUpgradeCost(ns: NS, index: number, n: number): number;

  /**
   * Get the total number of hashes stored.
   * @remarks
   * RAM cost: 0 GB
   *
   * This function is only applicable for Hacknet Servers (the upgraded version of a Hacknet Node).
   *
   * Returns the number of hashes you have.
   *
   * @param ns - NS instance passed to the main function.
   * @returns Number of hashes you have.
   */
  export function numHashes(ns: NS): number;

  /**
   * Get the maximum number of hashes you can store.
   * @remarks
   * RAM cost: 0 GB
   *
   * This function is only applicable for Hacknet Servers (the upgraded version of a Hacknet Node).
   *
   * Returns the number of hashes you can store.
   *
   * @param ns - NS instance passed to the main function.
   * @returns Number of hashes you can store.
   */
  export function hashCapacity(ns: NS): number;

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
   * // NS2:
   * const upgradeName = "Sell for Corporation Funds";
   * if (numHashes(ns) > hashCost(ns, upgradeName)) {
   *    spendHashes(ns, upgName);
   * }
   * ```
   * @param ns - NS instance passed to the main function.
   * @param upgName - Name of the upgrade of Hacknet Node.
   * @returns Number of hashes required for the specified upgrade.
   */
  export function hashCost(ns: NS, upgName: string): number;

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
   * NS2:
   * spendHashes(ns, "Sell for Corporation Funds");
   * spendHashes(ns, "Increase Maximum Money", "foodnstuff");
   * ```
   * @param ns - NS instance passed to the main function.
   * @param upgName - Name of the upgrade of Hacknet Node.
   * @param upgTarget - Object to which upgrade applies. Required for certain upgrades.
   * @returns True if the upgrade is successfully purchased, and false otherwise..
   */
  export function spendHashes(ns: NS, upgName: string, upgTarget?: string): boolean;

  /**
   * Get the list of hash upgrades
   * @remarks
   * RAM cost: 0 GB
   *
   * This function is only applicable for Hacknet Servers (the upgraded version of a Hacknet Node).
   *
   * Returns the list of all available hash upgrades that can be used in the spendHashes function.
   * @example
   * ```ts
   * // NS2:
   * const upgrades = getHashUpgrades(ns); // ["Sell for Money","Sell for Corporation Funds",...]
   * ```
   * @param ns - NS instance passed to the main function.
   * @returns An array containing the available upgrades
   */
  export function getHashUpgrades(ns: NS): string[];

  /**
   * Get the level of a hash upgrade.
   * @remarks
   * RAM cost: 0 GB
   *
   * This function is only applicable for Hacknet Servers (the upgraded version of a Hacknet Node).
   *
   * @param ns - NS instance passed to the main function.
   * @returns Level of the upgrade.
   */
  export function getHashUpgradeLevel(ns: NS, upgName: string): number;

  /**
   * Get the multipler to study.
   * @remarks
   * RAM cost: 0 GB
   *
   * This function is only applicable for Hacknet Servers (the upgraded version of a Hacknet Node).
   *
   * @param ns - NS instance passed to the main function.
   * @returns Multiplier.
   */
  export function getStudyMult(ns: NS): number;

  /**
   * Get the multipler to training.
   * @remarks
   * RAM cost: 0 GB
   *
   * This function is only applicable for Hacknet Servers (the upgraded version of a Hacknet Node).
   *
   * @param ns - NS instance passed to the main function.
   * @returns Multiplier.
   */
  export function getTrainingMult(ns: NS): number;
}

/**
 * Bladeburner API
 * @remarks
 * You have to be employed in the Bladeburner division and be in BitNode-7
 * or have Source-File 7 in order to use this API.
 * @public
 */
declare module "ns/bladeburner" {
  import {NS} from 'ns';

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
   * List all contracts.
   * @remarks
   * RAM cost: 0.4 GB
   *
   * Returns an array of strings containing the names of all Bladeburner contracts.
   *
   * @param ns - NS instance passed to the main function.
   * @returns Array of strings containing the names of all Bladeburner contracts.
   */
  export function getContractNames(ns: NS): string[];

  /**
   * List all operations.
   * @remarks
   * RAM cost: 0.4 GB
   *
   * Returns an array of strings containing the names of all Bladeburner operations.
   *
   * @param ns - NS instance passed to the main function.
   * @returns Array of strings containing the names of all Bladeburner operations.
   */
  export function getOperationNames(ns: NS): string[];

  /**
   * List all black ops.
   * @remarks
   * RAM cost: 0.4 GB
   *
   * Returns an array of strings containing the names of all Bladeburner Black Ops.
   *
   * @param ns - NS instance passed to the main function.
   * @returns Array of strings containing the names of all Bladeburner Black Ops.
   */
  export function getBlackOpNames(ns: NS): string[];

  /**
   * List all general actions.
   * @remarks
   * RAM cost: 0.4 GB
   *
   * Returns an array of strings containing the names of all general Bladeburner actions.
   *
   * @param ns - NS instance passed to the main function.
   * @returns Array of strings containing the names of all general Bladeburner actions.
   */
  export function getGeneralActionNames(ns: NS): string[];

  /**
   * List all skills.
   * @remarks
   * RAM cost: 0.4 GB
   *
   * Returns an array of strings containing the names of all general Bladeburner skills.
   *
   * @param ns - NS instance passed to the main function.
   * @returns Array of strings containing the names of all general Bladeburner skills.
   */
  export function getSkillNames(ns: NS): string[];

  /**
   * Start an action.
   * @remarks
   * RAM cost: 4 GB
   *
   * Attempts to start the specified Bladeburner action.
   * Returns true if the action was started successfully, and false otherwise.
   *
   * @param ns - NS instance passed to the main function.
   * @param type - Type of action.
   * @param name - Name of action. Must be an exact match
   * @returns True if the action was started successfully, and false otherwise.
   */
  export function startAction(ns: NS, type: string, name: string): boolean;

  /**
   * Stop current action.
   * @remarks
   * RAM cost: 2 GB
   *
   * Stops the current Bladeburner action.
   *
   * @param ns - NS instance passed to the main function.
   */
  export function stopBladeburnerAction(ns: NS): void;

  /**
   * Get current action.
   * @remarks
   * RAM cost: 1 GB
   *
   * Returns an object that represents the player’s current Bladeburner action.
   * If the player is not performing an action, the function will return an object with the ‘type’ property set to “Idle”.
   *
   * @param ns - NS instance passed to the main function.
   * @returns Object that represents the player’s current Bladeburner action.
   */
  export function getCurrentAction(ns: NS): BladeburnerCurAction;

  /**
   * Get the time to complete an action.
   * @remarks
   * RAM cost: 4 GB
   *
   * Returns the number of seconds it takes to complete the specified action
   *
   * @param ns - NS instance passed to the main function.
   * @param type - Type of action.
   * @param name - Name of action. Must be an exact match.
   * @returns Number of milliseconds it takes to complete the specified action.
   */
  export function getActionTime(ns: NS, type: string, name: string): number;

  /**
   * Get estimate success chance of an action.
   * @remarks
   * RAM cost: 4 GB
   *
   * Returns the estimated success chance for the specified action.
   * This chance is returned as a decimal value, NOT a percentage
   * (e.g. if you have an estimated success chance of 80%, then this function will return 0.80, NOT 80).
   *
   * @param ns - NS instance passed to the main function.
   * @param type - Type of action.
   * @param name - Name of action. Must be an exact match.
   * @returns Estimated success chance for the specified action.
   */
  export function getActionEstimatedSuccessChance(ns: NS, type: string, name: string): [number, number];

  /**
   * Get the reputation gain of an action.
   * @remarks
   * RAM cost: 4 GB
   *
   * Returns the average Bladeburner reputation gain for successfully
   * completing the specified action.
   * Note that this value is an ‘average’ and the real reputation gain may vary slightly from this value.
   *
   * @param ns - NS instance passed to the main function.
   * @param type - Type of action.
   * @param name - Name of action. Must be an exact match.
   * @param level - Optional action level at which to calculate the gain
   * @returns Average Bladeburner reputation gain for successfully completing the specified action.
   */
  export function getActionRepGain(ns: NS, type: string, name: string, level: number): number;

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
   * @param ns - NS instance passed to the main function.
   * @param type - Type of action.
   * @param name - Name of action. Must be an exact match.
   * @returns Remaining count of the specified action.
   */
  export function getActionCountRemaining(ns: NS, type: string, name: string): number;

  /**
   * Get the maximum level of an action.
   * @remarks
   * RAM cost: 4 GB
   *
   * Returns the maximum level for this action.
   *
   * Returns -1 if an invalid action is specified.
   *
   * @param ns - NS instance passed to the main function.
   * @param type - Type of action.
   * @param name - Name of action. Must be an exact match.
   * @returns Maximum level of the specified action.
   */
  export function getActionMaxLevel(ns: NS, type: string, name: string): number;

  /**
   * Get the current level of an action.
   * @remarks
   * RAM cost: 4 GB
   *
   * Returns the current level of this action.
   *
   * Returns -1 if an invalid action is specified.
   *
   * @param ns - NS instance passed to the main function.
   * @param type - Type of action.
   * @param name - Name of action. Must be an exact match.
   * @returns Current level of the specified action.
   */
  export function getActionCurrentLevel(ns: NS, type: string, name: string): number;

  /**
   * Get wether an action is set to autolevel.
   * @remarks
   * RAM cost: 4 GB
   *
   * Return a boolean indicating whether or not this action is currently set to autolevel.
   *
   * Returns false if an invalid action is specified.
   *
   * @param ns - NS instance passed to the main function.
   * @param type - Type of action.
   * @param name - Name of action. Must be an exact match.
   * @returns True if the action is set to autolevel, and false otherwise.
   */
  export function getActionAutolevel(ns: NS, type: string, name: string): boolean;

  /**
   * Set an action autolevel.
   * @remarks
   * RAM cost: 4 GB
   *
   * Enable/disable autoleveling for the specified action.
   *
   * @param ns - NS instance passed to the main function.
   * @param type - Type of action.
   * @param name - Name of action. Must be an exact match.
   * @param autoLevel - Whether or not to autolevel this action
   */
  export function setActionAutolevel(ns: NS, type: string, name: string, autoLevel: boolean): void;

  /**
   * Set the level of an action.
   * @remarks
   * RAM cost: 4 GB
   *
   * Set the level for the specified action.
   *
   * @param ns - NS instance passed to the main function.
   * @param type - Type of action.
   * @param name - Name of action. Must be an exact match.
   * @param level - Level to set this action to.
   */
  export function setActionLevel(ns: NS, type: string, name: string, level: number): void;

  /**
   * Get player bladeburner rank.
   * @remarks
   * RAM cost: 4 GB
   *
   * Returns the player’s Bladeburner Rank.
   *
   * @param ns - NS instance passed to the main function.
   * @returns Player’s Bladeburner Rank.
   */
  export function getRank(ns: NS): number;

  /**
   * Get black op required rank.
   * @remarks
   * RAM cost: 2 GB
   *
   * Returns the rank required to complete this BlackOp.
   *
   * Returns -1 if an invalid action is specified.
   *
   * @param ns - NS instance passed to the main function.
   * @param name - Name of BlackOp. Must be an exact match.
   * @returns Rank required to complete this BlackOp.
   */
  export function getBlackOpRank(ns: NS, name: string): number;

  /**
   * Get bladeburner skill points.
   * @remarks
   * RAM cost: 4 GB
   *
   * Returns the number of Bladeburner skill points you have.
   *
   * @param ns - NS instance passed to the main function.
   * @returns Number of Bladeburner skill points you have.
   */
  export function getSkillPoints(ns: NS): number;

  /**
   * Get skill level.
   * @remarks
   * RAM cost: 4 GB
   *
   * This function returns your level in the specified skill.
   *
   * The function returns -1 if an invalid skill name is passed in.
   *
   * @param ns - NS instance passed to the main function.
   * @param skillName - Name of skill. Case-sensitive and must be an exact match
   * @returns Level in the specified skill.
   */
  export function getSkillLevel(ns: NS, name: string): number;

  /**
   * Get cost to upgrade skill.
   * @remarks
   * RAM cost: 4 GB
   *
   * This function returns the number of skill points needed to upgrade the specified skill.
   *
   * The function returns -1 if an invalid skill name is passed in.
   *
   * @param ns - NS instance passed to the main function.
   * @param skillName - Name of skill. Case-sensitive and must be an exact match
   * @returns Number of skill points needed to upgrade the specified skill.
   */
  export function getSkillUpgradeCost(ns: NS, name: string): number;

  /**
   * Upgrade skill.
   * @remarks
   * RAM cost: 4 GB
   *
   * Attempts to upgrade the specified Bladeburner skill.
   *
   * Returns true if the skill is successfully upgraded, and false otherwise.
   *
   * @param ns - NS instance passed to the main function.
   * @param skillName - Name of skill to be upgraded. Case-sensitive and must be an exact match
   * @returns true if the skill is successfully upgraded, and false otherwise.
   */
  export function upgradeSkill(ns: NS, name: string): boolean;

  /**
   * Get team size.
   * @remarks
   * RAM cost: 4 GB
   *
   * Returns the number of Bladeburner team members you have assigned to the specified action.
   *
   * Setting a team is only applicable for Operations and BlackOps. This function will return 0 for other action types.
   *
   * @param ns - NS instance passed to the main function.
   * @param type - Type of action.
   * @param name - Name of action. Must be an exact match.
   * @returns Number of Bladeburner team members that were assigned to the specified action.
   */
  export function getTeamSize(ns: NS, type: string, name: string): number;

  /**
   * Set team size.
   * @remarks
   * RAM cost: 4 GB
   *
   * Set the team size for the specified Bladeburner action.
   *
   * Returns the team size that was set, or -1 if the function failed.
   *
   * @param ns - NS instance passed to the main function.
   * @param type - Type of action.
   * @param name - Name of action. Must be an exact match.
   * @param size - Number of team members to set. Will be converted using Math.round().
   * @returns Number of Bladeburner team members you assigned to the specified action.
   */
  export function setTeamSize(ns: NS, type: string, name: string, size: number): number;

  /**
   * Get estimated population in city.
   * @remarks
   * RAM cost: 4 GB
   *
   * Returns the estimated number of Synthoids in the specified city,
   * or -1 if an invalid city was specified.
   *
   * @param ns - NS instance passed to the main function.
   * @param cityName - Name of city. Case-sensitive
   * @returns Estimated number of Synthoids in the specified city.
   */
  export function getCityEstimatedPopulation(ns: NS, name: string): number;

  /**
   * Get number of communities in a city.
   * @remarks
   * RAM cost: 4 GB
   *
   * Returns the estimated number of Synthoid communities in the specified city,
   * or -1 if an invalid city was specified.
   *
   * @param ns - NS instance passed to the main function.
   * @param cityName - Name of city. Case-sensitive
   * @returns Number of Synthoids communities in the specified city.
   */
  export function getCityCommunities(ns: NS, name: string): number;

  /**
   * Get chaos of a city.
   * @remarks
   * RAM cost: 4 GB
   *
   * Returns the chaos in the specified city,
   * or -1 if an invalid city was specified.
   *
   * @param ns - NS instance passed to the main function.
   * @param cityName - Name of city. Case-sensitive
   * @returns Chaos in the specified city.
   */
  export function getCityChaos(ns: NS, name: string): number;

  /**
   * Get current city.
   * @remarks
   * RAM cost: 4 GB
   *
   * Returns the city that the player is currently in (for Bladeburner).
   *
   * @param ns - NS instance passed to the main function.
   * @returns City that the player is currently in (for Bladeburner).
   */
  export function getCity(ns: NS): string;

  /**
   * Travel to another city in bladeburner.
   * @remarks
   * RAM cost: 4 GB
   * Attempts to switch to the specified city (for Bladeburner only).
   *
   * Returns true if successful, and false otherwise
   *
   * @param ns - NS instance passed to the main function.
   * @param cityName - Name of city. Case-sensitive
   * @returns true if successful, and false otherwise
   */
  export function switchCity(ns: NS, name: string): boolean;

  /**
   * Get bladeburner stamina.
   * @remarks
   * RAM cost: 4 GB
   * Returns an array with two elements:
   * * [Current stamina, Max stamina]
   * @example
   * ```ts
   * // NS2:
   * function getStaminaPercentage() {
   *    const [current, max] = getStamina(ns);
   *    return current / max;
   * }
   * ```
   * @param ns - NS instance passed to the main function.
   * @returns Array containing current stamina and max stamina.
   */
  export function getStamina(ns: NS): [number, number];

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
   * @param ns - NS instance passed to the main function.
   * @returns True if you successfully join the Bladeburner faction, or if you are already a member, false otherwise.
   */
  export function joinBladeburnerFaction(ns: NS): boolean;

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
   * @param ns - NS instance passed to the main function.
   * @returns True if you successfully join the Bladeburner division, or if you are already a member, false otherwise.
   */
  export function joinBladeburnerDivision(ns: NS): boolean;

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
   * @param ns - NS instance passed to the main function.
   * @returns Amount of accumulated “bonus time” (milliseconds) for the Bladeburner mechanic.
   */
  export function getBonusTime(ns: NS): number;
}

/**
 * Coding Contract API
 * @public
 */
declare module "ns/codingcontract" {
  import {NS} from 'ns';

  /**
   * Options to affect the behavior of {@link CodingContract} attempt.
   * @public
   */
  export interface CodingAttemptOptions {
    /** If truthy, then the function will return a string that states the contract’s reward when it is successfully solved. */
    returnReward: boolean;
  }

  /**
   * Attemps a coding contract.
   * @remarks
   * RAM cost: 10 GB
   *
   * Attempts to solve the Coding Contract with the provided solution.
   *
   * @param ns - NS instance passed to the main function.
   * @param answer - Solution for the contract.
   * @param filename - Filename of the contract.
   * @param host - Host of the server containing the contract. Optional. Defaults to current server if not provided.
   * @param opts - Optional parameters for configuring function behavior.
   * @returns True if the solution was correct, false otherwise. If the returnReward option is configured, then the function will instead return a string. If the contract is successfully solved, the string will contain a description of the contract’s reward. Otherwise, it will be an empty string.
   */
  export function attempt(ns: NS, answer: string[] | number, filename: string, host?: string, opts?: CodingAttemptOptions): boolean | string;

  /**
   * Get the type of a coding contract.
   * @remarks
   * RAM cost: 5 GB
   *
   * Returns a name describing the type of problem posed by the Coding Contract.
   * (e.g. Find Largest Prime Factor, Total Ways to Sum, etc.)
   *
   * @param ns - NS instance passed to the main function.
   * @param filename - Filename of the contract.
   * @param host - Host of the server containing the contract. Optional. Defaults to current server if not provided.
   * @returns Name describing the type of problem posed by the Coding Contract.
   */
  export function getContractType(ns: NS, filename: string, host?: string): string;

  /**
   * Get the description.
   * @remarks
   * RAM cost: 5 GB
   *
   * Get the full text description for the problem posed by the Coding Contract.
   *
   * @param ns - NS instance passed to the main function.
   * @param filename - Filename of the contract.
   * @param host - Host of the server containing the contract. Optional. Defaults to current server if not provided.
   * @returns Contract’s text description.
   */
  export function getDescription(ns: NS, filename: string, host?: string): string;

  /**
   * Get the input data.
   * @remarks
   * RAM cost: 5 GB
   *
   * Get the data associated with the specific Coding Contract.
   * Note that this is not the same as the contract’s description.
   * This is just the data that the contract wants you to act on in order to solve
   *
   * @param ns - NS instance passed to the main function.
   * @param filename - Filename of the contract.
   * @param host - Host of the server containing the contract. Optional. Defaults to current server if not provided.
   * @returns The specified contract’s data, data type depends on contract type.;
   */
  export function getData(ns: NS, filename: string, host?: string): any;

  /**
   * Get the number of attempt remaining.
   * @remarks
   * RAM cost: 2 GB
   *
   * Get the number of tries remaining on the contract before it self-destructs.
   *
   * @param ns - NS instance passed to the main function.
   * @param filename - Filename of the contract.
   * @param host - Host of the server containing the contract. Optional. Defaults to current server if not provided.
   * @returns How many attempts are remaining for the contract;
   */
  export function getNumTriesRemaining(ns: NS, filename: string, host?: string): number;
}

/**
 * Gang API
 * @remarks
 * If you are not in BitNode-2, then you must have Source-File 2 in order to use this API.
 * @public
 */
declare module "ns/gang" {
  import {NS} from 'ns';

  /**
   * Gang general info.
   * @public
   */
  export interface GangGenInfo {
    /** Name of faction that the gang belongs to ("Slum Snakes", etc.) */
    faction: string;
    /** Indicating whether or not it's a hacking gang */
    isHacking: boolean;
    /** Money earned per game cycle */
    moneyGainRate: number;
    /** Gang's power for territory warfare */
    power: number;
    /** Gang's respect */
    respect: number;
    /** Respect earned per game cycle */
    respectGainRate: number;
    /** Amount of territory held */
    territory: number;
    /** Clash chance */
    territoryClashChance: number;
    /** Gang's wanted level */
    wantedLevel: number;
    /** Wanted level gained/lost per game cycle (negative for losses) */
    wantedLevelGainRate: number;
    /** Indicating if territory warfare is enabled */
    territoryWarfareEngaged: boolean;
    /** Number indicating the current wanted penalty */
    wantedPenalty: number;
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
    "Slum Snakes": GangOtherInfoObject;
    Tetrads: GangOtherInfoObject;
    "The Syndicate": GangOtherInfoObject;
    "The Dark Army": GangOtherInfoObject;
    "Speakers for the Dead": GangOtherInfoObject;
    NiteSec: GangOtherInfoObject;
    "The Black Hand": GangOtherInfoObject;
  }

  /**
   * @public
   */
  export interface GangMemberInfo {
    name: string;
    task: string;
    earnedRespect: number;
    hack: number;
    str: number;
    def: number;
    dex: number;
    agi: number;
    cha: number;

    hack_exp: number;
    str_exp: number;
    def_exp: number;
    dex_exp: number;
    agi_exp: number;
    cha_exp: number;

    hack_mult: number;
    str_mult: number;
    def_mult: number;
    dex_mult: number;
    agi_mult: number;
    cha_mult: number;

    hack_asc_mult: number;
    str_asc_mult: number;
    def_asc_mult: number;
    dex_asc_mult: number;
    agi_asc_mult: number;
    cha_asc_mult: number;

    hack_asc_points: number;
    str_asc_points: number;
    def_asc_points: number;
    dex_asc_points: number;
    agi_asc_points: number;
    cha_asc_points: number;

    upgrades: string[];
    augmentations: string[];

    respectGain: number;
    wantedLevelGain: number;
    moneyGain: number;
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
    str?: number;
    /** Defense multiplier */
    def?: number;
    /** Dexterity multiplier */
    dex?: number;
    /** Agility multiplier */
    agi?: number;
    /** Charisma multiplier */
    cha?: number;
    /** Hacking multiplier */
    hack?: number;
  }

  /**
   * @public
   */
  export interface GangMemberAscension {
    /** Amount of respect lost from ascending */
    respect: number;
    /** Hacking multiplier gained from ascending */
    hack: number;
    /** Strength multiplier gained from ascending */
    str: number;
    /** Defense multiplier gained from ascending */
    def: number;
    /** Dexterity multiplier gained from ascending */
    dex: number;
    /** Agility multiplier gained from ascending */
    agi: number;
    /** Charisma multiplier gained from ascending */
    cha: number;
  }

  /**
   * Create a gang.
   * @remarks
   * RAM cost: 1GB
   *
   * Create a gang with the specified faction.
   * @param ns - NS instance passed to the main function.
   * @returns True if the gang was created, false otherwise.
   */
  export function createGang(ns: NS, faction: string): boolean;

  /**
   * Check if you're in a gang.
   * @remarks
   * RAM cost: 1GB
   * @param ns - NS instance passed to the main function.
   * @returns True if you're in a gang, false otherwise.
   */
  export function inGang(ns: NS): boolean;

  /**
   * List all gang members.
   * @remarks
   * RAM cost: 1 GB
   *
   * Get the names of all Gang members
   *
   * @param ns - NS instance passed to the main function.
   * @returns Names of all Gang members.
   */
  export function getMemberNames(ns: NS): string[];

  /**
   * Get information about your gang.
   * @remarks
   * RAM cost: 2 GB
   *
   * Get general information about the gang.
   *
   * @param ns - NS instance passed to the main function.
   * @returns Object containing general information about the gang.
   */
  export function getGangInformation(ns: NS): GangGenInfo;

  /**
   * Get information about the other gangs.
   * @remarks
   * RAM cost: 2 GB
   *
   * Get territory and power information about all gangs.
   *
   * @param ns - NS instance passed to the main function.
   * @returns Object containing territory and power information about all gangs.
   */
  export function getOtherGangInformation(ns: NS): GangOtherInfo;

  /**
   * Get information about a specific gang member.
   * @remarks
   * RAM cost: 2 GB
   *
   * Get stat and equipment-related information about a Gang Member
   *
   * @param ns - NS instance passed to the main function.
   * @param name - Name of member.
   * @returns Object containing stat and equipment-related information about a Gang Member.
   */
  export function getMemberInformation(ns: NS, name: string): GangMemberInfo;

  /**
   * Check if you can recruit a new gang member.
   * @remarks
   * RAM cost: 1 GB
   *
   * Returns boolean indicating whether a member can currently be recruited
   *
   * @param ns - NS instance passed to the main function.
   * @returns True if a member can currently be recruited, false otherwise.
   */
  export function canRecruitMember(ns: NS): boolean;

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
   * @param ns - NS instance passed to the main function.
   * @param name - Name of member to recruit.
   * @returns True if the member was successfully recruited, false otherwise.
   */
  export function recruitMember(ns: NS, name: string): boolean;

  /**
   * List member task names.
   * @remarks
   * RAM cost: 1 GB
   *
   * Get the name of all valid tasks that Gang members can be assigned to.
   *
   * @param ns - NS instance passed to the main function.
   * @returns All valid tasks that Gang members can be assigned to.
   */
  export function getTaskNames(ns: NS): string[];

  /**
   * Set gang member to task.
   * @remarks
   * RAM cost: 2 GB
   *
   * Attempts to assign the specified Gang Member to the specified task.
   * If an invalid task is specified, the Gang member will be set to idle (“Unassigned”).
   *
   * @param ns - NS instance passed to the main function.
   * @param memberName - Name of Gang member to assign.
   * @param taskName - Task to assign.
   * @returns True if the Gang Member was successfully assigned to the task, false otherwise.
   */
  export function setMemberTask(ns: NS, memberName: string, taskName: string): boolean;

  /**
   * Get stats of a task.
   * @remarks
   * RAM cost: 1 GB
   *
   * Get the stats of a gang task stats. This is typically used to evaluate which action should be executed next.
   *
   * @param ns - NS instance passed to the main function.
   * @param name -  Name of the task.
   * @returns Detailed stats of a task.
   */
  export function getTaskStats(ns: NS, name: string): GangTaskStats;

  /**
   * List equipment names.
   * @remarks
   * RAM cost: 1 GB
   *
   * Get the name of all possible equipment/upgrades you can purchase for your Gang Members.
   * This includes Augmentations.
   *
   * @param ns - NS instance passed to the main function.
   * @returns Names of all Equipments/Augmentations.
   */
  export function getEquipmentNames(ns: NS): string[];

  /**
   * Get cost of equipment.
   * @remarks
   * RAM cost: 2 GB
   *
   * Get the amount of money it takes to purchase a piece of Equipment or an Augmentation.
   * If an invalid Equipment/Augmentation is specified, this function will return Infinity.
   *
   * @param ns - NS instance passed to the main function.
   * @param equipName - Name of equipment.
   * @returns Cost to purchase the specified Equipment/Augmentation (number). Infinity for invalid arguments
   */
  export function getEquipmentCost(ns: NS, equipName: string): number;

  /**
   * Get type of an equipment.
   * @remarks
   * RAM cost: 2 GB
   *
   * Get the specified equipment type.
   *
   * @param ns - NS instance passed to the main function.
   * @param equipName - Name of equipment.
   * @returns Type of the equipment.
   */
  export function getEquipmentType(ns: NS, equipName: string): string;

  /**
   * Get stats of an equipment.
   * @remarks
   * RAM cost: 2 GB
   *
   * Get the specified equipment stats.
   *
   * @param ns - NS instance passed to the main function.
   * @param equipName - Name of equipment.
   * @returns A dictionary containing the stats of the equipment.
   */
  export function getEquipmentStats(ns: NS, equipName: string): EquipmentStats;

  /**
   * Purchase an equipment for a gang member.
   * @remarks
   * RAM cost: 4 GB
   *
   * Attempt to purchase the specified Equipment/Augmentation for the specified Gang member.
   *
   * @param ns - NS instance passed to the main function.
   * @param memberName - Name of Gang member to purchase the equipment for.
   * @param equipName - Name of Equipment/Augmentation to purchase.
   * @returns True if the equipment was successfully purchased. False otherwise
   */
  export function purchaseEquipment(ns: NS, memberName: string, equipName: string): boolean;

  /**
   * Ascend a gang member.
   * @remarks
   * RAM cost: 4 GB
   *
   * Ascend the specified Gang Member.
   *
   * @param ns - NS instance passed to the main function.
   * @param memberName - Name of member to ascend.
   * @returns Object with info about the ascension results. undefined if ascension did not occur.
   */
  export function ascendMember(ns: NS, memberName: string): GangMemberAscension | undefined;

  /**
   * Get the result of an ascension without ascending.
   * @remarks
   * RAM cost: 2 GB
   *
   * Get the result of an ascension without ascending.
   *
   * @param ns - NS instance passed to the main function.
   * @param memberName - Name of member.
   * @returns Object with info about the ascension results. undefined if ascension is impossible.
   */
  export function getAscensionResult(ns: NS, memberName: string): GangMemberAscension | undefined;

  /**
   * Enable/Disable territory warfare.
   * @remarks
   * RAM cost: 2 GB
   *
   * Set whether or not the gang should engage in territory warfare
   *
   * @param ns - NS instance passed to the main function.
   * @param engage - Whether or not to engage in territory warfare.
   */
  export function setTerritoryWarfare(ns: NS, engage: boolean): void;

  /**
   * Get chance to win clash with other gang.
   * @remarks
   * RAM cost: 4 GB
   *
   * Returns the chance you have to win a clash with the specified gang. The chance is returned in decimal form, not percentage
   *
   * @param ns - NS instance passed to the main function.
   * @param gangName - Target gang
   * @returns Chance you have to win a clash with the specified gang.
   */
  export function getChanceToWinClash(ns: NS, gangName: string): number;

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
   * @param ns - NS instance passed to the main function.
   * @returns Bonus time for the Gang mechanic in milliseconds.
   */
  export function getBonusTime(ns: NS): number;
}

/**
 * Sleeve API
 * @remarks
 * If you are not in BitNode-10, then you must have Source-File 10 in order to use this API.
 * @public
 */
declare module "ns/sleeve" {
  import {NS} from 'ns';

  /**
   * Object representing a sleeve stats.
   * @public
   */
  export interface SleeveSkills {
    /** Current shock of the sleeve [0-100] */
    shock: number;
    /** Current sync of the sleeve [0-100] */
    sync: number;
    /** Current hacking skill of the sleeve */
    hacking: number;
    /** Current strength of the sleeve */
    strength: number;
    /** Current defense of the sleeve */
    defense: number;
    /** Current dexterity of the sleeve */
    dexterity: number;
    /** Current agility of the sleeve */
    agility: number;
    /** Current charisma of the sleeve */
    charisma: number;
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
  export interface SleeveWorkGains {
    /** Hacking exp gained from work */
    workHackExpGain: number;
    /** Strength exp gained from work */
    workStrExpGain: number;
    /** Defense exp gained from work, */
    workDefExpGain: number;
    /** Dexterity exp gained from work */
    workDexExpGain: number;
    /** Agility exp gained from work */
    workAgiExpGain: number;
    /** Charisma exp gained from work */
    workChaExpGain: number;
    /** Money gained from work */
    workMoneyGain: number;
  }

  /**
   * Object representing sleeve information.
   * @public
   */
  export interface SleeveInformation {
    /** Location of the sleeve */
    city: string;
    /** Current hp of the sleeve */
    hp: number;
    /** Max hp of the sleeve */
    maxHp: number;
    /** Jobs available to the sleeve */
    jobs: string[];
    /** Job titles available to the sleeve */
    jobTitle: string[];
    /** Does this sleeve have access to the tor router */
    tor: boolean;
    /** Sleeve multipliers */
    mult: CharacterMult;
    /** Time spent on the current task in milliseconds */
    timeWorked: number;
    /** Earnings synchronized to other sleeves */
    earningsForSleeves: SleeveWorkGains;
    /** Earnings synchronized to the player */
    earningsForPlayer: SleeveWorkGains;
    /** Earnings for this sleeve */
    earningsForTask: SleeveWorkGains;
    /** Faction or company reputation gained for the current task */
    workRepGain: number;
  }

  /**
   * Object representing a sleeve current task.
   * @public
   */
  export interface SleeveTask {
    /** Task type */
    task: string;
    /** Crime currently attempting, if any */
    crime: string;
    /** Location of the task, if any */
    location: string;
    /** Stat being trained at the gym, if any */
    gymStatType: string;
    /** Faction work type being performed, if any */
    factionWorkType: string;
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
   * Get the number of sleeves you own.
   * @remarks
   * RAM cost: 4 GB
   *
   * Return the number of duplicate sleeves the player has.
   *
   * @param ns - NS instance passed to the main function.
   * @returns number of duplicate sleeves the player has.
   */
  export function getNumSleeves(ns: NS): number;

  /**
   * Get the stats of a sleeve.
   * @remarks
   * RAM cost: 4 GB
   *
   * Return a structure containing the stats of the sleeve.
   *
   * @param ns - NS instance passed to the main function.
   * @param sleeveNumber - Index of the sleeve to get stats of.
   * @returns Object containing the stats of the sleeve.
   */
  export function getSleeveStats(ns: NS, sleeveNumber: number): SleeveSkills;

  /**
   * Get information about a sleeve.
   * @remarks
   * RAM cost: 4 GB
   *
   * Return a struct containing tons of information about this sleeve
   *
   * @param ns - NS instance passed to the main function.
   * @param sleeveNumber - Index of the sleeve to retrieve information.
   * @returns Object containing tons of information about this sleeve.
   */
  export function getInformation(ns: NS, sleeveNumber: number): SleeveInformation;

  /**
   * Get task of a sleeve.
   * @remarks
   * RAM cost: 4 GB
   *
   * Return the current task that the sleeve is performing. type is set to “Idle” if the sleeve isn’t doing anything.
   *
   * @param ns - NS instance passed to the main function.
   * @param sleeveNumber - Index of the sleeve to retrieve task from.
   * @returns Object containing information the current task that the sleeve is performing.
   */
  export function getTask(ns: NS, sleeveNumber: number): SleeveTask;

  /**
   * Set a sleeve to shock recovery.
   * @remarks
   * RAM cost: 4 GB
   *
   * Return a boolean indicating whether or not this action was set successfully.
   *
   * @param ns - NS instance passed to the main function.
   * @param sleeveNumber - Index of the sleeve to start recovery.
   * @returns True if this action was set successfully, false otherwise.
   */
  export function setToShockRecovery(ns: NS, sleeveNumber: number): boolean;

  /**
   * Set a sleeve to synchronize.
   * @remarks
   * RAM cost: 4 GB
   *
   * Return a boolean indicating whether or not this action was set successfully.
   *
   * @param ns - NS instance passed to the main function.
   * @param sleeveNumber - Index of the sleeve to start synchronizing.
   * @returns True if this action was set successfully, false otherwise.
   */
  export function setToSynchronize(ns: NS, sleeveNumber: number): boolean;

  /**
   * Set a sleeve to commit crime.
   * @remarks
   * RAM cost: 4 GB
   *
   * Return a boolean indicating whether or not this action was set successfully.
   *
   * Returns false if an invalid action is specified.
   *
   * @param ns - NS instance passed to the main function.
   * @param sleeveNumber - Index of the sleeve to start commiting crime.
   * @param name - Name of the crime. Must be an exact match.
   * @returns True if this action was set successfully, false otherwise.
   */
  export function setToCommitCrime(ns: NS, sleeveNumber: number, name: string): boolean;

  /**
   * Set a sleeve to work for a faction.
   * @remarks
   * RAM cost: 4 GB
   *
   * Return a boolean indicating whether or not the sleeve started working or this faction.
   *
   * @param ns - NS instance passed to the main function.
   * @param sleeveNumber - Index of the sleeve to work for the faction.
   * @param factionName - Name of the faction to work for.
   * @param factionWorkType - Name of the action to perform for this faction.
   * @returns True if the sleeve started working on this faction, false otherwise.
   */
  export function setToFactionWork(ns: NS, sleeveNumber: number, factionName: string, factionWorkType: string): boolean;

  /**
   * Set a sleeve to work for a company.
   * @remarks
   * RAM cost: 4 GB
   *
   * Return a boolean indicating whether or not the sleeve started working or this company.
   *
   * @param ns - NS instance passed to the main function.
   * @param sleeveNumber - Index of the sleeve to work for the company.
   * @param companyName - Name of the company to work for.
   * @returns True if the sleeve started working on this company, false otherwise.
   */
  export function setToCompanyWork(ns: NS, sleeveNumber: number, companyName: string): boolean;

  /**
   * Set a sleeve to take a class at a university.
   * @remarks
   * RAM cost: 4 GB
   *
   * Return a boolean indicating whether or not this action was set successfully.
   *
   * @param ns - NS instance passed to the main function.
   * @param sleeveNumber - Index of the sleeve to start taking class.
   * @param university - Name of the university to attend.
   * @param className - Name of the class to follow.
   * @returns True if this action was set successfully, false otherwise.
   */
  export function setToUniversityCourse(ns: NS, sleeveNumber: number, university: string, className: string): boolean;

  /**
   * Set a sleeve to workout at the gym.
   * @remarks
   * RAM cost: 4 GB
   *
   * Return a boolean indicating whether or not the sleeve started working out.
   *
   * @param ns - NS instance passed to the main function.
   * @param sleeveNumber - Index of the sleeve to workout at the gym.
   * @param gymName - Name of the gym.
   * @param stat - Name of the stat to train.
   * @returns True if the sleeve started working out, false otherwise.
   */
  export function setToGymWorkout(ns: NS, sleeveNumber: number, gymName: string, stat: string): boolean;

  /**
   * Make a sleeve travel to another city.
   * @remarks
   * RAM cost: 4 GB
   *
   * Return a boolean indicating whether or not the sleeve reached destination.
   *
   * @param ns - NS instance passed to the main function.
   * @param sleeveNumber - Index of the sleeve to travel.
   * @param cityName - Name of the destination city.
   * @returns True if the sleeve reached destination, false otherwise.
   */
  export function travel(ns: NS, sleeveNumber: number, cityName: string): boolean;

  /**
   * Get augmentations installed on a sleeve.
   * @remarks
   * RAM cost: 4 GB
   *
   * Return a list of augmentation names that this sleeve has installed.
   *
   * @param ns - NS instance passed to the main function.
   * @param sleeveNumber - Index of the sleeve to retrieve augmentations from.
   * @returns List of augmentation names that this sleeve has installed.
   */
  export function getSleeveAugmentations(ns: NS, sleeveNumber: number): string[];

  /**
   * List purchasable augs for a sleeve.
   * @remarks
   * RAM cost: 4 GB
   *
   * Return a list of augmentations that the player can buy for this sleeve.
   *
   * @param ns - NS instance passed to the main function.
   * @param sleeveNumber - Index of the sleeve to retrieve purchasable augmentations from.
   * @returns List of augmentations that the player can buy for this sleeve.
   */
  export function getSleevePurchasableAugs(ns: NS, sleeveNumber: number): AugmentPair[];

  /**
   * Purchase an aug for a sleeve.
   * @remarks
   * RAM cost: 4 GB
   *
   * Return true if the aug was purchased and installed on the sleeve.
   *
   * @param ns - NS instance passed to the main function.
   * @param sleeveNumber - Index of the sleeve to buy an aug for.
   * @param augName - Name of the aug to buy. Must be an exact match.
   * @returns True if the aug was purchased and installed on the sleeve, false otherwise.
   */
  export function purchaseSleeveAug(ns: NS, sleeveNumber: number, augName: string): boolean;
}

/**
 * Stock market API
 * @public
 */
declare module "ns/stock" {
  import {NS} from 'ns';

  /**
   * @public
   */
  export enum PositionTypes {
    Long = "L",
    Short = "S",
  }

  /**
   * @public
   */
  export enum OrderTypes {
    LimitBuy = "Limit Buy Order",
    LimitSell = "Limit Sell Order",
    StopBuy = "Stop Buy Order",
    StopSell = "Stop Sell Order",
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
    type: OrderTypes;
    /** Order position */
    position: PositionTypes;
  }

  /**
   * Return value of {@link TIX.getOrders | getOrders}
   *
   * Keys are stock symbols, properties are arrays of {@link StockOrderObject}
   * @public
   */
  export interface StockOrder {
    [key: string]: StockOrderObject[];
  }

  /**
   * Returns an array of the symbols of the tradable stocks
   *
   * @remarks RAM cost: 2 GB
   * @param ns - NS instance passed to the main function.
   * @returns Array of the symbols of the tradable stocks.
   */
  export function getSymbols(ns: NS): string[];

  /**
   * Returns the price of a stock
   *
   * @remarks
   * RAM cost: 2 GB
   * The stock’s price is the average of its bid and ask price.
   *
   * @example
   * ```ts
   * // NS2
   * getPrice(ns, "FISG");
   * ```
   * @param ns - NS instance passed to the main function.
   * @param sym - Stock symbol.
   * @returns The price of a stock.
   */
  export function getPrice(ns: NS, sym: string): number;

  /**
   * Returns the ask price of that stock.
   * @remarks RAM cost: 2 GB
   *
   * @param ns - NS instance passed to the main function.
   * @param sym - Stock symbol.
   * @returns The ask price of a stock.
   */
  export function getAskPrice(ns: NS, sym: string): number;

  /**
   * Returns the bid price of that stock.
   * @remarks RAM cost: 2 GB
   *
   * @param ns - NS instance passed to the main function.
   * @param sym - Stock symbol.
   * @returns The bid price of a stock.
   */
  export function getBidPrice(ns: NS, sym: string): number;

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
   * // NS2
   * const [shares, avgPx, sharesShort, avgPxShort] = getPosition(ns, "ECP");
   * ```
   * @param ns - NS instance passed to the main function.
   * @param sym - Stock symbol.
   * @returns Array of four elements that represents the player’s position in a stock.
   */
  export function getPosition(ns: NS, sym: string): [number, number, number, number];

  /**
   * Returns the maximum number of shares of a stock.
   * @remarks
   * RAM cost: 2 GB
   * This is the maximum amount of the stock that can be purchased
   * in both the Long and Short positions combined.
   *
   * @param ns - NS instance passed to the main function.
   * @param sym - Stock symbol.
   * @returns Maximum number of shares that the stock has.
   */
  export function getMaxShares(ns: NS, sym: string): number;

  /**
   * Calculates cost of buying stocks.
   * @remarks
   * RAM cost: 2 GB
   * Calculates and returns how much it would cost to buy a given number of shares of a stock.
   * This takes into account spread, large transactions influencing the price of the stock and commission fees.
   *
   * @param ns - NS instance passed to the main function.
   * @param sym - Stock symbol.
   * @param shares - Number of shares to purchase.
   * @param posType - Specifies whether the order is a “Long” or “Short” position.
   * @returns Cost to buy a given number of shares of a stock.
   */
  export function getPurchaseCost(ns: NS, sym: string, shares: number, posType: string): number;

  /**
   * Calculate profit of selling stocks.
   * @remarks
   * RAM cost: 2 GB
   * Calculates and returns how much you would gain from selling a given number of shares of a stock.
   * This takes into account spread, large transactions influencing the price of the stock and commission fees.
   *
   * @param ns - NS instance passed to the main function.
   * @param sym - Stock symbol.
   * @param shares - Number of shares to sell.
   * @param posType - Specifies whether the order is a “Long” or “Short” position.
   * @returns Gain from selling a given number of shares of a stock.
   */
  export function getSaleGain(ns: NS, sym: string, shares: number, posType: string): number;

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
   * @param ns - NS instance passed to the main function.
   * @param sym - Stock symbol.
   * @param shares - Number of shares to purchased. Must be positive. Will be rounded to nearest integer.
   * @returns The stock price at which each share was purchased, otherwise 0 if the shares weren't purchased.
   */
  export function buy(ns: NS, sym: string, shares: number): number;

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
   * @param ns - NS instance passed to the main function.
   * @param sym - Stock symbol.
   * @param shares - Number of shares to sell. Must be positive. Will be rounded to nearest integer.
   * @returns The stock price at which each share was sold, otherwise 0 if the shares weren't sold.
   */
  export function sell(ns: NS, sym: string, shares: number): number;

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
   * @param ns - NS instance passed to the main function.
   * @param sym - Stock symbol.
   * @param shares - Number of shares to short. Must be positive. Will be rounded to nearest integer.
   * @returns The stock price at which each share was purchased, otherwise 0 if the shares weren't purchased.
   */
  export function short(ns: NS, sym: string, shares: number): number;

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
   * @param ns - NS instance passed to the main function.
   * @param sym - Stock symbol.
   * @param shares - Number of shares to sell. Must be positive. Will be rounded to nearest integer.
   * @returns The stock price at which each share was sold, otherwise 0 if the shares weren't sold.
   */
  export function sellShort(ns: NS, sym: string, shares: number): number;

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
   * @param ns - NS instance passed to the main function.
   * @param sym - Stock symbol.
   * @param shares - Number of shares for order. Must be positive. Will be rounded to nearest integer.
   * @param price - Execution price for the order.
   * @param type - Type of order.
   * @param pos - Specifies whether the order is a “Long” or “Short” position.
   * @returns True if the order is successfully placed, and false otherwise.
   */
  export function placeOrder(ns: NS, sym: string, shares: number, price: number, type: string, pos: string): boolean;

  /**
   * Cancel order for stocks.
   * @remarks
   * RAM cost: 2.5 GB
   * Cancels an oustanding Limit or Stop order on the stock market.
   *
   * The ability to use limit and stop orders is **not** immediately available to the player and
   * must be unlocked later on in the game.
   *
   * @param ns - NS instance passed to the main function.
   * @param sym - Stock symbol.
   * @param shares - Number of shares for order. Must be positive. Will be rounded to nearest integer.
   * @param price - Execution price for the order.
   * @param type - Type of order.
   * @param pos - Specifies whether the order is a “Long” or “Short” position.
   */
  export function cancelOrder(ns: NS, sym: string, shares: number, price: number, type: string, pos: string): void;

  /**
   * Returns your order book for the stock market.
   * @remarks
   * RAM cost: 2.5 GB
   * This is an object containing information for all the Limit and Stop Orders you have in the stock market.
   * For each symbol you have a position in, the returned object will have a key with that symbol's name.
   * The object's properties are each an array of {@link StockOrderObject}
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
   * @param ns - NS instance passed to the main function.
   * @returns Object containing information for all the Limit and Stop Orders you have in the stock market.
   */
  export function getOrders(ns: NS): StockOrder;

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
   * @param ns - NS instance passed to the main function.
   * @param sym - Stock symbol.
   * @returns Volatility of the specified stock.
   */
  export function getVolatility(ns: NS, sym: string): number;

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
   * @param ns - NS instance passed to the main function.
   * @param sym - Stock symbol.
   * @returns Probability that the specified stock’s price will increase (as opposed to decrease) during the next tick.
   */
  export function getForecast(ns: NS, sym: string): number;

  /**
   * Purchase 4S Market Data Access.
   * @remarks RAM cost: 2.5 GB
   * @param ns - NS instance passed to the main function.
   * @returns True if you successfully purchased it or if you already have access, false otherwise.
   */
  export function purchase4SMarketData(ns: NS): boolean;

  /**
   * Purchase 4S Market Data TIX API Access.
   * @remarks RAM cost: 2.5 GB
   * @param ns - NS instance passed to the main function.
   * @returns True if you successfully purchased it or if you already have access, false otherwise.
   */
  export function purchase4SMarketDataTixApi(ns: NS): boolean;
}

/**
 * Skills formulas
 * @public
 */
declare module "ns/formulas/skills" {
  import {NS} from 'ns';

  /**
   * Calculate skill level.
   * @param ns - NS instance passed to the main function.
   * @param exp - experience for that skill
   * @param skillMult - Multiplier for that skill, defaults to 1.
   * @returns The calculated skill level.
   */
  export function calculateSkill(ns: NS, exp: number, skillMult?: number): number;
  /**
   * Calculate exp for skill level.
   * @param ns - NS instance passed to the main function.
   * @param skill - target skill level
   * @param skillMult - Multiplier for that skill, defaults to 1.
   * @returns The calculated exp required.
   */
  export function calculateExp(ns: NS, skill: number, skillMult?: number): number;
}

/**
 * Hacking formulas
 * @public
 */
declare module "ns/formulas/hacking" {
  import {NS, Server, Player} from 'ns';

  /**
   * Calculate hack chance.
   * @param ns - NS instance passed to the main function.
   * @param server - Server info from {@link getServer}
   * @param player - Player info from {@link getPlayer}
   * @returns The calculated hack chance.
   */
  export function hackChance(ns: NS, server: Server, player: Player): number;
  /**
   * Calculate hack exp for one thread.
   * @remarks
   * Multiply by thread to get total exp
   * @param ns - NS instance passed to the main function.
   * @param server - Server info from {@link getServer}
   * @param player - Player info from {@link getPlayer}
   * @returns The calculated hack exp.
   */
  export function hackExp(ns: NS, server: Server, player: Player): number;
  /**
   * Calculate hack percent for one thread.
   * @remarks
   * Multiply by thread to get total percent hacked.
   * @param ns - NS instance passed to the main function.
   * @param server - Server info from {@link getServer}
   * @param player - Player info from {@link getPlayer}
   * @returns The calculated hack percent.
   */
  export function hackPercent(ns: NS, server: Server, player: Player): number;
  /**
   * Calculate the percent a server would grow.
   * @param ns - NS instance passed to the main function.
   * @param server - Server info from {@link getServer}
   * @param threads - Amount of thread.
   * @param player - Player info from {@link getPlayer}
   * @param cores - Number of cores on the computer that will execute grow.
   * @returns The calculated grow percent.
   */
  export function growPercent(ns: NS, server: Server, threads: number, player: Player, cores?: number): number;
  /**
   * Calculate hack time.
   * @param ns - NS instance passed to the main function.
   * @param server - Server info from {@link getServer}
   * @param player - Player info from {@link getPlayer}
   * @returns The calculated hack time.
   */
  export function hackTime(ns: NS, server: Server, player: Player): number;
  /**
   * Calculate grow time.
   * @param ns - NS instance passed to the main function.
   * @param server - Server info from {@link getServer}
   * @param player - Player info from {@link getPlayer}
   * @returns The calculated grow time.
   */
  export function growTime(ns: NS, server: Server, player: Player): number;
  /**
   * Calculate weaken time.
   * @param ns - NS instance passed to the main function.
   * @param server - Server info from {@link getServer}
   * @param player - Player info from {@link getPlayer}
   * @returns The calculated weaken time.
   */
  export function weakenTime(ns: NS, server: Server, player: Player): number;
}

/**
 * Hacknet Node formulas
 * @public
 */
declare module "ns/formulas/hacknetNodes" {
  import {NS} from 'ns';

  /**
   * Hacknet node related constants
   * @public
   */
  export interface HacknetNodeConstants {
    /** Amount of money gained per level */
    MoneyGainPerLevel: number;
    /** Base cost for a new node */
    BaseCost: number;
    /** Base cost per level */
    LevelBaseCost: number;
    /** Base cost to incrase RAM */
    RamBaseCost: number;
    /** Base cost to increase cores */
    CoreBaseCost: number;
    /** Multiplier to purchase new node */
    PurchaseNextMult: number;
    /** Multiplier to increase node level */
    UpgradeLevelMult: number;
    /** Multiplier to increase RAM */
    UpgradeRamMult: number;
    /** Multiplier to increase cores */
    UpgradeCoreMult: number;
    /** Max node level */
    MaxLevel: number;
    /** Max amount of RAM in GB */
    MaxRam: number;
    /** Max number of cores */
    MaxCores: number;
  }

  /**
   * Calculate money gain rate.
   * @param ns - NS instance passed to the main function.
   * @param level - level of the node.
   * @param ram - ram of the node.
   * @param cores - cores of the node.
   * @param mult - player production mult (default to 1)
   * @returns The calculated money gain rate.
   */
  export function moneyGainRate(ns: NS, level: number, ram: number, cores: number, mult?: number): number;
  /**
   * Calculate cost of upgrading hacknet node level.
   * @param ns - NS instance passed to the main function.
   * @param startingLevel - starting level
   * @param extraLevels - amount of level to purchase (defaults to 1)
   * @param costMult - player cost reduction (default to 1)
   * @returns The calculated cost.
   */
  export function levelUpgradeCost(ns: NS, startingLevel: number, extraLevels?: number, costMult?: number): number;
  /**
   * Calculate cost of upgrading hacknet node ram.
   * @param ns - NS instance passed to the main function.
   * @param startingRam - starting ram
   * @param extraLevels - amount of level of ram to purchase (defaults to 1)
   * @param costMult - player cost reduction (default to 1)
   * @returns The calculated cost.
   */
  export function ramUpgradeCost(ns: NS, startingRam: number, extraLevels?: number, costMult?: number): number;
  /**
   * Calculate cost of upgrading hacknet node cores.
   * @param ns - NS instance passed to the main function.
   * @param startingCore - starting cores
   * @param extraCores - amount of cores to purchase (defaults to 1)
   * @param costMult - player cost reduction (default to 1)
   * @returns The calculated cost.
   */
  export function coreUpgradeCost(ns: NS, startingCore: number, extraCores?: number, costMult?: number): number;
  /**
   * Calculate the cost of a hacknet node.
   * @param ns - NS instance passed to the main function.
   * @param n - number of the hacknet node
   * @param mult - player cost reduction (defaults to 1)
   * @returns The calculated cost.
   */
  export function hacknetNodeCost(ns: NS, n: number, mult: number): number;
  /**
   * All constants used by the game.
   * @param ns - NS instance passed to the main function.
   * @returns An object with all hacknet node constants used by the game.
   */
  export function constants(ns: NS): HacknetNodeConstants;
}

/**
 * Hacknet Server formulas
 * @public
 */
declare module "ns/formulas/hacknetServers" {
  import {NS} from 'ns';

  /**
   * Hacknet server related constants
   * @public
   */
  export interface HacknetServerConstants {
    /** Number of hashes calculated per level */
    HashesPerLevel: number;
    /** Base cost for a new server */
    BaseCost: number;
    /** Base cost to increase RAM */
    RamBaseCost: number;
    /** Base cost to increase cores */
    CoreBaseCost: number;
    /** Base cost to upgrade cache */
    CacheBaseCost: number;
    /** Multiplier to purchase a new server */
    PurchaseMult: number;
    /** Multiplier to increase server level */
    UpgradeLevelMult: number;
    /** Multiplier to increase RAM */
    UpgradeRamMult: number;
    /** Multiplier to increase cores */
    UpgradeCoreMult: number;
    /** Multiplier to upgrade cache */
    UpgradeCacheMult: number;
    /** Max number of servers */
    MaxServers: number;
    /** Max level for a server */
    MaxLevel: number;
    /** Max amount of RAM in GB */
    MaxRam: number;
    /** Max number of cores */
    MaxCores: number;
    /** Max cache size */
    MaxCache: number;
  }

  /**
   * Calculate hash gain rate.
   * @param ns - NS instance passed to the main function.
   * @param level - level of the server.
   * @param ramUsed - ramUsed of the server.
   * @param maxRam - maxRam of the server.
   * @param cores - cores of the server.
   * @param mult - player production mult (default to 1)
   * @returns The calculated hash gain rate.
   */
  export function hashGainRate(ns: NS, level: number, ramUsed: number, maxRam: number, cores: number, mult?: number): number;
  /**
   * Calculate cost of upgrading hacknet server level.
   * @param ns - NS instance passed to the main function.
   * @param startingLevel - starting level
   * @param extraLevels - amount of level to purchase (defaults to 1)
   * @param costMult - player cost reduction (default to 1)
   * @returns The calculated cost.
   */
  export function levelUpgradeCost(ns: NS, startingLevel: number, extraLevels?: number, costMult?: number): number;
  /**
   * Calculate cost of upgrading hacknet server ram.
   * @param ns - NS instance passed to the main function.
   * @param startingRam - starting ram
   * @param extraLevels - amount of level of ram to purchase (defaults to 1)
   * @param costMult - player cost reduction (default to 1)
   * @returns The calculated cost.
   */
  export function ramUpgradeCost(ns: NS, startingRam: number, extraLevels?: number, costMult?: number): number;
  /**
   * Calculate cost of upgrading hacknet server cores.
   * @param ns - NS instance passed to the main function.
   * @param startingCore - starting cores
   * @param extraCores - amount of cores to purchase (defaults to 1)
   * @param costMult - player cost reduction (default to 1)
   * @returns The calculated cost.
   */
  export function coreUpgradeCost(ns: NS, startingCore: number, extraCores?: number, costMult?: number): number;
  /**
   * Calculate cost of upgrading hacknet server cache.
   * @param ns - NS instance passed to the main function.
   * @param startingCache - starting cache level
   * @param extraCache - amount of levels of cache to purchase (defaults to 1)
   * @returns The calculated cost.
   */
  export function cacheUpgradeCost(ns: NS, startingCache: number, extraCache?: number): number;
  /**
   * Calculate hash cost of an upgrade.
   * @param ns - NS instance passed to the main function.
   * @param upgName - name of the upgrade
   * @param level - level of the upgrade
   * @returns The calculated hash cost.
   */
  export function hashUpgradeCost(ns: NS, upgName: number, level: number): number;
  /**
   * Calculate the cost of a hacknet server.
   * @param ns - NS instance passed to the main function.
   * @param n - number of the hacknet server
   * @param mult - player cost reduction (defaults to 1)
   * @returns The calculated cost.
   */
  export function hacknetServerCost(ns: NS, n: number, mult?: number): number;
  /**
   * All constants used by the game.
   * @param ns - NS instance passed to the main function.
   * @returns An object with all hacknet server constants used by the game.
   */
  export function constants(ns: NS): HacknetServerConstants;
}

/**
 * Gang formulas
 * @public
 */
declare module "ns/formulas/gang" {
  import {NS} from 'ns';
  import {GangGenInfo, GangMemberInfo, GangTaskStats} from "ns/gang";

  /**
   * Calculate the wanted penalty.
   * @param ns - NS instance passed to the main function.
   * @param gang - Gang info from {@link Gang.getGangInformation | getGangInformation}
   * @returns The calculated wanted penalty.
   */
  export function wantedPenalty(ns: NS, gang: GangGenInfo): number;
  /**
   * Calculate respect gain per tick.
   * @param ns - NS instance passed to the main function.
   * @param gang - Gang info from {@link Gang.getGangInformation | getGangInformation}
   * @param member - Gang info from {@link Gang.getMemberInformation | getMemberInformation}
   * @param task - Gang info from {@link Gang.getTaskStats | getTaskStats}
   * @returns The calculated respect gain.
   */
  export function respectGain(ns: NS, gang: GangGenInfo, member: GangMemberInfo, task: GangTaskStats): number;
  /**
   * Calculate wanted gain per tick.
   * @param ns - NS instance passed to the main function.
   * @param gang - Gang info from {@link Gang.getGangInformation | getGangInformation}
   * @param member - Member info from {@link Gang.getMemberInformation | getMemberInformation}
   * @param task - Task info from {@link Gang.getTaskStats | getTaskStats}
   * @returns The calculated wanted gain.
   */
  export function wantedLevelGain(ns: NS, gang: GangGenInfo, member: GangMemberInfo, task: GangTaskStats): number;
  /**
   * Calculate money gain per tick.
   * @param ns - NS instance passed to the main function.
   * @param gang - Gang info from {@link Gang.getGangInformation | getGangInformation}
   * @param member - Member info from {@link Gang.getMemberInformation | getMemberInformation}
   * @param task - Task info from {@link Gang.getTaskStats | getTaskStats}
   * @returns The calculated money gain.
   */
  export function moneyGain(ns: NS, gang: GangGenInfo, member: GangMemberInfo, task: GangTaskStats): number;

  /**
   * Calculate ascension point gain.
   * @param ns - NS instance passed to the main function.
   * @param exp - Experience point before ascension.
   * @returns The calculated ascension point gain.
   */
  export function ascensionPointsGain(ns: NS, exp: number): number;

  /**
   * Calculate ascension mult.
   * @param ns - NS instance passed to the main function.
   * @param points - Amount of ascension points.
   * @returns The calculated ascension mult.
   */
  export function ascensionMultiplier(ns: NS, points: number): number;
}

/**
 * Stanek's Gift API.
 * @public
 */
declare module "ns/stanek" {
  import {NS} from 'ns';

  /**
   * @public
   */
  export interface Fragment {
    id: number;
    shape: boolean[][];
    type: number;
    power: number;
    limit: number;
  }

  /**
   * @public
   */
  export interface ActiveFragment {
    id: number;
    avgCharge: number;
    numCharge: number;
    rotation: number;
    x: number;
    y: number;
  }

  /**
   * Stanek's Gift width.
   * @remarks
   * RAM cost: 0.4 GB
   * @param ns - NS instance passed to the main function.
   * @returns The width of the gift.
   */
  export function width(ns: NS): number;
  /**
   * Stanek's Gift height.
   * @remarks
   * RAM cost: 0.4 GB
   * @param ns - NS instance passed to the main function.
   * @returns The height of the gift.
   */
  export function height(ns: NS): number;

  /**
   * Charge a fragment, increasing its power.
   * @remarks
   * RAM cost: 0.4 GB
   * @param ns - NS instance passed to the main function.
   * @param rootX - rootX Root X against which to align the top left of the fragment.
   * @param rootY - rootY Root Y against which to align the top left of the fragment.
   * @returns Promise that lasts until the charge action is over.
   */
  export function charge(ns: NS, rootX: number, rootY: number): Promise<void>;

  /**
   * List possible fragments.
   * @remarks
   * RAM cost: 0 GB
   *
   * @param ns - NS instance passed to the main function.
   * @returns List of possible fragments.
   */
  export function fragmentDefinitions(ns: NS): Fragment[];

  /**
   * List of fragments in Stanek's Gift.
   * @remarks
   * RAM cost: 5 GB
   *
   * @param ns - NS instance passed to the main function.
   * @returns List of active fragments placed on Stanek's Gift.
   */
  export function activeFragments(ns: NS): ActiveFragment[];

  /**
   * Clear the board of all fragments.
   * @remarks
   * RAM cost: 0 GB
   * @param ns - NS instance passed to the main function.
   */
  export function clear(ns: NS): void;

  /**
   * Check if fragment can be placed at specified location.
   * @remarks
   * RAM cost: 0.5 GB
   *
   * @param ns - NS instance passed to the main function.
   * @param rootX - rootX Root X against which to align the top left of the fragment.
   * @param rootY - rootY Root Y against which to align the top left of the fragment.
   * @param rotation - rotation A number from 0 to 3, the mount of 90 degree turn to take.
   * @param fragmentId - fragmentId ID of the fragment to place.
   * @returns true if the fragment can be placed at that position. false otherwise.
   */
  export function canPlace(ns: NS, rootX: number, rootY: number, rotation: number, fragmentId: number): boolean;
  /**
   * Place fragment on Stanek's Gift.
   * @remarks
   * RAM cost: 5 GB
   *
   * @param ns - NS instance passed to the main function.
   * @param rootX - X against which to align the top left of the fragment.
   * @param rootY - Y against which to align the top left of the fragment.
   * @param rotation - A number from 0 to 3, the mount of 90 degree turn to take.
   * @param fragmentId - ID of the fragment to place.
   * @returns true if the fragment can be placed at that position. false otherwise.
   */
  export function place(ns: NS, rootX: number, rootY: number, rotation: number, fragmentId: number): boolean;
  /**
   * Get placed fragment at location.
   * @remarks
   * RAM cost: 5 GB
   *
   * @param ns - NS instance passed to the main function.
   * @param rootX - X against which to align the top left of the fragment.
   * @param rootY - Y against which to align the top left of the fragment.
   * @returns The fragment at [rootX, rootY], if any.
   */
  export function get(ns: NS, rootX: number, rootY: number): ActiveFragment | undefined;

  /**
   * Remove fragment at location.
   * @remarks
   * RAM cost: 0.15 GB
   *
   * @param ns - NS instance passed to the main function.
   * @param rootX - X against which to align the top left of the fragment.
   * @param rootY - Y against which to align the top left of the fragment.
   * @returns The fragment at [rootX, rootY], if any.
   */
  export function remove(ns: NS, rootX: number, rootY: number): boolean;
}

/**
 * Corporation API
 * @public
 */
declare module "ns/corporation" {
  import {NS} from 'ns';

  /**
   * Corporation investment offer
   * @public
   */
  export interface InvestmentOffer {
    /** Amount of funds you will get from this investment */
    funds: number;
    /** Amount of share you will give in exchange for this investment */
    shares: number;
    /** Current round of funding (max 4) */
    round: number;
  }

  /**
   * Corporation division
   * @public
   */
  interface Division {
    /** Name of the division */
    name: string;
    /** Type of division, like Aggriculture */
    type: string;
    /** Awareness of the division */
    awareness: number;
    /** Popularity of the division */
    popularity: number;
    /** Production multiplier */
    prodMult: number;
    /** Amount of research in that division */
    research: number;
    /** Revenue last cycle */
    lastCycleRevenue: number;
    /** Expenses last cycle */
    lastCycleExpenses: number;
    /** Revenue this cycle */
    thisCycleRevenue: number;
    /** Expenses this cycle */
    thisCycleExpenses: number;
    /** All research bought */
    upgrades: number[];
    /** Cities in which this division has expanded */
    cities: string[];
    /** Products developed by this division */
    products: string[];
  }

  /**
   * General info about a corporation
   * @public
   */
  interface CorporationInfo {
    /** Name of the corporation */
    name: string;
    /** Funds available */
    funds: number;
    /** Revenue per second this cycle */
    revenue: number;
    /** Expenses per second this cycle */
    expenses: number;
    /** Indicating if the company is public */
    public: boolean;
    /** Total number of shares issues by this corporation */
    totalShares: number;
    /** Amount of share owned */
    numShares: number;
    /** Cooldown until shares can be sold again */
    shareSaleCooldown: number;
    /** Amount of shares issued */
    issuedShares: number;
    /** Price of the shares */
    sharePrice: number;
    /** State of the corporation. Possible states are START, PURCHASE, PRODUCTION, SALE, EXPORT. */
    state: string;
    /** Array of all divisions */
    divisions: Division[];
  }

  /**
   * Create a Corporation
   * @param ns - NS instance passed to the main function.
   * @param divisionName - Name of the division
   * @param selfFund - If you should self fund, defaults to true, false will only work on Bitnode 3
   * @returns true if created and false if not
   */
  export function createCorporation(ns: NS, corporationName: string, selfFund: boolean): boolean;
  /**
   * Check if you have a one time unlockable upgrade
   * @param ns - NS instance passed to the main function.
   * @param upgradeName - Name of the upgrade
   * @returns true if unlocked and false if not
   */
  export function hasUnlockUpgrade(ns: NS, upgradeName: string): boolean;
  /**
   * Gets the cost to unlock a one time unlockable upgrade
   * @param ns - NS instance passed to the main function.
   * @param upgradeName - Name of the upgrade
   * @returns cost of the upgrade
   */
  export function getUnlockUpgradeCost(ns: NS, upgradeName: string): number;
  /**
   * Get the level of a levelable upgrade
   * @param ns - NS instance passed to the main function.
   * @param upgradeName - Name of the upgrade
   * @returns the level of the upgrade
   */
  export function getUpgradeLevel(ns: NS, upgradeName: string): number;
  /**
   * Gets the cost to unlock the next level of a levelable upgrade
   * @param ns - NS instance passed to the main function.
   * @param upgradeName - Name of the upgrade
   * @returns cost of the upgrade
   */
  export function getUpgradeLevelCost(ns: NS, upgradeName: string): number;
  /**
   * Gets the cost to expand into a new industry
   * @param ns - NS instance passed to the main function.
   * @param industryName - Name of the industry
   * @returns cost
   */
  export function getExpandIndustryCost(ns: NS, industryName: string): number;
  /**
   * Gets the cost to expand into a new city
   * @param ns - NS instance passed to the main function.
   * @returns cost
   */
  export function getExpandCityCost(ns: NS): number;
  /**
   * Get an offer for investment based on you companies current valuation
   * @param ns - NS instance passed to the main function.
   * @returns An offer of investment
   */
  export function getInvestmentOffer(ns: NS): InvestmentOffer;
  /**
   * Accept investment based on you companies current valuation
   * @remarks
   * Is based on current valuation and will not honer a specific Offer
   * @param ns - NS instance passed to the main function.
   * @returns An offer of investment
   */
  export function acceptInvestmentOffer(ns: NS): boolean;
  /**
   * Go public
   * @param ns - NS instance passed to the main function.
   * @param numShares - number of shares you would like to issue for your IPO
   * @returns true if you successfully go public, false if not
   */
  export function goPublic(ns: NS, numShares: number): boolean;
  /**
   * Bribe a faction
   * @param ns - NS instance passed to the main function.
   * @param factionName - Faction name
   * @param amountCash - Amount of money to bribe
   * @param amountShares - Amount of shares to bribe
   * @returns True if successful, false if not
   */
  export function bribe(ns: NS, factionName: string, amountCash: number, amountShares: number): boolean;
  /**
   * Get corporation data
   * @param ns - NS instance passed to the main function.
   * @returns Corporation data
   */
  export function getCorporation(ns: NS): CorporationInfo;
  /**
   * Get division data
   * @param ns - NS instance passed to the main function.
   * @param divisionName - Name of the division
   * @returns Division data
   */
  export function getDivision(ns: NS, divisionName: string): Division;
  /**
   * Expand to a new industry
   * @param ns - NS instance passed to the main function.
   * @param industryType - Name of the industry
   * @param divisionName - Name of the division
   */
  export function expandIndustry(ns: NS, industryType: string, divisionName: string): void;
  /**
   * Expand to a new city
   * @param ns - NS instance passed to the main function.
   * @param divisionName - Name of the division
   * @param cityName - Name of the city
   */
  export function expandCity(ns: NS, divisionName: string, cityName: string): void;
  /**
   * Unlock an upgrade
   * @param ns - NS instance passed to the main function.
   * @param upgradeName - Name of the upgrade
   */
  export function unlockUpgrade(ns: NS, upgradeName: string): void;
  /**
   * Level an upgrade.
   * @param ns - NS instance passed to the main function.
   * @param upgradeName - Name of the upgrade
   */
  export function levelUpgrade(ns: NS, upgradeName: string): void;
  /**
   * Issue dividends
   * @param ns - NS instance passed to the main function.
   * @param percent - Percent of profit to issue as dividends.
   */
  export function issueDividends(ns: NS, percent: number): void;
}

/**
 * Corporation Office API
 * @remarks
 * Requires the Office API upgrade from your corporation.
 * @public
 */
declare module "ns/corporation" {
  import {NS} from 'ns';

  /**
   * Employee in an office
   * @public
   */
  interface Employee {
    /** Name of the employee */
    name: string;
    /** Morale */
    mor: number;
    /** Happiness */
    hap: number;
    /** Energy */
    ene: number;
    int: number;
    cha: number;
    exp: number;
    cre: number;
    eff: number;
    /** Salary */
    sal: number;
    /** City */
    loc: string;
    /** Current job */
    pos: string;
  }

  /**
   * Object representing the number of employee in each job.
   * @public
   */
  interface EmployeeJobs {
    Operations: number;
    Engineer: number;
    Business: number;
    Management: number;
    "Research & Development": number;
    Training: number;
    Unassigned: number;
  }

  /**
   * Office for a division in a city.
   * @public
   */
  interface Office {
    /** City of the office */
    loc: string;
    /** Maximum number of employee */
    size: number;
    /** Minimum amount of energy of the employees */
    minEne: number;
    /** Maximum amount of energy of the employees */
    maxEne: number;
    /** Minimum happiness of the employees */
    minHap: number;
    /** Maximum happiness of the employees */
    maxHap: number;
    /** Maximum morale of the employees */
    maxMor: number;
    /** Name of all the employees */
    employees: string[];
    /** Positions of the employees */
    employeeProd: EmployeeJobs;
  }

  /**
   * Assign an employee to a job.
   * @param ns - NS instance passed to the main function.
   * @param divisionName - Name of the division
   * @param cityName - Name of the city
   * @param employeeName - name of the employee
   * @param job - Name of the job.
   * @returns A promise that is fulfilled when the assignment is complete.
   */
  export function assignJob(ns: NS, divisionName: string, cityName: string, employeeName: string, job: string): Promise<void>;
  /**
   * Hire an employee.
   * @param ns - NS instance passed to the main function.
   * @param divisionName - Name of the division
   * @param cityName - Name of the city
   * @returns The newly hired employee, if any
   */
  export function hireEmployee(ns: NS, divisionName: string, cityName: string): Employee | undefined;
  /**
   * Upgrade office size.
   * @param ns - NS instance passed to the main function.
   * @param divisionName - Name of the division
   * @param cityName - Name of the city
   * @param size - Amount of positions to open
   */
  export function upgradeOfficeSize(ns: NS, divisionName: string, cityName: string, size: number): void;
  /**
   * Throw a party for your employees
   * @param ns - NS instance passed to the main function.
   * @param divisionName - Name of the division
   * @param cityName - Name of the city
   * @param costPerEmployee - Amount to spend per employee.
   * @returns Amount of happiness increased.
   */
  export function throwParty(ns: NS, divisionName: string, cityName: string, costPerEmployee: number): Promise<number>;
  /**
   * Buy coffee for your employees
   * @param ns - NS instance passed to the main function.
   * @param divisionName - Name of the division
   * @param cityName - Name of the city
   * @returns A promise that is fulfilled when the coffee is served.
   */
  export function buyCoffee(ns: NS, divisionName: string, cityName: string): Promise<void>;
  /**
   * Hire AdVert.
   * @param ns - NS instance passed to the main function.
   * @param divisionName - Name of the division
   */
  export function hireAdVert(ns: NS, divisionName: string): void;
  /**
   * Purchase a research
   * @param ns - NS instance passed to the main function.
   * @param divisionName - Name of the division
   * @param researchName - Name of the research
   */
  export function research(ns: NS, divisionName: string, researchName: string): void;
  /**
   * Get data about an office
   * @param ns - NS instance passed to the main function.
   * @param divisionName - Name of the division
   * @param cityName - Name of the city
   * @returns Office data
   */
  export function getOffice(ns: NS, divisionName: string, cityName: string): Office;
  /**
   * Get data about an employee
   * @param ns - NS instance passed to the main function.
   * @param divisionName - Name of the division
   * @param cityName - Name of the city
   * @param employeeName - Name of the employee
   * @returns Employee data
   */
  export function getEmployee(ns: NS, divisionName: string, cityName: string, employeeName: string): Employee;
  /**
   * Get the cost to Hire AdVert
   * @param ns - NS instance passed to the main function.
   * @param divisionName - Name of the division
   * @returns Cost
   */
  export function getHireAdVertCost(ns: NS, divisionName: string): number;
  /**
   * Get the number of times you have Hired AdVert
   * @param ns - NS instance passed to the main function.
   * @param divisionName - Name of the division
   * @returns Number of times you have Hired AdVert
   */
  export function getHireAdVertCount(ns: NS, adivisionName: string): number;
  /**
   * Get the cost to unlock research
   * @param ns - NS instance passed to the main function.
   * @param divisionName - Name of the division
   * @param cityName - Name of the city
   * @returns cost
   */
  export function getResearchCost(ns: NS, divisionName: string, researchName: string): number;
  /**
   * Gets if you have unlocked a research
   * @param ns - NS instance passed to the main function.
   * @param divisionName - Name of the division
   * @param cityName - Name of the city
   * @returns true is unlocked, false if not
   */
  export function hasResearched(ns: NS, divisionName: string, researchName: string): boolean;
  /**
   * Set the auto job assignment for a job
   * @param ns - NS instance passed to the main function.
   * @param divisionName - Name of the division
   * @param cityName - Name of the city
   * @param job - Name of the job
   * @param amount - Number of employees to assign to that job
   * @returns A promise that is fulfilled when the assignment is complete.
   */
  export function setAutoJobAssignment(ns: NS, divisionName: string, cityName: string, job: string, amount: number): Promise<boolean>;
  /**
   * Cost to Upgrade office size.
   * @param ns - NS instance passed to the main function.
   * @param divisionName - Name of the division
   * @param cityName - Name of the city
   * @param size - Amount of positions to open
   * @returns Cost of upgrading the office
   */
  export function getOfficeSizeUpgradeCost(ns: NS, divisionName: string, cityName: string, asize: number): number;
}

/**
 * Corporation Warehouse API
 * @remarks
 * Requires the Warehouse API upgrade from your corporation.
 * @public
 */
declare module "ns/corporation" {
  import {NS} from 'ns';

  /**
   * Product in a warehouse
   * @public
   */
  interface Product {
    /** Name of the product */
    name: string;
    /** Demand for the product */
    dmd: number;
    /** Competition for the product */
    cmp: number;
    /** Production cost */
    pCost: number;
    /** Sell cost, can be "MP+5" */
    sCost: string | number;
    /** Data refers to the production, sale, and quantity of the products
     * These values are specific to a city
     * For each city, the data is [qty, prod, sell] */
    cityData: { [key: string]: number[] };
    /** Creation progress - A number between 0-100 representing percentage */
    developmentProgress: number;
  }

  /**
   * Material in a warehouse
   * @public
   */
  interface Material {
    /** Name of the material */
    name: string;
    /** Amount of material  */
    qty: number;
    /** Quality of the material */
    qlt: number;
    /** Amount of material produced  */
    prod: number;
    /** Amount of material sold  */
    sell: number;
  }

  /**
   * Warehouse for a division in a city
   * @public
   */
  interface Warehouse {
    /** Amount of size upgrade bought */
    level: number;
    /** City in which the warehouse is located */
    loc: string;
    /** Total space in the warehouse */
    size: number;
    /** Used space in the warehouse */
    sizeUsed: number;
    /** Smart Supply status in the warehouse */
    smartSupplyEnabled: boolean;
  }

  /**
   * Set material sell data.
   * @param ns - NS instance passed to the main function.
   * @param divisionName - Name of the division
   * @param cityName - Name of the city
   * @param materialName - Name of the material
   * @param amt - Amount to sell, can be "MAX"
   * @param price - Price to sell, can be "MP"
   */
  export function sellMaterial(ns: NS, divisionName: string, cityName: string, materialName: string, amt: string, price: string): void;
  /**
   * Set product sell data.
   * @param ns - NS instance passed to the main function.
   * @param divisionName - Name of the division
   * @param cityName - Name of the city
   * @param productName - Name of the product
   * @param amt - Amount to sell, can be "MAX"
   * @param price - Price to sell, can be "MP"
   * @param all - Sell in all city
   */
  export function sellProduct(ns: NS,
    divisionName: string,
    cityName: string,
    productName: string,
    amt: string,
    price: string,
    all: boolean,
  ): void;
  /**
   * Discontinue a product.
   * @param ns - NS instance passed to the main function.
   * @param divisionName - Name of the division
   * @param productName - Name of the product
   */
  export function discontinueProduct(ns: NS, divisionName: string, productName: string): void;
  /**
   * Set smart supply
   * @param ns - NS instance passed to the main function.
   * @param divisionName - Name of the division
   * @param cityName - Name of the city
   * @param enabled - smart supply enabled
   */
  export function setSmartSupply(ns: NS, divisionName: string, cityName: string, enabled: boolean): void;
  /**
   * Set material buy data
   * @param ns - NS instance passed to the main function.
   * @param divisionName - Name of the division
   * @param cityName - Name of the city
   * @param materialName - Name of the material
   * @param amt - Amount of material to buy
   */
  export function buyMaterial(ns: NS, divisionName: string, cityName: string, materialName: string, amt: number): void;
  /**
   * Get warehouse data
   * @param ns - NS instance passed to the main function.
   * @param divisionName - Name of the division
   * @param cityName - Name of the city
   * @returns warehouse data
   */
  export function getWarehouse(ns: NS, divisionName: string, cityName: string): Warehouse;
  /**
   * Get product data
   * @param ns - NS instance passed to the main function.
   * @param divisionName - Name of the division
   * @param productName - Name of the product
   * @returns product data
   */
  export function getProduct(ns: NS, divisionName: string, productName: string): Product;
  /**
   * Get material data
   * @param ns - NS instance passed to the main function.
   * @param divisionName - Name of the division
   * @param materialName - Name of the material
   * @returns material data
   */
  export function getMaterial(ns: NS, divisionName: string, cityName: string, materialName: string): Material;
  /**
   * Set market TA 1 for a material.
   * @param ns - NS instance passed to the main function.
   * @param divisionName - Name of the division
   * @param cityName - Name of the city
   * @param materialName - Name of the material
   * @param on - market ta enabled
   */
  export function setMaterialMarketTA1(ns: NS, divisionName: string, cityName: string, materialName: string, on: boolean): void;
  /**
   * Set market TA 2 for a material.
   * @param ns - NS instance passed to the main function.
   * @param divisionName - Name of the division
   * @param cityName - Name of the city
   * @param materialName - Name of the material
   * @param on - market ta enabled
   */
  export function setMaterialMarketTA2(ns: NS, divisionName: string, cityName: string, materialName: string, on: boolean): void;
  /**
   * Set market TA 1 for a product.
   * @param ns - NS instance passed to the main function.
   * @param divisionName - Name of the division
   * @param productName - Name of the product
   * @param on - market ta enabled
   */
  export function setProductMarketTA1(ns: NS, divisionName: string, productName: string, on: boolean): void;
  /**
   * Set market TA 2 for a product.
   * @param ns - NS instance passed to the main function.
   * @param divisionName - Name of the division
   * @param productName - Name of the product
   * @param on - market ta enabled
   */
  export function setProductMarketTA2(ns: NS, divisionName: string, productName: string, on: boolean): void;
  /**
   * Set material export data
   * @param ns - NS instance passed to the main function.
   * @param sourceDivision - Source division
   * @param sourceCity - Source city
   * @param targetDivision - Target division
   * @param targetCity - Target city
   * @param materialName - Name of the material
   * @param amt - Amount of material to export.
   */
  export function exportMaterial(ns: NS,
    sourceDivision: string,
    sourceCity: string,
    targetDivision: string,
    targetCity: string,
    materialName: string,
    amt: number,
  ): void;
  /**
   * Cancel material export
   * @param ns - NS instance passed to the main function.
   * @param sourceDivision - Source division
   * @param sourceCity - Source city
   * @param targetDivision - Target division
   * @param targetCity - Target city
   * @param materialName - Name of the material
   * @param amt - Amount of material to export.
   */
  export function cancelExportMaterial(ns: NS,
    sourceDivision: string,
    sourceCity: string,
    targetDivision: string,
    targetCity: string,
    materialName: string,
    amt: number,
  ): void;
  /**
   * Purchase warehouse for a new city
   * @param ns - NS instance passed to the main function.
   * @param divisionName - Name of the division
   * @param cityName - Name of the city
   */
  export function purchaseWarehouse(ns: NS, divisionName: string, cityName: string): void;
  /**
   * Upgrade warehouse
   * @param ns - NS instance passed to the main function.
   * @param divisionName - Name of the division
   * @param cityName - Name of the city
   */
  export function upgradeWarehouse(ns: NS, divisionName: string, cityName: string): void;
  /**
   * Create a new product
   * @param ns - NS instance passed to the main function.
   * @param divisionName - Name of the division
   * @param cityName - Name of the city
   * @param productName - Name of the product
   * @param designInvest - Amount to invest for the design of the product.
   * @param marketingInvest - Amount to invest for the marketing of the product.
   */
  export function makeProduct(ns: NS,
    divisionName: string,
    cityName: string,
    productName: string,
    designInvest: number,
    marketingInvest: number,
  ): void;
  /**
   * Gets the cost to purchase a warehouse
   * @param ns - NS instance passed to the main function.
   * @returns cost
   */
  export function getPurchaseWarehouseCost(ns: NS): number;
  /**
   * Gets the cost to upgrade a warehouse to the next level
   * @param ns - NS instance passed to the main function.
   * @returns cost to upgrade
   */
  export function getUpgradeWarehouseCost(ns: NS, adivisionName: any, acityName: any): number;
  /**
   * Check if you have a warehouse in city
   * @param ns - NS instance passed to the main function.
   * @returns true if warehouse is present, false if not
   */
  export function hasWarehouse(ns: NS, adivisionName: any, acityName: any): boolean;
}

/**
 * User Interface API.
 * @public
 */
declare module "ns/ui" {
  import {NS} from 'ns';

  /**
   * Interface Theme
   * @internal
   */
  interface UserInterfaceTheme {
    [key: string]: string | undefined;
    primarylight: string;
    primary: string;
    primarydark: string;
    successlight: string;
    success: string;
    successdark: string;
    errorlight: string;
    error: string;
    errordark: string;
    secondarylight: string;
    secondary: string;
    secondarydark: string;
    warninglight: string;
    warning: string;
    warningdark: string;
    infolight: string;
    info: string;
    infodark: string;
    welllight: string;
    well: string;
    white: string;
    black: string;
    hp: string;
    money: string;
    hack: string;
    combat: string;
    cha: string;
    int: string;
    rep: string;
    disabled: string;
    backgroundprimary: string;
    backgroundsecondary: string;
    button: string;
  }

  /**
   * Interface Styles
   * @internal
   */
  interface IStyleSettings {
    fontFamily: string;
    lineHeight: number;
  }

  /**
   * Game Information
   * @internal
   */
  interface GameInfo {
    version: string;
    commit: string;
    platform: string;
  }

  /**
   * Get the current theme
   * @remarks
   * RAM cost: 0 GB
   *
   * @param ns - NS instance passed to the main function.
   * @returns An object containing the theme's colors
   */
  export function getTheme(ns: NS): UserInterfaceTheme;

  /**
   * Sets the current theme
   * @remarks
   * RAM cost: 0 GB
   * @example
   * Usage example (NS2)
   * ```ts
   * const theme = getTheme(ns);
   * theme.primary = '#ff5500';
   * setTheme(ns, theme);
   * ```
   * @param ns - NS instance passed to the main function.
   */
  export function setTheme(ns: NS, newTheme: UserInterfaceTheme): void;

  /**
   * Resets the player's theme to the default values
   * @remarks
   * RAM cost: 0 GB
   * @param ns - NS instance passed to the main function.
   */
  export function resetTheme(ns: NS): void;

  /**
   * Get the current styles
   * @remarks
   * RAM cost: 0 GB
   *
   * @param ns - NS instance passed to the main function.
   * @returns An object containing the player's styles
   */
  export function getStyles(ns: NS): IStyleSettings;

  /**
   * Sets the current styles
   * @remarks
   * RAM cost: 0 GB
   * @example
   * Usage example (NS2)
   * ```ts
   * const styles = getStyles(ns);
   * styles.fontFamily = 'Comic Sans Ms';
   * setStyles(ns, styles);
   * ```
   * @param ns - NS instance passed to the main function.
   */
  export function setStyles(ns: NS, newStyles: IStyleSettings): void;

  /**
   * Resets the player's styles to the default values
   * @remarks
   * RAM cost: 0 GB
   * @param ns - NS instance passed to the main function.
   */
  export function resetStyles(ns: NS): void;

  /**
   * Gets the current game information (version, commit, ...)
   * @remarks
   * RAM cost: 0 GB
   * @param ns - NS instance passed to the main function.
   */
  export function getGameInfo(ns: NS): GameInfo;
}

/**
 * Singularity API
 * @remarks
 * This API requires Source-File 4 to use. The RAM cost of all these functions is multiplied by 16/4/1 based on Source-File 4 levels.
 * @public
 */
declare module "ns" {
  import {NS} from 'ns';
  import {CharacterMult} from 'ns/sleeve';

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
   * Take university class.
   *
   * @remarks
   * RAM cost: 2 GB * 16/4/1
   *
   *
   * This function will automatically set you to start taking a course at a university.
   * If you are already in the middle of some “working” action (such as working at a
   * company, for a faction, or on a program), then running this function will automatically
   * cancel that action and give you your earnings.
   *
   * The cost and experience gains for all of these universities and classes are the same as
   * if you were to manually visit and take these classes.
   *
   * @param ns - NS instance passed to the main function.
   * @param universityName - Name of university. You must be in the correct city for whatever university you specify.
   * @param courseName - Name of course.
   * @param focus - Acquire player focus on this class. Optional. Defaults to true.
   * @returns True if actions is successfully started, false otherwise.
   */
  export function universityCourse(ns: NS, universityName: string, courseName: string, focus?: boolean): boolean;

  /**
   * Workout at the gym.
   *
   * @remarks
   * RAM cost: 2 GB * 16/4/1
   *

   * This function will automatically set you to start working out at a gym to train
   * a particular stat. If you are already in the middle of some “working” action
   * (such as working at a company, for a faction, or on a program), then running
   * this function will automatically cancel that action and give you your earnings.
   *
   * The cost and experience gains for all of these gyms are the same as if you were
   * to manually visit these gyms and train
   *
   * @param ns - NS instance passed to the main function.
   * @param gymName - Name of gym. You must be in the correct city for whatever gym you specify.
   * @param stat - The stat you want to train.
   * @param focus - Acquire player focus on this gym workout. Optional. Defaults to true.
   * @returns True if actions is successfully started, false otherwise.
   */
  export function gymWorkout(ns: NS, gymName: string, stat: string, focus?: boolean): boolean;

  /**
   * Travel to another city.
   * @remarks
   * RAM cost: 2 GB * 16/4/1
   *
   *
   * This function allows the player to travel to any city. The cost for using this
   * function is the same as the cost for traveling through the Travel Agency.
   *
   * @param ns - NS instance passed to the main function.
   * @param city - City to travel to.
   * @returns True if actions is successful, false otherwise.
   */
  export function travelToCity(ns: NS, city: string): boolean;

  /**
   * Purchase the TOR router.
   * @remarks
   * RAM cost: 2 GB * 16/4/1
   *
   *
   * This function allows you to automatically purchase a TOR router. The cost for
   * purchasing a TOR router using this function is the same as if you were to
   * manually purchase one.
   *
   * @param ns - NS instance passed to the main function.
   * @returns True if actions is successful, false otherwise.
   */
  export function purchaseTor(ns: NS): boolean;

  /**
   * Purchase a program from the dark web.
   * @remarks
   * RAM cost: 2 GB * 16/4/1
   *
   *
   * This function allows you to automatically purchase programs. You MUST have a
   * TOR router in order to use this function. The cost of purchasing programs
   * using this function is the same as if you were purchasing them through the Dark
   * Web using the Terminal buy command.
   *
   * @example
   * ```ts
   * // NS2
   * purchaseProgram(ns, "brutessh.exe");
   * ```
   * @param ns - NS instance passed to the main function.
   * @param programName - Name of program to purchase.
   * @returns True if the specified program is purchased, and false otherwise.
   */
  export function purchaseProgram(ns: NS, programName: string): boolean;

  /**
   * Check if the player is busy.
   * @remarks
   * RAM cost: 0.5 GB * 16/4/1
   *
   *
   * Returns a boolean indicating whether or not the player is currently performing an
   * ‘action’. These actions include working for a company/faction, studying at a univeristy,
   * working out at a gym, creating a program, committing a crime, or carrying out a Hacking Mission.
   *
   * @param ns - NS instance passed to the main function.
   * @returns True if the player is currently performing an ‘action’, false otherwise.
   */
  export function isBusy(ns: NS): boolean;

  /**
   * Stop the current action.
   * @remarks
   * RAM cost: 1 GB * 16/4/1
   *
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
   * @param ns - NS instance passed to the main function.
   * @returns True if the player’s action was ended, false if the player was not performing an action.
   */
  export function stopAction(ns: NS): boolean;

  /**
   * Upgrade home computer RAM.
   * @remarks
   * RAM cost: 3 GB * 16/4/1
   *
   *
   * This function will upgrade amount of RAM on the player’s home computer. The cost is
   * the same as if you were to do it manually.
   *
   * This function will return true if the player’s home computer RAM is successfully upgraded, and false otherwise.
   *
   * @param ns - NS instance passed to the main function.
   * @returns True if the player’s home computer RAM is successfully upgraded, and false otherwise.
   */
  export function upgradeHomeRam(ns: NS): boolean;

  /**
   * Upgrade home computer cores.
   * @remarks
   * RAM cost: 3 GB * 16/4/1
   *
   *
   * This function will upgrade amount of cores on the player’s home computer. The cost is
   * the same as if you were to do it manually.
   *
   * This function will return true if the player’s home computer cores is successfully upgraded, and false otherwise.
   *
   * @param ns - NS instance passed to the main function.
   * @returns True if the player’s home computer cores is successfully upgraded, and false otherwise.
   */
  export function upgradeHomeCores(ns: NS): boolean;

  /**
   * Get the price of upgrading home RAM.
   * @remarks
   * RAM cost: 1.5 GB * 16/4/1
   *
   *
   * Returns the cost of upgrading the player’s home computer RAM.
   *
   * @param ns - NS instance passed to the main function.
   * @returns Cost of upgrading the player’s home computer RAM.
   */
  export function getUpgradeHomeRamCost(ns: NS): number;

  /**
   * Get the price of upgrading home cores.
   * @remarks
   * RAM cost: 1.5 GB * 16/4/1
   *
   *
   * Returns the cost of upgrading the player’s home computer cores.
   *
   * @param ns - NS instance passed to the main function.
   * @returns Cost of upgrading the player’s home computer cores.
   */
  export function getUpgradeHomeCoresCost(ns: NS): number;

  /**
   * Work for a company.
   * @remarks
   * RAM cost: 3 GB * 16/4/1
   *
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
   * // NS2:
   * //If you only want to work until you get 100,000 company reputation. One small hack to get around this is to continuously restart the action to receive your earnings:
   * while (getCompanyRep(ns, COMPANY HERE) < VALUE) {
   *    workForCompany(ns);
   *    await sleep(ns, 60000);
   * }
   * //This way, your company reputation will be updated every minute.
   * ```
   * @param ns - NS instance passed to the main function.
   * @param companyName - Name of company to work for. Must be an exact match. Optional. If not specified, this argument defaults to the last job that you worked
   * @param focus - Acquire player focus on this work operation. Optional. Defaults to true.
   * @returns True if the player starts working, and false otherwise.
   */
  export function workForCompany(ns: NS, companyName?: string, focus?: boolean): boolean;

  /**
   * Apply for a job at a company.
   * @remarks
   * RAM cost: 3 GB * 16/4/1
   *
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
   * @param ns - NS instance passed to the main function.
   * @param companyName - Name of company to apply to.
   * @param field - Field to which you want to apply.
   * @returns True if the player successfully get a job/promotion, and false otherwise.
   */
  export function applyToCompany(ns: NS, companyName: string, field: string): boolean;

  /**
   * Get company reputation.
   * @remarks
   * RAM cost: 1 GB * 16/4/1
   *
   *
   * This function will return the amount of reputation you have at the specified company.
   * If the company passed in as an argument is invalid, -1 will be returned.
   *
   * @param ns - NS instance passed to the main function.
   * @param companyName - Name of the company.
   * @returns Amount of reputation you have at the specified company.
   */
  export function getCompanyRep(ns: NS, companyName: string): number;

  /**
   * Get company favor.
   * @remarks
   * RAM cost: 1 GB * 16/4/1
   *
   *
   * This function will return the amount of favor you have at the specified company.
   * If the company passed in as an argument is invalid, -1 will be returned.
   *
   * @param ns - NS instance passed to the main function.
   * @param companyName - Name of the company.
   * @returns Amount of favor you have at the specified company.
   */
  export function getCompanyFavor(ns: NS, companyName: string): number;

  /**
   * Get company favor gain.
   * @remarks
   * RAM cost: 0.75 GB * 16/4/1
   *
   *
   * This function will return the amount of favor you will gain for the specified
   * company when you reset by installing Augmentations.
   *
   * @param ns - NS instance passed to the main function.
   * @param companyName - Name of the company.
   * @returns Amount of favor you gain at the specified company when you reset by installing Augmentations.
   */
  export function getCompanyFavorGain(ns: NS, companyName: string): number;

  /**
   * List all current faction invitations.
   * @remarks
   * RAM cost: 3 GB * 16/4/1
   *
   *
   * Returns an array with the name of all Factions you currently have oustanding invitations from.
   *
   * @param ns - NS instance passed to the main function.
   * @returns Array with the name of all Factions you currently have oustanding invitations from.
   */
  export function checkFactionInvitations(ns: NS): string[];

  /**
   * Join a faction.
   * @remarks
   * RAM cost: 3 GB * 16/4/1
   *
   *
   * This function will automatically accept an invitation from a faction and join it.
   *
   * @param ns - NS instance passed to the main function.
   * @param faction - Name of faction to join.
   * @returns True if player joined the faction, and false otherwise.
   */
  export function joinFaction(ns: NS, faction: string): boolean;

  /**
   * Work for a faction.
   * @remarks
   * RAM cost: 3 GB * 16/4/1
   *
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
   * // NS2:
   * //If you only want to work until you get 100,000 faction reputation. One small hack to get around this is to continuously restart the action to receive your earnings:
   * while (getFactionRep(ns, FACTION NAME) < VALUE) {
   *    workForFaction(ns, FACNAME, WORKTYPE);
   *    await sleep(ns, 60000);
   * }
   * //This way, your faction reputation will be updated every minute.
   * ```
   * @param ns - NS instance passed to the main function.
   * @param faction - Name of faction to work for.
   * @param workType - Type of work to perform for the faction.
   * @param focus - Acquire player focus on this work operation. Optional. Defaults to true.
   * @returns True if the player starts working, and false otherwise.
   */
  export function workForFaction(ns: NS, faction: string, workType: string, focus?: boolean): boolean;

  /**
   * Get faction reputation.
   * @remarks
   * RAM cost: 1 GB * 16/4/1
   *
   *
   * This function returns the amount of reputation you have for the specified faction.
   *
   * @param ns - NS instance passed to the main function.
   * @param faction - Name of faction to work for.
   * @returns Amount of reputation you have for the specified faction.
   */
  export function getFactionRep(ns: NS, faction: string): number;

  /**
   * Get faction favor.
   * @remarks
   * RAM cost: 1 GB * 16/4/1
   *
   *
   * This function returns the amount of favor you have for the specified faction.
   *
   * @param ns - NS instance passed to the main function.
   * @param faction - Name of faction.
   * @returns Amount of favor you have for the specified faction.
   */
  export function getFactionFavor(ns: NS, faction: string): number;

  /**
   * Get faction favor gain.
   * @remarks
   * RAM cost: 0.75 GB * 16/4/1
   *
   *
   * This function returns the amount of favor you will gain for the specified
   * faction when you reset by installing Augmentations.
   *
   * @param ns - NS instance passed to the main function.
   * @param faction - Name of faction.
   * @returns Amount of favor you will gain for the specified faction when you reset by installing Augmentations.
   */
  export function getFactionFavorGain(ns: NS, faction: string): number;

  /**
   * Donate to a faction.
   * @remarks
   * RAM cost: 5 GB * 16/4/1
   *
   *
   * Attempts to donate money to the specified faction in exchange for reputation.
   * Returns true if you successfully donate the money, and false otherwise.
   *
   * @param ns - NS instance passed to the main function.
   * @param faction - Name of faction to donate to.
   * @param amount - Amount of money to donate.
   * @returns True if the money was donated, and false otherwise.
   */
  export function donateToFaction(ns: NS, faction: string, amount: number): boolean;

  /**
   * Create a program.
   * @remarks
   * RAM cost: 5 GB * 16/4/1
   *
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
   * // NS2:
   * createProgram(ns, “relaysmtp.exe”);
   * ```
   * @param ns - NS instance passed to the main function.
   * @param program - Name of program to create.
   * @param focus - Acquire player focus on this program creation. Optional. Defaults to true.
   * @returns True if you successfully start working on the specified program, and false otherwise.
   */
  export function createProgram(ns: NS, program: string, focus?: boolean): boolean;

  /**
   * Commit a crime.
   * @remarks
   * RAM cost: 5 GB * 16/4/1
   *
   *
   * This function is used to automatically attempt to commit crimes.
   * If you are already in the middle of some ‘working’ action (such
   * as working for a company or training at a gym), then running this
   * function will automatically cancel that action and give you your
   * earnings.
   *
   * This function returns the number of milliseconds it takes to attempt the
   * specified crime (e.g It takes 60 seconds to attempt the ‘Rob Store’ crime,
   * so running `commitCrime('rob store')` will return 60,000).
   *
   * Warning: I do not recommend using the time returned from this function to try
   * and schedule your crime attempts. Instead, I would use the isBusy Singularity
   * function to check whether you have finished attempting a crime. This is because
   * although the game sets a certain crime to be X amount of seconds, there is no
   * guarantee that your browser will follow that time limit.
   *
   * @param ns - NS instance passed to the main function.
   * @param crime - Name of crime to attempt.
   * @returns The number of milliseconds it takes to attempt the specified crime.
   */
  export function commitCrime(ns: NS, crime: string): number;

  /**
   * Get chance to successfully commit a crime.
   * @remarks
   * RAM cost: 5 GB * 16/4/1
   *
   *
   * This function returns your chance of success at commiting the specified crime.
   *
   * @param ns - NS instance passed to the main function.
   * @param crime - Name of crime.
   * @returns Chance of success at commiting the specified crime.
   */
  export function getCrimeChance(ns: NS, crime: string): number;

  /**
   * Get stats related to a crime.
   * @remarks
   * RAM cost: 5 GB * 16/4/1
   *
   *
   * Returns the stats of the crime.
   *
   * @param ns - NS instance passed to the main function.
   * @param crime - Name of crime. Not case-sensitive
   * @returns The stats of the crime.
   */
  export function getCrimeStats(ns: NS, crime: string): CrimeStats;

  /**
   * Get a list of owned augmentation.
   * @remarks
   * RAM cost: 5 GB * 16/4/1
   *
   *
   * This function returns an array containing the names (as strings) of all Augmentations you have.
   *
   * @param ns - NS instance passed to the main function.
   * @param purchased - Specifies whether the returned array should include Augmentations you have purchased but not yet installed. By default, this argument is false which means that the return value will NOT have the purchased Augmentations.
   * @returns Array containing the names (as strings) of all Augmentations you have.
   */
  export function getOwnedAugmentations(ns: NS, purchased?: boolean): string[];

  /**
   * Get a list of augmentation available from a faction.
   * @remarks
   * RAM cost: 5 GB * 16/4/1
   *
   *
   * Returns an array containing the names (as strings) of all Augmentations
   * that are available from the specified faction.
   *
   * @param ns - NS instance passed to the main function.
   * @param faction - Name of faction.
   * @returns Array containing the names of all Augmentations.
   */
  export function getAugmentationsFromFaction(ns: NS, faction: string): string[];

  /**
   * Get the pre-requisite of an augmentation.
   * @remarks
   * RAM cost: 5 GB * 16/4/1
   *
   *
   * This function returns an array with the names of the prerequisite Augmentation(s) for the specified Augmentation.
   * If there are no prerequisites, a blank array is returned.
   *
   * @param ns - NS instance passed to the main function.
   * @param augName - Name of Augmentation.
   * @returns Array with the names of the prerequisite Augmentation(s) for the specified Augmentation.
   */
  export function getAugmentationPrereq(ns: NS, augName: string): string[];

  /**
   * Get the price and reputation of an augmentation.
   * @deprecated use getAugmentationPrice getAugmentationRepCost
   * @remarks
   * RAM cost: 5 GB * 16/4/1
   *
   *
   * This function returns an array with two elements that gives the cost for
   * the specified Augmentation. The first element in the returned array is the
   * reputation requirement of the Augmentation, and the second element is the
   * money cost.
   *
   * If an invalid Augmentation name is passed in for the augName argument, this
   * function will return the array [-1, -1].
   *
   * @param ns - NS instance passed to the main function.
   * @param augName - Name of Augmentation.
   * @returns Array with first element as a reputation requirement and second element as the money cost.
   */
  export function getAugmentationCost(ns: NS, augName: string): [number, number];

  /**
   * Get price of an augmentation.
   * @remarks
   * RAM cost: 2.5 GB * 16/4/1
   *
   * @param ns - NS instance passed to the main function.
   * @param augName - Name of Augmentation.
   * @returns Price of the augmentation.
   */
  export function getAugmentationPrice(ns: NS, augName: string): number;

  /**
   * Get reputation requirement of an augmentation.
   * @remarks
   * RAM cost: 2.5 GB * 16/4/1
   *
   * @param ns - NS instance passed to the main function.
   * @param augName - Name of Augmentation.
   * @returns Reputation requirement of the augmentation.
   */
  export function getAugmentationRepReq(ns: NS, augName: string): number;

  /**
   * Purchase an augmentation
   * @remarks
   * RAM cost: 5 GB * 16/4/1
   *
   *
   * This function will try to purchase the specified Augmentation through the given Faction.
   *
   * This function will return true if the Augmentation is successfully purchased, and false otherwise.
   *
   * @param ns - NS instance passed to the main function.
   * @param faction - Name of faction to purchase Augmentation from.
   * @param augmentation - Name of Augmentation to purchase.
   * @returns True if the Augmentation is successfully purchased, and false otherwise.
   */
  export function purchaseAugmentation(ns: NS, faction: string, augmentation: string): boolean;

  /**
   * Get the stats of an augmentation.
   * @remarks
   * RAM cost: 5 GB * 16/4/1
   *
   *
   * This function returns augmentation stats.
   *
   * @param ns - NS instance passed to the main function.
   * @param name - Name of Augmentation. CASE-SENSITIVE.
   * @returns Augmentation stats.
   */
  export function getAugmentationStats(ns: NS, name: string): AugmentationStats;

  /**
   * Install your purchased augmentations.
   * @remarks
   * RAM cost: 5 GB * 16/4/1
   *
   *
   * This function will automatically install your Augmentations, resetting the game as usual.
   *
   * @param ns - NS instance passed to the main function.
   * @param cbScript - This is a script that will automatically be run after Augmentations are installed (after the reset). This script will be run with no arguments and 1 thread. It must be located on your home computer.
   */
  export function installAugmentations(ns: NS, cbScript?: string): void;

  /**
   * Returns an object with the Player’s stats.
   * @deprecated use getPlayer
   *
   * @remarks
   * RAM cost: 0.5 GB * 16/4/1
   *
   *
   * @example
   * ```ts
   * res = getStats();
   * print('My charisma level is: ' + res.charisma);
   * ```
   * @param ns - NS instance passed to the main function.
   * @returns Object with the Player’s stats.
   */
  export function getStats(ns: NS): PlayerSkills;

  /**
   * Returns an object with various information about your character.
   * @deprecated use getPlayer
   *
   * @remarks
   * RAM cost: 0.5 GB * 16/4/1
   *
   * @param ns - NS instance passed to the main function.
   * @returns Object with various information about your character.
   */
  export function getCharacterInformation(ns: NS): CharacterInfo;

  /**
   * Hospitalize the player.
   * @remarks
   * RAM cost: 0.25 GB * 16/4/1
   *
   * @param ns - NS instance passed to the main function.
   * @returns The cost of the hospitalization.
   */
  export function hospitalize(ns: NS): number;

  /**
   * Soft reset the game.
   * @remarks
   * RAM cost: 5 GB * 16/4/1
   *
   *
   * This function will perform a reset even if you don’t have any augmentation installed.
   *
   * @param ns - NS instance passed to the main function.
   * @param cbScript - This is a script that will automatically be run after Augmentations are installed (after the reset). This script will be run with no arguments and 1 thread. It must be located on your home computer.
   */
  export function softReset(ns: NS, cbScript: string): void;

  /**
   * Go to a location.
   * @remarks
   * RAM cost: 5 GB * 16/4/1
   *
   *
   * Move the player to a specific location.
   *
   * @param ns - NS instance passed to the main function.
   * @param locationName - Name of the location.
   * @returns True if the player was moved there, false otherwise.
   */
  export function goToLocation(ns: NS, locationName: string): boolean;

  /**
   * Get the current server.
   * @remarks
   * RAM cost: 2 GB * 16/4/1
   *
   * @param ns - NS instance passed to the main function.
   * @returns Name of the current server.
   */
  export function getCurrentServer(ns: NS): string;

  /**
   * Connect to a server.
   * @remarks
   * RAM cost: 2 GB * 16/4/1
   *
   *
   * Run the connect HOSTNAME command in the terminal. Can only connect to neighbors.
   *
   * @param ns - NS instance passed to the main function.
   * @returns True if the connect command was successful, false otherwise.
   */
  export function connect(ns: NS, hostname: string): boolean;

  /**
   * Run the hack command in the terminal.
   * @remarks
   * RAM cost: 2 GB * 16/4/1
   *
   * @param ns - NS instance passed to the main function.
   * @returns Amount of money stolen by manual hacking.
   */
  export function manualHack(ns: NS): Promise<number>;

  /**
   * Run the backdoor command in the terminal.
   * @remarks
   * RAM cost: 2 GB * 16/4/1
   *
   * @param ns - NS instance passed to the main function.
   * @returns Promise waiting for the installation to finish.
   */
  export function installBackdoor(ns: NS): Promise<void>;

  /**
   * Check if the player is focused.
   * @remarks
   * RAM cost: 0.1 GB * 16/4/1
   *
   * @param ns - NS instance passed to the main function.
   * @returns True if the player is focused.
   */
  export function isFocused(ns: NS): boolean;

  /**
   * Set the players focus.
   * @remarks
   * RAM cost: 0.1 GB * 16/4/1
   *
   * @param ns - NS instance passed to the main function.
   * @returns True if the focus was changed.
   */
  export function setFocus(ns: NS, focus: boolean): boolean;
}
