import { determineAllPossibilitiesForTabCompletion } from "./Terminal/determineAllPossibilitiesForTabCompletion";
import { tabCompletion } from "./Terminal/tabCompletion";

import { substituteAliases } from "./Alias";
import { CONSTANTS } from "./Constants";
import { Engine } from "./engine";
import { FconfSettings } from "./Fconf/FconfSettings";
import {
    calculateHackingChance,
    calculateHackingExpGain,
    calculatePercentMoneyHacked,
    calculateHackingTime,
} from "./Hacking";
import { HacknetServer } from "./Hacknet/HacknetServer";
import {
    iTutorialNextStep,
    iTutorialSteps,
    ITutorial
} from "./InteractiveTutorial";
import { Player } from "./Player";
import { hackWorldDaemon } from "./RedPill";
import { GetServerByHostname } from "./Server/ServerHelpers";
import {
    SpecialServerIps,
    SpecialServerNames
} from "./Server/SpecialServerIps";
import { setTimeoutRef } from "./utils/SetTimeoutRef";
import { Page, routing } from "./ui/navigationTracking";
import { numeralWrapper } from "./ui/numeralFormat";
import { KEY } from "../utils/helpers/keyCodes";
import { getTimestamp } from "../utils/helpers/getTimestamp";
import {
    post,
    postError,
    hackProgressBarPost,
    hackProgressPost
} from "./ui/postToTerminal";
import * as sys from "./Server/lib/sys";
//////////////////////////////////////////////////////////////////////////////
// Here we import every existing function to let them initialize themselves //
//////////////////////////////////////////////////////////////////////////////
import { mkdir } from "./Server/lib/mkdir";
import { rm } from "./Server/lib/rm";
import { mv } from "./Server/lib/mv";
import { ls } from "./Server/lib/ls";
import { nano } from "./Server/lib/nano";
import { tree } from "./Server/lib/tree";
import { top } from "./Server/lib/top";
import { scan } from "./Server/lib/scan";
import { mem } from "./Server/lib/mem";
import { cd } from "./Server/lib/cd";
import { cls } from "./Server/lib/cls";
import { sudov } from "./Server/lib/sudov";
import { clear } from "./Server/lib/clear";
import { nuke } from "./Server/lib/nuke";
import { analyze } from "./Server/lib/analyze";
import { run } from "./Server/lib/run";
import { FTPCrack } from "./Server/lib/FTPCrack";
import { bruteSSH } from "./Server/lib/bruteSSH";
import { HTTPWorm } from "./Server/lib/HTTPWorm";
import { lscpu } from "./Server/lib/lscpu";
import { hostname } from "./Server/lib/hostname";
import { home } from "./Server/lib/home";
import { connect } from "./Server/lib/connect";
import { ifconfig } from "./Server/lib/ifconfig";
import { scan_analyze } from "./Server/lib/scan_analyze";
import { relaySMTP } from "./Server/lib/relaySMTP";
import { help } from "./Server/lib/help";
import { download } from "./Server/lib/download";
import { cp } from "./Server/lib/cp";
import { scp } from "./Server/lib/scp";
import { expr } from "./Server/lib/expr";
import { check } from "./Server/lib/check";
import { SQLInject } from "./Server/lib/SQLInject";
import { kill } from "./Server/lib/kill";
import { killall } from "./Server/lib/killall";
import { wget } from "./Server/lib/wget";
import { hack } from "./Server/lib/hack";
import { alias } from "./Server/lib/alias";
import { unalias } from "./Server/lib/unalias";
import { theme } from "./Server/lib/theme";
import { ps } from "./Server/lib/ps";
import { buy } from "./Server/lib/buy";
import { tail } from "./Server/lib/tail";
import { ServerProfiler } from "./Server/lib/ServerProfiler";
import { AutoLink } from "./Server/lib/AutoLink";
import { DeepscanV2 } from "./Server/lib/DeepscanV2";
import { DeepscanV1 } from "./Server/lib/DeepscanV1";
import { fl1ght } from "./Server/lib/fl1ght";
import { b1t_flum3 } from "./Server/lib/b1t_flum3";
import { cat } from "./Server/lib/cat";
import { free } from "./Server/lib/free";
import {hasGangAPI} from "./Gangs/lib/hasGangAPI";
import {hasGang} from "./Gangs/lib/hasGang";
import {createGang} from "./Gangs/lib/createGang";
import {getBonusTime} from "./Gangs/lib/getBonusTime";
import {setTerritoryWarfare} from "./Gangs/lib/setTerritoryWarfare";
import {getChanceToWinClash} from "./Gangs/lib/getChanceToWinClash";
import {ascendMember} from "./Gangs/lib/ascendMember";
import {purchaseEquipment} from "./Gangs/lib/purchaseEquipment";
import {getEquipmentCost} from "./Gangs/lib/getEquipmentCost";
import {getEquipmentNames} from "./Gangs/lib/getEquipmentNames";
import {setMemberTask} from "./Gangs/lib/setMemberTask";
//import {getTaskNames} from "./Gangs/lib/getTaskNames";
//import {recruitMember} from "./Gangs/lib/recruitMember";
//import {canRecruitMember} from "./Gangs/lib/canRecruitMember";
//import {getMemberInformation} from "./Gangs/lib/getMemberInformation";
//import {getOtherGangInformation} from "./Gangs/lib/getOtherGangInformation";
//import {getGangInformation} from "./Gangs/lib/getGangInformation";
//import {getMemberNames} from "./Gangs/lib/getMemberNames";
import {getEquipmentType} from "./Gangs/lib/getEquipmentType";

import { fs } from 'memfs';

import autosize from "autosize";
import * as JSZip from "jszip";
import * as FileSaver from "file-saver";

const antlr4 = require('antlr4');
const TerminalLexer = require('../utils/grammars/TerminalLexer').TerminalLexer;
const TerminalParser = require('../utils/grammars/TerminalParser').TerminalParser;
const CommandListener = require('../utils/grammars/CommandListener').CommandListener;

import * as path from 'path';

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
//TODO allow some multiplayer mechanics?
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
    reset: function(){ // called when connecting to a server
        this.resetTerminalInput();

    },

    clearOutput(){
        $("#terminal tr:not(:last)").remove();
        postNetburnerText();
    },

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
        // Process any aliases
        commands = substituteAliases(commands);

        var chars = new antlr4.InputStream(commands); // text
        var lexer = new TerminalLexer(chars);   // text to symbols
        var tokens = new antlr4.CommonTokenStream(lexer); // symbols
        var parser = new TerminalParser(tokens); // symbols to ast
        parser.buildParseTrees = true;
        var tree = parser.commandSequence();
        var commandListener = new CommandListener();
        antlr4.tree.ParseTreeWalker.DEFAULT.walk(commandListener, tree);

        commands = commandListener.parsedCommands;
        // Execute sequentially
        for (let i = 0; i < commands.length; i++) {
            // the parser automatically removes empty statements.
            // we just have to execute them now.
            Terminal.executeCommand(commands[i].string);

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

        // Only split the first space
		const commandArray = Terminal.parseCommandArguments(command);
		if (commandArray.length == 0) { return; }

        /****************** Interactive Tutorial Terminal Commands ******************/
        if (ITutorial.isRunning) {
            var foodnstuffServ = GetServerByHostname("foodnstuff");
            if (foodnstuffServ == null) {throw new Error("Could not get foodnstuff server"); return;}

            switch(ITutorial.currStep) {
            case iTutorialSteps.TerminalHelp:
                if (commandArray.length === 1 && commandArray[0] == "help") {
                    this.executeCommandHelper(command);
                    iTutorialNextStep();
                } else {post("Bad command. Please follow the tutorial");}
                break;
            case iTutorialSteps.TerminalLs:
                if (commandArray.length === 1 && commandArray[0] == "ls") {
                    this.executeCommandHelper(command);
                    iTutorialNextStep();
                } else {post("Bad command. Please follow the tutorial");}
                break;
            case iTutorialSteps.TerminalScan:
                if (commandArray.length === 1 && commandArray[0] == "scan") {
                    this.executeCommandHelper(command);
                    iTutorialNextStep();
                } else {post("Bad command. Please follow the tutorial");}
                break;
            case iTutorialSteps.TerminalScanAnalyze1:
                if (commandArray.length == 1 && commandArray[0] == "scan-analyze") {
                    this.executeCommandHelper(command);
                    iTutorialNextStep();
                } else {post("Bad command. Please follow the tutorial");}
                break;
            case iTutorialSteps.TerminalScanAnalyze2:
                if (commandArray.length == 2 && commandArray[0] == "scan-analyze" &&
                    commandArray[1] === 2) {
                    this.executeCommandHelper(command);
                    iTutorialNextStep();
                } else {post("Bad command. Please follow the tutorial");}
                break;
            case iTutorialSteps.TerminalConnect:
                if (commandArray.length == 2) {
                    if ((commandArray[0] == "connect") &&
                        (commandArray[1] == "foodnstuff" || commandArray[1] == foodnstuffServ.ip)) {
                        this.executeCommandHelper(command);
                        iTutorialNextStep();
                    } else {post("Wrong command! Try again!"); return;}
                } else {post("Bad command. Please follow the tutorial");}
                break;
            case iTutorialSteps.TerminalAnalyze:
                if (commandArray.length === 1 && commandArray[0] === "analyze") {
                    this.executeCommandHelper(command);
                    iTutorialNextStep();
                } else {
                    post("Bad command. Please follow the tutorial");
                }
                break;
            case iTutorialSteps.TerminalNuke:
                if (commandArray.length == 2 &&
                    commandArray[0] == "run" && commandArray[1] == "NUKE.exe") {
                    this.executeCommandHelper(command);
                    iTutorialNextStep();
                } else {post("Bad command. Please follow the tutorial");}
                break;
            case iTutorialSteps.TerminalManualHack:
                if (commandArray.length == 1 && commandArray[0] == "hack") {
                    this.executeCommandHelper(command);
                    iTutorialNextStep();
                } else {post("Bad command. Please follow the tutorial");}
				break;
            case iTutorialSteps.TerminalCreateScript:
                if (commandArray.length == 2 &&
                    commandArray[0] == "nano" && commandArray[1] == "foodnstuff.script") {
                    this.executeCommandHelper(command);
                    iTutorialNextStep();
                } else {post("Bad command. Please follow the tutorial");}
                break;
            case iTutorialSteps.TerminalFree:
                if (commandArray.length == 1 && commandArray[0] == "free") {
                    this.executeCommandHelper(command);
                    iTutorialNextStep();
                } else {post("Bad command. Please follow the tutorial");}
                break;
            case iTutorialSteps.TerminalRunScript:
                if (commandArray.length == 2 &&
                    commandArray[0] == "run" && commandArray[1] == "foodnstuff.script") {
                    this.executeCommandHelper(command);
                    iTutorialNextStep();
                } else {post("Bad command. Please follow the tutorial");}
                break;
            case iTutorialSteps.ActiveScriptsToTerminal:
                if (commandArray.length == 2 &&
                    commandArray[0] == "tail" && commandArray[1] == "foodnstuff.script") {
                    // Check that the script exists on this machine
                    this.executeCommandHelper(command);
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

        this.executeCommandHelper(command);
    },

    // TODO Rename and refactor this. Temporary fix to make Interactive Tutorial work with new filesystem
    executeCommandHelper: function(command) {
        if (Terminal.hackFlag || Terminal.analyzeFlag) {
            postError(`Cannot execute command (${command}) while an action is in progress`);
            return;
        }
        // Process any aliases
        command = substituteAliases(command);

        const commandArray = Terminal.parseCommandArguments(command);
        if (commandArray.length == 0) { return; }

        var server = Player.getCurrentServer();
        var executable = sys.fetchExecutable(commandArray[0]);
        if (!executable) {
            let filepath = commandArray[0];
            // this triggers if the file is in relative pathing format.
            if (!server.exists(filepath) & server.exists(path.resolve(this.currDir + "/" + filepath))) filepath = path.resolve(this.currDir + "/" + filepath);

            if (server.exists(filepath)) {
                // if it's an existing path, check if it is a directory or an executable
                if (server.isDir(filepath))
                    post(`${filepath} is a directory.`);
                else if (server.isExecutable(filepath))
                    run(server, Terminal, post, postError, commandArray)
                else
                    post(`${filepath} is a file.`);
            }
            else postError(`${commandArray[0]} not found`);
        } else {
            if (commandArray[0] === "ls") {
                // Special output command for 'ls' to color directories blue
                const postForLsCommand = (input) => {
                    input.endsWith("/") ? post(input, "#0000EE") : post(input)
                };

                executable(server, Terminal, postForLsCommand, postError, commandArray.splice(1));
            } else {
                executable(server, Terminal, post, postError, commandArray.splice(1));
            }
        }
    },

    /**
     * Return the Terminal's current directory. In most cases, this should be used rather than
     * accesssing Terminal.currDir directly
     */
    getCurrentDirectory: function() {
        return Terminal.currDir === "/" ? Terminal.currDir : `${Terminal.currDir}/`
    },

    /**
     * Given a filename, returns that file's full path. This takes into account
     * the Terminal's current directory.
     */
    getFilepath: function(filename) {
        // Terminal.currDir does not contain the trailing forward slash, so we have to append it if necessary
        const currDir = Terminal.getCurrentDirectory();
        let result = path.resolve(currDir + filename)
        return result;
    },

    /**
     * Processes a file path referring to a script, taking into account the terminal's
     * current directory + server. Returns the script if it exists, and null otherwise.
     */
    getFileContent: function(filename){
        return Player.getCurrentServer().readFile(Terminal.getFilepath(filename));
    },

    getPlayer: function(){
        return Player;
    }
};

export {postNetburnerText, Terminal};
