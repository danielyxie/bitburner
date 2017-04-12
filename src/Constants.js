CONSTANTS = {
	//Max level for any skill. Determined by max numerical value in javascript and the skill level
	//formula in Player.js
	MaxSkillLevel: 			975,
    
    //How much reputation is needed to join a megacorporation's faction
    CorpFactionRepRequirement: 250000,
	
    
    /* Script related things */
	//Time (ms) it takes to run one operation in Netscript.  
	CodeInstructionRunTime:	1500, 
	
	//Time (seconds) it takes to run one operation in Netscript OFFLINE
	CodeOfflineExecutionTime: 10,
    
    //Maximum number of log entries for a script
    MaxLogCapacity: 20,
    
    //Programs
    NukeProgram: "NUKE.exe",
    BruteSSHProgram: "BruteSSH.exe",
    FTPCrackProgram: "FTPCrack.exe",
    RelaySMTPProgram: "relaySMTP.exe",
    HTTPWormProgram: "HTTPWorm.exe",
    SQLInjectProgram: "SQLInject.exe",
    
    //Text that is displayed when the 'help' command is ran in Terminal
    HelpText:   "analyze                Get statistics and information about current machine <br>" + 
                "clear                  Clear all text on the terminal <br>" +
                "cls                    See 'clear' command <br>" +
                "connect [ip/hostname]  Connects to the machine given by its IP or hostname <br>" + 
                "free                   Check the machine's memory (RAM) usage<br>" + 
                "hack                   Hack the current machine<br>" +
                "help                   Display this list<br>" + 
                "hostname               Displays the hostname of the machine<br>" + 
                "ifconfig               Displays the IP address of the machine<br>" +
                "kill [script name]     Stops a script that is running<br>" +
                "ls                     Displays all programs and scripts on the machine<br>" + 
                "nano [script name]     Text editor - Open up and edit a script<br>" + 
                "netstat                Displays all available network connections<br>" +  
                "ps                     Display all scripts that are currently running<br>" + 
                "rm                     Delete a script/program from the machine. (WARNING: Permanent)<br>" + 
                "run [script/program]   Execute a program or a script<br>" + 
                "scan                   See 'netstat' command<br>" +
                "tail [script]          Display script logs (logs contain details about active scripts)"
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
                         "Gaining root access <br>" + 
                         "The key to hacking a server is to gain root access to that server. This can be done using " + 
                         "the NUKE virus (NUKE.exe). You start the game with a copy of the NUKE virus on your home " + 
                         "computer. The NUKE virus attacks the target server's open ports using buffer overflow " + 
                         "exploits. When successful, you are granted root administrative access to the machine. <br>" + 
                         "Typically, in order for the NUKE virus to succeed, the target server needs to have at least " + 
                         "one of its ports opened. Some servers have no security and will not need any ports opened. Some " +
                         "will have very high security and will need many ports opened. In order to open ports on another " + 
                         "server, you will need to run programs that attack the server to open specific ports. These programs " +
                         "can be coded once your hacking skill gets high enough, or they can be purchased if you can find " + 
                         "a seller. <br><br>" 
                         "In order to determine how many ports need to be opened to successfully NUKE a server, connect to " + 
                         "that server and run the 'analyze' command. This will also show you which ports have already been " + 
                         "opened. <br>" +
                         "Once you have enough ports opened and have ran the NUKE virus to gain root access, the server " + 
                         "can then be hacked by simply calling the 'hack' command through terminal, or by using a script.<br><br>" + 
                         "Hacking mechanics <br>" + 
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
                         
    TutorialScriptsText: "Scripts can be used to automate the hacking process. Scripts must be written in the Netscript language " + 
                         "and are saved as a file. Running a script requires RAM. The more complex a script is, the more RAM " + 
                         "it requires to run. Scripts can be run on any server you have root access to. <br><br>" + 
                         "Here are some commands that are useful when working with scripts: <br>" + 
                         "free - Shows the current server's RAM usage <br>" + 
                         "kill [script] - Stops a script that is running <br>" + 
                         "nano [script] - Edit a script <br>" + 
                         "ps - Displays all scripts that are actively running on the current server<br>" + 
                         "run [script] - Run a script <br>" + 
                         "tail [script] - Displays a script's logs<br>" + 
                         "top - Displays all active scripts and their RAM usage <br><br>" + 
                         "The following is a brief overview of how to code in the Netscript language: ",                         
    TutorialTravelingText: "There are SIX major cities in the world that you are able to travel to: <br> "  +
                           "    Aevum<br>" + 
                           "    Chongqing<br>" + 
                           "    
    TutorialJobsText:
    TutorialFactionsText:
    TutorialAugmentationsText:
	
	
	

	
	
}