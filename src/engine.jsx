/**
 * Game engine. Handles the main game loop as well as the main UI pages
 *
 * TODO: Separate UI functionality into its own component
 */
import { convertTimeMsToTimeElapsedString } from "../utils/StringHelperFunctions";
import { Augmentations } from "./Augmentation/Augmentations";
import { initAugmentations, installAugmentations } from "./Augmentation/AugmentationHelpers";
import { onExport } from "./ExportBonus";
import { AugmentationsRoot } from "./Augmentation/ui/Root";
import { AugmentationNames } from "./Augmentation/data/AugmentationNames";
import { initBitNodeMultipliers } from "./BitNode/BitNode";
import { Bladeburner } from "./Bladeburner/Bladeburner";
import { CharacterOverview } from "./ui/React/CharacterOverview";
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
import { SidebarRoot } from "./Sidebar/ui/SidebarRoot";
import { CorporationRoot } from "./Corporation/ui/CorporationRoot";
import { ResleeveRoot } from "./PersonObjects/Resleeving/ui/ResleeveRoot";
import { GameOptionsRoot } from "./ui/React/GameOptionsRoot";
import { Theme } from "./ui/React/Theme";
import { SleeveRoot } from "./PersonObjects/Sleeve/ui/SleeveRoot";
import { displayInfiltrationContent } from "./Infiltration/Helper";
import {
  getHackingWorkRepGain,
  getFactionSecurityWorkRepGain,
  getFactionFieldWorkRepGain,
} from "./PersonObjects/formulas/reputation";
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
import { ProgramsRoot } from "./Programs/ui/ProgramsRoot";
import { saveObject, loadGame } from "./SaveObject";
import { Root as ScriptEditorRoot } from "./ScriptEditor/ui/Root";
import { initForeignServers, AllServers } from "./Server/AllServers";
import { Settings } from "./Settings/Settings";
import { updateSourceFileFlags } from "./SourceFile/SourceFileFlags";
import { initSpecialServerIps } from "./Server/SpecialServerIps";
import { initSymbolToStockMap, processStockPrices, displayStockMarketContent } from "./StockMarket/StockMarket";
import { MilestonesRoot } from "./Milestones/ui/MilestonesRoot";
import { TerminalRoot } from "./Terminal/ui/TerminalRoot";
import { Terminal } from "./Terminal";
import { TutorialRoot } from "./Tutorial/ui/TutorialRoot";
import { Sleeve } from "./PersonObjects/Sleeve/Sleeve";

import { CharacterInfo } from "./ui/CharacterInfo";
import { Page, routing } from "./ui/navigationTracking";
import { Money } from "./ui/React/Money";
import { Hashes } from "./ui/React/Hashes";
import { Reputation } from "./ui/React/Reputation";

import { ActiveScriptsRoot } from "./ui/ActiveScripts/Root";
import { MainMenuLinks } from "./ui/MainMenu/Links";

import { dialogBoxCreate } from "../utils/DialogBox";
import { exceptionAlert } from "../utils/helpers/exceptionAlert";
import { removeLoadingScreen } from "../utils/uiHelpers/removeLoadingScreen";
import "./Exploits/tampering";
import "./Exploits/unclickable";

import React from "react";
import ReactDOM from "react-dom";

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
    // Generic page that most react loads into.
    content: null,
    // Main menu content
    infiltrationContent: null,
    workInProgressContent: null,
    redPillContent: null,
    cinematicTextContent: null,
    missionContent: null,
    overview: null,
  },

  indexedDb: undefined,

  // Time variables (milliseconds unix epoch time)
  _lastUpdate: new Date().getTime(),
  _idleSpeed: 200, // Speed (in ms) at which the main loop is updated

  loadTerminalContent: function () {
    Engine.hideAllContent();
    Engine.Display.content.style.display = "block";
    routing.navigateTo(Page.CharacterInfo);
    ReactDOM.render(
      <Theme>
        <TerminalRoot terminal={Terminal} engine={this} player={Player} />
      </Theme>,
      Engine.Display.content,
    );
    MainMenuLinks.Stats.classList.add("active");
  },

  loadCharacterContent: function () {
    Engine.hideAllContent();
    Engine.Display.content.style.display = "block";
    routing.navigateTo(Page.CharacterInfo);
    ReactDOM.render(<CharacterInfo player={Player} />, Engine.Display.content);
    MainMenuLinks.Stats.classList.add("active");
  },

  loadScriptEditorContent: function (filename = "", code = "") {
    Engine.hideAllContent();
    Engine.Display.content.style.display = "block";
    routing.navigateTo(Page.ScriptEditor);
    MainMenuLinks.ScriptEditor.classList.add("active");
    ReactDOM.render(
      <ScriptEditorRoot filename={filename} code={code} player={Player} engine={this} />,
      Engine.Display.content,
    );
  },

  loadActiveScriptsContent: function () {
    Engine.hideAllContent();
    Engine.Display.content.style.display = "block";
    routing.navigateTo(Page.ActiveScripts);
    MainMenuLinks.ActiveScripts.classList.add("active");
    ReactDOM.render(<ActiveScriptsRoot p={Player} workerScripts={workerScripts} />, Engine.Display.content);
  },

  loadHacknetNodesContent: function () {
    Engine.hideAllContent();
    Engine.Display.content.style.display = "block";
    routing.navigateTo(Page.HacknetNodes);
    MainMenuLinks.HacknetNodes.classList.add("active");
    ReactDOM.render(<HacknetRoot player={Player} />, Engine.Display.content);
  },

  loadCreateProgramContent: function () {
    Engine.hideAllContent();
    Engine.Display.content.style.display = "block";
    routing.navigateTo(Page.CreateProgram);
    MainMenuLinks.CreateProgram.classList.add("active");
    ReactDOM.render(
      <Theme>
        <ProgramsRoot player={Player} />
      </Theme>,
      Engine.Display.content,
    );
  },

  loadFactionsContent: function () {
    Engine.hideAllContent();
    Engine.Display.content.style.display = "block";
    routing.navigateTo(Page.Factions);
    MainMenuLinks.Factions.classList.add("active");
    ReactDOM.render(<FactionList player={Player} engine={this} />, Engine.Display.content);
  },

  // TODO reactify
  loadFactionContent: function () {
    Engine.hideAllContent();
    Engine.Display.content.style.display = "block";
    routing.navigateTo(Page.Faction);
  },

  loadAugmentationsContent: function () {
    Engine.hideAllContent();
    Engine.Display.content.style.display = "block";
    routing.navigateTo(Page.Augmentations);
    MainMenuLinks.Augmentations.classList.add("active");

    function backup() {
      saveObject.exportGame();
      onExport(Player);
    }

    ReactDOM.render(
      <AugmentationsRoot exportGameFn={backup} installAugmentationsFn={installAugmentations} />,
      Engine.Display.content,
    );
  },

  loadMilestonesContent: function () {
    Engine.hideAllContent();
    Engine.Display.content.style.display = "block";
    routing.navigateTo(Page.Milestones);
    MainMenuLinks.Milestones.classList.add("active");
    ReactDOM.render(<MilestonesRoot player={Player} />, Engine.Display.content);
  },

  loadTutorialContent: function () {
    Engine.hideAllContent();
    Engine.Display.content.style.display = "block";
    routing.navigateTo(Page.Tutorial);
    MainMenuLinks.Tutorial.classList.add("active");
    ReactDOM.render(<TutorialRoot />, Engine.Display.content);
  },

  loadDevMenuContent: function () {
    Engine.hideAllContent();
    if (process.env.NODE_ENV !== "development") {
      throw new Error("Cannot create Dev Menu because you are not in a dev build");
    }
    Engine.Display.content.style.display = "block";
    ReactDOM.render(<DevMenuRoot player={Player} engine={this} />, Engine.Display.content);
    routing.navigateTo(Page.DevMenu);
    MainMenuLinks.DevMenu.classList.add("active");
  },

  loadLocationContent: function (initiallyInCity = true) {
    Engine.hideAllContent();
    Engine.Display.content.style.display = "block";
    routing.navigateTo(Page.Location);
    MainMenuLinks.City.classList.add("active");
    ReactDOM.render(
      <LocationRoot initiallyInCity={initiallyInCity} engine={Engine} p={Player} />,
      Engine.Display.content,
    );
  },

  loadTravelContent: function () {
    // Same as loadLocationContent() except first set the location to the travel agency,
    // and make sure that the 'City' main menu link doesnt become 'active'
    Engine.hideAllContent();
    Player.gotoLocation(LocationName.TravelAgency);
    Engine.Display.content.style.display = "block";
    routing.navigateTo(Page.Location);
    MainMenuLinks.Travel.classList.add("active");
    ReactDOM.render(<LocationRoot initiallyInCity={false} engine={Engine} p={Player} />, Engine.Display.content);
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
    Engine.Display.content.style.display = "block";
    routing.navigateTo(Page.Location);
    MainMenuLinks.Job.classList.add("active");
    ReactDOM.render(<LocationRoot initiallyInCity={false} engine={Engine} p={Player} />, Engine.Display.content);
  },

  // TODO reactify
  loadWorkInProgressContent: function () {
    Engine.hideAllContent();
    const mainMenu = document.getElementById("mainmenu-container");
    console.log("hiding loadWorkInProgressContent");
    mainMenu.style.visibility = "hidden";
    Engine.Display.workInProgressContent.style.display = "block";
    console.log(Engine.Display.workInProgressContent);
    routing.navigateTo(Page.WorkInProgress);
  },

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
    Engine.Display.content.style.display = "block";
    routing.navigateTo(Page.StockMarket);
    MainMenuLinks.StockMarket.classList.add("active");
    displayStockMarketContent();
  },

  loadGangContent: function () {
    if (!Player.inGang()) return;
    Engine.hideAllContent();
    Engine.Display.content.style.display = "block";
    routing.navigateTo(Page.Gang);
    MainMenuLinks.Gang.classList.add("active");
    ReactDOM.render(<GangRoot engine={this} gang={Player.gang} player={Player} />, Engine.Display.content);
  },

  loadMissionContent: function () {
    Engine.hideAllContent();
    document.getElementById("mainmenu-container").style.visibility = "hidden";
    document.getElementById("character-overview").style.visibility = "hidden";
    Engine.Display.missionContent.style.display = "block";
    routing.navigateTo(Page.Mission);
  },

  loadCorporationContent: function () {
    if (!(Player.corporation instanceof Corporation)) return;
    Engine.hideAllContent();
    Engine.Display.content.style.display = "block";
    routing.navigateTo(Page.Corporation);
    MainMenuLinks.Corporation.classList.add("active");
    ReactDOM.render(<CorporationRoot corp={Player.corporation} player={Player} />, Engine.Display.content);
  },

  loadBladeburnerContent: function () {
    if (!(Player.bladeburner instanceof Bladeburner)) return;
    Engine.hideAllContent();
    Engine.Display.content.style.display = "block";
    routing.navigateTo(Page.Bladeburner);
    MainMenuLinks.Bladeburner.classList.add("active");
    ReactDOM.render(
      <BladeburnerRoot bladeburner={Player.bladeburner} player={Player} engine={this} />,
      Engine.Display.content,
    );
  },

  loadSleevesContent: function () {
    Engine.hideAllContent();
    Engine.Display.content.style.display = "block";
    routing.navigateTo(Page.Sleeves);
    ReactDOM.render(<SleeveRoot player={Player} />, Engine.Display.content);
  },

  loadResleevingContent: function () {
    Engine.hideAllContent();
    routing.navigateTo(Page.Resleeves);
    Engine.Display.content.style.display = "block";
    MainMenuLinks.City.classList.add("active");
    ReactDOM.render(<ResleeveRoot player={Player} />, Engine.Display.content);
  },

  loadGameOptionsContent: function () {
    Engine.hideAllContent();
    routing.navigateTo(Page.GameOptions);
    Engine.Display.content.style.display = "block";
    MainMenuLinks.City.classList.add("active");
    ReactDOM.render(
      <Theme>
        <GameOptionsRoot
          player={Player}
          save={() => saveObject.saveGame(Engine.indexedDb)}
          delete={() => saveObject.deleteGame(Engine.indexedDb)}
          export={() => saveObject.exportGame()}
          import={() => saveObject.importGame()}
          forceKill={() => {
            for (const hostname of Object.keys(AllServers)) {
              AllServers[hostname].runningScripts = [];
            }
            dialogBoxCreate("Forcefully deleted all running scripts. Please save and refresh page.");
          }}
          softReset={() => {
            dialogBoxCreate("Soft Reset!");
            prestigeAugmentation();
          }}
        />
      </Theme>,
      Engine.Display.content,
    );
  },

  // Helper function that hides all content
  hideAllContent: function () {
    Engine.Display.content.style.display = "none";
    Engine.Display.content.scrollTop = 0;
    ReactDOM.unmountComponentAtNode(Engine.Display.content);

    Engine.Display.infiltrationContent.style.display = "none";
    ReactDOM.unmountComponentAtNode(Engine.Display.infiltrationContent);

    Engine.Display.workInProgressContent.style.display = "none";
    Engine.Display.redPillContent.style.display = "none";
    Engine.Display.cinematicTextContent.style.display = "none";
    Engine.Display.missionContent.style.display = "none";
  },

  displayCharacterOverviewInfo: function () {
    ReactDOM.render(
      <Theme>
        <CharacterOverview player={Player} save={() => saveObject.saveGame(Engine.indexedDb)} />
      </Theme>,
      document.getElementById("character-overview"),
    );
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

    Terminal.process(Player, numCycles);

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

    if (Engine.Counters.checkFactionInvitations <= 0) {
      const invitedFactions = Player.checkForFactionInvitations();
      if (invitedFactions.length > 0) {
        const randFaction = invitedFactions[Math.floor(Math.random() * invitedFactions.length)];
        inviteToFaction(randFaction);
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

      // Start interactive tutorial
      iTutorialStart();
      removeLoadingScreen();
    }

    ReactDOM.render(<SidebarRoot engine={this} player={Player} />, document.getElementById("sidebar"));
  },

  setDisplayElements: function () {
    Engine.Display.content = document.getElementById("generic-react-container");
    Engine.Display.content.style.display = "none";

    Engine.Display.missionContent = document.getElementById("mission-container");
    Engine.Display.missionContent.style.display = "none";

    // Work In Progress
    Engine.Display.workInProgressContent = document.getElementById("work-in-progress-container");
    Engine.Display.workInProgressContent.style.display = "none";

    // Red Pill / Hack World Daemon
    Engine.Display.redPillContent = document.getElementById("red-pill-container");
    Engine.Display.redPillContent.style.display = "none";

    Engine.Display.infiltrationContent = document.getElementById("infiltration-container");
    Engine.Display.infiltrationContent.style.display = "none";

    // Cinematic Text
    Engine.Display.cinematicTextContent = document.getElementById("cinematic-text-container");
    Engine.Display.cinematicTextContent.style.display = "none";

    Engine.Display.overview = document.getElementById("character-overview");
  },

  // Initialization
  init: function () {
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

      Engine.displayCharacterOverviewInfo();
    } else {
      Engine.loadTerminalContent();
    }
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
