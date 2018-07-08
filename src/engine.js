import {dialogBoxCreate}                        from "../utils/DialogBox";
import {gameOptionsBoxOpen, gameOptionsBoxClose}from "../utils/GameOptions";
import {removeChildrenFromElement}              from "../utils/HelperFunctions";
import {clearEventListeners}                    from "../utils/uiHelpers/clearEventListeners";
import {createElement}                          from "../utils/uiHelpers/createElement";
import {exceptionAlert}                         from "../utils/helpers/exceptionAlert";
import numeral                                  from "numeral/min/numeral.min";
import {formatNumber,
        convertTimeMsToTimeElapsedString,
        replaceAt}                              from "../utils/StringHelperFunctions";
import {loxBoxCreate, logBoxUpdateText,
        logBoxOpened}                           from "../utils/LogBox";

import {updateActiveScriptsItems}               from "./ActiveScriptsUI";
import {Augmentations, installAugmentations,
        initAugmentations, AugmentationNames,
        displayAugmentationsContent,
        PlayerOwnedAugmentation}                from "./Augmentations";
import {BitNodes, initBitNodes,
        initBitNodeMultipliers}                 from "./BitNode";
import {Bladeburner}                            from "./Bladeburner";
import {cinematicTextFlag}                      from "./CinematicText";
import {CompanyPositions, initCompanies}        from "./Company";
import {Corporation}                            from "./CompanyManagement";
import {CONSTANTS}                              from "./Constants";
import {displayCreateProgramContent,
        getNumAvailableCreateProgram,
        initCreateProgramButtons,
        Programs}                               from "./CreateProgram";
import {displayFactionContent, joinFaction,
        processPassiveFactionRepGain, Factions,
        inviteToFaction, initFactions}          from "./Faction";
import {FconfSettings}                          from "./Fconf";
import {Locations, displayLocationContent,
        initLocationButtons}                    from "./Location";
import {displayGangContent, updateGangContent,
        Gang}                                   from "./Gang";
import {displayHacknetNodesContent, processAllHacknetNodeEarnings,
        updateHacknetNodesContent}              from "./HacknetNode";
import {iTutorialStart}                         from "./InteractiveTutorial";
import {initLiterature}                         from "./Literature";
import {checkForMessagesToSend, initMessages}   from "./Message";
import {inMission, currMission}                 from "./Missions";
import {initSingularitySFFlags,
        hasSingularitySF, hasCorporationSF}     from "./NetscriptFunctions";
import {updateOnlineScriptTimes,
        runScriptsLoop}                         from "./NetscriptWorker";
import {Player}                                 from "./Player";
import {prestigeAugmentation,
        prestigeSourceFile}                     from "./Prestige";
import {redPillFlag, hackWorldDaemon}           from "./RedPill";
import {saveObject, loadGame}                   from "./SaveObject";
import {loadAllRunningScripts, scriptEditorInit,
        updateScriptEditorContent}              from "./Script";
import {AllServers, Server, initForeignServers} from "./Server";
import {Settings, setSettingsLabels}            from "./Settings";
import {initSourceFiles, SourceFiles,
        PlayerOwnedSourceFile}                  from "./SourceFile";
import {SpecialServerIps, initSpecialServerIps} from "./SpecialServerIps";
import {StockMarket, StockSymbols,
        SymbolToStockMap, initStockSymbols,
        initSymbolToStockMap, stockMarketCycle,
        updateStockPrices,
        displayStockMarketContent}              from "./StockMarket";
import {Terminal, postNetburnerText, post, KEY} from "./Terminal";

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
            if (Engine.currentPage === Engine.Page.Terminal && FconfSettings.ENABLE_BASH_HOTKEYS) {
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

let Engine = {
    version: "",
    Debug: true,

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
        createProgramMainMenuButton:    null,
        factionsMainMenuButton:         null,
        augmentationsMainMenuButton:    null,
        tutorialMainMenuButton:         null,
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

        //Dev menu
        devMenuGiveMoney:   null,
        devMenuGiveRam:     null,
        devMenuAugDropdown: null,
        devMenuAddAug:      null,
        devMenuTriggerBitFlume: null,
        devMenuFactionDropdown: null,
        devMenuAddFaction: null,
        devMenuOpen: null,
        devMenuMinSecurity: null,
        devMenuMaxMoney: null,
        devMenuConnectDropdown: null,
        devMenuConnect: null,
        devMenuProgramsDropdown: null,
        devMenuAddProgram: null,
        devMenuHackingExp: null,
        devMenuAddHacking: null,
        devMenuStrengthExp: null,
        devMenuAddStrength: null,
        devMenuDefenseExp: null,
        devMenuAddDefense: null,
        devMenuDexterityExp: null,
        devMenuAddDexterity: null,
        devMenuAgilityExp: null,
        devMenuAddAgility: null,
        devMenuCharismaExp: null,
        devMenuAddCharisma: null,
        devMenuIntelligenceExp: null,
        devMenuAddIntelligence: null,
        devMenuEnableIntelligence: null,
        devMenuDisableIntelligence: null,
        devMenuSFN: null,
        devMenuSFLvl: null,
        devMenuAddSF: null,
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
        devMenuContent:                 null,
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

    //Current page status
    Page: {
        Terminal:           "Terminal",
        CharacterInfo:      "CharacterInfo",
        ScriptEditor:       "ScriptEditor",
        ActiveScripts:      "ActiveScripts",
        HacknetNodes:       "HacknetNodes",
        World:              "World",
        CreateProgram:      "CreateProgram",
        Factions:           "Factions",
        Faction:            "Faction",
        Augmentations:      "Augmentations",
        Tutorial:           "Tutorial",
        DevMenu:            "Dev Menu",
        Location:           "Location",
        workInProgress:     "WorkInProgress",
        RedPill:            "RedPill",
        CinematicText:      "CinematicText",
        Infiltration:       "Infiltration",
        StockMarket:        "StockMarket",
        Gang:               "Gang",
        Mission:            "Mission",
        Corporation:        "Corporation",
        Bladeburner:        "Bladeburner",
    },
    currentPage:    null,


    //Time variables (milliseconds unix epoch time)
    _lastUpdate: new Date().getTime(),
    _idleSpeed: 200,    //Speed (in ms) at which the main loop is updated


    /* Load content when a main menu button is clicked */
    loadTerminalContent: function() {
        Engine.hideAllContent();
        Engine.Display.terminalContent.style.display = "block";
        Engine.currentPage = Engine.Page.Terminal;
        document.getElementById("terminal-menu-link").classList.add("active");
    },

    loadCharacterContent: function() {
        Engine.hideAllContent();
        Engine.Display.characterContent.style.display = "block";
        Engine.displayCharacterInfo();
        Engine.currentPage = Engine.Page.CharacterInfo;
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
        Engine.currentPage = Engine.Page.ScriptEditor;
        document.getElementById("create-script-menu-link").classList.add("active");
    },

    loadActiveScriptsContent: function() {
        Engine.hideAllContent();
        Engine.Display.activeScriptsContent.style.display = "block";
        updateActiveScriptsItems();
        Engine.currentPage = Engine.Page.ActiveScripts;
        document.getElementById("active-scripts-menu-link").classList.add("active");
    },

    loadHacknetNodesContent: function() {
        Engine.hideAllContent();
        Engine.Display.hacknetNodesContent.style.display = "block";
        displayHacknetNodesContent();
        Engine.currentPage = Engine.Page.HacknetNodes;
        document.getElementById("hacknet-nodes-menu-link").classList.add("active");
    },

    loadWorldContent: function() {
        Engine.hideAllContent();
        Engine.Display.worldContent.style.display = "block";
        Engine.displayWorldInfo();
        Engine.currentPage = Engine.Page.World;
        document.getElementById("city-menu-link").classList.add("active");
    },

    loadCreateProgramContent: function() {
        Engine.hideAllContent();
        Engine.Display.createProgramContent.style.display = "block";
        displayCreateProgramContent();
        Engine.currentPage = Engine.Page.CreateProgram;
        document.getElementById("create-program-menu-link").classList.add("active");
    },

    loadFactionsContent: function() {
        Engine.hideAllContent();
        Engine.Display.factionsContent.style.display = "block";
        Engine.displayFactionsInfo();
        Engine.currentPage = Engine.Page.Factions;
        document.getElementById("factions-menu-link").classList.add("active");
    },

    loadFactionContent: function() {
        Engine.hideAllContent();
        Engine.Display.factionContent.style.display = "block";
        Engine.currentPage = Engine.Page.Faction;
    },

    loadAugmentationsContent: function() {
        Engine.hideAllContent();
        Engine.Display.augmentationsContent.style.display = "block";
        displayAugmentationsContent();
        Engine.currentPage = Engine.Page.Augmentations;
        document.getElementById("augmentations-menu-link").classList.add("active");
    },

    loadTutorialContent: function() {
        Engine.hideAllContent();
        Engine.Display.tutorialContent.style.display = "block";
        Engine.displayTutorialContent();
        Engine.currentPage = Engine.Page.Tutorial;
        document.getElementById("tutorial-menu-link").classList.add("active");
    },

    loadDevMenuContent: function() {
        Engine.hideAllContent();
        Engine.Display.devMenuContent.style.display = "block";
        Engine.displayDevMenuContent();
        Engine.currentPage = Engine.Page.DevMenu;
        document.getElementById("dev-menu-link").classList.add("active");
    },

    loadLocationContent: function() {
        Engine.hideAllContent();
        Engine.Display.locationContent.style.display = "block";
        displayLocationContent();
        Engine.currentPage = Engine.Page.Location;
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
        Engine.currentPage = Engine.Page.WorkInProgress;
    },

    loadRedPillContent: function() {
        Engine.hideAllContent();
        var mainMenu = document.getElementById("mainmenu-container");
        mainMenu.style.visibility = "hidden";
        Engine.Display.redPillContent.style.display = "block";
        Engine.currentPage = Engine.Page.RedPill;
    },

    loadCinematicTextContent: function() {
        Engine.hideAllContent();
        var mainMenu = document.getElementById("mainmenu-container");
        mainMenu.style.visibility = "hidden";
        Engine.Display.cinematicTextContent.style.display = "block";
        Engine.currentPage = Engine.Page.CinematicText;
    },

    loadInfiltrationContent: function() {
        Engine.hideAllContent();
        Engine.Display.infiltrationContent.style.display = "block";
        Engine.currentPage = Engine.Page.Infiltration;
    },

    loadStockMarketContent: function() {
        Engine.hideAllContent();
        Engine.Display.stockMarketContent.style.display = "block";
        Engine.currentPage = Engine.Page.StockMarket;
        displayStockMarketContent();
    },

    loadGangContent: function() {
        Engine.hideAllContent();
        if (document.getElementById("gang-container") || Player.inGang()) {
            displayGangContent();
            Engine.currentPage = Engine.Page.Gang;
        } else {
            Engine.loadTerminalContent();
            Engine.currentPage = Engine.Page.Terminal;
        }
    },

    loadMissionContent: function() {
        Engine.hideAllContent();
        document.getElementById("mainmenu-container").style.visibility = "hidden";
        document.getElementById("character-overview-wrapper").style.visibility = "hidden";
        Engine.Display.missionContent.style.display = "block";
        Engine.currentPage = Engine.Page.Mission;
    },

    loadCorporationContent: function() {
        if (Player.corporation instanceof Corporation) {
            Engine.hideAllContent();
            document.getElementById("character-overview-wrapper").style.visibility = "hidden";
            Player.corporation.createUI();
            Engine.currentPage = Engine.Page.Corporation;
        }
    },

    loadBladeburnerContent: function() {
        if (Player.bladeburner instanceof Bladeburner) {
            try {
                Engine.hideAllContent();
                Engine.currentPage = Engine.Page.Bladeburner;
                Player.bladeburner.createContent();
            } catch(e) {
                exceptionAlert(e);
            }
        }
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
        Engine.Display.devMenuContent.style.display = "none";
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
        document.getElementById("tutorial-menu-link").classList.remove("active");
        document.getElementById("options-menu-link").classList.remove("active");
        document.getElementById("dev-menu-link").classList.remove("active");
    },

    displayCharacterOverviewInfo: function() {
        if (Player.hp == null) {Player.hp = Player.max_hp;}
        var overviewText = "Hp:    " + Player.hp + " / " + Player.max_hp + "<br>" +
                           "Money: " + numeral(Player.money.toNumber()).format('($0.000a)') + "<br>" +
                           "Hack:  " + (Player.hacking_skill).toLocaleString() + "<br>" +
                           "Str:   " + (Player.strength).toLocaleString() + "<br>" +
                           "Def:   " + (Player.defense).toLocaleString() + "<br>" +
                           "Dex:   " + (Player.dexterity).toLocaleString() + "<br>" +
                           "Agi:   " + (Player.agility).toLocaleString() + "<br>" +
                           "Cha:   " + (Player.charisma).toLocaleString();
        if (Player.intelligence >= 1) {
            overviewText += "<br>Int:   " + (Player.intelligence).toLocaleString();
        }
        document.getElementById("character-overview-text").innerHTML = overviewText.replace( / /g, "&nbsp;");
    },

    /* Display character info */
    displayCharacterInfo: function() {
        removeChildrenFromElement(Engine.Display.characterInfo);

        var companyPosition = "";
        if (Player.companyPosition != "") {
            companyPosition = Player.companyPosition.positionName;
        }

        var intText = "";
        if (Player.intelligence > 0) {
            intText = 'Intelligence:  ' + (Player.intelligence).toLocaleString() + "<br><br><br>";
        }

        let bitNodeTimeText = "";
        if(Player.sourceFiles.length > 0) {
            bitNodeTimeText = 'Time played since last Bitnode destroyed: ' + convertTimeMsToTimeElapsedString(Player.playtimeSinceLastBitnode) + '<br>';
        }

        Engine.Display.characterInfo.appendChild(createElement("pre", {
            innerHTML:
            '<b>General</b><br><br>' +
            'Current City: ' + Player.city + '<br><br>' +
            'Employer: ' + Player.companyName + '<br>' +
            'Job Title: ' + companyPosition + '<br><br>' +
            'Money: $' + formatNumber(Player.money.toNumber(), 2)+ '<br><br><br>' +
            '<b>Stats</b><br><br>' +
            'Hacking Level: ' + (Player.hacking_skill).toLocaleString() +
                            " (" + numeral(Player.hacking_exp).format('(0.000a)') + ' experience)<br>' +
            'Strength:      ' + (Player.strength).toLocaleString() +
                       " (" + numeral(Player.strength_exp).format('(0.000a)') + ' experience)<br>' +
            'Defense:       ' + (Player.defense).toLocaleString() +
                      " (" + numeral(Player.defense_exp).format('(0.000a)')+ ' experience)<br>' +
            'Dexterity:     ' + (Player.dexterity).toLocaleString() +
                       " (" + numeral(Player.dexterity_exp).format('(0.000a)') + ' experience)<br>' +
            'Agility:       ' + (Player.agility).toLocaleString() +
                      " (" + numeral(Player.agility_exp).format('(0.000a)') + ' experience)<br>' +
            'Charisma:      ' + (Player.charisma).toLocaleString() +
                       " (" + numeral(Player.charisma_exp).format('(0.000a)') + ' experience)<br>' +
            intText +
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

    displayDevMenuContent: function() {
        Engine.Clickables.devMenuGiveMoney.style.display = "block";
        Engine.Clickables.devMenuGiveRam.style.display = "block";
        Engine.Clickables.devMenuAugDropdown.style.display = "block";
        Engine.Clickables.devMenuAddAug.style.display = "block";
        Engine.Clickables.devMenuTriggerBitFlume.style.display = "block";
        Engine.Clickables.devMenuFactionDropdown.style.display = "block";
        Engine.Clickables.devMenuAddFaction.style.display = "block";
        Engine.Clickables.devMenuOpen.style.display = "block";
        Engine.Clickables.devMenuMinSecurity.style.display = "block";
        Engine.Clickables.devMenuMaxMoney.style.display = "block";
        Engine.Clickables.devMenuConnectDropdown.style.display = "block";
        Engine.Clickables.devMenuConnect.style.display = "block";
        Engine.Clickables.devMenuProgramsDropdown.style.display = "block";
        Engine.Clickables.devMenuAddProgram.style.display = "block";

        Engine.Clickables.devMenuHackingExp.style.display = "block";
        Engine.Clickables.devMenuAddHacking.style.display = "block";
        Engine.Clickables.devMenuStrengthExp.style.display = "block";
        Engine.Clickables.devMenuAddStrength.style.display = "block";
        Engine.Clickables.devMenuDefenseExp.style.display = "block";
        Engine.Clickables.devMenuAddDefense.style.display = "block";
        Engine.Clickables.devMenuDexterityExp.style.display = "block";
        Engine.Clickables.devMenuAddDexterity.style.display = "block";
        Engine.Clickables.devMenuAgilityExp.style.display = "block";
        Engine.Clickables.devMenuAddAgility.style.display = "block";
        Engine.Clickables.devMenuCharismaExp.style.display = "block";
        Engine.Clickables.devMenuAddCharisma.style.display = "block";
        Engine.Clickables.devMenuIntelligenceExp.style.display = "block";
        Engine.Clickables.devMenuAddIntelligence.style.display = "block";
        Engine.Clickables.devMenuEnableIntelligence.style.display = "block";
        Engine.Clickables.devMenuDisableIntelligence.style.display = "block";
        Engine.Clickables.devMenuSFN.style.display = "block";
        Engine.Clickables.devMenuSFLvl.style.display = "block";
        Engine.Clickables.devMenuAddSF.style.display = "block";
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
        //Update total playtime
        var time = numCycles * Engine._idleSpeed;
        if (Player.totalPlaytime == null) {Player.totalPlaytime = 0;}
        if (Player.playtimeSinceLastAug == null) {Player.playtimeSinceLastAug = 0;}
        if (Player.playtimeSinceLastBitnode == null) {Player.playtimeSinceLastBitnode = 0;}
        Player.totalPlaytime += time;
        Player.playtimeSinceLastAug += time;
        Player.playtimeSinceLastBitnode += time;

        //Start Manual hack
        if (Player.startAction == true) {
            Engine._totalActionTime = Player.actionTime;
            Engine._actionTimeLeft = Player.actionTime;
            Engine._actionInProgress = true;
            Engine._actionProgressBarCount = 1;
            Engine._actionProgressStr = "[                                                  ]";
            Engine._actionTimeStr = "Time left: ";
            Player.startAction = false;
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

        //Gang, if applicable
        if (Player.bitNodeN == 2 && Player.inGang()) {
            Player.gang.process(numCycles);
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
        stockTick:  30,                     //Update stock prices
        sCr: 1500,
        mechanicProcess: 5,                 //Processes certain mechanics (Corporation, Bladeburner)
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
            if (Engine.currentPage === Engine.Page.ActiveScripts) {
                Engine.Counters.updateActiveScriptsDisplay = 5;
            } else {
                Engine.Counters.updateActiveScriptsDisplay = 10;
            }
        }

        if (Engine.Counters.updateDisplays <= 0) {
            Engine.displayCharacterOverviewInfo();
            if (Engine.currentPage == Engine.Page.CharacterInfo) {
                Engine.displayCharacterInfo();
            }  else if (Engine.currentPage == Engine.Page.HacknetNodes) {
                updateHacknetNodesContent();
            } else if (Engine.currentPage == Engine.Page.CreateProgram) {
                displayCreateProgramContent();
            }

            if (logBoxOpened) {
                logBoxUpdateText();
            }

            Engine.Counters.updateDisplays = 3;
        }

        if (Engine.Counters.updateDisplaysMed <= 0) {
            if (Engine.currentPage === Engine.Page.Corporation) {
                Player.corporation.updateUIContent();
            }
            Engine.Counters.updateDisplaysMed = 9;
        }

        if (Engine.Counters.updateDisplaysLong <= 0) {
            if (Engine.currentPage === Engine.Page.Gang) {
                updateGangContent();
            } else if (Engine.currentPage === Engine.Page.ScriptEditor) {
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

        if (Engine.Counters.stockTick <= 0) {
            if (Player.hasWseAccount) {
                updateStockPrices();
            }
            Engine.Counters.stockTick = 30;
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

    _prevTimeout: null,
    createStatusText: function(txt) {
        if (Engine._prevTimeout != null) {
            clearTimeout(Engine._prevTimeout);
            Engine._prevTimeout = null;
        }
        var statusText = document.getElementById("status-text")
        statusText.style.display = "inline-block";
        statusText.setAttribute("class", "status-text");
        statusText.innerHTML = txt;
        Engine._prevTimeout = setTimeout(function() {
            statusText.style.display = "none";
            statusText.removeAttribute("class");
            statusText.innerHTML = "";
        }, 3000);
    },

    removeLoadingScreen: function() {
        var loader = document.getElementById("loader");
        if (!loader) {return;}
        while(loader.firstChild) {
            loader.removeChild(loader.firstChild);
        }
        loader.parentNode.removeChild(loader);
        document.getElementById("entire-game-container").style.visibility = "visible";
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
            CompanyPositions.init();
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

            //Gang progress for BitNode 2
            if (Player.bitNodeN != null && Player.bitNodeN === 2 && Player.inGang()) {
                Player.gang.process(numCyclesOffline);
            }

            //Bladeburner offline progress
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
            Engine.removeLoadingScreen();
            dialogBoxCreate("While you were offline, your scripts generated $" +
                            formatNumber(offlineProductionFromScripts, 2) + " and your Hacknet Nodes generated $" +
                            formatNumber(offlineProductionFromHacknetNodes, 2));
            //Close main menu accordions for loaded game
            var visibleMenuTabs = [terminal, createScript, activeScripts, stats,
                                   hacknetnodes, city, tutorial, options, dev];
            if (Player.firstFacInvRecvd) {visibleMenuTabs.push(factions);}
            else {factions.style.display = "none";}
            if (Player.firstAugPurchased) {visibleMenuTabs.push(augmentations);}
            else {augmentations.style.display = "none";}
            if (Player.firstJobRecvd) {visibleMenuTabs.push(job);}
            else {job.style.display = "none";}
            if (Player.firstTimeTraveled) {visibleMenuTabs.push(travel);}
            else {travel.style.display = "none";}
            if (Player.firstProgramAvailable) {visibleMenuTabs.push(createProgram);}
            else {createProgram.style.display = "none";}

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
            CompanyPositions.init();
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
            travel.style.display = "none";
            createProgram.style.display = "none";

            Engine.openMainMenuHeader(
                [terminal, createScript, activeScripts, stats,
                 hacknetnodes, city,
                 tutorial, options, dev]
            );

            //Start interactive tutorial
            iTutorialStart();
            Engine.removeLoadingScreen();
        }
        //Initialize labels on game settings
        setSettingsLabels();
        scriptEditorInit();
        Terminal.resetTerminalInput();
    },

    setDisplayElements: function() {
        //Content elements
        Engine.Display.terminalContent = document.getElementById("terminal-container");
        Engine.currentPage = Engine.Page.Terminal;

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

        Engine.Display.devMenuContent = document.getElementById("dev-menu-container");
        Engine.Display.devMenuContent.style.display = "none";

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

        // dev menu buttons
        Engine.Clickables.devMenuGiveMoney = document.getElementById("dev-need-money");
        Engine.Clickables.devMenuGiveMoney.addEventListener("click", function() {
            Player.gainMoney(1e15);
        });

        Engine.Clickables.devMenuGiveRam = document.getElementById("dev-need-ram");
        Engine.Clickables.devMenuGiveRam.addEventListener("click", function() {
            Player.getHomeComputer().maxRam *= 2;
        });

        Engine.Clickables.devMenuAugDropdown = document.getElementById("dev-menu-aug-dropdown");
        const augDD = Engine.Clickables.devMenuAugDropdown;
        for(const i in AugmentationNames) {
            augDD.options[augDD.options.length] = new Option(AugmentationNames[i], AugmentationNames[i]);
        }

        Engine.Clickables.devMenuAddAug = document.getElementById("dev-add-aug");
        Engine.Clickables.devMenuAddAug.addEventListener("click", function() {
            Player.queueAugmentation(augDD.options[augDD.selectedIndex].value);
        });

        Engine.Clickables.devMenuTriggerBitFlume = document.getElementById("dev-bit-flume");
        Engine.Clickables.devMenuTriggerBitFlume.addEventListener("click", function() {
            hackWorldDaemon(Player.bitNodeN, true);
        });

        Engine.Clickables.devMenuFactionDropdown = document.getElementById("dev-menu-faction-dropdown");
        const facDD = Engine.Clickables.devMenuFactionDropdown;
        for(const i in Factions) {
            facDD.options[facDD.options.length] = new Option(Factions[i].name, Factions[i].name);
        }

        Engine.Clickables.devMenuAddFaction = document.getElementById("dev-add-faction");
        Engine.Clickables.devMenuAddFaction.addEventListener("click", function() {
            const factionName = facDD.options[facDD.selectedIndex].value;
            Player.receiveInvite(factionName);
        });

        Engine.Clickables.devMenuOpen = document.getElementById("dev-open-all");
        Engine.Clickables.devMenuOpen.addEventListener("click", function() {
            for(const i in AllServers) {
                AllServers[i].hasAdminRights = true;
                AllServers[i].sshPortOpen    = true;
                AllServers[i].ftpPortOpen    = true;
                AllServers[i].smtpPortOpen   = true;
                AllServers[i].httpPortOpen   = true;
                AllServers[i].sqlPortOpen    = true;
                AllServers[i].openPortCount  = 5;
            }
        });

        Engine.Clickables.devMenuMinSecurity = document.getElementById("dev-min-security");
        Engine.Clickables.devMenuMinSecurity.addEventListener("click", function() {
            for(const i in AllServers) {
                AllServers[i].hackDifficulty = AllServers[i].minDifficulty;
            }
        });

        Engine.Clickables.devMenuMaxMoney = document.getElementById("dev-max-money");
        Engine.Clickables.devMenuMaxMoney.addEventListener("click", function() {
            for(const i in AllServers) {
                AllServers[i].moneyAvailable = AllServers[i].moneyMax;
            }
        });

        Engine.Clickables.devMenuConnectDropdown = document.getElementById("dev-menu-connect-dropdown");
        const connectDD = Engine.Clickables.devMenuConnectDropdown;
        for(const i in AllServers) {
            connectDD.options[connectDD.options.length] = new Option(AllServers[i].hostname, AllServers[i].hostname);
        }

        Engine.Clickables.devMenuConnect = document.getElementById("dev-connect");
        Engine.Clickables.devMenuConnect.addEventListener("click", function() {
            const host = connectDD.options[connectDD.selectedIndex].value;
            Terminal.connectToServer(host);
        });

        Engine.Clickables.devMenuProgramsDropdown = document.getElementById("dev-menu-add-program-dropdown");
        const programsDD = Engine.Clickables.devMenuProgramsDropdown;
        for(const i in Programs) {
            programsDD.options[programsDD.options.length] = new Option(Programs[i], Programs[i]);
        }

        Engine.Clickables.devMenuAddProgram = document.getElementById("dev-add-program");
        Engine.Clickables.devMenuAddProgram.addEventListener("click", function() {
            const program = programsDD.options[programsDD.selectedIndex].value;;
            if(!Player.hasProgram(program)) {
                Player.getHomeComputer().programs.push(program);
            }
        });

        Engine.Clickables.devMenuHackingExp = document.getElementById("dev-hacking-exp");
        Engine.Clickables.devMenuAddHacking = document.getElementById("dev-add-hacking");
        Engine.Clickables.devMenuAddHacking.addEventListener("click", function() {
            const exp = parseInt(Engine.Clickables.devMenuHackingExp.value);
            Player.gainHackingExp(exp);
            Player.updateSkillLevels();
        });

        Engine.Clickables.devMenuStrengthExp = document.getElementById("dev-strength-exp");
        Engine.Clickables.devMenuAddStrength = document.getElementById("dev-add-strength");
        Engine.Clickables.devMenuAddStrength.addEventListener("click", function() {
            const exp = parseInt(Engine.Clickables.devMenuStrengthExp.value);
            Player.gainStrengthExp(exp);
            Player.updateSkillLevels();
        });

        Engine.Clickables.devMenuDefenseExp = document.getElementById("dev-defense-exp");
        Engine.Clickables.devMenuAddDefense = document.getElementById("dev-add-defense");
        Engine.Clickables.devMenuAddDefense.addEventListener("click", function() {
            const exp = parseInt(Engine.Clickables.devMenuDefenseExp.value);
            Player.gainDefenseExp(exp);
            Player.updateSkillLevels();
        });

        Engine.Clickables.devMenuDexterityExp = document.getElementById("dev-dexterity-exp");
        Engine.Clickables.devMenuAddDexterity = document.getElementById("dev-add-dexterity");
        Engine.Clickables.devMenuAddDexterity.addEventListener("click", function() {
            const exp = parseInt(Engine.Clickables.devMenuDexterityExp.value);
            Player.gainDexterityExp(exp);
            Player.updateSkillLevels();
        });

        Engine.Clickables.devMenuAgilityExp = document.getElementById("dev-agility-exp");
        Engine.Clickables.devMenuAddAgility = document.getElementById("dev-add-agility");
        Engine.Clickables.devMenuAddAgility.addEventListener("click", function() {
            const exp = parseInt(Engine.Clickables.devMenuAgilityExp.value);
            Player.gainAgilityExp(exp);
            Player.updateSkillLevels();
        });

        Engine.Clickables.devMenuCharismaExp = document.getElementById("dev-charisma-exp");
        Engine.Clickables.devMenuAddCharisma = document.getElementById("dev-add-charisma");
        Engine.Clickables.devMenuAddCharisma.addEventListener("click", function() {
            const exp = parseInt(Engine.Clickables.devMenuCharismaExp.value);
            Player.gainCharismaExp(exp);
            Player.updateSkillLevels();
        });

        Engine.Clickables.devMenuIntelligenceExp = document.getElementById("dev-intelligence-exp");
        Engine.Clickables.devMenuAddIntelligence = document.getElementById("dev-add-intelligence");
        Engine.Clickables.devMenuAddIntelligence.addEventListener("click", function() {
            const exp = parseInt(Engine.Clickables.devMenuIntelligenceExp.value);
            Player.gainIntelligenceExp(exp);
            Player.updateSkillLevels();
        });

        Engine.Clickables.devMenuEnableIntelligence = document.getElementById("dev-enable-intelligence");
        Engine.Clickables.devMenuEnableIntelligence.addEventListener("click", function() {
            Player.intelligence = 1;
        });

        Engine.Clickables.devMenuDisableIntelligence = document.getElementById("dev-disable-intelligence");
        Engine.Clickables.devMenuDisableIntelligence.addEventListener("click", function() {
            Player.intelligence = 0;
        });

        Engine.Clickables.devMenuSFN = document.getElementById("dev-sf-n");
        Engine.Clickables.devMenuSFLvl = document.getElementById("dev-sf-lvl");
        Engine.Clickables.devMenuAddSF = document.getElementById("dev-add-source-file");
        Engine.Clickables.devMenuAddSF.addEventListener("click", function() {
            const sfN = parseInt(Engine.Clickables.devMenuSFN.value);
            const sfLvl = parseInt(Engine.Clickables.devMenuSFLvl.value);
            let sfIndex = -1;
            for(const i in Player.sourceFiles) {
                if(Player.sourceFiles[i].n === sfN) {
                    sfIndex = i;
                    break;
                }
            }

            if(sfIndex === -1) { // add fresh source file
                Player.sourceFiles.push(new PlayerOwnedSourceFile(sfN, sfLvl));
            } else if(sfLvl === 0) { // remove a source file.
                if(sfIndex === -1) { // doesn't have it anyway.
                    return;
                }
                Player.sourceFiles.splice(sfIndex, 1);
            } else { // set source file level
                Player.sourceFiles[sfIndex].lvl=sfLvl;
            }
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
            var city            = document.getElementById("city-tab");
            var cityLink        = document.getElementById("city-menu-link");
            var travel          = document.getElementById("travel-tab");
            var travelLink      = document.getElementById("travel-menu-link");
            var job             = document.getElementById("job-tab");
            var jobLink         = document.getElementById("job-menu-link");
            this.classList.toggle("opened");
            if (city.style.maxHeight) {
                Engine.toggleMainMenuHeader(false,
                    [city, travel, job],
                    [cityLink, travelLink, jobLink]
                );
            } else {
                Engine.toggleMainMenuHeader(true,
                    [city, travel, job],
                    [cityLink, travelLink, jobLink]
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
            if(process.env.NODE_ENV === "development") {
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
            return false;
        });

        Engine.Clickables.jobMainMenuButton = clearEventListeners("job-menu-link");
        Engine.Clickables.jobMainMenuButton.addEventListener("click", function() {
            Engine.loadJobContent();
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

        Engine.Clickables.devMainMenuButton = clearEventListeners("dev-menu-link");
        Engine.Clickables.devMainMenuButton.addEventListener("click", function() {
            Engine.loadDevMenuContent();
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
