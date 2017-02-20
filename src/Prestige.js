/* Prestige functions */

//Prestige by purchasing augmentation
function prestigeAugmentation() {
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
    
    Player.money = 0;
    
    Player.homeComputer = "";
    
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
    
    //Delete all servers
    for (var member in AllServers) {
        delete AllServers[member];
    }
    AllServers = {};
    
    //Delete Special Server IPs
    for (var member in SpecialServerIps) {
        delete SpecialServerIps[member];
    }
    SpecialServersIps = null;
    
    //Delete Companies
    for (var member in Companies) {
        delete Companies[member];
    }
    Companies = {};
    
    //Delete Factions
    for (var member in Factions) {
        delete Factions[member];
    }
    Factions = {};
    
    //Inititialization
    SpecialServerIps = new SpecialServerIpsMap();
    Player.init();
    initForeignServers();
    initCompanies();
    initFactions();
    CompanyPositions.init();
}