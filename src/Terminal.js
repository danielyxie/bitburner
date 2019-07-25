import {
    evaluateDirectoryPath,
    evaluateFilePath,
    getFirstParentDirectory,
    isInRootDirectory,
    isValidDirectoryPath,
    isValidFilename,
    removeLeadingSlash,
    removeTrailingSlash
} from "./Terminal/DirectoryHelpers";
import { determineAllPossibilitiesForTabCompletion } from "./Terminal/determineAllPossibilitiesForTabCompletion";
import { TerminalHelpText, HelpTexts } from "./Terminal/HelpText";
import { tabCompletion } from "./Terminal/tabCompletion";

import {
    Aliases,
    GlobalAliases,
    parseAliasDeclaration,
    printAliases,
    removeAlias,
    substituteAliases
} from "./Alias";
import { BitNodeMultipliers } from "./BitNode/BitNodeMultipliers";
import {
    CodingContract,
    CodingContractResult,
    CodingContractRewardType
} from "./CodingContracts";
import { CONSTANTS } from "./Constants";
import { Programs } from "./Programs/Programs";
import {
    executeDarkwebTerminalCommand,
    checkIfConnectedToDarkweb
} from "./DarkWeb/DarkWeb";
import { DarkWebItems } from "./DarkWeb/DarkWebItems";
import { Engine } from "./engine";
import { parseFconfSettings, createFconf } from "./Fconf/Fconf";
import { FconfSettings } from "./Fconf/FconfSettings";
import {
    calculateHackingChance,
    calculateHackingExpGain,
    calculatePercentMoneyHacked,
    calculateHackingTime,
    calculateGrowTime,
    calculateWeakenTime
} from "./Hacking";
import { HacknetServer } from "./Hacknet/HacknetServer";
import {
    iTutorialNextStep,
    iTutorialSteps,
    ITutorial
} from "./InteractiveTutorial";
import { showLiterature } from "./Literature";
import { Message } from "./Message/Message";
import { showMessage } from "./Message/MessageHelpers";
import { startWorkerScript } from "./NetscriptWorker";
import { killWorkerScript } from "./Netscript/killWorkerScript";
import { WorkerScriptStartStopEventEmitter } from "./Netscript/WorkerScriptStartStopEventEmitter";
import { Player } from "./Player";
import { hackWorldDaemon } from "./RedPill";
import { RunningScript } from "./Script/RunningScript";
import { getRamUsageFromRunningScript } from "./Script/RunningScriptHelpers";
import { findRunningScript } from "./Script/ScriptHelpers";
import { isScriptFilename } from "./Script/ScriptHelpersTS";
import { AllServers } from "./Server/AllServers";
import { Server } from "./Server/Server";
import {
    GetServerByHostname,
    getServer,
    getServerOnNetwork
} from "./Server/ServerHelpers";
import { Settings } from "./Settings/Settings";
import {
    SpecialServerIps,
    SpecialServerNames
} from "./Server/SpecialServerIps";
import { getTextFile } from "./TextFile";
import { setTimeoutRef } from "./utils/SetTimeoutRef";
import { Page, routing } from "./ui/navigationTracking";
import { numeralWrapper } from "./ui/numeralFormat";
import { KEY } from "../utils/helpers/keyCodes";
import { addOffset } from "../utils/helpers/addOffset";
import { isString } from "../utils/helpers/isString";
import { arrayToString } from "../utils/helpers/arrayToString";
import { getTimestamp } from "../utils/helpers/getTimestamp";
import { logBoxCreate } from "../utils/LogBox";
import {
    yesNoBoxCreate,
    yesNoBoxGetYesButton,
    yesNoBoxGetNoButton,
    yesNoBoxClose
} from "../utils/YesNoBox";
import {
    post,
    postContent,
    postError,
    hackProgressBarPost,
    hackProgressPost
} from "./ui/postToTerminal";

import { mkdir } from "./Server/lib/mkdir";
import { rm } from "./Server/lib/rm";
import { ls } from "./Server/lib/ls";
import { tree } from "./Server/lib/tree";
import { nuke } from "./Server/lib/nuke";
import { FTPCrack } from "./Server/lib/FTPCrack";
import { bruteSSH } from "./Server/lib/bruteSSH";
import { HTTPWorm } from "./Server/lib/HTTPWorm";
import { relaySMTP } from "./Server/lib/relaySMTP";
import { SQLInject } from "./Server/lib/SQLInject";
import { fs } from 'memfs';

import autosize from "autosize";
import * as JSZip from "jszip";
import * as FileSaver from "file-saver";


function postNetburnerText() {
	post("Bitburner v" + CONSTANTS.Version);
}

// Helper function that checks if an argument (which is a string) is a valid number
function isNumber(str) {
    if (typeof str != "string") { return false; } // Only process strings
    return !isNaN(str) && !isNaN(parseFloat(str));
}

// Defines key commands in terminal
$(document).keydown(function(event) {
	// Terminal
	if (routing.isOn(Page.Terminal)) {
        var terminalInput = document.getElementById("terminal-input-text-box");
        if (terminalInput != null && !event.ctrlKey && !event.shiftKey && !Terminal.contractOpen) {terminalInput.focus();}

		if (event.keyCode === KEY.ENTER) {
            event.preventDefault(); // Prevent newline from being entered in Script Editor
			const command = terminalInput.value;
            const dir = Terminal.currDir;
			post(
                "<span class='prompt'>[" +
                (FconfSettings.ENABLE_TIMESTAMPS ? getTimestamp() + " " : "") +
                Player.getCurrentServer().hostname +
                ` ~${dir}]&gt;</span> ${command}`
            );

            if (command.length > 0) {
                Terminal.resetTerminalInput(); // Clear input first
                Terminal.executeCommands(command);
			}
		}

		if (event.keyCode === KEY.C && event.ctrlKey) {
            if (Engine._actionInProgress) {
                // Cancel action
                post("Cancelling...");
    			Engine._actionInProgress = false;
    			Terminal.finishAction(true);
            } else if (FconfSettings.ENABLE_BASH_HOTKEYS) {
                // Dont prevent default so it still copies
                Terminal.resetTerminalInput();  // Clear Terminal
            }
		}

        if (event.keyCode === KEY.L && event.ctrlKey) {
            event.preventDefault();
            Terminal.executeCommand("clear"); // Clear screen
        }

        // Ctrl p same as up arrow
        // Ctrl n same as down arrow

        if (event.keyCode === KEY.UPARROW ||
            (FconfSettings.ENABLE_BASH_HOTKEYS && event.keyCode === KEY.P && event.ctrlKey)) {
            if (FconfSettings.ENABLE_BASH_HOTKEYS) {event.preventDefault();}
            // Cycle through past commands
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
            setTimeoutRef(function(){terminalInput.selectionStart = terminalInput.selectionEnd = 10000; }, 0);
        }

        if (event.keyCode === KEY.DOWNARROW ||
            (FconfSettings.ENABLE_BASH_HOTKEYS && event.keyCode === KEY.M && event.ctrlKey)) {
            if (FconfSettings.ENABLE_BASH_HOTKEYS) {event.preventDefault();}
            // Cycle through past commands
            if (terminalInput == null) {return;}
            var i = Terminal.commandHistoryIndex;
            var len = Terminal.commandHistory.length;

            if (len == 0) {return;}
            if (i < 0 || i > len) {
                Terminal.commandHistoryIndex = len;
            }

            // Latest command, put nothing
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

            // Autocomplete
            if (terminalInput == null) {return;}
            let input = terminalInput.value;
            if (input == "") { return; }

            const semiColonIndex = input.lastIndexOf(";");
            if(semiColonIndex !== -1) {
                input = input.slice(semiColonIndex + 1);
            }

            input = input.trim();
            input = input.replace(/\s\s+/g, ' ');

            const commandArray = input.split(" ");
            let index = commandArray.length - 2;
            if (index < -1) { index = 0; }
            const allPos = determineAllPossibilitiesForTabCompletion(Player, input, index, Terminal.currDir);
            if (allPos.length == 0) {return;}

            let arg = "";
            let command = "";
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

        // Extra Bash Emulation Hotkeys, must be enabled through .fconf
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

            // TODO AFTER THIS:
            // alt + d deletes word after cursor
            // ^w deletes word before cursor
            // ^k clears line after cursor
            // ^u clears line before cursor
        }
	}
});

// Keep terminal in focus
let terminalCtrlPressed = false, shiftKeyPressed = false;
$(document).ready(function() {
	if (routing.isOn(Page.Terminal)) {
		$('.terminal-input').focus();
	}
});

$(document).keydown(function(e) {
	if (routing.isOn(Page.Terminal)) {
		if (e.which == KEY.CTRL) {
			terminalCtrlPressed = true;
		} else if (e.shiftKey) {
            shiftKeyPressed = true;
        } else if (terminalCtrlPressed || shiftKeyPressed || Terminal.contractOpen) {
			// Don't focus
		} else {
            var inputTextBox = document.getElementById("terminal-input-text-box");
            if (inputTextBox != null) {inputTextBox.focus();}

			terminalCtrlPressed = false;
            shiftKeyPressed = false;
		}
	}
});

$(document).keyup(function(e) {
	if (routing.isOn(Page.Terminal)) {
		if (e.which == KEY.CTRL) {
			terminalCtrlPressed = false;
		}
        if (e.shiftKey) {
            shiftKeyPressed = false;
        }
	}
});

let Terminal = {
    // Flags to determine whether the player is currently running a hack or an analyze
    hackFlag:           false,
    analyzeFlag:        false,
    actionStarted:      false,
    actionTime:         0,

    commandHistory: [],
    commandHistoryIndex: 0,

    // True if a Coding Contract prompt is opened
    contractOpen:       false,

    // Full Path of current directory
    // Excludes the trailing forward slash
    currDir:            "/",

    resetTerminalInput: function() {
        const dir = Terminal.currDir;
        if (FconfSettings.WRAP_INPUT) {
            document.getElementById("terminal-input-td").innerHTML =
                `<div id='terminal-input-header' class='prompt'>[${Player.getCurrentServer().hostname} ~${dir}]$ </div>` +
                '<textarea type="text" id="terminal-input-text-box" class="terminal-input" tabindex="1"/>';

            // Auto re-size the line element as it wraps
            autosize(document.getElementById("terminal-input-text-box"));
        } else {
            document.getElementById("terminal-input-td").innerHTML =
                `<div id='terminal-input-header' class='prompt'>[${Player.getCurrentServer().hostname} ~${dir}]$ </div>` +
                `<input type="text" id="terminal-input-text-box" class="terminal-input" tabindex="1"/>`;
        }
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
                case "deletewordbefore": // Delete rest of word before the cursor
                    for (var delStart = start-1; delStart > 0; --delStart) {
                        if (inputText.charAt(delStart) === " ") {
                            terminalInput.value = inputText.substr(0, delStart) + inputText.substr(start);
                            return;
                        }
                    }
                    break;
                case "deletewordafter": // Delete rest of word after the cursor
                    for (var delStart = start+1; delStart <= text.length+1; ++delStart) {
                        if (inputText.charAt(delStart) === " ") {
                            terminalInput.value = inputText.substr(0, start) + inputText.substr(delStart);
                            return;
                        }
                    }
                    break;
                case "clearafter": // Deletes everything after cursor
                    break;
                case "clearbefore:": // Deleetes everything before cursor
                    break;
            }
        } catch(e) {
            console.error("Exception in Terminal.modifyInput: " + e);
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
                    console.warn("Invalid loc argument in Terminal.moveTextCursor()");
                    break;
            }
        } catch(e) {
            console.error("Exception in Terminal.moveTextCursor: " + e);
        }
    },

    startHack: function() {
        Terminal.hackFlag = true;

        // Hacking through Terminal should be faster than hacking through a script
        Terminal.actionTime = calculateHackingTime(Player.getCurrentServer()) / 4;
        Terminal.startAction();
    },

    startAnalyze: function() {
        Terminal.analyzeFlag = true;
        Terminal.actionTime = 1;
        post("Analyzing system...");
        Terminal.startAction();
    },

    startAction: function() {
       Terminal.actionStarted = true;

       hackProgressPost("Time left:");
       hackProgressBarPost("[");

       // Disable terminal
       document.getElementById("terminal-input-td").innerHTML = '<input type="text" class="terminal-input"/>';
       $('input[class=terminal-input]').prop('disabled', true);
    },

    finishAction: function(cancelled = false) {
        if (Terminal.hackFlag) {
            Terminal.finishHack(cancelled);
        } else if (Terminal.analyzeFlag) {
            Terminal.finishAnalyze(cancelled);
        }
    },

    // Complete the hack/analyze command
	finishHack: function(cancelled = false) {
		if (cancelled == false) {
            var server = Player.getCurrentServer();

			// Calculate whether hack was successful
			var hackChance = calculateHackingChance(server);
			var rand = Math.random();
			var expGainedOnSuccess = calculateHackingExpGain(server);
			var expGainedOnFailure = (expGainedOnSuccess / 4);
			if (rand < hackChance) { // Success!
                if (SpecialServerIps[SpecialServerNames.WorldDaemon] &&
                    SpecialServerIps[SpecialServerNames.WorldDaemon] == server.ip) {
                    if (Player.bitNodeN == null) {
                        Player.bitNodeN = 1;
                    }
                    hackWorldDaemon(Player.bitNodeN);
                    return;
                }
                server.manuallyHacked = true;
				var moneyGained = calculatePercentMoneyHacked(server);
				moneyGained = Math.floor(server.moneyAvailable * moneyGained);

				if (moneyGained <= 0) {moneyGained = 0;} // Safety check

				server.moneyAvailable -= moneyGained;
				Player.gainMoney(moneyGained);
                Player.recordMoneySource(moneyGained, "hacking");
                Player.gainHackingExp(expGainedOnSuccess)
                Player.gainIntelligenceExp(expGainedOnSuccess / CONSTANTS.IntelligenceTerminalHackBaseExpGain);

                server.fortify(CONSTANTS.ServerFortifyAmount);

				post("Hack successful! Gained " + numeralWrapper.format(moneyGained, '($0,0.00)') + " and " + numeralWrapper.format(expGainedOnSuccess, '0.0000') + " hacking EXP");
			} else { // Failure
				// Player only gains 25% exp for failure? TODO Can change this later to balance
                Player.gainHackingExp(expGainedOnFailure)
				post("Failed to hack " + server.hostname + ". Gained " + numeralWrapper.format(expGainedOnFailure, '0.0000') + " hacking EXP");
			}
		}

        // Rename the progress bar so that the next hacks dont trigger it. Re-enable terminal
        $("#hack-progress-bar").attr('id', "old-hack-progress-bar");
        $("#hack-progress").attr('id', "old-hack-progress");
        Terminal.resetTerminalInput();
        $('input[class=terminal-input]').prop('disabled', false);

        Terminal.hackFlag = false;
	},

    finishAnalyze: function(cancelled = false) {
		if (cancelled == false) {
            let currServ = Player.getCurrentServer();
            const isHacknet = currServ instanceof HacknetServer;
			post(currServ.hostname + ": ");
            post("Organization name: " + currServ.organizationName);
            var rootAccess = "";
            if (currServ.hasAdminRights) {rootAccess = "YES";}
            else {rootAccess = "NO";}
            post("Root Access: " + rootAccess);
			if (!isHacknet) { post("Required hacking skill: " + currServ.requiredHackingSkill); }
			post("Server security level: " + numeralWrapper.format(currServ.hackDifficulty, '0.000a'));
			post("Chance to hack: " + numeralWrapper.format(calculateHackingChance(currServ), '0.00%'));
			post("Time to hack: " + numeralWrapper.format(calculateHackingTime(currServ), '0.000') + " seconds");
			post("Total money available on server: " + numeralWrapper.format(currServ.moneyAvailable, '$0,0.00'));
			if (!isHacknet) { post("Required number of open ports for NUKE: " + currServ.numOpenPortsRequired); }

            if (currServ.sshPortOpen) {
				post("SSH port: Open")
			} else {
				post("SSH port: Closed")
			}

			if (currServ.ftpPortOpen) {
				post("FTP port: Open")
			} else {
				post("FTP port: Closed")
			}

			if (currServ.smtpPortOpen) {
				post("SMTP port: Open")
			} else {
				post("SMTP port: Closed")
			}

			if (currServ.httpPortOpen) {
				post("HTTP port: Open")
			} else {
				post("HTTP port: Closed")
			}

			if (currServ.sqlPortOpen) {
				post("SQL port: Open")
			} else {
				post("SQL port: Closed")
			}
		}
        Terminal.analyzeFlag = false;

        // Rename the progress bar so that the next hacks dont trigger it. Re-enable terminal
        $("#hack-progress-bar").attr('id', "old-hack-progress-bar");
        $("#hack-progress").attr('id', "old-hack-progress");
        Terminal.resetTerminalInput();
        $('input[class=terminal-input]').prop('disabled', false);
    },

    executeCommands : function(commands) {
        // Sanitize input
        commands = commands.trim();
        commands = commands.replace(/\s\s+/g, ' '); // Replace all extra whitespace in command with a single space

        // Handle Terminal History - multiple commands should be saved as one
        if (Terminal.commandHistory[Terminal.commandHistory.length-1] != commands) {
            Terminal.commandHistory.push(commands);
            if (Terminal.commandHistory.length > 50) {
                Terminal.commandHistory.splice(0, 1);
            }
        }
        Terminal.commandHistoryIndex = Terminal.commandHistory.length;

        // Split commands and execute sequentially
        commands = commands.split(";");
        for (let i = 0; i < commands.length; i++) {
            if(commands[i].match(/^\s*$/)) { continue; } // Don't run commands that only have whitespace
            Terminal.executeCommand(commands[i].trim());
        }
    },

    parseCommandArguments : function(command) {
        // This will be used to keep track of whether we're in a quote. This is for situations
        // like the alias command:
        //      alias run="run NUKE.exe"
        // We want the run="run NUKE.exe" to be parsed as a single command, so this flag
        // will keep track of whether we have a quote in
        let inQuote = ``;

        // Returns an array with the command and its arguments in each index
        // Properly handles quotation marks (e.g. `run foo.script "the sun"` will return [run, foo.script, the sun])
        const args = [];
        let start = 0, i = 0;
        let prevChar = ''; // Previous character
        while (i < command.length) {
            let escaped = false; // Check for escaped quotation marks
            if (i >= 1) {
                prevChar = command.charAt(i - 1);
                if (prevChar === "\\") { escaped = true; }
            }

            const c = command.charAt(i);
            if (c === '"') { // Double quotes
                if (!escaped && prevChar === " ") {
                    const endQuote = command.indexOf('"', i+1);
                    if (endQuote !== -1 && (endQuote === command.length-1 || command.charAt(endQuote+1) === " ")) {
                        args.push(command.substr(i+1, (endQuote - i - 1)));
                        if (endQuote === command.length-1) {
                            start = i = endQuote+1;
                        } else {
                            start = i = endQuote+2; // Skip the space
                        }
                        continue;
                    }
                } else {
                    if (inQuote === ``) {
                        inQuote = `"`;
                    } else if (inQuote === `"`) {
                        inQuote = ``;
                    }
                }
            } else if (c === "'") { // Single quotes, same thing as above
                if (!escaped && prevChar === " ") {
                    const endQuote = command.indexOf("'", i+1);
                    if (endQuote !== -1 && (endQuote === command.length-1 || command.charAt(endQuote+1) === " ")) {
                        args.push(command.substr(i+1, (endQuote - i - 1)));
                        if (endQuote === command.length-1) {
                            start = i = endQuote+1;
                        } else {
                            start = i = endQuote+2; // Skip the space
                        }
                        continue;
                    }
                } else {
                    if (inQuote === ``) {
                        inQuote = `'`;
                    } else if (inQuote === `'`) {
                        inQuote = ``;
                    }
                }
            } else if (c === " " && inQuote === ``) {
                let arg = command.substr(start, i-start);

                // If this is a number, convert it from a string to number
                if (isNumber(arg)) {
                    args.push(parseFloat(arg));
                } else {
                    args.push(arg);
                }

                start = i+1;
            }
            ++i;
        }

        // Add the last argument
        if (start !== i) {
            let arg = command.substr(start, i-start);

            // If this is a number, convert it from string to number
            if (isNumber(arg)) {
                args.push(parseFloat(arg));
            } else {
                args.push(arg);
            }
        }

        return args;
    },

	executeCommand : function(command) {
        if (Terminal.hackFlag || Terminal.analyzeFlag) {
            postError(`Cannot execute command (${command}) while an action is in progress`);
            return;
        }

        // Process any aliases
        command = substituteAliases(command);

        // Allow usage of ./
        if (command.startsWith("./")) {
            command = "run " + command.slice(2);
        }

        // Only split the first space
		var commandArray = Terminal.parseCommandArguments(command);
		if (commandArray.length == 0) { return; }

        /****************** Interactive Tutorial Terminal Commands ******************/
        if (ITutorial.isRunning) {
            var foodnstuffServ = GetServerByHostname("foodnstuff");
            if (foodnstuffServ == null) {throw new Error("Could not get foodnstuff server"); return;}

            switch(ITutorial.currStep) {
            case iTutorialSteps.TerminalHelp:
                if (commandArray.length === 1 && commandArray[0] == "help") {
                    post(TerminalHelpText);
                    iTutorialNextStep();
                } else {post("Bad command. Please follow the tutorial");}
                break;
            case iTutorialSteps.TerminalLs:
                if (commandArray.length === 1 && commandArray[0] == "ls") {
                    Terminal.executeListCommand(commandArray);
                    iTutorialNextStep();
                } else {post("Bad command. Please follow the tutorial");}
                break;
            case iTutorialSteps.TerminalScan:
                if (commandArray.length === 1 && commandArray[0] == "scan") {
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
                    commandArray[1] === 2) {
                    Terminal.executeScanAnalyzeCommand(2);
                    iTutorialNextStep();
                } else {post("Bad command. Please follow the tutorial");}
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
                if (commandArray.length === 1 && commandArray[0] === "analyze") {
                    if (commandArray.length !== 1) {
                        post("Incorrect usage of analyze command. Usage: analyze");
                        return;
                    }
                    Terminal.startAnalyze();
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
                    Terminal.startHack();
                    iTutorialNextStep();
                } else {post("Bad command. Please follow the tutorial");}
				break;
            case iTutorialSteps.TerminalCreateScript:
                if (commandArray.length == 2 &&
                    commandArray[0] == "nano" && commandArray[1] == "foodnstuff.script") {
                    Engine.loadScriptEditorContent("foodnstuff.script", "");
                    iTutorialNextStep();
                } else {post("Bad command. Please follow the tutorial");}
                break;
            case iTutorialSteps.TerminalFree:
                if (commandArray.length == 1 && commandArray[0] == "free") {
                    Terminal.executeFreeCommand(commandArray);
                    iTutorialNextStep();
                } else {post("Bad command. Please follow the tutorial");}
                break;
            case iTutorialSteps.TerminalRunScript:
                if (commandArray.length == 2 &&
                    commandArray[0] == "run" && commandArray[1] == "foodnstuff.script") {
                    Terminal.runScript(commandArray);
                    iTutorialNextStep();
                } else {post("Bad command. Please follow the tutorial");}
                break;
            case iTutorialSteps.ActiveScriptsToTerminal:
                if (commandArray.length == 2 &&
                    commandArray[0] == "tail" && commandArray[1] == "foodnstuff.script") {
                    // Check that the script exists on this machine
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
        try{
            switch (commandArray[0].toLowerCase()) {
                case "alias":
                    if (commandArray.length === 1) {
                        printAliases();
                        return;
                    }
                    if (commandArray.length === 2) {
                        if (parseAliasDeclaration(commandArray[1])) {
                            post(`Set alias ${commandArray[1]}`);
                            return;
                        }
                    }
                    if (commandArray.length === 3) {
                        if (commandArray[1] === "-g") {
                            if (parseAliasDeclaration(commandArray[2], true)) {
                                post(`Set global alias ${commandArray[1]}`);
                                return;
                            }
                        }
                    }
                    postError('Incorrect usage of alias command. Usage: alias [-g] [aliasname="value"]');
                    break;
                case "analyze":
                    if (commandArray.length !== 1) {
                        post("Incorrect usage of analyze command. Usage: analyze");
                        return;
                    }
                    Terminal.startAnalyze();
                    break;
                case "buy":
                    if (SpecialServerIps.hasOwnProperty("Darkweb Server")) {
                        executeDarkwebTerminalCommand(commandArray);
                    } else {
                        postError("You need to be able to connect to the Dark Web to use the buy command. (Maybe there's a TOR router you can buy somewhere)");
                    }
                    break;
                case "cat": {
                    try {
                        if (commandArray.length !== 2) {
                            postError("Incorrect usage of cat command. Usage: cat [file]");
                            return;
                        }
                        const filename = Terminal.getFilepath(commandArray[1]);
                        if (!filename.endsWith(".msg") && !filename.endsWith(".lit") && !filename.endsWith(".txt")) {
                            postError("Only .msg, .txt, and .lit files are viewable with cat (filename must end with .msg, .txt, or .lit)");
                            return;
                        }

                        if (filename.endsWith(".msg") || filename.endsWith(".lit")) {
                            for (let i = 0; i < s.messages.length; ++i) {
                                if (filename.endsWith(".lit") && s.messages[i] === filename) {
                                    showLiterature(s.messages[i]);
                                    return;
                                } else if (filename.endsWith(".msg") && s.messages[i].filename === filename) {
                                    showMessage(s.messages[i]);
                                    return;
                                }
                            }
                        } else if (filename.endsWith(".txt")) {
                            const txt = Terminal.getTextFile(filename);
                            if (txt != null) {
                                txt.show();
                                return;
                            }
                        }

                        postError(`No such file ${filename}`);
                    } catch(e) {
                        Terminal.postThrownError(e);
                    }
                    break;
                }
                case "cd": {
                    if (commandArray.length !== 2) {
                        postError("Incorrect number of arguments. Usage: cd [dir]");
                    } else {
                        let dir = commandArray[1];

                        let evaledDir;
                        if (dir === "/") {
                            evaledDir = "/";
                        } else {
                            // Ignore trailing slashes
                            dir = removeTrailingSlash(dir);

                            evaledDir = evaluateDirectoryPath(Player.getCurrentServer(), dir, Terminal.currDir);
                            if (evaledDir == null || evaledDir === "") {
                                postError("Invalid path. Failed to change directories");
                                return;
                            }
                        }

                        Terminal.currDir = evaledDir;

                        // Reset input to update current directory on UI
                        Terminal.resetTerminalInput();
                    }
                    break;
                }
                case "check": {
                    try {
                        if (commandArray.length < 2) {
                            postError("Incorrect number of arguments. Usage: check [script] [arg1] [arg2]...");
                        } else {
                            const scriptName = Terminal.getFilepath(commandArray[1]);
                            // Can only tail script files
                            if (!isScriptFilename(scriptName)) {
                                postError("tail can only be called on .script files (filename must end with .script)");
                                return;
                            }

                            // Get args
                            let args = [];
                            for (var i = 2; i < commandArray.length; ++i) {
                                args.push(commandArray[i]);
                            }

                            // Check that the script exists on this machine
                            var runningScript = findRunningScript(scriptName, args, s);
                            if (runningScript == null) {
                                postError("No such script exists");
                                return;
                            }
                            runningScript.displayLog();
                        }
                    } catch(e) {
                        Terminal.postThrownError(e);
                    }

                    break;
                }
                case "clear":
                case "cls":
                    if (commandArray.length !== 1) {
                        postError("Incorrect usage of clear/cls command. Usage: clear/cls");
                        return;
                    }
                    $("#terminal tr:not(:last)").remove();
                    postNetburnerText();
                    break;
                case "connect": {
                    // Disconnect from current server in terminal and connect to new one
                    if (commandArray.length !== 2) {
                        postError("Incorrect usage of connect command. Usage: connect [ip/hostname]");
                        return;
                    }

                    let ip = commandArray[1];

                    for (let i = 0; i < s.serversOnNetwork.length; i++) {
                        if (getServerOnNetwork(s, i).ip == ip || getServerOnNetwork(s, i).hostname == ip) {
                            Terminal.connectToServer(ip);
                            return;
                        }
                    }

                    postError("Host not found");
                    break;
                }
                case "download": {
                    try {
                        if (commandArray.length !== 2) {
                            postError("Incorrect usage of download command. Usage: download [script/text file]");
                            return;
                        }
                        const fn = commandArray[1];
                        if (fn === "*" || fn === "*.script" || fn === "*.txt") {
                            // Download all scripts as a zip
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

                            let zipFn;
                            switch (fn) {
                                case "*.script":
                                    zipFn = "bitburnerScripts.zip"; break;
                                case "*.txt":
                                    zipFn = "bitburnerTexts.zip"; break;
                                default:
                                    zipFn = "bitburnerFiles.zip"; break;
                            }

                            zip.generateAsync({type:"blob"}).then(function(content) {
                                FileSaver.saveAs(content, zipFn);
                            });
                            return;
                        } else if (isScriptFilename(fn)) {
                            // Download a single script
                            const script = Terminal.getScript(fn);
                            if (script != null) {
                                return script.download();
                            }
                        } else if (fn.endsWith(".txt")) {
                            // Download a single text file
                            const txt = Terminal.getTextFile(fn);
                            if (txt != null) {
                                return txt.download();
                            }
                        } else {
                            postError(`Cannot download this filetype`);
                            return;
                        }
                        postError(`${fn} does not exist`);
                    } catch(e) {
                        Terminal.postThrownError(e);
                    }
                    break;
                }
                case "expr": {
                    if (commandArray.length <= 1) {
                        postError("Incorrect usage of expr command. Usage: expr [math expression]");
                        return;
                    }
                    let expr = commandArray.slice(1).join("");

                    // Sanitize the math expression
                    let sanitizedExpr = expr.replace(/s+/g, '').replace(/[^-()\d/*+.]/g, '');
                    let result;
                    try {
                        result = eval(sanitizedExpr);
                    } catch(e) {
                        postError(`Could not evaluate expression: ${sanitizedExpr}`);
                        return;
                    }
                    post(result);
                    break;
                }
                case "free":
                    Terminal.executeFreeCommand(commandArray);
                    break;
                case "hack": {
                    if (commandArray.length !== 1) {
                        postError("Incorrect usage of hack command. Usage: hack");
                        return;
                    }
                    // Hack the current PC (usually for money)
                    // You can't hack your home pc or servers you purchased
                    if (s.purchasedByPlayer) {
                        postError("Cannot hack your own machines! You are currently connected to your home PC or one of your purchased servers");
                    } else if (s.hasAdminRights == false ) {
                        postError("You do not have admin rights for this machine! Cannot hack");
                    } else if (s.requiredHackingSkill > Player.hacking_skill) {
                        postError("Your hacking skill is not high enough to attempt hacking this machine. Try analyzing the machine to determine the required hacking skill");
                    } else if (s instanceof HacknetServer) {
                        postError("Cannot hack this type of Server")
                    } else {
                        Terminal.startHack();
                    }
                    break;
                }
                case "help":
                    if (commandArray.length !== 1 && commandArray.length !== 2) {
                        postError("Incorrect usage of help command. Usage: help");
                        return;
                    }
                    if (commandArray.length === 1) {
                        post(TerminalHelpText);
                    } else {
                        var cmd = commandArray[1];
                        var txt = HelpTexts[cmd];
                        if (txt == null) {
                            postError("No help topics match '" + cmd + "'");
                            return;
                        }
                        post(txt);
                    }
                    break;
                case "home":
                    if (commandArray.length !== 1) {
                        postError("Incorrect usage of home command. Usage: home");
                        return;
                    }
                    Player.getCurrentServer().isConnectedTo = false;
                    Player.currentServer = Player.getHomeComputer().ip;
                    Player.getCurrentServer().isConnectedTo = true;
                    post("Connected to home");
                    Terminal.currDir = "/";
                    Terminal.resetTerminalInput();
                    break;
                case "hostname":
                    if (commandArray.length !== 1) {
                        postError("Incorrect usage of hostname command. Usage: hostname");
                        return;
                    }
                    post(Player.getCurrentServer().hostname);
                    break;
                case "ifconfig":
                    if (commandArray.length !== 1) {
                        postError("Incorrect usage of ifconfig command. Usage: ifconfig");
                        return;
                    }
                    post(Player.getCurrentServer().ip);
                    break;
                case "kill": {
                    Terminal.executeKillCommand(commandArray);
                    break;
                }
                case "killall": {
                    for (let i = s.runningScripts.length - 1; i >= 0; --i) {
                        killWorkerScript(s.runningScripts[i], s.ip, false);
                    }
                    WorkerScriptStartStopEventEmitter.emitEvent();
                    post("Killing all running scripts");
                    break;
                }
                case "ls": {
                    try{
                        post(ls(Player.getCurrentServer(), Terminal, commandArray.splice(1)));
                    }catch(e){
                        postError(e)
                    }
                    
                    break;
                }
                case "tree": {
                    try{
                        post(tree(Player.getCurrentServer(), Terminal, commandArray.splice(1)));
                    }catch(e){
                        postError(e)
                    }
                    
                    break;
                }
                case "lscpu": {
                    post(Player.getCurrentServer().cpuCores + " Core(s)");
                    break;
                }
                case "mem": {
                    Terminal.executeMemCommand(commandArray);
                    break;
                }
                case "mv": {
                    if (commandArray.length !== 3) {
                        postError(`Incorrect number of arguments. Usage: mv [src] [dest]`);
                        return;
                    }

                    try {
                        const source = commandArray[1];
                        const dest = commandArray[2];

                        if (!isScriptFilename(source) && !source.endsWith(".txt")) {
                            postError(`'mv' can only be used on scripts and text files (.txt)`);
                            return;
                        }

                        const srcFile = Terminal.getFile(source);
                        if (srcFile == null) {
                            postError(`Source file ${source} does not exist`);
                            return;
                        }

                        const sourcePath = Terminal.getFilepath(source);
                        const destPath = Terminal.getFilepath(dest);

                        const destFile = Terminal.getFile(dest);

                        // 'mv' command only works on scripts and txt files.
                        // Also, you can't convert between different file types
                        if (isScriptFilename(source)) {
                            if (!isScriptFilename(dest)) {
                                postError(`Source and destination files must have the same type`);
                                return;
                            }

                            // Command doesnt work if script is running
                            if (s.isRunning(sourcePath)) {
                                postError(`Cannot use 'mv' on a script that is running`);
                                return;
                            }

                            if (destFile != null) {
                                // Already exists, will be overwritten, so we'll delete it
                                const status = s.removeFile(destPath);
                                if (!status.res) {
                                    postError(`Something went wrong...please contact game dev (probably a bug)`);
                                    return;
                                } else {
                                    post("Warning: The destination file was overwritten");
                                }
                            }

                            srcFile.filename = destPath;
                        } else if (source.endsWith(".txt")) {
                            if (!dest.endsWith(".txt")) {
                                postError(`Source and destination files must have the same type`);
                                return;
                            }

                            if (destFile != null) {
                                // Already exists, will be overwritten, so we'll delete it
                                const status = s.removeFile(destPath);
                                if (!status.res) {
                                    postError(`Something went wrong...please contact game dev (probably a bug)`);
                                    return;
                                } else {
                                    post("Warning: The destination file was overwritten");
                                }
                            }

                            srcFile.fn = destPath;
                        }
                    } catch(e) {
                        Terminal.postThrownError(e);
                    }

                    break;
                }
                case "nano":
                    Terminal.executeNanoCommand(commandArray);
                    break;
                case "ps":
                    if (commandArray.length !== 1) {
                        postError("Incorrect usage of ps command. Usage: ps");
                        return;
                    }
                    for (let i = 0; i < s.runningScripts.length; i++) {
                        let rsObj = s.runningScripts[i];
                        let res = `(PID - ${rsObj.pid}) ${rsObj.filename}`;
                        for (let j = 0; j < rsObj.args.length; ++j) {
                            res += (" " + rsObj.args[j].toString());
                        }
                        post(res);
                    }
                    break;
                case "rm": {
                    rm(Player.getCurrentServer(), Terminal.currDir, commandArray.slice(1));
                    break;
                    /*
                    if (commandArray.length !== 2) {
                        postError("Incorrect number of arguments. Usage: rm [program/script]");
                        return;
                    }

                    // Check programs
                    let delTarget = Terminal.getFilepath(commandArray[1]);

                    const status = s.removeFile(delTarget);
                    if (!status.res) {
                        postError(status.msg);
                    }
                    break;
                    */
                }
                case "run":
                    // Run a program or a script
                    if (commandArray.length < 2) {
                        postError("Incorrect number of arguments. Usage: run [program/script] [-t] [num threads] [arg1] [arg2]...");
                    } else {
                        var executableName = commandArray[1];

                        // Secret Music player!
                        if (executableName === "musicplayer") {
                            post('<iframe src="https://open.spotify.com/embed/user/danielyxie/playlist/1ORnnL6YNvXOracUaUV2kh" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>', false);
                            return;
                        }

                        // Check if its a script or just a program/executable
                        if (isScriptFilename(executableName)) {
                            Terminal.runScript(commandArray);
                        } else if (executableName.endsWith(".cct")) {
                            Terminal.runContract(executableName);
                        } else {
                            Terminal.runProgram(commandArray);
                        }
                    }
                    break;
                case "scan":
                    Terminal.executeScanCommand(commandArray);
                    break;
                case "scan-analyze":
                    if (commandArray.length === 1) {
                        Terminal.executeScanAnalyzeCommand(1);
                    } else {
                        // # of args must be 2 or 3
                        if (commandArray.length > 3) {
                            postError("Incorrect usage of scan-analyze command. usage: scan-analyze [depth]");
                            return;
                        }
                        let all = false;
                        if (commandArray.length === 3 && commandArray[2] === "-a") {
                            all = true;
                        }

                        let depth = parseInt(commandArray[1]);

                        if (isNaN(depth) || depth < 0) {
                            postError("Incorrect usage of scan-analyze command. depth argument must be positive numeric");
                            return;
                        }
                        if (depth > 3 && !Player.hasProgram(Programs.DeepscanV1.name) &&
                            !Player.hasProgram(Programs.DeepscanV2.name)) {
                            postError("You cannot scan-analyze with that high of a depth. Maximum depth is 3");
                            return;
                        } else if (depth > 5 && !Player.hasProgram(Programs.DeepscanV2.name)) {
                            postError("You cannot scan-analyze with that high of a depth. Maximum depth is 5");
                            return;
                        } else if (depth > 10) {
                            postError("You cannot scan-analyze with that high of a depth. Maximum depth is 10");
                            return;
                        }
                        Terminal.executeScanAnalyzeCommand(depth, all);
                    }
                    break;
                /* eslint-disable no-case-declarations */
                case "scp":
                    Terminal.executeScpCommand(commandArray);
                    break;
                /* eslint-enable no-case-declarations */
                case "sudov":
                    if (commandArray.length !== 1) {
                        postError("Incorrect number of arguments. Usage: sudov");
                        return;
                    }

                    if (s.hasAdminRights) {
                        post("You have ROOT access to this machine");
                    } else {
                        post("You do NOT have root access to this machine");
                    }
                    break;
                case "tail": {
                    try {
                        if (commandArray.length < 2) {
                            postError("Incorrect number of arguments. Usage: tail [script] [arg1] [arg2]...");
                        } else {
                            const scriptName = Terminal.getFilepath(commandArray[1]);
                            if (!isScriptFilename(scriptName)) {
                                postError("tail can only be called on .script files (filename must end with .script)");
                                return;
                            }

                            // Get script arguments
                            const args = [];
                            for (let i = 2; i < commandArray.length; ++i) {
                                args.push(commandArray[i]);
                            }

                            // Check that the script exists on this machine
                            const runningScript = findRunningScript(scriptName, args, s);
                            if (runningScript == null) {
                                postError("No such script exists");
                                return;
                            }
                            logBoxCreate(runningScript);
                        }
                    } catch(e) {
                        Terminal.postThrownError(e);
                    }

                    break;
                }
                case "theme": {
                    let args = commandArray.slice(1);
                    if (args.length !== 1 && args.length !== 3) {
                        postError("Incorrect number of arguments.");
                        postError("Usage: theme [default|muted|solarized] | #[background color hex] #[text color hex] #[highlight color hex]");
                    } else if(args.length === 1){
                        var themeName = args[0];
                        if (themeName == "default"){
                            document.body.style.setProperty('--my-highlight-color',"#ffffff");
                            document.body.style.setProperty('--my-font-color',"#66ff33");
                            document.body.style.setProperty('--my-background-color',"#000000");
                            document.body.style.setProperty('--my-prompt-color', "#f92672");
                        } else if (themeName == "muted"){
                            document.body.style.setProperty('--my-highlight-color',"#ffffff");
                            document.body.style.setProperty('--my-font-color',"#66ff33");
                            document.body.style.setProperty('--my-background-color',"#252527");
                        } else if (themeName == "solarized"){
                            document.body.style.setProperty('--my-highlight-color',"#6c71c4");
                            document.body.style.setProperty('--my-font-color',"#839496");
                            document.body.style.setProperty('--my-background-color',"#002b36");
                        } else {
                            return postError("Theme not found");
                        }
                        FconfSettings.THEME_HIGHLIGHT_COLOR = document.body.style.getPropertyValue("--my-highlight-color");
                        FconfSettings.THEME_FONT_COLOR = document.body.style.getPropertyValue("--my-font-color");
                        FconfSettings.THEME_BACKGROUND_COLOR = document.body.style.getPropertyValue("--my-background-color");
                        FconfSettings.THEME_PROMPT_COLOR = document.body.style.getPropertyValue("--my-prompt-color");
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
                            FconfSettings.THEME_HIGHLIGHT_COLOR = document.body.style.getPropertyValue("--my-highlight-color");
                            FconfSettings.THEME_FONT_COLOR = document.body.style.getPropertyValue("--my-font-color");
                            FconfSettings.THEME_BACKGROUND_COLOR = document.body.style.getPropertyValue("--my-background-color");
                        } else {
                            return postError("Invalid Hex Input for theme");
                        }
                    }
                    break;
                }
                case "top": {
                    if (commandArray.length !== 1) {
                        postError("Incorrect usage of top command. Usage: top");
                        return;
                    }

                    // Headers
                    const scriptWidth = 40;
                    const pidWidth = 10;
                    const threadsWidth = 16;

                    const scriptTxt = "Script";
                    const pidTxt = "PID";
                    const threadsTxt = "Threads";
                    const ramTxt = "RAM Usage";

                    const spacesAfterScriptTxt = " ".repeat(scriptWidth - scriptTxt.length);
                    const spacesAfterPidTxt = " ".repeat(pidWidth - pidTxt.length);
                    const spacesAfterThreadsTxt = " ".repeat(threadsWidth - threadsTxt.length);

                    const headers = `${scriptTxt}${spacesAfterScriptTxt}${pidTxt}${spacesAfterPidTxt}${threadsTxt}${spacesAfterThreadsTxt}${ramTxt}`;

                    post(headers);

                    let currRunningScripts = s.runningScripts;
                    // Iterate through scripts on current server
                    for (let i = 0; i < currRunningScripts.length; i++) {
                        let script = currRunningScripts[i];

                        // Calculate name padding
                        const numSpacesScript = Math.max(0, scriptWidth - script.filename.length);
                        const spacesScript = " ".repeat(numSpacesScript);

                        // Calculate PID padding
                        const numSpacesPid = Math.max(0, pidWidth - (script.pid + "").length);
                        const spacesPid = " ".repeat(numSpacesPid);

                        // Calculate thread padding
                        const numSpacesThread = Math.max(0, threadsWidth - (script.threads + "").length);
                        const spacesThread = " ".repeat(numSpacesThread);

                        // Calculate and transform RAM usage
                        const ramUsage = numeralWrapper.format(getRamUsageFromRunningScript(script) * script.threads, '0.00') + " GB";

                        const entry = [
                            script.filename,
                            spacesScript,
                            script.pid,
                            spacesPid,
                            script.threads,
                            spacesThread,
                            ramUsage
                        ].join("");
                        post(entry);
                    }
                    break;
                }
                case "unalias": {
                    if (commandArray.length !== 2) {
                        postError('Incorrect usage of unalias name. Usage: unalias [alias]');
                        return;
                    } else {
                        if (removeAlias(commandArray[1])) {
                            post(`Removed alias ${commandArray[1]}`);
                        } else {
                            postError(`No such alias exists: ${commandArray[1]}`);
                        }
                    }
                    break;
                }
                case "wget": {
                    if (commandArray.length !== 3) {
                        postError("Incorrect usage of wget command. Usage: wget [url] [target file]");
                        return;
                    }

                    let url = commandArray[1];
                    let target = Terminal.getFilepath(commandArray[2]);
                    if (!isScriptFilename(target) && !target.endsWith(".txt")) {
                        return post(`wget failed: Invalid target file. Target file must be script or text file`);
                    }
                    $.get(url, function(data) {
                        let res;
                        if (isScriptFilename(target)) {
                            res = s.writeToScriptFile(target, data);
                        } else {
                            res = s.writeToTextFile(target, data);
                        }
                        if (!res.success) {
                            return post("wget failed");
                        }
                        if (res.overwritten) {
                            return post(`wget successfully retrieved content and overwrote ${target}`);
                        }
                        return post(`wget successfully retrieved content to new file ${target}`);
                    }, 'text').fail(function(e) {
                        return postError("wget failed: " + JSON.stringify(e));
                    })
                    break;
                }
                case "mkdir": {
                    mkdir(Player.getCurrentServer(), Terminal.currDir, commandArray.slice(1));
                    break;
                }
                case "nuke": {//TODO FINALISE COMMAND CALLING FORMAT TO REGROUP EVERY COMMAND INTO A SINGLE MAPPING SYSTEM.
                    //TODO CHECK PERMISSION
                    nuke(Player.getCurrentServer(), Terminal.currDir, commandArray.slice(1));
                    break;
                }
                case "bruteSSH": {
                    //TODO CHECK PERMISSION
                    bruteSSH(Player.getCurrentServer(), Terminal.currDir, commandArray.slice(1));
                    break;
                }
                case "FTPCrack": {
                    //TODO CHECK PERMISSION
                    FTPCrack(Player.getCurrentServer(), Terminal.currDir, commandArray.slice(1));
                    break;
                }
                case "SQLInject": {
                    //TODO CHECK PERMISSION
                    SQLInject(Player.getCurrentServer(), Terminal.currDir, commandArray.slice(1));
                    break;
                }
                case "HTTPWorm": {
                    //TODO CHECK PERMISSION
                    HTTPWorm(Player.getCurrentServer(), Terminal.currDir, commandArray.slice(1));
                    break;
                }
                case "relaySMTP": {
                    //TODO CHECK PERMISSION
                    relaySMTP(Player.getCurrentServer(), Terminal.currDir, commandArray.slice(1));
                    break;
                }
                default: {
                    let path = Terminal.getFilepath(commandArray[0]);
                    if(Player.getCurrentServer().exists(path)) {
                        // if it's an existing path, check if it is a directory or an executable
                        try{
                            if (Player.getCurrentServer().isDir(path)) post(`${path} is a directory.`);
                            else {
                                Player.getCurrentServer().fs.accessSync(path, fs.constants.X_OK); // if it works, it is an executable file
                                // we launch a run path command.
                                post(`${path} is an executable. # auto running executables has yet to be implemented, use run for now.`);
                            }
                        }catch(e){
                            // this is not an executable file nor a directory.
                            // we display some informations on the nature of the file.
                            post(`${path} is a file.`);
                        }
                    }
                    else postError(`${commandArray[0]} not found`);
                    break;
                }
            }
        }catch(e){
            Terminal.postThrownError(e);
            throw e;
        }
	},

    connectToServer: function(ip) {
        var serv = getServer(ip);
        if (serv == null) {
            post("Invalid server. Connection failed.");
            return;
        }
        Player.getCurrentServer().isConnectedTo = false;
        Player.currentServer = serv.ip;
        Player.getCurrentServer().isConnectedTo = true;
        post("Connected to " + serv.hostname);
        Terminal.currDir = "/";
        if (Player.getCurrentServer().hostname == "darkweb") {
            checkIfConnectedToDarkweb(); // Posts a 'help' message if connecting to dark web
        }
        Terminal.resetTerminalInput();
    },

    executeFreeCommand: function(commandArray) {
        if (commandArray.length !== 1) {
            postError("Incorrect usage of free command. Usage: free");
            return;
        }
        const ram = numeralWrapper.format(Player.getCurrentServer().maxRam, '0.00');
        const used = numeralWrapper.format(Player.getCurrentServer().ramUsed, '0.00');
        const avail = numeralWrapper.format(Player.getCurrentServer().maxRam - Player.getCurrentServer().ramUsed, '0.00');
        const maxLength = Math.max(ram.length, Math.max(used.length, avail.length));
        const usedPercent = numeralWrapper.format(Player.getCurrentServer().ramUsed/Player.getCurrentServer().maxRam*100, '0.00');

        post(`Total:     ${" ".repeat(maxLength-ram.length)}${ram} GB`);
        post(`Used:      ${" ".repeat(maxLength-used.length)}${used} GB (${usedPercent}%)`);
        post(`Available: ${" ".repeat(maxLength-avail.length)}${avail} GB`);
    },

    executeKillCommand: function(commandArray) {
        try {
            if (commandArray.length < 2) {
                postError("Incorrect usage of kill command. Usage: kill [scriptname] [arg1] [arg2]...");
                return;
            }

            // Kill by PID
            if (typeof commandArray[1] === "number") {
                const pid = commandArray[1];
                const res = killWorkerScript(pid);
                if (res) {
                    post(`Killing script with PID ${pid}`);
                } else {
                    post(`Failed to kill script with PID ${pid}. No such script exists`);
                }

                return;
            }

            const s = Player.getCurrentServer();
            const scriptName = Terminal.getFilepath(commandArray[1]);
            const args = [];
            for (let i = 2; i < commandArray.length; ++i) {
                args.push(commandArray[i]);
            }
            const runningScript = s.getRunningScript(scriptName, args);
            if (runningScript == null) {
                postError("No such script is running. Nothing to kill");
                return;
            }
            killWorkerScript(runningScript, s.ip);
            post(`Killing ${scriptName}`);
        } catch(e) {
            Terminal.postThrownError(e);
        }
    },

    executeListCommand: function(commandArray) {
        const numArgs = commandArray.length;
        function incorrectUsage() {
            postError("Incorrect usage of ls command. Usage: ls [dir] [| grep pattern]");
        }

        if (numArgs <= 0 || numArgs > 5 || numArgs === 3) {
            return incorrectUsage();
        }

        // Grep
        let filter = null; // Grep

        // Directory path
        let prefix = Terminal.currDir;
        if (!prefix.endsWith("/")) {
            prefix += "/";
        }

        // If there are 4+ arguments, then the last 3 must be for grep
        if (numArgs >= 4) {
            if (commandArray[numArgs - 2] !== "grep" || commandArray[numArgs - 3] !== "|") {
                return incorrectUsage();
            }
            filter = commandArray[numArgs - 1];
        }

        // If the second argument is not a pipe, then it must be for listing a directory
        if (numArgs >= 2 && commandArray[1] !== "|") {
            prefix = evaluateDirectoryPath(commandArray[1], Terminal.currDir);
            if (prefix != null) {
                if (!prefix.endsWith("/")) {
                    prefix += "/";
                }
                if (!isValidDirectoryPath(prefix)) {
                    return incorrectUsage();
                }
            }
        }

        // Root directory, which is the same as no 'prefix' at all
        if (prefix === "/") {
            prefix = null;
        }

        // Display all programs and scripts
        let allFiles = [];
        let folders = [];

        function handleFn(fn) {
            let parsedFn = fn;
            if (prefix) {
                if (!fn.startsWith(prefix)) {
                    return;
                } else {
                    parsedFn = fn.slice(prefix.length, fn.length);
                }
            }

            if (filter && !parsedFn.includes(filter)) {
                return;
            }

            // If the fn includes a forward slash, it must be in a subdirectory.
            // Therefore, we only list the "first" directory in its path
            if (parsedFn.includes("/")) {
                const firstParentDir = getFirstParentDirectory(parsedFn);
                if (filter && !firstParentDir.includes(filter)) {
                    return;
                }

                if (!folders.includes(firstParentDir)) {
                    folders.push(firstParentDir);
                }

                return;
            }

            allFiles.push(parsedFn);
        }

        // Get all of the programs and scripts on the machine into one temporary array
        const s = Player.getCurrentServer();
        for (const program of s.programs) handleFn(program);
        for (const script of s.scripts) handleFn(script.filename);
        for (const txt of s.textFiles) handleFn(txt.fn);
        for (const contract of s.contracts) handleFn(contract.fn);
        for (const msgOrLit of s.messages) (msgOrLit instanceof Message) ? handleFn(msgOrLit.filename) : handleFn(msgOrLit);

        // Sort the files/folders alphabetically then print each
        allFiles.sort();
        folders.sort();

        const config = { color: "#0000FF" };
        for (const dir of folders) {
            postContent(dir, config);
        }

        for (const file of allFiles) {
            postContent(file);
        }
    },

    executeMemCommand: function(commandArray) {
        try {
            if (commandArray.length !== 2 && commandArray.length !== 4) {
                postError("Incorrect usage of mem command. usage: mem [scriptname] [-t] [number threads]");
                return;
            }

            const s = Player.getCurrentServer();
            const scriptName = commandArray[1];
            let numThreads = 1;
            if (commandArray.length === 4 && commandArray[2] === "-t") {
                numThreads = Math.round(parseInt(commandArray[3]));
                if (isNaN(numThreads) || numThreads < 1) {
                    postError("Invalid number of threads specified. Number of threads must be greater than 1");
                    return;
                }
            }

            const script = Terminal.getScript(scriptName);
            if (script == null) {
                postError("No such script exists!");
                return;
            }

            const ramUsage = script.ramUsage * numThreads;

            post(`This script requires ${numeralWrapper.format(ramUsage, '0.00')} GB of RAM to run for ${numThreads} thread(s)`);
        } catch(e) {
            Terminal.postThrownError(e);
        }
    },

    executeNanoCommand: function(commandArray) {
        if (commandArray.length !== 2) {
            postError("Incorrect usage of nano command. Usage: nano [scriptname]");
            return;
        }

        try {
            const filename = commandArray[1];
            const server = Player.getCurrentServer();
            server.touch(filename);
            const content = Terminal.getFileContent(filename);
            const filepath = Terminal.getFilepath(filename);
            if (filename === ".fconf" && content === ""){
                    content = createFconf();
            } 
            
            Engine.loadScriptEditorContent(filepath, content);
            
        } catch(e) {            
            const filename = commandArray[1];
            console.log(`Error: ${filename} @ ${e}`);
            Terminal.postThrownError(e);
        }
    },

    executeScanCommand: function(commandArray) {
        if (commandArray.length !== 1) {
            postError("Incorrect usage of netstat/scan command. Usage: netstat/scan");
            return;
        }

        // Displays available network connections using TCP
        const currServ = Player.getCurrentServer();
        post("Hostname             IP                   Root Access");
        for (let i = 0; i < currServ.serversOnNetwork.length; i++) {
            // Add hostname
            let entry = getServerOnNetwork(currServ, i);
            if (entry == null) { continue; }
            entry = entry.hostname;

            // Calculate padding and add IP
            let numSpaces = 21 - entry.length;
            let spaces = Array(numSpaces+1).join(" ");
            entry += spaces;
            entry += getServerOnNetwork(currServ, i).ip;

            // Calculate padding and add root access info
            let hasRoot;
            if (getServerOnNetwork(currServ, i).hasAdminRights) {
                hasRoot = 'Y';
            } else {
                hasRoot = 'N';
            }
            numSpaces = 21 - getServerOnNetwork(currServ, i).ip.length;
            spaces = Array(numSpaces+1).join(" ");
            entry += spaces;
            entry += hasRoot;
            post(entry);
        }
    },

    executeScanAnalyzeCommand: function(depth=1, all=false) {
        // TODO Using array as stack for now, can make more efficient
        post("~~~~~~~~~~ Beginning scan-analyze ~~~~~~~~~~");
        post(" ");

        // Map of all servers to keep track of which have been visited
        var visited = {};
        for (const ip in AllServers) {
            visited[ip] = 0;
        }

        const stack = [];
        const depthQueue = [0];
        const currServ = Player.getCurrentServer();
        stack.push(currServ);
        while(stack.length != 0) {
            const s = stack.pop();
            const d = depthQueue.pop();
            const isHacknet = s instanceof HacknetServer;
            if (!all && s.purchasedByPlayer && s.hostname != "home") {
                continue; // Purchased server
            } else if (visited[s.ip] || d > depth) {
                continue; // Already visited or out-of-depth
            } else if (!all && isHacknet) {
                continue; // Hacknet Server
            } else {
                visited[s.ip] = 1;
            }
            for (var i = s.serversOnNetwork.length-1; i >= 0; --i) {
                stack.push(getServerOnNetwork(s, i));
                depthQueue.push(d+1);
            }
            if (d == 0) {continue;} // Don't print current server
            var titleDashes = Array((d-1) * 4 + 1).join("-");
            if (Player.hasProgram(Programs.AutoLink.name)) {
                post("<strong>" +  titleDashes + "> <a class='scan-analyze-link'>"  + s.hostname + "</a></strong>", false);
            } else {
                post("<strong>" + titleDashes + ">" + s.hostname + "</strong>");
            }

            var dashes = titleDashes + "--";
            var c = "NO";
            if (s.hasAdminRights) {c = "YES";}
            post(`${dashes}Root Access: ${c}${!isHacknet ? ", Required hacking skill: " + s.requiredHackingSkill : ""}`);
            if (!isHacknet) { post(dashes + "Number of open ports required to NUKE: " + s.numOpenPortsRequired); }
            post(dashes + "RAM: " + s.maxRam);
            post(" ");
        }

        var links = document.getElementsByClassName("scan-analyze-link");
        for (let i = 0; i < links.length; ++i) {
            (function() {
            var hostname = links[i].innerHTML.toString();
            links[i].onclick = function() {
                if (Terminal.analyzeFlag || Terminal.hackFlag) {return;}
                Terminal.connectToServer(hostname);
            }
            }());// Immediate invocation
        }
    },

    executeScpCommand(commandArray) {
        try {
            if (commandArray.length !== 3) {
                postError("Incorrect usage of scp command. Usage: scp [file] [destination hostname/ip]");
                return;
            }
            const scriptname = Terminal.getFilepath(commandArray[1]);
            if (!scriptname.endsWith(".lit") && !isScriptFilename(scriptname) && !scriptname.endsWith(".txt")) {
                postError("scp only works for scripts, text files (.txt), and literature files (.lit)");
                return;
            }

            const destServer = getServer(commandArray[2]);
            if (destServer == null) {
                postError(`Invalid destination. ${commandArray[2]} not found`);
                return;
            }
            const ip = destServer.ip;
            const currServ = Player.getCurrentServer();

            // Scp for lit files
            if (scriptname.endsWith(".lit")) {
                var found = false;
                for (var i = 0; i < currServ.messages.length; ++i) {
                    if (!(currServ.messages[i] instanceof Message) && currServ.messages[i] == scriptname) {
                        found = true;
                        break;
                    }
                }

                if (!found) { return postError("No such file exists!"); }

                for (var i = 0; i < destServer.messages.length; ++i) {
                    if (destServer.messages[i] === scriptname) {
                        post(scriptname + " copied over to " + destServer.hostname);
                        return; // Already exists
                    }
                }
                destServer.messages.push(scriptname);
                return post(scriptname + " copied over to " + destServer.hostname);
            }

            // Scp for txt files
            if (scriptname.endsWith(".txt")) {
                var found = false, txtFile;
                for (var i = 0; i < currServ.textFiles.length; ++i) {
                    if (currServ.textFiles[i].fn === scriptname) {
                        found = true;
                        txtFile = currServ.textFiles[i];
                        break;
                    }
                }

                if (!found) { return postError("No such file exists!"); }

                let tRes = destServer.writeToTextFile(txtFile.fn, txtFile.text);
                if (!tRes.success) {
                    postError("scp failed");
                    return;
                }
                if (tRes.overwritten) {
                    post(`WARNING: ${scriptname} already exists on ${destServer.hostname} and will be overwriten`);
                    post(`${scriptname} overwritten on ${destServer.hostname}`);
                    return;
                }
                post(`${scriptname} copied over to ${destServer.hostname}`);
                return;
            }

            // Get the current script
            let sourceScript = null;
            for (let i = 0; i < currServ.scripts.length; ++i) {
                if (scriptname == currServ.scripts[i].filename) {
                    sourceScript = currServ.scripts[i];
                    break;
                }
            }
            if (sourceScript == null) {
                postError("scp() failed. No such script exists");
                return;
            }

            let sRes = destServer.writeToScriptFile(scriptname, sourceScript.code);
            if (!sRes.success) {
                postError(`scp failed`);
                return;
            }
            if (sRes.overwritten) {
                post(`WARNING: ${scriptname} already exists on ${destServer.hostname} and will be overwritten`);
                post(`${scriptname} overwritten on ${destServer.hostname}`);
                return;
            }
            post(`${scriptname} copied over to ${destServer.hostname}`);
        } catch(e) {
            Terminal.postThrownError(e);
        }
    },

	// First called when the "run [program]" command is called. Checks to see if you
	// have the executable and, if you do, calls the executeProgram() function
	runProgram: function(commandArray) {
        if (commandArray.length < 2) { return; }

		// Check if you have the program on your computer. If you do, execute it, otherwise
		// display an error message
        const programName = commandArray[1];

        if (Player.hasProgram(programName)) {
            Terminal.executeProgram(commandArray);
            return;
        }
		post("ERROR: No such executable on home computer (Only programs that exist on your home computer can be run)");
	},

	// Contains the implementations of all possible programs
	executeProgram: function(commandArray) {
        if (commandArray.length < 2) { return; }

        var s = Player.getCurrentServer();
        const programName = commandArray[1];
        const splitArgs = commandArray.slice(1);

        // TODO: refactor this/these out of Terminal. This logic could reside closer to the Programs themselves.
        /**
         * @typedef {function (server=, args=)} ProgramHandler
         * @param {Server} server The current server the program is being executed against
         * @param {string[]} args The command line arguments passed in to the program
         * @returns {void}
         */
        /**
         * @type {Object.<string, ProgramHandler}
         */
        const programHandlers = {};
        programHandlers[Programs.NukeProgram.name] = (post, server) => nuke(post, server);
        programHandlers[Programs.BruteSSHProgram.name] = (post, server) => bruteSSH(post, server);
        programHandlers[Programs.FTPCrackProgram.name] = (post, server) => FTPCrack(post, server);
        programHandlers[Programs.RelaySMTPProgram.name] = (post, server) => relaySMTP(post, server);
        programHandlers[Programs.HTTPWormProgram.name] = (post, server) => HTTPWorm(post, server);
        programHandlers[Programs.SQLInjectProgram.name] = (post, server) => SQLInject(post, server);
        programHandlers[Programs.ServerProfiler.name] = (server, args) => {
            if (args.length !== 2) {
                post("Must pass a server hostname or IP as an argument for ServerProfiler.exe");
                return;
            }

            const targetServer = getServer(args[1]);
            if (targetServer == null) {
                post("Invalid server IP/hostname");
                return;
            }
            post(targetServer.hostname + ":");
            post("Server base security level: " + targetServer.baseDifficulty);
            post("Server current security level: " + targetServer.hackDifficulty);
            post("Server growth rate: " + targetServer.serverGrowth);
            post("Netscript hack() execution time: " + numeralWrapper.format(calculateHackingTime(targetServer), '0.0') + "s");
            post("Netscript grow() execution time: " + numeralWrapper.format(calculateGrowTime(targetServer), '0.0') + "s");
            post("Netscript weaken() execution time: " + numeralWrapper.format(calculateWeakenTime(targetServer), '0.0') + "s");
        };
        programHandlers[Programs.AutoLink.name] = () => {
            post("This executable cannot be run.");
            post("AutoLink.exe lets you automatically connect to other servers when using 'scan-analyze'.");
            post("When using scan-analyze, click on a server's hostname to connect to it.");
        };
        programHandlers[Programs.DeepscanV1.name] = () => {
            post("This executable cannot be run.");
            post("DeepscanV1.exe lets you run 'scan-analyze' with a depth up to 5.");
        };
        programHandlers[Programs.DeepscanV2.name] = () => {
            post("This executable cannot be run.");
            post("DeepscanV2.exe lets you run 'scan-analyze' with a depth up to 10.");
        };
        programHandlers[Programs.Flight.name] = () => {
            const numAugReq = Math.round(BitNodeMultipliers.DaedalusAugsRequirement*30)
            const fulfilled = Player.augmentations.length >= numAugReq &&
                Player.money.gt(1e11) &&
                ((Player.hacking_skill >= 2500)||
                (Player.strength >= 1500 &&
                Player.defense >= 1500 &&
                Player.dexterity >= 1500 &&
                Player.agility >= 1500));
            if(!fulfilled) {
                post(`Augmentations: ${Player.augmentations.length} / ${numAugReq}`);

                post(`Money: ${numeralWrapper.format(Player.money.toNumber(), '($0.000a)')} / ${numeralWrapper.format(1e11, '($0.000a)')}`);
                post("One path below must be fulfilled...");
                post("----------HACKING PATH----------");
                post(`Hacking skill: ${Player.hacking_skill} / 2500`);
                post("----------COMBAT PATH----------");
                post(`Strength: ${Player.strength} / 1500`);
                post(`Defense: ${Player.defense} / 1500`);
                post(`Dexterity: ${Player.dexterity} / 1500`);
                post(`Agility: ${Player.agility} / 1500`);
                return;
            }

            post("We will contact you.");
            post("-- Daedalus --");
        };
        programHandlers[Programs.BitFlume.name] = () => {
            const yesBtn = yesNoBoxGetYesButton();
            const noBtn = yesNoBoxGetNoButton();
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
        };

        if (!programHandlers.hasOwnProperty(programName)){
            post("Invalid executable. Cannot be run");
            return;
        }

        programHandlers[programName](s, splitArgs);
	},

    /**
     * Given a filename, returns that file's full path. This takes into account
     * the Terminal's current directory.
     */
    getFilepath : function(filename) {
        //const path = evaluateFilePath(filename, Terminal.currDir, Player.getCurrentServer() );
        //if (path == null) {
        //    throw new Error(`Invalid file path specified: ${filename}`);
        //}

        //if (isInRootDirectory(path)) {
        //    return removeLeadingSlash(path);
        //}

        return Terminal.currDir+filename;
    },

    /**
     * Given a filename, searches and returns that file. File-type agnostic
     */
    getFile: function (filename) {
        if (isScriptFilename(filename)) {
            return Terminal.getScript(filename);
        }

        if (filename.endsWith(".lit")) {
            return Terminal.getLitFile(filename);
        }

        if (filename.endsWith(".txt")) {
            return Terminal.getTextFile(filename);
        }

        return null;
    },

    /**
     * Processes a file path referring to a literature file, taking into account the terminal's
     * current directory + server. Returns the lit file if it exists, and null otherwise
     */
    getLitFile: function(filename) {
        const s = Player.getCurrentServer();
        const filepath = Terminal.getFilepath(filename);
        for (const lit of s.messages) {
            if (typeof lit === "string" && filepath === lit) {
                return lit;
            }
        }

        return null;
    },

    /**
     * Processes a file path referring to a script, taking into account the terminal's
     * current directory + server. Returns the script if it exists, and null otherwise.
     */
    getFileContent: function(filename){
        //console.log(`filename ${filename}; path ${Terminal.getFilepath(filename)}`);
        return Player.getCurrentServer().readFile(Terminal.getFilepath(filename));
    },

    /**
     * Processes a file path referring to a script, taking into account the terminal's
     * current directory + server. Returns the script if it exists, and null otherwise.
     */
    getScript: function(filename) {
        const s = Player.getCurrentServer();
        const filepath = Terminal.getFilepath(filename);
        for (const script of s.scripts) {
            if (filepath === script.filename) {
                return script;
            }
        }

        return null;
    },

    /**
     * Processes a file path referring to a text file, taking into account the terminal's
     * current directory + server. Returns the text file if it exists, and null otherwise.
     */
    getTextFile: function(filename) {
        const s = Player.getCurrentServer();
        const filepath = Terminal.getFilepath(filename);
        for (const txt of s.textFiles) {
            if (filepath === txt.fn) {
                return txt;
            }
        }

        return null;
    },

    postThrownError: function(e) {
        if (e instanceof Error) {
            const errorLabel = "Error: ";
            const errorString = e.toString();
            if (errorString.startsWith(errorLabel)) {
                postError(errorString.slice(errorLabel.length));
            } else {
                postError(errorString);
            }
        }
    },

	runScript: function(commandArray) {
        if (commandArray.length < 2) {
            dialogBoxCreate(`Bug encountered with Terminal.runScript(). Command array has a length of less than 2: ${commandArray}`);
            return;
        }

		const server = Player.getCurrentServer();

        let numThreads = 1;
        const args = [];
        const scriptName = Terminal.getFilepath(commandArray[1]);

        if (commandArray.length > 2) {
            if (commandArray.length >= 4 && commandArray[2] == "-t") {
                numThreads = Math.round(parseFloat(commandArray[3]));
                if (isNaN(numThreads) || numThreads < 1) {
                    postError("Invalid number of threads specified. Number of threads must be greater than 0");
                    return;
                }
                for (let i = 4; i < commandArray.length; ++i) {
                    args.push(commandArray[i]);
                }
            } else {
                for (let i = 2; i < commandArray.length; ++i) {
                    args.push(commandArray[i])
                }
            }
        }


        // Check if this script is already running
        if (findRunningScript(scriptName, args, server) != null) {
            post("ERROR: This script is already running. Cannot run multiple instances");
            return;
        }

		// Check if the script exists and if it does run it
		for (var i = 0; i < server.scripts.length; i++) {
			if (server.scripts[i].filename === scriptName) {
				// Check for admin rights and that there is enough RAM availble to run
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
					// Able to run script
                    var runningScriptObj = new RunningScript(script, args);
                    runningScriptObj.threads = numThreads;

                    if (startWorkerScript(runningScriptObj, server)) {
                        post("Running script with " + numThreads +  " thread(s) and args: " + arrayToString(args) + ".");
                    } else {
                        postError(`Failed to start script`);
                    }
                    return;
				}
			}
		}

		post("ERROR: No such script");
	},

    runContract: async function(contractName) {
        // There's already an opened contract
        if (Terminal.contractOpen) {
            return post("ERROR: There's already a Coding Contract in Progress");
        }

        const serv = Player.getCurrentServer();
        const contract = serv.getContract(contractName);
        if (contract == null) {
            return post("ERROR: No such contract");
        }

        Terminal.contractOpen = true;
        const res = await contract.prompt();

        switch (res) {
            case CodingContractResult.Success:
                var reward = Player.gainCodingContractReward(contract.reward, contract.getDifficulty());
                post(`Contract SUCCESS - ${reward}`);
                serv.removeContract(contract);
                break;
            case CodingContractResult.Failure:
                ++contract.tries;
                if (contract.tries >= contract.getMaxNumTries()) {
                    post("Contract <p style='color:red;display:inline'>FAILED</p> - Contract is now self-destructing");
                    serv.removeContract(contract);
                } else {
                    post(`Contract <p style='color:red;display:inline'>FAILED</p> - ${contract.getMaxNumTries() - contract.tries} tries remaining`);
                }
                break;
            case CodingContractResult.Cancelled:
            default:
                post("Contract cancelled");
                break;
        }
        Terminal.contractOpen = false;
    },
};

export {postNetburnerText, Terminal};
