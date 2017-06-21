/* SaveObject.js 
 *  Defines the object used to save/load games 
 */
var saveObject = new BitburnerSaveObject();

function BitburnerSaveObject() {
    this.PlayerSave                 = "";
    this.AllServersSave             = "";
    this.CompaniesSave              = "";
    this.FactionsSave               = "";
    this.SpecialServerIpsSave       = "";
    this.AugmentationsSave          = "";
    this.AliasesSave                = "";
    this.MessagesSave               = "";
    this.VersionSave                = "";
}

BitburnerSaveObject.prototype.saveGame = function() {
    this.PlayerSave                 = JSON.stringify(Player);
    
    //Delete all logs from all running scripts 
    var TempAllServers = JSON.parse(JSON.stringify(AllServers), Reviver);
    //var TempAllServers = jQuery.extend(true, {}, AllServers);   //Deep copy
    for (var ip in TempAllServers) {
        var server = TempAllServers[ip];
        if (server == null) {continue;}
        for (var i = 0; i < server.runningScripts.length; ++i) {
            var runningScriptObj = server.runningScripts[i];
            runningScriptObj.logs.length = 0;
            runningScriptObj.logs = [];
        }
    }
    
    this.AllServersSave             = JSON.stringify(TempAllServers);
    this.CompaniesSave              = JSON.stringify(Companies);
    this.FactionsSave               = JSON.stringify(Factions);
    this.SpecialServerIpsSave       = JSON.stringify(SpecialServerIps);
    this.AugmentationsSave          = JSON.stringify(Augmentations);
    this.AliasesSave                = JSON.stringify(Aliases);
    this.MessagesSave               = JSON.stringify(Messages);
    this.VersionSave                = JSON.stringify(CONSTANTS.Version);
    
    var saveString = btoa(unescape(encodeURIComponent(JSON.stringify(this))));
    window.localStorage.setItem("bitburnerSave", saveString);
    
    console.log("Game saved!");
    Engine.createStatusText("Game saved!");
}

loadGame = function(saveObj) {
    if (!window.localStorage.getItem("bitburnerSave")) {
        console.log("No save file to load");
        return false;
    }
    var saveString = decodeURIComponent(escape(atob(window.localStorage.getItem("bitburnerSave"))));
    saveObj = JSON.parse(saveString, Reviver);
    
    Player          = JSON.parse(saveObj.PlayerSave, Reviver);
    AllServers      = JSON.parse(saveObj.AllServersSave, Reviver);
    Companies       = JSON.parse(saveObj.CompaniesSave, Reviver);
    Factions        = JSON.parse(saveObj.FactionsSave, Reviver);
    SpecialServerIps = JSON.parse(saveObj.SpecialServerIpsSave, Reviver);
    Augmentations   = JSON.parse(saveObj.AugmentationsSave, Reviver);
    if (saveObj.hasOwnProperty("AliasesSave")) {
        try {
            Aliases         = JSON.parse(saveObj.AliasesSave, Reviver);
        } catch(e) {
            Aliases = {};
        }
    } else {
        Aliases = {};
    }
    if (saveObj.hasOwnProperty("MessagesSave")) {
        try {
            Messages        = JSON.parse(saveObj.MessagesSave, Reviver);
        } catch(e) {
            initMessages();
        }
    } else {
        initMessages();
    }
    if (saveObj.hasOwnProperty("VersionSave")) {
        try {
            var ver = JSON.parse(saveObj.VersionSave, Reviver);
            if (ver != CONSTANTS.Version) {
                if (CONSTANTS.Version == "0.21.0" || CONSTANTS.Version == "0.22.0") {
                    dialogBoxCreate("All scripts automatically killed for the sake of compatibility " +
                                    "with new version. If the game is still broken, try the following: " + 
                                    "Options -> Soft Reset -> Save Game -> Reload page. If that STILL " + 
                                    "doesn't work contact the dev");
                    //This is the big update that might break games. Kill all running scripts
                    for (var ip in AllServers) {
                        if (AllServers.hasOwnProperty(ip)) {
                            AllServers[ip].runningScripts = [];
                            AllServers[ip].runningScripts.length = 0;
                        }
                    }
                }
                createNewUpdateText();
            }
        } catch(e) {
            createNewUpdateText();
        }
    } else {
        createNewUpdateText();
    }
    
    return true;
}

loadImportedGame = function(saveObj, saveString) {
    var tempSaveObj = null;
    var tempPlayer = null;
    var tempAllServers = null;
    var tempCompanies = null;
    var tempFactions = null;
    var tempSpecialServerIps = null;
    var tempAugmentations = null;
    var tempAliases = null;
    var tempMessages = null;
    try {
        saveString = decodeURIComponent(escape(atob(saveString)));
        tempSaveObj = new BitburnerSaveObject();
        tempSaveObj = JSON.parse(saveString, Reviver);
        
        tempPlayer              = JSON.parse(tempSaveObj.PlayerSave, Reviver);
        tempAllServers          = JSON.parse(tempSaveObj.AllServersSave, Reviver);
        tempCompanies           = JSON.parse(tempSaveObj.CompaniesSave, Reviver);
        tempFactions            = JSON.parse(tempSaveObj.FactionsSave, Reviver);
        tempSpecialServerIps    = JSON.parse(tempSaveObj.SpecialServerIpsSave, Reviver);
        tempAugmentations       = JSON.parse(tempSaveObj.AugmentationsSave, Reviver);
        if (tempSaveObj.hasOwnProperty("AliasesSave")) {
            try {
                tempAliases         = JSON.parse(tempSaveObj.AliasesSave, Reviver);
            } catch(e) {
                tempAliases = {};
            }
        } else {
            tempAliases = {};
        }
        if (tempSaveObj.hasOwnProperty("MessagesSave")) {
            try {
                tempMessages        = JSON.parse(tempSaveObj.MessagesSave, Reviver);
            } catch(e) {
                initMessages();
            }
        } else {
            initMessages();
        }
        if (tempSaveObj.hasOwnProperty("VersionSave")) {
            try {
                var ver = JSON.parse(tempSaveObj.VersionSave, Reviver);
                if (ver != CONSTANTS.Version) {
                    createNewUpdateText();
                }
                
                if (ver != CONSTANTS.Version) {
                    if (CONSTANTS.Version == "0.21.0") {
                        console.log("here");
                        //This is the big update that might break games. Kill all running scripts
                        for (var ip in tempAllServers) {
                            if (tempAllServers.hasOwnProperty(ip)) {            
                                tempAllServers[ip].runningScripts = [];
                                tempAllServers[ip].runningScripts.length = 0;
                            }
                        }
                    }
                    createNewUpdateText();
                }
            } catch(e) {
                createNewUpdateText();
            }
        } else {
            createNewUpdateText();
        }
    } catch(e) {
        dialogBoxCreate("Error importing game");
        return false;
    }
    
    saveObj                 = tempSaveObj;
    Player                  = tempPlayer;
    AllServers              = tempAllServers;
    Companies               = tempCompanies;
    Factions                = tempFactions;
    SpecialServerIps        = tempSpecialServerIps;
    Augmentations           = tempAugmentations;
    if (tempAliases) {
        Aliases             = tempAliases;
    }
    
    if (tempMessages) {
        Messages            = tempMessages;
    }
    
    dialogBoxCreate("Imported game");
    gameOptionsBoxClose();
    
    //Re-start game
    console.log("Importing game");
    Engine.setDisplayElements();    //Sets variables for important DOM elements
    Engine.init();                  //Initialize buttons, work, etc.
    CompanyPositions.init();

    //Calculate the number of cycles have elapsed while offline
    Engine._lastUpdate = new Date().getTime();
    var lastUpdate = Player.lastUpdate;
    var numCyclesOffline = Math.floor((Engine._lastUpdate - lastUpdate) / Engine._idleSpeed);
    
    /* Process offline progress */
    var offlineProductionFromScripts = loadAllRunningScripts();    //This also takes care of offline production for those scripts
    if (Player.isWorking) {
        console.log("work() called in load() for " + numCyclesOffline * Engine._idleSpeed + " milliseconds");
        if (Player.workType == CONSTANTS.WorkTypeFaction) {
            Player.workForFaction(numCyclesOffline);
        } else if (Player.workType == CONSTANTS.WorkTypeCreateProgram) {
            Player.createProgramWork(numCyclesOffline);
        } else if (Player.workType == CONSTANTS.WorkTypeStudyClass) {
            Player.takeClass(numCyclesOffline);
        } else if (Player.workType == CONSTANTS.WorkTypeCrime) {
            Player.commitCrime(numCyclesOffline);
        } else if (Player.workType == CONSTANTS.WorkTypeCompanyPartTime) {
            Player.workPartTime(numCyclesOffline);
        } else {
            Player.work(numCyclesOffline);
        }
    }
    
    //Hacknet Nodes offline progress
    var offlineProductionFromHacknetNodes = processAllHacknetNodeEarnings(numCyclesOffline);
    
    //Passive faction rep gain offline
    processPassiveFactionRepGain(numCyclesOffline);
    
    //Update total playtime
    var time = numCyclesOffline * Engine._idleSpeed;
    if (Player.totalPlaytime == null) {Player.totalPlaytime = 0;}
    if (Player.playtimeSinceLastAug == null) {Player.playtimeSinceLastAug = 0;}
    Player.totalPlaytime += time;
    Player.playtimeSinceLastAug += time;
    
    //Re-apply augmentations
    Player.reapplyAllAugmentations();
    
    //Clear terminal
    $("#terminal tr:not(:last)").remove();
    
    Player.lastUpdate = Engine._lastUpdate;
    Engine.start();                 //Run main game loop and Scripts loop
    dialogBoxCreate("While you were offline, your scripts generated $" + 
                    formatNumber(offlineProductionFromScripts, 2) + " and your Hacknet Nodes generated $" + 
                    formatNumber(offlineProductionFromHacknetNodes, 2));
    return true;
}

BitburnerSaveObject.prototype.exportGame = function() {
    this.PlayerSave                 = JSON.stringify(Player);
    this.AllServersSave             = JSON.stringify(AllServers);
    this.CompaniesSave              = JSON.stringify(Companies);
    this.FactionsSave               = JSON.stringify(Factions);
    this.SpecialServerIpsSave       = JSON.stringify(SpecialServerIps);
    this.AugmentationsSave          = JSON.stringify(Augmentations);
    this.AliasesSave                = JSON.stringify(Aliases);
    this.MessagesSave               = JSON.stringify(Messages);
    this.VersionSave                = JSON.stringify(CONSTANTS.Version);
    
    var saveString = btoa(unescape(encodeURIComponent(JSON.stringify(this))));
    
    var file = new Blob([saveString], {type: 'text/plain'});
    if (window.navigator.msSaveOrOpenBlob) {// IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);  
    } else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = "bitburnerSave.json";
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

BitburnerSaveObject.prototype.importGame = function() {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        var fileSelector = clearEventListeners("import-game-file-selector");
        fileSelector.addEventListener("change", openImportFileHandler, false);
        $("#import-game-file-selector").click();
    } else {
        dialogBoxCreate("ERR: Your browser does not support HTML5 File API. Cannot import.");
    }
    
}

BitburnerSaveObject.prototype.deleteGame = function() {
    if (window.localStorage.getItem("bitburnerSave")) {
        window.localStorage.removeItem("bitburnerSave");
    }
    Engine.createStatusText("Game deleted!");
}

createNewUpdateText = function() {
    dialogBoxCreate("New update!<br>" + 
                    "Please report any bugs/issues through the github repository " + 
                    "or the Bitburner subreddit (reddit.com/r/bitburner).<br><br>" + 
                    CONSTANTS.LatestUpdate);
}


BitburnerSaveObject.prototype.toJSON = function() {
    return Generic_toJSON("BitburnerSaveObject", this);
}

BitburnerSaveObject.fromJSON = function(value) {
    return Generic_fromJSON(BitburnerSaveObject, value.data);
}

Reviver.constructors.BitburnerSaveObject = BitburnerSaveObject;

//Import game 

function openImportFileHandler(evt) {
    var file = evt.target.files[0];
    if (!file) {
        dialogBoxCreate("Invalid file selected");
        return;
    }
        
    var reader = new FileReader();
    reader.onload = function(e) {
        var contents = e.target.result;
        loadImportedGame(saveObject, contents);
    };
    reader.readAsText(file);
}