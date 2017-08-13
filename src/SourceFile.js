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

SourceFiles = {
    SourceFile1:    new SourceFile(1, "This Source-File lets the player start with 32GB of RAM on his/her " +
                                      "home computer. It also increases all of the player's multipliers by:<br><br>" +
                                      "Level 1: 16%<br>" +
                                      "Level 2: 24%<br>" +
                                      "Level 3: 28%"),
    SourceFile2:    new SourceFile(2, "This Source-File increases the player's crime success rate, crime money, and charisma " +
                                      "multipliers by:<br><br>" +
                                      "Level 1: 20%<br>" +
                                      "Level 2: 30%<br>" +
                                      "Level 3: 35%"),
    SourceFile3:    new SourceFile(3),
    SourceFile4:    new SourceFile(4),
    SourceFile5:    new SourceFile(5),
    SourceFile6:    new SourceFile(6),
    SourceFile7:    new SourceFile(7),
    SourceFile8:    new SourceFile(8),
    SourceFile9:    new SourceFile(9),
    SourceFile10:   new SourceFile(10),
    SourceFile11:   new SourceFile(11),
    SourceFile12:   new SourceFile(12),
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
        default:
            console.log("ERROR: Invalid source file number: " + srcFile.n);
            break;
    }

    sourceFileObject.owned = true;
}

PlayerObject.prototype.reapplyAllSourceFiles = function() {
    console.log("Re-applying source files");
    //Will always be called after reapplyAllAugmentations() so multipliers do not have to be reset
    //this.resetMultipliers();

    for (i = 0; i < this.sourceFiles.length; ++i) {
        var srcFileKey = "SourceFile" + this.sourceFiles[i].n;
        var sourceFileObject = SourceFiles[srcFileKey];
        if (sourceFileObject == null) {
            console.log("ERROR: Invalid source file number: " + this.sourceFiles[i].n);
            continue;
        }
        applySourceFile(this.sourceFiles[i]);
    }
}
