import {BitNodeMultipliers} from "./BitNodeMultipliers";
import {Player}             from "./Player";

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
                            "left behind from the collapse of Western government in the 2050s. As society and civlization broke down, " +
                            "people quickly succumbed to the innate human impulse of evil and savagery. The organized crime " +
                            "factions quickly rose to the top of the modern world.<br><br>" +
                            "In this BitNode:<br><br>" +
                            "Your hacking level is reduced by 20%<br>"  +
                            "The growth rate and maximum amount of money available on servers are significantly decreased<br>" +
                            "The amount of money gained from crimes and Infiltration is tripled<br>" +
                            "Certain Factions (Slum Snakes, Tetrads, The Syndicate, The Dark Army, Speakers for the Dead, " +
                            "NiteSec, The Black Hand) give the player the ability to form and manage their own gangs. These gangs " +
                            "will earn the player money and reputation with the corresponding Faction<br>" +
                            "Every Augmentation in the game will be available through the Factions listed above<br>" +
                            "For every Faction NOT listed above, reputation gains are halved<br>" +
                            "You will no longer gain passive reputation with Factions<br><br>" +
                            "Destroying this BitNode will give you Source-File 2, or if you already have this Source-File it will " +
                            "upgrade its level up to a maximum of 3. This Source-File increases the player's crime success rate, " +
                            "crime money, and charisma multipliers by:<br><br>" +
                            "Level 1: 24%<br>" +
                            "Level 2: 36%<br>" +
                            "Level 3: 42%");
    BitNodes["BitNode3"] = new BitNode(3, "Corporatocracy", "The Price of Civilization",
                                          "Our greatest illusion is that a healthy society can revolve around a " +
                                          "single-minded pursuit of wealth.<br><br>" +
                                          "Sometime in the early 21st century economic and political globalization turned " +
                                          "the world into a corporatocracy, and it never looked back. Now, the privileged " +
                                          "elite will happily bankrupt their own countrymen, decimate their own community, " +
                                          "and evict their neighbors from houses in their desperate bid to increase their wealth.<br><br>" +
                                          "In this BitNode you can create and manage your own corporation. Running a successful corporation " +
                                          "has the potential of generating massive profits. All other forms of income are reduced by 75%. Furthermore: <br><br>" +
                                          "The price and reputation cost of all Augmentations is tripled<br>" +
                                          "The starting and maximum amount of money on servers is reduced by 75%<br>" +
                                          "Server growth rate is reduced by 80%<br>" +
                                          "You will start out with $150b so that you can start your corporation<br>" +
                                          "You now only need 75 favour with a faction in order to donate to it, rather than 150<br><br>" +
                                          "Destroying this BitNode will give you Source-File 3, or if you already have this Source-File it will " +
                                          "upgrade its level up to a maximum of 3. This Source-File lets you create corporations on other BitNodes (although " +
                                          "some BitNodes will disable this mechanic). This Source-File also increases your charisma and company salary multipliers by:<br>" +
                                          "Level 1: 8%<br>" +
                                          "Level 2: 12%<br>" +
                                          "Level 3: 14%");
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
                                          "The starting money on servers is halved, but the maximum money remains the same<br>" +
                                          "Most methods of earning money now give significantly less<br>" +
                                          "Infiltration gives 50% more reputation and money<br>" +
                                          "Corporations have 50% lower valuations and are therefore less profitable<br>" +
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
                                          "Level 1: 8%<br>" +
                                          "Level 2: 12%<br>" +
                                          "Level 3: 14%");
    BitNodes["BitNode6"] = new BitNode(6, "Bladeburners", "Like Tears in Rain",
                                          "In the middle of the 21st century, OmniTek Incorporated began designing and manufacturing advanced synthetic " +
                                          "androids, or Synthoids for short. They achieved a major technological breakthrough in the sixth generation " +
                                          "of their Synthoid design, called MK-VI, by developing a hyperintelligent AI. Many argue that this was " +
                                          "the first sentient AI ever created. This resulted in Synthoid models that were stronger, faster, and more intelligent " +
                                          "than the humans that had created them.<br><br>" +
                                          "In this BitNode you will be able to access the Bladeburner Division at the NSA, which provides a new mechanic " +
                                          "for progression. Furthermore:<br><br>" +
                                          "Hacking and Hacknet Nodes will be significantly less profitable<br>" +
                                          "Your hacking level is reduced by 50%<br>" +
                                          "Hacking experience gain from scripts is reduced by 75%<br>" +
                                          "Corporations have 80% lower valuations and are therefore less profitable<br>" +
                                          "Working for companies is 50% less profitable<br>" +
                                          "Crimes and Infiltration are 50% less profitable<br><br>" +
                                          "Destroying this BitNode will give you Source-File 6, or if you already have this Source-File it will upgrade " +
                                          "its level up to a maximum of 3. This Source-File allows you to access the NSA's Bladeburner Division in other " +
                                          "BitNodes. In addition, this Source-File will raise both the level and experience gain rate of all your combat stats by:<br><br>" +
                                          "Level 1: 8%<br>" +
                                          "Level 2: 12%<br>" +
                                          "Level 3: 14%");
    BitNodes["BitNode7"] = new BitNode(7, "Bladeburners 2079", "More human than humans",
                                          "In the middle of the 21st century, you were doing cutting-edge work at OmniTek Incorporated as part of the AI design team " +
                                          "for advanced synthetic androids, or Synthoids for short. You helped achieve a major technological " +
                                          "breakthrough in the sixth generation of the company's Synthoid design, called MK-VI, by developing a hyperintelligent AI. " +
                                          "Many argue that this was the first sentient AI ever created. This resulted in Synthoid models that were stronger, faster, " +
                                          "and more intelligent than the humans that had created them.<br><br>" +
                                          "In this BitNode you will be able to access the Bladeburner API, which allows you to access Bladeburner " +
                                          "functionality through Netscript. Furthermore: <br><br>" +
                                          "The rank you gain from Bladeburner contracts/operations is reduced by 40%<br>" +
                                          "Bladeburner skills cost twice as many skill points<br>" +
                                          "Augmentations are 3x more expensive<br>" +
                                          "Hacking and Hacknet Nodes will be significantly less profitable<br>" +
                                          "Your hacking level is reduced by 50%<br>" +
                                          "Hacking experience gain from scripts is reduced by 75%<br>" +
                                          "Corporations have 80% lower valuations and are therefore less profitable<br>" +
                                          "Working for companies is 50% less profitable<br>" +
                                          "Crimes and Infiltration are 50% less profitable<br><br>" +
                                          "Destroying this BitNode will give you Source-File 7, or if you already have this Source-File it will upgrade " +
                                          "its level up to a maximum of 3. This Source-File allows you to access the Bladeburner Netscript API in other " +
                                          "BitNodes. In addition, this Source-File will increase all of your Bladeburner multipliers by:<br><br>" +
                                          "Level 1: 8%<br>" +
                                          "Level 2: 12%<br>" +
                                          "Level 3: 14%");
    BitNodes["BitNode8"] = new BitNode(8, "Ghost of Wall Street", "Money never sleeps",
                                          "You are trying to make a name for yourself as an up-and-coming hedge fund manager on Wall Street.<br><br>" +
                                          "In this BitNode:<br><br>" +
                                          "You start with $250 million<br>" +
                                          "The only way to earn money is by trading on the stock market<br>" +
                                          "You start with a WSE membership and access to the TIX API<br>" +
                                          "You are able to short stocks and place different types of orders (limit/stop)<br>" +
                                          "You can immediately donate to factions to gain reputation<br><br>" +
                                          "Destroying this BitNode will give you Source-File 8, or if you already have this Source-File it will " +
                                          "upgrade its level up to a maximum of 3. This Source-File grants the following benefits:<br><br>" +
                                          "Level 1: Permanent access to WSE and TIX API<br>" +
                                          "Level 2: Ability to short stocks in other BitNodes<br>" +
                                          "Level 3: Ability to use limit/stop orders in other BitNodes<br><br>" +
                                          "This Source-File also increases your hacking growth multipliers by: " +
                                          "<br>Level 1: 12%<br>Level 2: 18%<br>Level 3: 21%");
    BitNodes["BitNode9"] = new BitNode(9, "Do Androids Dream?", "COMING SOON");
    BitNodes["BitNode10"] = new BitNode(10, "MegaCorp", "COMING SOON");                //Not sure yet
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
                                            "Corporation valuations are 99% lower and are therefore significantly less profitable<br>" +
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
    BitNodes["BitNode12"] = new BitNode(12, "The Recursion", "Repeat.",
                                            "To iterate is human, to recurse divine.<br><br>" +
                                            "Every time this BitNode is destroyed, it becomes slightly harder. Destroying this BitNode will give your Souce-File 12, or " +
                                            "if you already have this Source-File it will upgrade its level. There is no maximum level for Source-File 12. Each level " +
                                            "of Source-File 12 will increase all of your multipliers by 1%. This effect is multiplicative with itself. " +
                                            "In other words, level N of this Source-File will result in a multiplier of 1.01^N (or 0.99^N for multipliers that decrease)");
    //Books: Frontera, Shiner
    BitNodes["BitNode13"] = new BitNode(13, "fOS", "COMING SOON"); //Unlocks the new game mode and the rest of the BitNodes
    BitNodes["BitNode14"] = new BitNode(14, "", "COMING SOON");
    BitNodes["BitNode15"] = new BitNode(15, "", "COMING SOON");
    BitNodes["BitNode16"] = new BitNode(16, "", "COMING SOON");
    BitNodes["BitNode17"] = new BitNode(17, "", "COMING SOON");
    BitNodes["BitNode18"] = new BitNode(18, "", "COMING SOON");
    BitNodes["BitNode19"] = new BitNode(19, "", "COMING SOON");
    BitNodes["BitNode20"] = new BitNode(20, "", "COMING SOON");
    BitNodes["BitNode21"] = new BitNode(21, "", "COMING SOON");
    BitNodes["BitNode22"] = new BitNode(22, "", "COMING SOON");
    BitNodes["BitNode23"] = new BitNode(23, "", "COMING SOON");
    BitNodes["BitNode24"] = new BitNode(24, "", "COMING SOON");
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
            BitNodeMultipliers.HackingLevelMultiplier   = 0.8;
            BitNodeMultipliers.ServerGrowthRate         = 0.8;
            BitNodeMultipliers.ServerMaxMoney           = 0.2;
            BitNodeMultipliers.ServerStartingMoney      = 0.4;
            BitNodeMultipliers.CrimeMoney               = 3;
            BitNodeMultipliers.InfiltrationMoney        = 3;
            BitNodeMultipliers.FactionWorkRepGain       = 0.5;
            BitNodeMultipliers.FactionPassiveRepGain    = 0;
            break;
        case 3: //Corporatocracy
            BitNodeMultipliers.RepToDonateToFaction     = 0.5;
            BitNodeMultipliers.AugmentationRepCost      = 3;
            BitNodeMultipliers.AugmentationMoneyCost    = 3;
            BitNodeMultipliers.ServerMaxMoney           = 0.2;
            BitNodeMultipliers.ServerStartingMoney      = 0.2;
            BitNodeMultipliers.ServerGrowthRate         = 0.2;
            BitNodeMultipliers.ScriptHackMoney          = 0.2;
            BitNodeMultipliers.CompanyWorkMoney         = 0.25;
            BitNodeMultipliers.CrimeMoney               = 0.25;
            BitNodeMultipliers.HacknetNodeMoney         = 0.25;
            break;
        case 4: //The Singularity
            BitNodeMultipliers.ServerMaxMoney           = 0.15;
            BitNodeMultipliers.ServerStartingMoney      = 0.75;
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
            BitNodeMultipliers.ScriptHackMoney          = 0.15;
            BitNodeMultipliers.HacknetNodeMoney         = 0.2;
            BitNodeMultipliers.CrimeMoney               = 0.5;
            BitNodeMultipliers.InfiltrationRep          = 1.5;
            BitNodeMultipliers.InfiltrationMoney        = 1.5;
            BitNodeMultipliers.AugmentationMoneyCost    = 2;
            BitNodeMultipliers.HackExpGain              = 0.5;
            BitNodeMultipliers.CorporationValuation     = 0.5;
            break;
        case 6: //Bladeburner
            BitNodeMultipliers.HackingLevelMultiplier   = 0.4;
            BitNodeMultipliers.ServerMaxMoney           = 0.5;
            BitNodeMultipliers.ServerStartingMoney      = 0.5;
            BitNodeMultipliers.ServerStartingSecurity   = 1.5;
            BitNodeMultipliers.ScriptHackMoney          = 0.5;
            BitNodeMultipliers.CompanyWorkMoney         = 0.5;
            BitNodeMultipliers.CrimeMoney               = 0.5;
            BitNodeMultipliers.InfiltrationMoney        = 0.5;
            BitNodeMultipliers.CorporationValuation     = 0.2;
            BitNodeMultipliers.HacknetNodeMoney         = 0.2;
            BitNodeMultipliers.FactionPassiveRepGain    = 0;
            BitNodeMultipliers.HackExpGain              = 0.25;
            break;
        case 7: //Bladeburner 2079
            BitNodeMultipliers.BladeburnerRank          = 0.6;
            BitNodeMultipliers.BladeburnerSkillCost     = 2;
            BitNodeMultipliers.AugmentationMoneyCost    = 3;
            BitNodeMultipliers.HackingLevelMultiplier   = 0.4;
            BitNodeMultipliers.ServerMaxMoney           = 0.5;
            BitNodeMultipliers.ServerStartingMoney      = 0.5;
            BitNodeMultipliers.ServerStartingSecurity   = 1.5;
            BitNodeMultipliers.ScriptHackMoney          = 0.5;
            BitNodeMultipliers.CompanyWorkMoney         = 0.5;
            BitNodeMultipliers.CrimeMoney               = 0.5;
            BitNodeMultipliers.InfiltrationMoney        = 0.5;
            BitNodeMultipliers.CorporationValuation     = 0.2;
            BitNodeMultipliers.HacknetNodeMoney         = 0.2;
            BitNodeMultipliers.FactionPassiveRepGain    = 0;
            BitNodeMultipliers.HackExpGain              = 0.25;
            break;
        case 8: //Ghost of Wall Street
            BitNodeMultipliers.ScriptHackMoney          = 0;
            BitNodeMultipliers.ManualHackMoney          = 0;
            BitNodeMultipliers.CompanyWorkMoney         = 0;
            BitNodeMultipliers.CrimeMoney               = 0;
            BitNodeMultipliers.HacknetNodeMoney         = 0;
            BitNodeMultipliers.InfiltrationMoney        = 0;
            BitNodeMultipliers.RepToDonateToFaction     = 0;
            BitNodeMultipliers.CorporationValuation     = 0;
            BitNodeMultipliers.CodingContractMoney      = 0;
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
            BitNodeMultipliers.CorporationValuation     = 0.01;
            break;
        case 12: //The Recursion
            var sf12Lvl = 0;
            for (var i = 0; i < Player.sourceFiles.length; i++) {
                if (Player.sourceFiles[i].n === 12) {
                    sf12Lvl = Player.sourceFiles[i].lvl;
                }
            }
            var inc = Math.pow(1.02, sf12Lvl);
            var dec = 1/inc;
            BitNodeMultipliers.HackingLevelMultiplier = dec;

            BitNodeMultipliers.ServerMaxMoney         = dec;
            BitNodeMultipliers.ServerStartingMoney    = dec;
            BitNodeMultipliers.ServerGrowthRate       = dec;
            BitNodeMultipliers.ServerWeakenRate       = dec;

            //Does not scale, otherwise security might start at 300+
            BitNodeMultipliers.ServerStartingSecurity = 1.5;

            BitNodeMultipliers.ManualHackMoney  = dec;
            BitNodeMultipliers.ScriptHackMoney  = dec;
            BitNodeMultipliers.CompanyWorkMoney = dec;
            BitNodeMultipliers.CrimeMoney       = dec;
            BitNodeMultipliers.HacknetNodeMoney = dec;

            BitNodeMultipliers.CompanyWorkExpGain = dec;
            BitNodeMultipliers.ClassGymExpGain    = dec;
            BitNodeMultipliers.FactionWorkExpGain = dec;
            BitNodeMultipliers.HackExpGain        = dec;
            BitNodeMultipliers.CrimeExpGain       = dec;

            BitNodeMultipliers.FactionWorkRepGain    = dec;
            BitNodeMultipliers.FactionPassiveRepGain = dec;
            BitNodeMultipliers.RepToDonateToFaction  = inc;

            BitNodeMultipliers.AugmentationRepCost   = inc;
            BitNodeMultipliers.AugmentationMoneyCost = inc;

            BitNodeMultipliers.InfiltrationMoney = dec;
            BitNodeMultipliers.InfiltrationRep   = dec;

            BitNodeMultipliers.CorporationValuation = dec;

            BitNodeMultipliers.BladeburnerRank      = dec;
            BitNodeMultipliers.BladeburnerSkillCost = inc;
            break;
        default:
            console.log("WARNING: Player.bitNodeN invalid");
            break;
    }
}

export {initBitNodes,
        BitNodes,
        initBitNodeMultipliers};
