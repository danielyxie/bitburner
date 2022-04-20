import { FactionNames } from "./Faction/data/FactionNames";
import { CityName } from "./Locations/data/CityNames";
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
import { prestigeWorkerScripts } from "./NetscriptWorker";
import { Player } from "./Player";
import { Router } from "./ui/GameRoot";
import { resetPidCounter } from "./Netscript/Pid";
import { LiteratureNames } from "./Literature/data/LiteratureNames";

import { GetServer, AddToAllServers, initForeignServers, prestigeAllServers } from "./Server/AllServers";
import { prestigeHomeComputer } from "./Server/ServerHelpers";
import { SpecialServers } from "./Server/data/SpecialServers";
import { deleteStockMarket, initStockMarket, initSymbolToStockMap } from "./StockMarket/StockMarket";
import { Terminal } from "./Terminal";

import { dialogBoxCreate } from "./ui/React/DialogBox";

import { staneksGift } from "./CotMG/Helper";
import { ProgramsSeen } from "./Programs/ui/ProgramsRoot";
import { InvitationsSeen } from "./Faction/ui/FactionsRoot";
import { CONSTANTS } from "./Constants";
import { LogBoxClearEvents } from "./ui/React/LogBoxManager";

const BitNode8StartingMoney = 250e6;

// Prestige by purchasing augmentation
export function prestigeAugmentation(): void {
  initBitNodeMultipliers(Player);

  const maintainMembership = Player.factions.concat(Player.factionInvitations).filter(function (faction) {
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
  prestigeHomeComputer(Player, homeComp);

  if (augmentationExists(AugmentationNames.Neurolink) && Player.hasAugmentation(AugmentationNames.Neurolink)) {
    homeComp.programs.push(Programs.FTPCrackProgram.name);
    homeComp.programs.push(Programs.RelaySMTPProgram.name);
  }
  if (augmentationExists(AugmentationNames.CashRoot) && Player.hasAugmentation(AugmentationNames.CashRoot)) {
    Player.setMoney(1e6);
    homeComp.programs.push(Programs.BruteSSHProgram.name);
  }
  if (augmentationExists(AugmentationNames.PCMatrix) && Player.hasAugmentation(AugmentationNames.PCMatrix)) {
    homeComp.programs.push(Programs.DeepscanV1.name);
    homeComp.programs.push(Programs.AutoLink.name);
  }

  if (Player.sourceFileLvl(5) > 0 || Player.bitNodeN === 5) {
    homeComp.programs.push(Programs.Formulas.name);
  }

  // Re-create foreign servers
  initForeignServers(Player.getHomeComputer());

  // Gain favor for Companies
  for (const member of Object.keys(Companies)) {
    if (Companies.hasOwnProperty(member)) {
      Companies[member].gainFavor();
    }
  }

  // Gain favor for factions
  for (const member of Object.keys(Factions)) {
    if (Factions.hasOwnProperty(member)) {
      Factions[member].gainFavor();
    }
  }

  // Stop a Terminal action if there is one.
  if (Terminal.action !== null) {
    Terminal.finishAction(Router, Player, true);
  }
  Terminal.clear();
  LogBoxClearEvents.emit();

  // Re-initialize things - This will update any changes
  initFactions(); // Factions must be initialized before augmentations

  Player.factionInvitations = Player.factionInvitations.concat(maintainMembership);
  initAugmentations(); // Calls reapplyAllAugmentations() and resets Player multipliers
  Player.reapplyAllSourceFiles();
  initCompanies();

  // Apply entropy from grafting
  Player.applyEntropy(Player.entropy);

  // Gang
  const gang = Player.gang;
  if (Player.inGang() && gang !== null) {
    const faction = Factions[gang.facName];
    if (faction instanceof Faction) {
      joinFaction(faction);
    }
    const penalty = 0.95;
    for (const m of gang.members) {
      m.hack_asc_points *= penalty;
      m.str_asc_points *= penalty;
      m.def_asc_points *= penalty;
      m.dex_asc_points *= penalty;
      m.agi_asc_points *= penalty;
      m.cha_asc_points *= penalty;
    }
  }

  // BitNode 3: Corporatocracy
  if (Player.bitNodeN === 3) {
    homeComp.messages.push(LiteratureNames.CorporationManagementHandbook);
  }

  // Cancel Bladeburner action
  if (Player.bladeburner instanceof Bladeburner) {
    Player.bladeburner.prestige();
  }

  // BitNode 8: Ghost of Wall Street
  if (Player.bitNodeN === 8) {
    Player.money = BitNode8StartingMoney;
  }
  if (Player.bitNodeN === 8 || Player.sourceFileLvl(8) > 0) {
    Player.hasWseAccount = true;
    Player.hasTixApiAccess = true;
  }

  // Reset Stock market
  if (Player.hasWseAccount) {
    initStockMarket();
    initSymbolToStockMap();
  }

  // Red Pill
  if (augmentationExists(AugmentationNames.TheRedPill) && Player.hasAugmentation(AugmentationNames.TheRedPill)) {
    const WorldDaemon = GetServer(SpecialServers.WorldDaemon);
    const DaedalusServer = GetServer(SpecialServers.DaedalusServer);
    if (WorldDaemon && DaedalusServer) {
      WorldDaemon.serversOnNetwork.push(DaedalusServer.hostname);
      DaedalusServer.serversOnNetwork.push(WorldDaemon.hostname);
    }
  }

  if (augmentationExists(AugmentationNames.StaneksGift1) && Player.hasAugmentation(AugmentationNames.StaneksGift1)) {
    joinFaction(Factions[FactionNames.ChurchOfTheMachineGod]);
  }

  staneksGift.prestigeAugmentation();

  resetPidCounter();
  ProgramsSeen.splice(0, ProgramsSeen.length);
  InvitationsSeen.splice(0, InvitationsSeen.length);
}

// Prestige by destroying Bit Node and gaining a Source File
export function prestigeSourceFile(flume: boolean): void {
  initBitNodeMultipliers(Player);

  Player.prestigeSourceFile();
  prestigeWorkerScripts(); // Delete all Worker Scripts objects

  const homeComp = Player.getHomeComputer();

  // Stop a Terminal action if there is one.
  if (Terminal.action !== null) {
    Terminal.finishAction(Router, Player, true);
  }
  Terminal.clear();
  LogBoxClearEvents.emit();

  // Delete all servers except home computer
  prestigeAllServers(); // Must be done before initForeignServers()

  // Reset home computer (only the programs) and add to AllServers
  AddToAllServers(homeComp);
  prestigeHomeComputer(Player, homeComp);

  // Re-create foreign servers
  initForeignServers(Player.getHomeComputer());

  if (Player.sourceFileLvl(9) >= 2) {
    homeComp.setMaxRam(128);
  } else if (Player.sourceFileLvl(1) > 0) {
    homeComp.setMaxRam(32);
  } else {
    homeComp.setMaxRam(8);
  }
  homeComp.cpuCores = 1;

  // Reset favor for Companies
  for (const member of Object.keys(Companies)) {
    if (Companies.hasOwnProperty(member)) {
      Companies[member].favor = 0;
    }
  }

  // Reset favor for factions
  for (const member of Object.keys(Factions)) {
    if (Factions.hasOwnProperty(member)) {
      Factions[member].favor = 0;
    }
  }

  // Stop a Terminal action if there is one
  if (Terminal.action !== null) {
    Terminal.finishAction(Router, Player, true);
  }

  // Delete all Augmentations
  for (const name of Object.keys(Augmentations)) {
    if (Augmentations.hasOwnProperty(name)) {
      delete Augmentations[name];
    }
  }

  // Give levels of NeuroFluxGoverner for Source-File 12. Must be done here before Augmentations are recalculated
  if (Player.sourceFileLvl(12) > 0) {
    Player.augmentations.push({
      name: AugmentationNames.NeuroFluxGovernor,
      level: Player.sourceFileLvl(12),
    });
  }

  // Re-initialize things - This will update any changes
  initFactions(); // Factions must be initialized before augmentations
  initAugmentations(); // Calls reapplyAllAugmentations() and resets Player multipliers
  Player.reapplyAllSourceFiles();
  initCompanies();

  if (Player.sourceFileLvl(5) > 0 || Player.bitNodeN === 5) {
    homeComp.programs.push(Programs.Formulas.name);
  }

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
    Player.money = BitNode8StartingMoney;
  }
  if (Player.bitNodeN === 8 || Player.sourceFileLvl(8) > 0) {
    Player.hasWseAccount = true;
    Player.hasTixApiAccess = true;
  }

  // Bit Node 10: Digital Carbon
  if (Player.bitNodeN === 10) {
    dialogBoxCreate("Visit VitaLife in New Tokyo if you'd like to purchase a new sleeve!");
  }

  if (Player.bitNodeN === 13) {
    dialogBoxCreate(`Trouble is brewing in ${CityName.Chongqing}`);
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
  if (Player.sourceFileLvl(9) >= 3) {
    const hserver = Player.createHacknetServer();

    hserver.level = 100;
    hserver.cores = 10;
    hserver.cache = 5;
    hserver.updateHashRate(Player.hacknet_node_money_mult);
    hserver.updateHashCapacity();
    updateHashManagerCapacity(Player);
  }

  if (Player.bitNodeN === 13) {
    Player.money = CONSTANTS.TravelCost;
  }
  staneksGift.prestigeSourceFile();

  // Gain int exp
  if (Player.sourceFileLvl(5) !== 0 && !flume) Player.gainIntelligenceExp(300);

  resetPidCounter();
}
