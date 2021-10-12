import { loadAliases, loadGlobalAliases, Aliases, GlobalAliases } from "./Alias";
import { Companies, loadCompanies } from "./Company/Companies";
import { CONSTANTS } from "./Constants";
import { Factions, loadFactions } from "./Faction/Factions";
import { loadAllGangs, AllGangs } from "./Gang/AllGangs";
import { loadMessages, initMessages, Messages } from "./Message/MessageHelpers";
import { Player, loadPlayer } from "./Player";
import { saveAllServers, loadAllServers } from "./Server/AllServers";
import { Settings } from "./Settings/Settings";
import { SourceFileFlags } from "./SourceFile/SourceFileFlags";
import { loadStockMarket, StockMarket } from "./StockMarket/StockMarket";

import { GameSavedEvents } from "./ui/React/Snackbar";

import * as ExportBonus from "./ExportBonus";

import { dialogBoxCreate } from "./ui/React/DialogBox";
import { Reviver, Generic_toJSON, Generic_fromJSON } from "./utils/JSONReviver";
import { save } from "./db";

/* SaveObject.js
 *  Defines the object used to save/load games
 */

class BitburnerSaveObject {
  PlayerSave = "";
  AllServersSave = "";
  CompaniesSave = "";
  FactionsSave = "";
  AliasesSave = "";
  GlobalAliasesSave = "";
  MessagesSave = "";
  StockMarketSave = "";
  SettingsSave = "";
  VersionSave = "";
  AllGangsSave = "";
  LastExportBonus = "";

  getSaveString(): string {
    this.PlayerSave = JSON.stringify(Player);

    this.AllServersSave = saveAllServers();
    this.CompaniesSave = JSON.stringify(Companies);
    this.FactionsSave = JSON.stringify(Factions);
    this.AliasesSave = JSON.stringify(Aliases);
    this.GlobalAliasesSave = JSON.stringify(GlobalAliases);
    this.MessagesSave = JSON.stringify(Messages);
    this.StockMarketSave = JSON.stringify(StockMarket);
    this.SettingsSave = JSON.stringify(Settings);
    this.VersionSave = JSON.stringify(CONSTANTS.Version);
    this.LastExportBonus = JSON.stringify(ExportBonus.LastExportBonus);
    if (Player.inGang()) {
      this.AllGangsSave = JSON.stringify(AllGangs);
    }
    const saveString = btoa(unescape(encodeURIComponent(JSON.stringify(this))));

    return saveString;
  }

  saveGame(): void {
    const saveString = this.getSaveString();

    save(saveString)
      .then(() => GameSavedEvents.emit())
      .catch((err) => console.error(err));
  }

  exportGame(): void {
    const saveString = this.getSaveString();

    // Save file name is based on current timestamp and BitNode
    const epochTime = Math.round(Date.now() / 1000);
    const bn = Player.bitNodeN;
    const filename = `bitburnerSave_BN${bn}x${SourceFileFlags[bn]}_${epochTime}.json`;
    const file = new Blob([saveString], { type: "text/plain" });
    if (window.navigator.msSaveOrOpenBlob) {
      // IE10+
      window.navigator.msSaveOrOpenBlob(file, filename);
    } else {
      // Others
      const a = document.createElement("a"),
        url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
    }
  }

  toJSON(): any {
    return Generic_toJSON("BitburnerSaveObject", this);
  }

  static fromJSON(value: { data: any }): BitburnerSaveObject {
    return Generic_fromJSON(BitburnerSaveObject, value.data);
  }
}

// Makes necessary changes to the loaded/imported data to ensure
// the game stills works with new versions
function evaluateVersionCompatibility(ver: string): void {
  // We have to do this because ts won't let us otherwise
  const anyPlayer = Player as any;
  // This version refactored the Company/job-related code
  if (ver <= "0.41.2") {
    // Player's company position is now a string
    if (anyPlayer.companyPosition != null && typeof anyPlayer.companyPosition !== "string") {
      anyPlayer.companyPosition = anyPlayer.companyPosition.data.positionName;
      if (anyPlayer.companyPosition == null) {
        anyPlayer.companyPosition = "";
      }
    }

    // The "companyName" property of all Companies is renamed to "name"
    for (const companyName in Companies) {
      const company: any = Companies[companyName];
      if (company.name == 0 && company.companyName != null) {
        company.name = company.companyName;
      }

      if (company.companyPositions instanceof Array) {
        const pos: any = {};

        for (let i = 0; i < company.companyPositions.length; ++i) {
          pos[company.companyPositions[i]] = true;
        }
        company.companyPositions = pos;
      }
    }
  }

  // This version allowed players to hold multiple jobs
  if (ver < "0.43.0") {
    if (anyPlayer.companyName !== "" && anyPlayer.companyPosition != null && anyPlayer.companyPosition !== "") {
      anyPlayer.jobs[anyPlayer.companyName] = anyPlayer.companyPosition;
    }

    delete anyPlayer.companyPosition;
  }
  if (ver < "0.56.0") {
    for (const q of anyPlayer.queuedAugmentations) {
      if (q.name === "Graphene BranchiBlades Upgrade") {
        q.name = "Graphene BrachiBlades Upgrade";
      }
    }
    for (const q of anyPlayer.augmentations) {
      if (q.name === "Graphene BranchiBlades Upgrade") {
        q.name = "Graphene BrachiBlades Upgrade";
      }
    }
  }
  if (ver < "0.56.1") {
    if (anyPlayer.bladeburner === 0) {
      anyPlayer.bladeburner = null;
    }
    if (anyPlayer.gang === 0) {
      anyPlayer.gang = null;
    }
    if (anyPlayer.corporation === 0) {
      anyPlayer.corporation = null;
    }
  }
}

function loadGame(saveString: string): boolean {
  if (!saveString) return false;
  saveString = decodeURIComponent(escape(atob(saveString)));

  const saveObj = JSON.parse(saveString, Reviver);

  loadPlayer(saveObj.PlayerSave);
  loadAllServers(saveObj.AllServersSave);
  loadCompanies(saveObj.CompaniesSave);
  loadFactions(saveObj.FactionsSave);

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
  if (Player.inGang() && saveObj.hasOwnProperty("AllGangsSave")) {
    try {
      loadAllGangs(saveObj.AllGangsSave);
    } catch (e) {
      console.error("ERROR: Failed to parse AllGangsSave: " + e);
    }
  }
  if (saveObj.hasOwnProperty("VersionSave")) {
    try {
      const ver = JSON.parse(saveObj.VersionSave, Reviver);
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

  return true;
}

function createNewUpdateText(): void {
  dialogBoxCreate(
    "New update!<br>" +
      "Please report any bugs/issues through the github repository " +
      "or the Bitburner subreddit (reddit.com/r/bitburner).<br><br>" +
      CONSTANTS.LatestUpdate,
  );
}

function createBetaUpdateText(): void {
  dialogBoxCreate(
    "You are playing on the beta environment! This branch of the game " +
      "features the latest developments in the game. This version may be unstable.<br>" +
      "Please report any bugs/issues through the github repository (https://github.com/danielyxie/bitburner/issues) " +
      "or the Bitburner subreddit (reddit.com/r/bitburner).<br><br>" +
      CONSTANTS.LatestUpdate,
  );
}

Reviver.constructors.BitburnerSaveObject = BitburnerSaveObject;

export { saveObject, loadGame };

const saveObject = new BitburnerSaveObject();
