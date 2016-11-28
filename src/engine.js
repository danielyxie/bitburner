//Replaces the character at an index with a new character
String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}

var Engine = {
	
    //Clickable objects
    Clickables: {
        hackButton:     null,
        
        //Load, save, and delete
        saveButton:     null,
        loadButton:     null,
        deleteButton:   null,
        
        //Main menu buttons
        terminalMainMenuButton:     null,
        characterMainMenuButton:    null,
		scriptEditorMainMenuButton: null,
    },
    
    //Display objects
    Display: {
        //Progress bar
        progress:       	null,
        
        //Display for status text (such as "Saved" or "Loaded")
        statusText:     	null,
        
        hacking_skill:   	null,
		
        //Main menu content
        terminalContent:    	null,
        characterContent:   	null,
		scriptEditorContent: 	null,
        
        //Character info
        characterInfo:      	null,
		
		//Script editor text
		scriptEditorText: 		null,
    },
	
	//Current page status 
	Page: {
		Terminal: 			"Terminal",
		CharacterInfo: 		"CharacterInfo",
		ScriptEditor: 		"ScriptEditor",
	},
	currentPage:	null,

	
	//Time variables (milliseconds unix epoch time)
	_lastUpdate: new Date().getTime(),
	_idleSpeed: 200,    //Speed (in ms) at which the main loop is updated
    
    //Save function
    saveGame: function() {
        var PlayerSave 			= JSON.stringify(Player);
		var ForeignServersSave 	= JSON.stringify(ForeignServers);
		//TODO Add factions + companies here when they're done
        
        window.localStorage.setItem("netburnerPlayerSave", PlayerSave);
		window.localStorage.setItem("netburnerForeignServersSave", ForeignServersSave)
		console.log("Game saved to local storage");
    },
    
    //Load saved game function
    loadSave: function() {
        //Check to see if file exists
        if (!window.localStorage.getItem("netburnerPlayerSave")) {
			console.log("No Player save to load");
			return false;
        } else if (!window.localStorage.getItem("netburnerForeignServersSave")) {
			console.log("No ForeignServers save to load");
			return false;
		} else {
            var PlayerSave 			= window.localStorage.getItem("netburnerPlayerSave");
			var ForeignServersSave 	= window.localStorage.getItem("netburnerForeignServersSave");
            Player = JSON.parse(PlayerSave);
			ForeignServers = JSON.parse(ForeignServersSave);
			return true;
        }
    },
    
    //Delete saved game function
    deleteSave: function() {
        if (!window.localStorage.getItem("netburnerPlayerSave")) {
            console.log("No Player Save to delete");
			return false;
		} else if (!window.localStorage.getItem("netburnerForeignServersSave")) {
			console.log("No ForeignServers Save to delete");
			return false;
        } else {
            window.localStorage.removeItem("netburnerPlayerSave");
			window.localStorage.removeItem("netburnerForeignServersSave");
			console.log("Deleted saves")
            return true;
        }
    },
    
    /* Load content when a main menu button is clicked */ 
    loadTerminalContent: function() {
        Engine.hideAllContent();
        Engine.Display.terminalContent.style.visibility = "visible";
		Engine.currentPage = Engine.Page.Terminal;
    },
    
    loadCharacterContent: function() {
        Engine.hideAllContent();
        Engine.Display.characterContent.style.visibility = "visible";
        Engine.displayCharacterInfo();
		Engine.currentPage = Engine.Page.CharacterInfo;
    },
	
	loadScriptEditorContent: function(filename = "", code = "") {
		Engine.hideAllContent();
		Engine.Display.scriptEditorContent.style.visibility = "visible";
		if (filename == "") {
			document.getElementById("script-editor-filename").value = "untitled";
		} else {
			document.getElementById("script-editor-filename").value = filename;
		}
		document.getElementById("script-editor-text").value = code;
		Engine.currentPage = Engine.Page.ScriptEditor;
	},
    
    //Helper function that hides all content 
    hideAllContent: function() {
        Engine.Display.terminalContent.style.visibility = "hidden";
        Engine.Display.characterContent.style.visibility = "hidden";
		Engine.Display.scriptEditorContent.style.visibility = "hidden";
    },
    
    /* Display character info */
    displayCharacterInfo: function() {
        Engine.Display.characterInfo.innerHTML = 'Money: $' + Player.money + '<br><br>' +
                                                 'Hacking Level: ' + Player.hacking_skill + '<br><br>' + 
                                                 'Strength: ' + Player.strength + '<br><br>' + 
                                                 'Defense: ' + Player.defense + '<br><br>' + 
                                                 'Dexterity: ' + Player.dexterity + '<br><br>' + 
                                                 'Agility: ' + Player.agility + '<br><br>' +
												 'Charisma: ' + Player.charisma + '<br><br>' +
												 'Servers owned: ' + Player.purchasedServers.length + '<br><br>' +
                                                 'Hacking Experience: ' + Player.hacking_exp + '<br><br>';
    },
	
	/* Main Event Loop */
	_scriptUpdateStatusCounter: 0,
	idleTimer: function() {
		//Get time difference
		var _thisUpdate = new Date().getTime();
		var diff = _thisUpdate - Engine._lastUpdate;
		
        //Divide this by cycle time to determine how many cycles have elapsed since last update
        diff = Math.round(diff / Engine._idleSpeed);
		
		Engine._scriptUpdateStatusCounter += diff;
        
        if (diff > 0) {
            //Update the game engine by the calculated number of cycles
            Engine.updateGame(diff);
            Engine._lastUpdate = _thisUpdate;
        }       
		
		if (Engine._scriptUpdateStatusCounter >= 50) {
			console.log("Updating Script Status");
			Engine._scriptUpdateStatusCounter = 0;
			Engine.updateScriptStatus();
		}
		
		window.requestAnimationFrame(Engine.idleTimer);
	},
    
    //TODO Account for numCycles in Code, hasn't been done yet
    updateGame: function(numCycles = 1) {
        //Manual hack
		if (Player.startAction == true) {
			Engine._totalActionTime = Player.actionTime;
			Engine._actionTimeLeft = Player.actionTime;
			Engine._actionInProgress = true;
			Engine._actionProgressBarCount = 1;
			Engine._actionProgressStr = "[                                                  ]";
			Engine._actionTimeStr = "Time left: ";
			Player.startAction = false;
		}
		
		Engine.updateHackProgress();
    },
	
	/* Calculates the hack progress for a manual (non-scripted) hack and updates the progress bar/time accordingly */
	_totalActionTime: 0,
	_actionTimeLeft: 0,
	_actionTimeStr: "Time left: ",
	_actionProgressStr: "[                                                  ]",
	_actionProgressBarCount: 1,
	_actionInProgress: false,
	updateHackProgress: function() {
		if (Engine._actionInProgress == true) {
			//TODO Do this calculation based on numCycles rather than idle speed
			Engine._actionTimeLeft -= (Engine._idleSpeed/ 1000);	//Substract idle speed (ms)
		
			//Calculate percent filled 
			var percent = Math.round((1 - Engine._actionTimeLeft / Engine._totalActionTime) * 100);
			
			//Update progress bar 
			while (Engine._actionProgressBarCount * 2 <= percent) {
				Engine._actionProgressStr = Engine._actionProgressStr.replaceAt(Engine._actionProgressBarCount, "|");
				Engine._actionProgressBarCount += 1;
			}
			
			//Update hack time remaining
			Engine._actionTimeStr = "Time left: " + Math.max(0, Math.round(Engine._actionTimeLeft)).toString() + "s";
			document.getElementById("hack-progress").innerHTML = Engine._actionTimeStr;
			
			//Dynamically update progress bar
			document.getElementById("hack-progress-bar").innerHTML = Engine._actionProgressStr.replace( / /g, "&nbsp;" );
			
			//Once percent is 100, the hack is completed
			if (percent >= 100) {
				Engine._actionInProgress = false;
				Terminal.finishAction();
			}

		}
	},
	
	/* NetScript Web Worker Stuff */
	_scriptWebWorker: null,
	updateScriptStatus: function() {
		Engine._scriptWebWorker.postMessage(
			{'type': "Status Update", 
			 'buf1': JSON.stringify(ForeignServers), 
			 'buf2': JSON.stringify(Player)}
		)
	},
	
    /* Initialization */
	init: function() {
		//Initialization functions
		if (Engine.loadSave()) {
			console.log("Loaded game from save");
			Companies.init();
			CompanyPositions.init();
		} else {
			//No save found, start new game
			console.log("Initializing new game");
			Player.init();
			ForeignServers.init();
			Companies.init();
			CompanyPositions.init();
		}

		if (window.Worker) {
			Engine._scriptWebWorker = new Worker("netscript/NetscriptWorker.js");
		}
		
        //Load, save, and delete buttons
        //Engine.Clickables.saveButton = document.getElementById("save");
		//Engine.Clickables.saveButton.addEventListener("click", function() {
		//	Engine.saveFile();
		//	return false;
		//});
		
		//Engine.Clickables.loadButton = document.getElementById("load");
		//Engine.Clickables.loadButton.addEventListener("click", function() {
		//	Engine.loadSave();
		//	return false;
		//});
		
		//Engine.Clickables.deleteButton = document.getElementById("delete");
		//Engine.Clickables.deleteButton.addEventListener("click", function() {
		//	Engine.deleteSave();
		//	return false;
		//});
        
        //Main menu buttons and content
        Engine.Clickables.terminalMainMenuButton = document.getElementById("terminal-menu-link");
        Engine.Clickables.terminalMainMenuButton.addEventListener("click", function() {
            Engine.loadTerminalContent();
            return false;
        });
        
        Engine.Clickables.characterMainMenuButton = document.getElementById("character-menu-link");
        Engine.Clickables.characterMainMenuButton.addEventListener("click", function() {
            Engine.loadCharacterContent();
            return false;
        });
		
		Engine.Clickables.scriptEditorMainMenuButton = document.getElementById("create-script-menu-link");
		Engine.Clickables.scriptEditorMainMenuButton.addEventListener("click", function() {
			Engine.loadScriptEditorContent();
			return false;
		});
        
        Engine.Display.terminalContent = document.getElementById("terminal-container");
		Engine.currentPage = Engine.Page.Terminal;
        Engine.Display.characterContent = document.getElementById("character-container");
		Engine.Display.characterContent.style.visibility = "hidden";
		Engine.Display.scriptEditorContent = document.getElementById("script-editor-container");
		Engine.Display.scriptEditorContent.style.visibility = "hidden";
        
        //Character info
        Engine.Display.characterInfo = document.getElementById("character-info");
        //Engine.displayCharacterInfo(); - Don't think I need this
		
		//Script editor 
		Engine.Display.scriptEditorText = document.getElementById("script-editor-text");
        
        //Message at the top of terminal
		postNetburnerText();
        
        //Run main loop
		Engine.idleTimer();
	}
};

window.onload = function() {
	Engine.init();
};


	

		