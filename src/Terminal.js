//Terminal

/* Write text to terminal */
var post = function(input) {
    $("#terminal-input").before('<tr class="posted"><td style="color: #66ff33;">' + input.replace( / /g, "&nbsp;" ) + '</td></tr>');
	updateTerminalScroll();
}

//Same thing as post but the td cells have ids so they can be animated for the hack progress bar
var hackProgressBarPost = function(input) {
    $("#terminal-input").before('<tr class="posted"><td id="hack-progress-bar" style="color: #66ff33;">' + input + '</td></tr>');
	updateTerminalScroll();
}

var hackProgressPost = function(input) {
    $("#terminal-input").before('<tr class="posted"><td id="hack-progress" style="color: #66ff33;">' + input + '</td></tr>');
	updateTerminalScroll();    
}

function updateTerminalScroll() {
	var element = document.getElementById("terminal-container");
	element.scrollTop = element.scrollHeight;
}

var postNetburnerText = function() {
	post("Netburner v0.1");
}

//Defines key commands in terminal
$(document).keyup(function(event) {
	//Terminal
	if (Engine.currentPage == Engine.Page.Terminal) {
		//Enter
		if (event.keyCode == 13) {
			var command = $('input[class=terminal-input]').val();
			if (command.length > 0) {
				post("> " + command);
				
				//TODO Do i have to switch the order of these two?
				Terminal.executeCommand(command);
				$('input[class=terminal-input]').val("");
			}
		}
		
		//Ctrl + c when an "Action" is in progress
		if (event.keyCode == 67 && event.ctrlKey && Engine._actionInProgress) {
			post("Cancelling...");
			Engine._actionInProgress = false;
			Terminal.finishAction(true);
		}
	}
});

//Keep terminal in focus
terminalCtrlPressed = false;
$(document).ready(function() {
	if (Engine.currentPage == Engine.Page.Terminal) {
		$('.terminal-input').focus();
	}
});
$(document).keydown(function(e) {
	if (Engine.currentPage == Engine.Page.Terminal) {
		if (e.which == 17) {
			terminalCtrlPressed = true;
		} else if (terminalCtrlPressed == true) {
			//Don't focus
		} else {
			$('.terminal-input').focus();	
			terminalCtrlPressed = false;
		}
	}
})
$(document).keyup(function(e) {
	if (Engine.currentPage == Engine.Page.Terminal) {
		if (e.which == 17) {
			terminalCtrlPressed = false;
		}
	}
})

var Terminal = {
    //Flags to determine whether the player is currently running a hack or an analyze
    hackFlag:       false, 
    analyzeFlag:    false, 
    
    finishAction: function(cancelled = false) {
        if (Terminal.hackFlag) {
            Terminal.finishHack(cancelled);
        } else if (Terminal.analyzeFlag) {
            Terminal.finishAnalyze(cancelled);
        }
    },
    
    //Complete the hack/analyze command
	finishHack: function(cancelled = false) {
		if (cancelled == false) {
			console.log("Hack done. Determining success/failure of hack. Re-enabling terminal and changing the id of the hack progress bar");
			
			//Calculate whether hack was successful
			var hackChance = Player.calculateHackingChance();
			var rand = Math.random();
			console.log("Hack success chance: " + hackChance +  ", rand: " + rand);
			var expGainedOnSuccess = Player.calculateExpGain();
			var expGainedOnFailure = Math.round(expGainedOnSuccess / 4);
			if (rand < hackChance) {	//Success!
				var moneyGained = Player.calculatePercentMoneyHacked();
				moneyGained = Math.floor(Player.getCurrentServer().moneyAvailable * moneyGained);
				
				//Safety check
				if (moneyGained <= 0) {moneyGained = 0;}
				
				Player.getCurrentServer().moneyAvailable -= moneyGained;
				Player.gainMoney(moneyGained);
				
				Player.hacking_exp += expGainedOnSuccess;
				
				post("Hack successful! Gained $" + moneyGained + " and " + expGainedOnSuccess + " hacking EXP");
			} else {					//Failure
				//Player only gains 25% exp for failure? TODO Can change this later to balance
				Player.hacking_exp += expGainedOnFailure;
				post("Failed to hack " + Player.getCurrentServer().hostname + ". Gained " + expGainedOnFailure + " hacking EXP");
			}
		}
        
        //Rename the progress bar so that the next hacks dont trigger it. Re-enable terminal
        $("#hack-progress-bar").attr('id', "old-hack-progress-bar");
        $("#hack-progress").attr('id', "old-hack-progress");
        document.getElementById("terminal-input-td").innerHTML = '$ <input type="text" class="terminal-input"/>';
        $('input[class=terminal-input]').prop('disabled', false);      

        Terminal.hackFlag = false;
	},
    
    finishAnalyze: function(cancelled = false) {
		if (cancelled == false) {
			post(Player.getCurrentServer().hostname + ": ");
			post("Required hacking skill: " + Player.getCurrentServer().requiredHackingSkill);
			//TODO Make these actual estimates by adding a random offset to result?
			//TODO Change the text to sound better
			post("Estimated chance to hack: " + Math.round(Player.calculateHackingChance() * 100) + "%");
			post("Estimated time to hack: " + Math.round(Player.calculateHackingTime()) + " seconds");
			post("Estimed total money available on server: $" + Player.getCurrentServer().moneyAvailable);
			post("Required number of open ports for PortHack: " +Player.getCurrentServer().numOpenPortsRequired);
			if (Player.getCurrentServer().sshPortOpen) {
				post("SSH port: Open")
			} else {
				post("SSH port: Closed")
			}
			
			if (Player.getCurrentServer().ftpPortOpen) {
				post("FTP port: Open")
			} else {
				post("FTP port: Closed")
			}
			
			if (Player.getCurrentServer().smtpPortOpen) {
				post("SMTP port: Open")
			} else {
				post("SMTP port: Closed")
			}
			
			if (Player.getCurrentServer().httpPortOpen) {
				post("HTTP port: Open")
			} else {
				post("HTTP port: Closed")
			}
			
			if (Player.getCurrentServer().sqlPortOpen) {
				post("SQL port: Open")
			} else {
				post("SQL port: Closed")
			}
		}
        Terminal.analyzeFlag = false;
        
        //Rename the progress bar so that the next hacks dont trigger it. Re-enable terminal
        $("#hack-progress-bar").attr('id', "old-hack-progress-bar");
        $("#hack-progress").attr('id', "old-hack-progress");
        document.getElementById("terminal-input-td").innerHTML = '$ <input type="text" class="terminal-input"/>';
        $('input[class=terminal-input]').prop('disabled', false);      
    }, 
	
	executeCommand:  function(command) {
		var commandArray = command.split(" ");
		
		if (commandArray.length == 0) {
			return;
		}
		
		switch (commandArray[0]) {
			case "analyze":
				if (commandArray.length != 1) {
					post("Incorrect usage of analyze command. Usage: analyze"); return;
				}
                //Analyze the current server for information
                console.log("analyze terminal command called");
                Terminal.analyzeFlag = true;
                post("Analyzing system...");
                hackProgressPost("Time left:");
                hackProgressBarPost("[");
                Player.analyze();
                
                //Disable terminal
                console.log("Disabling terminal");
                document.getElementById("terminal-input-td").innerHTML = '<input type="text" class="terminal-input"/>';
                $('input[class=terminal-input]').prop('disabled', true);
				break;
			case "clear":
			case "cls":
				if (commandArray.length != 1) {
					post("Incorrect usage of clear/cls command. Usage: clear/cls"); return;
				}
				console.log("cls/clear terminal command called");
				$("#terminal tr:not(:last)").remove();
				postNetburnerText();
				break;	
			case "connect":
            case "telnet":
				//Disconnect from current server in terminal and connect to new one
                if (commandArray.length != 2) {
                    post("Incorrect usage of connect/telnet command. Usage: connect/telnet [ip/hostname]");
                    return;
                }
                
                var ip = commandArray[1];
                
                for (var i = 0; i < Player.getCurrentServer().serversOnNetwork.length; i++) {
                    if (Player.getCurrentServer().getServerOnNetwork(i).ip == ip || Player.getCurrentServer().getServerOnNetwork(i).hostname == ip) {
                        Player.getCurrentServer().isConnectedTo = false;
                        Player.currentServer = Player.getCurrentServer().getServerOnNetwork(i).ip;
                        Player.getCurrentServer().isConnectedTo = true;
                        post("Connected to " + ip);
                        return;
                    }
                }
                
                post("Host not found"); 
				break;
			case "free":
				if (commandArray.length != 1) {
					post("Incorrect usage of free command. Usage: free"); return;
				}
				console.log("free terminal command called");
                post("Total: " + Player.getCurrentServer().maxRam.toString() + " GB");
                post("Used: " + Player.getCurrentServer().ramUsed.toString() + " GB");
                post("Available: " + (Player.getCurrentServer().maxRam - Player.getCurrentServer().ramUsed).toString() + " GB");
				break;
			case "hack":
				if (commandArray.length != 1) {
					post("Incorrect usage of hack command. Usage: hack"); return;
				}
				//Hack the current PC (usually for money)
				//You can't hack your home pc or servers you purchased
				if (Player.getCurrentServer().purchasedByPlayer) {
					post("Cannot hack your own machines! You are currently connected to your home PC or one of your purchased servers");
				} else if (Player.getCurrentServer().hasAdminRights == false ) {
					post("You do not have admin rights for this machine! Cannot hack");
				} else if (Player.getCurrentServer().requiredHackingSkill > Player.hacking_skill) {
					post("Your hacking skill is not high enough to attempt hacking this machine. Try analyzing the machine to determine the required hacking skill");
				} else {
                    Terminal.hackFlag = true;
					hackProgressPost("Time left:");
					hackProgressBarPost("[");
					Player.hack();
					
					//Disable terminal
					console.log("Disabling terminal");
					document.getElementById("terminal-input-td").innerHTML = '<input type="text" class="terminal-input"/>';
					$('input[class=terminal-input]').prop('disabled', true);
				}
				break;
			case "help":
				if (commandArray.length != 1) {
					post("Incorrect usage of help command. Usage: help"); return;
				}
				
				post(CONSTANTS.HelpText);
				break;
			case "home":
				//TODO return to home computer
				break;
			case "hostname":
				if (commandArray.length != 1) {
					post("Incorrect usage of hostname command. Usage: hostname"); return;
				}
				//Print the hostname of current system
				post(Player.getCurrentServer().hostname);
				break;
			case "ifconfig":
				if (commandArray.length != 1) {
					post("Incorrect usage of ifconfig command. Usage: ifconfig"); return;
				}
				//Print the IP address of the current system
				post(Player.getCurrentServer().ip);
				break;
			case "kill":
				if (commandArray.length != 2) {
					post("Incorrect usage of kill command. Usage: kill [scriptname]"); return;
				}
				
				var scriptName = commandArray[1];
				for (var i = 0; i < Player.getCurrentServer().runningScripts.length; i++) {
					if (Player.getCurrentServer().runningScripts[i] == scriptName) {						
						killWorkerScript(scriptName, Player.getCurrentServer().ip); 
						post("Killing " + scriptName + ". May take a few seconds");
						return;
					} 
				}
				post("No such script is running. Nothing to kill");
				break;
			case "ls":
				if (commandArray.length != 1) {
					post("Incorrect usage of ls command. Usage: ls"); return;
				}
				
				//Display all programs and scripts
				var allFiles = []; 
				
				//Get all of the programs and scripts on the machine into one temporary array
				for (var i = 0; i < Player.getCurrentServer().programs.length; i++) {
					allFiles.push(Player.getCurrentServer().programs[i]); 
				}
				for (var i = 0; i < Player.getCurrentServer().scripts.length; i++) {
					allFiles.push(Player.getCurrentServer().scripts[i].filename);
				}
				
				//Sort the files alphabetically then print each
				allFiles.sort();
				
				for (var i = 0; i < allFiles.length; i++) {
					post(allFiles[i]);
				}
				break;
			case "nano":
				if (commandArray.length != 2) {
					post("Incorrect usage of nano command. Usage: nano [scriptname]"); return;
				}
				
				var filename = commandArray[1];
				
				//Can only edit script files
				if (filename.endsWith(".script") == false) {
					post("Error: Only .script files are editable with nano (filename must end with .script)"); return;
				}
				
				//Script name is the filename without the .script at the end
				var scriptname = filename.substr(0, filename.indexOf(".script"));
				
				//Cannot edit scripts that are currently running
				for (var i = 0; i < Player.getCurrentServer().runningScripts.length; i++) {
					if (filename == Player.getCurrentServer().runningScripts[i].filename) {
						post("Cannot open/edit scripts that are currently running!"); return;
					}
				}
				
				//Check if the script already exists
				for (var i = 0; i < Player.getCurrentServer().scripts.length; i++) {
					if (filename == Player.getCurrentServer().scripts[i].filename) {
						Engine.loadScriptEditorContent(scriptname, Player.getCurrentServer().scripts[i].code);
						return;
					}
				}
				Engine.loadScriptEditorContent(scriptname, "");
				break;
			case "netstat":
			case "scan":
                if (commandArray.length != 1) {
                    post("Incorrect usage of netstat/scan command. Usage: netstat/scan"); return;
                }
				//Displays available network connections using TCP
                console.log("netstat/scan terminal command called");
                post("Hostname             IP                   Root Access");
                for (var i = 0; i < Player.getCurrentServer().serversOnNetwork.length; i++) {
                    //Add hostname
                    var entry = Player.getCurrentServer().getServerOnNetwork(i).hostname;
                    
                    //Calculate padding and add IP
                    var numSpaces = 21 - entry.length;
                    var spaces = Array(numSpaces+1).join(" ");
                    entry += spaces;
                    entry += Player.getCurrentServer().getServerOnNetwork(i).ip;
                    
                    //Calculate padding and add root access info
                    var hasRoot;
                    if (Player.getCurrentServer().getServerOnNetwork(i).hasAdminRights) {
                        hasRoot = 'Y';
                    } else {
                        hasRoot = 'N';
                    }
                    numSpaces = 21 - Player.getCurrentServer().getServerOnNetwork(i).ip.length;
                    spaces = Array(numSpaces+1).join(" ");
                    entry += spaces;
                    entry += hasRoot;
                    post(entry);
                }
				break;
			case "ps":
				if (commandArray.length != 1) {
					post("Incorrect usage of ps command. Usage: ps");
				}
				for (var i = 0; i < Player.getCurrentServer().runningScripts.length; i++) {
					post(Player.getCurrentServer().runningScripts[i]);
				}
				break;
			case "rm":
				//TODO
				break;
			case "run":
				//Run a program or a script
				if (commandArray.length == 1) {
					post("No program specified to run. Usage: run [program/script]");
				} else if (commandArray.length > 2) {
					post("Too many arguments. Usage: run [program/script]");
				} else {
					var executableName = commandArray[1];
					//Check if its a script or just a program/executable 
					if (executableName.indexOf(".script") == -1) {
						//Not a script
						Terminal.runProgram(executableName);
					} else {
						//Script
						Terminal.runScript(executableName);
					}
				}
				break;
			case "scp":
				//TODO
				break;
			case "tail":
				//TODO
				break;
			case "top":
				//TODO List each's script RAM usage
				break;
			default:
				post("Command not found");
		}
	},
	
	//First called when the "run [program]" command is called. Checks to see if you
	//have the executable and, if you do, calls the executeProgram() function
	runProgram: function(programName) {
		//Check if you have the program on your computer. If you do, execute it, otherwise
		//display an error message
		for (var i = 0; i < Player.getHomeComputer().programs.length; i++) {
			if (Player.getHomeComputer().programs[i] == programName) {
				Terminal.executeProgram(programName);
				return;
			}
		}
		post("ERROR: No such executable on home computer (Only programs that exist on your home computer can be run)");
	},
	
	//Contains the implementations of all possible programs
	executeProgram: function(programName) {
		switch (programName) {
			case "PortHack.exe":
				if (Player.getCurrentServer().hasAdminRights) {
					post("You already have root access to this computer. There is no reason to run PortHack.exe");
				} else {
					console.log("Running PortHack executable");
					if (Player.getCurrentServer().openPortCount >= Player.getCurrentServer().numOpenPortsRequired) {
						Player.getCurrentServer().hasAdminRights = true;
						post("PortHack successful! Gained root access to " + Player.getCurrentServer().hostname);
						//TODO Make this take time rather than be instant
					} else {
						post("PortHack unsuccessful. Not enough ports have been opened");
					}
				}
				break;
			default:
				post("Executable not found");
				return;
		}
	},
	
	runScript: function(scriptName) {
		var server = Player.getCurrentServer();
		//Check if this script is already running
		for (var i = 0; i < server.runningScripts.length; i++) {
			if (server.runningScripts[i] == scriptName) {
				post("ERROR: This script is already running. Cannot run multiple instances");
				return;
			}
		}
		
		//Check if the script exists and if it does run it
		for (var i = 0; i < server.scripts.length; i++) {
			if (server.scripts[i].filename == scriptName) {
				//Check for admin rights and that there is enough RAM availble to run
				var ramUsage = server.scripts[i].ramUsage;
				var ramAvailable = server.maxRam - server.ramUsed;
				
				if (server.hasAdminRights == false) {
					post("Need root access to run script");
					return;
				} else if (ramUsage > ramAvailable){
					post("This machine does not have enough RAM to run this script. Script requires " + ramUsage + "GB of RAM");
					return;
				}else {
					//Able to run script
					post("Running script. May take a few seconds to start up the process...");
					var script = server.scripts[i];
					server.runningScripts.push(script.filename);	//Push onto runningScripts
					addWorkerScript(script, server);
					return;
				}
			}
		}
		
		post("ERROR: No such script");
	}
};



