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
    this.AllServersSave             = JSON.stringify(AllServers);
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