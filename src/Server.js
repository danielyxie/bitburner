//Netburner Server class
function Server() = {
	/* Properties */
	//Connection information
	this.ip					= 	"0.0.0.0";
	this.hostname			= 	"";
	this.organizationName 	= 	"";
	this.isOnline			= 	true;	
	this.isConnectedTo		= 	false;	//Whether the player is connected to this server
	
	//Access information
	this.hasAdminRights		=	false;	//Whether player has admin rights
	this.purchasedByPlayer	=	false;
	
	//RAM, CPU speed and Scripts
	this.maxRam			=	1; //GB 
	this.ramUsed		=	0;
	this.cpuSpeed		= 	1;	//MHz
	
	this.scripts 		= 	[];
	this.runningScripts = 	[]; //Scripts currently being run
	this.programs 		= 	[];
	
	/* Hacking information (only valid for "foreign" aka non-purchased servers) */
	
	//Skill required to attempt a hack. Whether a hack is successful will be determined
	//by a separate formula 
	this.requiredHackingSkill	= 1; 	
	
	//Total money available on this server. How much of this you hack will be determined
	//by a formula related to hacking skill. The money available on a server will steadily increase
	//over time, and it will decrease when you hack it
	this.moneyAvailable 		= 500;
	
	//Parameters used in formulas that dictate how moneyAvailable and requiredHackingSkill change. 
	this.hackDifficulty			= 1;	//Affects hack success rate and how the requiredHackingSkill increases over time (1-100)
	this.serverGrowth			= 1;	//Affects how the moneyAvailable increases (1-100)
	this.timesHacked 			= 0;
	
	//Manual hack state information (hacking done without script)
	this.isHacking				= false;
	this.hackingProgress		= 0;	
	
	//All servers reachable from this one (what shows up if you run scan/netstat)
	this.serversOnNetwork		= [];
};

//Initialize the properties of a server
Server.prototype.init = function(ip, hostname, organizationName, onlineStatus, isConnectedTo, adminRights, purchasedByPlayer, maxRam) {
	this.ip = ip;
	this.hostname = hostname;
	this.organizationName = organizationName;
	this.isOnline = onlineStatus;
	this.isConnectedTo = isConnectedTo;
	this.hasAdminRights = adminRights;
	this.purchasedByPlayer = purchasedByPlayer;
	this.maxRam = maxRam;
}

//Set the hacking properties of a server
Server.prototype.setHackingParameters = function(requiredHackingSkill, moneyAvailable, hackDifficulty, serverGrowth) {
	this.requiredHackingSkill = requiredHackingSkill;
	this.moneyAvailable = moneyAvailable;
	this.hackDifficulty = hackDifficulty;
	this.serverGrowth = serverGrowth;
}

//Generate a random IP address. Used for the foreign servers
createRandomIp = function() = {
	var ip = randomByte() +'.' +
			 randomByte() +'.' +
			 randomByte() +'.' +
		 	 randomByte();
	return ip;
}

createRandomByte = function() = {
	return Math.round(Math.random()*256);
}

//Create all "foreign" servers that exist in the game. This does not include
//servers that the player can purchase or the player's starting computer
ForeignServers = {
	//Megacorporations (each one forms its own faction?)
	ECorp: 						new Server(),
	MegaCorp: 					new Server(),
	BachmanAndAssociates: 		new Server(),
	BladeIndustries: 			new Server(),
	NWO: 						new Server(),
	ClarkeIncorporated: 		new Server(),
	OmniTekIncorporated: 		new Server(),
	FourSigma: 					new Server(),

	
	//Technology and communication companies ("Large" targets)
	FulcrumTechnologies: 		new Server(),
	StormTechnologies: 			new Server(),
	DefComm: 					new Server(),
	InfoComm: 					new Server(),
	HeliosLabs: 				new Server(),
	VitaLife: 					new Server(),
	IcarusMicrosystems: 		new Server(),
	UniversalEnergy: 			new Server(),
	TitanLabs: 					new Server(),
	MicrodyneTechnologies: 		new Server(),
	TaiYangDigital: 			new Server(),
	GalacticCybersystems: 		new Server(), 
	
	//Defense Companies ("Large" Companies)
	AeroCorp: 					new Server(),
	OmniaCybersystems: 			new Server(),
	ZBDefense: 					new Server(),
	AppliedEnergetics: 			new Server(),
	SolarisSpaceSystems: 		new Server(),
	DeltaOne: 					new Server(),
	
	//Health, medicine, pharmaceutical companies ("Large" targets)
	GlobalPharmaceuticals: 		new Server(),
	NovaMedical: 				new Server(),
	ZeusMedical: 				new Server(),
	UnitaLifeGroup: 			new Server(),
	
	//"Medium level" targets
	LexoCorp: 					new Server(),
	RhoConstruction: 			new Server(),
	AlphaEnterprises: 			new Server(),
	RothmanUniversity:			new Server(),
	ZBInstituteOfTechnology: 	new Server(),
	SysCoreSecurities: 			new Server(),
	
	//"Low level" targets
	FoodNStuff: 				new Server(),
	SigmaCosmetics: 			new Server(),

	//Gyms
	CrushFitnessGym: 			new Server(),
	IronGym:					new Server(),
	MilleniumFitnessGym:		new Server(),
	PowerhouseGym:				new Server(),
	SnapFitnessGym:				new Server(),
	
	init: function() {
		//MegaCorporations
		ECorp.init(createRandomIp(), "ecorp", "ECorp", true, false, false, false, 512);
		ECorp.setHackingParameters(900, 100000000000, 99, 99);
		
		MegaCorp.init(createRandomIp(), "megacorp", "MegaCorp", true, false, false, false, 512);
		MegaCorp.setHackingParameters(900, 80000000000, 99, 99);
		
		BachmanAndAssociates.init(createRandomIp(), "b-and-a", "Bachman & Associates", true, false, false, false, 480);
		BachmanAndAssociates.setHackingParameters(900, 32000000000, 80, 70);
		
		BladeIndustries.init(createRandomIp(), "blade", "Blade Industries", true, false, false, false, 480);
		BladeIndustries.setHackingParameters(900, 20000000000, 90, 65);
		
		NWO.init(createRandomIp(), "nwo", "New World Order", true, false, false, false, 512);
		NWO.setHackingParameters(900, 40000000000, 99, 80);
		
		ClarkeIncorporated.init(createRandomIp(), "clarkeinc", "Clarke Incorporated", true, false, false, false, 448);
		ClarkeIncorporated.setHackingParameters(900, 15000000000, 50, 60);
		
		OmniTekIncorporated.init(createRandomIp(), "omnitek", "OmniTek Incorporated", true, false, false, false, 1024);
		OmniTekIncorporated.setHackingPArameters(900, 50000000000, 95, 99);
		
		FourSigma.init(createRandomIp(), "4sigma", "FourSigma", true, false, false, false, 448);
		FourSigma.setHackingParameters(900, 25000000000, 60, 80);
		
		
		//Technology and communications companies
		FulcrumTechnologies.init(createRandomIp(), "fulcrumtech", "Fulcrum Technologies", true, false, false, false, 512);
		FulcrumTechnologies.setHackingParameters(900, 2000000000, 90, 85);
		
		StormTechnologies.init(createRandomIp(), "stormtech", "Storm Technologies", true, false, false, false, 256);
		StormTechnologies.setHackingParameters(850, 1500000000, 85, 80);
		
		DefComm.init(createRandomIp(), "defcomm", "DefComm", true, false, false, false, 256);
		DefComm.setHackingParameters(825, 900000000, 90, 60);
		
		InfoComm.init(createRandomIp(), "infocomm", "InfoComm", true, false, false, false, 256);
		InfoComm.setHackingParameters(830, 750000000, 80, 50);
		
		HeliosLabs.init(createRandomIp(), "helios", "Helios Labs", true, false, false, false, 288);
		HeliosLabs.setHackingParameters(800, 500000000, 90, 75);
		
		VitaLife.init(createRandomIp(), "vitalife", "VitaLife", true, false, false, false, 224);
		VitaLife.setHackingParameters(775, 800000000, 85, 70);
		
		IcarusMicrosystems.init(createRandomIp(), "icarus", "Icarus Microsystems", true, false, false, false, 256);
		IcarusMicrosystems.setHackingParameters(810, 1100000000, 90, 90);
		
		UniversalEnergy.init(createRandomIp(), "univ-energy", "Universal Energy", true, false, false, false, 256);
		UniversalEnergy.setHackingParameters(790, 1500000000, 85, 85);
		
		TitanLabs.init(createRandomIp(), "titan-labs", "Titan Laboratories", true, false, false, false, 256);
		TitanLabs.setHackingParameters(795, 1000000000, 75, 70);
		
		MicrodyneTechnologies.init(createRandomIp(), "microdyne", "Microdyne Technologies", true, false, false, false, 288);
		MicrodyneTechnologies.setHackingParameters(800, 900000000, 70, 80);
		
		TaiYangDigital.init(createRandomIp(), "taiyang-digital", "Taiyang Digital", true, false, false, false, 256);
		TaiYangDigital.setHackingParameters(850, 1100000000, 75, 75);
		
	    GalacticCybersystems.init(createRandomIp(), "galactic-cyber", "Galactic Cybersystems", true, false, false, false, 288);
		GalacticCybersystems.setHackingParameters(825, 500000000, 60, 80);
	}
}
