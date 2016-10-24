//Netburner Player class

var Player = {
	//Skills and stats
	hacking_skill: 	1,
	strength: 		1,
	defense:		1,
	dexterity: 		1,
	agility: 		1, 
	hacking_chance_multiplier:	2,	//Increase through ascensions/augmentations
	hacking_speed_multiplier: 	5,	//Decrease through ascensions/augmentations
	
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
	finishHack : false,
	hackingTime: 0,
	
	
	init: function() {
		/* Initialize properties of Player's home computer */
		Player.homeComputer.init("19.42.93.219", "home", "Home PC", true, true, true, true, 1);
		Player.currentServer = Player.homeComputer;
        
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
	//    hacking_chance_multiplier * hacking_skill)                          100
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
		var difficultyMult = Player.currentServer.requiredHackingSkill * Player.currentServer.difficulty;
		console.log("difficultyMult: " + difficultyMult);
		var skillFactor = difficultyMult / Player.hacking_skill;
		console.log("skillFactor: " + skillFactor);
		console.log("Player.hacking_speed_multiplier: " + Player.hacking_speed_multiplier);
		return skillFactor * Player.hacking_speed_multiplier;
	},
	
	//Hack a server. Return the amount of money hacked.
	//This assumes that the server being hacked is not purchased by the palyer, that the player's hacking skill is greater than the
	//required hacking skill and that the player has admin rights.
	hack: function(hackingSkill) {
		Player.hackingTime = Player.calculateHackingTime();
		console.log("Hacking time: " + Player.hackingTime);
		//Set the startHack flag so the engine starts the hacking process
		Player.startHack = true;
		
		while (Player.finishHack == false) {
			//Waiting for hack to complete
		}
		Player.finishHack = false;
		
		//DEBUG
		return 5;
	}
	

};