//Netburner Server class
//TODO Make a map of all IPS in the game so far so that we don't accidentally
//		get duplicate IPs..however unlikely it is
function Server(ip=createRandomIp(), hostname="", organizationName="",
                isConnectedTo=false, adminRights=false, purchasedByPlayer=false, maxRam=0) {
	/* Properties */
	//Connection information
	this.ip					= 	ip;
    var i = 0;
    while (GetServerByHostname(hostname) != null) {
        //Server already exists
        hostname = hostname + "-" + i;
        ++i;
    }
	this.hostname			= 	hostname;
	this.organizationName 	= 	organizationName;
	this.isConnectedTo		= 	isConnectedTo;	//Whether the player is connected to this server

	//Access information
	this.hasAdminRights		=	adminRights;	//Whether player has admin rights
	this.purchasedByPlayer	=	purchasedByPlayer;
    this.manuallyHacked     =   false;  //Flag that tracks whether or not the server has been hacked at least once

	//RAM, CPU speed and Scripts
	this.maxRam			=	maxRam;  //GB
	this.ramUsed		=	0;
	this.cpuSpeed		= 	1;	//MHz

	this.scripts 		= 	[];
	this.runningScripts = 	[]; 	//Stores RunningScript objects
	this.programs 		= 	[];
    this.messages       =   [];

	/* Hacking information (only valid for "foreign" aka non-purchased servers) */
	//Skill required to attempt a hack. Whether a hack is successful will be determined
	//by a separate formula
	this.requiredHackingSkill	= 1;

	//Total money available on this server
	this.moneyAvailable 		= 0;
    this.moneyMax               = 0;

	//Parameters used in formulas that dictate how moneyAvailable and requiredHackingSkill change.
	this.hackDifficulty			= 1;	//Affects hack success rate and how the requiredHackingSkill increases over time (1-100)
    this.baseDifficulty         = 1;    //Starting difficulty
    this.minDifficulty          = 1;
	this.serverGrowth			= 0;	//Affects how the moneyAvailable increases (0-100)
	this.timesHacked 			= 0;

	//The IP's of all servers reachable from this one (what shows up if you run scan/netstat)
    //  NOTE: Only contains IP and not the Server objects themselves
	this.serversOnNetwork		= [];

	//Port information, required for porthacking servers to get admin rights
	this.numOpenPortsRequired 	= 5;
	this.sshPortOpen 			= false;	//Port 22
	this.ftpPortOpen 			= false;	//Port 21
	this.smtpPortOpen 			= false;	//Port 25
	this.httpPortOpen			= false;	//Port 80
	this.sqlPortOpen 			= false; 	//Port 1433
	this.openPortCount 			= 0;
};

//Set the hacking properties of a server
Server.prototype.setHackingParameters = function(requiredHackingSkill, moneyAvailable, hackDifficulty, serverGrowth) {
	this.requiredHackingSkill = requiredHackingSkill;
    if (isNaN(moneyAvailable)) {
        this.moneyAvailable = 1000000;
    } else {
        this.moneyAvailable = moneyAvailable;
    }
    this.moneyMax = 25 * moneyAvailable * BitNodeMultipliers.ServerMaxMoney;
	this.hackDifficulty = hackDifficulty;
    this.baseDifficulty = hackDifficulty;
    this.minDifficulty = Math.max(1, Math.round(hackDifficulty / 3));
	this.serverGrowth = serverGrowth;
}

//Set the port properties of a server
//Right now its only the number of open ports needed to PortHack the server.
Server.prototype.setPortProperties = function(numOpenPortsReq) {
	this.numOpenPortsRequired = numOpenPortsReq;
}

//The serverOnNetwork array holds the IP of all the servers. This function
//returns the actual Server objects
Server.prototype.getServerOnNetwork = function(i) {
    if (i > this.serversOnNetwork.length) {
        console.log("Tried to get server on network that was out of range");
        return;
    }
    return AllServers[this.serversOnNetwork[i]];
}

//Given the name of the script, returns the corresponding
//script object on the server (if it exists)
Server.prototype.getScript = function(scriptName) {
	for (var i = 0; i < this.scripts.length; i++) {
		if (this.scripts[i].filename == scriptName) {
			return this.scripts[i];
		}
	}
	return null;
}

//Strengthens a server's security level (difficulty) by the specified amount
Server.prototype.fortify = function(amt) {
    this.hackDifficulty += amt;
    if (this.hackDifficulty > 99) {this.hackDifficulty = 99;}
}

Server.prototype.weaken = function(amt) {
    this.hackDifficulty -= amt;
    if (this.hackDifficulty < this.minDifficulty) {this.hackDifficulty = this.minDifficulty;}
    if (this.hackDifficulty < 1) {this.hackDifficulty = 1;}
}

//Functions for loading and saving a Server
Server.prototype.toJSON = function() {
	return Generic_toJSON("Server", this);
}

Server.fromJSON = function(value) {
	return Generic_fromJSON(Server, value.data);
}

Reviver.constructors.Server = Server;

initForeignServers = function() {
    //MegaCorporations
    var ECorpServer = new Server(createRandomIp(), "ecorp", "ECorp", false, false, false, 0);
    ECorpServer.setHackingParameters(getRandomInt(1150, 1300), getRandomInt(30000000000, 70000000000), 99, 99);
    ECorpServer.setPortProperties(5);
    AddToAllServers(ECorpServer);

    var MegaCorpServer = new Server(createRandomIp(), "megacorp", "MegaCorp", false, false, false, 0);
    MegaCorpServer.setHackingParameters(getRandomInt(1150, 1300), getRandomInt(40000000000, 60000000000), 99, 99);
    MegaCorpServer.setPortProperties(5);
    AddToAllServers(MegaCorpServer);

    var BachmanAndAssociatesServer = new Server(createRandomIp(), "b-and-a", "Bachman & Associates", false, false, false, 0);
    BachmanAndAssociatesServer.setHackingParameters(getRandomInt(1000, 1050), getRandomInt(20000000000, 25000000000), getRandomInt(75, 85), getRandomInt(65, 75));
    BachmanAndAssociatesServer.setPortProperties(5);
    AddToAllServers(BachmanAndAssociatesServer);

    var BladeIndustriesServer = new Server(createRandomIp(), "blade", "Blade Industries", false, false, false, 0);
    BladeIndustriesServer.setHackingParameters(getRandomInt(1000, 1100), getRandomInt(12000000000, 20000000000), getRandomInt(90, 95), getRandomInt(60, 75));
    BladeIndustriesServer.setPortProperties(5);
    AddToAllServers(BladeIndustriesServer);

    var NWOServer = new Server(createRandomIp(), "nwo", "New World Order", false, false, false, 0);
    NWOServer.setHackingParameters(getRandomInt(1000, 1200), getRandomInt(25000000000, 35000000000), 99, getRandomInt(75, 85));
    NWOServer.setPortProperties(5);
    AddToAllServers(NWOServer);

    var ClarkeIncorporatedServer = new Server(createRandomIp(), "clarkeinc", "Clarke Incorporated", false, false, false, 0);
    ClarkeIncorporatedServer.setHackingParameters(getRandomInt(1000, 1200), getRandomInt(15000000000, 25000000000), getRandomInt(50, 60), getRandomInt(50, 70));
    ClarkeIncorporatedServer.setPortProperties(5);
    AddToAllServers(ClarkeIncorporatedServer);

    var OmniTekIncorporatedServer = new Server(createRandomIp(), "omnitek", "OmniTek Incorporated", false, false, false, 0);
    OmniTekIncorporatedServer.setHackingParameters(getRandomInt(900, 1100), getRandomInt(15000000000, 20000000000), getRandomInt(90, 99), getRandomInt(95, 99));
    OmniTekIncorporatedServer.setPortProperties(5);
    AddToAllServers(OmniTekIncorporatedServer);

    var FourSigmaServer = new Server(createRandomIp(), "4sigma", "FourSigma", false, false, false, 0);
    FourSigmaServer.setHackingParameters(getRandomInt(950, 1200), getRandomInt(15000000000, 25000000000), getRandomInt(60, 70), getRandomInt(75, 99));
    FourSigmaServer.setPortProperties(5);
    AddToAllServers(FourSigmaServer);

    var KuaiGongInternationalServer = new Server(createRandomIp(), "kuai-gong", "KuaiGong International", false, false, false, 0);
    KuaiGongInternationalServer.setHackingParameters(getRandomInt(1000, 1250), getRandomInt(20000000000, 30000000000), getRandomInt(95, 99), getRandomInt(90, 99));
    KuaiGongInternationalServer.setPortProperties(5);
    AddToAllServers(KuaiGongInternationalServer);

    //Technology and communications companies (large targets)
    var FulcrumTechnologiesServer = new Server(createRandomIp(), "fulcrumtech", "Fulcrum Technologies", false, false, false, 64);
    FulcrumTechnologiesServer.setHackingParameters(getRandomInt(1000, 1200), getRandomInt(1400000000, 1800000000), getRandomInt(85, 95), getRandomInt(80, 99));
    FulcrumTechnologiesServer.setPortProperties(5);
    AddToAllServers(FulcrumTechnologiesServer);

    var FulcrumSecretTechnologiesServer = new Server(createRandomIp(), "fulcrumassets", "Fulcrum Technologies Assets", false, false, false, 0);
    FulcrumSecretTechnologiesServer.setHackingParameters(getRandomInt(1200, 1500), 1000000, 99, 1);
    FulcrumSecretTechnologiesServer.setPortProperties(5);
    AddToAllServers(FulcrumSecretTechnologiesServer);
	SpecialServerIps.addIp(SpecialServerNames.FulcrumSecretTechnologies, FulcrumSecretTechnologiesServer.ip);

    var StormTechnologiesServer = new Server(createRandomIp(), "stormtech", "Storm Technologies", false, false, false, 0);
    StormTechnologiesServer.setHackingParameters(getRandomInt(900, 1050), getRandomInt(1000000000, 1200000000), getRandomInt(80, 90), getRandomInt(70, 90));
    StormTechnologiesServer.setPortProperties(5);
    AddToAllServers(StormTechnologiesServer);

    var DefCommServer = new Server(createRandomIp(), "defcomm", "DefComm", false, false, false, 0);
    DefCommServer.setHackingParameters(getRandomInt(900, 1000), getRandomInt(800000000, 950000000), getRandomInt(85, 95), getRandomInt(50, 70));
    DefCommServer.setPortProperties(5);
    AddToAllServers(DefCommServer);

    var InfoCommServer = new Server(createRandomIp(), "infocomm", "InfoComm", false, false, false, 0);
    InfoCommServer.setHackingParameters(getRandomInt(875, 950), getRandomInt(600000000, 900000000), getRandomInt(70, 90), getRandomInt(35, 75));
    InfoCommServer.setPortProperties(5);
    AddToAllServers(InfoCommServer);

    var HeliosLabsServer = new Server(createRandomIp(), "helios", "Helios Labs", false, false, false, 0);
    HeliosLabsServer.setHackingParameters(getRandomInt(800, 900), getRandomInt(550000000, 750000000), getRandomInt(85, 95), getRandomInt(70, 80));
    HeliosLabsServer.setPortProperties(5);
    AddToAllServers(HeliosLabsServer);

    var VitaLifeServer = new Server(createRandomIp(), "vitalife", "VitaLife", false, false, false, 32);
    VitaLifeServer.setHackingParameters(getRandomInt(775, 900), getRandomInt(700000000, 800000000), getRandomInt(80, 90), getRandomInt(60, 80));
    VitaLifeServer.setPortProperties(5);
    AddToAllServers(VitaLifeServer);

    var IcarusMicrosystemsServer = new Server(createRandomIp(), "icarus", "Icarus Microsystems", false, false, false, 0);
    IcarusMicrosystemsServer.setHackingParameters(getRandomInt(850, 925), getRandomInt(900000000, 1000000000), getRandomInt(85, 95), getRandomInt(85, 95));
    IcarusMicrosystemsServer.setPortProperties(5);
    AddToAllServers(IcarusMicrosystemsServer);

    var UniversalEnergyServer = new Server(createRandomIp(), "univ-energy", "Universal Energy", false, false, false, 32);
    UniversalEnergyServer.setHackingParameters(getRandomInt(800, 900), getRandomInt(1100000000, 1200000000), getRandomInt(80, 90), getRandomInt(80, 90));
    UniversalEnergyServer.setPortProperties(4);
    AddToAllServers(UniversalEnergyServer);

    var TitanLabsServer = new Server(createRandomIp(), "titan-labs", "Titan Laboratories", false, false, false, 32);
    TitanLabsServer.setHackingParameters(getRandomInt(800, 875), getRandomInt(750000000, 900000000), getRandomInt(70, 80), getRandomInt(60, 80));
    TitanLabsServer.setPortProperties(5);
    AddToAllServers(TitanLabsServer);

    var MicrodyneTechnologiesServer = new Server(createRandomIp(), "microdyne", "Microdyne Technologies", false, false, false, 16);
    MicrodyneTechnologiesServer.setHackingParameters(getRandomInt(800, 875), getRandomInt(500000000, 700000000), getRandomInt(65, 75), getRandomInt(70, 90));
    MicrodyneTechnologiesServer.setPortProperties(5);
    AddToAllServers(MicrodyneTechnologiesServer);

    var TaiYangDigitalServer = new Server(createRandomIp(), "taiyang-digital", "Taiyang Digital", false, false, false, 0);
    TaiYangDigitalServer.setHackingParameters(getRandomInt(850, 950), getRandomInt(800000000, 900000000), getRandomInt(70, 80), getRandomInt(70, 80));
    TaiYangDigitalServer.setPortProperties(5);
    AddToAllServers(TaiYangDigitalServer);

    var GalacticCyberSystemsServer = new Server(createRandomIp(), "galactic-cyber", "Galactic Cybersystems", false, false, false, 0);
    GalacticCyberSystemsServer.setHackingParameters(getRandomInt(825, 875), getRandomInt(750000000, 850000000), getRandomInt(55, 65), getRandomInt(70, 90));
    GalacticCyberSystemsServer.setPortProperties(5);
    AddToAllServers(GalacticCyberSystemsServer);

    //Defense Companies ("Large" Companies)
    var AeroCorpServer = new Server(createRandomIp(), "aerocorp", "AeroCorp", false, false, false, 0);
    AeroCorpServer.setHackingParameters(getRandomInt(850, 925), getRandomInt(1000000000, 1200000000), getRandomInt(80, 90), getRandomInt(55, 65));
    AeroCorpServer.setPortProperties(5);
    AddToAllServers(AeroCorpServer);

    var OmniaCybersystemsServer = new Server(createRandomIp(), "omnia", "Omnia Cybersystems", false, false, false, 0);
    OmniaCybersystemsServer.setHackingParameters(getRandomInt(850, 950), getRandomInt(900000000, 1000000000), getRandomInt(85, 95), getRandomInt(60, 70));
    OmniaCybersystemsServer.setPortProperties(5);
    AddToAllServers(OmniaCybersystemsServer);

    var ZBDefenseServer = new Server(createRandomIp(), "zb-def", "ZB Defense Industries", false, false, false, 0);
    ZBDefenseServer.setHackingParameters(getRandomInt(775, 825), getRandomInt(900000000, 1100000000), getRandomInt(55, 65), getRandomInt(65, 75));
    ZBDefenseServer.setPortProperties(4);
    AddToAllServers(ZBDefenseServer);

    var AppliedEnergeticsServer = new Server(createRandomIp(), "applied-energetics", "Applied Energetics", false, false, false, 0);
    AppliedEnergeticsServer.setHackingParameters(getRandomInt(775, 850), getRandomInt(700000000, 1000000000), getRandomInt(60, 80), getRandomInt(70, 75));
    AppliedEnergeticsServer.setPortProperties(4);
    AddToAllServers(AppliedEnergeticsServer);

    var SolarisSpaceSystemsServer = new Server(createRandomIp(), "solaris", "Solaris Space Systems", false, false, false, 0);
    SolarisSpaceSystemsServer.setHackingParameters(getRandomInt(750, 850), getRandomInt(700000000, 900000000), getRandomInt(70, 80), getRandomInt(70, 80));
    SolarisSpaceSystemsServer.setPortProperties(5);
    AddToAllServers(SolarisSpaceSystemsServer);

    var DeltaOneServer = new Server(createRandomIp(), "deltaone", "Delta One", false, false, false, 0);
    DeltaOneServer.setHackingParameters(getRandomInt(800, 900), getRandomInt(1300000000, 1700000000), getRandomInt(75, 85), getRandomInt(50, 70));
    DeltaOneServer.setPortProperties(5);
    AddToAllServers(DeltaOneServer);

    //Health, medicine, pharmaceutical companies ("Large" targets)
    var GlobalPharmaceuticalsServer = new Server(createRandomIp(), "global-pharm", "Global Pharmaceuticals", false, false, false, 16);
    GlobalPharmaceuticalsServer.setHackingParameters(getRandomInt(750, 850), getRandomInt(1500000000, 1750000000), getRandomInt(75, 85), getRandomInt(80, 90));
    GlobalPharmaceuticalsServer.setPortProperties(4);
    AddToAllServers(GlobalPharmaceuticalsServer);

    var NovaMedicalServer = new Server(createRandomIp(), "nova-med", "Nova Medical", false, false, false, 0);
    NovaMedicalServer.setHackingParameters(getRandomInt(775, 850), getRandomInt(1100000000, 1250000000), getRandomInt(60, 80), getRandomInt(65, 85));
    NovaMedicalServer.setPortProperties(4);
    AddToAllServers(NovaMedicalServer);

    var ZeusMedicalServer = new Server(createRandomIp(), "zeus-med", "Zeus Medical", false, false, false, 0);
    ZeusMedicalServer.setHackingParameters(getRandomInt(800, 850), getRandomInt(1300000000, 1500000000), getRandomInt(70, 90), getRandomInt(70, 80));
    ZeusMedicalServer.setPortProperties(5);
    AddToAllServers(ZeusMedicalServer);

    var UnitaLifeGroupServer = new Server(createRandomIp(), "unitalife", "UnitaLife Group", false, false, false, 32);
    UnitaLifeGroupServer.setHackingParameters(getRandomInt(775, 825), getRandomInt(1000000000, 1100000000), getRandomInt(70, 80), getRandomInt(70, 80));
    UnitaLifeGroupServer.setPortProperties(4);
    AddToAllServers(UnitaLifeGroupServer);

    //"Medium level" targets
    var LexoCorpServer = new Server(createRandomIp(), "lexo-corp", "Lexo Corporation", false, false, false, 16);
    LexoCorpServer.setHackingParameters(getRandomInt(650, 750), getRandomInt(700000000, 800000000), getRandomInt(60, 80), getRandomInt(55, 65));
    LexoCorpServer.setPortProperties(4);
    AddToAllServers(LexoCorpServer);

    var RhoConstructionServer = new Server(createRandomIp(), "rho-construction", "Rho Construction", false, false, false, 0);
    RhoConstructionServer.setHackingParameters(getRandomInt(475, 525), getRandomInt(500000000, 700000000), getRandomInt(40, 60), getRandomInt(40, 60));
    RhoConstructionServer.setPortProperties(3);
    AddToAllServers(RhoConstructionServer);

    var AlphaEnterprisesServer = new Server(createRandomIp(), "alpha-ent", "Alpha Enterprises", false, false, false, 0);
    AlphaEnterprisesServer.setHackingParameters(getRandomInt(500, 600), getRandomInt(600000000, 750000000), getRandomInt(50, 70), getRandomInt(50, 60));
    AlphaEnterprisesServer.setPortProperties(4);
    AddToAllServers(AlphaEnterprisesServer);


    var AevumPoliceServer = new Server(createRandomIp(), "aevum-police", "Aevum Police Network", false, false, false, 0);
    AevumPoliceServer.setHackingParameters(getRandomInt(400, 450), getRandomInt(200000000, 400000000), getRandomInt(70, 80), getRandomInt(30, 50));
    AevumPoliceServer.setPortProperties(4);
    AddToAllServers(AevumPoliceServer);

    var RothmanUniversityServer = new Server(createRandomIp(), "rothman-uni", "Rothman University Network", false, false, false, 4);
    RothmanUniversityServer.setHackingParameters(getRandomInt(370, 430), getRandomInt(175000000, 250000000), getRandomInt(45, 55), getRandomInt(35, 45));
    RothmanUniversityServer.setPortProperties(3);
    AddToAllServers(RothmanUniversityServer);

    var ZBInstituteOfTechnologyServer = new Server(createRandomIp(), "zb-institute", "ZB Institute of Technology Network", false, false, false, 4);
    ZBInstituteOfTechnologyServer.setHackingParameters(getRandomInt(725, 775), getRandomInt(800000000, 1100000000), getRandomInt(65, 85), getRandomInt(75, 85));
    ZBInstituteOfTechnologyServer.setPortProperties(5);
    AddToAllServers(ZBInstituteOfTechnologyServer);

    var SummitUniversityServer = new Server(createRandomIp(), "summit-uni", "Summit University Network", false, false, false, 4);
    SummitUniversityServer.setHackingParameters(getRandomInt(425, 475), getRandomInt(200000000, 350000000), getRandomInt(45, 65), getRandomInt(40, 60));
    SummitUniversityServer.setPortProperties(3);
    AddToAllServers(SummitUniversityServer);

    var SysCoreSecuritiesServer = new Server(createRandomIp(), "syscore", "SysCore Securities", false, false, false, 0);
    SysCoreSecuritiesServer.setHackingParameters(getRandomInt(550, 650), getRandomInt(400000000, 600000000), getRandomInt(60, 80), getRandomInt(60, 70));
    SysCoreSecuritiesServer.setPortProperties(4);
    AddToAllServers(SysCoreSecuritiesServer);

    var CatalystVenturesServer = new Server(createRandomIp(), "catalyst", "Catalyst Ventures", false, false, false, 0);
    CatalystVenturesServer.setHackingParameters(getRandomInt(400, 450), getRandomInt(300000000, 550000000), getRandomInt(60, 70), getRandomInt(25, 55));
    CatalystVenturesServer.setPortProperties(3);
    AddToAllServers(CatalystVenturesServer);

    var TheHubServer = new Server(createRandomIp(), "the-hub", "The Hub", false, false, false, 0);
    TheHubServer.setHackingParameters(getRandomInt(275, 325), getRandomInt(150000000, 200000000), getRandomInt(35, 45), getRandomInt(45, 55));
    TheHubServer.setPortProperties(2);
    AddToAllServers(TheHubServer);

    var CompuTekServer = new Server(createRandomIp(), "comptek", "CompuTek", false, false, false, 8);
    CompuTekServer.setHackingParameters(getRandomInt(300, 400), getRandomInt(220000000, 250000000), getRandomInt(55, 65), getRandomInt(45, 65));
    CompuTekServer.setPortProperties(3);
    AddToAllServers(CompuTekServer);

    var NetLinkTechnologiesServer = new Server(createRandomIp(), "netlink", "NetLink Technologies", false, false, false, 0);
    NetLinkTechnologiesServer.setHackingParameters(getRandomInt(375, 425), 275000000, getRandomInt(60, 80), getRandomInt(45, 75));
    NetLinkTechnologiesServer.setPortProperties(3);
    AddToAllServers(NetLinkTechnologiesServer);

    var JohnsonOrthopedicsServer = new Server(createRandomIp(), "johnson-ortho", "Johnson Orthopedics", false, false, false, 4);
    JohnsonOrthopedicsServer.setHackingParameters(getRandomInt(250, 300), getRandomInt(70000000, 85000000), getRandomInt(35, 65), getRandomInt(35, 65));
    JohnsonOrthopedicsServer.setPortProperties(2);
    AddToAllServers(JohnsonOrthopedicsServer);

    //"Low level" targets
    var FoodNStuffServer = new Server(createRandomIp(), "foodnstuff", "Food N Stuff Supermarket", false, false, false, 8);
    FoodNStuffServer.setHackingParameters(1, 2000000, 10, 5);
    FoodNStuffServer.setPortProperties(0);
    AddToAllServers(FoodNStuffServer);

    var SigmaCosmeticsServer = new Server(createRandomIp(), "sigma-cosmetics", "Sigma Cosmetics", false, false, false, 8);
    SigmaCosmeticsServer.setHackingParameters(5, 2300000, 10, 10);
    SigmaCosmeticsServer.setPortProperties(0);
    AddToAllServers(SigmaCosmeticsServer);

    var JoesGunsServer = new Server(createRandomIp(), "joesguns", "Joe's Guns", false, false, false, 8);
    JoesGunsServer.setHackingParameters(10, 2500000, 15, 20);
    JoesGunsServer.setPortProperties(0);
    AddToAllServers(JoesGunsServer);

    var Zer0NightclubServer = new Server(createRandomIp(), "zer0", "ZER0 Nightclub", false, false, false, 4);
    Zer0NightclubServer.setHackingParameters(75, 7500000, 25, 40);
    Zer0NightclubServer.setPortProperties(1);
    AddToAllServers(Zer0NightclubServer);

    var NectarNightclubServer = new Server(createRandomIp(), "nectar-net", "Nectar Nightclub Network", false, false, false, 8);
    NectarNightclubServer.setHackingParameters(20, 2750000, 20, 25);
    NectarNightclubServer.setPortProperties(0);
    AddToAllServers(NectarNightclubServer);

    var NeoNightclubServer = new Server(createRandomIp(), "neo-net", "Neo Nightclub Network", false, false, false, 4);
    NeoNightclubServer.setHackingParameters(50, 5000000, 25, 25);
    NeoNightclubServer.setPortProperties(1);
    AddToAllServers(NeoNightclubServer);

    var SilverHelixServer = new Server(createRandomIp(), "silver-helix", "Silver Helix", false, false, false, 2);
    SilverHelixServer.setHackingParameters(150, 45000000, 30, 30);
    SilverHelixServer.setPortProperties(2);
    AddToAllServers(SilverHelixServer);

    var HongFangTeaHouseServer = new Server(createRandomIp(), "hong-fang-tea", "HongFang Teahouse", false, false, false, 8);
    HongFangTeaHouseServer.setHackingParameters(30, 3000000, 15, 20);
    HongFangTeaHouseServer.setPortProperties(0);
    AddToAllServers(HongFangTeaHouseServer);

    var HaraKiriSushiBarServer = new Server(createRandomIp(), "harakiri-sushi", "HaraKiri Sushi Bar Network", false, false, false, 8);
    HaraKiriSushiBarServer.setHackingParameters(40, 4000000, 15, 40);
    HaraKiriSushiBarServer.setPortProperties(0);
    AddToAllServers(HaraKiriSushiBarServer);

    var PhantasyServer = new Server(createRandomIp(), "phantasy", "Phantasy Club", false, false, false, 0);
    PhantasyServer.setHackingParameters(100, 24000000, 20, 35);
    PhantasyServer.setPortProperties(2);
    AddToAllServers(PhantasyServer);

    var MaxHardwareServer = new Server(createRandomIp(), "max-hardware", "Max Hardware Store", false, false, false, 4);
    MaxHardwareServer.setHackingParameters(80, 10000000, 15, 30);
    MaxHardwareServer.setPortProperties(1);
    AddToAllServers(MaxHardwareServer);

    var OmegaSoftwareServer = new Server(createRandomIp(), "omega-net", "Omega Software", false, false, false, 8);
    OmegaSoftwareServer.setHackingParameters(getRandomInt(180, 220), getRandomInt(60000000, 70000000), getRandomInt(25, 35), getRandomInt(30, 40));
    OmegaSoftwareServer.setPortProperties(2);
    AddToAllServers(OmegaSoftwareServer);

    //Gyms
    var CrushFitnessGymServer = new Server(createRandomIp(), "crush-fitness", "Crush Fitness", false, false, false, 0);
    CrushFitnessGymServer.setHackingParameters(getRandomInt(225, 275), getRandomInt(40000000, 60000000), getRandomInt(35, 45), getRandomInt(27, 33));
    CrushFitnessGymServer.setPortProperties(2);
    AddToAllServers(CrushFitnessGymServer);

    var IronGymServer = new Server(createRandomIp(), "iron-gym", "Iron Gym Network", false, false, false, 4);
    IronGymServer.setHackingParameters(100, 20000000, 30, 20);
    IronGymServer.setPortProperties(1);
    AddToAllServers(IronGymServer);

    var MilleniumFitnessGymServer = new Server(createRandomIp(), "millenium-fitness", "Millenium Fitness Network", false, false, false, 0);
    MilleniumFitnessGymServer.setHackingParameters(getRandomInt(475, 525), 250000000, getRandomInt(45, 55), getRandomInt(25, 45));
    MilleniumFitnessGymServer.setPortProperties(3);
    AddToAllServers(MilleniumFitnessGymServer);

    var PowerhouseGymServer = new Server(createRandomIp(), "powerhouse-fitness", "Powerhouse Fitness", false, false, false, 0);
    PowerhouseGymServer.setHackingParameters(getRandomInt(950, 1100), 900000000, getRandomInt(55, 65), getRandomInt(50, 60));
    PowerhouseGymServer.setPortProperties(5);
    AddToAllServers(PowerhouseGymServer);

    var SnapFitnessGymServer = new Server(createRandomIp(), "snap-fitness", "Snap Fitness", false, false, false, 0);
    SnapFitnessGymServer.setHackingParameters(getRandomInt(675, 800), 450000000, getRandomInt(40, 60), getRandomInt(40, 60));
    SnapFitnessGymServer.setPortProperties(4);
    AddToAllServers(SnapFitnessGymServer);

	//Faction servers, cannot hack money from these
	var BitRunnersServer = new Server(createRandomIp(), "run4theh111z", "The Runners", false, false, false,  0);
    BitRunnersServer.setHackingParameters(getRandomInt(505, 550), 0, 0, 0);
	BitRunnersServer.setPortProperties(4);
	AddToAllServers(BitRunnersServer);
    SpecialServerIps.addIp(SpecialServerNames.BitRunnersServer, BitRunnersServer.ip);

    var TheBlackHandServer = new Server(createRandomIp(), "I.I.I.I", "I.I.I.I", false, false, false, 0);
    TheBlackHandServer.setHackingParameters(getRandomInt(340, 365), 0, 0, 0);
    TheBlackHandServer.setPortProperties(3);
    AddToAllServers(TheBlackHandServer);
    SpecialServerIps.addIp(SpecialServerNames.TheBlackHandServer, TheBlackHandServer.ip);

	var NiteSecServer = new Server(createRandomIp(), "avmnite-02h", "NiteSec", false, false, false, 0);
    NiteSecServer.setHackingParameters(getRandomInt(202, 220), 0, 0, 0);
	NiteSecServer.setPortProperties(2);
	AddToAllServers(NiteSecServer);
    SpecialServerIps.addIp(SpecialServerNames.NiteSecServer, NiteSecServer.ip);

	var DarkArmyServer = new Server(createRandomIp(), ".", ".", false, false, false, 0);
    DarkArmyServer.setHackingParameters(getRandomInt(505, 550), 0, 0, 0);
	DarkArmyServer.setPortProperties(4);
	AddToAllServers(DarkArmyServer);
    SpecialServerIps.addIp(SpecialServerNames.TheDarkArmyServer, DarkArmyServer.ip);

	var CyberSecServer = new Server(createRandomIp(), "CSEC", "CyberSec", false, false, false, 0);
    CyberSecServer.setHackingParameters(getRandomInt(51, 60), 0, 0, 0);
	CyberSecServer.setPortProperties(1);
	AddToAllServers(CyberSecServer);
    SpecialServerIps.addIp(SpecialServerNames.CyberSecServer, CyberSecServer.ip);

    var DaedalusServer = new Server(createRandomIp(), "The-Cave", "Helios", false, false, false, 0);
    DaedalusServer.setHackingParameters(925, 0, 0, 0);
    DaedalusServer.setPortProperties(5);
    AddToAllServers(DaedalusServer);
    SpecialServerIps.addIp(SpecialServerNames.DaedalusServer, DaedalusServer.ip);

    //Super special Servers
    var WorldDaemon = new Server(createRandomIp(), SpecialServerNames.WorldDaemon, SpecialServerNames.WorldDaemon, false, false, false, 0);
    WorldDaemon.setHackingParameters(3000, 0, 0, 0);
    WorldDaemon.setPortProperties(5);
    AddToAllServers(WorldDaemon);
    SpecialServerIps.addIp(SpecialServerNames.WorldDaemon, WorldDaemon.ip);

    /* Create a randomized network for all the foreign servers */
    //Groupings for creating a randomized network
    var NetworkGroup1 =     [IronGymServer, FoodNStuffServer, SigmaCosmeticsServer, JoesGunsServer, HongFangTeaHouseServer, HaraKiriSushiBarServer];
    var NetworkGroup2 =     [MaxHardwareServer, NectarNightclubServer, Zer0NightclubServer, CyberSecServer];
    var NetworkGroup3 =     [OmegaSoftwareServer, PhantasyServer, SilverHelixServer, NeoNightclubServer];
    var NetworkGroup4 =     [CrushFitnessGymServer, NetLinkTechnologiesServer, CompuTekServer, TheHubServer, JohnsonOrthopedicsServer, NiteSecServer];
    var NetworkGroup5 =     [CatalystVenturesServer, SysCoreSecuritiesServer, SummitUniversityServer, ZBInstituteOfTechnologyServer, RothmanUniversityServer, TheBlackHandServer];
    var NetworkGroup6 =     [LexoCorpServer, RhoConstructionServer, AlphaEnterprisesServer, AevumPoliceServer, MilleniumFitnessGymServer];
    var NetworkGroup7 =     [GlobalPharmaceuticalsServer, AeroCorpServer, GalacticCyberSystemsServer, SnapFitnessGymServer];
    var NetworkGroup8 =     [DeltaOneServer, UnitaLifeGroupServer, OmniaCybersystemsServer];
    var NetworkGroup9 =     [ZeusMedicalServer, SolarisSpaceSystemsServer, UniversalEnergyServer, IcarusMicrosystemsServer, DefCommServer];
    var NetworkGroup10 =    [NovaMedicalServer, ZBDefenseServer, TaiYangDigitalServer, InfoCommServer];
    var NetworkGroup11 =    [AppliedEnergeticsServer, MicrodyneTechnologiesServer, TitanLabsServer, BitRunnersServer];
    var NetworkGroup12 =    [VitaLifeServer, HeliosLabsServer, StormTechnologiesServer, FulcrumTechnologiesServer];
    var NetworkGroup13 =    [KuaiGongInternationalServer, FourSigmaServer, OmniTekIncorporatedServer, DarkArmyServer];
    var NetworkGroup14 =    [PowerhouseGymServer, ClarkeIncorporatedServer, NWOServer, BladeIndustriesServer, BachmanAndAssociatesServer];
    var NetworkGroup15 =    [FulcrumSecretTechnologiesServer, MegaCorpServer, ECorpServer, DaedalusServer];

    for (var i = 0; i < NetworkGroup2.length; i++) {
        var randomServerFromPrevGroup = NetworkGroup1[Math.floor(Math.random() * NetworkGroup1.length)];
        NetworkGroup2[i].serversOnNetwork.push(randomServerFromPrevGroup.ip);
        randomServerFromPrevGroup.serversOnNetwork.push(NetworkGroup2[i].ip);
    }

    for (var i = 0; i < NetworkGroup3.length; i++) {
        var randomServerFromPrevGroup = NetworkGroup2[Math.floor(Math.random() * NetworkGroup2.length)];
        NetworkGroup3[i].serversOnNetwork.push(randomServerFromPrevGroup.ip);
        randomServerFromPrevGroup.serversOnNetwork.push(NetworkGroup3[i].ip);
    }

    for (var i = 0; i < NetworkGroup4.length; i++) {
        var randomServerFromPrevGroup = NetworkGroup3[Math.floor(Math.random() * NetworkGroup3.length)];
        NetworkGroup4[i].serversOnNetwork.push(randomServerFromPrevGroup.ip);
        randomServerFromPrevGroup.serversOnNetwork.push(NetworkGroup4[i].ip);
    }

    for (var i = 0; i < NetworkGroup5.length; i++) {
        var randomServerFromPrevGroup = NetworkGroup4[Math.floor(Math.random() * NetworkGroup4.length)];
        NetworkGroup5[i].serversOnNetwork.push(randomServerFromPrevGroup.ip);
        randomServerFromPrevGroup.serversOnNetwork.push(NetworkGroup5[i].ip);
    }

    for (var i = 0; i < NetworkGroup6.length; i++) {
        var randomServerFromPrevGroup = NetworkGroup5[Math.floor(Math.random() * NetworkGroup5.length)];
        NetworkGroup6[i].serversOnNetwork.push(randomServerFromPrevGroup.ip);
        randomServerFromPrevGroup.serversOnNetwork.push(NetworkGroup6[i].ip);
    }

    for (var i = 0; i < NetworkGroup7.length; i++) {
        var randomServerFromPrevGroup = NetworkGroup6[Math.floor(Math.random() * NetworkGroup6.length)];
        NetworkGroup7[i].serversOnNetwork.push(randomServerFromPrevGroup.ip);
        randomServerFromPrevGroup.serversOnNetwork.push(NetworkGroup7[i].ip);
    }

    for (var i = 0; i < NetworkGroup8.length; i++) {
        var randomServerFromPrevGroup = NetworkGroup7[Math.floor(Math.random() * NetworkGroup7.length)];
        NetworkGroup8[i].serversOnNetwork.push(randomServerFromPrevGroup.ip);
        randomServerFromPrevGroup.serversOnNetwork.push(NetworkGroup8[i].ip);
    }

    for (var i = 0; i < NetworkGroup9.length; i++) {
        var randomServerFromPrevGroup = NetworkGroup8[Math.floor(Math.random() * NetworkGroup8.length)];
        NetworkGroup9[i].serversOnNetwork.push(randomServerFromPrevGroup.ip);
        randomServerFromPrevGroup.serversOnNetwork.push(NetworkGroup9[i].ip);
    }

    for (var i = 0; i < NetworkGroup10.length; i++) {
        var randomServerFromPrevGroup = NetworkGroup9[Math.floor(Math.random() * NetworkGroup9.length)];
        NetworkGroup10[i].serversOnNetwork.push(randomServerFromPrevGroup.ip);
        randomServerFromPrevGroup.serversOnNetwork.push(NetworkGroup10[i].ip);
    }

    for (var i = 0; i < NetworkGroup11.length; i++) {
        var randomServerFromPrevGroup = NetworkGroup10[Math.floor(Math.random() * NetworkGroup10.length)];
        NetworkGroup11[i].serversOnNetwork.push(randomServerFromPrevGroup.ip);
        randomServerFromPrevGroup.serversOnNetwork.push(NetworkGroup11[i].ip);
    }

    for (var i = 0; i < NetworkGroup12.length; i++) {
        var randomServerFromPrevGroup = NetworkGroup11[Math.floor(Math.random() * NetworkGroup11.length)];
        NetworkGroup12[i].serversOnNetwork.push(randomServerFromPrevGroup.ip);
        randomServerFromPrevGroup.serversOnNetwork.push(NetworkGroup12[i].ip);
    }

    for (var i = 0; i < NetworkGroup13.length; i++) {
        var randomServerFromPrevGroup = NetworkGroup12[Math.floor(Math.random() * NetworkGroup12.length)];
        NetworkGroup13[i].serversOnNetwork.push(randomServerFromPrevGroup.ip);
        randomServerFromPrevGroup.serversOnNetwork.push(NetworkGroup13[i].ip);
    }

    for (var i = 0; i < NetworkGroup14.length; i++) {
        var randomServerFromPrevGroup = NetworkGroup13[Math.floor(Math.random() * NetworkGroup13.length)];
        NetworkGroup14[i].serversOnNetwork.push(randomServerFromPrevGroup.ip);
        randomServerFromPrevGroup.serversOnNetwork.push(NetworkGroup14[i].ip);
    }

    for (var i = 0; i < NetworkGroup15.length; i++) {
        var randomServerFromPrevGroup = NetworkGroup14[Math.floor(Math.random() * NetworkGroup14.length)];
        NetworkGroup15[i].serversOnNetwork.push(randomServerFromPrevGroup.ip);
        randomServerFromPrevGroup.serversOnNetwork.push(NetworkGroup15[i].ip);
    }

    //Connect the first tier of servers to the player's home computer
    for (var i = 0; i < NetworkGroup1.length; i++) {
        Player.getHomeComputer().serversOnNetwork.push(NetworkGroup1[i].ip);
        NetworkGroup1[i].serversOnNetwork.push(Player.homeComputer);
    }
}

//Applied server growth for a single server. Returns the percentage growth
processSingleServerGrowth = function(server, numCycles) {
    //Server growth processed once every 450 game cycles
	var numServerGrowthCycles = Math.max(Math.floor(numCycles / 450), 0);

    //Get adjusted growth rate, which accounts for server security
    var growthRate = CONSTANTS.ServerBaseGrowthRate;
    var adjGrowthRate = 1 + (growthRate - 1) / server.hackDifficulty;
    if (adjGrowthRate > CONSTANTS.ServerMaxGrowthRate) {adjGrowthRate = CONSTANTS.ServerMaxGrowthRate;}
    //console.log("Adjusted growth rate: " + adjGrowthRate);

    //Calculate adjusted server growth rate based on parameters
    var serverGrowthPercentage = server.serverGrowth / 100;
    var numServerGrowthCyclesAdjusted = numServerGrowthCycles * serverGrowthPercentage;

    //Apply serverGrowth for the calculated number of growth cycles
    var serverGrowth = Math.pow(adjGrowthRate, numServerGrowthCyclesAdjusted * Player.hacking_grow_mult);
    if (serverGrowth < 1) {
        console.log("WARN: serverGrowth calculated to be less than 1");
        serverGrowth = 1;
    }

    server.moneyAvailable *= serverGrowth;
    if (server.moneyMax && isNaN(server.moneyAvailable)) {
        server.moneyAvailable = server.moneyMax;
    }
    if (server.moneyMax && server.moneyAvailable > server.moneyMax) {
        server.moneyAvailable = server.moneyMax;
        return 1;
    }
    server.fortify(2 * CONSTANTS.ServerFortifyAmount * numServerGrowthCycles);
    return serverGrowth;
}

//List of all servers that exist in the game, indexed by their ip
AllServers = {};

SizeOfAllServers = function() {
	var size = 0, key;
	for (key in AllServers) {
		if (AllServers.hasOwnProperty(key)) size++;
	}
	return size;
}

//Add a server onto the map of all servers in the game
AddToAllServers = function(server) {
    var serverIp = server.ip;
    if (ipExists(serverIp)) {
        console.log("IP of server that's being added: " + serverIp);
        console.log("Hostname of the server thats being added: " + server.hostname);
        console.log("The server that already has this IP is: " + AllServers[serverIp].hostname);
        throw new Error("Error: Trying to add a server with an existing IP");
        return;
    }
    AllServers[serverIp] = server;
}

//Returns server object with corresponding hostname
//	Relatively slow, would rather not use this a lot
GetServerByHostname = function(hostname) {
	for (var ip in AllServers) {
		if (AllServers.hasOwnProperty(ip)) {
			if (AllServers[ip].hostname == hostname) {
				return AllServers[ip];
			}
		}
	}
	return null;
}

//Get server by IP or hostname. Returns null if invalid
getServer = function(s) {
    if (!isValidIPAddress(s)) {
        return GetServerByHostname(s);
    } else {
        return AllServers[s];
    }
}

//Debugging tool
PrintAllServers = function() {
    for (var ip in AllServers) {
        if (AllServers.hasOwnProperty(ip)) {
            console.log("Ip: " + ip + ", hostname: " + AllServers[ip].hostname);
        }
    }
}
