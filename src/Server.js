//Netburner Server class
//	Parent class for a Server object. PlayerServer and NPCServer inherit from this
netburner.Server = {
	//Connection information
	ip: 	"0.0.0.0",
	isOnline: 	false,
	
	ownedByPlayer: false,
	
	//Properties
	max_ram:		1, //GB 
	ram_used:		0,
	
	scripts = [];
	
	//Manual hack state information
	is_hacking: 	false,
	hacking_progress:	0,	
};