import { IMap } from "../../types";
import { CONSTANTS } from "../../Constants";

import { IPlayer } from "../IPlayer";

export const calculateEntropy = (player: IPlayer, stacks = 1): IMap<number> => {
  const multipliers: Record<string, number> = {
    hacking_chance: player.mults.hacking_chance,
    hacking_speed: player.mults.hacking_speed,
    hacking_money: player.mults.hacking_money,
    hacking_grow: player.mults.hacking_grow,

    hacking: player.mults.hacking,
    strength: player.mults.strength,
    defense: player.mults.defense,
    dexterity: player.mults.dexterity,
    agility: player.mults.agility,
    charisma: player.mults.charisma,

    hacking_exp: player.mults.hacking_exp,
    strength_exp: player.mults.strength_exp,
    defense_exp: player.mults.defense_exp,
    dexterity_exp: player.mults.dexterity_exp,
    agility_exp: player.mults.agility_exp,
    charisma_exp: player.mults.charisma_exp,

    company_rep: player.mults.company_rep,
    faction_rep: player.mults.faction_rep,

    crime_money: player.mults.crime_money,
    crime_success: player.mults.crime_success,

    hacknet_node_money: player.mults.hacknet_node_money,
    hacknet_node_purchase_cost: player.mults.hacknet_node_purchase_cost,
    hacknet_node_ram_cost: player.mults.hacknet_node_ram_cost,
    hacknet_node_core_cost: player.mults.hacknet_node_core_cost,
    hacknet_node_level_cost: player.mults.hacknet_node_level_cost,

    work_money: player.mults.work_money,

    bladeburner_max_stamina: player.mults.bladeburner_max_stamina,
    bladeburner_stamina_gain: player.mults.bladeburner_stamina_gain,
    bladeburner_analysis: player.mults.bladeburner_analysis,
    bladeburner_success_chance: player.mults.bladeburner_success_chance,
  };

  for (const [mult, val] of Object.entries(multipliers)) {
    multipliers[mult] = val * CONSTANTS.EntropyEffect ** stacks;
  }

  return multipliers;
};
