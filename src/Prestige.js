import { Augmentations } from "./Augmentation/Augmentations";
import {
    augmentationExists,
    initAugmentations
} from "./Augmentation/AugmentationHelpers";
import { AugmentationNames } from "./Augmentation/data/AugmentationNames";
import { initBitNodeMultipliers } from "./BitNode/BitNode";
import { Bladeburner } from "./Bladeburner";
import { writeCinematicText } from "./CinematicText";
import { Companies, initCompanies } from "./Company/Companies";
import { resetIndustryResearchTrees } from "./Corporation/IndustryData";
import { Programs } from "./Programs/Programs";
import { Engine } from "./engine";
import { Faction } from "./Faction/Faction";
import { Factions, initFactions } from "./Faction/Factions";
import { joinFaction } from "./Faction/FactionHelpers";
import { deleteGangDisplayContent } from "./Gang";
import { updateHashManagerCapacity } from "./Hacknet/HacknetHelpers";
import { Message } from "./Message/Message";
import { initMessages, Messages } from "./Message/MessageHelpers";
import { prestigeWorkerScripts } from "./NetscriptWorker";
import { Player } from "./Player";
import { resetPidCounter } from "./Netscript/Pid";

import {
    AllServers,
    AddToAllServers,
    initForeignServers,
    prestigeAllServers
} from "./Server/AllServers";
import { Server } from "./Server/Server";
import { prestigeHomeComputer } from "./Server/ServerHelpers";
import {
    SourceFileFlags,
    updateSourceFileFlags
} from "./SourceFile/SourceFileFlags";
import {
    SpecialServerIps,
    SpecialServerIpsMap,
    prestigeSpecialServerIps,
    SpecialServerNames
} from "./Server/SpecialServerIps";
import {
    deleteStockMarket,
    initStockMarket,
    initSymbolToStockMap,
} from "./StockMarket/StockMarket";
import { Terminal, postNetburnerText } from "./Terminal";

import { Page, routing } from "./ui/navigationTracking";

import { dialogBoxCreate } from "../utils/DialogBox";
import { exceptionAlert } from "../utils/helpers/exceptionAlert";
import { removeElementById } from "../utils/uiHelpers/removeElementById";
import { createElement } from "../utils/uiHelpers/createElement";
import { createPopup } from "../utils/uiHelpers/createPopup";

import Decimal from "decimal.js";

const BitNode8StartingMoney = 250e6;

// Prestige by purchasing augmentation
function prestigeAugmentation() {
    // Set Navigation to Terminal screen, for any logic that depends on it
    routing.navigateTo(Page.Terminal);

    initBitNodeMultipliers(Player);

    Player.prestigeAugmentation();

    // Now actually go to the Terminal Screen (and reset it)
    var mainMenu = document.getElementById("mainmenu-container");
    mainMenu.style.visibility = "visible";
    Terminal.resetTerminalInput();
    Engine.loadTerminalContent();
    $("#terminal tr:not(:last)").remove();
    postNetburnerText();

    // Delete all Worker Scripts objects
    prestigeWorkerScripts();

    var homeComp = Player.getHomeComputer();
    // Delete all servers except home computer
    prestigeAllServers();

    // Delete Special Server IPs
    prestigeSpecialServerIps(); // Must be done before initForeignServers()

    // Reset home computer (only the programs) and add to AllServers
    AddToAllServers(homeComp);
    prestigeHomeComputer(homeComp);

    if (augmentationExists(AugmentationNames.Neurolink) &&
        Augmentations[AugmentationNames.Neurolink].owned) {
        homeComp.programs.push(Programs.FTPCrackProgram.name);
        homeComp.programs.push(Programs.RelaySMTPProgram.name);
    }
    if (augmentationExists(AugmentationNames.CashRoot) &&
        Augmentations[AugmentationNames.CashRoot].owned) {
        Player.setMoney(1e6);
        homeComp.programs.push(Programs.BruteSSHProgram.name);
    }

    // Re-create foreign servers
    initForeignServers(Player.getHomeComputer());

    // Gain favor for Companies
    for (var member in Companies) {
        if (Companies.hasOwnProperty(member)) {
            Companies[member].gainFavor();
        }
    }

    // Gain favor for factions
    for (var member in Factions) {
        if (Factions.hasOwnProperty(member)) {
            Factions[member].gainFavor();
        }
    }

    // Stop a Terminal action if there is onerror
    if (Engine._actionInProgress) {
        Engine._actionInProgress = false;
        Terminal.finishAction(true);
    }

    // Re-initialize things - This will update any changes
    initFactions(); // Factions must be initialized before augmentations
    initAugmentations(); // Calls reapplyAllAugmentations() and resets Player multipliers
    Player.reapplyAllSourceFiles();
    initCompanies();

    // Messages
    initMessages();

    // Gang
    if (Player.inGang()) {
        const faction = Factions[Player.gang.facName];
        if (faction instanceof Faction) {
            joinFaction(faction);
        }
    }

    // Cancel Bladeburner action
    if (Player.bladeburner instanceof Bladeburner) {
        Player.bladeburner.prestige();
    }

    // BitNode 8: Ghost of Wall Street
    if (Player.bitNodeN === 8) {Player.money = new Decimal(BitNode8StartingMoney);}
    if (Player.bitNodeN === 8 || SourceFileFlags[8] > 0) {
        Player.hasWseAccount = true;
        Player.hasTixApiAccess = true;
    }

    // Reset Stock market
    if (Player.hasWseAccount) {
        initStockMarket();
        initSymbolToStockMap();
    }

    // Refresh Main Menu (the 'World' menu, specifically)
    document.getElementById("world-menu-header").click();
    document.getElementById("world-menu-header").click();

    // Red Pill
    if (augmentationExists(AugmentationNames.TheRedPill) &&
        Augmentations[AugmentationNames.TheRedPill].owned) {
        var WorldDaemon = AllServers[SpecialServerIps[SpecialServerNames.WorldDaemon]];
        var DaedalusServer = AllServers[SpecialServerIps[SpecialServerNames.DaedalusServer]];
        if (WorldDaemon && DaedalusServer) {
            WorldDaemon.serversOnNetwork.push(DaedalusServer.ip);
            DaedalusServer.serversOnNetwork.push(WorldDaemon.ip);
        }
    }

    resetPidCounter();
}


// Prestige by destroying Bit Node and gaining a Source File
function prestigeSourceFile() {
    initBitNodeMultipliers(Player);
    updateSourceFileFlags(Player);

    Player.prestigeSourceFile();
    prestigeWorkerScripts(); // Delete all Worker Scripts objects

    var homeComp = Player.getHomeComputer();

    // Delete all servers except home computer
    prestigeAllServers(); // Must be done before initForeignServers()

    // Delete Special Server IPs
    prestigeSpecialServerIps();

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
    for (var member in Companies) {
        if (Companies.hasOwnProperty(member)) {
            Companies[member].favor = 0;
        }
    }

    // Reset favor for factions
    for (var member in Factions) {
        if (Factions.hasOwnProperty(member)) {
            Factions[member].favor = 0;
        }
    }

    // Stop a Terminal action if there is one
    if (Engine._actionInProgress) {
        Engine._actionInProgress = false;
        Terminal.finishAction(true);
    }

    // Delete all Augmentations
    for (var name in Augmentations) {
        if (Augmentations.hasOwnProperty(name)) {
            delete Augmentations[name];
        }
    }

    // Re-initialize things - This will update any changes
    initFactions(); // Factions must be initialized before augmentations
    initAugmentations();    // Calls reapplyAllAugmentations() and resets Player multipliers
    Player.reapplyAllSourceFiles();
    initCompanies();

    // Clear terminal
    $("#terminal tr:not(:last)").remove();
    postNetburnerText();

    // Messages
    initMessages();

    var mainMenu = document.getElementById("mainmenu-container");
    mainMenu.style.visibility = "visible";
    Terminal.resetTerminalInput();
    Engine.loadTerminalContent();

    // BitNode 3: Corporatocracy
    if (Player.bitNodeN === 3) {
        homeComp.messages.push("corporation-management-handbook.lit");
        dialogBoxCreate("You received a copy of the Corporation Management Handbook on your home computer. " +
                        "Read it if you need help getting started with Corporations!");
    }

    // BitNode 6: Bladeburner
    if (Player.bitNodeN === 6) {
        var cinematicText = ["In the middle of the 21st century, OmniTek Incorporated advanced robot evolution " +
                             "with their Synthoids (synthetic androids), a being virtually identical to a human.",
                             "------",
                             "Their sixth-generation Synthoids, called MK-VI, were stronger, faster, and more " +
                             "intelligent than humans. Many argued that the MK-VI Synthoids were the first " +
                             "example of sentient AI.",
                             "------",
                             "Unfortunately, in 2070 a terrorist group called Ascendis Totalis hacked into OmniTek and " +
                             "uploaded a rogue AI into their Synthoid manufacturing facilities.",
                             "------",
                             "The MK-VI Synthoids infected by the rogue AI turned hostile toward humanity, initiating " +
                             "the deadliest conflict in human history. This dark chapter is now known as the Synthoid Uprising.",
                             "------",
                             "In the aftermath of the Uprising, further manufacturing of Synthoids with advanced AI " +
                             "was banned. MK-VI Synthoids that did not have the rogue Ascendis Totalis AI were " +
                             "allowed to continue their existence.",
                             "------",
                             "The intelligence community believes that not all of the rogue MK-VI Synthoids from the Uprising were " +
                             "found and destroyed, and that many of them are blending in as normal humans in society today. " +
                             "As a result, many nations have created Bladeburner divisions, special units that are tasked with " +
                             "investigating and dealing with Synthoid threats."];
        writeCinematicText(cinematicText).then(function() {
            var popupId = "bladeburner-bitnode-start-nsa-notification";
            var txt = createElement("p", {
                innerText:"Visit the National Security Agency (NSA) to apply for their Bladeburner " +
                          "division! You will need 100 of each combat stat before doing this."
            })
            var brEl = createElement("br");
            var okBtn = createElement("a", {
                class:"a-link-button", innerText:"Got it!", padding:"8px",
                clickListener:()=>{
                    removeElementById(popupId);
                    return false;
                }
            });
            createPopup(popupId, [txt, brEl, okBtn]);
        }).catch(function(e) {
            exceptionAlert(e);
        })

    }

    // BitNode 8: Ghost of Wall Street
    if (Player.bitNodeN === 8) {Player.money = new Decimal(BitNode8StartingMoney);}
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

    if (Player.inGang()) { Player.gang.clearUI(); }
    Player.gang = null;
    Player.corporation = null; resetIndustryResearchTrees();
    Player.bladeburner = null;

    // Source-File 9 (level 3) effect
    if (SourceFileFlags[9] >= 3) {
        const hserver = Player.createHacknetServer();

        hserver.level = 100;
        hserver.cores = 10;
        hserver.cache = 5;
        hserver.updateHashRate(Player.hacknet_node_money_mult);
        hserver.updateHashCapacity();
        updateHashManagerCapacity();
    }

    // Refresh Main Menu (the 'World' menu, specifically)
    document.getElementById("world-menu-header").click();
    document.getElementById("world-menu-header").click();

    // Gain int exp
    Player.gainIntelligenceExp(5);

    resetPidCounter();
}

export {prestigeAugmentation, prestigeSourceFile};
