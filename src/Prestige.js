/* Prestige functions */

//Prestige by purchasing augmentation
function prestigeAugmentation() {
    //Sum up lifetime/total statistics
    Player.total_hacking        += Player.hacking_skill;
    Player.lifetime_hacking     += Player.hacking_skill;
    Player.total_strength       += Player.strength;
    Player.lifetime_strength    += Player.strength;
    Player.total_defense        += Player.defense;
    Player.lifetime_defense     += Player.defense;
    Player.total_dexterity      += Player.dexterity;
    Player.lifetime_dexterity   += Player.dexterity;
    Player.total_agility        += Player.agility;
    Player.lifetime_agility     += Player.agility;
    Player.total_charisma       += Player.charisma;
    Player.lifetime_charisma    += Player.charisma;
    
    //Crime statistics
    Player.numTimesShopliftedTotal += Player.numTimesShoplifted;
    Player.numTimesShopliftedLifetime += Player.numTimesShoplifted;
    Player.numTimesShoplifted = 0;
    Player.numPeopleMuggedTotal += Player.numPeopleMugged;
    Player.numPeopleMuggedLifetime += Player.numPeopleMugged;
    Player.numPeopleMugged = 0;
    Player.numTimesDealtDrugsTotal += Player.numTimesDealtDrugs;
    Player.numTimesDealtDrugsLifetime += Player.numTimesDealtDrugs;
    Player.numTimesDealtDrugs = 0;
    Player.numTimesTraffickArmsTotal += Player.numTimesTraffickArms;
    Player.numTimesTraffickArmsLifetime += Player.numTimesTraffickArms;
    Player.numTimesTraffickArms = 0;
    Player.numPeopleKilledTotal += Player.numPeopleKilled;
    Player.numPeopleKilledLifetime += Player.numPeopleKilled;
    Player.numPeopleKilled = 0;
    Player.numTimesGrandTheftAutoTotal += Player.numTimesGrandTheftAuto;
    Player.numTimesGrandTheftAutoLifetime += Player.numTimesGrandTheftAuto;
    Player.numTimesGrandTheftAuto = 0;
    Player.numTimesKidnappedTotal += Player.numTimesKidnapped;
    Player.numTimesKidnappedLifetime += Player.numTimesKidnapped;
    Player.numTimesKidnapped = 0;
    Player.numTimesHeistTotal += Player.numTimesHeist;
    Player.numTimesHeistLifetime += Player.numTimesHeist;
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
    
    Player.money = 1000;
        
    Player.city = Locations.Sector12;
    Player.location = "";
    
    Player.companyName = "";
    Player.companyPosition = "";
    
    Player.currentServer = "";
    Player.discoveredServers = [];
    Player.purchasedServers = [];
    
    Player.factions = [];
    
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
    homeComp.isOnline = true;
    homeComp.ramUsed = 0;
    homeComp.programs.push(Programs.NukeProgram);
    if (augmentationExists(AugmentationNames.Neurolink) && 
        Augmentations[AugmentationNames.Neurolink].owned) {
        homeComp.programs.push(Programs.FTPCrackProgram);
        homeComp.programs.push(Programs.RelaySMTPProgram);
    } 
    if (augmentationExists(AugmentationNames.CashRoot) && 
        Augmentations[AugmentationNames.CashRoot].owned) {
        Player.money = 1000000;
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
    
    //Delete Companies
    for (var member in Companies) {
        if (Companies.hasOwnProperty(member)) {
            delete Companies[member];
        }
    }
    Companies = {};
    
    //Reset Factions
    for (var member in Factions) {
        if (Factions.hasOwnProperty(member)) {
            delete Factions[member];
        }
    }
    Factions = {};
    
    //Stop a Terminal action if there is onerror
    if (Engine._actionInProgress) {
        Engine._actionInProgress = false;
        Terminal.finishAction(true);
    }
    
    //Re-initialize things - This will update any changes 
    initFactions();
    initAugmentations();
    initCompanies();
    
    //Clear terminal
    $("#terminal tr:not(:last)").remove();
    postNetburnerText();
    
    //Messages
    initMessages();
    
    Player.playtimeSinceLastAug = 0;
    
    Engine.loadTerminalContent();
}