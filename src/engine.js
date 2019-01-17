import { dialogBoxCreate}                               from "../utils/DialogBox";
import { gameOptionsBoxClose,
         gameOptionsBoxOpen }                           from "../utils/GameOptions";
import { getRandomInt }                                 from "../utils/helpers/getRandomInt";
import { removeChildrenFromElement }                    from "../utils/uiHelpers/removeChildrenFromElement";
import { clearEventListeners }                          from "../utils/uiHelpers/clearEventListeners";
import { createElement }                                from "../utils/uiHelpers/createElement";
import { exceptionAlert }                               from "../utils/helpers/exceptionAlert";
import { removeLoadingScreen }                          from "../utils/uiHelpers/removeLoadingScreen";

import {numeralWrapper}                                 from "./ui/numeralFormat";
import { createStatusText }                             from "./ui/createStatusText";

import {formatNumber,
        convertTimeMsToTimeElapsedString,
        replaceAt}                                      from "../utils/StringHelperFunctions";
import {loxBoxCreate, logBoxUpdateText,
        logBoxOpened}                                   from "../utils/LogBox";
import {updateActiveScriptsItems}                       from "./ActiveScriptsUI";
import { Augmentations }                                from "./Augmentation/Augmentations";
import { installAugmentations,
         initAugmentations,
         displayAugmentationsContent,
         PlayerOwnedAugmentation }                      from "./Augmentation/AugmentationHelpers";
import { AugmentationNames }                            from "./Augmentation/data/AugmentationNames";

import {BitNodes, initBitNodes,
        initBitNodeMultipliers}                         from "./BitNode/BitNode";
import {Bladeburner}                                    from "./Bladeburner";
import {CharacterOverview}                              from "./CharacterOverview";
import {cinematicTextFlag}                              from "./CinematicText";
import {generateRandomContract}                         from "./CodingContractGenerator";
import {CompanyPositions}                               from "./Company/CompanyPositions";
import {initCompanies}                                  from "./Company/Companies";
import { Corporation }                                  from "./Corporation/Corporation";
import {CONSTANTS}                                      from "./Constants";


import {createDevMenu, closeDevMenu}                    from "./DevMenu";
import { Factions, initFactions }                       from "./Faction/Factions";
import { displayFactionContent, joinFaction,
         processPassiveFactionRepGain,
         inviteToFaction }                              from "./Faction/FactionHelpers";
import {FconfSettings}                                  from "./Fconf";
import {displayLocationContent,
        initLocationButtons}                            from "./Location";
import {Locations}                                      from "./Locations";
import {displayHacknetNodesContent, processAllHacknetNodeEarnings,
        updateHacknetNodesContent}                      from "./HacknetNode";
import {iTutorialStart}                                 from "./InteractiveTutorial";
import {initLiterature}                                 from "./Literature";
import {checkForMessagesToSend, initMessages}           from "./Message";
import {inMission, currMission}                         from "./Missions";
import {initSingularitySFFlags,
        hasSingularitySF, hasCorporationSF}             from "./NetscriptFunctions";
import {updateOnlineScriptTimes,
        runScriptsLoop}                                 from "./NetscriptWorker";
import {Player}                                         from "./Player";
import {prestigeAugmentation,
        prestigeSourceFile}                             from "./Prestige";
import { Programs }                                     from "./Programs/Programs";
import { displayCreateProgramContent,
         getNumAvailableCreateProgram,
         initCreateProgramButtons }                     from "./Programs/ProgramHelpers";
import {redPillFlag, hackWorldDaemon}                   from "./RedPill";
import {saveObject, loadGame}                           from "./SaveObject";
import {loadAllRunningScripts, scriptEditorInit,
        updateScriptEditorContent}                      from "./Script";
import {AllServers, Server, initForeignServers}         from "./Server";
import {Settings}                                       from "./Settings";
import {setSettingsLabels}                              from "./ui/setSettingsLabels";
import {initSourceFiles, SourceFiles,
        PlayerOwnedSourceFile}                          from "./SourceFile";
import {SpecialServerIps, initSpecialServerIps}         from "./SpecialServerIps";
import {StockMarket, StockSymbols,
        SymbolToStockMap, initStockSymbols,
        initSymbolToStockMap, stockMarketCycle,
        processStockPrices,
        displayStockMarketContent}                      from "./StockMarket/StockMarket";
import {Terminal, postNetburnerText}                    from "./Terminal";
import {KEY}                                            from "../utils/helpers/keyCodes";
import {Page, routing}                                  from "./ui/navigationTracking";

// These should really be imported with the module that is presenting that UI, but because they very much depend on the
// cascade order, we'll pull them all in here.
import 'normalize.css';
import "../css/styles.scss";
import "../css/tooltips.scss";
import "../css/buttons.scss";
import "../css/mainmenu.scss";
import "../css/characteroverview.scss";
import "../css/terminal.scss";
import "../css/menupages.scss";
import "../css/stockmarket.scss";
import "../css/workinprogress.scss";
import "../css/popupboxes.scss";
import "../css/gameoptions.scss";
import "../css/interactivetutorial.scss";
import "../css/loader.scss";
import "../css/missions.scss";
import "../css/companymanagement.scss";
import "../css/bladeburner.scss";
import "../css/gang.scss";
import "../css/treant.css";


/* Shortcuts to navigate through the game
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
$(document).keydown(function(e) {
    if (Settings.DisableHotkeys === true) {return;}
    if (!Player.isWorking && !redPillFlag && !inMission && !cinematicTextFlag) {
        if (e.keyCode == 84 && e.altKey) {
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
            Engine.loadWorldContent();
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
            //Overriden by Fconf
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
        }
    }

    if (e.keyCode === KEY.O && e.altKey) {
        e.preventDefault();
        gameOptionsBoxOpen();
    }
});

const Engine = {
    version: "",
    Debug: true,
    overview: new CharacterOverview(),

    //Clickable objects
    Clickables: {
        //Main menu buttons
        terminalMainMenuButton:         null,
        characterMainMenuButton:        null,
        scriptEditorMainMenuButton:     null,
        activeScriptsMainMenuButton:    null,
        hacknetNodesMainMenuButton:     null,
        worldMainMenuButton:            null,
        travelMainMenuButton:           null,
        jobMainMenuButton:              null,
        stockmarketMainMenuButton:      null,
        createProgramMainMenuButton:    null,
        factionsMainMenuButton:         null,
        augmentationsMainMenuButton:    null,
        tutorialMainMenuButton:         null,
        bladeburnerMenuButton:          null,
        corporationMenuButton:          null,
        gangMenuButton:                 null,
        devMainMenuButton:              null,
        saveMainMenuButton:             null,
        deleteMainMenuButton:           null,

        //Tutorial buttons
        tutorialNetworkingButton:       null,
        tutorialHackingButton:          null,
        tutorialScriptsButton:          null,
        tutorialNetscriptButton:        null,
        tutorialTravelingButton:        null,
        tutorialCompaniesButton:        null,
        tutorialFactionsButton:         null,
        tutorialAugmentationsButton:    null,
        tutorialBackButton:             null,
    },

    //Display objects
    Display: {
        //Progress bar
        progress:               null,

        //Display for status text (such as "Saved" or "Loaded")
        statusText:             null,

        hacking_skill:          null,

        //Main menu content
        terminalContent:                null,
        characterContent:               null,
        scriptEditorContent:            null,
        activeScriptsContent:           null,
        hacknetNodesContent:            null,
        worldContent:                   null,
        createProgramContent:           null,
        factionsContent:                null,
        factionContent:                 null,
        factionAugmentationsContent:    null,
        augmentationsContent:           null,
        tutorialContent:                null,
        infiltrationContent:            null,
        stockMarketContent:             null,
        locationContent:                null,
        workInProgressContent:          null,
        redPillContent:                 null,
        cinematicTextContent:           null,
        missionContent:                 null,

        //Character info
        characterInfo:                  null,
    },

    //Time variables (milliseconds unix epoch time)
    _lastUpdate: new Date().getTime(),
    _idleSpeed: 200,    //Speed (in ms) at which the main loop is updated

    /* Load content when a main menu button is clicked */
    loadTerminalContent: function() {
        Engine.hideAllContent();
        Engine.Display.terminalContent.style.display = "block";
        routing.navigateTo(Page.Terminal);
        document.getElementById("terminal-menu-link").classList.add("active");
    },

    loadCharacterContent: function() {
        Engine.hideAllContent();
        Engine.Display.characterContent.style.display = "block";
        Engine.displayCharacterInfo();
        routing.navigateTo(Page.CharacterInfo);
        document.getElementById("stats-menu-link").classList.add("active");
    },

    loadScriptEditorContent: function(filename = "", code = "") {
        Engine.hideAllContent();
        Engine.Display.scriptEditorContent.style.display = "block";
        var editor = ace.edit('javascript-editor');
        if (filename != "") {
            document.getElementById("script-editor-filename").value = filename;
            editor.setValue(code);
        }
        editor.focus();
        updateScriptEditorContent();
        routing.navigateTo(Page.ScriptEditor);
        document.getElementById("create-script-menu-link").classList.add("active");
    },

    loadActiveScriptsContent: function() {
        Engine.hideAllContent();
        Engine.Display.activeScriptsContent.style.display = "block";
        updateActiveScriptsItems();
        routing.navigateTo(Page.ActiveScripts);
        document.getElementById("active-scripts-menu-link").classList.add("active");
    },

    loadHacknetNodesContent: function() {
        Engine.hideAllContent();
        Engine.Display.hacknetNodesContent.style.display = "block";
        displayHacknetNodesContent();
        routing.navigateTo(Page.HacknetNodes);
        document.getElementById("hacknet-nodes-menu-link").classList.add("active");
    },

    loadWorldContent: function() {
        Engine.hideAllContent();
        Engine.Display.worldContent.style.display = "block";
        Engine.displayWorldInfo();
        routing.navigateTo(Page.World);
        document.getElementById("city-menu-link").classList.add("active");
    },

    loadCreateProgramContent: function() {
        Engine.hideAllContent();
        Engine.Display.createProgramContent.style.display = "block";
        displayCreateProgramContent();
        routing.navigateTo(Page.CreateProgram);
        document.getElementById("create-program-menu-link").classList.add("active");
    },

    loadFactionsContent: function() {
        Engine.hideAllContent();
        Engine.Display.factionsContent.style.display = "block";
        Engine.displayFactionsInfo();
        routing.navigateTo(Page.Factions);
        document.getElementById("factions-menu-link").classList.add("active");
    },

    loadFactionContent: function() {
        Engine.hideAllContent();
        Engine.Display.factionContent.style.display = "block";
        routing.navigateTo(Page.Faction);
    },

    loadAugmentationsContent: function() {
        Engine.hideAllContent();
        Engine.Display.augmentationsContent.style.display = "block";
        displayAugmentationsContent(Engine.Display.augmentationsContent);
        routing.navigateTo(Page.Augmentations);
        document.getElementById("augmentations-menu-link").classList.add("active");
    },

    loadTutorialContent: function() {
        Engine.hideAllContent();
        Engine.Display.tutorialContent.style.display = "block";
        Engine.displayTutorialContent();
        routing.navigateTo(Page.Tutorial);
        document.getElementById("tutorial-menu-link").classList.add("active");
    },

    loadDevMenuContent: function() {
        Engine.hideAllContent();
        createDevMenu();
        routing.navigateTo(Page.DevMenu);
        document.getElementById("dev-menu-link").classList.add("active");
    },

    loadLocationContent: function() {
        Engine.hideAllContent();
        Engine.Display.locationContent.style.display = "block";
        try {
            displayLocationContent();
        } catch(e) {
            exceptionAlert(e);
            console.error(e);
        }

        routing.navigateTo(Page.Location);
    },

    loadTravelContent: function() {
        switch(Player.city) {
            case Locations.Aevum:
                Player.location = Locations.AevumTravelAgency;
                break;
            case Locations.Chongqing:
                Player.location = Locations.ChongqingTravelAgency;
                break;
            case Locations.Sector12:
                Player.location = Locations.Sector12TravelAgency;
                break;
            case Locations.NewTokyo:
                Player.location = Locations.NewTokyoTravelAgency;
                break;
            case Locations.Ishima:
                Player.location = Locations.IshimaTravelAgency;
                break;
            case Locations.Volhaven:
                Player.location = Locations.VolhavenTravelAgency;
                break;
            default:
                dialogBoxCreate("ERROR: Invalid city. This is a bug please contact game dev");
                break;
        }
        Engine.loadLocationContent();
    },

    loadJobContent: function() {
        if (Player.companyName == "") {
            dialogBoxCreate("You do not currently have a job! You can visit various companies " +
                            "in the city and try to find a job.");
            return;
        }
        Player.location = Player.companyName;
        Engine.loadLocationContent();
    },

    loadWorkInProgressContent: function() {
        Engine.hideAllContent();
        var mainMenu = document.getElementById("mainmenu-container");
        //mainMenu.style.visibility = "hidden";
        mainMenu.style.visibility = "hidden";
        Engine.Display.workInProgressContent.style.display = "block";
        routing.navigateTo(Page.WorkInProgress);
    },

    loadRedPillContent: function() {
        Engine.hideAllContent();
        var mainMenu = document.getElementById("mainmenu-container");
        mainMenu.style.visibility = "hidden";
        Engine.Display.redPillContent.style.display = "block";
        routing.navigateTo(Page.RedPill);
    },

    loadCinematicTextContent: function() {
        Engine.hideAllContent();
        var mainMenu = document.getElementById("mainmenu-container");
        mainMenu.style.visibility = "hidden";
        Engine.Display.cinematicTextContent.style.display = "block";
        routing.navigateTo(Page.CinematicText);
    },

    loadInfiltrationContent: function() {
        Engine.hideAllContent();
        Engine.Display.infiltrationContent.style.display = "block";
        routing.navigateTo(Page.Infiltration);
    },

    loadStockMarketContent: function() {
        Engine.hideAllContent();
        Engine.Display.stockMarketContent.style.display = "block";
        routing.navigateTo(Page.StockMarket);
        displayStockMarketContent();
    },

    loadGangContent: function() {
        Engine.hideAllContent();
        if (document.getElementById("gang-container") || Player.inGang()) {
            Player.gang.displayGangContent(Player);
            routing.navigateTo(Page.Gang);
        } else {
            Engine.loadTerminalContent();
            routing.navigateTo(Page.Terminal);
        }
    },

    loadMissionContent: function() {
        Engine.hideAllContent();
        document.getElementById("mainmenu-container").style.visibility = "hidden";
        document.getElementById("character-overview-wrapper").style.visibility = "hidden";
        Engine.Display.missionContent.style.display = "block";
        routing.navigateTo(Page.Mission);
    },

    loadCorporationContent: function() {
        if (Player.corporation instanceof Corporation) {
            Engine.hideAllContent();
            document.getElementById("character-overview-wrapper").style.visibility = "hidden";
            Player.corporation.createUI();
            routing.navigateTo(Page.Corporation);
        }
    },

    loadBladeburnerContent: function() {
        if (Player.bladeburner instanceof Bladeburner) {
            try {
                Engine.hideAllContent();
                routing.navigateTo(Page.Bladeburner);
                Player.bladeburner.createContent();
            } catch(e) {
                exceptionAlert(e);
            }
        }
    },

    loadSleevesContent: function() {

    },

    //Helper function that hides all content
    hideAllContent: function() {
        Engine.Display.terminalContent.style.display = "none";
        Engine.Display.characterContent.style.display = "none";
        Engine.Display.scriptEditorContent.style.display = "none";
        Engine.Display.activeScriptsContent.style.display = "none";
        Engine.Display.hacknetNodesContent.style.display = "none";
        Engine.Display.worldContent.style.display = "none";
        Engine.Display.createProgramContent.style.display = "none";
        Engine.Display.factionsContent.style.display = "none";
        Engine.Display.factionContent.style.display = "none";
        Engine.Display.factionAugmentationsContent.style.display = "none";
        Engine.Display.augmentationsContent.style.display = "none";
        Engine.Display.tutorialContent.style.display = "none";
        Engine.Display.locationContent.style.display = "none";
        Engine.Display.workInProgressContent.style.display = "none";
        Engine.Display.redPillContent.style.display = "none";
        Engine.Display.cinematicTextContent.style.display = "none";
        Engine.Display.infiltrationContent.style.display = "none";
        Engine.Display.stockMarketContent.style.display = "none";
        Engine.Display.missionContent.style.display = "none";
        if (document.getElementById("gang-container")) {
            document.getElementById("gang-container").style.display = "none";
        }

        if (Player.inGang()) {
            Player.gang.clearUI();
        }
        if (Player.corporation instanceof Corporation) {
            Player.corporation.clearUI();
        }

        if (Player.bladeburner instanceof Bladeburner) {
            Player.bladeburner.clearContent();
        }

        //Location lists
        Engine.aevumLocationsList.style.display = "none";
        Engine.chongqingLocationsList.style.display = "none";
        Engine.sector12LocationsList.style.display = "none";
        Engine.newTokyoLocationsList.style.display = "none";
        Engine.ishimaLocationsList.style.display = "none";
        Engine.volhavenLocationsList.style.display = "none";

        //Make nav menu tabs inactive
        document.getElementById("terminal-menu-link").classList.remove("active");
        document.getElementById("create-script-menu-link").classList.remove("active");
        document.getElementById("active-scripts-menu-link").classList.remove("active");
        document.getElementById("create-program-menu-link").classList.remove("active");
        document.getElementById("stats-menu-link").classList.remove("active");
        document.getElementById("factions-menu-link").classList.remove("active");
        document.getElementById("augmentations-menu-link").classList.remove("active");
        document.getElementById("hacknet-nodes-menu-link").classList.remove("active");
        document.getElementById("city-menu-link").classList.remove("active");
        document.getElementById("travel-menu-link").classList.remove("active");
        document.getElementById("stock-market-menu-link").classList.remove("active");
        document.getElementById("tutorial-menu-link").classList.remove("active");
        document.getElementById("options-menu-link").classList.remove("active");
        document.getElementById("dev-menu-link").classList.remove("active");
        document.getElementById("bladeburner-menu-link").classList.remove("active");
        document.getElementById("corporation-menu-link").classList.remove("active");
        document.getElementById("gang-menu-link").classList.remove("active");

        // Close dev menu
        closeDevMenu();
    },

    displayCharacterOverviewInfo: function() {
        Engine.overview.update();

        const save = document.getElementById("character-overview-save-button");
        const flashClass = "flashing-button";
        if(!Settings.AutosaveInterval) {
            save.classList.add(flashClass);
        } else {
            save.classList.remove(flashClass);
        }
    },

    /* Display character info */
    displayCharacterInfo: function() {
        removeChildrenFromElement(Engine.Display.characterInfo);

        let companyPosition = "";
        if (Player.companyName !== "") {
            companyPosition = Player.jobs[Player.companyName];
        }

        var intText = "";
        if (Player.intelligence > 0) {
            intText = 'Intelligence:  ' + (Player.intelligence).toLocaleString() + '<br>';
        }

        let bitNodeTimeText = "";
        if(Player.sourceFiles.length > 0) {
            bitNodeTimeText = 'Time played since last Bitnode destroyed: ' + convertTimeMsToTimeElapsedString(Player.playtimeSinceLastBitnode) + '<br>';
        }

        Engine.Display.characterInfo.appendChild(createElement("pre", {
            innerHTML:
            '<b>General</b><br><br>' +
            'Current City: ' + Player.city + '<br><br>' +
            `Employer at which you last worked: ${Player.companyName}<br>` +
            `Job you last worked: ${companyPosition}<br>` +
            `All Employers: ${Object.keys(Player.jobs).join(", ")}<br><br>` +
            'Money: $' + formatNumber(Player.money.toNumber(), 2) + '<br><br><br>' +
            '<b>Stats</b><br><br>' +
            'Hacking Level: ' + (Player.hacking_skill).toLocaleString() +
                            ' (' + numeralWrapper.format(Player.hacking_exp, '(0.000a)') + ' experience)<br>' +
            'Strength:      ' + (Player.strength).toLocaleString() +
                       ' (' + numeralWrapper.format(Player.strength_exp, '(0.000a)') + ' experience)<br>' +
            'Defense:       ' + (Player.defense).toLocaleString() +
                      ' (' + numeralWrapper.format(Player.defense_exp, '(0.000a)') + ' experience)<br>' +
            'Dexterity:     ' + (Player.dexterity).toLocaleString() +
                       ' (' + numeralWrapper.format(Player.dexterity_exp, '(0.000a)') + ' experience)<br>' +
            'Agility:       ' + (Player.agility).toLocaleString() +
                      ' (' + numeralWrapper.format(Player.agility_exp, '(0.000a)') + ' experience)<br>' +
            'Charisma:      ' + (Player.charisma).toLocaleString() +
                       ' (' + numeralWrapper.format(Player.charisma_exp, '(0.000a)') + ' experience)<br>' +
            intText + '<br><br>' +
            '<b>Multipliers</b><br><br>' +
            'Hacking Chance multiplier: ' + formatNumber(Player.hacking_chance_mult * 100, 2) + '%<br>' +
            'Hacking Speed multiplier:  ' + formatNumber(Player.hacking_speed_mult * 100, 2) + '%<br>' +
            'Hacking Money multiplier:  ' + formatNumber(Player.hacking_money_mult * 100, 2) + '%<br>' +
            'Hacking Growth multiplier: ' + formatNumber(Player.hacking_grow_mult * 100, 2) + '%<br><br>' +
            'Hacking Level multiplier:      ' + formatNumber(Player.hacking_mult * 100, 2) + '%<br>' +
            'Hacking Experience multiplier: ' + formatNumber(Player.hacking_exp_mult * 100, 2) + '%<br><br>' +
            'Strength Level multiplier:      ' + formatNumber(Player.strength_mult * 100, 2) + '%<br>' +
            'Strength Experience multiplier: ' + formatNumber(Player.strength_exp_mult * 100, 2) + '%<br><br>' +
            'Defense Level multiplier:      ' + formatNumber(Player.defense_mult * 100, 2) + '%<br>' +
            'Defense Experience multiplier: ' + formatNumber(Player.defense_exp_mult * 100, 2) + '%<br><br>' +
            'Dexterity Level multiplier:      ' + formatNumber(Player.dexterity_mult * 100, 2) + '%<br>' +
            'Dexterity Experience multiplier: ' + formatNumber(Player.dexterity_exp_mult * 100, 2) + '%<br><br>' +
            'Agility Level multiplier:      ' + formatNumber(Player.agility_mult * 100, 2) + '%<br>' +
            'Agility Experience multiplier: ' + formatNumber(Player.agility_exp_mult * 100, 2) + '%<br><br>' +
            'Charisma Level multiplier:      ' + formatNumber(Player.charisma_mult * 100, 2) + '%<br>' +
            'Charisma Experience multiplier: ' + formatNumber(Player.charisma_exp_mult * 100, 2) + '%<br><br>' +
            'Hacknet Node production multiplier:         ' + formatNumber(Player.hacknet_node_money_mult * 100, 2) + '%<br>' +
            'Hacknet Node purchase cost multiplier:      ' + formatNumber(Player.hacknet_node_purchase_cost_mult * 100, 2) + '%<br>' +
            'Hacknet Node RAM upgrade cost multiplier:   ' + formatNumber(Player.hacknet_node_ram_cost_mult * 100, 2) + '%<br>' +
            'Hacknet Node Core purchase cost multiplier: ' + formatNumber(Player.hacknet_node_core_cost_mult * 100, 2) + '%<br>' +
            'Hacknet Node level upgrade cost multiplier: ' + formatNumber(Player.hacknet_node_level_cost_mult * 100, 2) + '%<br><br>' +
            'Company reputation gain multiplier: ' + formatNumber(Player.company_rep_mult * 100, 2) + '%<br>' +
            'Faction reputation gain multiplier: ' + formatNumber(Player.faction_rep_mult * 100, 2) + '%<br>' +
            'Salary multiplier: ' + formatNumber(Player.work_money_mult * 100, 2) + '%<br>' +
            'Crime success multiplier: ' + formatNumber(Player.crime_success_mult * 100, 2) + '%<br>' +
            'Crime money multiplier: ' + formatNumber(Player.crime_money_mult * 100, 2) + '%<br><br><br>' +
            '<b>Misc</b><br><br>' +
            'Servers owned:       ' + Player.purchasedServers.length + '<br>' +
            'Hacknet Nodes owned: ' + Player.hacknetNodes.length + '<br>' +
            'Augmentations installed: ' + Player.augmentations.length + '<br>' +
            'Time played since last Augmentation: ' + convertTimeMsToTimeElapsedString(Player.playtimeSinceLastAug) + '<br>' +
            bitNodeTimeText +
            'Time played: ' + convertTimeMsToTimeElapsedString(Player.totalPlaytime),
        }));

        if (Player.sourceFiles.length !== 0) {
            var index = "BitNode" + Player.bitNodeN;

            Engine.Display.characterInfo.appendChild(createElement("p", {
                width:"60%",
                innerHTML:
                    "<br>Current BitNode: " + Player.bitNodeN + " (" + BitNodes[index].name + ")<br><br>",
            }));

            Engine.Display.characterInfo.appendChild(createElement("p", {
                width:"60%", fontSize: "13px", marginLeft:"4%",
                innerHTML:BitNodes[index].info,
            }))
        }
    },

    /* Display locations in the world*/
    aevumLocationsList:        null,
    chongqingLocationsList:    null,
    sector12LocationsList:     null,
    newTokyoLocationsList:     null,
    ishimaLocationsList:       null,
    volhavenLocationsList:     null,

    displayWorldInfo: function() {
        Engine.aevumLocationsList.style.display = "none";
        Engine.chongqingLocationsList.style.display = "none";
        Engine.sector12LocationsList.style.display = "none";
        Engine.newTokyoLocationsList.style.display = "none";
        Engine.ishimaLocationsList.style.display = "none";
        Engine.volhavenLocationsList.style.display = "none";

        document.getElementById("world-city-name").innerHTML = Player.city;
        var cityDesc = document.getElementById("world-city-desc"); //TODO
        switch(Player.city) {
            case Locations.Aevum:
                Engine.aevumLocationsList.style.display = "inline";
                break;
            case Locations.Chongqing:
                Engine.chongqingLocationsList.style.display = "inline";
                break;
            case Locations.Sector12:
                Engine.sector12LocationsList.style.display = "inline";

                //City hall only in BitNode-3/with Source-File 3
                if ((Player.bitNodeN === 3 || hasCorporationSF) && Player.bitNodeN !== 8)  {
                    document.getElementById("sector12-cityhall-li").style.display = "block";
                } else {
                    document.getElementById("sector12-cityhall-li").style.display = "none";
                }
                break;
            case Locations.NewTokyo:
                Engine.newTokyoLocationsList.style.display = "inline";
                break;
            case Locations.Ishima:
                Engine.ishimaLocationsList.style.display = "inline";
                break;
            case Locations.Volhaven:
                Engine.volhavenLocationsList.style.display = "inline";
                break;
            default:
                console.log("Invalid city value in Player object!");
                break;
        }

        //Generic Locations (common to every city):
        //  World Stock Exchange
        //  Corporation (if applicable)
        //  Bladeburner HQ (if applicable);
        var genericLocationsList = document.getElementById("generic-locations-list");
        genericLocationsList.style.display = "inline";
        removeChildrenFromElement(genericLocationsList);
        var li = createElement("li");
        li.appendChild(createElement("a", {
            innerText:"World Stock Exchange", class:"a-link-button",
            clickListener:()=>{
                Player.location = Locations.WorldStockExchange;
                Engine.loadStockMarketContent();
                return false;
            }
        }));
        genericLocationsList.appendChild(li);

        if (Player.corporation instanceof Corporation && document.getElementById("location-corporation-button") == null) {
            var li = createElement("li");
            li.appendChild(createElement("a", {
                innerText:Player.corporation.name, id:"location-corporation-button",
                class:"a-link-button",
                clickListener:()=>{
                    Engine.loadCorporationContent();
                    return false;
                }
            }));
            genericLocationsList.appendChild(li);
        }

        if (Player.bladeburner instanceof Bladeburner) {
            var li = createElement("li");
            li.appendChild(createElement("a", {
                innerText:"Bladeburner Headquarters", class:"a-link-button",
                clickListener:()=>{
                    Engine.loadBladeburnerContent();
                    return false;
                }
            }));
            genericLocationsList.appendChild(li);
        }
    },

    displayFactionsInfo: function() {
        removeChildrenFromElement(Engine.Display.factionsContent);

        //Factions
        Engine.Display.factionsContent.appendChild(createElement("h1", {
            innerText:"Factions"
        }));
        Engine.Display.factionsContent.appendChild(createElement("p", {
            innerText:"Lists all factions you have joined"
        }));
        var factionsList = createElement("ul");
        Engine.Display.factionsContent.appendChild(createElement("br"));

        //Add a button for each faction you are a member of
        for (var i = 0; i < Player.factions.length; ++i) {
            (function () {
                var factionName = Player.factions[i];

                factionsList.appendChild(createElement("a", {
                    class:"a-link-button", innerText:factionName, padding:"4px", margin:"4px",
                    display:"inline-block",
                    clickListener:()=>{
                        Engine.loadFactionContent();
                        displayFactionContent(factionName);
                        return false;
                    }
                }));
                factionsList.appendChild(createElement("br"));
            }()); //Immediate invocation
        }
        Engine.Display.factionsContent.appendChild(factionsList);
        Engine.Display.factionsContent.appendChild(createElement("br"));

        //Invited Factions
        Engine.Display.factionsContent.appendChild(createElement("h1", {
            innerText:"Outstanding Faction Invitations"
        }));
        Engine.Display.factionsContent.appendChild(createElement("p", {
            width:"70%",
            innerText:"Lists factions you have been invited to, as well as " +
                      "factions you have previously rejected. You can accept " +
                      "these faction invitations at any time."
        }));
        var invitationsList = createElement("ul");

        //Add a button to accept for each faction you have invitiations for
        for (var i = 0; i < Player.factionInvitations.length; ++i) {
            (function () {
                var factionName = Player.factionInvitations[i];

                var item = createElement("li", {padding:"6px", margin:"6px"});
                item.appendChild(createElement("p", {
                    innerText:factionName, display:"inline", margin:"4px", padding:"4px"
                }));
                item.appendChild(createElement("a", {
                    innerText:"Accept Faction Invitation",
                    class:"a-link-button", display:"inline", margin:"4px", padding:"4px",
                    clickListener:()=>{
                        joinFaction(Factions[factionName]);
                        for (var i = 0; i < Player.factionInvitations.length; ++i) {
                            if (Player.factionInvitations[i] == factionName || Factions[Player.factionInvitations[i]].isBanned) {
                                Player.factionInvitations.splice(i, 1);
                                i--;
                            }
                        }
                        Engine.displayFactionsInfo();
                        return false;
                    }
                }));

                invitationsList.appendChild(item);
            }());
        }

        Engine.Display.factionsContent.appendChild(invitationsList);
    },

    displayTutorialContent: function() {
        document.getElementById("tutorial-getting-started-link").style.display = "block";
        Engine.Clickables.tutorialNetworkingButton.style.display = "block";
        Engine.Clickables.tutorialHackingButton.style.display = "block";
        Engine.Clickables.tutorialScriptsButton.style.display = "block";
        Engine.Clickables.tutorialNetscriptButton.style.display = "block";
        Engine.Clickables.tutorialTravelingButton.style.display = "block";
        Engine.Clickables.tutorialCompaniesButton.style.display = "block";
        Engine.Clickables.tutorialFactionsButton.style.display = "block";
        Engine.Clickables.tutorialAugmentationsButton.style.display = "block";
        document.getElementById("tutorial-shortcuts-link").style.display = "block";

        Engine.Clickables.tutorialBackButton.style.display = "none";
        document.getElementById("tutorial-text").style.display = "none";
    },

    //Displays the text when a section of the Tutorial is opened
    displayTutorialPage: function(text) {
        document.getElementById("tutorial-getting-started-link").style.display = "none";
        Engine.Clickables.tutorialNetworkingButton.style.display = "none";
        Engine.Clickables.tutorialHackingButton.style.display = "none";
        Engine.Clickables.tutorialScriptsButton.style.display = "none";
        Engine.Clickables.tutorialNetscriptButton.style.display = "none";
        Engine.Clickables.tutorialTravelingButton.style.display = "none";
        Engine.Clickables.tutorialCompaniesButton.style.display = "none";
        Engine.Clickables.tutorialFactionsButton.style.display = "none";
        Engine.Clickables.tutorialAugmentationsButton.style.display = "none";
        document.getElementById("tutorial-shortcuts-link").style.display = "none";

        Engine.Clickables.tutorialBackButton.style.display = "inline-block";
        document.getElementById("tutorial-text").style.display = "block";
        document.getElementById("tutorial-text").innerHTML = text;
    },

    /* Main Event Loop */
    idleTimer: function() {
        //Get time difference
        var _thisUpdate = new Date().getTime();
        var diff = _thisUpdate - Engine._lastUpdate;
        var offset = diff % Engine._idleSpeed;

        //Divide this by cycle time to determine how many cycles have elapsed since last update
        diff = Math.floor(diff / Engine._idleSpeed);

        if (diff > 0) {
            //Update the game engine by the calculated number of cycles
            Engine._lastUpdate = _thisUpdate - offset;
            Player.lastUpdate = _thisUpdate - offset;
            Engine.updateGame(diff);
        }

        window.requestAnimationFrame(Engine.idleTimer);
    },

    updateGame: function(numCycles = 1) {
        var time = numCycles * Engine._idleSpeed;
        if (Player.totalPlaytime == null) {Player.totalPlaytime = 0;}
        if (Player.playtimeSinceLastAug == null) {Player.playtimeSinceLastAug = 0;}
        if (Player.playtimeSinceLastBitnode == null) {Player.playtimeSinceLastBitnode = 0;}
        Player.totalPlaytime += time;
        Player.playtimeSinceLastAug += time;
        Player.playtimeSinceLastBitnode += time;

        //Start Manual hack
        if (Terminal.actionStarted === true) {
            Engine._totalActionTime = Terminal.actionTime;
            Engine._actionTimeLeft = Terminal.actionTime;
            Engine._actionInProgress = true;
            Engine._actionProgressBarCount = 1;
            Engine._actionProgressStr = "[                                                  ]";
            Engine._actionTimeStr = "Time left: ";
            Terminal.actionStarted = false;
        }

        //Working
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

        //Gang, if applicable
        if (Player.bitNodeN == 2 && Player.inGang()) {
            Player.gang.process(numCycles, Player);
        }

        //Mission
        if (inMission && currMission) {
            currMission.process(numCycles);
        }

        //Corporation
        if (Player.corporation instanceof Corporation) {
            //Stores cycles in a "buffer". Processed separately using Engine Counters
            //This is to avoid constant DOM redraws when Corporation is catching up
            Player.corporation.storeCycles(numCycles);
        }

        if (Player.bladeburner instanceof Bladeburner) {
            Player.bladeburner.storeCycles(numCycles);
        }

        //Counters
        Engine.decrementAllCounters(numCycles);
        Engine.checkCounters();

        //Manual hacks
        if (Engine._actionInProgress == true) {
            Engine.updateHackProgress(numCycles);
        }

        //Update the running time of all active scripts
        updateOnlineScriptTimes(numCycles);

        //Hacknet Nodes
        processAllHacknetNodeEarnings(numCycles);
    },

    //Counters for the main event loop. Represent the number of game cycles are required
    //for something to happen.
    Counters: {
        autoSaveCounter:    300,            //Autosave every minute
        updateSkillLevelsCounter: 10,       //Only update skill levels every 2 seconds. Might improve performance
        updateDisplays: 3,
        updateDisplaysMed: 9,
        updateDisplaysLong: 15,
        updateActiveScriptsDisplay: 5,
        createProgramNotifications: 10,     //Checks whether any programs can be created and notifies
        checkFactionInvitations: 100,       //Check whether you qualify for any faction invitations
        passiveFactionGrowth: 600,
        messages: 150,
        sCr: 1500,
        mechanicProcess: 5,                 //Processes certain mechanics (Corporation, Bladeburner)
        contractGeneration: 3000            //Generate Coding Contracts
    },

    decrementAllCounters: function(numCycles = 1) {
        for (var counter in Engine.Counters) {
            if (Engine.Counters.hasOwnProperty(counter)) {
                Engine.Counters[counter] = Engine.Counters[counter] - numCycles;
            }
        }
    },

    //Checks if any counters are 0 and if they are, executes whatever
    //is necessary and then resets the counter
    checkCounters: function() {
        if (Engine.Counters.autoSaveCounter <= 0) {
            saveObject.saveGame(indexedDb);
            if (Settings.AutosaveInterval == null) {
                Settings.AutosaveInterval = 60;
            }
            if (Settings.AutosaveInterval === 0) {
                Engine.Counters.autoSaveCounter = Infinity;
            } else {
                Engine.Counters.autoSaveCounter = Settings.AutosaveInterval * 5;
            }
        }

        if (Engine.Counters.updateSkillLevelsCounter <= 0) {
            Player.updateSkillLevels();
            Engine.Counters.updateSkillLevelsCounter = 10;
        }

        if (Engine.Counters.updateActiveScriptsDisplay <= 0) {
            //Always update, but make the interval longer if the page isn't active
            updateActiveScriptsItems();
            if (routing.isOn(Page.ActiveScripts)) {
                Engine.Counters.updateActiveScriptsDisplay = 5;
            } else {
                Engine.Counters.updateActiveScriptsDisplay = 10;
            }
        }

        if (Engine.Counters.updateDisplays <= 0) {
            Engine.displayCharacterOverviewInfo();
            if (routing.isOn(Page.CharacterInfo)) {
                Engine.displayCharacterInfo();
            }  else if (routing.isOn(Page.HacknetNodes)) {
                updateHacknetNodesContent();
            } else if (routing.isOn(Page.CreateProgram)) {
                displayCreateProgramContent();
            }

            if (logBoxOpened) {
                logBoxUpdateText();
            }

            Engine.Counters.updateDisplays = 3;
        }

        if (Engine.Counters.updateDisplaysMed <= 0) {
            if (routing.isOn(Page.Corporation)) {
                Player.corporation.updateUIContent();
            }
            Engine.Counters.updateDisplaysMed = 9;
        }

        if (Engine.Counters.updateDisplaysLong <= 0) {
            if (routing.isOn(Page.Gang) && Player.inGang()) {
                Player.gang.updateGangContent();
            } else if (routing.isOn(Page.ScriptEditor)) {
                updateScriptEditorContent();
            }
            Engine.Counters.updateDisplaysLong = 15;
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
            Engine.Counters.checkFactionInvitations = 100;
        }

        if (Engine.Counters.passiveFactionGrowth <= 0) {
            var adjustedCycles = Math.floor((600 - Engine.Counters.passiveFactionGrowth));
            processPassiveFactionRepGain(adjustedCycles);
            Engine.Counters.passiveFactionGrowth = 600;
        }

        if (Engine.Counters.messages <= 0) {
            checkForMessagesToSend();
            if (Augmentations[AugmentationNames.TheRedPill].owned) {
                Engine.Counters.messages = 4500; //15 minutes for Red pill message
            } else {
                Engine.Counters.messages = 150;
            }
        }

        if (Engine.Counters.sCr <= 0) {
            if (Player.hasWseAccount) {
                stockMarketCycle();
            }
            Engine.Counters.sCr = 1500;
        }

        if (Engine.Counters.mechanicProcess <= 0) {
            if (Player.corporation instanceof Corporation) {
                Player.corporation.process();
            }
            if (Player.bladeburner instanceof Bladeburner) {
                try {
                    Player.bladeburner.process();
                } catch(e) {
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

    /* Calculates the hack progress for a manual (non-scripted) hack and updates the progress bar/time accordingly */
    _totalActionTime: 0,
    _actionTimeLeft: 0,
    _actionTimeStr: "Time left: ",
    _actionProgressStr: "[                                                  ]",
    _actionProgressBarCount: 1,
    _actionInProgress: false,
    updateHackProgress: function(numCycles = 1) {
        var timeElapsedMilli = numCycles * Engine._idleSpeed;
        Engine._actionTimeLeft -= (timeElapsedMilli/ 1000);    //Substract idle speed (ms)
        Engine._actionTimeLeft = Math.max(Engine._actionTimeLeft, 0);

        //Calculate percent filled
        var percent = Math.round((1 - Engine._actionTimeLeft / Engine._totalActionTime) * 100);

        //Update progress bar
        while (Engine._actionProgressBarCount * 2 <= percent) {
            Engine._actionProgressStr = replaceAt(Engine._actionProgressStr, Engine._actionProgressBarCount, "|");
            Engine._actionProgressBarCount += 1;
        }

        //Update hack time remaining
        Engine._actionTimeStr = "Time left: " + Math.max(0, Math.round(Engine._actionTimeLeft)).toString() + "s";
        document.getElementById("hack-progress").innerHTML = Engine._actionTimeStr;

        //Dynamically update progress bar
        document.getElementById("hack-progress-bar").innerHTML = Engine._actionProgressStr.replace( / /g, "&nbsp;" );

        //Once percent is 100, the hack is completed
        if (percent >= 100) {
            Engine._actionInProgress = false;
            Terminal.finishAction();
        }
    },

    //Used when initializing a game
    //elems should be an array of all DOM elements under the header
    closeMainMenuHeader: function(elems) {
        for (var i = 0; i < elems.length; ++i) {
            elems[i].style.maxHeight            = null;
            elems[i].style.opacity              = 0;
            elems[i].style.pointerEvents        = "none";
        }
    },

    //Used when initializing the game
    //elems should be an array of all DOM elements under the header
    openMainMenuHeader: function(elems) {
        for (var i = 0; i < elems.length; ++i) {
            elems[i].style.maxHeight = elems[i].scrollHeight + "px";
            elems[i].style.display = "block";
        }
    },

    //Used in game when clicking on a main menu header (NOT FOR INITIALIZATION)
    //open is a boolean specifying whether its being opened or closed
    //elems is an array of DOM elements for main menu tabs (li)
    //links is an array of DOM elements for main menu links (a)
    toggleMainMenuHeader: function(open, elems, links) {
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

    load: function(saveString) {
        //Initialize main menu accordion panels to all start as "open"
        var terminal            = document.getElementById("terminal-tab");
        var createScript        = document.getElementById("create-script-tab");
        var activeScripts       = document.getElementById("active-scripts-tab");
        var createProgram       = document.getElementById("create-program-tab");
        var stats               = document.getElementById("stats-tab");
        var factions            = document.getElementById("factions-tab");
        var augmentations       = document.getElementById("augmentations-tab");
        var hacknetnodes        = document.getElementById("hacknet-nodes-tab");
        var city                = document.getElementById("city-tab");
        var travel              = document.getElementById("travel-tab");
        var job                 = document.getElementById("job-tab");
        var stockmarket         = document.getElementById("stock-market-tab");
        var bladeburner         = document.getElementById("bladeburner-tab");
        var corp                = document.getElementById("corporation-tab");
        var gang                = document.getElementById("gang-tab");
        var tutorial            = document.getElementById("tutorial-tab");
        var options             = document.getElementById("options-tab");
        var dev                 = document.getElementById("dev-tab");

        //Load game from save or create new game
        if (loadGame(saveString)) {
            console.log("Loaded game from save");
            initBitNodes();
            initBitNodeMultipliers();
            initSourceFiles();
            Engine.setDisplayElements();    //Sets variables for important DOM elements
            Engine.init();                  //Initialize buttons, work, etc.
            initAugmentations();            //Also calls Player.reapplyAllAugmentations()
            Player.reapplyAllSourceFiles();
            initStockSymbols();
            if (Player.hasWseAccount) {
                initSymbolToStockMap();
            }
            initLiterature();
            initSingularitySFFlags();

            console.log(Player.intelligence_exp);

            //Calculate the number of cycles have elapsed while offline
            Engine._lastUpdate = new Date().getTime();
            var lastUpdate = Player.lastUpdate;
            var numCyclesOffline = Math.floor((Engine._lastUpdate - lastUpdate) / Engine._idleSpeed);

            /* Process offline progress */
            var offlineProductionFromScripts = loadAllRunningScripts();    //This also takes care of offline production for those scripts
            if (Player.isWorking) {
                console.log("work() called in load() for " + numCyclesOffline * Engine._idleSpeed + " milliseconds");
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
            }

            //Hacknet Nodes offline progress
            var offlineProductionFromHacknetNodes = processAllHacknetNodeEarnings(numCyclesOffline);

            //Passive faction rep gain offline
            processPassiveFactionRepGain(numCyclesOffline);

            // Stock Market offline progress
            if (Player.hasWseAccount) {
                processStockPrices(numCyclesOffline);
            }

            // Gang progress for BitNode 2
            if (Player.bitNodeN != null && Player.bitNodeN === 2 && Player.inGang()) {
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

            //Update total playtime
            var time = numCyclesOffline * Engine._idleSpeed;
            if (Player.totalPlaytime == null) {Player.totalPlaytime = 0;}
            if (Player.playtimeSinceLastAug == null) {Player.playtimeSinceLastAug = 0;}
            if (Player.playtimeSinceLastBitnode == null) {Player.playtimeSinceLastBitnode = 0;}
            Player.totalPlaytime += time;
            Player.playtimeSinceLastAug += time;
            Player.playtimeSinceLastBitnode += time;

            Player.lastUpdate = Engine._lastUpdate;
            Engine.start();                 //Run main game loop and Scripts loop
            removeLoadingScreen();
            dialogBoxCreate("While you were offline, your scripts generated <span class='money-gold'>$" +
                            formatNumber(offlineProductionFromScripts, 2) + "</span> and your Hacknet Nodes generated <span class='money-gold'>$" +
                            formatNumber(offlineProductionFromHacknetNodes, 2) + "</span>");
            //Close main menu accordions for loaded game
            var visibleMenuTabs = [terminal, createScript, activeScripts, stats,
                                   hacknetnodes, city, tutorial, options, dev];
            if (Player.firstFacInvRecvd) {visibleMenuTabs.push(factions);}
            else {factions.style.display = "none";}
            if (Player.firstAugPurchased) {visibleMenuTabs.push(augmentations);}
            else {augmentations.style.display = "none";}
            if (Player.companyName !== "") {visibleMenuTabs.push(job);}
            else {job.style.display = "none";}
            if (Player.firstTimeTraveled) {visibleMenuTabs.push(travel);}
            else {travel.style.display = "none";}
            if (Player.firstProgramAvailable) {visibleMenuTabs.push(createProgram);}
            else {createProgram.style.display = "none";}
            if (Player.hasWseAccount) {visibleMenuTabs.push(stockmarket);}
            else {stockmarket.style.display = "none";}
            if(Player.bladeburner instanceof Bladeburner) {visibleMenuTabs.push(bladeburner);}
            else {bladeburner.style.display = "none";}
            if(Player.corporation instanceof Corporation) {visibleMenuTabs.push(corp);}
            else {corp.style.display = "none";}
            if(Player.inGang()) {visibleMenuTabs.push(gang);}
            else {gang.style.display = "none";}

            Engine.closeMainMenuHeader(visibleMenuTabs);
        } else {
            //No save found, start new game
            console.log("Initializing new game");
            initBitNodes();
            initBitNodeMultipliers();
            initSourceFiles();
            initSpecialServerIps();
            Engine.setDisplayElements();        //Sets variables for important DOM elements
            Engine.start();                     //Run main game loop and Scripts loop
            Player.init();
            initForeignServers();
            initCompanies();
            initFactions();
            initAugmentations();
            initMessages();
            initStockSymbols();
            initLiterature();
            initSingularitySFFlags();

            //Open main menu accordions for new game
            //Main menu accordions
            var hackingHdr      = document.getElementById("hacking-menu-header");
            hackingHdr.classList.toggle("opened");
            var characterHdr    = document.getElementById("character-menu-header");
            characterHdr.classList.toggle("opened");
            var worldHdr        = document.getElementById("world-menu-header");
            worldHdr.classList.toggle("opened");
            var helpHdr         = document.getElementById("help-menu-header");
            helpHdr.classList.toggle("opened");

            //Hide tabs that wont be revealed until later
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

            Engine.openMainMenuHeader(
                [terminal, createScript, activeScripts, stats,
                 hacknetnodes, city,
                 tutorial, options]
            );

            //Start interactive tutorial
            iTutorialStart();
            removeLoadingScreen();
        }
        //Initialize labels on game settings
        setSettingsLabels();
        scriptEditorInit();
        Terminal.resetTerminalInput();
    },

    setDisplayElements: function() {
        //Content elements
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

        Engine.Display.worldContent = document.getElementById("world-container");
        Engine.Display.worldContent.style.display = "none";

        Engine.Display.createProgramContent = document.getElementById("create-program-container");
        Engine.Display.createProgramContent.style.display = "none";

        Engine.Display.factionsContent = document.getElementById("factions-container");
        Engine.Display.factionsContent.style.display = "none";


        Engine.Display.factionContent = document.getElementById("faction-container");
        Engine.Display.factionContent.style.display = "none";

        Engine.Display.factionAugmentationsContent = document.getElementById("faction-augmentations-container");
        Engine.Display.factionAugmentationsContent.style.display = "none";

        Engine.Display.augmentationsContent = document.getElementById("augmentations-container");
        Engine.Display.augmentationsContent.style.display = "none";


        Engine.Display.tutorialContent = document.getElementById("tutorial-container");
        Engine.Display.tutorialContent.style.display = "none";

        Engine.Display.infiltrationContent = document.getElementById("infiltration-container");
        Engine.Display.infiltrationContent.style.display = "none";

        Engine.Display.stockMarketContent = document.getElementById("stock-market-container");
        Engine.Display.stockMarketContent.style.display = "none";

        Engine.Display.missionContent = document.getElementById("mission-container");
        Engine.Display.missionContent.style.display = "none";

        //Character info
        Engine.Display.characterInfo = document.getElementById("character-content");

        //Location lists
        Engine.aevumLocationsList = document.getElementById("aevum-locations-list");
        Engine.chongqingLocationsList = document.getElementById("chongqing-locations-list");
        Engine.sector12LocationsList = document.getElementById("sector12-locations-list");
        Engine.newTokyoLocationsList = document.getElementById("newtokyo-locations-list");
        Engine.ishimaLocationsList = document.getElementById("ishima-locations-list");
        Engine.volhavenLocationsList = document.getElementById("volhaven-locations-list");

        //Location page (page that shows up when you visit a specific location in World)
        Engine.Display.locationContent = document.getElementById("location-container");
        //Engine.Display.locationContent.style.visibility = "hidden";
        Engine.Display.locationContent.style.display = "none";

        //Work In Progress
        Engine.Display.workInProgressContent = document.getElementById("work-in-progress-container");
        //Engine.Display.workInProgressContent.style.visibility = "hidden";
        Engine.Display.workInProgressContent.style.display = "none";

        //Red Pill / Hack World Daemon
        Engine.Display.redPillContent = document.getElementById("red-pill-container");
        Engine.Display.redPillContent.style.display = "none";

        //Cinematic Text
        Engine.Display.cinematicTextContent = document.getElementById("cinematic-text-container");
        Engine.Display.cinematicTextContent.style.display = "none";

		//Init Location buttons
		initLocationButtons();

        //Tutorial buttons
        Engine.Clickables.tutorialNetworkingButton = document.getElementById("tutorial-networking-link");
        Engine.Clickables.tutorialNetworkingButton.addEventListener("click", function() {
            Engine.displayTutorialPage(CONSTANTS.TutorialNetworkingText);
        });

        Engine.Clickables.tutorialHackingButton = document.getElementById("tutorial-hacking-link");
        Engine.Clickables.tutorialHackingButton.addEventListener("click", function() {
            Engine.displayTutorialPage(CONSTANTS.TutorialHackingText);
        });

        Engine.Clickables.tutorialScriptsButton = document.getElementById("tutorial-scripts-link");
        Engine.Clickables.tutorialScriptsButton.addEventListener("click", function() {
            Engine.displayTutorialPage(CONSTANTS.TutorialScriptsText);
        });

        Engine.Clickables.tutorialNetscriptButton = document.getElementById("tutorial-netscript-link");
        Engine.Clickables.tutorialNetscriptButton.addEventListener("click", function() {
            Engine.displayTutorialPage(CONSTANTS.TutorialNetscriptText);
        });

        Engine.Clickables.tutorialTravelingButton = document.getElementById("tutorial-traveling-link");
        Engine.Clickables.tutorialTravelingButton.addEventListener("click", function() {
            Engine.displayTutorialPage(CONSTANTS.TutorialTravelingText);
        });

        Engine.Clickables.tutorialCompaniesButton = document.getElementById("tutorial-jobs-link");
        Engine.Clickables.tutorialCompaniesButton.addEventListener("click", function() {
            Engine.displayTutorialPage(CONSTANTS.TutorialCompaniesText);
        });

        Engine.Clickables.tutorialFactionsButton = document.getElementById("tutorial-factions-link");
        Engine.Clickables.tutorialFactionsButton.addEventListener("click", function() {
            Engine.displayTutorialPage(CONSTANTS.TutorialFactionsText);
        });

        Engine.Clickables.tutorialAugmentationsButton = document.getElementById("tutorial-augmentations-link");
        Engine.Clickables.tutorialAugmentationsButton.addEventListener("click", function() {
            Engine.displayTutorialPage(CONSTANTS.TutorialAugmentationsText);
        });

        Engine.Clickables.tutorialBackButton = document.getElementById("tutorial-back-button");
        Engine.Clickables.tutorialBackButton.addEventListener("click", function() {
            Engine.displayTutorialContent();
        });
    },

    /* Initialization */
    init: function() {
        //Import game link
        document.getElementById("import-game-link").onclick = function() {
            saveObject.importGame();
        };

        //Main menu accordions
        var hackingHdr      = document.getElementById("hacking-menu-header");
        var characterHdr    = document.getElementById("character-menu-header");
        var worldHdr        = document.getElementById("world-menu-header");
        var helpHdr         = document.getElementById("help-menu-header");

        hackingHdr.onclick = function() {
            var terminal            = document.getElementById("terminal-tab");
            var terminalLink        = document.getElementById("terminal-menu-link");
            var createScript        = document.getElementById("create-script-tab");
            var createScriptLink    = document.getElementById("create-script-menu-link");
            var activeScripts       = document.getElementById("active-scripts-tab");
            var activeScriptsLink   = document.getElementById("active-scripts-menu-link");
            var createProgram       = document.getElementById("create-program-tab");
            var createProgramLink   = document.getElementById("create-program-menu-link");
            var createProgramNot    = document.getElementById("create-program-notification");
            this.classList.toggle("opened");
            if (terminal.style.maxHeight) {
                Engine.toggleMainMenuHeader(false,
                    [terminal, createScript, activeScripts, createProgram],
                    [terminalLink, createScriptLink, activeScriptsLink, createProgramLink]
                );

                createProgramNot.style.display = "none";
            } else {
                Engine.toggleMainMenuHeader(true,
                    [terminal, createScript, activeScripts, createProgram],
                    [terminalLink, createScriptLink, activeScriptsLink, createProgramLink]
                );

                createProgramNot.style.display = "block"
            }
        }

        characterHdr.onclick = function() {
            var stats               = document.getElementById("stats-tab");
            var statsLink           = document.getElementById("stats-menu-link");
            var factions            = document.getElementById("factions-tab");
            var factionsLink        = document.getElementById("factions-menu-link");
            var augmentations       = document.getElementById("augmentations-tab");
            var augmentationsLink   = document.getElementById("augmentations-menu-link");
            var hacknetnodes        = document.getElementById("hacknet-nodes-tab");
            var hacknetnodesLink    = document.getElementById("hacknet-nodes-menu-link");
            this.classList.toggle("opened");
            if (stats.style.maxHeight) {
                Engine.toggleMainMenuHeader(false,
                    [stats, factions, augmentations, hacknetnodes],
                    [statsLink, factionsLink, augmentationsLink, hacknetnodesLink]
                );
            } else {
                Engine.toggleMainMenuHeader(true,
                    [stats, factions, augmentations, hacknetnodes],
                    [statsLink, factionsLink, augmentationsLink, hacknetnodesLink]
                );
            }
        }

        worldHdr.onclick = function() {
            var city                = document.getElementById("city-tab");
            var cityLink            = document.getElementById("city-menu-link");
            var travel              = document.getElementById("travel-tab");
            var travelLink          = document.getElementById("travel-menu-link");
            var job                 = document.getElementById("job-tab");
            var jobLink             = document.getElementById("job-menu-link");
            var stockmarket         = document.getElementById("stock-market-tab");
            var stockmarketLink     = document.getElementById("stock-market-menu-link");
            var bladeburner         = document.getElementById("bladeburner-tab");
            var bladeburnerLink     = document.getElementById("bladeburner-menu-link");
            var corporation         = document.getElementById("corporation-tab");
            var corporationLink     = document.getElementById("corporation-menu-link");
            var gang                = document.getElementById("gang-tab");
            var gangLink            = document.getElementById("gang-menu-link");

            // Determine whether certain links should show up
            job.style.display           = Player.companyName !== ""                 ? "list-item" : "none";
            stockmarket.style.display   = Player.hasWseAccount                      ? "list-item" : "none";
            bladeburner.style.display   = Player.bladeburner instanceof Bladeburner ? "list-item" : "none";
            corporation.style.display   = Player.corporation instanceof Corporation ? "list-item" : "none";
            gang.style.display          = Player.inGang()                           ? "list-item" : "none";

            this.classList.toggle("opened");
            if (city.style.maxHeight) {
                Engine.toggleMainMenuHeader(false,
                    [city, travel, job, stockmarket, bladeburner, corporation, gang],
                    [cityLink, travelLink, jobLink, stockmarketLink, bladeburnerLink, corporationLink, gangLink]
                );
            } else {
                Engine.toggleMainMenuHeader(true,
                    [city, travel, job, stockmarket, bladeburner, corporation, gang],
                    [cityLink, travelLink, jobLink, stockmarketLink, bladeburnerLink, corporationLink, gangLink]
                );
            }
        }

        helpHdr.onclick = function() {
            var tutorial        = document.getElementById("tutorial-tab");
            var tutorialLink    = document.getElementById("tutorial-menu-link");
            var options         = document.getElementById("options-tab");
            var optionsLink     = document.getElementById("options-menu-link");
            this.classList.toggle("opened");
            const elems = [tutorial, options];
            const links = [tutorialLink, optionsLink];
            if (process.env.NODE_ENV === "development") {
                elems.push(document.getElementById("dev-tab"));
                links.push(document.getElementById("dev-menu-link"));
            }
            if (tutorial.style.maxHeight) {
                Engine.toggleMainMenuHeader(false, elems, links);
            } else {
                Engine.toggleMainMenuHeader(true, elems, links);
            }
        }

        //Main menu buttons and content
        Engine.Clickables.terminalMainMenuButton = clearEventListeners("terminal-menu-link");
        Engine.Clickables.terminalMainMenuButton.addEventListener("click", function() {
            Engine.loadTerminalContent();
            return false;
        });

        Engine.Clickables.characterMainMenuButton = clearEventListeners("stats-menu-link");
        Engine.Clickables.characterMainMenuButton.addEventListener("click", function() {
            Engine.loadCharacterContent();
            return false;
        });

        Engine.Clickables.scriptEditorMainMenuButton = clearEventListeners("create-script-menu-link");
        Engine.Clickables.scriptEditorMainMenuButton.addEventListener("click", function() {
            Engine.loadScriptEditorContent();
            return false;
        });

        Engine.Clickables.activeScriptsMainMenuButton = clearEventListeners("active-scripts-menu-link");
        Engine.Clickables.activeScriptsMainMenuButton.addEventListener("click", function() {
            Engine.loadActiveScriptsContent();
            return false;
        });

        Engine.Clickables.hacknetNodesMainMenuButton = clearEventListeners("hacknet-nodes-menu-link");
        Engine.Clickables.hacknetNodesMainMenuButton.addEventListener("click", function() {
            Engine.loadHacknetNodesContent();
            return false;
        });

        Engine.Clickables.worldMainMenuButton = clearEventListeners("city-menu-link");
        Engine.Clickables.worldMainMenuButton.addEventListener("click", function() {
            Engine.loadWorldContent();
            return false;
        });

        Engine.Clickables.travelMainMenuButton = clearEventListeners("travel-menu-link");
        Engine.Clickables.travelMainMenuButton.addEventListener("click", function() {
            Engine.loadTravelContent();
            Engine.Clickables.travelMainMenuButton.classList.add("active");
            return false;
        });

        Engine.Clickables.jobMainMenuButton = clearEventListeners("job-menu-link");
        Engine.Clickables.jobMainMenuButton.addEventListener("click", function() {
            Engine.loadJobContent();
            return false;
        });

        Engine.Clickables.stockmarketMainMenuButton = clearEventListeners("stock-market-menu-link");
        Engine.Clickables.stockmarketMainMenuButton.addEventListener("click", function() {
            Engine.loadStockMarketContent();
            Engine.Clickables.stockmarketMainMenuButton.classList.add("active");
            return false;
        });


        Engine.Clickables.createProgramMainMenuButton = clearEventListeners("create-program-menu-link");
        Engine.Clickables.createProgramMainMenuButton.addEventListener("click", function() {
            Engine.loadCreateProgramContent();
            return false;
        });

        Engine.Clickables.factionsMainMenuButton = clearEventListeners("factions-menu-link");
        Engine.Clickables.factionsMainMenuButton.addEventListener("click", function() {
            Engine.loadFactionsContent();
            return false;
        });

        Engine.Clickables.augmentationsMainMenuButton = clearEventListeners("augmentations-menu-link");
        Engine.Clickables.augmentationsMainMenuButton.addEventListener("click", function() {
            Engine.loadAugmentationsContent();
            return false;
        });

        Engine.Clickables.tutorialMainMenuButton = clearEventListeners("tutorial-menu-link");
        Engine.Clickables.tutorialMainMenuButton.addEventListener("click", function() {
            Engine.loadTutorialContent();
            return false;
        });

        Engine.Clickables.bladeburnerMenuButton = clearEventListeners("bladeburner-menu-link");
        Engine.Clickables.bladeburnerMenuButton.addEventListener("click", function() {
            Engine.loadBladeburnerContent();
            return false;
        });
        Engine.Clickables.corporationMenuButton = clearEventListeners("corporation-menu-link");
        Engine.Clickables.corporationMenuButton.addEventListener("click", function() {
            Engine.loadCorporationContent();
            Engine.Clickables.corporationMenuButton.classList.add("active");
            return false;
        });
        Engine.Clickables.gangMenuButton = clearEventListeners("gang-menu-link");
        Engine.Clickables.gangMenuButton.addEventListener("click", function() {
            Engine.loadGangContent();
            return false;
        });


        Engine.Clickables.devMainMenuButton = clearEventListeners("dev-menu-link");
        Engine.Clickables.devMainMenuButton.addEventListener("click", function() {
            if( process.env.NODE_ENV === "development") {
                Engine.loadDevMenuContent();
            }
            return false;
        });

        //Active scripts list
        Engine.ActiveScriptsList = document.getElementById("active-scripts-list");

        //Save, Delete, Import/Export buttons
        Engine.Clickables.saveMainMenuButton = document.getElementById("save-game-link");
        Engine.Clickables.saveMainMenuButton.addEventListener("click", function() {
            saveObject.saveGame(indexedDb);
            return false;
        });

        Engine.Clickables.deleteMainMenuButton = document.getElementById("delete-game-link");
        Engine.Clickables.deleteMainMenuButton.addEventListener("click", function() {
            saveObject.deleteGame(indexedDb);
            return false;
        });

        document.getElementById("export-game-link").addEventListener("click", function() {
            saveObject.exportGame();
            return false;
        });

        //Character Overview buttons
        document.getElementById("character-overview-save-button").addEventListener("click", function() {
            saveObject.saveGame(indexedDb);
            return false;
        });

        document.getElementById("character-overview-options-button").addEventListener("click", function() {
            gameOptionsBoxOpen();
            return false;
        });

        //Create Program buttons
        initCreateProgramButtons();

        //Message at the top of terminal
        postNetburnerText();

        //Player was working cancel button
        if (Player.isWorking) {
            var cancelButton = document.getElementById("work-in-progress-cancel-button");
            cancelButton.addEventListener("click", function() {
                if (Player.workType == CONSTANTS.WorkTypeFaction) {
                    var fac = Factions[Player.currentWorkFactionName];
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
            Engine.loadWorkInProgressContent();
        }

        //character overview screen
        document.getElementById("character-overview-container").style.display = "block";

        //Remove classes from links (they might be set from tutorial)
        document.getElementById("terminal-menu-link").removeAttribute("class");
        document.getElementById("stats-menu-link").removeAttribute("class");
        document.getElementById("create-script-menu-link").removeAttribute("class");
        document.getElementById("active-scripts-menu-link").removeAttribute("class");
        document.getElementById("hacknet-nodes-menu-link").removeAttribute("class");
        document.getElementById("city-menu-link").removeAttribute("class");
        document.getElementById("tutorial-menu-link").removeAttribute("class");

        // Copy Save Data to Clipboard
        document.getElementById("copy-save-to-clipboard-link").addEventListener("click", function() {
            const saveString = saveObject.getSaveString();
            if (!navigator.clipboard) {
                // Async Clipboard API not supported, so we'll use this using the
                // textarea and document.execCommand('copy') trick
                const textArea = document.createElement("textarea");
                textArea.value = saveString;
                textArea.setAttribute("readonly", '');
                textArea.style.position = 'absolute';
                textArea.left = '-9999px';
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
                } catch(e) {
                    console.error("Unable to copy save data to clipboard using document.execCommand('copy')");
                    createStatusText("Failed to copy save");
                }
                document.body.removeChild(textArea);
            } else {
                // Use the Async Clipboard API
                navigator.clipboard.writeText(saveString).then(function() {
                    createStatusText("Copied save to clipboard");
                }, function(e) {
                    console.error("Unable to copy save data to clipboard using Async API");
                    createStatusText("Failed to copy save");
                })
            }
        });

        //DEBUG Delete active Scripts on home
        document.getElementById("debug-delete-scripts-link").addEventListener("click", function() {
            console.log("Deleting running scripts on home computer");
            Player.getHomeComputer().runningScripts = [];
            dialogBoxCreate("Forcefully deleted all running scripts on home computer. Please save and refresh page");
            gameOptionsBoxClose();
            return false;
        });

        //DEBUG Soft Reset
        document.getElementById("debug-soft-reset").addEventListener("click", function() {
            dialogBoxCreate("Soft Reset!");
            prestigeAugmentation();
            gameOptionsBoxClose();
            return false;
        });
    },

    start: function() {
        //Run main loop
        Engine.idleTimer();

        //Scripts
        runScriptsLoop();
    }
};

var indexedDb, indexedDbRequest;
window.onload = function() {
    if (!window.indexedDB) {
        return Engine.load(null); //Will try to load from localstorage
    }

    //DB is called bitburnerSave
    //Object store is called savestring
    //key for the Object store is called save
    indexedDbRequest = window.indexedDB.open("bitburnerSave", 1);

    indexedDbRequest.onerror = function(e) {
        console.log("Error opening indexedDB: ");
        console.log(e);
        return Engine.load(null); //Try to load from localstorage
    };

    indexedDbRequest.onsuccess = function(e) {
        console.log("Opening bitburnerSave database successful!");
        indexedDb = e.target.result;
        var transaction = indexedDb.transaction(["savestring"]);
        var objectStore = transaction.objectStore("savestring");
        var request = objectStore.get("save");
        request.onerror = function(e) {
            console.log("Error in Database request to get savestring: " + e);
            return Engine.load(null); //Try to load from localstorage
        }

        request.onsuccess = function(e) {
            Engine.load(request.result); //Is this right?
        }
    };

    indexedDbRequest.onupgradeneeded = function(e) {
        var db = e.target.result;
        var objectStore = db.createObjectStore("savestring");
    }
};

export {Engine};
