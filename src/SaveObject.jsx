import { loadAliases, loadGlobalAliases, Aliases, GlobalAliases } from "./Alias";
import { Companies, loadCompanies } from "./Company/Companies";
import { CONSTANTS } from "./Constants";
import { Engine } from "./engine";
import { Factions, loadFactions } from "./Faction/Factions";
import { loadFconf } from "./Fconf/Fconf";
import { FconfSettings } from "./Fconf/FconfSettings";
import { loadAllGangs, AllGangs } from "./Gang/AllGangs";
import { loadMessages, initMessages, Messages } from "./Message/MessageHelpers";
import { Player, loadPlayer } from "./Player";
import { AllServers, loadAllServers } from "./Server/AllServers";
import { Settings } from "./Settings/Settings";
import { loadSpecialServerIps, SpecialServerIps } from "./Server/SpecialServerIps";
import { SourceFileFlags } from "./SourceFile/SourceFileFlags";
import { loadStockMarket, StockMarket } from "./StockMarket/StockMarket";

import { createStatusText } from "./ui/createStatusText";

import { setTimeoutRef } from "./utils/SetTimeoutRef";
import * as ExportBonus from "./ExportBonus";

import { dialogBoxCreate } from "../utils/DialogBox";
import { clearEventListeners } from "../utils/uiHelpers/clearEventListeners";
import { Reviver, Generic_toJSON, Generic_fromJSON } from "../utils/JSONReviver";
import { save } from "./db";

import Decimal from "decimal.js";

/* SaveObject.js
 *  Defines the object used to save/load games
 */
let saveObject = new BitburnerSaveObject();

function BitburnerSaveObject() {
  this.PlayerSave = "";
  this.AllServersSave = "";
  this.CompaniesSave = "";
  this.FactionsSave = "";
  this.SpecialServerIpsSave = "";
  this.AliasesSave = "";
  this.GlobalAliasesSave = "";
  this.MessagesSave = "";
  this.StockMarketSave = "";
  this.SettingsSave = "";
  this.FconfSettingsSave = "";
  this.VersionSave = "";
  this.AllGangsSave = "";
  this.LastExportBonus = "";
}

BitburnerSaveObject.prototype.getSaveString = function () {
  this.PlayerSave = JSON.stringify(Player);

  // Delete all logs from all running scripts
  var TempAllServers = JSON.parse(JSON.stringify(AllServers), Reviver);
  for (var ip in TempAllServers) {
    var server = TempAllServers[ip];
    if (server == null) {
      continue;
    }
    for (var i = 0; i < server.runningScripts.length; ++i) {
      var runningScriptObj = server.runningScripts[i];
      runningScriptObj.logs.length = 0;
      runningScriptObj.logs = [];
    }
  }

  this.AllServersSave = JSON.stringify(TempAllServers);
  this.CompaniesSave = JSON.stringify(Companies);
  this.FactionsSave = JSON.stringify(Factions);
  this.SpecialServerIpsSave = JSON.stringify(SpecialServerIps);
  this.AliasesSave = JSON.stringify(Aliases);
  this.GlobalAliasesSave = JSON.stringify(GlobalAliases);
  this.MessagesSave = JSON.stringify(Messages);
  this.StockMarketSave = JSON.stringify(StockMarket);
  this.SettingsSave = JSON.stringify(Settings);
  this.FconfSettingsSave = JSON.stringify(FconfSettings);
  this.VersionSave = JSON.stringify(CONSTANTS.Version);
  this.LastExportBonus = JSON.stringify(ExportBonus.LastExportBonus);
  if (Player.inGang()) {
    this.AllGangsSave = JSON.stringify(AllGangs);
  }
  var saveString = btoa(unescape(encodeURIComponent(JSON.stringify(this))));

  return saveString;
};

BitburnerSaveObject.prototype.saveGame = function () {
  const saveString = this.getSaveString();

  save(saveString)
    .then(() => createStatusText("Game saved!"))
    .catch((err) => console.error(err));
};

// Makes necessary changes to the loaded/imported data to ensure
// the game stills works with new versions
function evaluateVersionCompatibility(ver) {
  // This version refactored the Company/job-related code
  if (ver <= "0.41.2") {
    // Player's company position is now a string
    if (Player.companyPosition != null && typeof Player.companyPosition !== "string") {
      Player.companyPosition = Player.companyPosition.data.positionName;
      if (Player.companyPosition == null) {
        Player.companyPosition = "";
      }
    }

    // The "companyName" property of all Companies is renamed to "name"
    for (var companyName in Companies) {
      const company = Companies[companyName];
      if ((company.name == null || company.name === 0 || company.name === "") && company.companyName != null) {
        company.name = company.companyName;
      }

      if (company.companyPositions instanceof Array) {
        const pos = {};

        for (let i = 0; i < company.companyPositions.length; ++i) {
          pos[company.companyPositions[i]] = true;
        }
        company.companyPositions = pos;
      }
    }
  }

  // This version allowed players to hold multiple jobs
  if (ver < "0.43.0") {
    if (Player.companyName !== "" && Player.companyPosition != null && Player.companyPosition !== "") {
      Player.jobs[Player.companyName] = Player.companyPosition;
    }

    delete Player.companyPosition;
  }
}

function loadGame(saveString) {
  saveString = decodeURIComponent(escape(atob(saveString)));

  const saveObj = JSON.parse(saveString, Reviver);

  loadPlayer(saveObj.PlayerSave);
  loadAllServers(saveObj.AllServersSave);
  loadCompanies(saveObj.CompaniesSave);
  loadFactions(saveObj.FactionsSave);
  loadSpecialServerIps(saveObj.SpecialServerIpsSave);

  if (saveObj.hasOwnProperty("AliasesSave")) {
    try {
      loadAliases(saveObj.AliasesSave);
    } catch (e) {
      console.warn(`Could not load Aliases from save`);
      loadAliases("");
    }
  } else {
    console.warn(`Save file did not contain an Aliases property`);
    loadAliases("");
  }
  if (saveObj.hasOwnProperty("GlobalAliasesSave")) {
    try {
      loadGlobalAliases(saveObj.GlobalAliasesSave);
    } catch (e) {
      console.warn(`Could not load GlobalAliases from save`);
      loadGlobalAliases("");
    }
  } else {
    console.warn(`Save file did not contain a GlobalAliases property`);
    loadGlobalAliases("");
  }
  if (saveObj.hasOwnProperty("MessagesSave")) {
    try {
      loadMessages(saveObj.MessagesSave);
    } catch (e) {
      console.warn(`Could not load Messages from save`);
      initMessages();
    }
  } else {
    console.warn(`Save file did not contain a Messages property`);
    initMessages();
  }
  if (saveObj.hasOwnProperty("StockMarketSave")) {
    try {
      loadStockMarket(saveObj.StockMarketSave);
    } catch (e) {
      loadStockMarket("");
    }
  } else {
    loadStockMarket("");
  }
  if (saveObj.hasOwnProperty("SettingsSave")) {
    try {
      Settings.load(saveObj.SettingsSave);
    } catch (e) {
      console.error("ERROR: Failed to parse Settings. Re-initing default values");
      Settings.init();
    }
  } else {
    Settings.init();
  }
  if (saveObj.hasOwnProperty("LastExportBonus")) {
    try {
      ExportBonus.setLastExportBonus(JSON.parse(saveObj.LastExportBonus));
    } catch (err) {
      ExportBonus.setLastExportBonus(new Date().getTime());
      console.error("ERROR: Failed to parse last export bonus Settings " + err);
    }
  }
  if (saveObj.hasOwnProperty("VersionSave")) {
    try {
      var ver = JSON.parse(saveObj.VersionSave, Reviver);
      evaluateVersionCompatibility(ver);

      if (window.location.href.toLowerCase().includes("bitburner-beta")) {
        // Beta branch, always show changes
        createBetaUpdateText();
      } else if (ver != CONSTANTS.Version) {
        createNewUpdateText();
      }
    } catch (e) {
      createNewUpdateText();
    }
  } else {
    createNewUpdateText();
  }
  if (Player.inGang() && saveObj.hasOwnProperty("AllGangsSave")) {
    try {
      loadAllGangs(saveObj.AllGangsSave);
    } catch (e) {
      console.error("ERROR: Failed to parse AllGangsSave: " + e);
    }
  }

  return true;
}

BitburnerSaveObject.prototype.exportGame = function () {
  const saveString = this.getSaveString();

  // Save file name is based on current timestamp and BitNode
  const epochTime = Math.round(Date.now() / 1000);
  const bn = Player.bitNodeN;
  const filename = `bitburnerSave_BN${bn}x${SourceFileFlags[bn]}_${epochTime}.json`;
  var file = new Blob([saveString], { type: "text/plain" });
  if (window.navigator.msSaveOrOpenBlob) {
    // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename);
  } else {
    // Others
    var a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeoutRef(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
};

function createNewUpdateText() {
  dialogBoxCreate(
    "New update!<br>" +
      "Please report any bugs/issues through the github repository " +
      "or the Bitburner subreddit (reddit.com/r/bitburner).<br><br>" +
      CONSTANTS.LatestUpdate,
  );
}

function createBetaUpdateText() {
  dialogBoxCreate(
    "You are playing on the beta environment! This branch of the game " +
      "features the latest developments in the game. This version may be unstable.<br>" +
      "Please report any bugs/issues through the github repository (https://github.com/danielyxie/bitburner/issues) " +
      "or the Bitburner subreddit (reddit.com/r/bitburner).<br><br>" +
      CONSTANTS.LatestUpdate,
  );
}

BitburnerSaveObject.prototype.toJSON = function () {
  return Generic_toJSON("BitburnerSaveObject", this);
};

BitburnerSaveObject.fromJSON = function (value) {
  return Generic_fromJSON(BitburnerSaveObject, value.data);
};

Reviver.constructors.BitburnerSaveObject = BitburnerSaveObject;

export { saveObject, loadGame };
