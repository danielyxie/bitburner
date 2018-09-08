import {loadAliases, loadGlobalAliases,
        Aliases, GlobalAliases}                 from "./Alias";
import {loadCompanies, Companies,
        CompanyPositions}                       from "./Company";
import {CONSTANTS}                              from "./Constants";
import {Engine}                                 from "./engine";
import {loadFactions, Factions,
        processPassiveFactionRepGain}           from "./Faction";
import {FconfSettings, loadFconf}               from "./Fconf";
import {loadAllGangs, AllGangs}                 from "./Gang";
import {processAllHacknetNodeEarnings}          from "./HacknetNode";
import {loadMessages, initMessages, Messages}   from "./Message";
import {Player, loadPlayer}                     from "./Player";
import {loadAllRunningScripts}                  from "./Script";
import {AllServers, loadAllServers}             from "./Server";
import {Settings}                               from "./Settings";
import {loadSpecialServerIps, SpecialServerIps} from "./SpecialServerIps";
import {loadStockMarket, StockMarket}           from "./StockMarket";
import {dialogBoxCreate}                        from "../utils/DialogBox";
import {gameOptionsBoxClose}                    from "../utils/GameOptions";
import {clearEventListeners}                    from "../utils/uiHelpers/clearEventListeners";
import {Reviver, Generic_toJSON,
        Generic_fromJSON}                       from "../utils/JSONReviver";
import {createElement}                          from "../utils/uiHelpers/createElement";
import {createPopup}                            from "../utils/uiHelpers/createPopup";
import {createStatusText}                       from "./ui/createStatusText";
import {formatNumber}                           from "../utils/StringHelperFunctions";
import {removeElementById}                      from "../utils/uiHelpers/removeElementById";

import Decimal                                  from "decimal.js";

/* SaveObject.js
 *  Defines the object used to save/load games
 */
let saveObject = new BitburnerSaveObject();

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
    this.FconfSettingsSave          = "";
    this.VersionSave                = "";
    this.AllGangsSave               = "";
}

BitburnerSaveObject.prototype.saveGame = function(db) {
    this.PlayerSave                 = JSON.stringify(Player);

    //Delete all logs from all running scripts
    var TempAllServers = JSON.parse(JSON.stringify(AllServers), Reviver);
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
    this.FconfSettingsSave          = JSON.stringify(FconfSettings);
    this.VersionSave                = JSON.stringify(CONSTANTS.Version);
    if (Player.bitNodeN == 2 && Player.inGang()) {
        this.AllGangsSave           = JSON.stringify(AllGangs);
    }
    var saveString = btoa(unescape(encodeURIComponent(JSON.stringify(this))));

    //We'll save to both localstorage and indexedDb
    var objectStore = db.transaction(["savestring"], "readwrite").objectStore("savestring");
    var request = objectStore.put(saveString, "save");

    request.onerror = function(e) {
        console.log("Error saving game to IndexedDB: " + e);
    }

    request.onsuccess = function(e) {
        //console.log("Saved game to IndexedDB!");
    }

    try {
        window.localStorage.setItem("bitburnerSave", saveString);
        //console.log("Saved game to LocalStorage!");
    } catch(e) {
        if (e.code == 22) {
            createStatusText("Save failed for localStorage! Check console(F12)");
            console.log("Failed to save game to localStorage because the size of the save file " +
                        "is too large. However, the game will still be saved to IndexedDb if your browser " +
                        "supports it. If you would like to save to localStorage as well, then " +
                        "consider killing several of your scripts to " +
                        "fix this, or increasing the size of your browsers localStorage");
        }
    }

    createStatusText("Game saved!");
}

function loadGame(saveString) {
    if (saveString === "" || saveString == null || saveString === undefined) {
        if (!window.localStorage.getItem("bitburnerSave")) {
            console.log("No save file to load");
            return false;
        }
        saveString = decodeURIComponent(escape(atob(window.localStorage.getItem("bitburnerSave"))));
        console.log("Loading game from localStorage");
    } else {
        saveString = decodeURIComponent(escape(atob(saveString)));
        console.log("Loading game from IndexedDB");
    }

    var saveObj = JSON.parse(saveString, Reviver);

    loadPlayer(saveObj.PlayerSave);
    loadAllServers(saveObj.AllServersSave);
    loadCompanies(saveObj.CompaniesSave);
    loadFactions(saveObj.FactionsSave);
    loadSpecialServerIps(saveObj.SpecialServerIpsSave);

    if (saveObj.hasOwnProperty("AliasesSave")) {
        try {
            loadAliases(saveObj.AliasesSave);
        } catch(e) {
            loadAliases("");
        }
    } else {
        loadAliases("");
    }
    if (saveObj.hasOwnProperty("GlobalAliasesSave")) {
        try {
            loadGlobalAliases(saveObj.GlobalAliasesSave);
        } catch(e) {
            loadGlobalAliases("");
        }
    } else {
        loadGlobalAliases("");
    }
    if (saveObj.hasOwnProperty("MessagesSave")) {
        try {
            loadMessages(saveObj.MessagesSave);
        } catch(e) {
            initMessages();
        }
    } else {
        initMessages();
    }
    if (saveObj.hasOwnProperty("StockMarketSave")) {
        try {
            loadStockMarket(saveObj.StockMarketSave);
        } catch(e) {
            loadStockMarket("");
        }
    } else {
        loadStockMarket("");
    }
    if (saveObj.hasOwnProperty("SettingsSave")) {
        try {
            Settings.load(saveObj.SettingsSave);
        } catch(e) {
            console.log("ERROR: Failed to parse Settings. Re-initing default values");
            Settings.init();
        }
    } else {
        Settings.init();
    }
    if (saveObj.hasOwnProperty("FconfSettingsSave")) {
        try {
            loadFconf(saveObj.FconfSettingsSave);
        } catch(e) {
            console.log("ERROR: Failed to parse .fconf Settings.");
        }
    }
    if (saveObj.hasOwnProperty("VersionSave")) {
        try {
            var ver = JSON.parse(saveObj.VersionSave, Reviver);
            if (Player.bitNodeN == null || Player.bitNodeN === 0) {
                Player.setBitNodeNumber(1);
            }
            if (ver.startsWith("0.27.") || ver.startsWith("0.28.")) {
                console.log("Evaluating changes needed for version compatibility");
                if (Player.augmentations.length > 0 || Player.queuedAugmentations.length > 0 ||
                    Player.sourceFiles.length > 0) {
                    //If you have already purchased an Aug...you are far enough in the game
                    //that everything should be available
                    Player.firstFacInvRecvd = true;
                    Player.firstAugPurchased = true;
                    Player.firstJobRecvd = true;
                    Player.firstTimeTraveled = true;
                    Player.firstProgramAvailable = true;
                } else  {
                    if (Player.factions.length > 0 || Player.factionInvitations.length > 0) {
                        Player.firstFacInvRecvd = true;
                    }
                    if (Player.companyName !== "" || Player.companyPosition !== "") {
                        Player.firstJobRecvd = true;
                    }
                    if (Player.hacking_skill >= 25) {
                        Player.firstScriptAvailable = true;
                    }
                }
            }
            if (window.location.href.toLowerCase().includes("bitburner-beta")) {
                //Beta branch, always show changes
                createBetaUpdateText();
            } else if (ver != CONSTANTS.Version) {
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
            loadAllGangs(saveObj.AllGangsSave);
        } catch(e) {
            console.log("ERROR: Failed to parse AllGangsSave: " + e);
        }
    }

    return true;
}

function loadImportedGame(saveObj, saveString) {
    var tempSaveObj = null;
    var tempPlayer = null;
    var tempAllServers = null;
    var tempCompanies = null;
    var tempFactions = null;
    var tempSpecialServerIps = null;
    var tempAliases = null;
    var tempGlobalAliases = null;
    var tempMessages = null;
    var tempStockMarket = null;
    var tempAllGangs = null;

    //Check to see if the imported save file can be parsed. If any
    //errors are caught it will fail
    try {
        var decodedSaveString = decodeURIComponent(escape(atob(saveString)));
        tempSaveObj = new BitburnerSaveObject();
        tempSaveObj = JSON.parse(decodedSaveString, Reviver);

        tempPlayer = JSON.parse(tempSaveObj.PlayerSave, Reviver);

        //Parse Decimal.js objects
        tempPlayer.money = new Decimal(tempPlayer.money);
        tempPlayer.total_money = new Decimal(tempPlayer.total_money);
        tempPlayer.lifetime_money = new Decimal(tempPlayer.lifetime_money);

        tempAllServers          = JSON.parse(tempSaveObj.AllServersSave, Reviver);
        tempCompanies           = JSON.parse(tempSaveObj.CompaniesSave, Reviver);
        tempFactions            = JSON.parse(tempSaveObj.FactionsSave, Reviver);
        tempSpecialServerIps    = JSON.parse(tempSaveObj.SpecialServerIpsSave, Reviver);
        if (tempSaveObj.hasOwnProperty("AliasesSave")) {
            try {
                tempAliases         = JSON.parse(tempSaveObj.AliasesSave, Reviver);
            } catch(e) {
                console.log("Parsing Aliases save failed: " + e);
                tempAliases = {};
            }
        } else {
            tempAliases = {};
        }
        if (tempSaveObj.hasOwnProperty("GlobalAliases")) {
            try {
                tempGlobalAliases   = JSON.parse(tempSaveObj.AliasesSave, Reviver);
            } catch(e) {
                console.log("Parsing Global Aliases save failed: " + e);
                tempGlobalAliases = {};
            }
        } else {
            tempGlobalAliases = {};
        }
        if (tempSaveObj.hasOwnProperty("MessagesSave")) {
            try {
                tempMessages        = JSON.parse(tempSaveObj.MessagesSave, Reviver);
            } catch(e) {
                console.log("Parsing Messages save failed: " + e);
                initMessages();
            }
        } else {
            initMessages();
        }
        if (saveObj.hasOwnProperty("StockMarketSave")) {
            try {
                tempStockMarket     = JSON.parse(tempSaveObj.StockMarketSave, Reviver);
            } catch(e) {
                console.log("Parsing StockMarket save failed: " + e);
                tempStockMarket     = {};
            }
        } else {
            tempStockMarket = {};
        }
        if (tempSaveObj.hasOwnProperty("VersionSave")) {
            try {
                var ver = JSON.parse(tempSaveObj.VersionSave, Reviver);
                if (ver.startsWith("0.27.") || ver.startsWith("0.28.")) {
                    if (tempPlayer.bitNodeN == null || tempPlayer.bitNodeN == 0) {
                        tempPlayer.bitNodeN = 1;
                    }
                    if (tempPlayer.sourceFiles == null) {
                        tempPlayer.sourceFiles = [];
                    }
                }
                if (ver != CONSTANTS.Version) {
                    //createNewUpdateText();
                }
            } catch(e) {
                console.log("Parsing Version save failed: " + e);
                //createNewUpdateText();
            }
        } else {
            //createNewUpdateText();
        }
        if (tempPlayer.bitNodeN == 2 && tempPlayer.inGang() && tempSaveObj.hasOwnProperty("AllGangsSave")) {
            try {
                loadAllGangs(tempSaveObj.AllGangsSave);
            } catch(e) {
                console.log("ERROR: Failed to parse AllGangsSave: " + e);
            }
        }
    } catch(e) {
        dialogBoxCreate("Error importing game: " + e.toString());
        return false;
    }

    //Since the save file is valid, load everything for real
    saveString = decodeURIComponent(escape(atob(saveString)));
    saveObj = JSON.parse(saveString, Reviver);

    loadPlayer(saveObj.PlayerSave);
    loadAllServers(saveObj.AllServersSave);
    loadCompanies(saveObj.CompaniesSave);
    loadFactions(saveObj.FactionsSave);
    loadSpecialServerIps(saveObj.SpecialServerIpsSave);

    if (saveObj.hasOwnProperty("AliasesSave")) {
        try {
            loadAliases(saveObj.AliasesSave);
        } catch(e) {
            loadAliases("");
        }
    } else {
        loadAliases("");
    }
    if (saveObj.hasOwnProperty("GlobalAliasesSave")) {
        try {
            loadGlobalAliases(saveObj.GlobalAliasesSave);
        } catch(e) {
            loadGlobalAliases("");
        }
    } else {
        loadGlobalAliases("");
    }
    if (saveObj.hasOwnProperty("MessagesSave")) {
        try {
            loadMessages(saveObj.MessagesSave);
        } catch(e) {
            initMessages();
        }
    } else {
        initMessages();
    }
    if (saveObj.hasOwnProperty("StockMarketSave")) {
        try {
            loadStockMarket(saveObj.StockMarketSave);
        } catch(e) {
            loadStockMarket("");
        }
    } else {
        loadStockMarket("");
    }
    if (saveObj.hasOwnProperty("SettingsSave")) {
        try {
            Settings.load(saveObj.SettingsSave);
        } catch(e) {
            Settings.init();
        }
    } else {
        Settings.init();
    }
    if (saveObj.hasOwnProperty("FconfSettingsSave")) {
        try {
            loadFconf(saveObj.FconfSettingsSave);
        } catch(e) {
            console.log("ERROR: Failed to load .fconf settings when importing");
        }
    }
    if (saveObj.hasOwnProperty("VersionSave")) {
        try {
            var ver = JSON.parse(saveObj.VersionSave, Reviver);
            if (Player.bitNodeN == null || Player.bitNodeN == 0) {
                Player.setBitNodeNumber(1);

            }
            if (ver.startsWith("0.27.") || ver.startsWith("0.28.")) {
                console.log("Evaluating changes needed for version compatibility");
                if (Player.augmentations.length > 0 || Player.queuedAugmentations.length > 0 ||
                    Player.sourceFiles.length > 0) {
                    //If you have already purchased an Aug...you are far enough in the game
                    //that everything should be available
                    Player.firstFacInvRecvd = true;
                    Player.firstAugPurchased = true;
                    Player.firstJobRecvd = true;
                    Player.firstTimeTraveled = true;
                    Player.firstProgramAvailable = true;
                } else  {
                    if (Player.factions.length > 0 || Player.factionInvitations.length > 0) {
                        Player.firstFacInvRecvd = true;
                    }
                    if (Player.companyName !== "" || Player.companyPosition !== "") {
                        Player.firstJobRecvd = true;
                    }
                    if (Player.hacking_skill >= 25) {
                        Player.firstScriptAvailable = true;
                    }
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
            loadAllGangs(saveObj.AllGangsSave);
        } catch(e) {
            console.log("ERROR: Failed to parse AllGangsSave: " + e);
        }
    }

    var popupId = "import-game-restart-game-notice";
    var txt = createElement("p", {
        innerText:"Imported game! You need to SAVE the game and then RELOAD the page " +
                 "to make sure everything runs smoothly"
    });
    var gotitBtn = createElement("a", {
        class:"a-link-button", float:"right", padding:"6px", innerText:"Got it!",
        clickListener:()=>{
            removeElementById(popupId);
        }
    });
    createPopup(popupId, [txt, gotitBtn]);
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
    if (Player.playtimeSinceLastBitnode == null) {Player.playtimeSinceLastBitnode = 0;}
    Player.totalPlaytime += time;
    Player.playtimeSinceLastAug += time;
    Player.playtimeSinceLastBitnode += time;

    //Re-apply augmentations
    Player.reapplyAllAugmentations();

    //Clear terminal
    $("#terminal tr:not(:last)").remove();

    Player.lastUpdate = Engine._lastUpdate;
    Engine.start();                 //Run main game loop and Scripts loop
    dialogBoxCreate("While you were offline, your scripts generated <span class='money-gold'>$" +
                    formatNumber(offlineProductionFromScripts, 2) + "</span> and your Hacknet Nodes generated <span class='money-gold'>$" +
                    formatNumber(offlineProductionFromHacknetNodes, 2) + "</span>");
    return true;
}

BitburnerSaveObject.prototype.exportGame = function() {
    this.PlayerSave                 = JSON.stringify(Player);
    this.AllServersSave             = JSON.stringify(AllServers);
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
    var filename = "bitburnerSave.json";
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

BitburnerSaveObject.prototype.deleteGame = function(db) {
    //Delete from local storage
    if (window.localStorage.getItem("bitburnerSave")) {
        window.localStorage.removeItem("bitburnerSave");
    }

    //Delete from indexedDB
    var request = db.transaction(["savestring"], "readwrite").objectStore("savestring").delete("save");
    request.onsuccess = function(e) {
        console.log("Successfully deleted save from indexedDb");
    }
    request.onerror = function(e) {
        console.log("Failed to delete save from indexedDb: " + e);
    }
    createStatusText("Game deleted!");
}

function createNewUpdateText() {
    dialogBoxCreate("New update!<br>" +
                    "Please report any bugs/issues through the github repository " +
                    "or the Bitburner subreddit (reddit.com/r/bitburner).<br><br>" +
                    CONSTANTS.LatestUpdate);
}

function createBetaUpdateText() {
    dialogBoxCreate("You are playing on the beta environment! This branch of the game " +
                    "features the latest developments in the game. This version may be unstable.<br>" +
                    "Please report any bugs/issues through the github repository (https://github.com/danielyxie/bitburner/issues) " +
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

export {saveObject, loadGame};
