import { Engine } from "./engine";
import { Player } from "./Player";
import { Settings } from "./Settings/Settings";

import { initializeMainMenuLinks } from "./ui/MainMenu/Links";
import { LiteratureNames } from "./Literature/data/LiteratureNames";

import { exceptionAlert } from "../utils/helpers/exceptionAlert";
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

  Engine.loadTerminalContent();

  // Don't autosave during this interactive tutorial
  Engine.Counters.autoSaveCounter = Infinity;
  ITutorial.currStep = 0;
  ITutorial.isRunning = true;

  document.getElementById("interactive-tutorial-container").style.display =
    "block";

  // Exit tutorial button
  const exitButton = clearEventListeners("interactive-tutorial-exit");
  exitButton.addEventListener("click", function () {
    iTutorialEnd();
    return false;
  });

  // Back button
  const backButton = clearEventListeners("interactive-tutorial-back");
  backButton.addEventListener("click", function () {
    iTutorialPrevStep();
    return false;
  });

  // Next button
  const nextButton = clearEventListeners("interactive-tutorial-next");
  nextButton.addEventListener("click", function () {
    iTutorialNextStep();
    return false;
  });

  iTutorialEvaluateStep();
}

function iTutorialEvaluateStep() {
  if (!ITutorial.isRunning) {
    return;
  }

  // Disable and clear main menu
  const terminalMainMenu = clearEventListeners("terminal-menu-link");
  const statsMainMenu = clearEventListeners("stats-menu-link");
  const activeScriptsMainMenu = clearEventListeners("active-scripts-menu-link");
  const hacknetMainMenu = clearEventListeners("hacknet-nodes-menu-link");
  const cityMainMenu = clearEventListeners("city-menu-link");
  const tutorialMainMenu = clearEventListeners("tutorial-menu-link");
  terminalMainMenu.removeAttribute("class");
  statsMainMenu.removeAttribute("class");
  activeScriptsMainMenu.removeAttribute("class");
  hacknetMainMenu.removeAttribute("class");
  cityMainMenu.removeAttribute("class");
  tutorialMainMenu.removeAttribute("class");

  // Interactive Tutorial Next button
  const nextBtn = document.getElementById("interactive-tutorial-next");

  switch (ITutorial.currStep) {
    case iTutorialSteps.Start:
      Engine.loadTerminalContent();
      iTutorialSetText(
        "Welcome to Bitburner, a cyberpunk-themed incremental RPG! " +
          "The game takes place in a dark, dystopian future... The year is 2077...<br><br>" +
          "This tutorial will show you the basics of the game. " +
          "You may skip the tutorial at any time.",
      );
      nextBtn.style.display = "inline-block";
      break;
    case iTutorialSteps.GoToCharacterPage:
      Engine.loadTerminalContent();
      iTutorialSetText(
        "Let's start by heading to the Stats page. Click the <code class='interactive-tutorial-tab flashing-button'>Stats</code> tab on " +
          "the main navigation menu (left-hand side of the screen)",
      );
      nextBtn.style.display = "none";

      // Flash 'Stats' menu and set its tutorial click handler
      statsMainMenu.setAttribute("class", "flashing-button");
      statsMainMenu.addEventListener("click", function () {
        Engine.loadCharacterContent();
        iTutorialNextStep(); //Opening the character page will go to the next step
        return false;
      });
      break;
    case iTutorialSteps.CharacterPage:
      Engine.loadCharacterContent();
      iTutorialSetText(
        "The <code class='interactive-tutorial-tab'>Stats</code> page shows a lot of important information about your progress, " +
          "such as your skills, money, and bonuses. ",
      );
      nextBtn.style.display = "inline-block";
      break;
    case iTutorialSteps.CharacterGoToTerminalPage:
      Engine.loadCharacterContent();
      iTutorialSetText(
        "Let's head to your computer's terminal by clicking the <code class='interactive-tutorial-tab flashing-button'>Terminal</code> tab on the " +
          "main navigation menu.",
      );
      nextBtn.style.display = "none";

      // Flash 'Terminal' menu and set its tutorial click handler
      terminalMainMenu.setAttribute("class", "flashing-button");
      terminalMainMenu.addEventListener("click", function () {
        Engine.loadTerminalContent();
        iTutorialNextStep();
        return false;
      });
      break;
    case iTutorialSteps.TerminalIntro:
      Engine.loadTerminalContent();
      iTutorialSetText(
        "The <code class='interactive-tutorial-tab'>Terminal</code> is used to interface with your home computer as well as " +
          "all of the other machines around the world.",
      );
      nextBtn.style.display = "inline-block";
      break;
    case iTutorialSteps.TerminalHelp:
      Engine.loadTerminalContent();
      iTutorialSetText(
        "Let's try it out. Start by entering the  <code class='interactive-tutorial-command'>help</code> command into the <code class='interactive-tutorial-tab'>Terminal</code> " +
          "(Don't forget to press Enter after typing the command)",
      );
      nextBtn.style.display = "none"; // next step triggered by terminal command
      break;
    case iTutorialSteps.TerminalLs:
      Engine.loadTerminalContent();
      iTutorialSetText(
        "The <code class='interactive-tutorial-command'>help</code> command displays a list of all available <code class='interactive-tutorial-tab'>Terminal</code> commands, how to use them, " +
          "and a description of what they do. <br><br>Let's try another command. Enter the <code class='interactive-tutorial-command'>ls</code> command.",
      );
      nextBtn.style.display = "none"; // next step triggered by terminal command
      break;
    case iTutorialSteps.TerminalScan:
      Engine.loadTerminalContent();
      iTutorialSetText(
        " <code class='interactive-tutorial-command'>ls</code> is a basic command that shows files " +
          "on the computer. Right now, it shows that you have a program called <code class='interactive-tutorial-command'>NUKE.exe</code> on your computer. " +
          "We'll get to what this does later. <br><br>Using your home computer's terminal, you can connect " +
          "to other machines throughout the world. Let's do that now by first entering " +
          "the <code class='interactive-tutorial-command'>scan</code> command.",
      );
      nextBtn.style.display = "none"; // next step triggered by terminal command
      break;
    case iTutorialSteps.TerminalScanAnalyze1:
      Engine.loadTerminalContent();
      iTutorialSetText(
        "The <code class='interactive-tutorial-command'>scan</code> command shows all available network connections. In other words, " +
          "it displays a list of all servers that can be connected to from your " +
          "current machine. A server is identified by its hostname. <br><br> " +
          "That's great and all, but there's so many servers. Which one should you go to? " +
          "The <code class='interactive-tutorial-command'>scan-analyze</code> command gives some more detailed information about servers on the " +
          "network. Try it now!",
      );
      nextBtn.style.display = "none"; // next step triggered by terminal command
      break;
    case iTutorialSteps.TerminalScanAnalyze2:
      Engine.loadTerminalContent();
      iTutorialSetText(
        "You just ran <code class='interactive-tutorial-command'>scan-analyze</code> with a depth of one. This command shows more detailed " +
          "information about each server that you can connect to (servers that are a distance of " +
          "one node away). <br><br> It is also possible to run <code class='interactive-tutorial-command'>scan-analyze</code> with " +
          "a higher depth. Let's try a depth of two with the following command: <code class='interactive-tutorial-command'>scan-analyze 2</code>.",
      );
      nextBtn.style.display = "none"; // next step triggered by terminal command
      break;
    case iTutorialSteps.TerminalConnect:
      Engine.loadTerminalContent();
      iTutorialSetText(
        "Now you can see information about all servers that are up to two nodes away, as well " +
          "as figure out how to navigate to those servers through the network. You can only connect to " +
          "a server that is one node away. To connect to a machine, use the <code class='interactive-tutorial-command'>connect [hostname]</code> command.<br><br>" +
          "From the results of the <code class='interactive-tutorial-command'>scan-analyze</code> command, we can see that the <code class='interactive-tutorial-command'>n00dles</code> server is " +
          "only one node away. Let's connect so it now using: <code class='interactive-tutorial-command'>connect n00dles</code>",
      );
      nextBtn.style.display = "none"; // next step triggered by terminal command
      break;
    case iTutorialSteps.TerminalAnalyze:
      Engine.loadTerminalContent();
      iTutorialSetText(
        "You are now connected to another machine! What can you do now? You can hack it!<br><br> In the year 2077, currency has " +
          "become digital and decentralized. People and corporations store their money " +
          "on servers and computers. Using your hacking abilities, you can hack servers " +
          "to steal money and gain experience. <br><br> " +
          "Before you try to hack a server, you should run diagnostics using the <code class='interactive-tutorial-command'>analyze</code> command.",
      );
      nextBtn.style.display = "none"; // next step triggered by terminal command
      break;
    case iTutorialSteps.TerminalNuke:
      Engine.loadTerminalContent();
      iTutorialSetText(
        "When the <code class='interactive-tutorial-command'>analyze</code> command finishes running it will show useful information " +
          "about hacking the server. <br><br> For this server, the required hacking skill is only <span class='character-hack-cell'>1</span>, " +
          "which means you can hack it right now. However, in order to hack a server " +
          "you must first gain root access. The <code class='interactive-tutorial-command'>NUKE.exe</code> program that we saw earlier on your " +
          "home computer is a virus that will grant you root access to a machine if there are enough " +
          "open ports.<br><br> The <code class='interactive-tutorial-command'>analyze</code> results shows that there do not need to be any open ports " +
          "on this machine for the NUKE virus to work, so go ahead and run the virus using the " +
          "<code class='interactive-tutorial-command'>run NUKE.exe</code> command.",
      );
      nextBtn.style.display = "none"; // next step triggered by terminal command
      break;
    case iTutorialSteps.TerminalManualHack:
      Engine.loadTerminalContent();
      iTutorialSetText(
        "You now have root access! You can hack the server using the <code class='interactive-tutorial-command'>hack</code> command. " +
          "Try doing that now.",
      );
      nextBtn.style.display = "none"; // next step triggered by terminal command
      break;
    case iTutorialSteps.TerminalHackingMechanics:
      Engine.loadTerminalContent();
      iTutorialSetText(
        "You are now attempting to hack the server. Performing a hack takes time and " +
          "only has a certain percentage chance " +
          "of success. This time and success chance is determined by a variety of factors, including " +
          "your hacking skill and the server's security level.<br><br>" +
          "If your attempt to hack the server is successful, you will steal a certain percentage " +
          "of the server's total money. This percentage is affected by your hacking skill and " +
          "the server's security level.<br><br>The amount of money on a server is not limitless. So, if " +
          "you constantly hack a server and deplete its money, then you will encounter " +
          "diminishing returns in your hacking.",
      );
      nextBtn.style.display = "inline-block";
      break;
    case iTutorialSteps.TerminalCreateScript:
      Engine.loadTerminalContent();
      iTutorialSetText(
        "Hacking is the core mechanic of the game and is necessary for progressing. However, " +
          "you don't want to be hacking manually the entire time. You can automate your hacking " +
          "by writing scripts!<br><br>To create a new script or edit an existing one, you can use the <code class='interactive-tutorial-command'>nano</code> " +
          "command. Scripts must end with the <code class='interactive-tutorial-command'>.script</code> extension. Let's make a script now by " +
          "entering <code class='interactive-tutorial-command'>nano n00dles.script</code> after the hack command finishes running (Sidenote: Pressing ctrl + c" +
          " will end a command like hack early)",
      );
      nextBtn.style.display = "none"; // next step triggered by terminal command
      break;
    case iTutorialSteps.TerminalTypeScript:
      Engine.loadScriptEditorContent("n00dles.script", "");
      iTutorialSetText(
        "This is the script editor. You can use it to program your scripts. Scripts are " +
          "written in a simplified version of javascript. Copy and paste the following code into the script editor: <br><br>" +
          "<pre class='interactive-tutorial-code'>" +
          "while(true) {\n" +
          "  hack('n00dles');\n" +
          "}</pre>" +
          "For anyone with basic programming experience, this code should be straightforward. " +
          "This script will continuously hack the <code class='interactive-tutorial-command'>n00dles</code> server.<br><br>" +
          "To save and close the script editor, press the button in the bottom left, or press ctrl + b.",
      );
      nextBtn.style.display = "none"; // next step triggered in saveAndCloseScriptEditor() (Script.js)
      break;
    case iTutorialSteps.TerminalFree:
      Engine.loadTerminalContent();
      iTutorialSetText(
        "Now we'll run the script. Scripts require a certain amount of RAM to run, and can be " +
          "run on any machine which you have root access to. Different servers have different " +
          "amounts of RAM. You can also purchase more RAM for your home server.<br><br>To check how much " +
          "RAM is available on this machine, enter the <code class='interactive-tutorial-command'>free</code> command.",
      );
      nextBtn.style.display = "none"; // next step triggered by terminal commmand
      break;
    case iTutorialSteps.TerminalRunScript:
      Engine.loadTerminalContent();
      iTutorialSetText(
        "We have 4GB of free RAM on this machine, which is enough to run our " +
          "script. Let's run our script using <code class='interactive-tutorial-command'>run n00dles.script</code>.",
      );
      nextBtn.style.display = "none"; // next step triggered by terminal commmand
      break;
    case iTutorialSteps.TerminalGoToActiveScriptsPage:
      Engine.loadTerminalContent();
      iTutorialSetText(
        "Your script is now running! " +
          "It will continuously run in the background and will automatically stop if " +
          "the code ever completes (the <code class='interactive-tutorial-command'>n00dles.script</code> will never complete because it " +
          "runs an infinite loop). <br><br>These scripts can passively earn you income and hacking experience. " +
          "Your scripts will also earn money and experience while you are offline, although at a " +
          "slightly slower rate. <br><br> " +
          "Let's check out some statistics for our running scripts by clicking the " +
          "<code class='interactive-tutorial-tab flashing-button'>Active Scripts</code> link in the main navigation menu.",
      );
      nextBtn.style.display = "none";

      // Flash 'Active Scripts' menu and set its tutorial click handler
      activeScriptsMainMenu.setAttribute("class", "flashing-button");
      activeScriptsMainMenu.addEventListener("click", function () {
        Engine.loadActiveScriptsContent();
        iTutorialNextStep();
        return false;
      });
      break;
    case iTutorialSteps.ActiveScriptsPage:
      Engine.loadActiveScriptsContent();
      iTutorialSetText(
        "This page displays information about all of your scripts that are " +
          "running across every server. You can use this to gauge how well " +
          "your scripts are doing. Let's go back to the <code class='interactive-tutorial-tab flashing-button'>Terminal</code>",
      );
      nextBtn.style.display = "none";

      // Flash 'Terminal' button and set its tutorial click handler
      terminalMainMenu.setAttribute("class", "flashing-button");
      terminalMainMenu.addEventListener("click", function () {
        Engine.loadTerminalContent();
        iTutorialNextStep();
        return false;
      });
      break;
    case iTutorialSteps.ActiveScriptsToTerminal:
      Engine.loadTerminalContent();
      iTutorialSetText(
        "One last thing about scripts, each active script contains logs that detail " +
          "what it's doing. We can check these logs using the <code class='interactive-tutorial-command'>tail</code> command. Do that " +
          "now for the script we just ran by typing <code class='interactive-tutorial-command'>tail n00dles.script</code>",
      );
      nextBtn.style.display = "none"; // next step triggered by terminal command
      break;
    case iTutorialSteps.TerminalTailScript:
      Engine.loadTerminalContent();
      iTutorialSetText(
        "The log for this script won't show much right now (it might show nothing at all) because it " +
          "just started running...but check back again in a few minutes! <br><br>" +
          "This covers the basics of hacking. To learn more about writing " +
          "scripts, select the <code class='interactive-tutorial-tab'>Tutorial</code> link in the " +
          "main navigation menu to look at the documentation. " +
          "<strong style='background-color:#444;'>If you are an experienced JavaScript " +
          "developer, I would highly suggest you check out the section on " +
          "NetscriptJS/Netscript 2.0, it's faster and more powerful.</strong><br><br>For now, let's move on to something else!",
      );
      nextBtn.style.display = "inline-block";
      break;
    case iTutorialSteps.GoToHacknetNodesPage:
      Engine.loadTerminalContent();
      iTutorialSetText(
        "Hacking is not the only way to earn money. One other way to passively " +
          "earn money is by purchasing and upgrading Hacknet Nodes. Let's go to " +
          "the <code class='interactive-tutorial-tab flashing-button'>Hacknet</code> page through the main navigation menu now.",
      );
      nextBtn.style.display = "none";

      // Flash 'Hacknet' menu and set its tutorial click handler
      hacknetMainMenu.setAttribute("class", "flashing-button");
      hacknetMainMenu.addEventListener("click", function () {
        Engine.loadHacknetNodesContent();
        iTutorialNextStep();
        return false;
      });
      break;
    case iTutorialSteps.HacknetNodesIntroduction:
      Engine.loadHacknetNodesContent();
      iTutorialSetText(
        "here you can purchase new Hacknet Nodes and upgrade your " +
          "existing ones. Let's purchase a new one now.",
      );
      nextBtn.style.display = "none"; // Next step triggered by purchaseHacknet() (HacknetNode.js)
      break;
    case iTutorialSteps.HacknetNodesGoToWorldPage:
      Engine.loadHacknetNodesContent();
      iTutorialSetText(
        "You just purchased a Hacknet Node! This Hacknet Node will passively " +
          "earn you money over time, both online and offline. When you get enough " +
          " money, you can upgrade " +
          "your newly-purchased Hacknet Node below.<br><br>" +
          "Let's go to the <code class='interactive-tutorial-tab flashing-button'>City</code> page through the main navigation menu.",
      );
      nextBtn.style.display = "none";

      // Flash 'City' menu and set its tutorial click handler
      cityMainMenu.setAttribute("class", "flashing-button");
      cityMainMenu.addEventListener("click", function () {
        Engine.loadLocationContent();
        iTutorialNextStep();
        return false;
      });
      break;
    case iTutorialSteps.WorldDescription:
      Engine.loadLocationContent();
      iTutorialSetText(
        "This page lists all of the different locations you can currently " +
          "travel to. Each location has something that you can do. " +
          "There's a lot of content out in the world, make sure " +
          "you explore and discover!<br><br>" +
          "Lastly, click on the <code class='interactive-tutorial-tab flashing-button'>Tutorial</code> link in the main navigation menu.",
      );
      nextBtn.style.display = "none";

      // Flash 'Tutorial' menu and set its tutorial click handler
      tutorialMainMenu.setAttribute("class", "flashing-button");
      tutorialMainMenu.addEventListener("click", function () {
        Engine.loadTutorialContent();
        iTutorialNextStep();
        return false;
      });
      break;
    case iTutorialSteps.TutorialPageInfo:
      Engine.loadTutorialContent();
      iTutorialSetText(
        "This page contains a lot of different documentation about the game's " +
          "content and mechanics. <strong style='background-color:#444;'> I know it's a lot, but I highly suggest you read " +
          "(or at least skim) through this before you start playing</strong>. That's the end of the tutorial. " +
          "Hope you enjoy the game!",
      );
      nextBtn.style.display = "inline-block";
      nextBtn.innerHTML = "Finish Tutorial";
      break;
    case iTutorialSteps.End:
      iTutorialEnd();
      break;
    default:
      throw new Error("Invalid tutorial step");
  }

  if (ITutorial.stepIsDone[ITutorial.currStep] === true) {
    nextBtn.style.display = "inline-block";
  }
}

// Go to the next step and evaluate it
function iTutorialNextStep() {
  // Special behavior for certain steps
  if (ITutorial.currStep === iTutorialSteps.GoToCharacterPage) {
    document.getElementById("stats-menu-link").removeAttribute("class");
  }
  if (ITutorial.currStep === iTutorialSteps.CharacterGoToTerminalPage) {
    document.getElementById("terminal-menu-link").removeAttribute("class");
  }
  if (ITutorial.currStep === iTutorialSteps.TerminalGoToActiveScriptsPage) {
    document
      .getElementById("active-scripts-menu-link")
      .removeAttribute("class");
  }
  if (ITutorial.currStep === iTutorialSteps.ActiveScriptsPage) {
    document.getElementById("terminal-menu-link").removeAttribute("class");
  }
  if (ITutorial.currStep === iTutorialSteps.GoToHacknetNodesPage) {
    document.getElementById("hacknet-nodes-menu-link").removeAttribute("class");
  }
  if (ITutorial.currStep === iTutorialSteps.HacknetNodesGoToWorldPage) {
    document.getElementById("city-menu-link").removeAttribute("class");
  }
  if (ITutorial.currStep === iTutorialSteps.WorldDescription) {
    document.getElementById("tutorial-menu-link").removeAttribute("class");
  }

  ITutorial.stepIsDone[ITutorial.currStep] = true;
  if (ITutorial.currStep < iTutorialSteps.End) {
    ITutorial.currStep += 1;
  }
  iTutorialEvaluateStep();
}

// Go to previous step and evaluate
function iTutorialPrevStep() {
  if (ITutorial.currStep > iTutorialSteps.Start) {
    ITutorial.currStep -= 1;
  }
  iTutorialEvaluateStep();
}

function iTutorialEnd() {
  // Re-enable auto save
  if (Settings.AutosaveInterval === 0) {
    Engine.Counters.autoSaveCounter = Infinity;
  } else {
    Engine.Counters.autoSaveCounter = Settings.AutosaveInterval * 5;
  }

  // Initialize references to main menu links
  // We have to call initializeMainMenuLinks() again because the Interactive Tutorial
  // re-creates Main menu links with clearEventListeners()
  if (!initializeMainMenuLinks()) {
    const errorMsg =
      "Failed to initialize Main Menu Links. Please try refreshing the page. " +
      "If that doesn't work, report the issue to the developer";
    exceptionAlert(new Error(errorMsg));
    console.error(errorMsg);
    return;
  }
  Engine.init();

  ITutorial.currStep = iTutorialSteps.End;
  ITutorial.isRunning = false;
  document.getElementById("interactive-tutorial-container").style.display =
    "none";

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

  Player.getHomeComputer().messages.push(
    LiteratureNames.HackersStartingHandbook,
  );
}

let textBox = null;
(function () {
  function set() {
    textBox = document.getElementById("interactive-tutorial-text");
    document.removeEventListener("DOMContentLoaded", set);
  }
  document.addEventListener("DOMContentLoaded", set);
})();

function iTutorialSetText(txt) {
  textBox.innerHTML = txt;
  textBox.parentElement.scrollTop = 0; // this resets scroll position
}

export {
  iTutorialSteps,
  iTutorialEnd,
  iTutorialStart,
  iTutorialNextStep,
  ITutorial,
};
