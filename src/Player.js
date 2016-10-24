//Netburner Player class

var Player = {
	//Skills and stats
	hacking_skill: 	1,
	strength: 		1,
	defense:		1,
	dexterity: 		1,
	agility: 		1, 
	
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
	
	
	init: function() {
		Player.homeComputer.init("19.42.93.219", "home", "Home PC", true, true, true, true, 1);
		Player.currentServer = Player.homeComputer;
        
        var NetworkGroup1 = [ForeignServers.IronGym, ForeignServers.FoodNStuff, ForeignServers.SigmaCosmetics, ForeignServers.JoesGuns, ForeignServers.HongFangTeaHouse, ForeignServers.HaraKiriSushiBar];
        for (var i = 0; i < NetworkGroup1.length; i++) {
            Player.homeComputer.serversOnNetwork.push(NetworkGroup1[i]);
        }
	},
	
	//Calculates hacking skill based on experience
	//	At the maximum possible exp (MAX_INT = 9007199254740991), the hacking skill will by 1796
	// 	Gets to level 1000 hacking skill at ~1,100,000,000 exp
	calculateHackingSkill: function(exp) {
		return Math.max(Math.floor(50 * log(9007199254740991+ 2.270) - 40), 1);
	}
};