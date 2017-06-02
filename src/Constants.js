CONSTANTS = {
    Version:                "0.18.3",
    
	//Max level for any skill, assuming no multipliers. Determined by max numerical value in javascript for experience
    //and the skill level formula in Player.js. Note that all this means it that when experience hits MAX_INT, then
    //the player will have this level assuming no multipliers. Multipliers can cause skills to go above this. 
	MaxSkillLevel: 			975,
    
    //How much reputation is needed to join a megacorporation's faction
    CorpFactionRepRequirement: 250000,
    
    /* Base costs */
    BaseCostFor1GBOfRamHome: 40000,
    BaseCostFor1GBOfRamServer: 35000,     //1 GB of RAM
    BaseCostFor1GBOfRamHacknetNode: 30000,
    
    BaseCostForHacknetNode: 1000,
    BaseCostForHacknetNodeCore: 500000,
    
    /* Hacknet Node constants */
    HacknetNodeMoneyGainPerLevel: 1.6,
    HacknetNodePurchaseNextMult: 1.42,   //Multiplier when purchasing an additional hacknet node
    HacknetNodeUpgradeLevelMult: 1.045,  //Multiplier for cost when upgrading level
    HacknetNodeUpgradeRamMult: 1.28,     //Multiplier for cost when upgrading RAM
    HacknetNodeUpgradeCoreMult: 1.49,    //Multiplier for cost when buying another core
    
    HacknetNodeMaxLevel: 200,
    HacknetNodeMaxRam: 64,
    HacknetNodeMaxCores: 16,
    
    /* Augmentation */
    //NeuroFlux Governor cost multiplier as you level up
    NeuroFluxGovernorLevelMult: 1.14,
    
    /* Script related things */
	//Time (ms) it takes to run one operation in Netscript.  
	CodeInstructionRunTime:	1500, 
    
    //RAM Costs for differenc commands
    ScriptWhileRamCost:             0.4,
    ScriptForRamCost:               0.4,
    ScriptIfRamCost:                0.1,
    ScriptHackRamCost:              0.25,
    ScriptGrowRamCost:              0.25,
    ScriptWeakenRamCost:            0.25,
    ScriptNukeRamCost:              0.05,
    ScriptBrutesshRamCost:          0.05,
    ScriptFtpcrackRamCost:          0.05,
    ScriptRelaysmtpRamCost:         0.05,
    ScriptHttpwormRamCost:          0.05,
    ScriptSqlinjectRamCost:         0.05,
    ScriptRunRamCost:               0.8,
    ScriptExecRamCost:              1.1,
    ScriptScpRamCost:               0.5,
    ScriptHasRootAccessRamCost:     0.05,
    ScriptGetHostnameRamCost:       0.1,
    ScriptGetHackingLevelRamCost:   0.1,
    ScriptGetServerMoneyRamCost:    0.1,
    ScriptGetServerSecurityRamCost: 0.2,
    ScriptOperatorRamCost:          0.01,
    ScriptPurchaseHacknetRamCost:   1.5,
    ScriptHacknetNodesRamCost:      1.0, //Base cost for accessing hacknet nodes array
    ScriptHNUpgLevelRamCost:        0.4, 
    ScriptHNUpgRamRamCost:          0.6,
    ScriptHNUpgCoreRamCost:         0.8,
    
    //Server constants
    ServerGrowthRate: 1.002,   //Growth rate
    ServerFortifyAmount: 0.002, //Amount by which server's security increases when its hacked
    ServerWeakenAmount: 0.1,    //Amount by which server's security decreases when weakened
    
    //Augmentation Constants
    AugmentationCostMultiplier: 4.5,  //Used for balancing costs without having to readjust every Augmentation cost
    AugmentationRepMultiplier: 1.2, //Used for balancing rep cost without having to readjust every value
    
    //Maximum number of log entries for a script
    MaxLogCapacity: 40,
    
    //How much a TOR router costs
    TorRouterCost: 200000,
    
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
    
    ClassDataStructuresBaseCost: 6,
    ClassNetworksBaseCost: 30,
    ClassAlgorithmsBaseCost: 120,
    ClassManagementBaseCost: 60,
    ClassLeadershipBaseCost: 120,
    ClassGymBaseCost: 100,
    
    CrimeShoplift: "shoplift",
    CrimeMug: "mug someone",
    CrimeDrugs: "deal drugs",
    CrimeTraffickArms: "traffick illegal arms",
    CrimeHomicide: "commit homicide",
    CrimeGrandTheftAuto: "commit grand theft auto",
    CrimeKidnap: "kidnap someone for ransom",
    CrimeAssassination: "assassinate a high-profile target",
    CrimeHeist: "pull off the ultimate heist",
    
    //Text that is displayed when the 'help' command is ran in Terminal
    HelpText:   'alias [name="value"]   Create aliases for Terminal commands, or list existing aliases<br>' + 
                "analyze                Get statistics and information about current machine <br>" + 
                "cat [message]          Display a .msg file<br>" + 
                "clear                  Clear all text on the terminal <br>" +
                "cls                    See 'clear' command <br>" +
                "connect [ip/hostname]  Connects to the machine given by its IP or hostname <br>" + 
                "free                   Check the machine's memory (RAM) usage<br>" + 
                "hack                   Hack the current machine<br>" +
                "help                   Display this help text<br>" + 
                "home                   Connect to home computer<br>" + 
                "hostname               Displays the hostname of the machine<br>" + 
                "ifconfig               Displays the IP address of the machine<br>" +
                "kill [script]          Stops a script that is running on the current machine<br>" +
                "ls                     Displays all programs and scripts on the machine<br>" +
                "mem [script]           Displays the amount of RAM the script requires to run<br>" + 
                "nano [script]          Text editor - Open up and edit a script<br>" + 
                "ps                     Display all scripts that are currently running<br>" + 
                "rm                     Delete a script/program from the machine. (WARNING: Permanent)<br>" + 
                "run [script/program]   Execute a program or a script<br>" + 
                "scan                   Displays all available network connections<br>" +
                "scan-analyze [depth]   Displays hacking-related information for all servers up to <i>depth</i> nodes away<br>" + 
                "scp [script] [server]  Copies a script to a destination server (specified by ip or hostname)<br>" + 
                "sudov                  Shows whether or not you have root access on this computer<br>" + 
                "tail [script]          Display script logs (logs contain details about active scripts)<br>" +
                "top                    Display all running scripts and their RAM usage<br>",
                
    /* Tutorial related things */
	TutorialGettingStartedText: "Todo...",
    
    TutorialNetworkingText: "Servers are a central part of the game. You start with a single personal server (your home computer) " + 
                            "and you can purchase additional servers as you progress through the game. Connecting to other servers " + 
                            "and hacking them can be a major source of income and experience. Servers can also be used to run " + 
                            "scripts which can automatically hack servers for you. <br><br>" + 
                            "In order to navigate between machines, use the 'scan' command to see all servers " +
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
                         "encounter diminishing returns in your hacking (since you are only hacking a certain percentage). A server " + 
                         "will regain money at a slow rate over time. <br><br>" +
                         "<h1>Server Security</h1><br>" + 
                         "Each server has a security level, which is denoted by a number between 1 and 100. A higher number means " + 
                         "the server has stronger security. As mentioned above, a server's security level is an important factor " + 
                         "to consider when hacking. You can check a server's security level using the 'analyze' command, although this " +
                         "only gives an estimate (with 5% uncertainty). You can also check a server's security in a script, using the " + 
                         "<i>getServerSecurityLevel(server)</i> function in Netscript. See the Netscript documentation for more details. " + 
                         "This function will give you an exact value for a server's security. <br><br>" + 
                         "Whenever a server is hacked manually or through a script, its security level increases by a small amount. This will " + 
                         "make it harder for you to hack the server, and decrease the amount of money you can steal. You can lower a " + 
                         "server's security level in a script using the <i>weaken(server)</i> function in Netscript. See the Netscript " + 
                         "documentation for more details",
                         
    TutorialScriptsText: "Scripts can be used to automate the hacking process. Scripts must be written in the Netscript language. " + 
                         "Documentation about the Netscript language can be found in the 'Netscript Programming Language' " + 
                         "section of this 'Tutorial' page. <br><br>Running a script requires RAM. The more complex a script is, the more RAM " + 
                         "it requires to run. Scripts can be run on any server you have root access to. <br><br>" + 
                         "Here are some Terminal commands that are useful when working with scripts: <br>" + 
                         "free - Shows the current server's RAM usage and availability <br>" + 
                         "kill [script] - Stops a script that is running <br>" + 
                         "mem [script] - Check how much RAM a script requires to run<br>" +
                         "nano [script] - Create/Edit a script <br>" + 
                         "ps - Displays all scripts that are actively running on the current server<br>" + 
                         "run [script] - Run a script <br>" + 
                         "tail [script] - Displays a script's logs<br>" + 
                         "top - Displays all active scripts and their RAM usage <br><br>" + 
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
                           "&nbsp;!=<br><br>" + 
                           "<u><h1> Functions </h1></u><br>" + 
                           "You can NOT define you own functions in Netscript (yet), but there are several built in functions that " +
                           "you may use: <br><br> " + 
                           "<i>hack(hostname/ip)</i><br>Core function that is used to try and hack servers to steal money and gain hacking experience. The argument passed in must be a string with " +
                           "either the IP or hostname of the server you want to hack. A script can hack a server from anywhere. It does not need to be running on the same server to hack that server. " +
                           "For example, you can create a script that hacks the 'foodnstuff' server and run it on your home computer. <br>" + 
                           "Examples: hack('foodnstuff'); or hack('148.192.0.12');<br><br>" + 
                           "<i>sleep(n)</i><br>Suspends the script for n milliseconds. <br>Example: sleep(5000);<br><br>" + 
                           "<i>grow(hostname/ip)</i><br>Use your hacking skills to increase the amount of money available on a server. The argument passed in " + 
                           "must be a string with either the IP or hostname of the target server. The grow() command requires root access to the target server, but " +
                           "there is no required hacking level to run the command. " + 
                           "Grants 1 hacking exp when it completes. Works offline at a slower rate. <br> Example: grow('foodnstuff');<br><br>" + 
                           "<i>weaken(hostname/ip)</i><br>Use your hacking skills to attack a server's security, lowering the server's security level. The argument passed " + 
                           "in must be a string with either the IP or hostname of the target server. This command requires root access to the target server, but " + 
                           "there is no required hacking level to run the command. Grants 5 hacking exp when it completes. Works offline at a slower rate<br> Example: weaken('foodnstuff');<br><br>" + 
                           "<i>print(x)</i> <br> Prints a value or a variable to the scripts logs (which can be viewed with the 'tail [script]' terminal command )<br><br>" + 
                           "<i>nuke(hostname/ip)</i><br>Run NUKE.exe on the target server. NUKE.exe must exist on your home computer. Does NOT work while offline <br> Example: nuke('foodnstuff'); <br><br>" + 
                           "<i>brutessh(hostname/ip)</i><br>Run BruteSSH.exe on the target server. BruteSSH.exe must exist on your home computer. Does NOT work while offline <br> Example: brutessh('foodnstuff');<br><br>" + 
                           "<i>ftpcrack(hostname/ip)</i><br>Run FTPCrack.exe on the target server. FTPCrack.exe must exist on your home computer. Does NOT work while offline <br> Example: ftpcrack('foodnstuff');<br><br>" + 
                           "<i>relaysmtp(hostname/ip)</i><br>Run relaySMTP.exe on the target server. relaySMTP.exe must exist on your home computer. Does NOT work while offline <br> Example: relaysmtp('foodnstuff');<br><br>" + 
                           "<i>httpworm(hostname/ip)</i><br>Run HTTPWorm.exe on the target server. HTTPWorm.exe must exist on your home computer. Does NOT work while offline <br> Example: httpworm('foodnstuff');<br><br>" + 
                           "<i>sqlinject(hostname/ip)</i><br>Run SQLInject.exe on the target server. SQLInject.exe must exist on your home computer. Does NOT work while offline  <br> Example: sqlinject('foodnstuff');<br><br>" + 
                           "<i>run(script)</i> <br> Run a script as a separate process. The argument that is passed in is the name of the script as a string. This function can only " + 
                           "be used to run scripts located on the same server. Returns true if the script is successfully started, and false otherwise. Requires a significant amount " +
                           "of RAM to run this command. Does NOT work while offline <br>Example: run('hack-foodnstuff.script'); <br> The example above will try and launch the 'hack-foodnstuff.script' script on " + 
                           "the current server, if it exists. <br><br>" + 
                           "<i>exec(script, hostname/ip)</i><br>Run a script as a separate process on another server. The first argument is the name of the script as a string. The " + 
                           "second argument is a string with the hostname or IP of the 'target server' on which to run the script. The specified script must exist on the target server. Returns " + 
                           "true if the script is successfully started, and false otherwise. Does NOT work while offline<br> " + 
                           "Example: exec('generic-hack.script', 'foodnstuff'); <br> The example above will try to launch the script 'generic-hack.script' on the 'foodnstuff' server.<br><br>" + 
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
                           "<i>getServerSecurityLevel(hostname/ip)</i><br>Returns the security level of a server. The argument passed in must be a string with either the " + 
                           "hostname or IP of the target server. A server's security is denoted by a number between 1 and 100. Does NOT work while offline.<br><br>" + 
                           "<i>purchaseHacknetNode()</i><br> Purchases a new Hacknet Node. Returns a number with the index of the Hacknet Node. This index is equivalent to the number " + 
                           "at the end of the Hacknet Node's name (e.g The Hacknet Node named 'hacknet-node-4' will have an index of 4). If the player cannot afford to purchase " +
                           "a new Hacknet Node then the function will return false. Does NOT work offline<br><br>" + 
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
                           "positive integer. Returns true if the Hacknet Node's level is successfully upgraded n times, and false otherwise.<br><br>" + 
                           "<i>hacknetnodes[i].upgradeRam()</i><br> Tries to upgrade the amount of RAM on the corresponding Hacknet Node. Returns true if the " + 
                           "RAM is successfully upgraded, and false otherwise. <br><br>" + 
                           "<i>hacknetnodes[i].upgradeCore()</i><br> Attempts to purchase an additional core for the corresponding Hacknet Node. Returns true if the " + 
                           "additional core is successfully purchase, and false otherwise. <br><br>" + 
                           "Example: The following is an example of one way a script can be used to automate the purchasing and upgrading of Hacknet Nodes. " +
                           "This script purchases new Hacknet Nodes until the player has four. Then, it iteratively upgrades each of those four Hacknet Nodes " +
                           "to a level of at least 75, RAM to at least 8GB, and number of cores to at least 2.<br><br>" + 
                           "while(hacknetnodes.length < 4) {<br>" + 
                           "&nbsp;&nbsp;&nbsp;&nbsp;purchaseHacknetNode();<br>" + 
                           "};<br>" + 
                           "for (i = 0; i < 4; i = i+1) {<br>" + 
                           "&nbsp;&nbsp;&nbsp;&nbsp;while (hacknetnodes[i].level <=  75) {<br>" + 
                           "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;hacknetnodes[i].upgradeLevel(5);<br>" + 
                           "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sleep(10000);<br>" + 
                           "&nbsp;&nbsp;&nbsp;&nbsp;};<br>" + 
                           "};<br>" + 
                           "for (i = 0; i < 4; i = i+1) {<br>" + 
                           "&nbsp;&nbsp;&nbsp;&nbsp;while (hacknetnodes[i].ram < 8) {<br>" + 
                           "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;hacknetnodes[i].upgradeRam();<br>" + 
                           "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sleep(10000);<br>" + 
                           "&nbsp;&nbsp;&nbsp;&nbsp;};<br>" + 
                           "};<br>" + 
                           "for (i = 0; i < 4; i = i+1) {<br>" + 
                           "&nbsp;&nbsp;&nbsp;&nbsp;while (hacknetnodes[i].cores < 2) {<br>" + 
                           "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;hacknetnodes[i].upgradeCore();<br>" + 
                           "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sleep(10000);<br>" + 
                           "&nbsp;&nbsp;&nbsp;&nbsp;};<br>" + 
                           "};<br><br>" + 
                           "<u><h1>While loops </h1></u><br>" +
                           "A while loop is a control flow statement that repeatedly executes code as long as a condition is met. <br><br> " +
                           "<i>while (<i>[cond]</i>) {<br>&nbsp;&nbsp;&nbsp;&nbsp;<i>[code]</i><br>}</i><br><br>" + 
                           "As long as <i>[cond]</i> remains true, the code block <i>[code]</i> will continuously execute. Example: <br><br>" + 
                           "<i>i = 0; <br> while (i < 10) { <br>&nbsp;&nbsp;&nbsp;&nbsp;hack('foodnstuff');<br>&nbsp;&nbsp;&nbsp;&nbsp;i = i + 1;<br> }; </i><br><br>" + 
                           "This code above repeats the 'hack('foodnstuff')' command 10 times before it stops and exits. <br><br>" + 
                           "<i>while(true) { <br>&nbsp;&nbsp;&nbsp;&nbsp; hack('foodnstuff'); <br> }; </i><br><br> " + 
                           "This while loop above is an infinite loop (continuously runs until the script is manually stopped) that repeatedly runs the 'hack('foodnstuff')' command. " +
                           "Note that a semicolon is needed at closing bracket of the while loop, UNLESS it is at the end of the code<br><br> " + 
                           "<u><h1>For loops</h1></u><br>" + 
                           "A for loop is another control flow statement that allows code to be repeated by iterations. The structure is: <br><br> " +
                           "<i>for (<i>[init]</i>; <i>[cond]</i>; <i>[post]</i>) {<br>&nbsp;&nbsp;&nbsp;&nbsp;<i>code</i> <br> }; </i><br><br>" + 
                           "The <i>[init]</i> expression evaluates before the for loop begins. The for loop will continue to execute " +
                           "as long as <i>[cond]</i> is met. The <i>[post]</i> expression will evaluate at the end of every iteration " + 
                           "of the for loop. The following example shows code that will run the 'hack('foodnstuff');' command 10 times " +
                           " using a for loop: <br><br>" + 
                           "<i>for (i = 0; i < 10; i = i+1) { <br>&nbsp;&nbsp;&nbsp;&nbsp;hack('foodnstuff');<br>}; </i><br><br>" + 
                           "<u><h1> If statements </h1></u><br>" + 
                           "If/Elif/Else statements are conditional statements used to perform different actions based on different conditions: <br><br>" + 
                           "<i>if (condition1) {<br>&nbsp;&nbsp;&nbsp;&nbsp;code1<br>} elif (condition2) {<br>&nbsp;&nbsp;&nbsp;&nbsp;code2<br>} else {<br>" + 
                           "&nbsp;&nbsp;&nbsp;&nbsp;code3<br>}</i><br><br>" + 
                           "In the code above, first <i>condition1</i> will be checked. If this condition is true, then <i>code1</i> will execute and the " +
                           "rest of the if/elif/else statement will be skipped. If <i>condition1</i> is NOT true, then the code will then go on to check " + 
                           "<i>condition2</i>. If <i>condition2</i> is true, then <i>code2</i> will be executed, and the rest of the if/elif/else statement " +
                           "will be skipped. If none of the conditions are true, then the code within the else block (<i>code3</i>) will be executed. " + 
                           "Note that a conditional statement can have any number of elif statements. <br><br>" + 
                           "Example: <br><br>" + 
                           "if(getServerMoneyAvailable('foodnstuff') > 200000) {<br>&nbsp;&nbsp;&nbsp;&nbsp;hack('foodnstuff');<br>" + 
                           "} else {<br>&nbsp;&nbsp;&nbsp;&nbsp;grow('foodnstuff');<br>};<br><br>" + 
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
    TutorialJobsText: "Hacking is not the only way to gain money and experience! Located around the world are many " + 
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
                      "you applied for the job originally. Higher positions at a company provide better salaries and stat gains.",
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
                               "genetic to biological. Acquiring these Augmentations enhances the user's physical and mental faculties. <br>" + 
                               "Because of how powerful these Augmentations are, the technology behind them is kept private and secret by the " + 
                               "corporations and organizations that create them. Therefore, the only way for the player to obtain Augmentations is " + 
                               "through Factions. After joining a Faction and earning enough reputation in it, you will be able to purchase " + 
                               "its Augmentations. Different Factions offer different Augmentations. Augmentations must be purchased in order to be installed, " + 
                               "and they are fairly expensive. <br><br>" +
                               "Unfortunately, installing an Augmentation has side effects. You will lose most of the progress you've made, including your " + 
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
                               "TOR router<br><br>" + 
                               "Here is everything you will KEEP when you install an Augmentation: <br><br>" + 
                               "Every Augmentation you have installed<br>"  +
                               "Scripts on your home computer<br>" + 
                               "RAM Upgrades on your home computer",
	
}