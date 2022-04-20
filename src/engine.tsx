/**
 * Game engine. Handles the main game loop.
 */
import { convertTimeMsToTimeElapsedString } from "./utils/StringHelperFunctions";
import { initAugmentations } from "./Augmentation/AugmentationHelpers";
import { AugmentationNames } from "./Augmentation/data/AugmentationNames";
import { initBitNodeMultipliers } from "./BitNode/BitNode";
import { Bladeburner } from "./Bladeburner/Bladeburner";
import { generateRandomContract } from "./CodingContractGenerator";
import { initCompanies } from "./Company/Companies";
import { Corporation } from "./Corporation/Corporation";
import { CONSTANTS } from "./Constants";
import { Factions, initFactions } from "./Faction/Factions";
import { staneksGift } from "./CotMG/Helper";
import { processPassiveFactionRepGain, inviteToFaction } from "./Faction/FactionHelpers";
import { Router } from "./ui/GameRoot";
import { Page } from "./ui/Router";
import { SetupTextEditor } from "./ScriptEditor/ui/ScriptEditorRoot";

import {
  getHackingWorkRepGain,
  getFactionSecurityWorkRepGain,
  getFactionFieldWorkRepGain,
} from "./PersonObjects/formulas/reputation";
import { hasHacknetServers, processHacknetEarnings } from "./Hacknet/HacknetHelpers";
import { iTutorialStart } from "./InteractiveTutorial";
import { checkForMessagesToSend } from "./Message/MessageHelpers";
import { loadAllRunningScripts, updateOnlineScriptTimes } from "./NetscriptWorker";
import { Player } from "./Player";
import { saveObject, loadGame } from "./SaveObject";
import { initForeignServers } from "./Server/AllServers";
import { Settings } from "./Settings/Settings";
import { ThemeEvents } from "./Themes/ui/Theme";
import { initSymbolToStockMap, processStockPrices } from "./StockMarket/StockMarket";
import { Terminal } from "./Terminal";
import { Sleeve } from "./PersonObjects/Sleeve/Sleeve";

import { Money } from "./ui/React/Money";
import { Hashes } from "./ui/React/Hashes";
import { Reputation } from "./ui/React/Reputation";

import { AlertEvents } from "./ui/React/AlertManager";
import { exceptionAlert } from "./utils/helpers/exceptionAlert";

import { startExploits } from "./Exploits/loops";
import { calculateAchievements } from "./Achievements/Achievements";

import React from "react";
import { setupUncaughtPromiseHandler } from "./UncaughtPromiseHandler";
import { Button, Typography } from "@mui/material";
import { SnackbarEvents, ToastVariant } from "./ui/React/Snackbar";

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
    achievementsCounter: number;
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

    Player.process(Router, numCycles);

    // Update stock prices
    if (Player.hasWseAccount) {
      processStockPrices(numCycles);
    }

    // Gang, if applicable
    if (Player.inGang() && Player.gang !== null) {
      Player.gang.process(numCycles, Player);
    }

    // Staneks gift
    staneksGift.process(Player, numCycles);

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
    achievementsCounter: 60, // Check if we have new achievements
  },

  decrementAllCounters: function (numCycles = 1) {
    for (const counterName of Object.keys(Engine.Counters)) {
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
        warnAutosaveDisabled();
        Engine.Counters.autoSaveCounter = 60 * 5; // Let's check back in a bit
      } else {
        Engine.Counters.autoSaveCounter = Settings.AutosaveInterval * 5;
        saveObject.saveGame(!Settings.SuppressSavedGameToast);
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
      if (Player.hasAugmentation(AugmentationNames.TheRedPill)) {
        Engine.Counters.messages = 4500; // 15 minutes for Red pill message
      } else {
        Engine.Counters.messages = 150;
      }
    }
    if (Player.corporation instanceof Corporation) {
      Player.corporation.process(Player);
    }
    if (Engine.Counters.mechanicProcess <= 0) {
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

    if (Engine.Counters.achievementsCounter <= 0) {
      calculateAchievements();
      Engine.Counters.achievementsCounter = 300;
    }
  },

  load: function (saveString) {
    startExploits();
    setupUncaughtPromiseHandler();
    // Load game from save or create new game
    if (loadGame(saveString)) {
      ThemeEvents.emit();

      initBitNodeMultipliers(Player);
      initAugmentations(); // Also calls Player.reapplyAllAugmentations()
      Player.reapplyAllSourceFiles();
      if (Player.hasWseAccount) {
        initSymbolToStockMap();
      }

      // Apply penalty for entropy accumulation
      Player.applyEntropy(Player.entropy);

      // Calculate the number of cycles have elapsed while offline
      Engine._lastUpdate = new Date().getTime();
      const lastUpdate = Player.lastUpdate;
      const timeOffline = Engine._lastUpdate - lastUpdate;
      const numCyclesOffline = Math.floor(timeOffline / CONSTANTS._idleSpeed);

      // Generate coding contracts
      // let numContracts = 0;
      // if (numCyclesOffline < 3000 * 100) {
      //   // if we have less than 100 rolls, just roll them exactly.
      //   for (let i = 0; i < numCyclesOffline / 3000; i++) {
      //     if (Math.random() < 0.25) numContracts++;
      //   }
      // } else {
      //   // just average it.
      //   numContracts = (numCyclesOffline / 3000) * 0.25;
      // }
      // console.log(`${numCyclesOffline} ${numContracts}`);
      // for (let i = 0; i < numContracts; i++) {
      //   generateRandomContract();
      // }

      let offlineReputation = 0;
      const offlineHackingIncome = (Player.moneySourceA.hacking / Player.playtimeSinceLastAug) * timeOffline * 0.75;
      Player.gainMoney(offlineHackingIncome, "hacking");
      // Process offline progress
      loadAllRunningScripts(Player); // This also takes care of offline production for those scripts
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
        } else if (Player.workType === CONSTANTS.WorkTypeGraftAugmentation) {
          Player.graftAugmentationWork(numCyclesOffline);
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

      staneksGift.process(Player, numCyclesOffline);

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
              <Typography>Offline for {timeOfflineString}. While you were offline:</Typography>
              <ul>
                <li>
                  <Typography>
                    Your scripts generated <Money money={offlineHackingIncome} />
                  </Typography>
                </li>
                <li>
                  <Typography>Your Hacknet Nodes generated {hacknetProdInfo}</Typography>
                </li>
                <li>
                  <Typography>
                    You gained <Reputation reputation={offlineReputation} /> reputation divided amongst your factions
                  </Typography>
                </li>
              </ul>
            </>,
          ),
        250,
      );
    } else {
      // No save found, start new game
      initBitNodeMultipliers(Player);
      Engine.start(); // Run main game loop and Scripts loop
      Player.init();
      initForeignServers(Player.getHomeComputer());
      initCompanies();
      initFactions();
      initAugmentations();

      // Start interactive tutorial
      iTutorialStart();
    }
    SetupTextEditor();
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

/**
 * Shows a toast warning that lets the player know that auto-saves are disabled, with an button to re-enable them.
 */
function warnAutosaveDisabled(): void {
  // If the player has suppressed those warnings let's just exit right away.
  if (Settings.SuppressAutosaveDisabledWarnings) return;

  // We don't want this warning to show up on certain pages.
  // When in recovery or importing we want to keep autosave disabled.
  const ignoredPages = [Page.Recovery, Page.ImportSave];
  if (ignoredPages.includes(Router.page())) return;

  const warningToast = (
    <>
      Auto-saves are <strong>disabled</strong>!
      <Button
        sx={{ ml: 1 }}
        color="warning"
        size="small"
        onClick={() => {
          // We reset the value to a default
          Settings.AutosaveInterval = 60;
        }}
      >
        Enable
      </Button>
    </>
  );
  SnackbarEvents.emit(warningToast, ToastVariant.WARNING, 5000);
}

export { Engine };
