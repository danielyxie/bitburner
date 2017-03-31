CONSTANTS = {
	//Max level for any skill. Determined by max numerical value in javascript and the skill level
	//formula in Player.js
	MaxSkillLevel: 			1025,
    
    //How much reputation is needed to join a megacorporation's faction
    CorpFactionRepRequirement: 250000,
	
	//Time (ms) it takes to run one operation in Netscript.  
	CodeInstructionRunTime:	1500, 
	
	//Time (seconds) it takes to run one operation in Netscript OFFLINE
	CodeOfflineExecutionTime: 10,
    
    //Programs
    PortHackProgram: "PortHack.exe",
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
                "free                   Check the machine's memory usage<br>" + 
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
                "telnet [ip/hostname]   See 'connect' command<br>" +
                "top                    Display all running scripts and their RAM usage<br>",
                
	//TutorialGettingStartedText:
		
	//TutorialServersText:
	
	//TutorialScriptText:
	
	
	

	
	
}