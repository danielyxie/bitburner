//Netburner Player class

var Player = {
	//Skills and stats
	hacking_skill: 	1,
	strength: 		1,
	defense:		1,
	dexterity: 		1,
	agility: 		1, 
	hacking_chance_multiplier:	2,	//Increase through ascensions/augmentations
	//hacking_speed_multiplier: 	5,	//Decrease through ascensions/augmentations
    hacking_speed_multiplier:   1,  //Make it faster for debugging
	hacking_money_multiplier: 	.01,	//Increase through ascensions/augmentations. Can't go above 1
	
	//Note: "Lifetime" refers to current ascension, "total" refers to the entire game history
	//Accumulative  stats and skills
	total_hacking: 		1,
	total_strength: 	1,
	total_defense: 		1,
	total_dexterity: 	1,
	total_agility: 		1,
	lifetime_hacking: 	1,
	lifetime_strength: 	1,
	lifetime_defense: 	1,
	lifetime_dexterity: 1,
	lifetime_agility: 	1,
	
	//Experience and multipliers
	hacking_exp: 	0,
	strength_exp:	0,
	defense_exp: 	0,
	dexterity_exp: 	0,
	agility_exp: 	0,
	
	hacking_exp_mult: 	1,
	strength_exp_mult: 	1,
	defense_exp_mult: 	1,
	dexterity_exp_mult: 1,
	agility_exp_mult: 	1,
	
	//Money
	money: 			0,
	total_money:	0,
	lifetime_money:	0,
	
	//Starting (home) computer
	homeComputer: 	new Server(),
	
	//Servers
	currentServer: 		null,	//Server currently being accessed through terminal
	discoveredServers:	[],
	purchasedServers:	[],
	
	//Achievements and achievement progress
	
	
	//Flag to let the engine know the player is starting a hack
	startHack: false,
	hackingTime: 0,
	
	
	init: function() {
		/* Initialize properties of Player's home computer */
		Player.homeComputer.init("19.42.93.219", "home", "Home PC", true, true, true, true, 1);
		Player.currentServer = Player.homeComputer;
		
		//FOR TESTING ONLY
		Player.homeComputer.programs.push("PortHack.exe");
        
        var NetworkGroup1 = [ForeignServers.IronGym, ForeignServers.FoodNStuff, ForeignServers.SigmaCosmetics, ForeignServers.JoesGuns, ForeignServers.HongFangTeaHouse, ForeignServers.HaraKiriSushiBar];
        for (var i = 0; i < NetworkGroup1.length; i++) {
            Player.homeComputer.serversOnNetwork.push(NetworkGroup1[i]);
			NetworkGroup1[i].serversOnNetwork.push(Player.homeComputer);
        }
	},
	
	//Calculates hacking skill based on experience
	//	At the maximum possible exp (MAX_INT = 9007199254740991), the hacking skill will by 1796
	// 	Gets to level 1000 hacking skill at ~1,100,000,000 exp
	calculateHackingSkill: function(exp) {
		return Math.max(Math.floor(50 * log(9007199254740991+ 2.270) - 40), 1);
	},
	
	//Calculates the chance of hacking a server
	//The formula is:
	//	(hacking_chance_multiplier * hacking_skill - requiredLevel)      100 - difficulty		
	//  -----------------------------------------------------------  *  -----------------
	//        (hacking_chance_multiplier * hacking_skill)                      100
	calculateHackingChance: function() {
		var difficultyMult = (100 - Player.currentServer.hackDifficulty) / 100;
		var skillMult = (Player.hacking_chance_multiplier * Player.hacking_skill);
		var skillChance = (skillMult - Player.currentServer.requiredHackingSkill) / skillMult;
		return (skillChance * difficultyMult);
	},
	
	//Calculate the time it takes to hack a server in seconds. Returns the time
	//The formula is:
	//	  (requiredLevel * difficulty)       	
	//  -------------------------------  *  hacking_speed_multiplier
	//        hacking_skill                           
	calculateHackingTime: function() {
		var difficultyMult = Player.currentServer.requiredHackingSkill * Player.currentServer.hackDifficulty;
		var skillFactor = difficultyMult / Player.hacking_skill;
		return skillFactor * Player.hacking_speed_multiplier;
	},
	
	//Calculates the PERCENTAGE of a server's money that the player will hack from the server if successful
	//The formula is:
	//	(hacking_skill - (requiredLevel-1))      100 - difficulty		
	//  --------------------------------------* -----------------------  *  hacking_money_multiplier
	//         hacking_skill                        100
	calculatePercentMoneyHacked: function() {
		var difficultyMult = (100 - Player.currentServer.hackDifficulty) / 100;
		var skillMult = (Player.hacking_skill - (Player.currentServer.requiredHackingSkill - 1)) / Player.hacking_skill;
		var percentMoneyHacked = difficultyMult * skillMult * Player.hacking_money_multiplier;
		console.log("Percent money hacked calculated to be: " + percentMoneyHacked);
		return percentMoneyHacked;
	},
	
	//Returns how much EXP the player gains on a successful hack
	//The formula is:
	//	difficulty * requiredLevel * hacking_multiplier
	//
	// Note: Keep it at an integer for now,
	calculateExpGain: function() {
		return Math.round(Player.currentServer.hackDifficulty * Player.currentServer.requiredHackingSkill * Player.hacking_exp_mult);
	},
	
	//Hack a server. Return the amount of time the hack will take. This lets the Terminal object know how long to disable itself for
	//This assumes that the server being hacked is not purchased by the player, that the player's hacking skill is greater than the
	//required hacking skill and that the player has admin rights.
	hack: function() {
		Player.hackingTime = Player.calculateHackingTime();
		console.log("Hacking time: " + Player.hackingTime);
		//Set the startHack flag so the engine starts the hacking process
		Player.startHack = true;
		
		return Player.hackingTime;
	}
};