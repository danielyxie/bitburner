//Netburner Faction class
function Faction(name) {
	this.name 				= name;
    this.augmentations 		= [];
    
    //Player-related properties for faction
	this.isMember 			= false; 	//Whether player is member
    this.playerReputation 	= 0;  		//"Reputation" within faction
};

//TODO
Faction.prototype.init = function() {
	
}

Faction.prototype.setAugmentations = function(augs) {
	for (var i = 0; i < augs.length; i++) {
		this.augmentations.push(augs[i]);
	}
}

//Map of factions indexed by faction name
Factions = {}

AddToFactions = function(faction) {
	var name = faction.name;
	Factions[name] = faction;
}

initFactions = function() {
	//Endgame
	var Illuminati 				= new Faction("Illuminati");
	AddToFactions(Illuminati);
	var Daedalus 				= new Faction("Daedalus");
	AddToFactions(Daedalus);
	var Covenant 				= new Faction("The Covenant");
	AddToFactions(Covenant);
	
	//Megacorporations, each forms its own faction
	var ECorp 					= new Faction("ECorp");
	AddToFactions(ECorp);
	var MegaCorp 				= new Faction("MegaCorp");
	AddToFactions(MegaCorp);
	var BachmanAndAssociates 	= new Faction("Bachman & Associates");
	AddToFactions(BachmanAndAssociates);
	var BladeIndustries 		= new Faction("Blade Industries");
	AddToFactions(BladeIndustries);
	var NWO 					= new Faction("NWO");
	AddToFactions(NWO);
	var ClarkeIncorporated 		= new Faction("Clarke Incorporated");
	AddToFactions(ClarkeIncorporated);
	var OmniTekIncorporated 	= new Faction("OmniTek Incorporated");
	AddToFactions(OmniTekIncorporated);
	var FourSigma 				= new Faction("Four Sigma");
	AddToFactions(FourSigma);
	var KuaiGongInternational 	= new Faction("KuaiGong International");
	AddToFactions(KuaiGongInternational);
	
	//Hacker groups
	var BitRunners 				= new Faction("BitRunners");
	AddToFactions(BitRunners);
	var BlackHand				= new Faction("The Black Hand");
	AddToFactions(BlackHand);
	var NiteSec 				= new Faction("NiteSec");
	AddToFactions(NiteSec);
	
	//City factions, essentially governments
	var Chongqing 				= new Faction("Chongqing");
	AddToFactions(Chongqing);
	var Sector12 				= new Faction("Sector-12");
	AddToFactions(Sector12);
	var HongKong				= new Faction("New Tokyo");
	AddToFactions(HongKong);
	var Aevum 				    = new Faction("Aevum");
	AddToFactions(Aevum);
    var Ishima                 	= new Faction("Ishima");
	AddToFactions(Ishima);
	var Volhaven 				= new Faction("Volhaven");
	AddToFactions(Volhaven);
	
	//Criminal Organizations/Gangs
	
	//Earlygame factions - factions the player will prestige with early on that don't
	//belong in other categories
	
}