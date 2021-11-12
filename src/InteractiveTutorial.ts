import { Player } from "./Player";

import { LiteratureNames } from "./Literature/data/LiteratureNames";

import { ITutorialEvents } from "./ui/InteractiveTutorial/ITutorialEvents";

// Ordered array of keys to Interactive Tutorial Steps
enum iTutorialSteps {
  Start,
  GoToCharacterPage, // Click on 'Stats' page
  CharacterPage, // Introduction to 'Stats' page
  CharacterGoToTerminalPage, // Go back to Terminal
  TerminalIntro, // Introduction to Terminal
  TerminalHelp, // Using 'help' Terminal command
  TerminalLs, // Using 'ls' Terminal command
  TerminalScan, // Using 'scan' Terminal command
  TerminalScanAnalyze1, // Using 'scan-analyze' Terminal command
  TerminalScanAnalyze2, // Using 'scan-analyze 3' Terminal command
  TerminalConnect, // Connecting to n00dles
  TerminalAnalyze, // Analyzing n00dles
  TerminalNuke, // NUKE n00dles
  TerminalManualHack, // Hack n00dles
  TerminalHackingMechanics, // Explanation of hacking mechanics
  TerminalGoHome, // Go home before creating a script.
  TerminalCreateScript, // Create a script using 'nano'
  TerminalTypeScript, // Script Editor page - Type script and then save & close
  TerminalFree, // Using 'Free' Terminal command
  TerminalRunScript, // Running script using 'run' Terminal command
  TerminalGoToActiveScriptsPage,
  ActiveScriptsPage,
  ActiveScriptsToTerminal,
  TerminalTailScript,
  GoToHacknetNodesPage,
  HacknetNodesIntroduction,
  HacknetNodesGoToWorldPage,
  WorldDescription,
  TutorialPageInfo,
  End,
}

const ITutorial: {
  currStep: iTutorialSteps;
  isRunning: boolean;
  stepIsDone: {
    [iTutorialSteps.Start]: boolean;
    [iTutorialSteps.GoToCharacterPage]: boolean;
    [iTutorialSteps.CharacterPage]: boolean;
    [iTutorialSteps.CharacterGoToTerminalPage]: boolean;
    [iTutorialSteps.TerminalIntro]: boolean;
    [iTutorialSteps.TerminalHelp]: boolean;
    [iTutorialSteps.TerminalLs]: boolean;
    [iTutorialSteps.TerminalScan]: boolean;
    [iTutorialSteps.TerminalScanAnalyze1]: boolean;
    [iTutorialSteps.TerminalScanAnalyze2]: boolean;
    [iTutorialSteps.TerminalConnect]: boolean;
    [iTutorialSteps.TerminalAnalyze]: boolean;
    [iTutorialSteps.TerminalNuke]: boolean;
    [iTutorialSteps.TerminalManualHack]: boolean;
    [iTutorialSteps.TerminalHackingMechanics]: boolean;
    [iTutorialSteps.TerminalGoHome]: boolean;
    [iTutorialSteps.TerminalCreateScript]: boolean;
    [iTutorialSteps.TerminalTypeScript]: boolean;
    [iTutorialSteps.TerminalFree]: boolean;
    [iTutorialSteps.TerminalRunScript]: boolean;
    [iTutorialSteps.TerminalGoToActiveScriptsPage]: boolean;
    [iTutorialSteps.ActiveScriptsPage]: boolean;
    [iTutorialSteps.ActiveScriptsToTerminal]: boolean;
    [iTutorialSteps.TerminalTailScript]: boolean;
    [iTutorialSteps.GoToHacknetNodesPage]: boolean;
    [iTutorialSteps.HacknetNodesIntroduction]: boolean;
    [iTutorialSteps.HacknetNodesGoToWorldPage]: boolean;
    [iTutorialSteps.WorldDescription]: boolean;
    [iTutorialSteps.TutorialPageInfo]: boolean;
    [iTutorialSteps.End]: boolean;
  };
} = {
  currStep: iTutorialSteps.Start,
  isRunning: false,

  // Keeps track of whether each step has been done
  stepIsDone: {
    [iTutorialSteps.Start]: false,
    [iTutorialSteps.GoToCharacterPage]: false,
    [iTutorialSteps.CharacterPage]: false,
    [iTutorialSteps.CharacterGoToTerminalPage]: false,
    [iTutorialSteps.TerminalIntro]: false,
    [iTutorialSteps.TerminalHelp]: false,
    [iTutorialSteps.TerminalLs]: false,
    [iTutorialSteps.TerminalScan]: false,
    [iTutorialSteps.TerminalScanAnalyze1]: false,
    [iTutorialSteps.TerminalScanAnalyze2]: false,
    [iTutorialSteps.TerminalConnect]: false,
    [iTutorialSteps.TerminalAnalyze]: false,
    [iTutorialSteps.TerminalNuke]: false,
    [iTutorialSteps.TerminalManualHack]: false,
    [iTutorialSteps.TerminalHackingMechanics]: false,
    [iTutorialSteps.TerminalGoHome]: false,
    [iTutorialSteps.TerminalCreateScript]: false,
    [iTutorialSteps.TerminalTypeScript]: false,
    [iTutorialSteps.TerminalFree]: false,
    [iTutorialSteps.TerminalRunScript]: false,
    [iTutorialSteps.TerminalGoToActiveScriptsPage]: false,
    [iTutorialSteps.ActiveScriptsPage]: false,
    [iTutorialSteps.ActiveScriptsToTerminal]: false,
    [iTutorialSteps.TerminalTailScript]: false,
    [iTutorialSteps.GoToHacknetNodesPage]: false,
    [iTutorialSteps.HacknetNodesIntroduction]: false,
    [iTutorialSteps.HacknetNodesGoToWorldPage]: false,
    [iTutorialSteps.WorldDescription]: false,
    [iTutorialSteps.TutorialPageInfo]: false,
    [iTutorialSteps.End]: false,
  },
};

function iTutorialStart(): void {
  ITutorial.isRunning = true;
}

// Go to the next step and evaluate it
function iTutorialNextStep(): void {
  ITutorial.stepIsDone[ITutorial.currStep] = true;
  if (ITutorial.currStep < iTutorialSteps.End) {
    ITutorial.currStep += 1;
  }
  if (ITutorial.currStep === iTutorialSteps.End) iTutorialEnd();
  ITutorialEvents.emit();
}

// Go to previous step and evaluate
function iTutorialPrevStep(): void {
  if (ITutorial.currStep > iTutorialSteps.Start) {
    ITutorial.currStep -= 1;
  }
  ITutorialEvents.emit();
}

function iTutorialEnd(): void {
  ITutorial.isRunning = false;
  ITutorial.currStep = iTutorialSteps.End;
  Player.getHomeComputer().messages.push(LiteratureNames.HackersStartingHandbook);
  ITutorialEvents.emit();
}

export { iTutorialSteps, iTutorialEnd, iTutorialStart, iTutorialNextStep, ITutorial, iTutorialPrevStep };
