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

import { Terminal as TTerminal } from "./Terminal/Terminal";

const Terminal = new TTerminal();

// Defines key commands in terminal
$(document).keydown(function (event) {
  // Terminal

  if (event.keyCode === KEY.C && event.ctrlKey) {
    if (Engine._actionInProgress) {
      // Cancel action
      // post("Cancelling...");
      Engine._actionInProgress = false;
      Terminal.finishAction(true);
    } else if (FconfSettings.ENABLE_BASH_HOTKEYS) {
      // Dont prevent default so it still copies
      Terminal.clear(); // Clear Terminal
    }
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

export { Terminal };
