CONSTANTS = {
    Version:                "0.22.1",
    
	//Max level for any skill, assuming no multipliers. Determined by max numerical value in javascript for experience
    //and the skill level formula in Player.js. Note that all this means it that when experience hits MAX_INT, then
    //the player will have this level assuming no multipliers. Multipliers can cause skills to go above this. 
	MaxSkillLevel: 			975,
    
    //How much reputation is needed to join a megacorporation's faction
    CorpFactionRepRequirement: 250000,
    
    /* Base costs */
    BaseCostFor1GBOfRamHome: 45000,
    BaseCostFor1GBOfRamServer: 55000,     //1 GB of RAM
    BaseCostFor1GBOfRamHacknetNode: 30000,
    
    BaseCostForHacknetNode: 1000,
    BaseCostForHacknetNodeCore: 500000,
    
    /* Hacknet Node constants */
    HacknetNodeMoneyGainPerLevel: 1.55,
    HacknetNodePurchaseNextMult: 1.42,   //Multiplier when purchasing an additional hacknet node
    HacknetNodeUpgradeLevelMult: 1.045,  //Multiplier for cost when upgrading level
    HacknetNodeUpgradeRamMult: 1.28,     //Multiplier for cost when upgrading RAM
    HacknetNodeUpgradeCoreMult: 1.49,    //Multiplier for cost when buying another core
    
    HacknetNodeMaxLevel: 200,
    HacknetNodeMaxRam: 64,
    HacknetNodeMaxCores: 16,
    
    /* Faction and Company favor */
    FactionReputationToFavor: 7500,
    CompanyReputationToFavor: 5000,
    
    /* Augmentation */
    //NeuroFlux Governor cost multiplier as you level up
    NeuroFluxGovernorLevelMult: 1.13,
    
    /* Script related things */
	//Time (ms) it takes to run one operation in Netscript.  
	CodeInstructionRunTime:	200, 
    
    //RAM Costs for different commands
    ScriptWhileRamCost:             0.2,
    ScriptForRamCost:               0.2,
    ScriptIfRamCost:                0.1,
    ScriptHackRamCost:              0.1,
    ScriptGrowRamCost:              0.15,
    ScriptWeakenRamCost:            0.15,
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
    ScriptGetHostnameRamCost:       0.05,
    ScriptGetHackingLevelRamCost:   0.05,
    ScriptGetServerMoneyRamCost:    0.1,
    ScriptGetServerSecurityRamCost: 0.1,
    ScriptGetServerReqdHackRamCost: 0.1,
    ScriptFileExistsRamCost:        0.1,
    ScriptIsRunningRamCost:         0.1,
    ScriptOperatorRamCost:          0.01,
    ScriptPurchaseHacknetRamCost:   1.5,
    ScriptHacknetNodesRamCost:      1.0, //Base cost for accessing hacknet nodes array
    ScriptHNUpgLevelRamCost:        0.4, 
    ScriptHNUpgRamRamCost:          0.6,
    ScriptHNUpgCoreRamCost:         0.8,
    
    MultithreadingRAMCost:          1.002,
    
    //Server constants
    ServerBaseGrowthRate: 1.03,     //Unadjusted Growth rate
    ServerMaxGrowthRate: 1.0045,     //Maximum possible growth rate (max rate accounting for server security)
    ServerFortifyAmount: 0.002,     //Amount by which server's security increases when its hacked/grown
    ServerWeakenAmount: 0.1,        //Amount by which server's security decreases when weakened
    
    //Augmentation Constants
    AugmentationCostMultiplier: 5,  //Used for balancing costs without having to readjust every Augmentation cost
    AugmentationRepMultiplier: 1.5, //Used for balancing rep cost without having to readjust every value
    
    //Maximum number of log entries for a script
    MaxLogCapacity: 50,
    
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
    HelpText:   'alias [name="value"]           Create aliases for Terminal commands, or list existing aliases<br>' + 
                "analyze                        Get statistics and information about current machine <br>" + 
                "cat [message]                  Display a .msg file<br>" + 
                "check [script] [args...]       Print logs to Terminal for the script with the specified name and arguments<br>" + 
                "clear                          Clear all text on the terminal <br>" +
                "cls                            See 'clear' command <br>" +
                "connect [ip/hostname]          Connects to the machine given by its IP or hostname <br>" + 
                "free                           Check the machine's memory (RAM) usage<br>" + 
                "hack                           Hack the current machine<br>" +
                "help                           Display this help text<br>" + 
                "home                           Connect to home computer<br>" + 
                "hostname                       Displays the hostname of the machine<br>" + 
                "ifconfig                       Displays the IP address of the machine<br>" +
                "kill [script] [args...]        Stops a script on the current server with the specified name and arguments<br>" +
                "killall                        Stops all running scripts on the current machine<br>" + 
                "ls                             Displays all programs and scripts on the machine<br>" +
                "mem [script] [-t] [n]          Displays the amount of RAM the script requires to run with n threads<br>" + 
                "nano [script]                  Text editor - Open up and edit a script<br>" + 
                "ps                             Display all scripts that are currently running<br>" + 
                "rm                             Delete a script/program from the machine. (WARNING: Permanent)<br>" + 
                "run [name] [-t] [n] [args...]  Execute a program or a script with n threads and the specified arguments<br>" + 
                "scan                           Displays all available network connections<br>" +
                "scan-analyze [depth]           Displays hacking-related information for all servers up to <i>depth</i> nodes away<br>" + 
                "scp [script] [server]          Copies a script to a destination server (specified by ip or hostname)<br>" + 
                "sudov                          Shows whether or not you have root access on this computer<br>" + 
                "tail [script] [args...]        Display dynamic logs for the script with the specified name and arguments<br>" +
                "theme [preset] | bg txt hlgt   Change the color scheme of the UI<br>" + 
                "top                            Display all running scripts and their RAM usage<br>" + 
                'unalias "[alias name]"         Deletes the specified alias. Double quotation marks are required<br>',
                
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
                         "Each additional thread to a script will slightly increase the RAM usage for that thread. The total cost of running a script with " + 
                         "n threads can be calculated with: <br>" + 
                         "base cost * n * (1.005 ^ n) <br>" + 
                         "where the base cost is the amount of RAM required to run the script with a single thread. In the terminal, you can run the " + 
                         "'mem [scriptname] -t n' command to see how much RAM a script requires with n threads. <br><br>" + 
                         "Every method for running a script has an option for making it multihreaded. To run a script with " + 
                         "n threads from a Terminal: <br>" + 
                         "run [scriptname] -t n<br><br>" + 
                         "Using Netscript commands: <br>" + 
                         "run('scriptname.script', m);<br> " +
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
                           "<u><h1> Arrays </h1></u><br>" + 
                           "Arrays are special container objects. Arrays can hold many values under a single name. Each value in the array " + 
                           "can be accessed using an index number. The following example shows how to declare an array: <br><br>" + 
                           "thisIsAnArray = Array[1, 2, 3, 'bitburner!', false];<br><br>" +
                           "Note that the values in an array can be different types. To access this array we just declared, we can use the index " + 
                           "operator on the array's name: <br><br>" + 
                           "print(thisIsAnArray[0]); <br>" + 
                           "thisIsAnArray[1] = 5;<br>" +
                           "thisIsAnArray[3] = 'string concatenation ' + 123;<br><br>" + 
                           "Note that arrays are indexed starting at index 0. Using an index that is too large or less than 0 will result in an " + 
                           "out of bounds runtime error. <br><br>" + 
                           "If an element in an array is assigned to a value that includes a variable, then it holds a reference to that variable. " + 
                           "What this means is that if the variable changes, the array element will also change accordingly. For example:<br><br>" + 
                           "x = 10;<br>testArr = Array[x];<br>print(testArr[0]);<br>x = 20;<br>print(testArr[0]);<br><br>" + 
                           "This code will print: <br><br>10<br>20<br><br>" + 
                           "<strong>Array functions</strong><br>" + 
                           "Arrays have built-in functions/properties that can be used to more easily access and manipulate the containers. <br><br>"+
                           "<i>length/length()</i><br>Returns the number of elements in the array.<br>" + 
                           "The example below will print out 5:<br><br>" + 
                           "arr = Array[1, 2, 3, 4, 5];<br>print(arr.length);<br><br>" + 
                           "<i>clear/clear()</i><br>Removes all elements from the array.<br>" + 
                           "The example below creates an array with three strings and then uses clear to remove all of those strings. The result is that 'arr' will be " +
                           "an empty array.<br><br>" + 
                           "arr = Array['str1', 'str2', 'str3'];<br>arr.clear();<br><br>" +
                           "<i>push(e)</i><br>Adds the element e to the end of the array.<br>" + 
                           "The example below will create an array holding one element: the number 1. It will then push the number 2 onto the array. The result " + 
                           "is that 'arr' will be an array of size 2 with arr[0] == 1 and arr[1] == 2<br><br>" + 
                           "arr = Array[1];<br>arr.push(2);<br><br>" + 
                           "<i>insert(e)</i><br>Inserts an element e into an array at a specified index. Every element in the array that is at or after " + 
                           "the specified index is shifted down. The array must be indexed with the [] operator when using this function.<br>" + 
                           "The following example will insert the number 2 into index 1 of the array. The result afterwards is that 'arr' will hold the values [1, 2, 3, 4].<br><br>" + 
                           "arr = Array[1, 3, 4];<br>arr[1].insert(2);<br><br>" +
                           "<i>remove()</i><br>Removes an element from a specified index. Every element in the array that is after the specified index " + 
                           "will be shifted up. The array must be indexed with the [] operator when using this function.<br>" + 
                           "The following example will remove the first element of the array. The result afterwards is that 'arr' will hold the values [2, 3].<br><br>" + 
                           "arr = Array[1, 2, 3];<br>arr[0].remove();<br><br>" + 
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
                           "<i>sleep(n)</i><br>Suspends the script for n milliseconds. <br>Example: sleep(5000);<br><br>" + 
                           "<i>grow(hostname/ip)</i><br>Use your hacking skills to increase the amount of money available on a server. The argument passed in " + 
                           "must be a string with either the IP or hostname of the target server. The runtime for this command depends on your hacking level and the target server's security level. " +
                           "When grow() completes, the money available on a target server will be increased by a certain, fixed percentage. This percentage " + 
                           "is determined by the server's growth rate and varies between servers. Generally, higher-level servers have higher growth rates. <br><br> " + 
                           "Like hack(), grow() can be called on any server, regardless of where the script is running. " + 
                           "The grow() command requires root access to the target server, but there is no required hacking level to run the command. " + 
                           "It grants 0.5 hacking exp when it completes. It also raises the security level of the target server by 0.004. " +
                           "Returns the number by which the money on the server was multiplied for the growth. " + 
                           "Works offline at a slower rate. <br> Example: grow('foodnstuff');<br><br>" + 
                           "<i>weaken(hostname/ip)</i><br>Use your hacking skills to attack a server's security, lowering the server's security level. The argument passed " + 
                           "in must be a string with either the IP or hostname of the target server. The runtime for this command depends on your " + 
                           "hacking level and the target server's security level. This function lowers the security level of the target server by " + 
                           "0.1.<br><br> Like hack() and grow(), weaken() can be called on " + 
                           "any server, regardless of where the script is running. This command requires root access to the target server, but " + 
                           "there is no required hacking level to run the command. Grants 3 hacking exp when it completes. Returns " + 
                           "0.1. Works offline at a slower rate<br> Example: weaken('foodnstuff');<br><br>" + 
                           "<i>print(x)</i> <br> Prints a value or a variable to the scripts logs (which can be viewed with the 'tail [script]' terminal command ). <br>" + 
                           "WARNING: Do NOT call print() on an array. The script will crash. You can, however, call print on single elements of an array. For example, if " + 
                           "the variable 'a' is an array, then do NOT call print(a), but it is okay to call print(a[0]).<br><br>" + 
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
                           "<i>getServerSecurityLevel(hostname/ip)</i><br>Returns the security level of a server. The argument passed in must be a string with either the " + 
                           "hostname or IP of the target server. A server's security is denoted by a number between 1 and 100. Does NOT work while offline.<br><br>" + 
                           "<i>getServerBaseSecurityLevel(hostname/ip)</i><br> Returns the base security level of a server. This is the security level that the server starts out with. " + 
                           "This is different than getServerSecurityLevel() because getServerSecurityLevel() returns the current security level of a server, which can constantly change " + 
                           "due to hack(), grow(), and weaken() calls on that server. The base security level will stay the same until you reset by installing an Augmentation. <br><br>" + 
                           "The argument passed in must be a string with either the hostname or IP of the target server. A server's base security is denoted by a number between 1 and 100. " +
                           "Does NOT work while offline.<br><br>" + 
                           "<i>getServerRequiredHackingLevel(hostname/ip)</i><br> Returns the required hacking level of a server. The argument passed in must be a string with either the " + 
                           "hostname or IP or the target server. Does NOT work while offline <br><br>" + 
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
                               
    Changelog:
    "v0.22.1<br>" + 
    "-You no longer lose progress on creating programs when cancelling your work. Your progress will be saved and you will pick up " + 
    "where you left off when you start working on it again<br>" + 
    "-Added two new programs: AutoLink.exe and ServerProfiler.exe<br>" +
    "-Fixed bug with Faction Field work reputation gain<br><br>" + 
    "v0.22.0 - Major rebalancing, optimization, and favor system<br>" + 
    "-Significantly nerfed most augmentations<br>" + 
    "-Almost every server with a required hacking level of 200 or more now has slightly randomized server parameters. This means that after every Augmentation " + 
    "purchase, the required hacking level, base security level, and growth factor of these servers will all be slightly different<br>" + 
    "-The hacking speed multiplier now increases rather than decreases. The hacking time is now divided by your hacking speed " + 
    "multiplier rather than multiplied. In other words, a higher hacking speed multiplier is better<br>" + 
    "-Servers now have a minimum server security, which is approximately one third of their starting ('base') server security<br>" + 
    "-If you do not steal any money from a server, then you gain hacking experience equal to the amount you would have gained " + 
    "had you failed the hack<br>" + 
    "-The effects of grow() were increased by 50%<br>" + 
    "-grow() and weaken() now give hacking experience based on the server's base security level, rather than a flat exp amount<br>" + 
    "-Slightly reduced amount of exp gained from hack(), weaken(), and grow()<br>" +
    "-Rebalanced formulas that determine crime success<br>" + 
    "-Reduced RAM cost for multithreading a script. The RAM multiplier for each thread was reduced from 1.02 to 1.005<br>" + 
    "-Optimized Script objects so they take less space in the save file<br>" + 
    "-Added getServerBaseSecurityLevel() Netscript function<br>" + 
    "-New favor system for companies and factions. Earning reputation at a company/faction will give you favor for that entity when you " + 
    "reset after installing an Augmentation. This favor persists through the rest of the game. The more favor you have, the faster you will earn " + 
    "reputation with that faction/company<br>" + 
    "-You can no longer donate to a faction for reputation until you have 150 favor with that faction<br>" + 
    "-Added unalias Terminal command<br>" + 
    "-Changed requirements for endgame Factions<br><br>" + 
    "v0.21.1<br>" + 
    "-IF YOUR GAME BREAKS, DO THE FOLLOWING: Options -> Soft Reset -> Save Game -> Reload Page. Sorry about that! <br>" + 
    "-Autocompletion for aliases - courtesy of Github user LTCNugget<br><br>" + 
    "v0.21.0<br>" + 
    "-Added dynamic arrays. See Netscript documentation<br>" + 
    "-Added ability to pass arguments into scripts. See documentation<br>" + 
    "-The implementation/function signature of functions that deal with scripts have changed. Therefore, some old scripts might not " + 
    "work anymore. Some of these functions include run(), exec(), isRunning(), kill(), and some others I may have forgot about. " + 
    "Please check the updated Netscript documentation if you run into issues." + 
    "-Note that scripts are now uniquely identified by the script name and their arguments. For example, you can run " + 
    "a script using <br>run foodnstuff.script 1<br> and you can also run the same script with a different argument " + 
    "<br>run foodnstuff.script 2<br>These will be considered two different scripts. To kill the first script you must " + 
    "run <br>kill foodnstuff.script 1<br> and to kill the second you must run <br>kill foodnstuff.script 2<br> Similar concepts " + 
    "apply for Terminal Commands such as tail, and Netscript commands such as run(), exec(), kill(), isRunning(), etc.<br>" + 
    "-Added basic theme functionality using the 'theme' Terminal command - All credit goes to /u/0x726564646974 who implemented the awesome feature<br>" + 
    "-Optimized Script objects, which were causing save errors when the player had too many scripts<br>" + 
    "-Formula for determining exp gained from hacking was changed<br>" + 
    "-Fixed bug where you could purchase Darkweb items without TOR router<br>" + 
    "-Slightly increased cost multiplier for Home Computer RAM<br>" +
    "-Fixed bug where you could hack too much money from a server (and bring its money available below zero)<br>" + 
    "-Changed tail command so that it brings up a display box with dynamic log contents. To get " + 
    "old functionality where the logs are printed to the Terminal, use the new 'check' command<br>" + 
    "-As a result of the change above, you can no longer call tail/check on scripts that are not running<br>" + 
    "-Added autocompletion for buying Programs in Darkweb<br>" + 
    "v0.20.2<br>" + 
    "-Fixed several small bugs<br>" + 
    "-Added basic array functionality to Netscript<br>" + 
    "-Added ability to run scripts with multiple threads. Running a script with n threads will multiply the effects of all " + 
    "hack(), grow(), and weaken() commands by n. However, running a script with multiple threads has drawbacks in terms of " + 
    "RAM usage. A script's ram usage when it is 'multithreaded' is calculated as: base cost * numThreads * (1.02 ^ numThreads). " + 
    "A script can be run multithreaded using the 'run [script] -t n' Terminal command or by passing in an argument to the " + 
    "run() and exec() Netscript commands. See documentation.<br>" + 
    "-RAM is slightly (~10%) more expensive (affects purchasing server and upgrading RAM on home computer)<br>" + 
    "-NeuroFlux Governor augmentation cost multiplier decreased<br>" + 
    "-Netscript default operation runtime lowered to 200ms (was 500ms previously)<br><br>" + 
    "v0.20.1<br>" + 
    "-Fixed bug where sometimes scripts would crash without showing the error<br>" + 
    "-Added Deepscan programs to Dark Web<br>" + 
    "-Declining a faction invite will stop you from receiving invitations from that faction for the rest of the run<br>" + 
    "-(BETA) Added functionality to export/import saves. WARNING This is only lightly tested. You cannot choose where to save your file " + 
    "it just goes to the default save location. Also I have no idea what will happen if you try to import a file " + 
    "that is not a valid save. I will address these in later updates<br><br>" + 
    "v0.20.0<br>" + 
    "-Refactored Netscript Interpreter code. Operations in Netscript should now run significantly faster (Every operation " + 
    "such as a variable assignment, a function call, a binary operator, getting a variable's value, etc. used to take up to several seconds, " + 
    "now each one should only take ~500 milliseconds). <br><br>" +
    "-Percentage money stolen when hacking lowered to compensate for faster script speeds<br><br>" + 
    "-Hacking experience granted by grow() halved<br><br>" + 
    "-Weaken() is now ~11% faster, but only grants 3 base hacking exp upon completion instead of 5 <br><br>" + 
    "-Rebalancing of script RAM costs. Base RAM Cost for a script increased from 1GB to 1.5GB. Loops, hack(), grow() " + 
    "and weaken() all cost slightly less RAM than before <br><br>" + 
    "-Added getServerRequiredHackingLevel(server) Netscript command. <br><br>" + 
    "-Added fileExists(file, [server]) Netscript command, which is used to check if a script/program exists on a " +
    "specified server<br><br>" + 
    "-Added isRunning(script, [server]) Netscript command, which is used to check if a script is running on the specified server<br><br>" + 
    "-Added killall Terminal command. Kills all running scripts on the current machine<br><br>" +
    "-Added kill() and killall() Netscript commands. Used to kill scripts on specified machines. See Netscript documentation<br><br>" + 
    "-Re-designed 'Active Scripts' tab<br><br>" + 
    "-Hacknet Node base production rate lowered from 1.6 to 1.55 ($/second)<br><br>" +
    "-Increased monetary cost of RAM (Upgrading home computer and purchasing servers will now be more expensive)<br><br>" + 
    "-NEW GROWTH MECHANICS - The rate of growth on a server now depends on a server's security level. A higher security level " +
    "will result in lower growth on a server when using the grow() command. Furthermore, calling grow() on a server raises that " + 
    "server's security level by 0.004. For reference, if a server has a security level of 10 " + 
    "it will have approximately the same growth rate as before. <br><br>" + 
    "-Server growth no longer happens naturally<br><br>" + 
    "-Servers now have a maximum limit to their money. This limit is 50 times it's starting money<br><br>" + 
    "-Hacking now grants 10% less hacking experience<br><br>" + 
    "-You can now edit scripts that are running<br><br>" +
    "-Augmentations cost ~11% more money and 25% more faction reputation<br><br>" + 
    "v0.19.7<br>" + 
    "-Added changelog to Options menu<br>" + 
    "-Bug fix with autocompletion (wasn't working properly for capitalized filenames/programs<br><br>" + 
    "v0.19.6<br>" + 
    "-Script editor now saves its state even when you change tabs <br>" + 
    "-scp() command in Terminal/script will now overwrite files at the destination <br>" + 
    "-Terminal commands are no longer case-sensitive (only the commands themselves such as 'run' or 'nano'. Filenames are " + 
    "still case sensitive<br>" + 
    "-Tab automcompletion will now work on commands<br><br>" + 
    "v0.19<br>" + 
    "-Hacknet Nodes have slightly higher base production, and slightly increased RAM multiplier. " + 
    "But they are also a bit more expensive at higher levels<br>" + 
    "-Calling grow() and weaken() in a script will now work offline, at slower rates than while online (The script now " + 
    "keeps track of the rate at which grow() and weaken() are called when the game is open. These calculated rates " + 
    "are used to determine how many times the calls would be made while the game is offline)<br>" + 
    "-Augmentations now cost 20% more reputation and 50% more money<br>" + 
    "-Changed the mechanic for getting invited to the hacking factions (CyberSec, NiteSec, The Black Hand, BitRunners) " + 
    "Now when you get to the required level to join these factions you will get a message giving " + 
    "you instructions on what to do in order to get invited.<br>" + 
    "-Added a bit of backstory/plot into the game. It's not fully fleshed out yet but it will be " + 
    "used in the future<br>" + 
    "-Made the effects of many Augmentations slightly more powerful<br>" + 
    "-Slightly increased company job wages across the board (~5-10% for each position)<br>" + 
    "-Gyms and classes are now significantly more expensive<br>" + 
    "-Doubled the amount by which a server's security increases when it is hacked. Now, it will " + 
    "increase by 0.002. Calling weaken() on a server will lower the security by 0.1.<br><br>" + 
    "v0.18<br>" + 
    "-Major rebalancing (sorry didn't record specifics. But in general hacking gives more money " + 
    "and hacknet nodes give less)<br>" + 
    "-Server growth rate (both natural and manual using grow()) doubled<br>" + 
    "-Added option to Soft Reset<br>" + 
    "-Cancelling a full time job early now only results in halved gains for reputation. Exp and money earnings are gained in full<br>" + 
    "-Added exec() Netscript command, used to run scripts on other servers. <br>" + 
    "-NEW HACKING MECHANICS: Whenever a server is hacked, its 'security level' is increased by a very small amount. " + 
    "The security level is denoted by a number between 1-100. A higher security level makes it harder " + 
    "to hack a server and also decreases the amount of money you steal from it. Two Netscript functions, " + 
    "weaken() and getServerSecurityLevel() level, were added. The weaken(server) function lowers a server's " + 
    "security level. See the Netscript documentation for more details<br>" + 
    "-When donating to factions, the base rate is now $1,000,000 for 1 reputation point. Before, it was " + 
    "$1,000 for 1 reputation point.<br>" + 
    "-Monetary costs for all Augmentations increased. They are now about ~3.3 - 3.75 times more expensive than before<br><br>" + 
    "v0.17.1 <br>" + 
    "-Fixed issue with purchasing Augmentations that are 'upgrades' and require previous Augmentations to be installed<br>" + 
    "-Increased the percentage of money stolen from servers when hacking<br><br>" + 
    "v0.17<br>" + 
    "-Greatly increased amount of money gained for crimes (by about 400% for most crimes)<br>" + 
    "-Criminal factions require slightly less negative karma to get invited to<br>" + 
    "-Increased the percentage of money stolen from servers when hacking<br>" + 
    "-Increased the starting amount of money available on beginning servers (servers with <50 required hacking))<br>" + 
    "-Increased the growth rate of servers (both naturally and manually when using the grow() command in a script)<br>" + 
    "-Added getHostname() command in Netscript that returns the hostname of the server a script is running on<br>" + 
    "-jQuery preventDefault() called when pressing ctrl+b in script editor<br>" + 
    "-The Neuroflux Governor augmentation (the one that can be repeatedly leveled up) now increases ALL multipliers by 1%. To balance it out, it's price multiplier when it levels up was increased<br>" + 
    "-Hacknet Node base production decreased from $1.75/s to $1.65/s<br>" + 
    "-Fixed issue with nested for loops in Netscript (stupid Javascript references)<br>" + 
    "-Added 'scp' command to Terminal and Netscript<br>" + 
    "-Slightly nerfed Hacknet Node Kernel DNI and Hacknet Node Core DNI Augmentations<br>" + 
    "-Increased TOR Router cost to $200k<br><br>" + 
    "v0.16<br>" + 
    "-New Script Editor interface <br>" + 
    "-Rebalanced hacknet node - Increased base production but halved the multiplier from additional cores. This should boost its early-game production but nerf its late-game production<br>" + 
    "-Player now starts with 8GB of RAM on home computer<br>" + 
    "-'scan-analyze' terminal command displays RAM on servers<br>" + 
    "-Slightly buffed the amount of money the player steals when hacking servers (by about ~8%)<br>" + 
    "-Time to execute grow() now depends on hacking skill and server security, rather than taking a flat 2 minutes.<br>" + 
    "-Clicking outside of a pop-up dialog box will now close it<br>" + 
    "-BruteSSH.exe takes 33% less time to create<br>" + 
    "-'iron-gym' and 'max-hardware' servers now have 2GB of RAM<br>" + 
    "-Buffed job salaries across the board<br>" + 
    "-Updated Tutorial<br>" + 
    "-Created a Hacknet Node API for Netscript that allows you to access and upgrade your Hacknet Nodes. See the Netscript documentation for more details. WARNING The old upgradeHacknetNode() and getNumHacknetNodes() functions waere removed so any script that has these will no longer work <br><br>" + 
    "v0.15 <br>" + 
    "-Slightly reduced production multiplier for Hacknet Node RAM<br>" + 
    "-Faction pages now scroll<br>" + 
    "-Slightly increased amount of money gained from hacking<br>" + 
    "-Added 'alias' command<br>" + 
    "-Added 'scan-analyze' terminal command - used to get basic hacking info about all immediate network connections<br>" + 
    "-Fixed bugs with upgradeHacknetNode() and purchaseHacknetNode() commands<br>" + 
    "-Added getNumHacknetNodes() and hasRootAccess(hostname/ip) commands to Netscript<br>" + 
    "-Increased Cost of university classes/gym<br>" + 
    "-You can now see what an Augmentation does and its price even while its locked<br><br>",
    
    LatestUpdate: 
    "v0.22.1<br>" + 
    "-You no longer lose progress on creating programs when cancelling your work. Your progress will be saved and you will pick up " + 
    "where you left off when you start working on it again<br>" + 
    "-Added two new programs: AutoLink.exe and ServerProfiler.exe<br>" +
    "-Fixed bug with Faction Field work reputation gain<br><br>" + 
    "v0.22.0 - Major rebalancing, optimization, and favor system<br>" + 
    "-Significantly nerfed most augmentations<br>" + 
    "-Almost every server with a required hacking level of 200 or more now has slightly randomized server parameters. This means that after every Augmentation " + 
    "purchase, the required hacking level, base security level, and growth factor of these servers will all be slightly different<br>" + 
    "-The hacking speed multiplier now increases rather than decreases. The hacking time is now divided by your hacking speed " + 
    "multiplier rather than multiplied. In other words, a higher hacking speed multiplier is better<br>" + 
    "-Servers now have a minimum server security, which is approximately one third of their starting ('base') server security<br>" + 
    "-If you do not steal any money from a server, then you gain hacking experience equal to the amount you would have gained " + 
    "had you failed the hack<br>" + 
    "-The effects of grow() were increased by 50%<br>" + 
    "-grow() and weaken() now give hacking experience based on the server's base security level, rather than a flat exp amount<br>" + 
    "-Slightly reduced amount of exp gained from hack(), weaken(), and grow()<br>" +
    "-Rebalanced formulas that determine crime success<br>" + 
    "-Reduced RAM cost for multithreading a script. The RAM multiplier for each thread was reduced from 1.02 to 1.005<br>" + 
    "-Optimized Script objects so they take less space in the save file<br>" + 
    "-Added getServerBaseSecurityLevel() Netscript function<br>" + 
    "-New favor system for companies and factions. Earning reputation at a company/faction will give you favor for that entity when you " + 
    "reset after installing an Augmentation. This favor persists through the rest of the game. The more favor you have, the faster you will earn " + 
    "reputation with that faction/company<br>" + 
    "-You can no longer donate to a faction for reputation until you have 150 favor with that faction<br>" + 
    "-Added unalias Terminal command<br>" + 
    "-Changed requirements for endgame Factions<br>",
}
