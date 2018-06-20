import {Player} from "./Player.js";
import {BitNode, BitNodes} from "./BitNode.js";
import {StatModifier} from "./StatModifier.js";

/* SourceFile.js */
//Each SourceFile corresponds to a BitNode with the same number
function SourceFile(number, modifierFunc, info="") {
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
    this.modifierFunc = modifierFunc;
}

let SourceFiles = {};
function initSourceFiles() {
    SourceFiles = {};
    SourceFiles["SourceFile1"] = new SourceFile(1, sf1Modifier, "This Source-File lets the player start with 32GB of RAM on his/her " +
                                      "home computer. It also increases all of the player's multipliers by:<br><br>" +
                                      "Level 1: 16%<br>" +
                                      "Level 2: 24%<br>" +
                                      "Level 3: 28%");
    SourceFiles["SourceFile2"] = new SourceFile(2, sf2Modifier, "This Source-File increases the player's crime success rate, crime money, and charisma " +
                                      "multipliers by:<br><br>" +
                                      "Level 1: 20%<br>" +
                                      "Level 2: 30%<br>" +
                                      "Level 3: 35%");
    SourceFiles["SourceFile3"] = new SourceFile(3, sf3Modifier, "This Source-File lets you create corporations on other BitNodes (although " +
                                                  "some BitNodes will disable this mechanic). This Source-File also increases your charisma and company salary multipliers by:<br>" +
                                                  "Level 1: 8%<br>" +
                                                  "Level 2: 12%<br>" +
                                                  "Level 3: 14%");
    SourceFiles["SourceFile4"] = new SourceFile(4, noModifier, "This Source-File lets you access and use the Singularity Functions in every BitNode. Every " +
                                        "level of this Source-File opens up more of the Singularity Functions you can use.");
    SourceFiles["SourceFile5"] = new SourceFile(5, sf5Modifier, "This Source-File grants a special new stat called Intelligence. Intelligence " +
                                                   "is unique because it is permanent and persistent (it never gets reset back to 1). However, " +
                                                   "gaining Intelligence experience is much slower than other stats, and it is also hidden (you won't " +
                                                   "know when you gain experience and how much). Higher Intelligence levels will boost your production " +
                                                   "for many actions in the game. In addition, this Source-File will unlock the getBitNodeMultipliers() " +
                                                   "Netscript function, and will raise all of your hacking-related multipliers by:<br><br> " +
                                                   "Level 1: 4%<br>" +
                                                   "Level 2: 6%<br>" +
                                                   "Level 3: 7%");
    SourceFiles["SourceFile6"] = new SourceFile(6, sf6Modifier, "This Source-File allows you to access the NSA's Bladeburner Division in other " +
                                                   "BitNodes. In addition, this Source-File will raise the experience gain rate of all your combat stats by:<br><br>" +
                                                   "Level 1: 8%<br>" +
                                                   "Level 2: 12%<br>" +
                                                   "Level 3: 14%");
    SourceFiles["SourceFile7"] = new SourceFile(7);
    SourceFiles["SourceFile8"] = new SourceFile(8, sf8Modifier, "This Source-File grants the following benefits:<br><br>" +
                                                   "Level 1: Permanent access to WSE and TIX API<br>" +
                                                   "Level 2: Ability to short stocks in other BitNodes<br>" +
                                                   "Level 3: Ability to use limit/stop orders in other BitNodes<br><br>" +
                                                   "This Source-File also increases your hacking growth multipliers by: " +
                                                   "<br>Level 1: 8%<br>Level 2: 12%<br>Level 3: 14%");
    SourceFiles["SourceFile9"] = new SourceFile(9);
    SourceFiles["SourceFile10"] = new SourceFile(10);
    SourceFiles["SourceFile11"] = new SourceFile(11, sf11Modifier, "This Source-File makes it so that company favor increases BOTH the player's salary and reputation gain rate " +
                                                     "at that company by 1% per favor (rather than just the reputation gain). This Source-File also " +
                                                     " increases the player's company salary and reputation gain multipliers by:<br><br>" +
                                                     "Level 1: 24%<br>" +
                                                     "Level 2: 36%<br>" +
                                                     "Level 3: 42%<br>");
    SourceFiles["SourceFile12"] = new SourceFile(12, sf12Modifier, "This Source-File increases all your multipliers by 1% per level");
}

function dimishingReturnBoost(lvl, base) {
    var mult = 0;
    for (var i = 0; i < lvl; ++i) {
        mult += (base / (Math.pow(2, i)));
    }
    return mult;
}

function noModifier(lvl) {
    return new StatModifier();
}

function sf1Modifier(lvl) {
    const mult = dimishingReturnBoost(lvl, 16);
    const incMult = 1 + (mult / 100);
    const decMult = 1 - (mult / 100);
    return new StatModifier({
        homeRam: 32,
        hacking_chance_mult: incMult,
        hacking_speed_mult: incMult,
        hacking_money_mult: incMult,
        hacking_grow_mult: incMult,
        hacking_mult: incMult,
        strength_mult: incMult,
        defense_mult: incMult,
        dexterity_mult: incMult,
        agility_mult: incMult,
        charisma_mult: incMult,
        hacking_exp_mult: incMult,
        strength_exp_mult: incMult,
        defense_exp_mult: incMult,
        dexterity_exp_mult: incMult,
        agility_exp_mult: incMult,
        charisma_exp_mult: incMult,
        company_rep_mult: incMult,
        faction_rep_mult: incMult,
        crime_money_mult: incMult,
        crime_success_mult: incMult,
        hacknet_node_money_mult: incMult,
        hacknet_node_purchase_cost_mult: decMult,
        hacknet_node_ram_cost_mult: decMult,
        hacknet_node_core_cost_mult: decMult,
        hacknet_node_level_cost_mult: decMult,
        work_money_mult: incMult
    });
}

function sf2Modifier(lvl) {
    const mult = dimishingReturnBoost(lvl, 20);
    const incMult = 1 + (mult / 100);
    return new StatModifier({
        crime_money_mult: incMult,
        crime_success_mult: incMult,
        charisma_mult: incMult
    });
}

function sf3Modifier(lvl) {
    const mult = dimishingReturnBoost(lvl, 8);
    const incMult = 1 + (mult / 100);
    return new StatModifier({
        charisma_mult: incMult,
        work_money_mult: incMult
    });
}

function sf5Modifier(lvl) {
    const mult = dimishingReturnBoost(lvl, 4);
    const incMult = 1 + (mult / 100);
    return new StatModifier({
        hacking_chance_mult: incMult,
        hacking_speed_mult: incMult,
        hacking_money_mult: incMult,
        hacking_grow_mult: incMult,
        hacking_mult: incMult,
        hacking_exp_mult: incMult
    });
}

function sf6Modifier(lvl) {
    const mult = dimishingReturnBoost(lvl, 8);
    const incMult = 1 + (mult / 100);
    return new StatModifier({
        strength_exp_mult: incMult,
        defense_exp_mult: incMult,
        dexterity_exp_mult: incMult,
        agility_exp_mult: incMult
    });
}

function sf8Modifier(lvl) {
    const mult = dimishingReturnBoost(lvl, 8);
    const incMult = 1 + (mult / 100);
    return new StatModifier({
        hacking_grow_mult: incMult,
        hasWseAccount: true,
        hasTixApiAccess: true
    });
}

function sf11Modifier(lvl) {
    const mult = dimishingReturnBoost(lvl, 24);
    const incMult = 1 + (mult / 100);
    return new StatModifier({
        work_money_mult: incMult,
        company_rep_mult: incMult
    });
}

function sf12Modifier(lvl) {
    const inc = Math.pow(1.01, lvl);
    const dec = Math.pow(0.99, lvl);

    return new StatModifier({
        hacking_chance_mult: inc,
        hacking_speed_mult: inc,
        hacking_money_mult: inc,
        hacking_grow_mult: inc,
        hacking_mult: inc,

        strength_mult: inc,
        defense_mult: inc,
        dexterity_mult: inc,
        agility_mult: inc,
        charisma_mult: inc,

        hacking_exp_mult: inc,
        strength_exp_mult: inc,
        defense_exp_mult: inc,
        dexterity_exp_mult: inc,
        agility_exp_mult: inc,
        charisma_exp_mult: inc,

        company_rep_mult: inc,
        faction_rep_mult: inc,

        crime_money_mult: inc,
        crime_success_mult: inc,

        hacknet_node_money_mult: inc,
        hacknet_node_purchase_cost_mult: dec,
        hacknet_node_ram_cost_mult: dec,
        hacknet_node_core_cost_mult: dec,
        hacknet_node_level_cost_mult: dec,

        work_money_mult: inc
    });
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
        case 3: //Corporatocracy
            var mult = 0;
            for (var i = 0; i < srcFile.lvl; ++i) {
                mult += (8 / (Math.pow(2, i)));
            }
            var incMult = 1 + (mult / 100);
            Player.charisma_mult    *= incMult;
            Player.work_money_mult  *= incMult;
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
            Player.hacking_mult         *= incMult;
            Player.hacking_exp_mult     *= incMult;
            break;
        case 6: //Bladeburner
            var mult = 0;
            for (var i = 0; i < srcFile.lvl; ++i) {
                mult += (8 / (Math.pow(2, i)));
            }
            var incMult = 1 + (mult / 100);
            Player.strength_exp_mult        *= incMult;
            Player.defense_exp_mult         *= incMult;
            Player.dexterity_exp_mult       *= incMult;
            Player.agility_exp_mult         *= incMult;
            break;
        case 8: //Ghost of Wall Street
            var mult = 0;
            for (var i = 0; i < srcFile.lvl; ++i) {
                mult += (8 / (Math.pow(2, i)));
            }
            var incMult = 1 + (mult / 100);
            Player.hacking_grow_mult    *= incMult;
            break;
        case 11: //The Big Crash
            var mult = 0;
            for (var i = 0; i < srcFile.lvl; ++i) {
                mult += (24 / (Math.pow(2, i)));
            }
            var incMult = 1 + (mult / 100);
            Player.work_money_mult    *= incMult;
            Player.company_rep_mult   *= incMult;
            break;
        case 12: //The testing ground
            const inc = Math.pow(1.01, srcFile.lvl);
            const dec = Math.pow(0.99, srcFile.lvl);

            Player.hacking_chance_mult *= inc;
            Player.hacking_speed_mult  *= inc;
            Player.hacking_money_mult  *= inc;
            Player.hacking_grow_mult   *= inc;
            Player.hacking_mult        *= inc;

            Player.strength_mult       *= inc;
            Player.defense_mult        *= inc;
            Player.dexterity_mult      *= inc;
            Player.agility_mult        *= inc;
            Player.charisma_mult       *= inc;

            Player.hacking_exp_mult    *= inc;
            Player.strength_exp_mult   *= inc;
            Player.defense_exp_mult    *= inc;
            Player.dexterity_exp_mult  *= inc;
            Player.agility_exp_mult    *= inc;
            Player.charisma_exp_mult   *= inc;

            Player.company_rep_mult    *= inc;
            Player.faction_rep_mult    *= inc;

            Player.crime_money_mult    *= inc;
            Player.crime_success_mult  *= inc;

            Player.hacknet_node_money_mult            *= inc;
            Player.hacknet_node_purchase_cost_mult    *= dec;
            Player.hacknet_node_ram_cost_mult         *= dec;
            Player.hacknet_node_core_cost_mult        *= dec;
            Player.hacknet_node_level_cost_mult       *= dec;

            Player.work_money_mult    *= inc;
        default:
            console.log("ERROR: Invalid source file number: " + srcFile.n);
            break;
    }

    sourceFileObject.owned = true;
}

export {SourceFiles, PlayerOwnedSourceFile, applySourceFile, initSourceFiles};
