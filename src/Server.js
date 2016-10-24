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
	var ip = createRandomByte() +'.' +
			 createRandomByte() +'.' +
			 createRandomByte() +'.' +
		 	 createRandomByte();
	return ip;
}

createRandomByte = function() {
	return Math.round(Math.random()*256);
}

//Create all "foreign" servers that exist in the game. This does not include
//servers that the player can purchase or the player's starting computer
ForeignServers = {
	//Megacorporations (each one forms its own faction?)
	ECorp: 						new Server(),   //Group15
	MegaCorp: 					new Server(),   //Group15
	BachmanAndAssociates: 		new Server(),   //Group14
	BladeIndustries: 			new Server(),   //Group14
	NWO: 						new Server(),   //Group14
	ClarkeIncorporated: 		new Server(),   //Group14
	OmniTekIncorporated: 		new Server(),   //Group13
	FourSigma: 					new Server(),   //Group13
	KuaiGongInternational: 		new Server(),   //Group13
	
	//Technology and communication companies ("Large" targets)
	FulcrumTechnologies: 		new Server(),   //Group12
	FulcrumSecretTechnologies: 	new Server(),   //Group15
	StormTechnologies: 			new Server(),   //Group12
	DefComm: 					new Server(),   //Group9
	InfoComm: 					new Server(),   //Group10
	HeliosLabs: 				new Server(),   //Group12
	VitaLife: 					new Server(),   //Group12
	IcarusMicrosystems: 		new Server(),   //Group9
	UniversalEnergy: 			new Server(),   //Group9
	TitanLabs: 					new Server(),   //Group11
	MicrodyneTechnologies: 		new Server(),   //Group11
	TaiYangDigital: 			new Server(),   //Group10
	GalacticCybersystems: 		new Server(),   //Group7
	
	//Defense Companies ("Large" Companies)
	AeroCorp: 					new Server(),   //Group7
	OmniaCybersystems: 			new Server(),   //Group8
	ZBDefense: 					new Server(),   //Group10
	AppliedEnergetics: 			new Server(),   //Group11
	SolarisSpaceSystems: 		new Server(),   //Group9
	DeltaOne: 					new Server(),   //Group8
	
	//Health, medicine, pharmaceutical companies ("Large" targets)
	GlobalPharmaceuticals: 		new Server(),   //Group7
	NovaMedical: 				new Server(),   //Group10
	ZeusMedical: 				new Server(),   //Group9
	UnitaLifeGroup: 			new Server(),   //Group8
	
	//"Medium level" targets
	LexoCorp: 					new Server(),   //Group6
	RhoConstruction: 			new Server(),   //Group6
	AlphaEnterprises: 			new Server(),   //Group6
	RothmanUniversity:			new Server(),   //Group5
	ZBInstituteOfTechnology: 	new Server(),   //Group5
	SummitUniversity: 			new Server(),   //Group5
	SysCoreSecurities: 			new Server(),   //Group5
	CatalystVentures: 			new Server(),   //Group5
	TheHub: 					new Server(),   //Group4
	CompuTek: 					new Server(),   //Group4
	NetLinkTechnologies: 		new Server(),   //Group4
	
	//"Low level" targets
	FoodNStuff: 				new Server(),   //Group1
	SigmaCosmetics: 			new Server(),   //Group1
	JoesGuns: 					new Server(),   //Group1
	Zer0Nightclub: 				new Server(),   //Group2
	NectarNightclub: 			new Server(),   //Group2
	NeoNightclub: 				new Server(),   //Group3
	SilverHelix: 				new Server(),   //Group3
	HongFangTeaHouse: 			new Server(),   //Group1
	HaraKiriSushiBar:			new Server(),   //Group1
	Phantasy: 					new Server(),   //Group3
	MaxHardware: 				new Server(),   //Group2
	OmegaSoftware: 				new Server(),   //Group3

	//Gyms
	CrushFitnessGym: 			new Server(),   //Group4
	IronGym:					new Server(),   //Group1
	MilleniumFitnessGym:		new Server(),   //Group6
	PowerhouseGym:				new Server(),   //Group14
	SnapFitnessGym:				new Server(),   //Group7
    
	/* Initialization */
	init: function() {
		//MegaCorporations
		ForeignServers.ECorp.init(createRandomIp(), "ecorp", "ECorp", true, false, false, false, 512);
		ForeignServers.ECorp.setHackingParameters(900, 100000000000, 99, 99);
		
		ForeignServers.MegaCorp.init(createRandomIp(), "megacorp", "MegaCorp", true, false, false, false, 512);
		ForeignServers.MegaCorp.setHackingParameters(900, 80000000000, 99, 99);
		
		ForeignServers.BachmanAndAssociates.init(createRandomIp(), "b-and-a", "Bachman & Associates", true, false, false, false, 480);
		ForeignServers.BachmanAndAssociates.setHackingParameters(900, 32000000000, 80, 70);
		
		ForeignServers.BladeIndustries.init(createRandomIp(), "blade", "Blade Industries", true, false, false, false, 480);
		ForeignServers.BladeIndustries.setHackingParameters(900, 20000000000, 90, 65);
		
		ForeignServers.NWO.init(createRandomIp(), "nwo", "New World Order", true, false, false, false, 512);
		ForeignServers.NWO.setHackingParameters(900, 40000000000, 99, 80);
		
		ForeignServers.ClarkeIncorporated.init(createRandomIp(), "clarkeinc", "Clarke Incorporated", true, false, false, false, 448);
		ForeignServers.ClarkeIncorporated.setHackingParameters(900, 15000000000, 50, 60);
		
		ForeignServers.OmniTekIncorporated.init(createRandomIp(), "omnitek", "OmniTek Incorporated", true, false, false, false, 1024);
		ForeignServers.OmniTekIncorporated.setHackingParameters(900, 50000000000, 95, 99);
		
		ForeignServers.FourSigma.init(createRandomIp(), "4sigma", "FourSigma", true, false, false, false, 448);
		ForeignServers.FourSigma.setHackingParameters(900, 25000000000, 60, 80);
		
		ForeignServers.KuaiGongInternational.init(createRandomIp(), "kuai-gong", "KuaiGong International", true, false, false, false, 512);
		ForeignServers.KuaiGongInternational.setHackingParameters(925, 75000000000, 99, 99);
		
		//Technology and communications companies (large targets)
		ForeignServers.FulcrumTechnologies.init(createRandomIp(), "fulcrumtech", "Fulcrum Technologies", true, false, false, false, 512);
		ForeignServers.FulcrumTechnologies.setHackingParameters(900, 2000000000, 90, 85);
		
		ForeignServers.FulcrumSecretTechnologies.init(createRandomIp(), "fulcrumassets", "Fulcrum Technologies Assets", true, false, false, false, 1024);
		ForeignServers.FulcrumSecretTechnologies.setHackingParameters(999, 1000000, 99, 1);
		
		ForeignServers.StormTechnologies.init(createRandomIp(), "stormtech", "Storm Technologies", true, false, false, false, 256);
		ForeignServers.StormTechnologies.setHackingParameters(850, 1500000000, 85, 80);
		
		ForeignServers.DefComm.init(createRandomIp(), "defcomm", "DefComm", true, false, false, false, 256);
		ForeignServers.DefComm.setHackingParameters(825, 900000000, 90, 60);
		
		ForeignServers.InfoComm.init(createRandomIp(), "infocomm", "InfoComm", true, false, false, false, 256);
		ForeignServers.InfoComm.setHackingParameters(830, 750000000, 80, 50);
		
		ForeignServers.HeliosLabs.init(createRandomIp(), "helios", "Helios Labs", true, false, false, false, 288);
		ForeignServers.HeliosLabs.setHackingParameters(800, 500000000, 90, 75);
		
		ForeignServers.VitaLife.init(createRandomIp(), "vitalife", "VitaLife", true, false, false, false, 224);
		ForeignServers.VitaLife.setHackingParameters(775, 800000000, 85, 70);
		
		ForeignServers.IcarusMicrosystems.init(createRandomIp(), "icarus", "Icarus Microsystems", true, false, false, false, 256);
		ForeignServers.IcarusMicrosystems.setHackingParameters(810, 1100000000, 90, 90);
		
		ForeignServers.UniversalEnergy.init(createRandomIp(), "univ-energy", "Universal Energy", true, false, false, false, 256);
		ForeignServers.UniversalEnergy.setHackingParameters(790, 1500000000, 85, 85);
		
		ForeignServers.TitanLabs.init(createRandomIp(), "titan-labs", "Titan Laboratories", true, false, false, false, 256);
		ForeignServers.TitanLabs.setHackingParameters(795, 1000000000, 75, 70);
		
		ForeignServers.MicrodyneTechnologies.init(createRandomIp(), "microdyne", "Microdyne Technologies", true, false, false, false, 288);
		ForeignServers.MicrodyneTechnologies.setHackingParameters(800, 900000000, 70, 80);
		
		ForeignServers.TaiYangDigital.init(createRandomIp(), "taiyang-digital", "Taiyang Digital", true, false, false, false, 256);
		ForeignServers.TaiYangDigital.setHackingParameters(850, 1100000000, 75, 75);
		
	    ForeignServers.GalacticCybersystems.init(createRandomIp(), "galactic-cyber", "Galactic Cybersystems", true, false, false, false, 288);
		ForeignServers.GalacticCybersystems.setHackingParameters(825, 500000000, 60, 80);
		
		//Defense Companies ("Large" Companies)
		ForeignServers.AeroCorp.init(createRandomIp(), "aerocorp", "AeroCorp", true, false, false, false, 320);
		ForeignServers.AeroCorp.setHackingParameters(850, 1500000000, 85, 60);
		
		ForeignServers.OmniaCybersystems.init(createRandomIp(), "omnia", "Omnia Cybersystems", true, false, false, false, 320);
		ForeignServers.OmniaCybersystems.setHackingParameters(825, 1200000000, 90, 65);
		
		ForeignServers.ZBDefense.init(createRandomIp(), "zb-def", "ZB Defense Industries", true, false, false, false, 288);
		ForeignServers.ZBDefense.setHackingParameters(800, 1000000000, 60, 70);
		
		ForeignServers.AppliedEnergetics.init(createRandomIp(), "applied-energetics", "Applied Energetics", true, false, false, false, 288);
		ForeignServers.AppliedEnergetics.setHackingParameters(775, 1200000000, 70, 72);
		
		ForeignServers.SolarisSpaceSystems.init(createRandomIp(), "solaris", "Solaris Space Systems", true, false, false, false, 288);
		ForeignServers.SolarisSpaceSystems.setHackingParameters(800, 900000000, 75, 75);
		
		ForeignServers.DeltaOne.init(createRandomIp(), "deltaone", "Delta One", true, false, false, false, 288);
		ForeignServers.DeltaOne.setHackingParameters(810, 1500000000, 80, 60);
		
		//Health, medicine, pharmaceutical companies ("Large" targets)
		ForeignServers.GlobalPharmaceuticals.init(createRandomIp(), "global-pharm", "Global Pharmaceuticals", true, false, false, false, 256);
		ForeignServers.GlobalPharmaceuticals.setHackingParameters(775, 2000000000, 80, 85);
		
		ForeignServers.NovaMedical.init(createRandomIp(), "nova-med", "Nova Medical", true, false, false, false, 288);
		ForeignServers.NovaMedical.setHackingParameters(800, 1500000000, 70, 75);
		
		ForeignServers.ZeusMedical.init(createRandomIp(), "zeud-med", "Zeus Medical", true, false, false, false, 320);
		ForeignServers.ZeusMedical.setHackingParameters(810, 1750000000, 80, 75);
		
		ForeignServers.UnitaLifeGroup.init(createRandomIp(), "unitalife", "UnitaLife Group", true, false, false, false, 288);
		ForeignServers.UnitaLifeGroup.setHackingParameters(790, 1400000000, 75, 75);
		
		//"Medium level" targets
		ForeignServers.LexoCorp.init(createRandomIp(), "lexo-corp", "Lexo Corporation", true, false, false, false, 256);
		ForeignServers.LexoCorp.setHackingParameters(700, 1000000000, 70, 60);
		
		ForeignServers.RhoConstruction.init(createRandomIp(), "rho-construction", "Rho Construction", true, false, false, false, 128);
		ForeignServers.RhoConstruction.setHackingParameters(500, 750000000, 50, 50);
		
		ForeignServers.AlphaEnterprises.init(createRandomIp(), "alpha-ent", "Alpha Enterprises", true, false, false, false, 192);
		ForeignServers.AlphaEnterprises.setHackingParameters(550, 800000000, 60, 55);
		
		ForeignServers.RothmanUniversity.init(createRandomIp(), "rothman-uni", "Rothman University Network", true, false, false, false, 160);
		ForeignServers.RothmanUniversity.setHackingParameters(400, 250000000, 50, 40);
		
		ForeignServers.ZBInstituteOfTechnology.init(createRandomIp(), "zb-institute", "ZB Institute of Technology Network", true, false, false, false, 256);
		ForeignServers.ZBInstituteOfTechnology.setHackingParameters(750, 1000000000, 75, 80);
		
		ForeignServers.SummitUniversity.init(createRandomIp(), "summit-uni", "Summit University Network", true, false, false, false, 128);
		ForeignServers.SummitUniversity.setHackingParameters(450, 200000000, 55, 50);
		
		ForeignServers.SysCoreSecurities.init(createRandomIp(), "syscore", "SysCore Securities", true, false, false, false, 192);
		ForeignServers.SysCoreSecurities.setHackingParameters(600, 600000000, 70, 65);
		
		ForeignServers.CatalystVentures.init(createRandomIp(), "catalyst", "Catalyst Ventures", true, false, false, false, 160);
		ForeignServers.CatalystVentures.setHackingParameters(425, 900000000, 65, 40);
		
		ForeignServers.TheHub.init(createRandomIp(), "the-hub", "The Hub", true, false, false, false, 128);
		ForeignServers.TheHub.setHackingParameters(300, 250000000, 40, 50);
		
		ForeignServers.CompuTek.init(createRandomIp(), "comptek", "CompuTek", true, false, false, false, 192);
		ForeignServers.CompuTek.setHackingParameters(350, 300000000, 60, 55);

		ForeignServers.NetLinkTechnologies.init(createRandomIp(), "netlink", "NetLink Technologies", true, false, false, false, 192);
		ForeignServers.NetLinkTechnologies.setHackingParameters(400, 350000000, 70, 60);
		
		//"Low level" targets
		ForeignServers.FoodNStuff.init(createRandomIp(), "foodnstuff", "Food N Stuff Supermarket", true, false, false, false, 8);
		ForeignServers.FoodNStuff.setHackingParameters(1, 1000000, 10, 20);
		
		ForeignServers.SigmaCosmetics.init(createRandomIp(), "sigma-cosmetics", "Sigma Cosmetics", true, false, false, false, 16);
		ForeignServers.SigmaCosmetics.setHackingParameters(5, 500000, 5, 10);
		
		ForeignServers.JoesGuns.init(createRandomIp(), "joesguns", "Joe's Guns", true, false, false, false, 16);
		ForeignServers.JoesGuns.setHackingParameters(10, 200000, 20, 20);
		
		ForeignServers.Zer0Nightclub.init(createRandomIp(), "zer0", "ZER0 Nightclub", true, false, false, false, 32);
		ForeignServers.Zer0Nightclub.setHackingParameters(50, 750000, 25, 40);
		
		ForeignServers.NectarNightclub.init(createRandomIp(), "nectar-net", "Nectar Nightclub Network", true, false, false, false, 16);
		ForeignServers.NectarNightclub.setHackingParameters(25, 400000, 20, 25);
		
		ForeignServers.NeoNightclub.init(createRandomIp(), "neo-net", "Neo Nightclub Network", true, false, false, false, 32);
		ForeignServers.NeoNightclub.setHackingParameters(75, 500000, 25, 25);
		
		ForeignServers.SilverHelix.init(createRandomIp(), "silver-helix", "Silver Helix", true, false, false, false, 16);
		ForeignServers.SilverHelix.setHackingParameters(150, 1000000, 30, 30);
		
		ForeignServers.HongFangTeaHouse.init(createRandomIp(), "hong-fang-tea", "HongFang Teahouse", true, false, false, false, 16);
		ForeignServers.HongFangTeaHouse.setHackingParameters(60, 250000, 15, 10);
		
		ForeignServers.HaraKiriSushiBar.init(createRandomIp(), "harakiri-sushi", "HaraKiri Sushi Bar Network", true, false, false, false, 8);
		ForeignServers.HaraKiriSushiBar.setHackingParameters(50, 100000, 10, 40);
		
		ForeignServers.Phantasy.init(createRandomIp(), "phantasy", "Phantasy Club", true, false, false, false, 16);
		ForeignServers.Phantasy.setHackingParameters(100, 300000, 20, 35);
		
		ForeignServers.MaxHardware.init(createRandomIp(), "max-hardware", "Max Hardware Store", true, false, false, false, 16);
		ForeignServers.MaxHardware.setHackingParameters(80, 150000, 15, 10);
		
		ForeignServers.OmegaSoftware.init(createRandomIp(), "omega-net", "Omega Software", true, false, false, false, 64);
		ForeignServers.OmegaSoftware.setHackingParameters(200, 1000000, 30, 30);

		//Gyms
		ForeignServers.CrushFitnessGym.init(createRandomIp(), "crush-fitness", "Crush Fitness", true, false, false, false, 8);
		ForeignServers.CrushFitnessGym.setHackingParameters(250, 500000, 40, 25);
		
		ForeignServers.IronGym.init(createRandomIp(), "iron-gym", "Iron Gym Network", true, false, false, false, 8);
		ForeignServers.IronGym.setHackingParameters(100, 250000, 30, 15);
		
		ForeignServers.MilleniumFitnessGym.init(createRandomIp(), "millenium-fitness", "Millenium Fitness Network", true, false, false, false, 16);
		ForeignServers.MilleniumFitnessGym.setHackingParameters(500, 600000, 50, 30);
		
		ForeignServers.PowerhouseGym.init(createRandomIp(), "powerhouse-fitness", "Powerhouse Fitness", true, false, false, false, 16);
		ForeignServers.PowerhouseGym.setHackingParameters(1000, 2000000, 60, 50);

		ForeignServers.SnapFitnessGym.init(createRandomIp(), "snap-fitness", "Snap Fitness", true, false, false, false, 16);
		ForeignServers.SnapFitnessGym.setHackingParameters(750, 1000000, 50, 45);
        
        ForeignServers.createNetwork();
	},
    
    

    
    /* Create a randomized network of all foreign servers */
    createNetwork: function() {
        //Groupings for creating a randomized network
        var NetworkGroup1 =     [ForeignServers.IronGym, ForeignServers.FoodNStuff, ForeignServers.SigmaCosmetics, ForeignServers.JoesGuns, ForeignServers.HongFangTeaHouse, ForeignServers.HaraKiriSushiBar];
        var NetworkGroup2 =     [ForeignServers.MaxHardware, ForeignServers.NectarNightclub, ForeignServers.Zer0Nightclub];
        var NetworkGroup3 =     [ForeignServers.OmegaSoftware, ForeignServers.Phantasy, ForeignServers.SilverHelix, ForeignServers.NeoNightclub];
        var NetworkGroup4 =     [ForeignServers.CrushFitnessGym, ForeignServers.NetLinkTechnologies, ForeignServers.CompuTek, ForeignServers.TheHub];
        var NetworkGroup5 =     [ForeignServers.CatalystVentures, ForeignServers.SysCoreSecurities, ForeignServers.SummitUniversity, ForeignServers.ZBInstituteOfTechnology, ForeignServers.RothmanUniversity];
        var NetworkGroup6 =     [ForeignServers.LexoCorp, ForeignServers.RhoConstruction, ForeignServers.AlphaEnterprises, ForeignServers.MilleniumFitnessGym];
        var NetworkGroup7 =     [ForeignServers.GlobalPharmaceuticals, ForeignServers.AeroCorp, ForeignServers.GalacticCybersystems, ForeignServers.SnapFitnessGym];
        var NetworkGroup8 =     [ForeignServers.DeltaOne, ForeignServers.UnitaLifeGroup, ForeignServers.OmniaCybersystems];
        var NetworkGroup9 =     [ForeignServers.ZeusMedical, ForeignServers.SolarisSpaceSystems, ForeignServers.UniversalEnergy, ForeignServers.IcarusMicrosystems, ForeignServers.DefComm];
        var NetworkGroup10 =    [ForeignServers.NovaMedical, ForeignServers.ZBDefense, ForeignServers.TaiYangDigital, ForeignServers.InfoComm];
        var NetworkGroup11 =    [ForeignServers.AppliedEnergetics, ForeignServers.MicrodyneTechnologies, ForeignServers.TitanLabs];
        var NetworkGroup12 =    [ForeignServers.VitaLife, ForeignServers.HeliosLabs, ForeignServers.StormTechnologies, ForeignServers.FulcrumTechnologies];
        var NetworkGroup13 =    [ForeignServers.KuaiGongInternational, ForeignServers.FourSigma, ForeignServers.OmniTekIncorporated];
        var NetworkGroup14 =    [ForeignServers.PowerhouseGym, ForeignServers.ClarkeIncorporated, ForeignServers.NWO, ForeignServers.BladeIndustries, ForeignServers.BachmanAndAssociates];
        var NetworkGroup15 =    [ForeignServers.FulcrumSecretTechnologies, ForeignServers.MegaCorp, ForeignServers.ECorp];
        
        for (var i = 0; i < NetworkGroup2.length; i++) {
            var randomServerFromPrevGroup = NetworkGroup1[Math.floor(Math.random() * NetworkGroup1.length)];
            NetworkGroup2[i].serversOnNetwork = randomServerFromPrevGroup;
            randomServerFromPrevGroup.serversOnNetwork = NetworkGroup2[i];
        }
        
        for (var i = 0; i < NetworkGroup3.length; i++) {
            var randomServerFromPrevGroup = NetworkGroup2[Math.floor(Math.random() * NetworkGroup2.length)];
            NetworkGroup3[i].serversOnNetwork = randomServerFromPrevGroup;
            randomServerFromPrevGroup.serversOnNetwork = NetworkGroup3[i];
        }
        
        for (var i = 0; i < NetworkGroup4.length; i++) {
            var randomServerFromPrevGroup = NetworkGroup3[Math.floor(Math.random() * NetworkGroup3.length)];
            NetworkGroup4[i].serversOnNetwork = randomServerFromPrevGroup;
            randomServerFromPrevGroup.serversOnNetwork = NetworkGroup4[i];
        }
        
        for (var i = 0; i < NetworkGroup5.length; i++) {
            var randomServerFromPrevGroup = NetworkGroup4[Math.floor(Math.random() * NetworkGroup4.length)];
            NetworkGroup5[i].serversOnNetwork = randomServerFromPrevGroup;
            randomServerFromPrevGroup.serversOnNetwork = NetworkGroup5[i];
        }
        
        for (var i = 0; i < NetworkGroup6.length; i++) {
            var randomServerFromPrevGroup = NetworkGroup5[Math.floor(Math.random() * NetworkGroup5.length)];
            NetworkGroup6[i].serversOnNetwork = randomServerFromPrevGroup;
            randomServerFromPrevGroup.serversOnNetwork = NetworkGroup6[i];
        }
        
        for (var i = 0; i < NetworkGroup7.length; i++) {
            var randomServerFromPrevGroup = NetworkGroup6[Math.floor(Math.random() * NetworkGroup6.length)];
            NetworkGroup7[i].serversOnNetwork = randomServerFromPrevGroup;
            randomServerFromPrevGroup.serversOnNetwork = NetworkGroup7[i];
        }
        
        for (var i = 0; i < NetworkGroup8.length; i++) {
            var randomServerFromPrevGroup = NetworkGroup7[Math.floor(Math.random() * NetworkGroup7.length)];
            NetworkGroup8[i].serversOnNetwork = randomServerFromPrevGroup;
            randomServerFromPrevGroup.serversOnNetwork = NetworkGroup8[i];
        }
        
        for (var i = 0; i < NetworkGroup9.length; i++) {
            var randomServerFromPrevGroup = NetworkGroup8[Math.floor(Math.random() * NetworkGroup8.length)];
            NetworkGroup9[i].serversOnNetwork = randomServerFromPrevGroup;
            randomServerFromPrevGroup.serversOnNetwork = NetworkGroup9[i];
        }
        
        for (var i = 0; i < NetworkGroup10.length; i++) {
            var randomServerFromPrevGroup = NetworkGroup9[Math.floor(Math.random() * NetworkGroup9.length)];
            NetworkGroup10[i].serversOnNetwork = randomServerFromPrevGroup;
            randomServerFromPrevGroup.serversOnNetwork = NetworkGroup10[i];
        }
        
        for (var i = 0; i < NetworkGroup11.length; i++) {
            var randomServerFromPrevGroup = NetworkGroup10[Math.floor(Math.random() * NetworkGroup10.length)];
            NetworkGroup11[i].serversOnNetwork = randomServerFromPrevGroup;
            randomServerFromPrevGroup.serversOnNetwork = NetworkGroup11[i];
        }
        
        for (var i = 0; i < NetworkGroup12.length; i++) {
            var randomServerFromPrevGroup = NetworkGroup11[Math.floor(Math.random() * NetworkGroup11.length)];
            NetworkGroup12[i].serversOnNetwork = randomServerFromPrevGroup;
            randomServerFromPrevGroup.serversOnNetwork = NetworkGroup12[i];
        }
        
        for (var i = 0; i < NetworkGroup13.length; i++) {
            var randomServerFromPrevGroup = NetworkGroup12[Math.floor(Math.random() * NetworkGroup12.length)];
            NetworkGroup13[i].serversOnNetwork = randomServerFromPrevGroup;
            randomServerFromPrevGroup.serversOnNetwork = NetworkGroup13[i];
        }
        
        for (var i = 0; i < NetworkGroup14.length; i++) {
            var randomServerFromPrevGroup = NetworkGroup13[Math.floor(Math.random() * NetworkGroup13.length)];
            NetworkGroup14[i].serversOnNetwork = randomServerFromPrevGroup;
            randomServerFromPrevGroup.serversOnNetwork = NetworkGroup14[i];
        }
        
        for (var i = 0; i < NetworkGroup15.length; i++) {
            var randomServerFromPrevGroup = NetworkGroup14[Math.floor(Math.random() * NetworkGroup14.length)];
            NetworkGroup15[i].serversOnNetwork = randomServerFromPrevGroup;
            randomServerFromPrevGroup.serversOnNetwork = NetworkGroup15[i];
        }
    }
}
