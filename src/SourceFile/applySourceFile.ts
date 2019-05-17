import { PlayerOwnedSourceFile } from "./PlayerOwnedSourceFile";
import { SourceFiles } from "./SourceFiles";

import { Player } from "../Player";

export function applySourceFile(srcFile: PlayerOwnedSourceFile) {
    const srcFileKey = "SourceFile" + srcFile.n;
    const sourceFileObject = SourceFiles[srcFileKey];
    if (sourceFileObject == null) {
        console.error(`Invalid source file number: ${srcFile.n}`);
        return;
    }

    switch (srcFile.n) {
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
        case 2: // Rise of the Underworld
            var mult = 0;
            for (var i = 0; i < srcFile.lvl; ++i) {
                mult += (24 / (Math.pow(2, i)));
            }
            var incMult = 1 + (mult / 100);
            Player.crime_money_mult    *= incMult;
            Player.crime_success_mult  *= incMult;
            Player.charisma_mult       *= incMult;
            break;
        case 3: // Corporatocracy
            var mult = 0;
            for (var i = 0; i < srcFile.lvl; ++i) {
                mult += (8 / (Math.pow(2, i)));
            }
            var incMult = 1 + (mult / 100);
            Player.charisma_mult    *= incMult;
            Player.work_money_mult  *= incMult;
            break;
        case 4: // The Singularity
            // No effects, just gives access to Singularity functions
            break;
        case 5: // Artificial Intelligence
            var mult = 0;
            for (var i = 0; i < srcFile.lvl; ++i) {
                mult += (8 / (Math.pow(2, i)));
            }
            var incMult = 1 + (mult / 100);
            Player.hacking_chance_mult  *= incMult;
            Player.hacking_speed_mult   *= incMult;
            Player.hacking_money_mult   *= incMult;
            Player.hacking_grow_mult    *= incMult;
            Player.hacking_mult         *= incMult;
            Player.hacking_exp_mult     *= incMult;
            break;
        case 6: // Bladeburner
            var mult = 0;
            for (var i = 0; i < srcFile.lvl; ++i) {
                mult += (8 / (Math.pow(2, i)));
            }
            var incMult = 1 + (mult / 100);
            Player.strength_exp_mult        *= incMult;
            Player.defense_exp_mult         *= incMult;
            Player.dexterity_exp_mult       *= incMult;
            Player.agility_exp_mult         *= incMult;
            Player.strength_mult            *= incMult;
            Player.defense_mult             *= incMult;
            Player.dexterity_mult           *= incMult;
            Player.agility_mult             *= incMult;
            break;
        case 7: // Bladeburner 2079
            var mult = 0;
            for (var i = 0; i < srcFile.lvl; ++i) {
                mult += (8 / (Math.pow(2, i)));
            }
            var incMult = 1 + (mult / 100);
            Player.bladeburner_max_stamina_mult     *= incMult;
            Player.bladeburner_stamina_gain_mult    *= incMult;
            Player.bladeburner_analysis_mult        *= incMult;
            Player.bladeburner_success_chance_mult  *= incMult;
            break;
        case 8: // Ghost of Wall Street
            var mult = 0;
            for (var i = 0; i < srcFile.lvl; ++i) {
                mult += (12 / (Math.pow(2, i)));
            }
            var incMult = 1 + (mult / 100);
            Player.hacking_grow_mult    *= incMult;
            break;
        case 9: // Hacktocracy
            // This has non-multiplier effects
            break;
        case 10: // Digital Carbon
            // No effects, just grants sleeves
            break;
        case 11: // The Big Crash
            var mult = 0;
            for (var i = 0; i < srcFile.lvl; ++i) {
                mult += (32 / (Math.pow(2, i)));
            }
            var incMult = 1 + (mult / 100);
            Player.work_money_mult    *= incMult;
            Player.company_rep_mult   *= incMult;
            break;
        case 12: // The Recursion
            var inc = Math.pow(1.01, srcFile.lvl);
            var dec = Math.pow(0.99, srcFile.lvl);

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
            break;
        default:
            console.log("ERROR: Invalid source file number: " + srcFile.n);
            break;
    }

    sourceFileObject.owned = true;
}
