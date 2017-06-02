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
    TerminalScanAnalyze1: "Use the scan-analyze command to show hacking related information",
    TerminalScanAnalyze2: "Use the scan-analyze command with a depth of 3",
    TerminalConnect: "Using the telnet/connect command to connect to another server",
    TerminalAnalyze: "Use the analyze command to display details about this server",
    TerminalNuke: "Use the NUKE Program to gain root access to a server", 
    TerminalManualHack: "Use the hack command to manually hack a server",
    TerminalHackingMechanics: "Briefly explain hacking mechanics",
    TerminalCreateScript: "Create a script using nano",
    TerminalTypeScript: "This occurs in the Script Editor page...type the script then save and close",
    TerminalFree: "Use the free command to check RAM",
    TerminalRunScript: "Use the run command to run a script",
    TerminalGoToActiveScriptsPage: "Go to the ActiveScriptsPage",
    ActiveScriptsPage: "Introduction to the Active Scripts Page",
    ActiveScriptsToTerminal: "Go from Active Scripts Page Back to Terminal",
    TerminalTailScript: "Use the tail command to show a script's logs",
    GoToHacknetNodesPage: "Go to the Hacknet Nodes page", 
    HacknetNodesIntroduction: "Introduction to Hacknet Nodesm and have user purchase one",
    HacknetNodesGoToWorldPage: "Go to the world page",
    WorldDescription: "Tell the user to explore..theres a lot of different stuff to do out there",
    TutorialPageInfo: "The tutorial page contains a lot of info on different subjects",
    End: "End",
}

var currITutorialStep = iTutorialSteps.Start;
var iTutorialIsRunning = false;

function iTutorialStart() {
    //Don't autosave during this interactive tutorial
    Engine.Counters.autoSaveCounter = 999000000000;
    console.log("Interactive Tutorial started");
    currITutorialStep = iTutorialSteps.Start;
    iTutorialIsRunning = true;
    
    document.getElementById("interactive-tutorial-container").style.display = "block";
    
    iTutorialEvaluateStep();
    
    //Exit tutorial button
    var exitButton = clearEventListeners("interactive-tutorial-exit");
    exitButton.addEventListener("click", function() {
        iTutorialEnd();
        return false;
    });
    
    //Back button
    var backButton = clearEventListeners("interactive-tutorial-back");
    backButton.style.display = "none";
    backButton.addEventListener("click", function() {
        iTutorialPrevStep();
        return false;
    });
}

function iTutorialEvaluateStep() {
    if (!iTutorialIsRunning) {console.log("Interactive Tutorial not running"); return;}
    switch(currITutorialStep) {
    case iTutorialSteps.Start:
        Engine.loadTerminalContent();
        
        iTutorialSetText("Welcome to Bitburner, a cyberpunk-themed incremental RPG! " +
                         "The game takes place in a dark, dystopian future...The year is 2077...<br><br>" +         
                         "This tutorial will show you the basics of the game to help you get started. " + 
                         "You may skip the tutorial at any time.");
        var next = clearEventListeners("interactive-tutorial-next");
        next.style.display = "inline-block";
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
        
        //Flash Character tab
        document.getElementById("character-menu-link").setAttribute("class", "flashing-button");
        
        //Initialize everything necessary to open the "Character" page
        var charaterMainMenuButton = document.getElementById("character-menu-link");
        charaterMainMenuButton.addEventListener("click", function() {
            Engine.loadCharacterContent();
            iTutorialNextStep(); //Opening the character page will go to the next step
            clearEventListeners("character-menu-link");
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
        
        document.getElementById("terminal-menu-link").setAttribute("class", "flashing-button");
        
        //Initialize everything necessary to open the 'Terminal' Page
        var terminalMainMenuButton = document.getElementById("terminal-menu-link");
        terminalMainMenuButton.addEventListener("click", function() {
            Engine.loadTerminalContent();
            iTutorialNextStep();
            clearEventListeners("terminal-menu-link");
            return false;
        });
        break;
    case iTutorialSteps.TerminalIntro:
        iTutorialSetText("The Terminal is used to interface with your home computer as well as " +
                         "all of the other machines around the world. A lot of content in the game is " + 
                         "accessible only through the Terminal, and is necessary for progressing. ");
        var next = clearEventListeners("interactive-tutorial-next");
        next.style.display = "inline-block";
        next.addEventListener("click", function() {
            iTutorialNextStep();
            return false;
        });
        break;
    case iTutorialSteps.TerminalHelp:
        iTutorialSetText("Let's try it out. Start by entering the 'help' command into the Terminal " + 
                         "(Don't forget to press Enter after typing the command)");
        var next = clearEventListeners("interactive-tutorial-next");
        next.style.display = "none";    
        //next step triggered by terminal command
        break;
    case iTutorialSteps.TerminalLs:
        iTutorialSetText("The 'help' command displays a list of all available commands, how to use them, " + 
                         "and a description of what they do. <br><br>Let's try another command. Enter the 'ls' command");
        //next step triggered by terminal command
        break;
    case iTutorialSteps.TerminalScan:
        iTutorialSetText("'ls' is a basic command that shows all of the contents (programs/scripts) " +
                         "on the computer. Right now, it shows that you have a program called 'NUKE.exe' on your computer. " + 
                         "We'll get to what this does later. <br><br> Through your home computer's terminal, you can connect " + 
                         "to other machines throughout the world. Let's do that now by first entering " + 
                         "the 'scan' command. ");
        //next step triggered by terminal command
        break;
    case iTutorialSteps.TerminalScanAnalyze1:
        iTutorialSetText("The 'scan' command shows all available network connections. In other words, " +
                         "it displays a list of all servers that can be connected to from your " + 
                         "current machine. A server is identified by either its IP or its hostname. <br><br> " +
                         "That's great and all, but there's so many servers. Which one should you go to? " + 
                         "The 'scan-analyze' command gives some more detailed information about servers on the " + 
                         "network. Try it now");
        //next step triggered by terminal command
        break;
    case iTutorialSteps.TerminalScanAnalyze2:
        iTutorialSetText("You just ran 'scan-analyze' with a depth of one. This command shows more detailed " + 
                         "information about each server that you can connect to (servers that are a distance of " + 
                         "one node away). <br><br> It is also possible to run 'scan-analyze' with " +
                         "a higher depth. Let's try a depth of two with the following command: 'scan-analyze 2'.")
        //next step triggered by terminal command
        break;
    case iTutorialSteps.TerminalConnect:
        iTutorialSetText("Now you can see information about all servers that are up to two nodes away, as well " +
                         "as figure out how to navigate to those servers through the network. You can only connect to " +
                         "a server that is one node away. To connect to a machine, use the 'connect [ip/hostname]' command. You can type in " + 
                         "the ip or the hostname, but dont use both.<br><br>" + 
                         "From the results of the 'scan-analyze' command, we can see that the 'foodnstuff' server is " +
                         "only one node away. Let's connect so it now using: 'connect foodnstuff'");
        //next step triggered by terminal command
        break;
    case iTutorialSteps.TerminalAnalyze:
        iTutorialSetText("You are now connected to another machine! What can you do now? You can hack it!<br><br> In the year 2077, currency has " + 
                         "become digital and decentralized. People and corporations store their money " + 
                         "on servers and computers. Using your hacking abilities, you can hack servers " + 
                         "to steal money and gain experience. <br><br> " + 
                         "Before you try to hack a server, you should run diagnostics using the 'analyze' command");
        //next step triggered by terminal command     
        break;
    case iTutorialSteps.TerminalNuke:
        iTutorialSetText("When the 'analyze' command finishes running it will show useful information " + 
                         "about hacking the server. <br><br> For this server, the required hacking skill is only 1, " +
                         "which means you are able to hack it right now. However, in order to hack a server " + 
                         "you must first gain root access. The 'NUKE.exe' program that we saw earlier on your " +
                         "home computer is a virus that will grant you root access to a machine if there are enough " +
                         "open ports.<br><br> The 'analyze' results shows that there do not need to be any open ports " + 
                         "on this machine for the NUKE virus to work, so go ahead and run the virus using the " + 
                         "'run NUKE.exe' command.");
        //next step triggered by terminal command  
        break;
    case iTutorialSteps.TerminalManualHack:
        iTutorialSetText("You now have root access! You can hack the server using the 'hack' command. " + 
                         "Try doing that now. ");
        //next step triggered by terminal command 
        break;
    case iTutorialSteps.TerminalHackingMechanics:
        iTutorialSetText("You are now attempting to hack the server. Note that performing a hack takes time and " + 
                         "only has a certain percentage chance " + 
                         "of success. This time and success chance is determined by a variety of factors, including " + 
                         "your hacking skill and the server's security level. <br><br>" + 
                         "If your attempt to hack the server is successful, you will steal a certain percentage " +
                         "of the server's total money. This percentage is affected by your hacking skill and " +
                         "the server's security level. <br><br> The amount of money on a server is not limitless. So, if " + 
                         "you constantly hack a server and deplete its money, then you will encounter " + 
                         "diminishing returns in your hacking.<br>");
        var next = clearEventListeners("interactive-tutorial-next");
        next.style.display = "inline-block";
        next.addEventListener("click", function() {
            iTutorialNextStep();
            return false;
        });                 
        break;
    case iTutorialSteps.TerminalCreateScript:
        iTutorialSetText("Hacking is the core mechanic of the game and is necessary for progressing. However, " + 
                         "you don't want to be hacking manually the entire time. You can automate your hacking " + 
                         "by writing scripts! <br><br>To create a new script or edit an existing one, you can use the 'nano' " + 
                         "command. Scripts must end with the '.script' extension. Let's make a script now by " +
                         "entering 'nano foodnstuff.script' after the hack command finishes running (Sidenote: Pressing ctrl + c" + 
                         " will end a command like hack early)");
        var next = clearEventListeners("interactive-tutorial-next");
        next.style.display = "none";
        //next step triggered by terminal command 
        break;
    case iTutorialSteps.TerminalTypeScript:
        iTutorialSetText("This is the script editor. You can use it to program your scripts. Scripts are " + 
                         "written in the Netscript language, a programming language created for " + 
                         "this game. <strong style='background-color:#444;'>There are details about the Netscript language in the documentation, which " +
                         "can be accessed in the 'Tutorial' tab on the main navigation menu. I highly suggest you check " + 
                         "it out after this tutorial. </strong> For now, just copy " + 
                         "and paste the following code into the script editor: <br><br>" +
                         "while(true) { <br>" + 
                         "&nbsp;&nbsp;hack('foodnstuff'); <br>" + 
                         "}<br><br> " +
                         "For anyone with basic programming experience, this code should be straightforward. " +
                         "This script will continuously hack the 'foodnstuff' server. <br><br>" + 
                         "To save and close the script editor, press the button in the bottom left, or press ctrl + b.");
        //next step triggered in saveAndCloseScriptEditor() (Script.js)
        break;
    case iTutorialSteps.TerminalFree:
        iTutorialSetText("Now we'll run the script. Scripts require a certain amount of RAM to run, and can be " + 
                         "run on any machine which you have root access to. Different servers have different " + 
                         "amounts of RAM. You can also purchase more RAM for your home server. <br><br> To check how much " +
                         "RAM is available on this machine, enter the 'free' command.");
        //next step triggered by terminal commmand
        break;
    case iTutorialSteps.TerminalRunScript:
        iTutorialSetText("We have 4GB of free RAM on this machine, which is enough to run our " + 
                         "script. Let's run our script using 'run foodnstuff.script'.");
        //next step triggered by terminal commmand
        break;
    case iTutorialSteps.TerminalGoToActiveScriptsPage:
        iTutorialSetText("Your script is now running! The script might take a few seconds to 'fully start up'. " + 
                         "Your scripts will continuously run in the background and will automatically stop if " + 
                         "the code ever completes (the 'foodnstuff.script' will never complete because it " + 
                         "runs an infinite loop). <br><br>These scripts can passively earn you income and hacking experience. " + 
                         "Your scripts will also earn money and experience while you are offline, although at a " +
                         "much slower rate. <br><br> " + 
                         "Let's check out some statistics of our active, running scripts by clicking the " + 
                         "'Active Scripts' link in the main navigation menu. ");
        document.getElementById("active-scripts-menu-link").setAttribute("class", "flashing-button");             
        var activeScriptsMainMenuButton = document.getElementById("active-scripts-menu-link");
        activeScriptsMainMenuButton.addEventListener("click", function() {
            Engine.loadActiveScriptsContent();
            iTutorialNextStep();
            clearEventListeners("active-scripts-menu-link");
            return false;
        });
        break;
    case iTutorialSteps.ActiveScriptsPage:
        iTutorialSetText("This page displays stats/information about all of your scripts that are " +
                         "running across every existing server. You can use this to gauge how well " + 
                         "your scripts are doing. Let's go back to the Terminal now using the 'Terminal'" + 
                         "link.");
        document.getElementById("terminal-menu-link").setAttribute("class", "flashing-button");
        //Initialize everything necessary to open the 'Terminal' Page
        var terminalMainMenuButton = clearEventListeners("terminal-menu-link");
        terminalMainMenuButton.addEventListener("click", function() {
            Engine.loadTerminalContent();
            iTutorialNextStep();
            clearEventListeners("terminal-menu-link");
            return false;
        });
        break;
    case iTutorialSteps.ActiveScriptsToTerminal:
        iTutorialSetText("One last thing about scripts, each active script contains logs that detail " + 
                         "what it's doing. We can check these logs using the 'tail' command. Do that " + 
                         "now for the script we just ran by typing 'tail foodnstuff.script'");
        //next step triggered by terminal command
        break;
    case iTutorialSteps.TerminalTailScript:
        iTutorialSetText("The log for this script won't show much right now (it might show nothing at all) because it " + 
                         "just started running...but check back again in a few minutes! <br><br>" + 
                         "This pretty much covers the basics of hacking. To learn more about writing " + 
                         "scripts using the Netscript language, select the 'Tutorial' link in the " +
                         "main navigation menu to look at the documentation. For now, let's move on " + 
                         "to something else!");
        var next = clearEventListeners("interactive-tutorial-next");
        next.style.display = "inline-block";
        next.addEventListener("click", function() {
            iTutorialNextStep();
            return false;
        });
        break;
    case iTutorialSteps.GoToHacknetNodesPage:
        iTutorialSetText("Hacking is not the only way to earn money. One other way to passively " +
                         "earn money is by purchasing and upgrading Hacknet Nodes. Let's go to " + 
                         "the 'Hacknet Nodes' page through the main navigation menu now.");
        document.getElementById("hacknet-nodes-menu-link").setAttribute("class", "flashing-button");
        var hacknetNodesButton = clearEventListeners("hacknet-nodes-menu-link");
        var next = clearEventListeners("interactive-tutorial-next");
        next.style.display = "none";
        hacknetNodesButton.addEventListener("click", function() {
            Engine.loadHacknetNodesContent();
            iTutorialNextStep();
            clearEventListeners("hacknet-nodes-menu-link");
            return false;
        });
        break;
    case iTutorialSteps.HacknetNodesIntroduction:
        iTutorialSetText("From this page you can purchase new Hacknet Nodes and upgrade your " + 
                         "existing ones. Let's purchase a new one now.");
        //Next step triggered by purchaseHacknet() (HacknetNode.js)
        break;
    case iTutorialSteps.HacknetNodesGoToWorldPage:
        iTutorialSetText("You just purchased a Hacknet Node! This Hacknet Node will passively " + 
                         "earn you money over time, both online and offline. When you get enough " + 
                         " money, you can upgrade " + 
                         "your newly-purchased Hacknet Node below. <br><br>" + 
                         "Let's go to the 'World' page through the main navigation menu.");
        document.getElementById("world-menu-link").setAttribute("class", "flashing-button");
        var worldButton = clearEventListeners("world-menu-link");
        worldButton.addEventListener("click", function() {
            Engine.loadWorldContent();
            iTutorialNextStep();
            clearEventListeners("world-menu-link");
            return false;
        });
        break;
    case iTutorialSteps.WorldDescription:
        iTutorialSetText("This page lists all of the different locations you can currently " +
                         "travel to. Each location has something that you can do. " + 
                         "There's a lot of content out in the world, make sure " +
                         "you explore and discover!<br><br>" + 
                         "Lastly, click on the 'Tutorial' link in the main navigation menu.");
        document.getElementById("tutorial-menu-link").setAttribute("class", "flashing-button");
        var tutorialButton = clearEventListeners("tutorial-menu-link");
        tutorialButton.addEventListener("click", function() {
            Engine.loadTutorialContent();
            iTutorialNextStep();
            clearEventListeners("tutorial-menu-link");
            return false;
        });
        break;

    case iTutorialSteps.TutorialPageInfo:
        iTutorialSetText("This page contains a lot of different documentation about the game's " + 
                         "content and mechanics. <strong style='background-color:#444;'> I know it's a lot, but I highly suggest you read " + 
                         "(or at least skim) through this before you start playing</strong>. That's the end of the tutorial. " + 
                         "Hope you enjoy the game!");
        var next = clearEventListeners("interactive-tutorial-next");
        next.style.display = "inline-block";
        next.innerHTML = "Finish Tutorial";
        
        var backButton = clearEventListeners("interactive-tutorial-back");
        backButton.style.display = "none";
        
        next.addEventListener("click", function() {
            iTutorialNextStep();
            return false;
        });
        break;
    case iTutorialSteps.End:
        iTutorialEnd();
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
        document.getElementById("character-menu-link").removeAttribute("class");
        currITutorialStep = iTutorialSteps.CharacterPage;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.CharacterPage:
        currITutorialStep = iTutorialSteps.CharacterGoToTerminalPage;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.CharacterGoToTerminalPage:
        document.getElementById("terminal-menu-link").removeAttribute("class");
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
        currITutorialStep = iTutorialSteps.TerminalScanAnalyze1;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.TerminalScanAnalyze1:
        currITutorialStep = iTutorialSteps.TerminalScanAnalyze2;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.TerminalScanAnalyze2:
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
        currITutorialStep = iTutorialSteps.TerminalHackingMechanics;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.TerminalHackingMechanics:
        currITutorialStep = iTutorialSteps.TerminalCreateScript;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.TerminalCreateScript:
        currITutorialStep = iTutorialSteps.TerminalTypeScript;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.TerminalTypeScript:
        currITutorialStep = iTutorialSteps.TerminalFree;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.TerminalFree:
        currITutorialStep = iTutorialSteps.TerminalRunScript;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.TerminalRunScript:
        currITutorialStep = iTutorialSteps.TerminalGoToActiveScriptsPage;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.TerminalGoToActiveScriptsPage:
        document.getElementById("active-scripts-menu-link").removeAttribute("class");
        currITutorialStep = iTutorialSteps.ActiveScriptsPage;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.ActiveScriptsPage:
        document.getElementById("terminal-menu-link").removeAttribute("class");
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
        document.getElementById("hacknet-nodes-menu-link").removeAttribute("class");
        currITutorialStep = iTutorialSteps.HacknetNodesIntroduction;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.HacknetNodesIntroduction:
        currITutorialStep = iTutorialSteps.HacknetNodesGoToWorldPage;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.HacknetNodesGoToWorldPage:
        document.getElementById("world-menu-link").removeAttribute("class");
        currITutorialStep = iTutorialSteps.WorldDescription;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.WorldDescription:
        document.getElementById("tutorial-menu-link").removeAttribute("class");
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

//Go to previous step and evaluate
function iTutorialPrevStep() {
    switch(currITutorialStep) {
    case iTutorialSteps.Start:
        currITutorialStep = iTutorialSteps.Start;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.GoToCharacterPage:
        currITutorialStep = iTutorialSteps.Start;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.CharacterPage:
        currITutorialStep = iTutorialSteps.GoToCharacterPage;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.CharacterGoToTerminalPage:
        currITutorialStep = iTutorialSteps.CharacterPage;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.TerminalIntro:
        currITutorialStep = iTutorialSteps.CharacterGoToTerminalPage;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.TerminalHelp:
        currITutorialStep = iTutorialSteps.TerminalIntro;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.TerminalLs:
        currITutorialStep = iTutorialSteps.TerminalHelp;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.TerminalScan:
        currITutorialStep = iTutorialSteps.TerminalLs;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.TerminalConnect:
        currITutorialStep = iTutorialSteps.TerminalScan;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.TerminalAnalyze:
        currITutorialStep = iTutorialSteps.TerminalConnect;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.TerminalNuke:
        currITutorialStep = iTutorialSteps.TerminalAnalyze;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.TerminalManualHack:
        currITutorialStep = iTutorialSteps.TerminalNuke;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.TerminalHackingMechanics:
        currITutorialStep = iTutorialSteps.TerminalManualHack;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.TerminalCreateScript:
        currITutorialStep = iTutorialSteps.TerminalManualHack;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.TerminalTypeScript:
        currITutorialStep = iTutorialSteps.TerminalCreateScript;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.TerminalFree:
        currITutorialStep = iTutorialSteps.TerminalTypeScript;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.TerminalRunScript:
        currITutorialStep = iTutorialSteps.TerminalFree;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.TerminalGoToActiveScriptsPage:
        currITutorialStep = iTutorialSteps.TerminalRunScript;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.ActiveScriptsPage:
        currITutorialStep = iTutorialSteps.TerminalGoToActiveScriptsPage;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.ActiveScriptsToTerminal:
        currITutorialStep = iTutorialSteps.ActiveScriptsPage;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.TerminalTailScript:
        currITutorialStep = iTutorialSteps.ActiveScriptsToTerminal;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.GoToHacknetNodesPage:
        currITutorialStep = iTutorialSteps.TerminalTailScript;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.HacknetNodesIntroduction:
        currITutorialStep = iTutorialSteps.GoToHacknetNodesPage;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.HacknetNodesGoToWorldPage:
        currITutorialStep = iTutorialSteps.HacknetNodesIntroduction;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.WorldDescription:
        currITutorialStep = iTutorialSteps.HacknetNodesGoToWorldPage;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.TutorialPageInfo:
        currITutorialStep = iTutorialSteps.WorldDescription;
        iTutorialEvaluateStep();
        break;
    case iTutorialSteps.End:
        break;  
    default:
        throw new Error("Invalid tutorial step");
    }
}

function iTutorialEnd() {
    //Re-enable auto save
    Engine.Counters.autoSaveCounter = 300;
    console.log("Ending interactive tutorial");
    Engine.init();
    currITutorialStep = iTutorialSteps.End;
    iTutorialIsRunning = false;
    document.getElementById("interactive-tutorial-container").style.display = "none";
}

function iTutorialSetText(txt) {
    var textBox = document.getElementById("interactive-tutorial-text");
    if (textBox == null) {throw new Error("Could not find text box"); return;}
    textBox.innerHTML = txt;
    
}