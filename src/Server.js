//Netburner Server class
function Server() = {
	/* Properties */
	//Connection information
	this.ip: 	"0.0.0.0",
	this.hostname: "",
	this.isOnline: 			true,	
	this.isConnectedTo: 	false,	//Whether the player is connected to this server
	
	//Access information
	this.hasAdminRights: 	false,	//Whether player has admin rights
	this.purchasedByPlayer: false,
	
	//RAM and Scripts
	maxRam:		1, //GB 
	ramUsed:	0,
	
	scripts = [],
	runningScripts = [], //Scripts currently being run
	programs = [],
	
	/* Hacking information (only valid for "foreign" aka non-purchased servers) */
	
	//Skill required to attempt a hack. Whether a hack is successful will be determined
	//by a separate formula 
	requiredHackingSkill = 1, 	
	
	//Total money available on this server. How much of this you hack will be determined
	//by a formula related to hacking skill. The money available on a server will steadily increase
	//over time, and it will decrease when you hack it
	moneyAvailable 		 = 500, 
	
	
	//Manual hack state information (hacking done without script)
	isHacking: 	false,
	hackingProgress:	0,	
};

//Initialize the properties of a server
Server.prototype.init = function(ip, hostname, onlineStatus, isConnectedTo, adminRights, purchasedByPlayer, maxRam) {
	this.ip = ip;
	this.hostname = hostname;
	this.isOnline = onlineStatus;
	this.isConnectedTo = isConnectedTo;
	this.hasAdminRights = adminRights;
	this.purchasedByPlayer = purchasedByPlayer;
	this.maxRam = maxRam;
}

//Create all "foreign" servers that exist in the game. This does not include
//servers that the player can purchase or the player's starting computer
function initAllServers() {
	
}