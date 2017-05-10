CONSTANTS = {
    Version:                "0.1",
    
	//Max level for any skill, assuming no multipliers. Determined by max numerical value in javascript for experience
    //and the skill level formula in Player.js. Note that all this means it that when experience hits MAX_INT, then
    //the player will have this level assuming no multipliers. Multipliers can cause skills to go above this. 
	MaxSkillLevel: 			975,
    
    //How much reputation is needed to join a megacorporation's faction
    CorpFactionRepRequirement: 250000,
    
    /* Base costs */
    BaseCostFor1GBOfRamHome: 100000,
    BaseCostFor1GBOfRamServer: 75000,     //1 GB of RAM
    BaseCostFor1GBOfRamHacknetNode: 50000,
    
    BaseCostForHacknetNode: 1000,
    BaseCostForHacknetNodeCore: 1000000,
    
    /* Hacknet Node constants */
    HacknetNodeMoneyGainPerLevel: 1,
    HacknetNodePurchaseNextMult: 1.35,   //Multiplier when purchasing an additional hacknet node
    HacknetNodeUpgradeLevelMult: 1.06,  //Multiplier for cost when upgrading level
    HacknetNodeUpgradeRamMult: 1.25,     //Multiplier for cost when upgrading RAM
    HacknetNodeUpgradeCoreMult: 1.45,    //Multiplier for cost when buying another core
    
    /* Augmentation */
    //NeuroFlux Governor cost multiplier as you level up
    NeuroFluxGovernorLevelMult: 1.09,
	
    /* Script related things */
	//Time (ms) it takes to run one operation in Netscript.  
	CodeInstructionRunTime:	1500, 
	
	//Time (seconds) it takes to run one operation in Netscript OFFLINE
	CodeOfflineExecutionTime: 10,
    
    //Server growth rate
    ServerGrowthRate: 1.00075,
    
    //Maximum number of log entries for a script
    MaxLogCapacity: 20,
    
    //How much a TOR router costs
    TorRouterCost: 100000,
    
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
    
    ClassDataStructuresBaseCost: 1,
    ClassNetworksBaseCost: 5,
    ClassAlgorithmsBaseCost: 20,
    ClassManagementBaseCost: 10,
    ClassLeadershipBaseCost: 20,
    ClassGymBaseCost: 15,
    
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
    HelpText:   "analyze                Get statistics and information about current machine <br>" + 
                "clear                  Clear all text on the terminal <br>" +
                "cls                    See 'clear' command <br>" +
                "connect [ip/hostname]  Connects to the machine given by its IP or hostname <br>" + 
                "free                   Check the machine's memory (RAM) usage<br>" + 
                "hack                   Hack the current machine<br>" +
                "help                   Display this help text<br>" + 
                "home                   Connect to home computer<br>" + 
                "hostname               Displays the hostname of the machine<br>" + 
                "ifconfig               Displays the IP address of the machine<br>" +
                "kill [script name]     Stops a script that is running on the current machine<br>" +
                "ls                     Displays all programs and scripts on the machine<br>" + 
                "nano [script name]     Text editor - Open up and edit a script<br>" + 
                "netstat                Displays all available network connections<br>" +  
                "ps                     Display all scripts that are currently running<br>" + 
                "rm                     Delete a script/program from the machine. (WARNING: Permanent)<br>" + 
                "run [script/program]   Execute a program or a script<br>" + 
                "scan                   See 'netstat' command<br>" +
                "sudov                  Shows whether or not you have root access on this computer<br>" + 
                "tail [script]          Display script logs (logs contain details about active scripts)" +
                "telnet [ip/hostname]   See 'connect' command<br>" +
                "top                    Display all running scripts and their RAM usage<br>",
                
    /* Tutorial related things */
	TutorialGettingStartedText: "Todo...",
    
    TutorialNetworkingText: "Servers are a central part of the game. You start with a single personal server (your home computer) " + 
                            "and you can purchase additional servers as you progress through the game. Connecting to other servers " + 
                            "and hacking them can be a major source of income and experience. Servers can also be used to run " + 
                            "scripts which can automatically hack servers for you. <br><br>" + 
                            "In order to navigate between machines, use the 'scan' or 'netstat' commands to see all servers " +
                            "that are reachable from your current server. Then, you can use the 'connect [hostname/ip]' or " + 
                            "'telnet [hostname/ip]' commands to connect to one of the available machines. <br><br>" + 
                            "The 'hostname' and 'ifconfig' commands can be used to display the hostname/IP of the " +
                            "server you are currently connected to.",
                            
    TutorialHackingText: "In the year 2077, currency has become digital and decentralized. People and corporations " + 
                         "store their money on servers. By hacking these servers, you can steal their money and gain " + 
                         "experience. <br><br>" + 
                         "<strong>Gaining root access</strong> <br>" + 
                         "The key to hacking a server is to gain root access to that server. This can be done using " + 
                         "the NUKE virus (NUKE.exe). You start the game with a copy of the NUKE virus on your home " + 
                         "computer. The NUKE virus attacks the target server's open ports using buffer overflow " + 
                         "exploits. When successful, you are granted root administrative access to the machine. <br>" + 
                         "Typically, in order for the NUKE virus to succeed, the target server needs to have at least " + 
                         "one of its ports opened. Some servers have no security and will not need any ports opened. Some " +
                         "will have very high security and will need many ports opened. In order to open ports on another " + 
                         "server, you will need to run programs that attack the server to open specific ports. These programs " +
                         "can be coded once your hacking skill gets high enough, or they can be purchased if you can find " + 
                         "a seller. <br><br>" +
                         "In order to determine how many ports need to be opened to successfully NUKE a server, connect to " + 
                         "that server and run the 'analyze' command. This will also show you which ports have already been " + 
                         "opened. <br>" +
                         "Once you have enough ports opened and have ran the NUKE virus to gain root access, the server " + 
                         "can then be hacked by simply calling the 'hack' command through terminal, or by using a script.<br><br>" + 
                         "<strong>Hacking mechanics</strong><br>" + 
                         "When you execute the hack command, either manually through the terminal or automatically through " + 
                         "a script, you attempt to hack the server. This action takes time. The more advanced a server's " + 
                         "security is, the more time it will take. Your hacking skill level also affects the hacking time, " + 
                         "with a higher hacking skill leading to shorter hacking times. Also, running the hack command " + 
                         "manually through terminal is faster than hacking from a script. <br>" + 
                         "Your attempt to hack a server will not always succeed. The chance you have to successfully hack a " + 
                         "server is also determined by the server's security and your hacking skill level. Even if your " + 
                         "hacking attempt is unsuccessful, you will still gain experience points. <br>" + 
                         "When you successfully hack a server. You steal a certain percentage of that server's total money. This " + 
                         "percentage is determined by the server's security and your hacking skill level. The amount of money " + 
                         "on a server is not limitless. So, if you constantly hack a server and deplete its money, then you will " +
                         "encounter diminishing returns in your hacking (since you are only hacking a certain percentage). A server " + 
                         "will regain money at a slow rate over time. ",
                         
    TutorialScriptsText: "Scripts can be used to automate the hacking process. Scripts must be written in the Netscript language. " + 
                         "Documentation about the Netscript language can be found in the 'Netscript Programming Language' " + 
                         "section of this 'Tutorial' page. <br><br>Running a script requires RAM. The more complex a script is, the more RAM " + 
                         "it requires to run. Scripts can be run on any server you have root access to. <br><br>" + 
                         "Here are some Terminal commands that are useful when working with scripts: <br>" + 
                         "free - Shows the current server's RAM usage <br>" + 
                         "kill [script] - Stops a script that is running <br>" + 
                         "nano [script] - Create/Edit a script <br>" + 
                         "ps - Displays all scripts that are actively running on the current server<br>" + 
                         "run [script] - Run a script <br>" + 
                         "tail [script] - Displays a script's logs<br>" + 
                         "top - Displays all active scripts and their RAM usage <br><br>",
    TutorialNetscriptText: "Netscript is a very simple programming language implemented for this game. The language has " + 
                           "your basic programming constructs and several built-in commands that are used to hack. <br><br>" + 
                           "<strong> Variables and data types </strong><br>" + 
                           "The following data types are supported by Netscript: <br>" + 
                           "numeric - Integers and floats (6, 10.4999)<br>" + 
                           "string - Encapsulated by single or double quotes ('this is a string')<br>" + 
                           "boolean - true or false<br><br>" + 
                           "To create a variable, use the assign (=) operator. The language is not strongly typed. Examples: <br>" + 
                           "i = 5;<br>" + 
                           "s = 'this game is awesome!';<br><br>" + 
                           "In the first example above, we are creating the variable i and assigning it a value of 5. In the second, " +
                           "we are creating the variable s and assigning it the value of a string. Note that all expressions must be " + 
                           "ended with a semicolon. <br><br>" +
                           "<strong> Operators </strong> <br>" + 
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
                           "<strong> Functions </strong><br>" + 
                           "You can NOT define you own functions in Netscript (yet), but there are several built in functions that " +
                           "you may use: <br><br> " + 
                           "<i>hack(hostname/ip)</i><br>Core function that is used to hack servers to steal money and gain hacking experience. The argument passed in must be a string with " +
                           "either the IP or hostname of the server you want to hack. <br>Examples: hack('foodnstuff'); or hack('148.192.0.12');<br><br>" + 
                           "<i>sleep(n)</i><br>Suspends the script for n milliseconds. <br>Example: sleep(5000);<br><br>" + 
                           "<i>grow(hostname/ip)</i><br>Use your hacking skills to increase the amount of money available on a server. The argument passed in " + 
                           "must be a string with either the IP or hostname of the target server. <br> Example: grow('foodnstuff');<br><br>" + 
                           "<strong>While loop </strong><br>" +
                           "A while loop is a control flow statement that repeatedly executes code as long as a condition is met. <br><br> " +
                           "while (<i>[cond]</i>) {<br>&nbsp;&nbsp;&nbsp;&nbsp;<i>[code]</i><br>}<br><br>" + 
                           "As long as <i>[cond]</i> remains true, the code block <i>[code]</i> will continuously execute. Example: <br><br>" + 
                           "i = 0; <br> while (i < 10) { <br>&nbsp;&nbsp;&nbsp;&nbsp;hack('foodnstuff');<br>&nbsp;&nbsp;&nbsp;&nbsp;i = i + 1;<br> }; <br><br>" + 
                           "This code repeat the 'hack('foodnstuff')' command 10 times before it stops and exits. " + 
                           "Note that a semicolon is needed at closing bracket of the while loop, UNLESS it is at the end of the code<br><br> " + 
                           "<strong>For loop</strong><br>" + 
                           "A for loop is another control flow statement that allows code to by repeated by iterations. The structure is: <br><br> " +
                           "for (<i>[init]</i>; <i>[cond]</i>; <i>[post]</i>) {<br>&nbsp;&nbsp;&nbsp;&nbsp;<i>code</i> <br> }<br><br>" + 
                           "The <i>[init]</i> expression evaluates before the for loop begins. The for loop will continue to execute " +
                           "as long as <i>[cond]</i> is met. The <i>[post]</i> expression will evaluate at the end of every iteration " + 
                           "of the for loop. The following example shows code that will do the same thing as the while loop example above, " +
                           "except using a for loop instead: <br><br>" + 
                           "for (i = 0; i < 10; i = i+1) { <br>&nbsp;&nbsp;&nbsp;&nbsp;hack('foodnstuff');<br>}; <br><br><br>",
                           
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
                      "page will have options that let you apply to positions in the company. There might be several different" + 
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
                      "8 hours is up, but doing so will result in you gaining only half of all of the money, experience, and reputation " +
                      "that you had earned up to that point. <br><br>" +
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
                          "when working for a Faction does NOT result in reduced experience/reputation earnings. <br>" + 
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