import {deleteActiveScriptsItem}                from "./ActiveScriptsUI.js";
import {Augmentations, augmentationExists,
        initAugmentations, AugmentationNames}   from "./Augmentations.js";
import {initBitNodeMultipliers}                 from "./BitNode.js";
import {writeCinematicText}                     from "./CinematicText.js";
import {Companies, Company, initCompanies}      from "./Company.js";
import {Programs}                               from "./CreateProgram.js";
import {Engine}                                 from "./engine.js";
import {Factions, Faction, initFactions,
        joinFaction}                            from "./Faction.js";
import {deleteGangDisplayContent}               from "./Gang.js";
import {Locations}                              from "./Location.js";
import {initMessages, Messages, Message}        from "./Message.js";
import {initSingularitySFFlags, hasWallStreetSF}from "./NetscriptFunctions.js";
import {WorkerScript, workerScripts,
        prestigeWorkerScripts}                  from "./NetscriptWorker.js";
import {Player}                                 from "./Player.js";

import {AllServers, AddToAllServers,
        initForeignServers, Server,
        prestigeAllServers,
        prestigeHomeComputer}                   from "./Server.js";
import {SpecialServerIps, SpecialServerIpsMap,
        prestigeSpecialServerIps,
        SpecialServerNames}                     from "./SpecialServerIps.js";
import {initStockMarket, initSymbolToStockMap,
        stockMarketContentCreated,
        setStockMarketContentCreated}           from "./StockMarket.js";
import {Terminal, postNetburnerText}            from "./Terminal.js";
import Decimal                                  from "decimal.js";
import {dialogBoxCreate}                        from "../utils/DialogBox.js";
import {createPopup, createElement,
        removeElementById, exceptionAlert}      from "../utils/HelperFunctions.js";
import {yesNoBoxCreate, yesNoBoxGetYesButton,
        yesNoBoxGetNoButton, yesNoBoxClose}     from "../utils/YesNoBox.js";

let BitNode8StartingMoney = 250e6;

//Prestige by purchasing augmentation
function prestigeAugmentation() {
    initBitNodeMultipliers();

    Player.prestigeAugmentation();

    //Delete all Worker Scripts objects
    prestigeWorkerScripts();

    var homeComp = Player.getHomeComputer();
    //Delete all servers except home computer
    prestigeAllServers();

    //Delete Special Server IPs
    prestigeSpecialServerIps(); //Must be done before initForeignServers()

    //Reset home computer (only the programs) and add to AllServers
    AddToAllServers(homeComp);
    prestigeHomeComputer(homeComp);

    if (augmentationExists(AugmentationNames.Neurolink) &&
        Augmentations[AugmentationNames.Neurolink].owned) {
        homeComp.programs.push(Programs.FTPCrackProgram);
        homeComp.programs.push(Programs.RelaySMTPProgram);
    }
    if (augmentationExists(AugmentationNames.CashRoot) &&
        Augmentations[AugmentationNames.CashRoot].owned) {
        Player.setMoney(new Decimal(1000000));
        homeComp.programs.push(Programs.BruteSSHProgram);
    }

    //Re-create foreign servers
    initForeignServers();

    //Darkweb is purchase-able
    document.getElementById("location-purchase-tor").setAttribute("class", "a-link-button");

    //Gain favor for Companies
    for (var member in Companies) {
        if (Companies.hasOwnProperty(member)) {
            Companies[member].gainFavor();
        }
    }

    //Gain favor for factions
    for (var member in Factions) {
        if (Factions.hasOwnProperty(member)) {
            Factions[member].gainFavor();
        }
    }

    //Stop a Terminal action if there is onerror
    if (Engine._actionInProgress) {
        Engine._actionInProgress = false;
        Terminal.finishAction(true);
    }

    //Re-initialize things - This will update any changes
    initFactions(); //Factions must be initialized before augmentations
    initAugmentations(); //Calls reapplyAllAugmentations() and resets Player multipliers
    Player.reapplyAllSourceFiles();
    initCompanies();

    //Clear terminal
    $("#terminal tr:not(:last)").remove();
    postNetburnerText();

    //Messages
    initMessages();

    //Reset Stock market
    if (Player.hasWseAccount) {
        initStockMarket();
        initSymbolToStockMap();
    }
    setStockMarketContentCreated(false);
    var stockMarketList = document.getElementById("stock-market-list");
    while(stockMarketList.firstChild) {
        stockMarketList.removeChild(stockMarketList.firstChild);
    }

    //Gang, in BitNode 2
    if (Player.bitNodeN == 2 && Player.inGang()) {
        var faction = Factions[Player.gang.facName];
        if (faction instanceof Faction) {
            joinFaction(faction);
        }
    }

    //Reset Bladeburner
    Player.bladeburner = null;

    //BitNode 8: Ghost of Wall Street
    if (Player.bitNodeN === 8) {Player.money = new Decimal(BitNode8StartingMoney);}
    if (Player.bitNodeN === 8 || hasWallStreetSF) {
        Player.hasWseAccount = true;
        Player.hasTixApiAccess = true;
    }

    var mainMenu = document.getElementById("mainmenu-container");
    mainMenu.style.visibility = "visible";
    Terminal.resetTerminalInput();
    Engine.loadTerminalContent();

    //Red Pill
    if (augmentationExists(AugmentationNames.TheRedPill) &&
        Augmentations[AugmentationNames.TheRedPill].owned) {
        var WorldDaemon = AllServers[SpecialServerIps[SpecialServerNames.WorldDaemon]];
        var DaedalusServer = AllServers[SpecialServerIps[SpecialServerNames.DaedalusServer]];
        if (WorldDaemon && DaedalusServer) {
            WorldDaemon.serversOnNetwork.push(DaedalusServer.ip);
            DaedalusServer.serversOnNetwork.push(WorldDaemon.ip);
        }
    }
}


//Prestige by destroying Bit Node and gaining a Source File
function prestigeSourceFile() {
    initBitNodeMultipliers();

    Player.prestigeSourceFile();
    prestigeWorkerScripts(); //Delete all Worker Scripts objects

    var homeComp = Player.getHomeComputer();

    //Delete all servers except home computer
    prestigeAllServers(); //Must be done before initForeignServers()

    //Delete Special Server IPs
    prestigeSpecialServerIps();

    //Reset home computer (only the programs) and add to AllServers
    AddToAllServers(homeComp);
    prestigeHomeComputer(homeComp);

    //Re-create foreign servers
    initForeignServers();

    var srcFile1Owned = false;
    for (var i = 0; i < Player.sourceFiles.length; ++i) {
        if (Player.sourceFiles[i].n == 1) {
            srcFile1Owned = true;
        }
    }
    if (srcFile1Owned) {
        homeComp.setMaxRam(32);
    } else {
        homeComp.setMaxRam(8);
    }
    homeComp.cpuCores = 1;

    //Darkweb is purchase-able
    document.getElementById("location-purchase-tor").setAttribute("class", "a-link-button");

    //Reset favor for Companies
    for (var member in Companies) {
        if (Companies.hasOwnProperty(member)) {
            Companies[member].favor = 0;
        }
    }

    //Reset favor for factions
    for (var member in Factions) {
        if (Factions.hasOwnProperty(member)) {
            Factions[member].favor = 0;
        }
    }

    //Stop a Terminal action if there is one
    if (Engine._actionInProgress) {
        Engine._actionInProgress = false;
        Terminal.finishAction(true);
    }

    //Delete all Augmentations
    for (var name in Augmentations) {
        if (Augmentations.hasOwnProperty(name)) {
            delete Augmentations[name];
        }
    }

    //Re-initialize things - This will update any changes
    initFactions(); //Factions must be initialized before augmentations
    initAugmentations();    //Calls reapplyAllAugmentations() and resets Player multipliers
    Player.reapplyAllSourceFiles();
    initCompanies();

    //Clear terminal
    $("#terminal tr:not(:last)").remove();
    postNetburnerText();

    //Messages
    initMessages();

    var mainMenu = document.getElementById("mainmenu-container");
    mainMenu.style.visibility = "visible";
    Terminal.resetTerminalInput();
    Engine.loadTerminalContent();

    //Reinitialize Bit Node flags
    initSingularitySFFlags();

    //Reset Stock market, gang, and corporation
    if (Player.hasWseAccount) {
        initStockMarket();
        initSymbolToStockMap();
    }
    setStockMarketContentCreated(false);
    var stockMarketList = document.getElementById("stock-market-list");
    while(stockMarketList.firstChild) {
        stockMarketList.removeChild(stockMarketList.firstChild);
    }

    Player.gang = null;
    deleteGangDisplayContent();
    Player.corporation = null;
    Player.bladeburner = null;

    //BitNode 3: Corporatocracy
    if (Player.bitNodeN === 3) {
        Player.money = new Decimal(150e9);
        homeComp.messages.push("corporation-management-handbook.lit");
        dialogBoxCreate("You received a copy of the Corporation Management Handbook on your home computer. " +
                        "Read it if you need help getting started with Corporations!");
    }

    //BitNode 6: Bladeburner
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

    //BitNode 8: Ghost of Wall Street
    if (Player.bitNodeN === 8) {Player.money = new Decimal(BitNode8StartingMoney);}
    if (Player.bitNodeN === 8 || hasWallStreetSF) {
        Player.hasWseAccount = true;
        Player.hasTixApiAccess = true;
    }

    //Gain int exp
    Player.gainIntelligenceExp(5);
}

export {prestigeAugmentation, prestigeSourceFile};
