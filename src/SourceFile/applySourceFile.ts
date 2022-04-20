import { PlayerOwnedSourceFile } from "./PlayerOwnedSourceFile";
import { SourceFiles } from "./SourceFiles";

import { Player } from "../Player";

export function applySourceFile(srcFile: PlayerOwnedSourceFile): void {
  const srcFileKey = "SourceFile" + srcFile.n;
  const sourceFileObject = SourceFiles[srcFileKey];
  if (sourceFileObject == null) {
    console.error(`Invalid source file number: ${srcFile.n}`);
    return;
  }

  switch (srcFile.n) {
    case 1: {
      // The Source Genesis
      let mult = 0;
      for (let i = 0; i < srcFile.lvl; ++i) {
        mult += 16 / Math.pow(2, i);
      }
      const incMult = 1 + mult / 100;
      const decMult = 1 - mult / 100;
      Player.mults.hacking_chance *= incMult;
      Player.mults.hacking_speed *= incMult;
      Player.mults.hacking_money *= incMult;
      Player.mults.hacking_grow *= incMult;
      Player.mults.hacking *= incMult;
      Player.mults.strength *= incMult;
      Player.mults.defense *= incMult;
      Player.mults.dexterity *= incMult;
      Player.mults.agility *= incMult;
      Player.mults.charisma *= incMult;
      Player.mults.hacking_exp *= incMult;
      Player.mults.strength_exp *= incMult;
      Player.mults.defense_exp *= incMult;
      Player.mults.dexterity_exp *= incMult;
      Player.mults.agility_exp *= incMult;
      Player.mults.charisma_exp *= incMult;
      Player.mults.company_rep *= incMult;
      Player.mults.faction_rep *= incMult;
      Player.mults.crime_money *= incMult;
      Player.mults.crime_success *= incMult;
      Player.mults.hacknet_node_money *= incMult;
      Player.mults.hacknet_node_purchase_cost *= decMult;
      Player.mults.hacknet_node_ram_cost *= decMult;
      Player.mults.hacknet_node_core_cost *= decMult;
      Player.mults.hacknet_node_level_cost *= decMult;
      Player.mults.work_money *= incMult;
      break;
    }
    case 2: {
      // Rise of the Underworld
      let mult = 0;
      for (let i = 0; i < srcFile.lvl; ++i) {
        mult += 24 / Math.pow(2, i);
      }
      const incMult = 1 + mult / 100;
      Player.mults.crime_money *= incMult;
      Player.mults.crime_success *= incMult;
      Player.mults.charisma *= incMult;
      break;
    }
    case 3: {
      // Corporatocracy
      let mult = 0;
      for (let i = 0; i < srcFile.lvl; ++i) {
        mult += 8 / Math.pow(2, i);
      }
      const incMult = 1 + mult / 100;
      Player.mults.charisma *= incMult;
      Player.mults.work_money *= incMult;
      break;
    }
    case 4: {
      // The Singularity
      // No effects, just gives access to Singularity functions
      break;
    }
    case 5: {
      // Artificial Intelligence
      let mult = 0;
      for (let i = 0; i < srcFile.lvl; ++i) {
        mult += 8 / Math.pow(2, i);
      }
      const incMult = 1 + mult / 100;
      Player.mults.hacking_chance *= incMult;
      Player.mults.hacking_speed *= incMult;
      Player.mults.hacking_money *= incMult;
      Player.mults.hacking_grow *= incMult;
      Player.mults.hacking *= incMult;
      Player.mults.hacking_exp *= incMult;
      break;
    }
    case 6: {
      // Bladeburner
      let mult = 0;
      for (let i = 0; i < srcFile.lvl; ++i) {
        mult += 8 / Math.pow(2, i);
      }
      const incMult = 1 + mult / 100;
      Player.mults.strength_exp *= incMult;
      Player.mults.defense_exp *= incMult;
      Player.mults.dexterity_exp *= incMult;
      Player.mults.agility_exp *= incMult;
      Player.mults.strength *= incMult;
      Player.mults.defense *= incMult;
      Player.mults.dexterity *= incMult;
      Player.mults.agility *= incMult;
      break;
    }
    case 7: {
      // Bladeburner 2079
      let mult = 0;
      for (let i = 0; i < srcFile.lvl; ++i) {
        mult += 8 / Math.pow(2, i);
      }
      const incMult = 1 + mult / 100;
      Player.bladeburner_max_stamina_mult *= incMult;
      Player.bladeburner_stamina_gain_mult *= incMult;
      Player.bladeburner_analysis_mult *= incMult;
      Player.bladeburner_success_chance_mult *= incMult;
      break;
    }
    case 8: {
      // Ghost of Wall Street
      let mult = 0;
      for (let i = 0; i < srcFile.lvl; ++i) {
        mult += 12 / Math.pow(2, i);
      }
      const incMult = 1 + mult / 100;
      Player.mults.hacking_grow *= incMult;
      break;
    }
    case 9: {
      // Hacktocracy
      let mult = 0;
      for (let i = 0; i < srcFile.lvl; ++i) {
        mult += 8 / Math.pow(2, i);
      }
      const incMult = 1 + mult / 100;
      const decMult = 1 - mult / 100;
      Player.mults.hacknet_node_core_cost *= decMult;
      Player.mults.hacknet_node_level_cost *= decMult;
      Player.mults.hacknet_node_money *= incMult;
      Player.mults.hacknet_node_purchase_cost *= decMult;
      Player.mults.hacknet_node_ram_cost *= decMult;
      break;
    }
    case 10: {
      // Digital Carbon
      // No effects, just grants sleeves
      break;
    }
    case 11: {
      // The Big Crash
      let mult = 0;
      for (let i = 0; i < srcFile.lvl; ++i) {
        mult += 32 / Math.pow(2, i);
      }
      const incMult = 1 + mult / 100;
      Player.mults.work_money *= incMult;
      Player.mults.company_rep *= incMult;
      break;
    }
    case 12: // The Recursion
      // Grants neuroflux.
      break;
    case 13: // They're Lunatics
      // Grants more space on Stanek's Gift.
      break;
    default:
      console.error(`Invalid source file number: ${srcFile.n}`);
      break;
  }

  sourceFileObject.owned = true;
}
