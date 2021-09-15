import { determineAllPossibilitiesForTabCompletion } from "./Terminal/determineAllPossibilitiesForTabCompletion";
import { tabCompletion } from "./Terminal/tabCompletion";

import { CONSTANTS } from "./Constants";
import { Engine } from "./engine";
import { FconfSettings } from "./Fconf/FconfSettings";
import { Player } from "./Player";
import { setTimeoutRef } from "./utils/SetTimeoutRef";
import { Page, routing } from "./ui/navigationTracking";
import { KEY } from "../utils/helpers/keyCodes";
import { getTimestamp } from "../utils/helpers/getTimestamp";
import { post } from "./ui/postToTerminal";

import { Terminal as TTerminal } from "./Terminal/Terminal";

import autosize from "autosize";

function postVersion() {
  post("Bitburner v" + CONSTANTS.Version);
}

function getTerminalInput() {
  return document.getElementById("terminal-input-text-box").value;
}

// Defines key commands in terminal
$(document).keydown(function (event) {
  // Terminal
  if (routing.isOn(Page.Terminal)) {
    var terminalInput = document.getElementById("terminal-input-text-box");
    if (terminalInput != null && !event.ctrlKey && !event.shiftKey && !Terminal.contractOpen) {
      terminalInput.focus();
    }

    if (event.keyCode === KEY.ENTER) {
      event.preventDefault(); // Prevent newline from being entered in Script Editor
      const command = getTerminalInput();
      const dir = Terminal.currDir;
      post(
        "<span class='prompt'>[" +
          (FconfSettings.ENABLE_TIMESTAMPS ? getTimestamp() + " " : "") +
          Player.getCurrentServer().hostname +
          ` ~${dir}]&gt;</span> ${command}`,
      );

      if (command.length > 0) {
        Terminal.resetTerminalInput(); // Clear input first
        new TTerminal().executeCommands(Engine, Player, command);
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
        Terminal.resetTerminalInput(); // Clear Terminal
      }
    }

    if (event.keyCode === KEY.L && event.ctrlKey) {
      event.preventDefault();
      new TTerminal().executeCommands(Engine, Player, "clear"); // Clear screen
    }

    // Ctrl p same as up arrow
    // Ctrl n same as down arrow

    if (
      event.keyCode === KEY.UPARROW ||
      (FconfSettings.ENABLE_BASH_HOTKEYS && event.keyCode === KEY.P && event.ctrlKey)
    ) {
      if (FconfSettings.ENABLE_BASH_HOTKEYS) {
        event.preventDefault();
      }
      // Cycle through past commands
      if (terminalInput == null) {
        return;
      }
      var i = Terminal.commandHistoryIndex;
      var len = Terminal.commandHistory.length;

      if (len == 0) {
        return;
      }
      if (i < 0 || i > len) {
        Terminal.commandHistoryIndex = len;
      }

      if (i != 0) {
        --Terminal.commandHistoryIndex;
      }
      var prevCommand = Terminal.commandHistory[Terminal.commandHistoryIndex];
      terminalInput.value = prevCommand;
      setTimeoutRef(function () {
        terminalInput.selectionStart = terminalInput.selectionEnd = 10000;
      }, 10);
    }

    if (
      event.keyCode === KEY.DOWNARROW ||
      (FconfSettings.ENABLE_BASH_HOTKEYS && event.keyCode === KEY.M && event.ctrlKey)
    ) {
      if (FconfSettings.ENABLE_BASH_HOTKEYS) {
        event.preventDefault();
      }
      // Cycle through past commands
      if (terminalInput == null) {
        return;
      }
      var i = Terminal.commandHistoryIndex;
      var len = Terminal.commandHistory.length;

      if (len == 0) {
        return;
      }
      if (i < 0 || i > len) {
        Terminal.commandHistoryIndex = len;
      }

      // Latest command, put nothing
      if (i == len || i == len - 1) {
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
      if (terminalInput == null) {
        return;
      }
      let input = terminalInput.value;
      if (input == "") {
        return;
      }

      const semiColonIndex = input.lastIndexOf(";");
      if (semiColonIndex !== -1) {
        input = input.slice(semiColonIndex + 1);
      }

      input = input.trim();
      input = input.replace(/\s\s+/g, " ");

      const commandArray = input.split(" ");
      let index = commandArray.length - 2;
      if (index < -1) {
        index = 0;
      }
      const allPos = determineAllPossibilitiesForTabCompletion(Player, input, index, Terminal.currDir);
      if (allPos.length == 0) {
        return;
      }

      let arg = "";
      let command = "";
      if (commandArray.length == 0) {
        return;
      }
      if (commandArray.length == 1) {
        command = commandArray[0];
      } else if (commandArray.length == 2) {
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
let terminalCtrlPressed = false,
  shiftKeyPressed = false;
$(document).ready(function () {
  if (routing.isOn(Page.Terminal)) {
    $(".terminal-input").focus();
  }
});

$(document).keydown(function (e) {
  if (routing.isOn(Page.Terminal)) {
    if (e.which == KEY.CTRL) {
      terminalCtrlPressed = true;
    } else if (e.shiftKey) {
      shiftKeyPressed = true;
    } else if (terminalCtrlPressed || shiftKeyPressed || Terminal.contractOpen) {
      // Don't focus
    } else {
      var inputTextBox = document.getElementById("terminal-input-text-box");
      if (inputTextBox != null) {
        inputTextBox.focus();
      }

      terminalCtrlPressed = false;
      shiftKeyPressed = false;
    }
  }
});

$(document).keyup(function (e) {
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
  hackFlag: false,
  backdoorFlag: false,
  analyzeFlag: false,
  actionStarted: false,
  actionTime: 0,

  commandHistory: [],
  commandHistoryIndex: 0,

  // True if a Coding Contract prompt is opened
  contractOpen: false,

  // Full Path of current directory
  // Excludes the trailing forward slash
  currDir: "/",

  resetTerminalInput: function (keepInput = false) {
    let input = "";
    if (keepInput) {
      input = getTerminalInput();
    }
    const dir = Terminal.currDir;
    if (FconfSettings.WRAP_INPUT) {
      document.getElementById("terminal-input-td").innerHTML =
        `<div id='terminal-input-header' class='prompt'>[${Player.getCurrentServer().hostname} ~${dir}]$ </div>` +
        `<textarea type="text" id="terminal-input-text-box" class="terminal-input" tabindex="1"  value=\"${input}\"  autocomplete="off" />`;

      // Auto re-size the line element as it wraps
      autosize(document.getElementById("terminal-input-text-box"));
    } else {
      document.getElementById("terminal-input-td").innerHTML =
        `<div id='terminal-input-header' class='prompt'>[${Player.getCurrentServer().hostname} ~${dir}]$ </div>` +
        `<input type="text" id="terminal-input-text-box" class="terminal-input" tabindex="1"  value=\"${input}\" autocomplete="off" />`;
    }
    const hdr = document.getElementById("terminal-input-header");
    hdr.style.display = "inline";

    const terminalInput = document.getElementById("terminal-input-text-box");
    if (typeof terminalInput.selectionStart == "number") {
      terminalInput.selectionStart = terminalInput.selectionEnd = terminalInput.value.length;
    } else if (typeof terminalInput.createTextRange != "undefined") {
      terminalInput.focus();
      var range = el.createTextRange();
      range.collapse(false);
      range.select();
    }
  },

  modifyInput: function (mod) {
    try {
      var terminalInput = document.getElementById("terminal-input-text-box");
      if (terminalInput == null) {
        return;
      }
      terminalInput.focus();

      var inputLength = terminalInput.value.length;
      var start = terminalInput.selectionStart;
      var inputText = terminalInput.value;

      switch (mod.toLowerCase()) {
        case "backspace":
          if (start > 0 && start <= inputLength + 1) {
            terminalInput.value = inputText.substr(0, start - 1) + inputText.substr(start);
          }
          break;
        case "deletewordbefore": // Delete rest of word before the cursor
          for (var delStart = start - 1; delStart > 0; --delStart) {
            if (inputText.charAt(delStart) === " ") {
              terminalInput.value = inputText.substr(0, delStart) + inputText.substr(start);
              return;
            }
          }
          break;
        case "deletewordafter": // Delete rest of word after the cursor
          for (var delStart = start + 1; delStart <= text.length + 1; ++delStart) {
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
    } catch (e) {
      console.error("Exception in Terminal.modifyInput: " + e);
    }
  },

  moveTextCursor: function (loc) {
    try {
      var terminalInput = document.getElementById("terminal-input-text-box");
      if (terminalInput == null) {
        return;
      }
      terminalInput.focus();

      var inputLength = terminalInput.value.length;
      var start = terminalInput.selectionStart;

      switch (loc.toLowerCase()) {
        case "home":
          terminalInput.setSelectionRange(0, 0);
          break;
        case "end":
          terminalInput.setSelectionRange(inputLength, inputLength);
          break;
        case "prevchar":
          if (start > 0) {
            terminalInput.setSelectionRange(start - 1, start - 1);
          }
          break;
        case "prevword":
          for (var i = start - 2; i >= 0; --i) {
            if (terminalInput.value.charAt(i) === " ") {
              terminalInput.setSelectionRange(i + 1, i + 1);
              return;
            }
          }
          terminalInput.setSelectionRange(0, 0);
          break;
        case "nextchar":
          terminalInput.setSelectionRange(start + 1, start + 1);
          break;
        case "nextword":
          for (var i = start + 1; i <= inputLength; ++i) {
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
    } catch (e) {
      console.error("Exception in Terminal.moveTextCursor: " + e);
    }
  },
};

export { postVersion, Terminal };
