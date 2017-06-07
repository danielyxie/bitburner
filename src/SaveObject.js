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
                //TODO Create update pop up
            }
        } catch(e) {
            Engine.version  = CONSTANTS.Version;
        }
    } else {
        Engine.version = CONSTANTS.Version;
    }
    
    return true;
}

BitburnerSaveObject.prototype.deleteGame = function() {
    if (window.localStorage.getItem("bitburnerSave")) {
        window.localStorage.removeItem("bitburnerSave");
    }
    Engine.createStatusText("Game deleted!");
}


BitburnerSaveObject.prototype.toJSON = function() {
    return Generic_toJSON("BitburnerSaveObject", this);
}

BitburnerSaveObject.fromJSON = function(value) {
    return Generic_fromJSON(BitburnerSaveObject, value.data);
}

Reviver.constructors.BitburnerSaveObject = BitburnerSaveObject;