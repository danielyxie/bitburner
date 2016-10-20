//Netburner Server class
function Server() {
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

//Hack a server. Return the amount of money hacked.
//This assumes that the server being hacked is not purchased by the palyer, that the player's hacking skill is greater than the
//required hacking skill and that the player has admin rights.
Server.prototype.hack = function(hackingSkill) {
	
	
}

//Set the hacking properties of a server
Server.prototype.setHackingParameters = function(requiredHackingSkill, moneyAvailable, hackDifficulty, serverGrowth) {
	this.requiredHackingSkill = requiredHackingSkill;
	this.moneyAvailable = moneyAvailable;
	this.hackDifficulty = hackDifficulty;
	this.serverGrowth = serverGrowth;
}

//Generate a random IP address. Used for the foreign servers
createRandomIp = function() {
	var ip = randomByte() +'.' +
			 randomByte() +'.' +
			 randomByte() +'.' +
		 	 randomByte();
	return ip;
}

createRandomByte = function() {
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
	KuaiGongInternational: 		new Server(),
	
	//Technology and communication companies ("Large" targets)
	FulcrumTechnologies: 		new Server(),
	FulcrumSecretTechnologies: 	new Server(), 
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
	SummitUniversity: 			new Server(),
	SysCoreSecurities: 			new Server(),
	CatalystVentures: 			new Server(),
	TheHub: 					new Server(),
	CompuTek: 					new Server(), 
	NetLinkTechnologies: 		new Server(),
	
	//"Low level" targets
	FoodNStuff: 				new Server(),
	SigmaCosmetics: 			new Server(),
	JoesGuns: 					new Server(),
	Zer0Nightclub: 				new Server(),
	NectarNightclub: 			new Server(),
	NeoNightclub: 				new Server(),
	SilverHelix: 				new Server(),
	HongFangTeaHouse: 			new Server(),
	HaraKiriSushiBar:			new Server(),
	Phantasy: 					new Server(),
	MaxHardware: 				new Server(),
	OmegaSoftware: 				new Server(),

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
		
		KuaiGongInternational.init(createRandomIp(), "kuai-gong", "KuaiGong International", true, false, false, false, 512);
		KuaiGongInternational.setHackingParameters(925, 75000000000, 99, 99);
		
		//Technology and communications companies (large targets)
		FulcrumTechnologies.init(createRandomIp(), "fulcrumtech", "Fulcrum Technologies", true, false, false, false, 512);
		FulcrumTechnologies.setHackingParameters(900, 2000000000, 90, 85);
		
		FulcrumSecretTechnologies.init(createRandomIp(), "fulcrumassets", "Fulcrum Technologies Assets", true, false, false, false, 1024);
		FulcrumSecretTechnologies.setHackingParameters(999, 1000000, 99, 1);
		
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
		
		//Defense Companies ("Large" Companies)
		AeroCorp.init(createRandomIp(), "aerocorp", "AeroCorp", true, false, false, false, 320);
		AeroCorp.setHackingParameters(850, 1500000000, 85, 60);
		
		OmniaCybersystems.init(createRandomIp(), "omnia", "Omnia Cybersystems", true, false, false, false, 320);
		OmniaCybersystems.setHackingParameters(825, 1200000000, 90, 65);
		
		ZBDefense.init(createRandomIp(), "zb-def", "ZB Defense Industries", true, false, false, false, 288);
		ZBDefense.setHackingParameters(800, 1000000000, 60, 70);
		
		AppliedEnergetics.init(createRandomIp(), "applied-energetics", "Applied Energetics", true, false, false, false, 288);
		AppliedEnergetics.setHackingParameters(775, 1200000000, 70, 72);
		
		SolarisSpaceSystems.init(createRandomIp(), "solaris", "Solaris Space Systems", true, false, false, false, 288);
		SolarisSpaceSystems.setHackingParameters(800, 900000000, 75, 75);
		
		DeltaOne.init(createRandomIp(), "deltaone", "Delta One", true, false, false, false, 288);
		DeltaOne.setHackingParameters(810, 1500000000, 80, 60);
		
		//Health, medicine, pharmaceutical companies ("Large" targets)
		GlobalPharmaceuticals.init(createRandomIp(), "global-pharm", "Global Pharmaceuticals", true, false, false, false, 256);
		GlobalPharmaceuticals.setHackingParameters(775, 2000000000, 80, 85);
		
		NovaMedical.init(createRandomIp(), "nova-med", "Nova Medical", true, false, false, false, 288);
		NovaMedical.setHackingParameters(800, 1500000000, 70, 75);
		
		ZeusMedical.init(createRandomIp(), "zeud-med", "Zeus Medical", true, false, false, false, 320);
		ZeusMedical.setHackingParameters(810, 1750000000, 80, 75);
		
		UnitaLifeGroup.init(createRandomIp(), "unitalife", "UnitaLife Group", true, false, false, false, 288);
		UnitaLifeGroup.setHackingParameters(790, 1400000000, 75, 75);
		
		//"Medium level" targets
		LexoCorp.init(createRandomIp(), "lexo-corp", "Lexo Corporation", true, false, false, false, 256);
		LexoCorp.setHackingParameters(700, 1000000000, 70, 60);
		
		RhoConstruction.init(createRandomIp(), "rho-construction", "Rho Construction", true, false, false, false, 128);
		RhoConstruction.setHackingParameters(500, 750000000, 50, 50);
		
		AlphaEnterprises.init(createRandomIp(), "alpha-ent", "Alpha Enterprises", true, false, false, false, 192);
		AlphaEnterprises.setHackingParameters(550, 800000000, 60, 55);
		
		RothmanUniversity.init(createRandomIp(), "rothman-uni", "Rothman University Network", true, false, false, false, 160);
		RothmanUniversity.setHackingParameters(400, 250000000, 50, 40);
		
		ZBInstituteOfTechnology.init(createRandomIp(), "zb-institute", "ZB Institute of Technology Network", true, false, false, false, 256);
		ZBInstituteOfTechnology.setHackingParameters(750, 1000000000, 75, 80);
		
		SummitUniversity.init(createRandomIp(), "summit-uni", "Summit University Network", true, false, false, false, 128);
		SummitUniversity.setHackingParameters(450, 200000000, 55, 50);
		
		SysCoreSecurities.init(createRandomIp(), "syscore", "SysCore Securities", true, false, false, false, 192);
		SysCoreSecurities.setHackingParameters(600, 600000000, 70, 65);
		
		CatalystVentures.init(createRandomIp(), "catalyst", "Catalyst Ventures", true, false, false, false, 160);
		CatalystVentures.setHackingParameters(425, 900000000, 65, 40);
		
		TheHub.init(createRandomIp(), "the-hub", "The Hub", true, false, false, false, 128);
		TheHub.setHackingParameters(300, 250000000, 40, 50);
		
		CompuTek.init(createRandomIp(), "comptek", "CompuTek", true, false, false, false, 192);
		CompuTek.setHackingParameters(350, 300000000, 60, 55);

		NetLinkTechnologies.init(createRandomIp(), "netlink", "NetLink Technologies", true, false, false, false, 192);
		NetLinkTechnologies.setHackingParameters(400, 350000000, 70, 60);
		
		//"Low level" targets
		FoodNStuff.init(createRandomIp(), "foodnstuff", "Food N Stuff Supermarket", true, false, false, false, 8);
		FoodNStuff.setHackingParameters(1, 1000000, 10, 20);
		
		SigmaCosmetics.init(createRandomIp(), "sigma-cosmetics", "Sigma Cosmetics", true, false, false, false, 16);
		SigmaCosmetics.setHackingParameters(5, 500000, 5, 10);
		
		JoesGuns.init(createRandomIp(), "joesguns", "Joe's Guns", true, false, false, false, 16);
		JoesGuns.setHackingParameters(10, 200000, 20, 20);
		
		Zer0Nightclub.init(createRandomIp(), "zer0", "ZER0 Nightclub", true, false, false, false, 32);
		Zer0Nightclub.setHackingParameters(50, 750000, 25, 40);
		
		NectarNightclub.init(createRandomIp(), "nectar-net", "Nectar Nightclub Network", true, false, false, false, 16);
		NectarNightclub.setHackingParameters(25, 400000, 20, 25);
		
		NeoNightclub.init(createRandomIp(), "neo-net", "Neo Nightclub Network", true, false, false, false, 32);
		NeoNightclub.setHackingParameters(75, 500000, 25, 25);
		
		SilverHelix.init(createRandomIp(), "silver-helix", "Silver Helix", true, false, false, false, 16);
		SilverHelix.setHackingParameters(150, 1000000, 30, 30);
		
		HongFangTeaHouse.init(createRandomIp(), "hong-fang-tea", "HongFang Teahouse", true, false, false, false, 16);
		HongFangTeaHouse.setHackingParameters(60, 250000, 15, 10);
		
		HaraKiriSushiBar.init(createRandomIp(), "harakiri-sushi", "HaraKiri Sushi Bar Network", true, false, false, false, 8);
		HaraKiriSushiBar.setHackingParameters(50, 100000, 10, 40);
		
		Phantasy.init(createRandomIp(), "phantasy", "Phantasy Club", true, false, false, false, 16);
		Phantasy.setHackingParameters(100, 300000, 20, 35);
		
		MaxHardware.init(createRandomIp(), "max-hardware", "Max Hardware Store", true, false, false, false, 16);
		MaxHardware.setHackingParameters(80, 150000, 15, 10);
		
		OmegaSoftware.init(createRandomIp(), "omega-net", "Omega Software", true, false, false, false, 64);
		OmegaSoftware.setHackingParameters(200, 1000000, 30, 30);

		//Gyms
		CrushFitnessGym.init(createRandomIp(), "crush-fitness", "Crush Fitness", true, false, false, false, 8);
		CrushFitnessGym.setHackingParameters(250, 500000, 40, 25);
		
		IronGym.init(createRandomIp(), "iron-gym", "Iron Gym Network", true, false, false, false, 8);
		IronGym.setHackingParameters(100, 250000, 30, 15);
		
		MilleniumFitnessGym.init(createRandomIp(), "millenium-fitness", "Millenium Fitness Network", true, false, false, false, 16);
		MilleniumFitnessGym.setHackingParameters(500, 600000, 50, 30);
		
		PowerhouseGym.init(createRandomIp(), "powerhouse-fitness", "Powerhouse Fitness", true, false, false, false, 16);
		PowerhouseGym.setHackingParameters(1000, 2000000, 60, 50);

		SnapFitnessGym.init(createRandomIp(), "snap-fitness", "Snap Fitness", true, false, false, false, 16);
		SnapFitnessGym.setHackingParameters(750, 1000000, 50, 45);
	}
}
