//Terminal
var post = function(input) {
    $("#terminal-input").before('<tr class="posted"><td style="color: #66ff33;">' + input + '</td></tr>');
	window.scrollTo(0, document.body.scrollHeight);
}

//Same thing as post but the td cells have ids so they can be animated for the hack progress bar
var hackProgressBarPost = function(input) {
    $("#terminal-input").before('<tr class="posted"><td id="hack-progress-bar" style="color: #66ff33;">' + input + '</td></tr>');
	window.scrollTo(0, document.body.scrollHeight);    
}

var hackProgressPost = function(input) {
    $("#terminal-input").before('<tr class="posted"><td id="hack-progress" style="color: #66ff33;">' + input + '</td></tr>');
	window.scrollTo(0, document.body.scrollHeight);    
}

var postNetburnerText = function() {
	post("Netburner v1.0");
}

//command is checked on enter key press
$(document).keyup(function(event) {
    if (event.keyCode == 13) {
		var command = $('input[class=terminal-input]').val();
		if (command.length > 0) {
			post("> " + command);
            
			//TODO Do i have to switch the order of these two?
            Terminal.executeCommand(command);
			$('input[class=terminal-input]').val("");
		}
	}
});

var Terminal = {
	finishHack: function() {
		console.log("Hack done. Determining success/failure of hack. Re-enabling terminal and changing the id of the hack progress bar");
		
		//Calculate whether hack was successful
		var hackChance = Player.calculateHackingChance();
		var rand = Math.random();
		console.log("Hack success chance: " + hackChance +  ", rand: " + rand);
		var expGainedOnSuccess = Player.calculateExpGain();
		var expGainedOnFailure = Math.round(expGainedOnSuccess / 4);
		if (rand < hackChance) {	//Success!
			var moneyGained = Player.calculatePercentMoneyHacked();
			moneyGained = Math.floor(Player.currentServer.moneyAvailable * moneyGained);
			
			Player.currentServer.moneyAvailable -= moneyGained;
			Player.money += moneyGained;
			
			Player.hacking_exp += expGainedOnSuccess;
			
			post("Hack successful! Gained $" + moneyGained + "and " + expGainedOnSuccess + " hacking EXP");
		} else {					//Failure
			//Player only gains 25% exp for failure? TODO Can change this later to balance
			Player.hacking_exp += expGainedOnFailure;
			post("Failed to hack " + Player.currentServer.hostname + ". Gained " + expGainedOnFailure + " hacking EXP");
		}
		
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
				//TODO Analyze the system for ports
				break;
			case "clear":
			case "cls":
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
                
                for (var i = 0; i < Player.currentServer.serversOnNetwork.length; i++) {
                    if (Player.currentServer.serversOnNetwork[i].ip == ip || Player.currentServer.serversOnNetwork[i].hostname == ip) {
                        Player.currentServer.isConnectedTo = false;
                        Player.currentServer = Player.currentServer.serversOnNetwork[i];
                        post("Connected to " + ip);
                        return;
                    }
                }
                
                post("Host not found"); 
				break;
			case "df":
				console.log("df terminal command called");
                post("Total: " + Player.currentServer.maxRam.toString() + " GB");
                post("Used: " + Player.currentServer.ramUsed.toString() + " GB");
                post("Available: " + (Player.currentServer.maxRam - Player.currentServer.ramUsed).toString() + " GB");
				break;
			case "hack":
				//Hack the current PC (usually for money)
				//You can't hack your home pc or servers you purchased
				if (Player.currentServer.purchasedByPlayer) {
					post("Cannot hack your own machines! You are currently connected to your home PC or one of your purchased servers");
				} else if (Player.currentServer.hasAdminRights == false ) {
					post("You do not have admin rights for this machine! Cannot hack");
				} else if (Player.currentServer.requiredHackingSkill > Player.hacking_skill) {
					post("Your hacking skill is not high enough to attempt hacking this machine. Try analyzing the machine to determine the required hacking skill");
				} else {
					hackProgressPost("Time left:");
					hackProgressBarPost("[");
					var timeToHack = Player.hack();
					
					//Disable terminal
					console.log("Disabling terminal");
					document.getElementById("terminal-input-td").innerHTML = '<input type="text" class="terminal-input"/>';
					$('input[class=terminal-input]').prop('disabled', true);
				}
				break;
			case "help":
				//TODO
				break;
			case "hostname":
				//Print the hostname of current system
				post(Player.currentServer.hostname);
				break;
			case "ifconfig":
				//Print the IP address of the current system
				post(Player.currentServer.ip);
				break;
			case "kill":
				//TODO
				break;
			case "ls":
				//Display all programs and scripts
				var allFiles = []; 
				
				//Get all of the programs and scripts on the machine into one temporary array
				for (var i = 0; i < Player.currentServer.programs.length; i++) {
					allFiles.push(Player.currentServer.programs[i]); 
				}
				for (var i = 0; i < Player.currentServer.scripts.length; i++) {
					allFiles.push(Player.currentServer.scripts[i]);
				}
				
				//Sort the files alphabetically then print each
				allFiles.sort();
				
				for (var i = 0; i < allFiles.length; i++) {
					post(allFiles[i]);
				}
				break;
			case "netstat":
			case "scan":
                if (commandArray.length != 1) {
                    post("Incorrect usage of netstat/scan command. Usage: netstat/scan");
                    return;
                }
				//Displays available network connections using TCP
                console.log("netstat/scan terminal command called");
                post("Hostname               IP");
                for (var i = 0; i < Player.currentServer.serversOnNetwork.length; i++) {
                    post(Player.currentServer.serversOnNetwork[i].hostname + " " + Player.currentServer.serversOnNetwork[i].ip);
                }
			case "ps":
				//TODO
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
			default:
				post("Command not found");
		}
	},
	
	//First called when the "run [program]" command is called. Checks to see if you
	//have the executable and, if you do, calls the executeProgram() function
	runProgram: function(programName) {
		//Check if you have the program on your computer. If you do, execute it, otherwise
		//display an error message
		for (var i = 0; i < Player.homeComputer.programs.length; i++) {
			if (Player.homeComputer.programs[i] == programName) {
				Terminal.executeProgram(programName);
				return;
			}
		}
		post("ERROR: No such executable");
	},
	
	//Contains the implementations of all possible programs
	executeProgram: function(programName) {
		switch (programName) {
			case "PortHack.exe":
				if (Player.currentServer.hasAdminRights) {
					post("You already have root access to this computer. There is no reason to run PortHack.exe");
				} else {
					console.log("Running PortHack executable");
					if (Player.currentServer.openPortCount >= Player.currentServer.numOpenPortsRequired) {
						Player.currentServer.hasAdminRights = true;
						post("PortHack successful! Gained root access to " + Player.currentServer.hostname);
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
		
	}
};



