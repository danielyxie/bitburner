/**
 * Game engine. Handles the main game loop.
 */
import { convertTimeMsToTimeElapsedString } from "./utils/StringHelperFunctions";
import { Augmentations } from "./Augmentation/Augmentations";
import { initAugmentations } from "./Augmentation/AugmentationHelpers";
import { AugmentationNames } from "./Augmentation/data/AugmentationNames";
import { initBitNodeMultipliers } from "./BitNode/BitNode";
import { Bladeburner } from "./Bladeburner/Bladeburner";
import { generateRandomContract } from "./CodingContractGenerator";
import { initCompanies } from "./Company/Companies";
import { Corporation } from "./Corporation/Corporation";
import { CONSTANTS } from "./Constants";
import { Factions, initFactions } from "./Faction/Factions";
import { processPassiveFactionRepGain, inviteToFaction } from "./Faction/FactionHelpers";
import { Router } from "./ui/GameRoot";

import {
  getHackingWorkRepGain,
  getFactionSecurityWorkRepGain,
  getFactionFieldWorkRepGain,
} from "./PersonObjects/formulas/reputation";
import { hasHacknetServers, processHacknetEarnings } from "./Hacknet/HacknetHelpers";
import { iTutorialStart } from "./InteractiveTutorial";
import { checkForMessagesToSend, initMessages } from "./Message/MessageHelpers";
import { loadAllRunningScripts, updateOnlineScriptTimes } from "./NetscriptWorker";
import { Player } from "./Player";
import { saveObject, loadGame } from "./SaveObject";
import { initForeignServers } from "./Server/AllServers";
import { Settings } from "./Settings/Settings";
import { ThemeEvents } from "./ui/React/Theme";
import { updateSourceFileFlags } from "./SourceFile/SourceFileFlags";
import { initSpecialServerIps } from "./Server/SpecialServerIps";
import { initSymbolToStockMap, processStockPrices } from "./StockMarket/StockMarket";
import { Terminal } from "./Terminal";
import { Sleeve } from "./PersonObjects/Sleeve/Sleeve";
import { Locations } from "./Locations/Locations";
import { LocationName } from "./Locations/data/LocationNames";

import { Money } from "./ui/React/Money";
import { Hashes } from "./ui/React/Hashes";
import { Reputation } from "./ui/React/Reputation";

import { AlertEvents } from "./ui/React/AlertManager";
import { exceptionAlert } from "./utils/helpers/exceptionAlert";

import { startExploits } from "./Exploits/loops";

import React from "react";

const Engine: {
  _lastUpdate: number;
  updateGame: (numCycles?: number) => void;
  Counters: {
    [key: string]: number | undefined;
    autoSaveCounter: number;
    updateSkillLevelsCounter: number;
    updateDisplays: number;
    updateDisplaysLong: number;
    updateActiveScriptsDisplay: number;
    createProgramNotifications: number;
    augmentationsNotifications: number;
    checkFactionInvitations: number;
    passiveFactionGrowth: number;
    messages: number;
    mechanicProcess: number;
    contractGeneration: number;
  };
  decrementAllCounters: (numCycles?: number) => void;
  checkCounters: () => void;
  load: (saveString: string) => void;
  start: () => void;
} = {
  // Time variables (milliseconds unix epoch time)
  _lastUpdate: new Date().getTime(),

  updateGame: function (numCycles = 1) {
    const time = numCycles * CONSTANTS._idleSpeed;
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

    Terminal.process(Router, Player, numCycles);

    // Working
    if (Player.isWorking) {
      if (Player.workType == CONSTANTS.WorkTypeFaction) {
        if (Player.workForFaction(numCycles)) {
          Router.toFaction();
        }
      } else if (Player.workType == CONSTANTS.WorkTypeCreateProgram) {
        if (Player.createProgramWork(numCycles)) {
          Router.toTerminal();
        }
      } else if (Player.workType == CONSTANTS.WorkTypeStudyClass) {
        if (Player.takeClass(numCycles)) {
          Router.toCity();
        }
      } else if (Player.workType == CONSTANTS.WorkTypeCrime) {
        if (Player.commitCrime(numCycles)) {
          Router.toLocation(Locations[LocationName.Slums]);
        }
      } else if (Player.workType == CONSTANTS.WorkTypeCompanyPartTime) {
        if (Player.workPartTime(numCycles)) {
          Router.toCity();
        }
      } else {
        if (Player.work(numCycles)) {
          Router.toCity();
        }
      }
    }

    // Update stock prices
    if (Player.hasWseAccount) {
      processStockPrices(numCycles);
    }

    // Gang, if applicable
    if (Player.inGang() && Player.gang !== null) {
      Player.gang.process(numCycles, Player);
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
    for (const counterName in Engine.Counters) {
      const counter = Engine.Counters[counterName];
      if (counter === undefined) throw new Error("counter should not be undefined");
      Engine.Counters[counterName] = counter - numCycles;
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
        saveObject.saveGame();
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
      const adjustedCycles = Math.floor(5 - Engine.Counters.passiveFactionGrowth);
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
          Player.bladeburner.process(Router, Player);
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

  load: function (saveString) {
    startExploits();
    // Load game from save or create new game
    if (loadGame(saveString)) {
      ThemeEvents.emit();

      initBitNodeMultipliers(Player);
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
      const numCyclesOffline = Math.floor(timeOffline / CONSTANTS._idleSpeed);

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
      const offlineProductionFromHacknetNodes = processHacknetEarnings(Player, numCyclesOffline);
      const hacknetProdInfo = hasHacknetServers(Player) ? (
        <>
          <Hashes hashes={offlineProductionFromHacknetNodes} /> hashes
        </>
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
      const gang = Player.gang;
      if (Player.inGang() && gang !== null) {
        gang.process(numCyclesOffline, Player);
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
      const time = numCyclesOffline * CONSTANTS._idleSpeed;
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
      const timeOfflineString = convertTimeMsToTimeElapsedString(time);
      setTimeout(
        () =>
          AlertEvents.emit(
            <>
              Offline for {timeOfflineString}. While you were offline, your scripts generated{" "}
              <Money money={offlineHackingIncome} />, your Hacknet Nodes generated {hacknetProdInfo} and you gained{" "}
              <Reputation reputation={offlineReputation} /> reputation divided amongst your factions.
            </>,
          ),
        250,
      );
    } else {
      // No save found, start new game
      initBitNodeMultipliers(Player);
      initSpecialServerIps();
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
    }
  },

  start: function () {
    // Get time difference
    const _thisUpdate = new Date().getTime();
    let diff = _thisUpdate - Engine._lastUpdate;
    const offset = diff % CONSTANTS._idleSpeed;

    // Divide this by cycle time to determine how many cycles have elapsed since last update
    diff = Math.floor(diff / CONSTANTS._idleSpeed);

    if (diff > 0) {
      // Update the game engine by the calculated number of cycles
      Engine._lastUpdate = _thisUpdate - offset;
      Player.lastUpdate = _thisUpdate - offset;
      Engine.updateGame(diff);
    }

    window.requestAnimationFrame(Engine.start);
  },
};

export { Engine };
