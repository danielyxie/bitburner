let CONSTANTS = {
    Version:                "0.40.5",

	//Max level for any skill, assuming no multipliers. Determined by max numerical value in javascript for experience
    //and the skill level formula in Player.js. Note that all this means it that when experience hits MAX_INT, then
    //the player will have this level assuming no multipliers. Multipliers can cause skills to go above this.
	MaxSkillLevel: 			975,

    //Milliseconds per game cycle
    MilliPerCycle: 200,

    //How much reputation is needed to join a megacorporation's faction
    CorpFactionRepRequirement: 200e3,

    /* Base costs */
    BaseCostFor1GBOfRamHome: 32000,
    BaseCostFor1GBOfRamServer: 55000, //1 GB of RAM
    BaseCostFor1GBOfRamHacknetNode: 30000,

    TravelCost: 200000,

    BaseCostForHacknetNode: 1000,
    BaseCostForHacknetNodeCore: 500000,

    /* Hacknet Node constants */
    HacknetNodeMoneyGainPerLevel: 1.6,
    HacknetNodePurchaseNextMult: 1.85,   //Multiplier when purchasing an additional hacknet node
    HacknetNodeUpgradeLevelMult: 1.04,  //Multiplier for cost when upgrading level
    HacknetNodeUpgradeRamMult: 1.28,     //Multiplier for cost when upgrading RAM
    HacknetNodeUpgradeCoreMult: 1.48,    //Multiplier for cost when buying another core

    HacknetNodeMaxLevel: 200,
    HacknetNodeMaxRam: 64,
    HacknetNodeMaxCores: 16,

    /* Faction and Company favor */
    BaseFavorToDonate:            150,
    DonateMoneyToRepDivisor:      1e6,
    FactionReputationToFavorBase: 500,
    FactionReputationToFavorMult: 1.02,
    CompanyReputationToFavorBase: 500,
    CompanyReputationToFavorMult: 1.02,

    /* Augmentation */
    //NeuroFlux Governor cost multiplier as you level up
    NeuroFluxGovernorLevelMult: 1.14,

    /* Netscript Constants */
    //RAM Costs for different commands
    ScriptBaseRamCost:              1.6,
    ScriptDomRamCost:               100,
    ScriptWhileRamCost:             0,
    ScriptForRamCost:               0,
    ScriptIfRamCost:                0,
    ScriptHackRamCost:              0.1,
    ScriptGrowRamCost:              0.15,
    ScriptWeakenRamCost:            0.15,
    ScriptScanRamCost:              0.2,
    ScriptPortProgramRamCost:       0.05,
    ScriptRunRamCost:               1.0,
    ScriptExecRamCost:              1.3,
    ScriptSpawnRamCost:             2.0,
    ScriptScpRamCost:               0.6,
    ScriptKillRamCost:              0.5, //Kill and killall
    ScriptHasRootAccessRamCost:     0.05,
    ScriptGetHostnameRamCost:       0.05, //getHostname() and getIp()
    ScriptGetHackingLevelRamCost:   0.05, //getHackingLevel()
    ScriptGetMultipliersRamCost:    4.0, //getHackingMultipliers() and getBitNodeMultipliers()
    ScriptGetServerRamCost:         0.1,
    ScriptFileExistsRamCost:        0.1,
    ScriptIsRunningRamCost:         0.1,
    ScriptHacknetNodesRamCost:      4.0, //Base cost for accessing Hacknet Node API
    ScriptHNUpgLevelRamCost:        0.4,
    ScriptHNUpgRamRamCost:          0.6,
    ScriptHNUpgCoreRamCost:         0.8,
    ScriptGetStockRamCost:          2.0,
    ScriptBuySellStockRamCost:      2.5,
    ScriptGetPurchaseServerRamCost: 0.25,
    ScriptPurchaseServerRamCost:    2.25,
    ScriptGetPurchasedServerLimit:  0.05,
    ScriptGetPurchasedServerMaxRam: 0.05,
    ScriptRoundRamCost:             0.05,
    ScriptReadWriteRamCost:         1.0,
    ScriptArbScriptRamCost:         1.0, //Functions that apply to all scripts regardless of args
    ScriptGetScriptRamCost:         0.1,
    ScriptGetHackTimeRamCost:       0.05,
    ScriptGetFavorToDonate:         0.10,
    ScriptCodingContractBaseRamCost:10,

    ScriptSingularityFn1RamCost:    1,
    ScriptSingularityFn2RamCost:    2,
    ScriptSingularityFn3RamCost:    3,

    ScriptBladeburnerApiBaseRamCost:    4,

    NumNetscriptPorts:              20,

    //Server constants
    ServerBaseGrowthRate: 1.03,     //Unadjusted Growth rate
    ServerMaxGrowthRate: 1.0035,    //Maximum possible growth rate (max rate accounting for server security)
    ServerFortifyAmount: 0.002,     //Amount by which server's security increases when its hacked/grown
    ServerWeakenAmount: 0.05,       //Amount by which server's security decreases when weakened

    PurchasedServerLimit: 25,
    PurchasedServerMaxRam: 1048576, //2^20

    //Augmentation Constants
    AugmentationCostMultiplier: 5,  //Used for balancing costs without having to readjust every Augmentation cost
    AugmentationRepMultiplier:  2.5, //Used for balancing rep cost without having to readjust every value
    MultipleAugMultiplier:      1.9,

    //How much a TOR router costs
    TorRouterCost: 200000,

    //Infiltration constants
    InfiltrationBribeBaseAmount: 100e3,    //Amount per clearance level
    InfiltrationMoneyValue:   5e3,         //Convert "secret" value to money
    InfiltrationRepValue: 1.4,             //Convert "secret" value to faction reputation

    //Stock market constants
    WSEAccountCost:         200e6,
    TIXAPICost:             5e9,
    MarketData4SCost:       1e9,
    MarketDataTixApi4SCost: 20e9,
    StockMarketCommission:  100e3,

    //Hospital/Health
    HospitalCostPerHp: 100e3,

    //Intelligence-related constants
    IntelligenceCrimeWeight: 0.05,  //Weight for how much int affects crime success rates
    IntelligenceInfiltrationWeight: 0.1, //Weight for how much int affects infiltration success rates
    IntelligenceCrimeBaseExpGain: 0.001,
    IntelligenceProgramBaseExpGain: 500, //Program required hack level divided by this to determine int exp gain
    IntelligenceTerminalHackBaseExpGain: 200, //Hacking exp divided by this to determine int exp gain
    IntelligenceSingFnBaseExpGain: 0.002,
    IntelligenceClassBaseExpGain: 0.000001,
    IntelligenceHackingMissionBaseExpGain: 0.03, //Hacking Mission difficulty multiplied by this to get exp gain

    //Hacking Missions
    HackingMissionRepToDiffConversion: 10000, //Faction rep is divided by this to get mission difficulty
    HackingMissionRepToRewardConversion: 7, //Faction rep divided byt his to get mission rep reward
    HackingMissionSpamTimeIncrease: 25000, //How much time limit increase is gained when conquering a Spam Node (ms)
    HackingMissionTransferAttackIncrease: 1.05, //Multiplier by which the attack for all Core Nodes is increased when conquering a Transfer Node
    HackingMissionMiscDefenseIncrease: 1.05, //The amount by which every misc node's defense is multiplied when one is conquered
    HackingMissionDifficultyToHacking: 135, //Difficulty is multiplied by this to determine enemy's "hacking" level (to determine effects of scan/attack, etc)
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

    /* Time Constants */
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

    /* Player Work / Action related Constants */
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

    CrimeSingFnDivider: 2, //Factor by which exp/profit is reduced when commiting crime through Sing Fn
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

    /* Coding Contract Constants */
    CodingContractBaseFactionRepGain:   2500,
    CodingContractBaseCompanyRepGain:   4000,
    CodingContractBaseMoneyGain:        50e6,

    /* Tutorial related things */
    TutorialNetworkingText: "Servers are a central part of the game. You start with a single personal server (your home computer) " +
                            "and you can purchase additional servers as you progress through the game. Connecting to other servers " +
                            "and hacking them can be a major source of income and experience. Servers can also be used to run " +
                            "scripts which can automatically hack servers for you. <br><br>" +
                            "In order to navigate between machines, use the 'scan' or 'scan-analyze' Terminal command to see all servers " +
                            "that are reachable from your current server. Then, you can use the 'connect [hostname/ip]' " +
                            "command to connect to one of the available machines. <br><br>" +
                            "The 'hostname' and 'ifconfig' commands can be used to display the hostname/IP of the " +
                            "server you are currently connected to.",

    TutorialHackingText: "In the year 2077, currency has become digital and decentralized. People and corporations " +
                         "store their money on servers. By hacking these servers, you can steal their money and gain " +
                         "experience. <br><br>" +
                         "<h1>Gaining root access</h1> <br>" +
                         "The key to hacking a server is to gain root access to that server. This can be done using " +
                         "the NUKE virus (NUKE.exe). You start the game with a copy of the NUKE virus on your home " +
                         "computer. The NUKE virus attacks the target server's open ports using buffer overflow " +
                         "exploits. When successful, you are granted root administrative access to the machine. <br><br>" +
                         "Typically, in order for the NUKE virus to succeed, the target server needs to have at least " +
                         "one of its ports opened. Some servers have no security and will not need any ports opened. Some " +
                         "will have very high security and will need many ports opened. In order to open ports on another " +
                         "server, you will need to run programs that attack the server to open specific ports. These programs " +
                         "can be coded once your hacking skill gets high enough, or they can be purchased if you can find " +
                         "a seller. <br><br>" +
                         "In order to determine how many ports need to be opened to successfully NUKE a server, connect to " +
                         "that server and run the 'analyze' command. This will also show you which ports have already been " +
                         "opened. <br><br>" +
                         "Once you have enough ports opened and have ran the NUKE virus to gain root access, the server " +
                         "can then be hacked by simply calling the 'hack' command through terminal, or by using a script.<br><br>" +
                         "<h1>Hacking mechanics</h1><br>" +
                         "When you execute the hack command, either manually through the terminal or automatically through " +
                         "a script, you attempt to hack the server. This action takes time. The more advanced a server's " +
                         "security is, the more time it will take. Your hacking skill level also affects the hacking time, " +
                         "with a higher hacking skill leading to shorter hacking times. Also, running the hack command " +
                         "manually through terminal is faster than hacking from a script. <br><br>" +
                         "Your attempt to hack a server will not always succeed. The chance you have to successfully hack a " +
                         "server is also determined by the server's security and your hacking skill level. Even if your " +
                         "hacking attempt is unsuccessful, you will still gain experience points. <br><br>" +
                         "When you successfully hack a server. You steal a certain percentage of that server's total money. This " +
                         "percentage is determined by the server's security and your hacking skill level. The amount of money " +
                         "on a server is not limitless. So, if you constantly hack a server and deplete its money, then you will " +
                         "encounter diminishing returns in your hacking (since you are only hacking a certain percentage). You can " +
                         "increase the amount of money on a server using a script and the grow() function in Netscript.<br><br>" +
                         "<h1>Server Security</h1><br>" +
                         "Each server has a security level, typically between 1 and 100. A higher number means the server has stronger security. " +
                         "It is possible for a server to have a security level of 100 or higher, in which case hacking that server "  +
                         "will become impossible (0% chance to hack).<br><br>" +
                         "As mentioned above, a server's security level is an important factor " +
                         "to consider when hacking. You can check a server's security level using the 'analyze' command, although this " +
                         "only gives an estimate (with 5% uncertainty). You can also check a server's security in a script, using the " +
                         "<i>getServerSecurityLevel(server)</i> function in Netscript. See the Netscript documentation for more details. " +
                         "This function will give you an exact value for a server's security. <br><br>" +
                         "Whenever a server is hacked manually or through a script, its security level increases by a small amount. Calling " +
                         "the grow() command in a script will also increase security level of the target server.  These actions will " +
                         "make it harder for you to hack the server, and decrease the amount of money you can steal. You can lower a " +
                         "server's security level in a script using the <i>weaken(server)</i> function in Netscript. See the Netscript " +
                         "documentation for more details.<br><br>" +
                         "A server has a minimum security level that is equal to one third of its starting security, rounded to the " +
                         "nearest integer. To be more precise:<br><br>" +
                         "server.minSecurityLevel = Math.max(1, Math.round(server.startingSecurityLevel / 3))<br><br>" +
                         "This means that a server's security will not fall below this value if you are trying to weaken it.",

    TutorialScriptsText: "Scripts can be used to automate the hacking process. Scripts must be written in the Netscript language. " +
                         "Documentation about the Netscript language can be found in the 'Netscript Programming Language' " +
                         "section of this 'Tutorial' page. <br><br> " +
                         "<strong>It is highly recommended that you have a basic background in programming to start writing scripts. " +
                         "You by no means need to be an expert. All you need is some familiarity with basic programming " +
                         "constructs like for/while loops, if statements, " +
                         "functions, variables, etc. The Netscript programming language most resembles the Javascript language. " +
                         "Therefore, a good beginner's programming tutorial to read might be <a href='https://www.w3schools.com/js/default.asp' target='_blank'>" +
                         "this one</a>. Note that while the Netscript language is similar to Javascript, it is not the exact same, so the " +
                         "syntax will vary a little bit. </strong> <br><br>" +
                         "Running a script requires RAM. The more complex a script is, the more RAM " +
                         "it requires to run. Scripts can be run on any server you have root access to. <br><br>" +
                         "Here are some Terminal commands that are useful when working with scripts: <br><br>" +
                         "<i>check [script] [args...]</i><br>Prints the logs of the script specified by the name and arguments to Terminal. Arguments should be separated " +
                         "by a space. Note that scripts are uniquely " +
                         "identified by their arguments as well as their name. For example, if you ran a script 'foo.script' with the argument 'foodnstuff' then in order to 'check' it you must " +
                         "also add the 'foodnstuff' argument to the check command as so: <br>check foo.script foodnstuff<br><br>" +
                         "<i>free</i><br>Shows the current server's RAM usage and availability <br><br>" +
                         "<i>kill [script] [args...]</i><br>Stops a script that is running with the specified script name and arguments. " +
                         "Arguments should be separated by a space. Note that " +
                         "scripts are uniquely identified by their arguments as well as their name. For example, if you ran a script 'foo.script' with the " +
                         "argument 1 and 2, then just typing 'kill foo.script' will not work. You have to use 'kill foo.script 1 2'. <br><br>" +
                         "<i>mem [script] [-t] [n]</i><br>Check how much RAM a script requires to run with n threads<br><br>" +
                         "<i>nano [script]</i><br>Create/Edit a script. The name of the script must end with the '.script' extension <br><br>" +
                         "<i>ps</i><br>Displays all scripts that are actively running on the current server<br><br>" +
                         "<i>rm [script]</i><br>Delete a script<br><br>" +
                         "<i>run [script] [-t] [n] [args...]</i><br>Run a script with n threads and the specified arguments. Each argument should be separated by a space. " +
                         "Both the arguments and thread specification are optional. If neither are specified, then the script will be run single-threaded with no arguments.<br>" +
                         "Examples:<br>run foo.script<br>The command above will run 'foo.script' single-threaded with no arguments." +
                         "<br>run foo.script -t 10<br>The command above will run 'foo.script' with 10 threads and no arguments." +
                         "<br>run foo.script foodnstuff sigma-cosmetics 10<br>The command above will run 'foo.script' single-threaded with three arguments: [foodnstuff, sigma-cosmetics, 10]" +
                         "<br>run foo.script -t 50 foodnstuff<br>The command above will run 'foo.script' with 50 threads and a single argument: [foodnstuff]<br><br>" +
                         "<i>tail [script] [args...]</i><br>Displays the logs of the script specified by the name and arguments. Note that scripts are uniquely " +
                         "identified by their arguments as well as their name. For example, if you ran a script 'foo.script' with the argument 'foodnstuff' then in order to 'tail' it you must " +
                         "also add the 'foodnstuff' argument to the tail command as so: <br>tail foo.script foodnstuff<br><br>" +
                         "<i>top</i><br>Displays all active scripts and their RAM usage <br><br>" +
                         "<u><h1> Multithreading scripts </h1></u><br>" +
                         "Scripts can be multithreaded. A multithreaded script runs the script's code once in each thread. The result is that " +
                         "every call to the hack(), grow(), and weaken() Netscript functions will have its effect multiplied by the number of threads. " +
                         "For example, if a normal single-threaded script is able to hack $10,000, then running the same script with 5 threads would " +
                         "yield $50,000. <br><br> " +
                         "When multithreading a script, the total RAM cost can be calculated by simply multiplying the base RAM cost of the script " +
                         "with the number of threads, where the base cost refers to the amount of RAM required to run the script single-threaded. " +
                         "In the terminal, you can run the " +
                         "'mem [scriptname] -t n' command to see how much RAM a script requires with n threads. <br><br>" +
                         "Every method for running a script has an option for making it multihreaded. To run a script with " +
                         "n threads from a Terminal: <br>" +
                         "run [scriptname] -t n<br><br>" +
                         "Using Netscript commands: <br>" +
                         "run('scriptname.script', n);<br> " +
                         "exec('scriptname.script, 'targetServer', n);<br><br>" +
                         "<u><h1> Notes about how scripts work offline </h1> </u><br>" +
                         "<strong> The scripts that you write and execute are interpreted in Javascript. For this " +
                         "reason, it is not possible for these scripts to run while offline (when the game is closed). " +
                         "It is important to note that for this reason, conditionals such as if/else statements and certain " +
                         "commands such as purchaseHacknetNode() or nuke() will not work while the game is offline.<br><br>" +
                         "However, Scripts WILL continue to generate money and hacking exp for you while the game is offline. This " +
                         "offline production is based off of the scripts' production while the game is online. <br><br>" +
                         "grow() and weaken() are two Netscript commands that will also be applied when the game is offline, although at a slower rate " +
                         "compared to if the game was open. This is done by having each script keep track of the  " +
                         "rate at which the grow() and weaken() commands are called when the game is online. These calculated rates are used to determine how many times " +
                         "these function calls would be made while the game is offline. <br><br> " +
                         "Also, note that because of the way the Netscript interpreter is implemented, " +
                         "whenever you reload or re-open the game all of the scripts that you are running will " +
                         "start running from the BEGINNING of the code. The game does not keep track of where exactly " +
                         "the execution of a script is when it saves/loads. </strong><br><br>",
    TutorialNetscriptText: "Netscript is a programming language implemented for this game. There are two versions of Netscript: " +
                           "Netscript 1.0 and Netscript 2.0 (NetscriptJS).<br><br>" +
                           "<a href='https://bitburner.readthedocs.io/en/latest/index.html' target='_blank'>Click here for Bitburner's official Netscript documentation</a>",
    TutorialTravelingText:"There are six major cities in the world that you are able to travel to: <br><br> "  +
                           "    Aevum<br>" +
                           "    Chongqing<br>" +
                           "    Sector-12<br>" +
                           "    New Tokyo<br>" +
                           "    Ishima<br>" +
                           "    Volhaven<br><br>" +
                           "To travel between cities, visit your current city's travel agency through the 'World' page. " +
                           "From the travel agency you can travel to any other city. Doing so costs money. <br><br>" +
                           "Each city has its own set of companies and unique locations. Also, certain content is only available to you " +
                           "if you are in certain cities, so get exploring!",
    TutorialCompaniesText: "Hacking is not the only way to gain money and experience! Located around the world are many " +
                           "different companies which you can work for. By working for a company you can earn money, " +
                           "train your various labor skills, and unlock powerful passive perks. <br><br> " +
                           "To apply for a job, visit the company you want to work for through the 'World' menu. The company " +
                           "page will have options that let you apply to positions in the company. There might be several different " +
                           "positions you can apply for, ranging from software engineer to business analyst to security officer. <br><br> " +
                           "When you apply for a job, you will get the offer if your stats are high enough. Your first position at " +
                           "a company will be an entry-level position such as 'intern'. Once you get the job, an button will appear on " +
                           "the company page that allows you to work for the company. Click this button to start working. <br><br>" +
                           "Working occurs in 8 hour shifts. Once you start working, you will begin earning money, experience, " +
                           "and reputation. The rate at which you money and experience depends on the company and your position. " +
                           "The amount of reputation you gain for your company is based on your job performance, which is affected by " +
                           "your stats. Different positions value different stats. When you are working, you are unable to perform any " +
                           "other actions such as using your terminal or visiting other locations (However, note that any scripts you have " +
                           "running on servers will continue to run as you work!). It is possible to cancel your work shift before the " +
                           "8 hours is up. However, if you have a full-time job, then cancelling a shift early will result in you gaining " +
                           "only half of the reputation " +
                           "that you had earned up to that point. There are also part-time/consultant jobs available where you will not " +
                           " be penalized if you cancel a work shift early. However, these positions pay less than full-time positions.<br><br>" +
                           "As you continue to work at a company, you will gain more and more reputation at that company. When your stats " +
                           "and reputation are high enough, you can get a promotion. You can apply for a promotion on the company page, just like " +
                           "you applied for the job originally. Higher positions at a company provide better salaries and stat gains.<br><br>" +
                           "<h1>Infiltrating Companies</h1><br>" +
                           "Many companies have facilities that you can attempt to infiltrate. By infiltrating, you can steal classified company secrets " +
                           "and then sell these for money or for faction reputation. To try and infiltrate a company, visit a company through the " +
                           "'World' menu. There will be an option that says 'Infiltrate Company'. <br><br>" +
                           "When infiltrating a company, you must progress through clearance levels in the facility. Every clearance level " +
                           "has some form of security that you must get past. There are several forms of security, ranging from high-tech security systems to " +
                           "armed guards. For each form of security, there are a variety of options that you can choose to try and bypass the security. Examples " +
                           "include hacking the security, engaging in combat, assassination, or sneaking past the security. The chance to succeed for each option " +
                           "is determined in part by your stats. So, for example, trying to hack the security system relies on your hacking skill, whereas trying to " +
                           "sneak past the security relies on your agility level.<br><br>" +
                           "The facility has a 'security level' that affects your chance of success when trying to get past a clearance level. " +
                           "Every time you advance to the next clearance level, the facility's security level will increase by a fixed amount. Furthermore " +
                           "the options you choose and whether you succeed or fail will affect the security level as well. For example, " +
                           "if you try to kill a security guard and fail, the security level will increase by a lot. If you choose to sneak past " +
                           "security and succeed, the security level will not increase at all. <br><br>" +
                           "Every 5 clearance levels, you will steal classified company secrets that can be sold for money or faction reputation. However, " +
                           "in order to sell these secrets you must successfully escape the facility using the 'Escape' option. Furthermore, companies have "  +
                           "a max clearance level. If you reach the max clearance level you will automatically escape the facility with all of your " +
                           "stolen secrets.<br><br>",
    TutorialFactionsText: "Throughout the game you may receive invitations from factions. There are many different factions, and each faction " +
                          "has different criteria for determining its potential members. Joining a faction and furthering its cause is crucial " +
                          "to progressing in the game and unlocking endgame content. <br><br> " +
                          "It is possible to join multiple factions if you receive invitations from them. However, note that joining a faction " +
                          "may prevent you from joining other rival factions. <br><br> " +
                          "The 'Factions' link on the menu brings up a list of all factions that you have joined. " +
                          "You can select a Faction on this list to go to that Faction page. This page displays general " +
                          "information about the Faction and also lets you perform work for the faction. " +
                          "Working for a Faction is similar to working for a company except that you don't get paid a salary. " +
                          "You will only earn reputation in your Faction and train your stats. Also, cancelling work early " +
                          "when working for a Faction does NOT result in reduced experience/reputation earnings. <br><br>" +
                          "Earning reputation for a Faction unlocks powerful Augmentations. Purchasing and installing these Augmentations will " +
                          "upgrade your abilities. The Augmentations that are available to unlock vary from faction to faction.",
    TutorialAugmentationsText: "Advances in science and medicine have lead to powerful new technologies that allow people to augment themselves " +
                               "beyond normal human capabilities. There are many different types of Augmentations, ranging from cybernetic to " +
                               "genetic to biological. Acquiring these Augmentations enhances the user's physical and mental faculties. <br><br>" +
                               "Because of how powerful these Augmentations are, the technology behind them is kept private and secret by the " +
                               "corporations and organizations that create them. Therefore, the only way for the player to obtain Augmentations is " +
                               "through Factions. After joining a Faction and earning enough reputation in it, you will be able to purchase " +
                               "its Augmentations. Different Factions offer different Augmentations. Augmentations must be purchased in order to be installed, " +
                               "and they are fairly expensive. <br><br>" +
                               "When you purchase an Augmentation, the price of purchasing another Augmentation increases by 90%. This multiplier stacks for " +
                               "each Augmentation you purchase. You will not gain the benefits of your purchased Augmentations until you install them. You can " +
                               "choose to install Augmentations through the 'Augmentations' menu tab. Once you install your purchased Augmentations, " +
                               "their costs are reset back to the original price.<br><br>" +
                               "Unfortunately, installing Augmentations has side effects. You will lose most of the progress you've made, including your " +
                               "skills, stats, and money. You will have to start over, but you will have all of the Augmentations you have installed to " +
                               "help you progress. <br><br> " +
                               "To summarize, here is a list of everything you will LOSE when you install an Augmentation: <br><br>" +
                               "Stats/Skills<br>" +
                               "Money<br>" +
                               "Scripts on all servers EXCEPT your home computer<br>" +
                               "Purchased servers<br>" +
                               "Hacknet Nodes<br>" +
                               "Company/faction reputation<br>" +
                               "Jobs and Faction memberships<br>" +
                               "Programs<br>" +
                               "Stocks<br>" +
                               "TOR router<br><br>" +
                               "Here is everything you will KEEP when you install an Augmentation: <br><br>" +
                               "Every Augmentation you have installed<br>"  +
                               "Scripts on your home computer<br>" +
                               "RAM and CPU Core Upgrades on your home computer<br>" +
                               "World Stock Exchange account and TIX API Access<br>",

    LatestUpdate:
    `
     v0.41.0
     * Gang Mechanic Changes (BitNode-2):
     *** Added new 'ascension' mechanic for Gang Members
     *** The first three gang members are now 'free' (can be recruited instantly)
     *** Maximum number of increased Gang Members increased from 20 to 50
     *** Changed the formula for calculating respect needed to recruit the next gang member
     *** Added a new category of upgrades for Gang Members: Augmentations
     *** Non-Augmentation Gang member upgrades are now significantly weaker
     *** Reputation for your Gang faction can no longer be gained through Infiltration
     * b1t_flum3.exe now takes significantly less time to create
     * Bug Fix: Fixed a bug that sometimes caused a blank black screen when destroying/resetting/switching BitNodes
     * Bug Fix: Netscript calls that throw errors will now no longer cause the 'concurrent calls' error if they are caught in the script. i.e. try/catch should now work properly in scripts
     `

}

export {CONSTANTS};
