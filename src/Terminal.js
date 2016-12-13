function TestObj() {
	this.num = 1;
}

TestObj.prototype.setValue = function(val) {
	this.num = val;
}

TestObj.prototype.toJSON = function() {
	console.log("toJSON() called");
	return Generic_toJSON("TestObj", this);
}

TestObj.fromJSON = function(value) {
	console.log("fromJSON() called");
	return Generic_fromJSON(TestObj, value.data);
}

Reviver.constructors.TestObj = TestObj;

var testObj = new TestObj();

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
            moneyGained = Math.floor(Player.getCurrentServer().moneyAvailable * moneyGained);
            
            Player.getCurrentServer().moneyAvailable -= moneyGained;
            Player.money += moneyGained;
            
            Player.hacking_exp += expGainedOnSuccess;
            
            post("Hack successful! Gained $" + moneyGained + " and " + expGainedOnSuccess + " hacking EXP");
        } else {					//Failure
            //Player only gains 25% exp for failure? TODO Can change this later to balance
            Player.hacking_exp += expGainedOnFailure;
            post("Failed to hack " + Player.getCurrentServer().hostname + ". Gained " + expGainedOnFailure + " hacking EXP");
        }
        
        //Rename the progress bar so that the next hacks dont trigger it. Re-enable terminal
        $("#hack-progress-bar").attr('id', "old-hack-progress-bar");
        $("#hack-progress").attr('id', "old-hack-progress");
        document.getElementById("terminal-input-td").innerHTML = '$ <input type="text" class="terminal-input"/>';
        $('input[class=terminal-input]').prop('disabled', false);      

        Terminal.hackFlag = false;
	},
    
    finishAnalyze: function() {
        post(Player.getCurrentServer().hostname + ": ");
        post("Required hacking skill: " + Player.getCurrentServer().requiredHackingSkill);
        //TODO Make these actual estimates by adding a random offset to result?
        //TODO Change the text to sound better
        post("Estimated chance to hack: " + Math.round(Player.calculateHackingChance() * 100) + "%");
        post("Estimated time to hack: " + Math.round(Player.calculateHackingTime()) + " seconds");
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
				//TODO
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
					post("Error: Only .script files are editable with nano (filename must end with .scrip)"); return;
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
			case "test":
				post(testObj.num.toString());
				testObj.setValue(testObj.num + 1);
				break;
			case "testSave":
				var testSave = JSON.stringify(testObj);
				window.localStorage.setItem("netburnerTest", testSave);
				console.log("Netburner TestSave saved");
				break;
			case "testLoad":
				if (!window.localStorage.getItem("netburnerTest")) {
					console.log("No TestSave file to load");
				} else {
					console.log("Here");
					var testSave = window.localStorage.getItem("netburnerTest");
					testObj = JSON.parse(testSave, Reviver);
					console.log("TestSave loaded");
				}
				break;
			case "testDelete":
				if (!window.localStorage.getItem("netburnetTest")) {
					console.log("No TestSave file to delete");
				} else {
					window.localStorage.removeItem("netburnerTest");
					console.log("TestSave deleted");
				}
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
		post("ERROR: No such executable on home computer (Programs can only be run from home computer)");
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
		//Check if this script is already running
		for (var i = 0; i < Player.getCurrentServer().runningScripts.length; i++) {
			if (Player.getCurrentServer().runningScripts[i] == scriptName) {
				post("ERROR: This script is already running. Cannot run multiple instances");
				return;
			}
		}
		
		//Check if the script exists and if it does run it
		for (var i = 0; i < Player.getCurrentServer().scripts.length; i++) {
			if (Player.getCurrentServer().scripts[i].filename == scriptName) {
				if (Player.getCurrentServer().hasAdminRights == false) {
					post("Need root access to run script");
					return;
				} else {
					var filename = Player.getCurrentServer().scripts[i].filename;
					
					//Add to current server's runningScripts
					Player.getCurrentServer().runningScripts.push(filename)
					
					//Create WorkerScript
					var s = new WorkerScript();
					s.name 		= filename;
					s.code 		= Player.getCurrentServer().scripts[i].code;
					s.serverIp 	= Player.getCurrentServer().ip;
					workerScripts.push(s);
					console.log("Pushed script onto workerScripts");
					return;
				}
			}
		}
		
		post("ERROR: No such script");
	}
};



