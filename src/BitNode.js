/* BitNode.js */

BitNodes = {
    BitNode1:   new BitNode(1, "Source Genesis", "The original BitNode",
                            "The first BitNode created by the Enders to imprison the minds of humans. It became " +
                            "the prototype and testing-grounds for all of the BitNodes that followed.<br><br>" +
                            "This is the first BitNode that you play through. It has no special " +
                            "modifications or mechanics.<br><br>" +
                            "Destroying this BitNode will give you Source-File 1, or if you already have " +
                            "this Source-File it will upgrade its level up to a maximum of 3. This Source-File " +
                            "lets the player start with 32GB of RAM on his/her home computer when entering a " +
                            "new BitNode, and also increases all of the player's multipliers by:<br><br>" +
                            "Level 1: 16%<br>" +
                            "Level 2: 24%<br>" +
                            "Level 3: 28%"),
    BitNode2:   new BitNode(2, "Rise of the Underworld", "From the shadows, they rose",    //Gangs
                            "From the shadows, they rose.<br><br>Organized crime groups quickly filled the void of power " +
                            "left behind from the collapse of Western government in the 2050's. As society and civlization broke down, " +
                            "people quickly succumbed to the innate human impulse of evil and savagery. The organized crime " +
                            "factions quickly rose to the top of the modern world.<br><br>" +
                            "In this BitNode:<br><br>The maximum amount of money available on a server is significantly decreased<br>" +
                            "The amount of money gained from crimes is doubled<br>" +
                            "Certain Factions (Slum Snakes, Tetrads, The Syndicate, The Dark Army, Speakers for the Dead, " +
                            "NiteSec, The Black Hand) give the player the ability to form and manage their own gangs. These gangs " +
                            "will earn the player money and reputation with the corresponding Faction<br>" +
                            "Every Augmentation in the game will be available through the Factions listed above<br>" +
                            "For every Faction NOT listed above, reputation gains are halved<br>" +
                            "You will no longer gain passive reputation with Factions<br><br>" +
                            "Destroying this BitNode will give you Source-File 2, or if you already have this Source-File it will " +
                            "upgrade its level up to a maximum of 3. This Source-File increases the player's crime success rate, " +
                            "crime money, and charisma multipliers by:<br><br>" +
                            "Level 1: 20%<br>" +
                            "Level 2: 30%<br>" +
                            "Level 3: 35%"),
    BitNode3:   new BitNode(3, "The Price of Civilization", "COMING SOON"), //Corporate Warfare, Run own company
    BitNode4:   new BitNode(4, "The Singularity", "COMING SOON"),           //Everything automatable
    BitNode5:   new BitNode(5, "Artificial Intelligence", "COMING SOON"),   //Big Brother
    BitNode6:   new BitNode(6, "Hacktocracy", "COMING SOON"),               //Healthy Hacknet balancing mechanic
    BitNode7:   new BitNode(7, "Do Androids Dream?", "COMING SOON"),        //Build androids for automation
    BitNode8:   new BitNode(8, "Ghost of Wall Street", "COMING SOON"),      //Trading only viable strategy
    BitNode9:   new BitNode(9, "MegaCorp", "COMING SOON"),                  //Single corp/server with increasing difficulty
    BitNode10:  new BitNode(10, "Wasteland", "COMING SOON"),                //Postapocalyptic
    BitNode11:  new BitNode(11, "The Big Crash", "COMING SOON"),            //Crashing economy
    /* Okay. Sell it all.
        "The 2050s was defined by the massive amounts of violent civil unrest and anarchic rebellion that rose all around the world. It was this period " +
        "of disorder that eventually lead to the governmental reformation of many global superpowers, most notably " +
        "the USA and China. But just as the world was slowly beginning to recover from these dark times, financial catastrophe hit.<br><br>" +
        "In many countries, the high cost of trying to deal with the civil disorder bankrupted the governments. In all of this chaos and confusion hackers " +
        "were able to steal billions of dollars from the world's largest electronic banks, prompting an international banking crisis as " +
        "governments were unable to bail out insolvent banks. Now, the world is slowly crumbling in the middle of the biggest economic crisis of all time.<br><br>" +
        "In this BitNode:<br><br>" +
        "The starting and maximum amount of money available on servers is significantly decreased<br>" +
        "The growth rate of servers is halved<br>" +
        "Weakening a server is twice as effective<br>" +
        "Company wages are decreased by 25%<br>" +
        "Hacknet Node production is significantly decreased<br>" +
        "Augmentations are twice as expensive<br><br>" +
        "Destroying this BitNode will give you Source-File 11, or if you already have this Source-File it will " +
        "upgrade its level up to a maximum of 3. This Source-File increases the player's company salary multiplier by:<br><br>" +
        "Level 1: 60%<br>" +
        "Level 2: 90%<br>" +
        "Level 3: 105%";

    */
    BitNode12:  new BitNode(12, "Eye of the World", "COMING SOON"),         //Become AI
}

function BitNode(n, name, desc="", info="") {
    this.number = n;
    this.name = name;
    this.desc = desc;
    this.info = info;
}

BitNodeMultipliers = {
    ServerMaxMoney:         1,
    CrimeMoney:             1,
    FactionWorkRepGain:     1,
    FactionPassiveRepGain:  1,
}

function initBitNodeMultipliers() {
    if (Player.bitNodeN == null) {
        Player.bitNodeN = 1;
    }
    for (var mult in BitNodeMultipliers) {
        if (BitNodeMultipliers.hasOwnProperty(mult)) {
            BitNodeMultipliers[mult] = 1;
        }
    }

    switch (Player.bitNodeN) {
        case 1:
            break;
        case 2: //Rise of the Underworld
            BitNodeMultipliers.ServerMaxMoney = 0.2;
            BitNodeMultipliers.CrimeMoney = 2;
            BitNodeMultipliers.FactionWorkRepGain = 0.5;
            BitNodeMultipliers.FactionPassiveRepGain = 0;
            break;
        default:
            console.log("WARNING: Player.bitNodeN invalid");
            break;
    }
}
