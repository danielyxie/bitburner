import { SxProps } from "@mui/system";
import React from "react";
import { Aliases, GlobalAliases, loadAliases, loadGlobalAliases } from "./Alias";
import { AugmentationNames } from "./Augmentation/data/AugmentationNames";
import { PlayerOwnedAugmentation } from "./Augmentation/PlayerOwnedAugmentation";
import { Companies, loadCompanies } from "./Company/Companies";
import { CONSTANTS } from "./Constants";
import { loadStaneksGift, staneksGift } from "./CotMG/Helper";
import { save } from "./db";
import { pushGameSaved } from "./Electron";
import * as ExportBonus from "./ExportBonus";
import { FactionNames } from "./Faction/data/FactionNames";
import { Faction } from "./Faction/Faction";
import { Factions, loadFactions } from "./Faction/Factions";
import { AllGangs, loadAllGangs } from "./Gang/AllGangs";
import { LocationName } from "./Locations/data/LocationNames";
import { PlayerObject } from "./PersonObjects/Player/PlayerObject";
import { loadPlayer, Player } from "./Player";
import { defaultMonacoTheme } from "./ScriptEditor/ui/themes";
import {
  AddToAllServers,
  createUniqueRandomIp,
  GetAllServers,
  GetServer,
  loadAllServers,
  saveAllServers,
} from "./Server/AllServers";
import { SpecialServers } from "./Server/data/SpecialServers";
import { safetlyCreateUniqueServer } from "./Server/ServerHelpers";
import { Settings } from "./Settings/Settings";
import { loadStockMarket, StockMarket } from "./StockMarket/StockMarket";
import { dialogBoxCreate } from "./ui/React/DialogBox";
import { Reputation } from "./ui/React/Reputation";
import { SnackbarEvents, ToastVariant } from "./ui/React/Snackbar";
import { Generic_fromJSON, Generic_toJSON, Reviver } from "./utils/JSONReviver";
import { v1APIBreak } from "./utils/v1APIBreak";
import { WorkType } from "./Work/WorkType";

/* SaveObject.js
 *  Defines the object used to save/load games
 */

export interface SaveData {
  playerIdentifier: string;
  fileName: string;
  save: string;
  savedOn: number;
}

export interface ImportData {
  base64: string;
  parsed: any;
  playerData?: ImportPlayerData;
}

export interface ImportPlayerData {
  identifier: string;
  lastSave: number;
  totalPlaytime: number;

  money: number;
  hacking: number;

  augmentations: number;
  factions: number;
  achievements: number;

  bitNode: number;
  bitNodeLevel: number;
  sourceFiles: number;
}

class BitburnerSaveObject {
  PlayerSave = "";
  AllServersSave = "";
  CompaniesSave = "";
  FactionsSave = "";
  AliasesSave = "";
  GlobalAliasesSave = "";
  StockMarketSave = "";
  SettingsSave = "";
  VersionSave = "";
  AllGangsSave = "";
  LastExportBonus = "";
  StaneksGiftSave = "";

  getSaveString(excludeRunningScripts = false): string {
    this.PlayerSave = JSON.stringify(Player);

    this.AllServersSave = saveAllServers(excludeRunningScripts);
    this.CompaniesSave = JSON.stringify(Companies);
    this.FactionsSave = JSON.stringify(Factions);
    this.AliasesSave = JSON.stringify(Aliases);
    this.GlobalAliasesSave = JSON.stringify(GlobalAliases);
    this.StockMarketSave = JSON.stringify(StockMarket);
    this.SettingsSave = JSON.stringify(Settings);
    this.VersionSave = JSON.stringify(CONSTANTS.VersionNumber);
    this.LastExportBonus = JSON.stringify(ExportBonus.LastExportBonus);
    this.StaneksGiftSave = JSON.stringify(staneksGift);

    if (Player.inGang()) {
      this.AllGangsSave = JSON.stringify(AllGangs);
    }
    const saveString = btoa(unescape(encodeURIComponent(JSON.stringify(this))));

    return saveString;
  }

  saveGame(emitToastEvent = true): Promise<void> {
    const savedOn = new Date().getTime();
    Player.lastSave = savedOn;
    const saveString = this.getSaveString(Settings.ExcludeRunningScriptsFromSave);
    return new Promise((resolve, reject) => {
      save(saveString)
        .then(() => {
          const saveData: SaveData = {
            playerIdentifier: Player.identifier,
            fileName: this.getSaveFileName(),
            save: saveString,
            savedOn,
          };
          pushGameSaved(saveData);

          if (emitToastEvent) {
            SnackbarEvents.emit("Game Saved!", ToastVariant.INFO, 2000);
          }
          return resolve();
        })
        .catch((err) => {
          console.error(err);
          return reject();
        });
    });
  }

  getSaveFileName(isRecovery = false): string {
    // Save file name is based on current timestamp and BitNode
    const epochTime = Math.round(Date.now() / 1000);
    const bn = Player.bitNodeN;
    let filename = `bitburnerSave_${epochTime}_BN${bn}x${Player.sourceFileLvl(bn) + 1}.json`;
    if (isRecovery) filename = "RECOVERY" + filename;
    return filename;
  }

  exportGame(): void {
    const saveString = this.getSaveString(Settings.ExcludeRunningScriptsFromSave);
    const filename = this.getSaveFileName();
    download(filename, saveString);
  }

  importGame(base64Save: string, reload = true): Promise<void> {
    if (!base64Save || base64Save === "") throw new Error("Invalid import string");
    return save(base64Save).then(() => {
      if (reload) setTimeout(() => location.reload(), 1000);
      return Promise.resolve();
    });
  }

  getImportStringFromFile(files: FileList | null): Promise<string> {
    if (files === null) return Promise.reject(new Error("No file selected"));
    const file = files[0];
    if (!file) return Promise.reject(new Error("Invalid file selected"));

    const reader = new FileReader();
    const promise: Promise<string> = new Promise((resolve, reject) => {
      reader.onload = function (this: FileReader, e: ProgressEvent<FileReader>) {
        const target = e.target;
        if (target === null) {
          return reject(new Error("Error importing file"));
        }
        const result = target.result;
        if (typeof result !== "string") {
          return reject(new Error("FileReader event was not type string"));
        }
        const contents = result;
        resolve(contents);
      };
    });
    reader.readAsText(file);
    return promise;
  }

  async getImportDataFromString(base64Save: string): Promise<ImportData> {
    if (!base64Save || base64Save === "") throw new Error("Invalid import string");

    let newSave;
    try {
      newSave = window.atob(base64Save);
      newSave = newSave.trim();
    } catch (error) {
      console.error(error); // We'll handle below
    }

    if (!newSave || newSave === "") {
      return Promise.reject(new Error("Save game had not content or was not base64 encoded"));
    }

    let parsedSave;
    try {
      parsedSave = JSON.parse(newSave);
    } catch (error) {
      console.log(error); // We'll handle below
    }

    if (!parsedSave || parsedSave.ctor !== "BitburnerSaveObject" || !parsedSave.data) {
      return Promise.reject(new Error("Save game did not seem valid"));
    }

    const data: ImportData = {
      base64: base64Save,
      parsed: parsedSave,
    };

    const importedPlayer = PlayerObject.fromJSON(JSON.parse(parsedSave.data.PlayerSave));

    const playerData: ImportPlayerData = {
      identifier: importedPlayer.identifier,
      lastSave: importedPlayer.lastSave,
      totalPlaytime: importedPlayer.totalPlaytime,

      money: importedPlayer.money,
      hacking: importedPlayer.hacking,

      augmentations: importedPlayer.augmentations?.reduce<number>((total, current) => (total += current.level), 0) ?? 0,
      factions: importedPlayer.factions?.length ?? 0,
      achievements: importedPlayer.achievements?.length ?? 0,

      bitNode: importedPlayer.bitNodeN,
      bitNodeLevel: importedPlayer.sourceFileLvl(Player.bitNodeN) + 1,
      sourceFiles: importedPlayer.sourceFiles?.reduce<number>((total, current) => (total += current.lvl), 0) ?? 0,
    };

    data.playerData = playerData;
    return Promise.resolve(data);
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
function evaluateVersionCompatibility(ver: string | number): void {
  // We have to do this because ts won't let us otherwise
  const anyPlayer = Player as any;
  if (typeof ver === "string") {
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
      for (const companyName of Object.keys(Companies)) {
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
      // convert all Messages to just filename to save space.
      const home = anyPlayer.getHomeComputer();
      for (let i = 0; i < home.messages.length; i++) {
        if (home.messages[i].filename) {
          home.messages[i] = home.messages[i].filename;
        }
      }
    }
    if (ver < "0.58.0") {
      const changes: [RegExp, string][] = [
        [/getStockSymbols/g, "stock.getSymbols"],
        [/getStockPrice/g, "stock.getPrice"],
        [/getStockAskPrice/g, "stock.getAskPrice"],
        [/getStockBidPrice/g, "stock.getBidPrice"],
        [/getStockPosition/g, "stock.getPosition"],
        [/getStockMaxShares/g, "stock.getMaxShares"],
        [/getStockPurchaseCost/g, "stock.getPurchaseCost"],
        [/getStockSaleGain/g, "stock.getSaleGain"],
        [/buyStock/g, "stock.buy"],
        [/sellStock/g, "stock.sell"],
        [/shortStock/g, "stock.short"],
        [/sellShort/g, "stock.sellShort"],
        [/placeOrder/g, "stock.placeOrder"],
        [/cancelOrder/g, "stock.cancelOrder"],
        [/getOrders/g, "stock.getOrders"],
        [/getStockVolatility/g, "stock.getVolatility"],
        [/getStockForecast/g, "stock.getForecast"],
        [/purchase4SMarketData/g, "stock.purchase4SMarketData"],
        [/purchase4SMarketDataTixApi/g, "stock.purchase4SMarketDataTixApi"],
      ];
      function convert(code: string): string {
        for (const change of changes) {
          code = code.replace(change[0], change[1]);
        }
        return code;
      }
      for (const server of GetAllServers()) {
        for (const script of server.scripts) {
          script.code = convert(script.code);
        }
      }
    }
    v1APIBreak();
    ver = 1;
  }
  if (typeof ver === "number") {
    if (ver < 2) {
      // Give 10 neuroflux because v1 API break.
      const nf = Player.augmentations.find((a) => a.name === AugmentationNames.NeuroFluxGovernor);
      if (nf) {
        nf.level += 10;
      } else {
        const nf = new PlayerOwnedAugmentation(AugmentationNames.NeuroFluxGovernor);
        nf.level = 10;
        Player.augmentations.push(nf);
      }
      Player.reapplyAllAugmentations(true);
      Player.reapplyAllSourceFiles();
    }
    if (ver < 3) {
      anyPlayer.money = parseFloat(anyPlayer.money);
      if (anyPlayer.corporation) {
        anyPlayer.corporation.funds = parseFloat(anyPlayer.corporation.funds);
        anyPlayer.corporation.revenue = parseFloat(anyPlayer.corporation.revenue);
        anyPlayer.corporation.expenses = parseFloat(anyPlayer.corporation.expenses);

        for (let i = 0; i < anyPlayer.corporation.divisions.length; ++i) {
          const ind = anyPlayer.corporation.divisions[i];
          ind.lastCycleRevenue = parseFloat(ind.lastCycleRevenue);
          ind.lastCycleExpenses = parseFloat(ind.lastCycleExpenses);
          ind.thisCycleRevenue = parseFloat(ind.thisCycleRevenue);
          ind.thisCycleExpenses = parseFloat(ind.thisCycleExpenses);
        }
      }
    }
    if (ver < 9) {
      if (StockMarket.hasOwnProperty("Joes Guns")) {
        const s = StockMarket["Joes Guns"];
        delete StockMarket["Joes Guns"];
        StockMarket[LocationName.Sector12JoesGuns] = s;
      }
    }
    if (ver < 10) {
      // Augmentation name was changed in 0.56.0 but sleeves aug list was missed.
      if (anyPlayer.sleeves && anyPlayer.sleeves.length > 0) {
        for (const sleeve of anyPlayer.sleeves) {
          if (!sleeve.augmentations || sleeve.augmentations.length === 0) continue;
          for (const augmentation of sleeve.augmentations) {
            if (augmentation.name !== "Graphene BranchiBlades Upgrade") continue;
            augmentation.name = "Graphene BrachiBlades Upgrade";
          }
        }
      }
    }
    if (ver < 12) {
      if (anyPlayer.resleeves !== undefined) {
        delete anyPlayer.resleeves;
      }
    }
    if (ver < 15) {
      (Settings as any).EditorTheme = { ...defaultMonacoTheme };
    }
    //Fix contract names
    if (ver < 16) {
      Factions[FactionNames.ShadowsOfAnarchy] = new Faction(FactionNames.ShadowsOfAnarchy);
      //Iterate over all contracts on all servers
      for (const server of GetAllServers()) {
        for (const contract of server.contracts) {
          //Rename old "HammingCodes: Integer to encoded Binary" contracts
          //to "HammingCodes: Integer to Encoded Binary"
          if (contract.type == "HammingCodes: Integer to encoded Binary") {
            contract.type = "HammingCodes: Integer to Encoded Binary";
          }
        }
      }
    }

    // Fix bugged NFG accumulation in owned augmentations
    if (ver < 17) {
      let ownedNFGs = [...Player.augmentations];
      ownedNFGs = ownedNFGs.filter((aug) => aug.name === AugmentationNames.NeuroFluxGovernor);
      const newNFG = new PlayerOwnedAugmentation(AugmentationNames.NeuroFluxGovernor);
      newNFG.level = 0;

      for (const nfg of ownedNFGs) {
        newNFG.level += nfg.level;
      }

      Player.augmentations = [
        ...Player.augmentations.filter((aug) => aug.name !== AugmentationNames.NeuroFluxGovernor),
        newNFG,
      ];

      Player.reapplyAllAugmentations(true);
      Player.reapplyAllSourceFiles();
    }
    if (ver < 20) {
      // Create the darkweb for everyone but it won't be linked
      const dw = GetServer(SpecialServers.DarkWeb);
      if (!dw) {
        const darkweb = safetlyCreateUniqueServer({
          ip: createUniqueRandomIp(),
          hostname: SpecialServers.DarkWeb,
          organizationName: "",
          isConnectedTo: false,
          adminRights: false,
          purchasedByPlayer: false,
          maxRam: 1,
        });
        AddToAllServers(darkweb);
      }
    }

    // Update player work properties for the rewritten work system
    // Grants some rewards to players who were actively working beforehand:
    // * Rep to anyone doing faction/company work
    // * Finishes graft for free (with no Entropy) for anyone doing grafting
    // * Finishes program for free for anyone creating a program
    // Everyone gets 1 free level of NeuroFlux Governor as well
    if (ver < 21) {
      Player.workManager.reset();

      const gainedRep = anyPlayer.workRepGained;
      const fac = Factions[anyPlayer.currentWorkFactionName];
      const isDoingFacWork = fac && anyPlayer.workType === WorkType.Faction;
      if (isDoingFacWork) {
        fac.playerReputation += gainedRep;
      }

      const company = Companies[anyPlayer.companyName];
      const isDoingCompanyWork = company && anyPlayer.workType.startsWith(WorkType.Company);
      if (isDoingCompanyWork) {
        company.playerReputation += gainedRep;
      }

      if (anyPlayer.graftAugmentationName) {
        Player.augmentations.push(new PlayerOwnedAugmentation(anyPlayer.graftAugmentationName));
      }

      const program = anyPlayer.createProgramName;
      if (program) {
        Player.getHomeComputer().programs.push(program);
      }

      const ownedNFG = Player.augmentations.find((a) => a.name === AugmentationNames.NeuroFluxGovernor);
      if (ownedNFG) {
        ownedNFG.level += 1;
      } else {
        const newNFG = new PlayerOwnedAugmentation(AugmentationNames.NeuroFluxGovernor);
        Player.augmentations.push(newNFG);
      }

      setTimeout(() => {
        dialogBoxCreate(
          <>
            Due to internal changes to the work system, your current work task has been reset.
            <br />
            As compensation, you have been granted the following rewards:
            <ul>
              {anyPlayer.graftAugmentationName && (
                <li>
                  Grafting of <b>{anyPlayer.graftAugmentationName}</b> has been automatically completed,
                  <br /> and applied with no increase to the Entropy virus
                </li>
              )}
              {isDoingFacWork && gainedRep > 0 && (
                <li>
                  <Reputation reputation={anyPlayer.workRepGained} /> reputation for your faction <b>{fac.name}</b>
                </li>
              )}
              {isDoingCompanyWork && gainedRep > 0 && (
                <li>
                  <Reputation reputation={anyPlayer.workRepGained} /> reputation for your company <b>{company.name}</b>
                </li>
              )}
              {program && (
                <li>
                  Your WIP program <b>{program}</b> has been automatically completed
                  <br /> and added to your home computer
                </li>
              )}
              <li>1 free level of NeuroFlux Governor</li>
            </ul>
          </>,
        );

        delete anyPlayer.companyName;
        delete anyPlayer.createProgramReqLvl;
        delete anyPlayer.factionWorkType;
        delete anyPlayer.createProgramName;
        delete anyPlayer.timeWorkedCreateProgram;
        delete anyPlayer.graftAugmentationName;
        delete anyPlayer.timeWorkedGraftAugmentation;
        delete anyPlayer.crimeType;
        delete anyPlayer.committingCrimeThruSingFn;
        delete anyPlayer.singFnCrimeWorkerScript;
        delete anyPlayer.timeNeededToCompleteWork;
        delete anyPlayer.className;
        delete anyPlayer.currentWorkFactionName;
        delete anyPlayer.workType;
        delete anyPlayer.workCostMult;
        delete anyPlayer.workExpMult;
        delete anyPlayer.currentWorkFactionDescription;
        delete anyPlayer.timeWorked;
        delete anyPlayer.workMoneyGained;
        delete anyPlayer.workMoneyGainRate;
        delete anyPlayer.workRepGained;
        delete anyPlayer.workRepGainRate;
        delete anyPlayer.workHackExpGained;
        delete anyPlayer.workHackExpGainRate;
        delete anyPlayer.workStrExpGained;
        delete anyPlayer.workStrExpGainRate;
        delete anyPlayer.workDefExpGained;
        delete anyPlayer.workDefExpGainRate;
        delete anyPlayer.workDexExpGained;
        delete anyPlayer.workDexExpGainRate;
        delete anyPlayer.workAgiExpGained;
        delete anyPlayer.workAgiExpGainRate;
        delete anyPlayer.workChaExpGained;
        delete anyPlayer.workChaExpGainRate;
        delete anyPlayer.workMoneyLossRate;

        Player.reapplyAllAugmentations(true);
        Player.reapplyAllSourceFiles();
      }, 1000);
    }
  }
}

function loadGame(saveString: string): boolean {
  createScamUpdateText();
  if (!saveString) return false;
  saveString = decodeURIComponent(escape(atob(saveString)));

  const saveObj = JSON.parse(saveString, Reviver);

  loadPlayer(saveObj.PlayerSave);
  loadAllServers(saveObj.AllServersSave);
  loadCompanies(saveObj.CompaniesSave);
  loadFactions(saveObj.FactionsSave);

  if (saveObj.hasOwnProperty("StaneksGiftSave")) {
    loadStaneksGift(saveObj.StaneksGiftSave);
  } else {
    console.warn(`Could not load Staneks Gift from save`);
    loadStaneksGift("");
  }
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
      } else if (ver !== CONSTANTS.VersionNumber) {
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

function createScamUpdateText(): void {
  if (navigator.userAgent.indexOf("wv") !== -1 && navigator.userAgent.indexOf("Chrome/") !== -1) {
    setInterval(() => {
      dialogBoxCreate("SCAM ALERT. This app is not official and you should uninstall it.");
    }, 1000);
  }
}

const resets: SxProps = {
  "& h1, & h2, & h3, & h4, & p, & a, & ul": {
    margin: 0,
    color: Settings.theme.primary,
    whiteSpace: "initial",
  },
  "& ul": {
    paddingLeft: "1.5em",
    lineHeight: 1.5,
  },
};

function createNewUpdateText(): void {
  setTimeout(
    () =>
      dialogBoxCreate(
        "New update!<br>" +
          "Please report any bugs/issues through the github repository " +
          "or the Bitburner subreddit (reddit.com/r/bitburner).<br><br>" +
          CONSTANTS.LatestUpdate,
        resets,
      ),
    1000,
  );
}

function createBetaUpdateText(): void {
  dialogBoxCreate(
    "You are playing on the beta environment! This branch of the game " +
      "features the latest developments in the game. This version may be unstable.<br>" +
      "Please report any bugs/issues through the github repository (https://github.com/danielyxie/bitburner/issues) " +
      "or the Bitburner subreddit (reddit.com/r/bitburner).<br><br>" +
      CONSTANTS.LatestUpdate,
    resets,
  );
}

function download(filename: string, content: string): void {
  const file = new Blob([content], { type: "text/plain" });
  const navigator = window.navigator as any;
  if (navigator.msSaveOrOpenBlob) {
    // IE10+
    navigator.msSaveOrOpenBlob(file, filename);
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

Reviver.constructors.BitburnerSaveObject = BitburnerSaveObject;

export { saveObject, loadGame, download };

const saveObject = new BitburnerSaveObject();
