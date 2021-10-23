import { Augmentations } from "./Augmentation/Augmentations";
import { augmentationExists, initAugmentations } from "./Augmentation/AugmentationHelpers";
import { AugmentationNames } from "./Augmentation/data/AugmentationNames";
import { initBitNodeMultipliers } from "./BitNode/BitNode";
import { Bladeburner } from "./Bladeburner/Bladeburner";
import { Companies, initCompanies } from "./Company/Companies";
import { resetIndustryResearchTrees } from "./Corporation/IndustryData";
import { Programs } from "./Programs/Programs";
import { Faction } from "./Faction/Faction";
import { Factions, initFactions } from "./Faction/Factions";
import { joinFaction } from "./Faction/FactionHelpers";
import { updateHashManagerCapacity } from "./Hacknet/HacknetHelpers";
import { initMessages } from "./Message/MessageHelpers";
import { prestigeWorkerScripts } from "./NetscriptWorker";
import { Player } from "./Player";
import { Router } from "./ui/GameRoot";
import { resetPidCounter } from "./Netscript/Pid";
import { LiteratureNames } from "./Literature/data/LiteratureNames";

import { GetServer, AddToAllServers, initForeignServers, prestigeAllServers } from "./Server/AllServers";
import { prestigeHomeComputer } from "./Server/ServerHelpers";
import { SourceFileFlags, updateSourceFileFlags } from "./SourceFile/SourceFileFlags";
import { SpecialServers } from "./Server/data/SpecialServers";
import { deleteStockMarket, initStockMarket, initSymbolToStockMap } from "./StockMarket/StockMarket";
import { Terminal } from "./Terminal";

import { dialogBoxCreate } from "./ui/React/DialogBox";

import Decimal from "decimal.js";
import { ProgramsSeen } from "./Programs/ui/ProgramsRoot";
import { InvitationsSeen } from "./Faction/ui/FactionsRoot";

const BitNode8StartingMoney = 250e6;

// Prestige by purchasing augmentation
export function prestigeAugmentation(): void {
  initBitNodeMultipliers(Player);

  const maintainMembership = Player.factions.filter(function (faction) {
    return Factions[faction].getInfo().keep;
  });
  Player.prestigeAugmentation();

  // Delete all Worker Scripts objects
  prestigeWorkerScripts();

  const homeComp = Player.getHomeComputer();
  // Delete all servers except home computer
  prestigeAllServers();

  // Reset home computer (only the programs) and add to AllServers
  AddToAllServers(homeComp);
  prestigeHomeComputer(homeComp);

  if (augmentationExists(AugmentationNames.Neurolink) && Augmentations[AugmentationNames.Neurolink].owned) {
    homeComp.programs.push(Programs.FTPCrackProgram.name);
    homeComp.programs.push(Programs.RelaySMTPProgram.name);
  }
  if (augmentationExists(AugmentationNames.CashRoot) && Augmentations[AugmentationNames.CashRoot].owned) {
    Player.setMoney(1e6);
    homeComp.programs.push(Programs.BruteSSHProgram.name);
  }
  if (augmentationExists(AugmentationNames.PCMatrix) && Augmentations[AugmentationNames.PCMatrix].owned) {
    homeComp.programs.push(Programs.DeepscanV1.name);
    homeComp.programs.push(Programs.AutoLink.name);
  }

  // Re-create foreign servers
  initForeignServers(Player.getHomeComputer());

  // Gain favor for Companies
  for (const member in Companies) {
    if (Companies.hasOwnProperty(member)) {
      Companies[member].gainFavor();
    }
  }

  // Gain favor for factions
  for (const member in Factions) {
    if (Factions.hasOwnProperty(member)) {
      Factions[member].gainFavor();
    }
  }

  // Stop a Terminal action if there is onerror
  if (Terminal.action !== null) {
    Terminal.finishAction(Router, Player, true);
  }
  Terminal.clear();

  // Re-initialize things - This will update any changes
  initFactions(); // Factions must be initialized before augmentations

  Player.factions = Player.factions.concat(maintainMembership);
  Player.factions.map((f) => (Factions[f].isMember = true));
  initAugmentations(); // Calls reapplyAllAugmentations() and resets Player multipliers
  Player.reapplyAllSourceFiles();
  initCompanies();

  // Messages
  initMessages();

  // Gang
  const gang = Player.gang;
  if (Player.inGang() && gang !== null) {
    const faction = Factions[gang.facName];
    if (faction instanceof Faction) {
      joinFaction(faction);
    }
  }

  // Cancel Bladeburner action
  if (Player.bladeburner instanceof Bladeburner) {
    Player.bladeburner.prestige();
  }

  // BitNode 8: Ghost of Wall Street
  if (Player.bitNodeN === 8) {
    Player.money = new Decimal(BitNode8StartingMoney);
  }
  if (Player.bitNodeN === 8 || SourceFileFlags[8] > 0) {
    Player.hasWseAccount = true;
    Player.hasTixApiAccess = true;
  }

  // Reset Stock market
  if (Player.hasWseAccount) {
    initStockMarket();
    initSymbolToStockMap();
  }

  // Red Pill
  if (augmentationExists(AugmentationNames.TheRedPill) && Augmentations[AugmentationNames.TheRedPill].owned) {
    const WorldDaemon = GetServer(SpecialServers.WorldDaemon);
    const DaedalusServer = GetServer(SpecialServers.DaedalusServer);
    if (WorldDaemon && DaedalusServer) {
      WorldDaemon.serversOnNetwork.push(DaedalusServer.hostname);
      DaedalusServer.serversOnNetwork.push(WorldDaemon.hostname);
    }
  }

  resetPidCounter();
  ProgramsSeen.splice(0, ProgramsSeen.length);
  InvitationsSeen.splice(0, InvitationsSeen.length);
}

// Prestige by destroying Bit Node and gaining a Source File
export function prestigeSourceFile(flume: boolean): void {
  initBitNodeMultipliers(Player);
  updateSourceFileFlags(Player);

  Player.prestigeSourceFile();
  prestigeWorkerScripts(); // Delete all Worker Scripts objects

  const homeComp = Player.getHomeComputer();

  // Delete all servers except home computer
  prestigeAllServers(); // Must be done before initForeignServers()

  // Reset home computer (only the programs) and add to AllServers
  AddToAllServers(homeComp);
  prestigeHomeComputer(homeComp);

  // Re-create foreign servers
  initForeignServers(Player.getHomeComputer());

  if (SourceFileFlags[9] >= 2) {
    homeComp.setMaxRam(128);
  } else if (SourceFileFlags[1] > 0) {
    homeComp.setMaxRam(32);
  } else {
    homeComp.setMaxRam(8);
  }
  homeComp.cpuCores = 1;

  // Reset favor for Companies
  for (const member in Companies) {
    if (Companies.hasOwnProperty(member)) {
      Companies[member].favor = 0;
    }
  }

  // Reset favor for factions
  for (const member in Factions) {
    if (Factions.hasOwnProperty(member)) {
      Factions[member].favor = 0;
    }
  }

  // Stop a Terminal action if there is one
  if (Terminal.action !== null) {
    Terminal.finishAction(Router, Player, true);
  }

  // Delete all Augmentations
  for (const name in Augmentations) {
    if (Augmentations.hasOwnProperty(name)) {
      delete Augmentations[name];
    }
  }

  // Give levels of NeuroFluxGoverner for Source-File 12. Must be done here before Augmentations are recalculated
  if (SourceFileFlags[12] > 0) {
    Player.augmentations.push({
      name: AugmentationNames.NeuroFluxGovernor,
      level: SourceFileFlags[12],
    });
  }

  // Re-initialize things - This will update any changes
  initFactions(); // Factions must be initialized before augmentations
  initAugmentations(); // Calls reapplyAllAugmentations() and resets Player multipliers
  Player.reapplyAllSourceFiles();
  initCompanies();

  // Messages
  initMessages();

  // BitNode 3: Corporatocracy
  if (Player.bitNodeN === 3) {
    homeComp.messages.push(LiteratureNames.CorporationManagementHandbook);
    dialogBoxCreate(
      "You received a copy of the Corporation Management Handbook on your home computer. " +
        "Read it if you need help getting started with Corporations!",
    );
  }

  // BitNode 8: Ghost of Wall Street
  if (Player.bitNodeN === 8) {
    Player.money = new Decimal(BitNode8StartingMoney);
  }
  if (Player.bitNodeN === 8 || SourceFileFlags[8] > 0) {
    Player.hasWseAccount = true;
    Player.hasTixApiAccess = true;
  }

  // Bit Node 10: Digital Carbon
  if (Player.bitNodeN === 10) {
    dialogBoxCreate("Visit VitaLife in New Tokyo if you'd like to purchase a new sleeve!");
  }

  // Reset Stock market, gang, and corporation
  if (Player.hasWseAccount) {
    initStockMarket();
    initSymbolToStockMap();
  } else {
    deleteStockMarket();
  }

  Player.gang = null;
  Player.corporation = null;
  resetIndustryResearchTrees();
  Player.bladeburner = null;

  // Source-File 9 (level 3) effect
  if (SourceFileFlags[9] >= 3) {
    const hserver = Player.createHacknetServer();

    hserver.level = 100;
    hserver.cores = 10;
    hserver.cache = 5;
    hserver.updateHashRate(Player.hacknet_node_money_mult);
    hserver.updateHashCapacity();
    updateHashManagerCapacity(Player);
  }

  // Gain int exp
  if (SourceFileFlags[5] !== 0 && !flume) Player.gainIntelligenceExp(300);

  resetPidCounter();
}
