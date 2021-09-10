/**
 * Game engine. Handles the main game loop as well as the main UI pages
 *
 * TODO: Separate UI functionality into its own component
 */
import { convertTimeMsToTimeElapsedString, replaceAt } from "../utils/StringHelperFunctions";
import { Augmentations } from "./Augmentation/Augmentations";
import {
  initAugmentations,
  displayAugmentationsContent,
  installAugmentations,
} from "./Augmentation/AugmentationHelpers";
import { onExport } from "./ExportBonus";
import { AugmentationsRoot } from "./Augmentation/ui/Root";
import { AugmentationNames } from "./Augmentation/data/AugmentationNames";
import { initBitNodeMultipliers } from "./BitNode/BitNode";
import { Bladeburner } from "./Bladeburner/Bladeburner";
import { CharacterOverviewComponent } from "./ui/React/CharacterOverview";
import { cinematicTextFlag } from "./CinematicText";
import { generateRandomContract } from "./CodingContractGenerator";
import { initCompanies } from "./Company/Companies";
import { Corporation } from "./Corporation/Corporation";
import { CONSTANTS } from "./Constants";
import { DevMenuRoot } from "./DevMenu";
import { Factions, initFactions } from "./Faction/Factions";
import { processPassiveFactionRepGain, inviteToFaction } from "./Faction/FactionHelpers";
import { FactionList } from "./Faction/ui/FactionList";
import { Root as BladeburnerRoot } from "./Bladeburner/ui/Root";
import { Root as GangRoot } from "./Gang/ui/Root";
import { CorporationRoot } from "./Corporation/ui/CorporationRoot";
import { ResleeveRoot } from "./PersonObjects/Resleeving/ui/ResleeveRoot";
import { SleeveRoot } from "./PersonObjects/Sleeve/ui/SleeveRoot";
import { displayInfiltrationContent } from "./Infiltration/Helper";
import {
  getHackingWorkRepGain,
  getFactionSecurityWorkRepGain,
  getFactionFieldWorkRepGain,
} from "./PersonObjects/formulas/reputation";
import { FconfSettings } from "./Fconf/FconfSettings";
import { hasHacknetServers, processHacknetEarnings } from "./Hacknet/HacknetHelpers";
import { HacknetRoot } from "./Hacknet/ui/HacknetRoot";
import { iTutorialStart } from "./InteractiveTutorial";
import { LocationName } from "./Locations/data/LocationNames";
import { LocationRoot } from "./Locations/ui/Root";
import { checkForMessagesToSend, initMessages } from "./Message/MessageHelpers";
import { inMission, currMission } from "./Missions";
import { workerScripts } from "./Netscript/WorkerScripts";
import { loadAllRunningScripts, updateOnlineScriptTimes } from "./NetscriptWorker";
import { Player } from "./Player";
import { prestigeAugmentation } from "./Prestige";
import { getNumAvailableCreateProgram } from "./Programs/ProgramHelpers";
import { ProgramsRoot } from "./Programs/ui/ProgramsRoot";
import { redPillFlag } from "./RedPill";
import { saveObject, loadGame } from "./SaveObject";
import { Root as ScriptEditorRoot } from "./ScriptEditor/ui/Root";
import { initForeignServers, AllServers } from "./Server/AllServers";
import { Settings } from "./Settings/Settings";
import { updateSourceFileFlags } from "./SourceFile/SourceFileFlags";
import { initSpecialServerIps } from "./Server/SpecialServerIps";
import { initSymbolToStockMap, processStockPrices, displayStockMarketContent } from "./StockMarket/StockMarket";
import { MilestonesRoot } from "./Milestones/ui/MilestonesRoot";
import { Terminal, postVersion } from "./Terminal";
import { TutorialRoot } from "./Tutorial/ui/TutorialRoot";
import { Sleeve } from "./PersonObjects/Sleeve/Sleeve";

import { createStatusText } from "./ui/createStatusText";
import { CharacterInfo } from "./ui/CharacterInfo";
import { Page, routing } from "./ui/navigationTracking";
import { setSettingsLabels } from "./ui/setSettingsLabels";
import { Money } from "./ui/React/Money";
import { Hashes } from "./ui/React/Hashes";
import { Reputation } from "./ui/React/Reputation";

import { ActiveScriptsRoot } from "./ui/ActiveScripts/Root";
import { initializeMainMenuHeaders } from "./ui/MainMenu/Headers";
import { initializeMainMenuLinks, MainMenuLinks } from "./ui/MainMenu/Links";

import { FileDiagnosticPopup } from "./Diagnostic/FileDiagnosticPopup";
import { createPopup } from "./ui/React/createPopup";

import { dialogBoxCreate } from "../utils/DialogBox";
import { gameOptionsBoxClose, gameOptionsBoxOpen } from "../utils/GameOptions";
import { exceptionAlert } from "../utils/helpers/exceptionAlert";
import { removeLoadingScreen } from "../utils/uiHelpers/removeLoadingScreen";
import { KEY } from "../utils/helpers/keyCodes";
import "./Exploits/tampering";
import "./Exploits/unclickable";

import React from "react";
import ReactDOM from "react-dom";

/**
 * Shortcuts to navigate through the game
 *  Alt-t - Terminal
 *  Alt-c - Character
 *  Alt-e - Script editor
 *  Alt-s - Active scripts
 *  Alt-h - Hacknet Nodes
 *  Alt-w - City
 *  Alt-j - Job
 *  Alt-r - Travel Agency of current city
 *  Alt-p - Create program
 *  Alt-f - Factions
 *  Alt-a - Augmentations
 *  Alt-u - Tutorial
 *  Alt-o - Options
 */
$(document).keydown(function (e) {
  if (Settings.DisableHotkeys === true) {
    return;
  }

  if (!Player.isWorking && !redPillFlag && !inMission && !cinematicTextFlag) {
    if (e.keyCode == KEY.T && e.altKey) {
      e.preventDefault();
      Engine.loadTerminalContent();
    } else if (e.keyCode === KEY.C && e.altKey) {
      e.preventDefault();
      Engine.loadCharacterContent();
    } else if (e.keyCode === KEY.E && e.altKey) {
      e.preventDefault();
      Engine.loadScriptEditorContent();
    } else if (e.keyCode === KEY.S && e.altKey) {
      e.preventDefault();
      Engine.loadActiveScriptsContent();
    } else if (e.keyCode === KEY.H && e.altKey) {
      e.preventDefault();
      Engine.loadHacknetNodesContent();
    } else if (e.keyCode === KEY.W && e.altKey) {
      e.preventDefault();
      Engine.loadLocationContent();
    } else if (e.keyCode === KEY.J && e.altKey) {
      e.preventDefault();
      Engine.loadJobContent();
    } else if (e.keyCode === KEY.R && e.altKey) {
      e.preventDefault();
      Engine.loadTravelContent();
    } else if (e.keyCode === KEY.P && e.altKey) {
      e.preventDefault();
      Engine.loadCreateProgramContent();
    } else if (e.keyCode === KEY.F && e.altKey) {
      // Overriden by Fconf
      if (routing.isOn(Page.Terminal) && FconfSettings.ENABLE_BASH_HOTKEYS) {
        return;
      }
      e.preventDefault();
      Engine.loadFactionsContent();
    } else if (e.keyCode === KEY.A && e.altKey) {
      e.preventDefault();
      Engine.loadAugmentationsContent();
    } else if (e.keyCode === KEY.U && e.altKey) {
      e.preventDefault();
      Engine.loadTutorialContent();
    } else if (e.keyCode === KEY.B && e.altKey) {
      e.preventDefault();
      Engine.loadBladeburnerContent();
    } else if (e.keyCode === KEY.G && e.altKey) {
      e.preventDefault();
      Engine.loadGangContent();
    }
  }

  if (e.keyCode === KEY.O && e.altKey) {
    e.preventDefault();
    gameOptionsBoxOpen();
  }
});

const Engine = {
  // Clickable objects
  Clickables: {
    // Main menu buttons
    saveMainMenuButton: null,
    deleteMainMenuButton: null,
  },

  // Display objects
  // TODO-Refactor this into its own component
  Display: {
    // Main menu content
    terminalContent: null,
    characterContent: null,
    scriptEditorContent: null,
    activeScriptsContent: null,
    hacknetNodesContent: null,
    createProgramContent: null,
    factionsContent: null,
    factionContent: null,
    augmentationsContent: null,
    milestonesContent: null,
    devMenuContent: null,
    tutorialContent: null,
    infiltrationContent: null,
    stockMarketContent: null,
    gangContent: null,
    bladeburnerContent: null,
    resleeveContent: null,
    sleeveContent: null,
    corporationContent: null,
    locationContent: null,
    workInProgressContent: null,
    redPillContent: null,
    cinematicTextContent: null,
    missionContent: null,
  },

  indexedDb: undefined,

  // Time variables (milliseconds unix epoch time)
  _lastUpdate: new Date().getTime(),
  _idleSpeed: 200, // Speed (in ms) at which the main loop is updated

  loadTerminalContent: function () {
    Engine.hideAllContent();
    Engine.Display.terminalContent.style.display = "block";
    routing.navigateTo(Page.Terminal);
    MainMenuLinks.Terminal.classList.add("active");
  },

  loadCharacterContent: function () {
    Engine.hideAllContent();
    Engine.Display.characterContent.style.display = "block";
    routing.navigateTo(Page.CharacterInfo);
    ReactDOM.render(<CharacterInfo player={Player} />, Engine.Display.characterContent);
    MainMenuLinks.Stats.classList.add("active");
  },

  loadScriptEditorContent: function (filename = "", code = "") {
    Engine.hideAllContent();
    Engine.Display.scriptEditorContent.style.display = "block";
    routing.navigateTo(Page.ScriptEditor);
    MainMenuLinks.ScriptEditor.classList.add("active");
    ReactDOM.render(
      <ScriptEditorRoot filename={filename} code={code} player={Player} engine={this} />,
      Engine.Display.scriptEditorContent,
    );
  },

  loadActiveScriptsContent: function () {
    Engine.hideAllContent();
    Engine.Display.activeScriptsContent.style.display = "block";
    routing.navigateTo(Page.ActiveScripts);
    MainMenuLinks.ActiveScripts.classList.add("active");
    ReactDOM.render(
      <ActiveScriptsRoot p={Player} workerScripts={workerScripts} />,
      Engine.Display.activeScriptsContent,
    );
  },

  loadHacknetNodesContent: function () {
    Engine.hideAllContent();
    Engine.Display.hacknetNodesContent.style.display = "block";
    routing.navigateTo(Page.HacknetNodes);
    MainMenuLinks.HacknetNodes.classList.add("active");
    ReactDOM.render(<HacknetRoot player={Player} />, Engine.Display.hacknetNodesContent);
  },

  loadCreateProgramContent: function () {
    Engine.hideAllContent();
    Engine.Display.createProgramContent.style.display = "block";
    routing.navigateTo(Page.CreateProgram);
    MainMenuLinks.CreateProgram.classList.add("active");
    ReactDOM.render(<ProgramsRoot player={Player} />, Engine.Display.createProgramContent);
  },

  loadFactionsContent: function () {
    Engine.hideAllContent();
    Engine.Display.factionsContent.style.display = "block";
    routing.navigateTo(Page.Factions);
    MainMenuLinks.Factions.classList.add("active");
    ReactDOM.render(<FactionList player={Player} engine={this} />, Engine.Display.factionsContent);
  },

  // TODO reactify
  loadFactionContent: function () {
    Engine.hideAllContent();
    Engine.Display.factionContent.style.display = "block";
    routing.navigateTo(Page.Faction);
  },

  loadAugmentationsContent: function () {
    Engine.hideAllContent();
    Engine.Display.augmentationsContent.style.display = "block";
    routing.navigateTo(Page.Augmentations);
    MainMenuLinks.Augmentations.classList.add("active");

    function backup() {
      saveObject.exportGame();
      onExport(Player);
    }

    ReactDOM.render(
      <AugmentationsRoot exportGameFn={backup} installAugmentationsFn={installAugmentations} />,
      Engine.Display.augmentationsContent,
    );
  },

  loadMilestonesContent: function () {
    Engine.hideAllContent();
    Engine.Display.milestonesContent.style.display = "block";
    routing.navigateTo(Page.Milestones);
    MainMenuLinks.Milestones.classList.add("active");
    ReactDOM.render(<MilestonesRoot player={Player} />, Engine.Display.milestonesContent);
  },

  loadTutorialContent: function () {
    Engine.hideAllContent();
    Engine.Display.tutorialContent.style.display = "block";
    routing.navigateTo(Page.Tutorial);
    MainMenuLinks.Tutorial.classList.add("active");
    ReactDOM.render(<TutorialRoot />, Engine.Display.tutorialContent);
  },

  // TODO reactify
  loadDevMenuContent: function () {
    Engine.hideAllContent();
    if (process.env.NODE_ENV !== "development") {
      throw new Error("Cannot create Dev Menu because you are not in a dev build");
    }
    Engine.Display.devMenuContent.style.display = "block";
    ReactDOM.render(<DevMenuRoot player={Player} engine={this} />, Engine.Display.devMenuContent);
    routing.navigateTo(Page.DevMenu);
    MainMenuLinks.DevMenu.classList.add("active");
  },

  loadLocationContent: function (initiallyInCity = true) {
    Engine.hideAllContent();
    Engine.Display.locationContent.style.display = "block";
    routing.navigateTo(Page.Location);
    MainMenuLinks.City.classList.add("active");
    ReactDOM.render(
      <LocationRoot initiallyInCity={initiallyInCity} engine={Engine} p={Player} />,
      Engine.Display.locationContent,
    );
  },

  loadTravelContent: function () {
    // Same as loadLocationContent() except first set the location to the travel agency,
    // and make sure that the 'City' main menu link doesnt become 'active'
    Engine.hideAllContent();
    Player.gotoLocation(LocationName.TravelAgency);
    Engine.Display.locationContent.style.display = "block";
    routing.navigateTo(Page.Location);
    MainMenuLinks.Travel.classList.add("active");
    ReactDOM.render(
      <LocationRoot initiallyInCity={false} engine={Engine} p={Player} />,
      Engine.Display.locationContent,
    );
  },

  loadJobContent: function () {
    // Same as loadLocationContent(), except first set the location to the job.
    // Make sure that the 'City' main menu link doesnt become 'active'
    if (Player.companyName == "") {
      dialogBoxCreate(
        "You do not currently have a job! You can visit various companies " + "in the city and try to find a job.",
      );
      return;
    }
    Engine.hideAllContent();
    Player.gotoLocation(Player.companyName);
    Engine.Display.locationContent.style.display = "block";
    routing.navigateTo(Page.Location);
    MainMenuLinks.Job.classList.add("active");
    ReactDOM.render(
      <LocationRoot initiallyInCity={false} engine={Engine} p={Player} />,
      Engine.Display.locationContent,
    );
  },

  // TODO reactify
  loadWorkInProgressContent: function () {
    Engine.hideAllContent();
    const mainMenu = document.getElementById("mainmenu-container");
    mainMenu.style.visibility = "hidden";
    Engine.Display.workInProgressContent.style.display = "block";
    routing.navigateTo(Page.WorkInProgress);
  },

  // TODO reactify
  loadRedPillContent: function () {
    Engine.hideAllContent();
    const mainMenu = document.getElementById("mainmenu-container");
    mainMenu.style.visibility = "hidden";
    Engine.Display.redPillContent.style.display = "block";
    routing.navigateTo(Page.RedPill);
  },

  // TODO reactify
  loadCinematicTextContent: function () {
    Engine.hideAllContent();
    var mainMenu = document.getElementById("mainmenu-container");
    mainMenu.style.visibility = "hidden";
    Engine.Display.cinematicTextContent.style.display = "block";
    routing.navigateTo(Page.CinematicText);
  },

  // TODO reactify
  loadInfiltrationContent: function (name, difficulty, maxLevel) {
    Engine.hideAllContent();
    const mainMenu = document.getElementById("mainmenu-container");
    mainMenu.style.visibility = "hidden";
    Engine.Display.infiltrationContent.style.display = "block";
    routing.navigateTo(Page.Infiltration);
    displayInfiltrationContent(this, Player, name, difficulty, maxLevel);
  },

  loadStockMarketContent: function () {
    Engine.hideAllContent();
    Engine.Display.stockMarketContent.style.display = "block";
    routing.navigateTo(Page.StockMarket);
    MainMenuLinks.StockMarket.classList.add("active");
    displayStockMarketContent();
  },

  loadGangContent: function () {
    if (!Player.inGang()) return;
    Engine.hideAllContent();
    Engine.Display.gangContent.style.display = "block";
    routing.navigateTo(Page.Gang);
    MainMenuLinks.Gang.classList.add("active");
    ReactDOM.render(<GangRoot engine={this} gang={Player.gang} player={Player} />, Engine.Display.gangContent);
  },

  loadMissionContent: function () {
    Engine.hideAllContent();
    document.getElementById("mainmenu-container").style.visibility = "hidden";
    document.getElementById("character-overview-wrapper").style.visibility = "hidden";
    Engine.Display.missionContent.style.display = "block";
    routing.navigateTo(Page.Mission);
  },

  loadCorporationContent: function () {
    if (!(Player.corporation instanceof Corporation)) return;
    Engine.hideAllContent();
    Engine.Display.corporationContent.style.display = "block";
    routing.navigateTo(Page.Corporation);
    MainMenuLinks.Corporation.classList.add("active");
    ReactDOM.render(<CorporationRoot corp={Player.corporation} player={Player} />, Engine.Display.corporationContent);
  },

  loadBladeburnerContent: function () {
    if (!(Player.bladeburner instanceof Bladeburner)) return;
    Engine.hideAllContent();
    Engine.Display.bladeburnerContent.style.display = "block";
    routing.navigateTo(Page.Bladeburner);
    MainMenuLinks.Bladeburner.classList.add("active");
    ReactDOM.render(
      <BladeburnerRoot bladeburner={Player.bladeburner} player={Player} engine={this} />,
      Engine.Display.bladeburnerContent,
    );
  },

  loadSleevesContent: function () {
    Engine.hideAllContent();
    Engine.Display.sleevesContent.style.display = "block";
    routing.navigateTo(Page.Sleeves);
    ReactDOM.render(<SleeveRoot player={Player} />, Engine.Display.sleevesContent);
  },

  loadResleevingContent: function () {
    Engine.hideAllContent();
    routing.navigateTo(Page.Resleeves);
    Engine.Display.resleeveContent.style.display = "block";
    MainMenuLinks.City.classList.add("active");
    ReactDOM.render(<ResleeveRoot player={Player} />, Engine.Display.resleeveContent);
  },

  // Helper function that hides all content
  hideAllContent: function () {
    Engine.Display.terminalContent.style.display = "none";
    Engine.Display.characterContent.style.display = "none";
    ReactDOM.unmountComponentAtNode(Engine.Display.characterContent);

    Engine.Display.scriptEditorContent.style.display = "none";
    ReactDOM.unmountComponentAtNode(Engine.Display.scriptEditorContent);

    Engine.Display.activeScriptsContent.style.display = "none";
    ReactDOM.unmountComponentAtNode(Engine.Display.activeScriptsContent);

    Engine.Display.infiltrationContent.style.display = "none";
    ReactDOM.unmountComponentAtNode(Engine.Display.infiltrationContent);

    Engine.Display.hacknetNodesContent.style.display = "none";
    ReactDOM.unmountComponentAtNode(Engine.Display.hacknetNodesContent);

    Engine.Display.createProgramContent.style.display = "none";
    ReactDOM.unmountComponentAtNode(Engine.Display.createProgramContent);

    Engine.Display.factionsContent.style.display = "none";
    ReactDOM.unmountComponentAtNode(Engine.Display.factionsContent);

    Engine.Display.factionContent.style.display = "none";
    ReactDOM.unmountComponentAtNode(Engine.Display.factionContent);

    Engine.Display.augmentationsContent.style.display = "none";
    ReactDOM.unmountComponentAtNode(Engine.Display.augmentationsContent);

    Engine.Display.tutorialContent.style.display = "none";
    ReactDOM.unmountComponentAtNode(Engine.Display.tutorialContent);

    Engine.Display.milestonesContent.style.display = "none";
    ReactDOM.unmountComponentAtNode(Engine.Display.milestonesContent);

    Engine.Display.devMenuContent.style.display = "none";
    ReactDOM.unmountComponentAtNode(Engine.Display.devMenuContent);

    Engine.Display.locationContent.style.display = "none";
    ReactDOM.unmountComponentAtNode(Engine.Display.locationContent);

    Engine.Display.gangContent.style.display = "none";
    ReactDOM.unmountComponentAtNode(Engine.Display.gangContent);

    Engine.Display.bladeburnerContent.style.display = "none";
    ReactDOM.unmountComponentAtNode(Engine.Display.bladeburnerContent);

    Engine.Display.resleeveContent.style.display = "none";
    ReactDOM.unmountComponentAtNode(Engine.Display.resleeveContent);

    Engine.Display.sleevesContent.style.display = "none";
    ReactDOM.unmountComponentAtNode(Engine.Display.sleevesContent);

    Engine.Display.corporationContent.style.display = "none";
    ReactDOM.unmountComponentAtNode(Engine.Display.corporationContent);

    Engine.Display.workInProgressContent.style.display = "none";
    Engine.Display.redPillContent.style.display = "none";
    Engine.Display.cinematicTextContent.style.display = "none";
    Engine.Display.stockMarketContent.style.display = "none";
    Engine.Display.missionContent.style.display = "none";

    // Make nav menu tabs inactive
    Engine.inactivateMainMenuLinks();
  },

  // Remove 'active' css class from all main menu links
  inactivateMainMenuLinks: function () {
    for (const link of Object.keys(MainMenuLinks)) {
      MainMenuLinks[link].classList.remove("active");
    }
  },

  displayCharacterOverviewInfo: function () {
    ReactDOM.render(<CharacterOverviewComponent />, document.getElementById("character-overview-text"));

    const save = document.getElementById("character-overview-save-button");
    const flashClass = "flashing-button";
    if (!Settings.AutosaveInterval) {
      save.classList.add(flashClass);
    } else {
      save.classList.remove(flashClass);
    }
  },

  // Main Game Loop
  idleTimer: function () {
    // Get time difference
    const _thisUpdate = new Date().getTime();
    let diff = _thisUpdate - Engine._lastUpdate;
    const offset = diff % Engine._idleSpeed;

    // Divide this by cycle time to determine how many cycles have elapsed since last update
    diff = Math.floor(diff / Engine._idleSpeed);

    if (diff > 0) {
      // Update the game engine by the calculated number of cycles
      Engine._lastUpdate = _thisUpdate - offset;
      Player.lastUpdate = _thisUpdate - offset;
      Engine.updateGame(diff);
    }

    window.requestAnimationFrame(Engine.idleTimer);
  },

  updateGame: function (numCycles = 1) {
    const time = numCycles * Engine._idleSpeed;
    if (Player.totalPlaytime == null) {
      Player.totalPlaytime = 0;
    }
    if (Player.playtimeSinceLastAug == null) {
      Player.playtimeSinceLastAug = 0;
    }
    if (Player.playtimeSinceLastBitnode == null) {
      Player.playtimeSinceLastBitnode = 0;
    }
    Player.totalPlaytime += time;
    Player.playtimeSinceLastAug += time;
    Player.playtimeSinceLastBitnode += time;

    // Start Manual hack
    if (Terminal.actionStarted === true) {
      Engine._totalActionTime = Terminal.actionTime;
      Engine._actionTimeLeft = Terminal.actionTime;
      Engine._actionInProgress = true;
      Engine._actionProgressBarCount = 1;
      Engine._actionProgressStr = "[                                                  ]";
      Engine._actionTimeStr = "Time left: ";
      Terminal.actionStarted = false;
    }

    // Working
    if (Player.isWorking) {
      if (Player.workType == CONSTANTS.WorkTypeFaction) {
        Player.workForFaction(numCycles);
      } else if (Player.workType == CONSTANTS.WorkTypeCreateProgram) {
        Player.createProgramWork(numCycles);
      } else if (Player.workType == CONSTANTS.WorkTypeStudyClass) {
        Player.takeClass(numCycles);
      } else if (Player.workType == CONSTANTS.WorkTypeCrime) {
        Player.commitCrime(numCycles);
      } else if (Player.workType == CONSTANTS.WorkTypeCompanyPartTime) {
        Player.workPartTime(numCycles);
      } else {
        Player.work(numCycles);
      }
    }

    // Update stock prices
    if (Player.hasWseAccount) {
      processStockPrices(numCycles);
    }

    // Gang, if applicable
    if (Player.inGang()) {
      Player.gang.process(numCycles, Player);
    }

    // Mission
    if (inMission && currMission) {
      currMission.process(numCycles);
    }

    // Corporation
    if (Player.corporation instanceof Corporation) {
      // Stores cycles in a "buffer". Processed separately using Engine Counters
      Player.corporation.storeCycles(numCycles);
    }

    if (Player.bladeburner instanceof Bladeburner) {
      Player.bladeburner.storeCycles(numCycles);
    }

    // Sleeves
    for (let i = 0; i < Player.sleeves.length; ++i) {
      if (Player.sleeves[i] instanceof Sleeve) {
        const expForOtherSleeves = Player.sleeves[i].process(Player, numCycles);

        // This sleeve earns experience for other sleeves
        if (expForOtherSleeves == null) {
          continue;
        }
        for (let j = 0; j < Player.sleeves.length; ++j) {
          if (j === i) {
            continue;
          }
          Player.sleeves[j].gainExperience(Player, expForOtherSleeves, numCycles, true);
        }
      }
    }

    // Counters
    Engine.decrementAllCounters(numCycles);
    Engine.checkCounters();

    // Manual hacks
    if (Engine._actionInProgress == true) {
      Engine.updateHackProgress(numCycles);
    }

    // Update the running time of all active scripts
    updateOnlineScriptTimes(numCycles);

    // Hacknet Nodes
    processHacknetEarnings(Player, numCycles);
  },

  /**
   * Counters for the main event loop. Represent the number of game cycles that
   * are required for something to happen. These counters are in game cycles,
   * which is once every 200ms
   */
  Counters: {
    autoSaveCounter: 300,
    updateSkillLevelsCounter: 10,
    updateDisplays: 3,
    updateDisplaysLong: 15,
    updateActiveScriptsDisplay: 5,
    createProgramNotifications: 10,
    augmentationsNotifications: 10,
    checkFactionInvitations: 100,
    passiveFactionGrowth: 5,
    messages: 150,
    mechanicProcess: 5, // Processes certain mechanics (Corporation, Bladeburner)
    contractGeneration: 3000, // Generate Coding Contracts
  },

  decrementAllCounters: function (numCycles = 1) {
    for (var counter in Engine.Counters) {
      if (Engine.Counters.hasOwnProperty(counter)) {
        Engine.Counters[counter] = Engine.Counters[counter] - numCycles;
      }
    }
  },

  /**
   * Checks if any counters are 0. If they are, executes whatever
   * is necessary and then resets the counter
   */
  checkCounters: function () {
    if (Engine.Counters.autoSaveCounter <= 0) {
      if (Settings.AutosaveInterval == null) {
        Settings.AutosaveInterval = 60;
      }
      if (Settings.AutosaveInterval === 0) {
        Engine.Counters.autoSaveCounter = Infinity;
      } else {
        Engine.Counters.autoSaveCounter = Settings.AutosaveInterval * 5;
        saveObject.saveGame(Engine.indexedDb);
      }
    }

    if (Engine.Counters.updateSkillLevelsCounter <= 0) {
      Player.updateSkillLevels();
      Engine.Counters.updateSkillLevelsCounter = 10;
    }

    if (Engine.Counters.updateDisplays <= 0) {
      Engine.displayCharacterOverviewInfo();
      Engine.Counters.updateDisplays = 3;
    }

    if (Engine.Counters.createProgramNotifications <= 0) {
      var num = getNumAvailableCreateProgram();
      var elem = document.getElementById("create-program-notification");
      if (num > 0) {
        elem.innerHTML = num;
        elem.setAttribute("class", "notification-on");
      } else {
        elem.innerHTML = "";
        elem.setAttribute("class", "notification-off");
      }
      Engine.Counters.createProgramNotifications = 10;
    }

    if (Engine.Counters.augmentationsNotifications <= 0) {
      var num = Player.queuedAugmentations.length;
      var elem = document.getElementById("augmentations-notification");
      if (num > 0) {
        elem.innerHTML = num;
        elem.setAttribute("class", "notification-on");
      } else {
        elem.innerHTML = "";
        elem.setAttribute("class", "notification-off");
      }
      Engine.Counters.augmentationsNotifications = 10;
    }

    if (Engine.Counters.checkFactionInvitations <= 0) {
      var invitedFactions = Player.checkForFactionInvitations();
      if (invitedFactions.length > 0) {
        if (Player.firstFacInvRecvd === false) {
          Player.firstFacInvRecvd = true;
          document.getElementById("factions-tab").style.display = "list-item";
          document.getElementById("character-menu-header").click();
          document.getElementById("character-menu-header").click();
        }

        var randFaction = invitedFactions[Math.floor(Math.random() * invitedFactions.length)];
        inviteToFaction(randFaction);
      }

      const num = Player.factionInvitations.length;
      const elem = document.getElementById("factions-notification");
      if (num > 0) {
        elem.innerHTML = num;
        elem.setAttribute("class", "notification-on");
      } else {
        elem.innerHTML = "";
        elem.setAttribute("class", "notification-off");
      }

      Engine.Counters.checkFactionInvitations = 100;
    }

    if (Engine.Counters.passiveFactionGrowth <= 0) {
      var adjustedCycles = Math.floor(5 - Engine.Counters.passiveFactionGrowth);
      processPassiveFactionRepGain(adjustedCycles);
      Engine.Counters.passiveFactionGrowth = 5;
    }

    if (Engine.Counters.messages <= 0) {
      checkForMessagesToSend();
      if (Augmentations[AugmentationNames.TheRedPill].owned) {
        Engine.Counters.messages = 4500; // 15 minutes for Red pill message
      } else {
        Engine.Counters.messages = 150;
      }
    }

    if (Engine.Counters.mechanicProcess <= 0) {
      if (Player.corporation instanceof Corporation) {
        Player.corporation.process(Player);
      }
      if (Player.bladeburner instanceof Bladeburner) {
        try {
          Player.bladeburner.process(Player);
        } catch (e) {
          exceptionAlert("Exception caught in Bladeburner.process(): " + e);
        }
      }
      Engine.Counters.mechanicProcess = 5;
    }

    if (Engine.Counters.contractGeneration <= 0) {
      // X% chance of a contract being generated
      if (Math.random() <= 0.25) {
        generateRandomContract();
      }
      Engine.Counters.contractGeneration = 3000;
    }
  },

  // Calculates the hack progress for a manual (non-scripted) hack and updates the progress bar/time accordingly
  // TODO Refactor this into Terminal module
  _totalActionTime: 0,
  _actionTimeLeft: 0,
  _actionTimeStr: "Time left: ",
  _actionProgressStr: "[                                                  ]",
  _actionProgressBarCount: 1,
  _actionInProgress: false,
  updateHackProgress: function (numCycles = 1) {
    var timeElapsedMilli = numCycles * Engine._idleSpeed;
    Engine._actionTimeLeft -= timeElapsedMilli / 1000; // Substract idle speed (ms)
    Engine._actionTimeLeft = Math.max(Engine._actionTimeLeft, 0);

    // Calculate percent filled
    var percent = Math.round((1 - Engine._actionTimeLeft / Engine._totalActionTime) * 100);

    // Update progress bar
    while (Engine._actionProgressBarCount * 2 <= percent) {
      Engine._actionProgressStr = replaceAt(Engine._actionProgressStr, Engine._actionProgressBarCount, "|");
      Engine._actionProgressBarCount += 1;
    }

    // Update hack time remaining
    Engine._actionTimeStr = "Time left: " + Math.max(0, Math.round(Engine._actionTimeLeft)).toString() + "s";
    document.getElementById("hack-progress").innerHTML = Engine._actionTimeStr;

    // Dynamically update progress bar
    document.getElementById("hack-progress-bar").innerHTML = Engine._actionProgressStr.replace(/ /g, "&nbsp;");

    // Once percent is 100, the hack is completed
    if (percent >= 100) {
      Engine._actionInProgress = false;
      Terminal.finishAction();
    }
  },

  /**
   * Collapses a main menu header. Used when initializing the game.
   * @param elems {HTMLElement[]} Elements under header
   */
  closeMainMenuHeader: function (elems) {
    for (var i = 0; i < elems.length; ++i) {
      elems[i].style.maxHeight = null;
      elems[i].style.opacity = 0;
      elems[i].style.pointerEvents = "none";
    }
  },

  /**
   * Expands a main menu header. Used when initializing the game.
   * @param elems {HTMLElement[]} Elements under header
   */
  openMainMenuHeader: function (elems) {
    for (var i = 0; i < elems.length; ++i) {
      elems[i].style.maxHeight = elems[i].scrollHeight + "px";
      elems[i].style.display = "block";
    }
  },

  /**
   * Used in game when clicking on a main menu header (NOT used for initialization)
   * @param open {boolean} Whether header is being opened or closed
   * @param elems {HTMLElement[]} li Elements under header
   * @param links {HTMLElement[]} a elements under header
   */
  toggleMainMenuHeader: function (open, elems, links) {
    for (var i = 0; i < elems.length; ++i) {
      if (open) {
        elems[i].style.opacity = 1;
        elems[i].style.maxHeight = elems[i].scrollHeight + "px";
      } else {
        elems[i].style.opacity = 0;
        elems[i].style.maxHeight = null;
      }
    }

    for (var i = 0; i < links.length; ++i) {
      if (open) {
        links[i].style.opacity = 1;
        links[i].style.maxHeight = links[i].scrollHeight + "px";
        links[i].style.pointerEvents = "auto";
      } else {
        links[i].style.opacity = 0;
        links[i].style.maxHeight = null;
        links[i].style.pointerEvents = "none";
      }
    }
  },

  load: function (saveString) {
    // Initialize main menu accordion panels to all start as "open"
    const terminal = document.getElementById("terminal-tab");
    const createScript = document.getElementById("create-script-tab");
    const activeScripts = document.getElementById("active-scripts-tab");
    const createProgram = document.getElementById("create-program-tab");
    const stats = document.getElementById("stats-tab");
    const factions = document.getElementById("factions-tab");
    const augmentations = document.getElementById("augmentations-tab");
    const hacknetnodes = document.getElementById("hacknet-nodes-tab");
    const city = document.getElementById("city-tab");
    const travel = document.getElementById("travel-tab");
    const job = document.getElementById("job-tab");
    const stockmarket = document.getElementById("stock-market-tab");
    const bladeburner = document.getElementById("bladeburner-tab");
    const corp = document.getElementById("corporation-tab");
    const gang = document.getElementById("gang-tab");
    const milestones = document.getElementById("milestones-tab");
    const tutorial = document.getElementById("tutorial-tab");
    const options = document.getElementById("options-tab");
    const dev = document.getElementById("dev-tab");

    // Load game from save or create new game
    if (loadGame(saveString)) {
      initBitNodeMultipliers(Player);
      Engine.setDisplayElements(); // Sets variables for important DOM elements
      Engine.init(); // Initialize buttons, work, etc.
      updateSourceFileFlags(Player);
      initAugmentations(); // Also calls Player.reapplyAllAugmentations()
      Player.reapplyAllSourceFiles();
      if (Player.hasWseAccount) {
        initSymbolToStockMap();
      }

      // Calculate the number of cycles have elapsed while offline
      Engine._lastUpdate = new Date().getTime();
      const lastUpdate = Player.lastUpdate;
      const timeOffline = Engine._lastUpdate - lastUpdate;
      const numCyclesOffline = Math.floor(timeOffline / Engine._idleSpeed);

      let offlineReputation = 0;
      const offlineHackingIncome = (Player.moneySourceA.hacking / Player.playtimeSinceLastAug) * timeOffline * 0.75;
      Player.gainMoney(offlineHackingIncome);
      // Process offline progress
      loadAllRunningScripts(); // This also takes care of offline production for those scripts
      if (Player.isWorking) {
        Player.focus = true;
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
      } else {
        for (let i = 0; i < Player.factions.length; i++) {
          const facName = Player.factions[i];
          if (!Factions.hasOwnProperty(facName)) continue;
          const faction = Factions[facName];
          if (!faction.isMember) continue;
          // No rep for special factions.
          const info = faction.getInfo();
          if (!info.offersWork()) continue;
          // No rep for gangs.
          if (Player.getGangName() === facName) continue;

          const hRep = getHackingWorkRepGain(Player, faction);
          const sRep = getFactionSecurityWorkRepGain(Player, faction);
          const fRep = getFactionFieldWorkRepGain(Player, faction);
          // can be infinite, doesn't matter.
          const reputationRate = Math.max(hRep, sRep, fRep) / Player.factions.length;

          const rep = reputationRate * numCyclesOffline;
          faction.playerReputation += rep;
          offlineReputation += rep;
        }
      }

      // Hacknet Nodes offline progress
      var offlineProductionFromHacknetNodes = processHacknetEarnings(Player, numCyclesOffline);
      const hacknetProdInfo = hasHacknetServers(Player) ? (
        <>{Hashes(offlineProductionFromHacknetNodes)} hashes</>
      ) : (
        <Money money={offlineProductionFromHacknetNodes} />
      );

      // Passive faction rep gain offline
      processPassiveFactionRepGain(numCyclesOffline);

      // Stock Market offline progress
      if (Player.hasWseAccount) {
        processStockPrices(numCyclesOffline);
      }

      // Gang progress for BitNode 2
      if (Player.inGang()) {
        Player.gang.process(numCyclesOffline, Player);
      }

      // Corporation offline progress
      if (Player.corporation instanceof Corporation) {
        Player.corporation.storeCycles(numCyclesOffline);
      }

      // Bladeburner offline progress
      if (Player.bladeburner instanceof Bladeburner) {
        Player.bladeburner.storeCycles(numCyclesOffline);
      }

      // Sleeves offline progress
      for (let i = 0; i < Player.sleeves.length; ++i) {
        if (Player.sleeves[i] instanceof Sleeve) {
          const expForOtherSleeves = Player.sleeves[i].process(Player, numCyclesOffline);

          // This sleeve earns experience for other sleeves
          if (expForOtherSleeves == null) {
            continue;
          }
          for (let j = 0; j < Player.sleeves.length; ++j) {
            if (j === i) {
              continue;
            }
            Player.sleeves[j].gainExperience(Player, expForOtherSleeves, numCyclesOffline, true);
          }
        }
      }

      // Update total playtime
      var time = numCyclesOffline * Engine._idleSpeed;
      if (Player.totalPlaytime == null) {
        Player.totalPlaytime = 0;
      }
      if (Player.playtimeSinceLastAug == null) {
        Player.playtimeSinceLastAug = 0;
      }
      if (Player.playtimeSinceLastBitnode == null) {
        Player.playtimeSinceLastBitnode = 0;
      }
      Player.totalPlaytime += time;
      Player.playtimeSinceLastAug += time;
      Player.playtimeSinceLastBitnode += time;

      Player.lastUpdate = Engine._lastUpdate;
      Engine.start(); // Run main game loop and Scripts loop
      removeLoadingScreen();
      const timeOfflineString = convertTimeMsToTimeElapsedString(time);
      dialogBoxCreate(
        <>
          Offline for {timeOfflineString}. While you were offline, your scripts generated{" "}
          <Money money={offlineHackingIncome} />, your Hacknet Nodes generated {hacknetProdInfo} and you gained{" "}
          {Reputation(offlineReputation)} divided amongst your factions.
        </>,
      );
      // Close main menu accordions for loaded game
      var visibleMenuTabs = [
        terminal,
        createScript,
        activeScripts,
        stats,
        hacknetnodes,
        city,
        milestones,
        tutorial,
        options,
        dev,
      ];
      if (Player.firstFacInvRecvd) {
        visibleMenuTabs.push(factions);
      } else {
        factions.style.display = "none";
      }
      if (Player.firstAugPurchased) {
        visibleMenuTabs.push(augmentations);
      } else {
        augmentations.style.display = "none";
      }
      if (Player.companyName !== "") {
        visibleMenuTabs.push(job);
      } else {
        job.style.display = "none";
      }
      if (Player.firstTimeTraveled) {
        visibleMenuTabs.push(travel);
      } else {
        travel.style.display = "none";
      }
      if (Player.firstProgramAvailable) {
        visibleMenuTabs.push(createProgram);
      } else {
        createProgram.style.display = "none";
      }
      if (Player.hasWseAccount) {
        visibleMenuTabs.push(stockmarket);
      } else {
        stockmarket.style.display = "none";
      }
      if (Player.bladeburner instanceof Bladeburner) {
        visibleMenuTabs.push(bladeburner);
      } else {
        bladeburner.style.display = "none";
      }
      if (Player.corporation instanceof Corporation) {
        visibleMenuTabs.push(corp);
      } else {
        corp.style.display = "none";
      }
      if (Player.inGang()) {
        visibleMenuTabs.push(gang);
      } else {
        gang.style.display = "none";
      }

      Engine.closeMainMenuHeader(visibleMenuTabs);
    } else {
      // No save found, start new game
      initBitNodeMultipliers(Player);
      initSpecialServerIps();
      Engine.setDisplayElements(); // Sets variables for important DOM elements
      Engine.start(); // Run main game loop and Scripts loop
      Player.init();
      initForeignServers(Player.getHomeComputer());
      initCompanies();
      initFactions();
      initAugmentations();
      initMessages();
      updateSourceFileFlags(Player);

      // Open main menu accordions for new game
      const hackingHdr = document.getElementById("hacking-menu-header");
      hackingHdr.classList.toggle("opened");
      const characterHdr = document.getElementById("character-menu-header");
      characterHdr.classList.toggle("opened");
      const worldHdr = document.getElementById("world-menu-header");
      worldHdr.classList.toggle("opened");
      const helpHdr = document.getElementById("help-menu-header");
      helpHdr.classList.toggle("opened");

      // Hide tabs that wont be revealed until later
      factions.style.display = "none";
      augmentations.style.display = "none";
      job.style.display = "none";
      stockmarket.style.display = "none";
      travel.style.display = "none";
      createProgram.style.display = "none";
      bladeburner.style.display = "none";
      corp.style.display = "none";
      gang.style.display = "none";
      dev.style.display = "none";

      Engine.openMainMenuHeader([
        terminal,
        createScript,
        activeScripts,
        stats,
        hacknetnodes,
        city,
        milestones,
        tutorial,
        options,
      ]);

      // Start interactive tutorial
      iTutorialStart();
      removeLoadingScreen();
    }
    // Initialize labels on game settings
    setSettingsLabels();
    Terminal.resetTerminalInput();
  },

  setDisplayElements: function () {
    // Content elements
    Engine.Display.terminalContent = document.getElementById("terminal-container");
    routing.navigateTo(Page.Terminal);

    Engine.Display.characterContent = document.getElementById("character-container");
    Engine.Display.characterContent.style.display = "none";

    Engine.Display.scriptEditorContent = document.getElementById("script-editor-container");
    Engine.Display.scriptEditorContent.style.display = "none";

    Engine.Display.activeScriptsContent = document.getElementById("active-scripts-container");
    Engine.Display.activeScriptsContent.style.display = "none";

    Engine.Display.hacknetNodesContent = document.getElementById("hacknet-nodes-container");
    Engine.Display.hacknetNodesContent.style.display = "none";

    Engine.Display.createProgramContent = document.getElementById("create-program-container");
    Engine.Display.createProgramContent.style.display = "none";

    Engine.Display.factionsContent = document.getElementById("factions-container");
    Engine.Display.factionsContent.style.display = "none";

    Engine.Display.factionContent = document.getElementById("faction-container");
    Engine.Display.factionContent.style.display = "none";

    Engine.Display.augmentationsContent = document.getElementById("augmentations-container");
    Engine.Display.augmentationsContent.style.display = "none";

    Engine.Display.milestonesContent = document.getElementById("milestones-container");
    Engine.Display.milestonesContent.style.display = "none";

    Engine.Display.devMenuContent = document.getElementById("dev-menu-container");
    Engine.Display.devMenuContent.style.display = "none";

    Engine.Display.tutorialContent = document.getElementById("tutorial-container");
    Engine.Display.tutorialContent.style.display = "none";

    Engine.Display.infiltrationContent = document.getElementById("infiltration-container");
    Engine.Display.infiltrationContent.style.display = "none";

    Engine.Display.stockMarketContent = document.getElementById("stock-market-container");
    Engine.Display.stockMarketContent.style.display = "none";

    Engine.Display.gangContent = document.getElementById("gang-container");
    Engine.Display.gangContent.style.display = "none";

    Engine.Display.bladeburnerContent = document.getElementById("bladeburner-container");
    Engine.Display.bladeburnerContent.style.display = "none";

    Engine.Display.resleeveContent = document.getElementById("resleeve-container");
    Engine.Display.resleeveContent.style.display = "none";

    Engine.Display.sleevesContent = document.getElementById("sleeves-container");
    Engine.Display.sleevesContent.style.display = "none";

    Engine.Display.corporationContent = document.getElementById("corporation-container");
    Engine.Display.corporationContent.style.display = "none";

    Engine.Display.missionContent = document.getElementById("mission-container");
    Engine.Display.missionContent.style.display = "none";

    // Location page (page that shows up when you visit a specific location in World)
    Engine.Display.locationContent = document.getElementById("location-container");
    Engine.Display.locationContent.style.display = "none";

    // Work In Progress
    Engine.Display.workInProgressContent = document.getElementById("work-in-progress-container");
    Engine.Display.workInProgressContent.style.display = "none";

    // Red Pill / Hack World Daemon
    Engine.Display.redPillContent = document.getElementById("red-pill-container");
    Engine.Display.redPillContent.style.display = "none";

    // Cinematic Text
    Engine.Display.cinematicTextContent = document.getElementById("cinematic-text-container");
    Engine.Display.cinematicTextContent.style.display = "none";

    // Initialize references to main menu links
    if (!initializeMainMenuLinks()) {
      const errorMsg =
        "Failed to initialize Main Menu Links. Please try refreshing the page. " +
        "If that doesn't work, report the issue to the developer";
      exceptionAlert(new Error(errorMsg));
      console.error(errorMsg);
      return;
    }
  },

  // Initialization
  init: function () {
    // Import game link
    document.getElementById("import-game-link").onclick = function () {
      saveObject.importGame();
    };

    // Initialize Main Menu Headers (this must be done after initializing the links)
    if (!initializeMainMenuHeaders(Player, process.env.NODE_ENV === "development")) {
      const errorMsg =
        "Failed to initialize Main Menu Headers. Please try refreshing the page. " +
        "If that doesn't work, report the issue to the developer";
      exceptionAlert(new Error(errorMsg));
      console.error(errorMsg);
      return;
    }

    MainMenuLinks.Terminal.addEventListener("click", () => Engine.loadTerminalContent());
    MainMenuLinks.ScriptEditor.addEventListener("click", () => Engine.loadScriptEditorContent());
    MainMenuLinks.ActiveScripts.addEventListener("click", () => Engine.loadActiveScriptsContent());
    MainMenuLinks.CreateProgram.addEventListener("click", () => Engine.loadCreateProgramContent());
    MainMenuLinks.Stats.addEventListener("click", () => Engine.loadCharacterContent());
    MainMenuLinks.Factions.addEventListener("click", () => Engine.loadFactionsContent());
    MainMenuLinks.Augmentations.addEventListener("click", () => Engine.loadAugmentationsContent());
    MainMenuLinks.HacknetNodes.addEventListener("click", () => Engine.loadHacknetNodesContent());
    MainMenuLinks.Sleeves.addEventListener("click", () => Engine.loadSleevesContent());
    MainMenuLinks.City.addEventListener("click", () => Engine.loadLocationContent());
    MainMenuLinks.Travel.addEventListener("click", () => Engine.loadTravelContent());
    MainMenuLinks.Job.addEventListener("click", () => Engine.loadJobContent());
    MainMenuLinks.StockMarket.addEventListener("click", () => Engine.loadStockMarketContent());
    MainMenuLinks.Bladeburner.addEventListener("click", () => Engine.loadBladeburnerContent());
    MainMenuLinks.Corporation.addEventListener("click", () => Engine.loadCorporationContent());
    MainMenuLinks.Gang.addEventListener("click", () => Engine.loadGangContent());
    MainMenuLinks.Milestones.addEventListener("click", () => Engine.loadMilestonesContent());
    MainMenuLinks.Tutorial.addEventListener("click", () => Engine.loadTutorialContent());
    MainMenuLinks.DevMenu.addEventListener("click", function () {
      if (process.env.NODE_ENV === "development") {
        Engine.loadDevMenuContent();
      }
    });

    // Save, Delete, Import/Export buttons
    Engine.Clickables.saveMainMenuButton = document.getElementById("save-game-link");
    Engine.Clickables.saveMainMenuButton.addEventListener("click", function () {
      saveObject.saveGame(Engine.indexedDb);
      return false;
    });

    Engine.Clickables.deleteMainMenuButton = document.getElementById("delete-game-link");
    Engine.Clickables.deleteMainMenuButton.addEventListener("click", function () {
      saveObject.deleteGame(Engine.indexedDb);
      return false;
    });

    document.getElementById("export-game-link").addEventListener("click", function () {
      saveObject.exportGame();
      return false;
    });

    // Character Overview buttons
    document.getElementById("character-overview-save-button").addEventListener("click", function () {
      saveObject.saveGame(Engine.indexedDb);
      return false;
    });

    document.getElementById("character-overview-options-button").addEventListener("click", function () {
      gameOptionsBoxOpen();
      return false;
    });

    // Message at the top of terminal
    postVersion();

    // Player was working cancel button
    if (Player.isWorking) {
      var cancelButton = document.getElementById("work-in-progress-cancel-button");
      cancelButton.addEventListener("click", function () {
        if (Player.workType == CONSTANTS.WorkTypeFaction) {
          Player.finishFactionWork(true);
        } else if (Player.workType == CONSTANTS.WorkTypeCreateProgram) {
          Player.finishCreateProgramWork(true);
        } else if (Player.workType == CONSTANTS.WorkTypeStudyClass) {
          Player.finishClass();
        } else if (Player.workType == CONSTANTS.WorkTypeCrime) {
          Player.finishCrime(true);
        } else if (Player.workType == CONSTANTS.WorkTypeCompanyPartTime) {
          Player.finishWorkPartTime();
        } else {
          Player.finishWork(true);
        }
      });

      const focusButton = document.getElementById("work-in-progress-something-else-button");
      focusButton.style.visibility = "hidden";
      const focusable = [CONSTANTS.WorkTypeFaction, CONSTANTS.WorkTypeCompanyPartTime, CONSTANTS.WorkTypeCompany];
      if (focusable.includes(Player.workType)) {
        focusButton.style.visibility = "visible";
        focusButton.addEventListener("click", function () {
          Player.stopFocusing();
        });
      }

      Engine.loadWorkInProgressContent();
    }

    // Character overview screen
    document.getElementById("character-overview-container").style.display = "block";

    // Remove classes from links (they might be set from tutorial)
    document.getElementById("terminal-menu-link").removeAttribute("class");
    document.getElementById("stats-menu-link").removeAttribute("class");
    document.getElementById("create-script-menu-link").removeAttribute("class");
    document.getElementById("active-scripts-menu-link").removeAttribute("class");
    document.getElementById("hacknet-nodes-menu-link").removeAttribute("class");
    document.getElementById("city-menu-link").removeAttribute("class");
    document.getElementById("milestones-menu-link").removeAttribute("class");
    document.getElementById("tutorial-menu-link").removeAttribute("class");

    // Copy Save Data to Clipboard
    document.getElementById("copy-save-to-clipboard-link").addEventListener("click", function () {
      const saveString = saveObject.getSaveString();
      if (!navigator.clipboard) {
        // Async Clipboard API not supported, so we'll use this using the
        // textarea and document.execCommand('copy') trick
        const textArea = document.createElement("textarea");
        textArea.value = saveString;
        textArea.setAttribute("readonly", "");
        textArea.style.position = "absolute";
        textArea.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          const successful = document.execCommand("copy");
          if (successful) {
            createStatusText("Copied save to clipboard");
          } else {
            createStatusText("Failed to copy save");
          }
        } catch (e) {
          console.error("Unable to copy save data to clipboard using document.execCommand('copy')");
          createStatusText("Failed to copy save");
        }
        document.body.removeChild(textArea);
      } else {
        // Use the Async Clipboard API
        navigator.clipboard.writeText(saveString).then(
          function () {
            createStatusText("Copied save to clipboard");
          },
          function (err) {
            console.error(err);
            console.error("Unable to copy save data to clipboard using Async API");
            createStatusText("Failed to copy save");
          },
        );
      }
    });

    // DEBUG Delete active Scripts on home
    document.getElementById("debug-delete-scripts-link").addEventListener("click", function () {
      for (const hostname of Object.keys(AllServers)) {
        AllServers[hostname].runningScripts = [];
      }
      dialogBoxCreate("Forcefully deleted all running scripts. Please save and refresh page.");
      gameOptionsBoxClose();
    });

    // DEBUG Soft Reset
    document.getElementById("debug-soft-reset").addEventListener("click", function () {
      dialogBoxCreate("Soft Reset!");
      prestigeAugmentation();
      gameOptionsBoxClose();
    });

    // DEBUG File diagnostic
    document.getElementById("debug-files").addEventListener("click", function () {
      createPopup("debug-files-diagnostic-popup", FileDiagnosticPopup, {});
    });
  },

  start: function () {
    // Run main loop
    Engine.idleTimer();
  },
};

var indexedDbRequest;
window.onload = function () {
  if (!window.indexedDB) {
    return Engine.load(null); // Will try to load from localstorage
  }

  /**
   * DB is called bitburnerSave
   * Object store is called savestring
   * key for the Object store is called save
   */
  indexedDbRequest = window.indexedDB.open("bitburnerSave", 1);

  indexedDbRequest.onerror = function (e) {
    console.error("Error opening indexedDB: ");
    console.error(e);
    return Engine.load(null); // Try to load from localstorage
  };

  indexedDbRequest.onsuccess = function (e) {
    Engine.indexedDb = e.target.result;
    var transaction = Engine.indexedDb.transaction(["savestring"]);
    var objectStore = transaction.objectStore("savestring");
    var request = objectStore.get("save");
    request.onerror = function (e) {
      console.error("Error in Database request to get savestring: " + e);
      return Engine.load(null); // Try to load from localstorage
    };

    request.onsuccess = function () {
      Engine.load(request.result);
    };
  };

  indexedDbRequest.onupgradeneeded = function (e) {
    const db = e.target.result;
    db.createObjectStore("savestring");
  };
};

export { Engine };
