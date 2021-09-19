import { Engine } from "./engine";
import { Player } from "./Player";
import { Settings } from "./Settings/Settings";

import { LiteratureNames } from "./Literature/data/LiteratureNames";

import { ITutorialEvents } from "./ui/InteractiveTutorial/ITutorialEvents";

import { clearEventListeners } from "../utils/uiHelpers/clearEventListeners";
import { createElement } from "../utils/uiHelpers/createElement";
import { createPopup } from "../utils/uiHelpers/createPopup";
import { removeElementById } from "../utils/uiHelpers/removeElementById";

// Ordered array of keys to Interactive Tutorial Steps
const orderedITutorialSteps = [
  "Start",
  "GoToCharacterPage", // Click on 'Stats' page
  "CharacterPage", // Introduction to 'Stats' page
  "CharacterGoToTerminalPage", // Go back to Terminal
  "TerminalIntro", // Introduction to Terminal
  "TerminalHelp", // Using 'help' Terminal command
  "TerminalLs", // Using 'ls' Terminal command
  "TerminalScan", // Using 'scan' Terminal command
  "TerminalScanAnalyze1", // Using 'scan-analyze' Terminal command
  "TerminalScanAnalyze2", // Using 'scan-analyze 3' Terminal command
  "TerminalConnect", // Connecting to n00dles
  "TerminalAnalyze", // Analyzing n00dles
  "TerminalNuke", // NUKE n00dles
  "TerminalManualHack", // Hack n00dles
  "TerminalHackingMechanics", // Explanation of hacking mechanics
  "TerminalGoHome", // Go home before creating a script.
  "TerminalCreateScript", // Create a script using 'nano'
  "TerminalTypeScript", // Script Editor page - Type script and then save & close
  "TerminalFree", // Using 'Free' Terminal command
  "TerminalRunScript", // Running script using 'run' Terminal command
  "TerminalGoToActiveScriptsPage",
  "ActiveScriptsPage",
  "ActiveScriptsToTerminal",
  "TerminalTailScript",
  "GoToHacknetNodesPage",
  "HacknetNodesIntroduction",
  "HacknetNodesGoToWorldPage",
  "WorldDescription",
  "TutorialPageInfo",
  "End",
];

// Create an 'enum' for the Steps
const iTutorialSteps = {};
for (let i = 0; i < orderedITutorialSteps.length; ++i) {
  iTutorialSteps[orderedITutorialSteps[i]] = i;
}

const ITutorial = {
  currStep: 0, // iTutorialSteps.Start
  isRunning: false,

  // Keeps track of whether each step has been done
  stepIsDone: {},
};

function iTutorialStart() {
  // Initialize Interactive Tutorial state by settings 'done' for each state to false
  ITutorial.stepIsDone = {};
  for (let i = 0; i < orderedITutorialSteps.length; ++i) {
    ITutorial.stepIsDone[i] = false;
  }

  // Don't autosave during this interactive tutorial
  Engine.Counters.autoSaveCounter = Infinity;
  ITutorial.currStep = 0;
  ITutorial.isRunning = true;
}

// Go to the next step and evaluate it
function iTutorialNextStep() {
  ITutorial.stepIsDone[ITutorial.currStep] = true;
  if (ITutorial.currStep < iTutorialSteps.End) {
    ITutorial.currStep += 1;
  }
  if (ITutorial.currStep === iTutorialSteps.End) iTutorialEnd();
  ITutorialEvents.emit();
}

// Go to previous step and evaluate
function iTutorialPrevStep() {
  if (ITutorial.currStep > iTutorialSteps.Start) {
    ITutorial.currStep -= 1;
  }
  ITutorialEvents.emit();
}

function iTutorialEnd() {
  ITutorial.isRunning = false;

  // Create a popup with final introductory stuff
  const popupId = "interactive-tutorial-ending-popup";
  const txt = createElement("p", {
    innerHTML:
      "If you are new to the game, the following links may be useful for you!<br><br>" +
      "<a class='a-link-button' href='https://bitburner.readthedocs.io/en/latest/guidesandtips/gettingstartedguideforbeginnerprogrammers.html' target='_blank'>Getting Started Guide</a>" +
      "<a class='a-link-button' href='https://bitburner.readthedocs.io/en/latest/' target='_blank'>Documentation</a><br><br>" +
      "The Beginner's Guide to Hacking was added to your home computer! It contains some tips/pointers for starting out with the game. " +
      "To read it, go to Terminal and enter<br><br>cat " +
      LiteratureNames.HackersStartingHandbook,
  });
  const gotitBtn = createElement("a", {
    class: "a-link-button",
    float: "right",
    padding: "6px",
    innerText: "Got it!",
    clickListener: () => {
      removeElementById(popupId);
    },
  });
  createPopup(popupId, [txt, gotitBtn]);

  Player.getHomeComputer().messages.push(LiteratureNames.HackersStartingHandbook);
  ITutorialEvents.emit();
}

export { iTutorialSteps, iTutorialEnd, iTutorialStart, iTutorialNextStep, ITutorial, iTutorialPrevStep };
