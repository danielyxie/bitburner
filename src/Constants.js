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
                         "exploits. When successful, you are granted root administrative access to the machine. <br><br>" + 
                         "Typically, in order for the NUKE virus to succeed, the target server needs to have at least " + 
                         "one of its ports opened. Some servers have no security and will not need any ports opened. Some " +
                         "will have very high security and will need many ports opened. In order to open ports on another " + 
                         "server, you will need to run programs that attack the server to open specific ports. These programs " +
                         "can be coded once your hacking skill gets high enough, or they can be purchased if you can find " + 
                         "a seller. <br><br>" 
                         "In order to determine how many ports need to be opened to successfully NUKE a server, connect to " + 
                         "that server and run the 'analyze' command. This will also show you which ports have already been " + 
                         "opened. <br><br>" +
                         "Once you have enough ports opened and have ran the NUKE virus to gain root access, the server " + 
                         "can then be hacked by simply calling the 'hack' command, or by using a script.<br><br>" + 
                         "Hacking mechanics <br>" + 
                         ,
                         
                         //TODO Add stuff about only hacking a percentage and so if you keep hacking a server it'll go down, and 
                         //Hacking percentage
                         
    TutorialScriptsText: "Scripts can be used to automate the hacking process. Scripts must be written in the Netscript language " + 
                         "and are saved as a file. Running a script requires RAM. The more complex a script is, the more RAM " + 
                         "it requires to run. Scripts can be run on any server you have root access to. <br><br>" + 
                         "Here are some commands that are useful when working with scripts: <br>" + 
                         "free - Shows the current server's RAM usage <br>" + 
                         "kill [script] - Stops a script that is running <br>" + 
                         "nano [script] - Edit the script <br>" + 
                         "ps - Displays all scripts that are actively running on the current server<br>" + 
                         "run [script] - Run a script <br>" + 
                         "tail [script] - Displays a script's logs<br>" + 
                         "top - Displays all active scripts and their RAM usage <br><br>"
    TutorialTravelingText:
    TutorialJobsText:
    TutorialFactionsText:
    TutorialAugmentationsText:
	
	
	

	
	
}