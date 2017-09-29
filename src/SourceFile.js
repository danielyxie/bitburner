import {Player} from "./Player.js";
import {BitNode, BitNodes} from "./BitNode.js";

/* SourceFile.js */
//Each SourceFile corresponds to a BitNode with the same number
function SourceFile(number, info="") {
    var bitnodeKey = "BitNode" + number;
    var bitnode = BitNodes[bitnodeKey];
    if (bitnode == null) {
        throw new Error("Invalid Bit Node for this Source File");
    }

    this.n = number;
    this.name = "Source-File " + number + ": " + bitnode.name;
    this.lvl = 1;
    this.info = info;
    this.owned = false;
}

let SourceFiles = {};
function initSourceFiles() {
    SourceFiles = {};
    SourceFiles["SourceFile1"] = new SourceFile(1, "This Source-File lets the player start with 32GB of RAM on his/her " +
                                      "home computer. It also increases all of the player's multipliers by:<br><br>" +
                                      "Level 1: 16%<br>" +
                                      "Level 2: 24%<br>" +
                                      "Level 3: 28%");
    SourceFiles["SourceFile2"] = new SourceFile(2, "This Source-File increases the player's crime success rate, crime money, and charisma " +
                                      "multipliers by:<br><br>" +
                                      "Level 1: 20%<br>" +
                                      "Level 2: 30%<br>" +
                                      "Level 3: 35%");
    SourceFiles["SourceFile3"] = new SourceFile(3);
    SourceFiles["SourceFile4"] = new SourceFile(4, "This Source-File lets you access and use the Singularity Functions in every BitNode. Every " +
                                        "level of this Source-File opens up more of the Singularity Functions you can use.");
    SourceFiles["SourceFile5"] = new SourceFile(5, "This Source-File grants a special new stat called Intelligence. Intelligence " +
                                                   "is unique because it is permanent and persistent (it never gets reset back to 1). However, " +
                                                   "gaining Intelligence experience is much slower than other stats, and it is also hidden (you won't " +
                                                   "know when you gain experience and how much). Higher Intelligence levels will boost your production " +
                                                   "for many actions in the game. In addition, this Source-File will unlock the getBitNodeMultipliers() " +
                                                   "Netscript function, and will raise all of your hacking-related multipliers by:<br><br> " +
                                                   "Level 1: 4%<br>" +
                                                   "Level 2: 6%<br>" +
                                                   "Level 3: 7%");
    SourceFiles["SourceFile6"] = new SourceFile(6);
    SourceFiles["SourceFile7"] = new SourceFile(7);
    SourceFiles["SourceFile8"] = new SourceFile(8);
    SourceFiles["SourceFile9"] = new SourceFile(9);
    SourceFiles["SourceFile10"] = new SourceFile(10);
    SourceFiles["SourceFile11"] = new SourceFile(11, "This Source-File increases the player's company salary and reputation gain multipliers by:<br><br>" +
                                        "Level 1: 60%<br>" +
                                        "Level 2: 90%<br>" +
                                        "Level 3: 105%<br>");
    SourceFiles["SourceFile12"] = new SourceFile(12);
}

function PlayerOwnedSourceFile(number, level) {
    this.n = number;
    this.lvl = level;
}

//Takes in a PlayerOwnedSourceFile as the "srcFile" argument
function applySourceFile(srcFile) {
    var srcFileKey = "SourceFile" + srcFile.n;
    var sourceFileObject = SourceFiles[srcFileKey];
    if (sourceFileObject == null) {
        console.log("ERROR: Invalid source file number: " + srcFile.n);
        return;
    }

    switch(srcFile.n) {
        case 1: // The Source Genesis
            var mult = 0;
            for (var i = 0; i < srcFile.lvl; ++i) {
                mult += (16 / (Math.pow(2, i)));
            }
            var incMult = 1 + (mult / 100);
            var decMult = 1 - (mult / 100);
            Player.hacking_chance_mult *= incMult;
            Player.hacking_speed_mult  *= incMult;
            Player.hacking_money_mult  *= incMult;
            Player.hacking_grow_mult   *= incMult;
            Player.hacking_mult        *= incMult;
            Player.strength_mult       *= incMult;
            Player.defense_mult        *= incMult;
            Player.dexterity_mult      *= incMult;
            Player.agility_mult        *= incMult;
            Player.charisma_mult       *= incMult;
            Player.hacking_exp_mult    *= incMult;
            Player.strength_exp_mult   *= incMult;
            Player.defense_exp_mult    *= incMult;
            Player.dexterity_exp_mult  *= incMult;
            Player.agility_exp_mult    *= incMult;
            Player.charisma_exp_mult   *= incMult;
            Player.company_rep_mult    *= incMult;
            Player.faction_rep_mult    *= incMult;
            Player.crime_money_mult    *= incMult;
            Player.crime_success_mult  *= incMult;
            Player.hacknet_node_money_mult            *= incMult;
            Player.hacknet_node_purchase_cost_mult    *= decMult;
            Player.hacknet_node_ram_cost_mult         *= decMult;
            Player.hacknet_node_core_cost_mult        *= decMult;
            Player.hacknet_node_level_cost_mult       *= decMult;
            Player.work_money_mult    *= incMult;
            break;
        case 2: //Rise of the Underworld
            var mult = 0;
            for (var i = 0; i < srcFile.lvl; ++i) {
                mult += (20 / (Math.pow(2, i)));
            }
            var incMult = 1 + (mult / 100);
            Player.crime_money_mult    *= incMult;
            Player.crime_success_mult  *= incMult;
            Player.charisma_mult       *= incMult;
            break;
        case 4: //The Singularity
            //No effects, just gives access to Singularity functions
            break;
        case 5: //Artificial Intelligence
            var mult = 0;
            for (var i = 0; i < srcFile.lvl; ++i) {
                mult += (4 / (Math.pow(2, i)));
            }
            var incMult = 1 + (mult / 100);
            Player.hacking_chance_mult  *= incMult;
            Player.hacking_speed_mult   *= incMult;
            Player.hacking_money_mult   *= incMult;
            Player.hacking_grow_mult    *= incMult;
            break;
        case 11: //The Big Crash
            var mult = 0;
            for (var i = 0; i < srcFile.lvl; ++i) {
                mult += (60 / (Math.pow(2, i)));
            }
            var incMult = 1 + (mult / 100);
            Player.work_money_mult    *= incMult;
            Player.company_rep_mult   *= incMult;
            break;
        default:
            console.log("ERROR: Invalid source file number: " + srcFile.n);
            break;
    }

    sourceFileObject.owned = true;
}

export {SourceFiles, PlayerOwnedSourceFile, applySourceFile, initSourceFiles};
