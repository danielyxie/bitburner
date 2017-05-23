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

//Scroll to the bottom of the terminal's 'text area'
function updateTerminalScroll() {
	var element = document.getElementById("terminal-container");
	element.scrollTop = element.scrollHeight;
}

var postNetburnerText = function() {
	post("Bitburner v" + CONSTANTS.Version);
}

/*
$(document).keyup(function(event) {
    //Enter
    if (event.keyCode == 13) {

    }
});
*/

//Defines key commands in terminal
$(document).keydown(function(event) {
	//Terminal
	if (Engine.currentPage == Engine.Page.Terminal) {
        var terminalInput = document.getElementById("terminal-input-text-box");
        if (terminalInput != null && !event.ctrlKey && !event.shiftKey) {terminalInput.focus();}
        
		//Enter
		if (event.keyCode == 13) {
            event.preventDefault(); //Prevent newline from being entered in Script Editor
			var command = $('input[class=terminal-input]').val();
			if (command.length > 0) {
				post("> " + command);
				
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
        
        //Up key to cycle through past commands
        if (event.keyCode == 38) {
            if (terminalInput == null) {return;}
            var i = Terminal.commandHistoryIndex;
            var len = Terminal.commandHistory.length;
            
            if (len == 0) {return;}
            if (i < 0 || i > len) {
                Terminal.commandHistoryIndex = len;
            } 
            
            if (i != 0) {
                --Terminal.commandHistoryIndex;
            }
            var prevCommand = Terminal.commandHistory[Terminal.commandHistoryIndex];
            terminalInput.value = prevCommand;
            setTimeout(function(){terminalInput.selectionStart = terminalInput.selectionEnd = 10000; }, 0);
        }
        
        //Down key
        if (event.keyCode == 40) {
            if (terminalInput == null) {return;}
            var i = Terminal.commandHistoryIndex;
            var len = Terminal.commandHistory.length;
            
            if (len == 0) {return;}
            if (i < 0 || i > len) {
                Terminal.commandHistoryIndex = len;
            }
            
            //Latest command, put nothing
            if (i == len || i == len-1) {
                Terminal.commandHistoryIndex = len;
                terminalInput.value = "";
            } else {
                ++Terminal.commandHistoryIndex;
                var prevCommand = Terminal.commandHistory[Terminal.commandHistoryIndex];
                terminalInput.value = prevCommand;
            }
        }
        
        //Tab (autocomplete)
        if (event.keyCode == 9) {
            if (terminalInput == null) {return;}
            var input = terminalInput.value;
            if (input == "") {return;}
            input = input.trim();
            input = input.replace(/\s\s+/g, ' ');
            
            var allPos = determineAllPossibilitiesForTabCompletion(input);
            if (allPos.length == 0) {return;}
            
            var commandArray = input.split(" ");
            
            var arg = "";
            if (commandArray.length == 0) {return;}
            else if (commandArray.length > 1) {
                arg = commandArray[1];
            }
            
            tabCompletion(commandArray[0], arg, allPos);
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
            var inputTextBox = document.getElementById("terminal-input-text-box");
            if (inputTextBox != null) {
                inputTextBox.focus();
            }
			
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

//Implements a tab completion feature for terminal
//  command - Command (first arg only)
//  arg - Incomplete argument string that the function will try to complete, or will display
//        a series of possible options for
//  allPossibilities - Array of strings containing all possibilities that the
//                     string can complete to
function tabCompletion(command, arg, allPossibilities) {
    if (!(allPossibilities.constructor === Array)) {return;}
    if (!containsAllStrings(allPossibilities)) {return;}
    
    for (var i = allPossibilities.length-1; i >= 0; --i) {
        if (!allPossibilities[i].startsWith(arg)) {
            allPossibilities.splice(i, 1);
        }
    }
    
    if (allPossibilities.length == 0) {
        return;
    } else if (allPossibilities.length == 1) {
        document.getElementById("terminal-input-text-box").value = command + " " + allPossibilities[0];
        document.getElementById("terminal-input-text-box").focus();
    } else {
        var longestStartSubstr = longestCommonStart(allPossibilities);
        //If the longest common starting substring of remaining possibilities is the same
        //as whatevers already in terminal, just list all possible options. Otherwise,
        //change the input in the terminal to the longest common starting substr
        if (longestStartSubstr == arg) {
            //List all possible options
            var allOptionsStr = "";
            for (var i = 0; i < allPossibilities.length; ++i) {
                allOptionsStr += allPossibilities[i];
                allOptionsStr += "   ";
            }
            post("> " + command + " " + arg);
            post(allOptionsStr);
        } else {
            document.getElementById("terminal-input-text-box").value = command + " " + longestStartSubstr;
            document.getElementById("terminal-input-text-box").focus();
        }
    }
}

function determineAllPossibilitiesForTabCompletion(input) {
    var allPos = [];
    var currServ = Player.getCurrentServer();
    if (input.startsWith("connect ") || input.startsWith("telnet ")) {
        //All network connections
        for (var i = 0; i < currServ.serversOnNetwork.length; ++i) {
            var serv = AllServers[currServ.serversOnNetwork[i]];
            if (serv == null) {continue;}
            allPos.push(serv.ip); //IP
            allPos.push(serv.hostname); //Hostname
        }
        return allPos;
    } 
    
    if (input.startsWith("kill ") || input.startsWith("nano ") ||
        input.startsWith("tail ") || input.startsWith("rm ") ||
        input.startsWith("mem ")) {
        //All Scripts
        for (var i = 0; i < currServ.scripts.length; ++i) {
            allPos.push(currServ.scripts[i].filename);
        }
        return allPos;
    }
    
    if (input.startsWith("run ")) {
        //All programs and scripts
        for (var i = 0; i < currServ.scripts.length; ++i) {
            allPos.push(currServ.scripts[i].filename);
        }
        
        //Programs are on home computer
        var homeComputer = Player.getHomeComputer();
        for(var i = 0; i < homeComputer.programs.length; ++i) {
            allPos.push(homeComputer.programs[i]);
        }
        return allPos;
    }
    return allPos;
}

var Terminal = {
    //Flags to determine whether the player is currently running a hack or an analyze
    hackFlag:       false, 
    analyzeFlag:    false, 
    
    commandHistory: [],
    commandHistoryIndex: 0,
    
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
			var expGainedOnFailure = (expGainedOnSuccess / 4);
			if (rand < hackChance) {	//Success!
				var moneyGained = Player.calculatePercentMoneyHacked();
				moneyGained = Math.floor(Player.getCurrentServer().moneyAvailable * moneyGained);
				
				//Safety check
				if (moneyGained <= 0) {moneyGained = 0;}
				
				Player.getCurrentServer().moneyAvailable -= moneyGained;
				Player.gainMoney(moneyGained);
				
                Player.gainHackingExp(expGainedOnSuccess)
				
				post("Hack successful! Gained $" + formatNumber(moneyGained, 2) + " and " + formatNumber(expGainedOnSuccess, 4) + " hacking EXP");
			} else {					//Failure
				//Player only gains 25% exp for failure? TODO Can change this later to balance
                Player.gainHackingExp(expGainedOnFailure)
				post("Failed to hack " + Player.getCurrentServer().hostname + ". Gained " + formatNumber(expGainedOnFailure, 4) + " hacking EXP");
			}
		}
        
        //Rename the progress bar so that the next hacks dont trigger it. Re-enable terminal
        $("#hack-progress-bar").attr('id', "old-hack-progress-bar");
        $("#hack-progress").attr('id', "old-hack-progress");
        document.getElementById("terminal-input-td").innerHTML = '$ <input type="text" id="terminal-input-text-box" class="terminal-input" tabindex="1"/>';
        $('input[class=terminal-input]').prop('disabled', false);      

        Terminal.hackFlag = false;
	},
    
    finishAnalyze: function(cancelled = false) {
		if (cancelled == false) {
			post(Player.getCurrentServer().hostname + ": ");
            var rootAccess = "";
            if (Player.getCurrentServer().hasAdminRights) {rootAccess = "YES";}
            else {rootAccess = "NO";}
            post("Root Access: " + rootAccess);
			post("Required hacking skill: " + Player.getCurrentServer().requiredHackingSkill);
			//TODO Make these actual estimates by adding a random offset to result?
			//TODO Change the text to sound better
			post("Estimated chance to hack: " + formatNumber(addOffset(Player.calculateHackingChance() * 100, 5), 2) + "%");
			post("Estimated time to hack: " + formatNumber(addOffset(Player.calculateHackingTime(), 5), 3) + " seconds");
			post("Estimated total money available on server: $" + formatNumber(addOffset(Player.getCurrentServer().moneyAvailable, 5), 2));
			post("Required number of open ports for NUKE: " + Player.getCurrentServer().numOpenPortsRequired);
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
        document.getElementById("terminal-input-td").innerHTML = '$ <input type="text" id="terminal-input-text-box" class="terminal-input" tabindex="1"/>';
        $('input[class=terminal-input]').prop('disabled', false);      
    }, 
	
	executeCommand:  function(command) {
        command = command.trim();
        //Replace all extra whitespace in command with a single space
        command = command.replace(/\s\s+/g, ' ');
        
        Terminal.commandHistory.push(command);
        if (Terminal.commandHistory.length > 50) {
            Terminal.commandHistory.splice(0, 1);
        }
        Terminal.commandHistoryIndex = Terminal.commandHistory.length;
        
        //Process any aliases
        command = substituteAliases(command);
        console.log("command after alises: " + command);
        
        //Only split the first space
		var commandArray = command.split(" ");
        if (commandArray.length > 1) {
            commandArray = [commandArray.shift(), commandArray.join(" ")];
        }
		
		if (commandArray.length == 0) {return;}
        
        /****************** Interactive Tutorial Terminal Commands ******************/
        if (iTutorialIsRunning) {
            var foodnstuffServ = GetServerByHostname("foodnstuff");
            if (foodnstuffServ == null) {throw new Error("Could not get foodnstuff server"); return;}
            
            switch(currITutorialStep) {
            case iTutorialSteps.TerminalHelp:
                if (commandArray[0] == "help") {
                    post(CONSTANTS.HelpText);
                    iTutorialNextStep();
                } else {post("Bad command. Please follow the tutorial");}
                break;
            case iTutorialSteps.TerminalLs:
                if (commandArray[0] == "ls") {
                    Terminal.executeListCommand(commandArray);
                    iTutorialNextStep();
                } else {post("Bad command. Please follow the tutorial");}
                break;
            case iTutorialSteps.TerminalScan:
                if (commandArray[0] == "scan") {
                    Terminal.executeScanCommand(commandArray);
                    iTutorialNextStep();
                } else {post("Bad command. Please follow the tutorial");}
                break;
            case iTutorialSteps.TerminalConnect:
                
                if (commandArray.length == 2) {
                    if ((commandArray[0] == "connect" || commandArray[0] == "telnet") &&
                        (commandArray[1] == "foodnstuff" || commandArray[1] == foodnstuffServ.ip)) {
                        Player.getCurrentServer().isConnectedTo = false;
                        Player.currentServer = foodnstuffServ.ip;
                        Player.getCurrentServer().isConnectedTo = true;
                        post("Connected to foodnstuff");
                        iTutorialNextStep();
                    } else {post("Wrong command! Try again!"); return;}
                } else {post("Bad command. Please follow the tutorial");}
                break;
            case iTutorialSteps.TerminalAnalyze:
                if (commandArray[0] == "analyze") {    
                    if (commandArray.length != 1) {
                        post("Incorrect usage of analyze command. Usage: analyze"); return;
                    }
                    //Analyze the current server for information
                    Terminal.analyzeFlag = true;
                    post("Analyzing system...");
                    hackProgressPost("Time left:");
                    hackProgressBarPost("[");
                    Player.analyze();
                    
                    //Disable terminal
                    document.getElementById("terminal-input-td").innerHTML = '<input type="text" class="terminal-input"/>';
                    $('input[class=terminal-input]').prop('disabled', true);
                    iTutorialNextStep();
                } else {
                    post("Bad command. Please follow the tutorial");
                }
                break;
            case iTutorialSteps.TerminalNuke:
                if (commandArray.length == 2 && 
                    commandArray[0] == "run" && commandArray[1] == "NUKE.exe") {
                    foodnstuffServ.hasAdminRights = true;
                    post("NUKE successful! Gained root access to foodnstuff");
                    iTutorialNextStep();
                } else {post("Bad command. Please follow the tutorial");}
                break;
            case iTutorialSteps.TerminalManualHack:
                if (commandArray.length == 1 && commandArray[0] == "hack") {
                    Terminal.hackFlag = true;
					hackProgressPost("Time left:");
					hackProgressBarPost("[");
					Player.hack();
					
					//Disable terminal
					document.getElementById("terminal-input-td").innerHTML = '<input type="text" class="terminal-input"/>';
					$('input[class=terminal-input]').prop('disabled', true);
                    iTutorialNextStep();
                } else {post("Bad command. Please follow the tutorial");}
				break;
            case iTutorialSteps.TerminalCreateScript:
                if (commandArray.length == 2 && 
                    commandArray[0] == "nano" && commandArray[1] == "foodnstuff.script") {
                    Engine.loadScriptEditorContent("foodnstuff", "");
                    iTutorialNextStep();
                } else {post("Bad command. Please follow the tutorial");}
            case iTutorialSteps.TerminalFree:
                if (commandArray.length == 1 && commandArray[0] == "free") {
                    Terminal.executeFreeCommand(commandArray);
                    iTutorialNextStep();
                }
                break;
            case iTutorialSteps.TerminalRunScript:
                if (commandArray.length == 2 && 
                    commandArray[0] == "run" && commandArray[1] == "foodnstuff.script") {
                    Terminal.runScript("foodnstuff.script");
                    iTutorialNextStep();
                } else {post("Bad command. Please follow the tutorial");}
                break;
            case iTutorialSteps.ActiveScriptsToTerminal:
                if (commandArray.length == 2 &&
                    commandArray[0] == "tail" && commandArray[1] == "foodnstuff.script") {
                    var currScripts = Player.getCurrentServer().scripts;
                    for (var i = 0; i < currScripts.length; ++i) {
                        if ("foodnstuff.script" == currScripts[i].filename) {
                            currScripts[i].displayLog();
                        }
                    }
                    iTutorialNextStep();
                } else {post("Bad command. Please follow the tutorial");}
                break;
            default:    
                post("Please follow the tutorial, or click 'Exit Tutorial' if you'd like to skip it");
                return;
            }
            return;
        }
        
        /****************** END INTERACTIVE TUTORIAL ******************/
		
        /* Command parser */
		switch (commandArray[0]) {
            case "alias":
                if (commandArray.length == 1) {
                    printAliases();
                } else if (commandArray.length == 2) {
                    if (parseAliasDeclaration(commandArray[1])) {
                        
                    } else {
                        post('Incorrect usage of alias command. Usage: alias [aliasname="value"]'); return;
                    }
                } else {
                    post('Incorrect usage of alias command. Usage: alias [aliasname="value"]'); return;
                }
                
                break;
			case "analyze":
				if (commandArray.length != 1) {
					post("Incorrect usage of analyze command. Usage: analyze"); return;
				}
                //Analyze the current server for information
                Terminal.analyzeFlag = true;
                post("Analyzing system...");
                hackProgressPost("Time left:");
                hackProgressBarPost("[");
                Player.analyze();
                
                //Disable terminal
                document.getElementById("terminal-input-td").innerHTML = '<input type="text" class="terminal-input"/>';
                $('input[class=terminal-input]').prop('disabled', true);
				break;
            case "buy":
                executeDarkwebTerminalCommand(commandArray);
                break;
			case "clear":
			case "cls":
				if (commandArray.length != 1) {
					post("Incorrect usage of clear/cls command. Usage: clear/cls"); return;
				}
				$("#terminal tr:not(:last)").remove();
				postNetburnerText();
				break;	
			case "connect":
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
                        if (Player.getCurrentServer().hostname == "darkweb") {
                            checkIfConnectedToDarkweb(); //Posts a 'help' message if connecting to dark web
                        }
                        return;
                    }
                }
                
                post("Host not found"); 
				break;
			case "free":
				Terminal.executeFreeCommand(commandArray);
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
				if (commandArray.length != 1) {
                    post("Incorrect usage of home command. Usage: home"); return;
                }
                Player.getCurrentServer().isConnectedTo = false;
                Player.currentServer = Player.getHomeComputer().ip;
                Player.getCurrentServer().isConnectedTo = true;
                post("Connected to home");
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
						post("Killing " + scriptName + ". May take up to a few minutes for the scripts to die...");
						return;
					} 
				}
				post("No such script is running. Nothing to kill");
				break;
			case "ls":
                Terminal.executeListCommand(commandArray);
				break;
            case "mem":
                if (commandArray.length != 2) {
                    post("Incorrect usage of mem command. usage: mem [scriptname]"); return;
                }
                var scriptName = commandArray[1];
                var currServ = Player.getCurrentServer();
                for (var i = 0; i < currServ.scripts.length; ++i) {
                    if (scriptName == currServ.scripts[i].filename) {
                        post("This script requires " + formatNumber(currServ.scripts[i].ramUsage, 2) + "GB of RAM to run");
                        return;
                    }
                }
                post("ERR: No such script exists!");
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
					if (filename == Player.getCurrentServer().runningScripts[i]) {
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
			case "ps":
				if (commandArray.length != 1) {
					post("Incorrect usage of ps command. Usage: ps"); return;
				}
				for (var i = 0; i < Player.getCurrentServer().runningScripts.length; i++) {
					post(Player.getCurrentServer().runningScripts[i]);
				}
				break;
			case "rm":
				if (commandArray.length != 2) {
                    post("Incorrect number of arguments. Usage: rm [program/script]"); return;
                }
                
                //Check programs
                var delTarget = commandArray[1];
                var s = Player.getCurrentServer();
                for (var i = 0; i < s.programs.length; ++i) {
                    if (s.programs[i] == delTarget) {
                       s.programs.splice(i, 1);
                       return;
                    }
                }
                
                //Check scripts
                for (var i = 0; i < s.scripts.length; ++i) {
                    if (s.scripts[i].filename == delTarget) {
                        //Check that the script isnt currently running
                        if (s.runningScripts.indexOf(delTarget) > -1) {
                            post("Cannot delete a script that is currently running!");
                        } else {
                            s.scripts.splice(i, 1);
                        }
                        return;
                    }
                }
                
                post("No such file exists");
				break;
			case "run":
				//Run a program or a script
				if (commandArray.length != 2) {
					post("Incorrect number of arguments. Usage: run [program/script]");
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
            case "scan":
                Terminal.executeScanCommand(commandArray);
				break;
            case "scan-analyze":
                Terminal.executeScanAnalyzeCommand(commandArray);
                break;
			case "scp":
				//TODO
				break;
            case "sudov":
                if (commandArray.length != 1) {
                    post("Incorrect number of arguments. Usage: sudov"); return;
                }
                
                if (Player.getCurrentServer().hasAdminRights) {
                    post("You have ROOT access to this machine");
                } else {
                    post("You do NOT have root access to this machine");
                }
                break;
			case "tail":
				if (commandArray.length != 2) {
                    post("Incorrect number of arguments. Usage: tail [script]");
                } else {
                    var scriptName = commandArray[1];
                    
                    //Can only tail script files
                    if (scriptName.endsWith(".script") == false) {
                        post("Error: tail can only be called on .script files (filename must end with .script)"); return;
                    }
                    
                    //Check that the script exists on this machine
                    var currScripts = Player.getCurrentServer().scripts;
                    for (var i = 0; i < currScripts.length; ++i) {
                        if (scriptName == currScripts[i].filename) {
                            currScripts[i].displayLog();
                            return;
                        }
                    }
                    
                    post("Error: No such script exists");
                }
				break;
			case "top":
				//TODO List each's script RAM usage
                post("Not yet implemented");
				break;
			default:
				post("Command not found");
		}
	},
    
    executeListCommand: function(commandArray) {
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
    },
    
    executeScanCommand: function(commandArray) {
        if (commandArray.length != 1) {
            post("Incorrect usage of netstat/scan command. Usage: netstat/scan"); return;
        }
        //Displays available network connections using TCP
        post("Hostname             IP                   Root Access");
        for (var i = 0; i < Player.getCurrentServer().serversOnNetwork.length; i++) {
            //Add hostname
            var entry = Player.getCurrentServer().getServerOnNetwork(i);
            if (entry == null) {continue;}
            entry = entry.hostname;
            
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
    },
    
    executeScanAnalyzeCommand: function(commandArray) {
        if (commandArray.length != 1) {
            post("Incorrect usage of scan-analyze command. usage: scan-analyze"); return;
        }
        var currServ = Player.getCurrentServer();
        for (var i = 0; i < currServ.serversOnNetwork.length; ++i) {
            var serv = currServ.getServerOnNetwork(i);
            if (serv == null) {continue;}
            post("<strong>" + serv.hostname + "</strong>");
            var c = "N";
            if (serv.hasAdminRights) {c = "Y";}
            post("--Root Access: " + c);
            post("--Required hacking skill: " + serv.requiredHackingSkill);
            post("--Number open ports required to NUKE: " + serv.numOpenPortsRequired);
            post(" ");
        }
    },
    
    executeFreeCommand: function(commandArray) {
        if (commandArray.length != 1) {
            post("Incorrect usage of free command. Usage: free"); return;
        }
        post("Total: " + formatNumber(Player.getCurrentServer().maxRam, 2) + " GB");
        post("Used: " + formatNumber(Player.getCurrentServer().ramUsed, 2) + " GB");
        post("Available: " + formatNumber(Player.getCurrentServer().maxRam - Player.getCurrentServer().ramUsed, 2) + " GB");
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
        var s = Player.getCurrentServer();
		switch (programName) {
			case Programs.NukeProgram:
				if (s.hasAdminRights) {
					post("You already have root access to this computer. There is no reason to run NUKE.exe");
				} else {
					if (s.openPortCount >= Player.getCurrentServer().numOpenPortsRequired) {
						s.hasAdminRights = true;
						post("NUKE successful! Gained root access to " + Player.getCurrentServer().hostname);
						//TODO Make this take time rather than be instant
					} else {
						post("NUKE unsuccessful. Not enough ports have been opened");
					}
				}
				break;
            case Programs.BruteSSHProgram:
                if (s.sshPortOpen) {
                    post("SSH Port (22) is already open!");
                } else {
                    s.sshPortOpen = true;
                    post("Opened SSH Port(22)!")
                    ++s.openPortCount;
                }
                break;
            case Programs.FTPCrackProgram:
                if (s.ftpPortOpen) {
                    post("FTP Port (21) is already open!");
                } else {
                    s.ftpPortOpen = true;
                    post("Opened FTP Port (21)!");
                    ++s.openPortCount;
                }
                break;
            case Programs.RelaySMTPProgram:
                if (s.smtpPortOpen) {
                    post("SMTP Port (25) is already open!");
                } else {
                    s.smtpPortOpen = true;
                    post("Opened SMTP Port (25)!");
                    ++s.openPortCount;
                }
                break;
            case Programs.HTTPWormProgram:
                if (s.httpPortOpen) {
                    post("HTTP Port (80) is already open!");
                } else {
                    s.httpPortOpen = true;
                    post("Opened HTTP Port (80)!");
                    ++s.openPortCount;
                }
                break;
            case Programs.SQLInjectProgram:
                if (s.sqlPortOpen) {
                    post("SQL Port (1433) is already open!");
                } else {
                    s.sqlPortOpen = true;
                    post("Opened SQL Port (1433)!");
                    ++s.openPortCount;
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



