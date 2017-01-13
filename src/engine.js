var Engine = {
	
    //Clickable objects
    Clickables: {        
        //Main menu buttons
        terminalMainMenuButton:     	null,
        characterMainMenuButton:    	null,
		scriptEditorMainMenuButton: 	null,
		activeScriptsMainMenuButton: 	null,
		worldMainMenuButton: 			null,
		createProgramMainMenuButton: 	null,
		factionsMainMenuButton: 		null,
		augmentationsMainMenuButton: 	null,
		tutorialMainMenuButton: 		null,
        saveMainMenuButton:         	null,
        deleteMainMenuButton:       	null,
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
		activeScriptsContent: 	null,
		worldContent: 			null,
		createProgramContent: 	null,
		factionsContent: 		null,
		augmentationsContent: 	null,
		tutorialContent: 		null,
        
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
		ActiveScripts: 		"ActiveScripts",
		World: 				"World",
		CreateProgram: 		"CreateProgram",
		Factions: 			"Factions",
		Augmentations: 		"Augmentations",
		Tutorial: 			"Tutorial",
	},
	currentPage:	null,

	
	//Time variables (milliseconds unix epoch time)
	_lastUpdate: new Date().getTime(),
	_idleSpeed: 200,    //Speed (in ms) at which the main loop is updated
    
    //Save function
    saveGame: function() {
        var PlayerSave 			= JSON.stringify(Player);
        var AllServersSave      = JSON.stringify(AllServers);
		var CompaniesSave 		= JSON.stringify(Companies);
		var FactionsSave 		= JSON.stringify(Factions);
		//TODO Add factions + companies here when they're done
        
        window.localStorage.setItem("netburnerPlayerSave", PlayerSave);
        window.localStorage.setItem("netburnerAllServersSave", AllServersSave);
		window.localStorage.setItem("netburnerCompaniesSave", CompaniesSave);
		window.localStorage.setItem("netburnerFactionsSave", FactionsSave);
		console.log("Game saved to local storage");
    },
    
    //Load saved game function
    loadSave: function() {
        //Check to see if file exists
        if (!window.localStorage.getItem("netburnerPlayerSave")) {
			console.log("No Player save to load");
			return false;
        } else if (!window.localStorage.getItem("netburnerAllServersSave")) {
            console.log("No AllServers save to load");
            return false;
		} else if (!window.localStorage.getItem("netburnerCompaniesSave")) {
			console.log("No Companies save to load");
			return false;
		} else if (!window.localStorage.getItem("netburnerFactionsSave")) {
			console.log("No Factions save to load");
			return false;
		} else {
            var PlayerSave 			= window.localStorage.getItem("netburnerPlayerSave");
            var AllServersSave      = window.localStorage.getItem("netburnerAllServersSave");
			var CompaniesSave 		= window.localStorage.getItem("netburnerCompaniesSave");
			var FactionsSave 		= window.localStorage.getItem("netburnerFactionsSave");
            Player = JSON.parse(PlayerSave, Reviver);
            AllServers = JSON.parse(AllServersSave, Reviver);
			Companies = JSON.parse(CompaniesSave, Reviver);
			Factions = JSON.parse(FactionsSave, Reviver);
			return true;
        }
    },
    
    //Delete saved game function
    deleteSave: function() {
		//TODO if a save doesn't exist..maybe I shouldn't return? I just keep going
		//or else nothing gets deleted. TODO Fix this
        if (!window.localStorage.getItem("netburnerPlayerSave")) {
            console.log("No Player Save to delete");
			return false;
        } else if (!window.localStorage.getItem("netburnerAllServersSave")) {
            console.log("No AllServers Save to delete");
			return false;
		} else if (!window.localStorage.getItem("netburnerCompaniesSave")) {
			console.log("No Companies Save to delete");
			return false;
		} else if (!window.localStorage.getItem("netburnerFactionsSave")) {
			console.log("No Factions Save to delete");
			return false;
        } else {
            window.localStorage.removeItem("netburnerPlayerSave");
            window.localStorage.removeItem("netburnerAllServersSave");
			window.localStorage.removeItem("netburnerCompaniesSave");
			window.localStorage.removeItem("netburnerFactionsSave");
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
	
	loadActiveScriptsContent: function() {
		Engine.hideAllContent();
		Engine.Display.activeScriptsContent.style.visibility = "visible";
		
		Engine.currentPage = Engine.Page.ActiveScripts;
	},
	
	loadWorldContent: function() {
		Engine.hideAllContent();
		Engine.Display.worldContent.style.visibility = "visible";
		Engine.displayWorldInfo();
		
		Engine.currentPage = Engine.Page.World;
	}
	
	loadCreateProgramContent: function() {
		Engine.hideAllContent();
		Engine.Display.createProgramContent.style.visibility = "visible";
		
		Engine.currentPage = Engine.Page.CreateProgram;
	}
	
	loadFactionsContent: function() {
		Engine.hideAllContent();
		Engine.Display.factionsContent.style.visibility = "visible";
		
		Engine.currentPage = Engine.Page.Factions;
	}
	
	loadAugmentationsContent: function() {
		Engine.hideAllContent();
		Engine.Display.augmentationsContent.style.visibility = "visible";
		
		Engine.currentPage = Engine.Page.Augmentations;
	}
	
	loadTutorialContent: function() {
		Engine.hideAllContent();
		Engine.Display.tutorialContent.style.visibility = "visible";
		
		Engine.currentPage = Engine.Page.Tutorial;
	}
    
    //Helper function that hides all content 
    hideAllContent: function() {
        Engine.Display.terminalContent.style.visibility = "hidden";
        Engine.Display.characterContent.style.visibility = "hidden";
		Engine.Display.scriptEditorContent.style.visibility = "hidden";
		Engine.Display.activeScriptsContent.style.visibility = "hidden";
		Engine.Display.worldContent.style.visiblity = "hidden";
		Engine.Display.createProgramContent.style.visibility = "hidden";
		Engine.Display.factionsContent.style.visibility = "hidden";
		Engine.Display.augmentationsContent.style.visibility = "hidden";
		Engine.Display.tutorialContent.style.visibility = "hidden";
    },
    
    /* Display character info */
    displayCharacterInfo: function() {
        Engine.Display.characterInfo.innerHTML = 'Money: $' + Player.money.toFixed(2) + '<br><br>' +
                                                 'Hacking Level: ' + Player.hacking_skill + '<br><br>' + 
                                                 'Strength: ' + Player.strength + '<br><br>' + 
                                                 'Defense: ' + Player.defense + '<br><br>' + 
                                                 'Dexterity: ' + Player.dexterity + '<br><br>' + 
                                                 'Agility: ' + Player.agility + '<br><br>' +
												 'Charisma: ' + Player.charisma + '<br><br>' +
												 'Servers owned: ' + Player.purchasedServers.length + '<br><br>' +
                                                 'Hacking Experience: ' + Player.hacking_exp.toFixed(4) + '<br><br>';
    },
	
	/* Display locations in the world*/
	aevumLocationsList: 		null,
	chongqingLocationsList: 	null,
	sector12LocationsList: 		null, 
	newTokyoLocationsList: 		null,
	ishimaLocationsList: 		null,
	volhavenLocationsList: 		null,
	
	displayWorldInfo: function() {
		Engine.aevumLocationsList.style.display = "none";
		Engine.chongqingLocationsList.style.display = "none";
		Engine.sector12LocationsList.style.display = "none";
		Engine.newTokyoLocationsList.style.display = "none";
		Engine.ishimaLocationsList.style.display = "none";
		Engine.volhavenLocationsList.style.display = "none";
		
		switch(Player.city) {
			case CONSTANTS.Aevum:
				Engine.aevumLocationsList.style.display = "inline";
				break;
			case CONSTANTS.ChongQing:
				Engine.chongqingLocationsList.style.display = "inline";
				break;
			case CONSTANTS.Sector12:
				Engine.sector12LocationsList.style.display = "inline";
				break;
			case CONSTANTS.NewTokyo:
				Engine.newTokyoLocationsList.style.display = "inline";
				break;
			case CONSTANTS.Ishima:
				Engine.ishimaLocationsList.style.display = "inline";
				break;
			case CONSTANTS.Volhaven:
				Engine.volhavenLocationsList.style.display = "inline";
				break;
			default:
				console.log("Invalid city value in Player object!");
				break;
		}
	}
	
	/* Functions used to update information on the Active Scripts page */
	ActiveScriptsList: 			null,
	
	//Creates and adds the <li> object for a given workerScript
	addActiveScriptsItem: function(workerscript) {
		var item = document.createElement("li");
		
		Engine.createActiveScriptsText(workerscript, item);
		
		//Add the li element onto the list
		if (Engine.ActiveScriptsList == null) {
			Engine.ActiveScriptsList = document.getElementById("active-scripts-list");
		}
		Engine.ActiveScriptsList.appendChild(item);
	},
	
	deleteActiveScriptsItem: function(i) {
		var list = Engine.ActiveScriptsList.querySelectorAll('#active-scripts-list li');
		if (i >= list.length) {
			throw new Error("Trying to delete an out-of-range Active Scripts item");
		}
		
		var li = list[i];
		li.parentNode.removeChild(li);
	},
	
	//Update the ActiveScriptsItems array
	updateActiveScriptsItems: function() {
		for (var i = 0; i < workerScripts.length; ++i) {
			Engine.updateActiveScriptsItemContent(i, workerScripts[i]);
		}
	},
	
	//Updates the content of the given item in the Active Scripts list
	updateActiveScriptsItemContent: function(i, workerscript) {
		var list = Engine.ActiveScriptsList.getElementsByTagName("li");
		if (i >= list.length) {
			throw new Error("Trying to update an out-of-range Active Scripts Item");
		}
		
		var item = list[i];
		
		//Clear the item
		while (item.firstChild) {
			item.removeChild(item.firstChild);
		}
		
		//Add the updated text back
		Engine.createActiveScriptsText(workerscript, item);
	},
	
	createActiveScriptsText(workerscript, item) {
		//Script name
		var scriptName = document.createElement("h2");
		scriptName.appendChild(document.createTextNode(workerscript.name));
		item.appendChild(scriptName);
		
		var itemText = document.createElement("p");
		
		//Server ip/hostname
		var hostname = workerscript.getServer().hostname;
		var serverIpHostname = "Server: " + hostname + "(" + workerscript.serverIp + ")";
		
		//Online
		var onlineMps = workerscript.scriptRef.onlineMoneyMade / workerscript.scriptRef.onlineRunningTime;
		var onlineMpsText = "Online production: $" + onlineMps.toFixed(2) + "/second";
		var onlineEps = workerscript.scriptRef.onlineExpGained / workerscript.scriptRef.onlineRunningTime;
		var onlineEpsText = (Array(20).join(" ") + onlineEps.toFixed(4) + " exp/second").replace( / /g, "&nbsp;");
		
		//Offline
		var offlineMps = workerscript.scriptRef.offlineMoneyMade / workerscript.scriptRef.offlineRunningTime;
		var offlineMpsText = "Offline production: $" + offlineMps.toFixed(2) + "/second";
		var offlineEps = workerscript.scriptRef.offlineExpGained / workerscript.scriptRef.offlineRunningTime;
		var offlineEpsText = (Array(21).join(" ") + offlineEps.toFixed(4) +  " exp/second").replace( / /g, "&nbsp;");
		
		itemText.innerHTML = serverIpHostname + "<br>" + onlineMpsText + "<br>" + onlineEpsText + "<br>" +
							offlineMpsText + "<br>" + offlineEpsText + "<br>";
		
		item.appendChild(itemText);
	},
	
	/* Main Event Loop */
	idleTimer: function() {
		//Get time difference
		var _thisUpdate = new Date().getTime();
		var diff = _thisUpdate - Engine._lastUpdate;
        var offset = diff % Engine._idleSpeed;
		
        //Divide this by cycle time to determine how many cycles have elapsed since last update
        diff = Math.floor(diff / Engine._idleSpeed);
		        
        if (diff > 0) {
            //Update the game engine by the calculated number of cycles
            Engine.updateGame(diff);
            Engine._lastUpdate = _thisUpdate - offset;
			Player.lastUpdate = _thisUpdate - offset;
        }       
		
		window.requestAnimationFrame(Engine.idleTimer);
	},
    
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
		
		//Counters
		Engine.decrementAllCounters(numCycles);
        Engine.checkCounters();		
		
		//Manual hacks
		if (Engine._actionInProgress == true) {
			Engine.updateHackProgress(numCycles);
		}
		
		//Update the running time of all active scripts
		updateOnlineScriptTimes(numCycles);
    },
	
    //Counters for the main event loop. Represent the number of game cycles are required
    //for something to happen. 
    Counters: {
        autoSaveCounter:    300,			//Autosave every minute
		updateSkillLevelsCounter: 10,		//Only update skill levels every 2 seconds. Might improve performance
		updateDisplays: 10,					//Update displays such as Active Scripts display and character display
		serverGrowth: 450,					//Process server growth every minute and a half
    },
    
    decrementAllCounters: function(numCycles = 1) {
        for (var counter in Engine.Counters) {
            if (Engine.Counters.hasOwnProperty(counter)) {
                Engine.Counters[counter] = Engine.Counters[counter] - numCycles;
            }
        }
    },
    
    //Checks if any counters are 0 and if they are, executes whatever
    //is necessary and then resets the counter
    checkCounters: function() {
        if (Engine.Counters.autoSaveCounter <= 0) {
            Engine.saveGame();
            Engine.Counters.autoSaveCounter = 300;
        }
		
		if (Engine.Counters.updateSkillLevelsCounter <= 0) {
			Player.updateSkillLevels();
			Engine.Counters.updateSkillLevelsCounter = 10;
		}
		
		if (Engine.Counters.updateDisplays <= 0) {
			if (Engine.currentPage == Engine.Page.ActiveScripts) {
				Engine.updateActiveScriptsItems();
			} else if (Engine.currentPage == Engine.Page.CharacterInfo) {
				Engine.displayCharacterInfo();
			} 
			
			Engine.Counters.updateDisplays = 10;
		}
		
		if (Engine.Counters.serverGrowth <= 0) {
			var numCycles = Math.floor((450 - Engine.Counters.serverGrowth));
			processServerGrowth(numCycles);
			Engine.Counters.serverGrowth = 450;
		}
    },
    
	/* Calculates the hack progress for a manual (non-scripted) hack and updates the progress bar/time accordingly */
	_totalActionTime: 0,
	_actionTimeLeft: 0,
	_actionTimeStr: "Time left: ",
	_actionProgressStr: "[                                                  ]",
	_actionProgressBarCount: 1,
	_actionInProgress: false,
	updateHackProgress: function(numCycles = 1) {
		var timeElapsedMilli = numCycles * Engine._idleSpeed;
		Engine._actionTimeLeft -= (timeElapsedMilli/ 1000);	//Substract idle speed (ms)
	
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
	},
	
    /* Initialization */
	init: function() {
		//Initialization functions
		if (Engine.loadSave()) {
			console.log("Loaded game from save");
			CompanyPositions.init();
			
			//Calculate the number of cycles have elapsed while offline
			var thisUpdate = new Date().getTime();
			var lastUpdate = Player.lastUpdate;
			var numCyclesOffline = Math.floor((thisUpdate - lastUpdate) / Engine._idleSpeed);
			
			processServerGrowth(numCyclesOffline);	//Should be done before offline production for scripts
			loadAllRunningScripts();	//This also takes care of offline production for those scripts
		} else {
			//No save found, start new game
			console.log("Initializing new game");
			Player.init();
			initForeignServers();
			CompanyPositions.init();
			initCompanies();
			initFactions();
		}
                
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
		
		Engine.Clickables.activeScriptsMainMenuButton = document.getElementById("active-scripts-menu-link");
        Engine.Clickables.activeScriptsMainMenuButton.addEventListener("click", function() {
			Engine.loadActiveScriptsContent();
			return false;
		});
		
		Engine.Clickables.worldMainMenuButton = document.getElementById("world-menu-link");
		Engine.Clickables.worldMainMenuButton.addEventListener("click", function() {
			Engine.loadWorldContent();
			return false;
		});
		
		Engine.Clickables.createProgramMainMenuButton = document.getElementById("create-program-menu-link");
		Engine.Clickables.createProgramMainMenuButton.addEventListener("click", function() {
			Engine.loadCreateProgramContent();
			return false;
		});
		
		Engine.Clickables.factionsMainMenuButton = document.getElementById("factions-menu-link");
		Engine.Clickables.factionsMainMenuButton.addEventListener("click", function() {
			Engine.loadFactionsContent();
			return false;
		});
		
		Engine.Clickables.augmentationsMainMenuButton = document.getElementById("augmentations-menu-link");
		Engine.Clickables.augmentationsMainMenuButton.addEventListener("click", function() {
			Engine.loadAugmentationsContent();
			return false;
		});
		
		Engine.Clickables.tutorialMainMenuButton = document.getElementById("tutorial-menu-link");
		Engine.Clickables.tutorialMainMenuButton.addEventListener("click", function() {
			Engine.loadTutorialContent();
			return false;
		}
		
		//Active scripts list
		Engine.ActiveScriptsList = document.getElementById("active-scripts-list");
		
        Engine.Clickables.saveMainMenuButton = document.getElementById("save-game-link");
        Engine.Clickables.saveMainMenuButton.addEventListener("click", function() {
            Engine.saveGame();
            return false;           
        });
        
        Engine.Clickables.deleteMainMenuButton = document.getElementById("delete-game-link");
        Engine.Clickables.deleteMainMenuButton.addEventListener("click", function() {
            Engine.deleteSave();
            return false;
        });
        
        Engine.Display.terminalContent = document.getElementById("terminal-container");
		Engine.currentPage = Engine.Page.Terminal;
		
        Engine.Display.characterContent = document.getElementById("character-container");
		Engine.Display.characterContent.style.visibility = "hidden";
		
		Engine.Display.scriptEditorContent = document.getElementById("script-editor-container");
		Engine.Display.scriptEditorContent.style.visibility = "hidden";
		
		Engine.Display.activeScriptsContent = document.getElementById("active-scripts-container");
		Engine.Display.activeScriptsContent.style.visibility = "hidden";
		
		Engine.Display.worldContent = document.getElementById("world-container");
		Engine.Display.worldContent.style.visibility = "hidden";
		
		Engine.Display.createProgramContent = document.getElementById("create-program-container");
		Engine.Display.createProgramContent.style.visibility = "hidden";
		
		Engine.Display.factionsContent = document.getElementById("factions-container");
		Engine.Display.factionsContent.style.visibility = "hidden";
		
		Engine.Display.augmentationsContent = document.getElementById("augmentations-container");
		Engine.Display.augmentationsContent.style.visiblity = "hidden";
		
		Engine.Display.tutorialContent = document.getElementById("tutorial-container");
		Engine.Display.tutorialContent.style.visiblity = "hidden";
        
        //Character info
        Engine.Display.characterInfo = document.getElementById("character-info");
		
		//Location lists
		Engine.aevumLocationsList = document.getElementById("aevum-locations-list");
		Engine.chongqingLocationsList = document.getElementById("chongqing-locations-list");
		Engine.sector12LocationsList = document.getElementById("sector12-locations-list");
		Engine.newTokyoLocationsList = document.getElementById("newtokyo-locations-list");
		Engine.ishimaLocationsList = document.getElementById("ishima-locations-list");
		Engine.volhavenLocationsList = document.getElementById("volhaven-locations-list");
		//Script editor 
		Engine.Display.scriptEditorText = document.getElementById("script-editor-text");
        
        //Message at the top of terminal
		postNetburnerText();
        
        //Run main loop
		Engine.idleTimer();
		
		runScriptsLoop();
	}
};

window.onload = function() {
	Engine.init();
};


	

		