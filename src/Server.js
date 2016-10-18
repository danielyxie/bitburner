//Netburner Server class
function Server() = {
	/* Properties */
	//Connection information
	this.ip: 	"0.0.0.0",
	this.hostname: "",
	this.organizationName: 	"",
	this.isOnline: 			true,	
	this.isConnectedTo: 	false,	//Whether the player is connected to this server
	
	//Access information
	this.hasAdminRights: 	false,	//Whether player has admin rights
	this.purchasedByPlayer: false,
	
	//RAM, CPU speed and Scripts
	this.maxRam:		1, //GB 
	this.ramUsed:	0,
	this.cpuSpeed:	1,	//MHz
	
	this.scripts = [],
	this.runningScripts = [], //Scripts currently being run
	this.programs = [],
	
	/* Hacking information (only valid for "foreign" aka non-purchased servers) */
	
	//Skill required to attempt a hack. Whether a hack is successful will be determined
	//by a separate formula 
	this.requiredHackingSkill	= 1, 	
	
	//Total money available on this server. How much of this you hack will be determined
	//by a formula related to hacking skill. The money available on a server will steadily increase
	//over time, and it will decrease when you hack it
	this.moneyAvailable 		 	= 500, 
	
	//Parameters used in formulas that dictate how moneyAvailable and requiredHackingSkill change. 
	this.hackDifficulty			= 1,	//Affects hack success rate and how the requiredHackingSkill increases over time
	this.serverGrowth			= 1,	//Affects how the moneyAvailable increases
	this.timesHacked 			= 0,
	
	//Manual hack state information (hacking done without script)
	this.isHacking: 	false,
	this.hackingProgress:	0,	
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
Server.prototype.setHackingParameters(requiredHackingSkill, moneyAvailable, hackDifficulty, serverGrowth) {
	this.requiredHackingSkill = requiredHackingSkill;
	this.moneyAvailable = moneyAvailable;
	this.hackDifficulty = hackDifficulty;
	this.serverGrowth = serverGrowth;
}

createRandomIp : function() = {
	//TODO
}

//Create all "foreign" servers that exist in the game. This does not include
//servers that the player can purchase or the player's starting computer
ForeignServers = {
	//Megacorporations
	ECorp: 						new Server();

	//Technology and communication companies
	FulcrumTechnologies: 		new Server();
	StormTechnologies: 			new Server();
	DedComm: 					new Server();

	//Gyms
	CrushFitnessGym: 			new Server();
	IronGym:					new Server();
	MilleniumFitnessGym:		new Server();
	PowerhouseGym:				new Server();
	SnapFitnessGym:				new Server();
	
}
