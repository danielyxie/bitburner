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
    this.AliasesSave                = "";
    this.GlobalAliasesSave          = "";
    this.MessagesSave               = "";
    this.StockMarketSave            = "";
    this.SettingsSave               = "";
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
    this.AliasesSave                = JSON.stringify(Aliases);
    this.GlobalAliasesSave          = JSON.stringify(GlobalAliases);
    this.MessagesSave               = JSON.stringify(Messages);
    this.StockMarketSave            = JSON.stringify(StockMarket);
    this.SettingsSave               = JSON.stringify(Settings);
    this.VersionSave                = JSON.stringify(CONSTANTS.Version);
    if (Player.bitNodeN == 2 && Player.inGang()) {
        this.AllGangsSave           = JSON.stringify(AllGangs);
    }
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

    //Parse Decimal.js objects
    Player.money = new Decimal(Player.money);
    Player.total_money = new Decimal(Player.total_money);
    Player.lifetime_money = new Decimal(Player.lifetime_money);

    AllServers      = JSON.parse(saveObj.AllServersSave, Reviver);
    Companies       = JSON.parse(saveObj.CompaniesSave, Reviver);
    Factions        = JSON.parse(saveObj.FactionsSave, Reviver);
    SpecialServerIps = JSON.parse(saveObj.SpecialServerIpsSave, Reviver);

    if (saveObj.hasOwnProperty("AliasesSave")) {
        try {
            Aliases         = JSON.parse(saveObj.AliasesSave, Reviver);
        } catch(e) {
            Aliases = {};
        }
    } else {
        Aliases = {};
    }
    if (saveObj.hasOwnProperty("GlobalAliasesSave")) {
        try {
            GlobalAliases   = JSON.parse(saveObj.GlobalAliasesSave, Reviver);
        } catch(e) {
            GlobalAliases = {};
        }
    } else {
        GlobalAliases = {};
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
    if (saveObj.hasOwnProperty("StockMarketSave")) {
        try {
            StockMarket     = JSON.parse(saveObj.StockMarketSave, Reviver);
        } catch(e) {
            StockMarket     = {};
        }
    } else {
        StockMarket = {};
    }
    if (saveObj.hasOwnProperty("SettingsSave")) {
        try {
            Settings    = JSON.parse(saveObj.SettingsSave, Reviver);
        } catch(e) {
            initSettings();
        }
    } else {
        initSettings();
    }
    if (saveObj.hasOwnProperty("VersionSave")) {
        try {
            var ver = JSON.parse(saveObj.VersionSave, Reviver);
            if (ver == "0.27.0" || ver == "0.27.1") {
                if (Player.bitNodeN == null || Player.bitNodeN == 0) {
                    Player.bitNodeN = 1;
                }
                if (Player.sourceFiles == null) {
                    Player.sourceFiles = [];
                }
            }
            if (ver != CONSTANTS.Version) {
                createNewUpdateText();
            }
        } catch(e) {
            createNewUpdateText();
        }
    } else {
        createNewUpdateText();
    }
    if (Player.bitNodeN == 2 && Player.inGang() && saveObj.hasOwnProperty("AllGangsSave")) {
        try {
            AllGangs = JSON.parse(saveObj.AllGangsSave, Reviver);
        } catch(e) {
            console.log("ERROR: Failed to parse AllGangsSave: " + e);
        }
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
    var tempGlobalAliases = null;
    var tempMessages = null;
    var tempStockMarket = null;
    try {
        saveString = decodeURIComponent(escape(atob(saveString)));
        tempSaveObj = new BitburnerSaveObject();
        tempSaveObj = JSON.parse(saveString, Reviver);

        tempPlayer              = JSON.parse(tempSaveObj.PlayerSave, Reviver);

        //Parse Decimal.js objects
        tempPlayer.money = new Decimal(tempPlayer.money);
        tempPlayer.total_money = new Decimal(tempPlayer.total_money);
        tempPlayer.lifetime_money = new Decimal(tempPlayer.lifetime_money);

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
        if (tempSaveObj.hasOwnProperty("GlobalAliases")) {
            try {
                tempGlobalAliases   = JSON.parse(tempSaveObj.AliasesSave, Reviver);
            } catch(e) {
                tempGlobalAliases = {};
            }
        } else {
            tempGlobalAliases = {};
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
        if (saveObj.hasOwnProperty("StockMarketSave")) {
            try {
                tempStockMarket     = JSON.parse(saveObj.StockMarketSave, Reviver);
            } catch(e) {
                tempStockMarket     = {};
            }
        } else {
            tempStockMarket = {};
        }
        if (tempSaveObj.hasOwnProperty("VersionSave")) {
            try {
                var ver = JSON.parse(tempSaveObj.VersionSave, Reviver);
                if (ver == "0.27.0" || ver == "0.27.1") {
                    if (tempPlayer.bitNodeN == null || tempPlayer.bitNodeN == 0) {
                        tempPlayer.bitNodeN = 1;
                    }
                    if (tempPlayer.sourceFiles == null) {
                        tempPlayer.sourceFiles = [];
                    }
                }
                if (ver != CONSTANTS.Version) {
                    createNewUpdateText();
                }
            } catch(e) {
                createNewUpdateText();
            }
        } else {
            createNewUpdateText();
        }
        if (tempPlayer.bitNodeN == 2 && tempPlayer.inGang() && saveObj.hasOwnProperty("AllGangsSave")) {
            try {
                AllGangs = JSON.parse(saveObj.AllGangsSave, Reviver);
            } catch(e) {
                console.log("ERROR: Failed to parse AllGangsSave: " + e);
            }
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

    if (tempGlobalAliases) {
        GlobalAliases             = tempGlobalAliases;
    }

    if (tempMessages) {
        Messages            = tempMessages;
    }

    if (tempStockMarket) {
        StockMarket     = tempStockMarket;
    }

    dialogBoxCreate("Imported game! I would suggest saving the game and then reloading the page " +
                    "to make sure everything runs smoothly");
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
    this.GlobalAliasesSave          = JSON.stringify(GlobalAliases);
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
