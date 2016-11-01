//Netburner Company class
function Company() {
	this.companyName = "";
    this.companyPositions = [];
    
    //Player-related properties for company
    this.isPlayerEmployed = false;
    this.playerPosition = null;
    this.playerReputation = 0;  //"Reputation" within company, gain reputation by working for company
};

Company.prototype.init(name) {
	this.companyName = name;
}

Company.prototype.addPosition(pos) {
	this.companyPositions.push(pos);
}

//Object that defines a position within a Company and its requirements
function CompanyPosition(name, reqHack, reqStr, reqDef, reqDex, reqAgi, reqRep, salary) {
    this.positionName       = name;
    this.requiredHacking    = reqHack;
    this.requiredStrength   = reqStr;
    this.requiredDefense    = reqDef;
    this.requiredDexterity  = reqDex;
    this.requiredAgility    = reqAgi;
	this.requiredReputation = reqRep;
	
	this.salary 			salary;	//TODO determine interval. Every 10 minutes? 
};

Companies = {
	/* Companies that also have servers */
	//Megacorporations
	ECorp: 						new Company(),  
	MegaCorp: 					new Company(),  
	BachmanAndAssociates: 		new Company(),  
	BladeIndustries: 			new Company(),  
	NWO: 						new Company(),  
	ClarkeIncorporated: 		new Company(),  
	OmniTekIncorporated: 		new Company(),  
	FourSigma: 					new Company(),  
	KuaiGongInternational: 		new Company(),  
	
	//Technology and communication companies ("Large" servers)
	FulcrumTechnologies: 		new Company(),   
	StormTechnologies: 			new Company(),   
	DefComm: 					new Company(),   
	HeliosLabs: 				new Company(),   
	VitaLife: 					new Company(),   
	IcarusMicrosystems: 		new Company(),   
	UniversalEnergy: 			new Company(),   
	MicrodyneTechnologies: 		new Company(),   
	GalacticCybersystems: 		new Company(),   
	
	//Defense Companies ("Large" Companies)
	AeroCorp: 					new Company(),   
	OmniaCybersystems: 			new Company(),   
	SolarisSpaceSystems: 		new Company(),   
	DeltaOne: 					new Company(),   
	
	//Health, medicine, pharmaceutical companies ("Large" servers)
	GlobalPharmaceuticals: 		new Company(),   
	NovaMedical: 				new Company(),   
	
	//"Medium level" servers
	LexoCorp: 					new Company(),   
	RhoConstruction: 			new Company(),   
	AlphaEnterprises: 			new Company(),   
	NewerthPolice: 				new Company(),	
	SysCoreSecurities: 			new Company(),   
	CatalystVentures: 			new Company(),   
	CompuTek: 					new Company(),   
	NetLinkTechnologies: 		new Company(),   
	
	//"Low level" servers
	FoodNStuff: 				new Company(),   
	JoesGuns: 					new Company(),   
	HaraKiriSushiBar:			new Company(),   
	MaxHardware: 				new Company(),   
	OmegaSoftware: 				new Company(),   
	
	/* Companies that do not have servers */
	NoodleBar: 					new Company(), 

	init: function() {
		
	}
}