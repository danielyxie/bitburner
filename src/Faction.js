//Netburner Faction class
function Faction(name) {
	this.name 				= name;
    this.augmentations 		= [];
    
    //Player-related properties for faction
	this.isMember 			= false; 	//Whether player is member
    this.playerReputation 	= 0;  		//"Reputation" within faction
};

//TODO
Faction.prototype.init() {
	
}

Faction.prototype.setAugmentations(augs) {
	for (var i = 0; i < augs.length; i++) {
		this.augmentations.push(augs[i]);
	}
}

Factions = {
	//Endgame
	Illuminati: 			new Faction("Illuminati");
	Daedalus: 				new Faction("Daedalus");
	Covenant: 				new Faction("The Covenant");
	
	//Megacorporations, each forms its own faction
	ECorp: 					new Faction("ECorp");
	MegaCorp: 				new Faction("MegaCorp");
	BachmanAndAssociates: 	new Faction("Bachman & Associates");
	BladeIndustries: 		new Faction("Blade Industries");
	NWO: 					new Faction("NWO");
	ClarkeIncorporated: 	new Faction("Clarke Incorporated");
	OmniTekIncorporated: 	new Faction("OmniTek Incorporated");
	FourSigma: 				new Faction("Four Sigma");
	KuaiGongInternational: 	new Faction("KuaiGong International");
	
	//Hacker groups
	BitRunners: 			new Faction("BitRunners");
	BlackHand: 				new Faction("The Black Hand");
	NiteSec: 				new Faction("NiteSec");
	
	//City factions, essentially governments and gangs
	Aevum: 				    new Faction("Aevum");
    Ishima:                 new Faction("Ishima");
}