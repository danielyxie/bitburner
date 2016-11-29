//Terminal
var post = function(input) {
    $("#terminal-input").before('<tr class="posted"><td style="color: #66ff33;">' + input.replace( / /g, "&nbsp;" ) + '</td></tr>');
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

//Defines what happens when enter is pressed (keycode 13)
$(document).keyup(function(event) {
	//Terminal
	if (Engine.currentPage == Engine.Page.Terminal) {
		if (event.keyCode == 13) {
			var command = $('input[class=terminal-input]').val();
			if (command.length > 0) {
				post("> " + command);
				
				//TODO Do i have to switch the order of these two?
				Terminal.executeCommand(command);
				$('input[class=terminal-input]').val("");
			}
		}
	}
});

//Keep terminal in focus
$(document).ready(function() {
	if (Engine.currentPage == Engine.Page.Terminal) {
		$('.terminal-input').focus();
	}
});
$(document).keydown(function() {
	if (Engine.currentPage == Engine.Page.Terminal) {
		$('.terminal-input').focus();	
	}
})

var Terminal = {
    //Flags to determine whether the player is currently running a hack or an analyze
    hackFlag:       false, 
    analyzeFlag:    false, 
    
    finishAction: function() {
        if (Terminal.hackFlag) {
            Terminal.finishHack();
        } else if (Terminal.analyzeFlag) {
            Terminal.finishAnalyze();
        }
    },
    
    //Complete the hack/analyze command
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
            
            post("Hack successful! Gained $" + moneyGained + " and " + expGainedOnSuccess + " hacking EXP");
        } else {					//Failure
            //Player only gains 25% exp for failure? TODO Can change this later to balance
            Player.hacking_exp += expGainedOnFailure;
            post("Failed to hack " + Player.currentServer.hostname + ". Gained " + expGainedOnFailure + " hacking EXP");
        }
        
        //Rename the progress bar so that the next hacks dont trigger it. Re-enable terminal
        $("#hack-progress-bar").attr('id', "old-hack-progress-bar");
        $("#hack-progress").attr('id', "old-hack-progress");
        document.getElementById("terminal-input-td").innerHTML = '$ <input type="text" class="terminal-input"/>';
        $('input[class=terminal-input]').prop('disabled', false);      

        Terminal.hackFlag = false;
	},
    
    finishAnalyze: function() {
        post(Player.currentServer.hostname + ": ");
        post("Required hacking skill: " + Player.currentServer.requiredHackingSkill);
        //TODO Make these actual estimates by adding a random offset to result?
        //TODO Change the text to sound better
        post("Estimated chance to hack: " + Math.round(Player.calculateHackingChance() * 100) + "%");
        post("Estimated time to hack: " + Math.round(Player.calculateHackingTime()) + " seconds");
        post("Required number of open ports for PortHack: " +Player.currentServer.numOpenPortsRequired);
        if (Player.currentServer.sshPortOpen) {
            post("SSH port: Open")
        } else {
            post("SSH port: Closed")
        }
        
        if (Player.currentServer.ftpPortOpen) {
            post("FTP port: Open")
        } else {
            post("FTP port: Closed")
        }
        
        if (Player.currentServer.smtpPortOpen) {
            post("SMTP port: Open")
        } else {
            post("SMTP port: Closed")
        }
        
        if (Player.currentServer.httpPortOpen) {
            post("HTTP port: Open")
        } else {
            post("HTTP port: Closed")
        }
        
        if (Player.currentServer.sqlPortOpen) {
            post("SQL port: Open")
        } else {
            post("SQL port: Closed")
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
				if (commandArray.length != 1) {
					post("Incorrect usage of df command. Usage: df"); return;
				}
				console.log("df terminal command called");
                post("Total: " + Player.currentServer.maxRam.toString() + " GB");
                post("Used: " + Player.currentServer.ramUsed.toString() + " GB");
                post("Available: " + (Player.currentServer.maxRam - Player.currentServer.ramUsed).toString() + " GB");
				break;
			case "hack":
				if (commandArray.length != 1) {
					post("Incorrect usage of hack command. Usage: hack"); return;
				}
				//Hack the current PC (usually for money)
				//You can't hack your home pc or servers you purchased
				if (Player.currentServer.purchasedByPlayer) {
					post("Cannot hack your own machines! You are currently connected to your home PC or one of your purchased servers");
				} else if (Player.currentServer.hasAdminRights == false ) {
					post("You do not have admin rights for this machine! Cannot hack");
				} else if (Player.currentServer.requiredHackingSkill > Player.hacking_skill) {
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
				//TODO
				break;
			case "hostname":
				if (commandArray.length != 1) {
					post("Incorrect usage of hostname command. Usage: hostname"); return;
				}
				//Print the hostname of current system
				post(Player.currentServer.hostname);
				break;
			case "ifconfig":
				if (commandArray.length != 1) {
					post("Incorrect usage of ifconfig command. Usage: ifconfig"); return;
				}
				//Print the IP address of the current system
				post(Player.currentServer.ip);
				break;
			case "kill":
				//TODO
				break;
			case "ls":
				if (commandArray.length != 1) {
					post("Incorrect usage of ls command. Usage: ls"); return;
				}
				
				//Display all programs and scripts
				var allFiles = []; 
				
				//Get all of the programs and scripts on the machine into one temporary array
				for (var i = 0; i < Player.currentServer.programs.length; i++) {
					allFiles.push(Player.currentServer.programs[i]); 
				}
				for (var i = 0; i < Player.currentServer.scripts.length; i++) {
					allFiles.push(Player.currentServer.scripts[i].filename);
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
					post("Error: Only .script files are editable with nano (filename must end with .scrip)"); return;
				}
				
				//Script name is the filename without the .script at the end
				var scriptname = filename.substr(0, filename.indexOf(".script"));
				
				//Cannot edit scripts that are currently running
				for (var i = 0; i < Player.currentServer.runningScripts.length; i++) {
					if (filename == Player.currentServer.runningScripts[i].filename) {
						post("Cannot open/edit scripts that are currently running!"); return;
					}
				}
				
				//Check if the script already exists
				for (var i = 0; i < Player.currentServer.scripts.length; i++) {
					if (filename == Player.currentServer.scripts[i].filename) {
						Engine.loadScriptEditorContent(scriptname, Player.currentServer.scripts[i].code);
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
                for (var i = 0; i < Player.currentServer.serversOnNetwork.length; i++) {
                    //Add hostname
                    var entry = Player.currentServer.serversOnNetwork[i].hostname;
                    
                    //Calculate padding and add IP
                    var numSpaces = 21 - entry.length;
                    var spaces = Array(numSpaces+1).join(" ");
                    entry += spaces;
                    entry += Player.currentServer.serversOnNetwork[i].ip;
                    
                    //Calculate padding and add root access info
                    var hasRoot;
                    if (Player.currentServer.serversOnNetwork[i].hasAdminRights) {
                        hasRoot = 'Y';
                    } else {
                        hasRoot = 'N';
                    }
                    numSpaces = 21 - Player.currentServer.serversOnNetwork[i].ip.length;
                    spaces = Array(numSpaces+1).join(" ");
                    entry += spaces;
                    entry += hasRoot;
                    post(entry);
                }
				break;
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
				
			case "test":
				//TODO
				//TESTED: print, for loops, while loops, prog, 
                //          basic ops, var, assign all seem fine
				//UNTESTED: if, elif, else 
				
				var code = "i = 0; while (i <= 20) {print(i); i = i+2; hack(); sleep();}";
				var ast = Parser(Tokenizer(InputStream(code)));
				console.log("Printing AST below")
				console.log(ast);
				var globalEnv = new Environment();
				evaluate(ast, globalEnv);
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
		post("ERROR: No such executable on home computer (Programs can only be run from home computer)");
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
		//Check if this script is already running
		for (var i = 0; i < Player.currentServer.runningScripts.length; i++) {
			if (Player.currentServer.runningScripts[i] == scriptName) {
				post("ERROR: This script is already running. Cannot run multiple instances");
				return;
			}
		}
		
		//Check if the script exists and if it does run it
		for (var i = 0; i < Player.currentServer.scripts.length; i++) {
			if (Player.currentServer.scripts[i].filename == scriptName) {
				if (Player.currentServer.hasAdminRights == false) {
					post("Need root access to run script");
				} else {
					var filename = Player.currentServer.scripts[i].filename;
					
					//Add to current server's runningScripts
					Player.currentServer.runningScripts.push(filename)
					
					//Create WorkerScript
					var s = new WorkerScript();
					s.name 		= filename;
					s.code 		= Player.currentServer.scripts[i].code;
					s.hostname 	= Player.currentServer.hostname;
					workerScripts.push(s);
					console.log("Pushed script onto workerScripts");
					return;
				}
			}
		}
		
		post("ERROR: No such script");
	}
};



