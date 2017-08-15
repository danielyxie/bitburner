/* Prestige functions */

//Prestige by purchasing augmentation
function prestigeAugmentation() {
    initBitNodeMultipliers();

    //Crime statistics
    Player.numTimesShoplifted = 0;
    Player.numPeopleMugged = 0;
    Player.numTimesDealtDrugs = 0;
    Player.numTimesTraffickArms = 0;
    Player.numPeopleKilled = 0;
    Player.numTimesGrandTheftAuto = 0;
    Player.numTimesKidnapped = 0;
    Player.numTimesHeist = 0;

    Player.karma = 0;

    //Reset stats
    Player.hacking_skill = 1;

    Player.strength = 1;
    Player.defense = 1;
    Player.dexterity = 1;
    Player.agility = 1;

    Player.charisma = 1;

    Player.hacking_exp = 0;
    Player.strength_exp = 0;
    Player.defense_exp = 0;
    Player.dexterity_exp = 0;
    Player.agility_exp = 0;
    Player.charisma_exp = 0;

    Player.money = new Decimal(1000);

    Player.city = Locations.Sector12;
    Player.location = "";

    Player.companyName = "";
    Player.companyPosition = "";

    Player.currentServer = "";
    Player.discoveredServers = [];
    Player.purchasedServers = [];

    Player.factions = [];
    Player.factionInvitations = [];

    Player.queuedAugmentations = [];

    Player.startAction = false;
    Player.actionTime = 0;

    Player.isWorking = false;
    Player.currentWorkFactionName = "";
    Player.currentWorkFactionDescription = "";
    this.createProgramName = "";
    this.className = "";
    this.crimeType = "";

    Player.workHackExpGainRate = 0;
    Player.workStrExpGainRate = 0;
    Player.workDefExpGainRate = 0;
    Player.workDexExpGainRate = 0;
    Player.workAgiExpGainRate = 0;
    Player.workChaExpGainRate = 0;
    Player.workRepGainRate = 0;
    Player.workMoneyGainRate = 0;

    Player.workHackExpGained = 0;
    Player.workStrExpGained = 0;
    Player.workDefExpGained = 0;
    Player.workDexExpGained = 0;
    Player.workAgiExpGained = 0;
    Player.workChaExpGained = 0;
    Player.workRepGained = 0;
    Player.workMoneyGained = 0;

    Player.timeWorked = 0;

    Player.lastUpdate = new Date().getTime();

    //Delete all Worker Scripts objects
    for (var i = 0; i < workerScripts.length; ++i) {
        deleteActiveScriptsItem(workerScripts[i]);
        workerScripts[i].env.stopFlag = true;
    }
    workerScripts.length = 0;

    var homeComp = Player.getHomeComputer();
    //Delete all servers except home computer
    for (var member in AllServers) {
        delete AllServers[member];
    }
    AllServers = {};
    //Delete Special Server IPs
    for (var member in SpecialServerIps) {
        delete SpecialServerIps[member];
    }
    SpecialServersIps = null;

    //Reset home computer (only the programs) and add to AllServers
    homeComp.programs.length = 0;
    homeComp.runningScripts = [];
    homeComp.serversOnNetwork = [];
    homeComp.isConnectedTo = true;
    homeComp.ramUsed = 0;
    homeComp.programs.push(Programs.NukeProgram);
    if (augmentationExists(AugmentationNames.Neurolink) &&
        Augmentations[AugmentationNames.Neurolink].owned) {
        homeComp.programs.push(Programs.FTPCrackProgram);
        homeComp.programs.push(Programs.RelaySMTPProgram);
    }
    if (augmentationExists(AugmentationNames.CashRoot) &&
        Augmentations[AugmentationNames.CashRoot].owned) {
        Player.money = new Decimal(1000000);
        homeComp.programs.push(Programs.BruteSSHProgram);
    }
    Player.currentServer = homeComp.ip;
    Player.homeComputer = homeComp.ip;
    AddToAllServers(homeComp);

    //Re-create foreign servers
    SpecialServerIps = new SpecialServerIpsMap();   //Must be done before initForeignServers()
    initForeignServers();

    //Darkweb is purchase-able
    document.getElementById("location-purchase-tor").setAttribute("class", "a-link-button");

    //Reset statistics of all scripts on home computer
    for (var i = 0; i < homeComp.scripts.length; ++i) {
        var s = homeComp.scripts[i];
    }
    //Delete messages on home computer
    homeComp.messages.length = 0;

    //Delete Hacknet Nodes
    Player.hacknetNodes.length = 0;
    Player.totalHacknetNodeProduction = 0;

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
        stockMarketContentCreated = false;
        var stockMarketList = document.getElementById("stock-market-list");
        while(stockMarketList.firstChild) {
            stockMarketList.removeChild(stockMarketList.firstChild);
        }
    }

    //Gang, in BitNode 2
    if (Player.bitNodeN == 2 && Player.inGang()) {
        var faction = Factions[Player.gang.facName];
        if (faction instanceof Faction) {
            joinFaction(faction);
        }
    }

    Player.playtimeSinceLastAug = 0;

    var mainMenu = document.getElementById("mainmenu-container");
    mainMenu.style.visibility = "visible";
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

    //Crime statistics
    Player.numTimesShoplifted = 0;
    Player.numPeopleMugged = 0;
    Player.numTimesDealtDrugs = 0;
    Player.numTimesTraffickArms = 0;
    Player.numPeopleKilled = 0;
    Player.numTimesGrandTheftAuto = 0;
    Player.numTimesKidnapped = 0;
    Player.numTimesHeist = 0;

    Player.karma = 0;

    //Reset stats
    Player.hacking_skill = 1;

    Player.strength = 1;
    Player.defense = 1;
    Player.dexterity = 1;
    Player.agility = 1;

    Player.charisma = 1;

    Player.hacking_exp = 0;
    Player.strength_exp = 0;
    Player.defense_exp = 0;
    Player.dexterity_exp = 0;
    Player.agility_exp = 0;
    Player.charisma_exp = 0;

    Player.money = new Decimal(1000);

    Player.city = Locations.Sector12;
    Player.location = "";

    Player.companyName = "";
    Player.companyPosition = "";

    Player.currentServer = "";
    Player.discoveredServers = [];
    Player.purchasedServers = [];

    Player.factions = [];
    Player.factionInvitations = [];

    Player.queuedAugmentations = [];
    Player.augmentations = [];

    Player.startAction = false;
    Player.actionTime = 0;

    Player.isWorking = false;
    Player.currentWorkFactionName = "";
    Player.currentWorkFactionDescription = "";
    this.createProgramName = "";
    this.className = "";
    this.crimeType = "";

    Player.workHackExpGainRate = 0;
    Player.workStrExpGainRate = 0;
    Player.workDefExpGainRate = 0;
    Player.workDexExpGainRate = 0;
    Player.workAgiExpGainRate = 0;
    Player.workChaExpGainRate = 0;
    Player.workRepGainRate = 0;
    Player.workMoneyGainRate = 0;

    Player.workHackExpGained = 0;
    Player.workStrExpGained = 0;
    Player.workDefExpGained = 0;
    Player.workDexExpGained = 0;
    Player.workAgiExpGained = 0;
    Player.workChaExpGained = 0;
    Player.workRepGained = 0;
    Player.workMoneyGained = 0;

    Player.timeWorked = 0;

    Player.lastUpdate = new Date().getTime();

    //Delete all Worker Scripts objects
    for (var i = 0; i < workerScripts.length; ++i) {
        deleteActiveScriptsItem(workerScripts[i]);
        workerScripts[i].env.stopFlag = true;
    }
    workerScripts.length = 0;

    var homeComp = Player.getHomeComputer();
    //Delete all servers except home computer
    for (var member in AllServers) {
        delete AllServers[member];
    }
    AllServers = {};
    //Delete Special Server IPs
    for (var member in SpecialServerIps) {
        delete SpecialServerIps[member];
    }
    SpecialServersIps = null;

    //Reset home computer (only the programs) and add to AllServers
    homeComp.programs.length = 0;
    homeComp.runningScripts = [];
    homeComp.serversOnNetwork = [];
    homeComp.isConnectedTo = true;
    homeComp.ramUsed = 0;
    homeComp.programs.push(Programs.NukeProgram);
    var srcFile1Owned = false;
    for (var i = 0; i < Player.sourceFiles.length; ++i) {
        if (Player.sourceFiles[i].n == 1) {
            srcFile1Owned = true;
        }
    }
    if (srcFile1Owned) {
        homeComp.maxRam = 32;
    } else {
        homeComp.maxRam = 8;
    }
    Player.currentServer = homeComp.ip;
    Player.homeComputer = homeComp.ip;
    AddToAllServers(homeComp);

    //Re-create foreign servers
    SpecialServerIps = new SpecialServerIpsMap();   //Must be done before initForeignServers()
    initForeignServers();

    //Darkweb is purchase-able
    document.getElementById("location-purchase-tor").setAttribute("class", "a-link-button");

    //Reset statistics of all scripts on home computer
    for (var i = 0; i < homeComp.scripts.length; ++i) {
        var s = homeComp.scripts[i];
    }
    //Delete messages on home computer
    homeComp.messages.length = 0;

    //Delete Hacknet Nodes
    Player.hacknetNodes.length = 0;
    Player.totalHacknetNodeProduction = 0;

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

    //Gang
    Player.gang = null;

    //Reset Stock market
    Player.hasWseAccount = false;

    Player.playtimeSinceLastAug = 0;

    var mainMenu = document.getElementById("mainmenu-container");
    mainMenu.style.visibility = "visible";
    Engine.loadTerminalContent();
}
