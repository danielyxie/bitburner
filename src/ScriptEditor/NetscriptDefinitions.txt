declare module "Bitburner" {
    export type Host = string;
    export type Script = string;
    export type StockSymbol =
        | "ECP"
        | "MGCP"
        | "BLD"
        | "CLRK"
        | "OMTK"
        | "FSIG"
        | "KGI"
        | "FLCM"
        | "STM"
        | "DCOMM"
        | "HLS"
        | "VITA"
        | "ICRS"
        | "UNV"
        | "AERO"
        | "OMN"
        | "SLRS"
        | "GPH"
        | "NVMD"
        | "WDS"
        | "LXO"
        | "RHOC"
        | "APHE"
        | "SYSC"
        | "CTK"
        | "NTLK"
        | "OMGA"
        | "FNS"
        | "SGC"
        | "JGN"
        | "CTYS"
        | "MDYN"
        | "TITN";
    export type OrderType = "limitbuy" | "limitsell" | "stopbuy" | "stopsell";
    export type OrderPos = "long" | "short";
    export type University =
        | "Summit University"
        | "Rothman University"
        | "ZB Institute Of Technology";
    export type UniversityCourse =
        | "Study Computer Science"
        | "Data Strucures"
        | "Networks"
        | "Algorithms"
        | "Management"
        | "Leadership";
    export type Gym =
        | "Crush Fitness Gym"
        | "Snap Fitness Gym"
        | "Iron Gym"
        | "Powerhouse Gym"
        | "Millenium Fitness Gym";
    export type GymStat = "str" | "def" | "dex" | "agi";
    export type City =
        | "Aevum"
        | "Chongqing"
        | "Sector-12"
        | "New Tokyo"
        | "Ishima"
        | "Volhaven";
    export type PurchaseableProgram =
        | "brutessh.exe"
        | "ftpcrack.exe"
        | "relaysmtp.exe"
        | "httpworm.exe"
        | "sqlinject.exe"
        | "deepscanv1.exe"
        | "deepscanv2.exe"
        | "autolink.exe";
    export type CreatableProgram = PurchaseableProgram | "serverprofiler.exe";
    export type CompanyName =
        // Sector-12
        | "MegaCorp"
        | "BladeIndustries"
        | "FourSigma"
        | "IcarusMicrosystems"
        | "UniversalEnergy"
        | "DeltaOne"
        | "CIA"
        | "NSA"
        | "AlphaEnterprises"
        | "CarmichaelSecurity"
        | "FoodNStuff"
        | "JoesGuns"

        // Aevum
        | "ECorp"
        | "BachmanAndAssociates"
        | "ClarkeIncorporated"
        | "OmniTekIncorporated"
        | "FulcrumTechnologies"
        | "GalacticCybersystems"
        | "AeroCorp"
        | "WatchdogSecurity"
        | "RhoConstruction"
        | "AevumPolice"
        | "NetLinkTechnologies"

        // Volhaven
        | "NWO"
        | "HeliosLabs"
        | "OmniaCybersystems"
        | "LexoCorp"
        | "SysCoreSecurities"
        | "CompuTek"

        // Chongqing
        | "KuaiGongInternational"
        | "SolarisSpaceSystems"

        // Ishima
        | "StormTechnologies"
        | "NovaMedical"
        | "OmegaSoftware"

        // New Tokyo
        | "DefComm"
        | "VitaLife"
        | "GlobalPharmaceuticals"
        | "NoodleBar";
    export type CompanyField =
        | "software"
        | "software consultant"
        | "it"
        | "security engineer"
        | "network engineer"
        | "business"
        | "business consultant"
        | "security"
        | "agent"
        | "employee"
        | "part-time employee"
        | "waiter"
        | "part-time waiter";
    export type FactionName =
        | "Illuminati"
        | "Daedalus"
        | "The Covenant"
        | "ECorp"
        | "MegaCorp"
        | "Bachman & Associates"
        | "Blade Industries"
        | "NWO"
        | "Clarke Incorporated"
        | "OmniTek Incorporated"
        | "Four Sigma"
        | "KuaiGong International"
        | "Fulcrum Secret Technologies"
        | "BitRunners"
        | "The Black Hand"
        | "NiteSec"
        | "Aevum"
        | "Chongqing"
        | "Ishima"
        | "New Tokyo"
        | "Sector-12"
        | "Volhaven"
        | "Speakers for the Dead"
        | "The Dark Army"
        | "The Syndicate"
        | "Silhouette"
        | "Tetrads"
        | "Slum Snakes"
        | "Netburners"
        | "Tian Di Hui"
        | "CyberSec"
        | "Bladeburners";

    export type GangName =
        | "Slum Snakes"
        | "Tetrads"
        | "The Syndicate"
        | "The Dark Army"
        | "Speakers for the Dead"
        | "NiteSec"
        | "The Black Hand";
    export type FactionWork = "hacking" | "field" | "security";
    export type Crime =
        | "shoplift"
        | "rob store"
        | "mug"
        | "larceny"
        | "deal drugs"
        | "bond forgery"
        | "traffick arms"
        | "homicide"
        | "grand theft auto"
        | "kidnap"
        | "assassinate"
        | "heist";
    export type AugmentName =
        | "Augmented Targeting I"
        | "Augmented Targeting II"
        | "Augmented Targeting III"
        | "Synthetic Heart"
        | "Synfibril Muscle"
        | "Combat Rib I"
        | "Combat Rib II"
        | "Combat Rib III"
        | "Nanofiber Weave"
        | "NEMEAN Subdermal Weave"
        | "Wired Reflexes"
        | "Graphene Bone Lacings"
        | "Bionic Spine"
        | "Graphene Bionic Spine Upgrade"
        | "Bionic Legs"
        | "Graphene Bionic Legs Upgrade"
        | "Speech Processor Implant"
        | "TITN-41 Gene-Modification Injection"
        | "Enhanced Social Interaction Implant"
        | "BitWire"
        | "Artificial Bio-neural Network Implant"
        | "Artificial Synaptic Potentiation"
        | "Enhanced Myelin Sheathing"
        | "Synaptic Enhancement Implant"
        | "Neural-Retention Enhancement"
        | "DataJack"
        | "Embedded Netburner Module"
        | "Embedded Netburner Module Core Implant"
        | "Embedded Netburner Module Core V2 Upgrade"
        | "Embedded Netburner Module Core V3 Upgrade"
        | "Embedded Netburner Module Analyze Engine"
        | "Embedded Netburner Module Direct Memory Access Upgrade"
        | "Neuralstimulator"
        | "Neural Accelerator"
        | "Cranial Signal Processors - Gen I"
        | "Cranial Signal Processors - Gen II"
        | "Cranial Signal Processors - Gen III"
        | "Cranial Signal Processors - Gen IV"
        | "Cranial Signal Processors - Gen V"
        | "Neuronal Densification"
        | "Nuoptimal Nootropic Injector Implant"
        | "Speech Enhancement"
        | "FocusWire"
        | "PC Direct-Neural Interface"
        | "PC Direct-Neural Interface Optimization Submodule"
        | "PC Direct-Neural Interface NeuroNet Injector"
        | "ADR-V1 Pheromone Gene"
        | "ADR-V2 Pheromone Gene"
        | "The Shadow's Simulacrum"
        | "Hacknet Node CPU Architecture Neural-Upload"
        | "Hacknet Node Cache Architecture Neural-Upload"
        | "Hacknet Node NIC Architecture Neural-Upload"
        | "Hacknet Node Kernel Direct-Neural Interface"
        | "Hacknet Node Core Direct-Neural Interface"
        | "NeuroFlux Governor"
        | "Neurotrainer I"
        | "Neurotrainer II"
        | "Neurotrainer III"
        | "HyperSight Corneal Implant"
        | "LuminCloaking-V1 Skin Implant"
        | "LuminCloaking-V2 Skin Implant"
        | "HemoRecirculator"
        | "SmartSonar Implant"
        | "Power Recirculation Core"
        | "QLink"
        | "The Red Pill"
        | "SPTN-97 Gene Modification"
        | "ECorp HVMind Implant"
        | "CordiARC Fusion Reactor"
        | "SmartJaw"
        | "Neotra"
        | "Xanipher"
        | "nextSENS Gene Modification"
        | "OmniTek InfoLoad"
        | "Photosynthetic Cells"
        | "BitRunners Neurolink"
        | "The Black Hand"
        | "CRTX42-AA Gene Modification"
        | "Neuregen Gene Modification"
        | "CashRoot Starter Kit"
        | "NutriGen Implant"
        | "INFRARET Enhancement"
        | "DermaForce Particle Barrier"
        | "Graphene BranchiBlades Upgrade"
        | "Graphene Bionic Arms Upgrade"
        | "BrachiBlades"
        | "Bionic Arms"
        | "Social Negotiation Assistant (S.N.A)"
        | "EsperTech Bladeburner Eyewear"
        | "EMS-4 Recombination"
        | "ORION-MKIV Shoulder"
        | "Hyperion Plasma Cannon V1"
        | "Hyperion Plasma Cannon V2"
        | "GOLEM Serum"
        | "Vangelis Virus"
        | "Vangelis Virus 3.0"
        | "I.N.T.E.R.L.I.N.K.E.D"
        | "Blade's Runners"
        | "BLADE-51b Tesla Armor"
        | "BLADE-51b Tesla Armor: Power Cells Upgrade"
        | "BLADE-51b Tesla Armor: Energy Shielding Upgrade"
        | "BLADE-51b Tesla Armor: Unibeam Upgrade"
        | "BLADE-51b Tesla Armor: Omnibeam Upgrade"
        | "BLADE-51b Tesla Armor: IPU Upgrade"
        | "The Blade's Simulacrum";

    export interface CrimeStats {
        /** Number representing the difficulty of the crime. Used for success chance calculations */
        difficulty: number;
        /** Amount of karma lost for SUCCESSFULLY committing this crime */
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
        /** Multipler to amount of money injected into servers using {@link grow()} */
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
    export interface BasicHGWOptions {
        /** Number of threads to use for this function. Must be less than or equal to the number of threads the script is running with. */
        threads: number;
    }

    export interface CodingAttemptOptions {
        /** If truthy, then the function will return a string that states the contract’s reward when it is successfully solved. */
        returnReward: boolean;
    }

    export interface AugmentPair {
        /** augmentation name */
        name: AugmentName;
        /** augmentation cost */
        cost: number;
    }

    export interface StockOrderObject {
        /** Number of shares */
        shares: number;
        /** Price per share */
        price: number;
        /** Order type */
        type: "Limit Buy Order" | "Limit Sell Order" | "Stop Buy Order" | "Stop Buy Order";
        /** Order position */
        position: "S" | "L";
    }
    export type StockOrder = {
        /** Stock Symbol */
        [key in StockSymbol]?: StockOrderObject[];
    };

    export interface ProcessInfo {
        /** Script name. */
        filename: Script;
        /** Number of threads script is running with */
        threads: number;
        /** Script's arguments */
        args: string[];
    }

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
     * A port is implemented as a sort of serialized queue,
     * where you can only write and read one element at a time from the port.
     * When you read data from a port, the element that is read is removed from the port.
     *
     * IMPORTANT: The data inside ports are not saved!
     * This means if you close and re-open the game, or reload the page
     * then you will lose all of the data in the ports!
     */
    export type Port = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;
    export type Handle = string | Port;

    export interface NodeStats {
        /** Node's name ("hacknet-node-5") */
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

    export type HashUpgrades =
        | "Sell for Money"
        | "Sell for Corporation Funds"
        | "Reduce Minimum Security"
        | "Increase Maximum Money"
        | "Improve Studying"
        | "Improve Gym Training"
        | "Exchange for Corporation Research"
        | "Exchange for Bladeburner Rank"
        | "Exchange for Bladeburner SP"
        | "Generate Coding Contract";

    export interface PlayerStats {
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
    export interface CharacterInfo {
        /** Current BitNode number */
        bitnode: number;
        /** Name of city you are currently in */
        city: City;
        /** Array of factions you are currently a member of */
        factions: FactionName[];
        /** Current health points */
        hp: number;
        /** Array of all companies at which you have jobs */
        company: CompanyName[];
        /** Array of job positions for all companies you are employed at. Same order as 'jobs' */
        jobTitle: CompanyField[];
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

    export interface SourceFileLvl {
        /** The number of the source file */
        n: 1|2|3|4|5|6|7|8|9|10|11|12;
        /** The level of the source file */
        lvl: number;
    }

    export type BladeburnerContracts =
        | "Tracking"
        | "Bounty Hunter"
        | "Retirement";

    export type BladeburnerOperations =
        | "Investigation"
        | "Undercover Operation"
        | "Sting Operation"
        | "Raid"
        | "Stealth Retirement Operation"
        | "Assassination";

    export type BladeburnerBlackOps =
        | "Operation Typhoon"
        | "Operation Zero"
        | "Operation X"
        | "Operation Titan"
        | "Operation Ares"
        | "Operation Archangel"
        | "Operation Juggernaut"
        | "Operation Red Dragon"
        | "Operation K"
        | "Operation Deckard"
        | "Operation Tyrell"
        | "Operation Wallace"
        | "Operation Shoulder of Orion"
        | "Operation Hyron"
        | "Operation Morpheus"
        | "Operation Ion Storm"
        | "Operation Annihilus"
        | "Operation Ultron"
        | "Operation Centurion"
        | "Operation Vindictus"
        | "Operation Daedalus";

    export type BladeburnerGenActions =
        | "Training"
        | "Field Analysis"
        | "Recruitment"
        | "Diplomacy"
        | "Hyperbolic Regeneration Chamber";

    export type BladeburnerSkills =
        | "Blade's Intuition"
        | "Cloak"
        | "Marksman"
        | "Weapon Proficiency"
        | "Short-Circuit"
        | "Digital Observer"
        | "Tracer"
        | "Overclock"
        | "Reaper"
        | "Evasive System"
        | "Datamancer"
        | "Cyber's Edge"
        | "Hands of Midas"
        | "Hyperdrive";

    export type BladeburnerActTypes =
        | "contracts"
        | "operations"
        | "black ops"
        | "general";

    export interface BladeburnerCurAction {
        /** Type of Action */
        type: BladeburnerActTypes | "Idle";
        /** Name of Action */
        name: BladeburnerGenActions | BladeburnerContracts | BladeburnerOperations | BladeburnerBlackOps;
    }

    export type CodingContractTypes =
        | "Find Largest Prime Factor"
        | "Subarray with Maximum Sum"
        | "Total Ways to Sum"
        | "Spiralize Matrix"
        | "Array Jumping Game"
        | "Merge Overlapping Intervals"
        | "Generate IP Addresses"
        | "Algorithmic Stock Trader I"
        | "Algorithmic Stock Trader II"
        | "Algorithmic Stock Trader III"
        | "Algorithmic Stock Trader IV"
        | "Minimum Path Sum in a Triangle"
        | "Unique Paths in a Grid I"
        | "Unique Paths in a Grid II"
        | "Sanitize Parentheses in Expression"
        | "Find All Valid Math Expressions";

    export interface GangGenInfo {
        /** Name of faction that the gang belongs to ("Slum Snakes", etc.) */
        faction: GangName;
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

    export interface GangOtherInfoObject {
        /** Gang power */
        power: number;
        /** Gang territory, in decimal form */
        territory: number;
    }
    export type GangOtherInfo = {
        /** Stock Symbol */
        [key in GangName]: GangOtherInfoObject[];
    };

    export type GangEquipment =
        | "Baseball Bat"
        | "Katana"
        | "Glock 18C"
        | "P90C"
        | "Steyr AUG"
        | "AK-47"
        | "M15A10 Assault Rifle"
        | "AWM Sniper Rifle"
        | "Bulletproof Vest"
        | "Full Body Armor"
        | "Liquid Body Armor"
        | "Graphene Plating Armor"
        | "Ford Flex V20"
        | "ATX1070 Superbike"
        | "Mercedes-Benz S9001"
        | "White Ferrari"
        | "NUKE Rootkit"
        | "Soulstealer Rootkit"
        | "Demon Rootkit"
        | "Hmap Node"
        | "Jack the Ripper";

    export type GangEquipmentType =
        | "Weapon"
        | "Armor"
        | "Vehicle"
        | "Rootkit"
        | "Augmentation";

    export type GangAugmentations =
        | "Bionic Arms"
        | "Bionic Legs"
        | "Bionic Spine"
        | "BrachiBlades"
        | "Nanofiber Weave"
        | "Synthetic Heart"
        | "Synfibril Muscle"
        | "BitWire"
        | "Neuralstimulator"
        | "DataJack"
        | "Graphene Bone Lacings";

    export type GangTasks =
        | "Unassigned"
        | "Ransomware"
        | "Phishing"
        | "Identity Theft"
        | "DDoS Attacks"
        | "Plant Virus"
        | "Fraud & Counterfeiting"
        | "Money Laundering"
        | "Cyberterrorism"
        | "Ethical Hacking"
        | "Mug People"
        | "Deal Drugs"
        | "Strongarm Civilians"
        | "Run a Con"
        | "Armed Robbery"
        | "Traffick Illegal Arms"
        | "Threaten & Blackmail"
        | "Human Trafficking"
        | "Terrorism"
        | "Vigilante Justice"
        | "Train Combat"
        | "Train Hacking"
        | "Train Charisma"
        | "Territory Warfare";
    
    export interface GangTasksStats {
        /** Task name */
        name: GangTasks;
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
        territory: GangTasksTerritory;
    }

    export interface GangEquipmentStats {
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

    export interface GangTasksTerritory {
        /** Money gain impact on task scaling */
        money: number;
        /** Respect gain impact on task scaling */
        respect: number;
        /** Wanted gain impact on task scaling */
        wanted: number;
    }

    export interface GangMemberInfo {
        /** Agility stat */
        agility: number;
        /** Agility multiplier from equipment. Decimal form */
        agilityEquipMult: number;
        /** Agility multiplier from ascension. Decimal form */
        agilityAscensionMult: number;
        /** Array of names of all owned Augmentations */
        augmentations: GangAugmentations[];
        /** Charisma stat */
        charisma: number;
        /** Charisma multiplier from equipment. Decimal form */
        charismaEquipMult: number;
        /** Charisma multiplier from ascension. Decimal form */
        charismaAscensionMult: number;
        /** Defense stat */
        defense: number;
        /** Defense multiplier from equipment. Decimal form */
        defenseEquipMult: number;
        /** Defense multiplier from ascension. Decimal form */
        defenseAscensionMult: number;
        /** Dexterity stat */
        dexterity: number;
        /** Dexterity multiplier from equipment. Decimal form */
        dexterityEquipMult: number;
        /** Dexterity multiplier from ascension. Decimal form */
        dexterityAscensionMult: number;
        /** Array of names of all owned Non-Augmentation Equipment */
        equipment: GangEquipment[];
        /** Hacking stat */
        hacking: number;
        /** Hacking multiplier from equipment. Decimal form */
        hackingEquipMult: number;
        /** Hacking multiplier from ascension. Decimal form */
        hackingAscensionMult: number;
        /** Strength stat */
        strength: number;
        /** Strength multiplier from equipment. Decimal form */
        strengthEquipMult: number;
        /** Strength multiplier from ascension. Decimal form */
        strengthAscensionMult: number;
        /** Name of currently assigned task */
        task: GangTasks;
    }

    export interface GangMemberAscension {
        /** Amount of respect lost from ascending */
        respect: number;
        /** Hacking multiplier gained from ascending. Decimal form */
        hack: number;
        /** Strength multiplier gained from ascending. Decimal form */
        str: number;
        /** Defense multiplier gained from ascending. Decimal form */
        def: number;
        /** Dexterity multiplier gained from ascending. Decimal form */
        dex: number;
        /** Agility multiplier gained from ascending. Decimal form */
        agi: number;
        /** Charisma multiplier gained from ascending. Decimal form */
        cha: number;
    }

    export interface SleeveStats {
        /** current shock of the sleeve [0-100] */
        shock: 0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20
                |21|22|23|24|25|26|27|28|29|30|31|32|33|34|35|36|37
                |38|39|40|41|42|43|44|45|46|47|48|49|50|51|52|53|54
                |55|56|57|58|59|60|61|62|63|64|65|66|67|68|69|70|71
                |72|73|74|75|76|77|78|79|80|81|82|83|84|85|86|87|88
                |89|90|91|92|93|94|95|96|97|98|99|100;
        /** current sync of the sleeve [0-100] */
        sync: 0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20
               |21|22|23|24|25|26|27|28|29|30|31|32|33|34|35|36|37
               |38|39|40|41|42|43|44|45|46|47|48|49|50|51|52|53|54
               |55|56|57|58|59|60|61|62|63|64|65|66|67|68|69|70|71
               |72|73|74|75|76|77|78|79|80|81|82|83|84|85|86|87|88
               |89|90|91|92|93|94|95|96|97|98|99|100;
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

    export interface SleeveInformation {
        /** location of the sleeve */
        city: City;
        /** current hp of the sleeve */
        hp: number;
        /** max hp of the sleeve */
        maxHp: number;
        /** jobs available to the sleeve */
        jobs: string[];
        /** job titles available to the sleeve */
        jobTitle: CompanyField[];
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

    export interface SleeveTask {
        /** task type */
        task: string;
        /** crime currently attempting, if any */
        crime: Crime | "";
        /** location of the task, if any */
        location: City | "";
        /** stat being trained at the gym, if any */
        gymStatType: GymStat | "";
        /** faction work type being performed, if any */
        factionWorkType: FactionWork | "";
    }

    export interface TIX {

        /**
         * Returns an array of the symbols of the tradable stocks
         *
         * @ramCost 2 GB
         * @returns {string[]} Array of the symbols of the tradable stocks.
         */
        getStockSymbols (): StockSymbol[];

        /**
         * Returns the price of a stock, given its symbol (NOT the company name).
         * The symbol is a sequence of two to four capital letters.
         * 
         * The stock’s price is the average of its bid and ask price
         *
         * @example
         * ```js
         * getStockPrice("FISG");
         * ```
         * @ramCost 2 GB
         * @param {string} sym Stock symbol.
         * @returns {number} The price of a stock.
         */
        getStockPrice (sym: StockSymbol): number;

        /**
         * Given a stock’s symbol (NOT the company name), returns the ask price of that stock.
         * The symbol is a sequence of two to four capital letters.
         * 
         * @ramCost 2 GB
         * @param {string} sym Stock symbol.
         * @returns {number} The ask price of a stock.
         */
        getStockAskPrice (sym: StockSymbol): number;

        /**
         * Given a stock’s symbol (NOT the company name), returns the bid price of that stock.
         * The symbol is a sequence of two to four capital letters.
         * 
         * @ramCost 2 GB
         * @param {string} sym Stock symbol.
         * @returns {number} The bid price of a stock.
         */
        getStockBidPrice (sym: StockSymbol): number;

        /**
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
         * ```js
         * pos = getStockPosition("ECP");
         * shares      = pos[0];
         * avgPx       = pos[1];
         * sharesShort = pos[2];
         * avgPxShort  = pos[3];
         * ```
         * @ramCost 2 GB
         * @param {string} sym Stock symbol.
         * @returns {[number,number,number,number]} Array of four elements that represents the player’s position in a stock.
         */
        getStockPosition (sym: StockSymbol): [number, number, number, number];

        /**
         * Returns the maximum number of shares that the stock has.
         * This is the maximum amount of the stock that can be purchased
         * in both the Long and Short positions combined.
         *
         * @ramCost 2 GB
         * @param {string} sym Stock symbol.
         * @returns {number} Maximum number of shares that the stock has.
         */
        getStockMaxShares (sym: StockSymbol): number;

        /**
         * Calculates and returns how much it would cost to buy a given number of shares of a stock.
         * This takes into account spread, large transactions influencing the price of the stock and commission fees.
         *
         * @ramCost 2 GB
         * @param {string} sym Stock symbol.
         * @param {number} shares Number of shares to purchase.
         * @param {string} posType Specifies whether the order is a “Long” or “Short” position.
         * @returns {number} Cost to buy a given number of shares of a stock.
         */
        getStockPurchaseCost (sym: StockSymbol, shares: Number, posType: OrderPos): number;

        /**
         * Calculates and returns how much you would gain from selling a given number of shares of a stock.
         * This takes into account spread, large transactions influencing the price of the stock and commission fees.
         *
         * @ramCost 2 GB
         * @param {string} sym Stock symbol.
         * @param {number} shares Number of shares to sell.
         * @param {string} posType Specifies whether the order is a “Long” or “Short” position.
         * @returns {number} Gain from selling a given number of shares of a stock.
         */
        getStockSaleGain (sym: StockSymbol, shares: Number, posType: OrderPos): number;


        /**
         * Attempts to purchase shares of a stock using a Market Order.
         *
         * If the player does not have enough money to purchase the specified number of shares,
         * then no shares will be purchased. Remember that every transaction on the stock exchange
         * costs a certain commission fee.
         *
         * If this function successfully purchases the shares, it will return the stock price at which
         * each share was purchased. Otherwise, it will return 0.
         *
         * @ramCost 2.5 GB
         * @param {string} sym Stock symbol.
         * @param {number} shares Number of shares to purchased. Must be positive. Will be rounded to nearest integer.
         * @returns {number} The stock price at which each share was purchased, otherwise 0 if the shares weren't purchased.
         */
        buyStock (sym: StockSymbol, shares: number): number;

        /**
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
         * @ramCost 2.5 GB
         * @param {string} sym Stock symbol.
         * @param {number} shares Number of shares to sell. Must be positive. Will be rounded to nearest integer.
         * @returns {number} The stock price at which each share was sold, otherwise 0 if the shares weren't sold.
         */
        sellStock (sym: StockSymbol, shares: number): number;

        /**
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
         * @ramCost 2.5 GB
         * @param {string} sym Stock symbol.
         * @param {number} shares Number of shares to short. Must be positive. Will be rounded to nearest integer.
         * @returns {number} The stock price at which each share was purchased, otherwise 0 if the shares weren't purchased.
         */
        shortStock (sym: StockSymbol, shares: number): number;

        /**
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
         * @ramCost 2.5 GB
         * @param {string} sym Stock symbol.
         * @param {number} shares Number of shares to sell. Must be positive. Will be rounded to nearest integer.
         * @returns {number} The stock price at which each share was sold, otherwise 0 if the shares weren't sold.
         */
        sellShort (sym: StockSymbol, shares: number): number;

        /**
         * Places an order on the stock market. This function only works for Limit and Stop Orders.
         *
         * The ability to place limit and stop orders is **not** immediately available to the player and
         * must be unlocked later on in the game.
         *
         * Returns true if the order is successfully placed, and false otherwise.
         *
         * @ramCost 2.5 GB
         * @param {string} sym Stock symbol.
         * @param {number} shares Number of shares for order. Must be positive. Will be rounded to nearest integer.
         * @param {number} price Execution price for the order.
         * @param {string} type Type of order.
         * @param {string} pos Specifies whether the order is a “Long” or “Short” position.
         * @returns {boolean} True if the order is successfully placed, and false otherwise.
         */
        placeOrder (
            sym: StockSymbol,
            shares: number,
            price: number,
            type: OrderType,
            pos: OrderPos,
        ): boolean;

        /**
         * Cancels an oustanding Limit or Stop order on the stock market.
         *
         * The ability to use limit and stop orders is **not** immediately available to the player and
         * must be unlocked later on in the game.
         *
         * @ramCost 2.5 GB
         * @param {string} sym Stock symbol.
         * @param {number} shares Number of shares for order. Must be positive. Will be rounded to nearest integer.
         * @param {number} price Execution price for the order.
         * @param {string} type Type of order.
         * @param {string} pos Specifies whether the order is a “Long” or “Short” position.
         */
        cancelOrder (
            sym: StockSymbol,
            shares: number,
            price: number,
            type: OrderType,
            pos: OrderPos,
        ): void;

        /**
         * Returns your order book for the stock market.
         *
         * This is an object containing information for all the Limit and Stop Orders you have in the stock market.
         * The object has the following structure:
         *
         * ```js
         * {
         *  StockSymbol1: [ // Array of orders for this stock
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
         *  StockSymbol2: [ // Array of orders for this stock
         *      ...
         *  ],
         *  ...
         * }
         * ```
         * The “Order type” property can have one of the following four values:
         * * “Limit Buy Order”
         * * “Limit Sell Order”
         * * “Stop Buy Order”
         * * “Stop Sell Order”
         * Note that the order book will only contain information for stocks that you actually have orders in.
         *
         * @example
         * ```js
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
         * @ramCost 2.5 GB
         * @returns {object} Object containing information for all the Limit and Stop Orders you have in the stock market.
         */
        getOrders (): StockOrder;

        /**
         * Returns the volatility of the specified stock.
         *
         * Volatility represents the maximum percentage by which a stock’s price can change every tick.
         * The volatility is returned as a decimal value, NOT a percentage
         * (e.g. if a stock has a volatility of 3%, then this function will return 0.03, NOT 3).
         *
         * In order to use this function, you must first purchase access to the Four Sigma (4S) Market Data TIX API.
         *
         * @ramCost 2.5 GB
         * @param {string} sym Stock symbol.
         * @returns {number} Volatility of the specified stock.
         */
        getStockVolatility (sym: StockSymbol): number;

        /**
         * Returns the probability that the specified stock’s price will increase (as opposed to decrease) during the next tick.
         *
         * The probability is returned as a decimal value, NOT a percentage
         * (e.g. if a stock has a 60% chance of increasing, then this function will return 0.6, NOT 60).
         *
         * In other words, if this function returned 0.30 for a stock, then this means that the stock’s price has a
         * 30% chance of increasing and a 70% chance of decreasing during the next tick.
         *
         * In order to use this function, you must first purchase access to the Four Sigma (4S) Market Data TIX API.
         *
         * @ramCost 2.5 GB
         * @param {string} sym Stock symbol.
         * @returns {number} Probability that the specified stock’s price will increase (as opposed to decrease) during the next tick.
         */
        getStockForecast (sym: StockSymbol): number;

        /**
         * Purchase 4S Market Data Access.
         *
         * Returns true if you successfully purchased it or if you already have access. Returns false otherwise.
         *
         * @ramCost 2.5 GB
         * @returns {boolean} True if you successfully purchased it or if you already have access, false otherwise.
         */
        purchase4SMarketData (): boolean;

        /**
         * Purchase 4S Market Data TIX API Access.
         *
         * Returns true if you successfully purchased it or if you already have access. Returns false otherwise.
         *
         * @ramCost 2.5 GB
         * @returns {boolean} True if you successfully purchased it or if you already have access, false otherwise.
         */
        purchase4SMarketDataTixApi (): boolean;
    }

    export interface Singularity {
        /**
         * If you are not in BitNode-4, then you must have Level 1 of Source-File 4 in order to use this function and the RAM cost is doubled.
         *
         * This function will automatically set you to start taking a course at a university.
         * If you are already in the middle of some “working” action (such as working at a
         * company, for a faction, or on a program), then running this function will automatically
         * cancel that action and give you your earnings.
         *
         * The cost and experience gains for all of these universities and classes are the same as
         * if you were to manually visit and take these classes.
         *
         * @ramCost 2 GB
         * @singularity Level 1
         * @param {string} universityName Name of university. You must be in the correct city for whatever university you specify.
         * @param {string} courseName Name of course.
         * @returns {boolean} True if actions is successfully started, false otherwise.
         */
        universityCourse (
            universityName: University,
            courseName: UniversityCourse,
        ): boolean;

        /**
         * If you are not in BitNode-4, then you must have Level 1 of Source-File 4 in order to use this function and the RAM cost is doubled.
         *
         * This function will automatically set you to start working out at a gym to train
         * a particular stat. If you are already in the middle of some “working” action
         * (such as working at a company, for a faction, or on a program), then running
         * this function will automatically cancel that action and give you your earnings.
         *
         * The cost and experience gains for all of these gyms are the same as if you were
         * to manually visit these gyms and train
         *
         * @ramCost 2 GB
         * @singularity Level 1
         * @param {string} gymName Name of gym. You must be in the correct city for whatever gym you specify.
         * @param {string} stat The stat you want to train.
         * @returns {boolean} True if actions is successfully started, false otherwise.
         */
        gymWorkout (gymName: Gym, stat: GymStat): boolean;

        /**
         * If you are not in BitNode-4, then you must have Level 1 of Source-File 4 in order to use this function and the RAM cost is doubled.
         *
         * This function allows the player to travel to any city. The cost for using this
         * function is the same as the cost for traveling through the Travel Agency.
         *
         * @ramCost 2 GB
         * @singularity Level 1
         * @param {string} city City to travel to.
         * @returns {boolean} True if actions is successful, false otherwise.
         */
        travelToCity (city: City): boolean;

        /**
         * If you are not in BitNode-4, then you must have Level 1 of Source-File 4 in order to use this function and the RAM cost is doubled.
         *
         * This function allows you to automatically purchase a TOR router. The cost for
         * purchasing a TOR router using this function is the same as if you were to
         * manually purchase one.
         *
         * @ramCost 2 GB
         * @singularity Level 1
         * @returns {boolean} True if actions is successful, false otherwise.
         */
        purchaseTor (): boolean;

        /**
         * If you are not in BitNode-4, then you must have Level 1 of Source-File 4 in order to use this function and the RAM cost is doubled.
         *
         * This function allows you to automatically purchase programs. You MUST have a
         * TOR router in order to use this function. The cost of purchasing programs
         * using this function is the same as if you were purchasing them through the Dark
         * Web using the Terminal buy command.
         *
         * @example
         * ```js
         * purchaseProgram("brutessh.exe");
         * ```
         * @ramCost 2 GB
         * @singularity Level 1
         * @param {string} programName Name of program to purchase.
         * @returns {boolean} True if the specified program is purchased, and false otherwise.
         */
        purchaseProgram (programName: PurchaseableProgram): boolean;

        /**
         * If you are not in BitNode-4, then you must have Level 1 of Source-File 4 in order to use this function and the RAM cost is doubled.
         *
         * Returns an object with the Player’s stats.
         *
         * @example
         * ```js
         * res = getStats();
         * print('My charisma level is: ' + res.charisma);
         * ```
         * @ramCost 0.5 GB
         * @singularity Level 1
         * @returns {object} Object with the Player’s stats.
         */
        getStats (): PlayerStats;

        /**
         * If you are not in BitNode-4, then you must have Level 1 of Source-File 4 in order to use this function and the RAM cost is doubled.
         *
         * Returns an object with various information about your character.
         *
         * @ramCost 0.5 GB
         * @singularity Level 1
         * @returns {object} Object with various information about your character.
         */
        getCharacterInformation (): CharacterInfo;

        /**
         * If you are not in BitNode-4, then you must have Level 1 of Source-File 4 in order to use this function and the RAM cost is doubled.
         *
         * Returns a boolean indicating whether or not the player is currently performing an
         * ‘action’. These actions include working for a company/faction, studying at a univeristy,
         * working out at a gym, creating a program, committing a crime, or carrying out a Hacking Mission.
         *
         * @ramCost 0.5 GB
         * @singularity Level 1
         * @returns {boolean} True if the player is currently performing an ‘action’, false otherwise.
         */
        isBusy (): boolean;

        /**
         * If you are not in BitNode-4, then you must have Level 1 of Source-File 4 in order to use this function and the RAM cost is doubled.
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
         * @ramCost 1 GB
         * @singularity Level 1
         * @returns {boolean} True if the player’s action was ended, false if the player was not performing an action.
         */
        stopAction (): boolean;

        /**
         * If you are not in BitNode-4, then you must have Level 2 of Source-File 4 in order to use this function and the RAM cost is doubled.
         *
         * This function will upgrade amount of RAM on the player’s home computer. The cost is
         * the same as if you were to do it manually.
         *
         * This function will return true if the player’s home computer RAM is successfully upgraded, and false otherwise.
         *
         * @ramCost 3 GB
         * @singularity Level 2
         * @returns {boolean} True if the player’s home computer RAM is successfully upgraded, and false otherwise.
         */
        upgradeHomeRam (): boolean;

        /**
         * If you are not in BitNode-4, then you must have Level 2 of Source-File 4 in order to use this function and the RAM cost is doubled.
         *
         * Returns the cost of upgrading the player’s home computer RAM.
         *
         * @ramCost 1.5 GB
         * @singularity Level 2
         * @returns {number} Cost of upgrading the player’s home computer RAM.
         */
        getUpgradeHomeRamCost (): number;

        /**
         * If you are not in BitNode-4, then you must have Level 2 of Source-File 4 in order to use this function and the RAM cost is doubled.
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
         * ```js
         * //If you only want to work until you get 100,000 company reputation. One small hack to get around this is to continuously restart the action to receive your earnings:
         * while (getCompanyRep(COMPANY HERE) < VALUE) {
         *    workForCompany();
         *    sleep(60000);
         * }
         * //This way, your company reputation will be updated every minute.
         * ```
         * @ramCost 3 GB
         * @singularity Level 2
         * @param {string} [companyName] Name of company to work for. Must be an exact match. Optional. If not specified, this argument defaults to the last job that you worked
         * @returns {boolean} True if the player starts working, and false otherwise.
         */
        workForCompany (companyName?: CompanyName): boolean;

        /**
         * If you are not in BitNode-4, then you must have Level 2 of Source-File 4 in order to use this function and the RAM cost is doubled.
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
         * @ramCost 3 GB
         * @singularity Level 2
         * @param {string} companyName Name of company to apply to.
         * @param {string} field Field to which you want to apply.
         * @returns {boolean} True if the player successfully get a job/promotion, and false otherwise.
         */
        applyToCompany (companyName: CompanyName, field: CompanyField): boolean;

        /**
         * If you are not in BitNode-4, then you must have Level 2 of Source-File 4 in order to use this function and the RAM cost is doubled.
         *
         * This function will return the amount of reputation you have at the specified company.
         * If the company passed in as an argument is invalid, -1 will be returned.
         *
         * @ramCost 1 GB
         * @singularity Level 2
         * @param {string} companyName Name of the company.
         * @returns {number} Amount of reputation you have at the specified company.
         */
        getCompanyRep (companyName: CompanyName): number;

        /**
         * If you are not in BitNode-4, then you must have Level 2 of Source-File 4 in order to use this function and the RAM cost is doubled.
         *
         * This function will return the amount of favor you have at the specified company.
         * If the company passed in as an argument is invalid, -1 will be returned.
         *
         * @ramCost 1 GB
         * @singularity Level 2
         * @param {string} companyName Name of the company.
         * @returns {number} Amount of favor you have at the specified company.
         */
        getCompanyFavor (companyName: CompanyName): number;

        /**
         * If you are not in BitNode-4, then you must have Level 2 of Source-File 4 in order to use this function and the RAM cost is doubled.
         *
         * This function will return the amount of favor you will gain for the specified
         * company when you reset by installing Augmentations.
         *
         * @ramCost 0.75 GB
         * @singularity Level 2
         * @param {string} companyName Name of the company.
         * @returns {number} Amount of favor you gain at the specified company when you reset by installing Augmentations.
         */
        getCompanyFavorGain (companyName: CompanyName): number;

        /**
         * If you are not in BitNode-4, then you must have Level 2 of Source-File 4 in order to use this function and the RAM cost is doubled.
         *
         * Returns an array with the name of all Factions you currently have oustanding invitations from.
         *
         * @ramCost 3 GB
         * @singularity Level 2
         * @returns {string[]} Array with the name of all Factions you currently have oustanding invitations from.
         */
        checkFactionInvitations (): FactionName[];

        /**
         * If you are not in BitNode-4, then you must have Level 2 of Source-File 4 in order to use this function and the RAM cost is doubled.
         *
         * This function will automatically accept an invitation from a faction and join it.
         *
         * @ramCost 3 GB
         * @singularity Level 2
         * @param {string} faction Name of faction to join.
         * @returns {boolean} True if player joined the faction, and false otherwise.
         */
        joinFaction (faction: FactionName): boolean;

        /**
         * If you are not in BitNode-4, then you must have Level 2 of Source-File 4 in order to use this function and the RAM cost is doubled.
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
         * ```js
         * //If you only want to work until you get 100,000 faction reputation. One small hack to get around this is to continuously restart the action to receive your earnings:
         * while (getFactionRep(FACTION NAME) < VALUE) {
         *    workForFaction(FACNAME, WORKTYPE);
         *    sleep(60000);
         * }
         * //This way, your faction reputation will be updated every minute.
         * ```
         * @ramCost 3 GB
         * @singularity Level 2
         * @param {string} faction Name of faction to work for.
         * @param {string} workType Type of work to perform for the faction.
         * @returns {boolean} True if the player starts working, and false otherwise.
         */
        workForFaction (faction: FactionName, workType: FactionWork): boolean;

        /**
         * If you are not in BitNode-4, then you must have Level 2 of Source-File 4 in order to use this function and the RAM cost is doubled.
         *
         * This function returns the amount of reputation you have for the specified faction.
         *
         * @ramCost 1 GB
         * @singularity Level 2
         * @param {string} faction Name of faction to work for.
         * @returns {number} Amount of reputation you have for the specified faction.
         */
        getFactionRep (faction: FactionName): number;

        /**
         * If you are not in BitNode-4, then you must have Level 2 of Source-File 4 in order to use this function and the RAM cost is doubled.
         *
         * This function returns the amount of favor you have for the specified faction.
         *
         * @ramCost 1 GB
         * @singularity Level 2
         * @param {string} faction Name of faction.
         * @returns {number} Amount of favor you have for the specified faction.
         */
        getFactionFavor (faction: FactionName): number;

        /**
         * If you are not in BitNode-4, then you must have Level 2 of Source-File 4 in order to use this function and the RAM cost is doubled.
         *
         * This function returns the amount of favor you will gain for the specified
         * faction when you reset by installing Augmentations.
         *
         * @ramCost 0.75 GB
         * @singularity Level 2
         * @param {string} faction Name of faction.
         * @returns {number} Amount of favor you will gain for the specified faction when you reset by installing Augmentations.
         */
        getFactionFavorGain (faction: FactionName): number;

        /**
         * If you are not in BitNode-4, then you must have Level 3 of Source-File 4 in order to use this function and the RAM cost is doubled.
         *
         * Attempts to donate money to the specified faction in exchange for reputation.
         * Returns true if you successfully donate the money, and false otherwise.
         *
         * @ramCost 5 GB
         * @singularity Level 3
         * @param {string} faction Name of faction to donate to.
         * @param {string} amount Amount of money to donate.
         * @returns {boolean} True if the money was donated, and false otherwise.
         */
        donateToFaction (faction: FactionName, amount: number): boolean;

        /**
         * If you are not in BitNode-4, then you must have Level 3 of Source-File 4 in order to use this function and the RAM cost is doubled.
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
         * ```js
         * createProgram(“relaysmtp.exe”);
         * ```
         * @ramCost 5 GB
         * @singularity Level 3
         * @param {string} program Name of program to create.
         * @returns {boolean} True if you successfully start working on the specified program, and false otherwise.
         */
        createProgram (program: CreatableProgram): boolean;

        /**
         * If you are not in BitNode-4, then you must have Level 3 of Source-File 4 in order to use this function and the RAM cost is doubled.
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
         * and schedule your crime attempts. Instead, I would use the {@link isBusy} Singularity
         * function to check whether you have finished attempting a crime. This is because
         * although the game sets a certain crime to be X amount of seconds, there is no
         * guarantee that your browser will follow that time limit.
         *
         * @ramCost 5 GB
         * @singularity Level 3
         * @param {string} crime Name of crime to attempt.
         * @returns {number} True if you successfully start working on the specified program, and false otherwise.
         */
        commitCrime (crime: Crime): number;

        /**
         * If you are not in BitNode-4, then you must have Level 3 of Source-File 4 in order to use this function and the RAM cost is doubled.
         *
         * This function returns your chance of success at commiting the specified crime.
         * The chance is returned as a decimal (i.e. 60% would be returned as 0.6).
         *
         * @ramCost 5 GB
         * @singularity Level 3
         * @param {string} crime Name of crime.
         * @returns {number} Chance of success at commiting the specified crime as a decimal.
         */
        getCrimeChance (crime: Crime): number;

        /**
         * If you are not in BitNode-4, then you must have Level 3 of Source-File 4 in order to use this function and the RAM cost is doubled.
         *
         * Returns the stats of the crime.
         *
         * @ramCost 5 GB
         * @singularity Level 3
         * @param {string} crime Name of crime. Not case-sensitive
         * @returns {number} The stats of the crime.
         */
        getCrimeStats (crime: Crime): CrimeStats;

        /**
         * If you are not in BitNode-4, then you must have Level 3 of Source-File 4 in order to use this function and the RAM cost is doubled.
         *
         * This function returns an array containing the names (as strings) of all Augmentations you have.
         *
         * @ramCost 5 GB
         * @singularity Level 3
         * @param {boolean} [purchased] Specifies whether the returned array should include Augmentations you have purchased but not yet installed. By default, this argument is false which means that the return value will NOT have the purchased Augmentations.
         * @returns {string[]} Array containing the names (as strings) of all Augmentations you have.
         */
        getOwnedAugmentations (purchased?: boolean): AugmentName[];

        /**
         * If you are not in BitNode-4, then you must have Level 3 of Source-File 4 in order to use this function and the RAM cost is doubled.
         *
         * Returns an array of source files
         *
         * @ramCost 5 GB
         * @singularity Level 3
         * @returns {object[]} Array containing an object with number and level of the source file.
         */
        getOwnedSourceFiles (): SourceFileLvl[];

        /**
         * If you are not in BitNode-4, then you must have Level 3 of Source-File 4 in order to use this function and the RAM cost is doubled.
         *
         * Returns an array containing the names (as strings) of all Augmentations
         * that are available from the specified faction.
         *
         * @ramCost 5 GB
         * @singularity Level 3
         * @param {string} faction Name of faction.
         * @returns {string[]} Array containing the names of all Augmentations.
         */
        getAugmentationsFromFaction (faction: FactionName): AugmentName[];

        /**
         * If you are not in BitNode-4, then you must have Level 3 of Source-File 4 in order to use this function and the RAM cost is doubled.
         *
         * This function returns an array with the names of the prerequisite Augmentation(s) for the specified Augmentation.
         * If there are no prerequisites, a blank array is returned.
         *
         * @ramCost 5 GB
         * @singularity Level 3
         * @param {string} augName Name of Augmentation.
         * @returns {string[]} Array with the names of the prerequisite Augmentation(s) for the specified Augmentation.
         */
        getAugmentationPrereq (augName: AugmentName): AugmentName[];

        /**
         * If you are not in BitNode-4, then you must have Level 3 of Source-File 4 in order to use this function and the RAM cost is doubled.
         *
         * This function returns an array with two elements that gives the cost for
         * the specified Augmentation. The first element in the returned array is the
         * reputation requirement of the Augmentation, and the second element is the
         * money cost.
         *
         * If an invalid Augmentation name is passed in for the augName argument, this
         * function will return the array [-1, -1].
         *
         * @ramCost 5 GB
         * @singularity Level 3
         * @param {string} augName Name of Augmentation.
         * @returns {[number, number]} Array with first element as a reputation requirement and second element as the money cost.
         */
        getAugmentationCost (augName: AugmentName): [number, number];

        /**
         * If you are not in BitNode-4, then you must have Level 3 of Source-File 4 in order to use this function and the RAM cost is doubled.
         *
         * This function will try to purchase the specified Augmentation through the given Faction.
         *
         * This function will return true if the Augmentation is successfully purchased, and false otherwise.
         *
         * @ramCost 5 GB
         * @singularity Level 3
         * @param {string} faction Name of faction to purchase Augmentation from.
         * @param {string} augmnet Name of Augmentation to purchase.
         * @returns {boolean} True if the Augmentation is successfully purchased, and false otherwise.
         */
        purchaseAugmentation (faction: FactionName, augmnet: AugmentName): boolean;

        /**
         * If you are not in BitNode-4, then you must have Level 3 of Source-File 4 in order to use this function and the RAM cost is doubled.
         *
         * This function returns augmentation stats.
         *
         * @ramCost 5 GB
         * @singularity Level 3
         * @param {string} name Name of Augmentation. CASE-SENSITIVE.
         * @returns {object} Augmentation stats.
         */
        getAugmentationStats (name: AugmentName): AugmentationStats;

        /**
         * If you are not in BitNode-4, then you must have Level 3 of Source-File 4 in order to use this function and the RAM cost is doubled.
         *
         * This function will automatically install your Augmentations, resetting the game as usual.
         *
         * @ramCost 5 GB
         * @singularity Level 3
         * @param {string} cbScript Optional callback script. This is a script that will automatically be run after Augmentations are installed (after the reset). This script will be run with no arguments and 1 thread. It must be located on your home computer.
         */
        installAugmentations (cbScript?: Script): void;

        /**
         * If you are not in BitNode-4, then you must have Level 3 of Source-File 4 in order to use this function and the RAM cost is doubled.
         *
         * This function will perform a reset even if you don’t have any augmentation installed.
         *
         * @ramCost 5 GB
         * @singularity Level 3
         */
        softReset (): void;
    }

    export interface HackNet {
        /**
         * Returns the number of Hacknet Nodes you own.
         *
         * @ramCost 0 GB
         * @returns {number} number of hacknet nodes.
         */
        numNodes (): number;

        /**
         * Purchases a new Hacknet Node. Returns a number with the index of the
         * Hacknet Node. This index is equivalent to the number at the end of
         * the Hacknet Node’s name (e.g The Hacknet Node named `hacknet-node-4`
         * will have an index of 4).
         *
         * If the player cannot afford to purchase a new Hacknet Node then the function will return -1.
         *
         * @ramCost 0 GB
         * @returns {number} The index of the Hacknet Node or if the player cannot afford to purchase a new Hacknet Node the function will return -1.
         */
        purchaseNode (): number;

        /**
         * Returns the cost of purchasing a new Hacknet Node.
         *
         * @ramCost 0 GB
         * @returns {number} Cost of purchasing a new Hacknet Node.
         */
        getPurchaseNodeCost (): number;

        /**
         * Returns an object containing a variety of stats about the specified Hacknet Node.
         *
         * Note that for Hacknet Nodes, production refers to the amount of money the node generates.
         * For Hacknet Servers (the upgraded version of Hacknet Nodes), production refers to the
         * amount of hashes the node generates.
         *
         * @ramCost 0 GB
         * @param {number} index Index/Identifier of Hacknet Node
         * @returns {object} Object containing a variety of stats about the specified Hacknet Node.
         */
        getNodeStats (index: number): NodeStats;

        /**
         * Tries to upgrade the level of the specified Hacknet Node by n.
         *
         * Returns true if the Hacknet Node’s level is successfully upgraded by n
         * or if it is upgraded by some positive amount and the Node reaches its max level.
         *
         * Returns false otherwise.
         *
         * @ramCost 0 GB
         * @param {number} index Index/Identifier of Hacknet Node.
         * @param {number} n Number of levels to purchase. Must be positive. Rounded to nearest integer.
         * @returns {boolean} True if the Hacknet Node’s level is successfully upgraded, false otherwise.
         */
        upgradeLevel (index: number, n: number): boolean;

        /**
         * Tries to upgrade the specified Hacknet Node’s RAM n times.
         * Note that each upgrade doubles the Node’s RAM.
         * So this is equivalent to multiplying the Node’s RAM by 2 n.
         *
         * Returns true if the Hacknet Node’s RAM is successfully upgraded n times
         * or if it is upgraded some positive number of times and the Node reaches it max RAM.
         *
         * Returns false otherwise.
         *
         * @ramCost 0 GB
         * @param {number} index Index/Identifier of Hacknet Node.
         * @param {number} n Number of times to upgrade RAM. Must be positive. Rounded to nearest integer.
         * @returns {boolean} True if the Hacknet Node’s ram is successfully upgraded, false otherwise.
         */
        upgradeRam (index: number, n: number): boolean;

        /**
         * Tries to purchase n cores for the specified Hacknet Node.
         *
         * Returns true if it successfully purchases n cores for the Hacknet Node
         * or if it purchases some positive amount and the Node reaches its max number of cores.
         *
         * Returns false otherwise.
         *
         * @ramCost 0 GB
         * @param {number} index Index/Identifier of Hacknet Node.
         * @param {number} n Number of cores to purchase. Must be positive. Rounded to nearest integer.
         * @returns {boolean} True if the Hacknet Node’s cores are successfully purchased, false otherwise.
         */
        upgradeCore (index: number, n: number): boolean;

        /**
         * This function is only applicable for Hacknet Servers (the upgraded version of a Hacknet Node).
         *
         * Tries to upgrade the specified Hacknet Server’s cache n times.
         *
         * Returns true if it successfully upgrades the Server’s cache n times,
         * or if it purchases some positive amount and the Server reaches its max cache level.
         *
         * Returns false otherwise.
         *
         * @ramCost 0 GB
         * @param {number} index Index/Identifier of Hacknet Node.
         * @param {number} n Number of cache levels to purchase. Must be positive. Rounded to nearest integer.
         * @returns {boolean} True if the Hacknet Node’s cores are successfully purchased, false otherwise.
         */
        upgradeCache (index: number, n: number): boolean;

        /**
         * Returns the cost of upgrading the specified Hacknet Node by n levels.
         *
         * If an invalid value for n is provided, then this function returns 0.
         * If the specified Hacknet Node is already at max level, then Infinity is returned.
         *
         * @ramCost 0 GB
         * @param {number} index Index/Identifier of Hacknet Node.
         * @param {number} n Number of levels to upgrade. Must be positive. Rounded to nearest integer.
         * @returns {number} Cost of upgrading the specified Hacknet Node.
         */
        getLevelUpgradeCost (index: number, n: number): number;

        /**
         * Returns the cost of upgrading the RAM of the specified Hacknet Node n times.
         *
         * If an invalid value for n is provided, then this function returns 0.
         * If the specified Hacknet Node is already at max level, then Infinity is returned.
         *
         * @ramCost 0 GB
         * @param {number} index Index/Identifier of Hacknet Node.
         * @param {number} n Number of times to upgrade RAM. Must be positive. Rounded to nearest integer.
         * @returns {number} Cost of upgrading the specified Hacknet Node's ram.
         */
        getRamUpgradeCost (index: number, n: number): number;

        /**
         * Returns the cost of upgrading the number of cores of the specified Hacknet Node by n.
         *
         * If an invalid value for n is provided, then this function returns 0.
         * If the specified Hacknet Node is already at max level, then Infinity is returned.
         *
         * @ramCost 0 GB
         * @param {number} index Index/Identifier of Hacknet Node.
         * @param {number} n Number of times to upgrade cores. Must be positive. Rounded to nearest integer.
         * @returns {number} Cost of upgrading the specified Hacknet Node's number of cores.
         */
        getCoreUpgradeCost (index: number, n: number): number;

        /**
         * This function is only applicable for Hacknet Servers (the upgraded version of a Hacknet Node).
         *
         * Returns the cost of upgrading the cache level of the specified Hacknet Server by n.
         *
         * If an invalid value for n is provided, then this function returns 0.
         * If the specified Hacknet Node is already at max level, then Infinity is returned.
         *
         * @ramCost 0 GB
         * @param {number} index Index/Identifier of Hacknet Node.
         * @param {number} n Number of times to upgrade cache. Must be positive. Rounded to nearest integer.
         * @returns {number} Cost of upgrading the specified Hacknet Node's cache.
         */
        getCacheUpgradeCost (index: number, n: number): number;

        /**
         * This function is only applicable for Hacknet Servers (the upgraded version of a Hacknet Node).
         *
         * Returns the number of hashes you have.
         *
         * @ramCost 0 GB
         * @returns {number} Number of hashes you have.
         */
        numHashes (): number;

        /**
         * This function is only applicable for Hacknet Servers (the upgraded version of a Hacknet Node).
         *
         * Returns the number of hashes required for the specified upgrade. The name of the upgrade must be an exact match.
         *
         * @example
         * ```js
         * var upgradeName = "Sell for Corporation Funds";
         * if (hacknet.numHashes() > hacknet.hashCost(upgradeName)) {
         *    hacknet.spendHashes(upgName);
         * }
         * ```
         * @ramCost 0 GB
         * @param {string} upgName Name of the upgrade of Hacknet Node.
         * @returns {number} Number of hashes required for the specified upgrade.
         */
        hashCost (upgName: HashUpgrades): number;

        /**
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
         * ```js
         * hacknet.spendHashes("Sell for Corporation Funds");
         * hacknet.spendHashes("Increase Maximum Money", "foodnstuff");
         * ```
         * @ramCost 0 GB
         * @param {string} upgName Name of the upgrade of Hacknet Node.
         * @param {string} [upgTarget] Object to which upgrade applies. Required for certain upgrades.
         * @returns {boolean} True if the upgrade is successfully purchased, and false otherwise..
         */
        spendHashes (upgName: HashUpgrades, upgTarget?: Host): boolean;
    }

    export interface BladeBurner {
        /**
         * You have to be employed in the Bladeburner division and be in BitNode-7
         * or have Source-File 7 in order to use this function.
         *
         * Returns an array of strings containing the names of all Bladeburner contracts.
         *
         * @ramCost 0.4 GB
         * @returns {string[]} Array of strings containing the names of all Bladeburner contracts.
         */
        getContractNames (): BladeburnerContracts[];

        /**
         * You have to be employed in the Bladeburner division and be in BitNode-7
         * or have Source-File 7 in order to use this function.
         *
         * Returns an array of strings containing the names of all Bladeburner operations.
         *
         * @ramCost 0.4 GB
         * @returns {string[]} Array of strings containing the names of all Bladeburner operations.
         */
        getOperationNames (): BladeburnerOperations[];

        /**
         * You have to be employed in the Bladeburner division and be in BitNode-7
         * or have Source-File 7 in order to use this function.
         *
         * Returns an array of strings containing the names of all Bladeburner Black Ops.
         *
         * @ramCost 0.4 GB
         * @returns {string[]} Array of strings containing the names of all Bladeburner Black Ops.
         */
        getBlackOpNames (): BladeburnerBlackOps[];

        /**
         * You have to be employed in the Bladeburner division and be in BitNode-7
         * or have Source-File 7 in order to use this function.
         *
         * Returns an array of strings containing the names of all general Bladeburner actions.
         *
         * @ramCost 0.4 GB
         * @returns {string[]} Array of strings containing the names of all general Bladeburner actions.
         */
        getGeneralActionNames (): BladeburnerGenActions[];

        /**
         * You have to be employed in the Bladeburner division and be in BitNode-7
         * or have Source-File 7 in order to use this function.
         *
         * Returns an array of strings containing the names of all general Bladeburner skills.
         *
         * @ramCost 0.4 GB
         * @returns {string[]} Array of strings containing the names of all general Bladeburner skills.
         */
        getSkillNames (): BladeburnerSkills[];

        /**
         * You have to be employed in the Bladeburner division and be in BitNode-7
         * or have Source-File 7 in order to use this function.
         *
         * Attempts to start the specified Bladeburner action.
         * Returns true if the action was started successfully, and false otherwise.
         *
         * @ramCost 4 GB
         * @param {string} type Type of action.
         * @param {string} name Name of action. Must be an exact match
         * @returns {boolean} True if the action was started successfully, and false otherwise.
         */
        startAction (
            type: BladeburnerActTypes,
            name: BladeburnerGenActions | BladeburnerContracts | BladeburnerOperations | BladeburnerBlackOps
        ): boolean;

        /**
         * You have to be employed in the Bladeburner division and be in BitNode-7
         * or have Source-File 7 in order to use this function.
         *
         * Stops the current Bladeburner action.
         *
         * @ramCost 2 GB
         */
        stopBladeburnerAction (): void;

        /**
         * You have to be employed in the Bladeburner division and be in BitNode-7
         * or have Source-File 7 in order to use this function.
         *
         * Returns an object that represents the player’s current Bladeburner action.
         * If the player is not performing an action, the function will return an object with the ‘type’ property set to “Idle”.
         *
         * @ramCost 1 GB
         * @returns {object} Object that represents the player’s current Bladeburner action.
         */
        getCurrentAction (): BladeburnerCurAction;

        /**
         * You have to be employed in the Bladeburner division and be in BitNode-7
         * or have Source-File 7 in order to use this function.
         *
         * Returns the number of seconds it takes to complete the specified action
         *
         * @ramCost 4 GB
         * @param {string} type Type of action.
         * @param {string} name Name of action. Must be an exact match.
         * @returns {number} Number of seconds it takes to complete the specified action.
         */
        getActionTime (
            type: BladeburnerActTypes,
            name: BladeburnerGenActions | BladeburnerContracts | BladeburnerOperations | BladeburnerBlackOps
        ): number;

        /**
         * You have to be employed in the Bladeburner division and be in BitNode-7
         * or have Source-File 7 in order to use this function.
         *
         * Returns the estimated success chance for the specified action.
         * This chance is returned as a decimal value, NOT a percentage
         * (e.g. if you have an estimated success chance of 80%, then this function will return 0.80, NOT 80).
         *
         * @ramCost 4 GB
         * @param {string} type Type of action.
         * @param {string} name Name of action. Must be an exact match.
         * @returns {number} Estimated success chance for the specified action.
         */
        getActionEstimatedSuccessChance (
            type: BladeburnerActTypes,
            name: BladeburnerGenActions | BladeburnerContracts | BladeburnerOperations | BladeburnerBlackOps
        ): number;

        /**
         * You have to be employed in the Bladeburner division and be in BitNode-7
         * or have Source-File 7 in order to use this function.
         *
         * Returns the average Bladeburner reputation gain for successfully
         * completing the specified action.
         * Note that this value is an ‘average’ and the real reputation gain may vary slightly from this value.
         *
         * @ramCost 4 GB
         * @param {string} type Type of action.
         * @param {string} name Name of action. Must be an exact match.
         * @param {number} [level] Optional action level at which to calculate the gain
         * @returns {number} Average Bladeburner reputation gain for successfully completing the specified action.
         */
        getActionRepGain (
            type: BladeburnerActTypes,
            name: BladeburnerGenActions | BladeburnerContracts | BladeburnerOperations | BladeburnerBlackOps,
            level: number
        ): number;

        /**
         * You have to be employed in the Bladeburner division and be in BitNode-7
         * or have Source-File 7 in order to use this function.
         *
         * Returns the remaining count of the specified action.
         *
         * Note that this is meant to be used for Contracts and Operations.
         * This function will return ‘Infinity’ for actions such as Training and Field Analysis.
         * This function will return 1 for BlackOps not yet completed regardless of wether
         * the player has the required rank to attempt the mission or not.
         *
         * @ramCost 4 GB
         * @param {string} type Type of action.
         * @param {string} name Name of action. Must be an exact match.
         * @returns {number} Remaining count of the specified action.
         */
        getActionCountRemaining (
            type: BladeburnerActTypes,
            name: BladeburnerGenActions | BladeburnerContracts | BladeburnerOperations | BladeburnerBlackOps
        ): number;

        /**
         * You have to be employed in the Bladeburner division and be in BitNode-7
         * or have Source-File 7 in order to use this function.
         *
         * Returns the maximum level for this action.
         *
         * Returns -1 if an invalid action is specified.
         *
         * @ramCost 4 GB
         * @param {string} type Type of action.
         * @param {string} name Name of action. Must be an exact match.
         * @returns {number} Maximum level of the specified action.
         */
        getActionMaxLevel (
            type: BladeburnerActTypes,
            name: BladeburnerGenActions | BladeburnerContracts | BladeburnerOperations | BladeburnerBlackOps
        ): number;

        /**
         * You have to be employed in the Bladeburner division and be in BitNode-7
         * or have Source-File 7 in order to use this function.
         *
         * Returns the current level of this action.
         *
         * Returns -1 if an invalid action is specified.
         *
         * @ramCost 4 GB
         * @param {string} type Type of action.
         * @param {string} name Name of action. Must be an exact match.
         * @returns {number} Current level of the specified action.
         */
        getActionCurrentLevel (
            type: BladeburnerActTypes,
            name: BladeburnerGenActions | BladeburnerContracts | BladeburnerOperations | BladeburnerBlackOps
        ): number;

        /**
         * You have to be employed in the Bladeburner division and be in BitNode-7
         * or have Source-File 7 in order to use this function.
         *
         * Return a boolean indicating whether or not this action is currently set to autolevel.
         *
         * Returns false if an invalid action is specified.
         *
         * @ramCost 4 GB
         * @param {string} type Type of action.
         * @param {string} name Name of action. Must be an exact match.
         * @returns {boolean} True if the action is set to autolevel, and false otherwise.
         */
        getActionAutolevel (
            type: BladeburnerActTypes,
            name: BladeburnerGenActions | BladeburnerContracts | BladeburnerOperations | BladeburnerBlackOps
        ): boolean;

        /**
         * You have to be employed in the Bladeburner division and be in BitNode-7
         * or have Source-File 7 in order to use this function.
         *
         * Enable/disable autoleveling for the specified action.
         *
         * @ramCost 4 GB
         * @param {string} type Type of action.
         * @param {string} name Name of action. Must be an exact match.
         * @param {boolean} autoLevel Whether or not to autolevel this action
         */
        setActionAutolevel (
            type: BladeburnerActTypes,
            name: BladeburnerGenActions | BladeburnerContracts | BladeburnerOperations | BladeburnerBlackOps,
            autoLevel: boolean
        ): void;

        /**
         * You have to be employed in the Bladeburner division and be in BitNode-7
         * or have Source-File 7 in order to use this function.
         *
         * Set the level for the specified action.
         *
         * @ramCost 4 GB
         * @param {string} type Type of action.
         * @param {string} name Name of action. Must be an exact match.
         * @param {number} level Level to set this action to.
         */
        setActionLevel (
            type: BladeburnerActTypes,
            name: BladeburnerGenActions | BladeburnerContracts | BladeburnerOperations | BladeburnerBlackOps,
            level: number
        ): void;

        /**
         * You have to be employed in the Bladeburner division and be in BitNode-7
         * or have Source-File 7 in order to use this function.
         *
         * Returns the player’s Bladeburner Rank.
         *
         * @ramCost 4 GB
         * @returns {number} Player’s Bladeburner Rank.
         */
        getRank (): number;

        /**
         * You have to be employed in the Bladeburner division and be in BitNode-7
         * or have Source-File 7 in order to use this function.
         *
         * Returns the rank required to complete this BlackOp.
         *
         * Returns -1 if an invalid action is specified.
         *
         * @ramCost 2 GB
         * @param {string} name Name of BlackOp. Must be an exact match.
         * @returns {number} Rank required to complete this BlackOp.
         */
        getBlackOpRank (name: BladeburnerBlackOps): number;

        /**
         * You have to be employed in the Bladeburner division and be in BitNode-7
         * or have Source-File 7 in order to use this function.
         *
         * Returns the number of Bladeburner skill points you have.
         *
         * @ramCost 4 GB
         * @returns {number} Number of Bladeburner skill points you have.
         */
        getSkillPoints (): number;

        /**
         * You have to be employed in the Bladeburner division and be in BitNode-7
         * or have Source-File 7 in order to use this function.
         *
         * This function returns your level in the specified skill.
         *
         * The function returns -1 if an invalid skill name is passed in.
         *
         * @ramCost 4 GB
         * @param {string} skillName Name of skill. Case-sensitive and must be an exact match
         * @returns {number} Level in the specified skill.
         */
        getSkillLevel (name: BladeburnerSkills): number;

        /**
         * You have to be employed in the Bladeburner division and be in BitNode-7
         * or have Source-File 7 in order to use this function.
         *
         * This function returns the number of skill points needed to upgrade the specified skill.
         *
         * The function returns -1 if an invalid skill name is passed in.
         *
         * @ramCost 4 GB
         * @param {string} skillName Name of skill. Case-sensitive and must be an exact match
         * @returns {number} Number of skill points needed to upgrade the specified skill.
         */
        getSkillUpgradeCost (name: BladeburnerSkills): number;

        /**
         * You have to be employed in the Bladeburner division and be in BitNode-7
         * or have Source-File 7 in order to use this function.
         *
         * Attempts to upgrade the specified Bladeburner skill.
         *
         * Returns true if the skill is successfully upgraded, and false otherwise.
         *
         * @ramCost 4 GB
         * @param {string} skillName Name of skill to be upgraded. Case-sensitive and must be an exact match
         * @returns {boolean} true if the skill is successfully upgraded, and false otherwise.
         */
        upgradeSkill (name: BladeburnerSkills): boolean;

        /**
         * You have to be employed in the Bladeburner division and be in BitNode-7
         * or have Source-File 7 in order to use this function.
         *
         * Returns the number of Bladeburner team members you have assigned to the specified action.
         *
         * Setting a team is only applicable for Operations and BlackOps. This function will return 0 for other action types.
         *
         * @ramCost 4 GB
         * @param {string} type Type of action.
         * @param {string} name Name of action. Must be an exact match.
         * @returns {number} Number of Bladeburner team members that were assigned to the specified action.
         */
        getTeamSize (
            type: BladeburnerActTypes,
            name: BladeburnerGenActions | BladeburnerContracts | BladeburnerOperations | BladeburnerBlackOps
        ): number;

        /**
         * You have to be employed in the Bladeburner division and be in BitNode-7
         * or have Source-File 7 in order to use this function.
         *
         * Set the team size for the specified Bladeburner action.
         *
         * Returns the team size that was set, or -1 if the function failed.
         *
         * @ramCost 4 GB
         * @param {string} type Type of action.
         * @param {string} name Name of action. Must be an exact match.
         * @param {number} size Number of team members to set. Will be converted using Math.round().
         * @returns {number} Number of Bladeburner team members you assigned to the specified action.
         */
        setTeamSize (
            type: BladeburnerActTypes,
            name: BladeburnerGenActions | BladeburnerContracts | BladeburnerOperations | BladeburnerBlackOps,
            size: number
        ): number;

        /**
         * You have to be employed in the Bladeburner division and be in BitNode-7
         * or have Source-File 7 in order to use this function.
         *
         * Returns the estimated number of Synthoids in the specified city,
         * or -1 if an invalid city was specified.
         *
         * @ramCost 4 GB
         * @param {string} cityName Name of city. Case-sensitive
         * @returns {number} Estimated number of Synthoids in the specified city.
         */
        getCityEstimatedPopulation (name: City): number;

        /**
         * You have to be employed in the Bladeburner division and be in BitNode-7
         * or have Source-File 7 in order to use this function.
         *
         * Returns the estimated number of Synthoid communities in the specified city,
         * or -1 if an invalid city was specified.
         *
         * @ramCost 4 GB
         * @param {string} cityName Name of city. Case-sensitive
         * @returns {number} Estimated number of Synthoids communities in the specified city.
         */
        getCityEstimatedCommunities (name: City): number;

        /**
         * You have to be employed in the Bladeburner division and be in BitNode-7
         * or have Source-File 7 in order to use this function.
         *
         * Returns the chaos in the specified city,
         * or -1 if an invalid city was specified.
         *
         * @ramCost 4 GB
         * @param {string} cityName Name of city. Case-sensitive
         * @returns {number} Chaos in the specified city.
         */
        getCityChaos (name: City): number;

        /**
         * You have to be employed in the Bladeburner division and be in BitNode-7
         * or have Source-File 7 in order to use this function.
         *
         * Returns the city that the player is currently in (for Bladeburner).
         *
         * @ramCost 4 GB
         * @returns {string} City that the player is currently in (for Bladeburner).
         */
        getCity (): City;

        /**
         * You have to be employed in the Bladeburner division and be in BitNode-7
         * or have Source-File 7 in order to use this function.
         *
         * Attempts to switch to the specified city (for Bladeburner only).
         *
         * Returns true if successful, and false otherwise
         *
         * @ramCost 4 GB
         * @param {string} cityName Name of city. Case-sensitive
         * @returns {boolean} true if successful, and false otherwise
         */
        switchCity (name: City): boolean;

        /**
         * You have to be employed in the Bladeburner division and be in BitNode-7
         * or have Source-File 7 in order to use this function.
         *
         * Returns an array with two elements:
         * * [Current stamina, Max stamina]
         * @example
         * ```js
         * function getStaminaPercentage() {
         *    let res = bladeburner.getStamina();
         *    return res[0] / res[1];
         * }
         * ```
         * @ramCost 4 GB
         * @returns {[number, number]} Array containing current stamina and max stamina.
         */
        getStamina (): [number, number];

        /**
         * You have to be employed in the Bladeburner division and be in BitNode-7
         * or have Source-File 7 in order to use this function.
         *
         * Attempts to join the Bladeburner faction.
         *
         * Returns true if you successfully join the Bladeburner faction, or if you are already a member.
         *
         * Returns false otherwise.
         *
         * @ramCost 4 GB
         * @returns {boolean} True if you successfully join the Bladeburner faction, or if you are already a member, false otherwise.
         */
        joinBladeburnerFaction (): boolean;

        /**
         * You have to be employed in the Bladeburner division and be in BitNode-7
         * or have Source-File 7 in order to use this function.
         *
         * Attempts to join the Bladeburner division.
         *
         * Returns true if you successfully join the Bladeburner division, or if you are already a member.
         *
         * Returns false otherwise.
         *
         * @ramCost 4 GB
         * @returns {boolean} True if you successfully join the Bladeburner division, or if you are already a member, false otherwise.
         */
        joinBladeburnerDivision (): boolean;

        /**
         * You have to be employed in the Bladeburner division and be in BitNode-7
         * or have Source-File 7 in order to use this function.
         *
         * Returns the amount of accumulated “bonus time” (seconds) for the Bladeburner mechanic.
         *
         * “Bonus time” is accumulated when the game is offline or if the game is inactive in the browser.
         *
         * “Bonus time” makes the game progress faster, up to 5x the normal speed.
         * For example, if an action takes 30 seconds to complete but you’ve accumulated over
         * 30 seconds in bonus time, then the action will only take 6 seconds in real life to complete.
         *
         * @ramCost 0 GB
         * @returns {number} Amount of accumulated “bonus time” (seconds) for the Bladeburner mechanic.
         */
        getBonusTime (): number;
    }

    export interface CodingContract {
        /**
         * Attempts to solve the Coding Contract with the provided solution.
         *
         * @ramCost 10 GB
         * @param {string|string[]|number}answer Solution for the contract.
         * @param {string} fn Filename of the contract.
         * @param {string} [host] Host or IP of the server containing the contract. Optional. Defaults to current server if not provided.
         * @returns {boolean} True if the solution was correct, false otherwise.
         */
        attempt (
            answer: string | string[] | number,
            fn: string,
            host?: Host
        ): boolean;

        /**
         * Attempts to solve the Coding Contract with the provided solution.
         *
         * @ramCost 10 GB
         * @param {string|string[]|number}answer Solution for the contract.
         * @param {string} fn Filename of the contract.
         * @param {string} [host] Host or IP of the server containing the contract. Optional. Defaults to current server if not provided.
         * @param {object} [opts] Optional parameters for configuring function behavior.
         * @returns {boolean} True if the solution was correct, false otherwise. If the returnReward option is configured, then the function will instead return a string. If the contract is successfully solved, the string will contain a description of the contract’s reward. Otherwise, it will be an empty string.
         */
        attempt (
            answer: string | string[] | number,
            fn: string,
            host?: Host,
            opts?: CodingAttemptOptions
        ): boolean | string;

        /**
         * Returns a name describing the type of problem posed by the Coding Contract.
         * (e.g. Find Largest Prime Factor, Total Ways to Sum, etc.)
         *
         * @ramCost 5 GB
         * @param {string} fn Filename of the contract.
         * @param {string} [host] Host or IP of the server containing the contract. Optional. Defaults to current server if not provided.
         * @returns {string} Name describing the type of problem posed by the Coding Contract.
         */
        getContractType (fn: string, host?: Host): CodingContractTypes;

        /**
         * Get the full text description for the problem posed by the Coding Contract.
         *
         * @ramCost 5 GB
         * @param {string} fn Filename of the contract.
         * @param {string} [host] Host or IP of the server containing the contract. Optional. Defaults to current server if not provided.
         * @returns {string} Contract’s text description.
         */
        getDescription (fn: string, host?: Host): string;

        /**
         * Get the data associated with the specific Coding Contract.
         * Note that this is not the same as the contract’s description.
         * This is just the data that the contract wants you to act on in order to solve
         *
         * @ramCost 5 GB
         * @param {string} fn Filename of the contract.
         * @param {string} [host] Host or IP of the server containing the contract. Optional. Defaults to current server if not provided.
         * @returns {string} The specified contract’s data;
         */
        getData (fn: string, host?: Host): string;

        /**
         * Get the number of tries remaining on the contract before it self-destructs.
         *
         * @ramCost 2 GB
         * @param {string} fn Filename of the contract.
         * @param {string} [host] Host or IP of the server containing the contract. Optional. Defaults to current server if not provided.
         * @returns {number} How many attempts are remaining for the contract;
         */
        getNumTriesRemaining (fn: string, host?: Host): number;
    }

    export interface Gang {

        /**
         * If you are not in BitNode-2, then you must have Source-File 2 in order to use this function.
         *
         * Get the names of all Gang members
         *
         * @ramCost 1 GB
         * @returns {string[]} Names of all Gang members.
         */
        getMemberNames (): string[];

        /**
         * If you are not in BitNode-2, then you must have Source-File 2 in order to use this function.
         *
         * Get general information about the gang.
         *
         * @ramCost 2 GB
         * @returns {object} Object containing general information about the gang.
         */
        getGangInformation (): GangGenInfo;

        /**
         * If you are not in BitNode-2, then you must have Source-File 2 in order to use this function.
         *
         * Get territory and power information about all gangs.
         *
         * @ramCost 2 GB
         * @returns {object} Object containing territory and power information about all gangs.
         */
        getOtherGangInformation (): GangOtherInfo;

        /**
         * If you are not in BitNode-2, then you must have Source-File 2 in order to use this function.
         *
         * Get stat and equipment-related information about a Gang Member
         *
         * @ramCost 2 GB
         * @param {string} name Name of member.
         * @returns {object} Object containing stat and equipment-related information about a Gang Member.
         */
        getMemberInformation (name: string): GangMemberInfo;

        /**
         * If you are not in BitNode-2, then you must have Source-File 2 in order to use this function.
         *
         * Returns boolean indicating whether a member can currently be recruited
         *
         * @ramCost 1 GB
         * @returns {boolean} True if a member can currently be recruited, false otherwise.
         */
        canRecruitMember (): boolean;

        /**
         * If you are not in BitNode-2, then you must have Source-File 2 in order to use this function.
         *
         * Attempt to recruit a new gang member.
         *
         * Possible reasons for failure:
         * * Cannot currently recruit a new member
         * * There already exists a member with the specified name
         *
         * @ramCost 2 GB
         * @param {string} name Name of member to recruit.
         * @returns {boolean} True if the member was successfully recruited, false otherwise.
         */
        recruitMember (name: string): boolean;

        /**
         * If you are not in BitNode-2, then you must have Source-File 2 in order to use this function.
         *
         * Get the name of all valid tasks that Gang members can be assigned to.
         *
         * @ramCost 1 GB
         * @returns {string[]} All valid tasks that Gang members can be assigned to.
         */
        getTaskNames (): GangTasks[];

        /**
         * If you are not in BitNode-2, then you must have Source-File 2 in order to use this function.
         *
         * Attempts to assign the specified Gang Member to the specified task.
         * If an invalid task is specified, the Gang member will be set to idle (“Unassigned”).
         *
         * @ramCost 2 GB
         * @param {string} memberName Name of Gang member to assign.
         * @param {string} taskName Task to assign.
         * @returns {boolean} True if the Gang Member was successfully assigned to the task, false otherwise.
         */
        setMemberTask (memberName: string, taskName: GangTasks): boolean;

        /**
         * If you are not in BitNode-2, then you must have Source-File 2 in order to use this function.
         *
         * Get the stats of a gang task stats. This is typically used to evaluate which action should be executed next.
         *
         * @ramCost 1 GB
         * @param {string} name  Name of the task.
         * @returns {boolean} Detailed stats of a task.
         */
        getTaskStats (name: GangTasks): GangTasksStats;

        /**
         * If you are not in BitNode-2, then you must have Source-File 2 in order to use this function.
         *
         * Get the name of all possible equipment/upgrades you can purchase for your Gang Members.
         * This includes Augmentations.
         *
         * @ramCost 1 GB
         * @returns {string[]} Names of all Equpiment/Augmentations.
         */
        getEquipmentNames (): (GangEquipment | GangAugmentations)[];

        /**
         * If you are not in BitNode-2, then you must have Source-File 2 in order to use this function.
         *
         * Get the amount of money it takes to purchase a piece of Equipment or an Augmentation.
         * If an invalid Equipment/Augmentation is specified, this function will return Infinity.
         *
         * @ramCost 2 GB
         * @param {string} equipName Name of equipment.
         * @returns {number} Cost to purchase the specified Equipment/Augmentation (number). Infinity for invalid arguments
         */
        getEquipmentCost (equipName: GangEquipment | GangAugmentations): number;

        /**
         * If you are not in BitNode-2, then you must have Source-File 2 in order to use this function.
         *
         * Get the specified equipment type.
         *
         * @ramCost 2 GB
         * @param {string} equipName Name of equipment.
         * @returns {number} Type of the equipment.
         */
        getEquipmentType (
            equipName: GangEquipment | GangAugmentations
        ): GangEquipmentType;

        /**
         * If you are not in BitNode-2, then you must have Source-File 2 in order to use this function.
         *
         * Get the specified equipment stats.
         *
         * @ramCost 2 GB
         * @param {string} equipName Name of equipment.
         * @returns {object} A dictionary containing the stats of the equipment.
         */
        getEquipmentStats (
            equipName: GangEquipment | GangAugmentations
        ): GangEquipmentStats;

        /**
         * If you are not in BitNode-2, then you must have Source-File 2 in order to use this function.
         *
         * Attempt to purchase the specified Equipment/Augmentation for the specified Gang member.
         *
         * @ramCost 4 GB
         * @param {string} memberName Name of Gang member to purchase the equipment for.
         * @param {string} equipName Name of Equipment/Augmentation to purchase.
         * @returns {boolean} True if the equipment was successfully purchased. False otherwise
         */
        purchaseEquipment (memberName: string, equipName: GangEquipment | GangAugmentations): boolean;

        /**
         * If you are not in BitNode-2, then you must have Source-File 2 in order to use this function.
         *
         * Ascend the specified Gang Member.
         *
         * @ramCost 4 GB
         * @param {string} memberName Name of member to ascend.
         * @returns {object} Object with info about the ascension results.
         */
        ascendMember (memberName: string): GangMemberAscension;

        /**
         * If you are not in BitNode-2, then you must have Source-File 2 in order to use this function.
         *
         * Set whether or not the gang should engage in territory warfare
         *
         * @ramCost 2 GB
         * @param {boolean} engage Whether or not to engage in territory warfare.
         */
        setTerritoryWarfare (engage: boolean): void;

        /**
         * If you are not in BitNode-2, then you must have Source-File 2 in order to use this function.
         *
         * Returns the chance you have to win a clash with the specified gang. The chance is returned in decimal form, not percentage
         *
         * @ramCost 4 GB
         * @param {string} gangName Target gang
         * @returns {number} Chance you have to win a clash with the specified gang.
         */
        getChanceToWinClash (gangName: GangName): number;

        /**
         * If you are not in BitNode-2, then you must have Source-File 2 in order to use this function.
         *
         * Returns the amount of accumulated “bonus time” (seconds) for the Gang mechanic.
         *
         * “Bonus time” is accumulated when the game is offline or if the game is inactive in the browser.
         *
         * “Bonus time” makes the game progress faster, up to 10x the normal speed.
         *
         * @ramCost 0 GB
         * @returns {number} Bonus time for the Gang mechanic in seconds.
         */
        getBonusTime (): number;
    }

    export interface Sleeve {
        /**
         * If you are not in BitNode-10, then you must have Source-File 10 in order to use this function.
         *
         * Return the number of duplicate sleeves the player has.
         *
         * @ramCost 4 GB
         * @returns {number} number of duplicate sleeves the player has.
         */
        getNumSleeves (): number;

        /**
         * If you are not in BitNode-10, then you must have Source-File 10 in order to use this function.
         *
         * Return a structure containing the stats of the sleeve.
         *
         * @ramCost 4 GB
         * @param {number} sleeveNumber Index of the sleeve to get stats of.
         * @returns {object} Object containing the stats of the sleeve.
         */
        getSleeveStats (sleeveNumber: number): SleeveStats;

        /**
         * If you are not in BitNode-10, then you must have Source-File 10 in order to use this function.
         *
         * Return a struct containing tons of information about this sleeve
         *
         * @ramCost 4 GB
         * @param {number} sleeveNumber Index of the sleeve to retrieve information.
         * @returns {object} Object containing tons of information about this sleeve.
         */
        getInformation (sleeveNumber: number): SleeveInformation;

        /**
         * If you are not in BitNode-10, then you must have Source-File 10 in order to use this function.
         *
         * Return the current task that the sleeve is performing. type is set to “Idle” if the sleeve isn’t doing anything.
         *
         * @ramCost 4 GB
         * @param {number} sleeveNumber Index of the sleeve to retrieve task from.
         * @returns {object} Object containing information the current task that the sleeve is performing.
         */
        getTask (sleeveNumber: number): SleeveTask;

        /**
         * If you are not in BitNode-10, then you must have Source-File 10 in order to use this function.
         *
         * Return a boolean indicating whether or not this action was set successfully.
         *
         * @ramCost 4 GB
         * @param {number} sleeveNumber Index of the sleeve to start recovery.
         * @returns {boolean} True if this action was set successfully, false otherwise.
         */
        setToShockRecovery (sleeveNumber: number): boolean;

        /**
         * If you are not in BitNode-10, then you must have Source-File 10 in order to use this function.
         *
         * Return a boolean indicating whether or not this action was set successfully.
         *
         * @ramCost 4 GB
         * @param {number} sleeveNumber Index of the sleeve to start synchronizing.
         * @returns {boolean} True if this action was set successfully, false otherwise.
         */
        setToSynchronize (sleeveNumber: number): boolean;

        /**
         * If you are not in BitNode-10, then you must have Source-File 10 in order to use this function.
         *
         * Return a boolean indicating whether or not this action was set successfully.
         *
         * Returns false if an invalid action is specified.
         *
         * @ramCost 4 GB
         * @param {number} sleeveNumber Index of the sleeve to start commiting crime.
         * @param {string} name Name of the crime. Must be an exact match.
         * @returns {boolean} True if this action was set successfully, false otherwise.
         */
        setToCommitCrime (sleeveNumber: number, name: Crime): boolean;

        /**
         * If you are not in BitNode-10, then you must have Source-File 10 in order to use this function.
         *
         * Return a boolean indicating whether or not the sleeve started working or this faction.
         *
         * @ramCost 4 GB
         * @param {number} sleeveNumber Index of the sleeve to work for the faction.
         * @param {string} factionName Name of the faction to work for.
         * @param {string} factionWorkType Name of the action to perform for this faction.
         * @returns {boolean} True if the sleeve started working on this faction, false otherwise.
         */
        setToFactionWork (sleeveNumber: number, factionName: FactionName, factionWorkType: FactionWork): boolean;

        /**
         * If you are not in BitNode-10, then you must have Source-File 10 in order to use this function.
         *
         * Return a boolean indicating whether or not the sleeve started working or this company.
         *
         * @ramCost 4 GB
         * @param {number} sleeveNumber Index of the sleeve to work for the company.
         * @param {string} companyName Name of the company to work for.
         * @returns {boolean} True if the sleeve started working on this company, false otherwise.
         */
        setToCompanyWork (sleeveNumber: number, companyName: CompanyName): boolean;

        /**
         * If you are not in BitNode-10, then you must have Source-File 10 in order to use this function.
         *
         * Return a boolean indicating whether or not this action was set successfully.
         *
         * @ramCost 4 GB
         * @param {number} sleeveNumber Index of the sleeve to start taking class.
         * @param {string} university Name of the university to attend.
         * @param {string} className Name of the class to follow.
         * @returns {boolean} True if this action was set successfully, false otherwise.
         */
        setToUniversityCourse (sleeveNumber: number, university: University, className: UniversityCourse): boolean;

        /**
         * If you are not in BitNode-10, then you must have Source-File 10 in order to use this function.
         *
         * Return a boolean indicating whether or not the sleeve started working out.
         *
         * @ramCost 4 GB
         * @param {number} sleeveNumber Index of the sleeve to workout at the gym.
         * @param {string} gymName Name of the gym.
         * @param {string} stat Name of the stat to train.
         * @returns {boolean} True if the sleeve started working out, false otherwise.
         */
        setToGymWorkout (sleeveNumber: number, gymName: Gym, stat: GymStat): boolean;

        /**
         * If you are not in BitNode-10, then you must have Source-File 10 in order to use this function.
         *
         * Return a boolean indicating whether or not the sleeve reached destination.
         *
         * @ramCost 4 GB
         * @param {number} sleeveNumber Index of the sleeve to travel.
         * @param {string} cityName Name of the destination city.
         * @returns {boolean} True if the sleeve reached destination, false otherwise.
         */
        travel (sleeveNumber: number, cityName: City): boolean;

        /**
         * If you are not in BitNode-10, then you must have Source-File 10 in order to use this function.
         *
         * Return a list of augmentation names that this sleeve has installed.
         *
         * @ramCost 4 GB
         * @param {number} sleeveNumber Index of the sleeve to retrieve augmentations from.
         * @returns {string[]} List of augmentation names that this sleeve has installed.
         */
        getSleeveAugmentations (sleeveNumber: number): AugmentName[];

        /**
         * If you are not in BitNode-10, then you must have Source-File 10 in order to use this function.
         *
         * Return a list of augmentations that the player can buy for this sleeve.
         *
         * @ramCost 4 GB
         * @param {number} sleeveNumber Index of the sleeve to retrieve purchasable augmentations from.
         * @returns {string[]} List of augmentations that the player can buy for this sleeve.
         */
        getSleevePurchasableAugs (sleeveNumber: number): AugmentPair[];

        /**
         * If you are not in BitNode-10, then you must have Source-File 10 in order to use this function.
         *
         * Return true if the aug was purchased and installed on the sleeve.
         *
         * @ramCost 4 GB
         * @param {number} sleeveNumber Index of the sleeve to buy an aug for.
         * @param {string} augName Name of the aug to buy. Must be an exact match.
         * @returns {boolean} True if the aug was purchased and installed on the sleeve, false otherwise.
         */
        purchaseSleeveAug (sleeveNumber: number, augName: AugmentName): boolean;
    }

    export interface BitBurner extends TIX, Singularity {

        /**
         * Not all functions in the Hacknet Node API are immediately available.
         *
         * Note that none of these functions will write to the script’s logs.
         *
         * If you want to see what your script is doing you will have to print to the logs yourself.
         *
         * @ramCost 4 GB
         */
        readonly hacknet: HackNet;
        /**
         * @ramCost 0 GB
         */
        readonly bladeburner: BladeBurner;
        /**
         * @ramCost 0 GB
         */
        readonly codingcontract: CodingContract;
        /**
         * @ramCost 0 GB
         */
        readonly gang: Gang;
        /**
         * @ramCost 0 GB
         */
        readonly sleeve: CodingContract;

        /**
         * Arguments passed into a script can be accessed using a normal
         * array using the [] operator (args[0], args[1], etc…).
         *
         * It is also possible to get the number of arguments that was passed into a script using:
         * ```js
         * args.length
         * ```
         * WARNING: Do not try to modify the args array. This will break the game.
         *
         * @ramCost 0 GB
         */
        readonly args: any[];

        /**
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
         * ```js
         * hack("foodnstuff");
         * hack("10.1.2.3");
         * hack("foodnstuff", { threads: 5 }); // Only use 5 threads to hack
         * ```
         * @ramCost 0.1 GB
         * @param {string} host IP or hostname of the target server to hack.
         * @param {object} [opts] Optional parameters for configuring function behavior.
         * @returns {Promise<number>} The amount of money stolen if the hack is successful, and zero otherwise.
         */
        hack (host: Host, opts?: BasicHGWOptions): Promise<number>;

        /**
         * Use your hacking skills to increase the amount of money available on a server.
         * The runtime for this command depends on your hacking level and the target server’s
         * security level. When `grow` completes, the money available on a target server will
         * be increased by a certain, fixed percentage. This percentage is determined by the
         * target server’s growth rate (which varies between servers) and security level. Generally,
         * higher-level servers have higher growth rates. The getServerGrowth() function can be used
         * to obtain a server’s growth rate.
         *
         * Like {@link hack}, `grow` can be called on any server, regardless of where the script is running.
         * The grow() command requires root access to the target server, but there is no required hacking
         * level to run the command. It also raises the security level of the target server by 0.004.
         *
         * @example
         * ```js
         * grow("foodnstuff");
         * grow("foodnstuff", { threads: 5 }); // Only use 5 threads to grow
         * ```
         * @ramCost 0.15 GB
         * @param {string} host IP or hostname of the target server to grow.
         * @param {object} [opts] Optional parameters for configuring function behavior.
         * @returns {Promise<number>} The number by which the money on the server was multiplied for the growth.
         */
        grow (host: Host, opts?: BasicHGWOptions): Promise<number>;

        /**
         * Use your hacking skills to attack a server’s security, lowering the server’s security level.
         * The runtime for this command depends on your hacking level and the target server’s security
         * level. This function lowers the security level of the target server by 0.05.
         *
         * Like {@link hack} and {@link grow}, `weaken` can be called on any server, regardless of
         * where the script is running. This command requires root access to the target server, but
         * there is no required hacking level to run the command.
         *
         * @example
         * ```js
         * weaken("foodnstuff");
         * weaken("foodnstuff", { threads: 5 }); // Only use 5 threads to weaken
         * ```
         * @ramCost 0.15 GB
         * @param {string} host IP or hostname of the target server to weaken.
         * @param {object} [opts] Optional parameters for configuring function behavior.
         * @returns {Promise<number>} The amount by which the target server’s security level was decreased. This is equivalent to 0.05 multiplied by the number of script threads.
         */
        weaken (host: Host, opts?: BasicHGWOptions): Promise<number>;

        /**
         * This function returns the number of script threads you need when running the {@link hack} command
         * to steal the specified amount of money from the target server.
         * If hackAmount is less than zero or greater than the amount of money available on the server,
         * then this function returns -1.
         *
         * Warning: The value returned by this function isn’t necessarily a whole number.
         *
         * @example
         * ```js
         * //For example, let’s say the foodnstuff server has $10m and you run:
         * hackAnalyzeThreads("foodnstuff", 1e6);
         * //If this function returns 50, this means that if your next {@link hack} call is run on a script with 50 threads, it will steal $1m from the foodnstuff server.
         * ```
         * @ramCost 1 GB
         * @param {string} host IP or hostname of the target server to analyze.
         * @param {number} hackAmount Amount of money you want to hack from the server.
         * @returns {number} The number of threads needed to {@link hack} the server for hackAmount money.
         */
        hackAnalyzeThreads (host: Host, hackAmount: number): number;

        /**
         * Returns the percentage of the specified server’s money you will steal with a single hack.
         * This value is returned in percentage form, not decimal
         * (Netscript functions typically return in decimal form, but not this one).
         *
         * @example
         * ```js
         * //For example, assume the following returns 1:
         * hackAnalyzePercent("foodnstuff");
         * //This means that if hack the foodnstuff server, then you will steal 1% of its total money. If you {@link hack} using N threads, then you will steal N% of its total money.
         * ```
         * @ramCost 1 GB
         * @param {string} host IP or hostname of the target server.
         * @returns {number} The percentage of money you will steal from the target server with a single hack.
         */
        hackAnalyzePercent (host: Host): number;

        /**
         * Returns the chance you have of successfully hacking the specified server.
         *
         * This returned value is in decimal form, not percentage.
         *
         * @ramCost 1 GB
         * @param {string} host IP or hostname of the target server.
         * @returns {number} The chance you have of successfully hacking the target server.
         */
        hackChance (host: Host): number;

        /**
         * This function returns the number of “growths” needed in order to increase
         * the amount of money available on the specified server by the specified amount.
         * The specified amount is multiplicative and is in decimal form, not percentage.
         *
         * Warning: The value returned by this function isn’t necessarily a whole number.
         *
         * @example
         * ```js
         * //For example, if you want to determine how many {@link grow} calls you need to double the amount of money on foodnstuff, you would use:
         * growthAnalyze("foodnstuff", 2);
         * //If this returns 100, then this means you need to call {@link grow} 100 times in order to double the money (or once with 100 threads).
         * ```
         * @ramCost 1 GB
         * @param {string} host IP or hostname of the target server.
         * @param {number} growthAmount Multiplicative factor by which the server is grown. Decimal form..
         * @returns {number} The amount of {@link grow} calls needed to grow the specified server by the specified amount
         */
        growthAnalyze (host: Host, growthAmount: number): number;

        /**
         * Suspends the script for n milliseconds.
         *
         * @ramCost 0 GB
         * @param {number} millis Number of milliseconds to sleep.
         * @returns {Promise<void>}
         */
        sleep (millis: number): Promise<void>;

        /**
         * Prints a value or a variable to the script’s logs.
         *
         * @ramCost 0 GB
         * @param {string} msg Value to be printed.
         */
        print (msg: string | number | string[] | number[]): void;

        /**
         * Prints a value or a variable to the Terminal.
         *
         * @ramCost 0 GB
         * @param {string} msg Value to be printed.
         */
        tprint (msg: string | number | string[] | number[]): void;

        /**
         * Clears the script’s logs.
         *
         * @ramCost 0 GB
         */
        clearLog (): void;

        /**
         * Disables logging for the given function. Logging can be disabled
         * for all functions by passing `ALL` as the argument.
         *
         * Note that this does not completely remove all logging functionality.
         * This only stops a function from logging when the function is successful.
         * If the function fails, it will still log the reason for failure.
         *
         * Notable functions that cannot have their logs disabled: {@link run},
         * {@link exec}, {@link exit}.
         *
         * @ramCost 0 GB
         * @param {string} fn Name of function for which to disable logging.
         */
        disableLog (fn: string): void;

        /**
         * Re-enables logging for the given function. If `ALL` is passed into this
         * function as an argument, then it will revert the effects of disableLog(`ALL`).
         *
         * @ramCost 0 GB
         * @param {string} fn Name of function for which to enable logging.
         */
        enableLog (fn: string): void;

        /**
         * Checks the status of the logging for the given function.
         *
         * @ramCost 0 GB
         * @param {string} fn Name of function to check.
         * @returns {boolean} Returns a boolean indicating whether or not logging is enabled for that function (or `ALL`)
         */
        isLogEnabled (fn: string): boolean;

        /**
         * Returns a script’s logs. The logs are returned as an array, where each line is an element in the array.
         * The most recently logged line is at the end of the array.
         * Note that there is a maximum number of lines that a script stores in its logs. This is configurable in the game’s options.
         * If the function is called with no arguments, it will return the current script’s logs.
         *
         * Otherwise, the fn, hostname/ip, and args… arguments can be used to get the logs from another script.
         * Remember that scripts are uniquely identified by both their names and arguments.
         *
         * @example
         * ```js
         * //Get logs from foo.script on the current server that was run with no args
         * getScriptLogs("foo.script");
         * ```
         * @example
         * ```js
         * //Open logs from foo.script on the foodnstuff server that was run with no args
         * getScriptLogs("foo.script", "foodnstuff");
         * ```
         * @example
         * ```js
         * //Open logs from foo.script on the foodnstuff server that was run with the arguments [1, "test"]
         * getScriptLogs("foo.script", "foodnstuff", 1, "test");
         * ```
         * @ramCost 0 GB
         * @param {string} [fn] Optional. Filename of script to get logs from.
         * @param {string} [ip] Optional. IP or hostname of the server that the script is on.
         * @param {...string} [args] Arguments to identify which scripts to get logs for.
         * @returns {string[]} Returns an string array, where each line is an element in the array. The most recently logged line is at the end of the array.
         */
        getScriptLogs (fn?: Script, ip?: Host, ...args: any[]): string[];

        /**
         * Opens a script’s logs. This is functionally the same as the tail Terminal command.
         * 
         * If the function is called with no arguments, it will open the current script’s logs.
         * 
         * Otherwise, the fn, hostname/ip, and args… arguments can be used to get the logs from another script.
         * Remember that scripts are uniquely identified by both their names and arguments.
         *
         * @example
         * ```js
         * //Open logs from foo.script on the current server that was run with no args
         * tail("foo.script");
         * ```
         * @example
         * ```js
         * //Get logs from foo.script on the foodnstuff server that was run with no args
         * tail("foo.script", "foodnstuff");
         * ```
         * @example
         * ```js
         * //Get logs from foo.script on the foodnstuff server that was run with the arguments [1, "test"]
         * tail("foo.script", "foodnstuff", 1, "test");
         * ```
         * @ramCost 0 GB
         * @param {string} host IP or hostname of the server to scan.
         * @param {boolean} hostnames Optional boolean specifying whether the function should output hostnames (if true) or IP addresses (if false).
         */
        tail (fn?: Script, ip?: Host, ...args: any[]): void;

        /**
         * Returns an array containing the hostnames or IPs of all servers that are one
         * node way from the specified target server. The hostnames/IPs in the returned
         * array are strings.
         *
         * @ramCost 0.2 GB
         * @param {string} host IP or hostname of the server to scan.
         * @param {boolean} hostnames Optional boolean specifying whether the function should output hostnames (if true) or IP addresses (if false).
         * @returns {string[]} Returns an string of hostnames or IP.
         */
        scan (host: Host, hostnames?: boolean): Host[];

        /**
         * Runs the NUKE.exe program on the target server. NUKE.exe must exist on your home computer.
         *
         * @example
         * ```js
         * nuke("foodnstuff");
         * ```
         * @ramCost 0.05 GB
         * @param {string} host IP or hostname of the target server.
         */
        nuke (host: Host): void;

        /**
         * Runs the BruteSSH.exe program on the target server. BruteSSH.exe must exist on your home computer.
         *
         * @example
         * ```js
         * brutessh("foodnstuff");
         * ```
         * @ramCost 0.05 GB
         * @param {string} host IP or hostname of the target server.
         */
        brutessh (host: Host): void;

        /**
         * Runs the FTPCrack.exe program on the target server. FTPCrack.exe must exist on your home computer.
         *
         * @example
         * ```js
         * ftpcrack("foodnstuff");
         * ```
         * @ramCost 0.05 GB
         * @param {string} host IP or hostname of the target server.
         */
        ftpcrack (host: Host): void;

        /**
         * Runs the relaySMTP.exe program on the target server. relaySMTP.exe must exist on your home computer.
         *
         * @example
         * ```js
         * relaysmtp("foodnstuff");
         * ```
         * @ramCost 0.05 GB
         * @param {string} host IP or hostname of the target server.
         */
        relaysmtp (host: Host): void;

        /**
         * Runs the HTTPWorm.exe program on the target server. HTTPWorm.exe must exist on your home computer.
         *
         * @example
         * ```js
         * httpworm("foodnstuff");
         * ```
         * @ramCost 0.05 GB
         * @param {string} host IP or hostname of the target server.
         */
        httpworm (host: Host): void;

        /**
         * Runs the SQLInject.exe program on the target server. SQLInject.exe must exist on your home computer.
         *
         * @example
         * ```js
         * sqlinject("foodnstuff");
         * ```
         * @ramCost 0.05 GB
         * @param {string} host IP or hostname of the target server.
         */
        sqlinject (host: Host): void;

        /**
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
         * ```js
         * //The simplest way to use the run command is to call it with just the script name. The following example will run ‘foo.script’ single-threaded with no arguments:
         * run("foo.script");
         * ```
         * @example
         * ```js
         * //The following example will run ‘foo.script’ but with 5 threads instead of single-threaded:
         * run("foo.script", 5);
         * ```
         * @example
         * ```js
         * //This next example will run ‘foo.script’ single-threaded, and will pass the string ‘foodnstuff’ into the script as an argument:
         * run("foo.script", 1, 'foodnstuff');
         * ```
         * @ramCost 1 GB
         * @param {string} script Filename of script to run.
         * @param {number} [numThreads] Optional thread count for new script. Set to 1 by default. Will be rounded to nearest integer.
         * @param {...string} [args] Additional arguments to pass into the new script that is being run. Note that if any arguments are being passed into the new script, then the second argument numThreads must be filled in with a value.
         * @returns {number} Returns the PID of a successfully started script, and 0 otherwise.
         */
        run (
            script: Script,
            numThreads?: number,
            ...args: string[]
        ): number;

        /**
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
         * ```js
         * //The simplest way to use the exec command is to call it with just the script name and the target server. The following example will try to run generic-hack.script on the foodnstuff server:
         * exec("generic-hack.script", "foodnstuff");
         * ```
         * @example
         * ```js
         * //The following example will try to run the script generic-hack.script on the joesguns server with 10 threads:
         * exec("generic-hack.script", "joesguns", 10);
         * ```
         * @example
         * ```js
         * //This last example will try to run the script foo.script on the foodnstuff server with 5 threads. It will also pass the number 1 and the string “test” in as arguments to the script:
         * exec("foo.script", "foodnstuff", 5, 1, "test");
         * ```
         * @ramCost 1.3 GB
         * @param {string} script Filename of script to execute.
         * @param {string} host IP or hostname of the `target server` on which to execute the script.
         * @param {number} [numThreads] Optional thread count for new script. Set to 1 by default. Will be rounded to nearest integer.
         * @param {...string} [args] Additional arguments to pass into the new script that is being run. Note that if any arguments are being passed into the new script, then the third argument numThreads must be filled in with a value.
         * @returns {number} Returns the PID of a successfully started script, and 0 otherwise.
         */
        exec (
            script: Script,
            host: Host,
            numThreads?: number,
            ...args: string[]
        ): number;

        /**
         * Terminates the current script, and then after a delay of about 10 seconds it will execute the
         * newly-specified script. The purpose of this function is to execute a new script without being
         * constrained by the RAM usage of the current one. This function can only be used to run scripts
         * on the local server.
         *
         * Because this function immediately terminates the script, it does not have a return value.
         *
         * @example
         * ```js
         * //The following example will execute the script ‘foo.script’ with 10 threads and the arguments ‘foodnstuff’ and 90:
         * spawn('foo.script', 10, 'foodnstuff', 90);
         * ```
         * @ramCost 2 GB
         * @param {string} script Filename of script to execute.
         * @param {string} numThreads Number of threads to spawn new script with. Will be rounded to nearest integer.
         * @param {...string} [args] Additional arguments to pass into the new script that is being run.
         */
        spawn (script: Script, numThreads?: number, ...args: string[]): void;

        /**
         * Kills the script on the target server specified by the script’s name and arguments.
         * Remember that scripts are uniquely identified by both their name and arguments.
         * For example, if `foo.script` is run with the argument 1, then this is not the same as
         * `foo.script` run with the argument 2, even though they have the same code.
         *
         * @example
         * ```js
         * //The following example will try to kill a script named foo.script on the foodnstuff server that was ran with no arguments:
         * kill("foo.script", "foodnstuff");
         * ```
         * @example
         * ```js
         * //The following will try to kill a script named foo.script on the current server that was ran with no arguments:
         * kill("foo.script", getHostname());
         * ```
         * @example
         * ```js
         * //The following will try to kill a script named foo.script on the current server that was ran with the arguments 1 and “foodnstuff”:
         * kill("foo.script", getHostname(), 1, "foodnstuff");
         * ```
         * @ramCost 0.5 GB
         * @param {string} script Filename of the script to kill
         * @param {string} host IP or hostname of the server on which to kill the script.
         * @param {...string} [args] Arguments to identify which script to kill.
         * @returns {boolean} True if the script is successfully killed, and false otherwise.
         */
        kill (script: Script, host: Host, ...args: string[]): boolean;

        /**
         * Kills the script with the specified PID.
         * Killing a script by its PID will typically have better performance,
         * especially if you have many scripts running.
         * If this function successfully kills the specified script, then it will return true.
         * Otherwise, it will return false.
         *
         * @example
         * ```js
         * if (kill(10)) {
         *     print("Killed script with PID 10!");
         * }
         * ```
         * @ramCost 0.5 GB
         * @param {number} scriptPid PID of the script to kill
         * @returns {boolean} True if the script is successfully killed, and false otherwise.
         */
        kill (scriptPid: number): boolean;

        /**
         * Kills all running scripts on the specified server. This function returns true
         * if any scripts were killed, and false otherwise. In other words, it will return
         * true if there are any scripts running on the target server.
         *
         * @ramCost 0.5 GB
         * @param host {string} IP or hostname of the server on which to kill all scripts.
         * @returns {boolean} True if any scripts were killed, and false otherwise.
         */
        killall (host: Host): boolean;

        /**
         * Terminates the current script immediately.
         *
         * @ramCost 0 GB
         */
        exit (): void;

        /**
         * Copies a script or literature (.lit) file(s) to another server. The files argument can be either a string
         * specifying a single file to copy, or an array of strings specifying multiple files to copy.
         *
         * @example
         * ```js
         * //Copies hack-template.script from the current server to foodnstuff:
         * scp("hack-template.script", "foodnstuff");
         * ```
         * @ramCost 0.6 GB
         * @param {(string|string[])} files Filename or an array of filenames of script/literature files to copy.
         * @param {(string|number)} destination Host or IP of the destination server, which is the server to which the file will be copied.
         * @returns {boolean} True if the script/literature file is successfully copied over and false otherwise. If the files argument is an array then this function will return true if at least one of the files in the array is successfully copied.
         */
        scp (files: string | ReadonlyArray<string>, destination: Host): boolean;

        /**
         * Copies a script or literature (.lit) file(s) to another server. The files argument can be either a string
         * specifying a single file to copy, or an array of strings specifying multiple files to copy.
         *
         * @example
         * ```js
         * //Copies foo.lit from the helios server to the home computer:
         * scp("foo.lit", "helios", "home");
         * ```
         * @example
         * ```js
         * //Tries to copy three files from rothman-uni to home computer:
         * files = ["foo1.lit", "foo2.script", "foo3.script"];
         * scp(files, "rothman-uni", "home");
         * ```
         * @ramCost 0.6 GB
         * @param {(string|string[])} files Filename or an array of filenames of script/literature files to copy.
         * @param {(string|number)} source Host or IP of the source server, which is the server from which the file will be copied. This argument is optional and if it’s omitted the source will be the current server.
         * @param {(string|number)} destination Host or IP of the destination server, which is the server to which the file will be copied.
         * @returns {boolean} True if the script/literature file is successfully copied over and false otherwise. If the files argument is an array then this function will return true if at least one of the files in the array is successfully copied.
         */
        scp (
            files: string | ReadonlyArray<string>,
            source: | Host,
            // tslint:disable-next-line:unified-signatures
            destination: Host
        ): boolean;

        /**
         * Returns an array with the filenames of all files on the specified server
         * (as strings). The returned array is sorted in alphabetic order.
         *
         * @ramCost 0.2 GB
         * @param {string} host Host or IP of the target server.
         * @param {string} grep A substring to search for in the filename.
         * @returns {string[]} Array with the filenames of all files on the specified server.
         */
        ls (host: Host, grep?: string): string[];

        /**
         * Returns an array with general information about all scripts running on the specified target server.
         *
         * @example
         * ```js
         * //(using NetscriptJS (Netscript 2.0))
         * export async function main(ns) {
         *    const ps = ns.ps("home");
         *    for (let i = 0; i < ps.length; ++i) {
         *        ns.tprint(ps[i].filename + ' ' + ps[i].threads);
         *        ns.tprint(ps[i].args);
         *    }
         * }
         * ```
         * @ramCost 0.2 GB
         * @param {string} host Host or IP address of the target server. If not specified, it will be the current server’s IP by default.
         * @returns {object} Array with general information about all scripts running on the specified target server.
         */
        ps (host?: Host): ProcessInfo[];

        /**
         * Returns a boolean indicating whether or not the player has root access to the specified target server.
         *
         * @example
         * ```js
         * if (hasRootAccess("foodnstuff") == false) {
         *    nuke("foodnstuff");
         * }
         * ```
         * @ramCost 0.05 GB
         * @param {string} host Host or IP of the target server
         * @returns {boolean} True if player has root access to the specified target server, and false otherwise.
         */
        hasRootAccess (host: Host): boolean;

        /**
         * Returns a string with the hostname of the server that the script is running on.
         *
         * @ramCost 0.05 GB
         * @returns {string} Hostname of the server that the script is on.
         */
        getHostname (): Host;

        /**
         * Returns the player’s current hacking level.
         *
         * @ramCost 0.05 GB
         * @returns {number} Player’s current hacking level
         */
        getHackingLevel (): number;

        /**
         * Returns an object containing the Player’s hacking related multipliers.
         * These multipliers are returned in fractional forms, not percentages
         * (e.g. 1.5 instead of 150%).
         *
         * @example
         * ```js
         * //Example of how this can be used:
         * mults = getHackingMultipliers();
         * print(mults.chance);
         * print(mults.growth);
         * ```
         * @ramCost 4 GB
         * @returns {object} Object containing the Player’s hacking related multipliers.
         */
        getHackingMultipliers (): HackingMultipliers;

        /**
         * Returns an object containing the Player’s hacknet related multipliers.
         * These multipliers are returned in fractional forms, not percentages
         * (e.g. 1.5 instead of 150%).
         *
         * @example
         * ```js
         * //Example of how this can be used:
         * mults = getHacknetMultipliers();
         * print(mults.production);
         * print(mults.purchaseCost);
         * ```
         * @ramCost 4 GB
         * @returns {object} Object containing the Player’s hacknet related multipliers.
         */
        getHacknetMultipliers (): HacknetMultipliers;

        /**
         * Returns the amount of money available on a server.
         * Running this function on the home computer will return the player’s money.
         *
         * @example
         * ```js
         * getServerMoneyAvailable("foodnstuff");
         * getServerMoneyAvailable("home"); //Returns player's money
         * ```
         * @ramCost 0.1 GB
         * @param {string} host Host or IP of target server
         * @returns {number} Amount of money available on the server.
         */
        getServerMoneyAvailable (host: Host): number;

        /**
         * Returns the maximum amount of money that can be available on a server.
         *
         * @ramCost 0.1 GB
         * @param {string} host Host or IP of target server.
         * @returns {number} Maximum amount of money available on the server.
         */
        getServerMaxMoney (host: Host): number;

        /**
         * Returns the server’s instrinsic “growth parameter”. This growth
         * parameter is a number between 1 and 100 that represents how
         * quickly the server’s money grows. This parameter affects the
         * percentage by which the server’s money is increased when using the
         * {@link grow} function. A higher growth parameter will result in a
         * higher percentage increase from {@link grow}.
         *
         * @ramCost 0.1 GB
         * @param {string} host Host or IP of target server.
         * @returns {number} Parameter that affects the percentage by which the server’s money is increased when using the {@link grow} function.
         */
        getServerGrowth (host: Host): number;

        /**
         * Returns the security level of the target server. A server’s security
         * level is denoted by a number, typically between 1 and 100
         * (but it can go above 100).
         *
         * @ramCost 0.1 GB
         * @param {string} host Host or IP of target server.
         * @returns {number} Security level of the target server.
         */
        getServerSecurityLevel (host: Host): number;

        /**
         * Returns the base security level of the target server. This is the security
         * level that the server starts out with. This is different than
         * {@link getServerSecurityLevel} because {@link getServerSecurityLevel} returns
         * the current security level of a server, which can constantly change due to
         * {@link hack}, {@link grow}, and {@link weaken}, calls on that server.
         * The base security level will stay the same until you reset by
         * installing an Augmentation(s).
         *
         * @ramCost 0.1 GB
         * @param {string} host Host or IP of target server.
         * @returns {number} Base security level of the target server.
         */
        getServerBaseSecurityLevel (host: Host): number;

        /**
         * Returns the minimum security level of the target server.
         *
         * @ramCost 0.1 GB
         * @param {string} host Host or IP of target server.
         * @returns {number} Minimum security level of the target server.
         */
        getServerMinSecurityLevel (host: Host): number;

        /**
         * Returns the required hacking level of the target server.
         *
         * @ramCost 0.1 GB
         * @param {string} host Host or IP of target server.
         * @returns {number} The required hacking level of the target server.
         */
        getServerRequiredHackingLevel (host: Host): number;

        /**
         * Returns the number of open ports required to successfully run NUKE.exe on the specified server.
         *
         * @ramCost 0.1 GB
         * @param {string} host Host or IP of target server.
         * @returns {number} The number of open ports required to successfully run NUKE.exe on the specified server.
         */
        getServerNumPortsRequired (host: Host): number;

        /**
         * Returns an array with two elements that gives information about a server’s memory (RAM).
         * The first element in the array is the amount of RAM that the server has total (in GB).
         * The second element in the array is the amount of RAM that is currently being used on
         * the server (in GB).
         *
         * @example
         * ```js
         * res = getServerRam("helios");
         * totalRam = res[0];
         * ramUsed = res[1];
         * ```
         * @ramCost 0.1 GB
         * @param {string} host Host or IP of target server.
         * @returns {[number,number]} Array with total and used memory on the specified server.
         */
        getServerRam (host: Host): [number, number];

        /**
         * Returns a boolean denoting whether or not the specified server exists.
         *
         * @ramCost 0.1 GB
         * @param {string} host Host or IP of target server.
         * @returns {boolean} True if specified server exists, and false otherwise.
         */
        serverExists (host: Host): boolean;

        /**
         * Returns a boolean indicating whether the specified file exists on the target server.
         * The filename for scripts is case-sensitive, but for other types of files it is not.
         * For example, fileExists(“brutessh.exe”) will work fine, even though the actual program
         * is named 'BruteSSH.exe'.
         *
         * If the hostname/ip argument is omitted, then the function will search through the current
         * server (the server running the script that calls this function) for the file.
         *
         * @example
         * ```js
         * //The function call will return true if the script named foo.script exists on the foodnstuff server, and false otherwise.
         * fileExists("foo.script", "foodnstuff");
         * ```
         * @example
         * ```js
         * //The function call will return true if the current server contains the FTPCrack.exe program, and false otherwise.
         * fileExists("ftpcrack.exe");
         * ```
         * @ramCost 0.1 GB
         * @param {string} filename Filename of file to check.
         * @param {(string|number)} [host] Host or IP of target server. This is optional. If it is not specified then the function will use the current server as the target server.
         * @returns {boolean} True if specified file exists, and false otherwise.
         */
        fileExists (filename: string, host?: Host): boolean;

        /**
         * Returns a boolean indicating whether the specified script is running on the target server.
         * Remember that a script is uniquely identified by both its name and its arguments.
         *
         * @example
         * ```js
         * //The function call will return true if there is a script named foo.script with no arguments running on the foodnstuff server, and false otherwise:
         * isRunning("foo.script", "foodnstuff");
         * ```
         * @example
         * ```js
         * //The function call will return true if there is a script named foo.script with no arguments running on the current server, and false otherwise:
         * isRunning("foo.script", getHostname());
         * ```
         * @example
         * ```js
         * //The function call will return true if there is a script named foo.script running with the arguments 1, 5, and “test” (in that order) on the joesguns server, and false otherwise:
         * isRunning("foo.script", "joesguns", 1, 5, "test");
         * ```
         * @ramCost 0.1 GB
         * @param {string} script Filename of script to check. This is case-sensitive.
         * @param {string} host Host or IP of target server.
         * @param {...string} [args] Arguments to specify/identify which scripts to search for.
         * @returns {boolean} True if specified script is running on the target server, and false otherwise.
         */
        isRunning (script: Script, host: Host, ...args: string[]): boolean;

        /**
         * Returns the cost to purchase a server with the specified amount of ram.
         *
         * @example
         * ```js
         * for (i = 1; i <= 20; i++) {
         *     tprint(i + " -- " + getPurchasedServerCost(Math.pow(2, i)));
         * }
         * ```
         * @ramCost 0.25 GB
         * @param {number} ram Amount of RAM of a potential purchased server. Must be a power of 2 (2, 4, 8, 16, etc.). Maximum value of 1048576 (2^20).
         * @returns {number} The cost to purchase a server with the specified amount of ram.
         */
        getPurchasedServerCost (ram: number): number;

        /**
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
         * ```js
         * ram = 64;
         * hn = "pserv-";
         * for (i = 0; i < 5; ++i) {
         *    purchaseServer(hn + i, ram);
         * }
         * ```
         * @ramCost 2.25 GB
         * @param {string} hostname Host of the purchased server.
         * @param {number} ram Amount of RAM of the purchased server. Must be a power of 2 (2, 4, 8, 16, etc.). Maximum value of 1048576 (2^20).
         * @returns {string} The hostname of the newly purchased server.
         */
        purchaseServer (hostname: Host, ram: number): Host | "";

        /**
         * Deletes one of your purchased servers, which is specified by its hostname.
         *
         * The hostname argument can be any data type, but it will be converted to a string.
         * Whitespace is automatically removed from the string. This function will not delete a
         * server that still has scripts running on it.
         *
         * @ramCost 2.25 GB
         * @param {string} host Host of the server to delete.
         * @returns {boolean} True if successful, and false otherwise.
         */
        deleteServer (host: Host): boolean;

        /**
         * Returns an array with either the hostnames or IPs of all of the servers you have purchased.
         *
         * @ramCost 2.25 GB
         * @param {boolean} hostname Specifies whether hostnames or IP addresses should be returned. If it’s true then hostnames will be returned, and if false then IPs will be returned. If this argument is omitted then it is true by default.
         * @returns {string[]} Returns an array with either the hostnames or IPs of all of the servers you have purchased.
         */
        getPurchasedServers (hostname?: boolean): Host[];

        /**
         * Returns the maximum number of servers you can purchase.
         *
         * @ramCost 0.05 GB
         * @returns {number} Returns the maximum number of servers you can purchase.
         */
        getPurchasedServerLimit (): number;

        /**
         * Returns the maximum RAM that a purchased server can have.
         *
         * @ramCost 0.05 GB
         * @returns {number} Returns the maximum RAM that a purchased server can have.
         */
        getPurchasedServerMaxRam (): number;

        /**
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
         * @ramCost 1 GB
         * @param {(string|number)} handle Port or text file that will be written to.
         * @param {string} data Data to write.
         * @param {string} mode Defines the write mode. Only valid when writing to text files.
         */
        write (handle: Handle, data?: string | string[] | number, mode?: "w" | "a"): void;

        /**
         * Attempts to write data to the specified Netscript Port.
         * If the port is full, the data will not be written.
         * Otherwise, the data will be written normally.
         *
         * @ramCost 1 GB
         * @param {number} port Port or text file that will be written to.
         * @param {string} data Data to write.
         * @returns {boolean} True if the data is successfully written to the port, and false otherwise.
         */
        tryWrite (port: Handle, data: string | string[] | number): boolean;

        /**
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
         * @ramCost 1 GB
         * @param {(string|number)} handle Port or text file to read from.
         * @returns {(string|number|object)} Data in the specified text file or port.
         */
        read (handle: Handle): string | number | object;

        /**
         * This function is used to peek at the data from a port. It returns the
         * first element in the specified port without removing that element. If
         * the port is empty, the string “NULL PORT DATA” will be returned.
         *
         * @ramCost 1 GB
         * @param {number} port Port to peek. Must be an integer between 1 and 20.
         * @returns {(string|number|object)} Data in the specified port.
         */
        peek (port: Port): string | number | object;

        /**
         * This function is used to clear data in a Netscript Ports or a text file.
         *
         * If the port/fn argument is a number between 1 and 20, then it specifies a
         * port and will clear it (deleting all data from the underlying queue).
         *
         * If the port/fn argument is a string, then it specifies the name of a
         * text file (.txt) and will delete all data from that text file.
         *
         * @ramCost 1 GB
         * @param {(string|number)} handle Port or text file to clear.
         */
        clear (handle: Handle): void;

        /**
         * Get a handle to a Netscript Port.
         *
         * WARNING: Port Handles only work in NetscriptJS (Netscript 2.0). They will not work in Netscript 1.0.
         *
         * @see https://bitburner.readthedocs.io/en/latest/netscript/netscriptmisc.html#netscript-ports
         * @ramCost 10 GB
         * @param {number} port Port number. Must be an integer between 1 and 20.
         * @returns {Array} Data in the specified port.
         */
        getPortHandle (port: Port): any[];

        /**
         * Removes the specified file from the current server. This function works for every file
         * type except message (.msg) files.
         *
         * @ramCost 1 GB
         * @param {string} name Filename of file to remove. Must include the extension.
         * @param {string} [host] Host or IP Address of the server on which to delete the file. Optional. Defaults to current server.
         * @returns {boolean} True if it successfully deletes the file, and false otherwise.
         */
        rm (name: string, host?: Host): boolean;

        /**
         * Returns a boolean indicating whether any instance of the specified script is running
         * on the target server, regardless of its arguments.
         *
         * This is different than the {@link isRunning} function because it does not try to
         * identify a specific instance of a running script by its arguments.
         *
         * @example
         * ```js
         * //The function call will return true if there is any script named foo.script running on the foodnstuff server, and false otherwise:
         * scriptRunning("foo.script", "foodnstuff");
         * ```
         * @example
         * ```js
         * //The function call will return true if there is any script named “foo.script” running on the current server, and false otherwise:
         * scriptRunning("foo.script", getHostname());
         * ```
         * @ramCost 1 GB
         * @param {string} script Filename of script to check. This is case-sensitive.
         * @param {string} host Host or IP of target server.
         * @returns {boolean} True if the specified script is running, and false otherwise.
         */
        scriptRunning (script: Script, host: Host): boolean;

        /**
         * Kills all scripts with the specified filename on the target server specified by hostname/ip,
         * regardless of arguments.
         *
         * @ramCost 1 GB
         * @param {string} script Filename of script to kill. This is case-sensitive.
         * @param {string} host Host or IP of target server.
         * @returns {boolean} true if one or more scripts were successfully killed, and false if none were.
         */
        scriptKill (script: Script, host: Host): boolean;

        /**
         * Returns the current script name.
         *
         * @ramCost 0 GB
         * @returns {string} Current script name.
         */
        getScriptName (): string;

        /**
         * Returns the amount of RAM required to run the specified script on the target server.
         * Returns 0 if the script does not exist.
         *
         * @ramCost 0.1 GB
         * @param {string} script Filename of script. This is case-sensitive.
         * @param {string} [host] Host or IP of target server the script is located on. This is optional, If it is not specified then the function will se the current server as the target server.
         * @returns {string} Amount of RAM required to run the specified script on the target server, and 0 if the script does not exist.
         */
        getScriptRam (script: Script, host?: Host): number;

        /**
         * Returns the amount of time in seconds it takes to execute the {@link hack} Netscript function on the target server.
         * The function takes in an optional hackLvl parameter that can be specified to see what the hack time would be at different hacking levels.
         *
         * @ramCost 0.05 GB
         * @param {string} host Host or IP of target server.
         * @param {number} [hackLvl] Optional hacking level for the calculation. Defaults to player’s current hacking level.
         * @param {number} [intLvl] Optional intelligence level for the calculation. Defaults to player’s current intelligence level. (Intelligence is unlocked after obtaining Source-File 5).
         * @returns {number} Returns the amount of time in seconds it takes to execute the {@link hack} Netscript function. Returns Infinity if called on a Hacknet Server.
         */
        getHackTime (host: Host, hackLvl?: number, intLvl?: number): number;

        /**
         * Returns the amount of time in seconds it takes to execute the {@link grow} Netscript function on the target server.
         * The function takes in an optional hackLvl parameter that can be specified to see what the grow time would be at different hacking levels.
         *
         * @ramCost 0.05 GB
         * @param {string} host Host or IP of target server.
         * @param {number} [hackLvl] Optional hacking level for the calculation. Defaults to player’s current hacking level.
         * @param {number} [intLvl] Optional intelligence level for the calculation. Defaults to player’s current intelligence level. (Intelligence is unlocked after obtaining Source-File 5).
         * @returns {number} Returns the amount of time in seconds it takes to execute the {@link grow} Netscript function. Returns Infinity if called on a Hacknet Server.
         */
        getGrowTime (host: Host, hackLvl?: number, intLvl?: number): number;

        /**
         * Returns the amount of time in seconds it takes to execute the weaken() Netscript function on the target server.
         * The function takes in an optional hackLvl parameter that can be specified to see what the weaken time would be at different hacking levels.
         *
         * @ramCost 0.05 GB
         * @param {string} host Host or IP of target server.
         * @param {number} [hackLvl] Optional hacking level for the calculation. Defaults to player’s current hacking level.
         * @param {number} [intLvl] Optional intelligence level for the calculation. Defaults to player’s current intelligence level. (Intelligence is unlocked after obtaining Source-File 5).
         * @returns {number} Returns the amount of time in seconds it takes to execute the {@link grow} Netscript function. Returns Infinity if called on a Hacknet Server.
         */
        getWeakenTime (host: Host, hackLvl?: number, intLvl?: number): number;

        /**
         * Returns the amount of income the specified script generates while online
         * (when the game is open, does not apply for offline income). Remember that
         * a script is uniquely identified by both its name and its arguments. So for
         * example if you ran a script with the arguments “foodnstuff” and “5” then
         * in order to use this function to get that script’s income you must specify
         * those same arguments in the same order in this function call.
         *
         * This function can also be called with no arguments.
         * If called with no arguments, then this function will return an array of two values.
         * The first value is the total income ($ / second) of all of your active scripts
         * (scripts that are currently running on any server).
         * The second value is the total income ($ / second) that you’ve earned from scripts
         * since you last installed Augmentations.
         *
         * @ramCost 0.1 GB
         * @param {string} script Filename of script.
         * @param {string} host Server on which script is running.
         * @param {string} [args] Arguments that the script is running with.
         * @returns {(number|[number,number])} Amount of income the specified script generates while online.
         */
        getScriptIncome (script: Script, host: Host, ...args: string[]): number | [number, number];

        /**
         * Returns the amount of hacking experience the specified script generates while online
         * (when the game is open, does not apply for offline experience gains). Remember that a
         * script is uniquely identified by both its name and its arguments.
         *
         * This function can also return the total experience gain rate of all of your active
         * scripts by running the function with no arguments.
         *
         * @ramCost 0.1 GB
         * @param {string} script Filename of script.
         * @param {string} host Server on which script is running.
         * @param {...string[]} [args] Arguments that the script is running with.
         * @returns {number} Amount of hacking experience the specified script generates while online.
         */
        getScriptExpGain (script: Script, host: Host, ...args: string[]): number;

        /**
         * Returns the amount of time in milliseconds that have passed since you last installed Augmentations.
         *
         * @ramCost 0.05 GB
         * @returns {number} Time in milliseconds that have passed since you last installed Augmentations.
         */
        getTimeSinceLastAug (): number;

        /**
         * Complete open source JavaScript sprintf implementation
         *
         * @see https://github.com/alexei/sprintf.js
         * @ramCost 0 GB
         * @param {string} format String to format.
         * @param {...string} args Formating arguments.
         * @returns {string} Formated text.
         */
        sprintf (format: string, ...args: string[]): string;

        /**
         * Complete open source JavaScript sprintf implementation
         *
         * @see https://github.com/alexei/sprintf.js
         * @ramCost 0 GB
         * @param {string} format String to format.
         * @param {string[]} args Formating arguments.
         * @returns {string} Formated text.
         */
        vsprintf (format: string, args: string[]): string;

        /**
         * Converts a number into a string with the specified formatter.
         * This uses the numeraljs library, so the formatters must be compatible with that.
         * This is the same function that the game itself uses to display numbers.
         *
         * @see http://numeraljs.com/
         * @ramCost 0 GB
         * @param {number} n Number to format.
         * @param {string} format Formatter.
         * @returns {string} Formated number.
         */
        nFormat (n: number, format: string): number;

        /**
         * Prompts the player with a dialog box with two options: “Yes” and “No”.
         * This function will return true if the player click “Yes” and false if
         * the player clicks “No”. The script’s execution is halted until the player
         * selects one of the options.
         *
         * @ramCost 0 GB
         * @param {string} txt Text to appear in the prompt dialog box.
         * @returns {Promise<boolean>} True if the player click “Yes” and false if the player clicks “No”.
         */
        prompt (txt: string): Promise<boolean>;

        /**
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
         * ```js
         * wget("https://raw.githubusercontent.com/danielyxie/bitburner/master/README.md", "game_readme.txt");
         * ```
         * @ramCost 0 GB
         * @param {string} url URL to pull data from.
         * @param {string} target Filename to write data to. Must be script or text file.
         * @param {string} [host] Optional hostname/ip of server for target file.
         * @returns {Promise<boolean>} True if the data was successfully retrieved from the URL, false otherwise.
         */
        wget (url: string, target: string, host?: string): Promise<boolean>;

        /**
         * Returns the amount of Faction favor required to be able to donate to a faction.
         *
         * @ramCost 0.1 GB
         * @returns {number} Amount of Faction favor required to be able to donate to a faction.
         */
        getFavorToDonate (): number;

        /**
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
         * ```js
         * mults = getBitNodeMultipliers();
         * print(mults.ServerMaxMoney);
         * print(mults.HackExpGain);
         * ```
         * @ramCost 4 GB
         * @returns {object} Object containing the current BitNode multipliers.
         */
        getBitNodeMultipliers (url: string, target: string, host: string): BitNodeMultipliers;
    }
}
