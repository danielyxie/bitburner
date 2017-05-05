/* InteractiveTutorial.js */
iTutorialSteps = {
    Start: "Start",
    GoToCharacterPage: "Click on the Character page menu link",
    CharacterPage: "Introduction to Character page",
    CharacterGoToTerminalPage: "Click on the Terminal link",
    TerminalIntro: "Introduction to terminal interface",
    TerminalHelp: "Using the help command to display all options in terminal",
    TerminalLs: "Use the ls command to show all programs/scripts. Right now we have NUKE.exe",
    TerminalScan: "Using the scan command to display all available connections",
    TerminalConnect: "Using the telnet/connect command to connect to another server",
    TerminalAnalyze: "Use the analyze command to display details about this server",
    TerminalNuke: "Use the NUKE Program to gain root access to a server", 
    TerminalManualHack: "Use the hack command to manually hack a server",
    TerminalCreateScript: "Create a script using nano",
    TerminalTypeScript: "This occurs in the Script Editor page...type the script then save and close","
    TerminalRunScript: "Use the run command to run a script",
    TerminalGoToActiveScriptsPage: "Go to the ActiveScriptsPage",
    ActiveScriptsPage: "Introduction to the Active Scripts Page",
    ActiveScriptsToTerminal: "Go from Active Scripts Page Back to Terminal",
    TerminalTailScript: "Use the tail command to show a script's logs",
    GoToHacknetNodesPage: "Go to the Hacknet Nodes page", 
    HacknetNodesIntroduction: "Introduction to Hacknet Nodes",
    HacknetNodesPurchase: "Have the user purchase a Hacknet Node",
    HacknetNodesGoToWorldPage: "Go to the world page",
    WorldDescription: "Tell the user to explore..theres a lot of different stuff to do out there",
    WorldGoToTutorialPage: "Go to the Tutorial Page",
    TutorialPageInfo: "The tutorial page contains a lot of info on different subjects",
    End: "End",
}

var currITutorialStep = iTutorialSteps.Start;
var iTutorialIsRunning = false;

function iTutorialStart() {
    currITutorialStep = iTutorialSteps.Start;
    iTutorialIsRunning = true;
    
    document.getElementById("interactive-tutorial-container").style.display = "block";
    
    //Exit tutorial button
    var exitButton = clearEventListeners("interactive-tutorial-exit");
    exitButton.addEventListener("click", function() {
        iTutorialEnd();
    });
}

function iTutorialEvaluateStep() {
    switch(currITutorialStep) {
    case iTutorialSteps.Start:
        iTutorialSetText("Welcome to Bitburner, a cyberpunk-themed incremental RPG! <br><br>" + 
                         "This tutorial will show you the basics of the game to help you get started. " + 
                         "You may skip the tutorial at any time");
        var next = clearEventListeners("interactive-tutorial-next");
        next.addEventListener("click", function() {
            iTutorialNextStep();
            return false;
        });
        break;
    case iTutorialSteps.GoToCharacterPage:
        iTutorialSetText("Let's start by heading to the Character page. Click the 'Character' tab on " + 
                         "the main navigation menu (left-hand side of the screen)");
                         
        //No next button
        var next = clearEventListeners("interactive-tutorial-next");
        next.style.display = "none";
        
        //Initialize everything necessary to open the "Character" page
        Engine.Clickables.characterMainMenuButton = document.getElementById("character-menu-link");
        Engine.Clickables.characterMainMenuButton.addEventListener("click", function() {
            Engine.loadCharacterContent();
            iTutorialNextStep(); //Opening the character page will go to the next step
            return false;
        });
        break;
    case iTutorialSteps.CharacterPage:
        iTutorialSetText("The Character page shows a lot of important information about your progress, " + 
                         "such as your stats, skills, money, and bonuses/multipliers. ")
        var next = clearEventListeners("interactive-tutorial-next");
        next.style.display = "inline-block";
        next.addEventListener("click", function() {
            iTutorialNextStep();
            return false;
        });
        break;
    case iTutorialSteps.CharacterGoToTerminalPage:
        iTutorialSetText("Let's head to your computer's terminal by clicking the 'Terminal' tab on the " +
                         "main navigation menu");
        //No next button
        var next = clearEventListeners("interactive-tutorial-next");
        next.style.display = "none";
        
        //Initialize everything necessary to open the 'Terminal' Page
        Engine.Clickables.terminalMainMenuButton = document.getElementById("terminal-menu-link");
        Engine.Clickables.terminalMainMenuButton.addEventListener("click", function() {
            Engine.loadTerminalContent();
            iTutorialNextStep();
            return false;
        });
        break;
    case iTutorialSteps.TerminalIntro:
        break;
    case iTutorialSteps.TerminalHelp:
        break;
    case iTutorialSteps.TerminalLs:
        break;
    case iTutorialSteps.TerminalScan:
        break;
    case iTutorialSteps.TerminalConnect:
        break;
    case iTutorialSteps.TerminalAnalyze:
        break;
    case iTutorialSteps.TerminalNuke:
        break;
    case iTutorialSteps.TerminalManualHack:
        break;
    case iTutorialSteps.TerminalCreateScript:
        break;
    case iTutorialSteps.TerminalTypeScript:
        break;
    case iTutorialSteps.TerminalRunScript:
        break;
    case iTutorialSteps.TerminalGoToActiveScriptsPage:
        break;
    case iTutorialSteps.ActiveScriptsPage:
        break;
    case iTutorialSteps.ActiveScriptsToTerminal:
        break;
    case iTutorialSteps.TerminalTailScript:
        break;
    case iTutorialSteps.GoToHacknetNodesPage:
        break;
    case iTutorialSteps.HacknetNodesIntroduction:
        break;
    case iTutorialSteps.HacknetNodesPurchase:
        break;
    case iTutorialSteps.HacknetNodesGoToWorldPage:
        break;
    case iTutorialSteps.WorldDescription:
        break;
    case iTutorialSteps.WorldGoToTutorialPage:
        break;
    case iTutorialSteps.TutorialPageInfo:
        break;
    case iTutorialSteps.End:
        break;
    default:
        throw new Error("Invalid tutorial step");
    }
}

//Go to the next step and evaluate it
function iTutorialNextStep() {
    switch(currITutorialStep) {
    case iTutorialSteps.Start:
        currITutorialStep = iTutorialSteps.GoToCharacterPage;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.GoToCharacterPage:
        currITutorialStep = iTutorialSteps.CharacterPage;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.CharacterPage:
        currITutorialStep = iTutorialSteps.CharacterGoToTerminalPage;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.CharacterGoToTerminalPage:
        currITutorialStep = iTutorialSteps.TerminalIntro;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.TerminalIntro:
        currITutorialStep = iTutorialSteps.TerminalHelp;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.TerminalHelp:
        currITutorialStep = iTutorialSteps.TerminalLs;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.TerminalLs:
        currITutorialStep = iTutorialSteps.TerminalScan;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.TerminalScan:
        currITutorialStep = iTutorialSteps.TerminalConnect;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.TerminalConnect:
        currITutorialStep = iTutorialSteps.TerminalAnalyze;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.TerminalAnalyze:
        currITutorialStep = iTutorialSteps.TerminalNuke;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.TerminalNuke:
        currITutorialStep = iTutorialSteps.TerminalManualHack;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.TerminalManualHack:
        currITutorialStep = iTutorialSteps.TerminalCreateScript;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.TerminalCreateScript:
        currITutorialStep = iTutorialSteps.TerminalTypeScript;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.TerminalTypeScript:
        currITutorialStep = iTutorialSteps.TerminalRunScript;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.TerminalRunScript:
        currITutorialStep = iTutorialSteps.TerminalGoToActiveScriptsPage;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.TerminalGoToActiveScriptsPage:
        currITutorialStep = iTutorialSteps.ActiveScriptsPage;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.ActiveScriptsPage:
        currITutorialStep = iTutorialSteps.ActiveScriptsToTerminal;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.ActiveScriptsToTerminal:
        currITutorialStep = iTutorialSteps.TerminalTailScript;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.TerminalTailScript:
        currITutorialStep = iTutorialSteps.GoToHacknetNodesPage;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.GoToHacknetNodesPage:
        currITutorialStep = iTutorialSteps.HacknetNodesIntroduction;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.HacknetNodesIntroduction:
        currITutorialStep = iTutorialSteps.HacknetNodesPurchase;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.HacknetNodesPurchase:
        currITutorialStep = iTutorialSteps.HacknetNodesGoToWorldPage;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.HacknetNodesGoToWorldPage:
        currITutorialStep = iTutorialSteps.WorldDescription;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.WorldDescription:
        currITutorialStep = iTutorialSteps.WorldGoToTutorialPage;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.WorldGoToTutorialPage:
        currITutorialStep = iTutorialSteps.TutorialPageInfo;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.TutorialPageInfo:
        currITutorialStep = iTutorialSteps.End;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.End:
        break;  
    default:
        throw new Error("Invalid tutorial step");
    }
}

function iTutorialEnd() {
    currITutorialStep = iTutorialSteps.End;
    iTutorialIsRunning = false;
}

function iTutorialSetText(txt) {
    var textBox = document.getElementById("interactive-tutorial-text");
    if (textBox == null) {throw new Error("Could not find text box"); return;}
    textBox.innerHTML = txt;
    
}