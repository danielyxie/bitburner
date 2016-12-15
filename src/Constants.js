CONSTANTS = {
	//Max level for any skill. Determined by max numerical value in javascript and the skill level
	//formula in Player.js
	MaxSkillLevel: 			1796,
	
	//Time (ms) it takes to run one operation in Netscript.  
	CodeInstructionRunTime:	1500, 
	
	//Time (seconds) it takes to run one operation in Netscript OFFLINE
	CodeOfflineExecutionTime: 10,
    
    //Text that is displayed when the 'help' command is ran in Terminal
    HelpText:   "analyze                Get statistics and information about current machine\n" + 
                "clear                  Clear all text on the terminal\n" +
                "cls                    See 'clear' command\n" +
                "connect [ip/hostname]  Connects to the machine given by its IP or hostname\n" + 
                "free                   Check the machine's memory usage\n" + 
                "hack                   Hack the current machine\n" +
                "help                   Display this list\n" + 
                "hostname               Displays the hostname of the machine\n" + 
                "ifconfig               Displays the IP address of the machine\n" +
                "kill [script name]     Stops a script that is running\n" +
                "ls                     Displays all programs and scripts on the machine\n" + 
                "nano [script name]     Text editor - Open up and edit a script\n" + 
                "netstat                Displays all available network connections\n" +  
                "ps                     Display all scripts that are currently running\n" + 
                "rm                     Delete a script/program from the machine. (WARNING: Permanent)\n" + 
                "run [script/program]   Execute a program or a script\n" + 
                "scan                   See 'netstat' command\n" + 
                "telnet [ip/hostname]   See 'connect' command\n" +
                "top                    Display all running scripts and their RAM usage\n"
                
}