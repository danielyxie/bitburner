CONSTANTS = {
    Version:                "0.27.0",

	//Max level for any skill, assuming no multipliers. Determined by max numerical value in javascript for experience
    //and the skill level formula in Player.js. Note that all this means it that when experience hits MAX_INT, then
    //the player will have this level assuming no multipliers. Multipliers can cause skills to go above this.
	MaxSkillLevel: 			975,

    //How much reputation is needed to join a megacorporation's faction
    CorpFactionRepRequirement: 250000,

    /* Base costs */
    BaseCostFor1GBOfRamHome: 30000,
    BaseCostFor1GBOfRamServer: 50000,     //1 GB of RAM
    BaseCostFor1GBOfRamHacknetNode: 30000,

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
    FactionReputationToFavorBase: 500,
    FactionReputationToFavorMult: 1.02,
    CompanyReputationToFavorBase: 500,
    CompanyReputationToFavorMult: 1.02,


    /* Augmentation */
    //NeuroFlux Governor cost multiplier as you level up
    NeuroFluxGovernorLevelMult: 1.14,

    //RAM Costs for different commands
    ScriptWhileRamCost:             0.2,
    ScriptForRamCost:               0.2,
    ScriptIfRamCost:                0.1,
    ScriptHackRamCost:              0.1,
    ScriptGrowRamCost:              0.15,
    ScriptWeakenRamCost:            0.15,
    ScriptScanRamCost:              0.2,
    ScriptNukeRamCost:              0.05,
    ScriptBrutesshRamCost:          0.05,
    ScriptFtpcrackRamCost:          0.05,
    ScriptRelaysmtpRamCost:         0.05,
    ScriptHttpwormRamCost:          0.05,
    ScriptSqlinjectRamCost:         0.05,
    ScriptRunRamCost:               0.8,
    ScriptExecRamCost:              1.1,
    ScriptScpRamCost:               0.5,
    ScriptKillRamCost:              0.5, //Kill and killall
    ScriptHasRootAccessRamCost:     0.05,
    ScriptGetHostnameRamCost:       0.05,
    ScriptGetHackingLevelRamCost:   0.05,
    ScriptGetServerCost:            0.1,
    ScriptFileExistsRamCost:        0.1,
    ScriptIsRunningRamCost:         0.1,
    ScriptOperatorRamCost:          0.01,
    ScriptPurchaseHacknetRamCost:   1.5,
    ScriptHacknetNodesRamCost:      1.0, //Base cost for accessing hacknet nodes array
    ScriptHNUpgLevelRamCost:        0.4,
    ScriptHNUpgRamRamCost:          0.6,
    ScriptHNUpgCoreRamCost:         0.8,
    ScriptGetStockRamCost:          2.0,
    ScriptBuySellStockRamCost:      2.5,
    ScriptPurchaseServerRamCost:    2.0,
    ScriptRoundRamCost:             0.05,
    ScriptReadWriteRamCost:         1.0,
    ScriptArbScriptRamCost:         1.0, //Functions that apply to all scripts regardless of args
    ScriptGetScriptCost:            0.1,

    MultithreadingRAMCost:          1,

    //Server constants
    ServerBaseGrowthRate: 1.03,     //Unadjusted Growth rate
    ServerMaxGrowthRate: 1.0035,     //Maximum possible growth rate (max rate accounting for server security)
    ServerFortifyAmount: 0.002,     //Amount by which server's security increases when its hacked/grown
    ServerWeakenAmount: 0.05,        //Amount by which server's security decreases when weakened

    PurchasedServerLimit: 25,

    //Augmentation Constants
    AugmentationCostMultiplier: 5,  //Used for balancing costs without having to readjust every Augmentation cost
    AugmentationRepMultiplier:  2.5, //Used for balancing rep cost without having to readjust every value
    MultipleAugMultiplier:      1.9,

    //How much a TOR router costs
    TorRouterCost: 200000,

    //Infiltration constants
    InfiltrationBribeBaseAmount: 100000, //Amount per clearance level
    InfiltrationMoneyValue:   2000,    //Convert "secret" value to money

    //Stock market constants
    WSEAccountCost:         200000000,
    TIXAPICost:             5000000000,
    StockMarketCommission:  100000,

    //Hospital/Health
    HospitalCostPerHp: 100000,

    //Gang constants
    GangRespectToReputationRatio: 2, //Respect is divided by this to get rep gain
    MaximumGangMembers: 20,
    GangRecruitCostMultiplier: 2,
    GangTerritoryUpdateTimer: 150,

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

    CrimeShoplift: "shoplift",
    CrimeRobStore: "rob a store",
    CrimeMug: "mug someone",
    CrimeLarceny: "commit larceny",
    CrimeDrugs: "deal drugs",
    CrimeTraffickArms: "traffick illegal arms",
    CrimeHomicide: "commit homicide",
    CrimeGrandTheftAuto: "commit grand theft auto",
    CrimeKidnap: "kidnap someone for ransom",
    CrimeAssassination: "assassinate a high-profile target",
    CrimeHeist: "pull off the ultimate heist",

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
                         "Each server has a security level, which is denoted by a number between 1 and 100. A higher number means " +
                         "the server has stronger security. As mentioned above, a server's security level is an important factor " +
                         "to consider when hacking. You can check a server's security level using the 'analyze' command, although this " +
                         "only gives an estimate (with 5% uncertainty). You can also check a server's security in a script, using the " +
                         "<i>getServerSecurityLevel(server)</i> function in Netscript. See the Netscript documentation for more details. " +
                         "This function will give you an exact value for a server's security. <br><br>" +
                         "Whenever a server is hacked manually or through a script, its security level increases by a small amount. Calling " +
                         "the grow() command in a script will also increase security level of the target server.  These actions will " +
                         "make it harder for you to hack the server, and decrease the amount of money you can steal. You can lower a " +
                         "server's security level in a script using the <i>weaken(server)</i> function in Netscript. See the Netscript " +
                         "documentation for more details",

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
                         "every call to the hack(), grow(), and weaken() Netscript functions will have its effect multiplied by the number of scripts. " +
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
    TutorialNetscriptText: "Netscript is a programming language implemented for this game. The language has " +
                           "your basic programming constructs and several built-in commands that are used to hack. <br><br>" +
                           "<u><h1>Official Wiki and Documentation</h1></u><br>" +
                           "<a href='https://bitburner.wikia.com/wiki/Netscript' target='_blank'>Check out Bitburner's wiki for the official Netscript documentation</a>" +
                           ". The wiki documentation will contain more details and " +
                           "code examples than this documentation page. Also, it can be opened up in another tab/window for convenience!<br><br>" +
                           "<u><h1> Variables and data types </h1></u><br>" +
                           "The following data types are supported by Netscript: <br>" +
                           "numeric - Integers and floats (eg. 6, 10.4999)<br>" +
                           "string - Encapsulated by single or double quotes (eg. 'this is a string')<br>" +
                           "boolean - true or false<br><br>" +
                           "To create a variable, use the assign (=) operator. The language is not strongly typed. Examples: <br>" +
                           "i = 5;<br>" +
                           "s = 'this game is awesome!';<br><br>" +
                           "In the first example above, we are creating the variable i and assigning it a value of 5. In the second, " +
                           "we are creating the variable s and assigning it the value of a string. Note that all expressions must be " +
                           "ended with a semicolon. <br><br>" +
                           "<u><h1> Operators</h1> </u><br>" +
                           "The following operators are supported by Netscript: <br>" +
                           "&nbsp;+<br>" +
                           "&nbsp;-<br>" +
                           "&nbsp;*<br>" +
                           "&nbsp;/<br>" +
                           "&nbsp;%<br>" +
                           "&nbsp;&&<br>" +
                           "&nbsp;||<br>" +
                           "&nbsp;<<br>" +
                           "&nbsp;><br>" +
                           "&nbsp;<=<br>" +
                           "&nbsp;>=<br>" +
                           "&nbsp;==<br>" +
                           "&nbsp;!=<br>" +
                           "&nbsp;++ (Note: This ONLY pre-increments. Post-increment does not work)<br>" +
                           "&nbsp;-- (Note: This ONLY pre-decrements. Post-decrement does not work)<br>" +
                           "&nbsp;-  (Negation operator)<br>" +
                           "&nbsp;!<br><br>" +
                           "<u><h1> Arrays </h1></u><br>" +
                           "Netscript arrays have the same properties and functions as javascript arrays. For information see javascripts <a href=\"https://www.w3schools.com/js/js_arrays.asp\" target='_blank'>array</a> documentation.<br><br>"+
                           "<u><h1> Script Arguments </h1></u><br>" +
                           "Arguments passed into a script can be accessed using a special array called 'args'. The arguments can be accessed like a normal array using the [] " +
                           "operator. (args[0], args[1], args[2]...) <br><br>" +
                           "For example, let's say we want to make a generic script 'generic-run.script' and we plan to pass two arguments into that script. The first argument will be the name of " +
                           "another script, and the second argument will be a number. This generic script will run the script specified in the first argument " +
                           "with the amount of threads specified in the second element. The code would look like:<br><br>" +
                           "run(args[0], args[1]);<br><br>" +
                           "It is also possible to get the number of arguments that was passed into a script using:<br><br>" +
                           "args.length<br><br>" +
                           "Note that none of the other functions that typically work with arrays, such as remove(), insert(), clear(), etc., will work on the " +
                           "args array.<br><br>" +
                           "<u><h1> Functions </h1></u><br>" +
                           "You can NOT define you own functions in Netscript (yet), but there are several built in functions that " +
                           "you may use: <br><br> " +
                           "<i>hack(hostname/ip)</i><br>Core function that is used to try and hack servers to steal money and gain hacking experience. The argument passed in must be a string with " +
                           "either the IP or hostname of the server you want to hack. The runtime for this command depends on your hacking level and the target server's security level. " +
                           " A script can hack a server from anywhere. It does not need to be running on the same server to hack that server. " +
                           "For example, you can create a script that hacks the 'foodnstuff' server and run that script on any server in the game. A successful hack() on " +
                           "a server will raise that server's security level by 0.002. Returns true if the hack is successful and " +
                           "false otherwise. <br>" +
                           "Examples: hack('foodnstuff'); or hack('148.192.0.12');<br><br>" +
                           "<i>sleep(n, log=true)</i><br>Suspends the script for n milliseconds. The second argument is an optional boolean that indicates " +
                           "whether or not the function should log the sleep action. If this argument is true, then calling this function will write " +
                           "'Sleeping for N milliseconds' to the script's logs. If it's false, then this function will not log anything. " +
                           "If this argument is not specified then it will be true by default. <br>Example: sleep(5000);<br><br>" +
                           "<i>grow(hostname/ip)</i><br>Use your hacking skills to increase the amount of money available on a server. The argument passed in " +
                           "must be a string with either the IP or hostname of the target server. The runtime for this command depends on your hacking level and the target server's security level. " +
                           "When grow() completes, the money available on a target server will be increased by a certain, fixed percentage. This percentage " +
                           "is determined by the server's growth rate and varies between servers. Generally, higher-level servers have higher growth rates. <br><br> " +
                           "Like hack(), grow() can be called on any server, regardless of where the script is running. " +
                           "The grow() command requires root access to the target server, but there is no required hacking level to run the command. " +
                           "It also raises the security level of the target server by 0.004. " +
                           "Returns the number by which the money on the server was multiplied for the growth. " +
                           "Works offline at a slower rate. <br> Example: grow('foodnstuff');<br><br>" +
                           "<i>weaken(hostname/ip)</i><br>Use your hacking skills to attack a server's security, lowering the server's security level. The argument passed " +
                           "in must be a string with either the IP or hostname of the target server. The runtime for this command depends on your " +
                           "hacking level and the target server's security level. This function lowers the security level of the target server by " +
                           "0.05.<br><br> Like hack() and grow(), weaken() can be called on " +
                           "any server, regardless of where the script is running. This command requires root access to the target server, but " +
                           "there is no required hacking level to run the command. Returns " +
                           "0.1. Works offline at a slower rate<br> Example: weaken('foodnstuff');<br><br>" +
                           "<i>print(x)</i> <br>Prints a value or a variable to the scripts logs (which can be viewed with the 'tail [script]' terminal command ). <br><br>" +
                           "<i>clearLog()</i><br>Clears the script's logs. <br><br>" +
                           "<i>scan(hostname/ip)</i><br>Returns an array containing the hostnames of all servers that are one node away from the specified server. " +
                           "The argument must be a string containing the IP or hostname of the target server. The hostnames in the returned array are strings.<br><br>" +
                           "<i>nuke(hostname/ip)</i><br>Run NUKE.exe on the target server. NUKE.exe must exist on your home computer. Does NOT work while offline <br> Example: nuke('foodnstuff'); <br><br>" +
                           "<i>brutessh(hostname/ip)</i><br>Run BruteSSH.exe on the target server. BruteSSH.exe must exist on your home computer. Does NOT work while offline <br> Example: brutessh('foodnstuff');<br><br>" +
                           "<i>ftpcrack(hostname/ip)</i><br>Run FTPCrack.exe on the target server. FTPCrack.exe must exist on your home computer. Does NOT work while offline <br> Example: ftpcrack('foodnstuff');<br><br>" +
                           "<i>relaysmtp(hostname/ip)</i><br>Run relaySMTP.exe on the target server. relaySMTP.exe must exist on your home computer. Does NOT work while offline <br> Example: relaysmtp('foodnstuff');<br><br>" +
                           "<i>httpworm(hostname/ip)</i><br>Run HTTPWorm.exe on the target server. HTTPWorm.exe must exist on your home computer. Does NOT work while offline <br> Example: httpworm('foodnstuff');<br><br>" +
                           "<i>sqlinject(hostname/ip)</i><br>Run SQLInject.exe on the target server. SQLInject.exe must exist on your home computer. Does NOT work while offline  <br> Example: sqlinject('foodnstuff');<br><br>" +
                           "<i>run(script, [numThreads], [args...])</i> <br> Run a script as a separate process. The first argument that is passed in is the name of the script as a string. This function can only " +
                           "be used to run scripts located on the current server (the server running the script that calls this function). The second argument " +
                           "is optional, and it specifies how many threads to run the script with. This argument must be a number greater than 0. If it is omitted, then the script will be run single-threaded. Any additional arguments will specify " +
                           "arguments to pass into the new script that is being run. If arguments are specified for the new script, then the second argument numThreads argument must be filled in with a value.<br><br>" +
                           "Returns true if the script is successfully started, and false otherwise. Requires a significant amount " +
                           "of RAM to run this command. Does NOT work while offline <br><br>" +
                           "The simplest way to use the run command is to call it with just the script name. The following example will run 'foo.script' single-threaded with no arguments:<br><br>" +
                           "run('foo.script');<br><br>" +
                           "The following example will run 'foo.script' but with 5 threads instead of single-threaded:<br><br>" +
                           "run('foo.script', 5);<br><br>" +
                           "The following example will run 'foo.script' single-threaded, and will pass the string 'foodnstuff' into the script as an argument:<br><br>" +
                           "run('foo.script', 1, 'foodnstuff');<br><br>" +
                           "<i>exec(script, hostname/ip, [numThreads], [args...])</i><br>Run a script as a separate process on another server. The first argument is the name of the script as a string. The " +
                           "second argument is a string with the hostname or IP of the 'target server' on which to run the script. The specified script must exist on the target server. " +
                           "The third argument is optional, and it specifies how many threads to run the script with. If it is omitted, then the script will be run single-threaded. " +
                           "This argument must be a number that is greater than 0. Any additional arguments will specify arguments to pass into the new script that is being run. If " +
                           "arguments are specified for the new script, then the third argument numThreads must be filled in with a value.<br><br>Returns " +
                           "true if the script is successfully started, and false otherwise. Does NOT work while offline<br><br> " +
                           "The simplest way to use the exec command is to call it with just the script name and the target server. The following example will try to run 'generic-hack.script' " +
                           "on the 'foodnstuff' server:<br><br>" +
                           "exec('generic-hack.script', 'foodnstuff');<br><br>" +
                           "The following example will try to run the script 'generic-hack.script' on the 'joesguns' server with 10 threads:<br><br>" +
                           "exec('generic-hack.script', 'joesguns', 10);<br><br>" +
                           "The following example will try to run the script 'foo.script' on the 'foodnstuff' server with 5 threads. It will also pass the number 1 and the string 'test' in as arguments " +
                           "to the script.<br><br>" +
                           "exec('foo.script', 'foodnstuff', 5, 1, 'test');<br><br>" +
                           "<i>kill(script, hostname/ip, [args...])</i><br> Kills the script on the target server specified by the script's name and arguments. Remember that " +
                           "scripts are uniquely identified by both their name and arguments. For example, if 'foo.script' is run with the argument 1, then this is not the "  +
                           "same as 'foo.script' run with the argument 2, even though they have the same code. <br><br>" +
                           "The first argument must be a string with the name of the script. The name is case-sensitive. " +
                           "The second argument must be a string with the hostname or IP of the target server. Any additional arguments to the function will specify the arguments passed " +
                           "into the script that should be killed. <br><br>The function will try to kill the specified script on the target server. " +
                           "If the script is found on the specified server and is running, then it will be killed and this function " +
                           "will return true. Otherwise, this function will return false. <br><br>" +
                           "Examples:<br>" +
                           "If you are trying to kill a script named 'foo.script' on the 'foodnstuff' server that was ran with no arguments, use this:<br><br>" +
                           "kill('foo.script', 'foodnstuff');<br><br>" +
                           "If you are trying to kill a script named 'foo.script' on the current server that was ran with no arguments, use this:<br><br>" +
                           "kill('foo.script', getHostname());<br><br>" +
                           "If you are trying to kill a script named 'foo.script' on the current server that was ran with the arguments 1 and 'foodnstuff', use this:<br><br>" +
                           "kill('foo.script', getHostname(), 1, 'foodnstuff');<br><br>" +
                           "<i>killall(hostname/ip)</i><br> Kills all running scripts on the specified server. This function takes a single argument which " +
                           "must be a string containing the hostname or IP of the target server. This function will always return true. <br><br>" +
                           "<i>scp(script, hostname/ip)</i><br>Copies a script to another server. The first argument is a string with the filename of the script " +
                           "to be copied. The second argument is a string with the hostname or IP of the destination server. Returns true if the script is successfully " +
                           "copied over and false otherwise. <br> Example: scp('hack-template.script', 'foodnstuff');<br><br>" +
                           "<i>hasRootAccess(hostname/ip)</i><br> Returns a boolean (true or false) indicating whether or not the Player has root access to a server. " +
                           "The argument passed in must be a string with either the hostname or IP of the target server. Does NOT work while offline.<br> " +
                           "Example:<br>if (hasRootAccess('foodnstuff') == false) {<br>&nbsp;&nbsp;&nbsp;&nbsp;nuke('foodnstuff');<br>}<br><br>" +
                           "<i>getHostname()</i><br>Returns a string with the hostname of the server that the script is running on<br><br>" +
                           "<i>getHackingLevel()</i><br> Returns the Player's current hacking level. Does NOT work while offline <br><br> " +
                           "<i>getServerMoneyAvailable(hostname/ip)</i><br> Returns the amount of money available on a server. The argument passed in must be a string with either the " +
                           "hostname or IP of the target server. Does NOT work while offline <br> Example: getServerMoneyAvailable('foodnstuff');<br><br>" +
                           "<i>getServerMaxMoney(hostname/ip)</i><br>Returns the maximum amount of money that can be available on a server. The argument passed in must be a string with " +
                           "the hostname or IP of the target server. Does NOT work while offline<br>Example: getServerMaxMoney('foodnstuff');<br><br>" +
                           "<i>getServerSecurityLevel(hostname/ip)</i><br>Returns the security level of a server. The argument passed in must be a string with either the " +
                           "hostname or IP of the target server. A server's security is denoted by a number between 1 and 100. Does NOT work while offline.<br><br>" +
                           "<i>getServerBaseSecurityLevel(hostname/ip)</i><br> Returns the base security level of a server. This is the security level that the server starts out with. " +
                           "This is different than getServerSecurityLevel() because getServerSecurityLevel() returns the current security level of a server, which can constantly change " +
                           "due to hack(), grow(), and weaken() calls on that server. The base security level will stay the same until you reset by installing an Augmentation. <br><br>" +
                           "The argument passed in must be a string with either the hostname or IP of the target server. A server's base security is denoted by a number between 1 and 100. " +
                           "Does NOT work while offline.<br><br>" +
                           "<i>getServerRequiredHackingLevel(hostname/ip)</i><br> Returns the required hacking level of a server. The argument passed in must be a string with either the " +
                           "hostname or IP or the target server. Does NOT work while offline <br><br>" +
                           "<i>getServerNumPortsRequired(hostname/ip)</i><br>Returns the number of open ports required to successfully run NUKE.exe on a server. The argument " +
                           "passed in must be a string with either the hostname or IP of the target server. Does NOT work while offline<br><br>" +
                           "<i>fileExists(filename, [hostname/ip])</i><br> Returns a boolean (true or false) indicating whether the specified file exists on a server. " +
                           "The first argument must be a string with the name of the file. A file can either be a script or a program. A script name is case-sensitive, but a " +
                           "program is not. For example, fileExists('brutessh.exe') will work fine, even though the actual program is named BruteSSH.exe. <br><br> " +
                           "The second argument is a string with the hostname or IP of the server on which to search for the program. This second argument is optional. " +
                           "If it is omitted, then the function will search through the current server (the server running the script that calls this function) for the file. <br> " +
                           "Example: fileExists('foo.script', 'foodnstuff');<br>" +
                           "Example: fileExists('ftpcrack.exe');<br><br>" +
                           "The first example above will return true if the script named 'foo.script' exists on the 'foodnstuff' server, and false otherwise. The second example above will " +
                           "return true if the current server (the server on which this function runs) contains the FTPCrack.exe program, and false otherwise. <br><br>" +
                           "<i>isRunning(filename, hostname/ip, [args...])</i><br> Returns a boolean (true or false) indicating whether the specified script is running on a server. " +
                           "Remember that a script is uniquely identified by both its name and its arguments. <br><br>" +
                           "The first argument must be a string with the name of the script. The script name is case sensitive. The second argument is a string with the " +
                           "hostname or IP of the target server. Any additional arguments passed to the function will specify the arguments passed into the target script. " +
                           "The function will check whether the script is running on that target server.<br>" +
                           "Example: isRunning('foo.script', 'foodnstuff');<br>" +
                           "Example: isRunning('foo.script', getHostname());<br>" +
                           "Example: isRunning('foo.script', 'joesguns', 1, 5, 'test');<br><br>" +
                           "The first example above will return true if there is a script named 'foo.script' with no arguments running on the 'foodnstuff' server, and false otherwise. The second " +
                           "example above will return true if there is a script named 'foo.script' with no arguments running on the current server, and false otherwise. " +
                           "The third example above will return true if there is a script named 'foo.script' with the arguments 1, 5, and 'test' running on the 'joesguns' server, and " +
                           "false otherwise.<br><br>" +
                           "<i>purchaseHacknetNode()</i><br> Purchases a new Hacknet Node. Returns a number with the index of the Hacknet Node. This index is equivalent to the number " +
                           "at the end of the Hacknet Node's name (e.g The Hacknet Node named 'hacknet-node-4' will have an index of 4). If the player cannot afford to purchase " +
                           "a new Hacknet Node then the function will return false. Does NOT work offline<br><br>" +
                           "<i>purchaseServer(hostname, ram)</i><br> Purchases a server with the specified hostname and amount of RAM. The first argument can be any data type, " +
                           "but it will be converted to a string using Javascript's String function. Anything that resolves to an empty string will cause the function to fail. " +
                           "The second argument specified the amount of RAM (in GB) for the server. This argument must resolve to a numeric and it must be a power of 2 " +
                           "(2, 4, 8, etc...). <br><br>" +
                           "Purchasing a server using this Netscript function is twice as expensive as manually purchasing a server from a location in the World.<br><br>" +
                           "This function returns the hostname of the newly purchased server as a string. If the function fails to purchase a server, then it will return " +
                           "an empty string. The function will fail if the arguments passed in are invalid or if the player does not have enough money to purchase the specified server.<br><br>" +
                           "<i>round(n)</i><br>Rounds the number n to the nearest integer. If the argument passed in is not a number, then the function will return 0.<br><br>" +
                           "<i>write(port, data)</i><br>Writes data to a port. The first argument must be a number between 1 and 10 that specifies the port. The second " +
                           "argument defines the data to write to the port. If the second argument is not specified then it will write an empty string to the port.<br><br>" +
                           "<i>read(port)</i><br>Reads data from a port. The first argument must be a number between 1 and 10 that specifies the port. A port is a serialized queue. " +
                           "This function will remove the first element from the queue and return it. If the queue is empty, then the string 'NULL PORT DATA' will be returned. <br><br>" +
                           "<u><h1>Hacknet Nodes API</h1></u><br>" +
                           "Netscript provides the following API for accessing and upgrading your Hacknet Nodes through scripts. This API does NOT work offline.<br><br>" +
                           "<i>hacknetnodes</i><br> A special variable. This is an array that maps to the Player's Hacknet Nodes. The Hacknet Nodes are accessed through " +
                           "indexes. These indexes correspond to the number at the end of the name of the Hacknet Node. For example, the first Hacknet Node you purchase " +
                           "will have the same 'hacknet-node-0' and can be accessed with hacknetnodes[0]. The fourth Hacknet Node you purchase will have the name " +
                           "'hacknet-node-3' and can be accessed with hacknetnodes[3]. <br><br>" +
                           "<i>hacknetnodes.length</i><br> Returns the number of Hacknet Nodes that the player owns<br><br>" +
                           "<i>hacknetnodes[i].level</i><br> Returns the level of the corresponding Hacknet Node<br><br>" +
                           "<i>hacknetnodes[i].ram</i><br> Returns the amount of RAM on the corresponding Hacknet Node<br><br>" +
                           "<i>hacknetnodes[i].cores</i><br> Returns the number of cores on the corresponding Hacknet Node<br><br>" +
                           "<i>hacknetnodes[i].upgradeLevel(n)</i><br> Tries to upgrade the level of the corresponding Hacknet Node n times. The argument n must be a " +
                           "positive integer. Returns true if the Hacknet Node's level is successfully upgraded n times or up to the max level (200), and false otherwise.<br><br>" +
                           "<i>hacknetnodes[i].upgradeRam()</i><br> Tries to upgrade the amount of RAM on the corresponding Hacknet Node. Returns true if the " +
                           "RAM is successfully upgraded, and false otherwise. <br><br>" +
                           "<i>hacknetnodes[i].upgradeCore()</i><br> Attempts to purchase an additional core for the corresponding Hacknet Node. Returns true if the " +
                           "additional core is successfully purchase, and false otherwise. <br><br>" +
                           "Example: The following is an example of one way a script can be used to automate the purchasing and upgrading of Hacknet Nodes. " +
                           "This script purchases new Hacknet Nodes until the player has four. Then, it iteratively upgrades each of those four Hacknet Nodes " +
                           "to a level of at least 75, RAM to at least 8GB, and number of cores to at least 2.<br><br>" +
                           "while(hacknetnodes.length < 4) {<br>" +
                           "&nbsp;&nbsp;&nbsp;&nbsp;purchaseHacknetNode();<br>" +
                           "}<br>" +
                           "for (i = 0; i < 4; i = i++) {<br>" +
                           "&nbsp;&nbsp;&nbsp;&nbsp;while (hacknetnodes[i].level <=  75) {<br>" +
                           "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;hacknetnodes[i].upgradeLevel(5);<br>" +
                           "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sleep(10000);<br>" +
                           "&nbsp;&nbsp;&nbsp;&nbsp;}<br>" +
                           "}<br>" +
                           "for (i = 0; i < 4; i = i++) {<br>" +
                           "&nbsp;&nbsp;&nbsp;&nbsp;while (hacknetnodes[i].ram < 8) {<br>" +
                           "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;hacknetnodes[i].upgradeRam();<br>" +
                           "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sleep(10000);<br>" +
                           "&nbsp;&nbsp;&nbsp;&nbsp;}<br>" +
                           "}<br>" +
                           "for (i = 0; i < 4; i = i++) {<br>" +
                           "&nbsp;&nbsp;&nbsp;&nbsp;while (hacknetnodes[i].cores < 2) {<br>" +
                           "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;hacknetnodes[i].upgradeCore();<br>" +
                           "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sleep(10000);<br>" +
                           "&nbsp;&nbsp;&nbsp;&nbsp;}<br>" +
                           "}<br><br>" +
                           "<u><h1>Trade Information eXchange (TIX) API</h1></u><br>" +
                           "<i>getStockPrice(sym)</i><br>Returns the price of a stock. The argument passed in must be the stock's symbol (NOT THE COMPANY NAME!). The symbol " +
                           "is a sequence of two to four capital letters. The symbol argument must be a string. <br><br>" +
                           "Example: getStockPrice('FSIG');<br><br>" +
                           "<i>getStockPosition(sym)</i><br>Returns an array of two elements that represents the player's position in a stock. The first element " +
                           "in the array is the number of shares the player owns of the specified stock. The second element in the array is the average price of the player's " +
                           "shares. Both elements are numbers. The argument passed in must be the stock's symbol, which is a sequence of two to four capital letters.<br><br>" +
                           "Example: <br><br>pos = getStockPosition('ECP');<br>shares = pos[0];<br>avgPx = pos[1];<br><br>"+
                           "<i>buyStock(sym, shares)</i><br>Attempts to purchase shares of a stock. The first argument must be a string with the stock's symbol. The second argument " +
                           "must be the number of shares to purchase.<br><br>" +
                           "If the player does not have enough money to purchase specified number of shares, then no shares will be purchased (it will not purchase the most you can afford). " +
                           "Remember that every transaction on the stock exchange costs a certain commission fee.<br><br>" +
                           "The function will return true if it successfully purchases the specified number of shares of stock, and false otherwise.<br><br>" +
                           "<i>sellStock(sym, shares)</i><br>Attempts to sell shares of a stock. The first argument must be a string with the stock's symbol. The second argument " +
                           "must be the number of shares to sell.<br><br>" +
                           "If the specified number of shares in the function exceeds the amount that the player actually owns, then this function will sell all owned shares. " +
                           "Remember that every transaction on the stock exchange costs a certain commission fee.<br><br>" +
                           "The net profit made from selling stocks with this function is reflected in the script's statistics. This net profit is calculated as: <br><br>" +
                           "shares * (sell price - average price of purchased shares)<br><br>" +
                           "This function will return true if the shares of stock are successfully sold and false otherwise.<br><br>" +
                           "<u><h1>While loops </h1></u><br>" +
                           "A while loop is a control flow statement that repeatedly executes code as long as a condition is met. <br><br> " +
                           "<i>while (<i>[cond]</i>) {<br>&nbsp;&nbsp;&nbsp;&nbsp;<i>[code]</i><br>}</i><br><br>" +
                           "As long as <i>[cond]</i> remains true, the code block <i>[code]</i> will continuously execute. Example: <br><br>" +
                           "<i>i = 0; <br> while (i < 10) { <br>&nbsp;&nbsp;&nbsp;&nbsp;hack('foodnstuff');<br>&nbsp;&nbsp;&nbsp;&nbsp;i = i + 1;<br> } </i><br><br>" +
                           "This code above repeats the 'hack('foodnstuff')' command 10 times before it stops and exits. <br><br>" +
                           "<i>while(true) { <br>&nbsp;&nbsp;&nbsp;&nbsp; hack('foodnstuff'); <br> }</i><br><br> " +
                           "This while loop above is an infinite loop (continuously runs until the script is manually stopped) that repeatedly runs the 'hack('foodnstuff')' command. " +
                           "Note that a semicolon is needed at closing bracket of the while loop, UNLESS it is at the end of the code<br><br> " +
                           "<u><h1>For loops</h1></u><br>" +
                           "A for loop is another control flow statement that allows code to be repeated by iterations. The structure is: <br><br> " +
                           "<i>for (<i>[init]</i>; <i>[cond]</i>; <i>[post]</i>) {<br>&nbsp;&nbsp;&nbsp;&nbsp;<i>code</i> <br> } </i><br><br>" +
                           "The <i>[init]</i> expression evaluates before the for loop begins. The for loop will continue to execute " +
                           "as long as <i>[cond]</i> is met. The <i>[post]</i> expression will evaluate at the end of every iteration " +
                           "of the for loop. The following example shows code that will run the 'hack('foodnstuff');' command 10 times " +
                           " using a for loop: <br><br>" +
                           "<i>for (i = 0; i < 10; i = i++) { <br>&nbsp;&nbsp;&nbsp;&nbsp;hack('foodnstuff');<br>} </i><br><br>" +
                           "<u><h1> If statements </h1></u><br>" +
                           "If/Else if/Else statements are conditional statements used to perform different actions based on different conditions: <br><br>" +
                           "<i>if (condition1) {<br>&nbsp;&nbsp;&nbsp;&nbsp;code1<br>} else if (condition2) {<br>&nbsp;&nbsp;&nbsp;&nbsp;code2<br>} else {<br>" +
                           "&nbsp;&nbsp;&nbsp;&nbsp;code3<br>}</i><br><br>" +
                           "In the code above, first <i>condition1</i> will be checked. If this condition is true, then <i>code1</i> will execute and the " +
                           "rest of the if/else if/else statement will be skipped. If <i>condition1</i> is NOT true, then the code will then go on to check " +
                           "<i>condition2</i>. If <i>condition2</i> is true, then <i>code2</i> will be executed, and the rest of the if/else if/else statement " +
                           "will be skipped. If none of the conditions are true, then the code within the else block (<i>code3</i>) will be executed. " +
                           "Note that a conditional statement can have any number of 'else if' statements. <br><br>" +
                           "Example: <br><br>" +
                           "if(getServerMoneyAvailable('foodnstuff') > 200000) {<br>&nbsp;&nbsp;&nbsp;&nbsp;hack('foodnstuff');<br>" +
                           "} else {<br>&nbsp;&nbsp;&nbsp;&nbsp;grow('foodnstuff');<br>}<br><br>" +
                           "The code above will use the getServerMoneyAvailable() function to check how much money there is on the 'foodnstuff' server. " +
                           "If there is more than $200,000, then it will try to hack that server. If there is $200,000 or less on the server, " +
                           "then the code will call grow('foodnstuff') instead and add more money to the server.<br><br>",

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
                               "RAM Upgrades on your home computer<br>" +
                               "World Stock Exchange account and TIX API Access<br>",

    LatestUpdate:
    "v0.27.0<br>" +
    "-Added secondary 'prestige' system - featuring Source Files and BitNodes<br>" +
    "-MILD SPOILERS HERE: Installing 'The Red Pill' Augmentation from Daedalus will unlock a special server called " +
    "w0r1d_d43m0n. Finding and manually hacking this server through Terminal will destroy the Player's current BitNode, and allow the player " +
    "to enter a new one. When destroying a BitNode, the player loses everything except the scripts on his/her " +
    "home computer. The player will then gain a powerful second-tier persistent upgrade called a Source File. The player can then " +
    "enter a new BitNode to start the game over. Each BitNode has different characteristics, and many will have new content/mechanics " +
    "as well. Right now there are only 2 BitNodes. Each BitNode grants its own unique Source File. Restarting and destroying a BitNode you already " +
    "have a Source File for will upgrade your Source File up to a maximum level of 3.<br><br>" +
    "-Reputation gain with factions and companies is no longer a linear conversion, but an exponential one. It " +
    "will be much easier to gain faction favor at first, but much harder later on. <br>" +
    "-Significantly increased Infiltration exp gains<br>" +
    "-Fixed a bug with company job requirement tooltips<br>" +
    "-Added scriptRunning(), scriptKill(), and getScriptRam() Netscript functions. See documentation for details<br>" + 
    "-Fixed a bug with deleteServer() Netscript function<br><br>"
}
