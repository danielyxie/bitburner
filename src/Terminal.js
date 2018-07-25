import {substituteAliases, printAliases,
        parseAliasDeclaration,
        removeAlias, GlobalAliases,
        Aliases}                            from "./Alias";
import {CONSTANTS}                          from "./Constants";
import {Programs}                           from "./CreateProgram";
import {executeDarkwebTerminalCommand,
        checkIfConnectedToDarkweb,
        DarkWebItems}                       from "./DarkWeb";
import {Engine}                             from "./engine";
import {FconfSettings, parseFconfSettings,
        createFconf}                        from "./Fconf";
import {TerminalHelpText, HelpTexts}        from "./HelpText";
import {iTutorialNextStep, iTutorialSteps,
        iTutorialIsRunning,
        currITutorialStep}                  from "./InteractiveTutorial";
import {showLiterature}                     from "./Literature";
import {showMessage, Message}               from "./Message";
import {scriptCalculateHackingTime,
        scriptCalculateGrowTime,
        scriptCalculateWeakenTime}          from "./NetscriptEvaluator";
import {killWorkerScript, addWorkerScript}  from "./NetscriptWorker";
import numeral                              from "numeral/min/numeral.min";
import {Player}                             from "./Player";
import {hackWorldDaemon}                    from "./RedPill";
import {findRunningScript, RunningScript,
        AllServersMap, Script,
        isScriptFilename}                   from "./Script";
import {AllServers, GetServerByHostname,
        getServer, Server}                  from "./Server";
import {Settings}                           from "./Settings";
import {SpecialServerIps,
        SpecialServerNames}                 from "./SpecialServerIps";
import {TextFile, getTextFile}              from "./TextFile";

import {containsAllStrings, longestCommonStart,
        formatNumber}                       from "../utils/StringHelperFunctions";
import {addOffset}                          from "../utils/helpers/addOffset";
import {isString}                           from "../utils/helpers/isString";
import {arrayToString}                      from "../utils/helpers/arrayToString";
import {logBoxCreate}                       from "../utils/LogBox";
import {yesNoBoxCreate,
        yesNoBoxGetYesButton,
        yesNoBoxGetNoButton, yesNoBoxClose} from "../utils/YesNoBox";

import * as JSZip from 'jszip';
import * as FileSaver from 'file-saver';

/* Write text to terminal */
//If replace is true then spaces are replaced with "&nbsp;"
function post(input) {
    $("#terminal-input").before('<tr class="posted"><td class="terminal-line" style="color: var(--my-font-color); background-color: var(--my-background-color); white-space:pre-wrap;">' + input + '</td></tr>');
	updateTerminalScroll();
}

//Same thing as post but the td cells have ids so they can be animated for the hack progress bar
function hackProgressBarPost(input) {
    $("#terminal-input").before('<tr class="posted"><td id="hack-progress-bar" style="color: var(--my-font-color); background-color: var(--my-background-color);">' + input + '</td></tr>');
	updateTerminalScroll();
}

function hackProgressPost(input) {
    $("#terminal-input").before('<tr class="posted"><td id="hack-progress" style="color: var(--my-font-color); background-color: var(--my-background-color);">' + input + '</td></tr>');
	updateTerminalScroll();
}

//Scroll to the bottom of the terminal's 'text area'
function updateTerminalScroll() {
	var element = document.getElementById("terminal-container");
	element.scrollTop = element.scrollHeight;
}

function postNetburnerText() {
	post("Bitburner v" + CONSTANTS.Version);
}


//Key Codes
var KEY = {
    TAB:            9,
    ENTER:          13,
    CTRL:           17,
    UPARROW:        38,
    DOWNARROW:      40,
    A:              65,
    B:              66,
    C:              67,
    D:              68,
    E:              69,
    F:              70,
    H:              72,
    J:              74,
    K:              75,
    L:              76,
    M:              77,
    N:              78,
    O:              79,
    P:              80,
    R:              82,
    S:              83,
    U:              85,
    W:              87,
}

//Defines key commands in terminal
$(document).keydown(function(event) {
	//Terminal
	if (Engine.currentPage == Engine.Page.Terminal) {
        var terminalInput = document.getElementById("terminal-input-text-box");
        if (terminalInput != null && !event.ctrlKey && !event.shiftKey) {terminalInput.focus();}

		if (event.keyCode === KEY.ENTER) {
            event.preventDefault(); //Prevent newline from being entered in Script Editor
			var command = $('input[class=terminal-input]').val();
			if (command.length > 0) {
                post(
                    "[" +
                    (FconfSettings.ENABLE_TIMESTAMPS ? Terminal.getTimestamp() + " " : "") +
                    Player.getCurrentServer().hostname +
                    " ~]> " + command
                );

                Terminal.resetTerminalInput();      //Clear input first
				Terminal.executeCommand(command);
			}
		}

		if (event.keyCode === KEY.C && event.ctrlKey) {
            if (Engine._actionInProgress) {
                //Cancel action
                post("Cancelling...");
    			Engine._actionInProgress = false;
    			Terminal.finishAction(true);
            } else if (FconfSettings.ENABLE_BASH_HOTKEYS) {
                //Dont prevent default so it still copies
                Terminal.resetTerminalInput();  //Clear Terminal
            }
		}

        if (event.keyCode === KEY.L && event.ctrlKey) {
            event.preventDefault();
            Terminal.executeCommand("clear"); //Clear screen
        }

        //Ctrl p same as up arrow
        //Ctrl n same as down arrow

        if (event.keyCode === KEY.UPARROW ||
            (FconfSettings.ENABLE_BASH_HOTKEYS && event.keyCode === KEY.P && event.ctrlKey)) {
            if (FconfSettings.ENABLE_BASH_HOTKEYS) {event.preventDefault();}
            //Cycle through past commands
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

        if (event.keyCode === KEY.DOWNARROW ||
            (FconfSettings.ENABLE_BASH_HOTKEYS && event.keyCode === KEY.M && event.ctrlKey)) {
            if (FconfSettings.ENABLE_BASH_HOTKEYS) {event.preventDefault();}
            //Cycle through past commands
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

        if (event.keyCode === KEY.TAB) {
            event.preventDefault();

            //Autocomplete
            if (terminalInput == null) {return;}
            var input = terminalInput.value;
            if (input == "") {return;}
            input = input.trim();
            input = input.replace(/\s\s+/g, ' ');

            var commandArray = input.split(" ");
            var index = commandArray.length - 2;
            if (index < -1) {index = 0;}
            var allPos = determineAllPossibilitiesForTabCompletion(input, index);
            if (allPos.length == 0) {return;}

            var arg = "";
            var command = "";
            if (commandArray.length == 0) {return;}
            if (commandArray.length == 1) {command = commandArray[0];}
            else if (commandArray.length == 2) {
                command = commandArray[0];
                arg = commandArray[1];
            } else if (commandArray.length == 3) {
                command = commandArray[0] + " " + commandArray[1];
                arg = commandArray[2];
            } else {
                arg = commandArray.pop();
                command = commandArray.join(" ");
            }

            tabCompletion(command, arg, allPos);
            terminalInput.focus();
        }

        //Extra Bash Emulation Hotkeys, must be enabled through .fconf
        if (FconfSettings.ENABLE_BASH_HOTKEYS) {
            if (event.keyCode === KEY.A && event.ctrlKey) {
                event.preventDefault();
                Terminal.moveTextCursor("home");
            }

            if (event.keyCode === KEY.E && event.ctrlKey) {
                event.preventDefault();
                Terminal.moveTextCursor("end");
            }

            if (event.keyCode === KEY.B && event.ctrlKey) {
                event.preventDefault();
                Terminal.moveTextCursor("prevchar");
            }

            if (event.keyCode === KEY.B && event.altKey) {
                event.preventDefault();
                Terminal.moveTextCursor("prevword");
            }

            if (event.keyCode === KEY.F && event.ctrlKey) {
                event.preventDefault();
                Terminal.moveTextCursor("nextchar");
            }

            if (event.keyCode === KEY.F && event.altKey) {
                event.preventDefault();
                Terminal.moveTextCursor("nextword");
            }


            if ((event.keyCode === KEY.H || event.keyCode === KEY.D) && event.ctrlKey) {
                Terminal.modifyInput("backspace");
                event.preventDefault();
            }

            //TODO AFTER THIS:

            //alt + d deletes word after cursor
            //^w deletes word before cursor
            //^k clears line after cursor
            //^u clears line before cursor
        }
	}
});

//Keep terminal in focus
let terminalCtrlPressed = false, shiftKeyPressed = false;
$(document).ready(function() {
	if (Engine.currentPage === Engine.Page.Terminal) {
		$('.terminal-input').focus();
	}
});
$(document).keydown(function(e) {
	if (Engine.currentPage == Engine.Page.Terminal) {
		if (e.which == 17) {
			terminalCtrlPressed = true;
		} else if (e.shiftKey) {
            shiftKeyPressed = true;
        } else if (terminalCtrlPressed || shiftKeyPressed) {
			//Don't focus
		} else {
            var inputTextBox = document.getElementById("terminal-input-text-box");
            if (inputTextBox != null) {inputTextBox.focus();}

			terminalCtrlPressed = false;
            shiftKeyPressed = false;
		}
	}
})
$(document).keyup(function(e) {
	if (Engine.currentPage == Engine.Page.Terminal) {
		if (e.which == 17) {
			terminalCtrlPressed = false;
		}
        if (e.shiftKey) {
            shiftKeyPressed = false;
        }
	}
})

//Implements a tab completion feature for terminal
//  command - Terminal command except for the last incomplete argument
//  arg - Incomplete argument string that the function will try to complete, or will display
//        a series of possible options for
//  allPossibilities - Array of strings containing all possibilities that the
//                     string can complete to
//  index - index of argument that is being "tab completed". By default is 0, the first argument
function tabCompletion(command, arg, allPossibilities, index=0) {
    if (!(allPossibilities.constructor === Array)) {return;}
    if (!containsAllStrings(allPossibilities)) {return;}

    //if (!command.startsWith("./")) {
        //command = command.toLowerCase();
    //}

    //Remove all options in allPossibilities that do not match the current string
    //that we are attempting to autocomplete
    if (arg == "") {
        for (var i = allPossibilities.length-1; i >= 0; --i) {
            if (!allPossibilities[i].toLowerCase().startsWith(command.toLowerCase())) {
                allPossibilities.splice(i, 1);
            }
        }
    } else {
        for (var i = allPossibilities.length-1; i >= 0; --i) {
            if (!allPossibilities[i].toLowerCase().startsWith(arg.toLowerCase())) {
                allPossibilities.splice(i, 1);
            }
        }
    }

    var val = "";
    if (allPossibilities.length == 0) {
        return;
    } else if (allPossibilities.length == 1) {
        if (arg == "") {
            //Autocomplete command
            val = allPossibilities[0] + " ";
        } else {
            val = command + " " + allPossibilities[0];
        }
        document.getElementById("terminal-input-text-box").value = val;
        document.getElementById("terminal-input-text-box").focus();
    } else {
        var longestStartSubstr = longestCommonStart(allPossibilities);
        //If the longest common starting substring of remaining possibilities is the same
        //as whatevers already in terminal, just list all possible options. Otherwise,
        //change the input in the terminal to the longest common starting substr
        var allOptionsStr = "";
        for (var i = 0; i < allPossibilities.length; ++i) {
            allOptionsStr += allPossibilities[i];
            allOptionsStr += "   ";
        }
        if (arg == "") {
            if (longestStartSubstr == command) {
                post("> " + command);
                post(allOptionsStr);
            } else {
                document.getElementById("terminal-input-text-box").value = longestStartSubstr;
                document.getElementById("terminal-input-text-box").focus();
            }
        } else {
            if (longestStartSubstr == arg) {
                //List all possible options
                post("> " + command + " " + arg);
                post(allOptionsStr);
            } else {
                document.getElementById("terminal-input-text-box").value = command + " " + longestStartSubstr;
                document.getElementById("terminal-input-text-box").focus();
            }
        }

    }
}

function determineAllPossibilitiesForTabCompletion(input, index=0) {
    var allPos = [];
    allPos = allPos.concat(Object.keys(GlobalAliases));
    var currServ = Player.getCurrentServer();
    input = input.toLowerCase();

    //If the command starts with './' and the index == -1, then the user
    //has input ./partialexecutablename so autocomplete the script or program
    //Put './' in front of each script/executable
    if (input.startsWith("./") && index == -1) {
        //All programs and scripts
        for (var i = 0; i < currServ.scripts.length; ++i) {
            allPos.push("./" + currServ.scripts[i].filename);
        }

        //Programs are on home computer
        var homeComputer = Player.getHomeComputer();
        for(var i = 0; i < homeComputer.programs.length; ++i) {
            allPos.push("./" + homeComputer.programs[i]);
        }
        return allPos;
    }

    //Autocomplete the command
    if (index == -1) {
        return ["alias", "analyze", "cat", "check", "clear", "cls", "connect", "download", "free",
                "hack", "help", "home", "hostname", "ifconfig", "kill", "killall",
                "ls", "lscpu", "mem", "nano", "ps", "rm", "run", "scan", "scan-analyze",
                "scp", "sudov", "tail", "theme", "top"].concat(Object.keys(Aliases)).concat(Object.keys(GlobalAliases));
    }

    if (input.startsWith ("buy ")) {
        let options = [];
        for(const i in DarkWebItems) {
            const item = DarkWebItems[i]
            options.push(item.program);
        }
        return options.concat(Object.keys(GlobalAliases));
    }

    if (input.startsWith("scp ") && index == 1) {
        for (var iphostname in AllServers) {
            if (AllServers.hasOwnProperty(iphostname)) {
                allPos.push(AllServers[iphostname].ip);
                allPos.push(AllServers[iphostname].hostname);
            }
        }
    }

    if (input.startsWith("scp ") && index == 0) {
        //All Scripts and lit files
        for (var i = 0; i < currServ.scripts.length; ++i) {
            allPos.push(currServ.scripts[i].filename);
        }
        for (var i = 0; i < currServ.messages.length; ++i) {
            if (!(currServ.messages[i] instanceof Message)) {
                allPos.push(currServ.messages[i]);
            }
        }
        for (var i = 0; i < currServ.textFiles.length; ++i) {
            allPos.push(currServ.textFiles[i].fn);
        }
    }

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

    if (input.startsWith("kill ") || input.startsWith("tail ") ||
        input.startsWith("mem ") || input.startsWith("check ")) {
        //All Scripts
        for (var i = 0; i < currServ.scripts.length; ++i) {
            allPos.push(currServ.scripts[i].filename);
        }
        return allPos;
    }

    if (input.startsWith("nano ")) {
        //Scripts and text files and .fconf
        for (var i = 0; i < currServ.scripts.length; ++i) {
            allPos.push(currServ.scripts[i].filename);
        }
        for (var i = 0; i < currServ.textFiles.length; ++i) {
            allPos.push(currServ.textFiles[i].fn);
        }
        allPos.push(".fconf");
        return allPos;
    }

    if (input.startsWith("rm ")) {
        for (var i = 0; i < currServ.scripts.length; ++i) {
            allPos.push(currServ.scripts[i].filename);
        }
        for (var i = 0; i < currServ.programs.length; ++i) {
            allPos.push(currServ.programs[i]);
        }
        for (var i = 0; i < currServ.messages.length; ++i) {
            if (!(currServ.messages[i] instanceof Message) && isString(currServ.messages[i]) &&
                  currServ.messages[i].endsWith(".lit")) {
                allPos.push(currServ.messages[i]);
            }
        }
        for (var i = 0; i < currServ.textFiles.length; ++i) {
            allPos.push(currServ.textFiles[i].fn);
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

    if (input.startsWith("cat ")) {
        for (var i = 0; i < currServ.messages.length; ++i) {
            if (currServ.messages[i] instanceof Message) {
                allPos.push(currServ.messages[i].filename);
            } else {
                allPos.push(currServ.messages[i]);
            }
        }
        for (var i = 0; i < currServ.textFiles.length; ++i) {
            allPos.push(currServ.textFiles[i].fn);
        }
        return allPos;
    }

    if (input.startsWith("download ")) {
        for (var i = 0; i < currServ.textFiles.length; ++i) {
            allPos.push(currServ.textFiles[i].fn);
        }
        for (var i = 0; i < currServ.scripts.length; ++i) {
            allPos.push(currServ.scripts[i].filename);
        }
    }
    return allPos;
}

let Terminal = {
    //Flags to determine whether the player is currently running a hack or an analyze
    hackFlag:       false,
    analyzeFlag:    false,

    commandHistory: [],
    commandHistoryIndex: 0,

    resetTerminalInput: function() {
        document.getElementById("terminal-input-td").innerHTML =
            "<div id='terminal-input-header'>[" + Player.getCurrentServer().hostname + " ~]" + "$ </div>" +
            '<input type="text" id="terminal-input-text-box" class="terminal-input" tabindex="1"/>';
        var hdr = document.getElementById("terminal-input-header");
        hdr.style.display = "inline";
    },

    modifyInput: function(mod) {
        try {
            var terminalInput = document.getElementById("terminal-input-text-box");
            if (terminalInput == null) {return;}
            terminalInput.focus();

            var inputLength = terminalInput.value.length;
            var start = terminalInput.selectionStart;
            var end = terminalInput.selectionEnd;
            var inputText = terminalInput.value;

            switch(mod.toLowerCase()) {
                case "backspace":
                    if (start > 0 && start <= inputLength+1) {
                        terminalInput.value = inputText.substr(0, start-1) + inputText.substr(start);
                    }
                    break;
                case "deletewordbefore":    //Delete rest of word before the cursor
                    for (var delStart = start-1; delStart > 0; --delStart) {
                        if (inputText.charAt(delStart) === " ") {
                            terminalInput.value = inputText.substr(0, delStart) + inputText.substr(start);
                            return;
                        }
                    }
                    break;
                case "deletewordafter":     //Delete rest of word after the cursor
                    for (var delStart = start+1; delStart <= text.length+1; ++delStart) {
                        if (inputText.charAt(delStart) === " ") {
                            terminalInput.value = inputText.substr(0, start) + inputText.substr(delStart);
                            return;
                        }
                    }
                    break;
                case "clearafter":          //Deletes everything after cursor
                    break;
                case "clearbefore:":        //Deleetes everything before cursor
                    break;
            }
        } catch(e) {
            console.log("Exception in Terminal.modifyInput: " + e);
        }
    },

    moveTextCursor: function(loc) {
        try {
            var terminalInput = document.getElementById("terminal-input-text-box");
            if (terminalInput == null) {return;}
            terminalInput.focus();

            var inputLength = terminalInput.value.length;
            var start = terminalInput.selectionStart;
            var end = terminalInput.selectionEnd;

            switch(loc.toLowerCase()) {
                case "home":
                    terminalInput.setSelectionRange(0,0);
                    break;
                case "end":
                    terminalInput.setSelectionRange(inputLength, inputLength);
                    break;
                case "prevchar":
                    if (start > 0) {terminalInput.setSelectionRange(start-1, start-1);}
                    break;
                case "prevword":
                    for (var i = start-2; i >= 0; --i) {
                        if (terminalInput.value.charAt(i) === " ") {
                            terminalInput.setSelectionRange(i+1, i+1);
                            return;
                        }
                    }
                    terminalInput.setSelectionRange(0, 0);
                    break;
                case "nextchar":
                    terminalInput.setSelectionRange(start+1, start+1);
                    break;
                case "nextword":
                    for (var i = start+1; i <= inputLength; ++i) {
                        if (terminalInput.value.charAt(i) === " ") {
                            terminalInput.setSelectionRange(i, i);
                            return;
                        }
                    }
                    terminalInput.setSelectionRange(inputLength, inputLength);
                    break;
                default:
                    console.log("WARNING: Invalid loc argument in Terminal.moveTextCursor()");
                    break;
            }
        } catch(e) {
            console.log("Exception in Terminal.moveTextCursor: " + e);
        }
    },

    getTimestamp: function() {
        let d = new Date();
        return (d.getMonth() + "/" + d.getDay() + " " + d.getHours() + ":" + d.getMinutes());
    },

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
            var server = Player.getCurrentServer();

			//Calculate whether hack was successful
			var hackChance = Player.calculateHackingChance();
			var rand = Math.random();
			console.log("Hack success chance: " + hackChance +  ", rand: " + rand);
			var expGainedOnSuccess = Player.calculateExpGain();
			var expGainedOnFailure = (expGainedOnSuccess / 4);
			if (rand < hackChance) {	//Success!
                if (SpecialServerIps[SpecialServerNames.WorldDaemon] &&
                    SpecialServerIps[SpecialServerNames.WorldDaemon] == server.ip) {
                    if (Player.bitNodeN == null) {
                        Player.bitNodeN = 1;
                    }
                    hackWorldDaemon(Player.bitNodeN);
                    return;
                }
                server.manuallyHacked = true;
				var moneyGained = Player.calculatePercentMoneyHacked();
				moneyGained = Math.floor(server.moneyAvailable * moneyGained);

				if (moneyGained <= 0) {moneyGained = 0;} //Safety check

				server.moneyAvailable -= moneyGained;
				Player.gainMoney(moneyGained);
                Player.gainHackingExp(expGainedOnSuccess)
                Player.gainIntelligenceExp(expGainedOnSuccess / CONSTANTS.IntelligenceTerminalHackBaseExpGain);

                server.fortify(CONSTANTS.ServerFortifyAmount);

				post("Hack successful! Gained $" + formatNumber(moneyGained, 2) + " and " + formatNumber(expGainedOnSuccess, 4) + " hacking EXP");
			} else {					//Failure
				//Player only gains 25% exp for failure? TODO Can change this later to balance
                Player.gainHackingExp(expGainedOnFailure)
				post("Failed to hack " + server.hostname + ". Gained " + formatNumber(expGainedOnFailure, 4) + " hacking EXP");
			}
		}

        //Rename the progress bar so that the next hacks dont trigger it. Re-enable terminal
        $("#hack-progress-bar").attr('id', "old-hack-progress-bar");
        $("#hack-progress").attr('id', "old-hack-progress");
        Terminal.resetTerminalInput();
        $('input[class=terminal-input]').prop('disabled', false);

        Terminal.hackFlag = false;
	},

    finishAnalyze: function(cancelled = false) {
		if (cancelled == false) {
			post(Player.getCurrentServer().hostname + ": ");
            post("Organization name: " + Player.getCurrentServer().organizationName);
            var rootAccess = "";
            if (Player.getCurrentServer().hasAdminRights) {rootAccess = "YES";}
            else {rootAccess = "NO";}
            post("Root Access: " + rootAccess);
			post("Required hacking skill: " + Player.getCurrentServer().requiredHackingSkill);
			post("Estimated server security level: " + formatNumber(addOffset(Player.getCurrentServer().hackDifficulty, 5), 3));
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
        Terminal.resetTerminalInput();
        $('input[class=terminal-input]').prop('disabled', false);
    },

	executeCommand:  function(command) {
        command = command.trim();
        //Replace all extra whitespace in command with a single space
        command = command.replace(/\s\s+/g, ' ');

        //Terminal history
        if (Terminal.commandHistory[Terminal.commandHistory.length-1] != command) {
            Terminal.commandHistory.push(command);
            if (Terminal.commandHistory.length > 50) {
                Terminal.commandHistory.splice(0, 1);
            }
        }
        Terminal.commandHistoryIndex = Terminal.commandHistory.length;

        //Process any aliases
        command = substituteAliases(command);

        //Allow usage of ./
        if (command.startsWith("./")) {
            command = "run " + command.slice(2);
        }

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
                    post(TerminalHelpText);
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
            case iTutorialSteps.TerminalScanAnalyze1:
                if (commandArray.length == 1 && commandArray[0] == "scan-analyze") {
                    Terminal.executeScanAnalyzeCommand(1);
                    iTutorialNextStep();
                } else {post("Bad command. Please follow the tutorial");}
                break;
            case iTutorialSteps.TerminalScanAnalyze2:
                if (commandArray.length == 2 && commandArray[0] == "scan-analyze" &&
                    commandArray[1] == "2") {
                    Terminal.executeScanAnalyzeCommand(2);
                    iTutorialNextStep();
                } else {post("Bad command. Please follow the tutorial");}
                break;
                break;
            case iTutorialSteps.TerminalConnect:
                if (commandArray.length == 2) {
                    if ((commandArray[0] == "connect") &&
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
                    //Terminal.resetTerminalInput();
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
                    //Terminal.resetTerminalInput();
					document.getElementById("terminal-input-td").innerHTML = '<input type="text" class="terminal-input"/>';
					$('input[class=terminal-input]').prop('disabled', true);
                    iTutorialNextStep();
                } else {post("Bad command. Please follow the tutorial");}
				break;
            case iTutorialSteps.TerminalCreateScript:
                if (commandArray.length == 2 &&
                    commandArray[0] == "nano" && commandArray[1] == "foodnstuff.script") {
                    Engine.loadScriptEditorContent("foodnstuff.script", "");
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
                    //Check that the script exists on this machine
                    var runningScript = findRunningScript("foodnstuff.script", [], Player.getCurrentServer());
                    if (runningScript == null) {
                        post("Error: No such script exists");
                        return;
                    }
                    logBoxCreate(runningScript);
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
        var s = Player.getCurrentServer();
		switch (commandArray[0].toLowerCase()) {
            case "alias":
                if (commandArray.length == 1) {
                    printAliases();
                    return;
                }
                if (commandArray.length == 2) {
                    if (commandArray[1].startsWith("-g ")) {
                        var alias = commandArray[1].substring(3);
                        if (parseAliasDeclaration(alias, true)) {
                            return;
                        }
                    } else {
                        if (parseAliasDeclaration(commandArray[1])) {
                            return;
                        }
                    }
                }
                post('Incorrect usage of alias command. Usage: alias [-g] [aliasname="value"]');
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
                //Terminal.resetTerminalInput();
                document.getElementById("terminal-input-td").innerHTML = '<input type="text" class="terminal-input"/>';
                $('input[class=terminal-input]').prop('disabled', true);
				break;
            case "buy":
                if (SpecialServerIps.hasOwnProperty("Darkweb Server")) {
                    executeDarkwebTerminalCommand(commandArray);
                } else {
                    post("You need to be able to connect to the Dark Web to use the buy command. (Maybe there's a TOR router you can buy somewhere)");
                }
                break;
            case "cat":
                if (commandArray.length != 2) {
                    post("Incorrect usage of cat command. Usage: cat [file]"); return;
                }
                var filename = commandArray[1];
				if (!filename.endsWith(".msg") && !filename.endsWith(".lit") && !filename.endsWith(".txt")) {
					post("Error: Only .msg, .txt, and .lit files are viewable with cat (filename must end with .msg, .txt, or .lit)"); return;
				}
                for (var i = 0; i < s.messages.length; ++i) {
                    if (filename.endsWith(".lit") && s.messages[i] == filename) {
                        showLiterature(s.messages[i]);
                        return;
                    } else if (filename.endsWith(".msg") && s.messages[i].filename == filename) {
                        showMessage(s.messages[i]);
                        return;
                    }
                }
                for (var i = 0; i < s.textFiles.length; ++i) {
                    if (s.textFiles[i].fn === filename) {
                        s.textFiles[i].show();
                        return;
                    }
                }
                post("Error: No such file " + filename);
                break;
            case "check":
                if (commandArray.length < 2) {
                    post("Incorrect number of arguments. Usage: check [script] [arg1] [arg2]...");
                } else {
                    var results = commandArray[1].split(" ");
                    var scriptName = results[0];
                    var args = [];
                    for (var i = 1; i < results.length; ++i) {
                        args.push(results[i]);
                    }

                    //Can only tail script files
                    if (isScriptFilename(scriptName) == false) {
                        post("Error: tail can only be called on .script files (filename must end with .script)"); return;
                    }

                    //Check that the script exists on this machine
                    var runningScript = findRunningScript(scriptName, args, s);
                    if (runningScript == null) {
                        post("Error: No such script exists");
                        return;
                    }
                    runningScript.displayLog();
                }
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
                    post("Incorrect usage of connect command. Usage: connect [ip/hostname]");
                    return;
                }

                var ip = commandArray[1];

                for (var i = 0; i < Player.getCurrentServer().serversOnNetwork.length; i++) {
                    if (Player.getCurrentServer().getServerOnNetwork(i).ip == ip || Player.getCurrentServer().getServerOnNetwork(i).hostname == ip) {
                        Terminal.connectToServer(ip);
                        return;
                    }
                }

                post("Host not found");
				break;
            case "download":
                if (commandArray.length != 2) {
                    post("Incorrect usage of download command. Usage: download [text file]");
                    return;
                }
                var fn = commandArray[1];
                if (fn === "*" || fn === "*.script" || fn === "*.txt") {
                    //Download all scripts as a zip
                    var zip = new JSZip();
                    if (fn === "*" || fn === "*.script") {
                        for (var i = 0; i < s.scripts.length; ++i) {
                            var file = new Blob([s.scripts[i].code], {type:"text/plain"});
                            zip.file(s.scripts[i].filename + ".js", file);
                        }
                    }
                    if (fn === "*" || fn === "*.txt") {
                        for (var i = 0; i < s.textFiles.length; ++i) {
                            var file = new Blob([s.textFiles[i].text], {type:"text/plain"});
                            zip.file(s.textFiles[i].fn, file);
                        }
                    }

                    var filename;
                    switch (fn) {
                        case "*.script":
                            filename = "bitburnerScripts.zip"; break;
                        case "*.txt":
                            filename = "bitburnerTexts.zip"; break;
                        default:
                            filename = "bitburnerFiles.zip"; break;
                    }

                    zip.generateAsync({type:"blob"}).then(function(content) {
                        FileSaver.saveAs(content, filename);
                    });
                    return;
                } else if (isScriptFilename(fn)) {
                    //Download a single script
                    for (var i = 0; i < s.scripts.length; ++i) {
                        if (s.scripts[i].filename === fn) {
                            return s.scripts[i].download();
                        }
                    }
                } else if (fn.endsWith(".txt")) {
                    //Download a single text file
                    var txtFile = getTextFile(fn, s);
                    if (txtFile !== null) {
                        return txtFile.download();
                    }
                }
                post("Error: " + fn + " does not exist");
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
                    //Terminal.resetTerminalInput();
					document.getElementById("terminal-input-td").innerHTML = '<input type="text" class="terminal-input"/>';
					$('input[class=terminal-input]').prop('disabled', true);
				}
				break;
			case "help":
				if (commandArray.length != 1 && commandArray.length != 2) {
					post("Incorrect usage of help command. Usage: help"); return;
				}
				if (commandArray.length == 1) {
                    post(TerminalHelpText);
                } else {
                    var cmd = commandArray[1];
                    var txt = HelpTexts[cmd];
                    if (txt == null) {
                        post("Error: No help topics match '" + cmd + "'");
                        return;
                    }
                    post(txt);
                }
				break;
			case "home":
				if (commandArray.length != 1) {
                    post("Incorrect usage of home command. Usage: home"); return;
                }
                Player.getCurrentServer().isConnectedTo = false;
                Player.currentServer = Player.getHomeComputer().ip;
                Player.getCurrentServer().isConnectedTo = true;
                post("Connected to home");
                Terminal.resetTerminalInput();
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
				if (commandArray.length < 2) {
					post("Incorrect usage of kill command. Usage: kill [scriptname] [arg1] [arg2]..."); return;
				}
                var results = commandArray[1].split(" ");
				var scriptName = results[0];
                var args = [];
                for (var i = 1; i < results.length; ++i) {
                    args.push(results[i]);
                }
                var runningScript = findRunningScript(scriptName, args, s);
                if (runningScript == null) {
                    post("No such script is running. Nothing to kill");
                    return;
                }
                killWorkerScript(runningScript, s.ip);
                post("Killing " + scriptName + ". May take up to a few minutes for the scripts to die...");
				break;
            case "killall":
                for (var i = s.runningScripts.length-1; i >= 0; --i) {
                    killWorkerScript(s.runningScripts[i], s.ip);
                }
                post("Killing all running scripts. May take up to a few minutes for the scripts to die...");
                break;
			case "ls":
                Terminal.executeListCommand(commandArray);
				break;
            case "lscpu":
                post(Player.getCurrentServer().cpuCores + " Core(s)");
                break;
            case "mem":
                if (commandArray.length != 2) {
                    post("Incorrect usage of mem command. usage: mem [scriptname] [-t] [number threads]"); return;
                }
                var scriptName = commandArray[1];
                var numThreads = 1;
                if (scriptName.indexOf(" -t ") != -1) {
                    var results = scriptName.split(" ");
                    if (results.length != 3) {
                        post("Invalid use of run command. Usage: mem [script] [-t] [number threads]");
                        return;
                    }
                    numThreads = Math.round(Number(results[2]));
                    if (isNaN(numThreads) || numThreads < 1) {
                        post("Invalid number of threads specified. Number of threads must be greater than 1");
                        return;
                    }
                    scriptName = results[0];
                }

                var currServ = Player.getCurrentServer();
                for (var i = 0; i < currServ.scripts.length; ++i) {
                    if (scriptName == currServ.scripts[i].filename) {
                        var scriptBaseRamUsage = currServ.scripts[i].ramUsage;
                        var ramUsage = scriptBaseRamUsage * numThreads;

                        post("This script requires " + formatNumber(ramUsage, 2) + "GB of RAM to run for " + numThreads + " thread(s)");
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
                if (filename === ".fconf") {
                    var text = createFconf();
                    Engine.loadScriptEditorContent(filename, text);
                    return;
                } else if (isScriptFilename(filename)) {
                    for (var i = 0; i < s.scripts.length; i++) {
    					if (filename == s.scripts[i].filename) {
    						Engine.loadScriptEditorContent(filename, s.scripts[i].code);
    						return;
    					}
    				}
                } else if (filename.endsWith(".txt")) {
                    for (var i = 0; i < s.textFiles.length; ++i) {
                        if (filename === s.textFiles[i].fn) {
                            Engine.loadScriptEditorContent(filename, s.textFiles[i].text);
                            return;
                        }
                    }
                } else {
                    post("Error: Invalid file. Only scripts (.script, .ns, .js), text files (.txt), or .fconf can be edited with nano"); return;
                }
                Engine.loadScriptEditorContent(filename);
				break;
			case "ps":
				if (commandArray.length != 1) {
					post("Incorrect usage of ps command. Usage: ps"); return;
				}
				for (var i = 0; i < s.runningScripts.length; i++) {
                    var rsObj = s.runningScripts[i];
                    var res = rsObj.filename;
                    for (var j = 0; j < rsObj.args.length; ++j) {
                        res += (" " + rsObj.args[j].toString());
                    }
					post(res);
				}
				break;
			case "rm":
				if (commandArray.length != 2) {
                    post("Incorrect number of arguments. Usage: rm [program/script]"); return;
                }

                //Check programs
                var delTarget = commandArray[1];

                if (delTarget.includes(".exe")) {
                    for (var i = 0; i < s.programs.length; ++i) {
                        if (s.programs[i] == delTarget) {
                           s.programs.splice(i, 1);
                           return;
                        }
                    }
                } else if (isScriptFilename(delTarget)) {
                    for (var i = 0; i < s.scripts.length; ++i) {
                        if (s.scripts[i].filename == delTarget) {
                            //Check that the script isnt currently running
                            for (var j = 0; j < s.runningScripts.length; ++j) {
                                if (s.runningScripts[j].filename == delTarget) {
                                    post("Cannot delete a script that is currently running!");
                                    return;
                                }
                            }
                            s.scripts.splice(i, 1);
                            return;
                        }
                    }
                } else if (delTarget.endsWith(".lit")) {
                    for (var i = 0; i < s.messages.length; ++i) {
                        var f = s.messages[i];
                        if (!(f instanceof Message) && isString(f) && f === delTarget) {
                            s.messages.splice(i, 1);
                            return;
                        }
                    }
                } else if (delTarget.endsWith(".txt")) {
                    for (var i = 0; i < s.textFiles.length; ++i) {
                        if (s.textFiles[i].fn === delTarget) {
                            s.textFiles.splice(i, 1);
                            return;
                        }
                    }
                }
                post("Error: No such file exists");
				break;
			case "run":
				//Run a program or a script
				if (commandArray.length != 2) {
					post("Incorrect number of arguments. Usage: run [program/script] [-t] [num threads] [arg1] [arg2]...");
				} else {
					var executableName = commandArray[1];

                    //Secret Music player!
                    if (executableName === "musicplayer") {
                        post('<iframe src="https://open.spotify.com/embed/user/danielyxie/playlist/1ORnnL6YNvXOracUaUV2kh" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>', false);
                        return;
                    }

					//Check if its a script or just a program/executable
					//if (isScriptFilename(executableName)) {
                    if (executableName.includes(".script") || executableName.includes(".js") || executableName.includes(".ns")) {
						Terminal.runScript(executableName);
					} else {
                        Terminal.runProgram(executableName);
					}
				}
				break;
            case "scan":
                Terminal.executeScanCommand(commandArray);
				break;
            case "scan-analyze":
                if (commandArray.length == 1) {
                    Terminal.executeScanAnalyzeCommand(1);
                } else if (commandArray.length == 2) {
                    var all = false;
                    if (commandArray[1].endsWith("-a")) {
                        all = true;
                        commandArray[1] = commandArray[1].replace("-a", "");
                    }
                    var depth;
                    if (commandArray[1].length === 0) {
                        depth = 1;
                    } else {
                        depth = Number(commandArray[1]);
                    }
                    if (isNaN(depth) || depth < 0) {
                        post("Incorrect usage of scan-analyze command. depth argument must be positive numeric");
                        return;
                    }
                    if (depth > 3 && !Player.hasProgram(Programs.DeepscanV1.name) &&
                        !Player.hasProgram(Programs.DeepscanV2.name)) {
                        post("You cannot scan-analyze with that high of a depth. Maximum depth is 3");
                        return;
                    } else if (depth > 5 && !Player.hasProgram(Programs.DeepscanV2.name)) {
                        post("You cannot scan-analyze with that high of a depth. Maximum depth is 5");
                        return;
                    } else if (depth > 10) {
                        post("You cannot scan-analyze with that high of a depth. Maximum depth is 10");
                        return;
                    }
                    Terminal.executeScanAnalyzeCommand(depth, all);
                } else {
                    post("Incorrect usage of scan-analyze command. usage: scan-analyze [depth]");
                }
                break;
			case "scp":
				if (commandArray.length != 2) {
                    post("Incorrect usage of scp command. Usage: scp [file] [destination hostname/ip]");
                    return;
                }
                var args = commandArray[1].split(" ");
                if (args.length != 2) {
                    post("Incorrect usage of scp command. Usage: scp [file] [destination hostname/ip]");
                    return;
                }
                var scriptname = args[0];
                if (!scriptname.endsWith(".lit") && !isScriptFilename(scriptname) &&
                    !scriptname.endsWith(".txt")){
                    post("Error: scp only works for .script, .txt, and .lit files");
                    return;
                }
                var destServer = getServer(args[1]);
                if (destServer == null) {
                    post("Invalid destination. " + args[1] + " not found");
                    return;
                }
                var ip = destServer.ip;
                var currServ = Player.getCurrentServer();

                //Scp for lit files
                if (scriptname.endsWith(".lit")) {
                    var found = false;
                    for (var i = 0; i < currServ.messages.length; ++i) {
                        if (!(currServ.messages[i] instanceof Message) && currServ.messages[i] == scriptname) {
                            found = true;
                            break;
                        }
                    }

                    if (!found) {return post("Error: no such file exists!");}

                    for (var i = 0; i < destServer.messages.length; ++i) {
                        if (destServer.messages[i] === scriptname) {
                            post(scriptname + " copied over to " + destServer.hostname);
                            return; //Already exists
                        }
                    }
                    destServer.messages.push(scriptname);
                    post(scriptname + " copied over to " + destServer.hostname);
                    return;
                }

                //Scp for txt files
                if (scriptname.endsWith(".txt")) {
                    var found = false, txtFile;
                    for (var i = 0; i < currServ.textFiles.length; ++i) {
                        if (currServ.textFiles[i].fn === scriptname) {
                            found = true;
                            txtFile = currServ.textFiles[i];
                            break;
                        }
                    }

                    if (!found) {return post("Error: no such file exists!");}

                    for (var i = 0; i < destServer.textFiles.length; ++i) {
                        if (destServer.textFiles[i].fn === scriptname) {
                            //Overwrite
                            destServer.textFiles[i].text = txtFile.text;
                            post("WARNING: " + scriptname + " already exists on " + destServer.hostname +
                                 "and will be overwriten");
                            return post(scriptname + " copied over to " + destServer.hostname);
                        }
                    }
                    var newFile = new TextFile(txtFile.fn, txtFile.text);
                    destServer.textFiles.push(newFile);
                    return post(scriptname + " copied over to " + destServer.hostname);
                }

                //Get the current script
                var sourceScript = null;
                for (var i = 0; i < currServ.scripts.length; ++i) {
                    if (scriptname == currServ.scripts[i].filename) {
                        sourceScript = currServ.scripts[i];
                        break;
                    }
                }
                if (sourceScript == null) {
                    post("ERROR: scp() failed. No such script exists");
                    return;
                }

                //Overwrite script if it exists
                for (var i = 0; i < destServer.scripts.length; ++i) {
                    if (scriptname == destServer.scripts[i].filename) {
                        post("WARNING: " + scriptname + " already exists on " + destServer.hostname + " and will be overwritten");
                        var oldScript = destServer.scripts[i];
                        oldScript.code = sourceScript.code;
                        oldScript.ramUsage = sourceScript.ramUsage;
                        oldScript.module = "";
                        post(scriptname + " overwriten on " + destServer.hostname);
                        return;
                    }
                }

                var newScript = new Script();
                newScript.filename = scriptname;
                newScript.code = sourceScript.code;
                newScript.ramUsage = sourceScript.ramUsage;
                newScript.destServer = ip;
                destServer.scripts.push(newScript);
                post(scriptname + " copied over to " + destServer.hostname);
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
				if (commandArray.length < 2) {
                    post("Incorrect number of arguments. Usage: tail [script] [arg1] [arg2]...");
                } else {
                    var results = commandArray[1].split(" ");
                    var scriptName = results[0];
                    var args = [];
                    for (var i = 1; i < results.length; ++i) {
                        args.push(results[i]);
                    }

                    //Can only tail script files
                    if (isScriptFilename(scriptName) == false) {
                        post("Error: tail can only be called on .script files (filename must end with .script)"); return;
                    }

                    //Check that the script exists on this machine
                    var runningScript = findRunningScript(scriptName, args, s);
                    if (runningScript == null) {
                        post("Error: No such script exists");
                        return;
                    }
                    logBoxCreate(runningScript);
                }
				break;
            case "theme":
                //todo support theme saving
                var args = commandArray[1] ? commandArray[1].split(" ") : [];
                if (args.length != 1 && args.length != 3) {
                    post("Incorrect number of arguments.");
                    post("Usage: theme [default|muted|solarized] | #[background color hex] #[text color hex] #[highlight color hex]");
                } else if(args.length == 1){
                    var themeName = args[0];
                    if (themeName == "default"){
                        document.body.style.setProperty('--my-highlight-color',"#ffffff");
                        document.body.style.setProperty('--my-font-color',"#66ff33");
                        document.body.style.setProperty('--my-background-color',"#000000");
                    } else if (themeName == "muted"){
                        document.body.style.setProperty('--my-highlight-color',"#ffffff");
                        document.body.style.setProperty('--my-font-color',"#66ff33");
                        document.body.style.setProperty('--my-background-color',"#252527");
                    } else if (themeName == "solarized"){
                        document.body.style.setProperty('--my-highlight-color',"#6c71c4");
                        document.body.style.setProperty('--my-font-color',"#839496");
                        document.body.style.setProperty('--my-background-color',"#002b36");
                    } else {
                        return post("Theme not found");
                    }
                    Settings.ThemeHighlightColor = document.body.style.getPropertyValue("--my-highlight-color");
                    Settings.ThemeFontColor = document.body.style.getPropertyValue("--my-font-color");
                    Settings.ThemeBackgroundColor = document.body.style.getPropertyValue("--my-background-color");
                } else {
                    var inputBackgroundHex = args[0];
                    var inputTextHex = args[1];
                    var inputHighlightHex = args[2];
                    if (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(inputBackgroundHex) &&
                       /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(inputTextHex) &&
                       /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(inputHighlightHex)){
                        document.body.style.setProperty('--my-highlight-color',inputHighlightHex);
                        document.body.style.setProperty('--my-font-color',inputTextHex);
                        document.body.style.setProperty('--my-background-color',inputBackgroundHex);
                        Settings.ThemeHighlightColor = document.body.style.getPropertyValue("--my-highlight-color");
                        Settings.ThemeFontColor = document.body.style.getPropertyValue("--my-font-color");
                        Settings.ThemeBackgroundColor = document.body.style.getPropertyValue("--my-background-color");
                    } else {
                        return post("Invalid Hex Input for theme");
                    }
                }
                break;
			case "top":
				if(commandArray.length != 1) {
				  post("Incorrect usage of top command. Usage: top"); return;
				}

				post("Script                          Threads         RAM Usage");

				var currRunningScripts = Player.getCurrentServer().runningScripts;
				//Iterate through scripts on current server
				for(var i = 0; i < currRunningScripts.length; i++) {
					var script = currRunningScripts[i];

					//Calculate name padding
					var numSpacesScript = 32 - script.filename.length; //26 -> width of name column
                    if (numSpacesScript < 0) {numSpacesScript = 0;}
					var spacesScript = Array(numSpacesScript+1).join(" ");

					//Calculate thread padding
					var numSpacesThread = 16 - (script.threads + "").length; //16 -> width of thread column
					var spacesThread = Array(numSpacesThread+1).join(" ");

					//Calculate and transform RAM usage
					ramUsage = formatNumber(script.scriptRef.ramUsage * script.threads, 2).toString() + "GB";

					var entry = [script.filename, spacesScript, script.threads, spacesThread, ramUsage];
					post(entry.join(""));
				}
				break;
            case "unalias":
                if (commandArray.length != 2) {
                    post('Incorrect usage of unalias name. Usage: unalias "[alias]"');
                    return;
                } else if (!(commandArray[1].startsWith('"') && commandArray[1].endsWith('"'))) {
                    post('Incorrect usage of unalias name. Usage: unalias "[alias]"');
                } else {
                    var alias = commandArray[1].slice(1, -1);
                    if (removeAlias(alias)) {
                        post("Removed alias " + alias);
                    } else {
                        post("No such alias exists");
                    }
                }
                break;
			default:
				post("Command not found");
		}
	},

    connectToServer: function(ip) {
        console.log("Connect to server called");
        var serv = getServer(ip);
        if (serv == null) {
            post("Invalid server. Connection failed.");
            return;
        }
        Player.getCurrentServer().isConnectedTo = false;
        Player.currentServer = serv.ip;
        Player.getCurrentServer().isConnectedTo = true;
        post("Connected to " + serv.hostname);
        if (Player.getCurrentServer().hostname == "darkweb") {
            checkIfConnectedToDarkweb(); //Posts a 'help' message if connecting to dark web
        }
        Terminal.resetTerminalInput();
    },

    executeListCommand: function(commandArray) {
        if (commandArray.length != 1 && commandArray.length != 2) {
            post("Incorrect usage of ls command. Usage: ls [| grep pattern]"); return;
        }

        //grep
        var filter = null;
        if (commandArray.length == 2) {
            if (commandArray[1].startsWith("| grep ")) {
                var pattern = commandArray[1].replace("| grep ", "");
                if (pattern != " ") {
                    filter = pattern;
                }
            } else {
                post("Incorrect usage of ls command. Usage: ls [| grep pattern]"); return;
            }
        }

        //Display all programs and scripts
        var allFiles = [];

        //Get all of the programs and scripts on the machine into one temporary array
        var s = Player.getCurrentServer();
        for (var i = 0; i < s.programs.length; i++) {
            if (filter) {
                if (s.programs[i].includes(filter)) {
                    allFiles.push(s.programs[i]);
                }
            } else {
                allFiles.push(s.programs[i]);
            }
        }
        for (var i = 0; i < s.scripts.length; i++) {
            if (filter) {
                if (s.scripts[i].filename.includes(filter)) {
                    allFiles.push(s.scripts[i].filename);
                }
            } else {
                allFiles.push(s.scripts[i].filename);
            }

        }
        for (var i = 0; i < s.messages.length; i++) {
            if (filter) {
                if (s.messages[i] instanceof Message) {
                    if (s.messages[i].filename.includes(filter)) {
                        allFiles.push(s.messages[i].filename);
                    }
                } else if (s.messages[i].includes(filter)) {
                    allFiles.push(s.messages[i]);
                }
            } else {
                if (s.messages[i] instanceof Message) {
                    allFiles.push(s.messages[i].filename);
                } else {
                    allFiles.push(s.messages[i]);
                }
            }
        }
        for (var i = 0; i < s.textFiles.length; ++i) {
            if (filter) {
                if (s.textFiles[i].fn.includes(filter)) {
                    allFiles.push(s.textFiles[i].fn);
                }
            } else {
                allFiles.push(s.textFiles[i].fn);
            }
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

    executeScanAnalyzeCommand: function(depth=1, all=false) {
        //We'll use the AllServersMap as a visited() array
        //TODO Using array as stack for now, can make more efficient
        post("~~~~~~~~~~ Beginning scan-analyze ~~~~~~~~~~");
        post(" ");
        var visited = new AllServersMap();

        var stack = [];
        var depthQueue = [0];
        var currServ = Player.getCurrentServer();
        stack.push(currServ);
        while(stack.length != 0) {
            var s = stack.pop();
            var d = depthQueue.pop();
            if (!all && s.purchasedByPlayer && s.hostname != "home") {
                continue; //Purchased server
            } else if (visited[s.ip] || d > depth) {
                continue; //Already visited or out-of-depth
            } else {
                visited[s.ip] = 1;
            }
            for (var i = s.serversOnNetwork.length-1; i >= 0; --i) {
                stack.push(s.getServerOnNetwork(i));
                depthQueue.push(d+1);
            }
            if (d == 0) {continue;} //Don't print current server
            var titleDashes = Array((d-1) * 4 + 1).join("-");
            if (Player.hasProgram(Programs.AutoLink.name)) {
                post("<strong>" +  titleDashes + "> <a class='scan-analyze-link'>"  + s.hostname + "</a></strong>", false);
            } else {
                post("<strong>" + titleDashes + ">" + s.hostname + "</strong>");
            }

            var dashes = titleDashes + "--";
            //var dashes = Array(d * 2 + 1).join("-");
            var c = "NO";
            if (s.hasAdminRights) {c = "YES";}
            post(dashes + "Root Access: " + c + ", Required hacking skill: " + s.requiredHackingSkill);
            post(dashes + "Number of open ports required to NUKE: " + s.numOpenPortsRequired);
            post(dashes + "RAM: " + s.maxRam);
            post(" ");
        }

        var links = document.getElementsByClassName("scan-analyze-link");
        for (var i = 0; i < links.length; ++i) {
            (function() {
            var hostname = links[i].innerHTML.toString();
            links[i].onclick = function() {
                if (Terminal.analyzeFlag || Terminal.hackFlag) {return;}
                Terminal.connectToServer(hostname);
            }
            }());//Immediate invocation
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
        var splitArgs = programName.split(" ");
        var name = " ";
        if (splitArgs.length > 1) {
            name = splitArgs[0];
        } else {
            name = programName;
        }
        if (Player.hasProgram(name)) {
            Terminal.executeProgram(programName);
            return;
        }
		post("ERROR: No such executable on home computer (Only programs that exist on your home computer can be run)");
	},

	//Contains the implementations of all possible programs
	executeProgram: function(programName) {
        var s = Player.getCurrentServer();
        var splitArgs = programName.split(" ");
        if (splitArgs.length > 1) {
            programName = splitArgs[0];
        }
		switch (programName) {
			case Programs.NukeProgram.name:
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
            case Programs.BruteSSHProgram.name:
                if (s.sshPortOpen) {
                    post("SSH Port (22) is already open!");
                } else {
                    s.sshPortOpen = true;
                    post("Opened SSH Port(22)!")
                    ++s.openPortCount;
                }
                break;
            case Programs.FTPCrackProgram.name:
                if (s.ftpPortOpen) {
                    post("FTP Port (21) is already open!");
                } else {
                    s.ftpPortOpen = true;
                    post("Opened FTP Port (21)!");
                    ++s.openPortCount;
                }
                break;
            case Programs.RelaySMTPProgram.name:
                if (s.smtpPortOpen) {
                    post("SMTP Port (25) is already open!");
                } else {
                    s.smtpPortOpen = true;
                    post("Opened SMTP Port (25)!");
                    ++s.openPortCount;
                }
                break;
            case Programs.HTTPWormProgram.name:
                if (s.httpPortOpen) {
                    post("HTTP Port (80) is already open!");
                } else {
                    s.httpPortOpen = true;
                    post("Opened HTTP Port (80)!");
                    ++s.openPortCount;
                }
                break;
            case Programs.SQLInjectProgram.name:
                if (s.sqlPortOpen) {
                    post("SQL Port (1433) is already open!");
                } else {
                    s.sqlPortOpen = true;
                    post("Opened SQL Port (1433)!");
                    ++s.openPortCount;
                }
                break;
            case Programs.ServerProfiler.name:
                if (splitArgs.length != 2) {
                    post("Must pass a server hostname or IP as an argument for ServerProfiler.exe");
                    return;
                }
                var serv = getServer(splitArgs[1]);
                if (serv == null) {
                    post("Invalid server IP/hostname");
                    return;
                }
                post(serv.hostname + ":");
                post("Server base security level: " + serv.baseDifficulty);
                post("Server current security level: " + serv.hackDifficulty);
                post("Server growth rate: " + serv.serverGrowth);
                post("Netscript hack() execution time: " + formatNumber(scriptCalculateHackingTime(serv), 1) + "s");
                post("Netscript grow() execution time: " + formatNumber(scriptCalculateGrowTime(serv)/1000, 1) + "s");
                post("Netscript weaken() execution time: " + formatNumber(scriptCalculateWeakenTime(serv)/1000, 1) + "s");
                break;
            case Programs.AutoLink.name:
                post("This executable cannot be run.");
                post("AutoLink.exe lets you automatically connect to other servers when using 'scan-analyze'.");
                post("When using scan-analyze, click on a server's hostname to connect to it.");
                break;
            case Programs.DeepscanV1.name:
                post("This executable cannot be run.");
                post("DeepscanV1.exe lets you run 'scan-analyze' with a depth up to 5.");
                break;
            case Programs.DeepscanV2.name:
                post("This executable cannot be run.");
                post("DeepscanV2.exe lets you run 'scan-analyze' with a depth up to 10.");
                break;
            case Programs.Flight.name:
                const fulfilled = Player.augmentations.length >= 30 &&
                    Player.money.gt(1e11) &&
                    ((Player.hacking_skill >= 2500)||
                    (Player.strength >= 1500 &&
                    Player.defense >= 1500 &&
                    Player.dexterity >= 1500 &&
                    Player.agility >= 1500));
                if(!fulfilled) {
                    post("Augmentations: " + Player.augmentations.length + " / 30");

                    post("Money: " + numeral(Player.money.toNumber()).format('($0.000a)') + " / " + numeral(1e11).format('($0.000a)'));
                    post("One path below must be fulfilled...");
                    post("----------HACKING PATH----------");
                    post("Hacking skill: " + Player.hacking_skill + " / 2500");
                    post("----------COMBAT PATH----------");
                    post("Strength: " + Player.strength + " / 1500");
                    post("Defense: " + Player.defense + " / 1500");
                    post("Dexterity: " + Player.dexterity + " / 1500");
                    post("Agility: " + Player.agility + " / 1500");
                } else {
                    post("We will contact you.");
                    post("-- Daedalus --");
                }
                break;
            case Programs.BitFlume.name:
                var yesBtn = yesNoBoxGetYesButton(),
                    noBtn = yesNoBoxGetNoButton();
                yesBtn.innerHTML = "Travel to BitNode Nexus";
                noBtn.innerHTML = "Cancel";
                yesBtn.addEventListener("click", function() {
                    hackWorldDaemon(Player.bitNodeN, true);
                    return yesNoBoxClose();
                });
                noBtn.addEventListener("click", function() {
                    return yesNoBoxClose();
                });
                yesNoBoxCreate("WARNING: USING THIS PROGRAM WILL CAUSE YOU TO LOSE ALL OF YOUR PROGRESS ON THE CURRENT BITNODE.<br><br>" +
                               "Do you want to travel to the BitNode Nexus? This allows you to reset the current BitNode " +
                               "and select a new one.");

                break;
			default:
				post("Invalid executable. Cannot be run");
				return;
		}
	},

	runScript: function(scriptName) {
		var server = Player.getCurrentServer();

        var numThreads = 1;
        var args = [];
        var results = scriptName.split(" ");
        if (results.length <= 0) {
            post("This is a bug. Please contact developer");
        }
        scriptName = results[0];
        if (results.length > 1) {
            if (results.length >= 3 && results[1] == "-t") {
                numThreads = Math.round(Number(results[2]));
                if (isNaN(numThreads) || numThreads < 1) {
                    post("Invalid number of threads specified. Number of threads must be greater than 0");
                    return;
                }
                for (var i = 3; i < results.length; ++i) {
                    var arg = results[i];

                    //Forced string
                    if ((arg.startsWith("'") && arg.endsWith("'")) ||
                        (arg.startsWith('"') && arg.endsWith('"'))) {
                        args.push(arg.slice(1, -1));
                        continue;
                    }
                    //Number
                    var tempNum = Number(arg);
                    if (!isNaN(tempNum)) {
                        args.push(tempNum);
                        continue;
                    }
                    //Otherwise string
                    args.push(arg);
                }
            } else {
                for (var i = 1; i < results.length; ++i) {
                    var arg = results[i];

                    //Forced string
                    if ((arg.startsWith("'") && arg.endsWith("'")) ||
                        (arg.startsWith('"') && arg.endsWith('"'))) {
                        args.push(arg.slice(1, -1));
                        continue;
                    }
                    //Number
                    var tempNum = Number(arg);
                    if (!isNaN(tempNum)) {
                        args.push(tempNum);
                        continue;
                    }
                    //Otherwise string
                    args.push(arg);
                }
            }
        }


        //Check if this script is already running
        if (findRunningScript(scriptName, args, server) != null) {
            post("ERROR: This script is already running. Cannot run multiple instances");
            return;
        }

		//Check if the script exists and if it does run it
		for (var i = 0; i < server.scripts.length; i++) {
			if (server.scripts[i].filename == scriptName) {
				//Check for admin rights and that there is enough RAM availble to run
                var script = server.scripts[i];
				var ramUsage = script.ramUsage * numThreads;
				var ramAvailable = server.maxRam - server.ramUsed;

				if (server.hasAdminRights == false) {
					post("Need root access to run script");
					return;
				} else if (ramUsage > ramAvailable){
					post("This machine does not have enough RAM to run this script with " +
                         numThreads + " threads. Script requires " + ramUsage + "GB of RAM");
					return;
				} else {
					//Able to run script
					post("Running script with " + numThreads +  " thread(s) and args: " + arrayToString(args) + ".");
                    post("May take a few seconds to start up the process...");
                    var runningScriptObj = new RunningScript(script, args);
                    runningScriptObj.threads = numThreads;
					server.runningScripts.push(runningScriptObj);

					addWorkerScript(runningScriptObj, server);
					return;
				}
			}
		}

		post("ERROR: No such script");
	}
};

export {postNetburnerText, post, Terminal, KEY};
