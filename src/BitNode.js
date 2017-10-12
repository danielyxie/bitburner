import {Player}                             from "./Player.js";

function BitNode(n, name, desc="", info="") {
    this.number = n;
    this.name = name;
    this.desc = desc;
    this.info = info;
}

let BitNodes = {};
function initBitNodes() {
    BitNodes = {};
    BitNodes["BitNode1"] = new BitNode(1, "Source Genesis", "The original BitNode",
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
                            "Level 3: 28%");
    BitNodes["BitNode2"] = new BitNode(2, "Rise of the Underworld", "From the shadows, they rose",    //Gangs
                            "From the shadows, they rose.<br><br>Organized crime groups quickly filled the void of power " +
                            "left behind from the collapse of Western government in the 2050's. As society and civlization broke down, " +
                            "people quickly succumbed to the innate human impulse of evil and savagery. The organized crime " +
                            "factions quickly rose to the top of the modern world.<br><br>" +
                            "In this BitNode:<br><br>The maximum amount of money available on a server is significantly decreased<br>" +
                            "The amount of money gained from crimes and Infiltration is doubled<br>" +
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
                            "Level 3: 35%");
    BitNodes["BitNode3"] = new BitNode(3, "The Price of Civilization", "COMING SOON"); //Corporate Warfare, Run own company
    BitNodes["BitNode4"] = new BitNode(4, "The Singularity", "The Man and the Machine",  "The Singularity has arrived. The human race is gone, replaced " +
                                          "by artificially superintelligent beings that are more machine than man. <br><br>" +
                                          "In this BitNode, progressing is significantly harder. Experience gain rates " +
                                          "for all stats are reduced. Most methods of earning money will now give significantly less.<br><br>" +
                                          "In this BitNode you will gain access to a new set of Netscript Functions known as Singularity Functions. " +
                                          "These functions allow you to control most aspects of the game through scripts, including working for factions/companies, " +
                                          "purchasing/installing Augmentations, and creating programs.<br><br>" +
                                          "Destroying this BitNode will give you Source-File 4, or if you already have this Source-File it will " +
                                          "upgrade its level up to a maximum of 3. This Source-File lets you access and use the Singularity  " +
                                          "Functions in other BitNodes. Each level of this Source-File will open up more Singularity Functions " +
                                          "that you can use.");
    BitNodes["BitNode5"] = new BitNode(5, "Artificial Intelligence", "Posthuman", "They said it couldn't be done. They said the human brain, " +
                                          "along with its consciousness and intelligence, couldn't be replicated. They said the complexity " +
                                          "of the brain results from unpredictable, nonlinear interactions that couldn't be modeled " +
                                          "by 1's and 0's. They were wrong.<br><br>" +
                                          "In this BitNode:<br><br>" +
                                          "The base security level of servers is doubled<br>" +
                                          "The starting money on servers is halved, but the maximum money is doubled<br>" +
                                          "Most methods of earning money now give significantly less<br>" +
                                          "Augmentations are more expensive<br>" +
                                          "Hacking experience gain rates are reduced<br><br>" +
                                          "Destroying this BitNode will give you Source-File 5, or if you already have this Source-File it will " +
                                          "upgrade its level up to a maximum of 3. This Source-File grants you a special new stat called Intelligence. " +
                                          "Intelligence is unique because it is permanent and persistent (it never gets reset back to 1). However " +
                                          "gaining Intelligence experience is much slower than other stats, and it is also hidden (you won't know " +
                                          "when you gain experience and how much). Higher Intelligence levels will boost your production for many actions " +
                                          "in the game. <br><br>" +
                                          "In addition, this Source-File will unlock the getBitNodeMultipliers() Netscript function, " +
                                          "and will also raise all of your hacking-related multipliers by:<br><br>" +
                                          "Level 1: 4%<br>" +
                                          "Level 2: 6%<br>" +
                                          "Level 3: 7%");
    BitNodes["BitNode6"] = new BitNode(6, "Hacktocracy", "COMING SOON");               //Healthy Hacknet balancing mechanic
    BitNodes["BitNode7"] = new BitNode(7, "Do Androids Dream?", "COMING SOON");        //Build androids for automation
    BitNodes["BitNode8"] = new BitNode(8, "Ghost of Wall Street", "COMING SOON");      //Trading only viable strategy
    BitNodes["BitNode9"] = new BitNode(9, "MegaCorp", "COMING SOON");                  //Single corp/server with increasing difficulty
    BitNodes["BitNode10"] = new BitNode(10, "Wasteland", "COMING SOON");               //Postapocalyptic
    BitNodes["BitNode11"] = new BitNode(11, "The Big Crash", "Okay. Sell it all.",
                                            "The 2050s was defined by the massive amounts of violent civil unrest and anarchic rebellion that rose all around the world. It was this period " +
                                            "of disorder that eventually lead to the governmental reformation of many global superpowers, most notably " +
                                            "the USA and China. But just as the world was slowly beginning to recover from these dark times, financial catastrophe hit.<br><br>" +
                                            "In many countries, the high cost of trying to deal with the civil disorder bankrupted the governments. In all of this chaos and confusion, hackers " +
                                            "were able to steal billions of dollars from the world's largest electronic banks, prompting an international banking crisis as " +
                                            "governments were unable to bail out insolvent banks. Now, the world is slowly crumbling in the middle of the biggest economic crisis of all time.<br><br>" +
                                            "In this BitNode:<br><br>" +
                                            "The starting and maximum amount of money available on servers is significantly decreased<br>" +
                                            "The growth rate of servers is halved<br>" +
                                            "Weakening a server is twice as effective<br>" +
                                            "Company wages are decreased by 50%<br>" +
                                            "Hacknet Node production is significantly decreased<br>" +
                                            "Crime and Infiltration are more lucrative<br>" +
                                            "Augmentations are twice as expensive<br><br>" +
                                            "Destroying this BitNode will give you Source-File 11, or if you already have this Source-File it will " +
                                            "upgrade its level up to a maximum of 3. This Source-File makes it so that company favor increases BOTH " +
                                            "the player's salary and reputation gain rate at that company by 1% per favor (rather than just the reputation gain). " +
                                            "This Source-File also increases the player's company salary and reputation gain multipliers by:<br><br>" +
                                            "Level 1: 24%<br>" +
                                            "Level 2: 36%<br>" +
                                            "Level 3: 42%");

    //Books: Frontera, Shiner
    BitNodes["BitNode12"] = new BitNode(12, "Eye of the World", "COMING SOON");         //Become AI
    BitNodes["BitNode13"] = new BitNode(13, "", "COMING SOON");
    BitNodes["BitNode14"] = new BitNode(14, "", "COMING SOON");
    BitNodes["BitNode15"] = new BitNode(15, "", "COMING SOON");
    BitNodes["BitNode16"] = new BitNode(16, "fOS", "COMING SOON");  //Unlocks the new game mode and the rest of the BitNodes
    BitNodes["BitNode17"] = new BitNode(17, "", "COMING SOON");
    BitNodes["BitNode18"] = new BitNode(18, "", "COMING SOON");
    BitNodes["BitNode19"] = new BitNode(19, "", "COMING SOON");
    BitNodes["BitNode20"] = new BitNode(20, "", "COMING SOON");
    BitNodes["BitNode21"] = new BitNode(21, "", "COMING SOON");
    BitNodes["BitNode22"] = new BitNode(22, "", "COMING SOON");
    BitNodes["BitNode23"] = new BitNode(23, "", "COMING SOON");
    BitNodes["BitNode24"] = new BitNode(24, "", "COMING SOON");
    BitNodes["BitNode25"] = new BitNode(25, "", "COMING SOON");
    BitNodes["BitNode26"] = new BitNode(26, "", "COMING SOON");
    BitNodes["BitNode27"] = new BitNode(27, "", "COMING SOON");
    BitNodes["BitNode28"] = new BitNode(28, "", "COMING SOON");
    BitNodes["BitNode29"] = new BitNode(29, "", "COMING SOON");
    BitNodes["BitNode30"] = new BitNode(30, "", "COMING SOON");
    BitNodes["BitNode31"] = new BitNode(31, "", "COMING SOON");
    BitNodes["BitNode32"] = new BitNode(32, "", "COMING SOON");
}

let BitNodeMultipliers = {
    ServerMaxMoney:         1,
    ServerStartingMoney:    1,
    ServerGrowthRate:       1,
    ServerWeakenRate:       1,
    ServerStartingSecurity: 1,

    ManualHackMoney:        1,
    ScriptHackMoney:        1,
    CompanyWorkMoney:       1,
    CrimeMoney:             1,
    HacknetNodeMoney:       1,

    CompanyWorkExpGain:     1,
    ClassGymExpGain:        1,
    FactionWorkExpGain:     1,
    HackExpGain:            1,
    CrimeExpGain:           1,

    FactionWorkRepGain:     1,
    FactionPassiveRepGain:  1,

    AugmentationRepCost:    1,
    AugmentationMoneyCost:  1,

    InfiltrationMoney:      1,
    InfiltrationRep:        1,
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
        case 1: //Source Genesis (every multiplier is 1)
            break;
        case 2: //Rise of the Underworld
            BitNodeMultipliers.ServerMaxMoney           = 0.2;
            BitNodeMultipliers.CrimeMoney               = 2;
            BitNodeMultipliers.InfiltrationMoney        = 2;
            BitNodeMultipliers.FactionWorkRepGain       = 0.5;
            BitNodeMultipliers.FactionPassiveRepGain    = 0;
            break;
        case 4: //The Singularity
            BitNodeMultipliers.ServerMaxMoney           = 0.15;
            BitNodeMultipliers.ScriptHackMoney          = 0.2;
            BitNodeMultipliers.CompanyWorkMoney         = 0.1;
            BitNodeMultipliers.CrimeMoney               = 0.2;
            BitNodeMultipliers.HacknetNodeMoney         = 0.05;
            BitNodeMultipliers.CompanyWorkExpGain       = 0.5;
            BitNodeMultipliers.ClassGymExpGain          = 0.5;
            BitNodeMultipliers.FactionWorkExpGain       = 0.5;
            BitNodeMultipliers.HackExpGain              = 0.4;
            BitNodeMultipliers.CrimeExpGain             = 0.5;
            BitNodeMultipliers.FactionWorkRepGain       = 0.75;
            break;
        case 5: //Artificial intelligence
            BitNodeMultipliers.ServerMaxMoney           = 2;
            BitNodeMultipliers.ServerStartingSecurity   = 2;
            BitNodeMultipliers.ServerStartingMoney      = 0.5;
            BitNodeMultipliers.ScriptHackMoney          = 0.25;
            BitNodeMultipliers.HacknetNodeMoney         = 0.2;
            BitNodeMultipliers.CrimeMoney               = 0.5;
            BitNodeMultipliers.AugmentationMoneyCost    = 2;
            BitNodeMultipliers.HackExpGain              = 0.5;
            break;
        case 11: //The Big Crash
            BitNodeMultipliers.ServerMaxMoney           = 0.1;
            BitNodeMultipliers.ServerStartingMoney      = 0.1;
            BitNodeMultipliers.ServerGrowthRate         = 0.5;
            BitNodeMultipliers.ServerWeakenRate         = 2;
            BitNodeMultipliers.CrimeMoney               = 3;
            BitNodeMultipliers.CompanyWorkMoney         = 0.5;
            BitNodeMultipliers.HacknetNodeMoney         = 0.1;
            BitNodeMultipliers.AugmentationMoneyCost    = 2;
            BitNodeMultipliers.InfiltrationMoney        = 2.5;
            BitNodeMultipliers.InfiltrationRep          = 2.5;
            break;
        default:
            console.log("WARNING: Player.bitNodeN invalid");
            break;
    }
}

export {initBitNodes, BitNode, BitNodes, BitNodeMultipliers, initBitNodeMultipliers};
